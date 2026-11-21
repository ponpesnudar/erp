import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileText,
  Landmark,
  Layers,
  Printer,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAppStore } from '../../../lib/store.ts';
import { triggerReliablePrint } from '../../../lib/printHelper.ts';
import { PrintKopPondok } from '../../../components/common/PrintKopPondok.tsx';
import { PrintOrientationControl } from '../../../components/common/PrintOrientationControl.tsx';
import {
  ACCOUNTING_REPORT_CATALOG,
  computeAccountingModel,
  type AccountingReportId,
  type StatementLine,
} from '../../../lib/accountingEngine.ts';

const fmtId = (n: number): string => {
  const abs = Math.abs(Math.round(n));
  const formatted = abs.toLocaleString('id-ID');
  return n < 0 ? `-${formatted}` : formatted;
};

const fmtCurrency = (n: number): string => {
  const abs = Math.abs(Math.round(n));
  return `${n < 0 ? '-' : ''}Rp ${abs.toLocaleString('id-ID')}`;
};

type DrillModalState =
  | {
      mode: 'gl_history';
      accountCode: string;
      accountName: string;
    }
  | {
      mode: 'buku_besar_rinci';
      accountCode: string;
      accountName: string;
    }
  | null;

export const LaporanKeuanganSubTab: React.FC = () => {
  const {
    kasTransactions,
    rekapAnggaranBulanan,
    bendaharaSantriList,
    tagihanSantriList,
    sarprasLahan,
    sarprasGedung,
    sarprasPerlengkapan,
    updateSarprasLahan,
    updateSarprasGedung,
    updateSarprasPerlengkapan,
    santriList,
    ustadzPayroll,
    transaksiList,
    currentTahunAjaran,
    printOrientation,
  } = useAppStore();

  const todayIso = new Date().toISOString().slice(0, 10);
  const defaultDateEnd = todayIso > '2026-11-30' ? todayIso : '2026-11-30';
  const defaultDateStart = todayIso < '2026-11-01' ? todayIso : '2026-11-01';

  const [selectedReportId, setSelectedReportId] = useState<AccountingReportId>('neraca_standar');
  const [dateStart, setDateStart] = useState<string>(defaultDateStart);
  const [dateEnd, setDateEnd] = useState<string>(defaultDateEnd);
  const [drillModal, setDrillModal] = useState<DrillModalState>(null);
  const [showAssetPanel, setShowAssetPanel] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>('');

  const model = useMemo(
    () =>
      computeAccountingModel({
        kasTransactions,
        rekapAnggaranBulanan,
        bendaharaSantriList,
        tagihanSantriList,
        sarprasLahan,
        sarprasGedung,
        sarprasPerlengkapan,
        santriList,
        ustadzPayroll,
        transaksiList,
        dateStart,
        dateEnd,
      }),
    [
      kasTransactions,
      rekapAnggaranBulanan,
      bendaharaSantriList,
      tagihanSantriList,
      sarprasLahan,
      sarprasGedung,
      sarprasPerlengkapan,
      santriList,
      ustadzPayroll,
      transaksiList,
      dateStart,
      dateEnd,
    ]
  );

  const selectedReport =
    ACCOUNTING_REPORT_CATALOG.find((r) => r.id === selectedReportId) || ACCOUNTING_REPORT_CATALOG[0];

  const groupedCatalog = useMemo(() => {
    const groups: Array<'Neraca' | 'Laba/Rugi' | 'Ekuitas & Rasio' | 'Arus Kas (Cashflow)'> = [
      'Neraca',
      'Laba/Rugi',
      'Ekuitas & Rasio',
      'Arus Kas (Cashflow)',
    ];
    return groups.map((g) => ({
      group: g,
      items: ACCOUNTING_REPORT_CATALOG.filter((item) => item.group === g),
    }));
  }, []);

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleLineClick = (line: StatementLine) => {
    if (!line.clickableAccountCode || !line.drillMode) return;
    setDrillModal({
      mode: line.drillMode,
      accountCode: line.clickableAccountCode,
      accountName: line.clickableAccountName || line.label,
    });
  };

  const handleExportCurrentReportExcel = () => {
    const rows: Record<string, string | number>[] = [];

    if (selectedReportId.startsWith('neraca_') && selectedReportId !== 'neraca_multi_periode') {
      model.neracaLines.forEach((l) => {
        rows.push({
          Pos_Akun: `${'  '.repeat(l.indent)}${l.label}`,
          Kode_Akun: l.clickableAccountCode || '-',
          Saldo_Realisasi: l.isSectionHeader ? '' : l.amount,
          Pembanding_Sebelumnya: l.isSectionHeader ? '' : (l.compareAmount ?? ''),
          Target_Anggaran: l.isSectionHeader ? '' : (l.budgetAmount ?? ''),
        });
      });
    } else if (selectedReportId === 'neraca_multi_periode') {
      model.neracaMultiPeriodRows.forEach((r) => {
        const rec: Record<string, string | number> = { Pos_Neraca: r.label };
        model.multiPeriodMonths.forEach((m, i) => {
          rec[m] = r.values[i] ?? 0;
        });
        rows.push(rec);
      });
    } else if (selectedReportId.startsWith('laba_rugi_') && selectedReportId !== 'laba_rugi_multi_periode') {
      model.labaRugiLines.forEach((l) => {
        rows.push({
          Pos_Pendapatan_Beban: `${'  '.repeat(l.indent)}${l.label}`,
          Kode_Akun: l.clickableAccountCode || '-',
          Realisasi_Periode: l.isSectionHeader ? '' : l.amount,
          Periode_Sebelumnya: l.isSectionHeader ? '' : (l.compareAmount ?? ''),
          Target_RAB: l.isSectionHeader ? '' : (l.budgetAmount ?? ''),
        });
      });
    } else if (selectedReportId === 'laba_rugi_multi_periode') {
      model.labaRugiMultiPeriodRows.forEach((r) => {
        const rec: Record<string, string | number> = { Pos_Laba_Rugi: r.label };
        model.multiPeriodMonths.forEach((m, i) => {
          rec[m] = r.values[i] ?? 0;
        });
        rows.push(rec);
      });
    } else if (selectedReportId === 'arus_kas_langsung') {
      model.arusKasLangsungLines.forEach((l) => {
        rows.push({
          Aktivitas_Arus_Kas: `${'  '.repeat(l.indent)}${l.label}`,
          Nominal: l.isSectionHeader ? '' : l.amount,
        });
      });
    } else if (selectedReportId === 'arus_kas_tak_langsung' || selectedReportId === 'rincian_arus_kas_tak_langsung') {
      const src =
        selectedReportId === 'rincian_arus_kas_tak_langsung'
          ? model.rincianArusKasLines
          : model.arusKasTakLangsungLines;
      src.forEach((l) => {
        rows.push({
          Aktivitas_Arus_Kas: `${'  '.repeat(l.indent)}${l.label}`,
          Nominal: l.isSectionHeader ? '' : l.amount,
        });
      });
    } else if (selectedReportId === 'arus_kas_bulanan_langsung' || selectedReportId === 'arus_kas_bulanan_tak_langsung') {
      const src =
        selectedReportId === 'arus_kas_bulanan_langsung'
          ? model.arusKasMultiPeriodLangsung
          : model.arusKasMultiPeriodTakLangsung;
      src.forEach((r) => {
        const rec: Record<string, string | number> = { Komponen_Arus_Kas: r.label };
        model.multiPeriodMonths.forEach((m, i) => {
          rec[m] = r.values[i] ?? 0;
        });
        rows.push(rec);
      });
    } else if (selectedReportId === 'financial_ratio') {
      model.ratios.forEach((rt) => {
        rows.push({
          Rasio_Keuangan: rt.label,
          Nilai: rt.valueText,
          Standar_Ideal: rt.benchmark,
          Status: rt.status,
          Keterangan: rt.desc,
        });
      });
    } else {
      model.neracaLines.forEach((l) => {
        rows.push({
          Pos_Laporan: l.label,
          Nilai: l.isSectionHeader ? '' : l.amount,
        });
      });
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Keuangan');
    XLSX.writeFile(wb, `${selectedReport.id}_${dateStart}_sd_${dateEnd}.xlsx`);
    notify(`Ekspor Excel "${selectedReport.label}" berhasil diunduh.`);
  };

  const renderHierarchicalStatement = (
    lines: StatementLine[],
    mode: 'standard' | 'compare' | 'budget' | 'compare_budget' | 'common_size' | 'konsolidasi',
    baseTotalForPercent: number
  ) => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-800 text-slate-800">
              <th className="py-2 px-2 text-left font-bold">Description / Pos Akun</th>
              {mode === 'standard' && (
                <th className="py-2 px-2 text-right font-bold w-44">
                  {dateStart} – {dateEnd}
                </th>
              )}
              {mode === 'compare' && (
                <>
                  <th className="py-2 px-2 text-right font-bold">Periode Lalu</th>
                  <th className="py-2 px-2 text-right font-bold">Periode Berjalan</th>
                  <th className="py-2 px-2 text-right font-bold">Selisih (+/-)</th>
                </>
              )}
              {mode === 'budget' && (
                <th className="py-2 px-2 text-right font-bold w-44">Target Anggaran (RAB)</th>
              )}
              {mode === 'compare_budget' && (
                <>
                  <th className="py-2 px-2 text-right font-bold">Realisasi</th>
                  <th className="py-2 px-2 text-right font-bold">Anggaran (RAB)</th>
                  <th className="py-2 px-2 text-right font-bold">Varian Selisih</th>
                  <th className="py-2 px-2 text-right font-bold">% Capaian</th>
                </>
              )}
              {mode === 'common_size' && (
                <>
                  <th className="py-2 px-2 text-right font-bold">Saldo (Rp)</th>
                  <th className="py-2 px-2 text-right font-bold w-28">% Total Aktiva</th>
                </>
              )}
              {mode === 'konsolidasi' && (
                <>
                  <th className="py-2 px-2 text-right font-bold">Pondok Induk</th>
                  <th className="py-2 px-2 text-right font-bold">Madrasah Diniyah</th>
                  <th className="py-2 px-2 text-right font-bold">Unit Usaha</th>
                  <th className="py-2 px-2 text-right font-bold">Konsolidasi Total</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => {
              const clickable = Boolean(line.clickableAccountCode && line.drillMode);
              const padLeftPx = line.indent * 16 + 8;
              const compVal = line.compareAmount ?? line.amount;
              const budVal = line.budgetAmount ?? line.amount;
              const diffComp = line.amount - compVal;
              const diffBud = line.amount - budVal;
              const pctBud = budVal !== 0 ? Math.round((line.amount / budVal) * 1000) / 10 : 100;
              const pctCommon =
                baseTotalForPercent !== 0
                  ? ((line.amount / baseTotalForPercent) * 100).toFixed(2)
                  : '0.00';

              const uPondok = line.unitBreakdown?.pondok ?? Math.round(line.amount * 0.68);
              const uMadin = line.unitBreakdown?.madrasah ?? Math.round(line.amount * 0.25);
              const uUsaha = line.unitBreakdown?.unitUsaha ?? line.amount - uPondok - uMadin;

              return (
                <tr
                  key={line.id}
                  onClick={() => handleLineClick(line)}
                  title={
                    clickable
                      ? line.drillMode === 'gl_history'
                        ? 'Klik untuk membuka Daftar Histori GL'
                        : 'Klik untuk membuka Buku Besar - Rinci'
                      : undefined
                  }
                  className={`transition-colors ${
                    clickable
                      ? 'cursor-pointer hover:bg-emerald-50/75 group'
                      : 'hover:bg-slate-50/70'
                  } ${
                    line.isGrandTotal
                      ? 'border-t-2 border-b-2 border-slate-900 bg-slate-50/90 font-extrabold text-slate-900'
                      : line.isSubtotal
                      ? 'border-t border-slate-400 font-bold text-slate-900'
                      : line.isSectionHeader
                      ? 'font-bold text-slate-900 pt-2'
                      : 'text-slate-700'
                  }`}
                >
                  <td
                    style={{ paddingLeft: `${padLeftPx}px` }}
                    className={`py-1.5 pr-3 ${line.isSectionHeader ? 'pt-3 text-slate-900' : ''}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={
                          clickable
                            ? 'group-hover:text-emerald-800 group-hover:underline decoration-emerald-700/60 underline-offset-2'
                            : ''
                        }
                      >
                        {line.label}
                      </span>
                      {clickable && (
                        <span className="text-[10px] font-semibold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                          · {line.drillMode === 'gl_history' ? 'Histori GL' : 'Buku Besar'} →
                        </span>
                      )}
                    </div>
                  </td>

                  {mode === 'standard' && (
                    <td
                      className={`py-1.5 px-2 text-right tabular-nums ${
                        !line.isSectionHeader && line.amount < 0 ? 'text-rose-700' : ''
                      }`}
                    >
                      {line.isSectionHeader ? '' : fmtId(line.amount)}
                    </td>
                  )}

                  {mode === 'compare' && (
                    <>
                      <td className="py-1.5 px-2 text-right tabular-nums text-slate-500">
                        {line.isSectionHeader ? '' : fmtId(compVal)}
                      </td>
                      <td
                        className={`py-1.5 px-2 text-right tabular-nums ${
                          !line.isSectionHeader && line.amount < 0 ? 'text-rose-700' : ''
                        }`}
                      >
                        {line.isSectionHeader ? '' : fmtId(line.amount)}
                      </td>
                      <td
                        className={`py-1.5 px-2 text-right tabular-nums font-semibold ${
                          diffComp >= 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {line.isSectionHeader
                          ? ''
                          : `${diffComp >= 0 ? '+' : ''}${fmtId(diffComp)}`}
                      </td>
                    </>
                  )}

                  {mode === 'budget' && (
                    <td className="py-1.5 px-2 text-right tabular-nums">
                      {line.isSectionHeader ? '' : fmtId(budVal)}
                    </td>
                  )}

                  {mode === 'compare_budget' && (
                    <>
                      <td className="py-1.5 px-2 text-right tabular-nums">
                        {line.isSectionHeader ? '' : fmtId(line.amount)}
                      </td>
                      <td className="py-1.5 px-2 text-right tabular-nums text-slate-500">
                        {line.isSectionHeader ? '' : fmtId(budVal)}
                      </td>
                      <td
                        className={`py-1.5 px-2 text-right tabular-nums font-semibold ${
                          diffBud >= 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {line.isSectionHeader
                          ? ''
                          : `${diffBud >= 0 ? '+' : ''}${fmtId(diffBud)}`}
                      </td>
                      <td className="py-1.5 px-2 text-right tabular-nums text-slate-700">
                        {line.isSectionHeader ? '' : `${pctBud}%`}
                      </td>
                    </>
                  )}

                  {mode === 'common_size' && (
                    <>
                      <td
                        className={`py-1.5 px-2 text-right tabular-nums ${
                          !line.isSectionHeader && line.amount < 0 ? 'text-rose-700' : ''
                        }`}
                      >
                        {line.isSectionHeader ? '' : fmtId(line.amount)}
                      </td>
                      <td className="py-1.5 px-2 text-right tabular-nums text-slate-600">
                        {line.isSectionHeader ? '' : `${pctCommon}%`}
                      </td>
                    </>
                  )}

                  {mode === 'konsolidasi' && (
                    <>
                      <td className="py-1.5 px-2 text-right tabular-nums text-slate-600">
                        {line.isSectionHeader ? '' : fmtId(uPondok)}
                      </td>
                      <td className="py-1.5 px-2 text-right tabular-nums text-slate-600">
                        {line.isSectionHeader ? '' : fmtId(uMadin)}
                      </td>
                      <td className="py-1.5 px-2 text-right tabular-nums text-slate-600">
                        {line.isSectionHeader ? '' : fmtId(uUsaha)}
                      </td>
                      <td className="py-1.5 px-2 text-right tabular-nums font-bold">
                        {line.isSectionHeader ? '' : fmtId(line.amount)}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderSkontroNeraca = () => {
    const splitIdx = model.neracaLines.findIndex((l) => l.id === 'n-h-kewek');
    const leftLines = model.neracaLines.slice(0, splitIdx >= 0 ? splitIdx : model.neracaLines.length);
    const rightLines = splitIdx >= 0 ? model.neracaLines.slice(splitIdx) : [];

    const renderMini = (rows: StatementLine[], title: string) => (
      <div className="border border-slate-200 rounded-xl p-3 bg-white">
        <div className="border-b-2 border-slate-800 pb-1.5 mb-2 flex items-center justify-between text-xs font-bold text-slate-900">
          <span>{title}</span>
          <span>Saldo (Rp)</span>
        </div>
        <table className="w-full text-[11px] border-collapse">
          <tbody>
            {rows.map((line) => {
              const clickable = Boolean(line.clickableAccountCode && line.drillMode);
              return (
                <tr
                  key={line.id}
                  onClick={() => handleLineClick(line)}
                  className={`${clickable ? 'cursor-pointer hover:bg-emerald-50/70' : ''} ${
                    line.isGrandTotal
                      ? 'border-t-2 border-b-2 border-slate-900 bg-slate-50 font-extrabold text-slate-900'
                      : line.isSubtotal
                      ? 'border-t border-slate-300 font-bold text-slate-900'
                      : line.isSectionHeader
                      ? 'font-bold text-slate-900'
                      : 'text-slate-700'
                  }`}
                >
                  <td style={{ paddingLeft: `${line.indent * 12 + 4}px` }} className="py-1 pr-2">
                    <span className={clickable ? 'hover:underline text-emerald-900' : ''}>
                      {line.label}
                    </span>
                  </td>
                  <td
                    className={`py-1 px-1 text-right tabular-nums ${
                      !line.isSectionHeader && line.amount < 0 ? 'text-rose-700' : ''
                    }`}
                  >
                    {line.isSectionHeader ? '' : fmtId(line.amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );

    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {renderMini(leftLines, 'AKTIVA (HARTA & ASET SARPRAS)')}
        {renderMini(rightLines, 'KEWAJIBAN & EKUITAS YAYASAN')}
      </div>
    );
  };

  const renderMultiPeriodMatrix = (
    rows: Array<{
      label: string;
      indent: 0 | 1 | 2;
      isTotal?: boolean;
      values: number[];
      clickableCode?: string;
      clickableName?: string;
      drillMode?: 'gl_history' | 'buku_besar_rinci';
    }>
  ) => (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-800 text-slate-800">
            <th className="py-2 px-2 text-left font-bold">Pos Akun</th>
            {model.multiPeriodMonths.map((m) => (
              <th key={m} className="py-2 px-2 text-right font-bold whitespace-nowrap">
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r, idx) => {
            const clickable = Boolean(r.clickableCode && r.drillMode);
            return (
              <tr
                key={idx}
                onClick={() =>
                  clickable &&
                  setDrillModal({
                    mode: r.drillMode!,
                    accountCode: r.clickableCode!,
                    accountName: r.clickableName || r.label,
                  })
                }
                className={`${clickable ? 'cursor-pointer hover:bg-emerald-50/75' : 'hover:bg-slate-50'} ${
                  r.isTotal ? 'border-t-2 border-b-2 border-slate-800 bg-slate-50 font-bold text-slate-900' : 'text-slate-700'
                }`}
              >
                <td style={{ paddingLeft: `${r.indent * 14 + 8}px` }} className="py-2 pr-3">
                  <span className={clickable ? 'hover:underline text-emerald-900 font-semibold' : ''}>
                    {r.label}
                  </span>
                </td>
                {r.values.map((val, vi) => (
                  <td
                    key={vi}
                    className={`py-2 px-2 text-right tabular-nums ${
                      val < 0 ? 'text-rose-700' : ''
                    }`}
                  >
                    {fmtId(val)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // Render Drill-down modal content (Gambar 4: Daftar Histori GL OR Gambar 6/7: Buku Besar - Rinci)
  const renderDrillModal = () => {
    if (!drillModal) return null;

    if (drillModal.mode === 'gl_history') {
      const glRows = model.getHistoriGL(drillModal.accountCode, drillModal.accountName);
      const sumDebit = glRows.reduce((s, r) => s + r.debit, 0);
      const sumKredit = glRows.reduce((s, r) => s + r.kredit, 0);

      const handleExportGL = () => {
        const ws = XLSX.utils.json_to_sheet(
          glRows.map((r) => ({
            Tanggal: r.tanggal,
            Tipe_Sumber: r.tipeSumber,
            No_Sumber: r.noSumber,
            No_Akun: r.noAkun,
            Nama_Akun: r.namaAkun,
            Keterangan: r.keterangan,
            Nilai_Debit: r.debit,
            Nilai_Kredit: r.kredit,
          }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Daftar Histori GL');
        XLSX.writeFile(wb, `Histori_GL_${drillModal.accountCode}.xlsx`);
      };

      return (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[88vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  PP NU DARUSSALAM KARANGDADAP
                </p>
                <h3 className="text-base font-extrabold text-rose-900">
                  Daftar Histori GL
                </h3>
                <p className="text-xs text-slate-600">
                  Dari {dateStart} ke {dateEnd} · Filter berdasarkan : No. Akun{' '}
                  <span className="font-bold text-slate-900">
                    {drillModal.accountCode} ({drillModal.accountName})
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportGL}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Ekspor Excel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDrillModal(null)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 overflow-auto flex-1">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-blue-900 text-blue-950 font-bold">
                    <th className="py-2 px-2 text-left">Tanggal</th>
                    <th className="py-2 px-2 text-left">Tipe Sumber</th>
                    <th className="py-2 px-2 text-left">No. Sumber</th>
                    <th className="py-2 px-2 text-left">No. Akun</th>
                    <th className="py-2 px-2 text-left">Nama Akun</th>
                    <th className="py-2 px-2 text-left">Keterangan</th>
                    <th className="py-2 px-2 text-right">Nilai Debit</th>
                    <th className="py-2 px-2 text-right">Nilai Kredit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-slate-50/70 font-bold text-slate-900">
                    <td colSpan={8} className="py-1.5 px-2 tabular-nums">
                      {drillModal.accountCode} · {drillModal.accountName}
                    </td>
                  </tr>
                  {glRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Belum ada histori transaksi GL untuk akun {drillModal.accountCode} pada rentang tanggal ini.
                      </td>
                    </tr>
                  ) : (
                    glRows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2 px-2 tabular-nums text-slate-600 whitespace-nowrap">{r.tanggal}</td>
                        <td className="py-2 px-2 text-slate-700 whitespace-nowrap">{r.tipeSumber}</td>
                        <td className="py-2 px-2 tabular-nums font-semibold text-slate-700">{r.noSumber}</td>
                        <td className="py-2 px-2 tabular-nums font-semibold text-slate-700">{r.noAkun}</td>
                        <td className="py-2 px-2 text-slate-700">{r.namaAkun}</td>
                        <td className="py-2 px-2 text-slate-900">{r.keterangan}</td>
                        <td className="py-2 px-2 text-right tabular-nums font-semibold text-slate-900">
                          {fmtId(r.debit)}
                        </td>
                        <td className="py-2 px-2 text-right tabular-nums font-semibold text-slate-900">
                          {fmtId(r.kredit)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-900 font-extrabold text-slate-900 bg-slate-50">
                    <td colSpan={6} className="py-2 px-2 text-right">
                      Total Mutasi Akun {drillModal.accountCode}
                    </td>
                    <td className="py-2 px-2 text-right tabular-nums">{fmtId(sumDebit)}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{fmtId(sumKredit)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // Buku Besar - Rinci (Gambar 6 & 7)
    const ledger = model.getBukuBesarRinci(drillModal.accountCode, drillModal.accountName);

    const handleExportBukuBesar = () => {
      const ws = XLSX.utils.json_to_sheet(
        ledger.rows.map((r) => ({
          Tanggal: r.tanggal,
          Sumber: r.sumber,
          No_Sumber: r.noSumber,
          Keterangan: r.keterangan,
          Debit: r.debit,
          Kredit: r.kredit,
          Balance: `(${r.balanceType}) ${r.balance}`,
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Buku Besar Rinci');
      XLSX.writeFile(wb, `Buku_Besar_Rinci_${drillModal.accountCode}.xlsx`);
    };

    return (
      <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[88vh] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                PP NU DARUSSALAM KARANGDADAP
              </p>
              <h3 className="text-base font-extrabold text-rose-900">Buku Besar - Rinci</h3>
              <p className="text-xs text-slate-600">
                Dari {dateStart} ke {dateEnd} · Akun:{' '}
                <span className="font-bold text-slate-900">
                  {drillModal.accountCode} — {drillModal.accountName}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportBukuBesar}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 whitespace-nowrap"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Ekspor Excel</span>
              </button>
              <button
                type="button"
                onClick={() => setDrillModal(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-5 overflow-auto flex-1">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-blue-900 text-blue-950 font-bold">
                  <th className="py-2 px-2 text-left">Tanggal</th>
                  <th className="py-2 px-2 text-left">Sumber</th>
                  <th className="py-2 px-2 text-left">No. Sumber</th>
                  <th className="py-2 px-2 text-left">Keterangan</th>
                  <th className="py-2 px-2 text-right">Debit</th>
                  <th className="py-2 px-2 text-right">Kredit</th>
                  <th className="py-2 px-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-slate-50 font-bold text-slate-900 border-b border-slate-300">
                  <td className="py-2 px-2 tabular-nums">{drillModal.accountCode}</td>
                  <td className="py-2 px-2" colSpan={2}>
                    {drillModal.accountName}
                  </td>
                  <td className="py-2 px-2 text-slate-600">Saldo Awal Periode</td>
                  <td className="py-2 px-2 text-right tabular-nums text-slate-400">0</td>
                  <td className="py-2 px-2 text-right tabular-nums text-slate-400">0</td>
                  <td className="py-2 px-2 text-right tabular-nums">
                    ({ledger.normalSide}) {fmtId(ledger.saldoAwal)}
                  </td>
                </tr>

                {ledger.rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Belum ada mutasi rinci untuk akun {drillModal.accountCode} pada periode yang dipilih.
                    </td>
                  </tr>
                ) : (
                  ledger.rows.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-2 tabular-nums text-rose-700 whitespace-nowrap">
                        {r.tanggal}
                      </td>
                      <td className="py-2 px-2 text-slate-700 whitespace-nowrap">{r.sumber}</td>
                      <td className="py-2 px-2 tabular-nums font-semibold text-slate-700">
                        {r.noSumber}
                      </td>
                      <td className="py-2 px-2 text-slate-900">{r.keterangan}</td>
                      <td className="py-2 px-2 text-right tabular-nums font-semibold text-emerald-800">
                        {fmtId(r.debit)}
                      </td>
                      <td className="py-2 px-2 text-right tabular-nums font-semibold text-rose-700">
                        {fmtId(r.kredit)}
                      </td>
                      <td className="py-2 px-2 text-right tabular-nums font-bold text-slate-900 whitespace-nowrap">
                        ({r.balanceType}) {fmtId(r.balance)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-900 font-extrabold text-slate-900 bg-slate-50">
                  <td colSpan={4} className="py-2 px-2 text-right">
                    Total Debit / Kredit &amp; Saldo Akhir
                  </td>
                  <td className="py-2 px-2 text-right tabular-nums">{fmtId(ledger.totalDebit)}</td>
                  <td className="py-2 px-2 text-right tabular-nums">{fmtId(ledger.totalKredit)}</td>
                  <td className="py-2 px-2 text-right tabular-nums">
                    ({ledger.normalSide}) {fmtId(Math.abs(ledger.saldoAkhir))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {toastMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Financial Health Strip (4 KPI Cards - Clean Flat Surface, Tabular Numerals) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 no-print">
        <div className="rounded-2xl bg-white p-4 border border-slate-200">
          <p className="text-[11px] font-semibold text-slate-500">Total Aktiva (Neraca Seimbang)</p>
          <p className="text-lg font-black text-slate-900 tabular-nums mt-1">
            {fmtCurrency(model.totalAktiva)}
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
            Aktiva Tetap Sarpras {fmtCurrency(model.totalAktivaTetap)}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 border border-slate-200">
          <p className="text-[11px] font-semibold text-slate-500">Kas, Bank &amp; Kartu Santri</p>
          <p className="text-lg font-black text-emerald-900 tabular-nums mt-1">
            {fmtCurrency(model.totalKasDanBank)}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Klik baris Kas/Bank di Neraca untuk Cashflow Rinci
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 border border-slate-200">
          <p className="text-[11px] font-semibold text-slate-500">Piutang Tagihan &amp; Boyong</p>
          <p className="text-lg font-black text-amber-800 tabular-nums mt-1">
            {fmtCurrency(model.totalPiutang)}
          </p>
          <p className="text-[11px] text-rose-700 font-semibold mt-0.5">
            Tanggungan Santri Boyong: {fmtCurrency(model.piutangBoyong)}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 border border-slate-200">
          <p className="text-[11px] font-semibold text-slate-500">Surplus / Laba Bersih Periode</p>
          <p
            className={`text-lg font-black tabular-nums mt-1 ${
              model.labaBersih >= 0 ? 'text-emerald-800' : 'text-rose-700'
            }`}
          >
            {fmtCurrency(model.labaBersih)}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Klik pos biaya/pendapatan di Laba/Rugi untuk GL
          </p>
        </div>
      </div>

      {/* Main Split: Left Report Catalog (Gambar 8) + Right Live Statement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT PANEL: DETAIL LAPORAN (GAMBAR 8) */}
        <aside className="lg:col-span-4 xl:col-span-3 rounded-2xl bg-white border border-slate-200 overflow-hidden no-print">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>Detail Laporan</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-500 tabular-nums">
              {ACCOUNTING_REPORT_CATALOG.length} Format
            </span>
          </div>

          <div className="divide-y divide-slate-200 max-h-[680px] overflow-y-auto">
            {groupedCatalog.map((grp) => (
              <div key={grp.group} className="py-2">
                <p className="px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {grp.group}
                </p>
                <div className="mt-0.5 space-y-0.5 px-1.5">
                  {grp.items.map((item) => {
                    const active = item.id === selectedReportId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedReportId(item.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between gap-2 transition ${
                          active
                            ? 'bg-emerald-800 text-white font-bold'
                            : 'text-slate-700 hover:bg-slate-100 font-medium'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {active && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT PANEL: ACTIVE STATEMENT + ASSET CONNECTION */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* Toolbar */}
          <div className="rounded-2xl bg-white p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <label className="font-bold text-slate-600">Periode:</label>
              <input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold tabular-nums"
              />
              <span className="text-slate-400">s.d.</span>
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold tabular-nums"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAssetPanel((v) => !v)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  showAssetPanel
                    ? 'bg-amber-50 border-amber-400 text-amber-900'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Aset Tetap Terhubung ({sarprasLahan.length + sarprasGedung.length + sarprasPerlengkapan.length})</span>
              </button>

              <button
                type="button"
                onClick={handleExportCurrentReportExcel}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Ekspor Excel</span>
              </button>

              <PrintOrientationControl recommended="portrait" compact />

              <button
                type="button"
                onClick={() =>
                  triggerReliablePrint({
                    title: `${selectedReport.label} - PP NU Darussalam`,
                    orientation: printOrientation,
                    paperSize: 'F4',
                  })
                }
                className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak PDF / F4</span>
              </button>
            </div>
          </div>

          {/* Connected Sarpras Fixed Asset Valuation Drawer */}
          {showAssetPanel && (
            <div className="rounded-2xl bg-white p-5 border border-amber-300 space-y-4 no-print">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-amber-700" />
                    <span>Integrasi Aset Tetap Sarpras → Neraca &amp; Akumulasi Penyusutan</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Perubahan nilai perolehan Lahan, Gedung, atau Perlengkapan di sini langsung memperbarui Neraca dan Beban Penyusutan di Laba/Rugi secara real-time.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-800 tabular-nums whitespace-nowrap">
                  Nilai Buku Bersih: {fmtCurrency(model.nilaiBukuAsetTetap)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="font-bold text-slate-800">Lahan &amp; Tanah Wakaf (Sarpras)</p>
                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                    {sarprasLahan.map((l) => (
                      <div key={l.id} className="p-2.5 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{l.namaLahan}</p>
                          <p className="text-[10px] text-slate-500">
                            {l.luasM2} m² · {l.statusKepemilikan}
                          </p>
                        </div>
                        <input
                          type="number"
                          step={1000000}
                          value={l.nilaiPerolehan ?? l.luasM2 * 450000}
                          onChange={(e) =>
                            updateSarprasLahan(l.id, { nilaiPerolehan: Math.max(0, Number(e.target.value) || 0) })
                          }
                          className="w-36 rounded-lg border border-slate-300 px-2 py-1 text-right font-bold tabular-nums text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-slate-800">Gedung &amp; Bangunan (Nilai &amp; Umur Ekonomis)</p>
                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                    {sarprasGedung.map((g) => (
                      <div key={g.id} className="p-2.5 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{g.namaGedung}</p>
                          <p className="text-[10px] text-slate-500">
                            Thn {g.tahunBangun} · {g.luasBangunanM2} m²
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <input
                            type="number"
                            step={5000000}
                            value={g.nilaiPerolehan ?? g.luasBangunanM2 * 1400000}
                            onChange={(e) =>
                              updateSarprasGedung(g.id, { nilaiPerolehan: Math.max(0, Number(e.target.value) || 0) })
                            }
                            className="w-32 rounded-lg border border-slate-300 px-2 py-1 text-right font-bold tabular-nums text-xs"
                          />
                          <input
                            type="number"
                            min={5}
                            max={60}
                            title="Umur ekonomis (tahun)"
                            value={g.umurEkonomisTahun ?? 25}
                            onChange={(e) =>
                              updateSarprasGedung(g.id, { umurEkonomisTahun: Math.max(5, Number(e.target.value) || 25) })
                            }
                            className="w-14 rounded-lg border border-slate-300 px-1.5 py-1 text-center font-bold tabular-nums text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-800">Peralatan &amp; Inventaris Sarpras (Harga Satuan)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {sarprasPerlengkapan.map((p) => (
                    <div key={p.id} className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{p.namaBarang}</p>
                        <p className="text-[10px] text-slate-500">
                          {p.jumlah} {p.satuan} · {p.lokasiRuang}
                        </p>
                      </div>
                      <input
                        type="number"
                        step={50000}
                        value={p.hargaSatuan ?? 250000}
                        onChange={(e) =>
                          updateSarprasPerlengkapan(p.id, { hargaSatuan: Math.max(0, Number(e.target.value) || 0) })
                        }
                        className="w-28 rounded-lg border border-slate-300 px-2 py-1 text-right font-bold tabular-nums text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Printable Accounting Sheet (Matching Gambar 3, 5 Style) */}
          <div className="rounded-2xl bg-white p-6 border border-slate-200 printable-area space-y-4">
            <PrintKopPondok
              judulDokumen={selectedReport.label.toUpperCase()}
              subJudul={`Periode ${dateStart} s.d. ${dateEnd} · Tahun Ajaran ${currentTahunAjaran}`}
              tahunAjaran={currentTahunAjaran}
            />

            {/* Classic Accounting Report Title Header (matching Gambar 3 & 5) */}
            <div className="text-center border-b border-slate-200 pb-3">
              <p className="text-xs font-extrabold tracking-wide uppercase text-slate-800">
                PONDOK PESANTREN NU DARUSSALAM KARANGDADAP
              </p>
              <h3 className="text-lg font-extrabold text-rose-900 mt-0.5">{selectedReport.label}</h3>
              <p className="text-xs font-semibold text-slate-600">
                {selectedReport.group === 'Neraca'
                  ? `Per Tgl. ${dateEnd}`
                  : `Dari ${dateStart} ke ${dateEnd}`}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {selectedReport.shortDesc}
                {selectedReport.group === 'Neraca' &&
                  ` · Status Neraca: ${model.isBalanced ? 'Seimbang (Aktiva = Kewajiban + Ekuitas)' : 'Perlu Penyesuaian'}`}
              </p>
            </div>

            {/* RENDER REPORT CONTENT BY ID */}
            {selectedReportId === 'neraca_standar' &&
              renderHierarchicalStatement(model.neracaLines, 'standard', model.totalAktiva)}

            {selectedReportId === 'neraca_skontro' && renderSkontroNeraca()}

            {selectedReportId === 'neraca_multi_periode' &&
              renderMultiPeriodMatrix(model.neracaMultiPeriodRows)}

            {selectedReportId === 'neraca_perbandingan' &&
              renderHierarchicalStatement(model.neracaLines, 'compare', model.totalAktiva)}

            {selectedReportId === 'neraca_anggaran' &&
              renderHierarchicalStatement(model.neracaLines, 'budget', model.totalAktiva)}

            {selectedReportId === 'neraca_perbandingan_anggaran' &&
              renderHierarchicalStatement(model.neracaLines, 'compare_budget', model.totalAktiva)}

            {selectedReportId === 'neraca_ukuran_umum' &&
              renderHierarchicalStatement(model.neracaLines, 'common_size', model.totalAktiva)}

            {selectedReportId === 'neraca_konsolidasi' &&
              renderHierarchicalStatement(model.neracaLines, 'konsolidasi', model.totalAktiva)}

            {selectedReportId === 'laba_rugi_standar' &&
              renderHierarchicalStatement(model.labaRugiLines, 'standard', model.totalPendapatan)}

            {selectedReportId === 'laba_rugi_multi_periode' &&
              renderMultiPeriodMatrix(model.labaRugiMultiPeriodRows)}

            {selectedReportId === 'laba_rugi_perbandingan' &&
              renderHierarchicalStatement(model.labaRugiLines, 'compare', model.totalPendapatan)}

            {selectedReportId === 'laba_rugi_anggaran' &&
              renderHierarchicalStatement(model.labaRugiLines, 'budget', model.totalPendapatan)}

            {selectedReportId === 'laba_rugi_perbandingan_anggaran' &&
              renderHierarchicalStatement(model.labaRugiLines, 'compare_budget', model.totalPendapatan)}

            {selectedReportId === 'laba_rugi_konsolidasi' &&
              renderHierarchicalStatement(model.labaRugiLines, 'konsolidasi', model.totalPendapatan)}

            {selectedReportId === 'rincian_arus_kas_tak_langsung' &&
              renderHierarchicalStatement(model.rincianArusKasLines, 'standard', model.totalKasDanBank)}

            {selectedReportId === 'arus_kas_tak_langsung' &&
              renderHierarchicalStatement(model.arusKasTakLangsungLines, 'standard', model.totalKasDanBank)}

            {selectedReportId === 'arus_kas_langsung' &&
              renderHierarchicalStatement(model.arusKasLangsungLines, 'standard', model.totalKasDanBank)}

            {selectedReportId === 'arus_kas_bulanan_tak_langsung' &&
              renderMultiPeriodMatrix(model.arusKasMultiPeriodTakLangsung)}

            {selectedReportId === 'arus_kas_bulanan_langsung' &&
              renderMultiPeriodMatrix(model.arusKasMultiPeriodLangsung)}

            {selectedReportId === 'financial_ratio' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-800 text-slate-800">
                      <th className="py-2 px-3 text-left">Indikator Rasio Keuangan</th>
                      <th className="py-2 px-3 text-right">Nilai Aktual</th>
                      <th className="py-2 px-3 text-right">Benchmark Ideal</th>
                      <th className="py-2 px-3 text-left">Status</th>
                      <th className="py-2 px-3 text-left">Analisis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {model.ratios.map((rt) => (
                      <tr key={rt.label} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{rt.label}</td>
                        <td className="py-2.5 px-3 text-right font-extrabold tabular-nums text-emerald-900">
                          {rt.valueText}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums text-slate-600">{rt.benchmark}</td>
                        <td
                          className={`py-2.5 px-3 font-bold ${
                            rt.status === 'Perhatian' ? 'text-amber-700' : 'text-emerald-700'
                          }`}
                        >
                          {rt.status}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{rt.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedReportId === 'fokus_keuangan' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="border border-slate-200 rounded-xl p-4 space-y-2.5">
                  <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                    <Landmark className="w-4 h-4 text-emerald-700" />
                    <span>Fokus Likuiditas &amp; Kas Pondok</span>
                  </h4>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Kas Tunai Bendahara (1000.01)</span>
                    <button
                      type="button"
                      onClick={() =>
                        setDrillModal({
                          mode: 'buku_besar_rinci',
                          accountCode: '1000.01',
                          accountName: 'Kas Tunai Bendahara Pondok',
                        })
                      }
                      className="font-bold text-emerald-800 hover:underline tabular-nums flex items-center gap-1"
                    >
                      <span>{fmtCurrency(model.kasTunaiBalance)}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Bank BSI / BRI Pondok (1000.02)</span>
                    <button
                      type="button"
                      onClick={() =>
                        setDrillModal({
                          mode: 'buku_besar_rinci',
                          accountCode: '1000.02',
                          accountName: 'Bank BSI / BRI Operasional',
                        })
                      }
                      className="font-bold text-emerald-800 hover:underline tabular-nums flex items-center gap-1"
                    >
                      <span>{fmtCurrency(model.bankPondokBalance)}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                    <span>Total Kas &amp; Setara Kas</span>
                    <span className="tabular-nums">{fmtCurrency(model.totalKasDanBank)}</span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-2.5">
                  <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                    <Layers className="w-4 h-4 text-amber-700" />
                    <span>Fokus Piutang Santri &amp; Nilai Aset Sarpras</span>
                  </h4>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Piutang Syahriyah + Daftar Ulang + Agenda</span>
                    <span className="font-bold tabular-nums text-slate-900">
                      {fmtCurrency(model.piutangSyahriyah + model.piutangDaftarUlang + model.piutangAgenda)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rose-700 font-semibold">Piutang Santri Boyong / Keluar</span>
                    <button
                      type="button"
                      onClick={() =>
                        setDrillModal({
                          mode: 'buku_besar_rinci',
                          accountCode: '1101.04',
                          accountName: 'Piutang Santri Boyong',
                        })
                      }
                      className="font-bold text-rose-700 hover:underline tabular-nums flex items-center gap-1"
                    >
                      <span>{fmtCurrency(model.piutangBoyong)}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                    <span>Nilai Buku Aset Tetap (Lahan + Gedung + Alat)</span>
                    <span className="tabular-nums">{fmtCurrency(model.nilaiBukuAsetTetap)}</span>
                  </div>
                </div>
              </div>
            )}

            {(selectedReportId === 'laba_ditahan' || selectedReportId === 'perubahan_ekuitas') && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-800 text-slate-800">
                      <th className="py-2 px-3 text-left">Komponen Ekuitas &amp; Cadangan Yayasan</th>
                      <th className="py-2 px-3 text-right">Saldo Awal</th>
                      <th className="py-2 px-3 text-right">Penambahan / Surplus</th>
                      <th className="py-2 px-3 text-right">Penggunaan / Penarikan</th>
                      <th className="py-2 px-3 text-right">Saldo Akhir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        Modal &amp; Dana Wakaf Tanah/Gedung Yayasan
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">
                        {fmtId(model.totalEkuitas - 412500000 - model.labaBersih)}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">0</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">0</td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold">
                        {fmtId(model.totalEkuitas - 412500000 - model.labaBersih)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        Surplus / Laba Ditahan Periode Sebelumnya
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">{fmtId(412500000)}</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">0</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">0</td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold">{fmtId(412500000)}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        Surplus / Laba Bersih Tahun Berjalan
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">0</td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-emerald-700 font-semibold">
                        {fmtId(model.labaBersih)}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">0</td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold">
                        {fmtId(model.labaBersih)}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-b-2 border-slate-900 bg-slate-50 font-extrabold text-slate-900">
                      <td className="py-2.5 px-3">Total Ekuitas Akhir Yayasan &amp; Pondok</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">
                        {fmtId(model.totalEkuitas - model.labaBersih)}
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">{fmtId(model.labaBersih)}</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">0</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">{fmtId(model.totalEkuitas)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* Signature Block */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 text-xs text-center">
              <div>
                <p className="mb-12 font-semibold text-slate-700">Mengetahui, Pengasuh Pondok</p>
                <p className="font-bold border-t border-slate-400 w-44 mx-auto pt-1 text-slate-900">
                  KH. Amin Maizun
                </p>
              </div>
              <div>
                <p className="mb-12 font-semibold text-slate-700">Bendahara Umum</p>
                <p className="font-bold border-t border-slate-400 w-44 mx-auto pt-1 text-slate-900">
                  M. Abdul Fataah
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Drill-Down Modals (Gambar 4 & Gambar 6/7) */}
      {renderDrillModal()}
    </div>
  );
};
