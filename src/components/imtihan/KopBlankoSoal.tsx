import React from 'react';

export interface KopBlankoSoalProps {
  /** Nama mata pelajaran dalam tulisan Arab (contoh: الفقه) */
  mapelArab?: string;
  /** Nama mata pelajaran dalam tulisan latin (opsional) */
  mapelLatin?: string;
  /** Tingkat/Kelas dalam tulisan Arab atau latin (contoh: الأول للبنين (أ / ب)*) */
  kelas?: string;
  /** Nama guru pengampu (contoh: عبد الرحمن) */
  guruPengampu?: string;
  /** Semester imtihan */
  semester?: 'gasal' | 'genap' | string;
  /** Tahun ajaran (contoh: ٢٠٢٦ - ٢٠٢٧ م) */
  tahunAjaran?: string;
  /** Nama lembaga dalam teks Arab */
  namaLembagaArab?: string;
  /** Lokasi pesantren dalam teks Pegon/Arab */
  lokasiArab?: string;
  /** Tampilkan instruksi standar ujian di bawah tabel identitas */
  showInstruction?: boolean;
  /** Kalimat instruksi ujian (default: أجب هذه الأسئلة بإجابة صحيحة !) */
  instructionText?: string;
  /** Jika diisi, menampilkan nama santri terisi; jika kosong, menampilkan garis titik-titik rapi untuk blanko tulis tangan */
  santriNama?: string;
  /** Nomor kشف الحضور / nomor absen */
  noAbsen?: string;
  /** Tanggal ujian */
  tanggal?: string;
  /** Ukuran logo dalam piksel atau kelas Tailwind */
  logoUrl?: string;
  /** Kelas tambahan untuk container utama */
  className?: string;
  /** Mode tampilan: 'blanko' (garis titik-titik kosong untuk pengisian tangan santri) atau 'terisi' */
  mode?: 'blanko' | 'terisi';
}

/**
 * KopBlankoSoal - Komponen Resmi Kop Surat Blanko Soal Imtihan
 * Mengacu pada Lampiran E (preview__13__c0233fec.webp):
 * 1. Logo NU Darussalam resmi di kanan atas
 * 2. 3 Baris Tipografi Arab untuk judul lembaga di tengah (Amiri / Scheherazade New, RTL)
 * 3. Kotak nilai (النتيجة :) bergaris tebal di kiri atas
 * 4. Tabel 2 kolom identitas ujian berbingkai tebal dengan titik-titik (garis putus-putus) rapi
 * 5. Banner instruksi: "أجب هذه الأسئلة بإجابة صحيحة !"
 */
