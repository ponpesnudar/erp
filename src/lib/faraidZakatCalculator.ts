export type MayitGender = 'Laki-laki' | 'Perempuan';

export type HeirKey =
  | 'suami'
  | 'istri'
  | 'anak_lk'
  | 'anak_pr'
  | 'cucu_lk'
  | 'cucu_pr'
  | 'cicit_lk'
  | 'ayah'
  | 'ibu'
  | 'kakek'
  | 'nenek_ibu'
  | 'nenek_ayah'
  | 'sdr_kandung_lk'
  | 'sdr_kandung_pr'
  | 'sdr_seayah_lk'
  | 'sdr_seayah_pr'
  | 'sdr_seibu_lk'
  | 'sdr_seibu_pr'
  | 'keponakan_kandung_lk'
  | 'keponakan_seayah_lk'
  | 'paman_kandung'
  | 'paman_seayah'
  | 'sepupu_kandung'
  | 'sepupu_seayah';

export interface HeirDefinition {
  key: HeirKey;
  label: string;
  arab: string;
  gender: 'L' | 'P';
  allowMultiple: boolean;
  defaultMax?: number;
}

export const HEIR_DEFINITIONS: HeirDefinition[] = [
  { key: 'suami', label: 'Suami', arab: 'الزوج', gender: 'L', allowMultiple: false, defaultMax: 1 },
  { key: 'istri', label: 'Istri', arab: 'الزوجة', gender: 'P', allowMultiple: true, defaultMax: 4 },
  { key: 'anak_lk', label: 'Anak lelaki', arab: 'الابن', gender: 'L', allowMultiple: true },
  { key: 'anak_pr', label: 'Anak perempuan', arab: 'البنت', gender: 'P', allowMultiple: true },
  { key: 'cucu_lk', label: 'Cucu lelaki dari anak laki-laki', arab: 'ابن الابن', gender: 'L', allowMultiple: true },
  { key: 'cucu_pr', label: 'Cucu perempuan dari anak laki-laki', arab: 'بنت الابن', gender: 'P', allowMultiple: true },
  { key: 'cicit_lk', label: 'Cicit laki-laki dari jalur laki-laki', arab: 'ابن ابن ابن', gender: 'L', allowMultiple: true },
  { key: 'ayah', label: 'Ayah', arab: 'الأب', gender: 'L', allowMultiple: false, defaultMax: 1 },
  { key: 'ibu', label: 'Ibu', arab: 'الأم', gender: 'P', allowMultiple: false, defaultMax: 1 },
  { key: 'kakek', label: 'Kakek dari ayah', arab: 'الجد', gender: 'L', allowMultiple: false, defaultMax: 1 },
  { key: 'nenek_ibu', label: 'Nenek dari ibu', arab: 'الجدة من الأم', gender: 'P', allowMultiple: false, defaultMax: 1 },
  { key: 'nenek_ayah', label: 'Nenek dari ayah', arab: 'الجدة من الأب', gender: 'P', allowMultiple: false, defaultMax: 1 },
  { key: 'sdr_kandung_lk', label: 'Sdr. laki-laki sekandung', arab: 'الأخ الشقيق', gender: 'L', allowMultiple: true },
  { key: 'sdr_kandung_pr', label: 'Sdr. perempuan sekandung', arab: 'الأخت الشقيقة', gender: 'P', allowMultiple: true },
  { key: 'sdr_seayah_lk', label: 'Sdr. laki-laki seayah', arab: 'الأخ لأب', gender: 'L', allowMultiple: true },
  { key: 'sdr_seayah_pr', label: 'Sdr. perempuan seayah', arab: 'الأخت لأب', gender: 'P', allowMultiple: true },
  { key: 'sdr_seibu_lk', label: 'Sdr. laki-laki seibu', arab: 'الأخ لأم', gender: 'L', allowMultiple: true },
  { key: 'sdr_seibu_pr', label: 'Sdr. perempuan seibu', arab: 'الأخت لأم', gender: 'P', allowMultiple: true },
  { key: 'keponakan_kandung_lk', label: 'Anak lelaki dari saudara laki-laki yang sekandung', arab: 'ابن الأخ الشقيق', gender: 'L', allowMultiple: true },
  { key: 'keponakan_seayah_lk', label: 'Anak lelaki dari saudara laki-laki yang seayah', arab: 'ابن الأخ لأب', gender: 'L', allowMultiple: true },
  { key: 'paman_kandung', label: 'Paman (saudara laki-lakinya ayah) yang sekandung', arab: 'العم الشقيق', gender: 'L', allowMultiple: true },
  { key: 'paman_seayah', label: 'Paman (saudara laki-lakinya ayah) yang seayah', arab: 'العم لأب', gender: 'L', allowMultiple: true },
  { key: 'sepupu_kandung', label: 'Anak lelaki dari paman sekandung', arab: 'ابن العم الشقيق', gender: 'L', allowMultiple: true },
  { key: 'sepupu_seayah', label: 'Anak lelaki dari paman seayah', arab: 'ابن العم لأب', gender: 'L', allowMultiple: true },
];

