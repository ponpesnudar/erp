import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  BookMarked,
  BookOpen,
  BookText,
  Calculator,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Compass,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  HandHeart,
  HeartHandshake,
  Home,
  LayoutGrid,
  Loader2,
  MapPin,
  Mic,
  Moon,
  MoreHorizontal,
  Navigation,
  RefreshCw,
  Scale,
  ScrollText,
  Search,
  Settings,
  Sparkles,
  Tag,
  Video,
  PlayCircle,
  X,
} from 'lucide-react';
import {
  JadwalShalatMobileScreen,
  KiblatMobileScreen,
  MaulidMobileScreen,
  QuranMobileScreen,
  TahlilYasinMobileScreen,
  WiridDoaMobileScreen,
} from './KhazanahSubScreensA.tsx';
import {
  HajiUmrahMobileScreen,
  KalamMobileScreen,
  KalenderMobileScreen,
  RamadhanMobileScreen,
  TasbihMobileScreen,
  TutorialIbadahMobileScreen,
  WarisMobileScreen,
  ZakatMobileScreen,
  ZiarahMobileScreen,
} from './KhazanahSubScreensB.tsx';
import {
  PRESET_CITIES_ID,
  detectCurrentGpsLocation,
  fetchPrayerTimesForCoords,
  getHijriAndPasaranForDate,
  type GpsLocationInfo,
  type PrayerScheduleDay,
} from '../../lib/quranGpsService.ts';
import { SURAH_ALQURAN_LIST } from '../../data/seed/khazanahData.ts';
import { useAppStore } from '../../lib/store.ts';

export type KhazanahRoute =
  | 'home'
  | 'semua_menu'
  | 'quran'
  | 'wirid'
  | 'shalat'
  | 'kiblat'
  | 'tahlil'
  | 'maulid'
  | 'zakat'
  | 'ziarah'
  | 'tutorial'
  | 'haji'
  | 'ramadhan'
  | 'kalam'
  | 'waris'
  | 'kalender'
  | 'tasbih'
  | 'video'
  | 'cari_ayat'
  | 'khutbah'
  | 'nupedia'
  | 'qurban'
  | 'pengaturan';

interface KhazanahMobileAppProps {
  onBackToLanding: () => void;
  initialRoute?: KhazanahRoute;
  embeddedInErp?: boolean;
  backButtonLabel?: string;
}

const GPS_STORAGE_KEY = 'darussalam_khazanah_gps';
const DEFAULT_LOCATION: GpsLocationInfo = {
  lat: -6.9735,
  lng: 109.6697,
  label: 'Karangdadap, Kabupaten Pekalongan',
  subLabel: 'Jawa Tengah · WIB',
  source: 'default',
};

const KHUTBAH_JUMAT_LIST = [
  {
    id: 'kh-1',
    judul: 'Menjaga Lisan & Ukhuwah Islamiyah di Era Digital',
    topik: 'Khutbah Jum’at · Akhlaq',
    ringkas: 'Pentingnya tabayyun sebelum menyebarkan kabar sesuai QS. Al-Hujurat ayat 6 dan kaidah adab bermedia santri.',
    arab: 'يَا أَيُّهَا الَّذِيْنَ آمَنُوْا إِنْ جَاءَكُمْ فَاسِقٌ بِنَبَإٍ فَتَبَيَّنُوْا',
  },
  {
    id: 'kh-2',
    judul: 'Keberkahan Ilmu, Khidmah, dan Hormat kepada Guru',
    topik: 'Khutbah Jum’at · Kepesantrenan',
    ringkas: 'Ilmu yang bermanfaat tidak hanya diukur dari hafalan, melainkan dari adab, ketawadhuan, dan sanad keilmuan kepada para masyayikh.',
    arab: 'لَيْسَ مِنَّا مَنْ لَمْ يَرْحَمْ صَغِيْرَنَا وَيُوَقِّرْ كَبِيْرَنَا',
  },
  {
    id: 'kh-3',
    judul: 'Menyambut Bulan Mulia dengan Taubat & Sedekah',
    topik: 'Khutbah Jum’at · Ibadah',
    ringkas: 'Amalan istighfar, memperbaiki shalat berjamaah, serta mempererat solidaritas sosial melalui zakat, infaq, dan shadaqah.',
    arab: 'وَسَارِعُوْا إِلٰى مَغْفِرَةٍ مِّنْ رَّبِّكُمْ وَجَنَّةٍ عَرْضُهَا السَّمٰوٰتُ وَالْأَرْضُ',
  },
];

const NUPEDIA_TOPICS = [
  {
    judul: 'Ahlussunnah wal Jama’ah An-Nahdliyah',
    bidang: 'Aqidah & Manhaj',
    isi: 'Mengikuti Imam Abul Hasan Al-Asy’ari dan Imam Abu Manshur Al-Maturidi dalam bidang akidah, salah satu dari 4 madzhab fiqih (Hanafi, Maliki, Syafi’i, Hanbali) dalam syariah, serta Imam Junaid Al-Baghdadi dan Imam Al-Ghazali dalam tasawuf.',
  },
  {
    judul: 'Tradisi Tahlilan, Yasinan & Ziarah Kubur',
    bidang: 'Amaliyah NU',
    isi: 'Amalan kirim doa dan pahala bacaan Al-Qur’an kepada ahli kubur berdasarkan hadits shahih, ijma’ ulama salaf, serta fatwa Imam Nawawi dalam Al-Adzkar dan Kitab Al-Majmu’.',
  },
  {
    judul: 'Sejarah & Sanad Pondok Pesantren Salaf',
    bidang: 'Keislaman Nusantara',
    isi: 'Pesantren merupakan benteng tradisi keilmuan Nusantara yang merawat pengajaran kitab kuning mu’tabarah (Safinah, Taqrib, Fathul Mu’in, Imrithi, Alfiyah, Ihya Ulumiddin) bersanad muttashil.',
  },
];

