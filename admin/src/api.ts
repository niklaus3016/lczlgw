// 统一 API 封装：拼 data/code、401 跳登录、抛错带 message

export interface UserInfo {
  username: string;
  role: string;
  lastLoginAt: string | null;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
  sortOrder: number;
  enabled: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewsItem {
  id: number;
  title: string;
  summary?: string;
  content?: string;
  cover: string | null;
  category: string | null;
  tag: string | null;
  author: string | null;
  status: 'draft' | 'published';
  publishedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Amenity {
  icon: string;
  label: string;
}

export interface HotelPhoto {
  url: string;
  caption: string;
}

export interface Hotel {
  id: number;
  name: string;
  brand: string | null;
  city: string | null;
  region: string | null;
  diamondRating: number;
  address: string | null;
  openYear: string | null;
  ratingScore: string | null;
  ratingDesc: string | null;
  amenities: Amenity[];
  phone: string | null;
  priceRange: string | null;
  mainPhoto: HotelPhoto | null;
  gridPhotos: HotelPhoto[];
  sortOrder: number;
  status: 'published' | 'hidden';
}

export interface Lead {
  id: number;
  name: string;
  phone: string;
  hotelName: string | null;
  message: string | null;
  formType: 'upgrade' | 'develop' | 'analysis' | 'consult';
  sourcePath: string;
  referrer: string | null;
  utm: { source?: string; medium?: string; campaign?: string } | null;
  status: 'pending' | 'contacted';
  createdAt: string;
}

export interface Paged<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
}

export interface MetricCard {
  today: number;
  yesterday: number;
  deltaPct: number | null;
}

export interface StatsOverview {
  cards: { pv: MetricCard; uv: MetricCard; leads: MetricCard };
  trend: { day: string; pv: number; uv: number; leads: number }[];
  topPages: { path: string; name: string; pv: number; uv: number }[];
  topChannels: { channel: string; uv: number }[];
}

export interface AiStats {
  cards: { aiUv: number; aiUvPct: number; aiLeads: number; aiLeadRate: number };
  channels: { name: string; uv: number }[];
  details: { source: string; landingPath: string; landingName: string; uv: number; leads: number }[];
}

export class ApiError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

// 会话失效回调，由 App 注入，用于跳转登录页
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn;
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    credentials: 'same-origin',
    headers:
      options.body === undefined || options.body instanceof FormData
        ? undefined
        : { 'Content-Type': 'application/json' },
    ...options,
  });
  let body: { code: number; data?: T; message?: string };
  try {
    body = await res.json();
  } catch {
    throw new ApiError(res.status, `请求失败（${res.status}）`);
  }
  if (res.status === 401 && !url.includes('/auth/login')) {
    onUnauthorized?.();
    throw new ApiError(401, body.message || '登录已过期');
  }
  if (body.code !== 0) {
    throw new ApiError(body.code, body.message || '操作失败');
  }
  return body.data as T;
}

const qs = (params: Record<string, string | number | undefined>) => {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') p.set(k, String(v));
  });
  const s = p.toString();
  return s ? `?${s}` : '';
};

// ---------- 鉴权 ----------
export const authApi = {
  login: (username: string, password: string) =>
    request<UserInfo>('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => request<null>('/api/auth/logout', { method: 'POST' }),
  me: () => request<UserInfo>('/api/auth/me'),
};

// ---------- Banner ----------
export const bannerApi = {
  list: () => request<Banner[]>('/api/admin/banners'),
  create: (data: Partial<Banner>) => request<Banner>('/api/admin/banners', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Banner>) =>
    request<Banner>(`/api/admin/banners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number) => request<null>(`/api/admin/banners/${id}`, { method: 'DELETE' }),
  sort: (ids: number[]) => request<null>('/api/admin/banners/sort', { method: 'PUT', body: JSON.stringify({ ids }) }),
};

// ---------- 新闻 ----------
export interface NewsListResult extends Paged<NewsItem> {}
export const newsApi = {
  list: (params: { page: number; size: number; status?: string; q?: string }) =>
    request<NewsListResult>(`/api/admin/news${qs(params)}`),
  detail: (id: number) => request<NewsItem>(`/api/admin/news/${id}`),
  create: (data: Partial<NewsItem>) => request<NewsItem>('/api/admin/news', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<NewsItem>) =>
    request<NewsItem>(`/api/admin/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  setStatus: (id: number, status: 'draft' | 'published') =>
    request<null>(`/api/admin/news/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  remove: (id: number) => request<null>(`/api/admin/news/${id}`, { method: 'DELETE' }),
};

// ---------- 新闻分类 ----------
export interface TaxonomyItem {
  id: number;
  name: string;
  sortOrder: number;
  createdAt?: string;
}

export const newsCategoryApi = {
  list: () => request<TaxonomyItem[]>('/api/admin/news-categories'),
  create: (name: string, sortOrder = 0) =>
    request<{ id: number }>('/api/admin/news-categories', { method: 'POST', body: JSON.stringify({ name, sortOrder }) }),
  update: (id: number, name: string, sortOrder: number) =>
    request<null>(`/api/admin/news-categories/${id}`, { method: 'PUT', body: JSON.stringify({ name, sortOrder }) }),
  remove: (id: number) => request<null>(`/api/admin/news-categories/${id}`, { method: 'DELETE' }),
};

// ---------- 酒店 ----------
export const hotelApi = {
  list: () => request<Hotel[]>('/api/admin/hotels'),
  create: (data: Partial<Hotel>) => request<Hotel>('/api/admin/hotels', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Hotel>) =>
    request<Hotel>(`/api/admin/hotels/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: number) => request<null>(`/api/admin/hotels/${id}`, { method: 'DELETE' }),
};

// ---------- 线索 ----------
export interface LeadListResult extends Paged<Lead> {
  pendingCount: number;
}
export const leadApi = {
  list: (params: { page: number; size: number; status?: string; q?: string }) =>
    request<LeadListResult>(`/api/admin/leads${qs(params)}`),
  setStatus: (id: number, status: 'pending' | 'contacted') =>
    request<null>(`/api/admin/leads/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  remove: (id: number) => request<null>(`/api/admin/leads/${id}`, { method: 'DELETE' }),
};

// ---------- 统计 ----------
export const statsApi = {
  overview: (range: '7d' | '30d') => request<StatsOverview>(`/api/admin/stats/overview?range=${range}`),
  ai: (range: '7d' | '30d') => request<AiStats>(`/api/admin/stats/ai?range=${range}`),
};

// ---------- 上传 ----------
export async function uploadImage(file: File, opts?: { maxKb?: number }): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const url = opts?.maxKb ? `/api/admin/upload?maxKb=${opts.maxKb}` : '/api/admin/upload';
  const data = await request<{ path: string }>(url, { method: 'POST', body: fd });
  return data.path;
}

// ---------- 改密 ----------
export const passwordApi = {
  change: (oldPassword: string, newPassword: string) =>
    request<null>('/api/admin/password', { method: 'PUT', body: JSON.stringify({ oldPassword, newPassword }) }),
};
