/**
 * pondokData.ts - Seed data terpusat dan realistis Pondok Pesantren NU Darussalam Karangdadap Pekalongan
 */

export interface PondokConfig {
  nama: string;
  subNama: string;
  namaArab: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  kodePos: string;
  email: string;
  telepon: string;
  website: string;
  pengasuh: {
    nama: string;
    gelar: string;
    biografi: string;
  };
  statistik: {
    totalSantri: number;
    santriPutra: number;
    santriPutri: number;
    asatidz: number;
    kamarPutra: number;
    kamarPutri: number;
    ruangKelas: number;
  };
  fasilitas: {
    judul: string;
    deskripsi: string;
    detail: string[];
  }[];
  kegiatanHarian: {
    waktu: string;
    kegiatan: string;
    keterangan: string;
  }[];
  biayaPSB: {
    komponen: string;
    nominal: number;
    keterangan: string;
  }[];
  syaratPerlengkapan: {
    kategori: string;
    items: string[];
  }[];
}

export const PONDOK_CONFIG: PondokConfig = {
  nama: "Pondok Pesantren NU Darussalam",
  subNama: "Karangdadap - Pekalongan",
  namaArab: "بالمعهد الإسلامي النهضي دار السلام كاراغداداف فكالوغان",
  alamat: "Jl. Raya Karangdadap Km 1, Kec. Karangdadap",
  kelurahan: "Karangdadap",
  kecamatan: "Karangdadap",
  kabupaten: "Pekalongan",
  kodePos: "51173",
  email: "nudarussalam21@gmail.com",
  telepon: "0857-4221-9988",
  website: "https://darussalam-karangdadap.sch.id",
  pengasuh: {
    nama: "KH. Amin Maizun",
    gelar: "Pengasuh Pondok Pesantren NU Darussalam",
    biografi:
      "DATA CONTOH - GANTI: Beliau adalah ulama kharismatik Nahdlatul Ulama dari Karangdadap Pekalongan yang mendedikasikan hidupnya mendidik santri dalam tradisi salafiyah ahlussunnah wal jama'ah an-nahdliyyah, memadukan ketajaman membaca kitab kuning dengan akhlaqul karimah.",
  },
  statistik: {
    totalSantri: 366,
    santriPutra: 160,
    santriPutri: 206,
    asatidz: 35,
    kamarPutra: 9,
    kamarPutri: 10,
    ruangKelas: 12,
  },
  fasilitas: [
    {
      judul: "Asrama Santri yang Asri",
      deskripsi: "9 kamar putra dan 10 kamar putri berpenghawaan alami dengan almari pribadi santri.",
      detail: ["9 Kamar Asrama Putra", "10 Kamar Asrama Putri", "Almari & Kasur Standar Pesantren", "Piket Kebersihan Harian"],
    },
    {
      judul: "Laundry Pondok (Unit Usaha)",
      deskripsi: "Santri tidak mencuci pakaian sendiri agar fokus mengaji dan belajar. Dikelola profesional oleh unit usaha pondok.",
      detail: ["Cuci & Setrika Bersih", "Tagihan terintegrasi Kartu Jajan", "Sistem drop & pick up rapi"],
    },
    {
      judul: "Kantin & Kartu Jajan Digital",
      deskripsi: "Kantin higienis tanpa uang tunai (cashless RFID/tap) dengan limit harian yang dikontrol wali santri.",
      detail: ["POS Kasir Touchscreen", "Monitoring Pengeluaran Real-Time", "Batas Jajan Harian oleh Wali"],
    },
    {
      judul: "Air Minum Galon & Kesehatan",
      deskripsi: "Fasilitas dispenser air minum higienis di tiap lorong asrama dan pos kesehatan santri bekerjasama dengan puskesmas.",
      detail: ["Refill Galon Gratis/Murah", "Poskestren & Obat Siaga", "Air Mineral Teruji Lab"],
    },
    {
      judul: "Madrasah Diniyah Salafiyah (MDS)",
      deskripsi: "Gedung bertingkat 12 ruang kelas untuk pengajian kitab kuning berjenjang (Tingkat 1 s.d. 6 MDS).",
      detail: ["Meja Dampar Kayu Jati", "Papan Tulis & Sound Pengajian", "Perpustakaan Kitab Turats"],
    },
  ],
  kegiatanHarian: [
    { waktu: "03.45 - 04.30", kegiatan: "Bangun Pagi & Qiyamul Lail", keterangan: "Shalat tahajud, witir, dan persiapan shalat shubuh berjamaah di masjid." },
    { waktu: "04.30 - 05.15", kegiatan: "Shalat Shubuh & Wirid Rotibul Haddad", keterangan: "Imam langsung oleh Pengasuh / Asatidz ndalem." },
    { waktu: "05.15 - 06.30", kegiatan: "Pengajian Bandongan Kitab Kuning", keterangan: "Kajian kitab Fathul Qorib, Tafsir Jalalain, dan Ta'limul Muta'allim." },
    { waktu: "06.30 - 07.15", kegiatan: "Makan Pagi & Persiapan Sekolah", keterangan: "Sarapan di kantin pondok dan mandi bergiliran tertib." },
    { waktu: "07.15 - 13.30", kegiatan: "Sekolah Formal (SMP / SMA / SMK)", keterangan: "Santri mengikuti pembelajaran formal di yayasan binaan." },
    { waktu: "13.30 - 14.30", kegiatan: "Shalat Dzuhur, Istirahat & Makan Siang", keterangan: "Qoilulah (tidur siang sunnah sebelum ashar)." },
    { waktu: "15.15 - 17.00", kegiatan: "Shalat Ashar & Madrasah Diniyah Sore", keterangan: "Sorogan nahwu shorof, tahaji, dan hafalan nadhom Aqidatul Awam / Imrithi." },
    { waktu: "17.00 - 17.45", kegiatan: "Mandi & Persiapan Maghrib", keterangan: "Pembersihan asrama dan membaca surat Al-Waqi'ah." },
    { waktu: "18.00 - 19.30", kegiatan: "Shalat Maghrib & Muhafazhah Nadhom", keterangan: "Lalaran nadhom Alfiyah, Shorof, dan tadarus Al-Qur'an bin-nadhor." },
    { waktu: "19.30 - 20.30", kegiatan: "Shalat Isya' & Pengajian Diniyah Malam", keterangan: "Kajian fiqih muamalah, hadits Bukhari, dan tasawuf." },
    { waktu: "20.30 - 22.00", kegiatan: "Musyawarah Kitab & Belajar Mandiri", keterangan: "Muthala'ah / Bahtsul Masail santri per halaqoh kelas." },
    { waktu: "22.00 - 03.45", kegiatan: "Istirahat Malam (Jam Wajib Tidur)", keterangan: "Pintu asrama dikunci, pengawasan keamanan pondok 24 jam." },
  ],
  biayaPSB: [
    { komponen: "Infaq Pendaftaran", nominal: 150000, keterangan: "Satu kali saat registrasi online / offline" },
    { komponen: "Daftar Ulang & Orientasi Santri (MOSBA)", nominal: 600000, keterangan: "Buku pedoman santri, kartu santri RFID, dan map santri" },
    { komponen: "Seragam Pondok (Putra: Baju Koko + Sarung / Putri: Gamis + Kerudung)", nominal: 450000, keterangan: "2 stel seragam resmi NU Darussalam" },
    { komponen: "Kitab Diniyah Gasal & Buku Harian", nominal: 350000, keterangan: "Paket kitab matan, pegon, dan buku catatan madin" },
    { komponen: "Syahriyah / Iuran Bulanan (Makan 3x + Asrama + Diniyah)", nominal: 650000, keterangan: "Dibayar setiap tanggal 1-10 awal bulan" },
    { komponen: "Iuran Laundry Pondok (Bulanan)", nominal: 80000, keterangan: "Paket cuci setrika santri tanpa repot" },
  ],
  syaratPerlengkapan: [
    {
      kategori: "Pakaian Santri Putra",
      items: ["Kemeja putih / koko minimal 3 potong", "Sarung santri minimal 4 helai (bukan celana levis)", "Peci hitam nasional minimal 2 buah", "Jaket / sweater hangat 1 potong"],
    },
    {
      kategori: "Pakaian Santri Putri",
      items: ["Gamis / busana muslimah sopan minimal 4 potong", "Jilbab segi empat lebar & bergo tertutup", "Ciput / inner jilbab dan kaos kaki", "Mukena putih 2 setel"],
    },
    {
      kategori: "Alat Tulis & Mengaji",
      items: ["Al-Qur'an pojok standar kudus / menara", "Kitab nadhom saku (Aqidatul Awam, Jurumiyah)", "Buku tulis pegon bergaris tebal & pulpen 0.5", "Almari gembok ukuran standar"],
    },
  ],
};

export interface LandingAlurStep {
  no: string;
  title: string;
  desc: string;
}

export interface LandingFaqItem {
  q: string;
  a: string;
}

export interface LandingPageConfig {
  tahunAjaranLabel: string;
  heroJudul: string;
  heroDeskripsi: string;
  visiJudul: string;
  visiDeskripsi: string;
  misiList: string[];
  pengasuh: {
    nama: string;
    gelar: string;
    biografi: string;
  };
  statistik: {
    totalSantri: number;
    santriPutra: number;
    santriPutri: number;
    asatidz: number;
    kamarPutra: number;
    kamarPutri: number;
    ruangKelas: number;
  };
  kontak: {
    alamat: string;
    kecamatan: string;
    kabupaten: string;
    kodePos: string;
    email: string;
    telepon: string;
  };
  kegiatanHarian: {
    waktu: string;
    kegiatan: string;
    keterangan: string;
  }[];
  fasilitas: {
    judul: string;
    deskripsi: string;
    detail: string[];
  }[];
  biayaPSB: {
    komponen: string;
    nominal: number;
    keterangan: string;
  }[];
  catatanBiaya: string;
  syaratPerlengkapan: {
    kategori: string;
    items: string[];
  }[];
  alurJudulSection: string;
  alurDaftar: LandingAlurStep[];
  faqs: LandingFaqItem[];
}

export const DEFAULT_LANDING_CONFIG: LandingPageConfig = {
  tahunAjaranLabel: 'Penerimaan Santri Baru Tahun Ajaran 2026/2027 Telah Dibuka',
  heroJudul: 'Mendidik Generasi Santri Berakhlaq Mulia & Mendalam Kitab Kuning',
  heroDeskripsi:
    "Pondok Pesantren NU Darussalam Karangdadap membina santri putra dan putri dalam tradisi salafiyah Ahlussunnah wal Jama'ah An-Nahdliyyah dengan sistem Madrasah Diniyah Salafiyah berjenjang serta fasilitas modern terpadu.",
  visiJudul:
    "Terwujudnya Santri yang 'Alim, Berakhlak Karimah, Mandiri, dan Teguh Berpegang pada Sunnah Wal Jama'ah.",
  visiDeskripsi:
    'Mempersiapkan kader ulama dan cendekiawan muslim yang memiliki kedalaman ilmu agama, kepekaan sosial, serta kesiapan menghadapi tantangan zaman.',
  misiList: [
    "Menyelenggarakan pendidikan madrasah diniyah salafiyah dengan standar muthala'ah kitab kuning yang kokoh.",
    'Membiasakan amaliyah ubudiyah, wirid harian, dan keteladanan akhlakul karimah dalam keseharian santri.',
    "Menyediakan lingkungan asrama yang bersih, tertib, dan kondusif untuk tholabul 'ilmi.",
  ],
  pengasuh: { ...PONDOK_CONFIG.pengasuh },
  statistik: { ...PONDOK_CONFIG.statistik },
  kontak: {
    alamat: PONDOK_CONFIG.alamat,
    kecamatan: PONDOK_CONFIG.kecamatan,
    kabupaten: PONDOK_CONFIG.kabupaten,
    kodePos: PONDOK_CONFIG.kodePos,
    email: PONDOK_CONFIG.email,
    telepon: PONDOK_CONFIG.telepon,
  },
  kegiatanHarian: PONDOK_CONFIG.kegiatanHarian.map((k) => ({ ...k })),
  fasilitas: PONDOK_CONFIG.fasilitas.map((f) => ({ ...f, detail: [...f.detail] })),
  biayaPSB: PONDOK_CONFIG.biayaPSB.map((b) => ({ ...b })),
  catatanBiaya:
    'Syahriyah bulanan (Rp 650.000) sudah mencakup makan santri 3x sehari, asrama, dan iuran madrasah diniyah. Laundry pondok adalah unit usaha terpisah Rp 80.000/bulan.',
  syaratPerlengkapan: PONDOK_CONFIG.syaratPerlengkapan.map((s) => ({ ...s, items: [...s.items] })),
  alurJudulSection: '4 Langkah Mudah Menjadi Santri NU Darussalam',
  alurDaftar: [
    {
      no: '1',
      title: 'Registrasi Akun',
      desc: "Klik tombol 'Daftar Santri Baru' dan buat akun calon santri online.",
    },
    {
      no: '2',
      title: 'Lengkapi Formulir',
      desc: 'Isi data diri, data wali, riwayat sekolah, dan pilihan kelas madin.',
    },
    {
      no: '3',
      title: 'Infaq & Berkas',
      desc: 'Transfer infaq pendaftaran Rp 150.000 dan unggah foto KK serta akta kelahiran.',
    },
    {
      no: '4',
      title: 'Sowan & Masuk Asrama',
      desc: 'Verifikasi administrasi, sowan Pengasuh, penetapan kamar dan NIS santri.',
    },
  ],
  faqs: [
    {
      q: 'Apakah santri diizinkan mencuci pakaian sendiri?',
      a: "Di Pondok Pesantren NU Darussalam, santri tidak mencuci pakaian sendiri agar dapat mencurahkan waktu dan energinya untuk menghafal nadhom dan muthala'ah kitab kuning. Pakaian santri dikelola oleh Unit Usaha Laundry Pondok yang bersih, suci, dan wangi dengan biaya terjangkau.",
    },
    {
      q: 'Berapa kapasitas dan pembagian kamar santri?',
      a: 'Asrama pondok memiliki 9 kamar untuk santri putra (komplek Al-Falah, An-Nur, dll.) dan 10 kamar untuk santri putri (komplek Fatimah, Aisyah, dll.). Setiap kamar memiliki ventilasi alami yang baik dan almari pribadi santri.',
    },
    {
      q: 'Bagaimana sistem pengelolaan uang jajan santri di kantin?',
      a: 'Kantin pondok menerapkan sistem non-tunai (cashless) menggunakan Kartu Santri Digital RFID. Wali santri dapat membatasi kuota belanja harian anak dari rumah melalui portal wali santri dan melakukan top up saldo kapan saja.',
    },
    {
      q: 'Apakah santri boleh membawa telepon genggam (smartphone)?',
      a: 'Santri mukim reguler tidak diperkenankan membawa smartphone pribadi demi menjaga kekhusyukan belajar. Komunikasi dengan wali santri difasilitasi melalui wartel pondok dan nomor resmi pengasuh/pengurus asrama.',
    },
    {
      q: 'Bagaimana dengan jenjang pendidikan formal?',
      a: 'Santri mukim di Darussalam dapat bersekolah formal di lembaga pendidikan mitra sekitar pesantren (SMP / MTs / SMA / SMK) pada pagi hari, kemudian mengikuti Madrasah Diniyah Salafiyah (MDS) pada sore dan malam hari.',
    },
  ],
};

export interface UserAccount {
  id: string;
  username: string;
  nama: string;
  email: string;
  peran: string;
  peranLabel: string;
  avatar: string;
  rolesAvailable: string[];
  keterangan: string;
  santriAnakId?: string; // Khusus wali santri
  noWa?: string;
  password?: string;
  ustadzId?: string;
}

export const CORE_SEED_USERS: UserAccount[] = [
  {
    id: "u-pengasuh",
    username: "pengasuh",
    nama: "KH. Amin Maizun",
    email: "pengasuh@darussalam.id",
    noWa: "081128000001",
    password: "darussalam2026",
    ustadzId: "ust-1",
    peran: "pengasuh",
    peranLabel: "Pengasuh Pondok",
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80",
    rolesAvailable: ["pengasuh"],
    keterangan: "Akses penuh persetujuan syar'i, keuangan, pembinaan, dan laporan eksekutif",
  },
  {
    id: "u-ketua-imtihan",
    username: "nidhomul",
    nama: "Ust. Nidhomul Muna Lana",
    email: "nidhomul@darussalam.id",
    noWa: "085727005566",
    password: "darussalam2026",
    ustadzId: "ust-4",
    peran: "ketua_imtihan",
    peranLabel: "Ketua Imtihan / Panitia",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rolesAvailable: ["ketua_imtihan", "guru_pengampu"],
    keterangan: "Pengelola penuh ujian imtihan: blanko soal, denah acak, kartu, raport, dan RAB Imtihan",
  },
  {
    id: "u-bendahara",
    username: "fataah",
    nama: "M. Abdul Fataah",
    email: "bendahara@darussalam.id",
    noWa: "081903004455",
    password: "darussalam2026",
    ustadzId: "ust-7",
    peran: "bendahara",
    peranLabel: "Bendahara Pondok & Imtihan",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rolesAvailable: ["bendahara", "guru_pengampu"],
    keterangan: "Pengelola kas, arus kas, iuran santri, penggajian, transparansi RAB, dan rekonsiliasi jajan",
  },
  {
    id: "u-guru",
    username: "abdurrahman",
    nama: "Ust. Abdur Rahman",
    email: "abdurrahman@darussalam.id",
    noWa: "085641003344",
    password: "darussalam2026",
    ustadzId: "ust-3",
    peran: "guru_pengampu",
    peranLabel: "Guru Pengampu Fiqih & MDS",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    rolesAvailable: ["guru_pengampu"],
    keterangan: "Penyusunan naskah soal imtihan, input nilai santri, dan absensi kelas",
  },
  {
    id: "u-madin",
    username: "syarif",
    nama: "Ust. Syarif Hidayatullah",
    email: "madin@darussalam.id",
    noWa: "081226001122",
    password: "darussalam2026",
    ustadzId: "ust-2",
    peran: "kepala_madin",
    peranLabel: "Kepala Madrasah Diniyah",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    rolesAvailable: ["kepala_madin", "guru_pengampu"],
    keterangan: "Manajemen kurikulum, kitab salaf, rekapitulasi evaluasi diniyah, dan absensi guru",
  },
  {
    id: "u-sekretaris",
    username: "sekretaris",
    nama: "Ust. Ahmad Mujiburrohman",
    email: "sekretaris@darussalam.id",
    noWa: "081325007788",
    password: "darussalam2026",
    ustadzId: "ust-5",
    peran: "sekretaris",
    peranLabel: "Sekretaris Yayasan & MDS",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rolesAvailable: ["sekretaris", "guru_pengampu"],
    keterangan: "Persuratan resmi, nomor otomatis, arsip dokumen, master data santri & asatidz, inventaris",
  },
  {
    id: "u-kemahadiyahan",
    username: "kemahadiyahan",
    nama: "Ust. Khoirul Umam",
    email: "kemahadiyahan@darussalam.id",
    noWa: "085866008899",
    password: "darussalam2026",
    ustadzId: "ust-6",
    peran: "kemahadiyahan",
    peranLabel: "Bagian Kema'hadiyahan",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    rolesAvailable: ["kemahadiyahan", "guru_pengampu"],
    keterangan: "Struktur kepanitiaan PHBI & PHBN, kalender kegiatan, pembagian tugas asrama",
  },
  {
    id: "u-bk",
    username: "keamanan",
    nama: "Ust. Bahrul Ulum",
    email: "keamanan@darussalam.id",
    noWa: "085788990011",
    password: "darussalam2026",
    peran: "bk_keamanan",
    peranLabel: "Ketertiban & BK Keamanan",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    rolesAvailable: ["bk_keamanan"],
    keterangan: "Pencatatan takzir, poin pelanggaran santri, perizinan pulang, buku tamu keamanan 24 jam",
  },
  {
    id: "u-kasir",
    username: "kantin",
    nama: "Mbak Siti Rohmah",
    email: "kantin@darussalam.id",
    noWa: "085640001199",
    password: "darussalam2026",
    peran: "kasir_kantin",
    peranLabel: "Kasir Kantin & Laundry",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    rolesAvailable: ["kasir_kantin"],
    keterangan: "POS transaksi jajan tap RFID, tagihan laundry pondok, tutup kas harian",
  },
  {
    id: "u-wali",
    username: "walisantri",
    nama: "H. Mustofa (Wali Muhammad Zidni)",
    email: "mustofa@gmail.com",
    noWa: "081399887700",
    password: "darussalam2026",
    peran: "wali_santri",
    peranLabel: "Wali Santri (Muhammad Zidni)",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    rolesAvailable: ["wali_santri"],
    keterangan: "Portal pantau khusus perkembangan putra: nilai imtihan, saldo jajan, atur limit jajan, tagihan syahriyah",
    santriAnakId: "s-001",
  },
  {
    id: "u-admin",
    username: "admin",
    nama: "Administrator Sistem ERP",
    email: "admin@darussalam.id",
    noWa: "081128009999",
    password: "admin",
    peran: "admin_sistem",
    peranLabel: "Administrator Sistem ERP",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    rolesAvailable: ["admin_sistem", "pengasuh", "ketua_imtihan", "bendahara", "sekretaris"],
    keterangan: "Akses super-admin: manajemen peran, konfigurasi database, jejak audit, backup, simulasi peran",
  },
  {
    id: "u-satpam-riyadi",
    username: "riyadi",
    nama: "Pak Riyadi",
    email: "riyadi.satpam@darussalam.id",
    noWa: "085711220001",
    password: "darussalam2026",
    peran: "bk_keamanan",
    peranLabel: "Komandan Regu Satpam",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rolesAvailable: ["bk_keamanan"],
    keterangan: "Petugas Satpam PP NU Darussalam — Absensi Mobile HP, Buku Tamu, Titipan Wali & Patroli Komplek",
  },
  {
    id: "u-satpam-suwarno",
    username: "suwarno",
    nama: "Pak Suwarno",
    email: "suwarno.satpam@darussalam.id",
    noWa: "085711220002",
    password: "darussalam2026",
    peran: "bk_keamanan",
    peranLabel: "Petugas Satpam Keamanan",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rolesAvailable: ["bk_keamanan"],
    keterangan: "Petugas Satpam PP NU Darussalam — Absensi Mobile HP, Gerbang Utama & Patroli Putra",
  },
  {
    id: "u-satpam-sopoyono",
    username: "sopoyono",
    nama: "Pak Sopoyono",
    email: "sopoyono.satpam@darussalam.id",
    noWa: "085711220003",
    password: "darussalam2026",
    peran: "bk_keamanan",
    peranLabel: "Petugas Satpam Keamanan",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    rolesAvailable: ["bk_keamanan"],
    keterangan: "Petugas Satpam PP NU Darussalam — Absensi Mobile HP, Pos Penjengukan & Komplek Putri",
  },
];

// SEED_USERS will be populated right after SEED_USTADZ_LIST below to include every individual guru account
export let SEED_USERS: UserAccount[] = [...CORE_SEED_USERS];

export interface SantriRecord {
  id: string;
  nis: string;
  nama: string;
  gender: 'L' | 'P';
  kelas: string;
  tingkat: number;
  kamar: string;
  namaWali: string;
  hpWali: string;
  alamatAsal: string;
  saldoKartu: number;
  limitHarian: number;
  statusKartu: 'Aktif' | 'Terblokir';
  statusPondok?: 'Aktif' | 'Boyong / Keluar' | 'Lulus / Alumni';
  isSantriNdalem?: boolean;
  // EMIS Extended Fields
  nisn?: string;
  nism?: string;
  nik?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  anakKe?: number;
  jumlahSaudara?: number;
  citaCita?: string;
  hobi?: string;
  noHP?: string;
  emailSantri?: string;
  aktivitasPendidikan?: string;
  pembiayaSekolah?: string;
  kebutuhanKhusus?: string;
  kebutuhanDisabilitas?: string;
  nomorKIP?: string;
  tahunKIP?: string;
  noKK?: string;
  namaKepalaKeluarga?: string;
  dokumenKKUrl?: string;
  dokumenKKName?: string;
  dokumenKIPUrl?: string;
  dokumenKIPName?: string;
  alamatDetail?: string;
  waliKelas?: string;
}

export const DAFTAR_KELAS_DINIYAH = [
  '1 A PUTRA',
  '1 B PUTRA',
  '1 A PUTRI',
  '1 B PUTRI',
  '2 A PUTRA',
  '2 B PUTRA',
  '2 A PUTRI',
  '2 B PUTRI',
  '2 C PUTRI',
  '3 A PUTRA',
  '3 B PUTRA',
  '3 A PUTRI',
  '4 A PUTRA',
  '4 A PUTRI',
  '5 A PUTRA & PUTRI',
  '6 A PUTRA & PUTRI',
] as const;

export interface MapelTingkatTemplate {
  kodePrefix: string;
  nama: string;
  namaArab: string;
  kitab: string;
}

