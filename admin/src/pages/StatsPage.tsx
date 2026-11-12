import { useCallback, useEffect, useState } from 'react';
import { statsApi, type MetricCard, type StatsOverview } from '../api';
import { useToast } from '../components/Toast';

// 指标卡：今日/昨日 + 环比箭头
function MetricCardView({ title, card }: { title: string; card: MetricCard }) {
  const delta = card.deltaPct;
  const up = delta !== null && delta >= 0;
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 flex items-end justify-between">
        <div className="text-3xl font-bold text-[#111622]">{card.today}</div>
        {delta === null ? (
          <span className="text-sm text-gray-400">—</span>
        ) : (
          <span className={`text-sm font-medium ${up ? 'text-emerald-600' : 'text-red-500'}`}>
            {up ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
      <div className="mt-1 text-xs text-gray-400">昨日 {card.yesterday}</div>
    </div>
  );
}

// PV + UV 双线 SVG 折线图
function TrendChart({ trend }: { trend: StatsOverview['trend'] }) {
  const W = 800;
  const H = 260;
  const PL = 44;
  const PR = 16;
  const PT = 20;
  const PB = 32;
  const maxV = Math.max(1, ...trend.map((t) => Math.max(t.pv, t.uv)));
  const x = (i: number) => PL + (i * (W - PL - PR)) / Math.max(1, trend.length - 1);
  const y = (v: number) => PT + (1 - v / maxV) * (H - PT - PB);
  const line = (key: 'pv' | 'uv') =>
    trend.map((t, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(t[key]).toFixed(1)}`).join(' ');
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((r) => Math.round(maxV * r));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ticks.map((v) => (
        <g key={v}>
          <line x1={PL} x2={W - PR} y1={y(v)} y2={y(v)} stroke="#eee" strokeWidth="1" />
          <text x={PL - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#999">
            {v}
          </text>
        </g>
      ))}
      {trend.map((t, i) => (
        <text key={t.day} x={x(i)} y={H - 10} textAnchor="middle" fontSize="11" fill="#999">
          {t.day}
        </text>
      ))}
      <path d={line('pv')} fill="none" stroke="#EE9B27" strokeWidth="2" />
      <path d={line('uv')} fill="none" stroke="#111622" strokeWidth="2" />
      {trend.map((t, i) => (
        <g key={`p-${t.day}`}>
          <circle cx={x(i)} cy={y(t.pv)} r="3" fill="#EE9B27" />
          <circle cx={x(i)} cy={y(t.uv)} r="3" fill="#111622" />
        </g>
      ))}
    </svg>
  );
}

export default function StatsPage() {
  const { toast } = useToast();
  const [range, setRange] = useState<'7d' | '30d'>('7d');
  const [data, setData] = useState<StatsOverview | null>(null);

  const load = useCallback(async () => {
    try {
      setData(await statsApi.overview(range));
    } catch (e) {
      toast(e instanceof Error ? e.message : '加载失败', 'error');
    }
  }, [range, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const maxChannelUv = Math.max(1, ...(data?.topChannels.map((c) => c.uv) || [1]));

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#111622]">访问统计</h1>
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MetricCardView title="浏览量 PV（今日）" card={data.cards.pv} />
            <MetricCardView title="独立访客 UV（今日）" card={data.cards.uv} />
            <MetricCardView title="线索转化（今日）" card={data.cards.leads} />
          </div>

          <div className="mt-5 rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-4 text-sm text-gray-500">
              <span className="font-medium text-[#111622]">访问趋势</span>
              <span className="flex items-center gap-1">
                <i className="inline-block h-0.5 w-4 bg-[#EE9B27]" /> PV
              </span>
              <span className="flex items-center gap-1">
                <i className="inline-block h-0.5 w-4 bg-[#111622]" /> UV
              </span>
            </div>
            <TrendChart trend={data.trend} />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-3 font-medium text-[#111622]">热门页面 Top10</div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400">
                    <th className="py-2 font-medium">页面</th>
                    <th className="py-2 font-medium">路径</th>
                    <th className="py-2 text-right font-medium">PV</th>
                    <th className="py-2 text-right font-medium">UV</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topPages.slice(0, 10).map((p) => (
                    <tr key={p.path} className="border-t border-gray-100">
                      <td className="py-2">{p.name || '—'}</td>
                      <td className="max-w-[180px] truncate py-2 text-gray-500">{p.path}</td>
                      <td className="py-2 text-right">{p.pv}</td>
                      <td className="py-2 text-right">{p.uv}</td>
                    </tr>
                  ))}
                  {data.topPages.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">
                        暂无数据
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-3 font-medium text-[#111622]">来源渠道 Top8</div>
              <div className="space-y-3">
                {data.topChannels.slice(0, 8).map((c) => (
                  <div key={c.channel} className="flex items-center gap-3 text-sm">
                    <span className="w-24 truncate text-gray-600">{c.channel}</span>
                    <div className="h-4 flex-1 rounded bg-gray-100">
                      <div
                        className="h-4 rounded bg-[#EE9B27]"
                        style={{ width: `${Math.max(2, (c.uv / maxChannelUv) * 100)}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-gray-500">{c.uv}</span>
                  </div>
                ))}
                {data.topChannels.length === 0 && <div className="py-8 text-center text-gray-400">暂无数据</div>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
