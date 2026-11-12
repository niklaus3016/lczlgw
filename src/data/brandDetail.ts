/**
 * 品牌详情页数据
 * 每个品牌系列（季枫 / 丽呈花盛）维护一套独立数据，页面组件只负责渲染。
 * 修改花盛的内容不会影响季枫，反之亦然。
 */

export type BrandCollection = 'jifeng' | 'huasheng' | 'fuji' | 'balidao' | 'lizuan' | 'duozhi' | 'ctrip-farm' | 'new-world';

export interface BrandSeries {
  id: string;
  name: string;
  series: string;
  intro: string;
  property: string[];
  requirements: string[];
  policy: string[];
  /** 自定义合作政策；配置后替代 POLICY_ITEMS 与 policy 的通用两列表格 */
  policyRows?: { label: string; value: string; note?: string }[];
  samples: string[];
}

/** 标语拆分：高亮字1 + 中间文字 + 高亮字2 + 结尾文字 */
export interface SloganParts {
  h1: string;
  mid: string;
  h2: string;
  tail: string;
}

export interface BrandSpace {
  no: string;
  image: string;
  title: string;
  desc: string;
}

export interface BrandLogo {
  image: string;
  alt: string;
  /** 覆盖介绍区默认高度类（h-20 md:h-24） */
  sizeClass?: string;
  /** 覆盖介绍区默认底部间距类（mb-8） */
  marginClass?: string;
}

export interface BrandContent {
  collectionNameZh: string;
  collectionNameEn: string;
  hero: { image: string; alt: string };
  logo: BrandLogo;
  /** 品牌介绍区的 logo（按页面所属系列区分） */
  introLogo?: (seriesId: string) => BrandLogo;
  slogan: SloganParts;
  narrativeLead: string;
  /** 品牌强调色：标语高亮字、介绍段品牌名（季枫红 / 花盛橙金） */
  accentColor: string;
  /** 品牌宣传片；未配置时介绍区不显示播放器 */
  video?: { src: string; poster: string; tag: string; desc: string };
  spacesTitle: string;
  spacesTitleEn: string;
  spaces: BrandSpace[];
  visualsTitle: string;
  visualsTitleEn: string;
  visualRows: { n: number; ratio: number; src?: string }[][];
  banner?: { image: string; alt: string; slogan: SloganParts; en: string; imageClass?: string; overlayClass?: string };
  /** 物业条件配图；与 banner 一起缺省时，宣传栏/物业/样例不渲染，合作政策可单独配置展示 */
  propertyImage?: { image: string; alt: string };
  series: BrandSeries[];
}

/** 物业条件（共性条款，各品牌面积/房间/资金要求见 requirements） */
export const DEFAULT_PROPERTY = [
  '有一定的停车位、配独立电梯、产权清晰（土地使用证、房产证、消防合格、用地性质适用于酒店等）',
];

/** 品牌合作政策项目（顺序固定，与各品牌 policy 值一一对应） */
export const POLICY_ITEMS = [
  '授权合作费',
  '管理费',
  '品牌保证金',
  '系统使用费',
  '系统维护费',
  '会员输送费',
  '品牌推广费',
  '工程指导费',
  '酒店设计费',
  '筹建支持费',
];

const JIFENG_SERIES: BrandSeries[] = [
  {
    id: 'j',
    name: '季枫J酒店',
    series: '奢华酒店系列',
    intro:
      '季枫J酒店是丽呈智旅旗下季枫系列英伦潮牌旗舰奢华酒店品牌，品牌主张“年轻态社交空间与时尚旅行融合”，面向Z世代差旅与年轻品质出行人群，主打英伦格调、社交空间、温馨家居三大核心特质。品牌空间英伦格调融合中国美学元素，打造大堂吧与定制轻西餐融合餐厅复合社交空间，配套星巴克咖啡服务。客房空间设计灵活高效，主打“城市的家”温馨感。依托丽呈智旅成熟运营体系与季枫品牌130+店网络，布局国内核心城市商务区与年轻人聚集地，为年轻差旅宾客提供“出差也能很潮”的时尚旅居体验。',
    property: DEFAULT_PROPERTY,
    requirements: ['面积要求：12000㎡以上', '最低房间量：120间', '资金要求：3000万以上'],
    policy: [
      '8000元/间',
      '营业额6%',
      '20万',
      '20万',
      '5000元/月',
      '订单金额的6%',
      '订单金额的1%',
      '20万',
      '120元/平',
      '20万',
    ],
    // 门店样例：季枫J酒店（大堂前台/大堂吧/餐厅/电梯厅/大床房/套房浴室）
    samples: [
      '/assets/rezen/jf-j-sample-1.webp',
      '/assets/rezen/jf-j-sample-2.webp',
      '/assets/rezen/jf-j-sample-3.webp',
      '/assets/rezen/jf-j-sample-4.webp',
      '/assets/rezen/jf-j-sample-5.webp',
      '/assets/rezen/jf-j-sample-6.webp',
    ],
  },
  {
    id: 'international',
    name: '季枫国际酒店',
    series: '高端商务系列',
    intro:
      '季枫国际酒店是丽呈智旅旗下季枫系列高端商务品牌，品牌主张“全球商旅精英的英伦之选”，面向高频出差商务白领与企业高管，主打英伦商务、行政酒廊、轻奢餐饮三大核心特质。品牌空间英伦格调为灵魂，偏商务国际范，大堂走年轻态社交风加轻奢餐饮路线，配套星巴克咖啡服务，空间通透、氛围轻松。客房配备行政酒廊待遇、多功能办公区与高品质寝具，配套24小时健身中心、多功能会议室与轻奢餐厅。依托丽呈智旅成熟运营体系与季枫品牌高端定位，布局国内核心城市商务区，为高频出差宾客提供“出差也不枯燥”的商务旅居体验。',
    property: DEFAULT_PROPERTY,
    requirements: ['面积要求：5000㎡以上', '最低房间量：80间', '资金要求：1000万以上'],
    policy: [
      '5000元/间',
      '营业额6%',
      '10万',
      '15万',
      '3000元/月',
      '订单金额的6%',
      '订单金额的1%',
      '10万',
      '80元/平',
      '10万',
    ],
    // 门店样例：季枫国际酒店
    samples: [
      '/assets/rezen/jf-intl-sample-1.webp',
      '/assets/rezen/jf-intl-sample-2.webp',
      '/assets/rezen/jf-intl-sample-3.webp',
      '/assets/rezen/jf-intl-sample-4.webp',
      '/assets/rezen/jf-intl-sample-5.webp',
      '/assets/rezen/jf-intl-sample-6.webp',
    ],
  },
  {
    id: 'hotel',
    name: '季枫酒店',
    series: '主力潮牌系列',
    intro:
      '季枫酒店是丽呈智旅旗下季枫系列基础走量潮牌，品牌主张“英伦格调的潮牌酒店”，面向25-35岁年轻商务客与品质出行人群，主打英伦潮牌、社交大堂、灵活空间三大核心特质。品牌空间英伦格调融合中国美学元素，打造年轻态社交空间加时尚旅行生活美学，住宿+休闲+餐饮一站式。客房温馨如家、空间灵活。依托丽呈智旅成熟运营体系与季枫品牌百店网络，布局国内核心城市商务区与年轻人聚集地，为年轻商务宾客提供“追求品质但不盲从高端五星”的潮牌旅居体验。',
    property: DEFAULT_PROPERTY,
    requirements: ['面积要求：2500㎡以上', '最低房间量：50间', '资金要求：500万以上'],
    policy: [
      '3000元/间',
      '营业额5%',
      '10万',
      '15万',
      '3000元/月',
      '订单金额的6%',
      '订单金额的1%',
      '10万',
      '80元/平',
      '10万',
    ],
    // 门店样例：季枫酒店
    samples: [
      '/assets/rezen/jf-hotel-sample-1.webp',
      '/assets/rezen/jf-hotel-sample-2.webp',
      '/assets/rezen/jf-hotel-sample-3.webp',
      '/assets/rezen/jf-hotel-sample-4.webp',
      '/assets/rezen/jf-hotel-sample-5.webp',
      '/assets/rezen/jf-hotel-sample-6.webp',
    ],
  },
  {
    id: 'resort',
    name: '季枫度假酒店',
    series: '高端度假系列',
    intro:
      '季枫度假酒店是丽呈智旅旗下季枫系列五钻度假品牌，品牌主张“英伦格调，山海度假”，面向25-40岁度假客、情侣与带娃放松的小家庭，主打英伦格调度假、一店一设计、松弛感三大核心特质。品牌空间英伦格调混搭中国美学，专门往山海湖林的好位置扎，格纹、木作、壁炉感加潮玩国潮混搭。客房配疗愈休闲设施，配套餐厅、健身房、户外活动区。依托丽呈智旅成熟运营体系与季枫品牌年轻定位，布局国内山海湖林度假目的地，为宾客提供“出片率高、松弛自在”的度假体验。',
    property: DEFAULT_PROPERTY,
    requirements: ['面积要求：8000㎡以上', '最低房间量：100间', '资金要求：1500万以上'],
    policy: [
      '6000元/间',
      '营业额6%',
      '10万',
      '20万',
      '4000元/月',
      '订单金额的6%',
      '订单金额的1%',
      '20万',
      '80元/平',
      '10万',
    ],
    // 门店样例：季枫度假酒店
    samples: [
      '/assets/rezen/jf-resort-sample-1.webp',
      '/assets/rezen/jf-resort-sample-2.webp',
      '/assets/rezen/jf-resort-sample-3.webp',
      '/assets/rezen/jf-resort-sample-4.webp',
      '/assets/rezen/jf-resort-sample-5.webp',
      '/assets/rezen/jf-resort-sample-6.webp',
    ],
  },
];

