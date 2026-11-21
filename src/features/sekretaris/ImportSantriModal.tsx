import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Upload,
  X,
} from 'lucide-react';
import type { SantriRecord } from '../../data/seed/pondokData.ts';
import type { NISConfig } from '../../lib/rules.ts';
import { formatNIS } from '../../lib/rules.ts';

interface ImportSantriModalProps {
  existingSantri: SantriRecord[];
  nisConfig: NISConfig;
  nisCounter: number;
  onImport: (items: Omit<SantriRecord, 'id'>[]) => void;
  onClose: () => void;
}

type GenderPreset = 'auto' | 'L' | 'P';

interface ParsedRow {
  rowNum: number;
  nis: string;
  nama: string;
  gender: 'L' | 'P';
  kelas: string;
  tingkat: number;
  kamar: string;
  namaWali: string;
  hpWali: string;
  alamatAsal: string;
  nik?: string;
  nisn?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  isDuplicateNis: boolean;
  isValid: boolean;
}

const HEADER_LINE =
  'NIS;Nama Lengkap;Jenis Kelamin (L/P);Kelas Diniyah;Tingkat (1-6);Kamar Asrama;Nama Wali;No HP Wali;Alamat Asal;NIK;NISN;Tempat Lahir;Tanggal Lahir (YYYY-MM-DD)';

function buildTemplateCsv(target: 'L' | 'P'): string {
  const rows =
    target === 'L'
      ? [
          '26.1001;MUHAMMAD FARHAN ARIFIN;L;1 A PUTRA;1;Al-Falah 01;Bpk. Arifin;081234567890;Karangdadap, Pekalongan;3326120102120001;0123456789;Pekalongan;2012-02-01',
          '26.1002;AHMAD LUTFI HAKIM;L;2 A PUTRA;2;An-Nur 03;Bpk. Hakim;085611223344;Kedungwuni, Pekalongan;3326121405110002;0112345678;Pekalongan;2011-05-14',
        ]
      : [
          '26.2001;SITI AISYAH NURUL HIDAYAH;P;1 A PUTRI;1;Fatimah 01;Bpk. Hidayat;081399887766;Buaran, Pekalongan;3326125204120003;0129876543;Pekalongan;2012-04-12',
          '26.2002;NAFISATUL ULYA RAHMA;P;2 A PUTRI;2;Khadijah 02;Ibu Rahmawati;085722334455;Batang, Jawa Tengah;3325116308110004;0118765432;Batang;2011-08-23',
        ];
  return '\uFEFF' + [HEADER_LINE, ...rows].join('\n');
}

function downloadCsvFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function splitDelimitedLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

