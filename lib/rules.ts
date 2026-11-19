/**
 * rules.ts - Logika bisnis inti Pondok Pesantren NU Darussalam Karangdadap
 * - Penentuan predikat raport madin (Arab & Indonesia)
 * - Format penomoran ujian (No. IMT)
 * - Penomoran Induk Santri (NIS atomik)
 * - Algoritma denah acak bebas contek (merata per kelas, anti-bersebelahan)
 */

export interface PredikatResult {
  predikatArab: string;
  predikatId: string;
  grade: string;
  status: 'Lulus' | 'Perbaikan' | 'Gagal';
  min: number;
  max: number;
}

/**
 * Menghitung predikat raport santri berdasarkan standar nilai pesantren:
 * ممتاز = 100
 * جيد جدا = 80 - 99 (nilai 91-99 masuk kategori Jayyid Jiddan, threshold bisa dikonfigurasi)
 * جيد = 70 - 79
 * مقبول = 40 - 69
 * فاشل = 0 - 39
 */
export function predikat(nilai: number, thresholds?: { mumtazMin?: number; jayyidJiddanMin?: number; jayyidMin?: number; maqbulMin?: number }): PredikatResult {
  const mumtazMin = thresholds?.mumtazMin ?? 100;
  const jayyidJiddanMin = thresholds?.jayyidJiddanMin ?? 80;
  const jayyidMin = thresholds?.jayyidMin ?? 70;
  const maqbulMin = thresholds?.maqbulMin ?? 40;

  const score = Math.round(nilai * 10) / 10;

  if (score >= mumtazMin) {
    return {
      predikatArab: 'ممتاز',
      predikatId: 'Istimewa / Sangat Baik Sekali',
      grade: 'A+',
      status: 'Lulus',
      min: mumtazMin,
      max: 100,
    };
  } else if (score >= jayyidJiddanMin) {
    return {
      predikatArab: 'جيد جدا',
      predikatId: 'Baik Sekali',
      grade: 'A',
      status: 'Lulus',
      min: jayyidJiddanMin,
      max: mumtazMin - 0.1,
    };
  } else if (score >= jayyidMin) {
    return {
      predikatArab: 'جيد',
      predikatId: 'Baik',
      grade: 'B',
      status: 'Lulus',
      min: jayyidMin,
      max: jayyidJiddanMin - 0.1,
    };
  } else if (score >= maqbulMin) {
    return {
      predikatArab: 'مقبول',
      predikatId: 'Cukup',
      grade: 'C',
      status: 'Lulus',
      min: maqbulMin,
      max: jayyidMin - 0.1,
    };
  } else {
    return {
      predikatArab: 'فاشل',
      predikatId: 'Kurang / Mengulang',
      grade: 'D',
      status: 'Gagal',
      min: 0,
      max: maqbulMin - 0.1,
    };
  }
}

/**
 * Format nomor urut imtihan / No. IMT
 * Contoh kartu asli: 2MD#079 (Tingkat 2, Madrasah Diniyah Salafiyah, urut 079)
 */
export function nomorUjian(tingkatKelas: string | number, kodeLembaga: string = 'MD', nomorUrut: number): string {
  const padNum = String(nomorUrut).padStart(3, '0');
  const cleanTingkat = String(tingkatKelas).replace(/[^0-9A-Za-z]/g, '').slice(0, 2);
  return `${cleanTingkat}${kodeLembaga}#${padNum}`;
}

export interface NISConfig {
  prefix: string;          // contoh: "DS" atau "PND"
  useYear: boolean;        // contoh: true -> "26"
  nomorAwal: number;       // nomor mulai (misal: 1001, BUKAN hardcode)
  digitCount: number;      // jumlah digit nomor urut, misal: 4
}

/**
 * Format NIS (Nomor Induk Santri) fleksibel dan dinamis
 */
export function formatNIS(counter: number, config: NISConfig, currentYear: number = new Date().getFullYear()): string {
  const currentNum = config.nomorAwal + counter;
  const numPadded = String(currentNum).padStart(config.digitCount, '0');
  const yearSuffix = config.useYear ? String(currentYear).slice(-2) : '';
  
  if (config.prefix && yearSuffix) {
    return `${config.prefix}.${yearSuffix}.${numPadded}`;
  } else if (config.prefix) {
    return `${config.prefix}.${numPadded}`;
  } else if (yearSuffix) {
    return `${yearSuffix}.${numPadded}`;
  }
  return numPadded;
}

export interface SantriPeserta {
  id: string;
  nis: string;
  nama: string;
  gender: 'L' | 'P';
  kelas: string;       // misal '1 MDS', '2 MDS A', '3 MDS'
  tingkat: number;     // 1 s.d. 6
  nomorUjian?: string;
}

export interface Kursi {
  id: string;
  ruangId: string;
  baris: number;
  kolom: number;
  santri?: SantriPeserta | null;
  bentrok?: boolean;
}

export interface RuangUjian {
  id: string;
  nama: string;        // 'Ruang 01', 'Ruang 02'
  kode: string;        // 'R1', 'R2'
  gender: 'L' | 'P';
  baris: number;
  kolom: number;
  kapasitas: number;
  kursiList: Kursi[];
}

