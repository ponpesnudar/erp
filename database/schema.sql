-- =============================================================================
-- DATABASE SCHEMA: ERP PONDOK PESANTREN NU DARUSSALAM KARANGDADAP PEKALONGAN
-- Database Engine: PostgreSQL 14+ / 16
-- Charset: UTF-8 (Mendukung teks Pegon, Arab, dan Latin)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABEL PENGGUNA & HAK AKSES (11 Akun Struktural)
CREATE TABLE IF NOT EXISTS pengguna (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nama VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL,
    jabatan VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL MASTER SANTRI (366 Santri: 160 Putra, 206 Putri)
CREATE TABLE IF NOT EXISTS santri (
    id VARCHAR(50) PRIMARY KEY,
    nis VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(150) NOT NULL,
    jenis_kelamin VARCHAR(10) NOT NULL CHECK (jenis_kelamin IN ('L', 'P')),
    kelas VARCHAR(30) NOT NULL,
    kamar VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Alumni', 'Mutasi', 'Skorsing')),
    saldo_kartu NUMERIC(12, 2) DEFAULT 0,
    limit_harian NUMERIC(12, 2) DEFAULT 20000,
    status_kartu VARCHAR(20) DEFAULT 'Aktif' CHECK (status_kartu IN ('Aktif', 'Diblokir')),
    nama_wali VARCHAR(150),
    no_hp_wali VARCHAR(30),
    alamat TEXT,
    tanggal_masuk DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL MATA PELAJARAN IMTIHAN (Madrasah Diniyah Salafiyah)
CREATE TABLE IF NOT EXISTS mapel_imtihan (
    id VARCHAR(50) PRIMARY KEY,
    kode VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    nama_arab VARCHAR(100) NOT NULL,
    kitab VARCHAR(100),
    tingkat VARCHAR(20) NOT NULL CHECK (tingkat IN ('Ula', 'Wustho', 'Ulya')),
    kkm NUMERIC(5, 2) DEFAULT 60.00
);

-- 4. TABEL NASKAH SOAL IMTIHAN (Draf Guru & Panitia)
CREATE TABLE IF NOT EXISTS soal_imtihan (
    id VARCHAR(50) PRIMARY KEY,
    mapel_id VARCHAR(50) REFERENCES mapel_imtihan(id),
    mapel_nama VARCHAR(100) NOT NULL,
    mapel_arab VARCHAR(100) NOT NULL,
    kelas VARCHAR(30) NOT NULL,
    guru_id VARCHAR(50) REFERENCES pengguna(id),
    guru_nama VARCHAR(150) NOT NULL,
    status VARCHAR(20) DEFAULT 'Draf' CHECK (status IN ('Draf', 'Diajukan', 'Disetujui', 'Revisi')),
    tanggal_pengajuan DATE,
    catatan_reviewer TEXT,
    soal_data JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABEL NILAI SANTRI & RAPORT
CREATE TABLE IF NOT EXISTS nilai_santri (
    id VARCHAR(50) PRIMARY KEY,
    santri_id VARCHAR(50) REFERENCES santri(id),
    mapel_id VARCHAR(50) REFERENCES mapel_imtihan(id),
    semester VARCHAR(20) NOT NULL,
    tahun_ajaran VARCHAR(20) NOT NULL,
    nilai_angka NUMERIC(5, 2) NOT NULL,
    predikat VARCHAR(30) NOT NULL,
    predikat_arab VARCHAR(50) NOT NULL,
    catatan_guru TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABEL RANCANGAN ANGGARAN BIAYA (RAB) IMTIHAN
CREATE TABLE IF NOT EXISTS rab_imtihan (
    id VARCHAR(50) PRIMARY KEY,
    kategori VARCHAR(30) NOT NULL CHECK (kategori IN ('Pemasukan', 'Penggadaan', 'Insentif', 'Tunjangan', 'Perlengkapan', 'Konsumsi', 'UsulanTambahan')),
    keterangan VARCHAR(200) NOT NULL,
    qty NUMERIC(10, 2) NOT NULL DEFAULT 1,
    satuan VARCHAR(50) NOT NULL,
    harga NUMERIC(12, 2) NOT NULL DEFAULT 0,
    jumlah NUMERIC(12, 2) GENERATED ALWAYS AS (qty * harga) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABEL PRESENSI MADRASAH (MA'ARIFAN)
CREATE TABLE IF NOT EXISTS absensi_sesi (
    id VARCHAR(50) PRIMARY KEY,
    tanggal DATE NOT NULL,
    waktu_sesi VARCHAR(20) NOT NULL CHECK (waktu_sesi IN ('Subuh', 'Ashar', 'Maghrib', 'Isya')),
    kelas VARCHAR(30) NOT NULL,
    ustadz_id VARCHAR(50) REFERENCES pengguna(id),
    ustadz_nama VARCHAR(150) NOT NULL,
    total_santri INT NOT NULL,
    total_hadir INT NOT NULL,
    total_izin INT NOT NULL,
    total_sakit INT NOT NULL,
    total_alpa INT NOT NULL,
    detail_kehadiran JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. TABEL TRANSAKSI KARTU SANTRI (POS KANTIN & TOP UP)
CREATE TABLE IF NOT EXISTS transaksi_santri (
    id VARCHAR(50) PRIMARY KEY,
    santri_id VARCHAR(50) REFERENCES santri(id),
    jenis VARCHAR(20) NOT NULL CHECK (jenis IN ('TopUp', 'Belanja', 'Laundry', 'Penarikan')),
    nominal NUMERIC(12, 2) NOT NULL,
    keterangan VARCHAR(200),
    petugas_id VARCHAR(50) REFERENCES pengguna(id),
    saldo_sebelum NUMERIC(12, 2) NOT NULL,
    saldo_sesudah NUMERIC(12, 2) NOT NULL,
    waktu TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. TABEL PENERIMAAN SANTRI BARU (PSB)
CREATE TABLE IF NOT EXISTS psb_pendaftaran (
    id VARCHAR(50) PRIMARY KEY,
    nama_lengkap VARCHAR(150) NOT NULL,
    jenis_kelamin VARCHAR(10) NOT NULL CHECK (jenis_kelamin IN ('L', 'P')),
    nik VARCHAR(20),
    tempat_lahir VARCHAR(100),
    tanggal_lahir DATE,
    nama_wali VARCHAR(150) NOT NULL,
    no_hp_wali VARCHAR(30) NOT NULL,
    asal_sekolah VARCHAR(150),
    jalur VARCHAR(30) DEFAULT 'Reguler',
    status VARCHAR(30) DEFAULT 'Menunggu Verifikasi' CHECK (status IN ('Menunggu Verifikasi', 'Diverifikasi', 'Diterima', 'Ditolak')),
    nis_diberikan VARCHAR(20) UNIQUE,
    tanggal_daftar DATE DEFAULT CURRENT_DATE
);

-- 10. TABEL BIMBINGAN KONSELING & KETERTIBAN (BK)
CREATE TABLE IF NOT EXISTS pelanggaran_bk (
    id VARCHAR(50) PRIMARY KEY,
    santri_id VARCHAR(50) REFERENCES santri(id),
    santri_nama VARCHAR(150) NOT NULL,
    tanggal DATE DEFAULT CURRENT_DATE,
    pasal VARCHAR(100) NOT NULL,
    kategori VARCHAR(20) NOT NULL CHECK (kategori IN ('Ringan', 'Sedang', 'Berat')),
    poin_takzir INT NOT NULL,
    sanksi_takzir TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Proses' CHECK (status IN ('Proses', 'Selesai', 'Panggilan Wali')),
    keamanan_id VARCHAR(50) REFERENCES pengguna(id)
);

-- 11. TABEL PERSURATAN RESMI (SEKRETARIAT)
CREATE TABLE IF NOT EXISTS persuratan (
    id VARCHAR(50) PRIMARY KEY,
    nomor_surat VARCHAR(100) UNIQUE NOT NULL,
    jenis_surat VARCHAR(50) NOT NULL,
    perihal VARCHAR(200) NOT NULL,
    tujuan VARCHAR(150) NOT NULL,
    santri_id VARCHAR(50) REFERENCES santri(id),
    status VARCHAR(20) DEFAULT 'Draf' CHECK (status IN ('Draf', 'Diajukan', 'Disetujui', 'Diterbitkan')),
    tanggal DATE DEFAULT CURRENT_DATE
);

-- 12. TABEL AUDIT LOGS (JEJAK AKTIVITAS SISTEM)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    waktu TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(50),
    user_nama VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL,
    modul VARCHAR(50) NOT NULL,
    aksi VARCHAR(50) NOT NULL,
    detail TEXT NOT NULL
);

-- INDEXES UNTUK KINERJA TINGGI
CREATE INDEX IF NOT EXISTS idx_santri_nis ON santri(nis);
CREATE INDEX IF NOT EXISTS idx_santri_kelas ON santri(kelas);
CREATE INDEX IF NOT EXISTS idx_transaksi_santri_id ON transaksi_santri(santri_id);
CREATE INDEX IF NOT EXISTS idx_nilai_santri_mapel ON nilai_santri(santri_id, mapel_id);
CREATE INDEX IF NOT EXISTS idx_audit_waktu ON audit_logs(waktu DESC);
