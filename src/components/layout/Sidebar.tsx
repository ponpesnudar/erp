import React from 'react';
import {
  Home,
  FileCheck,
  BookOpen,
  Mail,
  DollarSign,
  Users2,
  Shield,
  CreditCard,
  UserPlus,
  KeyRound,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  School,
  UserCheck,
  LayoutGrid,
  X,
} from 'lucide-react';
import { useAuth, canAccessErpTab } from '../../lib/auth.ts';
import { useAppStore } from '../../lib/store.ts';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  fiturId?: string;
}

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onOpenMobile: () => void;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onOpenMobile,
  onCloseMobile,
}) => {
  const { can, effectiveRole, currentUser } = useAuth();
  const { currentTahunAjaran } = useAppStore();

  const allNavItems: NavItem[] = [
    { id: 'beranda', label: 'Beranda Portal', icon: Home },
    { id: 'imtihan', label: 'Imtihan & Nilai', icon: FileCheck, fiturId: 'imtihan_soal' },
    { id: 'munaqosyah', label: 'Majlis Ilmiah & Munaqosyah', icon: School, badge: '3D' },
    { id: 'maarifan', label: "Ma'arifan Diniyah", icon: BookOpen, fiturId: 'maarifan_absensi' },
    { id: 'sdm_absensi', label: 'SDM & Absensi Guru', icon: UserCheck },
    { id: 'sekretaris', label: 'Sekretariat', icon: Mail, fiturId: 'sekretaris_persuratan' },
    { id: 'bendahara', label: 'Bendahara & Kas', icon: DollarSign, fiturId: 'bendahara_keuangan' },
    { id: 'kemahadiyahan', label: "Kema'hadiyahan", icon: Users2 },
    { id: 'bk', label: 'BK & Keamanan', icon: Shield, fiturId: 'bk_pelanggaran' },
    { id: 'transaksi', label: 'Kartu & Kantin', icon: CreditCard, fiturId: 'transaksi_kartu_pos' },
    { id: 'psb', label: 'Pendaftaran PSB', icon: UserPlus, fiturId: 'psb_verifikasi' },
    { id: 'akses', label: 'Hak Akses Role', icon: KeyRound },
    { id: 'panduan', label: 'Buku Panduan', icon: HelpCircle },
  ];

  // Filter items based on unified role authorization (unchecked in Hak Akses Role = locked)
  const visibleItems = allNavItems.filter((item) =>
    canAccessErpTab(item.id, effectiveRole, can)
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#07432A] text-white">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-emerald-800/80 h-16 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src="/assets/aistudio/preview__14__3b7f388f.webp"
            alt="Logo"
            className="w-9 h-9 object-contain bg-white/10 rounded-xl p-1 shrink-0"
          />
          {!collapsed && (
            <div className="min-w-0 transition-opacity duration-200">
              <h1 className="font-extrabold text-xs tracking-tight text-white truncate">
                NU DARUSSALAM
              </h1>
              <p className="text-[10px] text-emerald-300 truncate">ERP Pondok Pesantren</p>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-lg bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 hover:text-white transition"
          title={collapsed ? 'Perluas Menu (>)' : 'Ciutkan Menu (<)'}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Mobile Drawer Close Button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-lg bg-emerald-800/70 hover:bg-emerald-700 text-emerald-100 transition"
          aria-label="Tutup Menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav List with Internal Scroll */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-none">
        <div className="px-3 py-1">
          {!collapsed && (
            <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-400/80">
              Menu Utama
            </p>
          )}
        </div>

        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile();
              }}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                isActive
                  ? 'bg-emerald-700/90 text-white shadow-xs font-bold'
                  : 'text-emerald-100/80 hover:bg-emerald-800/50 hover:text-white'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-amber-400 rounded-r-full" />
              )}
              <Icon className="w-4 h-4 shrink-0 text-emerald-200" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-emerald-950">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Panel: Academic Year & User Snapshot */}
      <div className="p-3 border-t border-emerald-800/80 bg-emerald-950/40 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-emerald-800/80 border border-emerald-600/50 flex items-center justify-center font-bold text-xs text-amber-300 shrink-0">
            {currentUser.nama.charAt(0)}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs text-white truncate leading-tight">
                {currentUser.nama}
              </p>
              <p className="text-[10px] text-emerald-300 truncate">
                T.A. {currentTahunAjaran}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden md:block print:hidden sticky top-0 h-screen shrink-0 transition-all duration-200 border-r border-emerald-900 shadow-md no-print ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (When Opened) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden print:hidden no-print">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative w-72 max-w-[82vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation (5 Slots — hanya modul yang diberi izin akses) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 h-16 bg-white/98 backdrop-blur-md border-t border-slate-200 md:hidden print:hidden grid grid-cols-5 items-center px-1 shadow-lg no-print">
        <button
          type="button"
          onClick={() => onSelectTab('beranda')}
          className={`flex flex-col items-center justify-center py-1 text-[10px] font-bold ${
            activeTab === 'beranda' ? 'text-emerald-800' : 'text-slate-500'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span>Beranda</span>
        </button>

        {canAccessErpTab('sdm_absensi', effectiveRole, can) ? (
          <button
            type="button"
            onClick={() => onSelectTab('sdm_absensi')}
            className={`flex flex-col items-center justify-center py-1 text-[10px] font-bold ${
              activeTab === 'sdm_absensi' ? 'text-emerald-800' : 'text-slate-500'
            }`}
          >
            <UserCheck className="w-4 h-4 mb-0.5" />
            <span>Absen</span>
          </button>
        ) : canAccessErpTab('psb', effectiveRole, can) ? (
          <button
            type="button"
            onClick={() => onSelectTab('psb')}
            className={`flex flex-col items-center justify-center py-1 text-[10px] font-bold ${
              activeTab === 'psb' ? 'text-emerald-800' : 'text-slate-500'
            }`}
          >
            <UserPlus className="w-4 h-4 mb-0.5" />
            <span>PSB</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSelectTab('panduan')}
            className={`flex flex-col items-center justify-center py-1 text-[10px] font-bold ${
              activeTab === 'panduan' ? 'text-emerald-800' : 'text-slate-500'
            }`}
          >
            <HelpCircle className="w-4 h-4 mb-0.5" />
            <span>Panduan</span>
          </button>
        )}

        {/* CENTER SLOT: Prominent MENU Drawer Trigger */}
        <button
          type="button"
          onClick={mobileOpen ? onCloseMobile : onOpenMobile}
          className="flex flex-col items-center justify-center -mt-3 py-1 text-[10px] font-extrabold text-emerald-900"
          aria-label="Buka Daftar Semua Menu ERP"
        >
          <span
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md border-2 border-white transition ${
              mobileOpen
                ? 'bg-amber-400 text-slate-950'
                : 'bg-emerald-800 text-white active:scale-95'
            }`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
          </span>
          <span className="mt-0.5 leading-none">Menu</span>
        </button>

        {canAccessErpTab('imtihan', effectiveRole, can) ? (
          <button
            type="button"
            onClick={() => onSelectTab('imtihan')}
            className={`flex flex-col items-center justify-center py-1 text-[10px] font-bold ${
              activeTab === 'imtihan' ? 'text-emerald-800' : 'text-slate-500'
            }`}
          >
            <FileCheck className="w-4 h-4 mb-0.5" />
            <span>Imtihan</span>
          </button>
        ) : canAccessErpTab('maarifan', effectiveRole, can) ? (
          <button
            type="button"
            onClick={() => onSelectTab('maarifan')}
            className={`flex flex-col items-center justify-center py-1 text-[10px] font-bold ${
              activeTab === 'maarifan' ? 'text-emerald-800' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span>Diniyah</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSelectTab('panduan')}
            className={`flex flex-col items-center justify-center py-1 text-[10px] font-bold ${
              activeTab === 'panduan' ? 'text-emerald-800' : 'text-slate-500'
            }`}
          >
            <HelpCircle className="w-4 h-4 mb-0.5" />
            <span>Panduan</span>
          </button>
        )}

        {canAccessErpTab('transaksi', effectiveRole, can) ? (
          <button
            type="button"
            onClick={() => onSelectTab('transaksi')}
            className={`flex flex-col items-center justify-center py-1 text-[10px] font-bold ${
              activeTab === 'transaksi' ? 'text-emerald-800' : 'text-slate-500'
            }`}
          >
            <CreditCard className="w-4 h-4 mb-0.5" />
            <span>Kantin</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSelectTab('panduan')}
            className={`flex flex-col items-center justify-center py-1 text-[10px] font-bold ${
              activeTab === 'panduan' ? 'text-emerald-800' : 'text-slate-500'
            }`}
          >
            <HelpCircle className="w-4 h-4 mb-0.5" />
            <span>Panduan</span>
          </button>
        )}
      </div>
    </>
  );
};