export const JIFENG_CONTENT: BrandContent = {
  collectionNameZh: '季枫酒店系列品牌',
  collectionNameEn: 'JIFENG HOTEL COLLECTION',
  hero: { image: '/assets/rezen/jfdb.webp', alt: '季枫酒店系列品牌' },
  logo: { image: '/assets/rezen/jflogo-full.png', alt: '季枫酒店系列品牌 Logo' },
  slogan: { h1: '季', mid: '往开来', h2: '枫', tail: '靡全球' },
  narrativeLead: '',
  accentColor: '#DD1415',
  video: {
    src: '/videos/jifeng3.mp4',
    poster: '/assets/rezen/jf-video-cover.webp',
    tag: '季枫酒店系列 · 品牌宣传片',
    desc: '英伦格调演绎国潮美学，全景呈现季枫酒店系列四大品牌产品线',
  },
  spacesTitle: '季枫酒店系列布局',
  spacesTitleEn: 'Jifeng Hotel Collection Spaces',
  spaces: [
    {
      no: '01',
      image: '/assets/rezen/jf-space-lobby.webp',
      title: '大堂',
      desc: '英伦格调与中国红在公区交汇，社交大堂串起精品咖啡与轻餐饮，住客与城市青年共享同一处复合场域。',
    },
    {
      no: '02',
      image: '/assets/rezen/jf-space-lounge.webp',
      title: '休息区',
      desc: '挑高空间悬着一方中国红艺术装置，大理石与木地板铺陈，咖啡与轻食随意落座，等候也成风景。',
    },
    {
      no: '03',
      image: '/assets/rezen/jf-space-meeting.webp',
      title: '会议室',
      desc: '多功能会议室适配商务洽谈与小型发布，高速网络与影音设备齐备，让高效办公与旅居节奏互不打扰。',
    },
    {
      no: '04',
      image: '/assets/rezen/jf-space-king.webp',
      title: '大床房',
      desc: '灰色肌理墙面挂着波普肖像，橙红抱枕与红色壁龛点出一抹国潮；大理石写字台、包覆式单椅与夜灯各安其位，差旅与休闲互不将就。',
    },
    {
      no: '05',
      image: '/assets/rezen/jf-space-twin.webp',
      title: '双床房',
      desc: '对称双床配以红橙撞色软装，床头艺术画与金属框镜面相互呼应；宽适地毯与分区暖光，兼顾同行出行与亲子入住。',
    },
  ],
  visualsTitle: '季枫品牌视觉',
  visualsTitleEn: 'Jifeng Brand Visuals',
  visualRows: [
    [
      { n: 1, ratio: 1.64 },
      { n: 2, ratio: 1.89 },
      { n: 3, ratio: 1.51 },
    ],
    [
      { n: 7, ratio: 2.97 },
      { n: 8, ratio: 2.58 },
    ],
    [
      { n: 9, ratio: 2.3 },
      { n: 10, ratio: 2.74 },
    ],
  ],
  banner: {
    image: '/assets/rezen/jf-banner.webp',
    alt: '季往开来 枫靡全球',
    slogan: { h1: '季', mid: '往开来', h2: '枫', tail: '靡全球' },
    en: 'Forge Ahead  Sweep The World',
  },
  propertyImage: { image: '/assets/rezen/jf-property.webp', alt: '季枫酒店物业条件' },
  series: JIFENG_SERIES,
};

const HUASHENG_LOGOS: Record<string, BrandLogo> = {
  // 花盛 logo 原图均为 360×360 画布带透明留白，统一用裁切版 + 52/64px 高 + mb-4，视觉一致
  'hs-international': {
    image: '/assets/rezen/hs-gj-logo-trim.webp',
    alt: '丽呈花盛国际酒店 Logo',
    sizeClass: 'h-[52px] md:h-16',
    marginClass: 'mb-4',
  },
  'hs-hotel': {
    image: '/assets/rezen/hs-logo-trim.webp',
    alt: '丽呈花盛酒店 Logo',
    sizeClass: 'h-[52px] md:h-16',
    marginClass: 'mb-4',
  },
  'hs-resort': {
    image: '/assets/rezen/hs-resort-logo-trim.webp',
    alt: '丽呈花盛度假酒店 Logo',
    sizeClass: 'h-[52px] md:h-16',
    marginClass: 'mb-4',
  },
};

const HUASHENG_INTRO: Record<string, string> = {
  'hs-international':
    '丽呈花盛国际酒店是丽呈智旅旗下高端豪华商旅品牌，品牌主张“东方雅致，花盛商旅”，面向地市商务接待与品质差旅人群，主打东方美学、智能舒适、政企会客厅三大核心特质。品牌空间走东方美学加现代舒适路线，偏柔美雅致，不是冷冰冰的商务酒店。客房配备智能客控、新风净水系统与零压舒眠床品，配套多功能会议厅、健身房、高端餐饮与星巴克咖啡服务。依托丽呈智旅成熟运营体系与会员体系，布局国内核心城市地段，为地方政企接待与高端商旅宾客提供“城市会客厅”级别的豪华旅居体验。',
  'hs-hotel':
    '丽呈花盛酒店是丽呈智旅旗下高端设计酒店品牌，品牌主张“传统里带设计感”，面向对设计感有要求的中高端商旅与品质度假人群，主打新中式设计、目的地选址、生活第三空间三大核心特质。品牌空间新中式现代雅致，以海棠红/宝石红为主色调，融合包豪斯设计底子，曾获2026 AHA“年度最佳设计酒店”。客房走度假加商旅双场景配置，配套设计感公区、特色餐厅、健身设施与星巴克咖啡服务。依托丽呈智旅成熟运营体系，为宾客提供“既要体面又要有品味”的高端设计旅居体验。',
  'hs-resort':
    '丽呈花盛度假酒店是丽呈花盛系列旗下目的地度假品牌，品牌主张“一城一设计，慢享花盛”，面向周末与小长假度假的情侣、夫妻与小家庭，主打新中式度假、目的地融合、慢节奏服务三大核心特质。品牌空间延续花盛系新中式现代雅致加东方美学，深度融合目的地文化，“一城一设计”不做标准化复制。客房主打“待得住”——房间大、窗外有景、公区能发呆，配套度假餐厅、休闲公区与慢节奏管家服务。依托丽呈智旅成熟运营体系，为宾客提供“品质度假、轻松自在”的新中式度假体验。',
};

