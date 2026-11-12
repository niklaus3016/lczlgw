import { useCallback, useEffect, useState } from 'react';
import { authApi, leadApi, setUnauthorizedHandler, type UserInfo } from './api';
import { ToastProvider, useToast } from './components/Toast';
import AiStatsPage from './pages/AiStatsPage';
import BannersPage from './pages/BannersPage';
import HotelEditPage from './pages/HotelEditPage';
import HotelsPage from './pages/HotelsPage';
import LeadsPage from './pages/LeadsPage';
import LoginPage from './pages/LoginPage';
import NewsEditPage from './pages/NewsEditPage';
import NewsListPage from './pages/NewsListPage';
import PasswordPage from './pages/PasswordPage';
import StatsPage from './pages/StatsPage';
import TaxonomyPage from './pages/TaxonomyPage';

type Page =
  | { key: 'leads' }
  | { key: 'stats' }
  | { key: 'ai' }
  | { key: 'banners' }
  | { key: 'news' }
  | { key: 'news-edit'; id: number | 'new' }
  | { key: 'news-categories' }
  | { key: 'hotels' }
  | { key: 'hotel-edit'; id: number | 'new' }
  | { key: 'password' };

const NAV_ITEMS = [
  { key: 'leads', label: '留资线索' },
  { key: 'banners', label: 'Banner 管理' },
  { key: 'news', label: '新闻管理' },
  { key: 'hotels', label: '酒店管理' },
  { key: 'stats', label: '访问统计' },
  { key: 'ai', label: 'AI 流量归因' },
  { key: 'password', label: '修改密码' },
] as const;

function Shell({ user, onLogout }: { user: UserInfo; onLogout: () => void }) {
  const { toast } = useToast();
  const [page, setPage] = useState<Page>({ key: 'leads' });
  const [pendingCount, setPendingCount] = useState(0);

  // 刷新待回访徽标
  const refreshPending = useCallback(async () => {
    try {
      const res = await leadApi.list({ page: 1, size: 1 });
      setPendingCount(res.pendingCount);
    } catch {
      // 忽略静默失败
    }
  }, []);

  useEffect(() => {
    refreshPending();
  }, [refreshPending]);

  const activeKey =
    page.key === 'news-edit' || page.key === 'news-categories'
      ? 'news'
      : page.key === 'hotel-edit'
        ? 'hotels'
        : page.key;

  const renderPage = () => {
    switch (page.key) {
      case 'leads':
        return <LeadsPage onPendingChange={setPendingCount} />;
      case 'stats':
        return <StatsPage />;
      case 'ai':
        return <AiStatsPage />;
      case 'banners':
        return <BannersPage />;
      case 'news':
        return (
          <NewsListPage
            onEdit={(id) => setPage({ key: 'news-edit', id })}
            onManageCategories={() => setPage({ key: 'news-categories' })}
          />
        );
      case 'news-edit':
        return <NewsEditPage id={page.id} onBack={() => setPage({ key: 'news' })} />;
      case 'news-categories':
        return <TaxonomyPage onBack={() => setPage({ key: 'news' })} />;
      case 'hotels':
        return <HotelsPage onEdit={(id) => setPage({ key: 'hotel-edit', id })} />;
      case 'hotel-edit':
        return <HotelEditPage id={page.id} onBack={() => setPage({ key: 'hotels' })} />;
      case 'password':
        return <PasswordPage />;
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // 即使失败也强制登出
    }
    onLogout();
  };

  return (
    <div className="flex min-h-screen">
      {/* 左侧深色导航 */}
      <aside className="fixed inset-y-0 left-0 w-[220px] bg-[#111622] text-white">
        <div className="border-b border-white/10 px-5 py-5">
          <div className="text-base font-bold">丽呈智旅</div>
          <div className="mt-0.5 text-xs text-white/50">运营管理后台</div>
        </div>
        <nav className="mt-2 px-3">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setPage({ key: item.key } as Page)}
              className={`mt-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                activeKey === item.key ? 'bg-[#EE9B27] text-white' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <span>{item.label}</span>
              {item.key === 'leads' && pendingCount > 0 && (
                <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[11px] leading-none text-white">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* 右侧内容区 */}
      <div className="ml-[220px] flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-3">
          <div className="text-sm text-gray-500">丽呈智旅运营后台</div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-600">
              当前账号：<span className="font-medium text-[#111622]">{user.username}</span>
            </span>
            <button
              onClick={() => {
                window.open('/api/admin/export', '_blank');
                toast('数据备份导出已开始下载');
              }}
              className="rounded-lg border border-[#EE9B27] px-3 py-1.5 text-[#EE9B27] hover:bg-[#EE9B27]/10"
            >
              导出数据备份
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:bg-gray-50"
            >
              退出登录
            </button>
          </div>
        </header>
        <main className="flex-1 p-6">{renderPage()}</main>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState<'loading' | 'anon' | 'authed'>('loading');
  const [user, setUser] = useState<UserInfo | null>(null);

  // 启动时校验会话
  useEffect(() => {
    authApi
      .me()
      .then((u) => {
        setUser(u);
        setSession('authed');
      })
      .catch(() => setSession('anon'));
  }, []);

  // 401 统一跳登录
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setSession('anon');
    });
  }, []);

  return (
    <ToastProvider>
      {session === 'loading' && (
        <div className="flex min-h-screen items-center justify-center text-sm text-gray-400">加载中…</div>
      )}
      {session === 'anon' && (
        <LoginPage
          onLogin={(u) => {
            setUser(u);
            setSession('authed');
          }}
        />
      )}
      {session === 'authed' && user && <Shell user={user} onLogout={() => setSession('anon')} />}
    </ToastProvider>
  );
}
