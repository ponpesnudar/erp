import React, { useState } from 'react';
import {
  KeyRound,
  Search,
  CheckCircle2,
  AlertTriangle,
  Save,
  Plus,
  Users,
  Edit3,
  Trash2,
  Rocket,
  X,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '../../lib/store.ts';
import { FITUR_WEWENANG_LIST, type UserAccount } from '../../data/seed/pondokData.ts';

export const HakAksesModule: React.FC = () => {
  const {
    rolePermissions,
    togglePermissionAction,
    setAllPermissionsForRole,
    simulateRole,
    simulatedRole,
    userAccounts,
    ustadzList,
    addUserAccount,
    updateUserAccount,
    deleteUserAccount,
    isDemoMode,
    activateGoLiveMode,
  } = useAppStore();

  const roleList = [
    { id: 'admin_sistem', nama: 'Administrator Sistem', kode: 'admin_sistem', izinCount: 1018 },
    { id: 'pengasuh', nama: 'Pengasuh Pondok', kode: 'pengasuh', izinCount: 84 },
    { id: 'ketua_imtihan', nama: 'Ketua Imtihan / Panitia', kode: 'ketua_imtihan', izinCount: 62 },
    { id: 'bendahara', nama: 'Bendahara & Kas Pondok', kode: 'bendahara', izinCount: 78 },
    { id: 'guru_pengampu', nama: 'Guru Pengampu MDS', kode: 'guru_pengampu', izinCount: 28 },
    { id: 'kepala_madin', nama: 'Kepala Madrasah Diniyah', kode: 'kepala_madin', izinCount: 56 },
    { id: 'sekretaris', nama: 'Sekretariat Yayasan', kode: 'sekretaris', izinCount: 64 },
    { id: 'kemahadiyahan', nama: "Pengurus Kema'hadiyahan", kode: 'kemahadiyahan', izinCount: 38 },
    { id: 'bk_keamanan', nama: 'Ketertiban & BK Keamanan', kode: 'bk_keamanan', izinCount: 32 },
    { id: 'kasir_kantin', nama: 'Kasir Kantin & Laundry', kode: 'kasir_kantin', izinCount: 24 },
    { id: 'wali_santri', nama: 'Wali Santri Terdaftar', kode: 'wali_santri', izinCount: 16 },
  ];

  const [subTab, setSubTab] = useState<'wewenang' | 'akun' | 'golive'>('wewenang');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('pengasuh');
  const [searchRole, setSearchRole] = useState<string>('');
  const [searchFeature, setSearchFeature] = useState<string>('');
  const [filterModul, setFilterModul] = useState<string>('Semua');
  const [onlySelected, setOnlySelected] = useState<boolean>(false);
  const [onlySensitive, setOnlySensitive] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  // Account Management state
  const [accountSearch, setAccountSearch] = useState('');
  const [accountRoleFilter, setAccountRoleFilter] = useState('Semua');
  const [editingUser, setEditingUser] = useState<Partial<UserAccount> | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  // Go-Live Modal state
  const [showGoLiveConfirm, setShowGoLiveConfirm] = useState(false);

  const currentRoleObj = roleList.find((r) => r.id === selectedRoleId) || roleList[0];
  const currentPermissions = rolePermissions[selectedRoleId] || {};

  const actionDefinitions: {
    key: string;
    label: string;
    group: 'baca' | 'tulis' | 'wewenang' | 'posting' | 'batal' | 'lainnya';
  }[] = [
    { key: 'baca', label: 'Lihat', group: 'baca' },
    { key: 'tulis', label: 'Tambah', group: 'tulis' },
    { key: 'ubah', label: 'Ubah', group: 'tulis' },
    { key: 'setujui', label: 'Setujui', group: 'wewenang' },
    { key: 'posting', label: 'Posting Kas', group: 'posting' },
    { key: 'hapus', label: 'Hapus / Nonaktifkan', group: 'batal' },
    { key: 'cetak', label: 'Cetak Dokumen', group: 'lainnya' },
    { key: 'ekspor', label: 'Ekspor Data', group: 'lainnya' },
    { key: 'konfigurasi', label: 'Konfigurasi', group: 'lainnya' },
  ];

  const actionGroupColors: Record<string, { active: string; inactive: string }> = {
    baca: {
      active: 'bg-blue-600 text-white border-blue-700 shadow-xs',
      inactive: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    },
    tulis: {
      active: 'bg-emerald-600 text-white border-emerald-700 shadow-xs',
      inactive: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    },
    wewenang: {
      active: 'bg-amber-600 text-white border-amber-700 shadow-xs',
      inactive: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
    },
    posting: {
      active: 'bg-purple-600 text-white border-purple-700 shadow-xs',
      inactive: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    },
    batal: {
      active: 'bg-rose-600 text-white border-rose-700 shadow-xs',
      inactive: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
    },
    lainnya: {
      active: 'bg-slate-700 text-white border-slate-800 shadow-xs',
      inactive: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
    },
  };

  const filteredRoles = roleList.filter(
    (r) =>
      r.nama.toLowerCase().includes(searchRole.toLowerCase()) ||
      r.kode.toLowerCase().includes(searchRole.toLowerCase())
  );

  const filteredFeatures = FITUR_WEWENANG_LIST.filter((fw) => {
    if (filterModul !== 'Semua' && fw.modul !== filterModul) return false;
    if (onlySensitive && !fw.isSensitif) return false;
    if (searchFeature && !fw.nama.toLowerCase().includes(searchFeature.toLowerCase())) return false;
    if (onlySelected) {
      const activeActions = currentPermissions[fw.id] || [];
      if (activeActions.length === 0) return false;
    }
    return true;
  });

  const handleChipClick = (fiturId: string, actionKey: string) => {
    togglePermissionAction(selectedRoleId, fiturId, actionKey);
    setHasUnsavedChanges(true);
  };

  const handleSelectAll = (all: boolean) => {
    setAllPermissionsForRole(selectedRoleId, all);
    setHasUnsavedChanges(true);
  };

  const notify = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const filteredUsers = userAccounts.filter((u) => {
    if (accountRoleFilter !== 'Semua' && u.peran !== accountRoleFilter) return false;
    if (!accountSearch.trim()) return true;
    const q = accountSearch.toLowerCase();
    return (
      u.nama.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.noWa || '').includes(q)
    );
  });

  const handleSaveUserModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser?.nama?.trim() || !editingUser?.username?.trim()) return;
    const peranId = (editingUser.peran || 'guru_pengampu') as UserAccount['peran'];
    const matchedRole = roleList.find((r) => r.id === peranId);
    const cleanName = editingUser.nama.trim();
    const cleanUser = editingUser.username.trim();
    const payload: Omit<UserAccount, 'id'> = {
      nama: cleanName,
      username: cleanUser,
      email: editingUser.email?.trim() || `${cleanUser}@darussalam.id`,
      noWa: editingUser.noWa?.trim() || '',
      password: editingUser.password?.trim() || 'darussalam2026',
      peran: peranId,
      peranLabel: editingUser.peranLabel || matchedRole?.nama || 'Guru Pengampu MDS',
      avatar:
        editingUser.avatar ||
        cleanName
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w.charAt(0).toUpperCase())
          .join('') ||
        'US',
      rolesAvailable:
        editingUser.rolesAvailable && editingUser.rolesAvailable.length > 0
          ? editingUser.rolesAvailable
          : [peranId],
      keterangan:
        editingUser.keterangan ||
        `Akun resmi ${matchedRole?.nama || 'Pengajar / Staf'} PP NU Darussalam.`,
      ustadzId: editingUser.ustadzId,
    };

    if (isNewUser) {
      addUserAccount(payload);
      notify(`Akun baru untuk ${payload.nama} berhasil dibuat.`);
    } else if (editingUser.id) {
      updateUserAccount(editingUser.id, payload);
      notify(`Akun ${payload.nama} berhasil diperbarui.`);
    }
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Header & Sub-Tab Navigation */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-700" />
              <span>Manajemen Hak Akses, Akun Guru/Staf &amp; Mode Go-Live</span>
            </h2>
            <p className="text-xs text-slate-500">
              Kelola matriks wewenang role, akun individu seluruh ustadz/ustadzah beserta nomor WhatsApp OTP, serta aktivasi Mode Go-Live pesantren.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                isDemoMode
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}
            >
              {isDemoMode ? 'Mode Demo Aktif' : 'Mode Go-Live (Produksi)'}
            </span>

            <select
              value={simulatedRole || ''}
              onChange={(e) => simulateRole(e.target.value ? e.target.value : null)}
              className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 focus:outline-hidden"
            >
              <option value="">Simulasi: Normal (Akun Login)</option>
              {roleList.map((r) => (
                <option key={r.id} value={r.id}>
                  Lihat sebagai: {r.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setSubTab('wewenang')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              subTab === 'wewenang'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Matriks Wewenang Role
          </button>
          <button
            type="button"
            onClick={() => setSubTab('akun')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              subTab === 'akun'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Akun Guru &amp; Staf ({userAccounts.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('golive')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              subTab === 'golive'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Aktivasi Mode Go-Live</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: MATRIKS WEWENANG ROLE */}
      {subTab === 'wewenang' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-xs text-slate-900">Daftar Role ERP</h3>
              <span className="text-[10px] text-slate-400 font-semibold">{roleList.length} role</span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchRole}
                onChange={(e) => setSearchRole(e.target.value)}
                placeholder="Cari nama atau kode role..."
                className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs focus:outline-hidden"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
              {filteredRoles.map((role) => {
                const isSelected = selectedRoleId === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={`w-full p-2.5 rounded-xl text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs truncate">{role.nama}</p>
                      <p
                        className={`text-[10px] truncate ${
                          isSelected ? 'text-emerald-200' : 'text-slate-400'
                        }`}
                      >
                        {role.kode}
                      </p>
                    </div>
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-[9px] font-bold tabular-nums shrink-0 ${
                        isSelected
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {role.izinCount} izin
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-9 space-y-4">
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">
                    Peta Wewenang: {currentRoleObj.nama}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Warna membedakan modul; segmen menghitung izin aktif role ini per modul.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-800 tabular-nums">
                  {Object.values(currentPermissions).flat().length} Total Izin Aktif
                </span>
              </div>

              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex">
                <div className="bg-emerald-600 h-full w-[25%]" title="Imtihan (25%)" />
                <div className="bg-blue-600 h-full w-[20%]" title="Ma'arifan (20%)" />
                <div className="bg-purple-600 h-full w-[20%]" title="Bendahara (20%)" />
                <div className="bg-amber-600 h-full w-[15%]" title="Sekretaris (15%)" />
                <div className="bg-rose-600 h-full w-[10%]" title="Transaksi (10%)" />
                <div className="bg-slate-600 h-full w-[10%]" title="Lainnya (10%)" />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-medium text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Baca (Lihat)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Tulis (Tambah &amp; Ubah)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  Wewenang (Setujui)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  Posting &amp; Keuangan
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  Batal &amp; Hapus
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-3 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchFeature}
                  onChange={(e) => setSearchFeature(e.target.value)}
                  placeholder="Cari fitur, mis. naskah soal, raport, arus kas..."
                  className="w-full bg-transparent border-none text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filterModul}
                  onChange={(e) => setFilterModul(e.target.value)}
                  className="rounded-xl border border-slate-200 px-2.5 py-1 text-xs"
                >
                  <option value="Semua">Semua Modul</option>
                  <option value="Imtihan">Imtihan</option>
                  <option value="Ma'arifan">Ma&apos;arifan</option>
                  <option value="Sekretaris">Sekretaris</option>
                  <option value="Bendahara">Bendahara</option>
                  <option value="Transaksi">Transaksi</option>
                  <option value="PSB">PSB</option>
                  <option value="BK">BK</option>
                </select>

                <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 text-xs px-2 py-1 rounded-lg hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={onlySelected}
                    onChange={(e) => setOnlySelected(e.target.checked)}
                    className="rounded text-emerald-800"
                  />
                  <span>Dipilih Saja</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 text-xs px-2 py-1 rounded-lg hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={onlySensitive}
                    onChange={(e) => setOnlySensitive(e.target.checked)}
                    className="rounded text-rose-600"
                  />
                  <span>Izin Sensitif</span>
                </label>

                <button
                  onClick={() => handleSelectAll(true)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs"
                >
                  Semua Izin
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredFeatures.map((fitur) => {
                const activeActionsForFitur = currentPermissions[fitur.id] || [];
                const availableKeys = Object.keys(fitur.actions).filter(
                  (k) => fitur.actions[k as keyof typeof fitur.actions]
                );

                return (
                  <div
                    key={fitur.id}
                    className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          {fitur.isSensitif && (
                            <span
                              className="w-2 h-2 rounded-full bg-rose-500 shrink-0"
                              title="Izin Sensitif Keuangan/Akademik"
                            />
                          )}
                          <h4 className="font-bold text-xs text-slate-900 leading-tight">
                            {fitur.nama}
                          </h4>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600 tabular-nums">
                          {activeActionsForFitur.length}/{availableKeys.length}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                        {fitur.deskripsi}
                      </p>
                    </div>

                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {actionDefinitions
                        .filter((act) => fitur.actions[act.key as keyof typeof fitur.actions])
                        .map((act) => {
                          const isActionActive = activeActionsForFitur.includes(act.key);
                          const styleClass = isActionActive
                            ? actionGroupColors[act.group].active
                            : actionGroupColors[act.group].inactive;

                          return (
                            <button
                              key={act.key}
                              type="button"
                              onClick={() => handleChipClick(fitur.id, act.key)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition flex items-center gap-1 cursor-pointer ${styleClass}`}
                            >
                              <span>{isActionActive ? '✓' : '+'}</span>
                              <span>{act.label}</span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-md flex items-center justify-between sticky bottom-4 z-20">
              <div>
                <p className="font-bold text-xs text-slate-900">
                  {hasUnsavedChanges ? 'Ada perubahan izin belum tersimpan' : 'Tidak ada perubahan'}
                </p>
                <p className="text-[11px] text-slate-500">
                  Hak akses langsung membatasi menu, rute, tombol aksi, dan penyajian data keuangan.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={!hasUnsavedChanges}
                  onClick={() => setHasUnsavedChanges(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition disabled:opacity-40"
                >
                  Batalkan Perubahan
                </button>
                <button
                  disabled={!hasUnsavedChanges}
                  onClick={() => {
                    setHasUnsavedChanges(false);
                    notify(`Izin wewenang untuk ${currentRoleObj.nama} berhasil diperbarui.`);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Tinjau &amp; Simpan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: AKUN GURU & STAF INDIVIDUAL */}
      {subTab === 'akun' && (
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Daftar Akun Individu Ustadz, Ustadzah &amp; Pengurus Pondok
              </h3>
              <p className="text-xs text-slate-500">
                Setiap pengajar &amp; staf memiliki akun login pribadi dan nomor WhatsApp aktif untuk reset kata sandi OTP.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {(() => {
                const missingUstadz = ustadzList.filter(
                  (ust) =>
                    !userAccounts.some(
                      (acc) =>
                        acc.ustadzId === ust.id ||
                        acc.nama.toLowerCase() === ust.nama.toLowerCase()
                    )
                );
                if (missingUstadz.length === 0) return null;
                return (
                  <button
                    type="button"
                    onClick={() => {
                      missingUstadz.forEach((ust) => {
                        const slug = ust.nama
                          .replace(/^(KH\.|Ust\.|Usth\.|M\.|H\.)\s*/i, '')
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '.')
                          .replace(/^\.+|\.+$/g, '')
                          .slice(0, 18);
                        addUserAccount({
                          nama: ust.nama,
                          username: slug || ust.id,
                          email: `${slug || ust.id}@darussalam.id`,
                          noWa: ust.noHP || '',
                          password: 'darussalam2026',
                          peran: 'guru_pengampu',
                          peranLabel: ust.jabatanUtama || 'Guru Pengampu MDS',
                          avatar: ust.nama
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((w) => w.charAt(0).toUpperCase())
                            .join(''),
                          rolesAvailable: ['guru_pengampu'],
                          keterangan: `Akun guru ${ust.nama} (${ust.jabatanUtama})`,
                          ustadzId: ust.id,
                        });
                      });
                      notify(`${missingUstadz.length} akun ustadz/ustadzah baru berhasil dibuat.`);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Buat Akun {missingUstadz.length} Ustadz Belum Terdaftar</span>
                  </button>
                );
              })()}
              <button
                type="button"
                onClick={() => {
                  setIsNewUser(true);
                  setEditingUser({
                    nama: '',
                    username: '',
                    email: '',
                    noWa: '08',
                    password: 'darussalam2026',
                    peran: 'guru_pengampu',
                    peranLabel: 'Guru Pengampu MDS',
                  });
                }}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Akun Baru</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-1.5 flex-1 min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={accountSearch}
                onChange={(e) => setAccountSearch(e.target.value)}
                placeholder="Cari nama, username, email, atau nomor WA..."
                className="w-full bg-transparent focus:outline-hidden"
              />
            </div>

            <select
              value={accountRoleFilter}
              onChange={(e) => setAccountRoleFilter(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-1.5 font-bold text-xs"
            >
              <option value="Semua">Semua Peran ({userAccounts.length})</option>
              {roleList.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-left font-bold">
                  <th className="py-2.5 px-3">Nama Pengguna</th>
                  <th className="py-2.5 px-3">Username &amp; Email</th>
                  <th className="py-2.5 px-3">No. WhatsApp (OTP)</th>
                  <th className="py-2.5 px-3">Peran</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{usr.nama}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono font-bold text-emerald-800">{usr.username}</span>
                      <span className="block text-[10px] text-slate-500">{usr.email}</span>
                    </td>
                    <td className="py-2.5 px-3 tabular-nums text-slate-700">
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-700" />
                        {usr.noWa || '-'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-bold">
                        {usr.peranLabel}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsNewUser(false);
                            setEditingUser({ ...usr });
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-emerald-800"
                          title="Edit Akun"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {usr.id !== 'u-admin' && usr.username !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              deleteUserAccount(usr.id);
                              notify(`Akun ${usr.nama} dihapus.`);
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                            title="Hapus Akun"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: AKTIVASI MODE GO-LIVE (HAPUS DATA DEMO) */}
      {subTab === 'golive' && (
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-emerald-700" />
                <span>Aktivasi Mode Go-Live (Bersihkan Data Simulasi / Demo)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Saat pesantren siap operasional penuh, bersihkan seluruh data contoh simulasi sambil mempertahankan master kurikulum, jadwal, kalender akademik, dan akun pengguna resmi.
              </p>
            </div>
            <span
              className={`px-4 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
                isDemoMode
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}
            >
              Status Saat Ini: {isDemoMode ? 'MODE DEMO' : 'MODE GO-LIVE AKTIF'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
              <p className="font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Data Demo yang Akan Dikosongkan:</span>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-rose-900/90">
                <li>130 data santri fiktif simulasi &amp; pendaftar PSB demo</li>
                <li>Riwayat transaksi kantin / laundry &amp; titipan wali demo</li>
                <li>Catatan buku kas transaksi &amp; riwayat bisyaroh demo</li>
                <li>Log absensi santri, absensi guru, nilai raport &amp; pelanggaran demo</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Data Master Resmi yang Tetap Dipertahankan:</span>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-emerald-900/90">
                <li>Seluruh akun guru &amp; staf ({userAccounts.length} akun) beserta kata sandi</li>
                <li>Data Dewan Asatidz Putra &amp; Putri, Matriks Kurikulum 22 Fan, &amp; Kitab PDF</li>
                <li>Jadwal pelajaran kelas 1–6, kalender pendidikan &amp; struktur role wewenang</li>
                <li>Mengaktifkan Mode Go-Live otomatis menyembunyikan daftar Akun Demo di halaman Login</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            {isDemoMode ? (
              <button
                type="button"
                onClick={() => setShowGoLiveConfirm(true)}
                className="px-6 py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-sm flex items-center gap-2"
              >
                <Rocket className="w-4 h-4" />
                <span>Bersihkan Data Demo &amp; Aktifkan Mode Go-Live</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Sistem sudah berjalan dalam Mode Go-Live (Produksi).</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Akun Guru & Staf */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleSaveUserModal}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-3 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-900">
                {isNewUser ? 'Tambah Akun Guru / Staf' : `Edit Akun: ${editingUser.nama}`}
              </h3>
              <button type="button" onClick={() => setEditingUser(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isNewUser && (
              <div>
                <label className="block font-bold mb-1 text-emerald-900">
                  Isi Cepat dari Data Ustadz / Ustadzah (Opsional)
                </label>
                <select
                  value={editingUser.ustadzId || ''}
                  onChange={(e) => {
                    const ust = ustadzList.find((u) => u.id === e.target.value);
                    if (!ust) return;
                    const slug = ust.nama
                      .replace(/^(KH\.|Ust\.|Usth\.|M\.|H\.)\s*/i, '')
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '.')
                      .replace(/^\.+|\.+$/g, '')
                      .slice(0, 18);
                    setEditingUser({
                      ...editingUser,
                      ustadzId: ust.id,
                      nama: ust.nama,
                      username: slug,
                      email: `${slug}@darussalam.id`,
                      noWa: ust.noHP || editingUser.noWa || '08',
                      peran: 'guru_pengampu',
                      peranLabel: ust.jabatanUtama || 'Guru Pengampu MDS',
                    });
                  }}
                  className="w-full rounded-xl border border-emerald-300 bg-emerald-50/50 p-2 font-semibold"
                >
                  <option value="">-- Pilih Ustadz/Ustadzah untuk Auto-Isi --</option>
                  {ustadzList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nama} ({u.jabatanUtama})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block font-bold mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                value={editingUser.nama || ''}
                onChange={(e) => setEditingUser({ ...editingUser, nama: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={editingUser.username || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">No. WhatsApp (OTP)</label>
                <input
                  type="text"
                  value={editingUser.noWa || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, noWa: e.target.value })}
                  placeholder="08..."
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Kata Sandi</label>
                <input
                  type="text"
                  value={editingUser.password || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Peran Utama</label>
              <select
                value={editingUser.peran || 'guru_pengampu'}
                onChange={(e) => {
                  const r = roleList.find((x) => x.id === e.target.value);
                  setEditingUser({
                    ...editingUser,
                    peran: e.target.value as UserAccount['peran'],
                    peranLabel: r?.nama || 'Guru Pengampu MDS',
                  });
                }}
                className="w-full rounded-xl border border-slate-300 p-2 font-bold"
              >
                {roleList.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
              >
                Simpan Akun
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Konfirmasi Go-Live Modal */}
      {showGoLiveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Konfirmasi Aktivasi Go-Live</h3>
                <p className="text-slate-500">
                  Seluruh data demo simulasi akan dihapus permanen. Data akun guru &amp; kurikulum tetap aman.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowGoLiveConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  activateGoLiveMode();
                  setShowGoLiveConfirm(false);
                  notify('Mode Go-Live diaktifkan! Seluruh data simulasi demo telah dibersihkan.');
                }}
                className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold"
              >
                Ya, Aktifkan Go-Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