/** 花盛三个品牌的物业条件与品牌合作政策（按官方政策表录入） */
const HUASHENG_POLICY: Record<string, { requirements: string[]; policy: string[] }> = {
  'hs-international': {
    requirements: ['面积要求：8000㎡以上', '最低房间量：120间', '资金要求：2000万以上'],
    policy: [
      '8000元/间',
      '营业额6%',
      '20万',
      '20万',
      '4000元/月',
      '订单金额的6%',
      '订单金额的1%',
      '15万',
      '100元/平',
      '10万',
    ],
  },
  'hs-hotel': {
    requirements: ['面积要求：4000㎡以上', '最低房间量：80间', '资金要求：1000万以上'],
    policy: [
      '5000元/间',
      '营业额6%',
      '10万',
      '15万',
      '3000元/月',
      '订单金额的6%',
      '订单金额的1%',
      '10万',
      '80元/平',
      '5万',
    ],
  },
  'hs-resort': {
    requirements: ['面积要求：4000㎡以上', '最低房间量：80间', '资金要求：1000万以上'],
    policy: [
      '5000元/间',
      '营业额6%',
      '10万',
      '15万',
      '3000元/月',
      '订单金额的6%',
      '订单金额的1%',
      '10万',
      '80元/平',
      '5万',
    ],
  },
};

/** 花盛门店样例（按品牌实拍图；未配置的品牌沿用季枫样例等待替换） */
const HUASHENG_SAMPLES: Record<string, string[]> = {
  'hs-international': [
    '/assets/rezen/hs-intl-sample-1.webp',
    '/assets/rezen/hs-intl-sample-2.webp',
    '/assets/rezen/hs-intl-sample-3.webp',
    '/assets/rezen/hs-intl-sample-4.webp',
    '/assets/rezen/hs-intl-sample-5.webp',
    '/assets/rezen/hs-intl-sample-6.webp',
  ],
  'hs-hotel': [
    '/assets/rezen/hs-hotel-sample-1.webp',
    '/assets/rezen/hs-hotel-sample-2.webp',
    '/assets/rezen/hs-hotel-sample-3.webp',
    '/assets/rezen/hs-hotel-sample-4.webp',
    '/assets/rezen/hs-hotel-sample-5.webp',
    '/assets/rezen/hs-hotel-sample-6.webp',
  ],
  'hs-resort': [
    '/assets/rezen/hs-resort-sample-1.webp',
    '/assets/rezen/hs-resort-sample-2.webp',
    '/assets/rezen/hs-resort-sample-3.webp',
    '/assets/rezen/hs-resort-sample-4.webp',
    '/assets/rezen/hs-resort-sample-5.webp',
    '/assets/rezen/hs-resort-sample-6.webp',
  ],
};

const HUASHENG_SERIES: BrandSeries[] = JIFENG_SERIES.map((s) => ({
  ...s,
  property: [...s.property],
  requirements: [...s.requirements],
  policy: [...s.policy],
  samples: [...s.samples],
})).map((s) => {
  const map: Record<string, { id: string; name: string; series: string }> = {
    j: { id: 'hs-international', name: '丽呈花盛国际酒店', series: '超高端奢华系列' },
    international: { id: 'hs-hotel', name: '丽呈花盛酒店', series: '高端商旅系列' },
    hotel: { id: 'hs-resort', name: '丽呈花盛度假酒店', series: '高端度假系列' },
  };
  const m = map[s.id];
  if (!m) return null;
  return {
    ...s,
    id: m.id,
    name: m.name,
    series: m.series,
    intro: HUASHENG_INTRO[m.id],
    requirements: [...HUASHENG_POLICY[m.id].requirements],
    policy: [...HUASHENG_POLICY[m.id].policy],
    samples: HUASHENG_SAMPLES[m.id] ? [...HUASHENG_SAMPLES[m.id]] : [...s.samples],
  };
}).filter((s): s is BrandSeries => s !== null);

/**
 * 丽呈花盛酒店系列
 * 系列数据与图片已独立，文案沿用系列定位描述（后续可逐项替换）。
 */
export const HUASHENG_CONTENT: BrandContent = {
  ...JIFENG_CONTENT,
  collectionNameZh: '丽呈花盛酒店系列品牌',
  collectionNameEn: 'REZEN HUASHENG HOTEL COLLECTION',
  hero: { image: '/assets/rezen/hs-hero.webp', alt: '丽呈花盛酒店系列品牌' },
  logo: { image: '/assets/rezen/jflogo-full.png', alt: '丽呈花盛酒店系列品牌 Logo' },
  introLogo: (seriesId) => HUASHENG_LOGOS[seriesId] ?? HUASHENG_LOGOS['hs-hotel'],
  slogan: { h1: '花', mid: '绽东方', h2: '盛', tail: '迎四海' },
  narrativeLead: '',
  accentColor: '#E2AC2B',
  spacesTitle: '丽呈花盛酒店系列布局',
  spacesTitleEn: 'Rezen Huasheng Hotel Collection Spaces',
  visualsTitle: '丽呈花盛品牌视觉',
  visualsTitleEn: 'Rezen Huasheng Brand Visuals',
  // 8 张花盛视觉物料：首行两张大图开场，二、三行各三张；方形图放在三图行中接近原比例，避免过度裁切
  visualRows: [
    [
      { n: 1, ratio: 1.79, src: '/assets/rezen/hs-visual-1.webp' },
      { n: 3, ratio: 1.79, src: '/assets/rezen/hs-visual-3.webp' },
    ],
    [
      { n: 4, ratio: 1.79, src: '/assets/rezen/hs-visual-4.webp' },
      { n: 6, ratio: 1.72, src: '/assets/rezen/hs-visual-6.webp' },
      { n: 2, ratio: 1.0, src: '/assets/rezen/hs-visual-2.webp' },
    ],
    [
      { n: 5, ratio: 1.79, src: '/assets/rezen/hs-visual-5.webp' },
      { n: 7, ratio: 1.79, src: '/assets/rezen/hs-visual-7.webp' },
      { n: 8, ratio: 1.79, src: '/assets/rezen/hs-visual-8.webp' },
    ],
  ],
  // 花盛布局实拍：大堂 / 休息区 / 会议室 / 大床房 / 双床房
  spaces: [
    {
      no: '01',
      image: '/assets/rezen/hs-space-lobby.webp',
      title: '大堂',
      desc: '深色石材与金属线条铺陈东方雅致，红色艺术背墙点题；接待与城市会客从容一体。',
    },
    {
      no: '02',
      image: '/assets/rezen/hs-space-lounge.webp',
      title: '休息区',
      desc: '挑高落地窗引入天光，木饰面与铜色装置相映，灰蓝座椅围合出半开放社交岛。',
    },
    {
      no: '03',
      image: '/assets/rezen/hs-space-meeting.webp',
      title: '会议室',
      desc: '无柱多功能厅可弹性分隔，会议与宴请双场景切换，专业影音让接待体面高效。',
    },
    {
      no: '04',
      image: '/assets/rezen/hs-space-king.webp',
      title: '大床房',
      desc: '灰墙衬着海棠红壁龛与艺术挂画，石材圆几、包覆单椅与落地灯错落安放，暖光托住松弛。',
    },
    {
      no: '05',
      image: '/assets/rezen/hs-space-twin.webp',
      title: '双床房',
      desc: '对称双床让同行的两人各有自在，红色壁龛与金属框画彼此呼应，宽适地毯吸走夜里的脚步。',
    },
  ],
  video: {
    src: '/videos/huasheng.mp4',
    poster: '/assets/rezen/hs-video-cover.webp',
    tag: '丽呈花盛酒店系列 · 品牌宣传片',
    desc: '从东方雅韵到国际礼遇，见证丽呈花盛的高端旅居表达',
  },
  banner: {
    ...JIFENG_CONTENT.banner,
    image: '/assets/rezen/hs-banner.webp',
    alt: '花绽东方 盛迎四海',
    slogan: { h1: '花', mid: '绽东方', h2: '盛', tail: '迎四海' },
    en: 'Blooming in the East, Welcoming the World',
    // 花盛海报整体提亮：图片不做透明度衰减，遮罩只压两侧
    imageClass: '',
    overlayClass: 'bg-gradient-to-r from-black/50 via-black/15 to-black/55',
  },
  propertyImage: { image: '/assets/rezen/hs-property.webp', alt: '丽呈花盛酒店物业配套' },
  series: HUASHENG_SERIES,
};

