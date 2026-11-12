import React from 'react';
import type { BrandMatrixCard } from '../data/brands';

/**
 * 品牌矩阵统一使用的白色线性徽标，首页与品牌矩阵页共用同一套图形。
 * 少数品牌提供的是官方位图 logo，这里统一走滤镜压成纯白，保持与线性图标一致的视觉语言。
 */
const IMAGE_EMBLEMS: Partial<
  Record<BrandMatrixCard['emblemType'], { src: string; size: number; colorless?: boolean }>
> = {
  fuji: { src: '/assets/rezen/fujilogo.png', size: 30 },
  // 携程度假农庄 logo 本身已是透明底纯白图形
  farm: { src: '/assets/rezen/xcdjnzlogo.png', size: 34 },
  // 丽呈花盛 logo 为横向展开的 R 字花体，图形较扁，尺寸放宽一档保证视觉体量
  huasheng: { src: '/assets/rezen/hsgjlogo.png', size: 38 },
  // 丽呈花盛酒店 logo 已按 R 字形重心居中并裁掉多余留白
  huashengHotel: { src: '/assets/rezen/hslogo.png', size: 24 },
  // 丽呈花盛度假酒店是实心方块 + 镂空 R + 金色圆点：已在图片里烘成白块与中灰圆点，需关掉滤镜
  huashengResort: { src: '/assets/rezen/hsdjlogo-white.png', size: 26, colorless: false },
  // 巴里岛 logo 图形留白较多，显示尺寸调大一档
  balidao: { src: '/assets/rezen/bldlogo.png', size: 40 },
  // 季枫 logo 已预先去掉外层红环，只保留中间图形；图形本身较宽，显示尺寸收小一档
  jifeng: { src: '/assets/rezen/jflogo.png', size: 28 },
  // 丽钻与朵致 logo 均为方形徽标，已裁掉透明留白
  letterL: { src: '/assets/rezen/lizuanlogo.webp', size: 24 },
  letterD: { src: '/assets/rezen/duozhilogo.webp', size: 24 },
};

export const BrandMatrixEmblem: React.FC<{
  type: BrandMatrixCard['emblemType'];
  /** light：深色卡片上用白色徽标（默认）；dark：浅色底（如 Logo 滚动墙）上用灰黑徽标 */
  tone?: 'light' | 'dark';
}> = ({ type, tone = 'light' }) => {
  const image = IMAGE_EMBLEMS[type];
  if (image) {
    // 位图统一压成纯白或深灰；已预烘成白色的丽呈花盛度假 logo 也跟随色调走
    const filter =
      tone === 'dark' ? 'brightness(0) invert(0.27)' : image.colorless === false ? undefined : 'brightness(0) invert(1)';
    return (
      <img
        src={image.src}
        alt="品牌标识"
        className="object-contain"
        style={{ filter, width: image.size, height: image.size }}
      />
    );
  }

  switch (type) {
    case 'grand':
      return (
        <svg className="w-[30px] h-[30px] text-white" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M5 23L7 11L12 16L16 8L20 16L25 11L27 23H5Z" strokeLinejoin="round" />
          <line x1="5" y1="26" x2="27" y2="26" strokeLinecap="round" />
          <circle cx="16" cy="18" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'retreat':
      return (
        <svg className="w-[30px] h-[30px] text-white" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="16" cy="16" r="13" strokeDasharray="3 3" />
          <path d="M16 8C13 13 10 18 10 21C10 23.5 12.5 24 16 24C19.5 24 22 23.5 22 21C22 18 19 13 16 8Z" strokeLinejoin="round" />
          <path d="M16 14V24" strokeLinecap="round" />
        </svg>
      );
    case 'world':
      return (
        <svg className="w-[30px] h-[30px] text-white" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="16" cy="16" r="13" />
          <path d="M16 4V28M4 16H28" strokeLinecap="round" />
          <path d="M16 8L20 16L16 24L12 16Z" fill="currentColor" fillOpacity="0.25" />
        </svg>
      );
    case 'rezen':
      return (
        <svg className="w-[30px] h-[30px] text-white" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7">
          <rect x="5" y="5" width="22" height="22" rx="4" />
          <path d="M11 23V9H18C20.5 9 22 10.5 22 13C22 15.5 20.5 17 18 17H11M17 17L22 23" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'select':
      return (
        <svg className="w-[30px] h-[30px] text-white" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="16" y="4" width="16.5" height="16.5" rx="2" transform="rotate(45 16 4)" />
          <circle cx="16" cy="16" r="4" />
        </svg>
      );
    case 'langyue':
      return (
        <svg className="w-[30px] h-[30px] text-white" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M19 7C14 7 10 11 10 16C10 21 14 25 19 25C14.5 24 13.5 18 16 14C17.5 11.5 19.5 9.5 19 7Z" fill="currentColor" fillOpacity="0.25" strokeLinejoin="round" />
          <circle cx="21" cy="11" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'apt':
      return (
        <svg className="w-[30px] h-[30px] text-white" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="6" y="8" width="20" height="18" rx="2" />
          <path d="M6 14H26M13 14V26M19 14V26" strokeLinecap="round" />
          <path d="M16 4L26 8H6L16 4Z" strokeLinejoin="round" />
        </svg>
      );
    case 'boxin':
      return (
        <svg className="w-[30px] h-[30px] text-white" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M7 23C7 20 9.5 18 12 18C12.5 15 15 13 18 13C21.5 13 24 15.5 24 19C25.5 19 27 20.5 27 22.5C27 24.5 25.5 25 24 25H9C7.5 25 7 24 7 23Z" strokeLinejoin="round" />
          <path d="M11 18L16 11L21 18" strokeLinecap="round" />
        </svg>
      );
    case 'chaoman':
      return (
        <svg className="w-[30px] h-[30px] text-white" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 16C6 11 10 7 16 7C22 7 26 11 26 16C26 21 22 25 16 25" strokeLinecap="round" />
          <circle cx="16" cy="16" r="3" fill="currentColor" />
        </svg>
      );
    case 'funlist':
      return (
        <svg className="w-[30px] h-[30px] text-white" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M8 8H24V24H8Z" strokeLinejoin="round" />
          <path d="M12 16L15 19L20 13" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'core':
      return (
        <svg className="w-[30px] h-[30px] text-white" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6">
          <polygon points="16 4 28 10 28 22 16 28 4 22 4 10" />
          <circle cx="16" cy="16" r="3.5" fill="currentColor" />
        </svg>
      );
    case 'echamp':
      return (
        <svg className="w-[30px] h-[30px] text-white" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="16" cy="16" r="12" />
          <path d="M16 8L20 16L16 24L12 16Z" strokeLinejoin="round" />
        </svg>
      );
    case 'city':
      return (
        <svg className="w-[30px] h-[30px] text-white" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 26V8L14 4V26M14 12L26 8V26" strokeLinejoin="round" />
          <line x1="4" y1="26" x2="28" y2="26" strokeLinecap="round" />
        </svg>
      );
    case 'zmax':
      return (
        <svg className="w-[30px] h-[30px] text-white" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6">
          <polygon points="8 7 24 7 12 25 24 25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'jingtu':
      return (
        <svg className="w-[30px] h-[30px] text-white" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M16 5L25 9V17C25 22.5 21 26.5 16 28C11 26.5 7 22.5 7 17V9L16 5Z" strokeLinejoin="round" />
          <path d="M16 11V21M11 16H21" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg className="w-[30px] h-[30px] text-white" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="16" cy="16" r="12" />
        </svg>
      );
  }
};
