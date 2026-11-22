import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  Camera,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  EyeOff,
  FileText,
  Home,
  Mail,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Save,
  Shuffle,
  Trash2,
  UserCheck,
  Users,
  ScrollText,
  Sparkles,
} from 'lucide-react';
import {
  MajlisHall3D,
  type MajlisBenchStation,
  type MajlisBoardConfig,
  type MajlisCalloutData,
  type MajlisCameraTarget,
} from '../../components/common/MajlisHall3D.tsx';
import { RuangHadis3D } from '../../components/common/RuangHadis3D.tsx';
import { BahtsulMasailSubTab } from './BahtsulMasailSubTab.tsx';
import {
  MUNAQOSYAH_BENCHES,
  MUNAQOSYAH_MAKRO_ENVELOPES,
  MUNAQOSYAH_QUESTION_BANK,
  calcMunaqosyahSummary,
  type MunaqosyahBenchId,
  type MunaqosyahMakroEnvelope,
  type MunaqosyahRecord,
  type MunaqosyahTingkat,
} from '../../data/seed/munaqosyahData.ts';
import { useAppStore } from '../../lib/store.ts';
import { formatNamaWithGelar } from '../../data/seed/pondokData.ts';

type CameraViewKey = 'overview' | MunaqosyahBenchId | 'estafet_peserta';

interface EstafetParticipant {
  santriId: string;
  santriNama: string;
  santriNis: string;
  santriKelas: string;
  urutan: number;
  makro: MunaqosyahMakroEnvelope | null;
  nilaiMod: number;
  nilaiNahwu: number;
  nilaiFiqih: number;
  nilaiQuran: number;
  catatan: string;
}

const MUNAQOSYAH_CAMERA_PRESETS: Record<CameraViewKey, { label: string; cam: MajlisCameraTarget }> = {
  overview: {
    label: 'Ruang Sidang Estafet (4 Bangku)',
    cam: { pos: [0, 5.4, 8.9], target: [0, 1.65, -3.9] },
  },
  moderator: {
    label: "Bangku 1 · Moderator (Undian Amplop Makro')",
    cam: { pos: [-3.3, 2.75, 0.2], target: [-4.35, 1.3, -4.4] },
  },
  nahwu_shorof: {
    label: 'Bangku 2 · Penanya & Jawab Fan Nahwu Shorof',
    cam: { pos: [-1.45, 2.75, -0.35], target: [-1.52, 1.3, -4.9] },
  },
  fiqih: {
    label: 'Bangku 3 · Penanya & Jawab Fan Fiqih',
    cam: { pos: [1.45, 2.75, -0.35], target: [1.52, 1.3, -4.9] },
  },
  alquran: {
    label: "Bangku 4 · Penanya & Penguji Fan Al-Qur'an",
    cam: { pos: [3.3, 2.75, 0.2], target: [4.35, 1.3, -4.4] },
  },
  estafet_peserta: {
    label: 'Barisan Kursi Peserta (Tanpa Kitab)',
    cam: { pos: [0, 3.0, 2.6], target: [0, 1.2, -2.6] },
  },
};

