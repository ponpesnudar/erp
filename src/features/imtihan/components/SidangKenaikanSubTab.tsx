import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BellRing,
  CalendarClock,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  History,
  Layers,
  Lock,
  Printer,
  Save,
  Scale,
  Search,
  Send,
  ShieldCheck,
  Table2,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  useAppStore,
  type SidangJadwalInfo,
  type SidangKenaikanRecord,
} from '../../../lib/store.ts';
import { useAuth } from '../../../lib/auth.ts';
import { DAFTAR_KELAS_DINIYAH } from '../../../data/seed/pondokData.ts';
import { triggerReliablePrint } from '../../../lib/printHelper.ts';
import { PrintOrientationControl } from '../../../components/common/PrintOrientationControl.tsx';
import { PrintKopPondok } from '../../../components/common/PrintKopPondok.tsx';
import {
  evaluateAllSidangKenaikan,
  isSidangNotifyRole,
  type EvaluatedSidangRow,
} from '../../../lib/sidangKenaikanHelper.ts';

function sortClassesCanonical(classes: string[]): string[] {
  const orderMap = new Map<string, number>(DAFTAR_KELAS_DINIYAH.map((c, i) => [c, i]));
  return [...classes].sort((a, b) => {
    const ia = orderMap.has(a) ? orderMap.get(a)! : 999;
    const ib = orderMap.has(b) ? orderMap.get(b)! : 999;
    return ia !== ib ? ia - ib : a.localeCompare(b);
  });
}

type SidangViewTab = 'per_kelas' | 'rekapan_semua' | 'riwayat_sidang';
type SidangStatusFilter =
  | 'semua'
  | 'belum_sidang'
  | 'naik'
  | 'naik_bersyarat'
  | 'tidak_naik'
  | 'bawah_kkm';

