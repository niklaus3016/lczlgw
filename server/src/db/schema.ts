import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

/** 首页轮播 Banner */
export const banners = sqliteTable('banners', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull().default(''),
  image: text('image').notNull(),
  link: text('link'),
  sortOrder: integer('sort_order').notNull().default(0),
  enabled: integer('enabled').notNull().default(1),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

/** 新闻动态（content 为富文本 HTML） */
export const news = sqliteTable('news', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  summary: text('summary').notNull().default(''),
  content: text('content').notNull().default(''),
  cover: text('cover').notNull().default(''),
  category: text('category').notNull().default(''),
  tag: text('tag'),
  author: text('author'),
  views: integer('views').notNull().default(0),
  status: text('status').notNull().default('draft'), // draft | published
  publishedAt: text('published_at').notNull().default(''),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

/** 新闻分类（前台新闻 Tab 与后台下拉选项的唯一来源） */
export const newsCategories = sqliteTable('news_categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull(),
});

/** 酒店名录（amenities/mainPhoto/gridPhotos 为 JSON 文本） */
export const hotels = sqliteTable('hotels', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  brand: text('brand').notNull().default(''),
  city: text('city').notNull().default(''),
  region: text('region').notNull().default(''),
  diamondRating: real('diamond_rating').notNull().default(0),
  address: text('address').notNull().default(''),
  openYear: text('open_year').notNull().default(''),
  ratingScore: text('rating_score').notNull().default(''),
  ratingDesc: text('rating_desc').notNull().default(''),
  amenities: text('amenities').notNull().default('[]'),
  phone: text('phone').notNull().default(''),
  priceRange: text('price_range').notNull().default(''),
  mainPhoto: text('main_photo').notNull().default('{}'),
  gridPhotos: text('grid_photos').notNull().default('[]'),
  sortOrder: integer('sort_order').notNull().default(0),
  status: text('status').notNull().default('published'), // published | hidden
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

/** 后台管理员账号 */
export const adminUsers = sqliteTable('admin_users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('admin'),
  lastLoginAt: text('last_login_at'),
  createdAt: text('created_at').notNull(),
});

/** 留资线索（合作加盟页表单 + 顶栏咨询弹窗） */
export const leads = sqliteTable('leads', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  hotelName: text('hotel_name'),
  message: text('message'),
  formType: text('form_type').notNull().default('upgrade'), // upgrade | develop | analysis | consult
  sourcePath: text('source_path').notNull().default(''),
  referrer: text('referrer'),
  utm: text('utm'), // JSON：utm_source / medium / campaign
  status: text('status').notNull().default('pending'), // pending | contacted
  createdAt: text('created_at').notNull(),
});

/** 访问统计原始事件 */
export const pageviews = sqliteTable('pageviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  path: text('path').notNull(),
  title: text('title'),
  referrer: text('referrer'),
  visitorId: text('visitor_id').notNull(),
  ipHash: text('ip_hash').notNull().default(''),
  ua: text('ua'),
  createdAt: text('created_at').notNull(),
});
