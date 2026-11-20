import React, { useState } from 'react';
import {
  Globe,
  Clock,
  Building2,
  Wallet,
  ListChecks,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Save,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../../lib/store.ts';
import type { LandingPageConfig } from '../../data/seed/pondokData.ts';

interface LandingEditorTabProps {
  onNotify: (msg: string) => void;
}

type EditorSubSection = 'profil' | 'kegiatan' | 'fasilitas' | 'biaya_syarat' | 'alur_faq';

export const LandingEditorTab: React.FC<LandingEditorTabProps> = ({ onNotify }) => {
  const { landingConfig, updateLandingConfig, resetLandingConfig, santriList, ustadzList } =
    useAppStore();

  const [subSection, setSubSection] = useState<EditorSubSection>('profil');
  const [confirmReset, setConfirmReset] = useState(false);

  // Local draft for Profil form so typing is smooth, saved explicitly
  const [profilDraft, setProfilDraft] = useState({
    tahunAjaranLabel: landingConfig.tahunAjaranLabel,
    heroJudul: landingConfig.heroJudul,
    heroDeskripsi: landingConfig.heroDeskripsi,
    visiJudul: landingConfig.visiJudul,
    visiDeskripsi: landingConfig.visiDeskripsi,
    misiList: [...landingConfig.misiList],
    pengasuh: { ...landingConfig.pengasuh },
    statistik: { ...landingConfig.statistik },
    kontak: { ...landingConfig.kontak },
  });
  const [newMisi, setNewMisi] = useState('');

  // Kegiatan 24 Jam add form
  const [newKegWaktu, setNewKegWaktu] = useState('');
  const [newKegNama, setNewKegNama] = useState('');
  const [newKegKet, setNewKegKet] = useState('');

  // Fasilitas add form
  const [newFasJudul, setNewFasJudul] = useState('');
  const [newFasDesk, setNewFasDesk] = useState('');
  const [newFasDetailText, setNewFasDetailText] = useState('');
  const [newDetailDraftMap, setNewDetailDraftMap] = useState<Record<number, string>>({});

  // Biaya & Syarat add form
  const [newBiayaKomp, setNewBiayaKomp] = useState('');
  const [newBiayaNom, setNewBiayaNom] = useState<number>(0);
  const [newBiayaKet, setNewBiayaKet] = useState('');
  const [catatanBiayaDraft, setCatatanBiayaDraft] = useState(landingConfig.catatanBiaya);

  const [newSyaratKategori, setNewSyaratKategori] = useState('');
  const [newSyaratItemsText, setNewSyaratItemsText] = useState('');
  const [newSyaratItemMap, setNewSyaratItemMap] = useState<Record<number, string>>({});

  // Alur & FAQ add form
  const [alurJudulDraft, setAlurJudulDraft] = useState(landingConfig.alurJudulSection);
  const [newAlurNo, setNewAlurNo] = useState(String(landingConfig.alurDaftar.length + 1));
  const [newAlurTitle, setNewAlurTitle] = useState('');
  const [newAlurDesc, setNewAlurDesc] = useState('');

  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  const syncDraftsFromConfig = (cfg: LandingPageConfig) => {
    setProfilDraft({
      tahunAjaranLabel: cfg.tahunAjaranLabel,
      heroJudul: cfg.heroJudul,
      heroDeskripsi: cfg.heroDeskripsi,
      visiJudul: cfg.visiJudul,
      visiDeskripsi: cfg.visiDeskripsi,
      misiList: [...cfg.misiList],
      pengasuh: { ...cfg.pengasuh },
      statistik: { ...cfg.statistik },
      kontak: { ...cfg.kontak },
    });
    setCatatanBiayaDraft(cfg.catatanBiaya);
    setAlurJudulDraft(cfg.alurJudulSection);
  };

  const handleResetAll = () => {
    resetLandingConfig();
    const fresh = useAppStore.getState().landingConfig;
    syncDraftsFromConfig(fresh);
    setConfirmReset(false);
    onNotify('Informasi Landing Page dikembalikan ke data standar pondok.');
  };

  const handleSaveProfil = (e: React.FormEvent) => {
    e.preventDefault();
    updateLandingConfig({
      tahunAjaranLabel: profilDraft.tahunAjaranLabel.trim(),
      heroJudul: profilDraft.heroJudul.trim(),
      heroDeskripsi: profilDraft.heroDeskripsi.trim(),
      visiJudul: profilDraft.visiJudul.trim(),
      visiDeskripsi: profilDraft.visiDeskripsi.trim(),
      misiList: profilDraft.misiList.filter((m) => m.trim().length > 0),
      pengasuh: profilDraft.pengasuh,
      statistik: profilDraft.statistik,
      kontak: profilDraft.kontak,
    });
    onNotify('Profil Pondok, Hero, Visi Misi, Pengasuh & Kontak di Landing Page berhasil disimpan.');
  };

  const handleSyncStatsFromMaster = () => {
    const putra = santriList.filter((s) => s.gender === 'L').length;
    const putri = santriList.filter((s) => s.gender === 'P').length;
    const aktifAsatidz = ustadzList.filter((u) => u.statusAktif === 'Aktif').length;
    setProfilDraft((prev) => ({
      ...prev,
      statistik: {
        ...prev.statistik,
        totalSantri: santriList.length,
        santriPutra: putra,
        santriPutri: putri,
        asatidz: aktifAsatidz || ustadzList.length,
      },
    }));
    onNotify('Angka statistik disinkronkan dari Master Santri & Asatidz. Klik Simpan Profil untuk menerapkan.');
  };

  const moveArrayItem = <T,>(arr: T[], idx: number, dir: -1 | 1): T[] => {
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return arr;
    const next = [...arr];
    const [picked] = next.splice(idx, 1);
    next.splice(target, 0, picked);
    return next;
  };

  const navItems: { id: EditorSubSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'profil', label: 'Profil & Visi Misi', icon: Globe },
    { id: 'kegiatan', label: `Kegiatan 24 Jam (${landingConfig.kegiatanHarian.length})`, icon: Clock },
    { id: 'fasilitas', label: `Fasilitas (${landingConfig.fasilitas.length})`, icon: Building2 },
    { id: 'biaya_syarat', label: `Biaya & Syarat (${landingConfig.biayaPSB.length})`, icon: Wallet },
    { id: 'alur_faq', label: `Alur Daftar & FAQ (${landingConfig.alurDaftar.length})`, icon: ListChecks },
  ];

  return (
    <div className="space-y-5 no-print">
      {/* Header & Section Selector */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-700" />
              <span>Kelola Informasi Publik Landing Page Pondok</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit dan tambah informasi yang tampil di halaman depan website: Profil, Kegiatan 24 Jam, Fasilitas, Biaya &amp; Syarat, serta Alur Pendaftaran.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Bawaan</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 rounded-xl px-2.5 py-1.5 text-xs">
                <span className="font-bold text-rose-800">Reset semua?</span>
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="px-2.5 py-1 rounded-lg bg-rose-700 text-white font-bold"
                >
                  Ya, Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = subSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSubSection(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
                  active
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. PROFIL, HERO, VISI MISI, PENGASUH & KONTAK */}
      {subSection === 'profil' && (
        <form onSubmit={handleSaveProfil} className="space-y-5">
          {/* Hero & Pengumuman PSB */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Teks Pembuka (Hero) &amp; Status Pendaftaran
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Label Pengumuman Atas (Status PSB)
                </label>
                <input
                  type="text"
                  value={profilDraft.tahunAjaranLabel}
                  onChange={(e) =>
                    setProfilDraft({ ...profilDraft, tahunAjaranLabel: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Utama Hero</label>
                <input
                  type="text"
                  value={profilDraft.heroJudul}
                  onChange={(e) => setProfilDraft({ ...profilDraft, heroJudul: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Singkat Pondok</label>
                <textarea
                  rows={3}
                  value={profilDraft.heroDeskripsi}
                  onChange={(e) =>
                    setProfilDraft({ ...profilDraft, heroDeskripsi: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Statistik Profil */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <h4 className="font-bold text-sm text-slate-900">Angka Statistik Profil Pondok</h4>
              <button
                type="button"
                onClick={handleSyncStatsFromMaster}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Sinkronkan dari Data Master</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
              {[
                { key: 'totalSantri', label: 'Total Santri' },
                { key: 'santriPutra', label: 'Santri Putra' },
                { key: 'santriPutri', label: 'Santri Putri' },
                { key: 'asatidz', label: 'Dewan Asatidz' },
                { key: 'kamarPutra', label: 'Kamar Putra' },
                { key: 'kamarPutri', label: 'Kamar Putri' },
                { key: 'ruangKelas', label: 'Ruang Kelas' },
              ].map((st) => (
                <div key={st.key}>
                  <label className="block font-bold text-slate-700 mb-1">{st.label}</label>
                  <input
                    type="number"
                    min={0}
                    value={profilDraft.statistik[st.key as keyof typeof profilDraft.statistik]}
                    onChange={(e) =>
                      setProfilDraft({
                        ...profilDraft,
                        statistik: {
                          ...profilDraft.statistik,
                          [st.key]: parseInt(e.target.value, 10) || 0,
                        },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold tabular-nums text-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Visi & Misi */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4 text-xs">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Visi &amp; Misi Pesantren
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Rumusan Visi Utama</label>
                <input
                  type="text"
                  value={profilDraft.visiJudul}
                  onChange={(e) => setProfilDraft({ ...profilDraft, visiJudul: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Penjelasan Visi</label>
                <textarea
                  rows={2}
                  value={profilDraft.visiDeskripsi}
                  onChange={(e) =>
                    setProfilDraft({ ...profilDraft, visiDeskripsi: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="block font-bold text-slate-700">Daftar Poin Misi Pesantren</label>
                {profilDraft.misiList.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center shrink-0 tabular-nums">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={m}
                      onChange={(e) => {
                        const next = [...profilDraft.misiList];
                        next[idx] = e.target.value;
                        setProfilDraft({ ...profilDraft, misiList: next });
                      }}
                      className="flex-1 rounded-xl border border-slate-300 px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setProfilDraft({
                          ...profilDraft,
                          misiList: profilDraft.misiList.filter((_, i) => i !== idx),
                        })
                      }
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl shrink-0"
                      title="Hapus poin misi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Tambah poin misi baru..."
                    value={newMisi}
                    onChange={(e) => setNewMisi(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-300 px-3 py-2 bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newMisi.trim()) return;
                      setProfilDraft({
                        ...profilDraft,
                        misiList: [...profilDraft.misiList, newMisi.trim()],
                      });
                      setNewMisi('');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold flex items-center gap-1 whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Misi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pengasuh & Kontak */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
            <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-3">
              <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Profil Pengasuh Pondok
              </h4>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Pengasuh</label>
                <input
                  type="text"
                  value={profilDraft.pengasuh.nama}
                  onChange={(e) =>
                    setProfilDraft({
                      ...profilDraft,
                      pengasuh: { ...profilDraft.pengasuh, nama: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Gelar / Keterangan Jabatan</label>
                <input
                  type="text"
                  value={profilDraft.pengasuh.gelar}
                  onChange={(e) =>
                    setProfilDraft({
                      ...profilDraft,
                      pengasuh: { ...profilDraft.pengasuh, gelar: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Biografi Singkat</label>
                <textarea
                  rows={3}
                  value={profilDraft.pengasuh.biografi}
                  onChange={(e) =>
                    setProfilDraft({
                      ...profilDraft,
                      pengasuh: { ...profilDraft.pengasuh, biografi: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-3">
              <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Alamat &amp; Kontak Resmi
              </h4>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Jalan</label>
                <input
                  type="text"
                  value={profilDraft.kontak.alamat}
                  onChange={(e) =>
                    setProfilDraft({
                      ...profilDraft,
                      kontak: { ...profilDraft.kontak, alamat: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kecamatan</label>
                  <input
                    type="text"
                    value={profilDraft.kontak.kecamatan}
                    onChange={(e) =>
                      setProfilDraft({
                        ...profilDraft,
                        kontak: { ...profilDraft.kontak, kecamatan: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kabupaten</label>
                  <input
                    type="text"
                    value={profilDraft.kontak.kabupaten}
                    onChange={(e) =>
                      setProfilDraft({
                        ...profilDraft,
                        kontak: { ...profilDraft.kontak, kabupaten: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Pos</label>
                  <input
                    type="text"
                    value={profilDraft.kontak.kodePos}
                    onChange={(e) =>
                      setProfilDraft({
                        ...profilDraft,
                        kontak: { ...profilDraft.kontak, kodePos: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 tabular-nums"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Resmi</label>
                  <input
                    type="email"
                    value={profilDraft.kontak.email}
                    onChange={(e) =>
                      setProfilDraft({
                        ...profilDraft,
                        kontak: { ...profilDraft.kontak, email: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. Telepon / WhatsApp</label>
                  <input
                    type="text"
                    value={profilDraft.kontak.telepon}
                    onChange={(e) =>
                      setProfilDraft({
                        ...profilDraft,
                        kontak: { ...profilDraft.kontak, telepon: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 tabular-nums"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Profil &amp; Kontak</span>
            </button>
          </div>
        </form>
      )}

      {/* 2. KEGIATAN 24 JAM */}
      {subSection === 'kegiatan' && (
        <div className="space-y-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newKegWaktu.trim() || !newKegNama.trim()) return;
              updateLandingConfig({
                kegiatanHarian: [
                  ...landingConfig.kegiatanHarian,
                  {
                    waktu: newKegWaktu.trim(),
                    kegiatan: newKegNama.trim(),
                    keterangan: newKegKet.trim() || '-',
                  },
                ],
              });
              setNewKegWaktu('');
              setNewKegNama('');
              setNewKegKet('');
              onNotify('Jadwal kegiatan 24 jam baru berhasil ditambahkan ke Landing Page.');
            }}
            className="rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs space-y-3 text-xs"
          >
            <h4 className="font-bold text-sm text-slate-900">Tambah Jadwal Kegiatan 24 Jam Baru</h4>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
              <div className="sm:col-span-3">
                <label className="block font-bold text-slate-700 mb-1">Rentang Waktu (WIB)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 14.30 - 15.15"
                  value={newKegWaktu}
                  onChange={(e) => setNewKegWaktu(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 tabular-nums"
                />
              </div>
              <div className="sm:col-span-4">
                <label className="block font-bold text-slate-700 mb-1">Nama Kegiatan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Halaqoh Tahfidz Al-Qur'an"
                  value={newKegNama}
                  onChange={(e) => setNewKegNama(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block font-bold text-slate-700 mb-1">Keterangan</label>
                <input
                  type="text"
                  placeholder="Rincian tempat / isi kegiatan"
                  value={newKegKet}
                  onChange={(e) => setNewKegKet(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center justify-center gap-1 whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </div>
            </div>
          </form>

          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-sm text-slate-900">
                Daftar Jadwal Kegiatan Santri 24 Jam ({landingConfig.kegiatanHarian.length})
              </h4>
              <span className="text-xs text-slate-500">Perubahan langsung tersimpan otomatis</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {landingConfig.kegiatanHarian.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-center"
                >
                  <div className="lg:col-span-2">
                    <input
                      type="text"
                      value={item.waktu}
                      onChange={(e) => {
                        const next = landingConfig.kegiatanHarian.map((k, i) =>
                          i === idx ? { ...k, waktu: e.target.value } : k
                        );
                        updateLandingConfig({ kegiatanHarian: next });
                      }}
                      className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 font-bold tabular-nums text-emerald-900"
                    />
                  </div>
                  <div className="lg:col-span-4">
                    <input
                      type="text"
                      value={item.kegiatan}
                      onChange={(e) => {
                        const next = landingConfig.kegiatanHarian.map((k, i) =>
                          i === idx ? { ...k, kegiatan: e.target.value } : k
                        );
                        updateLandingConfig({ kegiatanHarian: next });
                      }}
                      className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 font-bold text-slate-900"
                    />
                  </div>
                  <div className="lg:col-span-4">
                    <input
                      type="text"
                      value={item.keterangan}
                      onChange={(e) => {
                        const next = landingConfig.kegiatanHarian.map((k, i) =>
                          i === idx ? { ...k, keterangan: e.target.value } : k
                        );
                        updateLandingConfig({ kegiatanHarian: next });
                      }}
                      className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-slate-700"
                    />
                  </div>
                  <div className="lg:col-span-2 flex items-center justify-end gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() =>
                        updateLandingConfig({
                          kegiatanHarian: moveArrayItem(landingConfig.kegiatanHarian, idx, -1),
                        })
                      }
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                      title="Naikkan urutan"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === landingConfig.kegiatanHarian.length - 1}
                      onClick={() =>
                        updateLandingConfig({
                          kegiatanHarian: moveArrayItem(landingConfig.kegiatanHarian, idx, 1),
                        })
                      }
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                      title="Turunkan urutan"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateLandingConfig({
                          kegiatanHarian: landingConfig.kegiatanHarian.filter((_, i) => i !== idx),
                        });
                        onNotify(`Kegiatan "${item.kegiatan}" dihapus.`);
                      }}
                      className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50"
                      title="Hapus kegiatan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. FASILITAS PONDOK */}
      {subSection === 'fasilitas' && (
        <div className="space-y-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newFasJudul.trim()) return;
              const details = newFasDetailText
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean);
              updateLandingConfig({
                fasilitas: [
                  ...landingConfig.fasilitas,
                  {
                    judul: newFasJudul.trim(),
                    deskripsi: newFasDesk.trim() || '-',
                    detail: details.length > 0 ? details : ['Tersedia untuk seluruh santri'],
                  },
                ],
              });
              setNewFasJudul('');
              setNewFasDesk('');
              setNewFasDetailText('');
              onNotify('Kartu fasilitas baru berhasil ditambahkan ke Landing Page.');
            }}
            className="rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs space-y-3 text-xs"
          >
            <h4 className="font-bold text-sm text-slate-900">Tambah Fasilitas / Unit Usaha Baru</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Fasilitas</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Aula Pertemuan & Masjid"
                  value={newFasJudul}
                  onChange={(e) => setNewFasJudul(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
                <input
                  type="text"
                  placeholder="Keterangan singkat fasilitas..."
                  value={newFasDesk}
                  onChange={(e) => setNewFasDesk(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Poin Keunggulan (pisahkan dengan Enter)
                </label>
                <textarea
                  rows={2}
                  placeholder={'Kapasitas 500 santri\nSound system terpadu'}
                  value={newFasDetailText}
                  onChange={(e) => setNewFasDetailText(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Fasilitas</span>
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {landingConfig.fasilitas.map((fas, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={fas.judul}
                      onChange={(e) => {
                        const next = landingConfig.fasilitas.map((f, i) =>
                          i === idx ? { ...f, judul: e.target.value } : f
                        );
                        updateLandingConfig({ fasilitas: next });
                      }}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 font-bold text-slate-900"
                    />
                    <textarea
                      rows={2}
                      value={fas.deskripsi}
                      onChange={(e) => {
                        const next = landingConfig.fasilitas.map((f, i) =>
                          i === idx ? { ...f, deskripsi: e.target.value } : f
                        );
                        updateLandingConfig({ fasilitas: next });
                      }}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-slate-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      updateLandingConfig({
                        fasilitas: landingConfig.fasilitas.filter((_, i) => i !== idx),
                      });
                      onNotify(`Fasilitas "${fas.judul}" dihapus.`);
                    }}
                    className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 shrink-0"
                    title="Hapus fasilitas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <p className="font-bold text-slate-700">Poin Rincian Fasilitas:</p>
                  {fas.detail.map((d, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <input
                        type="text"
                        value={d}
                        onChange={(e) => {
                          const next = landingConfig.fasilitas.map((f, i) =>
                            i === idx
                              ? {
                                  ...f,
                                  detail: f.detail.map((det, j) =>
                                    j === dIdx ? e.target.value : det
                                  ),
                                }
                              : f
                          );
                          updateLandingConfig({ fasilitas: next });
                        }}
                        className="flex-1 rounded-lg border border-slate-200 px-2.5 py-1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = landingConfig.fasilitas.map((f, i) =>
                            i === idx
                              ? { ...f, detail: f.detail.filter((_, j) => j !== dIdx) }
                              : f
                          );
                          updateLandingConfig({ fasilitas: next });
                        }}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="Tambah poin fasilitas..."
                      value={newDetailDraftMap[idx] || ''}
                      onChange={(e) =>
                        setNewDetailDraftMap({ ...newDetailDraftMap, [idx]: e.target.value })
                      }
                      className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = (newDetailDraftMap[idx] || '').trim();
                        if (!val) return;
                        const next = landingConfig.fasilitas.map((f, i) =>
                          i === idx ? { ...f, detail: [...f.detail, val] } : f
                        );
                        updateLandingConfig({ fasilitas: next });
                        setNewDetailDraftMap({ ...newDetailDraftMap, [idx]: '' });
                      }}
                      className="px-3 py-1 rounded-lg bg-emerald-800 text-white font-bold"
                    >
                      + Poin
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. BIAYA & SYARAT */}
      {subSection === 'biaya_syarat' && (
        <div className="space-y-6">
          {/* Rincian Biaya Pendaftaran */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  Tabel Rincian Biaya Pendaftaran &amp; Syahriyah Bulanan
                </h4>
                <p className="text-xs text-slate-500">
                  Nominal otomatis diformat rata kanan satu baris agar rapi saat dilihat calon wali santri.
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newBiayaKomp.trim()) return;
                updateLandingConfig({
                  biayaPSB: [
                    ...landingConfig.biayaPSB,
                    {
                      komponen: newBiayaKomp.trim(),
                      nominal: Math.max(0, newBiayaNom),
                      keterangan: newBiayaKet.trim() || '-',
                    },
                  ],
                });
                setNewBiayaKomp('');
                setNewBiayaNom(0);
                setNewBiayaKet('');
                onNotify('Komponen biaya baru berhasil ditambahkan ke Landing Page.');
              }}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 items-end"
            >
              <div className="sm:col-span-4">
                <label className="block font-bold text-slate-700 mb-1">Komponen Biaya</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengembangan Sarana Asrama"
                  value={newBiayaKomp}
                  onChange={(e) => setNewBiayaKomp(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-semibold"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block font-bold text-slate-700 mb-1">
                  Nominal ({`Rp ${Math.max(0, newBiayaNom).toLocaleString('id-ID')}`})
                </label>
                <input
                  type="number"
                  min={0}
                  step={5000}
                  required
                  value={newBiayaNom}
                  onChange={(e) => setNewBiayaNom(parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-bold tabular-nums text-right"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block font-bold text-slate-700 mb-1">Keterangan</label>
                <input
                  type="text"
                  placeholder="Waktu bayar / rincian manfaat"
                  value={newBiayaKet}
                  onChange={(e) => setNewBiayaKet(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center justify-center gap-1 whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Biaya</span>
                </button>
              </div>
            </form>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-2.5 px-3 text-left">Komponen Biaya</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap w-44">Nominal (Rp)</th>
                    <th className="py-2.5 px-3 text-left">Keterangan</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap w-28">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {landingConfig.biayaPSB.map((b, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={b.komponen}
                          onChange={(e) => {
                            const next = landingConfig.biayaPSB.map((item, i) =>
                              i === idx ? { ...item, komponen: e.target.value } : item
                            );
                            updateLandingConfig({ biayaPSB: next });
                          }}
                          className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 font-semibold text-slate-900"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={0}
                            step={5000}
                            value={b.nominal}
                            onChange={(e) => {
                              const next = landingConfig.biayaPSB.map((item, i) =>
                                i === idx
                                  ? { ...item, nominal: parseInt(e.target.value, 10) || 0 }
                                  : item
                              );
                              updateLandingConfig({ biayaPSB: next });
                            }}
                            className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-right font-bold text-emerald-900 tabular-nums"
                          />
                        </div>
                        <p className="text-[11px] font-bold text-emerald-800 text-right tabular-nums whitespace-nowrap mt-0.5">
                          Rp {b.nominal.toLocaleString('id-ID')}
                        </p>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={b.keterangan}
                          onChange={(e) => {
                            const next = landingConfig.biayaPSB.map((item, i) =>
                              i === idx ? { ...item, keterangan: e.target.value } : item
                            );
                            updateLandingConfig({ biayaPSB: next });
                          }}
                          className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-slate-700"
                        />
                      </td>
                      <td className="py-2 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() =>
                              updateLandingConfig({
                                biayaPSB: moveArrayItem(landingConfig.biayaPSB, idx, -1),
                              })
                            }
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === landingConfig.biayaPSB.length - 1}
                            onClick={() =>
                              updateLandingConfig({
                                biayaPSB: moveArrayItem(landingConfig.biayaPSB, idx, 1),
                              })
                            }
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateLandingConfig({
                                biayaPSB: landingConfig.biayaPSB.filter((_, i) => i !== idx),
                              });
                              onNotify(`Komponen biaya "${b.komponen}" dihapus.`);
                            }}
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 space-y-2">
              <label className="block font-bold text-slate-700">Catatan Tambahan Biaya (Kotak Kuning)</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={catatanBiayaDraft}
                  onChange={(e) => setCatatanBiayaDraft(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => {
                    updateLandingConfig({ catatanBiaya: catatanBiayaDraft.trim() });
                    onNotify('Catatan biaya Landing Page berhasil disimpan.');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold whitespace-nowrap flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Catatan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Syarat Perlengkapan Wajib */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4 text-xs">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Syarat &amp; Perlengkapan Wajib Dibawa Santri
            </h4>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newSyaratKategori.trim()) return;
                const items = newSyaratItemsText
                  .split('\n')
                  .map((s) => s.trim())
                  .filter(Boolean);
                updateLandingConfig({
                  syaratPerlengkapan: [
                    ...landingConfig.syaratPerlengkapan,
                    {
                      kategori: newSyaratKategori.trim(),
                      items: items.length > 0 ? items : ['Sesuai ketentuan pondok'],
                    },
                  ],
                });
                setNewSyaratKategori('');
                setNewSyaratItemsText('');
                onNotify('Kategori syarat perlengkapan baru ditambahkan.');
              }}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 items-end"
            >
              <div className="sm:col-span-4">
                <label className="block font-bold text-slate-700 mb-1">Nama Kategori Syarat</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Berkas Administrasi Wajib"
                  value={newSyaratKategori}
                  onChange={(e) => setNewSyaratKategori(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-semibold"
                />
              </div>
              <div className="sm:col-span-6">
                <label className="block font-bold text-slate-700 mb-1">
                  Daftar Item (pisahkan dengan Enter)
                </label>
                <textarea
                  rows={2}
                  placeholder={'Fotokopi KK 2 lembar\nFotokopi Akta Kelahiran'}
                  value={newSyaratItemsText}
                  onChange={(e) => setNewSyaratItemsText(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold whitespace-nowrap"
                >
                  + Kategori
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {landingConfig.syaratPerlengkapan.map((sy, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={sy.kategori}
                      onChange={(e) => {
                        const next = landingConfig.syaratPerlengkapan.map((s, i) =>
                          i === idx ? { ...s, kategori: e.target.value } : s
                        );
                        updateLandingConfig({ syaratPerlengkapan: next });
                      }}
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-bold text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        updateLandingConfig({
                          syaratPerlengkapan: landingConfig.syaratPerlengkapan.filter(
                            (_, i) => i !== idx
                          ),
                        });
                        onNotify(`Kategori syarat "${sy.kategori}" dihapus.`);
                      }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {sy.items.map((it, iIdx) => (
                      <div key={iIdx} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={it}
                          onChange={(e) => {
                            const next = landingConfig.syaratPerlengkapan.map((s, i) =>
                              i === idx
                                ? {
                                    ...s,
                                    items: s.items.map((val, j) =>
                                      j === iIdx ? e.target.value : val
                                    ),
                                  }
                                : s
                            );
                            updateLandingConfig({ syaratPerlengkapan: next });
                          }}
                          className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = landingConfig.syaratPerlengkapan.map((s, i) =>
                              i === idx
                                ? { ...s, items: s.items.filter((_, j) => j !== iIdx) }
                                : s
                            );
                            updateLandingConfig({ syaratPerlengkapan: next });
                          }}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="Tambah syarat baru..."
                      value={newSyaratItemMap[idx] || ''}
                      onChange={(e) =>
                        setNewSyaratItemMap({ ...newSyaratItemMap, [idx]: e.target.value })
                      }
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-2 py-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = (newSyaratItemMap[idx] || '').trim();
                        if (!val) return;
                        const next = landingConfig.syaratPerlengkapan.map((s, i) =>
                          i === idx ? { ...s, items: [...s.items, val] } : s
                        );
                        updateLandingConfig({ syaratPerlengkapan: next });
                        setNewSyaratItemMap({ ...newSyaratItemMap, [idx]: '' });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-800 text-white font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. ALUR DAFTAR & FAQ */}
      {subSection === 'alur_faq' && (
        <div className="space-y-6 text-xs">
          {/* Alur Pendaftaran */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Alur Pendaftaran Santri Baru (Landing Page)
            </h4>

            <div className="flex flex-col sm:flex-row gap-2 items-end">
              <div className="flex-1 w-full">
                <label className="block font-bold text-slate-700 mb-1">Judul Seksi Alur Daftar</label>
                <input
                  type="text"
                  value={alurJudulDraft}
                  onChange={(e) => setAlurJudulDraft(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  updateLandingConfig({ alurJudulSection: alurJudulDraft.trim() });
                  onNotify('Judul seksi Alur Pendaftaran diperbarui.');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold whitespace-nowrap"
              >
                Simpan Judul
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newAlurTitle.trim()) return;
                updateLandingConfig({
                  alurDaftar: [
                    ...landingConfig.alurDaftar,
                    {
                      no: newAlurNo.trim() || String(landingConfig.alurDaftar.length + 1),
                      title: newAlurTitle.trim(),
                      desc: newAlurDesc.trim() || '-',
                    },
                  ],
                });
                setNewAlurNo(String(landingConfig.alurDaftar.length + 2));
                setNewAlurTitle('');
                setNewAlurDesc('');
                onNotify('Langkah alur pendaftaran baru ditambahkan.');
              }}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 items-end"
            >
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Nomor</label>
                <input
                  type="text"
                  value={newAlurNo}
                  onChange={(e) => setNewAlurNo(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-center font-bold tabular-nums"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block font-bold text-slate-700 mb-1">Judul Langkah</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tes Penempatan Kelas"
                  value={newAlurTitle}
                  onChange={(e) => setNewAlurTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-semibold"
                />
              </div>
              <div className="sm:col-span-5">
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Langkah</label>
                <input
                  type="text"
                  placeholder="Penjelasan singkat..."
                  value={newAlurDesc}
                  onChange={(e) => setNewAlurDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold whitespace-nowrap"
                >
                  + Langkah
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {landingConfig.alurDaftar.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={step.no}
                      onChange={(e) => {
                        const next = landingConfig.alurDaftar.map((st, i) =>
                          i === idx ? { ...st, no: e.target.value } : st
                        );
                        updateLandingConfig({ alurDaftar: next });
                      }}
                      className="w-12 rounded-lg border border-slate-300 bg-white px-2 py-1 text-center font-bold tabular-nums"
                    />
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const next = landingConfig.alurDaftar.map((st, i) =>
                          i === idx ? { ...st, title: e.target.value } : st
                        );
                        updateLandingConfig({ alurDaftar: next });
                      }}
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 font-bold text-slate-900"
                    />
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() =>
                        updateLandingConfig({
                          alurDaftar: moveArrayItem(landingConfig.alurDaftar, idx, -1),
                        })
                      }
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-40"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === landingConfig.alurDaftar.length - 1}
                      onClick={() =>
                        updateLandingConfig({
                          alurDaftar: moveArrayItem(landingConfig.alurDaftar, idx, 1),
                        })
                      }
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-40"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateLandingConfig({
                          alurDaftar: landingConfig.alurDaftar.filter((_, i) => i !== idx),
                        });
                        onNotify(`Langkah "${step.title}" dihapus.`);
                      }}
                      className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={step.desc}
                    onChange={(e) => {
                      const next = landingConfig.alurDaftar.map((st, i) =>
                        i === idx ? { ...st, desc: e.target.value } : st
                      );
                      updateLandingConfig({ alurDaftar: next });
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-slate-700"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tanya Jawab (FAQ) */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Tanya Jawab Populer (FAQ Pondok)
            </h4>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newFaqQ.trim() || !newFaqA.trim()) return;
                updateLandingConfig({
                  faqs: [...landingConfig.faqs, { q: newFaqQ.trim(), a: newFaqA.trim() }],
                });
                setNewFaqQ('');
                setNewFaqA('');
                onNotify('Pertanyaan FAQ baru ditambahkan ke Landing Page.');
              }}
              className="grid grid-cols-1 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200"
            >
              <input
                type="text"
                required
                placeholder="Pertanyaan wali / calon santri..."
                value={newFaqQ}
                onChange={(e) => setNewFaqQ(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-semibold"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <textarea
                  rows={2}
                  required
                  placeholder="Jawaban resmi pengurus pondok..."
                  value={newFaqA}
                  onChange={(e) => setNewFaqA(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold whitespace-nowrap self-end sm:self-stretch"
                >
                  + Tambah FAQ
                </button>
              </div>
            </form>

            <div className="space-y-2.5">
              {landingConfig.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={faq.q}
                      onChange={(e) => {
                        const next = landingConfig.faqs.map((f, i) =>
                          i === idx ? { ...f, q: e.target.value } : f
                        );
                        updateLandingConfig({ faqs: next });
                      }}
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-bold text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        updateLandingConfig({
                          faqs: landingConfig.faqs.filter((_, i) => i !== idx),
                        });
                        onNotify('Item FAQ dihapus.');
                      }}
                      className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={faq.a}
                    onChange={(e) => {
                      const next = landingConfig.faqs.map((f, i) =>
                        i === idx ? { ...f, a: e.target.value } : f
                      );
                      updateLandingConfig({ faqs: next });
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-slate-700"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
