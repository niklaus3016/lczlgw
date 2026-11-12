import '@wangeditor/editor/dist/css/style.css';
import { useEffect, useRef, useState } from 'react';
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { newsApi, newsCategoryApi, uploadImage, type NewsItem, type TaxonomyItem } from '../api';
import ImageUpload from '../components/ImageUpload';
import { useToast } from '../components/Toast';

interface FormState {
  title: string;
  summary: string;
  cover: string;
  category: string;
  author: string;
  publishedAt: string;
}

export default function NewsEditPage({ id, onBack }: { id: number | 'new'; onBack: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>({
    title: '',
    summary: '',
    cover: '',
    category: '',
    author: '丽呈智旅',
    publishedAt: new Date().toLocaleDateString('sv-SE'),
  });
  const [content, setContent] = useState('');
  // 分类可选项来自「分类管理」维护的受控词表
  const [categories, setCategories] = useState<TaxonomyItem[]>([]);
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  // 用 ref 保存编辑器实例，仅在组件卸载时销毁；
  // 若把 editor 作为 effect 依赖，状态变化会反复销毁/重建编辑器，导致正文编辑框持续闪烁
  const editorRef = useRef<IDomEditor | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<'draft' | 'published' | null>(null);
  const [loaded, setLoaded] = useState(id === 'new');

  // 分类下拉数据
  useEffect(() => {
    newsCategoryApi.list().then(setCategories).catch(() => {});
  }, []);

  // 编辑已有新闻时拉取详情（含正文）
  useEffect(() => {
    if (id === 'new') return;
    newsApi
      .detail(id)
      .then((item: NewsItem) => {
        setForm({
          title: item.title,
          summary: item.summary || '',
          cover: item.cover || '',
          category: item.category || '',
          author: item.author || '',
          publishedAt: item.publishedAt || new Date().toLocaleDateString('sv-SE'),
        });
        setContent(item.content || '');
        setLoaded(true);
      })
      .catch((e) => toast(e instanceof Error ? e.message : '加载失败', 'error'));
  }, [id, toast]);

  // 卸载时销毁编辑器（仅在组件卸载时执行一次）
  useEffect(() => {
    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []);

  // 富文本图片/视频上传走本站上传接口
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入正文…',
    MENU_CONF: {
      uploadImage: {
        async customUpload(file: File, insertFn: (url: string, alt: string, href: string) => void) {
          try {
            const path = await uploadImage(file);
            insertFn(path, file.name, path);
          } catch {
            toast('图片上传失败', 'error');
          }
        },
      },
      uploadVideo: {
        async customUpload(file: File, insertFn: (url: string, poster: string) => void) {
          try {
            const path = await uploadImage(file);
            insertFn(path, '');
          } catch {
            toast('视频上传失败', 'error');
          }
        },
      },
    },
  };
  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: ['fullScreen'],
  };

  const save = async (status: 'draft' | 'published') => {
    if (!form.title.trim()) {
      setError('请填写标题');
      return;
    }
    if (status === 'published' && !content.replace(/<[^>]*>/g, '').trim()) {
      setError('发布前请填写正文内容');
      return;
    }
    setError('');
    setSaving(status);
    try {
      const payload = { ...form, title: form.title.trim(), content, status };
      if (id === 'new') {
        await newsApi.create(payload);
      } else {
        await newsApi.update(id, payload);
      }
      toast(status === 'published' ? '已发布' : '草稿已保存');
      onBack();
    } catch (e) {
      toast(e instanceof Error ? e.message : '保存失败', 'error');
    } finally {
      setSaving(null);
    }
  };

  const inputCls =
    'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#EE9B27]';

  if (!loaded) return <div className="text-sm text-gray-400">加载中…</div>;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#111622]">{id === 'new' ? '新建新闻' : '编辑新闻'}</h1>
        <button
          onClick={onBack}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          ← 返回列表
        </button>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm text-gray-600">
              标题 <span className="text-red-500">*</span>
            </label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm text-gray-600">摘要</label>
            <textarea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              rows={3}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">封面图</label>
            <ImageUpload
              value={form.cover}
              onChange={(p) => setForm({ ...form, cover: p })}
              maxSizeMb={2}
              hint="支持 JPG / PNG / WebP / GIF，推荐 WebP；大小需 ≤ 2MB（上传后自动转为 WebP）"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-gray-600">分类</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputCls}
              >
                <option value="">请选择分类</option>
                {form.category && !categories.some((c) => c.name === form.category) && (
                  <option value={form.category}>{form.category}（已移除）</option>
                )}
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-600">作者</label>
              <input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">发布时间</label>
              <input
                type="date"
                value={form.publishedAt}
                onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-1 block text-sm text-gray-600">正文</label>
          <div className="news-editor rounded-lg border border-gray-200" style={{ zIndex: 10 }}>
            <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="default" style={{ borderBottom: '1px solid #eee' }} />
            <Editor
              defaultConfig={editorConfig}
              value={content}
              onCreated={(ed) => {
                editorRef.current = ed;
                setEditor(ed);
              }}
              onChange={(ed) => setContent(ed.getHtml())}
              mode="default"
              style={{ height: '420px', overflowY: 'hidden' }}
            />
          </div>
        </div>

        {error && <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-500">{error}</div>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => save('draft')}
            disabled={saving !== null}
            className="rounded-lg border border-[#EE9B27] px-5 py-2 text-sm text-[#EE9B27] hover:bg-[#EE9B27]/10 disabled:opacity-50"
          >
            {saving === 'draft' ? '保存中…' : '保存草稿'}
          </button>
          <button
            onClick={() => save('published')}
            disabled={saving !== null}
            className="rounded-lg bg-[#EE9B27] px-5 py-2 text-sm text-white hover:bg-[#F5A623] disabled:opacity-50"
          >
            {saving === 'published' ? '发布中…' : '发布'}
          </button>
        </div>
      </div>
    </div>
  );
}
