import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall.ts';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'button' | 'badge' }> = ({
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Terpasang di Perangkat
      </span>
    );
  }

  return (
    <>
      {isInstallable ? (
        <button
          onClick={install}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-300 transition shadow-2xs whitespace-nowrap shrink-0"
          title="Pasang aplikasi di layar utama HP / Laptop"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span className="whitespace-nowrap">Unduh Aplikasi HP</span>
        </button>
      ) : isIOS ? (
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition whitespace-nowrap shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span className="whitespace-nowrap">Pasang di iOS</span>
        </button>
      ) : (
        <button
          onClick={() => {
            alert("Untuk memasang di desktop / Chrome:\n1. Klik ikon install di bilah alamat browser (kanan atas)\n2. Atau buka Menu (titik tiga) > 'Install ERP Darussalam'.");
          }}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span className="whitespace-nowrap">Unduh Aplikasi HP</span>
        </button>
      )}

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-700" />
                Pasang di iPhone / iPad
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">1</span>
                <span>Buka website ini melalui browser <strong>Safari</strong> di iPhone/iPad Anda.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">2</span>
                <span>Tekan tombol <strong>Bagikan (Share)</strong> di bilah bawah Safari (ikon kotak dengan panah ke atas).</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">3</span>
                <span>Gulir ke bawah lalu pilih menu <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong>.</span>
              </p>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-6 w-full rounded-xl bg-emerald-800 py-2.5 text-xs font-semibold text-white hover:bg-emerald-900 transition"
            >
              Mengerti, Tutup Panduan
            </button>
          </div>
        </div>
      )}
    </>
  );
};
