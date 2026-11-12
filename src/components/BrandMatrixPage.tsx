import React, { useState } from 'react';

import { BRAND_MATRIX_TIERS, type BrandMatrixCard } from '../data/brands';
import { BrandMatrixEmblem } from './BrandMatrixEmblem';

export interface BrandMatrixPageProps {
  onNavigateHome: (targetAnchor?: string) => void;
  onSelectBrandDetail?: (brandId: string) => void;
}

export const BrandMatrixPage: React.FC<BrandMatrixPageProps> = ({ onNavigateHome, onSelectBrandDetail }) => {
  // 已上线品牌详情页的品牌，其余品牌入口暂缓开放
  const DETAIL_ENABLED_BRANDS = new Set<string>([
    'jifeng-j',
    'jifeng-intl',
    'jifeng',
    'jifeng-resort',
    // 丽呈花盛系列
    'grand-rezen',
    'rezen-huasheng',
    'rezen-huasheng-resort',
    // 富士系列
    'fuji-liya',
    'fuji-yazhi',
    'fuji-intl',
    'fuji-yuezhi',
    // 巴里岛系列
    'balidao-intl',
    'balidao-resort',
    'balidao-holiday',
    // 丽钻酒店（单品牌）
    'lizuan',
    // 朵致酒店（单品牌）
    'duozhi',
    // 携程度假农庄（单品牌）
    'ctrip-farm',
    // 新世界酒店（单品牌）
    'new-world',
  ]);
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('all');
  const [activeBrandModal, setActiveBrandModal] = useState<BrandMatrixCard | null>(null);

  const filteredTiers =
    selectedTierFilter === 'all'
      ? BRAND_MATRIX_TIERS
      : BRAND_MATRIX_TIERS.filter((t) => t.id === selectedTierFilter);

  const totalBrandsCount = BRAND_MATRIX_TIERS.reduce((acc, t) => acc + t.brands.length, 0);

  return (
    <div className="w-full bg-[#FAFAFB] text-[#222222]">
      {/* =====================================================================
          1. TOP HERO BANNER & BREADCRUMBS
          Consistent with About Us luxury editorial aesthetic
         ===================================================================== */}
      <section className="relative w-full h-[400px] md:h-[460px] bg-[#111622] overflow-hidden select-none">
        {/* Architectural Hotel Lobby Backdrop Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('/assets/rezen/ppjz.webp')`,
          }}
        />
        {/* Dark Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#111622]/95" />

        {/* Ambient Subtle Gold Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-[#C59B3F]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-[1560px] mx-auto h-full px-6 lg:px-[80px] flex flex-col justify-end pb-14 md:pb-16 text-white z-10">
          <div className="flex flex-col items-start">
            <h1 className="hero-enter text-[32px] sm:text-[40px] md:text-[48px] font-bold tracking-[0.03em] leading-tight text-white">
              品牌矩阵
            </h1>
            <p className="hero-enter-sub mt-3 text-[14px] md:text-[16px] text-white/80 max-w-2xl font-light tracking-wide leading-relaxed">
              构建多层级住宿生态 · 缔造全场景旅宿价值
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. FILTER BAR & KPI SUMMARY (Dedicated Page Enhancement)
         ===================================================================== */}
      <section className="sticky top-[64px] md:top-[90px] z-30 bg-white/95 backdrop-blur-md border-b border-[#EAEAEA] shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-[1620px] mx-auto px-6 lg:px-[65px] py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedTierFilter('all')}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedTierFilter === 'all'
                    ? 'bg-[#EE9B27] text-white shadow-md shadow-[#EE9B27]/25'
                    : 'bg-[#F4F4F6] text-[#666666] hover:bg-[#EAEAEF] hover:text-[#111111]'
                }`}
              >
                全部品牌矩阵 ({totalBrandsCount})
              </button>
              {BRAND_MATRIX_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setSelectedTierFilter(tier.id)}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                    selectedTierFilter === tier.id
                      ? 'bg-[#EE9B27] text-white shadow-md shadow-[#EE9B27]/25'
                      : 'bg-[#F4F4F6] text-[#666666] hover:bg-[#EAEAEF] hover:text-[#111111]'
                  }`}
                >
                  {tier.tierNameZh} ({tier.brands.length})
                </button>
              ))}
            </div>

            {/* Quick Helper Text */}
            <div className="hidden lg:flex items-center text-[13px] text-[#888888]">
              <span className="w-2 h-2 rounded-full bg-[#EE9B27] mr-2 animate-pulse" />
              覆盖海内外320+城市 · 开业酒店1000+
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. 丽呈智旅品牌矩阵 (EXACT REPLICA OF HOME PAGE CONTENT & LAYOUT)
         ===================================================================== */}
      <section className="w-full bg-[#FAFAFB] pt-[60px] pb-[120px]">
        <div className="max-w-[1620px] mx-auto px-6 lg:px-[65px]">
          {/* Section Heading */}
          <div className="text-center mb-[60px]">
            <h2 className="text-[34px] md:text-[38px] font-bold text-[#111111] tracking-[0.04em] leading-[1.25] mb-3">
              丽呈智旅&丽之呈联盟品牌矩阵
            </h2>
            <div className="w-12 h-[3px] bg-[#EE9B27] mx-auto mb-3 rounded-full" />
            <p className="text-[17px] md:text-[19px] font-normal text-[#666666] tracking-[0.03em]">
              构建多层级住宿生态 · 缔造全场景旅宿价值
            </p>
          </div>

          {/* 4 Tiers Stacked Vertically (Reusing Home Layout Exactly) */}
          <div className="space-y-[64px]">
            {filteredTiers.map((tier) => (
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
                      onClick={
                        onSelectBrandDetail && DETAIL_ENABLED_BRANDS.has(brand.id)
                          ? () => onSelectBrandDetail(brand.id)
                          : undefined
                      }
                      className={`group relative rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] select-none ${
                        onSelectBrandDetail && DETAIL_ENABLED_BRANDS.has(brand.id)
                          ? 'cursor-pointer'
                          : 'cursor-default'
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

                      {/* Center Content: Brand Emblem + EN Name + ZH Name */}
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center pointer-events-none transition-transform duration-500 ease-out group-hover:-translate-y-6">
                        {/* Emblem */}
                        <div className="w-[52px] h-[52px] rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3.5 shadow-sm group-hover:border-white/60 transition-colors">
                          <BrandMatrixEmblem type={brand.emblemType} />
                        </div>

                        {/* English Name (Uppercase, wide letter spacing) */}
                        {/* 按名称长度分档收紧字号与字距，保证桌面端单行显示 */}
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
                        {onSelectBrandDetail && DETAIL_ENABLED_BRANDS.has(brand.id) && (
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

      {/* ---- 品牌 Logo 贯穿滚动墙（万达式灰白底，仅品牌矩阵页显示） ---- */}
      <div className="relative w-full overflow-hidden py-5 bg-[#F3F4F5] border-b border-[#E5E6E8]">
        <div className="flex w-max animate-marquee-x gap-14 pl-6">
          {[...BRAND_MATRIX_TIERS, ...BRAND_MATRIX_TIERS].map((tier, ti) =>
            tier.brands.map((brand) => (
              <button
                key={`${ti}-${brand.id}`}
                type="button"
                className="flex flex-col items-center gap-2 shrink-0 [&>svg]:!text-[#444444] group cursor-default hover:scale-105 transition-transform"
              >
                <div className="w-10 h-10 flex items-center justify-center text-[#444444] [&>svg]:!text-[#444444] group-hover:text-[#111111] transition-colors">
                  <BrandMatrixEmblem type={brand.emblemType} tone="dark" />
                </div>
                <span className="text-[14px] font-medium text-[#444444] group-hover:text-[#111111] whitespace-nowrap transition-colors">
                  {brand.nameZh}
                </span>
              </button>
            ))
          )}
        </div>
        {/* 左右渐隐遮罩 */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F3F4F5] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F3F4F5] to-transparent" />
      </div>

      {/* =====================================================================
          5. BRAND DETAIL LIGHTBOX MODAL
         ===================================================================== */}
      {activeBrandModal && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 animate-fade-in"
          onClick={() => setActiveBrandModal(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveBrandModal(null)}
              className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
              aria-label="关闭"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Hero Banner Photo */}
            <div className="relative h-[240px] sm:h-[280px] w-full overflow-hidden">
              <img
                src={activeBrandModal.bgImage}
                alt={activeBrandModal.nameZh}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute bottom-6 left-6 sm:left-8 right-6 text-white flex items-end justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3">
                    <BrandMatrixEmblem type={activeBrandModal.emblemType} />
                  </div>
                  <h4 className="text-[14px] text-white/80 uppercase tracking-[0.16em]">
                    {activeBrandModal.nameEn}
                  </h4>
                  <h3 className="text-[26px] sm:text-[30px] font-bold text-white mt-1">
                    {activeBrandModal.nameZh}
                  </h3>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <span className="text-[12px] font-semibold text-[#EE9B27] tracking-wider uppercase">
                  品牌定位 · POSITIONING
                </span>
                <p className="text-[15px] font-medium text-[#111111] mt-1">
                  {activeBrandModal.positioning || activeBrandModal.tagline}
                </p>
              </div>

              {activeBrandModal.targetGuest && (
                <div>
                  <span className="text-[12px] font-semibold text-[#888888] tracking-wider uppercase">
                    目标客群 · TARGET GUEST
                  </span>
                  <p className="text-[14px] text-[#444444] mt-1">
                    {activeBrandModal.targetGuest}
                  </p>
                </div>
              )}

              {activeBrandModal.features && activeBrandModal.features.length > 0 && (
                <div>
                  <span className="text-[12px] font-semibold text-[#888888] tracking-wider uppercase">
                    核心特色 · BRAND HIGHLIGHTS
                  </span>
                  <ul className="mt-2 space-y-2">
                    {activeBrandModal.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start text-[14px] text-[#444444]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EE9B27] mt-2 mr-2.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between">
                <span className="text-[12px] text-[#888888]">
                  携程旗下丽呈集团核心品牌矩阵
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveBrandModal(null);
                    onNavigateHome('#system');
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#EE9B27] hover:bg-[#D6881A] text-white text-[13px] font-semibold shadow-md transition-all cursor-pointer"
                >
                  加盟此品牌
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
