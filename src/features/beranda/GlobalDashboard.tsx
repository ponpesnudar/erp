import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Users,
  Wallet,
  CalendarClock,
  UserCheck,
  ArrowRight,
  BookOpen,
  FileCheck,
  ShieldAlert,
  CreditCard,
  UserPlus,
  Mail,
  RefreshCw,
  Lock,
  FileDown,
  FileSpreadsheet,
  GripVertical,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
  MoveHorizontal,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAppStore } from '../../lib/store.ts';
import { useAuth } from '../../lib/auth.ts';

interface GlobalDashboardProps {
  onNavigate?: (moduleTab: string) => void;
}

type KpiCardId = 'santri' | 'kas' | 'agenda' | 'kehadiran';
type SummaryCardId = 'agenda_surat' | 'imtihan_diniyah' | 'bk_pos_psb';

const DEFAULT_KPI_ORDER: KpiCardId[] = ['santri', 'kas', 'agenda', 'kehadiran'];
const DEFAULT_SUMMARY_ORDER: SummaryCardId[] = ['agenda_surat', 'imtihan_diniyah', 'bk_pos_psb'];

interface SavedLayoutPref {
  kpiOrder: KpiCardId[];
  summaryOrder: SummaryCardId[];
}

const BULAN_MAP: Record<string, string> = {
  Januari: '01',
  Februari: '02',
  Maret: '03',
  April: '04',
  Mei: '05',
  Juni: '06',
  Juli: '07',
  Agustus: '08',
  September: '09',
  Oktober: '10',
  November: '11',
  Desember: '12',
};

const formatRupiahShort = (nominal: number): string => {
  const abs = Math.abs(nominal);
  const sign = nominal < 0 ? '-' : '';
  if (abs >= 1_000_000_000) {
    return `${sign}Rp ${(abs / 1_000_000_000).toFixed(2).replace('.', ',')} M`;
  }
  if (abs >= 1_000_000) {
    return `${sign}Rp ${(abs / 1_000_000).toFixed(1).replace('.', ',')} jt`;
  }
  return `${sign}Rp ${abs.toLocaleString('id-ID')}`;
};

const formatRupiahFull = (nominal: number): string => {
  const sign = nominal < 0 ? '-' : '';
  return `${sign}Rp ${Math.abs(nominal).toLocaleString('id-ID')}`;
};

const formatTanggalPendek = (isoDate: string): string => {
  const bulanIndo = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const bulanIdx = Math.max(0, Math.min(11, parseInt(parts[1], 10) - 1));
  return `${parts[2]} ${bulanIndo[bulanIdx]} ${parts[0]}`;
};

function sanitizeOrder<T extends string>(candidate: unknown, defaults: readonly T[]): T[] {
  if (!Array.isArray(candidate)) return [...defaults];
  const valid = candidate.filter((item): item is T => defaults.includes(item as T));
  const unique = Array.from(new Set(valid));
  defaults.forEach((def) => {
    if (!unique.includes(def)) unique.push(def);
  });
  return unique;
}

function reorderList<T>(list: T[], fromId: T, toId: T): T[] {
  const fromIdx = list.indexOf(fromId);
  const toIdx = list.indexOf(toId);
  if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return list;
  const next = [...list];
  const [moved] = next.splice(fromIdx, 1);
  next.splice(toIdx, 0, moved);
  return next;
}

