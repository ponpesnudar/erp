import React, { useMemo, useState } from 'react';
import {
  KeyRound,
  Search,
  CheckCircle2,
  Plus,
  Users,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Phone,
  X,
  UserPlus,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '../../lib/store.ts';
import type { UserAccount, UstadzRecord } from '../../data/seed/pondokData.ts';

interface GuruLoginManagerPanelProps {
  compactHeader?: boolean;
  defaultScope?: 'guru' | 'semua';
}

const ROLE_OPTIONS: { id: UserAccount['peran']; label: string }[] = [
  { id: 'guru_pengampu', label: 'Guru Pengampu MDS' },
  { id: 'kepala_madin', label: 'Kepala Madrasah Diniyah' },
  { id: 'ketua_imtihan', label: 'Ketua Imtihan / Panitia' },
  { id: 'pengasuh', label: 'Pengasuh Pondok' },
  { id: 'sekretaris', label: 'Sekretariat Yayasan' },
  { id: 'bendahara', label: 'Bendahara & Kas Pondok' },
  { id: 'kemahadiyahan', label: "Pengurus Kema'hadiyahan" },
  { id: 'bk_keamanan', label: 'Ketertiban & BK Keamanan' },
  { id: 'kasir_kantin', label: 'Kasir Kantin & Laundry' },
  { id: 'admin_sistem', label: 'Administrator Sistem' },
];

function buildSlugUsername(nama: string): string {
  return (
    nama
      .replace(/^(KH\.|K\.|Kyai|Ust\.|Usth\.|Ustadz|Ustadzah|M\.|H\.|Hj\.)\s*/gi, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '.')
      .replace(/^\.+|\.+$/g, '')
      .slice(0, 20) || 'guru.darussalam'
  );
}

export const GuruLoginManagerPanel: React.FC<GuruLoginManagerPanelProps> = ({
  compactHeader = false,
  defaultScope = 'guru',
}) => {
  const {
    userAccounts,
    ustadzList,
    addUserAccount,
    updateUserAccount,
    deleteUserAccount,
  } = useAppStore();

  const [scope, setScope] = useState<'guru' | 'semua'>(defaultScope);
  const [guruFilter, setGuruFilter] = useState<'semua' | 'punya_akun' | 'belum_akun'>('semua');
  const [roleFilter, setRoleFilter] = useState<string>('Semua');
  const [search, setSearch] = useState('');
  const [showAllPasswords, setShowAllPasswords] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [editingModal, setEditingModal] = useState<{
    isNew: boolean;
    data: Partial<UserAccount>;
  } | null>(null);

  const [resetTarget, setResetTarget] = useState<{
    account: UserAccount;
    newPass: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 4000);
  };

  const findAccountForUstadz = (ust: UstadzRecord): UserAccount | undefined => {
    const ustNameNorm = ust.nama.trim().toLowerCase();
    return userAccounts.find(
      (acc) =>
        acc.ustadzId === ust.id ||
        acc.nama.trim().toLowerCase() === ustNameNorm ||
        (ust.noHP && acc.noWa && acc.noWa.replace(/[^0-9]/g, '') === ust.noHP.replace(/[^0-9]/g, ''))
    );
  };

  const guruPairedRows = useMemo(() => {
    return ustadzList.map((ust) => ({
      ustadz: ust,
      account: findAccountForUstadz(ust),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ustadzList, userAccounts]);

  const missingUstadzList = useMemo(
    () => guruPairedRows.filter((row) => !row.account).map((row) => row.ustadz),
    [guruPairedRows]
  );

  const filteredGuruRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return guruPairedRows.filter(({ ustadz, account }) => {
      if (guruFilter === 'punya_akun' && !account) return false;
      if (guruFilter === 'belum_akun' && account) return false;
      if (!q) return true;
      return (
        ustadz.nama.toLowerCase().includes(q) ||
        ustadz.nip.toLowerCase().includes(q) ||
        (account?.username || '').toLowerCase().includes(q) ||
        (account?.noWa || ustadz.noHP || '').toLowerCase().includes(q)
      );
    });
  }, [guruPairedRows, guruFilter, search]);

  const filteredAllAccounts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return userAccounts.filter((u) => {
      if (roleFilter !== 'Semua' && u.peran !== roleFilter) return false;
      if (!q) return true;
      return (
        u.nama.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.peranLabel.toLowerCase().includes(q) ||
        (u.noWa || '').toLowerCase().includes(q)
      );
    });
  }, [userAccounts, search, roleFilter]);

  const ensureUniqueUsername = (base: string): string => {
    const used = new Set(userAccounts.map((u) => u.username.toLowerCase()));
    if (!used.has(base.toLowerCase())) return base;
    let i = 2;
    while (used.has(`${base}${i}`.toLowerCase())) i += 1;
    return `${base}${i}`;
  };

  const handleBulkCreateMissing = () => {
    if (missingUstadzList.length === 0) return;
    missingUstadzList.forEach((ust, idx) => {
      const baseSlug = buildSlugUsername(ust.nama);
      const uniqueUsername = `${baseSlug}${userAccounts.some((u) => u.username === baseSlug) ? `.${idx + 1}` : ''}`;
      addUserAccount({
        nama: ust.nama,
        username: uniqueUsername,
        email: `${uniqueUsername}@darussalam.id`,
        noWa: ust.noHP || '',
        password: 'darussalam2026',
        peran: 'guru_pengampu',
        peranLabel: ust.jabatanUtama || 'Guru Pengampu MDS',
        avatar:
          ust.nama
            .split(/\s+/)
            .slice(0, 2)
            .map((w) => w.charAt(0).toUpperCase())
            .join('') || 'US',
        rolesAvailable: ['guru_pengampu'],
        keterangan: `Akun Login ERP ${ust.nama} (${ust.jabatanUtama})`,
        ustadzId: ust.id,
      });
    });
    showToast(`${missingUstadzList.length} akun login ERP untuk dewan asatidz berhasil dibuat (sandi awal: darussalam2026).`);
  };

  const openCreateForUstadz = (ust?: UstadzRecord) => {
    if (ust) {
      const username = ensureUniqueUsername(buildSlugUsername(ust.nama));
      setEditingModal({
        isNew: true,
        data: {
          nama: ust.nama,
          username,
          email: `${username}@darussalam.id`,
          noWa: ust.noHP || '08',
          password: 'darussalam2026',
          peran: 'guru_pengampu',
          peranLabel: ust.jabatanUtama || 'Guru Pengampu MDS',
          ustadzId: ust.id,
        },
      });
      return;
    }
    setEditingModal({
      isNew: true,
      data: {
        nama: '',
        username: '',
        email: '',
        noWa: '08',
        password: 'darussalam2026',
        peran: 'guru_pengampu',
        peranLabel: 'Guru Pengampu MDS',
      },
    });
  };

  const handleCopyCredentials = async (acc: UserAccount) => {
    const pwd = acc.password || 'darussalam2026';
    const text = `Akses Login ERP PP NU Darussalam\nNama: ${acc.nama}\nUsername: ${acc.username}\nKata Sandi: ${pwd}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(acc.id);
      window.setTimeout(() => setCopiedId(null), 2000);
      showToast(`Kredensial login ${acc.nama} disalin ke clipboard.`);
    } catch {
      showToast(`Username: ${acc.username} · Sandi: ${pwd}`);
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModal) return;
    const d = editingModal.data;
    if (!d.nama?.trim() || !d.username?.trim()) return;

    const peranId = (d.peran || 'guru_pengampu') as UserAccount['peran'];
    const matchedRole = ROLE_OPTIONS.find((r) => r.id === peranId);
    const cleanName = d.nama.trim();
    const cleanUser = d.username.trim();
    const payload: Omit<UserAccount, 'id'> = {
      nama: cleanName,
      username: cleanUser,
      email: d.email?.trim() || `${cleanUser}@darussalam.id`,
      noWa: d.noWa?.trim() || '',
      password: d.password?.trim() || 'darussalam2026',
      peran: peranId,
      peranLabel: d.peranLabel || matchedRole?.label || 'Guru Pengampu MDS',
      avatar:
        d.avatar ||
        cleanName
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w.charAt(0).toUpperCase())
          .join('') ||
        'US',
      rolesAvailable:
        d.rolesAvailable && d.rolesAvailable.length > 0 ? d.rolesAvailable : [peranId],
      keterangan: d.keterangan || `Akun Login ERP ${cleanName}`,
      ustadzId: d.ustadzId,
    };

    if (editingModal.isNew) {
      addUserAccount(payload);
      showToast(`Akun login ERP untuk ${cleanName} (@${cleanUser}) berhasil dibuat.`);
    } else if (d.id) {
      updateUserAccount(d.id, payload);
      showToast(`Data login ${cleanName} (@${cleanUser}) berhasil diperbarui.`);
    }
    setEditingModal(null);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget || !resetTarget.newPass.trim()) return;
    updateUserAccount(resetTarget.account.id, { password: resetTarget.newPass.trim() });
    showToast(`Kata sandi ${resetTarget.account.nama} berhasil direset.`);
    setResetTarget(null);
  };

  const registeredGuruCount = guruPairedRows.filter((r) => Boolean(r.account)).length;

  return (
    <div className="space-y-4">
      {toast && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-300 px-4 py-3 text-xs font-bold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header & Stats */}
      <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs space-y-4">
        {!compactHeader && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-700" />
                <span>Manajemen Data Login Guru &amp; Staf Masuk ERP</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola username, kata sandi, nomor WhatsApp OTP, dan hak akses login ERP untuk seluruh Dewan Asatidz PP NU Darussalam.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {missingUstadzList.length > 0 && (
                <button
                  type="button"
                  onClick={handleBulkCreateMissing}
                  className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-extrabold flex items-center gap-1.5 transition"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Buat Otomatis {missingUstadzList.length} Akun Guru</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => openCreateForUstadz()}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Akun Manual</span>
              </button>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] font-bold text-slate-500">Total Dewan Asatidz</p>
            <p className="text-xl font-extrabold text-slate-900 tabular-nums mt-0.5">{ustadzList.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <p className="text-[11px] font-bold text-emerald-800">Sudah Punya Akun Login</p>
            <p className="text-xl font-extrabold text-emerald-950 tabular-nums mt-0.5">{registeredGuruCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
            <p className="text-[11px] font-bold text-amber-800">Belum Punya Akun</p>
            <p className="text-xl font-extrabold text-amber-950 tabular-nums mt-0.5">{missingUstadzList.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200">
            <p className="text-[11px] font-bold text-sky-800">Total Semua Akun ERP</p>
            <p className="text-xl font-extrabold text-sky-950 tabular-nums mt-0.5">{userAccounts.length}</p>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setScope('guru')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                scope === 'guru'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Data Login Dewan Asatidz ({ustadzList.length})
            </button>
            <button
              type="button"
              onClick={() => setScope('semua')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                scope === 'semua'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Semua Akun Pengguna ERP ({userAccounts.length})
            </button>

            {scope === 'guru' ? (
              <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-[11px] ml-1">
                {([
                  { id: 'semua', label: 'Semua' },
                  { id: 'punya_akun', label: 'Sudah Aktif' },
                  { id: 'belum_akun', label: 'Belum Terdaftar' },
                ] as const).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setGuruFilter(f.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      guruFilter === f.id ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            ) : (
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700"
              >
                <option value="Semua">Semua Peran ({userAccounts.length})</option>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
                <option value="wali_santri">Wali Santri Terdaftar</option>
              </select>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {compactHeader && missingUstadzList.length > 0 && (
              <button
                type="button"
                onClick={handleBulkCreateMissing}
                className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-extrabold flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Buat {missingUstadzList.length} Akun</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowAllPasswords((v) => !v)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5"
            >
              {showAllPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showAllPasswords ? 'Sembunyikan Sandi' : 'Tampilkan Semua Sandi'}</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama guru, NIP, username login, atau nomor WA OTP..."
            className="w-full bg-transparent focus:outline-hidden text-slate-800"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          {scope === 'guru' ? (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-left font-bold">
                  <th className="py-2.5 px-3">Nama Ustadz / Guru</th>
                  <th className="py-2.5 px-3">Status Akun ERP</th>
                  <th className="py-2.5 px-3">Username Login</th>
                  <th className="py-2.5 px-3">Kata Sandi</th>
                  <th className="py-2.5 px-3">No. WA OTP</th>
                  <th className="py-2.5 px-3 text-right">Kelola Akses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGuruRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Tidak ada data guru yang sesuai filter pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredGuruRows.map(({ ustadz, account }) => {
                    const isRevealed = showAllPasswords || Boolean(account && revealedIds[account.id]);
                    const pwdValue = account?.password || 'darussalam2026';
                    return (
                      <tr key={ustadz.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3">
                          <p className="font-bold text-slate-900">{ustadz.nama}</p>
                          <p className="text-[10px] text-slate-500">
                            NIP {ustadz.nip} · {ustadz.jabatanUtama}
                          </p>
                        </td>
                        <td className="py-2.5 px-3">
                          {account ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              <ShieldCheck className="w-3 h-3" />
                              Aktif ({account.peranLabel})
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                              Belum Punya Akun
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">
                          {account ? account.username : <span className="text-slate-400 font-sans font-normal">-</span>}
                        </td>
                        <td className="py-2.5 px-3">
                          {account ? (
                            <div className="inline-flex items-center gap-1.5">
                              <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                {isRevealed ? pwdValue : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setRevealedIds((prev) => ({
                                    ...prev,
                                    [account.id]: !prev[account.id],
                                  }))
                                }
                                className="p-1 rounded hover:bg-slate-200 text-slate-600"
                                title={isRevealed ? 'Sembunyikan' : 'Lihat Kata Sandi'}
                              >
                                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 tabular-nums text-slate-700">
                          <span className="inline-flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-700" />
                            {account?.noWa || ustadz.noHP || '-'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {account ? (
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleCopyCredentials(account)}
                                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 font-bold inline-flex items-center gap-1"
                                title="Salin Username & Kata Sandi"
                              >
                                <Copy className="w-3 h-3" />
                                <span>{copiedId === account.id ? 'Disalin' : 'Salin'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setResetTarget({ account, newPass: 'darussalam2026' })}
                                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800"
                                title="Reset Kata Sandi"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingModal({ isNew: false, data: { ...account } })}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-emerald-800"
                                title="Edit Data Login"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              {account.id !== 'u-admin' && account.username !== 'admin' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteUserAccount(account.id);
                                    showToast(`Akun login ${account.nama} dihapus.`);
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                                  title="Hapus Akun Login"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openCreateForUstadz(ustadz)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold inline-flex items-center gap-1"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Buat Akun Login</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-left font-bold">
                  <th className="py-2.5 px-3">Nama Pengguna</th>
                  <th className="py-2.5 px-3">Username &amp; Email</th>
                  <th className="py-2.5 px-3">Kata Sandi</th>
                  <th className="py-2.5 px-3">No. WA (OTP)</th>
                  <th className="py-2.5 px-3">Peran</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAllAccounts.map((acc) => {
                  const isRevealed = showAllPasswords || Boolean(revealedIds[acc.id]);
                  const pwdValue = acc.password || 'darussalam2026';
                  return (
                    <tr key={acc.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{acc.nama}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold text-emerald-800">{acc.username}</span>
                        <span className="block text-[10px] text-slate-500">{acc.email}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="inline-flex items-center gap-1.5">
                          <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {isRevealed ? pwdValue : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setRevealedIds((prev) => ({
                                ...prev,
                                [acc.id]: !prev[acc.id],
                              }))
                            }
                            className="p-1 rounded hover:bg-slate-200 text-slate-600"
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 tabular-nums text-slate-700">{acc.noWa || '-'}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-bold">
                          {acc.peranLabel}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleCopyCredentials(acc)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700"
                            title="Salin Kredensial"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setResetTarget({ account: acc, newPass: 'darussalam2026' })}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800"
                            title="Reset Kata Sandi"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingModal({ isNew: false, data: { ...acc } })}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-emerald-800"
                            title="Edit Akun"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {acc.id !== 'u-admin' && acc.username !== 'admin' && (
                            <button
                              type="button"
                              onClick={() => {
                                deleteUserAccount(acc.id);
                                showToast(`Akun ${acc.nama} dihapus.`);
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
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Add / Edit Akun */}
      {editingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleSaveModal}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-3 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-900">
                {editingModal.isNew
                  ? 'Buat Akun Login Guru / Staf ERP'
                  : `Edit Data Login: ${editingModal.data.nama}`}
              </h3>
              <button type="button" onClick={() => setEditingModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {editingModal.isNew && (
              <div>
                <label className="block font-bold mb-1 text-emerald-900">
                  Hubungkan ke Data Dewan Asatidz (Opsional)
                </label>
                <select
                  value={editingModal.data.ustadzId || ''}
                  onChange={(e) => {
                    const ust = ustadzList.find((u) => u.id === e.target.value);
                    if (!ust) return;
                    const uname = ensureUniqueUsername(buildSlugUsername(ust.nama));
                    setEditingModal({
                      ...editingModal,
                      data: {
                        ...editingModal.data,
                        ustadzId: ust.id,
                        nama: ust.nama,
                        username: uname,
                        email: `${uname}@darussalam.id`,
                        noWa: ust.noHP || editingModal.data.noWa || '08',
                        peran: 'guru_pengampu',
                        peranLabel: ust.jabatanUtama || 'Guru Pengampu MDS',
                      },
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
                value={editingModal.data.nama || ''}
                onChange={(e) =>
                  setEditingModal({
                    ...editingModal,
                    data: { ...editingModal.data, nama: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-300 p-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold mb-1">Username Login</label>
                <input
                  type="text"
                  required
                  value={editingModal.data.username || ''}
                  onChange={(e) =>
                    setEditingModal({
                      ...editingModal,
                      data: { ...editingModal.data, username: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Kata Sandi</label>
                <input
                  type="text"
                  required
                  value={editingModal.data.password || ''}
                  onChange={(e) =>
                    setEditingModal({
                      ...editingModal,
                      data: { ...editingModal.data, password: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold mb-1">No. WhatsApp (OTP)</label>
                <input
                  type="text"
                  value={editingModal.data.noWa || ''}
                  onChange={(e) =>
                    setEditingModal({
                      ...editingModal,
                      data: { ...editingModal.data, noWa: e.target.value },
                    })
                  }
                  placeholder="08..."
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Email</label>
                <input
                  type="email"
                  value={editingModal.data.email || ''}
                  onChange={(e) =>
                    setEditingModal({
                      ...editingModal,
                      data: { ...editingModal.data, email: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Peran / Wewenang ERP</label>
              <select
                value={editingModal.data.peran || 'guru_pengampu'}
                onChange={(e) => {
                  const role = ROLE_OPTIONS.find((r) => r.id === e.target.value);
                  setEditingModal({
                    ...editingModal,
                    data: {
                      ...editingModal.data,
                      peran: e.target.value as UserAccount['peran'],
                      peranLabel: role?.label || 'Guru Pengampu MDS',
                    },
                  });
                }}
                className="w-full rounded-xl border border-slate-300 p-2 font-bold"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
              >
                Simpan Akun
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Reset Password Modal */}
      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleResetPasswordSubmit}
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-3 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-900">Reset Kata Sandi Login</h3>
              <button type="button" onClick={() => setResetTarget(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-slate-600">
              Atur ulang kata sandi untuk <strong>{resetTarget.account.nama}</strong> (
              <span className="font-mono text-emerald-800">@{resetTarget.account.username}</span>).
            </p>
            <div>
              <label className="block font-bold mb-1">Kata Sandi Baru</label>
              <input
                type="text"
                required
                value={resetTarget.newPass}
                onChange={(e) => setResetTarget({ ...resetTarget, newPass: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2 font-mono font-bold"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold"
              >
                Terapkan Sandi Baru
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
