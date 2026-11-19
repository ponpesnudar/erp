import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserAccount,
  SEED_USERS,
  SantriRecord,
  SEED_SANTRI_LIST,
  generateMockSantri,
  MataPelajaranImtihan,
  SEED_MAPEL_IMTIHAN,
  RabItem,
  SEED_RAB_IMTIHAN,
  RekapAnggaranBulan,
  SEED_REKAP_ANGGARAN_BULANAN,
  JabatanOrganisasi,
  SEED_BAGAN_ORGANISASI,
  FiturWewenang,
  FITUR_WEWENANG_LIST,
  UstadzRecord,
  SEED_USTADZ_LIST,
  KurikulumKitabItem,
  SEED_KURIKULUM_KITAB,
  JadwalMaarifanItem,
  SEED_JADWAL_MAARIFAN,
  AbsensiGuruRecord,
  SEED_ABSENSI_GURU,
  ImtihanMasterConfig,
  ImtihanRoomConfig,
  DEFAULT_IMTIHAN_MASTER,
  JagaPiketRecord,
  SEED_JAGA_PIKET,
  PengurusStrukturItem,
  SEED_PENGURUS_STRUKTUR,
  LahanItem,
  SEED_LAHAN,
  GedungItem,
  SEED_GEDUNG,
  RuanganItem,
  SEED_RUANGAN,
  PerlengkapanItem,
  SEED_PERLENGKAPAN,
  KasTransaction,
  SEED_KAS_TRANSACTIONS,
  AgendaKegiatanItem,
  SEED_AGENDA_KEGIATAN,
  JadwalKeamananItem,
  SEED_JADWAL_KEAMANAN,
  BukuTamuRecord,
  SEED_BUKU_TAMU,
  TitipanWaliRecord,
  SEED_TITIPAN_WALI,
  KurikulumMatrixRow,
  SEED_KURIKULUM_MATRIX,
  KitabPdfItem,
  SEED_KITAB_PDF_LIST,
  KalenderPendidikanData,
  SEED_KALENDER_PENDIDIKAN,
  GuruAvailabilityRule,
  SEED_GURU_AVAILABILITY,
  JadwalMengajarSlot,
  SEED_JADWAL_MENGAJAR,
  UstadzPayrollItem,
  SEED_USTADZ_PAYROLL,
  BisyarohHistoryItem,
  SEED_BISYAROH_HISTORY,
} from '../data/seed/pondokData.ts';
import {
  RuangUjian,
  generateSeating,
  validateRoom,
  formatNIS,
  NISConfig,
  nomorUjian,
} from './rules.ts';

export interface AuditLog {
  id: string;
  waktu: string;
  userId: string;
  userName: string;
  peran: string;
  modul: string;
  aksi: string;
  keterangan: string;
}

export interface KotakMasukItem {
  id: string;
  modul: string;
  judul: string;
  pengirim: string;
  waktu: string;
  status: 'Menunggu' | 'Disetujui' | 'Ditolak';
  linkTab: string;
  keterangan: string;
}

export interface AbsensiSession {
  id: string;
  tanggal: string;
  kelas: string;
  guruNama: string;
  mapel: string;
  waktuSimpan: string;
  tersimpanOleh: string;
  kehadiran: Record<string, 'H' | 'I' | 'S' | 'A'>; // santriId -> status
  catatan?: string;
}

export interface SoalRegulasi {
  tipeSoal: 'Essay' | 'Pilihan Ganda' | 'Campuran';
  jumlahRomawiEssay: number;
  jumlahPilihanGanda: number;
}

export interface RomawiSection {
  judulArab: string;
  soalList: {
    nomor: string;
    pertanyaanArab: string;
    kunciJawaban?: string;
    bobot: number;
  }[];
}

export interface PilihanGandaItem {
  nomor: string;
  pertanyaanArab: string;
  opsiA: string;
  opsiB: string;
  opsiC: string;
  opsiD: string;
  kunci?: 'A' | 'B' | 'C' | 'D';
  bobot: number;
}

export interface SoalSubmission {
  id: string;
  mapelId: string;
  mapelNama: string;
  mapelArab: string;
  kelas: string;
  guruId: string;
  guruNama: string;
  guruNamaArab?: string;
  semester: string;
  tahunAjaran: string;
  status: 'Draf' | 'Diajukan' | 'Perlu Revisi' | 'Disetujui' | 'Terkunci';
  instruksiArab: string;
  regulasi?: SoalRegulasi;
  romawiSections?: RomawiSection[];
  pilihanGandaList?: PilihanGandaItem[];
  soalList: {
    nomor: string;
    pertanyaanArab: string;
    kunciJawaban?: string;
    bobot: number;
  }[];
  catatanRevisi?: string;
  tanggalPengajuan?: string;
}

export interface NilaiSantriMapel {
  santriId: string;
  santriNama: string;
  nis: string;
  kelas: string;
  mapelId: string;
  nilaiAngka: number; // Nilai Ujian Akhir
  nilaiHarian?: number; // Nilai Harian (اليومية)
  nilaiLisan?: number; // Nilai Lisan/Praktek
  nilaiUbudiyah: number;
  nilaiAkhlaq: number;
  nilaiIstiqomah?: number;
  nilaiMQK: number;
  sakit?: number;
  izin?: number;
  alpa?: number;
  semester?: '1' | '2';
  tahunAjaran?: string;
  waliKelas?: string;
  hafalanNadhom: string;
  catatanWaliKelas?: string;
}

export interface TransaksiKantin {
  id: string;
  santriId: string;
  santriNama: string;
  nis: string;
  nominal: number;
  tipe: 'Jajan Kantin' | 'Laundry Pondok' | 'Top Up';
  keterangan: string;
  waktu: string;
  kasir: string;
}

export interface PSBApplicant {
  id: string;
  nama: string;
  nik: string;
  gender: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  namaWali: string;
  hpWali: string;
  alamat: string;
  asalSekolah: string;
  pilihanJenjang: string;
  status: 'Menunggu Verifikasi' | 'Diterima' | 'Ditolak' | 'Resmi Santri';
  tanggalDaftar: string;
  nominalTransfer: number;
  buktiTransferUrl?: string;
  berkasLengkap: boolean;
  // Extended EMIS fields
  nisn?: string;
  noKK?: string;
  namaKepalaKeluarga?: string;
  anakKe?: number;
  jumlahSaudara?: number;
  citaCita?: string;
  hobi?: string;
  nomorKIP?: string;
  dokumenKKUrl?: string;
  dokumenKKName?: string;
  dokumenKIPUrl?: string;
  dokumenKIPName?: string;
}

export interface SuratItem {
  id: string;
  nomorSurat: string;
  perihal: string;
  tujuan: string;
  tanggal: string;
  tipe: 'Surat Keluar' | 'Surat Masuk';
  status: 'Konsep' | 'Menunggu TTD' | 'Ditandatangani' | 'Diarsipkan';
  isiRingkas: string;
  penandatangan: string;
}

export interface PelanggaranRecord {
  id: string;
  santriId: string;
  santriNama: string;
  kelas: string;
  tanggal: string;
  pelanggaran: string;
  kategori: 'Ringan' | 'Sedang' | 'Berat';
  poin: number;
  takzir: string;
  saksi: string;
  status: 'Dalam Pembinaan' | 'Selesai';
}

export interface AppState {
  // Mode & Auth
  currentUser: UserAccount;
  activeRole: string;
  simulatedRole: string | null;
  darkMode: boolean;
  systemStatus: 'ready' | 'offline' | 'syncing';
  offlineQueueCount: number;

  // Master Data & Config
  nisConfig: NISConfig;
  nisCounter: number;
  currentTahunAjaran: string;
  santriList: SantriRecord[];
  ustadzList: UstadzRecord[];
  mapelList: MataPelajaranImtihan[];
  kurikulumKitabList: KurikulumKitabItem[];
  kurikulumMatrix: KurikulumMatrixRow[];
  kitabPdfList: KitabPdfItem[];
  kalenderPendidikan: KalenderPendidikanData;
  guruAvailability: GuruAvailabilityRule[];
  jadwalMengajar: JadwalMengajarSlot[];
  ustadzPayroll: UstadzPayrollItem[];
  jadwalMaarifan: JadwalMaarifanItem[];
  absensiGuruList: AbsensiGuruRecord[];
  baganOrganisasi: JabatanOrganisasi[];
  rabImtihan: RabItem[];
  rekapAnggaranBulanan: RekapAnggaranBulan[];
  fiturWewenang: FiturWewenang[];
  rolePermissions: Record<string, Record<string, string[]>>;

  // Imtihan Master & Jadwal
  imtihanMaster: ImtihanMasterConfig;
  jagaPiketList: JagaPiketRecord[];

  // Sekretaris Pengurus & Sarpras
  pengurusStruktur: PengurusStrukturItem[];
  sarprasLahan: LahanItem[];
  sarprasGedung: GedungItem[];
  sarprasRuangan: RuanganItem[];
  sarprasPerlengkapan: PerlengkapanItem[];

  // Bendahara & Kema'hadiyahan & BK
  kasTransactions: KasTransaction[];
  bisyarohHistory: BisyarohHistoryItem[];
  agendaKegiatan: AgendaKegiatanItem[];
  jadwalKeamanan: JadwalKeamananItem[];
  bukuTamu: BukuTamuRecord[];
  titipanWali: TitipanWaliRecord[];

  // Modul Data
  auditLogs: AuditLog[];
  kotakMasuk: KotakMasukItem[];
  absensiSessions: AbsensiSession[];
  soalSubmissions: SoalSubmission[];
  nilaiList: NilaiSantriMapel[];
  ruangUjianList: RuangUjian[];
  seatingRandomSeed: number;
  transaksiList: TransaksiKantin[];
  psbList: PSBApplicant[];
  suratList: SuratItem[];
  pelanggaranList: PelanggaranRecord[];

