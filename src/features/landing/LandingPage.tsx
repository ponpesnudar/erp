import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Building,
  CheckCircle,
  Calendar,
  Clock,
  Shirt,
  Coffee,
  ChevronDown,
  ChevronUp,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Shield,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Download,
  Menu,
  X,
} from 'lucide-react';
import { PONDOK_CONFIG } from '../../data/seed/pondokData.ts';
import { AIAssistantModal } from '../../components/common/AIAssistantModal.tsx';
import { PWAInstallButton } from '../../components/pwa/PWAInstallButton.tsx';

interface LandingPageProps {
  onGoToLogin: () => void;
  onGoToPSB: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin, onGoToPSB }) => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [activeTabKurikulum, setActiveTabKurikulum] = useState<'ula' | 'wustho' | 'ulya'>('ula');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const faqs = [
    {
      q: "Apakah santri diizinkan mencuci pakaian sendiri?",
      a: "Di Pondok Pesantren NU Darussalam, santri tidak mencuci pakaian sendiri agar dapat mencurahkan waktu dan energinya untuk menghafal nadhom dan muthala'ah kitab kuning. Pakaian santri dikelola oleh Unit Usaha Laundry Pondok yang bersih, suci, dan wangi dengan biaya terjangkau.",
    },
    {
      q: "Berapa kapasitas dan pembagian kamar santri?",
      a: "Asrama pondok memiliki 9 kamar untuk santri putra (komplek Al-Falah, An-Nur, dll.) dan 10 kamar untuk santri putri (komplek Fatimah, Aisyah, dll.). Setiap kamar memiliki ventilasi alami yang baik dan almari pribadi santri.",
    },
    {
      q: "Bagaimana sistem pengelolaan uang jajan santri di kantin?",
      a: "Kantin pondok menerapkan sistem non-tunai (cashless) menggunakan Kartu Santri Digital RFID. Wali santri dapat membatasi kuota belanja harian anak dari rumah melalui portal wali santri dan melakukan top up saldo kapan saja.",
    },
    {
      q: "Apakah santri boleh membawa telepon genggam (smartphone)?",
      a: "Santri mukim reguler tidak diperkenankan membawa smartphone pribadi demi menjaga kekhusyukan belajar. Komunikasi dengan wali santri difasilitasi melalui wartel pondok dan nomor resmi pengasuh/pengurus asrama.",
    },
    {
      q: "Bagaimana dengan jenjang pendidikan formal?",
      a: "Santri mukim di Darussalam dapat bersekolah formal di lembaga pendidikan mitra sekitar pesantren (SMP / MTs / SMA / SMK) pada pagi hari, kemudian mengikuti Madrasah Diniyah Salafiyah (MDS) pada sore dan malam hari.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F3EA] text-slate-800 font-sans selection:bg-emerald-200">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
          {/* Logo & Brand (Single-row clean lockup) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <img
              src="/assets/aistudio/preview__14__3b7f388f.webp"
              alt="Logo PP NU Darussalam"
              className="w-10 h-10 object-contain shrink-0"
            />
            <div className="flex flex-col justify-center">
              <span className="font-extrabold text-emerald-950 text-sm sm:text-base tracking-tight whitespace-nowrap leading-tight">
                PP NU Darussalam
              </span>
              <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap leading-tight">
                Karangdadap · Kab. Pekalongan
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center gap-1 text-xs font-semibold text-slate-600">
            <a href="#profil" className="px-2.5 py-1.5 rounded-lg hover:text-emerald-900 hover:bg-emerald-50/80 transition whitespace-nowrap">
              Profil
            </a>
            <a href="#kegiatan" className="px-2.5 py-1.5 rounded-lg hover:text-emerald-900 hover:bg-emerald-50/80 transition whitespace-nowrap">
              Kegiatan 24 Jam
            </a>
            <a href="#fasilitas" className="px-2.5 py-1.5 rounded-lg hover:text-emerald-900 hover:bg-emerald-50/80 transition whitespace-nowrap">
              Fasilitas
            </a>
            <a href="#biaya" className="px-2.5 py-1.5 rounded-lg hover:text-emerald-900 hover:bg-emerald-50/80 transition whitespace-nowrap">
              Biaya & Syarat
            </a>
            <a href="#alur" className="px-2.5 py-1.5 rounded-lg hover:text-emerald-900 hover:bg-emerald-50/80 transition whitespace-nowrap">
              Alur Daftar
            </a>
            <a href="#faq" className="px-2.5 py-1.5 rounded-lg hover:text-emerald-900 hover:bg-emerald-50/80 transition whitespace-nowrap">
              Tanya Jawab
            </a>
          </div>

          {/* Action Buttons (Single-line height, never wrapping) */}
          <div className="flex items-center gap-2 shrink-0">
            <PWAInstallButton variant="header" />

            <button
              onClick={onGoToPSB}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 rounded-xl transition shadow-2xs whitespace-nowrap shrink-0"
            >
              <span>Daftar PSB</span>
            </button>

            <button
              onClick={onGoToLogin}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition shadow-xs whitespace-nowrap shrink-0"
            >
              <span>Masuk ERP</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Accordion Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
              <a
                href="#profil"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 transition"
              >
                Profil Pondok
              </a>
              <a
                href="#kegiatan"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 transition"
              >
                Kegiatan 24 Jam
              </a>
              <a
                href="#fasilitas"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 transition"
              >
                Fasilitas Kamar & Kantin
              </a>
              <a
                href="#biaya"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 transition"
              >
                Biaya & Syarat
              </a>
              <a
                href="#alur"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 transition"
              >
                Alur Pendaftaran
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 transition"
              >
                Tanya Jawab (FAQ)
              </a>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2 sm:hidden">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGoToPSB();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-300 text-center"
              >
                Daftar Santri Baru
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle geometric orbs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-900 text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Penerimaan Santri Baru Tahun Ajaran 2026/2027 Telah Dibuka</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-950 tracking-tight leading-tight">
                Mendidik Generasi Santri Berakhlaq Mulia & Mendalam Kitab Kuning
              </h1>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl">
                Pondok Pesantren NU Darussalam Karangdadap membina santri putra dan putri dalam tradisi salafiyah Ahlussunnah wal Jama'ah An-Nahdliyyah dengan sistem Madrasah Diniyah Salafiyah berjenjang serta fasilitas modern terpadu.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onGoToPSB}
                  className="px-6 py-3 rounded-xl bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md hover:bg-emerald-900 transition flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Daftar Santri Baru (PSB Online)</span>
                </button>
                <a
                  href="#biaya"
                  className="px-5 py-3 rounded-xl bg-white text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-bold shadow-xs hover:bg-emerald-50 transition flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>Rincian Biaya & Perlengkapan</span>
                </a>
              </div>

              {/* Badges */}
              <div className="pt-4 flex flex-wrap gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  Asrama Putra & Putri Terpisah
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  Laundry Dikelola Pondok
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  Kantin Cashless Tap RFID
                </span>
              </div>
            </div>

            {/* Right Card / Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-gradient-to-br from-emerald-900 to-emerald-950 p-6 sm:p-8 text-white shadow-2xl border border-emerald-800">
                <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="/assets/aistudio/preview__14__3b7f388f.webp"
                      alt="Logo Resmi"
                      className="w-14 h-14 bg-white/10 rounded-2xl p-1.5"
                    />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold">Lembaga Pesantren</p>
                      <h4 className="font-bold text-sm text-white">NU Darussalam Pekalongan</h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                    Salafiyah
                  </span>
                </div>

                <div className="mt-6 space-y-4 text-xs text-emerald-100">
                  <p className="leading-relaxed italic font-arabic text-base text-right text-emerald-200">
                    بالمعهد الإسلامي النهضي دار السلام كاراغداداف فكالوغان
                  </p>
                  <p className="leading-relaxed">
                    "Menjaga kemurnian sanad keilmuan ulama salaf, membina kecerdasan qalbiyah dan aqliyah santri untuk kemaslahatan umat dan bangsa."
                  </p>
                </div>

                {/* Micro Stats inside Card */}
                <div className="mt-6 grid grid-cols-3 gap-2 pt-4 border-t border-emerald-800/80 text-center">
                  <div className="p-2 rounded-xl bg-emerald-800/40">
                    <p className="text-xl font-extrabold text-amber-300 tabular-nums">366</p>
                    <p className="text-[10px] text-emerald-200">Santri Mukim</p>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-800/40">
                    <p className="text-xl font-extrabold text-amber-300 tabular-nums">35</p>
                    <p className="text-[10px] text-emerald-200">Dewan Asatidz</p>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-800/40">
                    <p className="text-xl font-extrabold text-amber-300 tabular-nums">19</p>
                    <p className="text-[10px] text-emerald-200">Kamar Asrama</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Ringkasan Angka / Profil */}
      <section id="profil" className="py-12 bg-white border-y border-emerald-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-900 tabular-nums">
                {PONDOK_CONFIG.statistik.totalSantri}
              </p>
              <p className="text-xs font-semibold text-slate-600 mt-1">Total Santri Mukim</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">160 Putra & 206 Putri</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-900 tabular-nums">
                {PONDOK_CONFIG.statistik.asatidz}
              </p>
              <p className="text-xs font-semibold text-slate-600 mt-1">Dewan Asatidz & Ustadzah</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">Alumni Pesantren Salaf</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-900 tabular-nums">19</p>
              <p className="text-xs font-semibold text-slate-600 mt-1">Kamar Asrama Santri</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">9 Putra & 10 Putri</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-900 tabular-nums">12</p>
              <p className="text-xs font-semibold text-slate-600 mt-1">Ruang Madrasah Diniyah</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">Kelas 1 s.d. 6 MDS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 & 4: Visi Misi & Sejarah & Pengasuh */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Visi Misi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-3xl bg-white p-8 border border-emerald-900/10 shadow-xs space-y-4">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                Visi Pesantren
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Terwujudnya Santri yang 'Alim, Berakhlak Karimah, Mandiri, dan Teguh Berpegang pada Sunnah Wal Jama'ah.
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mempersiapkan kader ulama dan cendekiawan muslim yang memiliki kedalaman ilmu agama, kepekaan sosial, serta kesiapan menghadapi tantangan zaman.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 border border-emerald-900/10 shadow-xs space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                Misi Pesantren
              </span>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                  <span>Menyelenggarakan pendidikan madrasah diniyah salafiyah dengan standar muthala'ah kitab kuning yang kokoh.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                  <span>Membiasakan amaliyah ubudiyah, wirid harian, dan keteladanan akhlakul karimah dalam keseharian santri.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                  <span>Menyediakan lingkungan asrama yang bersih, tertib, dan kondusif untuk tholabul 'ilmi.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pengasuh Pondok */}
          <div className="rounded-3xl bg-emerald-900 text-white p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center gap-8">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-white/10 border-2 border-emerald-600/50 p-2 shrink-0 flex items-center justify-center">
              <img
                src="/assets/aistudio/preview__14__3b7f388f.webp"
                alt="Logo Pondok"
                className="w-24 h-24 object-contain"
              />
            </div>
            <div className="space-y-2 text-center md:text-left">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-bold">
                Pengasuh Pondok Pesantren
              </span>
              <h3 className="text-2xl font-bold text-white">{PONDOK_CONFIG.pengasuh.nama}</h3>
              <p className="text-xs text-emerald-200 font-medium">{PONDOK_CONFIG.pengasuh.gelar}</p>
              <p className="text-xs text-emerald-100 leading-relaxed max-w-3xl pt-2">
                {PONDOK_CONFIG.pengasuh.biografi}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Kegiatan Santri 24 Jam */}
      <section id="kegiatan" className="py-16 bg-white border-t border-emerald-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Kedisiplinan & Barokah Waktu
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              Jadwal Kegiatan Santri dari Bangun Tidur Sampai Tidur Lagi
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Rutinitas harian yang dirancang harmonis antara ibadah, kajian kitab salaf, sekolah, dan istirahat yang cukup.
            </p>
          </div>

          <div className="relative border-l-2 border-emerald-200 ml-4 md:ml-32 space-y-6">
            {PONDOK_CONFIG.kegiatanHarian.map((item, idx) => (
              <div key={idx} className="relative pl-6 sm:pl-8 group">
                {/* Dot */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-emerald-700 group-hover:scale-125 transition" />
                <div className="rounded-2xl bg-[#F6F3EA] p-4 sm:p-5 border border-emerald-900/10 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-800 text-white text-xs font-bold tabular-nums">
                      {item.waktu} WIB
                    </span>
                    <span className="text-[11px] text-emerald-800 font-semibold">Rutinitas Harian</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{item.kegiatan}</h4>
                  <p className="text-xs text-slate-600 mt-1">{item.keterangan}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 9: Fasilitas Asrama & Unit Usaha */}
      <section id="fasilitas" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              Sarana Penunjang
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              Fasilitas Asrama & Unit Usaha Pondok
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Menghadirkan kenyamanan bagi santri mukim dengan fasilitas yang terawat dan sistem modern.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PONDOK_CONFIG.fasilitas.map((fas, i) => (
              <div key={i} className="rounded-3xl bg-white p-6 border border-emerald-900/10 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-4">
                    {i === 0 && <Building className="w-5 h-5" />}
                    {i === 1 && <Shirt className="w-5 h-5" />}
                    {i === 2 && <Coffee className="w-5 h-5" />}
                    {i >= 3 && <BookOpen className="w-5 h-5" />}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{fas.judul}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{fas.deskripsi}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 space-y-1.5">
                  {fas.detail.map((d, di) => (
                    <div key={di} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 10: Rincian Biaya & Syarat Perlengkapan */}
      <section id="biaya" className="py-16 bg-white border-t border-emerald-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Transparansi Biaya
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              Rincian Biaya Santri Baru & Perlengkapan Wajib
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Rincian transparan untuk pendaftaran tahun ajaran baru 2026/2027.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Tabel Biaya */}
            <div className="lg:col-span-7 rounded-3xl bg-[#F6F3EA] p-6 border border-emerald-900/10 shadow-xs">
              <h3 className="text-base font-bold text-emerald-950 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                Rincian Biaya Pendaftaran & Syahriyah
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-emerald-900/10 text-slate-600 font-bold">
                      <th className="text-left py-2">Komponen Biaya</th>
                      <th className="text-right py-2">Nominal</th>
                      <th className="text-left py-2 pl-4">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/5">
                    {PONDOK_CONFIG.biayaPSB.map((b, idx) => (
                      <tr key={idx} className="hover:bg-emerald-100/30 transition">
                        <td className="py-2.5 font-semibold text-slate-800">{b.komponen}</td>
                        <td className="py-2.5 text-right font-bold text-emerald-900 tabular-nums">
                          Rp {b.nominal.toLocaleString('id-ID')}
                        </td>
                        <td className="py-2.5 pl-4 text-slate-600">{b.keterangan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Catatan:</strong> Syahriyah bulanan (Rp 650.000) sudah mencakup makan santri 3x sehari, asrama, dan iuran madrasah diniyah. Laundry pondok adalah unit usaha terpisah Rp 80.000/bulan.
              </div>
            </div>

            {/* Checklist Perlengkapan */}
            <div className="lg:col-span-5 rounded-3xl bg-white p-6 border border-emerald-900/10 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                Perlengkapan Wajib Dibawa Santri
              </h3>
              {PONDOK_CONFIG.syaratPerlengkapan.map((sy, i) => (
                <div key={i} className="space-y-1.5">
                  <p className="text-xs font-bold text-slate-800">{sy.kategori}</p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {sy.items.map((it, ii) => (
                      <li key={ii} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 11: Alur Pendaftaran */}
      <section id="alur" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Langkah Pendaftaran
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              4 Langkah Mudah Menjadi Santri NU Darussalam
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { no: "1", title: "Registrasi Akun", desc: "Klik tombol 'Daftar Santri Baru' dan buat akun calon santri online." },
              { no: "2", title: "Lengkapi Formulir", desc: "Isi data diri, data wali, riwayat sekolah, dan pilihan kelas madin." },
              { no: "3", title: "Infaq & Berkas", desc: "Transfer infaq pendaftaran Rp 150.000 dan unggah foto KK serta akta kelahiran." },
              { no: "4", title: "Sowan & Masuk Asrama", desc: "Verifikasi administrasi, sowan Pengasuh, penetapan kamar dan NIS santri." },
            ].map((st, i) => (
              <div key={i} className="rounded-3xl bg-white p-6 border border-emerald-900/10 shadow-xs relative">
                <span className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-sm flex items-center justify-center mb-3">
                  {st.no}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{st.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onGoToPSB}
              className="px-6 py-3 rounded-xl bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md hover:bg-emerald-900 transition inline-flex items-center gap-2"
            >
              <span>Mulai Pendaftaran Online Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Section FAQ (Accordion) */}
      <section id="faq" className="py-16 bg-white border-t border-emerald-900/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              Pertanyaan Populer
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">Tanya Jawab Seputar Pondok</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50"
              >
                <button
                  onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-slate-800 hover:text-emerald-800 transition"
                >
                  <span>{faq.q}</span>
                  {openFaqIdx === idx ? (
                    <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaqIdx === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-950 text-white pt-12 pb-8 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-emerald-900/60 text-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/preview__14__3b7f388f.webp"
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <p className="font-bold text-sm text-white">PP NU Darussalam</p>
                <p className="text-[11px] text-emerald-300">Karangdadap, Kab. Pekalongan</p>
              </div>
            </div>
            <p className="text-emerald-200 leading-relaxed">
              Mendidik generasi santri ahlussunnah wal jama'ah yang menguasai ilmu agama, cakap berorganisasi, dan berkhidmah untuk agama, nusa, dan bangsa.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-white text-sm">Alamat & Kontak</p>
            <p className="flex items-center gap-2 text-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{PONDOK_CONFIG.alamat}, Kec. {PONDOK_CONFIG.kecamatan}, Kab. {PONDOK_CONFIG.kabupaten} 51173</span>
            </p>
            <p className="flex items-center gap-2 text-emerald-200">
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{PONDOK_CONFIG.email}</span>
            </p>
            <p className="flex items-center gap-2 text-emerald-200">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{PONDOK_CONFIG.telepon}</span>
            </p>
          </div>

          <div className="space-y-3">
            <p className="font-bold text-white text-sm">Akses Cepat</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={onGoToLogin}
                className="text-left text-emerald-300 hover:text-white transition flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Portal Masuk ERP Asatidz & Wali</span>
              </button>
              <button
                onClick={onGoToPSB}
                className="text-left text-emerald-300 hover:text-white transition flex items-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Formulir PSB Calon Santri</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-emerald-400">
          <p>© {new Date().getFullYear()} Pondok Pesantren NU Darussalam Karangdadap Pekalongan. Hak cipta dilindungi.</p>
          <p className="mt-2 sm:mt-0 font-medium">Sistem ERP Terpadu Berbasis PWA</p>
        </div>
      </footer>

      {/* Floating AI Assistant for Landing Page */}
      <AIAssistantModal mode="landing_public" />
    </div>
  );
};
