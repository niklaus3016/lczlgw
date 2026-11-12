import { useState, type FormEvent } from 'react';
import { passwordApi } from '../api';
import { useToast } from '../components/Toast';

export default function PasswordPage() {
  const { toast } = useToast();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 强度提示：至少 8 位且含字母数字
  const strongEnough = newPassword.length >= 8 && /[a-zA-Z]/.test(newPassword) && /\d/.test(newPassword);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!oldPassword) {
      setError('请输入旧密码');
      return;
    }
    if (!strongEnough) {
      setError('新密码至少 8 位，且需包含字母和数字');
      return;
    }
    if (newPassword !== confirm) {
      setError('两次输入的新密码不一致');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await passwordApi.change(oldPassword, newPassword);
      toast('密码修改成功');
      setOldPassword('');
      setNewPassword('');
      setConfirm('');
    } catch (err) {
      toast(err instanceof Error ? err.message : '修改失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#EE9B27]';

  return (
    <div>
      <h1 className="mb-5 text-xl font-bold text-[#111622]">修改密码</h1>
      <div className="max-w-md rounded-xl bg-white p-6 shadow-sm">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-600">旧密码</label>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">新密码</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} />
            {newPassword && (
              <p className={`mt-1 text-xs ${strongEnough ? 'text-emerald-600' : 'text-gray-400'}`}>
                {strongEnough ? '✓ 密码强度符合要求' : '至少 8 位，需包含字母和数字'}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">确认新密码</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputCls} />
          </div>
          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-500">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[#EE9B27] px-5 py-2.5 text-sm text-white hover:bg-[#F5A623] disabled:opacity-50"
          >
            {loading ? '提交中…' : '确认修改'}
          </button>
        </form>
      </div>
    </div>
  );
}
