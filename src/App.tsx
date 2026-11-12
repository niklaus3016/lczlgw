import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, Handshake, Menu, X } from 'lucide-react';
import { HeroCanvasBackground, type HeroSlide } from './components/HeroCanvasBackground';
import { AboutUsPage } from './components/AboutUsPage';
import { BrandMatrixPage } from './components/BrandMatrixPage';
import { BrandDetailPage } from './components/BrandDetailPage';
import { CooperationFranchisePage } from './components/CooperationFranchisePage';
import { NewsPage, EXTENDED_NEWS_LIST } from './components/NewsPage';
import { NewsDetailPage } from './components/NewsDetailPage';
import { HotelDirectoryPage } from './components/HotelDirectoryPage';
import { BRAND_MATRIX_TIERS } from './data/brands';
import { BrandMatrixEmblem } from './components/BrandMatrixEmblem';
import { submitLead } from './lib/leads';
import { fetchBanners, fetchNewsDetail, fetchNewsList } from './lib/api';
import { initAttribution, trackView } from './lib/track';

// 切页时瞬时回到顶部：临时关闭全局 scroll-behavior:smooth，
// 避免多次平滑滚动互相打断，导致切换页面后停留在上一个页面的滚动位置。
function resetScrollTop() {
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  root.style.scrollBehavior = previous;
}

const NAV_ITEMS = [
  { id: 'home', label: '首页', href: '/' },
  { id: 'about', label: '关于我们', href: '/about' },
  { id: 'brands', label: '品牌矩阵', href: '/brands' },
  { id: 'coop', label: '合作优势', href: '/jiameng' },
  { id: 'news', label: '新闻动态', href: '/news' },
  { id: 'hotels', label: '酒店名录', href: '/hotels' },
];

export type View =
  | 'home'
  | 'about'
  | 'brands'
  | 'brand-detail'
  | 'jiameng'
  | 'news'
  | 'news-detail'
  | 'hotels';

/** 路径 → 视图（History 路由，便于各页面被搜索引擎独立收录） */
function viewFromPath(pathname: string): View {
  const path = (pathname.replace(/\/+$/, '') || '/').split('?')[0];
  if (path === '/about') return 'about';
  if (path.startsWith('/brands/')) return 'brand-detail';
  if (path === '/brands') return 'brands';
  if (path.startsWith('/news/')) return 'news-detail';
  if (path === '/news') return 'news';
  if (path === '/hotels' || path === '/directory') return 'hotels';
  if (path === '/jiameng' || path === '/coop' || path === '/advantages' || path === '/coop-advantages') {
    return 'jiameng';
  }
  return 'home';
}

/** 品牌详情页各品牌的浏览器标签标题与描述 */
const BRAND_DETAIL_META: Record<string, { title: string; description: string }> = {
  'jifeng-j': {
    title: '季枫J酒店 | 丽呈智旅',
    description: '季枫J酒店是丽呈智旅旗下季枫系列英伦潮牌旗舰奢华酒店品牌，面向Z世代差旅与年轻品质出行人群，开放投资加盟合作。',
  },
  'jifeng-intl': {
    title: '季枫国际酒店 | 丽呈智旅',
    description: '季枫国际酒店是丽呈智旅旗下季枫系列高端商务品牌，面向高频出差商务白领与企业高管，开放投资加盟合作。',
  },
  jifeng: {
    title: '季枫酒店 | 丽呈智旅',
    description: '季枫酒店是丽呈智旅旗下季枫系列基础走量潮牌，面向25-35岁年轻商务客与品质出行人群，开放投资加盟合作。',
  },
  'jifeng-resort': {
    title: '季枫度假酒店 | 丽呈智旅',
    description: '季枫度假酒店是丽呈智旅旗下季枫系列五钻度假品牌，择址山海湖林目的地，开放投资加盟合作。',
  },
  'grand-rezen': {
    title: '丽呈花盛国际酒店 | 丽呈智旅',
    description: '丽呈花盛国际酒店品牌介绍、物业条件与合作政策，开放投资加盟合作。',
  },
  'rezen-huasheng': {
    title: '丽呈花盛酒店 | 丽呈智旅',
    description: '丽呈花盛酒店品牌介绍、物业条件与合作政策，开放投资加盟合作。',
  },
  'rezen-huasheng-resort': {
    title: '丽呈花盛度假酒店 | 丽呈智旅',
    description: '丽呈花盛度假酒店品牌介绍、物业条件与合作政策，开放投资加盟合作。',
  },
  'fuji-liya': {
    title: '富士丽雅酒店 | 丽呈智旅',
    description: '富士丽雅酒店是丽呈智旅旗下中高端走量主力，现代轻奢风，商旅亲子两相宜，开放投资加盟合作。',
  },
  'fuji-yazhi': {
    title: '富士雅致酒店 | 丽呈智旅',
    description: '富士雅致酒店是丽呈智旅旗下富士系列精致商旅品牌，克制精致、智能高效，面向频繁出差的商务客，开放投资加盟合作。',
  },
  'fuji-intl': {
    title: '富士国际酒店 | 丽呈智旅',
    description: '富士国际酒店是丽呈智旅旗下富士系列国际标准会议商旅品牌，面向中小企业出差团队与会议培训人群，开放投资加盟合作。',
  },
  'fuji-yuezhi': {
    title: '富士悦致酒店 | 丽呈智旅',
    description: '富士悦致酒店是丽呈智旅旗下富士系列年轻网红舒适商旅品牌，面向年轻出行人群，开放投资加盟合作。',
  },
  'balidao-intl': {
    title: '巴里岛国际酒店 | 丽呈智旅',
    description: '巴里岛国际酒店是丽呈智旅旗下欧式经典综合酒店品牌，面向地市级城市商务接待、婚宴与家庭出游人群，开放投资加盟合作。',
  },
  'balidao-resort': {
    title: '巴里岛度假酒店 | 丽呈智旅',
    description: '巴里岛度假酒店是丽呈智旅旗下巴里岛系列康养度假品牌，面向家庭周末度假与情侣休闲人群，开放投资加盟合作。',
  },
  'balidao-holiday': {
    title: '巴里岛假日酒店 | 丽呈智旅',
    description: '巴里岛假日酒店是丽呈智旅旗下巴里岛系列性价比舒适商旅品牌，面向周边短途游与家庭短期出行人群，开放投资加盟合作。',
  },
  lizuan: {
    title: '丽钻酒店 | 丽呈智旅',
    description: '丽钻酒店是丽呈智旅旗下城市微旅品牌，精简高效的小体量连锁酒店，面向短差商务、过境旅客与预算优先型客群，开放投资加盟合作。',
  },
  duozhi: {
    title: '朵致酒店 | 丽呈智旅',
    description: '朵致酒店是丽呈智旅旗下新一代城市精致酒店品牌，主打音乐治愈、香氛社交与年轻质感，面向18-28岁年轻客群，开放投资加盟合作。',
  },
  'ctrip-farm': {
    title: '携程度假农庄 | 丽呈智旅',
    description: '携程度假农庄是乡村野奢度假品牌，品牌主张"住进山野，回归自然"，主打野奢、设计、管家三大核心特质，面向追求品质微度假的城市中产与亲子家庭，开放投资加盟合作。',
  },
  'new-world': {
    title: '新世界酒店 | 丽呈智旅',
    description: '新世界酒店是现代亚洲生活方式奢华酒店品牌，品牌主张“现代亚洲待客之道”，主打东方美学、当代设计、餐饮社交，面向商务客与品质家庭出行人群，开放投资加盟合作。',
  },
};

/** 旧版 hash 链接（#/about）→ 新路径，兼容已分享出去的地址 */
function legacyHashToPath(hash: string): string | null {
  if (!hash || !hash.startsWith('#/')) return null;
  const path = hash.slice(1).split('?')[0];
  return path || '/';
}

// 每个页面独立的标题与描述，避免所有内页共用首页 SEO 信息
const VIEW_META: Record<string, { title: string; description: string }> = {
  home: {
    title: '丽呈智旅官网 | Rezen Smart Travel - 携程旗下酒店数字化经营服务商',
    description: '丽呈智旅是丽呈集团旗下子公司，以OMO住宿生态平台为定位，依托自研REZEN一体化系统与全产业链中台能力，为酒店及中小酒店集团提供全方位数字化经营整体解决方案。',
  },
  about: {
    title: '关于我们 | 丽呈智旅',
    description: '了解丽呈智旅的发展历程、核心团队、生态价值与集团使命，携程旗下酒店数字化经营服务商。',
  },
  brands: {
    title: '品牌矩阵 | 丽呈智旅',
    description: '丽呈智旅旗下丽呈花盛、季枫、富士、巴里岛与个性化五大品牌系列，18 个品牌覆盖全场景旅宿需求。',
  },
  'brand-detail': {
    title: '季枫J酒店 | 丽呈智旅',
    description: '季枫J酒店：灵感轻奢的都会精品据点，以设计美学回应先锋客群，开放投资加盟合作。',
  },
  jiameng: {
    title: '合作优势 | 丽呈智旅',
    description: '丽呈智旅合作优势：九大中央平台赋能、全流程加盟支持、透明物业要求与收费标准，助力酒店业主稳健投资。',
  },
  news: {
    title: '新闻动态 | 丽呈智旅',
    description: '丽呈智旅最新集团动态、签约开业、行业观察与数智科技资讯。',
  },
  'news-detail': {
    title: '新闻详情 | 丽呈智旅',
    description: '丽呈智旅新闻中心文章详情，查看集团最新动态与行业洞察全文。',
  },
  hotels: {
    title: '酒店名录 | 丽呈智旅',
    description: '浏览丽呈智旅旗下各品牌已开业酒店，查看城市、品牌、地址与酒店设施信息。',
  },
};


// 视图 → 规范路径（访问统计上报与 canonical 使用）
const VIEW_PATHS: Record<View, string> = {
  home: '/',
  about: '/about',
  brands: '/brands',
  'brand-detail': '/brands/jifeng-j',
  jiameng: '/jiameng',
  news: '/news',
  'news-detail': '/news',
  hotels: '/hotels',
};

/** 站点正式域名：canonical / og:url / sitemap 统一使用 */
export const SITE_ORIGIN = 'https://www.lczl.net';

/** 写入/更新 head 中的 meta（不存在则创建） */
function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** 写入/更新 canonical 等 link 标签 */
function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/** 同步页面级 SEO / 社交分享信息 */
function syncSeoMeta(options: {
  title: string;
  description: string;
  url: string;
  type?: string;
  image?: string;
}) {
  const { title, description, url, type = 'website', image } = options;
  document.title = title;
  upsertMeta('name', 'description', description);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:type', type);
  upsertMeta('property', 'og:url', url);
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  if (image) {
    upsertMeta('property', 'og:image', image);
    upsertMeta('name', 'twitter:image', image);
  }
  upsertLink('canonical', url);
}