export const MunaqosyahModule: React.FC = () => {
  const { santriList, ustadzList, currentTahunAjaran, munaqosyahRecords, addMunaqosyahRecord, deleteMunaqosyahRecord } =
    useAppStore();

  const [activeSubTab, setActiveSubTab] = useState<'ruang_3d' | 'bahtsul_masail' | 'ruang_hadis' | 'monitor_realtime' | 'rekap_nilai'>('ruang_3d');
  const [tingkat, setTingkat] = useState<MunaqosyahTingkat>('Kelas 3');
  const [cameraView, setCameraView] = useState<CameraViewKey>('overview');
  const [selectedBench, setSelectedBench] = useState<MunaqosyahBenchId>('moderator');
  const [isFullscreen3D, setIsFullscreen3D] = useState(false);
  const [isAutoTouring, setIsAutoTouring] = useState(false);

  // Live Bench Stopwatch Timestamps
  const [benchEnteredAt, setBenchEnteredAt] = useState<Record<MunaqosyahBenchId, number>>(() => {
    const now = Date.now();
    return { moderator: now, nahwu_shorof: now, fiqih: now, alquran: now };
  });
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const formatElapsed = (enteredMs: number) => {
    const secs = Math.max(0, Math.floor((nowMs - enteredMs) / 1000));
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  // Ordered candidate queue filtered by Class Level (Kelas 3 or Kelas 6)
  const eligibleSantri = useMemo(() => {
    const targetLevel = tingkat === 'Kelas 3' ? 3 : 6;
    const filtered = santriList.filter(
      (s) => s.tingkat === targetLevel || s.kelas.trim().startsWith(String(targetLevel))
    );
    return filtered.length > 0 ? filtered : santriList.slice(0, 10);
  }, [santriList, tingkat]);

  const makroList = useMemo(
    () => MUNAQOSYAH_MAKRO_ENVELOPES.filter((m) => m.tingkat === tingkat),
    [tingkat]
  );

  // Active 4-Bench Parallel Pipeline State
  const [benchSlots, setBenchSlots] = useState<Record<MunaqosyahBenchId, EstafetParticipant | null>>({
    moderator: null,
    nahwu_shorof: null,
    fiqih: null,
    alquran: null,
  });
  const [nextQueueIdx, setNextQueueIdx] = useState<number>(1);
  const [completedSantriIds, setCompletedSantriIds] = useState<string[]>([]);
  const [isShufflingEnvelope, setIsShufflingEnvelope] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [questionIdxFallback, setQuestionIdxFallback] = useState(0);

  // Examiner names for Bench 1..4
  const [pengujiNames, setPengujiNames] = useState<Record<MunaqosyahBenchId, string>>({
    moderator: MUNAQOSYAH_BENCHES[0].pengujiDefault,
    nahwu_shorof: MUNAQOSYAH_BENCHES[1].pengujiDefault,
    fiqih: MUNAQOSYAH_BENCHES[2].pengujiDefault,
    alquran: MUNAQOSYAH_BENCHES[3].pengujiDefault,
  });

  const [toast, setToast] = useState('');
  const [rekapFilter, setRekapFilter] = useState<'Semua' | MunaqosyahTingkat>('Semua');
  const tourTimersRef = useRef<number[]>([]);

  const clearTourTimers = () => {
    tourTimersRef.current.forEach((id) => window.clearTimeout(id));
    tourTimersRef.current = [];
  };

  useEffect(() => {
    return () => clearTourTimers();
  }, []);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 4200);
  };

  // Seed Bangku 1 with Urutan #1 + pre-seed example Makro' 1 when switching Class Level
  useEffect(() => {
    const first = eligibleSantri[0];
    if (!first) {
      setBenchSlots({ moderator: null, nahwu_shorof: null, fiqih: null, alquran: null });
      setNextQueueIdx(0);
      return;
    }
    const defaultMakro = makroList[0] || null;
    setBenchSlots({
      moderator: {
        santriId: first.id,
        santriNama: first.nama,
        santriNis: first.nis,
        santriKelas: first.kelas,
        urutan: 1,
        makro: defaultMakro,
        nilaiMod: 90,
        nilaiNahwu: 88,
        nilaiFiqih: 89,
        nilaiQuran: 90,
        catatan: 'Masuk ruangan tanpa kitab. Mendapatkan undian Makro\' panitia & menjawab dengan lancar.',
      },
      nahwu_shorof: null,
      fiqih: null,
      alquran: null,
    });
    setNextQueueIdx(1);
    setCompletedSantriIds([]);
    setSelectedBench('moderator');
    setCameraView('overview');
    const resetNow = Date.now();
    setBenchEnteredAt({ moderator: resetNow, nahwu_shorof: resetNow, fiqih: resetNow, alquran: resetNow });
  }, [tingkat, eligibleSantri, makroList]);

  const activeParticipant = benchSlots[selectedBench];

  const makeParticipantFromQueue = (idx: number): EstafetParticipant | null => {
    const s = eligibleSantri[idx];
    if (!s) return null;
    return {
      santriId: s.id,
      santriNama: s.nama,
      santriNis: s.nis,
      santriKelas: s.kelas,
      urutan: idx + 1,
      makro: null,
      nilaiMod: 88,
      nilaiNahwu: 86,
      nilaiFiqih: 87,
      nilaiQuran: 89,
      catatan: 'Masuk tanpa membawa kitab · Mengikuti estafet 4 Bangku Munaqosyah.',
    };
  };

  // Moderator draws an Amplop Makro' for Santri sitting at Bangku 1
  const handleDrawMakroAtModerator = (specificMakro?: MunaqosyahMakroEnvelope) => {
    const currentAtMod = benchSlots.moderator;
    if (!currentAtMod) {
      notify('Bangku 1 (Moderator) kosong. Panggil peserta berikutnya dari daftar urutan.');
      return;
    }
    setIsShufflingEnvelope(true);
    window.setTimeout(() => {
      const chosen =
        specificMakro || makroList[Math.floor(Math.random() * makroList.length)] || makroList[0];
      setBenchSlots((prev) => {
        if (!prev.moderator) return prev;
        return {
          ...prev,
          moderator: {
            ...prev.moderator,
            makro: chosen,
          },
        };
      });
      setIsShufflingEnvelope(false);
      notify(
        `Moderator membacakan: ${currentAtMod.santriNama} mendapatkan ${chosen.kodeAmplop} — ${chosen.lokasiKitab}!`
      );
    }, 320);
  };

  // Save a participant record cleanly into persistent store
  const commitParticipantRecord = (p: EstafetParticipant) => {
    const todayIso = new Date().toISOString().split('T')[0];
    const sum = calcMunaqosyahSummary(p.nilaiMod, p.nilaiNahwu, p.nilaiFiqih, p.nilaiQuran);
    addMunaqosyahRecord({
      tanggal: todayIso,
      tahunAjaran: currentTahunAjaran,
      tingkat,
      santriId: p.santriId,
      santriNama: p.santriNama,
      santriNis: p.santriNis,
      santriKelas: p.santriKelas,
      makroKode: p.makro?.kodeAmplop,
      makroLokasi: p.makro?.lokasiKitab,
      pengujiModerator: pengujiNames.moderator,
      pengujiNahwu: pengujiNames.nahwu_shorof,
      pengujiFiqih: pengujiNames.fiqih,
      pengujiAlquran: pengujiNames.alquran,
      nilaiModerator: p.nilaiMod,
      nilaiNahwu: p.nilaiNahwu,
      nilaiFiqih: p.nilaiFiqih,
      nilaiAlquran: p.nilaiQuran,
      rataRata: sum.rataRata,
      predikat: sum.predikat,
      statusLulus: sum.statusLulus,
      catatanDewan: p.makro
        ? `[${p.makro.kodeAmplop}: ${p.makro.lokasiKitab}] ${p.catatan}`
        : p.catatan,
    });
  };

  // Advance parallel 4-bench pipeline:
  // Bangku 4 -> Selesai (save), Bangku 3 -> 4, Bangku 2 -> 3, Bangku 1 -> 2, and Moderator calls next queued Santri into Bangku 1!
  const handleAdvanceEstafet = () => {
    if (benchSlots.moderator && !benchSlots.moderator.makro) {
      notify("Silakan undi & bacakan Amplop Makro' terlebih dahulu untuk peserta di Bangku 1 sebelum maju ke Bangku 2.");
      return;
    }

    const finishing = benchSlots.alquran;
    if (finishing) {
      commitParticipantRecord(finishing);
      setCompletedSantriIds((prev) =>
        prev.includes(finishing.santriId) ? prev : [...prev, finishing.santriId]
      );
    }

    const nextCandidate = nextQueueIdx < eligibleSantri.length ? makeParticipantFromQueue(nextQueueIdx) : null;
    if (nextCandidate) {
      setNextQueueIdx((idx) => idx + 1);
    }

    setBenchSlots((prev) => ({
      alquran: prev.fiqih,
      fiqih: prev.nahwu_shorof,
      nahwu_shorof: prev.moderator,
      moderator: nextCandidate,
    }));
    const advNow = Date.now();
    setBenchEnteredAt({ moderator: advNow, nahwu_shorof: advNow, fiqih: advNow, alquran: advNow });

    const parts: string[] = [];
    if (finishing) parts.push(`${finishing.santriNama} selesai & nilainya tersimpan otomatis ke rekapitulasi`);
    if (benchSlots.moderator) parts.push(`${benchSlots.moderator.santriNama} bergeser ke Nahwu Shorof`);
    if (nextCandidate) parts.push(`Moderator memanggil Urutan #${nextCandidate.urutan} (${nextCandidate.santriNama})`);
    notify(parts.join(' · ') || 'Estafet sidang diperbarui.');
  };

  // Call specific participant from queue into Bangku 1 manually
  const handleCallSpecificToModerator = (idx: number) => {
    if (benchSlots.moderator) {
      notify('Bangku 1 masih terisi. Tekan "Majukan Estafet" agar peserta Bangku 1 bergeser ke Bangku 2 terlebih dahulu.');
      return;
    }
    const p = makeParticipantFromQueue(idx);
    if (!p) return;
    setBenchSlots((prev) => ({ ...prev, moderator: p }));
    setBenchEnteredAt((prev) => ({ ...prev, moderator: Date.now() }));
    setNextQueueIdx(Math.max(nextQueueIdx, idx + 1));
    setSelectedBench('moderator');
    setCameraView('moderator');
    notify(`Moderator memanggil Urutan #${p.urutan}: ${p.santriNama} masuk ruangan tanpa kitab.`);
  };

  const handleUpdateActiveSlotField = <K extends keyof EstafetParticipant>(
    benchId: MunaqosyahBenchId,
    field: K,
    value: EstafetParticipant[K]
  ) => {
    setBenchSlots((prev) => {
      const slot = prev[benchId];
      if (!slot) return prev;
      return {
        ...prev,
        [benchId]: {
          ...slot,
          [field]: value,
        },
      };
    });
  };

  const curriculumLabel =
    tingkat === 'Kelas 3'
      ? "Nahwu: Nadhom Al-'Imrithi · Fiqih: Fathul Qorib · Al-Qur'an"
      : "Nahwu: Alfiyah Ibnu Malik · Fiqih: Fathul Mu'in · Al-Qur'an";

  // 3D Scene Benches: 4 Examiner Dais Desks + Occupied Santri Chairs facing each examiner (NO personal kitab!)
  const benches3D = useMemo<MajlisBenchStation[]>(() => {
    const stations: MajlisBenchStation[] = [
      {
        id: 'moderator',
        label: '1. MODERATOR (UNDIAN)',
        badgeColor: '#0F6B43',
        position: [-4.35, 0.24, -4.8],
        rotationY: 0.24,
        avatarCount: 1,
        kitabColor: '#064E3B',
        hasEnvelopeStack: true,
      },
      {
        id: 'nahwu_shorof',
        label: tingkat === 'Kelas 3' ? '2. NAHWU (IMRITHI)' : '2. NAHWU (ALFIYAH)',
        badgeColor: '#0E7490',
        position: [-1.52, 0.24, -5.35],
        rotationY: 0.08,
        avatarCount: 1,
        kitabColor: '#0E7490',
      },
      {
        id: 'fiqih',
        label: tingkat === 'Kelas 3' ? '3. FIQIH (F. QORIB)' : "3. FIQIH (F. MU'IN)",
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
    ];

    const seatCoords: Record<MunaqosyahBenchId, { pos: [number, number, number]; rotY: number }> = {
      moderator: { pos: [-3.95, 0, -2.25], rotY: Math.PI + 0.22 },
      nahwu_shorof: { pos: [-1.38, 0, -2.55], rotY: Math.PI + 0.06 },
      fiqih: { pos: [1.38, 0, -2.55], rotY: Math.PI - 0.06 },
      alquran: { pos: [3.95, 0, -2.25], rotY: Math.PI - 0.22 },
    };

    (Object.keys(seatCoords) as MunaqosyahBenchId[]).forEach((bId) => {
      const occupant = benchSlots[bId];
      if (occupant) {
        const shortName = occupant.santriNama.split(' ').slice(0, 2).join(' ');
        const makroTag = occupant.makro ? ` · MAKRO ${occupant.makro.nomorMakro}` : ' · UNDI';
        stations.push({
          id: `santri_${bId}`,
          label: `${shortName}${makroTag}`,
          badgeColor: '#047857',
          position: seatCoords[bId].pos,
          rotationY: seatCoords[bId].rotY,
          avatarCount: 1,
          isSantriPeserta: true,
          noPersonalKitab: true, // Santri enters without bringing personal kitab!
        });
      }
    });

    return stations;
  }, [tingkat, benchSlots]);

  const boardConfig = useMemo<MajlisBoardConfig>(() => {
    const slot = benchSlots[selectedBench];
    const modSlot = benchSlots.moderator;
    const focusMakro = slot?.makro || modSlot?.makro;
    return {
      arabicHeading: 'مَجْلِسُ الْمُنَاقَشَةِ',
      title: `MUNAQOSYAH ESTAFET ${tingkat.toUpperCase()} · TANPA BAWA KITAB`,
      subtitleLabel: slot
        ? `PENGUMUMAN BANGKU ${MUNAQOSYAH_BENCHES.find((b) => b.id === selectedBench)?.nomorBangku}: ${slot.santriNama}`
        : `KURIKULUM ${tingkat.toUpperCase()}`,
      subtitleText: focusMakro
        ? `${focusMakro.kodeAmplop}: ${focusMakro.lokasiKitab}`
        : slot
        ? `Peserta Urutan #${slot.urutan} (${slot.santriKelas}) sedang menunggu undian amplop Makro'`
        : curriculumLabel,
      bodyLabel: focusMakro ? 'IBARAT MAKRO\' YANG DIUJI' : 'ALUR ESTAFET 4 BANGKU',
      bodyText: focusMakro
        ? focusMakro.terjemahMakro
        : '1. Moderator Undi Amplop Makro -> 2. Nahwu Shorof (Makro\') -> 3. Fiqih (Makro\') -> 4. Al-Qur\'an & Tajwid',
    };
  }, [benchSlots, selectedBench, tingkat, curriculumLabel]);

  const callouts = useMemo<MajlisCalloutData[]>(() => {
    return MUNAQOSYAH_BENCHES.map((b) => {
      const occ = benchSlots[b.id];
      return {
        benchId: b.id,
        headerBadge: `Bangku ${b.nomorBangku} · ${
          b.id === 'nahwu_shorof'
            ? 'Nahwu Shorof'
            : b.id === 'fiqih'
            ? 'Fiqih'
            : b.id === 'alquran'
            ? "Al-Qur'an"
            : 'Moderator'
        }`,
        arabLine: occ?.makro ? occ.makro.teksArabMakro.slice(0, 48) + '...' : b.arabLabel,
        primaryText: occ
          ? `Peserta #${occ.urutan}: ${occ.santriNama.split(' ').slice(0, 2).join(' ')}`
          : tingkat === 'Kelas 3'
          ? b.kitabKelas3
          : b.kitabKelas6,
        secondaryText: occ?.makro
          ? `${occ.makro.kodeAmplop} · ${occ.makro.lokasiKitab}`
          : pengujiNames[b.id],
        accentHex: b.warnaBadge,
      };
    });
  }, [benchSlots, tingkat, pengujiNames]);

  const handleStartAutoTour = () => {
    clearTourTimers();
    setIsAutoTouring(true);
    setCameraView('moderator');
    setSelectedBench('moderator');

    const steps: Array<{ view: CameraViewKey; bench?: MunaqosyahBenchId; delay: number }> = [
      { view: 'nahwu_shorof', bench: 'nahwu_shorof', delay: 2600 },
      { view: 'fiqih', bench: 'fiqih', delay: 5200 },
      { view: 'alquran', bench: 'alquran', delay: 7800 },
      { view: 'estafet_peserta', delay: 10400 },
      { view: 'overview', delay: 13000 },
    ];

    steps.forEach((st) => {
      const id = window.setTimeout(() => {
        setCameraView(st.view);
        if (st.bench) setSelectedBench(st.bench);
        if (st.view === 'overview') setIsAutoTouring(false);
      }, st.delay);
      tourTimersRef.current.push(id);
    });
  };

  // Fallback standard question bank if slot doesn't yet have a drawn Makro'
  const fallbackQuestions = useMemo(
    () => MUNAQOSYAH_QUESTION_BANK.filter((q) => q.tingkat === tingkat && q.benchId === selectedBench),
    [tingkat, selectedBench]
  );
  const fallbackQuestion =
    fallbackQuestions[questionIdxFallback % Math.max(fallbackQuestions.length, 1)] || null;

  const activeSummary = activeParticipant
    ? calcMunaqosyahSummary(
        activeParticipant.nilaiMod,
        activeParticipant.nilaiNahwu,
        activeParticipant.nilaiFiqih,
        activeParticipant.nilaiQuran
      )
    : null;

  const handleDownloadPdfRecord = async (record: Omit<MunaqosyahRecord, 'id'> & { id?: string }) => {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const isKelas3 = record.tingkat === 'Kelas 3';

    doc.setFillColor(7, 67, 42);
    doc.rect(14, 10, 182, 24, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PONDOK PESANTREN NU DARUSSALAM KARANGDADAP', 18, 17.5);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Berita Acara & Nilai Ujian Munaqosyah ${record.tingkat} · Tahun Ajaran ${record.tahunAjaran}`,
      18,
      23.5
    );
    doc.text(
      `Tanggal Sidang: ${record.tanggal}${record.makroKode ? ` · Undian: ${record.makroKode}` : ''}`,
      18,
      29
    );

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('IDENTITAS PESERTA & UNDIAN MAKRO\' PANITIA', 14, 42);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Nama Santri   : ${record.santriNama}`, 14, 48);
    doc.text(`NIS / Kelas   : ${record.santriNis} · ${record.santriKelas}`, 14, 53.5);
    doc.text(
      `Amplop Makro' : ${record.makroKode || 'Undian Acak'} — ${record.makroLokasi || (isKelas3 ? 'Fathul Qorib' : "Fathul Mu'in")}`,
      14,
      59
    );

    autoTable(doc, {
      startY: 65,
      head: [['Bangku', 'Bidang / Fan Pengujian', 'Materi Kitab Wajib', 'Dewan Penyimak', 'Nilai']],
      body: [
        [
          'Bangku 1',
          "Moderator (Undian Makro' & Adab)",
          record.makroKode || 'Amplop Makro\' Panitia',
          record.pengujiModerator,
          String(record.nilaiModerator),
        ],
        [
          'Bangku 2',
          'Fan Nahwu & Shorof (Pada Makro\')',
          isKelas3 ? "Nadhom Al-'Imrithi" : 'Alfiyah Ibnu Malik',
          record.pengujiNahwu,
          String(record.nilaiNahwu),
        ],
        [
          'Bangku 3',
          'Fan Fiqih Syafi\'i (Pada Makro\')',
          isKelas3 ? 'Fathul Qorib (Matan Taqrib)' : "Fathul Mu'in",
          record.pengujiFiqih,
          String(record.nilaiFiqih),
        ],
        [
          'Bangku 4',
          "Fan Al-Qur'an & Tajwid",
          isKelas3 ? 'Bacaan Al-Qur\'an & Ilmu Tajwid' : 'Tahqiq, Gharib & Surat Pilihan',
          record.pengujiAlquran,
          String(record.nilaiAlquran),
        ],
      ],
      styles: { fontSize: 8.5, cellPadding: 3 },
      headStyles: { fillColor: [7, 67, 42], textColor: 255, fontStyle: 'bold' },
      columnStyles: { 4: { halign: 'center', fontStyle: 'bold' } },
      margin: { left: 14, right: 14 },
    });

    const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 125;
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(16, 185, 129);
    doc.roundedRect(14, finalY + 6, 182, 24, 2, 2, 'FD');
    doc.setTextColor(6, 78, 59);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `HASIL YUDISIUM: RATA-RATA ${record.rataRata}  |  PREDIKAT: ${record.predikat.toUpperCase()}  |  STATUS: ${record.statusLulus.toUpperCase()}`,
      18,
      finalY + 14.5
    );
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const wrappedNote = doc.splitTextToSize(`Catatan Dewan Penyimak: ${record.catatanDewan}`, 174);
    doc.text(wrappedNote, 18, finalY + 21);

    doc.save(`Munaqosyah-${record.tingkat.replace(/\s+/g, '')}-${record.santriNis}.pdf`);
  };

  const filteredRecords = useMemo(() => {
    return munaqosyahRecords.filter((r) => rekapFilter === 'Semua' || r.tingkat === rekapFilter);
  }, [munaqosyahRecords, rekapFilter]);

  const handleDownloadFinalReportPdf = async () => {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const rows = filteredRecords;
    const avgScore =
      rows.length > 0
        ? (rows.reduce((sum, r) => sum + r.rataRata, 0) / rows.length).toFixed(1)
        : '0.0';
    const lulusCount = rows.filter((r) => r.statusLulus === 'Lulus').length;
    const topScore = rows.length > 0 ? Math.max(...rows.map((r) => r.rataRata)) : 0;

    // Header kop resmi
    doc.setFillColor(7, 67, 42);
    doc.rect(12, 10, 273, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('PONDOK PESANTREN NU DARUSSALAM KARANGDADAP — PEKALONGAN', 16, 17.5);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `LAPORAN HASIL AKHIR REKAPITULASI MUNAQOSYAH (${rekapFilter.toUpperCase()}) · TAHUN AJARAN ${currentTahunAjaran}`,
      16,
      23.5
    );
    doc.text(
      `Sistem Estafet 4 Bangku (Moderator, Nahwu Shorof, Fiqih, Al-Qur'an) · Dicetak: ${new Date().toLocaleDateString('id-ID')}`,
      16,
      28.5
    );

    // Summary Strip
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(12, 35, 273, 12, 2, 2, 'FD');
    doc.setTextColor(6, 78, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(
      `Total Santri Selesai: ${rows.length}   |   Lulus Yudisium: ${lulusCount} (${rows.length ? Math.round((lulusCount / rows.length) * 100) : 0}%)   |   Rata-Rata Gabungan: ${avgScore}   |   Nilai Tertinggi: ${topScore}`,
      16,
      42.5
    );

    autoTable(doc, {
      startY: 51,
      head: [
        [
          'No',
          'NIS',
          'Nama Santri',
          'Kelas',
          'Jenjang',
          "Amplop Makro'",
          '1. Mod',
          '2. Nahwu',
          '3. Fiqih',
          "4. Qur'an",
          'Rata2',
          'Predikat',
          'Status',
        ],
      ],
      body: rows.map((r, i) => [
        String(i + 1),
        r.santriNis,
        r.santriNama,
        r.santriKelas,
        r.tingkat,
        r.makroKode || '-',
        String(r.nilaiModerator),
        String(r.nilaiNahwu),
        String(r.nilaiFiqih),
        String(r.nilaiAlquran),
        String(r.rataRata),
        r.predikat,
        r.statusLulus,
      ]),
      styles: { fontSize: 8, cellPadding: 2.2 },
      headStyles: { fillColor: [7, 67, 42], textColor: 255, fontStyle: 'bold', halign: 'center' },
      columnStyles: {
        0: { halign: 'center', cellWidth: 9 },
        1: { cellWidth: 20 },
        3: { cellWidth: 22 },
        4: { halign: 'center', cellWidth: 16 },
        5: { halign: 'center', cellWidth: 22 },
        6: { halign: 'center', cellWidth: 14 },
        7: { halign: 'center', cellWidth: 15 },
        8: { halign: 'center', cellWidth: 14 },
        9: { halign: 'center', cellWidth: 15 },
        10: { halign: 'center', fontStyle: 'bold', cellWidth: 14 },
        11: { halign: 'center', cellWidth: 24 },
        12: { halign: 'center', fontStyle: 'bold', cellWidth: 22 },
      },
      margin: { left: 12, right: 12 },
    });

    const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 140;
    const signY = Math.min(180, finalY + 12);
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Mengetahui,', 32, signY);
    doc.text('Pengasuh Pondok Pesantren NU Darussalam', 32, signY + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.text('KH. Amin Maizun', 32, signY + 18);

    doc.setFont('helvetica', 'normal');
    doc.text(`Karangdadap, ${new Date().toLocaleDateString('id-ID')}`, 205, signY);
    doc.text('Ketua Panitia Munaqosyah', 205, signY + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Ust. Nidhomul Muna Lana', 205, signY + 18);

    doc.save(`Laporan-Hasil-Akhir-Munaqosyah-${rekapFilter.replace(/\s+/g, '')}.pdf`);
    notify(`Laporan Hasil Akhir PDF (${rows.length} santri) berhasil diunduh.`);
  };

  const occupiedBenchesCount = (Object.values(benchSlots) as Array<EstafetParticipant | null>).filter(Boolean).length;

  const waitingCandidates = useMemo(() => {
    const activeIds = new Set(
      (Object.values(benchSlots) as Array<EstafetParticipant | null>)
        .filter((s): s is EstafetParticipant => Boolean(s))
        .map((s) => s.santriId)
    );
    const doneSet = new Set(completedSantriIds);
    return eligibleSantri.filter((s) => !activeIds.has(s.id) && !doneSet.has(s.id));
  }, [eligibleSantri, benchSlots, completedSantriIds]);

  return (
    <div className="space-y-6">
      {toast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header & Sub-Navigation */}
      <div className="rounded-3xl bg-white border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>Sistem Estafet 4 Bangku · Undian Amplop Makro&apos; Tanpa Bawa Kitab</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
            Modul Majlis Ilmiah, Perumusan Hadits &amp; Munaqosyah 3D
          </h2>
          <p className="text-xs text-slate-500">
            Munaqosyah Estafet 4 Bangku Kelas 3 &amp; 6, Forum Bahtsul Masail AI 3D (4 Madzhab), dan Halaqah Perumusan Hadits 51 Kitab Mu&apos;tabarah.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('ruang_3d')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeSubTab === 'ruang_3d'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Sidang Munaqosyah 3D ({occupiedBenchesCount}/4)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('bahtsul_masail')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeSubTab === 'bahtsul_masail'
                ? 'bg-[#D9822B] text-white shadow-xs'
                : 'bg-amber-50 text-amber-950 border border-amber-300 hover:bg-amber-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bahtsul Masail 3D (4 Madzhab)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('ruang_hadis')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeSubTab === 'ruang_hadis'
                ? 'bg-red-900 text-amber-200 shadow-xs'
                : 'bg-amber-50 text-amber-950 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span>Perumusan Hadits 3D (51 Kitab)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('monitor_realtime')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeSubTab === 'monitor_realtime'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Monitor Antrean Real-Time</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('rekap_nilai')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              activeSubTab === 'rekap_nilai'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Rekap Nilai &amp; PDF ({munaqosyahRecords.length})</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'bahtsul_masail' && <BahtsulMasailSubTab />}

      {activeSubTab === 'ruang_hadis' && <RuangHadis3D />}

      {activeSubTab === 'ruang_3d' && (
        <div className="space-y-6">
          {/* Top Class Switcher & Estafet Conveyor Control */}
          <div className="rounded-3xl bg-white border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-5 space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase">
                  1. Pilih Jenjang &amp; Kitab Makro&apos;
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Kelas 3', 'Kelas 6'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setTingkat(lvl)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        tingkat === lvl
                          ? 'bg-emerald-800 border-emerald-900 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-emerald-50'
                      }`}
                    >
                      <p className="text-xs font-extrabold">{lvl}</p>
                      <p className={`text-[10px] mt-0.5 ${tingkat === lvl ? 'text-emerald-200' : 'text-slate-500'}`}>
                        {lvl === 'Kelas 3' ? "Imrithi & Fathul Qorib" : "Alfiyah & Fathul Mu'in"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleAdvanceEstafet}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold flex items-center gap-2 shadow-sm transition"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Majukan Estafet (1→2→3→4) &amp; Panggil Peserta Berikutnya</span>
                </button>
                <button
                  type="button"
                  onClick={
                    isAutoTouring
                      ? () => {
                          clearTourTimers();
                          setIsAutoTouring(false);
                          setCameraView('overview');
                        }
                      : handleStartAutoTour
                  }
                  className={`py-2.5 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition ${
                    isAutoTouring
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-[#D9822B] hover:bg-[#C2711F] text-white'
                  }`}
                >
                  {isAutoTouring ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isAutoTouring ? 'Stop Tur' : 'Tur 4 Bangku'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullscreen3D(true)}
                  className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Layar Penuh</span>
                </button>
              </div>
            </div>

            {/* Parallel 4-Bench Pipeline Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
              {MUNAQOSYAH_BENCHES.map((b) => {
                const occ = benchSlots[b.id];
                const isSelected = selectedBench === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      setSelectedBench(b.id);
                      setCameraView(b.id);
                    }}
                    className={`cursor-pointer rounded-2xl p-3 border transition space-y-1.5 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-extrabold text-white"
                        style={{ backgroundColor: b.warnaBadge }}
                      >
                        Bangku {b.nomorBangku} ·{' '}
                        {b.id === 'nahwu_shorof'
                          ? 'Nahwu Shorof'
                          : b.id === 'fiqih'
                          ? 'Fiqih'
                          : b.id === 'alquran'
                          ? "Al-Qur'an"
                          : 'Moderator'}
                      </span>
                      {occ && (
                        <span className="text-[10px] font-bold text-slate-500">Urutan #{occ.urutan}</span>
                      )}
                    </div>

                    {occ ? (
                      <>
                        <p className="text-xs font-extrabold text-slate-900 truncate">{occ.santriNama}</p>
                        <p className="text-[10px] font-semibold text-emerald-800 truncate">
                          {occ.makro
                            ? `${occ.makro.kodeAmplop} · ${occ.makro.lokasiKitab}`
                            : b.id === 'moderator'
                            ? "Belum undi amplop Makro' →"
                            : "Tanpa bawa kitab"}
                        </p>
                      </>
                    ) : (
                      <div className="py-1.5 text-[11px] text-slate-400 italic">
                        Kosong (menunggu estafet)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3D HALL VIEWPORT */}
          <div
            className={
              isFullscreen3D
                ? 'fixed inset-0 z-50 bg-[#EFE7D6] flex flex-col'
                : 'relative h-[480px] sm:h-[560px] rounded-3xl overflow-hidden border-2 border-emerald-900/20 shadow-xl bg-[#EFE7D6]'
            }
          >
            <MajlisHall3D
              mode="munaqosyah"
              cameraTarget={MUNAQOSYAH_CAMERA_PRESETS[cameraView].cam}
              boardConfig={boardConfig}
              benches={benches3D}
              activeBenchId={cameraView === 'overview' ? selectedBench : cameraView}
              callouts={callouts}
              audienceCount={18}
              audienceFromZ={3.6}
            />

            {/* Top Left Status Bar */}
            <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-[#1E1C18] text-white border border-amber-400/40 shadow-md text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Munaqosyah Estafet {tingkat}</span>
                <span className="text-amber-300 font-normal hidden sm:inline">
                  · {MUNAQOSYAH_CAMERA_PRESETS[cameraView].label}
                </span>
              </div>
              {isFullscreen3D && (
                <button
                  type="button"
                  onClick={() => setIsFullscreen3D(false)}
                  className="px-3 py-1.5 rounded-xl bg-white text-slate-900 border border-slate-300 shadow-md text-xs font-bold flex items-center gap-1.5"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Keluar Layar Penuh</span>
                </button>
              )}
            </div>

            {/* Top Right Camera Quick Actions */}
            <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setCameraView('overview')}
                title="Kamera Overview Majlis"
                className="w-9 h-9 rounded-full bg-[#FDFBF5] hover:bg-amber-50 text-emerald-950 border border-amber-300 shadow-md flex items-center justify-center"
              >
                <Home className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const order: CameraViewKey[] = [
                    'overview',
                    'moderator',
                    'nahwu_shorof',
                    'fiqih',
                    'alquran',
                    'estafet_peserta',
                  ];
                  const next = order[(order.indexOf(cameraView) + 1) % order.length];
                  setCameraView(next);
                  if (next !== 'overview' && next !== 'estafet_peserta') setSelectedBench(next);
                }}
                title="Pindah Sudut Bangku Penyimak"
                className="w-9 h-9 rounded-full bg-[#FDFBF5] hover:bg-amber-50 text-emerald-950 border border-amber-300 shadow-md flex items-center justify-center"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom 4-Bench Quick Dock */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-24px)] max-w-4xl">
              <div className="rounded-2xl bg-[#FDFBF5] border border-amber-300 shadow-2xl p-2 flex flex-wrap items-center justify-center gap-1.5">
                {MUNAQOSYAH_BENCHES.map((b) => {
                  const active = cameraView === b.id;
                  const occ = benchSlots[b.id];
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        clearTourTimers();
                        setIsAutoTouring(false);
                        setCameraView(b.id);
                        setSelectedBench(b.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition flex items-center gap-1.5 ${
                        active ? 'text-white shadow-sm' : 'bg-slate-100 text-slate-800 hover:bg-amber-100/70'
                      }`}
                      style={active ? { backgroundColor: b.warnaBadge } : undefined}
                    >
                      <span>Bangku {b.nomorBangku}:</span>
                      <span>
                        {b.id === 'moderator'
                          ? 'Moderator'
                          : b.id === 'nahwu_shorof'
                          ? tingkat === 'Kelas 3'
                            ? "Nahwu ('Imrithi)"
                            : 'Nahwu (Alfiyah)'
                          : b.id === 'fiqih'
                          ? tingkat === 'Kelas 3'
                            ? 'Fiqih (Fathul Qorib)'
                            : "Fiqih (Fathul Mu'in)"
                          : "Al-Qur'an"}
                      </span>
                      {occ && (
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] ${
                            active ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          #{occ.urutan}
                        </span>
                      )}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setCameraView('estafet_peserta')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition ${
                    cameraView === 'estafet_peserta'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  Barisan Santri
                </button>
              </div>
            </div>
          </div>

          {/* Lower 3-Panel Interactive Stage:
              Col 1-3: Daftar Urutan Peserta Maju
              Col 4-8: Panel Undian Amplop Makro' (Bangku 1) + Soal Uji Kitab Berbasis Makro' Santri Tersebut (Bangku 2,3,4)
              Col 9-12: Nilai Bangku 1–4 Peserta Aktif + Cetak Berita Acara */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Queue List: Daftar Urutan Peserta Maju */}
            <div className="lg:col-span-3 rounded-3xl bg-white border border-slate-200 p-4 shadow-2xs space-y-3">
              <div className="border-b border-slate-100 pb-2.5">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>Daftar Urutan Peserta ({tingkat})</span>
                </h3>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  Santri masuk tanpa membawa kitab. Moderator memanggil urutan berikutnya saat Bangku 1 kosong.
                </p>
              </div>

              <div className="space-y-1.5 max-h-[430px] overflow-y-auto pr-1 text-xs">
                {eligibleSantri.map((s, idx) => {
                  const inBench = (Object.entries(benchSlots) as Array<[MunaqosyahBenchId, EstafetParticipant | null]>).find(
                    ([, slot]) => slot?.santriId === s.id
                  );
                  const isDone = completedSantriIds.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition ${
                        inBench
                          ? 'bg-emerald-50 border-emerald-400'
                          : isDone
                          ? 'bg-slate-50 border-slate-200 opacity-70'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">
                          {idx + 1}. {s.nama}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {s.kelas} · NIS {s.nis}
                        </p>
                      </div>
                      {inBench ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBench(inBench[0]);
                            setCameraView(inBench[0]);
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-700 text-white text-[10px] font-bold shrink-0"
                        >
                          Bangku {MUNAQOSYAH_BENCHES.find((b) => b.id === inBench[0])?.nomorBangku}
                        </button>
                      ) : isDone ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                          Selesai
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleCallSpecificToModerator(idx)}
                          className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold shrink-0"
                        >
                          Panggil
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Center 5 Cols: Amplop Makro' Lottery & Makro'-Linked Bench Question */}
            <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    <span>
                      Bangku {MUNAQOSYAH_BENCHES.find((b) => b.id === selectedBench)?.nomorBangku}:{' '}
                      {MUNAQOSYAH_BENCHES.find((b) => b.id === selectedBench)?.label}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {activeParticipant
                      ? `Peserta #${activeParticipant.urutan}: ${activeParticipant.santriNama} (${activeParticipant.santriKelas})`
                      : 'Bangku ini belum ditempati peserta.'}
                  </p>
                </div>

                {selectedBench === 'moderator' && benchSlots.moderator && (
                  <button
                    type="button"
                    onClick={() => handleDrawMakroAtModerator()}
                    disabled={isShufflingEnvelope}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>{isShufflingEnvelope ? 'Mengundi...' : "Acak Amplop Makro'"}</span>
                  </button>
                )}
              </div>

              {/* Envelope Picker when Moderator bench is focused */}
              {selectedBench === 'moderator' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <p className="font-extrabold">
                      Tata Cara Bangku 1 (Moderator · Pengambilan Amplop Makro&apos;):
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      Santri masuk ruangan <strong>tanpa membawa kitab</strong>. Moderator mempersilakan santri mengambil amplop undian panitia, lalu membacakan nomor Makro&apos;, bab/fasal, halaman, &amp; baris kitab.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {makroList.map((env) => {
                      const picked = activeParticipant?.makro?.id === env.id;
                      return (
                        <button
                          key={env.id}
                          type="button"
                          onClick={() => handleDrawMakroAtModerator(env)}
                          className={`p-2.5 rounded-2xl border text-left transition space-y-1 ${
                            picked
                              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/30 shadow-xs'
                              : 'bg-slate-50 border-slate-200 hover:bg-amber-50/50'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-extrabold text-amber-900">
                            <span className="inline-flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5 text-amber-600" />
                              {env.kodeAmplop}
                            </span>
                            {picked && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white text-[9px]">
                                Dibacakan
                              </span>
                            )}
                          </div>
                          <p className="text-[10.5px] font-semibold text-slate-700 line-clamp-2">
                            {env.lokasiKitab}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Display active participant's drawn Makro' + Bench-specific questions */}
              {activeParticipant?.makro ? (
                <div className="rounded-2xl bg-[#FBF8EE] border border-amber-200 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-800 text-white text-[10px] font-bold">
                      {activeParticipant.makro.kodeAmplop} · {activeParticipant.makro.kitabSumber}
                    </span>
                    <span className="text-[11px] font-bold text-amber-900">
                      {activeParticipant.makro.lokasiKitab}
                    </span>
                  </div>

                  {/* Arabic Makro' Excerpt Box */}
                  <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1.5">
                    <p className="font-arabic text-base sm:text-lg font-bold text-slate-900 leading-loose text-right" dir="rtl">
                      {activeParticipant.makro.teksArabMakro}
                    </p>
                    <p className="text-[11px] text-slate-600 italic border-t border-slate-100 pt-1.5">
                      &ldquo;{activeParticipant.makro.terjemahMakro}&rdquo;
                    </p>
                  </div>

                  {/* Bench 2: Nahwu Shorof questions about THAT Makro' */}
                  {selectedBench === 'nahwu_shorof' && (
                    <div className="space-y-2 pt-1">
                      <p className="text-[11px] font-extrabold text-cyan-900 uppercase">
                        Pertanyaan Nahwu &amp; Shorof Pada Makro&apos; Ini ({activeParticipant.makro.nahwu.kitabRujukan})
                      </p>
                      <p
                        className="font-arabic text-sm font-bold text-cyan-950 bg-cyan-50/70 border border-cyan-200 rounded-xl p-2 text-right"
                        dir="rtl"
                      >
                        {activeParticipant.makro.nahwu.baitAtauKaidahArab}
                      </p>
                      <p className="text-xs font-bold text-slate-800 leading-relaxed">
                        {activeParticipant.makro.nahwu.pertanyaanIndo}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAnswerKey((v) => !v)}
                        className="text-[11px] font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
                      >
                        {showAnswerKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showAnswerKey ? 'Sembunyikan Kunci Jawaban' : 'Tampilkan Kunci Jawaban Penguji'}</span>
                      </button>
                      {showAnswerKey && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                          <strong>Kunci Jawaban:</strong> {activeParticipant.makro.nahwu.kunciJawaban}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bench 3: Fiqih questions about THAT Makro' */}
                  {selectedBench === 'fiqih' && (
                    <div className="space-y-2 pt-1">
                      <p className="text-[11px] font-extrabold text-blue-900 uppercase">
                        Pertanyaan Fan Fiqih Pada Makro&apos; Ini ({activeParticipant.makro.fiqih.kitabRujukan})
                      </p>
                      <p className="text-xs font-bold text-slate-800 leading-relaxed">
                        {activeParticipant.makro.fiqih.pertanyaanIndo}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAnswerKey((v) => !v)}
                        className="text-[11px] font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
                      >
                        {showAnswerKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showAnswerKey ? 'Sembunyikan Kunci Jawaban' : 'Tampilkan Kunci Jawaban Penguji'}</span>
                      </button>
                      {showAnswerKey && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                          <strong>Kunci Jawaban:</strong> {activeParticipant.makro.fiqih.kunciJawaban}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bench 4: Al-Qur'an & Tajwid test */}
                  {selectedBench === 'alquran' && (
                    <div className="space-y-2 pt-1">
                      <p className="text-[11px] font-extrabold text-amber-900 uppercase">
                        Uji Baca Al-Qur&apos;an &amp; Tajwid ({activeParticipant.makro.alquran.suratAyat})
                      </p>
                      <p
                        className="font-arabic text-base font-bold text-slate-900 bg-white border border-amber-200 rounded-xl p-2.5 text-right leading-loose"
                        dir="rtl"
                      >
                        {activeParticipant.makro.alquran.teksArabAyat}
                      </p>
                      <p className="text-xs font-bold text-slate-800 leading-relaxed">
                        {activeParticipant.makro.alquran.pertanyaanTajwidIndo}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAnswerKey((v) => !v)}
                        className="text-[11px] font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
                      >
                        {showAnswerKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showAnswerKey ? 'Sembunyikan Kunci Jawaban' : 'Tampilkan Kunci Jawaban Penguji'}</span>
                      </button>
                      {showAnswerKey && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                          <strong>Kunci Jawaban Tajwid:</strong> {activeParticipant.makro.alquran.kunciJawaban}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                fallbackQuestion && (
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold text-slate-700">{fallbackQuestion.kitabNama}</span>
                      <button
                        type="button"
                        onClick={() => setQuestionIdxFallback((i) => i + 1)}
                        className="text-[11px] font-bold text-emerald-800 hover:underline"
                      >
                        Soal Lain →
                      </button>
                    </div>
                    <p className="font-arabic text-base font-bold text-slate-900 text-right" dir="rtl">
                      {fallbackQuestion.teksArabSoal}
                    </p>
                    <p className="text-xs text-slate-700">{fallbackQuestion.pertanyaanIndo}</p>
                  </div>
                )
              )}

              {/* Customize Bench Examiners */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <p className="text-[10.5px] font-bold uppercase text-slate-500">
                  Penugasan Ustadz Penyimak Bangku 1–4
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {MUNAQOSYAH_BENCHES.map((b) => (
                    <div key={b.id}>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Bangku {b.nomorBangku}: {b.label}
                      </label>
                      <select
                        value={pengujiNames[b.id]}
                        onChange={(e) =>
                          setPengujiNames((prev) => ({ ...prev, [b.id]: e.target.value }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-800"
                      >
                        <option value={b.pengujiDefault}>{b.pengujiDefault}</option>
                        {ustadzList.map((u) => {
                          const display = formatNamaWithGelar(u.nama, u.gender);
                          return (
                            <option key={u.id} value={display}>
                              {display}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Grading Form for the Santri Seated at Selected Bench */}
            <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Nilai Peserta Bangku {MUNAQOSYAH_BENCHES.find((b) => b.id === selectedBench)?.nomorBangku}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {activeParticipant ? activeParticipant.santriNama : 'Tidak ada peserta di bangku ini'}
                  </p>
                </div>
                {activeSummary && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-extrabold tabular-nums">
                    {activeSummary.rataRata} ({activeSummary.predikat})
                  </span>
                )}
              </div>

              {activeParticipant ? (
                <>
                  <div className="space-y-2.5 text-xs">
                    {(
                      [
                        {
                          key: 'nilaiMod',
                          label: "Bangku 1 · Moderator (Adab & Makro')",
                          val: activeParticipant.nilaiMod,
                          accent: 'accent-emerald-700',
                        },
                        {
                          key: 'nilaiNahwu',
                          label:
                            tingkat === 'Kelas 3'
                              ? "Bangku 2 · Nahwu ('Imrithi)"
                              : 'Bangku 2 · Nahwu (Alfiyah)',
                          val: activeParticipant.nilaiNahwu,
                          accent: 'accent-cyan-700',
                        },
                        {
                          key: 'nilaiFiqih',
                          label:
                            tingkat === 'Kelas 3'
                              ? 'Bangku 3 · Fiqih (Fathul Qorib)'
                              : "Bangku 3 · Fiqih (Fathul Mu'in)",
                          val: activeParticipant.nilaiFiqih,
                          accent: 'accent-blue-700',
                        },
                        {
                          key: 'nilaiQuran',
                          label: "Bangku 4 · Al-Qur'an & Tajwid",
                          val: activeParticipant.nilaiQuran,
                          accent: 'accent-amber-600',
                        },
                      ] as const
                    ).map((item) => (
                      <div key={item.key} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-800 text-[11px]">{item.label}</span>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={item.val}
                            onChange={(e) =>
                              handleUpdateActiveSlotField(
                                selectedBench,
                                item.key,
                                Math.min(100, Math.max(0, Number(e.target.value) || 0))
                              )
                            }
                            className="w-14 rounded-lg border border-slate-300 px-1.5 py-0.5 text-center font-extrabold text-slate-900 tabular-nums bg-white"
                          />
                        </div>
                        <input
                          type="range"
                          min={40}
                          max={100}
                          value={item.val}
                          onChange={(e) =>
                            handleUpdateActiveSlotField(selectedBench, item.key, Number(e.target.value))
                          }
                          className={`w-full ${item.accent}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Catatan Dewan Penyimak
                    </label>
                    <textarea
                      rows={2}
                      value={activeParticipant.catatan}
                      onChange={(e) =>
                        handleUpdateActiveSlotField(selectedBench, 'catatan', e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-800"
                    />
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        commitParticipantRecord(activeParticipant);
                        notify(
                          `Nilai Munaqosyah ${activeParticipant.santriNama} (${activeSummary?.rataRata} · ${activeSummary?.predikat}) disimpan.`
                        );
                      }}
                      className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Nilai Peserta Ini Sekarang</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const sum = calcMunaqosyahSummary(
                          activeParticipant.nilaiMod,
                          activeParticipant.nilaiNahwu,
                          activeParticipant.nilaiFiqih,
                          activeParticipant.nilaiQuran
                        );
                        handleDownloadPdfRecord({
                          tanggal: new Date().toISOString().split('T')[0],
                          tahunAjaran: currentTahunAjaran,
                          tingkat,
                          santriId: activeParticipant.santriId,
                          santriNama: activeParticipant.santriNama,
                          santriNis: activeParticipant.santriNis,
                          santriKelas: activeParticipant.santriKelas,
                          makroKode: activeParticipant.makro?.kodeAmplop,
                          makroLokasi: activeParticipant.makro?.lokasiKitab,
                          pengujiModerator: pengujiNames.moderator,
                          pengujiNahwu: pengujiNames.nahwu_shorof,
                          pengujiFiqih: pengujiNames.fiqih,
                          pengujiAlquran: pengujiNames.alquran,
                          nilaiModerator: activeParticipant.nilaiMod,
                          nilaiNahwu: activeParticipant.nilaiNahwu,
                          nilaiFiqih: activeParticipant.nilaiFiqih,
                          nilaiAlquran: activeParticipant.nilaiQuran,
                          rataRata: sum.rataRata,
                          predikat: sum.predikat,
                          statusLulus: sum.statusLulus,
                          catatanDewan: activeParticipant.catatan,
                        });
                      }}
                      className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh PDF Berita Acara &amp; Makro&apos;</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                  <p>Belum ada peserta yang duduk di Bangku {MUNAQOSYAH_BENCHES.find((b) => b.id === selectedBench)?.nomorBangku}.</p>
                  <p>Tekan tombol &ldquo;Majukan Estafet&rdquo; di atas atau panggil peserta dari Daftar Urutan.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'monitor_realtime' && (
        <div className="space-y-5">
          {/* KPI Live Progress Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs">
              <p className="text-[11px] font-semibold text-slate-500">Jenjang Aktif</p>
              <p className="text-lg font-black text-slate-900 mt-1">{tingkat}</p>
              <p className="text-[10.5px] text-emerald-700 font-semibold mt-0.5">
                {tingkat === 'Kelas 3' ? 'Imrithi & Fathul Qorib' : "Alfiyah & Fathul Mu'in"}
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs">
              <p className="text-[11px] font-semibold text-slate-500">Bangku Terisi</p>
              <p className="text-lg font-black text-emerald-800 mt-1 tabular-nums">
                {occupiedBenchesCount} / 4 Bangku
              </p>
              <p className="text-[10.5px] text-slate-500 mt-0.5">Estafet ujian paralel</p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs">
              <p className="text-[11px] font-semibold text-slate-500">Selesai 4 Tahap</p>
              <p className="text-lg font-black text-slate-900 mt-1 tabular-nums">
                {completedSantriIds.length} / {eligibleSantri.length} Santri
              </p>
              <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all"
                  style={{
                    width: `${eligibleSantri.length ? Math.round((completedSantriIds.length / eligibleSantri.length) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs">
              <p className="text-[11px] font-semibold text-slate-500">Sisa Antrean</p>
              <p className="text-lg font-black text-amber-700 mt-1 tabular-nums">
                {waitingCandidates.length} Santri
              </p>
              <p className="text-[10.5px] text-slate-500 mt-0.5 truncate">
                Berikutnya: {waitingCandidates[0]?.nama || 'Semua dipanggil'}
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs">
              <p className="text-[11px] font-semibold text-slate-500">Rekap Tersimpan</p>
              <p className="text-lg font-black text-slate-900 mt-1 tabular-nums">
                {munaqosyahRecords.length} Berita Acara
              </p>
              <p className="text-[10.5px] text-emerald-700 font-semibold mt-0.5">
                {munaqosyahRecords.filter((r) => r.statusLulus === 'Lulus').length} Lulus Yudisium
              </p>
            </div>
          </div>

          {/* Real-Time Control Header */}
          <div className="rounded-3xl bg-slate-950 text-white p-5 border border-emerald-900/60 shadow-lg space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>MONITOR ANTREAN REAL-TIME · 4 BANGKU PENYIMAK</span>
                </div>
                <h3 className="text-base font-extrabold mt-1">
                  Papan Pantau Panitia Munaqosyah ({tingkat})
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  {(['Kelas 3', 'Kelas 6'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setTingkat(lvl)}
                      className={`px-3 py-1 rounded-lg font-bold transition ${
                        tingkat === lvl ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAdvanceEstafet}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Majukan Estafet</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadFinalReportPdf}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF Hasil Akhir</span>
                </button>
              </div>
            </div>

            {/* 4-Stage Live Conveyor Monitor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {MUNAQOSYAH_BENCHES.map((b) => {
                const occ = benchSlots[b.id];
                const stageNum = b.nomorBangku;
                const stagePct = stageNum * 25;
                const elapsed = formatElapsed(benchEnteredAt[b.id]);
                return (
                  <div
                    key={b.id}
                    className={`rounded-2xl p-4 border transition flex flex-col justify-between gap-3 ${
                      occ
                        ? 'bg-slate-900/90 border-emerald-500/40'
                        : 'bg-slate-900/40 border-slate-800'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold text-white"
                          style={{ backgroundColor: b.warnaBadge }}
                        >
                          Bangku {b.nomorBangku} · {b.id === 'nahwu_shorof' ? 'Nahwu Shorof' : b.id === 'fiqih' ? 'Fiqih' : b.id === 'alquran' ? "Al-Qur'an" : 'Moderator'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-300 tabular-nums">
                          <Clock className="w-3 h-3" />
                          {occ ? elapsed : '--:--'}
                        </span>
                      </div>

                      {occ ? (
                        <div>
                          <p className="text-sm font-extrabold text-white truncate">{occ.santriNama}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Urutan #{occ.urutan} · {occ.santriKelas} · NIS {occ.santriNis}
                          </p>
                          <p className="text-[11px] text-amber-300 font-semibold mt-1.5 line-clamp-2">
                            {occ.makro ? `${occ.makro.kodeAmplop} — ${occ.makro.lokasiKitab}` : "Menunggu undian Makro'"}
                          </p>
                        </div>
                      ) : (
                        <div className="py-4 text-xs text-slate-500 italic">
                          Bangku kosong — menunggu estafet dari tahap sebelumnya
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Penguji: {pengujiNames[b.id]}</span>
                        <span className="font-bold text-slate-200 tabular-nums">Tahap {stageNum}/4</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: occ ? `${stagePct}%` : '0%',
                            backgroundColor: b.warnaBadge,
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBench(b.id);
                          setCameraView(b.id);
                          setActiveSubTab('ruang_3d');
                        }}
                        className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition"
                      >
                        Buka Panel Nilai Bangku {b.nomorBangku} →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Queue & Completed Strip */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
              <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 space-y-2">
                <p className="text-xs font-extrabold text-amber-300">
                  Antrean Berikutnya Menunggu Panggilan ({waitingCandidates.length} Santri)
                </p>
                {waitingCandidates.length === 0 ? (
                  <p className="text-xs text-slate-400">Seluruh santri pada jenjang {tingkat} sudah masuk alur estafet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {waitingCandidates.slice(0, 8).map((w, idx) => (
                      <div
                        key={w.id}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">
                            {idx + 1}. {w.nama}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {w.kelas} · NIS {w.nis}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const origIdx = eligibleSantri.findIndex((e) => e.id === w.id);
                            if (origIdx >= 0) handleCallSpecificToModerator(origIdx);
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-bold shrink-0"
                        >
                          Panggil
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 space-y-2">
                <p className="text-xs font-extrabold text-emerald-300">
                  Santri Baru Selesai &amp; Masuk Rekap Otomatis ({munaqosyahRecords.slice(0, 6).length} Terbaru)
                </p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {munaqosyahRecords.slice(0, 6).map((rec) => (
                    <div
                      key={rec.id}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{rec.santriNama}</p>
                        <p className="text-[10px] text-slate-400">
                          {rec.tingkat} · {rec.makroKode || 'Undian Acak'} · Nilai: {rec.nilaiModerator}/{rec.nilaiNahwu}/{rec.nilaiFiqih}/{rec.nilaiAlquran}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-900/80 border border-emerald-600/40 text-emerald-200 text-[10px] font-extrabold tabular-nums shrink-0">
                        {rec.rataRata} ({rec.predikat})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'rekap_nilai' && (
        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Rekapitulasi Otomatis Hasil Akhir Munaqosyah (4 Tahap Selesai)
              </h3>
              <p className="text-[11px] text-slate-500">
                Setiap santri yang menyelesaikan Bangku 1–4 terekap otomatis. Unduh Laporan Hasil Akhir PDF atau Berita Acara per santri.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {(['Semua', 'Kelas 3', 'Kelas 6'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setRekapFilter(f)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition ${
                    rekapFilter === f
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
              <button
                type="button"
                onClick={handleDownloadFinalReportPdf}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold inline-flex items-center gap-1.5 shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Unduh Laporan Hasil Akhir (PDF)</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase text-slate-500">
                  <th className="py-2.5 px-3 font-bold">Tanggal &amp; Jenjang</th>
                  <th className="py-2.5 px-3 font-bold">Nama Santri &amp; Makro&apos;</th>
                  <th className="py-2.5 px-3 font-bold text-center">1. Mod</th>
                  <th className="py-2.5 px-3 font-bold text-center">2. Nahwu</th>
                  <th className="py-2.5 px-3 font-bold text-center">3. Fiqih</th>
                  <th className="py-2.5 px-3 font-bold text-center">4. Al-Qur&apos;an</th>
                  <th className="py-2.5 px-3 font-bold text-center">Rata-rata</th>
                  <th className="py-2.5 px-3 font-bold">Predikat</th>
                  <th className="py-2.5 px-3 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 tabular-nums">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                        {rec.tingkat}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{rec.tanggal}</p>
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-slate-900">{rec.santriNama}</p>
                      <p className="text-[10px] text-slate-500">
                        {rec.santriKelas} · NIS {rec.santriNis}
                        {rec.makroKode ? ` · ${rec.makroKode}` : ''}
                      </p>
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold">{rec.nilaiModerator}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-cyan-800">{rec.nilaiNahwu}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-blue-800">{rec.nilaiFiqih}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-amber-800">{rec.nilaiAlquran}</td>
                    <td className="py-2.5 px-3 text-center font-extrabold text-emerald-900">{rec.rataRata}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                        {rec.predikat}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDownloadPdfRecord(rec)}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold inline-flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteMunaqosyahRecord(rec.id);
                            notify(`Data Munaqosyah ${rec.santriNama} dihapus.`);
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700"
                          title="Hapus Rekap"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
