import React, { useMemo, useRef, useState } from 'react';
import { Printer, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../../lib/store.ts';
import { DAFTAR_KELAS_DINIYAH, MAPEL_PER_TINGKAT } from '../../../data/seed/pondokData.ts';
import { nomorUjian, predikat } from '../../../lib/rules.ts';
import { triggerReliablePrint } from '../../../lib/printHelper.ts';
import { PrintOrientationControl } from '../../../components/common/PrintOrientationControl.tsx';

export const BlankoNilaiSubTab: React.FC = () => {
  const { santriList, mapelList, nilaiList, imtihanMaster, printOrientation } = useAppStore();

  const uniqueClasses = useMemo(() => {
    const orderMap = new Map<string, number>(DAFTAR_KELAS_DINIYAH.map((c, i) => [c, i]));
    return Array.from(new Set(santriList.map((s) => s.kelas))).sort((a, b) => {
      const ia = orderMap.get(a) ?? 999;
      const ib = orderMap.get(b) ?? 999;
      return ia !== ib ? ia - ib : a.localeCompare(b);
    });
  }, [santriList]);

  const [selectedKelas, setSelectedKelas] = useState<string>(uniqueClasses[0] || '2 A PUTRA');
  const currentTingkat = parseInt(selectedKelas.charAt(0)) || 1;
  const tingkatMapels = useMemo(
    () => MAPEL_PER_TINGKAT[currentTingkat] || MAPEL_PER_TINGKAT[1],
    [currentTingkat]
  );

  const [selectedKodePrefix, setSelectedKodePrefix] = useState<string>(
    tingkatMapels[0]?.kodePrefix || 'FQH'
  );
  const [cawu, setCawu] = useState<'1' | '2'>(imtihanMaster.cawu || '1');
  const [fillMode, setFillMode] = useState<'kosong' | 'terisi'>('kosong');
  const [guruPengampu, setGuruPengampu] = useState<string>('Ust. Abdurrohman');
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const activeSubject =
    tingkatMapels.find((m) => m.kodePrefix === selectedKodePrefix) || tingkatMapels[0];

  const resolvedMapel = useMemo(() => {
    return (
      mapelList.find(
        (m) =>
          m.tingkat === currentTingkat &&
          (m.kode.toUpperCase().startsWith(activeSubject?.kodePrefix || '') ||
            m.nama.toLowerCase().includes((activeSubject?.nama || '').toLowerCase().split(' ')[0]))
      ) || mapelList.find((m) => m.tingkat === currentTingkat)
    );
  }, [mapelList, currentTingkat, activeSubject]);

  const kelasSantri = useMemo(
    () => santriList.filter((s) => s.kelas === selectedKelas),
    [santriList, selectedKelas]
  );

  const handleKelasChange = (nextKelas: string) => {
    setSelectedKelas(nextKelas);
    const nextTkt = parseInt(nextKelas.charAt(0)) || 1;
    const first = (MAPEL_PER_TINGKAT[nextTkt] || MAPEL_PER_TINGKAT[1])[0];
    if (first) setSelectedKodePrefix(first.kodePrefix);
    const foundM = mapelList.find((m) => m.tingkat === nextTkt);
    if (foundM?.guruPengampu) setGuruPengampu(foundM.guruPengampu);
  };

  const handleMapelChange = (prefix: string) => {
    setSelectedKodePrefix(prefix);
    const subj = tingkatMapels.find((t) => t.kodePrefix === prefix);
    const foundM = mapelList.find(
      (m) =>
        m.tingkat === currentTingkat &&
        (m.kode.toUpperCase().startsWith(prefix) ||
          m.nama.toLowerCase().includes((subj?.nama || '').toLowerCase().split(' ')[0]))
    );
    if (foundM?.guruPengampu) setGuruPengampu(foundM.guruPengampu);
  };

  const handlePrint = () => {
    triggerReliablePrint({
      title: `Blanko Nilai ${activeSubject?.nama || ''} - Kelas ${selectedKelas}`,
      orientation: printOrientation,
      paperSize: 'F4',
      targetElement: sheetRef.current,
    });
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Cetak Blanko Nilai Santri (Lembar Penilaian Guru Mapel)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Cetak blanko kosong untuk tulis tangan guru penguji atau rekap nilai tersimpan lengkap dengan kolom Harian, Lisan, Tulis/Imtihan, &amp; Paraf.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <PrintOrientationControl recommended="portrait" />
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Blanko Nilai (F4)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Kelas Diniyah</label>
            <select
              value={selectedKelas}
              onChange={(e) => handleKelasChange(e.target.value)}
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
            <label className="block font-bold text-slate-700 mb-1">Mapel &amp; Kitab</label>
            <select
              value={activeSubject?.kodePrefix || ''}
              onChange={(e) => handleMapelChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
            >
              {tingkatMapels.map((m) => (
                <option key={m.kodePrefix} value={m.kodePrefix}>
                  {m.nama} — {m.kitab}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Guru Pengampu</label>
            <input
              type="text"
              value={guruPengampu}
              onChange={(e) => setGuruPengampu(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Cawu / Semester</label>
            <select
              value={cawu}
              onChange={(e) => setCawu(e.target.value as '1' | '2')}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
            >
              <option value="1">Cawu 1 (Gasal)</option>
              <option value="2">Cawu 2 (Genap)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mode Isi Nilai</label>
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setFillMode('kosong')}
                className={`flex-1 py-1 rounded-lg font-bold text-xs transition ${
                  fillMode === 'kosong' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Blanko Kosong
              </button>
              <button
                type="button"
                onClick={() => setFillMode('terisi')}
                className={`flex-1 py-1 rounded-lg font-bold text-xs transition ${
                  fillMode === 'terisi' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Nilai Terisi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Sheet */}
      <div
        ref={sheetRef}
        className="rounded-3xl bg-white p-6 sm:p-8 border-2 border-slate-300 shadow-2xs space-y-5 printable-area max-w-[215mm] mx-auto text-black"
      >
        {/* Official Kop Panitia Imtihan (Visible Both Screen & Print) */}
        <div className="flex items-center justify-between gap-4 pb-3 border-b-2 border-black">
          <img
            src="/assets/aistudio/ChatGPT_Image_Nov_6__2025__01_32_08_PM_64f70724.png"
            alt="Logo Panitia Imtihan"
            className="w-16 h-16 object-contain shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/preview__14__3b7f388f.webp';
            }}
          />
          <div className="flex-1 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              PANITIA PELAKSANA IMTIHAN MADRASAH DINIYAH SALAFIYAH
            </p>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wide">
              PONDOK PESANTREN NU DARUSSALAM KARANGDADAP
            </h2>
            <p className="text-[11px] text-slate-700">
              Karangdadap, Kabupaten Pekalongan, Jawa Tengah · Tahun Ajaran {imtihanMaster.tahunAjaran}
            </p>
          </div>
          <img
            src="/assets/aistudio/preview__14__3b7f388f.webp"
            alt="Logo Pondok"
            className="w-14 h-14 object-contain shrink-0"
          />
        </div>

        {/* Document Title & Metadata */}
        <div className="text-center space-y-1">
          <h3 className="text-sm sm:text-base font-black uppercase underline underline-offset-4">
            BLANKO DAFTAR NILAI SANTRI IMTIHAN CAWU {cawu}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 border border-slate-400 rounded-lg p-3 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px]">Kelas Diniyah</span>
            <strong className="text-slate-900">{selectedKelas}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Mata Pelajaran</span>
            <strong className="text-slate-900">{activeSubject?.nama}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Kitab Pegangan</span>
            <strong className="text-slate-900">{activeSubject?.kitab}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Guru Pengampu / Penguji</span>
            <strong className="text-slate-900">{guruPengampu}</strong>
          </div>
        </div>

        {/* Score Table */}
        <table className="w-full text-xs border-collapse border-2 border-black">
          <thead>
            <tr className="bg-emerald-900 text-white font-bold text-center">
              <th className="border border-black py-2 px-1.5 w-9">NO</th>
              <th className="border border-black py-2 px-2 w-24">NO. IMT</th>
              <th className="border border-black py-2 px-2 w-20">NIS</th>
              <th className="border border-black py-2 px-2.5 text-left">NAMA LENGKAP SANTRI</th>
              <th className="border border-black py-2 px-1.5 w-16">HARIAN</th>
              <th className="border border-black py-2 px-1.5 w-16">LISAN</th>
              <th className="border border-black py-2 px-1.5 w-16">IMTIHAN</th>
              <th className="border border-black py-2 px-1.5 w-16">RATA2</th>
              <th className="border border-black py-2 px-2 w-20">PREDIKAT</th>
              <th className="border border-black py-2 px-2 w-16">KET.</th>
            </tr>
          </thead>
          <tbody>
            {kelasSantri.map((s, idx) => {
              const rec =
                fillMode === 'terisi'
                  ? nilaiList.find(
                      (n) =>
                        n.santriId === s.id &&
                        (n.mapelId === resolvedMapel?.id ||
                          n.mapelId.toUpperCase().startsWith(`${selectedKodePrefix}-${currentTingkat}`))
                    )
                  : undefined;

              const rata = rec
                ? Number(
                    (
                      ((rec.nilaiHarian ?? rec.nilaiAngka) +
                        (rec.nilaiLisan ?? rec.nilaiAngka) +
                        rec.nilaiAngka) /
                      3
                    ).toFixed(1)
                  )
                : null;

              return (
                <tr key={s.id} className="even:bg-slate-50/60">
                  <td className="border border-black py-2 px-1.5 text-center font-bold tabular-nums">
                    {idx + 1}
                  </td>
                  <td className="border border-black py-2 px-2 text-center font-mono text-[11px] tabular-nums">
                    {nomorUjian(s.tingkat, 'MD', idx + 1)}
                  </td>
                  <td className="border border-black py-2 px-2 text-center font-mono text-[11px] tabular-nums">
                    {s.nis}
                  </td>
                  <td className="border border-black py-2 px-2.5 font-bold uppercase text-slate-900">
                    {s.nama}
                  </td>
                  <td className="border border-black py-2 px-1.5 text-center tabular-nums font-semibold">
                    {rec ? rec.nilaiHarian ?? '-' : ''}
                  </td>
                  <td className="border border-black py-2 px-1.5 text-center tabular-nums font-semibold">
                    {rec ? rec.nilaiLisan ?? '-' : ''}
                  </td>
                  <td className="border border-black py-2 px-1.5 text-center tabular-nums font-bold">
                    {rec ? rec.nilaiAngka : ''}
                  </td>
                  <td className="border border-black py-2 px-1.5 text-center tabular-nums font-black">
                    {rata !== null ? rata : ''}
                  </td>
                  <td className="border border-black py-2 px-2 text-center text-[11px] font-bold font-arabic">
                    {rata !== null ? predikat(rata).predikatArab : ''}
                  </td>
                  <td className="border border-black py-2 px-2 text-center text-[10.5px]">
                    {rata !== null ? (rata >= 65 ? 'Tuntas' : 'Remidi') : ''}
                  </td>
                </tr>
              );
            })}
            {kelasSantri.length === 0 && (
              <tr>
                <td colSpan={10} className="border border-black py-8 text-center text-slate-500">
                  Belum ada data santri terdaftar di kelas {selectedKelas}.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Signature Block */}
        <div className="pt-4 grid grid-cols-3 gap-6 text-center text-xs">
          <div className="space-y-12">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold">Ketua Panitia Imtihan</p>
            </div>
            <div>
              <p className="font-bold underline">{imtihanMaster.ketuaImtihanNama}</p>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <p>Diperiksa,</p>
              <p className="font-bold">Wali Kelas {selectedKelas}</p>
            </div>
            <div>
              <p className="font-bold underline">(........................................)</p>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <p>Karangdadap, ........................ 2026</p>
              <p className="font-bold">Guru Pengampu / Penguji</p>
            </div>
            <div>
              <p className="font-bold underline">{guruPengampu}</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700 no-print" />
            Panitia Imtihan Madrasah Diniyah Salafiyah PP NU Darussalam Karangdadap
          </span>
          <span className="tabular-nums">Total Peserta: {kelasSantri.length} Santri</span>
        </div>
      </div>
    </div>
  );
};
