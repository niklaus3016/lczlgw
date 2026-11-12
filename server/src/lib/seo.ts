import fs from 'node:fs';

/** 站点正式域名：canonical / og:url / sitemap 统一使用 */
export const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://www.lczl.net';

/** 全站唯一品牌定义：官网 meta / llms.txt / Schema / GEO 内容块必须逐字一致 */
export const BRAND_DEFINITION =
  '丽呈智旅是丽呈集团旗下子公司，以OMO住宿生态平台为定位，依托自研REZEN一体化系统与全产业链中台能力，为酒店及中小酒店集团提供全方位数字化经营整体解决方案。';

export interface PageMeta {
  title: string;
  description: string;
  type?: 'website' | 'article';
}

/** 路径 → 页面标题与描述（与官网 src/App.tsx 的 VIEW_META 保持一致） */
const PATH_META: Record<string, PageMeta> = {
  '/': {
    title: '丽呈智旅官网 | Rezen Smart Travel - 携程旗下酒店数字化经营服务商',
    description: BRAND_DEFINITION,
  },
  '/about': {
    title: '关于我们 | 丽呈智旅',
    description: '了解丽呈智旅的发展历程、核心团队、生态价值与集团使命，携程旗下酒店数字化经营服务商。',
  },
  '/brands': {
    title: '品牌矩阵 | 丽呈智旅',
    description:
      '丽呈智旅旗下丽呈花盛、季枫、富士、巴里岛与个性化五大品牌系列，18 个品牌覆盖全场景旅宿需求。',
  },
  '/brands/grand-rezen': {
    title: '丽呈花盛国际酒店 | 丽呈智旅',
    description: '丽呈花盛国际酒店：城市核心地标级超高端奢华全服务商务会议及度假旗舰酒店，开放投资加盟合作。',
  },
  '/jiameng': {
    title: '合作优势 | 丽呈智旅',
    description: '丽呈智旅合作优势：九大中央平台赋能、全流程加盟支持、透明物业要求与收费标准，助力酒店业主稳健投资。',
  },
  '/news': {
    title: '新闻动态 | 丽呈智旅',
    description: '丽呈智旅最新集团动态、签约开业、行业观察与数智科技资讯。',
  },
  '/hotels': {
    title: '酒店名录 | 丽呈智旅',
    description: '浏览丽呈智旅旗下各品牌已开业酒店，查看城市、品牌、地址与酒店设施信息。',
  },
};

