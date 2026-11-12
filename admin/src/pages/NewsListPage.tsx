import { useCallback, useEffect, useState } from 'react';
import { newsApi, type NewsItem, type NewsListResult } from '../api';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import { useToast } from '../components/Toast';

const PAGE_SIZE = 10;

export default function NewsListPage({
  onEdit,
  onManageCategories,
}: {
  onEdit: (id: number | 'new') => void;
  onManageCategories: () => void;
}) {
  const { toast } = useToast();
  const [data, setData] = useState<NewsListResult | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<NewsItem | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await newsApi.list({ page, size: PAGE_SIZE, status: status || undefined, q: q || undefined }));
    } catch (e) {
      toast(e instanceof Error ? e.message : '加载失败', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, status, q, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleStatus = async (item: NewsItem) => {
    const next = item.status === 'published' ? 'draft' : 'published';
    try {
      await newsApi.setStatus(item.id, next);
      toast(next === 'published' ? '已发布' : '已撤回为草稿');
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : '操作失败', 'error');
    }
  };

  const doDelete = async () => {
    if (!deleting) return;
    setDeletingLoading(true);
    try {
      await newsApi.remove(deleting.id);
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
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-[#111622]">新闻管理</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onManageCategories}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            分类管理
          </button>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none"
          >
            <option value="">全部状态</option>
            <option value="published">已发布</option>
            <option value="draft">草稿</option>
          </select>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setQ(keyword.trim());
                setPage(1);
              }
            }}
            placeholder="搜索标题"
            className="w-44 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#EE9B27]"
          />
          <button
            onClick={() => {
              setQ(keyword.trim());
              setPage(1);
            }}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            搜索
          </button>
          <button
            onClick={() => onEdit('new')}
            className="rounded-lg bg-[#EE9B27] px-4 py-2 text-sm text-white hover:bg-[#F5A623]"
          >
            + 新建新闻
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">封面</th>
                <th className="px-4 py-3 font-medium">标题</th>
                <th className="px-4 py-3 font-medium">分类</th>
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 font-medium">发布时间</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {data?.list.map((item) => (
                <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    {item.cover ? (
                      <img src={item.cover} alt="" className="h-12 w-20 rounded object-cover" />
                    ) : (
                      <span className="text-xs text-gray-300">无封面</span>
                    )}
                  </td>
                  <td className="max-w-[280px] truncate px-4 py-3" title={item.title}>
                    {item.title}
                  </td>
                  <td className="px-4 py-3">{item.category || '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        item.status === 'published'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {item.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.publishedAt || '—'}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <button onClick={() => onEdit(item.id)} className="mr-3 text-[#EE9B27] hover:underline">
                      编辑
                    </button>
                    <button onClick={() => toggleStatus(item)} className="mr-3 text-gray-600 hover:underline">
                      {item.status === 'published' ? '撤回' : '发布'}
                    </button>
                    <button onClick={() => setDeleting(item)} className="text-red-500 hover:underline">
                      删除
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && data?.list.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {loading && <div className="px-4 py-3 text-sm text-gray-400">加载中…</div>}
        {data && <Pagination page={data.page} size={data.size} total={data.total} onChange={setPage} />}
      </div>

      {deleting && (
        <ConfirmDialog
          message={`确定删除新闻「${deleting.title}」吗？删除后不可恢复。`}
          onConfirm={doDelete}
          onCancel={() => setDeleting(null)}
          loading={deletingLoading}
        />
      )}
    </div>
  );
}
