import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Printer,
  AlertCircle,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  CreditCard,
  Search,
  Lock,
  Unlock,
  RefreshCw,
  CheckCircle2,
  Wallet,
  BarChart3,
  History,
  Users,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useAppStore } from '../../lib/store.ts';
import { triggerReliablePrint } from '../../lib/printHelper.ts';
import { useAuth } from '../../lib/auth.ts';
import { PrintOrientationControl } from '../../components/common/PrintOrientationControl.tsx';
import { PrintKopPondok } from '../../components/common/PrintKopPondok.tsx';
import { LaporanKeuanganSubTab } from './components/LaporanKeuanganSubTab.tsx';
import { TagihanSantriSubTab } from './components/TagihanSantriSubTab.tsx';

const KAS_GL_ACCOUNTS = [
  { code: '4001.01', name: 'Pendapatan Syahriyah Bulanan', defaultKat: 'Syahriyah Santri', tipe: 'Masuk' as const },
  { code: '4001.02', name: 'Pendapatan Daftar Ulang', defaultKat: 'Daftar Ulang Santri', tipe: 'Masuk' as const },
  { code: '4001.03', name: 'Pendapatan Iuran Imtihan', defaultKat: 'Iuran Imtihan', tipe: 'Masuk' as const },
  { code: '4001.04', name: "Pendapatan Agenda Kema'hadiyahan", defaultKat: "Agenda Kema'hadiyahan", tipe: 'Masuk' as const },
  { code: '4001.09', name: 'Pendapatan Lain-lain Pondok', defaultKat: 'Infaq / Lainnya', tipe: 'Masuk' as const },
  { code: '5101.01', name: 'Biaya Konsumsi & Dapur Santri', defaultKat: 'Konsumsi & Dapur', tipe: 'Keluar' as const },
  { code: '6101.01', name: 'Gaji & Bisyaroh Asatidz', defaultKat: 'Bisyaroh Asatidz', tipe: 'Keluar' as const },
  { code: '6202.01', name: 'Biaya Operasional & Kegiatan Pondok', defaultKat: 'Agenda Kegiatan', tipe: 'Keluar' as const },
  { code: '6203.01', name: 'Biaya Listrik, Air & Utilitas', defaultKat: 'Operasional Listrik & Air', tipe: 'Keluar' as const },
  { code: '6204.01', name: 'Biaya Pemeliharaan Gedung & Alat', defaultKat: 'Pemeliharaan Sarpras', tipe: 'Keluar' as const },
  { code: '1203.01', name: 'Peralatan & Inventaris Sarpras (Aset Tetap)', defaultKat: 'Pembelian Aset Tetap', tipe: 'Keluar' as const },
  { code: '6209.01', name: 'Biaya Administrasi & Lainnya', defaultKat: 'Administrasi Pondok', tipe: 'Keluar' as const },
];

