import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  FileCheck,
  CreditCard,
  DollarSign,
  Shield,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Server,
  Database,
  CheckCircle2,
  HardDrive,
} from 'lucide-react';
import { PWAInstallButton } from '../../components/pwa/PWAInstallButton.tsx';

export const PanduanModule: React.FC = () => {
  const [openGuide, setOpenGuide] = useState<string>('imtihan');

  const guides = [
    {
      id: 'imtihan',
      title: 'Panduan Modul Imtihan (Ujian Santri)',
      icon: FileCheck,
      steps: [
        'Guru Pengampu menyusun naskah soal berhuruf Arab/Pegon di menu "Naskah Soal Guru" lalu mengklik tombol "Ajukan ke Panitia".',
        'Panitia Imtihan membuka menu "Review Panitia" untuk membaca teks soal, menyetujui, atau memberikan catatan revisi jika ada kesalahan redaksi.',
        'Setelah disetujui, buka menu "Cetak Blanko Soal" untuk mencetak lembar ujian resmi lengkap dengan kop pesantren, kotak nilai, tabel nama, dan soal berhuruf Arab-Indic.',
        'Panitia membuka menu "Denah & Tempat Duduk" lalu menekan tombol "Acak Ulang" untuk membagi santri ke 7 ruang dan memastikan tidak ada teman sekelas yang bersebelahan.',
        'Cetak kartu ujian peserta di menu "Kartu Imtihan" (format No. IMT 2MD#079 dengan tabel jadwal paraf pengawas di belakang).',
        'Setelah ujian selesai, input nilai santri di menu "Input Nilai" untuk menghasilkan raport resmi dengan predikat Arab otomatis.',
      ],
    },
    {
      id: 'transaksi',
      title: 'Panduan Kartu Santri & Kasir Kantin (POS)',
      icon: CreditCard,
      steps: [
        'Santri melakukan transaksi non-tunai di kantin pondok dengan melakukan tap kartu RFID.',
        'Kasir memilih menu makanan/minuman yang dibeli di layar kasir touchscreen.',
        'Sistem secara otomatis menolak transaksi bila saldo tidak mencukupi ATAU jika total belanja hari ini melampaui batas harian yang ditetapkan wali.',
        'Wali santri dari rumah dapat login ke portal untuk melihat riwayat jajan, mengatur batas belanja harian (Rp 15rb–50rb/hari), atau mengunci kartu bila hilang.',
        'Wali dapat melakukan top up saldo kartu kapan saja via QRIS atau Virtual Account.',
      ],
    },
    {
      id: 'keuangan',
      title: 'Panduan Transparansi Anggaran & Rekapitulasi Kas',
      icon: DollarSign,
      steps: [
        'Pengasuh dan Bendahara dapat memantau realisasi penerimaan syahriyah, infaq santri, dan pengeluaran operasional secara real-time.',
        'Buka menu "Rekapitulasi Anggaran Bulanan" untuk melihat perbandingan rencana anggaran (RAB) dengan realisasi kas serta persentase kinerja.',
        'Pada menu RAB Imtihan, rincian pengeluaran soal, insentif pengawas, konsumsi, dan tunjangan panitia tersaji transparan.',
      ],
    },
    {
      id: 'pwa',
      title: 'Panduan Pemasangan Aplikasi PWA di HP & Komputer',
      icon: Smartphone,
      steps: [
        'Aplikasi ERP ini adalah Progressive Web App (PWA) modern yang dapat diinstal langsung di layar utama smartphone Android maupun iOS tanpa perlu ke Play Store.',
        'Di Android/Chrome: Cukup klik tombol "Unduh Aplikasi HP" di header atas atau banner instalasi.',
        'Di iPhone/iPad (Safari): Tekan tombol Bagikan (Share) di bilah bawah lalu pilih "Tambah ke Layar Utama" (Add to Home Screen).',
        'Setelah terpasang, aplikasi dapat dibuka dalam mode layar penuh (standalone) dan mendukung akses baca saat jaringan offline.',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-700" />
          <span>Buku Panduan Operasional & Status Sistem ERP</span>
        </h2>
        <p className="text-xs text-slate-500">
          Petunjuk langkah demi langkah pengoperasian sistem dan parameter teknis komputer server pondok.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Step-by-Step Guides */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
            <h3 className="font-bold text-sm text-slate-900 mb-2">Petunjuk Penggunaan per Modul</h3>
            <p className="text-xs text-slate-500">
              Pilih modul di bawah untuk mempelajari alur kerja dan aturan sistem pesantren:
            </p>
          </div>

          <div className="space-y-3">
            {guides.map((g) => {
              const Icon = g.icon;
              const isOpen = openGuide === g.id;

              return (
                <div
                  key={g.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs transition"
                >
                  <button
                    onClick={() => setOpenGuide(isOpen ? '' : g.id)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-800 hover:text-emerald-800 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{g.title}</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-700" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
                      {g.steps.map((st, i) => (
                        <div key={i} className="flex items-start gap-2.5 leading-relaxed">
                          <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): System Status & Parameters */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-xs text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-700" />
              <span>Pengaturan & Status Sistem 24 Jam</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="flex justify-between">
                  <span className="text-slate-500">Versi Aplikasi:</span>
                  <strong className="text-slate-900 font-mono">v2.4.0 (PWA Production)</strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-500">Engine Backend:</span>
                  <strong className="text-slate-900 font-mono">Node.js + Express (Port 3000)</strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-500">Database Utama:</span>
                  <strong className="text-emerald-700 font-mono">PostgreSQL / Local Persistent</strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-500">Backup Otomatis:</span>
                  <strong className="text-emerald-700">Setiap Hari 02.00 WIB</strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-500">Pembaruan (update.bat):</span>
                  <strong className="text-slate-800">Auto Task Scheduler (Tiap 5 Menit)</strong>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Koneksi Aman Luar Pondok</span>
                </p>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Siap diakses oleh dewan guru dan wali santri di rumah melalui HTTPS dan Cloudflare Tunnel tanpa perlu membuka port router.
                </p>
              </div>

              {/* Tombol Unduh File Database untuk Demo Komputer Lokal */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Ekspor Database untuk Demo Komputer Lokal:</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/database/init.sql';
                      link.download = 'erp_darussalam_postgres.sql';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="w-full py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <HardDrive className="w-3 h-3 text-emerald-400" />
                    <span>Unduh Database SQL</span>
                  </button>

                  <button
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
                        JSON.stringify(localStorage, null, 2)
                      );
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", "erp_darussalam_local_data.json");
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="w-full py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-[11px] transition flex items-center justify-center gap-1.5"
                  >
                    <Database className="w-3 h-3 text-emerald-700" />
                    <span>Unduh Data JSON</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <PWAInstallButton variant="button" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
