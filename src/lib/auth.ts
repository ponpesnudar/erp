import { useAppStore } from './store.ts';

export function canAccessErpTab(
  tabId: string,
  effectiveRole: string,
  can: (fiturId: string, action?: string) => boolean
): boolean {
  if (
    tabId === 'beranda' ||
    tabId === 'ibadah_khazanah' ||
    tabId === 'kalender' ||
    tabId === 'profil' ||
    tabId === 'panduan'
  ) {
    return true;
  }
  if (tabId === 'akses') return effectiveRole === 'admin_sistem';
  if (tabId === 'imtihan') {
    return (
      can('imtihan_soal', 'baca') ||
      can('imtihan_nilai_raport', 'baca') ||
      can('imtihan_denah', 'baca') ||
      can('imtihan_kartu', 'baca') ||
      can('imtihan_rab', 'baca')
    );
  }
  if (tabId === 'munaqosyah') return can('munaqosyah_majlis', 'baca');
  if (tabId === 'maarifan') return can('maarifan_absensi', 'baca');
  if (tabId === 'sdm_absensi') {
    return can('sdm_absensi_monitoring', 'baca') || can('sdm_absensi_mobile', 'baca');
  }
  if (tabId === 'sekretaris') return can('sekretaris_persuratan', 'baca');
  if (tabId === 'bendahara') return can('bendahara_keuangan', 'baca');
  if (tabId === 'kemahadiyahan') return can('kemahadiyahan_organisasi', 'baca');
  if (tabId === 'bk') return can('bk_pelanggaran', 'baca');
  if (tabId === 'transaksi') return can('transaksi_kartu_pos', 'baca');
  if (tabId === 'psb') return can('psb_verifikasi', 'baca');
  return false;
}

export function useAuth() {
  const { currentUser, activeRole, simulatedRole, rolePermissions } = useAppStore();
  const effectiveRole = simulatedRole || activeRole;

  const can = (fiturId: string, action: string = 'baca'): boolean => {
    // Admin sistem has master access unless simulating a restricted role
    if (effectiveRole === 'admin_sistem' && !simulatedRole) return true;

    // Check specific role permissions matrix
    const roleMap = rolePermissions[effectiveRole];
    if (!roleMap) return false;

    const actions = roleMap[fiturId];
    if (!actions) return false;

    return actions.includes(action);
  };

  const isFinancialPrivileged = (): boolean => {
    // ARUS KAS, SALDO KAS, dan STATISTIK KEUANGAN HANYA UNTUK PENGASUH DAN BENDAHARA
    return effectiveRole === 'pengasuh' || effectiveRole === 'bendahara' || (effectiveRole === 'admin_sistem' && !simulatedRole);
  };

  return {
    currentUser,
    activeRole,
    simulatedRole,
    effectiveRole,
    can,
    isFinancialPrivileged,
  };
}

