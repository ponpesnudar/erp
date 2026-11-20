import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Printer,
  FileText,
  Award,
  Save,
  Search,
  Upload,
  PenTool,
  Eraser,
  BookOpen,
} from 'lucide-react';
import { useAppStore } from '../../../lib/store.ts';
import { useAuth } from '../../../lib/auth.ts';
import { triggerReliablePrint } from '../../../lib/printHelper.ts';
import {
  DAFTAR_KELAS_DINIYAH,
  MAPEL_PER_TINGKAT,
  SEED_MAPEL_IMTIHAN,
  type MapelTingkatTemplate,
} from '../../../data/seed/pondokData.ts';
import { RaportF4Sheet, getArabicKelas } from './RaportF4Sheet.tsx';
import { PrintOrientationControl } from '../../../components/common/PrintOrientationControl.tsx';
import { PrintKopPondok } from '../../../components/common/PrintKopPondok.tsx';

function sortClassesCanonical(classes: string[]): string[] {
  const orderMap = new Map<string, number>(DAFTAR_KELAS_DINIYAH.map((c, i) => [c, i]));
  return [...classes].sort((a, b) => {
    const ia = orderMap.has(a) ? orderMap.get(a)! : 999;
    const ib = orderMap.has(b) ? orderMap.get(b)! : 999;
    if (ia !== ib) return ia - ib;
    return a.localeCompare(b);
  });
}

function resolveMapelIdForTemplate(
  subj: MapelTingkatTemplate,
  tingkat: number,
  mapelList: { id: string; kode: string; nama: string; tingkat: number }[]
): string {
  const exact = mapelList.find(
    (m) => m.tingkat === tingkat && m.kode.toUpperCase() === `${subj.kodePrefix}-${tingkat}`
  );
  if (exact) return exact.id;
  const byName = mapelList.find(
    (m) =>
      m.tingkat === tingkat &&
      m.nama.toLowerCase().includes(subj.nama.toLowerCase().split(' ')[0])
  );
  if (byName) return byName.id;
  const seedExact = SEED_MAPEL_IMTIHAN.find(
    (m) => m.tingkat === tingkat && m.kode.toUpperCase() === `${subj.kodePrefix}-${tingkat}`
  );
  return seedExact?.id || `${subj.kodePrefix}-${tingkat}`;
}