export const MAPEL_PER_TINGKAT: Record<number, MapelTingkatTemplate[]> = {
  1: [
    { kodePrefix: 'QUR', nama: "Al-Qur'an (lisan oleh guru pengampu)", namaArab: 'القرآن الكريم', kitab: "Al-Qur'an Bin-Nadhor" },
    { kodePrefix: 'AKH', nama: 'Akhlak', namaArab: 'الأخلاق', kitab: 'Taisirul Kholaq (Pegon)' },
    { kodePrefix: 'TAJ', nama: 'Tajwid', namaArab: 'التجويد', kitab: 'Tuhfatul Athfal / Tajwid' },
    { kodePrefix: 'FQH', nama: 'Fiqih', namaArab: 'الفقه', kitab: 'Matan Taqrib (Pegon)' },
    { kodePrefix: 'NHW', nama: 'Nahwu', namaArab: 'النحو', kitab: 'Nahwu Jawan' },
    { kodePrefix: 'THD', nama: 'Tauhid', namaArab: 'التوحيد', kitab: 'Aqidatul Awam' },
    { kodePrefix: 'SHR', nama: 'Shorof', namaArab: 'الصرف', kitab: 'Amtsilah Tashrifiyyah' },
    { kodePrefix: 'THJ', nama: 'Tahaji', namaArab: 'التهجي', kitab: 'Tahaji & Qiroah Pegon' },
  ],
  2: [
    { kodePrefix: 'HDT', nama: 'Hadits', namaArab: 'الحديث', kitab: "Al-Arba'in An-Nawawiyyah" },
    { kodePrefix: 'TRK', nama: 'Tarikh', namaArab: 'التاريخ', kitab: 'Khulashoh Nurul Yaqin' },
    { kodePrefix: 'SHR', nama: 'Shorof', namaArab: 'الصرف', kitab: 'Amtsilah Tashrifiyyah Lughowi' },
    { kodePrefix: 'FQH', nama: 'Fiqih', namaArab: 'الفقه', kitab: 'Matan Taqrib' },
    { kodePrefix: 'AKH', nama: 'Akhlak', namaArab: 'الأخلاق', kitab: "Washoya Al-Aba' lil Abna'" },
    { kodePrefix: 'NHW', nama: 'Nahwu', namaArab: 'النحو', kitab: 'Matan Al-Ajurumiyyah' },
    { kodePrefix: 'THD', nama: 'Tauhid', namaArab: 'التوحيد', kitab: 'Aqidatul Islamiyyah' },
  ],
  3: [
    { kodePrefix: 'HDT', nama: 'Hadits', namaArab: 'الحديث', kitab: 'Bulughul Marom' },
    { kodePrefix: 'SHR', nama: 'Shorof', namaArab: 'الصرف', kitab: "Qowaidul I'lal" },
    { kodePrefix: 'NHW', nama: 'Nahwu', namaArab: 'النحو', kitab: 'Nadhom Al-Imrithi' },
    { kodePrefix: 'FQH', nama: 'Fiqih', namaArab: 'الفقه', kitab: 'Fathul Qorib' },
    { kodePrefix: 'AKH', nama: 'Akhlak', namaArab: 'الأخلاق', kitab: "Ta'limul Muta'allim" },
    { kodePrefix: 'ULQ', nama: "Ulumul Qur'an", namaArab: 'علوم القرآن', kitab: "Mukhtashor fi Ulumil Qur'an" },
    { kodePrefix: 'FRD', nama: 'Faroidh', namaArab: 'الفرائض', kitab: 'Ilmu Faroidh' },
    { kodePrefix: 'THD', nama: 'Tauhid', namaArab: 'التوحيد', kitab: 'Jawahirul Kalamiyyah' },
  ],
  4: [
    { kodePrefix: 'THD', nama: 'Tauhid', namaArab: 'التوحيد', kitab: 'Hushunul Hamidiyyah' },
    { kodePrefix: 'USF', nama: 'Ushul Fiqih', namaArab: 'أصول الفقه', kitab: 'Al-Bayan fi Ushulil Fiqih' },
    { kodePrefix: 'NHW', nama: 'Nahwu', namaArab: 'النحو', kitab: 'Alfiyah Ibnu Malik' },
    { kodePrefix: 'AKH', nama: 'Akhlak', namaArab: 'الأخلاق', kitab: 'Matan Bidayatul Hidayah' },
    { kodePrefix: 'TFS', nama: 'Tafsir', namaArab: 'التفسير', kitab: 'Tafsir Ayatil Ahkam' },
    { kodePrefix: 'HDT', nama: 'Hadits', namaArab: 'الحديث', kitab: 'Bulughul Marom' },
    { kodePrefix: 'FQH', nama: 'Fiqih', namaArab: 'الفقه', kitab: 'Fathul Qorib' },
    { kodePrefix: 'IHD', nama: 'Ilmu Hadits', namaArab: 'علم الحديث', kitab: 'Minhatul Mughits' },
  ],
  5: [
    { kodePrefix: 'FQH', nama: 'Fiqih', namaArab: 'الفقه', kitab: "Fathul Mu'in" },
    { kodePrefix: 'AKH', nama: 'Akhlak', namaArab: 'الأخلاق', kitab: 'Risalatul Muawanah' },
    { kodePrefix: 'NHW', nama: 'Nahwu', namaArab: 'النحو', kitab: 'Alfiyah Ibnu Malik' },
    { kodePrefix: 'USF', nama: 'Ushul Fiqih', namaArab: 'أصول الفقه', kitab: 'Al-Bayan fi Ushulil Fiqih' },
    { kodePrefix: 'QWF', nama: 'Qowaidul Fiqhiyyah', namaArab: 'القواعد الفقهية', kitab: 'Faraidul Bahiyyah' },
    { kodePrefix: 'FRD', nama: 'Faroidh', namaArab: 'الفرائض', kitab: 'Ilmu Faroidh' },
    { kodePrefix: 'HDT', nama: 'Hadits', namaArab: 'الحديث', kitab: 'Jawahirul Bukhori' },
    { kodePrefix: 'TFS', nama: 'Tafsir', namaArab: 'التفسير', kitab: 'Tafsir Jalalain' },
    { kodePrefix: 'THD', nama: 'Tauhid', namaArab: 'التوحيد', kitab: 'Hushunul Hamidiyyah' },
  ],
  6: [
    { kodePrefix: 'QWF', nama: 'Qowaidul Fiqhiyah', namaArab: 'القواعد الفقهية', kitab: 'Faraidul Bahiyyah' },
    { kodePrefix: 'FQH', nama: "Fathul Mu'in (Fiqih)", namaArab: 'فتح المعين (الفقه)', kitab: "Fathul Mu'in" },
    { kodePrefix: 'NHW', nama: 'Alfiyah Ibnu Malik (Nahwu)', namaArab: 'ألفية ابن مالك (النحو)', kitab: 'Alfiyah Ibnu Malik' },
    { kodePrefix: 'TFS', nama: 'Tafsir Jalalain', namaArab: 'تفسير الجلالين', kitab: 'Tafsir Jalalain' },
    { kodePrefix: 'BLG', nama: 'Qowaidul Lughotul Arabiyyah (Balaghoh)', namaArab: 'قواعد اللغة العربية (البلاغة)', kitab: 'Qowaidul Lughotul Arabiyyah' },
    { kodePrefix: 'ITF', nama: 'Ilmu Tafsir', namaArab: 'علم التفسير', kitab: 'Ilmu Tafsir / Ulumul Quran' },
    { kodePrefix: 'HDT', nama: 'Jawahirul Bukhori (Hadits)', namaArab: 'جواهر البخاري (الحديث)', kitab: 'Jawahirul Bukhori' },
    { kodePrefix: 'USF', nama: 'Al-Bayan (Ushul Fiqih)', namaArab: 'البيان (أصول الفقه)', kitab: 'Al-Bayan fi Ushulil Fiqih' },
  ],
};

export const SEED_SANTRI_LIST: SantriRecord[] = [
  {
    id: "s-001",
    nis: "24.1001",
    nama: "MUHAMMAD ZIDNI ALBI FALAKHI",
    gender: "L",
    kelas: "2 A PUTRA",
    tingkat: 2,
    kamar: "Al-Falah 1",
    namaWali: "H. Mustofa",
    hpWali: "0812-3456-7890",
    alamatAsal: "Wonopringgo, Pekalongan",
    saldoKartu: 85000,
    limitHarian: 25000,
    statusKartu: "Aktif",
  },
  {
    id: "s-002",
    nis: "24.1002",
    nama: "AHMAD SYAUQI MAHFUDZ",
    gender: "L",
    kelas: "2 A PUTRA",
    tingkat: 2,
    kamar: "Al-Falah 2",
    namaWali: "K.H. Mahfudz",
    hpWali: "0813-9876-5432",
    alamatAsal: "Kedungwuni, Pekalongan",
    saldoKartu: 120000,
    limitHarian: 30000,
    statusKartu: "Aktif",
  },
  {
    id: "s-003",
    nis: "24.1003",
    nama: "MOH. FAHRI MAULANA",
    gender: "L",
    kelas: "2 B PUTRA",
    tingkat: 2,
    kamar: "An-Nur 1",
    namaWali: "Bpk. Sutrisno",
    hpWali: "0858-1122-3344",
    alamatAsal: "Doro, Pekalongan",
    saldoKartu: 45000,
    limitHarian: 20000,
    statusKartu: "Aktif",
  },
  {
    id: "s-004",
    nis: "23.1004",
    nama: "MUHAMMAD FARHAN NAJIB",
    gender: "L",
    kelas: "3 A PUTRA",
    tingkat: 3,
    kamar: "Al-Ikhlas 1",
    namaWali: "Bpk. Najibullah",
    hpWali: "0877-5544-3322",
    alamatAsal: "Talun, Pekalongan",
    saldoKartu: 210000,
    limitHarian: 35000,
    statusKartu: "Aktif",
  },
  {
    id: "s-005",
    nis: "25.1005",
    nama: "MUHAMMAD KHUDZAIFAH",
    gender: "L",
    kelas: "1 A PUTRA",
    tingkat: 1,
    kamar: "Ar-Rohman 1",
    namaWali: "Bpk. Zamzami",
    hpWali: "0812-7788-9900",
    alamatAsal: "Batang",
    saldoKartu: 60000,
    limitHarian: 20000,
    statusKartu: "Aktif",
  },
  {
    id: "s-006",
    nis: "22.1006",
    nama: "ALI MASHURI",
    gender: "L",
    kelas: "4 A PUTRA",
    tingkat: 4,
    kamar: "Al-Barokah 1",
    namaWali: "Bpk. Masrur",
    hpWali: "0852-3344-5566",
    alamatAsal: "Kajen, Pekalongan",
    saldoKartu: 15000,
    limitHarian: 25000,
    statusKartu: "Aktif",
  },
  {
    id: "s-007",
    nis: "21.1007",
    nama: "MOHAMMAD ZULFA IZZUDDIN",
    gender: "L",
    kelas: "5 A PUTRA & PUTRI",
    tingkat: 5,
    kamar: "As-Salam 1",
    namaWali: "Bpk. Izzuddin",
    hpWali: "0896-1234-5678",
    alamatAsal: "Tirto, Pekalongan",
    saldoKartu: 300000,
    limitHarian: 50000,
    statusKartu: "Aktif",
  },
  {
    id: "s-008",
    nis: "20.1008",
    nama: "LUTHFI HAKIM AL-ANSHORI",
    gender: "L",
    kelas: "6 A PUTRA & PUTRI",
    tingkat: 6,
    kamar: "Al-Karim 1",
    namaWali: "Bpk. Anshor",
    hpWali: "0813-4455-6677",
    alamatAsal: "Buaran, Pekalongan",
    saldoKartu: 95000,
    limitHarian: 30000,
    statusKartu: "Aktif",
    isSantriNdalem: true,
  },
  // Santri Putri
  {
    id: "s-101",
    nis: "24.2001",
    nama: "DURROTUN NAFISAH",
    gender: "P",
    kelas: "2 A PUTRI",
    tingkat: 2,
    kamar: "Fatimah 1",
    namaWali: "Bpk. Qomaruddin",
    hpWali: "0857-9988-7766",
    alamatAsal: "Wiradesa, Pekalongan",
    saldoKartu: 140000,
    limitHarian: 25000,
    statusKartu: "Aktif",
  },
  {
    id: "s-102",
    nis: "25.2002",
    nama: "SALMA NABILATUL CHUSNA",
    gender: "P",
    kelas: "1 A PUTRI",
    tingkat: 1,
    kamar: "Aisyah 1",
    namaWali: "Bpk. Chusnan",
    hpWali: "0878-3322-1100",
    alamatAsal: "Karanganyar, Pekalongan",
    saldoKartu: 75000,
    limitHarian: 20000,
    statusKartu: "Aktif",
  },
  {
    id: "s-103",
    nis: "23.2003",
    nama: "ZULFA FARIKHAH",
    gender: "P",
    kelas: "3 A PUTRI",
    tingkat: 3,
    kamar: "Khadijah 1",
    namaWali: "Bpk. Farikhin",
    hpWali: "0812-9900-1122",
    alamatAsal: "Kesesi, Pekalongan",
    saldoKartu: 180000,
    limitHarian: 30000,
    statusKartu: "Aktif",
  },
  {
    id: "s-104",
    nis: "22.2004",
    nama: "NURUL AINI SALSABILA",
    gender: "P",
    kelas: "4 A PUTRI",
    tingkat: 4,
    kamar: "Maryam 1",
    namaWali: "Bpk. Zaenal Arifin",
    hpWali: "0853-4455-6688",
    alamatAsal: "Sragi, Pekalongan",
    saldoKartu: 50000,
    limitHarian: 25000,
    statusKartu: "Aktif",
  },
];

// Generate additional santri sample for full 130 mock dataset demo
export function generateMockSantri(total: number = 130): SantriRecord[] {
  const list = [...SEED_SANTRI_LIST];
  const firstNamesL = ["Ahmad", "Muhammad", "Fikri", "Zainal", "Hasan", "Husain", "Ridho", "Fatih", "Ziyad", "Khoirul", "Anas", "Habib"];
  const lastNames = ["Falah", "Maulana", "Ihsan", "Karim", "Wafa", "Hidayat", "Sholih", "Syukron", "Zuhdi", "Tamam", "Ghozali"];
  const firstNamesP = ["Aisyah", "Fatimah", "Nabila", "Khadijah", "Salwa", "Zahra", "Hilya", "Mar'ah", "Lulu", "Uswatun", "Afifah"];

  const classesL = ["1 A PUTRA", "1 B PUTRA", "2 A PUTRA", "2 B PUTRA", "3 A PUTRA", "3 B PUTRA", "4 A PUTRA", "5 A PUTRA & PUTRI", "6 A PUTRA & PUTRI"];
  const classesP = ["1 A PUTRI", "1 B PUTRI", "2 A PUTRI", "2 B PUTRI", "2 C PUTRI", "3 A PUTRI", "4 A PUTRI", "5 A PUTRA & PUTRI", "6 A PUTRA & PUTRI"];

  let count = list.length;
  while (count < total) {
    const isPutra = count % 2 === 0;
    const gender = isPutra ? 'L' : 'P';
    const firstArr = isPutra ? firstNamesL : firstNamesP;
    const fName = firstArr[count % firstArr.length];
    const lName = lastNames[(count * 3) % lastNames.length];
    const fullName = `${fName.toUpperCase()} ${lName.toUpperCase()} ${count + 1}`;
    const cls = isPutra ? classesL[count % classesL.length] : classesP[count % classesP.length];
    const tingkat = parseInt(cls.charAt(0)) || 1;

    list.push({
      id: `s-${1000 + count}`,
      nis: `24.${1000 + count}`,
      nama: fullName,
      gender,
      kelas: cls,
      tingkat,
      kamar: isPutra ? `Al-Falah ${(count % 9) + 1}` : `Fatimah ${(count % 10) + 1}`,
      namaWali: `Bpk. ${lastNames[count % lastNames.length]}`,
      hpWali: `0857-${String(count).padStart(4, '0')}-9988`,
      alamatAsal: "Pekalongan & Sekitarnya",
      saldoKartu: 50000 + (count % 10) * 15000,
      limitHarian: 25000,
      statusKartu: "Aktif",
    });
    count++;
  }
  return list;
}

export interface MataPelajaranImtihan {
  id: string;
  kode: string;
  nama: string;
  namaArab: string;
  tingkat: number; // 1 s.d. 6
  guruPengampu: string;
  kitab: string;
  tingkatKesulitan: 'Ringan' | 'Sedang' | 'Berat' | 'Lisan';
  malam: string;
  sesi: string;
  jamMulai: string;
  jamSelesai: string;
}

