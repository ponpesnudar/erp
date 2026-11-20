export interface ReliablePrintOptions {
  title?: string;
  orientation?: 'portrait' | 'landscape';
  paperSize?: 'F4' | 'A4';
  /** Optional specific container element or CSS selector to print instead of all active .printable-area elements */
  targetElement?: HTMLElement | null;
  targetSelector?: string;
  /** Optional callback for status notifications */
  onStatus?: (msg: string) => void;
  /** Skip opening the interactive preview modal and attempt direct hidden iframe print only */
  directOnly?: boolean;
}

export interface PrintPreviewPayload {
  id: string;
  title: string;
  orientation: 'portrait' | 'landscape';
  paperSize: 'F4' | 'A4';
  headStylesHtml: string;
  bodyHtml: string;
}

type PrintPreviewListener = (payload: PrintPreviewPayload) => void;
const listeners = new Set<PrintPreviewListener>();

export function subscribePrintPreview(listener: PrintPreviewListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function buildStandalonePrintHtml(
  payload: Omit<PrintPreviewPayload, 'id'>,
  options: { forPreviewScreen?: boolean; autoPrint?: boolean } = {}
): string {
  const { title, orientation, paperSize, headStylesHtml, bodyHtml } = payload;
  const { forPreviewScreen = false, autoPrint = false } = options;

  const pageDims =
    paperSize === 'A4'
      ? orientation === 'landscape'
        ? '297mm 210mm'
        : '210mm 297mm'
      : orientation === 'landscape'
      ? '330mm 215mm'
      : '215mm 330mm';

  const sheetWidthMm =
    paperSize === 'A4'
      ? orientation === 'landscape'
        ? '297mm'
        : '210mm'
      : orientation === 'landscape'
      ? '330mm'
      : '215mm';

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <base href="${window.location.origin}/" />
  <title>${title.replace(/</g, '&lt;')}</title>
  ${headStylesHtml}
  <style>
    @page {
      size: ${pageDims};
      margin: 7mm 9mm;
    }
    html, body {
      background: ${forPreviewScreen ? '#e2e8f0' : '#ffffff'} !important;
      color: #000000 !important;
      margin: 0 !important;
      padding: ${forPreviewScreen ? '14px' : '0'} !important;
      height: auto !important;
      min-height: 0 !important;
      overflow: visible !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .print-sheet-wrapper {
      background: #ffffff;
      width: ${forPreviewScreen ? sheetWidthMm : '100%'};
      max-width: 100%;
      margin: 0 auto;
      padding: ${forPreviewScreen ? '8mm 10mm' : '0'};
      box-sizing: border-box;
      ${forPreviewScreen ? 'box-shadow: 0 12px 32px rgba(15, 23, 42, 0.18); border-radius: 4px;' : ''}
    }
    .no-print, .print\\:hidden, button:not(.print-include), aside, header, nav {
      display: none !important;
    }
    .print-only {
      display: block !important;
    }
    .print-only-flex, .hidden.print\\:flex {
      display: flex !important;
    }
    .print\\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
    .print\\:max-h-none {
      max-height: none !important;
    }
    .print\\:overflow-visible {
      overflow: visible !important;
    }
    .print\\:space-y-1\\.5 > :not([hidden]) ~ :not([hidden]) {
      margin-top: 0.375rem !important;
    }
    .print\\:gap-2 {
      gap: 0.5rem !important;
    }
    .print\\:p-2 {
      padding: 0.5rem !important;
    }
    .print\\:border-0 {
      border-width: 0 !important;
    }
    .print\\:shadow-none {
      box-shadow: none !important;
    }
    .print\\:min-h-0 {
      min-height: 0 !important;
    }
    .printable-area {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 auto !important;
      box-shadow: none !important;
      overflow: visible !important;
    }
    .sticky {
      position: static !important;
    }
    .overflow-x-auto, .overflow-y-auto, .overflow-hidden:not(.kartu-face-box) {
      overflow: visible !important;
      max-height: none !important;
      height: auto !important;
    }
    input {
      border: none !important;
      background: transparent !important;
    }
    table {
      border-collapse: collapse !important;
      width: 100% !important;
    }
    tr {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .page-break-after {
      page-break-after: always;
      break-after: page;
    }
    .page-break-inside-avoid {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    @media print {
      html, body {
        background: #ffffff !important;
        padding: 0 !important;
      }
      .print-sheet-wrapper {
        width: 100% !important;
        padding: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
    }
  </style>
</head>
<body class="${orientation === 'landscape' ? 'print-landscape' : 'print-portrait'}">
  <div class="print-sheet-wrapper">
    ${bodyHtml}
  </div>
  ${
    autoPrint
      ? `<script>window.addEventListener('load', function() { setTimeout(function() { try { window.print(); } catch(e) {} }, 250); });</script>`
      : ''
  }
</body>
</html>`;
}

function collectPrintableHtml(
  targetElement?: HTMLElement | null,
  targetSelector?: string
): { headStylesHtml: string; bodyHtml: string } | null {
  let sourceNodes: HTMLElement[] = [];

  if (targetElement) {
    sourceNodes = [targetElement];
  } else if (targetSelector) {
    sourceNodes = Array.from(document.querySelectorAll<HTMLElement>(targetSelector));
  } else {
    sourceNodes = Array.from(document.querySelectorAll<HTMLElement>('.printable-area')).filter(
      (el) => el.offsetParent !== null || el.getClientRects().length > 0
    );
  }

  if (sourceNodes.length === 0) {
    return null;
  }

  const styleElements = Array.from(
    document.querySelectorAll<HTMLElement>('link[rel="stylesheet"], style')
  );
  const headStylesHtml = styleElements
    .map((el) => {
      if (el.tagName === 'LINK') {
        const href = (el as HTMLLinkElement).href;
        return `<link rel="stylesheet" href="${href}" />`;
      }
      return `<style>${el.textContent || ''}</style>`;
    })
    .join('\n');

  const bodyHtml = sourceNodes
    .map((node) => {
      const clone = node.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('.no-print, .print\\:hidden, aside, nav, header').forEach((bad) => {
        bad.remove();
      });

      const origInputs = node.querySelectorAll<HTMLInputElement>('input');
      const cloneInputs = clone.querySelectorAll<HTMLInputElement>('input');
      origInputs.forEach((inp, i) => {
        const cInp = cloneInputs[i];
        if (!cInp) return;
        if (inp.type === 'checkbox' || inp.type === 'radio') {
          if (inp.checked) cInp.setAttribute('checked', 'checked');
          else cInp.removeAttribute('checked');
        } else {
          cInp.setAttribute('value', inp.value);
        }
      });

      const origTextareas = node.querySelectorAll<HTMLTextAreaElement>('textarea');
      const cloneTextareas = clone.querySelectorAll<HTMLTextAreaElement>('textarea');
      origTextareas.forEach((ta, i) => {
        const cTa = cloneTextareas[i];
        if (!cTa) return;
        cTa.textContent = ta.value;
      });

      const origSelects = node.querySelectorAll<HTMLSelectElement>('select');
      const cloneSelects = clone.querySelectorAll<HTMLSelectElement>('select');
      origSelects.forEach((sel, i) => {
        const cSel = cloneSelects[i];
        if (!cSel) return;
        const span = document.createElement('span');
        span.className = 'font-semibold';
        span.textContent = sel.options[sel.selectedIndex]?.text || sel.value;
        cSel.replaceWith(span);
      });

      return clone.outerHTML;
    })
    .join('\n');

  return { headStylesHtml, bodyHtml };
}

/**
 * Mencetak dokumen secara terisolasi melalui Print Studio Modal & hidden iframe
 * sehingga bebas dari sidebar/header/overflow shell ERP serta selalu memberikan
 * pratinjau cetak, tombol Cetak Printer, & unduhan file siap cetak tanpa window.open().
 */
export async function triggerReliablePrint(options: ReliablePrintOptions = {}): Promise<void> {
  const {
    title = 'Dokumen Resmi PP NU Darussalam Karangdadap',
    orientation = 'portrait',
    paperSize = 'F4',
    targetElement,
    targetSelector,
    onStatus,
    directOnly = false,
  } = options;

  try {
    const collected = collectPrintableHtml(targetElement, targetSelector);
    if (!collected) {
      onStatus?.('Tidak ada area cetak (.printable-area) yang aktif.');
      return;
    }

    const payload: PrintPreviewPayload = {
      id: `print-${Date.now()}`,
      title,
      orientation,
      paperSize,
      headStylesHtml: collected.headStylesHtml,
      bodyHtml: collected.bodyHtml,
    };

    if (!directOnly && listeners.size > 0) {
      onStatus?.('Membuka Pratinjau Cetak Resmi...');
      listeners.forEach((fn) => fn(payload));
      return;
    }

    // Fallback direct hidden iframe print when no modal subscriber or directOnly requested
    const oldFrame = document.getElementById('erp-isolated-print-frame');
    if (oldFrame) oldFrame.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'erp-isolated-print-frame';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    const win = iframe.contentWindow;
    if (!doc || !win) {
      iframe.remove();
      return;
    }

    doc.open();
    doc.write(buildStandalonePrintHtml(payload, { forPreviewScreen: false }));
    doc.close();

    await new Promise<void>((resolve) => {
      let settled = false;
      const done = () => {
        if (!settled) {
          settled = true;
          resolve();
        }
      };
      const imgs = Array.from(doc.images || []);
      let pending = imgs.filter((img) => !img.complete).length;
      if (pending === 0) {
        setTimeout(done, 220);
      } else {
        imgs.forEach((img) => {
          if (!img.complete) {
            const tick = () => {
              pending -= 1;
              if (pending <= 0) setTimeout(done, 150);
            };
            img.addEventListener('load', tick, { once: true });
            img.addEventListener('error', tick, { once: true });
          }
        });
        setTimeout(done, 1800);
      }
    });

    if (doc.fonts?.ready) {
      await Promise.race([doc.fonts.ready, new Promise((r) => setTimeout(r, 600))]);
    }

    onStatus?.('Membuka dialog cetak printer...');
    win.focus();
    win.print();

    const cleanup = () => {
      setTimeout(() => {
        const el = document.getElementById('erp-isolated-print-frame');
        if (el) el.remove();
      }, 1500);
    };
    win.addEventListener('afterprint', cleanup, { once: true });
    setTimeout(cleanup, 45000);
  } catch {
    onStatus?.('Gagal menyiapkan pratinjau cetak.');
  }
}