interface SystemModuleRow {
  icon: string;
  title: string;
  items: string;
}

interface RezenSystemCategory {
  id: string;
  enTitle: string;
  zhTitle: string;
  hdBgImage: string;
  accentColor: string;
  modules: SystemModuleRow[];
}

const REZEN_SYSTEMS: RezenSystemCategory[] = [
  {
    id: 'business',
    enTitle: 'BUSINESS',
    zhTitle: '企业系统',
    hdBgImage: '/assets/rezen/sys-business.webp',
    accentColor: '#EE9B27',
    modules: [
      {
        icon: '/assets/rezen/systems/icon_b1.png',
        title: '商务',
        items: '开发资源 / 合作伙伴 / 智能评估 / 项目签约',
      },
      {
        icon: '/assets/rezen/systems/icon_b2.png',
        title: '运营',
        items: '项目管理 / 任务预警 / 运营支持 / 智能支撑',
      },
      {
        icon: '/assets/rezen/systems/icon_b3.png',
        title: '营销',
        items: 'OTA运营 / 积分管理 / 商户营销 / 活动管理',
      },
      {
        icon: '/assets/rezen/systems/icon_b4.png',
        title: '财务',
        items: '合同审核 / 费用管理 / 收款管理/发票管理',
      },
    ],
  },
  {
    id: 'one',
    enTitle: 'One',
    zhTitle: '酒店管理系统',
    hdBgImage: '/assets/rezen/sys-one.webp',
    accentColor: '#38BDF8',
    modules: [
      {
        icon: '/assets/rezen/systems/icon_o1.png',
        title: '管理',
        items: 'PMS / POS / SmartOS',
      },
      {
        icon: '/assets/rezen/systems/icon_o2.png',
        title: '收益',
        items: 'CRS / 满房助手 / 经营分析',
      },
      {
        icon: '/assets/rezen/systems/icon_o3.png',
        title: '客户',
        items: '会员 / 商旅 / 渠道 / 客史',
      },
      {
        icon: '/assets/rezen/systems/icon_o4.png',
        title: '运营',
        items: '采购 / 核算 / 培训 / 质检',
      },
    ],
  },
  {
    id: 'merchant',
    enTitle: 'MERCHANT',
    zhTitle: '供应链系统',
    hdBgImage: '/assets/rezen/sys-merchant.webp',
    accentColor: '#EE9B27',
    modules: [
      {
        icon: '/assets/rezen/systems/icon_m1.png',
        title: '供应商',
        items: '准入 / 储备 / 管理',
      },
      {
        icon: '/assets/rezen/systems/icon_m2.png',
        title: '产品',
        items: '产品开发 / 产品审核 / 价格管理 / 库存管理',
      },
      {
        icon: '/assets/rezen/systems/icon_m3.png',
        title: '订单',
        items: '订单管理 / 支付管理 / 收发货管理',
      },
    ],
  },
  {
    id: 'alliance',
    enTitle: 'ALLIANCE',
    zhTitle: '丽之呈联盟',
    hdBgImage: '/assets/rezen/sys-alliance.webp',
    accentColor: '#EE9B27',
    modules: [
      {
        icon: '/assets/rezen/systems/icon_a1.png',
        title: '住前',
        items: '搜索 / 下单 / 品牌馆',
      },
      {
        icon: '/assets/rezen/systems/icon_a2.png',
        title: '住中',
        items: '选房 / 续住 / 客控',
      },
      {
        icon: '/assets/rezen/systems/icon_a3.png',
        title: '住后',
        items: '商城 / 点评 / 开票',
      },
      {
        icon: '/assets/rezen/systems/icon_a4.png',
        title: '会员',
        items: '权益 / 活动 / 营销',
      },
    ],
  },
];

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
  summary: string;
  content: string[];
  /** 后端新闻 ID：存在时正文在打开详情弹窗时按需拉取 */
  detailId?: number;
  /** 后端富文本正文（HTML） */
  contentHtml?: string;
}

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    title: '食溯本源，一宴知秋 ——“四季淮扬”第三篇章落地丽呈华廷，四城万象寻味金秋',
    date: '2026-10',
    category: '品牌美馔',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    summary: '丽呈华廷酒店携手非遗淮扬菜名厨大师，在全国核心城市联袂呈现秋季专属主厨品鉴宴，以至臻风味弘扬东方宴饮美学。',
    content: [
      '秋风送爽，蟹肥菊黄。丽呈酒店集团旗下奢华品牌“丽呈华廷酒店”于上海、成都、合肥及南京四地联合启幕2026“四季淮扬·秋韵”大师巡礼美馔周。',
      '本次巡礼特别邀请非遗淮扬菜烹饪技艺代表性传承团队亲临现场，以“食溯本源、顺时而食”为灵感，精心打磨“蟹粉狮子头”、“文思软兜”、“金陵桂花鸭”等八道时令代表佳肴。',
      '丽呈华廷秉持“尊崇如一，风雅致远”的待客之道，将中华传统餐饮艺术与现代高规格商宴标准融合，不仅为住店宾客提供私享赏味空间，更树立了高端奢华商务会议与宴饮服务的新标杆。',
    ],
  },
  {
    id: 'news-2',
    title: '超长假期带动长线深度游 丽呈旗下酒店国庆黄金周市场表现亮眼',
    date: '2026-10',
    category: '经营快报',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    summary: '2026国庆黄金周期间，丽呈旗下全国度假酒店与城市核心中高端酒店整体综合入住率与RevPAR创历史同期新高。',
    content: [
      '在为期多日的长假出行热潮中，文旅融合与深度慢调休闲度假成为主流出行形态。丽呈集团全国各省市在营门店整体经营表现亮眼，呈现全线爆发态势。',
      '数据显示，位于长三角、大湾区、滇西北及川西度假线圈的“丽呈别院”系列度假酒店连日满房，平均综合RevPAR同比提升逾29%；城市核心商圈的“丽呈酒店”与“丽呈睿轩”商旅兼顾型酒店亦在假期后半段迎来反向探亲客流高峰。',
      '得益于集团“丽呈ONE”数字化收益管理系统的实时全渠道动态调价模型，旗下数百家加盟门店在保障客户优质入住体验的同时，实现了综合收益的最大化释放。',
    ],
  },
  {
    id: 'news-3',
    title: '丽呈酒店及度假村亮相2026环球旅讯峰会，共探中国数智酒店新未来',
    date: '2026-09',
    category: '行业峰会',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    summary: '丽呈集团管理层受邀出席2026环球旅讯峰会主论坛，并就“生成式AI与数智中台驱动下的酒店资产增效”发表重磅主题演讲。',
    content: [
      '作为亚太地区最具影响力的文旅科技盛会，2026环球旅讯峰会在上海国际会议中心隆重举行。丽呈集团作为中国数字化酒店运营的领军代表应邀出席。',
      '在以《新一代酒店全链数字化重构》为主旨的圆桌对话中，丽呈智旅高管向与会行业专家及近千位投资人系统分享了丽呈在“住前-住中-住后-会员”全生命周期中构建的数字化技术护城河。',
      '通过标准化开放API对接供应链集采平台以及携程亿级高价值会员生态，丽呈正持续降低传统单体酒店连锁化改造门槛，为投资人带来稳健可靠的资本回报周期。',
    ],
  },
  {
    id: 'news-4',
    title: '第50家落子合肥！丽呈别院迎来全国高端度假品牌战略发展重要里程碑',
    date: '2026-09',
    category: '签约开业',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    summary: '丽呈别院第50家签约度假项目正式落子合肥天鹅湖畔，以东方山水隐逸美学与现代智慧客控重新定义皖中高端度假生活。',
    content: [
      '近日，丽呈别院（合肥天鹅湖旗舰店）签约仪式在安徽合肥圆满举行。此项目的落地，标志着丽呈别院在全国重点人文景区与核心都会绿洲的开业签约总量正式突破50家大关。',
      '酒店以“宋风水榭、枕水而眠”为空间规划主轴，设有百余间全景湖景套房、私人汤池院落、雅致茶舍及全日制东方美学私房菜馆。',
      '该酒店全案配备丽呈智旅新一代毫米波雷达免插卡无感取电、智能语音魔镜及自适应恒温恒湿新风系统，为商界菁英与度假家庭呈现科技与诗意交融的东方谧境。',
    ],
  },
  {
    id: 'news-5',
    title: '丽呈ONE智慧酒店系统升级3.0：全面接入大模型生态，赋能加盟业主精准降本增效',
    date: '2026-08',
    category: '数智科技',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    summary: '全新升级的丽呈ONE系统集成智能动态定价算法与自动化能耗管理，助力单店前台及客房人工运营成本进一步压缩18%。',
    content: [
      '丽呈技术研发中心正式发布丽呈ONE系统3.0版本。新版本深度集成了AI房态推演引擎、自动排班算法及房务智慧调度系统。',
      '通过与携程集团大数据底座的无缝对接，系统可提前14天预测商圈热度波动，精准给出最优分时定价建议，帮助前台和运营经理摆脱繁重的数据录入工作。',
      '试点酒店数据显示，接入系统首季度内客房综合打扫周转效率提升35%，客户离店综合好评率上升至4.92分，全面实现了科技赋能人效跃升。',
    ],
  },
  {
    id: 'news-6',
    title: '丽呈睿轩酒店荣获2026亚太空间设计金奖，以“灵动商务”重塑商旅居停新风尚',
    date: '2026-08',
    category: '设计殊荣',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    summary: '凭借兼具高效办公与惬意社交的“第三空间”理念，丽呈睿轩旗舰酒店斩获亚太权威空间设计年度金奖。',
    content: [
      '在刚刚落幕的2026亚太室内空间设计大奖典礼上，丽呈旗下高端中端商旅品牌“丽呈睿轩”凭借创新的“灵动复合大堂”概念脱颖而出，摘得年度最佳酒店空间设计金奖。',
      '评审委员会一致认为，丽呈睿轩打破了传统商务酒店大堂冰冷空旷的功能布局，将日咖夜酒、共享协同办公舱与艺术展陈巧妙糅合。',
      '设计在注重时尚现代视觉体验的同时，大量采用高耐久环保再生复合材料，完美诠释了当代年轻一代商旅人士对高效生活与精致审美的双重追求。',
    ],
  },
  {
    id: 'news-7',
    title: '践行绿色低碳ESG理念，丽呈集团正式启动全国酒店“零碳智居”可持续行动',
    date: '2026-07',
    category: '社会责任',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    summary: '联合权威碳核算机构，丽呈全面推行客房无塑化倡议与智能微电网系统，打造绿色环保文旅新典范。',
    content: [
      '为响应国家双碳战略目标，丽呈集团在深圳举行“绿色文旅·低碳未来”发布会，正式发布集团首部《酒店绿色运营与低碳建造白皮书》。',
      '行动计划涵盖旗下全部运营中及新筹建门店，推进100%可降解洗漱耗材替换、中央空调智能AI错峰节能与分布式光伏清洁能源试点。',
      '丽呈集团承诺至2028年底实现旗下加盟酒店碳排放强度综合下降30%，为每一位选择丽呈的旅人提供安心、健康且环境友好的绿色居所。',
    ],
  },
  {
    id: 'news-8',
    title: '丽呈公寓提速布局核心城市群，深莞两地核心商务枢纽项目相继签约入驻',
    date: '2026-07',
    category: '拓展布局',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    summary: '面向现代都会精英长短租多元需求，丽呈公寓在粤港澳大湾区进一步织密网络，带来高品质服务式公寓新选择。',
    content: [
      '丽呈集团旗下服务式公寓品牌“丽呈公寓”于本周在深圳南山科技园与东莞松山湖高新区同步完成两座新项目的正式签约。',
      '两家全新公寓总计规划逾600间高星级客房与行政套房，配备24小时专属管家服务、共享健身房、自助洗衣房及全景商务空中酒廊。',
      '丽呈公寓凭借灵活的“租住融通”收益模式与成熟的物业管理体系，正加速赢得一二线核心城市优质存量物业业主和投资机构的青睐。',
    ],
  },
  {
    id: 'news-9',
    title: '丽呈会会员生态与携程高端权益全面互通，升级客房及延退礼遇即刻尊享',
    date: '2026-06',
    category: '会员专享',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    summary: '双方会员权益池深度联动，丽呈会金卡及以上会员可无缝匹配顶级平台特权，尊享免费早餐、房型升阶等八重礼遇。',
    content: [
      '为了让更多会员享有跨平台高品质权益，丽呈会宣布与携程旅行会员体系达成战略升级合作协议。',
      '丽呈会注册会员可一键互通携程积分与住宿特权，享受全国超千家参与酒店的专属房费折扣、提前入住至早10点、延迟退房至下午16点及迎宾水果鲜酿等贴心礼遇。',
      '未来双方还将联名推出跨界主题会员日，为高频商旅用户及家庭度假旅客打造全周期的忠诚度奖励体验。',
    ],
  },
  {
    id: 'news-10',
    title: '寻味非遗·入住山水，丽呈别院携手非遗传承人开启“东方在地文化季”',
    date: '2026-06',
    category: '文化艺术',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    summary: '走入千年古镇与茶山秘境，丽呈别院以在地文化为纽带，让宾客在诗意栖居中感受非遗文化的历久弥新。',
    content: [
      '丽呈别院年度文化季首站选址风景秀丽的江南水乡与徽州古村落。活动期间，凡下榻酒店的客人均可参与“点茶问道”、“古法制香”及“竹编手作”等深度非遗工坊。',
      '丽呈别院主理人表示，酒店不仅是一个歇脚的居所，更是连接旅人与在地历史文化的桥梁。通过持续引入民间非遗大师，让度假时光多一份心安与温润。',
      '本次文化季将持续贯穿整个夏秋两季，并在全国12家特色丽呈别院巡回举行，为宾客带来回味无穷的文化度假记忆。',
    ],
  },
];