export const SidangKenaikanSubTab: React.FC = () => {
  const {
    santriList,
    nilaiList,
    absensiSessions,
    sidangKenaikanRecords,
    sidangKenaikanHistory,
    sidangJadwal,
    sidangKkm,
    setSidangKkm,
    updateSidangJadwal,
    upsertSidangKenaikan,
    addAuditLog,
    currentTahunAjaran,
    imtihanMaster,
    printOrientation,
  } = useAppStore();

  const { currentUser, effectiveRole } = useAuth();
  const printRef = useRef<HTMLDivElement | null>(null);

  // Roles allowed to edit Cawu 1 & 2 averages, KKM, & render council promotion verdict:
  // Administrator (admin_sistem), Ketua Panitia/Imtihan (ketua_imtihan), Pengasuh, Manager Waktu / Kepala Madin (kepala_madin)
  const canEditImtihanValues =
    effectiveRole === 'admin_sistem' || effectiveRole === 'ketua_imtihan';
  const canDecideSidang = isSidangNotifyRole(effectiveRole);

  const uniqueClasses = useMemo(
    () => sortClassesCanonical(Array.from(new Set(santriList.map((s) => s.kelas)))),
    [santriList]
  );

  const [viewTab, setViewTab] = useState<SidangViewTab>('per_kelas');
  const [selectedKelas, setSelectedKelas] = useState<string>(uniqueClasses[0] || '2 A PUTRA');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<SidangStatusFilter>('semua');
  const [recapKelasFilter, setRecapKelasFilter] = useState<string>('SEMUA');
  const [recapFilterMode, setRecapFilterMode] = useState<SidangStatusFilter>('bawah_kkm');
  const [historySearch, setHistorySearch] = useState<string>('');
  const [historyFilter, setHistoryFilter] = useState<
    | 'semua'
    | 'keputusan'
    | 'bawah_kkm'
    | 'belum_sidang'
    | 'naik'
    | 'naik_bersyarat'
    | 'tidak_naik'
  >('semua');
  const [showSchedulePanel, setShowSchedulePanel] = useState<boolean>(false);
  const [toast, setToast] = useState<string>('');

  const [jadwalDraft, setJadwalDraft] = useState<SidangJadwalInfo>(sidangJadwal);

  useEffect(() => {
    setJadwalDraft(sidangJadwal);
  }, [sidangJadwal]);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 4500);
  };

  // Global evaluation across all santri & classes
  const sidangEval = useMemo(
    () =>
      evaluateAllSidangKenaikan({
        santriList,
        nilaiList,
        absensiSessions,
        sidangKenaikanRecords,
        sidangKkm,
      }),
    [santriList, nilaiList, absensiSessions, sidangKenaikanRecords, sidangKkm]
  );

  // Per-class rows
  const rows = useMemo(
    () => sidangEval.rows.filter((r) => r.kelas === selectedKelas),
    [sidangEval.rows, selectedKelas]
  );

  const matchesSidangStatus = (
    r: EvaluatedSidangRow,
    mode: SidangStatusFilter
  ): boolean => {
    if (mode === 'belum_sidang') return r.rec.keputusan === 'Belum Diputuskan';
    if (mode === 'naik') return r.rec.keputusan === 'Naik Kelas';
    if (mode === 'naik_bersyarat') return r.rec.keputusan === 'Naik Bersyarat';
    if (mode === 'tidak_naik') return r.rec.keputusan === 'Tidak Naik';
    if (mode === 'bawah_kkm') return r.diBawahKkm;
    return true;
  };

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (
        searchQuery &&
        !r.nama.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !r.nis.includes(searchQuery)
      ) {
        return false;
      }
      return matchesSidangStatus(r, statusFilter);
    });
  }, [rows, searchQuery, statusFilter]);

  const summaryStats = useMemo(() => {
    const total = rows.length;
    const belowKkm = rows.filter((r) => r.diBawahKkm).length;
    const belumSidang = rows.filter((r) => r.rec.keputusan === 'Belum Diputuskan').length;
    const naik = rows.filter((r) => r.rec.keputusan === 'Naik Kelas').length;
    const bersyarat = rows.filter((r) => r.rec.keputusan === 'Naik Bersyarat').length;
    const tidakNaik = rows.filter((r) => r.rec.keputusan === 'Tidak Naik').length;
    return { total, belowKkm, belumSidang, naik, bersyarat, tidakNaik };
  }, [rows]);

  // Global KPI stats across all classes
  const globalStats = useMemo(() => {
    const all = sidangEval.rows;
    return {
      total: all.length,
      belowKkm: sidangEval.belowKkmRows.length,
      pendingBelowKkm: sidangEval.pendingBelowKkmRows.length,
      belumSidang: all.filter((r) => r.rec.keputusan === 'Belum Diputuskan').length,
      naik: all.filter((r) => r.rec.keputusan === 'Naik Kelas').length,
      bersyarat: all.filter((r) => r.rec.keputusan === 'Naik Bersyarat').length,
      tidakNaik: all.filter((r) => r.rec.keputusan === 'Tidak Naik').length,
    };
  }, [sidangEval]);

  // Cross-class filtered rows for "Rekapan Semua Kelas"
  const recapRows = useMemo(() => {
    return sidangEval.rows.filter((r) => {
      if (recapKelasFilter !== 'SEMUA' && r.kelas !== recapKelasFilter) return false;
      if (
        searchQuery &&
        !r.nama.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !r.nis.includes(searchQuery) &&
        !r.kelas.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return matchesSidangStatus(r, recapFilterMode);
    });
  }, [sidangEval.rows, recapKelasFilter, searchQuery, recapFilterMode]);

  // Filtered history entries for "Riwayat / History Sidang"
  const filteredHistory = useMemo(() => {
    const q = historySearch.trim().toLowerCase();
    return sidangKenaikanHistory.filter((h) => {
      if (
        q &&
        !h.santriNama.toLowerCase().includes(q) &&
        !h.santriNis.toLowerCase().includes(q) &&
        !h.kelas.toLowerCase().includes(q) &&
        !h.oleh.toLowerCase().includes(q) &&
        !(h.catatan || '').toLowerCase().includes(q)
      ) {
        return false;
      }
      if (historyFilter === 'keputusan') {
        return h.keputusanBaru !== 'Belum Diputuskan';
      }
      if (historyFilter === 'belum_sidang') {
        return h.keputusanBaru === 'Belum Diputuskan';
      }
      if (historyFilter === 'naik') {
        return h.keputusanBaru === 'Naik Kelas';
      }
      if (historyFilter === 'naik_bersyarat') {
        return h.keputusanBaru === 'Naik Bersyarat';
      }
      if (historyFilter === 'tidak_naik') {
        return h.keputusanBaru === 'Tidak Naik';
      }
      if (historyFilter === 'bawah_kkm') {
        return h.nilaiAkhir < h.kkm;
      }
      return true;
    });
  }, [sidangKenaikanHistory, historySearch, historyFilter]);

  const updateRowField = (
    row: EvaluatedSidangRow,
    patch: Partial<SidangKenaikanRecord>
  ) => {
    upsertSidangKenaikan(
      {
        ...row.rec,
        ...patch,
        diputuskanOleh: currentUser.nama,
      },
      {
        santriNama: row.nama,
        santriNis: row.nis,
        kelas: row.kelas,
        nilaiAkhir: row.nilaiAkhir,
      }
    );
  };

  const handleAutoApproveAboveKkm = () => {
    if (!canDecideSidang) return;
    let count = 0;
    rows.forEach((r) => {
      if (!r.diBawahKkm && r.rec.keputusan === 'Belum Diputuskan') {
        upsertSidangKenaikan(
          {
            ...r.rec,
            keputusan: 'Naik Kelas',
            diputuskanOleh: currentUser.nama,
          },
          {
            santriNama: r.nama,
            santriNis: r.nis,
            kelas: r.kelas,
            nilaiAkhir: r.nilaiAkhir,
          }
        );
        count += 1;
      }
    });
    notify(
      count > 0
        ? `${count} santri di atas KKM (${sidangKkm}) ditetapkan Naik Kelas & tercatat di riwayat sidang.`
        : 'Semua santri di atas KKM pada kelas ini sudah memiliki keputusan.'
    );
  };

  const handleSaveJadwalAndNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canDecideSidang) return;
    const targetCount =
      sidangEval.pendingBelowKkmRows.length > 0
        ? sidangEval.pendingBelowKkmRows.length
        : sidangEval.belowKkmRows.length;
    updateSidangJadwal(
      {
        ...jadwalDraft,
        statusJadwal:
          jadwalDraft.statusJadwal === 'Belum Dijadwalkan'
            ? 'Dijadwalkan'
            : jadwalDraft.statusJadwal,
      },
      targetCount
    );
    setShowSchedulePanel(false);
    notify(
      `Jadwal Sidang Kenaikan disimpan & notifikasi resmi dikirim ke Manager Waktu, Admin, Ketua Panitia, dan Pengasuh.`
    );
  };

  const handleDownloadPdfSidang = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    doc.setFillColor(7, 67, 42);
    doc.rect(12, 10, 273, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('PONDOK PESANTREN NU DARUSSALAM KARANGDADAP — PEKALONGAN', 16, 17.5);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `BERITA ACARA SIDANG KENAIKAN KELAS · KELAS ${selectedKelas} · T.A. ${currentTahunAjaran}`,
      16,
      23.5
    );
    doc.text(
      `KKM Panitia: ${sidangKkm} · Absensi: Sakit (0), Bolos (-3/kejadian) · Dicetak: ${new Date().toLocaleDateString('id-ID')}`,
      16,
      28.5
    );

    autoTable(doc, {
      startY: 37,
      head: [
        [
          'No',
          'NIS',
          'Nama Santri',
          'Cawu 1',
          'Cawu 2',
          'Rata Imtihan',
          'Sakit (0)',
          'Bolos (-3)',
          'Ubudiyah',
          'Amaliyah',
          'MQK',
          'Total',
          'Nilai Akhir',
          'Keputusan Sidang',
        ],
      ],
      body: filteredRows.map((r, i) => [
        String(i + 1),
        r.nis,
        r.nama,
        String(r.rec.rataCawu1),
        String(r.rec.rataCawu2),
        String(r.rataImtihan),
        String(r.rec.sakitCount),
        `${r.rec.bolosCount} (${r.poinAbsensi})`,
        String(r.rec.nilaiUbudiyah),
        String(r.rec.nilaiAmaliyah),
        String(r.rec.nilaiMqk),
        String(r.totalPoin),
        `${r.nilaiAkhir}${r.diBawahKkm ? ' (<KKM)' : ''}`,
        r.rec.keputusan,
      ]),
      styles: { fontSize: 7.5, cellPadding: 2 },
      headStyles: { fillColor: [7, 67, 42], textColor: 255, fontStyle: 'bold', halign: 'center' },
      columnStyles: {
        0: { halign: 'center', cellWidth: 8 },
        3: { halign: 'center' },
        4: { halign: 'center' },
        5: { halign: 'center', fontStyle: 'bold' },
        6: { halign: 'center' },
        7: { halign: 'center' },
        8: { halign: 'center' },
        9: { halign: 'center' },
        10: { halign: 'center' },
        11: { halign: 'center', fontStyle: 'bold' },
        12: { halign: 'center', fontStyle: 'bold' },
        13: { halign: 'center', fontStyle: 'bold' },
      },
      margin: { left: 12, right: 12 },
    });

    const finalY =
      (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 140;
    const signY = Math.min(176, finalY + 11);
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Pengasuh Pondok Pesantren', 20, signY);
    doc.setFont('helvetica', 'bold');
    doc.text('KH. Amin Maizun', 20, signY + 15);

    doc.setFont('helvetica', 'normal');
    doc.text('Ketua Panitia Imtihan', 100, signY);
    doc.setFont('helvetica', 'bold');
    doc.text(imtihanMaster.ketuaImtihanNama || 'Ust. Nidhomul Muna Lana', 100, signY + 15);

    doc.setFont('helvetica', 'normal');
    doc.text('Manager Waktu / Kepala Madin', 180, signY);
    doc.setFont('helvetica', 'bold');
    doc.text('Ust. H Zaenal Arifin', 180, signY + 15);

    doc.setFont('helvetica', 'normal');
    doc.text('Administrator Sistem', 245, signY);
    doc.setFont('helvetica', 'bold');
    doc.text(currentUser.nama, 245, signY + 15);

    doc.save(`Sidang-Kenaikan-${selectedKelas.replace(/\s+/g, '-')}.pdf`);
    notify(`PDF Berita Acara Sidang Kenaikan (${selectedKelas}) berhasil diunduh.`);
  };

  const handleDownloadPdfRekapanSemua = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    doc.setFillColor(7, 67, 42);
    doc.rect(12, 10, 273, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('PONDOK PESANTREN NU DARUSSALAM KARANGDADAP — PEKALONGAN', 16, 17.5);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `REKAPAN LINTAS KELAS SIDANG KENAIKAN · T.A. ${currentTahunAjaran} · KKM ${sidangKkm}`,
      16,
      23.5
    );
    doc.text(
      `Total Santri: ${globalStats.total} · Di Bawah KKM: ${globalStats.belowKkm} (${globalStats.pendingBelowKkm} Belum Diputuskan) · Dicetak: ${new Date().toLocaleDateString('id-ID')}`,
      16,
      28.5
    );

    autoTable(doc, {
      startY: 36,
      head: [
        [
          'Kelas Diniyah',
          'Total Santri',
          '< KKM ' + sidangKkm,
          'Naik Kelas',
          'Naik Bersyarat',
          'Tidak Naik',
          'Belum Diputuskan',
        ],
      ],
      body: sidangEval.classSummaries.map((c) => [
        c.kelas,
        String(c.total),
        String(c.belowKkm),
        String(c.naik),
        String(c.bersyarat),
        String(c.tidakNaik),
        String(c.belumDiputuskan),
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [7, 67, 42], textColor: 255, fontStyle: 'bold', halign: 'center' },
      columnStyles: {
        1: { halign: 'center' },
        2: { halign: 'center', fontStyle: 'bold' },
        3: { halign: 'center' },
        4: { halign: 'center' },
        5: { halign: 'center' },
        6: { halign: 'center' },
      },
      margin: { left: 12, right: 12 },
    });

    const afterSummaryY =
      ((doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 95) + 7;

    autoTable(doc, {
      startY: afterSummaryY,
      head: [
        [
          'No',
          'Kelas',
          'NIS',
          'Nama Santri',
          'Rata Imtihan',
          'Bolos',
          'Ubudiyah/Amaliyah/MQK',
          'Nilai Akhir',
          'Keputusan Sidang',
          'Catatan',
        ],
      ],
      body: recapRows.map((r, i) => [
        String(i + 1),
        r.kelas,
        r.nis,
        r.nama,
        String(r.rataImtihan),
        `${r.rec.bolosCount} (${r.poinAbsensi})`,
        `${r.rec.nilaiUbudiyah}/${r.rec.nilaiAmaliyah}/${r.rec.nilaiMqk}`,
        `${r.nilaiAkhir}${r.diBawahKkm ? ' (<KKM)' : ''}`,
        r.rec.keputusan,
        r.rec.catatanSidang || '-',
      ]),
      styles: { fontSize: 7.5, cellPadding: 1.8 },
      headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold', halign: 'center' },
      columnStyles: {
        0: { halign: 'center', cellWidth: 8 },
        4: { halign: 'center' },
        5: { halign: 'center' },
        6: { halign: 'center' },
        7: { halign: 'center', fontStyle: 'bold' },
        8: { halign: 'center', fontStyle: 'bold' },
      },
      margin: { left: 12, right: 12 },
    });

    doc.save(`Rekapan-Sidang-Kenaikan-Semua-Kelas.pdf`);
    notify('PDF Rekapan Sidang Kenaikan Semua Kelas berhasil diunduh.');
  };

  const handleDownloadPdfRiwayat = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    doc.setFillColor(7, 67, 42);
    doc.rect(12, 10, 273, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('PONDOK PESANTREN NU DARUSSALAM KARANGDADAP — PEKALONGAN', 16, 17.5);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `RIWAYAT & LOG KEPUTUSAN SIDANG KENAIKAN KELAS · T.A. ${currentTahunAjaran}`,
      16,
      23.5
    );
    doc.text(
      `Total Entri Riwayat: ${filteredHistory.length} · Dicetak: ${new Date().toLocaleDateString('id-ID')}`,
      16,
      28.5
    );

    autoTable(doc, {
      startY: 36,
      head: [
        [
          'No',
          'Waktu Sidang',
          'Kelas',
          'Santri & NIS',
          'Nilai / KKM',
          'Keputusan Sebelumnya',
          'Keputusan Baru',
          'Petugas & Peran',
          'Catatan Sidang',
        ],
      ],
      body: filteredHistory.map((h, i) => [
        String(i + 1),
        h.waktu,
        h.kelas,
        `${h.santriNama} (${h.santriNis})`,
        `${h.nilaiAkhir} / ${h.kkm}`,
        h.keputusanSebelumnya,
        h.keputusanBaru,
        `${h.oleh} (${h.peranOleh})`,
        h.catatan || '-',
      ]),
      styles: { fontSize: 7.5, cellPadding: 2 },
      headStyles: { fillColor: [7, 67, 42], textColor: 255, fontStyle: 'bold', halign: 'center' },
      columnStyles: {
        0: { halign: 'center', cellWidth: 8 },
        4: { halign: 'center', fontStyle: 'bold' },
        5: { halign: 'center' },
        6: { halign: 'center', fontStyle: 'bold' },
      },
      margin: { left: 12, right: 12 },
    });

    doc.save(`Riwayat-Sidang-Kenaikan-Kelas.pdf`);
    addAuditLog(
      'Imtihan',
      'Ekspor PDF Riwayat Sidang',
      `Mengunduh arsip PDF riwayat keputusan Sidang Kenaikan (${filteredHistory.length} entri).`
    );
    notify('PDF Riwayat Keputusan Sidang Kenaikan berhasil diunduh.');
  };

  // EXCEL EXPORTS (.xlsx)
  const buildSantriExcelRows = (sourceRows: EvaluatedSidangRow[]) =>
    sourceRows.map((r, idx) => ({
      No: idx + 1,
      Kelas: r.kelas,
      NIS: r.nis,
      'Nama Santri': r.nama,
      'Rata Cawu 1': r.rec.rataCawu1,
      'Rata Cawu 2': r.rec.rataCawu2,
      'Rata Imtihan': r.rataImtihan,
      'Sakit (0 pt)': r.rec.sakitCount,
      'Bolos (-3 pt)': r.rec.bolosCount,
      'Poin Absensi': r.poinAbsensi,
      Ubudiyah: r.rec.nilaiUbudiyah,
      Amaliyah: r.rec.nilaiAmaliyah,
      MQK: r.rec.nilaiMqk,
      'Total Poin': r.totalPoin,
      'Nilai Akhir': r.nilaiAkhir,
      'KKM Panitia': sidangKkm,
      'Status KKM': r.diBawahKkm ? `Di Bawah KKM (< ${sidangKkm})` : 'Tuntas KKM',
      'Status / Keputusan Sidang':
        r.rec.keputusan === 'Belum Diputuskan' ? 'Belum Sidang' : r.rec.keputusan,
      'Catatan Sidang': r.rec.catatanSidang || '-',
      'Diputuskan Oleh': r.rec.diputuskanOleh || '-',
    }));

  const buildHistoryExcelRows = () =>
    filteredHistory.map((h, idx) => ({
      No: idx + 1,
      'Waktu Sidang': h.waktu,
      Kelas: h.kelas,
      NIS: h.santriNis,
      'Nama Santri': h.santriNama,
      'Nilai Akhir': h.nilaiAkhir,
      'KKM Panitia': h.kkm,
      'Status Nilai': h.nilaiAkhir < h.kkm ? 'Di Bawah KKM' : 'Tuntas KKM',
      'Keputusan Sebelumnya':
        h.keputusanSebelumnya === 'Belum Diputuskan' ? 'Belum Sidang' : h.keputusanSebelumnya,
      'Keputusan Baru':
        h.keputusanBaru === 'Belum Diputuskan' ? 'Belum Sidang' : h.keputusanBaru,
      'Diputuskan Oleh': h.oleh,
      'Peran Pejabat': h.peranOleh,
      'Catatan Sidang': h.catatan || '-',
    }));

  const handleDownloadExcelPerKelas = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(buildSantriExcelRows(filteredRows));
    ws['!cols'] = [
      { wch: 5 },
      { wch: 14 },
      { wch: 12 },
      { wch: 28 },
      { wch: 12 },
      { wch: 12 },
      { wch: 13 },
      { wch: 11 },
      { wch: 11 },
      { wch: 12 },
      { wch: 10 },
      { wch: 10 },
      { wch: 8 },
      { wch: 11 },
      { wch: 11 },
      { wch: 11 },
      { wch: 20 },
      { wch: 22 },
      { wch: 30 },
      { wch: 24 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Sidang_Per_Kelas');

    const safeKelas = selectedKelas.replace(/[^\w-]+/g, '-');
    XLSX.writeFile(wb, `Sidang-Kenaikan-${safeKelas}.xlsx`);
    addAuditLog(
      'Imtihan',
      'Ekspor Excel Sidang Kelas',
      `Mengunduh arsip Excel Sidang Kenaikan Kelas ${selectedKelas} (${filteredRows.length} santri).`
    );
    notify(`File Excel Sidang Kenaikan (${selectedKelas}) berhasil diunduh.`);
  };

  const handleDownloadExcelRekapanSemua = () => {
    const wb = XLSX.utils.book_new();

    const wsSummary = XLSX.utils.json_to_sheet(
      sidangEval.classSummaries.map((c, i) => ({
        No: i + 1,
        'Kelas Diniyah': c.kelas,
        'Total Santri': c.total,
        [`Di Bawah KKM (< ${sidangKkm})`]: c.belowKkm,
        'Naik Kelas': c.naik,
        'Naik Bersyarat': c.bersyarat,
        'Tidak Naik': c.tidakNaik,
        'Belum Sidang': c.belumDiputuskan,
      }))
    );
    wsSummary['!cols'] = [
      { wch: 5 },
      { wch: 18 },
      { wch: 13 },
      { wch: 20 },
      { wch: 13 },
      { wch: 15 },
      { wch: 13 },
      { wch: 14 },
    ];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Rekapan_Per_Kelas');

    const wsFiltered = XLSX.utils.json_to_sheet(buildSantriExcelRows(recapRows));
    wsFiltered['!cols'] = [
      { wch: 5 },
      { wch: 14 },
      { wch: 12 },
      { wch: 28 },
      { wch: 12 },
      { wch: 12 },
      { wch: 13 },
      { wch: 11 },
      { wch: 11 },
      { wch: 12 },
      { wch: 10 },
      { wch: 10 },
      { wch: 8 },
      { wch: 11 },
      { wch: 11 },
      { wch: 11 },
      { wch: 20 },
      { wch: 22 },
      { wch: 30 },
      { wch: 24 },
    ];
    XLSX.utils.book_append_sheet(wb, wsFiltered, 'Daftar_Santri_Terfilter');

    const wsAll = XLSX.utils.json_to_sheet(buildSantriExcelRows(sidangEval.rows));
    wsAll['!cols'] = wsFiltered['!cols'];
    XLSX.utils.book_append_sheet(wb, wsAll, 'Semua_Santri_Pondok');

    const wsHistory = XLSX.utils.json_to_sheet(buildHistoryExcelRows());
    wsHistory['!cols'] = [
      { wch: 5 },
      { wch: 22 },
      { wch: 14 },
      { wch: 12 },
      { wch: 28 },
      { wch: 11 },
      { wch: 11 },
      { wch: 16 },
      { wch: 20 },
      { wch: 20 },
      { wch: 24 },
      { wch: 18 },
      { wch: 34 },
    ];
    XLSX.utils.book_append_sheet(wb, wsHistory, 'History_Sidang');

    const taSlug = currentTahunAjaran.replace(/[^\w-]+/g, '-');
    XLSX.writeFile(wb, `Arsip-Rekapan-Sidang-Kenaikan-${taSlug}.xlsx`);
    addAuditLog(
      'Imtihan',
      'Ekspor Excel Rekapan Sidang',
      `Mengunduh arsip lengkap Excel Rekapan & History Sidang Kenaikan T.A. ${currentTahunAjaran}.`
    );
    notify(
      'Arsip Excel lengkap (Rekapan Kelas, Daftar Santri & History Sidang) berhasil diunduh.'
    );
  };

  const handleDownloadExcelRiwayat = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(buildHistoryExcelRows());
    ws['!cols'] = [
      { wch: 5 },
      { wch: 22 },
      { wch: 14 },
      { wch: 12 },
      { wch: 28 },
      { wch: 11 },
      { wch: 11 },
      { wch: 16 },
      { wch: 20 },
      { wch: 20 },
      { wch: 24 },
      { wch: 18 },
      { wch: 34 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'History_Sidang_Kenaikan');

    const taSlug = currentTahunAjaran.replace(/[^\w-]+/g, '-');
    XLSX.writeFile(wb, `History-Sidang-Kenaikan-${taSlug}.xlsx`);
    addAuditLog(
      'Imtihan',
      'Ekspor Excel History Sidang',
      `Mengunduh arsip Excel riwayat keputusan Sidang Kenaikan (${filteredHistory.length} entri).`
    );
    notify(`File Excel History Sidang Kenaikan (${filteredHistory.length} log) berhasil diunduh.`);
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Automatic Notification & Sidang Scheduling Bar for Manager Waktu, Admin, Ketua Panitia, Pengasuh */}
      <div
        className={`rounded-3xl border p-4 sm:p-5 space-y-3 no-print ${
          globalStats.pendingBelowKkm > 0
            ? 'bg-rose-50/75 border-rose-200'
            : 'bg-emerald-50/60 border-emerald-200'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-2xl text-white shrink-0 ${
                globalStats.pendingBelowKkm > 0 ? 'bg-rose-600' : 'bg-emerald-700'
              }`}
            >
              <BellRing className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {globalStats.pendingBelowKkm > 0
                    ? `Notifikasi Otomatis Dewan Sidang: ${globalStats.pendingBelowKkm} Santri Nilai < KKM ${sidangKkm} Belum Diputuskan`
                    : `Semua Santri < KKM ${sidangKkm} (${globalStats.belowKkm} Santri) Telah Memiliki Keputusan Sidang`}
                </h4>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700">
                  Jadwal: {sidangJadwal.statusJadwal}
                  {sidangJadwal.tanggalSidang ? ` · ${sidangJadwal.tanggalSidang}` : ''}
                </span>
              </div>
              <p className="text-xs text-slate-700">
                Notifikasi ditujukan otomatis kepada{' '}
                <strong>Manager Waktu (Kepala Madin), Admin, Ketua Panitia &amp; Pengasuh</strong>{' '}
                untuk menjadwalkan sidang penentuan <em>Naik Kelas / Naik Bersyarat / Tidak Naik</em>.{' '}
                {sidangJadwal.lokasiSidang && (
                  <span>
                    Lokasi: <strong>{sidangJadwal.lokasiSidang}</strong> ({sidangJadwal.waktuSidang}).
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setViewTab('rekapan_semua');
                setRecapFilterMode('bawah_kkm');
              }}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold inline-flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Daftar &lt; KKM ({globalStats.belowKkm})</span>
            </button>
            {canDecideSidang && (
              <button
                type="button"
                onClick={() => setShowSchedulePanel((v) => !v)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <CalendarClock className="w-3.5 h-3.5" />
                <span>{showSchedulePanel ? 'Tutup Form Jadwal' : 'Jadwalkan Sidang & Kirim Notif'}</span>
              </button>
            )}
          </div>
        </div>

        {showSchedulePanel && canDecideSidang && (
          <form
            onSubmit={handleSaveJadwalAndNotify}
            className="rounded-2xl bg-white border border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
          >
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tanggal Sidang
              </label>
              <input
                type="date"
                required
                value={jadwalDraft.tanggalSidang}
                onChange={(e) =>
                  setJadwalDraft((d) => ({ ...d, tanggalSidang: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Waktu Pelaksanaan
              </label>
              <input
                type="text"
                value={jadwalDraft.waktuSidang}
                onChange={(e) =>
                  setJadwalDraft((d) => ({ ...d, waktuSidang: e.target.value }))
                }
                placeholder="19.30 WIB (Ba'da Isya')"
                className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tempat / Majlis Sidang
              </label>
              <input
                type="text"
                value={jadwalDraft.lokasiSidang}
                onChange={(e) =>
                  setJadwalDraft((d) => ({ ...d, lokasiSidang: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Status Jadwal
              </label>
              <select
                value={jadwalDraft.statusJadwal}
                onChange={(e) =>
                  setJadwalDraft((d) => ({
                    ...d,
                    statusJadwal: e.target.value as SidangJadwalInfo['statusJadwal'],
                  }))
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold bg-white"
              >
                <option value="Belum Dijadwalkan">Belum Dijadwalkan</option>
                <option value="Dijadwalkan">Dijadwalkan</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan &amp; Notifikasi</span>
              </button>
            </div>
            <div className="sm:col-span-2 lg:col-span-5">
              <input
                type="text"
                value={jadwalDraft.catatanUndangan || ''}
                onChange={(e) =>
                  setJadwalDraft((d) => ({ ...d, catatanUndangan: e.target.value }))
                }
                placeholder="Catatan undangan untuk Manager Waktu, Admin, Ketua Panitia & Pengasuh (opsional)..."
                className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs"
              />
            </div>
          </form>
        )}
      </div>

      {/* Formula, Role Access & View Switcher Banner */}
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-700" />
              <span>Sidang Kenaikan Kelas Madrasah Diniyah</span>
            </h3>
            <p className="text-xs text-slate-600">
              Rumus: <strong>(Rata Cawu 1 + Rata Cawu 2) ÷ 2</strong>, dipadukan nilai{' '}
              <strong>Ubudiyah, Amaliyah, MQK</strong> serta penalti absensi 2 semester (
              <strong>Sakit = 0</strong>, <strong>Bolos = -3 poin</strong>). Nilai akhir di bawah{' '}
              <strong className="text-rose-700">KKM {sidangKkm}</strong> otomatis memicu notifikasi ke Dewan Sidang.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs">
              <span className="font-bold text-slate-600">KKM Panitia:</span>
              <input
                type="number"
                min={0}
                max={100}
                disabled={!canEditImtihanValues}
                value={sidangKkm}
                onChange={(e) => setSidangKkm(Number(e.target.value))}
                className="w-14 rounded-lg border border-slate-300 px-1.5 py-0.5 text-center font-extrabold text-slate-900 bg-white disabled:bg-slate-100 tabular-nums"
              />
            </div>

            {canDecideSidang ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>
                  Akses Dewan Sidang ({canEditImtihanValues ? 'Edit Cawu & Putuskan' : 'Putuskan Kenaikan'})
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                <Lock className="w-4 h-4" />
                <span>Mode Baca (Khusus Admin, Ketua Imtihan, Pengasuh &amp; Manager Waktu)</span>
              </span>
            )}
          </div>
        </div>

        {/* Sub-view Switcher: Input Per Kelas / Rekapan Semua Kelas / History Sidang */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewTab('per_kelas')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 transition ${
                viewTab === 'per_kelas'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>Input &amp; Keputusan Per Kelas</span>
            </button>
            <button
              type="button"
              onClick={() => setViewTab('rekapan_semua')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 transition ${
                viewTab === 'rekapan_semua'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Rekapan Semua Kelas</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-black tabular-nums ${
                  viewTab === 'rekapan_semua'
                    ? 'bg-white/20 text-white'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {globalStats.belowKkm} &lt; KKM
              </span>
            </button>
            <button
              type="button"
              onClick={() => setViewTab('riwayat_sidang')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 transition ${
                viewTab === 'riwayat_sidang'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History &amp; Riwayat Sidang</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-black tabular-nums ${
                  viewTab === 'riwayat_sidang'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {sidangKenaikanHistory.length}
              </span>
            </button>
          </div>

          <div className="text-[11px] font-semibold text-slate-500 tabular-nums">
            Total Pondok: <strong>{globalStats.total}</strong> Santri ·{' '}
            <span className="text-rose-700 font-bold">{globalStats.belowKkm} &lt; KKM</span> ·{' '}
            <span className="text-emerald-700 font-bold">{globalStats.naik} Naik</span> ·{' '}
            <span className="text-amber-700 font-bold">{globalStats.bersyarat} Bersyarat</span>
          </div>
        </div>

        {/* VIEW 1 CONTROLS: PER KELAS */}
        {viewTab === 'per_kelas' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('semua')}
                className={`p-3 rounded-2xl border text-left transition ${
                  statusFilter === 'semua'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                }`}
              >
                <p
                  className={`text-[11px] font-semibold ${
                    statusFilter === 'semua' ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  Semua Santri
                </p>
                <p className="text-lg font-black tabular-nums">{summaryStats.total} Santri</p>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('belum_sidang')}
                className={`p-3 rounded-2xl border text-left transition ${
                  statusFilter === 'belum_sidang'
                    ? 'bg-sky-700 border-sky-700 text-white shadow-xs'
                    : 'bg-sky-50 border-sky-200 text-sky-900 hover:bg-sky-100'
                }`}
              >
                <p
                  className={`text-[11px] font-semibold ${
                    statusFilter === 'belum_sidang' ? 'text-sky-100' : 'text-sky-700'
                  }`}
                >
                  Belum Sidang
                </p>
                <p className="text-lg font-black tabular-nums">
                  {summaryStats.belumSidang} Santri
                </p>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('naik')}
                className={`p-3 rounded-2xl border text-left transition ${
                  statusFilter === 'naik'
                    ? 'bg-emerald-800 border-emerald-800 text-white shadow-xs'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                }`}
              >
                <p
                  className={`text-[11px] font-semibold ${
                    statusFilter === 'naik' ? 'text-emerald-100' : 'text-emerald-700'
                  }`}
                >
                  Naik
                </p>
                <p className="text-lg font-black tabular-nums">{summaryStats.naik} Santri</p>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('naik_bersyarat')}
                className={`p-3 rounded-2xl border text-left transition ${
                  statusFilter === 'naik_bersyarat'
                    ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
                }`}
              >
                <p
                  className={`text-[11px] font-semibold ${
                    statusFilter === 'naik_bersyarat' ? 'text-amber-100' : 'text-amber-800'
                  }`}
                >
                  Naik Bersyarat
                </p>
                <p className="text-lg font-black tabular-nums">{summaryStats.bersyarat} Santri</p>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('tidak_naik')}
                className={`p-3 rounded-2xl border text-left transition ${
                  statusFilter === 'tidak_naik'
                    ? 'bg-slate-800 border-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200'
                }`}
              >
                <p
                  className={`text-[11px] font-semibold ${
                    statusFilter === 'tidak_naik' ? 'text-slate-200' : 'text-slate-600'
                  }`}
                >
                  Tidak Naik
                </p>
                <p className="text-lg font-black tabular-nums">{summaryStats.tidakNaik} Santri</p>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('bawah_kkm')}
                className={`p-3 rounded-2xl border text-left transition ${
                  statusFilter === 'bawah_kkm'
                    ? 'bg-rose-700 border-rose-700 text-white shadow-xs'
                    : 'bg-rose-50 border-rose-200 text-rose-900 hover:bg-rose-100'
                }`}
              >
                <p
                  className={`text-[11px] font-semibold ${
                    statusFilter === 'bawah_kkm' ? 'text-rose-100' : 'text-rose-700'
                  }`}
                >
                  Di Bawah KKM (&lt; {sidangKkm})
                </p>
                <p className="text-lg font-black tabular-nums">{summaryStats.belowKkm} Santri</p>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedKelas}
                  onChange={(e) => setSelectedKelas(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 bg-white"
                >
                  {uniqueClasses.map((k) => (
                    <option key={k} value={k}>
                      Kelas {k}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 bg-white">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari santri / NIS..."
                    className="text-xs focus:outline-hidden w-40"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as SidangStatusFilter)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 bg-white"
                >
                  <option value="semua">Semua Status ({rows.length})</option>
                  <option value="belum_sidang">
                    Belum Sidang ({summaryStats.belumSidang})
                  </option>
                  <option value="naik">Naik ({summaryStats.naik})</option>
                  <option value="naik_bersyarat">
                    Naik Bersyarat ({summaryStats.bersyarat})
                  </option>
                  <option value="tidak_naik">Tidak Naik ({summaryStats.tidakNaik})</option>
                  <option value="bawah_kkm">
                    Pertimbangan &lt; KKM {sidangKkm} ({summaryStats.belowKkm})
                  </option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {canDecideSidang && (
                  <button
                    type="button"
                    onClick={handleAutoApproveAboveKkm}
                    className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Naikkan Semua ≥ KKM {sidangKkm}</span>
                  </button>
                )}
                <PrintOrientationControl recommended="landscape" compact />
                <button
                  type="button"
                  onClick={handleDownloadExcelPerKelas}
                  className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Unduh Excel</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdfSidang}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    triggerReliablePrint({
                      title: `Berita Acara Sidang Kenaikan - ${selectedKelas}`,
                      orientation: printOrientation,
                      paperSize: 'F4',
                      targetElement: printRef.current,
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* VIEW 2 CONTROLS: REKAPAN SEMUA KELAS */}
        {viewTab === 'rekapan_semua' && (
          <div className="space-y-3 pt-1">
            {/* Clickable Status Filter Bar Across Pondok */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'semua', label: 'Semua Santri', count: globalStats.total },
                  { id: 'belum_sidang', label: 'Belum Sidang', count: globalStats.belumSidang },
                  { id: 'naik', label: 'Naik', count: globalStats.naik },
                  { id: 'naik_bersyarat', label: 'Naik Bersyarat', count: globalStats.bersyarat },
                  { id: 'tidak_naik', label: 'Tidak Naik', count: globalStats.tidakNaik },
                  {
                    id: 'bawah_kkm',
                    label: `Di Bawah KKM (< ${sidangKkm})`,
                    count: globalStats.belowKkm,
                  },
                ] as const
              ).map((chip) => {
                const active = recapFilterMode === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setRecapFilterMode(chip.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition inline-flex items-center gap-1.5 tabular-nums ${
                      active
                        ? 'bg-emerald-800 border-emerald-800 text-white shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{chip.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                        active ? 'bg-white/20 text-white' : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      {chip.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={recapKelasFilter}
                  onChange={(e) => setRecapKelasFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 bg-white"
                >
                  <option value="SEMUA">Semua Kelas ({uniqueClasses.length} Kelas)</option>
                  {uniqueClasses.map((k) => (
                    <option key={k} value={k}>
                      Kelas {k}
                    </option>
                  ))}
                </select>

                <select
                  value={recapFilterMode}
                  onChange={(e) => setRecapFilterMode(e.target.value as SidangStatusFilter)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 bg-white"
                >
                  <option value="semua">Semua Status ({globalStats.total})</option>
                  <option value="belum_sidang">
                    Belum Sidang ({globalStats.belumSidang})
                  </option>
                  <option value="naik">Naik ({globalStats.naik})</option>
                  <option value="naik_bersyarat">
                    Naik Bersyarat ({globalStats.bersyarat})
                  </option>
                  <option value="tidak_naik">Tidak Naik ({globalStats.tidakNaik})</option>
                  <option value="bawah_kkm">
                    Pertimbangan &lt; KKM {sidangKkm} ({globalStats.belowKkm})
                  </option>
                </select>

                <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 bg-white">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama, NIS, atau kelas..."
                    className="text-xs focus:outline-hidden w-48"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadExcelRekapanSemua}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Unduh Excel Arsip Lengkap (.xlsx)</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdfRekapanSemua}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF Rekapan</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3 CONTROLS: RIWAYAT / HISTORY SIDANG */}
        {viewTab === 'riwayat_sidang' && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 bg-white">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Cari santri, kelas, atau pengambil keputusan..."
                  className="text-xs focus:outline-hidden w-64"
                />
              </div>

              <select
                value={historyFilter}
                onChange={(e) => setHistoryFilter(e.target.value as typeof historyFilter)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="semua">Semua Log Sidang ({sidangKenaikanHistory.length})</option>
                <option value="keputusan">Sudah Ada Keputusan Akhir</option>
                <option value="belum_sidang">Status: Belum Sidang</option>
                <option value="naik">Status: Naik</option>
                <option value="naik_bersyarat">Status: Naik Bersyarat</option>
                <option value="tidak_naik">Status: Tidak Naik</option>
                <option value="bawah_kkm">Kasus Nilai &lt; KKM</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadExcelRiwayat}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Unduh Excel History (.xlsx)</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadPdfRiwayat}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF History</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW 1 SHEET: PER KELAS */}
      {viewTab === 'per_kelas' && (
        <div
          ref={printRef}
          className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4 printable-area"
        >
          <PrintKopPondok
            judulDokumen={`BERITA ACARA SIDANG KENAIKAN KELAS — ${selectedKelas}`}
            subJudul={`Tahun Ajaran ${currentTahunAjaran} · KKM Panitia: ${sidangKkm} · Absensi KBM 2 Semester (Sakit = 0, Bolos = -3)`}
          />

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] uppercase text-slate-600">
                  <th className="py-2.5 px-2.5">No</th>
                  <th className="py-2.5 px-2.5">Santri &amp; NIS</th>
                  <th className="py-2.5 px-2 text-center">
                    Rata Cawu 1
                    <span className="block text-[9px] font-normal text-slate-400">Admin/Ketua</span>
                  </th>
                  <th className="py-2.5 px-2 text-center">
                    Rata Cawu 2
                    <span className="block text-[9px] font-normal text-slate-400">Admin/Ketua</span>
                  </th>
                  <th className="py-2.5 px-2 text-center">
                    Rata Imtihan
                    <span className="block text-[9px] font-normal text-slate-400">(C1+C2)÷2</span>
                  </th>
                  <th className="py-2.5 px-2 text-center">Sakit (0)</th>
                  <th className="py-2.5 px-2 text-center">Bolos (-3)</th>
                  <th className="py-2.5 px-2 text-center">Ubudiyah</th>
                  <th className="py-2.5 px-2 text-center">Amaliyah</th>
                  <th className="py-2.5 px-2 text-center">MQK</th>
                  <th className="py-2.5 px-2 text-center">Total Poin</th>
                  <th className="py-2.5 px-2 text-center">Nilai Akhir</th>
                  <th className="py-2.5 px-2.5">Keputusan Dewan Sidang</th>
                  <th className="py-2.5 px-2.5 no-print">Catatan Pertimbangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 tabular-nums">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="py-8 text-center text-slate-400">
                      Tidak ada santri di kelas {selectedKelas} yang sesuai dengan filter status atau pencarian saat ini.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((r, idx) => (
                  <tr
                    key={r.santriId}
                    className={
                      r.diBawahKkm
                        ? 'bg-rose-50/45 hover:bg-rose-50/75'
                        : 'hover:bg-slate-50/70'
                    }
                  >
                    <td className="py-2.5 px-2.5 font-semibold text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 px-2.5">
                      <p className="font-bold text-slate-900">{r.nama}</p>
                      <p className="text-[10px] text-slate-500">NIS {r.nis}</p>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        disabled={!canEditImtihanValues}
                        value={r.rec.rataCawu1}
                        onChange={(e) =>
                          updateRowField(r, {
                            rataCawu1: Math.min(100, Math.max(0, Number(e.target.value) || 0)),
                          })
                        }
                        className="w-14 rounded-lg border border-slate-300 px-1.5 py-1 text-center font-bold bg-white disabled:bg-slate-100"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        disabled={!canEditImtihanValues}
                        value={r.rec.rataCawu2}
                        onChange={(e) =>
                          updateRowField(r, {
                            rataCawu2: Math.min(100, Math.max(0, Number(e.target.value) || 0)),
                          })
                        }
                        className="w-14 rounded-lg border border-slate-300 px-1.5 py-1 text-center font-bold bg-white disabled:bg-slate-100"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center font-extrabold text-emerald-900">
                      {r.rataImtihan}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        disabled={!canDecideSidang}
                        value={r.rec.sakitCount}
                        onChange={(e) =>
                          updateRowField(r, {
                            sakitCount: Math.max(0, parseInt(e.target.value, 10) || 0),
                          })
                        }
                        className="w-12 rounded-lg border border-slate-300 px-1 py-1 text-center font-semibold bg-white disabled:bg-slate-100"
                      />
                      <span className="block text-[9.5px] text-slate-400">0 pt</span>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        disabled={!canDecideSidang}
                        value={r.rec.bolosCount}
                        onChange={(e) =>
                          updateRowField(r, {
                            bolosCount: Math.max(0, parseInt(e.target.value, 10) || 0),
                          })
                        }
                        className="w-12 rounded-lg border border-slate-300 px-1 py-1 text-center font-semibold bg-white disabled:bg-slate-100"
                      />
                      <span
                        className={`block text-[9.5px] font-bold ${
                          r.poinAbsensi < 0 ? 'text-rose-600' : 'text-slate-400'
                        }`}
                      >
                        {r.poinAbsensi} pt
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        disabled={!canDecideSidang}
                        value={r.rec.nilaiUbudiyah}
                        onChange={(e) =>
                          updateRowField(r, {
                            nilaiUbudiyah: Math.min(100, Math.max(0, Number(e.target.value) || 0)),
                          })
                        }
                        className="w-14 rounded-lg border border-slate-300 px-1.5 py-1 text-center font-semibold bg-white disabled:bg-slate-100"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        disabled={!canDecideSidang}
                        value={r.rec.nilaiAmaliyah}
                        onChange={(e) =>
                          updateRowField(r, {
                            nilaiAmaliyah: Math.min(100, Math.max(0, Number(e.target.value) || 0)),
                          })
                        }
                        className="w-14 rounded-lg border border-slate-300 px-1.5 py-1 text-center font-semibold bg-white disabled:bg-slate-100"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        disabled={!canDecideSidang}
                        value={r.rec.nilaiMqk}
                        onChange={(e) =>
                          updateRowField(r, {
                            nilaiMqk: Math.min(100, Math.max(0, Number(e.target.value) || 0)),
                          })
                        }
                        className="w-14 rounded-lg border border-slate-300 px-1.5 py-1 text-center font-semibold bg-white disabled:bg-slate-100"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-800">
                      {r.totalPoin}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`font-black text-sm ${
                          r.diBawahKkm ? 'text-rose-700' : 'text-emerald-800'
                        }`}
                      >
                        {r.nilaiAkhir}
                      </span>
                      {r.diBawahKkm ? (
                        <span className="block text-[9.5px] font-bold text-rose-600 inline-flex items-center gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" /> &lt; KKM {sidangKkm}
                        </span>
                      ) : (
                        <span className="block text-[9.5px] font-semibold text-emerald-700">
                          Tuntas KKM
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-2.5">
                      <select
                        disabled={!canDecideSidang}
                        value={r.rec.keputusan}
                        onChange={(e) =>
                          updateRowField(r, {
                            keputusan: e.target.value as SidangKenaikanRecord['keputusan'],
                          })
                        }
                        className={`rounded-xl border px-2.5 py-1.5 text-xs font-extrabold disabled:opacity-70 ${
                          r.rec.keputusan === 'Naik Kelas'
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                            : r.rec.keputusan === 'Naik Bersyarat'
                            ? 'bg-amber-50 border-amber-400 text-amber-900'
                            : r.rec.keputusan === 'Tidak Naik'
                            ? 'bg-rose-50 border-rose-400 text-rose-900'
                            : 'bg-white border-slate-300 text-slate-700'
                        }`}
                      >
                        <option value="Belum Diputuskan">Belum Diputuskan</option>
                        <option value="Naik Kelas">Naik Kelas</option>
                        <option value="Naik Bersyarat">Naik Bersyarat</option>
                        <option value="Tidak Naik">Tidak Naik / Mengulang</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-2.5 no-print">
                      <input
                        type="text"
                        disabled={!canDecideSidang}
                        value={r.rec.catatanSidang || ''}
                        onChange={(e) => updateRowField(r, { catatanSidang: e.target.value })}
                        placeholder={
                          r.diBawahKkm ? 'Alasan / syarat kenaikan...' : 'Catatan dewan sidang...'
                        }
                        className="w-40 rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs bg-white disabled:bg-slate-100"
                      />
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <p className="text-slate-500 flex items-center gap-1.5 no-print">
              <Save className="w-3.5 h-3.5 text-emerald-700" />
              <span>
                Perubahan nilai &amp; keputusan sidang tersimpan otomatis dan tercatat di tab History Sidang.
              </span>
            </p>
            <div className="hidden print:grid grid-cols-4 gap-6 w-full text-center pt-4">
              <div>
                <p>Pengasuh Pondok</p>
                <div className="h-14" />
                <p className="font-bold underline">KH. Amin Maizun</p>
              </div>
              <div>
                <p>Ketua Panitia Imtihan</p>
                <div className="h-14" />
                <p className="font-bold underline">{imtihanMaster.ketuaImtihanNama}</p>
              </div>
              <div>
                <p>Manager Waktu / Kepala Madin</p>
                <div className="h-14" />
                <p className="font-bold underline">Ust. H Zaenal Arifin</p>
              </div>
              <div>
                <p>Administrator Sistem</p>
                <div className="h-14" />
                <p className="font-bold underline">{currentUser.nama}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: REKAPAN LINTAS SEMUA KELAS */}
      {viewTab === 'rekapan_semua' && (
        <div className="space-y-5">
          {/* Matrix Ringkasan Per Kelas */}
          <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-extrabold text-slate-900">
                Rekapan Sidang Kenaikan Seluruh Kelas Madrasah Diniyah
              </h4>
              <span className="text-xs text-slate-500">
                Klik nama kelas untuk langsung input atau tinjau rincian santri kelas tersebut.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse tabular-nums">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] uppercase text-slate-600">
                    <th className="py-2.5 px-3">Kelas Diniyah</th>
                    <th className="py-2.5 px-3 text-center">Total Santri</th>
                    <th className="py-2.5 px-3 text-center text-rose-700">&lt; KKM {sidangKkm}</th>
                    <th className="py-2.5 px-3 text-center text-emerald-700">Naik Kelas</th>
                    <th className="py-2.5 px-3 text-center text-amber-700">Naik Bersyarat</th>
                    <th className="py-2.5 px-3 text-center text-slate-700">Tidak Naik</th>
                    <th className="py-2.5 px-3 text-center">Belum Diputuskan</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sidangEval.classSummaries.map((c) => (
                    <tr key={c.kelas} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 font-extrabold text-slate-900">{c.kelas}</td>
                      <td className="py-2.5 px-3 text-center font-semibold">{c.total}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-lg font-extrabold ${
                            c.belowKkm > 0
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'text-slate-400'
                          }`}
                        >
                          {c.belowKkm}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-800">{c.naik}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-800">
                        {c.bersyarat}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                        {c.tidakNaik}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-600">
                        {c.belumDiputuskan}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedKelas(c.kelas);
                            setViewTab('per_kelas');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-[11px]"
                        >
                          Buka Kelas →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Daftar Konsolidasi Santri Pertimbangan & Keputusan Lintas Kelas */}
          <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-extrabold text-slate-900">
                Daftar Santri Lintas Kelas ({recapRows.length} Santri Ditampilkan)
              </h4>
              <span className="text-[11px] text-slate-500">
                Dewan Sidang dapat langsung menetapkan keputusan Naik / Naik Bersyarat dari daftar ini.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse tabular-nums">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] uppercase text-slate-600">
                    <th className="py-2.5 px-2.5">No</th>
                    <th className="py-2.5 px-2.5">Kelas</th>
                    <th className="py-2.5 px-2.5">Santri &amp; NIS</th>
                    <th className="py-2.5 px-2 text-center">Rata Imtihan</th>
                    <th className="py-2.5 px-2 text-center">Bolos</th>
                    <th className="py-2.5 px-2 text-center">Ubudiyah / Amaliyah / MQK</th>
                    <th className="py-2.5 px-2 text-center">Nilai Akhir</th>
                    <th className="py-2.5 px-2.5">Keputusan Dewan Sidang</th>
                    <th className="py-2.5 px-2.5">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recapRows.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        Tidak ada santri yang sesuai dengan filter rekapan saat ini.
                      </td>
                    </tr>
                  ) : (
                    recapRows.map((r, idx) => (
                      <tr
                        key={r.santriId}
                        className={
                          r.diBawahKkm
                            ? 'bg-rose-50/40 hover:bg-rose-50/70'
                            : 'hover:bg-slate-50/70'
                        }
                      >
                        <td className="py-2.5 px-2.5 text-slate-500 font-semibold">{idx + 1}</td>
                        <td className="py-2.5 px-2.5 font-extrabold text-slate-800 whitespace-nowrap">
                          {r.kelas}
                        </td>
                        <td className="py-2.5 px-2.5">
                          <p className="font-bold text-slate-900">{r.nama}</p>
                          <p className="text-[10px] text-slate-500">NIS {r.nis}</p>
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-emerald-900">
                          {r.rataImtihan}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <span
                            className={
                              r.rec.bolosCount > 0 ? 'font-bold text-rose-700' : 'text-slate-500'
                            }
                          >
                            {r.rec.bolosCount} ({r.poinAbsensi} pt)
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-700">
                          {r.rec.nilaiUbudiyah} / {r.rec.nilaiAmaliyah} / {r.rec.nilaiMqk}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <span
                            className={`font-black text-sm ${
                              r.diBawahKkm ? 'text-rose-700' : 'text-emerald-800'
                            }`}
                          >
                            {r.nilaiAkhir}
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5">
                          <select
                            disabled={!canDecideSidang}
                            value={r.rec.keputusan}
                            onChange={(e) =>
                              updateRowField(r, {
                                keputusan: e.target.value as SidangKenaikanRecord['keputusan'],
                              })
                            }
                            className={`rounded-xl border px-2.5 py-1.5 text-xs font-extrabold disabled:opacity-70 ${
                              r.rec.keputusan === 'Naik Kelas'
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                                : r.rec.keputusan === 'Naik Bersyarat'
                                ? 'bg-amber-50 border-amber-400 text-amber-900'
                                : r.rec.keputusan === 'Tidak Naik'
                                ? 'bg-rose-50 border-rose-400 text-rose-900'
                                : 'bg-white border-slate-300 text-slate-700'
                            }`}
                          >
                            <option value="Belum Diputuskan">Belum Diputuskan</option>
                            <option value="Naik Kelas">Naik Kelas</option>
                            <option value="Naik Bersyarat">Naik Bersyarat</option>
                            <option value="Tidak Naik">Tidak Naik / Mengulang</option>
                          </select>
                        </td>
                        <td className="py-2.5 px-2.5">
                          <input
                            type="text"
                            disabled={!canDecideSidang}
                            value={r.rec.catatanSidang || ''}
                            onChange={(e) =>
                              updateRowField(r, { catatanSidang: e.target.value })
                            }
                            placeholder="Catatan / syarat..."
                            className="w-40 rounded-xl border border-slate-200 px-2.5 py-1 text-xs bg-white disabled:bg-slate-100"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: HISTORY & RIWAYAT SIDANG */}
      {viewTab === 'riwayat_sidang' && (
        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">
                History &amp; Rekam Jejak Keputusan Sidang Kenaikan Kelas
              </h4>
              <p className="text-xs text-slate-500">
                Mencatat setiap perubahan nilai Cawu/absensi dan ketetapan naik kelas secara kronologis beserta pejabat yang memutuskan.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 tabular-nums">
              {filteredHistory.length} Riwayat Tercatat
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10.5px] uppercase text-slate-600">
                  <th className="py-2.5 px-3">Waktu Sidang</th>
                  <th className="py-2.5 px-3">Kelas</th>
                  <th className="py-2.5 px-3">Santri &amp; NIS</th>
                  <th className="py-2.5 px-3 text-center">Nilai / KKM</th>
                  <th className="py-2.5 px-3">Perubahan Keputusan</th>
                  <th className="py-2.5 px-3">Diputuskan Oleh</th>
                  <th className="py-2.5 px-3">Catatan / Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 tabular-nums">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      Belum ada catatan riwayat sidang yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((h) => {
                    const isBelow = h.nilaiAkhir < h.kkm;
                    return (
                      <tr key={h.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap font-medium">
                          {h.waktu}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-800 whitespace-nowrap">
                          {h.kelas}
                        </td>
                        <td className="py-2.5 px-3">
                          <p className="font-bold text-slate-900">{h.santriNama}</p>
                          <p className="text-[10px] text-slate-500">NIS {h.santriNis}</p>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`font-black ${
                              isBelow ? 'text-rose-700' : 'text-emerald-800'
                            }`}
                          >
                            {h.nilaiAkhir}
                          </span>
                          <span className="text-slate-400"> / {h.kkm}</span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="text-slate-500">{h.keputusanSebelumnya}</span>
                          <span className="mx-1.5 text-slate-400">→</span>
                          <span
                            className={`px-2 py-0.5 rounded-lg font-extrabold text-[11px] ${
                              h.keputusanBaru === 'Naik Kelas'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : h.keputusanBaru === 'Naik Bersyarat'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : h.keputusanBaru === 'Tidak Naik'
                                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {h.keputusanBaru}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <p className="font-bold text-slate-900">{h.oleh}</p>
                          <p className="text-[10px] text-slate-500 uppercase">{h.peranOleh}</p>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 max-w-xs">
                          {h.catatan || '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
