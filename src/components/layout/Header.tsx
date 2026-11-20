import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Smartphone,
  LogOut,
  User,
  ShieldAlert,
  ChevronDown,
  CheckCircle2,
  RefreshCw,
  WifiOff,
  Sparkles,
  Grid,
  HelpCircle,
  X,
  Layers,
} from 'lucide-react';
import { useAppStore } from '../../lib/store.ts';
import { useAuth } from '../../lib/auth.ts';
import { PWAInstallButton } from '../pwa/PWAInstallButton.tsx';

interface HeaderProps {
  currentModuleTitle: string;
  onOpenSearch: () => void;
  onOpenAIAssistant: () => void;
  onSelectModule: (tab: string) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModuleTitle,
  onOpenSearch,
  onOpenAIAssistant,
  onSelectModule,
  onLogout,
}) => {
  const {
    currentUser,
    activeRole,
    simulatedRole,
    simulateRole,
    darkMode,
    toggleDarkMode,
    systemStatus,
    kotakMasuk,
    logout,
    switchRole,
  } = useAppStore();

  const { effectiveRole } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showGridModal, setShowGridModal] = useState(false);
  const [showSwitchRoleModal, setShowSwitchRoleModal] = useState(false);

  const pendingCount = kotakMasuk.filter((k) => k.status === 'Menunggu').length;

  return (
    <header className="sticky top-0 z-30 flex-none h-14 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 flex items-center justify-between text-xs text-slate-700 shadow-2xs no-print print:hidden">
      {/* Left: Breadcrumbs / Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-slate-500 hidden sm:inline">ERP Darussalam</span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <h2 className="font-bold text-slate-900 truncate text-xs sm:text-sm">
            {currentModuleTitle}
          </h2>
        </div>

        {/* Simulation Banner Badge */}
        {simulatedRole && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300 animate-pulse shrink-0">
            <ShieldAlert className="w-3 h-3 text-amber-600" />
            <span>Simulasi: {simulatedRole}</span>
            <button
              onClick={() => simulateRole(null)}
              className="ml-1 hover:text-rose-700 underline text-[10px]"
              title="Kembalikan ke peran asli"
            >
              Reset
            </button>
          </span>
        )}
      </div>

      {/* Right Single-Row Controls (Never wraps) */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Global Search Button (Ctrl+K) */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition border border-slate-200/80"
          title="Pencarian cepat (Ctrl + K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs">Cari modul, santri...</span>
          <kbd className="px-1.5 py-0.5 text-[9px] font-semibold bg-white rounded border border-slate-300 text-slate-400">
            Ctrl K
          </kbd>
        </button>

        {/* Mobile Search Icon */}
        <button
          onClick={onOpenSearch}
          className="flex md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          title="Cari"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* System Status Indicator ("Siap / Offline / Menyinkronkan") */}
        <button
          onClick={() => setShowStatusModal(true)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-100 border border-transparent hover:border-slate-200 transition"
          title="Status Sinkronisasi Sistem"
        >
          {systemStatus === 'ready' && (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
              <span className="hidden lg:inline text-[11px] font-medium text-emerald-800">Siap</span>
            </>
          )}
          {systemStatus === 'syncing' && (
            <>
              <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />
              <span className="hidden lg:inline text-[11px] font-medium text-blue-800">Menyinkronkan</span>
            </>
          )}
          {systemStatus === 'offline' && (
            <>
              <WifiOff className="w-3 h-3 text-amber-600" />
              <span className="hidden lg:inline text-[11px] font-medium text-amber-800">Offline</span>
            </>
          )}
        </button>

        {/* AI Assistant Quick Trigger */}
        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 transition"
          title="Asisten AI ERP Darussalam"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline text-xs">Asisten AI</span>
        </button>

        {/* Notifications Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
            title="Kotak Masuk & Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {pendingCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-emerald-700" />
                  Notifikasi & Kotak Masuk
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                  {pendingCount} Menunggu
                </span>
              </div>
              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                {kotakMasuk.map((k) => (
                  <div
                    key={k.id}
                    onClick={() => {
                      onSelectModule(k.linkTab);
                      setShowNotifications(false);
                    }}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/50 cursor-pointer transition text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700">
                        {k.modul}
                      </span>
                      <span className="text-[10px] text-slate-400">{k.waktu}</span>
                    </div>
                    <p className="font-bold text-xs text-slate-800 mt-1">{k.judul}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{k.keterangan}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Module Grid Launcher Modal Trigger */}
        <button
          onClick={() => setShowGridModal(true)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
          title="Semua Modul ERP"
        >
          <Grid className="w-4 h-4" />
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
          title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Account Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.nama}
              className="w-7 h-7 rounded-full object-cover border border-emerald-600"
            />
            <div className="hidden sm:block text-left">
              <p className="font-bold text-slate-800 text-[11px] leading-tight max-w-[120px] truncate">
                {currentUser.nama.split(' ')[0]}
              </p>
              <p className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider">
                {effectiveRole.replace('_', ' ')}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-3 border-b border-slate-100">
                <p className="font-bold text-xs text-slate-900">{currentUser.nama}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                  {currentUser.peranLabel}
                </span>
              </div>

              <div className="py-1 space-y-0.5 text-xs">
                {currentUser.rolesAvailable.length > 1 && (
                  <button
                    onClick={() => {
                      setShowSwitchRoleModal(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-slate-100 text-slate-700"
                  >
                    <Layers className="w-4 h-4 text-emerald-700" />
                    <span>Ganti Peran ({currentUser.rolesAvailable.length} peran)</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onSelectModule('panduan');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-slate-100 text-slate-700"
                >
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  <span>Buku Panduan ERP</span>
                </button>

                <div className="px-3 py-1.5">
                  <PWAInstallButton variant="header" />
                </div>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                    onLogout?.();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-rose-700 hover:bg-rose-50 font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar dari Akun</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sync Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 no-print">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Status Jaringan & Sinkronisasi
              </h3>
              <button onClick={() => setShowStatusModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="font-bold text-emerald-900">Penyimpanan Offline & PWA Aktif</p>
                <p className="mt-1 text-[11px] text-emerald-700">
                  Data absensi dan input nilai disimpan otomatis di memori lokal terenkripsi dan disinkronkan saat koneksi kembali stabil.
                </p>
              </div>
              <div className="space-y-1">
                <p className="flex justify-between">
                  <span>Status Dev Server:</span>
                  <strong className="text-emerald-700">Port 3000 (Tersambung)</strong>
                </p>
                <p className="flex justify-between">
                  <span>Waktu Sinkronisasi Terakhir:</span>
                  <strong className="text-slate-800">Baru saja</strong>
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowStatusModal(false)}
              className="mt-6 w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-xs text-slate-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Module Grid Launcher Modal */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 no-print">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Grid className="w-5 h-5 text-emerald-700" />
                Semua Modul ERP NU Darussalam
              </h3>
              <button onClick={() => setShowGridModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'beranda', name: 'Beranda Portal', desc: 'KPI & Akses Cepat' },
                { id: 'imtihan', name: 'Imtihan & Nilai', desc: 'Soal, Denah, Kartu, Raport, RAB' },
                { id: 'maarifan', name: "Ma'arifan Diniyah", desc: 'Absensi Guru & Santri, Kitab' },
                ...( !['wali_santri', 'kasir_kantin'].includes(effectiveRole)
                  ? [{ id: 'sdm_absensi', name: 'SDM & Absensi Guru', desc: 'Monitoring SDM & Absensi Mobile GPS' }]
                  : [] ),
                { id: 'sekretaris', name: 'Sekretaris', desc: 'Surat Masuk/Keluar & Data Santri' },
                { id: 'bendahara', name: 'Bendahara', desc: 'Arus Kas, Gaji, Rekap Anggaran' },
                { id: 'kemahadiyahan', name: "Kema'hadiyahan", desc: 'Bagan Jabatan & Acara PHBI' },
                { id: 'bk', name: 'BK & Keamanan', desc: 'Pelanggaran Santri & Buku Tamu' },
                { id: 'transaksi', name: 'Transaksi & POS', desc: 'Kartu Jajan, Kantin & Laundry' },
                { id: 'psb', name: 'Pendaftaran PSB', desc: 'Verifikasi & Jadikan Santri' },
                { id: 'akses', name: 'Hak Akses Role', desc: 'Wewenang & Matriks Izin' },
                { id: 'panduan', name: 'Buku Panduan', desc: 'Petunjuk Penggunaan & FAQ' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    onSelectModule(m.id);
                    setShowGridModal(false);
                  }}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-left transition"
                >
                  <p className="font-bold text-xs text-slate-900">{m.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Switch Role Modal */}
      {showSwitchRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 no-print">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-900">Ganti Peran Aktif</h3>
            <p className="text-xs text-slate-500 mt-1">
              Akun Anda memiliki lebih dari satu peran operasional:
            </p>
            <div className="mt-4 space-y-2">
              {currentUser.rolesAvailable.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setShowSwitchRoleModal(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition flex items-center justify-between ${
                    activeRole === r
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>{r.replace('_', ' ').toUpperCase()}</span>
                  {activeRole === r && <CheckCircle2 className="w-4 h-4" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSwitchRoleModal(false)}
              className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-xs text-slate-700"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
