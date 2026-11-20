import React, { useState } from 'react';
import { LayoutDashboard, Smartphone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../lib/auth.ts';
import { SdmMonitoringDashboard } from './SdmMonitoringDashboard.tsx';
import { AbsensiMobileAppView } from './AbsensiMobileAppView.tsx';

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

  // Strictly restrict Monitoring Dashboard to Administrator, Pengasuh, Kepala Majlis Ma'arif, and Sekretaris
  const canMonitorSdm =
    SDM_MONITORING_ROLES.includes(effectiveRole) && can('sdm_absensi_monitoring', 'baca');

  const [subTab, setSubTab] = useState<'monitoring' | 'mobile'>('monitoring');

  // Non-monitoring roles (e.g., Guru, Ketua Imtihan, Bendahara) ONLY see the Mobile Attendance & Recap experience
  if (!canMonitorSdm) {
    return (
      <div className="space-y-4">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
              Portal Presensi Dewan Asatidz
            </p>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
              Absensi Mobile &amp; Rekapan Kehadiran Guru
            </h1>
            <p className="text-xs text-emerald-100 mt-0.5">
              Cek In / Cek Out swafoto GPS, rekapan kehadiran bulanan, pengajuan izin/badal, &amp; kalender pendidikan pondok
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold self-start sm:self-center">
            <Smartphone className="w-3.5 h-3.5 text-emerald-200" />
            <span>Akses Guru Pengampu</span>
          </span>
        </div>

        <AbsensiMobileAppView
          onNavigateErp={onNavigateErp}
          onLogout={onLogout}
          canApproveIzin={false}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top Header + Segmented View Switcher for Authorized Pimpinan / Administrator */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-bold text-emerald-200 mb-1.5">
            <ShieldCheck className="w-3 h-3" />
            <span>Akses Terotorisasi: Administrator · Pengasuh · Kepala Majlis Ma&apos;arif · Sekretaris</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Dashboard Monitoring Guru, SDM &amp; Absensi Mobile
          </h1>
          <p className="text-xs text-emerald-100 mt-0.5">
            Pantau kehadiran dewan asatidz real-time, setujui pengajuan badal/izin, dan akses portal presensi mobile pribadi
          </p>
        </div>

        <div className="inline-flex rounded-2xl bg-emerald-950/60 p-1.5 border border-emerald-700/60 self-start lg:self-center shrink-0">
          <button
            type="button"
            onClick={() => setSubTab('monitoring')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              subTab === 'monitoring'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-emerald-100 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Monitoring SDM</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('mobile')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              subTab === 'mobile'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-emerald-100 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Absensi Mobile &amp; Rekapan Saya</span>
          </button>
        </div>
      </div>

      {subTab === 'monitoring' ? (
        <SdmMonitoringDashboard />
      ) : (
        <AbsensiMobileAppView
          onNavigateErp={onNavigateErp}
          onLogout={onLogout}
          canApproveIzin={true}
        />
      )}
    </div>
  );
};
