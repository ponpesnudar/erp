export type AudienceFilterType = 'Semua' | 'Pengasuh' | 'Guru' | 'Satpam';

export type SlideDiagramType =
  | 'architecture'
  | 'bahtsul_3d'
  | 'psb'
  | 'imtihan_soal'
  | 'imtihan_sidang'
  | 'munaqosyah_3d'
  | 'maarifan'
  | 'absensi_guru'
  | 'sekretaris'
  | 'bendahara'
  | 'pos_rfid'
  | 'kemahadiyahan'
  | 'absensi_satpam'
  | 'pwa_install'
  | 'akses_role';

export interface TutorialScene {
  sceneTitle: string;
  durationSec: number;
  highlightBadge: string;
  actionSteps: string[];
  narration: string;
  mockupFocus: string;
}

export interface ModuleTutorialSlide {
  id: string;
  slideNumber: number;
  title: string;
  subtitle: string;
  audiens: AudienceFilterType;
  targetTags: ('Pengasuh' | 'Guru' | 'Satpam' | 'Admin/Staff')[];
  erpTab: string;
  diagramType: SlideDiagramType;
  bullets: string[];
  speakerNotes: string;
  scenes: TutorialScene[];
}

export const MODULE_TUTORIAL_SLIDES: ModuleTutorialSlide[] = [
  {
    id: 'slide-01-arsitektur',
    slideNumber: 1,
    title: 'Transformasi Digital ERP PP NU Darussalam Karangdadap',
    subtitle: 'Satu Sistem Terpadu untuk Pengasuh, Dewan Asatidz, Pengurus, Wali Santri & Satpam',
    audiens: 'Semua',
    targetTags: ['Pengasuh', 'Guru', 'Satpam', 'Admin/Staff'],
    erpTab: 'beranda',
    diagramType: 'architecture',
    bullets: [
      'Mengintegrasikan 14 modul pondok pesantren & Madrasah Diniyah dalam 1 portal real-time.',
      'Dashboard eksekutif Pengasuh menampilkan KPI kehadiran santri, realisasi kas, dan kotak masuk persetujuan.',
      'Dapat diakses dari Laptop/Komputer kantor maupun diunduh langsung ke HP Android & iPhone (PWA).',
      'Database persisten aman dengan ekspor laporan resmi kop pesantren (F4 / A4 PDF & Excel).',
    ],
    speakerNotes:
      'Bismillahirrahmanirrahim. Hadirin Pengasuh KH. Amin Maizun, Dewan Guru/Asatidz, serta Regu Satpam (Pak Riyadi, Pak Suwarno, Pak Sopoyono) yang kami hormati. Hari ini kita memperkenalkan sistem ERP Terpadu PP NU Darussalam Karangdadap untuk mempermudah seluruh administrasi pendidikan, keuangan, dan keamanan pondok.',
    scenes: [
      {
        sceneTitle: '1. Masuk Portal & Pemetaan Peran',
        durationSec: 6,
        highlightBadge: 'SSO & Multi-Role',
        mockupFocus: 'Pilih Akun Pengasuh, Guru, Ketua Imtihan, Bendahara, atau Satpam',
        actionSteps: [
          'Buka portal ERP lalu klik tombol "Masuk ERP" di pojok kanan atas.',
          'Login menggunakan username & sandi pribadi masing-masing.',
          'Menu sidebar otomatis menyesuaikan wewenang peran pengguna.',
        ],
        narration: 'Langkah awal masuk ke sistem ERP Darussalam adalah memilih akses sesuai peran masing-masing, mulai dari Pengasuh, Dewan Guru, hingga Regu Satpam.',
      },
      {
        sceneTitle: '2. Membaca KPI Real-Time di Beranda',
        durationSec: 6,
        highlightBadge: 'Monitoring Eksekutif',
        mockupFocus: 'Kartu KPI Santri Aktif, Rasio Kas, Kehadiran Guru & Satpam',
        actionSteps: [
          'Beranda menyajikan ringkasan santri putra & putri secara langsung.',
          'Kotak Masuk Persetujuan mengumpulkan pengajuan izin guru, soal ujian, & izin satpam.',
          'Gunakan pintasan Ctrl+K untuk melompat ke modul mana saja dalam 1 detik.',
        ],
        narration: 'Di Beranda, Pengasuh dan pimpinan pondok langsung melihat statistik santri, transaksi kas, serta daftar persetujuan yang menunggu keputusan.',
      },
    ],
  },
  {
    id: 'slide-02-bahtsul',
    slideNumber: 2,
    title: 'Landing Page Publik & Sidang Bahtsul Masaail 3D',
    subtitle: 'Wajah Digital Pesantren dan Forum Kajian Empat Madzhab Berbasis Kitab Kuning',
    audiens: 'Pengasuh',
    targetTags: ['Pengasuh', 'Guru'],
    erpTab: 'beranda',
    diagramType: 'bahtsul_3d',
    bullets: [
      'Menampilkan profil pesantren, maqolah Pengasuh, program pendidikan, dan statistik santri.',
      'Fitur interaktif Sidang Bahtsul Masaail 3D mempertemukan 4 meja madzhab (Syafi’i, Hanafi, Maliki, Hambali).',
      'Dilengkapi teks as’ilah, ibarat kitab rujukan mu’tabarah, serta unduh rumusan keputusan PDF.',
      'Informasi kontak & profil dapat disunting kapan saja oleh Sekretaris tanpa coding.',
    ],
    speakerNotes:
      'Bagi masyarakat umum dan wali santri, beranda publik memperkenalkan PP NU Darussalam beserta simulasi Sidang Bahtsul Masaail 3D yang merujuk kitab-kitab mu’tabarah Ahlussunnah wal Jamaah.',
    scenes: [
      {
        sceneTitle: '1. Profil Pondok & Maqolah Pengasuh',
        durationSec: 5,
        highlightBadge: 'Website Resmi',
        mockupFocus: 'Hero Pesantren, Jadwal Harian Santri, & Pendaftaran PSB',
        actionSteps: [
          'Wali santri dapat melihat informasi pondok langsung tanpa harus login.',
          'Tombol Daftar PSB Online langsung mengarahkan calon santri ke formulir pendaftaran.',
        ],
        narration: 'Halaman depan website menyajikan identitas resmi Pondok Pesantren NU Darussalam sekaligus akses cepat pendaftaran santri baru.',
      },
      {
        sceneTitle: '2. Menjalankan Sidang Bahtsul Masaail 3D',
        durationSec: 6,
        highlightBadge: 'Kajian 4 Madzhab',
        mockupFocus: 'Ruang Sidang 3D Interaktif + Kitab Fathul Mu’in / Al-Majmu’',
        actionSteps: [
          'Pilih contoh as’ilah populer atau ketik persoalan fiqih baru.',
          'Klik Putar Sidang untuk melihat musyawirin membacakan ta’bir kitab kuning.',
          'Unduh hasil rumusan jawaban bahtsul masaail dalam bentuk PDF.',
        ],
        narration: 'Di forum Bahtsul Masaail 3D, musyawirin menyajikan hujjah dari kitab kuning lengkap dengan tombol cetak rumusan PDF.',
      },
    ],
  },
  {
    id: 'slide-03-psb',
    slideNumber: 3,
    title: 'Penerimaan Santri Baru (PSB Online)',
    subtitle: 'Pendataan Pendaftar, Verifikasi Berkas KK/KIP & Penerbitan NIS Otomatis',
    audiens: 'Pengasuh',
    targetTags: ['Pengasuh', 'Admin/Staff'],
    erpTab: 'psb',
    diagramType: 'psb',
    bullets: [
      'Formulir EMIS lengkap: data diri santri, NIK, No. KK, asal sekolah, jenjang & unggah berkas.',
      'Upload bukti transfer pendaftaran dipantau langsung oleh panitia PSB & Bendahara.',
      'Satu klik "Jadikan Santri Resmi" otomatis menerbitkan NIS unik dan memasukkan ke kelas & kamar.',
    ],
    speakerNotes:
      'Penerimaan Santri Baru tidak lagi menginput ulang buku induk secara manual. Saat berkas pendaftar disetujui, sistem langsung menerbitkan NIS resmi pondok.',
    scenes: [
      {
        sceneTitle: '1. Pendaftaran & Unggah Berkas',
        durationSec: 5,
        highlightBadge: 'Form EMIS Lengkap',
        mockupFocus: 'Input NIK, Wali Santri, File KK/KIP & Bukti Transfer',
        actionSteps: [
          'Wali mengisi biodata calon santri beserta pilihan jenjang Madrasah Diniyah.',
          'Mengunggah foto KK dan bukti transfer biaya pendaftaran.',
        ],
        narration: 'Calon wali santri mengisi biodata sesuai standar EMIS dan melampirkan berkas KK maupun bukti transfer secara online.',
      },
      {
        sceneTitle: '2. Verifikasi & Terbit NIS Otomatis',
        durationSec: 6,
        highlightBadge: 'Konversi 1 Klik',
        mockupFocus: 'Status Diterima -> Resmi Santri -> Masuk Master Data',
        actionSteps: [
          'Panitia memeriksa kelengkapan berkas lalu mengubah status menjadi Diterima.',
          'Klik tombol Jadikan Santri, tentukan Kelas & Kamar, dan NIS otomatis dibuat.',
        ],
        narration: 'Setelah diverifikasi, panitia cukup memilih kelas dan kamar. Sistem langsung menerbitkan NIS dan mendaftarkan santri ke Master Data.',
      },
    ],
  },
  {
    id: 'slide-04-imtihan-soal',
    slideNumber: 4,
    title: 'Modul Imtihan: Naskah Soal, Review Panitia & Cetak Blanko',
    subtitle: 'Alur Kerja Guru Pengampu Menulis Soal Arab/Pegon hingga Siap Digandakan',
    audiens: 'Guru',
    targetTags: ['Guru', 'Pengasuh'],
    erpTab: 'imtihan',
    diagramType: 'imtihan_soal',
    bullets: [
      'Dewan Guru menulis naskah soal Essay/Pilihan Ganda dilengkapi keyboard Arab/Pegon virtual.',
      'Ketua Panitia Imtihan mereview naskah, memberi catatan revisi, atau mengunci status Disetujui.',
      'Blanko soal otomatis dicetak dengan kop pesantren resmi, kotak nilai, dan penomoran Arab-Indic.',
    ],
    speakerNotes:
      'Untuk Bapak Ibu Dewan Guru, modul Imtihan memudahkan penulisan naskah soal berbahasa Arab dan Jawa Pegon. Panitia cukup mereview online tanpa bolak-balik kertas revisi.',
    scenes: [
      {
        sceneTitle: '1. Guru Menyusun Soal Arab / Pegon',
        durationSec: 6,
        highlightBadge: 'Keyboard Arab/Pegon',
        mockupFocus: 'Editor Soal Esai & PG + Pilihan Fan Mapel',
        actionSteps: [
          'Buka menu Imtihan > Naskah Soal Guru lalu pilih kelas dan mata pelajaran.',
          'Gunakan tombol huruf Pegon (چ، ڠ، ڤ، ݢ، ڽ) untuk menulis pertanyaan.',
          'Klik "Ajukan ke Panitia" saat naskah selesai.',
        ],
        narration: 'Dewan guru memilih mapel yang diampu, menyusun soal dengan bantuan tombol Pegon dan harakat, lalu mengajukan ke panitia imtihan.',
      },
      {
        sceneTitle: '2. Review Ketua Imtihan & Cetak Blanko',
        durationSec: 6,
        highlightBadge: 'Kop Resmi Pondok',
        mockupFocus: 'Status Disetujui -> Pratinjau Cetak Blanko F4/A4',
        actionSteps: [
          'Ketua Panitia meninjau butir soal lalu klik Setujui atau Perlu Revisi.',
          'Naskah yang disetujui langsung tampil pada Cetak Blanko Soal lengkap kop pondok.',
        ],
        narration: 'Ketua Panitia memverifikasi naskah soal. Begitu disetujui, lembaran siap cetak dengan tata letak kanan-ke-kiri otomatis tersedia.',
      },
    ],
  },
  {
    id: 'slide-05-imtihan-sidang',
    slideNumber: 5,
    title: 'Imtihan: Denah 7 Ruang Bebas Contek & Sidang Kenaikan KKM 65',
    subtitle: 'Pengacakan Tempat Duduk Otomatis, Kartu Ujian & Sidang Penentuan Kelas',
    audiens: 'Pengasuh',
    targetTags: ['Pengasuh', 'Guru'],
    erpTab: 'imtihan',
    diagramType: 'imtihan_sidang',
    bullets: [
      'Algoritma acak 7 ruang memisahkan santri satu kelas agar tidak duduk bersebelahan.',
      'Cetak Kartu Imtihan format resmi dengan jadwal mata pelajaran & kolom paraf pengawas.',
      'Sidang Kenaikan Kelas menggabungkan (Imtihan 1 + Imtihan 2) ÷ 2 + Absensi KBM (Sakit 0, Bolos -3) + Ubudiyah + Amaliyah + MQK.',
      'Notifikasi otomatis ke Pengasuh, Ketua Imtihan, & Admin jika nilai akhir santri di bawah KKM 65.',
    ],
    speakerNotes:
      'Fitur unggulan Imtihan adalah penyusunan denah 7 ruang otomatis bebas contek serta menu Sidang Kenaikan Kelas dengan ambang KKM 65 untuk menentukan Naik, Naik Bersyarat, atau Tidak Naik.',
    scenes: [
      {
        sceneTitle: '1. Acak Denah 7 Ruang & Cetak Kartu',
        durationSec: 6,
        highlightBadge: 'Anti-Contek Otomatis',
        mockupFocus: 'Denah Bangku Ruang 1-7 + Kartu Peserta 2MD',
        actionSteps: [
          'Klik "Acak Ulang Denah" untuk mendistribusikan santri putra dan putri ke 7 ruang.',
          'Cetak kartu peserta ujian beserta jadwal paraf pengawas di bagian belakang.',
        ],
        narration: 'Panitia dapat mengacak kursi seluruh santri ke dalam tujuh ruang ujian hanya dengan satu klik serta langsung mencetak kartu peserta.',
      },
      {
        sceneTitle: '2. Sidang Kenaikan Kelas (KKM 65) & Ekspor Arsip',
        durationSec: 7,
        highlightBadge: 'Keputusan Pengasuh',
        mockupFocus: 'Notifikasi < KKM 65 -> Edit Komponen -> Filter & Ekspor PDF/Excel',
        actionSteps: [
          'Sistem menyorot otomatis santri dengan nilai total di bawah KKM 65.',
          'Admin/Ketua Panitia menyunting nilai Cawu 1, Cawu 2, Ubudiyah, Amaliyah, MQK & absensi bolos.',
          'Tetapkan keputusan Naik, Naik Bersyarat, atau Tidak Naik lalu unduh rekapan PDF/Excel.',
        ],
        narration: 'Pada Sidang Kenaikan Kelas, pimpinan pondok langsung melihat daftar santri di bawah KKM 65, memutuskan status kenaikan, dan mengarsipkan riwayatnya.',
      },
    ],
  },
  {
    id: 'slide-06-munaqosyah',
    slideNumber: 6,
    title: 'Majlis Ilmiah, Perumusan Hadits (51 Kitab) & Munaqosyah 3D',
    subtitle: 'Simulasi Sidang 4 Bangku Kelas 3 & 6 + Ruang Hadis Takhrij Sanad & PDF',
    audiens: 'Guru',
    targetTags: ['Guru', 'Pengasuh'],
    erpTab: 'munaqosyah',
    diagramType: 'munaqosyah_3d',
    bullets: [
      'Menampilkan 4 bangku penguji: Moderator, Penguji Nahwu Shorof, Fiqh, dan Al-Qur’an serta Halaqah Perumusan Hadits (51 Kitab).',
      'Dashboard Monitor Real-Time menampilkan antrean santri yang sedang diuji di setiap bangku.',
      'Nilai dari 4 penguji langsung dihitung otomatis menjadi rata-rata & predikat kelulusan.',
      'Panitia dapat mengunduh Laporan Hasil Akhir Munaqosyah dan Rumusan Hadits resmi dalam format PDF.',
    ],
    speakerNotes:
      'Pada modul Majlis Ilmiah & Munaqosyah 3D, panitia memantau antrean santri kelas 3 & 6 di 4 meja secara real-time sekaligus menggelar Halaqah Ruang Hadis 51 Kitab.',
    scenes: [
      {
        sceneTitle: '1. Dashboard Antrean 4 Bangku Real-Time',
        durationSec: 6,
        highlightBadge: 'Monitor Langsung',
        mockupFocus: 'Status Bangku: Moderator | Nahwu Shorof | Fiqh | Al-Qur’an',
        actionSteps: [
          'Pantau santri yang sedang duduk di masing-masing dari 4 bangku penguji.',
          'Arahkan santri berikutnya agar ruangan tetap tertib dan tidak menumpuk.',
        ],
        narration: 'Panitia di luar majelis memantau status keempat bangku munaqosyah secara langsung dari layar monitor.',
      },
      {
        sceneTitle: '2. Input Nilai 4 Penguji & Unduh Sertifikat PDF',
        durationSec: 6,
        highlightBadge: 'Rekap Otomatis',
        mockupFocus: 'Skor 4 Tahap -> Rata-rata & Unduh PDF Resmi',
        actionSteps: [
          'Masukkan nilai Nahwu Shorof, Fiqh, Qira’ah Al-Qur’an & adab di Moderator.',
          'Setelah 4 tahapan selesai, klik Unduh PDF untuk mencetak laporan hasil akhir santri.',
        ],
        narration: 'Begitu keempat pos selesai menilai, sistem merekap rata-rata dan menyediakan laporan akhir PDF yang siap ditandatangani.',
      },
    ],
  },
  {
    id: 'slide-07-maarifan',
    slideNumber: 7,
    title: "Madrasah Diniyah (Ma'arifan), Kurikulum & Absensi KBM",
    subtitle: 'Presensi Santri per Kelas, Matriks Kitab Kuning & Kalender Pendidikan',
    audiens: 'Guru',
    targetTags: ['Guru', 'Pengasuh'],
    erpTab: 'maarifan',
    diagramType: 'maarifan',
    bullets: [
      'Absensi cepat santri tiap jam pelajaran dengan tombol "Hadir Semua" dan catatan Sakit/Izin/Alpa.',
      'Data Alpa/Bolos KBM otomatis terhubung ke perhitungan penalti Sidang Kenaikan Kelas (-3 poin).',
      'Menyimpan matriks kitab per kelas (1 s.d. 6), pustaka Kitab PDF, dan Kalender Pendidikan Ma’arif.',
    ],
    speakerNotes:
      'Di menu Ma’arifan, asatidz mencatat absensi santri saat KBM berlangsung. Data bolos atau sakit langsung terakumulasi sebagai bahan pertimbangan kenaikan kelas.',
    scenes: [
      {
        sceneTitle: '1. Presensi Cepat Santri di Kelas',
        durationSec: 6,
        highlightBadge: '1 Klik Hadir Semua',
        mockupFocus: 'Pilih Kelas -> Klik Hadir Semua -> Tandai S/I/A -> Simpan',
        actionSteps: [
          'Pilih kelas, mapel kitab, dan tanggal pertemuan KBM.',
          'Tekan "Hadir Semua" lalu ubah hanya santri yang berhalangan (Sakit/Izin/Alpa).',
        ],
        narration: 'Guru cukup menekan tombol Hadir Semua, lalu menandai beberapa santri yang sakit, izin, atau alpa dalam hitungan detik.',
      },
      {
        sceneTitle: '2. Matriks Kurikulum & Kalender Pendidikan',
        durationSec: 5,
        highlightBadge: 'Arsip Kitab PDF',
        mockupFocus: 'Tabel Kitab Kelas 1-6 + Kode Hari Libur LM/LP/Imtihan',
        actionSteps: [
          'Buka tab Kurikulum untuk melihat distribusi jam mengajar (JTM) dan pustaka PDF kitab.',
          'Kalender Pendidikan Ma’arif menjadi acuan otomatis hari aktif santri dan guru.',
        ],
        narration: 'Kurikulum kitab kuning dari kelas 1 hingga kelas 6 beserta kalender libur pesantren terdokumentasi rapi di menu ini.',
      },
    ],
  },
  {
    id: 'slide-08-absensi-guru',
    slideNumber: 8,
    title: 'SDM & Aplikasi Absensi Mobile Guru (Swafoto GPS)',
    subtitle: 'Presensi Kehadiran Ustadz/Ustadzah Akurat dengan Kamera, GPS & Rekap PDF',
    audiens: 'Guru',
    targetTags: ['Guru', 'Pengasuh'],
    erpTab: 'sdm_absensi',
    diagramType: 'absensi_guru',
    bullets: [
      'Aplikasi mobile di HP guru: Cek In Swafoto kamera + koordinat GPS + stempel waktu WIB.',
      'Mendukung sesi 1 jam fleksibel (Ngaji Subuh, Takhasus Sore, Jam ke-1/2/3 MDS, Sorogan Malam).',
      'Fitur "Absen Pengajuan" & "Izin/Badal" saat kendala GPS/sinyal atau ada tugas mendadak.',
      'Monitoring Pimpinan & Sekretaris: Verifikasi foto, rekap mingguan/bulanan, serta ekspor PDF.',
    ],
    speakerNotes:
      'Untuk seluruh dewan guru, kini tersedia aplikasi absensi mobile yang bisa diunduh di HP. Jika HP terkendala sinyal GPS atau lupa menekan cek-in, guru cukup mengajukan Absen Pengajuan beserta alasan dan bukti.',
    scenes: [
      {
        sceneTitle: '1. Cek In Swafoto & GPS dari HP Guru',
        durationSec: 6,
        highlightBadge: 'Swafoto + Watermark GPS',
        mockupFocus: 'Pilih Sesi Jam -> Kamera Selfie -> Konfirmasi Cek In',
        actionSteps: [
          'Buka menu SDM & Absensi Mobile Guru lalu pilih jam mengajar aktif.',
          'Tekan Cek In Swafoto Kamera, pastikan wajah dan GPS terkunci, lalu konfirmasi.',
          'Tekan Cek Out saat jam mengajar selesai untuk merekam durasi kerja.',
        ],
        narration: 'Guru memilih sesi ajarnya lalu melakukan swafoto. Sistem menempelkan stempel waktu WIB dan titik koordinat GPS pondok secara otomatis.',
      },
      {
        sceneTitle: '2. Ajukan Badal / Kendala & Monitoring Pimpinan',
        durationSec: 6,
        highlightBadge: 'Rekap PDF & Bisyaroh',
        mockupFocus: 'Form Absen Pengajuan -> Verifikasi Kepala Madin -> PDF',
        actionSteps: [
          'Gunakan tombol Absen Pengajuan jika kamera/GPS bermasalah atau kirim Badal jika berhalangan.',
          'Kepala Madin/Sekretaris memverifikasi dan mengunduh rekap mingguan/bulanan PDF untuk dasar bisyaroh.',
        ],
        narration: 'Pengajuan izin badal maupun kendala absen langsung masuk ke dasbor pimpinan untuk disetujui dan direkap menjadi laporan bisyaroh.',
      },
    ],
  },
  {
    id: 'slide-09-sekretaris',
    slideNumber: 9,
    title: 'Sekretariat: Import Excel Santri, Persuratan & Sarpras',
    subtitle: 'Efisiensi Pendataan Ratusan Santri Putra/Putri, Surat Resmi & Aset Pondok',
    audiens: 'Pengasuh',
    targetTags: ['Pengasuh', 'Admin/Staff', 'Guru'],
    erpTab: 'sekretaris',
    diagramType: 'sekretaris',
    bullets: [
      'Fitur Import Massal Data Santri Putra & Putri langsung menggunakan template format Excel.',
      'Penomoran surat keluar/masuk otomatis dengan kop resmi Yayasan PP NU Darussalam.',
      'Inventarisasi Sarpras terhubung ke Neraca Bendahara: data Lahan, Gedung, Ruangan & Perlengkapan.',
    ],
    speakerNotes:
      'Sekretariat kini sangat cepat karena sudah dilengkapi format import Excel untuk santri putra dan putri sekaligus, ditambah inventaris aset sarpras yang nilainya langsung masuk ke neraca bendahara.',
    scenes: [
      {
        sceneTitle: '1. Import Massal Data Santri Putra & Putri',
        durationSec: 6,
        highlightBadge: 'Format Excel Siap Pakai',
        mockupFocus: 'Unduh Format Putra/Putri -> Unggah File -> Masuk Master',
        actionSteps: [
          'Klik tombol "Import Data Santri" di modul Sekretaris.',
          'Unduh template format Excel Putra atau Putri, isi kolom data santri, lalu unggah kembali.',
        ],
        narration: 'Untuk menghemat waktu penginputan satu per satu, staf sekretariat cukup mengunduh template Excel Putra atau Putri lalu mengunggahnya secara massal.',
      },
      {
        sceneTitle: '2. Persuratan Resmi & Aset Sarpras',
        durationSec: 5,
        highlightBadge: 'Terhubung Neraca',
        mockupFocus: 'Nomor Surat Otomatis + Valuasi Lahan & Gedung',
        actionSteps: [
          'Buat surat keterangan/undangan dengan penomoran otomatis dan cetak F4/A4.',
          'Catat nilai perolehan lahan, bangunan, dan peralatan untuk pemantauan aset pondok.',
        ],
        narration: 'Setiap perubahan aset lahan maupun gedung di Sarpras otomatis memperbarui catatan Aktiva Tetap di laporan keuangan.',
      },
    ],
  },
  {
    id: 'slide-10-bendahara',
    slideNumber: 10,
    title: 'Bendahara: Neraca, Laba/Rugi, Cashflow & Syahriyah',
    subtitle: 'Laporan Keuangan Terstandar Akuntansi, Buku Besar Klik-Detail & Kontrol Santri Boyong',
    audiens: 'Pengasuh',
    targetTags: ['Pengasuh', 'Admin/Staff'],
    erpTab: 'bendahara',
    diagramType: 'bendahara',
    bullets: [
      'Sub-menu Laporan Keuangan lengkap: Neraca (Skontro/Standar), Laba/Rugi, & Rincian Arus Kas (Cashflow).',
      'Setiap pos akun pada Neraca maupun Laba/Rugi dapat diklik untuk membuka Daftar Histori Buku Besar (GL).',
      'Pembayaran Syahriyah Bulanan, Daftar Ulang, & Kegiatan Kema’hadiyahan tercatat terpisah secara aman.',
      'Ledger Bendahara independen: jika santri keluar/boyong dan datanya diarsip Sekretariat, piutang/tunggakannya tetap terdeteksi.',
    ],
    speakerNotes:
      'Bendahara pondok kini memiliki laporan setara standar akuntansi profesional: Neraca yang menyertakan aset sarpras, Laba/Rugi, serta Cashflow yang rinciannya bisa diklik per akun. Data tagihan santri boyong pun aman tidak ikut terhapus.',
    scenes: [
      {
        sceneTitle: '1. Laporan Neraca, Laba/Rugi & Klik Detail GL',
        durationSec: 6,
        highlightBadge: 'Akuntansi Pondok',
        mockupFocus: 'Neraca Standar -> Klik Akun Kas/Biaya -> Daftar Histori GL',
        actionSteps: [
          'Buka Bendahara > Laporan Keuangan dan pilih tampilan Neraca, Laba/Rugi, atau Arus Kas.',
          'Klik langsung salah satu baris pos akun (misal Kas atau Listrik) untuk membedah transaksi detailnya.',
        ],
        narration: 'Pengasuh dan Bendahara dapat mengklik baris akun pada Neraca maupun Laba Rugi untuk melihat buku besar transaksi secara rinci.',
      },
      {
        sceneTitle: '2. Pembayaran Bulanan & Deteksi Tunggakan Boyong',
        durationSec: 6,
        highlightBadge: 'Anti-Kehilangan Piutang',
        mockupFocus: 'Tagihan Syahriyah / Daftar Ulang -> Badge Santri Boyong Punya Tanggungan',
        actionSteps: [
          'Kelola tagihan Syahriyah bulanan, Daftar Ulang tahunan, dan iuran agenda Kema’hadiyahan.',
          'Pantau indikator santri yang berstatus Boyong/Keluar tetapi masih memiliki sisa tagihan belum lunas.',
        ],
        narration: 'Sistem menjaga catatan piutang di Bendahara secara mandiri sehingga tunggakan santri yang sudah boyong tetap terpantau hingga tuntas.',
      },
    ],
  },
  {
    id: 'slide-11-transaksi',
    slideNumber: 11,
    title: 'Transaksi Kartu Santri RFID & Kasir Kantin (POS)',
    subtitle: 'Belanja Non-Tunai di Kantin/Laundry dengan Pengawasan Batas Harian oleh Wali',
    audiens: 'Semua',
    targetTags: ['Pengasuh', 'Guru', 'Admin/Staff'],
    erpTab: 'transaksi',
    diagramType: 'pos_rfid',
    bullets: [
      'Santri berbelanja di kantin pondok dan membayar laundry cukup dengan tap kartu RFID santri.',
      'Pembatasan limit belanja harian otomatis mencegah pemborosan (ditetapkan wali dari rumah).',
      'Wali santri memantau riwayat jajan real-time, top-up saldo, serta bisa memblokir kartu jika hilang.',
    ],
    speakerNotes:
      'Uang saku santri jauh lebih aman dan terkontrol melalui sistem kartu RFID. Kasir tidak perlu repot uang kembalian, dan wali santri bisa memantau belanja harian putra-putrinya.',
    scenes: [
      {
        sceneTitle: '1. Pembayaran Tap Kartu RFID di Kasir Kantin',
        durationSec: 5,
        highlightBadge: 'Cepat & Non-Tunai',
        mockupFocus: 'Pilih Menu Kantin -> Tap Kartu Santri -> Cek Saldo & Limit Harian',
        actionSteps: [
          'Kasir memilih jajanan atau layanan laundry santri.',
          'Tap kartu santri; transaksi otomatis ditolak jika melebihi limit harian atau kartu diblokir.',
        ],
        narration: 'Kasir tinggal memilih item lalu melakukan tap kartu. Sistem secara otomatis memvalidasi kecukupan saldo dan batas jajan harian.',
      },
    ],
  },
  {
    id: 'slide-12-kemahadiyahan',
    slideNumber: 12,
    title: "Kema'hadiyahan, Bagan Kepanitiaan & Agenda Kegiatan",
    subtitle: 'Struktur Pengurus Pondok, Kepanitiaan PHBI/Haflah & Sinkronisasi Tagihan',
    audiens: 'Pengasuh',
    targetTags: ['Pengasuh', 'Guru'],
    erpTab: 'kemahadiyahan',
    diagramType: 'kemahadiyahan',
    bullets: [
      'Mengelola struktur pengurus pondok dan bagan panitia bertingkat (PHBI, Haflah Akhirussanah, Imtihan).',
      'Menyusun agenda kegiatan kema’hadiyahan beserta estimasi iuran peserta.',
      'Sinkronisasi jadwal kalender pendidikan dan penerbitan iuran kegiatan ke kas Bendahara.',
    ],
    speakerNotes:
      'Divisi Kema’hadiyahan mendokumentasikan struktur kepengurusan, susunan panitia acara besar pondok, dan agenda kegiatan yang terhubung ke kalender pendidikan.',
    scenes: [
      {
        sceneTitle: '1. Bagan Kepanitiaan & Agenda Terintegrasi',
        durationSec: 5,
        highlightBadge: 'Organisasi Rapi',
        mockupFocus: 'Struktur Pengurus + Daftar Agenda Kegiatan Pondok',
        actionSteps: [
          'Susun jabatan pengurus dan bagan panitia per kegiatan pondok.',
          'Tambahkan agenda baru atau sinkronkan langsung dari Kalender Pendidikan Ma’arif.',
        ],
        narration: 'Pengurus Kema’hadiyahan dapat memperbarui bagan kepengurusan sekaligus menyinkronkan jadwal acara pondok dengan kalender pendidikan.',
      },
    ],
  },
  {
    id: 'slide-13-bk-satpam',
    slideNumber: 13,
    title: 'BK, Keamanan & Aplikasi Absensi Mobile Satpam (HP)',
    subtitle: 'Khusus Regu Keamanan: Pak Riyadi, Pak Suwarno & Pak Sopoyono',
    audiens: 'Satpam',
    targetTags: ['Satpam', 'Pengasuh'],
    erpTab: 'bk',
    diagramType: 'absensi_satpam',
    bullets: [
      'Absensi Satpam di modul BK & Keamanan dibuat persis seperti Absensi Guru: Swafoto + GPS Pos + Rekapan PDF.',
      'Mendukung shift jaga 8 jam (Pagi 07-15, Sore 15-23, Malam 23-07) & Slot Kontrol Ronda Malam.',
      'Dilengkapi tombol Istirahat/Sholat, Cek Out, Absen Pengajuan (kendala sinyal/HP), & Tukar Shift antar regu.',
      'Terintegrasi dengan Buku Tamu 24 Jam, Bukti Foto Titipan Wali Santri, & Catatan Takzir/Ketertiban.',
    ],
    speakerNotes:
      'Khusus untuk Bapak-Bapak Satpam kita: Pak Riyadi, Pak Suwarno, dan Pak Sopoyono. Kini di modul BK & Keamanan sudah tersedia menu Absensi Satpam yang persis dengan aplikasi absensi guru. Bisa dibuka langsung di HP, cek-in swafoto dari pos gerbang/asrama, bisa ajukan tukar shift atau izin kendala sinyal, serta otomatis merekap laporan PDF mingguan & bulanan.',
    scenes: [
      {
        sceneTitle: '1. Login HP & Pilih Personil (Riyadi / Suwarno / Sopoyono)',
        durationSec: 6,
        highlightBadge: 'Akun Khusus Satpam',
        mockupFocus: 'Login username: riyadi / suwarno / sopoyono -> Otomatis buka Absensi Satpam',
        actionSteps: [
          'Buka aplikasi di HP, masuk dengan username riyadi, suwarno, atau sopoyono (sandi: darussalam2026).',
          'Sistem langsung membuka tab Absensi Satpam (HP) dan menampilkan Shift Jaga aktif.',
        ],
        narration: 'Pak Riyadi, Pak Suwarno, maupun Pak Sopoyono tinggal login di HP masing-masing. Sistem langsung membuka layar absensi keamanan sesuai shift jaga.',
      },
      {
        sceneTitle: '2. Cek In Swafoto Pos, Istirahat & Cek Out Shift',
        durationSec: 6,
        highlightBadge: 'Kamera + GPS Pos',
        mockupFocus: 'Pilih Shift Pagi/Sore/Malam/Ronda -> Cek In Swafoto -> Istirahat -> Cek Out',
        actionSteps: [
          'Pilih shift (Pagi, Sore, Malam, atau Slot Kontrol Ronda Malam).',
          'Tekan "Cek In Swafoto + GPS", ambil foto di pos keamanan, lalu konfirmasi.',
          'Saat berganti shift, tekan "Cek Out" untuk mencatat total jam jaga.',
        ],
        narration: 'Saat mulai bertugas di pos gerbang atau patroli malam, satpam menekan Cek In Swafoto sehingga jam hadir dan lokasi GPS terekam akurat.',
      },
      {
        sceneTitle: '3. Absen Pengajuan, Tukar Shift & Rekap PDF',
        durationSec: 6,
        highlightBadge: 'Verifikasi & Arsip PDF',
        mockupFocus: 'Ajukan Kendala/Tukar Shift -> Disetujui Koordinator -> Unduh PDF Mingguan/Bulanan',
        actionSteps: [
          'Jika sinyal GPS lemah di area asrama atau ingin bertukar shift, tekan Absen Pengajuan / Tukar Shift.',
          'Koordinator Keamanan / Pengasuh memverifikasi lalu mengunduh Rekap Mingguan & Bulanan Satpam dalam format PDF.',
        ],
        narration: 'Bila terjadi tukar shift atau kendala sinyal saat ronda, satpam cukup mengisi pengajuan dari HP untuk disetujui koordinator dan direkap dalam PDF.',
      },
    ],
  },
  {
    id: 'slide-14-pwa-hp',
    slideNumber: 14,
    title: 'Cara Mengunduh & Memasang Aplikasi di HP (Android & iPhone)',
    subtitle: 'Panduan Praktis untuk Pengasuh, Guru-Guru & Regu Satpam Tanpa Play Store',
    audiens: 'Semua',
    targetTags: ['Satpam', 'Guru', 'Pengasuh'],
    erpTab: 'panduan',
    diagramType: 'pwa_install',
    bullets: [
      'Teknologi Progressive Web App (PWA): ringan, hemat kuota, & langsung terpasang di layar utama HP.',
      'Android (Google Chrome): Buka link ERP -> ketuk "Unduh Aplikasi HP" atau titik tiga (⋮) -> "Install Aplikasi".',
      'iPhone / iPad (Safari): Tekan tombol Bagikan (Share) -> pilih "Tambah ke Layar Utama" (Add to Home Screen).',
      'Ikon aplikasi muncul layaknya aplikasi native lengkap dengan shortcut cepat modul.',
    ],
    speakerNotes:
      'Bapak Ibu Guru dan Pak Satpam tidak perlu mencari di Play Store yang penuh iklan. Cukup buka tautan web pondok di Chrome Android atau Safari iPhone, lalu tekan tombol Unduh Aplikasi HP atau Tambahkan ke Layar Utama.',
    scenes: [
      {
        sceneTitle: '1. Pemasangan di HP Android (Google Chrome)',
        durationSec: 6,
        highlightBadge: '1 Ketuk di Chrome',
        mockupFocus: 'Buka Link -> Klik "Unduh Aplikasi HP" -> Ikon Muncul di Layar Utama',
        actionSteps: [
          'Buka link sistem ERP pondok menggunakan browser Google Chrome di HP Android.',
          'Ketuk tombol "Unduh Aplikasi HP" berwarna hijau di bagian atas layar, atau menu titik tiga > Install Aplikasi.',
          'Tunggu 3 detik hingga ikon ERP Darussalam muncul di beranda HP Anda.',
        ],
        narration: 'Di HP Android, buka Chrome lalu tekan tombol Unduh Aplikasi HP. Dalam hitungan detik, ikon aplikasi akan terpasang di layar utama.',
      },
      {
        sceneTitle: '2. Pemasangan di iPhone / iPad (Safari)',
        durationSec: 5,
        highlightBadge: 'Safari Add to Home',
        mockupFocus: 'Buka Safari -> Ketuk Share -> Add to Home Screen',
        actionSteps: [
          'Buka tautan menggunakan browser Safari bawaan iPhone.',
          'Tekan ikon Share (kotak dengan panah ke atas), gulir ke bawah, lalu pilih Tambah ke Layar Utama.',
        ],
        narration: 'Untuk pengguna iPhone, cukup gunakan Safari, tekan ikon Share di bawah layar, lalu pilih Tambah ke Layar Utama.',
      },
    ],
  },
  {
    id: 'slide-15-akses-implementasi',
    slideNumber: 15,
    title: 'Hak Akses Peran, Keamanan Data & Rencana Uji Coba Bersama',
    subtitle: 'Matriks Wewenang Ketat & Pembagian Peran Pengasuh, Guru, Admin & Satpam',
    audiens: 'Pengasuh',
    targetTags: ['Pengasuh', 'Guru', 'Satpam', 'Admin/Staff'],
    erpTab: 'akses',
    diagramType: 'akses_role',
    bullets: [
      'Hak akses terpisah per peran: Pengasuh (kendali & persetujuan penuh), Ketua Imtihan, Bendahara, Guru, & Satpam.',
      'Setiap aksi sensitif (ubah nilai sidang, verifikasi kas, persetujuan izin) tercatat di Audit Log sistem.',
      'Tahapan implementasi bersama: 1) Pasang aplikasi di HP Guru & Satpam, 2) Uji coba Absensi & Imtihan, 3) Go-Live penuh.',
    ],
    speakerNotes:
      'Sebagai penutup presentasi di hadapan Pengasuh, Dewan Guru, dan Satpam: seluruh modul ini diamankan dengan pembatasan hak akses dan rekam jejak audit log. Mari kita lanjutkan dengan simulasi pemasangan aplikasi di HP Bapak/Ibu semua. Terima kasih, Wassalamu’alaikum Wr. Wb.',
    scenes: [
      {
        sceneTitle: '1. Matriks Wewenang & Audit Log',
        durationSec: 6,
        highlightBadge: 'Aman & Terkontrol',
        mockupFocus: 'Tabel Role Permission + Riwayat Audit Log Otomatis',
        actionSteps: [
          'Admin & Pengasuh dapat mengatur izin Baca/Tulis/Setujui/Cetak per peran.',
          'Seluruh perubahan nilai, transaksi kas, dan verifikasi tercatat beserta jam & nama petugas.',
        ],
        narration: 'Setiap peran hanya mengakses fitur sesuai tugasnya, sementara setiap perubahan penting terekam otomatis di log audit sistem.',
      },
    ],
  },
];
