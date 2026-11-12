import crypto from 'node:crypto';
import { config } from '../config.js';
import { formatUtc8 } from './time.js';
import { FORM_TYPE_LABELS, type LeadLike } from './wecom.js';

/**
 * 钉钉自定义机器人 Webhook。
 * 若机器人安全设置选择“加签”，需同时配置 DINGTALK_SECRET。
 */
function buildWebhookUrl(): string {
  const base = config.dingtalkWebhookUrl;
  if (!config.dingtalkSecret) return base;

  const timestamp = Date.now();
  const stringToSign = `${timestamp}\n${config.dingtalkSecret}`;
  const sign = crypto.createHmac('sha256', config.dingtalkSecret).update(stringToSign).digest('base64');
  const url = new URL(base);
  url.searchParams.set('timestamp', String(timestamp));
  url.searchParams.set('sign', sign);
  return url.toString();
}

/** 新线索异步推送钉钉群机器人；推送失败仅记日志，不影响表单提交结果 */
export async function pushLeadToDingTalk(lead: LeadLike): Promise<void> {
  if (!config.dingtalkWebhookUrl) return;

  const lines = [
    '### 官网新线索提醒',
    `- 称呼：${lead.name}`,
    `- 电话：${lead.phone}`,
    lead.hotelName ? `- 酒店/物业：${lead.hotelName}` : null,
    `- 意向类型：${FORM_TYPE_LABELS[lead.formType] || lead.formType}`,
    lead.message ? `- 留言：${lead.message}` : null,
    `- 来源页面：${lead.sourcePath || '-'}`,
    `- 提交时间：${formatUtc8(lead.createdAt)}`,
  ].filter(Boolean);

  try {
    const res = await fetch(buildWebhookUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msgtype: 'markdown',
        markdown: { title: '官网新线索提醒', text: lines.join('\n') },
      }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json().catch(() => null)) as { errcode?: number; errmsg?: string } | null;
    if (!res.ok || (data && data.errcode !== 0)) {
      console.error(`[dingtalk] 推送失败：HTTP ${res.status}，errcode=${data?.errcode ?? '-'}，${data?.errmsg ?? ''}`);
    }
  } catch (err) {
    console.error('[dingtalk] 推送异常：', err instanceof Error ? err.message : err);
  }
}
