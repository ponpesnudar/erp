import React, { useRef, useState } from 'react';
import { Printer } from 'lucide-react';
import type { RomawiSection, PilihanGandaItem } from '../../../lib/store.ts';
import { triggerReliablePrint } from '../../../lib/printHelper.ts';

export interface SoalItem {
  nomor: string | number;
  pertanyaanArab: string;
}

export interface TemplateBlankoImtihanProps {
  /** Nama mata pelajaran tulisan Arab (contoh: الفقه) */
  mapelArab?: string;
  /** Nama mata pelajaran tulisan Latin */
  mapelLatin?: string;
  /** Kelas/Tingkat dalam tulisan Arab atau Latin (contoh: الأول للبنين (أ / ب)*) */
  kelas?: string;
  /** Nama guru pengampu soal dalam bahasa Arab (contoh: عبد الرحمن) */
  guruPengampu?: string;
  /** Semester imtihan (gasal atau genap) */
  semester?: 'gasal' | 'genap' | string;
  /** Tahun ajaran Masehi / Hijriyah */
  tahunAjaran?: string;
  /** Nama lembaga dalam teks Arab */
  namaLembagaArab?: string;
  /** Lokasi lembaga dalam teks Pegon/Arab */
  lokasiArab?: string;
  /** Mode tampilan: 'blanko' (garis putus-putus kosong untuk ujian tulis santri) atau 'terisi' (simulasi terisi) */
  mode?: 'blanko' | 'terisi';
  /** Nama santri jika mode 'terisi' */
  santriNama?: string;
  /** Nomor absen/كشف الحضور jika mode 'terisi' */
  noAbsen?: string;
  /** Tanggal pelaksanaan jika mode 'terisi' */
  tanggal?: string;
  /** Path logo resmi pesantren di kanan atas */
  logoUrl?: string;
  /** Tampilkan petunjuk standar ujian: أجب هذه الأسئلة بإجابة صحيحة ! */
  showInstruction?: boolean;
  /** Teks kalimat petunjuk */
  instructionText?: string;
  /** Daftar butir soal ujian (Arab / Pegon) */
  soalList?: SoalItem[];
  /** Opsional bagian Romawi Essay multi-bagian */
  romawiSections?: RomawiSection[];
  /** Opsional butir Pilihan Ganda */
  pilihanGandaList?: PilihanGandaItem[];
  /** Ukuran kertas cetak: F4 / Folio atau A4 */
  paperSize?: 'F4' | 'A4';
  /** Tampilkan toolbar kontrol di atas lembar soal (pemilih mode, ukuran kertas, tombol cetak) */
  showControls?: boolean;
  /** ClassName styling tambahan */
  className?: string;
}

const DEFAULT_SOAL_LIST: SoalItem[] = [
  { nomor: '٠١', pertanyaanArab: 'أدا بَرافا ماچام- ماچام أَيْر يَاغ بوليه دي كُونَاكان أُونْتُوك برْسُوچِي ؟ سبُوتْكَان أفا سَاجَا !' },
  { nomor: '٠٢', pertanyaanArab: 'كُولِيتْ- كُولِيت بَاغْكَاي بيناتَاغ مَنْجَادِي سُوچِي جِيكَا سُودَاه دي سَامَاك، بكايمَانَا چَارا مِيَامَاك كُولِيت تَرْسِبُوت ؟' },
  { nomor: '٠٣', pertanyaanArab: 'مماكَاي سِيوَاك سَاغَات دي سُنَّة كَان سكالي فادا ٣ (تِيكَا) هَال، سبُوتْكَان أفا سَاجَا !' },
  { nomor: '٠٤', pertanyaanArab: 'فَرْضُنْيَا وضُوء ادا بَرافَا ؟ سبُوتْكَان أفا سَاجَا !' },
  { nomor: '٠٥', pertanyaanArab: 'سُنَّة- سُنَّةْنْيَا وضُوء ادا بَرافَا ؟ سبُوتْكَان ٥ (لِيمَا) سَاجَا !' },
];

