import { useState, type FormEvent } from 'react';
import { ApiError, authApi, type UserInfo } from '../api';

export default function LoginPage({ onLogin }: { onLogin: (user: UserInfo) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('请输入账号和密码');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await authApi.login(username.trim(), password);
      onLogin(user);
    } catch (err) {
      if (err instanceof ApiError && err.code === 423) {
        setError('账号已锁定，请稍后再试');
      } else if (err instanceof ApiError && err.code === 401) {
        setError('账号或密码错误');
      } else {
        setError(err instanceof Error ? err.message : '登录失败');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F6F3]">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="text-xl font-bold text-[#111622]">丽呈智旅 · 运营后台</div>
          <div className="mt-1 text-sm text-gray-400">携程旗下酒店数字化经营服务商</div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-600">账号</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#EE9B27]"
              placeholder="请输入账号"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#EE9B27]"
              placeholder="请输入密码"
            />
          </div>
          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-500">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#EE9B27] py-2.5 text-sm font-medium text-white hover:bg-[#F5A623] disabled:opacity-50"
          >
            {loading ? '登录中…' : '登 录'}
          </button>
        </form>
      </div>
    </div>
  );
}