/**
 * 富士酒店系列（先复用季枫整套结构接入路由，后续逐个品牌替换素材与文案）
 * 四个品牌：富士丽雅（高端精品）/ 富士雅致（中高端）/ 富士国际（中高端商旅）/ 富士悦致（舒适商旅）
 */
/** 富士四品牌完整介绍（顶部介绍区第二段，品牌名开头会被红色加粗高亮） */
const FUJI_INTRO: Record<string, string> = {
  'fj-liya': '富士丽雅酒店是丽呈智旅旗下中高端走量主力，品牌主张"现代轻奢，商旅亲子两相宜"，面向中高端商务客、亲子家庭与长线休闲游客，主打现代轻奢、餐饮强项、目的地融合三大核心特质。品牌空间现代轻奢风，专业设计团队操刀，到旅游目的地深度融合当地文化（如喀什古城店融入西域风情），大堂配套星巴克咖啡服务。客房走商旅与亲子双场景配置，配套特色餐厅、健身房与会议空间。依托丽呈智旅集团600+店成熟运营体系与餐饮基因，为宾客提供"商旅+度假+请客吃饭"一站式的中高端旅居体验。',
  'fj-yazhi': '富士雅致酒店是丽呈智旅旗下富士系列精致商旅品牌，品牌主张"克制精致，高效商旅"，面向30-45岁频繁出差的商务客，主打克制商务、智能高效、咖啡社交三大核心特质。品牌空间走现代简约设计加智能化设施路线，线条干净、配色沉稳（孔雀蓝/墨绿点缀），大堂设咖啡角是富士系招牌。客房配办公桌、阅读灯、高速网，配套自助早餐厅、健身房与自助洗衣房。依托丽呈智旅成熟运营体系与富士系商务基因，为频繁出差宾客提供"高效、舒适、便捷"的精致商旅体验。',
  'fj-intl': '富士国际酒店是丽呈智旅旗下富士系列国际标准会议商旅品牌，品牌主张"国际标准，会议商旅"，面向中小企业出差团队与会议培训人群，主打国际标准、会议接待、酒加餐模式三大核心特质。品牌空间按国际标准配置，融入当地文化，现代轻奢风，金属加木饰面加大理石点缀。客房硬件比雅致高半档，配套30-100人多功能会议室、特色餐厅与健身中心。依托北京丽呈智旅全服团队运营与一店一设计标准，为中小企业商务与会议宾客提供"国际标准、舒适高效"的商旅体验。',
  'fj-yuezhi': '富士悦致酒店是丽呈智旅旗下富士系列年轻网红舒适商旅品牌，品牌主张"悦享生活，年轻出行"，面向22-30岁年轻出行人群、情侣与热爱生活分享的客群，主打年轻时尚、网红咖啡、智能便捷三大核心特质。品牌空间年轻化、时尚化，科技智能加便捷环保，大堂植入咖啡甜品与哈根达斯，公区搞成网红咖啡打卡点。房间整洁舒适、拍照出片，配色明快。依托丽呈智旅成熟运营体系与丽呈智旅系餐饮资源，为年轻出行宾客提供"干净上镜、有咖啡有社交"的年轻旅居体验。',
};

const FUJI_SERIES: BrandSeries[] = JIFENG_SERIES.map((s) => ({
  ...s,
  property: [...s.property],
  requirements: [...s.requirements],
  policy: [...s.policy],
  samples: [...s.samples],
})).map((s) => {
  const map: Record<string, { id: string; name: string; series: string }> = {
    j: { id: 'fj-liya', name: '富士丽雅酒店', series: '高端精品系列' },
    international: { id: 'fj-yazhi', name: '富士雅致酒店', series: '中高端雅致系列' },
    hotel: { id: 'fj-intl', name: '富士国际酒店', series: '中高端商旅系列' },
    resort: { id: 'fj-yuezhi', name: '富士悦致酒店', series: '舒适商旅系列' },
  };
  // 富士四品牌物业条件与合作政策（按品牌方提供表格录入）
  const conditions: Record<string, { requirements: string[]; policy: string[] }> = {
    'fj-liya': {
      requirements: ['面积要求：6000㎡以上', '最低房间量：100间', '资金要求：1500万以上'],
      policy: ['6000元/间', '营业额6%', '10万', '20万', '4000元/月', '订单金额的6%', '订单金额的1%', '20万', '100元/平', '10万'],
    },
    'fj-yazhi': {
      requirements: ['面积要求：4000㎡以上', '最低房间量：80间', '资金要求：1000万以上'],
      policy: ['5000元/间', '营业额6%', '10万', '15万', '4000元/月', '订单金额的6%', '订单金额的1%', '10万', '100元/平', '10万'],
    },
    'fj-intl': {
      requirements: ['面积要求：3000㎡以上', '最低房间量：60间', '资金要求：400万以上'],
      policy: ['4000元/间', '营业额5%', '10万', '15万', '3000元/月', '订单金额的6%', '订单金额的1%', '10万', '80元/平', '10万'],
    },
    'fj-yuezhi': {
      requirements: ['面积要求：3000㎡以上', '最低房间量：60间', '资金要求：400万以上'],
      policy: ['4000元/间', '营业额5%', '10万', '15万', '3000元/月', '订单金额的6%', '订单金额的1%', '10万', '80元/平', '10万'],
    },
  };
  const m = map[s.id];
  if (!m) return null;
  // 门店样例：丽雅已提供实拍（外观→大堂→咖啡区→早餐厅→套房→标间），其余品牌暂沿用季枫
  const samples: Record<string, string[]> = {
    'fj-liya': [1, 2, 3, 4, 5, 6].map((n) => `/assets/rezen/fj-liya-sample-${n}.webp`),
    'fj-yazhi': [1, 2, 3, 4, 5, 6].map((n) => `/assets/rezen/fj-yazhi-sample-${n}.webp`),
    'fj-intl': [1, 2, 3, 4, 5, 6].map((n) => `/assets/rezen/fj-intl-sample-${n}.webp`),
    'fj-yuezhi': [1, 2, 3, 4, 5, 6].map((n) => `/assets/rezen/fj-yuezhi-sample-${n}.webp`),
  };
  return { ...s, id: m.id, name: m.name, series: m.series, intro: FUJI_INTRO[m.id], samples: samples[m.id] ?? s.samples, ...conditions[m.id] };
}).filter((s): s is BrandSeries => s !== null);

// 富士 FJ 字母标：四品牌共用；原图 501×501 带留白，裁切后竖版 181×380，按花盛标准显示
const FUJI_LOGO: BrandLogo = {
  image: '/assets/rezen/fj-logo-trim.webp',
  alt: '富士酒店系列品牌 Logo',
  sizeClass: 'h-[52px] md:h-16',
  marginClass: 'mb-4',
};

