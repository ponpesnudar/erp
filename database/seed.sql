-- =============================================================================
-- SEED DATA: ERP PONDOK PESANTREN NU DARUSSALAM KARANGDADAP
-- Data awal realistis untuk demo langsung di komputer lokal
-- =============================================================================

-- 1. SEED PENGGUNA (11 Akun Berdasarkan Jabatan Struktural Pondok)
INSERT INTO pengguna (id, username, password_hash, nama, role, jabatan, email) VALUES
('usr-1', 'admin', '$2b$10$demo_hash_admin', 'Nidhomul Muna Lana', 'admin_sistem', 'Administrator Sistem IT', 'admin@darussalam.test'),
('usr-2', 'pengasuh', '$2b$10$demo_hash_pengasuh', 'KH. Amin Maizun', 'pengasuh', 'Pengasuh Pondok Pesantren', 'pengasuh@darussalam.test'),
('usr-3', 'lurah', '$2b$10$demo_hash_lurah', 'Ust. Nidhomul Muna Lana', 'lurah_pondok', 'Lurah Pondok (Ketua Imtihan)', 'lurah@darussalam.test'),
('usr-4', 'bendahara', '$2b$10$demo_hash_bendahara', 'M. Abdul Fataah', 'bendahara', 'Bendahara Pondok & Imtihan', 'bendahara@darussalam.test'),
('usr-5', 'sekretaris', '$2b$10$demo_hash_sekretaris', 'Ahmad Khoirul Anam', 'sekretaris', 'Sekretaris Pondok', 'sekretaris@darussalam.test'),
('usr-6', 'maarifan', '$2b$10$demo_hash_maarifan', 'Ust. Syarif Hidayatullah', 'bagian_maarifan', 'Kepala Madrasah Diniyah', 'maarifan@darussalam.test'),
('usr-7', 'keamanan', '$2b$10$demo_hash_keamanan', 'Ust. M. Ridwan', 'keamanan_bk', 'Bagian Keamanan & Ketertiban', 'keamanan@darussalam.test'),
('usr-8', 'panitia_psb', '$2b$10$demo_hash_psb', 'Ust. H. Fauzi', 'panitia_psb', 'Ketua Panitia PSB', 'psb@darussalam.test'),
('usr-9', 'guru_fiqih', '$2b$10$demo_hash_guru1', 'Ust. Abdurrahman', 'guru_asatidz', 'Guru Mapel Fiqih & Fathul Qorib', 'guru1@darussalam.test'),
('usr-10', 'kasir_kantin', '$2b$10$demo_hash_kasir', 'Siti Maryam', 'kasir_kantin', 'Pengelola Kantin Cashless', 'kantin@darussalam.test'),
('usr-11', 'wali_santri', '$2b$10$demo_hash_wali', 'H. Sutarjo (Wali Zidni)', 'wali_santri', 'Wali Santri Kelas 2 MDS A', 'wali@darussalam.test')
ON CONFLICT (id) DO NOTHING;

