# Panduan Demo ERP Pondok Pesantren NU Darussalam Karangdadap di Komputer Lokal

Dokumen ini berisi panduan menjalankan aplikasi **ERP Pondok Pesantren NU Darussalam** dan **Database PostgreSQL** secara penuh di komputer atau laptop Anda.

---

## 🚀 Cara Menjalankan (Paling Mudah - 1 Klik)

Di Windows, Anda cukup **klik ganda (double click)** file:
```
jalankan-demo.bat
```
Script akan menampilkan menu interaktif:
- **Tekan 1**: Menjalankan dengan **Docker** (Aplikasi + Database PostgreSQL aktif otomatis).
- **Tekan 2**: Menjalankan langsung dengan **Node.js** (Sangat cepat dan ringan tanpa perlu Docker).

Browser Anda akan langsung terbuka otomatis ke alamat:
👉 **`http://localhost:3000`**

---

## 📦 Opsi 1: Menjalankan dengan Docker Desktop (App + Database PostgreSQL)

Pastikan **Docker Desktop** sudah berjalan di komputer Anda, lalu jalankan terminal pada folder proyek:
```bash
docker compose up -d --build
```
Setelah proses selesai:
- **Aplikasi Web**: `http://localhost:3000`
- **Database PostgreSQL**: Aktif di `localhost:5432`
  - Database: `erp_darussalam`
  - Username: `darussalam_user`
  - Password: `darussalam_pwd`
  - Skrip inisialisasi tabel dan data seed otomatis dieksekusi dari `database/init.sql`.

Untuk mematikan container:
```bash
docker compose down
```

---

## ⚡ Opsi 2: Menjalankan Langsung dengan Node.js (Tanpa Docker)

1. Pastikan Node.js 18+ atau 20+ sudah terinstal di komputer.
2. Buka terminal di folder proyek dan jalankan:
   ```bash
   npm install
   npm run dev
   ```
3. Buka browser ke: `http://localhost:3000`
   *Seluruh data 366 santri, RAB imtihan, akun, dan denah tetap tersimpan nyata secara persisten di Local Storage browser.*

---

## 🗄️ Berkas Database yang Disertakan

Seluruh berkas database telah disediakan di dalam folder `/database`:
1. **`database/schema.sql`**: Struktur DDL tabel PostgreSQL lengkap:
   - `pengguna` (11 akun struktural & hak akses)
   - `santri` (366 data santri, NIS, kamar, saldo RFID)
   - `mapel_imtihan` & `soal_imtihan` (Bank soal Pegon/Arab)
   - `nilai_santri` (Nilai angka & predikat Arab ممتاز، جيد جدا، dll.)
   - `rab_imtihan` (Rancangan Anggaran Biaya 5 kategori pokok + usulan tambahan)
   - `absensi_sesi` (Presensi subuh, ashar, maghrib, isya)
   - `transaksi_santri` (POS kantin cashless & top-up saldo)
   - `psb_pendaftaran` (Penerimaan santri baru online)
   - `pelanggaran_bk` (Poin takzir & keamanan)
   - `persuratan` & `audit_logs`
2. **`database/seed.sql`**: Data awal siap pakai (santri, kitab, rincian biaya asli lampiran).
3. **`database/init.sql`**: Gabungan schema + seed untuk migrasi instan.

> **Tips di Aplikasi**: Anda juga dapat mengunduh berkas `.sql` dan data `.json` kapan saja melalui menu **Pengaturan / Panduan > Status Sistem > Unduh Database SQL**.

---

## 👥 Akun Demo untuk Pengujian Fitur

Semua akun dapat digunakan dengan fitur **Autofill Cepat** pada halaman Login ERP:
1. **Pengasuh Pondok**: `pengasuh` (KH. Amin Maizun) – Hak wewenang penuh & persetujuan tertinggi.
2. **Lurah Pondok / Ketua Imtihan**: `lurah` (Ust. Nidhomul Muna Lana) – Pengelolaan ujian, denah bebas contek, blanko soal.
3. **Bendahara**: `bendahara` (M. Abdul Fataah) – Mengakses RAB Imtihan editable, rekap kas, dan penggajian.
4. **Administrator IT**: `admin` (Nidhomul Muna Lana) – Matriks role wewenang, sistem, dan konfigurasi NIS.
5. **Bagian Ma'arifan**: `maarifan` (Ust. Syarif Hidayatullah) – Presensi madrasah Diniyah santri.
6. **Kasir Kantin**: `kasir_kantin` (Siti Maryam) – Transaksi touchscreen santri & limit jajan.
7. **Wali Santri**: `wali_santri` (H. Sutarjo) – Portal wali memantau saku, nilai, dan rekap takzir.

---

## 📄 Komponen Blanko Soal Imtihan & RAB

- **Komponen Blanko Soal**: `src/features/imtihan/components/TemplateBlankoImtihan.tsx`
  - Kop resmi dengan logo pondok di kanan atas.
  - Kaligrafi Arab 3 baris dengan class `font-arabic` ber-RTL presisi.
  - Tabel identitas ujian dengan baris bertitik-titik (`border-bottom: 1px dotted`).
  - Siap cetak ukuran kertas F4 / Folio atau A4 via tombol cetak (`Ctrl + P`).
- **Komponen RAB Imtihan Editable**: `src/features/imtihan/components/RABImtihanEditor.tsx`
  - Inline spreadsheet editing pada QTY dan harga satuan dengan kalkulasi otomatis.
  - Saldo surplus real-time (Rp 1.121.700) dan opsi usulan tambahan.
