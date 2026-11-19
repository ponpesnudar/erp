#!/bin/bash
# Script Demo Otomatis ERP PP NU Darussalam (Linux / macOS)

echo "========================================================================="
echo "  ERP PONDOK PESANTREN NU DARUSSALAM KARANGDADAP PEKALONGAN"
echo "  Sistem Informasi & Manajemen Santri Terintegrasi (Siap Demo)"
echo "========================================================================="
echo ""
echo "Pilih mode demo:"
echo "1) Docker (App + PostgreSQL Otomatis)"
echo "2) Node.js Lokal (npm run dev)"
echo "3) Keluar"
echo ""
read -p "Pilihan Anda [1/2/3]: " pilihan

case $pilihan in
  1)
    echo "Menjalankan dengan Docker Compose..."
    docker compose up -d --build
    echo "Membuka browser..."
    sleep 3
    if which xdg-open > /dev/null; then
      xdg-open http://localhost:3000
    elif which open > /dev/null; then
      open http://localhost:3000
    fi
    echo "Aplikasi berjalan di http://localhost:3000"
    ;;
  2)
    echo "Menjalankan secara lokal dengan Node.js..."
    if [ ! -d "node_modules" ]; then
      npm install
    fi
    if which xdg-open > /dev/null; then
      xdg-open http://localhost:3000 &
    elif which open > /dev/null; then
      open http://localhost:3000 &
    fi
    npm run dev
    ;;
  *)
    exit 0
    ;;
esac
