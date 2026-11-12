import React, { useState } from 'react';
import {
  TrendingUp,
  Building2,
  ShieldCheck,
  Users,
  Compass,
  ArrowRight,
  RotateCw,
  Sparkles,
  BarChart3,
  Coins,
  Store,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Crown,
  GraduationCap,
  CheckCircle2,
  Zap,
  Coffee,
  Database,
  Cpu,
  Layers,
  Award,
  Wallet,
  Clock,
  Building,
  Target,
  Banknote,
  Percent
} from 'lucide-react';
import { Reveal } from './Reveal';

// ============================================================================
// 丽呈智旅十大合作优势核心数据源
// 字体、字阶与版式完全对齐「关于我们」与「品牌矩阵」
// 4字前缀打头 · 金融支持移至第10项（收官压轴）
// ============================================================================

export interface CooperationAdvantage {
  id: string;
  number: string;
  prefix: string; // 4个字开头
  title: string;
  tagline: string;
  category: '精准定位' | '灵动设计' | '降本增效' | '核心科技' | '超级背书' | '急速爬坡' | '现金自由' | '人才无忧' | '复合溢价' | '金融支持';
  brief: string;
  description: string;
  metrics: {
    label: string;
    value: string;
    desc: string;
  }[];
  features: string[];
  image: string;
  badge: string;
}