/* =========================================================================
   1. INPUT NILAI SPREADSHEET + MODE WALI KELAS (SEMUA MAPEL)
======================================================================== */
export const SubTabInputNilaiSpreadsheet: React.FC = () => {
  const {
    santriList,
    mapelList,
    nilaiList,
    ustadzList,
    updateNilaiSantri,
    currentTahunAjaran,
    printOrientation,
  } = useAppStore();

  const legerPrintRef = useRef<HTMLDivElement | null>(null);

  const { currentUser } = useAuth();
  const uniqueClasses = useMemo(
    () => sortClassesCanonical(Array.from(new Set(santriList.map((s) => s.kelas)))),
    [santriList]
  );

  const [entryMode, setEntryMode] = useState<'mapel' | 'walikelas'>('walikelas');
  const [selectedKelas, setSelectedKelas] = useState<string>(uniqueClasses[0] || '1 A PUTRA');
  const currentTingkat = parseInt(selectedKelas.charAt(0)) || 1;
  const levelMapels = useMemo(
    () => mapelList.filter((m) => m.tingkat === currentTingkat),
    [mapelList, currentTingkat]
  );
  const tingkatTemplates = useMemo(
    () => MAPEL_PER_TINGKAT[currentTingkat] || MAPEL_PER_TINGKAT[1],
    [currentTingkat]
  );
  const [selectedMapelId, setSelectedMapelId] = useState<string>(
    levelMapels[0]?.id || mapelList[0]?.id || 'm-04'
  );
  const [semester, setSemester] = useState<'1' | '2'>('1');

  const defaultWaliForClass = (kls: string) => {
    const matched = ustadzList.find((u) =>
      `${u.tugasTambahanSatminkal || ''} ${u.jabatanUtama || ''}`
        .toUpperCase()
        .includes(kls.toUpperCase())
    );
    return matched?.nama || 'Ust. Abdur Rahman';
  };

  const [waliKelas, setWaliKelas] = useState<string>(() =>
    defaultWaliForClass(uniqueClasses[0] || '1 A PUTRA')
  );
  const [toast, setToast] = useState<string>('');

  // Auto-sync kelas & wali kelas saat login sebagai guru/wali kelas tertentu
  useEffect(() => {
    const matchedUstadz = ustadzList.find(
      (u) => u.nama.toLowerCase() === currentUser.nama.toLowerCase()
    );
    const roleHint = `${currentUser.peranLabel || ''} ${matchedUstadz?.tugasTambahanSatminkal || ''} ${matchedUstadz?.jabatanUtama || ''}`.toUpperCase();
    const detectedClass = uniqueClasses.find((k) => roleHint.includes(k.toUpperCase()));
    if (detectedClass) {
      setSelectedKelas(detectedClass);
      setWaliKelas(matchedUstadz?.nama || currentUser.nama);
      setEntryMode('walikelas');
    }
  }, [currentUser.id, currentUser.nama, currentUser.peranLabel, ustadzList, uniqueClasses]);

  // Draft map for single-mapel mode: santriId -> row fields
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

  // Draft map for Wali Kelas multi-mapel mode: `${santriId}__${mapelId}` -> { ujian, harian, lisan }
  const [waliMapelDrafts, setWaliMapelDrafts] = useState<
    Record<string, { ujian: number; harian: number; lisan: number }>
  >({});

  // Draft map for Wali Kelas shared non-mapel fields: santriId -> { sakit, izin, alpa, akhlaq, istiqomah, ubudiyah, catatan }
  const [waliMetaDrafts, setWaliMetaDrafts] = useState<
    Record<
      string,
      {
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

  const getWaliMapelCell = (santriId: string, mapelId: string, index: number, tingkat: number) => {
    const key = `${santriId}__${mapelId}`;
    if (waliMapelDrafts[key]) return waliMapelDrafts[key];
    const existing = nilaiList.find((n) => n.santriId === santriId && n.mapelId === mapelId);
    return {
      ujian: existing?.nilaiAngka ?? 84 + ((index + tingkat) % 9),
      harian: existing?.nilaiHarian ?? 82 + ((index * 2) % 8),
      lisan: existing?.nilaiLisan ?? 85,
    };
  };

  const getWaliMeta = (santriId: string) => {
    if (waliMetaDrafts[santriId]) return waliMetaDrafts[santriId];
    const anyRec = nilaiList.find((n) => n.santriId === santriId);
    return {
      sakit: anyRec?.sakit ?? 0,
      izin: anyRec?.izin ?? 1,
      alpa: anyRec?.alpa ?? 0,
      akhlaq: anyRec?.nilaiAkhlaq ?? 88,
      istiqomah: anyRec?.nilaiIstiqomah ?? 86,
      ubudiyah: anyRec?.nilaiUbudiyah ?? 90,
      catatan: anyRec?.catatanWaliKelas ?? 'Tingkatkan semangat muthalaah kitab & shalat berjamaah.',
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

  const handleWaliMapelChange = (
    santriId: string,
    mapelId: string,
    index: number,
    field: 'ujian' | 'harian' | 'lisan',
    val: number
  ) => {
    const cur = getWaliMapelCell(santriId, mapelId, index, currentTingkat);
    setWaliMapelDrafts((prev) => ({
      ...prev,
      [`${santriId}__${mapelId}`]: { ...cur, [field]: val },
    }));
  };

  const handleWaliMetaChange = (
    santriId: string,
    field: keyof ReturnType<typeof getWaliMeta>,
    val: string | number
  ) => {
    const cur = getWaliMeta(santriId);
    setWaliMetaDrafts((prev) => ({
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

  const handleSaveWaliRow = (santri: (typeof santriList)[0]) => {
    const meta = getWaliMeta(santri.id);
    tingkatTemplates.forEach((subj, idx) => {
      const mId = resolveMapelIdForTemplate(subj, currentTingkat, mapelList);
      const cell = getWaliMapelCell(santri.id, mId, idx, currentTingkat);
      updateNilaiSantri({
        santriId: santri.id,
        santriNama: santri.nama,
        nis: santri.nis,
        kelas: santri.kelas,
        mapelId: mId,
        nilaiAngka: cell.ujian,
        nilaiHarian: cell.harian,
        nilaiLisan: cell.lisan,
        nilaiAkhlaq: meta.akhlaq,
        nilaiIstiqomah: meta.istiqomah,
        nilaiUbudiyah: meta.ubudiyah,
        nilaiMQK: cell.lisan,
        sakit: meta.sakit,
        izin: meta.izin,
        alpa: meta.alpa,
        semester,
        tahunAjaran: currentTahunAjaran,
        waliKelas,
        hafalanNadhom: 'Tercapai Sesuai Target',
        catatanWaliKelas: meta.catatan,
      });
    });
    setToast(
      `Semua ${tingkatTemplates.length} mapel untuk ${santri.nama} (${selectedKelas}) tersimpan.`
    );
    setTimeout(() => setToast(''), 3500);
  };

  const handleSaveAllWaliKelas = () => {
    kelasSantri.forEach((santri) => {
      const meta = getWaliMeta(santri.id);
      tingkatTemplates.forEach((subj, idx) => {
        const mId = resolveMapelIdForTemplate(subj, currentTingkat, mapelList);
        const cell = getWaliMapelCell(santri.id, mId, idx, currentTingkat);
        updateNilaiSantri({
          santriId: santri.id,
          santriNama: santri.nama,
          nis: santri.nis,
          kelas: santri.kelas,
          mapelId: mId,
          nilaiAngka: cell.ujian,
          nilaiHarian: cell.harian,
          nilaiLisan: cell.lisan,
          nilaiAkhlaq: meta.akhlaq,
          nilaiIstiqomah: meta.istiqomah,
          nilaiUbudiyah: meta.ubudiyah,
          nilaiMQK: cell.lisan,
          sakit: meta.sakit,
          izin: meta.izin,
          alpa: meta.alpa,
          semester,
          tahunAjaran: currentTahunAjaran,
          waliKelas,
          hafalanNadhom: 'Tercapai Sesuai Target',
          catatanWaliKelas: meta.catatan,
        });
      });
    });
    setToast(
      `Berhasil menyimpan semua ${tingkatTemplates.length} mapel untuk ${kelasSantri.length} santri kelas ${selectedKelas}!`
    );
    setTimeout(() => setToast(''), 4000);
  };

  // Class Entry Progress Status
  const classProgress = uniqueClasses.map((kls) => {
    const total = santriList.filter((s) => s.kelas === kls).length;
    const savedIds = new Set(
      nilaiList
        .filter((n) => n.kelas === kls && (entryMode === 'walikelas' || n.mapelId === selectedMapelId))
        .map((n) => n.santriId)
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-800">
            Status Input Nilai per Kelas —{' '}
            {entryMode === 'walikelas'
              ? `Semua Mapel Tingkat ${currentTingkat} MDS`
              : `Mapel: ${currentMapel?.nama}`}
          </span>
          <span className="text-[11px] text-slate-500">Klik kelas untuk membuka lembar input</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {classProgress.map((cp) => (
            <button
              key={cp.kelas}
              type="button"
              onClick={() => {
                setSelectedKelas(cp.kelas);
                setWaliKelas(defaultWaliForClass(cp.kelas));
                const nextTingkat = parseInt(cp.kelas.charAt(0)) || 1;
                const firstLevelMapel = mapelList.find((m) => m.tingkat === nextTingkat);
                if (firstLevelMapel) setSelectedMapelId(firstLevelMapel.id);
              }}
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-700" />
              <span>Rekapitulasi &amp; Input Nilai Imtihan (Format Leger Pondok)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Pilih <strong>Mode Wali Kelas (Semua Mapel)</strong> untuk input seluruh mapel kelas {selectedKelas} sekaligus dalam 1 leger, atau <strong>Per Mapel</strong> untuk guru bidang studi.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PrintOrientationControl recommended="landscape" />
            <button
              type="button"
              onClick={() =>
                triggerReliablePrint({
                  title: `Leger Nilai Imtihan - ${selectedKelas}`,
                  orientation: printOrientation,
                  paperSize: 'F4',
                  targetElement: legerPrintRef.current,
                })
              }
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Leger</span>
            </button>
            <button
              type="button"
              onClick={entryMode === 'walikelas' ? handleSaveAllWaliKelas : handleSaveAllKelas}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>
                {entryMode === 'walikelas'
                  ? `Simpan Semua Mapel & Santri (${selectedKelas})`
                  : `Simpan Semua Kelas (${selectedKelas})`}
              </span>
            </button>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700">Mode Input Nilai:</span>
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setEntryMode('walikelas')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                entryMode === 'walikelas'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Mode Wali Kelas (Semua Mapel Kelas {currentTingkat})</span>
            </button>
            <button
              type="button"
              onClick={() => setEntryMode('mapel')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                entryMode === 'mapel'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Per 1 Mata Pelajaran
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
                setWaliKelas(defaultWaliForClass(nextKelas));
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

          {entryMode === 'mapel' ? (
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
          ) : (
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Cakupan Mapel Aktif ({tingkatTemplates.length} Kitab)
              </label>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-[11px] font-bold text-emerald-900 truncate">
                {tingkatTemplates.map((t) => t.nama.split(' (')[0]).join(' · ')}
              </div>
            </div>
          )}

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

      {/* Spreadsheet Table: Mode Per Mapel OR Mode Wali Kelas (Semua Mapel) */}
      <div
        ref={legerPrintRef}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 overflow-x-auto printable-area"
      >
        <PrintKopPondok
          variant="imtihan"
          judulDokumen={`REKAPITULASI NILAI IMTIHAN ${semester === '2' ? 'TSANI' : 'AWWAL'} — KELAS ${selectedKelas}`}
          subJudul={`${
            entryMode === 'walikelas'
              ? `Leger Wali Kelas (${tingkatTemplates.length} Mapel)`
              : `Mapel: ${currentMapel?.nama || '-'}`
          } · Wali Kelas: ${waliKelas}`}
          tahunAjaran={currentTahunAjaran}
        />
        <div className="mb-3 text-center no-print">
          <h4 className="font-black text-sm uppercase text-slate-900">
            REKAPITULASI NILAI IMTIHAN {semester === '2' ? 'TSANI' : 'AWWAL'} — MADRASAH DINIYAH NU DARUSSALAM
          </h4>
          <p className="text-xs text-slate-600">
            Kelas: <strong>{selectedKelas}</strong> ·{' '}
            {entryMode === 'walikelas' ? (
              <>
                Mode: <strong>Leger Wali Kelas ({tingkatTemplates.length} Mapel)</strong>
              </>
            ) : (
              <>
                Mapel: <strong>{currentMapel?.nama}</strong>
              </>
            )}{' '}
            · Wali Kelas: <strong>{waliKelas}</strong> · T.A. {currentTahunAjaran}
          </p>
        </div>

        {entryMode === 'mapel' ? (
          <table className="w-full text-[11px] border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-emerald-900 text-white font-bold text-center">
                <th rowSpan={2} className="border border-emerald-700 py-1.5 px-2 w-8">
                  NO
                </th>
                <th rowSpan={2} className="border border-emerald-700 py-1.5 px-2 text-left min-w-[160px]">
                  NAMA SANTRI
                </th>
                <th colSpan={3} className="border border-emerald-700 py-1 px-2 bg-emerald-800">
                  NILAI MAPEL
                </th>
                <th rowSpan={2} className="border border-emerald-700 py-1.5 px-2 bg-amber-600">
                  RATA2
                </th>
                <th colSpan={3} className="border border-emerald-700 py-1 px-2 bg-slate-800">
                  ABSENSI
                </th>
                <th colSpan={3} className="border border-emerald-700 py-1 px-2 bg-sky-900">
                  SIKAP
                </th>
                <th rowSpan={2} className="border border-emerald-700 py-1.5 px-2 min-w-[160px]">
                  CATATAN WALI KELAS
                </th>
                <th rowSpan={2} className="border border-emerald-700 py-1.5 px-2 no-print">
                  AKSI
                </th>
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
                const isSaved = nilaiList.some(
                  (n) => n.santriId === s.id && n.mapelId === selectedMapelId
                );

                return (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="border border-slate-300 py-1 px-1.5 text-center font-bold">
                      {idx + 1}
                    </td>
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
                        onChange={(e) =>
                          handleCellChange(s.id, 'ujian', parseFloat(e.target.value) || 0)
                        }
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
                        onChange={(e) =>
                          handleCellChange(s.id, 'harian', parseFloat(e.target.value) || 0)
                        }
                        className="w-full text-center font-bold py-1"
                      />
                    </td>
                    <td className="border border-slate-300 p-0.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={vals.lisan}
                        onChange={(e) =>
                          handleCellChange(s.id, 'lisan', parseFloat(e.target.value) || 0)
                        }
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
                        onChange={(e) =>
                          handleCellChange(s.id, 'sakit', parseInt(e.target.value) || 0)
                        }
                        className="w-full text-center py-1"
                      />
                    </td>
                    <td className="border border-slate-300 p-0.5">
                      <input
                        type="number"
                        min={0}
                        value={vals.izin}
                        onChange={(e) =>
                          handleCellChange(s.id, 'izin', parseInt(e.target.value) || 0)
                        }
                        className="w-full text-center py-1"
                      />
                    </td>
                    <td className="border border-slate-300 p-0.5">
                      <input
                        type="number"
                        min={0}
                        value={vals.alpa}
                        onChange={(e) =>
                          handleCellChange(s.id, 'alpa', parseInt(e.target.value) || 0)
                        }
                        className="w-full text-center py-1"
                      />
                    </td>
                    <td className="border border-slate-300 p-0.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={vals.akhlaq}
                        onChange={(e) =>
                          handleCellChange(s.id, 'akhlaq', parseFloat(e.target.value) || 0)
                        }
                        className="w-full text-center py-1 font-semibold"
                      />
                    </td>
                    <td className="border border-slate-300 p-0.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={vals.istiqomah}
                        onChange={(e) =>
                          handleCellChange(s.id, 'istiqomah', parseFloat(e.target.value) || 0)
                        }
                        className="w-full text-center py-1 font-semibold"
                      />
                    </td>
                    <td className="border border-slate-300 p-0.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={vals.ubudiyah}
                        onChange={(e) =>
                          handleCellChange(s.id, 'ubudiyah', parseFloat(e.target.value) || 0)
                        }
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
        ) : (
          /* MODE WALI KELAS: SEMUA MAPEL SEKALIGUS (UJIAN, HARIAN, LISAN PER MAPEL + S/I/A + SIKAP + CATATAN) */
          <table className="w-full text-[10px] border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-emerald-900 text-white font-bold text-center">
                <th rowSpan={2} className="border border-emerald-700 py-1.5 px-1.5 w-7">
                  NO
                </th>
                <th
                  rowSpan={2}
                  className="border border-emerald-700 py-1.5 px-2 text-left min-w-[140px] sticky left-0 bg-emerald-900"
                >
                  NAMA SANTRI
                </th>
                {tingkatTemplates.map((subj) => (
                  <th
                    key={subj.kodePrefix}
                    colSpan={3}
                    className="border border-emerald-700 py-1 px-1 bg-emerald-800 whitespace-nowrap"
                    title={subj.kitab}
                  >
                    {subj.nama.split(' (')[0]}
                  </th>
                ))}
                <th rowSpan={2} className="border border-emerald-700 py-1.5 px-1.5 bg-amber-600">
                  RATA2
                </th>
                <th colSpan={3} className="border border-emerald-700 py-1 px-1 bg-slate-800">
                  S/I/A
                </th>
                <th colSpan={3} className="border border-emerald-700 py-1 px-1 bg-sky-900">
                  SIKAP
                </th>
                <th rowSpan={2} className="border border-emerald-700 py-1.5 px-2 min-w-[130px]">
                  CATATAN
                </th>
                <th rowSpan={2} className="border border-emerald-700 py-1.5 px-1.5 no-print">
                  AKSI
                </th>
              </tr>
              <tr className="bg-slate-100 text-slate-800 font-bold text-center text-[9px]">
                {tingkatTemplates.map((subj) => (
                  <React.Fragment key={`${subj.kodePrefix}-sub`}>
                    <th className="border border-slate-300 py-0.5 px-0.5 w-9" title="Nilai Imtihan / Ujian">
                      U
                    </th>
                    <th className="border border-slate-300 py-0.5 px-0.5 w-9" title="Nilai Harian">
                      H
                    </th>
                    <th className="border border-slate-300 py-0.5 px-0.5 w-9" title="Nilai Lisan">
                      L
                    </th>
                  </React.Fragment>
                ))}
                <th className="border border-slate-300 py-0.5 px-0.5 w-8">S</th>
                <th className="border border-slate-300 py-0.5 px-0.5 w-8">I</th>
                <th className="border border-slate-300 py-0.5 px-0.5 w-8">A</th>
                <th className="border border-slate-300 py-0.5 px-0.5 w-10">AKH</th>
                <th className="border border-slate-300 py-0.5 px-0.5 w-10">IST</th>
                <th className="border border-slate-300 py-0.5 px-0.5 w-10">UBD</th>
              </tr>
            </thead>
            <tbody>
              {kelasSantri.map((s, sIdx) => {
                const meta = getWaliMeta(s.id);
                const cells = tingkatTemplates.map((subj, mIdx) => {
                  const mId = resolveMapelIdForTemplate(subj, currentTingkat, mapelList);
                  const cell = getWaliMapelCell(s.id, mId, mIdx, currentTingkat);
                  return { subj, mId, mIdx, cell };
                });
                const totalAvg =
                  cells.reduce((sum, c) => sum + (c.cell.ujian + c.cell.harian) / 2, 0) /
                  Math.max(1, cells.length);

                return (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="border border-slate-300 py-1 px-1 text-center font-bold">
                      {sIdx + 1}
                    </td>
                    <td className="border border-slate-300 py-1 px-1.5 font-bold text-slate-900 sticky left-0 bg-white">
                      {s.nama}
                    </td>
                    {cells.map(({ mId, mIdx, cell }) => (
                      <React.Fragment key={`${s.id}-${mId}`}>
                        <td className="border border-slate-300 p-0.5">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={cell.ujian}
                            onChange={(e) =>
                              handleWaliMapelChange(
                                s.id,
                                mId,
                                mIdx,
                                'ujian',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className={`w-9 text-center font-bold py-0.5 rounded ${
                              cell.ujian < 65 ? 'text-rose-700 bg-rose-50' : 'text-slate-900'
                            }`}
                          />
                        </td>
                        <td className="border border-slate-300 p-0.5">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={cell.harian}
                            onChange={(e) =>
                              handleWaliMapelChange(
                                s.id,
                                mId,
                                mIdx,
                                'harian',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-9 text-center py-0.5"
                          />
                        </td>
                        <td className="border border-slate-300 p-0.5">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={cell.lisan}
                            onChange={(e) =>
                              handleWaliMapelChange(
                                s.id,
                                mId,
                                mIdx,
                                'lisan',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-9 text-center py-0.5 text-slate-600"
                          />
                        </td>
                      </React.Fragment>
                    ))}
                    <td className="border border-slate-300 py-1 px-1.5 text-center font-black bg-amber-50 tabular-nums">
                      {totalAvg.toFixed(1)}
                    </td>
                    <td className="border border-slate-300 p-0.5">
                      <input
                        type="number"
                        min={0}
                        value={meta.sakit}
                        onChange={(e) =>
                          handleWaliMetaChange(s.id, 'sakit', parseInt(e.target.value) || 0)
                        }
                        className="w-8 text-center py-0.5"
                      />
                    </td>
                    <td className="border border-slate-300 p-0.5">
                      <input
                        type="number"
                        min={0}
                        value={meta.izin}
                        onChange={(e) =>
                          handleWaliMetaChange(s.id, 'izin', parseInt(e.target.value) || 0)
                        }
                        className="w-8 text-center py-0.5"
                      />
                    </td>
                    <td className="border border-slate-300 p-0.5">
                      <input
                        type="number"
                        min={0}
                        value={meta.alpa}
                        onChange={(e) =>
                          handleWaliMetaChange(s.id, 'alpa', parseInt(e.target.value) || 0)
                        }
                        className="w-8 text-center py-0.5"
                      />
                    </td>
                    <td className="border border-slate-300 p-0.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={meta.akhlaq}
                        onChange={(e) =>
                          handleWaliMetaChange(s.id, 'akhlaq', parseFloat(e.target.value) || 0)
                        }
                        className="w-10 text-center py-0.5 font-semibold"
                      />
                    </td>
                    <td className="border border-slate-300 p-0.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={meta.istiqomah}
                        onChange={(e) =>
                          handleWaliMetaChange(s.id, 'istiqomah', parseFloat(e.target.value) || 0)
                        }
                        className="w-10 text-center py-0.5 font-semibold"
                      />
                    </td>
                    <td className="border border-slate-300 p-0.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={meta.ubudiyah}
                        onChange={(e) =>
                          handleWaliMetaChange(s.id, 'ubudiyah', parseFloat(e.target.value) || 0)
                        }
                        className="w-10 text-center py-0.5 font-semibold"
                      />
                    </td>
                    <td className="border border-slate-300 p-0.5">
                      <input
                        type="text"
                        value={meta.catatan}
                        onChange={(e) => handleWaliMetaChange(s.id, 'catatan', e.target.value)}
                        className="w-full px-1 py-0.5 text-[9.5px]"
                      />
                    </td>
                    <td className="border border-slate-300 p-1 text-center no-print">
                      <button
                        type="button"
                        onClick={() => handleSaveWaliRow(s)}
                        className="px-2 py-1 rounded bg-emerald-800 hover:bg-emerald-900 text-white text-[9.5px] font-bold whitespace-nowrap"
                      >
                        Simpan
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

function processSignatureToTransparentPng(srcDataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (!w || !h) {
          resolve(srcDataUrl);
          return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(srcDataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        let minX = w;
        let minY = h;
        let maxX = -1;
        let maxY = -1;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a < 15) continue;

          // Luminance check + low saturation near-white/gray paper background removal
          const maxCh = Math.max(r, g, b);
          const minCh = Math.min(r, g, b);
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          const isNeutral = maxCh - minCh < 32;

          if (lum > 215 || (isNeutral && lum > 188)) {
            data[i + 3] = 0;
          } else {
            // Smooth alpha feather on light edges & boost ink crispness
            if (isNeutral && lum > 155) {
              const factor = Math.max(0, (188 - lum) / 33);
              data[i + 3] = Math.round(a * factor);
            }
            if (data[i + 3] > 20) {
              // Slightly darken neutral grey ink strokes for sharper print output
              if (isNeutral) {
                data[i] = Math.max(0, Math.round(r * 0.55));
                data[i + 1] = Math.max(0, Math.round(g * 0.55));
                data[i + 2] = Math.max(0, Math.round(b * 0.55));
              }
              const pIdx = i / 4;
              const px = pIdx % w;
              const py = Math.floor(pIdx / w);
              if (px < minX) minX = px;
              if (px > maxX) maxX = px;
              if (py < minY) minY = py;
              if (py > maxY) maxY = py;
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);

        if (maxX > minX && maxY > minY) {
          const pad = 8;
          const sx = Math.max(0, minX - pad);
          const sy = Math.max(0, minY - pad);
          const sw = Math.min(w - sx, maxX - minX + 1 + pad * 2);
          const sh = Math.min(h - sy, maxY - minY + 1 + pad * 2);
          const trimCanvas = document.createElement('canvas');
          trimCanvas.width = sw;
          trimCanvas.height = sh;
          const tCtx = trimCanvas.getContext('2d');
          if (tCtx) {
            tCtx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
            resolve(trimCanvas.toDataURL('image/png'));
            return;
          }
        }
        resolve(canvas.toDataURL('image/png'));
      } catch {
        resolve(srcDataUrl);
      }
    };
    img.onerror = () => resolve(srcDataUrl);
    img.src = srcDataUrl;
  });
}

/* =========================================================================
   2. RAPORT SANTRI F4 RTL (INDIVIDU, BATCH 1 KELAS, & TTD PENGASUH/WALI KELAS)
======================================================================== */
export const SubTabRaportSantri: React.FC = () => {
  const {
    santriList,
    nilaiList,
    ustadzList,
    currentTahunAjaran,
    pengasuhTtdUrl,
    setPengasuhTtdUrl,
    waliKelasTtdMap,
    setWaliKelasTtd,
    printOrientation,
  } = useAppStore();

  const { currentUser } = useAuth();
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
  const [activePadTarget, setActivePadTarget] = useState<'pengasuh' | 'walikelas' | null>(null);
  const [autoTransparentBg, setAutoTransparentBg] = useState<boolean>(true);
  const [ttdToast, setTtdToast] = useState('');

  const padCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const raportContainerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const matchedUserUstadz = ustadzList.find(
      (u) => u.nama.toLowerCase() === currentUser.nama.toLowerCase()
    );
    const roleHint = `${currentUser.peranLabel || ''} ${matchedUserUstadz?.tugasTambahanSatminkal || ''} ${matchedUserUstadz?.jabatanUtama || ''}`.toUpperCase();
    const detectedClass = uniqueClasses.find((k) => roleHint.includes(k.toUpperCase()));
    if (detectedClass) {
      setSelectedKelas(detectedClass);
    }
  }, [currentUser.id, currentUser.nama, currentUser.peranLabel, ustadzList, uniqueClasses]);

  useEffect(() => {
    const matched = ustadzList.find((u) =>
      `${u.tugasTambahanSatminkal || ''} ${u.jabatanUtama || ''}`
        .toUpperCase()
        .includes(selectedKelas.toUpperCase())
    );
    if (matched) {
      setWaliKelas(matched.namaArab || matched.nama);
    }
  }, [selectedKelas, ustadzList]);

  const kelasSantri = santriList.filter((s) => s.kelas === selectedKelas);
  const currentSantri =
    kelasSantri.find((s) => s.id === selectedSantriId) || kelasSantri[0] || santriList[0];

  const kelasArabic = getArabicKelas(selectedKelas);
  const targetSantri = printMode === 'kelas' ? kelasSantri : currentSantri ? [currentSantri] : [];

  const handleUploadSignature = (
    target: 'pengasuh' | 'walikelas',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        const finalUrl = autoTransparentBg
          ? await processSignatureToTransparentPng(reader.result)
          : reader.result;
        if (target === 'pengasuh') {
          setPengasuhTtdUrl(finalUrl);
          setTtdToast(
            autoTransparentBg
              ? 'TTD Pengasuh diproses transparan (tanpa background) & tersimpan untuk semua raport.'
              : 'TTD Pengasuh (Mudir Ma’had) tersimpan untuk semua raport.'
          );
        } else {
          setWaliKelasTtd(selectedKelas, finalUrl);
          setTtdToast(
            autoTransparentBg
              ? `TTD Wali Kelas (${selectedKelas}) diproses transparan & tersimpan.`
              : `TTD Wali Kelas (${selectedKelas}) tersimpan.`
          );
        }
        setTimeout(() => setTtdToast(''), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCleanExistingSignature = async (target: 'pengasuh' | 'walikelas') => {
    const src = target === 'pengasuh' ? pengasuhTtdUrl : waliKelasTtdMap[selectedKelas];
    if (!src) return;
    const cleaned = await processSignatureToTransparentPng(src);
    if (target === 'pengasuh') {
      setPengasuhTtdUrl(cleaned);
    } else {
      setWaliKelasTtd(selectedKelas, cleaned);
    }
    setTtdToast('Background putih/abu pada tanda tangan berhasil dihapus menjadi PNG transparan.');
    setTimeout(() => setTtdToast(''), 3500);
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = padCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    isDrawingRef.current = true;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !padCanvasRef.current) return;
    const ctx = padCanvasRef.current.getContext('2d');
    if (!ctx) return;
    const rect = padCanvasRef.current.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const endDraw = () => {
    isDrawingRef.current = false;
  };

  const clearPad = () => {
    const canvas = padCanvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const savePad = async () => {
    if (!padCanvasRef.current || !activePadTarget) return;
    const rawDataUrl = padCanvasRef.current.toDataURL('image/png');
    const trimmedUrl = await processSignatureToTransparentPng(rawDataUrl);
    if (activePadTarget === 'pengasuh') {
      setPengasuhTtdUrl(trimmedUrl);
      setTtdToast('TTD Pengasuh tersimpan (transparan).');
    } else {
      setWaliKelasTtd(selectedKelas, trimmedUrl);
      setTtdToast(`TTD Wali Kelas ${selectedKelas} tersimpan (transparan).`);
    }
    setActivePadTarget(null);
    setTimeout(() => setTtdToast(''), 3000);
  };

  const currentWaliTtd = waliKelasTtdMap[selectedKelas];

  return (
    <div className="space-y-6">
      {ttdToast && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{ttdToast}</span>
        </div>
      )}

      {/* Control Bar (No-print) */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              <span>Raport Resmi F4 RTL (كشف درجات الطلاب)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Format F4 (215 × 330 mm) sesuai berkas resmi Cawu 1 &amp; Cawu 2. Dapat mencetak 1 santri atau PDF 1 kelas sekaligus lengkap dengan TTD Pengasuh &amp; Wali Kelas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PrintOrientationControl recommended="portrait" />
            <button
              type="button"
              onClick={() =>
                triggerReliablePrint({
                  title:
                    printMode === 'kelas'
                      ? `Raport F4 Kelas ${selectedKelas}`
                      : `Raport F4 - ${currentSantri?.nama || ''}`,
                  orientation: printOrientation,
                  paperSize: 'F4',
                  targetElement: raportContainerRef.current,
                })
              }
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

        {/* Auto-Transparent Option Header */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <label className="inline-flex items-center gap-2 font-bold text-emerald-900 cursor-pointer">
            <input
              type="checkbox"
              checked={autoTransparentBg}
              onChange={(e) => setAutoTransparentBg(e.target.checked)}
              className="rounded border-slate-300 text-emerald-700 focus:ring-0"
            />
            <span>Otomatis Hapus Background Putih/Kertas saat Unggah TTD (PNG Transparan)</span>
          </label>
          <span className="text-[11px] text-slate-500">
            Ukuran TTD otomatis diperbesar &amp; dipotong rapi agar tampak menyatu dengan kertas raport.
          </span>
        </div>

        {/* 2-Slot Digital Signature Config: Pengasuh + Wali Kelas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Slot 1: TTD Pengasuh */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-bold text-slate-800">TTD Pengasuh (Mudir Ma&apos;had)</p>
              <p className="text-[11px] text-slate-500">KH. Amin Maizun — Otomatis tampil di semua raport</p>
              {pengasuhTtdUrl && (
                <div className="mt-2 flex flex-wrap items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 w-fit">
                  <img
                    src={pengasuhTtdUrl}
                    alt="TTD Pengasuh"
                    className="h-12 w-auto max-w-[140px] object-contain mix-blend-multiply"
                  />
                  <button
                    type="button"
                    onClick={() => handleCleanExistingSignature('pengasuh')}
                    className="text-emerald-700 text-[11px] font-bold hover:underline"
                    title="Proses ulang menjadi PNG transparan tanpa background"
                  >
                    Transparankan
                  </button>
                  <button
                    type="button"
                    onClick={() => setPengasuhTtdUrl(undefined)}
                    className="text-rose-600 text-[11px] font-bold hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <label className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 text-emerald-700" />
                <span>Unggah</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUploadSignature('pengasuh', e)}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  setActivePadTarget(activePadTarget === 'pengasuh' ? null : 'pengasuh')
                }
                className="px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center gap-1"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Tanda Tangan</span>
              </button>
            </div>
          </div>

          {/* Slot 2: TTD Wali Kelas */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-bold text-slate-800">TTD Wali Kelas ({selectedKelas})</p>
              <p className="text-[11px] text-slate-500">{waliKelas} — Berlaku untuk raport kelas {selectedKelas}</p>
              {currentWaliTtd && (
                <div className="mt-2 flex flex-wrap items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 w-fit">
                  <img
                    src={currentWaliTtd}
                    alt="TTD Wali Kelas"
                    className="h-12 w-auto max-w-[140px] object-contain mix-blend-multiply"
                  />
                  <button
                    type="button"
                    onClick={() => handleCleanExistingSignature('walikelas')}
                    className="text-emerald-700 text-[11px] font-bold hover:underline"
                    title="Proses ulang menjadi PNG transparan tanpa background"
                  >
                    Transparankan
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaliKelasTtd(selectedKelas, undefined)}
                    className="text-rose-600 text-[11px] font-bold hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <label className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 text-emerald-700" />
                <span>Unggah</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUploadSignature('walikelas', e)}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  setActivePadTarget(activePadTarget === 'walikelas' ? null : 'walikelas')
                }
                className="px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center gap-1"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Tanda Tangan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Inline Signature Canvas */}
        {activePadTarget && (
          <div className="p-4 rounded-2xl bg-white border-2 border-emerald-600 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-800">
                Goreskan TTD{' '}
                {activePadTarget === 'pengasuh'
                  ? 'Pengasuh Pondok (KH. Amin Maizun)'
                  : `Wali Kelas (${selectedKelas})`}
                :
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearPad}
                  className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Bersihkan</span>
                </button>
                <button
                  type="button"
                  onClick={savePad}
                  className="px-4 py-1 rounded-lg bg-emerald-800 text-white text-xs font-bold"
                >
                  Simpan TTD
                </button>
              </div>
            </div>
            <canvas
              ref={padCanvasRef}
              width={420}
              height={130}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              className="border border-slate-300 rounded-xl bg-white cursor-crosshair w-full max-w-md"
            />
          </div>
        )}
      </div>

      {/* Printable Raport Sheets */}
      <div ref={raportContainerRef} className="space-y-8 print:space-y-0">
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
            pengasuhTtdUrl={pengasuhTtdUrl}
            waliKelasTtdUrl={currentWaliTtd}
            isLast={idx === targetSantri.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   3. PERINGKAT PARALEL (PER KELAS, ANGKATAN PUTRA/PUTRI, GABUNGAN PER ANGKATAN)
======================================================================== */
export const SubTabPeringkatParalel: React.FC = () => {
  const { santriList, nilaiList, imtihanMaster, mapelList, printOrientation } = useAppStore();
  const peringkatPrintRef = useRef<HTMLDivElement | null>(null);

  const [scope, setScope] = useState<'kelas' | 'angkatan_gender' | 'angkatan_gabungan'>(
    'angkatan_gabungan'
  );
  const [selectedKelas, setSelectedKelas] = useState<string>('2 A PUTRA');
  const [selectedTingkat, setSelectedTingkat] = useState<number>(2);
  const [selectedGender, setSelectedGender] = useState<'L' | 'P'>('L');
  const [search, setSearch] = useState<string>('');

  const uniqueClasses = sortClassesCanonical(Array.from(new Set(santriList.map((s) => s.kelas))));

  const rankedList = useMemo(() => {
    const filtered = santriList.filter((s) => {
      if (scope === 'kelas') return s.kelas === selectedKelas;
      if (scope === 'angkatan_gender') {
        return s.tingkat === selectedTingkat && s.gender === selectedGender;
      }
      // angkatan_gabungan: strictly same Tingkat (1–6), combines Putra + Putri fairly
      return s.tingkat === selectedTingkat;
    });

    const scored = filtered.map((s, idx) => {
      const templates = MAPEL_PER_TINGKAT[s.tingkat] || MAPEL_PER_TINGKAT[1];
      const santriGrades = nilaiList.filter((n) => n.santriId === s.id);
      let totalAvg = 0;

      templates.forEach((subj, mIdx) => {
        const mId = resolveMapelIdForTemplate(subj, s.tingkat, mapelList);
        const rec = santriGrades.find(
          (g) => g.mapelId === mId || g.mapelId.toUpperCase().startsWith(`${subj.kodePrefix}-${s.tingkat}`)
        );
        const ujian = rec ? rec.nilaiAngka : 82 + ((idx * 3 + mIdx + s.tingkat) % 15);
        const harian = rec?.nilaiHarian ?? 80 + ((idx * 5 + mIdx * 2) % 14);
        totalAvg += (ujian + harian) / 2;
      });

      const rata = Number((totalAvg / Math.max(1, templates.length)).toFixed(2));
      const jumlah = Math.round(totalAvg);
      return { santri: s, rata, jumlah };
    });

    scored.sort((a, b) => b.rata - a.rata);
    return scored.map((item, i) => ({ ...item, rank: i + 1 }));
  }, [santriList, nilaiList, mapelList, scope, selectedKelas, selectedTingkat, selectedGender]);

  const displayed = rankedList.filter(
    (r) =>
      !search ||
      r.santri.nama.toLowerCase().includes(search.toLowerCase()) ||
      r.santri.nis.includes(search)
  );

  const scopeTitle =
    scope === 'kelas'
      ? `KELAS ${selectedKelas}`
      : scope === 'angkatan_gender'
      ? `PARALEL ANGKATAN TINGKAT ${selectedTingkat} MDS (${selectedGender === 'L' ? 'PUTRA' : 'PUTRI'})`
      : `PARALEL GABUNGAN ANGKATAN TINGKAT ${selectedTingkat} MDS (PUTRA & PUTRI)`;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Peringkat Prestasi Santri (Setara Per Tingkat / Angkatan)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Pemeringkatan adil per kelas atau paralel per tingkat angkatan (Putra sendiri, Putri sendiri, atau Gabungan Putra &amp; Putri pada Tingkat yang sama).
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PrintOrientationControl recommended="portrait" />
            <button
              type="button"
              onClick={() =>
                triggerReliablePrint({
                  title: `Peringkat Imtihan - ${scopeTitle}`,
                  orientation: printOrientation,
                  paperSize: 'F4',
                  targetElement: peringkatPrintRef.current,
                })
              }
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Peringkat</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap rounded-xl bg-slate-100 p-1 border border-slate-200">
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
              onClick={() => setScope('angkatan_gender')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                scope === 'angkatan_gender'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-slate-600'
              }`}
            >
              Pararel Angkatan (Putra / Putri)
            </button>
            <button
              type="button"
              onClick={() => setScope('angkatan_gabungan')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                scope === 'angkatan_gabungan'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-slate-600'
              }`}
            >
              Gabungan Putra &amp; Putri (Per Tingkat)
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

          {(scope === 'angkatan_gender' || scope === 'angkatan_gabungan') && (
            <select
              value={selectedTingkat}
              onChange={(e) => setSelectedTingkat(parseInt(e.target.value))}
              className="rounded-xl border border-slate-300 px-3 py-1.5 font-bold"
            >
              {[1, 2, 3, 4, 5, 6].map((t) => (
                <option key={t} value={t}>
                  Angkatan / Tingkat {t} MDS
                </option>
              ))}
            </select>
          )}

          {scope === 'angkatan_gender' && (
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value as 'L' | 'P')}
              className="rounded-xl border border-slate-300 px-3 py-1.5 font-bold text-emerald-900"
            >
              <option value="L">Khusus Santri Putra</option>
              <option value="P">Khusus Santri Putri</option>
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

      {/* Ranking Table with Official Kop & Logo Imtihan */}
      <div
        ref={peringkatPrintRef}
        className="rounded-2xl bg-white p-5 sm:p-6 border border-slate-200 shadow-2xs printable-area space-y-4"
      >
        {/* KOP & LOGO RESMI PANITIA IMTIHAN */}
        <div className="flex items-center justify-between gap-4 pb-3 border-b-2 border-slate-900">
          <img
            src="/assets/aistudio/ChatGPT_Image_Nov_6__2025__01_32_08_PM_64f70724.png"
            alt="Logo Panitia Imtihan PP NU Darussalam"
            className="w-16 h-16 object-contain shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/preview__14__3b7f388f.webp';
            }}
          />
          <div className="flex-1 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
              PANITIA IMTIHAN MADRASAH DINIYAH SALAFIYAH
            </p>
            <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 leading-tight">
              PONDOK PESANTREN NU DARUSSALAM KARANGDADAP
            </h3>
            <p className="text-[11px] text-slate-600">
              Karangdadap, Kabupaten Pekalongan, Jawa Tengah · Cawu {imtihanMaster.cawu} T.A.{' '}
              {imtihanMaster.tahunAjaran}
            </p>
          </div>
          <div className="w-16 shrink-0 hidden sm:flex justify-end">
            <img
              src="/assets/aistudio/preview__14__3b7f388f.webp"
              alt="Logo Pondok"
              className="w-14 h-14 object-contain"
            />
          </div>
        </div>

        <div className="text-center">
          <h4 className="font-black text-sm uppercase text-slate-900">
            DAFTAR PERINGKAT JUARA IMTIHAN — {scopeTitle}
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-400 bg-slate-100 text-slate-700 text-left">
                <th className="py-2 px-3 w-20 text-center border border-slate-300">Peringkat</th>
                <th className="py-2 px-3 border border-slate-300">NIS</th>
                <th className="py-2 px-3 border border-slate-300">Nama Lengkap Santri</th>
                <th className="py-2 px-3 border border-slate-300">Putra / Putri</th>
                <th className="py-2 px-3 border border-slate-300">Kelas</th>
                <th className="py-2 px-3 text-right border border-slate-300">Jumlah Nilai</th>
                <th className="py-2 px-3 text-right border border-slate-300">Rata-Rata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-semibold">
              {displayed.slice(0, 80).map((row) => (
                <tr key={row.santri.id} className={row.rank <= 3 ? 'bg-amber-50/50' : 'hover:bg-slate-50'}>
                  <td className="py-2 px-3 text-center border border-slate-200">
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
                  <td className="py-2 px-3 font-mono text-slate-500 border border-slate-200">
                    {row.santri.nis}
                  </td>
                  <td className="py-2 px-3 font-bold text-slate-900 border border-slate-200">
                    {row.santri.nama}
                  </td>
                  <td className="py-2 px-3 border border-slate-200">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.santri.gender === 'L'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {row.santri.gender === 'L' ? 'Putra' : 'Putri'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-700 border border-slate-200">
                    {row.santri.kelas}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums border border-slate-200">
                    {row.jumlah}
                  </td>
                  <td className="py-2 px-3 text-right font-black text-emerald-800 tabular-nums border border-slate-200">
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
