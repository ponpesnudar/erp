import React, { useState, useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  FileWarning,
  Search,
  Printer,
  Camera,
  MapPin,
  ShieldCheck,
  X,
  Check,
  Calendar as CalendarIcon,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { useAppStore } from '../../lib/store.ts';
import {
  formatNamaWithGelar,
  type ProgramAbsensiType,
  type AbsensiGuruRecord,
} from '../../data/seed/pondokData.ts';
import { PrintOrientationControl } from '../../components/common/PrintOrientationControl.tsx';

export const SdmMonitoringDashboard: React.FC = () => {
  const {
    currentUser,
    ustadzList,
    ustadzPayroll,
    absensiGuruList,
    izinBadalGuruList,
    kalenderPendidikan,
    approveIzinBadalGuru,
    verifyAbsensiGuruRecord,
  } = useAppStore();

  const pad = (n: number) => String(n).padStart(2, '0');
  const now = new Date();
  const todayIso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  // Default to today if there are records today, otherwise latest seeded/logged date
  const defaultDate = useMemo(() => {
    const hasToday = absensiGuruList.some((r) => r.tanggal === todayIso);
    if (hasToday) return todayIso;
    const latest = [...absensiGuruList].sort((a, b) => b.tanggal.localeCompare(a.tanggal))[0]?.tanggal;
    return latest || todayIso;
  }, [absensiGuruList, todayIso]);

  const [tanggalFilter, setTanggalFilter] = useState<string>(defaultDate);
  const [programFilter, setProgramFilter] = useState<'Semua' | ProgramAbsensiType>('Semua');
  const [genderFilter, setGenderFilter] = useState<'Semua' | 'L' | 'P'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [rekapBulan, setRekapBulan] = useState<string>('2026-11');
  const [previewRecord, setPreviewRecord] = useState<AbsensiGuruRecord | null>(null);
  const [toast, setToast] = useState('');

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const reviewerDisplayName = formatNamaWithGelar(currentUser.nama);

  // Filtered teachers
  const filteredUstadz = useMemo(() => {
    return ustadzList.filter((u) => {
      if (genderFilter !== 'Semua' && u.gender !== genderFilter) return false;
      const fullName = formatNamaWithGelar(u.nama, u.gender).toLowerCase();
      if (
        searchQuery.trim() &&
        !fullName.includes(searchQuery.toLowerCase()) &&
        !u.jabatanUtama.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [ustadzList, genderFilter, searchQuery]);

  // Records matching selected date + program
  const dateRecords = useMemo(() => {
    return absensiGuruList.filter((r) => {
      if (tanggalFilter && r.tanggal !== tanggalFilter) return false;
      if (programFilter !== 'Semua' && r.program !== programFilter) return false;
      return true;
    });
  }, [absensiGuruList, tanggalFilter, programFilter]);

  // Match teacher -> latest attendance record on selected date
  const monitoringRows = useMemo(() => {
    return filteredUstadz.map((u) => {
      const cleanName = u.nama.replace(/^(KH\.|Ust\.|Usth\.|Ustzh\.|Ustadz|Ustadzah)\s+/i, '').toLowerCase();
      const rec = dateRecords.find((r) => {
        if (r.ustadzId === u.id) return true;
        const rClean = r.ustadzNama.replace(/^(KH\.|Ust\.|Usth\.|Ustzh\.|Ustadz|Ustadzah)\s+/i, '').toLowerCase();
        return rClean === cleanName;
      });
      return { ustadz: u, record: rec };
    });
  }, [filteredUstadz, dateRecords]);

  // KPI Metrics
  const totalGuru = filteredUstadz.length;
  const hadirCount = monitoringRows.filter((x) => x.record?.status === 'Hadir').length;
  const terlambatAtauIzinCount = monitoringRows.filter(
    (x) =>
      (x.record?.status === 'Hadir' && x.record?.statusKeterlambatan === 'Terlambat') ||
      x.record?.status === 'Izin' ||
      x.record?.status === 'Sakit' ||
      x.record?.status === 'Badal'
  ).length;
  const pendingIzinList = useMemo(
    () => izinBadalGuruList.filter((i) => i.status === 'Menunggu'),
    [izinBadalGuruList]
  );

  // Chart Data: Recap by Program across selected month or all records
  const chartProgramData = useMemo(() => {
    const programs: ProgramAbsensiType[] = [
      "Ngaji Al-Qur'an Pagi (Ba'da Subuh)",
      'Ngaji Takhasus',
      'Madrasah Diniyah',
    ];
    return programs.map((prog) => {
      const recs = absensiGuruList.filter(
        (r) => (r.program || 'Madrasah Diniyah') === prog && r.tanggal.startsWith(rekapBulan)
      );
      return {
        program:
          prog === "Ngaji Al-Qur'an Pagi (Ba'da Subuh)"
            ? "Ngaji Al-Qur'an"
            : prog === 'Ngaji Takhasus'
            ? 'Takhasus'
            : 'Madrasah Diniyah',
        Hadir: recs.filter((r) => r.status === 'Hadir' && r.statusKeterlambatan !== 'Terlambat').length,
        Terlambat: recs.filter((r) => r.status === 'Hadir' && r.statusKeterlambatan === 'Terlambat').length,
        'Izin / Badal': recs.filter((r) => r.status !== 'Hadir').length,
      };
    });
  }, [absensiGuruList, rekapBulan]);

  // Monthly discipline recap joined with payroll JTM
  const monthlyRecapRows = useMemo(() => {
    const activeWorkingDaysEstimate = 22;
    return filteredUstadz.map((u) => {
      const cleanName = u.nama.replace(/^(KH\.|Ust\.|Usth\.|Ustzh\.|Ustadz|Ustadzah)\s+/i, '').toLowerCase();
      const recs = absensiGuruList.filter((r) => {
        if (!r.tanggal.startsWith(rekapBulan)) return false;
        if (r.ustadzId === u.id) return true;
        const rClean = r.ustadzNama.replace(/^(KH\.|Ust\.|Usth\.|Ustzh\.|Ustadz|Ustadzah)\s+/i, '').toLowerCase();
        return rClean === cleanName;
      });
      const payroll = ustadzPayroll.find((p) => p.ustadzId === u.id);
      const hadir = recs.filter((r) => r.status === 'Hadir').length;
      const terlambat = recs.filter((r) => r.status === 'Hadir' && r.statusKeterlambatan === 'Terlambat').length;
      const izinBadal = recs.filter((r) => r.status !== 'Hadir').length;
      const persentase =
        recs.length > 0
          ? Math.min(100, Math.round(((hadir + izinBadal) / Math.max(recs.length, 1)) * 100))
          : payroll
          ? Math.min(100, Math.round((payroll.jumlahHadir / activeWorkingDaysEstimate) * 100))
          : 0;

      return {
        ustadz: u,
        displayName: formatNamaWithGelar(u.nama, u.gender),
        jtm: payroll?.jtmDiniyah ?? 6,
        hadirLog: hadir,
        hadirPayroll: payroll?.jumlahHadir ?? 0,
        terlambat,
        izinBadal,
        persentase,
      };
    });
  }, [filteredUstadz, absensiGuruList, ustadzPayroll, rekapBulan]);

  // Check Pondok calendar status for selected date
  const kalenderInfoForDate = useMemo(() => {
    if (!tanggalFilter) return null;
    const [y, m, d] = tanggalFilter.split('-').map(Number);
    if (!y || !m || !d) return null;
    const bulanNames = [
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
    const row = kalenderPendidikan.rows.find(
      (r) => r.bulan.toLowerCase() === `${bulanNames[m - 1]} ${y}`.toLowerCase()
    );
    const dt = new Date(y, m - 1, d);
    const isFriday = dt.getDay() === 5;
    const code = row?.days[d] || (isFriday ? 'LM' : undefined);
    if (!code) return { status: 'Hari Aktif Mengajar Pondok', isLibur: false };
    const leg = kalenderPendidikan.legend.find((l) => l.code === code);
    const isLib = ['LP', 'LM', 'L IMT', 'LHR', 'HR', 'MLD', 'HUT', 'LHS', 'LD'].includes(code);
    return { status: `${leg?.label || code} (${code})`, isLibur: isLib };
  }, [tanggalFilter, kalenderPendidikan]);

  return (
    <div className="space-y-6">
      {toast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Filter & Action Toolbar */}
      <div className="rounded-3xl bg-white border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Dashboard Monitoring Guru &amp; SDM Pondok
            </h2>
            <p className="text-xs text-slate-500">
              Pemantauan kehadiran real-time Dewan Asatidz (Swafoto GPS), verifikasi izin/badal, &amp; sinkronisasi Kalender Pendidikan Pondok
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PrintOrientationControl recommended="landscape" />
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rekap SDM (F4)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block font-bold text-slate-600 mb-1">Tanggal Monitoring</label>
            <input
              type="date"
              value={tanggalFilter}
              onChange={(e) => setTanggalFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-800"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">Program Pendidikan</label>
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value as 'Semua' | ProgramAbsensiType)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-800"
            >
              <option value="Semua">Semua Program</option>
              <option value="Madrasah Diniyah">Madrasah Diniyah</option>
              <option value="Ngaji Al-Qur'an Pagi (Ba'da Subuh)">Ngaji Al-Qur'an Pagi (Ba'da Subuh)</option>
              <option value="Ngaji Takhasus">Ngaji Takhasus</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">Unit Komplek Guru</label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as 'Semua' | 'L' | 'P')}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-800"
            >
              <option value="Semua">Semua Asatidz (Putra &amp; Putri)</option>
              <option value="L">Asatidz Putra</option>
              <option value="P">Ustadzah Putri</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-600 mb-1">Cari Ustadz / Jabatan</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nama ustadz atau mapel..."
                className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-2"
              />
            </div>
          </div>
        </div>

        {kalenderInfoForDate && (
          <div
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 ${
              kalenderInfoForDate.isLibur
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
              Status Kalender Pendidikan Pondok ({tanggalFilter}): <strong>{kalenderInfoForDate.status}</strong>
            </span>
            <button
              type="button"
              onClick={() => setTanggalFilter(todayIso)}
              className="text-[11px] underline font-bold shrink-0"
            >
              Loncat ke Hari Ini ({todayIso})
            </button>
          </div>
        )}
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500">Total Dewan Asatidz</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">{totalGuru}</p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
              Putra &amp; Putri Aktif
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500">Hadir / Cek In ({tanggalFilter})</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1 tabular-nums">{hadirCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
              {totalGuru > 0 ? Math.round((hadirCount / totalGuru) * 100) : 0}% terdata hadir
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500">Terlambat / Izin / Badal</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1 tabular-nums">
              {terlambatAtauIzinCount}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Memerlukan pantauan tugas</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500">Menunggu Persetujuan</p>
            <p className="text-2xl font-extrabold text-rose-600 mt-1 tabular-nums">
              {pendingIzinList.length}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Pengajuan Izin &amp; Badal</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <FileWarning className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Middle Section: Recharts + Pending Izin/Badal Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 no-print">
        {/* Recharts BarChart */}
        <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>Statistik Kehadiran Guru per Program Pondok</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Akumulasi presensi mobile &amp; manual bulan {rekapBulan}
              </p>
            </div>
            <input
              type="month"
              value={rekapBulan}
              onChange={(e) => setRekapBulan(e.target.value)}
              className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800"
            />
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartProgramData}>
                <XAxis dataKey="program" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Hadir" fill="#047857" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Terlambat" fill="#D97706" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Izin / Badal" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Izin / Badal Approvals */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-extrabold text-slate-900">
              Persetujuan Izin &amp; Badal Guru
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
              {izinBadalGuruList.length} Total
            </span>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {izinBadalGuruList.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900">
                    {formatNamaWithGelar(item.ustadzNama)} · {item.jenis}
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
                <p className="text-[11px] text-slate-600 tabular-nums">
                  Tanggal: <strong>{item.tanggal}</strong> · {item.program}
                  {item.guruBadalNama ? ` · Badal: ${formatNamaWithGelar(item.guruBadalNama)}` : ''}
                </p>
                <p className="text-[11px] text-slate-700">{item.alasan}</p>
                {item.status === 'Menunggu' && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        approveIzinBadalGuru(item.id, 'Disetujui', reviewerDisplayName);
                        notify(`Pengajuan ${item.jenis} ${item.ustadzNama} disetujui.`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] inline-flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Setujui</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        approveIzinBadalGuru(item.id, 'Ditolak', reviewerDisplayName);
                        notify(`Pengajuan ${item.jenis} ${item.ustadzNama} ditolak.`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-[11px] inline-flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      <span>Tolak</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRINTABLE AREA: Real-Time Monitoring Table + Monthly Recap */}
      <div className="printable-area space-y-6">
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
                Majlis Ma&apos;arif Madrasah Diniyah Salafiyah &amp; Sekretariat Pondok
              </p>
              <h1 className="text-base font-extrabold text-slate-900">
                PONDOK PESANTREN NU DARUSSALAM KARANGDADAP
              </h1>
              <p className="text-[11px] text-slate-600">
                Karangdadap, Kabupaten Pekalongan, Jawa Tengah · Laporan Monitoring SDM &amp; Presensi Dewan Asatidz
              </p>
            </div>
          </div>
          <div className="text-right text-[11px] tabular-nums">
            <p className="font-bold">Tanggal Monitoring: {tanggalFilter}</p>
            <p>Rekap Periode: {rekapBulan}</p>
          </div>
        </div>

        {/* Real-Time Daily Teacher Monitoring Table */}
        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Monitoring Kehadiran Real-Time Dewan Asatidz ({tanggalFilter})
              </h3>
              <p className="text-[11px] text-slate-500">
                Menampilkan gelar Ustadz / Ustadzah, jabatan pondok, waktu cek in/out, durasi tugas, serta bukti swafoto &amp; GPS
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full tabular-nums">
              {hadirCount} / {totalGuru} Guru Hadir
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] text-slate-500 uppercase bg-slate-50">
                  <th className="py-2.5 px-3 font-bold">Nama Ustadz / Ustadzah</th>
                  <th className="py-2.5 px-3 font-bold">Jabatan &amp; Unit Pondok</th>
                  <th className="py-2.5 px-3 font-bold">Status</th>
                  <th className="py-2.5 px-3 font-bold">Masuk – Pulang</th>
                  <th className="py-2.5 px-3 font-bold">Durasi</th>
                  <th className="py-2.5 px-3 font-bold">Lokasi GPS</th>
                  <th className="py-2.5 px-3 font-bold no-print">Swafoto &amp; Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monitoringRows.map(({ ustadz, record }) => {
                  const namaGelar = formatNamaWithGelar(ustadz.nama, ustadz.gender);
                  return (
                    <tr key={ustadz.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-slate-900">{namaGelar}</p>
                        <p className="text-[10px] text-slate-500 tabular-nums">NIP {ustadz.nip}</p>
                      </td>
                      <td className="py-2.5 px-3">
                        <p className="font-semibold text-slate-800">{ustadz.jabatanUtama}</p>
                        <p className="text-[10px] text-slate-500">
                          {record?.program || (ustadz.gender === 'P' ? 'Madrasah Diniyah Putri' : 'Madrasah Diniyah Putra')}
                        </p>
                      </td>
                      <td className="py-2.5 px-3">
                        {!record ? (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                            Belum Cek In
                          </span>
                        ) : record.status === 'Hadir' && record.statusKeterlambatan === 'Terlambat' ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                            Terlambat ({record.menitTerlambat}m)
                          </span>
                        ) : record.status === 'Hadir' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {record.waktuCekOut ? 'Tugas Selesai' : 'Sedang Bertugas'}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                            {record.status}
                            {record.pengganti ? ` (${formatNamaWithGelar(record.pengganti)})` : ''}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums font-semibold text-slate-800">
                        {record ? `${record.waktuInput} – ${record.waktuCekOut || '...'}` : '—'}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums text-slate-700">
                        {record?.durasiKerja || '—'}
                      </td>
                      <td className="py-2.5 px-3">
                        {record?.koordinat ? (
                          <div className="flex items-start gap-1 text-[10px] text-slate-600">
                            <MapPin className="w-3 h-3 text-emerald-700 shrink-0 mt-0.5" />
                            <div>
                              <p className="tabular-nums font-semibold">{record.koordinat}</p>
                              <p className="text-slate-400">
                                {record.akurasiGps ? `±${record.akurasiGps}m` : 'Terdeteksi'} · {record.lokasiLabel || 'Pondok'}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 no-print">
                        {record ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewRecord(record)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1 transition"
                            >
                              <Camera className="w-3 h-3" />
                              <span>{record.fotoSelfieUrl ? 'Lihat Foto' : 'Detail GPS'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const next =
                                  record.verifikasiAtasan === 'Terverifikasi'
                                    ? 'Menunggu'
                                    : 'Terverifikasi';
                                verifyAbsensiGuruRecord(record.id, next);
                                notify(`Status verifikasi ${namaGelar}: ${next}.`);
                              }}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition ${
                                record.verifikasiAtasan === 'Terverifikasi'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              <ShieldCheck className="w-3 h-3" />
                              <span>{record.verifikasiAtasan || 'Menunggu'}</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400">Belum ada log</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rekap Bulanan Disiplin & Bisyaroh SDM */}
        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Rekap Disiplin Bulanan &amp; Beban JTM Dewan Asatidz ({rekapBulan})
              </h3>
              <p className="text-[11px] text-slate-500">
                Terintegrasi dengan data JTM mengajar Diniyah &amp; perhitungan kehadiran Bisyaroh
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] text-slate-500 uppercase bg-slate-50">
                  <th className="py-2 px-3 font-bold">Nama Ustadz / Ustadzah</th>
                  <th className="py-2 px-3 font-bold">JTM/Minggu</th>
                  <th className="py-2 px-3 font-bold">Hadir Mobile</th>
                  <th className="py-2 px-3 font-bold">Hadir Bisyaroh</th>
                  <th className="py-2 px-3 font-bold">Terlambat</th>
                  <th className="py-2 px-3 font-bold">Izin / Badal</th>
                  <th className="py-2 px-3 font-bold">Tingkat Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 tabular-nums">
                {monthlyRecapRows.map((row) => (
                  <tr key={row.ustadz.id}>
                    <td className="py-2 px-3 font-bold text-slate-900">{row.displayName}</td>
                    <td className="py-2 px-3">{row.jtm} JTM</td>
                    <td className="py-2 px-3 font-semibold text-emerald-700">{row.hadirLog} log</td>
                    <td className="py-2 px-3">{row.hadirPayroll} hari</td>
                    <td className="py-2 px-3 text-amber-700">{row.terlambat}x</td>
                    <td className="py-2 px-3 text-sky-700">{row.izinBadal}x</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                        {row.persentase}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lightbox Swafoto & GPS Verification Modal */}
      {previewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 no-print">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  {formatNamaWithGelar(previewRecord.ustadzNama)}
                </h4>
                <p className="text-[11px] text-slate-500 tabular-nums">
                  {previewRecord.waktuTimestamp || `${previewRecord.tanggal} ${previewRecord.waktuInput} WIB`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewRecord(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {previewRecord.fotoSelfieUrl ? (
              <img
                src={previewRecord.fotoSelfieUrl}
                alt={previewRecord.ustadzNama}
                className="w-full rounded-2xl border border-slate-200 object-cover"
              />
            ) : (
              <div className="rounded-2xl bg-emerald-950 text-white p-6 text-center space-y-2">
                <MapPin className="w-8 h-8 text-emerald-300 mx-auto" />
                <p className="text-xs font-bold">Log GPS Terverifikasi Sistem Pondok</p>
                <p className="text-[11px] text-emerald-200 tabular-nums">
                  Koordinat: {previewRecord.koordinat || '-6.9765, 109.6832'} (±{previewRecord.akurasiGps || 20}m)
                </p>
                <p className="text-[11px] text-emerald-300">{previewRecord.lokasiLabel}</p>
              </div>
            )}

            <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <p className="flex justify-between">
                <span className="text-slate-500">Program:</span>
                <strong>{previewRecord.program || 'Madrasah Diniyah'}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Lokasi:</span>
                <strong>{previewRecord.lokasiLabel || 'PP NU Darussalam'}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Status Verifikasi:</span>
                <strong className="text-emerald-700">{previewRecord.verifikasiAtasan || 'Terverifikasi'}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
