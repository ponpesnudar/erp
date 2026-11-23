import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FileCheck,
  Printer,
  Grid,
  CreditCard,
  GraduationCap,
  DollarSign,
  Calendar,
  Shuffle,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  Search,
  X,
  Award,
  Users,
  ClipboardList,
  Settings,
  UserCheck,
  Upload,
  Sparkles,
  Loader2,
  ShieldAlert,
  Tag,
  DoorOpen,
} from 'lucide-react';
import {
  useAppStore,
  SoalSubmission,
  SoalRegulasi,
  RomawiSection,
  PilihanGandaItem,
} from '../../lib/store.ts';
import { ModuleWorkflowFlowchart, WorkflowNode } from '../../components/common/ModuleWorkflowFlowchart.tsx';
import { PrintOrientationControl } from '../../components/common/PrintOrientationControl.tsx';
import { PrintKopPondok } from '../../components/common/PrintKopPondok.tsx';
import { triggerReliablePrint } from '../../lib/printHelper.ts';
import { useAuth } from '../../lib/auth.ts';
import {
  evaluateAllSidangKenaikan,
  isSidangNotifyRole,
} from '../../lib/sidangKenaikanHelper.ts';
import { validateRoom } from '../../lib/rules.ts';
import {
  TemplateBlankoImtihan,
  RABImtihanEditor,
  KartuImtihanSubTab,
  SubTabInputNilaiSpreadsheet,
  SubTabRaportSantri,
  SubTabPeringkatParalel,
  DenahPondok3D,
  DenahKampus2DSubTab,
  BlankoNilaiSubTab,
  KoreksianKitabSubTab,
  ImtihanNeuralDashboard,
  SidangKenaikanSubTab,
  type ImtihanNeuralNode,
} from './components/index.ts';
import { DAFTAR_KELAS_DINIYAH, type JadwalMaarifanItem, type JagaPiketRecord } from '../../data/seed/pondokData.ts';