/**
 * Renders the user's exact uploaded REZEN Group logo image:
 * - variant="light": /assets/rezen/logo_light.png (trimmed directly from /assets/aistudio/rz_6f473024.png)
 * - variant="dark": /assets/rezen/logo_dark.png (same exact image with dark REZEN + grey Group for white scrolled header)
 */
const RezenGroupLogo: React.FC<{ variant: 'light' | 'dark'; className?: string }> = ({
  variant,
  className = 'h-[28px] w-auto',
}) => {
  return (
    <img
      src={variant === 'light' ? '/assets/rezen/logo_light.png' : '/assets/rezen/logo_dark.png'}
      alt="REZEN Group"
      className={`${className} object-contain select-none`}
      draggable={false}
    />
  );
};

/** 品牌详情路由 slug → 详情页品牌系列 id（季枫四个品牌共用同一详情页） */
const BRAND_DETAIL_SERIES: Record<string, string> = {
  'jifeng-j': 'j',
  'jifeng-intl': 'international',
  jifeng: 'hotel',
  'jifeng-resort': 'resort',
  // 丽呈花盛系列
  'grand-rezen': 'hs-international',
  'rezen-huasheng': 'hs-hotel',
  'rezen-huasheng-resort': 'hs-resort',
  // 富士系列（复用季枫结构，后续逐个改造）
  'fuji-liya': 'fj-liya',
  'fuji-yazhi': 'fj-yazhi',
  'fuji-intl': 'fj-intl',
  'fuji-yuezhi': 'fj-yuezhi',
  // 巴里岛系列（复用季枫结构，后续逐个改造）
  'balidao-intl': 'bld-intl',
  'balidao-resort': 'bld-resort',
  'balidao-holiday': 'bld-holiday',
  // 丽钻酒店（单品牌）
  lizuan: 'lz',
  // 朵致酒店（单品牌，复制丽钻结构）
  duozhi: 'dz',
  // 携程度假农庄（单品牌，复制丽钻结构）
  'ctrip-farm': 'cf',
  // 新世界酒店（单品牌，复制丽钻结构）
  'new-world': 'nw',
};

const hasBrandDetail = (brandId: string) => brandId in BRAND_DETAIL_SERIES;

/** 品牌详情页所属品牌系列（季枫 / 丽呈花盛 / 富士 / 巴里岛 / 丽钻 / 朵致 / 携程农庄 / 新世界），用于顶部页头文案 */
export type BrandCollection = 'jifeng' | 'huasheng' | 'fuji' | 'balidao' | 'lizuan' | 'duozhi' | 'ctrip-farm' | 'new-world';
const HUASHENG_BRANDS = new Set(['grand-rezen', 'rezen-huasheng', 'rezen-huasheng-resort']);
const FUJI_BRANDS = new Set(['fuji-liya', 'fuji-yazhi', 'fuji-intl', 'fuji-yuezhi']);
const BALIDAO_BRANDS = new Set(['balidao-intl', 'balidao-resort', 'balidao-holiday']);
const LIZUAN_BRANDS = new Set(['lizuan']);
const DUOZHI_BRANDS = new Set(['duozhi']);
const CTRIP_FARM_BRANDS = new Set(['ctrip-farm']);
const NEW_WORLD_BRANDS = new Set(['new-world']);
function brandCollectionFromPath(pathname: string): BrandCollection {
  const slug = pathname.replace(/\/+$/, '').split('/')[2] ?? '';
  if (HUASHENG_BRANDS.has(slug)) return 'huasheng';
  if (FUJI_BRANDS.has(slug)) return 'fuji';
  if (BALIDAO_BRANDS.has(slug)) return 'balidao';
  if (LIZUAN_BRANDS.has(slug)) return 'lizuan';
  if (DUOZHI_BRANDS.has(slug)) return 'duozhi';
  if (CTRIP_FARM_BRANDS.has(slug)) return 'ctrip-farm';
  if (NEW_WORLD_BRANDS.has(slug)) return 'new-world';
  return 'jifeng';
}