export interface ConflictInfo {
  ruangId: string;
  ruangNama: string;
  posisi1: { baris: number; kolom: number };
  posisi2: { baris: number; kolom: number };
  santri1: SantriPeserta;
  santri2: SantriPeserta;
  tipe: 'horizontal' | 'vertikal' | 'diagonal';
}

/**
 * Validasi bentrok dalam satu ruang ujian:
 * Mengecek apakah ada santri dari kelas yang sama bersebelahan (kiri-kanan, depan-belakang, diagonal).
 */
export function validateRoom(ruang: RuangUjian): { conflicts: ConflictInfo[]; score: number } {
  const grid: (SantriPeserta | null)[][] = Array.from({ length: ruang.baris }, () =>
    Array(ruang.kolom).fill(null)
  );

  ruang.kursiList.forEach((k) => {
    if (k.baris < ruang.baris && k.kolom < ruang.kolom) {
      grid[k.baris][k.kolom] = k.santri || null;
    }
  });

  const conflicts: ConflictInfo[] = [];

  for (let r = 0; r < ruang.baris; r++) {
    for (let c = 0; c < ruang.kolom; c++) {
      const s1 = grid[r][c];
      if (!s1) continue;

      // Cek kanan (horizontal)
      if (c + 1 < ruang.kolom) {
        const s2 = grid[r][c + 1];
        if (s2 && s1.kelas === s2.kelas) {
          conflicts.push({
            ruangId: ruang.id,
            ruangNama: ruang.nama,
            posisi1: { baris: r, kolom: c },
            posisi2: { baris: r, kolom: c + 1 },
            santri1: s1,
            santri2: s2,
            tipe: 'horizontal',
          });
        }
      }

      // Cek bawah (vertikal)
      if (r + 1 < ruang.baris) {
        const s2 = grid[r + 1][c];
        if (s2 && s1.kelas === s2.kelas) {
          conflicts.push({
            ruangId: ruang.id,
            ruangNama: ruang.nama,
            posisi1: { baris: r, kolom: c },
            posisi2: { baris: r + 1, kolom: c },
            santri1: s1,
            santri2: s2,
            tipe: 'vertikal',
          });
        }
      }

      // Cek diagonal kanan-bawah
      if (r + 1 < ruang.baris && c + 1 < ruang.kolom) {
        const s2 = grid[r + 1][c + 1];
        if (s2 && s1.kelas === s2.kelas) {
          conflicts.push({
            ruangId: ruang.id,
            ruangNama: ruang.nama,
            posisi1: { baris: r, kolom: c },
            posisi2: { baris: r + 1, kolom: c + 1 },
            santri1: s1,
            santri2: s2,
            tipe: 'diagonal',
          });
        }
      }

      // Cek diagonal kiri-bawah
      if (r + 1 < ruang.baris && c - 1 >= 0) {
        const s2 = grid[r + 1][c - 1];
        if (s2 && s1.kelas === s2.kelas) {
          conflicts.push({
            ruangId: ruang.id,
            ruangNama: ruang.nama,
            posisi1: { baris: r, kolom: c },
            posisi2: { baris: r + 1, kolom: c - 1 },
            santri1: s1,
            santri2: s2,
            tipe: 'diagonal',
          });
        }
      }
    }
  }

  // Score 100 - (conflicts horizontal/vertikal * 15 + diagonal * 5)
  let penalty = 0;
  conflicts.forEach((c) => {
    penalty += c.tipe === 'diagonal' ? 5 : 15;
  });
  const score = Math.max(0, 100 - penalty);

  return { conflicts, score };
}

/**
 * Algoritma acak denah cerdas:
 * 1. Pisahkan putra dan putri secara syar'i.
 * 2. Bagi santri dari setiap kelas secara merata ke seluruh ruangan yang tersedia.
 * 3. Tata kursi dengan pola selang-seling kelas (Round-Robin interleaving).
 * 4. Optimasi lokal (local search swaps) untuk meminimalisir dan menghilangkan bentrok sekelas.
 */