export const TEN_COOPERATION_ADVANTAGES: CooperationAdvantage[] = [
  {
    id: 'advantage-01',
    number: '01',
    prefix: '精准定位',
    title: '精准定位 · 携程大数据商圈收益反推模型',
    tagline: '携程商圈大数据测算 · 科学反推装修预算 · 实现快速回本',
    category: '精准定位',
    brief: '传统加盟常先堆装修、后算收益，推高造价并拉长回本周期。丽呈智旅依托携程商圈大数据与物业条件，先测算回报，再反推装修预算，让投入更精准、回本更可控。',
    description: '通过携程全域商旅出行大数据与属地商圈热力雷达，精准测算项目周边3-5公里客群画像、消费意愿、房型偏好及竞对RevPAR价格弹性。结合物业建筑格局与租金成本，构建科学的现金流与收益平衡模型，反推每间房最优装修改造预算，杜绝过度装修与超额负债。',
    metrics: [
      { label: '大数据测算覆盖', value: '3-5KM', desc: '全维度竞对与客源热力' },
      { label: '投入回本周期缩短', value: '30%+', desc: '逆推预算避免超支浪费' },
      { label: '收益模型准确率', value: '96.5%', desc: '携程真实消费数据验算' },
      { label: '单房预算溢价控制', value: '0浪费', desc: '每一分钱投入都在刀刃上' },
    ],
    features: [
      '携程商圈大数据精准客群画像与真实客单价穿透',
      '反向测算单房装修改造预算上限，杜绝沉没成本',
      '定制1-3-5年财务收益现金流敏感性分析与退出模型',
    ],
    image: '/assets/rezen/adv-1.webp',
    badge: '精准定位 · 逆推控投',
  },
  {
    id: 'advantage-02',
    number: '02',
    prefix: '灵动设计',
    title: '灵动设计 · 在地人文与投资人定制融合',
    tagline: '主流客群定位 · 属地人文历史 · 投资人愿景 · 品牌美学交融',
    category: '灵动设计',
    brief: '传统连锁千店一面，容易陷入同质化竞争。丽呈智旅坚持一店一设计，将客群需求、属地人文与投资人愿景融入空间，兼顾辨识度、功能坪效与耐久性，让设计形成长期溢价。',
    description: '丽呈秉持“一店一设计、一店一故事”的在地化空间哲学。由资深高星级酒店空间设计师操刀，在传承品牌高端精致调性的同时，深度提炼所在城市的文化脉络与地理风情，结合投资人的个人审美追求，实现艺术美学、高功能坪效与材质耐久度的完美平衡。',
    metrics: [
      { label: '空间溢价能力', value: '25%+', desc: '高颜值设计带来高ADR定价' },
      { label: '公共坪效利用率', value: '88%+', desc: '复合空间全时段高转化' },
      { label: '设计美学生命周期', value: '8-10年', desc: '耐看耐磨避免二次改造' },
      { label: '属地文化故事融入', value: '100%', desc: '量身定制独特空间辨识度' },
    ],
    features: [
      '属地非遗、茶道、山水或海丝人文元素定制化置入',
      '功能动线极致优化，客房、餐饮与社交动静分离',
      '兼顾网红打卡传播属性与易清洁、高耐久度用材',
    ],
    image: '/assets/rezen/adv-2.webp',
    badge: '一店一设计 · 历久弥新',
  },
  {
    id: 'advantage-03',
    number: '03',
    prefix: '降本增效',
    title: '降本增效 · 业主自主施工与物资直采节约30%',
    tagline: '允许业主自主装修与采买物资 · 节约前期投入30%+ · 缩短回报期18个月+',
    category: '降本增效',
    brief: '传统加盟常捆绑施工与高价物料，推高前期投入。丽呈智旅开放自主施工与物资采买，并提供标准图纸、节点质检和透明集采清单，让业主在保证品质的前提下自主比价、切实降本。',
    description: '行业首创开放透明的柔性工程共赢模式。丽呈不强制指定高价供应商，允许业主依托属地资源自行组织施工队与采买家具家电，集团仅提供施工标准图纸、技术交底及工程节点质检。同时丽呈中央集采平台面向业主全量开放底价清单，业主可自由比价、自主决策。',
    metrics: [
      { label: '前期装修投入节约', value: '30%+', desc: '打破强制指定与层层加价' },
      { label: '投资回报周期缩短', value: '18个月+', desc: '轻装上阵早日实现盈利' },
      { label: '集采清单自由比价', value: '100%', desc: '中央直供底价完全透明' },
      { label: '关键节点专业巡检', value: '全程护航', desc: '确保高品质达标合规' },
    ],
    features: [
      '集团输出标准化施工白皮书与工程把关验收SOP',
      '家具、洁具、布草及客房智能设备自主阳光选配',
      '专业工程顾问节点巡检，确保品质达标的前提下极致省钱',
    ],
    image: '/assets/rezen/adv-3.webp',
    badge: '装修采购 · 不垄断',
  },
  {
    id: 'advantage-04',
    number: '04',
    prefix: '核心科技',
    title: '核心科技 · 直连携程超算与AI智能收益管理',
    tagline: '携程工程师专属研发 · 行业唯一直连携程超级计算机 · 内置AI智能调价',
    category: '核心科技',
    brief: '传统门店依赖人工定价，旺季调价滞后，淡季容易低价换量。丽呈智旅直连携程超算，以AI实时监控竞对、客流与需求变化，动态优化价格和库存，让收益管理升级为数据决策。',
    description: '由携程顶级技术专家团队倾力研发，丽呈All-in-One一体化数字中台与携程超级计算机实现毫秒级底层数据直连。内置深度学习RMS智能收益管理引擎，实时监控周边竞对房态、未来90天航空航班客流、高铁预售及大型展会动态，AI每15分钟智能微调房费定价，将传统人工经验调价升级为超级算力智能决策。',
    metrics: [
      { label: '携程超算直连同步', value: '0.01秒', desc: '毫秒级房态库存与价格同频' },
      { label: 'AI收益智能提升', value: '15%-20%', desc: '全时段收益机会无死角捕获' },
      { label: '竞对与客流预测精度', value: '98.2%', desc: '基于携程全域出行大数据' },
      { label: '房态定价微调频次', value: '每15分钟', desc: '全自动智能实时盯盘' },
    ],
    features: [
      '直连携程超算中心，CRS/PMS/RMS三合一极简一体化中台',
      'AI动态微调全渠道最优价格，淡季保出租率、旺季打爆ADR',
      '极简界面上手即用，业主手机端专属经营驾驶舱实时穿透',
    ],
    image: '/assets/rezen/adv-4.webp',
    badge: '超算直连 · AI收益调价',
  },
  {
    id: 'advantage-05',
    number: '05',
    prefix: '超级背书',
    title: '超级背书 · 携程流量直通与线下专业运营',
    tagline: '携程商业流量倾斜直通 · 3500万+核心会员 · 线下实战GM运营铁军',
    category: '超级背书',
    brief: '缺乏流量与运营支持的门店，往往依赖高佣金渠道和降价获客。丽呈智旅结合携程流量、3500万+会员与线下运营团队，打通线上曝光、会员复购和线下转化，提升门店出租率与综合收益。',
    description: '作为携程旗下的核心高端酒店集团，加盟门店享有携程App黄金展位专属加权推荐、商旅企业客户专区采购优选及携程高星级会员特权互通。配合集团线下派驻的高星级酒店资深管理专家与收益作战单元，形成“线上超级流量轰炸 + 线下精益服务转化”的无缝闭环。',
    metrics: [
      { label: '丽呈生态高净值会员', value: '3500万+', desc: '携程黑钻/金卡高价值客源' },
      { label: '综合RevPAR竞品领先', value: '20%+', desc: '量价齐升溢价能力强劲' },
      { label: '大客户直采协议企业', value: '5000+', desc: '央国企与500强商旅直通' },
      { label: '私域复购客源占比', value: '超60%', desc: '降低高额渠道中介抽成' },
    ],
    features: [
      '携程旅行App搜索权重倾斜与专属品牌标签加持',
      '丽呈会与携程会员权益无缝打通，私域复购占比超60%',
      '线下运营总监驻点带教，严苛品质巡检保障服务口碑',
    ],
    image: '/assets/rezen/adv-5.webp',
    badge: '双牌背书 · 超级流量',
  },
  {
    id: 'advantage-06',
    number: '06',
    prefix: '急速爬坡',
    title: '急速爬坡 · 独创筹开保障1-2周爆满',
    tagline: '上线1-2周即达高出租率 · 传统酒店爬坡周期缩减50%+ · 快速进入盈利期',
    category: '急速爬坡',
    brief: '传统酒店开业常经历漫长的亏损爬坡期，持续消耗现金流。丽呈智旅通过开业前预售、大客户签约、携程品牌活动与本地生活传播提前蓄水，配合筹开团队驻场推进，帮助门店快速起量、尽早盈利。',
    description: '传统高星级酒店开业通常需要3-6个月的漫长“亏损爬坡期”。丽呈独创“预热预售+圈层引爆+携程超级品牌日”的敏捷开业冲刺体系，在开业前30天即启动全网预售与大客户协议签约，开业首周即可完成客流蓄水与口碑发酵，实现“开门红”，以最快速度让现金流转正。',
    metrics: [
      { label: '高出租率达成时间', value: '1-2周', desc: '上线即迎客流高峰' },
      { label: '爬坡培育期缩短', value: '50%+', desc: '大幅减少开业初期亏损' },
      { label: '预售首发锁定订单', value: '3000间夜+', desc: '开业前即实现资金回笼' },
      { label: '现金流由负转正', value: '首月实现', desc: '极速打破新店亏损期' },
    ],
    features: [
      '开业前30天全域预售方案定制与携程特惠专场首发',
      '集团飞行专家组入驻现场，全流程倒排工期与试运行磨合',
      '大众点评、小红书、抖音本地生活探店矩阵同步爆破造势',
    ],
    image: '/assets/rezen/adv-6.webp',
    badge: '敏捷冲刺 · 极速爬坡',
  },
  {
    id: 'advantage-07',
    number: '07',
    prefix: '现金自由',
    title: '现金自由 · 经营流水直入业主账户与后支付模式',
    tagline: '现金流100%直达业主专属账户 · 零账期拖延 · 零隐形收费 · 后支付管理费风险共担',
    category: '现金自由',
    brief: '部分品牌截留营业收入、结算账期长，还叠加隐形费用。丽呈智旅让客房、餐饮等经营流水直接进入业主账户，费用清单透明公开，并采用后支付管理费模式，与业主共担经营风险。',
    description: '丽呈严格实行“资金透明穿透原则”，门店的所有线上线下收银（包括微信、支付宝、银联及携程直连结算款项）均直接对接业主开设的银行对公或指定账户。品牌方不碰业主日常资金流，彻底消除传统酒店集团“先压款一个月再对账结算”的资金风险。同时坚决抵制传统品牌名目繁多的隐形加价套路，推行后支付管理费，门店实现盈利后再付管理费，与业主休戚与共。',
    metrics: [
      { label: '资金直达比例', value: '100%', desc: '全部营业收入直进业主账户' },
      { label: '品牌方资金沉淀', value: '0天', desc: '零挪用、零截留、零账期' },
      { label: 'GOP经营毛利率', value: '+10%', desc: '浩华认证高于行业平均水平' },
      { label: '管理费结算模式', value: '后支付', desc: '经营见实效后再结算更放心' },
    ],
    features: [
      '银企直联清算架构，全渠道收款直接沉淀业主专属账户',
      '彻底清除任何巧立名目杂费，所有费用清单100%阳光公开',
      '独创“后支付管理费”机制，与业主结成风险共担的命运共同体',
    ],
    image: '/assets/rezen/adv-7.webp',
    badge: '资金自由 · 后支付模式',
  },
  {
    id: 'advantage-08',
    number: '08',
    prefix: '人才无忧',
    title: '人才无忧 · 丽呈学院全维标准终身免费赋能',
    tagline: '终身免费培训体系 · 服务标准百项SOP · 彻底规避人员流动影响',
    category: '人才无忧',
    brief: '酒店人员流动频繁，容易造成服务断层和标准走样。丽呈智旅学院为员工提供终身免费的岗位课程、标准SOP与考核认证，通过系统培训和老带新带教，让新人快速上岗、服务标准持续稳定。',
    description: '人才是酒店品质的基石。丽呈学院汇聚高星级酒店数十位服务宗师与店长导师，构建涵盖前厅礼仪、客房清扫、客诉危机公关、工程维保及收益运营的数百门高清实战视频与互动课件。所有加盟店员工自签约起终身免费学习与考核认证，老带新系统化带教，打造带不走的专业团队。',
    metrics: [
      { label: '学院实战课件', value: '300+门', desc: '覆盖前厅/客房/工程各条线' },
      { label: '培训授权费用', value: '0元', desc: '全员终身免费开通权限' },
      { label: '新员工上岗周期', value: '仅3天', desc: '标准化SOP随学随练快速出师' },
      { label: '服务SOP执行率', value: '100%', desc: '全维度飞行巡检品质守护' },
    ],
    features: [
      '店长/部门主管/基层服务员全岗位技能晋升实训阶梯',
      '定期高星级标杆酒店沉浸式参访与驻店交叉挂职带教',
      '客户满意度NPS与差评秒级预警机制，针对性开展专项辅导',
    ],
    image: '/assets/rezen/adv-8.webp',
    badge: 'ROM培训 · 标准化赋能',
  },
  {
    id: 'advantage-09',
    number: '09',
    prefix: '复合溢价',
    title: '复合溢价 · “酒+定制轻餐饮”全新投资模型',
    tagline: '星巴克服务/哈根达斯/雀巢Nescafe/国际潮牌联名 · 双核驱动 · 回报再缩短6-12个月',
    category: '复合溢价',
    brief: '传统酒店收入依赖客房，大堂吧容易闲置，自开餐厅又面临厨师与管理压力。丽呈智旅引入星巴克咖啡服务、哈根达斯等定制轻餐饮，以低人力、标准化出品盘活空间，增加高毛利收入。',
    description: '打破传统酒店大堂吧“空置、摆设、亏损”的死局！丽呈首创将酒店大堂共享空间与定制轻餐饮深度融合，引入星巴克咖啡服务（Starbucks Coffee Service）、哈根达斯冰淇淋、雀巢萃取Nescafe以及国际潮流品牌联名的轻餐饮牌照。白天高品质商务咖啡下午茶、夜间微醺特调鸡尾酒，单品毛利高达65%-80%，客房与餐饮互导高净值客流，大幅拉升酒店坪效与总RevPAR。',
    metrics: [
      { label: '投资回报期再缩短', value: '6-12个月', desc: '双轮驱动收益远超纯客房' },
      { label: '轻餐饮单品毛利率', value: '65%-80%', desc: '高利润率快消爆款现金流' },
      { label: '大堂空间坪效跃升', value: '3.5倍', desc: '从沉没成本变为创收核心' },
      { label: '大厨用工人力开支', value: '0元', desc: '免除后厨，前台兼职极简运维' },
    ],
    features: [
      '官方直采星巴克咖啡服务、哈根达斯、雀巢等一线国际顶流品牌',
      '融入国际潮牌联名产品与潮流生活方式，深受Z世代与高端商旅青睐',
      '免去复杂厨房与高薪大厨，前台一人兼职出品，极简运维高收益',
    ],
    image: '/assets/rezen/adv-9.webp',
    badge: '首创模型 · 酒+轻餐饮',
  },
  {
    id: 'advantage-10',
    number: '10',
    prefix: '金融支持',
    title: '金融支持 · 专属信贷赋能与极速低息放款',
    tagline: '最快7天放款 · 资金成本低至5%以内 · 新店贷最高达2000万 · 垫资贷最高达70%',
    category: '金融支持',
    brief: '酒店筹建资金需求大，传统银行审批门槛高、周期长。丽呈智旅携手携程金融与主流银行提供专属信贷通道，为新店改造、工程施工和物资采购提供资金支持，缓解业主前期现金流压力。',
    description: '携程金融联合工农中建等国有大行及专业产业投资机构，为丽呈智旅加盟业主量身定制专属低息信贷绿色通道。无论是存量升级改造还是新开发项目，均可申请专属新店贷（最高2000万元），并享有工程施工与物资集采垫资贷（最高可达70%）。审批高效、材料精简，最快7天实现资金到账，大幅减轻业主前期现金流压力。',
    metrics: [
      { label: '新店信贷额度', value: '最高2000万', desc: '单店专属大额信贷支持' },
      { label: '工程垫资比例', value: '高达70%', desc: '大幅降低自有资金垫付' },
      { label: '资金综合成本', value: '< 5%', desc: '银行直连超低贴息成本' },
      { label: '极速放款周期', value: '最快7天', desc: '绿色审批通道极速到账' },
    ],
    features: [
      '携程金融与国有大行专属授信绿色通道，审批流程最快仅需7天放款',
      '资金综合年化成本低至5%以内，大幅压降项目前期财务杠杆支出',
      '新店装修贷最高2000万，物业装修改造与物资集采垫资比例最高达70%',
    ],
    image: '/assets/rezen/adv-10.webp',
    badge: '信贷垫资 · 最快7天放款',
  },
];