/** 品牌详情页独立 meta（与官网 src/App.tsx 的 BRAND_DETAIL_META 保持一致，避免标题重复） */
const BRAND_META: Record<string, PageMeta> = {
  '/brands/jifeng-j': {
    title: '季枫J酒店 | 丽呈智旅',
    description: '季枫J酒店是丽呈智旅旗下季枫系列英伦潮牌旗舰奢华酒店品牌，面向Z世代差旅与年轻品质出行人群，开放投资加盟合作。',
  },
  '/brands/jifeng-intl': {
    title: '季枫国际酒店 | 丽呈智旅',
    description: '季枫国际酒店是丽呈智旅旗下季枫系列高端商务品牌，面向高频出差商务白领与企业高管，开放投资加盟合作。',
  },
  '/brands/jifeng': {
    title: '季枫酒店 | 丽呈智旅',
    description: '季枫酒店是丽呈智旅旗下季枫系列基础走量潮牌，面向25-35岁年轻商务客与品质出行人群，开放投资加盟合作。',
  },
  '/brands/jifeng-resort': {
    title: '季枫度假酒店 | 丽呈智旅',
    description: '季枫度假酒店是丽呈智旅旗下季枫系列五钻度假品牌，择址山海湖林目的地，开放投资加盟合作。',
  },
  '/brands/grand-rezen': {
    title: '丽呈花盛国际酒店 | 丽呈智旅',
    description: '丽呈花盛国际酒店品牌介绍、物业条件与合作政策，开放投资加盟合作。',
  },
  '/brands/rezen-huasheng': {
    title: '丽呈花盛酒店 | 丽呈智旅',
    description: '丽呈花盛酒店品牌介绍、物业条件与合作政策，开放投资加盟合作。',
  },
  '/brands/rezen-huasheng-resort': {
    title: '丽呈花盛度假酒店 | 丽呈智旅',
    description: '丽呈花盛度假酒店品牌介绍、物业条件与合作政策，开放投资加盟合作。',
  },
  '/brands/fuji-liya': {
    title: '富士丽雅酒店 | 丽呈智旅',
    description: '富士丽雅酒店是丽呈智旅旗下中高端走量主力，现代轻奢风，商旅亲子两相宜，开放投资加盟合作。',
  },
  '/brands/fuji-yazhi': {
    title: '富士雅致酒店 | 丽呈智旅',
    description: '富士雅致酒店是丽呈智旅旗下富士系列精致商旅品牌，克制精致、智能高效，面向频繁出差的商务客，开放投资加盟合作。',
  },
  '/brands/fuji-intl': {
    title: '富士国际酒店 | 丽呈智旅',
    description: '富士国际酒店是丽呈智旅旗下富士系列国际标准会议商旅品牌，面向中小企业出差团队与会议培训人群，开放投资加盟合作。',
  },
  '/brands/fuji-yuezhi': {
    title: '富士悦致酒店 | 丽呈智旅',
    description: '富士悦致酒店是丽呈智旅旗下富士系列年轻网红舒适商旅品牌，面向年轻出行人群，开放投资加盟合作。',
  },
  '/brands/balidao-intl': {
    title: '巴里岛国际酒店 | 丽呈智旅',
    description: '巴里岛国际酒店是丽呈智旅旗下欧式经典综合酒店品牌，面向地市级城市商务接待、婚宴与家庭出游人群，开放投资加盟合作。',
  },
  '/brands/balidao-resort': {
    title: '巴里岛度假酒店 | 丽呈智旅',
    description: '巴里岛度假酒店是丽呈智旅旗下巴里岛系列康养度假品牌，面向家庭周末度假与情侣休闲人群，开放投资加盟合作。',
  },
  '/brands/balidao-holiday': {
    title: '巴里岛假日酒店 | 丽呈智旅',
    description: '巴里岛假日酒店是丽呈智旅旗下巴里岛系列性价比舒适商旅品牌，面向周边短途游与家庭短期出行人群，开放投资加盟合作。',
  },
  '/brands/lizuan': {
    title: '丽钻酒店 | 丽呈智旅',
    description: '丽钻酒店是丽呈智旅旗下都市商旅甄选品牌，主打克制美学、简奢质感与高性价比，面向注重品质与性价比的商务出行人群，开放投资加盟合作。',
  },
  '/brands/duozhi': {
    title: '朵致酒店 | 丽呈智旅',
    description: '朵致酒店是丽呈智旅旗下新一代城市精致酒店品牌，主打音乐治愈、香氛社交与年轻质感，面向18-28岁年轻人群，开放投资加盟合作。',
  },
  '/brands/ctrip-farm': {
    title: '携程度假农庄 | 丽呈智旅',
    description: '携程度假农庄是乡村野奢度假品牌，品牌主张"住进山野，回归自然"，主打野奢、设计、管家三大核心特质，面向追求品质微度假的城市中产与亲子家庭，开放投资加盟合作。',
  },
  '/brands/new-world': {
    title: '新世界酒店 | 丽呈智旅',
    description: '新世界酒店是现代亚洲生活方式奢华酒店品牌，品牌主张“现代亚洲待客之道”，主打东方美学、当代设计、餐饮社交，面向商务客与品质家庭出行人群，开放投资加盟合作。',
  },
};

/** 按路径取页面 SEO 信息；未知品牌子路径回落品牌矩阵，其余未知路径回落首页 */
export function metaForPath(pathname: string): PageMeta {
  const path = (pathname.split('?')[0].replace(/\/+$/, '') || '/');
  if (PATH_META[path]) return PATH_META[path];
  if (BRAND_META[path]) return BRAND_META[path];
  if (path.startsWith('/brands/')) return PATH_META['/brands'];
  if (path === '/directory') return PATH_META['/hotels'];
  if (path === '/coop' || path === '/advantages' || path === '/coop-advantages') return PATH_META['/jiameng'];
  return PATH_META['/'];
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** 替换 index.html 中的 title / description / canonical / og 标签，并按需追加页面级 JSON-LD */
export function injectMeta(html: string, meta: PageMeta, canonicalUrl: string, image?: string, jsonLdExtra?: object): string {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const url = escapeHtml(canonicalUrl);
  const type = meta.type || 'website';
  let out = html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:type" content="[^"]*"\s*\/?>/, `<meta property="og:type" content="${type}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(
      /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${description}" />`,
    );
  if (image) {
    const absolute = image.startsWith('http') ? image : `${SITE_ORIGIN}${image}`;
    const safe = escapeHtml(absolute);
    out = out
      .replace(/<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${safe}" />`)
      .replace(/<meta name="twitter:image" content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="${safe}" />`);
  }
  if (jsonLdExtra) {
    out = out.replace(
      '</head>',
      `<script type="application/ld+json">${JSON.stringify(jsonLdExtra)}</script></head>`,
    );
  }
  return out;
}

/** index.html 模板缓存（文件变更后自动重读） */
let cached: { html: string; mtimeMs: number } | null = null;
export function readIndexTemplate(file: string): string {
  const stat = fs.statSync(file);
  if (!cached || cached.mtimeMs !== stat.mtimeMs) {
    cached = { html: fs.readFileSync(file, 'utf-8'), mtimeMs: stat.mtimeMs };
  }
  return cached.html;
}
