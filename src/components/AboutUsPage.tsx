import React, { useState, useRef } from 'react';
import { BigDataEmpowermentSection } from './BigDataEmpowermentSection';

export interface AboutUsPageProps {
  onNavigateHome: (targetAnchor?: string) => void;
}


export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigateHome }) => {
  
  // Video player states
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
    <div className="w-full bg-white text-[#222222]">
      {/* =====================================================================
          1. TOP HERO BANNER & BREADCRUMBS
          Luxury hotel interior backdrop matching Wanda About Us aesthetic
         ===================================================================== */}
      <section className="relative w-full h-[400px] md:h-[460px] bg-[#111622] overflow-hidden select-none">
        {/* Architectural Hotel Lobby Backdrop Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2200&q=85')`,
          }}
        />
        {/* Dark Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#111622]/95" />

        {/* Ambient Subtle Gold Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-[#C59B3F]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-[1560px] mx-auto h-full px-6 lg:px-[80px] flex flex-col justify-end pb-14 md:pb-16 text-white z-10">
          {/* Page Main Headline */}
          <div className="flex flex-col items-start">
            <h1 className="hero-enter text-[32px] sm:text-[40px] md:text-[48px] font-bold tracking-[0.03em] leading-tight text-white">
              关于丽呈智旅
            </h1>
            <p className="hero-enter-sub mt-3 text-[14px] md:text-[16px] text-white/80 max-w-2xl font-light tracking-wide leading-relaxed">
              携程旗下丽呈集团中高端酒店联盟核心成员 · 酒店全链路数智化经营赋能者
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. 公司介绍 (COMPANY PROFILE)
          Verbatim text requested by user + Wanda-style KPI Counter Grid
         ===================================================================== */}
      <section id="company-profile" className="w-full pt-[90px] md:pt-[110px] pb-[96px] bg-white">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          {/* Section Heading */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[32px] md:text-[38px] font-bold text-[#111111] tracking-[0.04em] leading-tight">
              公司介绍
            </h2>
            <div className="w-12 h-[3px] bg-[#C59B3F] mx-auto mt-3.5 rounded-full" />
          </div>

          {/* Verbatim Content Box with Luxury Editorial Typography */}
          <div className="max-w-[1180px] mx-auto">
            <div className="relative bg-[#FAFAF8] border border-[#ECEBE6] rounded-2xl p-8 sm:p-12 md:p-16 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
              <div className="relative space-y-6 text-[#2D2F33] text-[16px] sm:text-[17px] md:text-[18px] leading-[2.1] font-normal tracking-[0.02em] text-justify">
                <p className="indent-8 sm:indent-10">
                  丽呈智旅作为携程旗下丽呈集团中高端酒店联盟的核心成员，承袭丽呈集团作为携程旗下酒店数字化经营服务商的基因，以互联网模式重构酒店运营全流程，通过丽呈REZEN系统提供一体化酒店经营解决方案，利用携程大数据工具和产业生态力量，赋能酒店经营会员及多元化渠道增量收益，科技助力高效运营，为合作商提供一站式合作、管理、运营全链路服务。
                </p>
                <p className="indent-8 sm:indent-10">
                  截至目前，丽呈智旅旗下品牌与丽之呈联盟酒店品牌已累计签约酒店 2000 家，开业酒店 1000 家，业务覆盖海内外 320 余座城市，会员超过3500万。丽呈智旅作为丽之呈联盟首个破百店的成员，其核心品牌包括丽呈花盛酒店系列品牌、季枫酒店系列品牌、富士丽雅酒店系列品牌、巴里岛酒店系列品牌、丽钻酒店和朵致酒店系列品牌。经过多年的行业深耕与不断优化升级，丽呈智旅已正式迈入酒店数字化经营服务的全新阶段。
                </p>
              </div>
            </div>

            {/* 4 Wanda-Style KPI Scale Statistics Counters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 md:mt-16">
              {/* Stat 1 */}
              <div className="bg-white border border-[#EAEAE7] hover:border-[#C59B3F] hover:shadow-[0_10px_30px_rgba(197,155,63,0.12)] transition-all duration-300 rounded-xl p-6 sm:p-7 text-center group">
                <div className="w-12 h-12 mx-auto mb-3.5 rounded-full bg-[#FBF7EE] flex items-center justify-center text-[#C59B3F] group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1M10 21v-4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" />
                  </svg>
                </div>
                <div className="text-[34px] sm:text-[42px] font-extrabold text-[#C59B3F] tracking-tight leading-none">
                  1000<span className="text-[24px] sm:text-[28px] font-semibold ml-0.5">+</span>
                </div>
                <div className="mt-2.5 text-[15px] font-bold text-[#111111]">开业酒店</div>
              </div>

              {/* Stat 2 */}
              <div className="bg-white border border-[#EAEAE7] hover:border-[#C59B3F] hover:shadow-[0_10px_30px_rgba(197,155,63,0.12)] transition-all duration-300 rounded-xl p-6 sm:p-7 text-center group">
                <div className="w-12 h-12 mx-auto mb-3.5 rounded-full bg-[#FBF7EE] flex items-center justify-center text-[#C59B3F] group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className="text-[34px] sm:text-[42px] font-extrabold text-[#C59B3F] tracking-tight leading-none">
                  2000<span className="text-[24px] sm:text-[28px] font-semibold ml-0.5">+</span>
                </div>
                <div className="mt-2.5 text-[15px] font-bold text-[#111111]">累计签约酒店</div>
              </div>

              {/* Stat 3 */}
              <div className="bg-white border border-[#EAEAE7] hover:border-[#C59B3F] hover:shadow-[0_10px_30px_rgba(197,155,63,0.12)] transition-all duration-300 rounded-xl p-6 sm:p-7 text-center group">
                <div className="w-12 h-12 mx-auto mb-3.5 rounded-full bg-[#FBF7EE] flex items-center justify-center text-[#C59B3F] group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <div className="text-[34px] sm:text-[42px] font-extrabold text-[#C59B3F] tracking-tight leading-none">
                  320<span className="text-[24px] sm:text-[28px] font-semibold ml-0.5">+</span>
                </div>
                <div className="mt-2.5 text-[15px] font-bold text-[#111111]">覆盖海内外城市</div>
              </div>

              {/* Stat 4 */}
              <div className="bg-white border border-[#EAEAE7] hover:border-[#C59B3F] hover:shadow-[0_10px_30px_rgba(197,155,63,0.12)] transition-all duration-300 rounded-xl p-6 sm:p-7 text-center group">
                <div className="w-12 h-12 mx-auto mb-3.5 rounded-full bg-[#FBF7EE] flex items-center justify-center text-[#C59B3F] group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="text-[34px] sm:text-[42px] font-extrabold text-[#C59B3F] tracking-tight leading-none">
                  3500<span className="text-[20px] sm:text-[22px] font-bold ml-0.5">万+</span>
                </div>
                <div className="mt-2.5 text-[15px] font-bold text-[#111111]">生态会员规模</div>
              </div>
            </div>

            {/* =====================================================================
                Brand Promotional Video Player (1280x720, Playable, Fullscreen support)
               ===================================================================== */}
            <div className="mt-14 sm:mt-18">
              <div className="relative w-full aspect-[1280/720] rounded-2xl overflow-hidden bg-[#0A0D14] shadow-[0_20px_50px_rgba(0,0,0,0.14)] border border-[#232938] group">
                {/* HTML5 Video element */}
                <video
                  ref={inlineVideoRef}
                  className={`w-full h-full object-contain bg-black transition-opacity duration-500 ${isVideoPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  controls={isVideoPlaying}
                  playsInline
                  preload="metadata"
                  poster="/assets/rezen/shoupin1.webp"
                >
                  <source src="/videos/zhilv.mp4" type="video/mp4" />
                  您的浏览器暂不支持此视频播放。
                </video>

                {/* Cover & Play Overlay (Shown when not yet playing) */}
                {!isVideoPlaying && (
                  <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-10 md:p-12 select-none">
                    {/* Background Poster Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('/assets/rezen/shoupin1.webp')` }}
                    />
                    {/* Dark Filmic Vignette & Lighting Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/35" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(197,155,63,0.18)_0%,_transparent_70%)]" />

                    {/* Top Row: Tag */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#C59B3F]/40 text-[#E5C16C] text-[12px] sm:text-[13px] font-medium tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-[#C59B3F] animate-pulse" />
                        丽呈集团 · 官方品牌宣传片
                      </div>
                    </div>

                    {/* Center: Glowing Luxury Play Button */}
                    <div className="relative z-10 my-auto text-center flex flex-col items-center justify-center">
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

                      <div className="mt-5 text-white/95 text-[18px] sm:text-[22px] md:text-[24px] font-semibold tracking-[0.08em] drop-shadow-md">
                        点击播放品牌宣传片
                      </div>
                    </div>

                    {/* Bottom Row: Video Meta & Quick Action */}
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/80 border-t border-white/10 pt-4">
                      <div className="text-[13px] sm:text-[14px] text-white/85 text-center sm:text-left">
                        全景呈现携程旗下丽呈集团中高端酒店生态与数智化运营实力
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
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. 企业文化 (CORPORATE CULTURE)
          3 Columns with vertical dividers, replica of Wanda Hotels & Resorts (image_33aeae1f.png)
         ===================================================================== */}
      <section id="corporate-culture" className="w-full py-[100px] md:py-[120px] bg-[#F7F7F8] border-y border-[#EAEAE8]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {/* Section Heading */}
          <div className="text-center mb-14 md:mb-20">
            <h2 className="text-[32px] md:text-[38px] font-bold text-[#111111] tracking-[0.04em] leading-tight">
              企业文化
            </h2>
            <div className="w-12 h-[3px] bg-[#C59B3F] mx-auto mt-3.5 rounded-full" />
          </div>

          {/* 3 Columns Layout with subtle vertical dividers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 relative">
            {/* Column 1: 公司愿景 */}
            <div className="md:px-10 lg:px-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-[#E7E5DF] flex items-center justify-center text-[#C59B3F] mb-6">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>

              <h3 className="text-[22px] font-bold text-[#111111] tracking-wide">
                公司愿景
              </h3>

              <div className="w-10 h-px bg-[#C59B3F]/40 mb-6" />

              <h4 className="text-[17px] font-bold text-[#222222] leading-snug mb-3">
                成为中国领先的酒店数字化经营赋能平台
              </h4>
              <p className="text-[15px] text-[#666666] leading-[1.8] text-center font-light">
                以数智科技重塑商旅体验，为宾客缔造品质旅居，<br />
                为业主创造持久收益。
              </p>
            </div>

            {/* Vertical Divider 1 */}
            <div className="hidden md:block absolute left-1/3 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-[#DCDAD2] to-transparent" />

            {/* Column 2: 公司使命 */}
            <div className="md:px-10 lg:px-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-[#E7E5DF] flex items-center justify-center text-[#C59B3F] mb-6">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>

              <h3 className="text-[22px] font-bold text-[#111111] tracking-wide">
                公司使命
              </h3>

              <div className="w-10 h-px bg-[#C59B3F]/40 mb-6" />

              <h4 className="text-[17px] font-bold text-[#222222] leading-snug mb-3">
                用数字化驱动酒店行业价值增长
              </h4>
              <p className="text-[15px] text-[#666666] leading-[1.8] text-center font-light">
                打通品牌、流量、技术与供应链全链路，与每一位<br />
                伙伴共生共赢。
              </p>
            </div>

            {/* Vertical Divider 2 */}
            <div className="hidden md:block absolute left-2/3 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-[#DCDAD2] to-transparent" />

            {/* Column 3: 公司价值观 */}
            <div className="md:px-10 lg:px-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-[#E7E5DF] flex items-center justify-center text-[#C59B3F] mb-6">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>

              <h3 className="text-[22px] font-bold text-[#111111] tracking-wide">
                核心价值观
              </h3>

              <div className="w-10 h-px bg-[#C59B3F]/40 mb-6" />

              <h4 className="text-[17px] font-bold text-[#222222] leading-snug mb-3">
                以客为本 · 关爱伙伴 · 恪守匠心 · 敏捷创新
              </h4>
              <p className="text-[15px] text-[#666666] leading-[1.8] text-center font-light">
                以宾客满意为基准，以伙伴共赢为追求，
                以匠心打磨品质，以敏捷拥抱变革。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. 生态价值 (ECOLOGICAL VALUE · 大数据工具赋能酒店经营)
          替换原「荣誉奖项」模块，内容对齐 rezengroup.com/jiazhi.html
         ===================================================================== */}
      <BigDataEmpowermentSection />

      {/* =====================================================================
          5. 高端住宿市场 (HIGH-END ACCOMMODATION MARKET)
          三个交叠圆形：酒管公司 / REZEN / 技术公司
         ===================================================================== */}
      <section className="relative w-full bg-[#F7F8FA] overflow-hidden py-16 md:py-20">
        {/* 四角虚线装饰弧 */}
        <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
          <div className="absolute -left-32 -top-40 w-[420px] h-[420px] md:w-[520px] md:h-[520px] rounded-full border border-dashed border-[#9FC4ED]/55" />
          <div className="absolute -right-32 -top-40 w-[420px] h-[420px] md:w-[520px] md:h-[520px] rounded-full border border-dashed border-[#9FC4ED]/55" />
          <div className="absolute -left-40 -bottom-48 w-[460px] h-[460px] md:w-[560px] md:h-[560px] rounded-full border border-dashed border-[#9FC4ED]/45" />
          <div className="absolute -right-40 -bottom-48 w-[460px] h-[460px] md:w-[560px] md:h-[560px] rounded-full border border-dashed border-[#9FC4ED]/45" />
        </div>

        <div className="relative max-w-[1120px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">
            {/* 酒管公司 */}
            <div className="relative shrink-0 w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full bg-[#E4EFFB]/80 border border-[#A9CBEE]/40 flex items-center justify-center md:-mr-14">
              <div className="w-[214px] h-[214px] md:w-[268px] md:h-[268px] rounded-full border border-[#A9CBEE] bg-[#DCE9F8]/85 flex items-center justify-center">
                <span className="text-[22px] md:text-[25px] font-semibold text-[#2F6FD0] tracking-wide">
                  酒管公司
                </span>
              </div>
            </div>

            {/* REZEN 中心圆：半透明填充，与两侧圆交叠处自然形成透镜状交集 */}
            <div className="relative z-10 shrink-0 w-[340px] h-[340px] md:w-[470px] md:h-[470px]">
              <div className="absolute inset-0 rounded-full bg-[#F8FBFF]/50 border border-[#9FC4ED] shadow-[0_12px_44px_rgba(47,111,208,0.10)]" />
              <div className="relative w-full h-full rounded-full flex flex-col items-center justify-center text-center px-8 md:px-11">
                <p className="text-[11px] md:text-[13px] font-semibold text-[#333333] leading-snug">
                  不同于酒店集团区别于技术公司的市场新物种
                </p>
                <img
                  src="/assets/rezen/rezen-wordmark.webp"
                  alt="REZEN"
                  className="w-[132px] md:w-[185px] h-auto my-2.5 md:my-4"
                />
                <p className="text-[15px] md:text-[18px] font-bold text-[#111111] tracking-wide">
                  携程酒店数字化经营解决方案服务商
                </p>
                <p className="mt-3 md:mt-5 text-[9.5px] md:text-[11.5px] leading-[1.8] text-[#5A5F66]">
                  通过软件与大数据的结合，以酒店管理公司为核心，为品牌方供应链的上下游提供完整闭环的客户端产品，将投资人、业主、供应商、营销服务商、软件商打通，实现全产业链的数字化，为管理公司提供深层、高效、高投入产出的解决方案。
                </p>
              </div>
            </div>

            {/* 技术公司 */}
            <div className="relative shrink-0 w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full bg-[#E4EFFB]/80 border border-[#A9CBEE]/40 flex items-center justify-center md:-ml-14">
              <div className="w-[214px] h-[214px] md:w-[268px] md:h-[268px] rounded-full border border-[#A9CBEE] bg-[#DCE9F8]/85 flex items-center justify-center">
                <span className="text-[22px] md:text-[25px] font-semibold text-[#2F6FD0] tracking-wide">
                  技术公司
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. 酒店经营解决方案 (HOTEL OPERATION SOLUTION)
          01 项目定位 / 02 运营降本 / 03 运营增收 → REZEN技术系统
         ===================================================================== */}
      <section className="relative w-full bg-[#F7F8FA] pb-20 md:pb-24">
        <div className="max-w-[1120px] mx-auto px-6">
          <h3 className="text-[22px] md:text-[26px] font-bold text-[#111111] tracking-[0.02em]">
            酒店经营解决方案
          </h3>
          <p className="mt-2 text-[12px] md:text-[13px] text-[#666666] tracking-wide">
            丽呈的数字化能力全方位助力酒店全流程发展
          </p>

          <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {[
              {
                no: '01',
                title: '项目定位',
                lines: ['从“我想做个什么样的酒店”转变为“大数据告诉你，你应该做个什么样的酒店”'],
              },
              {
                no: '02',
                title: '运营降本',
                lines: ['运营效率提升', '管理更高效'],
              },
              {
                no: '03',
                title: '营业增收',
                lines: ['增量客源收益', '赚更多的钱'],
              },
            ].map((item) => (
              <div
                key={item.no}
                className="relative bg-white rounded-lg px-7 md:px-8 pt-6 pb-8 md:pb-10 border-b border-[#E9BE63] shadow-[0_2px_16px_rgba(17,22,34,0.04)] flex flex-col"
              >
                <span className="block text-[46px] md:text-[56px] font-extrabold leading-none tracking-tight bg-gradient-to-b from-[#F6C85C] to-[#E3A63B] bg-clip-text text-transparent">
                  {item.no}
                </span>
                <h4 className="mt-2 md:mt-3 text-[24px] md:text-[28px] font-bold text-[#1D1D1F] tracking-wide">
                  {item.title}
                </h4>
                <div className="mt-5 md:mt-6 space-y-1.5 text-[12.5px] md:text-[13px] leading-[1.9] text-[#6B6B6B]">
                  {item.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 连接线：左右两张卡片向下汇聚到 REZEN技术系统 */}
          <div className="hidden md:block relative mt-1">
            <svg
              className="w-full h-[104px]"
              viewBox="0 0 1000 104"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M157 0 V58 Q157 74 173 74 H488"
                stroke="#E9BE63"
                strokeWidth="1.2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M843 0 V58 Q843 74 827 74 H512"
                stroke="#E9BE63"
                strokeWidth="1.2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M491 74 L500 86 L509 74"
                stroke="#E9BE63"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <p className="mt-4 md:-mt-2 text-center text-[18px] md:text-[22px] font-bold text-[#1D1D1F] tracking-wide">
            REZEN技术系统
          </p>
        </div>
      </section>

      {/* =====================================================================
          7. 丽呈技术生态圈 (TECHNOLOGY ECOSYSTEM)
         ===================================================================== */}
      <section className="relative w-full bg-[#F7F8FA] pb-20 md:pb-24">
        <div className="max-w-[1120px] mx-auto px-6">
          <h3 className="text-[22px] md:text-[26px] font-bold text-[#111111] tracking-[0.02em]">
            丽呈技术生态圈，全方位连接平台产业链
          </h3>

          <div className="mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_176px_176px] gap-5">
            {/* 主表：能力分层 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-[0_2px_16px_rgba(17,22,34,0.04)]">
              {/* 客户应用 */}
              <div className="grid grid-cols-[104px_minmax(0,1fr)] md:grid-cols-[132px_minmax(0,1fr)]">
                <div className="flex items-center px-4 md:px-6 py-6 md:py-7 border-r border-dashed border-[#DCDCDC]">
                  <span className="text-[13px] md:text-[14px] font-bold text-[#1D1D1F]">客户应用</span>
                </div>
                <div className="flex flex-nowrap items-center justify-between gap-2 md:gap-3 px-4 md:px-6 py-6 md:py-7 overflow-x-auto no-scrollbar">
                  <span className="shrink-0 text-[20px] md:text-[21px] font-extrabold text-[#0B63D6] tracking-tight">One</span>
                  <span className="shrink-0 text-[15px] md:text-[17px] font-bold text-[#12305A] tracking-wide">Bussiness</span>
                  <span className="shrink-0 text-[16px] md:text-[18px] font-bold text-[#111111] tracking-[0.06em]">STAY</span>
                  <span className="shrink-0 text-[14px] md:text-[16px] font-bold tracking-[0.03em] bg-gradient-to-r from-[#0B63D6] to-[#4C9BF0] bg-clip-text text-transparent">
                    MERCHANT
                  </span>
                  <span className="shrink-0 inline-flex items-center border border-[#2B2B2B] px-2 md:px-2.5 py-1 text-[11px] md:text-[12px] font-semibold text-[#222222] tracking-wide">
                    OPEN API
                  </span>
                </div>
              </div>

              {/* 多客户管理 */}
              <div className="grid grid-cols-[104px_minmax(0,1fr)] md:grid-cols-[132px_minmax(0,1fr)] border-t border-[#EDEDED]">
                <div className="flex items-center px-4 md:px-6 py-6 md:py-7 border-r border-dashed border-[#DCDCDC]">
                  <span className="text-[13px] md:text-[14px] font-bold text-[#1D1D1F]">多客户管理</span>
                </div>
                <div className="grid grid-cols-3 gap-4 px-4 md:px-6 py-6 md:py-7">
                  {[
                    { t: 'SSO', s: '企业微信' },
                    { t: '权限', s: '隔离/配置' },
                    { t: '访问', s: '风控/监控' },
                  ].map((c) => (
                    <div key={c.t} className="text-center">
                      <p className="text-[12.5px] md:text-[13px] text-[#1D1D1F]">{c.t}</p>
                      <p className="mt-1 text-[11px] md:text-[12px] text-[#9A9A9A]">{c.s}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 业务中台 */}
              <div className="grid grid-cols-[104px_minmax(0,1fr)] md:grid-cols-[132px_minmax(0,1fr)] border-t border-[#EDEDED]">
                <div className="flex items-center px-4 md:px-6 py-6 md:py-7 border-r border-dashed border-[#DCDCDC]">
                  <span className="text-[13px] md:text-[14px] font-bold text-[#1D1D1F]">业务中台</span>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-x-3 gap-y-4 px-4 md:px-6 py-6 md:py-7">
                  {[
                    ['加盟/筹建', '餐饮管理'],
                    ['酒店管理', '酒店质检'],
                    ['满房助手', '经营管理'],
                    ['云总机', '客户管理'],
                    ['增量预测', '硬件对接'],
                    ['中央预定', '集团采购'],
                  ].map((col, i) => (
                    <div key={i} className="space-y-1.5">
                      {col.map((line) => (
                        <p key={line} className="text-[11.5px] md:text-[12.5px] text-[#333333] leading-snug whitespace-nowrap">
                          {line}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* 技术组件 */}
              <div className="grid grid-cols-[104px_minmax(0,1fr)] md:grid-cols-[132px_minmax(0,1fr)] border-t border-[#EDEDED]">
                <div className="flex items-center px-4 md:px-6 py-6 md:py-7 border-r border-dashed border-[#DCDCDC]">
                  <span className="text-[13px] md:text-[14px] font-bold text-[#1D1D1F]">技术组件</span>
                </div>
                <div className="grid grid-cols-3 gap-4 px-4 md:px-6 py-6 md:py-7">
                  {['分布式数据库', '微服务框架', '服务治理'].map((t) => (
                    <p key={t} className="text-[11.5px] md:text-[12.5px] text-[#333333] text-center md:text-left">
                      {t}
                    </p>
                  ))}
                </div>
              </div>

              {/* 基础设施 */}
              <div className="grid grid-cols-[104px_minmax(0,1fr)] md:grid-cols-[132px_minmax(0,1fr)] border-t border-[#EDEDED]">
                <div className="flex items-center px-4 md:px-6 py-6 md:py-7 border-r border-dashed border-[#DCDCDC]">
                  <span className="text-[13px] md:text-[14px] font-bold text-[#1D1D1F]">基础设施</span>
                </div>
                <div className="grid grid-cols-3 gap-4 px-4 md:px-6 py-6 md:py-7">
                  {['腾讯云', '阿里云', '携程云'].map((t) => (
                    <p key={t} className="text-[11.5px] md:text-[12.5px] text-[#333333]">
                      {t}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* 研发运营 */}
            <div className="bg-white rounded-lg shadow-[0_2px_16px_rgba(17,22,34,0.04)] px-5 md:px-6 pt-6 md:pt-7 pb-8 md:pb-10">
              <h4 className="text-center text-[15px] md:text-[16px] font-bold text-[#1D1D1F] tracking-wide">
                研发运营
              </h4>
              <div className="mt-4 h-px bg-[#EDEDED]" />
              <ul className="mt-6 space-y-4 md:space-y-5 text-center text-[12px] md:text-[12.5px] text-[#333333]">
                {['需求管理', '信息安全', '合规验证', '预警系统', 'CI/CD', '灾难恢复'].map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            {/* 渠道合作 */}
            <div className="bg-white rounded-lg shadow-[0_2px_16px_rgba(17,22,34,0.04)] px-5 md:px-6 pt-6 md:pt-7 pb-8 md:pb-10">
              <h4 className="text-center text-[15px] md:text-[16px] font-bold text-[#1D1D1F] tracking-wide">
                渠道合作
              </h4>
              <div className="mt-4 h-px bg-[#EDEDED]" />
              <ul className="mt-6 space-y-4 md:space-y-5 text-center text-[12px] md:text-[12.5px] text-[#333333]">
                {['携程', '携程商旅', '同程', 'Amadeus GDS', '去哪儿', 'DerbySoft', '畅联', '红色加力'].map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