// ============================================================================
// 合作流程 6大步骤数据源
// ============================================================================

export interface ProcessStep {
  step: string;
  title: string;
  dept: string;
  desc: string[];
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: '合作咨询与意向沟通',
    dept: '开发拓展中心',
    desc: [
      '在线提交合作咨询或致电投资热线',
      '专属商务总监1对1沟通投资意向与物业概况',
      '提供初步合作加盟政策与品牌矩阵手册',
    ],
  },
  {
    step: '02',
    title: '现场勘测与大数据评估',
    dept: '投资评估与开发部',
    desc: [
      '专业团队实地考察物业建筑结构与消防条件',
      '携程商圈大数据测算竞对画像与收益模型',
      '出具详实项目投资可行性与预期回本周期报告',
    ],
  },
  {
    step: '03',
    title: '商务洽谈与合同签署',
    dept: '商务运营与法务部',
    desc: [
      '明确合作模式（特许经营/委托管理）与条款',
      '后支付管理费与阳光透明费用清单约定',
      '正式签署特许经营合作协议并建立专案档案',
    ],
  },
  {
    step: '04',
    title: '金融对接与工程指导',
    dept: '携程金融与工程技术中心',
    desc: [
      '携程金融绿色通道最快7天新店贷与垫资放款',
      '输出平面规划图、施工施工图与VI指导手册',
      '支持业主自主采购施工与关键节点巡检验收',
    ],
  },
  {
    step: '05',
    title: '运营筹备与全员培训',
    dept: '运营管理中心 & 丽呈学院',
    desc: [
      '全员免费开通丽呈学院实战培训与SOP认证',
      '直连携程超算PMS/CRS/RMS系统极速装配',
      '轻餐饮（星巴克/哈根达斯/国际潮牌）原料入场',
    ],
  },
  {
    step: '06',
    title: '盛大开业与超级爬坡',
    dept: '全域营销与收益增长部',
    desc: [
      '携程超级品牌日全域流量提前30天预售',
      '资深高星级总经理团队驻店护航开业试运转',
      '上线1-2周速达高出租率，迈入长期稳健盈利',
    ],
  },
];

