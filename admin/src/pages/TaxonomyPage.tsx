import { useCallback, useEffect, useState } from 'react';
import { newsCategoryApi, type TaxonomyItem } from '../api';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';

const inputCls =
  'rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#EE9B27]';

/** 新闻分类管理（受控词表：前台筛选 Tab 与新闻编辑页下拉的唯一来源） */
export default function TaxonomyPage({ onBack }: { onBack: () => void }) {
  const { toast } = useToast();

  const [list, setList] = useState<TaxonomyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Record<number, { name: string; sortOrder: string }>>({});
  const [deleting, setDeleting] = useState<TaxonomyItem | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setList(await newsCategoryApi.list());
    } catch (e) {
      toast(e instanceof Error ? e.message : '加载失败', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const add = async () => {
    const name = newName.trim();
    if (!name) {
      toast('请填写分类名称', 'error');
      return;
    }
    setAdding(true);
    try {
      await newsCategoryApi.create(name, list.length);
      setNewName('');
      toast('分类已添加');
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : '添加失败', 'error');
    } finally {
      setAdding(false);
    }
  };

  const save = async (item: TaxonomyItem) => {
    const draft = editing[item.id];
    if (!draft) return;
    const name = draft.name.trim();
    if (!name) {
      toast('请填写分类名称', 'error');
      return;
    }
    try {
      await newsCategoryApi.update(item.id, name, Number(draft.sortOrder) || 0);
      toast('已保存');
      setEditing((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : '保存失败', 'error');
    }
  };

  const doDelete = async () => {
    if (!deleting) return;
    setDeletingLoading(true);
    try {
      await newsCategoryApi.remove(deleting.id);
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
        <h1 className="text-xl font-bold text-[#111622]">新闻分类管理</h1>
        <button
          onClick={onBack}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          ← 返回新闻管理
        </button>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="mb-4 text-sm text-gray-500">
          分类用于前台新闻栏目的筛选 Tab，删除分类不会影响已发布文章的内容。
        </p>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') add();
            }}
            placeholder="新增分类名称，如：集团动态"
            className={`${inputCls} w-64`}
          />
          <button
            onClick={add}
            disabled={adding}
            className="rounded-lg bg-[#EE9B27] px-4 py-2 text-sm text-white hover:bg-[#F5A623] disabled:opacity-50"
          >
            {adding ? '添加中…' : '+ 新增分类'}
          </button>
        </div>

        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-500">
              <th className="px-4 py-3 font-medium">名称</th>
              <th className="w-28 px-4 py-3 font-medium">排序</th>
              <th className="w-40 px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => {
              const draft = editing[item.id];
              return (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="px-4 py-2">
                    <input
                      value={draft ? draft.name : item.name}
                      onChange={(e) =>
                        setEditing((prev) => ({
                          ...prev,
                          [item.id]: {
                            name: e.target.value,
                            sortOrder: String(draft?.sortOrder ?? item.sortOrder),
                          },
                        }))
                      }
                      className={`${inputCls} w-full max-w-xs`}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={0}
                      value={draft ? draft.sortOrder : String(item.sortOrder)}
                      onChange={(e) =>
                        setEditing((prev) => ({
                          ...prev,
                          [item.id]: { name: draft?.name ?? item.name, sortOrder: e.target.value },
                        }))
                      }
                      className={`${inputCls} w-20`}
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <button
                      onClick={() => save(item)}
                      disabled={!draft}
                      className="mr-3 text-[#EE9B27] hover:underline disabled:text-gray-300 disabled:no-underline"
                    >
                      保存
                    </button>
                    <button onClick={() => setDeleting(item)} className="text-red-500 hover:underline">
                      删除
                    </button>
                  </td>
                </tr>
              );
            })}
            {!loading && list.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-gray-400">
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {loading && <div className="px-4 py-3 text-sm text-gray-400">加载中…</div>}
      </div>

      {deleting && (
        <ConfirmDialog
          message={`确定删除分类「${deleting.name}」吗？`}
          onConfirm={doDelete}
          onCancel={() => setDeleting(null)}
          loading={deletingLoading}
        />
      )}
    </div>
  );
}
