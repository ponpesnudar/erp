/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useAppStore } from './lib/store.ts';
import { useAuth, canAccessErpTab } from './lib/auth.ts';
import { Header } from './components/layout/Header.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { useOnlineStatus } from './components/pwa/usePWAInstall.ts';
import { Search, X, WifiOff, Loader2, Lock } from 'lucide-react';

const LandingPage = lazy(() => import('./features/landing/LandingPage.tsx').then((m) => ({ default: m.LandingPage })));
const KhazanahMobileApp = lazy(() => import('./features/khazanah/KhazanahMobileApp.tsx').then((m) => ({ default: m.KhazanahMobileApp })));
const LoginPage = lazy(() => import('./features/akses/LoginPage.tsx').then((m) => ({ default: m.LoginPage })));
const PortalBeranda = lazy(() => import('./features/beranda/PortalBeranda.tsx').then((m) => ({ default: m.PortalBeranda })));
const ImtihanModule = lazy(() => import('./features/imtihan/ImtihanModule.tsx').then((m) => ({ default: m.ImtihanModule })));
const MaarifanModule = lazy(() => import('./features/maarifan/MaarifanModule.tsx').then((m) => ({ default: m.MaarifanModule })));
const SekretarisModule = lazy(() => import('./features/sekretaris/SekretarisModule.tsx').then((m) => ({ default: m.SekretarisModule })));
const BendaharaModule = lazy(() => import('./features/bendahara/BendaharaModule.tsx').then((m) => ({ default: m.BendaharaModule })));
const KemahadiyahanModule = lazy(() => import('./features/kemahadiyahan/KemahadiyahanModule.tsx').then((m) => ({ default: m.KemahadiyahanModule })));
const BKModule = lazy(() => import('./features/bk/BKModule.tsx').then((m) => ({ default: m.BKModule })));
const TransaksiModule = lazy(() => import('./features/transaksi/TransaksiModule.tsx').then((m) => ({ default: m.TransaksiModule })));
const PSBModule = lazy(() => import('./features/psb/PSBModule.tsx').then((m) => ({ default: m.PSBModule })));
const HakAksesModule = lazy(() => import('./features/akses/HakAksesModule.tsx').then((m) => ({ default: m.HakAksesModule })));
const PanduanModule = lazy(() => import('./features/panduan/PanduanModule.tsx').then((m) => ({ default: m.PanduanModule })));
const SdmAbsensiModule = lazy(() => import('./features/sdm/SdmAbsensiModule.tsx').then((m) => ({ default: m.SdmAbsensiModule })));
const MunaqosyahModule = lazy(() => import('./features/munaqosyah/MunaqosyahModule.tsx').then((m) => ({ default: m.MunaqosyahModule })));
const AIAssistantModal = lazy(() => import('./components/common/AIAssistantModal.tsx').then((m) => ({ default: m.AIAssistantModal })));
const PrintPreviewModal = lazy(() => import('./components/common/PrintPreviewModal.tsx').then((m) => ({ default: m.PrintPreviewModal })));

const ModuleFallback: React.FC = () => (
  <div className="flex min-h-[45vh] items-center justify-center p-8 text-emerald-700">
    <div className="flex items-center gap-2.5 rounded-xl bg-white/90 px-4 py-2.5 text-xs font-semibold shadow-sm border border-emerald-100">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Memuat modul...</span>
    </div>
  </div>
);

