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
import { useAppStore } from '../../lib/store.ts';
import { AIAssistantModal } from '../../components/common/AIAssistantModal.tsx';
import { PWAInstallButton } from '../../components/pwa/PWAInstallButton.tsx';

interface LandingPageProps {
  onGoToLogin: () => void;
  onGoToPSB: () => void;
  onOpenKhazanahApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToLogin, onGoToPSB, onOpenKhazanahApp }) => {
  const landingConfig = useAppStore((s) => s.landingConfig);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const faqs = landingConfig.faqs;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F6F3EA] text-slate-800 font-sans selection:bg-emerald-200">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-3">
          {/* Logo & Brand (Responsive lockup, never overflows 360px screens) */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <img
              src="/assets/aistudio/preview__14__3b7f388f.webp"
              alt="Logo PP NU Darussalam"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain shrink-0"
            />
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-extrabold text-emerald-950 text-xs sm:text-base tracking-tight truncate leading-tight">
                PP NU Darussalam
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate leading-tight">
                Karangdadap · Pekalongan
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
            <button
              type="button"
              onClick={onOpenKhazanahApp}
              className="px-2.5 py-1.5 rounded-lg text-[#00897B] bg-[#E6F7F2] hover:bg-emerald-100 border border-[#00897B]/30 font-bold transition whitespace-nowrap"
            >
              Aplikasi Ibadah &amp; Qur&apos;an
            </button>
            <a href="#faq" className="px-2.5 py-1.5 rounded-lg hover:text-emerald-900 hover:bg-emerald-50/80 transition whitespace-nowrap">
              Tanya Jawab
            </a>
          </div>

          {/* Action Buttons (Single-line height, fits cleanly on 360px+ mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="hidden sm:block">
              <PWAInstallButton variant="header" />
            </div>

            <button
              type="button"
              onClick={onOpenKhazanahApp}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#007366] bg-[#E6F7F2] hover:bg-emerald-100 border border-[#00897B]/40 rounded-xl transition shadow-2xs whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>Buka App Ibadah</span>
            </button>

            <button
              onClick={onGoToPSB}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 rounded-xl transition shadow-2xs whitespace-nowrap shrink-0"
            >
              <span>Daftar PSB</span>
            </button>

            <button
              onClick={onGoToLogin}
              className="inline-flex items-center gap-1 px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition shadow-xs whitespace-nowrap shrink-0"
            >
              <span>Masuk ERP</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition shrink-0"
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
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenKhazanahApp();
                }}
                className="p-2.5 rounded-xl bg-[#E6F7F2] text-[#007366] font-bold border border-[#00897B]/30 transition text-left"
              >
                Aplikasi Ibadah &amp; Al-Qur&apos;an
              </button>
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
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-20 lg:pb-28">
        {/* Subtle geometric orbs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-900 text-xs font-bold shadow-2xs max-w-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">{landingConfig.tahunAjaranLabel}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-950 tracking-tight leading-tight break-words">
                {landingConfig.heroJudul}
              </h1>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl">
                {landingConfig.heroDeskripsi}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
                <button
                  onClick={onGoToPSB}
                  className="px-5 sm:px-6 py-3 rounded-xl bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md hover:bg-emerald-900 transition flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span>Daftar Santri Baru (PSB Online)</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenKhazanahApp}
                  className="px-5 py-3 rounded-xl bg-[#00897B] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#007366] transition flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-amber-200 shrink-0" />
                  <span>Buka Aplikasi Ibadah &amp; Khazanah</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                <a
                  href="#biaya"
                  className="px-5 py-3 rounded-xl bg-white text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-bold shadow-xs hover:bg-emerald-50 transition flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Rincian Biaya & Perlengkapan</span>
                </a>
              </div>

              {/* Badges */}
              <div className="pt-4 flex flex-wrap gap-3 sm:gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  Asrama Putra & Putri Terpisah
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  Laundry Dikelola Pondok
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  Kantin Cashless Tap RFID
                </span>
              </div>
            </div>

            {/* Right Card / Visual */}
            <div className="lg:col-span-5 min-w-0">
              <div className="relative rounded-3xl bg-gradient-to-br from-emerald-900 to-emerald-950 p-5 sm:p-8 text-white shadow-2xl border border-emerald-800">
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
                    <p className="text-xl font-extrabold text-amber-300 tabular-nums">
                      {landingConfig.statistik.totalSantri}
                    </p>
                    <p className="text-[10px] text-emerald-200">Santri Mukim</p>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-800/40">
                    <p className="text-xl font-extrabold text-amber-300 tabular-nums">
                      {landingConfig.statistik.asatidz}
                    </p>
                    <p className="text-[10px] text-emerald-200">Dewan Asatidz</p>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-800/40">
                    <p className="text-xl font-extrabold text-amber-300 tabular-nums">
                      {landingConfig.statistik.kamarPutra + landingConfig.statistik.kamarPutri}
                    </p>
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
                {landingConfig.statistik.totalSantri}
              </p>
              <p className="text-xs font-semibold text-slate-600 mt-1">Total Santri Mukim</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                {landingConfig.statistik.santriPutra} Putra & {landingConfig.statistik.santriPutri} Putri
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-900 tabular-nums">
                {landingConfig.statistik.asatidz}
              </p>
              <p className="text-xs font-semibold text-slate-600 mt-1">Dewan Asatidz & Ustadzah</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">Alumni Pesantren Salaf</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-900 tabular-nums">
                {landingConfig.statistik.kamarPutra + landingConfig.statistik.kamarPutri}
              </p>
              <p className="text-xs font-semibold text-slate-600 mt-1">Kamar Asrama Santri</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                {landingConfig.statistik.kamarPutra} Putra & {landingConfig.statistik.kamarPutri} Putri
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-900 tabular-nums">
                {landingConfig.statistik.ruangKelas}
              </p>
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
                {landingConfig.visiJudul}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {landingConfig.visiDeskripsi}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 border border-emerald-900/10 shadow-xs space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                Misi Pesantren
              </span>
              <ul className="space-y-2 text-xs text-slate-700">
                {landingConfig.misiList.map((misi, mIdx) => (
                  <li key={mIdx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 tabular-nums">
                      {mIdx + 1}
                    </span>
                    <span>{misi}</span>
                  </li>
                ))}
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
              <h3 className="text-2xl font-bold text-white">{landingConfig.pengasuh.nama}</h3>
              <p className="text-xs text-emerald-200 font-medium">{landingConfig.pengasuh.gelar}</p>
              <p className="text-xs text-emerald-100 leading-relaxed max-w-3xl pt-2">
                {landingConfig.pengasuh.biografi}
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

          <div className="relative border-l-2 border-emerald-200 ml-2 sm:ml-4 md:ml-32 space-y-5 sm:space-y-6">
            {landingConfig.kegiatanHarian.map((item, idx) => (
              <div key={idx} className="relative pl-5 sm:pl-8 group">
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
            {landingConfig.fasilitas.map((fas, i) => (
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
                    <tr className="border-b border-emerald-900/15 text-slate-600 font-bold">
                      <th className="text-left py-2.5 pr-3">Komponen Biaya</th>
                      <th className="text-right py-2.5 px-4 whitespace-nowrap w-[140px]">Nominal</th>
                      <th className="text-left py-2.5 pl-4">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/10">
                    {landingConfig.biayaPSB.map((b, idx) => (
                      <tr key={idx} className="hover:bg-emerald-100/30 transition">
                        <td className="py-3 pr-3 font-semibold text-slate-800 align-top leading-relaxed">
                          {b.komponen}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-900 tabular-nums whitespace-nowrap align-top">
                          <span className="inline-flex items-baseline justify-between gap-2 min-w-[106px]">
                            <span className="text-[11px] font-semibold text-emerald-700/80">Rp</span>
                            <span>{b.nominal.toLocaleString('id-ID')}</span>
                          </span>
                        </td>
                        <td className="py-3 pl-4 text-slate-600 align-top leading-relaxed">
                          {b.keterangan}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {landingConfig.catatanBiaya && (
                <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <strong>Catatan:</strong> {landingConfig.catatanBiaya}
                </div>
              )}
            </div>

            {/* Checklist Perlengkapan */}
            <div className="lg:col-span-5 rounded-3xl bg-white p-6 border border-emerald-900/10 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                Perlengkapan Wajib Dibawa Santri
              </h3>
              {landingConfig.syaratPerlengkapan.map((sy, i) => (
                <div key={i} className="space-y-1.5">
                  <p className="text-xs font-bold text-slate-800">{sy.kategori}</p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {sy.items.map((it, ii) => (
                      <li key={ii} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
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
              {landingConfig.alurJudulSection}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {landingConfig.alurDaftar.map((st, i) => (
              <div key={i} className="rounded-3xl bg-white p-6 border border-emerald-900/10 shadow-xs relative">
                <span className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-sm flex items-center justify-center mb-3 tabular-nums">
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
              <span>
                {landingConfig.kontak.alamat}, Kec. {landingConfig.kontak.kecamatan}, Kab.{' '}
                {landingConfig.kontak.kabupaten} {landingConfig.kontak.kodePos}
              </span>
            </p>
            <p className="flex items-center gap-2 text-emerald-200">
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{landingConfig.kontak.email}</span>
            </p>
            <p className="flex items-center gap-2 text-emerald-200">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{landingConfig.kontak.telepon}</span>
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
              <button
                type="button"
                onClick={onOpenKhazanahApp}
                className="text-left text-amber-300 hover:text-white transition flex items-center gap-1.5 font-bold"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Buka Aplikasi Ibadah &amp; Khazanah (Mobile)</span>
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
