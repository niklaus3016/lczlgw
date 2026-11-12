/**
 * 统一的线索提交入口：落库到官网后端 /api/leads。
 * 提交时自动附带来源页面、入站 referrer 与 UTM，用于后台来源归因。
 * 后端落库成功后会异步推送企业微信群机器人（需配置 WECOM_WEBHOOK_URL）。
 */
import { currentVirtualPath, getAttribution } from './track';

export interface LeadPayload {
  /** 来源页面/表单位置，便于运营区分线索来源 */
  source: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  projectName?: string;
  demand?: string;
  /** 表单类型：upgrade 升级改造 / develop 新开发项目 / analysis 投资前景分析 / consult 合作咨询（顶栏与页脚共用） */
  formType?: 'upgrade' | 'develop' | 'analysis' | 'consult';
  extra?: Record<string, string | undefined>;
}

export async function submitLead(payload: LeadPayload): Promise<void> {
  // 组装留言：把后端没有独立字段的信息合并进留言，后台可直接阅读
  const messageLines = [
    payload.demand,
    payload.city ? `城市：${payload.city}` : undefined,
    payload.email ? `邮箱：${payload.email}` : undefined,
    ...Object.entries(payload.extra ?? {}).map(([k, v]) => (v ? `${k}：${v}` : undefined)),
    `表单位置：${payload.source}`,
  ].filter((s): s is string => !!s && !!s.trim());

  const body = {
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    hotelName: payload.projectName?.trim() || undefined,
    message: messageLines.join('\n') || undefined,
    formType: payload.formType ?? (payload.source.includes('合作咨询') || payload.source.includes('顶栏') ? 'consult' : 'upgrade'),
    sourcePath: currentVirtualPath(),
    ...getAttribution(),
  };

  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.code !== 0) {
    throw new Error(json?.message || `提交失败（${res.status}），请稍后重试或致电 400-688-6527`);
  }
}