export const ImtihanModule: React.FC = () => {
  const {
    soalSubmissions,
    santriList,
    ruangUjianList,
    generateExamSeating,
    nilaiList,
    absensiSessions,
    rabImtihan,
    imtihanMaster,
    jagaPiketList,
    sidangKenaikanRecords,
    sidangKkm,
    sidangJadwal,
    pendingImtihanSubTab,
    setPendingImtihanSubTab,
  } = useAppStore();

  const { effectiveRole, can } = useAuth();
  const isWaliSantri = effectiveRole === 'wali_santri';
  const [activeSubTab, setActiveSubTab] = useState<string>(
    isWaliSantri ? 'raport_santri' : 'dashboard'
  );
  const [dashboardViewMode, setDashboardViewMode] = useState<'neural' | 'flowchart'>('neural');

  // Deep-link handoff from Header or Beranda notifications
  useEffect(() => {
    if (pendingImtihanSubTab) {
      if (
        isWaliSantri &&
        !['koreksian_kitab', 'raport_santri', 'peringkat_paralel'].includes(pendingImtihanSubTab)
      ) {
        setActiveSubTab('raport_santri');
      } else {
        setActiveSubTab(pendingImtihanSubTab);
      }
      setPendingImtihanSubTab(null);
    }
  }, [pendingImtihanSubTab, setPendingImtihanSubTab, isWaliSantri]);

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

  // Sub-tabs list (wali_santri strictly only sees Koreksian Kitab, Raport Santri, Peringkat & Juara)
  const allSubTabs = [
    { id: 'dashboard', label: 'Dashboard & Alur' },
    { id: 'koreksian_kitab', label: 'Koreksian Kitab' },
    { id: 'soal_guru', label: 'Naskah Soal Guru' },
    { id: 'review_panitia', label: 'Review Panitia' },
    { id: 'cetak_blanko', label: 'Cetak Blanko Soal' },
    { id: 'denah_kampus_2d', label: 'Denah Gedung 2D' },
    { id: 'denah_ujian', label: 'Denah & Tempat Duduk' },
    { id: 'kartu_imtihan', label: 'Kartu Imtihan' },
    { id: 'blanko_nilai', label: 'Blanko Nilai Santri' },
    { id: 'input_nilai', label: 'Input Nilai' },
    { id: 'raport_santri', label: 'Raport Santri' },
    { id: 'peringkat_paralel', label: 'Peringkat & Juara' },
    { id: 'sidang_kenaikan', label: 'Sidang Kenaikan Kelas' },
    { id: 'rab_imtihan', label: 'RAB Imtihan' },
    { id: 'jadwal_mapel', label: 'Jadwal Mapel' },
    { id: 'jaga_piket', label: 'Jadwal Jaga & Piket' },
  ];

  const WALI_ALLOWED_SUBTABS = ['koreksian_kitab', 'raport_santri', 'peringkat_paralel'];
  const subTabs = isWaliSantri
    ? allSubTabs.filter((t) => WALI_ALLOWED_SUBTABS.includes(t.id))
    : allSubTabs;

  useEffect(() => {
    if (isWaliSantri && !WALI_ALLOWED_SUBTABS.includes(activeSubTab)) {
      setActiveSubTab('raport_santri');
    }
  }, [isWaliSantri, activeSubTab]);

  // Initialize seating plan if empty
  useEffect(() => {
    if (ruangUjianList.length === 0) {
      generateExamSeating(12345);
    }
  }, [ruangUjianList, generateExamSeating]);

  // Dynamic RAB summary
  const totalPemasukan = rabImtihan
    .filter((r) => r.kategori === 'Pemasukan')
    .reduce((sum, r) => sum + r.jumlah, 0);
  const totalPengeluaranPokok = rabImtihan
    .filter((r) => r.kategori !== 'Pemasukan' && r.kategori !== 'UsulanTambahan')
    .reduce((sum, r) => sum + r.jumlah, 0);
  const saldoPokok = totalPemasukan - totalPengeluaranPokok;

  const susulanCount = imtihanMaster.pesertaSusulanIds?.length || 0;
  const activePutra = santriList.filter(
    (s) => s.gender === 'L' && !imtihanMaster.pesertaSusulanIds.includes(s.id)
  ).length;
  const activePutri = santriList.filter(
    (s) => s.gender === 'P' && !imtihanMaster.pesertaSusulanIds.includes(s.id)
  ).length;

  // Alur Workflow Nodes
  const alurNodes: WorkflowNode[] = [
    {
      id: 'koreksian_kitab',
      title: 'Koreksian Kitab',
      keterangan: 'Verifikasi kelengkapan kitab pra-ujian',
      count: santriList.length - susulanCount,
      icon: ClipboardList,
      status: 'aktif',
    },
    {
      id: 'soal_guru',
      title: 'Penyusunan Soal',
      keterangan: 'Guru menyusun naskah Pegon/Arab',
      count: soalSubmissions.filter((s) => s.status === 'Draf' || s.status === 'Diajukan').length,
      icon: Edit3,
      status: 'aktif',
    },
    {
      id: 'review_panitia',
      title: 'Approval Panitia',
      keterangan: 'Tinjau & pengesahan naskah',
      count: soalSubmissions.filter((s) => s.status === 'Diajukan').length,
      icon: CheckCircle2,
      status: 'menunggu',
    },
    {
      id: 'cetak_blanko',
      title: 'Cetak Blanko',
      keterangan: 'Format resmi kop pesantren',
      count: soalSubmissions.filter((s) => s.status === 'Disetujui').length,
      icon: Printer,
      status: 'selesai',
    },
    {
      id: 'denah_kampus_2d',
      title: 'Denah Gedung 2D',
      keterangan: 'Peta gedung, lantai & bangku ujian',
      count: ruangUjianList.length,
      icon: Grid,
      status: 'selesai',
    },
    {
      id: 'kartu_imtihan',
      title: 'Kartu Peserta',
      keterangan: 'Cetak batch A4/F4 & jadwal paraf',
      count: activePutra + activePutri,
      icon: CreditCard,
      status: 'selesai',
    },
    {
      id: 'input_nilai',
      title: 'Input Nilai',
      keterangan: 'Spreadsheet harian, lisan & ujian',
      count: nilaiList.length,
      icon: GraduationCap,
      status: 'aktif',
    },
    {
      id: 'raport_santri',
      title: 'Raport F4 Resmi',
      keterangan: 'Cetak satuan & 1 kelas PDF',
      count: santriList.length,
      icon: Award,
      status: 'selesai',
    },
    {
      id: 'sidang_kenaikan',
      title: 'Sidang Kenaikan',
      keterangan:
        sidangEval.pendingBelowKkmRows.length > 0
          ? `${sidangEval.pendingBelowKkmRows.length} santri < KKM ${sidangKkm} menunggu jadwal & keputusan sidang`
          : `Rata Cawu 1 & 2, absensi, KKM ${sidangKkm} & keputusan dewan`,
      count:
        sidangEval.pendingBelowKkmRows.length > 0
          ? sidangEval.pendingBelowKkmRows.length
          : sidangEval.belowKkmRows.length,
      icon: UserCheck,
      status: sidangEval.pendingBelowKkmRows.length > 0 ? 'menunggu' : 'aktif',
    },
    {
      id: 'rab_imtihan',
      title: 'RAB & Jadwal Jaga',
      keterangan: 'Anggaran & pengawas piket',
      count: rabImtihan.length + jagaPiketList.length,
      icon: DollarSign,
      status: 'selesai',
    },
  ];

  const neuralNodes: ImtihanNeuralNode[] = [
    {
      id: 'koreksian_kitab',
      code: 'KK',
      title: 'Koreksian Kitab',
      subtitle: 'Verifikasi kitab wajib pra-ujian',
      countLabel: `${santriList.length - susulanCount} Siap`,
      accentHex: '#34d399',
      glowRgba: 'rgba(52, 211, 153, 0.24)',
      statusText: `${susulanCount} Susulan`,
    },
    {
      id: 'soal_guru',
      code: 'NS',
      title: 'Naskah Soal',
      subtitle: 'Input soal Pegon & Arab berharokat',
      countLabel: `${soalSubmissions.length} Naskah`,
      accentHex: '#38bdf8',
      glowRgba: 'rgba(56, 189, 248, 0.24)',
      statusText: 'Penyusunan Aktif',
    },
    {
      id: 'review_panitia',
      code: 'RV',
      title: 'Approval Panitia',
      subtitle: 'Tinjau & pengesahan naskah',
      countLabel: `${soalSubmissions.filter((s) => s.status === 'Diajukan').length} Menunggu`,
      accentHex: '#fbbf24',
      glowRgba: 'rgba(251, 191, 36, 0.24)',
      statusText: 'Kurasi Naskah',
    },
    {
      id: 'cetak_blanko',
      code: 'BS',
      title: 'Blanko Soal F4',
      subtitle: 'Kop pesantren Arab & barcode ruang',
      countLabel: `${soalSubmissions.filter((s) => s.status === 'Disetujui').length} Disetujui`,
      accentHex: '#2dd4bf',
      glowRgba: 'rgba(45, 212, 191, 0.24)',
      statusText: 'Siap Cetak F4',
    },
    {
      id: 'denah_kampus_2d',
      code: 'DN',
      title: 'Denah 2D & 3D',
      subtitle: 'Peta gedung, lantai & kursi anti-contek',
      countLabel: `${ruangUjianList.length} Ruang`,
      accentHex: '#60a5fa',
      glowRgba: 'rgba(96, 165, 250, 0.24)',
      statusText: 'Tata Ruang Aktif',
    },
    {
      id: 'kartu_imtihan',
      code: 'KP',
      title: 'Kartu Peserta',
      subtitle: 'Batch F4 4 kartu + jadwal paraf',
      countLabel: `${activePutra + activePutri} Kartu`,
      accentHex: '#c084fc',
      glowRgba: 'rgba(192, 132, 252, 0.24)',
      statusText: 'Siap Distribusi',
    },
    {
      id: 'input_nilai',
      code: 'IN',
      title: 'Input Nilai',
      subtitle: 'Imtihan, harian, lisan & akhlaq',
      countLabel: `${nilaiList.length} Entri`,
      accentHex: '#f472b6',
      glowRgba: 'rgba(244, 114, 182, 0.24)',
      statusText: 'Penilaian Guru',
    },
    {
      id: 'raport_santri',
      code: 'RP',
      title: 'Raport & Juara',
      subtitle: 'Raport F4 RTL & Multi-TTD transparan',
      countLabel: `${santriList.length} Santri`,
      accentHex: '#fb923c',
      glowRgba: 'rgba(251, 146, 60, 0.24)',
      statusText: 'Rekap Prestasi',
    },
    {
      id: 'sidang_kenaikan',
      code: 'SK',
      title: 'Sidang Kenaikan',
      subtitle: `Rata Cawu 1-2, absensi & KKM ${sidangKkm}`,
      countLabel:
        sidangEval.pendingBelowKkmRows.length > 0
          ? `${sidangEval.pendingBelowKkmRows.length} < KKM ${sidangKkm}`
          : `${sidangEval.belowKkmRows.length} Di Bawah KKM`,
      accentHex: '#f87171',
      glowRgba: 'rgba(248, 113, 113, 0.24)',
      statusText:
        sidangEval.pendingBelowKkmRows.length > 0
          ? 'Perlu Sidang Penentuan'
          : sidangJadwal.statusJadwal === 'Dijadwalkan'
          ? 'Sidang Terjadwal'
          : 'Dewan Pengasuh',
    },
  ];

  // Pending Approvals for Panel
  const pendingApprovals = soalSubmissions
    .filter((s) => s.status === 'Diajukan')
    .map((s) => ({
      id: s.id,
      judul: `Naskah Soal: ${s.mapelNama} (${s.kelas})`,
      waktu: s.tanggalPengajuan || 'Hari ini',
      pemohon: s.guruNama,
    }));

  return (
    <div className="space-y-6">
      {/* Module Title & Sub-Tab Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3 no-print">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-700" />
            <span>Modul Imtihan & Evaluasi Santri</span>
          </h2>
          <p className="text-xs text-slate-500">
            Pengelolaan menyeluruh: naskah soal Pegon/Arab, denah acak bebas contek, kartu imtihan, raport F4, peringkat, RAB, dan piket jaga.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-300 whitespace-nowrap">
            Cawu {imtihanMaster.cawu} · T.A. {imtihanMaster.tahunAjaran}
          </span>
        </div>
      </div>

      {/* Sub-Bab Tab Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-print">
        {subTabs.map((tab) => {
          const showSidangBadge =
            tab.id === 'sidang_kenaikan' &&
            isSidangNotifyRole(effectiveRole) &&
            sidangEval.pendingBelowKkmRows.length > 0;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition inline-flex items-center gap-1.5 ${
                activeSubTab === tab.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              {showSidangBadge && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-rose-600 text-white tabular-nums">
                  {sidangEval.pendingBelowKkmRows.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {isWaliSantri && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-semibold flex items-center gap-2 no-print">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Portal Wali Santri (Lihat Saja):</strong> Hak akses Wali Santri dibatasi hanya untuk melihat Koreksian Kitab, Raport Santri, dan Peringkat &amp; Juara.
          </span>
        </div>
      )}

      {/* TAB 1: DASHBOARD & ALUR */}
      {!isWaliSantri && activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          {isSidangNotifyRole(effectiveRole) && sidangEval.pendingBelowKkmRows.length > 0 && (
            <div className="rounded-2xl bg-rose-50/90 border border-rose-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xs font-extrabold text-rose-950">
                      Notifikasi Otomatis Sidang Kenaikan Kelas ·{' '}
                      <span className="tabular-nums">
                        {sidangEval.pendingBelowKkmRows.length} Santri Nilai &lt; KKM {sidangKkm}
                      </span>
                    </h3>
                    <span className="text-[10.5px] font-bold text-rose-800 bg-white border border-rose-200 px-2 py-0.5 rounded-md">
                      Status Jadwal: {sidangJadwal.statusJadwal}
                    </span>
                  </div>
                  <p className="text-xs text-rose-900/90">
                    Pemberitahuan otomatis untuk <strong>Manager Waktu, Admin, Ketua Panitia &amp; Pengasuh</strong>:
                    terdapat santri dengan nilai rata-rata di bawah KKM {sidangKkm} (total{' '}
                    <span className="tabular-nums font-bold">{sidangEval.belowKkmRows.length}</span> santri,{' '}
                    <span className="tabular-nums font-bold">{sidangEval.pendingBelowKkmRows.length}</span> belum diputuskan)
                    yang perlu dijadwalkan sidang penentuan Naik / Naik Bersyarat.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('sidang_kenaikan')}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-extrabold whitespace-nowrap shrink-0 shadow-xs"
              >
                Buka &amp; Jadwalkan Sidang →
              </button>
            </div>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Naskah Soal Diajukan</span>
              <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
                {soalSubmissions.length} Soal
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                {soalSubmissions.filter((s) => s.status === 'Disetujui').length} Disetujui Panitia
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Peserta Ujian Aktif</span>
              <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
                {activePutra + activePutri} Santri
              </p>
              <p className="text-[11px] text-blue-700 font-medium mt-0.5">
                {activePutra} Putra · {activePutri} Putri ({susulanCount} Susulan)
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Ruangan Ujian Aktif</span>
              <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
                {ruangUjianList.length} Ruang
              </p>
              <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                Denah Acak Anti-Contek Sekelas
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Saldo Anggaran RAB</span>
              <p className="text-2xl font-black text-slate-900 mt-1 tabular-nums whitespace-nowrap">
                Rp {saldoPokok.toLocaleString('id-ID')}
              </p>
              <p className="text-[11px] text-purple-700 font-medium mt-0.5">
                Pemasukan Rp {totalPemasukan.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold text-slate-600">
              Tampilan Peta Alur &amp; Kendali Imtihan
            </p>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setDashboardViewMode('neural')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  dashboardViewMode === 'neural'
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard Neural Hub
              </button>
              <button
                type="button"
                onClick={() => setDashboardViewMode('flowchart')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  dashboardViewMode === 'flowchart'
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Diagram Alur Klasik
              </button>
            </div>
          </div>

          {dashboardViewMode === 'neural' ? (
            <ImtihanNeuralDashboard
              tahunAjaran={imtihanMaster.tahunAjaran}
              cawu={imtihanMaster.cawu}
              ketuaImtihan={imtihanMaster.ketuaImtihanNama}
              nodes={neuralNodes}
              onSelectStage={(id) => setActiveSubTab(id)}
            />
          ) : (
            <ModuleWorkflowFlowchart
              moduleName="Imtihan"
              alurTitle="Pelaksanaan Imtihan Madrasah Diniyah"
              nodes={alurNodes}
              onSelectStage={(id) => setActiveSubTab(id)}
              pendingApprovals={pendingApprovals}
              ringkasanPanel={[
                {
                  label: 'Tahun Ajaran / Cawu',
                  value: `${imtihanMaster.tahunAjaran} (Cawu ${imtihanMaster.cawu})`,
                  sub: imtihanMaster.tahunHijriyahArab,
                },
                {
                  label: 'Waktu Pelaksanaan',
                  value: imtihanMaster.tanggalPelaksanaan,
                  sub: imtihanMaster.waktuUjian,
                },
                { label: 'Ketua Imtihan', value: imtihanMaster.ketuaImtihanNama },
                { label: 'Bendahara Imtihan', value: 'Ust. M. Abdul Fatah' },
              ]}
            />
          )}
        </div>
      )}

      {/* TAB 2A: KOREKSIAN KITAB SANTRI */}
      {activeSubTab === 'koreksian_kitab' && <KoreksianKitabSubTab />}

      {/* TAB 2B: INPUT NASKAH SOAL GURU */}
      {!isWaliSantri && activeSubTab === 'soal_guru' && <SubTabSoalGuru />}

      {/* TAB 3: REVIEW PANITIA IMTIHAN */}
      {!isWaliSantri && activeSubTab === 'review_panitia' && <SubTabReviewPanitia />}

      {/* TAB 4: CETAK BLANKO SOAL RESMI */}
      {!isWaliSantri && activeSubTab === 'cetak_blanko' && <SubTabCetakBlankoSoal />}

      {/* TAB 4B: VISUALISASI DENAH GEDUNG & LANTAI 2D */}
      {!isWaliSantri && activeSubTab === 'denah_kampus_2d' && <DenahKampus2DSubTab />}

      {/* TAB 5: DENAH RUANGAN & TEMPAT DUDUK (3D + 2D + LABEL BANGKU + TEMPEL KACA) */}
      {!isWaliSantri && activeSubTab === 'denah_ujian' && <SubTabDenahUjian />}

      {/* TAB 6: KARTU IMTIHAN RESMI */}
      {!isWaliSantri && activeSubTab === 'kartu_imtihan' && <KartuImtihanSubTab />}

      {/* TAB 6B: CETAK BLANKO NILAI SANTRI */}
      {!isWaliSantri && activeSubTab === 'blanko_nilai' && <BlankoNilaiSubTab />}

      {/* TAB 7: INPUT NILAI SPREADSHEET */}
      {!isWaliSantri && activeSubTab === 'input_nilai' && <SubTabInputNilaiSpreadsheet />}

      {/* TAB 8: RAPORT SANTRI F4 */}
      {activeSubTab === 'raport_santri' && <SubTabRaportSantri />}

      {/* TAB 9: PERINGKAT & JUARA PARALEL */}
      {activeSubTab === 'peringkat_paralel' && <SubTabPeringkatParalel />}

      {/* TAB 9B: SIDANG KENAIKAN KELAS */}
      {!isWaliSantri && activeSubTab === 'sidang_kenaikan' && <SidangKenaikanSubTab />}

      {/* TAB 10: RAB IMTIHAN */}
      {!isWaliSantri && activeSubTab === 'rab_imtihan' && <RABImtihanEditor />}

      {/* TAB 11: JADWAL MAPEL IMTIHAN */}
      {!isWaliSantri && activeSubTab === 'jadwal_mapel' && <SubTabJadwalMapel />}

      {/* TAB 12: JADWAL JAGA & PIKET */}
      {!isWaliSantri && activeSubTab === 'jaga_piket' && <SubTabJagaPiket />}
    </div>
  );
};

/* =========================================================================
   SUB-TAB 2: INPUT SOAL OLEH GURU (MASTER REGULASI + KEYBOARD ARAB/PEGON/HAROKAT)
========================================================================= */
const ARABIC_ALPHABET = [
  'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص',
  'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'و', 'ه', 'ي',
  'ة', 'ى', 'أ', 'إ', 'آ', 'ؤ', 'ئ', 'ء', 'لا',
];

const PEGON_JAWA_LETTERS = ['چ', 'ڠ', 'ڤ', 'ڮ', 'ۑ', 'ۏ', 'ـ'];

const ARABIC_HAROKAT = [
  { char: 'َ', label: 'Fathah (ـَ)' },
  { char: 'ِ', label: 'Kasrah (ـِ)' },
  { char: 'ُ', label: 'Dhammah (ـُ)' },
  { char: 'ً', label: 'Fathatain (ـً)' },
  { char: 'ٍ', label: 'Kasratain (ـٍ)' },
  { char: 'ٌ', label: 'Dhammatain (ـٌ)' },
  { char: 'ْ', label: 'Sukun (ـْ)' },
  { char: 'ّ', label: 'Tasydid (ـّ)' },
  { char: 'ٰ', label: 'Alif Khanjariyah' },
  { char: '؟', label: 'Tanya (؟)' },
  { char: '،', label: 'Koma (،)' },
];

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

const arabicIndicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const toArabicNumber = (num: number): string => {
  return String(num)
    .padStart(2, '0')
    .split('')
    .map((d) => arabicIndicDigits[parseInt(d)] || d)
    .join('');
};

type FocusTarget =
  | { kind: 'essay'; idx: number }
  | { kind: 'romawi_title'; rIdx: number }
  | { kind: 'romawi_q'; rIdx: number; qIdx: number }
  | { kind: 'pg_q'; pIdx: number }
  | { kind: 'pg_opt'; pIdx: number; opt: 'opsiA' | 'opsiB' | 'opsiC' | 'opsiD' };

const SubTabSoalGuru: React.FC = () => {
  const { currentUser, mapelList, ustadzList, createOrUpdateSoal, imtihanMaster } = useAppStore();

  const [selectedMapelId, setSelectedMapelId] = useState(mapelList[0]?.id || 'm-06');
  const currentMapel = mapelList.find((m) => m.id === selectedMapelId) || mapelList[0];

  const matchedUstadz = ustadzList.find(
    (u) =>
      u.nama.toLowerCase().includes((currentMapel?.guruPengampu || '').toLowerCase().split(' ').slice(-1)[0]) ||
      u.nama === currentUser.nama
  );

  const [guruNamaLatin, setGuruNamaLatin] = useState(currentMapel?.guruPengampu || currentUser.nama);
  const [guruNamaArab, setGuruNamaArab] = useState(matchedUstadz?.namaArab || 'عبد الرحمن');

  // Master Regulasi Soal
  const [tipeSoal, setTipeSoal] = useState<SoalRegulasi['tipeSoal']>('Essay');
  const [jumlahRomawiEssay, setJumlahRomawiEssay] = useState<number>(1);
  const [jumlahPilihanGanda, setJumlahPilihanGanda] = useState<number>(0);

  // Essay standar (Romawi 1)
  const [soalEntries, setSoalEntries] = useState<
    { nomor: string; pertanyaanArab: string; kunciJawaban: string; bobot: number }[]
  >([
    {
      nomor: '٠١',
      pertanyaanArab:
        'أدا برافـا ماچام-ماچام أير يـاغ بولـيه دي كوناكـان أونتـوك برسوچـي ؟ سبوتكـان أفا ساجـا !',
      kunciJawaban:
        'Air yang suci menyucikan ada 7 macam: air hujan, laut, sungai, sumur, mata air, salju, dan embun.',
      bobot: 20,
    },
    {
      nomor: '٠٢',
      pertanyaanArab:
        'كوليت-كوليت بـاغكـاي بيناتـاغ منجـادي سوچـي جيكـا سوداه دي سامـاك، بكايمـانـا چـارا مپامـاك كوليت ترسبـوت ؟',
      kunciJawaban: 'Menyamak dengan menghilangkan lendir dan sisa daging dengan benda kelat.',
      bobot: 20,
    },
  ]);

  // Multi-Romawi Essay Sections (when jumlahRomawiEssay > 1)
  const [romawiSections, setRomawiSections] = useState<RomawiSection[]>([
    {
      judulArab: 'القسم الأول : أجب هذه الأسئلة الآتية بإجابة صحيحة !',
      soalList: [
        {
          nomor: '٠١',
          pertanyaanArab:
            'أدا برافـا ماچام-ماچام أير يـاغ بولـيه دي كوناكـان أونتـوك برسوچـي ؟ سبوتكـان أفا ساجـا !',
          kunciJawaban: '',
          bobot: 20,
        },
      ],
    },
  ]);

  // Pilihan Ganda Items
  const [pilihanGandaList, setPilihanGandaList] = useState<PilihanGandaItem[]>([]);

  // Active keyboard tab & target field
  const [kbCategory, setKbCategory] = useState<'pegon' | 'hijaiyah' | 'harokat'>('pegon');
  const [focusTarget, setFocusTarget] = useState<FocusTarget>({ kind: 'essay', idx: 0 });
  const [notification, setNotification] = useState<string>('');

  // Konverter Soal AI (Foto / Teks Bahasa Indonesia -> Pegon Jawa / Bahasa Arab Berharokat)
  const [aiTargetLang, setAiTargetLang] = useState<'pegon' | 'arab'>('pegon');
  const [aiRawText, setAiRawText] = useState<string>('');
  const [aiImageBase64, setAiImageBase64] = useState<string>('');
  const [aiImageName, setAiImageName] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>('');

  const handleAiImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAiImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAiImageBase64(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConvertWithAI = async () => {
    if (!aiRawText.trim() && !aiImageBase64) {
      setAiError('Unggah foto lembar soal atau tempelkan teks soal bahasa Indonesia terlebih dahulu.');
      return;
    }
    setAiLoading(true);
    setAiError('');
    try {
      const resp = await fetch('/api/imtihan/convert-soal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: aiRawText,
          imageBase64: aiImageBase64 || undefined,
          targetLanguage: aiTargetLang,
          mapel: currentMapel?.nama || 'Diniyah',
          tingkat: currentMapel?.tingkat || 2,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !Array.isArray(data.items) || data.items.length === 0) {
        throw new Error(data.error || 'Gagal mengonversi naskah soal.');
      }
      const mapped: {
        nomor: string;
        pertanyaanArab: string;
        kunciJawaban: string;
        bobot: number;
      }[] = data.items.map(
        (it: { nomor?: string; pertanyaanArab?: string; kunciJawaban?: string }, idx: number) => ({
          nomor: it.nomor || toArabicNumber(idx + 1),
          pertanyaanArab: it.pertanyaanArab || '',
          kunciJawaban: it.kunciJawaban || '',
          bobot: Math.max(5, Math.round(100 / data.items.length)),
        })
      );

      if (tipeSoal === 'Pilihan Ganda') {
        setJumlahPilihanGanda(mapped.length);
        setPilihanGandaList(
          mapped.map((m) => ({
            nomor: m.nomor,
            pertanyaanArab: m.pertanyaanArab,
            opsiA: '',
            opsiB: '',
            opsiC: '',
            opsiD: '',
            kunci: 'A',
            bobot: m.bobot,
          }))
        );
      } else if (jumlahRomawiEssay > 1) {
        setRomawiSections((prev) => {
          const next = [...prev];
          if (next[0]) {
            next[0] = { ...next[0], soalList: mapped };
          } else {
            next.push({
              judulArab: 'أولاً : أجب عن الأسئلة الآتية بإجابة صحيحة !',
              soalList: mapped,
            });
          }
          return next;
        });
      } else {
        setSoalEntries(mapped);
      }

      setNotification(
        `Berhasil mengonversi ${mapped.length} butir soal ke ${
          aiTargetLang === 'pegon' ? 'Arab Pegon Jawa' : 'Bahasa Arab Berharokat'
        } dan memasukkannya ke editor!`
      );
      setTimeout(() => setNotification(''), 5000);
    } catch (err: any) {
      setAiError(err?.message || 'Terjadi kesalahan saat konversi AI.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSelectMapel = (id: string) => {
    setSelectedMapelId(id);
    const m = mapelList.find((mp) => mp.id === id);
    if (m) {
      setGuruNamaLatin(m.guruPengampu);
      const u = ustadzList.find((us) =>
        us.nama.toLowerCase().includes(m.guruPengampu.toLowerCase().split(' ').slice(-1)[0])
      );
      if (u) setGuruNamaArab(u.namaArab);
    }
  };

  const applyRegulasiTemplate = () => {
    const romawiTitles = [
      'أولاً : أجب عن الأسئلة الآتية بإجابة صحيحة !',
      'ثانياً : اشرح المسائل الآتية شرحاً واضحاً !',
      'ثالثاً : ترجم إلى اللغة العربية / الجاوية !',
    ];

    if (tipeSoal === 'Essay' || tipeSoal === 'Campuran') {
      if (jumlahRomawiEssay > 1) {
        setRomawiSections((prev) => {
          const next: RomawiSection[] = [];
          for (let i = 0; i < jumlahRomawiEssay; i++) {
            if (prev[i]) {
              next.push(prev[i]);
            } else {
              next.push({
                judulArab: romawiTitles[i] || `القسم ${toArabicNumber(i + 1)}`,
                soalList: [
                  {
                    nomor: '٠١',
                    pertanyaanArab: '',
                    kunciJawaban: '',
                    bobot: 10,
                  },
                ],
              });
            }
          }
          return next;
        });
      }
    }

    if (tipeSoal === 'Pilihan Ganda' || tipeSoal === 'Campuran') {
      const targetPg = Math.max(1, jumlahPilihanGanda || 5);
      setJumlahPilihanGanda(targetPg);
      setPilihanGandaList((prev) => {
        const next: PilihanGandaItem[] = [];
        for (let i = 0; i < targetPg; i++) {
          next.push(
            prev[i] || {
              nomor: toArabicNumber(i + 1),
              pertanyaanArab: '',
              opsiA: '',
              opsiB: '',
              opsiC: '',
              opsiD: '',
              kunci: 'A',
              bobot: 2,
            }
          );
        }
        return next;
      });
    } else {
      setPilihanGandaList([]);
    }

    setNotification(
      `Regulasi soal (${tipeSoal}, ${jumlahRomawiEssay} Romawi Essay, ${
        tipeSoal === 'Essay' ? 0 : jumlahPilihanGanda || 5
      } PG) berhasil diterapkan.`
    );
    setTimeout(() => setNotification(''), 3500);
  };

  const insertCharToFocused = (char: string) => {
    if (focusTarget.kind === 'essay') {
      setSoalEntries((prev) =>
        prev.map((it, i) =>
          i === focusTarget.idx ? { ...it, pertanyaanArab: it.pertanyaanArab + char } : it
        )
      );
    } else if (focusTarget.kind === 'romawi_title') {
      setRomawiSections((prev) =>
        prev.map((sec, rI) =>
          rI === focusTarget.rIdx ? { ...sec, judulArab: sec.judulArab + char } : sec
        )
      );
    } else if (focusTarget.kind === 'romawi_q') {
      setRomawiSections((prev) =>
        prev.map((sec, rI) =>
          rI === focusTarget.rIdx
            ? {
                ...sec,
                soalList: sec.soalList.map((q, qI) =>
                  qI === focusTarget.qIdx ? { ...q, pertanyaanArab: q.pertanyaanArab + char } : q
                ),
              }
            : sec
        )
      );
    } else if (focusTarget.kind === 'pg_q') {
      setPilihanGandaList((prev) =>
        prev.map((pg, pI) =>
          pI === focusTarget.pIdx ? { ...pg, pertanyaanArab: pg.pertanyaanArab + char } : pg
        )
      );
    } else if (focusTarget.kind === 'pg_opt') {
      setPilihanGandaList((prev) =>
        prev.map((pg, pI) =>
          pI === focusTarget.pIdx
            ? { ...pg, [focusTarget.opt]: pg[focusTarget.opt] + char }
            : pg
        )
      );
    }
  };

  const handleAddQuestion = () => {
    const nextIdx = soalEntries.length + 1;
    setSoalEntries((prev) => [
      ...prev,
      { nomor: toArabicNumber(nextIdx), pertanyaanArab: '', kunciJawaban: '', bobot: 10 },
    ]);
  };

  const handleSaveDraft = (status: 'Draf' | 'Diajukan') => {
    const useMultiRomawi =
      (tipeSoal === 'Essay' || tipeSoal === 'Campuran') && jumlahRomawiEssay > 1;
    const flatEssay =
      tipeSoal === 'Pilihan Ganda'
        ? []
        : useMultiRomawi
        ? romawiSections.flatMap((r) => r.soalList)
        : soalEntries;

    createOrUpdateSoal({
      mapelId: currentMapel.id,
      mapelNama: currentMapel.nama,
      mapelArab: currentMapel.namaArab,
      kelas:
        DAFTAR_KELAS_DINIYAH.find((k) => k.startsWith(String(currentMapel.tingkat))) ||
        `${currentMapel.tingkat} A PUTRA`,
      guruId: currentUser.id,
      guruNama: guruNamaLatin,
      guruNamaArab: guruNamaArab,
      semester: imtihanMaster.cawu === '2' ? 'Genap' : 'Gasal',
      status,
      instruksiArab: 'أجب هذه الأسئلة بإجابة صحيحة !',
      regulasi: {
        tipeSoal,
        jumlahRomawiEssay: tipeSoal === 'Pilihan Ganda' ? 0 : jumlahRomawiEssay,
        jumlahPilihanGanda: tipeSoal === 'Essay' ? 0 : pilihanGandaList.length,
      },
      romawiSections: useMultiRomawi ? romawiSections : undefined,
      pilihanGandaList: tipeSoal === 'Essay' ? undefined : pilihanGandaList,
      soalList: flatEssay,
    });

    setNotification(
      status === 'Diajukan'
        ? 'Naskah soal berhasil diajukan ke Panitia Imtihan dan siap dicetak di Blanko.'
        : 'Draf naskah soal berhasil disimpan ke sistem.'
    );
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <div className="space-y-5">
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Master Regulasi Soal & Identitas Pengampu */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
            <Settings className="w-4 h-4" />
            <span>Master Regulasi Naskah Soal Guru</span>
          </h3>
          <span className="text-[11px] text-slate-500">
            Kelas 1–2 umumnya Pegon Jawa · Kelas 3–6 Bahasa Arab berharokat
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mata Pelajaran & Kitab
            </label>
            <select
              value={selectedMapelId}
              onChange={(e) => handleSelectMapel(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold"
            >
              {mapelList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama} (Tingkat {m.tingkat}) - {m.kitab}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Ustadz Pengampu (Latin)
            </label>
            <input
              type="text"
              value={guruNamaLatin}
              onChange={(e) => setGuruNamaLatin(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Ustadz di Kop Blanko (Arab)
            </label>
            <input
              type="text"
              dir="rtl"
              value={guruNamaArab}
              onChange={(e) => setGuruNamaArab(e.target.value)}
              placeholder="مثال: الأستاذ عبد الرحمن"
              className="w-full rounded-xl border border-emerald-300 bg-emerald-50/40 px-3 py-1.5 text-base font-arabic text-right font-bold"
            />
          </div>
        </div>

        {/* Regulasi Format Soal */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Jenis / Format Soal</label>
            <select
              value={tipeSoal}
              onChange={(e) => setTipeSoal(e.target.value as SoalRegulasi['tipeSoal'])}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold"
            >
              <option value="Essay">Essay / Uraian Saja</option>
              <option value="Pilihan Ganda">Pilihan Ganda (PG) Saja</option>
              <option value="Campuran">Campuran (PG + Essay)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Jumlah Romawi Essay
            </label>
            <input
              type="number"
              min={0}
              max={5}
              disabled={tipeSoal === 'Pilihan Ganda'}
              value={tipeSoal === 'Pilihan Ganda' ? 0 : jumlahRomawiEssay}
              onChange={(e) => setJumlahRomawiEssay(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Jumlah Butir Pilihan Ganda
            </label>
            <input
              type="number"
              min={0}
              max={40}
              disabled={tipeSoal === 'Essay'}
              value={tipeSoal === 'Essay' ? 0 : jumlahPilihanGanda}
              onChange={(e) => setJumlahPilihanGanda(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold disabled:bg-slate-100"
            />
          </div>

          <button
            type="button"
            onClick={applyRegulasiTemplate}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition shadow-xs"
          >
            Terapkan Regulasi Soal
          </button>
        </div>
      </div>

      {/* Konverter Foto / Teks Soal Indonesia -> Pegon Jawa / Arab Berharokat */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-50/80 to-white p-5 border border-emerald-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-2.5">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Konverter Otomatis Soal Foto / Bahasa Indonesia → Arab Pegon &amp; Arab Berharokat</span>
            </h3>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Unggah foto naskah soal (misal 15 butir Bahasa Indonesia) atau tempelkan teksnya, lalu konversi langsung menjadi aksara Arab Pegon Jawa (Kelas 1–2) atau Bahasa Arab Berharokat lengkap (Kelas 3–6).
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setAiTargetLang('pegon')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition ${
                aiTargetLang === 'pegon'
                  ? 'bg-emerald-800 text-white border-emerald-800'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              Arab Pegon Jawa
            </button>
            <button
              type="button"
              onClick={() => setAiTargetLang('arab')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition ${
                aiTargetLang === 'arab'
                  ? 'bg-emerald-800 text-white border-emerald-800'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              Bahasa Arab Berharokat
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="rounded-xl border border-dashed border-emerald-300 bg-white p-3 flex flex-col justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold text-slate-700 mb-1">1. Unggah Foto Soal (Opsional)</p>
              <label className="cursor-pointer flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 transition">
                <Upload className="w-3.5 h-3.5" />
                <span>{aiImageName ? 'Ganti Foto Soal' : 'Pilih Foto Lembar Soal'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAiImageUpload}
                  className="hidden"
                />
              </label>
              {aiImageName && (
                <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-800 font-semibold">
                  <span className="truncate max-w-[180px]">{aiImageName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAiImageBase64('');
                      setAiImageName('');
                    }}
                    className="text-rose-600 hover:underline ml-2"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </div>
            {aiImageBase64 && (
              <img
                src={aiImageBase64}
                alt="Pratinjau foto soal"
                className="max-h-28 w-full object-contain rounded-lg border border-slate-200 bg-slate-50"
              />
            )}
          </div>

          <div className="lg:col-span-2 flex flex-col gap-2">
            <label className="text-[11px] font-bold text-slate-700">
              2. Atau Tempelkan Daftar Soal Bahasa Indonesia (1–15+ butir):
            </label>
            <textarea
              rows={4}
              value={aiRawText}
              onChange={(e) => setAiRawText(e.target.value)}
              placeholder={"Contoh:\n1. Ada berapa macam air yang suci dan menyucikan? Sebutkan!\n2. Sebutkan rukun wudhu secara urut!\n3. ..."}
              className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs focus:border-emerald-700 focus:outline-hidden"
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              {aiError ? (
                <span className="text-[11px] font-bold text-rose-700">{aiError}</span>
              ) : (
                <span className="text-[11px] text-slate-500">
                  Hasil konversi otomatis masuk ke daftar butir soal di bawah &amp; bisa diedit manual.
                </span>
              )}
              <button
                type="button"
                disabled={aiLoading}
                onClick={handleConvertWithAI}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white text-xs font-bold flex items-center gap-2 shadow-xs"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengonversi Soal...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      Konversi ke {aiTargetLang === 'pegon' ? 'Arab Pegon Jawa' : 'Arab Berharokat'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Virtual Keyboard Arab, Harokat & Pegon Jawa Lengkap */}
      <div className="sticky top-2 z-20 rounded-2xl bg-white/95 backdrop-blur-xs p-3.5 border border-emerald-200 shadow-md space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-emerald-950 mr-1">
              Keyboard Arab & Pegon:
            </span>
            <button
              type="button"
              onClick={() => setKbCategory('pegon')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                kbCategory === 'pegon'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Pegon Jawa + Angka Arab
            </button>
            <button
              type="button"
              onClick={() => setKbCategory('hijaiyah')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                kbCategory === 'hijaiyah'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Huruf Hijaiyah Lengkap (ا - ي)
            </button>
            <button
              type="button"
              onClick={() => setKbCategory('harokat')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                kbCategory === 'harokat'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Harokat & Tanda Baca (Kelas 3–6)
            </button>
          </div>
          <span className="text-[10px] text-slate-500">
            Klik kotak input soal terlebih dahulu lalu ketuk huruf di sini
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5" dir="rtl">
          {kbCategory === 'pegon' && (
            <>
              {PEGON_JAWA_LETTERS.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => insertCharToFocused(ch)}
                  className="min-w-8 h-8 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-200 text-emerald-950 font-arabic text-base font-bold border border-emerald-200 transition"
                >
                  {ch}
                </button>
              ))}
              <span className="mx-1 text-slate-300">|</span>
              {ARABIC_DIGITS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => insertCharToFocused(d)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-900 font-arabic text-base font-bold border border-slate-200 transition"
                >
                  {d}
                </button>
              ))}
            </>
          )}

          {kbCategory === 'hijaiyah' &&
            ARABIC_ALPHABET.map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => insertCharToFocused(ch)}
                className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-emerald-100 text-slate-900 font-arabic text-base font-bold border border-slate-200 transition"
              >
                {ch}
              </button>
            ))}

          {kbCategory === 'harokat' &&
            ARABIC_HAROKAT.map((hk) => (
              <button
                key={hk.label}
                type="button"
                onClick={() => insertCharToFocused(hk.char)}
                className="px-2.5 h-8 rounded-lg bg-amber-50 hover:bg-amber-200 text-amber-950 text-xs font-bold border border-amber-200 transition flex items-center gap-1.5"
              >
                <span className="font-arabic text-lg leading-none">{hk.char}</span>
                <span className="text-[10px] font-sans" dir="ltr">
                  {hk.label}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* Pilihan Ganda Editor (when PG or Campuran) */}
      {(tipeSoal === 'Pilihan Ganda' || tipeSoal === 'Campuran') && pilihanGandaList.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Bagian Pilihan Ganda ({pilihanGandaList.length} Butir)
          </h4>
          {pilihanGandaList.map((pg, pIdx) => (
            <div
              key={pIdx}
              className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-800 text-white font-arabic text-sm font-bold flex items-center justify-center">
                    {pg.nomor}
                  </span>
                  <span className="text-xs font-bold text-slate-800">PG Nomor {pIdx + 1}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Kunci:</span>
                  <select
                    value={pg.kunci || 'A'}
                    onChange={(e) => {
                      const k = e.target.value as 'A' | 'B' | 'C' | 'D';
                      setPilihanGandaList((prev) =>
                        prev.map((it, i) => (i === pIdx ? { ...it, kunci: k } : it))
                      );
                    }}
                    className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-bold"
                  >
                    <option value="A">أ (A)</option>
                    <option value="B">ب (B)</option>
                    <option value="C">ج (C)</option>
                    <option value="D">د (D)</option>
                  </select>
                </div>
              </div>

              <textarea
                dir="rtl"
                rows={2}
                onFocus={() => setFocusTarget({ kind: 'pg_q', pIdx })}
                value={pg.pertanyaanArab}
                onChange={(e) => {
                  const val = e.target.value;
                  setPilihanGandaList((prev) =>
                    prev.map((it, i) => (i === pIdx ? { ...it, pertanyaanArab: val } : it))
                  );
                }}
                placeholder="توليس سوءال فيليهان كندا دي سيني..."
                className="w-full rounded-xl border border-slate-300 p-2.5 text-base font-arabic text-right focus:border-emerald-600 focus:outline-hidden"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" dir="rtl">
                {(
                  [
                    { key: 'opsiA', arab: 'أ' },
                    { key: 'opsiB', arab: 'ب' },
                    { key: 'opsiC', arab: 'ج' },
                    { key: 'opsiD', arab: 'د' },
                  ] as const
                ).map(({ key, arab }) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="font-arabic font-bold text-sm text-emerald-900 w-5">{arab}.</span>
                    <input
                      type="text"
                      dir="rtl"
                      onFocus={() => setFocusTarget({ kind: 'pg_opt', pIdx, opt: key })}
                      value={pg[key]}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPilihanGandaList((prev) =>
                          prev.map((it, i) => (i === pIdx ? { ...it, [key]: val } : it))
                        );
                      }}
                      placeholder={`جوابان ${arab}...`}
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-arabic text-right"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Multi-Romawi Essay Editor */}
      {(tipeSoal === 'Essay' || tipeSoal === 'Campuran') && jumlahRomawiEssay > 1 && (
        <div className="space-y-5">
          {romawiSections.map((sec, rIdx) => (
            <div
              key={rIdx}
              className="rounded-2xl bg-white p-5 border-2 border-emerald-200 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <span className="text-xs font-extrabold text-emerald-900">
                  Romawi {rIdx + 1} (Judul Instruksi Arab/Pegon):
                </span>
                <input
                  type="text"
                  dir="rtl"
                  onFocus={() => setFocusTarget({ kind: 'romawi_title', rIdx })}
                  value={sec.judulArab}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRomawiSections((prev) =>
                      prev.map((s, i) => (i === rIdx ? { ...s, judulArab: val } : s))
                    );
                  }}
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 font-arabic text-base text-right font-bold"
                />
              </div>

              {sec.soalList.map((item, qIdx) => (
                <div key={qIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Romawi {rIdx + 1} · Nomor {qIdx + 1} ({item.nomor})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setRomawiSections((prev) =>
                          prev.map((s, i) =>
                            i === rIdx
                              ? { ...s, soalList: s.soalList.filter((_, qi) => qi !== qIdx) }
                              : s
                          )
                        )
                      }
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    dir="rtl"
                    rows={2}
                    onFocus={() => setFocusTarget({ kind: 'romawi_q', rIdx, qIdx })}
                    value={item.pertanyaanArab}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRomawiSections((prev) =>
                        prev.map((s, i) =>
                          i === rIdx
                            ? {
                                ...s,
                                soalList: s.soalList.map((q, qi) =>
                                  qi === qIdx ? { ...q, pertanyaanArab: val } : q
                                ),
                              }
                            : s
                        )
                      );
                    }}
                    placeholder="توليس سوءال دي سيني..."
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-base font-arabic text-right"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setRomawiSections((prev) =>
                    prev.map((s, i) =>
                      i === rIdx
                        ? {
                            ...s,
                            soalList: [
                              ...s.soalList,
                              {
                                nomor: toArabicNumber(s.soalList.length + 1),
                                pertanyaanArab: '',
                                kunciJawaban: '',
                                bobot: 10,
                              },
                            ],
                          }
                        : s
                    )
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Soal di Romawi {rIdx + 1}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Standard Single-Romawi Essay Editor */}
      {(tipeSoal === 'Essay' || tipeSoal === 'Campuran') && jumlahRomawiEssay <= 1 && (
        <div className="space-y-4">
          {soalEntries.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-emerald-800 text-white font-arabic text-base font-bold flex items-center justify-center">
                    {item.nomor}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    Pertanyaan Nomor {idx + 1}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Bobot:</span>
                  <input
                    type="number"
                    value={item.bobot}
                    onChange={(e) => {
                      const b = parseInt(e.target.value) || 0;
                      setSoalEntries((prev) =>
                        prev.map((it, i) => (i === idx ? { ...it, bobot: b } : it))
                      );
                    }}
                    className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-xs text-center font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setSoalEntries((prev) => prev.filter((_, i) => i !== idx))}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                    title="Hapus Soal Ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Teks Pertanyaan (Arab / Pegon Jawa):
                </label>
                <textarea
                  dir="rtl"
                  rows={2}
                  onFocus={() => setFocusTarget({ kind: 'essay', idx })}
                  value={item.pertanyaanArab}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSoalEntries((prev) =>
                      prev.map((it, i) => (i === idx ? { ...it, pertanyaanArab: val } : it))
                    );
                  }}
                  placeholder="توليس سوءال دي سيني..."
                  className="w-full rounded-xl border border-slate-300 p-3 text-base font-arabic text-right leading-loose focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Kunci Jawaban / Pedoman Penilaian (Opsional):
                </label>
                <input
                  type="text"
                  value={item.kunciJawaban}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSoalEntries((prev) =>
                      prev.map((it, i) => (i === idx ? { ...it, kunciJawaban: val } : it))
                    );
                  }}
                  placeholder="Jawaban ringkas / referensi halaman kitab..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {(tipeSoal === 'Essay' || tipeSoal === 'Campuran') && jumlahRomawiEssay <= 1 ? (
          <button
            type="button"
            onClick={handleAddQuestion}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>Tambah Butir Soal</span>
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSaveDraft('Draf')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            Simpan Draf
          </button>
          <button
            type="button"
            onClick={() => handleSaveDraft('Diajukan')}
            className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Ajukan ke Panitia Imtihan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   SUB-TAB 3: REVIEW SOAL DARI GURU (PANITIA IMTIHAN)
========================================================================= */
const SubTabReviewPanitia: React.FC = () => {
  const { soalSubmissions, updateSoalStatus } = useAppStore();
  const [selectedSoalId, setSelectedSoalId] = useState<string | null>(null);
  const [revisiNote, setRevisiNote] = useState<string>('');

  const activeSoal = soalSubmissions.find((s) => s.id === selectedSoalId);

  const countButir = (s: SoalSubmission) => {
    const essayCount = s.romawiSections
      ? s.romawiSections.reduce((acc, r) => acc + r.soalList.length, 0)
      : s.soalList.length;
    const pgCount = s.pilihanGandaList?.length || 0;
    return essayCount + pgCount;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs">
        <h3 className="font-bold text-sm text-slate-900 mb-1">
          Daftar Naskah Soal Masuk dari Dewan Guru
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Tinjau teks naskah Arab/Pegon (sesuai tepat jumlah butir), berikan catatan revisi bila diperlukan, dan setujui untuk siap dicetak.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-left">
                <th className="py-2.5">Mata Pelajaran</th>
                <th className="py-2.5">Kelas</th>
                <th className="py-2.5">Guru Pengampu</th>
                <th className="py-2.5 text-center">Jumlah Soal</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {soalSubmissions.map((soal) => (
                <tr key={soal.id} className="hover:bg-slate-50">
                  <td className="py-3 font-bold text-slate-900">
                    {soal.mapelNama}
                    <span className="block text-[11px] font-normal text-emerald-800 font-arabic">
                      {soal.mapelArab}
                    </span>
                  </td>
                  <td className="py-3 text-slate-700">{soal.kelas}</td>
                  <td className="py-3 text-slate-700">
                    {soal.guruNama}
                    {soal.guruNamaArab && (
                      <span className="block text-[11px] font-arabic text-slate-500">
                        {soal.guruNamaArab}
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-center font-bold tabular-nums">
                    {countButir(soal)} butir
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        soal.status === 'Disetujui'
                          ? 'bg-emerald-100 text-emerald-800'
                          : soal.status === 'Diajukan'
                          ? 'bg-amber-100 text-amber-800'
                          : soal.status === 'Perlu Revisi'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {soal.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedSoalId(soal.id);
                        setRevisiNote(soal.catatanRevisi || '');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-800 hover:text-white text-slate-700 font-bold transition text-xs"
                    >
                      Tinjau Naskah
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Drawer / Modal */}
      {activeSoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 no-print print:hidden">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Tinjauan Naskah: {activeSoal.mapelNama} ({activeSoal.kelas})
                </h3>
                <p className="text-xs text-slate-500">
                  Guru: {activeSoal.guruNama}{' '}
                  {activeSoal.guruNamaArab && `(${activeSoal.guruNamaArab})`} ·{' '}
                  <strong>{countButir(activeSoal)} butir</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedSoalId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 max-h-80 overflow-y-auto">
              <p className="text-center font-arabic text-base font-bold text-slate-800">
                {activeSoal.instruksiArab}
              </p>

              {activeSoal.pilihanGandaList && activeSoal.pilihanGandaList.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-blue-900">Pilihan Ganda:</p>
                  {activeSoal.pilihanGandaList.map((pg, i) => (
                    <div key={i} className="p-3 bg-white rounded-xl border border-slate-200" dir="rtl">
                      <p className="font-arabic text-base text-slate-800">
                        {pg.nomor}. {pg.pertanyaanArab}
                      </p>
                      <p className="font-arabic text-sm text-slate-600 mt-1">
                        أ. {pg.opsiA} &nbsp;|&nbsp; ب. {pg.opsiB} &nbsp;|&nbsp; ج. {pg.opsiC} &nbsp;|&nbsp; د. {pg.opsiD}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeSoal.soalList.map((item, i) => (
                <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-start justify-between gap-3" dir="rtl">
                    <span className="font-arabic text-base font-bold text-emerald-900 shrink-0">
                      {item.nomor}.
                    </span>
                    <p className="font-arabic text-base text-slate-800 leading-loose flex-1 text-right">
                      {item.pertanyaanArab}
                    </p>
                  </div>
                  {item.kunciJawaban && (
                    <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-1 mt-1">
                      <strong>Kunci:</strong> {item.kunciJawaban}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Catatan Revisi untuk Guru (Bila ada):
              </label>
              <textarea
                rows={2}
                value={revisiNote}
                onChange={(e) => setRevisiNote(e.target.value)}
                placeholder="Tuliskan catatan perbaikan kalimat, harakat, atau bobot..."
                className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <button
                onClick={() => {
                  updateSoalStatus(activeSoal.id, 'Perlu Revisi', revisiNote);
                  setSelectedSoalId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs transition"
              >
                Minta Revisi ke Guru
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSoalId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    updateSoalStatus(activeSoal.id, 'Disetujui');
                    setSelectedSoalId(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Setujui Naskah Soal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   SUB-TAB 4: CETAK BLANKO SOAL RESMI (REPLIKA LAMPIRAN E)
========================================================================= */
const SubTabCetakBlankoSoal: React.FC = () => {
  const { soalSubmissions, santriList, imtihanMaster, printOrientation } = useAppStore();
  const [selectedSoalId, setSelectedSoalId] = useState(soalSubmissions[0]?.id || '');
  const [paperSize, setPaperSize] = useState<'A4' | 'F4'>('F4');
  const [modeBlanko, setModeBlanko] = useState<'blanko' | 'terisi'>('blanko');
  const [selectedSemester, setSelectedSemester] = useState<'gasal' | 'genap'>(
    imtihanMaster.cawu === '2' ? 'genap' : 'gasal'
  );
  const [selectedSantriId, setSelectedSantriId] = useState<string>(santriList[0]?.id || '');
  const blankoWrapRef = useRef<HTMLDivElement | null>(null);

  const activeSoal = soalSubmissions.find((s) => s.id === selectedSoalId) || soalSubmissions[0];
  const activeSantri = santriList.find((s) => s.id === selectedSantriId) || santriList[0];

  const handlePrintBlanko = () => {
    const targetEl =
      blankoWrapRef.current?.querySelector<HTMLElement>('.printable-area') || blankoWrapRef.current;
    triggerReliablePrint({
      title: `Blanko Soal ${activeSoal?.mapelNama || 'Imtihan'} (${activeSoal?.kelas || ''})`,
      orientation: printOrientation,
      paperSize,
      targetElement: targetEl,
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs space-y-3 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Printer className="w-4 h-4 text-emerald-700" />
              <span>Blanko Soal Resmi Imtihan (Lampiran E)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Mencetak persis jumlah butir soal yang dibuat guru, dengan nama ustadz berbahasa Arab di kop.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <PrintOrientationControl recommended="portrait" />
            <button
              type="button"
              onClick={handlePrintBlanko}
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition shadow-xs flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Lembar Blanko ({paperSize})</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Naskah Mapel:</label>
            <select
              value={selectedSoalId}
              onChange={(e) => setSelectedSoalId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-1.5 font-medium"
            >
              {soalSubmissions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.mapelNama} ({s.kelas}) - {s.soalList.length + (s.pilihanGandaList?.length || 0)} Butir
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mode Pengisian:</label>
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                onClick={() => setModeBlanko('blanko')}
                className={`flex-1 py-1 rounded-lg font-bold text-xs transition ${
                  modeBlanko === 'blanko' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Blanko Kosong
              </button>
              <button
                onClick={() => setModeBlanko('terisi')}
                className={`flex-1 py-1 rounded-lg font-bold text-xs transition ${
                  modeBlanko === 'terisi' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Pratinjau Terisi
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Cawu / Semester:</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value as 'gasal' | 'genap')}
              className="w-full rounded-xl border border-slate-300 px-3 py-1.5 font-medium"
            >
              <option value="gasal">Cawu 1 (نصف العام الأول)</option>
              <option value="genap">Cawu 2 (نصف العام الثاني)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Ukuran Kertas:</label>
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                onClick={() => setPaperSize('F4')}
                className={`flex-1 py-1 rounded-lg font-bold text-xs transition ${
                  paperSize === 'F4' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                F4 / Folio
              </button>
              <button
                onClick={() => setPaperSize('A4')}
                className={`flex-1 py-1 rounded-lg font-bold text-xs transition ${
                  paperSize === 'A4' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                A4
              </button>
            </div>
          </div>
        </div>

        {modeBlanko === 'terisi' && (
          <div className="pt-2 border-t border-slate-100 flex items-center gap-3 text-xs">
            <span className="font-bold text-slate-700">Simulasi Santri:</span>
            <select
              value={selectedSantriId}
              onChange={(e) => setSelectedSantriId(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-1 font-medium"
            >
              {santriList.slice(0, 30).map((s, idx) => (
                <option key={s.id} value={s.id}>
                  No. {idx + 1} - {s.nama} ({s.kelas})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div ref={blankoWrapRef}>
        <TemplateBlankoImtihan
          mapelArab={activeSoal?.mapelArab || 'الفقه'}
          mapelLatin={activeSoal?.mapelNama || 'Fiqih Tingkat 2'}
          kelas={activeSoal?.kelas || 'الأول للبنين'}
          guruPengampu={activeSoal?.guruNamaArab || activeSoal?.guruNama || 'عبد الرحمن'}
          semester={selectedSemester}
          tahunAjaran={imtihanMaster.tahunHijriyahArab || '١٤٤٧ - ١٤٤٨ هـ'}
          mode={modeBlanko}
          santriNama={modeBlanko === 'terisi' ? activeSantri?.nama : ''}
          noAbsen={modeBlanko === 'terisi' ? '12' : ''}
          tanggal={modeBlanko === 'terisi' ? 'الأحد، ٧ جمادى الآخرة ١٤٤٨ هـ' : ''}
          showInstruction={true}
          instructionText={activeSoal?.instruksiArab || 'أجب هذه الأسئلة بإجابة صحيحة !'}
          soalList={activeSoal?.soalList}
          romawiSections={activeSoal?.romawiSections}
          pilihanGandaList={activeSoal?.pilihanGandaList}
          paperSize={paperSize}
        />
      </div>
    </div>
  );
};

/* =========================================================================
   SUB-TAB 5: DENAH RUANGAN & MASTER DATA PESERTA / RUANGAN + KOP CETAK
========================================================================= */
const SubTabDenahUjian: React.FC = () => {
  const {
    santriList,
    ruangUjianList,
    generateExamSeating,
    swapSeats,
    imtihanMaster,
    updateImtihanMaster,
    togglePesertaSusulan,
    addRoomConfig,
    updateRoomConfig,
    deleteRoomConfig,
    printOrientation,
  } = useAppStore();

  const [activeRoomId, setActiveRoomId] = useState<string>(ruangUjianList[0]?.id || 'ruang-1');
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [denahViewMode, setDenahViewMode] = useState<'denah_3d_2d' | 'label_bangku' | 'tempel_kaca'>('denah_3d_2d');
  const [conflictReport, setConflictReport] = useState<{ totalConflicts: number; score: number }>({
    totalConflicts: 0,
    score: 100,
  });
  const denahSheetRef = useRef<HTMLDivElement | null>(null);

  // Modals for Master Data Denah
  const [showSusulanModal, setShowSusulanModal] = useState(false);
  const [susulanSearch, setSusulanSearch] = useState('');
  const [showRoomEditor, setShowRoomEditor] = useState(false);

  // Add room state
  const [newKode, setNewKode] = useState('R8');
  const [newNama, setNewNama] = useState('Ruang 08');
  const [newLokasi, setNewLokasi] = useState('Aula Masjid Lt. 2');
  const [newGender, setNewGender] = useState<'L' | 'P'>('L');
  const [newBaris, setNewBaris] = useState(5);
  const [newKolom, setNewKolom] = useState(4);

  const activeRoom = ruangUjianList.find((r) => r.id === activeRoomId) || ruangUjianList[0];
  const activeRoomConfig = imtihanMaster.roomConfigs.find(
    (rc) => rc.id === activeRoom?.id || rc.kode === activeRoom?.kode
  );
  const activeRoomLokasi = activeRoomConfig?.lokasi || activeRoom?.nama || 'Gedung Madrasah';
  const occupiedSeats = (activeRoom?.kursiList || []).filter((k) => Boolean(k.santri));

  useEffect(() => {
    if (activeRoom) {
      const { conflicts, score } = validateRoom(activeRoom);
      setConflictReport({ totalConflicts: conflicts.length, score });
    }
  }, [activeRoom, ruangUjianList]);

  const susulanSet = new Set(imtihanMaster.pesertaSusulanIds || []);
  const putraTotal = santriList.filter((s) => s.gender === 'L').length;
  const putriTotal = santriList.filter((s) => s.gender === 'P').length;
  const putraSusulan = santriList.filter((s) => s.gender === 'L' && susulanSet.has(s.id)).length;
  const putriSusulan = santriList.filter((s) => s.gender === 'P' && susulanSet.has(s.id)).length;

  const handleSeatClick = (seatId: string) => {
    if (!selectedSeatId) {
      setSelectedSeatId(seatId);
    } else if (selectedSeatId === seatId) {
      setSelectedSeatId(null);
    } else {
      swapSeats(activeRoom.id, selectedSeatId, seatId);
      setSelectedSeatId(null);
    }
  };

  const handleAcakUlang = () => {
    const newSeed = Math.floor(Math.random() * 100000);
    generateExamSeating(newSeed);
  };

  const classColors: Record<string, string> = {
    '1 A PUTRA': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    '1 B PUTRA': 'bg-emerald-50 text-emerald-900 border-emerald-300',
    '1 A PUTRI': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    '1 B PUTRI': 'bg-emerald-50 text-emerald-900 border-emerald-300',
    '2 A PUTRA': 'bg-blue-100 text-blue-800 border-blue-300',
    '2 B PUTRA': 'bg-indigo-100 text-indigo-800 border-indigo-300',
    '2 A PUTRI': 'bg-blue-100 text-blue-800 border-blue-300',
    '2 B PUTRI': 'bg-indigo-100 text-indigo-800 border-indigo-300',
    '2 C PUTRI': 'bg-sky-100 text-sky-800 border-sky-300',
    '3 A PUTRA': 'bg-amber-100 text-amber-800 border-amber-300',
    '3 B PUTRA': 'bg-orange-100 text-orange-800 border-orange-300',
    '3 A PUTRI': 'bg-amber-100 text-amber-800 border-amber-300',
    '4 A PUTRA': 'bg-purple-100 text-purple-800 border-purple-300',
    '4 A PUTRI': 'bg-purple-100 text-purple-800 border-purple-300',
    '5 A PUTRA & PUTRI': 'bg-rose-100 text-rose-800 border-rose-300',
    '6 A PUTRA & PUTRI': 'bg-teal-100 text-teal-800 border-teal-300',
  };

  return (
    <div className="space-y-6">
      {/* Master Data Denah Imtihan Panel (no-print) */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Master Data Denah & Peserta Imtihan</span>
            </h3>
            <p className="text-xs text-slate-500">
              Atur Cawu 1/2, saring santri peserta susulan (tidak memenuhi syarat), dan kelola ruangan (Aula/Kelas).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => updateImtihanMaster({ cawu: '1' })}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  imtihanMaster.cawu === '1'
                    ? 'bg-emerald-800 text-white'
                    : 'text-slate-600'
                }`}
              >
                Cawu 1
              </button>
              <button
                type="button"
                onClick={() => updateImtihanMaster({ cawu: '2' })}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  imtihanMaster.cawu === '2'
                    ? 'bg-emerald-800 text-white'
                    : 'text-slate-600'
                }`}
              >
                Cawu 2
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSusulanModal(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition"
            >
              Kelola Peserta Susulan ({susulanSet.size})
            </button>

            <button
              type="button"
              onClick={() => setShowRoomEditor((v) => !v)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
            >
              {showRoomEditor ? 'Tutup Pengaturan Ruang' : 'Atur Ruangan & Kapasitas'}
            </button>
          </div>
        </div>

        {/* Participant Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
            <span className="text-sky-800 font-semibold">Peserta Putra Ikut Imtihan</span>
            <p className="text-lg font-black text-sky-950 tabular-nums">
              {putraTotal - putraSusulan} / {putraTotal} Santri
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-emerald-800 font-semibold">Peserta Putri Ikut Imtihan</span>
            <p className="text-lg font-black text-emerald-950 tabular-nums">
              {putriTotal - putriSusulan} / {putriTotal} Santri
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-amber-800 font-semibold">Peserta Susulan (Ditunda)</span>
            <p className="text-lg font-black text-amber-950 tabular-nums">
              {susulanSet.size} Santri
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-600 font-semibold">Total Kapasitas Ruangan</span>
            <p className="text-lg font-black text-slate-900 tabular-nums">
              {imtihanMaster.roomConfigs.reduce((s, r) => s + r.baris * r.kolom, 0)} Kursi (
              {imtihanMaster.roomConfigs.length} Ruang)
            </p>
          </div>
        </div>

        {/* Inline Room Configuration Editor */}
        {showRoomEditor && (
          <div className="pt-3 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-900">
                Pengaturan Ruangan & Lokasi Pemakaian (Aula / Kelas)
              </h4>
              <button
                type="button"
                onClick={handleAcakUlang}
                className="px-3 py-1 rounded-lg bg-emerald-800 text-white text-xs font-bold"
              >
                Terapkan & Acak Denah Sekarang
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-slate-200">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-2 text-left">Kode</th>
                    <th className="p-2 text-left">Nama Ruang</th>
                    <th className="p-2 text-left">Gedung</th>
                    <th className="p-2 text-center">Lt</th>
                    <th className="p-2 text-left">Lokasi Dipakai (Aula/Kelas)</th>
                    <th className="p-2 text-center">Gender</th>
                    <th className="p-2 text-center">Baris</th>
                    <th className="p-2 text-center">Kolom</th>
                    <th className="p-2 text-center">Isi</th>
                    <th className="p-2 text-right">Hapus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {imtihanMaster.roomConfigs.map((rc) => (
                    <tr key={rc.id}>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={rc.kode}
                          onChange={(e) => updateRoomConfig(rc.id, { kode: e.target.value })}
                          className="w-14 rounded-lg border border-slate-300 px-2 py-1 text-xs font-bold"
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={rc.nama}
                          onChange={(e) => updateRoomConfig(rc.id, { nama: e.target.value })}
                          className="w-32 rounded-lg border border-slate-300 px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={rc.gedung || (rc.gender === 'P' ? 'Gedung Madrasah & Asrama Putri (GD-C)' : 'Gedung Madrasah Utama (GD-A)')}
                          onChange={(e) => updateRoomConfig(rc.id, { gedung: e.target.value })}
                          className="w-40 rounded-lg border border-slate-300 px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-1.5 text-center">
                        <select
                          value={rc.lantai || 1}
                          onChange={(e) =>
                            updateRoomConfig(rc.id, {
                              lantai: (parseInt(e.target.value) as 1 | 2 | 3) || 1,
                            })
                          }
                          className="rounded-lg border border-slate-300 px-1.5 py-1 text-xs font-bold"
                        >
                          <option value={1}>Lt 1</option>
                          <option value={2}>Lt 2</option>
                          <option value={3}>Lt 3</option>
                        </select>
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={rc.lokasi}
                          onChange={(e) => updateRoomConfig(rc.id, { lokasi: e.target.value })}
                          className="w-40 rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold"
                        />
                      </td>
                      <td className="p-1.5 text-center">
                        <select
                          value={rc.gender}
                          onChange={(e) =>
                            updateRoomConfig(rc.id, { gender: e.target.value as 'L' | 'P' })
                          }
                          className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                        >
                          <option value="L">Putra</option>
                          <option value="P">Putri</option>
                        </select>
                      </td>
                      <td className="p-1.5 text-center">
                        <input
                          type="number"
                          min={2}
                          max={10}
                          value={rc.baris}
                          onChange={(e) =>
                            updateRoomConfig(rc.id, { baris: parseInt(e.target.value) || 4 })
                          }
                          className="w-14 rounded-lg border border-slate-300 px-1 py-1 text-center font-bold"
                        />
                      </td>
                      <td className="p-1.5 text-center">
                        <input
                          type="number"
                          min={2}
                          max={8}
                          value={rc.kolom}
                          onChange={(e) =>
                            updateRoomConfig(rc.id, { kolom: parseInt(e.target.value) || 4 })
                          }
                          className="w-14 rounded-lg border border-slate-300 px-1 py-1 text-center font-bold"
                        />
                      </td>
                      <td className="p-1.5 text-center font-bold text-emerald-800">
                        {rc.baris * rc.kolom}
                      </td>
                      <td className="p-1.5 text-right">
                        <button
                          type="button"
                          onClick={() => deleteRoomConfig(rc.id)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Add Room */}
            <div className="flex flex-wrap items-end gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[10px] font-bold text-slate-600">Kode</label>
                <input
                  type="text"
                  value={newKode}
                  onChange={(e) => setNewKode(e.target.value)}
                  className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600">Nama Ruang</label>
                <input
                  type="text"
                  value={newNama}
                  onChange={(e) => setNewNama(e.target.value)}
                  className="w-32 rounded-lg border border-slate-300 px-2 py-1 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600">Lokasi (Aula/Kelas)</label>
                <input
                  type="text"
                  value={newLokasi}
                  onChange={(e) => setNewLokasi(e.target.value)}
                  className="w-40 rounded-lg border border-slate-300 px-2 py-1 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600">Gender</label>
                <select
                  value={newGender}
                  onChange={(e) => setNewGender(e.target.value as 'L' | 'P')}
                  className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                >
                  <option value="L">Putra</option>
                  <option value="P">Putri</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600">Baris × Kolom</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={newBaris}
                    onChange={(e) => setNewBaris(parseInt(e.target.value) || 4)}
                    className="w-12 rounded-lg border border-slate-300 px-1 py-1 text-xs text-center"
                  />
                  <span>×</span>
                  <input
                    type="number"
                    value={newKolom}
                    onChange={(e) => setNewKolom(parseInt(e.target.value) || 4)}
                    className="w-12 rounded-lg border border-slate-300 px-1 py-1 text-xs text-center"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  addRoomConfig({
                    kode: newKode,
                    nama: newNama,
                    lokasi: newLokasi,
                    gedung:
                      newGender === 'P'
                        ? 'Gedung Madrasah & Asrama Putri (GD-C)'
                        : newLokasi.toLowerCase().includes('masjid')
                        ? 'Masjid Darussalam (Pusat)'
                        : 'Gedung Madrasah Utama (GD-A)',
                    lantai: newLokasi.toLowerCase().includes('2') ? 2 : 1,
                    gender: newGender,
                    baris: newBaris,
                    kolom: newKolom,
                  });
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-bold"
              >
                + Tambah Ruang
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Room Switcher, Mode Selector & Print Controls (no-print) */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs space-y-3 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Grid className="w-4 h-4 text-emerald-700" />
              <span>Denah Pondok 3D, Denah Ruang 2D, Label Bangku &amp; Tempel Kaca Kelas (Cawu {imtihanMaster.cawu})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Cek tata letak gedung &amp; lantai secara interaktif 3D (otomatis berubah jadi denah 2D resmi saat dicetak), plus cetak stiker tempat duduk &amp; daftar peserta kaca kelas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PrintOrientationControl recommended="portrait" />
            <button
              type="button"
              onClick={handleAcakUlang}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Shuffle className="w-3.5 h-3.5 text-emerald-700" />
              <span>Acak Ulang Denah</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const modeTitle =
                  denahViewMode === 'label_bangku'
                    ? `Label Tempat Duduk Bangku - ${activeRoom?.kode || ''}`
                    : denahViewMode === 'tempel_kaca'
                    ? `Daftar Peserta Tempel Kaca - ${activeRoom?.kode || ''}`
                    : `Denah Resmi 2D ${activeRoom?.kode || ''} - ${activeRoom?.nama || ''}`;
                triggerReliablePrint({
                  title: modeTitle,
                  orientation: printOrientation,
                  paperSize: 'F4',
                  targetElement: denahSheetRef.current,
                });
              }}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>
                {denahViewMode === 'label_bangku'
                  ? 'Cetak Label Bangku'
                  : denahViewMode === 'tempel_kaca'
                  ? 'Cetak Tempel Kaca Kelas'
                  : 'Cetak Denah 2D Resmi'}
              </span>
            </button>
          </div>
        </div>

        {/* 3 Printable Layout Switcher */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setDenahViewMode('denah_3d_2d')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              denahViewMode === 'denah_3d_2d'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Denah Pondok 3D &amp; Ruang 2D</span>
          </button>
          <button
            type="button"
            onClick={() => setDenahViewMode('label_bangku')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              denahViewMode === 'label_bangku'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Label Tempat Duduk (Tempel Bangku)</span>
          </button>
          <button
            type="button"
            onClick={() => setDenahViewMode('tempel_kaca')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              denahViewMode === 'tempel_kaca'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Daftar Peserta (Tempel Kaca Kelas)</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">
          {ruangUjianList.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setActiveRoomId(r.id);
                setSelectedSeatId(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeRoom?.id === r.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>
                {r.kode}: {r.nama}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${r.gender === 'L' ? 'bg-sky-400' : 'bg-emerald-400'}`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Interactive 3D Campus + Buildings + Floors Visualization (Hidden automatically when printing) */}
      {denahViewMode === 'denah_3d_2d' && (
        <DenahPondok3D
          ruangUjianList={ruangUjianList}
          roomConfigs={imtihanMaster.roomConfigs}
          activeRoomId={activeRoom?.id || ''}
          onSelectRoom={(id) => {
            setActiveRoomId(id);
            setSelectedSeatId(null);
          }}
        />
      )}

      {/* Printable Room Sheet: 2D Denah / Desk Stickers / Window Roster */}
      {activeRoom && (
        <div ref={denahSheetRef} className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-5 printable-area">
          {/* OFFICIAL PRINT-ONLY KOP SURAT DENAH */}
          <div className="print-only pb-3 border-b-2 border-black space-y-2">
            <div className="flex items-center justify-between gap-4">
              <img
                src="/assets/aistudio/ChatGPT_Image_Nov_6__2025__01_32_08_PM_64f70724.png"
                alt="Logo PP NU Darussalam"
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/preview__14__3b7f388f.webp';
                }}
              />
              <div className="flex-1 text-center">
                <p className="text-[11px] font-bold uppercase tracking-wider">
                  PANITIA IMTIHAN MADRASAH DINIYAH SALAFIYAH
                </p>
                <h2 className="text-base font-black uppercase tracking-wide">
                  PONDOK PESANTREN NU DARUSSALAM KARANGDADAP
                </h2>
                <p className="text-[11px]">
                  Karangdadap, Kabupaten Pekalongan, Jawa Tengah · Tahun Ajaran {imtihanMaster.tahunAjaran}
                </p>
              </div>
              <div className="w-16" />
            </div>
            <div className="text-center pt-1 border-t border-black">
              <h3 className="text-sm font-black uppercase tracking-wide">
                {denahViewMode === 'label_bangku'
                  ? `LABEL TEMPAT DUDUK (TEMPEL BANGKU) IMTIHAN CAWU ${imtihanMaster.cawu}`
                  : denahViewMode === 'tempel_kaca'
                  ? `DAFTAR PESERTA RUANG (TEMPEL KACA KELAS) IMTIHAN CAWU ${imtihanMaster.cawu}`
                  : `DENAH TEMPAT DUDUK IMTIHAN CAWU ${imtihanMaster.cawu}`}
              </h3>
              <p className="text-xs font-bold uppercase">
                {activeRoom.kode} — {activeRoom.nama} · {activeRoomLokasi} ({activeRoom.gender === 'L' ? 'PUTRA' : 'PUTRI'})
              </p>
            </div>
          </div>

          {/* Screen-only Room Header & Conflict Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 no-print">
            <div>
              <h4 className="font-extrabold text-base text-slate-900">
                {activeRoom.nama} ({activeRoom.kode}) · {activeRoomLokasi} · {activeRoom.gender === 'L' ? 'Putra' : 'Putri'}
              </h4>
              <p className="text-xs text-slate-500">
                Kapasitas: {activeRoom.kapasitas} Kursi ({activeRoom.baris} Baris × {activeRoom.kolom} Kolom) · Terisi {occupiedSeats.length} Santri
              </p>
            </div>

            <div
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                conflictReport.totalConflicts === 0
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}
            >
              {conflictReport.totalConflicts === 0 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Bebas Bentrok (Skor {conflictReport.score}/100)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{conflictReport.totalConflicts} Kursi Bersebelahan</span>
                </>
              )}
            </div>
          </div>

          {denahViewMode === 'denah_3d_2d' && (
            <>
              <div className="w-full py-2 bg-slate-800 text-white text-center font-bold text-xs uppercase tracking-widest rounded-xl">
                Papan Tulis / Meja Pengawas Ujian (Depan)
              </div>

              <div
                className="grid gap-3 pt-2"
                style={{
                  gridTemplateColumns: `repeat(${activeRoom.kolom}, minmax(0, 1fr))`,
                }}
              >
                {activeRoom.kursiList.map((kursi) => {
                  const isSelected = selectedSeatId === kursi.id;
                  const student = kursi.santri;
                  const colorClass = student
                    ? classColors[student.kelas] || 'bg-slate-100 text-slate-700'
                    : 'bg-slate-50 text-slate-400';

                  return (
                    <div
                      key={kursi.id}
                      onClick={() => handleSeatClick(kursi.id)}
                      className={`p-2.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[82px] ${
                        isSelected
                          ? 'border-emerald-600 ring-4 ring-emerald-500/30 bg-emerald-50 z-10'
                          : kursi.bentrok
                          ? 'border-rose-400 bg-rose-50/70'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold">
                          B{kursi.baris + 1}-K{kursi.kolom + 1}
                        </span>
                        {kursi.bentrok && (
                          <span className="text-[9px] font-bold text-rose-600 no-print">Sekelas</span>
                        )}
                      </div>

                      {student ? (
                        <div>
                          <p className="font-extrabold text-[11px] text-slate-900 line-clamp-1 leading-tight">
                            {student.nama}
                          </p>
                          <span
                            className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${colorClass}`}
                          >
                            {student.kelas}
                          </span>
                          <p className="text-[9px] text-slate-500 tabular-nums mt-0.5">
                            {student.nomorUjian || student.nis}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-2 text-slate-300 text-xs font-semibold">
                          Kosong
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {selectedSeatId && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between no-print">
                  <span>Kursi terpilih! Klik kursi lain untuk menukar posisi peserta ujian.</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSeatId(null)}
                    className="font-bold underline text-xs"
                  >
                    Batalkan
                  </button>
                </div>
              )}
            </>
          )}

          {denahViewMode === 'label_bangku' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 print:grid-cols-3 gap-3">
              {occupiedSeats.map((kursi) => {
                const st = kursi.santri!;
                return (
                  <div
                    key={kursi.id}
                    className="border-2 border-dashed border-slate-700 rounded-lg p-3 bg-white flex flex-col justify-between min-h-[108px] page-break-inside-avoid"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1.5">
                      <span className="text-[10px] font-extrabold uppercase text-emerald-900">
                        IMTIHAN CAWU {imtihanMaster.cawu} · {activeRoom.kode}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[11px] font-black tabular-nums">
                        B{kursi.baris + 1}-K{kursi.kolom + 1}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-slate-500 tabular-nums">
                        No. IMT: <strong className="text-slate-900">{st.nomorUjian || st.nis}</strong>
                      </p>
                      <p className="text-xs font-black text-slate-950 uppercase leading-tight">
                        {st.nama}
                      </p>
                      <p className="text-[11px] font-bold text-emerald-900">
                        Kelas: {st.kelas}
                      </p>
                    </div>
                    <div className="pt-1 mt-1.5 border-t border-slate-200 text-[9px] text-slate-500 flex justify-between">
                      <span>{activeRoomLokasi}</span>
                      <span>PP NU Darussalam</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {denahViewMode === 'tempel_kaca' && (
            <div className="space-y-4">
              <div className="rounded-2xl border-2 border-slate-900 p-3 bg-slate-50 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <p className="font-black text-sm text-slate-950 uppercase">
                    {activeRoom.kode} — {activeRoom.nama} ({activeRoom.gender === 'L' ? 'PUTRA' : 'PUTRI'})
                  </p>
                  <p className="text-slate-700 font-semibold">
                    Lokasi Ruang: <strong>{activeRoomLokasi}</strong> · Jumlah Peserta: <strong>{occupiedSeats.length} Santri</strong>
                  </p>
                </div>
                <div className="text-right text-[11px] text-slate-600">
                  <p className="font-bold">Pelaksanaan: {imtihanMaster.tanggalPelaksanaan}</p>
                  <p>Waktu: {imtihanMaster.waktuUjian}</p>
                </div>
              </div>

              <table className="w-full text-xs border-2 border-slate-900 border-collapse">
                <thead>
                  <tr className="bg-emerald-900 text-white font-bold">
                    <th className="border border-slate-800 py-2 px-2 text-center w-10">NO</th>
                    <th className="border border-slate-800 py-2 px-2 text-center w-20">KURSI</th>
                    <th className="border border-slate-800 py-2 px-2 text-center w-28">NO. IMT</th>
                    <th className="border border-slate-800 py-2 px-3 text-left">NAMA LENGKAP SANTRI</th>
                    <th className="border border-slate-800 py-2 px-2 text-center w-36">KELAS</th>
                    <th className="border border-slate-800 py-2 px-2 text-center w-28">PARAF / KET</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {occupiedSeats.map((kursi, idx) => {
                    const st = kursi.santri!;
                    return (
                      <tr key={kursi.id}>
                        <td className="border border-slate-400 py-1.5 px-2 text-center font-bold tabular-nums">
                          {idx + 1}
                        </td>
                        <td className="border border-slate-400 py-1.5 px-2 text-center font-black tabular-nums">
                          B{kursi.baris + 1}-K{kursi.kolom + 1}
                        </td>
                        <td className="border border-slate-400 py-1.5 px-2 text-center font-bold tabular-nums text-emerald-950">
                          {st.nomorUjian || st.nis}
                        </td>
                        <td className="border border-slate-400 py-1.5 px-3 font-extrabold text-slate-950 uppercase">
                          {st.nama}
                        </td>
                        <td className="border border-slate-400 py-1.5 px-2 text-center font-bold">
                          {st.kelas}
                        </td>
                        <td className="border border-slate-400 py-1.5 px-2 text-center text-slate-400">
                          &nbsp;
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="flex justify-end pt-3 text-xs">
                <div className="text-center w-56">
                  <p className="font-semibold">Ketua Panitia Imtihan</p>
                  <div className="h-12 flex items-center justify-center">
                    {imtihanMaster.ketuaImtihanTtdUrl && (
                      <img
                        src={imtihanMaster.ketuaImtihanTtdUrl}
                        alt="TTD Ketua Imtihan"
                        className="max-h-11 object-contain"
                      />
                    )}
                  </div>
                  <p className="font-bold border-t border-slate-800 pt-1">
                    {imtihanMaster.ketuaImtihanNama}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Peserta Susulan */}
      {showSusulanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 no-print">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Daftar Santri Peserta Susulan (Tidak Masuk Denah Utama)
                </h3>
                <p className="text-xs text-slate-500">
                  Centang santri yang belum memenuhi syarat (syahriyah/hafalan/izin) agar dikecualikan dari denah.
                </p>
              </div>
              <button
                onClick={() => setShowSusulanModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-1.5">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={susulanSearch}
                onChange={(e) => setSusulanSearch(e.target.value)}
                placeholder="Cari nama atau NIS santri..."
                className="flex-1 text-xs focus:outline-hidden"
              />
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
              {santriList
                .filter(
                  (s) =>
                    !susulanSearch ||
                    s.nama.toLowerCase().includes(susulanSearch.toLowerCase()) ||
                    s.nis.includes(susulanSearch)
                )
                .map((s) => {
                  const isSusulan = susulanSet.has(s.id);
                  return (
                    <label
                      key={s.id}
                      className="flex items-center justify-between py-2.5 px-2 hover:bg-slate-50 cursor-pointer text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{s.nama}</span>
                        <span className="block text-[10px] text-slate-500">
                          NIS: {s.nis} · {s.kelas} · {s.gender === 'L' ? 'Putra' : 'Putri'}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSusulan}
                        onChange={() => togglePesertaSusulan(s.id)}
                        className="w-4 h-4 rounded text-amber-600"
                      />
                    </label>
                  );
                })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-xs font-bold text-amber-800">
                Terpilih Susulan: {susulanSet.size} Santri
              </span>
              <button
                type="button"
                onClick={() => {
                  generateExamSeating(Date.now());
                  setShowSusulanModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
              >
                Simpan & Generate Denah Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   SUB-TAB 11: JADWAL MAPEL IMTIHAN (SYNCED TO STORE & KARTU IMTIHAN)
========================================================================= */
const SubTabJadwalMapel: React.FC = () => {
  const {
    jadwalMaarifan,
    addJadwalMaarifan,
    updateJadwalMaarifan,
    deleteJadwalMaarifan,
    imtihanMaster,
    updateImtihanMaster,
    printOrientation,
  } = useAppStore();

  const { effectiveRole, can } = useAuth();
  const canEditJadwal =
    effectiveRole === 'pengasuh' ||
    effectiveRole === 'ketua_imtihan' ||
    effectiveRole === 'kepala_madin' ||
    can('imtihan_denah', 'ubah');

  const [editingItem, setEditingItem] = useState<JadwalMaarifanItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const jadwalSheetRef = useRef<HTMLDivElement | null>(null);
  const [formState, setFormState] = useState<Omit<JadwalMaarifanItem, 'id'>>({
    hari: 'Sabtu',
    tanggalUjian: "05-12-'26",
    jamKe: 2,
    waktu: '18.30–19.30',
    kelas1: 'Akhlak',
    kelas2: 'Akhlak',
    kelas3: 'Akhlak',
    kelas4: 'Akhlak',
    kelas5: 'Akhlak',
    kelas6: 'Ilmu Tafsir',
    kategori: 'Ringan',
  });

  const badgeColors: Record<JadwalMaarifanItem['kategori'], string> = {
    Ringan: 'bg-[#D1E7DD]',
    Sedang: 'bg-[#FFEAA7]',
    Berat: 'bg-[#FFD1BA]',
    Lisan: 'bg-[#DDF4FF]',
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditJadwal) return;
    if (editingItem) {
      updateJadwalMaarifan(editingItem.id, editingItem);
      setEditingItem(null);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditJadwal) return;
    addJadwalMaarifan(formState);
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      {/* Master Pelaksanaan Imtihan */}
      {canEditJadwal && (
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-3 no-print">
        <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-900">
          Master Pelaksanaan Imtihan (Sinkron Kartu & Blanko)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-600 mb-1">Tanggal Pelaksanaan</label>
            <input
              type="text"
              value={imtihanMaster.tanggalPelaksanaan}
              onChange={(e) => updateImtihanMaster({ tanggalPelaksanaan: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-1.5"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">Jam Ujian Utama</label>
            <input
              type="text"
              value={imtihanMaster.waktuUjian}
              onChange={(e) => updateImtihanMaster({ waktuUjian: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-1.5"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">Tahun Ajaran Masehi</label>
            <input
              type="text"
              value={imtihanMaster.tahunAjaran}
              onChange={(e) => updateImtihanMaster({ tahunAjaran: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-1.5"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">Tahun Hijriyah (Arab)</label>
            <input
              type="text"
              dir="rtl"
              value={imtihanMaster.tahunHijriyahArab}
              onChange={(e) => updateImtihanMaster({ tahunHijriyahArab: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-1.5 font-arabic text-base text-right"
            />
          </div>
        </div>
      </div>
      )}

      {/* Table */}
      <div ref={jadwalSheetRef} className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-4 printable-area">
        <PrintKopPondok
          variant="imtihan"
          judulDokumen={`JADWAL RESMI MATA PELAJARAN IMTIHAN CAWU ${imtihanMaster.cawu}`}
          subJudul={`Pelaksanaan: ${imtihanMaster.tanggalPelaksanaan} · Sinkronisasi Otomatis Kartu Imtihan`}
          tahunAjaran={imtihanMaster.tahunAjaran}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 no-print">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Jadwal Resmi Mapel Imtihan Cawu {imtihanMaster.cawu} · T.A. {imtihanMaster.tahunAjaran}
            </h3>
            <p className="text-xs text-slate-500">
              Pelaksanaan: {imtihanMaster.tanggalPelaksanaan} · Perubahan jadwal otomatis sinkron ke Kartu Imtihan
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 no-print">
            <PrintOrientationControl recommended="landscape" />
            {canEditJadwal && (
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Baris</span>
              </button>
            )}
            <button
              type="button"
              onClick={() =>
                triggerReliablePrint({
                  title: `Jadwal Mapel Imtihan Cawu ${imtihanMaster.cawu}`,
                  orientation: printOrientation,
                  paperSize: 'F4',
                  targetElement: jadwalSheetRef.current,
                })
              }
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Jadwal</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-slate-200 text-center">
            <thead>
              <tr className="bg-emerald-900 text-white font-bold">
                <th className="py-2.5 px-2 border border-emerald-800">HARI / TANGGAL</th>
                <th className="py-2.5 px-2 border border-emerald-800">JAM · WAKTU</th>
                <th className="py-2.5 px-2 border border-emerald-800">KELAS 1</th>
                <th className="py-2.5 px-2 border border-emerald-800">KELAS 2</th>
                <th className="py-2.5 px-2 border border-emerald-800">KELAS 3</th>
                <th className="py-2.5 px-2 border border-emerald-800">KELAS 4</th>
                <th className="py-2.5 px-2 border border-emerald-800">KELAS 5</th>
                <th className="py-2.5 px-2 border border-emerald-800">KELAS 6</th>
                {canEditJadwal && (
                  <th className="py-2.5 px-2 border border-emerald-800 no-print">AKSI</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-semibold">
              {jadwalMaarifan.map((row) => (
                <tr key={row.id}>
                  <td className="bg-emerald-50 border border-slate-300 p-2 font-bold text-emerald-950">
                    {row.hari}
                    <span className="block text-[10px] font-normal text-slate-500">
                      {row.tanggalUjian}
                    </span>
                  </td>
                  <td className="bg-amber-50 border border-slate-300 p-2">
                    Jam {row.jamKe}
                    <span className="block text-[10px] text-slate-500">{row.waktu}</span>
                  </td>
                  <td className={`${badgeColors[row.kategori]} border border-slate-300 p-2`}>
                    {row.kelas1}
                  </td>
                  <td className={`${badgeColors[row.kategori]} border border-slate-300 p-2`}>
                    {row.kelas2}
                  </td>
                  <td className={`${badgeColors[row.kategori]} border border-slate-300 p-2`}>
                    {row.kelas3}
                  </td>
                  <td className={`${badgeColors[row.kategori]} border border-slate-300 p-2`}>
                    {row.kelas4}
                  </td>
                  <td className={`${badgeColors[row.kategori]} border border-slate-300 p-2`}>
                    {row.kelas5}
                  </td>
                  <td className={`${badgeColors[row.kategori]} border border-slate-300 p-2`}>
                    {row.kelas6}
                  </td>
                  {canEditJadwal && (
                    <td className="border border-slate-300 p-1.5 no-print">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingItem(row)}
                          className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                          title="Edit Baris"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteJadwalMaarifan(row.id)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          title="Hapus Baris"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 no-print">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-3 text-xs"
          >
            <h3 className="font-bold text-sm text-slate-900">Edit Jadwal Mapel Imtihan</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Hari</label>
                <input
                  type="text"
                  value={editingItem.hari}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      hari: e.target.value as JadwalMaarifanItem['hari'],
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Tanggal</label>
                <input
                  type="text"
                  value={editingItem.tanggalUjian || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, tanggalUjian: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Jam Ke</label>
                <input
                  type="number"
                  min={1}
                  max={3}
                  value={editingItem.jamKe}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      jamKe: (parseInt(e.target.value) || 2) as 1 | 2 | 3,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Waktu</label>
                <input
                  type="text"
                  value={editingItem.waktu}
                  onChange={(e) => setEditingItem({ ...editingItem, waktu: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['kelas1', 'kelas2', 'kelas3', 'kelas4', 'kelas5', 'kelas6'] as const).map((k) => (
                <div key={k}>
                  <label className="block font-bold mb-1 uppercase">{k}</label>
                  <input
                    type="text"
                    value={editingItem[k]}
                    onChange={(e) => setEditingItem({ ...editingItem, [k]: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 no-print">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-3 text-xs"
          >
            <h3 className="font-bold text-sm text-slate-900">Tambah Sesi Jadwal Imtihan</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Hari</label>
                <select
                  value={formState.hari}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      hari: e.target.value as JadwalMaarifanItem['hari'],
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2"
                >
                  {['Sabtu', 'Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at"].map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Tanggal</label>
                <input
                  type="text"
                  value={formState.tanggalUjian || ''}
                  onChange={(e) => setFormState({ ...formState, tanggalUjian: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['kelas1', 'kelas2', 'kelas3', 'kelas4', 'kelas5', 'kelas6'] as const).map((k) => (
                <div key={k}>
                  <label className="block font-bold mb-1 uppercase">{k}</label>
                  <input
                    type="text"
                    value={formState[k]}
                    onChange={(e) => setFormState({ ...formState, [k]: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
              >
                Tambahkan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   SUB-TAB 12: JADWAL JAGA RUANG & PIKET KANTOR IMTIHAN
========================================================================= */
const SubTabJagaPiket: React.FC = () => {
  const { jagaPiketList, addJagaPiket, deleteJagaPiket, ustadzList, imtihanMaster, printOrientation } = useAppStore();
  const { effectiveRole, can } = useAuth();
  const canManagePiket =
    effectiveRole === 'pengasuh' ||
    effectiveRole === 'ketua_imtihan' ||
    effectiveRole === 'kepala_madin' ||
    can('imtihan_denah', 'ubah');
  const roomOptions = imtihanMaster.roomConfigs.map((r) => `${r.kode} (${r.lokasi})`);

  const [hariTanggal, setHariTanggal] = useState('Sabtu, 05 Des 2026');
  const [jam, setJam] = useState('18.30 - 21.00');
  const [tugas, setTugas] = useState<JagaPiketRecord['tugas']>('Pengawas Ruang');
  const [ruangAtauPos, setRuangAtauPos] = useState(roomOptions[0] || 'R1 (Aula Utama Lt. 1)');
  const [petugasNama, setPetugasNama] = useState(ustadzList[0]?.nama || 'Ust. Abdurrohman');
  const [toast, setToast] = useState('');
  const [conflictError, setConflictError] = useState('');
  const jagaSheetRef = useRef<HTMLDivElement | null>(null);

  // Cek apakah ruangan sudah terisi pada hari & jam yang sama untuk Pengawas Ruang
  const getRoomOccupant = (roomLabel: string) =>
    jagaPiketList.find(
      (jp) =>
        jp.tugas === 'Pengawas Ruang' &&
        jp.hariTanggal.trim().toLowerCase() === hariTanggal.trim().toLowerCase() &&
        jp.jam.trim() === jam.trim() &&
        jp.ruangAtauPos.trim().toLowerCase() === roomLabel.trim().toLowerCase()
    );

  // Cek apakah petugas sudah bertugas di slot hari & jam yang sama
  const getPetugasBusy = (nama: string) =>
    jagaPiketList.find(
      (jp) =>
        jp.hariTanggal.trim().toLowerCase() === hariTanggal.trim().toLowerCase() &&
        jp.jam.trim() === jam.trim() &&
        jp.petugasNama === nama
    );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError('');
    if (!petugasNama.trim() || !ruangAtauPos.trim()) return;

    if (tugas === 'Pengawas Ruang') {
      const existingRoom = getRoomOccupant(ruangAtauPos);
      if (existingRoom) {
        setConflictError(
          `Bentrok Ruangan! ${ruangAtauPos} pada ${hariTanggal} (${jam}) sudah dijaga oleh ${existingRoom.petugasNama}. Pilih ruangan lain atau hapus jadwal lama terlebih dahulu.`
        );
        return;
      }
    }

    const busyPetugas = getPetugasBusy(petugasNama);
    if (busyPetugas) {
      setConflictError(
        `Bentrok Petugas! ${petugasNama} sudah bertugas sebagai ${busyPetugas.tugas} di ${busyPetugas.ruangAtauPos} pada ${hariTanggal} (${jam}).`
      );
      return;
    }

    addJagaPiket({ hariTanggal, jam, tugas, ruangAtauPos, petugasNama });
    setToast(`Jadwal ${tugas} untuk ${petugasNama} di ${ruangAtauPos} berhasil ditambahkan.`);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-4 no-print">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-700" />
              <span>Jadwal Jaga Ruang, Piket Kantor &amp; Korektor Imtihan</span>
            </h3>
            <p className="text-xs text-slate-500">
              Anti-bentrok otomatis: 1 ruang ujian hanya dapat diisi 1 pengawas pada hari &amp; jam yang sama.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PrintOrientationControl recommended="portrait" />
            <button
              type="button"
              onClick={() =>
                triggerReliablePrint({
                  title: `Jadwal Jaga & Piket Imtihan Cawu ${imtihanMaster.cawu}`,
                  orientation: printOrientation,
                  paperSize: 'F4',
                  targetElement: jagaSheetRef.current,
                })
              }
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Jadwal Jaga</span>
            </button>
          </div>
        </div>

        {toast && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
            {toast}
          </div>
        )}

        {conflictError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{conflictError}</span>
          </div>
        )}

        {canManagePiket && (
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-6 gap-2.5 items-end text-xs">
          <div>
            <label className="block font-bold text-slate-600 mb-1">Hari &amp; Tanggal</label>
            <input
              type="text"
              value={hariTanggal}
              onChange={(e) => {
                setHariTanggal(e.target.value);
                setConflictError('');
              }}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">Jam</label>
            <input
              type="text"
              value={jam}
              onChange={(e) => {
                setJam(e.target.value);
                setConflictError('');
              }}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">Jenis Tugas</label>
            <select
              value={tugas}
              onChange={(e) => {
                const nextTugas = e.target.value as JagaPiketRecord['tugas'];
                setTugas(nextTugas);
                setConflictError('');
                if (nextTugas === 'Pengawas Ruang') {
                  setRuangAtauPos(roomOptions[0] || 'R1 (Aula Utama Lt. 1)');
                } else if (nextTugas === 'Piket Kantor') {
                  setRuangAtauPos('Kantor Panitia Imtihan');
                } else {
                  setRuangAtauPos('Ruang Koreksi Naskah');
                }
              }}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            >
              <option value="Pengawas Ruang">Pengawas Ruang</option>
              <option value="Piket Kantor">Piket Kantor</option>
              <option value="Korektor Naskah">Korektor Naskah</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">Ruang / Pos</label>
            {tugas === 'Pengawas Ruang' ? (
              <select
                value={ruangAtauPos}
                onChange={(e) => {
                  setRuangAtauPos(e.target.value);
                  setConflictError('');
                }}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
              >
                {roomOptions.map((opt) => {
                  const occ = getRoomOccupant(opt);
                  return (
                    <option key={opt} value={opt} disabled={Boolean(occ)}>
                      {opt} {occ ? `[Sudah Terisi: ${occ.petugasNama}]` : '[Kosong]'}
                    </option>
                  );
                })}
              </select>
            ) : (
              <input
                type="text"
                value={ruangAtauPos}
                onChange={(e) => setRuangAtauPos(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            )}
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">Petugas / Ustadz</label>
            <select
              value={petugasNama}
              onChange={(e) => {
                setPetugasNama(e.target.value);
                setConflictError('');
              }}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            >
              {ustadzList.map((u) => {
                const busy = getPetugasBusy(u.nama);
                return (
                  <option key={u.id} value={u.nama}>
                    {u.nama} {busy ? `(Sudah jaga ${busy.ruangAtauPos})` : ''}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
          >
            + Tambah Jaga
          </button>
        </form>
        )}
      </div>

      {/* Printable Schedule Table */}
      <div ref={jagaSheetRef} className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4 printable-area">
        <PrintKopPondok
          variant="imtihan"
          judulDokumen={`JADWAL PENGAWAS RUANG & PIKET KANTOR IMTIHAN CAWU ${imtihanMaster.cawu}`}
          subJudul={`Pelaksanaan: ${imtihanMaster.tanggalPelaksanaan} · Pengawasan Bebas Bentrok Ruang & Petugas`}
          tahunAjaran={imtihanMaster.tahunAjaran}
        />
        <div className="text-center border-b border-slate-200 pb-3 no-print">
          <h3 className="font-black text-sm uppercase text-slate-900">
            JADWAL PENGAWAS RUANG & PIKET KANTOR IMTIHAN CAWU {imtihanMaster.cawu}
          </h3>
          <p className="text-xs text-slate-600">
            Pondok Pesantren NU Darussalam Karangdadap · T.A. {imtihanMaster.tahunAjaran}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-slate-200">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-2.5 border border-slate-200 text-left">Hari & Tanggal</th>
                <th className="p-2.5 border border-slate-200 text-center">Jam</th>
                <th className="p-2.5 border border-slate-200 text-left">Tugas</th>
                <th className="p-2.5 border border-slate-200 text-left">Ruang / Lokasi Pos</th>
                <th className="p-2.5 border border-slate-200 text-left">Nama Petugas</th>
                {canManagePiket && (
                  <th className="p-2.5 border border-slate-200 text-right no-print">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jagaPiketList.map((jp) => (
                <tr key={jp.id} className="hover:bg-slate-50">
                  <td className="p-2.5 border border-slate-200 font-bold text-slate-900">
                    {jp.hariTanggal}
                  </td>
                  <td className="p-2.5 border border-slate-200 text-center tabular-nums">
                    {jp.jam}
                  </td>
                  <td className="p-2.5 border border-slate-200">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        jp.tugas === 'Pengawas Ruang'
                          ? 'bg-emerald-100 text-emerald-800'
                          : jp.tugas === 'Piket Kantor'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {jp.tugas}
                    </span>
                  </td>
                  <td className="p-2.5 border border-slate-200 text-slate-700">{jp.ruangAtauPos}</td>
                  <td className="p-2.5 border border-slate-200 font-bold text-emerald-900">
                    {jp.petugasNama}
                  </td>
                  {canManagePiket && (
                    <td className="p-2.5 border border-slate-200 text-right no-print">
                      <button
                        type="button"
                        onClick={() => deleteJagaPiket(jp.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
