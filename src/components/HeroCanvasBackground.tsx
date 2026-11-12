import React from 'react';

export interface HeroSlide {
  title: string;
  subtitle: string;
  image: string;
  link?: string | null;
}

interface HeroCarouselProps {
  activeSlide: number;
  onSelectSlide?: (index: number) => void;
  /** 后台下发的轮播数据；为空或未加载完成时使用内置默认两屏，保证首屏永远有内容 */
  slides?: HeroSlide[] | null;
}

/** 内置默认轮播（与后台 seed 数据一致，作为接口失败时的兜底） */
const DEFAULT_SLIDES: HeroSlide[] = [
  {
    title: '连接无界，体验非凡',
    subtitle: 'Alliance Bound,Experience Unbound',
    image: '/assets/rezen/shoupin1.webp',
  },
  {
    title: '丽呈智旅',
    subtitle: '酒店数字化经营解决方案服务商',
    image: '/assets/rezen/shoupin2.webp',
  },
];

/** 英文副标题用 Plus Jakarta Sans，中文用苹方（保持原有两屏字体观感） */
const isLatin = (s: string) => /^[\x00-\x7F]+$/.test(s);

/**
 * Full-viewport Hero Carousel with high-end luxury hotel architectural photography
 * and smooth horizontal slide transitions. 轮播内容支持后台动态下发。
 */
export const HeroCanvasBackground: React.FC<HeroCarouselProps> = ({ activeSlide, onSelectSlide, slides }) => {
  const list = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const slideCount = list.length;
  const goTo = (index: number) => {
    if (onSelectSlide) onSelectSlide((index + slideCount) % slideCount);
  };

  // 移动端无箭头，支持左右滑动切换
  const touchStartX = React.useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 40 && slideCount > 1) goTo(activeSlide + (delta < 0 ? 1 : -1));
  };

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden bg-[#121C2B]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Horizontal sliding track */}
      <div
        className="flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: `${slideCount * 100}%`,
          transform: `translateX(-${(activeSlide % slideCount) * (100 / slideCount)}%)`,
        }}
      >
        {list.map((slide, idx) => {
          const TitleTag = idx === 0 ? 'h1' : 'h2';
          const content = (
            <>
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center scale-[1.02] transition-transform duration-[6000ms] ease-out"
              />
              {/* Subtle luxury architectural atmospheric overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0F1826]/55 via-[#0F1826]/25 to-[#0F1826]/50 pointer-events-none" />

              <div
                key={activeSlide}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 select-none pointer-events-none"
              >
                <TitleTag
                  className={`text-white font-normal text-[clamp(34px,3.6vw,80px)] leading-[1.35] tracking-[0.08em] mb-2${
                    idx === activeSlide ? ' hero-slide-title' : ''
                  }`}
                  style={{
                    fontFamily: "'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif",
                    textShadow: '0 2px 18px rgba(0,0,0,0.35)',
                  }}
                >
                  {slide.title}
                </TitleTag>
                <p
                  className={`text-white font-normal leading-[1.3] tracking-[0.04em] sm:tracking-[0.11em] ${
                    // 中文副标题字面更"空"，同字号下观感偏小，按语种等比放大一档以对齐第一屏的视觉大小
                    isLatin(slide.subtitle)
                      ? 'text-[clamp(24px,2.8vw,60px)]'
                      : 'text-[clamp(28px,3.2vw,68px)]'
                  }${idx === activeSlide ? ' hero-slide-sub' : ''}`}
                  style={{
                    fontFamily: isLatin(slide.subtitle)
                      ? "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
                      : "'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif",
                    textShadow: '0 2px 18px rgba(0,0,0,0.35)',
                  }}
                >
                  {slide.subtitle}
                </p>
              </div>
            </>
          );
          return (
            <div
              key={idx}
              className="relative h-full shrink-0 overflow-hidden"
              style={{ width: `${100 / slideCount}%` }}
            >
              {slide.link ? (
                <a href={slide.link} className="block w-full h-full" aria-label={slide.title}>
                  {content}
                </a>
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>

      {/* Manual slide controls: faint chevrons that brighten on hover */}
      {slideCount > 1 && (
        <div className="absolute inset-0 z-20 pointer-events-none hidden md:block">
          <button
            type="button"
            onClick={() => goTo(activeSlide - 1)}
            aria-label="上一屏"
            className="pointer-events-auto cursor-pointer absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full border border-white/25 text-white/40 hover:text-white/90 hover:border-white/60 hover:bg-white/5 transition-all duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(activeSlide + 1)}
            aria-label="下一屏"
            className="pointer-events-auto cursor-pointer absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full border border-white/25 text-white/40 hover:text-white/90 hover:border-white/60 hover:bg-white/5 transition-all duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}

      {/* 移动端轮播指示点（席位放在底部滚动提示上方） */}
      {slideCount > 1 && (
        <div className="absolute bottom-[72px] left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 md:hidden">
          {list.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              aria-label={`切换到第 ${idx + 1} 屏`}
              aria-current={idx === activeSlide}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