export const GlobalDashboard: React.FC<GlobalDashboardProps> = ({ onNavigate }) => {
  const {
    currentUser,
    santriList,
    ustadzList,
    sarprasRuangan,
    kasTransactions,
    rekapAnggaranBulanan,
    ustadzPayroll,
    agendaKegiatan,
    absensiSessions,
    absensiGuruList,
    soalSubmissions,
    ruangUjianList,
    imtihanMaster,
    rabImtihan,
    jadwalMengajar,
    pelanggaranList,
    titipanWali,
    bukuTamu,
    transaksiList,
    psbList,
    suratList,
    kotakMasuk,
    currentTahunAjaran,
    addAuditLog,
  } = useAppStore();

  const { isFinancialPrivileged } = useAuth();
  const canSeeFinance = isFinancialPrivileged();

  const [lastRefreshed, setLastRefreshed] = useState<string>(() =>
    new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  );
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [reorderMode, setReorderMode] = useState<boolean>(false);

  // Periode laporan bulanan (default bulan terakhir pada rekapAnggaranBulanan)
  const periodOptions = useMemo(() => {
    return rekapAnggaranBulanan.map((r) => ({
      key: `${r.bulan} ${r.tahun}`,
      bulan: r.bulan,
      tahun: r.tahun,
      ymPrefix: `${r.tahun}-${BULAN_MAP[r.bulan] || '11'}`,
    }));
  }, [rekapAnggaranBulanan]);

  const [selectedPeriodKey, setSelectedPeriodKey] = useState<string>(() => {
    const last = rekapAnggaranBulanan[rekapAnggaranBulanan.length - 1];
    return last ? `${last.bulan} ${last.tahun}` : 'November 2026';
  });

  const activePeriod = useMemo(() => {
    return (
      periodOptions.find((p) => p.key === selectedPeriodKey) ||
      periodOptions[periodOptions.length - 1] || {
        key: 'November 2026',
        bulan: 'November',
        tahun: 2026,
        ymPrefix: new Date().toISOString().slice(0, 7),
      }
    );
  }, [periodOptions, selectedPeriodKey]);

  // Drag-and-drop state & persistence per user
  const storageKey = `erp-darussalam-dashboard-layout-${currentUser.id}`;
  const [kpiOrder, setKpiOrder] = useState<KpiCardId[]>(() => [...DEFAULT_KPI_ORDER]);
  const [summaryOrder, setSummaryOrder] = useState<SummaryCardId[]>(() => [...DEFAULT_SUMMARY_ORDER]);

  const [draggingKpi, setDraggingKpi] = useState<KpiCardId | null>(null);
  const [dragOverKpi, setDragOverKpi] = useState<KpiCardId | null>(null);
  const [draggingSummary, setDraggingSummary] = useState<SummaryCardId | null>(null);
  const [dragOverSummary, setDragOverSummary] = useState<SummaryCardId | null>(null);
  const justDraggedRef = useRef<boolean>(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        setKpiOrder([...DEFAULT_KPI_ORDER]);
        setSummaryOrder([...DEFAULT_SUMMARY_ORDER]);
        return;
      }
      const parsed = JSON.parse(raw) as Partial<SavedLayoutPref>;
      setKpiOrder(sanitizeOrder(parsed.kpiOrder, DEFAULT_KPI_ORDER));
      setSummaryOrder(sanitizeOrder(parsed.summaryOrder, DEFAULT_SUMMARY_ORDER));
    } catch {
      setKpiOrder([...DEFAULT_KPI_ORDER]);
      setSummaryOrder([...DEFAULT_SUMMARY_ORDER]);
    }
  }, [storageKey]);

  const persistLayout = (nextKpi: KpiCardId[], nextSummary: SummaryCardId[]) => {
    try {
      const payload: SavedLayoutPref = { kpiOrder: nextKpi, summaryOrder: nextSummary };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
  };

  const isCustomLayout =
    kpiOrder.some((id, i) => id !== DEFAULT_KPI_ORDER[i]) ||
    summaryOrder.some((id, i) => id !== DEFAULT_SUMMARY_ORDER[i]);

  const handleResetLayout = () => {
    const defKpi = [...DEFAULT_KPI_ORDER];
    const defSummary = [...DEFAULT_SUMMARY_ORDER];
    setKpiOrder(defKpi);
    setSummaryOrder(defSummary);
    persistLayout(defKpi, defSummary);
    showToast('Susunan kartu dikembalikan ke urutan awal.');
  };

  const showToast = (msg: string) => {
    setExportNotice(msg);
    window.setTimeout(() => {
      setExportNotice((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  // 1. Data Santri, Asatidz & PSB
  const santriStats = useMemo(() => {
    const totalAktif = santriList.length;
    const putra = santriList.filter((s) => s.gender === 'L').length;
    const putri = santriList.filter((s) => s.gender === 'P').length;
    const kartuAktif = santriList.filter((s) => s.statusKartu === 'Aktif').length;
    const kartuTerblokir = totalAktif - kartuAktif;
    const psbMenunggu = psbList.filter(
      (p) => p.status === 'Menunggu Verifikasi' || p.status === 'Diterima'
    ).length;

    return {
      totalAktif,
      putra,
      putri,
      kartuAktif,
      kartuTerblokir,
      asatidzCount: ustadzList.length,
      kamarCount: sarprasRuangan.length,
      psbMenunggu,
    };
  }, [santriList, ustadzList, sarprasRuangan, psbList]);

  // 2. Data Keuangan Real-Time (mengikuti periode bulan terpilih & buku kas berjalan)
  const financeStats = useMemo(() => {
    const monthTx = kasTransactions.filter((t) => t.tanggal.startsWith(activePeriod.ymPrefix));
    const selectedRekap = rekapAnggaranBulanan.find(
      (r) => `${r.bulan} ${r.tahun}` === activePeriod.key
    );

    const hasLiveKasForPeriod = monthTx.length > 0;
    const masuk = hasLiveKasForPeriod
      ? monthTx.filter((t) => t.tipe === 'Masuk').reduce((acc, t) => acc + t.nominal, 0)
      : selectedRekap?.realisasiMasuk ?? 0;
    const keluar = hasLiveKasForPeriod
      ? monthTx.filter((t) => t.tipe === 'Keluar').reduce((acc, t) => acc + t.nominal, 0)
      : selectedRekap?.realisasiKeluar ?? 0;
    const sisaKasBulanIni = masuk - keluar;

    const bisyarohSiap = ustadzPayroll.filter((p) => p.statusBayar === 'Siap');
    const bisyarohSudah = ustadzPayroll.filter((p) => p.statusBayar === 'Dibayarkan');

    return {
      masuk,
      keluar,
      sisaKasBulanIni,
      hasLiveKasForPeriod,
      txList: monthTx,
      selectedRekap,
      persentaseRealisasi: selectedRekap?.persentaseRealisasi ?? 0,
      bisyarohSiapCount: bisyarohSiap.length,
      bisyarohSudahCount: bisyarohSudah.length,
    };
  }, [kasTransactions, rekapAnggaranBulanan, ustadzPayroll, activePeriod]);

  // 3. Agenda Kegiatan Mendesak & Persetujuan
  const agendaStats = useMemo(() => {
    const todayMs = new Date(todayStr).getTime();

    const activeAgendas = agendaKegiatan
      .filter((a) => a.status !== 'Selesai')
      .map((a) => {
        const targetMs = new Date(a.tanggal).getTime();
        const diffDays = Number.isNaN(targetMs)
          ? 999
          : Math.ceil((targetMs - todayMs) / (1000 * 60 * 60 * 24));
        return { ...a, diffDays };
      })
      .sort((a, b) => a.diffDays - b.diffDays);

    const urgentNearest = activeAgendas[0] || null;
    const kotakMenunggu = kotakMasuk.filter((k) => k.status === 'Menunggu');
    const suratMenunggu = suratList.filter(
      (s) => s.status === 'Menunggu TTD' || s.status === 'Konsep'
    );

    return {
      activeAgendas,
      urgentNearest,
      urgentCount: activeAgendas.length,
      kotakMenungguCount: kotakMenunggu.length,
      suratMenungguCount: suratMenunggu.length,
      kotakMenunggu,
    };
  }, [agendaKegiatan, kotakMasuk, suratList, todayStr]);

  // 4. Statistik Kehadiran Santri Hari Ini & Guru Diniyah
  const attendanceStats = useMemo(() => {
    const todaySessions = absensiSessions.filter((s) => s.tanggal === todayStr);
    const isTodayData = todaySessions.length > 0;

    let targetDate = todayStr;
    let sessionsToAnalyze = todaySessions;

    if (!isTodayData && absensiSessions.length > 0) {
      const sortedDates = [...absensiSessions]
        .map((s) => s.tanggal)
        .sort((a, b) => b.localeCompare(a));
      targetDate = sortedDates[0];
      sessionsToAnalyze = absensiSessions.filter((s) => s.tanggal === targetDate);
    }

    let hadir = 0;
    let izin = 0;
    let sakit = 0;
    let alpa = 0;

    sessionsToAnalyze.forEach((sess) => {
      Object.values(sess.kehadiran).forEach((st) => {
        if (st === 'H') hadir += 1;
        else if (st === 'I') izin += 1;
        else if (st === 'S') sakit += 1;
        else if (st === 'A') alpa += 1;
      });
    });

    const totalTercatat = hadir + izin + sakit + alpa;
    const persentaseHadir = totalTercatat > 0 ? Math.round((hadir / totalTercatat) * 100) : 0;

    const guruToday = absensiGuruList.filter((g) => g.tanggal === targetDate);
    const guruList = guruToday.length > 0 ? guruToday : absensiGuruList;
    const guruHadir = guruList.filter((g) => g.status === 'Hadir').length;

    return {
      isTodayData,
      targetDate,
      sessionsToAnalyze,
      sessionCount: sessionsToAnalyze.length,
      hadir,
      izin,
      sakit,
      alpa,
      totalTercatat,
      persentaseHadir,
      guruHadir,
      guruTotal: guruList.length,
    };
  }, [absensiSessions, absensiGuruList, todayStr]);

  // 5. Kesiapan Imtihan & Akademik
  const imtihanStats = useMemo(() => {
    const totalSoal = soalSubmissions.length;
    const soalSiap = soalSubmissions.filter(
      (s) => s.status === 'Disetujui' || s.status === 'Terkunci'
    ).length;
    const totalRab = rabImtihan
      .filter((r) => r.kategori !== 'Pemasukan')
      .reduce((acc, r) => acc + (r.jumlah || r.qty * r.harga), 0);
    const pesertaSusulan = imtihanMaster.pesertaSusulanIds?.length ?? 0;

    return {
      totalSoal,
      soalSiap,
      ruangCount: ruangUjianList.length || imtihanMaster.roomConfigs?.length || 0,
      pesertaSusulan,
      totalRab,
      jadwalMengajarCount: jadwalMengajar.length,
    };
  }, [soalSubmissions, rabImtihan, ruangUjianList, imtihanMaster, jadwalMengajar]);

  // 6. BK, Keamanan & Cashless POS
  const keamananPosStats = useMemo(() => {
    const pelanggaranAktif = pelanggaranList.filter(
      (p) => p.status === 'Dalam Pembinaan'
    ).length;
    const titipanMenunggu = titipanWali.filter(
      (t) => t.status !== 'Diterima Santri'
    ).length;
    const totalJajan = transaksiList
      .filter((t) => t.tipe !== 'Top Up')
      .reduce((acc, t) => acc + t.nominal, 0);
    const totalTopUp = transaksiList
      .filter((t) => t.tipe === 'Top Up')
      .reduce((acc, t) => acc + t.nominal, 0);

    return {
      pelanggaranAktif,
      titipanMenunggu,
      tamuCount: bukuTamu.length,
      totalJajan,
      totalTopUp,
      trxCount: transaksiList.length,
    };
  }, [pelanggaranList, titipanWali, bukuTamu, transaksiList]);

  const navigate = (tab: string) => {
    if (justDraggedRef.current || reorderMode) return;
    if (onNavigate) onNavigate(tab);
  };

  // Export Handler: Excel (.xlsx)
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const periodeSlug = activePeriod.key.replace(/\s+/g, '_');

    const ringkasanRows = [
      {
        Modul: 'Sekretariat & PSB',
        Indikator: 'Total Santri Aktif',
        Nilai: `${santriStats.totalAktif} Santri`,
        Rincian: `${santriStats.putra} Putra, ${santriStats.putri} Putri, ${santriStats.asatidzCount} Asatidz, ${santriStats.psbMenunggu} PSB menanti`,
      },
      {
        Modul: 'Bendahara & Kas',
        Indikator: `Sisa Kas (${activePeriod.key})`,
        Nilai: canSeeFinance ? formatRupiahFull(financeStats.sisaKasBulanIni) : 'Akses Terbatas',
        Rincian: canSeeFinance
          ? `Masuk ${formatRupiahFull(financeStats.masuk)} | Keluar ${formatRupiahFull(financeStats.keluar)} | ${financeStats.bisyarohSiapCount} bisyaroh siap cair`
          : 'Khusus peran Pengasuh & Bendahara',
      },
      {
        Modul: "Kema'hadiyahan",
        Indikator: 'Agenda Kegiatan Mendesak',
        Nilai: agendaStats.urgentNearest ? agendaStats.urgentNearest.nama : 'Tidak Ada Agenda Aktif',
        Rincian: agendaStats.urgentNearest
          ? `Tanggal ${formatTanggalPendek(agendaStats.urgentNearest.tanggal)} (${agendaStats.urgentCount} agenda aktif, ${agendaStats.kotakMenungguCount} persetujuan)`
          : 'Semua agenda telah selesai',
      },
      {
        Modul: "Ma'arifan Diniyah",
        Indikator: 'Kehadiran Santri',
        Nilai: `${attendanceStats.persentaseHadir}% (${attendanceStats.hadir}/${attendanceStats.totalTercatat})`,
        Rincian: `Tanggal ${formatTanggalPendek(attendanceStats.targetDate)} | H:${attendanceStats.hadir} I:${attendanceStats.izin} S:${attendanceStats.sakit} A:${attendanceStats.alpa} | Guru hadir ${attendanceStats.guruHadir}/${attendanceStats.guruTotal}`,
      },
      {
        Modul: 'Imtihan & Ujian',
        Indikator: `Kesiapan Imtihan Cawu ${imtihanMaster.cawu}`,
        Nilai: `${imtihanStats.soalSiap}/${imtihanStats.totalSoal} Naskah Disetujui`,
        Rincian: `${imtihanStats.ruangCount} ruang ujian, ${imtihanStats.pesertaSusulan} susulan, ${imtihanStats.jadwalMengajarCount} jam mengajar, RAB ${formatRupiahFull(imtihanStats.totalRab)}`,
      },
      {
        Modul: 'BK, Kantin & PSB',
        Indikator: 'Ketertiban & Operasional Harian',
        Nilai: `${keamananPosStats.pelanggaranAktif} Pembinaan BK`,
        Rincian: `${keamananPosStats.titipanMenunggu} titipan belum diambil, ${keamananPosStats.tamuCount} tamu, Jajan Kantin ${formatRupiahFull(keamananPosStats.totalJajan)}, ${psbList.length} total PSB`,
      },
    ];

    const wsRingkasan = XLSX.utils.json_to_sheet(ringkasanRows);
    wsRingkasan['!cols'] = [{ wch: 22 }, { wch: 28 }, { wch: 26 }, { wch: 62 }];
    XLSX.utils.book_append_sheet(wb, wsRingkasan, 'Ringkasan_Global');

    if (canSeeFinance) {
      const kasRows =
        financeStats.txList.length > 0
          ? financeStats.txList.map((t) => ({
              Tanggal: t.tanggal,
              Tipe: t.tipe,
              Kategori: t.kategori,
              Uraian: t.uraian,
              Nominal_Rp: t.nominal,
              Penanggung_Jawab: t.penanggungJawab,
            }))
          : (financeStats.selectedRekap?.kategoriList || []).map((k) => ({
              Pos_Anggaran: k.nama,
              Rencana_Rp: k.rencana,
              Realisasi_Rp: k.realisasi,
              Selisih_Rp: k.selisih,
              Status: k.status,
            }));

      const wsKeuangan = XLSX.utils.json_to_sheet(kasRows);
      wsKeuangan['!cols'] = [{ wch: 28 }, { wch: 16 }, { wch: 22 }, { wch: 36 }, { wch: 16 }, { wch: 22 }];
      XLSX.utils.book_append_sheet(wb, wsKeuangan, 'Keuangan_Bulanan');
    }

    const agendaRows = agendaKegiatan.map((a) => ({
      Nama_Kegiatan: a.nama,
      Tanggal: a.tanggal,
      Lokasi: a.lokasi,
      Ketua_Panitia: a.ketuaPanitia,
      Anggaran_Rp: canSeeFinance ? a.anggaran : 0,
      Status: a.status,
    }));
    const wsAgenda = XLSX.utils.json_to_sheet(agendaRows);
    wsAgenda['!cols'] = [{ wch: 42 }, { wch: 14 }, { wch: 28 }, { wch: 24 }, { wch: 16 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsAgenda, 'Agenda_Kegiatan');

    const absensiRows = attendanceStats.sessionsToAnalyze.map((s) => {
      const vals = Object.values(s.kehadiran);
      return {
        Tanggal: s.tanggal,
        Kelas: s.kelas,
        Mata_Pelajaran: s.mapel,
        Guru_Pengampu: s.guruNama,
        Hadir: vals.filter((v) => v === 'H').length,
        Izin: vals.filter((v) => v === 'I').length,
        Sakit: vals.filter((v) => v === 'S').length,
        Alpa: vals.filter((v) => v === 'A').length,
        Catatan: s.catatan || '-',
      };
    });
    const wsAbsensi = XLSX.utils.json_to_sheet(
      absensiRows.length > 0
        ? absensiRows
        : [{ Keterangan: 'Belum ada sesi absensi santri yang tercatat.' }]
    );
    wsAbsensi['!cols'] = [
      { wch: 14 },
      { wch: 16 },
      { wch: 20 },
      { wch: 24 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 40 },
    ];
    XLSX.utils.book_append_sheet(wb, wsAbsensi, 'Kehadiran_Santri');

    XLSX.writeFile(wb, `Laporan_Performa_PP_NU_Darussalam_${periodeSlug}.xlsx`);
    addAuditLog(
      'Beranda',
      'Ekspor Excel',
      `Mengunduh laporan performa GlobalDashboard periode ${activePeriod.key} format Excel (.xlsx).`
    );
    showToast(`Laporan Excel periode ${activePeriod.key} berhasil diunduh.`);
  };

  // Export Handler: PDF (.pdf)
  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const periodeSlug = activePeriod.key.replace(/\s+/g, '_');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(11, 93, 59);
    doc.text('PONDOK PESANTREN NU DARUSSALAM KARANGDADAP', 105, 16, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    doc.text('Jl. Raya Karangdadap KM 1, Kab. Pekalongan, Jawa Tengah', 105, 21.5, {
      align: 'center',
    });

    doc.setDrawColor(11, 93, 59);
    doc.setLineWidth(0.6);
    doc.line(14, 25, 196, 25);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`LAPORAN RINGKASAN PERFORMA PESANTREN — ${activePeriod.key.toUpperCase()}`, 14, 33);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Tahun Ajaran ${currentTahunAjaran} · Dicetak oleh ${currentUser.nama} (${currentUser.peranLabel}) · ${formatTanggalPendek(todayStr)}`,
      14,
      38.5
    );

    autoTable(doc, {
      startY: 43,
      head: [['Modul', 'Indikator Utama', 'Capaian / Nilai', 'Rincian Data']],
      body: [
        [
          'Sekretariat & PSB',
          'Total Santri Aktif',
          `${santriStats.totalAktif} Santri`,
          `${santriStats.putra} Putra · ${santriStats.putri} Putri · ${santriStats.asatidzCount} Asatidz · ${santriStats.psbMenunggu} PSB menanti`,
        ],
        [
          'Bendahara & Kas',
          `Sisa Kas (${activePeriod.key})`,
          canSeeFinance ? formatRupiahFull(financeStats.sisaKasBulanIni) : 'Akses Terbatas',
          canSeeFinance
            ? `Masuk ${formatRupiahFull(financeStats.masuk)} | Keluar ${formatRupiahFull(financeStats.keluar)} | ${financeStats.bisyarohSiapCount} bisyaroh siap cair`
            : 'Khusus peran Pengasuh & Bendahara',
        ],
        [
          "Kema'hadiyahan",
          'Agenda Kegiatan Mendesak',
          agendaStats.urgentNearest ? agendaStats.urgentNearest.nama : 'Tidak Ada Agenda Aktif',
          agendaStats.urgentNearest
            ? `${formatTanggalPendek(agendaStats.urgentNearest.tanggal)} · ${agendaStats.urgentCount} agenda aktif · ${agendaStats.kotakMenungguCount} persetujuan`
            : 'Semua agenda kegiatan selesai',
        ],
        [
          "Ma'arifan Diniyah",
          'Kehadiran Santri',
          `${attendanceStats.persentaseHadir}% (${attendanceStats.hadir}/${attendanceStats.totalTercatat})`,
          `Sesi ${formatTanggalPendek(attendanceStats.targetDate)} · H:${attendanceStats.hadir} I:${attendanceStats.izin} S:${attendanceStats.sakit} A:${attendanceStats.alpa} · Guru ${attendanceStats.guruHadir}/${attendanceStats.guruTotal}`,
        ],
        [
          'Imtihan & Akademik',
          `Kesiapan Cawu ${imtihanMaster.cawu}`,
          `${imtihanStats.soalSiap}/${imtihanStats.totalSoal} Naskah`,
          `${imtihanStats.ruangCount} ruang ujian · ${imtihanStats.pesertaSusulan} susulan · ${imtihanStats.jadwalMengajarCount} jam · RAB ${formatRupiahFull(imtihanStats.totalRab)}`,
        ],
        [
          'BK, Kantin & PSB',
          'Ketertiban & Operasional',
          `${keamananPosStats.pelanggaranAktif} Pembinaan BK`,
          `${keamananPosStats.titipanMenunggu} titipan belum diambil · ${keamananPosStats.tamuCount} tamu · Kantin ${formatRupiahFull(keamananPosStats.totalJajan)}`,
        ],
      ],
      styles: { fontSize: 8.5, cellPadding: 2.8, textColor: [30, 41, 59] },
      headStyles: { fillColor: [11, 93, 59], textColor: 255, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 34, fontStyle: 'bold' },
        1: { cellWidth: 38 },
        2: { cellWidth: 42, fontStyle: 'bold' },
        3: { cellWidth: 'auto' },
      },
      theme: 'grid',
    });

    let nextY =
      ((doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? 115) + 7;

    if (canSeeFinance) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`Rincian Keuangan Periode ${activePeriod.key}`, 14, nextY);

      const financeRows =
        financeStats.txList.length > 0
          ? financeStats.txList.map((t) => [
              formatTanggalPendek(t.tanggal),
              t.tipe,
              t.kategori,
              t.uraian,
              formatRupiahFull(t.nominal),
            ])
          : (financeStats.selectedRekap?.kategoriList || []).map((k) => [
              activePeriod.key,
              k.status,
              k.nama,
              `Rencana ${formatRupiahFull(k.rencana)}`,
              formatRupiahFull(k.realisasi),
            ]);

      autoTable(doc, {
        startY: nextY + 3,
        head: [['Tanggal/Periode', 'Tipe', 'Kategori', 'Uraian', 'Nominal']],
        body: financeRows,
        styles: { fontSize: 8, cellPadding: 2.3 },
        headStyles: { fillColor: [184, 137, 59], textColor: 255, fontStyle: 'bold' },
        columnStyles: { 4: { halign: 'right', fontStyle: 'bold' } },
        theme: 'striped',
      });

      nextY =
        ((doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? nextY + 35) +
        7;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Agenda Kegiatan Pesantren', 14, nextY);

    autoTable(doc, {
      startY: nextY + 3,
      head: [['Nama Kegiatan', 'Tanggal', 'Lokasi', 'Penanggung Jawab', 'Status']],
      body: agendaKegiatan.map((a) => [
        a.nama,
        formatTanggalPendek(a.tanggal),
        a.lokasi,
        a.ketuaPanitia,
        a.status,
      ]),
      styles: { fontSize: 8, cellPadding: 2.3 },
      headStyles: { fillColor: [30, 41, 59], textColor: 255, fontStyle: 'bold' },
      theme: 'grid',
    });

    const finalY =
      ((doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? 220) +
      12;
    const signY = finalY > 258 ? 258 : finalY;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text('Mengetahui, Pengasuh Pondok', 42, signY, { align: 'center' });
    doc.text(`Karangdadap, ${formatTanggalPendek(todayStr)}`, 160, signY, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text('KH. Amin Maizun', 42, signY + 18, { align: 'center' });
    doc.text(currentUser.nama, 160, signY + 18, { align: 'center' });

    doc.save(`Laporan_Performa_PP_NU_Darussalam_${periodeSlug}.pdf`);
    addAuditLog(
      'Beranda',
      'Ekspor PDF',
      `Mencetak/mengunduh laporan performa GlobalDashboard periode ${activePeriod.key} format PDF.`
    );
    showToast(`Laporan PDF periode ${activePeriod.key} berhasil diunduh.`);
  };

  // Drag & Drop handlers for KPI Cards
  const handleKpiDrop = (targetId: KpiCardId) => {
    if (!draggingKpi || draggingKpi === targetId) {
      setDraggingKpi(null);
      setDragOverKpi(null);
      return;
    }
    const nextOrder = reorderList(kpiOrder, draggingKpi, targetId);
    setKpiOrder(nextOrder);
    persistLayout(nextOrder, summaryOrder);
    setDraggingKpi(null);
    setDragOverKpi(null);
    justDraggedRef.current = true;
    window.setTimeout(() => {
      justDraggedRef.current = false;
    }, 150);
  };

  const moveKpiByStep = (id: KpiCardId, direction: -1 | 1) => {
    const idx = kpiOrder.indexOf(id);
    const targetIdx = idx + direction;
    if (idx === -1 || targetIdx < 0 || targetIdx >= kpiOrder.length) return;
    const nextOrder = reorderList(kpiOrder, id, kpiOrder[targetIdx]);
    setKpiOrder(nextOrder);
    persistLayout(nextOrder, summaryOrder);
  };

  // Drag & Drop handlers for Summary Cards
  const handleSummaryDrop = (targetId: SummaryCardId) => {
    if (!draggingSummary || draggingSummary === targetId) {
      setDraggingSummary(null);
      setDragOverSummary(null);
      return;
    }
    const nextOrder = reorderList(summaryOrder, draggingSummary, targetId);
    setSummaryOrder(nextOrder);
    persistLayout(kpiOrder, nextOrder);
    setDraggingSummary(null);
    setDragOverSummary(null);
    justDraggedRef.current = true;
    window.setTimeout(() => {
      justDraggedRef.current = false;
    }, 150);
  };

  const moveSummaryByStep = (id: SummaryCardId, direction: -1 | 1) => {
    const idx = summaryOrder.indexOf(id);
    const targetIdx = idx + direction;
    if (idx === -1 || targetIdx < 0 || targetIdx >= summaryOrder.length) return;
    const nextOrder = reorderList(summaryOrder, id, summaryOrder[targetIdx]);
    setSummaryOrder(nextOrder);
    persistLayout(kpiOrder, nextOrder);
  };

  const renderKpiCard = (cardId: KpiCardId, index: number) => {
    const isDragging = draggingKpi === cardId;
    const isOver = dragOverKpi === cardId && draggingKpi !== cardId;

    const dragProps = {
      draggable: true,
      onDragStart: (e: React.DragEvent<HTMLDivElement>) => {
        setDraggingKpi(cardId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', cardId);
      },
      onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (draggingKpi && draggingKpi !== cardId) {
          e.dataTransfer.dropEffect = 'move';
          setDragOverKpi(cardId);
        }
      },
      onDragLeave: () => {
        if (dragOverKpi === cardId) setDragOverKpi(null);
      },
      onDrop: (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleKpiDrop(cardId);
      },
      onDragEnd: () => {
        setDraggingKpi(null);
        setDragOverKpi(null);
      },
    };

    const cardShellClass = `rounded-2xl bg-white p-5 border transition-all flex flex-col justify-between select-none ${
      isDragging
        ? 'opacity-45 border-dashed border-emerald-600 scale-[0.98]'
        : isOver
          ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/30'
          : reorderMode
            ? 'border-emerald-300 cursor-grab active:cursor-grabbing'
            : 'border-slate-200 hover:border-emerald-600 cursor-pointer'
    }`;

    const headerControls = (label: string, icon: React.ReactNode) => (
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            title="Seret kartu untuk mengatur prioritas"
            className="text-slate-300 hover:text-emerald-700 cursor-grab active:cursor-grabbing shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-semibold text-slate-500 truncate">{label}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {reorderMode && (
            <div className="flex items-center gap-0.5 mr-1" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveKpiByStep(cardId, -1)}
                title="Geser ke kiri"
                className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
              >
                <ArrowLeft className="w-3 h-3" />
              </button>
              <button
                type="button"
                disabled={index === kpiOrder.length - 1}
                onClick={() => moveKpiByStep(cardId, 1)}
                title="Geser ke kanan"
                className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
          {icon}
        </div>
      </div>
    );

    if (cardId === 'santri') {
      return (
        <div
          key={cardId}
          {...dragProps}
          onClick={() => navigate('sekretaris')}
          className={cardShellClass}
        >
          <div>
            {headerControls('Total Santri Aktif', <Users className="w-4 h-4 text-emerald-700 shrink-0" />)}
            <p className="text-2xl font-extrabold text-slate-900 mt-2 tabular-nums">
              {santriStats.totalAktif.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-slate-600 mt-1 tabular-nums">
              {santriStats.putra} Putra · {santriStats.putri} Putri · {santriStats.asatidzCount} Asatidz
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-800 font-semibold">
              {santriStats.psbMenunggu > 0
                ? `${santriStats.psbMenunggu} pendaftar PSB menanti`
                : `${santriStats.kamarCount} unit ruang & asrama`}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          </div>
        </div>
      );
    }

    if (cardId === 'kas') {
      return (
        <div
          key={cardId}
          {...dragProps}
          onClick={() => navigate(canSeeFinance ? 'bendahara' : 'imtihan')}
          className={cardShellClass}
        >
          {canSeeFinance ? (
            <>
              <div>
                {headerControls(
                  `Sisa Kas (${activePeriod.bulan.slice(0, 3)} ${activePeriod.tahun})`,
                  <Wallet className="w-4 h-4 text-emerald-700 shrink-0" />
                )}
                <p
                  className={`text-2xl font-extrabold mt-2 tabular-nums whitespace-nowrap ${
                    financeStats.sisaKasBulanIni >= 0 ? 'text-slate-900' : 'text-rose-700'
                  }`}
                >
                  {formatRupiahShort(financeStats.sisaKasBulanIni)}
                </p>
                <p className="text-xs text-slate-600 mt-1 tabular-nums">
                  Masuk {formatRupiahShort(financeStats.masuk)} · Keluar {formatRupiahShort(financeStats.keluar)}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-800 font-semibold tabular-nums">
                  {financeStats.bisyarohSiapCount > 0
                    ? `${financeStats.bisyarohSiapCount} bisyaroh siap cair`
                    : `Realisasi anggaran ${financeStats.persentaseRealisasi}%`}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              </div>
            </>
          ) : (
            <>
              <div>
                {headerControls('Sisa Kas Bulan Ini', <Lock className="w-4 h-4 text-slate-400 shrink-0" />)}
                <p className="text-lg font-bold text-slate-800 mt-2">Terbatas (Bendahara)</p>
                <p className="text-xs text-slate-500 mt-1">
                  Detail arus kas khusus Pengasuh &amp; Bendahara.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-800 font-semibold tabular-nums">
                  {rabImtihan.length} pos RAB Imtihan aktif
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              </div>
            </>
          )}
        </div>
      );
    }

    if (cardId === 'agenda') {
      return (
        <div
          key={cardId}
          {...dragProps}
          onClick={() => navigate('kemahadiyahan')}
          className={cardShellClass}
        >
          <div>
            {headerControls(
              'Agenda Kegiatan Mendesak',
              <CalendarClock className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            {agendaStats.urgentNearest ? (
              <>
                <p className="text-base font-extrabold text-slate-900 mt-2 line-clamp-1">
                  {agendaStats.urgentNearest.nama}
                </p>
                <p className="text-xs text-slate-600 mt-1 tabular-nums">
                  {formatTanggalPendek(agendaStats.urgentNearest.tanggal)} ·{' '}
                  {agendaStats.urgentNearest.diffDays <= 0
                    ? 'Sedang Berlangsung'
                    : `H-${agendaStats.urgentNearest.diffDays} hari`}
                </p>
              </>
            ) : (
              <>
                <p className="text-base font-extrabold text-slate-900 mt-2">Tidak Ada Agenda Aktif</p>
                <p className="text-xs text-slate-500 mt-1">Semua agenda kegiatan telah selesai</p>
              </>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-amber-700 font-semibold tabular-nums">
              {agendaStats.urgentCount} agenda aktif · {agendaStats.kotakMenungguCount} persetujuan
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          </div>
        </div>
      );
    }

    return (
      <div
        key={cardId}
        {...dragProps}
        onClick={() => navigate('maarifan')}
        className={cardShellClass}
      >
        <div>
          {headerControls(
            'Kehadiran Santri Hari Ini',
            <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          )}
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {attendanceStats.totalTercatat > 0 ? `${attendanceStats.persentaseHadir}%` : '0%'}
            </p>
            <span className="text-xs text-slate-500 tabular-nums">
              ({attendanceStats.hadir}/{attendanceStats.totalTercatat} tercatat)
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 tabular-nums">
            H {attendanceStats.hadir} · I {attendanceStats.izin} · S {attendanceStats.sakit} · A {attendanceStats.alpa}
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-emerald-800 font-semibold tabular-nums">
            {attendanceStats.isTodayData
              ? `${attendanceStats.sessionCount} sesi hari ini · ${attendanceStats.guruHadir}/${attendanceStats.guruTotal} guru hadir`
              : `Sesi terakhir ${formatTanggalPendek(attendanceStats.targetDate)} · Input hari ini`}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        </div>
      </div>
    );
  };

  const renderSummaryCard = (cardId: SummaryCardId, index: number) => {
    const isDragging = draggingSummary === cardId;
    const isOver = dragOverSummary === cardId && draggingSummary !== cardId;

    const dragProps = {
      draggable: true,
      onDragStart: (e: React.DragEvent<HTMLDivElement>) => {
        setDraggingSummary(cardId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', cardId);
      },
      onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (draggingSummary && draggingSummary !== cardId) {
          e.dataTransfer.dropEffect = 'move';
          setDragOverSummary(cardId);
        }
      },
      onDragLeave: () => {
        if (dragOverSummary === cardId) setDragOverSummary(null);
      },
      onDrop: (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleSummaryDrop(cardId);
      },
      onDragEnd: () => {
        setDraggingSummary(null);
        setDragOverSummary(null);
      },
    };

    const shellClass = `rounded-2xl bg-white p-5 border flex flex-col justify-between transition-all ${
      isDragging
        ? 'opacity-45 border-dashed border-emerald-600 scale-[0.98]'
        : isOver
          ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/30'
          : reorderMode
            ? 'border-emerald-300 cursor-grab active:cursor-grabbing'
            : 'border-slate-200'
    }`;

    const renderReorderHandle = () => (
      <div className="flex items-center gap-1 shrink-0">
        {reorderMode && (
          <div className="flex items-center gap-0.5 mr-1">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => moveSummaryByStep(cardId, -1)}
              title="Geser ke kiri"
              className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
            >
              <ArrowLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              disabled={index === summaryOrder.length - 1}
              onClick={() => moveSummaryByStep(cardId, 1)}
              title="Geser ke kanan"
              className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
            >
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
        <span
          title="Seret kartu untuk menyusun ulang"
          className="text-slate-300 hover:text-emerald-700 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </span>
      </div>
    );

    if (cardId === 'agenda_surat') {
      return (
        <div key={cardId} {...dragProps} className={shellClass}>
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                <h3 className="text-xs font-bold text-slate-900 truncate">
                  Agenda &amp; Tindak Lanjut Mendesak
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-500 tabular-nums">
                  {agendaStats.kotakMenungguCount + agendaStats.suratMenungguCount} item
                </span>
                {renderReorderHandle()}
              </div>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {agendaStats.activeAgendas.slice(0, 2).map((ag) => (
                <div
                  key={ag.id}
                  onClick={() => navigate('kemahadiyahan')}
                  className="py-2.5 cursor-pointer hover:bg-slate-50/80 transition flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{ag.nama}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {ag.lokasi} · {ag.ketuaPanitia}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-bold shrink-0 tabular-nums ${
                      ag.status === 'Berjalan' ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {ag.status === 'Berjalan' ? 'Berjalan' : formatTanggalPendek(ag.tanggal)}
                  </span>
                </div>
              ))}

              {agendaStats.kotakMenunggu.slice(0, 2).map((km) => (
                <div
                  key={km.id}
                  onClick={() => navigate(km.linkTab)}
                  className="py-2.5 cursor-pointer hover:bg-slate-50/80 transition flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{km.judul}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {km.modul} · {km.pengirim}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-rose-700 shrink-0">Menunggu</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 tabular-nums">
              {agendaStats.suratMenungguCount} surat menunggu TTD
            </span>
            <button
              type="button"
              onClick={() => navigate('sekretaris')}
              className="font-bold text-emerald-800 hover:underline whitespace-nowrap shrink-0"
            >
              Buka Sekretariat →
            </button>
          </div>
        </div>
      );
    }

    if (cardId === 'imtihan_diniyah') {
      return (
        <div key={cardId} {...dragProps} className={shellClass}>
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <h3 className="text-xs font-bold text-slate-900 truncate">
                  Kesiapan Imtihan &amp; Diniyah
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-emerald-800 font-semibold tabular-nums">
                  Cawu {imtihanMaster.cawu}
                </span>
                {renderReorderHandle()}
              </div>
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">Naskah Soal Disetujui</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {imtihanStats.soalSiap} / {imtihanStats.totalSoal} naskah
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-700 rounded-full transition-all"
                    style={{
                      width: `${
                        imtihanStats.totalSoal > 0
                          ? Math.round((imtihanStats.soalSiap / imtihanStats.totalSoal) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">Kehadiran Guru Mengajar</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {attendanceStats.guruHadir} / {attendanceStats.guruTotal} sesi
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{
                      width: `${
                        attendanceStats.guruTotal > 0
                          ? Math.round((attendanceStats.guruHadir / attendanceStats.guruTotal) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Ruang Ujian</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {imtihanStats.ruangCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Peserta Susulan</span>
                  <span className="font-bold text-amber-700 tabular-nums">
                    {imtihanStats.pesertaSusulan}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Plot Jadwal Guru</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {imtihanStats.jadwalMengajarCount} jam
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">RAB Imtihan</span>
                  <span className="font-bold text-emerald-800 tabular-nums">
                    {formatRupiahShort(imtihanStats.totalRab)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => navigate('maarifan')}
              className="font-semibold text-slate-700 hover:text-emerald-800 flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ma&apos;arifan</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('imtihan')}
              className="font-bold text-emerald-800 hover:underline whitespace-nowrap shrink-0"
            >
              Kelola Imtihan →
            </button>
          </div>
        </div>
      );
    }

    return (
      <div key={cardId} {...dragProps} className={shellClass}>
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0" />
              <h3 className="text-xs font-bold text-slate-900 truncate">
                Ketertiban, Kantin &amp; PSB
              </h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-500">Operasional</span>
              {renderReorderHandle()}
            </div>
          </div>

          <div className="divide-y divide-slate-100 mt-1 text-xs">
            <div
              onClick={() => navigate('bk')}
              className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition"
            >
              <span className="text-slate-600">Kasus Pembinaan BK Aktif</span>
              <span
                className={`font-bold tabular-nums ${
                  keamananPosStats.pelanggaranAktif > 0 ? 'text-rose-700' : 'text-emerald-700'
                }`}
              >
                {keamananPosStats.pelanggaranAktif} santri
              </span>
            </div>

            <div
              onClick={() => navigate('bk')}
              className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition"
            >
              <span className="text-slate-600">Titipan Wali Belum Diambil</span>
              <span className="font-bold text-amber-700 tabular-nums">
                {keamananPosStats.titipanMenunggu} paket · {keamananPosStats.tamuCount} tamu
              </span>
            </div>

            <div
              onClick={() => navigate('transaksi')}
              className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition"
            >
              <span className="text-slate-600 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                <span>Perputaran Kantin / Kartu</span>
              </span>
              <span className="font-bold text-slate-900 tabular-nums">
                {formatRupiahShort(keamananPosStats.totalJajan)} ({santriStats.kartuTerblokir} blokir)
              </span>
            </div>

            <div
              onClick={() => navigate('psb')}
              className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition"
            >
              <span className="text-slate-600 flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5 text-slate-400" />
                <span>Pendaftar PSB Masuk</span>
              </span>
              <span className="font-bold text-emerald-800 tabular-nums">
                {psbList.length} total ({santriStats.psbMenunggu} proses)
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => navigate('transaksi')}
            className="font-semibold text-slate-700 hover:text-emerald-800 whitespace-nowrap shrink-0"
          >
            Kasir POS
          </button>
          <button
            type="button"
            onClick={() => navigate('bk')}
            className="font-bold text-emerald-800 hover:underline whitespace-nowrap shrink-0"
          >
            Pantau Keamanan →
          </button>
        </div>
      </div>
    );
  };

  return (
    <section aria-label="Ringkasan Performa Pesantren Real-Time" className="space-y-4">
      {/* Section Header + Toolbar Ekspor & Susun Kartu */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Ringkasan Performa Pesantren Real-Time
          </h2>
          <p className="text-xs text-slate-500">
            Konsolidasi lintas modul · Tahun Ajaran {currentTahunAjaran} · Diperbarui pukul {lastRefreshed} WIB · Seret kartu untuk ubah prioritas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          {/* Pemilih Bulan Laporan */}
          <select
            aria-label="Pilih bulan laporan performa"
            value={activePeriod.key}
            onChange={(e) => setSelectedPeriodKey(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-emerald-600"
          >
            {periodOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                Periode: {opt.key}
              </option>
            ))}
          </select>

          {/* Toggle Mode Susun / Drag Helper */}
          <button
            type="button"
            onClick={() => setReorderMode((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition whitespace-nowrap shrink-0 ${
              reorderMode
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <MoveHorizontal className="w-3.5 h-3.5" />
            <span>{reorderMode ? 'Selesai Susun' : 'Susun Kartu'}</span>
          </button>

          {isCustomLayout && (
            <button
              type="button"
              onClick={handleResetLayout}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition whitespace-nowrap shrink-0"
              title="Kembalikan posisi kartu ke urutan awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Urutan</span>
            </button>
          )}

          {/* Ekspor Excel */}
          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-700/30 bg-emerald-50 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition whitespace-nowrap shrink-0"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Ekspor Excel</span>
          </button>

          {/* Ekspor PDF */}
          <button
            type="button"
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 text-xs font-bold text-white hover:bg-emerald-900 transition whitespace-nowrap shrink-0"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Ekspor PDF</span>
          </button>

          {/* Segarkan */}
          <button
            type="button"
            onClick={() => {
              setLastRefreshed(
                new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              );
              showToast('Data ringkasan lintas modul telah disegarkan.');
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition whitespace-nowrap shrink-0"
            title="Segarkan waktu pembaruan ringkasan"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
          </button>
        </div>
      </div>

      {/* Inline Feedback Notice */}
      {exportNotice && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-900">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{exportNotice}</span>
          </span>
          <button
            type="button"
            onClick={() => setExportNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 text-[11px] font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 4 Kartu KPI Utama Real-Time (Draggable & Drop-to-Reorder) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiOrder.map((cardId, idx) => renderKpiCard(cardId, idx))}
      </div>

      {/* Baris Ringkasan Lintas Modul (3 Kartu Draggable & Drop-to-Reorder) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {summaryOrder.map((cardId, idx) => renderSummaryCard(cardId, idx))}
      </div>
    </section>
  );
};