export function generateSeating(
  santriList: SantriPeserta[],
  roomConfigs: { id: string; nama: string; kode: string; gender: 'L' | 'P'; baris: number; kolom: number }[],
  randomSeed: number = Date.now()
): RuangUjian[] {
  // LCG pseudo-random generator dengan seed agar reproduktif & bisa diacak ulang
  let currentSeed = randomSeed;
  function seededRandom(): number {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  }

  function shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  const resultRooms: RuangUjian[] = [];

  (['L', 'P'] as ('L' | 'P')[]).forEach((gender) => {
    const genderSantri = santriList.filter((s) => s.gender === gender);
    const genderRooms = roomConfigs.filter((r) => r.gender === gender);

    if (genderRooms.length === 0 || genderSantri.length === 0) return;

    // Kelompokkan santri per kelas
    const byClass: Record<string, SantriPeserta[]> = {};
    genderSantri.forEach((s) => {
      if (!byClass[s.kelas]) byClass[s.kelas] = [];
      byClass[s.kelas].push(s);
    });

    // Acak santri dalam kelas masing-masing
    Object.keys(byClass).forEach((cls) => {
      byClass[cls] = shuffle(byClass[cls]);
    });

    // Hitung total kapasitas & siapkan slot ruangan
    const roomQueues: SantriPeserta[][] = Array.from({ length: genderRooms.length }, () => []);

    // Distribusikan santri dari setiap kelas secara merata (interleaved) ke ruangan
    const sortedClasses = Object.keys(byClass).sort((a, b) => byClass[b].length - byClass[a].length);

    sortedClasses.forEach((cls) => {
      const students = byClass[cls];
      students.forEach((student, idx) => {
        const targetRoomIdx = idx % genderRooms.length;
        roomQueues[targetRoomIdx].push(student);
      });
    });

    // Sekarang susun denah per ruang dengan pola interleaving kelas
    genderRooms.forEach((rConfig, rIdx) => {
      const roomStudents = roomQueues[rIdx];
      const totalSeats = rConfig.baris * rConfig.kolom;

      // Kelompokkan santri di ruangan ini per kelas
      const roomClassBuckets: Record<string, SantriPeserta[]> = {};
      roomStudents.forEach((s) => {
        if (!roomClassBuckets[s.kelas]) roomClassBuckets[s.kelas] = [];
        roomClassBuckets[s.kelas].push(s);
      });

      // Interleave buckets agar santri berurutan berbeda kelas
      const classKeys = Object.keys(roomClassBuckets).sort(
        (a, b) => roomClassBuckets[b].length - roomClassBuckets[a].length
      );

      const placedStudents: (SantriPeserta | null)[] = [];
      let totalAssigned = 0;

      while (totalAssigned < roomStudents.length) {
        for (const cKey of classKeys) {
          const bucket = roomClassBuckets[cKey];
          if (bucket.length > 0) {
            placedStudents.push(bucket.shift()!);
            totalAssigned++;
          }
        }
      }

      // Isi sisa kursi kosong
      while (placedStudents.length < totalSeats) {
        placedStudents.push(null);
      }

      // Susun grid kursi
      const kursiList: Kursi[] = [];
      let sIdx = 0;
      for (let row = 0; row < rConfig.baris; row++) {
        for (let col = 0; col < rConfig.kolom; col++) {
          const student = placedStudents[sIdx++] || null;
          kursiList.push({
            id: `${rConfig.id}-r${row}-c${col}`,
            ruangId: rConfig.id,
            baris: row,
            kolom: col,
            santri: student,
          });
        }
      }

      const roomObj: RuangUjian = {
        id: rConfig.id,
        nama: rConfig.nama,
        kode: rConfig.kode,
        gender: rConfig.gender,
        baris: rConfig.baris,
        kolom: rConfig.kolom,
        kapasitas: totalSeats,
        kursiList,
      };

      // Lakukan optimasi pertukaran lokal (annealing/swaps) untuk meminimalkan bentrok
      optimizeRoomSeating(roomObj);

      // Tandai bentrok visual di kursi
      const { conflicts } = validateRoom(roomObj);
      const conflictSet = new Set<string>();
      conflicts.forEach((c) => {
        conflictSet.add(`${c.posisi1.baris}-${c.posisi1.kolom}`);
        conflictSet.add(`${c.posisi2.baris}-${c.posisi2.kolom}`);
      });

      roomObj.kursiList.forEach((k) => {
        k.bentrok = conflictSet.has(`${k.baris}-${k.kolom}`);
      });

      resultRooms.push(roomObj);
    });
  });

  return resultRooms;
}

/**
 * Optimasi pertukaran kursi lokal untuk menyingkirkan tetangga sekelas
 */
function optimizeRoomSeating(room: RuangUjian, maxIterations: number = 80): void {
  let bestConflicts = validateRoom(room).conflicts.length;
  if (bestConflicts === 0) return;

  for (let iter = 0; iter < maxIterations; iter++) {
    const { conflicts } = validateRoom(room);
    if (conflicts.length === 0) break;

    // Pilih salah satu kursi yang terlibat bentrok
    const randomConflict = conflicts[Math.floor(Math.random() * conflicts.length)];
    const k1 = room.kursiList.find(
      (k) => k.baris === randomConflict.posisi1.baris && k.kolom === randomConflict.posisi1.kolom
    );
    if (!k1) continue;

    // Pilih kursi lain secara acak di ruangan yang sama
    const otherIdx = Math.floor(Math.random() * room.kursiList.length);
    const k2 = room.kursiList[otherIdx];
    if (!k2 || k1 === k2) continue;

    // Coba tukar
    const temp = k1.santri;
    k1.santri = k2.santri;
    k2.santri = temp;

    const newConflicts = validateRoom(room).conflicts.length;
    if (newConflicts < bestConflicts) {
      bestConflicts = newConflicts;
    } else {
      // Rollback jika tidak lebih baik
      k2.santri = k1.santri;
      k1.santri = temp;
    }
  }
}
