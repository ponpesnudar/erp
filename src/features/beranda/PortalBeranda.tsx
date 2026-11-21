import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Calendar as CalendarIcon,
  Bell,
  FileCheck,
  BookOpen,
  Mail,
  Shield,
  CreditCard,
  UserPlus,
  KeyRound,
  Filter,
  UserCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useAppStore } from '../../lib/store.ts';
import { useAuth } from '../../lib/auth.ts';
import { GlobalDashboard } from './GlobalDashboard.tsx';

interface PortalBerandaProps {
  onNavigate: (moduleTab: string) => void;
}

export const PortalBeranda: React.FC<PortalBerandaProps> = ({ onNavigate }) => {
  const {
    currentUser,
    activeRole,
    santriList,
    kotakMasuk,
    auditLogs,
    rekapAnggaranBulanan,
    currentTahunAjaran,
  } = useAppStore();

  const { isFinancialPrivileged, can } = useAuth();
  const [filterLogModul, setFilterLogModul] = useState<string>('Semua');

  // Chart data: Santri per kelas
  const santriByKelasData = [
    { name: '1 MDS', putra: 24, putri: 32 },
    { name: '2 MDS', putra: 28, putri: 36 },
    { name: '3 MDS', putra: 26, putri: 35 },
    { name: '4 MDS', putra: 28, putri: 34 },
    { name: '5 MDS', putra: 26, putri: 35 },
    { name: '6 MDS', putra: 28, putri: 34 },
  ];

  // Gender pie data (live from santriList)
  const putraCount = santriList.filter((s) => s.gender === 'L').length;
  const putriCount = santriList.filter((s) => s.gender === 'P').length;
  const genderData = [
    { name: 'Santri Putra', value: putraCount, color: '#0B5D3B' },
    { name: 'Santri Putri', value: putriCount, color: '#10B981' },
  ];

  // Cashflow data for financial privileged roles
  const cashflowData = rekapAnggaranBulanan.map((b) => ({
    bulan: b.bulan,
    pemasukan: Math.round(b.realisasiMasuk / 1000000),
    pengeluaran: Math.round(b.realisasiKeluar / 1000000),
    saldo: Math.round(b.saldo / 1000000),
  }));

  // Filtered audit logs
  const filteredLogs = auditLogs.filter(
    (log) => filterLogModul === 'Semua' || log.modul === filterLogModul
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat pagi';
    if (hour < 15) return 'Selamat siang';
    if (hour < 18) return 'Selamat sore';
    return 'Selamat malam';
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner (Lampiran D style) */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white p-6 sm:p-8 shadow-xs border border-emerald-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            Tahun Ajaran Aktif {currentTahunAjaran}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {getGreeting()}, {currentUser.nama.split(' ')[0]} 👋
          </h1>
          <p className="text-xs text-emerald-100 leading-relaxed">
            Selamat datang di Sistem ERP Pondok Pesantren NU Darussalam Karangdadap, Pekalongan. Seluruh administrasi santri, imtihan, persuratan, dan keuangan terintegrasi real-time.
          </p>
          {!['wali_santri', 'kasir_kantin'].includes(activeRole) && (
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('sdm_absensi')}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-extrabold flex items-center gap-2 shadow-xs transition"
              >
                <UserCheck className="w-4 h-4" />
                <span>Buka Aplikasi Absensi Guru (Swafoto GPS)</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-white/10 p-2 flex items-center justify-center border border-white/20">
            <img
              src="/assets/aistudio/preview__14__3b7f388f.webp"
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-amber-300">PP NU Darussalam</p>
            <p className="text-[10px] text-emerald-200">Karangdadap, Pekalongan</p>
          </div>
        </div>
      </div>

      {/* GlobalDashboard: Ringkasan Performa Real-Time Lintas Modul */}
      <GlobalDashboard onNavigate={onNavigate} />

      {/* Main Grid: Left Quick Access & Charts, Right Sidebar Widgets (Profile, Inbox, Announcements) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Quick Modules & Visualizations */}
        <div className="lg:col-span-8 space-y-6">
          {/* Akses Cepat ke Modul (Lampiran D grid cards) */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900">Akses Cepat ke Modul</h3>
              <span className="text-xs text-slate-400">Pilih modul untuk masuk</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  id: 'imtihan',
                  title: 'Imtihan & Ujian',
                  desc: 'Soal pegon, denah acak, kartu, raport & RAB imtihan',
                  icon: FileCheck,
                  badge: 'Gasal 26',
                  color: 'text-emerald-700 bg-emerald-50',
                },
                {
                  id: 'maarifan',
                  title: "Ma'arifan Diniyah",
                  desc: 'Absensi cepat guru & santri, kurikulum kitab salaf',
                  icon: BookOpen,
                  badge: 'Harian',
                  color: 'text-blue-700 bg-blue-50',
                },
                ...(!['wali_santri', 'kasir_kantin'].includes(activeRole)
                  ? [
                      {
                        id: 'sdm_absensi',
                        title: 'SDM & Absensi Guru',
                        desc: 'Cek in swafoto GPS mobile, rekapan absensi & monitoring SDM',
                        icon: UserCheck,
                        badge: 'Mobile GPS',
                        color: 'text-emerald-800 bg-emerald-100',
                      },
                    ]
                  : []),
                {
                  id: 'sekretaris',
                  title: 'Sekretariat',
                  desc: 'Surat keluar/masuk otomatis, data santri & asatidz',
                  icon: Mail,
                  badge: 'Resmi',
                  color: 'text-amber-700 bg-amber-50',
                },
                ...(isFinancialPrivileged()
                  ? [
                      {
                        id: 'bendahara',
                        title: 'Bendahara & Kas',
                        desc: 'Arus kas masuk/keluar, penggajian, rekap bulanan',
                        icon: DollarSign,
                        badge: 'Keuangan',
                        color: 'text-purple-700 bg-purple-50',
                      },
                    ]
                  : []),
                {
                  id: 'transaksi',
                  title: 'Transaksi & POS',
                  desc: 'Kartu santri RFID tap, laundry pondok, batas belanja',
                  icon: CreditCard,
                  badge: 'Cashless',
                  color: 'text-rose-700 bg-rose-50',
                },
                {
                  id: 'kemahadiyahan',
                  title: "Kema'hadiyahan",
                  desc: 'Bagan organisasi kepanitiaan PHBI/PHBN & kalender',
                  icon: Users,
                  badge: 'Organisasi',
                  color: 'text-teal-700 bg-teal-50',
                },
                {
                  id: 'bk',
                  title: 'BK & Keamanan',
                  desc: 'Poin pelanggaran, takzir syar\'i, perizinan & buku tamu',
                  icon: Shield,
                  badge: 'Ketertiban',
                  color: 'text-indigo-700 bg-indigo-50',
                },
                {
                  id: 'psb',
                  title: 'Pendaftaran PSB',
                  desc: 'Verifikasi berkas, cetak bukti, penerbitan NIS atomik',
                  icon: UserPlus,
                  badge: 'Online',
                  color: 'text-cyan-700 bg-cyan-50',
                },
                ...(activeRole === 'admin_sistem'
                  ? [
                      {
                        id: 'akses',
                        title: 'Hak Akses Role',
                        desc: 'Peta wewenang & kartu fitur chip aksi berwarna',
                        icon: KeyRound,
                        badge: 'Admin',
                        color: 'text-slate-800 bg-slate-100',
                      },
                    ]
                  : []),
              ].map((mod) => {
                const Icon = mod.icon;
                return (
                  <div
                    key={mod.id}
                    onClick={() => onNavigate(mod.id)}
                    className="p-3.5 rounded-2xl border border-slate-200/90 hover:border-emerald-600 hover:bg-emerald-50/30 transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${mod.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {mod.badge}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 transition">
                        {mod.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {mod.desc}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-800">
                      <span>Buka Modul</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recharts Visualizations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donut Chart: Gender Santri Mukim */}
            <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs">
              <h4 className="font-bold text-xs text-slate-900 mb-2">
                Komposisi Santri Mukim (Gender)
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [`${val} Santri`, 'Jumlah']}
                      contentStyle={{ borderRadius: '12px', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 text-xs mt-2 tabular-nums">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-emerald-800" />
                  Putra: {putraCount} ({santriList.length > 0 ? Math.round((putraCount / santriList.length) * 100) : 0}%)
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  Putri: {putriCount} ({santriList.length > 0 ? Math.round((putriCount / santriList.length) * 100) : 0}%)
                </span>
              </div>
            </div>

            {/* Bar Chart: Santri per Kelas */}
            <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs">
              <h4 className="font-bold text-xs text-slate-900 mb-2">
                Distribusi Santri per Kelas Diniyah
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={santriByKelasData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                    <Bar dataKey="putra" fill="#0B5D3B" name="Putra" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="putri" fill="#10B981" name="Putri" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 text-xs mt-2">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-emerald-800" />
                  Putra
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  Putri
                </span>
              </div>
            </div>
          </div>

          {/* ARUS KAS BULANAN (Strictly Rendered ONLY for Pengasuh & Bendahara) */}
          {isFinancialPrivileged() && (
            <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                    <span>Tren Arus Kas Bulanan (Juta Rupiah)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Transparansi realisasi pemasukan vs pengeluaran kas pondok
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Akses Terproteksi (Pengasuh & Bendahara)
                </span>
              </div>

              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashflowData}>
                    <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val) => [`Rp ${val} Juta`, 'Nominal']}
                      contentStyle={{ borderRadius: '12px', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="pemasukan" fill="#0B5D3B" name="Pemasukan" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pengeluaran" fill="#F43F5E" name="Pengeluaran" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Riwayat Aktivitas ERP (Audit Trail with Module Filter) */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Riwayat Aktivitas & Jejak Audit</h4>
                <p className="text-[11px] text-slate-500">Catatan perubahan data operasional pondok</p>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={filterLogModul}
                  onChange={(e) => setFilterLogModul(e.target.value)}
                  className="rounded-xl border border-slate-200 px-2.5 py-1 text-xs focus:outline-hidden"
                >
                  <option value="Semua">Semua Modul</option>
                  <option value="Imtihan">Imtihan</option>
                  <option value="Bendahara">Bendahara</option>
                  <option value="Ma'arifan">Ma'arifan</option>
                  <option value="Transaksi">Transaksi</option>
                  <option value="PSB">PSB</option>
                  <option value="Akses">Akses</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
              {filteredLogs.map((log) => (
                <div key={log.id} className="py-2.5 text-xs flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800">
                      <span className="text-emerald-800 mr-1.5">[{log.modul}]</span>
                      {log.aksi} - {log.userName}
                    </p>
                    <p className="text-slate-500 text-[11px]">{log.keterangan}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 tabular-nums">
                    {log.waktu}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Profil Saya, Kotak Masuk & Pengumuman */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profil Saya Card */}
          <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.nama}
                className="w-12 h-12 rounded-2xl object-cover border border-emerald-600"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs text-slate-900 truncate">{currentUser.nama}</h4>
                <p className="text-[11px] text-emerald-800 font-semibold">{currentUser.peranLabel}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
              {currentUser.keterangan}
            </div>
          </div>

          {/* Kotak Masuk (Pending Documents & Actions) */}
          <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-emerald-700" />
                <span>Kotak Masuk Persetujuan</span>
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                {
                  kotakMasuk.filter(
                    (k) => k.status === 'Menunggu' && k.modul !== 'Sidang Kenaikan'
                  ).length
                }
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {kotakMasuk
                .filter((item) => item.modul !== 'Sidang Kenaikan')
                .map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate(item.linkTab)}
                  className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-emerald-50/50 hover:border-emerald-300 transition cursor-pointer text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white text-emerald-900 border border-slate-200">
                      {item.modul}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.waktu}</span>
                  </div>
                  <p className="font-bold text-xs text-slate-800 mt-1.5">{item.judul}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{item.keterangan}</p>
                  <div className="mt-2 text-[10px] font-semibold text-emerald-800 flex items-center gap-1">
                    <span>Tinjau berkas</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kalender Kegiatan Pondok (PHBI, PHBN, Imtihan) */}
          <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-3.5 h-3.5 text-emerald-700" />
                <span>Agenda Kegiatan Terdekat</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-medium">1448 H / 2026 M</span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              {[
                {
                  acara: 'Imtihan Semester Gasal 2026/2027',
                  tanggal: 'Malam 6 - 9 Des 2026',
                  hijriah: 'Jumadil Akhir 1448 H',
                  kategori: 'Imtihan',
                  badge: 'bg-emerald-100 text-emerald-800',
                },
                {
                  acara: 'Koreksi Lembar Jawaban & Rekap Nilai',
                  tanggal: '10 - 13 Des 2026',
                  hijriah: 'Jumadil Akhir 1448 H',
                  kategori: 'Akademik',
                  badge: 'bg-blue-100 text-blue-800',
                },
                {
                  acara: 'Pembagian Raport Santri & Libur Semester',
                  tanggal: '15 Des 2026',
                  hijriah: 'Jumadil Akhir 1448 H',
                  kategori: 'Diniyah',
                  badge: 'bg-amber-100 text-amber-800',
                },
                {
                  acara: 'Peringatan Isra Mi\'raj Nabi Muhammad SAW',
                  tanggal: '27 Rajab 1448 H',
                  hijriah: 'Januari 2027',
                  kategori: 'PHBI',
                  badge: 'bg-purple-100 text-purple-800',
                },
              ].map((ag, i) => (
                <div key={i} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${ag.badge}`}>
                      {ag.kategori}
                    </span>
                    <span className="text-[10px] text-slate-400">{ag.hijriah}</span>
                  </div>
                  <p className="font-bold text-xs text-slate-900 mt-1">{ag.acara}</p>
                  <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">{ag.tanggal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
