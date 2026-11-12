import Fastify from 'fastify';
import fastifyCompress from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import fs from 'node:fs';
import path from 'node:path';
import { desc, eq } from 'drizzle-orm';
import { config } from './config.js';
import { db, ensureAdminUser, ensureNewsTaxonomy, ensureTables } from './db/index.js';
import { news } from './db/schema.js';
import { needsSeed, runSeed } from './db/seed.js';
import { ApiError } from './lib/errors.js';
import { SITE_ORIGIN, injectMeta, metaForPath, readIndexTemplate } from './lib/seo.js';
import { COOP_FAQ_JSONLD, LLMS_TXT, currentSiteUpdated, injectGeo, newsArticleJsonLd } from './lib/geoContent.js';
import { publicRoutes } from './routes/public.js';
import { authRoutes } from './routes/auth.js';
import { adminRoutes } from './routes/admin.js';

const app = Fastify({ logger: true, trustProxy: true, bodyLimit: 1024 * 1024 });

// 文本资源压缩：gzip / brotli，显著降低 JS、CSS、HTML 传输体积
await app.register(fastifyCompress, { global: true });
// 安全响应头：关闭 CSP（站点使用内联 JSON-LD/样式与外部字体，避免误伤）
await app.register(fastifyHelmet, {
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
});
await app.register(fastifyCookie);
await app.register(fastifyJwt, {
  secret: config.jwtSecret,
  cookie: { cookieName: 'rezen_admin_token', signed: false },
  sign: { expiresIn: '7d' },
});
// 全局上传上限 500MB（新闻视频）；图片在 /api/admin/upload 内另有 5MB 校验
await app.register(fastifyMultipart, { limits: { fileSize: 500 * 1024 * 1024, files: 1 } });
await app.register(fastifyRateLimit, { global: false });

// sendBeacon 可能以 text/plain 上报，尝试按 JSON 解析
app.addContentTypeParser('text/plain', { parseAs: 'string' }, (_req, body, done) => {
  try {
    done(null, JSON.parse(body as string));
  } catch {
    done(null, {});
  }
});

// 统一错误格式：{ code, message }
app.setErrorHandler((err, req, reply) => {
  if (err instanceof ApiError) {
    return reply.status(err.statusCode).send({ code: err.code, message: err.message });
  }
  const statusCode = (err as { statusCode?: number }).statusCode;
  if (statusCode === 429) {
    return reply.status(429).send({ code: 429, message: '请求过于频繁，请稍后再试' });
  }
  if (statusCode === 413) {
    return reply.status(413).send({ code: 413, message: '文件大小超出限制' });
  }
  req.log.error(err);
  return reply.status(500).send({ code: 500, message: '服务器内部错误' });
});

// 业务路由
await app.register(publicRoutes, { prefix: '/api' });
await app.register(authRoutes, { prefix: '/api/auth' });
await app.register(adminRoutes, { prefix: '/api/admin' });

// 静态资源：上传文件 / 官网构建产物 / 后台构建产物
const siteDir = path.join(config.publicDir, 'site');
const adminDir = path.join(config.publicDir, 'admin');

