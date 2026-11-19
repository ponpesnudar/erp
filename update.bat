@echo off
REM =========================================================================
REM update.bat - Skrip Pembaruan Otomatis ERP PP NU Darussalam Karangdadap
REM Dijadwalkan di Windows Task Scheduler setiap 5 menit
REM =========================================================================

echo [%date% %time%] Memeriksa pembaruan repository git...
cd /d "%~dp0"

git fetch origin main
git status -uno | findstr /C:"behind" >nul
if %errorlevel% equ 0 (
    echo [%date% %time%] Pembaruan ditemukan. Menjalankan proses update...
    git pull origin main
    echo [%date% %time%] Memasang dependensi baru...
    call npm ci
    echo [%date% %time%] Membangun aplikasi produksi...
    call npm run build
    echo [%date% %time%] Merestart layanan PM2...
    call pm2 restart erp-darussalam
    echo [%date% %time%] Update selesai dengan sukses!
) else (
    echo [%date% %time%] Aplikasi sudah menggunakan versi terbaru.
)