export interface FaraidShareRow {
  key: HeirKey;
  jumlah: number;
  label: string;
  arab: string;
  furudh: string;
  siham: number;
  persen: number;
  nominalTotal: number;
  nominalPerOrang: number;
  penjelasan: string;
}

export interface FaraidBlockedRow {
  key: HeirKey;
  jumlah: number;
  label: string;
  arab: string;
  keterangan: string;
}

export interface FaraidCalculationResult {
  raddAul: 'Tidak Ada' | 'Aul' | 'Radd';
  inkisar: 'Tidak Ada' | 'Ada (Disesuaikan)';
  amAwal: number;
  amAkhir: number;
  pembagian: FaraidShareRow[];
  terhalang: FaraidBlockedRow[];
  penjelasanRingkas: string[];
}

function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return a || b || 1;
  return Math.abs(a * b) / gcd(a, b);
}

export function calculateFaraid(
  mayit: MayitGender,
  countsInput: Partial<Record<HeirKey, number>>,
  jumlahHarta: number
): FaraidCalculationResult {
  const c: Record<HeirKey, number> = {
    suami: 0,
    istri: 0,
    anak_lk: 0,
    anak_pr: 0,
    cucu_lk: 0,
    cucu_pr: 0,
    cicit_lk: 0,
    ayah: 0,
    ibu: 0,
    kakek: 0,
    nenek_ibu: 0,
    nenek_ayah: 0,
    sdr_kandung_lk: 0,
    sdr_kandung_pr: 0,
    sdr_seayah_lk: 0,
    sdr_seayah_pr: 0,
    sdr_seibu_lk: 0,
    sdr_seibu_pr: 0,
    keponakan_kandung_lk: 0,
    keponakan_seayah_lk: 0,
    paman_kandung: 0,
    paman_seayah: 0,
    sepupu_kandung: 0,
    sepupu_seayah: 0,
  };

  for (const def of HEIR_DEFINITIONS) {
    const raw = Math.max(0, Math.floor(countsInput[def.key] || 0));
    if (def.key === 'suami' && mayit === 'Laki-laki') continue;
    if (def.key === 'istri' && mayit === 'Perempuan') continue;
    c[def.key] = def.defaultMax ? Math.min(raw, def.defaultMax) : raw;
  }

  const defMap = new Map(HEIR_DEFINITIONS.map((d) => [d.key, d]));
  const terhalang: FaraidBlockedRow[] = [];
  const block = (key: HeirKey, alasan: string) => {
    if (c[key] > 0) {
      const def = defMap.get(key)!;
      terhalang.push({
        key,
        jumlah: c[key],
        label: `${c[key]} ${def.label}`,
        arab: def.arab,
        keterangan: alasan,
      });
      c[key] = 0;
    }
  };

  // --- HUKUM HIJAB (PENGHALANG AHLI WARIS) ---
  const hasAnakLk = c.anak_lk > 0;
  const hasCucuLk = c.cucu_lk > 0;
  const hasCicitLk = c.cicit_lk > 0;
  const hasFarulWaritsLk = hasAnakLk || hasCucuLk || hasCicitLk;
  const hasFarulWaritsAll = hasFarulWaritsLk || c.anak_pr > 0 || c.cucu_pr > 0;
  const hasAyah = c.ayah > 0;

  if (hasAnakLk) {
    block('cucu_lk', 'Karena ada Anak lelaki (الابن)');
    block('cicit_lk', 'Karena ada Anak lelaki (الابن)');
    block('cucu_pr', 'Karena ada Anak lelaki (الابن)');
  } else if (hasCucuLk) {
    block('cicit_lk', 'Karena ada Cucu lelaki (ابن الابن)');
  }

  if (c.anak_pr >= 2 && !hasCucuLk && !hasAnakLk) {
    block('cucu_pr', 'Karena ada 2+ Anak perempuan yang menghabiskan jatah 2/3');
  }

  if (hasAyah) {
    block('kakek', 'Karena ada Ayah (الأب)');
    block('nenek_ayah', 'Karena ada Ayah (الأب)');
  }
  if (c.ibu > 0) {
    block('nenek_ibu', 'Karena ada Ibu (الأم)');
    block('nenek_ayah', 'Karena ada Ibu (الأم)');
  }

  // Penghalang Hawasyi (Saudara, Keponakan, Paman, Sepupu)
  const alasanAyahAnak =
    hasAnakLk && hasAyah
      ? 'Karena ada Anak lelaki (الابن) yang bersamaan dengan Ayah (الأب).'
      : hasAnakLk
      ? 'Karena ada Anak lelaki (الابن).'
      : hasCucuLk && hasAyah
      ? 'Karena ada Cucu lelaki (ابن الابن) yang bersamaan dengan Ayah (الأب).'
      : hasCucuLk
      ? 'Karena ada Cucu lelaki (ابن الابن).'
      : hasCicitLk
      ? 'Karena ada Cicit laki-laki (ابن ابن ابن).'
      : hasAyah
      ? 'Karena ada Ayah (الأب).'
      : '';

  if (alasanAyahAnak) {
    (
      [
        'sdr_kandung_lk',
        'sdr_kandung_pr',
        'sdr_seayah_lk',
        'sdr_seayah_pr',
        'sdr_seibu_lk',
        'sdr_seibu_pr',
        'keponakan_kandung_lk',
        'keponakan_seayah_lk',
        'paman_kandung',
        'paman_seayah',
        'sepupu_kandung',
        'sepupu_seayah',
      ] as HeirKey[]
    ).forEach((k) => block(k, alasanAyahAnak));
  }

  // Saudara seibu terhalang oleh keturunan perempuan & kakek juga
  if (hasFarulWaritsAll || c.kakek > 0) {
    const why = hasFarulWaritsAll
      ? 'Karena ada keturunan mayit (Anak / Cucu)'
      : 'Karena ada Kakek dari ayah (الجد)';
    block('sdr_seibu_lk', why);
    block('sdr_seibu_pr', why);
  }

  // Penghalang berjenjang antar saudara & ashabah
  const sdrKandungBersamaFarulPr = c.sdr_kandung_pr > 0 && (c.anak_pr > 0 || c.cucu_pr > 0);
  if (c.sdr_kandung_lk > 0 || sdrKandungBersamaFarulPr) {
    const why =
      c.sdr_kandung_lk > 0
        ? 'Karena ada Saudara laki-laki sekandung (الأخ الشقيق)'
        : 'Karena Saudara perempuan sekandung menjadi Ashabah ma’al Ghair';
    block('sdr_seayah_lk', why);
    block('sdr_seayah_pr', why);
    block('keponakan_kandung_lk', why);
    block('keponakan_seayah_lk', why);
    block('paman_kandung', why);
    block('paman_seayah', why);
    block('sepupu_kandung', why);
    block('sepupu_seayah', why);
  }

  if (c.sdr_seayah_lk > 0 || (c.sdr_seayah_pr > 0 && (c.anak_pr > 0 || c.cucu_pr > 0))) {
    const why = 'Karena ada Saudara seayah yang menjadi Ashabah';
    block('keponakan_kandung_lk', why);
    block('keponakan_seayah_lk', why);
    block('paman_kandung', why);
    block('paman_seayah', why);
    block('sepupu_kandung', why);
    block('sepupu_seayah', why);
  }

  if (c.sdr_kandung_pr >= 2 && c.sdr_seayah_lk === 0) {
    block('sdr_seayah_pr', 'Karena 2+ Saudara perempuan sekandung mengambil 2/3');
  }

  if (c.keponakan_kandung_lk > 0) {
    const why = 'Karena ada Anak lelaki saudara sekandung';
    block('keponakan_seayah_lk', why);
    block('paman_kandung', why);
    block('paman_seayah', why);
    block('sepupu_kandung', why);
    block('sepupu_seayah', why);
  }
  if (c.keponakan_seayah_lk > 0) {
    const why = 'Karena ada Anak lelaki saudara seayah';
    block('paman_kandung', why);
    block('paman_seayah', why);
    block('sepupu_kandung', why);
    block('sepupu_seayah', why);
  }
  if (c.paman_kandung > 0) {
    const why = 'Karena ada Paman sekandung (العم الشقيق)';
    block('paman_seayah', why);
    block('sepupu_kandung', why);
    block('sepupu_seayah', why);
  }
  if (c.paman_seayah > 0) {
    const why = 'Karena ada Paman seayah (العم لأب)';
    block('sepupu_kandung', why);
    block('sepupu_seayah', why);
  }
  if (c.sepupu_kandung > 0) {
    block('sepupu_seayah', 'Karena ada Anak lelaki paman sekandung');
  }

  // --- PENENTUAN FURUDH & ASHABAH ---
  interface PortionSpec {
    key: HeirKey;
    count: number;
    num: number;
    den: number;
    furudh: string;
    isAshabah?: boolean;
    ashabahWeight?: number; // 2 for male, 1 for female
    penjelasan: string;
  }

  const specs: PortionSpec[] = [];
  const explanationNotes: string[] = [];

  // 1. Suami / Istri
  if (c.suami > 0) {
    const den = hasFarulWaritsAll ? 4 : 2;
    specs.push({
      key: 'suami',
      count: 1,
      num: 1,
      den,
      furudh: `1/${den}`,
      penjelasan: hasFarulWaritsAll
        ? 'Suami mendapat 1/4 karena mayit meninggalkan anak/cucu.'
        : 'Suami mendapat 1/2 karena mayit tidak memiliki keturunan.',
    });
  }
  if (c.istri > 0) {
    const den = hasFarulWaritsAll ? 8 : 4;
    specs.push({
      key: 'istri',
      count: c.istri,
      num: 1,
      den,
      furudh: `1/${den}`,
      penjelasan: hasFarulWaritsAll
        ? `Istri mendapat 1/8 dibagi ${c.istri} orang karena mayit meninggalkan anak/cucu.`
        : `Istri mendapat 1/4 dibagi ${c.istri} orang karena mayit tidak memiliki keturunan.`,
    });
  }

  // 2. Ayah & Kakek
  if (c.ayah > 0) {
    if (hasFarulWaritsLk) {
      specs.push({
        key: 'ayah',
        count: 1,
        num: 1,
        den: 6,
        furudh: '1/6',
        penjelasan: 'Ayah mendapat 1/6 pasti karena ada anak/cucu laki-laki.',
      });
    } else if (c.anak_pr > 0 || c.cucu_pr > 0) {
      specs.push({
        key: 'ayah',
        count: 1,
        num: 1,
        den: 6,
        furudh: '1/6 + Sisa',
        isAshabah: true,
        ashabahWeight: 1,
        penjelasan: 'Ayah mendapat 1/6 sekaligus berhak atas sisa (Ashabah) karena hanya ada keturunan perempuan.',
      });
    } else {
      specs.push({
        key: 'ayah',
        count: 1,
        num: 0,
        den: 1,
        furudh: 'Sisa',
        isAshabah: true,
        ashabahWeight: 1,
        penjelasan: 'Ayah menjadi Ashabah bin-Nafs mengambil seluruh sisa setelah Dzawil Furudh.',
      });
    }
  } else if (c.kakek > 0) {
    if (hasFarulWaritsLk) {
      specs.push({
        key: 'kakek',
        count: 1,
        num: 1,
        den: 6,
        furudh: '1/6',
        penjelasan: 'Kakek mendapat 1/6 karena tidak ada Ayah dan ada keturunan laki-laki.',
      });
    } else {
      specs.push({
        key: 'kakek',
        count: 1,
        num: c.anak_pr > 0 || c.cucu_pr > 0 ? 1 : 0,
        den: c.anak_pr > 0 || c.cucu_pr > 0 ? 6 : 1,
        furudh: c.anak_pr > 0 || c.cucu_pr > 0 ? '1/6 + Sisa' : 'Sisa',
        isAshabah: true,
        ashabahWeight: 1,
        penjelasan: 'Kakek menggantikan kedudukan Ayah mengambil sisa harta.',
      });
    }
  }

  // 3. Ibu & Nenek
  const totalSaudara =
    c.sdr_kandung_lk +
    c.sdr_kandung_pr +
    c.sdr_seayah_lk +
    c.sdr_seayah_pr +
    c.sdr_seibu_lk +
    c.sdr_seibu_pr;

  if (c.ibu > 0) {
    const useOneSixth = hasFarulWaritsAll || totalSaudara >= 2;
    const isUmariyah = !hasFarulWaritsAll && totalSaudara < 2 && c.ayah > 0 && (c.suami > 0 || c.istri > 0);
    if (isUmariyah) {
      // Kasus Gharawain: Ibu mendapat 1/3 dari SISA setelah pasangan (Suami 1/2 -> ibu 1/6 dari pokok; Istri 1/4 -> ibu 1/4 dari pokok)
      if (c.suami > 0) {
        specs.push({
          key: 'ibu',
          count: 1,
          num: 1,
          den: 6,
          furudh: '1/3 Sisa (1/6)',
          penjelasan: 'Kasus Umariyatain: Ibu mendapat 1/3 dari sisa setelah suami (= 1/6 pokok).',
        });
      } else {
        specs.push({
          key: 'ibu',
          count: 1,
          num: 1,
          den: 4,
          furudh: '1/3 Sisa (1/4)',
          penjelasan: 'Kasus Umariyatain: Ibu mendapat 1/3 dari sisa setelah istri (= 1/4 pokok).',
        });
      }
    } else {
      specs.push({
        key: 'ibu',
        count: 1,
        num: 1,
        den: useOneSixth ? 6 : 3,
        furudh: useOneSixth ? '1/6' : '1/3',
        penjelasan: useOneSixth
          ? 'Ibu mendapat 1/6 karena mayit meninggalkan keturunan atau ≥2 saudara.'
          : 'Ibu mendapat 1/3 karena tidak ada anak dan saudara kurang dari dua.',
      });
    }
  } else if (c.nenek_ibu > 0 || c.nenek_ayah > 0) {
    if (c.nenek_ibu > 0 && c.nenek_ayah > 0) {
      specs.push({
        key: 'nenek_ibu',
        count: 1,
        num: 1,
        den: 12,
        furudh: '1/12 (1/2×1/6)',
        penjelasan: 'Nenek dari ibu & ayah berbagi rata bagian 1/6.',
      });
      specs.push({
        key: 'nenek_ayah',
        count: 1,
        num: 1,
        den: 12,
        furudh: '1/12 (1/2×1/6)',
        penjelasan: 'Nenek dari ibu & ayah berbagi rata bagian 1/6.',
      });
    } else if (c.nenek_ibu > 0) {
      specs.push({
        key: 'nenek_ibu',
        count: 1,
        num: 1,
        den: 6,
        furudh: '1/6',
        penjelasan: 'Nenek mendapat 1/6 karena tidak ada Ibu.',
      });
    } else {
      specs.push({
        key: 'nenek_ayah',
        count: 1,
        num: 1,
        den: 6,
        furudh: '1/6',
        penjelasan: 'Nenek dari ayah mendapat 1/6.',
      });
    }
  }

  // 4. Anak & Cucu
  if (c.anak_lk > 0) {
    specs.push({
      key: 'anak_lk',
      count: c.anak_lk,
      num: 0,
      den: 1,
      furudh: 'Sisa',
      isAshabah: true,
      ashabahWeight: 2 * c.anak_lk,
      penjelasan:
        c.anak_pr > 0
          ? 'Anak laki-laki & perempuan menjadi Ashabah bil-Ghair dengan rasio 2 : 1.'
          : 'Anak laki-laki menjadi Ashabah bin-Nafs mengambil seluruh sisa.',
    });
    if (c.anak_pr > 0) {
      specs.push({
        key: 'anak_pr',
        count: c.anak_pr,
        num: 0,
        den: 1,
        furudh: 'Sisa (2:1)',
        isAshabah: true,
        ashabahWeight: 1 * c.anak_pr,
        penjelasan: 'Anak perempuan bersama anak laki-laki menjadi Ashabah bil-Ghair (1 bagian).',
      });
    }
  } else {
    if (c.anak_pr === 1) {
      specs.push({
        key: 'anak_pr',
        count: 1,
        num: 1,
        den: 2,
        furudh: '1/2',
        penjelasan: '1 Anak perempuan tanpa anak laki-laki mendapat 1/2.',
      });
    } else if (c.anak_pr >= 2) {
      specs.push({
        key: 'anak_pr',
        count: c.anak_pr,
        num: 2,
        den: 3,
        furudh: '2/3',
        penjelasan: `${c.anak_pr} Anak perempuan tanpa anak laki-laki mendapat 2/3 dibagi rata.`,
      });
    }

    if (c.cucu_lk > 0) {
      specs.push({
        key: 'cucu_lk',
        count: c.cucu_lk,
        num: 0,
        den: 1,
        furudh: 'Sisa',
        isAshabah: true,
        ashabahWeight: 2 * c.cucu_lk,
        penjelasan: 'Cucu laki-laki menjadi Ashabah (rasio 2:1 jika ada cucu perempuan).',
      });
      if (c.cucu_pr > 0) {
        specs.push({
          key: 'cucu_pr',
          count: c.cucu_pr,
          num: 0,
          den: 1,
          furudh: 'Sisa (2:1)',
          isAshabah: true,
          ashabahWeight: 1 * c.cucu_pr,
          penjelasan: 'Cucu perempuan bersama cucu laki-laki menjadi Ashabah bil-Ghair.',
        });
      }
    } else if (c.cucu_pr > 0) {
      if (c.anak_pr === 1) {
        specs.push({
          key: 'cucu_pr',
          count: c.cucu_pr,
          num: 1,
          den: 6,
          furudh: '1/6',
          penjelasan: 'Cucu perempuan mendapat 1/6 sebagai penyempurna 2/3 bersama 1 anak perempuan.',
        });
      } else if (c.anak_pr === 0) {
        specs.push({
          key: 'cucu_pr',
          count: c.cucu_pr,
          num: c.cucu_pr === 1 ? 1 : 2,
          den: c.cucu_pr === 1 ? 2 : 3,
          furudh: c.cucu_pr === 1 ? '1/2' : '2/3',
          penjelasan: 'Cucu perempuan menggantikan anak perempuan (1/2 tunggal, 2/3 jamak).',
        });
      }
    } else if (c.cicit_lk > 0) {
      specs.push({
        key: 'cicit_lk',
        count: c.cicit_lk,
        num: 0,
        den: 1,
        furudh: 'Sisa',
        isAshabah: true,
        ashabahWeight: 2 * c.cicit_lk,
        penjelasan: 'Cicit laki-laki dari jalur laki-laki menjadi Ashabah bin-Nafs.',
      });
    }
  }

  // 5. Saudara Seibu
  const jmlSdrSeibu = c.sdr_seibu_lk + c.sdr_seibu_pr;
  if (jmlSdrSeibu === 1) {
    const key: HeirKey = c.sdr_seibu_lk > 0 ? 'sdr_seibu_lk' : 'sdr_seibu_pr';
    specs.push({
      key,
      count: 1,
      num: 1,
      den: 6,
      furudh: '1/6',
      penjelasan: '1 Saudara seibu dalam kalalah mendapat 1/6.',
    });
  } else if (jmlSdrSeibu >= 2) {
    if (c.sdr_seibu_lk > 0 && c.sdr_seibu_pr > 0) {
      specs.push({
        key: 'sdr_seibu_lk',
        count: c.sdr_seibu_lk,
        num: c.sdr_seibu_lk,
        den: 3 * jmlSdrSeibu,
        furudh: '1/3 (Berserikat)',
        penjelasan: 'Saudara seibu laki-laki dan perempuan berbagi rata bagian 1/3.',
      });
      specs.push({
        key: 'sdr_seibu_pr',
        count: c.sdr_seibu_pr,
        num: c.sdr_seibu_pr,
        den: 3 * jmlSdrSeibu,
        furudh: '1/3 (Berserikat)',
        penjelasan: 'Saudara seibu laki-laki dan perempuan berbagi rata bagian 1/3.',
      });
    } else if (c.sdr_seibu_lk > 0) {
      specs.push({
        key: 'sdr_seibu_lk',
        count: c.sdr_seibu_lk,
        num: 1,
        den: 3,
        furudh: '1/3',
        penjelasan: `${c.sdr_seibu_lk} Saudara laki-laki seibu berbagi rata 1/3.`,
      });
    } else {
      specs.push({
        key: 'sdr_seibu_pr',
        count: c.sdr_seibu_pr,
        num: 1,
        den: 3,
        furudh: '1/3',
        penjelasan: `${c.sdr_seibu_pr} Saudara perempuan seibu berbagi rata 1/3.`,
      });
    }
  }

  // 6. Saudara Sekandung & Seayah & Ashabah Hawasyi
  if (c.sdr_kandung_lk > 0) {
    specs.push({
      key: 'sdr_kandung_lk',
      count: c.sdr_kandung_lk,
      num: 0,
      den: 1,
      furudh: 'Sisa',
      isAshabah: true,
      ashabahWeight: 2 * c.sdr_kandung_lk,
      penjelasan: 'Saudara laki-laki sekandung menjadi Ashabah.',
    });
    if (c.sdr_kandung_pr > 0) {
      specs.push({
        key: 'sdr_kandung_pr',
        count: c.sdr_kandung_pr,
        num: 0,
        den: 1,
        furudh: 'Sisa (2:1)',
        isAshabah: true,
        ashabahWeight: c.sdr_kandung_pr,
        penjelasan: 'Saudara perempuan sekandung bersama saudara laki-laki sekandung (rasio 2:1).',
      });
    }
  } else if (c.sdr_kandung_pr > 0) {
    if (c.anak_pr > 0 || c.cucu_pr > 0) {
      specs.push({
        key: 'sdr_kandung_pr',
        count: c.sdr_kandung_pr,
        num: 0,
        den: 1,
        furudh: 'Sisa (Ma’al Ghair)',
        isAshabah: true,
        ashabahWeight: c.sdr_kandung_pr,
        penjelasan: 'Saudara perempuan sekandung bersama anak/cucu perempuan menjadi Ashabah ma’al Ghair.',
      });
    } else {
      specs.push({
        key: 'sdr_kandung_pr',
        count: c.sdr_kandung_pr,
        num: c.sdr_kandung_pr === 1 ? 1 : 2,
        den: c.sdr_kandung_pr === 1 ? 2 : 3,
        furudh: c.sdr_kandung_pr === 1 ? '1/2' : '2/3',
        penjelasan:
          c.sdr_kandung_pr === 1
            ? '1 Saudara perempuan sekandung mendapat 1/2.'
            : `${c.sdr_kandung_pr} Saudara perempuan sekandung mendapat 2/3.`,
      });
    }
  }

  if (c.sdr_seayah_lk > 0) {
    specs.push({
      key: 'sdr_seayah_lk',
      count: c.sdr_seayah_lk,
      num: 0,
      den: 1,
      furudh: 'Sisa',
      isAshabah: true,
      ashabahWeight: 2 * c.sdr_seayah_lk,
      penjelasan: 'Saudara laki-laki seayah menjadi Ashabah.',
    });
    if (c.sdr_seayah_pr > 0) {
      specs.push({
        key: 'sdr_seayah_pr',
        count: c.sdr_seayah_pr,
        num: 0,
        den: 1,
        furudh: 'Sisa (2:1)',
        isAshabah: true,
        ashabahWeight: c.sdr_seayah_pr,
        penjelasan: 'Saudara perempuan seayah bersama saudara laki-laki seayah.',
      });
    }
  } else if (c.sdr_seayah_pr > 0) {
    if (c.anak_pr > 0 || c.cucu_pr > 0) {
      specs.push({
        key: 'sdr_seayah_pr',
        count: c.sdr_seayah_pr,
        num: 0,
        den: 1,
        furudh: 'Sisa (Ma’al Ghair)',
        isAshabah: true,
        ashabahWeight: c.sdr_seayah_pr,
        penjelasan: 'Saudara perempuan seayah menjadi Ashabah ma’al Ghair bersama anak perempuan.',
      });
    } else if (c.sdr_kandung_pr === 1) {
      specs.push({
        key: 'sdr_seayah_pr',
        count: c.sdr_seayah_pr,
        num: 1,
        den: 6,
        furudh: '1/6',
        penjelasan: 'Saudara perempuan seayah mendapat 1/6 penyempurna 2/3.',
      });
    } else {
      specs.push({
        key: 'sdr_seayah_pr',
        count: c.sdr_seayah_pr,
        num: c.sdr_seayah_pr === 1 ? 1 : 2,
        den: c.sdr_seayah_pr === 1 ? 2 : 3,
        furudh: c.sdr_seayah_pr === 1 ? '1/2' : '2/3',
        penjelasan: 'Saudara perempuan seayah mendapat 1/2 (tunggal) atau 2/3 (jamak).',
      });
    }
  }

  (
    [
      'keponakan_kandung_lk',
      'keponakan_seayah_lk',
      'paman_kandung',
      'paman_seayah',
      'sepupu_kandung',
      'sepupu_seayah',
    ] as HeirKey[]
  ).forEach((k) => {
    if (c[k] > 0) {
      specs.push({
        key: k,
        count: c[k],
        num: 0,
        den: 1,
        furudh: 'Sisa',
        isAshabah: true,
        ashabahWeight: c[k],
        penjelasan: `${defMap.get(k)?.label} menjadi Ashabah bin-Nafs.`,
      });
    }
  });

  if (specs.length === 0) {
    return {
      raddAul: 'Tidak Ada',
      inkisar: 'Tidak Ada',
      amAwal: 1,
      amAkhir: 1,
      pembagian: [],
      terhalang,
      penjelasanRingkas: ['Pilih minimal 1 ahli waris yang masih hidup untuk memulai perhitungan Faraid.'],
    };
  }

  // Hitung Asal Masalah (KPK penyebut Dzawil Furudh)
  let amAwal = 1;
  for (const s of specs) {
    if (s.num > 0) {
      amAwal = lcm(amAwal, s.den);
    }
  }

  // Hitung Siham Awal
  const rawSiham = specs.map((s) => (s.num > 0 ? Math.round((amAwal / s.den) * s.num) : 0));
  const sumFixedSiham = rawSiham.reduce((a, b) => a + b, 0);
  const ashabahSpecs = specs.filter((s) => s.isAshabah);
  const totalAshabahWeight = ashabahSpecs.reduce((a, b) => a + (b.ashabahWeight || 0), 0);

  let raddAul: FaraidCalculationResult['raddAul'] = 'Tidak Ada';
  let amAkhir = amAwal;
  const finalSiham = [...rawSiham];

  if (sumFixedSiham > amAwal) {
    raddAul = 'Aul';
    amAkhir = sumFixedSiham;
    explanationNotes.push(
      `Terjadi 'Aul karena jumlah siham (${sumFixedSiham}) melebihi Asal Masalah awal (${amAwal}), sehingga Asal Masalah dinaikkan menjadi ${amAkhir}.`
    );
  } else if (sumFixedSiham < amAwal) {
    const sisa = amAwal - sumFixedSiham;
    if (totalAshabahWeight > 0) {
      // Sisa diberikan kepada Ashabah
      specs.forEach((s, idx) => {
        if (s.isAshabah && s.ashabahWeight) {
          const shareFloat = (sisa * s.ashabahWeight) / totalAshabahWeight;
          if (Math.abs(shareFloat - Math.round(shareFloat)) < 1e-6) {
            finalSiham[idx] += Math.round(shareFloat);
          } else {
            // Kalikan seluruh siham & AM agar bulat
            const mult = totalAshabahWeight / gcd(sisa, totalAshabahWeight);
            amAkhir *= mult;
            for (let j = 0; j < finalSiham.length; j++) {
              finalSiham[j] *= mult;
            }
            const newSisa = sisa * mult;
            finalSiham[idx] += Math.round((newSisa * s.ashabahWeight) / totalAshabahWeight);
          }
        }
      });
    } else {
      // Tidak ada Ashabah -> Radd kepada selain Suami/Istri
      const nonSpouseIndices = specs
        .map((s, idx) => ({ s, idx }))
        .filter((x) => x.s.key !== 'suami' && x.s.key !== 'istri');
      if (nonSpouseIndices.length > 0) {
        raddAul = 'Radd';
        const nonSpouseSum = nonSpouseIndices.reduce((a, x) => a + finalSiham[x.idx], 0);
        if (nonSpouseIndices.length === 1 && !specs.some((s) => s.key === 'suami' || s.key === 'istri')) {
          finalSiham[nonSpouseIndices[0].idx] = amAwal;
          amAkhir = amAwal;
        } else if (nonSpouseSum > 0) {
          // Radd proporsional (simplified integer scaling)
          const mult = nonSpouseSum;
          amAkhir = amAwal * mult;
          for (let j = 0; j < finalSiham.length; j++) {
            finalSiham[j] *= mult;
          }
          const sisaScaled = sisa * mult;
          nonSpouseIndices.forEach((x) => {
            finalSiham[x.idx] += Math.round((sisaScaled * rawSiham[x.idx]) / nonSpouseSum);
          });
        }
        explanationNotes.push(
          'Terjadi Radd: sisa harta dikembalikan kepada ahli waris nasab selain pasangan secara proporsional.'
        );
      }
    }
  }

  // Sederhanakan jika semua siham & AM punya FPB > 1 (tetap jaga kejelasan AM Awal vs Akhir bila tidak ada inkisar)
  const inkisarNeeded = specs.some((s, idx) => s.count > 1 && finalSiham[idx] % s.count !== 0);
  if (inkisarNeeded) {
    let tashihFactor = 1;
    specs.forEach((s, idx) => {
      if (s.count > 1) {
        const g = gcd(finalSiham[idx], s.count);
        const need = s.count / g;
        tashihFactor = lcm(tashihFactor, need);
      }
    });
    if (tashihFactor > 1) {
      amAkhir *= tashihFactor;
      for (let j = 0; j < finalSiham.length; j++) {
        finalSiham[j] *= tashihFactor;
      }
    }
  }

  const totalFinalSiham = finalSiham.reduce((a, b) => a + b, 0) || amAkhir;
  const pembagian: FaraidShareRow[] = specs.map((s, idx) => {
    const def = defMap.get(s.key)!;
    const siham = finalSiham[idx];
    const persen = Number(((siham / totalFinalSiham) * 100).toFixed(2));
    const nominalTotal = jumlahHarta > 0 ? Math.round((jumlahHarta * siham) / totalFinalSiham) : 0;
    const nominalPerOrang = s.count > 0 ? Math.round(nominalTotal / s.count) : 0;
    return {
      key: s.key,
      jumlah: s.count,
      label: `${s.count} ${def.label}`,
      arab: def.arab,
      furudh: s.furudh,
      siham,
      persen,
      nominalTotal,
      nominalPerOrang,
      penjelasan: s.penjelasan,
    };
  });

  if (explanationNotes.length === 0) {
    explanationNotes.push(
      `Asal Masalah diselesaikan pada angka ${amAkhir} tanpa penyimpangan Radd/'Aul.`
    );
  }

  return {
    raddAul,
    inkisar: inkisarNeeded ? 'Ada (Disesuaikan)' : 'Tidak Ada',
    amAwal,
    amAkhir,
    pembagian,
    terhalang,
    penjelasanRingkas: explanationNotes,
  };
}

// ==========================================
// KALKULATOR ZAKAT (9 KATEGORI LENGKAP)
// ==========================================

export type ZakatCategoryId =
  | 'pertanian'
  | 'perdagangan'
  | 'emas_perak'
  | 'profesi'
  | 'tambak'
  | 'tanaman_produktif'
  | 'peternakan'
  | 'perusahaan'
  | 'properti';

export interface ZakatResult {
  wajibZakat: boolean;
  nishabLabel: string;
  totalHartaLabel: string;
  kadarPersen: string;
  zakatNominalRp?: number;
  zakatGramEmas?: number;
  zakatKgBeras?: number;
  ringkasan: string;
}

export const HARGA_EMAS_PER_GRAM = 2073048; // Referensi ~ Rp 160.661.220 / 77.5 gr
export const NISHAB_DAGANG_RP = 160661220;
export const NISHAB_BERAS_KG = 815.758;
