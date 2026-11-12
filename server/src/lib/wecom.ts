import { config } from '../config.js';
import { formatUtc8 } from './time.js';

export const FORM_TYPE_LABELS: Record<string, string> = {
  upgrade: '门店升级改造',
  develop: '新开发项目',
  analysis: '投资前景分析',
  consult: '合作咨询',
};

export interface LeadLike {
  name: string;
  phone: string;
  hotelName?: string | null;
  message?: string | null;
  formType: string;
  sourcePath: string;
  createdAt: string;
}

/**
 * 新线索异步推送企业微信群机器人。
 * 配置 WECOM_WEBHOOK_URL 时启用；推送失败仅记日志，不影响表单提交结果。
 */
export async function pushLeadToWecom(lead: LeadLike): Promise<void> {
  const url = config.wecomWebhookUrl;
  if (!url) return;

  const lines = [
    '**官网新线索提醒**',
    `> 称呼：${lead.name}`,
    `> 电话：${lead.phone}`,
    lead.hotelName ? `> 酒店/物业：${lead.hotelName}` : null,
    `> 意向类型：${FORM_TYPE_LABELS[lead.formType] || lead.formType}`,
    lead.message ? `> 留言：${lead.message}` : null,
    `> 来源页面：${lead.sourcePath || '-'}`,
    `> 提交时间：${formatUtc8(lead.createdAt)}`,
  ].filter(Boolean);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msgtype: 'markdown', markdown: { content: lines.join('\n') } }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[wecom] 推送失败：HTTP ${res.status}`);
    }
  } catch (err) {
    console.error('[wecom] 推送异常：', err instanceof Error ? err.message : err);
  }
}