export const FUJI_CONTENT: BrandContent = {
  ...JIFENG_CONTENT,
  collectionNameZh: '富士酒店系列品牌',
  collectionNameEn: 'FUJI HOTEL COLLECTION',
  hero: { image: '/assets/rezen/fj-hero.webp', alt: '富士酒店系列品牌' },
  introLogo: () => FUJI_LOGO,
  slogan: { h1: '富', mid: '启智境', h2: '士', tail: '悦舒居' },
  // 富士强调色取自 FJ 字母标 J 部分的科技蓝
  accentColor: '#4488BB',
  // 富士页介绍区不显示系列引导语，直接进入各品牌介绍
  narrativeLead: '',
  video: {
    src: '/videos/fuji.mp4',
    poster: '/assets/rezen/fj-video-cover.webp',
    tag: '富士酒店系列 · 品牌宣传片',
    desc: '智能科技与人本舒适交融，全景呈现富士酒店系列四大品牌产品线',
  },
  spacesTitle: '富士酒店系列布局',
  spacesTitleEn: 'Fuji Hotel Collection Spaces',
  visualsTitle: '富士品牌视觉',
  visualsTitleEn: 'Fuji Brand Visuals',
  // 富士 VI 物料：卫浴场景开场（宽幅台面全景），文仪/浴袍/餐饮居中，洗护细节收尾
  visualRows: [
    [
      { n: 2, ratio: 1.5, src: '/assets/rezen/fj-visual-2.webp' },
      { n: 7, ratio: 2.1, src: '/assets/rezen/fj-visual-7.webp' },
    ],
    [
      { n: 1, ratio: 1.49, src: '/assets/rezen/fj-visual-1.webp' },
      { n: 3, ratio: 1.03, src: '/assets/rezen/fj-visual-3.webp' },
      { n: 5, ratio: 1.27, src: '/assets/rezen/fj-visual-5.webp' },
    ],
    [
      { n: 4, ratio: 1.62, src: '/assets/rezen/fj-visual-4.webp' },
      { n: 6, ratio: 1.68, src: '/assets/rezen/fj-visual-6.webp' },
      { n: 8, ratio: 1.69, src: '/assets/rezen/fj-visual-8.webp' },
    ],
  ],
  // 富士五空间实拍：现代轻奢大堂 / 鸟笼卡座休息区 / 大课桌会议室 / 城景大床房 / 墨绿双床房
  spaces: [
    { no: '01', title: '大堂', image: '/assets/rezen/fj-space-lobby.webp',
      desc: '大理石地面映着暖金灯带，前台以石纹背景与金属格栅勾勒轻奢质感，旋转楼梯拾级而上。' },
    { no: '02', title: '休息区', image: '/assets/rezen/fj-space-lounge.webp',
      desc: '挑高天窗引光入室，铜色鸟笼卡座与绿植错落排布，一杯咖啡就能坐享半日闲暇。' },
    { no: '03', title: '会议室', image: '/assets/rezen/fj-space-meeting.webp',
      desc: '大空间课桌式会场配弧形灯带天花与孔雀蓝窗帘，百人培训与商务会议从容承载。' },
    { no: '04', title: '大床房', image: '/assets/rezen/fj-space-king.webp',
      desc: '环幕落地窗收纳城市天际线，暖木与酒红单椅点缀其间，躺在床上即拥一城风景。' },
    { no: '05', title: '双床房', image: '/assets/rezen/fj-space-twin.webp',
      desc: '对称双床配墨绿软包床头，暖光灯带勾勒层次，同行两人各有舒适自在。' },
  ],
  banner: {
    ...JIFENG_CONTENT.banner,
    image: '/assets/rezen/fj-banner.webp',
    alt: '富启智境 士悦舒居',
    slogan: { h1: '富', mid: '启智境', h2: '士', tail: '悦舒居' },
    en: 'Smart Living, Comfort Beyond',
    // 与花盛一致的提亮处理：图片不做透明度衰减，遮罩只压两侧
    imageClass: '',
    overlayClass: 'bg-gradient-to-r from-black/50 via-black/15 to-black/55',
  },
  propertyImage: { image: '/assets/rezen/fj-property.webp', alt: '富士酒店物业配套' },
  series: FUJI_SERIES,
};

/* ================= 巴里岛酒店系列（先复用季枫结构，后续逐个替换素材） ================= */

// 巴里岛 logo：原图 329×329 带透明留白，裁切后 211×188，按花盛/富士标准显示
const BALIDAO_LOGO: BrandLogo = {
  image: '/assets/rezen/bld-logo-trim.webp',
  alt: '巴里岛酒店系列品牌 Logo',
  sizeClass: 'h-[52px] md:h-16',
  marginClass: 'mb-4',
};

const BALIDAO_INTRO: Record<string, string> = {
  'bld-intl':
    '巴里岛国际酒店是丽呈智旅旗下欧式经典综合酒店品牌，品牌主张"欧式经典，城市会客厅"，面向地市级城市商务接待、婚宴与家庭出游人群，主打欧式气派、复合经营、星级标准三大核心特质。品牌空间走欧式/法式经典风，偏气派，打造"客房+咖啡馆+西餐厅"复合经营空间，咖啡馆引入星巴克咖啡服务。客房按星级标准建设，配套餐饮、会议、管家服务。依托丽呈智旅运营体系与巴里岛品牌一二三四线深耕经验，为宾客提供"请客办事上档次"的体面欧式旅居体验。',
  'bld-resort':
    '巴里岛度假酒店是丽呈智旅旗下巴里岛系列康养度假品牌，品牌主张"南洋风情，康养慢生活"，面向30-45岁家庭周末度假与情侣休闲人群，主打南洋风情、康养SPA、管家服务三大核心特质。品牌空间走热带度假风情，藤编、木雕、暖光、棕榈元素，餐饮走欧式路线。客房配康养设施，配套康养SPA、精选咖啡吧、管家服务与欧式餐厅。依托丽呈智旅运营体系与巴里岛品牌三四线深耕经验，为宾客提供"离城市不远、能泡能躺"的南洋风康养度假体验。',
  'bld-holiday':
    '巴里岛假日酒店是丽呈智旅旗下巴里岛系列性价比舒适商旅品牌，品牌主张"都市里的南洋悠闲"，面向本地周末休闲出行、周边短途游与家庭短期出行人群，主打南洋风情、性价比、商圈便利三大核心特质。品牌空间以东南亚度假风情为设计灵感，融入自然材质和艺术设计，吊扇、藤椅、暖光灯，开在商圈或县城主干道上。客房走南洋风加性价比配置，配套自助早餐厅与简餐服务。依托丽呈智旅运营体系与巴里岛品牌下沉经验，为宾客提供"性价比第一、都市里也有度假感"的舒适商旅体验。',
};

const BALIDAO_SERIES: BrandSeries[] = JIFENG_SERIES.map((s) => JSON.parse(JSON.stringify(s)) as BrandSeries)
  .map((s) => {
    const map: Record<string, { id: string; name: string; series: string } | null> = {
      j: { id: 'bld-intl', name: '巴里岛国际酒店', series: '高端滨海度假系列' },
      international: { id: 'bld-resort', name: '巴里岛度假酒店', series: '中高端滨海轻度假系列' },
      hotel: { id: 'bld-holiday', name: '巴里岛假日酒店', series: '舒适假日系列' },
      resort: null,
    };
    // 巴里岛三品牌物业条件与合作政策（按品牌方提供表格录入）
    const conditions: Record<string, { requirements: string[]; policy: string[] }> = {
      'bld-resort': {
        requirements: ['面积要求：8000㎡以上', '最低房间量：100间', '资金要求：2000万以上'],
        policy: ['6000元/间', '营业额6%', '10万', '20万', '5000元/月', '订单金额的6%', '订单金额的1%', '10万', '100元/平', '20万'],
      },
      'bld-intl': {
        requirements: ['面积要求：5000㎡以上', '最低房间量：80间', '资金要求：1200万以上'],
        policy: ['5000元/间', '营业额6%', '10万', '20万', '5000元/月', '订单金额的6%', '订单金额的1%', '10万', '80元/平', '10万'],
      },
      'bld-holiday': {
        requirements: ['面积要求：3000㎡以上', '最低房间量：60间', '资金要求：600万以上'],
        policy: ['4000元/间', '营业额5%', '10万', '15万', '3000元/月', '订单金额的6%', '订单金额的1%', '10万', '80元/平', '10万'],
      },
    };
    const hit = map[s.id];
    if (!hit) return null;
    // 门店样例：国际（外观→大堂×2→套房→豪华房→标准间）、度假（外观→餐厅×2→健身房→大床房→套房客厅）、假日（外立面→大厅×2→大床房→双床房×2）均已提供实拍
    const samples: Record<string, string[]> = {
      'bld-intl': [1, 2, 3, 4, 5, 6].map((n) => `/assets/rezen/bld-intl-sample-${n}.webp`),
      'bld-resort': [1, 2, 3, 4, 5, 6].map((n) => `/assets/rezen/bld-resort-sample-${n}.webp`),
      'bld-holiday': [1, 2, 3, 4, 5, 6].map((n) => `/assets/rezen/bld-holiday-sample-${n}.webp`),
    };
    return { ...s, id: hit.id, name: hit.name, series: hit.series, intro: BALIDAO_INTRO[hit.id], samples: samples[hit.id] ?? s.samples, ...conditions[hit.id] };
  })
  .filter((s): s is BrandSeries => s !== null);

