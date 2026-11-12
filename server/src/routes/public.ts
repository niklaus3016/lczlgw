import type { FastifyInstance } from 'fastify';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import { db } from '../db/index.js';
import { banners, hotels, leads, news, newsCategories, pageviews } from '../db/schema.js';
import { config } from '../config.js';
import { ApiError, parseBody } from '../lib/errors.js';
import { nowIso } from '../lib/time.js';
import { pushLeadToWecom } from '../lib/wecom.js';
import { pushLeadToDingTalk } from '../lib/dingtalk.js';

const leadSchema = z.object({
  name: z.string().trim().min(1, '请填写联系人称呼').max(50, '称呼过长'),
  phone: z
    .string()
    .trim()
    .regex(/^(1[3-9]\d{9}|0\d{2,3}-?\d{7,8})$/, '请填写正确的联系电话'),
  hotelName: z.string().trim().max(100).nullish(),
  message: z.string().trim().max(500, '留言最多 500 字').nullish(),
  formType: z.enum(['upgrade', 'develop', 'analysis', 'consult']).default('upgrade'),
  sourcePath: z.string().max(200).default(''),
  referrer: z.string().max(500).nullish(),
  utm: z
    .object({
      source: z.string().max(100).optional(),
      medium: z.string().max(100).optional(),
      campaign: z.string().max(100).optional(),
    })
    .nullish(),
});

const trackSchema = z.object({
  path: z.string().min(1).max(200),
  title: z.string().max(200).nullish(),
  referrer: z.string().max(500).nullish(),
  visitorId: z.string().min(6).max(64),
});

/** 酒店行 → 前端结构（解析 JSON 字段） */
function hotelToJson(h: typeof hotels.$inferSelect) {
  return {
    ...h,
    amenities: JSON.parse(h.amenities || '[]'),
    mainPhoto: JSON.parse(h.mainPhoto || '{}'),
    gridPhotos: JSON.parse(h.gridPhotos || '[]'),
  };
}

export async function publicRoutes(app: FastifyInstance) {
  // 健康检查（Sealos 探活用）
  app.get('/health', async () => ({ code: 0, data: { status: 'up' } }));

  // 首页 Banner（已上架，按排序）
  app.get('/banners', async (_req, reply) => {
    reply.header('Cache-Control', 'no-store');
    const list = db
      .select()
      .from(banners)
      .where(eq(banners.enabled, 1))
      .orderBy(asc(banners.sortOrder), asc(banners.id))
      .all();
    return { code: 0, data: list };
  });

  // 新闻分类（前台筛选 Tab）
  app.get('/news/categories', async (_req, reply) => {
    reply.header('Cache-Control', 'no-store');
    const list = db
      .select({ id: newsCategories.id, name: newsCategories.name })
      .from(newsCategories)
      .orderBy(asc(newsCategories.sortOrder), asc(newsCategories.id))
      .all();
    return { code: 0, data: list };
  });

  // 新闻分页列表（不含正文）
  app.get('/news', async (req, reply) => {
    reply.header('Cache-Control', 'no-store');
    const q = req.query as { page?: string; size?: string; category?: string };
    const page = Math.max(1, Number(q.page) || 1);
    const size = Math.min(50, Math.max(1, Number(q.size) || 10));
    const conds = [eq(news.status, 'published')];
    if (q.category) conds.push(eq(news.category, q.category));
    const where = and(...conds);
    const total = db.select({ count: sql<number>`count(*)` }).from(news).where(where).get()!.count;
    const list = db
      .select({
        id: news.id,
        title: news.title,
        summary: news.summary,
        cover: news.cover,
        category: news.category,
        tag: news.tag,
        author: news.author,
        views: news.views,
        publishedAt: news.publishedAt,
      })
      .from(news)
      .where(where)
      .orderBy(desc(news.publishedAt), desc(news.id))
      .limit(size)
      .offset((page - 1) * size)
      .all();
    return { code: 0, data: { list, total, page, size } };
  });

  // 新闻详情（阅读量 +1）
  app.get('/news/:id', async (req) => {
    const id = Number((req.params as { id: string }).id);
    const row = db.select().from(news).where(eq(news.id, id)).get();
    if (!row || row.status !== 'published') {
      throw new ApiError(404, 404, '新闻不存在或未发布');
    }
    db.update(news).set({ views: row.views + 1 }).where(eq(news.id, id)).run();
    return { code: 0, data: { ...row, views: row.views + 1 } };
  });

  // 酒店名录（已发布，支持区域/品牌/城市筛选）
  app.get('/hotels', async (req, reply) => {
    reply.header('Cache-Control', 'no-store');
    const q = req.query as { region?: string; brand?: string; city?: string };
    const conds = [eq(hotels.status, 'published')];
    if (q.region) conds.push(eq(hotels.region, q.region));
    if (q.brand) conds.push(eq(hotels.brand, q.brand));
    if (q.city) conds.push(eq(hotels.city, q.city));
    const list = db
      .select()
      .from(hotels)
      .where(and(...conds))
      .all()
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    return { code: 0, data: list.map(hotelToJson) };
  });

  // 留资线索提交（限流：每 IP 每分钟 3 次）
  app.post(
    '/leads',
    { config: { rateLimit: { max: 3, timeWindow: '1 minute' } } },
    async (req) => {
      const body = parseBody(leadSchema, req.body);
      const row = {
        name: body.name,
        phone: body.phone,
        hotelName: body.hotelName || null,
        message: body.message || null,
        formType: body.formType,
        sourcePath: body.sourcePath || '',
        referrer: body.referrer || null,
        utm: body.utm ? JSON.stringify(body.utm) : null,
        status: 'pending',
        createdAt: nowIso(),
      };
      const result = db.insert(leads).values(row).run();
      // 异步推送群机器人，失败不影响提交结果
      void pushLeadToWecom(row).catch(() => {});
      void pushLeadToDingTalk(row).catch(() => {});
      return { code: 0, data: { id: Number(result.lastInsertRowid) } };
    },
  );

  // 页面访问上报（前端 sendBeacon；/admin 路径不上报由前端保证，服务端再兜底一次）
  app.post('/track', async (req) => {
    const body = parseBody(trackSchema, req.body);
    if (body.path.startsWith('/admin')) return { code: 0, data: null };
    const ipHash = createHash('sha256').update(`${req.ip}|${config.jwtSecret}`).digest('hex').slice(0, 24);
    db.insert(pageviews)
      .values({
        path: body.path,
        title: body.title || null,
        referrer: body.referrer || null,
        visitorId: body.visitorId,
        ipHash,
        ua: (req.headers['user-agent'] || '').slice(0, 300),
        createdAt: nowIso(),
      })
      .run();
    return { code: 0, data: null };
  });
}
