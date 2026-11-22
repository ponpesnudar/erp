import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Shield,
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  LogIn,
  LogOut,
  Coffee,
  FilePlus2,
  Smartphone,
  Download,
  Users,
  FileWarning,
  Eye,
  Check,
  X,
  SlidersHorizontal,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Upload,
  Crosshair,
  History,
  AlertTriangle,
  Share2,
  Printer,
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
import { PWAInstallButton } from '../../components/pwa/PWAInstallButton.tsx';
import { PrintOrientationControl } from '../../components/common/PrintOrientationControl.tsx';
import { triggerReliablePrint } from '../../lib/printHelper.ts';
import { RekapAbsensiSpreadsheet } from '../sdm/RekapAbsensiSpreadsheet.tsx';
import {
  formatNamaWithGelar,
  type SatpamShiftConfig,
  type SatpamAbsensiRecord,
  type SatpamPengajuanRequest,
} from '../../data/seed/pondokData.ts';

const KENDALA_SATPAM_OPTIONS = [
  'Sinyal GPS Lemah saat Patroli Asrama / Lorong',
  'Kamera HP Bermasalah / Error Saat Malam',
  'HP Lowbat / Sedang Di-charge di Pos',
  'Lupa Menekan Cek In Saat Pergantian Regu',
  'Tugas Mendadak Mengawal Tamu / Santri Sakit',
];

const SHORT_BULAN_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function calcSatpamShiftDurationLabel(jamMulai: string, jamSelesai: string): string {
  const [sh, sm] = jamMulai.split(':').map(Number);
  const [eh, em] = jamSelesai.split(':').map(Number);
  if (!Number.isFinite(sh) || !Number.isFinite(eh)) return '8 Jam';
  let totalMins = eh * 60 + (em || 0) - (sh * 60 + (sm || 0));
  if (totalMins <= 0) totalMins += 24 * 60;
  if (totalMins % 60 === 0) return `${totalMins / 60} Jam`;
  return `${Math.floor(totalMins / 60)}j ${totalMins % 60}m`;
}

function addDaysIso(isoDate: string, delta: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}

function getMondayOfWeek(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const dt = new Date(y, m - 1, d);
  const day = dt.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  dt.setDate(dt.getDate() + diff);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}

export interface SatpamAbsensiSubTabProps {
  initialMode?: 'mobile_hp' | 'monitoring';
}

