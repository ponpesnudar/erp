import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Camera,
  CheckCircle2,
  Download,
  ExternalLink,
  HelpCircle,
  History,
  Home,
  Maximize2,
  Minimize2,
  Send,
  Sparkles,
  X,
  AlertTriangle,
  ScrollText,
} from 'lucide-react';
import {
  MajlisHall3D,
  type MajlisBenchStation,
  type MajlisCameraTarget,
  type MajlisCalloutData,
  type MajlisBoardConfig,
} from '../../components/common/MajlisHall3D.tsx';
import {
  KITAB_TICKER_PRESETS,
  PRESET_BAHTSUL_MASAIL,
  downloadBahtsulMasailPdf,
  resolveLocalBahtsulMasail,
  type BahtsulMasailResult,
  type KitabPageDetail,
  type MadzhabOpinion,
} from '../../lib/bahtsulMasailData.ts';
import {
  MUNAQOSYAH_BENCHES,
  MUNAQOSYAH_MAKRO_ENVELOPES,
  type MunaqosyahBenchId,
  type MunaqosyahTingkat,
} from '../../data/seed/munaqosyahData.ts';

type SidangPhase =
  | 'idle'
  | 'moderator'
  | 'perumus'
  | 'madzhab_syafii'
  | 'madzhab_hanafi'
  | 'madzhab_maliki'
  | 'madzhab_hanbali'
  | 'mushahih'
  | 'notulen';

const BAHTSUL_BENCHES: MajlisBenchStation[] = [
  // Elevated Front Dais (4 seats)
  {
    id: 'mushahih',
    label: 'MUSHAHIH',
    badgeColor: '#0F6B43',
    position: [-3.3, 0.24, -5.6],
    rotationY: 0,
    avatarCount: 1,
    kitabColor: '#064E3B',
  },
  {
    id: 'perumus',
    label: 'PERUMUS',
    badgeColor: '#B45309',
    position: [-1.1, 0.24, -5.6],
    rotationY: 0,
    avatarCount: 1,
    kitabColor: '#8B1E24',
  },
  {
    id: 'moderator',
    label: 'MODERATOR',
    badgeColor: '#0E7490',
    position: [1.1, 0.24, -5.6],
    rotationY: 0,
    avatarCount: 1,
    kitabColor: '#1E3A8A',
  },
  {
    id: 'notulen',
    label: 'NOTULEN',
    badgeColor: '#334155',
    position: [3.3, 0.24, -5.6],
    rotationY: 0,
    avatarCount: 1,
    kitabColor: '#0F5132',
  },
  // 4 Madzhab Wing Benches
  {
    id: 'syafiiyah',
    label: "SYAFI'IYAH",
    badgeColor: '#0F6B43',
    position: [-5.6, 0, -2.0],
    rotationY: Math.PI / 2,
    avatarCount: 2,
    kitabColor: '#0F5132',
  },
  {
    id: 'hanafiyah',
    label: 'HANAFIYAH',
    badgeColor: '#1D4ED8',
    position: [5.6, 0, -2.0],
    rotationY: -Math.PI / 2,
    avatarCount: 2,
    kitabColor: '#1E3A8A',
  },
  {
    id: 'malikiyah',
    label: 'MALIKIYAH',
    badgeColor: '#B45309',
    position: [-5.6, 0, 0.9],
    rotationY: Math.PI / 2,
    avatarCount: 2,
    kitabColor: '#9A3412',
  },
  {
    id: 'hanabilah',
    label: 'HANABILAH',
    badgeColor: '#991B1B',
    position: [5.6, 0, 0.9],
    rotationY: -Math.PI / 2,
    avatarCount: 2,
    kitabColor: '#7F1D1D',
  },
];

const CAMERA_PRESETS: Record<string, { label: string; cam: MajlisCameraTarget }> = {
  overview: {
    label: 'Ruang Sidang Utama',
    cam: { pos: [0, 5.1, 8.6], target: [0, 1.9, -4.4] },
  },
  dais: {
    label: 'Dewan Mushahih & Moderator',
    cam: { pos: [0, 3.2, -0.4], target: [0, 2.3, -6.2] },
  },
  syafiiyah: {
    label: "Bangku Madzhab Syafi'iyah",
    cam: { pos: [-1.4, 2.75, -1.6], target: [-5.4, 1.3, -2.0] },
  },
  hanafiyah: {
    label: 'Bangku Madzhab Hanafiyah',
    cam: { pos: [1.4, 2.75, -1.6], target: [5.4, 1.3, -2.0] },
  },
  malikiyah: {
    label: 'Bangku Madzhab Malikiyah',
    cam: { pos: [-1.4, 2.75, 1.1], target: [-5.4, 1.3, 0.9] },
  },
  hanabilah: {
    label: 'Bangku Madzhab Hanabilah',
    cam: { pos: [1.4, 2.75, 1.1], target: [5.4, 1.3, 0.9] },
  },
};

const QUICK_PROMPTS = [
  {
    label: 'Hukum menyadap atau membuka rahasia tanpa izin',
    presetId: 'bm-menyadap-rahasia',
  },
  {
    label: 'Hukum sholat Jumat di bawah 40 jamaah mukim',
    presetId: 'bm-jumat-40',
  },
  {
    label: 'Hukum jual beli sistem dropship dan pre-order dalam fiqih muamalah',
    presetId: 'bm-dropship-preorder',
  },
];

