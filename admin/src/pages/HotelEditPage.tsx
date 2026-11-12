import { useEffect, useRef, useState } from 'react';
import { hotelApi, uploadImage, type Hotel, type HotelPhoto } from '../api';
import ImageUpload from '../components/ImageUpload';
import DiamondRatingInput from '../components/DiamondRatingInput';
import { useToast } from '../components/Toast';
import { AMENITY_OPTIONS, REGIONS } from '../utils';

interface FormState {
  name: string;
  region: string;
  diamondRating: number;
  address: string;
  openYear: string;
  status: 'published' | 'hidden';
  mainPhoto: HotelPhoto;
  gridPhotos: HotelPhoto[];
  amenityIcons: string[];
}

const emptyForm: FormState = {
  name: '',
  region: '华东',
  diamondRating: 0,
  address: '',
  openYear: '',
  status: 'published',
  mainPhoto: { url: '', caption: '' },
  gridPhotos: [],
  amenityIcons: [],
};

export default function HotelEditPage({ id, onBack }: { id: number | 'new'; onBack: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(id === 'new');
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    hotelApi
      .list()
      .then((list) => {
        setHotels(list);
        if (id !== 'new') {
          const h = list.find((x) => x.id === id);
          if (h) {
            setForm({
              name: h.name,
              region: h.region || '华东',
              diamondRating: h.diamondRating ?? 0,
              address: h.address || '',
              openYear: h.openYear || '',
              status: h.status,
              mainPhoto: h.mainPhoto || { url: '', caption: '' },
              gridPhotos: h.gridPhotos || [],
              amenityIcons: (h.amenities || []).map((a) => a.icon),
            });
          } else {
            toast('酒店不存在', 'error');
          }
        }
        setLoaded(true);
      })
      .catch((e) => toast(e instanceof Error ? e.message : '加载失败', 'error'));
  }, [id, toast]);

  const save = async () => {
    if (!form.name.trim()) {
      setError('请填写酒店名称');
      return;
    }
    setError('');
    setSaving(true);
    try {
      // 品牌/城市/评分/评分描述/电话/价格区间/排序值已不在表单中出现，编辑时沿用原值
      const origin = id === 'new' ? undefined : hotels.find((h) => h.id === id);
      const payload = {
        name: form.name.trim(),
        brand: origin?.brand || '',
        city: origin?.city || '',
        ratingScore: origin?.ratingScore || '',
        ratingDesc: origin?.ratingDesc || '',
        phone: origin?.phone || '',
        priceRange: origin?.priceRange || '',
        region: form.region,
        diamondRating: form.diamondRating,
        address: form.address.trim(),
        openYear: form.openYear.trim(),
        sortOrder: origin?.sortOrder ?? 0,
        status: form.status,
        mainPhoto: form.mainPhoto.url ? form.mainPhoto : { url: '', caption: '' },
        gridPhotos: form.gridPhotos.filter((p) => p.url),
        amenities: AMENITY_OPTIONS.filter((a) => form.amenityIcons.includes(a.icon)),
      };
      if (id === 'new') {
        await hotelApi.create(payload);
        toast('创建成功');
      } else {
        await hotelApi.update(id, payload);
        toast('保存成功');
      }
      onBack();
    } catch (e) {
      toast(e instanceof Error ? e.message : '保存失败', 'error');
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#EE9B27]';

  const setGrid = (i: number, patch: Partial<HotelPhoto>) => {
    const next = [...form.gridPhotos];
    next[i] = { ...next[i], ...patch };
    setForm({ ...form, gridPhotos: next });
  };

  // 网格图拖拽排序（类似微信朋友圈编辑图片）：拖起某格后拖到目标格即插入到该位置
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [droppingIndex, setDroppingIndex] = useState<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const gridFileRef = useRef<HTMLInputElement>(null);
  const gridFileTarget = useRef<number | null>(null);

  const moveGrid = (from: number, to: number) => {
    if (from === to) return;
    setForm((prev) => {
      const next = [...prev.gridPhotos];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return { ...prev, gridPhotos: next };
    });
  };

  const pickGridFile = (index: number) => {
    gridFileTarget.current = index;
    gridFileRef.current?.click();
  };

  const handleGridFile = async (file?: File) => {
    const index = gridFileTarget.current;
    if (!file || index === null) return;
    if (!file.type.startsWith('image/')) {
      toast('请选择图片文件（JPG / PNG / WebP）', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast(`图片需小于 5MB，当前 ${(file.size / 1024 / 1024).toFixed(1)}MB`, 'error');
      return;
    }
    setUploadingIndex(index);
    try {
      const path = await uploadImage(file);
      setGrid(index, { url: path });
    } catch (e) {
      toast(e instanceof Error ? e.message : '上传失败', 'error');
    } finally {
      setUploadingIndex(null);
      gridFileTarget.current = null;
      if (gridFileRef.current) gridFileRef.current.value = '';
    }
  };

  if (!loaded) return <div className="text-sm text-gray-400">加载中…</div>;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#111622]">{id === 'new' ? '新建酒店' : '编辑酒店'}</h1>
        <button
          onClick={onBack}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          ← 返回列表
        </button>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-gray-600">
              酒店名称 <span className="text-red-500">*</span>
            </label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">区域</label>
            <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className={inputCls}>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">钻级</label>
            <DiamondRatingInput value={form.diamondRating} onChange={(value) => setForm({ ...form, diamondRating: value })} />
            <p className="mt-1 text-xs text-gray-400">左半为半钻，右半为整钻</p>
          </div>
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm text-gray-600">地址</label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">开业年份</label>
            <input
              value={form.openYear}
              onChange={(e) => setForm({ ...form, openYear: e.target.value })}
              placeholder="如：2009年开业"
              className={inputCls}
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-1 block text-sm text-gray-600">设施</label>
          <div className="flex flex-wrap gap-4">
            {AMENITY_OPTIONS.map((a) => (
              <label key={a.icon} className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={form.amenityIcons.includes(a.icon)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amenityIcons: e.target.checked
                        ? [...form.amenityIcons, a.icon]
                        : form.amenityIcons.filter((x) => x !== a.icon),
                    })
                  }
                  className="h-4 w-4 accent-[#EE9B27]"
                />
                {a.label}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-1 block text-sm text-gray-600">主图</label>
          <ImageUpload value={form.mainPhoto.url} onChange={(p) => setForm({ ...form, mainPhoto: { ...form.mainPhoto, url: p } })} />
          {form.mainPhoto.url && (
            <input
              value={form.mainPhoto.caption}
              onChange={(e) => setForm({ ...form, mainPhoto: { ...form.mainPhoto, caption: e.target.value } })}
              placeholder="主图说明"
              className={`${inputCls} mt-2`}
            />
          )}
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm text-gray-600">网格图（{form.gridPhotos.length}）</label>
            <button
              type="button"
              onClick={() => setForm({ ...form, gridPhotos: [...form.gridPhotos, { url: '', caption: '' }] })}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              + 添加图片
            </button>
          </div>
          <p className="mb-3 text-xs text-gray-400">每行 3 张，可按住图片拖拽调整顺序（与前台展示顺序一致）</p>
          <div className="grid grid-cols-3 gap-3">
            {form.gridPhotos.map((p, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragEnter={() => setDroppingIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIndex !== null) moveGrid(dragIndex, i);
                  setDragIndex(null);
                  setDroppingIndex(null);
                }}
                onDragEnd={() => {
                  setDragIndex(null);
                  setDroppingIndex(null);
                }}
                className={`relative rounded-lg border bg-white p-2 transition-opacity ${
                  dragIndex === i ? 'opacity-40' : 'opacity-100'
                } ${droppingIndex === i && dragIndex !== null ? 'border-[#EE9B27]' : 'border-gray-100'}`}
              >
                <div className="absolute left-2 top-2 z-10 rounded bg-black/60 px-1.5 py-0.5 text-[10px] leading-none text-white">
                  {i + 1}
                </div>
                <div className="absolute right-1 top-1 z-10 flex gap-1">
                  <button
                    type="button"
                    onClick={() => pickGridFile(i)}
                    className="rounded bg-white/90 px-1.5 py-0.5 text-[10px] leading-none text-gray-600 shadow-sm hover:text-[#EE9B27]"
                  >
                    更换
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, gridPhotos: form.gridPhotos.filter((_, x) => x !== i) })}
                    className="rounded bg-white/90 px-1.5 py-0.5 text-[10px] leading-none text-red-500 shadow-sm hover:bg-red-50"
                  >
                    删除
                  </button>
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => pickGridFile(i)}
                  className="flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded bg-gray-50 text-xs text-gray-400"
                >
                  {p.url ? (
                    <img src={p.url} alt="" className="h-full w-full object-cover" draggable={false} />
                  ) : uploadingIndex === i ? (
                    '上传中…'
                  ) : (
                    '点击上传'
                  )}
                </div>
                <input
                  value={p.caption}
                  onChange={(e) => setGrid(i, { caption: e.target.value })}
                  placeholder="图片说明（选填）"
                  className="mt-2 w-full rounded border border-gray-200 px-2 py-1 text-xs outline-none focus:border-[#EE9B27]"
                />
              </div>
            ))}
            {/* 空白占位：补足 6 格，与前台酒店详情页的网格图位一致 */}
            {form.gridPhotos.length < 6 &&
              Array.from({ length: 6 - form.gridPhotos.length }).map((_, i) => (
                <button
                  key={`empty-${i}`}
                  type="button"
                  onClick={() => setForm({ ...form, gridPhotos: [...form.gridPhotos, { url: '', caption: '' }] })}
                  className="flex aspect-[4/3] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 hover:border-[#EE9B27] hover:text-[#EE9B27]"
                >
                  <span className="text-xl leading-none">+</span>
                  <span className="mt-1 text-xs">添加图片</span>
                </button>
              ))}
          </div>
          <input
            ref={gridFileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => handleGridFile(e.target.files?.[0])}
          />
        </div>

        <div className="mt-5">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={form.status === 'published'}
              onChange={(e) => setForm({ ...form, status: e.target.checked ? 'published' : 'hidden' })}
              className="h-4 w-4 accent-[#EE9B27]"
            />
            发布上线（取消勾选则隐藏）
          </label>
        </div>

        {error && <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-500">{error}</div>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onBack}
            className="rounded-lg border border-gray-200 px-5 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-[#EE9B27] px-5 py-2 text-sm text-white hover:bg-[#F5A623] disabled:opacity-50"
          >
            {saving ? '保存中…' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