export const SatpamAbsensiSubTab: React.FC<SatpamAbsensiSubTabProps> = ({
  initialMode = 'mobile_hp',
}) => {
  const {
    currentUser,
    satpamList,
    satpamShiftConfigs,
    satpamAbsensiList,
    satpamPengajuanList,
    activeSatpamShiftMap,
    checkInSatpamMobile,
    toggleIstirahatSatpam,
    checkOutSatpamMobile,
    submitSatpamPengajuan,
    approveSatpamPengajuan,
    verifySatpamAbsensiRecord,
    addSatpamShiftConfig,
    updateSatpamShiftConfig,
    deleteSatpamShiftConfig,
    resetSatpamShiftConfigs,
    printOrientation,
  } = useAppStore();
  const { effectiveRole } = useAuth();
  const satpamPrintRef = useRef<HTMLDivElement | null>(null);

  const isSatpamPersonalUser =
    currentUser.id === 'u-satpam-riyadi' ||
    currentUser.id === 'u-satpam-suwarno' ||
    currentUser.id === 'u-satpam-sopoyono';

  const canManageSatpam =
    !isSatpamPersonalUser &&
    ['admin_sistem', 'pengasuh', 'bk_keamanan', 'sekretaris', 'kepala_madin'].includes(effectiveRole);

  const [mainMode, setMainMode] = useState<'mobile_hp' | 'monitoring'>(initialMode);
  useEffect(() => {
    setMainMode(initialMode);
  }, [initialMode]);
  const [compactPhoneFrame, setCompactPhoneFrame] = useState(false);
  const [showHpInstallModal, setShowHpInstallModal] = useState(false);

  // Personil Satpam Selector (defaults to logged-in Satpam if matched)
  const initialSatpamId = useMemo(() => {
    const byUser = satpamList.find((s) => s.userId === currentUser.id);
    if (byUser) return byUser.id;
    const byName = satpamList.find((s) =>
      currentUser.nama.toLowerCase().includes(s.nama.replace(/^Pak\s+/i, '').toLowerCase())
    );
    return byName?.id || satpamList[0]?.id || 'satpam-riyadi';
  }, [satpamList, currentUser]);

  const [activeSatpamId, setActiveSatpamId] = useState<string>(initialSatpamId);
  useEffect(() => {
    if (isSatpamPersonalUser) {
      setActiveSatpamId(initialSatpamId);
    }
  }, [isSatpamPersonalUser, initialSatpamId]);

  const activeSatpam = useMemo(
    () => satpamList.find((s) => s.id === activeSatpamId) || satpamList[0],
    [satpamList, activeSatpamId]
  );

  // Live Clock WIB
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

  const availableShifts = useMemo(() => {
    const active = satpamShiftConfigs.filter((s) => s.aktif);
    return active.length > 0 ? active : satpamShiftConfigs;
  }, [satpamShiftConfigs]);

  const [selectedShiftId, setSelectedShiftId] = useState<string>(
    () => activeSatpam?.shiftDefaultId || availableShifts[0]?.id || 'satpam-shift-pagi'
  );

  useEffect(() => {
    if (activeSatpam?.shiftDefaultId) {
      setSelectedShiftId(activeSatpam.shiftDefaultId);
    }
  }, [activeSatpam]);

  const activeSelectedShift = useMemo(
    () =>
      availableShifts.find((s) => s.id === selectedShiftId) ||
      availableShifts[0] || {
        id: 'satpam-shift-pagi',
        nama: 'Shift Pagi — Gerbang Utama',
        pos: 'Pos Gerbang Utama PP NU Darussalam',
        jamMulai: '07:00',
        jamSelesai: '15:00',
        toleransiMenit: 10,
        aktif: true,
      },
    [availableShifts, selectedShiftId]
  );

  // Active shift session for activeSatpam
  const rawShift = activeSatpamShiftMap[activeSatpam?.id || 'satpam-riyadi'];
  const todayShift = rawShift && rawShift.tanggal === todayIso ? rawShift : undefined;
  const activeShiftInProgress = todayShift && todayShift.status !== 'selesai';

  const displayShiftMeta = useMemo(() => {
    if (activeShiftInProgress && todayShift) {
      return {
        nama: todayShift.shiftNama,
        pos: todayShift.posJaga,
        startDot: todayShift.shiftStartTarget,
        endDot: todayShift.shiftEndTarget,
      };
    }
    return {
      nama: activeSelectedShift.nama,
      pos: activeSelectedShift.pos,
      startDot: activeSelectedShift.jamMulai.replace(':', '.'),
      endDot: activeSelectedShift.jamSelesai.replace(':', '.'),
    };
  }, [activeShiftInProgress, todayShift, activeSelectedShift]);

  const elapsedDisplay = useMemo(() => {
    if (!todayShift) return '00:00:00';
    if (todayShift.status === 'selesai') {
      const rec = satpamAbsensiList.find((r) => r.id === todayShift.activeRecordId);
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
  }, [todayShift, now, satpamAbsensiList]);

  const timelinePercent = useMemo(() => {
    if (!todayShift) return 4;
    if (todayShift.status === 'selesai') return 100;
    const [sh, sm] = displayShiftMeta.startDot.split('.').map(Number);
    const [eh, em] = displayShiftMeta.endDot.split('.').map(Number);
    const startMin = sh * 60 + sm;
    let endMin = eh * 60 + em;
    let nowMin = now.getHours() * 60 + now.getMinutes();
    if (endMin <= startMin) {
      endMin += 24 * 60;
      if (nowMin < startMin) nowMin += 24 * 60;
    }
    const pct = ((nowMin - startMin) / Math.max(1, endMin - startMin)) * 100;
    return Math.min(96, Math.max(12, Math.round(pct)));
  }, [todayShift, displayShiftMeta, now]);

  // Camera & GPS Overlay
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
        shiftNama?: string;
      };
  const [overlayFlow, setOverlayFlow] = useState<OverlayFlow>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState('');
  const [gpsCoords, setGpsCoords] = useState('-6.9765, 109.6832');
  const [gpsAccuracy, setGpsAccuracy] = useState(18);
  const [gpsStatus, setGpsStatus] = useState<'reading' | 'ready'>('reading');

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
          setGpsAccuracy(Math.max(5, Math.round(pos.coords.accuracy || 18)));
          setGpsStatus('ready');
        },
        () => {
          setGpsCoords('-6.9765, 109.6832');
          setGpsAccuracy(18);
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
              'Kamera tidak aktif di peramban ini. Unggah foto selfie atau klik konfirmasi untuk stempel GPS otomatis.'
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
      if (typeof reader.result === 'string') setUploadedPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const initials = useMemo(() => {
    const clean = (activeSatpam?.nama || 'Pak Riyadi').replace(/^Pak\s+/i, '');
    return clean.slice(0, 2).toUpperCase();
  }, [activeSatpam]);

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
      const grad = ctx.createLinearGradient(0, 0, 640, 480);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#065f46');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 640, 480);

      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      ctx.beginPath();
      ctx.arc(320, 190, 74, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 42px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(initials, 320, 206);
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(activeSatpam?.nama || 'Satpam Pondok', 320, 298);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#a7f3d0';
      ctx.fillText(`${activeSatpam?.jabatan || 'Petugas Keamanan'} · Verifikasi Pos GPS`, 320, 326);
    }

    ctx.fillStyle = 'rgba(6, 78, 59, 0.9)';
    ctx.fillRect(0, 388, 640, 92);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fcd34d';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`${activeSatpam?.nama} · ${activeSelectedShift.nama}`, 20, 414);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px monospace';
    const stampStr = `${todayIso} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} WIB`;
    ctx.fillText(`${stampStr}  |  GPS: ${gpsCoords} (±${gpsAccuracy}m)`, 20, 440);
    ctx.fillStyle = '#a7f3d0';
    ctx.font = '12px sans-serif';
    ctx.fillText(`${activeSelectedShift.pos} — PP NU Darussalam Karangdadap`, 20, 464);

    return canvas.toDataURL('image/jpeg', 0.82);
  };

  const handleConfirmCameraAction = async () => {
    if (overlayFlow?.type !== 'camera' || !activeSatpam) return;
    const action = overlayFlow.action;
    const selfieDataUrl = await generateStampedSelfie();
    stopCamera();
    setUploadedPreviewUrl('');

    if (action === 'checkin') {
      const res = checkInSatpamMobile({
        satpamId: activeSatpam.id,
        satpamNama: activeSatpam.nama,
        shiftId: activeSelectedShift.id,
        posJaga: activeSelectedShift.pos,
        fotoSelfieUrl: selfieDataUrl,
        koordinat: gpsCoords,
        akurasiGps: gpsAccuracy,
        lokasiLabel: activeSelectedShift.pos,
      });
      setOverlayFlow({
        type: 'confirmed',
        action: 'checkin',
        waktuWib: `${res.checkInDisplay} WIB`,
        koordinat: gpsCoords,
        akurasi: gpsAccuracy,
        shiftNama: activeSelectedShift.nama,
      });
    } else {
      const res = checkOutSatpamMobile({
        satpamId: activeSatpam.id,
        fotoCekOutUrl: selfieDataUrl,
      });
      setOverlayFlow({
        type: 'confirmed',
        action: 'checkout',
        waktuWib: `${res?.checkOutDisplay || hhmm} WIB`,
        koordinat: gpsCoords,
        akurasi: gpsAccuracy,
        durasiKerja: res?.durasiKerja,
        shiftNama: displayShiftMeta.nama,
      });
    }
  };

  // Absen Pengajuan / Izin / Tukar Shift Modal
  const [showPengajuanModal, setShowPengajuanModal] = useState(false);
  const [pengJenis, setPengJenis] = useState<SatpamPengajuanRequest['jenis']>('Absen Pengajuan');
  const [pengTanggal, setPengTanggal] = useState(todayIso);
  const [pengShiftId, setPengShiftId] = useState(activeSelectedShift.id);
  const [pengJamMulai, setPengJamMulai] = useState(activeSelectedShift.jamMulai);
  const [pengJamSelesai, setPengJamSelesai] = useState(activeSelectedShift.jamSelesai);
  const [pengKendala, setPengKendala] = useState(KENDALA_SATPAM_OPTIONS[0]);
  const [penggantiNama, setPenggantiNama] = useState('');
  const [pengBuktiFoto, setPengBuktiFoto] = useState('');
  const [pengAlasan, setPengAlasan] = useState('');

  const openPengajuanModal = (preset: SatpamPengajuanRequest['jenis']) => {
    setPengJenis(preset);
    setPengTanggal(todayIso);
    setPengShiftId(activeSelectedShift.id);
    setPengJamMulai(activeSelectedShift.jamMulai);
    setPengJamSelesai(activeSelectedShift.jamSelesai);
    setPengKendala(KENDALA_SATPAM_OPTIONS[0]);
    const otherSatpam = satpamList.find((s) => s.id !== activeSatpam?.id);
    setPenggantiNama(preset === 'Tukar Shift' && otherSatpam ? otherSatpam.nama : '');
    setPengBuktiFoto('');
    setPengAlasan('');
    setShowPengajuanModal(true);
  };

  const handleSubmitPengajuan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSatpam || !pengAlasan.trim()) return;
    const pickedShift = availableShifts.find((s) => s.id === pengShiftId) || activeSelectedShift;
    submitSatpamPengajuan({
      satpamId: activeSatpam.id,
      satpamNama: activeSatpam.nama,
      tanggal: pengTanggal,
      jenis: pengJenis,
      shiftId: pickedShift.id,
      shiftNama: pickedShift.nama,
      posJaga: pickedShift.pos,
      jamMulaiDiajukan: pengJenis === 'Absen Pengajuan' ? pengJamMulai : undefined,
      jamSelesaiDiajukan: pengJenis === 'Absen Pengajuan' ? pengJamSelesai : undefined,
      kendalaKategori: pengJenis === 'Absen Pengajuan' ? pengKendala : undefined,
      buktiFotoUrl: pengBuktiFoto || undefined,
      penggantiNama: pengJenis === 'Tukar Shift' ? penggantiNama : undefined,
      alasan: pengAlasan.trim(),
    });
    setShowPengajuanModal(false);
    notify(`${pengJenis} atas nama ${activeSatpam.nama} berhasil dikirim ke Koordinator Keamanan / Admin.`);
  };

  // Personal analytics
  const myRecords = useMemo(() => {
    if (!activeSatpam) return [];
    return satpamAbsensiList
      .filter((r) => r.satpamId === activeSatpam.id || r.satpamNama.toLowerCase() === activeSatpam.nama.toLowerCase())
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [satpamAbsensiList, activeSatpam]);

  const monthPrefix = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
  const myMonthlyRecords = useMemo(
    () => myRecords.filter((r) => r.tanggal.startsWith(monthPrefix)),
    [myRecords, monthPrefix]
  );

  const weekDaysStrip = useMemo(() => {
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const labels = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];
    return labels.map((lbl, idx) => {
      const dt = new Date(now);
      dt.setDate(now.getDate() + mondayOffset + idx);
      const iso = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
      const isFuture = dt.getTime() > new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime();
      const rec = myRecords.find((r) => r.tanggal === iso);
      let state: 'hadir' | 'terlambat' | 'izin' | 'alfa' | 'future' = 'future';
      if (rec) {
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

  const trendChartData = useMemo(() => {
    const pts: { bulan: string; persen: number }[] = [];
    for (let offset = 5; offset >= 0; offset--) {
      const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const pref = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
      const count = myRecords.filter((r) => r.tanggal.startsWith(pref) && r.status === 'Hadir').length;
      const pct = count > 0 ? Math.min(100, Math.round((count / 24) * 100)) : offset === 0 ? 92 : 95;
      pts.push({ bulan: SHORT_BULAN_ID[d.getMonth()], persen: pct });
    }
    return pts;
  }, [now, myRecords]);

  // --- MONITORING & RECAP STATES ---
  const defaultDate = useMemo(() => {
    const hasToday = satpamAbsensiList.some((r) => r.tanggal === todayIso);
    if (hasToday) return todayIso;
    const latest = [...satpamAbsensiList].sort((a, b) => b.tanggal.localeCompare(a.tanggal))[0]?.tanggal;
    return latest || todayIso;
  }, [satpamAbsensiList, todayIso]);

  const [monitoringSubMode, setMonitoringSubMode] = useState<
    'harian_foto' | 'rekap_mingguan' | 'rekap_bulanan' | 'pengaturan_shift'
  >('harian_foto');
  const [tanggalFilter, setTanggalFilter] = useState<string>(defaultDate);
  const [weekStartIso, setWeekStartIso] = useState<string>(() => getMondayOfWeek(defaultDate));
  const [rekapBulan, setRekapBulan] = useState<string>(() => defaultDate.substring(0, 7) || '2026-11');
  const [previewRecord, setPreviewRecord] = useState<SatpamAbsensiRecord | null>(null);
  const [buktiPreview, setBuktiPreview] = useState<{ url: string; title: string; meta: string } | null>(null);

  // Admin Shift Config Form
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [shiftNama, setShiftNama] = useState('');
  const [shiftPos, setShiftPos] = useState('Pos Gerbang Utama PP NU Darussalam');
  const [shiftJamMulai, setShiftJamMulai] = useState('07:00');
  const [shiftJamSelesai, setShiftJamSelesai] = useState('15:00');
  const [shiftToleransi, setShiftToleransi] = useState(10);

  const [toast, setToast] = useState('');
  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const resetShiftForm = () => {
    setEditingShiftId(null);
    setShiftNama('');
    setShiftPos('Pos Gerbang Utama PP NU Darussalam');
    setShiftJamMulai('07:00');
    setShiftJamSelesai('15:00');
    setShiftToleransi(10);
  };

  const handleEditShift = (s: SatpamShiftConfig) => {
    setEditingShiftId(s.id);
    setShiftNama(s.nama);
    setShiftPos(s.pos);
    setShiftJamMulai(s.jamMulai);
    setShiftJamSelesai(s.jamSelesai);
    setShiftToleransi(s.toleransiMenit);
  };

  const handleSaveShiftForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftNama.trim()) return;
    if (editingShiftId) {
      updateSatpamShiftConfig(editingShiftId, {
        nama: shiftNama.trim(),
        pos: shiftPos.trim() || 'Pos Keamanan Pondok',
        jamMulai: shiftJamMulai,
        jamSelesai: shiftJamSelesai,
        toleransiMenit: Math.max(0, Number(shiftToleransi) || 0),
      });
      notify(`Shift "${shiftNama.trim()}" diperbarui.`);
    } else {
      addSatpamShiftConfig({
        nama: shiftNama.trim(),
        pos: shiftPos.trim() || 'Pos Keamanan Pondok',
        jamMulai: shiftJamMulai,
        jamSelesai: shiftJamSelesai,
        toleransiMenit: Math.max(0, Number(shiftToleransi) || 0),
        aktif: true,
      });
      notify(`Shift baru "${shiftNama.trim()}" ditambahkan.`);
    }
    resetShiftForm();
  };

  const pendingPengajuan = useMemo(
    () => satpamPengajuanList.filter((p) => p.status === 'Menunggu'),
    [satpamPengajuanList]
  );

  const dateRecords = useMemo(
    () => satpamAbsensiList.filter((r) => !tanggalFilter || r.tanggal === tanggalFilter),
    [satpamAbsensiList, tanggalFilter]
  );

  const hadirDateCount = dateRecords.filter((r) => r.status === 'Hadir').length;
  const tepatWaktuCount = dateRecords.filter(
    (r) => r.status === 'Hadir' && r.statusKeterlambatan !== 'Terlambat'
  ).length;

  // Weekly matrix
  const weekDays = useMemo(() => {
    const labels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    return labels.map((dayShort, idx) => {
      const iso = addDaysIso(weekStartIso, idx);
      return { iso, dayShort, dateShort: iso.substring(8, 10) + '/' + iso.substring(5, 7) };
    });
  }, [weekStartIso]);

  const weeklyRecapRows = useMemo(() => {
    return satpamList.map((sat) => {
      const dayCells = weekDays.map((d) => {
        const rec = satpamAbsensiList.find((r) => r.satpamId === sat.id && r.tanggal === d.iso);
        return { day: d, rec };
      });
      const hadir = dayCells.filter((c) => c.rec?.status === 'Hadir').length;
      const terlambat = dayCells.filter(
        (c) => c.rec?.status === 'Hadir' && c.rec?.statusKeterlambatan === 'Terlambat'
      ).length;
      const izin = dayCells.filter(
        (c) => c.rec && ['Izin', 'Sakit', 'Tukar Shift'].includes(c.rec.status)
      ).length;
      const pct = Math.min(100, Math.round(((hadir + izin) / 7) * 100));
      return { satpam: sat, dayCells, hadir, terlambat, izin, persentaseMingguan: pct };
    });
  }, [satpamList, weekDays, satpamAbsensiList]);

  // Monthly recap
  const monthlyRecapRows = useMemo(() => {
    return satpamList.map((sat) => {
      const recs = satpamAbsensiList.filter(
        (r) => r.satpamId === sat.id && r.tanggal.startsWith(rekapBulan)
      );
      const hadir = recs.filter((r) => r.status === 'Hadir').length;
      const selfieCount = recs.filter((r) => !!r.fotoSelfieUrl).length;
      const terlambat = recs.filter(
        (r) => r.status === 'Hadir' && r.statusKeterlambatan === 'Terlambat'
      ).length;
      const izinTukar = recs.filter((r) => ['Izin', 'Sakit', 'Tukar Shift'].includes(r.status)).length;
      const targetDays = 26;
      const persentase = Math.min(100, Math.round(((hadir + izinTukar) / targetDays) * 100));
      return { satpam: sat, hadir, selfieCount, terlambat, izinTukar, persentase };
    });
  }, [satpamList, satpamAbsensiList, rekapBulan]);

  // Dynamic PDF export (keeps initial chunk small!)
  const handleDownloadWeeklyPdf = async () => {
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable'),
    ]);
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [330, 215] });
    const endIso = addDaysIso(weekStartIso, 6);
    doc.setFillColor(7, 67, 42);
    doc.rect(14, 10, 302, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('PONDOK PESANTREN NU DARUSSALAM KARANGDADAP', 18, 17);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Rekapitulasi Absensi Mingguan Satpam & Keamanan (Riyadi, Suwarno, Sopoyono) · ${weekStartIso} s.d. ${endIso}`,
      18,
      23.5
    );

    autoTable(doc, {
      startY: 34,
      head: [
        [
          'No',
          'Nama Personil Satpam',
          'Jabatan / Pos Utama',
          ...weekDays.map((d) => `${d.dayShort}\n${d.dateShort}`),
          'Hadir',
          'Terlambat',
          'Izin/Tukar',
          '%',
        ],
      ],
      body: weeklyRecapRows.map((row, idx) => [
        String(idx + 1),
        row.satpam.nama,
        `${row.satpam.jabatan} (${row.satpam.posUtama})`,
        ...row.dayCells.map(({ rec }) => {
          if (!rec) return '-';
          if (rec.status === 'Hadir') return rec.statusKeterlambatan === 'Terlambat' ? 'T' : 'H';
          return rec.status.charAt(0);
        }),
        String(row.hadir),
        String(row.terlambat),
        String(row.izin),
        `${row.persentaseMingguan}%`,
      ]),
      styles: { fontSize: 8.5, cellPadding: 2.5, halign: 'center' },
      columnStyles: { 0: { cellWidth: 10 }, 1: { halign: 'left', cellWidth: 46, fontStyle: 'bold' }, 2: { halign: 'left', cellWidth: 64 } },
      headStyles: { fillColor: [7, 67, 42], textColor: 255, fontStyle: 'bold' },
      margin: { left: 14, right: 14 },
    });

    doc.save(`Rekap-Absensi-Satpam-Mingguan-${weekStartIso}.pdf`);
    notify(`PDF Rekap Mingguan Satpam (${weekStartIso}) berhasil diunduh.`);
  };

  const handleDownloadMonthlyPdf = async () => {
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable'),
    ]);
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [330, 215] });

    // Kop Surat Resmi Pondok Pesantren
    doc.setFillColor(6, 78, 59);
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.7);
    doc.circle(23, 18.5, 7.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(253, 224, 71);
    doc.text('PP NU', 23, 17.8, { align: 'center' });
    doc.setFontSize(5);
    doc.setTextColor(255, 255, 255);
    doc.text('DARUSSALAM', 23, 20.6, { align: 'center' });

    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text('YAYASAN & PENGURUS HARIAN PONDOK PESANTREN', 165, 13.5, { align: 'center' });
    doc.setFontSize(14);
    doc.setTextColor(6, 78, 59);
    doc.text('PONDOK PESANTREN NU DARUSSALAM KARANGDADAP', 165, 19.5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(
      'Jl. Raya Karangdadap KM 1, Kec. Karangdadap, Kab. Pekalongan, Jawa Tengah 51174 · Keamanan & Ketertiban',
      165,
      24.5,
      { align: 'center' }
    );

    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.8);
    doc.line(14, 27.8, 316, 27.8);
    doc.setLineWidth(0.25);
    doc.line(14, 28.9, 316, 28.9);

    doc.setFont('times', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(20, 20, 20);
    doc.text('REKAPITULASI ABSENSI BULANAN & RINGKASAN SHIFT REGU SATPAM', 14, 35.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(
      `No. Dok: PP-DS/KEAM/ABS-${rekapBulan.replace('-', '')} · Periode: ${rekapBulan} · Regu: Pak Riyadi, Pak Suwarno, Pak Sopoyono`,
      316,
      35.5,
      { align: 'right' }
    );

    autoTable(doc, {
      startY: 41,
      head: [
        [
          'No',
          'Nama Satpam',
          'Jabatan',
          'Pos Jaga Utama',
          'Total Shift Hadir',
          'Bukti Swafoto GPS',
          'Terlambat',
          'Izin / Tukar Shift',
          'Persentase (%)',
        ],
      ],
      body: monthlyRecapRows.map((row, idx) => [
        String(idx + 1),
        row.satpam.nama,
        row.satpam.jabatan,
        row.satpam.posUtama,
        `${row.hadir} shift`,
        `${row.selfieCount} foto`,
        `${row.terlambat}x`,
        `${row.izinTukar}x`,
        `${row.persentase}%`,
      ]),
      styles: {
        font: 'times',
        fontSize: 9,
        cellPadding: 3,
        halign: 'center',
        lineColor: [90, 110, 85],
        lineWidth: 0.15,
        textColor: [20, 20, 20],
      },
      columnStyles: {
        0: { cellWidth: 12 },
        1: { halign: 'left', cellWidth: 46, fontStyle: 'bold' },
        2: { halign: 'left', cellWidth: 40 },
        3: { halign: 'left', cellWidth: 64 },
      },
      headStyles: { fillColor: [46, 93, 26], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [232, 243, 226] },
      margin: { left: 14, right: 14 },
    });

    const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 120;
    const sigY = Math.min(finalY + 14, 175);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont('times', 'normal');
    doc.text('Mengetahui,', 24, sigY);
    doc.setFont('times', 'bold');
    doc.text('Pengasuh / Koordinator Keamanan', 24, sigY + 4.5);
    doc.setFont('times', 'normal');
    doc.text(`Karangdadap · Periode ${rekapBulan}`, 232, sigY);
    doc.setFont('times', 'bold');
    doc.text('Admin SDM & Keamanan Pondok', 232, sigY + 4.5);
    doc.setDrawColor(46, 93, 26);
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(24, sigY + 7, 58, 11, 1.5, 1.5, 'FD');
    doc.roundedRect(232, sigY + 7, 60, 11, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(22, 101, 52);
    doc.text('TTD DIGITAL TERVERIFIKASI', 26.5, sigY + 11.5);
    doc.text('DITANDATANGANI ELEKTRONIK', 234.5, sigY + 11.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Ref: TTD-DS-ST-${rekapBulan.replace('-', '')}`, 26.5, sigY + 15.5);
    doc.text(`PP NU Darussalam Karangdadap`, 234.5, sigY + 15.5);
    doc.setTextColor(15, 23, 42);
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.text('KH. Amin Maizun / Ust. Bahrul Ulum', 24, sigY + 23.5);
    doc.text(formatNamaWithGelar(currentUser.nama), 232, sigY + 23.5);

    doc.save(`Rekap-Absensi-Satpam-Bulanan-${rekapBulan}.pdf`);
    notify(`PDF Rekap Bulanan Satpam (${rekapBulan}) berhasil diunduh.`);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner: Download Mobile App (PWA) for Satpam HP */}
      <div className="rounded-3xl bg-linear-to-r from-emerald-950 via-emerald-900 to-teal-900 p-5 text-white shadow-lg border border-emerald-800/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-amber-300 border border-white/15">
              <Shield className="w-3.5 h-3.5" />
              <span>Absensi Mobile Satpam Keamanan · Pak Riyadi, Pak Suwarno &amp; Pak Sopoyono</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
              Pasang Aplikasi Absensi Satpam Langsung di HP Android &amp; iPhone
            </h3>
            <p className="text-xs text-emerald-100/90 max-w-2xl leading-relaxed">
              Sistem absensi Satpam ini persis dengan aplikasi Absensi Guru (Swafoto Kamera + GPS Pos + Rekapan PDF + Absen Pengajuan). Login cepat di HP dengan username{' '}
              <code className="bg-black/30 px-1.5 py-0.5 rounded font-mono text-amber-300">riyadi</code>,{' '}
              <code className="bg-black/30 px-1.5 py-0.5 rounded font-mono text-amber-300">suwarno</code>, atau{' '}
              <code className="bg-black/30 px-1.5 py-0.5 rounded font-mono text-amber-300">sopoyono</code> (sandi:{' '}
              <code className="bg-black/30 px-1.5 py-0.5 rounded font-mono text-emerald-200">darussalam2026</code>).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <PWAInstallButton variant="button" />
            <button
              type="button"
              onClick={() => setShowHpInstallModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-xs transition"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Cara Unduh di HP Satpam</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => setMainMode('mobile_hp')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              mainMode === 'mobile_hp'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Absensi Mobile Satpam (HP)</span>
          </button>
          <button
            type="button"
            onClick={() => setMainMode('monitoring')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              mainMode === 'monitoring'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>
              Monitoring, Verifikasi &amp; Rekap PDF
              {pendingPengajuan.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                  {pendingPengajuan.length}
                </span>
              )}
            </span>
          </button>
        </div>

        {mainMode === 'mobile_hp' && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500">Pilih Personil Satpam:</span>
            {satpamList.map((sat) => (
              <button
                key={sat.id}
                type="button"
                onClick={() => setActiveSatpamId(sat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  activeSatpam?.id === sat.id
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                }`}
              >
                {sat.nama}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCompactPhoneFrame((v) => !v)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{compactPhoneFrame ? 'Tampilan Lebar' : 'Simulasi Layar HP'}</span>
            </button>
          </div>
        )}
      </div>

      {toast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* ==================== MODE 1: ABSENSI MOBILE SATPAM (HP) ==================== */}
      {mainMode === 'mobile_hp' && activeSatpam && (
        <div className={compactPhoneFrame ? 'max-w-md mx-auto rounded-[2.2rem] border-8 border-slate-900 shadow-2xl overflow-hidden bg-slate-50' : ''}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left / Main Mobile Attendance Card */}
            <div className={`${compactPhoneFrame ? 'lg:col-span-12' : 'lg:col-span-7'} space-y-4`}>
              <div className="rounded-3xl bg-linear-to-br from-slate-900 via-emerald-950 to-emerald-900 p-5 sm:p-6 text-white shadow-xl space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold text-emerald-300">{todayIndo}</p>
                    <h3 className="text-xl font-black tracking-tight mt-0.5">
                      Assalamu'alaikum, {activeSatpam.nama}
                    </h3>
                    <p className="text-xs text-emerald-200/90 mt-0.5">
                      {activeSatpam.jabatan} · {activeSatpam.posUtama}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-amber-300 tabular-nums">
                      {hhmm}
                      <span className="text-sm text-emerald-200">:{ss}</span>
                    </div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      Waktu Pondok (WIB)
                    </span>
                  </div>
                </div>

                {/* Shift Selector */}
                <div className="rounded-2xl bg-white/10 border border-white/15 p-3.5 space-y-2">
                  <label className="block text-[11px] font-bold text-amber-200">
                    Pilih Shift Jaga / Slot Ronda Aktif:
                  </label>
                  <select
                    disabled={!!activeShiftInProgress}
                    value={activeShiftInProgress && todayShift?.shiftId ? todayShift.shiftId : activeSelectedShift.id}
                    onChange={(e) => setSelectedShiftId(e.target.value)}
                    className="w-full rounded-xl bg-slate-950/70 border border-white/20 px-3 py-2 text-xs font-bold text-white focus:outline-hidden disabled:opacity-70"
                  >
                    {availableShifts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nama} ({s.jamMulai}–{s.jamSelesai} · {calcSatpamShiftDurationLabel(s.jamMulai, s.jamSelesai)})
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center justify-between text-[11px] text-emerald-100/90">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-300" />
                      {displayShiftMeta.pos}
                    </span>
                    <span className="font-mono font-bold text-amber-200">
                      {displayShiftMeta.startDot} – {displayShiftMeta.endDot}
                    </span>
                  </div>
                </div>

                {/* Status Bar & Elapsed Timer */}
                <div className="rounded-2xl bg-black/25 p-4 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-200">Status Tugas Shift Hari Ini:</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                        todayShift?.status === 'bertugas'
                          ? 'bg-emerald-400 text-slate-950'
                          : todayShift?.status === 'istirahat'
                          ? 'bg-amber-400 text-slate-950'
                          : todayShift?.status === 'selesai'
                          ? 'bg-sky-400 text-slate-950'
                          : 'bg-white/15 text-white'
                      }`}
                    >
                      {todayShift?.status === 'bertugas'
                        ? 'Sedang Berjaga'
                        : todayShift?.status === 'istirahat'
                        ? 'Istirahat / Sholat'
                        : todayShift?.status === 'selesai'
                        ? 'Shift Selesai'
                        : 'Belum Cek In'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold">
                        Durasi Jaga Aktif
                      </p>
                      <p className="text-3xl font-black font-mono tracking-tight text-white tabular-nums">
                        {elapsedDisplay}
                      </p>
                    </div>
                    {todayShift && (
                      <div className="text-right text-[11px] text-emerald-200 space-y-0.5">
                        <p>
                          Cek In: <strong className="text-white">{todayShift.checkInDisplay} WIB</strong>
                        </p>
                        {todayShift.checkOutDisplay && (
                          <p>
                            Cek Out: <strong className="text-amber-300">{todayShift.checkOutDisplay} WIB</strong>
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="h-2.5 w-full rounded-full bg-white/15 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-amber-400 to-emerald-400 transition-all duration-500"
                      style={{ width: `${timelinePercent}%` }}
                    />
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    disabled={!!activeShiftInProgress}
                    onClick={() => setOverlayFlow({ type: 'camera', action: 'checkin' })}
                    className="col-span-2 sm:col-span-2 py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 disabled:bg-white/10 disabled:text-white/40 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 transition"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Cek In Swafoto + GPS</span>
                  </button>

                  <button
                    type="button"
                    disabled={!activeShiftInProgress}
                    onClick={() => {
                      toggleIstirahatSatpam(activeSatpam.id);
                      notify(
                        todayShift?.status === 'istirahat'
                          ? `${activeSatpam.nama} melanjutkan tugas pos.`
                          : `${activeSatpam.nama} mode istirahat / sholat.`
                      );
                    }}
                    className="py-3 px-3 rounded-2xl bg-white/15 hover:bg-white/25 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Coffee className="w-4 h-4 text-amber-300" />
                    <span>{todayShift?.status === 'istirahat' ? 'Lanjut Jaga' : 'Istirahat'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={!activeShiftInProgress}
                    onClick={() => setOverlayFlow({ type: 'camera', action: 'checkout' })}
                    className="py-3 px-3 rounded-2xl bg-rose-500 hover:bg-rose-400 disabled:bg-white/10 disabled:text-white/40 text-white font-black text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cek Out</span>
                  </button>
                </div>

                {/* Secondary Quick Requests */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => openPengajuanModal('Absen Pengajuan')}
                    className="py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold text-amber-200 flex items-center justify-center gap-1.5 transition"
                  >
                    <FilePlus2 className="w-3.5 h-3.5" />
                    <span>Absen Pengajuan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openPengajuanModal('Tukar Shift')}
                    className="py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold text-emerald-100 flex items-center justify-center gap-1.5 transition"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Tukar Shift</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openPengajuanModal('Izin')}
                    className="py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold text-emerald-100 flex items-center justify-center gap-1.5 transition"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Izin / Sakit</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Weekly Strip + 6-Month Chart + Personal History */}
            <div className={`${compactPhoneFrame ? 'lg:col-span-12' : 'lg:col-span-5'} space-y-4`}>
              {/* Weekly Strip */}
              <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-900">
                    Disiplin Pekan Ini — {activeSatpam.nama}
                  </h4>
                  <span className="text-[11px] font-bold text-emerald-700">
                    {myMonthlyRecords.filter((r) => r.status === 'Hadir').length} Shift Bulan Ini
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {weekDaysStrip.map((d) => {
                    const cls =
                      d.state === 'hadir'
                        ? 'bg-emerald-600 text-white'
                        : d.state === 'terlambat'
                        ? 'bg-amber-400 text-slate-950'
                        : d.state === 'izin'
                        ? 'bg-sky-500 text-white'
                        : d.state === 'alfa'
                        ? 'bg-slate-200 text-slate-500'
                        : 'bg-slate-50 text-slate-400 border border-dashed border-slate-200';
                    return (
                      <div key={d.iso} className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold text-slate-400">{d.label}</span>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${cls}`}>
                          {d.dayNum}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 6-Month Attendance Trend */}
              <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs space-y-2">
                <h4 className="text-xs font-extrabold text-slate-900">
                  Grafik Kehadiran 6 Bulan Terakhir ({activeSatpam.nama})
                </h4>
                <div className="h-36 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={140}>
                    <AreaChart data={trendChartData}>
                      <XAxis dataKey="bulan" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} width={28} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="persen"
                        stroke="#059669"
                        fill="#a7f3d0"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Personal Recent Logs */}
              <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Riwayat Absensi Terbaru ({activeSatpam.nama})</span>
                  </h4>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {myRecords.slice(0, 8).map((rec) => (
                    <div
                      key={rec.id}
                      className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{rec.shiftNama}</p>
                        <p className="text-[11px] text-slate-500">
                          {rec.tanggal} · Masuk {rec.waktuInput} {rec.waktuCekOut ? `→ Pulang ${rec.waktuCekOut}` : ''}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          rec.status === 'Hadir'
                            ? rec.statusKeterlambatan === 'Terlambat'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {rec.status === 'Hadir' ? rec.statusKeterlambatan || 'Hadir' : rec.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODE 2: MONITORING, VERIFIKASI & REKAP PDF ==================== */}
      {mainMode === 'monitoring' && (
        <div className="space-y-5">
          {/* 4 KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Personil Regu Satpam</span>
              <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">{satpamList.length} Personil</p>
              <p className="text-[10px] text-emerald-700 font-bold mt-0.5">Riyadi, Suwarno, Sopoyono</p>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Hadir ({tanggalFilter})</span>
              <p className="text-2xl font-black text-emerald-800 mt-1 tabular-nums">{hadirDateCount} Shift</p>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Tepat Waktu</span>
              <p className="text-2xl font-black text-blue-800 mt-1 tabular-nums">{tepatWaktuCount} Shift</p>
            </div>
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Pengajuan Pending</span>
              <p className="text-2xl font-black text-amber-700 mt-1 tabular-nums">{pendingPengajuan.length} Berkas</p>
            </div>
          </div>

          {/* Live Mobile Integration Cards per Satpam (Riyadi, Suwarno, Sopoyono) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {satpamList.map((sat) => {
              const liveShift = activeSatpamShiftMap[sat.id];
              const isTodayLive = liveShift && liveShift.tanggal === todayIso;
              const latestRec = satpamAbsensiList.find(
                (r) => r.satpamId === sat.id && (!tanggalFilter || r.tanggal === tanggalFilter)
              );
              const statusLabel = isTodayLive
                ? liveShift.status === 'bertugas'
                  ? 'Sedang Berjaga (Live HP)'
                  : liveShift.status === 'istirahat'
                  ? 'Istirahat / Sholat'
                  : 'Shift Selesai'
                : latestRec
                ? `${latestRec.status} (${latestRec.waktuInput})`
                : 'Belum Cek In';
              const badgeCls = isTodayLive
                ? liveShift.status === 'bertugas'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : liveShift.status === 'istirahat'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-sky-100 text-sky-900 border-sky-300'
                : latestRec
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200';
              return (
                <div
                  key={sat.id}
                  className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-extrabold text-sm text-slate-900">{sat.nama}</p>
                      <p className="text-[11px] text-slate-500">
                        {sat.jabatan} · {sat.posUtama}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold shrink-0 ${badgeCls}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                    <span className="truncate">
                      {isTodayLive
                        ? `${liveShift.shiftNama} · Masuk ${liveShift.checkInDisplay}`
                        : latestRec
                        ? `${latestRec.tanggal} · ${latestRec.shiftNama}`
                        : 'Siap menerima Cek In Mobile HP'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSatpamId(sat.id);
                        setMainMode('mobile_hp');
                      }}
                      className="text-emerald-800 font-bold hover:underline shrink-0 ml-2"
                    >
                      Buka HP →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Toolbar & Sub-mode Tabs */}
          <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'harian_foto', label: 'Log Harian & Swafoto', icon: Camera },
                { id: 'rekap_mingguan', label: 'Rekap Mingguan', icon: CalendarRange },
                { id: 'rekap_bulanan', label: 'Rekap Bulanan (%)', icon: CalendarDays },
                { id: 'pengaturan_shift', label: 'Pengaturan Shift Satpam', icon: SlidersHorizontal },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setMonitoringSubMode(t.id as typeof monitoringSubMode)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                      monitoringSubMode === t.id
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <PrintOrientationControl recommended="landscape" />
              <button
                type="button"
                onClick={handleDownloadWeeklyPdf}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF Mingguan</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadMonthlyPdf}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF Bulanan</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  triggerReliablePrint({
                    title: `Rekapitulasi Absensi Satpam Keamanan (${rekapBulan})`,
                    orientation: printOrientation,
                    paperSize: 'F4',
                    targetElement: satpamPrintRef.current,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak (F4)</span>
              </button>
            </div>
          </div>

          <div ref={satpamPrintRef} className="printable-area space-y-5">
            {/* Print Kop Resmi Pondok (Hidden on Screen, Visible on Print) */}
            <div className="hidden print:flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/aistudio/preview__14__3b7f388f.webp"
                  alt="Logo Pondok"
                  className="w-14 h-14 object-contain"
                />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Koordinator Keamanan &amp; Sekretariat Pondok
                  </p>
                  <h1 className="text-base font-extrabold text-slate-900">
                    PONDOK PESANTREN NU DARUSSALAM KARANGDADAP
                  </h1>
                  <p className="text-[11px] text-slate-600">
                    Karangdadap, Kabupaten Pekalongan · Laporan Monitoring &amp; Presensi Regu Satpam
                  </p>
                </div>
              </div>
              <div className="text-right text-[11px] tabular-nums">
                <p className="font-bold">Periode: {rekapBulan}</p>
                <p>Regu: Pak Riyadi, Pak Suwarno, Pak Sopoyono</p>
              </div>
            </div>

          {/* Pending Approvals Queue */}
          {satpamPengajuanList.length > 0 && monitoringSubMode === 'harian_foto' && (
            <div className="rounded-3xl bg-white border border-amber-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <FileWarning className="w-4 h-4 text-amber-600" />
                  <span>Antrean Verifikasi Absen Pengajuan / Izin / Tukar Shift Satpam</span>
                </h4>
              </div>
              <div className="space-y-2.5">
                {satpamPengajuanList.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-slate-900 text-sm">{req.satpamNama}</strong>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                          {req.jenis}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            req.status === 'Disetujui'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'Ditolak'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <p className="text-slate-600">
                        {req.tanggal} · {req.shiftNama}
                        {req.jamMulaiDiajukan && req.jamSelesaiDiajukan && ` (${req.jamMulaiDiajukan}–${req.jamSelesaiDiajukan})`}
                        {req.penggantiNama && ` · Digantikan: ${req.penggantiNama}`}
                      </p>
                      <p className="text-slate-700 italic">
                        {req.kendalaKategori ? `[${req.kendalaKategori}] ` : ''}
                        "{req.alasan}"
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {req.buktiFotoUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setBuktiPreview({
                              url: req.buktiFotoUrl!,
                              title: `Bukti ${req.satpamNama}`,
                              meta: `${req.tanggal} · ${req.jenis}`,
                            })
                          }
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Bukti
                        </button>
                      )}
                      {req.status === 'Menunggu' && canManageSatpam && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              approveSatpamPengajuan(req.id, 'Disetujui', currentUser.nama);
                              notify(`Pengajuan ${req.satpamNama} disetujui & tercatat di log.`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Setujui
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              approveSatpamPengajuan(req.id, 'Ditolak', currentUser.nama);
                              notify(`Pengajuan ${req.satpamNama} ditolak.`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" /> Tolak
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-MODE 1: LOG HARIAN & SWAFOTO */}
          {monitoringSubMode === 'harian_foto' && (
            <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-sm font-extrabold text-slate-900">
                  Log Kehadiran Harian Regu Satpam
                </h4>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-500">Tanggal:</label>
                  <input
                    type="date"
                    value={tanggalFilter}
                    onChange={(e) => setTanggalFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setTanggalFilter(todayIso)}
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold"
                  >
                    Hari Ini
                  </button>
                  <button
                    type="button"
                    onClick={() => setTanggalFilter('')}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                  >
                    Semua Tanggal
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Nama Satpam</th>
                      <th className="p-3">Shift &amp; Pos Jaga</th>
                      <th className="p-3">Jam Masuk / Keluar</th>
                      <th className="p-3">GPS &amp; Swafoto</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dateRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-600">{rec.tanggal}</td>
                        <td className="p-3 font-bold text-slate-900">{rec.satpamNama}</td>
                        <td className="p-3">
                          <p className="font-bold text-slate-800">{rec.shiftNama}</p>
                          <p className="text-[11px] text-slate-500">{rec.posJaga}</p>
                        </td>
                        <td className="p-3 font-mono">
                          <p className="font-bold text-emerald-800">{rec.waktuInput} WIB</p>
                          {rec.waktuCekOut && (
                            <p className="text-[11px] text-slate-500">
                              Out: {rec.waktuCekOut} ({rec.durasiKerja})
                            </p>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {rec.fotoSelfieUrl ? (
                              <button
                                type="button"
                                onClick={() => setPreviewRecord(rec)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[11px] flex items-center gap-1"
                              >
                                <Camera className="w-3 h-3" /> Lihat Foto
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400">GPS {rec.koordinat || '-'}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              rec.status === 'Hadir'
                                ? rec.statusKeterlambatan === 'Terlambat'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {rec.status === 'Hadir'
                              ? rec.menitTerlambat
                                ? `Terlambat ${rec.menitTerlambat}m`
                                : 'Tepat Waktu'
                              : rec.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            disabled={!canManageSatpam}
                            onClick={() =>
                              verifySatpamAbsensiRecord(
                                rec.id,
                                rec.verifikasiAtasan === 'Terverifikasi' ? 'Menunggu' : 'Terverifikasi'
                              )
                            }
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              rec.verifikasiAtasan === 'Terverifikasi'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {rec.verifikasiAtasan || 'Terverifikasi'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-MODE 2: REKAP MINGGUAN */}
          {monitoringSubMode === 'rekap_mingguan' && (
            <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Matriks Kehadiran Mingguan Satpam ({weekStartIso} s.d. {addDaysIso(weekStartIso, 6)})
                  </h4>
                  <p className="text-xs text-slate-500">H = Hadir Tepat Waktu, T = Terlambat, I/S/Tukar = Pengajuan Disetujui</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setWeekStartIso(addDaysIso(weekStartIso, -7))}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeekStartIso(addDaysIso(weekStartIso, 7))}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-center border-collapse">
                  <thead className="bg-emerald-900 text-white text-[11px]">
                    <tr>
                      <th className="p-3 text-left">Personil Satpam</th>
                      {weekDays.map((d) => (
                        <th key={d.iso} className="p-2">
                          <div>{d.dayShort}</div>
                          <div className="text-[10px] text-emerald-200">{d.dateShort}</div>
                        </th>
                      ))}
                      <th className="p-2">Hadir</th>
                      <th className="p-2">Telat</th>
                      <th className="p-2">Disiplin (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {weeklyRecapRows.map((row) => (
                      <tr key={row.satpam.id} className="hover:bg-slate-50">
                        <td className="p-3 text-left">
                          <p className="font-bold text-slate-900">{row.satpam.nama}</p>
                          <p className="text-[10px] text-slate-500">{row.satpam.posUtama}</p>
                        </td>
                        {row.dayCells.map(({ day, rec }) => (
                          <td key={day.iso} className="p-2">
                            {rec ? (
                              <span
                                className={`inline-flex w-7 h-7 rounded-lg items-center justify-center font-black text-[11px] ${
                                  rec.status === 'Hadir'
                                    ? rec.statusKeterlambatan === 'Terlambat'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                    : 'bg-sky-100 text-sky-800'
                                }`}
                              >
                                {rec.status === 'Hadir'
                                  ? rec.statusKeterlambatan === 'Terlambat'
                                    ? 'T'
                                    : 'H'
                                  : rec.status.charAt(0)}
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                        ))}
                        <td className="p-2 font-black text-emerald-800">{row.hadir}</td>
                        <td className="p-2 font-bold text-amber-700">{row.terlambat}</td>
                        <td className="p-2 font-black text-slate-900">{row.persentaseMingguan}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-MODE 3: REKAP BULANAN */}
          {monitoringSubMode === 'rekap_bulanan' && (
            <div className="space-y-5">
              <RekapAbsensiSpreadsheet
                mode="satpam"
                rekapBulan={rekapBulan}
                onChangeRekapBulan={setRekapBulan}
                satpamList={satpamList}
                satpamAbsensiList={satpamAbsensiList}
                satpamPengajuanList={satpamPengajuanList}
                signerName={formatNamaWithGelar(currentUser.nama)}
                onNotify={notify}
                onPrint={() =>
                  triggerReliablePrint({
                    title: `Rekapitulasi Absensi Satpam Keamanan (${rekapBulan})`,
                    orientation: printOrientation,
                    paperSize: 'F4',
                    targetElement: satpamPrintRef.current,
                  })
                }
              />

              <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Ringkasan Detail Shift &amp; Bukti Swafoto Regu Satpam
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Integrasi otomatis bukti swafoto GPS &amp; persentase shift ke format dokumen resmi pesantren.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="month"
                      value={rekapBulan}
                      onChange={(e) => setRekapBulan(e.target.value)}
                      className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={handleDownloadMonthlyPdf}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold transition shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Ekspor ke PDF</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Personil Satpam</th>
                        <th className="p-3">Jabatan</th>
                        <th className="p-3">Pos Utama</th>
                        <th className="p-3 text-center">Total Shift Hadir</th>
                        <th className="p-3 text-center">Bukti Swafoto</th>
                        <th className="p-3 text-center">Terlambat</th>
                        <th className="p-3 text-center">Izin / Tukar</th>
                        <th className="p-3 text-center">Persentase</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {monthlyRecapRows.map((row) => (
                        <tr key={row.satpam.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{row.satpam.nama}</td>
                          <td className="p-3 text-slate-600">{row.satpam.jabatan}</td>
                          <td className="p-3 text-slate-600">{row.satpam.posUtama}</td>
                          <td className="p-3 text-center font-black text-emerald-800">{row.hadir}</td>
                          <td className="p-3 text-center">{row.selfieCount}</td>
                          <td className="p-3 text-center font-bold text-amber-700">{row.terlambat}</td>
                          <td className="p-3 text-center">{row.izinTukar}</td>
                          <td className="p-3 text-center font-black text-slate-900">{row.persentase}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          </div>

          {/* SUB-MODE 4: PENGATURAN SHIFT SATPAM */}
          {monitoringSubMode === 'pengaturan_shift' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Daftar Shift Jaga &amp; Slot Ronda Satpam
                  </h4>
                  {canManageSatpam && (
                    <button
                      type="button"
                      onClick={() => {
                        resetSatpamShiftConfigs();
                        notify('Shift Satpam dikembalikan ke pengaturan awal.');
                      }}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset Standar
                    </button>
                  )}
                </div>
                <div className="space-y-2.5">
                  {satpamShiftConfigs.map((cfg) => (
                    <div
                      key={cfg.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-bold text-xs text-slate-900">{cfg.nama}</p>
                        <p className="text-[11px] text-slate-500">
                          {cfg.jamMulai} – {cfg.jamSelesai} WIB ({calcSatpamShiftDurationLabel(cfg.jamMulai, cfg.jamSelesai)}) · Toleransi {cfg.toleransiMenit} mnt
                        </p>
                        <p className="text-[11px] text-emerald-700 font-semibold">{cfg.pos}</p>
                      </div>
                      {canManageSatpam && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEditShift(cfg)}
                            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-emerald-800"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSatpamShiftConfig(cfg.id)}
                            className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-3">
                <h4 className="text-sm font-extrabold text-slate-900">
                  {editingShiftId ? 'Ubah Shift Satpam' : 'Tambah Shift / Slot Ronda Baru'}
                </h4>
                <form onSubmit={handleSaveShiftForm} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Shift / Sesi</label>
                    <input
                      required
                      value={shiftNama}
                      onChange={(e) => setShiftNama(e.target.value)}
                      placeholder="Contoh: Slot Patroli Subuh"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pos Jaga / Lokasi Patroli</label>
                    <input
                      value={shiftPos}
                      onChange={(e) => setShiftPos(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mulai</label>
                      <input
                        type="time"
                        value={shiftJamMulai}
                        onChange={(e) => setShiftJamMulai(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-2.5 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Selesai</label>
                      <input
                        type="time"
                        value={shiftJamSelesai}
                        onChange={(e) => setShiftJamSelesai(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-2.5 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Toleransi (m)</label>
                      <input
                        type="number"
                        value={shiftToleransi}
                        onChange={(e) => setShiftToleransi(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 px-2.5 py-2"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{editingShiftId ? 'Simpan Perubahan' : 'Tambah Shift'}</span>
                    </button>
                    {editingShiftId && (
                      <button
                        type="button"
                        onClick={resetShiftForm}
                        className="px-3 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== CAMERA + GPS OVERLAY MODAL ==================== */}
      {overlayFlow?.type === 'camera' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  {overlayFlow.action === 'checkin' ? 'Swafoto Cek In Satpam' : 'Swafoto Cek Out Satpam'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {activeSatpam?.nama} · {displayShiftMeta.nama}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOverlayFlow(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-4/3 flex items-center justify-center">
              {uploadedPreviewUrl ? (
                <img src={uploadedPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
              )}
              {!cameraReady && !uploadedPreviewUrl && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white bg-emerald-950/90">
                  <Camera className="w-10 h-10 text-amber-300 mb-2" />
                  <p className="text-xs font-bold">{cameraError || 'Menyiapkan kamera HP...'}</p>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-emerald-900">
                <Crosshair className="w-4 h-4 text-emerald-700" />
                GPS: {gpsCoords} (±{gpsAccuracy}m)
              </span>
              <span className="text-[11px] font-bold text-emerald-700">
                {gpsStatus === 'ready' ? 'Lokasi Terkunci' : 'Mencari GPS...'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah Foto</span>
                <input type="file" accept="image/*" capture="user" onChange={handleUploadSelfieFile} className="hidden" />
              </label>
              <button
                type="button"
                onClick={handleConfirmCameraAction}
                className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold shadow-md"
              >
                {overlayFlow.action === 'checkin' ? 'Konfirmasi Cek In Sekarang' : 'Konfirmasi Cek Out'}
              </button>
            </div>
          </div>
        </div>
      )}

      {overlayFlow?.type === 'confirmed' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-black text-base text-slate-900">
              {overlayFlow.action === 'checkin' ? 'Cek In Satpam Berhasil!' : 'Cek Out Satpam Selesai!'}
            </h4>
            <p className="text-xs text-slate-600">
              {activeSatpam?.nama} · {overlayFlow.shiftNama}
            </p>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 text-xs space-y-1">
              <p>Waktu Tercatat: <strong>{overlayFlow.waktuWib}</strong></p>
              <p>Koordinat GPS: <strong>{overlayFlow.koordinat}</strong> (±{overlayFlow.akurasi}m)</p>
              {overlayFlow.durasiKerja && (
                <p>Total Durasi Jaga: <strong>{overlayFlow.durasiKerja}</strong></p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOverlayFlow(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold"
            >
              Selesai
            </button>
          </div>
        </div>
      )}

      {/* ==================== MODAL ABSEN PENGAJUAN / IZIN / TUKAR SHIFT ==================== */}
      {showPengajuanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-sm text-slate-900">
                Form Pengajuan Absensi Satpam ({activeSatpam?.nama})
              </h4>
              <button
                type="button"
                onClick={() => setShowPengajuanModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitPengajuan} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Pengajuan</label>
                  <select
                    value={pengJenis}
                    onChange={(e) => setPengJenis(e.target.value as SatpamPengajuanRequest['jenis'])}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-bold"
                  >
                    <option value="Absen Pengajuan">Absen Pengajuan (Kendala)</option>
                    <option value="Tukar Shift">Tukar Shift</option>
                    <option value="Izin">Izin</option>
                    <option value="Sakit">Sakit</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={pengTanggal}
                    onChange={(e) => setPengTanggal(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Shift Jaga</label>
                <select
                  value={pengShiftId}
                  onChange={(e) => setPengShiftId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2"
                >
                  {availableShifts.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.jamMulai}–{s.jamSelesai})
                    </option>
                  ))}
                </select>
              </div>

              {pengJenis === 'Absen Pengajuan' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kategori Kendala</label>
                    <select
                      value={pengKendala}
                      onChange={(e) => setPengKendala(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2"
                    >
                      {KENDALA_SATPAM_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Jam Mulai</label>
                      <input
                        type="time"
                        value={pengJamMulai}
                        onChange={(e) => setPengJamMulai(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Jam Selesai</label>
                      <input
                        type="time"
                        value={pengJamSelesai}
                        onChange={(e) => setPengJamSelesai(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2"
                      />
                    </div>
                  </div>
                </>
              )}

              {pengJenis === 'Tukar Shift' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Personil Satpam Pengganti</label>
                  <select
                    value={penggantiNama}
                    onChange={(e) => setPenggantiNama(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  >
                    {satpamList
                      .filter((s) => s.id !== activeSatpam?.id)
                      .map((s) => (
                        <option key={s.id} value={s.nama}>{s.nama}</option>
                      ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan / Alasan Lengkap</label>
                <textarea
                  required
                  rows={3}
                  value={pengAlasan}
                  onChange={(e) => setPengAlasan(e.target.value)}
                  placeholder="Tuliskan detail tugas atau kendala di lapangan..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Unggah Foto Bukti (Opsional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === 'string') setPengBuktiFoto(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="w-full text-[11px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold"
              >
                Kirim Pengajuan ke Koordinator Keamanan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL CARA UNDUH DI HP SATPAM ==================== */}
      {showHpInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span>Panduan Pasang Aplikasi Absensi di HP Satpam</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowHpInstallModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <p className="font-extrabold text-emerald-900">1. HP Android (Google Chrome):</p>
                <p>Buka link aplikasi ERP di Chrome → ketuk titik tiga di pojok kanan atas → pilih <strong>"Install Aplikasi" / "Tambahkan ke Layar Utama"</strong>. Ikon shortcut <strong>Absensi Satpam</strong> langsung muncul seperti aplikasi Play Store.</p>
              </div>
              <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
                <p className="font-extrabold text-sky-900">2. HP iPhone (Safari):</p>
                <p>Buka di Safari → tekan tombol <strong>Bagikan (<Share2 className="inline w-3 h-3" />)</strong> di bawah layar → pilih <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong>.</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <p className="font-extrabold text-amber-900">3. Akun Login Regu Satpam:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li><strong>Pak Riyadi</strong>: username <code className="font-mono font-bold">riyadi</code></li>
                  <li><strong>Pak Suwarno</strong>: username <code className="font-mono font-bold">suwarno</code></li>
                  <li><strong>Pak Sopoyono</strong>: username <code className="font-mono font-bold">sopoyono</code></li>
                  <li>Sandi awal semua akun: <code className="font-mono font-bold">darussalam2026</code></li>
                </ul>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowHpInstallModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold"
            >
              Mengerti &amp; Tutup
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Selfie / Bukti */}
      {(previewRecord || buktiPreview) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-sm text-slate-900">
                {previewRecord ? `${previewRecord.satpamNama} — ${previewRecord.tanggal}` : buktiPreview?.title}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setPreviewRecord(null);
                  setBuktiPreview(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={previewRecord?.fotoSelfieUrl || buktiPreview?.url}
              alt="Swafoto Bukti"
              className="w-full rounded-2xl object-cover border border-slate-200"
            />
            <p className="text-xs text-slate-600">
              {previewRecord
                ? `${previewRecord.shiftNama} · GPS ${previewRecord.koordinat || '-'}`
                : buktiPreview?.meta}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
