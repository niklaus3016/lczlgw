import React, { useState, useMemo, useEffect } from 'react';
import {
  Wifi,
  Car,
  UtensilsCrossed,
  Waves,
  Dumbbell,
  Briefcase,
  Sparkles,
  MapPin,
  Search,
  Calendar,
  X,
  Coffee,
  Wine,
  ConciergeBell,
  Flame,
  Droplets,
  Building2,
  Baby,
  Dog,
  Shirt,
  Plane,
  PlugZap,
  Clock,
  Luggage,
  CigaretteOff,
  Tv,
  Bath,
} from 'lucide-react';
import { fetchHotels } from '../lib/api';
import DiamondRating from './DiamondRating';

export interface HotelDirectoryPageProps {
  onNavigateHome: (targetAnchor?: string) => void;
}

export interface HotelPhoto {
  url: string;
  caption: string;
}

export interface HotelShowcaseItem {
  id: string;
  name: string;
  brand: string;
  city: string;
  region: '华东' | '华北' | '华南' | '西南' | '华中' | '西北' | '东北';
  diamondRating?: number;
  address: string;
  openYear: string;
  ratingScore: string; // e.g. "好4.6"
  ratingDesc: string;
  amenities: { icon: string; label: string }[];
  phone: string;
  priceRange: string;
  mainPhoto: HotelPhoto;
  gridPhotos: HotelPhoto[]; // 6 photos: [tower, kingBed, dining, pool, family, suite]
}

