import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard,
  Smartphone,
  ShieldCheck,
  FilePlus2,
  AlertTriangle,
  Shield,
  UserCog,
  Home,
  Clock,
  Inbox,
  CalendarDays,
  User,
} from 'lucide-react';
import { useAuth } from '../../lib/auth.ts';
import { useAppStore } from '../../lib/store.ts';
import { SdmMonitoringDashboard } from './SdmMonitoringDashboard.tsx';
import { AbsensiMobileAppView, type AttendanceSubTab } from './AbsensiMobileAppView.tsx';
import { SatpamAbsensiSubTab } from '../bk/SatpamAbsensiSubTab.tsx';

interface SdmAbsensiModuleProps {
  onNavigateErp?: (tab: string) => void;
  onLogout?: () => void;
}

const SDM_MONITORING_ROLES = ['admin_sistem', 'pengasuh', 'kepala_madin', 'sekretaris'];

export const SdmAbsensiModule: React.FC<SdmAbsensiModuleProps> = ({
  onNavigateErp,
  onLogout,
}) => {
  const { effectiveRole, can } = useAuth();
  const izinBadalGuruList = useAppStore((s) => s.izinBadalGuruList);
  const satpamPengajuanList = useAppStore((s) => s.satpamPengajuanList);
  const satpamList = useAppStore((s) => s.satpamList);

  // Strictly restrict Monitoring Dashboard to Administrator, Pengasuh, Kepala Majlis Ma'arif, and Sekretaris
  const canMonitorSdm =
    SDM_MONITORING_ROLES.includes(effectiveRole) && can('sdm_absensi_monitoring', 'baca');

  const [subTab, setSubTab] = useState<'monitoring' | 'satpam_monitoring' | 'satpam_admin' | 'mobile'>('monitoring');
  const [mobileSubTab, setMobileSubTab] = useState<AttendanceSubTab>('beranda');
  const [openPengajuanSignal, setOpenPengajuanSignal] = useState(0);

  const satpamNamesLabel = useMemo(
    () => (satpamList.length > 0 ? satpamList.map((s) => s.nama).join(', ') : 'Belum ada personil terdaftar'),
    [satpamList]
  );

  const pendingPengajuanCount = useMemo(
    () =>
      izinBadalGuruList.filter(
        (item) => item.jenis === 'Absen Pengajuan' && item.status === 'Menunggu'
      ).length,
    [izinBadalGuruList]
  );

  const pendingSatpamCount = useMemo(
    () => satpamPengajuanList.filter((item) => item.status === 'Menunggu').length,
    [satpamPengajuanList]
  );

  const renderAttendanceSubSwitcher = (tone: 'dark' | 'light') => (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div
        className={`inline-flex flex-wrap gap-1 rounded-2xl p-1.5 border ${
          tone === 'dark'
            ? 'bg-emerald-950/60 border-emerald-700/60'
            : 'bg-white border-slate-200 shadow-2xs'
        }`}
      >
        {(
          [
            { id: 'beranda', label: 'Cek In & Beranda', icon: Home },
            { id: 'absensi', label: 'Riwayat & Rekap', icon: Clock },
            { id: 'kotak_masuk', label: 'Kotak Masuk', icon: Inbox },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const isActive = mobileSubTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setMobileSubTab(item.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                isActive
                  ? tone === 'dark'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'bg-emerald-800 text-white shadow-xs'
                  : tone === 'dark'
                  ? 'text-emerald-100 hover:text-white hover:bg-white/10'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {onNavigateErp && (
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onNavigateErp('kalender')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
              tone === 'dark'
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                : 'bg-white hover:bg-emerald-50 text-emerald-900 border border-slate-200'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Kalender</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateErp('profil')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
              tone === 'dark'
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                : 'bg-white hover:bg-emerald-50 text-emerald-900 border border-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profil &amp; Foto</span>
          </button>
        </div>
      )}
    </div>
  );

  // Non-monitoring roles (e.g., Guru, Ketua Imtihan, Bendahara) ONLY see the Mobile Attendance, Absensi Pengajuan & Recap experience
  if (!canMonitorSdm) {
    return (
      <div className="space-y-4">
        <div className="rounded-3xl bg-[#07432A] bg-linear-to-r from-emerald-950 via-emerald-900 to-teal-900 text-white p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                Portal Presensi Dewan Asatidz
              </p>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                Absensi Mobile, Absensi Pengajuan &amp; Rekapan Guru
              </h1>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Cek In / Cek Out swafoto GPS, <strong className="text-amber-200">Absensi Pengajuan</strong> (jika GPS/kamera terkendala), dan rekapan bulanan.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => {
                  setMobileSubTab('beranda');
                  setOpenPengajuanSignal((n) => n + 1);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-xs transition"
              >
                <FilePlus2 className="w-4 h-4" />
                <span>Ajukan Absensi Pengajuan</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-800/70">
            {renderAttendanceSubSwitcher('dark')}
          </div>
        </div>

        <AbsensiMobileAppView
          onNavigateErp={onNavigateErp}
          onLogout={onLogout}
          canApproveIzin={false}
          openPengajuanSignal={openPengajuanSignal}
          controlledSubTab={mobileSubTab}
          onChangeSubTab={setMobileSubTab}
          hideInternalSubNav={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top Header + Segmented View Switcher */}
      <div className="rounded-3xl bg-[#07432A] bg-linear-to-r from-emerald-950 via-emerald-900 to-teal-900 text-white p-5 sm:p-6 shadow-md space-y-4 no-print">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-[11px] font-bold text-amber-300 max-w-full">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-amber-300" />
              <span className="leading-snug">
                Akses Terotorisasi: Administrator · Pengasuh · Kepala Majlis Ma&apos;arif · Sekretaris
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug text-white">
              SDM, Monitoring Guru &amp; Absensi Satpam Terintegrasi
            </h1>
            <p className="text-xs text-emerald-100 leading-relaxed max-w-3xl">
              Pantau kehadiran dewan asatidz &amp; regu Satpam ({satpamNamesLabel}) real-time, verifikasi{' '}
              <strong className="text-amber-200">Absensi Pengajuan</strong>, kelola data personil &amp; shift kerja, dan unduh rekapitulasi spreadsheet Excel/PDF.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSubTab('mobile');
              setMobileSubTab('beranda');
              setOpenPengajuanSignal((n) => n + 1);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-xs transition shrink-0 self-start"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>Buat Absen Pengajuan</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-800/70">
          <div className="inline-flex flex-wrap gap-1 rounded-2xl bg-emerald-950/70 p-1.5 border border-emerald-700/60">
            <button
              type="button"
              onClick={() => setSubTab('monitoring')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                subTab === 'monitoring'
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Monitoring Guru &amp; SDM</span>
              {pendingPengajuanCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold tabular-nums">
                  {pendingPengajuanCount} Pengajuan
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setSubTab('satpam_monitoring')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                subTab === 'satpam_monitoring'
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Monitoring &amp; Rekap Satpam</span>
              {pendingSatpamCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold tabular-nums">
                  {pendingSatpamCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setSubTab('satpam_admin')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                subTab === 'satpam_admin'
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserCog className="w-4 h-4" />
              <span>Kelola Data &amp; Shift Satpam ({satpamList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('mobile')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                subTab === 'mobile'
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Absensi Mobile &amp; Rekapan Saya</span>
            </button>
          </div>
        </div>
      </div>

      {subTab === 'monitoring' && pendingPengajuanCount > 0 && (
        <div className="rounded-2xl bg-amber-50 border border-amber-300 px-4 py-3 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2 no-print">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Terdapat <strong>{pendingPengajuanCount} Absensi Pengajuan</strong> (kendala teknis GPS/kamera/sinyal) menunggu verifikasi &amp; persetujuan Admin pada panel di bawah.
            </span>
          </div>
        </div>
      )}

      {subTab === 'monitoring' && <SdmMonitoringDashboard />}
      {subTab === 'satpam_monitoring' && (
        <SatpamAbsensiSubTab initialMode="monitoring" initialSubMode="harian_foto" />
      )}
      {subTab === 'satpam_admin' && (
        <SatpamAbsensiSubTab initialMode="monitoring" initialSubMode="manajemen_satpam" />
      )}
      {subTab === 'mobile' && (
        <div className="space-y-4">
          {renderAttendanceSubSwitcher('light')}
          <AbsensiMobileAppView
            onNavigateErp={onNavigateErp}
            onLogout={onLogout}
            canApproveIzin={true}
            openPengajuanSignal={openPengajuanSignal}
            controlledSubTab={mobileSubTab}
            onChangeSubTab={setMobileSubTab}
            hideInternalSubNav={true}
          />
        </div>
      )}
    </div>
  );
};
