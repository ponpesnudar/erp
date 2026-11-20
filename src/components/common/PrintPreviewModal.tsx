import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Printer,
  Download,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  subscribePrintPreview,
  buildStandalonePrintHtml,
  type PrintPreviewPayload,
} from '../../lib/printHelper.ts';

export const PrintPreviewModal: React.FC = () => {
  const [payload, setPayload] = useState<PrintPreviewPayload | null>(null);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [paperSize, setPaperSize] = useState<'F4' | 'A4'>('F4');
  const [printStatus, setPrintStatus] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    return subscribePrintPreview((incoming) => {
      setPayload(incoming);
      setOrientation(incoming.orientation);
      setPaperSize(incoming.paperSize);
      setPrintStatus('');
    });
  }, []);

  useEffect(() => {
    if (!payload || !iframeRef.current) return;
    const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (!doc) return;
    const html = buildStandalonePrintHtml(
      {
        title: payload.title,
        orientation,
        paperSize,
        headStylesHtml: payload.headStylesHtml,
        bodyHtml: payload.bodyHtml,
      },
      { forPreviewScreen: true }
    );
    doc.open();
    doc.write(html);
    doc.close();
  }, [payload, orientation, paperSize]);

  if (!payload) return null;

  const pageDims =
    paperSize === 'A4'
      ? orientation === 'landscape'
        ? '297mm 210mm'
        : '210mm 297mm'
      : orientation === 'landscape'
      ? '330mm 215mm'
      : '215mm 330mm';

  const handlePrintNow = () => {
    // Print through top-level body portal (#erp-direct-print-portal) + window.print()
    // so sandboxed preview environments open Chrome's native Print Dialog cleanly
    // instead of suppressing child iframe.contentWindow.print().
    const styleId = 'erp-portal-dynamic-page-style';
    let pageStyle = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!pageStyle) {
      pageStyle = document.createElement('style');
      pageStyle.id = styleId;
      document.head.appendChild(pageStyle);
    }
    pageStyle.textContent = `
      @media print {
        @page {
          size: ${pageDims};
          margin: 7mm 9mm;
        }
      }
    `;

    document.body.classList.add('erp-portal-printing');
    document.body.classList.toggle('print-landscape', orientation === 'landscape');
    document.body.classList.toggle('print-portrait', orientation === 'portrait');

    let beforePrintFired = false;
    let cleanedUp = false;

    const cleanup = () => {
      if (cleanedUp) return;
      cleanedUp = true;
      document.body.classList.remove('erp-portal-printing', 'print-landscape', 'print-portrait');
      window.removeEventListener('beforeprint', onBeforePrint);
      window.removeEventListener('afterprint', onAfterPrint);
    };

    const onBeforePrint = () => {
      beforePrintFired = true;
    };

    const onAfterPrint = () => {
      setPrintStatus('Dokumen siap dikirim ke printer / Simpan PDF.');
      setTimeout(cleanup, 150);
    };

    window.addEventListener('beforeprint', onBeforePrint, { once: true });
    window.addEventListener('afterprint', onAfterPrint, { once: true });

    try {
      const startMs = performance.now();
      window.focus();
      window.print();
      const elapsedMs = performance.now() - startMs;

      // If browser silently blocked window.print() (returned immediately without beforeprint),
      // surface download fallback clearly. Otherwise Chrome print dialog was shown cleanly.
      setTimeout(() => {
        if (!beforePrintFired && elapsedMs < 40) {
          cleanup();
          setPrintStatus(
            'Dialog printer diblokir browser preview ini. Klik "Unduh Siap Cetak (.html)" lalu buka & tekan Ctrl+P.'
          );
        } else {
          setTimeout(cleanup, 1200);
        }
      }, 300);
    } catch {
      cleanup();
      setPrintStatus(
        'Dialog printer diblokir browser preview ini. Klik "Unduh Siap Cetak (.html)" untuk mencetak.'
      );
    }
  };

  const handleDownloadPrintableHtml = () => {
    const html = buildStandalonePrintHtml(
      {
        title: payload.title,
        orientation,
        paperSize,
        headStylesHtml: payload.headStylesHtml,
        bodyHtml: payload.bodyHtml,
      },
      { forPreviewScreen: false, autoPrint: true }
    );
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = payload.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    a.download = `${safeName || 'dokumen-cetak'}-${paperSize.toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    setPrintStatus('File siap cetak (.html) berhasil diunduh. Buka file tersebut untuk cetak langsung / Save as PDF.');
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/80 backdrop-blur-xs no-print print:hidden">
        {/* Studio Top Toolbar */}
        <div className="bg-emerald-950 text-white px-4 sm:px-6 py-3 border-b border-emerald-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 border border-emerald-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-white truncate">{payload.title}</h3>
              <p className="text-[11px] text-emerald-200">
                Pratinjau Cetak Bersih (Bebas Sidebar) · Kertas {paperSize} · Orientasi{' '}
                {orientation === 'portrait' ? 'Portrait' : 'Landscape'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Paper Size Toggle */}
            <div className="flex rounded-xl bg-emerald-900/90 p-1 border border-emerald-700 text-[11px]">
              <button
                type="button"
                onClick={() => setPaperSize('F4')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  paperSize === 'F4' ? 'bg-white text-emerald-950' : 'text-emerald-200 hover:text-white'
                }`}
              >
                F4 (215×330)
              </button>
              <button
                type="button"
                onClick={() => setPaperSize('A4')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  paperSize === 'A4' ? 'bg-white text-emerald-950' : 'text-emerald-200 hover:text-white'
                }`}
              >
                A4
              </button>
            </div>

            {/* Orientation Toggle */}
            <div className="flex rounded-xl bg-emerald-900/90 p-1 border border-emerald-700 text-[11px]">
              <button
                type="button"
                onClick={() => setOrientation('portrait')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  orientation === 'portrait' ? 'bg-white text-emerald-950' : 'text-emerald-200 hover:text-white'
                }`}
              >
                Portrait
              </button>
              <button
                type="button"
                onClick={() => setOrientation('landscape')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  orientation === 'landscape' ? 'bg-white text-emerald-950' : 'text-emerald-200 hover:text-white'
                }`}
              >
                Landscape
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrintNow}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Printer / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPrintableHtml}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Siap Cetak (.html)</span>
            </button>

            <button
              type="button"
              onClick={() => setPayload(null)}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition"
              title="Tutup Pratinjau"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {printStatus && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs font-semibold text-amber-950 flex items-center justify-center gap-2 shrink-0">
            {printStatus.includes('diblokir') ? (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            )}
            <span>{printStatus}</span>
          </div>
        )}

        {/* Isolated Paper Preview Viewport */}
        <div className="flex-1 bg-slate-200 overflow-hidden p-2 sm:p-4">
          <iframe
            ref={iframeRef}
            title={payload.title}
            className="w-full h-full rounded-xl border border-slate-300 bg-slate-200 shadow-inner"
          />
        </div>
      </div>

      {/* Top-level body portal used when clicking "Cetak Printer / PDF" via native window.print() */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            id="erp-direct-print-portal"
            className={`hidden print:block bg-white text-black ${
              orientation === 'landscape' ? 'print-landscape' : 'print-portrait'
            }`}
            dangerouslySetInnerHTML={{ __html: payload.bodyHtml }}
          />,
          document.body
        )}
    </>
  );
};