-- 2. SEED MATA PELAJARAN IMTIHAN (MDS ULA, WUSTHO, ULYA)
INSERT INTO mapel_imtihan (id, kode, nama, nama_arab, kitab, tingkat, kkm) VALUES
('mpl-1', 'FIQ-1', 'Fiqih Mabadi Fiqhiyyah', 'الفقه', 'Mabadi Al-Fiqhiyyah Juz 1-3', 'Ula', 65.00),
('mpl-2', 'NAH-1', 'Nahwu Al-Jurumiyyah', 'النحو', 'Matan Al-Ajurumiyyah', 'Ula', 60.00),
('mpl-3', 'SHO-1', 'Shorof Amtsilah Tashrifiyyah', 'الصرف', 'Al-Amtsilah At-Tashrifiyyah', 'Ula', 60.00),
('mpl-4', 'TAW-1', 'Tauhid Aqidatul Awam', 'التوحيد', 'Mandhumah Aqidatul Awam', 'Ula', 70.00),
('mpl-5', 'AKH-1', 'Akhlaq Taisirul Kholaq', 'الأخلاق', 'Taisir Al-Kholaq', 'Ula', 75.00),
('mpl-6', 'TRK-1', 'Tarikh Khulashoh Nurul Yaqin', 'التاريخ', 'Khulashoh Nurul Yaqin Juz 1', 'Ula', 65.00),
('mpl-7', 'HDT-1', 'Hadits Al-Arbain An-Nawawiyyah', 'الحديث', 'Al-Arbain An-Nawawiyyah', 'Wustho', 65.00),
('mpl-8', 'FIQ-2', 'Fiqih Fathul Qorib Al-Mujib', 'فتح القريب', 'Fathul Qorib Al-Mujib', 'Wustho', 65.00)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED MASTER SANTRI (Sampel Representatif Sesuai Denah & Kartu Ujian Lampiran)
INSERT INTO santri (id, nis, nama, jenis_kelamin, kelas, kamar, status, saldo_kartu, limit_harian, nama_wali, no_hp_wali) VALUES
('str-1', '24.1.001', 'Muhammad Zidni Albi Falakhi', 'L', '2 MDS A', 'Kamar Al-Falah 1', 'Aktif', 85000, 25000, 'H. Sutarjo', '081234567801'),
('str-2', '24.1.002', 'Ahmad Farhan Hidayat', 'L', '1 MDS A', 'Kamar Al-Falah 2', 'Aktif', 45000, 20000, 'Supriyanto', '081234567802'),
('str-3', '24.1.003', 'M. Rizqi Maulana', 'L', '1 MDS B', 'Kamar An-Nur 1', 'Aktif', 120000, 25000, 'H. Mahmud', '081234567803'),
('str-4', '24.1.004', 'Faiz Abdul Halim', 'L', '2 MDS B', 'Kamar An-Nur 2', 'Aktif', 60000, 20000, 'Abdul Ghofur', '081234567804'),
('str-5', '24.1.005', 'Wildan Nur Wahid', 'L', '3 MDS A', 'Kamar Al-Barokah', 'Aktif', 95000, 30000, 'Wahidin', '081234567805'),
('str-6', '24.2.001', 'Fatimah Zahra Azzahro', 'P', '1 MDS A', 'Kamar Fatimah 1', 'Aktif', 150000, 25000, 'Drs. H. Munir', '081234567806'),
('str-7', '24.2.002', 'Naila Syarifah Al-Idrus', 'P', '1 MDS B', 'Kamar Fatimah 2', 'Aktif', 80000, 20000, 'Habib Sholeh', '081234567807'),
('str-8', '24.2.003', 'Aisyah Nur Rohmah', 'P', '2 MDS A', 'Kamar Aisyah 1', 'Aktif', 55000, 20000, 'H. Romadhon', '081234567808'),
('str-9', '24.2.004', 'Khadijah Salma Mubarok', 'P', '2 MDS B', 'Kamar Aisyah 2', 'Aktif', 110000, 25000, 'Barokah', '081234567809'),
('str-10', '24.2.005', 'Zulfa Lailatul Qomariyah', 'P', '3 MDS A', 'Kamar Khadijah', 'Aktif', 70000, 20000, 'H. Qomaruddin', '081234567810')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED RANCANGAN ANGGARAN BIAYA (RAB) IMTIHAN 1 (Persis Lampiran Fisik)
INSERT INTO rab_imtihan (id, kategori, keterangan, qty, satuan, harga) VALUES
('rab-in-1', 'Pemasukan', 'Iuran santri (pembayar)', 360, 'Santri', 30000),
('rab-out-1', 'Penggadaan', 'Semua kelas (soal tertulis)', 2901, 'Lembar', 300),
('rab-out-2', 'Insentif', 'Penyusunan soal', 93, 'Paket', 10000),
('rab-out-3', 'Insentif', 'Koreksi lembar jawaban', 2807, 'Lembar', 1000),
('rab-out-4', 'Insentif', 'Pengawas ruang 4 malam', 138, 'Jam', 10000),
('rab-out-5', 'Insentif', 'Pengisian rapor santri', 366, 'Santri', 1000),
('rab-out-6', 'Insentif', 'Piket imtihan', 12, 'Orang', 20000),
('rab-out-7', 'Tunjangan', 'Ketua Pelaksana', 1, 'Orang', 250000),
('rab-out-8', 'Tunjangan', 'Wakil Ketua', 1, 'Orang', 150000),
('rab-out-9', 'Tunjangan', 'Sekretaris (2 orang)', 2, 'Orang', 150000),
('rab-out-10', 'Tunjangan', 'Bendahara (2 orang)', 2, 'Orang', 150000),
('rab-out-11', 'Tunjangan', 'Pengeditan soal (2 orang)', 2, 'Orang', 150000),
('rab-out-12', 'Tunjangan', 'Penggandaan soal', 1, 'Orang', 100000),
('rab-out-13', 'Tunjangan', 'Perlengkapan', 1, 'Orang', 100000),
('rab-out-14', 'Tunjangan', 'Konsumsi', 1, 'Orang', 100000),
('rab-out-15', 'Perlengkapan', 'HVS 70 F4 warna', 2, 'Rim', 75000),
('rab-out-16', 'Perlengkapan', 'Lakban bening', 3, 'Pcs', 12000),
('rab-out-17', 'Perlengkapan', 'Amplop soal', 2, 'Pack', 38000),
('rab-out-18', 'Perlengkapan', 'Buffalo kuning', 1, 'Pack', 35000),
('rab-out-19', 'Perlengkapan', 'Buffalo biru', 1, 'Pack', 35000),
('rab-out-20', 'Perlengkapan', 'Buffalo hijau', 1, 'Pack', 35000),
('rab-out-21', 'Perlengkapan', 'Amplop nilai', 1, 'Pack', 38000),
('rab-out-22', 'Konsumsi', 'Snack makanan ringan 4 hari', 4, 'Hari', 85000),
('rab-out-23', 'Konsumsi', 'Kopi', 1, 'Pack', 20000),
('rab-out-24', 'Konsumsi', 'Teh', 1, 'Pack', 15000),
('rab-out-25', 'Konsumsi', 'Gula pasir', 2, 'Kg', 20000),
('rab-out-26', 'Konsumsi', 'Es batu 4 hari', 4, 'Hari', 10000),
('rab-out-27', 'Konsumsi', 'Lemburan panitia 3 hari', 3, 'Hari', 75000),
('rab-out-28', 'Konsumsi', 'Konsumsi rapat panitia', 1, 'Hari', 50000),
('rab-out-29', 'Konsumsi', 'Lain-lain / insidental', 1, 'Paket', 300000),
('rab-out-30', 'Konsumsi', 'Konsumsi MHF (Musabaqoh Hifdzi Nadhom)', 1, 'Hari', 50000),
('rab-opt-1', 'UsulanTambahan', 'Buku harian guru (nilai harian)', 35, 'Buku', 15000),
('rab-opt-2', 'UsulanTambahan', 'Buku absensi saku guru', 35, 'Buku', 5000)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED NASKAH SOAL CONTOH (Sesuai Lampiran E)
INSERT INTO soal_imtihan (id, mapel_id, mapel_nama, mapel_arab, kelas, guru_id, guru_nama, status, tanggal_pengajuan, soal_data) VALUES
('soal-1', 'mpl-1', 'Fiqih Mabadi Fiqhiyyah', 'الفقه', 'الأول للبنين (أ / ب)*', 'usr-9', 'عبد الرحمن', 'Disetujui', '2026-11-20', '[
  {"nomor": "٠١", "pertanyaanArab": "أدا بَرافا ماچام- ماچام أَيْر يَاغ بوليه دي كُونَاكان أُونْتُوك برْسُوچِي ؟ سبُوتْكَان أفا سَاجَا !"},
  {"nomor": "٠٢", "pertanyaanArab": "كُولِيتْ- كُولِيت بَاغْكَاي بيناتَاغ مَنْجَادِي سُوچِي جِيكَا سُودَاه دي سَامَاك، بكايمَانَا چَارا مِيَامَاك كُولِيت تَرْسِبُوت ؟"},
  {"nomor": "٠٣", "pertanyaanArab": "مماكَاي سِيوَاك سَاغَات دي سُنَّة كَان سكالي فادا ٣ (تِيكَا) هَال، سبُوتْكَان أفا سَاجَا !"},
  {"nomor": "٠٤", "pertanyaanArab": "فَرْضُنْيَا وضُوء ادا بَرافَا ؟ سبُوتْكَان أفا سَاجَا !"},
  {"nomor": "٠٥", "pertanyaanArab": "سُنَّة- سُنَّةْنْيَا وضُوء ادا بَرافَا ؟ سبُوتْكَان ٥ (لِيمَا) سَاجَا !"}
]'::jsonb)
ON CONFLICT (id) DO NOTHING;
