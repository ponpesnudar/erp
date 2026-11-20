import React from 'react';

export interface PrintKopPondokProps {
  variant?: 'umum' | 'imtihan' | 'maarif';
  judulDokumen?: string;
  subJudul?: string;
  tahunAjaran?: string;
}

export const PrintKopPondok: React.FC<PrintKopPondokProps> = ({
  variant = 'umum',
  judulDokumen,
  subJudul,
  tahunAjaran = '2026/2027',
}) => {
  const logoSrc =
    variant === 'imtihan'
      ? '/assets/aistudio/ChatGPT_Image_Nov_6__2025__01_32_08_PM_64f70724.png'
      : '/assets/aistudio/preview__14__3b7f388f.webp';

  const unitLabel =
    variant === 'imtihan'
      ? 'PANITIA PELAKSANA IMTIHAN MADRASAH DINIYAH SALAFIYAH'
      : variant === 'maarif'
      ? "MAJLIS MA'ARIF & KURIKULUM MADRASAH DINIYAH SALAFIYAH"
      : 'YAYASAN & PENGURUS HARIAN PONDOK PESANTREN';

  return (
    <div className="hidden print:block print-only pb-3 mb-4 border-b-2 border-black text-black w-full">
      <div className="flex items-center justify-between gap-4 pb-2">
        <img
          src={logoSrc}
          alt="Logo PP NU Darussalam Karangdadap"
          className="w-16 h-16 object-contain shrink-0"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/preview__14__3b7f388f.webp';
          }}
        />
        <div className="flex-1 text-center">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-800">
            {unitLabel}
          </p>
          <h2 className="text-base font-black uppercase tracking-wide text-black leading-tight">
            PONDOK PESANTREN NU DARUSSALAM KARANGDADAP
          </h2>
          <p className="text-[10.5px] font-semibold text-slate-700">
            Jl. Raya Karangdadap KM 1, Kec. Karangdadap, Kab. Pekalongan, Jawa Tengah 51174 · T.A. {tahunAjaran}
          </p>
        </div>
        <img
          src="/assets/aistudio/preview__14__3b7f388f.webp"
          alt="Logo Pondok Pesantren NU Darussalam"
          className="w-14 h-14 object-contain shrink-0"
        />
      </div>

      {judulDokumen && (
        <div className="text-center pt-2 border-t border-black">
          <h3 className="text-sm font-black uppercase tracking-wide text-black">{judulDokumen}</h3>
          {subJudul && <p className="text-[11px] font-semibold text-slate-700 mt-0.5">{subJudul}</p>}
        </div>
      )}
    </div>
  );
};
