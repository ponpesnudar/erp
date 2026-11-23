import React, { useMemo, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Trash2,
  Save,
  Bell,
  Lock,
  Layers,
  HelpCircle,
  LogOut,
  ChevronRight,
  CalendarDays,
  BookOpen,
  UserCheck,
  X,
} from 'lucide-react';
import { useAppStore } from '../../lib/store.ts';
import { useAuth, canAccessErpTab } from '../../lib/auth.ts';
import { UserAvatarBadge } from '../../components/common/UserAvatarBadge.tsx';
import { PWAInstallButton } from '../../components/pwa/PWAInstallButton.tsx';
import { formatNamaWithGelar } from '../../data/seed/pondokData.ts';

interface ProfilPenggunaModuleProps {
  onNavigateErp: (tab: string) => void;
  onLogout?: () => void;
}

function calcShiftDurationLabel(jamMulai: string, jamSelesai: string): string {
  const [sh, sm] = jamMulai.split(':').map(Number);
  const [eh, em] = jamSelesai.split(':').map(Number);
  if (!Number.isFinite(sh) || !Number.isFinite(eh)) return '1 Jam';
  const totalMins = Math.max(0, eh * 60 + (em || 0) - (sh * 60 + (sm || 0)));
  if (totalMins === 60) return '1 Jam (60 mnt)';
  if (totalMins > 60 && totalMins % 60 === 0) return `${totalMins / 60} Jam`;
  if (totalMins > 60) return `${Math.floor(totalMins / 60)}j ${totalMins % 60}m`;
  return `${totalMins} mnt`;
}

