/**
 * 开发期一次性执行：从官网源码提取硬编码数据（新闻 / 酒店 / 首页 Banner），
 * 下载全部外链图片并转为 WebP 存入 server/seed-assets/，
 * 最终生成 server/seed-data.json。容器启动时的 seed 全程离线。
 *
 * 用法：npm run extract-seed（在 server/ 目录下，或根目录 npm run extract-seed）
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { EXTENDED_NEWS_LIST } from '../../src/components/NewsPage';
import { HOTEL_DIRECTORY_LIST } from '../../src/components/HotelDirectoryPage';

const SERVER_ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(SERVER_ROOT, 'seed-assets');
const OUT_JSON = path.join(SERVER_ROOT, 'seed-data.json');
fs.mkdirSync(OUT_DIR, { recursive: true });

const urlMap = new Map<string, string>();

/** 外链图片 → 下载转 WebP → /uploads/seed/<hash>.webp；本地路径与失败情况原样保留 */
async function localize(url: string): Promise<string> {
  if (!url || !url.startsWith('http')) return url;
  if (urlMap.has(url)) return urlMap.get(url)!;
  const hash = crypto.createHash('md5').update(url).digest('hex').slice(0, 12);
  const rel = `/uploads/seed/${hash}.webp`;
  const file = path.join(OUT_DIR, `${hash}.webp`);
  if (!fs.existsSync(file)) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await sharp(buf)
        .rotate()
        .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(file);
      console.log(`[extract] 已下载 ${url.slice(0, 80)}...`);
    } catch (err) {
      console.warn(`[extract] 下载失败，保留原链接：${url}`, err instanceof Error ? err.message : err);
      urlMap.set(url, url);
      return url;
    }
  }
  urlMap.set(url, rel);
  return rel;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function main() {
  // 首页 Banner：来自 HeroCanvasBackground.tsx 的两屏本地图（路径即官网 /assets，无需下载）
  const bannerSeed = [
    {
      title: '连接无界，体验非凡',
      subtitle: 'Alliance Bound,Experience Unbound',
      image: '/assets/rezen/shoupin1.webp',
      link: '',
      sortOrder: 0,
    },
    {
      title: '丽呈智旅',
      subtitle: '酒店数字化经营解决方案服务商',
      image: '/assets/rezen/shoupin2.webp',
      link: '',
      sortOrder: 1,
    },
  ];

  // 新闻：段落数组转富文本 HTML，封面图本地化
  const newsSeed = [];
  for (const n of EXTENDED_NEWS_LIST) {
    newsSeed.push({
      title: n.title,
      summary: n.summary,
      content: n.content.map((p) => `<p>${escapeHtml(p)}</p>`).join(''),
      cover: await localize(n.image),
      category: n.category,
      tag: n.tag || null,
      author: n.author || '丽呈智旅',
      views: n.views ?? 0,
      publishedAt: n.date,
    });
  }

  // 酒店：主图与 6 张网格图全部本地化
  const hotelSeed = [];
  for (const [i, h] of HOTEL_DIRECTORY_LIST.entries()) {
    hotelSeed.push({
      name: h.name,
      brand: h.brand,
      city: h.city,
      region: h.region,
      address: h.address,
      openYear: h.openYear,
      ratingScore: h.ratingScore,
      ratingDesc: h.ratingDesc,
      amenities: h.amenities,
      phone: h.phone,
      priceRange: h.priceRange,
      mainPhoto: { url: await localize(h.mainPhoto.url), caption: h.mainPhoto.caption },
      gridPhotos: await Promise.all(
        h.gridPhotos.map(async (p) => ({ url: await localize(p.url), caption: p.caption })),
      ),
      sortOrder: i,
    });
  }

  fs.writeFileSync(OUT_JSON, JSON.stringify({ banners: bannerSeed, news: newsSeed, hotels: hotelSeed }, null, 2));
  console.log(`[extract] 完成：banner ${bannerSeed.length}、新闻 ${newsSeed.length}、酒店 ${hotelSeed.length}，图片 ${fs.readdirSync(OUT_DIR).length} 张 → ${OUT_JSON}`);
}

await main();
