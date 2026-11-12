// 通用工具函数

// ISO 时间转 'YYYY-MM-DD HH:mm'（UTC+8）
export function fmtTime(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d
    .toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(/\//g, '-');
}

export const REGIONS = ['华东', '华北', '华南', '西南', '华中', '西北', '东北'];

// 酒店设施选项：icon 与前台 HotelDirectoryPage 的图标映射一一对应
export const AMENITY_OPTIONS = [
  { icon: 'wifi', label: '免费 Wi-Fi' },
  { icon: 'parking', label: '停车场' },
  { icon: 'restaurant', label: '餐厅' },
  { icon: 'breakfast', label: '自助早餐' },
  { icon: 'bar', label: '大堂吧' },
  { icon: 'roomService', label: '24小时客房服务' },
  { icon: 'pool', label: '室内恒温泳池' },
  { icon: 'gym', label: '健身中心' },
  { icon: 'spa', label: '水疗中心' },
  { icon: 'sauna', label: '桑拿房' },
  { icon: 'hotSpring', label: '温泉' },
  { icon: 'meeting', label: '多功能宴会厅' },
  { icon: 'businessCenter', label: '商务中心' },
  { icon: 'kidsClub', label: '儿童俱乐部' },
  { icon: 'petFriendly', label: '宠物友好' },
  { icon: 'laundry', label: '洗衣服务' },
  { icon: 'airportShuttle', label: '接送机服务' },
  { icon: 'evCharging', label: '充电桩' },
  { icon: 'frontDesk', label: '24小时前台' },
  { icon: 'luggage', label: '行李寄存' },
  { icon: 'nonSmoking', label: '无烟房' },
  { icon: 'tv', label: '液晶电视' },
  { icon: 'bath', label: '独立卫浴' },
];
