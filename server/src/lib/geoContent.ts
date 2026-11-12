import { desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { news } from '../db/schema.js';
import { BRAND_DEFINITION, SITE_ORIGIN, escapeHtml } from './seo.js';

/**
 * GEO 内容层：为不执行 JavaScript 的搜索引擎 / AI 爬虫提供完整正文。
 * 以 <noscript> 形式注入 index.html，浏览器端 React 正常渲染，视觉不受影响。
 * 注意：本文件中的品牌定义、介绍、物业条件必须与官网 src/data/brandDetail.ts 逐字一致，
 * 任何文案修改需要两边同步，防止 AI 抓取到不一致的实体信息。
 */

/** 全站静态内容最近更新日期（每次内容整改时更新；发新闻后会自动被更新日期覆盖） */
export const LAST_UPDATED = '2026-11-12';

const toDate = (value?: string | null) => (value || '').slice(0, 10);

/** 全站「最后更新」日期：取静态常量与最新一篇已发布新闻更新时间的较大者，发文章后自动刷新 */
export function currentSiteUpdated(): string {
  try {
    const row = db
      .select({ publishedAt: news.publishedAt, updatedAt: news.updatedAt })
      .from(news)
      .orderBy(desc(news.updatedAt), desc(news.publishedAt), desc(news.id))
      .limit(1)
      .get();
    const newsDate = toDate(row?.updatedAt) || toDate(row?.publishedAt);
    return newsDate && newsDate > LAST_UPDATED ? newsDate : LAST_UPDATED;
  } catch {
    return LAST_UPDATED;
  }
}

interface GeoSection {
  h2: string;
  items?: string[];
  paragraphs?: string[];
}

interface GeoPage {
  h1: string;
  lead: string;
  sections: GeoSection[];
}

const DIGITAL_FACTS: GeoSection = {
  h2: '数字事实',
  items: ['覆盖海内外 320+ 城市', '开业酒店 1000+', '旗下 18 个酒店品牌', '丽呈花盛、季枫、富士、巴里岛、个性化五大品牌系列'],
};

const BRAND_SYSTEM: GeoSection = {
  h2: '品牌体系',
  items: [
    '丽呈花盛品牌系列：丽呈花盛国际酒店、丽呈花盛酒店、丽呈花盛度假酒店',
    '季枫品牌系列：季枫J酒店、季枫国际酒店、季枫酒店、季枫度假酒店',
    '富士品牌系列：富士丽雅酒店、富士雅致酒店、富士国际酒店、富士悦致酒店',
    '巴里岛品牌系列：巴里岛国际酒店、巴里岛度假酒店、巴里岛假日酒店',
    '个性化品牌系列：携程度假农庄酒店、新世界酒店、丽钻酒店、朵致酒店',
  ],
};

const CORE_CAPABILITY: GeoSection = {
  h2: '核心能力',
  items: ['自研 REZEN 一体化系统', '全产业链数字化中台', '成熟运营体系与会员体系', '九大中央平台赋能加盟酒店'],
};

/** 品牌详情页 GEO 正文（intro 与官网品牌介绍逐字一致；requirements 为各品牌公示物业条件） */
const BRAND_GEO: Record<string, GeoPage> = {
  '/brands/jifeng-j': {
    h1: '季枫J酒店',
    lead: '季枫J酒店是丽呈智旅旗下季枫系列英伦潮牌旗舰奢华酒店品牌，品牌主张“年轻态社交空间与时尚旅行融合”，面向Z世代差旅与年轻品质出行人群，主打英伦格调、社交空间、温馨家居三大核心特质。品牌空间英伦格调融合中国美学元素，打造大堂吧与定制轻西餐融合餐厅复合社交空间，配套星巴克咖啡服务。客房空间设计灵活高效，主打“城市的家”温馨感。依托丽呈智旅成熟运营体系与季枫品牌130+店网络，布局国内核心城市商务区与年轻人聚集地，为年轻差旅宾客提供“出差也能很潮”的时尚旅居体验。',
    sections: [{ h2: '物业条件', items: ['面积要求：12000㎡以上', '最低房间量：120间', '资金要求：3000万以上'] }],
  },
  '/brands/jifeng-intl': {
    h1: '季枫国际酒店',
    lead: '季枫国际酒店是丽呈智旅旗下季枫系列高端商务品牌，品牌主张“全球商旅精英的英伦之选”，面向高频出差商务白领与企业高管，主打英伦商务、行政酒廊、轻奢餐饮三大核心特质。品牌空间英伦格调为灵魂，偏商务国际范，大堂走年轻态社交风加轻奢餐饮路线，配套星巴克咖啡服务，空间通透、氛围轻松。客房配备行政酒廊待遇、多功能办公区与高品质寝具，配套24小时健身中心、多功能会议室与轻奢餐厅。依托丽呈智旅成熟运营体系与季枫品牌高端定位，布局国内核心城市商务区，为高频出差宾客提供“出差也不枯燥”的商务旅居体验。',
    sections: [{ h2: '物业条件', items: ['面积要求：5000㎡以上', '最低房间量：80间', '资金要求：1000万以上'] }],
  },
  '/brands/jifeng': {
    h1: '季枫酒店',
    lead: '季枫酒店是丽呈智旅旗下季枫系列基础走量潮牌，品牌主张“英伦格调的潮牌酒店”，面向25-35岁年轻商务客与品质出行人群，主打英伦潮牌、社交大堂、灵活空间三大核心特质。品牌空间英伦格调融合中国美学元素，打造年轻态社交空间加时尚旅行生活美学，住宿+休闲+餐饮一站式。客房温馨如家、空间灵活。依托丽呈智旅成熟运营体系与季枫品牌百店网络，布局国内核心城市商务区与年轻人聚集地，为年轻商务宾客提供“追求品质但不盲从高端五星”的潮牌旅居体验。',
    sections: [{ h2: '物业条件', items: ['面积要求：2500㎡以上', '最低房间量：50间', '资金要求：500万以上'] }],
  },
  '/brands/jifeng-resort': {
    h1: '季枫度假酒店',
    lead: '季枫度假酒店是丽呈智旅旗下季枫系列五钻度假品牌，品牌主张“英伦格调，山海度假”，面向25-40岁度假客、情侣与带娃放松的小家庭，主打英伦格调度假、一店一设计、松弛感三大核心特质。品牌空间英伦格调混搭中国美学，专门往山海湖林的好位置扎，格纹、木作、壁炉感加潮玩国潮混搭。客房配疗愈休闲设施，配套餐厅、健身房、户外活动区。依托丽呈智旅成熟运营体系与季枫品牌年轻定位，布局国内山海湖林度假目的地，为宾客提供“出片率高、松弛自在”的度假体验。',
    sections: [{ h2: '物业条件', items: ['面积要求：8000㎡以上', '最低房间量：100间', '资金要求：1500万以上'] }],
  },
  '/brands/grand-rezen': {
    h1: '丽呈花盛国际酒店',
    lead: '丽呈花盛国际酒店是丽呈智旅旗下高端豪华商旅品牌，品牌主张“东方雅致，花盛商旅”，面向地市商务接待与品质差旅人群，主打东方美学、智能舒适、政企会客厅三大核心特质。品牌空间走东方美学加现代舒适路线，偏柔美雅致，不是冷冰冰的商务酒店。客房配备智能客控、新风净水系统与零压舒眠床品，配套多功能会议厅、健身房、高端餐饮与星巴克咖啡服务。依托丽呈智旅成熟运营体系与会员体系，布局国内核心城市地段，为地方政企接待与高端商旅宾客提供“城市会客厅”级别的豪华旅居体验。',
    sections: [{ h2: '物业条件', items: ['面积要求：8000㎡以上', '最低房间量：120间', '资金要求：2000万以上'] }],
  },
  '/brands/rezen-huasheng': {
    h1: '丽呈花盛酒店',
    lead: '丽呈花盛酒店是丽呈智旅旗下高端设计酒店品牌，品牌主张“传统里带设计感”，面向对设计感有要求的中高端商旅与品质度假人群，主打新中式设计、目的地选址、生活第三空间三大核心特质。品牌空间新中式现代雅致，以海棠红/宝石红为主色调，融合包豪斯设计底子，曾获2026 AHA“年度最佳设计酒店”。客房走度假加商旅双场景配置，配套设计感公区、特色餐厅、健身设施与星巴克咖啡服务。依托丽呈智旅成熟运营体系，为宾客提供“既要体面又要有品味”的高端设计旅居体验。',
    sections: [{ h2: '物业条件', items: ['面积要求：4000㎡以上', '最低房间量：80间', '资金要求：1000万以上'] }],
  },
  '/brands/rezen-huasheng-resort': {
    h1: '丽呈花盛度假酒店',
    lead: '丽呈花盛度假酒店是丽呈花盛系列旗下目的地度假品牌，品牌主张“一城一设计，慢享花盛”，面向周末与小长假度假的情侣、夫妻与小家庭，主打新中式度假、目的地融合、慢节奏服务三大核心特质。品牌空间延续花盛系新中式现代雅致加东方美学，深度融合目的地文化，“一城一设计”不做标准化复制。客房主打“待得住”——房间大、窗外有景、公区能发呆，配套度假餐厅、休闲公区与慢节奏管家服务。依托丽呈智旅成熟运营体系，为宾客提供“品质度假、轻松自在”的新中式度假体验。',
    sections: [{ h2: '物业条件', items: ['面积要求：4000㎡以上', '最低房间量：80间', '资金要求：1000万以上'] }],
  },
  '/brands/fuji-liya': {
    h1: '富士丽雅酒店',
    lead: '富士丽雅酒店是丽呈智旅旗下中高端走量主力，品牌主张"现代轻奢，商旅亲子两相宜"，面向中高端商务客、亲子家庭与长线休闲游客，主打现代轻奢、餐饮强项、目的地融合三大核心特质。品牌空间现代轻奢风，专业设计团队操刀，到旅游目的地深度融合当地文化（如喀什古城店融入西域风情），大堂配套星巴克咖啡服务。客房走商旅与亲子双场景配置，配套特色餐厅、健身房与会议空间。依托丽呈智旅集团600+店成熟运营体系与餐饮基因，为宾客提供"商旅+度假+请客吃饭"一站式的中高端旅居体验。',
    sections: [{ h2: '物业条件', items: ['面积要求：6000㎡以上', '最低房间量：100间', '资金要求：1500万以上'] }],
  },
  '/brands/fuji-yazhi': {
    h1: '富士雅致酒店',
    lead: '富士雅致酒店是丽呈智旅旗下富士系列精致商旅品牌，品牌主张"克制精致，高效商旅"，面向30-45岁频繁出差的商务客，主打克制商务、智能高效、咖啡社交三大核心特质。品牌空间走现代简约设计加智能化设施路线，线条干净、配色沉稳（孔雀蓝/墨绿点缀），大堂设咖啡角是富士系招牌。客房配办公桌、阅读灯、高速网，配套自助早餐厅、健身房与自助洗衣房。依托丽呈智旅成熟运营体系与富士系商务基因，为频繁出差宾客提供"高效、舒适、便捷"的精致商旅体验。',
    sections: [{ h2: '物业条件', items: ['面积要求：4000㎡以上', '最低房间量：80间', '资金要求：1000万以上'] }],
  },
  '/brands/fuji-intl': {
    h1: '富士国际酒店',
    lead: '富士国际酒店是丽呈智旅旗下富士系列国际标准会议商旅品牌，品牌主张"国际标准，会议商旅"，面向中小企业出差团队与会议培训人群，主打国际标准、会议接待、酒加餐模式三大核心特质。品牌空间按国际标准配置，融入当地文化，现代轻奢风，金属加木饰面加大理石点缀。客房硬件比雅致高半档，配套30-100人多功能会议室、特色餐厅与健身中心。依托北京丽呈智旅全服团队运营与一店一设计标准，为中小企业商务与会议宾客提供"国际标准、舒适高效"的商旅体验。',
    sections: [{ h2: '物业条件', items: ['面积要求：3000㎡以上', '最低房间量：60间', '资金要求：400万以上'] }],
  },
  '/brands/fuji-yuezhi': {
    h1: '富士悦致酒店',
    lead: '富士悦致酒店是丽呈智旅旗下富士系列年轻网红舒适商旅品牌，品牌主张"悦享生活，年轻出行"，面向22-30岁年轻出行人群、情侣与热爱生活分享的客群，主打年轻时尚、网红咖啡、智能便捷三大核心特质。品牌空间年轻化、时尚化，科技智能加便捷环保，大堂植入咖啡甜品与哈根达斯，公区搞成网红咖啡打卡点。房间整洁舒适、拍照出片，配色明快。依托丽呈智旅成熟运营体系与丽呈智旅系餐饮资源，为年轻出行宾客提供"干净上镜、有咖啡有社交"的年轻旅居体验。',
    sections: [{ h2: '物业条件', items: ['面积要求：3000㎡以上', '最低房间量：60间', '资金要求：400万以上'] }],
  },
  '/brands/balidao-intl': {
    h1: '巴里岛国际酒店',
    lead: '巴里岛国际酒店是丽呈智旅旗下欧式经典综合酒店品牌，品牌主张"欧式经典，城市会客厅"，面向地市级城市商务接待、婚宴与家庭出游人群，主打欧式气派、复合经营、星级标准三大核心特质。品牌空间走欧式/法式经典风，偏气派，打造"客房+咖啡馆+西餐厅"复合经营空间，咖啡馆引入星巴克咖啡服务。客房按星级标准建设，配套餐饮、会议、管家服务。依托丽呈智旅运营体系与巴里岛品牌一二三四线深耕经验，为宾客提供"请客办事上档次"的体面欧式旅居体验。',
    sections: [{ h2: '物业条件', items: ['面积要求：5000㎡以上', '最低房间量：80间', '资金要求：1200万以上'] }],
  },
  '/brands/balidao-resort': {
    h1: '巴里岛度假酒店',
    lead: '巴里岛度假酒店是丽呈智旅旗下巴里岛系列康养度假品牌，品牌主张"南洋风情，康养慢生活"，面向30-45岁家庭周末度假与情侣休闲人群，主打南洋风情、康养SPA、管家服务三大核心特质。品牌空间走热带度假风情，藤编、木雕、暖光、棕榈元素，餐饮走欧式路线。客房配康养设施，配套康养SPA、精选咖啡吧、管家服务与欧式餐厅。依托丽呈智旅运营体系与巴里岛品牌三四线深耕经验，为宾客提供"离城市不远、能泡能躺"的南洋风康养度假体验。',
    sections: [{ h2: '物业条件', items: ['面积要求：8000㎡以上', '最低房间量：100间', '资金要求：2000万以上'] }],
  },
  '/brands/balidao-holiday': {
    h1: '巴里岛假日酒店',
    lead: '巴里岛假日酒店是丽呈智旅旗下巴里岛系列性价比舒适商旅品牌，品牌主张"都市里的南洋悠闲"，面向本地周末休闲出行、周边短途游与家庭短期出行人群，主打南洋风情、性价比、商圈便利三大核心特质。品牌空间以东南亚度假风情为设计灵感，融入自然材质和艺术设计，吊扇、藤椅、暖光灯，开在商圈或县城主干道上。客房走南洋风加性价比配置，配套自助早餐厅与简餐服务。依托丽呈智旅运营体系与巴里岛品牌下沉经验，为宾客提供"性价比第一、都市里也有度假感"的舒适商旅体验。',
    sections: [{ h2: '物业条件', items: ['面积要求：3000㎡以上', '最低房间量：60间', '资金要求：600万以上'] }],
  },
  '/brands/lizuan': {
    h1: '丽钻酒店',
    lead: '丽钻酒店是丽呈智旅旗下都市商旅甄选品牌，品牌主张"轻改焕新，简奢质感"，面向注重品质与性价比的商务出行人群，主打克制美学、简奢质感、高性价比三大核心特质。品牌空间不追求奢华堆砌，走"克制的美学""简奢"路线，浅灰加原木加暖色调，线条干净、质感本真。客房配备高品质床垫、焕新卫浴与智能客控，配套自助早餐厅、健身房与自助洗衣房。依托丽呈智旅成熟运营体系，为商务宾客提供"比同价位干净一点、新一点"的简奢商旅体验。',
    sections: [],
  },
  '/brands/duozhi': {
    h1: '朵致酒店',
    lead: '朵致酒店是丽呈智旅旗下新一代城市精致酒店品牌，品牌主张"恰好正年轻，恰好在朵致"，面向18-28岁年轻学生群体与初入职场的年轻人群，主打音乐治愈、香氛社交、年轻质感三大核心特质。品牌空间跳脱传统酒店固化设计，打造音乐+香氛沉浸式场景，配套轻音乐治愈空间、专属香氛系统与零压好眠床。公区咖啡+社交+自习三合一，20间小而美也能做，80-100间为标准店型。依托丽呈智旅成熟运营体系，布局年轻客群聚集区，为年轻宾客提供轻松自在、有质感的社交旅居体验。',
    sections: [],
  },
  '/brands/ctrip-farm': {
    h1: '携程度假农庄',
    lead: '携程度假农庄是乡村野奢度假品牌，品牌主张"住进山野，回归自然"，面向追求品质微度假的城市中产与亲子家庭，主打野奢、设计、管家三大核心特质。品牌空间山水田园风，每个门店由设计师量身打造，深度融合在地文化——安吉店走江南中式、峨眉山店走山景私汤路线。客房配备智能马桶、地暖、智能灯控窗帘与定制洗浴用品，配套无边泳池、萌宠乐园、管家服务、晚安甜汤。依托携程成熟预订体系与乡村振兴项目资源，布局国内知名文旅目的地与乡村景区，为宾客提供"住得舒服又能体验乡野"的高端乡村度假体验。',
    sections: [],
  },
  '/brands/new-world': {
    h1: '新世界酒店',
    lead: '新世界酒店是现代亚洲生活方式奢华酒店品牌，品牌主张“现代亚洲待客之道”，面向企业中层以上商务客与品质家庭出行人群，主打东方美学、当代设计、餐饮社交三大核心特质。品牌空间融合传统东方美学与当代设计语言，不走老派奢华路线，偏生活方式感。客房选址门户城市核心地段或度假胜地，配套特色餐厅、行政酒廊、健身中心、会议空间。依托集团成熟运营体系，布局香港、武汉、重庆、海南东方等门户城市与度假目的地，为宾客提供商务与休闲兼具的精致旅居体验。',
    sections: [],
  },
};

/** 合作加盟 FAQ（与官网公示口径一致，也用于 FAQPage 结构化数据） */
export const COOP_FAQ: { q: string; a: string }[] = [
  {
    q: '丽呈智旅旗下有哪些酒店品牌可以合作？',
    a: '丽呈智旅旗下拥有 18 个酒店品牌，分为丽呈花盛、季枫、富士、巴里岛、个性化五大品牌系列；个性化系列包含携程度假农庄酒店、新世界酒店、丽钻酒店、朵致酒店，详见品牌矩阵页。',
  },
  {
    q: '合作酒店对物业有什么要求？',
    a: '物业需有一定的停车位、配独立电梯、产权清晰（土地使用证、房产证、消防合格、用地性质适用于酒店等）。各品牌对面积、房间量与资金的具体要求不同，以对应品牌详情页公示为准。',
  },
  {
    q: '合作涉及哪些费用项目？',
    a: '合作政策包含授权合作费、管理费、品牌保证金、系统使用费、系统维护费、会员输送费、品牌推广费、工程指导费、酒店设计费、筹建支持费十项，具体标准以各品牌详情页公示为准。',
  },
  {
    q: '如何发起合作意向？',
    a: '可通过官网合作优势页或页面底部表单提交联系方式与合作意向，丽呈智旅团队将对接后续沟通、物业评估与签约流程。',
  },
  {
    q: '丽呈智旅是什么公司？',
    a: BRAND_DEFINITION,
  },
];

/** 各静态页面的 GEO 正文 */
const PAGE_GEO: Record<string, GeoPage> = {
  '/': {
    h1: '丽呈智旅 · 携程旗下酒店数字化经营服务商',
    lead: BRAND_DEFINITION,
    sections: [DIGITAL_FACTS, BRAND_SYSTEM, CORE_CAPABILITY],
  },
  '/about': {
    h1: '关于我们',
    lead: BRAND_DEFINITION,
    sections: [DIGITAL_FACTS, CORE_CAPABILITY],
  },
  '/brands': {
    h1: '丽呈智旅品牌矩阵',
    lead: '丽呈智旅旗下丽呈花盛、季枫、富士、巴里岛与个性化五大品牌系列，18 个品牌覆盖全场景旅宿需求。',
    sections: [BRAND_SYSTEM, DIGITAL_FACTS],
  },
  '/jiameng': {
    h1: '合作优势',
    lead: '丽呈智旅合作优势：九大中央平台赋能、全流程加盟支持、透明物业要求与收费标准，助力酒店业主稳健投资。',
    sections: [
      {
        h2: '合作政策项目',
        items: ['授权合作费', '管理费', '品牌保证金', '系统使用费', '系统维护费', '会员输送费', '品牌推广费', '工程指导费', '酒店设计费', '筹建支持费'],
      },
      { h2: '常见问题', items: COOP_FAQ.map((f) => `${f.q}——${f.a}`) },
    ],
  },
  '/news': {
    h1: '新闻动态',
    lead: '丽呈智旅最新集团动态、签约开业、行业观察与数智科技资讯。',
    sections: [DIGITAL_FACTS],
  },
  '/hotels': {
    h1: '酒店名录',
    lead: '丽呈智旅旗下各品牌已开业酒店名录，覆盖海内外 320+ 城市，可查看城市、品牌、地址与酒店设施信息。',
    sections: [DIGITAL_FACTS],
  },
};

function renderSections(sections: GeoSection[]): string {
  return sections
    .map((s) => {
      const list = s.items?.length ? `<ul>${s.items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>` : '';
      const ps = s.paragraphs?.length ? s.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('') : '';
      return `<section><h2>${escapeHtml(s.h2)}</h2>${list}${ps}</section>`;
    })
    .join('');
}

/** 生成指定路径的 GEO 正文块（noscript 注入，含唯一 H1 与最后更新时间） */
export function geoBlockForPath(
  requestPath: string,
  override?: { title: string; summary?: string; publishedAt?: string; updatedAt?: string },
): string {
  if (override) {
    const published = toDate(override.publishedAt);
    const updated = toDate(override.updatedAt) || published || currentSiteUpdated();
    const times = [
      published ? `发布时间：<time datetime="${published}">${published}</time>` : '',
      `最后更新：<time datetime="${updated}">${updated}</time>`,
    ]
      .filter(Boolean)
      .join('，');
    return `<main><h1>${escapeHtml(override.title)}</h1><p>${escapeHtml(override.summary || override.title)}</p><footer>${times}</footer></main>`;
  }
  const page = BRAND_GEO[requestPath] || PAGE_GEO[requestPath];
  if (!page) return '';
  const updated = currentSiteUpdated();
  return `<main><h1>${escapeHtml(page.h1)}</h1><p>${escapeHtml(page.lead)}</p>${renderSections(page.sections)}<footer>最后更新：<time datetime="${updated}">${updated}</time></footer></main>`;
}

/** 把 GEO 正文块以 noscript 形式注入 </body> 前（不影响浏览器端视觉与 React 渲染） */
export function injectGeo(
  html: string,
  requestPath: string,
  override?: { title: string; summary?: string; publishedAt?: string; updatedAt?: string },
): string {
  const block = geoBlockForPath(requestPath, override);
  if (!block) return html;
  return html.replace('</body>', `<noscript>${block}</noscript></body>`);
}

/** 新闻详情页 NewsArticle 结构化数据：让搜索引擎 / AI 识别文章正文、发布与更新时间 */
export function newsArticleJsonLd(article: {
  id: number;
  title: string;
  summary?: string;
  cover?: string;
  publishedAt?: string;
  updatedAt?: string;
}): object {
  const url = `${SITE_ORIGIN}/news/${article.id}`;
  const published = toDate(article.publishedAt) || undefined;
  const updated = toDate(article.updatedAt) || published;
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: article.title,
    description: article.summary || article.title,
    inLanguage: 'zh-CN',
    ...(published ? { datePublished: published } : {}),
    ...(updated ? { dateModified: updated } : {}),
    ...(article.cover ? { image: [article.cover.startsWith('http') ? article.cover : `${SITE_ORIGIN}${article.cover}`] } : {}),
    author: { '@id': `${SITE_ORIGIN}/#organization` },
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
  };
}