export const HOTEL_DIRECTORY_LIST: HotelShowcaseItem[] = [
  {
    id: 'dalian-new-world',
    name: '大连新世界酒店',
    brand: '丽呈联合',
    city: '大连',
    region: '东北',
    address: '人民路41号新世界酒店',
    openYear: '2009年开业 · 2024年全面焕新升级',
    ratingScore: '好4.6',
    ratingDesc: '超棒·地理位置优越·服务热情',
    amenities: [
      { icon: 'wifi', label: 'Wifi' },
      { icon: 'parking', label: '停车场' },
      { icon: 'restaurant', label: '餐厅' },
      { icon: 'pool', label: '室内恒温泳池' },
      { icon: 'gym', label: '健身中心' },
      { icon: 'meeting', label: '多功能宴会厅' },
    ],
    phone: '0411-88078888',
    priceRange: '¥ 680 起',
    mainPhoto: {
      url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=85',
      caption: '大连新世界酒店 · 正门门廊与落客区',
    },
    gridPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
        caption: '都会天际线塔楼外观',
      },
      {
        url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        caption: '豪华典雅行政大床房',
      },
      {
        url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
        caption: '品味珍馐 VIP独立包房',
      },
      {
        url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
        caption: '自然采光穹顶室内恒温泳池',
      },
      {
        url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
        caption: '温馨童趣亲子家庭套房',
      },
      {
        url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        caption: '全景行政套房会客区',
      },
    ],
  },
  {
    id: 'shanghai-grand-rezen',
    name: '上海陆家嘴丽呈华廷酒店',
    brand: '丽呈华廷酒店',
    city: '上海',
    region: '华东',
    address: '上海市浦东新区源深路158号（近世纪大道金融中心）',
    openYear: '2021年开业',
    ratingScore: '好4.9',
    ratingDesc: '奢华典范·陆家嘴核心地标·宴会首选',
    amenities: [
      { icon: 'wifi', label: 'Wifi' },
      { icon: 'parking', label: '停车场(带充电桩)' },
      { icon: 'restaurant', label: '四季淮扬中餐厅' },
      { icon: 'pool', label: '云端恒温泳池' },
      { icon: 'gym', label: '健身中心' },
      { icon: 'meeting', label: '800㎡无柱宴会厅' },
    ],
    phone: '021-50504888',
    priceRange: '¥ 980 起',
    mainPhoto: {
      url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85',
      caption: '上海陆家嘴丽呈华廷酒店 · 宏伟主楼门面',
    },
    gridPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
        caption: '陆家嘴摩天云端夜景',
      },
      {
        url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
        caption: '东方美学至臻豪华套房',
      },
      {
        url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
        caption: '四季淮扬主厨品鉴美馔包厢',
      },
      {
        url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
        caption: '高空无边际恒温泳池',
      },
      {
        url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
        caption: '雅致私密全服务行政酒廊',
      },
      {
        url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        caption: '豪华云端全景浴缸套房',
      },
    ],
  },
  {
    id: 'hefei-rezen-retreat',
    name: '合肥天鹅湖丽呈别院',
    brand: '丽呈别院',
    city: '合肥',
    region: '华东',
    address: '安徽省合肥市蜀山区天鹅湖东路88号（天鹅湖公园畔）',
    openYear: '2023年开业',
    ratingScore: '好4.8',
    ratingDesc: '湖景私汤·东方禅意·度假胜地',
    amenities: [
      { icon: 'wifi', label: 'Wifi' },
      { icon: 'parking', label: '停车场' },
      { icon: 'restaurant', label: '东方私房食肆' },
      { icon: 'pool', label: '私享天然汤池' },
      { icon: 'meeting', label: '禅意雅集室' },
    ],
    phone: '0551-65889988',
    priceRange: '¥ 720 起',
    mainPhoto: {
      url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85',
      caption: '合肥天鹅湖丽呈别院 · 临水隐逸建筑群落',
    },
    gridPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        caption: '宋风水榭枕水而眠全景',
      },
      {
        url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        caption: '一房一景私汤庭院套房',
      },
      {
        url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
        caption: '时令非遗在地养生食席',
      },
      {
        url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
        caption: '户外山水露天恒温风吕',
      },
      {
        url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
        caption: '禅茶雅舍香道沉浸空间',
      },
      {
        url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        caption: '观湖景深沉静冥想茶寮',
      },
    ],
  },
  {
    id: 'chengdu-rezen-hotel',
    name: '成都春熙路太古里丽呈酒店',
    brand: '丽呈酒店',
    city: '成都',
    region: '西南',
    address: '成都市锦江区大业路6号（近IFS国金中心与春熙路地铁口）',
    openYear: '2022年开业',
    ratingScore: '好4.7',
    ratingDesc: '核心口岸·时尚潮奢·春熙路商圈',
    amenities: [
      { icon: 'wifi', label: 'Wifi' },
      { icon: 'parking', label: '智能停车场' },
      { icon: 'restaurant', label: '巴蜀特色全日餐吧' },
      { icon: 'gym', label: '24小时智能健身舱' },
      { icon: 'meeting', label: '灵动商务会议室' },
    ],
    phone: '028-86667788',
    priceRange: '¥ 530 起',
    mainPhoto: {
      url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=85',
      caption: '成都春熙路丽呈酒店 · 潮流街区现代立面',
    },
    gridPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
        caption: '春熙路繁华市井夜景俯瞰',
      },
      {
        url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
        caption: '轻奢智能商务大床客房',
      },
      {
        url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
        caption: '川味特色早午餐复合餐厅',
      },
      {
        url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
        caption: '大堂灵动商务共享洽谈舱',
      },
      {
        url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
        caption: '自适应智能温控舒眠双床房',
      },
      {
        url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        caption: '都会夜景落地窗尊享套房',
      },
    ],
  },
  {
    id: 'shenzhen-rezen-apt',
    name: '深圳南山科技园丽呈公寓',
    brand: '丽呈公寓',
    city: '深圳',
    region: '华南',
    address: '深圳市南山区科苑南路3099号高新科技园南区',
    openYear: '2023年开业',
    ratingScore: '好4.8',
    ratingDesc: '科技极简·长短租首选·腾讯大厦旁',
    amenities: [
      { icon: 'wifi', label: 'Wifi' },
      { icon: 'parking', label: '专属车位' },
      { icon: 'restaurant', label: '高空轻食咖啡厅' },
      { icon: 'gym', label: '全景观景健身房' },
      { icon: 'meeting', label: '共享商务路演中心' },
    ],
    phone: '0755-86689988',
    priceRange: '¥ 620 起',
    mainPhoto: {
      url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1400&q=85',
      caption: '深圳南山科技园丽呈公寓 · 现代化玻璃幕墙大厦',
    },
    gridPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
        caption: '深圳湾科技园璀璨夜景',
      },
      {
        url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
        caption: '全配置开放式厨房套房',
      },
      {
        url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
        caption: '云端图书会客行政酒廊',
      },
      {
        url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
        caption: '24小时智能自主洗烘房',
      },
      {
        url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
        caption: '科技菁英两室一厅家庭套房',
      },
      {
        url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        caption: '高空无遮挡海景大开间',
      },
    ],
  },
  {
    id: 'hangzhou-westlake-retreat',
    name: '杭州西湖灵隐丽呈别院',
    brand: '丽呈别院',
    city: '杭州',
    region: '华东',
    address: '杭州市西湖区灵隐支路白乐桥118号（紧邻灵隐寺古刹）',
    openYear: '2021年开业',
    ratingScore: '好4.9',
    ratingDesc: '隐世幽居·茶园漫步·灵隐古道',
    amenities: [
      { icon: 'wifi', label: 'Wifi' },
      { icon: 'parking', label: '生态停车位' },
      { icon: 'restaurant', label: '素斋与江南茶席' },
      { icon: 'pool', label: '天然山泉汤池' },
      { icon: 'meeting', label: '禅茶雅集研讨阁' },
    ],
    phone: '0571-87986688',
    priceRange: '¥ 880 起',
    mainPhoto: {
      url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85',
      caption: '杭州西湖灵隐丽呈别院 · 白乐桥山林隐居',
    },
    gridPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        caption: '雨后灵隐茶山雾景清幽',
      },
      {
        url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
        caption: '原木暖色景观私汤雅舍',
      },
      {
        url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
        caption: '龙井时令春笋江南精致素筵',
      },
      {
        url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
        caption: '古朴回廊与庭院山石叠景',
      },
      {
        url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
        caption: '山风拂面观景露台套房',
      },
      {
        url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        caption: '静心抄经禅修专属多功能阁',
      },
    ],
  },
  {
    id: 'wuhan-rezen-select',
    name: '武汉光谷丽呈睿轩酒店',
    brand: '丽呈睿轩酒店',
    city: '武汉',
    region: '华中',
    address: '武汉市洪山区光谷创业街特1号（近光谷步行街）',
    openYear: '2023年开业',
    ratingScore: '好4.7',
    ratingDesc: '新潮灵动·日咖夜酒·光谷硅谷核心',
    amenities: [
      { icon: 'wifi', label: 'Wifi' },
      { icon: 'parking', label: '停车场' },
      { icon: 'restaurant', label: '日咖夜酒灵动餐吧' },
      { icon: 'gym', label: '智能健身舱' },
      { icon: 'meeting', label: '高清视讯会议室' },
    ],
    phone: '027-87776655',
    priceRange: '¥ 460 起',
    mainPhoto: {
      url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=85',
      caption: '武汉光谷丽呈睿轩酒店 · 灵动未来感门厅',
    },
    gridPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
        caption: '光谷科创新城繁华车流',
      },
      {
        url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
        caption: '极简北欧风舒适商务客房',
      },
      {
        url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
        caption: '日咖夜酒复合灵动社交大堂',
      },
      {
        url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
        caption: '全自动智能机器人送物终端',
      },
      {
        url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
        caption: '无感人脸识别智慧客房',
      },
      {
        url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        caption: '时尚双床复合社交套房',
      },
    ],
  },
  {
    id: 'xian-grand-rezen',
    name: '西安钟楼南门丽呈华廷酒店',
    brand: '丽呈华廷酒店',
    city: '西安',
    region: '西北',
    address: '西安市碑林区南大街88号（正对古城墙永宁门）',
    openYear: '2022年开业',
    ratingScore: '好4.8',
    ratingDesc: '城墙胜境·盛唐古韵·高星全服务',
    amenities: [
      { icon: 'wifi', label: 'Wifi' },
      { icon: 'parking', label: '免费停车场' },
      { icon: 'restaurant', label: '丝路盛宴中餐厅' },
      { icon: 'pool', label: '恒温星空泳池' },
      { icon: 'gym', label: '健身中心' },
      { icon: 'meeting', label: '千人盛唐宴会大厅' },
    ],
    phone: '029-87654321',
    priceRange: '¥ 860 起',
    mainPhoto: {
      url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=85',
      caption: '西安钟楼南门丽呈华廷酒店 · 正门尊崇礼宾落客',
    },
    gridPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
        caption: '南门永宁门夜景灯火辉煌',
      },
      {
        url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
        caption: '新中式尊贵典雅城墙观景房',
      },
      {
        url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
        caption: '长安十三朝风味定制商宴包间',
      },
      {
        url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
        caption: '星光穹顶室内恒温游泳池',
      },
      {
        url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
        caption: '行政酒廊露天俯瞰古城墙',
      },
      {
        url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        caption: '至臻华廷复式全景大套房',
      },
    ],
  },
];