// 缓存策略：文件名带 hash 的构建产物长缓存，index.html 不缓存，其余资源短缓存。
// fastify-static 会先写入自己的 Cache-Control，这里在 onSend 阶段统一覆盖。
app.addHook('onSend', async (req, reply, payload) => {
  const url = (req.raw.url || '').split('?')[0];
  // 上传视频会在压缩完成后同路径替换，必须协商缓存，避免浏览器继续持有压缩前的版本。
  if (/^\/uploads\/.*\.mp4$/i.test(url)) reply.header('Cache-Control', 'no-cache');
  if (!url || url.startsWith('/api/') || url.startsWith('/uploads/')) return payload;
  const contentType = String(reply.getHeader('content-type') || '');
  if (/^\/assets\/[^/]+-[A-Za-z0-9_-]{8,}\.(js|css|woff2?)$/.test(url)) {
    // Vite 构建产物：文件名含内容 hash，可长缓存
    reply.header('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (url.startsWith('/assets/')) {
    // public 目录直接拷贝的固定文件名资源（品牌图 / 门店样例等）：内容可能被同名替换，
    // 必须走协商缓存，否则换图后访客浏览器一年内都看不到新图
    reply.header('Cache-Control', 'no-cache');
  } else if (
    url === '/' ||
    url === '/llms.txt' ||
    url.endsWith('.html') ||
    url.startsWith('/admin') ||
    contentType.includes('text/html')
  ) {
    // 所有 HTML（含 SPA 按路径回退的页面）都不缓存，保证页面级 meta 实时更新
    reply.header('Cache-Control', 'no-cache');
  } else {
    reply.header('Cache-Control', 'public, max-age=3600');
  }
  return payload;
});

await app.register(fastifyStatic, {
  root: config.uploadsDir,
  prefix: '/uploads/',
  decorateReply: false,
  maxAge: '7d',
  immutable: true,
});
if (fs.existsSync(siteDir)) {
  await app.register(fastifyStatic, {
    root: siteDir,
    prefix: '/',
    decorateReply: false,
  });
}
if (fs.existsSync(adminDir)) {
  await app.register(fastifyStatic, {
    root: adminDir,
    prefix: '/admin/',
    decorateReply: false,
  });
}

// 站点地图：静态页面 + 已发布新闻详情，供搜索引擎与 AI 爬虫发现全部内容
app.get('/sitemap.xml', async (_req, reply) => {
  const staticEntries = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/brands', priority: '0.9', changefreq: 'monthly' },
    { loc: '/jiameng', priority: '0.9', changefreq: 'monthly' },
    { loc: '/news', priority: '0.8', changefreq: 'weekly' },
    { loc: '/hotels', priority: '0.8', changefreq: 'weekly' },
    { loc: '/about', priority: '0.6', changefreq: 'monthly' },
    // 全部品牌详情页
    { loc: '/brands/jifeng-j', priority: '0.6', changefreq: 'monthly' },
    { loc: '/brands/jifeng-intl', priority: '0.6', changefreq: 'monthly' },
    { loc: '/brands/jifeng', priority: '0.6', changefreq: 'monthly' },
    { loc: '/brands/jifeng-resort', priority: '0.6', changefreq: 'monthly' },
    { loc: '/brands/grand-rezen', priority: '0.6', changefreq: 'monthly' },
    { loc: '/brands/rezen-huasheng', priority: '0.6', changefreq: 'monthly' },
    { loc: '/brands/rezen-huasheng-resort', priority: '0.6', changefreq: 'monthly' },
    { loc: '/brands/fuji-liya', priority: '0.6', changefreq: 'monthly' },
    { loc: '/brands/fuji-yazhi', priority: '0.6', changefreq: 'monthly' },
    { loc: '/brands/fuji-intl', priority: '0.6', changefreq: 'monthly' },
    { loc: '/brands/fuji-yuezhi', priority: '0.6', changefreq: 'monthly' },
    { loc: '/brands/balidao-intl', priority: '0.6', changefreq: 'monthly' },
    { loc: '/brands/balidao-resort', priority: '0.6', changefreq: 'monthly' },
    { loc: '/brands/balidao-holiday', priority: '0.6', changefreq: 'monthly' },
    { loc: '/brands/lizuan', priority: '0.6', changefreq: 'monthly' },
    { loc: '/brands/duozhi', priority: '0.6', changefreq: 'monthly' },
    { loc: '/brands/ctrip-farm', priority: '0.6', changefreq: 'monthly' },
    { loc: '/brands/new-world', priority: '0.6', changefreq: 'monthly' },
  ];
  const published = db
    .select({ id: news.id, publishedAt: news.publishedAt, updatedAt: news.updatedAt })
    .from(news)
    .where(eq(news.status, 'published'))
    .orderBy(desc(news.publishedAt), desc(news.id))
    .all();

  const toDate = (value: string) => (value || '').slice(0, 10);
  const urls = staticEntries.map(
    (e) =>
      `  <url>\n    <loc>${SITE_ORIGIN}${e.loc}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
  );
  for (const row of published) {
    const lastmod = toDate(row.updatedAt) || toDate(row.publishedAt);
    urls.unshift(
      `  <url>\n    <loc>${SITE_ORIGIN}/news/${row.id}</loc>\n${
        lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''
      }    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`,
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join(
    '\n',
  )}\n</urlset>\n`;
  return reply.type('application/xml; charset=utf-8').header('Cache-Control', 'public, max-age=3600').send(xml);
});

// llms.txt：面向 AI 爬虫的品牌说明书（品牌定义与官网逐字一致，末尾自动带最近更新日期）
app.get('/llms.txt', (_req, reply) => {
  reply
    .header('Cache-Control', 'no-cache')
    .type('text/plain; charset=utf-8')
    .send(`${LLMS_TXT}\n最后更新：${currentSiteUpdated()}\n`);
});

// 根路径首页：fastify-static 的 index 直接返回原始 index.html 会绕过注入，
// 这里显式注册精确路由（优先级高于静态通配符），保证首页同样带页面级 meta 与 GEO 正文
app.get('/', (_req, reply) => {
  const file = path.join(siteDir, 'index.html');
  if (!fs.existsSync(file)) {
    return reply.status(503).type('text/html; charset=utf-8').send('<h1>站点构建产物缺失</h1>');
  }
  const html = injectGeo(injectMeta(readIndexTemplate(file), metaForPath('/'), `${SITE_ORIGIN}/`), '/');
  return reply.header('Cache-Control', 'no-cache').type('text/html; charset=utf-8').send(html);
});

// SPA 回退与 404
app.setNotFoundHandler((req, reply) => {
  const url = req.raw.url || '';
  if (url.startsWith('/api/')) return reply.status(404).send({ code: 404, message: '接口不存在' });
  if (url.startsWith('/uploads/')) return reply.status(404).send({ code: 404, message: '文件不存在' });
  if (url.startsWith('/admin')) {
    const file = path.join(adminDir, 'index.html');
    if (fs.existsSync(file)) {
      return reply
        .header('Cache-Control', 'no-cache')
        .type('text/html')
        .send(fs.createReadStream(file));
    }
    return reply.status(503).type('text/html; charset=utf-8').send('<h1>管理后台尚未构建部署</h1>');
  }
  const file = path.join(siteDir, 'index.html');
  if (!fs.existsSync(file)) {
    return reply.status(503).type('text/html; charset=utf-8').send('<h1>站点构建产物缺失</h1>');
  }

  // 回退到官网 index.html，并按路径注入页面级 meta，
  // 让不执行 JavaScript 的搜索引擎 / AI 爬虫也能拿到正确的标题、描述与 canonical。
  const requestPath = (url.split('?')[0].replace(/\/+$/, '') || '/');
  const canonical = `${SITE_ORIGIN}${requestPath}`;

  if (requestPath.startsWith('/news/')) {
    const id = Number(requestPath.slice('/news/'.length).replace(/^api-/, ''));
    if (Number.isFinite(id) && id > 0) {
      const row = db
        .select({
          title: news.title,
          summary: news.summary,
          cover: news.cover,
          status: news.status,
          publishedAt: news.publishedAt,
          updatedAt: news.updatedAt,
        })
        .from(news)
        .where(eq(news.id, id))
        .get();
      if (row && row.status === 'published') {
        const html = injectGeo(
          injectMeta(
            readIndexTemplate(file),
            {
              title: `${row.title} | 丽呈智旅`,
              description: row.summary || row.title,
              type: 'article',
            },
            canonical,
            row.cover || undefined,
            newsArticleJsonLd({
              id,
              title: row.title,
              summary: row.summary || undefined,
              cover: row.cover || undefined,
              publishedAt: row.publishedAt,
              updatedAt: row.updatedAt,
            }),
          ),
          requestPath,
          {
            title: row.title,
            summary: row.summary || undefined,
            publishedAt: row.publishedAt,
            updatedAt: row.updatedAt,
          },
        );
        return reply.header('Cache-Control', 'no-cache').type('text/html; charset=utf-8').send(html);
      }
    }
  }

  // 已知路由正常回退（200），其余地址返回 404，避免搜索引擎把不存在页面当成有效内容
  const knownPath =
    /^\/(?:about|brands|jiameng|coop|advantages|coop-advantages|news|hotels|directory)?$/.test(requestPath) ||
    requestPath.startsWith('/brands/');
  const html = injectGeo(
    injectMeta(
      readIndexTemplate(file),
      metaForPath(requestPath),
      canonical,
      undefined,
      requestPath === '/jiameng' ? COOP_FAQ_JSONLD : undefined,
    ),
    requestPath,
  );
  return reply
    .status(knownPath ? 200 : 404)
    .header('Cache-Control', 'no-cache')
    .type('text/html; charset=utf-8')
    .send(html);
});

// 初始化：建表 → 管理员 → 空库时导入种子数据 → 回填新闻分类
ensureTables();
ensureAdminUser();
if (needsSeed()) {
  console.log('[seed] 数据库为空，开始导入初始数据...');
  runSeed();
}
ensureNewsTaxonomy();

await app.listen({ port: config.port, host: config.host });
console.log(`[server] 服务已启动：http://${config.host}:${config.port}`);