export const BALIDAO_CONTENT: BrandContent = {
  ...JIFENG_CONTENT,
  collectionNameZh: '巴里岛酒店系列品牌',
  collectionNameEn: 'BALIDAO HOTEL COLLECTION',
  hero: { image: '/assets/rezen/bld-hero.webp', alt: '巴里岛酒店系列品牌' },
  introLogo: () => BALIDAO_LOGO,
  slogan: { h1: '巴里', mid: '拾光', h2: '岛', tail: '居慢享' },
  // 巴里岛强调色取自 logo 主色的度假浅金
  accentColor: '#C9A76D',
  narrativeLead: '',
  video: {
    src: '/videos/balidao.mp4',
    poster: '/assets/rezen/bld-video-cover.webp',
    tag: '巴里岛酒店系列 · 品牌宣传片',
    desc: '欧式经典与南洋风情交融，全景呈现巴里岛酒店系列三大品牌产品线',
  },
  spacesTitle: '巴里岛酒店系列布局',
  spacesTitleEn: 'Balidao Hotel Collection Spaces',
  // 巴里岛五空间实拍：欧式大堂 / 餐厅 / 健身房 / 豪华房 / 标准间
  spaces: [
    { no: '01', title: '大堂', image: '/assets/rezen/bld-space-lobby.webp',
      desc: '挑高穹顶与大理石柱式铺陈欧式气派，水晶灯与暖金光带交映，进门即有待客排面。' },
    { no: '02', title: '餐厅', image: '/assets/rezen/bld-space-dining.webp',
      desc: '欧式西餐厅格调雅致，自助早餐与西式简餐兼备，商务宴请与家庭聚餐都体面从容。' },
    { no: '03', title: '健身房', image: '/assets/rezen/bld-space-gym.webp',
      desc: '跑步机与力量器械沿窗排布，旅途中的锻炼节奏不被打断，挥汗之后满血再出发。' },
    { no: '04', title: '豪华房', image: '/assets/rezen/bld-space-king.webp',
      desc: '欧式线条与暖色织物围合出舒展空间，大床宽适好眠，临窗沙发与书桌让休憩和临时办公两不相扰。' },
    { no: '05', title: '标准间', image: '/assets/rezen/bld-space-twin.webp',
      desc: '对称双床简洁大方，实木质感与暖光托住一夜安稳，家人同行或结伴出游，各自都有自在天地。' },
  ],
  visualsTitle: '巴里岛品牌视觉',
  visualsTitleEn: 'Balidao Brand Visuals',
  // 巴里岛 VI 物料 9 张：宽幅两张开场，其余按 3/4 分两行
  visualRows: [
    [
      { n: 5, ratio: 1.83, src: '/assets/rezen/bld-visual-5.webp' },
      { n: 2, ratio: 1.61, src: '/assets/rezen/bld-visual-2.webp' },
    ],
    [
      { n: 1, ratio: 1.41, src: '/assets/rezen/bld-visual-1.webp' },
      { n: 3, ratio: 1.41, src: '/assets/rezen/bld-visual-3.webp' },
      { n: 4, ratio: 1.41, src: '/assets/rezen/bld-visual-4.webp' },
    ],
    [
      { n: 6, ratio: 0.93, src: '/assets/rezen/bld-visual-6.webp' },
      { n: 7, ratio: 1.41, src: '/assets/rezen/bld-visual-7.webp' },
      { n: 8, ratio: 1.41, src: '/assets/rezen/bld-visual-8.webp' },
      { n: 9, ratio: 1.41, src: '/assets/rezen/bld-visual-9.webp' },
    ],
  ],
  banner: {
    ...JIFENG_CONTENT.banner,
    image: '/assets/rezen/bld-banner.webp',
    slogan: { h1: '巴里', mid: '拾光', h2: '岛', tail: '居慢享' },
    alt: '巴里拾光 岛居慢享',
    en: 'Moments by the Sea, Slow Stays on the Island',
    // 巴里岛海报遮罩：中间文字区加深一点保证可读性
    imageClass: '',
    overlayClass: 'bg-gradient-to-r from-black/60 via-black/35 to-black/65',
  },
  propertyImage: { image: '/assets/rezen/bld-property.webp', alt: '巴里岛酒店物业配套' },
  series: BALIDAO_SERIES,
};

/* ================= 丽钻酒店（单品牌，先复用季枫结构，后续逐项替换素材与文案） ================= */

// 丽钻 logo：沿用品牌矩阵的白色 R 字母标转黑色版，裁切留白后 240×172，按统一标准显示
const LIZUAN_LOGO: BrandLogo = {
  image: '/assets/rezen/lz-logo-trim.webp',
  alt: '丽钻酒店 Logo',
  sizeClass: 'h-[52px] md:h-16',
  marginClass: 'mb-4',
};

const LIZUAN_SLOGAN: SloganParts = { h1: '丽', mid: '享微旅', h2: '钻', tail: '享好眠' };

// 丽钻与朵致共用同一套品牌合作政策
const LIZUAN_DUOZHI_POLICY_ROWS: NonNullable<BrandSeries['policyRows']> = [
  { label: '最低房间量', value: '20间' },
  { label: '授权合作费', value: '2000元/间', note: '一次性费用' },
  { label: '品牌保证金', value: '2万', note: '一次性费用，到期可退' },
  { label: '筹备及系统费', value: '10万', note: '筹备上线、数字化系统安装、培训、流量充值' },
  { label: '管理费', value: '营业额5%', note: '次月结算' },
  { label: '系统维护费', value: '3000元/月', note: '系统使用、数据云端存储、升级' },
  { label: '会员输送费', value: '订单金额的6%' },
  { label: '品牌使用费', value: '订单金额的1%' },
];

const LIZUAN_SERIES: BrandSeries[] = [
  {
    ...(JSON.parse(JSON.stringify(JIFENG_SERIES[2])) as BrandSeries),
    id: 'lz',
    name: '丽钻酒店',
    series: '城市微旅系列',
    intro:
      '丽钻酒店是丽呈智旅旗下都市商旅甄选品牌，品牌主张"轻改焕新，简奢质感"，面向注重品质与性价比的商务出行人群，主打克制美学、简奢质感、高性价比三大核心特质。品牌空间不追求奢华堆砌，走"克制的美学""简奢"路线，浅灰加原木加暖色调，线条干净、质感本真。客房配备高品质床垫、焕新卫浴与智能客控，配套自助早餐厅、健身房与自助洗衣房。依托丽呈智旅成熟运营体系，为商务宾客提供"比同价位干净一点、新一点"的简奢商旅体验。',
    policy: [],
    policyRows: LIZUAN_DUOZHI_POLICY_ROWS,
  },
];