export const BendaharaModule: React.FC = () => {
  const {
    rekapAnggaranBulanan,
    currentTahunAjaran,
    kasTransactions,
    addKasTransaction,
    deleteKasTransaction,
    ustadzList,
    ustadzPayroll,
    bisyarohHistory,
    updatePayrollRow,
    togglePayrollStatus,
    syncPayrollAbsensi,
    payBisyarohRow,
    payAllReadyBisyaroh,
    bulkUpdatePayrollHadir,
    resetAllPayrollToSiap,
    santriList,
    transaksiList,
    updateLimitHarian,
    toggleStatusKartu,
    topUpSaldo,
    printOrientation,
  } = useAppStore();
  const { isFinancialPrivileged } = useAuth();
  const [payrollNotice, setPayrollNotice] = useState('');
  const [chartMode, setChartMode] = useState<'bar' | 'area'>('bar');
  const [bisyarohSubTab, setBisyarohSubTab] = useState<'dashboard' | 'edit' | 'riwayat'>('dashboard');
  const [bisyarohSearch, setBisyarohSearch] = useState('');
  const [bisyarohStatusFilter, setBisyarohStatusFilter] = useState<'Semua' | 'Siap' | 'Dibayarkan'>('Semua');
  const [bulkHadirInput, setBulkHadirInput] = useState<number>(24);
  const [historyBulanFilter, setHistoryBulanFilter] = useState<string>('Semua');
  const [historySearch, setHistorySearch] = useState<string>('');

  const [activeTab, setActiveTab] = useState<
    'rekap_bulanan' | 'tagihan_santri' | 'laporan_akuntansi' | 'cashflow' | 'monitoring_jajan' | 'penggajian'
  >('rekap_bulanan');
  const [selectedBulan, setSelectedBulan] = useState<string>('November');

  // Cashflow Form State
  const [kasTanggal, setKasTanggal] = useState(new Date().toISOString().substring(0, 10));
  const [kasTipe, setKasTipe] = useState<'Masuk' | 'Keluar'>('Masuk');
  const [kasKodeAkun, setKasKodeAkun] = useState('4001.01');
  const [kasKategori, setKasKategori] = useState('Syahriyah Santri');
  const [kasUraian, setKasUraian] = useState('');
  const [kasNominal, setKasNominal] = useState(500000);
  const [kasPJ, setKasPJ] = useState('Ust. M. Abdul Fatah');

  // Monitoring Jajan Search
  const [jajanSearch, setJajanSearch] = useState('');

  if (!isFinancialPrivileged()) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4 max-w-lg mx-auto mt-12">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base text-slate-900">Akses Keuangan Terbatas</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Modul Bendahara, Arus Kas, dan Rekapitulasi Anggaran Bulanan merupakan wewenang khusus Pengasuh dan Bendahara Pondok.
        </p>
      </div>
    );
  }

  const currentRekap =
    rekapAnggaranBulanan.find((r) => r.bulan === selectedBulan) ||
    rekapAnggaranBulanan[rekapAnggaranBulanan.length - 1];

  const totalMasuk = rekapAnggaranBulanan.reduce((sum, r) => sum + r.realisasiMasuk, 0);
  const totalKeluar = rekapAnggaranBulanan.reduce((sum, r) => sum + r.realisasiKeluar, 0);
  const totalSaldoKumulatif = totalMasuk - totalKeluar;

  const kasMasukTotal = kasTransactions
    .filter((k) => k.tipe === 'Masuk')
    .reduce((s, k) => s + k.nominal, 0);
  const kasKeluarTotal = kasTransactions
    .filter((k) => k.tipe === 'Keluar')
    .reduce((s, k) => s + k.nominal, 0);
  const kasSaldoAkhir = kasMasukTotal - kasKeluarTotal;

  const handleAddKas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kasUraian.trim() || kasNominal <= 0) return;
    const acc = KAS_GL_ACCOUNTS.find((a) => a.code === kasKodeAkun);
    addKasTransaction({
      tanggal: kasTanggal,
      tipe: kasTipe,
      kategori: kasKategori,
      uraian: kasUraian,
      nominal: kasNominal,
      penanggungJawab: kasPJ,
      kodeAkun: acc?.code || kasKodeAkun,
      namaAkun: acc?.name,
    });
    setKasUraian('');
  };

  const todayStr = new Date().toISOString().substring(0, 10);

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3 no-print">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-700" />
            <span>Bendahara, Arus Kas & Monitoring Jajan Santri</span>
          </h2>
          <p className="text-xs text-slate-500">
            Rekapitulasi anggaran bulanan, buku kas masuk/keluar, monitoring kartu jajan santri, dan bisyaroh asatidz.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <PrintOrientationControl recommended="landscape" />
          <button
            type="button"
            onClick={() =>
              triggerReliablePrint({
                title: `Laporan Keuangan Pondok - ${selectedBulan} 2026`,
                orientation: printOrientation,
                paperSize: 'F4',
              })
            }
            className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Laporan Keuangan</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Realisasi Masuk (Bulan Ini)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 tabular-nums">
            Rp {(currentRekap.realisasiMasuk / 1000000).toFixed(1)} jt
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
            Syahriyah, Infaq & PSB
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Realisasi Keluar (Bulan Ini)</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 tabular-nums">
            Rp {(currentRekap.realisasiKeluar / 1000000).toFixed(1)} jt
          </p>
          <p className="text-[11px] text-rose-700 font-semibold mt-0.5">
            Gaji Asatidz, Dapur & Imtihan
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Surplus Saldo Bersih</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-950 mt-2 tabular-nums">
            Rp {(currentRekap.saldo / 1000000).toFixed(1)} jt
          </p>
          <p className="text-[11px] text-purple-700 font-semibold mt-0.5">
            Kinerja {currentRekap.persentaseRealisasi}% Akurat
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Kas Mengendap Kumulatif</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 tabular-nums">
            Rp {(totalSaldoKumulatif / 1000000).toFixed(1)} jt
          </p>
          <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
            Cadangan Kas Pondok 2026
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto no-print">
        {[
          { id: 'rekap_bulanan', label: 'Rekapitulasi & Grafik Bulanan' },
          { id: 'laporan_akuntansi', label: 'Laporan Keuangan' },
          { id: 'tagihan_santri', label: 'Pembayaran Bulanan & Daftar Ulang' },
          { id: 'cashflow', label: `Buku Kas Masuk / Keluar (${kasTransactions.length})` },
          { id: 'monitoring_jajan', label: 'Monitoring Jajan Santri' },
          { id: 'penggajian', label: `Manajemen Bisyaroh (${ustadzPayroll.length})` },
        ].map((tb) => (
          <button
            key={tb.id}
            onClick={() => setActiveTab(tb.id as typeof activeTab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition ${
              activeTab === tb.id
                ? 'bg-emerald-800 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* SUB-MENU BARU 1: TAGIHAN & PEMBAYARAN SANTRI (SYAHRIYAH, DAFTAR ULANG, AGENDA) */}
      {activeTab === 'tagihan_santri' && <TagihanSantriSubTab />}

      {/* SUB-MENU BARU 2: NERACA, LABA/RUGI & CASHFLOW (DETAIL LAPORAN + DRILL-DOWN + ASET SARPRAS) */}
      {activeTab === 'laporan_akuntansi' && <LaporanKeuanganSubTab />}

      {/* TAB 1: REKAPITULASI ANGGARAN & GRAFIK TREN BULANAN */}
      {activeTab === 'rekap_bulanan' && (() => {
        const monthlyTrendData = rekapAnggaranBulanan.map((b) => ({
          bulan: `${b.bulan.slice(0, 3)} ${String(b.tahun).slice(2)}`,
          bulanFull: `${b.bulan} ${b.tahun}`,
          Pemasukan: Math.round(b.realisasiMasuk / 100000) / 10,
          Pengeluaran: Math.round(b.realisasiKeluar / 100000) / 10,
          Surplus: Math.round(b.saldo / 100000) / 10,
          rawMasuk: b.realisasiMasuk,
          rawKeluar: b.realisasiKeluar,
          rawSaldo: b.saldo,
        }));

        return (
          <div className="space-y-5">
            {/* Recharts Financial Trend Visualization */}
            <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4 no-print">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-700" />
                    <span>Grafik Tren Pemasukan &amp; Pengeluaran Pesantren Bulanan</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Perbandingan realisasi kas masuk, kas keluar, dan surplus bersih per bulan (satuan Juta Rupiah).
                  </p>
                </div>
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl no-print shrink-0">
                  <button
                    type="button"
                    onClick={() => setChartMode('bar')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                      chartMode === 'bar'
                        ? 'bg-white text-emerald-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Grafik Batang
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartMode('area')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                      chartMode === 'area'
                        ? 'bg-white text-emerald-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Grafik Tren Area
                  </button>
                </div>
              </div>

              <div className="h-[290px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {chartMode === 'bar' ? (
                    <BarChart data={monthlyTrendData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#64748B' }}
                        tickFormatter={(v) => `${v} jt`}
                        width={54}
                      />
                      <Tooltip
                        formatter={(value: unknown, name: unknown) => [
                          `Rp ${Number(value).toLocaleString('id-ID')} jt`,
                          String(name),
                        ]}
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid #CBD5E1',
                          fontSize: '12px',
                          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                      <Bar dataKey="Pemasukan" fill="#0B5D3B" radius={[6, 6, 0, 0]} maxBarSize={38} />
                      <Bar dataKey="Pengeluaran" fill="#DC2626" radius={[6, 6, 0, 0]} maxBarSize={38} />
                      <Bar dataKey="Surplus" fill="#B8893B" radius={[6, 6, 0, 0]} maxBarSize={28} />
                    </BarChart>
                  ) : (
                    <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradMasuk" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0B5D3B" stopOpacity={0.28} />
                          <stop offset="95%" stopColor="#0B5D3B" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="gradKeluar" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#DC2626" stopOpacity={0.22} />
                          <stop offset="95%" stopColor="#DC2626" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#64748B' }}
                        tickFormatter={(v) => `${v} jt`}
                        width={54}
                      />
                      <Tooltip
                        formatter={(value: unknown, name: unknown) => [
                          `Rp ${Number(value).toLocaleString('id-ID')} jt`,
                          String(name),
                        ]}
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid #CBD5E1',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                      <Area
                        type="monotone"
                        dataKey="Pemasukan"
                        stroke="#0B5D3B"
                        strokeWidth={2.5}
                        fill="url(#gradMasuk)"
                      />
                      <Area
                        type="monotone"
                        dataKey="Pengeluaran"
                        stroke="#DC2626"
                        strokeWidth={2.5}
                        fill="url(#gradKeluar)"
                      />
                      <Area
                        type="monotone"
                        dataKey="Surplus"
                        stroke="#B8893B"
                        strokeWidth={2}
                        fill="none"
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-6 printable-area">
              <PrintKopPondok
                judulDokumen={`LAPORAN REKAPITULASI REALISASI ANGGARAN — ${currentRekap.bulan.toUpperCase()} ${currentRekap.tahun}`}
                subJudul={`Transparansi Anggaran Pesantren & Madrasah · Tahun Ajaran ${currentTahunAjaran}`}
                tahunAjaran={currentTahunAjaran}
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 no-print">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Laporan Rekapitulasi Realisasi Anggaran Pondok &amp; Madrasah
                  </h3>
                  <p className="text-xs text-slate-500">
                    Transparansi anggaran real-time tahun ajaran {currentTahunAjaran}
                  </p>
                </div>

                <div className="flex items-center gap-2 no-print">
                  <span className="text-xs text-slate-600 font-bold">Pilih Periode:</span>
                  <select
                    value={selectedBulan}
                    onChange={(e) => setSelectedBulan(e.target.value)}
                    className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold text-emerald-900"
                  >
                    {rekapAnggaranBulanan.map((b) => (
                      <option key={b.bulan} value={b.bulan}>
                        {b.bulan} {b.tahun}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-left bg-slate-50">
                  <th className="py-2.5 px-3">Pos Anggaran / Kategori Pengeluaran</th>
                  <th className="py-2.5 px-3 text-right">Rencana Anggaran (RAB)</th>
                  <th className="py-2.5 px-3 text-right">Realisasi Kas</th>
                  <th className="py-2.5 px-3 text-right">Selisih (Varian)</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold">
                {currentRekap.kategoriList.map((kat, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{kat.nama}</td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-600">
                      Rp {kat.rencana.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-900 font-bold">
                      Rp {kat.realisasi.toLocaleString('id-ID')}
                    </td>
                    <td
                      className={`py-3 px-3 text-right tabular-nums font-bold ${
                        kat.selisih >= 0 ? 'text-emerald-700' : 'text-slate-700'
                      }`}
                    >
                      {kat.selisih >= 0 ? '+' : ''}Rp {kat.selisih.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          kat.status === 'Surplus'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {kat.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 text-xs text-center">
            <div>
              <p className="mb-14 font-semibold">Mengetahui, Pengasuh Pondok</p>
              <p className="font-bold border-t border-slate-400 w-44 mx-auto pt-1">
                KH. Amin Maizun
              </p>
            </div>
            <div>
              <p className="mb-14 font-semibold">Bendahara Umum</p>
              <p className="font-bold border-t border-slate-400 w-44 mx-auto pt-1">
                Ust. M. Abdul Fatah
              </p>
            </div>
          </div>
        </div>
      </div>
        );
      })()}

      {/* TAB 2: BUKU KAS MASUK / KELUAR */}
      {activeTab === 'cashflow' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
              <span className="text-xs font-bold text-emerald-800">Total Kas Masuk</span>
              <p className="text-xl font-black text-emerald-950 tabular-nums mt-1">
                Rp {kasMasukTotal.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4">
              <span className="text-xs font-bold text-rose-800">Total Kas Keluar</span>
              <p className="text-xl font-black text-rose-950 tabular-nums mt-1">
                Rp {kasKeluarTotal.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-900 text-white p-4">
              <span className="text-xs font-bold text-amber-300">Saldo Buku Kas Aktif</span>
              <p className="text-xl font-black tabular-nums mt-1">
                Rp {kasSaldoAkhir.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleAddKas}
            className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-6 gap-3 items-end text-xs no-print"
          >
            <div>
              <label className="block font-bold text-slate-600 mb-1">Tanggal</label>
              <input
                type="date"
                value={kasTanggal}
                onChange={(e) => setKasTanggal(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Arus Kas</label>
              <select
                value={kasTipe}
                onChange={(e) => setKasTipe(e.target.value as 'Masuk' | 'Keluar')}
                className="w-full rounded-xl border border-slate-300 p-2 font-bold"
              >
                <option value="Masuk">Kas Masuk (+)</option>
                <option value="Keluar">Kas Keluar (-)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Akun GL &amp; Pos Kategori</label>
              <select
                value={kasKodeAkun}
                onChange={(e) => {
                  const chosen = KAS_GL_ACCOUNTS.find((a) => a.code === e.target.value);
                  setKasKodeAkun(e.target.value);
                  if (chosen) {
                    setKasKategori(chosen.defaultKat);
                    setKasTipe(chosen.tipe);
                  }
                }}
                className="w-full rounded-xl border border-slate-300 p-2 font-semibold"
              >
                {KAS_GL_ACCOUNTS.map((acc) => (
                  <option key={acc.code} value={acc.code}>
                    {acc.code} · {acc.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-600 mb-1">Uraian Transaksi</label>
              <input
                type="text"
                required
                placeholder="Contoh: Pembayaran Syahriyah / Belanja Dapur..."
                value={kasUraian}
                onChange={(e) => setKasUraian(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Nominal (Rp)</label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  value={kasNominal}
                  onChange={(e) => setKasNominal(parseInt(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-300 p-2 font-bold"
                />
                <button
                  type="submit"
                  className="px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shrink-0"
                  title="Simpan Transaksi Kas"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs printable-area space-y-3">
            <PrintKopPondok
              judulDokumen="BUKU KAS HARIAN MASUK & KELUAR PONDOK PESANTREN"
              subJudul={`Total Pemasukan: Rp ${kasMasukTotal.toLocaleString('id-ID')} · Total Pengeluaran: Rp ${kasKeluarTotal.toLocaleString('id-ID')} · Saldo Akhir: Rp ${kasSaldoAkhir.toLocaleString('id-ID')}`}
              tahunAjaran={currentTahunAjaran}
            />
            <h3 className="font-bold text-sm text-slate-900 no-print">
              Buku Kas Harian Pondok Pesantren NU Darussalam
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-left bg-slate-50">
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3">Uraian Transaksi</th>
                    <th className="py-2.5 px-3">PJ</th>
                    <th className="py-2.5 px-3 text-right">Masuk</th>
                    <th className="py-2.5 px-3 text-right">Keluar</th>
                    <th className="py-2.5 px-3 text-right no-print">Hapus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {kasTransactions.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 tabular-nums text-slate-500">{k.tanggal}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-700">{k.kategori}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{k.uraian}</td>
                      <td className="py-2.5 px-3 text-slate-500">{k.penanggungJawab}</td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold text-emerald-700">
                        {k.tipe === 'Masuk' ? `Rp ${k.nominal.toLocaleString('id-ID')}` : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold text-rose-700">
                        {k.tipe === 'Keluar' ? `Rp ${k.nominal.toLocaleString('id-ID')}` : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-right no-print">
                        <button
                          type="button"
                          onClick={() => deleteKasTransaction(k.id)}
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
          </div>
        </div>
      )}

      {/* TAB 3: MONITORING JAJAN SANTRI (BSI PSP MOBILE STYLE) */}
      {activeTab === 'monitoring_jajan' && (
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-5 printable-area">
          <PrintKopPondok
            judulDokumen="MONITORING SALDO & JAJAN KARTU SANTRI"
            subJudul={`Total Santri Terpantau: ${santriList.length} Santri · Tahun Ajaran ${currentTahunAjaran}`}
            tahunAjaran={currentTahunAjaran}
          />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 no-print">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>Monitoring Saldo & Jajan Kartu Santri (Cashless Pondok)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Pantau saldo mengendap santri, batas jajan harian, top-up cepat bendahara, dan status blokir kartu.
              </p>
            </div>
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-1.5">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={jajanSearch}
                onChange={(e) => setJajanSearch(e.target.value)}
                placeholder="Cari santri / NIS..."
                className="text-xs focus:outline-hidden"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[480px]">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="py-2.5 px-3 text-left">NIS & Nama Santri</th>
                  <th className="py-2.5 px-3 text-left">Kelas</th>
                  <th className="py-2.5 px-3 text-right">Saldo Kartu</th>
                  <th className="py-2.5 px-3 text-right">Jajan Hari Ini</th>
                  <th className="py-2.5 px-3 text-center">Limit Harian</th>
                  <th className="py-2.5 px-3 text-center">Status Kartu</th>
                  <th className="py-2.5 px-3 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {santriList
                  .filter(
                    (s) =>
                      !jajanSearch ||
                      s.nama.toLowerCase().includes(jajanSearch.toLowerCase()) ||
                      s.nis.includes(jajanSearch)
                  )
                  .slice(0, 40)
                  .map((s) => {
                    const spentToday = transaksiList
                      .filter(
                        (t) =>
                          t.santriId === s.id &&
                          t.tipe === 'Jajan Kantin' &&
                          t.waktu.startsWith(todayStr)
                      )
                      .reduce((sum, t) => sum + t.nominal, 0);

                    return (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-900">{s.nama}</span>
                          <span className="block text-[10px] text-emerald-800 tabular-nums font-bold">
                            {s.nis}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{s.kelas}</td>
                        <td className="py-2.5 px-3 text-right font-extrabold text-emerald-900 tabular-nums">
                          Rp {s.saldoKartu.toLocaleString('id-ID')}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums text-slate-600">
                          Rp {spentToday.toLocaleString('id-ID')}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <select
                            value={s.limitHarian}
                            onChange={(e) =>
                              updateLimitHarian(s.id, parseInt(e.target.value) || 20000)
                            }
                            className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-bold"
                          >
                            {[15000, 20000, 25000, 35000, 50000].map((val) => (
                              <option key={val} value={val}>
                                Rp {val.toLocaleString('id-ID')}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleStatusKartu(s.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                              s.statusKartu === 'Aktif'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {s.statusKartu === 'Aktif' ? (
                              <Unlock className="w-3 h-3" />
                            ) : (
                              <Lock className="w-3 h-3" />
                            )}
                            <span>{s.statusKartu}</span>
                          </button>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => topUpSaldo(s.id, 50000, 'Loket Bendahara Pondok')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold"
                          >
                            +50rb Tunai
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MODUL MANAJEMEN BISYAROH ASATIDZ (DASHBOARD GLOBAL, EDIT MASSAL & RIWAYAT) */}
      {activeTab === 'penggajian' && (() => {
        const calcBisyarohDiniyah = (jtm: number, hadir: number) =>
          Math.round(((jtm * hadir) / 2) * 10000);
        const calcTunjanganTetap = (row: (typeof ustadzPayroll)[number]) =>
          row.gajiPokok +
          row.tunjanganTransportasi +
          row.tunjanganMasaKerja +
          row.tunjanganKomunikasi +
          row.tunjanganJabatan +
          row.bisyarohTakhasus;
        const calcTotal = (row: (typeof ustadzPayroll)[number]) =>
          calcTunjanganTetap(row) + calcBisyarohDiniyah(row.jtmDiniyah, row.jumlahHadir);

        const grandTotalBisyaroh = ustadzPayroll.reduce((acc, r) => acc + calcTotal(r), 0);
        const totalDibayarkan = ustadzPayroll
          .filter((r) => r.statusBayar === 'Dibayarkan')
          .reduce((acc, r) => acc + calcTotal(r), 0);
        const countDibayarkan = ustadzPayroll.filter((r) => r.statusBayar === 'Dibayarkan').length;
        const readyCount = ustadzPayroll.length - countDibayarkan;
        const totalJtmAll = ustadzPayroll.reduce((acc, r) => acc + r.jtmDiniyah, 0);

        const filteredRows = ustadzPayroll.filter((r) => {
          if (bisyarohStatusFilter !== 'Semua' && r.statusBayar !== bisyarohStatusFilter) return false;
          if (
            bisyarohSearch &&
            !r.ustadzNama.toLowerCase().includes(bisyarohSearch.toLowerCase()) &&
            !r.jabatan.toLowerCase().includes(bisyarohSearch.toLowerCase())
          ) {
            return false;
          }
          return true;
        });

        const bisyarohChartData = ustadzPayroll.map((r) => ({
          nama: r.ustadzNama.replace(/^(KH\.|Ust\.|Usth\.|M\.)\s*/i, '').split(' ').slice(0, 2).join(' '),
          'Tunjangan Tetap': Math.round(calcTunjanganTetap(r) / 1000),
          'Bisyaroh Diniyah': Math.round(calcBisyarohDiniyah(r.jtmDiniyah, r.jumlahHadir) / 1000),
        }));

        const filteredHistory = bisyarohHistory.filter((h) => {
          if (historyBulanFilter !== 'Semua' && h.bulan !== historyBulanFilter) return false;
          if (
            historySearch &&
            !h.ustadzNama.toLowerCase().includes(historySearch.toLowerCase())
          ) {
            return false;
          }
          return true;
        });

        const totalHistoryFiltered = filteredHistory.reduce((s, h) => s + h.totalDiterima, 0);
        const uniqueHistoryMonths = Array.from(new Set(bisyarohHistory.map((h) => h.bulan)));

        const handlePaySingle = (row: (typeof ustadzPayroll)[number]) => {
          const total = calcTotal(row);
          payBisyarohRow(row.ustadzId, selectedBulan, 2026, 'Tunai Loket');
          setPayrollNotice(
            `Bisyaroh ${row.ustadzNama} (${selectedBulan}) sebesar Rp ${total.toLocaleString('id-ID')} dicairkan ke Riwayat & Buku Kas Keluar.`
          );
          setTimeout(() => setPayrollNotice(''), 4000);
        };

        return (
          <div className="space-y-5">
            {/* Header & Segmented Sub-View Switcher */}
            <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4 no-print">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Manajemen Bisyaroh Dewan Asatidz — Periode {selectedBulan} 2026
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dashboard global, input hadir massal, sinkron JTM mengajar Ma&apos;arifan, pencairan ke Buku Kas, dan riwayat penyaluran per periode.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 no-print">
                  <select
                    value={selectedBulan}
                    onChange={(e) => setSelectedBulan(e.target.value)}
                    className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold text-emerald-900 bg-white"
                  >
                    {['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((bln) => (
                      <option key={bln} value={bln}>
                        Periode {bln} 2026
                      </option>
                    ))}
                  </select>
                  <PrintOrientationControl recommended="landscape" />
                  <button
                    type="button"
                    onClick={() =>
                      triggerReliablePrint({
                        title: `Manajemen Bisyaroh Dewan Asatidz - ${selectedBulan} 2026`,
                        orientation: printOrientation,
                        paperSize: 'F4',
                      })
                    }
                    className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak F4</span>
                  </button>
                </div>
              </div>

              {/* Sub-Navigation Switcher */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit overflow-x-auto no-print">
                <button
                  type="button"
                  onClick={() => setBisyarohSubTab('dashboard')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                    bisyarohSubTab === 'dashboard'
                      ? 'bg-white text-emerald-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Dashboard &amp; Preview Global</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBisyarohSubTab('edit')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                    bisyarohSubTab === 'edit'
                      ? 'bg-white text-emerald-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Input &amp; Edit Rincian ({ustadzPayroll.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBisyarohSubTab('riwayat')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                    bisyarohSubTab === 'riwayat'
                      ? 'bg-white text-emerald-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Riwayat Penyaluran ({bisyarohHistory.length})</span>
                </button>
              </div>

              {payrollNotice && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 no-print">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{payrollNotice}</span>
                </div>
              )}

              {/* 4 Global Summary KPI Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <p className="text-[11px] font-semibold text-slate-500">Total Anggaran ({selectedBulan})</p>
                  <p className="text-base font-bold text-slate-900 tabular-nums mt-0.5">
                    Rp {grandTotalBisyaroh.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                  <p className="text-[11px] font-semibold text-emerald-700">
                    Sudah Dibayarkan ({countDibayarkan}/{ustadzPayroll.length})
                  </p>
                  <p className="text-base font-bold text-emerald-900 tabular-nums mt-0.5">
                    Rp {totalDibayarkan.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                  <p className="text-[11px] font-semibold text-amber-800">
                    Siap Dicairkan ({readyCount} Ustadz)
                  </p>
                  <p className="text-base font-bold text-amber-900 tabular-nums mt-0.5">
                    Rp {(grandTotalBisyaroh - totalDibayarkan).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <p className="text-[11px] font-semibold text-slate-500">Total Beban Mengajar</p>
                  <p className="text-base font-bold text-slate-900 tabular-nums mt-0.5">
                    {totalJtmAll} JTM <span className="text-[11px] font-normal text-slate-500">· {ustadzPayroll.length} Guru</span>
                  </p>
                </div>
              </div>
            </div>

            {/* SUB-VIEW 1: DASHBOARD GLOBAL + AKSI MASSAL + PREVIEW */}
            {bisyarohSubTab === 'dashboard' && (
              <div className="space-y-5">
                {/* Global Recharts BarChart + Batch Actions Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 no-print">
                  <div className="lg:col-span-8 rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">
                          Grafik Sebaran Bisyaroh per Ustadz (Ribu Rupiah)
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Perbandingan Tunjangan Tetap vs Bisyaroh Mengajar Diniyah seluruh dewan asatidz.
                        </p>
                      </div>
                    </div>
                    <div className="h-[240px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={bisyarohChartData} margin={{ top: 8, right: 12, left: 0, bottom: 16 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                          <XAxis
                            dataKey="nama"
                            tick={{ fontSize: 10, fill: '#475569' }}
                            interval={0}
                            angle={-25}
                            textAnchor="end"
                            height={48}
                          />
                          <YAxis tick={{ fontSize: 10, fill: '#64748B' }} tickFormatter={(v) => `${v}rb`} width={48} />
                          <Tooltip
                            formatter={(val: unknown, name: unknown) => [
                              `Rp ${(Number(val) * 1000).toLocaleString('id-ID')}`,
                              String(name),
                            ]}
                            contentStyle={{ borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '11px' }} />
                          <Bar dataKey="Tunjangan Tetap" stackId="a" fill="#0B5D3B" radius={[0, 0, 0, 0]} />
                          <Bar dataKey="Bisyaroh Diniyah" stackId="a" fill="#B8893B" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Quick Global Batch Panel */}
                  <div className="lg:col-span-4 rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-emerald-700" />
                        <span>Kontrol Massal (Tanpa Input Satu-Satu)</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Perbarui kehadiran semua ustadz sekaligus atau cairkan seluruh bisyaroh yang berstatus Siap dalam 1 klik.
                      </p>

                      <div className="space-y-1.5 pt-1">
                        <label className="block text-[11px] font-bold text-slate-700">
                          Set Jumlah Hadir Massal (Semua Ustadz)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min={0}
                            max={31}
                            value={bulkHadirInput}
                            onChange={(e) => setBulkHadirInput(Math.max(0, Math.min(31, parseInt(e.target.value, 10) || 0)))}
                            className="w-24 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold tabular-nums"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              bulkUpdatePayrollHadir(bulkHadirInput);
                              setPayrollNotice(`Jumlah hadir seluruh asatidz diperbarui menjadi ${bulkHadirInput} hari.`);
                              setTimeout(() => setPayrollNotice(''), 3500);
                            }}
                            className="flex-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold whitespace-nowrap"
                          >
                            Terapkan ke Semua
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            syncPayrollAbsensi();
                            setPayrollNotice("JTM & kehadiran asatidz disinkronkan dengan data jadwal & absensi Ma'arifan.");
                            setTimeout(() => setPayrollNotice(''), 3500);
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Sync JTM &amp; Absensi Ma&apos;arifan</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            resetAllPayrollToSiap();
                            setPayrollNotice(`Periode baru ${selectedBulan} disiapkan: semua status disetel ke "Siap".`);
                            setTimeout(() => setPayrollNotice(''), 3500);
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                        >
                          Siapkan Periode Baru (Reset Status Siap)
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={readyCount === 0}
                      onClick={() => {
                        const count = payAllReadyBisyaroh(selectedBulan, 2026);
                        if (count > 0) {
                          setPayrollNotice(
                            `Pencairan massal ${count} ustadz periode ${selectedBulan} berhasil dicatat ke Buku Kas & Riwayat.`
                          );
                          setTimeout(() => setPayrollNotice(''), 4500);
                        }
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Cairkan Semua yang Siap ({readyCount} Ustadz)</span>
                    </button>
                  </div>
                </div>

                {/* Global Preview Table */}
                <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4 printable-area">
                  <PrintKopPondok
                    judulDokumen={`REKAPITULASI BISYAROH DEWAN ASATIDZ — ${selectedBulan.toUpperCase()} 2026`}
                    subJudul={`Total Anggaran: Rp ${grandTotalBisyaroh.toLocaleString('id-ID')} · Total Beban: ${totalJtmAll} JTM`}
                    tahunAjaran={currentTahunAjaran}
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
                      {(['Semua', 'Siap', 'Dibayarkan'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setBisyarohStatusFilter(st)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            bisyarohStatusFilter === st
                              ? 'bg-white text-emerald-900 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-1.5 max-w-xs w-full">
                      <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={bisyarohSearch}
                        onChange={(e) => setBisyarohSearch(e.target.value)}
                        placeholder="Cari ustadz atau jabatan..."
                        className="text-xs w-full focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-emerald-900 text-white text-left font-bold">
                          <th className="py-2.5 px-3">Ustadz / Jabatan</th>
                          <th className="py-2.5 px-3">Domisili</th>
                          <th className="py-2.5 px-3 text-center">JTM</th>
                          <th className="py-2.5 px-3 text-center">Hadir</th>
                          <th className="py-2.5 px-3 text-right">Tunjangan Tetap</th>
                          <th className="py-2.5 px-3 text-right">Bisyaroh Diniyah</th>
                          <th className="py-2.5 px-3 text-right">Total Terima</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                          <th className="py-2.5 px-3 text-right no-print">Aksi Cepat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredRows.map((row) => {
                          const tunjanganTetap = calcTunjanganTetap(row);
                          const bisyarohDiniyah = calcBisyarohDiniyah(row.jtmDiniyah, row.jumlahHadir);
                          const total = tunjanganTetap + bisyarohDiniyah;
                          return (
                            <tr key={row.ustadzId} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3">
                                <p className="font-bold text-slate-900">{row.ustadzNama}</p>
                                <p className="text-[11px] text-slate-500">{row.jabatan}</p>
                              </td>
                              <td className="py-2.5 px-3 text-slate-700 font-medium">{row.domisili}</td>
                              <td className="py-2.5 px-3 text-center tabular-nums font-bold text-slate-800">
                                {row.jtmDiniyah}
                              </td>
                              <td className="py-2.5 px-3 text-center tabular-nums font-bold text-slate-800">
                                {row.jumlahHadir} hr
                              </td>
                              <td className="py-2.5 px-3 text-right tabular-nums text-slate-700">
                                Rp {tunjanganTetap.toLocaleString('id-ID')}
                              </td>
                              <td className="py-2.5 px-3 text-right tabular-nums text-emerald-900 font-semibold">
                                Rp {bisyarohDiniyah.toLocaleString('id-ID')}
                              </td>
                              <td className="py-2.5 px-3 text-right tabular-nums font-bold text-slate-900">
                                Rp {total.toLocaleString('id-ID')}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span
                                  className={`text-[11px] font-bold ${
                                    row.statusBayar === 'Dibayarkan'
                                      ? 'text-emerald-700'
                                      : 'text-amber-700'
                                  }`}
                                >
                                  {row.statusBayar === 'Dibayarkan'
                                    ? `Dibayarkan${row.terakhirDibayar ? ` (${row.terakhirDibayar})` : ''}`
                                    : 'Siap Dicairkan'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right no-print">
                                {row.statusBayar === 'Siap' ? (
                                  <button
                                    type="button"
                                    onClick={() => handlePaySingle(row)}
                                    className="px-3 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold whitespace-nowrap"
                                  >
                                    Bayar &amp; Catat
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => togglePayrollStatus(row.ustadzId)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold whitespace-nowrap"
                                  >
                                    Set Siap Lagi
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: INPUT & EDIT RINCIAN SPREADSHEET */}
            {bisyarohSubTab === 'edit' && (
              <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4 printable-area">
                <div className="flex flex-wrap items-center justify-between gap-2 no-print">
                  <p className="text-xs text-slate-500">
                    Formula Bisyaroh Diniyah: <span className="font-semibold text-emerald-800">((JTM Diniyah × Jumlah Hadir) ÷ 2) × Rp 10.000</span>. Edit nominal langsung di sel tabel.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      syncPayrollAbsensi();
                      setPayrollNotice("Jumlah hadir & JTM guru disinkronkan dengan Ma'arifan.");
                      setTimeout(() => setPayrollNotice(''), 3500);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Absensi Guru</span>
                  </button>
                </div>

                <PrintKopPondok
                  judulDokumen={`DAFTAR PENERIMAAN BISYAROH DEWAN ASATIDZ — ${selectedBulan.toUpperCase()} 2026`}
                  subJudul={`Rincian Gaji Pokok, Tunjangan, & Bisyaroh Mengajar · T.A. ${currentTahunAjaran}`}
                  tahunAjaran={currentTahunAjaran}
                />

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-emerald-900 text-white text-left font-bold">
                        <th className="py-2.5 px-2.5">Nama Ustadz &amp; Jabatan</th>
                        <th className="py-2.5 px-2">Domisili</th>
                        <th className="py-2.5 px-2 text-right">Gaji Pokok</th>
                        <th className="py-2.5 px-2 text-right">Transport</th>
                        <th className="py-2.5 px-2 text-right">Masa Kerja</th>
                        <th className="py-2.5 px-2 text-right">Komunikasi</th>
                        <th className="py-2.5 px-2 text-right">Jabatan</th>
                        <th className="py-2.5 px-2 text-right">Takhasus</th>
                        <th className="py-2.5 px-2 text-center">JTM</th>
                        <th className="py-2.5 px-2 text-center">Hadir</th>
                        <th className="py-2.5 px-2 text-right bg-emerald-950">Bisyaroh Diniyah</th>
                        <th className="py-2.5 px-2.5 text-right bg-emerald-950">Total Terima</th>
                        <th className="py-2.5 px-2 text-center">Status</th>
                        <th className="py-2.5 px-2 text-right no-print">Kas &amp; Riwayat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ustadzPayroll.map((row) => {
                        const bisyarohDiniyah = calcBisyarohDiniyah(row.jtmDiniyah, row.jumlahHadir);
                        const total = calcTotal(row);
                        return (
                          <tr key={row.ustadzId} className="hover:bg-slate-50">
                            <td className="py-2 px-2.5 min-w-[170px]">
                              <p className="font-bold text-slate-900">{row.ustadzNama}</p>
                              <p className="text-[10px] text-slate-500">{row.jabatan}</p>
                            </td>
                            <td className="py-2 px-2">
                              <select
                                value={row.domisili}
                                onChange={(e) =>
                                  updatePayrollRow(row.ustadzId, {
                                    domisili: e.target.value as 'Laju' | 'Mukim',
                                  })
                                }
                                className="rounded-lg border border-slate-300 px-1.5 py-1 text-[11px] font-semibold bg-white"
                              >
                                <option value="Laju">Laju</option>
                                <option value="Mukim">Mukim</option>
                              </select>
                            </td>
                            {(
                              [
                                'gajiPokok',
                                'tunjanganTransportasi',
                                'tunjanganMasaKerja',
                                'tunjanganKomunikasi',
                                'tunjanganJabatan',
                                'bisyarohTakhasus',
                              ] as const
                            ).map((field) => (
                              <td key={field} className="py-2 px-1.5 text-right">
                                <input
                                  type="number"
                                  min={0}
                                  step={10000}
                                  value={row[field]}
                                  onChange={(e) =>
                                    updatePayrollRow(row.ustadzId, {
                                      [field]: Math.max(0, parseInt(e.target.value, 10) || 0),
                                    })
                                  }
                                  className="w-22 text-right rounded-lg border border-slate-200 px-1.5 py-1 tabular-nums font-semibold focus:border-emerald-700 outline-none"
                                />
                              </td>
                            ))}
                            <td className="py-2 px-1.5 text-center">
                              <input
                                type="number"
                                min={0}
                                max={24}
                                value={row.jtmDiniyah}
                                onChange={(e) =>
                                  updatePayrollRow(row.ustadzId, {
                                    jtmDiniyah: Math.max(0, parseInt(e.target.value, 10) || 0),
                                  })
                                }
                                className="w-12 text-center rounded-lg border border-slate-200 px-1 py-1 tabular-nums font-bold focus:border-emerald-700 outline-none"
                              />
                            </td>
                            <td className="py-2 px-1.5 text-center">
                              <input
                                type="number"
                                min={0}
                                max={31}
                                value={row.jumlahHadir}
                                onChange={(e) =>
                                  updatePayrollRow(row.ustadzId, {
                                    jumlahHadir: Math.max(0, parseInt(e.target.value, 10) || 0),
                                  })
                                }
                                className="w-12 text-center rounded-lg border border-slate-200 px-1 py-1 tabular-nums font-bold focus:border-emerald-700 outline-none"
                              />
                            </td>
                            <td className="py-2 px-2 text-right tabular-nums font-semibold text-emerald-900 bg-emerald-50/50 whitespace-nowrap">
                              Rp {bisyarohDiniyah.toLocaleString('id-ID')}
                            </td>
                            <td className="py-2 px-2.5 text-right tabular-nums font-bold text-slate-900 bg-emerald-50 whitespace-nowrap">
                              Rp {total.toLocaleString('id-ID')}
                            </td>
                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => togglePayrollStatus(row.ustadzId)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition whitespace-nowrap ${
                                  row.statusBayar === 'Dibayarkan'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                                }`}
                              >
                                {row.statusBayar === 'Dibayarkan' ? 'Dibayarkan' : 'Siap'}
                              </button>
                            </td>
                            <td className="py-2 px-2 text-right no-print">
                              <button
                                type="button"
                                onClick={() => handlePaySingle(row)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-800 text-white text-[10px] font-bold inline-flex items-center gap-1 whitespace-nowrap"
                                title="Cairkan & catat ke Riwayat Bisyaroh serta Buku Kas"
                              >
                                <Wallet className="w-3 h-3" />
                                <span>Bayar &amp; Catat</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                        <td colSpan={10} className="py-2.5 px-3 text-right">
                          TOTAL KESELURUHAN BISYAROH BULAN {selectedBulan.toUpperCase()} 2026
                        </td>
                        <td className="py-2.5 px-2 text-right tabular-nums text-emerald-900">
                          Rp{' '}
                          {ustadzPayroll
                            .reduce((s, r) => s + calcBisyarohDiniyah(r.jtmDiniyah, r.jumlahHadir), 0)
                            .toLocaleString('id-ID')}
                        </td>
                        <td className="py-2.5 px-2.5 text-right tabular-nums text-emerald-950">
                          Rp {grandTotalBisyaroh.toLocaleString('id-ID')}
                        </td>
                        <td colSpan={2} className="py-2.5 px-2 text-center text-[10px] text-slate-500">
                          {countDibayarkan} Selesai / {readyCount} Siap
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: RIWAYAT PENYALURAN BISYAROH */}
            {bisyarohSubTab === 'riwayat' && (
              <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4 printable-area">
                <PrintKopPondok
                  judulDokumen="RIWAYAT PENCAIRAN & PENYALURAN BISYAROH DEWAN ASATIDZ"
                  subJudul={`Periode Filter: ${historyBulanFilter} · Total Terbayar: Rp ${totalHistoryFiltered.toLocaleString('id-ID')}`}
                  tahunAjaran={currentTahunAjaran}
                />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 no-print">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <History className="w-4 h-4 text-emerald-700" />
                      <span>Riwayat Pembayaran &amp; Pencairan Bisyaroh Dewan Asatidz</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Menampilkan {filteredHistory.length} transaksi pencairan · Total terbayar pada filter ini:{' '}
                      <strong className="text-emerald-900 tabular-nums">
                        Rp {totalHistoryFiltered.toLocaleString('id-ID')}
                      </strong>
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 no-print">
                    <select
                      value={historyBulanFilter}
                      onChange={(e) => setHistoryBulanFilter(e.target.value)}
                      className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold bg-white"
                    >
                      <option value="Semua">Semua Bulan ({bisyarohHistory.length})</option>
                      {uniqueHistoryMonths.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1.5 border border-slate-300 rounded-xl px-2.5 py-1.5">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        placeholder="Cari nama ustadz..."
                        className="text-xs w-36 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-left font-bold">
                        <th className="py-2.5 px-3">Tanggal Bayar</th>
                        <th className="py-2.5 px-3">Periode</th>
                        <th className="py-2.5 px-3">Nama Ustadz &amp; Jabatan</th>
                        <th className="py-2.5 px-3 text-center">JTM × Hadir</th>
                        <th className="py-2.5 px-3 text-right">Tunjangan Tetap</th>
                        <th className="py-2.5 px-3 text-right">Bisyaroh Diniyah</th>
                        <th className="py-2.5 px-3 text-right">Total Diterima</th>
                        <th className="py-2.5 px-3">Metode &amp; Petugas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredHistory.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                            Belum ada riwayat pembayaran bisyaroh pada filter yang dipilih.
                          </td>
                        </tr>
                      ) : (
                        filteredHistory.map((h) => (
                          <tr key={h.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 tabular-nums text-slate-600">{h.tanggalBayar}</td>
                            <td className="py-2.5 px-3 font-bold text-emerald-900">
                              {h.bulan} {h.tahun}
                            </td>
                            <td className="py-2.5 px-3">
                              <p className="font-bold text-slate-900">{h.ustadzNama}</p>
                              <p className="text-[11px] text-slate-500">
                                {h.jabatan} · {h.domisili}
                              </p>
                            </td>
                            <td className="py-2.5 px-3 text-center tabular-nums font-semibold">
                              {h.jtmDiniyah} JTM × {h.jumlahHadir} hr
                            </td>
                            <td className="py-2.5 px-3 text-right tabular-nums text-slate-700">
                              Rp {h.tunjanganTetap.toLocaleString('id-ID')}
                            </td>
                            <td className="py-2.5 px-3 text-right tabular-nums text-emerald-800 font-semibold">
                              Rp {h.bisyarohDiniyah.toLocaleString('id-ID')}
                            </td>
                            <td className="py-2.5 px-3 text-right tabular-nums font-bold text-slate-900">
                              Rp {h.totalDiterima.toLocaleString('id-ID')}
                            </td>
                            <td className="py-2.5 px-3 text-[11px] text-slate-600">
                              {h.metode} · {h.petugas}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};
