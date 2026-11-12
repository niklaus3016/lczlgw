import { sqlite } from '../db/index.js';
import { classifyChannel, detectAiSource, readablePathName } from './ai.js';
import { dayOfUtc8, dayStartIsoUtc, recentDaysUtc8, todayUtc8 } from './time.js';

interface PvRow {
  path: string;
  visitorId: string;
  referrer: string | null;
  ua: string | null;
  createdAt: string;
}

interface LeadRow {
  referrer: string | null;
  utm: string | null;
  sourcePath: string;
  createdAt: string;
}

export type StatsRange = '7d' | '30d';

interface RangeData {
  days: string[];
  views: PvRow[];
  leadRows: LeadRow[];
}

/** 读取区间内的访问与线索原始数据（内容站日 PV 百级，JS 聚合足够快且规则迭代灵活） */
function loadRangeData(range: StatsRange): RangeData {
  const days = recentDaysUtc8(range === '30d' ? 30 : 7);
  const startIso = dayStartIsoUtc(days[0]);
  const views = sqlite
    .prepare(
      `SELECT path, visitor_id AS visitorId, referrer, ua, created_at AS createdAt
       FROM pageviews WHERE created_at >= ? ORDER BY created_at ASC`,
    )
    .all(startIso) as PvRow[];
  const leadRows = sqlite
    .prepare(
      `SELECT referrer, utm, source_path AS sourcePath, created_at AS createdAt
       FROM leads WHERE created_at >= ?`,
    )
    .all(startIso) as LeadRow[];
  return { days, views, leadRows };
}

function deltaPct(today: number, yesterday: number): number | null {
  if (yesterday === 0) return today > 0 ? null : 0;
  return Math.round(((today - yesterday) / yesterday) * 1000) / 10;
}

function distinct(rows: PvRow[]): number {
  return new Set(rows.map((r) => r.visitorId)).size;
}

export function getOverview(range: StatsRange) {
  const { days, views, leadRows } = loadRangeData(range);
  const today = todayUtc8();
  const yesterday = days.length >= 2 ? days[days.length - 2] : '';

  const byDay = new Map<string, PvRow[]>();
  for (const r of views) {
    const d = dayOfUtc8(r.createdAt);
    if (!byDay.has(d)) byDay.set(d, []);
    byDay.get(d)!.push(r);
  }
  const leadsByDay = new Map<string, number>();
  for (const l of leadRows) {
    const d = dayOfUtc8(l.createdAt);
    leadsByDay.set(d, (leadsByDay.get(d) || 0) + 1);
  }

  const todayViews = byDay.get(today) || [];
  const yesterdayViews = byDay.get(yesterday) || [];

  // 热门页面 Top 10
  const pageMap = new Map<string, { pv: number; visitors: Set<string> }>();
  for (const r of views) {
    if (!pageMap.has(r.path)) pageMap.set(r.path, { pv: 0, visitors: new Set() });
    const p = pageMap.get(r.path)!;
    p.pv += 1;
    p.visitors.add(r.visitorId);
  }
  const topPages = [...pageMap.entries()]
    .map(([path, v]) => ({ path, name: readablePathName(path), pv: v.pv, uv: v.visitors.size }))
    .sort((a, b) => b.pv - a.pv)
    .slice(0, 10);

  // 来源渠道 Top 8（按 UV）
  const channelMap = new Map<string, Set<string>>();
  for (const r of views) {
    const ch = classifyChannel(r.referrer, r.ua);
    if (!channelMap.has(ch)) channelMap.set(ch, new Set());
    channelMap.get(ch)!.add(r.visitorId);
  }
  const topChannels = [...channelMap.entries()]
    .map(([channel, visitors]) => ({ channel, uv: visitors.size }))
    .sort((a, b) => b.uv - a.uv)
    .slice(0, 8);

  return {
    range,
    cards: {
      pv: { today: todayViews.length, yesterday: yesterdayViews.length, deltaPct: deltaPct(todayViews.length, yesterdayViews.length) },
      uv: { today: distinct(todayViews), yesterday: distinct(yesterdayViews), deltaPct: deltaPct(distinct(todayViews), distinct(yesterdayViews)) },
      leads: { today: leadsByDay.get(today) || 0, yesterday: leadsByDay.get(yesterday) || 0, deltaPct: deltaPct(leadsByDay.get(today) || 0, leadsByDay.get(yesterday) || 0) },
    },
    trend: days.map((d) => ({
      day: d.slice(5),
      pv: (byDay.get(d) || []).length,
      uv: distinct(byDay.get(d) || []),
      leads: leadsByDay.get(d) || 0,
    })),
    topPages,
    topChannels,
  };
}

/** 线索是否来自 AI 渠道（referrer 或 utm_source 命中规则） */
function leadAiSource(l: LeadRow): string | null {
  const fromRef = detectAiSource(l.referrer, null);
  if (fromRef) return fromRef;
  if (l.utm) {
    try {
      const utm = JSON.parse(l.utm) as { source?: string };
      if (utm.source) {
        const hit = detectAiSource(`https://${utm.source}`, null);
        if (hit) return hit;
      }
    } catch {
      // 忽略非法 JSON
    }
  }
  return null;
}

export function getAiStats(range: StatsRange) {
  const { views, leadRows } = loadRangeData(range);

  const aiRows: Array<PvRow & { source: string }> = [];
  for (const r of views) {
    const source = detectAiSource(r.referrer, r.ua);
    if (source) aiRows.push({ ...r, source });
  }

  const totalUv = distinct(views);
  const aiUv = distinct(aiRows);
  const aiLeads = leadRows.filter((l) => leadAiSource(l) !== null);

  // 渠道分布（按 UV）
  const channelMap = new Map<string, Set<string>>();
  for (const r of aiRows) {
    if (!channelMap.has(r.source)) channelMap.set(r.source, new Set());
    channelMap.get(r.source)!.add(r.visitorId);
  }
  const channels = [...channelMap.entries()]
    .map(([name, visitors]) => ({ name, uv: visitors.size }))
    .sort((a, b) => b.uv - a.uv);

  // 入站明细：AI 来源 × 落地页（访客最早一次访问的页面视为落地页）
  const landingMap = new Map<string, { source: string; landingPath: string; visitors: Set<string> }>();
  const firstSeen = new Map<string, PvRow & { source: string }>();
  for (const r of aiRows) {
    if (!firstSeen.has(r.visitorId)) firstSeen.set(r.visitorId, r);
  }
  for (const r of firstSeen.values()) {
    const key = `${r.source}|${r.path}`;
    if (!landingMap.has(key)) landingMap.set(key, { source: r.source, landingPath: r.path, visitors: new Set() });
    landingMap.get(key)!.visitors.add(r.visitorId);
  }
  const details = [...landingMap.values()]
    .map((d) => ({
      source: d.source,
      landingPath: d.landingPath,
      landingName: readablePathName(d.landingPath),
      uv: d.visitors.size,
      leads: aiLeads.filter((l) => leadAiSource(l) === d.source && l.sourcePath === d.landingPath).length,
    }))
    .sort((a, b) => b.uv - a.uv);

  return {
    range,
    cards: {
      aiUv,
      aiUvPct: totalUv ? Math.round((aiUv / totalUv) * 1000) / 10 : 0,
      aiLeads: aiLeads.length,
      aiLeadRate: aiUv ? Math.round((aiLeads.length / aiUv) * 1000) / 10 : 0,
    },
    channels,
    details,
  };
}
