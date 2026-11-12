/**
 * 全站访问埋点与来源归因。
 * - visitor_id：首次访问生成的匿名随机串，存 localStorage（不含个人信息）
 * - 入站 referrer / UTM：会话级（sessionStorage），用于线索来源归因
 * - 上报用 navigator.sendBeacon，页面切换零阻塞；/admin 路径不上报
 */

const VID_KEY = 'rz_visitor_id';
const REF_KEY = 'rz_entry_ref';
const UTM_KEY = 'rz_entry_utm';

export interface Attribution {
  referrer?: string;
  utm?: { source?: string; medium?: string; campaign?: string };
}

function getOrCreateVisitorId(): string {
  try {
    let vid = localStorage.getItem(VID_KEY);
    if (!vid) {
      vid = crypto.randomUUID();
      localStorage.setItem(VID_KEY, vid);
    }
    return vid;
  } catch {
    return 'anonymous';
  }
}

/** 会话入站来源：仅记录外部来源（站内跳转不算） */
function initEntryReferrer(): void {
  try {
    if (sessionStorage.getItem(REF_KEY) !== null) return;
    const ref = document.referrer || '';
    const isExternal = ref && !ref.includes(window.location.host);
    sessionStorage.setItem(REF_KEY, isExternal ? ref : '');
  } catch {
    // 隐私模式下静默失败
  }
}

/** 会话入站 UTM（为 GEO/AI 归因预留） */
function initEntryUtm(): void {
  try {
    if (sessionStorage.getItem(UTM_KEY) !== null) return;
    const params = new URLSearchParams(window.location.search);
    const utm = {
      source: params.get('utm_source') || undefined,
      medium: params.get('utm_medium') || undefined,
      campaign: params.get('utm_campaign') || undefined,
    };
    sessionStorage.setItem(UTM_KEY, utm.source || utm.medium || utm.campaign ? JSON.stringify(utm) : '');
  } catch {
    // 忽略
  }
}

/** 应用启动时调用一次 */
export function initAttribution(): void {
  getOrCreateVisitorId();
  initEntryReferrer();
  initEntryUtm();
}

export function getAttribution(): Attribution {
  try {
    const referrer = sessionStorage.getItem(REF_KEY) || undefined;
    const utmRaw = sessionStorage.getItem(UTM_KEY);
    return { referrer, utm: utmRaw ? JSON.parse(utmRaw) : undefined };
  } catch {
    return {};
  }
}

/** 当前页面路径（History 路由）：'/news/12' → '/news/12' */
export function currentVirtualPath(): string {
  const path = window.location.pathname.split('?')[0];
  return path || '/';
}

/** 页面上报 */
export function trackView(path: string, title: string): void {
  if (path.startsWith('/admin')) return;
  const payload = {
    path,
    title: title.slice(0, 200),
    referrer: getAttribution().referrer,
    visitorId: getOrCreateVisitorId(),
  };
  const body = JSON.stringify(payload);
  try {
    const ok = navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
    if (!ok) throw new Error('beacon rejected');
  } catch {
    void fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  }
}