/** 从 /brands/xxx 路径解析默认品牌系列 */
function brandSeriesFromPath(pathname: string): string {
  const slug = pathname.replace(/\/+$/, '').split('/')[2] ?? '';
  const fallbackSlug = HUASHENG_BRANDS.has(slug)
    ? 'grand-rezen'
    : FUJI_BRANDS.has(slug)
      ? 'fuji-liya'
      : BALIDAO_BRANDS.has(slug)
        ? 'balidao-intl'
        : LIZUAN_BRANDS.has(slug)
          ? 'lizuan'
          : DUOZHI_BRANDS.has(slug)
            ? 'duozhi'
            : CTRIP_FARM_BRANDS.has(slug)
              ? 'ctrip-farm'
              : NEW_WORLD_BRANDS.has(slug)
                ? 'new-world'
                : 'jifeng-j';
  return BRAND_DETAIL_SERIES[slug] ?? BRAND_DETAIL_SERIES[fallbackSlug];
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>(() => {
    if (typeof window === 'undefined') return 'home';
    // 兼容旧版 hash 地址：把 #/about 转成 /about，已分享的链接依然可用
    const legacyPath = legacyHashToPath(window.location.hash);
    if (legacyPath) window.history.replaceState({}, '', legacyPath);
    return viewFromPath(window.location.pathname);
  });
  // 品牌详情页当前 slug 对应的品牌系列（用于默认选中对应菜单）
  const [brandSeriesId, setBrandSeriesId] = useState<string>(() =>
    typeof window === 'undefined' ? BRAND_DETAIL_SERIES['jifeng-j'] : brandSeriesFromPath(window.location.pathname),
  );
  // 品牌详情页所属系列（季枫 / 丽呈花盛）
  const [brandCollection, setBrandCollection] = useState<BrandCollection>(() =>
    typeof window === 'undefined' ? 'jifeng' : brandCollectionFromPath(window.location.pathname),
  );
  const [isScrolled, setIsScrolled] = useState(false);
  // 返回顶部按钮：页面下拉一定距离后悬浮出现，所有页面通用
  const [showBackTop, setShowBackTop] = useState(false);
  // 移动端汉堡菜单展开状态
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [heroSlide, setHeroSlide] = useState<number>(0);
  // 后台动态下发的首页 Banner（接口失败时组件内自动回退默认两屏）
  const [heroSlides, setHeroSlides] = useState<HeroSlide[] | null>(null);
  // 首页「近期动态」数据源（接口失败时回退内置静态数据）
  const [homeNews, setHomeNews] = useState<NewsItem[]>(NEWS_ITEMS);
  const [activeSystemIdx, setActiveSystemIdx] = useState<number>(0);
  const [hoveredModuleIdx, setHoveredModuleIdx] = useState<number>(0);

  // 顶栏「合作咨询」弹窗
  const [consultOpen, setConsultOpen] = useState(false);
  const [consultSubmitted, setConsultSubmitted] = useState(false);
  const [consultSubmitting, setConsultSubmitting] = useState(false);
  const [consultData, setConsultData] = useState({ name: '', phone: '', city: '', demand: '' });

  // 启动时初始化归因（visitor_id / 入站 referrer / UTM），并拉取后台动态下发的 Banner 与新闻
  useEffect(() => {
    initAttribution();
    fetchBanners().then((list) => {
      if (list && list.length > 0) {
        setHeroSlides(list.map((b) => ({ title: b.title, subtitle: b.subtitle, image: b.image, link: b.link })));
      }
    });
    fetchNewsList(1, 4).then((data) => {
      if (data) {
        setHomeNews(
          data.list.map((n) => ({
            id: `api-${n.id}`,
            detailId: n.id,
            title: n.title,
            date: n.publishedAt,
            category: n.category,
            image: n.cover,
            summary: n.summary,
            content: [],
          })),
        );
      }
    });
  }, []);

  // 弹窗打开时锁定页面滚动并支持 Esc 关闭
  useEffect(() => {
    if (!consultOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setConsultOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [consultOpen]);

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultData.name.trim() || !consultData.phone.trim()) {
      alert('请填写姓名和联系电话');
      return;
    }
    setConsultSubmitting(true);
    try {
      await submitLead({ source: '合作咨询', formType: 'consult', ...consultData });
      setConsultSubmitted(true);
      setConsultData({ name: '', phone: '', city: '', demand: '' });
    } catch (err) {
      alert(err instanceof Error ? err.message : '提交失败，请稍后重试或致电 400-688-6527');
    } finally {
      setConsultSubmitting(false);
    }
  };


  // Recent News section state
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  // 新闻详情页正文加载中（后端详情按需拉取）
  const [newsLoading, setNewsLoading] = useState<boolean>(false);

  // 页面跳转：写入 History 路径并切换视图（路径路由，便于搜索引擎收录）
  const goTo = React.useCallback((path: string) => {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    const legacyPath = legacyHashToPath(window.location.hash);
    if (legacyPath) window.history.replaceState({}, '', normalized);
    if (window.location.pathname !== normalized || window.location.hash) {
      window.history.pushState({}, '', normalized);
    }
    setCurrentView(viewFromPath(normalized));
    setBrandSeriesId(brandSeriesFromPath(normalized));
    setBrandCollection(brandCollectionFromPath(normalized));
    resetScrollTop();
  }, []);

  // 浏览器前进/后退时同步视图
  useEffect(() => {
    const handlePopState = () => {
      const legacyPath = legacyHashToPath(window.location.hash);
      if (legacyPath) window.history.replaceState({}, '', legacyPath);
      setCurrentView(viewFromPath(window.location.pathname));
      setBrandSeriesId(brandSeriesFromPath(window.location.pathname));
      setBrandCollection(brandCollectionFromPath(window.location.pathname));
      resetScrollTop();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 切换页面时同步标题、description、canonical、分享卡片信息，回到页面顶部，并上报访问统计
  useEffect(() => {
    const detailSlug = window.location.pathname.replace(/\/+$/, '').split('/')[2] ?? '';
    const meta =
      currentView === 'brand-detail' && BRAND_DETAIL_META[detailSlug]
        ? BRAND_DETAIL_META[detailSlug]
        : VIEW_META[currentView];
    if (!meta) return;
    document.title = meta.title;
    const canonicalUrl = `${SITE_ORIGIN}${window.location.pathname}`;
    syncSeoMeta({
      title: meta.title,
      description: meta.description,
      url: canonicalUrl,
      type: 'website',
    });
    trackView(window.location.pathname || '/', meta.title);
    resetScrollTop();
    // 浏览器处理 hash 跳转后可能再次恢复滚动位置，等一帧后再校正一次
    const raf = window.requestAnimationFrame(() => resetScrollTop());
    return () => window.cancelAnimationFrame(raf);
  }, [currentView, brandSeriesId, brandCollection]);

  // 打开新闻详情：跳转到独立详情页，后端数据按需拉取富文本正文（接口侧自动累计阅读量）
  const openNews = async (item: NewsItem) => {
    goTo(`/news/${item.id}`);
    if (!item.detailId) {
      setSelectedNews(item);
      return;
    }
    setSelectedNews(item);
    const detail = await fetchNewsDetail(item.detailId);
    if (detail) {
      setSelectedNews((prev) =>
        prev && prev.detailId === item.detailId
          ? { ...prev, contentHtml: detail.content, summary: detail.summary }
          : prev,
      );
    }
  };

  // 直达链接（如 /news/api-12）进入详情页时解析文章数据
  useEffect(() => {
    if (currentView !== 'news-detail') return;
    const id = window.location.pathname.replace(/^\/news\//, '').split('?')[0];
    if (!id) return;
    if (selectedNews && selectedNews.id === id) return;

    // 本地静态文章：直接取用，有后端 ID 再补拉正文
    const local = [...NEWS_ITEMS, ...EXTENDED_NEWS_LIST].find((n) => n.id === id);
    if (local) {
      setSelectedNews(local);
      if (local.detailId) {
        setNewsLoading(true);
        fetchNewsDetail(local.detailId)
          .then((detail) => {
            if (!detail) return;
            setSelectedNews((prev) =>
              prev && prev.id === local.id
                ? { ...prev, contentHtml: detail.content, summary: detail.summary }
                : prev,
            );
          })
          .finally(() => setNewsLoading(false));
      }
      return;
    }

    // 仅存在于后端的新闻：支持 /news/<id> 与 /news/api-<id> 两种直达链接
    const numericId = id.startsWith('api-') ? Number(id.slice(4)) : Number(id);
    if (Number.isFinite(numericId) && numericId > 0) {
      let cancelled = false;
      setNewsLoading(true);
      setSelectedNews(null);
      fetchNewsDetail(numericId)
        .then((detail) => {
          if (cancelled || !detail) return;
          setSelectedNews({
            id: `api-${numericId}`,
            detailId: numericId,
            title: detail.title,
            date: detail.publishedAt,
            category: detail.category,
            image: detail.cover,
            summary: detail.summary,
            content: [],
            contentHtml: detail.content,
          });
        })
        .finally(() => {
          if (!cancelled) setNewsLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }

    setSelectedNews(null);
  }, [currentView]);

  // 新闻详情：标题、描述、分享图与 Article 结构化数据（利于搜索引擎与 AI 摘要）
  useEffect(() => {
    if (currentView !== 'news-detail' || !selectedNews) return;
    const canonicalUrl = `${SITE_ORIGIN}${window.location.pathname}`;
    const cover = selectedNews.image.startsWith('http')
      ? selectedNews.image
      : `${SITE_ORIGIN}${selectedNews.image}`;
    syncSeoMeta({
      title: `${selectedNews.title} | 丽呈智旅`,
      description: selectedNews.summary,
      url: canonicalUrl,
      type: 'article',
      image: cover,
    });
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'NewsArticle',
          headline: selectedNews.title,
          description: selectedNews.summary,
          image: [cover],
          datePublished: selectedNews.date,
          dateModified: selectedNews.date,
          articleSection: selectedNews.category,
          author: { '@type': 'Organization', name: '丽呈智旅' },
          publisher: {
            '@type': 'Organization',
            name: '丽呈智旅',
            logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/assets/rezen/logo_dark.png` },
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE_ORIGIN}/` },
            { '@type': 'ListItem', position: 2, name: '新闻动态', item: `${SITE_ORIGIN}/news` },
            { '@type': 'ListItem', position: 3, name: selectedNews.title, item: canonicalUrl },
          ],
        },
      ],
    };
    document.getElementById('article-jsonld')?.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'article-jsonld';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => {
      document.getElementById('article-jsonld')?.remove();
    };
  }, [currentView, selectedNews]);

  const handleNavClick = (id: string, href: string) => {
    if (id === 'hotels') {
      goTo('/hotels');
      return;
    }

    if (id === 'news') {
      goTo('/news');
      return;
    }

    if (id === 'coop' || id === 'jiameng' || id === 'advantages') {
      goTo('/jiameng');
      return;
    }

    if (id === 'brands') {
      goTo('/brands');
      return;
    }

    if (id === 'about') {
      goTo('/about');
      return;
    }

    if (id === 'home') {
      goTo('/');
      return;
    }

    if (currentView === 'about' || currentView === 'brands' || currentView === 'brand-detail' || currentView === 'jiameng' || currentView === 'news' || currentView === 'hotels') {
      goTo('/');
      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        } else {
          resetScrollTop();
        }
      }, 80);
    } else {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Counter animation state for Section 2 ("丽呈集团 / 提供酒店数字化经营整体解决方案")
  const statsSectionRef = useRef<HTMLElement | null>(null);
  const [statsProgress, setStatsProgress] = useState(1);
  const hasAnimatedStatsRef = useRef(false);

  // Message board form state
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Header scroll listener: collapses top-center logo to far-left on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
      setShowBackTop(window.scrollY > 400);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 移动端菜单：切换页面自动收起；展开时锁定页面滚动并支持 Esc 关闭
  useEffect(() => {
    setMobileNavOpen(false);
  }, [currentView]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileNavOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileNavOpen]);

  // Auto-advance Hero Carousel between Slide 0 (Skybridge HQ) and Slide 1 (Cliff & Sea)
  // 手动切换后重新计时，避免刚点完就被自动轮播切走
  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroSlide((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => window.clearInterval(timer);
  }, [heroSlide]);

  // Count-up animation when Section 2 enters viewport (matching 00:14 - 00:18 in video)
  useEffect(() => {
    const el = statsSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimatedStatsRef.current) {
          hasAnimatedStatsRef.current = true;
          const duration = 1500;
          const start = performance.now();

          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - t, 3);
            setStatsProgress(eased);
            if (t < 1) {
              requestAnimationFrame(tick);
            }
          };
          setStatsProgress(0.15);
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const formatNumber = (val: number) => Math.round(val).toLocaleString('en-US');

  // 页脚合作留言与顶栏合作咨询共用同一份表单数据（字段：姓名/电话/意向城市/需求）
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultData.name.trim() || !consultData.phone.trim()) {
      alert('请填写姓名和联系电话');
      return;
    }
    try {
      await submitLead({ source: '合作咨询', formType: 'consult', ...consultData });
      setFormSubmitted(true);
      setTimeout(() => {
        setConsultData({ name: '', phone: '', city: '', demand: '' });
        setFormSubmitted(false);
      }, 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : '提交失败，请稍后重试或致电 400-688-6527');
    }
  };

  return (
    <div id="top" className="min-h-screen w-full bg-white text-[#111111] selection:bg-[#F09A26] selection:text-white">
      {/* =====================================================================
          FIXED HEADER:
          - At top (scrollY <= 30): 2-row transparent header over Hero.
            Logo is centered in Row 1; 7 nav items with | dividers are in Row 2.
          - Scrolled (scrollY > 30): Collapses into 1-row 90px white sticky bar.
            Logo smoothly glides to the far left (left-[56px] xl:left-[72px]),
            and the 7 nav items move up into the center of the single white bar.
         ===================================================================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled
            ? 'h-[64px] md:h-[90px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]'
            : 'h-[64px] md:h-[134px] bg-transparent'
        }`}
      >
        <div className="relative w-full h-full">
          {/* 移动端顶栏：logo 居左 + 汉堡菜单（桌面端隐藏） */}
          <div className="md:hidden absolute inset-x-0 top-0 h-[64px] flex items-center justify-between px-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setMobileNavOpen(false);
                handleNavClick('home', '#top');
              }}
              className="flex items-center gap-2 min-w-0"
            >
              <RezenGroupLogo
                variant={isScrolled ? 'dark' : 'light'}
                className="h-[24px] w-auto shrink-0"
              />
              <span
                className={`text-[15px] font-medium tracking-[0.08em] leading-none truncate ${
                  isScrolled ? 'text-[#111111]' : 'text-white'
                }`}
              >
                丽呈智旅
              </span>
            </a>
            <button
              type="button"
              aria-label={mobileNavOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((v) => !v)}
              className={`shrink-0 -mr-1 p-2 rounded-md transition-colors ${
                isScrolled ? 'text-[#111111]' : 'text-white'
              }`}
            >
              {mobileNavOpen ? <X className="w-6 h-6" strokeWidth={1.8} /> : <Menu className="w-6 h-6" strokeWidth={1.8} />}
            </button>
          </div>

          {/* Center-to-Left Animating REZEN Group Logo (+ 丽呈智旅 only when at top) */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home', '#top');
            }}
            className={`hidden md:flex absolute z-20 items-center whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer ${
              isScrolled
                ? 'left-[28px] xl:left-[64px] translate-x-0 top-[31px]'
                : 'left-1/2 -translate-x-1/2 top-[23px] gap-3.5'
            }`}
          >
            <RezenGroupLogo
              variant={isScrolled ? 'dark' : 'light'}
              className={isScrolled ? 'h-[26px] xl:h-[28px] w-auto' : 'h-[28px] w-auto'}
            />
            {!isScrolled && (
              <>
                <span className="h-[18px] w-px bg-white/40" aria-hidden="true" />
                <span className="text-[21px] font-medium tracking-[0.12em] leading-none text-white">
                  丽呈智旅
                </span>
              </>
            )}
          </a>

          {/* Full-width 1px white/25 horizontal divider line (visible at top, fades out on scroll) */}
          <div
            className={`hidden md:block absolute left-0 right-0 top-[78px] h-px bg-white/25 transition-opacity duration-300 ${
              isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          />

          {/* 7 Navigation Links:
              - At top: sits in Row 2 (top-[79px] h-[55px]) with short vertical | dividers
              - Scrolled: rises into the center of the 90px white bar (top-0 h-[90px]) with safe left clearance */}
          <nav
            aria-label="主导航"
            className={`relative hidden md:flex w-full items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isScrolled ? 'pt-0 h-[90px] pl-[220px] pr-[150px] xl:pr-[180px] 2xl:px-0' : 'pt-[79px] h-[134px]'
            }`}
          >
            <ul className="flex items-center">
              {NAV_ITEMS.map((item, idx) => {
                const isActive =
                  (currentView === 'hotels' && item.id === 'hotels') ||
                  (currentView === 'news' && item.id === 'news') ||
                  (currentView === 'news-detail' && item.id === 'news') ||
                  (currentView === 'jiameng' && item.id === 'coop') ||
                  ((currentView === 'brands' || currentView === 'brand-detail') && item.id === 'brands') ||
                  (currentView === 'about' && item.id === 'about') ||
                  (currentView === 'home' && item.id === 'home' && !isScrolled);
                return (
                  <React.Fragment key={item.id}>
                    <li>
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(item.id, item.href);
                        }}
                        className={`inline-block pb-1.5 text-[15px] whitespace-nowrap tracking-[0.04em] transition-all duration-300 relative cursor-pointer ${
                          isScrolled
                            ? isActive
                              ? 'px-3.5 lg:px-5 xl:px-7 text-[#F09A26] font-semibold'
                              : 'px-3.5 lg:px-5 xl:px-7 text-[#111111] hover:text-[#F09A26] font-medium'
                            : isActive
                              ? 'px-6 lg:px-8 xl:px-12 text-[#F09A26] font-semibold'
                              : 'px-6 lg:px-8 xl:px-12 text-white hover:text-[#F09A26] font-medium'
                        }`}
                      >
                        {item.label}
                        {isActive && (
                          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#F09A26] rounded-full" />
                        )}
                      </a>
                    </li>
                    {idx < NAV_ITEMS.length - 1 && (
                      <li
                        aria-hidden="true"
                        className={`h-[10px] w-px bg-white/35 select-none transition-opacity duration-300 ${
                          isScrolled ? 'opacity-0 w-0' : 'opacity-100'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </ul>
          </nav>

          {/* 顶栏右侧「合作咨询」入口（仅滚动后的白色导航条显示） */}
          <button
            type="button"
            onClick={() => {
              setConsultSubmitted(false);
              setConsultOpen(true);
            }}
            className={`animate-consult-breath absolute right-[24px] xl:right-[64px] top-1/2 z-20 hidden md:inline-flex items-center gap-2 h-[40px] px-[20px] rounded-[6px] bg-[linear-gradient(135deg,#F4A93F_0%,#EC9018_100%)] hover:bg-[linear-gradient(135deg,#F09A26_0%,#E2860D_100%)] text-white text-[14px] font-medium tracking-[0.04em] whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer ${
              isScrolled
                ? 'opacity-100 pointer-events-auto -translate-y-1/2 translate-x-0'
                : 'opacity-0 pointer-events-none -translate-y-1/2 translate-x-2'
            }`}
          >
            <Handshake className="w-[16px] h-[16px] shrink-0" strokeWidth={1.6} aria-hidden="true" />
            合作咨询
          </button>
        </div>
      </header>

      {/* 移动端全屏导航面板 */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-[120] bg-[#0B0F19]/95 backdrop-blur-md overflow-y-auto">
          <div className="flex h-[64px] items-center justify-between px-4">
            <span className="flex items-center gap-2">
              <RezenGroupLogo variant="light" className="h-[24px] w-auto shrink-0" />
              <span className="text-[15px] tracking-[0.08em] leading-none text-white/90">丽呈智旅</span>
            </span>
            <button
              type="button"
              aria-label="关闭菜单"
              onClick={() => setMobileNavOpen(false)}
              className="p-2 -mr-1 text-white"
            >
              <X className="w-6 h-6" strokeWidth={1.8} />
            </button>
          </div>

          <nav aria-label="移动端导航" className="px-6 pt-2 pb-10">
            <ul className="flex flex-col">
              {NAV_ITEMS.map((item) => (
                <li key={item.id} className="border-b border-white/10">
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileNavOpen(false);
                      handleNavClick(item.id, item.href);
                    }}
                    className="flex items-center justify-between py-4 text-[17px] tracking-[0.02em] text-white/90 active:text-[#F09A26]"
                  >
                    {item.label}
                    <span aria-hidden="true" className="text-white/25">
                      ›
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => {
                setMobileNavOpen(false);
                setConsultSubmitted(false);
                setConsultOpen(true);
              }}
              className="mt-8 flex h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#F4A93F_0%,#EC9018_100%)] text-[15px] font-medium text-white"
            >
              <Handshake className="w-4 h-4" strokeWidth={1.8} aria-hidden="true" />
              合作咨询
            </button>

            <a
              href="tel:4006886527"
              className="mt-6 block text-center text-[12px] text-white/40 tracking-[0.04em]"
            >
              400-688-6527
            </a>
          </nav>
        </div>
      )}

      {currentView === 'about' ? (
        <AboutUsPage
          onNavigateHome={(targetAnchor) => {
            const anchor = targetAnchor || '#top';
            handleNavClick(anchor === '#top' ? 'home' : anchor.replace('#', ''), anchor);
          }}
        />
      ) : currentView === 'brand-detail' ? (
        <BrandDetailPage
          key={`${brandCollection}-${brandSeriesId}`}
          initialSeriesId={brandSeriesId}
          collection={brandCollection}
          onBack={() => goTo('/brands')}
          onNavigateHome={(targetAnchor) => {
            const anchor = targetAnchor || '#top';
            handleNavClick(anchor === '#top' ? 'home' : anchor.replace('#', ''), anchor);
          }}
        />
      ) : currentView === 'brands' ? (
        <BrandMatrixPage
          onNavigateHome={(targetAnchor) => {
            const anchor = targetAnchor || '#top';
            handleNavClick(anchor === '#top' ? 'home' : anchor.replace('#', ''), anchor);
          }}
          onSelectBrandDetail={(brandId) => {
            if (hasBrandDetail(brandId)) goTo(`/brands/${brandId}`);
          }}
        />
      ) : currentView === 'jiameng' ? (
        <CooperationFranchisePage
          onNavigateHome={(targetAnchor) => {
            const anchor = targetAnchor || '#top';
            handleNavClick(anchor === '#top' ? 'home' : anchor.replace('#', ''), anchor);
          }}
        />
      ) : currentView === 'news-detail' ? (
        <NewsDetailPage
          article={selectedNews}
          loading={newsLoading}
          onBack={() => {
            // 优先浏览器后退，保留列表页 ?page= 页码；直达链接打开（无历史记录）时回退到列表首页
            if (window.history.length > 1) {
              window.history.back();
            } else {
              goTo('/news');
            }
          }}
        />
      ) : currentView === 'news' ? (
        <NewsPage
          onNavigateHome={(targetAnchor) => {
            const anchor = targetAnchor || '#top';
            handleNavClick(anchor === '#top' ? 'home' : anchor.replace('#', ''), anchor);
          }}
          onSelectNews={openNews}
        />
      ) : currentView === 'hotels' ? (
        <HotelDirectoryPage
          onNavigateHome={(targetAnchor) => {
            const anchor = targetAnchor || '#top';
            handleNavClick(anchor === '#top' ? 'home' : anchor.replace('#', ''), anchor);
          }}
        />
      ) : (
        <>
          {/* =====================================================================
              SECTION 1: FULL-SCREEN HERO CAROUSEL (100vh)
              Matches 00:00 - 00:14 of rezen_05a8ebb8.mp4
             ===================================================================== */}
      <section className="relative w-full h-screen min-h-[680px] overflow-hidden select-none">
        {/* 首屏标题：视觉上不占位，供搜索引擎与 AI 抓取识别页面主题 */}
        <h1 className="sr-only">丽呈智旅 · 携程旗下酒店数字化经营服务商</h1>
        <HeroCanvasBackground activeSlide={heroSlide} onSelectSlide={setHeroSlide} slides={heroSlides} />

        {/* Bottom-Center Capsule Mouse Scroll Indicator */}
        <a
          href="#stats"
          aria-label="向下滚动"
          className="absolute left-1/2 -translate-x-1/2 bottom-[26px] z-20 flex flex-col items-center group cursor-pointer"
        >
          <div className="w-[20px] h-[34px] rounded-full border-[1.5px] border-white/85 flex items-end justify-center pb-[6px] group-hover:border-white transition-colors">
            <span className="w-[3px] h-[3px] rounded-full bg-white animate-scroll-dot" />
          </div>
        </a>
      </section>

      {/* =====================================================================
          SECTION 2: 丽呈集团 + 4 ORANGE COUNTERS
          Matches 00:14 - 00:19 (f_18_stats.png)
         ===================================================================== */}
      <section
        id="stats"
        ref={statsSectionRef}
        className="relative w-full bg-white pt-[104px] pb-[86px] overflow-hidden"
      >
        {/* Subtle 3D flowing grey wave mesh SVG background across the middle */}
        <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 pointer-events-none opacity-45 select-none">
          <svg viewBox="0 0 1920 360" fill="none" className="w-full h-[290px]" preserveAspectRatio="none">
            {Array.from({ length: 18 }).map((_, i) => {
              const yOffset = i * 8;
              return (
                <path
                  key={i}
                  d={`M -100 ${110 + yOffset} C 380 ${-20 + yOffset * 1.2}, 820 ${290 - yOffset * 0.6}, 1360 ${
                    140 + yOffset * 0.8
                  } C 1650 ${60 + yOffset}, 1840 ${180 - yOffset * 0.5}, 2020 ${130 + yOffset}`}
                  stroke="#E5E8EC"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                  fill="none"
                />
              );
            })}
          </svg>
        </div>

        <div className="relative z-10 max-w-[1220px] mx-auto px-6">
          {/* Section Title */}
          <div className="text-center">
            <h2 className="text-[34px] md:text-[38px] font-bold text-[#111111] tracking-[0.04em] leading-[1.25] mb-3">
              丽之呈联盟
            </h2>
            <p className="text-[18px] md:text-[20px] font-normal text-[#111111] tracking-[0.03em]">
              提供酒店数字化经营整体解决方案
            </p>
          </div>

          {/* 4 Animated Orange Counter Columns */}
          <div className="mt-[88px] grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 text-center">
            {/* Stat 1: 1000+ 开业酒店 */}
            <div className="flex flex-col items-center">
              <div className="flex items-baseline justify-center">
                <span className="text-[44px] lg:text-[52px] font-normal text-[#EE9B27] leading-none tracking-tight tabular-nums">
                  {Math.round(1000 * statsProgress)}
                </span>
                <span className="text-[18px] font-bold text-[#111111] ml-1">+</span>
              </div>
              <span className="text-[14px] text-[#222222] mt-4 tracking-[0.04em]">开业酒店</span>
            </div>

            {/* Stat 2: 110,000+ 客房数量 */}
            <div className="flex flex-col items-center">
              <div className="flex items-baseline justify-center">
                <span className="text-[44px] lg:text-[52px] font-normal text-[#EE9B27] leading-none tracking-tight tabular-nums">
                  {formatNumber(110000 * statsProgress)}
                </span>
                <span className="text-[18px] font-bold text-[#111111] ml-1">+</span>
              </div>
              <span className="text-[14px] text-[#222222] mt-4 tracking-[0.04em]">客房数量</span>
            </div>

            {/* Stat 3: 340+ 覆盖城市 */}
            <div className="flex flex-col items-center">
              <div className="flex items-baseline justify-center">
                <span className="text-[44px] lg:text-[52px] font-normal text-[#EE9B27] leading-none tracking-tight tabular-nums">
                  {Math.round(340 * statsProgress)}
                </span>
                <span className="text-[18px] font-bold text-[#111111] ml-1">+</span>
              </div>
              <span className="text-[14px] text-[#222222] mt-4 tracking-[0.04em]">覆盖城市</span>
            </div>

            {/* Stat 4: 3,500万+ 丽呈会员 */}
            <div className="flex flex-col items-center">
              <div className="flex items-baseline justify-center">
                <span className="text-[44px] lg:text-[52px] font-normal text-[#EE9B27] leading-none tracking-tight tabular-nums">
                  {formatNumber(3500 * statsProgress)}
                </span>
                <span className="text-[18px] font-bold text-[#111111] ml-1">万+</span>
              </div>
              <span className="text-[14px] text-[#222222] mt-4 tracking-[0.04em]">丽呈会员</span>
            </div>
          </div>

          {/* Right-aligned footnote under the 4th stat column */}
          <div className="mt-11 grid grid-cols-1 md:grid-cols-4">
            <div className="md:col-start-4 text-center">
              <span className="text-[13px] text-[#7A7A7A] tracking-[0.02em]">
                *数据统计时间截止2026年9月
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: 丽呈智旅品牌矩阵 (4 TIERS WITH ROUNDED HOTEL PHOTO CARDS)
          1:1 replica of Wanda brand matrix layout & aesthetic
         ===================================================================== */}
      <section id="brand-matrix" className="w-full bg-[#FAFAFB] pt-[84px] pb-[120px]">
        <div className="max-w-[1620px] mx-auto px-6 lg:px-[65px]">
          {/* Section Heading */}
          <div id="value" className="text-center mb-[68px]">
            <h2 className="text-[34px] md:text-[38px] font-bold text-[#111111] tracking-[0.04em] leading-[1.25] mb-3">
              丽呈智旅&丽之呈联盟品牌矩阵
            </h2>
            <p className="text-[17px] md:text-[19px] font-normal text-[#666666] tracking-[0.03em]">
              构建多层级住宿生态 · 缔造全场景旅宿价值
            </p>
          </div>

          {/* 4 Tiers Stacked Vertically */}
          <div className="space-y-[64px]">
            {BRAND_MATRIX_TIERS.map((tier) => (
              <div key={tier.id} className="space-y-[26px]">
                {/* Tier Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#E5E7EB] pb-3.5 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EE9B27]" />
                    <h3 className="text-[22px] md:text-[24px] font-bold text-[#111111] tracking-[0.04em]">
                      {tier.tierNameZh}
                    </h3>
                    <span className="text-[13px] font-semibold text-[#888888] tracking-[0.14em] uppercase ml-1">
                      {tier.tierNameEn}
                    </span>
                  </div>
                  <p className="text-[14px] text-[#777777] tracking-[0.02em]">
                    {tier.desc}
                  </p>
                </div>

                {/* Cards Grid: 3-column for Ultra High-End, 4-column for others */}
                <div
                  className={`grid gap-[24px] ${
                    tier.columns === 3
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                  }`}
                >
                  {tier.brands.map((brand) => (
                    <div
                      key={brand.id}
                      onClick={hasBrandDetail(brand.id) ? () => goTo(`/brands/${brand.id}`) : undefined}
                      className={`group relative rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] select-none ${
                        hasBrandDetail(brand.id) ? 'cursor-pointer' : 'cursor-default'
                      } ${tier.columns === 3 ? 'h-[430px] lg:h-[460px]' : 'h-[390px] lg:h-[420px]'}`}
                    >
                      {/* Background Hotel Photo with smooth hover zoom */}
                      <img
                        src={brand.bgImage}
                        alt={`${brand.nameZh} ${brand.nameEn}`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-108"
                      />

                      {/* Vignette & Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20 group-hover:from-black/85 group-hover:via-black/50 transition-all duration-500" />

                      {/* Top Brand Category Tag */}
                      <div className="absolute top-5 left-5 z-10">
                        <span className="px-3 py-1 rounded-full text-[11px] font-medium tracking-wider text-white/80 bg-white/15 backdrop-blur-md border border-white/20">
                          {brand.levelZh}
                        </span>
                      </div>

                      {/* Center Content: Brand Emblem + EN Name + ZH Name (Identical to Wanda reference style) */}
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center pointer-events-none transition-transform duration-500 ease-out group-hover:-translate-y-6">
                        {/* Emblem */}
                        <div className="w-[52px] h-[52px] rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3.5 shadow-sm group-hover:border-white/60 transition-colors">
                          <BrandMatrixEmblem type={brand.emblemType} />
                        </div>

                        {/* English Name (Uppercase, wide letter spacing) */}
                        {/* 与品牌矩阵页一致：按名称长度分档收紧字号与字距，保证单行 */}
                        <h4
                          className={`font-semibold text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] lg:whitespace-nowrap ${
                            brand.nameEn.length > 24
                              ? 'text-[12.5px] lg:text-[12.5px] tracking-[0.08em]'
                              : brand.nameEn.length > 20
                                ? 'text-[14px] lg:text-[14px] tracking-[0.12em]'
                                : 'text-[15px] lg:text-[16px] tracking-[0.18em]'
                          }`}
                        >
                          {brand.nameEn}
                        </h4>

                        {/* Chinese Name */}
                        <p className="text-[22px] lg:text-[24px] font-medium text-white tracking-[0.1em] mt-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                          {brand.nameZh}
                        </p>
                      </div>

                      {/* Hover Revealed Bottom Tagline（仅已上线详情页的品牌展示入口） */}
                      <div className="absolute inset-x-0 bottom-0 z-20 p-6 flex flex-col items-center text-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                        {hasBrandDetail(brand.id) && (
                          <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#EE9B27] text-white text-[14px] font-semibold tracking-wider border border-white/30 shadow-[0_6px_24px_rgba(238,155,39,0.5)]">
                            查看品牌详情
                            <span aria-hidden="true">›</span>
                          </span>
                        )}
                        <p className="mt-3.5 text-[13px] text-white/90 leading-relaxed tracking-[0.03em] max-w-[280px]">
                          {brand.tagline}
                        </p>
                      </div>

                      {/* Subtle Bottom Glow Line on Hover */}
                      <div className="absolute inset-x-0 bottom-0 h-[2.5px] bg-[#EE9B27] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: REZEN系统 (SLANTED PARALLELOGRAM ACCORDION)
          Matches 00:26 - 00:38 (f_29_rezen_sys1.png .. f_34_rezen_sys4.png)
         ===================================================================== */}
      <section id="system" className="w-full bg-[#F1F3F6] pt-[96px] pb-[116px] overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-4">
          {/* Section Heading */}
          <div className="text-center mb-[56px]">
            <h2 className="text-[34px] md:text-[38px] font-bold text-[#111111] tracking-[0.04em] leading-[1.25] mb-3">
              REZEN系统
            </h2>
            <p className="text-[18px] md:text-[20px] font-normal text-[#555555] tracking-[0.02em]">
              丽呈自主研发的All in One一体化系统
            </p>
          </div>

          {/* Desktop Slanted Parallelogram Accordion with Rounded Corners & HD Backgrounds */}
          <div className="hidden lg:flex items-center justify-center w-full max-w-[1460px] mx-auto px-4 xl:px-6">
            <div className="flex items-stretch gap-[10px] xl:gap-[14px] select-none">
              {REZEN_SYSTEMS.map((sys, idx) => {
                const isActive = activeSystemIdx === idx;
                return (
                  <React.Fragment key={sys.id}>
                    {/* Slanted Image Blade with Rounded Corners & HD Background */}
                    <div
                      onMouseEnter={() => {
                        setActiveSystemIdx(idx);
                        setHoveredModuleIdx(0);
                      }}
                      onClick={() => {
                        setActiveSystemIdx(idx);
                        setHoveredModuleIdx(0);
                      }}
                      style={{
                        transform: 'skewX(-3.6deg)',
                        transformOrigin: 'center center',
                        WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                      }}
                      className={`relative w-[165px] lg:w-[185px] xl:w-[205px] 2xl:w-[220px] h-[530px] lg:h-[560px] xl:h-[600px] shrink-0 cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 group select-none ${
                        isActive
                          ? 'shadow-[0_16px_36px_rgba(0,0,0,0.22)] ring-1 ring-white/30'
                          : 'shadow-[0_8px_24px_rgba(0,0,0,0.08)] opacity-90 hover:opacity-100'
                      }`}
                    >
                      {/* Counter-skew inner container to maintain upright text & photos */}
                      <div
                        style={{
                          transform: 'skewX(3.6deg) scale(1.22)',
                          transformOrigin: 'center center',
                        }}
                        className="w-full h-full relative overflow-hidden"
                      >
                        {/* High-definition background photo */}
                        <img
                          src={sys.hdBgImage}
                          alt={`${sys.enTitle} ${sys.zhTitle}`}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        />

                        {/* Dark gradient for optimal contrast and clean text visibility */}
                        <div
                          className={`absolute inset-0 transition-opacity duration-500 ${
                            sys.id === 'merchant'
                              // 供应链卡用的是明亮暖调大图，遮罩要明显放轻，否则会被压成灰黑
                              ? 'bg-gradient-to-t from-[#04121C]/46 via-[#0C2233]/8 to-[#04121C]/24'
                              : isActive
                                ? 'bg-gradient-to-t from-[#060D1A]/80 via-[#0A1628]/26 to-[#060D1A]/40'
                                : 'bg-gradient-to-t from-[#040812]/80 via-[#07101E]/26 to-[#040812]/44 group-hover:via-[#07101E]/22'
                          }`}
                        />
                        {/* 中间层放轻后由这层窄幅椭圆暗带负责标题区的白字对比 */}
                        {sys.id !== 'merchant' && (
                          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_58%_24%_at_50%_40%,rgba(3,16,26,0.40)_0%,rgba(3,16,26,0.18)_50%,rgba(3,16,26,0)_78%)]" />
                        )}
                        {/* 明亮大图需要在标题区单独补一层窄幅柔和暗带，否则白字压不住 */}
                        {sys.id === 'merchant' && (
                          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_26%_at_50%_38%,rgba(3,16,26,0.55)_0%,rgba(3,16,26,0.28)_45%,rgba(3,16,26,0)_75%)]" />
                        )}

                        {/* Centered Live Typography Header (positioned ~1/3 from the top of the blade) */}
                        <div className="absolute top-[36%] inset-x-0 mx-auto flex flex-col items-center text-center px-3 z-20 pointer-events-none select-none">
                          {sys.id === 'business' && (
                            <div className="flex items-center justify-center">
                              <span className="text-[17px] lg:text-[18px] xl:text-[19px] font-bold tracking-[0.08em] text-white uppercase font-sans">
                                BUSINESS
                              </span>
                            </div>
                          )}

                          {sys.id === 'one' && (
                            <div className="flex items-center justify-center">
                              <span className="text-[18px] lg:text-[20px] xl:text-[21px] font-bold tracking-normal text-white flex items-center font-sans">
                                <span className="relative mr-0.5 inline-block">
                                  O
                                  <span className="absolute top-[44%] left-[46%] -translate-x-1/2 -translate-y-1/2 w-[4px] h-[4px] rounded-full bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]" />
                                </span>
                                ne
                              </span>
                            </div>
                          )}

                          {sys.id === 'merchant' && (
                            <div className="flex items-center justify-center">
                              <span className="text-[16px] lg:text-[17px] xl:text-[18px] font-bold tracking-[0.08em] text-white uppercase flex items-center font-sans">
                                  MERCHANT
                              </span>
                            </div>
                          )}

                          {sys.id === 'alliance' && (
                            <div className="flex items-center justify-center">
                              <span className="text-[16px] lg:text-[17px] xl:text-[18px] font-bold tracking-[0.14em] text-white uppercase font-sans">
                                ALLIANCE
                              </span>
                            </div>
                          )}

                          {/* Chinese Subtitle - Centered & compact */}
                          <div className="text-[14px] lg:text-[15px] xl:text-[16px] font-medium text-white/95 tracking-[0.08em] mt-1">
                            {sys.zhTitle}
                          </div>

                          {/* Small Centered Dash (Exact match to reference image) */}
                          <div className="mt-2.5 flex items-center justify-center">
                            <div
                              className={`h-[1.5px] rounded-full transition-all duration-300 ${
                                isActive ? 'w-6 bg-[#EE9B27]' : 'w-4 bg-white/70 group-hover:w-5 group-hover:bg-white'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Bottom active golden bar */}
                        {isActive && (
                          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-[#EE9B27] z-20" />
                        )}
                      </div>
                    </div>

                    {/* Expanded White Parallelogram Detail Panel with Rounded Corners directly next to active blade */}
                    {isActive && (
                      <div
                        style={{
                          transform: 'skewX(-3.6deg)',
                          transformOrigin: 'center center',
                          WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                        }}
                        className="relative w-[340px] lg:w-[390px] xl:w-[430px] 2xl:w-[460px] h-[530px] lg:h-[560px] xl:h-[600px] bg-white overflow-hidden rounded-2xl shrink-0 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-gray-100 animate-in fade-in duration-300 select-none"
                      >
                        <div
                          style={{
                            transform: 'skewX(3.6deg)',
                            transformOrigin: 'center center',
                          }}
                          className="w-full h-full flex flex-col justify-center pl-[52px] lg:pl-[60px] xl:pl-[68px] pr-[32px] lg:pr-[40px] xl:pr-[46px] py-[32px]"
                        >
                          {sys.modules.map((mod, mIdx) => {
                            const isRowHighlighted = hoveredModuleIdx === mIdx;
                            return (
                              <div
                                key={mod.title}
                                onMouseEnter={() => setHoveredModuleIdx(mIdx)}
                                className="group/row pt-[20px] first:pt-0 cursor-pointer"
                              >
                                <div className="flex items-start gap-[18px] lg:gap-[22px] pb-[18px] lg:pb-[22px]">
                                  <img
                                    src={mod.icon}
                                    alt={mod.title}
                                    className="w-[38px] h-[38px] lg:w-[42px] lg:h-[42px] object-contain shrink-0 mt-0.5"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-[16px] lg:text-[18px] font-bold text-[#111111] mb-1">
                                      {mod.title}
                                    </h4>
                                    <p className="text-[13px] text-[#555555] leading-[1.65] tracking-[0.02em]">
                                      {mod.items}
                                    </p>
                                  </div>
                                </div>
                                {/* Bottom divider line (golden #C59B3F on active/hovered row) */}
                                <div
                                  className={`w-full h-[1.5px] transition-colors duration-300 ${
                                    isRowHighlighted ? 'bg-[#C59B3F]' : 'bg-[#EEEEEE]'
                                  }`}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Responsive Fallback for smaller screens (<1024px) */}
          <div className="lg:hidden max-w-[960px] mx-auto space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {REZEN_SYSTEMS.map((sys, idx) => (
                <button
                  key={sys.id}
                  type="button"
                  onClick={() => setActiveSystemIdx(idx)}
                  className={`p-4 text-left transition-colors cursor-pointer rounded-xl ${
                    activeSystemIdx === idx
                      ? 'bg-[#192030] text-white shadow-md'
                      : 'bg-white text-[#111111] hover:bg-gray-50'
                  }`}
                >
                  <div className="text-[18px] font-bold">{sys.enTitle}</div>
                  <div className="text-[13px] opacity-80 mt-0.5">{sys.zhTitle}</div>
                </button>
              ))}
            </div>

            {/* Mobile Active Preview Card */}
            <div className="relative h-[160px] rounded-xl overflow-hidden shadow-sm">
              <img
                src={REZEN_SYSTEMS[activeSystemIdx].hdBgImage}
                alt={REZEN_SYSTEMS[activeSystemIdx].zhTitle}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute inset-0 p-6 flex flex-col justify-center bg-gradient-to-r ${
                  REZEN_SYSTEMS[activeSystemIdx].id === 'merchant'
                    ? 'from-black/75 via-black/30 to-black/10'
                    : 'from-black/85 via-black/55 to-black/30'
                }`}
              >
                <span className="text-[13px] font-semibold text-[#EE9B27] tracking-widest uppercase">
                  {REZEN_SYSTEMS[activeSystemIdx].enTitle}
                </span>
                <span className="text-[20px] font-bold text-white tracking-wide mt-1">
                  {REZEN_SYSTEMS[activeSystemIdx].zhTitle}
                </span>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 space-y-6 rounded-xl shadow-sm">
              {REZEN_SYSTEMS[activeSystemIdx].modules.map((mod, mIdx) => (
                <div
                  key={mod.title}
                  className={`pb-5 border-b ${
                    mIdx === 0 ? 'border-[#C59B3F]' : 'border-[#E5E5E5]'
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <img src={mod.icon} alt={mod.title} className="w-11 h-11 object-contain shrink-0" />
                    <div>
                      <h4 className="text-[17px] font-bold text-[#111111] mb-1.5">{mod.title}</h4>
                      <p className="text-[14px] text-[#555555]">{mod.items}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5: 近期动态 (RECENT NEWS / UPDATES CAROUSEL)
          Styled exactly after user reference image (image_650a89a5.png):
          - Large centered bold title "近期动态"
          - Responsive cards: 4 columns on desktop, 2 on tablet, 1 on mobile
          - Rounded cover image (16:10), 2-line title, date stamp
          - Bottom navigation: circular < button, 10 indicator dots (active dot amber), circular > button
          - Clicking any card opens full article reader modal
         ===================================================================== */}
      <section id="news" className="w-full bg-white pt-[100px] lg:pt-[120px] pb-[110px] lg:pb-[130px] overflow-hidden">
        <div className="max-w-[1560px] mx-auto px-6 lg:px-[60px]">
          {/* Main Title with View All Link */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 lg:mb-14">
            <div className="text-center sm:text-left">
              <h2 className="text-[34px] md:text-[40px] font-bold text-[#111111] tracking-[0.02em] leading-tight">
                近期动态
              </h2>
            </div>
            <button
              type="button"
              onClick={() => goTo('/news')}
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#666666] hover:text-[#EE9B27] transition-colors cursor-pointer group"
            >
              <span>查看全部动态</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          {/* Latest 4 News Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
            {homeNews.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="cursor-pointer group flex flex-col"
                onClick={() => openNews(item)}
              >
                {/* Rounded Cover Image */}
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-4 relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </div>

                {/* 2-line Ellipsis Title */}
                <h3 className="text-[16px] lg:text-[17px] font-bold text-[#111111] group-hover:text-[#C59B3F] transition-colors duration-200 line-clamp-2 leading-[1.45] mb-2 min-h-[48px]">
                  {item.title}
                </h3>

                {/* Date Stamp */}
                <p className="text-[14px] text-[#777777] font-normal tracking-wide">
                  {item.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
        </>
      )}

      {/* =====================================================================
          SECTION 6: DARK NAVY FOOTER & 留言板
          Matches 00:44 - 00:48 (f_46_footer.png)
         ===================================================================== */}
      <footer id="footer" className="w-full bg-[#192030] text-white">
        <div className="max-w-[1680px] mx-auto px-6 lg:px-[145px] pt-[84px] pb-[54px]">
          <div className="flex flex-col lg:flex-row justify-between gap-16">
            {/* Left Side: Logo (+ ｜ 丽呈智旅), 3 QR Codes, Hotline/Email */}
            <div className="max-w-[600px]">
              <div className="flex items-center flex-wrap gap-2">
                <RezenGroupLogo variant="light" className="h-[28px] sm:h-[34px] w-auto" />
                <span className="hidden sm:block h-[18px] w-px bg-white/40 ml-2" aria-hidden="true" />
                <span className="text-[18px] sm:text-[21px] font-medium tracking-[0.12em] leading-none text-white select-none">
                  丽呈智旅
                </span>
              </div>

              {/* Thin horizontal line under logo */}
              <div className="w-[465px] max-w-full h-px bg-white/15 mt-[26px] mb-[36px]" />

              {/* 2 QR Codes Row */}
              <div className="flex flex-wrap gap-8 sm:gap-[58px] mb-[44px]">
                {/* QR 1: 酒店预订 */}
                <div className="flex flex-col items-center">
                  <span className="text-[14px] text-white/90 tracking-[0.03em]">酒店预订</span>
                  <span className="text-[12px] text-white/65 tracking-[0.02em] mt-0.5 mb-3">
                    REZEN STAY
                  </span>
                  <img
                    src="/assets/rezen/footer/jiudianyuding.jpg"
                    alt="酒店预订"
                    className="w-[114px] h-[114px] object-contain rounded-full bg-white p-[6px]"
                  />
                </div>

                {/* QR 2: 丽呈智旅公众号 */}
                <div className="flex flex-col items-center">
                  <span className="text-[14px] text-white/90 tracking-[0.03em]">丽呈智旅公众号</span>
                  <span className="text-[12px] text-white/65 tracking-[0.02em] mt-0.5 mb-3">
                    REZEN SMART TRAVEL
                  </span>
                  <img
                    src="/assets/rezen/footer/gongzhonghao.jpg"
                    alt="丽呈智旅公众号"
                    className="w-[114px] h-[114px] object-contain bg-white p-0.5"
                  />
                </div>
              </div>

              {/* Hotline & 24h Customer Service Email */}
              <div className="space-y-[18px]">
                {/* Phone Row */}
                <div className="flex items-center">
                  <div className="w-[38px] h-[38px] rounded-full border border-white/40 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white/85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-[13.5px] sm:text-[15px] text-white/90 w-[88px] sm:w-[112px] ml-3 sm:ml-[18px]">
                    全国合作热线
                  </span>
                  <a
                    href="tel:4006886527"
                    className="text-[20px] sm:text-[26px] font-normal text-[#A88450] tracking-wider ml-1 sm:ml-2 whitespace-nowrap hover:opacity-85 transition-opacity"
                  >
                    400-688-6527
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side: 合作留言 (与顶栏合作咨询共用同一套表单) */}
            <div id="message-board" className="w-full lg:w-[540px]">
              <h3 className="text-[22px] font-bold text-white tracking-[0.04em] mb-[30px]">
                合作留言
              </h3>

              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px] mb-[14px]">
                  <input
                    type="text"
                    placeholder="姓名 *"
                    value={consultData.name}
                    onChange={(e) => setConsultData({ ...consultData, name: e.target.value })}
                    className="w-full h-[44px] bg-[#1E273B] px-4 text-[14px] text-white placeholder-white/75 focus:outline-none focus:ring-1 focus:ring-[#A88450]"
                  />
                  <input
                    type="tel"
                    placeholder="联系电话 *"
                    value={consultData.phone}
                    onChange={(e) => setConsultData({ ...consultData, phone: e.target.value })}
                    className="w-full h-[44px] bg-[#1E273B] px-4 text-[14px] text-white placeholder-white/75 focus:outline-none focus:ring-1 focus:ring-[#A88450]"
                  />
                </div>

                <div className="mb-[14px]">
                  <input
                    type="text"
                    placeholder="意向城市 / 酒店名称（选填）"
                    value={consultData.city}
                    onChange={(e) => setConsultData({ ...consultData, city: e.target.value })}
                    className="w-full h-[44px] bg-[#1E273B] px-4 text-[14px] text-white placeholder-white/75 focus:outline-none focus:ring-1 focus:ring-[#A88450]"
                  />
                </div>

                <div className="mb-[22px]">
                  <textarea
                    placeholder="请简要描述您的合作需求（选填）"
                    value={consultData.demand}
                    onChange={(e) => setConsultData({ ...consultData, demand: e.target.value })}
                    className="w-full h-[112px] bg-[#1E273B] p-4 text-[14px] text-white placeholder-white/75 resize-none focus:outline-none focus:ring-1 focus:ring-[#A88450]"
                  />
                </div>

                <div className="flex items-center justify-end gap-4">
                  {formSubmitted && (
                    <span className="text-[13px] text-[#F09A26]">感谢您的留言，我们将尽快与您联系！</span>
                  )}
                  <button
                    type="submit"
                    className="w-[112px] h-[36px] bg-[#1E273B] hover:bg-[#28334A] text-white/90 text-[14px] transition-colors cursor-pointer"
                  >
                    提交
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Full-width ICP, Police Record & Copyright Bar */}
        <div className="w-full border-t border-white/10 bg-[#141A29]">
          <div className="max-w-[1680px] mx-auto px-6 lg:px-[145px] py-[22px] flex flex-col md:flex-row items-center justify-center gap-2 md:gap-x-8 text-[14px] text-white/55 tracking-normal">
            <p className="leading-relaxed text-center flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
              <span>北京市朝阳区E9创新工厂-7号楼5层｜</span>
              <span className="inline-flex items-center gap-1 rounded border border-[#2FC08B]/60 px-1.5 py-[1px] text-[#2FC08B] text-[12px] leading-[17px]">
                <svg className="w-[11px] h-[11px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 3l7 3v6c0 4.6-3 7.6-7 9-4-1.4-7-4.4-7-9V6z" strokeLinejoin="round" />
                  <path d="M8.6 12l2.3 2.3L15.4 10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                工信部
              </span>
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white hover:underline transition-colors"
              >
                京ICP备2024085185号-5
              </a>
            </p>
            <p className="leading-relaxed text-center">
              Copyright© 2026 北京丽呈智旅酒店管理有限公司 版权所有
            </p>
          </div>
        </div>
      </footer>

      {/* 返回顶部（所有页面通用，下拉后悬浮于右下角） */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="返回顶部"
        title="返回顶部"
        className={`fixed right-8 bottom-8 md:right-12 md:bottom-10 z-[120] w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/85 hover:bg-white text-gray-500 hover:text-[#111622] border border-black/5 hover:border-black/10 shadow-[0_4px_16px_rgba(0,0,0,0.10)] backdrop-blur-sm flex items-center justify-center transition-all duration-300 cursor-pointer ${
          showBackTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-[18px] h-[18px]" />
      </button>

      {/* =====================================================================
          TOP-BAR 合作咨询 MODAL
         ===================================================================== */}
      {consultOpen && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setConsultOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="consult-dialog-title"
            className="relative w-full max-w-[460px] max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.25)] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 顶部标题条 */}
            <div className="relative bg-[#FFF8EE] px-7 pt-7 pb-6">
              <button
                type="button"
                aria-label="关闭"
                onClick={() => setConsultOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#9A7036] hover:bg-[#F5E6CC] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
              <p className="text-[12px] tracking-[0.18em] text-[#C08A3E] font-medium mb-2">BUSINESS CONSULTATION</p>
              <h2 id="consult-dialog-title" className="text-[22px] font-semibold text-[#1F2430] leading-snug">
                合作咨询
              </h2>
              <p className="mt-2 text-[13px] text-[#6B7280] leading-relaxed">
                留下您的联系方式，我们将在一个工作日内与您联系。
              </p>
            </div>

            {consultSubmitted ? (
              <div className="px-7 py-10 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-[#F09A26]/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#F09A26]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-[16px] font-medium text-[#1F2430]">提交成功</p>
                <p className="mt-2 text-[13px] text-[#6B7280]">感谢您的咨询，我们会尽快与您取得联系。</p>
                <button
                  type="button"
                  onClick={() => setConsultOpen(false)}
                  className="mt-6 h-[40px] px-8 rounded-full bg-[#F09A26] hover:bg-[#E0891A] text-white text-[14px] font-medium transition-colors cursor-pointer"
                >
                  完成
                </button>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="px-7 pt-5 pb-7">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="姓名 *"
                    value={consultData.name}
                    onChange={(e) => setConsultData({ ...consultData, name: e.target.value })}
                    className="h-[44px] bg-[#F5F6F8] rounded-lg px-3.5 text-[14px] text-[#1F2430] placeholder-[#9AA1AC] focus:outline-none focus:ring-2 focus:ring-[#F09A26]/35"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="联系电话 *"
                    value={consultData.phone}
                    onChange={(e) => setConsultData({ ...consultData, phone: e.target.value })}
                    className="h-[44px] bg-[#F5F6F8] rounded-lg px-3.5 text-[14px] text-[#1F2430] placeholder-[#9AA1AC] focus:outline-none focus:ring-2 focus:ring-[#F09A26]/35"
                  />
                </div>
                <input
                  type="text"
                  placeholder="意向城市 / 酒店名称（选填）"
                  value={consultData.city}
                  onChange={(e) => setConsultData({ ...consultData, city: e.target.value })}
                  className="mt-3 w-full h-[44px] bg-[#F5F6F8] rounded-lg px-3.5 text-[14px] text-[#1F2430] placeholder-[#9AA1AC] focus:outline-none focus:ring-2 focus:ring-[#F09A26]/35"
                />
                <textarea
                  placeholder="请简要描述您的合作需求（选填）"
                  value={consultData.demand}
                  onChange={(e) => setConsultData({ ...consultData, demand: e.target.value })}
                  className="mt-3 w-full h-[96px] bg-[#F5F6F8] rounded-lg p-3.5 text-[14px] text-[#1F2430] placeholder-[#9AA1AC] resize-none focus:outline-none focus:ring-2 focus:ring-[#F09A26]/35"
                />
                <button
                  type="submit"
                  disabled={consultSubmitting}
                  className="mt-5 w-full h-[46px] rounded-full bg-[#F09A26] hover:bg-[#E0891A] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[15px] font-medium tracking-[0.04em] transition-colors cursor-pointer"
                >
                  {consultSubmitting ? '提交中…' : '提交咨询'}
                </button>
                <p className="mt-3 text-center text-[12px] text-[#9AA1AC]">
                  也可直接致电 400-688-6527
                </p>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