export const KopBlankoSoal: React.FC<KopBlankoSoalProps> = ({
  mapelArab = 'الفقه',
  mapelLatin,
  kelas = 'الأول للبنين (أ / ب)*',
  guruPengampu = 'عبد الرحمن',
  semester = 'gasal',
  tahunAjaran = '٢٠٢٦ - ٢٠٢٧ م',
  namaLembagaArab = 'بالمعهد الإسلامي النهضي دار السلام',
  lokasiArab = 'كاراغداداف فكالوغان',
  showInstruction = true,
  instructionText = 'أجب هذه الأسئلة بإجابة صحيحة !',
  santriNama = '',
  noAbsen = '',
  tanggal = '',
  logoUrl = '/assets/aistudio/preview__14__3b7f388f.webp',
  className = '',
  mode = 'blanko',
}) => {
  const judulSemester =
    semester === 'genap' || semester === 'ثاني'
      ? 'الاختبار النهائي لنصف العام الثاني'
      : 'الاختبار النهائي لنصف العام الأول';

  return (
    <div className={`w-full font-serif text-black select-none ${className}`}>
      {/* 
        ========================================================================
        BAGIAN ATAS (KOP UTAMA):
        Kiri: Kotak Nilai (النتيجة :)
        Tengah: Teks Arab 3 Baris
        Kanan: Logo Resmi Pondok Pesantren NU Darussalam
        ========================================================================
      */}
      <div className="flex items-start justify-between gap-3 sm:gap-6 pb-2.5">
        {/* 1. Kotak Nilai (Sisi Kiri Atas) */}
        <div className="w-24 sm:w-28 shrink-0 border-2 border-black bg-white flex flex-col justify-between h-[96px] sm:h-[105px] p-1.5 text-center shadow-xs">
          <div className="border-b border-black pb-1">
            <span
              className="font-arabic font-bold text-xs sm:text-sm tracking-wide text-black block"
              dir="rtl"
            >
              النتيجة :
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className="text-[10px] text-slate-300 font-sans italic select-none">
              (nilai)
            </span>
          </div>
        </div>

        {/* 2. Judul Lembaga (Tengah, 3 Baris Arab / Scheherazade New / Amiri, RTL) */}
        <div className="flex-1 text-center space-y-1 sm:space-y-1.5 font-arabic px-2" dir="rtl">
          {/* Baris 1: Judul Imtihan */}
          <h2 className="text-xl sm:text-2xl md:text-[26px] font-bold text-black tracking-normal leading-tight">
            {judulSemester}
          </h2>

          {/* Baris 2: Nama Lembaga & Lokasi */}
          <h3 className="text-base sm:text-lg md:text-[20px] font-bold text-black leading-snug">
            {namaLembagaArab} {lokasiArab}
          </h3>

          {/* Baris 3: Tahun Ajaran */}
          <p className="text-sm sm:text-base font-bold text-black tracking-wide leading-tight">
            للعام الدراسي {tahunAjaran}
          </p>
        </div>

        {/* 3. Logo Pondok (Sisi Kanan Atas, proporsional) */}
        <div className="w-24 sm:w-28 shrink-0 flex justify-end items-start pt-0.5">
          <img
            src={logoUrl}
            alt="Logo Pondok Pesantren NU Darussalam"
            className="w-18 h-18 sm:w-22 sm:h-22 object-contain"
            onError={(e) => {
              // Fallback jika path webp terkendala
              (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/preview__14__3b7f388f.webp';
            }}
          />
        </div>
      </div>

      {/* 
        ========================================================================
        TABEL IDENTITAS UJIAN (2 KOLOM BERGARIS TEBAL DENGAN TITIK-TITIK RAPI):
        Sesuai Lampiran E:
        - Kolom Kanan: المادة :, الفصل :, اسم المعلم :
        - Kolom Kiri: اسم الطالب\الطالبة :, رقم كشف الحضور :, التاريخ :
        ========================================================================
      */}
      <div className="border-2 border-black bg-white my-2.5 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black text-black">
          
          {/* 
            KOLOM KANAN (Informasi Mata Pelajaran & Pengampu) 
            Di RTL posisinya di kanan, di LTR kita taruh order-first atau order-last 
            sesuai kaidah lampiran E: Kanan = Mapel, Kiri = Nama Santri.
          */}
          <div
            className="p-2 sm:p-2.5 space-y-2 font-arabic text-right md:order-2 bg-white"
            dir="rtl"
          >
            {/* Baris 1: Al-Maddah (Mata Pelajaran) */}
            <div className="flex items-baseline justify-start gap-2 text-sm sm:text-base font-bold">
              <span className="w-24 shrink-0 text-black">المادة :</span>
              <span className="font-semibold text-black flex-1">
                {mapelArab}
                {mapelLatin && (
                  <span className="text-xs text-slate-600 font-sans font-normal mr-2">
                    ({mapelLatin})
                  </span>
                )}
              </span>
            </div>

            {/* Baris 2: Al-Fashl (Kelas) */}
            <div className="flex items-baseline justify-start gap-2 text-sm sm:text-base font-bold">
              <span className="w-24 shrink-0 text-black">الفصل :</span>
              <span className="font-semibold text-black flex-1">{kelas}</span>
            </div>

            {/* Baris 3: Ismul Mu'allim (Nama Guru Pengampu) */}
            <div className="flex items-baseline justify-start gap-2 text-sm sm:text-base font-bold">
              <span className="w-24 shrink-0 text-black">اسم المعلم :</span>
              <span className="font-semibold text-black flex-1">{guruPengampu}</span>
            </div>
          </div>

          {/* 
            KOLOM KIRI (Identitas Santri: Nama, No Absen, Tanggal dengan Garis Titik-Titik Rapi) 
          */}
          <div
            className="p-2 sm:p-2.5 space-y-2 font-arabic text-right md:order-1 bg-white"
            dir="rtl"
          >
            {/* Baris 1: Ismuth Thalib / Thalibah (Nama Siswa) */}
            <div className="flex items-center justify-start gap-2 text-sm sm:text-base font-bold">
              <span className="w-36 shrink-0 text-black">اسم الطالب\الطالبة :</span>
              {mode === 'terisi' && santriNama ? (
                <span className="font-sans text-xs sm:text-sm font-semibold text-black flex-1 border-b border-dotted border-black pb-0.5">
                  {santriNama}
                </span>
              ) : (
                <div className="flex-1 relative h-5 border-b-2 border-dotted border-black flex items-center overflow-hidden">
                  <span className="text-slate-400 font-mono tracking-widest text-xs hidden sm:inline select-none opacity-40">
                    ...........................................................................
                  </span>
                </div>
              )}
            </div>

            {/* Baris 2: Raqm Kasyfil Hudhûr (Nomor Absen / Daftar Hadir) */}
            <div className="flex items-center justify-start gap-2 text-sm sm:text-base font-bold">
              <span className="w-36 shrink-0 text-black">رقم كشف الحضور :</span>
              {mode === 'terisi' && noAbsen ? (
                <span className="font-sans text-xs sm:text-sm font-semibold text-black flex-1 border-b border-dotted border-black pb-0.5">
                  {noAbsen}
                </span>
              ) : (
                <div className="flex-1 relative h-5 border-b-2 border-dotted border-black flex items-center overflow-hidden">
                  <span className="text-slate-400 font-mono tracking-widest text-xs hidden sm:inline select-none opacity-40">
                    ...........................................................................
                  </span>
                </div>
              )}
            </div>

            {/* Baris 3: At-Târikh (Hari & Tanggal Ujian) */}
            <div className="flex items-center justify-start gap-2 text-sm sm:text-base font-bold">
              <span className="w-36 shrink-0 text-black">التاريخ :</span>
              {mode === 'terisi' && tanggal ? (
                <span className="font-sans text-xs sm:text-sm font-semibold text-black flex-1 border-b border-dotted border-black pb-0.5">
                  {tanggal}
                </span>
              ) : (
                <div className="flex-1 relative h-5 border-b-2 border-dotted border-black flex items-center overflow-hidden">
                  <span className="text-slate-400 font-mono tracking-widest text-xs hidden sm:inline select-none opacity-40">
                    ...........................................................................
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 
        ========================================================================
        BANNER INSTRUKSI / PETUNJUK SOAL (PERSIS LAMPIRAN E):
        "أجب هذه الأسئلة بإجابة صحيحة !"
        ========================================================================
      */}
      {showInstruction && (
        <div className="text-center pt-2 pb-3 border-b-2 border-black my-2 font-arabic" dir="rtl">
          <h4 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-black">
            {instructionText}
          </h4>
        </div>
      )}
    </div>
  );
};
