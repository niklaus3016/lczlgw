import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config.js';
import { db, sqlite } from './index.js';
import { banners, hotels, news } from './schema.js';
import { nowIso } from '../lib/time.js';

interface SeedBanner {
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  sortOrder?: number;
}
interface SeedNews {
  title: string;
  summary: string;
  content: string;
  cover: string;
  category: string;
  tag?: string;
  author?: string;
  views?: number;
  publishedAt: string;
}
interface SeedHotel {
  name: string;
  brand: string;
  city: string;
  region: string;
  address: string;
  openYear: string;
  ratingScore: string;
  ratingDesc: string;
  amenities: { icon: string; label: string }[];
  phone: string;
  priceRange: string;
  mainPhoto: { url: string; caption: string };
  gridPhotos: { url: string; caption: string }[];
  sortOrder?: number;
}
interface SeedData {
  banners: SeedBanner[];
  news: SeedNews[];
  hotels: SeedHotel[];
}

/** 三张内容表全空时视为需要种子导入 */
export function needsSeed(): boolean {
  const row = sqlite
    .prepare('SELECT (SELECT COUNT(*) FROM banners) + (SELECT COUNT(*) FROM news) + (SELECT COUNT(*) FROM hotels) AS n')
    .get() as { n: number };
  return row.n === 0;
}

/**
 * 导入种子数据。seed-data.json 与 seed-assets/（已转 WebP 的图片）在构建期生成，
 * 容器首次启动时执行，全程无需访问外网。
 */
export function runSeed() {
  if (!fs.existsSync(config.seedDataFile)) {
    console.warn('[seed] 未找到 seed-data.json，跳过初始数据导入');
    return;
  }
  const data = JSON.parse(fs.readFileSync(config.seedDataFile, 'utf8')) as SeedData;

  // 拷贝种子图片到持久卷 uploads/seed/
  if (fs.existsSync(config.seedAssetsDir)) {
    const target = path.join(config.uploadsDir, 'seed');
    fs.mkdirSync(target, { recursive: true });
    for (const f of fs.readdirSync(config.seedAssetsDir)) {
      fs.copyFileSync(path.join(config.seedAssetsDir, f), path.join(target, f));
    }
  }

  const now = nowIso();
  db.transaction((tx) => {
    data.banners.forEach((b, i) => {
      tx.insert(banners)
        .values({ title: b.title, subtitle: b.subtitle ?? '', image: b.image, link: b.link || null, sortOrder: b.sortOrder ?? i, enabled: 1, createdAt: now, updatedAt: now })
        .run();
    });
    data.news.forEach((n) => {
      tx.insert(news)
        .values({
          title: n.title,
          summary: n.summary,
          content: n.content,
          cover: n.cover,
          category: n.category,
          tag: n.tag || null,
          author: n.author || null,
          views: n.views ?? 0,
          status: 'published',
          publishedAt: n.publishedAt,
          createdAt: now,
          updatedAt: now,
        })
        .run();
    });
    data.hotels.forEach((h, i) => {
      tx.insert(hotels)
        .values({
          name: h.name,
          brand: h.brand,
          city: h.city,
          region: h.region,
          address: h.address,
          openYear: h.openYear,
          ratingScore: h.ratingScore,
          ratingDesc: h.ratingDesc,
          amenities: JSON.stringify(h.amenities),
          phone: h.phone,
          priceRange: h.priceRange,
          mainPhoto: JSON.stringify(h.mainPhoto),
          gridPhotos: JSON.stringify(h.gridPhotos),
          sortOrder: h.sortOrder ?? i,
          status: 'published',
          createdAt: now,
          updatedAt: now,
        })
        .run();
    });
  });
  console.log(`[seed] 导入完成：banner ${data.banners.length} 条、新闻 ${data.news.length} 条、酒店 ${data.hotels.length} 家`);
}
