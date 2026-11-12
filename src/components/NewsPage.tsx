import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Calendar, ArrowRight, Search, ChevronLeft, ChevronRight, Newspaper, Building2, TrendingUp, Sparkles, Award } from 'lucide-react';
import { NewsItem, NEWS_ITEMS } from '../App';
import { fetchNewsCategories, fetchNewsList } from '../lib/api';
import { Reveal } from './Reveal';

export interface NewsPageProps {
  onNavigateHome: (targetAnchor?: string) => void;
  onSelectNews: (newsItem: NewsItem) => void;
}

export interface DetailedNewsArticle extends NewsItem {
  views: number;
  author?: string;
  tag?: string;
  /** 后端新闻 ID：存在时正文在打开详情弹窗时按需拉取 */
  detailId?: number;
  /** 后端富文本正文（HTML） */
  contentHtml?: string;
}

// Comprehensive simulated news dataset matching the reference layout & themes
export const EXTENDED_NEWS_LIST: DetailedNewsArticle[] = [
  {
    id: 'news-ref-1',
    title: '打通经营最后一公里 | 丽呈酒店，破解酒店盈利困局',
    date: '2026-07-08',
    category: '行业观察',
    tag: '行业观察',
    views: 233,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    summary: '当下酒店行业竞争日趋白热化，多数门店普遍陷入经营瓶颈：成本居高不下、客源流量稀缺、服务品质参差不齐。在行业内卷加剧的当下，很多酒店硬件投入不少，却始终难以突破盈利壁垒，而顾客体验、成本管控、长效运营的短板，正是制约酒店效益跃升的“最后一公里”...',
    content: [
      '当下酒店行业竞争日趋白热化，多数存量门店普遍陷入经营瓶颈：改造成本居高不下、客源流量单一依赖OTA、服务品质参差不齐。在行业内卷加剧的当下，很多单体酒店硬件投入不少，却始终难以突破盈利壁垒。',
      '顾客体验、成本管控与长效数智运营的短板，正是制约酒店综合投资回报率（ROI）跃升的“最后一公里”。',
      '丽呈集团依托自研一体化All in One中台与携程百亿级商业流量直通，为单体及区域连锁酒店注入精准收益算法与供应链集采能力，切实帮助投资人打通“提质、增效、降本”闭环。',
    ],
  },
  {
    id: 'news-ref-2',
    title: '黄金地段只赢一半…… 从商圈热力与精准定位看酒店长效溢价',
    date: '2026-07-07',
    category: '行业观察',
    tag: '行业观察',
    views: 123,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    summary: '任何酒店想要成功，核心永远是位置、位置，还是位置。这套行业准则时至今日依旧适用。（现代酒店业鼻祖、世界饭店标准化之父 埃尔斯沃思·斯塔特勒）然而在当下多元消费时代，仅仅抢占好地段还远远不够...',
    content: [
      '“任何酒店想要成功，核心永远是位置、位置，还是位置。”这套行业经典准则时至今日依旧深刻启发着酒店投资者。',
      '然而，在客群结构年轻化与新商旅需求井喷的今天，“黄金地段只赢了一半”。若没有精准的客群画像定位、差异化空间体验与强有力的直销会员体系支撑，绝佳口岸同样可能面临高租金低坪效的窘境。',
      '丽呈智旅大数据热力模型在项目签约初期即介入物业周边3-5公里多维度客群消费测算，为不同物业量身匹配最契合的高溢价品牌线，确保物业地段优势转化为持续稳健的经营GOP。',
    ],
  },
  {
    id: 'news-ref-3',
    title: '三十二载国资地标焕新，丽呈赋能北疆商旅高质量发展',
    date: '2026-07-04',
    category: '集团动态',
    tag: '集团动态',
    views: 55,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    summary: '地标酒店乌鲁木齐红山核心店7月启幕，打造“十五五”文旅融合新标杆。依托丽呈全服务数字化管理赋能，老牌国资物业迎来全新生机与活力...',
    content: [
      '坐落于丝绸之路核心枢纽的乌鲁木齐红山核心地标酒店历经全面升级改造，于7月盛大开业启幕。',
      '此次换装是丽呈集团深入西北区域布局、赋能国资存量资产盘活的标杆之作。通过导入丽呈华廷/丽呈标准服务体系与云端PMS协同系统，物业大幅缩短了筹建周期。',
      '开业首周，酒店即迎来多批次全国政商务研讨团与入境高端旅行团，综合客房入住率突破92%，成为北疆商旅走廊上一颗璀璨明珠。',
    ],
  },
  {
    id: 'news-4',
    title: '食溯本源，一宴知秋 ——“四季淮扬”第三篇章落地丽呈华廷，四城万象寻味金秋',
    date: '2026-10-18',
    category: '品牌美馔',
    tag: '品牌美馔',
    views: 312,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    summary: '丽呈华廷酒店携手非遗淮扬菜名厨大师，在全国核心城市联袂呈现秋季专属主厨品鉴宴，以至臻风味弘扬东方宴饮美学，重塑当代顶奢商务宴请标杆。',
    content: [
      '秋风送爽，蟹肥菊黄。丽呈酒店集团旗下奢华品牌“丽呈华廷酒店”于上海、成都、合肥及南京四地联合启幕2026“四季淮扬·秋韵”大师巡礼美馔周。',
      '本次巡礼特别邀请非遗淮扬菜烹饪技艺代表性传承团队亲临现场，以“食溯本源、顺时而食”为灵感，精心打磨“蟹粉狮子头”、“文思软兜”、“金陵桂花鸭”等八道时令代表佳肴。',
      '丽呈华廷秉持“尊崇如一，风雅致远”的待客之道，将中华传统餐饮艺术与现代高规格商宴标准融合，不仅为住店宾客提供私享赏味空间，更树立了高端奢华商务会议与宴饮服务的新标杆。',
    ],
  },
  {
    id: 'news-5',
    title: '超长假期带动长线深度游 丽呈旗下酒店国庆黄金周市场表现亮眼',
    date: '2026-10-09',
    category: '集团动态',
    tag: '经营快报',
    views: 489,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    summary: '2026国庆黄金周期间，丽呈旗下全国度假酒店与城市核心中高端酒店整体综合入住率与RevPAR创历史同期新高，数字化动态收益引擎显现强劲威力。',
    content: [
      '在为期多日的长假出行热潮中，文旅融合与深度慢调休闲度假成为主流出行形态。丽呈集团全国各省市在营门店整体经营表现亮眼，呈现全线爆发态势。',
      '数据显示，位于长三角、大湾区、滇西北及川西度假线圈的“丽呈别院”系列度假酒店连日满房，平均综合RevPAR同比提升逾29%；城市核心商圈的“丽呈酒店”与“丽呈睿轩”商旅兼顾型酒店亦在假期后半段迎来反向探亲客流高峰。',
      '得益于集团“丽呈ONE”数字化收益管理系统的实时全渠道动态调价模型，旗下数百家加盟门店在保障客户优质入住体验的同时，实现了综合收益的最大化释放。',
    ],
  },
  {
    id: 'news-6',
    title: '丽呈酒店及度假村亮相2026环球旅讯峰会，共探中国数智酒店新未来',
    date: '2026-09-25',
    category: '行业观察',
    tag: '行业峰会',
    views: 376,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    summary: '丽呈集团高层受邀出席2026环球旅讯峰会主论坛，并就“生成式AI与数智中台驱动下的酒店资产全周期增效”发表重磅主题演讲。',
    content: [
      '作为亚太地区最具影响力的文旅科技盛会，2026环球旅讯峰会在上海国际会议中心隆重举行。丽呈集团作为中国数字化酒店运营的领军代表应邀出席。',
      '在以《新一代酒店全链数字化重构》为主旨的圆桌对话中，丽呈智旅高管向与会行业专家及近千位投资人系统分享了丽呈在“住前-住中-住后-会员”全生命周期中构建的数字化技术护城河。',
      '通过标准化开放API对接供应链集采平台以及携程亿级高价值会员生态，丽呈正持续降低传统单体酒店连锁化改造门槛，为投资人带来稳健可靠的资本回报周期。',
    ],
  },
  {
    id: 'news-7',
    title: '第50家落子合肥！丽呈别院迎来全国高端度假品牌战略发展重要里程碑',
    date: '2026-09-15',
    category: '签约开业',
    tag: '战略签约',
    views: 412,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    summary: '丽呈别院第50家签约度假项目正式落子合肥天鹅湖畔，以东方山水隐逸美学与现代智慧客控重新定义都会慢调高端度假生活。',
    content: [
      '近日，丽呈别院（合肥天鹅湖旗舰店）签约仪式在安徽合肥圆满举行。此项目的落地，标志着丽呈别院在全国重点人文景区与核心都会绿洲的开业签约总量正式突破50家大关。',
      '酒店以“宋风水榭、枕水而眠”为空间规划主轴，设有百余间全景湖景套房、私人汤池院落、雅致茶舍及全日制东方美学私房菜馆。',
      '该酒店全案配备丽呈智旅新一代毫米波雷达免插卡无感取电、智能语音魔镜及自适应恒温恒湿新风系统，为商界菁英与度假家庭呈现科技与诗意交融的东方谧境。',
    ],
  },
  {
    id: 'news-8',
    title: '丽呈ONE智慧酒店系统升级3.0：全面接入大模型生态，赋能加盟业主精准降本增效',
    date: '2026-08-28',
    category: '数智科技',
    tag: '数智科技',
    views: 521,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    summary: '全新升级的丽呈ONE系统集成智能动态定价算法与自动化能耗管理，助力单店前台及客房人工运营成本进一步压缩18%，人房比优化至0.20。',
    content: [
      '丽呈技术研发中心正式发布丽呈ONE系统3.0版本。新版本深度集成了AI房态推演引擎、自动排班算法及房务智慧调度系统。',
      '通过与携程集团大数据底座的无缝对接，系统可提前14天预测商圈热度波动，精准给出最优分时定价建议，帮助前台和运营经理摆脱繁重的数据录入工作。',
      '试点酒店数据显示，接入系统首季度内客房综合打扫周转效率提升35%，客户离店综合好评率上升至4.92分，全面实现了科技赋能人效跃升。',
    ],
  },
  {
    id: 'news-9',
    title: '丽呈睿轩酒店荣获2026亚太空间设计金奖，以“灵动商务”重塑商旅居停新风尚',
    date: '2026-08-16',
    category: '行业观察',
    tag: '设计殊荣',
    views: 288,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    summary: '凭借兼具高效办公与惬意社交的“第三空间”理念，丽呈睿轩旗舰酒店斩获亚太权威空间设计年度金奖，引领新一代年轻商旅空间革命。',
    content: [
      '在刚刚落幕的2026亚太室内空间设计大奖典礼上，丽呈旗下高端中端商旅品牌“丽呈睿轩”凭借创新的“灵动复合大堂”概念脱颖而出，摘得年度最佳酒店空间设计金奖。',
      '评审委员会一致认为，丽呈睿轩打破了传统商务酒店大堂冰冷空旷的功能布局，将日咖夜酒、共享协同办公舱与艺术展陈巧妙糅合。',
      '设计在注重时尚现代视觉体验的同时，大量采用高耐久环保再生复合材料，完美诠释了当代年轻一代商旅人士对高效生活与精致审美的双重追求。',
    ],
  },
  {
    id: 'news-10',
    title: '践行绿色低碳ESG理念，丽呈集团正式启动全国酒店“零碳智居”可持续行动',
    date: '2026-07-29',
    category: '集团动态',
    tag: '社会责任',
    views: 195,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    summary: '联合权威碳核算机构，丽呈全面推行客房无塑化倡议与智能微电网系统，打造绿色环保文旅新典范，助力门店实现节能减碳与效益双赢。',
    content: [
      '为响应国家双碳战略目标，丽呈集团在深圳举行“绿色文旅·低碳未来”发布会，正式发布集团首部《酒店绿色运营与低碳建造白皮书》。',
      '行动计划涵盖旗下全部运营中及新筹建门店，推进100%可降解洗漱耗材替换、中央空调智能AI错峰节能与分布式光伏清洁能源试点。',
      '丽呈集团承诺至2028年底实现旗下加盟酒店碳排放强度综合下降30%，为每一位选择丽呈的旅人提供安心、健康且环境友好的绿色居所。',
    ],
  },
  {
    id: 'news-11',
    title: '丽呈公寓提速布局核心城市群，深莞两地核心商务枢纽项目相继签约入驻',
    date: '2026-07-19',
    category: '签约开业',
    tag: '签约开业',
    views: 340,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    summary: '面向现代都会精英长短租多元需求，丽呈公寓在粤港澳大湾区进一步织密网络，带来高品质服务式公寓新选择与高坪效商业回报。',
    content: [
      '丽呈集团旗下服务式公寓品牌“丽呈公寓”于本周在深圳南山科技园与东莞松山湖高新区同步完成两座新项目的正式签约。',
      '两家全新公寓总计规划逾600间高星级客房与行政套房，配备24小时专属管家服务、共享健身房、自助洗衣房及全景商务空中酒廊。',
      '丽呈公寓凭借灵活的“租住融通”收益模式与成熟的物业管理体系，正加速赢得一二线核心城市优质存量物业业主和投资机构的青睐。',
    ],
  },
  {
    id: 'news-12',
    title: '丽呈会生态会员突破3500万，直连携程全球高价值客源构筑强劲直销引擎',
    date: '2026-07-12',
    category: '集团动态',
    tag: '数智科技',
    views: 618,
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
    summary: '双向打通携程黑钻与金卡高净值商旅客源池，丽呈旗下加盟门店直销占比攀升至65%以上，全面摆脱单一高昂佣金依赖。',
    content: [
      '截至2026年第二季度，丽呈集团官方自有会员体系“丽呈会”注册活跃会员总数正式突破3500万人，创下历史全新里程碑。',
      '通过与携程集团全球会员权益网络的深层次直通互认，丽呈会员在享受客房免费升舱、延迟退房及专属积分商城特权的同时，为单店输送源源不断的高复购客户。',
      '权威第三方数据统计显示，得益于强大的私域会员池沉淀，丽呈系成熟酒店平均直销订单比例已稳居65%以上，极大地压缩了渠道销售费用，助力加盟业主留存丰厚净利润。',
    ],
  },
];