  // Actions
  loginAs: (userId: string) => void;
  logout: () => void;
  switchRole: (newRole: string) => void;
  simulateRole: (role: string | null) => void;
  toggleDarkMode: () => void;
  setSystemStatus: (status: 'ready' | 'offline' | 'syncing') => void;
  addAuditLog: (modul: string, aksi: string, keterangan: string) => void;

  // Permissions
  togglePermissionAction: (roleId: string, fiturId: string, action: string) => void;
  setAllPermissionsForRole: (roleId: string, all: boolean) => void;

  // Santri CRUD
  addSantri: (data: Omit<SantriRecord, 'id'>) => void;
  updateSantri: (id: string, data: Partial<SantriRecord>) => void;
  deleteSantri: (id: string) => void;

  // Ustadz CRUD
  addUstadz: (data: Omit<UstadzRecord, 'id'>) => void;
  updateUstadz: (id: string, data: Partial<UstadzRecord>) => void;
  deleteUstadz: (id: string) => void;

  // Imtihan
  createOrUpdateSoal: (soal: Partial<SoalSubmission>) => void;
  updateSoalStatus: (soalId: string, status: SoalSubmission['status'], catatan?: string) => void;
  updateNilaiSantri: (nilai: NilaiSantriMapel) => void;
  updateImtihanMaster: (data: Partial<ImtihanMasterConfig>) => void;
  togglePesertaSusulan: (santriId: string) => void;
  addRoomConfig: (room: Omit<ImtihanRoomConfig, 'id'>) => void;
  updateRoomConfig: (id: string, room: Partial<ImtihanRoomConfig>) => void;
  deleteRoomConfig: (id: string) => void;
  generateExamSeating: (seed?: number) => void;
  swapSeats: (ruangId: string, seat1Id: string, seat2Id: string) => void;
  updateRabItem: (item: RabItem) => void;
  addRabItem: (item: Omit<RabItem, 'id'>) => void;
  deleteRabItem: (id: string) => void;
  resetRabImtihan: () => void;
  addJagaPiket: (data: Omit<JagaPiketRecord, 'id'>) => void;
  updateJagaPiket: (id: string, data: Partial<JagaPiketRecord>) => void;
  deleteJagaPiket: (id: string) => void;

  // Maarifan
  saveAbsensi: (session: Omit<AbsensiSession, 'id' | 'waktuSimpan'>) => void;
  addKurikulumKitab: (item: Omit<KurikulumKitabItem, 'id'>) => void;
  updateKurikulumKitab: (id: string, item: Partial<KurikulumKitabItem>) => void;
  deleteKurikulumKitab: (id: string) => void;
  addJadwalMaarifan: (item: Omit<JadwalMaarifanItem, 'id'>) => void;
  updateJadwalMaarifan: (id: string, item: Partial<JadwalMaarifanItem>) => void;
  deleteJadwalMaarifan: (id: string) => void;
  saveAbsensiGuru: (rec: Omit<AbsensiGuruRecord, 'id'>) => void;
  updateKurikulumMatrixCell: (rowId: string, kelasKey: 'kelas1' | 'kelas2' | 'kelas3' | 'kelas4' | 'kelas5' | 'kelas6', kitab: string, jtm: number) => void;
  addKitabPdf: (item: Omit<KitabPdfItem, 'id'>) => void;
  deleteKitabPdf: (id: string) => void;
  setKalenderDayCode: (bulan: string, day: number, code: string) => void;
  updateKalenderMeta: (data: Partial<KalenderPendidikanData>) => void;
  resetKalenderPendidikan: () => void;
  updateGuruAvailability: (ustadzId: string, data: Partial<GuruAvailabilityRule>) => void;
  addJadwalMengajarSlot: (slot: Omit<JadwalMengajarSlot, 'id'>) => void;
  deleteJadwalMengajarSlot: (id: string) => void;

  // Bendahara & Penggajian
  addKasTransaction: (trx: Omit<KasTransaction, 'id'>) => void;
  deleteKasTransaction: (id: string) => void;
  updatePayrollRow: (ustadzId: string, data: Partial<UstadzPayrollItem>) => void;
  togglePayrollStatus: (ustadzId: string) => void;
  syncPayrollAbsensi: () => void;
  payBisyarohRow: (ustadzId: string, bulan: string, tahun?: number, metode?: 'Tunai Loket' | 'Transfer Bank') => void;
  payAllReadyBisyaroh: (bulan: string, tahun?: number) => number;
  bulkUpdatePayrollHadir: (jumlahHadir: number) => void;
  resetAllPayrollToSiap: () => void;

  // Transaksi
  topUpSaldo: (santriId: string, nominal: number, metode: string) => void;
  prosesBelanjaKantin: (santriId: string, nominal: number, keterangan: string) => { success: boolean; message: string };
  updateLimitHarian: (santriId: string, limit: number) => void;
  toggleStatusKartu: (santriId: string) => void;

  // PSB
  addPSBApplicant: (applicant: Omit<PSBApplicant, 'id' | 'tanggalDaftar' | 'status'>) => void;
  verifyPSB: (id: string, status: PSBApplicant['status']) => void;
  convertPSBToSantri: (applicantId: string, kelas: string, kamar: string) => string;

  // BK & Keamanan
  addPelanggaran: (data: Omit<PelanggaranRecord, 'id' | 'status'>) => void;
  selesaikanPelanggaran: (id: string) => void;
  addJadwalKeamanan: (data: Omit<JadwalKeamananItem, 'id'>) => void;
  deleteJadwalKeamanan: (id: string) => void;
  addBukuTamu: (data: Omit<BukuTamuRecord, 'id'>) => void;
  addTitipanWali: (data: Omit<TitipanWaliRecord, 'id'>) => void;
  updateStatusTitipanWali: (id: string, status: TitipanWaliRecord['status']) => void;

  // Sekretaris, Pengurus & Sarpras
  addSurat: (surat: Omit<SuratItem, 'id' | 'nomorSurat'>) => void;
  updateSuratStatus: (id: string, status: SuratItem['status']) => void;
  addPengurus: (data: Omit<PengurusStrukturItem, 'id'>) => void;
  updatePengurus: (id: string, data: Partial<PengurusStrukturItem>) => void;
  deletePengurus: (id: string) => void;
  addSarprasLahan: (data: Omit<LahanItem, 'id'>) => void;
  deleteSarprasLahan: (id: string) => void;
  addSarprasGedung: (data: Omit<GedungItem, 'id'>) => void;
  deleteSarprasGedung: (id: string) => void;
  addSarprasRuangan: (data: Omit<RuanganItem, 'id'>) => void;
  deleteSarprasRuangan: (id: string) => void;
  addSarprasPerlengkapan: (data: Omit<PerlengkapanItem, 'id'>) => void;
  deleteSarprasPerlengkapan: (id: string) => void;

  // Kema'hadiyahan (Bagan & Agenda)
  addBaganNode: (data: Omit<JabatanOrganisasi, 'id'>) => void;
  updateBaganNode: (id: string, data: Partial<JabatanOrganisasi>) => void;
  deleteBaganNode: (id: string) => void;
  addAgendaKegiatan: (data: Omit<AgendaKegiatanItem, 'id'>) => void;
  updateAgendaKegiatan: (id: string, data: Partial<AgendaKegiatanItem>) => void;
  deleteAgendaKegiatan: (id: string) => void;

  // Settings
  updateNISConfig: (config: NISConfig) => void;
}

const DEFAULT_USERS = SEED_USERS;
const INITIAL_SANTRI = generateMockSantri(130);

