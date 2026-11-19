@echo off
REM =========================================================================
REM backup.bat - Skrip Backup Harian Database ERP Pondok Pesantren NU Darussalam
REM Dijadwalkan di Windows Task Scheduler setiap hari pukul 02.00 WIB
REM =========================================================================

set BACKUP_DIR=%~dp0backups
set TIMESTAMP=%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo [%date% %time%] Memulai pencadangan database PostgreSQL ERP...
docker exec -t erp_darussalam_db pg_dump -U darussalam_user erp_darussalam > "%BACKUP_DIR%\erp_darussalam_%TIMESTAMP%.sql"

echo [%date% %time%] Backup selesai tersimpan di: %BACKUP_DIR%\erp_darussalam_%TIMESTAMP%.sql
REM Menghapus backup yang berumur lebih dari 30 hari
forfiles /p "%BACKUP_DIR%" /s /m *.sql /d -30 /c "cmd /c del @path"