/**
 * Komponen TemplateBlankoImtihan
 * Sesuai Lampiran E:
 * - Logo resmi pondok di kanan atas
 * - Judul kaligrafi Arab (font-arabic, RTL)
 * - Kotak nilai (النتيجة :) di kiri atas
 * - Tabel identitas ujian flexbox RTL dengan baris bertitik-titik (border-bottom: 1px dotted)
 * - Nama guru pengampu dalam tulisan Arab
 * - Hanya merender butir soal yang dikirimkan (tanpa duplikasi hardcode di bawah)
 */
export const TemplateBlankoImtihan: React.FC<TemplateBlankoImtihanProps> = ({
  mapelArab = 'الفقه',
  mapelLatin = 'Fiqih Mabadi Fiqhiyyah',
  kelas = 'الأول للبنين (أ / ب)*',
  guruPengampu = 'عبد الرحمن',
  semester = 'gasal',
  tahunAjaran = '٢٠٢٦ - ٢٠٢٧ م',
  namaLembagaArab = 'بالمعهد الإسلامي النهضي دار السلام',
  lokasiArab = 'كاراغداداف فكالوغان',
  mode = 'blanko',
  santriNama = '',
  noAbsen = '',
  tanggal = '',
  logoUrl = '/assets/aistudio/ChatGPT_Image_Nov_6__2025__01_32_08_PM_64f70724.png',
  showInstruction = true,
  instructionText = 'أجب هذه الأسئلة بإجابة صحيحة !',
  soalList = DEFAULT_SOAL_LIST,
  romawiSections,
  pilihanGandaList,
  paperSize = 'F4',
  showControls = false,
  className = '',
}) => {
  const [internalMode, setInternalMode] = useState<'blanko' | 'terisi'>(mode);
  const [internalPaperSize, setInternalPaperSize] = useState<'F4' | 'A4'>(paperSize);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const effectiveMode = showControls ? internalMode : mode;
  const effectivePaper = showControls ? internalPaperSize : paperSize;

  const judulSemester =
    semester === 'genap' || semester === 'ثاني'
      ? 'الاختبار النهائي لنصف العام الثاني'
      : 'الاختبار النهائي لنصف العام الأول';

  const paperWidthClass = effectivePaper === 'A4' ? 'max-w-[210mm]' : 'max-w-[215mm]';
  const paperMinHeightClass = effectivePaper === 'A4' ? 'min-h-[297mm]' : 'min-h-[330mm]';

  return (
    <div className={`space-y-4 ${className}`}>
      {showControls && (
        <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Tampilan Mode:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setInternalMode('blanko')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  internalMode === 'blanko'
                    ? 'bg-white text-emerald-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Blanko Tulis Tangan
              </button>
              <button
                type="button"
                onClick={() => setInternalMode('terisi')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  internalMode === 'terisi'
                    ? 'bg-white text-emerald-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pratinjau Terisi
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setInternalPaperSize('F4')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  internalPaperSize === 'F4' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                F4 / Folio
              </button>
              <button
                type="button"
                onClick={() => setInternalPaperSize('A4')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  internalPaperSize === 'A4' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                A4
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                triggerReliablePrint({
                  title: `Blanko Soal ${mapelLatin} - ${kelas}`,
                  orientation: 'portrait',
                  paperSize: effectivePaper,
                  targetElement: sheetRef.current,
                })
              }
              className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition shadow-xs flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Blanko</span>
            </button>
          </div>
        </div>
      )}

      {/* LEMBAR BLANKO SOAL RESMI */}
      <div
        ref={sheetRef}
        className={`bg-white border-2 border-slate-900 p-6 sm:p-10 print:p-2 print:border-0 print:shadow-none mx-auto shadow-2xl font-serif text-black printable-area ${paperWidthClass} ${paperMinHeightClass} print:min-h-0 flex flex-col justify-between`}
      >
        <div>
          {/* KOP SURAT UTAMA */}
          <div className="flex items-start justify-between gap-4 pb-2.5">
            {/* Kotak Nilai (Kiri Atas) */}
            <div className="w-24 sm:w-28 shrink-0 border-2 border-black bg-white flex flex-col justify-between h-[96px] sm:h-[105px] p-1.5 text-center">
              <div className="border-b border-black pb-1">
                <span className="font-arabic font-bold text-xs sm:text-sm tracking-wide text-black block" dir="rtl">
                  النتيجة :
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-[10px] text-slate-300 font-sans italic select-none">(nilai)</span>
              </div>
            </div>

            {/* Judul Kaligrafi Arab (Tengah) */}
            <div className="flex-1 text-center space-y-1 sm:space-y-1.5 font-arabic px-2" dir="rtl">
              <h2 className="text-xl sm:text-2xl md:text-[26px] font-bold text-black tracking-normal leading-tight font-arabic">
                {judulSemester}
              </h2>
              <h3 className="text-base sm:text-lg md:text-[20px] font-bold text-black leading-snug font-arabic">
                {namaLembagaArab} {lokasiArab}
              </h3>
              <p className="text-sm sm:text-base font-bold text-black tracking-wide leading-tight font-arabic">
                للعام الدراسي {tahunAjaran}
              </p>
            </div>

            {/* Logo Pondok Pesantren (Kanan Atas) */}
            <div className="w-24 sm:w-28 shrink-0 flex justify-end items-start pt-0.5">
              <img
                src={logoUrl}
                alt="Logo Pondok Pesantren NU Darussalam"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/preview__14__3b7f388f.webp';
                }}
              />
            </div>
          </div>

          {/* TABEL IDENTITAS UJIAN (FLEXBOX RTL + GARIS PUTUS-PUTUS) */}
          <div className="border-2 border-black bg-white my-3 overflow-hidden" dir="rtl">
            <div className="flex flex-col md:flex-row divide-y-2 md:divide-y-0 md:divide-x-2 md:divide-x-reverse divide-black text-black">
              {/* KOLOM KANAN: Mapel, Kelas, Nama Guru (Arab) */}
              <div className="flex-1 p-2 sm:p-2.5 flex flex-col gap-2 font-arabic text-right bg-white">
                <div className="flex items-center justify-start gap-2 text-sm sm:text-base font-bold">
                  <span className="w-24 shrink-0 text-black font-arabic">المادة :</span>
                  <span className="font-semibold text-black flex-1 font-arabic">
                    {mapelArab}
                    {mapelLatin && (
                      <span className="text-xs text-slate-600 font-sans font-normal mr-2">
                        ({mapelLatin})
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-start gap-2 text-sm sm:text-base font-bold">
                  <span className="w-24 shrink-0 text-black font-arabic">الفصل :</span>
                  <span className="font-semibold text-black flex-1 font-arabic">{kelas}</span>
                </div>

                <div className="flex items-center justify-start gap-2 text-sm sm:text-base font-bold">
                  <span className="w-24 shrink-0 text-black font-arabic">اسم المعلم :</span>
                  <span className="font-semibold text-black flex-1 font-arabic">{guruPengampu}</span>
                </div>
              </div>

              {/* KOLOM KIRI: Nama Santri, No Absen, Tanggal (Dotted Lines) */}
              <div className="flex-1 p-2 sm:p-2.5 flex flex-col gap-2 font-arabic text-right bg-white">
                <div className="flex items-end justify-start gap-2 text-sm sm:text-base font-bold">
                  <span className="w-36 shrink-0 text-black font-arabic">اسم الطالب\الطالبة :</span>
                  {effectiveMode === 'terisi' && santriNama ? (
                    <span
                      className="font-sans text-xs sm:text-sm font-semibold text-black flex-1 pb-0.5"
                      style={{ borderBottom: '1px dotted #000000' }}
                    >
                      {santriNama}
                    </span>
                  ) : (
                    <div className="flex-1 mb-1 h-3 border-b border-dotted border-slate-500" style={{ borderBottom: '1px dotted #000000' }} />
                  )}
                </div>

                <div className="flex items-end justify-start gap-2 text-sm sm:text-base font-bold">
                  <span className="w-36 shrink-0 text-black font-arabic">رقم كشف الحضور :</span>
                  {effectiveMode === 'terisi' && noAbsen ? (
                    <span
                      className="font-sans text-xs sm:text-sm font-semibold text-black flex-1 pb-0.5"
                      style={{ borderBottom: '1px dotted #000000' }}
                    >
                      {noAbsen}
                    </span>
                  ) : (
                    <div className="flex-1 mb-1 h-3 border-b border-dotted border-slate-500" style={{ borderBottom: '1px dotted #000000' }} />
                  )}
                </div>

                <div className="flex items-end justify-start gap-2 text-sm sm:text-base font-bold">
                  <span className="w-36 shrink-0 text-black font-arabic">التاريخ :</span>
                  {effectiveMode === 'terisi' && tanggal ? (
                    <span
                      className="font-sans text-xs sm:text-sm font-semibold text-black flex-1 pb-0.5"
                      style={{ borderBottom: '1px dotted #000000' }}
                    >
                      {tanggal}
                    </span>
                  ) : (
                    <div className="flex-1 mb-1 h-3 border-b border-dotted border-slate-500" style={{ borderBottom: '1px dotted #000000' }} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Banner Petunjuk */}
          {showInstruction && (
            <div className="text-center pt-2 pb-3 border-b-2 border-black my-3 font-arabic" dir="rtl">
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-black">
                {instructionText}
              </h4>
            </div>
          )}

          {/* Pilihan Ganda (Jika ada sesuai Regulasi Soal) */}
          {pilihanGandaList && pilihanGandaList.length > 0 && (
            <div className="mt-5 space-y-4 font-arabic text-right" dir="rtl">
              <h5 className="text-base sm:text-lg font-bold underline underline-offset-4">
                أولاً : اختر أصح الإجابات (أ ، ب ، ج ، أو د) !
              </h5>
              {pilihanGandaList.map((pg, idx) => (
                <div key={idx} className="space-y-1.5 page-break-inside-avoid">
                  <div className="flex items-start gap-3">
                    <span className="text-base sm:text-lg font-bold shrink-0">{pg.nomor}.</span>
                    <p className="text-base sm:text-lg leading-loose flex-1">{pg.pertanyaanArab}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 pr-8 text-sm sm:text-base">
                    <span>أ. {pg.opsiA}</span>
                    <span>ب. {pg.opsiB}</span>
                    <span>ج. {pg.opsiC}</span>
                    <span>د. {pg.opsiD}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bagian Romawi Essay Multi-bagian (Jika ada) */}
          {romawiSections && romawiSections.length > 0 ? (
            <div className="mt-6 space-y-6 font-arabic text-right" dir="rtl">
              {romawiSections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-3">
                  <h5 className="text-base sm:text-lg font-bold underline underline-offset-4">
                    {sec.judulArab}
                  </h5>
                  <div className="space-y-4">
                    {sec.soalList.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 page-break-inside-avoid">
                        <span className="text-base sm:text-lg font-bold shrink-0 text-black">{item.nomor}.</span>
                        <p className="text-base sm:text-lg leading-loose font-normal text-black flex-1">
                          {item.pertanyaanArab}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Daftar Butir Soal Standar (Strict count matching submission) */
            soalList && soalList.length > 0 && (
              <div className="mt-6 space-y-5 font-arabic text-right" dir="rtl">
                {soalList.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 page-break-inside-avoid">
                    <span className="text-base sm:text-lg font-bold shrink-0 text-black">
                      {item.nomor}.
                    </span>
                    <p className="text-base sm:text-lg leading-loose font-normal text-black flex-1">
                      {item.pertanyaanArab}
                    </p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer Lembar Ujian */}
        <div className="mt-10 print:mt-4 pt-3 border-t border-slate-400 text-center text-[11px] font-sans text-slate-500">
          Panitia Pelaksana Imtihan · Pondok Pesantren NU Darussalam Karangdadap Pekalongan · Dokumen Resmi Ujian ({effectivePaper})
        </div>
      </div>
    </div>
  );
};