export const KhazanahMobileApp: React.FC<KhazanahMobileAppProps> = ({
  onBackToLanding,
  initialRoute = 'home',
  embeddedInErp = false,
  backButtonLabel,
}) => {
  const khazanahCms = useAppStore((s) => s.khazanahItems);
  const tutorialVideoLinks = useAppStore((s) => s.tutorialVideoLinks);

  const [route, setRoute] = useState<KhazanahRoute>(initialRoute);
  const [quranInitialSurah, setQuranInitialSurah] = useState<number | undefined>(undefined);
  const [wiridInitialGroup, setWiridInitialGroup] = useState<string | undefined>(undefined);
  const [maulidInitialFilter, setMaulidInitialFilter] = useState<string | undefined>(undefined);
  const [homeSearch, setHomeSearch] = useState('');
  const [cariAyatQuery, setCariAyatQuery] = useState('');
  const [activeVideoModal, setActiveVideoModal] = useState<{
    key: string;
    judul: string;
    url: string;
    sumberType: string;
    thumbnailUrl?: string;
  } | null>(null);

  // GPS State
  const [location, setLocation] = useState<GpsLocationInfo>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem(GPS_STORAGE_KEY);
        if (saved) return JSON.parse(saved) as GpsLocationInfo;
      } catch {
        // ignore
      }
    }
    return DEFAULT_LOCATION;
  });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');

  // Prayer timing & live countdown
  const [todaySchedule, setTodaySchedule] = useState<PrayerScheduleDay | null>(null);
  const [nowSec, setNowSec] = useState(() => Math.floor(Date.now() / 1000));

  const persistLocation = (loc: GpsLocationInfo) => {
    setLocation(loc);
    try {
      window.localStorage.setItem(GPS_STORAGE_KEY, JSON.stringify(loc));
    } catch {
      // ignore
    }
  };

  const handleRefreshGps = async () => {
    setGpsLoading(true);
    setGpsError('');
    try {
      const detected = await detectCurrentGpsLocation();
      persistLocation(detected);
      setShowLocationModal(false);
    } catch (err) {
      setGpsError((err as Error).message || 'Gagal membaca lokasi GPS perangkat.');
    } finally {
      setGpsLoading(false);
    }
  };

  // Attempt silent GPS detection once on first launch if still default
  useEffect(() => {
    if (location.source === 'default') {
      detectCurrentGpsLocation()
        .then((loc) => persistLocation(loc))
        .catch(() => {
          // keep Pekalongan default cleanly if permission denied
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNowSec(Math.floor(Date.now() / 1000)), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchPrayerTimesForCoords(location.lat, location.lng, new Date()).then((res) => {
      if (!cancelled) setTodaySchedule(res);
    });
    return () => {
      cancelled = true;
    };
  }, [location.lat, location.lng]);

  const calToday = useMemo(() => getHijriAndPasaranForDate(new Date()), []);

  const nextPrayerInfo = useMemo(() => {
    if (!todaySchedule) {
      return { nama: 'Subuh', waktu: '04:11', countdown: '- 01 : 15 : 00' };
    }
    const now = new Date(nowSec * 1000);
    const curSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    for (const t of todaySchedule.timings) {
      const [hh, mm] = t.waktu.split(':').map(Number);
      const tSec = (hh || 0) * 3600 + (mm || 0) * 60;
      if (tSec > curSec) {
        const diff = tSec - curSec;
        const h = String(Math.floor(diff / 3600)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
        const s = String(diff % 60).padStart(2, '0');
        return { nama: t.nama, waktu: t.waktu, countdown: `- ${h} : ${m} : ${s}` };
      }
    }
    return {
      nama: 'Subuh',
      waktu: todaySchedule.timings[1]?.waktu || '04:10',
      countdown: '- 06 : 10 : 00',
    };
  }, [todaySchedule, nowSec]);

  const homeCoreIcons: Array<{
    id: KhazanahRoute;
    label: string;
    icon: React.ReactNode;
    bg: string;
    color: string;
  }> = [
    { id: 'quran', label: 'Al-Quran', icon: <BookOpen className="w-6 h-6" />, bg: 'bg-[#E6F7F2]', color: 'text-[#00897B]' },
    { id: 'wirid', label: 'Wirid & Doa', icon: <HandHeart className="w-6 h-6" />, bg: 'bg-[#E6F7F2]', color: 'text-[#00897B]' },
    { id: 'shalat', label: 'Jadwal Shalat', icon: <Clock className="w-6 h-6" />, bg: 'bg-[#E6F7F2]', color: 'text-[#00897B]' },
    { id: 'kiblat', label: 'Kiblat', icon: <Compass className="w-6 h-6" />, bg: 'bg-[#E6F7F2]', color: 'text-[#00897B]' },
    { id: 'tahlil', label: 'Tahlil & Yasin', icon: <BookText className="w-6 h-6" />, bg: 'bg-[#E6F7F2]', color: 'text-[#00897B]' },
    { id: 'maulid', label: 'Maulid & Qasidah', icon: <ScrollText className="w-6 h-6" />, bg: 'bg-[#E6F7F2]', color: 'text-[#00897B]' },
    { id: 'zakat', label: 'Zakat & Sedekah', icon: <HeartHandshake className="w-6 h-6" />, bg: 'bg-[#E6F7F2]', color: 'text-[#00897B]' },
    { id: 'semua_menu', label: 'Lainnya', icon: <LayoutGrid className="w-6 h-6" />, bg: 'bg-[#E6F7F2]', color: 'text-[#00897B]' },
  ];

  const semuaMenuSecondaryIcons: Array<{
    id: KhazanahRoute;
    label: string;
    icon: React.ReactNode;
  }> = [
    { id: 'ziarah', label: 'Ziarah', icon: <MapPin className="w-5 h-5" /> },
    { id: 'nupedia', label: 'NUpedia', icon: <Globe className="w-5 h-5" /> },
    { id: 'tutorial', label: 'Tutorial Ibadah', icon: <BookMarked className="w-5 h-5" /> },
    { id: 'cari_ayat', label: 'Cari Ayat Al-Quran', icon: <Search className="w-5 h-5" /> },
    { id: 'quran', label: 'Terjemah & Tafsir', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'khutbah', label: 'Khutbah', icon: <Mic className="w-5 h-5" /> },
    { id: 'zakat', label: 'Kalkulator Zakat', icon: <Calculator className="w-5 h-5" /> },
    { id: 'tasbih', label: 'Tasbih', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'kalender', label: 'Kalender Hijriah', icon: <CalendarIcon className="w-5 h-5" /> },
    { id: 'haji', label: 'Haji & Umrah', icon: <Compass className="w-5 h-5" /> },
    { id: 'ramadhan', label: 'Ramadhan', icon: <Moon className="w-5 h-5" /> },
    { id: 'video', label: 'Video', icon: <Video className="w-5 h-5" /> },
    { id: 'kalam', label: 'Topik', icon: <Tag className="w-5 h-5" /> },
    { id: 'kalam', label: 'Kalam', icon: <FileText className="w-5 h-5" /> },
    { id: 'waris', label: 'Kalkulator Waris', icon: <Scale className="w-5 h-5" /> },
    { id: 'qurban', label: 'Qurban', icon: <HeartHandshake className="w-5 h-5" /> },
  ];

  const kitabDirectLinks: Array<{
    label: string;
    subtitle: string;
    route: KhazanahRoute;
    wiridGroup?: string;
    maulidFilter?: string;
    keywords: string;
  }> = [
    {
      label: 'Manaqib Nurul Burhani',
      subtitle: 'Tawassul, Manqobah 1–9 & Doa',
      route: 'wirid',
      wiridGroup: 'wirid-8',
      keywords: 'manaqib nurul burhani syekh abdul qadir jailani',
    },
    {
      label: 'Kitab Haikal Nuroni',
      subtitle: 'Haikal 1–7 Lengkap & Doa',
      route: 'wirid',
      wiridGroup: 'wirid-9',
      keywords: 'haikal nuroni tujuh haikal ayat kursi',
    },
    {
      label: 'Dalailul Khoirot',
      subtitle: 'Senin–Ahad & Doa Khatam',
      route: 'wirid',
      wiridGroup: 'wirid-7',
      keywords: 'dalailul khoirot khairat jazuli',
    },
    {
      label: 'Koleksi Hizib-Hizib',
      subtitle: 'Nashor, Bahr, Nawawi, Autad, Sakron',
      route: 'wirid',
      wiridGroup: 'wirid-6',
      keywords: 'hizib nashor bahr nawawi autad sakron ikhfa barqi fatihah',
    },
    {
      label: 'Mahallul Qiyam Az-Zahir',
      subtitle: 'Versi Majelis Az-Zahir Lengkap',
      route: 'maulid',
      maulidFilter: 'Mahallul Qiyam Az-Zahir',
      keywords: 'mahallul qiyam az-zahir asyraqal marhaban maulid',
    },
    {
      label: 'Syair & Qasidah Pesantren',
      subtitle: 'Tanpo Waton, Al-I’tiraf, Burdah, Badar',
      route: 'maulid',
      maulidFilter: 'Syair & Qasidah',
      keywords: 'syair qasidah tanpo waton itiraf burdah ya lal wathan badar asnawiyah tombo ati',
    },
    {
      label: 'Tahlil Aswaja Madzhab Syafi’i',
      subtitle: '19 Susunan Lengkap & Ayat Kursi',
      route: 'tahlil',
      keywords: 'tahlil syafii aswaja ayat kursi doa arwah',
    },
  ];

  const searchResults = useMemo(() => {
    const q = homeSearch.trim().toLowerCase();
    if (!q) return null;
    const surahs = SURAH_ALQURAN_LIST.filter(
      (s) => s.namaLatin.toLowerCase().includes(q) || s.arti.toLowerCase().includes(q)
    ).slice(0, 6);
    const menus = [...homeCoreIcons.slice(0, 7), ...semuaMenuSecondaryIcons].filter((m) =>
      m.label.toLowerCase().includes(q)
    );
    const kitabMatches = kitabDirectLinks.filter(
      (k) =>
        k.label.toLowerCase().includes(q) ||
        k.subtitle.toLowerCase().includes(q) ||
        k.keywords.includes(q)
    );
    const cmsMatches = khazanahCms.filter(
      (c) =>
        c.judul.toLowerCase().includes(q) ||
        c.isiLengkap.toLowerCase().includes(q) ||
        c.kategori.toLowerCase().includes(q)
    );
    return { surahs, menus, kitabMatches, cmsMatches };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSearch, khazanahCms]);

  const showBottomTabs =
    route === 'home' || route === 'quran' || route === 'kalam' || route === 'kalender' || route === 'pengaturan';

  return (
    <div
      className={
        embeddedInErp
          ? 'flex justify-center py-0 sm:py-2 font-sans'
          : 'min-h-screen bg-[#E9ECEB] flex justify-center sm:py-3 font-sans'
      }
    >
      {/* Centered Mobile App Shell (100% Native Android/iOS Feel, 430-460px wide) */}
      <div
        className={`w-full bg-white sm:rounded-[32px] sm:border border-slate-200/80 shadow-2xl flex flex-col overflow-hidden relative ${
          embeddedInErp
            ? 'max-w-[460px] h-[calc(100vh-170px)] min-h-[540px] md:h-[calc(100vh-135px)] rounded-3xl border'
            : 'max-w-[430px] h-screen sm:h-[calc(100vh-24px)]'
        }`}
      >
        {/* ================= MAIN SCREEN BODY ================= */}
        {route === 'home' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pb-20 bg-white">
            {/* Crescent Mosque-Dome Teal Header matching reference 04.42.06__2__7a70485c.jpeg */}
            <div className="bg-gradient-to-b from-[#00897B] to-[#007366] text-white px-4 pt-3 pb-7 relative overflow-hidden shrink-0">
              {/* Decorative Mosque Silhouette */}
              <svg
                viewBox="0 0 430 140"
                className="absolute bottom-0 left-0 right-0 w-full h-24 text-black/10 pointer-events-none"
                preserveAspectRatio="none"
              >
                <path
                  fill="currentColor"
                  d="M0,140 L0,105 L28,105 L28,85 C28,72 44,65 55,65 C66,65 82,72 82,85 L82,105 L130,105 L130,78 C130,52 165,30 215,15 C265,30 300,52 300,78 L300,105 L348,105 L348,85 C348,72 364,65 375,65 C386,65 402,72 402,85 L402,105 L430,105 L430,140 Z"
                />
              </svg>

              {/* App Brand Top Row + Back to Website */}
              <div className="flex items-center justify-between relative z-10 mb-3">
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/aistudio/preview__14__3b7f388f.webp"
                    alt="PP NU Darussalam"
                    className="w-7 h-7 rounded-full bg-white p-0.5 object-contain"
                  />
                  <div>
                    <p className="text-xs font-extrabold tracking-tight leading-tight">NU Darussalam</p>
                    <p className="text-[10px] text-emerald-100 leading-tight">Khazanah &amp; Ibadah</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setRoute('shalat')}
                    className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 transition"
                    title="Pengingat Adzan"
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onBackToLanding}
                    className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-[11px] font-bold flex items-center gap-1 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{backButtonLabel || (embeddedInErp ? 'Beranda ERP' : 'Website')}</span>
                  </button>
                </div>
              </div>

              {/* GPS Location + Next Prayer Countdown */}
              <div className="relative z-10 space-y-1">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(true)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-emerald-50 hover:text-white"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-400 fill-rose-400 shrink-0" />
                  <span className="truncate max-w-[230px]">{location.label}</span>
                  <span className="text-amber-300 font-bold">(Ganti)</span>
                </button>

                <div className="flex items-baseline justify-between gap-2 pt-0.5">
                  <button type="button" onClick={() => setRoute('shalat')} className="text-left">
                    <p className="text-2xl font-extrabold tracking-tight tabular-nums">
                      {nextPrayerInfo.nama} {nextPrayerInfo.waktu} WIB
                    </p>
                    <p className="text-sm font-medium text-emerald-100 tabular-nums">
                      {nextPrayerInfo.countdown}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={handleRefreshGps}
                    className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-[10px] font-bold flex items-center gap-1 shrink-0"
                  >
                    <RefreshCw className={`w-3 h-3 ${gpsLoading ? 'animate-spin' : ''}`} />
                    <span>GPS</span>
                  </button>
                </div>

                <p className="text-[11px] text-emerald-100/95 pt-1">
                  {calToday.hari} {calToday.pasaran}, {calToday.masehiFull} / {calToday.hijriFull}
                </p>
              </div>
            </div>

            {/* Rounded White Sheet Overlay */}
            <div className="-mt-4 bg-white rounded-t-3xl px-4 pt-5 pb-6 space-y-5 relative z-10">
              {/* 4x2 Core Grid matching screenshot */}
              <div className="grid grid-cols-4 gap-y-4 gap-x-2">
                {homeCoreIcons.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.id === 'quran') setQuranInitialSurah(undefined);
                      if (item.id === 'wirid') setWiridInitialGroup(undefined);
                      if (item.id === 'maulid') setMaulidInitialFilter(undefined);
                      setRoute(item.id);
                    }}
                    className="flex flex-col items-center gap-1.5 text-center group"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shadow-2xs group-active:scale-95 transition`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 leading-tight line-clamp-2">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search Input: Cari doa, wirid, artikel */}
              <div className="relative">
                <div className="flex items-center gap-2 bg-[#F3F5F4] border border-slate-200/80 rounded-2xl px-3.5 py-2.5">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={homeSearch}
                    onChange={(e) => setHomeSearch(e.target.value)}
                    placeholder="Cari doa, wirid, artikel"
                    className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
                  />
                  {homeSearch && (
                    <button type="button" onClick={() => setHomeSearch('')} className="text-slate-400">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {searchResults && (
                  <div className="mt-2 rounded-2xl border border-slate-200 bg-white shadow-lg p-3 space-y-2.5">
                    {searchResults.menus.length === 0 &&
                    searchResults.surahs.length === 0 &&
                    searchResults.kitabMatches.length === 0 &&
                    searchResults.cmsMatches.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-2">
                        Tidak ditemukan hasil untuk &ldquo;{homeSearch}&rdquo;
                      </p>
                    ) : (
                      <>
                        {searchResults.kitabMatches.map((k) => (
                          <button
                            key={k.label}
                            type="button"
                            onClick={() => {
                              setHomeSearch('');
                              setWiridInitialGroup(k.wiridGroup);
                              setMaulidInitialFilter(k.maulidFilter);
                              setRoute(k.route);
                            }}
                            className="w-full flex items-center justify-between text-left px-2 py-1.5 rounded-lg hover:bg-[#E6F7F2] text-xs text-slate-800"
                          >
                            <div>
                              <p className="font-extrabold text-[#00695C]">{k.label}</p>
                              <p className="text-[10px] text-slate-500">{k.subtitle}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#00897B] shrink-0" />
                          </button>
                        ))}
                        {searchResults.menus.map((m, idx) => (
                          <button
                            key={`${m.label}-${idx}`}
                            type="button"
                            onClick={() => {
                              setHomeSearch('');
                              if (m.id === 'wirid') setWiridInitialGroup(undefined);
                              if (m.id === 'maulid') setMaulidInitialFilter(undefined);
                              setRoute(m.id);
                            }}
                            className="w-full flex items-center justify-between text-left px-2 py-1.5 rounded-lg hover:bg-[#E6F7F2] text-xs font-bold text-slate-800"
                          >
                            <span>Menu: {m.label}</span>
                            <ChevronRight className="w-4 h-4 text-[#00897B]" />
                          </button>
                        ))}
                        {searchResults.surahs.map((s) => (
                          <button
                            key={s.nomor}
                            type="button"
                            onClick={() => {
                              setHomeSearch('');
                              setQuranInitialSurah(s.nomor);
                              setRoute('quran');
                            }}
                            className="w-full flex items-center justify-between text-left px-2 py-1.5 rounded-lg hover:bg-[#E6F7F2] text-xs text-slate-800"
                          >
                            <span className="font-bold">
                              Surah {s.nomor}. {s.namaLatin} ({s.arti})
                            </span>
                            <span className="font-arabic text-sm text-[#00897B]">{s.namaArab}</span>
                          </button>
                        ))}
                        {searchResults.cmsMatches.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setHomeSearch('');
                              setRoute('kalam');
                            }}
                            className="w-full flex items-center justify-between text-left px-2 py-1.5 rounded-lg hover:bg-[#E6F7F2] text-xs text-slate-800"
                          >
                            <span className="font-semibold truncate">{c.judul}</span>
                            <span className="text-[10px] font-bold text-[#00897B] shrink-0">{c.kategori}</span>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Banner Highlight Card (Santri & Wali Santri Darussalam) */}
              <div className="rounded-2xl bg-gradient-to-r from-[#00897B] to-[#00695C] text-white p-4 flex items-center justify-between gap-3 shadow-sm">
                <div className="space-y-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-extrabold">
                    PP NU Darussalam
                  </span>
                  <p className="text-sm font-extrabold leading-snug">
                    114 Surah Al-Qur&apos;an, Jadwal GPS, Kiblat, Ziarah &amp; Waris
                  </p>
                  <button
                    type="button"
                    onClick={() => setRoute('semua_menu')}
                    className="text-[11px] font-bold text-amber-200 inline-flex items-center gap-1 hover:underline"
                  >
                    <span>Lihat Semua Layanan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setRoute('waris')}
                  className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0"
                  title="Kalkulator Waris"
                >
                  <Scale className="w-6 h-6 text-amber-200" />
                </button>
              </div>

              {/* Quick Cards Row (Ziarah Terdekat & Tasbih Digital) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRoute('ziarah')}
                  className="p-3.5 rounded-2xl bg-[#FDF7EC] border border-[#EFE0C9] text-left space-y-1"
                >
                  <span className="text-[10px] font-extrabold text-[#9A632D] uppercase">Lokasi GPS</span>
                  <p className="text-xs font-extrabold text-slate-900">Makam Ziarah Terdekat</p>
                  <p className="text-[11px] text-slate-600">Hitung jarak KM real-time</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRoute('video')}
                  className="p-3.5 rounded-2xl bg-[#EBF7F3] border border-[#CFECE2] text-left space-y-1"
                >
                  <span className="text-[10px] font-extrabold text-[#00897B] uppercase">Panduan Video</span>
                  <p className="text-xs font-extrabold text-slate-900">Video &amp; Tutorial Ibadah</p>
                  <p className="text-[11px] text-slate-600">Wudhu, shalat &amp; manasik</p>
                </button>
              </div>

              {/* Kitab & Amalan Pilihan Pesantren (Direct Readers) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">Kitab &amp; Amalan Pesantren</h3>
                  <span className="text-[10px] font-bold text-[#00897B]">Teks Lengkap</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {kitabDirectLinks.slice(0, 6).map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setWiridInitialGroup(item.wiridGroup);
                        setMaulidInitialFilter(item.maulidFilter);
                        setRoute(item.route);
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#00897B] text-left transition shadow-2xs"
                    >
                      <p className="text-xs font-extrabold text-slate-900 line-clamp-1">{item.label}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.subtitle}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Kalam & Artikel Terbaru */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">Kalam &amp; Artikel Terbaru</h3>
                  <button
                    type="button"
                    onClick={() => setRoute('kalam')}
                    className="text-xs font-bold text-[#00897B]"
                  >
                    Semua →
                  </button>
                </div>
                <div className="space-y-2">
                  {khazanahCms.slice(0, 3).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRoute('kalam')}
                      className="w-full p-3 rounded-2xl border border-slate-200 bg-white text-left space-y-1 hover:border-[#00897B]/50 transition"
                    >
                      <span className="text-[10px] font-bold text-[#00897B]">{item.kategori}</span>
                      <p className="text-xs font-extrabold text-slate-900 line-clamp-1">{item.judul}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{item.subjudul || item.isiLengkap}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SEMUA MENU (MATCHES 04.42.00__2__032d9e94.jpeg) ================= */}
        {route === 'semua_menu' && (
          <div className="flex-1 flex flex-col bg-white min-h-0">
            <div className="bg-[#00897B] text-white px-3 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setRoute('home')} className="p-1 rounded-full hover:bg-white/15">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">Semua Menu</h1>
              </div>
              <button
                type="button"
                onClick={() => setRoute('pengaturan')}
                className="px-3 py-1 rounded-full bg-white/15 text-xs font-bold"
              >
                Urutkan
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-12">
              {/* Top 7 Core Grid */}
              <div className="grid grid-cols-4 gap-y-4 gap-x-2">
                {homeCoreIcons.slice(0, 7).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.id === 'quran') setQuranInitialSurah(undefined);
                      setRoute(item.id);
                    }}
                    className="flex flex-col items-center gap-1.5 text-center"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}>
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 leading-tight">{item.label}</span>
                  </button>
                ))}
              </div>

              <hr className="border-slate-200" />

              {/* 16 Secondary Menu Items */}
              <div className="grid grid-cols-4 gap-y-5 gap-x-2">
                {semuaMenuSecondaryIcons.map((item, idx) => (
                  <button
                    key={`${item.label}-${idx}`}
                    type="button"
                    onClick={() => setRoute(item.id)}
                    className="flex flex-col items-center gap-1.5 text-center"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#E6F7F2] text-[#00897B] flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-medium text-slate-700 leading-tight">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 16 FULL FEATURE SCREENS ================= */}
        {route === 'quran' && (
          <QuranMobileScreen onBack={() => setRoute('home')} initialSurahNomor={quranInitialSurah} />
        )}
        {route === 'wirid' && (
          <WiridDoaMobileScreen
            onBack={() => {
              setWiridInitialGroup(undefined);
              setRoute('home');
            }}
            initialGroupKey={wiridInitialGroup}
          />
        )}
        {route === 'shalat' && (
          <JadwalShalatMobileScreen
            onBack={() => setRoute('home')}
            location={location}
            onRefreshGps={handleRefreshGps}
            onOpenLocationPicker={() => setShowLocationModal(true)}
            onOpenKiblat={() => setRoute('kiblat')}
          />
        )}
        {route === 'kiblat' && (
          <KiblatMobileScreen
            onBack={() => setRoute('home')}
            location={location}
            onOpenLocationPicker={() => setShowLocationModal(true)}
          />
        )}
        {route === 'tahlil' && <TahlilYasinMobileScreen onBack={() => setRoute('home')} />}
        {route === 'maulid' && (
          <MaulidMobileScreen
            onBack={() => {
              setMaulidInitialFilter(undefined);
              setRoute('home');
            }}
            initialFilter={maulidInitialFilter}
          />
        )}
        {route === 'zakat' && <ZakatMobileScreen onBack={() => setRoute('home')} />}
        {route === 'waris' && <WarisMobileScreen onBack={() => setRoute('home')} />}
        {route === 'kalender' && <KalenderMobileScreen />}
        {route === 'tutorial' && <TutorialIbadahMobileScreen onBack={() => setRoute('home')} />}
        {route === 'ziarah' && (
          <ZiarahMobileScreen
            onBack={() => setRoute('home')}
            location={location}
            onOpenLocationPicker={() => setShowLocationModal(true)}
          />
        )}
        {route === 'haji' && <HajiUmrahMobileScreen onBack={() => setRoute('home')} />}
        {route === 'ramadhan' && <RamadhanMobileScreen onBack={() => setRoute('home')} />}
        {route === 'kalam' && <KalamMobileScreen onBack={() => setRoute('home')} />}
        {route === 'tasbih' && <TasbihMobileScreen onBack={() => setRoute('home')} />}

        {/* ================= CARI AYAT AL-QUR'AN ================= */}
        {route === 'cari_ayat' && (
          <div className="flex-1 flex flex-col bg-white min-h-0">
            <div className="bg-[#00897B] text-white px-3 py-3 flex items-center gap-2 shrink-0">
              <button type="button" onClick={() => setRoute('semua_menu')} className="p-1 rounded-full hover:bg-white/15">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold">Cari Ayat Al-Quran</h1>
            </div>
            <div className="p-4 space-y-3 flex-1 overflow-y-auto pb-12">
              <div className="flex items-center gap-2 bg-[#F1F3F4] rounded-xl px-3 py-2.5">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={cariAyatQuery}
                  onChange={(e) => setCariAyatQuery(e.target.value)}
                  placeholder="Ketik nama surah atau arti (misal: Kahfi, Rahmat)..."
                  className="w-full bg-transparent text-sm focus:outline-hidden"
                />
              </div>
              <div className="divide-y divide-slate-200">
                {SURAH_ALQURAN_LIST.filter(
                  (s) =>
                    !cariAyatQuery.trim() ||
                    s.namaLatin.toLowerCase().includes(cariAyatQuery.toLowerCase()) ||
                    s.arti.toLowerCase().includes(cariAyatQuery.toLowerCase()) ||
                    String(s.nomor) === cariAyatQuery.trim()
                ).map((s) => (
                  <button
                    key={s.nomor}
                    type="button"
                    onClick={() => {
                      setQuranInitialSurah(s.nomor);
                      setRoute('quran');
                    }}
                    className="w-full py-3 flex items-center justify-between text-left"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {s.nomor}. {s.namaLatin}
                      </p>
                      <p className="text-xs text-slate-500">
                        {s.arti} · {s.jumlahAyat} Ayat · Juz {s.juz}
                      </p>
                    </div>
                    <span className="font-arabic text-lg text-[#00897B]">{s.namaArab}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= KHUTBAH JUMAT ================= */}
        {route === 'khutbah' && (
          <div className="flex-1 flex flex-col bg-[#F7F9F8] min-h-0">
            <div className="bg-[#00897B] text-white px-3 py-3 flex items-center gap-2 shrink-0">
              <button type="button" onClick={() => setRoute('semua_menu')} className="p-1 rounded-full hover:bg-white/15">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold">Khutbah Jum&apos;at &amp; Hari Raya</h1>
            </div>
            <div className="p-4 space-y-3 flex-1 overflow-y-auto pb-12">
              {KHUTBAH_JUMAT_LIST.map((kh) => (
                <div key={kh.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 shadow-2xs">
                  <span className="text-[10px] font-extrabold text-[#00897B]">{kh.topik}</span>
                  <h3 className="text-sm font-extrabold text-slate-900">{kh.judul}</h3>
                  <p className="font-arabic text-lg text-right text-slate-900 leading-loose" dir="rtl">
                    {kh.arab}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">{kh.ringkas}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= NUPEDIA ================= */}
        {route === 'nupedia' && (
          <div className="flex-1 flex flex-col bg-[#F7F9F8] min-h-0">
            <div className="bg-[#00897B] text-white px-3 py-3 flex items-center gap-2 shrink-0">
              <button type="button" onClick={() => setRoute('semua_menu')} className="p-1 rounded-full hover:bg-white/15">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold">NUpedia · Ensiklopedia Aswaja</h1>
            </div>
            <div className="p-4 space-y-3 flex-1 overflow-y-auto pb-12">
              {NUPEDIA_TOPICS.map((n, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1.5 shadow-2xs">
                  <span className="px-2 py-0.5 rounded bg-[#E6F7F2] text-[#00897B] text-[10px] font-bold">
                    {n.bidang}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900">{n.judul}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.isi}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= QURBAN ================= */}
        {route === 'qurban' && (
          <div className="flex-1 flex flex-col bg-[#F7F9F8] min-h-0">
            <div className="bg-[#00897B] text-white px-3 py-3 flex items-center gap-2 shrink-0">
              <button type="button" onClick={() => setRoute('semua_menu')} className="p-1 rounded-full hover:bg-white/15">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold">Fiqih &amp; Panduan Qurban</h1>
            </div>
            <div className="p-4 space-y-3 flex-1 overflow-y-auto pb-12">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
                <h3 className="text-sm font-extrabold text-slate-900">Syarat Sah Hewan Qurban (Madzhab Syafi&apos;i)</h3>
                <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
                  <li>Domba (dha&apos;nu): genap berusia 1 tahun atau sudah berganti gigi (musinnah / jadz&apos;ah).</li>
                  <li>Kambing kacang/etawa (ma&apos;zu): genap berusia 2 tahun.</li>
                  <li>Sapi/Kerbau (baqar): genap berusia 2 tahun (untuk maksimal 7 shohibul qurban).</li>
                  <li>Sehat, gemuk, dan tidak terdapat cacat yang mengurangi daging (buta, pincang berat, sakit parah, kurus kering).</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
                <h3 className="text-sm font-extrabold text-slate-900">Doa Menyembelih Hewan Qurban</h3>
                <p className="font-arabic text-xl text-right text-slate-900" dir="rtl">
                  بِسْمِ اللّٰهِ وَاللّٰهُ أَكْبَرُ، اَللّٰهُمَّ هٰذِهِ مِنْكَ وَإِلَيْكَ فَتَقَبَّلْ مِنِّيْ
                </p>
                <p className="text-xs text-[#00897B] font-medium">
                  Bismillāhi wallāhu akbar. Allāhumma hādzihi minka wa ilaika fataqabbal minnī.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIDEO TUTORIAL ================= */}
        {route === 'video' && (
          <div className="flex-1 flex flex-col bg-[#F7F9F8] min-h-0">
            <div className="bg-[#00897B] text-white px-3 py-3 flex items-center gap-2 shrink-0">
              <button type="button" onClick={() => setRoute('home')} className="p-1 rounded-full hover:bg-white/15">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold">Video Kajian &amp; Tutorial</h1>
            </div>
            <div className="p-4 space-y-3.5 flex-1 overflow-y-auto pb-16">
              {Object.entries(tutorialVideoLinks).filter(([, v]) => Boolean(v?.url)).length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center space-y-2">
                  <Video className="w-8 h-8 text-[#00897B] mx-auto" />
                  <p className="text-sm font-bold text-slate-900">Video Kajian &amp; Panduan Pondok</p>
                  <p className="text-xs text-slate-500">
                    Admin Sekretariat dapat menambahkan tautan video beserta thumbnail kustom di modul Sekretariat &rarr; Manajemen Tutorial agar tampil menarik untuk santri di sini.
                  </p>
                </div>
              ) : (
                Object.entries(tutorialVideoLinks)
                  .filter(([, v]) => Boolean(v?.url))
                  .map(([key, item]) => {
                    const ytMatch = (item.url || '').match(
                      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/
                    );
                    const autoThumb = ytMatch
                      ? `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`
                      : '';
                    const coverImg = item.thumbnailUrl || autoThumb;
                    const displayTitle = item.judul || `Panduan Modul ${key.replace(/_/g, ' ')}`;

                    return (
                      <div
                        key={key}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#00897B] transition"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setActiveVideoModal({
                              key,
                              judul: displayTitle,
                              url: item.url,
                              sumberType: item.sumberType,
                              thumbnailUrl: coverImg || undefined,
                            })
                          }
                          className="relative w-full aspect-video bg-linear-to-br from-[#00695C] via-[#00897B] to-emerald-950 flex items-center justify-center group overflow-hidden text-left"
                        >
                          {coverImg ? (
                            <img
                              src={coverImg}
                              alt={displayTitle}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          ) : (
                            <div className="text-center text-white/90 px-4 space-y-1">
                              <Video className="w-9 h-9 text-amber-300 mx-auto" />
                              <p className="text-xs font-extrabold line-clamp-1">{displayTitle}</p>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition flex items-center justify-center">
                            <span className="w-12 h-12 rounded-full bg-white/95 text-[#00796B] flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                              <PlayCircle className="w-7 h-7 fill-current/10" />
                            </span>
                          </div>
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-xs text-amber-300 text-[10px] font-extrabold">
                            {item.sumberType}
                          </span>
                          <span className="absolute bottom-2 right-2.5 px-2 py-0.5 rounded-md bg-black/65 text-white text-[10px] font-bold">
                            Putar Tutorial
                          </span>
                        </button>

                        <div className="p-3.5 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-extrabold text-slate-900 truncate">
                              {displayTitle}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                              Diunggah {item.updatedBy} · {item.updatedAt}
                            </p>
                          </div>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-[#E6F7F2] text-[#00897B] hover:bg-[#d1f2e9] shrink-0"
                            title="Buka di tab baru"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            {/* In-App Video Player Sheet */}
            {activeVideoModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                <div className="w-full max-w-md rounded-3xl bg-slate-950 text-white p-4 space-y-3 border border-emerald-700/60 shadow-2xl">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black">
                        {activeVideoModal.sumberType}
                      </span>
                      <h4 className="text-sm font-bold truncate mt-1">{activeVideoModal.judul}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveVideoModal(null)}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {(() => {
                    const url = activeVideoModal.url.trim();
                    const isVideoFile =
                      /\.(mp4|webm|ogg|m4v)(\?.*)?$/i.test(url) ||
                      url.startsWith('blob:') ||
                      url.startsWith('/assets/');
                    const yt = url.match(
                      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/
                    );
                    const drv = url.match(
                      /drive\.google\.com\/(?:file\/d\/|open\?id=)([A-Za-z0-9_-]+)/
                    );
                    const embedSrc = yt
                      ? `https://www.youtube.com/embed/${yt[1]}?rel=0`
                      : drv
                      ? `https://drive.google.com/file/d/${drv[1]}/preview`
                      : url;

                    return (
                      <div className="rounded-2xl overflow-hidden aspect-video bg-black border border-white/10">
                        {isVideoFile ? (
                          <video
                            src={url}
                            poster={activeVideoModal.thumbnailUrl}
                            controls
                            autoPlay
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <iframe
                            src={embedSrc}
                            title={activeVideoModal.judul}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}
                      </div>
                    );
                  })()}

                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="truncate">{activeVideoModal.url}</span>
                    <a
                      href={activeVideoModal.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-amber-300 font-bold shrink-0 ml-2"
                    >
                      <span>Buka Penuh</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= PENGATURAN APLIKASI ================= */}
        {route === 'pengaturan' && (
          <div className="flex-1 flex flex-col bg-[#F7F9F8] min-h-0">
            <div className="bg-[#00897B] text-white px-4 py-3.5 shrink-0">
              <h1 className="text-lg font-bold">Pengaturan</h1>
            </div>
            <div className="p-4 space-y-3 flex-1 overflow-y-auto pb-24">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Lokasi GPS Shalat &amp; Kiblat</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">{location.label}</p>
                    <p className="text-[11px] text-slate-500">
                      {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}° · {location.subLabel}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLocationModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#E6F7F2] text-[#00897B] text-xs font-bold"
                  >
                    Ubah
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleRefreshGps}
                  disabled={gpsLoading}
                  className="w-full py-2.5 rounded-xl bg-[#00897B] text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                  <span>Deteksi Ulang GPS Perangkat Sekarang</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
                <button
                  type="button"
                  onClick={() => setRoute('semua_menu')}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <span className="text-sm font-bold text-slate-800">Daftar Semua Fitur Ibadah</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  type="button"
                  onClick={onBackToLanding}
                  className="w-full p-4 flex items-center justify-between text-left text-[#00897B]"
                >
                  <span className="text-sm font-bold">Kembali ke Halaman Utama Pondok Pesantren</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= BOTTOM 5-TAB BAR (MATCHES SCREENSHOTS) ================= */}
        {showBottomTabs && (
          <div className="border-t border-slate-200 bg-white px-2 py-2 grid grid-cols-5 text-[10px] font-bold shrink-0">
            {[
              { id: 'home' as const, label: 'Beranda', icon: <Home className="w-5 h-5" /> },
              { id: 'quran' as const, label: 'Al-Quran', icon: <BookOpen className="w-5 h-5" /> },
              { id: 'kalam' as const, label: 'Artikel', icon: <FileText className="w-5 h-5" /> },
              { id: 'kalender' as const, label: 'Kalender', icon: <CalendarIcon className="w-5 h-5" /> },
              { id: 'pengaturan' as const, label: 'Pengaturan', icon: <Settings className="w-5 h-5" /> },
            ].map((tab) => {
              const active = route === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    if (tab.id === 'quran') setQuranInitialSurah(undefined);
                    setRoute(tab.id);
                  }}
                  className={`flex flex-col items-center gap-1 py-0.5 transition ${
                    active ? 'text-[#00897B]' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ================= GPS & CITY LOCATION PICKER MODAL ================= */}
        {showLocationModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="bg-[#00897B] text-white px-4 py-3.5 flex items-center justify-between">
                <h3 className="text-base font-bold">Pilih Lokasi Jadwal Shalat</h3>
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="p-1 rounded-full hover:bg-white/15"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-3 overflow-y-auto">
                <button
                  type="button"
                  onClick={handleRefreshGps}
                  disabled={gpsLoading}
                  className="w-full py-3 rounded-2xl bg-[#E6F7F2] border border-[#00897B]/40 text-[#00897B] text-xs font-extrabold flex items-center justify-center gap-2"
                >
                  {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                  <span>Gunakan GPS Otomatis Saat Ini</span>
                </button>

                {gpsError && (
                  <p className="text-[11px] text-rose-600 font-semibold text-center">{gpsError}</p>
                )}

                <div className="flex items-center gap-2 bg-[#F1F3F4] rounded-xl px-3 py-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="Cari kota / kabupaten..."
                    className="w-full bg-transparent text-xs focus:outline-hidden"
                  />
                </div>

                <div className="divide-y divide-slate-100">
                  {PRESET_CITIES_ID.filter(
                    (c) =>
                      !locationQuery.trim() ||
                      c.label.toLowerCase().includes(locationQuery.toLowerCase())
                  ).map((city) => {
                    const selected = city.label === location.label;
                    return (
                      <button
                        key={city.label}
                        type="button"
                        onClick={() => {
                          persistLocation(city);
                          setShowLocationModal(false);
                        }}
                        className={`w-full py-3 px-2 flex items-center justify-between text-left rounded-xl ${
                          selected ? 'bg-[#E6F7F2]' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-extrabold text-slate-900">{city.label}</p>
                          <p className="text-[10px] text-slate-500">
                            {city.subLabel} ({city.lat.toFixed(2)}°, {city.lng.toFixed(2)}°)
                          </p>
                        </div>
                        {selected && (
                          <span className="text-[10px] font-extrabold text-[#00897B]">Aktif</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
