# ERP Pondok Pesantren NU Darussalam Karangdadap, Pekalongan

Sistem Informasi Terpadu dan ERP Modern Pondok Pesantren NU Darussalam Karangdadap Pekalongan yang memadukan landing page publik, sistem imtihan berbasis Pegon/Arab, presensi diniyah salafiyah, transaksi non-tunai kantin santri, persuratan resmi, dan transparansi anggaran bulanan secara real-time.

---

## Fitur Utama

1. **Modul Imtihan & Ujian Lengkap**:
   - Penyusunan naskah soal berhuruf Arab/Pegon (RTL) oleh dewan guru.
   - Review dan approval naskah oleh Panitia Imtihan.
   - Cetak Blanko Soal Imtihan resmi (Kop Arab, kotak nilai, tabel identitas, penomoran Arab-Indic ٠١ ٠٢ ٠٣).
   - Denah Ujian Bebas Contek: Algoritma `generateSeating()` menyebar 366 santri merata ke 7 ruang dan mengacak kursi agar santri sekelas tidak saling bersebelahan.
   - Kartu Imtihan resmi (format No. IMT `2MD#079`, tabel paraf pengawas dengan arsir diagonal).
   - Raport Diniyah Salafiyah resmi dengan predikat Arab otomatis (`ممتاز`, `جيد جدا`, `جيد`, `مقبول`, `فاشل`).
   - Rancangan Anggaran Biaya (RAB) Imtihan 1 transparan sesuai lampiran fisik pondok.

2. **Ma'arifan (Madrasah Diniyah Salafiyah)**:
   - Presensi hadir tap cepat mobile-first santri dan dewan guru dengan tombol "Hadir Semua".
   - Sub-bab Riwayat tersimpan nyata di database dengan jejak audit.

3. **Bendahara & Transparansi Anggaran**:
   - Rekapitulasi anggaran bulanan otomatis (realisasi penerimaan vs pengeluaran, varian surplus/defisit).
   - Pembatasan ketat: Grafik arus kas dan saldo kas hanya bisa diakses oleh Pengasuh dan Bendahara.

4. **Transaksi Santri & POS Kantin**:
   - Sistem cashless dengan tap kartu RFID digital santri.
   - POS Kasir touchscreen dengan penolakan otomatis jika saldo kurang atau melebihi limit harian.
   - Portal Wali Santri untuk top up saldo, riwayat jajan, atur batas jajan per hari, dan kunci kartu.
   - Unit Usaha Laundry Pondok (santri tidak mencuci pakaian sendiri).

5. **Penerimaan Santri Baru (PSB)**:
   - Pendaftaran online, antrean verifikasi berkas, dan tombol "Jadikan Santri" yang menerbitkan NIS dinamis atomik tanpa hard-code.

6. **Hak Akses & Role ERP (Lampiran A)**:
   - Peta wewenang bertingkat dengan chip aksi berwarna yang dapat diklik untuk mengubah izin secara instan.
   - Fitur "Lihat Sebagai Peran" untuk simulasi akses oleh Administrator.

7. **Aplikasi Siap Pasang PWA (Progressive Web App)**:
   - Tombol "Unduh Aplikasi HP" langsung dari browser tanpa perlu Google Play Store.
   - Dukungan offline cache dan panduan ramah untuk iOS Safari.

---

## Panduan Pemasangan di Komputer Pondok (Operasional 24 Jam)

### Opsi A: Menggunakan Docker Desktop (Sangat Direkomendasikan)
1. Pasang **Docker Desktop** di komputer Windows pondok.
2. Buka Command Prompt atau PowerShell di folder proyek ini:
   ```cmd
   docker-compose up -d
   ```
3. Buka browser dan akses: `http://localhost:3000`
4. Endpoint cek kesehatan sistem: `http://localhost:3000/health`

### Opsi B: Menggunakan Node.js + PM2 (Auto-Start saat Komputer Menyala)
1. Pasang **Node.js LTS (v20+)** dan **Git** di komputer Windows pondok.
2. Jalankan perintah instalasi:
   ```cmd
   npm install
   npm install -g pm2
   npm run build
   ```
3. Daftarkan aplikasi ke PM2 agar menyala otomatis saat komputer dinyalakan:
   ```cmd
   pm2 start server.ts --name erp-darussalam --interpreter tsx
   pm2 save
   pm2 startup
   ```

---

## Menghubungkan Akses dari Luar Jaringan Pondok (Cloudflare Tunnel)
Guru dan wali santri dapat mengakses sistem dari rumah secara aman tanpa membuka port router:
1. Pasang `cloudflared` di komputer pondok.
2. Hubungkan domain pondok:
   ```cmd
   cloudflared tunnel run erp-darussalam
   ```
3. Sistem dapat diakses melalui HTTPS dengan enkripsi SSL/TLS penuh.

---

## Penjadwalan Otomatis di Windows Task Scheduler
1. **Pembaruan Otomatis (update.bat)**:
   - Buka `Task Scheduler` di Windows.
   - Buat tugas baru: jalankan file `update.bat` setiap 5 menit.
   - Skrip akan otomatis menarik kode terbaru dari GitHub (`git pull`), mengompilasi, dan merestart aplikasi tanpa henti.
2. **Pencadangan Otomatis (backup.bat)**:
   - Jadwalkan `backup.bat` setiap hari pukul 02.00 WIB.
   - Salinan database PostgreSQL akan tersimpan rapi di folder `backups/` dengan retensi 30 hari.

---
**Pondok Pesantren NU Darussalam Karangdadap, Pekalongan**
Jl. Raya Karangdadap Km 1, Kec. Karangdadap, Kab. Pekalongan 51173
Email: nudarussalam21@gmail.com
