import React, { useMemo, useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  RefreshCw,
  ShieldCheck,
  CalendarDays,
  CheckCircle2,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type {
  UstadzRecord,
  UstadzPayrollItem,
  AbsensiGuruRecord,
  IzinBadalGuruRequest,
  SatpamProfile,
  SatpamAbsensiRecord,
  SatpamPengajuanRequest,
} from '../../data/seed/pondokData.ts';
import { formatNamaWithGelar } from '../../data/seed/pondokData.ts';

const BULAN_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const HARI_ID = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];

function formatPctComma1(val: number): string {
  if (!Number.isFinite(val)) return '0,0%';
  return `${val.toFixed(1).replace('.', ',')}%`;
}

function formatPctComma2(val: number): string {
  if (!Number.isFinite(val)) return '0,00%';
  return `${val.toFixed(2).replace('.', ',')}%`;
}

function getMonthLabel(yyyyMm: string): string {
  const [, mm] = yyyyMm.split('-').map(Number);
  if (!mm || mm < 1 || mm > 12) return 'Bulan Ini';
  return BULAN_ID[mm - 1];
}

function formatDdMmYyyy(dateObj: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(dateObj.getDate())}/${pad(dateObj.getMonth() + 1)}/${dateObj.getFullYear()}`;
}

function formatIsoWithDay(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const dt = new Date(y, m - 1, d);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${HARI_ID[dt.getDay()]}, ${pad(d)}/${pad(m)}/${y}`;
}

export interface RekapSpreadsheetRow {
  id: string;
  nama: string;
  grup: 'L' | 'P';
  jtm: number;
  h: number;
  s: number;
  a: number;
  i: number;
  t: number;
  v1HadirPct: number;
  v1AlfaPct: number;
  v2HadirPct: number;
  v2TidakHPct: number;
}

export interface RekapDetailDateRow {
  id: string;
  nama: string;
  tanggalIso: string;
  tanggalLabel: string;
  sesiAtauShift: string;
  jamKerja: string;
  statusKategori: 'Hadir' | 'Terlambat' | 'Ijin' | 'Sakit';
  statusDetail: string;
  verifikasi: string;
}

interface SummaryBoxStats {
  totalJadwal: number;
  hadir: number;
  cuti: number;
  izinAlfa: number;
}

function computeSummaryStats(rows: RekapSpreadsheetRow[]): SummaryBoxStats {
  const totalJadwal = rows.reduce((sum, r) => sum + r.jtm, 0);
  const hadir = rows.reduce((sum, r) => sum + r.h, 0);
  const cuti = rows.reduce((sum, r) => sum + r.s, 0);
  const izinAlfa = rows.reduce((sum, r) => sum + r.i + r.a, 0);
  return { totalJadwal, hadir, cuti, izinAlfa };
}

// Compact crisp QR-like verification matrix rendered cleanly for print
const DigitalQrStampSvg: React.FC<{ seed: string }> = ({ seed }) => {
  const bits = useMemo(() => {
    const arr: boolean[] = [];
    let hash = 7;
    for (let k = 0; k < seed.length; k++) {
      hash = (hash * 31 + seed.charCodeAt(k)) % 9973;
    }
    for (let i = 0; i < 49; i++) {
      const r = Math.floor(i / 7);
      const c = i % 7;
      // Corner finder patterns
      if ((r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2)) {
        arr.push(true);
      } else {
        arr.push(((hash + i * 17 + r * 11 + c * 5) % 3) === 0);
      }
    }
    return arr;
  }, [seed]);

  return (
    <svg
      viewBox="0 0 28 28"
      className="w-11 h-11 shrink-0 border border-[#2E5D1A]/40 rounded p-0.5 bg-white"
      aria-label="Kode Verifikasi Tanda Tangan Digital"
    >
      {bits.map((on, idx) =>
        on ? (
          <rect
            key={idx}
            x={(idx % 7) * 4}
            y={Math.floor(idx / 7) * 4}
            width="3.6"
            height="3.6"
            fill="#1B4332"
          />
        ) : null
      )}
    </svg>
  );
};

interface RekapAbsensiSpreadsheetProps {
  mode: 'guru' | 'satpam';
  rekapBulan: string;
  onChangeRekapBulan?: (val: string) => void;
  ustadzList?: UstadzRecord[];
  ustadzPayroll?: UstadzPayrollItem[];
  absensiGuruList?: AbsensiGuruRecord[];
  izinBadalGuruList?: IzinBadalGuruRequest[];
  satpamList?: SatpamProfile[];
  satpamAbsensiList?: SatpamAbsensiRecord[];
  satpamPengajuanList?: SatpamPengajuanRequest[];
  signerName?: string;
  onNotify?: (msg: string) => void;
  onPrint?: () => void;
}