export const ImportSantriModal: React.FC<ImportSantriModalProps> = ({
  existingSantri,
  nisConfig,
  nisCounter,
  onImport,
  onClose,
}) => {
  const [genderPreset, setGenderPreset] = useState<GenderPreset>('auto');
  const [rawText, setRawText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [skipDuplicateNis, setSkipDuplicateNis] = useState<boolean>(true);

  const existingNisSet = useMemo(
    () => new Set(existingSantri.map((s) => s.nis.trim().toLowerCase())),
    [existingSantri]
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setRawText(reader.result.replace(/^\uFEFF/, ''));
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  const parsedRows = useMemo<ParsedRow[]>(() => {
    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return [];

    // Detect delimiter from first line
    const sample = lines[0];
    const delimiter = sample.includes('\t')
      ? '\t'
      : sample.split(';').length >= sample.split(',').length
      ? ';'
      : ',';

    const firstCells = splitDelimitedLine(lines[0], delimiter).map((c) => c.toLowerCase());
    const hasHeader =
      firstCells.some((c) => c.includes('nama') || c.includes('nis') || c.includes('kelas'));
    const dataLines = hasHeader ? lines.slice(1) : lines;

    let autoSeq = 0;
    return dataLines.map((line, idx) => {
      const cols = splitDelimitedLine(line, delimiter);
      const rawNis = cols[0] || '';
      const nama = (cols[1] || '').toUpperCase().trim();
      const rawGender = (cols[2] || '').toUpperCase().trim();
      const resolvedGender: 'L' | 'P' =
        genderPreset !== 'auto'
          ? genderPreset
          : rawGender.startsWith('P') || rawGender === 'PUTRI' || rawGender === 'W'
          ? 'P'
          : 'L';

      const defaultKelas = resolvedGender === 'L' ? '1 A PUTRA' : '1 A PUTRI';
      const kelas = (cols[3] || defaultKelas).toUpperCase().trim();
      const parsedTingkat = parseInt(cols[4] || '', 10) || parseInt(kelas.charAt(0), 10) || 1;
      const tingkat = Math.min(6, Math.max(1, parsedTingkat));
      const kamar = cols[5] || (resolvedGender === 'L' ? 'Al-Falah 01' : 'Fatimah 01');
      const namaWali = cols[6] || 'Orang Tua / Wali';
      const hpWali = cols[7] || '-';
      const alamatAsal = cols[8] || 'Pekalongan';
      const nik = cols[9] || undefined;
      const nisn = cols[10] || undefined;
      const tempatLahir = cols[11] || undefined;
      const tanggalLahir = cols[12] || undefined;

      const finalNis =
        rawNis ||
        formatNIS(nisCounter + ++autoSeq, nisConfig);

      const isDuplicateNis = existingNisSet.has(finalNis.toLowerCase());
      const isValid = Boolean(nama && nama.length >= 2);

      return {
        rowNum: idx + 1,
        nis: finalNis,
        nama,
        gender: resolvedGender,
        kelas,
        tingkat,
        kamar,
        namaWali,
        hpWali,
        alamatAsal,
        nik,
        nisn,
        tempatLahir,
        tanggalLahir,
        isDuplicateNis,
        isValid,
      };
    });
  }, [rawText, genderPreset, existingNisSet, nisCounter, nisConfig]);

  const readyRows = useMemo(
    () =>
      parsedRows.filter(
        (r) => r.isValid && (!skipDuplicateNis || !r.isDuplicateNis)
      ),
    [parsedRows, skipDuplicateNis]
  );

  const handleConfirmImport = () => {
    if (readyRows.length === 0) return;
    const payload: Omit<SantriRecord, 'id'>[] = readyRows.map((r) => ({
      nis: r.nis,
      nama: r.nama,
      gender: r.gender,
      kelas: r.kelas,
      tingkat: r.tingkat,
      kamar: r.kamar,
      namaWali: r.namaWali,
      hpWali: r.hpWali,
      alamatAsal: r.alamatAsal,
      saldoKartu: 0,
      limitHarian: 15000,
      statusKartu: 'Aktif',
      nik: r.nik,
      nisn: r.nisn,
      tempatLahir: r.tempatLahir,
      tanggalLahir: r.tanggalLahir,
    }));
    onImport(payload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-900 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="text-sm font-extrabold">
                Impor Massal Data Santri Putra &amp; Putri
              </h3>
              <p className="text-[11px] text-emerald-200">
                Unduh format Excel/CSV khusus Putra atau Putri, isi datanya, lalu unggah atau tempel langsung dari Excel.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Step 1: Download Templates */}
          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-xs font-extrabold text-emerald-950">
                1. Unduh Format Resmi Impor Data (Bisa Dibuka di Microsoft Excel / Google Sheets)
              </p>
              <p className="text-[11px] text-emerald-800">
                Kolom: NIS · Nama · L/P · Kelas · Tingkat · Kamar · Nama Wali · HP Wali · Asal Daerah · NIK · NISN · TTL
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  downloadCsvFile('Format_Import_Santri_Putra_Darussalam.csv', buildTemplateCsv('L'))
                }
                className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Format Putra (.csv)</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  downloadCsvFile('Format_Import_Santri_Putri_Darussalam.csv', buildTemplateCsv('P'))
                }
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Format Putri (.csv)</span>
              </button>
            </div>
          </div>

          {/* Step 2: Upload / Paste & Gender Target */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  2. Target Gender Impor
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {(
                    [
                      { id: 'auto', label: 'Sesuai File' },
                      { id: 'L', label: 'Paksa Putra' },
                      { id: 'P', label: 'Paksa Putri' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setGenderPreset(opt.id)}
                      className={`py-2 px-2 rounded-xl font-bold border transition ${
                        genderPreset === opt.id
                          ? 'bg-emerald-800 text-white border-emerald-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer bg-slate-50/70 transition space-y-1.5">
                <Upload className="w-5 h-5 text-emerald-700 mx-auto" />
                <p className="text-xs font-bold text-slate-800">
                  {fileName ? `File: ${fileName}` : 'Pilih File CSV / TSV'}
                </p>
                <p className="text-[10.5px] text-slate-500">
                  Klik untuk unggah file hasil pengisian format Excel/CSV
                </p>
                <input
                  type="file"
                  accept=".csv,.tsv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipDuplicateNis}
                  onChange={(e) => setSkipDuplicateNis(e.target.checked)}
                  className="accent-emerald-700"
                />
                <span>Lewati otomatis jika NIS sudah terdaftar</span>
              </label>
            </div>

            <div className="lg:col-span-8 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label className="text-[11px] font-bold text-slate-700">
                  3. Atau Tempel (Paste) Langsung Baris Data dari Excel / CSV
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRawText(buildTemplateCsv('L').replace(/^\uFEFF/, ''))}
                    className="text-[11px] font-bold text-emerald-800 hover:underline"
                  >
                    Muat Contoh Putra
                  </button>
                  <button
                    type="button"
                    onClick={() => setRawText(buildTemplateCsv('P').replace(/^\uFEFF/, ''))}
                    className="text-[11px] font-bold text-amber-700 hover:underline"
                  >
                    Muat Contoh Putri
                  </button>
                </div>
              </div>
              <textarea
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Tempel baris CSV / TSV (copy langsung dari Excel juga otomatis terbaca)...&#10;Contoh: 26.1001;MUHAMMAD FARHAN;L;1 A PUTRA;1;Al-Falah 01;Bpk. Arifin;08123456789;Pekalongan"
                className="w-full rounded-2xl border border-slate-200 p-3 text-xs font-mono text-slate-800 focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Step 3: Live Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <p className="font-extrabold text-slate-900">
                  Pratinjau Data Terbaca: {parsedRows.length} Baris ({readyRows.length} siap diimpor)
                </p>
                {parsedRows.some((r) => r.isDuplicateNis) && (
                  <span className="inline-flex items-center gap-1 text-amber-800 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Sebagian NIS sudah ada di Master Santri
                  </span>
                )}
              </div>

              <div className="overflow-x-auto max-h-60 border border-slate-200 rounded-2xl">
                <table className="w-full text-xs text-left">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-[10.5px] uppercase text-slate-500">
                    <tr>
                      <th className="py-2 px-2.5">#</th>
                      <th className="py-2 px-2.5">NIS</th>
                      <th className="py-2 px-2.5">Nama Santri</th>
                      <th className="py-2 px-2.5">L/P</th>
                      <th className="py-2 px-2.5">Kelas</th>
                      <th className="py-2 px-2.5">Kamar</th>
                      <th className="py-2 px-2.5">Wali &amp; HP</th>
                      <th className="py-2 px-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.map((r) => (
                      <tr
                        key={r.rowNum}
                        className={
                          !r.isValid || (skipDuplicateNis && r.isDuplicateNis)
                            ? 'bg-rose-50/50 text-slate-400'
                            : 'bg-white'
                        }
                      >
                        <td className="py-2 px-2.5 tabular-nums">{r.rowNum}</td>
                        <td className="py-2 px-2.5 font-bold tabular-nums">{r.nis}</td>
                        <td className="py-2 px-2.5 font-bold text-slate-900">{r.nama || '(Nama kosong)'}</td>
                        <td className="py-2 px-2.5 font-bold">{r.gender}</td>
                        <td className="py-2 px-2.5">{r.kelas}</td>
                        <td className="py-2 px-2.5">{r.kamar}</td>
                        <td className="py-2 px-2.5">
                          {r.namaWali} · {r.hpWali}
                        </td>
                        <td className="py-2 px-2.5">
                          {!r.isValid ? (
                            <span className="text-rose-600 font-bold">Nama Kosong</span>
                          ) : r.isDuplicateNis ? (
                            <span className="text-amber-700 font-bold">
                              {skipDuplicateNis ? 'Duplikat (Dilewati)' : 'Duplikat NIS'}
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Siap
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            Putra: <strong>{readyRows.filter((r) => r.gender === 'L').length}</strong> · Putri:{' '}
            <strong>{readyRows.filter((r) => r.gender === 'P').length}</strong> santri siap masuk Buku Induk.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={readyRows.length === 0}
              onClick={handleConfirmImport}
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Impor {readyRows.length} Data Santri</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
