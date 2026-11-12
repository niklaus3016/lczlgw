import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { bannerApi, type Banner } from '../api';
import ConfirmDialog from '../components/ConfirmDialog';
import ImageUpload from '../components/ImageUpload';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

interface FormState {
  title: string;
  subtitle: string;
  image: string;
  link: string;
  sortOrder: number;
  enabled: boolean;
}

const emptyForm: FormState = { title: '', subtitle: '', image: '', link: '', sortOrder: 0, enabled: true };

export default function BannersPage() {
  const { toast } = useToast();
  const [list, setList] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Banner | 'new' | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Banner | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setList(await bannerApi.list());
    } catch (e) {
      toast(e instanceof Error ? e.message : '加载失败', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const openEdit = (b: Banner | 'new') => {
    setEditing(b);
    setFormError('');
    setForm(
      b === 'new'
        ? emptyForm
        : {
            title: b.title,
            subtitle: b.subtitle || '',
            image: b.image,
            link: b.link || '',
            sortOrder: b.sortOrder,
            enabled: b.enabled === 1,
          },
    );
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError('请填写主标题');
      return;
    }
    if (!form.image) {
      setFormError('请上传 Banner 图片');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        image: form.image,
        link: form.link.trim() || null,
        sortOrder: form.sortOrder,
        enabled: form.enabled ? 1 : 0,
      };
      if (editing === 'new') {
        await bannerApi.create(payload);
        toast('创建成功');
      } else if (editing) {
        await bannerApi.update(editing.id, payload);
        toast('保存成功');
      }
      setEditing(null);
      load();
    } catch (err) {
      toast(err instanceof Error ? err.message : '保存失败', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 上下移动调序：交换后整体提交 id 顺序
  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    const next = [...list];
    [next[index], next[target]] = [next[target], next[index]];
    setList(next);
    try {
      await bannerApi.sort(next.map((b) => b.id));
      toast('排序已更新');
    } catch (e) {
      toast(e instanceof Error ? e.message : '排序失败', 'error');
      load();
    }
  };

  const doDelete = async () => {
    if (!deleting) return;
    setDeletingLoading(true);
    try {
      await bannerApi.remove(deleting.id);
      toast('已删除');
      setDeleting(null);
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : '删除失败', 'error');
    } finally {
      setDeletingLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#111622]">Banner 管理</h1>
        <button
          onClick={() => openEdit('new')}
          className="rounded-lg bg-[#EE9B27] px-4 py-2 text-sm text-white hover:bg-[#F5A623]"
        >
          + 新建 Banner
        </button>
      </div>

      {loading && <div className="text-sm text-gray-400">加载中…</div>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((b, i) => (
          <div key={b.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="relative h-36 bg-gray-100">
              <img src={b.image} alt={b.title} className="h-full w-full object-cover" />
              <span
                className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs ${
                  b.enabled === 1 ? 'bg-emerald-500/90 text-white' : 'bg-gray-500/80 text-white'
                }`}
              >
                {b.enabled === 1 ? '已上架' : '已下架'}
              </span>
            </div>
            <div className="p-4">
              <div className="font-medium text-[#111622]">{b.title}</div>
              <div className="mt-0.5 truncate text-xs text-gray-400">{b.subtitle || '—'}</div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded border border-gray-200 px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                    title="上移"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === list.length - 1}
                    className="rounded border border-gray-200 px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                    title="下移"
                  >
                    ↓
                  </button>
                  <span className="ml-1 text-xs text-gray-400">排序 {b.sortOrder}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => openEdit(b)} className="text-[#EE9B27] hover:underline">
                    编辑
                  </button>
                  <button onClick={() => setDeleting(b)} className="text-red-500 hover:underline">
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!loading && list.length === 0 && <div className="py-16 text-center text-gray-400">暂无 Banner</div>}

      {editing && (
        <Modal title={editing === 'new' ? '新建 Banner' : '编辑 Banner'} onClose={() => setEditing(null)} wide>
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Banner 图片 <span className="text-red-500">*</span>
              </label>
              <ImageUpload value={form.image} onChange={(p) => setForm({ ...form, image: p })} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">
                主标题 <span className="text-red-500">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#EE9B27]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">副标题</label>
              <input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#EE9B27]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm text-gray-600">跳转链接</label>
                <input
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="/hotels 或 https://…"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#EE9B27]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">排序值</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#EE9B27]"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="h-4 w-4 accent-[#EE9B27]"
              />
              上架展示
            </label>
            {formError && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-500">{formError}</div>}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#EE9B27] px-4 py-2 text-sm text-white hover:bg-[#F5A623] disabled:opacity-50"
              >
                {saving ? '保存中…' : '保存'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          message={`确定删除 Banner「${deleting.title}」吗？删除后不可恢复。`}
          onConfirm={doDelete}
          onCancel={() => setDeleting(null)}
          loading={deletingLoading}
        />
      )}
    </div>
  );
}