export default function App() {
  const { darkMode, systemStatus, setSystemStatus, printOrientation } = useAppStore();
  const { effectiveRole, currentUser, can } = useAuth();
  const isOnline = useOnlineStatus();

  // Navigation state: 'landing' | 'login' | 'erp' | 'khazanah_app' | 'psb_public'
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'login' | 'erp' | 'khazanah_app' | 'psb_public'>(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const h = window.location.hash.toLowerCase();
      if (sp.get('app') === 'ibadah' || h === '#ibadah') {
        return 'khazanah_app';
      }
      if (sp.get('app') === 'psb' || h === '#psb-daftar') {
        return 'psb_public';
      }
      if (h === '#login') {
        return 'login';
      }
    }
    return 'landing';
  });
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const qTab = new URLSearchParams(window.location.search).get('tab');
      if (qTab) return qTab;
    }
    return 'beranda';
  });

  // Sidebar collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Global Search Modal state (Ctrl+K)
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // AI Assistant Modal trigger signal (wired to Header button + draggable bubble)
  const [aiOpenSignal, setAiOpenSignal] = useState<number>(0);

  // Sinkronisasi URL Hash agar selalu sesuai dengan halaman/modul aktif (hilangkan hash lama yang nyangkut)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let targetHash = '#beranda';
    if (currentScreen === 'khazanah_app') {
      targetHash = '#ibadah';
    } else if (currentScreen === 'psb_public') {
      targetHash = '#psb-daftar';
    } else if (currentScreen === 'login') {
      targetHash = '#login';
    } else if (currentScreen === 'erp') {
      targetHash = `#${activeTab === 'beranda' ? 'beranda' : activeTab}`;
    } else {
      const landingAnchors = ['#profil', '#kegiatan', '#fasilitas', '#biaya', '#alur', '#faq'];
      if (landingAnchors.includes(window.location.hash)) {
        targetHash = window.location.hash;
      } else {
        targetHash = '#beranda';
      }
    }
    if (window.location.hash !== targetHash) {
      try {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${targetHash}`);
      } catch {
        window.location.hash = targetHash;
      }
    }
  }, [currentScreen, activeTab]);

  // Update online status in store
  useEffect(() => {
    setSystemStatus(isOnline ? 'ready' : 'offline');
  }, [isOnline, setSystemStatus]);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Quick module search items
  const allSearchItems = [
    { id: 'beranda', name: 'Beranda Portal ERP', desc: 'KPI, ringkasan, dan akses cepat modul', tab: 'beranda' },
    { id: 'imtihan_soal', name: 'Naskah Soal Imtihan', desc: 'Penyusunan naskah Arab/Pegon guru & cetak kop', tab: 'imtihan' },
    { id: 'imtihan_denah', name: 'Denah & Tempat Duduk Ujian', desc: 'Acak denah 7 ruang bebas contek sekelas', tab: 'imtihan' },
    { id: 'imtihan_kartu', name: 'Kartu Peserta Imtihan', desc: 'Cetak kartu format 2MD#079 dan jadwal paraf', tab: 'imtihan' },
    { id: 'imtihan_raport', name: 'Input Nilai & Cetak Raport', desc: 'Raport madrasah diniyah dengan predikat Arab', tab: 'imtihan' },
    { id: 'imtihan_rab', name: 'RAB Imtihan 1', desc: 'Rancangan anggaran kegiatan imtihan transparan', tab: 'imtihan' },
    { id: 'munaqosyah_3d', name: 'Majlis Ilmiah, Bahtsul Masail, Hadits & Munaqosyah 3D', desc: "Forum Bahtsul Masail 4 Madzhab, Perumusan Hadits 51 Kitab & Munaqosyah 4 Bangku", tab: 'munaqosyah' },
    { id: 'maarifan_absensi', name: 'Absensi Diniyah Salafiyah', desc: 'Presensi cepat Hadir Semua & riwayat', tab: 'maarifan' },
    { id: 'sdm_absensi', name: 'SDM & Absensi Mobile Guru', desc: 'Dashboard Monitoring SDM, Cek In Selfie GPS & Monitoring Satpam', tab: 'sdm_absensi' },
    { id: 'sekretaris_santri', name: 'Master Data Santri', desc: 'Data 366 santri putra & putri', tab: 'sekretaris' },
    { id: 'sekretaris_surat', name: 'Persuratan Resmi Yayasan', desc: 'Penomoran otomatis surat keluar/masuk', tab: 'sekretaris' },
    { id: 'bendahara_kas', name: 'Rekapitulasi Anggaran Bulanan', desc: 'Realisasi pemasukan vs pengeluaran kas', tab: 'bendahara' },
    { id: 'transaksi_pos', name: 'Kasir Kantin & Laundry (POS)', desc: 'Tap kartu RFID santri & kontrol batas belanja', tab: 'transaksi' },
    { id: 'psb_daftar', name: 'Penerimaan Santri Baru (PSB)', desc: 'Verifikasi pendaftar & jadikan santri', tab: 'psb' },
    { id: 'akses_role', name: 'Hak Akses Role ERP', desc: 'Peta wewenang & akun login guru/staf', tab: 'akses' },
    { id: 'panduan_sistem', name: 'Buku Panduan & Status Server', desc: 'Petunjuk penggunaan lengkap per modul', tab: 'panduan' },
  ];

  const filteredSearch = allSearchItems
    .filter((item) => canAccessErpTab(item.tab, effectiveRole, can))
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Tab Titles mapping for Header Breadcrumb
  const moduleTitles: Record<string, string> = {
    beranda: 'Beranda Portal',
    imtihan: 'Imtihan & Evaluasi Santri',
    munaqosyah: 'Majlis Ilmiah, Perumusan Hadits & Munaqosyah 3D',
    maarifan: "Madrasah Diniyah (Ma'arifan)",
    sdm_absensi: 'Dashboard Monitoring Guru, SDM & Absensi Mobile',
    sekretaris: 'Sekretariat & Data Santri',
    bendahara: 'Bendahara & Transparansi Anggaran',
    kemahadiyahan: "Kema'hadiyahan & Organisasi",
    bk: 'BK & Ketertiban Keamanan',
    transaksi: 'Transaksi Kartu & Kantin POS',
    psb: 'Pendaftaran Santri Baru (PSB)',
    akses: 'Hak Akses Role ERP',
    panduan: 'Buku Panduan & Parameter Sistem',
  };

  return (
    <div className={`${darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'} min-h-screen selection:bg-emerald-200 ${printOrientation === 'landscape' ? 'print-landscape' : 'print-portrait'}`}>
      <style>{`@media print { @page { size: ${printOrientation === 'landscape' ? '330mm 215mm' : '215mm 330mm'}; margin: 8mm 10mm; } }`}</style>
      {/* 1. PUBLIC LANDING PAGE */}
      {currentScreen === 'landing' && (
        <Suspense fallback={<ModuleFallback />}>
          <LandingPage
            onGoToLogin={() => setCurrentScreen('login')}
            onGoToPSB={() => setCurrentScreen('psb_public')}
            onOpenKhazanahApp={() => setCurrentScreen('khazanah_app')}
          />
        </Suspense>
      )}

      {/* 1A. PUBLIC STANDALONE PSB REGISTRATION (STRICTLY ISOLATED, NO ADMIN/ERP SESSION) */}
      {currentScreen === 'psb_public' && (
        <Suspense fallback={<ModuleFallback />}>
          <div className="min-h-screen bg-[#F6F3EA] px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
            <div className="max-w-4xl mx-auto">
              <PSBModule
                publicMode
                onBackToLanding={() => setCurrentScreen('landing')}
                onGoToLogin={() => setCurrentScreen('login')}
              />
            </div>
          </div>
        </Suspense>
      )}

      {/* 1B. STANDALONE MOBILE APP: KHAZANAH & IBADAH */}
      {currentScreen === 'khazanah_app' && (
        <Suspense fallback={<ModuleFallback />}>
          <KhazanahMobileApp onBackToLanding={() => setCurrentScreen('landing')} />
        </Suspense>
      )}

      {/* 2. LOGIN PAGE */}
      {currentScreen === 'login' && (
        <Suspense fallback={<ModuleFallback />}>
          <LoginPage
            onLoginSuccess={(targetTab) => {
              setActiveTab(targetTab || 'beranda');
              setCurrentScreen('erp');
            }}
            onBackToLanding={() => setCurrentScreen('landing')}
          />
        </Suspense>
      )}

      {/* 3. INTERNAL ERP FULL-STACK LAYOUT */}
      {currentScreen === 'erp' && (
        <div className="flex h-screen overflow-hidden print-root-shell">
          {/* Sticky Sidebar with internal scroll & collapse */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={(tabId) => {
              setActiveTab(tabId);
              setMobileMenuOpen(false);
            }}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            mobileOpen={mobileMenuOpen}
            onOpenMobile={() => setMobileMenuOpen(true)}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />

          {/* Main Area: Top Single-Row Header + Scrollable Content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden print-main-col">
            {/* Single Row Header (Never breaks onto multiple lines) */}
            <Header
              currentModuleTitle={moduleTitles[activeTab] || 'Dashboard'}
              onOpenSearch={() => setSearchModalOpen(true)}
              onOpenAIAssistant={() => setAiOpenSignal((n) => n + 1)}
              onSelectModule={(tab) => setActiveTab(tab)}
              onLogout={() => {
                setCurrentScreen('login');
                setActiveTab('beranda');
              }}
            />

            {/* Content Viewport Container */}
            <main className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 md:pb-8 lg:p-8 scroll-smooth print-main-scroll">
              <div className="max-w-7xl mx-auto space-y-6">
                <Suspense fallback={<ModuleFallback />}>
                  {!canAccessErpTab(activeTab, effectiveRole, can) ? (
                    <div className="rounded-3xl bg-white border border-rose-200 p-8 text-center max-w-lg mx-auto shadow-xs space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mx-auto border border-rose-200">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-base font-extrabold text-slate-900">
                          Modul Terkunci — Hak Akses Tidak Diberikan
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Peran akun Anda (<strong>{currentUser.peranLabel}</strong>) belum diberi izin buka pada modul{' '}
                          <strong>{moduleTitles[activeTab] || activeTab}</strong>. Hubungi Administrator Sistem untuk membuka akses di menu Hak Akses Role.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('beranda')}
                        className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition"
                      >
                        Kembali ke Beranda Portal
                      </button>
                    </div>
                  ) : (
                    <>
                      {activeTab === 'beranda' && (
                        <PortalBeranda onNavigate={(tab) => setActiveTab(tab)} />
                      )}
                      {activeTab === 'imtihan' && <ImtihanModule />}
                      {activeTab === 'munaqosyah' && <MunaqosyahModule />}
                      {activeTab === 'maarifan' && (
                        <MaarifanModule onOpenSdmAbsensi={() => setActiveTab('sdm_absensi')} />
                      )}
                      {activeTab === 'sdm_absensi' && (
                        <SdmAbsensiModule
                          onNavigateErp={(tab) => setActiveTab(tab)}
                          onLogout={() => {
                            setCurrentScreen('login');
                            setActiveTab('beranda');
                          }}
                        />
                      )}
                      {activeTab === 'sekretaris' && <SekretarisModule />}
                      {activeTab === 'bendahara' && <BendaharaModule />}
                      {activeTab === 'kemahadiyahan' && <KemahadiyahanModule />}
                      {activeTab === 'bk' && <BKModule />}
                      {activeTab === 'transaksi' && <TransaksiModule />}
                      {activeTab === 'psb' && <PSBModule />}
                      {activeTab === 'akses' && <HakAksesModule />}
                      {activeTab === 'panduan' && <PanduanModule />}
                    </>
                  )}
                </Suspense>
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Global Search Modal (Ctrl+K) */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs p-4 pt-20 no-print print:hidden">
          <div className="w-full max-w-xl rounded-2xl bg-white p-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik nama modul, santri, atau fitur (Ctrl + K)..."
                className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-1 max-h-72 overflow-y-auto pr-1">
              {filteredSearch.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-400">
                  Tidak ada modul atau fitur yang cocok.
                </p>
              ) : (
                filteredSearch.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.tab);
                      setCurrentScreen('erp');
                      setSearchModalOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full p-2.5 rounded-xl text-left hover:bg-emerald-50 transition flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-800">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      Buka →
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Assistant in ERP */}
      {currentScreen === 'erp' && (
        <div className="no-print print:hidden">
          <Suspense fallback={null}>
            <AIAssistantModal
              mode="erp_internal"
              activeModule={moduleTitles[activeTab]}
              userRole={currentUser.peranLabel}
              openSignal={aiOpenSignal}
            />
          </Suspense>
        </div>
      )}

      {/* Print Studio Modal */}
      <Suspense fallback={null}>
        <PrintPreviewModal />
      </Suspense>

      {/* Offline Toast Banner */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-bottom-2 no-print print:hidden">
          <WifiOff className="w-4 h-4" />
          <span>Mode Offline — Data tersimpan di memori lokal dan akan disinkronkan saat online.</span>
        </div>
      )}
    </div>
  );
}
