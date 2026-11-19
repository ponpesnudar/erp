import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Printer,
  FileText,
  Award,
  Save,
  Users,
  Search,
} from 'lucide-react';
import { useAppStore } from '../../../lib/store.ts';
import { DAFTAR_KELAS_DINIYAH } from '../../../data/seed/pondokData.ts';
import { RaportF4Sheet, getArabicKelas } from './RaportF4Sheet.tsx';

function sortClassesCanonical(classes: string[]): string[] {
  const orderMap = new Map<string, number>(DAFTAR_KELAS_DINIYAH.map((c, i) => [c, i]));
  return [...classes].sort((a, b) => {
    const ia = orderMap.has(a) ? orderMap.get(a)! : 999;
    const ib = orderMap.has(b) ? orderMap.get(b)! : 999;
    if (ia !== ib) return ia - ib;
    return a.localeCompare(b);
  });
}

/* =========================================================================
   1. INPUT NILAI SPREADSHEET + CLASS ENTRY PROGRESS TRACKER
========================================================================= */
export const SubTabInputNilaiSpreadsheet: React.FC = () => {
  const { santriList, mapelList, nilaiList, updateNilaiSantri, currentTahunAjaran } = useAppStore();

  const uniqueClasses = useMemo(
    () => sortClassesCanonical(Array.from(new Set(santriList.map((s) => s.kelas)))),
    [santriList]
  );

  const [selectedKelas, setSelectedKelas] = useState<string>(uniqueClasses[0] || '1 A PUTRA');
  const currentTingkat = parseInt(selectedKelas.charAt(0)) || 1;
  const levelMapels = useMemo(
    () => mapelList.filter((m) => m.tingkat === currentTingkat),
    [mapelList, currentTingkat]
  );
  const [selectedMapelId, setSelectedMapelId] = useState<string>(levelMapels[0]?.id || mapelList[0]?.id || 'm-04');
  const [semester, setSemester] = useState<'1' | '2'>('1');
  const [waliKelas, setWaliKelas] = useState<string>('Ust. Abdur Rahman');
  const [toast, setToast] = useState<string>('');

  // Draft map by santriId for instant spreadsheet editing
  const [draftEdits, setDraftEdits] = useState<
    Record<
      string,
      {
        ujian: number;
        harian: number;
        lisan: number;
        sakit: number;
        izin: number;
        alpa: number;
        akhlaq: number;
        istiqomah: number;
        ubudiyah: number;
        catatan: string;
      }
    >
  >({});

  const kelasSantri = santriList.filter((s) => s.kelas === selectedKelas);

  const getRowValues = (santriId: string) => {
    if (draftEdits[santriId]) return draftEdits[santriId];
    const existing = nilaiList.find((n) => n.santriId === santriId && n.mapelId === selectedMapelId);
    const anyRec = existing || nilaiList.find((n) => n.santriId === santriId);
    return {
      ujian: existing?.nilaiAngka ?? 85,
      harian: existing?.nilaiHarian ?? 82,
      lisan: existing?.nilaiLisan ?? 84,
      sakit: anyRec?.sakit ?? 0,
      izin: anyRec?.izin ?? 1,
      alpa: anyRec?.alpa ?? 0,
      akhlaq: anyRec?.nilaiAkhlaq ?? 88,
      istiqomah: anyRec?.nilaiIstiqomah ?? 86,
      ubudiyah: anyRec?.nilaiUbudiyah ?? 90,
      catatan: anyRec?.catatanWaliKelas ?? 'Pertahankan semangat mengaji dan muthalaah kitab.',
    };
  };

  const handleCellChange = (
    santriId: string,
    field: keyof ReturnType<typeof getRowValues>,
    val: string | number
  ) => {
    const cur = getRowValues(santriId);
    setDraftEdits((prev) => ({
      ...prev,
      [santriId]: { ...cur, [field]: val },
    }));
  };

  const handleSaveRow = (santri: (typeof santriList)[0]) => {
    const vals = getRowValues(santri.id);
    updateNilaiSantri({
      santriId: santri.id,
      santriNama: santri.nama,
      nis: santri.nis,
      kelas: santri.kelas,
      mapelId: selectedMapelId,
      nilaiAngka: vals.ujian,
      nilaiHarian: vals.harian,
      nilaiLisan: vals.lisan,
      nilaiAkhlaq: vals.akhlaq,
      nilaiIstiqomah: vals.istiqomah,
      nilaiUbudiyah: vals.ubudiyah,
      nilaiMQK: vals.lisan,
      sakit: vals.sakit,
      izin: vals.izin,
      alpa: vals.alpa,
      semester,
      tahunAjaran: currentTahunAjaran,
      waliKelas,
      hafalanNadhom: 'Tercapai Sesuai Target',
      catatanWaliKelas: vals.catatan,
    });
    setToast(`Nilai ${santri.nama} (${selectedKelas}) tersimpan.`);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSaveAllKelas = () => {
    kelasSantri.forEach((santri) => {
      const vals = getRowValues(santri.id);
      updateNilaiSantri({
        santriId: santri.id,
        santriNama: santri.nama,
        nis: santri.nis,
        kelas: santri.kelas,
        mapelId: selectedMapelId,
        nilaiAngka: vals.ujian,
        nilaiHarian: vals.harian,
        nilaiLisan: vals.lisan,
        nilaiAkhlaq: vals.akhlaq,
        nilaiIstiqomah: vals.istiqomah,
        nilaiUbudiyah: vals.ubudiyah,
        nilaiMQK: vals.lisan,
        sakit: vals.sakit,
        izin: vals.izin,
        alpa: vals.alpa,
        semester,
        tahunAjaran: currentTahunAjaran,
        waliKelas,
        hafalanNadhom: 'Tercapai Sesuai Target',
        catatanWaliKelas: vals.catatan,
      });
    });
    setToast(`Semua nilai kelas ${selectedKelas} (${kelasSantri.length} santri) berhasil disimpan!`);
    setTimeout(() => setToast(''), 4000);
  };

  // Class Entry Progress Status
  const classProgress = uniqueClasses.map((kls) => {
    const total = santriList.filter((s) => s.kelas === kls).length;
    const savedIds = new Set(
      nilaiList.filter((n) => n.kelas === kls && n.mapelId === selectedMapelId).map((n) => n.santriId)
    );
    return {
      kelas: kls,
      savedCount: savedIds.size,
      total,
      isComplete: savedIds.size > 0 && savedIds.size >= total,
      hasAny: savedIds.size > 0,
    };
  });

  const currentMapel = mapelList.find((m) => m.id === selectedMapelId);

  return (
    <div className="space-y-5">
      {toast && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{toast}</span>
        </div>
      )}

      {/* Class Entry Progress Tracker */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs space-y-2.5 no-print">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            Status Input Nilai per Kelas — Mapel: {currentMapel?.nama}
          </span>
          <span className="text-[11px] text-slate-500">Klik kelas untuk membuka lembar input</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {classProgress.map((cp) => (
            <button
              key={cp.kelas}
              type="button"
              onClick={() => setSelectedKelas(cp.kelas)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedKelas === cp.kelas
                  ? 'bg-emerald-800 text-white border-emerald-800'
                  : cp.isComplete
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : cp.hasAny
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <span>{cp.kelas}</span>
              <span className="px-1.5 py-0.2 rounded bg-white/80 text-slate-800 text-[10px] tabular-nums">
                {cp.savedCount}/{cp.total}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Header & Controls */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              <span>Rekapitulasi & Input Nilai Imtihan (Format Leger Pondok)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Input nilai ujian, harian, tes lisan, absensi (S/I/A), sikap, dan catatan wali kelas secara spreadsheet.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Leger</span>
            </button>
            <button
              type="button"
              onClick={handleSaveAllKelas}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Semua Kelas ({selectedKelas})</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Kelas</label>
            <select
              value={selectedKelas}
              onChange={(e) => {
                const nextKelas = e.target.value;
                setSelectedKelas(nextKelas);
                const nextTingkat = parseInt(nextKelas.charAt(0)) || 1;
                const firstLevelMapel = mapelList.find((m) => m.tingkat === nextTingkat);
                if (firstLevelMapel) setSelectedMapelId(firstLevelMapel.id);
              }}
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
            <label className="block font-bold text-slate-700 mb-1">
              Mata Pelajaran (Tingkat {currentTingkat} MDS)
            </label>
            <select
              value={selectedMapelId}
              onChange={(e) => setSelectedMapelId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
            >
              {levelMapels.length > 0 && (
                <optgroup label={`Mapel Tingkat ${currentTingkat} MDS`}>
                  {levelMapels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama} ({m.kitab})
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="Mata Pelajaran Tingkat Lainnya">
                {mapelList
                  .filter((m) => m.tingkat !== currentTingkat)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      [Tkt {m.tingkat}] {m.nama} ({m.kitab})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Semester / Cawu</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value as '1' | '2')}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
            >
              <option value="1">Cawu 1 / Gasal (الأول)</option>
              <option value="2">Cawu 2 / Genap (الثاني)</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Wali Kelas</label>
            <input
              type="text"
              value={waliKelas}
              onChange={(e) => setWaliKelas(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Spreadsheet Table Matching image_c0c3a5a6.png */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 overflow-x-auto printable-area">
        <div className="mb-3 text-center">
          <h4 className="font-black text-sm uppercase text-slate-900">
            REKAPITULASI NILAI IMTIHAN {semester === '2' ? 'TSANI' : 'AWWAL'} — MADRASAH DINIYAH NU DARUSSALAM
          </h4>
          <p className="text-xs text-slate-600">
            Kelas: <strong>{selectedKelas}</strong> · Mapel: <strong>{currentMapel?.nama}</strong> · Wali Kelas:{' '}
            <strong>{waliKelas}</strong> · T.A. {currentTahunAjaran}
          </p>
        </div>

        <table className="w-full text-[11px] border border-slate-300 border-collapse">
          <thead>
            <tr className="bg-emerald-900 text-white font-bold text-center">
              <th rowSpan={2} className="border border-emerald-700 py-1.5 px-2 w-8">NO</th>
              <th rowSpan={2} className="border border-emerald-700 py-1.5 px-2 text-left min-w-[160px]">NAMA SANTRI</th>
              <th colSpan={3} className="border border-emerald-700 py-1 px-2 bg-emerald-800">NILAI MAPEL</th>
              <th rowSpan={2} className="border border-emerald-700 py-1.5 px-2 bg-amber-600">RATA2</th>
              <th colSpan={3} className="border border-emerald-700 py-1 px-2 bg-slate-800">ABSENSI</th>
              <th colSpan={3} className="border border-emerald-700 py-1 px-2 bg-sky-900">SIKAP</th>
              <th rowSpan={2} className="border border-emerald-700 py-1.5 px-2 min-w-[160px]">CATATAN WALI KELAS</th>
              <th rowSpan={2} className="border border-emerald-700 py-1.5 px-2 no-print">AKSI</th>
            </tr>
            <tr className="bg-slate-100 text-slate-800 font-bold text-center text-[10px]">
              <th className="border border-slate-300 py-1 px-1 w-14">UJIAN</th>
              <th className="border border-slate-300 py-1 px-1 w-14">HARIAN</th>
              <th className="border border-slate-300 py-1 px-1 w-14">LISAN</th>
              <th className="border border-slate-300 py-1 px-1 w-10">S</th>
              <th className="border border-slate-300 py-1 px-1 w-10">I</th>
              <th className="border border-slate-300 py-1 px-1 w-10">A</th>
              <th className="border border-slate-300 py-1 px-1 w-14">AKHLAQ</th>
              <th className="border border-slate-300 py-1 px-1 w-14">ISTIQ</th>
              <th className="border border-slate-300 py-1 px-1 w-14">UBUD</th>
            </tr>
          </thead>
          <tbody>
            {kelasSantri.map((s, idx) => {
              const vals = getRowValues(s.id);
              const rata = ((vals.ujian + vals.harian + vals.lisan) / 3).toFixed(1);
              const isSaved = nilaiList.some((n) => n.santriId === s.id && n.mapelId === selectedMapelId);

              return (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="border border-slate-300 py-1 px-1.5 text-center font-bold">{idx + 1}</td>
                  <td className="border border-slate-300 py-1 px-2 font-bold text-slate-900">
                    {s.nama}
                    {isSaved && <span className="ml-1 text-emerald-700 text-[10px]">✓</span>}
                  </td>
                  <td className="border border-slate-300 p-0.5">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={vals.ujian}
                      onChange={(e) => handleCellChange(s.id, 'ujian', parseFloat(e.target.value) || 0)}
                      className={`w-full text-center font-bold py-1 rounded ${
                        vals.ujian < 65 ? 'text-rose-700 bg-rose-50' : 'text-slate-900'
                      }`}
                    />
                  </td>
                  <td className="border border-slate-300 p-0.5">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={vals.harian}
                      onChange={(e) => handleCellChange(s.id, 'harian', parseFloat(e.target.value) || 0)}
                      className="w-full text-center font-bold py-1"
                    />
                  </td>
                  <td className="border border-slate-300 p-0.5">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={vals.lisan}
                      onChange={(e) => handleCellChange(s.id, 'lisan', parseFloat(e.target.value) || 0)}
                      className="w-full text-center font-bold py-1"
                    />
                  </td>
                  <td className="border border-slate-300 py-1 px-1.5 text-center font-black bg-amber-50 tabular-nums">
                    {rata}
                  </td>
                  <td className="border border-slate-300 p-0.5">
                    <input
                      type="number"
                      min={0}
                      value={vals.sakit}
                      onChange={(e) => handleCellChange(s.id, 'sakit', parseInt(e.target.value) || 0)}
                      className="w-full text-center py-1"
                    />
                  </td>
                  <td className="border border-slate-300 p-0.5">
                    <input
                      type="number"
                      min={0}
                      value={vals.izin}
                      onChange={(e) => handleCellChange(s.id, 'izin', parseInt(e.target.value) || 0)}
                      className="w-full text-center py-1"
                    />
                  </td>
                  <td className="border border-slate-300 p-0.5">
                    <input
                      type="number"
                      min={0}
                      value={vals.alpa}
                      onChange={(e) => handleCellChange(s.id, 'alpa', parseInt(e.target.value) || 0)}
                      className="w-full text-center py-1"
                    />
                  </td>
                  <td className="border border-slate-300 p-0.5">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={vals.akhlaq}
                      onChange={(e) => handleCellChange(s.id, 'akhlaq', parseFloat(e.target.value) || 0)}
                      className="w-full text-center py-1 font-semibold"
                    />
                  </td>
                  <td className="border border-slate-300 p-0.5">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={vals.istiqomah}
                      onChange={(e) => handleCellChange(s.id, 'istiqomah', parseFloat(e.target.value) || 0)}
                      className="w-full text-center py-1 font-semibold"
                    />
                  </td>
                  <td className="border border-slate-300 p-0.5">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={vals.ubudiyah}
                      onChange={(e) => handleCellChange(s.id, 'ubudiyah', parseFloat(e.target.value) || 0)}
                      className="w-full text-center py-1 font-semibold"
                    />
                  </td>
                  <td className="border border-slate-300 p-0.5">
                    <input
                      type="text"
                      value={vals.catatan}
                      onChange={(e) => handleCellChange(s.id, 'catatan', e.target.value)}
                      className="w-full px-1.5 py-1 text-[10px]"
                    />
                  </td>
                  <td className="border border-slate-300 p-1 text-center no-print">
                    <button
                      type="button"
                      onClick={() => handleSaveRow(s)}
                      className="px-2 py-1 rounded bg-emerald-800 hover:bg-emerald-900 text-white text-[10px] font-bold"
                    >
                      Simpan
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================================================
   2. RAPORT SANTRI F4 RTL (INDIVIDU & CETAK / PDF 1 KELAS SEKALIGUS)
========================================================================= */
export const SubTabRaportSantri: React.FC = () => {
  const { santriList, nilaiList, currentTahunAjaran } = useAppStore();

  const uniqueClasses = useMemo(
    () => sortClassesCanonical(Array.from(new Set(santriList.map((s) => s.kelas)))),
    [santriList]
  );

  const [selectedKelas, setSelectedKelas] = useState<string>(uniqueClasses[0] || '2 A PUTRA');
  const [printMode, setPrintMode] = useState<'single' | 'kelas'>('single');
  const [selectedSantriId, setSelectedSantriId] = useState<string>(santriList[0]?.id || 's-001');
  const [waliKelas, setWaliKelas] = useState<string>('أستاذ عبد الرحمن');
  const [semester, setSemester] = useState<'1' | '2'>('1');
  const [tahunAjaran, setTahunAjaran] = useState<string>(currentTahunAjaran);
  const [tanggalPenyerahan, setTanggalPenyerahan] = useState<string>('٢١ ديسمبر ٢٠٢٦ م');

  const kelasSantri = santriList.filter((s) => s.kelas === selectedKelas);
  const currentSantri =
    kelasSantri.find((s) => s.id === selectedSantriId) || kelasSantri[0] || santriList[0];

  const kelasArabic = getArabicKelas(selectedKelas);

  const targetSantri = printMode === 'kelas' ? kelasSantri : currentSantri ? [currentSantri] : [];

  return (
    <div className="space-y-6">
      {/* Control Bar (No-print) */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Raport Resmi F4 RTL (كشف درجات الطلاب)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Format F4 (215 × 330 mm) sesuai berkas resmi Cawu 1 & Cawu 2. Dapat mencetak 1 santri atau generate PDF 1 kelas sekaligus.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>
                {printMode === 'kelas'
                  ? `Cetak / PDF 1 Kelas (${targetSantri.length} Santri)`
                  : 'Cetak / PDF Raport F4'}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Kelas Diniyah</label>
            <select
              value={selectedKelas}
              onChange={(e) => {
                const nextKelas = e.target.value;
                setSelectedKelas(nextKelas);
                const firstInClass = santriList.find((s) => s.kelas === nextKelas);
                if (firstInClass) setSelectedSantriId(firstInClass.id);
              }}
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
            <label className="block font-bold text-slate-700 mb-1">Mode Cetak</label>
            <select
              value={printMode}
              onChange={(e) => setPrintMode(e.target.value as 'single' | 'kelas')}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold text-emerald-900"
            >
              <option value="single">Per 1 Santri</option>
              <option value="kelas">1 Kelas Sekaligus (PDF Batch)</option>
            </select>
          </div>

          {printMode === 'single' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Santri</label>
              <select
                value={currentSantri?.id || ''}
                onChange={(e) => setSelectedSantriId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
              >
                {kelasSantri.map((s, idx) => (
                  <option key={s.id} value={s.id}>
                    {idx + 1}. {s.nama}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Wali Kelas</label>
            <input
              type="text"
              value={waliKelas}
              onChange={(e) => setWaliKelas(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Cawu / Semester</label>
            <select
              value={semester}
              onChange={(e) => {
                const s = e.target.value as '1' | '2';
                setSemester(s);
                setTanggalPenyerahan(s === '2' ? '٢١ يونيو ٢٠٢٧ م' : '٢١ ديسمبر ٢٠٢٦ م');
              }}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
            >
              <option value="1">Cawu 1 (الأول)</option>
              <option value="2">Cawu 2 (الثاني + Kenaikan)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tahun Ajaran</label>
            <input
              type="text"
              value={tahunAjaran}
              onChange={(e) => setTahunAjaran(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* Printable Raport Sheets */}
      <div className="space-y-8">
        {targetSantri.map((santri, idx) => (
          <RaportF4Sheet
            key={santri.id}
            santri={santri}
            attendanceNo={idx + 1}
            kelasLabel={selectedKelas}
            kelasArabic={kelasArabic.current}
            nextKelasArabic={kelasArabic.next}
            waliKelas={waliKelas}
            semester={semester}
            tahunAjaran={tahunAjaran}
            tanggalPenyerahan={tanggalPenyerahan}
            nilaiList={nilaiList}
            totalSantriKelas={kelasSantri.length}
            peringkatKelas={idx + 1}
          />
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   3. PERINGKAT PARALEL (PER KELAS, PER ANGKATAN, GABUNGAN PUTRA & PUTRI)
========================================================================= */
export const SubTabPeringkatParalel: React.FC = () => {
  const { santriList, nilaiList } = useAppStore();

  const [scope, setScope] = useState<'kelas' | 'angkatan' | 'gabungan'>('gabungan');
  const [selectedKelas, setSelectedKelas] = useState<string>('2 A PUTRA');
  const [selectedTingkat, setSelectedTingkat] = useState<number>(2);
  const [search, setSearch] = useState<string>('');

  const uniqueClasses = sortClassesCanonical(Array.from(new Set(santriList.map((s) => s.kelas))));

  const rankedList = useMemo(() => {
    const filtered = santriList.filter((s) => {
      if (scope === 'kelas' && s.kelas !== selectedKelas) return false;
      if (scope === 'angkatan' && s.tingkat !== selectedTingkat) return false;
      return true;
    });

    const scored = filtered.map((s, idx) => {
      const recs = nilaiList.filter((n) => n.santriId === s.id);
      const baseUjian = recs.length > 0 ? recs.reduce((sum, r) => sum + r.nilaiAngka, 0) / recs.length : 78 + ((idx * 7) % 20);
      const baseHarian = recs.length > 0 ? recs.reduce((sum, r) => sum + (r.nilaiHarian ?? 82), 0) / recs.length : 80 + ((idx * 5) % 16);
      const rata = Number(((baseUjian + baseHarian) / 2).toFixed(2));
      const jumlah = Math.round(rata * 8);
      return { santri: s, rata, jumlah };
    });

    scored.sort((a, b) => b.rata - a.rata);
    return scored.map((item, i) => ({ ...item, rank: i + 1 }));
  }, [santriList, nilaiList, scope, selectedKelas, selectedTingkat]);

  const displayed = rankedList.filter(
    (r) =>
      !search ||
      r.santri.nama.toLowerCase().includes(search.toLowerCase()) ||
      r.santri.nis.includes(search)
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Peringkat Prestasi Santri (Paralel Putra & Putri)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Pemeringkatan otomatis berdasarkan rata-rata nilai imtihan & harian per kelas, per angkatan (tingkat), maupun gabungan paralel pondok.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Peringkat</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setScope('kelas')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                scope === 'kelas' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Per Kelas
            </button>
            <button
              type="button"
              onClick={() => setScope('angkatan')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                scope === 'angkatan' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Per Angkatan (Tingkat)
            </button>
            <button
              type="button"
              onClick={() => setScope('gabungan')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                scope === 'gabungan' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Paralel Gabungan Putra & Putri
            </button>
          </div>

          {scope === 'kelas' && (
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-1.5 font-bold"
            >
              {uniqueClasses.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          )}

          {scope === 'angkatan' && (
            <select
              value={selectedTingkat}
              onChange={(e) => setSelectedTingkat(parseInt(e.target.value))}
              className="rounded-xl border border-slate-300 px-3 py-1.5 font-bold"
            >
              {[1, 2, 3, 4, 5, 6].map((t) => (
                <option key={t} value={t}>
                  Tingkat {t} MDS (Putra & Putri)
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-2 ml-auto border border-slate-200 rounded-xl px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama santri..."
              className="bg-transparent focus:outline-hidden text-xs"
            />
          </div>
        </div>
      </div>

      {/* Ranking Table */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs printable-area">
        <div className="mb-3 text-center">
          <h4 className="font-black text-sm uppercase text-slate-900">
            DAFTAR PERINGKAT JUARA IMTIHAN —{' '}
            {scope === 'kelas'
              ? `KELAS ${selectedKelas}`
              : scope === 'angkatan'
              ? `PARALEL TINGKAT ${selectedTingkat} MDS`
              : 'GABUNGAN PARALEL PUTRA & PUTRI'}
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-slate-300 bg-slate-50 text-slate-600 text-left">
                <th className="py-2.5 px-3 w-20 text-center">Peringkat</th>
                <th className="py-2.5 px-3">NIS</th>
                <th className="py-2.5 px-3">Nama Lengkap Santri</th>
                <th className="py-2.5 px-3">Putra / Putri</th>
                <th className="py-2.5 px-3">Kelas</th>
                <th className="py-2.5 px-3 text-right">Jumlah Nilai</th>
                <th className="py-2.5 px-3 text-right">Rata-Rata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold">
              {displayed.slice(0, 60).map((row) => (
                <tr key={row.santri.id} className={row.rank <= 3 ? 'bg-amber-50/50' : 'hover:bg-slate-50'}>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
                        row.rank === 1
                          ? 'bg-amber-400 text-amber-950'
                          : row.rank === 2
                          ? 'bg-slate-300 text-slate-900'
                          : row.rank === 3
                          ? 'bg-orange-300 text-orange-950'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {row.rank}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{row.santri.nis}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{row.santri.nama}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        row.santri.gender === 'L' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {row.santri.gender === 'L' ? 'Putra' : 'Putri'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">{row.santri.kelas}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{row.jumlah}</td>
                  <td className="py-2.5 px-3 text-right font-black text-emerald-800 tabular-nums">
                    {row.rata.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
