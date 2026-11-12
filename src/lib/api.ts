/**
 * 官网运行时取数层：从后端 API 拉取 Banner / 新闻 / 酒店数据。
 * 所有函数失败时返回 null，由调用方降级到内置静态数据，保证官网永远可打开。
 */

export interface ApiBanner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link: string | null;
  sortOrder: number;
  enabled: number;
}

export interface ApiNewsSummary {
  id: number;
  title: string;
  summary: string;
  cover: string;
  category: string;
  tag: string | null;
  author: string | null;
  views: number;
  publishedAt: string;
}

export interface ApiNewsDetail extends ApiNewsSummary {
  content: string; // 富文本 HTML
}

export interface ApiNewsListResult {
  list: ApiNewsSummary[];
  total: number;
  page: number;
  size: number;
}

export interface ApiHotelPhoto {
  url: string;
  caption: string;
}

export interface ApiHotel {
  id: number;
  name: string;
  brand: string;
  city: string;
  region: string;
  diamondRating: number;
  address: string;
  openYear: string;
  ratingScore: string;
  ratingDesc: string;
  amenities: { icon: string; label: string }[];
  phone: string;
  priceRange: string;
  mainPhoto: ApiHotelPhoto;
  gridPhotos: ApiHotelPhoto[];
  sortOrder: number;
  status: string;
}

async function get<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.code !== 0) return null;
    return json.data as T;
  } catch {
    return null;
  }
}

export const fetchBanners = () => get<ApiBanner[]>('/api/banners');

export const fetchNewsList = (page = 1, size = 50, category?: string) =>
  get<ApiNewsListResult>(
    `/api/news?page=${page}&size=${size}${category ? `&category=${encodeURIComponent(category)}` : ''}`,
  );

export const fetchNewsDetail = (id: number) => get<ApiNewsDetail>(`/api/news/${id}`);

/** 新闻分类（后台「分类管理」维护，用于前台筛选 Tab） */
export const fetchNewsCategories = () => get<{ id: number; name: string }[]>('/api/news/categories');

export const fetchHotels = () => get<ApiHotel[]>('/api/hotels');