export const SEED_MAPEL_IMTIHAN: MataPelajaranImtihan[] = [
  // Tingkat 1
  { id: "m-01", kode: "QUR-1", nama: "Al-Qur'an (lisan oleh guru pengampu)", namaArab: "القرآن الكريم", tingkat: 1, guruPengampu: "Ust. Abdur Rahman", kitab: "Al-Qur'an Bin-Nadhor", tingkatKesulitan: "Lisan", malam: "Malam 6 Des (Sabtu)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-02", kode: "AKH-1", nama: "Akhlak", namaArab: "الأخلاق", tingkat: 1, guruPengampu: "Ust. Khoirul Umam", kitab: "Taisirul Kholaq (Pegon)", tingkatKesulitan: "Sedang", malam: "Malam 6 Des (Sabtu)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-03", kode: "TAJ-1", nama: "Tajwid", namaArab: "التجويد", tingkat: 1, guruPengampu: "M. Abdul Fataah", kitab: "Tuhfatul Athfal / Tajwid", tingkatKesulitan: "Ringan", malam: "Malam 6 Des (Sabtu)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },
  { id: "m-04", kode: "FQH-1", nama: "Fiqih", namaArab: "الفقه", tingkat: 1, guruPengampu: "Ust. Abdur Rahman", kitab: "Matan Taqrib (Pegon)", tingkatKesulitan: "Sedang", malam: "Malam 7 Des (Ahad)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-05", kode: "NHW-1", nama: "Nahwu", namaArab: "النحو", tingkat: 1, guruPengampu: "Ust. Nidhomul Muna Lana", kitab: "Nahwu Jawan", tingkatKesulitan: "Berat", malam: "Malam 8 Des (Senin)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-06", kode: "THD-1", nama: "Tauhid", namaArab: "التوحيد", tingkat: 1, guruPengampu: "Ust. Syarif Hidayatullah", kitab: "Aqidatul Awam", tingkatKesulitan: "Ringan", malam: "Malam 7 Des (Ahad)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },
  { id: "m-07", kode: "SHR-1", nama: "Shorof", namaArab: "الصرف", tingkat: 1, guruPengampu: "Ust. Ahmad Mujiburrohman", kitab: "Amtsilah Tashrifiyyah", tingkatKesulitan: "Sedang", malam: "Malam 9 Des (Selasa)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-08", kode: "THJ-1", nama: "Tahaji", namaArab: "التهجي", tingkat: 1, guruPengampu: "Ust. Abdur Rahman", kitab: "Tahaji & Qiroah Pegon", tingkatKesulitan: "Ringan", malam: "Malam 9 Des (Selasa)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },

  // Tingkat 2
  { id: "m-09", kode: "HDT-2", nama: "Hadits", namaArab: "الحديث", tingkat: 2, guruPengampu: "Ust. Khoirul Umam", kitab: "Al-Arba'in An-Nawawiyyah", tingkatKesulitan: "Sedang", malam: "Malam 8 Des (Senin)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },
  { id: "m-10", kode: "TRK-2", nama: "Tarikh", namaArab: "التاريخ", tingkat: 2, guruPengampu: "Ust. Ahmad Rifa'i", kitab: "Khulashoh Nuril Yaqin", tingkatKesulitan: "Ringan", malam: "Malam 6 Des (Sabtu)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },
  { id: "m-11", kode: "SHR-2", nama: "Shorof", namaArab: "الصرف", tingkat: 2, guruPengampu: "Ust. Ahmad Mujiburrohman", kitab: "Amtsilah Tashrifiyyah Lughowi", tingkatKesulitan: "Sedang", malam: "Malam 9 Des (Selasa)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-12", kode: "FQH-2", nama: "Fiqih", namaArab: "الفقه", tingkat: 2, guruPengampu: "Ust. Abdur Rahman", kitab: "Matan Taqrib", tingkatKesulitan: "Sedang", malam: "Malam 7 Des (Ahad)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-13", kode: "AKH-2", nama: "Akhlak", namaArab: "الأخلاق", tingkat: 2, guruPengampu: "Ust. Khoirul Umam", kitab: "Washoya Al-Aba' lil Abna'", tingkatKesulitan: "Ringan", malam: "Malam 6 Des (Sabtu)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-14", kode: "NHW-2", nama: "Nahwu", namaArab: "النحو", tingkat: 2, guruPengampu: "Ust. Nidhomul Muna Lana", kitab: "Matan Al-Ajurumiyyah", tingkatKesulitan: "Berat", malam: "Malam 8 Des (Senin)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-15", kode: "THD-2", nama: "Tauhid", namaArab: "التوحيد", tingkat: 2, guruPengampu: "Ust. Syarif Hidayatullah", kitab: "Aqidatul Islamiyyah", tingkatKesulitan: "Ringan", malam: "Malam 7 Des (Ahad)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },

  // Tingkat 3
  { id: "m-16", kode: "HDT-3", nama: "Hadits", namaArab: "الحديث", tingkat: 3, guruPengampu: "KH. Amin Maizun", kitab: "Bulughul Marom", tingkatKesulitan: "Berat", malam: "Malam 7 Des (Ahad)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },
  { id: "m-17", kode: "SHR-3", nama: "Shorof", namaArab: "الصرف", tingkat: 3, guruPengampu: "Ust. Ahmad Mujiburrohman", kitab: "Qowaidul I'lal", tingkatKesulitan: "Sedang", malam: "Malam 9 Des (Selasa)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-18", kode: "NHW-3", nama: "Nahwu", namaArab: "النحو", tingkat: 3, guruPengampu: "Ust. Nidhomul Muna Lana", kitab: "Nadhom Al-Imrithi", tingkatKesulitan: "Berat", malam: "Malam 8 Des (Senin)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-19", kode: "FQH-3", nama: "Fiqih", namaArab: "الفقه", tingkat: 3, guruPengampu: "Ust. Abdur Rahman", kitab: "Fathul Qorib", tingkatKesulitan: "Berat", malam: "Malam 7 Des (Ahad)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-20", kode: "AKH-3", nama: "Akhlak", namaArab: "الأخلاق", tingkat: 3, guruPengampu: "Ust. Khoirul Umam", kitab: "Ta'limul Muta'allim", tingkatKesulitan: "Sedang", malam: "Malam 6 Des (Sabtu)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-21", kode: "ULQ-3", nama: "Ulumul Qur'an", namaArab: "علوم القرآن", tingkat: 3, guruPengampu: "Ust. Syarif Hidayatullah", kitab: "Mukhtashor fi Ulumil Qur'an", tingkatKesulitan: "Sedang", malam: "Malam 8 Des (Senin)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },
  { id: "m-22", kode: "FRD-3", nama: "Faroidh", namaArab: "الفرائض", tingkat: 3, guruPengampu: "M. Abdul Fataah", kitab: "Ilmu Faroidh", tingkatKesulitan: "Sedang", malam: "Malam 9 Des (Selasa)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },
  { id: "m-23", kode: "THD-3", nama: "Tauhid", namaArab: "التوحيد", tingkat: 3, guruPengampu: "Ust. Ahmadi", kitab: "Jawahirul Kalamiyyah", tingkatKesulitan: "Ringan", malam: "Malam 6 Des (Sabtu)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },

  // Tingkat 4
  { id: "m-24", kode: "THD-4", nama: "Tauhid", namaArab: "التوحيد", tingkat: 4, guruPengampu: "Ust. Syarif Hidayatullah", kitab: "Hushunul Hamidiyyah", tingkatKesulitan: "Sedang", malam: "Malam 6 Des (Sabtu)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },
  { id: "m-25", kode: "USF-4", nama: "Ushul Fiqih", namaArab: "أصول الفقه", tingkat: 4, guruPengampu: "Ust. Nidhomul Muna Lana", kitab: "Al-Bayan fi Ushulil Fiqih", tingkatKesulitan: "Berat", malam: "Malam 9 Des (Selasa)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-26", kode: "NHW-4", nama: "Nahwu", namaArab: "النحو", tingkat: 4, guruPengampu: "Ust. Nidhomul Muna Lana", kitab: "Alfiyah Ibnu Malik", tingkatKesulitan: "Berat", malam: "Malam 8 Des (Senin)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-27", kode: "AKH-4", nama: "Akhlak", namaArab: "الأخلاق", tingkat: 4, guruPengampu: "Ust. Khoirul Umam", kitab: "Matan Bidayatul Hidayah", tingkatKesulitan: "Sedang", malam: "Malam 6 Des (Sabtu)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-28", kode: "TFS-4", nama: "Tafsir", namaArab: "التفسير", tingkat: 4, guruPengampu: "KH. Amin Maizun", kitab: "Tafsir Ayatil Ahkam", tingkatKesulitan: "Berat", malam: "Malam 8 Des (Senin)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },
  { id: "m-29", kode: "HDT-4", nama: "Hadits", namaArab: "الحديث", tingkat: 4, guruPengampu: "Ust. Muhammad Ali Ridho", kitab: "Bulughul Marom", tingkatKesulitan: "Sedang", malam: "Malam 7 Des (Ahad)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },
  { id: "m-30", kode: "FQH-4", nama: "Fiqih", namaArab: "الفقه", tingkat: 4, guruPengampu: "Ust. Abdur Rahman", kitab: "Fathul Qorib", tingkatKesulitan: "Berat", malam: "Malam 7 Des (Ahad)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-31", kode: "IHD-4", nama: "Ilmu Hadits", namaArab: "علم الحديث", tingkat: 4, guruPengampu: "Ust. Haris Maulana", kitab: "Minhatul Mughits", tingkatKesulitan: "Sedang", malam: "Malam 9 Des (Selasa)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },

  // Tingkat 5
  { id: "m-32", kode: "FQH-5", nama: "Fiqih", namaArab: "الفقه", tingkat: 5, guruPengampu: "Ust. Abdur Rahman", kitab: "Fathul Mu'in", tingkatKesulitan: "Berat", malam: "Malam 7 Des (Ahad)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-33", kode: "AKH-5", nama: "Akhlak", namaArab: "الأخلاق", tingkat: 5, guruPengampu: "Ust. Khoirul Umam", kitab: "Risalatul Muawanah", tingkatKesulitan: "Sedang", malam: "Malam 6 Des (Sabtu)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-34", kode: "NHW-5", nama: "Nahwu", namaArab: "النحو", tingkat: 5, guruPengampu: "Ust. Nidhomul Muna Lana", kitab: "Alfiyah Ibnu Malik", tingkatKesulitan: "Berat", malam: "Malam 8 Des (Senin)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-35", kode: "USF-5", nama: "Ushul Fiqih", namaArab: "أصول الفقه", tingkat: 5, guruPengampu: "Ust. Syarif Hidayatullah", kitab: "Al-Bayan fi Ushulil Fiqih", tingkatKesulitan: "Berat", malam: "Malam 9 Des (Selasa)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-36", kode: "QWF-5", nama: "Qowaidul Fiqhiyyah", namaArab: "القواعد الفقهية", tingkat: 5, guruPengampu: "Ust. Abdul Fattah", kitab: "Faraidul Bahiyyah", tingkatKesulitan: "Berat", malam: "Malam 8 Des (Senin)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },
  { id: "m-37", kode: "FRD-5", nama: "Faroidh", namaArab: "الفرائض", tingkat: 5, guruPengampu: "M. Abdul Fataah", kitab: "Ilmu Faroidh", tingkatKesulitan: "Sedang", malam: "Malam 9 Des (Selasa)", sesi: "Ujian 1", jamMulai: "16.00", jamSelesai: "17.00" },
  { id: "m-38", kode: "HDT-5", nama: "Hadits", namaArab: "الحديث", tingkat: 5, guruPengampu: "Ust. Izzul Huda", kitab: "Jawahirul Bukhori", tingkatKesulitan: "Sedang", malam: "Malam 7 Des (Ahad)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },
  { id: "m-39", kode: "TFS-5", nama: "Tafsir", namaArab: "التفسير", tingkat: 5, guruPengampu: "KH. Amin Maizun", kitab: "Tafsir Jalalain", tingkatKesulitan: "Berat", malam: "Malam 9 Des (Selasa)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },
  { id: "m-40", kode: "THD-5", nama: "Tauhid", namaArab: "التوحيد", tingkat: 5, guruPengampu: "Ust. Zainuddin", kitab: "Hushunul Hamidiyyah", tingkatKesulitan: "Ringan", malam: "Malam 6 Des (Sabtu)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },

  // Tingkat 6
  { id: "m-41", kode: "QWF-6", nama: "Qowaidul Fiqhiyah", namaArab: "القواعد الفقهية", tingkat: 6, guruPengampu: "Ust. Abdul Fattah", kitab: "Faraidul Bahiyyah", tingkatKesulitan: "Berat", malam: "Malam 8 Des (Senin)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },
  { id: "m-42", kode: "FQH-6", nama: "Fathul Mu'in (Fiqih)", namaArab: "فتح المعين (الفقه)", tingkat: 6, guruPengampu: "KH. Amin Maizun", kitab: "Fathul Mu'in", tingkatKesulitan: "Berat", malam: "Malam 7 Des (Ahad)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-43", kode: "NHW-6", nama: "Alfiyah Ibnu Malik (Nahwu)", namaArab: "ألفية ابن مالك (النحو)", tingkat: 6, guruPengampu: "Ust. Syarif Hidayatullah", kitab: "Alfiyah Ibnu Malik", tingkatKesulitan: "Berat", malam: "Malam 8 Des (Senin)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-44", kode: "TFS-6", nama: "Tafsir Jalalain", namaArab: "تفسير الجلالين", tingkat: 6, guruPengampu: "KH. Amin Maizun", kitab: "Tafsir Jalalain", tingkatKesulitan: "Berat", malam: "Malam 9 Des (Selasa)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },
  { id: "m-45", kode: "BLG-6", nama: "Qowaidul Lughotul Arabiyyah (Balaghoh)", namaArab: "قواعد اللغة العربية (البلاغة)", tingkat: 6, guruPengampu: "Ust. Nidhomul Muna Lana", kitab: "Qowaidul Lughotul Arabiyyah", tingkatKesulitan: "Berat", malam: "Malam 9 Des (Selasa)", sesi: "Ujian 1", jamMulai: "16.00", jamSelesai: "17.00" },
  { id: "m-46", kode: "ITF-6", nama: "Ilmu Tafsir", namaArab: "علم التفسير", tingkat: 6, guruPengampu: "Ust. Syarif Hidayatullah", kitab: "Ilmu Tafsir", tingkatKesulitan: "Sedang", malam: "Malam 6 Des (Sabtu)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
  { id: "m-47", kode: "HDT-6", nama: "Jawahirul Bukhori (Hadits)", namaArab: "جواهر البخاري (الحديث)", tingkat: 6, guruPengampu: "Ust. Izzul Huda", kitab: "Jawahirul Bukhori", tingkatKesulitan: "Sedang", malam: "Malam 7 Des (Ahad)", sesi: "Ujian 3", jamMulai: "20.00", jamSelesai: "21.00" },
  { id: "m-48", kode: "USF-6", nama: "Al-Bayan (Ushul Fiqih)", namaArab: "البيان (أصول الفقه)", tingkat: 6, guruPengampu: "Ust. Syarif Hidayatullah", kitab: "Al-Bayan fi Ushulil Fiqih", tingkatKesulitan: "Berat", malam: "Malam 9 Des (Selasa)", sesi: "Ujian 2", jamMulai: "18.30", jamSelesai: "19.30" },
];

/**
 * RAB Asli Kegiatan Imtihan 1 (Tahun Ajaran 2026/2027)
 * Dari lampiran dokumen fisik Panitia Imtihan
 */
export interface RabItem {
  id: string;
  keterangan: string;
  qty: number;
  satuan: string;
  harga: number;
  jumlah: number;
  realisasi?: number;
  kategori: 'Pemasukan' | 'Penggadaan' | 'Insentif' | 'Tunjangan' | 'Perlengkapan' | 'Konsumsi' | 'UsulanTambahan';
}

export const SEED_RAB_REALISASI_MAP: Record<string, number> = {
  'rab-in-1': 10350000,
  'rab-out-1': 825000,
  'rab-out-2': 930000,
  'rab-out-3': 1400000,
  'rab-out-4': 690000,
  'rab-out-5': 0,
  'rab-out-6': 120000,
  'rab-out-7': 250000,
  'rab-out-8': 150000,
  'rab-out-9': 150000,
  'rab-out-10': 150000,
  'rab-out-11': 300000,
  'rab-out-12': 100000,
  'rab-out-13': 100000,
  'rab-out-14': 100000,
  'rab-out-15': 150000,
  'rab-out-16': 36000,
  'rab-out-17': 76000,
  'rab-out-18': 35000,
  'rab-out-19': 35000,
  'rab-out-20': 35000,
  'rab-out-21': 0,
  'rab-out-22': 170000,
  'rab-out-23': 20000,
  'rab-out-24': 15000,
  'rab-out-25': 40000,
  'rab-out-26': 20000,
  'rab-out-27': 75000,
  'rab-out-28': 50000,
  'rab-out-29': 125000,
  'rab-out-30': 0,
  'rab-opt-1': 525000,
  'rab-opt-2': 0,
};

export const SEED_RAB_IMTIHAN: RabItem[] = [
  // Pemasukan
  { id: "rab-in-1", kategori: "Pemasukan", keterangan: "Iuran santri (pembayar)", qty: 360, satuan: "Santri", harga: 30000, jumlah: 10800000, realisasi: 10350000 },

  // 1. Penggadaan Soal
  { id: "rab-out-1", kategori: "Penggadaan", keterangan: "Semua kelas (soal tertulis)", qty: 2901, satuan: "Lembar", harga: 300, jumlah: 870300, realisasi: 825000 },

  // 2. Insentif
  { id: "rab-out-2", kategori: "Insentif", keterangan: "Penyusunan soal", qty: 93, satuan: "Paket", harga: 10000, jumlah: 930000, realisasi: 930000 },
  { id: "rab-out-3", kategori: "Insentif", keterangan: "Koreksi lembar jawaban", qty: 2807, satuan: "Lembar", harga: 1000, jumlah: 2807000, realisasi: 1400000 },
  { id: "rab-out-4", kategori: "Insentif", keterangan: "Pengawas ruang 4 malam", qty: 138, satuan: "Jam", harga: 10000, jumlah: 1380000, realisasi: 690000 },
  { id: "rab-out-5", kategori: "Insentif", keterangan: "Pengisian rapor santri", qty: 366, satuan: "Santri", harga: 1000, jumlah: 366000, realisasi: 0 },
  { id: "rab-out-6", kategori: "Insentif", keterangan: "Piket imtihan", qty: 12, satuan: "Orang", harga: 20000, jumlah: 240000, realisasi: 120000 },

  // 3. Tunjangan Pokok Panitia
  { id: "rab-out-7", kategori: "Tunjangan", keterangan: "Ketua Pelaksana", qty: 1, satuan: "Orang", harga: 250000, jumlah: 250000, realisasi: 250000 },
  { id: "rab-out-8", kategori: "Tunjangan", keterangan: "Wakil Ketua", qty: 1, satuan: "Orang", harga: 150000, jumlah: 150000, realisasi: 150000 },
  { id: "rab-out-9", kategori: "Tunjangan", keterangan: "Sekretaris (2 orang)", qty: 2, satuan: "Orang", harga: 150000, jumlah: 300000, realisasi: 150000 },
  { id: "rab-out-10", kategori: "Tunjangan", keterangan: "Bendahara (2 orang)", qty: 2, satuan: "Orang", harga: 150000, jumlah: 300000, realisasi: 150000 },
  { id: "rab-out-11", kategori: "Tunjangan", keterangan: "Pengeditan soal (2 orang)", qty: 2, satuan: "Orang", harga: 150000, jumlah: 300000, realisasi: 300000 },
  { id: "rab-out-12", kategori: "Tunjangan", keterangan: "Penggandaan soal", qty: 1, satuan: "Orang", harga: 100000, jumlah: 100000, realisasi: 100000 },
  { id: "rab-out-13", kategori: "Tunjangan", keterangan: "Perlengkapan", qty: 1, satuan: "Orang", harga: 100000, jumlah: 100000, realisasi: 100000 },
  { id: "rab-out-14", kategori: "Tunjangan", keterangan: "Konsumsi", qty: 1, satuan: "Orang", harga: 100000, jumlah: 100000, realisasi: 100000 },

  // 4. Perlengkapan
  { id: "rab-out-15", kategori: "Perlengkapan", keterangan: "HVS 70 F4 warna", qty: 2, satuan: "Rim", harga: 75000, jumlah: 150000, realisasi: 150000 },
  { id: "rab-out-16", kategori: "Perlengkapan", keterangan: "Lakban bening", qty: 3, satuan: "Pcs", harga: 12000, jumlah: 36000, realisasi: 36000 },
  { id: "rab-out-17", kategori: "Perlengkapan", keterangan: "Amplop soal", qty: 2, satuan: "Pack", harga: 38000, jumlah: 76000, realisasi: 76000 },
  { id: "rab-out-18", kategori: "Perlengkapan", keterangan: "Buffalo kuning", qty: 1, satuan: "Pack", harga: 35000, jumlah: 35000, realisasi: 35000 },
  { id: "rab-out-19", kategori: "Perlengkapan", keterangan: "Buffalo biru", qty: 1, satuan: "Pack", harga: 35000, jumlah: 35000, realisasi: 35000 },
  { id: "rab-out-20", kategori: "Perlengkapan", keterangan: "Buffalo hijau", qty: 1, satuan: "Pack", harga: 35000, jumlah: 35000, realisasi: 35000 },
  { id: "rab-out-21", kategori: "Perlengkapan", keterangan: "Amplop nilai", qty: 1, satuan: "Pack", harga: 38000, jumlah: 38000, realisasi: 0 },

  // 5. Konsumsi
  { id: "rab-out-22", kategori: "Konsumsi", keterangan: "Snack makanan ringan 4 hari", qty: 4, satuan: "Hari", harga: 85000, jumlah: 340000, realisasi: 170000 },
  { id: "rab-out-23", kategori: "Konsumsi", keterangan: "Kopi", qty: 1, satuan: "Pack", harga: 20000, jumlah: 20000, realisasi: 20000 },
  { id: "rab-out-24", kategori: "Konsumsi", keterangan: "Teh", qty: 1, satuan: "Pack", harga: 15000, jumlah: 15000, realisasi: 15000 },
  { id: "rab-out-25", kategori: "Konsumsi", keterangan: "Gula pasir", qty: 2, satuan: "Kg", harga: 20000, jumlah: 40000, realisasi: 40000 },
  { id: "rab-out-26", kategori: "Konsumsi", keterangan: "Es batu 4 hari", qty: 4, satuan: "Hari", harga: 10000, jumlah: 40000, realisasi: 20000 },
  { id: "rab-out-27", kategori: "Konsumsi", keterangan: "Lemburan panitia 3 hari", qty: 3, satuan: "Hari", harga: 75000, jumlah: 225000, realisasi: 75000 },
  { id: "rab-out-28", kategori: "Konsumsi", keterangan: "Konsumsi rapat panitia", qty: 1, satuan: "Hari", harga: 50000, jumlah: 50000, realisasi: 50000 },
  { id: "rab-out-29", kategori: "Konsumsi", keterangan: "Lain-lain / insidental", qty: 1, satuan: "Paket", harga: 300000, jumlah: 300000, realisasi: 125000 },
  { id: "rab-out-30", kategori: "Konsumsi", keterangan: "Konsumsi MHF (Musabaqoh Hifdzi Nadhom)", qty: 1, satuan: "Hari", harga: 50000, jumlah: 50000, realisasi: 0 },

  // Usulan Tambahan (Opsional)
  { id: "rab-opt-1", kategori: "UsulanTambahan", keterangan: "Buku harian guru (nilai harian)", qty: 35, satuan: "Buku", harga: 15000, jumlah: 525000, realisasi: 525000 },
  { id: "rab-opt-2", kategori: "UsulanTambahan", keterangan: "Buku absensi saku guru", qty: 35, satuan: "Buku", harga: 5000, jumlah: 175000, realisasi: 0 },
];

/**
 * Rekapitulasi Anggaran Bulanan Otomatis (Realisasi Kas Masuk & Keluar)
 * Mendukung transparansi keuangan sekolah secara real-time
 */
export interface RekapAnggaranBulan {
  bulan: string;
  tahun: number;
  anggaranRencana: number;
  realisasiMasuk: number;
  realisasiKeluar: number;
  saldo: number;
  persentaseRealisasi: number;
  kategoriList: {
    nama: string;
    rencana: number;
    realisasi: number;
    selisih: number;
    status: 'Sesuai' | 'Surplus' | 'Defisit';
  }[];
}

export const SEED_REKAP_ANGGARAN_BULANAN: RekapAnggaranBulan[] = [
  {
    bulan: "Juli",
    tahun: 2026,
    anggaranRencana: 245000000,
    realisasiMasuk: 252000000,
    realisasiKeluar: 231500000,
    saldo: 20500000,
    persentaseRealisasi: 94.5,
    kategoriList: [
      { nama: "Syahriyah & Operasional Pondok", rencana: 180000000, realisasi: 185000000, selisih: 5000000, status: "Surplus" },
      { nama: "Daftar Ulang & Pendaftaran Santri", rencana: 45000000, realisasi: 48000000, selisih: 3000000, status: "Surplus" },
      { nama: "Gaji & Tunjangan Asatidz/Karyawan", rencana: 110000000, realisasi: 108500000, selisih: -1500000, status: "Sesuai" },
      { nama: "Konsumsi Dapur Santri", rencana: 85000000, realisasi: 83200000, selisih: -1800000, status: "Sesuai" },
      { nama: "Listrik, Air & WiFi", rencana: 15000000, realisasi: 14800000, selisih: -200000, status: "Sesuai" },
    ],
  },
  {
    bulan: "Agustus",
    tahun: 2026,
    anggaranRencana: 235000000,
    realisasiMasuk: 238500000,
    realisasiKeluar: 224800000,
    saldo: 13700000,
    persentaseRealisasi: 95.6,
    kategoriList: [
      { nama: "Syahriyah Santri", rencana: 195000000, realisasi: 198000000, selisih: 3000000, status: "Surplus" },
      { nama: "Kegiatan PHBN 17 Agustus Santri", rencana: 12000000, realisasi: 11400000, selisih: -600000, status: "Sesuai" },
      { nama: "Gaji & Tunjangan Asatidz", rencana: 110000000, realisasi: 110000000, selisih: 0, status: "Sesuai" },
      { nama: "Dapur & Konsumsi Santri", rencana: 85000000, realisasi: 84300000, selisih: -700000, status: "Sesuai" },
      { nama: "Pemeliharaan & Kebersihan Gedung", rencana: 8000000, realisasi: 7200000, selisih: -800000, status: "Sesuai" },
    ],
  },
  {
    bulan: "September",
    tahun: 2026,
    anggaranRencana: 230000000,
    realisasiMasuk: 233000000,
    realisasiKeluar: 219600000,
    saldo: 13400000,
    persentaseRealisasi: 95.4,
    kategoriList: [
      { nama: "Syahriyah Santri", rencana: 195000000, realisasi: 194500000, selisih: -500000, status: "Sesuai" },
      { nama: "Peringatan Maulid Nabi (PHBI)", rencana: 25000000, realisasi: 24200000, selisih: -800000, status: "Sesuai" },
      { nama: "Gaji & Insentif Mengajar", rencana: 110000000, realisasi: 110000000, selisih: 0, status: "Sesuai" },
      { nama: "Dapur Santri", rencana: 85000000, realisasi: 84800000, selisih: -200000, status: "Sesuai" },
    ],
  },
  {
    bulan: "Oktober",
    tahun: 2026,
    anggaranRencana: 240000000,
    realisasiMasuk: 246500000,
    realisasiKeluar: 232000000,
    saldo: 14500000,
    persentaseRealisasi: 96.6,
    kategoriList: [
      { nama: "Syahriyah Santri", rencana: 195000000, realisasi: 197800000, selisih: 2800000, status: "Surplus" },
      { nama: "Hari Santri Nasional (HSN 22 Okt)", rencana: 28000000, realisasi: 27500000, selisih: -500000, status: "Sesuai" },
      { nama: "Gaji Asatidz & Karyawan", rencana: 110000000, realisasi: 110000000, selisih: 0, status: "Sesuai" },
      { nama: "Dapur Santri & Air Galon", rencana: 86000000, realisasi: 85100000, selisih: -900000, status: "Sesuai" },
    ],
  },
  {
    bulan: "November",
    tahun: 2026,
    anggaranRencana: 238000000,
    realisasiMasuk: 241200000,
    realisasiKeluar: 228100000,
    saldo: 13100000,
    persentaseRealisasi: 95.8,
    kategoriList: [
      { nama: "Syahriyah Santri", rencana: 195000000, realisasi: 196200000, selisih: 1200000, status: "Surplus" },
      { nama: "Persiapan Imtihan Semester Gasal", rencana: 10800000, realisasi: 9678300, selisih: -1121700, status: "Surplus" },
      { nama: "Gaji Asatidz & Karyawan", rencana: 110000000, realisasi: 110000000, selisih: 0, status: "Sesuai" },
      { nama: "Dapur Santri", rencana: 85000000, realisasi: 84600000, selisih: -400000, status: "Sesuai" },
    ],
  },
];

/**
 * Organisasi Kepanitiaan Pesantren (Struktur Jabatan Sesuai Lampiran B)
 */
export interface JabatanOrganisasi {
  id: string;
  kode: string;
  nama: string;
  tingkat: number; // 1: Pengasuh/Ketua, 2: Wakil/Koordinator, 3: Divisi, 4: Staf
  parentId?: string;
  pemangku: string;
  divisi: string;
  status: 'Aktif' | 'Kosong';
}

export const SEED_BAGAN_ORGANISASI: JabatanOrganisasi[] = [
  { id: "org-1", kode: "P-01", nama: "Pengasuh Pondok", tingkat: 1, pemangku: "KH. Amin Maizun", divisi: "Pimpinan Tertinggi", status: "Aktif" },
  { id: "org-2", kode: "M-01", nama: "Kepala Madrasah Diniyah", tingkat: 2, parentId: "org-1", pemangku: "Ust. Syarif Hidayatullah", divisi: "Pendidikan & Pengajaran", status: "Aktif" },
  { id: "org-3", kode: "L-01", nama: "Lurah Pondok Putra", tingkat: 2, parentId: "org-1", pemangku: "Ust. Khoirul Umam", divisi: "Kema'hadiyahan Putra", status: "Aktif" },
  { id: "org-4", kode: "L-02", nama: "Lurah Pondok Putri", tingkat: 2, parentId: "org-1", pemangku: "Usth. Siti Maryam", divisi: "Kema'hadiyahan Putri", status: "Aktif" },
  { id: "org-5", kode: "B-01", nama: "Bendahara Umum", tingkat: 2, parentId: "org-1", pemangku: "M. Abdul Fataah", divisi: "Keuangan", status: "Aktif" },
  { id: "org-6", kode: "S-01", nama: "Sekretaris Umum", tingkat: 2, parentId: "org-1", pemangku: "Ust. Ahmad Mujiburrohman", divisi: "Sekretariat", status: "Aktif" },
  // Divisi Diniyah
  { id: "org-7", kode: "K-IMT", nama: "Ketua Panitia Imtihan", tingkat: 3, parentId: "org-2", pemangku: "Ust. Nidhomul Muna Lana", divisi: "Panitia Imtihan", status: "Aktif" },
  { id: "org-8", kode: "W-IMT", nama: "Wakil Ketua Imtihan", tingkat: 3, parentId: "org-7", pemangku: "Ust. Abdur Rahman", divisi: "Panitia Imtihan", status: "Aktif" },
  { id: "org-9", kode: "S-IMT", nama: "Sekretaris Imtihan", tingkat: 4, parentId: "org-7", pemangku: "Ust. Fathoni", divisi: "Panitia Imtihan", status: "Aktif" },
  { id: "org-10", kode: "B-IMT", nama: "Bendahara Imtihan", tingkat: 4, parentId: "org-7", pemangku: "Ust. M. Abdul Fataah", divisi: "Panitia Imtihan", status: "Aktif" },
  // Divisi Keamanan & BK
  { id: "org-11", kode: "K-KAM", nama: "Koordinator Keamanan & BK", tingkat: 3, parentId: "org-3", pemangku: "Ust. Bahrul Ulum", divisi: "Ketertiban & BK", status: "Aktif" },
  { id: "org-12", kode: "U-KAS", nama: "Manajer Unit Kantin & Laundry", tingkat: 3, parentId: "org-5", pemangku: "Mbak Siti Rohmah", divisi: "Unit Usaha", status: "Aktif" },
];

/**
 * Daftar Izin Fitur (Sesuai Lampiran A Hak Akses Role ERP Sumi)
 */
export interface ActionPermission {
  key: string;
  label: string;
  color: 'baca' | 'tulis' | 'wewenang' | 'posting' | 'batal' | 'lainnya';
}

export const ACTION_COLOR_CLASSES = {
  baca: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  tulis: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  wewenang: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  posting: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
  batal: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
  lainnya: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
};

export interface FiturWewenang {
  id: string;
  modul: string;
  nama: string;
  deskripsi: string;
  isSensitif?: boolean;
  actions: {
    baca?: boolean;
    tulis?: boolean;
    ubah?: boolean;
    hapus?: boolean;
    setujui?: boolean;
    posting?: boolean;
    cetak?: boolean;
    ekspor?: boolean;
    konfigurasi?: boolean;
  };
}

export const FITUR_WEWENANG_LIST: FiturWewenang[] = [
  {
    id: "imtihan_soal",
    modul: "Imtihan",
    nama: "Naskah & Blanko Soal Imtihan",
    deskripsi: "Penyusunan naskah soal pegon/Arab, approval panitia, cetak kop resmi",
    isSensitif: true,
    actions: { baca: true, tulis: true, ubah: true, hapus: true, setujui: true, cetak: true },
  },
  {
    id: "imtihan_denah",
    modul: "Imtihan",
    nama: "Denah & Tempat Duduk Acak",
    deskripsi: "Algoritma penataan kursi ujian, acak ulang seed, pencegahan contek sekelas",
    actions: { baca: true, tulis: true, ubah: true, cetak: true, konfigurasi: true },
  },
  {
    id: "imtihan_kartu",
    modul: "Imtihan",
    nama: "Kartu Peserta Imtihan",
    deskripsi: "Penerbitan kartu imtihan 2MD#079 depan & jadwal paraf pengawas belakang",
    actions: { baca: true, cetak: true, ekspor: true },
  },
  {
    id: "imtihan_nilai_raport",
    modul: "Imtihan",
    nama: "Input Nilai & Cetak Raport",
    deskripsi: "Input nilai mapel, ubudiyah, hafalan nadhom, cetak raport A4/F4 resmi",
    isSensitif: true,
    actions: { baca: true, tulis: true, ubah: true, setujui: true, cetak: true },
  },
  {
    id: "imtihan_rab",
    modul: "Imtihan",
    nama: "Rancangan Anggaran Biaya (RAB) Imtihan",
    deskripsi: "Pemasukan iuran santri 360 x 30rb, insentif, tunjangan, dan saldo",
    isSensitif: true,
    actions: { baca: true, tulis: true, ubah: true, setujui: true, cetak: true, posting: true },
  },
  {
    id: "maarifan_absensi",
    modul: "Ma'arifan",
    nama: "Absensi Hadir Guru & Santri Diniyah",
    deskripsi: "Pencatatan kehadiran harian tap cepat, riwayat, dan evaluasi bulanan",
    actions: { baca: true, tulis: true, ubah: true, setujui: true, cetak: true },
  },
  {
    id: "sekretaris_persuratan",
    modul: "Sekretaris",
    nama: "Surat Masuk, Keluar & Arsip Digital",
    deskripsi: "Penomoran surat otomatis, template resmi kop santri, tanda tangan",
    actions: { baca: true, tulis: true, ubah: true, hapus: true, cetak: true },
  },
  {
    id: "bendahara_keuangan",
    modul: "Bendahara",
    nama: "Arus Kas, Gaji & Transparansi Anggaran",
    deskripsi: "Pencatatan kas masuk/keluar, penggajian asatidz, rekap bulanan real-time",
    isSensitif: true,
    actions: { baca: true, tulis: true, ubah: true, setujui: true, posting: true, cetak: true, ekspor: true },
  },
  {
    id: "transaksi_kartu_pos",
    modul: "Transaksi",
    nama: "Kartu Digital Santri, Limit & POS Kantin",
    deskripsi: "Simulasi tap jajan RFID, laundry, top up, batas belanja harian oleh wali",
    actions: { baca: true, tulis: true, ubah: true, posting: true, cetak: true },
  },
  {
    id: "psb_verifikasi",
    modul: "PSB",
    nama: "Verifikasi Pendaftar & Jadikan Santri",
    deskripsi: "Formulir calon santri, approval berkas, penerbitan NIS otomatis",
    actions: { baca: true, tulis: true, setujui: true, konfigurasi: true },
  },
  {
    id: "bk_pelanggaran",
    modul: "BK",
    nama: "Catatan Pelanggaran & Buku Tamu",
    deskripsi: "Poin pelanggaran, penegakan takzir syar'i, izin keluar malam",
    actions: { baca: true, tulis: true, ubah: true, setujui: true },
  },
  {
    id: "sdm_absensi_monitoring",
    modul: "SDM & Absensi",
    nama: "Dashboard Monitoring Guru, SDM & Persetujuan Izin",
    deskripsi: "Monitoring real-time kehadiran dewan asatidz, verifikasi foto selfie GPS, persetujuan badal, & cetak rekap SDM",
    isSensitif: true,
    actions: { baca: true, tulis: true, ubah: true, setujui: true, cetak: true, ekspor: true },
  },
];

/**
 * Format nama pengajar dengan gelar resmi Ustadz / Ustadzah di depan
 */
export function formatNamaWithGelar(nama: string, gender?: 'L' | 'P'): string {
  const trimmed = (nama || '').trim();
  if (!trimmed) return gender === 'P' ? 'Ustadzah' : 'Ustadz';
  if (/^(KH\.|K\.H\.|Nyai\s+Hj\.|Nyai\.?\s)/i.test(trimmed)) {
    return trimmed;
  }
  const withoutPrefix = trimmed
    .replace(/^(Ustadzah|Ustzh\.|Usth\.|Ustadz|Ustd\.|Ust\.|M\.)\s+/i, '')
    .trim();
  const isFemale =
    gender === 'P' ||
    /^(Ustzh\.|Usth\.|Ustadzah)/i.test(trimmed) ||
    /(Siti|Aisyah|Fatimah|Khadijah|Dewi|Nurul|Zulfa|Salma|Durrotun|Nabila|Uswatun|Afifah|Rohmah|Laila|Roudhotul|Masruroh|Khoirunnisa|Mufidah|Alfi|Hilya|Mbak)/i.test(
      trimmed
    );
  return `${isFemale ? 'Ustadzah' : 'Ustadz'} ${withoutPrefix || trimmed}`;
}

/**
 * Master Data Dewan Asatidz / Ustadzah (EMIS-compatible)
 */
export interface UstadzRecord {
  id: string;
  nip: string;
  nik: string;
  nama: string;
  namaArab: string;
  gender: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  statusAktif: 'Aktif' | 'Nonaktif';
  jabatanUtama: string;
  tugasTambahanSatminkal?: string;
  tugasTambahanNonSatminkal?: string;
  statusKepegawaian: 'Tetap Yayasan' | 'Khidmah' | 'Honorer';
  tmtMulai: string;
  pendidikanFormal: string;
  pendidikanPesantren: string;
  fanIlmu: string[];
  noHP: string;
  alamat: string;
  honorPokok: number;
}

export const SEED_USTADZ_LIST: UstadzRecord[] = [
  {
    id: 'ust-1',
    nip: '2010.01.001',
    nik: '3326011205800001',
    nama: 'KH. Amin Maizun',
    namaArab: 'الشيخ أمين مأزون الحاج',
    gender: 'L',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1972-05-12',
    statusAktif: 'Aktif',
    jabatanUtama: 'Pengasuh Pondok Pesantren',
    tugasTambahanSatminkal: 'Penasihat Madrasah Diniyah',
    tugasTambahanNonSatminkal: 'Rois Syuriah MWC NU Karangdadap',
    statusKepegawaian: 'Tetap Yayasan',
    tmtMulai: '2008-07-01',
    pendidikanFormal: 'S1 Syariah / Ma\'had Aly',
    pendidikanPesantren: 'PP. Lirboyo Kediri & Sarang',
    fanIlmu: ['Tafsir', 'Fathul Mu\'in', 'Tasawuf'],
    noHP: '0811-2800-0001',
    alamat: 'Karangdadap, Kab. Pekalongan',
    honorPokok: 3500000,
  },
  {
    id: 'ust-2',
    nip: '2014.03.004',
    nik: '3326011808860002',
    nama: 'Ust. Syarif Hidayatullah',
    namaArab: 'الأستاذ شريف هداية الله',
    gender: 'L',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1986-08-18',
    statusAktif: 'Aktif',
    jabatanUtama: 'Kepala Madrasah Diniyah',
    tugasTambahanSatminkal: 'Wali Kelas 6 A PUTRA & PUTRI',
    statusKepegawaian: 'Tetap Yayasan',
    tmtMulai: '2014-07-10',
    pendidikanFormal: 'S1 Pendidikan Agama Islam',
    pendidikanPesantren: 'PP. Al-Anwar Sarang Rembang',
    fanIlmu: ['Tauhid', 'Alfiyah Ibnu Malik', 'Ushul Fiqih'],
    noHP: '0812-2600-1122',
    alamat: 'Kedungwuni, Kab. Pekalongan',
    honorPokok: 2500000,
  },
  {
    id: 'ust-3',
    nip: '2016.06.008',
    nik: '3326012004900003',
    nama: 'Ust. Abdur Rahman',
    namaArab: 'عبد الرحمن',
    gender: 'L',
    tempatLahir: 'Batang',
    tanggalLahir: '1990-04-20',
    statusAktif: 'Aktif',
    jabatanUtama: 'Guru Mapel Fiqih & Wali Kelas 2 A PUTRA',
    tugasTambahanSatminkal: 'Wakil Ketua Panitia Imtihan',
    statusKepegawaian: 'Tetap Yayasan',
    tmtMulai: '2016-07-01',
    pendidikanFormal: 'S1 Hukum Ekonomi Syariah',
    pendidikanPesantren: 'PP. API Tegalrejo Magelang',
    fanIlmu: ['Fiqih', 'Qowaidul Fiqhiyyah'],
    noHP: '0856-4100-3344',
    alamat: 'Wonotunggal, Kab. Batang',
    honorPokok: 2200000,
  },
  {
    id: 'ust-4',
    nip: '2018.04.012',
    nik: '3326011509920004',
    nama: 'Ust. Nidhomul Muna Lana',
    namaArab: 'نظم المنى لنا',
    gender: 'L',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1992-09-15',
    statusAktif: 'Aktif',
    jabatanUtama: 'Ketua Panitia Imtihan & Guru Nahwu',
    tugasTambahanSatminkal: 'Koordinator Kurikulum Kitab',
    statusKepegawaian: 'Tetap Yayasan',
    tmtMulai: '2018-07-01',
    pendidikanFormal: 'S1 Bahasa Arab',
    pendidikanPesantren: 'PP. Lirboyo Kediri',
    fanIlmu: ['Nahwu', 'Al-Imrithi', 'Balaghoh'],
    noHP: '0857-2700-5566',
    alamat: 'Karangdadap, Kab. Pekalongan',
    honorPokok: 2200000,
  },
  {
    id: 'ust-5',
    nip: '2019.07.015',
    nik: '3326010303940005',
    nama: 'Ust. Ahmad Mujiburrohman',
    namaArab: 'أحمد مجيب الرحمن',
    gender: 'L',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1994-03-03',
    statusAktif: 'Aktif',
    jabatanUtama: 'Sekretaris Umum & Guru Shorof',
    tugasTambahanSatminkal: 'Operator EMIS Pesantren',
    statusKepegawaian: 'Tetap Yayasan',
    tmtMulai: '2019-07-01',
    pendidikanFormal: 'S1 Manajemen Pendidikan Islam',
    pendidikanPesantren: 'PP. Futuhiyyah Mranggen',
    fanIlmu: ['Shorof', 'Tahaji Pegon'],
    noHP: '0813-2500-7788',
    alamat: 'Buaran, Kab. Pekalongan',
    honorPokok: 2000000,
  },
  {
    id: 'ust-6',
    nip: '2020.01.019',
    nik: '3326012511930006',
    nama: 'Ust. Khoirul Umam',
    namaArab: 'خير الأمم',
    gender: 'L',
    tempatLahir: 'Pemalang',
    tanggalLahir: '1993-11-25',
    statusAktif: 'Aktif',
    jabatanUtama: 'Lurah Pondok Putra & Guru Akhlak',
    tugasTambahanSatminkal: 'Pembina Ekstrakurikuler Hadroh',
    statusKepegawaian: 'Khidmah',
    tmtMulai: '2020-01-10',
    pendidikanFormal: "SMA / Ma'had Aly",
    pendidikanPesantren: 'PP. NU Darussalam Karangdadap',
    fanIlmu: ['Akhlak', 'Tarikh', 'Hadits'],
    noHP: '0858-6600-8899',
    alamat: 'Comal, Kab. Pemalang',
    honorPokok: 2000000,
  },
  {
    id: 'ust-7',
    nip: '2020.08.045',
    nik: '3326010907950007',
    nama: 'M. Abdul Fataah',
    namaArab: 'محمد عبد الفتاح',
    gender: 'L',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1995-07-09',
    statusAktif: 'Aktif',
    jabatanUtama: 'Bendahara Umum & Bendahara Imtihan',
    tugasTambahanSatminkal: 'Pengawas Unit Usaha Kantin',
    statusKepegawaian: 'Tetap Yayasan',
    tmtMulai: '2020-08-01',
    pendidikanFormal: 'S1 Akuntansi Syariah',
    pendidikanPesantren: 'PP. NU Darussalam Karangdadap',
    fanIlmu: ['Faroidh', 'Tarikh'],
    noHP: '0819-0300-4455',
    alamat: 'Karangdadap, Kab. Pekalongan',
    honorPokok: 2100000,
  },
  {
    id: 'ust-8',
    nip: '2021.05.022',
    nik: '3326015206960008',
    nama: 'Usth. Siti Maryam',
    namaArab: 'الأستاذة ستي مريم',
    gender: 'P',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1996-06-12',
    statusAktif: 'Aktif',
    jabatanUtama: 'Lurah Pondok Putri & Wali Kelas 2 A PUTRI',
    tugasTambahanSatminkal: "Guru Al-Qur'an & Tajwid Putri",
    statusKepegawaian: 'Tetap Yayasan',
    tmtMulai: '2021-05-01',
    pendidikanFormal: "S1 Ilmu Al-Qur'an & Tafsir",
    pendidikanPesantren: "PP. Yanbu'ul Qur'an Kudus",
    fanIlmu: ["Al-Qur'an", 'Tajwid', 'Fiqih Nisa'],
    noHP: '0852-9100-2233',
    alamat: 'Wiradesa, Kab. Pekalongan',
    honorPokok: 2000000,
  },
  {
    id: 'ust-9',
    nip: '2021.08.025',
    nik: '3326011204910009',
    nama: 'Ust. Abdul Fattah',
    namaArab: 'عبد الفتاح',
    gender: 'L',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1991-04-12',
    statusAktif: 'Aktif',
    jabatanUtama: 'Guru Mapel Qowaidul Fiqhiyyah & Ushul',
    tugasTambahanSatminkal: 'Wali Kelas 5 A PUTRA & PUTRI',
    statusKepegawaian: 'Tetap Yayasan',
    tmtMulai: '2021-08-01',
    pendidikanFormal: 'S1 Ahwal Syakhshiyyah',
    pendidikanPesantren: 'PP. Ploso Mojo Kediri',
    fanIlmu: ['Qowaidul Fiqhiyyah', 'Ushul Fiqih'],
    noHP: '0813-9012-3456',
    alamat: 'Karangdadap, Kab. Pekalongan',
    honorPokok: 2000000,
  },
  {
    id: 'ust-10',
    nip: '2022.02.028',
    nik: '3326012307950010',
    nama: 'Ust. Muhammad Ali Ridho',
    namaArab: 'محمد علي رضا',
    gender: 'L',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1995-07-23',
    statusAktif: 'Aktif',
    jabatanUtama: 'Guru Mapel Hadits & Shorof',
    tugasTambahanSatminkal: 'Pembina Musyawarah Kitab',
    statusKepegawaian: 'Khidmah',
    tmtMulai: '2022-02-01',
    pendidikanFormal: 'S1 Ilmu Hadits',
    pendidikanPesantren: 'PP. Sidogiri Pasuruan',
    fanIlmu: ['Hadits', 'Ilmu Hadits', 'Shorof'],
    noHP: '0857-4455-8899',
    alamat: 'Wonopringgo, Kab. Pekalongan',
    honorPokok: 1900000,
  },
  {
    id: 'ust-11',
    nip: '2022.07.031',
    nik: '3326011002930011',
    nama: 'Ust. Ahmadi',
    namaArab: 'أحمدي',
    gender: 'L',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1993-02-10',
    statusAktif: 'Aktif',
    jabatanUtama: 'Guru Mapel Tauhid & Akhlak',
    tugasTambahanSatminkal: 'Wali Kelas 1 B PUTRA',
    statusKepegawaian: 'Tetap Yayasan',
    tmtMulai: '2022-07-01',
    pendidikanFormal: 'S1 PAI',
    pendidikanPesantren: 'PP. Al-Mubarok Mranggen',
    fanIlmu: ['Tauhid', 'Akhlak', 'Tajwid'],
    noHP: '0852-2233-4455',
    alamat: 'Karangdadap, Kab. Pekalongan',
    honorPokok: 1850000,
  },
  {
    id: 'ust-12',
    nip: '2023.01.033',
    nik: '3326011408960012',
    nama: "Ust. Ahmad Rifa'i",
    namaArab: 'أحمد رفاعي',
    gender: 'L',
    tempatLahir: 'Batang',
    tanggalLahir: '1996-08-14',
    statusAktif: 'Aktif',
    jabatanUtama: 'Guru Mapel Tarikh, Fiqih & Faroidh 3',
    tugasTambahanSatminkal: 'Wali Kelas 2 B PUTRA',
    statusKepegawaian: 'Khidmah',
    tmtMulai: '2023-01-10',
    pendidikanFormal: 'S1 Sejarah Peradaban Islam',
    pendidikanPesantren: 'PP. NU Darussalam Karangdadap',
    fanIlmu: ['Tarikh', 'Fiqih', 'Tahaji', 'Faroidh 3'],
    noHP: '0856-7788-1122',
    alamat: 'Bandar, Kab. Batang',
    honorPokok: 1800000,
  },
  {
    id: 'ust-13',
    nip: '2023.07.035',
    nik: '3326011905970013',
    nama: 'Ust. Haris Maulana',
    namaArab: 'حارث مولانا',
    gender: 'L',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1997-05-19',
    statusAktif: 'Aktif',
    jabatanUtama: 'Guru Mapel Ilmu Hadits & Nahwu',
    tugasTambahanSatminkal: 'Wali Kelas 3 B PUTRA',
    statusKepegawaian: 'Khidmah',
    tmtMulai: '2023-07-01',
    pendidikanFormal: 'S1 PBA',
    pendidikanPesantren: 'PP. Lirboyo Kediri',
    fanIlmu: ['Ilmu Hadits', 'Nahwu', 'Shorof'],
    noHP: '0877-3344-9900',
    alamat: 'Kedungwuni, Kab. Pekalongan',
    honorPokok: 1800000,
  },
  {
    id: 'ust-14',
    nip: '2024.01.038',
    nik: '3326010811950014',
    nama: 'Ust. Izzul Huda',
    namaArab: 'عز الهدى',
    gender: 'L',
    tempatLahir: 'Pemalang',
    tanggalLahir: '1995-11-08',
    statusAktif: 'Aktif',
    jabatanUtama: 'Guru Mapel Hadits & Jawahirul Bukhori',
    tugasTambahanSatminkal: 'Wali Kelas 4 A PUTRA',
    statusKepegawaian: 'Tetap Yayasan',
    tmtMulai: '2024-01-05',
    pendidikanFormal: 'S1 Tafsir Hadits',
    pendidikanPesantren: 'PP. Sarang Rembang',
    fanIlmu: ['Hadits', 'Tafsir', 'Ulumul Quran'],
    noHP: '0812-5566-7788',
    alamat: 'Petarukan, Kab. Pemalang',
    honorPokok: 1950000,
  },
  {
    id: 'ust-15',
    nip: '2024.07.040',
    nik: '3326012203940015',
    nama: 'Ust. Zainuddin',
    namaArab: 'زين الدين',
    gender: 'L',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1994-03-22',
    statusAktif: 'Aktif',
    jabatanUtama: 'Guru Mapel Tauhid & Fiqih',
    tugasTambahanSatminkal: 'Wali Kelas 3 A PUTRA',
    statusKepegawaian: 'Tetap Yayasan',
    tmtMulai: '2024-07-01',
    pendidikanFormal: 'S1 Aqidah Filsafat',
    pendidikanPesantren: 'PP. API Tegalrejo',
    fanIlmu: ['Tauhid', 'Fiqih', 'Akhlak'],
    noHP: '0858-9900-4433',
    alamat: 'Doro, Kab. Pekalongan',
    honorPokok: 1900000,
  },
  // === 17 PENGAJAR PUTRI RESMI (JTM 2026/2027) ===
  {
    id: 'ust-16',
    nip: '2012.07.041',
    nik: '3326015403820016',
    nama: 'Nyai Hj. Yuli Fitriana',
    namaArab: 'نياي الحاجة يولي فطريانة',
    gender: 'P',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1982-03-14',
    statusAktif: 'Aktif',
    jabatanUtama: 'Pengajar Putri (Ilmu Hadis 4, Fiqih 4)',
    tugasTambahanSatminkal: 'Pembina Majelis Putri',
    statusKepegawaian: 'Tetap Yayasan',
    tmtMulai: '2012-07-01',
    pendidikanFormal: "Ma'had Aly",
    pendidikanPesantren: 'PP. NU Darussalam Karangdadap',
    fanIlmu: ['Ilmu Hadis 4', 'Fiqih 4'],
    noHP: '0812-2800-0016',
    alamat: 'Karangdadap, Kab. Pekalongan',
    honorPokok: 2500000,
  },
  {
    id: 'ust-17',
    nip: '2022.07.042',
    nik: '3326015505970017',
    nama: 'Usth. Daffa Aulia Solestya',
    namaArab: 'الأستاذة دفع أوليا سولستيا',
    gender: 'P',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1997-05-15',
    statusAktif: 'Aktif',
    jabatanUtama: 'Wali Kelas 1 B PUTRI & Guru Fiqh',
    tugasTambahanSatminkal: 'Wali Kelas 1 B PUTRI',
    statusKepegawaian: 'Tetap Yayasan',
    tmtMulai: '2022-07-01',
    pendidikanFormal: 'S1 Pendidikan Islam',
    pendidikanPesantren: 'PP. NU Darussalam Karangdadap',
    fanIlmu: ['Fiqh 1AB', 'Tafsir Ahkam 4'],
    noHP: '0857-2800-0017',
    alamat: 'Karangdadap, Kab. Pekalongan',
    honorPokok: 1850000,
  },
  {
    id: 'ust-18',
    nip: '2018.07.043',
    nik: '3326015608850018',
    nama: 'Usth. Hj. Nok Arofah',
    namaArab: 'الأستاذة الحاجة نوق عرفة',
    gender: 'P',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1985-08-16',
    statusAktif: 'Aktif',
    jabatanUtama: "Pengajar Putri (Ilmu Qur'an 3, Hadis Ahkam 3 & 4)",
    statusKepegawaian: 'Tetap Yayasan',
    tmtMulai: '2018-07-01',
    pendidikanFormal: "S1 Ilmu Al-Qur'an",
    pendidikanPesantren: "PP. Yanbu'ul Qur'an Kudus",
    fanIlmu: ["Ilmu Qur'an 3", 'Hadis Ahkam 3', 'Hadis Ahkam 4'],
    noHP: '0857-2800-0018',
    alamat: 'Kedungwuni, Kab. Pekalongan',
    honorPokok: 1950000,
  },
  {
    id: 'ust-19',
    nip: '2011.07.044',
    nik: '3326015709790019',
    nama: 'Nyai Hj. Sri Khannah',
    namaArab: 'نياي الحاجة سري خنة',
    gender: 'P',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1979-09-17',
    statusAktif: 'Aktif',
    jabatanUtama: "Pengajar Putri (Al-Qur'an Tajwid 1)",
    tugasTambahanSatminkal: 'Sesepuh Majelis Tahfidz Putri',
    statusKepegawaian: 'Tetap Yayasan',
    tmtMulai: '2011-07-01',
    pendidikanFormal: 'Pendidikan Diniyah Muadalah',
    pendidikanPesantren: "PP. Al-Munawwir Krapyak",
    fanIlmu: ["Alqur'an Tajwid 1"],
    noHP: '0813-2800-0019',
    alamat: 'Karangdadap, Kab. Pekalongan',
    honorPokok: 2400000,
  },
  {
    id: 'ust-20',
    nip: '2021.07.045',
    nik: '3326015804960020',
    nama: 'Usth. Nella Aprilia',
    namaArab: 'الأستاذة نيلا أفريليا',
    gender: 'P',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1996-04-18',
    statusAktif: 'Aktif',
    jabatanUtama: 'Wali Kelas 2 A PUTRI & Guru Fiqih',
    tugasTambahanSatminkal: 'Wali Kelas 2 A PUTRI',
    statusKepegawaian: 'Tetap Yayasan',
    tmtMulai: '2021-07-01',
    pendidikanFormal: 'S1 PAI',
    pendidikanPesantren: 'PP. NU Darussalam Karangdadap',
    fanIlmu: ['Fiqih 2 AB', 'Fiqih 3'],
    noHP: '0857-2800-0020',
    alamat: 'Buaran, Kab. Pekalongan',
    honorPokok: 1950000,
  },
  {
    id: 'ust-21',
    nip: '2020.07.046',
    nik: '3326015911930021',
    nama: 'Usth. Titik Diana Sari',
    namaArab: 'الأستاذة تيتيك ديانا ساري',
    gender: 'P',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1993-11-19',
    statusAktif: 'Aktif',
    jabatanUtama: 'Pengajar Putri (Nahwu 4, Ushul Fiqh 4)',
    statusKepegawaian: 'Tetap Yayasan',
    tmtMulai: '2020-07-01',
    pendidikanFormal: 'S1 Hukum Keluarga Islam',
    pendidikanPesantren: 'PP. Lirboyo Putri',
    fanIlmu: ['Nahwu 4', 'Ushul Fiqh 4'],
    noHP: '0857-2800-0021',
    alamat: 'Wonopringgo, Kab. Pekalongan',
    honorPokok: 1900000,
  },
  {
    id: 'ust-22',
    nip: '2021.08.047',
    nik: '3326016002950022',
    nama: 'Usth. Nurlailatul Fitriani',
    namaArab: 'الأستاذة نور ليلة الفطرياني',
    gender: 'P',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1995-02-20',
    statusAktif: 'Aktif',
    jabatanUtama: 'Wali Kelas 3 PUTRI & Guru Nahwu',
    tugasTambahanSatminkal: 'Wali Kelas 3 A PUTRI',
    statusKepegawaian: 'Tetap Yayasan',
    tmtMulai: '2021-08-01',
    pendidikanFormal: 'S1 Pendidikan Bahasa Arab',
    pendidikanPesantren: 'PP. Al-Falah Ploso Putri',
    fanIlmu: ['Nahwu 3', 'Nahwu 1'],
    noHP: '0857-2800-0022',
    alamat: 'Karangdadap, Kab. Pekalongan',
    honorPokok: 1900000,
  },
  {
    id: 'ust-23',
    nip: '2020.08.048',
    nik: '3326016107940023',
    nama: 'Usth. Nurul Hikmah',
    namaArab: 'الأستاذة نور الحكمة',
    gender: 'P',
    tempatLahir: 'Batang',
    tanggalLahir: '1994-07-21',
    statusAktif: 'Aktif',
    jabatanUtama: 'Wali Kelas 4 PUTRI & Guru Hadis/Akhlak',
    tugasTambahanSatminkal: 'Wali Kelas 4 A PUTRI',
    statusKepegawaian: 'Tetap Yayasan',
    tmtMulai: '2020-08-01',
    pendidikanFormal: 'S1 Ilmu Hadis',
    pendidikanPesantren: 'PP. Futuhiyyah Putri',
    fanIlmu: ['Hadis 2', 'Akhlak 4'],
    noHP: '0857-2800-0023',
    alamat: 'Batang, Kab. Batang',
    honorPokok: 1900000,
  },
  {
    id: 'ust-24',
    nip: '2022.01.049',
    nik: '3326016206960024',
    nama: 'Usth. Rohmatul Ummah',
    namaArab: 'الأستاذة رحمة الأمة',
    gender: 'P',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1996-06-22',
    statusAktif: 'Aktif',
    jabatanUtama: 'Pengajar Putri (Tarekh 2, Tauhid 3)',
    statusKepegawaian: 'Khidmah',
    tmtMulai: '2022-01-05',
    pendidikanFormal: 'S1 PAI',
    pendidikanPesantren: 'PP. NU Darussalam Karangdadap',
    fanIlmu: ['Tarekh 2', 'Tauhid 3'],
    noHP: '0857-2800-0024',
    alamat: 'Karangdadap, Kab. Pekalongan',
    honorPokok: 1800000,
  },
  {
    id: 'ust-25',
    nip: '2022.07.050',
    nik: '3326016301980025',
    nama: 'Usth. Arinil Haq',
    namaArab: 'الأستاذة أريني الحق',
    gender: 'P',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1998-01-23',
    statusAktif: 'Aktif',
    jabatanUtama: 'Pengajar Putri (Nahwu 2 AB)',
    statusKepegawaian: 'Khidmah',
    tmtMulai: '2022-07-01',
    pendidikanFormal: 'S1 PBA',
    pendidikanPesantren: 'PP. Sarang Rembang Putri',
    fanIlmu: ['Nahwu 2 AB'],
    noHP: '0857-2800-0025',
    alamat: 'Wiradesa, Kab. Pekalongan',
    honorPokok: 1800000,
  },
  {
    id: 'ust-26',
    nip: '2022.08.051',
    nik: '3326016410970026',
    nama: 'Usth. Fachirotu Mina',
    namaArab: 'الأستاذة فاخرة منا',
    gender: 'P',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1997-10-24',
    statusAktif: 'Aktif',
    jabatanUtama: 'Pengajar Putri (Shorof 2, Shorof 3)',
    statusKepegawaian: 'Khidmah',
    tmtMulai: '2022-08-01',
    pendidikanFormal: 'S1 PAI',
    pendidikanPesantren: 'PP. Lirboyo Putri',
    fanIlmu: ['Shorof 2', 'Shorof 3'],
    noHP: '0857-2800-0026',
    alamat: 'Kedungwuni, Kab. Pekalongan',
    honorPokok: 1800000,
  },
  {
    id: 'ust-27',
    nip: '2023.07.052',
    nik: '3326016503980027',
    nama: 'Usth. Zaiimatul Arqois',
    namaArab: 'الأستاذة زعيمة الأرقويس',
    gender: 'P',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1998-03-25',
    statusAktif: 'Aktif',
    jabatanUtama: 'Wali Kelas 1 A PUTRI & Guru Tauhid/Fiqih',
    tugasTambahanSatminkal: 'Wali Kelas 1 A PUTRI',
    statusKepegawaian: 'Khidmah',
    tmtMulai: '2023-07-01',
    pendidikanFormal: 'S1 PAI',
    pendidikanPesantren: 'PP. NU Darussalam Karangdadap',
    fanIlmu: ['Tauhid 1', 'Fiqih 2 C'],
    noHP: '0857-2800-0027',
    alamat: 'Karangdadap, Kab. Pekalongan',
    honorPokok: 1800000,
  },
  {
    id: 'ust-28',
    nip: '2023.08.053',
    nik: '3326016605990028',
    nama: 'Usth. Aghitsna Ayyu Shofiyya',
    namaArab: 'الأستاذة أغثنا أي صفية',
    gender: 'P',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1999-05-26',
    statusAktif: 'Aktif',
    jabatanUtama: "Wali Kelas 2 C PUTRI & Guru Tahaji/Nahwu",
    tugasTambahanSatminkal: 'Wali Kelas 2 C PUTRI',
    statusKepegawaian: 'Khidmah',
    tmtMulai: '2023-08-01',
    pendidikanFormal: 'S1 PBA',
    pendidikanPesantren: 'PP. NU Darussalam Karangdadap',
    fanIlmu: ["Tahaji & Qiro'ah", 'Nahwu 2 C'],
    noHP: '0857-2800-0028',
    alamat: 'Karangdadap, Kab. Pekalongan',
    honorPokok: 1800000,
  },
  {
    id: 'ust-29',
    nip: '2024.01.054',
    nik: '3326016708980029',
    nama: 'Usth. Amilatul Amalia',
    namaArab: 'الأستاذة عاملة العملية',
    gender: 'P',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1998-08-27',
    statusAktif: 'Aktif',
    jabatanUtama: 'Pengajar Putri (Tauhid 2A, Akhlak 3, Tauhid 4)',
    statusKepegawaian: 'Honorer',
    tmtMulai: '2024-01-10',
    pendidikanFormal: 'S1 Aqidah Filsafat',
    pendidikanPesantren: 'PP. API Tegalrejo Putri',
    fanIlmu: ['Tauhid 2A', 'Akhlak 3', 'Tauhid 4'],
    noHP: '0857-2800-0029',
    alamat: 'Doro, Kab. Pekalongan',
    honorPokok: 1750000,
  },
  {
    id: 'ust-30',
    nip: '2024.07.055',
    nik: '3326016812990030',
    nama: 'Usth. Emi Sulistyowati',
    namaArab: 'الأستاذة إيمي سولستياواتي',
    gender: 'P',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1999-12-28',
    statusAktif: 'Aktif',
    jabatanUtama: 'Pengajar Putri (Akhlak 2)',
    statusKepegawaian: 'Honorer',
    tmtMulai: '2024-07-01',
    pendidikanFormal: 'S1 PAI',
    pendidikanPesantren: 'PP. NU Darussalam Karangdadap',
    fanIlmu: ['Akhlak 2'],
    noHP: '0857-2800-0030',
    alamat: 'Karangdadap, Kab. Pekalongan',
    honorPokok: 1700000,
  },
  {
    id: 'ust-31',
    nip: '2025.01.056',
    nik: '3326016904000031',
    nama: 'Usth. Aski Indana Zulfa',
    namaArab: 'الأستاذة أسكي إندانا زلفى',
    gender: 'P',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '2000-04-29',
    statusAktif: 'Aktif',
    jabatanUtama: 'Pengajar Putri (Akhlak 1)',
    statusKepegawaian: 'Khidmah',
    tmtMulai: '2025-01-05',
    pendidikanFormal: 'S1 PAI',
    pendidikanPesantren: 'PP. NU Darussalam Karangdadap',
    fanIlmu: ['Akhlak 1'],
    noHP: '0857-2800-0031',
    alamat: 'Karangdadap, Kab. Pekalongan',
    honorPokok: 1650000,
  },
  {
    id: 'ust-32',
    nip: '2024.07.057',
    nik: '3326017009990032',
    nama: 'Usth. Rahma Dina',
    namaArab: 'الأستاذة رحمة دينا',
    gender: 'P',
    tempatLahir: 'Pekalongan',
    tanggalLahir: '1999-09-30',
    statusAktif: 'Aktif',
    jabatanUtama: 'Wali Kelas 2 B PUTRI & Guru Tauhid/Shorof',
    tugasTambahanSatminkal: 'Wali Kelas 2 B PUTRI',
    statusKepegawaian: 'Khidmah',
    tmtMulai: '2024-07-01',
    pendidikanFormal: 'S1 PAI',
    pendidikanPesantren: 'PP. NU Darussalam Karangdadap',
    fanIlmu: ['Tauhid 2 BC', 'Shorof 1'],
    noHP: '0857-2800-0032',
    alamat: 'Karangdadap, Kab. Pekalongan',
    honorPokok: 1800000,
  },
];

const EXTRA_GURU_USERS: UserAccount[] = SEED_USTADZ_LIST
  .filter((u) => !CORE_SEED_USERS.some((c) => c.ustadzId === u.id))
  .map((u) => {
    const cleanSlug = u.nama
      .toLowerCase()
      .replace(/^(kh\.|nyai\s+hj\.|nyai\.|usth\.|ustzh\.|ustd\.|ust\.|m\.)\s*/g, '')
      .replace(/[^a-z0-9]/g, '');
    const waNormalized = (u.noHP || '085728000099').replace(/[^0-9]/g, '');
    return {
      id: `u-${u.id}`,
      username: cleanSlug || u.id,
      nama: u.nama,
      email: `${cleanSlug || u.id}@darussalam.id`,
      noWa: waNormalized,
      password: 'darussalam2026',
      ustadzId: u.id,
      peran: 'guru_pengampu',
      peranLabel: u.jabatanUtama,
      avatar:
        u.gender === 'P'
          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rolesAvailable: ['guru_pengampu'],
      keterangan: `Akun pengajar individu: ${u.jabatanUtama} (${u.fanIlmu.join(', ')})`,
    };
  });

SEED_USERS = [...CORE_SEED_USERS, ...EXTRA_GURU_USERS];

/**
 * Kurikulum & Kitab Kuning + Rumus Pegon Makna Jawa
 */
export interface KurikulumKitabItem {
  id: string;
  tingkat: number; // 1..6
  mapel: string;
  mapelArab: string;
  kitab: string;
  kkm: number;
  targetHafalan: string;
  maknaJawaContoh: string;
}

export const SEED_KURIKULUM_KITAB: KurikulumKitabItem[] = [
  { id: 'kur-1', tingkat: 1, mapel: 'Fiqih', mapelArab: 'الفقه', kitab: 'Matan Taqrib (Pegon)', kkm: 65, targetHafalan: 'Fashl Rukun Islam, Iman & Wudhu', maknaJawaContoh: 'أُوتَاوِي (م) اِيكُو (خ) كَاغْ (ف) سَافَا (ج)' },
  { id: 'kur-2', tingkat: 1, mapel: 'Nahwu', mapelArab: 'النحو', kitab: 'Nahwu Jawan', kkm: 65, targetHafalan: 'Bab Kalam s.d. I\'rob', maknaJawaContoh: 'الكَلَامُ (م) هُوَ أُوتَاوِي كَلامْ اِيكُو لَفَظٌ...' },
  { id: 'kur-3', tingkat: 1, mapel: 'Shorof', mapelArab: 'الصرف', kitab: 'Amtsilah Tashrifiyyah', kkm: 65, targetHafalan: 'Tashrif Istilahi Tsulatsi Mujarrod', maknaJawaContoh: 'فَعَلَ - يَفْعُلُ - فَعْلاً (فعل ماضي - مضارع - مصدر)' },
  { id: 'kur-4', tingkat: 1, mapel: 'Tauhid', mapelArab: 'التوحيد', kitab: 'Aqidatul Awam', kkm: 65, targetHafalan: '57 Bait Nadhom Aqidatul Awam', maknaJawaContoh: 'أَبْدَأُ بِاسْمِ اللهِ: أَوِيتْ إِغْصُونْ كَلاوَانْ نَيَبُوتْ أَسْمَا الله' },
  { id: 'kur-5', tingkat: 2, mapel: 'Fiqih', mapelArab: 'الفقه', kitab: 'Matan Taqrib', kkm: 65, targetHafalan: 'Kitab Thaharah s.d. Shalat', maknaJawaContoh: 'فَصْلٌ (م) أُوتَاوِي اِيكِي اِيكُو فَصَلْ صَوِيجِي' },
  { id: 'kur-6', tingkat: 2, mapel: 'Nahwu', mapelArab: 'النحو', kitab: 'Matan Al-Ajurumiyyah', kkm: 65, targetHafalan: 'Kalam s.d. Manshubatil Asma', maknaJawaContoh: 'كَلامُهُمْ (م) أُوتَاوِي كَلامْ مَعْشَرْ عُلَمَاء نَحْوُ اِيكُو لَفْظٌ مُفِيدٌ' },
  { id: 'kur-7', tingkat: 2, mapel: 'Shorof', mapelArab: 'الصرف', kitab: 'Amtsilah Tashrifiyyah Lughowi', kkm: 65, targetHafalan: 'Tashrif Lughowi Fiil Madhi & Mudhori', maknaJawaContoh: 'فَعَلَ - فَعَلا - فَعَلُوا - فَعَلَتْ - فَعَلَتَا - فَعَلْنَ' },
  { id: 'kur-8', tingkat: 2, mapel: 'Akhlak', mapelArab: 'الأخلاق', kitab: "Washoya Al-Aba' lil Abna'", kkm: 65, targetHafalan: 'Adab Thalibul Ilmi & Birrul Walidain', maknaJawaContoh: 'التَّقْوَى (م) اِيكُو وِدِي إِغْ الله تَعَالَى' },
  { id: 'kur-9', tingkat: 3, mapel: 'Fiqih', mapelArab: 'الفقه', kitab: 'Fathul Qorib', kkm: 65, targetHafalan: 'Kitab Zakat, Shiyam & Hajj', maknaJawaContoh: 'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ، الْحَمْدُ لِلَّهِ تَبَرُّكًا بِالفَاتِحَةِ' },
  { id: 'kur-10', tingkat: 3, mapel: 'Hadits', mapelArab: 'الحديث', kitab: 'Bulughul Marom', kkm: 65, targetHafalan: 'Kitab Thaharah & Shalat', maknaJawaContoh: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ: أَغِغْ فَسْتِي اِيكُو سَحْ فِيرَا-فِيرَا عَمَلْ' },
  { id: 'kur-11', tingkat: 4, mapel: 'Tafsir', mapelArab: 'التفسير', kitab: 'Tafsir Ayatil Ahkam', kkm: 65, targetHafalan: 'Tafsir Ayat-Ayat Hukum', maknaJawaContoh: 'الحَمْدُ لِلَّهِ رَبِّ العَالَمِينَ: أُوتَاوِي سَكَابِيهِ فُوجِي اِيكُو كَاغُوْغَانِ الله' },
  { id: 'kur-12', tingkat: 5, mapel: 'Qowaidul Fiqhiyyah', mapelArab: 'القواعد الفقهية', kitab: 'Faraidul Bahiyyah', kkm: 65, targetHafalan: '5 Qoidah Kubro + Furu\'', maknaJawaContoh: 'الأُمُورُ بِمَقَاصِدِهَا: أُوتَاوِي سَكَابِيهِ فَرْكَارَا اِيكُو كَلاوَانْ نِيَتِ' },
  { id: 'kur-13', tingkat: 6, mapel: "Fathul Mu'in (Fiqih)", mapelArab: 'فتح المعين', kitab: "Fathul Mu'in", kkm: 65, targetHafalan: 'Bab Mu\'amalat & Munakahat', maknaJawaContoh: 'بَابُ البَيْعِ: أُوتَاوِي اِيكِي اِيكُو بَابْ مَرْتِيلاكَاكِ دُولْ تِينُوكُو' },
  { id: 'kur-14', tingkat: 6, mapel: 'Alfiyah Ibnu Malik (Nahwu)', mapelArab: 'ألفية ابن مالك', kitab: 'Alfiyah Ibnu Malik', kkm: 65, targetHafalan: 'Bait 1 - 1000 Khatam', maknaJawaContoh: 'قَالَ مُحَمَّدٌ هُوَ ابْنُ مَالِكِ # أَحْمَدُ رَبِّيَ اللهَ خَيْرَ مَالِكِ' },
];

/**
 * Kurikulum 22 Fan Resmi (Lampiran 3. KURIKULUM 2026-2027)
 */
export interface KurikulumMatrixCell {
  kitab: string;
  jtm: number;
}

export interface KurikulumMatrixRow {
  id: string;
  no: number;
  fan: string;
  fanArab: string;
  kelas1: KurikulumMatrixCell;
  kelas2: KurikulumMatrixCell;
  kelas3: KurikulumMatrixCell;
  kelas4: KurikulumMatrixCell;
  kelas5: KurikulumMatrixCell;
  kelas6: KurikulumMatrixCell;
}

export const SEED_KURIKULUM_MATRIX: KurikulumMatrixRow[] = [
  { id: 'kf-1', no: 1, fan: "Al-Qur'an", fanArab: 'القرآن والتجويد', kelas1: { kitab: 'القرآن والتجويد', jtm: 3 }, kelas2: { kitab: '', jtm: 0 }, kelas3: { kitab: '', jtm: 0 }, kelas4: { kitab: '', jtm: 0 }, kelas5: { kitab: '', jtm: 0 }, kelas6: { kitab: '', jtm: 0 } },
  { id: 'kf-2', no: 2, fan: 'Tajwid', fanArab: 'التجويد', kelas1: { kitab: '', jtm: 0 }, kelas2: { kitab: '', jtm: 0 }, kelas3: { kitab: '', jtm: 0 }, kelas4: { kitab: '', jtm: 0 }, kelas5: { kitab: '', jtm: 0 }, kelas6: { kitab: '', jtm: 0 } },
  { id: 'kf-3', no: 3, fan: "Tahaji / Qiro'ah", fanArab: 'التهاجي والقراءة', kelas1: { kitab: 'التهاجي والقراءة', jtm: 3 }, kelas2: { kitab: '', jtm: 0 }, kelas3: { kitab: '', jtm: 0 }, kelas4: { kitab: '', jtm: 0 }, kelas5: { kitab: '', jtm: 0 }, kelas6: { kitab: '', jtm: 0 } },
  { id: 'kf-4', no: 4, fan: 'Bahasa Arab', fanArab: 'اللغة العربية', kelas1: { kitab: '', jtm: 0 }, kelas2: { kitab: '', jtm: 0 }, kelas3: { kitab: '', jtm: 0 }, kelas4: { kitab: '', jtm: 0 }, kelas5: { kitab: '', jtm: 0 }, kelas6: { kitab: '', jtm: 0 } },
  { id: 'kf-5', no: 5, fan: 'Tarikh', fanArab: 'التاريخ', kelas1: { kitab: '', jtm: 0 }, kelas2: { kitab: 'خلاصة نور اليقين', jtm: 2 }, kelas3: { kitab: '', jtm: 0 }, kelas4: { kitab: '', jtm: 0 }, kelas5: { kitab: '', jtm: 0 }, kelas6: { kitab: '', jtm: 0 } },
  { id: 'kf-6', no: 6, fan: 'Akhlaq', fanArab: 'الأخلاق', kelas1: { kitab: 'تيسير الخلاق (فغون)', jtm: 2 }, kelas2: { kitab: 'وصايا الآباء للأبناء', jtm: 2 }, kelas3: { kitab: 'تعليم المتعلم', jtm: 2 }, kelas4: { kitab: 'متن بداية الهداية', jtm: 2 }, kelas5: { kitab: 'رسالة المعاونة', jtm: 1 }, kelas6: { kitab: '', jtm: 0 } },
  { id: 'kf-7', no: 7, fan: 'Fiqih', fanArab: 'الفقه', kelas1: { kitab: 'متن تقريب (فغون)', jtm: 3 }, kelas2: { kitab: 'متن تقريب', jtm: 4 }, kelas3: { kitab: 'فتح القريب', jtm: 3 }, kelas4: { kitab: 'فتح القريب', jtm: 3 }, kelas5: { kitab: 'فتح المعين', jtm: 3 }, kelas6: { kitab: 'فتح المعين', jtm: 3 } },
  { id: 'kf-8', no: 8, fan: 'Tauhid', fanArab: 'التوحيد', kelas1: { kitab: 'عقيدة العوام', jtm: 2 }, kelas2: { kitab: 'عقيدة الإسلامية', jtm: 2 }, kelas3: { kitab: 'جواهر الكلامية', jtm: 2 }, kelas4: { kitab: 'الحصون الحميدية', jtm: 2 }, kelas5: { kitab: 'الحصون الحميدية', jtm: 2 }, kelas6: { kitab: '', jtm: 0 } },
  { id: 'kf-9', no: 9, fan: 'Nahwu', fanArab: 'النحو', kelas1: { kitab: 'نحو جاوان', jtm: 3 }, kelas2: { kitab: 'متن الأجرومية', jtm: 4 }, kelas3: { kitab: 'نظم العمريطي', jtm: 3 }, kelas4: { kitab: 'ألفية ابن مالك', jtm: 3 }, kelas5: { kitab: 'ألفية ابن مالك', jtm: 3 }, kelas6: { kitab: 'ألفية ابن مالك', jtm: 3 } },
  { id: 'kf-10', no: 10, fan: 'Shorof', fanArab: 'الصرف', kelas1: { kitab: 'الأمثلة التصريفية', jtm: 2 }, kelas2: { kitab: 'الأمثلة التصريفية اللغوي', jtm: 2 }, kelas3: { kitab: 'قواعد الإعلال', jtm: 2 }, kelas4: { kitab: '', jtm: 0 }, kelas5: { kitab: '', jtm: 0 }, kelas6: { kitab: '', jtm: 0 } },
  { id: 'kf-11', no: 11, fan: 'Hadits', fanArab: 'الحديث', kelas1: { kitab: '', jtm: 0 }, kelas2: { kitab: 'الأربعين النووية', jtm: 2 }, kelas3: { kitab: '', jtm: 0 }, kelas4: { kitab: '', jtm: 0 }, kelas5: { kitab: 'جواهر البخاري', jtm: 2 }, kelas6: { kitab: 'جواهر البخاري', jtm: 2 } },
  { id: 'kf-12', no: 12, fan: 'Ilmu Hadits', fanArab: 'علم الحديث', kelas1: { kitab: '', jtm: 0 }, kelas2: { kitab: '', jtm: 0 }, kelas3: { kitab: '', jtm: 0 }, kelas4: { kitab: 'منحة المغيث', jtm: 2 }, kelas5: { kitab: '', jtm: 0 }, kelas6: { kitab: '', jtm: 0 } },
  { id: 'kf-13', no: 13, fan: "Ulumul Qur'an", fanArab: 'علوم القرآن', kelas1: { kitab: '', jtm: 0 }, kelas2: { kitab: '', jtm: 0 }, kelas3: { kitab: 'مختصر في علوم القرآن', jtm: 2 }, kelas4: { kitab: '', jtm: 0 }, kelas5: { kitab: '', jtm: 0 }, kelas6: { kitab: 'علم التفسير', jtm: 2 } },
  { id: 'kf-14', no: 14, fan: 'Ushul Fiqh', fanArab: 'أصول الفقه', kelas1: { kitab: '', jtm: 0 }, kelas2: { kitab: '', jtm: 0 }, kelas3: { kitab: '', jtm: 0 }, kelas4: { kitab: 'البيان في أصول الفقه', jtm: 2 }, kelas5: { kitab: 'البيان في أصول الفقه', jtm: 2 }, kelas6: { kitab: '', jtm: 0 } },
  { id: 'kf-15', no: 15, fan: 'Qowaid Fiqih', fanArab: 'قواعد الفقه', kelas1: { kitab: '', jtm: 0 }, kelas2: { kitab: '', jtm: 0 }, kelas3: { kitab: '', jtm: 0 }, kelas4: { kitab: '', jtm: 0 }, kelas5: { kitab: 'فرائد البهية', jtm: 2 }, kelas6: { kitab: 'فرائد البهية', jtm: 2 } },
  { id: 'kf-16', no: 16, fan: 'Faroidl', fanArab: 'الفرائض', kelas1: { kitab: '', jtm: 0 }, kelas2: { kitab: '', jtm: 0 }, kelas3: { kitab: 'علم الفرائض', jtm: 2 }, kelas4: { kitab: '', jtm: 0 }, kelas5: { kitab: 'علم الفرائض', jtm: 1 }, kelas6: { kitab: '', jtm: 0 } },
  { id: 'kf-17', no: 17, fan: 'Ilmu Falak', fanArab: 'علم الفلك', kelas1: { kitab: '', jtm: 0 }, kelas2: { kitab: '', jtm: 0 }, kelas3: { kitab: '', jtm: 0 }, kelas4: { kitab: '', jtm: 0 }, kelas5: { kitab: '', jtm: 0 }, kelas6: { kitab: '', jtm: 0 } },
  { id: 'kf-18', no: 18, fan: 'Balaghoh', fanArab: 'البلاغة', kelas1: { kitab: '', jtm: 0 }, kelas2: { kitab: '', jtm: 0 }, kelas3: { kitab: '', jtm: 0 }, kelas4: { kitab: '', jtm: 0 }, kelas5: { kitab: '', jtm: 0 }, kelas6: { kitab: 'قواعد اللغة العربية', jtm: 2 } },
  { id: 'kf-19', no: 19, fan: 'Hadits Ahkam', fanArab: 'حديث الأحكام', kelas1: { kitab: '', jtm: 0 }, kelas2: { kitab: '', jtm: 0 }, kelas3: { kitab: 'بلوغ المرام', jtm: 2 }, kelas4: { kitab: 'بلوغ المرام', jtm: 2 }, kelas5: { kitab: '', jtm: 0 }, kelas6: { kitab: '', jtm: 0 } },
  { id: 'kf-20', no: 20, fan: 'Tafsir Ahkam', fanArab: 'تفسير الأحكام', kelas1: { kitab: '', jtm: 0 }, kelas2: { kitab: '', jtm: 0 }, kelas3: { kitab: '', jtm: 0 }, kelas4: { kitab: 'تفسير آيات الأحكام', jtm: 2 }, kelas5: { kitab: '', jtm: 0 }, kelas6: { kitab: '', jtm: 0 } },
  { id: 'kf-21', no: 21, fan: 'Tafsir', fanArab: 'تفسير', kelas1: { kitab: '', jtm: 0 }, kelas2: { kitab: '', jtm: 0 }, kelas3: { kitab: '', jtm: 0 }, kelas4: { kitab: '', jtm: 0 }, kelas5: { kitab: 'تفسير الجلالين', jtm: 2 }, kelas6: { kitab: 'تفسير الجلالين', jtm: 2 } },
  { id: 'kf-22', no: 22, fan: 'Manthiq', fanArab: 'منطق', kelas1: { kitab: '', jtm: 0 }, kelas2: { kitab: '', jtm: 0 }, kelas3: { kitab: '', jtm: 0 }, kelas4: { kitab: '', jtm: 0 }, kelas5: { kitab: '', jtm: 0 }, kelas6: { kitab: 'سلم المنورق', jtm: 2 } },
];

/**
 * Kumpulan Kitab Madrasah Diniyah PDF (Sudah Bermakna Pegon & Kosongan)
 */
export interface KitabPdfItem {
  id: string;
  namaKitab: string;
  namaArab: string;
  pengarang: string;
  tingkat: number;
  fan: string;
  statusMakna: 'Sudah Bermakna Pegon' | 'Kosongan';
  ukuranFile: string;
  fileName: string;
  pdfDataUrl?: string;
  catatan?: string;
  tanggalUpload: string;
}

export const SEED_KITAB_PDF_LIST: KitabPdfItem[] = [
  { id: 'kpdf-1', namaKitab: 'Matan Taqrib (Pegon Makna Pesantren)', namaArab: 'متن الغاية والتقريب', pengarang: 'Syaikh Abu Syuja\'', tingkat: 1, fan: 'Fiqih', statusMakna: 'Sudah Bermakna Pegon', ukuranFile: '4.2 MB', fileName: 'Matan_Taqrib_Makna_Pegon.pdf', catatan: 'Lengkap makna utawi-iku gandul Jawa Pegon cetakan Darussalam', tanggalUpload: '2026-08-10' },
  { id: 'kpdf-2', namaKitab: 'Taisirul Kholaq (Bermakna Pegon)', namaArab: 'تيسير الخلاق في علم الأخلاق', pengarang: 'Hafidh Hasan Al-Mas\'udi', tingkat: 1, fan: 'Akhlak', statusMakna: 'Sudah Bermakna Pegon', ukuranFile: '2.8 MB', fileName: 'Taisirul_Kholaq_Pegon.pdf', catatan: 'Pegon renggang siap dikaji kelas 1 Putra & Putri', tanggalUpload: '2026-08-12' },
  { id: 'kpdf-3', namaKitab: 'Nahwu Jawan & Jurumiyyah Pegon', namaArab: 'نحو جاوان ومتن الآجرومية', pengarang: 'KH. Bisri Musthofa / Ash-Shinhaji', tingkat: 2, fan: 'Nahwu', statusMakna: 'Sudah Bermakna Pegon', ukuranFile: '3.6 MB', fileName: 'Jurumiyyah_Makna_Pegon.pdf', catatan: 'Teks Arab berharokat plus makna Pegon di bawah baris', tanggalUpload: '2026-08-14' },
  { id: 'kpdf-4', namaKitab: 'Amtsilah Tashrifiyyah Lughowi', namaArab: 'الأمثلة التصريفية', pengarang: 'KH. Ma\'shum Ali Seblak', tingkat: 2, fan: 'Shorof', statusMakna: 'Sudah Bermakna Pegon', ukuranFile: '3.1 MB', fileName: 'Amtsilah_Tashrifiyyah_Pegon.pdf', catatan: 'Tabel wazan tsulatsi mujarrod & mazid bermakna Jawa', tanggalUpload: '2026-08-15' },
  { id: 'kpdf-5', namaKitab: 'Fathul Qorib Al-Mujib (Makna Petuk)', namaArab: 'فتح القريب المجيب', pengarang: 'Syaikh Ibnu Qosim Al-Ghozi', tingkat: 3, fan: 'Fiqih', statusMakna: 'Sudah Bermakna Pegon', ukuranFile: '9.4 MB', fileName: 'Fathul_Qorib_Makna_Petuk.pdf', catatan: 'Makna gandul lengkap Thoharoh sampai Jinayat', tanggalUpload: '2026-08-16' },
  { id: 'kpdf-6', namaKitab: 'Nadhom Al-Imrithi (Bermakna Pegon)', namaArab: 'نظم العمريطي', pengarang: 'Syaikh Syarafuddin Al-Imrithi', tingkat: 3, fan: 'Nahwu', statusMakna: 'Sudah Bermakna Pegon', ukuranFile: '4.5 MB', fileName: 'Imrithi_Makna_Pegon.pdf', catatan: '254 bait lengkap syarah ringkas makna Jawa', tanggalUpload: '2026-08-18' },
  { id: 'kpdf-7', namaKitab: 'Matan Bidayatul Hidayah (Makna Pegon)', namaArab: 'بداية الهداية', pengarang: 'Imam Al-Ghozali', tingkat: 4, fan: 'Akhlak', statusMakna: 'Sudah Bermakna Pegon', ukuranFile: '5.1 MB', fileName: 'Bidayatul_Hidayah_Pegon.pdf', catatan: 'Kitab adab dan wirid harian bermakna pesantren', tanggalUpload: '2026-08-20' },
  { id: 'kpdf-8', namaKitab: 'Fathul Mu\'in bi Syarhi Qurrotil \'Ain (Pegon)', namaArab: 'فتح المعين بشرح قرة العين', pengarang: 'Syaikh Zainuddin Al-Malibari', tingkat: 5, fan: 'Fiqih', statusMakna: 'Sudah Bermakna Pegon', ukuranFile: '14.2 MB', fileName: 'Fathul_Muin_Makna_Pegon.pdf', catatan: 'Jilid lengkap makna pesantren untuk kelas 5 & 6', tanggalUpload: '2026-08-22' },
  { id: 'kpdf-9', namaKitab: 'Alfiyah Ibnu Malik (Makna Pesantren)', namaArab: 'ألفية ابن مالك', pengarang: 'Imam Jamaluddin Ibnu Malik', tingkat: 6, fan: 'Nahwu', statusMakna: 'Sudah Bermakna Pegon', ukuranFile: '7.8 MB', fileName: 'Alfiyah_Makna_Pegon.pdf', catatan: '1002 bait nahwu shorof lanjutan bermakna Jawa', tanggalUpload: '2026-08-25' },
  { id: 'kpdf-10', namaKitab: 'Tafsir Al-Jalalain (Kosongan Maktabah)', namaArab: 'تفسير الجلالين', pengarang: 'Imam Jalaluddin Al-Mahalli & As-Suyuthi', tingkat: 6, fan: 'Tafsir', statusMakna: 'Kosongan', ukuranFile: '11.5 MB', fileName: 'Tafsir_Jalalain_Kosongan.pdf', catatan: 'Edisi kosongan gundul untuk latihan sorogan & qiroatul kutub', tanggalUpload: '2026-08-28' },
];

/**
 * Jadwal Pelajaran Harian Ma'arifan & Sinkron Jadwal Imtihan (Kelas 1-6)
 */
export interface JadwalMaarifanItem {
  id: string;
  hari: 'Sabtu' | 'Ahad' | 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jum\'at';
  tanggalUjian?: string;
  jamKe: 1 | 2 | 3;
  waktu: string;
  kelas1: string;
  kelas2: string;
  kelas3: string;
  kelas4: string;
  kelas5: string;
  kelas6: string;
  kategori: 'Ringan' | 'Sedang' | 'Berat' | 'Lisan';
}

export const SEED_JADWAL_MAARIFAN: JadwalMaarifanItem[] = [
  { id: 'jm-1', hari: 'Sabtu', tanggalUjian: "05-12-'26", jamKe: 2, waktu: '18.30–19.30', kelas1: "Al-Qur'an *", kelas2: 'Akhlak', kelas3: 'Akhlak', kelas4: 'Akhlak', kelas5: 'Akhlak', kelas6: 'Ilmu Tafsir', kategori: 'Lisan' },
  { id: 'jm-2', hari: 'Sabtu', tanggalUjian: "05-12-'26", jamKe: 3, waktu: '20.00–21.00', kelas1: 'Tajwid', kelas2: 'Tarikh', kelas3: 'Tauhid', kelas4: 'Tauhid', kelas5: 'Tauhid', kelas6: '-', kategori: 'Ringan' },
  { id: 'jm-3', hari: 'Ahad', tanggalUjian: "06-12-'26", jamKe: 2, waktu: '18.30–19.30', kelas1: 'Fiqih', kelas2: 'Fiqih', kelas3: 'Fiqih', kelas4: 'Fiqih', kelas5: 'Fiqih', kelas6: "Fathul Mu'in", kategori: 'Berat' },
  { id: 'jm-4', hari: 'Ahad', tanggalUjian: "06-12-'26", jamKe: 3, waktu: '20.00–21.00', kelas1: 'Tauhid', kelas2: 'Tauhid', kelas3: 'Hadits', kelas4: 'Hadits', kelas5: 'Hadits', kelas6: 'Jawahirul Bukhori', kategori: 'Sedang' },
  { id: 'jm-5', hari: 'Senin', tanggalUjian: "07-12-'26", jamKe: 2, waktu: '18.30–19.30', kelas1: 'Nahwu', kelas2: 'Nahwu', kelas3: 'Nahwu', kelas4: 'Nahwu', kelas5: 'Nahwu', kelas6: 'Alfiyah Ibnu Malik', kategori: 'Berat' },
  { id: 'jm-6', hari: 'Senin', tanggalUjian: "07-12-'26", jamKe: 3, waktu: '20.00–21.00', kelas1: 'Akhlak', kelas2: 'Hadits', kelas3: "Ulumul Qur'an", kelas4: 'Tafsir', kelas5: 'Qowaidul Fiqhiyyah', kelas6: 'Qowaidul Fiqhiyah', kategori: 'Sedang' },
  { id: 'jm-7', hari: 'Selasa', tanggalUjian: "08-12-'26", jamKe: 1, waktu: '16.00–17.00', kelas1: '-', kelas2: '-', kelas3: '-', kelas4: '-', kelas5: 'Faroidh', kelas6: 'Balaghoh', kategori: 'Sedang' },
  { id: 'jm-8', hari: 'Selasa', tanggalUjian: "08-12-'26", jamKe: 2, waktu: '18.30–19.30', kelas1: 'Shorof', kelas2: 'Shorof', kelas3: 'Shorof', kelas4: 'Ushul Fiqih', kelas5: 'Ushul Fiqih', kelas6: 'Al-Bayan', kategori: 'Berat' },
  { id: 'jm-9', hari: 'Selasa', tanggalUjian: "08-12-'26", jamKe: 3, waktu: '20.00–21.00', kelas1: 'Tahaji', kelas2: '-', kelas3: 'Faroidh', kelas4: 'Ilmu Hadits', kelas5: 'Tafsir', kelas6: 'Tafsir Jalalain', kategori: 'Sedang' },
];

/**
 * Pengaturan Ketersediaan Jam Mengajar Ustadz & Jadwal Kelas Resmi
 */
export interface GuruAvailabilityRule {
  ustadzId: string;
  ustadzNama: string;
  jam1Tersedia: boolean; // Ba'da Ashar 16.00
  jam2Tersedia: boolean; // Ba'da Maghrib 18.30
  jam3Tersedia: boolean; // Ba'da Isya 20.00
  alasanRequest?: string;
}

const CUSTOM_AVAIL: Record<string, Partial<GuruAvailabilityRule>> = {
  'ust-1': { alasanRequest: 'Fleksibel jadwal Pengasuh' },
  'ust-4': { jam1Tersedia: false, alasanRequest: 'Jam 1 (Ashar) belum bisa karena bekerja pagi-sore; request mengajar Jam 2 & Jam 3' },
  'ust-7': { jam1Tersedia: false, alasanRequest: 'Jam 1 bertugas administrasi keuangan' },
  'ust-8': { alasanRequest: 'Khusus kelas Putri semua jam' },
  'ust-10': { jam3Tersedia: false, alasanRequest: 'Jam 3 piket musyawarah malam' },
  'ust-12': { jam1Tersedia: false, alasanRequest: 'Jam 1 kerja, siap Jam 2 & 3' },
};

export const SEED_GURU_AVAILABILITY: GuruAvailabilityRule[] = SEED_USTADZ_LIST.map((u) => ({
  ustadzId: u.id,
  ustadzNama: u.nama,
  jam1Tersedia: CUSTOM_AVAIL[u.id]?.jam1Tersedia ?? true,
  jam2Tersedia: CUSTOM_AVAIL[u.id]?.jam2Tersedia ?? true,
  jam3Tersedia: CUSTOM_AVAIL[u.id]?.jam3Tersedia ?? true,
  alasanRequest: CUSTOM_AVAIL[u.id]?.alasanRequest ?? (u.gender === 'P' ? 'Siap mengajar Madrasah Diniyah Putri' : 'Siap semua jam diniyah'),
}));

export interface JadwalMengajarSlot {
  id: string;
  hari: 'Sabtu' | 'Ahad' | 'Senin' | 'Selasa' | 'Rabu' | 'Kamis';
  jamKe: 1 | 2 | 3;
  kelas: string;
  mapel: string;
  ustadzNama: string;
}

export const SEED_JADWAL_MENGAJAR: JadwalMengajarSlot[] = [
  { id: 'jms-1', hari: 'Sabtu', jamKe: 2, kelas: '1 A PUTRA', mapel: 'Fiqih', ustadzNama: 'Ust. Abdur Rahman' },
  { id: 'jms-2', hari: 'Sabtu', jamKe: 3, kelas: '1 A PUTRA', mapel: 'Nahwu', ustadzNama: 'Ust. Nidhomul Muna Lana' },
  { id: 'jms-3', hari: 'Sabtu', jamKe: 2, kelas: '2 A PUTRA', mapel: 'Nahwu', ustadzNama: 'Ust. Nidhomul Muna Lana' },
  { id: 'jms-4', hari: 'Sabtu', jamKe: 3, kelas: '2 A PUTRA', mapel: 'Fiqih', ustadzNama: 'Ust. Abdur Rahman' },
  { id: 'jms-5', hari: 'Ahad', jamKe: 2, kelas: '2 B PUTRA', mapel: 'Nahwu', ustadzNama: 'Ust. Nidhomul Muna Lana' },
  { id: 'jms-6', hari: 'Ahad', jamKe: 3, kelas: '3 A PUTRA', mapel: 'Nahwu', ustadzNama: 'Ust. Nidhomul Muna Lana' },
  { id: 'jms-7', hari: 'Senin', jamKe: 1, kelas: '1 B PUTRA', mapel: 'Akhlak', ustadzNama: 'Ust. Ahmadi' },
  { id: 'jms-8', hari: 'Senin', jamKe: 2, kelas: '2 A PUTRI', mapel: 'Fiqih', ustadzNama: 'Usth. Siti Maryam' },
  { id: 'jms-9', hari: 'Selasa', jamKe: 1, kelas: '5 A PUTRA & PUTRI', mapel: 'Qowaidul Fiqhiyyah', ustadzNama: 'Ust. Abdul Fattah' },
  { id: 'jms-10', hari: 'Rabu', jamKe: 2, kelas: '6 A PUTRA & PUTRI', mapel: "Fathul Mu'in (Fiqih)", ustadzNama: 'KH. Amin Maizun' },
  { id: 'jms-11', hari: 'Kamis', jamKe: 3, kelas: '4 A PUTRA', mapel: 'Ilmu Hadits', ustadzNama: 'Ust. Haris Maulana' },
];

/**
 * Kalender Pendidikan T.A. 1447-1448 H / 2026-2027 M
 */
export interface KalenderKodeItem {
  code: string;
  label: string;
  bgColor: string;
  textColor: string;
}

export interface KalenderRowData {
  no: string;
  bulan: string;
  days: Record<number, string>;
  blockedDays: number[];
}

export interface KalenderPendidikanData {
  tahunAjaran: string;
  ditetapkanDi: string;
  pengasuhNama: string;
  catatanKaki: string;
  jmlHariImtihan1: number;
  jmlHariImtihan2: number;
  legend: KalenderKodeItem[];
  rows: KalenderRowData[];
}

export const SEED_KALENDER_PENDIDIKAN: KalenderPendidikanData = {
  tahunAjaran: 'Tahun Ajaran 1447 - 1448 H. / 2026 - 2027 M.',
  ditetapkanDi: 'Karangdadap, ..... Juli 2026',
  pengasuhNama: 'KH. AMIN MAIZUN',
  catatanKaki: '* Jadwal bisa berubah sesuai dengan kondisi dan situasi',
  jmlHariImtihan1: 115,
  jmlHariImtihan2: 83,
  legend: [
    { code: 'LP', label: 'Libur Pondok', bgColor: '#C2410C', textColor: '#FFFFFF' },
    { code: 'KSB', label: 'Kedatangan Santri Baru', bgColor: '#D6D3D1', textColor: '#1C1917' },
    { code: 'KSL', label: 'Kedatangan Santri Lama', bgColor: '#FEF08A', textColor: '#1C1917' },
    { code: 'LM', label: "Libur Madrasah (Hari Jum'at)", bgColor: '#7F1D1D', textColor: '#FFFFFF' },
    { code: 'Z', label: 'Ziaroh', bgColor: '#65A30D', textColor: '#FFFFFF' },
    { code: 'EV', label: 'Evaluasi Bulanan', bgColor: '#CA8A04', textColor: '#1C1917' },
    { code: 'TSY', label: 'Haflah Tasyakur', bgColor: '#84CC16', textColor: '#1C1917' },
    { code: 'IMT 1', label: 'Imtihan Pertama', bgColor: '#3B82F6', textColor: '#FFFFFF' },
    { code: 'PR', label: 'Pembagian Raport', bgColor: '#C084FC', textColor: '#1C1917' },
    { code: 'L IMT', label: 'Libur Imtihan', bgColor: '#4D7C7B', textColor: '#FFFFFF' },
    { code: 'IFT', label: 'Iftitahuddirosah', bgColor: '#22C55E', textColor: '#1C1917' },
    { code: 'HPN', label: 'Hari Pahlawan Nasional', bgColor: '#F87171', textColor: '#FFFFFF' },
    { code: 'IMT 2', label: 'Imtihan Kedua', bgColor: '#2563EB', textColor: '#FFFFFF' },
    { code: 'US', label: 'Ujian Susulan', bgColor: '#1E3A8A', textColor: '#FFFFFF' },
    { code: 'KS', label: 'Koreksian Soal', bgColor: '#1D4ED8', textColor: '#FFFFFF' },
    { code: 'IN', label: 'Input Nilai Raport', bgColor: '#FACC15', textColor: '#1C1917' },
    { code: 'LHR', label: 'Libur Hari Raya', bgColor: '#60A5FA', textColor: '#1C1917' },
    { code: 'ISR', label: "Isra' wal Mi'roj", bgColor: '#84CC16', textColor: '#1C1917' },
    { code: 'NZ', label: "Nuzulul Qur'an", bgColor: '#38BDF8', textColor: '#1C1917' },
    { code: 'LHS', label: 'Libur Hari Santri Nasional', bgColor: '#4ADE80', textColor: '#1C1917' },
    { code: 'R', label: "Ro'an Santri", bgColor: '#94A3B8', textColor: '#1C1917' },
    { code: 'KDS', label: 'Kedatangan Santri', bgColor: '#7E22CE', textColor: '#FFFFFF' },
    { code: 'MTS', label: "Masa Ta'aruf Santri Baru", bgColor: '#1D4ED8', textColor: '#FFFFFF' },
    { code: 'SDK', label: 'Sidang Kenaikan', bgColor: '#3B82F6', textColor: '#FFFFFF' },
    { code: 'DZB', label: "Dziba'iyyah wal Khithobiyah Bulanan", bgColor: '#7E22CE', textColor: '#FFFFFF' },
    { code: 'LD', label: 'Libur Diniyah (Tidak Pulang)', bgColor: '#D6D3D1', textColor: '#1C1917' },
    { code: 'RMD', label: '1 Romadhon 1448 H', bgColor: '#14B8A6', textColor: '#FFFFFF' },
    { code: 'PS', label: 'Pengajian Posoan', bgColor: '#15803D', textColor: '#FFFFFF' },
    { code: 'HR', label: 'Hari Raya', bgColor: '#EAB308', textColor: '#1C1917' },
    { code: 'HUT', label: 'Libur 17-an', bgColor: '#94A3B8', textColor: '#1C1917' },
    { code: 'MLD', label: 'Libur Maulid Nabi Saw', bgColor: '#16A34A', textColor: '#FFFFFF' },
    { code: 'HF', label: 'Haflah Akhiriddirosah', bgColor: '#64748B', textColor: '#FFFFFF' },
    { code: 'HBH', label: 'Halal bi Halal', bgColor: '#1E293B', textColor: '#FFFFFF' },
    { code: 'LPI', label: 'Lomba Praktek Ibadah', bgColor: '#EC4899', textColor: '#FFFFFF' },
    { code: 'UMQ', label: 'Ujian Munaqosyah', bgColor: '#4D7C7B', textColor: '#FFFFFF' },
  ],
  rows: [
    { no: '', bulan: 'Juni 2026', blockedDays: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,31], days: { 21:'PR', 22:'HF', 23:'LP', 24:'LP', 25:'LP', 26:'LP', 27:'LP', 28:'LP', 29:'LP', 30:'LP' } },
    { no: '1', bulan: 'Juli 2026', blockedDays: [], days: { 1:'LP', 2:'LP', 3:'LP', 4:'LP', 5:'LP', 6:'LP', 7:'LP', 8:'LP', 9:'KSL', 10:'R', 11:'KSB', 12:'R', 13:'IFT', 14:'MTS', 15:'MTS', 16:'MTS', 17:'LM', 24:'LM', 31:'LM' } },
    { no: '2', bulan: 'Agustus 2026', blockedDays: [], days: { 2:'EV', 7:'DZB', 14:'LM', 17:'HUT', 21:'LM', 28:'LM' } },
    { no: '3', bulan: 'September 2026', blockedDays: [31], days: { 2:'EV', 4:'LM', 5:'MLD', 11:'DZB', 18:'LM', 25:'LM' } },
    { no: '4', bulan: 'Oktober 2026', blockedDays: [], days: { 2:'EV', 9:'LM', 16:'DZB', 22:'LHS', 23:'LM', 30:'LM' } },
    { no: '5', bulan: 'November 2026', blockedDays: [31], days: { 2:'EV', 6:'LM', 10:'HPN', 13:'LM', 20:'DZB', 27:'LM' } },
    { no: '6', bulan: 'Desember 2026', blockedDays: [], days: { 2:'EV', 4:'LM', 11:'LM', 12:'IMT 1', 13:'IMT 1', 14:'IMT 1', 15:'IMT 1', 16:'US', 17:'KS', 18:'KS', 19:'KS', 20:'IN', 21:'PR', 22:'Z', 23:'L IMT', 24:'L IMT', 25:'L IMT', 26:'L IMT', 27:'L IMT', 28:'L IMT', 29:'L IMT', 30:'L IMT', 31:'L IMT' } },
    { no: '7', bulan: 'Januari 2027', blockedDays: [], days: { 1:'KDS', 6:'ISR', 8:'LM', 15:'LM', 22:'Z', 29:'DZB' } },
    { no: '8', bulan: 'Februari 2027', blockedDays: [29,30,31], days: { 2:'EV', 5:'LM', 6:'LD', 7:'LD', 8:'RMD', 9:'PS', 10:'PS', 11:'PS', 12:'PS', 13:'PS', 14:'PS', 15:'PS', 16:'PS', 17:'PS', 18:'PS', 19:'PS', 20:'PS', 21:'PS', 22:'PS', 23:'PS', 24:'PS', 25:'PS', 26:'NZ', 27:'LHR', 28:'LHR' } },
    { no: '9', bulan: 'Maret 2027', blockedDays: [], days: { 1:'LHR', 2:'LHR', 3:'LHR', 4:'LHR', 5:'LHR', 6:'LHR', 7:'LHR', 8:'LHR', 9:'LHR', 10:'HR', 11:'LHR', 12:'LHR', 13:'LHR', 14:'LHR', 15:'LHR', 16:'LHR', 17:'LHR', 18:'LHR', 19:'LHR', 20:'LHR', 21:'LHR', 22:'LHR', 23:'LHR', 24:'KDS', 25:'R', 26:'HBH' } },
    { no: '10', bulan: 'April 2027', blockedDays: [31], days: { 2:'LM', 9:'DZB', 16:'LM', 23:'LM', 28:'UMQ', 30:'LM' } },
    { no: '11', bulan: 'Mei 2027', blockedDays: [], days: { 7:'LM', 14:'DZB', 21:'LM', 28:'LM' } },
    { no: '12', bulan: 'Juni 2027', blockedDays: [31], days: { 1:'IMT 2', 2:'IMT 2', 3:'IMT 2', 4:'IMT 2', 5:'LM', 6:'US', 7:'KS', 8:'KS', 9:'KS', 10:'IN', 11:'IN', 12:'SDK', 13:'L IMT', 14:'L IMT', 15:'L IMT', 16:'L IMT', 17:'L IMT', 18:'L IMT', 19:'L IMT', 20:'PR', 22:'HF', 23:'LP', 24:'LP', 25:'LP', 26:'LP', 27:'LP', 28:'LP', 29:'LP', 30:'LP' } },
    { no: '', bulan: 'Juli 2027', blockedDays: [10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31], days: { 1:'LP', 2:'LP', 3:'LP', 4:'LP', 5:'LP', 6:'LP', 7:'LP', 8:'LP', 9:'LP' } },
  ],
};

/**
 * Penggajian & Bisyaroh Dewan Asatidz (Bendahara)
 */
export interface UstadzPayrollItem {
  ustadzId: string;
  ustadzNama: string;
  jabatan: string;
  domisili: 'Laju' | 'Mukim';
  gajiPokok: number;
  tunjanganTransportasi: number;
  tunjanganMasaKerja: number;
  tunjanganKomunikasi: number;
  tunjanganJabatan: number;
  bisyarohTakhasus: number;
  jtmDiniyah: number;
  jumlahHadir: number;
  statusBayar: 'Siap' | 'Dibayarkan';
  terakhirDibayar?: string;
}

const JTM_RESMI_BY_USTADZ: Record<string, number> = {
  'ust-1': 4,
  'ust-3': 8,
  'ust-4': 8,
  'ust-12': 8,
  'ust-16': 5,
  'ust-17': 8,
  'ust-18': 6,
  'ust-19': 6,
  'ust-20': 11,
  'ust-21': 5,
  'ust-22': 9,
  'ust-23': 8,
  'ust-24': 8,
  'ust-25': 8,
  'ust-26': 8,
  'ust-27': 8,
  'ust-28': 10,
  'ust-29': 6,
  'ust-30': 6,
  'ust-31': 4,
  'ust-32': 8,
};

export const SEED_USTADZ_PAYROLL: UstadzPayrollItem[] = SEED_USTADZ_LIST.map((u, idx) => ({
  ustadzId: u.id,
  ustadzNama: u.nama,
  jabatan: u.jabatanUtama,
  domisili: u.alamat.toLowerCase().includes('karangdadap') && u.statusKepegawaian === 'Khidmah' ? 'Mukim' : 'Laju',
  gajiPokok: u.id === 'ust-1' || u.id === 'ust-16' || u.id === 'ust-19' ? 1500000 : 400000,
  tunjanganTransportasi: u.alamat.toLowerCase().includes('karangdadap') ? 100000 : 200000,
  tunjanganMasaKerja: Math.max(50000, (8 - Math.min(idx, 6)) * 50000),
  tunjanganKomunikasi: u.id === 'ust-1' || u.id === 'ust-2' || u.id === 'ust-5' ? 100000 : 50000,
  tunjanganJabatan: u.id === 'ust-1' || u.id === 'ust-16' ? 500000 : u.id === 'ust-2' || u.id === 'ust-4' || u.id === 'ust-5' || u.id === 'ust-7' ? 250000 : 100000,
  bisyarohTakhasus: u.id === 'ust-1' || u.id === 'ust-4' || u.id === 'ust-8' ? 250000 : 0,
  jtmDiniyah: JTM_RESMI_BY_USTADZ[u.id] ?? 6,
  jumlahHadir: 24,
  statusBayar: idx < 3 ? 'Dibayarkan' : 'Siap',
  terakhirDibayar: idx < 3 ? '2026-11-08' : undefined,
}));

export interface BisyarohHistoryItem {
  id: string;
  bulan: string;
  tahun: number;
  tanggalBayar: string;
  ustadzId: string;
  ustadzNama: string;
  jabatan: string;
  domisili: 'Laju' | 'Mukim';
  jtmDiniyah: number;
  jumlahHadir: number;
  tunjanganTetap: number;
  bisyarohDiniyah: number;
  totalDiterima: number;
  metode: 'Tunai Loket' | 'Transfer Bank';
  petugas: string;
}

export const SEED_BISYAROH_HISTORY: BisyarohHistoryItem[] = [
  ...SEED_USTADZ_PAYROLL.slice(0, 3).map((p, i) => {
    const bisyarohDiniyah = Math.round(((p.jtmDiniyah * p.jumlahHadir) / 2) * 10000);
    const tunjanganTetap =
      p.gajiPokok +
      p.tunjanganTransportasi +
      p.tunjanganMasaKerja +
      p.tunjanganKomunikasi +
      p.tunjanganJabatan +
      p.bisyarohTakhasus;
    return {
      id: `bh-nov-${i + 1}`,
      bulan: 'November',
      tahun: 2026,
      tanggalBayar: '2026-11-08',
      ustadzId: p.ustadzId,
      ustadzNama: p.ustadzNama,
      jabatan: p.jabatan,
      domisili: p.domisili,
      jtmDiniyah: p.jtmDiniyah,
      jumlahHadir: p.jumlahHadir,
      tunjanganTetap,
      bisyarohDiniyah,
      totalDiterima: tunjanganTetap + bisyarohDiniyah,
      metode: 'Tunai Loket' as const,
      petugas: 'M. Abdul Fataah',
    };
  }),
  ...SEED_USTADZ_PAYROLL.slice(0, 6).map((p, i) => {
    const hadirOkt = 25;
    const bisyarohDiniyah = Math.round(((p.jtmDiniyah * hadirOkt) / 2) * 10000);
    const tunjanganTetap =
      p.gajiPokok +
      p.tunjanganTransportasi +
      p.tunjanganMasaKerja +
      p.tunjanganKomunikasi +
      p.tunjanganJabatan +
      p.bisyarohTakhasus;
    return {
      id: `bh-okt-${i + 1}`,
      bulan: 'Oktober',
      tahun: 2026,
      tanggalBayar: '2026-10-10',
      ustadzId: p.ustadzId,
      ustadzNama: p.ustadzNama,
      jabatan: p.jabatan,
      domisili: p.domisili,
      jtmDiniyah: p.jtmDiniyah,
      jumlahHadir: hadirOkt,
      tunjanganTetap,
      bisyarohDiniyah,
      totalDiterima: tunjanganTetap + bisyarohDiniyah,
      metode: (i % 2 === 0 ? 'Tunai Loket' : 'Transfer Bank') as 'Tunai Loket' | 'Transfer Bank',
      petugas: 'M. Abdul Fataah',
    };
  }),
];

/**
 * Absensi Harian Guru Diniyah, Ngaji Al-Qur'an Pagi & Ngaji Takhasus
 */
export type ProgramAbsensiType =
  | 'Madrasah Diniyah'
  | "Ngaji Al-Qur'an Pagi (Ba'da Subuh)"
  | 'Ngaji Takhasus';

export interface AbsensiShiftConfig {
  id: string;
  nama: string;
  program: ProgramAbsensiType;
  jamMulai: string; // HH:MM
  jamSelesai: string; // HH:MM
  toleransiMenit: number;
  lokasi: string;
  aktif: boolean;
}

export const SEED_ABSENSI_SHIFT_CONFIGS: AbsensiShiftConfig[] = [
  {
    id: 'shift-subuh',
    nama: "Ngaji Al-Qur'an Ba'da Subuh",
    program: "Ngaji Al-Qur'an Pagi (Ba'da Subuh)",
    jamMulai: '05:00',
    jamSelesai: '06:00',
    toleransiMenit: 10,
    lokasi: 'Masjid Utama PP NU Darussalam',
    aktif: true,
  },
  {
    id: 'shift-takhasus-sore',
    nama: 'Ngaji Takhasus Sore',
    program: 'Ngaji Takhasus',
    jamMulai: '16:00',
    jamSelesai: '17:00',
    toleransiMenit: 10,
    lokasi: 'Serambi Dalem & Aula Pondok',
    aktif: true,
  },
  {
    id: 'shift-mds-1',
    nama: 'Madrasah Diniyah — Jam Ke-1',
    program: 'Madrasah Diniyah',
    jamMulai: '18:00',
    jamSelesai: '19:00',
    toleransiMenit: 10,
    lokasi: 'Komplek MDS PP NU Darussalam',
    aktif: true,
  },
  {
    id: 'shift-mds-2',
    nama: 'Madrasah Diniyah — Jam Ke-2',
    program: 'Madrasah Diniyah',
    jamMulai: '19:00',
    jamSelesai: '20:00',
    toleransiMenit: 10,
    lokasi: 'Komplek MDS PP NU Darussalam',
    aktif: true,
  },
  {
    id: 'shift-mds-3',
    nama: 'Madrasah Diniyah — Jam Ke-3',
    program: 'Madrasah Diniyah',
    jamMulai: '20:00',
    jamSelesai: '21:00',
    toleransiMenit: 10,
    lokasi: 'Komplek MDS PP NU Darussalam',
    aktif: true,
  },
  {
    id: 'shift-sorogan-malam',
    nama: 'Ngaji Sorogan & Mutholaah Malam',
    program: 'Ngaji Takhasus',
    jamMulai: '21:00',
    jamSelesai: '22:00',
    toleransiMenit: 10,
    lokasi: 'Aula Utama & Asrama Komplek',
    aktif: true,
  },
];

export interface AbsensiGuruRecord {
  id: string;
  tanggal: string;
  ustadzId: string;
  ustadzNama: string;
  kelas: string;
  mapel: string;
  program?: ProgramAbsensiType;
  sesiId?: string;
  sesiNama?: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Badal';
  pengganti?: string;
  waktuInput: string;
  waktuCekOut?: string;
  durasiKerja?: string;
  statusKeterlambatan?: 'Tepat Waktu' | 'Terlambat';
  menitTerlambat?: number;
  fotoSelfieUrl?: string;
  fotoCekOutUrl?: string;
  koordinat?: string;
  akurasiGps?: number;
  lokasiLabel?: string;
  waktuTimestamp?: string;
  wajahCocok?: boolean;
  verifikasiAtasan?: 'Terverifikasi' | 'Menunggu';
  sumberAbsen?: 'GPS Mobile' | 'Absen Pengajuan' | 'Input Manual';
  catatanPengajuan?: string;
}

export interface IzinBadalGuruRequest {
  id: string;
  ustadzId: string;
  ustadzNama: string;
  tanggal: string;
  jenis: 'Absen Pengajuan' | 'Izin' | 'Sakit' | 'Badal' | 'Tugas Pondok';
  program: ProgramAbsensiType;
  sesiId?: string;
  sesiNama?: string;
  jamMulaiDiajukan?: string;
  jamSelesaiDiajukan?: string;
  kelasMapel?: string;
  kendalaKategori?: string;
  buktiFotoUrl?: string;
  guruBadalNama?: string;
  alasan: string;
  status: 'Menunggu' | 'Disetujui' | 'Ditolak';
  disetujuiOleh?: string;
  waktuPengajuan: string;
}

export const SEED_IZIN_BADAL_GURU: IzinBadalGuruRequest[] = [
  {
    id: 'ib-0',
    ustadzId: 'ust-3',
    ustadzNama: 'Ustadz Abdur Rahman',
    tanggal: '2026-11-20',
    jenis: 'Absen Pengajuan',
    program: 'Madrasah Diniyah',
    sesiId: 'shift-mds-1',
    sesiNama: 'Madrasah Diniyah — Jam Ke-1',
    jamMulaiDiajukan: '18:00',
    jamSelesaiDiajukan: '19:00',
    kelasMapel: '2 A PUTRA · Fiqih (Matan Taqrib)',
    kendalaKategori: 'Sinyal GPS Lemah / Tidak Terbaca',
    alasan: 'Sinyal di ruang kelas lantai bawah sempat terputus saat jam masuk ke-1, mengajar berjalan penuh 1 jam.',
    status: 'Menunggu',
    waktuPengajuan: '2026-11-20 19:05',
  },
  {
    id: 'ib-1',
    ustadzId: 'ust-6',
    ustadzNama: 'Ustadz Khoirul Umam',
    tanggal: '2026-11-18',
    jenis: 'Badal',
    program: 'Ngaji Takhasus',
    guruBadalNama: 'Ustadz Syarif Hidayatullah',
    alasan: 'Koordinasi persiapan logistik peringatan Hari Pahlawan & agenda asrama.',
    status: 'Disetujui',
    disetujuiOleh: 'Ustadz Syarif Hidayatullah (Kepala Majlis Ma\'arif)',
    waktuPengajuan: '2026-11-17 19:20',
  },
  {
    id: 'ib-2',
    ustadzId: 'ust-17',
    ustadzNama: 'Ustadzah Dewi Masitoh',
    tanggal: '2026-11-21',
    jenis: 'Izin',
    program: 'Madrasah Diniyah',
    guruBadalNama: 'Ustadzah Nurul Aini',
    alasan: 'Menghadiri agenda keluarga di Kajen, mohon izin badal 1 pertemuan.',
    status: 'Menunggu',
    waktuPengajuan: '2026-11-19 20:10',
  },
];

export const SEED_ABSENSI_GURU: AbsensiGuruRecord[] = [
  { id: 'ag-1', tanggal: '2026-11-19', ustadzId: 'ust-4', ustadzNama: 'Ust. Nidhomul Muna Lana', kelas: '2 B PUTRA', mapel: 'Nahwu (Matan Al-Ajurumiyyah)', program: 'Madrasah Diniyah', sesiId: 'shift-mds-1', sesiNama: 'Madrasah Diniyah — Jam Ke-1', status: 'Hadir', waktuInput: '17:58', waktuCekOut: '19:02', durasiKerja: '01:04:00', statusKeterlambatan: 'Tepat Waktu', menitTerlambat: 0, koordinat: '-6.9765, 109.6832', akurasiGps: 18, lokasiLabel: 'Komplek MDS PP NU Darussalam', waktuTimestamp: '19 Nov 2026 17:58 WIB', wajahCocok: true, verifikasiAtasan: 'Terverifikasi', sumberAbsen: 'GPS Mobile' },
  { id: 'ag-2', tanggal: '2026-11-18', ustadzId: 'ust-4', ustadzNama: 'Ust. Nidhomul Muna Lana', kelas: '2 A PUTRA', mapel: 'Nahwu (Al-Imrithi)', program: 'Madrasah Diniyah', sesiId: 'shift-mds-2', sesiNama: 'Madrasah Diniyah — Jam Ke-2', status: 'Hadir', waktuInput: '19:12', waktuCekOut: '20:03', durasiKerja: '00:51:00', statusKeterlambatan: 'Terlambat', menitTerlambat: 12, koordinat: '-6.9765, 109.6832', akurasiGps: 24, lokasiLabel: 'Komplek MDS PP NU Darussalam', waktuTimestamp: '18 Nov 2026 19:12 WIB', wajahCocok: true, verifikasiAtasan: 'Terverifikasi', sumberAbsen: 'GPS Mobile' },
  { id: 'ag-3', tanggal: '2026-11-17', ustadzId: 'ust-4', ustadzNama: 'Ust. Nidhomul Muna Lana', kelas: '3 A PUTRA', mapel: 'Nahwu (Nadhom Al-Imrithi)', program: 'Madrasah Diniyah', sesiId: 'shift-mds-1', sesiNama: 'Madrasah Diniyah — Jam Ke-1', status: 'Hadir', waktuInput: '17:55', waktuCekOut: '19:00', durasiKerja: '01:05:00', statusKeterlambatan: 'Tepat Waktu', menitTerlambat: 0, koordinat: '-6.9765, 109.6832', akurasiGps: 15, lokasiLabel: 'Komplek MDS PP NU Darussalam', waktuTimestamp: '17 Nov 2026 17:55 WIB', wajahCocok: true, verifikasiAtasan: 'Terverifikasi', sumberAbsen: 'GPS Mobile' },
  { id: 'ag-4', tanggal: '2026-11-16', ustadzId: 'ust-4', ustadzNama: 'Ust. Nidhomul Muna Lana', kelas: '2 B PUTRA', mapel: 'Nahwu (Matan Al-Ajurumiyyah)', program: 'Madrasah Diniyah', sesiId: 'shift-mds-1', sesiNama: 'Madrasah Diniyah — Jam Ke-1', status: 'Hadir', waktuInput: '17:58', waktuCekOut: '19:01', durasiKerja: '01:03:00', statusKeterlambatan: 'Tepat Waktu', menitTerlambat: 0, koordinat: '-6.9765, 109.6832', akurasiGps: 21, lokasiLabel: 'Komplek MDS PP NU Darussalam', waktuTimestamp: '16 Nov 2026 17:58 WIB', wajahCocok: true, verifikasiAtasan: 'Terverifikasi', sumberAbsen: 'GPS Mobile' },
  { id: 'ag-5', tanggal: '2026-11-19', ustadzId: 'ust-3', ustadzNama: 'Ust. Abdur Rahman', kelas: '2 A PUTRA', mapel: 'Fiqih (Matan Taqrib)', program: 'Madrasah Diniyah', sesiId: 'shift-mds-1', sesiNama: 'Madrasah Diniyah — Jam Ke-1', status: 'Hadir', waktuInput: '17:56', waktuCekOut: '19:00', durasiKerja: '01:04:00', statusKeterlambatan: 'Tepat Waktu', menitTerlambat: 0, koordinat: '-6.9765, 109.6832', akurasiGps: 20, lokasiLabel: 'PP NU Darussalam Karangdadap', waktuTimestamp: '19 Nov 2026 17:56 WIB', wajahCocok: true, verifikasiAtasan: 'Terverifikasi', sumberAbsen: 'GPS Mobile' },
  { id: 'ag-6', tanggal: '2026-11-19', ustadzId: 'ust-5', ustadzNama: 'Ust. Ahmad Mujiburrohman', kelas: '1 A PUTRA', mapel: 'Shorof', program: "Ngaji Al-Qur'an Pagi (Ba'da Subuh)", sesiId: 'shift-subuh', sesiNama: "Ngaji Al-Qur'an Ba'da Subuh", status: 'Hadir', waktuInput: '05:04', waktuCekOut: '06:02', durasiKerja: '00:58:00', statusKeterlambatan: 'Tepat Waktu', menitTerlambat: 0, koordinat: '-6.9765, 109.6832', akurasiGps: 19, lokasiLabel: 'Masjid PP NU Darussalam', waktuTimestamp: '19 Nov 2026 05:04 WIB', wajahCocok: true, verifikasiAtasan: 'Terverifikasi', sumberAbsen: 'GPS Mobile' },
  { id: 'ag-7', tanggal: '2026-11-18', ustadzId: 'ust-6', ustadzNama: 'Ust. Khoirul Umam', kelas: '3 A PUTRA', mapel: 'Hadits', program: 'Ngaji Takhasus', sesiId: 'shift-takhasus-sore', sesiNama: 'Ngaji Takhasus Sore', status: 'Badal', pengganti: 'Ust. Syarif Hidayatullah', waktuInput: '16:05', statusKeterlambatan: 'Tepat Waktu', menitTerlambat: 0, koordinat: '-6.9765, 109.6832', lokasiLabel: 'PP NU Darussalam Karangdadap', waktuTimestamp: '18 Nov 2026 16:05 WIB', wajahCocok: true, verifikasiAtasan: 'Terverifikasi', sumberAbsen: 'Input Manual' },
  { id: 'ag-8', tanggal: '2026-11-19', ustadzId: 'ust-2', ustadzNama: 'Ust. Syarif Hidayatullah', kelas: '6 A PUTRA & PUTRI', mapel: 'Ushul Fiqih', program: 'Madrasah Diniyah', sesiId: 'shift-mds-2', sesiNama: 'Madrasah Diniyah — Jam Ke-2', status: 'Hadir', waktuInput: '18:55', waktuCekOut: '20:02', durasiKerja: '01:07:00', statusKeterlambatan: 'Tepat Waktu', menitTerlambat: 0, koordinat: '-6.9765, 109.6832', akurasiGps: 14, lokasiLabel: 'Kantor Majlis Ma\'arif PP NU Darussalam', waktuTimestamp: '19 Nov 2026 18:55 WIB', wajahCocok: true, verifikasiAtasan: 'Terverifikasi', sumberAbsen: 'GPS Mobile' },
  { id: 'ag-9', tanggal: '2026-11-19', ustadzId: 'ust-16', ustadzNama: 'Usth. Siti Aisyah', kelas: '1 A PUTRI', mapel: 'Fiqih Putri', program: 'Madrasah Diniyah', sesiId: 'shift-mds-1', sesiNama: 'Madrasah Diniyah — Jam Ke-1', status: 'Hadir', waktuInput: '17:57', waktuCekOut: '19:00', durasiKerja: '01:03:00', statusKeterlambatan: 'Tepat Waktu', menitTerlambat: 0, koordinat: '-6.9768, 109.6835', akurasiGps: 22, lokasiLabel: 'Komplek Madrasah Putri PP NU Darussalam', waktuTimestamp: '19 Nov 2026 17:57 WIB', wajahCocok: true, verifikasiAtasan: 'Terverifikasi', sumberAbsen: 'GPS Mobile' },
];

/**
 * Master Konfigurasi Imtihan (Denah, Ruangan, Peserta Susulan, Kartu, & Tanggal Pelaksanaan)
 */
export interface ImtihanRoomConfig {
  id: string;
  kode: string;
  nama: string;
  lokasi: string;
  gedung?: string;
  lantai?: 1 | 2 | 3;
  gender: 'L' | 'P';
  baris: number;
  kolom: number;
}

export interface ImtihanMasterConfig {
  cawu: '1' | '2';
  tahunAjaran: string;
  tahunHijriyahArab: string;
  tanggalPelaksanaan: string;
  waktuUjian: string;
  ketuaImtihanNama: string;
  ketuaImtihanTtdUrl?: string;
  jumlahPutraAktif: number;
  jumlahPutriAktif: number;
  pesertaSusulanIds: string[];
  roomConfigs: ImtihanRoomConfig[];
}

export const DEFAULT_IMTIHAN_MASTER: ImtihanMasterConfig = {
  cawu: '1',
  tahunAjaran: '2026/2027',
  tahunHijriyahArab: '١٤٤٧ - ١٤٤٨ هـ',
  tanggalPelaksanaan: '6 s.d. 9 Desember 2026',
  waktuUjian: '18.30 - 21.00 WIB',
  ketuaImtihanNama: 'Ust. Nidhomul Muna Lana',
  jumlahPutraAktif: 160,
  jumlahPutriAktif: 206,
  pesertaSusulanIds: [],
  roomConfigs: [
    { id: 'ruang-1', kode: 'R1', nama: 'Ruang 01 (Putra)', lokasi: 'Aula Utama Lt. 1', gedung: 'Gedung Madrasah Utama (GD-A)', lantai: 1, gender: 'L', baris: 5, kolom: 4 },
    { id: 'ruang-2', kode: 'R2', nama: 'Ruang 02 (Putra)', lokasi: 'Kelas 2 A PUTRA', gedung: 'Gedung Madrasah Utama (GD-A)', lantai: 1, gender: 'L', baris: 5, kolom: 4 },
    { id: 'ruang-3', kode: 'R3', nama: 'Ruang 03 (Putra)', lokasi: 'Kelas 3 A PUTRA', gedung: 'Gedung Madrasah Utama (GD-A)', lantai: 2, gender: 'L', baris: 5, kolom: 4 },
    { id: 'ruang-4', kode: 'R4', nama: 'Ruang 04 (Putra)', lokasi: 'Serambi Masjid Timur', gedung: 'Masjid Darussalam (Pusat)', lantai: 1, gender: 'L', baris: 5, kolom: 4 },
    { id: 'ruang-5', kode: 'R5', nama: 'Ruang 05 (Putri)', lokasi: 'Aula Putri Barat', gedung: 'Gedung Madrasah & Asrama Putri (GD-C)', lantai: 1, gender: 'P', baris: 5, kolom: 5 },
    { id: 'ruang-6', kode: 'R6', nama: 'Ruang 06 (Putri)', lokasi: 'Kelas 2 A PUTRI', gedung: 'Gedung Madrasah & Asrama Putri (GD-C)', lantai: 1, gender: 'P', baris: 5, kolom: 5 },
    { id: 'ruang-7', kode: 'R7', nama: 'Ruang 07 (Putri)', lokasi: 'Kelas 3 A PUTRI', gedung: 'Gedung Madrasah & Asrama Putri (GD-C)', lantai: 2, gender: 'P', baris: 5, kolom: 5 },
  ],
};

/**
 * Jadwal Jaga Ruang & Piket Kantor Imtihan
 */
export interface JagaPiketRecord {
  id: string;
  hariTanggal: string;
  jam: string;
  tugas: 'Pengawas Ruang' | 'Piket Kantor' | 'Korektor Naskah';
  ruangAtauPos: string;
  petugasNama: string;
  catatan?: string;
}

export const SEED_JAGA_PIKET: JagaPiketRecord[] = [
  { id: 'jp-1', hariTanggal: 'Sabtu, 05 Des 2026', jam: '18.30 - 21.00', tugas: 'Pengawas Ruang', ruangAtauPos: 'R1 (Aula Utama Lt. 1)', petugasNama: 'Ust. Abdur Rahman' },
  { id: 'jp-2', hariTanggal: 'Sabtu, 05 Des 2026', jam: '18.30 - 21.00', tugas: 'Pengawas Ruang', ruangAtauPos: 'R2 (Kelas 2 A PUTRA)', petugasNama: 'Ust. Khoirul Umam' },
  { id: 'jp-3', hariTanggal: 'Sabtu, 05 Des 2026', jam: '18.30 - 21.00', tugas: 'Piket Kantor', ruangAtauPos: 'Kantor Panitia Imtihan', petugasNama: 'Ust. Nidhomul Muna Lana' },
  { id: 'jp-4', hariTanggal: 'Ahad, 06 Des 2026', jam: '18.30 - 21.00', tugas: 'Pengawas Ruang', ruangAtauPos: 'R5 (Aula Putri Barat)', petugasNama: 'Usth. Siti Maryam' },
  { id: 'jp-5', hariTanggal: 'Ahad, 06 Des 2026', jam: '18.30 - 21.00', tugas: 'Piket Kantor', ruangAtauPos: 'Kantor Panitia Imtihan', petugasNama: 'Ust. Ahmad Mujiburrohman' },
];

/**
 * Struktur Kepengurusan Putra & Putri (Sekretariat)
 */
export interface PengurusStrukturItem {
  id: string;
  komplek: 'Putra' | 'Putri';
  jabatan: string;
  nama: string;
  kamarAtauDivisi: string;
  noHP: string;
  periode: string;
}

export const SEED_PENGURUS_STRUKTUR: PengurusStrukturItem[] = [
  { id: 'png-1', komplek: 'Putra', jabatan: 'Lurah Pondok Putra', nama: 'Ust. Khoirul Umam', kamarAtauDivisi: 'Pimpinan Harian Putra', noHP: '0858-6600-8899', periode: '2026/2027' },
  { id: 'png-2', komplek: 'Putra', jabatan: 'Sekretaris Asrama Putra', nama: 'M. Rizqi Maulana', kamarAtauDivisi: 'Kantor Sekretariat Putra', noHP: '0813-4455-6677', periode: '2026/2027' },
  { id: 'png-3', komplek: 'Putra', jabatan: 'Ketua Keamanan Putra', nama: 'Ust. Bahrul Ulum', kamarAtauDivisi: 'Pos Keamanan & Ketertiban', noHP: '0857-8899-0011', periode: '2026/2027' },
  { id: 'png-4', komplek: 'Putra', jabatan: 'Wali Kamar Al-Falah 1', nama: 'Ahmad Zaki Yamani', kamarAtauDivisi: 'Al-Falah 1', noHP: '0852-1122-3344', periode: '2026/2027' },
  { id: 'png-5', komplek: 'Putri', jabatan: 'Lurah Pondok Putri', nama: 'Usth. Siti Maryam', kamarAtauDivisi: 'Pimpinan Harian Putri', noHP: '0852-9100-2233', periode: '2026/2027' },
  { id: 'png-6', komplek: 'Putri', jabatan: 'Sekretaris Asrama Putri', nama: 'Mbak Naila Karima', kamarAtauDivisi: 'Kantor Sekretariat Putri', noHP: '0857-3344-5566', periode: '2026/2027' },
  { id: 'png-7', komplek: 'Putri', jabatan: 'Koordinator Keamanan Putri', nama: 'Mbak Zuhrotun Nisa', kamarAtauDivisi: 'Komplek Fatimah', noHP: '0819-7788-9900', periode: '2026/2027' },
];

/**
 * Sarana & Prasarana (EMIS: Lahan, Gedung, Ruangan, Perlengkapan & Alat)
 */
export interface LahanItem {
  id: string;
  namaLahan: string;
  luasM2: number;
  statusKepemilikan: 'Wakaf NU' | 'Milik Yayasan' | 'Hibah';
  noSertifikat: string;
  lokasi: string;
  nilaiPerolehan?: number;
}

export interface GedungItem {
  id: string;
  kode: string;
  namaGedung: string;
  jumlahLantai: number;
  luasBangunanM2: number;
  tahunBangun: number;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Perlu Renovasi';
  nilaiPerolehan?: number;
  umurEkonomisTahun?: number;
}

export interface RuanganItem {
  id: string;
  gedungId: string;
  namaGedung: string;
  namaRuang: string;
  jenis: 'Kelas' | 'Asrama Putra' | 'Asrama Putri' | 'Kantor' | 'Aula' | 'Masjid';
  kapasitas: number;
  kondisi: 'Baik' | 'Perlu Perbaikan';
}

export interface PerlengkapanItem {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  kategori: 'Elektronik' | 'Mebel' | 'Kitab/Perpustakaan' | 'Dapur & Kebersihan';
  jumlah: number;
  satuan: string;
  lokasiRuang: string;
  kondisi: 'Layak' | 'Rusak Ringan' | 'Rusak Berat';
  hargaSatuan?: number;
  tahunPerolehan?: number;
}

export const SEED_LAHAN: LahanItem[] = [
  { id: 'lhn-1', namaLahan: 'Komplek Utama & Masjid Darussalam', luasM2: 4200, statusKepemilikan: 'Wakaf NU', noSertifikat: 'WKF-3326-00142', lokasi: 'Jl. Raya Karangdadap Km 1', nilaiPerolehan: 1890000000 },
  { id: 'lhn-2', namaLahan: 'Komplek Asrama Putri & Aula Barat', luasM2: 2850, statusKepemilikan: 'Milik Yayasan', noSertifikat: 'SHM-3326-00891', lokasi: 'Karangdadap Barat', nilaiPerolehan: 1282500000 },
];

export const SEED_GEDUNG: GedungItem[] = [
  { id: 'gdg-1', kode: 'GD-A', namaGedung: 'Gedung Madrasah Diniyah Utama', jumlahLantai: 2, luasBangunanM2: 960, tahunBangun: 2018, kondisi: 'Baik', nilaiPerolehan: 1450000000, umurEkonomisTahun: 25 },
  { id: 'gdg-2', kode: 'GD-B', namaGedung: 'Asrama Putra Al-Falah & An-Nur', jumlahLantai: 2, luasBangunanM2: 820, tahunBangun: 2016, kondisi: 'Baik', nilaiPerolehan: 1120000000, umurEkonomisTahun: 25 },
  { id: 'gdg-3', kode: 'GD-C', namaGedung: 'Asrama Putri Fatimah & Aisyah', jumlahLantai: 2, luasBangunanM2: 900, tahunBangun: 2021, kondisi: 'Baik', nilaiPerolehan: 1380000000, umurEkonomisTahun: 25 },
];

export const SEED_RUANGAN: RuanganItem[] = [
  { id: 'rng-1', gedungId: 'gdg-1', namaGedung: 'Gedung Madrasah Diniyah Utama', namaRuang: 'Aula Utama Lt. 1', jenis: 'Aula', kapasitas: 180, kondisi: 'Baik' },
  { id: 'rng-2', gedungId: 'gdg-1', namaGedung: 'Gedung Madrasah Diniyah Utama', namaRuang: 'Kelas 2 A PUTRA', jenis: 'Kelas', kapasitas: 35, kondisi: 'Baik' },
  { id: 'rng-3', gedungId: 'gdg-2', namaGedung: 'Asrama Putra Al-Falah & An-Nur', namaRuang: 'Kamar Al-Falah 1', jenis: 'Asrama Putra', kapasitas: 20, kondisi: 'Baik' },
  { id: 'rng-4', gedungId: 'gdg-3', namaGedung: 'Asrama Putri Fatimah & Aisyah', namaRuang: 'Kamar Fatimah 1', jenis: 'Asrama Putri', kapasitas: 22, kondisi: 'Baik' },
];

export const SEED_PERLENGKAPAN: PerlengkapanItem[] = [
  { id: 'prl-1', kodeBarang: 'INV-001', namaBarang: 'Meja Belajar Kayu Lipat', kategori: 'Mebel', jumlah: 180, satuan: 'Unit', lokasiRuang: 'Gedung Madrasah Diniyah Utama', kondisi: 'Layak', hargaSatuan: 275000, tahunPerolehan: 2023 },
  { id: 'prl-2', kodeBarang: 'INV-002', namaBarang: 'Proyektor LCD & Layar Presentasi', kategori: 'Elektronik', jumlah: 3, satuan: 'Set', lokasiRuang: 'Aula Utama Lt. 1', kondisi: 'Layak', hargaSatuan: 6500000, tahunPerolehan: 2024 },
  { id: 'prl-3', kodeBarang: 'INV-003', namaBarang: 'Sound System Masjid & Aula', kategori: 'Elektronik', jumlah: 2, satuan: 'Set', lokasiRuang: 'Masjid Darussalam', kondisi: 'Layak', hargaSatuan: 12500000, tahunPerolehan: 2023 },
  { id: 'prl-4', kodeBarang: 'INV-004', namaBarang: 'Kitab Referensi Maktabah (Kutubus Sittah & Fathul Qorib)', kategori: 'Kitab/Perpustakaan', jumlah: 120, satuan: 'Jilid', lokasiRuang: 'Perpustakaan Pondok', kondisi: 'Layak', hargaSatuan: 185000, tahunPerolehan: 2024 },
];

/**
 * Buku Kas Masuk / Keluar (Bendahara)
 */
export interface KasTransaction {
  id: string;
  tanggal: string;
  tipe: 'Masuk' | 'Keluar';
  kategori: string;
  uraian: string;
  nominal: number;
  penanggungJawab: string;
  kodeAkun?: string;
  namaAkun?: string;
  noSumber?: string;
  tipeSumber?: string;
}

export const SEED_KAS_TRANSACTIONS: KasTransaction[] = [
  { id: 'kas-1', tanggal: '2026-11-01', tipe: 'Masuk', kategori: 'Syahriyah Santri', uraian: 'Penerimaan Syahriyah Bulanan (350 Santri)', nominal: 52500000, penanggungJawab: 'M. Abdul Fataah', kodeAkun: '4001.01', namaAkun: 'Pendapatan Syahriyah Bulanan', noSumber: 'BKM-2401', tipeSumber: 'Penerimaan' },
  { id: 'kas-2', tanggal: '2026-11-02', tipe: 'Masuk', kategori: 'Daftar Ulang', uraian: 'Pelunasan Daftar Ulang Santri Baru & Lama Tahap 2', nominal: 18400000, penanggungJawab: 'M. Abdul Fataah', kodeAkun: '4001.02', namaAkun: 'Pendapatan Daftar Ulang', noSumber: 'BKM-2402', tipeSumber: 'Penerimaan' },
  { id: 'kas-3', tanggal: '2026-11-03', tipe: 'Keluar', kategori: 'Konsumsi & Dapur', uraian: 'Belanja Beras & Lauk Pauk Santri Pekan 1', nominal: 11200000, penanggungJawab: 'M. Abdul Fataah', kodeAkun: '5101.01', namaAkun: 'Biaya Konsumsi & Dapur Santri', noSumber: 'BKK-2381', tipeSumber: 'Pembayaran' },
  { id: 'kas-4', tanggal: '2026-11-05', tipe: 'Masuk', kategori: 'Iuran Imtihan', uraian: 'Setoran Iuran Imtihan 1 (360 Santri × 30rb)', nominal: 10800000, penanggungJawab: 'Ust. Nidhomul Muna Lana', kodeAkun: '4001.03', namaAkun: 'Pendapatan Iuran Imtihan', noSumber: 'BKM-2403', tipeSumber: 'Penerimaan' },
  { id: 'kas-5', tanggal: '2026-11-06', tipe: 'Masuk', kategori: "Agenda Kema'hadiyahan", uraian: 'Setoran Iuran Peringatan Hari Santri & Haflah', nominal: 9250000, penanggungJawab: 'Ust. Khoirul Umam', kodeAkun: '4001.04', namaAkun: "Pendapatan Agenda Kema'hadiyahan", noSumber: 'BKM-2404', tipeSumber: 'Penerimaan' },
  { id: 'kas-6', tanggal: '2026-11-08', tipe: 'Keluar', kategori: 'Bisyaroh Asatidz', uraian: 'Pencairan Honor Mengajar Dewan Asatidz Bulan Nov', nominal: 18500000, penanggungJawab: 'M. Abdul Fataah', kodeAkun: '6101.01', namaAkun: 'Gaji & Bisyaroh Asatidz', noSumber: 'BKK-2385', tipeSumber: 'Pembayaran' },
  { id: 'kas-7', tanggal: '2026-11-09', tipe: 'Keluar', kategori: 'Operasional Listrik & Air', uraian: 'Token Listrik Gedung Madin ID 524510945680', nominal: 1665500, penanggungJawab: 'M. Abdul Fataah', kodeAkun: '6203.01', namaAkun: 'Biaya Listrik, Air & Utilitas', noSumber: 'BKK-2387', tipeSumber: 'Pembayaran' },
  { id: 'kas-8', tanggal: '2026-11-12', tipe: 'Keluar', kategori: 'Operasional Listrik & Air', uraian: 'Pembayaran Tagihan Listrik PLN & PDAM Asrama Putri', nominal: 3450000, penanggungJawab: 'M. Abdul Fataah', kodeAkun: '6203.01', namaAkun: 'Biaya Listrik, Air & Utilitas', noSumber: 'BKK-2404', tipeSumber: 'Pembayaran' },
  { id: 'kas-9', tanggal: '2026-11-14', tipe: 'Keluar', kategori: 'Pemeliharaan Aset', uraian: 'Perbaikan Atap & Pengecatan Ruang Kelas R1-R4', nominal: 4250000, penanggungJawab: 'M. Abdul Fataah', kodeAkun: '6204.01', namaAkun: 'Biaya Pemeliharaan Gedung & Alat', noSumber: 'BKK-2412', tipeSumber: 'Pembayaran' },
  { id: 'kas-10', tanggal: '2026-11-16', tipe: 'Keluar', kategori: 'Pembelian Aset Tetap', uraian: 'Pengadaan Kipas Dinding & Meja Belajar Tambahan', nominal: 6800000, penanggungJawab: 'M. Abdul Fataah', kodeAkun: '1203.01', namaAkun: 'Peralatan & Inventaris Sarpras', noSumber: 'BKK-2418', tipeSumber: 'Pembelian Aset' },
  { id: 'kas-11', tanggal: '2026-11-18', tipe: 'Keluar', kategori: 'Konsumsi & Dapur', uraian: 'Belanja Dapur Santri & Air Minum Galon Pekan 3', nominal: 11850000, penanggungJawab: 'M. Abdul Fataah', kodeAkun: '5101.01', namaAkun: 'Biaya Konsumsi & Dapur Santri', noSumber: 'BKK-2422', tipeSumber: 'Pembayaran' },
  { id: 'kas-12', tanggal: '2026-11-20', tipe: 'Keluar', kategori: "Biaya Agenda Kema'hadiyahan", uraian: 'Pelunasan Konsumsi & Perlengkapan Imtihan Awal', nominal: 5400000, penanggungJawab: 'Ust. Nidhomul Muna Lana', kodeAkun: '6202.01', namaAkun: "Biaya Operasional & Kegiatan Pondok", noSumber: 'BKK-2429', tipeSumber: 'Pembayaran' },
];

/**
 * Agenda PHBI / PHBN (Kema'hadiyahan)
 */
export interface AgendaPanitiaMember {
  id: string;
  jabatan: string;
  nama: string;
  tugasTupoksi: string;
}

export interface AgendaRabItem {
  id: string;
  uraian: string;
  qty: number;
  satuan: string;
  hargaSatuan: number;
}

export interface AgendaRundownItem {
  id: string;
  waktu: string;
  sesi: string;
  penanggungJawab: string;
  lokasi: string;
}

export interface AgendaProposalData {
  latarBelakang: string;
  tujuan: string;
  status: 'Draf' | 'Diajukan' | 'Disetujui';
}

export interface AgendaLpjData {
  ringkasanHasil: string;
  totalRealisasi: number;
  kendala: string;
  status: 'Belum Disusun' | 'Draf' | 'Disahkan';
}

export interface AgendaKegiatanItem {
  id: string;
  nama: string;
  tanggal: string;
  lokasi: string;
  ketuaPanitia: string;
  anggaran: number;
  status: 'Persiapan' | 'Berjalan' | 'Selesai';
  keterangan?: string;
  sumberKalenderKode?: string;
  panitiaList?: AgendaPanitiaMember[];
  rabItems?: AgendaRabItem[];
  rundownList?: AgendaRundownItem[];
  proposal?: AgendaProposalData;
  lpj?: AgendaLpjData;
}

export const SEED_AGENDA_KEGIATAN: AgendaKegiatanItem[] = [
  {
    id: 'agk-1',
    nama: 'Peringatan Hari Santri Nasional (HSN 2026)',
    tanggal: '2026-10-22',
    lokasi: 'Halaman Utama PP NU Darussalam',
    ketuaPanitia: 'Ust. Khoirul Umam',
    anggaran: 27500000,
    status: 'Selesai',
    keterangan: 'Upacara bendera, kirab santri, dan bahtsul masail.',
    sumberKalenderKode: 'LHS',
    panitiaList: [
      { id: 'pan-1', jabatan: 'Ketua Panitia', nama: 'Ust. Khoirul Umam', tugasTupoksi: 'Mengkoordinir seluruh seksi kegiatan HSN dan laporan pertanggungjawaban ke Pengasuh.' },
      { id: 'pan-2', jabatan: 'Sekretaris', nama: 'Ust. Ahmad Mujiburrohman', tugasTupoksi: 'Menyusun surat undangan, perizinan kirab, serta proposal & LPJ kegiatan.' },
      { id: 'pan-3', jabatan: 'Bendahara Acara', nama: 'M. Abdul Fataah', tugasTupoksi: 'Mengelola pencairan RAB, nota belanja, dan laporan realisasi keuangan.' },
    ],
    rabItems: [
      { id: 'arab-1', uraian: 'Dekorasi Panggung, Banner & Sound System', qty: 1, satuan: 'Paket', hargaSatuan: 8500000 },
      { id: 'arab-2', uraian: 'Konsumsi Santri, Asatidz & Tamu Undangan', qty: 450, satuan: 'Porsi', hargaSatuan: 25000 },
      { id: 'arab-3', uraian: 'Hadiah Lomba Bahtsul Masail & Hadroh', qty: 1, satuan: 'Paket', hargaSatuan: 7750000 },
    ],
    rundownList: [
      { id: 'rnd-1', waktu: '07.00 - 08.30', sesi: 'Upacara Hari Santri Nasional', penanggungJawab: 'Ust. Khoirul Umam', lokasi: 'Lapangan Utama' },
      { id: 'rnd-2', waktu: '08.30 - 11.00', sesi: 'Kirab Santri & Penampilan Hadroh', penanggungJawab: 'Ust. Bahrul Ulum', lokasi: 'Kec. Karangdadap' },
      { id: 'rnd-3', waktu: '19.30 - 22.00', sesi: 'Bahtsul Masail Kubro & Doa Kebangsaan', penanggungJawab: 'Ust. Syarif Hidayatullah', lokasi: 'Masjid Darussalam' },
    ],
    proposal: {
      latarBelakang: 'Meneguhkan komitmen santri dalam menjaga tradisi Aswaja an-Nahdliyah dan kecintaan tanah air.',
      tujuan: 'Membangun semangat khidmah santri serta mempererat ukhuwah bersama masyarakat Karangdadap.',
      status: 'Disetujui',
    },
    lpj: {
      ringkasanHasil: 'Seluruh rangkaian upacara, kirab, dan bahtsul masail diikuti 366 santri dengan tertib dan lancar.',
      totalRealisasi: 26850000,
      kendala: 'Hujan rintik menjelang sesi malam sehingga acara dipindah ke dalam serambi masjid.',
      status: 'Disahkan',
    },
  },
  {
    id: 'agk-2',
    nama: 'Imtihan Semester Gasal 2026/2027',
    tanggal: '2026-12-12',
    lokasi: 'Ruang Ujian R1 - R7',
    ketuaPanitia: 'Ust. Nidhomul Muna Lana',
    anggaran: 10800000,
    status: 'Berjalan',
    keterangan: 'Ujian tulis pegon/Arab dan hafalan nadhom.',
    sumberKalenderKode: 'IMT 1',
    panitiaList: [
      { id: 'pan-4', jabatan: 'Ketua Panitia Imtihan', nama: 'Ust. Nidhomul Muna Lana', tugasTupoksi: 'Mengatur jadwal ujian, verifikasi naskah soal Pegon/Arab, dan tata tertib pengawas.' },
      { id: 'pan-5', jabatan: 'Bendahara Imtihan', nama: 'M. Abdul Fataah', tugasTupoksi: 'Menghimpun iuran imtihan dan mendistribusikan bisyaroh pengawas serta korektor.' },
    ],
    rabItems: [
      { id: 'arab-4', uraian: 'Penggandaan Blanko Soal & Kartu Imtihan (366 Santri)', qty: 1, satuan: 'Paket', hargaSatuan: 3800000 },
      { id: 'arab-5', uraian: 'Bisyaroh Pengawas Ruang & Koreksi Soal', qty: 35, satuan: 'Orang', hargaSatuan: 200000 },
    ],
    rundownList: [
      { id: 'rnd-4', waktu: '18.15 - 18.30', sesi: 'Apel Pengawas & Pengambilan Amplop Soal', penanggungJawab: 'Ust. Nidhomul Muna Lana', lokasi: 'Kantor Panitia' },
      { id: 'rnd-5', waktu: '18.30 - 21.00', sesi: 'Pelaksanaan Ujian Sesi I & II', penanggungJawab: 'Pengawas R1 - R7', lokasi: 'Ruang Ujian R1 - R7' },
    ],
    proposal: {
      latarBelakang: 'Evaluasi kemampuan penguasaan kitab kuning santri selama Cawu/Semester Gasal 2026/2027.',
      tujuan: 'Mengukur capaian belajar serta menentukan kesiapan kenaikan/raport santri secara objektif.',
      status: 'Disetujui',
    },
    lpj: { ringkasanHasil: '', totalRealisasi: 0, kendala: '', status: 'Belum Disusun' },
  },
  {
    id: 'agk-3',
    nama: "Peringatan Isra' Mi'raj 1448 H & Haflah Khotmil Kutub",
    tanggal: '2027-01-06',
    lokasi: 'Masjid & Halaman Pondok',
    ketuaPanitia: 'Ust. Ahmad Mujiburrohman',
    anggaran: 18000000,
    status: 'Persiapan',
    keterangan: 'Pengajian akbar bersama wali santri dan masyarakat.',
    sumberKalenderKode: 'ISR',
    panitiaList: [
      { id: 'pan-6', jabatan: 'Ketua Panitia', nama: 'Ust. Ahmad Mujiburrohman', tugasTupoksi: 'Koordinasi pengisi mauidhoh hasanah, khotimin, dan seksi acara.' },
      { id: 'pan-7', jabatan: 'Sie Keamanan & Parkir', nama: 'Ust. Bahrul Ulum', tugasTupoksi: 'Mengatur kelancaran lalu lintas tamu undangan dan wali santri.' },
    ],
    rabItems: [
      { id: 'arab-6', uraian: 'Tenda Tamu, Panggung & Lighting', qty: 1, satuan: 'Paket', hargaSatuan: 7500000 },
      { id: 'arab-7', uraian: 'Konsumsi Wali Santri & Masyarakat', qty: 700, satuan: 'Kotak', hargaSatuan: 15000 },
    ],
    rundownList: [
      { id: 'rnd-6', waktu: '19.30 - 20.15', sesi: 'Pembacaan Maulid Simtudduror & Hadroh', penanggungJawab: 'Tim Hadroh Pondok', lokasi: 'Halaman Utama' },
      { id: 'rnd-7', waktu: '20.15 - 22.30', sesi: 'Imtihan Publik Khotmil Kutub & Mauidhoh Hasanah', penanggungJawab: 'KH. Amin Maizun', lokasi: 'Panggung Utama' },
    ],
    proposal: {
      latarBelakang: "Menghidupkan syiar peringatan Isra' Mi'raj Nabi Muhammad SAW serta apresiasi khataman kitab santri.",
      tujuan: 'Menguatkan silaturahmi pesantren dengan wali santri dan masyarakat luas.',
      status: 'Diajukan',
    },
    lpj: { ringkasanHasil: '', totalRealisasi: 0, kendala: '', status: 'Belum Disusun' },
  },
];

/**
 * Jadwal Keamanan, Buku Tamu, dan Titipan Wali Santri (BK & Keamanan)
 */
export interface JadwalKeamananItem {
  id: string;
  hari: string;
  shift: 'Malam (22.00 - 04.00)' | 'Pagi (07.00 - 14.00)' | 'Sore (14.00 - 21.00)';
  pos: string;
  petugas: string;
  koordinator: string;
}

export interface BukuTamuRecord {
  id: string;
  waktu: string;
  namaTamu: string;
  asalInstansi: string;
  santriTujuan?: string;
  keperluan: string;
  petugasJaga: string;
}

export interface TitipanWaliRecord {
  id: string;
  tanggal: string;
  santriId: string;
  santriNama: string;
  kelas: string;
  kamar: string;
  pengirimWali: string;
  jenisTitipan: string;
  nominalUang?: number;
  fotoUrl?: string;
  status: 'Diterima Pos Keamanan' | 'Diserahkan ke Wali Kamar' | 'Diterima Santri';
  petugasPos: string;
}

export const SEED_JADWAL_KEAMANAN: JadwalKeamananItem[] = [
  { id: 'jk-1', hari: 'Senin - Selasa', shift: 'Pagi (07.00 - 14.00)', pos: 'Pos Gerbang Utama & Buku Tamu', petugas: 'Pak Riyadi', koordinator: 'Ust. Bahrul Ulum' },
  { id: 'jk-2', hari: 'Senin - Selasa', shift: 'Sore (14.00 - 21.00)', pos: 'Pos Penjengukan Wali & Komplek Putri', petugas: 'Pak Suwarno', koordinator: 'Ust. Bahrul Ulum' },
  { id: 'jk-3', hari: 'Senin - Selasa', shift: 'Malam (22.00 - 04.00)', pos: 'Patroli Asrama Putra & Gerbang Utama', petugas: 'Pak Sopoyono', koordinator: 'Ust. Bahrul Ulum' },
  { id: 'jk-4', hari: 'Rabu - Kamis', shift: 'Pagi (07.00 - 14.00)', pos: 'Pos Gerbang Utama & Buku Tamu', petugas: 'Pak Suwarno', koordinator: 'Ust. Bahrul Ulum' },
  { id: 'jk-5', hari: 'Jum\'at - Ahad', shift: 'Sore (14.00 - 21.00)', pos: 'Pos Penjengukan Wali Santri', petugas: 'Pak Riyadi & Pak Sopoyono', koordinator: 'Ust. Khoirul Umam' },
];

export const SEED_BUKU_TAMU: BukuTamuRecord[] = [
  { id: 'bt-1', waktu: '2026-11-09 09:30', namaTamu: 'Bpk. H. Mustofa', asalInstansi: 'Wonopringgo, Pekalongan', santriTujuan: 'MUHAMMAD ZIDNI ALBI FALAKHI', keperluan: 'Menjenguk putra & menitipkan paket perlengkapan', petugasJaga: 'Pak Slamet' },
  { id: 'bt-2', waktu: '2026-11-09 11:15', namaTamu: 'Petugas Puskesmas Karangdadap', asalInstansi: 'Dinas Kesehatan Kab. Pekalongan', keperluan: 'Pemeriksaan kesehatan rutin santri (Poskestren)', petugasJaga: 'Pak Slamet' },
  { id: 'bt-3', waktu: '2026-11-08 19:45', namaTamu: 'K.H. Subhan', asalInstansi: 'Kajen, Pekalongan', keperluan: 'Sowan silaturrahim kepada Pengasuh KH. Amin Maizun', petugasJaga: 'Ust. Bahrul Ulum' },
];

export const SEED_TITIPAN_WALI: TitipanWaliRecord[] = [
  {
    id: 'tw-1',
    tanggal: '2026-11-09 09:35',
    santriId: 's-001',
    santriNama: 'MUHAMMAD ZIDNI ALBI FALAKHI',
    kelas: '2 A PUTRA',
    kamar: 'Al-Falah 1',
    pengirimWali: 'Bpk. H. Mustofa',
    jenisTitipan: 'Kitab Matan Taqrib baru, sarung BHS, & camilan kering',
    nominalUang: 50000,
    fotoUrl: '/assets/aistudio/preview__14__3b7f388f.webp',
    status: 'Diterima Santri',
    petugasPos: 'Pak Slamet',
  },
  {
    id: 'tw-2',
    tanggal: '2026-11-09 14:20',
    santriId: 's-002',
    santriNama: 'AHMAD SYAUQI MAHFUDZ',
    kelas: '2 A PUTRA',
    kamar: 'Al-Falah 2',
    pengirimWali: 'Ibu Hj. Fatimah',
    jenisTitipan: 'Obat vitamin, jas hujan, dan peci hitam',
    status: 'Diserahkan ke Wali Kamar',
    petugasPos: 'Ust. Bahrul Ulum',
  },
];

/**
 * Ledger Independen Santri & Tagihan Bendahara
 * (Terpisah/snapshot dari Sekretaris agar tanggungan santri Boyong / Keluar tetap tercatat meski dihapus di Sekretaris)
 */
export type KategoriTagihanSantri =
  | 'Syahriyah Bulanan'
  | 'Daftar Ulang'
  | "Agenda Kema'hadiyahan"
  | 'Lainnya';

export interface BendaharaSantriProfile {
  id: string;
  refSantriId?: string;
  nis: string;
  nama: string;
  gender: 'L' | 'P';
  kelas: string;
  kamar: string;
  namaWali: string;
  hpWali: string;
  statusPondok: 'Aktif' | 'Boyong / Keluar' | 'Lulus / Alumni';
  sumberData: 'Sekretaris' | 'Manual Bendahara';
  terhapusDiSekretaris?: boolean;
  catatanKeuangan?: string;
}

export interface TagihanSantriRiwayatBayar {
  id: string;
  tanggal: string;
  nominal: number;
  metode: string;
  petugas: string;
  catatan?: string;
}

export interface TagihanSantriItem {
  id: string;
  ledgerId: string;
  kategori: KategoriTagihanSantri;
  judulTagihan: string;
  periode: string;
  agendaId?: string;
  nominalTagihan: number;
  nominalTerbayar: number;
  status: 'Belum Lunas' | 'Cicilan' | 'Lunas';
  jatuhTempo: string;
  tanggalBayarTerakhir?: string;
  metodeTerakhir?: string;
  riwayatBayar: TagihanSantriRiwayatBayar[];
}

const initialActiveLedgers: BendaharaSantriProfile[] = SEED_SANTRI_LIST.slice(0, 12).map((s) => ({
  id: `bs-${s.id}`,
  refSantriId: s.id,
  nis: s.nis,
  nama: s.nama,
  gender: s.gender,
  kelas: s.kelas,
  kamar: s.kamar,
  namaWali: s.namaWali,
  hpWali: s.hpWali,
  statusPondok: 'Aktif',
  sumberData: 'Sekretaris',
  terhapusDiSekretaris: false,
}));

const boyongSeedLedgers: BendaharaSantriProfile[] = [
  {
    id: 'bs-boyong-1',
    nis: '23.0942',
    nama: 'MUHAMMAD FAIZAL AKBAR',
    gender: 'L',
    kelas: '3 A PUTRA',
    kamar: 'An-Nur 2',
    namaWali: 'Bpk. H. Ahmad Fauzi',
    hpWali: '081326778890',
    statusPondok: 'Boyong / Keluar',
    sumberData: 'Manual Bendahara',
    terhapusDiSekretaris: true,
    catatanKeuangan: 'Sudah boyong Oktober 2026 namun masih memiliki tunggakan Syahriyah 2 bulan & Daftar Ulang.',
  },
  {
    id: 'bs-boyong-2',
    nis: '24.1188',
    nama: 'SITI MARWAH KHAIRUNNISA',
    gender: 'P',
    kelas: '2 B PUTRI',
    kamar: 'Aisyah 3',
    namaWali: 'Ibu Siti Aminah',
    hpWali: '085741223344',
    statusPondok: 'Boyong / Keluar',
    sumberData: 'Sekretaris',
    terhapusDiSekretaris: true,
    catatanKeuangan: 'Keluar sementara karena pindah domisili; tanggungan Agenda HSN & Syahriyah masih dicicil.',
  },
];

export const SEED_BENDAHARA_SANTRI: BendaharaSantriProfile[] = [
  ...initialActiveLedgers,
  ...boyongSeedLedgers,
];

export const SEED_TAGIHAN_SANTRI: TagihanSantriItem[] = (() => {
  const items: TagihanSantriItem[] = [];
  initialActiveLedgers.forEach((bs, idx) => {
    const isPaidNov = idx % 3 === 0;
    const isPartialNov = idx % 3 === 1;
    items.push({
      id: `tag-syh-nov-${bs.id}`,
      ledgerId: bs.id,
      kategori: 'Syahriyah Bulanan',
      judulTagihan: 'Syahriyah Bulan November 2026',
      periode: 'November 2026',
      nominalTagihan: 150000,
      nominalTerbayar: isPaidNov ? 150000 : isPartialNov ? 75000 : 0,
      status: isPaidNov ? 'Lunas' : isPartialNov ? 'Cicilan' : 'Belum Lunas',
      jatuhTempo: '2026-11-10',
      tanggalBayarTerakhir: isPaidNov || isPartialNov ? '2026-11-05' : undefined,
      metodeTerakhir: isPaidNov || isPartialNov ? 'Transfer BSI' : undefined,
      riwayatBayar: isPaidNov
        ? [{ id: `rb-${bs.id}-1`, tanggal: '2026-11-05', nominal: 150000, metode: 'Transfer BSI', petugas: 'M. Abdul Fataah', catatan: 'Lunas via VA BSI' }]
        : isPartialNov
        ? [{ id: `rb-${bs.id}-1`, tanggal: '2026-11-05', nominal: 75000, metode: 'Tunai Loket', petugas: 'M. Abdul Fataah', catatan: 'Cicilan tahap 1' }]
        : [],
    });

    const isPaidDu = idx % 2 === 0;
    items.push({
      id: `tag-du-26-${bs.id}`,
      ledgerId: bs.id,
      kategori: 'Daftar Ulang',
      judulTagihan: 'Daftar Ulang & Buku Wajib T.A. 2026/2027',
      periode: 'T.A. 2026/2027',
      nominalTagihan: 450000,
      nominalTerbayar: isPaidDu ? 450000 : 250000,
      status: isPaidDu ? 'Lunas' : 'Cicilan',
      jatuhTempo: '2026-07-31',
      tanggalBayarTerakhir: '2026-07-20',
      metodeTerakhir: 'Tunai Loket',
      riwayatBayar: [
        {
          id: `rb-du-${bs.id}`,
          tanggal: '2026-07-20',
          nominal: isPaidDu ? 450000 : 250000,
          metode: 'Tunai Loket',
          petugas: 'M. Abdul Fataah',
        },
      ],
    });

    items.push({
      id: `tag-agk-imt-${bs.id}`,
      ledgerId: bs.id,
      kategori: "Agenda Kema'hadiyahan",
      judulTagihan: 'Iuran Imtihan Semester Gasal 2026/2027',
      periode: 'Desember 2026',
      agendaId: 'agk-2',
      nominalTagihan: 30000,
      nominalTerbayar: idx < 5 ? 30000 : 0,
      status: idx < 5 ? 'Lunas' : 'Belum Lunas',
      jatuhTempo: '2026-12-05',
      tanggalBayarTerakhir: idx < 5 ? '2026-11-05' : undefined,
      metodeTerakhir: idx < 5 ? 'Tunai Loket' : undefined,
      riwayatBayar:
        idx < 5
          ? [{ id: `rb-agk-${bs.id}`, tanggal: '2026-11-05', nominal: 30000, metode: 'Tunai Loket', petugas: 'Ust. Nidhomul Muna Lana' }]
          : [],
    });
  });

  // Tunggakan Santri Boyong / Keluar yang tetap terjaga
  items.push(
    {
      id: 'tag-boyong-1a',
      ledgerId: 'bs-boyong-1',
      kategori: 'Syahriyah Bulanan',
      judulTagihan: 'Tunggakan Syahriyah Sep - Okt 2026 (2 Bulan)',
      periode: 'Sep - Okt 2026',
      nominalTagihan: 300000,
      nominalTerbayar: 0,
      status: 'Belum Lunas',
      jatuhTempo: '2026-10-10',
      riwayatBayar: [],
    },
    {
      id: 'tag-boyong-1b',
      ledgerId: 'bs-boyong-1',
      kategori: 'Daftar Ulang',
      judulTagihan: 'Sisa Daftar Ulang T.A. 2026/2027',
      periode: 'T.A. 2026/2027',
      nominalTagihan: 450000,
      nominalTerbayar: 200000,
      status: 'Cicilan',
      jatuhTempo: '2026-08-15',
      tanggalBayarTerakhir: '2026-08-10',
      metodeTerakhir: 'Tunai Loket',
      riwayatBayar: [{ id: 'rb-by-1b', tanggal: '2026-08-10', nominal: 200000, metode: 'Tunai Loket', petugas: 'M. Abdul Fataah', catatan: 'DP awal' }],
    },
    {
      id: 'tag-boyong-2a',
      ledgerId: 'bs-boyong-2',
      kategori: "Agenda Kema'hadiyahan",
      judulTagihan: 'Iuran Peringatan Hari Santri Nasional (HSN 2026)',
      periode: 'Oktober 2026',
      agendaId: 'agk-1',
      nominalTagihan: 75000,
      nominalTerbayar: 25000,
      status: 'Cicilan',
      jatuhTempo: '2026-10-20',
      tanggalBayarTerakhir: '2026-10-18',
      metodeTerakhir: 'Transfer QRIS',
      riwayatBayar: [{ id: 'rb-by-2a', tanggal: '2026-10-18', nominal: 25000, metode: 'Transfer QRIS', petugas: 'M. Abdul Fataah' }],
    }
  );

  return items;
})();

/**
 * Modul Absensi Mobile & Monitoring Satpam (Riyadi, Suwarno, Sopoyono)
 */
export interface SatpamProfile {
  id: string;
  userId: string;
  nama: string;
  jabatan: string;
  posUtama: string;
  noWa: string;
  shiftDefaultId: string;
}

export interface SatpamShiftConfig {
  id: string;
  nama: string;
  pos: string;
  jamMulai: string;
  jamSelesai: string;
  toleransiMenit: number;
  aktif: boolean;
}

export interface SatpamAbsensiRecord {
  id: string;
  tanggal: string;
  satpamId: string;
  satpamNama: string;
  shiftId?: string;
  shiftNama: string;
  posJaga: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Tukar Shift';
  pengganti?: string;
  waktuInput: string;
  waktuCekOut?: string;
  durasiKerja?: string;
  statusKeterlambatan?: 'Tepat Waktu' | 'Terlambat';
  menitTerlambat?: number;
  fotoSelfieUrl?: string;
  fotoCekOutUrl?: string;
  koordinat?: string;
  akurasiGps?: number;
  lokasiLabel?: string;
  waktuTimestamp?: string;
  wajahCocok?: boolean;
  verifikasiAtasan?: 'Terverifikasi' | 'Menunggu';
  sumberAbsen?: 'GPS Mobile' | 'Absen Pengajuan' | 'Input Manual';
  catatanPengajuan?: string;
}

export interface SatpamPengajuanRequest {
  id: string;
  satpamId: string;
  satpamNama: string;
  tanggal: string;
  jenis: 'Absen Pengajuan' | 'Izin' | 'Sakit' | 'Tukar Shift';
  shiftId?: string;
  shiftNama: string;
  posJaga: string;
  jamMulaiDiajukan?: string;
  jamSelesaiDiajukan?: string;
  kendalaKategori?: string;
  buktiFotoUrl?: string;
  penggantiNama?: string;
  alasan: string;
  status: 'Menunggu' | 'Disetujui' | 'Ditolak';
  disetujuiOleh?: string;
  waktuPengajuan: string;
}

export const SEED_SATPAM_LIST: SatpamProfile[] = [
  {
    id: 'satpam-riyadi',
    userId: 'u-satpam-riyadi',
    nama: 'Pak Riyadi',
    jabatan: 'Komandan Regu Satpam',
    posUtama: 'Pos Gerbang Utama Putra',
    noWa: '085711220001',
    shiftDefaultId: 'satpam-shift-pagi',
  },
  {
    id: 'satpam-suwarno',
    userId: 'u-satpam-suwarno',
    nama: 'Pak Suwarno',
    jabatan: 'Anggota Satpam Jaga',
    posUtama: 'Pos Penjengukan & Gerbang',
    noWa: '085711220002',
    shiftDefaultId: 'satpam-shift-sore',
  },
  {
    id: 'satpam-sopoyono',
    userId: 'u-satpam-sopoyono',
    nama: 'Pak Sopoyono',
    jabatan: 'Anggota Satpam Patroli',
    posUtama: 'Pos Patroli Asrama & Komplek Putri',
    noWa: '085711220003',
    shiftDefaultId: 'satpam-shift-malam',
  },
];

export const SEED_SATPAM_SHIFTS: SatpamShiftConfig[] = [
  {
    id: 'satpam-shift-pagi',
    nama: 'Shift Pagi — Gerbang Utama',
    pos: 'Pos Gerbang Utama PP NU Darussalam',
    jamMulai: '07:00',
    jamSelesai: '15:00',
    toleransiMenit: 10,
    aktif: true,
  },
  {
    id: 'satpam-shift-sore',
    nama: 'Shift Sore — Penjengukan Wali',
    pos: 'Pos Penjengukan & Pintu Masuk',
    jamMulai: '15:00',
    jamSelesai: '23:00',
    toleransiMenit: 10,
    aktif: true,
  },
  {
    id: 'satpam-shift-malam',
    nama: 'Shift Malam — Patroli Komplek',
    pos: 'Keliling Asrama Putra & Putri',
    jamMulai: '23:00',
    jamSelesai: '07:00',
    toleransiMenit: 10,
    aktif: true,
  },
  {
    id: 'satpam-slot-ronda-1jam',
    nama: 'Slot Kontrol Ronda Malam (1 Jam)',
    pos: 'Pos Gerbang, Masjid & Asrama',
    jamMulai: '01:00',
    jamSelesai: '02:00',
    toleransiMenit: 5,
    aktif: true,
  },
];

export const SEED_SATPAM_ABSENSI: SatpamAbsensiRecord[] = [
  {
    id: 'sa-1',
    tanggal: '2026-11-20',
    satpamId: 'satpam-riyadi',
    satpamNama: 'Pak Riyadi',
    shiftId: 'satpam-shift-pagi',
    shiftNama: 'Shift Pagi — Gerbang Utama',
    posJaga: 'Pos Gerbang Utama PP NU Darussalam',
    status: 'Hadir',
    waktuInput: '06:55',
    waktuCekOut: '15:02',
    durasiKerja: '08:07:00',
    statusKeterlambatan: 'Tepat Waktu',
    menitTerlambat: 0,
    koordinat: '-6.9765, 109.6832',
    akurasiGps: 14,
    lokasiLabel: 'Pos Gerbang Utama PP NU Darussalam',
    waktuTimestamp: '20 Nov 2026 06:55 WIB',
    wajahCocok: true,
    verifikasiAtasan: 'Terverifikasi',
    sumberAbsen: 'GPS Mobile',
  },
  {
    id: 'sa-2',
    tanggal: '2026-11-20',
    satpamId: 'satpam-suwarno',
    satpamNama: 'Pak Suwarno',
    shiftId: 'satpam-shift-sore',
    shiftNama: 'Shift Sore — Penjengukan Wali',
    posJaga: 'Pos Penjengukan & Pintu Masuk',
    status: 'Hadir',
    waktuInput: '14:58',
    waktuCekOut: '23:04',
    durasiKerja: '08:06:00',
    statusKeterlambatan: 'Tepat Waktu',
    menitTerlambat: 0,
    koordinat: '-6.9766, 109.6831',
    akurasiGps: 18,
    lokasiLabel: 'Pos Penjengukan & Pintu Masuk',
    waktuTimestamp: '20 Nov 2026 14:58 WIB',
    wajahCocok: true,
    verifikasiAtasan: 'Terverifikasi',
    sumberAbsen: 'GPS Mobile',
  },
  {
    id: 'sa-3',
    tanggal: '2026-11-20',
    satpamId: 'satpam-sopoyono',
    satpamNama: 'Pak Sopoyono',
    shiftId: 'satpam-shift-malam',
    shiftNama: 'Shift Malam — Patroli Komplek',
    posJaga: 'Keliling Asrama Putra & Putri',
    status: 'Hadir',
    waktuInput: '23:14',
    waktuCekOut: '07:02',
    durasiKerja: '07:48:00',
    statusKeterlambatan: 'Terlambat',
    menitTerlambat: 14,
    koordinat: '-6.9767, 109.6834',
    akurasiGps: 21,
    lokasiLabel: 'Keliling Asrama Putra & Putri',
    waktuTimestamp: '20 Nov 2026 23:14 WIB',
    wajahCocok: true,
    verifikasiAtasan: 'Terverifikasi',
    sumberAbsen: 'GPS Mobile',
  },
  {
    id: 'sa-4',
    tanggal: '2026-11-19',
    satpamId: 'satpam-riyadi',
    satpamNama: 'Pak Riyadi',
    shiftId: 'satpam-shift-pagi',
    shiftNama: 'Shift Pagi — Gerbang Utama',
    posJaga: 'Pos Gerbang Utama PP NU Darussalam',
    status: 'Hadir',
    waktuInput: '06:57',
    waktuCekOut: '15:00',
    durasiKerja: '08:03:00',
    statusKeterlambatan: 'Tepat Waktu',
    menitTerlambat: 0,
    koordinat: '-6.9765, 109.6832',
    akurasiGps: 16,
    lokasiLabel: 'Pos Gerbang Utama PP NU Darussalam',
    waktuTimestamp: '19 Nov 2026 06:57 WIB',
    wajahCocok: true,
    verifikasiAtasan: 'Terverifikasi',
    sumberAbsen: 'GPS Mobile',
  },
  {
    id: 'sa-5',
    tanggal: '2026-11-19',
    satpamId: 'satpam-suwarno',
    satpamNama: 'Pak Suwarno',
    shiftId: 'satpam-shift-sore',
    shiftNama: 'Shift Sore — Penjengukan Wali',
    posJaga: 'Pos Penjengukan & Pintu Masuk',
    status: 'Hadir',
    waktuInput: '14:54',
    waktuCekOut: '23:01',
    durasiKerja: '08:07:00',
    statusKeterlambatan: 'Tepat Waktu',
    menitTerlambat: 0,
    koordinat: '-6.9766, 109.6831',
    akurasiGps: 19,
    lokasiLabel: 'Pos Penjengukan & Pintu Masuk',
    waktuTimestamp: '19 Nov 2026 14:54 WIB',
    wajahCocok: true,
    verifikasiAtasan: 'Terverifikasi',
    sumberAbsen: 'GPS Mobile',
  },
  {
    id: 'sa-6',
    tanggal: '2026-11-19',
    satpamId: 'satpam-sopoyono',
    satpamNama: 'Pak Sopoyono',
    shiftId: 'satpam-shift-malam',
    shiftNama: 'Shift Malam — Patroli Komplek',
    posJaga: 'Keliling Asrama Putra & Putri',
    status: 'Hadir',
    waktuInput: '22:57',
    waktuCekOut: '07:00',
    durasiKerja: '08:03:00',
    statusKeterlambatan: 'Tepat Waktu',
    menitTerlambat: 0,
    koordinat: '-6.9767, 109.6834',
    akurasiGps: 20,
    lokasiLabel: 'Keliling Asrama Putra & Putri',
    waktuTimestamp: '19 Nov 2026 22:57 WIB',
    wajahCocok: true,
    verifikasiAtasan: 'Terverifikasi',
    sumberAbsen: 'GPS Mobile',
  },
];

export const SEED_SATPAM_PENGAJUAN: SatpamPengajuanRequest[] = [
  {
    id: 'sp-1',
    satpamId: 'satpam-suwarno',
    satpamNama: 'Pak Suwarno',
    tanggal: '2026-11-21',
    jenis: 'Absen Pengajuan',
    shiftId: 'satpam-slot-ronda-1jam',
    shiftNama: 'Slot Kontrol Ronda Malam (1 Jam)',
    posJaga: 'Pos Gerbang, Masjid & Asrama',
    jamMulaiDiajukan: '01:00',
    jamSelesaiDiajukan: '02:00',
    kendalaKategori: 'Sinyal GPS Lemah / Tidak Terbaca',
    alasan: 'Sinyal GPS sempat hilang di area lorong komplek putri saat ronda pukul 01.00 WIB, patroli terlaksana aman.',
    status: 'Menunggu',
    waktuPengajuan: '2026-11-21 02:05',
  },
];



