import type { FastifyInstance } from 'fastify';
import { and, asc, desc, eq, like, or, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { pipeline } from 'node:stream/promises';
import sharp from 'sharp';
import { db } from '../db/index.js';
import { adminUsers, banners, hotels, leads, news, newsCategories } from '../db/schema.js';
import { config } from '../config.js';
import { ApiError, parseBody } from '../lib/errors.js';
import { authenticate, verifySameOrigin } from '../lib/auth.js';
import { nowIso, todayUtc8 } from '../lib/time.js';
import { getAiStats, getOverview, type StatsRange } from '../lib/stats.js';
import { compressVideoInPlace } from '../lib/videoCompress.js';

/* ------------------------------ Zod 校验 ------------------------------ */

const bannerSchema = z.object({
  title: z.string().trim().min(1, '请填写主标题').max(100),
  subtitle: z.string().trim().max(200).default(''),
  image: z.string().trim().min(1, '请上传图片').max(500),
  link: z.string().trim().max(500).nullish(),
  sortOrder: z.number().int().min(0).default(0),
  enabled: z.number().int().min(0).max(1).default(1),
});

const newsSchema = z.object({
  title: z.string().trim().min(1, '请填写标题').max(200),
  summary: z.string().trim().max(500).default(''),
  content: z.string().default(''),
  cover: z.string().trim().max(500).default(''),
  category: z.string().trim().max(50).default(''),
  tag: z.string().trim().max(50).nullish(),
  author: z.string().trim().max(50).nullish(),
  status: z.enum(['draft', 'published']).default('draft'),
  publishedAt: z.string().trim().max(30).default(''),
});

const REGIONS = ['华东', '华北', '华南', '西南', '华中', '西北', '东北'] as const;

const photoSchema = z.object({ url: z.string().max(500), caption: z.string().max(200).default('') });

const hotelSchema = z.object({
  name: z.string().trim().min(1, '请填写酒店名称').max(100),
  brand: z.string().trim().max(50).default(''),
  city: z.string().trim().max(50).default(''),
  region: z.enum(REGIONS).default('华东'),
  diamondRating: z
    .number()
    .min(0)
    .max(5)
    .refine((value) => Number.isInteger(value * 2), '钻级需以半钻为单位')
    .default(0),
  address: z.string().trim().max(200).default(''),
  openYear: z.string().trim().max(50).default(''),
  ratingScore: z.string().trim().max(20).default(''),
  ratingDesc: z.string().trim().max(100).default(''),
  amenities: z.array(z.object({ icon: z.string().max(30), label: z.string().max(50) })).max(12).default([]),
  phone: z.string().trim().max(30).default(''),
  priceRange: z.string().trim().max(50).default(''),
  mainPhoto: photoSchema.default({ url: '', caption: '' }),
  gridPhotos: z.array(photoSchema).max(9).default([]),
  sortOrder: z.number().int().min(0).default(0),
  status: z.enum(['published', 'hidden']).default('published'),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(1, '请输入原密码'),
  newPassword: z
    .string()
    .min(8, '新密码至少 8 位')
    .max(64, '新密码最多 64 位')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, '新密码需同时包含字母和数字'),
});

/* ------------------------------ 工具函数 ------------------------------ */

function idParam(req: { params: unknown }): number {
  const id = Number((req.params as { id: string }).id);
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, 400, '无效的资源 ID');
  return id;
}

function hotelToJson(h: typeof hotels.$inferSelect) {
  return {
    ...h,
    amenities: JSON.parse(h.amenities || '[]'),
    mainPhoto: JSON.parse(h.mainPhoto || '{}'),
    gridPhotos: JSON.parse(h.gridPhotos || '[]'),
  };
}

function leadToJson(l: typeof leads.$inferSelect) {
  let utm: unknown = null;
  if (l.utm) {
    try {
      utm = JSON.parse(l.utm);
    } catch {
      utm = null;
    }
  }
  return { ...l, utm };
}

/* ------------------------------ 路由 ------------------------------ */

