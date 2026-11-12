import { useCallback, useEffect, useState } from 'react';
import { statsApi, type AiStats } from '../api';
import { useToast } from '../components/Toast';

// 环形图调色板
const PALETTE = ['#EE9B27', '#111622', '#5B8FF9', '#61DDAA', '#F6BD16', '#7262FD', '#78D3F8', '#9661BC'];

// AI 渠道分布 SVG 环形图
function DonutChart({ channels }: { channels: { name: string; uv: number }[] }) {
  const total = channels.reduce((s, c) => s + c.uv, 0);
  const R = 70;
  const C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 200 200" className="h-48 w-48 -rotate-90">
        <circle cx="100" cy="100" r={R} fill="none" stroke="#f0f0f0" strokeWidth="28" />
        {total > 0 &&
          channels.map((c, i) => {
            const len = (c.uv / total) * C;
            const el = (
              <circle
                key={c.name}
                cx="100"
                cy="100"
                r={R}
                fill="none"
                stroke={PALETTE[i % PALETTE.length]}
                strokeWidth="28"
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
      </svg>
      <div className="space-y-2 text-sm">
        {channels.map((c, i) => (
          <div key={c.name} className="flex items-center gap-2">
            <i className="inline-block h-3 w-3 rounded-sm" style={{ background: PALETTE[i % PALETTE.length] }} />
            <span className="text-gray-600">{c.name}</span>
            <span className="text-gray-400">
              {c.uv}（{total > 0 ? ((c.uv / total) * 100).toFixed(1) : 0}%）
            </span>
          </div>
        ))}
        {channels.length === 0 && <div className="text-gray-400">暂无数据</div>}
      </div>
    </div>
  );
}

export default function AiStatsPage() {
  const { toast } = useToast();
  const [range, setRange] = useState<'7d' | '30d'>('7d');
  const [data, setData] = useState<AiStats | null>(null);

  const load = useCallback(async () => {
    try {
      setData(await statsApi.ai(range));
    } catch (e) {
      toast(e instanceof Error ? e.message : '加载失败', 'error');
    }
  }, [range, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const cards = data?.cards;
  const cardDefs = cards
    ? [
        { title: 'AI 渠道 UV', value: cards.aiUv, suffix: '' },
        { title: 'AI 流量渗透率', value: cards.aiUvPct, suffix: '%' },
        { title: 'AI 来源线索数', value: cards.aiLeads, suffix: '' },
        { title: 'AI 线索转化率', value: cards.aiLeadRate, suffix: '%' },
      ]
    : [];

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#111622]">AI 流量归因</h1>
        <div className="flex rounded-lg border border-gray-200 bg-white p-0.5 text-sm">
          {(['7d', '30d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-md px-3 py-1.5 ${range === r ? 'bg-[#EE9B27] text-white' : 'text-gray-500'}`}
            >
              {r === '7d' ? '近7天' : '近30天'}
            </button>
          ))}
        </div>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cardDefs.map((c) => (
              <div key={c.title} className="rounded-xl bg-white p-5 shadow-sm">
                <div className="text-sm text-gray-500">{c.title}</div>
                <div className="mt-2 text-3xl font-bold text-[#111622]">
                  {c.value}
                  <span className="ml-0.5 text-base font-normal text-gray-400">{c.suffix}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-4 font-medium text-[#111622]">AI 渠道分布</div>
              <DonutChart channels={data.channels} />
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-3 font-medium text-[#111622]">入站明细</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400">
                      <th className="py-2 font-medium">AI 来源</th>
                      <th className="py-2 font-medium">落地页</th>
                      <th className="py-2 text-right font-medium">UV</th>
                      <th className="py-2 text-right font-medium">线索数</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.details.map((d, i) => (
                      <tr key={`${d.source}-${i}`} className="border-t border-gray-100">
                        <td className="py-2">{d.source}</td>
                        <td className="max-w-[180px] truncate py-2 text-gray-500" title={d.landingPath}>
                          {d.landingName || d.landingPath}
                        </td>
                        <td className="py-2 text-right">{d.uv}</td>
                        <td className="py-2 text-right">{d.leads}</td>
                      </tr>
                    ))}
                    {data.details.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-400">
                          暂无数据
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
