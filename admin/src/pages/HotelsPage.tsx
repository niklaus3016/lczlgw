import { useCallback, useEffect, useState } from 'react';
import { hotelApi, type Hotel } from '../api';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';

export default function HotelsPage({ onEdit }: { onEdit: (id: number | 'new') => void }) {
  const { toast } = useToast();
  const [list, setList] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<Hotel | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setList(await hotelApi.list());
    } catch (e) {
      toast(e instanceof Error ? e.message : '加载失败', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const doDelete = async () => {
    if (!deleting) return;
    setDeletingLoading(true);
    try {
      await hotelApi.remove(deleting.id);
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
        <h1 className="text-xl font-bold text-[#111622]">酒店管理</h1>
        <button
          onClick={() => onEdit('new')}
          className="rounded-lg bg-[#EE9B27] px-4 py-2 text-sm text-white hover:bg-[#F5A623]"
        >
          + 新建酒店
        </button>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">主图</th>
                <th className="px-4 py-3 font-medium">名称</th>
                <th className="px-4 py-3 font-medium">区域</th>
                <th className="px-4 py-3 font-medium">开业时间</th>
                <th className="px-4 py-3 font-medium">具体地址</th>
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {list.map((h) => (
                <tr key={h.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    {h.mainPhoto?.url ? (
                      <img src={h.mainPhoto.url} alt="" className="h-12 w-20 rounded object-cover" />
                    ) : (
                      <span className="text-xs text-gray-300">无主图</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#111622]">{h.name}</td>
                  <td className="px-4 py-3">{h.region || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{h.openYear || '—'}</td>
                  <td className="px-4 py-3 max-w-[320px] truncate" title={h.address || ''}>
                    {h.address || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        h.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {h.status === 'published' ? '已发布' : '已隐藏'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <button onClick={() => onEdit(h.id)} className="mr-3 text-[#EE9B27] hover:underline">
                      编辑
                    </button>
                    <button onClick={() => setDeleting(h)} className="text-red-500 hover:underline">
                      删除
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && list.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {loading && <div className="px-4 py-3 text-sm text-gray-400">加载中…</div>}
      </div>

      {deleting && (
        <ConfirmDialog
          message={`确定删除酒店「${deleting.name}」吗？删除后不可恢复。`}
          onConfirm={doDelete}
          onCancel={() => setDeleting(null)}
          loading={deletingLoading}
        />
      )}
    </div>
  );
}