async function compressAvatarFile(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Gagal membaca berkas foto.'));
    reader.readAsDataURL(file);
  });

  if (!dataUrl.startsWith('data:image/')) {
    throw new Error('Berkas harus berupa gambar (JPG/PNG/WebP).');
  }

  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const targetSize = 360;
      const canvas = document.createElement('canvas');
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      const minSide = Math.min(img.naturalWidth || targetSize, img.naturalHeight || targetSize);
      const sx = Math.max(0, ((img.naturalWidth || minSide) - minSide) / 2);
      const sy = Math.max(0, ((img.naturalHeight || minSide) - minSide) / 2);
      ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, targetSize, targetSize);
      resolve(canvas.toDataURL('image/jpeg', 0.84));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export const ProfilPenggunaModule: React.FC<ProfilPenggunaModuleProps> = ({
  onNavigateErp,
  onLogout,
}) => {
  const {
    currentUser,
    activeRole,
    ustadzList,
    absensiShiftConfigs,
    sdmNotifEnabled,
    pinPengesahanMap,
    updateCurrentUserProfile,
    toggleSdmNotif,
    setUserPinPengesahan,
    switchRole,
    logout,
  } = useAppStore();

  const { effectiveRole, can } = useAuth();

  const matchedUstadz = useMemo(() => {
    if (currentUser.ustadzId) {
      const byId = ustadzList.find((u) => u.id === currentUser.ustadzId);
      if (byId) return byId;
    }
    const cleanCurr = currentUser.nama.replace(/^(KH\.|Ust\.|Usth\.|Ustzh\.)\s*/i, '').toLowerCase();
    return ustadzList.find((u) => u.nama.toLowerCase().includes(cleanCurr));
  }, [currentUser, ustadzList]);

  const displayName = matchedUstadz
    ? formatNamaWithGelar(matchedUstadz.nama, matchedUstadz.gender)
    : currentUser.nama;

  const pondokJabatan = useMemo(() => {
    if (matchedUstadz) {
      const unit = matchedUstadz.tugasTambahanSatminkal || 'Madrasah Diniyah Salafiyah';
      return `${matchedUstadz.jabatanUtama} · ${unit}`;
    }
    return `${currentUser.peranLabel} · PP NU Darussalam`;
  }, [matchedUstadz, currentUser]);

  const defaultShift = absensiShiftConfigs.find((s) => s.aktif) || absensiShiftConfigs[0];

  const [namaInput, setNamaInput] = useState(currentUser.nama);
  const [emailInput, setEmailInput] = useState(currentUser.email);
  const [noWaInput, setNoWaInput] = useState(currentUser.noWa || '');
  const [keteranganInput, setKeteranganInput] = useState(currentUser.keterangan || '');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [toast, setToast] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);

  const notify = (msg: string) => {
    setErrorMsg('');
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadingPhoto(true);
    setErrorMsg('');
    try {
      const compressed = await compressAvatarFile(file);
      updateCurrentUserProfile({ avatar: compressed });
      notify('Foto profil berhasil diperbarui dan tampil di seluruh ERP.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal mengunggah foto profil.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaInput.trim()) return;
    updateCurrentUserProfile({
      nama: namaInput.trim(),
      email: emailInput.trim() || currentUser.email,
      noWa: noWaInput.trim(),
      keterangan: keteranganInput.trim(),
    });
    notify('Biodata & kontak profil berhasil disimpan.');
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold">
          {errorMsg}
        </div>
      )}

      {/* Hero Photo Profile Banner */}
      <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="relative shrink-0">
            <UserAvatarBadge
              src={currentUser.avatar}
              name={displayName}
              sizeClass="w-24 h-24"
              textClass="text-2xl"
              roundedClass="rounded-3xl"
              borderClass="border-2 border-emerald-600 shadow-sm"
            />
            <label
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white flex items-center justify-center shadow-md cursor-pointer border-2 border-white transition"
              title="Unggah / Ganti Foto Profil"
            >
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadAvatar}
                disabled={uploadingPhoto}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-1.5 min-w-0">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              {currentUser.peranLabel}
            </span>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 break-words">
              {displayName}
            </h1>
            <p className="text-xs text-slate-500">{pondokJabatan}</p>
            <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer transition min-h-[40px]">
                <Camera className="w-3.5 h-3.5" />
                <span>{uploadingPhoto ? 'Memproses...' : 'Unggah / Ganti Foto Sendiri'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadAvatar}
                  disabled={uploadingPhoto}
                  className="hidden"
                />
              </label>
              {currentUser.avatar && (
                <button
                  type="button"
                  onClick={() => {
                    updateCurrentUserProfile({ avatar: '' });
                    notify('Foto profil dihapus, menampilkan inisial akun.');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold transition min-h-[40px]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Foto</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-col gap-2 justify-center sm:items-end shrink-0">
          {canAccessErpTab('sdm_absensi', effectiveRole, can) && (
            <button
              type="button"
              onClick={() => onNavigateErp('sdm_absensi')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold transition"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Buka Absensi GPS</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigateErp('ibadah_khazanah')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ibadah &amp; Khazanah</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Editable Form & Pondok Metadata */}
        <div className="lg:col-span-7 space-y-5">
          <form
            onSubmit={handleSaveBio}
            className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Pengaturan Biodata &amp; Kontak</h2>
                <p className="text-[11px] text-slate-500">Perubahan tersimpan otomatis untuk akun aktif Anda.</p>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Tampilan</label>
                <input
                  type="text"
                  required
                  value={namaInput}
                  onChange={(e) => setNamaInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp</label>
                <input
                  type="text"
                  value={noWaInput}
                  onChange={(e) => setNoWaInput(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold text-slate-900 tabular-nums focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Email Akun</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Catatan Tugas / Bio Singkat</label>
                <textarea
                  rows={2}
                  value={keteranganInput}
                  onChange={(e) => setKeteranganInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-800 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>
          </form>

          {/* Identity Read-only Summary */}
          <div className="rounded-3xl bg-white border border-slate-200 px-5 py-2 shadow-2xs divide-y divide-slate-100 text-xs">
            <div className="py-3.5 flex items-center justify-between gap-4">
              <span className="text-slate-500">Username Login</span>
              <strong className="text-slate-900 font-mono">@{currentUser.username}</strong>
            </div>
            <div className="py-3.5 flex items-center justify-between gap-4">
              <span className="text-slate-500">Nomor Induk (NIP / ID)</span>
              <strong className="text-slate-900 tabular-nums">
                {matchedUstadz?.nip || currentUser.id.toUpperCase()}
              </strong>
            </div>
            {defaultShift && (
              <div className="py-3.5 flex items-center justify-between gap-4">
                <span className="text-slate-500">Sesi Tugas Pondok</span>
                <strong className="text-slate-900 text-right tabular-nums">
                  {defaultShift.nama} ({defaultShift.jamMulai.replace(':', '.')}–
                  {defaultShift.jamSelesai.replace(':', '.')} ·{' '}
                  {calcShiftDurationLabel(defaultShift.jamMulai, defaultShift.jamSelesai)})
                </strong>
              </div>
            )}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <span className="text-slate-500">Atasan / Penanggung Jawab</span>
              <strong className="text-slate-900 text-right">
                {effectiveRole === 'pengasuh'
                  ? 'Dewan Masyayikh'
                  : effectiveRole === 'kepala_madin'
                  ? 'KH. Amin Maizun (Pengasuh)'
                  : "Ust. H Zaenal Arifin (Kepala Majlis Ma'arif)"}
              </strong>
            </div>
          </div>
        </div>

        {/* Right: Quick Security & App Controls */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 p-2 shadow-2xs divide-y divide-slate-100 text-xs">
          <button
            type="button"
            onClick={() => {
              toggleSdmNotif();
              notify(sdmNotifEnabled ? 'Notifikasi HP dimatikan.' : 'Notifikasi HP diaktifkan.');
            }}
            className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-slate-50 rounded-2xl transition min-h-[56px]"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900">
                Notifikasi HP: {sdmNotifEnabled ? 'Aktif' : 'Nonaktif'}
              </p>
              <p className="text-[11px] text-slate-500">Ketuk untuk menyalakan/mematikan</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setPinInput(pinPengesahanMap[currentUser.id] || '');
              setShowPinModal(true);
            }}
            className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-slate-50 rounded-2xl transition min-h-[56px]"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900">PIN Pengesahan Dokumen</p>
              <p className="text-[11px] text-slate-500">Atur atau ganti PIN tanda tangan digital</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          {currentUser.rolesAvailable.length > 1 && (
            <button
              type="button"
              onClick={() => setShowRoleModal(true)}
              className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-slate-50 rounded-2xl transition min-h-[56px]"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900">Ganti Peran Aktif</p>
                <p className="text-[11px] text-slate-500">
                  Aktif: {activeRole.replace('_', ' ').toUpperCase()} ({currentUser.rolesAvailable.length} peran)
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onNavigateErp('kalender')}
            className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-slate-50 rounded-2xl transition min-h-[56px]"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900">Kalender Pendidikan Pondok</p>
              <p className="text-[11px] text-slate-500">Lihat jadwal libur, imtihan, &amp; agenda pondok</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => onNavigateErp('panduan')}
            className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-slate-50 rounded-2xl transition min-h-[56px]"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900">Buku Panduan &amp; Tutorial</p>
              <p className="text-[11px] text-slate-500">Petunjuk pasang aplikasi &amp; video panduan</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          <div className="p-3">
            <PWAInstallButton variant="header" />
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              onLogout?.();
            }}
            className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-rose-50 rounded-2xl transition min-h-[56px]"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <LogOut className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-rose-700">Keluar dari Akun</p>
              <p className="text-[11px] text-slate-500">Mengakhiri sesi pada perangkat ini</p>
            </div>
          </button>
        </div>
      </div>

      {/* Modal PIN Pengesahan */}
      {showPinModal && (
        <div
          onClick={() => setShowPinModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 no-print"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              if (pinInput.length < 4) return;
              setUserPinPengesahan(currentUser.id, pinInput);
              setShowPinModal(false);
              notify('PIN Pengesahan dokumen berhasil disimpan.');
            }}
            className="w-full max-w-xs rounded-3xl bg-white p-6 shadow-2xl space-y-3 text-xs"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Atur PIN Pengesahan (4–6 Digit)</h3>
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="password"
              required
              minLength={4}
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Masukkan 4–6 digit angka..."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-center text-base font-mono tracking-widest"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="px-3 py-2 rounded-xl bg-slate-100 font-bold"
              >
                Batal
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold">
                Simpan PIN
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Ganti Peran */}
      {showRoleModal && (
        <div
          onClick={() => setShowRoleModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 no-print"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Ganti Peran Aktif</h3>
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {currentUser.rolesAvailable.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    switchRole(r);
                    setShowRoleModal(false);
                    notify(`Berhasil beralih ke peran ${r.replace('_', ' ').toUpperCase()}.`);
                  }}
                  className={`w-full p-3 rounded-xl text-left text-xs font-bold transition flex items-center justify-between ${
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
          </div>
        </div>
      )}
    </div>
  );
};
