import { useAppStore } from './store.ts';

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