export const LIZUAN_CONTENT: BrandContent = {
  ...JIFENG_CONTENT,
  collectionNameZh: '丽钻酒店',
  collectionNameEn: 'LIZUAN HOTEL',
  hero: { image: '/assets/rezen/lz-hero.webp', alt: '丽钻酒店' },
  introLogo: () => LIZUAN_LOGO,
  slogan: LIZUAN_SLOGAN,
  // 丽钻强调色取自 VI 主视觉的墨绿（抱枕/咖啡杯/收纳袋同色系的可读化提亮眼值）
  accentColor: '#2E6B50',
  // 丽钻页介绍区不显示系列引导语，直接进入品牌介绍
  narrativeLead: '',
  // 丽钻品牌宣传片
  video: {
    src: '/videos/lizuan.mp4',
    poster: '/assets/rezen/lz-video-cover.webp',
    tag: '丽钻酒店 · 品牌宣传片',
    desc: '丽钻酒店品牌形象展示',
  },
  spacesTitle: '丽钻酒店系列布局',
  spacesTitleEn: 'Lizuan Hotel Collection Spaces',
  // 丽钻五空间：克制美学公区（浅灰+原木+暖调）与简奢客房
  spaces: [
    { no: '01', title: '大堂', image: '/assets/rezen/lz-space-lobby.webp',
      desc: '浅灰水磨石地面映衬原木方格吊顶，青绿弧形沙发与水墨屏风点出暖意，前台与零售角一体排布。' },
    { no: '02', title: '休息区', image: '/assets/rezen/lz-space-lounge.webp',
      desc: '整面格窗把江景引入室内，青绿半包围卡座与灰色单椅相对而设，壁灯亮起，小坐片刻正好。' },
    { no: '03', title: '自助入住', image: '/assets/rezen/lz-space-buffet.webp',
      desc: '自助入住登记机与人工前台并排而设，水磨石台面配木饰面背景墙，到店片刻即可拿卡上楼。' },
    { no: '04', title: '大床房', image: '/assets/rezen/lz-space-king.webp',
      desc: '开放式洗漱台配青绿浴室柜，浴袍、茶具与智能电视各就其位，浅灰原木之间透着简奢质感。' },
    { no: '05', title: '双床房', image: '/assets/rezen/lz-space-twin.webp',
      desc: '对称双床配青绿与橘棕撞色床头，木地板铺陈暖调，大窗采光充足，两人同行各睡各的安稳。' },
  ],
  visualsTitle: '丽钻品牌视觉',
  visualsTitleEn: 'Lizuan Brand Visuals',
  // 丽钻 VI 物料 8 张（墨绿+米白体系）：迎宾开场→客房好物→餐饮生活收尾，2+3+3 等比排版
  visualRows: [
    [
      { n: 1, ratio: 1.5, src: '/assets/rezen/lz-visual-1.webp' },
      { n: 2, ratio: 1.5, src: '/assets/rezen/lz-visual-2.webp' },
    ],
    [
      { n: 3, ratio: 1.5, src: '/assets/rezen/lz-visual-3.webp' },
      { n: 4, ratio: 1.5, src: '/assets/rezen/lz-visual-4.webp' },
      { n: 5, ratio: 1.5, src: '/assets/rezen/lz-visual-5.webp' },
    ],
    [
      { n: 6, ratio: 1.5, src: '/assets/rezen/lz-visual-6.webp' },
      { n: 7, ratio: 1.5, src: '/assets/rezen/lz-visual-7.webp' },
      { n: 8, ratio: 1.14, src: '/assets/rezen/lz-visual-8.webp' },
    ],
  ],
  // 丽钻宣传栏、物业条件、门店样例物料未出，整体下线（显式置空覆盖继承值）；合作政策独立展示
  banner: undefined,
  propertyImage: undefined,
  series: LIZUAN_SERIES,
};

/* ================= 朵致酒店（单品牌，复制丽钻页面结构，内容待替换） ================= */
const DUOZHI_LOGO: BrandLogo = {
  // 朵致 logo 原图为白色花瓣+橙色花蕊，已转黑色（橙点保留）用于浅色介绍区
  image: '/assets/rezen/dz-logo-trim.webp',
  alt: '朵致酒店 Logo',
  sizeClass: 'h-[52px] md:h-16',
  marginClass: 'mb-4',
};

const DUOZHI_SERIES: BrandSeries[] = [
  {
    ...(JSON.parse(JSON.stringify(JIFENG_SERIES[2])) as BrandSeries),
    id: 'dz',
    name: '朵致酒店',
    series: '城市精致系列',
    intro:
      '朵致酒店是丽呈智旅旗下新一代城市精致酒店品牌，品牌主张“恰好正年轻，恰好在朵致”，面向18-28岁年轻学生群体与初入职场的年轻人群，主打音乐治愈、香氛社交、年轻质感三大核心特质。品牌空间跳脱传统酒店固化设计，打造音乐+香氛沉浸式场景，配套轻音乐治愈空间、专属香氛系统与零压好眠床。公区咖啡+社交+自习三合一，20间小而美也能做，80-100间为标准店型。依托丽呈智旅成熟运营体系，布局年轻客群聚集区，为年轻宾客提供轻松自在、有质感的社交旅居体验。',
    policy: [],
    policyRows: LIZUAN_DUOZHI_POLICY_ROWS,
  },
];

export const DUOZHI_CONTENT: BrandContent = {
  ...LIZUAN_CONTENT,
  collectionNameZh: '朵致酒店',
  collectionNameEn: 'DUOZHI HOTEL',
  hero: { image: '/assets/rezen/dz-hero.webp', alt: '朵致酒店' },
  introLogo: () => DUOZHI_LOGO,
  slogan: { h1: '朵', mid: '暖旅途', h2: '致', tail: '在如归' },
  // 朵致强调色取自 logo 花蕊橙
  accentColor: '#FE6700',
  spacesTitle: '朵致酒店布局',
  spacesTitleEn: 'Duozhi Hotel Spaces',
  visualsTitle: '朵致品牌视觉',
  visualsTitleEn: 'DUOZHI BRAND VISUALS',
  // 朵致 VI 8 张（橙色主视觉）：帆布袋/香薰套组两大幅 + 名片/笔记本/胸牌 + 门牌/抱枕 2+3+3
  visualRows: [
    [
      { n: 1, ratio: 1.53, src: '/assets/rezen/dz-vi-1.webp' },
      { n: 2, ratio: 1.46, src: '/assets/rezen/dz-vi-2.webp' },
    ],
    [
      { n: 3, ratio: 1.5, src: '/assets/rezen/dz-vi-3.webp' },
      { n: 4, ratio: 1.5, src: '/assets/rezen/dz-vi-4.webp' },
      { n: 5, ratio: 1.5, src: '/assets/rezen/dz-vi-5.webp' },
    ],
    [
      { n: 6, ratio: 1.5, src: '/assets/rezen/dz-vi-6.webp' },
      { n: 7, ratio: 1.45, src: '/assets/rezen/dz-vi-7.webp' },
      { n: 8, ratio: 1.5, src: '/assets/rezen/dz-vi-8.webp' },
    ],
  ],
  // 朵致五空间：橙绿撞色的年轻公区（咖啡+社交+自习）与轻质感客房
  spaces: [
    {
      no: '01',
      image: '/assets/rezen/dz-space-lobby.webp',
      title: '大堂',
      desc: '挑高大堂以橙色沙发与彩色艺术地毯点亮空间，迷你咖啡吧与城市地标插画墙相对，落地窗引入满室自然光。',
    },
    {
      no: '02',
      image: '/assets/rezen/dz-space-lounge.webp',
      title: '休息区',
      desc: '模块沙发与休闲椅围出松弛角落，咖啡香混着专属香氛，社交、自习与小憩在这里各得其所。',
    },
    {
      no: '03',
      image: '/assets/rezen/dz-space-selfservice.webp',
      title: '自助区',
      desc: '自助入住机与水磨石前台并列，行李寄存随手可及，香氛展示台静立一旁，抵店离店都快人一步。',
    },
    {
      no: '04',
      image: '/assets/rezen/dz-space-laundry.webp',
      title: '洗衣房',
      desc: '洗烘一体设备整齐列队，暖光灯牌下挂衣架与绿植相伴，长途出行也能随时焕新衣物。',
    },
    {
      no: '05',
      image: '/assets/rezen/dz-space-twin.webp',
      title: '双床房',
      desc: '橙色床头点亮素净空间，零压好眠床配纯白床品，挂墙电视与轻便书桌齐备，好友同行各睡各的舒服。',
    },
  ],
  video: {
    src: '/videos/duozhi.mp4',
    poster: '/assets/rezen/dz-video-cover.webp',
    tag: '朵致酒店 · 品牌宣传片',
    desc: '朵致酒店品牌形象展示',
  },
  series: DUOZHI_SERIES,
};

/* ================= 携程度假农庄（单品牌，复制丽钻页面结构，素材暂用丽钻占位，待逐步替换） ================= */
// 携程农庄 logo：原白色屋顶山形+中英文标，已转黑色并裁切留白，用于浅色介绍区
const XC_LOGO: BrandLogo = {
  image: '/assets/rezen/xc-logo-trim.webp',
  alt: '携程度假农庄 Logo',
  sizeClass: 'h-[96px] md:h-32',
  marginClass: 'mb-4',
};

