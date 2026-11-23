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
  Video,
  Presentation,
} from 'lucide-react';
import { PWAInstallButton } from '../../components/pwa/PWAInstallButton.tsx';
import { PanduanPresentationStudio } from './PanduanPresentationStudio.tsx';

export const PanduanModule: React.FC = () => {
  const [studioTab, setStudioTab] = useState<'ppt' | 'video' | 'buku'>('video');
  const [openGuide, setOpenGuide] = useState<string>('satpam');

  const guides = [
    {
      id: 'satpam',
      title: 'Panduan Absensi Satpam HP (Pak Riyadi, Pak Suwarno, Pak Sopoyono)',
      icon: Shield,
      steps: [
        'Pasang aplikasi ERP ke HP Android (Chrome > Install Aplikasi) atau iPhone (Safari > Tambah ke Layar Utama) melalui kartu Pemasangan Aplikasi HP di menu Buku Panduan ini.',
        'Login menggunakan username pribadi masing-masing (riyadi, suwarno, atau sopoyono) dan kata sandi resmi yang diberikan Admin di Hak Akses Role.',
        'Pilih shift jaga aktif (Pagi 07-15, Sore 15-23, Malam 23-07, atau Slot Kontrol Ronda Malam), lalu tekan "Cek In Swafoto + GPS".',
        'Gunakan tombol "Istirahat" untuk jeda sholat/makan, "Cek Out" saat selesai bertugas, atau "Absen Pengajuan / Tukar Shift" jika ada kendala sinyal GPS atau pergantian regu.',
        'Koordinator Keamanan / Pengasuh dapat memantau foto absensi, menyetujui pengajuan, serta mengunduh Rekap Mingguan dan Bulanan dalam format PDF.',
      ],
    },
    {
      id: 'imtihan',
      title: 'Panduan Imtihan, Majlis Ilmiah (Hadits & Munaqosyah 3D) & Sidang Kenaikan',
      icon: FileCheck,
      steps: [
        'Guru Pengampu menyusun naskah soal berhuruf Arab/Pegon di menu "Naskah Soal Guru" lalu mengklik tombol "Ajukan ke Panitia".',
        'Panitia Imtihan mereview naskah soal, lalu mencetak blanko resmi serta mengacak Denah 7 Ruang Ujian anti-contek.',
        'Pada Sidang Kenaikan Kelas, nilai Cawu 1 & 2, Absensi KBM (Sakit 0, Bolos -3), Ubudiyah, Amaliyah & MQK direkap otomatis; santri di bawah KKM 65 memicu notifikasi jadwal sidang untuk Pengasuh & Panitia.',
        'Di Modul Majlis Ilmiah & Munaqosyah 3D, panitia memantau antrean 4 bangku penguji real-time, mengunduh laporan akhir PDF, serta menggunakan Halaqah Perumusan Hadits (Ruang Hadis 51 Kitab).',
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
      title: 'Panduan Laporan Keuangan (Neraca, Laba/Rugi, Cashflow) & Syahriyah',
      icon: DollarSign,
      steps: [
        'Sub-menu Laporan Keuangan Bendahara menyajikan Neraca (terhubung nilai aset Sarpras), Laba/Rugi, serta Cashflow dengan rincian Buku Besar (GL) yang bisa diklik per akun.',
        'Menu Pembayaran Bulanan, Daftar Ulang & Kema\'hadiyahan menjaga data piutang secara mandiri sehingga santri keluar/boyong yang masih memiliki tanggungan tetap terdeteksi.',
        'Pada menu RAB Imtihan & Bisyaroh Guru, seluruh rincian realisasi anggaran tersaji transparan siap cetak F4/A4.',
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-700" />
            <span>Pusat Tutorial Video, Slide Presentasi PPT &amp; Buku Panduan ERP</span>
          </h2>
          <p className="text-xs text-slate-500">
            Video panduan interaktif seluruh modul, slide presentasi kombinasi gambar &amp; teks (.pptx) untuk Pengasuh, Dewan Guru, dan Satpam, serta arsip database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'video', label: 'Video Tutorial Semua Modul', icon: Video },
            { id: 'ppt', label: 'Slide PPT (Gambar + Teks) & Unduh .pptx', icon: Presentation },
            { id: 'buku', label: 'Buku Panduan & Database', icon: BookOpen },
          ].map((tb) => {
            const Icon = tb.icon;
            return (
              <button
                key={tb.id}
                type="button"
                onClick={() => setStudioTab(tb.id as typeof studioTab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                  studioTab === tb.id
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tb.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {studioTab === 'video' && <PanduanPresentationStudio initialMode="video" />}
      {studioTab === 'ppt' && <PanduanPresentationStudio initialMode="ppt" />}

      {studioTab === 'buku' && (
      <div className="space-y-6">
        {/* Pusat Pemasangan Aplikasi Absensi Mobile di HP (PWA) */}
        <div className="rounded-3xl bg-linear-to-r from-emerald-950 via-emerald-900 to-teal-900 p-5 sm:p-6 text-white shadow-lg border border-emerald-800/60">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-amber-300 border border-white/15">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Aplikasi Mobile PWA · Android &amp; iPhone</span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                Pasang Aplikasi Absensi Guru &amp; Satpam Langsung di HP
              </h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Instal aplikasi ERP langsung ke layar utama HP Android (Chrome) atau iPhone (Safari) untuk akses cepat Absensi Swafoto GPS Guru, Absensi Jaga Regu Satpam, Naskah Soal, &amp; Portal Wali Santri tanpa perlu Play Store.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="rounded-xl bg-white/10 border border-white/15 px-3 py-2">
                  <p className="font-bold text-amber-300">Android (Google Chrome)</p>
                  <p className="text-emerald-100 mt-0.5">Tekan tombol Pasang di samping atau menu titik tiga Chrome → Install Aplikasi.</p>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/15 px-3 py-2">
                  <p className="font-bold text-amber-300">iPhone / iPad (Safari)</p>
                  <p className="text-emerald-100 mt-0.5">Buka di Safari → tekan ikon Bagikan (Share) → pilih Tambah ke Layar Utama.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
              <PWAInstallButton variant="button" />
              <span className="text-[10px] text-emerald-200/80">
                Pengelolaan akun &amp; kata sandi login terpusat di menu Hak Akses Role.
              </span>
            </div>
          </div>
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
      )}
    </div>
  );
};
