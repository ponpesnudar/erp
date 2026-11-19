import React, { useState } from 'react';
import {
  KeyRound,
  Shield,
  Search,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Eye,
  Sliders,
  Check,
  Plus,
} from 'lucide-react';
import { useAppStore } from '../../lib/store.ts';
import { FITUR_WEWENANG_LIST, FiturWewenang } from '../../data/seed/pondokData.ts';

export const HakAksesModule: React.FC = () => {
  const {
    currentUser,
    rolePermissions,
    togglePermissionAction,
    setAllPermissionsForRole,
    simulateRole,
    simulatedRole,
    activeRole,
  } = useAppStore();

  const roleList = [
    { id: 'admin_sistem', nama: 'Administrator Sistem', kode: 'admin_sistem', izinCount: 1018 },
    { id: 'pengasuh', nama: 'Pengasuh Pondok', kode: 'pengasuh', izinCount: 84 },
    { id: 'ketua_imtihan', nama: 'Ketua Imtihan / Panitia', kode: 'ketua_imtihan', izinCount: 62 },
    { id: 'bendahara', nama: 'Bendahara & Kas Pondok', kode: 'bendahara', izinCount: 78 },
    { id: 'guru_pengampu', nama: 'Guru Pengampu MDS', kode: 'guru_pengampu', izinCount: 28 },
    { id: 'kepala_madin', nama: 'Kepala Madrasah Diniyah', kode: 'kepala_madin', izinCount: 56 },
    { id: 'sekretaris', nama: 'Sekretariat Yayasan', kode: 'sekretaris', izinCount: 64 },
    { id: 'kemahadiyahan', nama: 'Pengurus Kema\'hadiyahan', kode: 'kemahadiyahan', izinCount: 38 },
    { id: 'bk_keamanan', nama: 'Ketertiban & BK Keamanan', kode: 'bk_keamanan', izinCount: 32 },
    { id: 'kasir_kantin', nama: 'Kasir Kantin & Laundry', kode: 'kasir_kantin', izinCount: 24 },
    { id: 'wali_santri', nama: 'Wali Santri Terdaftar', kode: 'wali_santri', izinCount: 16 },
  ];

  const [selectedRoleId, setSelectedRoleId] = useState<string>('pengasuh');
  const [searchRole, setSearchRole] = useState<string>('');
  const [searchFeature, setSearchFeature] = useState<string>('');
  const [filterModul, setFilterModul] = useState<string>('Semua');
  const [onlySelected, setOnlySelected] = useState<boolean>(false);
  const [onlySensitive, setOnlySensitive] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  const currentRoleObj = roleList.find((r) => r.id === selectedRoleId) || roleList[0];
  const currentPermissions = rolePermissions[selectedRoleId] || {};

  // Action chips definitions with Lampiran A color coding
  const actionDefinitions: { key: string; label: string; group: 'baca' | 'tulis' | 'wewenang' | 'posting' | 'batal' | 'lainnya' }[] = [
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

  const filteredRoles = roleList.filter((r) =>
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

  return (
    <div className="space-y-6">
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Header Info & Simulation Control */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-700" />
            <span>Manajemen Role & Hak Akses ERP (Matriks Wewenang)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Peta wewenang interaktif (Lampiran A): klik chip aksi berwarna untuk menyalakan/mematikan izin akses.
          </p>
        </div>

        {/* Feature: Lihat Sebagai Peran (Simulasi Role Khusus Admin) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Simulasi Tampilan:</span>
          <select
            value={simulatedRole || ''}
            onChange={(e) => simulateRole(e.target.value ? e.target.value : null)}
            className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 focus:outline-hidden"
          >
            <option value="">Normal (Sesuai Akun Login)</option>
            {roleList.map((r) => (
              <option key={r.id} value={r.id}>
                Lihat sebagai: {r.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split Layout: Left Role List, Right Authority Map & Action Chip Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (3 cols): Role List with Search */}
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

        {/* Right Column (9 cols): Peta Wewenang Bar & Cards Grid */}
        <div className="lg:col-span-9 space-y-4">
          {/* Top Card: Peta Wewenang Stacked Bar (Lampiran A) */}
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

            {/* Stacked colored bar */}
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex">
              <div className="bg-emerald-600 h-full w-[25%]" title="Imtihan (25%)" />
              <div className="bg-blue-600 h-full w-[20%]" title="Ma'arifan (20%)" />
              <div className="bg-purple-600 h-full w-[20%]" title="Bendahara (20%)" />
              <div className="bg-amber-600 h-full w-[15%]" title="Sekretaris (15%)" />
              <div className="bg-rose-600 h-full w-[10%]" title="Transaksi (10%)" />
              <div className="bg-slate-600 h-full w-[10%]" title="Lainnya (10%)" />
            </div>

            {/* Legend Chips (Lampiran A) */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Baca (Lihat)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Tulis (Tambah & Ubah)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                Wewenang (Setujui)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                Posting & Keuangan
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                Batal & Hapus
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                <span>Izin Sensitif</span>
              </span>
            </div>
          </div>

          {/* Filter Bar (Search Capability, Modul, Selected Only, Sensitive) */}
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
                <option value="Ma'arifan">Ma'arifan</option>
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

          {/* Cards Grid of Features with Clickable Colored Action Chips */}
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

                  {/* Clickable Action Chips */}
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
                            title={`Klik untuk ${isActionActive ? 'mencabut' : 'memberikan'} izin ${act.label}`}
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

          {/* Bottom Review & Save Bar (Lampiran A) */}
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
                  setSaveSuccessMsg(`Izin wewenang untuk ${currentRoleObj.nama} berhasil diperbarui.`);
                  setTimeout(() => setSaveSuccessMsg(''), 3500);
                }}
                className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Tinjau & Simpan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
