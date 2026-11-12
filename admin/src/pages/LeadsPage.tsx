import { useCallback, useEffect, useState } from 'react';
import { leadApi, type Lead, type LeadListResult } from '../api';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import { useToast } from '../components/Toast';
import { fmtTime } from '../utils';

const PAGE_SIZE = 10;

export default function LeadsPage({ onPendingChange }: { onPendingChange: (n: number) => void }) {
  const { toast } = useToast();
  const [data, setData] = useState<LeadListResult | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<Lead | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await leadApi.list({ page, size: PAGE_SIZE, status: status || undefined, q: q || undefined });
      setData(res);
      onPendingChange(res.pendingCount);
    } catch (e) {
      toast(e instanceof Error ? e.message : '加载失败', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, status, q, onPendingChange, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (lead: Lead, next: 'pending' | 'contacted') => {
    try {
      await leadApi.setStatus(lead.id, next);
      toast('状态已更新');
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : '操作失败', 'error');
    }
  };

  const doDelete = async () => {
    if (!deleting) return;
    setDeletingLoading(true);
    try {
      await leadApi.remove(deleting.id);
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
        <h1 className="text-xl font-bold text-[#111622]">留资线索</h1>
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none"
          >
            <option value="">全部状态</option>
            <option value="pending">待回访</option>
            <option value="contacted">已联系</option>
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
            placeholder="搜索姓名 / 电话 / 酒店名称"
            className="w-52 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#EE9B27]"
          />
          <button
            onClick={() => {
              setQ(keyword.trim());
              setPage(1);
            }}
            className="rounded-lg bg-[#EE9B27] px-4 py-2 text-sm text-white hover:bg-[#F5A623]"
          >
            搜索
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">姓名</th>
                <th className="px-4 py-3 font-medium">联系电话</th>
                <th className="px-4 py-3 font-medium">酒店名称</th>
                <th className="px-4 py-3 font-medium">合作需求</th>
                <th className="px-4 py-3 font-medium">来源页</th>
                <th className="px-4 py-3 font-medium">提交时间</th>
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {data?.list.map((lead) => (
                <tr key={lead.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                  <td className="px-4 py-3">{lead.name}</td>
                  <td className="px-4 py-3">{lead.phone}</td>
                  <td className="px-4 py-3">{lead.hotelName || '—'}</td>
                  <td className="max-w-[180px] truncate px-4 py-3" title={lead.message || ''}>
                    {lead.message || '—'}
                  </td>
                  <td className="max-w-[140px] truncate px-4 py-3 text-gray-500" title={lead.sourcePath}>
                    {lead.sourcePath || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{fmtTime(lead.createdAt)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => changeStatus(lead, e.target.value as 'pending' | 'contacted')}
                      className={`rounded-lg border px-2 py-1 text-xs outline-none ${
                        lead.status === 'pending'
                          ? 'border-[#EE9B27]/40 bg-[#EE9B27]/10 text-[#EE9B27]'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      <option value="pending">待回访</option>
                      <option value="contacted">已联系</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDeleting(lead)} className="text-red-500 hover:underline">
                      删除
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && data?.list.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
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
          message={`确定删除线索「${deleting.name}（${deleting.phone}）」吗？删除后不可恢复。`}
          onConfirm={doDelete}
          onCancel={() => setDeleting(null)}
          loading={deletingLoading}
        />
      )}
    </div>
  );
}
