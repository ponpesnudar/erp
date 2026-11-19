@echo off
title ERP Pondok Pesantren NU Darussalam Karangdadap - Demo Runner
color 0A
cls

echo =========================================================================
echo   ERP PONDOK PESANTREN NU DARUSSALAM KARANGDADAP PEKALONGAN
echo   Sistem Informasi & Manajemen Santri Terintegrasi (Siap Demo)
echo =========================================================================
echo.
echo Pilih metode demo di komputer Anda:
echo [1] Jalankan dengan Docker (Rekomendasi: App + Database PostgreSQL Otomatis)
echo [2] Jalankan Langsung dengan Node.js / Vite (Cepat & Ringan tanpa Docker)
echo [3] Keluar
echo.
set /p pilihan="Masukkan nomor pilihan [1/2/3]: "

if "%pilihan%"=="1" goto DOCKER_MODE
if "%pilihan%"=="2" goto NODE_MODE
if "%pilihan%"=="3" goto SELESAI
goto SELESAI

:DOCKER_MODE
echo.
echo [1/3] Memeriksa status Docker Desktop...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker belum terpasang atau belum berjalan di komputer ini!
    echo Silakan jalankan Docker Desktop terlebih dahulu atau pilih opsi [2] Node.js.
    pause
    goto SELESAI
)
echo [2/3] Membangun container dan menginisialisasi Database PostgreSQL...
docker compose up -d --build
if %errorlevel% neq 0 (
    echo [ERROR] Gagal menjalankan docker compose!
    pause
    goto SELESAI
)
echo [3/3] Membuka aplikasi ERP di browser...
timeout /t 3 >nul
start http://localhost:3000
echo.
echo =========================================================================
echo Aplikasi ERP Darussalam berhasil berjalan di: http://localhost:3000
echo Database PostgreSQL aktif pada port 5432 (user: darussalam_user)
echo.
echo Akun Demo Resmi:
echo - Pengasuh: pengasuh (KH. Amin Maizun)
echo - Lurah: lurah (Ust. Nidhomul Muna Lana - Ketua Imtihan)
echo - Bendahara: bendahara (M. Abdul Fataah)
echo - Admin: admin
echo.
echo Untuk menghentikan sistem, jalankan: docker compose down
echo =========================================================================
pause
goto SELESAI

:NODE_MODE
echo.
echo [1/3] Memeriksa instalasi Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js belum terpasang di komputer ini!
    echo Unduh Node.js LTS di https://nodejs.org
    pause
    goto SELESAI
)
echo [2/3] Memeriksa dependensi package...
if not exist node_modules (
    echo Menginstal modul dependensi (npm install)...
    call npm install
)
echo [3/3] Menjalankan server aplikasi (Vite Dev Server)...
start http://localhost:3000
call npm run dev
goto SELESAI

:SELESAI
exit
