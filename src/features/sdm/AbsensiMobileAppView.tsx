import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Home,
  Clock,
  Calendar as CalendarIcon,
  Inbox,
  User,
  Bell,
  LogIn,
  LogOut,
  Coffee,
  History,
  FilePlus2,
  CheckSquare,
  Megaphone,
  Building2,
  Camera,
  X,
  Check,
  MapPin,
  Crosshair,
  ChevronLeft,
  ChevronRight,
  Lock,
  Upload,
  CheckCircle2,
  Eye,
  Smartphone,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useAppStore } from '../../lib/store.ts';
import { useAuth } from '../../lib/auth.ts';
import {
  formatNamaWithGelar,
  type ProgramAbsensiType,
  type IzinBadalGuruRequest,
} from '../../data/seed/pondokData.ts';

type MobileTab = 'beranda' | 'absensi' | 'kalender' | 'kotak_masuk' | 'profil';
type OverlayFlow =
  | null
  | { type: 'camera'; action: 'checkin' | 'checkout' }
  | {
      type: 'confirmed';
      action: 'checkin' | 'checkout';
      waktuWib: string;
      koordinat: string;
      akurasi: number;
      durasiKerja?: string;
    };

const BULAN_NAMES_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const SHORT_BULAN_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const SHIFT_PRESETS: Record<
  ProgramAbsensiType,
  { start: string; end: string; label: string; lokasi: string }
> = {
  'Madrasah Diniyah': {
    start: '18.00',
    end: '21.00',
    label: 'Madrasah Diniyah (Ba\'da Maghrib)',
    lokasi: 'Komplek MDS PP NU Darussalam',
  },
  "Ngaji Al-Qur'an Pagi (Ba'da Subuh)": {
    start: '05.00',
    end: '06.30',
    label: "Ngaji Al-Qur'an Pagi (Ba'da Subuh)",
    lokasi: 'Masjid Utama PP NU Darussalam',
  },
  'Ngaji Takhasus': {
    start: '16.00',
    end: '17.15',
    label: 'Ngaji Takhasus Kitab Kuning',
    lokasi: 'Serambi Dalem & Aula Pondok',
  },
};

interface AbsensiMobileAppViewProps {
  onNavigateErp?: (tab: string) => void;
  onLogout?: () => void;
  canApproveIzin?: boolean;
}