export async function adminRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifySameOrigin);
  app.addHook('preHandler', authenticate);

  /* ---------- Banner ---------- */

  app.get('/banners', async () => {
    return { code: 0, data: db.select().from(banners).orderBy(asc(banners.sortOrder), asc(banners.id)).all() };
  });

  app.post('/banners', async (req) => {
    const b = parseBody(bannerSchema, req.body);
    const now = nowIso();
    const r = db.insert(banners).values({ ...b, link: b.link || null, createdAt: now, updatedAt: now }).run();
    return { code: 0, data: { id: Number(r.lastInsertRowid) } };
  });

  app.put('/banners/sort', async (req) => {
    const { ids } = parseBody(z.object({ ids: z.array(z.number().int()).min(1) }), req.body);
    db.transaction((tx) => {
      ids.forEach((id, idx) => {
        tx.update(banners).set({ sortOrder: idx, updatedAt: nowIso() }).where(eq(banners.id, id)).run();
      });
    });
    return { code: 0, data: null };
  });

  app.put('/banners/:id', async (req) => {
    const id = idParam(req);
    const b = parseBody(bannerSchema, req.body);
    const r = db.update(banners).set({ ...b, link: b.link || null, updatedAt: nowIso() }).where(eq(banners.id, id)).run();
    if (r.changes === 0) throw new ApiError(404, 404, 'Banner 不存在');
    return { code: 0, data: null };
  });

  app.delete('/banners/:id', async (req) => {
    const r = db.delete(banners).where(eq(banners.id, idParam(req))).run();
    if (r.changes === 0) throw new ApiError(404, 404, 'Banner 不存在');
    return { code: 0, data: null };
  });

  /* ---------- 新闻 ---------- */

  app.get('/news', async (req) => {
    const q = req.query as { page?: string; size?: string; status?: string; q?: string };
    const page = Math.max(1, Number(q.page) || 1);
    const size = Math.min(50, Math.max(1, Number(q.size) || 10));
    const conds = [];
    if (q.status === 'draft' || q.status === 'published') conds.push(eq(news.status, q.status));
    if (q.q) conds.push(like(news.title, `%${q.q}%`));
    const where = conds.length ? and(...conds) : undefined;
    const total = db.select({ count: sql<number>`count(*)` }).from(news).where(where).get()!.count;
    const list = db
      .select({
        id: news.id, title: news.title, category: news.category, tag: news.tag,
        author: news.author, views: news.views, status: news.status,
        publishedAt: news.publishedAt, cover: news.cover, updatedAt: news.updatedAt,
      })
      .from(news)
      .where(where)
      .orderBy(desc(news.publishedAt), desc(news.id))
      .limit(size)
      .offset((page - 1) * size)
      .all();
    return { code: 0, data: { list, total, page, size } };
  });

  app.get('/news/:id', async (req) => {
    const row = db.select().from(news).where(eq(news.id, idParam(req))).get();
    if (!row) throw new ApiError(404, 404, '新闻不存在');
    return { code: 0, data: row };
  });

  app.post('/news', async (req) => {
    const n = parseBody(newsSchema, req.body);
    const now = nowIso();
    const publishedAt = n.status === 'published' && !n.publishedAt ? todayUtc8() : n.publishedAt;
    const r = db
      .insert(news)
      .values({ ...n, tag: n.tag || null, author: n.author || null, publishedAt, createdAt: now, updatedAt: now })
      .run();
    return { code: 0, data: { id: Number(r.lastInsertRowid) } };
  });

  app.put('/news/:id', async (req) => {
    const id = idParam(req);
    const n = parseBody(newsSchema, req.body);
    const old = db.select().from(news).where(eq(news.id, id)).get();
    if (!old) throw new ApiError(404, 404, '新闻不存在');
    const publishedAt = n.status === 'published' && !n.publishedAt ? todayUtc8() : n.publishedAt;
    db.update(news)
      .set({ ...n, tag: n.tag || null, author: n.author || null, publishedAt, updatedAt: nowIso() })
      .where(eq(news.id, id))
      .run();
    return { code: 0, data: null };
  });

  app.put('/news/:id/status', async (req) => {
    const id = idParam(req);
    const { status } = parseBody(z.object({ status: z.enum(['draft', 'published']) }), req.body);
    const old = db.select().from(news).where(eq(news.id, id)).get();
    if (!old) throw new ApiError(404, 404, '新闻不存在');
    db.update(news)
      .set({
        status,
        publishedAt: status === 'published' && !old.publishedAt ? todayUtc8() : old.publishedAt,
        updatedAt: nowIso(),
      })
      .where(eq(news.id, id))
      .run();
    return { code: 0, data: null };
  });

  app.delete('/news/:id', async (req) => {
    const r = db.delete(news).where(eq(news.id, idParam(req))).run();
    if (r.changes === 0) throw new ApiError(404, 404, '新闻不存在');
    return { code: 0, data: null };
  });

  /* ---------- 新闻分类（受控词表） ---------- */

  const taxonomyItemSchema = z.object({
    name: z.string().trim().min(1, '请填写名称').max(30, '名称最多 30 字'),
    sortOrder: z.number().int().min(0).default(0),
  });

  const registerTaxonomy = (route: string, table: typeof newsCategories) => {
    app.get(`/${route}`, async () => ({
      code: 0,
      data: db.select().from(table).orderBy(asc(table.sortOrder), asc(table.id)).all(),
    }));

    app.post(`/${route}`, async (req) => {
      const v = parseBody(taxonomyItemSchema, req.body);
      if (db.select().from(table).where(eq(table.name, v.name)).get()) {
        throw new ApiError(400, 400, '该名称已存在');
      }
      const r = db.insert(table).values({ name: v.name, sortOrder: v.sortOrder, createdAt: nowIso() }).run();
      return { code: 0, data: { id: Number(r.lastInsertRowid) } };
    });

    app.put(`/${route}/:id`, async (req) => {
      const id = idParam(req);
      const v = parseBody(taxonomyItemSchema, req.body);
      const dup = db.select().from(table).where(eq(table.name, v.name)).get();
      if (dup && dup.id !== id) throw new ApiError(400, 400, '该名称已存在');
      const r = db.update(table).set({ name: v.name, sortOrder: v.sortOrder }).where(eq(table.id, id)).run();
      if (r.changes === 0) throw new ApiError(404, 404, '记录不存在');
      return { code: 0, data: null };
    });

    app.delete(`/${route}/:id`, async (req) => {
      const r = db.delete(table).where(eq(table.id, idParam(req))).run();
      if (r.changes === 0) throw new ApiError(404, 404, '记录不存在');
      return { code: 0, data: null };
    });
  };

  registerTaxonomy('news-categories', newsCategories);

  /* ---------- 酒店 ---------- */

  app.get('/hotels', async () => {
    const list = db.select().from(hotels).all().sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    return { code: 0, data: list.map(hotelToJson) };
  });

  app.post('/hotels', async (req) => {
    const h = parseBody(hotelSchema, req.body);
    const now = nowIso();
    const r = db
      .insert(hotels)
      .values({
        ...h,
        amenities: JSON.stringify(h.amenities),
        mainPhoto: JSON.stringify(h.mainPhoto),
        gridPhotos: JSON.stringify(h.gridPhotos),
        createdAt: now,
        updatedAt: now,
      })
      .run();
    return { code: 0, data: { id: Number(r.lastInsertRowid) } };
  });

  app.put('/hotels/:id', async (req) => {
    const id = idParam(req);
    const h = parseBody(hotelSchema, req.body);
    const r = db
      .update(hotels)
      .set({
        ...h,
        amenities: JSON.stringify(h.amenities),
        mainPhoto: JSON.stringify(h.mainPhoto),
        gridPhotos: JSON.stringify(h.gridPhotos),
        updatedAt: nowIso(),
      })
      .where(eq(hotels.id, id))
      .run();
    if (r.changes === 0) throw new ApiError(404, 404, '酒店不存在');
    return { code: 0, data: null };
  });

  app.delete('/hotels/:id', async (req) => {
    const r = db.delete(hotels).where(eq(hotels.id, idParam(req))).run();
    if (r.changes === 0) throw new ApiError(404, 404, '酒店不存在');
    return { code: 0, data: null };
  });

  /* ---------- 留资线索 ---------- */

  app.get('/leads', async (req) => {
    const q = req.query as { page?: string; size?: string; status?: string; q?: string };
    const page = Math.max(1, Number(q.page) || 1);
    const size = Math.min(100, Math.max(1, Number(q.size) || 15));
    const conds = [];
    if (q.status === 'pending' || q.status === 'contacted') conds.push(eq(leads.status, q.status));
    if (q.q) {
      const kw = `%${q.q}%`;
      conds.push(or(like(leads.name, kw), like(leads.phone, kw), like(leads.hotelName, kw)));
    }
    const where = conds.length ? and(...conds) : undefined;
    const total = db.select({ count: sql<number>`count(*)` }).from(leads).where(where).get()!.count;
    const pendingCount = db
      .select({ count: sql<number>`count(*)` })
      .from(leads)
      .where(eq(leads.status, 'pending'))
      .get()!.count;
    const list = db
      .select()
      .from(leads)
      .where(where)
      .orderBy(desc(leads.id))
      .limit(size)
      .offset((page - 1) * size)
      .all();
    return { code: 0, data: { list: list.map(leadToJson), total, pendingCount, page, size } };
  });

  app.put('/leads/:id/status', async (req) => {
    const id = idParam(req);
    const { status } = parseBody(z.object({ status: z.enum(['pending', 'contacted']) }), req.body);
    const r = db.update(leads).set({ status }).where(eq(leads.id, id)).run();
    if (r.changes === 0) throw new ApiError(404, 404, '线索不存在');
    return { code: 0, data: null };
  });

  app.delete('/leads/:id', async (req) => {
    const r = db.delete(leads).where(eq(leads.id, idParam(req))).run();
    if (r.changes === 0) throw new ApiError(404, 404, '线索不存在');
    return { code: 0, data: null };
  });

  /* ---------- 统计 ---------- */

  app.get('/stats/overview', async (req) => {
    const range = (req.query as { range?: string }).range === '30d' ? '30d' : ('7d' as StatsRange);
    return { code: 0, data: getOverview(range) };
  });

  app.get('/stats/ai', async (req) => {
    const range = (req.query as { range?: string }).range === '30d' ? '30d' : ('7d' as StatsRange);
    return { code: 0, data: getAiStats(range) };
  });

  /* ---------- 数据备份导出 ---------- */

  app.get('/export', async (_req, reply) => {
    const dump = {
      exportedAt: nowIso(),
      banners: db.select().from(banners).all(),
      news: db.select().from(news).all(),
      hotels: db.select().from(hotels).all().map(hotelToJson),
      leads: db.select().from(leads).all().map(leadToJson),
    };
    reply.header('Content-Disposition', `attachment; filename="rezen-backup-${todayUtc8()}.json"`);
    return reply.send(dump);
  });

  /* ---------- 图片上传 ---------- */

  app.post('/upload', async (req) => {
    const file = await req.file();
    if (!file) throw new ApiError(400, 400, '未接收到文件');
    const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
    const videoTypes = new Set(['video/mp4', 'video/webm', 'video/quicktime']);
    const isImage = imageTypes.has(file.mimetype);
    const isVideo = videoTypes.has(file.mimetype);
    if (!isImage && !isVideo) {
      throw new ApiError(400, 400, '仅支持 JPG / PNG / WebP / GIF 图片或 MP4 / WebM / MOV 视频');
    }
    const month = todayUtc8().slice(0, 7).replace('-', '');

    // 视频：流式写盘，避免 500MB 文件一次性进入内存；保存后后台异步压缩并同路径替换
    if (isVideo) {
      const name = `${month}/${randomUUID()}.mp4`;
      const full = path.join(config.uploadsDir, name);
      fs.mkdirSync(path.dirname(full), { recursive: true });
      try {
        await pipeline(file.file, fs.createWriteStream(full, { flags: 'wx' }));
      } catch (err) {
        fs.rmSync(full, { force: true });
        if (file.file.truncated) throw new ApiError(413, 413, '视频需小于 500MB');
        throw err;
      }
      if (file.file.truncated) {
        fs.rmSync(full, { force: true });
        throw new ApiError(413, 413, '视频需小于 500MB');
      }
      // 后台压缩（不阻塞响应）；完成后替换同一路径文件，编辑器内 URL 不变
      compressVideoInPlace(full);
      return { code: 0, data: { path: `/uploads/${name}` } };
    }

    let buf: Buffer;
    try {
      buf = await file.toBuffer();
    } catch {
      throw new ApiError(413, 413, '文件大小超出限制');
    }

    // 图片：新闻封面等场景可传 maxKb 收紧体积上限（默认 5MB，最大不超过 5MB）
    const rawMaxKb = Number((req.query as { maxKb?: string }).maxKb);
    const maxKb = Number.isFinite(rawMaxKb) && rawMaxKb > 0 ? Math.min(5120, rawMaxKb) : 5120;
    if (buf.length > maxKb * 1024) {
      throw new ApiError(413, 413, `图片需小于 ${maxKb / 1024}MB`);
    }
    const animated = file.mimetype === 'image/gif';
    let img = sharp(buf, { animated }).rotate();
    const meta = await img.metadata();
    if ((meta.width ?? 0) > 2400 || (meta.height ?? 0) > 2400) {
      img = img.resize({ width: 2400, height: 2400, fit: 'inside' });
    }
    const out = await img.webp({ quality: 82 }).toBuffer();
    const name = `${month}/${randomUUID()}.webp`;
    const full = path.join(config.uploadsDir, name);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, out);
    return { code: 0, data: { path: `/uploads/${name}` } };
  });

  /* ---------- 修改密码 ---------- */

  app.put('/password', async (req) => {
    const { oldPassword, newPassword } = parseBody(passwordSchema, req.body);
    const user = db.select().from(adminUsers).where(eq(adminUsers.id, req.user.uid)).get();
    if (!user) throw new ApiError(401, 401, '账号不存在');
    if (!(await bcrypt.compare(oldPassword, user.passwordHash))) {
      throw new ApiError(400, 400, '原密码不正确');
    }
    db.update(adminUsers).set({ passwordHash: await bcrypt.hash(newPassword, 10) }).where(eq(adminUsers.id, user.id)).run();
    return { code: 0, data: null };
  });
}