export const BRAND_FILTERS = [
  '全部品牌',
  '丽呈华廷酒店',
  '丽呈酒店',
  '丽呈别院',
  '丽呈睿轩酒店',
  '丽呈公寓',
  '丽呈联合',
];

export const REGION_FILTERS = [
  '全部区域',
  '华东',
  '华南',
  '华北',
  '西南',
  '华中',
  '西北',
  '东北',
];

export const HotelDirectoryPage: React.FC<HotelDirectoryPageProps> = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('全部区域');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePhotoModal, setActivePhotoModal] = useState<{ url: string; caption: string; hotelName: string } | null>(null);
  // 数据源：优先后端 API（运营后台实时维护），失败时静默降级为内置静态数据
  const [hotelSource, setHotelSource] = useState<HotelShowcaseItem[]>(HOTEL_DIRECTORY_LIST);

  useEffect(() => {
    let cancelled = false;
    fetchHotels().then((list) => {
      if (cancelled || !list) return;
      const mapped: HotelShowcaseItem[] = list.map((h) => ({
        id: `api-${h.id}`,
        name: h.name,
        brand: h.brand,
        city: h.city,
        region: h.region as HotelShowcaseItem['region'],
        diamondRating: h.diamondRating ?? 0,
        address: h.address,
        openYear: h.openYear,
        ratingScore: h.ratingScore,
        ratingDesc: h.ratingDesc,
        amenities: h.amenities as HotelShowcaseItem['amenities'],
        phone: h.phone,
        priceRange: h.priceRange,
        mainPhoto: h.mainPhoto,
        gridPhotos: h.gridPhotos,
      }));
      setHotelSource(mapped);
    });
    return () => {
      cancelled = true;
    };
  }, []);


  // Filtered hotel list（默认按酒店名称首字母/拼音排序）
  const filteredHotels = useMemo(() => {
    return hotelSource
      .filter((h) => {
        const matchRegion = selectedRegion === '全部区域' || h.region === selectedRegion;
        const matchSearch =
          !searchQuery.trim() ||
          h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.address.toLowerCase().includes(searchQuery.toLowerCase());
        return matchRegion && matchSearch;
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
  }, [hotelSource, selectedRegion, searchQuery]);

  const renderAmenityIcon = (icon: string) => {
    const cls = 'w-4 h-4 text-[#E5B56A]';
    switch (icon) {
      case 'wifi':
        return <Wifi className={cls} />;
      case 'parking':
        return <Car className={cls} />;
      case 'restaurant':
        return <UtensilsCrossed className={cls} />;
      case 'breakfast':
        return <Coffee className={cls} />;
      case 'bar':
        return <Wine className={cls} />;
      case 'roomService':
        return <ConciergeBell className={cls} />;
      case 'pool':
        return <Waves className={cls} />;
      case 'gym':
        return <Dumbbell className={cls} />;
      case 'spa':
        return <Sparkles className={cls} />;
      case 'sauna':
        return <Flame className={cls} />;
      case 'hotSpring':
        return <Droplets className={cls} />;
      case 'meeting':
        return <Briefcase className={cls} />;
      case 'businessCenter':
        return <Building2 className={cls} />;
      case 'kidsClub':
        return <Baby className={cls} />;
      case 'petFriendly':
        return <Dog className={cls} />;
      case 'laundry':
        return <Shirt className={cls} />;
      case 'airportShuttle':
        return <Plane className={cls} />;
      case 'evCharging':
        return <PlugZap className={cls} />;
      case 'frontDesk':
        return <Clock className={cls} />;
      case 'luggage':
        return <Luggage className={cls} />;
      case 'nonSmoking':
        return <CigaretteOff className={cls} />;
      case 'tv':
        return <Tv className={cls} />;
      case 'bath':
        return <Bath className={cls} />;
      default:
        return <Sparkles className={cls} />;
    }
  };

  return (
    <div className="w-full bg-[#0a0d14] text-[#E2E8F0] font-sans antialiased min-h-screen select-none">
      {/* =====================================================================
          1. TOP HERO BANNER & BREADCRUMBS
          Strictly identical to other pages (About Us, Brand Matrix, News, Franchise)
         ===================================================================== */}
      <section className="relative w-full h-[400px] md:h-[460px] bg-[#111622] overflow-hidden select-none">
        {/* Luxury Hotel Architecture Backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('/assets/rezen/jdml.webp')`,
          }}
        />
        {/* Dark Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#111622]/95" />

        {/* Ambient Subtle Gold Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-[#C59B3F]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-[1560px] mx-auto h-full px-6 lg:px-[80px] flex flex-col justify-end pb-14 md:pb-16 text-white z-10">
          <div className="flex flex-col items-start">
            <h1 className="hero-enter text-[32px] sm:text-[40px] md:text-[48px] font-bold tracking-[0.03em] leading-tight text-white">
              酒店名录
            </h1>
            <p className="hero-enter-sub mt-3 text-[14px] md:text-[16px] text-white/80 max-w-2xl font-light tracking-wide leading-relaxed">
              以东方待客之道与卓越智慧旅居，恭迎全球商旅与度假贵宾
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. FILTER & SEARCH CONTROL BAR
         ===================================================================== */}
      <nav className="sticky top-[64px] md:top-0 z-30 w-full bg-[#0e121a]/95 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-[1560px] mx-auto px-6 py-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Region Pills（原品牌筛选位置） */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {REGION_FILTERS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRegion(r)}
                className={`px-4 py-1.5 rounded-full text-[13.5px] font-medium transition-all duration-200 shrink-0 cursor-pointer ${
                  selectedRegion === r
                    ? 'bg-[#EE9B27] text-black font-semibold shadow-md'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Keyword Search */}
          <div className="relative w-full sm:w-64 shrink-0">
            <input
              type="text"
              placeholder="搜索酒店名称、城市或路名..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white/10 text-[13px] text-white rounded-full border border-white/15 focus:border-[#EE9B27] focus:bg-white/15 focus:outline-none transition-all placeholder:text-white/40"
            />
            <Search className="w-3.5 h-3.5 text-white/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </nav>

      {/* =====================================================================
          3. HOTEL DIRECTORY VERTICAL LIST (逐一往下排列)
          1:1 Visual Replica of User Attachment (image_77c4a017.png)
         ===================================================================== */}
      <main className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12 md:space-y-16">
        {filteredHotels.length === 0 ? (
          <div className="w-full py-28 text-center bg-[#111622] rounded-3xl border border-white/10">
            <MapPin className="w-12 h-12 text-[#EE9B27]/60 mx-auto mb-3" />
            <h3 className="text-[20px] font-bold text-white mb-2">未找到匹配的酒店</h3>
            <p className="text-[14px] text-white/50">请尝试更换区域分类或搜索其他城市</p>
            <button
              type="button"
              onClick={() => {
                setSelectedRegion('全部区域');
                setSearchQuery('');
              }}
              className="mt-6 px-6 py-2 bg-[#EE9B27] text-black text-[14px] font-semibold rounded-full hover:bg-[#d9880f] transition-colors cursor-pointer"
            >
              重置筛选条件
            </button>
          </div>
        ) : (
          filteredHotels.map((hotel) => (
            <article
              key={hotel.id}
              className="relative w-full rounded-2xl md:rounded-3xl p-6 sm:p-8 lg:p-10 bg-[#0c1017] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group"
            >
              {/* Subtle Architectural Backlight Glow */}
              <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-[radial-gradient(circle_at_100%_0%,_rgba(238,155,39,0.07)_0%,_transparent_70%)] pointer-events-none" />

              {/* =============================================================
                  HOTEL HEADER ROW
                  Left: Name in Gold, Address, Open Year, Amenities
                  (Top-right content removed per user request)
                 ============================================================= */}
              <div className="relative z-10 pb-6">
                {/* Hotel Name in Warm Golden Typography (1:1 from reference image) */}
                <h2 className="text-[28px] sm:text-[32px] lg:text-[36px] font-normal tracking-[0.02em] text-[#E5B56A] leading-tight">
                  {hotel.name}
                  <DiamondRating
                    value={hotel.diamondRating ?? 0}
                    className="ml-3 inline-flex -translate-y-[2px] align-middle"
                    diamondClassName="h-[14px] w-[17px] sm:h-[16px] sm:w-[19px]"
                  />
                </h2>

                {/* Address */}
                <p className="mt-2 text-[15px] sm:text-[16px] text-[#A0AEC0] font-light">
                  {hotel.address}
                </p>

                {/* Opening Year */}
                <p className="mt-1 text-[13.5px] sm:text-[14px] text-[#718096] font-light">
                  {hotel.openYear}
                </p>

                {/* Amenities Row with Icons (Wifi 停车场 餐厅 ...) */}
                <div className="mt-4 flex flex-wrap items-center gap-6 sm:gap-8 text-[13.5px] text-[#CBD5E1]">
                  {hotel.amenities.map((amenity, aIdx) => (
                    <div key={aIdx} className="flex items-center gap-2">
                      {renderAmenityIcon(amenity.icon)}
                      <span>{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* =============================================================
                  PHOTO GRID
                  1:1 Layout from User Attachment (image_77c4a017.png)
                  - Left: 1 Large Hero Exterior Photo
                  - Right: 6 Curated Photos in 3 Columns x 2 Rows
                 ============================================================= */}
              <div className="relative z-10 mt-2 grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-2 gap-3 sm:gap-3.5 lg:min-h-[420px]">
                {/* 1. Large Main Hero Photo (Left: 5 cols, spans 2 rows on lg) */}
                <div
                  onClick={() =>
                    setActivePhotoModal({
                      url: hotel.mainPhoto.url,
                      caption: hotel.mainPhoto.caption,
                      hotelName: hotel.name,
                    })
                  }
                  className="lg:col-span-5 lg:row-span-2 aspect-[4/3] lg:aspect-auto lg:h-full min-h-[260px] sm:min-h-[340px] rounded-xl overflow-hidden relative group cursor-pointer bg-black/60 shadow-md"
                >
                  <img
                    src={hotel.mainPhoto.url}
                    alt={hotel.mainPhoto.caption}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute bottom-3 left-3 right-3 text-[13px] text-white/90 font-medium tracking-wide bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                    {hotel.mainPhoto.caption}
                  </span>
                </div>

                {/* 2. Six Grid Photos (Right: 7 cols, spans 2 rows, 3 cols x 2 rows) */}
                <div className="lg:col-span-7 lg:row-span-2 grid grid-cols-3 lg:grid-rows-2 gap-3 sm:gap-3.5">
                  {hotel.gridPhotos.map((photo, pIdx) => (
                    <div
                      key={pIdx}
                      onClick={() =>
                        setActivePhotoModal({
                          url: photo.url,
                          caption: photo.caption,
                          hotelName: hotel.name,
                        })
                      }
                      className="aspect-[4/3] lg:aspect-auto lg:h-full min-h-[120px] rounded-xl overflow-hidden relative group cursor-pointer bg-black/60 shadow-md"
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="absolute bottom-2 left-2 right-2 text-[11.5px] text-white/95 font-medium tracking-wide bg-black/70 backdrop-blur-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                        {photo.caption}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))
        )}
      </main>

      {/* =====================================================================
          PHOTO LIGHTBOX MODAL
         ===================================================================== */}
      {activePhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActivePhotoModal(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#111622] rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-[17px] font-bold text-[#E5B56A]">{activePhotoModal.hotelName}</h3>
                <p className="text-[13px] text-white/60">{activePhotoModal.caption}</p>
              </div>
              <button
                type="button"
                onClick={() => setActivePhotoModal(null)}
                aria-label="关闭"
                className="w-10 h-10 shrink-0 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activePhotoModal.url}
                alt={activePhotoModal.caption}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
