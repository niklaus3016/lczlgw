import Modal from './Modal';

// 删除等危险操作的二次确认弹窗
export default function ConfirmDialog({
  title = '确认删除',
  message,
  onConfirm,
  onCancel,
  loading,
}: {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-gray-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          取消
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? '处理中…' : '确认删除'}
        </button>
      </div>
    </Modal>
  );
}