const CTRIP_FARM_SERIES: BrandSeries[] = [
  {
    ...(JSON.parse(JSON.stringify(JIFENG_SERIES[2])) as BrandSeries),
    id: 'cf',
    name: '携程度假农庄',
    series: '田园度假系列',
    intro:
      '携程度假农庄是乡村野奢度假品牌，品牌主张"住进山野，回归自然"，面向追求品质微度假的城市中产与亲子家庭，主打野奢、设计、管家三大核心特质。品牌空间山水田园风，每个门店由设计师量身打造，深度融合在地文化——安吉店走江南中式、峨眉山店走山景私汤路线。客房配备智能马桶、地暖、智能灯控窗帘与定制洗浴用品，配套无边泳池、萌宠乐园、管家服务、晚安甜汤。依托携程成熟预订体系与乡村振兴项目资源，布局国内知名文旅目的地与乡村景区，为宾客提供"住得舒服又能体验乡野"的高端乡村度假体验。',
  },
];

export const CTRIP_FARM_CONTENT: BrandContent = {
  ...LIZUAN_CONTENT,
  collectionNameZh: '携程度假农庄',
  collectionNameEn: 'TRIP.COM GROUP COUNTRY RETREATS',
  hero: { image: '/assets/rezen/xc-hero.webp', alt: '携程度假农庄' },
  introLogo: () => XC_LOGO,
  // 携程农庄介绍区不显示 8 字标语（四字拼接为空即不渲染），仅展示放大版 logo
  slogan: { h1: '', mid: '', h2: '', tail: '' },
  // 强调色暂取田园绿，待 VI 物料确认后调整
  accentColor: '#4A7C59',
  spacesTitle: '携程度假农庄布局',
  spacesTitleEn: 'Trip.com Group Country Retreats Spaces',
  spaces: [
    { no: '01', title: '大堂', image: '/assets/rezen/xc-space-lobby.webp',
      desc: '挑高空间搭配木质格栅与柔和灯光，接待区、休息区沿动线展开，呈现自然克制的中式质感。' },
    { no: '02', title: '臻选好物区', image: '/assets/rezen/xc-space-retail.webp',
      desc: '开放式展柜陈列茶器、礼盒与精选好物，离店前可挑选伴手礼，把山野记忆带回家。' },
    { no: '03', title: '会客区', image: '/assets/rezen/xc-space-villa.webp',
      desc: '上下两层均设有舒适座椅与开阔露台，落地窗引入山野景色，适合小坐交谈、放松休憩。' },
    { no: '04', title: '山景双床房', image: '/assets/rezen/xc-space-twin.webp',
      desc: '原木格栅分隔卧室与洗漱区，全景落地窗将山林绿意引入室内，双床布局适合亲友结伴同行。' },
    { no: '05', title: '庭院双床房', image: '/assets/rezen/xc-space-courtyard-twin.webp',
      desc: '客房连通户外庭院，靠窗茶席与双床布局兼顾休憩和交流，推窗即可感受乡野气息。' },
  ],
  visualsTitle: '携程度假农庄品牌视觉',
  visualsTitleEn: 'TRIP.COM GROUP COUNTRY RETREATS BRAND VISUALS',
  // 携程农庄专属宣传片与封面
  video: {
    src: '/videos/ctrip-farm.mp4',
    poster: '/assets/rezen/xc-video-cover.webp',
    tag: '携程度假农庄 · 品牌宣传片',
    desc: '携程度假农庄品牌形象展示',
  },
  series: CTRIP_FARM_SERIES,
};

/* ================= 新世界酒店（单品牌，复用携程度假农庄页面结构） ================= */
const NEW_WORLD_LOGO: BrandLogo = {
  image: '/assets/rezen/nw-logo-trim.webp',
  alt: '新世界酒店 Logo',
  sizeClass: 'h-16 md:h-20',
  marginClass: 'mb-4',
};

const NEW_WORLD_SERIES: BrandSeries[] = [
  {
    ...(JSON.parse(JSON.stringify(JIFENG_SERIES[2])) as BrandSeries),
    id: 'nw',
    name: '新世界酒店',
    series: '都会典雅系列',
    intro:
      '新世界酒店是现代亚洲生活方式奢华酒店品牌，品牌主张“现代亚洲待客之道”，面向企业中层以上商务客与品质家庭出行人群，主打东方美学、当代设计、餐饮社交三大核心特质。品牌空间融合传统东方美学与当代设计语言，不走老派奢华路线，偏生活方式感。客房选址门户城市核心地段或度假胜地，配套特色餐厅、行政酒廊、健身中心、会议空间。依托集团成熟运营体系，布局香港、武汉、重庆、海南东方等门户城市与度假目的地，为宾客提供商务与休闲兼具的精致旅居体验。',
  },
];

// 新世界酒店布局：城景大床房、城景双床房、行政酒廊、餐饮社交空间、宴会会议厅
const NEW_WORLD_SPACES: BrandSpace[] = [
  {
    no: '01',
    image: '/assets/rezen/nw-space-1.webp',
    title: '城景大床房',
    desc: '暖木色调搭配皮革与金属细节，落地窗引入城市景观，兼顾舒眠、办公与休憩需求。',
  },
  {
    no: '02',
    image: '/assets/rezen/nw-space-2.webp',
    title: '城景双床房',
    desc: '双床布局明亮通透，配备独立休憩区与开阔城景，适合商务同行及家庭出行。',
  },
  {
    no: '03',
    image: '/assets/rezen/nw-space-3.webp',
    title: '行政酒廊',
    desc: '以木质家具、壁炉与阅读陈设营造松弛氛围，为宾客提供会客、阅读与小憩空间。',
  },
  {
    no: '04',
    image: '/assets/rezen/nw-space-4.webp',
    title: '餐饮社交空间',
    desc: '长桌、吧台与休闲座席灵活组合，满足用餐、聚会与轻商务交流等多种场景。',
  },
  {
    no: '05',
    image: '/assets/rezen/nw-space-5.webp',
    title: '宴会会议厅',
    desc: '配备舞台、灯光与灵活会议座席，可承接商务会议、宴会及品牌活动。',
  },
];

export const NEW_WORLD_CONTENT: BrandContent = {
  ...CTRIP_FARM_CONTENT,
  collectionNameZh: '新世界酒店',
  collectionNameEn: 'NEW WORLD HOTEL',
  hero: { image: '/assets/rezen/nw-hero.webp', alt: '新世界酒店' },
  introLogo: () => NEW_WORLD_LOGO,
  // 新世界介绍区不显示 8 字标语，保留下方分隔线
  slogan: { h1: '', mid: '', h2: '', tail: '' },
  // 强调色暂取典雅金棕，待 VI 物料确认后调整
  accentColor: '#8A6D3B',
  // 新世界酒店专属宣传片与封面
  video: {
    src: '/videos/new-world.mp4',
    poster: '/assets/rezen/nw-video-cover.webp',
    tag: '新世界酒店 · 品牌宣传片',
    desc: '新世界酒店品牌形象展示',
  },
  spacesTitle: '新世界酒店布局',
  spacesTitleEn: 'New World Hotel Spaces',
  spaces: NEW_WORLD_SPACES,
  visualsTitle: '新世界酒店品牌视觉',
  visualsTitleEn: 'NEW WORLD HOTEL BRAND VISUALS',
  series: NEW_WORLD_SERIES,
};

export const BRAND_CONTENT: Record<BrandCollection, BrandContent> = {
  jifeng: JIFENG_CONTENT,
  huasheng: HUASHENG_CONTENT,
  fuji: FUJI_CONTENT,
  balidao: BALIDAO_CONTENT,
  lizuan: LIZUAN_CONTENT,
  duozhi: DUOZHI_CONTENT,
  'ctrip-farm': CTRIP_FARM_CONTENT,
  'new-world': NEW_WORLD_CONTENT,
};
