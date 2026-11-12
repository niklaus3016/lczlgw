import React from 'react';

// ============================================================================
// 大数据工具赋能酒店经营 · 全链路集合赋能生态
// 1:1 官方原版结构与样式完全复刻 (源自 rezengroup.com/jiazhi.html)
// 使用官方原生纯净底图与真实资源，杜绝任何双重叠影
// ============================================================================

export const UPPER_PIPELINE_ITEMS = [
  '地块选址',
  '酒店设计',
  '产品选型定位',
  '工程筹建',
  '竞对分析',
  '智能定价',
  '经营策略',
  '客源渠道',
  '宣传包装',
];

export const LOWER_PIPELINE_ITEMS = [
  '价格指导',
  '价格趋势',
  '预估出租率',
  '市场热度',
  '经营分析',
  '运营预测',
  '可视化数据看板',
  '酒店诊断报告',
];

export const BigDataEmpowermentSection: React.FC<{ variant?: 'dark' | 'light' }> = ({ variant = 'dark' }) => {
  const isLight = variant === 'light';
  const textColor = isLight ? '#111111' : '#ffffff';
  const subTextColor = isLight ? '#1A1D24' : 'rgba(255,255,255,0.75)';
  const lineColor = isLight ? 'rgba(17,17,17,0.15)' : 'rgba(255, 255, 255, 0.45)';

  return (
    <section
      id="honors-and-awards"
      className={`relative w-full text-white select-none overflow-hidden ${isLight ? 'bg-white py-[64px] md:py-[80px]' : 'py-[80px] md:py-[100px]'}`}
      style={
        isLight
          ? undefined
          : {
              backgroundImage: `url('/assets/rezen/stjiazhi.webp')`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundColor: '#070D18',
            }
      }
    >
      <style>{`
        @keyframes rezenTurn {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .stjiazhimc-circle::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          width: 172px;
          height: 172px;
          margin: -86px 0 0 -86px;
          background: url('/assets/rezen/quanquan.png') center no-repeat;
          background-size: contain;
          animation: rezenTurn 3s linear infinite;
          pointer-events: none;
        }
        .stjiazhimc-circle--light::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          width: 176px;
          height: 176px;
          margin: -88px 0 0 -88px;
          background: url('/assets/rezen/quanquan.png') center no-repeat;
          background-size: contain;
          animation: rezenTurn 3s linear infinite;
          pointer-events: none;
        }
      `}</style>

      {/* 居中固定宽度容器 (官方标准 w1200) */}
      <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* 顶部标题行：亮色版与「季枫酒店布局」区块保持同一字号与居中版式 */}
        {isLight ? (
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-wide mb-2">
              REZEN系统
            </h2>
            <p className="text-xs md:text-sm text-gray-400 tracking-wider">
              丽呈自主研发的 All in One 一体化系统
            </p>
          </div>
        ) : (
          <div className="text-center">
            <h2
              className="text-[32px] md:text-[38px] font-bold tracking-[0.04em] leading-tight"
              style={{ color: textColor }}
            >
              赋能酒店数字化经营全流程
            </h2>
            <div className="w-12 h-[3px] bg-[#C59B3F] mx-auto mt-3.5 rounded-full" />
          </div>
        )}

        {/* 核心赋能主结构 */}
        <div className="w-full">
          {/* 贯穿副标题：从酒店选址 ─────── 到客人入住 */}
          <div
            className="mt-10 md:mt-12 flex items-center justify-between text-[20px] sm:text-[22px] md:text-[26px] font-bold tracking-[0.02em]"
            style={{ color: subTextColor }}
          >
            <span>从酒店选址</span>
            <span>到客人入住</span>
          </div>

          {/* 上轨：9 大前期选址与筹建获客节点 (地块选址 ~ 宣传包装) */}
          <ul
            className="mt-8 py-[25px] md:py-[30px] flex w-full justify-between items-center text-[14px] sm:text-[15px] md:text-[16px] list-none m-0 p-0 overflow-x-auto no-scrollbar"
            style={{
              borderTop: `1px solid ${lineColor}`,
              borderBottom: `1px solid ${lineColor}`,
            }}
          >
            {UPPER_PIPELINE_ITEMS.map((item, idx) => (
              <li
                key={idx}
                className="text-center shrink-0 px-2 sm:px-3 first:pl-0 last:pr-0"
              >
                <span
                  className="inline-block font-medium whitespace-nowrap transition-transform duration-200 hover:scale-105"
                  style={{
                    color: textColor,
                    paddingBottom: '22px',
                    backgroundImage: `url('/assets/rezen/stjiazhimbicon.png')`,
                    backgroundPosition: 'center bottom',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>

          {/* 中心枢纽：丽呈 R Logo + 旋转光环圈圈 + 集合赋能 */}
          <div className="my-8 md:my-10 text-center flex justify-center items-center">
            <div
              className={`${isLight ? 'stjiazhimc-circle--light' : 'stjiazhimc-circle'} relative inline-block text-center cursor-pointer transition-transform duration-300 hover:scale-105`}
              style={{
                width: isLight ? '184px' : '156px',
                height: isLight ? '184px' : '156px',
                paddingTop: isLight ? '128px' : '120px',
                paddingBottom: isLight ? '40px' : '36px',
                backgroundColor: isLight ? '#0F1523' : undefined,
                borderRadius: isLight ? '9999px' : undefined,
                backgroundImage: `url('/assets/rezen/stjiazhimclogo.svg')`,
                backgroundPosition: isLight ? 'center 60px' : 'center 45px',
                backgroundRepeat: 'no-repeat',
                backgroundSize: isLight ? '62px auto' : '60px auto',
              }}
            >
              <span className="text-[16px] font-bold text-white tracking-widest whitespace-nowrap drop-shadow-md">
                集合赋能
              </span>
            </div>
          </div>

          {/* 下轨：8 大日常运营与收益决策节点 (价格指导 ~ 酒店诊断报告) */}
          <ul
            className="py-[25px] md:py-[30px] flex w-full justify-between items-center text-[14px] sm:text-[15px] md:text-[16px] list-none m-0 p-0 overflow-x-auto no-scrollbar"
            style={{
              borderTop: `1px solid ${lineColor}`,
              borderBottom: `1px solid ${lineColor}`,
            }}
          >
            {LOWER_PIPELINE_ITEMS.map((item, idx) => (
              <li
                key={idx}
                className="text-center shrink-0 px-2 sm:px-4 first:pl-0 last:pr-0"
              >
                <span
                  className="inline-block font-medium whitespace-nowrap transition-transform duration-200 hover:scale-105"
                  style={{
                    color: textColor,
                    paddingBottom: '22px',
                    backgroundImage: `url('/assets/rezen/stjiazhimbicon.png')`,
                    backgroundPosition: 'center bottom',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
