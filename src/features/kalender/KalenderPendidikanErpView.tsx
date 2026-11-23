import React, { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useAppStore } from '../../lib/store.ts';
import { useAuth, canAccessErpTab } from '../../lib/auth.ts';

interface KalenderPendidikanErpViewProps {
  onNavigateErp?: (tab: string) => void;
}

type KalenderFilterId = 'semua' | 'libur' | 'kegiatan' | 'izin';

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

const LIBUR_CODES = new Set(['LP', 'LM', 'L IMT', 'LHR', 'HR', 'MLD', 'HUT', 'LHS', 'LD']);

export const KalenderPendidikanErpView: React.FC<KalenderPendidikanErpViewProps> = ({
  onNavigateErp,
}) => {
  const { currentUser, ustadzList, izinBadalGuruList, kalenderPendidikan } = useAppStore();
  const { effectiveRole, can } = useAuth();

  const now = new Date();
  const [calMonth, setCalMonth] = useState<number>(now.getMonth());
  const [calYear, setCalYear] = useState<number>(now.getFullYear());
  const [calFilter, setCalFilter] = useState<KalenderFilterId>('semua');
  const [selectedCalDay, setSelectedCalDay] = useState<number>(now.getDate());

  const isStaff = effectiveRole !== 'wali_santri';

  const matchedUstadz = useMemo(() => {
    if (currentUser.ustadzId) {
      const byId = ustadzList.find((u) => u.id === currentUser.ustadzId);
      if (byId) return byId;
    }
    const cleanCurr = currentUser.nama.replace(/^(KH\.|Ust\.|Usth\.|Ustzh\.)\s*/i, '').toLowerCase();
    return ustadzList.find((u) => u.nama.toLowerCase().includes(cleanCurr));
  }, [currentUser, ustadzList]);

  const activeUstadzId = matchedUstadz?.id || currentUser.ustadzId || '';

  const legendMap = useMemo(() => {
    const m: Record<string, { label: string; bgColor: string; textColor: string }> = {};
    kalenderPendidikan.legend.forEach((l) => {
      m[l.code] = { label: l.label, bgColor: l.bgColor, textColor: l.textColor };
    });
    return m;
  }, [kalenderPendidikan.legend]);

  const activeKalenderRow = useMemo(() => {
    const targetName = `${BULAN_NAMES_ID[calMonth]} ${calYear}`.toLowerCase();
    return kalenderPendidikan.rows.find((r) => r.bulan.toLowerCase() === targetName);
  }, [kalenderPendidikan.rows, calMonth, calYear]);

  const myIzinDatesInCalMonth = useMemo(() => {
    const prefix = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-`;
    const map: Record<number, { jenis: string; status: string; alasan: string }> = {};
    izinBadalGuruList
      .filter((r) => r.ustadzId === activeUstadzId && r.tanggal.startsWith(prefix))
      .forEach((r) => {
        const d = parseInt(r.tanggal.slice(8, 10), 10);
        if (d > 0) map[d] = { jenis: r.jenis, status: r.status, alasan: r.alasan };
      });
    return map;
  }, [izinBadalGuruList, activeUstadzId, calMonth, calYear]);

  const calendarDaysGrid = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1);
    const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0
    const cells: Array<{ day: number | null; code?: string }> = [];
    for (let i = 0; i < startOffset; i++) cells.push({ day: null });
    for (let d = 1; d <= totalDays; d++) {
      const jsDate = new Date(calYear, calMonth, d);
      const rowCode = activeKalenderRow?.days[d];
      const code = rowCode || (jsDate.getDay() === 5 ? 'LM' : undefined);
      cells.push({ day: d, code });
    }
    return cells;
  }, [calYear, calMonth, activeKalenderRow]);

  const monthEventsList = useMemo(() => {
    const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
    const list: Array<{ day: number; code: string; label: string; bgColor: string; isLibur: boolean }> = [];
    for (let d = 1; d <= totalDays; d++) {
      const rowCode = activeKalenderRow?.days[d];
      const izin = myIzinDatesInCalMonth[d];
      if (rowCode) {
        const isLib = LIBUR_CODES.has(rowCode);
        if (
          calFilter === 'semua' ||
          (calFilter === 'libur' && isLib) ||
          (calFilter === 'kegiatan' && !isLib)
        ) {
          const leg = legendMap[rowCode];
          list.push({
            day: d,
            code: rowCode,
            label: leg?.label || (rowCode === 'LM' ? "Libur Jum'at Madrasah" : rowCode),
            bgColor: leg?.bgColor || (isLib ? '#E11D48' : '#059669'),
            isLibur: isLib,
          });
        }
      }
      if (izin && (calFilter === 'izin' || calFilter === 'semua')) {
        list.push({
          day: d,
          code: izin.jenis.toUpperCase(),
          label: `${izin.jenis} (${izin.status}) — ${izin.alasan}`,
          bgColor: '#047857',
          isLibur: false,
        });
      }
    }
    return list;
  }, [calYear, calMonth, activeKalenderRow, calFilter, legendMap, myIzinDatesInCalMonth]);

  const selectedDayInfo = useMemo(() => {
    const matched = calendarDaysGrid.find((c) => c.day === selectedCalDay);
    const code = matched?.code;
    const izin = myIzinDatesInCalMonth[selectedCalDay];
    const leg = code ? legendMap[code] : undefined;
    return {
      code,
      label: leg?.label || (code === 'LM' ? "Libur Jum'at Madrasah Diniyah" : code),
      bgColor: leg?.bgColor || (code && LIBUR_CODES.has(code) ? '#E11D48' : '#059669'),
      izin,
    };
  }, [calendarDaysGrid, selectedCalDay, legendMap, myIzinDatesInCalMonth]);

  const filterChips: Array<{ id: KalenderFilterId; label: string }> = [
    { id: 'semua', label: 'Semua' },
    { id: 'libur', label: 'Libur' },
    { id: 'kegiatan', label: 'Kegiatan & Imtihan' },
    ...(isStaff ? [{ id: 'izin' as const, label: 'Izin / Badal Saya' }] : []),
  ];

  return (
    <div className="space-y-5">
      {/* Header Card */}
      <div className="rounded-3xl bg-[#07432A] bg-linear-to-r from-emerald-950 via-emerald-900 to-teal-900 text-white p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Kalender Resmi PP NU Darussalam · {kalenderPendidikan.tahunAjaran}</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight">
            Kalender Pendidikan Pondok Pesantren
          </h1>
          <p className="text-xs text-emerald-100 leading-relaxed max-w-2xl">
            Jadwal libur madrasah, kegiatan imtihan, hari aktif belajar, serta agenda resmi pesantren.
          </p>
        </div>

        {canAccessErpTab('maarifan', effectiveRole, can) && onNavigateErp && (
          <button
            type="button"
            onClick={() => onNavigateErp('maarifan')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold transition shrink-0 self-start sm:self-center"
          >
            <span>Buka Modul Ma&apos;arifan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {filterChips.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setCalFilter(f.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap min-h-[40px] ${
              calFilter === f.id
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Grid Card */}
        <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (calMonth === 0) {
                  setCalMonth(11);
                  setCalYear((y) => y - 1);
                } else setCalMonth((m) => m - 1);
              }}
              className="w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50"
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-center">
              <h2 className="font-extrabold text-sm sm:text-base text-slate-900">
                {BULAN_NAMES_ID[calMonth]} {calYear}
              </h2>
              <p className="text-[11px] text-slate-500">{kalenderPendidikan.tahunAjaran}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (calMonth === 11) {
                  setCalMonth(0);
                  setCalYear((y) => y + 1);
                } else setCalMonth((m) => m + 1);
              }}
              className="w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50"
              aria-label="Bulan berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-500">
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span className="text-rose-700">Jum</span>
            <span>Sab</span>
            <span className="text-slate-700">Min</span>
          </div>

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
                    isSelected
                      ? 'border-2 border-emerald-700 bg-emerald-50 text-emerald-950'
                      : isToday
                      ? 'border border-emerald-400 bg-emerald-50/40 text-emerald-900'
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
              Libur Madrasah (Jum&apos;at) / Pondok
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Agenda Pondok {isStaff ? '/ Izin Saya' : ''}
            </span>
          </div>

          {/* Selected Day Snapshot */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <p className="text-[11px] text-slate-500">Tanggal Dipilih</p>
              <p className="font-extrabold text-slate-900 tabular-nums">
                {selectedCalDay} {BULAN_NAMES_ID[calMonth]} {calYear}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {selectedDayInfo.code ? (
                <span
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white"
                  style={{ backgroundColor: selectedDayInfo.bgColor }}
                >
                  {selectedDayInfo.code} · {selectedDayInfo.label}
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-[11px] font-bold">
                  Hari Aktif KBM Madrasah
                </span>
              )}
              {selectedDayInfo.izin && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-[11px] font-bold">
                  {selectedDayInfo.izin.jenis} ({selectedDayInfo.izin.status})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Agenda Bulan List + Legend */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900">
              Agenda Bulan {BULAN_NAMES_ID[calMonth]} {calYear}
            </h3>
            {monthEventsList.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                Tidak ada agenda atau hari libur sesuai filter pada bulan ini.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
                {monthEventsList.map((ev, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedCalDay(ev.day)}
                    className={`w-full text-left py-2.5 flex items-center justify-between gap-3 rounded-xl px-2 transition ${
                      selectedCalDay === ev.day ? 'bg-emerald-50/70' : 'hover:bg-slate-50'
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
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs space-y-2.5">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Keterangan Kode Kalender Pondok
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
              {kalenderPendidikan.legend.map((l) => (
                <div key={l.code} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50">
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: l.bgColor, color: l.textColor }}
                  >
                    {l.code}
                  </span>
                  <span className="text-slate-700 truncate">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
