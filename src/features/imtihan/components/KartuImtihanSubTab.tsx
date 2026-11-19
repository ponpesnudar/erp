import React, { useState, useRef } from 'react';
import {
  Printer,
  CreditCard,
  Upload,
  PenTool,
  Eraser,
  CheckCircle2,
  FileText,
  Users,
} from 'lucide-react';
import { useAppStore } from '../../../lib/store.ts';
import { nomorUjian } from '../../../lib/rules.ts';
import type { SantriRecord, JadwalMaarifanItem } from '../../../data/seed/pondokData.ts';

function getMapelByTingkat(row: JadwalMaarifanItem, tingkat: number): string {
  switch (tingkat) {
    case 1:
      return row.kelas1;
    case 2:
      return row.kelas2;
    case 3:
      return row.kelas3;
    case 4:
      return row.kelas4;
    case 5:
      return row.kelas5;
    case 6:
      return row.kelas6;
    default:
      return row.kelas1;
  }
}

export const KartuImtihanSubTab: React.FC = () => {
  const {
    santriList,
    ruangUjianList,
    jadwalMaarifan,
    imtihanMaster,
    updateImtihanMaster,
  } = useAppStore();

  const [printMode, setPrintMode] = useState<'single' | 'ruang' | 'kelas'>('single');
  const [selectedSantriId, setSelectedSantriId] = useState(santriList[0]?.id || 's-001');
  const [selectedRuangId, setSelectedRuangId] = useState(ruangUjianList[0]?.id || 'ruang-1');
  const [selectedKelas, setSelectedKelas] = useState('2 A PUTRA');
  const [paperSize, setPaperSize] = useState<'F4' | 'A4'>('F4');
  const [ketuaNameInput, setKetuaNameInput] = useState(
    imtihanMaster.ketuaImtihanNama || 'Ust. Nidhomul Muna Lana'
  );
  const [showSignPad, setShowSignPad] = useState(false);
  const [toast, setToast] = useState('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  const uniqueClasses = Array.from(new Set(santriList.map((s) => s.kelas))).sort((a, b) => a.localeCompare(b));

  // Resolve target participants for display/print
  const getTargetSantriList = (): { santri: SantriRecord; noImt: string; ruangLabel: string }[] => {
    const susulanSet = new Set(imtihanMaster.pesertaSusulanIds || []);
    const activeAll = santriList.filter((s) => !susulanSet.has(s.id));

    if (printMode === 'single') {
      const idx = activeAll.findIndex((s) => s.id === selectedSantriId);
      const target = activeAll[idx >= 0 ? idx : 0];
      if (!target) return [];
      const room = ruangUjianList.find((r) => r.kursiList.some((k) => k.santri?.id === target.id));
      return [
        {
          santri: target,
          noImt: nomorUjian(target.tingkat, 'MD', idx >= 0 ? idx + 1 : 1),
          ruangLabel: room ? `${room.kode} (${room.nama})` : 'R1 (Ruang 01 Putra)',
        },
      ];
    }

    if (printMode === 'ruang') {
      const room = ruangUjianList.find((r) => r.id === selectedRuangId) || ruangUjianList[0];
      if (!room) return [];
      return room.kursiList
        .filter((k) => k.santri)
        .map((k, idx) => {
          const full = santriList.find((s) => s.id === k.santri!.id);
          return {
            santri: full || {
              id: k.santri!.id,
              nis: k.santri!.nis,
              nama: k.santri!.nama,
              gender: k.santri!.gender,
              kelas: k.santri!.kelas,
              tingkat: k.santri!.tingkat,
              kamar: '-',
              namaWali: '-',
              hpWali: '-',
              alamatAsal: '-',
              saldoKartu: 0,
              limitHarian: 0,
              statusKartu: 'Aktif',
            },
            noImt: k.santri!.nomorUjian || nomorUjian(k.santri!.tingkat, 'MD', idx + 1),
            ruangLabel: `${room.kode} (${room.nama})`,
          };
        });
    }

    // Per kelas
    return activeAll
      .filter((s) => s.kelas === selectedKelas)
      .map((s, idx) => {
        const room = ruangUjianList.find((r) => r.kursiList.some((k) => k.santri?.id === s.id));
        return {
          santri: s,
          noImt: nomorUjian(s.tingkat, 'MD', idx + 1),
          ruangLabel: room ? `${room.kode} (${room.nama})` : '-',
        };
      });
  };

  const targetCards = getTargetSantriList();

  const handleUploadSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateImtihanMaster({ ketuaImtihanTtdUrl: reader.result });
        setToast('Gambar tanda tangan Ketua Imtihan berhasil diunggah.');
        setTimeout(() => setToast(''), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Canvas drawing handlers
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    isDrawingRef.current = true;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const endDraw = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvasSignature = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    updateImtihanMaster({
      ketuaImtihanNama: ketuaNameInput,
      ketuaImtihanTtdUrl: dataUrl,
    });
    setShowSignPad(false);
    setToast('Tanda tangan Ketua Imtihan disimpan.');
    setTimeout(() => setToast(''), 3000);
  };

  const cawuTitleArab =
    imtihanMaster.cawu === '2'
      ? 'الإختبار النهائي لنصف العام الثاني'
      : 'الإختبار النهائي لنصف العام الأول';

  const activeJadwal = jadwalMaarifan.filter((j) => {
    const firstTingkat = targetCards[0]?.santri.tingkat || 2;
    return getMapelByTingkat(j, firstTingkat) !== '-';
  });

  return (
    <div className="space-y-6">
      {toast && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{toast}</span>
        </div>
      )}

      {/* Control Panel (No-Print) */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-700" />
              <span>Kartu Peserta Imtihan (Latar Putih Siap Cetak Kertas Warna)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Rekomendasi layout cetak: <strong>Kertas F4 (6 kartu / lembar)</strong> atau <strong>Kertas A4 (4 kartu / lembar)</strong> — hemat kertas & presisi potong.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition shadow-xs flex items-center gap-2 shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak {targetCards.length} Kartu ({paperSize})</span>
          </button>
        </div>

        {/* Mode, Target & Paper Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Mode Cetak Kartu:</label>
            <select
              value={printMode}
              onChange={(e) => setPrintMode(e.target.value as 'single' | 'ruang' | 'kelas')}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
            >
              <option value="single">1 Peserta (Pratinjau / Susulan)</option>
              <option value="ruang">Massal 1 Ruang Ujian (R1 - R7)</option>
              <option value="kelas">Massal 1 Kelas Diniyah</option>
            </select>
          </div>

          {printMode === 'single' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pilih Peserta Ujian:</label>
              <select
                value={selectedSantriId}
                onChange={(e) => setSelectedSantriId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
              >
                {santriList.map((s, idx) => (
                  <option key={s.id} value={s.id}>
                    {nomorUjian(s.tingkat, 'MD', idx + 1)} - {s.nama} ({s.kelas})
                  </option>
                ))}
              </select>
            </div>
          )}

          {printMode === 'ruang' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pilih Ruang Ujian:</label>
              <select
                value={selectedRuangId}
                onChange={(e) => setSelectedRuangId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
              >
                {ruangUjianList.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.kode} - {r.nama} ({r.kursiList.filter((k) => k.santri).length} peserta)
                  </option>
                ))}
              </select>
            </div>
          )}

          {printMode === 'kelas' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pilih Kelas:</label>
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
              >
                {uniqueClasses.map((kls) => (
                  <option key={kls} value={kls}>
                    {kls}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Rekomendasi Kertas:</label>
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setPaperSize('F4')}
                className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition ${
                  paperSize === 'F4' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                F4 (6 Kartu/Hal)
              </button>
              <button
                type="button"
                onClick={() => setPaperSize('A4')}
                className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition ${
                  paperSize === 'A4' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                A4 (4 Kartu/Hal)
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Ketua Imtihan:</label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={ketuaNameInput}
                onChange={(e) => {
                  setKetuaNameInput(e.target.value);
                  updateImtihanMaster({ ketuaImtihanNama: e.target.value });
                }}
                className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* TTD Ketua Imtihan Config */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-700">Tanda Tangan Ketua Imtihan:</span>
            {imtihanMaster.ketuaImtihanTtdUrl ? (
              <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                <img
                  src={imtihanMaster.ketuaImtihanTtdUrl}
                  alt="TTD Ketua"
                  className="h-8 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => updateImtihanMaster({ ketuaImtihanTtdUrl: undefined })}
                  className="text-rose-600 text-[11px] font-bold hover:underline"
                >
                  Hapus TTD
                </button>
              </div>
            ) : (
              <span className="text-slate-400 italic">Belum ada TTD digital (gunakan gambar / tanda tangan langsung)</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 cursor-pointer flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-emerald-700" />
              <span>Unggah Gambar TTD</span>
              <input type="file" accept="image/*" onChange={handleUploadSignature} className="hidden" />
            </label>
            <button
              type="button"
              onClick={() => setShowSignPad(!showSignPad)}
              className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center gap-1.5"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Gambar TTD Langsung</span>
            </button>
          </div>
        </div>

        {/* Interactive Canvas Pad */}
        {showSignPad && (
          <div className="p-4 rounded-2xl bg-white border-2 border-emerald-600 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Goreskan Tanda Tangan Ketua Panitia Imtihan di kotak putih di bawah:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Bersihkan</span>
                </button>
                <button
                  type="button"
                  onClick={saveCanvasSignature}
                  className="px-4 py-1 rounded-lg bg-emerald-800 text-white text-xs font-bold"
                >
                  Simpan TTD
                </button>
              </div>
            </div>
            <canvas
              ref={canvasRef}
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

      {/* PRINTABLE CARDS LIST */}
      <div className="space-y-6 printable-card-sheet">
        {targetCards.map(({ santri, noImt, ruangLabel }, cardIdx) => {
          const jadwalSantri = jadwalMaarifan.filter((j) => getMapelByTingkat(j, santri.tingkat) !== '-');

          return (
            <div
              key={santri.id}
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto page-break-inside-avoid ${
                (paperSize === 'A4' && (cardIdx + 1) % 2 === 0) ||
                (paperSize === 'F4' && (cardIdx + 1) % 3 === 0)
                  ? 'page-break-after'
                  : ''
              }`}
            >
              {/* SISI DEPAN KARTU (BACKGROUND PUTIH BERSIH UNTUK KERTAS WARNA) */}
              <div className="bg-white border-[3px] border-[#1E3A8A] rounded-md p-4 font-sans text-[#1E3A8A] flex flex-col justify-between min-h-[250px]">
                {/* Kop Kartu Arab + Stempel Logo Resmi */}
                <div className="flex items-center justify-between border-b-2 border-[#1E3A8A] pb-2.5 gap-3">
                  <div className="text-right flex-1 font-arabic" dir="rtl">
                    <h3 className="text-base font-bold leading-tight">{cawuTitleArab}</h3>
                    <h4 className="text-xs font-bold leading-snug">
                      بالمعهد الإسلامي النهضي دار السلام كاراغداداف فكالوغان
                    </h4>
                    <p className="text-[11px] font-bold">للعام الدراسي {imtihanMaster.tahunHijriyahArab}</p>
                  </div>

                  <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                    <img
                      src="/assets/aistudio/ChatGPT_Image_Nov_6__2025__01_32_08_PM_64f70724.png"
                      alt="Logo Stempel Imtihan"
                      className="w-15 h-15 object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/preview__14__3b7f388f.webp';
                      }}
                    />
                  </div>
                </div>

                {/* Biodata Peserta */}
                <div className="space-y-1 text-xs font-bold my-2.5">
                  <div className="flex">
                    <span className="w-20 shrink-0">No. IMT</span>
                    <span>: {noImt}</span>
                  </div>
                  <div className="flex">
                    <span className="w-20 shrink-0">Nama</span>
                    <span className="uppercase truncate">: {santri.nama}</span>
                  </div>
                  <div className="flex">
                    <span className="w-20 shrink-0">Kelas</span>
                    <span>: {santri.kelas}</span>
                  </div>
                  <div className="flex">
                    <span className="w-20 shrink-0">Ruang</span>
                    <span>: {ruangLabel}</span>
                  </div>
                </div>

                {/* Tanda Tangan */}
                <div className="pt-2 border-t border-[#1E3A8A]/40 flex items-end justify-between text-[11px]">
                  <div className="text-center w-36">
                    <p className="font-semibold mb-9">Peserta</p>
                    <p className="font-semibold">(...............................)</p>
                  </div>

                  <div className="text-center w-44">
                    <p className="font-semibold mb-1">Ketua Imtihan</p>
                    <div className="h-10 flex items-center justify-center">
                      {imtihanMaster.ketuaImtihanTtdUrl ? (
                        <img
                          src={imtihanMaster.ketuaImtihanTtdUrl}
                          alt="TTD Ketua Imtihan"
                          className="max-h-10 w-auto object-contain"
                        />
                      ) : (
                        <div className="h-8" />
                      )}
                    </div>
                    <p className="font-bold border-t border-[#1E3A8A]/40 pt-0.5">
                      {imtihanMaster.ketuaImtihanNama}
                    </p>
                  </div>
                </div>
              </div>

              {/* SISI BELAKANG KARTU (JADWAL PARAF PENGAWAS SINKRON MA'ARIFAN) */}
              <div className="bg-white border-[3px] border-[#1E3A8A] rounded-md p-4 font-sans text-[#1E3A8A] flex flex-col justify-between min-h-[250px]">
                <div className="text-center border-b-2 border-[#1E3A8A] pb-1.5 mb-2">
                  <h3 className="font-extrabold text-xs tracking-wider uppercase">
                    PONDOK PESANTREN NU DARUSSALAM PEKALONGAN
                  </h3>
                </div>

                <table className="w-full border-2 border-[#1E3A8A] border-collapse text-[10px] text-center flex-1">
                  <thead>
                    <tr className="border-b-2 border-[#1E3A8A] font-bold">
                      <th className="border-r border-[#1E3A8A] py-1 px-1">Hari / Tanggal</th>
                      <th className="border-r border-[#1E3A8A] py-1 px-1">Kelas {santri.tingkat}</th>
                      <th className="border-r border-[#1E3A8A] py-1 px-1 w-8">Jam</th>
                      <th className="py-1 px-1" colSpan={2}>Paraf Pengawas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jadwalSantri.slice(0, 8).map((row, rIdx) => {
                      const mapelName = getMapelByTingkat(row, santri.tingkat);
                      const parafNo1 = rIdx % 2 === 0 ? rIdx + 1 : '';
                      const parafNo2 = rIdx % 2 === 0 ? rIdx + 2 : '';
                      return (
                        <tr key={row.id} className="border-b border-[#1E3A8A]">
                          <td className="border-r border-[#1E3A8A] py-0.5 px-1 font-bold leading-tight">
                            {row.hari}
                            {row.tanggalUjian && (
                              <>
                                <br />
                                <span className="text-[9px] font-normal">{row.tanggalUjian}</span>
                              </>
                            )}
                          </td>
                          <td className="border-r border-[#1E3A8A] py-0.5 px-1 font-semibold">{mapelName}</td>
                          <td className="border-r border-[#1E3A8A] py-0.5 px-1 font-bold">{row.jamKe}</td>
                          <td className="border-r border-[#1E3A8A] py-0.5 px-1 w-10 font-bold text-left align-top text-[9px]">
                            {parafNo1}
                          </td>
                          <td className="py-0.5 px-1 w-10 font-bold text-left align-top text-[9px]">
                            {parafNo2}
                          </td>
                        </tr>
                      );
                    })}
                    {jadwalSantri.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-4 text-slate-400">
                          Belum ada jadwal terkonfigurasi
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
