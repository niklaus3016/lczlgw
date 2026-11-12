import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import bcrypt from 'bcryptjs';
import { config } from '../config.js';
import { nowIso } from '../lib/time.js';
import * as schema from './schema.js';

export const sqlite = new Database(config.dbFile);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });

/** 启动时自动建表（幂等） */
export function ensureTables() {
  sqlite.exec(`
CREATE TABLE IF NOT EXISTS banners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL,
  link TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  cover TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  tag TEXT,
  author TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status, published_at);
CREATE TABLE IF NOT EXISTS news_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS hotels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT '',
  diamond_rating REAL NOT NULL DEFAULT 0,
  address TEXT NOT NULL DEFAULT '',
  open_year TEXT NOT NULL DEFAULT '',
  rating_score TEXT NOT NULL DEFAULT '',
  rating_desc TEXT NOT NULL DEFAULT '',
  amenities TEXT NOT NULL DEFAULT '[]',
  phone TEXT NOT NULL DEFAULT '',
  price_range TEXT NOT NULL DEFAULT '',
  main_photo TEXT NOT NULL DEFAULT '{}',
  grid_photos TEXT NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  last_login_at TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  hotel_name TEXT,
  message TEXT,
  form_type TEXT NOT NULL DEFAULT 'upgrade',
  source_path TEXT NOT NULL DEFAULT '',
  referrer TEXT,
  utm TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
CREATE TABLE IF NOT EXISTS pageviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT NOT NULL,
  title TEXT,
  referrer TEXT,
  visitor_id TEXT NOT NULL,
  ip_hash TEXT NOT NULL DEFAULT '',
  ua TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_pageviews_created ON pageviews(created_at);
CREATE INDEX IF NOT EXISTS idx_pageviews_path ON pageviews(path);
  `);

  // 兼容已有数据库：新增酒店钻级字段，已有酒店默认 0 钻
  const hotelColumns = sqlite.prepare('PRAGMA table_info(hotels)').all() as { name: string }[];
  if (!hotelColumns.some((column) => column.name === 'diamond_rating')) {
    sqlite.exec('ALTER TABLE hotels ADD COLUMN diamond_rating REAL NOT NULL DEFAULT 0');
  }
}

/** 新闻分类：首次启动时用已有新闻数据回填，避免后台下拉为空 */
export function ensureNewsTaxonomy() {
  const { n } = sqlite.prepare('SELECT COUNT(*) AS n FROM news_categories').get() as { n: number };
  if (n > 0) return;
  const rows = sqlite
    .prepare("SELECT category AS name, COUNT(*) AS c FROM news WHERE category <> '' GROUP BY category ORDER BY c DESC")
    .all() as { name: string; c: number }[];
  const insert = sqlite.prepare('INSERT OR IGNORE INTO news_categories (name, sort_order, created_at) VALUES (?, ?, ?)');
  rows.forEach((r, idx) => insert.run(r.name, idx, nowIso()));
}

/** 首个管理员账号：仅在表为空时通过环境变量注入 */
export function ensureAdminUser() {
  const row = sqlite.prepare('SELECT COUNT(*) AS n FROM admin_users').get() as { n: number };
  if (row.n > 0) return;
  if (config.isProd && config.adminPassword === config.defaultAdminPassword) {
    console.warn('[安全警告] 生产环境正在使用默认管理员密码建号，仅限内部测试；正式对外前必须配置 ADMIN_PASSWORD');
  }
  sqlite
    .prepare('INSERT INTO admin_users (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)')
    .run(config.adminUsername, bcrypt.hashSync(config.adminPassword, 10), 'admin', nowIso());
  console.log(`[init] 已创建管理员账号：${config.adminUsername}（请登录后尽快修改密码）`);
}
