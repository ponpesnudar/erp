import type { SantriRecord } from '../data/seed/pondokData.ts';
import type {
  AbsensiSession,
  NilaiSantriMapel,
  SidangKenaikanRecord,
} from './store.ts';

export const SIDANG_NOTIFY_ROLES = [
  'admin_sistem',
  'ketua_imtihan',
  'pengasuh',
  'kepala_madin',
] as const;

export function isSidangNotifyRole(role: string): boolean {
  return (SIDANG_NOTIFY_ROLES as readonly string[]).includes(role);
}

export interface EvaluatedSidangRow {
  santriId: string;
  nis: string;
  nama: string;
  kelas: string;
  gender: 'L' | 'P';
  rec: SidangKenaikanRecord;
  rataImtihan: number;
  poinAbsensi: number;
  totalPoin: number;
  nilaiAkhir: number;
  diBawahKkm: boolean;
}

export interface SidangEvaluationSummary {
  rows: EvaluatedSidangRow[];
  belowKkmRows: EvaluatedSidangRow[];
  pendingBelowKkmRows: EvaluatedSidangRow[];
  classSummaries: {
    kelas: string;
    total: number;
    belowKkm: number;
    naik: number;
    bersyarat: number;
    tidakNaik: number;
    belumDiputuskan: number;
  }[];
}

export function evaluateAllSidangKenaikan(params: {
  santriList: SantriRecord[];
  nilaiList: NilaiSantriMapel[];
  absensiSessions: AbsensiSession[];
  sidangKenaikanRecords: Record<string, SidangKenaikanRecord>;
  sidangKkm: number;
}): SidangEvaluationSummary {
  const {
    santriList,
    nilaiList,
    absensiSessions,
    sidangKenaikanRecords,
    sidangKkm,
  } = params;

  const kbmAttendanceMap = new Map<string, { sakit: number; bolos: number }>();
  absensiSessions.forEach((sess) => {
    Object.entries(sess.kehadiran).forEach(([santriId, st]) => {
      const cur = kbmAttendanceMap.get(santriId) || { sakit: 0, bolos: 0 };
      if (st === 'S') cur.sakit += 1;
      if (st === 'A') cur.bolos += 1;
      kbmAttendanceMap.set(santriId, cur);
    });
  });

  const rows: EvaluatedSidangRow[] = santriList.map((s, idx) => {
    const saved = sidangKenaikanRecords[s.id];
    const sGrades = nilaiList.filter((n) => n.santriId === s.id);
    const sem1Grades = sGrades.filter((g) => !g.semester || g.semester === '1');
    const sem2Grades = sGrades.filter((g) => g.semester === '2');

    const defaultCawu1 =
      sem1Grades.length > 0
        ? Number(
            (
              sem1Grades.reduce((sum, g) => sum + g.nilaiAngka, 0) /
              sem1Grades.length
            ).toFixed(1)
          )
        : 78 - (idx % 5) * 4;

    const defaultCawu2 =
      sem2Grades.length > 0
        ? Number(
            (
              sem2Grades.reduce((sum, g) => sum + g.nilaiAngka, 0) /
              sem2Grades.length
            ).toFixed(1)
          )
        : Number(
            Math.max(50, defaultCawu1 - (idx % 4 === 3 ? 14 : idx % 3 === 2 ? 10 : 2)).toFixed(1)
          );

    const firstGrade = sGrades[0];
    const sessCounts = kbmAttendanceMap.get(s.id) || { sakit: 0, bolos: 0 };
    const defaultSakit = (firstGrade?.sakit ?? 0) + sessCounts.sakit;
    // Realistic baseline bolos on a subset of santri so KKM < 65 consideration appears naturally when needed
    const baselineBolos = idx % 9 === 5 ? 2 : idx % 13 === 7 ? 3 : 0;
    const defaultBolos = (firstGrade?.alpa ?? baselineBolos) + sessCounts.bolos;
    const defaultUbudiyah = firstGrade?.nilaiUbudiyah ?? 82 - (idx % 4) * 5;
    const defaultAmaliyah = firstGrade?.nilaiAkhlaq ?? 84 - (idx % 3) * 6;
    const defaultMqk = firstGrade?.nilaiMQK ?? 80 - (idx % 5) * 5;

    const rec: SidangKenaikanRecord = saved || {
      santriId: s.id,
      rataCawu1: defaultCawu1,
      rataCawu2: defaultCawu2,
      sakitCount: defaultSakit,
      bolosCount: defaultBolos,
      nilaiUbudiyah: defaultUbudiyah,
      nilaiAmaliyah: defaultAmaliyah,
      nilaiMqk: defaultMqk,
      keputusan: 'Belum Diputuskan',
      catatanSidang: '',
    };

    const rataImtihan = Number(((rec.rataCawu1 + rec.rataCawu2) / 2).toFixed(1));
    const poinAbsensi = rec.sakitCount * 0 - rec.bolosCount * 3;
    const totalPoin = Number(
      (
        rataImtihan +
        rec.nilaiUbudiyah +
        rec.nilaiAmaliyah +
        rec.nilaiMqk +
        poinAbsensi
      ).toFixed(1)
    );
    const nilaiAkhir = Math.max(
      0,
      Number(
        (
          (rataImtihan + rec.nilaiUbudiyah + rec.nilaiAmaliyah + rec.nilaiMqk) /
            4 +
          poinAbsensi
        ).toFixed(1)
      )
    );
    const diBawahKkm = nilaiAkhir < sidangKkm;

    return {
      santriId: s.id,
      nis: s.nis,
      nama: s.nama,
      kelas: s.kelas,
      gender: s.gender,
      rec,
      rataImtihan,
      poinAbsensi,
      totalPoin,
      nilaiAkhir,
      diBawahKkm,
    };
  });

  const belowKkmRows = rows.filter((r) => r.diBawahKkm);
  const pendingBelowKkmRows = belowKkmRows.filter(
    (r) => r.rec.keputusan === 'Belum Diputuskan'
  );

  const byKelas = new Map<
    string,
    {
      kelas: string;
      total: number;
      belowKkm: number;
      naik: number;
      bersyarat: number;
      tidakNaik: number;
      belumDiputuskan: number;
    }
  >();

  rows.forEach((r) => {
    const cur = byKelas.get(r.kelas) || {
      kelas: r.kelas,
      total: 0,
      belowKkm: 0,
      naik: 0,
      bersyarat: 0,
      tidakNaik: 0,
      belumDiputuskan: 0,
    };
    cur.total += 1;
    if (r.diBawahKkm) cur.belowKkm += 1;
    if (r.rec.keputusan === 'Naik Kelas') cur.naik += 1;
    else if (r.rec.keputusan === 'Naik Bersyarat') cur.bersyarat += 1;
    else if (r.rec.keputusan === 'Tidak Naik') cur.tidakNaik += 1;
    else cur.belumDiputuskan += 1;
    byKelas.set(r.kelas, cur);
  });

  return {
    rows,
    belowKkmRows,
    pendingBelowKkmRows,
    classSummaries: Array.from(byKelas.values()),
  };
}