/** /jiameng 页 FAQPage 结构化数据 */
export const COOP_FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: COOP_FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

/** llms.txt：品牌说明书（品牌定义与官网逐字一致，含核心事实与适用边界） */
export const LLMS_TXT = `# 丽呈智旅（Rezen Smart Travel）

> ${BRAND_DEFINITION}

## 核心事实

- 覆盖海内外 320+ 城市，开业酒店 1000+
- 旗下 18 个酒店品牌，分为丽呈花盛、季枫、富士、巴里岛、个性化五大品牌系列
- 核心能力：自研 REZEN 一体化系统、全产业链数字化中台、九大中央平台赋能
- 母公司：丽呈集团（携程旗下）

## 品牌体系

- 丽呈花盛品牌系列：丽呈花盛国际酒店、丽呈花盛酒店、丽呈花盛度假酒店
- 季枫品牌系列：季枫J酒店、季枫国际酒店、季枫酒店、季枫度假酒店
- 富士品牌系列：富士丽雅酒店、富士雅致酒店、富士国际酒店、富士悦致酒店
- 巴里岛品牌系列：巴里岛国际酒店、巴里岛度假酒店、巴里岛假日酒店
- 个性化品牌系列：携程度假农庄酒店、新世界酒店、丽钻酒店、朵致酒店

## 主要页面

- 首页：${SITE_ORIGIN}/
- 品牌矩阵：${SITE_ORIGIN}/brands
- 合作优势：${SITE_ORIGIN}/jiameng
- 新闻动态：${SITE_ORIGIN}/news
- 酒店名录：${SITE_ORIGIN}/hotels
- 关于我们：${SITE_ORIGIN}/about

## 适用边界

- 各品牌物业条件与合作政策以官网对应品牌详情页公示为准
- 本文件所述数字事实（320+ 城市、1000+ 开业酒店、18 个品牌）以官网品牌矩阵页展示口径为准
- 合作咨询请以官网合作优势页提交的信息为正式渠道
`;