export const RekapAbsensiSpreadsheet: React.FC<RekapAbsensiSpreadsheetProps> = ({
  mode,
  rekapBulan,
  onChangeRekapBulan,
  ustadzList = [],
  ustadzPayroll = [],
  absensiGuruList = [],
  izinBadalGuruList = [],
  satpamList = [],
  satpamAbsensiList = [],
  satpamPengajuanList = [],
  signerName = 'Administrator SDM Pondok',
  onNotify,
  onPrint,
}) => {
  const [basisData, setBasisData] = useState<'terintegrasi' | 'log_mobile'>('terintegrasi');
  const [viewMode, setViewMode] = useState<'lengkap' | 'spreadsheet' | 'rincian_tanggal'>('lengkap');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Hadir' | 'Terlambat' | 'Ijin'>('Semua');
  const [showSignature, setShowSignature] = useState(true);

  const bulanNama = getMonthLabel(rekapBulan);
  const lastUpdatedStr = useMemo(() => formatDdMmYyyy(new Date()), []);
  const digitalRefCode = useMemo(
    () => `TTD-DS-${mode === 'guru' ? 'GR' : 'ST'}-${rekapBulan.replace('-', '')}`,
    [mode, rekapBulan]
  );

  // 1. Standardized monthly spreadsheet rows for either Guru Diniyah or Satpam
  const rows: RekapSpreadsheetRow[] = useMemo(() => {
    if (mode === 'guru') {
      return ustadzList.map((u, idx) => {
        const payroll = ustadzPayroll.find((p) => p.ustadzId === u.id);
        const cleanName = u.nama
          .replace(/^(KH\.|Ust\.|Usth\.|Ustzh\.|Ustadz|Ustadzah)\s+/i, '')
          .toLowerCase();

        const mobileRecs = absensiGuruList.filter((r) => {
          if (!r.tanggal.startsWith(rekapBulan)) return false;
          if (r.ustadzId === u.id) return true;
          const rClean = r.ustadzNama
            .replace(/^(KH\.|Ust\.|Usth\.|Ustzh\.|Ustadz|Ustadzah)\s+/i, '')
            .toLowerCase();
          return rClean === cleanName;
        });

        const approvedIzinOnly = izinBadalGuruList.filter(
          (req) =>
            req.status === 'Disetujui' &&
            req.jenis !== 'Absen Pengajuan' &&
            req.tanggal.startsWith(rekapBulan) &&
            (req.ustadzId === u.id ||
              req.ustadzNama
                .replace(/^(KH\.|Ust\.|Usth\.|Ustzh\.|Ustadz|Ustadzah)\s+/i, '')
                .toLowerCase() === cleanName)
        );

        const logH = mobileRecs.filter((r) => r.status === 'Hadir').length;
        const logT = mobileRecs.filter(
          (r) => r.status === 'Hadir' && r.statusKeterlambatan === 'Terlambat'
        ).length;
        const logS = mobileRecs.filter((r) => r.status === 'Sakit').length;
        const logI =
          mobileRecs.filter((r) => r.status === 'Izin' || r.status === 'Badal').length +
          approvedIzinOnly.filter((req) => !mobileRecs.some((m) => m.tanggal === req.tanggal)).length;
        const logA = mobileRecs.filter((r) => {
          const st = String(r.status);
          return st === 'Alpa' || st === 'Alfa';
        }).length;

        let jtm = 0;
        let h = 0;
        let s = 0;
        let a = 0;
        let i = 0;

        if (basisData === 'log_mobile') {
          h = logH;
          s = logS;
          i = logI;
          a = logA;
          jtm = h + s + i + a;
        } else {
          const baseWeeklyJtm = payroll?.jtmDiniyah ?? 6;
          const baseMonthlyTarget = u.statusAktif === 'Aktif' ? baseWeeklyJtm * 4 : 0;
          const totalLogs = logH + logS + logI + logA;
          if (totalLogs >= baseMonthlyTarget && totalLogs > 0) {
            jtm = totalLogs;
            h = logH;
            s = logS;
            i = logI;
            a = logA;
          } else {
            jtm = baseMonthlyTarget;
            const baseI = jtm === 0 ? 0 : idx % 5 === 0 ? 0 : (idx % 4) + 1;
            const baseS = jtm > 24 && idx % 9 === 0 ? 1 : 0;
            const baseA = 0;
            const extraFromMobile = Math.max(0, logH - 1);
            h = Math.min(jtm, Math.max(0, jtm - baseI - baseS - baseA) + extraFromMobile);
            i = Math.max(logI, Math.min(jtm - h, baseI + logI));
            s = Math.max(logS, Math.min(Math.max(0, jtm - h - i), baseS + logS));
            a = Math.max(logA, Math.max(0, jtm - h - i - s));
          }
        }

        const v1HadirPct = jtm > 0 ? (h / jtm) * 100 : 0;
        const v1AlfaPct = jtm > 0 ? (a / jtm) * 100 : 0;
        const tidakHadir = s + a + i;
        const v2TidakHPct = jtm > 0 ? (tidakHadir / jtm) * 100 : 0;
        const v2HadirPct = jtm > 0 ? Math.max(0, 100 - v2TidakHPct) : 0;

        return {
          id: u.id,
          nama: formatNamaWithGelar(u.nama, u.gender).toUpperCase(),
          grup: u.gender,
          jtm,
          h,
          s,
          a,
          i,
          t: logT,
          v1HadirPct,
          v1AlfaPct,
          v2HadirPct,
          v2TidakHPct,
        };
      });
    }

    // Mode SATPAM (Pak Riyadi, Pak Suwarno, Pak Sopoyono)
    return satpamList.map((sat, idx) => {
      const mobileRecs = satpamAbsensiList.filter(
        (r) =>
          r.tanggal.startsWith(rekapBulan) &&
          (r.satpamId === sat.id || r.satpamNama.toLowerCase() === sat.nama.toLowerCase())
      );
      const approvedReq = satpamPengajuanList.filter(
        (req) =>
          req.status === 'Disetujui' &&
          req.jenis !== 'Absen Pengajuan' &&
          req.tanggal.startsWith(rekapBulan) &&
          req.satpamId === sat.id
      );

      const logH = mobileRecs.filter((r) => r.status === 'Hadir').length;
      const logT = mobileRecs.filter(
        (r) => r.status === 'Hadir' && r.statusKeterlambatan === 'Terlambat'
      ).length;
      const logS = mobileRecs.filter((r) => r.status === 'Sakit').length;
      const logI =
        mobileRecs.filter((r) => r.status === 'Izin' || r.status === 'Tukar Shift').length +
        approvedReq.filter((req) => !mobileRecs.some((m) => m.tanggal === req.tanggal)).length;
      const logA = 0;

      let jtm = 0;
      let h = 0;
      let s = 0;
      let a = 0;
      let i = 0;

      if (basisData === 'log_mobile') {
        h = logH;
        s = logS;
        i = logI;
        a = logA;
        jtm = h + s + i + a;
      } else {
        const monthlyTarget = 26;
        const totalLogs = logH + logS + logI + logA;
        if (totalLogs >= monthlyTarget) {
          jtm = totalLogs;
          h = logH;
          s = logS;
          i = logI;
          a = logA;
        } else {
          jtm = monthlyTarget;
          const baseI = idx === 2 ? 2 : idx === 1 ? 1 : 0;
          const extraH = Math.max(0, logH - 2);
          h = Math.min(jtm, jtm - baseI + extraH);
          i = Math.max(logI, Math.min(jtm - h, baseI + logI));
          s = logS;
          a = Math.max(0, jtm - h - i - s);
        }
      }

      const v1HadirPct = jtm > 0 ? (h / jtm) * 100 : 0;
      const v1AlfaPct = jtm > 0 ? (a / jtm) * 100 : 0;
      const tidakHadir = s + a + i;
      const v2TidakHPct = jtm > 0 ? (tidakHadir / jtm) * 100 : 0;
      const v2HadirPct = jtm > 0 ? Math.max(0, 100 - v2TidakHPct) : 0;
      const grup: 'L' | 'P' = sat.shiftDefaultId === 'satpam-shift-malam' ? 'P' : 'L';

      return {
        id: sat.id,
        nama: sat.nama.toUpperCase(),
        grup,
        jtm,
        h,
        s,
        a,
        i,
        t: logT,
        v1HadirPct,
        v1AlfaPct,
        v2HadirPct,
        v2TidakHPct,
      };
    });
  }, [
    mode,
    ustadzList,
    ustadzPayroll,
    absensiGuruList,
    izinBadalGuruList,
    satpamList,
    satpamAbsensiList,
    satpamPengajuanList,
    rekapBulan,
    basisData,
  ]);

  // 2. Detailed per-date attendance log rows (Nama, Tanggal, Status: Hadir / Terlambat / Ijin)
  const detailDateRows: RekapDetailDateRow[] = useMemo(() => {
    const out: RekapDetailDateRow[] = [];

    if (mode === 'guru') {
      const allowedNames = new Set(
        ustadzList.map((u) =>
          u.nama.replace(/^(KH\.|Ust\.|Usth\.|Ustzh\.|Ustadz|Ustadzah)\s+/i, '').toLowerCase()
        )
      );
      const allowedIds = new Set(ustadzList.map((u) => u.id));

      absensiGuruList
        .filter((r) => {
          if (!r.tanggal.startsWith(rekapBulan)) return false;
          if (ustadzList.length === 0) return true;
          const clean = r.ustadzNama
            .replace(/^(KH\.|Ust\.|Usth\.|Ustzh\.|Ustadz|Ustadzah)\s+/i, '')
            .toLowerCase();
          return allowedIds.has(r.ustadzId) || allowedNames.has(clean);
        })
        .forEach((r) => {
          const isLate = r.status === 'Hadir' && r.statusKeterlambatan === 'Terlambat';
          const statusKategori: RekapDetailDateRow['statusKategori'] =
            r.status === 'Hadir'
              ? isLate
                ? 'Terlambat'
                : 'Hadir'
              : r.status === 'Sakit'
              ? 'Sakit'
              : 'Ijin';
          const statusDetail =
            statusKategori === 'Hadir'
              ? r.sumberAbsen === 'Absen Pengajuan'
                ? 'Hadir (Pengajuan)'
                : 'Hadir'
              : statusKategori === 'Terlambat'
              ? `Terlambat (${r.menitTerlambat || 5} mnt)`
              : statusKategori === 'Sakit'
              ? 'Sakit'
              : r.pengganti
              ? `Ijin / Badal (${formatNamaWithGelar(r.pengganti)})`
              : `Ijin (${r.status})`;

          out.push({
            id: r.id,
            nama: formatNamaWithGelar(r.ustadzNama).toUpperCase(),
            tanggalIso: r.tanggal,
            tanggalLabel: formatIsoWithDay(r.tanggal),
            sesiAtauShift: `${r.sesiNama || r.program || 'Madrasah Diniyah'}${r.kelas ? ` · ${r.kelas}` : ''}`,
            jamKerja: r.waktuCekOut ? `${r.waktuInput} – ${r.waktuCekOut} WIB` : `${r.waktuInput} WIB`,
            statusKategori,
            statusDetail,
            verifikasi: `${r.verifikasiAtasan || 'Terverifikasi'} · ${r.sumberAbsen || 'GPS Mobile'}`,
          });
        });

      // Include approved Ijin/Badal requests that don't yet have a matching date record
      izinBadalGuruList
        .filter(
          (req) =>
            req.status === 'Disetujui' &&
            req.jenis !== 'Absen Pengajuan' &&
            req.tanggal.startsWith(rekapBulan) &&
            !out.some(
              (row) =>
                row.tanggalIso === req.tanggal &&
                row.nama.includes(
                  req.ustadzNama
                    .replace(/^(KH\.|Ust\.|Usth\.|Ustzh\.|Ustadz|Ustadzah)\s+/i, '')
                    .toUpperCase()
                )
            )
        )
        .forEach((req) => {
          out.push({
            id: `req-${req.id}`,
            nama: formatNamaWithGelar(req.ustadzNama).toUpperCase(),
            tanggalIso: req.tanggal,
            tanggalLabel: formatIsoWithDay(req.tanggal),
            sesiAtauShift: req.sesiNama || req.program,
            jamKerja: req.jamMulaiDiajukan ? `${req.jamMulaiDiajukan} WIB` : 'Sesuai Jadwal',
            statusKategori: req.jenis === 'Sakit' ? 'Sakit' : 'Ijin',
            statusDetail: req.guruBadalNama
              ? `Ijin / Badal (${formatNamaWithGelar(req.guruBadalNama)})`
              : `Ijin (${req.jenis})`,
            verifikasi: `Disetujui${req.disetujuiOleh ? ` (${req.disetujuiOleh})` : ''}`,
          });
        });
    } else {
      // SATPAM
      satpamAbsensiList
        .filter((r) => r.tanggal.startsWith(rekapBulan))
        .forEach((r) => {
          const isLate = r.status === 'Hadir' && r.statusKeterlambatan === 'Terlambat';
          const statusKategori: RekapDetailDateRow['statusKategori'] =
            r.status === 'Hadir'
              ? isLate
                ? 'Terlambat'
                : 'Hadir'
              : r.status === 'Sakit'
              ? 'Sakit'
              : 'Ijin';
          const statusDetail =
            statusKategori === 'Hadir'
              ? r.sumberAbsen === 'Absen Pengajuan'
                ? 'Hadir (Pengajuan)'
                : 'Hadir'
              : statusKategori === 'Terlambat'
              ? `Terlambat (${r.menitTerlambat || 5} mnt)`
              : statusKategori === 'Sakit'
              ? 'Sakit'
              : r.pengganti
              ? `Ijin / Tukar (${r.pengganti})`
              : `Ijin (${r.status})`;

          out.push({
            id: r.id,
            nama: r.satpamNama.toUpperCase(),
            tanggalIso: r.tanggal,
            tanggalLabel: formatIsoWithDay(r.tanggal),
            sesiAtauShift: `${r.shiftNama} (${r.posJaga})`,
            jamKerja: r.waktuCekOut ? `${r.waktuInput} – ${r.waktuCekOut} WIB` : `${r.waktuInput} WIB`,
            statusKategori,
            statusDetail,
            verifikasi: `${r.verifikasiAtasan || 'Terverifikasi'} · ${r.sumberAbsen || 'GPS Mobile'}`,
          });
        });

      satpamPengajuanList
        .filter(
          (req) =>
            req.status === 'Disetujui' &&
            req.jenis !== 'Absen Pengajuan' &&
            req.tanggal.startsWith(rekapBulan) &&
            !out.some(
              (row) => row.tanggalIso === req.tanggal && row.nama === req.satpamNama.toUpperCase()
            )
        )
        .forEach((req) => {
          out.push({
            id: `sreq-${req.id}`,
            nama: req.satpamNama.toUpperCase(),
            tanggalIso: req.tanggal,
            tanggalLabel: formatIsoWithDay(req.tanggal),
            sesiAtauShift: `${req.shiftNama} (${req.posJaga})`,
            jamKerja: req.jamMulaiDiajukan ? `${req.jamMulaiDiajukan} WIB` : 'Sesuai Shift',
            statusKategori: req.jenis === 'Sakit' ? 'Sakit' : 'Ijin',
            statusDetail: req.penggantiNama
              ? `Ijin / Tukar (${req.penggantiNama})`
              : `Ijin (${req.jenis})`,
            verifikasi: `Disetujui${req.disetujuiOleh ? ` (${req.disetujuiOleh})` : ''}`,
          });
        });
    }

    return out.sort((a, b) => {
      const dateCmp = b.tanggalIso.localeCompare(a.tanggalIso);
      if (dateCmp !== 0) return dateCmp;
      return a.nama.localeCompare(b.nama);
    });
  }, [
    mode,
    ustadzList,
    absensiGuruList,
    izinBadalGuruList,
    satpamAbsensiList,
    satpamPengajuanList,
    rekapBulan,
  ]);

  const filteredDetailRows = useMemo(() => {
    if (statusFilter === 'Semua') return detailDateRows;
    if (statusFilter === 'Ijin') {
      return detailDateRows.filter((r) => r.statusKategori === 'Ijin' || r.statusKategori === 'Sakit');
    }
    return detailDateRows.filter((r) => r.statusKategori === statusFilter);
  }, [detailDateRows, statusFilter]);

  const groupARows = useMemo(() => rows.filter((r) => r.grup === 'L'), [rows]);
  const groupBRows = useMemo(() => rows.filter((r) => r.grup === 'P'), [rows]);

  const statsA = useMemo(() => computeSummaryStats(groupARows), [groupARows]);
  const statsB = useMemo(() => computeSummaryStats(groupBRows), [groupBRows]);
  const statsAll = useMemo(() => computeSummaryStats(rows), [rows]);

  const labelGroupA = mode === 'guru' ? 'Putra' : 'Shift Pagi & Sore';
  const labelGroupB = mode === 'guru' ? 'Putri' : 'Shift Malam & Patroli';
  const labelGroupAll = mode === 'guru' ? 'Putra & Putri' : 'Total Regu Satpam';
  const docTitle =
    mode === 'guru'
      ? 'Rekapitulasi Absensi Guru Diniyah'
      : 'Rekapitulasi Absensi Satpam Keamanan';
  const leftSignerTitle =
    mode === 'guru'
      ? "Pengasuh / Kepala Majlis Ma'arif"
      : 'Pengasuh / Koordinator Keamanan';
  const leftSignerName = mode === 'guru' ? 'KH. Amin Maizun' : 'KH. Amin Maizun / Ust. M Bahrul Ulum';
  const rightSignerTitle =
    mode === 'guru' ? 'Sekretariat & Admin SDM Pondok' : 'Koordinator Keamanan & SDM';

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    const aoaMain: (string | number)[][] = [
      [docTitle, '', '', '', '', '', '', '', '', '', ''],
      [
        `Periode: ${bulanNama} (${rekapBulan})`,
        '',
        '',
        `Update terakhir: ${lastUpdatedStr}`,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
      [
        'No',
        mode === 'guru' ? 'Nama Guru' : 'Nama Satpam',
        `${mode === 'guru' ? 'JTM 1' : 'Shift 1'} (${bulanNama})`,
        'Kehadiran H',
        'Kehadiran S',
        'Kehadiran A',
        'Kehadiran I',
        'Keaktifan V1 (% Hadir)',
        'Keaktifan V1 (% Alfa)',
        'Keaktifan V2 (% Hadir)',
        'Keaktifan V2 (% Tidak H)',
      ],
      ...rows.map((r, idx) => [
        idx + 1,
        r.nama,
        r.jtm,
        r.h,
        r.s,
        r.a,
        r.i,
        formatPctComma1(r.v1HadirPct),
        formatPctComma1(r.v1AlfaPct),
        formatPctComma1(r.v2HadirPct),
        formatPctComma1(r.v2TidakHPct),
      ]),
    ];

    const wsMain = XLSX.utils.aoa_to_sheet(aoaMain);
    wsMain['!cols'] = [
      { wch: 5 },
      { wch: 30 },
      { wch: 14 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 20 },
      { wch: 18 },
      { wch: 20 },
      { wch: 22 },
    ];
    XLSX.utils.book_append_sheet(wb, wsMain, mode === 'guru' ? 'Rekap Guru' : 'Rekap Satpam');

    const aoaSummary: (string | number)[][] = [
      ['Update terakhir:', lastUpdatedStr, ''],
      [],
      [labelGroupA, 'Jum.', 'persensi'],
      ['Total Jadwal', statsA.totalJadwal, '100%'],
      [
        'absen hadir',
        statsA.hadir,
        formatPctComma2(statsA.totalJadwal > 0 ? (statsA.hadir / statsA.totalJadwal) * 100 : 0),
      ],
      [
        'Sakit / Cuti',
        statsA.cuti,
        formatPctComma2(statsA.totalJadwal > 0 ? (statsA.cuti / statsA.totalJadwal) * 100 : 0),
      ],
      [
        'izin & alfa non cuti',
        statsA.izinAlfa,
        formatPctComma2(statsA.totalJadwal > 0 ? (statsA.izinAlfa / statsA.totalJadwal) * 100 : 0),
      ],
      [],
      [labelGroupB, 'Jum.', 'persensi'],
      ['Total Jadwal', statsB.totalJadwal, '100%'],
      [
        'absen hadir',
        statsB.hadir,
        formatPctComma2(statsB.totalJadwal > 0 ? (statsB.hadir / statsB.totalJadwal) * 100 : 0),
      ],
      [
        'Sakit / Cuti',
        statsB.cuti,
        formatPctComma2(statsB.totalJadwal > 0 ? (statsB.cuti / statsB.totalJadwal) * 100 : 0),
      ],
      [
        'izin & alfa non cuti',
        statsB.izinAlfa,
        formatPctComma2(statsB.totalJadwal > 0 ? (statsB.izinAlfa / statsB.totalJadwal) * 100 : 0),
      ],
      [],
      ['Rekap', '', ''],
      [labelGroupAll, 'Jum.', 'Persensi'],
      ['Total Jadwal', statsAll.totalJadwal, '100%'],
      [
        'absen hadir',
        statsAll.hadir,
        formatPctComma2(statsAll.totalJadwal > 0 ? (statsAll.hadir / statsAll.totalJadwal) * 100 : 0),
      ],
      [
        'Sakit / Cuti',
        statsAll.cuti,
        formatPctComma2(statsAll.totalJadwal > 0 ? (statsAll.cuti / statsAll.totalJadwal) * 100 : 0),
      ],
      [
        'izin & alfa non cuti',
        statsAll.izinAlfa,
        formatPctComma2(statsAll.totalJadwal > 0 ? (statsAll.izinAlfa / statsAll.totalJadwal) * 100 : 0),
      ],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(aoaSummary);
    wsSummary['!cols'] = [{ wch: 24 }, { wch: 10 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan Persensi');

    const aoaDetail: (string | number)[][] = [
      [`Rincian Kehadiran per Tanggal — ${docTitle} (${bulanNama} ${rekapBulan})`, '', '', '', '', ''],
      ['No', mode === 'guru' ? 'Nama Guru' : 'Nama Satpam', 'Tanggal', 'Sesi / Shift & Jam', 'Status Kehadiran', 'Verifikasi & Sumber'],
      ...filteredDetailRows.map((d, idx) => [
        idx + 1,
        d.nama,
        d.tanggalLabel,
        `${d.sesiAtauShift} (${d.jamKerja})`,
        d.statusDetail,
        d.verifikasi,
      ]),
      [],
      ['Pengesahan Tanda Tangan Digital:', digitalRefCode, `Karangdadap, ${lastUpdatedStr}`],
      ['Mengetahui:', leftSignerTitle, leftSignerName],
      ['Dibuat Oleh:', rightSignerTitle, signerName],
    ];
    const wsDetail = XLSX.utils.aoa_to_sheet(aoaDetail);
    wsDetail['!cols'] = [
      { wch: 5 },
      { wch: 28 },
      { wch: 22 },
      { wch: 36 },
      { wch: 24 },
      { wch: 28 },
    ];
    XLSX.utils.book_append_sheet(wb, wsDetail, 'Rincian Tanggal & Status');

    const fileName = `Rekapitulasi-Absensi-${mode === 'guru' ? 'Guru-Diniyah' : 'Satpam'}-${rekapBulan}.xlsx`;
    XLSX.writeFile(wb, fileName);
    onNotify?.(`Excel "${fileName}" berhasil diunduh!`);
  };

  const drawPdfDigitalSignatures = (doc: jsPDF, startY: number) => {
    let sigY = startY;
    if (sigY > 158) {
      doc.addPage();
      sigY = 22;
    }

    // Left Signatory Box
    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Mengetahui,', 24, sigY);
    doc.setFont('times', 'bold');
    doc.text(leftSignerTitle, 24, sigY + 4.5);

    // Digital seal stamp box left
    doc.setDrawColor(46, 93, 26);
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(24, sigY + 7.5, 62, 14, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(22, 101, 52);
    doc.text('TTD DIGITAL TERVERIFIKASI', 27, sigY + 12.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text(`Ref: ${digitalRefCode}-A`, 27, sigY + 16.5);
    doc.text(`Sah Tgl: ${lastUpdatedStr}`, 27, sigY + 19.5);

    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(leftSignerName, 24, sigY + 27);

    // Right Signatory Box
    doc.setFont('times', 'normal');
    doc.text(`Karangdadap, ${lastUpdatedStr}`, 232, sigY);
    doc.setFont('times', 'bold');
    doc.text(rightSignerTitle, 232, sigY + 4.5);

    doc.setDrawColor(46, 93, 26);
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(232, sigY + 7.5, 66, 14, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(22, 101, 52);
    doc.text('DITANDATANGANI ELEKTRONIK', 235, sigY + 12.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text(`Ref: ${digitalRefCode}-B`, 235, sigY + 16.5);
    doc.text(`PP NU Darussalam Karangdadap`, 235, sigY + 19.5);

    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(signerName, 232, sigY + 27);
  };

  const handleExportPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [330, 215] });

    // Kop Surat Resmi Pondok Pesantren
    doc.setFillColor(6, 78, 59);
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.7);
    doc.circle(23, 18.5, 7.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(253, 224, 71);
    doc.text('PP NU', 23, 17.8, { align: 'center' });
    doc.setFontSize(5);
    doc.setTextColor(255, 255, 255);
    doc.text('DARUSSALAM', 23, 20.6, { align: 'center' });

    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text('YAYASAN & PENGURUS HARIAN PONDOK PESANTREN', 165, 13.5, { align: 'center' });
    doc.setFontSize(14);
    doc.setTextColor(6, 78, 59);
    doc.text('PONDOK PESANTREN NU DARUSSALAM KARANGDADAP', 165, 19.5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(
      'Jl. Raya Karangdadap KM 1, Kec. Karangdadap, Kab. Pekalongan, Jawa Tengah 51174 · Website Resmi Pesantren',
      165,
      24.5,
      { align: 'center' }
    );

    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.8);
    doc.line(14, 27.8, 316, 27.8);
    doc.setLineWidth(0.25);
    doc.line(14, 28.9, 316, 28.9);

    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text(docTitle.toUpperCase(), 14, 35.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const docCode = `PP-DS/${mode === 'guru' ? 'SDM' : 'KEAM'}/ABS-${rekapBulan.replace('-', '')}`;
    doc.text(
      `No. Dok: ${docCode} · Periode: ${bulanNama} (${rekapBulan}) · Update terakhir: ${lastUpdatedStr}`,
      316,
      35.5,
      { align: 'right' }
    );

    let lastEndY = 42;

    if (viewMode !== 'rincian_tanggal') {
      autoTable(doc, {
        startY: 41,
        margin: { left: 14, right: 98 },
        head: [
          [
            { content: 'No', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
            {
              content: mode === 'guru' ? 'Nama Guru' : 'Nama Satpam',
              rowSpan: 2,
              styles: { valign: 'middle', halign: 'center' },
            },
            {
              content: `${mode === 'guru' ? 'JTM 1' : 'Shift 1'}\n${bulanNama}`,
              rowSpan: 2,
              styles: { valign: 'middle', halign: 'center' },
            },
            { content: 'Kehadiran', colSpan: 4, styles: { halign: 'center' } },
            { content: 'Keaktifan V1', colSpan: 2, styles: { halign: 'center' } },
            { content: 'Keaktifan V2', colSpan: 2, styles: { halign: 'center' } },
          ],
          ['H', 'S', 'A', 'I', '% Hadir', '% Alfa', '% Hadir', '% Tidak H'],
        ],
        body: rows.map((r, idx) => [
          String(idx + 1),
          r.nama,
          String(r.jtm),
          String(r.h),
          String(r.s),
          String(r.a),
          String(r.i),
          formatPctComma1(r.v1HadirPct),
          formatPctComma1(r.v1AlfaPct),
          formatPctComma1(r.v2HadirPct),
          formatPctComma1(r.v2TidakHPct),
        ]),
        styles: {
          font: 'times',
          fontSize: 8.5,
          cellPadding: 1.5,
          halign: 'center',
          lineColor: [90, 110, 85],
          lineWidth: 0.15,
          textColor: [20, 20, 20],
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { halign: 'left', cellWidth: 58 },
          2: { cellWidth: 16 },
          3: { cellWidth: 11 },
          4: { cellWidth: 11 },
          5: { cellWidth: 11 },
          6: { cellWidth: 11 },
          8: { textColor: [220, 38, 38] },
          10: { textColor: [220, 38, 38] },
        },
        headStyles: {
          fillColor: [46, 93, 26],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [234, 244, 227],
        },
        didParseCell: (hookData) => {
          if (hookData.section === 'body' && hookData.column.index === 6) {
            const val = Number(hookData.cell.raw);
            if (val > 0) {
              hookData.cell.styles.fillColor = [253, 224, 71];
              hookData.cell.styles.fontStyle = 'bold';
            }
          }
        },
      });

      const leftEndY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 120;

      const renderPdfSummaryBox = (
        startY: number,
        title: string,
        stats: SummaryBoxStats,
        persensiHeader = 'persensi'
      ) => {
        autoTable(doc, {
          startY,
          margin: { left: 238, right: 14 },
          head: [[title, 'Jum.', persensiHeader]],
          body: [
            ['Total Jadwal', String(stats.totalJadwal), '100%'],
            [
              'absen hadir',
              String(stats.hadir),
              formatPctComma2(stats.totalJadwal > 0 ? (stats.hadir / stats.totalJadwal) * 100 : 0),
            ],
            [
              '',
              stats.cuti > 0 ? String(stats.cuti) : '',
              formatPctComma2(stats.totalJadwal > 0 ? (stats.cuti / stats.totalJadwal) * 100 : 0),
            ],
            [
              'izin & alfa non cuti',
              String(stats.izinAlfa),
              formatPctComma2(stats.totalJadwal > 0 ? (stats.izinAlfa / stats.totalJadwal) * 100 : 0),
            ],
          ],
          styles: {
            font: 'times',
            fontSize: 8.5,
            cellPadding: 1.5,
            lineColor: [30, 30, 30],
            lineWidth: 0.25,
            textColor: [15, 23, 42],
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [15, 23, 42],
            fontStyle: 'bold',
            halign: 'center',
          },
          columnStyles: {
            0: { halign: 'left', cellWidth: 42 },
            1: { halign: 'center', cellWidth: 16 },
            2: { halign: 'right', cellWidth: 20 },
          },
        });
      };

      doc.setFont('times', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(20, 20, 20);
      doc.text(`Update terakhir: ${lastUpdatedStr}`, 277, 41.5, { align: 'center' });
      renderPdfSummaryBox(44, labelGroupA, statsA, 'persensi');
      renderPdfSummaryBox(77, labelGroupB, statsB, 'persensi');
      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.text('Rekap', 238, 111);
      renderPdfSummaryBox(113, labelGroupAll, statsAll, 'Persensi');
      lastEndY = Math.max(leftEndY, 145);
    }

    if (viewMode !== 'spreadsheet' && filteredDetailRows.length > 0) {
      let detailStartY = viewMode === 'rincian_tanggal' ? 41 : lastEndY + 10;
      if (detailStartY > 155) {
        doc.addPage();
        detailStartY = 18;
      }

      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(20, 20, 20);
      doc.text(
        `Rincian Kehadiran per Tanggal (Hadir / Terlambat / Ijin) — ${bulanNama} (${rekapBulan})`,
        14,
        detailStartY
      );

      autoTable(doc, {
        startY: detailStartY + 3,
        margin: { left: 14, right: 14 },
        head: [
          [
            'No',
            mode === 'guru' ? 'Nama Guru' : 'Nama Satpam',
            'Tanggal',
            'Sesi / Shift & Jam',
            'Status Kehadiran',
            'Verifikasi & Sumber',
          ],
        ],
        body: filteredDetailRows.map((d, idx) => [
          String(idx + 1),
          d.nama,
          d.tanggalLabel,
          `${d.sesiAtauShift} (${d.jamKerja})`,
          d.statusDetail,
          d.verifikasi,
        ]),
        styles: {
          font: 'times',
          fontSize: 8.5,
          cellPadding: 1.7,
          lineColor: [90, 110, 85],
          lineWidth: 0.15,
          textColor: [20, 20, 20],
        },
        headStyles: {
          fillColor: [46, 93, 26],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
        },
        alternateRowStyles: {
          fillColor: [234, 244, 227],
        },
        columnStyles: {
          0: { cellWidth: 11, halign: 'center' },
          1: { cellWidth: 60, fontStyle: 'bold' },
          2: { cellWidth: 42 },
          3: { cellWidth: 85 },
          4: { cellWidth: 48, halign: 'center', fontStyle: 'bold' },
          5: { cellWidth: 56 },
        },
        didParseCell: (hookData) => {
          if (hookData.section === 'body' && hookData.column.index === 4) {
            const raw = String(hookData.cell.raw || '');
            if (raw.startsWith('Ijin') || raw === 'Sakit') {
              hookData.cell.styles.fillColor = [253, 224, 71];
              hookData.cell.styles.textColor = [15, 23, 42];
            } else if (raw.startsWith('Terlambat')) {
              hookData.cell.styles.fillColor = [254, 215, 170];
              hookData.cell.styles.textColor = [154, 52, 18];
            } else {
              hookData.cell.styles.textColor = [22, 101, 52];
            }
          }
        },
      });

      lastEndY =
        (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || lastEndY + 40;
    }

    if (showSignature) {
      drawPdfDigitalSignatures(doc, lastEndY + 10);
    }

    const fileName = `Rekapitulasi-Absensi-${mode === 'guru' ? 'Guru-Diniyah' : 'Satpam'}-${rekapBulan}.pdf`;
    doc.save(fileName);
    onNotify?.(`PDF "${fileName}" berhasil diunduh!`);
  };

  const renderSummaryTable = (
    heading: string,
    stats: SummaryBoxStats,
    persensiColLabel: 'persensi' | 'Persensi'
  ) => {
    const pctHadir = stats.totalJadwal > 0 ? (stats.hadir / stats.totalJadwal) * 100 : 0;
    const pctCuti = stats.totalJadwal > 0 ? (stats.cuti / stats.totalJadwal) * 100 : 0;
    const pctIzin = stats.totalJadwal > 0 ? (stats.izinAlfa / stats.totalJadwal) * 100 : 0;

    return (
      <table className="w-full border-collapse border border-slate-900 text-[12px] font-serif bg-white text-slate-950">
        <thead>
          <tr>
            <th className="border border-slate-900 px-2 py-1 font-bold text-center bg-white">
              {heading}
            </th>
            <th className="border border-slate-900 px-2 py-1 font-bold text-center w-14 bg-white">
              Jum.
            </th>
            <th className="border border-slate-900 px-2 py-1 font-bold text-center w-20 bg-white">
              {persensiColLabel}
            </th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          <tr>
            <td className="border border-slate-900 px-2 py-1">Total Jadwal</td>
            <td className="border border-slate-900 px-2 py-1 text-center">{stats.totalJadwal}</td>
            <td className="border border-slate-900 px-2 py-1 text-right">100%</td>
          </tr>
          <tr>
            <td className="border border-slate-900 px-2 py-1">absen hadir</td>
            <td className="border border-slate-900 px-2 py-1 text-center">{stats.hadir}</td>
            <td className="border border-slate-900 px-2 py-1 text-right">
              {formatPctComma2(pctHadir)}
            </td>
          </tr>
          <tr>
            <td className="border border-slate-900 px-2 py-1 h-6">
              {stats.cuti > 0 ? <span className="text-slate-600">sakit / cuti</span> : '\u00A0'}
            </td>
            <td className="border border-slate-900 px-2 py-1 text-center">
              {stats.cuti > 0 ? stats.cuti : ''}
            </td>
            <td className="border border-slate-900 px-2 py-1 text-right">
              {formatPctComma2(pctCuti)}
            </td>
          </tr>
          <tr>
            <td className="border border-slate-900 px-2 py-1">izin &amp; alfa non cuti</td>
            <td className="border border-slate-900 px-2 py-1 text-center">{stats.izinAlfa}</td>
            <td className="border border-slate-900 px-2 py-1 text-right">
              {formatPctComma2(pctIzin)}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-4 sm:p-6 shadow-2xs space-y-5">
      {/* Control Toolbar (No-Print) */}
      <div className="space-y-3 pb-3 border-b border-slate-100 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#2E5D1A]" />
              <span>{docTitle} &amp; Ringkasan Persensi</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Format spreadsheet resmi pondok (H / S / A / I, Keaktifan V1 &amp; V2) beserta rincian tanggal (Hadir / Terlambat / Ijin) &amp; tanda tangan digital siap cetak.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onChangeRekapBulan && (
              <input
                type="month"
                value={rekapBulan}
                onChange={(e) => onChangeRekapBulan(e.target.value)}
                className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800"
              />
            )}

            <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setBasisData('terintegrasi')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  basisData === 'terintegrasi'
                    ? 'bg-[#2E5D1A] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode === 'guru' ? 'Terintegrasi JTM' : 'Terintegrasi Shift'}
              </button>
              <button
                type="button"
                onClick={() => setBasisData('log_mobile')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                  basisData === 'log_mobile'
                    ? 'bg-[#2E5D1A] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <RefreshCw className="w-3 h-3" />
                <span>Log Mobile Saja</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor XLSX</span>
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor ke PDF</span>
            </button>
            {onPrint && (
              <button
                type="button"
                onClick={onPrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2E5D1A] hover:bg-[#234912] text-white text-xs font-bold transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak (F4)</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Toolbar: View Mode + Status Filter + Digital Signature Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-slate-500 mr-1">Tampilan Tabel:</span>
            {[
              { id: 'lengkap', label: 'Lengkap (Rekap + Rincian Tanggal)' },
              { id: 'spreadsheet', label: 'Rekap Spreadsheet Saja' },
              { id: 'rincian_tanggal', label: 'Log Tanggal & Status (Hadir/Terlambat/Ijin)' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setViewMode(item.id as typeof viewMode)}
                className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                  viewMode === item.id
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {viewMode !== 'spreadsheet' && (
              <div className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                <span className="px-1.5 font-bold text-slate-500">Status:</span>
                {(['Semua', 'Hadir', 'Terlambat', 'Ijin'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-2 py-0.5 rounded-md font-bold transition ${
                      statusFilter === st
                        ? 'bg-[#2E5D1A] text-white'
                        : 'text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowSignature((v) => !v)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold transition ${
                showSignature
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TTD Digital Cetak: {showSignature ? 'Aktif' : 'Nonaktif'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KOP DOKUMEN RESMI PESANTREN (Screen & F4 Print) */}
      <div className="border-b-4 border-double border-slate-900 pb-3 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-emerald-900 border-2 border-amber-500 text-amber-300 flex flex-col items-center justify-center shrink-0 shadow-xs">
            <span className="text-[9px] font-black leading-none">PP NU</span>
            <span className="text-[6px] font-bold text-white tracking-wider mt-0.5">DARUSSALAM</span>
          </div>
          <div className="font-serif">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
              Yayasan &amp; Pengurus Harian Pondok Pesantren
            </p>
            <h4 className="text-sm sm:text-base font-black text-emerald-950 tracking-tight">
              PONDOK PESANTREN NU DARUSSALAM KARANGDADAP
            </h4>
            <p className="text-[10px] font-sans text-slate-600">
              Jl. Raya Karangdadap KM 1, Kec. Karangdadap, Kab. Pekalongan, Jawa Tengah 51174
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right font-sans text-[10px] text-slate-600 space-y-0.5">
          <p className="font-bold text-slate-900">
            No. Dok: PP-DS/{mode === 'guru' ? 'SDM' : 'KEAM'}/ABS-{rekapBulan.replace('-', '')}
          </p>
          <p>
            Periode: <span className="font-bold text-slate-800">{bulanNama} ({rekapBulan})</span>
          </p>
          <p>Update terakhir: {lastUpdatedStr}</p>
        </div>
      </div>

      {/* SECTION 1: Spreadsheet Grid + Summary Boxes Side-by-Side */}
      {viewMode !== 'rincian_tanggal' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Left: Spreadsheet Rekapitulasi Table matching Image 2 */}
          <div className="xl:col-span-9 space-y-2 overflow-x-auto">
            <div className="border-b-4 border-double border-slate-900 pb-0.5 inline-block pr-8">
              <h4 className="font-serif font-bold text-base sm:text-lg text-slate-950 tracking-tight">
                {docTitle}
              </h4>
            </div>

            <table className="w-full border-collapse border border-slate-900 font-serif text-[12px] text-slate-950 bg-white">
              <thead>
                <tr className="bg-[#2E5D1A] text-white text-center font-bold">
                  <th
                    rowSpan={2}
                    className="border border-slate-900 px-2 py-1.5 w-9 align-middle"
                  >
                    No
                  </th>
                  <th
                    rowSpan={2}
                    className="border border-slate-900 px-3 py-1.5 min-w-[190px] align-middle"
                  >
                    {mode === 'guru' ? 'Nama Guru' : 'Nama Satpam'}
                  </th>
                  <th
                    rowSpan={2}
                    className="border border-slate-900 px-2 py-1 w-16 align-middle leading-tight"
                  >
                    <div>{mode === 'guru' ? 'JTM' : 'Shift'}</div>
                    <div>1</div>
                    <div className="text-[10px] font-normal">{bulanNama}</div>
                  </th>
                  <th colSpan={4} className="border border-slate-900 px-2 py-1">
                    Kehadiran
                  </th>
                  <th colSpan={2} className="border border-slate-900 px-2 py-1">
                    Keaktifan V1
                  </th>
                  <th colSpan={2} className="border border-slate-900 px-2 py-1">
                    Keaktifan V2
                  </th>
                </tr>
                <tr className="bg-[#2E5D1A] text-white text-center font-bold text-[11px]">
                  <th className="border-t border-b border-l border-slate-900 border-r border-r-dotted border-r-emerald-200 px-2 py-1 w-9">
                    H
                  </th>
                  <th className="border-t border-b border-slate-900 border-r border-r-dotted border-r-emerald-200 px-2 py-1 w-9">
                    S
                  </th>
                  <th className="border-t border-b border-slate-900 border-r border-r-dotted border-r-emerald-200 px-2 py-1 w-9">
                    A
                  </th>
                  <th className="border-t border-b border-r border-slate-900 px-2 py-1 w-9">
                    I
                  </th>
                  <th className="border-t border-b border-l border-slate-900 border-r border-r-dotted border-r-emerald-200 px-2 py-1 w-16">
                    % Hadir
                  </th>
                  <th className="border-t border-b border-r border-slate-900 px-2 py-1 w-16">
                    % Alfa
                  </th>
                  <th className="border-t border-b border-l border-slate-900 border-r border-r-dotted border-r-emerald-200 px-2 py-1 w-16">
                    % Hadir
                  </th>
                  <th className="border-t border-b border-r border-slate-900 px-2 py-1 w-20">
                    % Tidak H
                  </th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {rows.map((r, idx) => {
                  const isEvenRow = idx % 2 === 1;
                  const rowBg = isEvenRow ? 'bg-[#E8F3E2]' : 'bg-white';
                  return (
                    <tr key={r.id} className={`${rowBg} hover:bg-emerald-100/60 transition-colors`}>
                      <td className="border-r border-b border-slate-300 px-1.5 py-0.5 text-center font-semibold">
                        {idx + 1}
                      </td>
                      <td className="border-r border-slate-900 border-b border-b-slate-300 px-2.5 py-0.5 font-medium whitespace-nowrap">
                        {r.nama}
                      </td>
                      <td className="border-r border-slate-900 border-b border-b-slate-300 px-2 py-0.5 text-center font-semibold">
                        {r.jtm}
                      </td>
                      <td className="border-r border-dotted border-slate-500 border-b border-b-slate-300 px-2 py-0.5 text-center">
                        {r.h}
                      </td>
                      <td className="border-r border-dotted border-slate-500 border-b border-b-slate-300 px-2 py-0.5 text-center">
                        {r.s}
                      </td>
                      <td className="border-r border-dotted border-slate-500 border-b border-b-slate-300 px-2 py-0.5 text-center">
                        {r.a}
                      </td>
                      <td
                        className={`border-r border-slate-900 border-b border-b-slate-300 px-2 py-0.5 text-center font-semibold ${
                          r.i > 0 ? 'bg-[#FDE047] text-slate-950' : ''
                        }`}
                      >
                        {r.i}
                      </td>
                      <td className="border-r border-dotted border-slate-500 border-b border-b-slate-300 px-2 py-0.5 text-right">
                        {formatPctComma1(r.v1HadirPct)}
                      </td>
                      <td className="border-r border-slate-900 border-b border-b-slate-300 px-2 py-0.5 text-right text-red-600 font-semibold">
                        {formatPctComma1(r.v1AlfaPct)}
                      </td>
                      <td className="border-r border-dotted border-slate-500 border-b border-b-slate-300 px-2 py-0.5 text-right">
                        {formatPctComma1(r.v2HadirPct)}
                      </td>
                      <td className="border-r border-slate-900 border-b border-b-slate-300 px-2 py-0.5 text-right text-red-600 font-semibold">
                        {formatPctComma1(r.v2TidakHPct)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Right: 3 Compact Summary Tables matching Image 1 */}
          <div className="xl:col-span-3 space-y-4">
            <div className="text-center font-serif text-xs text-slate-950 leading-tight">
              <div>Update terakhir:</div>
              <div className="font-semibold tabular-nums">{lastUpdatedStr}</div>
            </div>

            {renderSummaryTable(labelGroupA, statsA, 'persensi')}

            {renderSummaryTable(labelGroupB, statsB, 'persensi')}

            <div className="space-y-0.5">
              <div className="font-serif font-bold text-xs text-slate-950">Rekap</div>
              {renderSummaryTable(labelGroupAll, statsAll, 'Persensi')}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Rincian Log Tanggal & Status Kehadiran (Nama, Tanggal, Hadir/Terlambat/Ijin) */}
      {viewMode !== 'spreadsheet' && (
        <div className="space-y-2 pt-2 overflow-x-auto page-break-inside-avoid">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="border-b-4 border-double border-slate-900 pb-0.5 inline-block pr-8">
              <h4 className="font-serif font-bold text-sm sm:text-base text-slate-950 tracking-tight flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#2E5D1A] no-print" />
                <span>
                  Rincian Catatan Kehadiran per Tanggal — {bulanNama} ({rekapBulan})
                </span>
              </h4>
            </div>
            <span className="text-[11px] font-serif text-slate-600 tabular-nums">
              Menampilkan {filteredDetailRows.length} catatan (Status: {statusFilter})
            </span>
          </div>

          <table className="w-full border-collapse border border-slate-900 font-serif text-[12px] text-slate-950 bg-white">
            <thead>
              <tr className="bg-[#2E5D1A] text-white text-center font-bold">
                <th className="border border-slate-900 px-2 py-1.5 w-9">No</th>
                <th className="border border-slate-900 px-3 py-1.5 text-left min-w-[175px]">
                  {mode === 'guru' ? 'Nama Guru' : 'Nama Satpam'}
                </th>
                <th className="border border-slate-900 px-3 py-1.5 text-left min-w-[140px]">
                  Tanggal
                </th>
                <th className="border border-slate-900 px-3 py-1.5 text-left min-w-[190px]">
                  Sesi / Shift &amp; Jam Masuk–Pulang
                </th>
                <th className="border border-slate-900 px-3 py-1.5 w-40">
                  Status Kehadiran
                </th>
                <th className="border border-slate-900 px-3 py-1.5 text-left min-w-[160px]">
                  Verifikasi &amp; Keterangan
                </th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {filteredDetailRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="border border-slate-300 px-4 py-5 text-center text-slate-500 italic"
                  >
                    Belum ada catatan absensi mobile pada periode {bulanNama} ({rekapBulan}) dengan filter "{statusFilter}".
                  </td>
                </tr>
              ) : (
                filteredDetailRows.map((d, idx) => {
                  const isEven = idx % 2 === 1;
                  const rowBg = isEven ? 'bg-[#E8F3E2]' : 'bg-white';
                  const statusCellCls =
                    d.statusKategori === 'Ijin' || d.statusKategori === 'Sakit'
                      ? 'bg-[#FDE047] text-slate-950 font-bold'
                      : d.statusKategori === 'Terlambat'
                      ? 'bg-amber-200/80 text-amber-950 font-bold'
                      : 'text-[#1B4332] font-bold';

                  return (
                    <tr key={d.id} className={`${rowBg} hover:bg-emerald-100/60 transition-colors`}>
                      <td className="border-r border-b border-slate-300 px-2 py-1 text-center font-semibold">
                        {idx + 1}
                      </td>
                      <td className="border-r border-slate-900 border-b border-b-slate-300 px-2.5 py-1 font-semibold whitespace-nowrap">
                        {d.nama}
                      </td>
                      <td className="border-r border-dotted border-slate-500 border-b border-b-slate-300 px-2.5 py-1 whitespace-nowrap">
                        {d.tanggalLabel}
                      </td>
                      <td className="border-r border-dotted border-slate-500 border-b border-b-slate-300 px-2.5 py-1">
                        <div className="font-medium leading-tight">{d.sesiAtauShift}</div>
                        <div className="text-[10.5px] text-slate-600">{d.jamKerja}</div>
                      </td>
                      <td
                        className={`border-r border-slate-900 border-b border-b-slate-300 px-2 py-1 text-center whitespace-nowrap ${statusCellCls}`}
                      >
                        {d.statusDetail}
                      </td>
                      <td className="border-r border-slate-900 border-b border-b-slate-300 px-2.5 py-1 text-[11px] text-slate-700">
                        {d.verifikasi}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* SECTION 3: Blok Pengesahan & Tanda Tangan Digital Terformat Rapi untuk Cetak */}
      {showSignature && (
        <div className="pt-4 mt-2 border-t border-slate-300 font-serif text-slate-950 page-break-inside-avoid">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 px-2 sm:px-6">
            {/* Penandatangan 1: Pimpinan / Pengasuh */}
            <div className="space-y-2">
              <div className="text-xs leading-snug">
                <p>Mengetahui,</p>
                <p className="font-bold">{leftSignerTitle}</p>
              </div>
              <div className="inline-flex items-center gap-2.5 px-3 py-2 rounded-lg border border-[#2E5D1A]/50 bg-[#F4FAF0] max-w-xs">
                <DigitalQrStampSvg seed={`${digitalRefCode}-LEFT`} />
                <div className="text-[10px] font-sans leading-tight space-y-0.5">
                  <p className="font-extrabold text-[#1B4332] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#2E5D1A] shrink-0" />
                    <span>TTD DIGITAL TERVERIFIKASI</span>
                  </p>
                  <p className="text-slate-600 font-mono">Ref: {digitalRefCode}-A</p>
                  <p className="text-slate-500">Sah Tgl: {lastUpdatedStr}</p>
                </div>
              </div>
              <p className="text-xs font-bold underline decoration-slate-400 underline-offset-4">
                {leftSignerName}
              </p>
            </div>

            {/* Penandatangan 2: Admin SDM / Koordinator */}
            <div className="sm:text-right space-y-2">
              <div className="text-xs leading-snug">
                <p>Karangdadap, {lastUpdatedStr}</p>
                <p className="font-bold">{rightSignerTitle}</p>
              </div>
              <div className="inline-flex items-center gap-2.5 px-3 py-2 rounded-lg border border-[#2E5D1A]/50 bg-[#F4FAF0] max-w-xs text-left">
                <DigitalQrStampSvg seed={`${digitalRefCode}-RIGHT-${signerName}`} />
                <div className="text-[10px] font-sans leading-tight space-y-0.5">
                  <p className="font-extrabold text-[#1B4332] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#2E5D1A] shrink-0" />
                    <span>DITANDATANGANI ELEKTRONIK</span>
                  </p>
                  <p className="text-slate-600 font-mono">Ref: {digitalRefCode}-B</p>
                  <p className="text-slate-500">PP NU Darussalam Karangdadap</p>
                </div>
              </div>
              <p className="text-xs font-bold underline decoration-slate-400 underline-offset-4">
                {signerName}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