const DEFAULT_ROLE_PERMS: Record<string, Record<string, string[]>> = {
  admin_sistem: {
    imtihan_soal: ['baca', 'tulis', 'ubah', 'hapus', 'setujui', 'cetak'],
    imtihan_denah: ['baca', 'tulis', 'ubah', 'cetak', 'konfigurasi'],
    imtihan_kartu: ['baca', 'cetak', 'ekspor'],
    imtihan_nilai_raport: ['baca', 'tulis', 'ubah', 'setujui', 'cetak'],
    imtihan_rab: ['baca', 'tulis', 'ubah', 'setujui', 'cetak', 'posting'],
    maarifan_absensi: ['baca', 'tulis', 'ubah', 'setujui', 'cetak'],
    sekretaris_persuratan: ['baca', 'tulis', 'ubah', 'hapus', 'cetak'],
    bendahara_keuangan: ['baca', 'tulis', 'ubah', 'setujui', 'posting', 'cetak', 'ekspor'],
    transaksi_kartu_pos: ['baca', 'tulis', 'ubah', 'posting', 'cetak'],
    psb_verifikasi: ['baca', 'tulis', 'setujui', 'konfigurasi'],
    bk_pelanggaran: ['baca', 'tulis', 'ubah', 'setujui'],
  },
  pengasuh: {
    imtihan_soal: ['baca', 'setujui', 'cetak'],
    imtihan_denah: ['baca', 'cetak'],
    imtihan_kartu: ['baca', 'cetak'],
    imtihan_nilai_raport: ['baca', 'setujui', 'cetak'],
    imtihan_rab: ['baca', 'setujui', 'cetak'],
    maarifan_absensi: ['baca', 'cetak'],
    sekretaris_persuratan: ['baca', 'setujui', 'cetak'],
    bendahara_keuangan: ['baca', 'setujui', 'cetak', 'ekspor'],
    transaksi_kartu_pos: ['baca', 'cetak'],
    psb_verifikasi: ['baca', 'setujui'],
    bk_pelanggaran: ['baca', 'setujui'],
  },
  ketua_imtihan: {
    imtihan_soal: ['baca', 'tulis', 'ubah', 'setujui', 'cetak'],
    imtihan_denah: ['baca', 'tulis', 'ubah', 'cetak', 'konfigurasi'],
    imtihan_kartu: ['baca', 'cetak', 'ekspor'],
    imtihan_nilai_raport: ['baca', 'tulis', 'ubah', 'setujui', 'cetak'],
    imtihan_rab: ['baca', 'tulis', 'ubah', 'cetak'],
    maarifan_absensi: ['baca'],
  },
  bendahara: {
    bendahara_keuangan: ['baca', 'tulis', 'ubah', 'setujui', 'posting', 'cetak', 'ekspor'],
    imtihan_rab: ['baca', 'tulis', 'ubah', 'setujui', 'cetak', 'posting'],
    transaksi_kartu_pos: ['baca', 'tulis', 'posting', 'cetak'],
  },
  guru_pengampu: {
    imtihan_soal: ['baca', 'tulis', 'ubah'],
    imtihan_nilai_raport: ['baca', 'tulis'],
    maarifan_absensi: ['baca', 'tulis'],
  },
  kepala_madin: {
    maarifan_absensi: ['baca', 'tulis', 'ubah', 'setujui', 'cetak'],
    imtihan_nilai_raport: ['baca', 'cetak'],
    imtihan_soal: ['baca', 'cetak'],
  },
  sekretaris: {
    sekretaris_persuratan: ['baca', 'tulis', 'ubah', 'hapus', 'cetak'],
    psb_verifikasi: ['baca', 'tulis'],
  },
  kemahadiyahan: {
    bk_pelanggaran: ['baca', 'tulis'],
    maarifan_absensi: ['baca'],
  },
  bk_keamanan: {
    bk_pelanggaran: ['baca', 'tulis', 'ubah', 'setujui'],
  },
  kasir_kantin: {
    transaksi_kartu_pos: ['baca', 'tulis', 'posting', 'cetak'],
  },
  wali_santri: {
    imtihan_nilai_raport: ['baca'],
    transaksi_kartu_pos: ['baca', 'tulis'],
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: DEFAULT_USERS[0],
      activeRole: 'pengasuh',
      simulatedRole: null,
      darkMode: false,
      systemStatus: 'ready',
      offlineQueueCount: 0,

      nisConfig: {
        prefix: '24',
        useYear: true,
        nomorAwal: 1001,
        digitCount: 4,
      },
      nisCounter: 8,
      currentTahunAjaran: '2026/2027',
      santriList: INITIAL_SANTRI,
      ustadzList: SEED_USTADZ_LIST,
      mapelList: SEED_MAPEL_IMTIHAN,
      kurikulumKitabList: SEED_KURIKULUM_KITAB,
      kurikulumMatrix: SEED_KURIKULUM_MATRIX,
      kitabPdfList: SEED_KITAB_PDF_LIST,
      kalenderPendidikan: SEED_KALENDER_PENDIDIKAN,
      guruAvailability: SEED_GURU_AVAILABILITY,
      jadwalMengajar: SEED_JADWAL_MENGAJAR,
      ustadzPayroll: SEED_USTADZ_PAYROLL,
      jadwalMaarifan: SEED_JADWAL_MAARIFAN,
      absensiGuruList: SEED_ABSENSI_GURU,
      baganOrganisasi: SEED_BAGAN_ORGANISASI,
      rabImtihan: SEED_RAB_IMTIHAN,
      rekapAnggaranBulanan: SEED_REKAP_ANGGARAN_BULANAN,
      fiturWewenang: FITUR_WEWENANG_LIST,
      rolePermissions: DEFAULT_ROLE_PERMS,

      imtihanMaster: DEFAULT_IMTIHAN_MASTER,
      jagaPiketList: SEED_JAGA_PIKET,

      pengurusStruktur: SEED_PENGURUS_STRUKTUR,
      sarprasLahan: SEED_LAHAN,
      sarprasGedung: SEED_GEDUNG,
      sarprasRuangan: SEED_RUANGAN,
      sarprasPerlengkapan: SEED_PERLENGKAPAN,

      kasTransactions: SEED_KAS_TRANSACTIONS,
      bisyarohHistory: SEED_BISYAROH_HISTORY,
      agendaKegiatan: SEED_AGENDA_KEGIATAN,
      jadwalKeamanan: SEED_JADWAL_KEAMANAN,
      bukuTamu: SEED_BUKU_TAMU,
      titipanWali: SEED_TITIPAN_WALI,

      auditLogs: [
        {
          id: 'log-1',
          waktu: '2026-11-09 10:15',
          userId: 'u-ketua-imtihan',
          userName: 'Ust. Nidhomul Muna Lana',
          peran: 'Ketua Imtihan',
          modul: 'Imtihan',
          aksi: 'Generate Denah',
          keterangan: 'Penyusunan denah acak 7 ruang imtihan bebas contek berhasil diproses.',
        },
        {
          id: 'log-2',
          waktu: '2026-11-09 09:30',
          userId: 'u-bendahara',
          userName: 'M. Abdul Fataah',
          peran: 'Bendahara',
          modul: 'Bendahara',
          aksi: 'Input RAB Imtihan',
          keterangan: 'Pencatatan realisasi pemasukan Rp 10.800.000 dan pengeluaran Rp 9.678.300.',
        },
      ],

      kotakMasuk: [
        {
          id: 'km-1',
          modul: 'Imtihan',
          judul: 'Persetujuan Naskah Soal Fiqih 2 MDS',
          pengirim: 'Ust. Abdur Rahman',
          waktu: '10 menit yang lalu',
          status: 'Menunggu',
          linkTab: 'imtihan',
          keterangan: 'Naskah soal Fiqih telah diajukan lengkap dengan teks Pegon & Arab.',
        },
        {
          id: 'km-2',
          modul: 'Bendahara',
          judul: 'Pencairan Usulan Tambahan Buku Harian Guru',
          pengirim: 'Ust. Nidhomul Muna Lana',
          waktu: '35 menit yang lalu',
          status: 'Menunggu',
          linkTab: 'bendahara',
          keterangan: 'Pengajuan usulan tambahan Rp 700.000 untuk 35 buku harian & absensi saku.',
        },
        {
          id: 'km-3',
          modul: 'PSB',
          judul: 'Verifikasi Calon Santri Baru (3 Berkas)',
          pengirim: 'Sistem PSB Online',
          waktu: '1 jam yang lalu',
          status: 'Menunggu',
          linkTab: 'psb',
          keterangan: '3 calon santri baru telah melunasi infaq pendaftaran & unggah berkas.',
        },
        {
          id: 'km-4',
          modul: 'Sekretaris',
          judul: 'Permohonan Tanda Tangan Surat Pemberitahuan Imtihan',
          pengirim: 'Ust. Ahmad Mujiburrohman',
          waktu: '2 jam yang lalu',
          status: 'Menunggu',
          linkTab: 'sekretaris',
          keterangan: 'Surat edaran jadwal imtihan kepada wali santri menunggu pengesahan Pengasuh.',
        },
      ],

      absensiSessions: [
        {
          id: 'abs-1',
          tanggal: '2026-11-09',
          kelas: '2 A PUTRA',
          guruNama: 'Ust. Abdur Rahman',
          mapel: 'Fiqih',
          waktuSimpan: '2026-11-09 07:15',
          tersimpanOleh: 'Ust. Abdur Rahman',
          kehadiran: {
            's-001': 'H',
            's-002': 'H',
            's-003': 'I',
          },
          catatan: 'Pertemuan bab Shalat Jamaah & Qashar berjalan khidmat.',
        },
      ],

      soalSubmissions: [
        {
          id: 'soal-1',
          mapelId: 'm-12',
          mapelNama: 'Fiqih',
          mapelArab: 'الفقه',
          kelas: '2 A PUTRA',
          guruId: 'u-guru',
          guruNama: 'Ust. Abdur Rahman',
          guruNamaArab: 'عبد الرحمن',
          semester: 'Gasal',
          tahunAjaran: '2026/2027',
          status: 'Disetujui',
          instruksiArab: 'أجب هذه الأسئلة بإجابة صحيحة !',
          regulasi: { tipeSoal: 'Essay', jumlahRomawiEssay: 1, jumlahPilihanGanda: 0 },
          soalList: [
            {
              nomor: '٠١',
              pertanyaanArab: 'أدا برافـا ماچام-ماچام أير يـاغ بولـيه دي كوناكـان أونتـوك برسوچـي ؟ سبوتكـان أفا ساجـا !',
              kunciJawaban: 'Air yang suci dan menyucikan ada 7 macam: air hujan, air laut, air sungai, air sumur, air sumber/mata air, air salju, dan air embun.',
              bobot: 20,
            },
            {
              nomor: '٠٢',
              pertanyaanArab: 'كوليت-كوليت بـاغكـاي بيناتـاغ منجـادي سوچـي جيكـا سوداه دي سامـاك، بكايمـانـا چـارا مپامـاك كوليت ترسبـوت ؟',
              kunciJawaban: 'Menyamak dengan menghilangkan lendir/daging yang menempel menggunakan benda yang kelat seperti tawas atau kulit delima.',
              bobot: 20,
            },
            {
              nomor: '٠٣',
              pertanyaanArab: 'مماكـاي سيوَاك ساغـات دي سنـة كـان سكـالي فـادا ٣ (تيكـا) حـال، سبوتكـان أفا ساجـا !',
              kunciJawaban: '1. Ketika bau mulut berubah, 2. Ketika bangun dari tidur, 3. Ketika hendak mendirikan shalat.',
              bobot: 20,
            },
            {
              nomor: '٠٤',
              pertanyaanArab: 'فَرْضُـنْيَا وضـوء أدا برافـا ؟ سبوتكـان أفا ساجـا !',
              kunciJawaban: 'Fardhu wudhu ada 6: niat, membasuh wajah, membasuh kedua tangan sampai siku, mengusap sebagian kepala, membasuh kedua kaki sampai mata kaki, dan tertib.',
              bobot: 20,
            },
            {
              nomor: '٠٥',
              pertanyaanArab: 'سنـة-سنـة پـا وضـوء أدا برافـا ؟ سبوتكـان ٥ (ليمـا) ساجـا !',
              kunciJawaban: 'Membaca basmalah, membasuh kedua telapak tangan, berkumur-kumur, istinsyaq, mengusap seluruh kepala.',
              bobot: 20,
            },
          ],
          tanggalPengajuan: '2026-11-08',
        },
        {
          id: 'soal-2',
          mapelId: 'm-14',
          mapelNama: 'Nahwu',
          mapelArab: 'النحو',
          kelas: '2 A PUTRA',
          guruId: 'u-ketua-imtihan',
          guruNama: 'Ust. Nidhomul Muna Lana',
          guruNamaArab: 'نظم المنى لنا',
          semester: 'Gasal',
          tahunAjaran: '2026/2027',
          status: 'Diajukan',
          instruksiArab: 'أجب هذه الأسئلة بإجابة صحيحة !',
          regulasi: { tipeSoal: 'Essay', jumlahRomawiEssay: 1, jumlahPilihanGanda: 0 },
          soalList: [
            {
              nomor: '٠١',
              pertanyaanArab: 'توليسكـان بيـت نظـم العمريطـي تنتـاغ تعـريف الكـلام مع معنـاه فَيْغُـون !',
              kunciJawaban: 'كَلَامُهُمْ لَفْظٌ مُفِيدٌ مُسْنَدُ # وَالْكِلْمَةُ اللَّفْظُ الْمُفِيدُ الْمُفْرَدُ',
              bobot: 50,
            },
            {
              nomor: '٠٢',
              pertanyaanArab: 'سبوتكـان علامـات الإعراب أونتـوك نصب فـادا أسمـاء الخمسـة دغن چونتـوهـپـا !',
              kunciJawaban: 'Tanda nashab pada Asmaul Khamsah adalah Alif, contoh: رَأَيْتُ أَبَاكَ وَأَخَاكَ',
              bobot: 50,
            },
          ],
          tanggalPengajuan: '2026-11-09',
        },
      ],

      nilaiList: [
        {
          santriId: 's-001',
          santriNama: 'MUHAMMAD ZIDNI ALBI FALAKHI',
          nis: '24.1001',
          kelas: '2 A PUTRA',
          mapelId: 'm-12',
          nilaiAngka: 88,
          nilaiHarian: 85,
          nilaiLisan: 90,
          nilaiUbudiyah: 92,
          nilaiAkhlaq: 95,
          nilaiIstiqomah: 90,
          nilaiMQK: 85,
          sakit: 1,
          izin: 1,
          alpa: 0,
          semester: '1',
          tahunAjaran: '2026/2027',
          waliKelas: 'Ust. Abdur Rahman',
          hafalanNadhom: 'Imrithi Bait 1-100 Lulus Mutqin',
          catatanWaliKelas: 'Santri sangat rajin dan aktif dalam muthalaah kitab kuning.',
        },
        {
          santriId: 's-002',
          santriNama: 'AHMAD SYAUQI MAHFUDZ',
          nis: '24.1002',
          kelas: '2 A PUTRA',
          mapelId: 'm-12',
          nilaiAngka: 94,
          nilaiHarian: 90,
          nilaiLisan: 92,
          nilaiUbudiyah: 90,
          nilaiAkhlaq: 93,
          nilaiIstiqomah: 92,
          nilaiMQK: 92,
          sakit: 0,
          izin: 0,
          alpa: 0,
          semester: '1',
          tahunAjaran: '2026/2027',
          waliKelas: 'Ust. Abdur Rahman',
          hafalanNadhom: 'Imrithi Bait 1-120 Mutqin',
          catatanWaliKelas: 'Kemampuan qiraatul kutub sangat baik.',
        },
      ],

      ruangUjianList: [],
      seatingRandomSeed: 12345,

      transaksiList: [
        {
          id: 'trx-1',
          santriId: 's-001',
          santriNama: 'MUHAMMAD ZIDNI ALBI FALAKHI',
          nis: '24.1001',
          nominal: 12000,
          tipe: 'Jajan Kantin',
          keterangan: 'Nasi Kuning Sambal Goreng + Es Teh',
          waktu: '2026-11-09 12:45',
          kasir: 'Mbak Siti Rohmah',
        },
        {
          id: 'trx-2',
          santriId: 's-001',
          santriNama: 'MUHAMMAD ZIDNI ALBI FALAKHI',
          nis: '24.1001',
          nominal: 50000,
          tipe: 'Top Up',
          keterangan: 'Top up saldo kartu oleh wali via transfer',
          waktu: '2026-11-08 19:20',
          kasir: 'Sistem Otomatis',
        },
      ],

      psbList: [
        {
          id: 'psb-1',
          nama: 'M. ILHAM RAMADHAN',
          nik: '3326123456780001',
          gender: 'L',
          tempatLahir: 'Pekalongan',
          tanggalLahir: '2012-08-14',
          namaWali: 'Bpk. Ramadhan',
          hpWali: '0813-8899-7766',
          alamat: 'Kec. Buaran, Kab. Pekalongan',
          asalSekolah: 'MI Salafiyah Buaran',
          pilihanJenjang: 'Madrasah Diniyah Salafiyah (Tingkat 1)',
          status: 'Menunggu Verifikasi',
          tanggalDaftar: '2026-11-08',
          nominalTransfer: 150000,
          berkasLengkap: true,
        },
        {
          id: 'psb-2',
          nama: 'NABILA AZ-ZAHRA',
          nik: '3326123456780002',
          gender: 'P',
          tempatLahir: 'Batang',
          tanggalLahir: '2012-05-20',
          namaWali: 'Bpk. Ahmad Fauzi',
          hpWali: '0857-1122-3344',
          alamat: 'Kec. Wonotunggal, Kab. Batang',
          asalSekolah: 'SD Negeri 1 Batang',
          pilihanJenjang: 'Madrasah Diniyah Salafiyah Putri (Tingkat 1)',
          status: 'Diterima',
          tanggalDaftar: '2026-11-07',
          nominalTransfer: 750000,
          berkasLengkap: true,
        },
      ],

      suratList: [
        {
          id: 'srt-1',
          nomorSurat: '042/PND/SEKR/XI/2026',
          perihal: 'Pemberitahuan Pelaksanaan Imtihan Semester Gasal 2026/2027',
          tujuan: 'Seluruh Wali Santri PP NU Darussalam',
          tanggal: '2026-11-05',
          tipe: 'Surat Keluar',
          status: 'Ditandatangani',
          isiRingkas: 'Pelaksanaan Imtihan dimulai malam 6 s.d. 9 Desember 2026. Dimohon doa restu dan pelunasan syahriyah.',
          penandatangan: 'KH. Amin Maizun (Pengasuh)',
        },
      ],

      pelanggaranList: [
        {
          id: 'plg-1',
          santriId: 's-003',
          santriNama: 'MOH. FAHRI MAULANA',
          kelas: '2 B PUTRA',
          tanggal: '2026-11-07',
          pelanggaran: 'Terlambat mengikuti shalat shubuh berjamaah di masjid',
          kategori: 'Ringan',
          poin: 5,
          takzir: 'Membaca surat Yasin 3x di serambi masjid dan membersihkan halaman',
          saksi: 'Ust. Bahrul Ulum',
          status: 'Selesai',
        },
      ],

      // Handlers
      loginAs: (userId: string) => {
        const found = DEFAULT_USERS.find((u) => u.id === userId);
        if (found) {
          set({
            currentUser: found,
            activeRole: found.peran,
            simulatedRole: null,
          });
          get().addAuditLog('Akses', 'Login', `Pengguna ${found.nama} (${found.peranLabel}) berhasil masuk.`);
        }
      },

      logout: () => {
        const user = get().currentUser;
        get().addAuditLog('Akses', 'Logout', `Pengguna ${user.nama} keluar dari sistem.`);
        set({
          currentUser: DEFAULT_USERS[0],
          activeRole: 'pengasuh',
          simulatedRole: null,
        });
      },

      switchRole: (newRole: string) => {
        const user = get().currentUser;
        if (user.rolesAvailable.includes(newRole)) {
          set({ activeRole: newRole });
          get().addAuditLog('Akses', 'Ganti Peran', `${user.nama} beralih ke peran ${newRole}.`);
        }
      },

      simulateRole: (role: string | null) => {
        set({ simulatedRole: role });
        get().addAuditLog('Akses', 'Simulasi Peran', `Admin melakukan simulasi wewenang sebagai: ${role || 'Normal'}`);
      },

      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
      },

      setSystemStatus: (status) => set({ systemStatus: status }),

      addAuditLog: (modul, aksi, keterangan) => {
        const state = get();
        const role = state.simulatedRole || state.activeRole;
        const newLog: AuditLog = {
          id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          waktu: new Date().toISOString().replace('T', ' ').substring(0, 16),
          userId: state.currentUser.id,
          userName: state.currentUser.nama,
          peran: role,
          modul,
          aksi,
          keterangan,
        };
        set({ auditLogs: [newLog, ...state.auditLogs.slice(0, 99)] });
      },

      togglePermissionAction: (roleId, fiturId, action) => {
        set((state) => {
          const currentRoleMap = { ...(state.rolePermissions[roleId] || {}) };
          const curActions = currentRoleMap[fiturId] ? [...currentRoleMap[fiturId]] : [];
          const idx = curActions.indexOf(action);
          if (idx >= 0) {
            curActions.splice(idx, 1);
          } else {
            curActions.push(action);
          }
          currentRoleMap[fiturId] = curActions;
          return {
            rolePermissions: {
              ...state.rolePermissions,
              [roleId]: currentRoleMap,
            },
          };
        });
        get().addAuditLog('Hak Akses', 'Ubah Izin', `Memperbarui izin [${action}] untuk modul ${fiturId} pada role ${roleId}.`);
      },

      setAllPermissionsForRole: (roleId, all) => {
        set((state) => {
          const currentRoleMap: Record<string, string[]> = {};
          if (all) {
            state.fiturWewenang.forEach((fw) => {
              const acts = Object.keys(fw.actions).filter((k) => fw.actions[k as keyof typeof fw.actions]);
              currentRoleMap[fw.id] = acts;
            });
          }
          return {
            rolePermissions: {
              ...state.rolePermissions,
              [roleId]: currentRoleMap,
            },
          };
        });
      },

      // Santri CRUD
      addSantri: (data) => {
        const newSantri: SantriRecord = {
          id: `s-${Date.now()}`,
          ...data,
        };
        set((state) => ({ santriList: [newSantri, ...state.santriList] }));
        get().addAuditLog('Sekretariat', 'Tambah Santri', `Menambahkan data santri ${data.nama} (${data.nis}).`);
      },

      updateSantri: (id, data) => {
        set((state) => ({
          santriList: state.santriList.map((s) => (s.id === id ? { ...s, ...data } : s)),
        }));
        get().addAuditLog('Sekretariat', 'Update Santri', `Memperbarui biodata EMIS santri ID ${id}.`);
      },

      deleteSantri: (id) => {
        set((state) => ({
          santriList: state.santriList.filter((s) => s.id !== id),
        }));
        get().addAuditLog('Sekretariat', 'Hapus Santri', `Menghapus data santri ID ${id}.`);
      },

      // Ustadz CRUD
      addUstadz: (data) => {
        const newUst: UstadzRecord = { id: `ust-${Date.now()}`, ...data };
        set((state) => ({ ustadzList: [newUst, ...state.ustadzList] }));
        get().addAuditLog("Ma'arifan", 'Tambah Ustadz', `Menambahkan asatidz ${data.nama}.`);
      },

      updateUstadz: (id, data) => {
        set((state) => ({
          ustadzList: state.ustadzList.map((u) => (u.id === id ? { ...u, ...data } : u)),
        }));
        get().addAuditLog("Ma'arifan", 'Update Ustadz', `Memperbarui profil kepegawaian ustadz ID ${id}.`);
      },

      deleteUstadz: (id) => {
        set((state) => ({
          ustadzList: state.ustadzList.filter((u) => u.id !== id),
        }));
      },

      createOrUpdateSoal: (soalData) => {
        set((state) => {
          const existing = soalData.id ? state.soalSubmissions.find((s) => s.id === soalData.id) : undefined;
          if (existing) {
            return {
              soalSubmissions: state.soalSubmissions.map((s) =>
                s.id === soalData.id ? { ...s, ...soalData } as SoalSubmission : s
              ),
            };
          } else {
            const newSoal: SoalSubmission = {
              id: `soal-${Date.now()}`,
              mapelId: soalData.mapelId || 'm-01',
              mapelNama: soalData.mapelNama || 'Mata Pelajaran',
              mapelArab: soalData.mapelArab || 'المادة',
              kelas: soalData.kelas || '1 A PUTRA',
              guruId: soalData.guruId || state.currentUser.id,
              guruNama: soalData.guruNama || state.currentUser.nama,
              guruNamaArab: soalData.guruNamaArab || state.currentUser.nama,
              semester: soalData.semester || 'Gasal',
              tahunAjaran: soalData.tahunAjaran || state.currentTahunAjaran,
              status: soalData.status || 'Diajukan',
              instruksiArab: soalData.instruksiArab || 'أجب هذه الأسئلة بإجابة صحيحة !',
              regulasi: soalData.regulasi,
              romawiSections: soalData.romawiSections,
              pilihanGandaList: soalData.pilihanGandaList,
              soalList: soalData.soalList || [],
              tanggalPengajuan: new Date().toISOString().substring(0, 10),
            };
            return { soalSubmissions: [newSoal, ...state.soalSubmissions] };
          }
        });
        get().addAuditLog('Imtihan', 'Simpan Soal', `Guru menyimpan/mengajukan naskah soal imtihan.`);
      },

      updateSoalStatus: (soalId, status, catatan) => {
        set((state) => ({
          soalSubmissions: state.soalSubmissions.map((s) =>
            s.id === soalId ? { ...s, status, catatanRevisi: catatan || s.catatanRevisi } : s
          ),
        }));
        get().addAuditLog('Imtihan', 'Status Soal', `Status naskah soal diubah menjadi ${status}.`);
      },

      updateNilaiSantri: (nilai) => {
        set((state) => {
          const exists = state.nilaiList.find(
            (n) => n.santriId === nilai.santriId && n.mapelId === nilai.mapelId
          );
          if (exists) {
            return {
              nilaiList: state.nilaiList.map((n) =>
                n.santriId === nilai.santriId && n.mapelId === nilai.mapelId ? { ...n, ...nilai } : n
              ),
            };
          } else {
            return { nilaiList: [nilai, ...state.nilaiList] };
          }
        });
        get().addAuditLog('Imtihan', 'Input Nilai', `Nilai santri ${nilai.santriNama} berhasil disimpan.`);
      },

      updateImtihanMaster: (data) => {
        set((state) => ({
          imtihanMaster: { ...state.imtihanMaster, ...data },
        }));
        get().addAuditLog('Imtihan', 'Update Master Imtihan', `Konfigurasi master Imtihan diperbarui.`);
      },

      togglePesertaSusulan: (santriId) => {
        set((state) => {
          const current = state.imtihanMaster.pesertaSusulanIds || [];
          const exists = current.includes(santriId);
          const next = exists ? current.filter((id) => id !== santriId) : [...current, santriId];
          return {
            imtihanMaster: { ...state.imtihanMaster, pesertaSusulanIds: next },
          };
        });
      },

      addRoomConfig: (room) => {
        set((state) => ({
          imtihanMaster: {
            ...state.imtihanMaster,
            roomConfigs: [...state.imtihanMaster.roomConfigs, { id: `ruang-${Date.now()}`, ...room }],
          },
        }));
      },

      updateRoomConfig: (id, room) => {
        set((state) => ({
          imtihanMaster: {
            ...state.imtihanMaster,
            roomConfigs: state.imtihanMaster.roomConfigs.map((r) => (r.id === id ? { ...r, ...room } : r)),
          },
        }));
      },

      deleteRoomConfig: (id) => {
        set((state) => ({
          imtihanMaster: {
            ...state.imtihanMaster,
            roomConfigs: state.imtihanMaster.roomConfigs.filter((r) => r.id !== id),
          },
        }));
      },

      generateExamSeating: (seed) => {
        const state = get();
        const effectiveSeed = seed || Date.now();
        const master = state.imtihanMaster || DEFAULT_IMTIHAN_MASTER;
        const susulanSet = new Set(master.pesertaSusulanIds || []);

        const roomConfigs = (master.roomConfigs || DEFAULT_IMTIHAN_MASTER.roomConfigs).map((r) => ({
          id: r.id,
          nama: `${r.nama} · ${r.lokasi}`,
          kode: r.kode,
          gender: r.gender,
          baris: r.baris,
          kolom: r.kolom,
        }));

        const pesertaSantri = state.santriList
          .filter((s) => !susulanSet.has(s.id))
          .map((s, idx) => ({
            id: s.id,
            nis: s.nis,
            nama: s.nama,
            gender: s.gender,
            kelas: s.kelas,
            tingkat: s.tingkat,
            nomorUjian: nomorUjian(s.tingkat, 'MD', idx + 1),
          }));

        const rooms = generateSeating(pesertaSantri, roomConfigs, effectiveSeed);
        set({ ruangUjianList: rooms, seatingRandomSeed: effectiveSeed });
        get().addAuditLog('Imtihan', 'Denah Acak', `Denah ujian berhasil digenerate (${pesertaSantri.length} peserta aktif, ${susulanSet.size} susulan).`);
      },

      swapSeats: (ruangId, seat1Id, seat2Id) => {
        set((state) => {
          const rooms = state.ruangUjianList.map((r) => {
            if (r.id !== ruangId) return r;
            const k1 = r.kursiList.find((k) => k.id === seat1Id);
            const k2 = r.kursiList.find((k) => k.id === seat2Id);
            if (k1 && k2) {
              const temp = k1.santri;
              k1.santri = k2.santri;
              k2.santri = temp;
              const { conflicts } = validateRoom(r);
              const conflictSet = new Set<string>();
              conflicts.forEach((c) => {
                conflictSet.add(`${c.posisi1.baris}-${c.posisi1.kolom}`);
                conflictSet.add(`${c.posisi2.baris}-${c.posisi2.kolom}`);
              });
              r.kursiList.forEach((k) => {
                k.bentrok = conflictSet.has(`${k.baris}-${k.kolom}`);
              });
            }
            return { ...r };
          });
          return { ruangUjianList: rooms };
        });
        get().addAuditLog('Imtihan', 'Tukar Kursi', `Pertukaran kursi peserta di ruang ${ruangId} disimpan.`);
      },

      updateRabItem: (item) => {
        set((state) => ({
          rabImtihan: state.rabImtihan.map((r) => (r.id === item.id ? item : r)),
        }));
        get().addAuditLog('Bendahara', 'Update RAB', `Item RAB ${item.keterangan} diperbarui.`);
      },

      addRabItem: (item) => {
        const newItem: RabItem = {
          id: `rab-${Date.now()}`,
          ...item,
          jumlah: item.qty * item.harga,
        };
        set((state) => ({ rabImtihan: [...state.rabImtihan, newItem] }));
        get().addAuditLog('Bendahara', 'Tambah RAB', `Menambahkan item RAB ${item.keterangan}.`);
      },

      deleteRabItem: (id) => {
        set((state) => ({ rabImtihan: state.rabImtihan.filter((r) => r.id !== id) }));
        get().addAuditLog('Bendahara', 'Hapus RAB', `Item RAB ID ${id} dihapus.`);
      },

      resetRabImtihan: () => {
        set({ rabImtihan: SEED_RAB_IMTIHAN });
        get().addAuditLog('Bendahara', 'Reset RAB', 'RAB Imtihan direset ke standar lampiran resmi.');
      },

      addJagaPiket: (data) => {
        const newItem: JagaPiketRecord = { id: `jp-${Date.now()}`, ...data };
        set((state) => ({ jagaPiketList: [newItem, ...state.jagaPiketList] }));
        get().addAuditLog('Imtihan', 'Jadwal Jaga/Piket', `Menambahkan jadwal ${data.tugas} - ${data.petugasNama}.`);
      },

      updateJagaPiket: (id, data) => {
        set((state) => ({
          jagaPiketList: state.jagaPiketList.map((j) => (j.id === id ? { ...j, ...data } : j)),
        }));
      },

      deleteJagaPiket: (id) => {
        set((state) => ({ jagaPiketList: state.jagaPiketList.filter((j) => j.id !== id) }));
      },

      saveAbsensi: (sessionData) => {
        const newSession: AbsensiSession = {
          id: `abs-${Date.now()}`,
          ...sessionData,
          waktuSimpan: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
        set((state) => ({
          absensiSessions: [newSession, ...state.absensiSessions],
        }));
        get().addAuditLog(
          "Ma'arifan",
          'Simpan Absensi',
          `Absensi kelas ${sessionData.kelas} disimpan oleh ${sessionData.tersimpanOleh}.`
        );
      },

      addKurikulumKitab: (item) => {
        set((state) => ({
          kurikulumKitabList: [...state.kurikulumKitabList, { id: `kur-${Date.now()}`, ...item }],
        }));
      },

      updateKurikulumKitab: (id, item) => {
        set((state) => ({
          kurikulumKitabList: state.kurikulumKitabList.map((k) => (k.id === id ? { ...k, ...item } : k)),
        }));
      },

      deleteKurikulumKitab: (id) => {
        set((state) => ({
          kurikulumKitabList: state.kurikulumKitabList.filter((k) => k.id !== id),
        }));
      },

      addJadwalMaarifan: (item) => {
        set((state) => ({
          jadwalMaarifan: [...state.jadwalMaarifan, { id: `jm-${Date.now()}`, ...item }],
        }));
      },

      updateJadwalMaarifan: (id, item) => {
        set((state) => ({
          jadwalMaarifan: state.jadwalMaarifan.map((j) => (j.id === id ? { ...j, ...item } : j)),
        }));
      },

      deleteJadwalMaarifan: (id) => {
        set((state) => ({
          jadwalMaarifan: state.jadwalMaarifan.filter((j) => j.id !== id),
        }));
      },

      saveAbsensiGuru: (rec) => {
        const newRec: AbsensiGuruRecord = { id: `ag-${Date.now()}`, ...rec };
        set((state) => ({ absensiGuruList: [newRec, ...state.absensiGuruList] }));
        get().addAuditLog("Ma'arifan", 'Absensi Guru', `Presensi ${rec.ustadzNama} (${rec.status}) tercatat.`);
      },

      updateKurikulumMatrixCell: (rowId, kelasKey, kitab, jtm) => {
        set((state) => ({
          kurikulumMatrix: state.kurikulumMatrix.map((row) =>
            row.id === rowId ? { ...row, [kelasKey]: { kitab, jtm } } : row
          ),
        }));
      },

      addKitabPdf: (item) => {
        set((state) => ({
          kitabPdfList: [{ id: `kpdf-${Date.now()}`, ...item }, ...state.kitabPdfList],
        }));
        get().addAuditLog("Ma'arifan", 'Upload Kitab PDF', `Menambahkan kitab PDF ${item.namaKitab}.`);
      },

      deleteKitabPdf: (id) => {
        set((state) => ({
          kitabPdfList: state.kitabPdfList.filter((k) => k.id !== id),
        }));
      },

      setKalenderDayCode: (bulan, day, code) => {
        set((state) => ({
          kalenderPendidikan: {
            ...state.kalenderPendidikan,
            rows: state.kalenderPendidikan.rows.map((r) => {
              if (r.bulan !== bulan) return r;
              const nextDays = { ...r.days };
              if (!code) {
                delete nextDays[day];
              } else {
                nextDays[day] = code;
              }
              return { ...r, days: nextDays };
            }),
          },
        }));
      },

      updateKalenderMeta: (data) => {
        set((state) => ({
          kalenderPendidikan: { ...state.kalenderPendidikan, ...data },
        }));
      },

      resetKalenderPendidikan: () => {
        set({ kalenderPendidikan: SEED_KALENDER_PENDIDIKAN });
      },

      updateGuruAvailability: (ustadzId, data) => {
        set((state) => {
          const exists = state.guruAvailability.some((g) => g.ustadzId === ustadzId);
          if (exists) {
            return {
              guruAvailability: state.guruAvailability.map((g) =>
                g.ustadzId === ustadzId ? { ...g, ...data } : g
              ),
            };
          }
          const ust = state.ustadzList.find((u) => u.id === ustadzId);
          return {
            guruAvailability: [
              ...state.guruAvailability,
              {
                ustadzId,
                ustadzNama: ust?.nama || data.ustadzNama || 'Ustadz',
                jam1Tersedia: data.jam1Tersedia ?? true,
                jam2Tersedia: data.jam2Tersedia ?? true,
                jam3Tersedia: data.jam3Tersedia ?? true,
                alasanRequest: data.alasanRequest || '',
              },
            ],
          };
        });
      },

      addJadwalMengajarSlot: (slot) => {
        set((state) => ({
          jadwalMengajar: [...state.jadwalMengajar, { id: `jms-${Date.now()}`, ...slot }],
        }));
        get().addAuditLog("Ma'arifan", 'Setting Jadwal Guru', `Menjadwalkan ${slot.ustadzNama} mengajar ${slot.mapel} kelas ${slot.kelas}.`);
      },

      deleteJadwalMengajarSlot: (id) => {
        const target = get().jadwalMengajar.find((j) => j.id === id);
        set((state) => ({
          jadwalMengajar: state.jadwalMengajar.filter((j) => j.id !== id),
        }));
        if (target) {
          get().addAuditLog(
            "Ma'arifan",
            'Hapus Jadwal Guru',
            `Menghapus jadwal ${target.ustadzNama} (${target.mapel} · ${target.kelas} · ${target.hari} Jam ${target.jamKe}).`
          );
        }
      },

      addKasTransaction: (trx) => {
        const newTrx: KasTransaction = { id: `kas-${Date.now()}`, ...trx };
        set((state) => ({ kasTransactions: [newTrx, ...state.kasTransactions] }));
        get().addAuditLog('Bendahara', `Kas ${trx.tipe}`, `${trx.uraian} sebesar Rp ${trx.nominal.toLocaleString('id-ID')}.`);
      },

      deleteKasTransaction: (id) => {
        set((state) => ({ kasTransactions: state.kasTransactions.filter((k) => k.id !== id) }));
      },

      updatePayrollRow: (ustadzId, data) => {
        set((state) => ({
          ustadzPayroll: state.ustadzPayroll.map((p) =>
            p.ustadzId === ustadzId ? { ...p, ...data } : p
          ),
        }));
      },

      togglePayrollStatus: (ustadzId) => {
        const today = new Date().toISOString().substring(0, 10);
        set((state) => ({
          ustadzPayroll: state.ustadzPayroll.map((p) =>
            p.ustadzId === ustadzId
              ? {
                  ...p,
                  statusBayar: p.statusBayar === 'Dibayarkan' ? 'Siap' : 'Dibayarkan',
                  terakhirDibayar: p.statusBayar === 'Dibayarkan' ? undefined : today,
                }
              : p
          ),
        }));
      },

      syncPayrollAbsensi: () => {
        set((state) => ({
          ustadzPayroll: state.ustadzPayroll.map((p) => {
            const countHadir = state.absensiGuruList.filter(
              (a) => (a.ustadzId === p.ustadzId || a.ustadzNama === p.ustadzNama) && a.status === 'Hadir'
            ).length;
            const slotCount = state.jadwalMengajar.filter((j) => j.ustadzNama === p.ustadzNama).length;
            return {
              ...p,
              jtmDiniyah: slotCount > 0 ? slotCount : p.jtmDiniyah,
              jumlahHadir: countHadir > 0 ? Math.max(p.jumlahHadir, countHadir) : p.jumlahHadir,
            };
          }),
        }));
        get().addAuditLog('Bendahara', 'Sinkron Absensi Payroll', "JTM dan kehadiran asatidz disinkronkan dari data Ma'arifan.");
      },

      payBisyarohRow: (ustadzId, bulan, tahun = 2026, metode = 'Tunai Loket') => {
        const state = get();
        const row = state.ustadzPayroll.find((p) => p.ustadzId === ustadzId);
        if (!row) return;
        const today = new Date().toISOString().substring(0, 10);
        const bisyarohDiniyah = Math.round(((row.jtmDiniyah * row.jumlahHadir) / 2) * 10000);
        const tunjanganTetap =
          row.gajiPokok +
          row.tunjanganTransportasi +
          row.tunjanganMasaKerja +
          row.tunjanganKomunikasi +
          row.tunjanganJabatan +
          row.bisyarohTakhasus;
        const totalDiterima = tunjanganTetap + bisyarohDiniyah;

        const histEntry: BisyarohHistoryItem = {
          id: `bh-${Date.now()}-${row.ustadzId}`,
          bulan,
          tahun,
          tanggalBayar: today,
          ustadzId: row.ustadzId,
          ustadzNama: row.ustadzNama,
          jabatan: row.jabatan,
          domisili: row.domisili,
          jtmDiniyah: row.jtmDiniyah,
          jumlahHadir: row.jumlahHadir,
          tunjanganTetap,
          bisyarohDiniyah,
          totalDiterima,
          metode,
          petugas: state.currentUser.nama,
        };

        const kasEntry: KasTransaction = {
          id: `kas-${Date.now()}-${row.ustadzId}`,
          tanggal: today,
          tipe: 'Keluar',
          kategori: 'Bisyaroh Asatidz',
          uraian: `Bisyaroh ${row.ustadzNama} (${bulan} ${tahun} · JTM ${row.jtmDiniyah} × Hadir ${row.jumlahHadir})`,
          nominal: totalDiterima,
          penanggungJawab: state.currentUser.nama,
        };

        set((s) => ({
          ustadzPayroll: s.ustadzPayroll.map((p) =>
            p.ustadzId === ustadzId
              ? { ...p, statusBayar: 'Dibayarkan', terakhirDibayar: today }
              : p
          ),
          bisyarohHistory: [histEntry, ...s.bisyarohHistory],
          kasTransactions: [kasEntry, ...s.kasTransactions],
        }));

        get().addAuditLog(
          'Bendahara',
          'Bayar Bisyaroh',
          `Pencairan bisyaroh ${row.ustadzNama} (${bulan} ${tahun}) Rp ${totalDiterima.toLocaleString('id-ID')} via ${metode}.`
        );
      },

      payAllReadyBisyaroh: (bulan, tahun = 2026) => {
        const state = get();
        const readyRows = state.ustadzPayroll.filter((p) => p.statusBayar === 'Siap');
        if (readyRows.length === 0) return 0;
        const today = new Date().toISOString().substring(0, 10);
        const now = Date.now();
        let batchSum = 0;

        const newHistoryEntries: BisyarohHistoryItem[] = readyRows.map((row, idx) => {
          const bisyarohDiniyah = Math.round(((row.jtmDiniyah * row.jumlahHadir) / 2) * 10000);
          const tunjanganTetap =
            row.gajiPokok +
            row.tunjanganTransportasi +
            row.tunjanganMasaKerja +
            row.tunjanganKomunikasi +
            row.tunjanganJabatan +
            row.bisyarohTakhasus;
          const totalDiterima = tunjanganTetap + bisyarohDiniyah;
          batchSum += totalDiterima;
          return {
            id: `bh-${now}-${idx}-${row.ustadzId}`,
            bulan,
            tahun,
            tanggalBayar: today,
            ustadzId: row.ustadzId,
            ustadzNama: row.ustadzNama,
            jabatan: row.jabatan,
            domisili: row.domisili,
            jtmDiniyah: row.jtmDiniyah,
            jumlahHadir: row.jumlahHadir,
            tunjanganTetap,
            bisyarohDiniyah,
            totalDiterima,
            metode: 'Tunai Loket',
            petugas: state.currentUser.nama,
          };
        });

        const kasEntry: KasTransaction = {
          id: `kas-batch-${now}`,
          tanggal: today,
          tipe: 'Keluar',
          kategori: 'Bisyaroh Asatidz',
          uraian: `Pencairan Massal Bisyaroh ${readyRows.length} Ustadz (${bulan} ${tahun})`,
          nominal: batchSum,
          penanggungJawab: state.currentUser.nama,
        };

        set((s) => ({
          ustadzPayroll: s.ustadzPayroll.map((p) =>
            p.statusBayar === 'Siap'
              ? { ...p, statusBayar: 'Dibayarkan', terakhirDibayar: today }
              : p
          ),
          bisyarohHistory: [...newHistoryEntries, ...s.bisyarohHistory],
          kasTransactions: [kasEntry, ...s.kasTransactions],
        }));

        get().addAuditLog(
          'Bendahara',
          'Bayar Bisyaroh Massal',
          `Pencairan massal ${readyRows.length} ustadz (${bulan} ${tahun}) total Rp ${batchSum.toLocaleString('id-ID')}.`
        );
        return readyRows.length;
      },

      bulkUpdatePayrollHadir: (jumlahHadir) => {
        const clamped = Math.max(0, Math.min(31, jumlahHadir));
        set((state) => ({
          ustadzPayroll: state.ustadzPayroll.map((p) => ({ ...p, jumlahHadir: clamped })),
        }));
        get().addAuditLog('Bendahara', 'Update Hadir Massal', `Jumlah hadir seluruh ustadz diperbarui menjadi ${clamped} hari.`);
      },

      resetAllPayrollToSiap: () => {
        set((state) => ({
          ustadzPayroll: state.ustadzPayroll.map((p) => ({ ...p, statusBayar: 'Siap' })),
        }));
        get().addAuditLog('Bendahara', 'Reset Periode Bisyaroh', 'Status penyaluran bisyaroh seluruh ustadz disiapkan untuk periode baru.');
      },

      topUpSaldo: (santriId, nominal, metode) => {
        set((state) => {
          const santri = state.santriList.find((s) => s.id === santriId);
          if (!santri) return {};
          const newTrx: TransaksiKantin = {
            id: `trx-${Date.now()}`,
            santriId,
            santriNama: santri.nama,
            nis: santri.nis,
            nominal,
            tipe: 'Top Up',
            keterangan: `Top up via ${metode}`,
            waktu: new Date().toISOString().replace('T', ' ').substring(0, 16),
            kasir: 'Sistem Saldo Digital',
          };
          return {
            santriList: state.santriList.map((s) =>
              s.id === santriId ? { ...s, saldoKartu: s.saldoKartu + nominal } : s
            ),
            transaksiList: [newTrx, ...state.transaksiList],
          };
        });
        get().addAuditLog('Transaksi', 'Top Up Saldo', `Top up Rp ${nominal.toLocaleString()} untuk santri ID ${santriId}.`);
      },

      prosesBelanjaKantin: (santriId, nominal, keterangan) => {
        const state = get();
        const santri = state.santriList.find((s) => s.id === santriId);
        if (!santri) return { success: false, message: 'Santri tidak ditemukan.' };
        if (santri.statusKartu === 'Terblokir') {
          return { success: false, message: 'Kartu santri sedang DIBLOKIR oleh wali / keamanan.' };
        }
        if (santri.saldoKartu < nominal) {
          return { success: false, message: `Saldo tidak cukup! Saldo saat ini: Rp ${santri.saldoKartu.toLocaleString()}` };
        }

        const todayStr = new Date().toISOString().substring(0, 10);
        const jajanHariIni = state.transaksiList
          .filter(
            (t) =>
              t.santriId === santriId &&
              t.tipe === 'Jajan Kantin' &&
              t.waktu.startsWith(todayStr)
          )
          .reduce((sum, t) => sum + t.nominal, 0);

        if (jajanHariIni + nominal > santri.limitHarian) {
          const sisaLimit = Math.max(0, santri.limitHarian - jajanHariIni);
          return {
            success: false,
            message: `Melebihi batas jajan harian! Batas: Rp ${santri.limitHarian.toLocaleString()}, sisa limit hari ini: Rp ${sisaLimit.toLocaleString()}`,
          };
        }

        const newTrx: TransaksiKantin = {
          id: `trx-${Date.now()}`,
          santriId,
          santriNama: santri.nama,
          nis: santri.nis,
          nominal,
          tipe: 'Jajan Kantin',
          keterangan,
          waktu: new Date().toISOString().replace('T', ' ').substring(0, 16),
          kasir: state.currentUser.nama,
        };

        set((s) => ({
          santriList: s.santriList.map((st) =>
            st.id === santriId ? { ...st, saldoKartu: st.saldoKartu - nominal } : st
          ),
          transaksiList: [newTrx, ...s.transaksiList],
        }));

        get().addAuditLog('Transaksi', 'Belanja POS', `Transaksi Rp ${nominal.toLocaleString()} atas nama ${santri.nama}.`);
        return { success: true, message: 'Transaksi berhasil disetujui & dicatat.' };
      },

      updateLimitHarian: (santriId, limit) => {
        set((state) => ({
          santriList: state.santriList.map((s) =>
            s.id === santriId ? { ...s, limitHarian: limit } : s
          ),
        }));
        get().addAuditLog('Transaksi', 'Batas Harian', `Limit belanja santri ${santriId} diubah menjadi Rp ${limit.toLocaleString()}.`);
      },

      toggleStatusKartu: (santriId) => {
        set((state) => ({
          santriList: state.santriList.map((s) =>
            s.id === santriId
              ? { ...s, statusKartu: s.statusKartu === 'Aktif' ? 'Terblokir' : 'Aktif' }
              : s
          ),
        }));
      },

      addPSBApplicant: (applicant) => {
        const newApp: PSBApplicant = {
          id: `psb-${Date.now()}`,
          ...applicant,
          status: 'Menunggu Verifikasi',
          tanggalDaftar: new Date().toISOString().substring(0, 10),
        };
        set((state) => ({ psbList: [newApp, ...state.psbList] }));
        get().addAuditLog('PSB', 'Daftar Calon', `Calon santri ${applicant.nama} mendaftar online.`);
      },

      verifyPSB: (id, status) => {
        set((state) => ({
          psbList: state.psbList.map((p) => (p.id === id ? { ...p, status } : p)),
        }));
        get().addAuditLog('PSB', 'Verifikasi', `Status pendaftar PSB ${id} diubah menjadi ${status}.`);
      },

      convertPSBToSantri: (applicantId, kelas, kamar) => {
        const state = get();
        const app = state.psbList.find((p) => p.id === applicantId);
        if (!app) return '';

        const newCounter = state.nisCounter + 1;
        const newNis = formatNIS(newCounter, state.nisConfig);
        const tingkat = parseInt(kelas.charAt(0)) || 1;

        const newSantri: SantriRecord = {
          id: `s-${Date.now()}`,
          nis: newNis,
          nama: app.nama.toUpperCase(),
          gender: app.gender,
          kelas,
          tingkat,
          kamar,
          namaWali: app.namaWali,
          hpWali: app.hpWali,
          alamatAsal: app.alamat,
          saldoKartu: 50000,
          limitHarian: 25000,
          statusKartu: 'Aktif',
          nik: app.nik,
          nisn: app.nisn,
          tempatLahir: app.tempatLahir,
          tanggalLahir: app.tanggalLahir,
          noKK: app.noKK,
          namaKepalaKeluarga: app.namaKepalaKeluarga,
          anakKe: app.anakKe,
          jumlahSaudara: app.jumlahSaudara,
          citaCita: app.citaCita,
          hobi: app.hobi,
          nomorKIP: app.nomorKIP,
          dokumenKKUrl: app.dokumenKKUrl,
          dokumenKKName: app.dokumenKKName,
          dokumenKIPUrl: app.dokumenKIPUrl,
          dokumenKIPName: app.dokumenKIPName,
        };

        set({
          nisCounter: newCounter,
          santriList: [newSantri, ...state.santriList],
          psbList: state.psbList.map((p) => (p.id === applicantId ? { ...p, status: 'Resmi Santri' } : p)),
        });

        get().addAuditLog('PSB', 'Jadikan Santri', `Calon santri ${app.nama} resmi menjadi santri dengan NIS ${newNis}.`);
        return newNis;
      },

      addPelanggaran: (data) => {
        const newPlg: PelanggaranRecord = {
          id: `plg-${Date.now()}`,
          ...data,
          status: 'Dalam Pembinaan',
        };
        set((state) => ({ pelanggaranList: [newPlg, ...state.pelanggaranList] }));
        get().addAuditLog('BK', 'Catat Pelanggaran', `Mencatat pelanggaran atas santri ${data.santriNama}.`);
      },

      selesaikanPelanggaran: (id) => {
        set((state) => ({
          pelanggaranList: state.pelanggaranList.map((p) =>
            p.id === id ? { ...p, status: 'Selesai' } : p
          ),
        }));
      },

      addJadwalKeamanan: (data) => {
        set((state) => ({
          jadwalKeamanan: [...state.jadwalKeamanan, { id: `jk-${Date.now()}`, ...data }],
        }));
      },

      deleteJadwalKeamanan: (id) => {
        set((state) => ({
          jadwalKeamanan: state.jadwalKeamanan.filter((j) => j.id !== id),
        }));
      },

      addBukuTamu: (data) => {
        set((state) => ({
          bukuTamu: [{ id: `bt-${Date.now()}`, ...data }, ...state.bukuTamu],
        }));
        get().addAuditLog('BK', 'Buku Tamu', `Mencatat tamu ${data.namaTamu}.`);
      },

      addTitipanWali: (data) => {
        set((state) => ({
          titipanWali: [{ id: `tw-${Date.now()}`, ...data }, ...state.titipanWali],
        }));
        get().addAuditLog('BK', 'Titipan Wali', `Titipan untuk ${data.santriNama} dari ${data.pengirimWali} tercatat.`);
      },

      updateStatusTitipanWali: (id, status) => {
        set((state) => ({
          titipanWali: state.titipanWali.map((t) => (t.id === id ? { ...t, status } : t)),
        }));
        get().addAuditLog('BK', 'Serah Terima Titipan', `Status titipan ${id} diperbarui: ${status}.`);
      },

      addSurat: (surat) => {
        const state = get();
        const nomor = `0${state.suratList.length + 43}/PND/SEKR/XI/2026`;
        const newSurat: SuratItem = {
          id: `srt-${Date.now()}`,
          nomorSurat: nomor,
          ...surat,
        };
        set({ suratList: [newSurat, ...state.suratList] });
        get().addAuditLog('Sekretaris', 'Buat Surat', `Menerbitkan surat nomor ${nomor}.`);
      },

      updateSuratStatus: (id, status) => {
        set((state) => ({
          suratList: state.suratList.map((s) => (s.id === id ? { ...s, status } : s)),
        }));
      },

      addPengurus: (data) => {
        set((state) => ({
          pengurusStruktur: [...state.pengurusStruktur, { id: `png-${Date.now()}`, ...data }],
        }));
      },

      updatePengurus: (id, data) => {
        set((state) => ({
          pengurusStruktur: state.pengurusStruktur.map((p) => (p.id === id ? { ...p, ...data } : p)),
        }));
      },

      deletePengurus: (id) => {
        set((state) => ({
          pengurusStruktur: state.pengurusStruktur.filter((p) => p.id !== id),
        }));
      },

      addSarprasLahan: (data) => {
        set((state) => ({ sarprasLahan: [...state.sarprasLahan, { id: `lhn-${Date.now()}`, ...data }] }));
      },
      deleteSarprasLahan: (id) => {
        set((state) => ({ sarprasLahan: state.sarprasLahan.filter((l) => l.id !== id) }));
      },

      addSarprasGedung: (data) => {
        set((state) => ({ sarprasGedung: [...state.sarprasGedung, { id: `gdg-${Date.now()}`, ...data }] }));
      },
      deleteSarprasGedung: (id) => {
        set((state) => ({ sarprasGedung: state.sarprasGedung.filter((g) => g.id !== id) }));
      },

      addSarprasRuangan: (data) => {
        set((state) => ({ sarprasRuangan: [...state.sarprasRuangan, { id: `rng-${Date.now()}`, ...data }] }));
      },
      deleteSarprasRuangan: (id) => {
        set((state) => ({ sarprasRuangan: state.sarprasRuangan.filter((r) => r.id !== id) }));
      },

      addSarprasPerlengkapan: (data) => {
        set((state) => ({ sarprasPerlengkapan: [...state.sarprasPerlengkapan, { id: `prl-${Date.now()}`, ...data }] }));
      },
      deleteSarprasPerlengkapan: (id) => {
        set((state) => ({ sarprasPerlengkapan: state.sarprasPerlengkapan.filter((p) => p.id !== id) }));
      },

      addBaganNode: (data) => {
        set((state) => ({
          baganOrganisasi: [...state.baganOrganisasi, { id: `org-${Date.now()}`, ...data }],
        }));
      },

      updateBaganNode: (id, data) => {
        set((state) => ({
          baganOrganisasi: state.baganOrganisasi.map((b) => (b.id === id ? { ...b, ...data } : b)),
        }));
      },

      deleteBaganNode: (id) => {
        set((state) => ({
          baganOrganisasi: state.baganOrganisasi.filter((b) => b.id !== id),
        }));
      },

      addAgendaKegiatan: (data) => {
        set((state) => ({
          agendaKegiatan: [{ id: `agk-${Date.now()}`, ...data }, ...state.agendaKegiatan],
        }));
      },

      updateAgendaKegiatan: (id, data) => {
        set((state) => ({
          agendaKegiatan: state.agendaKegiatan.map((a) => (a.id === id ? { ...a, ...data } : a)),
        }));
      },

      deleteAgendaKegiatan: (id) => {
        set((state) => ({
          agendaKegiatan: state.agendaKegiatan.filter((a) => a.id !== id),
        }));
      },

      updateNISConfig: (config) => {
        set({ nisConfig: config });
        get().addAuditLog('Pengaturan', 'Update NIS', `Pengaturan format NIS diperbarui: prefix=${config.prefix}, nomorAwal=${config.nomorAwal}.`);
      },
    }),
    {
      name: 'erp-darussalam-storage-v3',
      partialize: (state) => ({
        nisConfig: state.nisConfig,
        nisCounter: state.nisCounter,
        currentTahunAjaran: state.currentTahunAjaran,
        santriList: state.santriList,
        ustadzList: state.ustadzList,
        kurikulumKitabList: state.kurikulumKitabList,
        kurikulumMatrix: state.kurikulumMatrix,
        kitabPdfList: state.kitabPdfList,
        kalenderPendidikan: state.kalenderPendidikan,
        guruAvailability: state.guruAvailability,
        jadwalMengajar: state.jadwalMengajar,
        ustadzPayroll: state.ustadzPayroll,
        jadwalMaarifan: state.jadwalMaarifan,
        absensiGuruList: state.absensiGuruList,
        baganOrganisasi: state.baganOrganisasi,
        rabImtihan: state.rabImtihan,
        rekapAnggaranBulanan: state.rekapAnggaranBulanan,
        rolePermissions: state.rolePermissions,
        imtihanMaster: state.imtihanMaster,
        jagaPiketList: state.jagaPiketList,
        pengurusStruktur: state.pengurusStruktur,
        sarprasLahan: state.sarprasLahan,
        sarprasGedung: state.sarprasGedung,
        sarprasRuangan: state.sarprasRuangan,
        sarprasPerlengkapan: state.sarprasPerlengkapan,
        kasTransactions: state.kasTransactions,
        bisyarohHistory: state.bisyarohHistory,
        agendaKegiatan: state.agendaKegiatan,
        jadwalKeamanan: state.jadwalKeamanan,
        bukuTamu: state.bukuTamu,
        titipanWali: state.titipanWali,
        auditLogs: state.auditLogs,
        kotakMasuk: state.kotakMasuk,
        absensiSessions: state.absensiSessions,
        soalSubmissions: state.soalSubmissions,
        nilaiList: state.nilaiList,
        ruangUjianList: state.ruangUjianList,
        seatingRandomSeed: state.seatingRandomSeed,
        transaksiList: state.transaksiList,
        psbList: state.psbList,
        suratList: state.suratList,
        pelanggaranList: state.pelanggaranList,
      }),
    }
  )
);
