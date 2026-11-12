import React, { useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BigDataEmpowermentSection } from './BigDataEmpowermentSection';
import { Reveal } from './Reveal';
import { BRAND_CONTENT, POLICY_ITEMS, type BrandCollection, type BrandSpace } from '../data/brandDetail';

export interface BrandDetailPageProps {
  onBack: () => void;
  onNavigateHome: (targetAnchor?: string) => void;
  /** 进入页面时默认选中的品牌系列（j / international / hotel / resort） */
  initialSeriesId?: string;
  /** 所属品牌系列：季枫 / 丽呈花盛（决定整页内容数据） */
  collection?: BrandCollection;
}

/** 酒店布局卡片（大堂 / 休息区 / 会议室 / 大床房 / 双床房） */
const SpaceCard: React.FC<{ space: BrandSpace }> = ({ space }) => (
  <div className="flex flex-col group">
    <div className="relative aspect-[16/10] overflow-hidden rounded-lg mb-5 shadow-sm bg-gray-200">
      <img
        src={space.image}
        alt={space.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
    </div>
    <div className="flex items-baseline gap-2 mb-2">
      <span className="text-2xl font-serif text-[#C89748] font-bold">{space.no}</span>
      <h3 className="text-lg font-bold text-gray-900">{space.title}</h3>
    </div>
    <p className="text-sm text-gray-600 leading-relaxed">{space.desc}</p>
  </div>
);

export const BrandDetailPage: React.FC<BrandDetailPageProps> = ({ onBack, initialSeriesId, collection = 'jifeng' }) => {
  const content = BRAND_CONTENT[collection];
  const BRAND_SERIES = content.series;
  const defaultSeriesId = BRAND_SERIES[0].id;
  // 品牌系列切换：只影响物业条件及以下区块
  const [activeSeriesId, setActiveSeriesId] = useState(
    initialSeriesId && BRAND_SERIES.some((s) => s.id === initialSeriesId) ? initialSeriesId : defaultSeriesId,
  );
  const series = BRAND_SERIES.find((s) => s.id === activeSeriesId) ?? BRAND_SERIES[0];
  // 顶部品牌介绍跟随页面所属品牌（不随下方菜单切换）
  const pageSeries = BRAND_SERIES.find((s) => s.id === initialSeriesId) ?? BRAND_SERIES[0];
  const handleSeriesChange = (id: string) => {
    const next = BRAND_SERIES.find((s) => s.id === id);
    if (!next) return;
    setActiveSeriesId(id);
  };
  // 物料未齐的品牌不渲染宣传栏、物业条件和门店样例；配置自定义政策的品牌可单独展示政策
  const showBottomSections = Boolean(content.banner && content.propertyImage);
  const showPolicy = showBottomSections || Boolean(series.policyRows);
  const hasCustomPolicy = Boolean(series.policyRows);
  const policyRows: { label: string; value: string; note?: string }[] =
    series.policyRows ?? POLICY_ITEMS.map((label, idx) => ({ label, value: series.policy[idx] ?? '' }));

  // Video player states（与关于我们页同款播放器）
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const inlineVideoRef = useRef<HTMLVideoElement | null>(null);

  const handleStartPlay = () => {
    setIsVideoPlaying(true);
    setTimeout(() => {
      if (inlineVideoRef.current) {
        inlineVideoRef.current.muted = false;
        inlineVideoRef.current.volume = 1;
        inlineVideoRef.current.play().catch(() => {});
      }
    }, 100);
  };

  /** 播放前点击全屏：先启动播放，再走浏览器原生全屏，与播放后的全屏按钮行为一致 */
  const handlePlayFullscreen = () => {
    const videoEl = inlineVideoRef.current;
    if (!videoEl) return;
    setIsVideoPlaying(true);
    videoEl.muted = false;
    videoEl.volume = 1;
    videoEl.play().catch(() => {});

    // 等 React 把播放态渲染到 DOM（去掉透明遮罩）后再进入全屏
    requestAnimationFrame(() => {
      const anyVideo = videoEl as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
      if (anyVideo.requestFullscreen) {
        anyVideo.requestFullscreen().catch(() => {});
      } else if (anyVideo.webkitEnterFullscreen) {
        anyVideo.webkitEnterFullscreen();
      }
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-[#B81C22]/20 selection:text-[#B81C22]">
      {/* =====================================================================
          TOP HERO & BREADCRUMB
         ===================================================================== */}
      <section className="relative w-full h-[320px] md:h-[460px] overflow-hidden bg-[#111622] flex items-center justify-center pt-[64px] md:pt-[134px]">
        <img
          src={content.hero.image}
          alt={content.hero.alt}
          className="absolute inset-0 w-full h-full object-cover opacity-100 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/45" />

        {/* Top bar with back button */}
        <div className="absolute top-[72px] md:top-6 left-0 right-0 max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-start z-[60]">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/70 text-white/90 hover:text-white border border-white/20 text-sm font-medium transition-all backdrop-blur-md cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>返回品牌矩阵</span>
          </button>
        </div>

        {/* Center Brand Identity */}
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="hero-enter text-3xl md:text-5xl font-extrabold text-white tracking-wider mb-3">
            {content.collectionNameZh}
          </h1>
          <p className="hero-enter-sub text-white/80 text-[13px] sm:text-base md:text-xl tracking-[0.12em] md:tracking-[0.2em] uppercase font-light mt-3 sm:mt-2">
            {content.collectionNameEn}
          </p>
        </div>
      </section>

      {/* =====================================================================
          SECTION 1: 品牌定位与叙事 (1:1 参考 image_5c014890.png)
         ===================================================================== */}
      <section className="py-20 md:py-28 px-6 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          {/* Logo Mark */}
          {(() => {
            const logo = content.introLogo ? content.introLogo(pageSeries.id) : content.logo;
            return (
              <div className={`inline-flex flex-col items-center ${logo.marginClass ?? 'mb-8'}`}>
                <img
                  src={logo.image}
                  alt={logo.alt}
                  className={`${logo.sizeClass ?? 'h-20 md:h-24'} w-auto object-contain`}
                />
              </div>
            );
          })()}

          {/* Slogan（仅配置了标语时显示） */}
          {content.slogan.h1 + content.slogan.mid + content.slogan.h2 + content.slogan.tail ? (
            <h2 className="text-2xl md:text-4xl font-bold text-[#111622] tracking-wider mb-6">
              <span style={{ color: content.accentColor }}>{content.slogan.h1}</span>{content.slogan.mid}{' '}
              <span style={{ color: content.accentColor }}>{content.slogan.h2}</span>{content.slogan.tail}
            </h2>
          ) : null}

          {/* Divider：无论是否配置标语都保留（携程农庄等无标语品牌也显示分隔线） */}
          <div className="w-48 h-[1px] bg-[#111622]/30 relative mx-auto mb-10 mt-6 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rotate-45 bg-[#111622] block" />
          </div>

          {/* Narrative Text */}
          <div className="max-w-[740px] mx-auto space-y-4 text-gray-600 text-sm md:text-base leading-relaxed md:leading-loose">
            {content.narrativeLead ? (
              <p className="font-medium text-gray-800">
                {content.narrativeLead}
              </p>
            ) : null}
            <p className="text-justify">
              <span className="font-semibold text-[1.5em]" style={{ color: content.accentColor }}>{pageSeries.name}</span>
              {pageSeries.intro.slice(pageSeries.name.length)}
            </p>
          </div>

          {/* Brand Video（与关于我们页同款播放器；未配置宣传片的品牌不显示） */}
          {content.video ? (
          <div className="mt-12 md:mt-16">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#0A0D14] shadow-[0_20px_50px_rgba(0,0,0,0.14)] border border-[#232938] group">
              <video
                ref={inlineVideoRef}
                className={`w-full h-full object-contain bg-black transition-opacity duration-500 ${isVideoPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                controls={isVideoPlaying}
                playsInline
                preload="metadata"
                poster={content.video.poster}
              >
                <source src={content.video.src} type="video/mp4" />
                您的浏览器暂不支持此视频播放。
              </video>

              {!isVideoPlaying && (
                <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-10 md:p-12 select-none">
                  {/* Background Poster Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${content.video.poster}')` }}
                  />
                  {/* Dark Filmic Vignette & Lighting Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/35" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(197,155,63,0.18)_0%,_transparent_70%)]" />

                  {/* Top Row: Tag */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#C59B3F]/40 text-[#E5C16C] text-[12px] sm:text-[13px] font-medium tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-[#C59B3F] animate-pulse" />
                      {content.video.tag}
                    </div>
                  </div>

                  {/* Center: Glowing Luxury Play Button */}
                  <div className="relative z-10 my-auto text-center flex flex-col items-center justify-center">
                    <div className="animate-play-breath rounded-full">
                    <button
                      type="button"
                      onClick={handleStartPlay}
                      className="relative group/btn cursor-pointer focus:outline-none"
                      aria-label="播放宣传片"
                    >
                      {/* Outer Pulse Wave Rings */}
                      <div className="absolute -inset-3 rounded-full bg-[#C59B3F]/25 blur-sm group-hover/btn:scale-125 transition-transform duration-500 animate-pulse" />
                      <div className="absolute -inset-6 rounded-full border border-[#C59B3F]/35 scale-90 group-hover/btn:scale-110 transition-transform duration-500" />

                      {/* Golden Play Disc */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#A67C2E] via-[#C59B3F] to-[#E3C578] text-white flex items-center justify-center shadow-[0_10px_35px_rgba(197,155,63,0.45)] group-hover/btn:scale-105 group-hover/btn:shadow-[0_15px_45px_rgba(197,155,63,0.65)] active:scale-95 transition-all duration-300">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1.5 drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    </button>
                    </div>

                    <div className="mt-5 text-white/95 text-[18px] sm:text-[22px] md:text-[24px] font-semibold tracking-[0.08em] drop-shadow-md">
                      点击播放品牌宣传片
                    </div>
                  </div>

                  {/* Bottom Row: Video Meta & Quick Action */}
                  <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/80 border-t border-white/10 pt-4">
                    <div className="text-[13px] sm:text-[14px] text-white/85 text-center sm:text-left">
                      {content.video.desc}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handlePlayFullscreen}
                        className="px-4 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 text-white text-[12px] sm:text-[13px] font-medium flex items-center gap-1.5 backdrop-blur-sm transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4 text-[#E5C16C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                        全屏影院播放
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          ) : null}
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: 东方美学·盛世风华 (1:1 参考 image_6973448e.png)
         ===================================================================== */}
      <section className="py-16 md:py-24 px-6 bg-[#FAFAF8] border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-wide mb-2">
              {content.spacesTitle}
            </h2>
            <p className="text-xs md:text-sm text-gray-400 font-sans tracking-wider uppercase">
              {content.spacesTitleEn}
            </p>
          </div>

          {/* 5 Experience Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {content.spaces.slice(0, 3).map((space, idx) => (
              <Reveal key={space.no} delay={idx * 90}>
                <SpaceCard space={space} />
              </Reveal>
            ))}
          </div>

          {/* Row 2: 2 cards */}
          {content.spaces.length > 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:px-12">
              {content.spaces.slice(3).map((space, idx) => (
                <Reveal key={space.no} delay={idx * 90}>
                  <SpaceCard space={space} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          SECTION 2.4: 品牌视觉（品牌物料，按行等高排布，与酒店布局同底色）
         ===================================================================== */}
      {collection !== 'ctrip-farm' && collection !== 'new-world' && (
      <section className="py-16 md:py-24 px-6 bg-[#FAFAF8] border-y border-gray-100">
        <div className="max-w-6xl mx-auto md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-wide mb-2">
              {content.visualsTitle}
            </h2>
            <p className="text-xs md:text-sm text-gray-400 font-sans tracking-wider uppercase">
              {content.visualsTitleEn}
            </p>
          </div>

          <style>{`
            .brand-visual-item {
              width: 100%;
              overflow: hidden;
              border-radius: 10px;
              background: #ffffff;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            }
            .brand-visual-item img {
              width: 100%;
              height: auto;
              display: block;
              transition: transform 0.5s ease;
            }
            .brand-visual-item:hover img {
              transform: scale(1.02);
            }
            @media (min-width: 640px) {
              .brand-visual-row {
                display: flex;
                align-items: stretch;
              }
              .brand-visual-item {
                flex: var(--brand-r, 1) 1 0%;
                height: 200px;
              }
              .brand-visual-item img {
                height: 100%;
                object-fit: cover;
              }
            }
            @media (min-width: 1024px) {
              .brand-visual-item {
                height: 236px;
              }
            }
          `}</style>
          <div className="space-y-4 md:space-y-5">
            {content.visualRows.map((row, rowIndex) => (
              <div key={rowIndex} className="brand-visual-row gap-4 md:gap-5">
                {row.map((item, itemIdx) => (
                  <Reveal
                    key={item.n}
                    delay={rowIndex * 100 + itemIdx * 70}
                    className="brand-visual-item"
                    style={{ ['--brand-r' as string]: item.ratio }}
                  >
                    <img
                      src={item.src ?? `/assets/rezen/brand-${String(item.n).padStart(2, '0')}.webp`}
                      alt={`${content.collectionNameZh}品牌视觉物料 ${String(item.n).padStart(2, '0')}`}
                      loading="lazy"
                    />
                  </Reveal>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* =====================================================================
          SECTION 2.5: 全链路赋能流程图（复用「关于我们」区块，去掉背景图）
         ===================================================================== */}
      {collection !== 'ctrip-farm' && collection !== 'new-world' && <BigDataEmpowermentSection variant="light" />}

      {/* =====================================================================
          SECTION 3: 臻选旗舰大幅海报（配置了宣传栏的品牌才显示）
         ===================================================================== */}
      {content.banner && (
      <section className="relative w-full h-[280px] md:h-[400px] overflow-hidden bg-black">
        <img
          src={content.banner.image}
          alt={content.banner.alt}
          className={`absolute inset-0 w-full h-full object-cover ${content.banner.imageClass ?? 'opacity-85'}`}
        />
        <div
          className={`absolute inset-0 ${content.banner.overlayClass ?? 'bg-gradient-to-r from-black/75 via-black/40 to-black/80'}`}
        />

        <div className="relative z-10 h-full max-w-6xl mx-auto px-8 flex flex-col items-center justify-center text-white">
          <h2 className="text-4xl md:text-7xl font-extrabold tracking-[0.15em] text-center text-white">
            <span style={{ color: content.accentColor }}>{content.banner.slogan.h1}</span>{content.banner.slogan.mid}
            <span className="mx-2 md:mx-4" />
            <span style={{ color: content.accentColor }}>{content.banner.slogan.h2}</span>{content.banner.slogan.tail}
          </h2>
          <p className="mt-6 md:mt-8 text-sm md:text-2xl font-light tracking-[0.3em] uppercase text-white/85 text-center">
            {content.banner.en}
          </p>
        </div>
      </section>
      )}

      {/* =====================================================================
          SECTION 4: 系列切换菜单 + 门店样例（配置了物业配图的品牌才显示；物料未齐的品牌整体下线）
         ===================================================================== */}
      {showBottomSections && content.propertyImage && (
      <>
      <section className="pt-12 pb-20 md:pt-16 md:pb-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* 四大品牌系列切换：胶囊选中态，比单纯下划线更明显 */}
          <div className="flex flex-wrap justify-center gap-2.5 md:gap-4 mb-14 md:mb-20">
            {BRAND_SERIES.map((item) => {
              const active = item.id === activeSeriesId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSeriesChange(item.id)}
                  className={`px-5 md:px-8 py-2.5 md:py-3 rounded-2xl text-center cursor-pointer border transition-all duration-300 ${
                    active
                      ? 'border-transparent scale-[1.03]'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  style={
                    active
                      ? {
                          backgroundColor: content.accentColor,
                          color: '#ffffff',
                          boxShadow: `0 8px 24px ${content.accentColor}59`,
                        }
                      : undefined
                  }
                >
                  <span className="block text-sm md:text-base font-semibold tracking-wide">
                    {item.name}
                  </span>
                  <span
                    className={`block mt-0.5 text-[10px] md:text-xs tracking-wider ${
                      active ? 'text-white/80' : 'text-gray-400'
                    }`}
                  >
                    {item.series}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 门店样例（随品牌系列切换，置于物业条件上方） */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-wide">
              {series.name}门店样例
            </h2>
            <p className="text-xs md:text-sm text-gray-400 font-sans tracking-wider uppercase mt-2">
              Store showcase
            </p>
          </div>

          {series.samples.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {series.samples.map((sample, idx) => (
                <Reveal
                  key={`${sample}-${idx}`}
                  delay={idx * 70}
                  className="relative aspect-[16/10] overflow-hidden rounded-lg bg-gray-200 shadow-sm"
                >
                  <img
                    src={sample}
                    alt={`${series.name}门店样例 ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="aspect-[16/10] rounded-lg border border-dashed border-gray-300 bg-[#FAFAF8] flex items-center justify-center text-xs text-gray-400 tracking-wide"
                >
                  {series.name}门店效果图待补充
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          SECTION 4b: 物业条件（随品牌系列切换）
         ===================================================================== */}
      <section className="py-20 md:py-28 px-6 bg-[#FAFAF8] border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-wide mb-8">
              物业条件
            </h2>

            <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
              {series.requirements.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {series.property.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative aspect-[16/10] rounded-lg overflow-hidden shadow-lg bg-gray-100">
            <img
              src={content.propertyImage.image}
              alt={content.propertyImage.alt}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          </Reveal>
        </div>
      </section>
      </>
      )}

      {/* =====================================================================
          SECTION 4.5: 品牌合作政策（随品牌系列切换）
         ===================================================================== */}
      {showPolicy && (
      <section className={`${showBottomSections ? 'py-20 md:py-28' : 'pb-20 md:pb-28'} px-6 bg-white`}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-wide">
              {series.name}品牌合作政策
            </h2>
            <p className="text-xs md:text-sm text-gray-400 font-sans tracking-wider uppercase mt-2">
              Brand cooperation policy
            </p>
          </div>

          <Reveal className={`${hasCustomPolicy ? 'max-w-4xl' : 'max-w-2xl'} mx-auto overflow-hidden rounded-lg border border-gray-200 shadow-sm`}>
            <table className="w-full border-collapse text-xs md:text-sm">
              <thead>
                <tr className="text-white" style={{ backgroundColor: content.accentColor }}>
                  <th className={`${hasCustomPolicy ? 'w-[30%]' : 'w-1/2'} px-4 md:px-5 py-2.5 md:py-3 text-left font-semibold tracking-wide`}>
                    {hasCustomPolicy ? '品牌名称' : '合作项目'}
                  </th>
                  <th className={`${hasCustomPolicy ? 'w-[25%]' : 'w-1/2'} px-4 md:px-5 py-2.5 md:py-3 text-center font-semibold tracking-wide`}>
                    {hasCustomPolicy ? series.name : `${series.name}合作标准`}
                  </th>
                  {hasCustomPolicy && (
                    <th className="px-4 md:px-5 py-2.5 md:py-3 text-center font-semibold tracking-wide">
                      说明
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {policyRows.map((row, idx) => (
                  <tr key={row.label} className={idx % 2 === 1 ? 'bg-[#FAFAF8]' : 'bg-white'}>
                    <td className="px-4 md:px-5 py-2 md:py-2.5 text-gray-600 border-t border-gray-200">
                      {row.label}
                    </td>
                    <td className="px-4 md:px-5 py-2 md:py-2.5 text-center font-medium text-gray-900 border-t border-gray-200">
                      {row.value}
                    </td>
                    {hasCustomPolicy && (
                      <td className="px-4 md:px-5 py-2 md:py-2.5 text-center text-gray-600 border-t border-gray-200">
                        {row.note ?? ''}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>
      )}
    </div>
  );
};