// ============================================================================
// 顶层组件：CooperationFranchisePage
// 字体风格对齐规范：
// 1. 全面移除 font-serif，统一继承主站 var(--font-sans) 无衬线雅致字体
// 2. 标题层级、letter-spacing (tracking-[0.03em] / tracking-[0.04em])、
//    金色下划小胶囊条 (w-12 h-[3px] bg-[#EE9B27]) 与「关于我们」「品牌矩阵」100% 对齐
// ============================================================================

export const CooperationFranchisePage: React.FC<{
  onNavigateHome?: (targetAnchor?: string) => void;
}> = ({ onNavigateHome }) => {
  const [activeAdvantageId, setActiveAdvantageId] = useState<string>('advantage-01');
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  // 平滑滚动定位函数
  const scrollToAnchor = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      const yOffset = -76;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // 罗盘节点点击
  const handleCompassNodeClick = (id: string) => {
    setActiveAdvantageId(id);
    scrollToAnchor(id);
  };

  const handleNextStep = () => {
    if (carouselIndex < 2) {
      setCarouselIndex(carouselIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1);
    }
  };

  return (
    <div className="w-full bg-[#FFFFFF] text-[#222222]">
      {/* =====================================================================
          1. TOP HERO BANNER & BREADCRUMBS
          与「关于我们」和「品牌矩阵」字体大小与字距严格对齐：
          - 大标题：text-[32px] sm:text-[40px] md:text-[48px] font-bold tracking-[0.03em]
          - 副标文案：text-[14px] md:text-[16px] text-white/80 font-light tracking-wide
         ===================================================================== */}
      <section className="relative w-full h-[400px] md:h-[460px] bg-[#111622] overflow-hidden select-none">
        {/* Architectural Hotel Lobby Backdrop Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('/assets/rezen/hzjm.webp')`,
          }}
        />
        {/* Dark Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#111622]/95" />

        {/* Ambient Subtle Gold Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-[#C59B3F]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-[1560px] mx-auto h-full px-6 lg:px-[80px] flex flex-col justify-end pb-14 md:pb-16 text-white z-10">
          <div className="flex flex-col items-start">
            <h1 className="hero-enter text-[32px] sm:text-[40px] md:text-[48px] font-bold tracking-[0.03em] leading-tight text-white">
              合作优势
            </h1>
            <p className="hero-enter-sub mt-3 text-[14px] md:text-[16px] text-white/80 max-w-2xl font-light tracking-wide leading-relaxed">
              依托一体化超算系统与轻餐饮复合生态，赋能酒店资产稳健增值
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. SECTION 1: 十大合作优势总览 (ADVANTAGE COMPASS OVERVIEW)
          标题栏严格对齐「品牌矩阵」「公司介绍」版式：
          - h2: text-[32px] md:text-[38px] font-bold text-[#111111] tracking-[0.04em] leading-tight
          - 金色下划短线: w-12 h-[3px] bg-[#EE9B27] mx-auto mt-3.5 mb-2 rounded-full
          - 英文大写标签: text-[12px] md:text-[13px] tracking-[0.2em] text-[#888888] uppercase font-medium
         ===================================================================== */}
      <section id="section-compass" className="relative w-full pt-[80px] md:pt-[100px] pb-[96px] bg-[#F5F7FA] text-[#111111] overflow-hidden border-b border-[#E6EAF0]">
        {/* Subtle architectural dot grid on the light background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1111110a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="relative max-w-[1560px] mx-auto px-6 lg:px-[60px] z-10">
          {/* Section Header on Light Background */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-[32px] md:text-[38px] font-bold text-[#111111] tracking-[0.04em] leading-tight">
              丽呈智旅十大合作优势生态罗盘
            </h2>
            <div className="w-12 h-[3px] bg-[#EE9B27] mx-auto mt-3.5 mb-2 rounded-full" />
            <p className="mt-3 text-[14px] md:text-[16px] text-[#666666] leading-relaxed font-light">
              以携程超级算力与丽呈数字化经营中台为核心枢纽，外环辐射从精准定位、灵动设计、工程控本<br />
              到金融支持的十大赋能闭环。
            </p>
          </div>

          {/* 移动端：十大优势列表（罗盘在窄屏会重叠，改为卡片列表） */}
          <div className="lg:hidden max-w-[1260px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEN_COOPERATION_ADVANTAGES.map((adv) => (
              <button
                key={adv.id}
                type="button"
                onClick={() => handleCompassNodeClick(adv.id)}
                className="flex items-start gap-3 rounded-xl border border-[#E5E9F0] bg-white p-4 text-left transition-colors active:border-[#EE9B27]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EE9B27]/12 text-[12px] font-bold text-[#EE9B27]">
                  {adv.number}
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-bold text-[#111622]">{adv.prefix}</span>
                  <span className="mt-1 block text-[12.5px] leading-snug text-[#666666]">{adv.badge}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Dark Cosmic Compass Board (深色宇宙空间感卡片，仅桌面端展示) */}
          <div className="hidden lg:flex relative w-full max-w-[1260px] mx-auto aspect-[16/11] sm:aspect-[16/10] lg:aspect-[16/9] min-h-[600px] sm:min-h-[700px] bg-gradient-to-br from-[#0B0F19] via-[#0E1528] to-[#070A14] rounded-[32px] border border-white/10 shadow-[0_24px_60px_rgba(15,23,42,0.25)] p-4 sm:p-8 items-center justify-center overflow-hidden">
            
            {/* Cosmic Space Subtle Elements (克制的星空与星云层次，不杂不乱) */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#EE9B27]/10 rounded-full blur-[130px] pointer-events-none" />

            {/* Micro Star specks */}
            <div className="absolute inset-0 pointer-events-none select-none opacity-40">
              <span className="absolute top-[12%] left-[18%] w-1 h-1 rounded-full bg-white/70 shadow-[0_0_6px_#fff]" />
              <span className="absolute top-[28%] left-[78%] w-1.5 h-1.5 rounded-full bg-amber-200/80 shadow-[0_0_8px_#EE9B27]" />
              <span className="absolute top-[75%] left-[22%] w-1 h-1 rounded-full bg-blue-200/60" />
              <span className="absolute top-[82%] left-[68%] w-1.5 h-1.5 rounded-full bg-white/60 shadow-[0_0_6px_#fff]" />
              <span className="absolute top-[45%] left-[10%] w-0.5 h-0.5 rounded-full bg-white/80" />
              <span className="absolute top-[35%] left-[88%] w-0.5 h-0.5 rounded-full bg-amber-100/80" />
            </div>

            {/* Concentric Golden Orbital Rings (行星轨道环) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Outer Dashed Orbit */}
              <div className="w-[84%] aspect-square rounded-full border border-dashed border-[#EE9B27]/20 animate-[spin_180s_linear_infinite]" />
              {/* Middle Thin Ring */}
              <div className="absolute w-[66%] aspect-square rounded-full border border-white/10" />
              {/* Inner Glowing Ring */}
              <div className="absolute w-[46%] aspect-square rounded-full border border-[#EE9B27]/25 shadow-[0_0_30px_rgba(238,155,39,0.08)]" />
              {/* Celestial Crosshair Guides */}
              <div className="absolute w-[90%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="absolute h-[90%] w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            </div>

            {/* Central Planetary Core: 丽呈智旅中央平台 · 携程超算直连 */}
            <div className="absolute z-20 flex flex-col items-center justify-center text-center p-6 w-[210px] h-[210px] sm:w-[250px] sm:h-[250px] rounded-full bg-gradient-to-br from-[#1E2638] via-[#121929] to-[#0A0D18] border-2 border-[#EE9B27] shadow-[0_0_60px_rgba(238,155,39,0.45)] transition-all ring-4 ring-[#EE9B27]/15">
              <div className="w-12 h-12 rounded-full bg-[#EE9B27]/20 flex items-center justify-center text-[#EE9B27] mb-2 shadow-inner">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-[17px] sm:text-[20px] font-bold text-white tracking-[0.03em] leading-tight">
                丽呈智旅
              </h3>
              <p className="text-[13px] sm:text-[15px] text-[#EE9B27] font-semibold tracking-wider mt-1 uppercase">
                中央平台 · 科技赋能
              </p>
            </div>

            {/* 10 Radial Orbital Cards positioned around the central hub */}
            <div className="relative w-full h-full z-20 pointer-events-none">
              {TEN_COOPERATION_ADVANTAGES.map((adv, idx) => {
                // Calculate position on elliptical perimeter (01 to 10 clockwise, starting from top)
                const angle = (idx * (360 / 10) - 90) * (Math.PI / 180);
                const rx = 42; // percentage horizontal radius
                const ry = 38; // percentage vertical radius
                const left = 50 + rx * Math.cos(angle);
                const top = 50 + ry * Math.sin(angle);
                const isSelected = activeAdvantageId === adv.id;

                return (
                  <button
                    key={adv.id}
                    type="button"
                    onClick={() => handleCompassNodeClick(adv.id)}
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      animationDelay: `${idx * 80}ms`,
                    }}
                    className={`compass-enter absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group cursor-pointer text-left transition-all duration-300 ${
                      isSelected
                        ? 'scale-110 z-30'
                        : 'hover:scale-105 z-10 opacity-90 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`relative flex items-center gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl backdrop-blur-md transition-all shadow-lg ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#EE9B27]/35 via-[#1E2742] to-[#121829] border-2 border-[#EE9B27] shadow-[0_0_30px_rgba(238,155,39,0.55)]'
                          : 'bg-[#121829]/90 border border-white/15 hover:border-[#EE9B27]/70 hover:bg-[#182036]'
                      }`}
                    >
                      {/* Number circle */}
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-[12px] sm:text-[13px] shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#EE9B27] text-black font-extrabold shadow-sm'
                            : 'bg-white/10 text-[#EE9B27] group-hover:bg-[#EE9B27] group-hover:text-black'
                        }`}
                      >
                        {adv.number}
                      </div>

                      {/* Text info: 4-char prefix as main title + tagline below */}
                      <div className="max-w-[115px] sm:max-w-[150px] pr-1">
                        <div className="text-[13px] sm:text-[15px] font-bold text-[#EE9B27] leading-tight group-hover:text-white transition-colors tracking-[0.02em]">
                          {adv.prefix}
                        </div>
                        <div className="text-[12px] sm:text-[13px] text-white leading-snug mt-1 truncate">
                          {adv.badge}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom 5 Highlights Row on the Light Background */}
          <div className="mt-12 max-w-[1260px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E5E9F0] shadow-sm hover:shadow-md hover:border-[#EE9B27]/40 transition-all text-center">
              <div className="text-[20px] sm:text-[24px] font-bold text-[#EE9B27] tracking-tight">96.5%</div>
              <div className="text-[15px] text-[#444444] font-medium mt-1">携程大数据收益测算</div>
              <div className="text-[11px] text-[#888888] mt-0.5">3-5KM 商圈客群穿透</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#E5E9F0] shadow-sm hover:shadow-md hover:border-[#EE9B27]/40 transition-all text-center">
              <div className="text-[20px] sm:text-[24px] font-bold text-[#EE9B27] tracking-tight">节约 30%+</div>
              <div className="text-[15px] text-[#444444] font-medium mt-1">自主装修采购控本</div>
              <div className="text-[11px] text-[#888888] mt-0.5">回报期缩短 18 个月+</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#E5E9F0] shadow-sm hover:shadow-md hover:border-[#EE9B27]/40 transition-all text-center">
              <div className="text-[20px] sm:text-[24px] font-bold text-[#EE9B27] tracking-tight">15min/次</div>
              <div className="text-[15px] text-[#444444] font-medium mt-1">AI 智能调价直连超算</div>
              <div className="text-[11px] text-[#888888] mt-0.5">把握每次收益机会</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#E5E9F0] shadow-sm hover:shadow-md hover:border-[#EE9B27]/40 transition-all text-center">
              <div className="text-[20px] sm:text-[24px] font-bold text-[#EE9B27] tracking-tight">1-2 周</div>
              <div className="text-[15px] text-[#444444] font-medium mt-1">急速突破高出租率</div>
              <div className="text-[11px] text-[#888888] mt-0.5">爬坡周期缩减 50%+</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#E5E9F0] shadow-sm hover:shadow-md hover:border-[#EE9B27]/40 transition-all text-center">
              <div className="text-[20px] sm:text-[24px] font-bold text-[#EE9B27] tracking-tight">最高 2000万</div>
              <div className="text-[15px] text-[#444444] font-medium mt-1">携程金融专属新店贷</div>
              <div className="text-[11px] text-[#888888] mt-0.5">成本&lt;5% 最快 7 天放款</div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. SECTION 2: 十大优势深度逐条解读 (TEN ADVANTAGES DEEP-DIVE)
          左右图文错落流式排版（01-10号卡片，统一4字前缀打头）
          第10项为“金融支持”（收官压轴）
         ===================================================================== */}
      <section id="section-advantages-list" className="relative w-full pt-[90px] md:pt-[110px] pb-[100px] bg-[#FFFFFF] overflow-hidden">
        <div className="max-w-[1560px] mx-auto px-6 lg:px-[60px]">
          {/* Section Main Title matching About Us / Brand Matrix typography */}
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-[32px] md:text-[38px] font-bold text-[#111111] tracking-[0.04em] leading-tight">
              丽呈智旅十大合作优势详析
            </h2>
            <div className="w-12 h-[3px] bg-[#EE9B27] mx-auto mt-3.5 mb-2 rounded-full" />
            <p className="mt-3 text-[14px] md:text-[16px] text-[#666666] max-w-2xl mx-auto font-light leading-relaxed">
              从精准定位、灵动设计、工程控本到轻餐饮复合溢价与大额金融信贷支持，每一步皆以投资人<br />
              长期收益最大化为导向，彻底扫除传统酒店加盟痛点。
            </p>
          </div>

          {/* 10 Alternating Full Rows */}
          <div className="space-y-24">
            {TEN_COOPERATION_ADVANTAGES.map((adv, idx) => {
              const isEven = idx % 2 === 1; // Even index: text left, image right

              return (
                <Reveal key={adv.id}>
                <div
                  id={adv.id}
                  className="scroll-mt-28 bg-white rounded-3xl border border-[#EBEBEB] shadow-[0_10px_35px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_16px_50px_rgba(0,0,0,0.08)]"
                >
                  <div className={`grid grid-cols-1 lg:grid-cols-12 items-center`}>
                    {/* Media Column (Image & overlay metrics) */}
                    <div
                      className={`lg:col-span-5 relative h-[320px] sm:h-[400px] lg:h-full min-h-[420px] overflow-hidden ${
                        isEven ? 'lg:order-2' : 'lg:order-1'
                      }`}
                    >
                      <img
                        src={adv.image}
                        alt={adv.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      {/* Giant Number on Image (Clean modern sans-serif) */}
                      <div className="absolute top-6 left-6 text-[48px] sm:text-[60px] font-black text-white/30 leading-none select-none tracking-tight">
                        {adv.number}
                      </div>

                      {/* Floating Badge */}
                      <div className="absolute top-6 right-6">
                        <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#EE9B27] text-[12px] font-semibold tracking-wide">
                          {adv.badge}
                        </span>
                      </div>

                      {/* Bottom Image Overlay Metrics */}
                      <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-white">
                        <div className="text-[11px] text-white/70 tracking-wider uppercase mb-1">
                          核心赋能指标
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-[22px] sm:text-[26px] font-bold text-[#EE9B27] tracking-tight">
                            {adv.metrics[0].value}
                          </span>
                          <span className="text-[13px] text-white/90">
                            {adv.metrics[0].label}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/60 mt-0.5">
                          {adv.metrics[0].desc}
                        </p>
                      </div>
                    </div>

                    {/* Content Column */}
                    <div
                      className={`lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between ${
                        isEven ? 'lg:order-1' : 'lg:order-2'
                      }`}
                    >
                      <div>
                        {/* Category & Step Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="inline-flex items-center gap-2.5 rounded-lg bg-[#17191D] px-4 py-2.5 shadow-[0_4px_14px_rgba(17,24,39,0.14)]">
                            <span className="text-[15px] sm:text-[16px] font-bold tracking-[0.04em] text-[#F3B94E]">
                              {`优势${['一','二','三','四','五','六','七','八','九','十'][parseInt(adv.number)-1]}`}
                            </span>
                            <span className="h-3.5 w-px bg-white/25" />
                            <span className="text-[15px] sm:text-[16px] font-semibold tracking-[0.03em] text-white">
                              {adv.prefix}
                            </span>
                          </span>
                        </div>

                        {/* Title with 4-character highlight (Clean sans-serif) */}
                        <h3 className="text-[22px] sm:text-[26px] font-bold text-[#111111] tracking-[0.03em] leading-snug mb-4">
                          {adv.title.replace(adv.prefix + ' · ', '')}
                        </h3>

                        {/* Core Executive Summary */}
                        <p className="text-[15px] sm:text-[16px] text-[#333333] leading-relaxed mb-6 font-normal">
                          {adv.brief}
                        </p>

                        {/* Deliverables Bullet List */}
                        <div className="space-y-2.5 mb-8">
                          {adv.features.map((feature, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2.5 text-[13px] sm:text-[14px] text-[#444444]">
                              <CheckCircle2 className="w-4 h-4 text-[#EE9B27] shrink-0 mt-1" />
                              <span className="leading-relaxed">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Metric Cards Strip */}
                      <div className="pt-6 border-t border-[#EAEAEA] grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {adv.metrics.map((m, mIdx) => (
                          <div key={mIdx} className="p-3 rounded-xl bg-[#FAFAFA] border border-[#F0F0F0] text-center">
                            <div className="text-[17px] sm:text-[20px] font-bold text-[#111111] tracking-tight">
                              {m.value}
                            </div>
                            <div className="text-[11px] font-medium text-[#777777] mt-0.5">
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. SECTION 3: 六步严谨合作流程 (COOPERATION PROCESSES)
         ===================================================================== */}
      <section id="section-process" className="relative w-full pt-[90px] md:pt-[110px] pb-[100px] bg-[#F9FAFB] overflow-hidden border-t border-[#EEEEEE]">
        <div className="max-w-[1560px] mx-auto px-6 lg:px-[60px]">
          {/* Header matching standard style */}
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-[32px] md:text-[38px] font-bold text-[#111111] tracking-[0.04em] leading-tight">
              六步规范合作流程
            </h2>
            <div className="w-12 h-[3px] bg-[#EE9B27] mx-auto mt-3.5 mb-2 rounded-full" />
            <p className="mt-3 text-[14px] md:text-[16px] text-[#666666] max-w-2xl mx-auto font-light leading-relaxed">
              从意向勘验、图纸设计、自主采购、金融对接，到携程超算上线开业，标准化流程步步为营，<br />
              全程专人专班无缝支持。
            </p>
          </div>

          {/* Carousel Viewport with Navigation */}
          <div className="relative flex items-center">
            {/* Left Chevron */}
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={carouselIndex === 0}
              aria-label="Previous step"
              className={`hidden sm:flex absolute -left-2 sm:-left-6 lg:-left-10 z-20 w-11 h-11 rounded-full bg-white shadow-md border border-[#E5E5E5] items-center justify-center transition-all cursor-pointer ${
                carouselIndex === 0
                  ? 'text-[#CCCCCC] cursor-not-allowed opacity-40'
                  : 'text-[#444444] hover:text-[#EE9B27] hover:scale-110'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Slider Container：移动端改为原生横向滑动（箭头按整卡位移会错位） */}
            <div className="w-full overflow-x-auto no-scrollbar snap-x snap-mandatory sm:overflow-hidden py-4">
              <div
                className="flex gap-6 transition-transform duration-500 ease-in-out max-sm:[transform:none] sm:[transform:translateX(var(--step-shift))]"
                style={{ '--step-shift': `-${carouselIndex * (100 / 4 + 1.5)}%` } as React.CSSProperties}
              >
                {PROCESS_STEPS.map((item, idx) => (
                  <Reveal
                    key={item.step}
                    delay={idx * 80}
                    className="w-full max-sm:snap-center sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0"
                  >
                  <div
                    className="w-full h-full bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#EEEEEE] hover:border-[#EE9B27]/60 flex flex-col justify-start min-h-[280px] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition-all duration-300"
                  >
                    {/* Golden Step Number */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[34px] sm:text-[38px] font-bold text-[#EE9B27] leading-none tracking-tight">
                        {item.step}
                      </span>
                      <span className="text-[11px] font-medium text-[#777777] bg-[#FAFAFA] px-2.5 py-1 rounded-full border border-[#E5E5E5]">
                        STEP
                      </span>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-[19px] sm:text-[20px] font-bold text-[#111111] mb-2 tracking-[0.02em]">
                      {item.title}
                    </h3>

                    {/* Department badge */}
                    <div className="text-[12px] text-[#C97B06] font-semibold mb-5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EE9B27]" />
                      <span>{item.dept}</span>
                    </div>

                    {/* Subtle divider line */}
                    <div className="w-full h-[1px] bg-[#EAEAEA] mb-6" />

                    {/* Step Descriptions */}
                    <div className="space-y-3 text-[13px] text-[#666666] leading-relaxed">
                      {item.desc.map((line, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-[#EE9B27] font-bold text-[14px] leading-none mt-0.5">•</span>
                          <span className="line-clamp-1 min-w-0">{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Right Chevron */}
            <button
              type="button"
              onClick={handleNextStep}
              disabled={carouselIndex >= 2}
              aria-label="Next step"
              className={`hidden sm:flex absolute -right-2 sm:-right-6 lg:-right-10 z-20 w-11 h-11 rounded-full bg-white shadow-md border border-[#E5E5E5] items-center justify-center transition-all cursor-pointer ${
                carouselIndex >= 2
                  ? 'border-[#D9D9D9] text-[#CCCCCC] cursor-not-allowed opacity-40'
                  : 'text-[#444444] hover:text-[#EE9B27] hover:scale-110'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};