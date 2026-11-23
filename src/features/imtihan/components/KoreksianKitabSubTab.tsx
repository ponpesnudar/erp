import React, { useMemo, useRef, useState } from 'react';
import {
  BookCheck,
  Check,
  CheckCircle2,
  Printer,
  Search,
  AlertCircle,
  CheckCheck,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
} from 'lucide-react';
import { useAppStore } from '../../../lib/store.ts';
import { useAuth } from '../../../lib/auth.ts';
import { DAFTAR_KELAS_DINIYAH, MAPEL_PER_TINGKAT } from '../../../data/seed/pondokData.ts';
import { triggerReliablePrint } from '../../../lib/printHelper.ts';
import { PrintOrientationControl } from '../../../components/common/PrintOrientationControl.tsx';

export const KoreksianKitabSubTab: React.FC = () => {
  const {
    currentUser,
    santriList,
    koreksianKitabList,
    imtihanMaster,
    printOrientation,
    toggleKoreksianKitab,
    bulkSetKoreksianKitab,
    updateKoreksianKitabCatatan,
    togglePesertaSusulan,
    setPesertaSusulanBatch,
    generateExamSeating,
  } = useAppStore();

  const { effectiveRole, can } = useAuth();
  const isReadOnly = effectiveRole === 'wali_santri' || !can('imtihan_nilai_raport', 'tulis');

  const uniqueClasses = useMemo(() => {
    const orderMap = new Map<string, number>(DAFTAR_KELAS_DINIYAH.map((c, i) => [c, i]));
    return Array.from(new Set(santriList.map((s) => s.kelas))).sort((a, b) => {
      const ia = orderMap.get(a) ?? 999;
      const ib = orderMap.get(b) ?? 999;
      return ia !== ib ? ia - ib : a.localeCompare(b);
    });
  }, [santriList]);

  const [selectedKelas, setSelectedKelas] = useState<string>(uniqueClasses[0] || '2 A PUTRA');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'semua' | 'lengkap' | 'belum'>('semua');
  const [verifikator, setVerifikator] = useState<string>(currentUser.nama || 'Ust. Abdurrohman');
  const [editingNoteTarget, setEditingNoteTarget] = useState<{
    santriId: string;
    santriNama: string;
    kitabKode: string;
    mapelNama: string;
    kitabNama: string;
    value: string;
  } | null>(null);
  const [toast, setToast] = useState('');
  const printRef = useRef<HTMLDivElement | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const currentTingkat = parseInt(selectedKelas.charAt(0)) || 1;
  const requiredKitabs = useMemo(
    () =>
      (MAPEL_PER_TINGKAT[currentTingkat] || MAPEL_PER_TINGKAT[1]).map((m) => ({
        kode: m.kodePrefix,
        mapelNama: m.nama.split(' (')[0],
        kitabNama: m.kitab,
      })),
    [currentTingkat]
  );

  const recordMap = useMemo(() => {
    const map = new Map<string, (typeof koreksianKitabList)[0]>();
    koreksianKitabList.forEach((rec) => map.set(rec.id, rec));
    return map;
  }, [koreksianKitabList]);

  const kelasSantri = useMemo(
    () => santriList.filter((s) => s.kelas === selectedKelas),
    [santriList, selectedKelas]
  );

  const susulanSet = useMemo(
    () => new Set(imtihanMaster.pesertaSusulanIds || []),
    [imtihanMaster.pesertaSusulanIds]
  );

  const evaluatedRows = useMemo(() => {
    return kelasSantri.map((s) => {
      const statuses = requiredKitabs.map((k) => {
        const rec = recordMap.get(`${s.id}__${k.kode}`);
        return {
          kitab: k,
          sudahLengkap: Boolean(rec?.sudahLengkap),
          rec,
        };
      });
      const verifiedCount = statuses.filter((st) => st.sudahLengkap).length;
      const isAllVerified = requiredKitabs.length > 0 && verifiedCount === requiredKitabs.length;
      const isHeld = susulanSet.has(s.id);
      const isEligibleForExam = isAllVerified && !isHeld;
      return {
        santri: s,
        statuses,
        verifiedCount,
        totalKitab: requiredKitabs.length,
        isAllVerified,
        isHeld,
        isEligibleForExam,
      };
    });
  }, [kelasSantri, requiredKitabs, recordMap, susulanSet]);

  const displayedRows = useMemo(() => {
    return evaluatedRows.filter((row) => {
      if (
        searchQuery.trim() &&
        !row.santri.nama.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !row.santri.nis.includes(searchQuery)
      ) {
        return false;
      }
      if (statusFilter === 'lengkap') return row.isAllVerified;
      if (statusFilter === 'belum') return !row.isAllVerified;
      return true;
    });
  }, [evaluatedRows, searchQuery, statusFilter]);

  const totalLengkapCount = evaluatedRows.filter((r) => r.isAllVerified).length;
  const totalBelumCount = evaluatedRows.length - totalLengkapCount;
  const totalEligibleExamCount = evaluatedRows.filter((r) => r.isEligibleForExam).length;
  const totalHeldCount = evaluatedRows.filter((r) => r.isHeld).length;
  const unsyncedIncompleteCount = evaluatedRows.filter((r) => !r.isAllVerified && !r.isHeld).length;
  const totalChecksDone = evaluatedRows.reduce((s, r) => s + r.verifiedCount, 0);
  const totalChecksPossible = evaluatedRows.length * requiredKitabs.length;

  const handleBulkClass = (sudahLengkap: boolean) => {
    if (isReadOnly) return;
    bulkSetKoreksianKitab({
      santriIds: kelasSantri.map((s) => s.id),
      kelas: selectedKelas,
      kitabList: requiredKitabs,
      sudahLengkap,
      verifikator,
    });
    notify(
      sudahLengkap
        ? `Seluruh kitab santri kelas ${selectedKelas} ditandai lengkap & terverifikasi.`
        : `Status koreksian kitab kelas ${selectedKelas} direset.`
    );
  };

  const handleBulkRow = (santriId: string, santriNama: string, sudahLengkap: boolean) => {
    if (isReadOnly) return;
    bulkSetKoreksianKitab({
      santriIds: [santriId],
      kelas: selectedKelas,
      kitabList: requiredKitabs,
      sudahLengkap,
      verifikator,
    });
    notify(`${santriNama}: semua kitab ditandai ${sudahLengkap ? 'Lengkap (✓)' : 'Belum'}.`);
  };

  const handleSyncExamEligibility = () => {
    if (isReadOnly) return;
    const incompleteIds = evaluatedRows.filter((r) => !r.isAllVerified).map((r) => r.santri.id);
    const completeIds = evaluatedRows.filter((r) => r.isAllVerified).map((r) => r.santri.id);
    if (incompleteIds.length > 0) setPesertaSusulanBatch(incompleteIds, true);
    if (completeIds.length > 0) setPesertaSusulanBatch(completeIds, false);
    generateExamSeating();
    notify(
      `Izin ujian kelas ${selectedKelas} disinkronkan: ${completeIds.length} santri diizinkan ikut Imtihan, ${incompleteIds.length} santri ditahan hingga kitab lengkap.`
    );
  };

  const handlePrint = () => {
    triggerReliablePrint({
      title: `Rekap Koreksian Kitab Pra-Imtihan - ${selectedKelas}`,
      orientation: printOrientation,
      paperSize: 'F4',
      targetElement: printRef.current,
    });
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Control Header & Filters */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-4 no-print">
        <div className="flex flex-col gap-3.5">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <BookCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Koreksian Kitab &amp; Makna Pegon Pra-Imtihan</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isReadOnly
                ? 'Mode Lihat Saja: Menampilkan rekap status kelengkapan kitab wajib pra-imtihan santri.'
                : 'Pengecekan kelengkapan kitab wajib setiap kelas sebelum pelaksanaan Imtihan. Klik kotak kitab untuk memberi tanda centang hijau terverifikasi.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PrintOrientationControl recommended="landscape" />
            {!isReadOnly && (
              <>
                <button
                  type="button"
                  onClick={() => handleBulkClass(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Centang Lengkap 1 Kelas</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkClass(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
                <button
                  type="button"
                  onClick={handleSyncExamEligibility}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Terapkan Syarat Kitab ke Denah &amp; Kartu</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rekap Kitab (F4)</span>
            </button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Kelas Diniyah</label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
            >
              {uniqueClasses.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Filter Kelengkapan</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'semua' | 'lengkap' | 'belum')}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
            >
              <option value="semua">Semua Santri ({evaluatedRows.length})</option>
              <option value="lengkap">Sudah Lengkap 100% ({totalLengkapCount})</option>
              <option value="belum">Belum Lengkap ({totalBelumCount})</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Ustadz Korektor / Wali Kelas</label>
            {isReadOnly ? (
              <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-700">
                {verifikator}
              </div>
            ) : (
              <input
                type="text"
                value={verifikator}
                onChange={(e) => setVerifikator(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
              />
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Cari Santri</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nama atau NIS santri..."
                className="w-full rounded-xl border border-slate-300 pl-8 pr-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* 5 Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-semibold">Santri Kelas {selectedKelas}</span>
            <p className="text-lg font-black text-slate-900 tabular-nums mt-0.5">
              {evaluatedRows.length} Santri
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-emerald-800 font-semibold">Kitab Lengkap 100%</span>
            <p className="text-lg font-black text-emerald-950 tabular-nums mt-0.5">
              {totalLengkapCount} Santri
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-amber-800 font-semibold">Belum Lengkap Kitab</span>
            <p className="text-lg font-black text-amber-950 tabular-nums mt-0.5">
              {totalBelumCount} Santri
            </p>
          </div>
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200">
            <span className="text-teal-800 font-semibold">Diizinkan Ikut Ujian</span>
            <p className="text-lg font-black text-teal-950 tabular-nums mt-0.5">
              {totalEligibleExamCount} / {evaluatedRows.length} ({totalHeldCount} Ditahan)
            </p>
          </div>
          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 col-span-2 sm:col-span-1">
            <span className="text-sky-800 font-semibold">Progres Checklist</span>
            <p className="text-lg font-black text-sky-950 tabular-nums mt-0.5">
              {totalChecksDone} / {totalChecksPossible} (
              {totalChecksPossible > 0 ? Math.round((totalChecksDone / totalChecksPossible) * 100) : 0}%)
            </p>
          </div>
        </div>

        {!isReadOnly && unsyncedIncompleteCount > 0 && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Terdapat <strong>{unsyncedIncompleteCount} santri</strong> yang kitabnya belum lengkap 100% namun masih masuk jadwal denah ujian.
              </span>
            </div>
            <button
              type="button"
              onClick={handleSyncExamEligibility}
              className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] shrink-0"
            >
              Tahan yang Belum Lengkap Sekarang
            </button>
          </div>
        )}
      </div>

      {/* Printable Matrix Checklist Table */}
      <div
        ref={printRef}
        className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4 printable-area text-black"
      >
        {/* Kop Resmi */}
        <div className="flex items-center justify-between gap-4 pb-3 border-b-2 border-black">
          <img
            src="/assets/aistudio/ChatGPT_Image_Nov_6__2025__01_32_08_PM_64f70724.png"
            alt="Logo Panitia Imtihan"
            className="w-14 h-14 object-contain shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/preview__14__3b7f388f.webp';
            }}
          />
          <div className="flex-1 text-center">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
              PANITIA IMTIHAN MADRASAH DINIYAH SALAFIYAH · PP NU DARUSSALAM
            </p>
            <h3 className="text-sm sm:text-base font-black uppercase">
              BERITA ACARA &amp; KOREKSIAN KELENGKAPAN KITAB PRA-IMTIHAN — KELAS {selectedKelas}
            </h3>
            <p className="text-[11px] text-slate-600">
              Cawu {imtihanMaster.cawu} T.A. {imtihanMaster.tahunAjaran} · Korektor: {verifikator}
            </p>
          </div>
          <img
            src="/assets/aistudio/preview__14__3b7f388f.webp"
            alt="Logo Pondok"
            className="w-12 h-12 object-contain shrink-0"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px] border-collapse border border-slate-300">
            <thead>
              <tr className="bg-emerald-900 text-white font-bold text-center">
                <th className="border border-emerald-700 py-2 px-1.5 w-8">NO</th>
                <th className="border border-emerald-700 py-2 px-2 text-left min-w-[165px]">
                  NAMA SANTRI &amp; NIS
                </th>
                {requiredKitabs.map((k) => (
                  <th
                    key={k.kode}
                    className="border border-emerald-700 py-1.5 px-1.5 min-w-[78px]"
                    title={k.kitabNama}
                  >
                    <span className="block font-extrabold">{k.mapelNama}</span>
                    <span className="block text-[9px] font-normal text-emerald-200 line-clamp-1">
                      {k.kitabNama}
                    </span>
                  </th>
                ))}
                <th className="border border-emerald-700 py-2 px-2 w-24">STATUS KITAB</th>
                <th className="border border-emerald-700 py-2 px-2 w-28">IZIN UJIAN</th>
                {!isReadOnly && (
                  <th className="border border-emerald-700 py-2 px-2 w-32 no-print">AKSI CEPAT</th>
                )}
              </tr>
            </thead>
            <tbody>
              {displayedRows.map(
                ({ santri, statuses, verifiedCount, totalKitab, isAllVerified, isHeld, isEligibleForExam }, idx) => (
                <tr
                  key={santri.id}
                  className={isAllVerified ? 'bg-emerald-50/35 hover:bg-emerald-50/70' : 'hover:bg-slate-50'}
                >
                  <td className="border border-slate-300 py-2 px-1.5 text-center font-bold tabular-nums">
                    {idx + 1}
                  </td>
                  <td className="border border-slate-300 py-2 px-2">
                    <p className="font-bold text-slate-900 leading-tight">{santri.nama}</p>
                    <p className="text-[10px] text-slate-500 tabular-nums">NIS {santri.nis}</p>
                  </td>
                  {statuses.map(({ kitab, sudahLengkap, rec }) => (
                    <td
                      key={kitab.kode}
                      className="border border-slate-300 py-1.5 px-1 text-center align-middle"
                    >
                      {isReadOnly ? (
                        <div
                          title={
                            sudahLengkap
                              ? `Terverifikasi lengkap (${rec?.tanggalCek || 'Sudah dicek'})`
                              : `${kitab.kitabNama}: Belum lengkap`
                          }
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border print:border-0 print:bg-transparent ${
                            sudahLengkap
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                              : 'bg-slate-50 text-slate-400 border-slate-200'
                          }`}
                        >
                          {sudahLengkap ? (
                            <Check className="w-4 h-4 stroke-[2.8] print:text-emerald-800" />
                          ) : (
                            <span className="text-[10px] font-bold">–</span>
                          )}
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              toggleKoreksianKitab({
                                santriId: santri.id,
                                kelas: selectedKelas,
                                kitabKode: kitab.kode,
                                mapelNama: kitab.mapelNama,
                                kitabNama: kitab.kitabNama,
                                verifikator,
                              })
                            }
                            title={
                              sudahLengkap
                                ? `Terverifikasi lengkap (${rec?.tanggalCek || 'Hari ini'}). Klik untuk ubah.`
                                : `Klik untuk menandai ${kitab.kitabNama} lengkap`
                            }
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border transition print:border-0 print:bg-transparent ${
                              sudahLengkap
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                                : 'bg-slate-50 text-slate-400 border-slate-300 hover:border-emerald-500 hover:text-emerald-700'
                            }`}
                          >
                            {sudahLengkap ? (
                              <Check className="w-4 h-4 stroke-[2.8] print:text-emerald-800" />
                            ) : (
                              <span className="text-[10px] font-bold">–</span>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingNoteTarget({
                                santriId: santri.id,
                                santriNama: santri.nama,
                                kitabKode: kitab.kode,
                                mapelNama: kitab.mapelNama,
                                kitabNama: kitab.kitabNama,
                                value: rec?.catatan || '',
                              })
                            }
                            className="block mx-auto mt-0.5 text-[9px] text-slate-500 hover:text-emerald-800 underline no-print"
                          >
                            {rec?.catatan ? 'Catatan*' : 'Catat'}
                          </button>
                        </>
                      )}
                      {isReadOnly && rec?.catatan && (
                        <span
                          title={rec.catatan}
                          className="block mx-auto mt-0.5 text-[9px] text-amber-700 font-semibold no-print"
                        >
                          Catatan
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="border border-slate-300 py-1.5 px-2 text-center">
                    {isAllVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] whitespace-nowrap">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>Lengkap ({verifiedCount}/{totalKitab})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] whitespace-nowrap">
                        <AlertCircle className="w-3 h-3 text-amber-700" />
                        <span>{verifiedCount}/{totalKitab} Kitab</span>
                      </span>
                    )}
                  </td>
                  <td className="border border-slate-300 py-1.5 px-2 text-center">
                    {isHeld ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 font-bold text-[10px] whitespace-nowrap">
                        <Lock className="w-3 h-3 text-rose-700" />
                        <span>Ditahan (Susulan)</span>
                      </span>
                    ) : isEligibleForExam ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] whitespace-nowrap">
                        <ShieldCheck className="w-3 h-3 text-emerald-700" />
                        <span>Diizinkan Ujian</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] whitespace-nowrap">
                        <ShieldAlert className="w-3 h-3 text-amber-700" />
                        <span>Belum Syarat</span>
                      </span>
                    )}
                  </td>
                  {!isReadOnly && (
                    <td className="border border-slate-300 py-1.5 px-1.5 text-center no-print">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleBulkRow(santri.id, santri.nama, !isAllVerified)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition ${
                            isAllVerified
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                          }`}
                        >
                          {isAllVerified ? 'Reset' : 'Lengkap ✓'}
                        </button>
                        <button
                          type="button"
                          title={
                            isHeld
                              ? 'Izinkan mengikuti Imtihan kembali'
                              : 'Tahan dari jadwal Imtihan sementara (Susulan)'
                          }
                          onClick={() => {
                            togglePesertaSusulan(santri.id);
                            generateExamSeating();
                            notify(
                              isHeld
                                ? `${santri.nama} diizinkan kembali mengikuti ujian & denah diperbarui.`
                                : `${santri.nama} ditahan sementara (Susulan) & dikeluarkan dari denah ujian.`
                            );
                          }}
                          className={`p-1 rounded-lg border transition ${
                            isHeld
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                              : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                          }`}
                        >
                          {isHeld ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Tanda Tangan */}
        <div className="pt-4 grid grid-cols-2 gap-8 text-center text-xs">
          <div className="space-y-12">
            <p className="font-bold">Mengetahui,<br />Ketua Panitia Imtihan</p>
            <p className="font-bold underline">{imtihanMaster.ketuaImtihanNama}</p>
          </div>
          <div className="space-y-12">
            <p className="font-bold">Karangdadap, 2026<br />Korektor / Wali Kelas {selectedKelas}</p>
            <p className="font-bold underline">{verifikator}</p>
          </div>
        </div>
      </div>

      {/* Inline Catatan Modal */}
      {editingNoteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 no-print">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl space-y-3 text-xs">
            <h4 className="font-bold text-sm text-slate-900">
              Catatan Koreksian Kitab — {editingNoteTarget.santriNama}
            </h4>
            <p className="text-slate-500">
              Kitab: <strong>{editingNoteTarget.mapelNama} ({editingNoteTarget.kitabNama})</strong>
            </p>
            <textarea
              rows={3}
              value={editingNoteTarget.value}
              onChange={(e) =>
                setEditingNoteTarget({ ...editingNoteTarget, value: e.target.value })
              }
              placeholder="Contoh: Bab Shalat belum bermakna pegon / kitab tertinggal di kamar..."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-emerald-700 focus:outline-hidden"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingNoteTarget(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  updateKoreksianKitabCatatan({
                    santriId: editingNoteTarget.santriId,
                    kelas: selectedKelas,
                    kitabKode: editingNoteTarget.kitabKode,
                    mapelNama: editingNoteTarget.mapelNama,
                    kitabNama: editingNoteTarget.kitabNama,
                    catatan: editingNoteTarget.value,
                  });
                  setEditingNoteTarget(null);
                  notify('Catatan koreksian kitab tersimpan.');
                }}
                className="px-4 py-1.5 rounded-xl bg-emerald-800 text-white font-bold"
              >
                Simpan Catatan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
