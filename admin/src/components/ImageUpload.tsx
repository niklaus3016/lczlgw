import { useRef, useState } from 'react';
import { uploadImage } from '../api';
import { useToast } from './Toast';

// 图片上传字段：预览 + 点击选择文件
export default function ImageUpload({
  value,
  onChange,
  hint,
  maxSizeMb = 5,
}: {
  value: string;
  onChange: (path: string) => void;
  hint?: string;
  /** 体积上限（MB），同时作为前端预校验与后端 maxKb 参数 */
  maxSizeMb?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('请选择图片文件（JPG / PNG / WebP）', 'error');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      toast(`图片需小于 ${maxSizeMb}MB，当前 ${(file.size / 1024 / 1024).toFixed(1)}MB`, 'error');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    setUploading(true);
    try {
      const path = await uploadImage(file, { maxKb: maxSizeMb * 1024 });
      onChange(path);
      toast('上传成功');
    } catch (e) {
      toast(e instanceof Error ? e.message : '上传失败', 'error');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="预览" className="aspect-video w-40 rounded-lg border border-gray-200 object-cover" />
        ) : (
          <div className="flex aspect-video w-40 items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-400">
            暂无图片
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg border border-[#EE9B27] px-3 py-1.5 text-sm text-[#EE9B27] hover:bg-[#EE9B27]/10 disabled:opacity-50"
        >
          {uploading ? '上传中…' : value ? '更换图片' : '上传图片'}
        </button>
      </div>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