export const CATEGORY_TABS = [
  '全部',
  '行业观察',
  '集团动态',
  '签约开业',
  '数智科技',
  '品牌美馔',
];

const ITEMS_PER_PAGE = 5;

// 从 URL ?page= 恢复页码：进入新闻详情再返回时，列表停留在原页
const initialPageFromUrl = (): number => {
  const p = Number(new URLSearchParams(window.location.search).get('page'));
  return Number.isInteger(p) && p > 0 ? p : 1;
};

export const NewsPage: React.FC<NewsPageProps> = ({ onSelectNews }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(initialPageFromUrl);
  // 数据源：优先后端 API（运营后台实时维护），失败时静默降级为内置静态数据
  const [newsSource, setNewsSource] = useState<DetailedNewsArticle[]>(EXTENDED_NEWS_LIST);
  // 分类 Tab：优先后台「分类管理」维护词表，失败时降级为内置分类
  const [categoryTabs, setCategoryTabs] = useState<string[]>(CATEGORY_TABS);

  useEffect(() => {
    fetchNewsCategories().then((list) => {
      if (!list || list.length === 0) return;
      setCategoryTabs(['全部', ...list.map((c) => c.name)]);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchNewsList(1, 50).then((data) => {
      if (cancelled || !data) return;
      const mapped: DetailedNewsArticle[] = data.list.map((n) => ({
        id: `api-${n.id}`,
        detailId: n.id,
        title: n.title,
        date: n.publishedAt,
        category: n.category,
        author: n.author ?? undefined,
        views: n.views,
        image: n.cover,
        summary: n.summary,
        content: [],
      }));
      setNewsSource(mapped);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // 翻页/筛选后，滚到顶部，看到 Banner + 筛选栏 + 第一篇文章
  const scrollTop = useCallback(() => {
    // 多级延迟保障，确保 React state → DOM 提交 → 浏览器布局全部完成
    [30, 120, 250].forEach((d) => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, d);
    });
  }, []);

  // 页码同步到 URL（replaceState 不产生多余历史记录），返回详情页时可恢复到原页
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (currentPage > 1) {
      params.set('page', String(currentPage));
    } else {
      params.delete('page');
    }
    const qs = params.toString();
    window.history.replaceState({}, '', window.location.pathname + (qs ? `?${qs}` : ''));
  }, [currentPage]);

  // Filtered news items based on category and search query（按发布日期倒序，避免旧闻排在前面）
  const filteredNews = useMemo(() => {
    return newsSource.filter((item) => {
      const matchCategory = selectedCategory === '全部' || item.category === selectedCategory;
      const matchKeyword = !searchKeyword.trim() ||
        item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchCategory && matchKeyword;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [newsSource, selectedCategory, searchKeyword]);

  // Total pages
  const totalPages = Math.max(1, Math.ceil(filteredNews.length / ITEMS_PER_PAGE));

  // Current page items
  const currentNewsList = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredNews, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    scrollTop();
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    scrollTop();
  };

  // Generate pagination buttons matching reference image (1 2 3 4 5 ... 16 17)
  const renderPaginationButtons = () => {
    // If totalPages is small, show all
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <button
          key={pageNum}
          type="button"
          onClick={() => handlePageChange(pageNum)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-medium transition-all duration-200 cursor-pointer ${
            currentPage === pageNum
              ? 'bg-[#F5A623] text-white shadow-md font-semibold scale-105'
              : 'bg-[#f1f3f5] text-[#444444] hover:bg-[#e4e7eb] hover:text-[#111111]'
          }`}
          aria-label={`跳转到第 ${pageNum} 页`}
        >
          {pageNum}
        </button>
      ));
    }

    // Larger page count with ellipsis
    const buttons = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          buttons.push(i);
        }
        buttons.push('ellipsis-end');
        buttons.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        buttons.push(1);
        buttons.push('ellipsis-start');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          buttons.push(i);
        }
      } else {
        buttons.push(1);
        buttons.push('ellipsis-start');
        buttons.push(currentPage - 1);
        buttons.push(currentPage);
        buttons.push(currentPage + 1);
        buttons.push('ellipsis-end');
        buttons.push(totalPages);
      }
    }

    return buttons.map((btn, idx) => {
      if (btn === 'ellipsis-start' || btn === 'ellipsis-end') {
        return (
          <span key={`ell-${idx}`} className="w-8 h-10 flex items-center justify-center text-[#999999] select-none text-[15px]">
            ...
          </span>
        );
      }
      const pageNum = btn as number;
      return (
        <button
          key={pageNum}
          type="button"
          onClick={() => handlePageChange(pageNum)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-medium transition-all duration-200 cursor-pointer ${
            currentPage === pageNum
              ? 'bg-[#F5A623] text-white shadow-md font-semibold scale-105'
              : 'bg-[#f1f3f5] text-[#444444] hover:bg-[#e4e7eb] hover:text-[#111111]'
          }`}
          aria-label={`跳转到第 ${pageNum} 页`}
        >
          {pageNum}
        </button>
      );
    });
  };

  return (
    <div className="w-full bg-[#f8f9fa] text-[#222222] font-sans antialiased min-h-screen">
      {/* =====================================================================
          1. TOP HERO BANNER & BREADCRUMBS
          Consistent with About Us, Brand Matrix, and Cooperation Franchise pages
         ===================================================================== */}
      <section className="relative w-full h-[400px] md:h-[460px] bg-[#111622] overflow-hidden select-none">
        {/* Luxury Architectural Hotel Backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('/assets/rezen/xwdt.webp')`,
          }}
        />
        {/* Dark Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#111622]/95" />

        {/* Ambient Subtle Gold Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-[#C59B3F]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-[1560px] mx-auto h-full px-6 lg:px-[80px] flex flex-col justify-end pb-14 md:pb-16 text-white z-10">
          <div className="flex flex-col items-start">
            <h1 className="hero-enter text-[32px] sm:text-[40px] md:text-[48px] font-bold tracking-[0.03em] leading-tight text-white">
              新闻动态
            </h1>
            <p className="hero-enter-sub mt-3 text-[14px] md:text-[16px] text-white/80 max-w-2xl font-light tracking-wide leading-relaxed">
              聚焦行业洞察 · 传递丽呈智旅最新动态与经营成果
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. CATEGORY FILTER TABS & SEARCH BAR
         ===================================================================== */}
      <nav id="news-content-section" className="sticky top-[64px] md:top-0 z-30 w-full bg-white border-b border-[#E5E7EB] shadow-sm select-none">
        <div className="max-w-[1400px] mx-auto px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Horizontal Category Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {categoryTabs.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all duration-200 shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#111622] text-[#F5A623] shadow-sm font-semibold'
                    : 'bg-transparent text-[#555555] hover:bg-gray-100 hover:text-[#111111]'
                }`}
              >
                {cat}
                {cat === '全部' && ` (${newsSource.length})`}
              </button>
            ))}
          </div>

          {/* Quick Keyword Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <input
              type="text"
              placeholder="搜索新闻标题或关键词..."
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-[#F3F4F6] text-[13.5px] rounded-full border border-transparent focus:border-[#F5A623] focus:bg-white focus:outline-none transition-all placeholder:text-gray-400"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </nav>

      {/* =====================================================================
          3. NEWS LIST CONTENT SECTION
          1:1 Layout replica of User Attachment (image_51da1958.png)
          - Horizontal Card with 16:10 aspect ratio cover image on the left
          - Category Badge over image
          - Meta Date & Views
          - Bold Title + Multi-line Excerpt
          - "阅读全文 ->" link
         ===================================================================== */}
      <main className="max-w-[1360px] mx-auto px-6 py-12 md:py-16">
        {currentNewsList.length === 0 ? (
          <div className="w-full py-24 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-[18px] font-bold text-gray-600 mb-1">未找到相关新闻内容</h3>
            <p className="text-[14px] text-gray-400">请尝试更换搜索关键词或选择其他新闻分类</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('全部');
                setSearchKeyword('');
              }}
              className="mt-5 px-5 py-2 bg-[#F5A623] text-white text-[13px] font-medium rounded-full hover:bg-[#d9880f] transition-colors cursor-pointer"
            >
              查看全部动态
            </button>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-7">
            {currentNewsList.map((item, idx) => (
              <Reveal key={item.id} delay={Math.min(idx, 5) * 70}>
              <article
                onClick={() => onSelectNews(item)}
                className="w-full bg-white rounded-2xl p-5 md:p-6 shadow-[0_3px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] border border-[#EEEEEE] hover:border-[#F5A623]/30 transition-all duration-300 flex flex-col md:flex-row gap-5 md:gap-7 items-stretch cursor-pointer group select-none"
              >
                {/* Left Side: Cover Image with EXACT aspect ratio 16:10 as homepage bottom */}
                <div className="w-full md:w-[320px] lg:w-[360px] xl:w-[390px] aspect-[16/10] shrink-0 rounded-xl overflow-hidden relative bg-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />

                  {/* Top-Left Category Badge matching reference image */}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-black/75 backdrop-blur-md text-white text-[12px] font-medium rounded-md tracking-wider shadow-sm">
                    {item.category}
                  </div>
                </div>

                {/* Right Side: Meta Date, Title, Description, and Read Full Article */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  {/* Top Meta info row: Calendar date */}
                  <div className="flex items-center gap-5 text-[13px] text-[#718096] mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#A0AEC0]" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* Headline Title */}
                  <h2 className="text-[19px] sm:text-[21px] lg:text-[22px] font-bold text-[#1e293b] group-hover:text-[#F5A623] transition-colors leading-[1.4] mb-3 line-clamp-2">
                    {item.title}
                  </h2>

                  {/* Excerpt Summary */}
                  <p className="text-[14px] sm:text-[15px] text-[#64748b] leading-[1.7] line-clamp-3 md:line-clamp-2 font-normal">
                    {item.summary}
                  </p>

                  {/* "阅读全文 ->" link */}
                  <div className="mt-4 flex items-center">
                    <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#1e293b] group-hover:text-[#F5A623] group-hover:translate-x-1 transition-all duration-200">
                      阅读全文
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </article>
              </Reveal>
            ))}
          </div>
        )}

        {/* =====================================================================
            4. BOTTOM CIRCULAR PAGINATION
            1:1 Replica of User Attachment (image_a1c408bf.png)
            "< 1 2 3 4 5 ... 16 17 >"
           ===================================================================== */}
        {filteredNews.length > 0 && (
          <div className="mt-14 md:mt-18 pt-6 flex items-center justify-center gap-2 select-none">
            {/* Previous Button "<" */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] transition-colors ${
                currentPage === 1
                  ? 'bg-[#f1f3f5] text-[#b0b8c1] cursor-not-allowed opacity-60'
                  : 'bg-[#f1f3f5] text-[#444444] hover:bg-[#e4e7eb] hover:text-[#111111] cursor-pointer'
              }`}
              aria-label="上一页"
            >
              &lt;
            </button>

            {/* Numeric Page Buttons */}
            {renderPaginationButtons()}

            {/* Next Button ">" */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] transition-colors ${
                currentPage === totalPages
                  ? 'bg-[#f1f3f5] text-[#b0b8c1] cursor-not-allowed opacity-60'
                  : 'bg-[#f1f3f5] text-[#444444] hover:bg-[#e4e7eb] hover:text-[#111111] cursor-pointer'
              }`}
              aria-label="下一页"
            >
              &gt;
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
