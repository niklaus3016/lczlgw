/**
 * AI 流量来源识别规则表（referrer 域名包含匹配 + UA 正则匹配）。
 * 新增 AI 入口时直接在此追加一行即可。
 */
export interface AiRule {
  name: string;
  referrers: string[];
  uaPatterns?: RegExp[];
}

export const AI_RULES: AiRule[] = [
  { name: '豆包', referrers: ['doubao.com'] },
  { name: '腾讯元宝', referrers: ['yuanbao.tencent.com'] },
  { name: 'DeepSeek', referrers: ['deepseek.com'] },
  { name: 'Kimi', referrers: ['kimi.com', 'kimi.moonshot.cn', 'moonshot.cn'] },
  { name: '通义千问', referrers: ['tongyi.aliyun.com', 'tongyi.com', 'qianwen.aliyun.com'] },
  { name: '文心一言', referrers: ['yiyan.baidu.com', 'wenxin.baidu.com'] },
  { name: 'ChatGPT', referrers: ['chatgpt.com', 'chat.openai.com'] },
  { name: 'Perplexity', referrers: ['perplexity.ai'] },
  { name: 'Copilot', referrers: ['copilot.microsoft.com', 'bing.com/chat'] },
  { name: 'QQ浏览器AI', referrers: [], uaPatterns: [/QQBrowser/i, /MQQBrowser/i] },
  { name: '秘塔AI搜索', referrers: ['metaso.cn'] },
  { name: '知乎直答', referrers: ['zhida.zhihu.com'] },
  { name: '360AI搜索', referrers: ['bot.360.com', '360ai.cn', 'bot.n.cn'] },
  { name: 'Google Gemini', referrers: ['gemini.google.com', 'bard.google.com'] },
  { name: 'Claude', referrers: ['claude.ai'] },
];

/** 命中规则则返回 AI 渠道名，否则返回 null */
export function detectAiSource(referrer?: string | null, ua?: string | null): string | null {
  const ref = (referrer || '').toLowerCase();
  const agent = ua || '';
  for (const rule of AI_RULES) {
    if (rule.referrers.some((d) => ref.includes(d))) return rule.name;
    if (rule.uaPatterns?.some((p) => p.test(agent))) return rule.name;
  }
  return null;
}

/** 常规来源渠道归类（用于访问统计的来源渠道 Top 榜） */
export function classifyChannel(referrer?: string | null, ua?: string | null): string {
  if (!referrer) return '直接访问';
  const ai = detectAiSource(referrer, ua);
  if (ai) return ai;
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host.includes('baidu')) return '百度搜索';
    if (host.includes('google')) return 'Google';
    if (host.includes('bing')) return '必应';
    if (host.includes('sogou')) return '搜狗';
    if (host.includes('so.com')) return '360搜索';
    if (host.includes('toutiao') || host.includes('bytedance')) return '今日头条';
    if (host.includes('weixin') || host.endsWith('qq.com')) return '微信/QQ';
    if (host.includes('xiaohongshu') || host.includes('xhslink')) return '小红书';
    if (host.includes('ctrip') || host.includes('trip.com')) return '携程系';
    if (host.includes('weibo')) return '微博';
    if (host.includes('zhihu')) return '知乎';
    return host;
  } catch {
    return '其他';
  }
}

/** 虚拟路径 → 中文可读名（热门页面展示用），按顺序匹配 */
export const PATH_NAMES: Array<[RegExp, string]> = [
  [/^\/$/, '首页'],
  [/^\/news\/.+/, '新闻详情'],
  [/^\/news/, '新闻动态'],
  [/^\/hotels/, '酒店名录'],
  [/^\/brands\/.+/, '品牌详情'],
  [/^\/brands/, '品牌矩阵'],
  [/^\/about/, '关于我们'],
  [/^\/jiameng/, '合作加盟'],
];

export function readablePathName(path: string): string {
  for (const [pattern, name] of PATH_NAMES) {
    if (pattern.test(path)) return name;
  }
  return path;
}