export const BahtsulMasail3DSection: React.FC = () => {
  const [publicMajlisMode, setPublicMajlisMode] = useState<'bahtsul_masail' | 'munaqosyah'>('bahtsul_masail');
  const [pubTingkat, setPubTingkat] = useState<MunaqosyahTingkat>('Kelas 3');
  const [pubMakroIdx, setPubMakroIdx] = useState(0);
  const [pubActiveBench, setPubActiveBench] = useState<'overview' | MunaqosyahBenchId>('overview');

  const [historyList, setHistoryList] = useState<BahtsulMasailResult[]>(PRESET_BAHTSUL_MASAIL);
  const [activeResult, setActiveResult] = useState<BahtsulMasailResult>(PRESET_BAHTSUL_MASAIL[0]);
  const [phase, setPhase] = useState<SidangPhase>('idle');
  const [cameraKey, setCameraKey] = useState<string>('overview');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals / Drawers
  const [showAskModal, setShowAskModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [kitabDrawerDetail, setKitabDrawerDetail] = useState<{
    madzhab: string;
    detail: KitabPageDetail;
  } | null>(null);

  const [inputAsilah, setInputAsilah] = useState('');
  const [activeTopicText, setActiveTopicText] = useState(PRESET_BAHTSUL_MASAIL[0].asilah);
  const [apiError, setApiError] = useState('');
  const [elapsedSec, setElapsedSec] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearChoreographyTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearChoreographyTimers();
      abortRef.current?.abort();
    };
  }, []);

  // Stopwatch during live hearing
  useEffect(() => {
    if (phase === 'idle') {
      setElapsedSec(0);
      return;
    }
    const id = window.setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  const cameraTarget = useMemo<MajlisCameraTarget>(() => {
    if (phase === 'moderator' || phase === 'perumus' || phase === 'mushahih' || phase === 'notulen') {
      return CAMERA_PRESETS.dais.cam;
    }
    if (phase === 'madzhab_syafii') return CAMERA_PRESETS.syafiiyah.cam;
    if (phase === 'madzhab_hanafi') return CAMERA_PRESETS.hanafiyah.cam;
    if (phase === 'madzhab_maliki') return CAMERA_PRESETS.malikiyah.cam;
    if (phase === 'madzhab_hanbali') return CAMERA_PRESETS.hanabilah.cam;
    return CAMERA_PRESETS[cameraKey]?.cam || CAMERA_PRESETS.overview.cam;
  }, [phase, cameraKey]);

  const activeBenchId = useMemo<string | null>(() => {
    switch (phase) {
      case 'moderator':
        return 'moderator';
      case 'perumus':
        return 'perumus';
      case 'madzhab_syafii':
        return 'syafiiyah';
      case 'madzhab_hanafi':
        return 'hanafiyah';
      case 'madzhab_maliki':
        return 'malikiyah';
      case 'madzhab_hanbali':
        return 'hanabilah';
      case 'mushahih':
        return 'mushahih';
      case 'notulen':
        return 'notulen';
      default:
        return null;
    }
  }, [phase]);

  const boardConfig = useMemo<MajlisBoardConfig>(() => {
    const isFinishedOrIdle = phase === 'idle' || phase === 'notulen';
    return {
      arabicHeading: 'بَحْثُ الْمَسَائِلِ',
      title: 'FORUM BAHTSUL MASAIL AI · PP NU DARUSSALAM',
      subtitleLabel: 'MASALAH / AS\'ILAH',
      subtitleText: activeTopicText,
      bodyLabel: isFinishedOrIdle ? 'RUMUSAN SIDANG' : 'PROSES ISTINBATH EMPAT MADZHAB',
      bodyText: isFinishedOrIdle
        ? activeResult.rumusanSidang.ringkasanPapan
        : 'Dewan Perumus dan 4 Madzhab (Syafi\'iyah, Hanafiyah, Malikiyah, Hanabilah) sedang menelusuri ibarat kitab mu\'tabarah...',
    };
  }, [phase, activeTopicText, activeResult]);

  const callouts = useMemo<MajlisCalloutData[]>(() => {
    if (phase === 'moderator') {
      return [
        {
          benchId: 'moderator',
          headerBadge: 'Moderator',
          primaryText: "Membacakan as'ilah kepada majlis",
          secondaryText: activeTopicText,
          accentHex: '#0E7490',
        },
      ];
    }
    if (phase === 'perumus') {
      return [
        {
          benchId: 'perumus',
          headerBadge: 'Perumus',
          primaryText: 'Merumuskan masalah & cakupan fiqih',
          secondaryText: 'Memilah aspek qauli, ilhaqi, dan manhaji',
          accentHex: '#B45309',
        },
      ];
    }
    if (
      phase === 'madzhab_syafii' ||
      phase === 'madzhab_hanafi' ||
      phase === 'madzhab_maliki' ||
      phase === 'madzhab_hanbali'
    ) {
      return [
        {
          benchId: 'syafiiyah',
          headerBadge: "Syafi'iyah · الشافعية",
          primaryText:
            phase === 'madzhab_syafii' ? 'Menelusuri kitab rujukan mu\'tabarah' : 'Menyiapkan hujjah kitab',
          kitabTickerItems: KITAB_TICKER_PRESETS.syafiiyah,
          accentHex: '#0F6B43',
        },
        {
          benchId: 'hanafiyah',
          headerBadge: 'Hanafiyah · الحنفية',
          primaryText:
            phase === 'madzhab_hanafi' ? 'Menelusuri kitab rujukan mu\'tabarah' : 'Menelaah ushul Hanafiyah',
          kitabTickerItems: KITAB_TICKER_PRESETS.hanafiyah,
          accentHex: '#1D4ED8',
        },
        {
          benchId: 'malikiyah',
          headerBadge: 'Malikiyah · المالكية',
          primaryText:
            phase === 'madzhab_maliki' ? 'Menelusuri kitab rujukan mu\'tabarah' : 'Mencocokkan nash Malikiyah',
          kitabTickerItems: KITAB_TICKER_PRESETS.malikiyah,
          accentHex: '#B45309',
        },
        {
          benchId: 'hanabilah',
          headerBadge: 'Hanabilah · الحنابلة',
          primaryText:
            phase === 'madzhab_hanbali' ? 'Menelusuri kitab rujukan mu\'tabarah' : 'Memeriksa al-Mughni & Kassyaf',
          kitabTickerItems: KITAB_TICKER_PRESETS.hanabilah,
          accentHex: '#991B1B',
        },
      ];
    }
    if (phase === 'mushahih') {
      return [
        {
          benchId: 'mushahih',
          headerBadge: 'Mushahih',
          primaryText: 'Menimbang & mentarjih pendapat 4 madzhab',
          secondaryText: 'Menjaga keselarasan kaidah ushul fiqih pesantren',
          accentHex: '#0F6B43',
        },
      ];
    }
    if (phase === 'notulen') {
      return [
        {
          benchId: 'notulen',
          headerBadge: 'Notulen',
          primaryText: 'Mencatat rumusan akhir sidang & menyusun PDF',
          accentHex: '#334155',
        },
      ];
    }
    return [];
  }, [phase, activeTopicText]);

  const scheduleChoreography = (onReadyResult?: BahtsulMasailResult) => {
    clearChoreographyTimers();
    setPhase('moderator');
    const seq: Array<[SidangPhase, number]> = [
      ['perumus', 2400],
      ['madzhab_syafii', 4800],
      ['madzhab_hanafi', 7400],
      ['madzhab_maliki', 9800],
      ['madzhab_hanbali', 12200],
      ['mushahih', 14600],
      ['notulen', 17200],
    ];
    seq.forEach(([nextPhase, delay]) => {
      const id = window.setTimeout(() => setPhase(nextPhase), delay);
      timersRef.current.push(id);
    });
    if (onReadyResult) {
      const doneId = window.setTimeout(() => {
        setActiveResult(onReadyResult);
        setPhase('idle');
        setCameraKey('overview');
        setShowResultModal(true);
      }, 19200);
      timersRef.current.push(doneId);
    }
  };

  const handlePlayClassicalPreset = (preset: BahtsulMasailResult) => {
    setApiError('');
    setShowAskModal(false);
    setActiveTopicText(preset.asilah);
    scheduleChoreography(preset);
  };

  const handleCancelSidang = () => {
    clearChoreographyTimers();
    abortRef.current?.abort();
    setPhase('idle');
    setCameraKey('overview');
  };

  const handleSubmitAiAsilah = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputAsilah.trim();
    if (!q) return;

    setApiError('');
    setShowAskModal(false);
    setActiveTopicText(q);
    scheduleChoreography(); // run animated camera sequence while deliberating

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const completeWithResult = (result: BahtsulMasailResult) => {
      clearChoreographyTimers();
      setActiveResult(result);
      setHistoryList((prev) => [result, ...prev]);

      // Finish cleanly through Mushahih -> Notulen -> Modal
      setPhase('mushahih');
      const t1 = window.setTimeout(() => setPhase('notulen'), 1800);
      const t2 = window.setTimeout(() => {
        setPhase('idle');
        setCameraKey('overview');
        setShowResultModal(true);
      }, 3600);
      timersRef.current.push(t1, t2);
    };

    try {
      const res = await fetch('/api/bahtsul-masail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asilah: q }),
        signal: controller.signal,
      });

      const rawText = await res.text();
      const trimmed = rawText.trim();
      const isHtmlPayload =
        trimmed.startsWith('<') || trimmed.toLowerCase().startsWith('<!doctype');

      let parsed: Partial<BahtsulMasailResult> | null = null;
      if (!isHtmlPayload && trimmed) {
        try {
          parsed = JSON.parse(trimmed) as Partial<BahtsulMasailResult>;
        } catch {
          parsed = null;
        }
      }

      if (
        res.ok &&
        parsed &&
        Array.isArray(parsed.pendapatPerMadzhab) &&
        parsed.pendapatPerMadzhab.length > 0 &&
        parsed.rumusanSidang
      ) {
        completeWithResult(parsed as BahtsulMasailResult);
        return;
      }

      // Graceful fallback: HTML/SPA route fallback or Gemini API unavailable -> Kitab Mu'tabarah 4-Madzhab deliberation
      completeWithResult(resolveLocalBahtsulMasail(q));
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      completeWithResult(resolveLocalBahtsulMasail(q));
    }
  };

  const cycleCameraPreset = () => {
    const keys = Object.keys(CAMERA_PRESETS);
    const idx = keys.indexOf(cameraKey);
    const next = keys[(idx + 1) % keys.length];
    setCameraKey(next);
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const phaseLabelMap: Record<SidangPhase, string> = {
    idle: 'Majlis Siap Sidang',
    moderator: "Moderator membacakan as'ilah",
    perumus: 'Perumus merumuskan masalah',
    madzhab_syafii: "Madzhab Syafi'iyah menelusuri kitab",
    madzhab_hanafi: 'Madzhab Hanafiyah menelusuri kitab',
    madzhab_maliki: 'Madzhab Malikiyah menelusuri kitab',
    madzhab_hanbali: 'Madzhab Hanabilah menelusuri kitab',
    mushahih: 'Mushahih mentarjih pendapat 4 madzhab',
    notulen: 'Notulen mencatat rumusan sidang',
  };

  const getMadzhabTheme = (kode: MadzhabOpinion['kode']) => {
    if (kode === 'syafiiyah')
      return {
        headerBg: 'bg-[#0F6B43]',
        border: 'border-emerald-300',
        softBg: 'bg-emerald-50/70',
      };
    if (kode === 'hanafiyah')
      return {
        headerBg: 'bg-blue-700',
        border: 'border-blue-300',
        softBg: 'bg-blue-50/70',
      };
    if (kode === 'malikiyah')
      return {
        headerBg: 'bg-amber-700',
        border: 'border-amber-300',
        softBg: 'bg-amber-50/70',
      };
    return {
      headerBg: 'bg-rose-800',
      border: 'border-rose-300',
      softBg: 'bg-rose-50/70',
    };
  };

  const pubMakroList = useMemo(
    () => MUNAQOSYAH_MAKRO_ENVELOPES.filter((m) => m.tingkat === pubTingkat),
    [pubTingkat]
  );
  const pubActiveMakro = pubMakroList[pubMakroIdx % Math.max(pubMakroList.length, 1)] || pubMakroList[0];

  const pubMunaqosyahBenches = useMemo<MajlisBenchStation[]>(() => {
    const base: MajlisBenchStation[] = [
      {
        id: 'moderator',
        label: "1. MODERATOR (UNDIAN)",
        badgeColor: '#0F6B43',
        position: [-4.35, 0.24, -4.8],
        rotationY: 0.24,
        avatarCount: 1,
        kitabColor: '#064E3B',
        hasEnvelopeStack: true,
      },
      {
        id: 'nahwu_shorof',
        label: pubTingkat === 'Kelas 3' ? '2. NAHWU (IMRITHI)' : '2. NAHWU (ALFIYAH)',
        badgeColor: '#0E7490',
        position: [-1.52, 0.24, -5.35],
        rotationY: 0.08,
        avatarCount: 1,
        kitabColor: '#0E7490',
      },
      {
        id: 'fiqih',
        label: pubTingkat === 'Kelas 3' ? '3. FIQIH (F. QORIB)' : "3. FIQIH (F. MU'IN)",
        badgeColor: '#1D4ED8',
        position: [1.52, 0.24, -5.35],
        rotationY: -0.08,
        avatarCount: 1,
        kitabColor: '#1E3A8A',
      },
      {
        id: 'alquran',
        label: "4. FAN AL-QUR'AN",
        badgeColor: '#B45309',
        position: [4.35, 0.24, -4.8],
        rotationY: -0.24,
        avatarCount: 1,
        kitabColor: '#92400E',
      },
      {
        id: 'santri_mod',
        label: `PESERTA #2 · MAKRO ${pubActiveMakro?.nomorMakro || 1}`,
        badgeColor: '#047857',
        position: [-3.95, 0, -2.25],
        rotationY: Math.PI + 0.22,
        avatarCount: 1,
        isSantriPeserta: true,
        noPersonalKitab: true,
      },
      {
        id: 'santri_nahwu',
        label: `PESERTA #1 · NAHWU`,
        badgeColor: '#047857',
        position: [-1.38, 0, -2.55],
        rotationY: Math.PI + 0.06,
        avatarCount: 1,
        isSantriPeserta: true,
        noPersonalKitab: true,
      },
    ];
    return base;
  }, [pubTingkat, pubActiveMakro]);

  const pubMunaqosyahCamera = useMemo<MajlisCameraTarget>(() => {
    if (pubActiveBench === 'moderator') return { pos: [-3.3, 2.75, 0.2], target: [-4.35, 1.3, -4.4] };
    if (pubActiveBench === 'nahwu_shorof') return { pos: [-1.45, 2.75, -0.35], target: [-1.52, 1.3, -4.9] };
    if (pubActiveBench === 'fiqih') return { pos: [1.45, 2.75, -0.35], target: [1.52, 1.3, -4.9] };
    if (pubActiveBench === 'alquran') return { pos: [3.3, 2.75, 0.2], target: [4.35, 1.3, -4.4] };
    return { pos: [0, 5.4, 8.9], target: [0, 1.65, -3.9] };
  }, [pubActiveBench]);

  const pubMunaqosyahBoard = useMemo<MajlisBoardConfig>(
    () => ({
      arabicHeading: 'مَجْلِسُ الْمُنَاقَشَةِ',
      title: `SIDANG MUNAQOSYAH TERBUKA ${pubTingkat.toUpperCase()}`,
      subtitleLabel: pubActiveMakro ? `UNDIAN ${pubActiveMakro.kodeAmplop.toUpperCase()}` : 'ALUR ESTAFET 4 BANGKU',
      subtitleText: pubActiveMakro
        ? `${pubActiveMakro.kitabSumber} — ${pubActiveMakro.lokasiKitab}`
        : '1. Moderator Undi Amplop Makro -> 2. Nahwu Shorof -> 3. Fiqih -> 4. Al-Qur\'an',
      bodyLabel: 'IBARAT MAKRO\' (SANTRI TANPA KITAB)',
      bodyText: pubActiveMakro
        ? pubActiveMakro.terjemahMakro
        : 'Santri masuk tanpa membawa kitab untuk diuji pada 4 bangku penyimak secara berurutan.',
    }),
    [pubTingkat, pubActiveMakro]
  );

  const pubMunaqosyahCallouts = useMemo<MajlisCalloutData[]>(
    () =>
      MUNAQOSYAH_BENCHES.map((b) => ({
        benchId: b.id,
        headerBadge: `Bangku ${b.nomorBangku}`,
        arabLine: b.arabLabel,
        primaryText: pubTingkat === 'Kelas 3' ? b.kitabKelas3 : b.kitabKelas6,
        secondaryText: b.pengujiDefault,
        accentHex: b.warnaBadge,
      })),
    [pubTingkat]
  );

  return (
    <section
      id="bahtsul-masail"
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#1B1F1C] flex flex-col'
          : 'py-14 bg-[#07432A] border-y border-emerald-900 text-white'
      }
    >
      <div className={isFullscreen ? 'flex-1 flex flex-col min-h-0' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6'}>
        {/* Section Intro Banner (Hidden in fullscreen to match pure 3D app) */}
        {!isFullscreen && (
          <div className="space-y-4">
            {/* Mode Tabs: Bahtsul Masail 3D vs Sidang Munaqosyah 3D (Publik) */}
            <div className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-emerald-950/80 border border-emerald-800">
              <button
                type="button"
                onClick={() => setPublicMajlisMode('bahtsul_masail')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
                  publicMajlisMode === 'bahtsul_masail'
                    ? 'bg-[#D9822B] text-white shadow-sm'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Forum Bahtsul Masail AI 3D (4 Madzhab)</span>
              </button>
              <button
                type="button"
                onClick={() => setPublicMajlisMode('munaqosyah')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
                  publicMajlisMode === 'munaqosyah'
                    ? 'bg-emerald-700 text-white shadow-sm border border-emerald-400/40'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Sidang Munaqosyah 3D (4 Bangku · Kelas 3 &amp; 6)</span>
              </button>
            </div>

            {publicMajlisMode === 'bahtsul_masail' ? (
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Simulasi Sidang 4 Madzhab 3D · Tradisi Pesantren × AI</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Forum Bahtsul Masail AI 3D ({' '}
                    <span className="font-arabic text-amber-300">بَحْثُ الْمَسَائِلِ</span> )
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                    Ajukan persoalan fiqih kontemporer atau putar simulasi sidang kitab kuning 4 madzhab (Syafi&apos;iyah, Hanafiyah, Malikiyah, Hanabilah) lengkap dengan rujukan halaman kitab asli &amp; unduh PDF rumusan.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAskModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#D9822B] hover:bg-[#C2711F] text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Ajukan As&apos;ilah Baru</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResultModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-2 transition"
                  >
                    <ScrollText className="w-3.5 h-3.5 text-amber-300" />
                    <span>Lihat Hasil Rumusan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFullscreen(true)}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-950 text-emerald-100 border border-emerald-700 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Layar Penuh</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-300/40 text-emerald-200 text-xs font-bold">
                    <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                    <span>Tampilan Publik · Munaqosyah Terbuka 4 Bangku Penyimak</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Sidang Munaqosyah Estafet 3D ({' '}
                    <span className="font-arabic text-amber-300">مَجْلِسُ الْمُنَاقَشَةِ</span> )
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                    Santri masuk tanpa membawa kitab, mengundi <strong>Amplop Makro&apos;</strong> di Bangku 1 (Moderator), lalu estafet ke Bangku 2 (Nahwu Shorof), Bangku 3 (Fiqih), dan Bangku 4 (Al-Qur&apos;an &amp; Tajwid).
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {(['Kelas 3', 'Kelas 6'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        setPubTingkat(lvl);
                        setPubMakroIdx(0);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition ${
                        pubTingkat === lvl
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                          : 'bg-emerald-950/60 text-emerald-100 border-emerald-700 hover:bg-emerald-900'
                      }`}
                    >
                      {lvl} ({lvl === 'Kelas 3' ? "Imrithi & Fathul Qorib" : "Alfiyah & Fathul Mu'in"})
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPubMakroIdx((i) => i + 1)}
                    className="px-4 py-2 rounded-xl bg-[#D9822B] hover:bg-[#C2711F] text-white text-xs font-extrabold shadow-md"
                  >
                    Undi Amplop Makro&apos; Berikutnya →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3D HALL VIEWPORT CONTAINER */}
        <div
          className={`relative overflow-hidden bg-[#EFE7D6] ${
            isFullscreen
              ? 'flex-1 w-full h-full'
              : 'h-[540px] sm:h-[620px] rounded-3xl border-2 border-amber-400/50 shadow-2xl'
          }`}
        >
          {/* Three.js Canvas + Projected Speech Callouts */}
          <MajlisHall3D
            mode={publicMajlisMode}
            cameraTarget={publicMajlisMode === 'bahtsul_masail' ? cameraTarget : pubMunaqosyahCamera}
            boardConfig={publicMajlisMode === 'bahtsul_masail' ? boardConfig : pubMunaqosyahBoard}
            benches={publicMajlisMode === 'bahtsul_masail' ? BAHTSUL_BENCHES : pubMunaqosyahBenches}
            activeBenchId={
              publicMajlisMode === 'bahtsul_masail'
                ? activeBenchId
                : pubActiveBench === 'overview'
                ? 'moderator'
                : pubActiveBench
            }
            callouts={publicMajlisMode === 'bahtsul_masail' ? callouts : pubMunaqosyahCallouts}
            audienceCount={publicMajlisMode === 'bahtsul_masail' ? 24 : 18}
            audienceFromZ={publicMajlisMode === 'bahtsul_masail' ? 2.8 : 3.5}
          />

          {/* Top Bar Overlay (Solid clean pills, NO backdrop-blur over WebGL) */}
          <div className="absolute top-3 left-3 right-14 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
            <div className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1E1C18] text-white border border-amber-400/40 shadow-md text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span>
                {publicMajlisMode === 'bahtsul_masail'
                  ? 'Forum Bahtsul Masail AI'
                  : `Sidang Munaqosyah 3D (${pubTingkat})`}
              </span>
              <span className="text-amber-300 font-normal hidden sm:inline">
                ·{' '}
                {publicMajlisMode === 'bahtsul_masail'
                  ? CAMERA_PRESETS[cameraKey]?.label || 'Ruang Sidang'
                  : pubActiveBench === 'overview'
                  ? '4 Bangku Penyimak'
                  : `Bangku ${MUNAQOSYAH_BENCHES.find((b) => b.id === pubActiveBench)?.nomorBangku || ''}`}
              </span>
            </div>

            {isFullscreen && (
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-900 border border-slate-300 shadow-md text-xs font-bold hover:bg-slate-100"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Keluar Layar Penuh</span>
              </button>
            )}
          </div>

          {/* Right Vertical Floating Utility Icons (Exact Video Match) */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setCameraKey('overview');
              }}
              title="Kamera Utama Ruang Sidang"
              className="w-9 h-9 rounded-full bg-[#FDFBF5] hover:bg-amber-50 text-emerald-950 border border-amber-300 shadow-md flex items-center justify-center transition"
            >
              <Home className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={cycleCameraPreset}
              title="Putar Sudut Kamera Bangku Madzhab"
              className="w-9 h-9 rounded-full bg-[#FDFBF5] hover:bg-amber-50 text-emerald-950 border border-amber-300 shadow-md flex items-center justify-center transition"
            >
              <Camera className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowHistoryModal(true)}
              title="Arsip Riwayat As'ilah"
              className="w-9 h-9 rounded-full bg-[#FDFBF5] hover:bg-amber-50 text-emerald-950 border border-amber-300 shadow-md flex items-center justify-center transition relative"
            >
              <History className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 px-1 min-w-[16px] h-4 rounded-full bg-emerald-800 text-white text-[9px] font-bold flex items-center justify-center">
                {historyList.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowGuideModal(true)}
              title="Metodologi Bahtsul Masail"
              className="w-9 h-9 rounded-full bg-[#FDFBF5] hover:bg-amber-50 text-emerald-950 border border-amber-300 shadow-md flex items-center justify-center transition"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            {!isFullscreen && (
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                title="Perbesar Layar Penuh"
                className="w-9 h-9 rounded-full bg-[#FDFBF5] hover:bg-amber-50 text-emerald-950 border border-amber-300 shadow-md flex items-center justify-center transition"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Bottom-Center Controls OR Active Deliberation Timeline */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-24px)] max-w-3xl flex flex-col items-center gap-2 pointer-events-none">
            {publicMajlisMode === 'munaqosyah' ? (
              <div className="pointer-events-auto rounded-2xl bg-[#FDFBF5] border border-amber-300 shadow-2xl p-2 flex flex-wrap items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPubActiveBench('overview')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold ${
                    pubActiveBench === 'overview'
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 text-slate-800 hover:bg-amber-100/70'
                  }`}
                >
                  Semua 4 Bangku
                </button>
                {MUNAQOSYAH_BENCHES.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setPubActiveBench(b.id)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition ${
                      pubActiveBench === b.id
                        ? 'text-white shadow-sm'
                        : 'bg-slate-100 text-slate-800 hover:bg-amber-100/70'
                    }`}
                    style={pubActiveBench === b.id ? { backgroundColor: b.warnaBadge } : undefined}
                  >
                    Bangku {b.nomorBangku}:{' '}
                    {b.id === 'moderator'
                      ? 'Moderator'
                      : b.id === 'nahwu_shorof'
                      ? 'Nahwu Shorof'
                      : b.id === 'fiqih'
                      ? 'Fiqih'
                      : "Al-Qur'an"}
                  </button>
                ))}
              </div>
            ) : phase === 'idle' ? (
              <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAskModal(true)}
                  className="px-5 py-2.5 rounded-full bg-[#D9822B] hover:bg-[#C2711F] text-white text-xs sm:text-sm font-extrabold shadow-xl border border-amber-300/60 flex items-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ajukan As&apos;ilah</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowResultModal(true)}
                  className="px-4 py-2.5 rounded-full bg-[#FDFBF5] hover:bg-amber-50 text-slate-900 text-xs font-extrabold shadow-xl border border-amber-300 flex items-center gap-1.5 transition"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Hasil Terakhir</span>
                </button>
              </div>
            ) : (
              <div className="pointer-events-auto w-full rounded-2xl bg-[#FDFBF5] border border-amber-300 shadow-2xl p-3.5 text-slate-900 space-y-2.5">
                <div className="flex items-center justify-between border-b border-amber-200/70 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 shrink-0" />
                    <span className="text-xs font-extrabold text-slate-900">
                      {phaseLabelMap[phase]}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-500 tabular-nums">
                    {formatDuration(elapsedSec)}
                  </span>
                </div>

                {/* Live 4 Madzhab & Mushahih Status Grid */}
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {[
                    {
                      label: "Syafi'iyah",
                      dot: 'bg-emerald-600',
                      state:
                        phase === 'madzhab_syafii'
                          ? 'mencari'
                          : ['madzhab_hanafi', 'madzhab_maliki', 'madzhab_hanbali', 'mushahih', 'notulen'].includes(phase)
                          ? 'selesai'
                          : 'menunggu',
                    },
                    {
                      label: 'Hanafiyah',
                      dot: 'bg-blue-600',
                      state:
                        phase === 'madzhab_hanafi'
                          ? 'mencari'
                          : ['madzhab_maliki', 'madzhab_hanbali', 'mushahih', 'notulen'].includes(phase)
                          ? 'selesai'
                          : 'menunggu',
                    },
                    {
                      label: 'Malikiyah',
                      dot: 'bg-amber-600',
                      state:
                        phase === 'madzhab_maliki'
                          ? 'mencari'
                          : ['madzhab_hanbali', 'mushahih', 'notulen'].includes(phase)
                          ? 'selesai'
                          : 'menunggu',
                    },
                    {
                      label: 'Hanabilah',
                      dot: 'bg-rose-600',
                      state:
                        phase === 'madzhab_hanbali'
                          ? 'mencari'
                          : ['mushahih', 'notulen'].includes(phase)
                          ? 'selesai'
                          : 'menunggu',
                    },
                    {
                      label: 'Mushahih',
                      dot: 'bg-amber-500',
                      state:
                        phase === 'mushahih'
                          ? 'mentarjih'
                          : phase === 'notulen'
                          ? 'selesai'
                          : 'menunggu',
                    },
                  ].map((st) => (
                    <div key={st.label} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${st.dot} shrink-0`} />
                      <span className="font-bold text-slate-800">{st.label}</span>
                      <span
                        className={
                          st.state === 'selesai'
                            ? 'text-emerald-700 font-bold'
                            : st.state === 'mencari' || st.state === 'mentarjih'
                            ? 'text-amber-700 font-bold'
                            : 'text-slate-400'
                        }
                      >
                        {st.state}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCancelSidang}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold border border-slate-200 transition"
                >
                  Batalkan sidang
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODAL: AJUKAN AS'ILAH ================= */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#1D2F24] text-white border border-emerald-700/70 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                Sidang Empat Madzhab 3D
              </span>
              <button
                type="button"
                onClick={() => setShowAskModal(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAiAsilah} className="px-6 pb-6 space-y-4">
              <div className="text-center space-y-1">
                <p className="font-arabic text-3xl text-amber-300 font-bold">بَحْثُ الْمَسَائِلِ</p>
                <h3 className="text-xl font-extrabold text-white">Ajukan As&apos;ilah</h3>
                <p className="text-xs text-emerald-200/90 max-w-sm mx-auto">
                  Sidang empat madzhab menelusuri kitab rujukan mu&apos;tabarah, lalu menyusun rumusan jawabannya dalam PDF.
                </p>
              </div>

              {apiError && (
                <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-500/70 text-rose-100 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Permintaan AI Tidak Dapat Diproses</p>
                    <p className="text-[11px] mt-0.5">{apiError}</p>
                  </div>
                </div>
              )}

              <div>
                <textarea
                  rows={3}
                  maxLength={700}
                  value={inputAsilah}
                  onChange={(e) => setInputAsilah(e.target.value)}
                  placeholder="Tulis permasalahan fiqih yang ingin dibahas (misal: Hukum jual beli sistem dropship)..."
                  className="w-full rounded-2xl bg-[#122018] border border-emerald-700/80 px-4 py-3 text-sm text-white placeholder-emerald-400/60 focus:outline-hidden focus:border-amber-400"
                />
                <div className="text-right text-[10px] text-emerald-300/70 mt-1 tabular-nums">
                  {inputAsilah.length}/700
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
                  CONTOH KAJIAN KITAB &amp; TOPIK POPULER
                </p>
                <div className="space-y-1.5">
                  {QUICK_PROMPTS.map((qp) => (
                    <div
                      key={qp.label}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#122018]/90 border border-emerald-800/80 hover:border-amber-400/50 transition"
                    >
                      <button
                        type="button"
                        onClick={() => setInputAsilah(qp.label)}
                        className="text-left text-xs text-emerald-100 hover:text-white flex-1"
                      >
                        {qp.label}
                      </button>
                      {qp.presetId && (
                        <button
                          type="button"
                          onClick={() => {
                            const found = PRESET_BAHTSUL_MASAIL.find((p) => p.id === qp.presetId);
                            if (found) handlePlayClassicalPreset(found);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-amber-200 text-[10px] font-bold shrink-0"
                        >
                          Putar Sidang →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!inputAsilah.trim()}
                className="w-full py-3 rounded-full bg-[#D9822B] hover:bg-[#C2711F] disabled:opacity-50 text-white text-sm font-extrabold shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>Bahas di Forum (AI) →</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: HASIL FORUM BAHTSUL MASAIL ================= */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 sm:p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-[#FBF8EE] text-slate-900 shadow-2xl border border-amber-300 flex flex-col max-h-[92vh] overflow-hidden">
            {/* Sticky Header */}
            <div className="bg-white border-b border-amber-200/80 px-5 py-3.5 flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="font-arabic text-base font-bold text-emerald-900">بَحْثُ الْمَسَائِلِ</p>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Hasil Forum Bahtsul Masail
                </h3>
                <p className="text-[11px] text-slate-500">{activeResult.tanggalSidang}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowResultModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Report Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs sm:text-sm">
              {/* As'ilah Card */}
              <div className="rounded-2xl bg-white border border-amber-200 p-4 space-y-1 shadow-2xs">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">AS&apos;ILAH</p>
                <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {activeResult.judulRingkas}
                </h4>
                <p className="text-xs text-slate-600">{activeResult.asilah}</p>
                <p className="font-arabic text-base text-emerald-900 pt-1 text-right" dir="rtl">
                  {activeResult.masalahArab}
                </p>
              </div>

              {/* Peringatan Bermadzhab */}
              <div className="rounded-2xl bg-amber-50 border border-amber-300 p-4 space-y-1">
                <p className="font-extrabold text-amber-950 text-xs">
                  Peringatan: Untuk Pengamalan Bermadzhab
                </p>
                <p className="text-xs text-amber-900 leading-relaxed">{activeResult.peringatan}</p>
              </div>

              {/* Asal Jawaban */}
              <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-2.5">
                <p className="font-extrabold text-slate-900 text-xs">Asal Jawaban (4 Madzhab)</p>
                <div className="divide-y divide-slate-100">
                  {activeResult.asalJawaban.map((item) => (
                    <div
                      key={item.madzhab}
                      className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <span className="font-bold text-slate-800 text-xs">{item.madzhab}</span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-semibold">
                        {item.ringkasanKitab}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Peta Pendapat Empat Madzhab */}
              <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-2.5">
                <p className="font-extrabold text-slate-900 text-xs">Peta Pendapat Empat Madzhab</p>
                <div className="divide-y divide-slate-100">
                  {activeResult.petaPendapat.map((p) => (
                    <div key={p.madzhab} className="py-2.5 grid grid-cols-1 sm:grid-cols-12 gap-2 items-start">
                      <div className="sm:col-span-3">
                        <span className="font-bold text-slate-900 text-xs">{p.madzhab}</span>
                        <span className="block text-[10px] font-bold text-emerald-700">{p.statusBadge}</span>
                      </div>
                      <p className="sm:col-span-9 text-xs text-slate-700 leading-relaxed">
                        {p.ringkasStance}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Per-Madzhab Cards */}
              {activeResult.pendapatPerMadzhab.map((m) => {
                const theme = getMadzhabTheme(m.kode);
                return (
                  <div
                    key={m.madzhab}
                    className={`rounded-2xl bg-white border ${theme.border} overflow-hidden shadow-2xs`}
                  >
                    <div className={`${theme.headerBg} text-white px-4 py-2.5 flex items-center justify-between`}>
                      <span className="font-extrabold text-xs sm:text-sm">
                        Pendapat Madzhab {m.madzhab}
                      </span>
                      <span className="font-arabic text-base">{m.arabLabel}</span>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Hukum Box */}
                      <div className="rounded-xl bg-amber-50 border border-amber-300 p-3.5 space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-800 text-white text-[9px] font-extrabold uppercase">
                          Hukum
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                          {m.ringkasanHukum}
                        </p>
                      </div>

                      {/* Penjelasan */}
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          Penjelasan
                        </p>
                        <p className="text-xs text-slate-700 leading-relaxed">{m.penjelasan}</p>
                      </div>

                      {/* Rincian */}
                      {m.rincian?.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            Rincian
                          </p>
                          <div className="space-y-1.5">
                            {m.rincian.map((r, rIdx) => (
                              <div key={rIdx} className="flex items-start gap-2 text-xs text-slate-700">
                                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                  {rIdx + 1}
                                </span>
                                <p className="leading-relaxed">{r}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pendapat Para Ulama & Arabic Kitab Quotes */}
                      {m.ulamaQuotes?.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            Pendapat Para Ulama Madzhab {m.madzhab}
                          </p>
                          {m.ulamaQuotes.map((uq, qIdx) => (
                            <div
                              key={qIdx}
                              className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-2"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-bold text-slate-900 text-xs">{uq.namaUlama}</span>
                                <span className="text-[10px] text-slate-500">{uq.kitabHalaman}</span>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed">{uq.terjemah}</p>
                              <div className="p-2.5 rounded-lg bg-[#FDF8E4] border border-amber-200 text-right">
                                <p className="font-arabic text-base text-slate-900 leading-loose" dir="rtl">
                                  {uq.teksArab}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Pendapat Mu'tamad */}
                      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-800 text-white text-[9px] font-extrabold uppercase">
                          Pendapat Mu&apos;tamad
                        </span>
                        <p className="text-xs font-semibold text-emerald-950 leading-relaxed">
                          {m.pendapatMutamad}
                        </p>
                      </div>

                      {/* Dalil & Kaidah */}
                      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1 text-xs">
                        <p>
                          <strong>Dalil &amp; Sabda Nabi:</strong> {m.dalilQuranHadits}
                        </p>
                        <p className="font-arabic text-sm text-emerald-900 text-right pt-1" dir="rtl">
                          {m.kaidahFiqhiyah}
                        </p>
                      </div>

                      {/* Kitab Reference Link Button -> Buka Halaman Kitab */}
                      <div className="rounded-xl bg-[#FDFBF5] border border-amber-200 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-bold text-xs text-slate-900">
                            {m.rujukanKitabDetail.judulKitab}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {m.rujukanKitabDetail.pengarang} · {m.rujukanKitabDetail.juzHalaman}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setKitabDrawerDetail({
                              madzhab: m.madzhab,
                              detail: m.rujukanKitabDetail,
                            })
                          }
                          className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold inline-flex items-center gap-1.5 shrink-0"
                        >
                          <span>Buka halaman kitab</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Langkah Pengambilan Hukum & Kaidah */}
              <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-3">
                <p className="font-extrabold text-xs text-slate-900 uppercase">
                  Langkah Pengambilan Hukum &amp; Kaidah Dipakai
                </p>
                <div className="space-y-2">
                  {activeResult.rumusanSidang.langkahPengambilanHukum.map((st, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900">{st.judul}</p>
                        <p className="text-slate-600">{st.deskripsi}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  {activeResult.rumusanSidang.kaidahDipakai.map((kd, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                      <p className="font-arabic text-base text-emerald-950 font-bold text-right" dir="rtl">
                        {kd.arab}
                      </p>
                      <p className="text-slate-700 mt-0.5">{kd.arti}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Bottom Bar */}
            <div className="bg-white border-t border-amber-200 px-5 py-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowResultModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold transition"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => downloadBahtsulMasailPdf(activeResult)}
                className="flex-1 py-2.5 rounded-xl bg-[#0F6B43] hover:bg-emerald-900 text-white text-xs font-extrabold flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Unduh PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= KITAB PAGE INSPECTOR MODAL ================= */}
      {kitabDrawerDetail && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#F7F4EA] text-slate-900 border border-amber-300 shadow-2xl overflow-hidden">
            <div className="bg-white border-b border-amber-200 px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-arabic text-lg font-bold text-emerald-900">
                  {kitabDrawerDetail.detail.judulArab}
                </p>
                <p className="text-xs font-bold text-slate-700">
                  {kitabDrawerDetail.detail.judulKitab} · {kitabDrawerDetail.detail.pengarang}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    {kitabDrawerDetail.detail.juzHalaman}
                  </span>
                  <span className="text-slate-500 font-semibold">{kitabDrawerDetail.detail.bab}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setKitabDrawerDetail(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Lafazh yang dikutip ditemukan &amp; disorot stabilo</span>
              </div>

              <div className="rounded-2xl bg-[#FFFDF7] border border-amber-200 p-4 space-y-3">
                <div className="p-2.5 rounded-xl bg-amber-100/90 border border-amber-300 text-right">
                  <p className="font-arabic text-lg font-bold text-slate-950 leading-loose" dir="rtl">
                    {kitabDrawerDetail.detail.highlightArab}
                  </p>
                </div>
                <p className="font-arabic text-base text-slate-800 leading-loose text-right" dir="rtl">
                  {kitabDrawerDetail.detail.teksArabLengkap}
                </p>
              </div>

              <div className="rounded-xl bg-white border border-slate-200 p-3.5 text-xs text-slate-700 leading-relaxed">
                <strong>Terjemah Ibarat:</strong> {kitabDrawerDetail.detail.terjemahan}
              </div>
            </div>

            <div className="bg-white border-t border-amber-200 px-5 py-3 flex justify-end">
              <button
                type="button"
                onClick={() => setKitabDrawerDetail(null)}
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
              >
                Kembali ke Hasil Sidang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= HISTORY ARCHIVE MODAL ================= */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white text-slate-900 p-5 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="font-extrabold text-sm">Arsip Sidang Bahtsul Masail</h4>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {historyList.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveResult(item);
                    setActiveTopicText(item.asilah);
                    setShowHistoryModal(false);
                    setShowResultModal(true);
                  }}
                  className="w-full text-left p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-slate-900">{item.judulRingkas}</span>
                    {item.isAiGenerated && (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-bold">
                        AI Gemini
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{item.asilah}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= GUIDE / METODOLOGI MODAL ================= */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white text-slate-900 p-5 space-y-3 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="font-extrabold text-sm">Panduan Sidang Bahtsul Masail 3D</h4>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Ruang sidang virtual 3D ini memvisualisasikan tradisi musyawarah keilmuan Pondok Pesantren dalam memutus hukum syariat secara kolektif (jama&apos;i):
            </p>
            <ul className="space-y-1.5 text-slate-700 list-disc pl-4">
              <li>
                <strong>Dewan Hakim Sidang:</strong> Moderator, Perumus, Mushahih, dan Notulen di podium depan.
              </li>
              <li>
                <strong>Empat Madzhab Mu&apos;tabarah:</strong> Syafi&apos;iyah, Hanafiyah, Malikiyah, dan Hanabilah dengan telaah kitab salaf masing-masing.
              </li>
              <li>
                <strong>Kontrol Kamera 3D:</strong> Seret (drag) layar 3D untuk menoleh ke seluruh ruangan, gunakan scroll mouse untuk zoom, atau tekan ikon kamera di kanan.
              </li>
            </ul>
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-800 text-white font-bold"
            >
              Tutup Panduan
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
