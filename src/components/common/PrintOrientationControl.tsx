import React from 'react';
import { FileText } from 'lucide-react';
import { useAppStore } from '../../lib/store.ts';

interface PrintOrientationControlProps {
  recommended?: 'portrait' | 'landscape';
  compact?: boolean;
}

export const PrintOrientationControl: React.FC<PrintOrientationControlProps> = ({
  recommended,
  compact = false,
}) => {
  const { printOrientation, setPrintOrientation } = useAppStore();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 no-print ${
        compact ? 'text-[10px]' : 'text-[11px]'
      }`}
      title="Pilih orientasi kertas cetak (F4 215x330mm)"
    >
      <span className="px-1.5 font-semibold text-slate-500 hidden sm:inline-flex items-center gap-1">
        <FileText className="w-3 h-3 text-slate-400" />
        Kertas:
      </span>
      <button
        type="button"
        onClick={() => setPrintOrientation('portrait')}
        className={`px-2 py-1 rounded-lg font-bold transition ${
          printOrientation === 'portrait'
            ? 'bg-emerald-800 text-white shadow-2xs'
            : 'text-slate-600 hover:bg-white'
        }`}
      >
        Portrait{recommended === 'portrait' ? ' *' : ''}
      </button>
      <button
        type="button"
        onClick={() => setPrintOrientation('landscape')}
        className={`px-2 py-1 rounded-lg font-bold transition ${
          printOrientation === 'landscape'
            ? 'bg-emerald-800 text-white shadow-2xs'
            : 'text-slate-600 hover:bg-white'
        }`}
      >
        Landscape{recommended === 'landscape' ? ' *' : ''}
      </button>
    </div>
  );
};
