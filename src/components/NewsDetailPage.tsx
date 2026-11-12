import React from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import type { NewsItem } from '../App';

export interface NewsDetailPageProps {
  /** 当前文章：加载中或直达链接解析完成前为空 */
  article: NewsItem | null;
  loading?: boolean;
  onBack: () => void;
}

export const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ article, loading, onBack }) => {
  return (
    <div className="w-full bg-white text-[#222222]">
      {/* 顶部头图：与「新闻动态」列表页 Banner 完全一致，不随文章变化 */}
      <section className="relative w-full h-[400px] md:h-[460px] bg-[#111622] overflow-hidden select-none">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url('/assets/rezen/xwdt.webp')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#111622]/95" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-[#C59B3F]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-[1560px] mx-auto h-full px-6 lg:px-[80px] flex flex-col justify-end pb-14 md:pb-16 text-white z-10">
          <div className="flex flex-col items-start">
            <h2 className="hero-enter text-[32px] sm:text-[40px] md:text-[48px] font-bold tracking-[0.03em] leading-tight text-white">
              新闻动态
            </h2>
            <p className="hero-enter-sub mt-3 text-[14px] md:text-[16px] text-white/80 max-w-2xl font-light tracking-wide leading-relaxed">
              聚焦行业洞察 · 传递丽呈智旅最新动态与经营成果
            </p>
          </div>
        </div>
      </section>

      {/* 正文 */}
      <section className="w-full bg-white pt-10 md:pt-14 pb-20 md:pb-28">
        <div className="max-w-[900px] mx-auto px-6 lg:px-8">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-[14px] text-[#666666] hover:text-[#C59B3F] transition-colors cursor-pointer mb-8"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            返回新闻动态
          </button>

          {loading && !article ? (
            <div className="space-y-5 animate-pulse">
              <div className="w-24 h-6 rounded-full bg-[#F2F2F0]" />
              <div className="w-[85%] h-9 rounded bg-[#F2F2F0]" />
              <div className="w-[60%] h-9 rounded bg-[#F2F2F0]" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`h-4 rounded bg-[#F2F2F0] ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
              ))}
            </div>
          ) : article ? (
            <>
              {/* 文章分类与发布时间 */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="px-3 py-1 rounded-full text-[12px] font-medium bg-[#F5EEDB] text-[#9A7036] tracking-wide">
                  {article.category}
                </span>
                <span className="flex items-center gap-1.5 text-[13px] text-[#8A8A8A]">
                  <Calendar className="w-3.5 h-3.5" />
                  {article.date}
                </span>
              </div>

              {/* 文章标题 */}
              <h1 className="text-[24px] sm:text-[28px] md:text-[34px] font-bold leading-[1.4] text-[#111111] tracking-[0.01em]">
                {article.title}
              </h1>

              {/* 摘要 */}
              {article.summary && (
                <div className="mt-7 md:mt-8 p-5 md:p-6 rounded-xl bg-[#FAFAF8] border-l-4 border-[#C59B3F] text-[15px] md:text-[16px] text-[#444444] leading-[1.9]">
                  {article.summary}
                </div>
              )}

              {/* 正文：优先富文本，兜底段落数组 */}
              <div className="mt-8 md:mt-10">
                {article.contentHtml ? (
                  <div
                    className="text-[16px] md:text-[17px] text-[#2D2F33] leading-[2] [&_p]:mb-5 [&_img]:max-w-full [&_img]:rounded-xl [&_img]:my-6 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-5 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-8 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_blockquote]:border-l-4 [&_blockquote]:border-[#E8E6DF] [&_blockquote]:pl-5 [&_blockquote]:text-[#666666] [&_a]:text-[#C59B3F] [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                  />
                ) : (
                  <div className="space-y-5 text-[16px] md:text-[17px] text-[#2D2F33] leading-[2] tracking-[0.01em]">
                    {article.content.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-10">
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111111] text-white text-[14px] tracking-wide hover:bg-[#C59B3F] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  查看更多新闻
                </button>
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-[15px] text-[#777777]">
              该新闻不存在或已下线。
              <button type="button" onClick={onBack} className="ml-2 text-[#C59B3F] underline cursor-pointer">
                返回新闻动态
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