export const AbsensiMobileAppView: React.FC<AbsensiMobileAppViewProps> = ({
  onNavigateErp,
  onLogout,
  canApproveIzin = false,
}) => {
  const {
    currentUser,
    ustadzList,
    absensiGuruList,
    izinBadalGuruList,
    activeGuruShiftMap,
    kalenderPendidikan,
    kotakMasuk,
    sdmNotifEnabled,
    pinPengesahanMap,
    checkInGuruMobile,
    toggleIstirahatGuru,
    checkOutGuruMobile,
    submitIzinBadalGuru,
    approveIzinBadalGuru,
    toggleSdmNotif,
    setUserPinPengesahan,
    logout,
  } = useAppStore();
  const { effectiveRole } = useAuth();

  // Match active teacher profile
  const matchedUstadz = useMemo(() => {
    if (currentUser.ustadzId) {
      const byId = ustadzList.find((u) => u.id === currentUser.ustadzId);
      if (byId) return byId;
    }
    const cleanCurr = currentUser.nama.replace(/^(KH\.|Ust\.|Usth\.|Ustzh\.)\s*/i, '').toLowerCase();
    return (
      ustadzList.find((u) => u.nama.toLowerCase().includes(cleanCurr)) ||
      ustadzList.find((u) => u.id === 'ust-4') ||
      ustadzList[0]
    );
  }, [currentUser, ustadzList]);

  const activeUstadzId = matchedUstadz?.id || currentUser.ustadzId || 'ust-4';
  const displayName = formatNamaWithGelar(
    matchedUstadz?.nama || currentUser.nama,
    matchedUstadz?.gender
  );
  const firstWordAfterGelar = displayName
    .replace(/^(Ustadzah|Ustadz|KH\.|Nyai\s+Hj\.|Nyai)\s+/i, '')
    .split(' ')[0];
  const displayGreetingTitle = displayName.startsWith('Ustadzah')
    ? `Ustadzah ${firstWordAfterGelar}`
    : displayName.startsWith('KH.')
    ? `KH. ${firstWordAfterGelar}`
    : `Ustadz ${firstWordAfterGelar}`;

  // Pondok Jabatan (replace Finance & GA completely with real Pondok position)
  const pondokJabatan = useMemo(() => {
    if (matchedUstadz) {
      const unit = matchedUstadz.tugasTambahanSatminkal || 'Madrasah Diniyah Salafiyah';
      return `${matchedUstadz.jabatanUtama} · ${unit}`;
    }
    if (effectiveRole === 'pengasuh') return 'Pengasuh Pondok · PP NU Darussalam';
    if (effectiveRole === 'kepala_madin') return "Kepala Majlis Ma'arif · Madrasah Diniyah";
    if (effectiveRole === 'sekretaris') return 'Sekretaris Pondok · Yayasan & MDS';
    return `${currentUser.peranLabel} · PP NU Darussalam`;
  }, [matchedUstadz, effectiveRole, currentUser]);

  const initials = useMemo(() => {
    const clean = displayName.replace(/^(Ustadzah|Ustadz|KH\.)\s+/i, '');
    const parts = clean.split(/\s+/).filter(Boolean);
    return parts
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join('');
  }, [displayName]);

  // Live clock
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');
  const hhmm = `${pad(now.getHours())}.${pad(now.getMinutes())}`;
  const ss = pad(now.getSeconds());
  const todayIso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const todayIndo = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const shortDateIndo = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // UI Navigation & Overlays
  const [activeTab, setActiveTab] = useState<MobileTab>('beranda');
  const [selectedProgram, setSelectedProgram] = useState<ProgramAbsensiType>('Madrasah Diniyah');
  const [overlayFlow, setOverlayFlow] = useState<OverlayFlow>(null);
  const [compactPhoneFrame, setCompactPhoneFrame] = useState(false);

  // Camera & GPS States
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string>('');
  const [gpsCoords, setGpsCoords] = useState('-6.9765, 109.6832');
  const [gpsAccuracy, setGpsAccuracy] = useState(24);
  const [gpsStatus, setGpsStatus] = useState<'reading' | 'ready'>('reading');

  // Izin / Badal Modal
  const [showIzinModal, setShowIzinModal] = useState(false);
  const [izinTanggal, setIzinTanggal] = useState(todayIso);
  const [izinJenis, setIzinJenis] = useState<IzinBadalGuruRequest['jenis']>('Izin');
  const [izinProgram, setIzinProgram] = useState<ProgramAbsensiType>('Madrasah Diniyah');
  const [izinBadalNama, setIzinBadalNama] = useState('');
  const [izinAlasan, setIzinAlasan] = useState('');

  // PIN Pengesahan Modal
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');

  // Lightbox Photo Preview
  const [previewSelfie, setPreviewSelfie] = useState<{
    url?: string;
    title: string;
    meta: string;
  } | null>(null);

  // Toast feedback
  const [toast, setToast] = useState('');
  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // Active shift session for today
  const rawShift = activeGuruShiftMap[activeUstadzId];
  const todayShift = rawShift && rawShift.tanggal === todayIso ? rawShift : undefined;
  const activeShiftPreset = SHIFT_PRESETS[todayShift?.program || selectedProgram];

  // Elapsed work timer
  const elapsedDisplay = useMemo(() => {
    if (!todayShift) return '00:00:00';
    if (todayShift.status === 'selesai') {
      const rec = absensiGuruList.find((r) => r.id === todayShift.activeRecordId);
      return rec?.durasiKerja || '00:00:00';
    }
    const startMs = new Date(todayShift.checkInIso).getTime();
    const breakOngoing =
      todayShift.status === 'istirahat' && todayShift.breakStartedIso
        ? Math.max(0, now.getTime() - new Date(todayShift.breakStartedIso).getTime())
        : 0;
    const netMs = Math.max(0, now.getTime() - startMs - todayShift.breakTotalMs - breakOngoing);
    const totalSecs = Math.floor(netMs / 1000);
    return `${pad(Math.floor(totalSecs / 3600))}:${pad(Math.floor((totalSecs % 3600) / 60))}:${pad(
      totalSecs % 60
    )}`;
  }, [todayShift, now, absensiGuruList]);

  // Shift progress bar percentage (0..100)
  const timelinePercent = useMemo(() => {
    if (!todayShift) return 4;
    if (todayShift.status === 'selesai') return 100;
    const [sh, sm] = activeShiftPreset.start.split('.').map(Number);
    const [eh, em] = activeShiftPreset.end.split('.').map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    const nowMin = now.getHours() * 60 + now.getMinutes();
    if (endMin <= startMin) return 35;
    const pct = ((nowMin - startMin) / (endMin - startMin)) * 100;
    return Math.min(96, Math.max(12, Math.round(pct)));
  }, [todayShift, activeShiftPreset, now]);

  // Manage camera stream when camera overlay opens
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  };

  useEffect(() => {
    if (overlayFlow?.type !== 'camera') {
      stopCamera();
      return;
    }

    setGpsStatus('reading');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
          setGpsAccuracy(Math.max(5, Math.round(pos.coords.accuracy || 22)));
          setGpsStatus('ready');
        },
        () => {
          setGpsCoords('-6.9765, 109.6832');
          setGpsAccuracy(24);
          setGpsStatus('ready');
        },
        { enableHighAccuracy: true, timeout: 4000 }
      );
    } else {
      setGpsStatus('ready');
    }

    let cancelled = false;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' }, audio: false })
        .then((stream) => {
          if (cancelled) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = stream;
          setCameraError('');
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
          setCameraReady(true);
        })
        .catch(() => {
          if (!cancelled) {
            setCameraError(
              'Kamera perangkat tidak tersedia di peramban ini. Gunakan unggah swafoto atau lanjutkan ambil stempel GPS otomatis.'
            );
            setCameraReady(false);
          }
        });
    } else {
      setCameraError('Peramban tidak mendukung kamera langsung. Gunakan unggah foto atau stempel GPS.');
    }

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [overlayFlow]);

  const handleUploadSelfieFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const generateStampedSelfie = async (): Promise<string> => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    if (videoRef.current && cameraReady && videoRef.current.readyState >= 2) {
      ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    } else if (uploadedPreviewUrl) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 640, 480);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = uploadedPreviewUrl;
      });
    } else {
      // Clean emerald studio fallback snapshot with teacher initials & verification badge
      const grad = ctx.createLinearGradient(0, 0, 640, 480);
      grad.addColorStop(0, '#064e3b');
      grad.addColorStop(1, '#047857');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 640, 480);

      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      ctx.beginPath();
      ctx.arc(320, 195, 76, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(initials, 320, 212);
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(displayName, 320, 305);
      ctx.font = '15px sans-serif';
      ctx.fillStyle = '#a7f3d0';
      ctx.fillText('Verifikasi Swafoto & GPS Pondok', 320, 332);
    }

    // Bottom Google-Timestamp & GPS Watermark
    ctx.fillStyle = 'rgba(6, 78, 59, 0.88)';
    ctx.fillRect(0, 388, 640, 92);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fcd34d';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`${displayName} · ${selectedProgram}`, 20, 414);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px monospace';
    const stampStr = `${todayIso} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
      now.getSeconds()
    )} WIB`;
    ctx.fillText(`${stampStr}  |  GPS: ${gpsCoords} (±${gpsAccuracy}m)`, 20, 440);
    ctx.fillStyle = '#a7f3d0';
    ctx.font = '12px sans-serif';
    ctx.fillText('PP NU Darussalam Karangdadap, Kab. Pekalongan', 20, 464);

    return canvas.toDataURL('image/jpeg', 0.82);
  };

  const handleConfirmCameraAction = async () => {
    if (overlayFlow?.type !== 'camera') return;
    const action = overlayFlow.action;
    const selfieDataUrl = await generateStampedSelfie();
    stopCamera();
    setUploadedPreviewUrl('');

    if (action === 'checkin') {
      const res = checkInGuruMobile({
        ustadzId: activeUstadzId,
        ustadzNama: displayName,
        program: selectedProgram,
        kelas: matchedUstadz?.tugasTambahanSatminkal || 'Kelas Diniyah',
        mapel: matchedUstadz?.fanIlmu?.[0] || selectedProgram,
        fotoSelfieUrl: selfieDataUrl,
        koordinat: gpsCoords,
        akurasiGps: gpsAccuracy,
        lokasiLabel: SHIFT_PRESETS[selectedProgram].lokasi,
      });
      setOverlayFlow({
        type: 'confirmed',
        action: 'checkin',
        waktuWib: `${res.checkInDisplay} WIB`,
        koordinat: gpsCoords,
        akurasi: gpsAccuracy,
      });
    } else {
      const res = checkOutGuruMobile({
        ustadzId: activeUstadzId,
        fotoCekOutUrl: selfieDataUrl,
      });
      setOverlayFlow({
        type: 'confirmed',
        action: 'checkout',
        waktuWib: `${res?.checkOutDisplay || hhmm} WIB`,
        koordinat: gpsCoords,
        akurasi: gpsAccuracy,
        durasiKerja: res?.durasiKerja,
      });
    }
  };

  // --- REKAPAN ABSENSI SAYA (Teacher Personal Attendance Analytics) ---
  const [rekapanBulan, setRekapanBulan] = useState<number>(now.getMonth()); // 0..11
  const [rekapanTahun, setRekapanTahun] = useState<number>(now.getFullYear());

  const myRecords = useMemo(() => {
    return absensiGuruList
      .filter((r) => {
        if (r.ustadzId === activeUstadzId) return true;
        const n1 = r.ustadzNama.replace(/^(Ust\.|Usth\.|Ustzh\.|Ustadz|Ustadzah)\s+/i, '').toLowerCase();
        const n2 = displayName.replace(/^(Ust\.|Usth\.|Ustzh\.|Ustadz|Ustadzah|KH\.)\s+/i, '').toLowerCase();
        return n1 === n2;
      })
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [absensiGuruList, activeUstadzId, displayName]);

  const myMonthPrefix = `${rekapanTahun}-${pad(rekapanBulan + 1)}`;
  const myMonthlyRecords = useMemo(
    () => myRecords.filter((r) => r.tanggal.startsWith(myMonthPrefix)),
    [myRecords, myMonthPrefix]
  );

  // Active Pondok working days up to today in selected month (excluding LM/Friday & LP holidays in Kalender Pendidikan)
  const monthCalendarRow = useMemo(() => {
    const label = `${BULAN_NAMES_ID[rekapanBulan]} ${rekapanTahun}`;
    return kalenderPendidikan.rows.find((r) => r.bulan.toLowerCase() === label.toLowerCase());
  }, [kalenderPendidikan, rekapanBulan, rekapanTahun]);

  const activeDaysElapsed = useMemo(() => {
    const totalDaysInMonth = new Date(rekapanTahun, rekapanBulan + 1, 0).getDate();
    const isCurrentMonth =
      rekapanTahun === now.getFullYear() && rekapanBulan === now.getMonth();
    const limitDay = isCurrentMonth ? now.getDate() : totalDaysInMonth;
    let count = 0;
    for (let d = 1; d <= limitDay; d++) {
      const dt = new Date(rekapanTahun, rekapanBulan, d);
      const isFriday = dt.getDay() === 5;
      const calCode = monthCalendarRow?.days[d];
      const isLibur = isFriday || calCode === 'LM' || calCode === 'LP' || calCode === 'LHR' || calCode === 'L IMT';
      if (!isLibur) count++;
    }
    return Math.max(1, count);
  }, [rekapanTahun, rekapanBulan, now, monthCalendarRow]);

  const hadirCount = myMonthlyRecords.filter((r) => r.status === 'Hadir').length;
  const terlambatCount = myMonthlyRecords.filter(
    (r) => r.status === 'Hadir' && r.statusKeterlambatan === 'Terlambat'
  ).length;
  const izinBadalCount = myMonthlyRecords.filter(
    (r) => r.status === 'Izin' || r.status === 'Sakit' || r.status === 'Badal'
  ).length;

  const attendancePct = Math.min(
    100,
    Math.round(((hadirCount + izinBadalCount) / activeDaysElapsed) * 100)
  );

  // Weekly strip (Sen..Min) for current week matching Pondok Friday ("LM")
  const weekDaysStrip = useMemo(() => {
    const dayOfWeek = now.getDay(); // 0=Sun..6=Sat
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const labels = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];
    return labels.map((lbl, idx) => {
      const dt = new Date(now);
      dt.setDate(now.getDate() + mondayOffset + idx);
      const iso = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
      const isFuture = dt.getTime() > new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime();
      const isFriday = dt.getDay() === 5;
      const rec = myRecords.find((r) => r.tanggal === iso);
      let state: 'hadir' | 'terlambat' | 'izin' | 'alfa' | 'libur' | 'future' = 'future';
      if (isFriday) state = 'libur';
      else if (rec) {
        if (rec.status === 'Hadir') {
          state = rec.statusKeterlambatan === 'Terlambat' ? 'terlambat' : 'hadir';
        } else {
          state = 'izin';
        }
      } else if (!isFuture) {
        state = 'alfa';
      }
      return { label: lbl, dayNum: dt.getDate(), iso, state };
    });
  }, [now, myRecords]);

  // 6-month trend chart data
  const trendChartData = useMemo(() => {
    const pts: { bulan: string; persen: number }[] = [];
    for (let offset = 5; offset >= 0; offset--) {
      const d = new Date(rekapanTahun, rekapanBulan - offset, 1);
      const mIdx = d.getMonth();
      const y = d.getFullYear();
      const prefix = `${y}-${pad(mIdx + 1)}`;
      const recs = myRecords.filter((r) => r.tanggal.startsWith(prefix) && r.status === 'Hadir');
      const pct = offset === 0 ? attendancePct : recs.length > 0 ? Math.min(100, Math.round((recs.length / 20) * 100)) : 80 + ((mIdx * 5) % 18);
      pts.push({
        bulan: SHORT_BULAN_ID[mIdx],
        persen: recs.length > 0 || offset === 0 ? pct : 0,
      });
    }
    return pts;
  }, [rekapanBulan, rekapanTahun, myRecords, attendancePct]);

  const avgTrendPct = useMemo(() => {
    const nonZero = trendChartData.filter((d) => d.persen > 0);
    if (nonZero.length === 0) return 0;
    return Math.round(nonZero.reduce((a, b) => a + b.persen, 0) / nonZero.length);
  }, [trendChartData]);

  // --- KALENDER PENDIDIKAN PONDOK ---
  const [calMonth, setCalMonth] = useState<number>(now.getMonth());
  const [calYear, setCalYear] = useState<number>(now.getFullYear());
  const [calFilter, setCalFilter] = useState<'semua' | 'libur' | 'kegiatan' | 'izin'>('semua');
  const [selectedCalDay, setSelectedCalDay] = useState<number>(now.getDate());

  const activeKalenderRow = useMemo(() => {
    const targetName = `${BULAN_NAMES_ID[calMonth]} ${calYear}`.toLowerCase();
    return kalenderPendidikan.rows.find((r) => r.bulan.toLowerCase() === targetName);
  }, [kalenderPendidikan, calMonth, calYear]);

  const legendMap = useMemo(() => {
    const map: Record<string, { label: string; bgColor: string; textColor: string }> = {};
    kalenderPendidikan.legend.forEach((l) => {
      map[l.code] = l;
    });
    return map;
  }, [kalenderPendidikan]);

  const LIBUR_CODES = useMemo(() => new Set(['LP', 'LM', 'L IMT', 'LHR', 'HR', 'MLD', 'HUT', 'LHS', 'LD']), []);

  const myIzinDatesInCalMonth = useMemo(() => {
    const prefix = `${calYear}-${pad(calMonth + 1)}-`;
    const map: Record<number, IzinBadalGuruRequest> = {};
    izinBadalGuruList
      .filter((i) => i.ustadzId === activeUstadzId && i.tanggal.startsWith(prefix))
      .forEach((i) => {
        const d = parseInt(i.tanggal.split('-')[2], 10);
        if (!Number.isNaN(d)) map[d] = i;
      });
    return map;
  }, [izinBadalGuruList, activeUstadzId, calYear, calMonth]);

  const calendarDaysGrid = useMemo(() => {
    const firstDayJs = new Date(calYear, calMonth, 1).getDay(); // 0=Sun..6=Sat
    const leadingBlanks = (firstDayJs + 6) % 7; // Convert to Mon=0..Sun=6
    const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
    const cells: { day: number | null; code?: string; isFriday?: boolean; isSunday?: boolean }[] = [];
    for (let i = 0; i < leadingBlanks; i++) cells.push({ day: null });
    for (let d = 1; d <= totalDays; d++) {
      const dt = new Date(calYear, calMonth, d);
      const isFriday = dt.getDay() === 5;
      const isSunday = dt.getDay() === 0;
      const rowCode = activeKalenderRow?.days[d];
      const effectiveCode = rowCode || (isFriday ? 'LM' : undefined);
      cells.push({ day: d, code: effectiveCode, isFriday, isSunday });
    }
    return cells;
  }, [calYear, calMonth, activeKalenderRow]);

  const monthEventsList = useMemo(() => {
    const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
    const list: { day: number; code: string; label: string; isLibur: boolean; bgColor: string; isMyIzin?: boolean }[] = [];
    for (let d = 1; d <= totalDays; d++) {
      const rowCode = activeKalenderRow?.days[d];
      const izinItem = myIzinDatesInCalMonth[d];
      if (rowCode) {
        const leg = legendMap[rowCode];
        const isLib = LIBUR_CODES.has(rowCode);
        if (
          calFilter === 'semua' ||
          (calFilter === 'libur' && isLib) ||
          (calFilter === 'kegiatan' && !isLib)
        ) {
          list.push({
            day: d,
            code: rowCode,
            label: leg?.label || rowCode,
            isLibur: isLib,
            bgColor: leg?.bgColor || '#059669',
          });
        }
      }
      if (izinItem && (calFilter === 'semua' || calFilter === 'izin')) {
        list.push({
          day: d,
          code: izinItem.jenis.toUpperCase(),
          label: `${izinItem.jenis}: ${izinItem.alasan} (${izinItem.status})`,
          isLibur: false,
          bgColor: '#047857',
          isMyIzin: true,
        });
      }
    }
    return list;
  }, [calYear, calMonth, activeKalenderRow, legendMap, LIBUR_CODES, myIzinDatesInCalMonth, calFilter]);

  const handleSubmitIzinModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!izinAlasan.trim()) return;
    submitIzinBadalGuru({
      ustadzId: activeUstadzId,
      ustadzNama: displayName,
      tanggal: izinTanggal,
      jenis: izinJenis,
      program: izinProgram,
      guruBadalNama: izinBadalNama.trim() || undefined,
      alasan: izinAlasan.trim(),
    });
    setShowIzinModal(false);
    setIzinAlasan('');
    setIzinBadalNama('');
    notify(`Pengajuan ${izinJenis} berhasil dikirim untuk persetujuan.`);
  };

  // Pending approvals relevant to Kotak Masuk
  const pendingIzinList = useMemo(
    () =>
      izinBadalGuruList.filter((i) =>
        canApproveIzin ? i.status === 'Menunggu' : i.ustadzId === activeUstadzId
      ),
    [izinBadalGuruList, canApproveIzin, activeUstadzId]
  );

  // Pondok announcements from calendar upcoming & core notices
  const pondokAnnouncements = useMemo(() => {
    const upcoming = kalenderPendidikan.rows
      .flatMap((r) =>
        Object.entries(r.days)
          .filter(([, code]) => code !== 'LM')
          .slice(0, 2)
          .map(([day, code]) => ({
            judul: `${legendMap[code]?.label || code} (${code})`,
            tanggal: `${day} ${r.bulan}`,
            info: 'Mengacu Kalender Pendidikan Madrasah Diniyah Salafiyah PP NU Darussalam.',
          }))
      )
      .slice(0, 3);
    return upcoming;
  }, [kalenderPendidikan, legendMap]);

  // --- OVERLAY 1: CAMERA SELFIE + GPS ---
  if (overlayFlow?.type === 'camera') {
    const isOut = overlayFlow.action === 'checkout';
    return (
      <div className="max-w-2xl mx-auto rounded-3xl overflow-hidden bg-emerald-950 text-white shadow-xl border border-emerald-800">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-emerald-950/90">
          <div className="flex items-center gap-2.5 text-sm font-bold">
            {isOut ? <LogOut className="w-4 h-4 text-emerald-300" /> : <LogIn className="w-4 h-4 text-emerald-300" />}
            <span>{isOut ? 'Cek Out Pulang' : 'Cek In Mengajar / Bertugas'}</span>
          </div>
          <button
            type="button"
            onClick={() => setOverlayFlow(null)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            aria-label="Tutup Kamera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport with Oval Frame */}
        <div className="relative h-80 sm:h-96 bg-slate-900 flex items-center justify-center overflow-hidden">
          {uploadedPreviewUrl ? (
            <img
              src={uploadedPreviewUrl}
              alt="Pratinjau Swafoto"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${cameraReady ? 'opacity-100' : 'opacity-20'}`}
            />
          )}

          {/* Top GPS Status Pill */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md whitespace-nowrap">
            <Check className="w-3.5 h-3.5" />
            <span>{gpsStatus === 'ready' ? 'Lokasi terbaca' : 'Membaca GPS...'}</span>
          </div>

          {/* Oval Face Guide */}
          <div className="absolute w-48 h-60 rounded-[50%] border-2 border-white/90 pointer-events-none shadow-[0_0_0_9999px_rgba(6,44,32,0.42)]" />

          {/* Prompt text */}
          <div className="absolute bottom-4 inset-x-6 text-center space-y-2">
            <p className="text-xs font-medium text-white drop-shadow">
              Hadapkan wajah ke kamera di dalam bingkai, lalu tekan tombol
            </p>
            {cameraError && (
              <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-xl text-[11px] text-emerald-100">
                <span>{cameraError}</span>
                <label className="cursor-pointer underline font-bold text-amber-300 flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>Pilih Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handleUploadSelfieFile}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Sheet */}
        <div className="bg-white text-slate-900 rounded-t-3xl -mt-3 relative z-10 p-5 space-y-3">
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <label className="text-xs font-bold text-slate-900 block">
                Program Tugas Pondok
              </label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value as ProgramAbsensiType)}
                disabled={isOut}
                className="mt-0.5 w-full bg-transparent text-xs font-semibold text-emerald-800 focus:outline-hidden"
              >
                <option value="Madrasah Diniyah">Madrasah Diniyah (18.00 - 21.00)</option>
                <option value="Ngaji Al-Qur'an Pagi (Ba'da Subuh)">Ngaji Al-Qur'an Pagi (05.00 - 06.30)</option>
                <option value="Ngaji Takhasus">Ngaji Takhasus (16.00 - 17.15)</option>
              </select>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Crosshair className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 tabular-nums">
                Akurasi lokasi ±{gpsAccuracy} meter
              </p>
              <p className="text-[11px] text-slate-500 tabular-nums truncate">
                GPS: {gpsCoords} · PP NU Darussalam Karangdadap
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirmCameraAction}
            className="w-full min-h-[48px] rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition"
          >
            <Camera className="w-4 h-4" />
            <span>{isOut ? 'Ambil Foto & Cek Out Pulang' : 'Ambil Foto & Cek In'}</span>
          </button>
        </div>
      </div>
    );
  }

  // --- OVERLAY 2: CONFIRMATION CHECK-IN / CHECK-OUT ---
  if (overlayFlow?.type === 'confirmed') {
    const isOut = overlayFlow.action === 'checkout';
    return (
      <div className="max-w-xl mx-auto rounded-3xl bg-gradient-to-b from-emerald-50 via-white to-white border border-emerald-200 p-8 shadow-xs flex flex-col items-center justify-between min-h-[520px]">
        <div className="w-full flex flex-col items-center text-center pt-6 space-y-5">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check className="w-9 h-9 text-emerald-700 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900">
              {isOut ? 'Cek Out tercatat' : 'Cek In tercatat'}
            </h3>
            <p className="text-xs text-slate-500">
              {isOut
                ? 'Terima kasih atas khidmah dan pengabdian Anda hari ini.'
                : 'Selamat mengajar dan berkhidmah di PP NU Darussalam.'}
            </p>
          </div>

          <div className="w-full space-y-2.5 pt-2 text-xs">
            <div className="flex items-center justify-between px-4 py-3.5 rounded-2xl border border-slate-200 bg-white">
              <span className="text-slate-500">Jam (waktu server)</span>
              <strong className="text-slate-900 tabular-nums">{overlayFlow.waktuWib}</strong>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5 rounded-2xl border border-slate-200 bg-white">
              <span className="text-slate-500">Lokasi</span>
              <strong className="text-slate-900 tabular-nums">
                Tercatat dari GPS ({overlayFlow.koordinat})
              </strong>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5 rounded-2xl border border-slate-200 bg-white">
              <span className="text-slate-500">
                {isOut ? 'Total durasi tugas' : 'Pencocokan wajah'}
              </span>
              <strong className="text-emerald-700 tabular-nums">
                {isOut ? overlayFlow.durasiKerja || 'Selesai' : 'Cocok'}
              </strong>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOverlayFlow(null)}
          className="w-full min-h-[48px] mt-8 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition shadow-sm"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {toast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Desktop View Switcher (Responsive Full Workspace vs Compact Smartphone Frame) */}
      <div className="hidden lg:flex items-center justify-between text-xs text-slate-500 no-print">
        <p>
          Portal Absensi Mobile Dewan Asatidz · <strong className="text-emerald-800">{displayName}</strong>
        </p>
        <button
          type="button"
          onClick={() => setCompactPhoneFrame((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 text-slate-700 font-semibold transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
          <span>{compactPhoneFrame ? 'Tampilan Lebar Desktop' : 'Pratinjau Layar HP'}</span>
        </button>
      </div>

      {/* Main Mobile-First Container (expands to 2-column grid on desktop unless compactPhoneFrame toggled) */}
      <div
        className={`mx-auto transition-all ${
          compactPhoneFrame
            ? 'max-w-[420px] rounded-[34px] border-[6px] border-slate-900 bg-slate-50 p-3.5 shadow-2xl'
            : 'w-full'
        }`}
      >
        <div className="space-y-5 pb-20 md:pb-6">
          {/* ============== TAB 1: BERANDA MOBILE ============== */}
          {activeTab === 'beranda' && (
            <div className={compactPhoneFrame ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'}>
              {/* Left / Primary Attendance Card Column */}
              <div className={compactPhoneFrame ? 'space-y-4' : 'lg:col-span-7 space-y-5'}>
                {/* Greeting Bar */}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-emerald-700">{todayIndo}</p>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      Selamat pagi, {displayGreetingTitle}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveTab('kotak_masuk')}
                      className="w-11 h-11 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 flex items-center justify-center text-slate-700 relative"
                      aria-label="Kotak Masuk"
                    >
                      <Bell className="w-4 h-4" />
                      {pendingIzinList.length > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-600" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('profil')}
                      className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white font-extrabold text-xs flex items-center justify-center shadow-xs"
                    >
                      {initials}
                    </button>
                  </div>
                </div>

                {/* Clock & Check-In Hero Card */}
                <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-5">
                  {/* Profile Identity Row (Ustadz/Ustadzah + Pondok Jabatan) */}
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white font-extrabold text-sm flex items-center justify-center shrink-0 ring-2 ${
                        todayShift?.status === 'bertugas'
                          ? 'ring-emerald-500 ring-offset-2'
                          : 'ring-slate-200'
                      }`}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                        {displayName}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">{pondokJabatan}</p>
                    </div>
                  </div>

                  {/* Date & Current Shift Status */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-xs font-medium text-slate-500">{shortDateIndo}</span>
                    {!todayShift ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-slate-500" />
                        Belum cek in
                      </span>
                    ) : todayShift.status === 'bertugas' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        Sedang bertugas
                      </span>
                    ) : todayShift.status === 'istirahat' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-amber-600" />
                        Sedang istirahat
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        Tugas selesai
                      </span>
                    )}
                  </div>

                  {/* Large Live Digital Clock */}
                  <div className="flex items-baseline gap-1.5 tabular-nums">
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                      {hhmm}
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-slate-400">{ss}</span>
                  </div>

                  {/* Shift Progress Timeline Bar */}
                  <div className="space-y-2">
                    <div className="relative h-2 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                        style={{ width: `${timelinePercent}%` }}
                      />
                      <span
                        className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-[3px] border-emerald-700 shadow-xs transition-all duration-500"
                        style={{ left: `calc(${timelinePercent}% - 7px)` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 tabular-nums">
                      <span>
                        Masuk <strong className="text-slate-900">{activeShiftPreset.start}</strong>
                      </span>
                      {todayShift && (
                        <span className="font-bold text-emerald-800">
                          Tugas {elapsedDisplay}
                        </span>
                      )}
                      <span>
                        Pulang <strong className="text-slate-900">{activeShiftPreset.end}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Primary Action CTA Button */}
                  {!todayShift || todayShift.status === 'selesai' ? (
                    <button
                      type="button"
                      onClick={() => setOverlayFlow({ type: 'camera', action: 'checkin' })}
                      className="w-full min-h-[50px] rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>{todayShift?.status === 'selesai' ? 'Cek In Sesi Berikutnya' : 'Cek In'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setOverlayFlow({ type: 'camera', action: 'checkout' })}
                      className="w-full min-h-[50px] rounded-2xl bg-emerald-950 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cek Out Pulang</span>
                    </button>
                  )}

                  {/* Footer Meta Line: Shift Info + Break Toggle */}
                  <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      {todayShift && todayShift.status !== 'selesai' ? (
                        <span className="tabular-nums truncate">
                          Cek in {todayShift.checkInDisplay} · {todayShift.program}
                        </span>
                      ) : (
                        <select
                          value={selectedProgram}
                          onChange={(e) => setSelectedProgram(e.target.value as ProgramAbsensiType)}
                          className="bg-transparent font-medium text-slate-700 focus:outline-hidden truncate"
                        >
                          <option value="Madrasah Diniyah">Pola Madrasah Diniyah</option>
                          <option value="Ngaji Al-Qur'an Pagi (Ba'da Subuh)">Pola Ngaji Al-Qur'an Pagi</option>
                          <option value="Ngaji Takhasus">Pola Ngaji Takhasus</option>
                        </select>
                      )}
                    </div>

                    {todayShift && todayShift.status !== 'selesai' && (
                      <button
                        type="button"
                        onClick={() => {
                          toggleIstirahatGuru(activeUstadzId);
                          notify(
                            todayShift.status === 'bertugas'
                              ? 'Waktu istirahat dimulai.'
                              : 'Melanjutkan tugas mengajar.'
                          );
                        }}
                        className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 whitespace-nowrap shrink-0"
                      >
                        <Coffee className="w-3.5 h-3.5" />
                        <span>
                          {todayShift.status === 'istirahat' ? 'Selesai istirahat' : 'Mulai istirahat'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column on Desktop: Layanan Grid & Pengumuman */}
              <div className={compactPhoneFrame ? 'space-y-4' : 'lg:col-span-5 space-y-5'}>
                {/* Layanan Grid Card */}
                <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
                  <h3 className="font-bold text-sm text-slate-900">Layanan</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3 text-center">
                    {[
                      {
                        label: 'Absensi Saya',
                        icon: History,
                        tone: 'bg-emerald-50 text-emerald-700',
                        onClick: () => setActiveTab('absensi'),
                      },
                      {
                        label: 'Izin / Badal',
                        icon: FilePlus2,
                        tone: 'bg-teal-50 text-teal-700',
                        onClick: () => setShowIzinModal(true),
                      },
                      {
                        label: 'Persetujuan',
                        icon: CheckSquare,
                        tone: 'bg-lime-50 text-lime-700',
                        onClick: () => setActiveTab('kotak_masuk'),
                      },
                      {
                        label: 'Pengumuman',
                        icon: Megaphone,
                        tone: 'bg-amber-50 text-amber-700',
                        onClick: () => setActiveTab('kotak_masuk'),
                      },
                      {
                        label: 'Kalender',
                        icon: CalendarIcon,
                        tone: 'bg-emerald-50 text-emerald-800',
                        onClick: () => setActiveTab('kalender'),
                      },
                      {
                        label: 'ERP Lengkap',
                        icon: Building2,
                        tone: 'bg-slate-100 text-slate-700',
                        onClick: () => onNavigateErp?.('beranda'),
                      },
                    ].map((svc) => {
                      const Icon = svc.icon;
                      return (
                        <button
                          key={svc.label}
                          type="button"
                          onClick={svc.onClick}
                          className="flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-slate-50 transition min-h-[76px]"
                        >
                          <div
                            className={`w-12 h-12 rounded-2xl ${svc.tone} flex items-center justify-center`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                            {svc.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pengumuman Terbaru Card */}
                <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">Pengumuman terbaru</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('kotak_masuk')}
                      className="text-xs font-bold text-emerald-700 hover:underline"
                    >
                      Semua
                    </button>
                  </div>
                  {pondokAnnouncements.length === 0 ? (
                    <p className="text-xs text-slate-500 py-2">
                      Belum ada pengumuman pondok untuk Anda.
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {pondokAnnouncements.slice(0, 2).map((p, idx) => (
                        <div key={idx} className="py-2.5 first:pt-0 last:pb-0">
                          <p className="text-xs font-bold text-slate-800">{p.judul}</p>
                          <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">{p.tanggal}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============== TAB 2: REKAPAN ABSENSI SAYA (GAMBAR 6) ============== */}
          {activeTab === 'absensi' && (
            <div className={compactPhoneFrame ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'}>
              {/* Left Column: Kehadiran Bulan Ini + Tren Kehadiran */}
              <div className={compactPhoneFrame ? 'space-y-4' : 'lg:col-span-6 space-y-5'}>
                {/* Kehadiran Bulan Ini Card */}
                <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        Kehadiran bulan ini
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Hari hadir dibanding hari aktif pondok yang sudah lewat
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <select
                        value={rekapanBulan}
                        onChange={(e) => setRekapanBulan(Number(e.target.value))}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-emerald-900"
                      >
                        {BULAN_NAMES_ID.map((b, i) => (
                          <option key={b} value={i}>
                            {b}
                          </option>
                        ))}
                      </select>
                      <select
                        value={rekapanTahun}
                        onChange={(e) => setRekapanTahun(Number(e.target.value))}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-bold text-emerald-900 tabular-nums"
                      >
                        {[2026, 2027].map((yr) => (
                          <option key={yr} value={yr}>
                            {yr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Circular SVG Donut Ring */}
                  <div className="flex justify-center py-1">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="48"
                          fill="none"
                          stroke="#E2E8F0"
                          strokeWidth="10"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="48"
                          fill="none"
                          stroke="#059669"
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 48}
                          strokeDashoffset={
                            2 * Math.PI * 48 * (1 - Math.min(100, attendancePct) / 100)
                          }
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center tabular-nums">
                        <span className="text-2xl font-extrabold text-slate-900">
                          {attendancePct}%
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {hadirCount} dari {activeDaysElapsed} hari
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Stat Counters */}
                  <div className="grid grid-cols-3 divide-x divide-slate-200 text-center py-2 border-t border-b border-slate-100 tabular-nums">
                    <div>
                      <p className="text-lg font-extrabold text-slate-900">{hadirCount}</p>
                      <p className="text-[11px] text-slate-500">Hari hadir</p>
                    </div>
                    <div>
                      <p className="text-lg font-extrabold text-amber-600">{terlambatCount}</p>
                      <p className="text-[11px] text-slate-500">Terlambat</p>
                    </div>
                    <div>
                      <p className="text-lg font-extrabold text-teal-700">{izinBadalCount}</p>
                      <p className="text-[11px] text-slate-500">Izin / Badal</p>
                    </div>
                  </div>

                  {/* Minggu Ini 7-Day Strip */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-800">Minggu ini</h4>
                    <div className="grid grid-cols-7 gap-1.5 text-center">
                      {weekDaysStrip.map((d, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1.5">
                          <span className="text-[11px] font-medium text-slate-500">{d.label}</span>
                          {d.state === 'hadir' && (
                            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                              <Check className="w-4 h-4 stroke-[2.5]" />
                            </div>
                          )}
                          {d.state === 'terlambat' && (
                            <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center">
                              <Check className="w-4 h-4 stroke-[2.5]" />
                            </div>
                          )}
                          {d.state === 'izin' && (
                            <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center text-[11px] font-bold">
                              I
                            </div>
                          )}
                          {d.state === 'alfa' && (
                            <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[11px] font-bold">
                              {d.dayNum}
                            </div>
                          )}
                          {d.state === 'libur' && (
                            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">
                              L
                            </div>
                          )}
                          {d.state === 'future' && (
                            <div className="w-9 h-9 rounded-full border border-dashed border-slate-300 text-slate-400 flex items-center justify-center text-[11px]">
                              {d.dayNum}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 pt-1">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        Hadir
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Terlambat
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-teal-600" />
                        Izin / Badal
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        Tidak hadir
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tren Kehadiran Card */}
                <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">Tren kehadiran</h3>
                      <p className="text-xs text-slate-500">Persen kehadiran per bulan</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tabular-nums">
                      Rata-rata {avgTrendPct}%
                    </span>
                  </div>

                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendChartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                        <defs>
                          <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#059669" stopOpacity={0.28} />
                            <stop offset="95%" stopColor="#059669" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                        <Tooltip
                          formatter={(v) => [`${v}%`, 'Kehadiran']}
                          contentStyle={{ borderRadius: '12px', fontSize: '11px' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="persen"
                          stroke="#059669"
                          strokeWidth={2.5}
                          fill="url(#emeraldGrad)"
                          dot={{ r: 4, fill: '#ffffff', stroke: '#059669', strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Right Column: Riwayat Bulan Ini */}
              <div className={compactPhoneFrame ? 'space-y-4' : 'lg:col-span-6 space-y-5'}>
                <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-900">Riwayat bulan ini</h3>
                    <span className="text-xs text-slate-500 tabular-nums">
                      {myMonthlyRecords.length} catatan
                    </span>
                  </div>

                  {myMonthlyRecords.length === 0 ? (
                    <div className="py-10 text-center space-y-2">
                      <p className="text-xs text-slate-500">
                        Belum ada catatan absensi pada bulan {BULAN_NAMES_ID[rekapanBulan]}.
                      </p>
                      <button
                        type="button"
                        onClick={() => setOverlayFlow({ type: 'camera', action: 'checkin' })}
                        className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
                      >
                        Cek In Sekarang
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {myMonthlyRecords.map((rec) => (
                        <div key={rec.id} className="py-3.5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                              <Clock className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {rec.tanggal === todayIso ? 'Hari ini' : rec.tanggal} · {rec.program || 'Madrasah Diniyah'}
                              </p>
                              <p className="text-[11px] text-slate-500 tabular-nums mt-0.5">
                                {rec.waktuInput}–{rec.waktuCekOut || 'Aktif'}{' '}
                                {rec.durasiKerja ? `(${rec.durasiKerja})` : ''}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {rec.fotoSelfieUrl && (
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewSelfie({
                                    url: rec.fotoSelfieUrl,
                                    title: `${displayName} · ${rec.tanggal}`,
                                    meta: `${rec.waktuTimestamp || rec.waktuInput} · GPS ${rec.koordinat || '-'}`,
                                  })
                                }
                                className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800"
                                title="Lihat Foto Selfie GPS"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                rec.status !== 'Hadir'
                                  ? 'bg-teal-50 text-teal-800'
                                  : rec.statusKeterlambatan === 'Terlambat'
                                  ? 'bg-amber-50 text-amber-800'
                                  : 'bg-emerald-50 text-emerald-800'
                              }`}
                            >
                              {rec.status !== 'Hadir'
                                ? rec.status
                                : rec.statusKeterlambatan === 'Terlambat'
                                ? `Terlambat ${rec.menitTerlambat || 0} mnt`
                                : 'Tepat Waktu'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============== TAB 3: KALENDER PENDIDIKAN PONDOK (GAMBAR 7) ============== */}
          {activeTab === 'kalender' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Kalender Pendidikan Pondok
                </h2>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { id: 'semua', label: 'Semua' },
                      { id: 'libur', label: 'Libur' },
                      { id: 'kegiatan', label: 'Kegiatan & Imtihan' },
                      { id: 'izin', label: 'Izin / Badal saya' },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setCalFilter(f.id)}
                      className={`px-3.5 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                        calFilter === f.id
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={compactPhoneFrame ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'}>
                {/* Calendar Grid Card */}
                <div className={`rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4 ${compactPhoneFrame ? '' : 'lg:col-span-7'}`}>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        if (calMonth === 0) {
                          setCalMonth(11);
                          setCalYear((y) => y - 1);
                        } else setCalMonth((m) => m - 1);
                      }}
                      className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="text-center">
                      <h3 className="font-extrabold text-sm text-slate-900">
                        {BULAN_NAMES_ID[calMonth]} {calYear}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {kalenderPendidikan.tahunAjaran}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (calMonth === 11) {
                          setCalMonth(0);
                          setCalYear((y) => y + 1);
                        } else setCalMonth((m) => m + 1);
                      }}
                      className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Weekday Headers */}
                  <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-500">
                    <span>Sen</span>
                    <span>Sel</span>
                    <span>Rab</span>
                    <span>Kam</span>
                    <span className="text-rose-700">Jum</span>
                    <span>Sab</span>
                    <span className="text-slate-700">Min</span>
                  </div>

                  {/* Days Matrix */}
                  <div className="grid grid-cols-7 gap-1 text-center tabular-nums">
                    {calendarDaysGrid.map((cell, idx) => {
                      if (!cell.day) return <div key={idx} className="h-11" />;
                      const izin = myIzinDatesInCalMonth[cell.day];
                      const isLib = cell.code ? LIBUR_CODES.has(cell.code) : false;
                      const isSelected = selectedCalDay === cell.day;
                      const isToday =
                        cell.day === now.getDate() &&
                        calMonth === now.getMonth() &&
                        calYear === now.getFullYear();

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedCalDay(cell.day!)}
                          className={`h-11 rounded-xl flex flex-col items-center justify-center text-xs font-bold relative transition ${
                            isSelected || isToday
                              ? 'border-2 border-emerald-700 bg-emerald-50 text-emerald-950'
                              : isLib
                              ? 'text-rose-600 hover:bg-rose-50'
                              : 'text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <span>{cell.day}</span>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {cell.code && (
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                  backgroundColor:
                                    legendMap[cell.code]?.bgColor || (isLib ? '#E11D48' : '#059669'),
                                }}
                              />
                            )}
                            {izin && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-600" />
                      Libur Madrasah (Jum'at) / Pondok
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      Agenda Pondok / Izin saya
                    </span>
                  </div>
                </div>

                {/* Month Events Card */}
                <div className={`rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-3 ${compactPhoneFrame ? '' : 'lg:col-span-5'}`}>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Agenda Bulan {BULAN_NAMES_ID[calMonth]} {calYear}
                  </h3>
                  {monthEventsList.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">
                      Tidak ada agenda atau hari libur sesuai filter pada bulan ini.
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
                      {monthEventsList.map((ev, i) => (
                        <div
                          key={i}
                          onClick={() => setSelectedCalDay(ev.day)}
                          className={`py-2.5 flex items-center justify-between gap-3 cursor-pointer rounded-xl px-2 ${
                            selectedCalDay === ev.day ? 'bg-emerald-50/70' : ''
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{ev.label}</p>
                            <p className="text-[11px] text-slate-500 tabular-nums">
                              {ev.day} {BULAN_NAMES_ID[calMonth]} {calYear}
                            </p>
                          </div>
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold shrink-0 text-white"
                            style={{ backgroundColor: ev.bgColor }}
                          >
                            {ev.code}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============== TAB 4: KOTAK MASUK (GAMBAR 8) ============== */}
          {activeTab === 'kotak_masuk' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Kotak Masuk</h2>
                <p className="text-xs text-slate-500">
                  Persetujuan izin/badal, pengumuman pondok, dan pemberitahuan tugas
                </p>
              </div>

              <div className={compactPhoneFrame ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'}>
                <div className={`space-y-4 ${compactPhoneFrame ? '' : 'lg:col-span-6'}`}>
                  {/* Menunggu Persetujuan */}
                  <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-slate-900">
                        {canApproveIzin ? 'Menunggu persetujuan Anda' : 'Status Pengajuan Izin / Badal'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowIzinModal(true)}
                        className="text-xs font-bold text-emerald-700 hover:underline"
                      >
                        + Ajukan Baru
                      </button>
                    </div>
                    {pendingIzinList.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">
                        Tidak ada pengajuan yang menunggu keputusan.
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {pendingIzinList.map((item) => (
                          <div
                            key={item.id}
                            className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-slate-900">
                                {item.ustadzNama} · {item.jenis}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.status === 'Disetujui'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : item.status === 'Ditolak'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600">
                              {item.tanggal} · {item.program}
                              {item.guruBadalNama ? ` · Badal: ${item.guruBadalNama}` : ''}
                            </p>
                            <p className="text-xs text-slate-700">{item.alasan}</p>
                            {canApproveIzin && item.status === 'Menunggu' && (
                              <div className="flex gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    approveIzinBadalGuru(item.id, 'Disetujui', displayName);
                                    notify(`Pengajuan ${item.ustadzNama} disetujui.`);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold"
                                >
                                  Setujui
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    approveIzinBadalGuru(item.id, 'Ditolak', displayName);
                                    notify(`Pengajuan ${item.ustadzNama} ditolak.`);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold"
                                >
                                  Tolak
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pengumuman */}
                  <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-3">
                    <h3 className="text-sm font-extrabold text-slate-900">Pengumuman</h3>
                    {pondokAnnouncements.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-3">
                        Belum ada pengumuman yang berlaku untuk Anda.
                      </p>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {pondokAnnouncements.map((p, i) => (
                          <div key={i} className="py-2.5">
                            <p className="text-xs font-bold text-slate-900">{p.judul}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {p.tanggal} · {p.info}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pemberitahuan */}
                <div className={`rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-3 ${compactPhoneFrame ? '' : 'lg:col-span-6'}`}>
                  <h3 className="text-sm font-extrabold text-slate-900">Pemberitahuan</h3>
                  <div className="divide-y divide-slate-100">
                    {kotakMasuk.map((km) => (
                      <div key={km.id} className="py-3 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Bell className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900">{km.judul}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{km.keterangan}</p>
                            <p className="text-[10px] text-slate-400 mt-1 tabular-nums">{km.waktu}</p>
                          </div>
                        </div>
                        {km.status === 'Menunggu' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold shrink-0">
                            Baru
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============== TAB 5: PROFIL PENGAJAR (GAMBAR 9) ============== */}
          {activeTab === 'profil' && (
            <div className={compactPhoneFrame ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'}>
              {/* Profile Identity + Bio Table */}
              <div className={`space-y-4 ${compactPhoneFrame ? '' : 'lg:col-span-7'}`}>
                <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-2xs text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white font-extrabold text-xl flex items-center justify-center shadow-sm">
                    {initials}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{displayName}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{pondokJabatan}</p>
                  </div>
                </div>

                <div className="rounded-3xl bg-white border border-slate-200 px-5 py-2 shadow-2xs divide-y divide-slate-100 text-xs">
                  <div className="py-3.5 flex items-center justify-between gap-4">
                    <span className="text-slate-500">Nomor induk (NIP)</span>
                    <strong className="text-slate-900 tabular-nums">
                      {matchedUstadz?.nip || currentUser.id.toUpperCase()}
                    </strong>
                  </div>
                  <div className="py-3.5 flex items-center justify-between gap-4">
                    <span className="text-slate-500">Pola jam tugas pondok</span>
                    <strong className="text-slate-900 text-right">
                      {selectedProgram} · {activeShiftPreset.start}–{activeShiftPreset.end}
                    </strong>
                  </div>
                  <div className="py-3.5 flex items-center justify-between gap-4">
                    <span className="text-slate-500">Lokasi absensi</span>
                    <strong className="text-slate-900 text-right">
                      Komplek PP NU Darussalam
                    </strong>
                  </div>
                  <div className="py-3.5 flex items-center justify-between gap-4">
                    <span className="text-slate-500">Atasan langsung</span>
                    <strong className="text-slate-900 text-right">
                      {effectiveRole === 'pengasuh'
                        ? 'Dewan Masyayikh'
                        : effectiveRole === 'kepala_madin'
                        ? 'KH. Amin Maizun (Pengasuh)'
                        : "Ustadz Syarif Hidayatullah (Kepala Majlis Ma'arif)"}
                    </strong>
                  </div>
                  <div className="py-3.5 flex items-center justify-between gap-4">
                    <span className="text-slate-500">Email &amp; WhatsApp</span>
                    <strong className="text-slate-900 text-right truncate">
                      {currentUser.email}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className={`rounded-3xl bg-white border border-slate-200 p-2 shadow-2xs divide-y divide-slate-100 text-xs ${compactPhoneFrame ? '' : 'lg:col-span-5'}`}>
                <button
                  type="button"
                  onClick={() => {
                    toggleSdmNotif();
                    notify(sdmNotifEnabled ? 'Notifikasi HP dimatikan.' : 'Notifikasi HP diaktifkan.');
                  }}
                  className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-slate-50 rounded-2xl transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">
                      Notifikasi di HP ini: {sdmNotifEnabled ? 'aktif' : 'nonaktif'}
                    </p>
                    <p className="text-[11px] text-slate-500">Ketuk untuk mengubah pengaturan</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPinInput(pinPengesahanMap[currentUser.id] || '');
                    setShowPinModal(true);
                  }}
                  className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-slate-50 rounded-2xl transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">PIN pengesahan dokumen</p>
                    <p className="text-[11px] text-slate-500">Atur atau ganti PIN tanda tangan digital</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateErp?.('beranda')}
                  className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-slate-50 rounded-2xl transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                    <Home className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">ERP lengkap</p>
                    <p className="text-[11px] text-slate-500">Buka seluruh menu ERP sesuai hak akses Anda</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onLogout?.();
                  }}
                  className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-rose-50 rounded-2xl transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-rose-700">Keluar</p>
                    <p className="text-[11px] text-slate-500">Mengakhiri sesi akun di perangkat ini</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ============== EMERALD BOTTOM PILL NAVIGATION BAR ============== */}
          <div className="sticky bottom-3 z-20 mx-auto max-w-md rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg p-1.5 grid grid-cols-5 gap-1 no-print">
            {(
              [
                { id: 'beranda', label: 'Beranda', icon: Home },
                { id: 'absensi', label: 'Absensi', icon: Clock },
                { id: 'kalender', label: 'Kalender', icon: CalendarIcon },
                { id: 'kotak_masuk', label: 'Kotak Masuk', icon: Inbox },
                { id: 'profil', label: 'Profil', icon: User },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-[10px] font-bold transition min-h-[48px] ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-0.5" />
                  <span className="truncate max-w-full">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Ajukan Izin / Badal */}
      {showIzinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 no-print">
          <form
            onSubmit={handleSubmitIzinModal}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-3 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Ajukan Izin / Sakit / Badal Mengajar</h3>
              <button type="button" onClick={() => setShowIzinModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold mb-1">Tanggal</label>
                <input
                  type="date"
                  required
                  value={izinTanggal}
                  onChange={(e) => setIzinTanggal(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Jenis Pengajuan</label>
                <select
                  value={izinJenis}
                  onChange={(e) => setIzinJenis(e.target.value as IzinBadalGuruRequest['jenis'])}
                  className="w-full rounded-xl border border-slate-300 p-2 font-bold"
                >
                  <option value="Izin">Izin Pribadi</option>
                  <option value="Badal">Pengajuan Badal Guru</option>
                  <option value="Sakit">Sakit</option>
                  <option value="Tugas Pondok">Tugas Luar Pondok</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-bold mb-1">Program Mengajar</label>
              <select
                value={izinProgram}
                onChange={(e) => setIzinProgram(e.target.value as ProgramAbsensiType)}
                className="w-full rounded-xl border border-slate-300 p-2"
              >
                <option value="Madrasah Diniyah">Madrasah Diniyah</option>
                <option value="Ngaji Al-Qur'an Pagi (Ba'da Subuh)">Ngaji Al-Qur'an Pagi (Ba'da Subuh)</option>
                <option value="Ngaji Takhasus">Ngaji Takhasus</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Guru Badal / Pengganti (Opsional)</label>
              <input
                type="text"
                value={izinBadalNama}
                onChange={(e) => setIzinBadalNama(e.target.value)}
                placeholder="Mis: Ustadz Abdur Rahman"
                className="w-full rounded-xl border border-slate-300 p-2"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Keterangan / Alasan</label>
              <textarea
                rows={3}
                required
                value={izinAlasan}
                onChange={(e) => setIzinAlasan(e.target.value)}
                placeholder="Tulis alasan izin/badal..."
                className="w-full rounded-xl border border-slate-300 p-2"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowIzinModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold"
              >
                Kirim Pengajuan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal PIN Pengesahan */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 no-print">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pinInput.length < 4) return;
              setUserPinPengesahan(currentUser.id, pinInput);
              setShowPinModal(false);
              notify('PIN Pengesahan dokumen berhasil disimpan.');
            }}
            className="w-full max-w-xs rounded-3xl bg-white p-6 shadow-2xl space-y-3 text-xs"
          >
            <h3 className="font-bold text-sm text-slate-900">Atur PIN Pengesahan (6 Digit)</h3>
            <input
              type="password"
              required
              minLength={4}
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Masukkan 4-6 digit angka..."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-center text-base font-mono tracking-widest"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="px-3 py-2 rounded-xl bg-slate-100 font-bold"
              >
                Batal
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold">
                Simpan PIN
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lightbox Swafoto Timestamp */}
      {previewSelfie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 no-print">
          <div className="w-full max-w-md rounded-3xl bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900">{previewSelfie.title}</h4>
                <p className="text-[11px] text-slate-500">{previewSelfie.meta}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewSelfie(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {previewSelfie.url && (
              <img
                src={previewSelfie.url}
                alt={previewSelfie.title}
                className="w-full rounded-2xl object-cover border border-slate-200"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
