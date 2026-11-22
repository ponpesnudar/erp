import React, { useMemo, useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  RotateCcw,
  BookOpen,
  Image as ImageIcon,
  Save,
  X,
  Upload,
} from 'lucide-react';
import { useAppStore } from '../../lib/store.ts';
import type { KhazanahCategory, KhazanahItem } from '../../data/seed/khazanahData.ts';

interface KhazanahCmsTabProps {
  onNotify: (msg: string) => void;
}

const CATEGORIES: KhazanahCategory[] = [
  'Wirid & Doa',
  'Tahlil & Yasin',
  'Maulid & Qasidah',
  'Tutorial Ibadah',
  'Ziarah',
  'Haji & Umrah',
  'Ramadhan',
  'Kalam & Infografik',
];

export const KhazanahCmsTab: React.FC<KhazanahCmsTabProps> = ({ onNotify }) => {
  const {
    khazanahItems,
    addKhazanahItem,
    updateKhazanahItem,
    deleteKhazanahItem,
    resetKhazanahItems,
    currentUser,
  } = useAppStore();

  const [filterCat, setFilterCat] = useState<'Semua' | KhazanahCategory>('Semua');
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<KhazanahItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [kategori, setKategori] = useState<KhazanahCategory>('Wirid & Doa');
  const [subKategori, setSubKategori] = useState('');
  const [judul, setJudul] = useState('');
  const [subjudul, setSubjudul] = useState('');
  const [teksArab, setTeksArab] = useState('');
  const [latin, setLatin] = useState('');
  const [terjemah, setTerjemah] = useState('');
  const [isiLengkap, setIsiLengkap] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [jarakKm, setJarakKm] = useState('');
  const [sumber, setSumber] = useState('Pustaka NU Darussalam');
  const [gambarUrl, setGambarUrl] = useState('');

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return khazanahItems.filter((item) => {
      if (filterCat !== 'Semua' && item.kategori !== filterCat) return false;
      if (!q) return true;
      return (
        item.judul.toLowerCase().includes(q) ||
        item.subKategori.toLowerCase().includes(q) ||
        item.isiLengkap.toLowerCase().includes(q) ||
        (item.lokasi || '').toLowerCase().includes(q)
      );
    });
  }, [khazanahItems, filterCat, search]);

  const openCreateForm = () => {
    setEditingItem(null);
    setKategori('Kalam & Infografik');
    setSubKategori('Kalam Harian');
    setJudul('');
    setSubjudul('');
    setTeksArab('');
    setLatin('');
    setTerjemah('');
    setIsiLengkap('');
    setLokasi('');
    setJarakKm('');
    setSumber('Sekretariat PP NU Darussalam');
    setGambarUrl('');
    setShowForm(true);
  };

  const openEditForm = (item: KhazanahItem) => {
    setEditingItem(item);
    setKategori(item.kategori);
    setSubKategori(item.subKategori || '');
    setJudul(item.judul);
    setSubjudul(item.subjudul || '');
    setTeksArab(item.teksArab || '');
    setLatin(item.latin || '');
    setTerjemah(item.terjemah || '');
    setIsiLengkap(item.isiLengkap);
    setLokasi(item.lokasi || '');
    setJarakKm(item.jarakKm || '');
    setSumber(item.sumber || '');
    setGambarUrl(item.gambarUrl || '');
    setShowForm(true);
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 720;
        const scale = img.width > maxW ? maxW / img.width : 1;
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setGambarUrl(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !isiLengkap.trim()) return;
    const payload = {
      kategori,
      subKategori: subKategori.trim() || kategori,
      judul: judul.trim(),
      subjudul: subjudul.trim() || undefined,
      teksArab: teksArab.trim() || undefined,
      latin: latin.trim() || undefined,
      terjemah: terjemah.trim() || undefined,
      isiLengkap: isiLengkap.trim(),
      lokasi: lokasi.trim() || undefined,
      jarakKm: jarakKm.trim() || undefined,
      sumber: sumber.trim() || undefined,
      gambarUrl: gambarUrl.trim() || undefined,
      ditambahkanOleh: currentUser.nama,
    };
    if (editingItem) {
      updateKhazanahItem(editingItem.id, payload);
      onNotify(`Materi "${payload.judul}" berhasil diperbarui dan langsung tampil di Landing Page.`);
    } else {
      addKhazanahItem(payload);
      onNotify(`Materi baru "${payload.judul}" berhasil ditambahkan ke Khazanah Landing Page.`);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>CMS Khazanah, Ibadah, Ziarah &amp; Kalam (Sinkron Real-Time ke Landing Page)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tambah, edit, atau hapus bacaan Wirid &amp; Doa, Tahlil, Maulid, Tutorial Ibadah, Tokoh Ziarah, Haji/Umrah, Ramadhan, maupun Poster Kalam &amp; Infografik pada Landing Page.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              resetKhazanahItems();
              onNotify('Katalog Khazanah Landing Page dikembalikan ke daftar bawaan.');
            }}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
          <button
            type="button"
            onClick={openCreateForm}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Materi / Infografik</span>
          </button>
        </div>
      </div>

      {/* Category Filter + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setFilterCat('Semua')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition ${
              filterCat === 'Semua'
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
            }`}
          >
            Semua ({khazanahItems.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = khazanahItems.filter((i) => i.kategori === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition ${
                  filterCat === cat
                    ? 'bg-emerald-800 text-white border-emerald-800'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul, teks, lokasi..."
            className="w-full rounded-xl border border-slate-300 pl-8 pr-3 py-1.5 text-xs"
          />
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between gap-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                    {item.kategori} · {item.subKategori}
                  </span>
                  <h4 className="font-extrabold text-xs text-slate-900 mt-1.5 leading-snug">
                    {item.judul}
                  </h4>
                  {item.subjudul && (
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.subjudul}</p>
                  )}
                </div>
                {item.gambarUrl && (
                  <img
                    src={item.gambarUrl}
                    alt={item.judul}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                )}
              </div>

              {item.teksArab && (
                <p
                  dir="rtl"
                  className="font-arabic text-sm text-emerald-950 bg-white border border-emerald-100 rounded-xl px-2.5 py-2 leading-loose line-clamp-2"
                >
                  {item.teksArab}
                </p>
              )}

              <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                {item.isiLengkap}
              </p>

              {(item.lokasi || item.jarakKm) && (
                <p className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
                  Lokasi: {item.lokasi || '-'} {item.jarakKm ? `(${item.jarakKm})` : ''}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[10px] text-slate-500">
              <span>Update: {item.tanggalUpdate}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditForm(item)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 text-emerald-800 font-bold inline-flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteKhazanahItem(item.id);
                    onNotify(`Materi "${item.judul}" dihapus dari Landing Page.`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-red-50 border border-slate-200 text-red-700 font-bold inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h4 className="font-extrabold text-sm text-slate-900">
                {editingItem ? `Edit Materi: ${editingItem.judul}` : 'Tambah Materi Khazanah & Ibadah Landing Page'}
              </h4>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Utama</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as KhazanahCategory)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sub-Kategori / Bagian</label>
                <input
                  type="text"
                  value={subKategori}
                  onChange={(e) => setSubKategori(e.target.value)}
                  placeholder="Contoh: Shalawat / Tokoh Ziarah / Kalam Harian"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Materi *</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Shalawat Nariyah / Kiai Sholeh Darat"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subjudul / Ringkasan Singkat</label>
                <input
                  type="text"
                  value={subjudul}
                  onChange={(e) => setSubjudul(e.target.value)}
                  placeholder="Opsional..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teks Arab Berharakat (Opsional)</label>
              <textarea
                dir="rtl"
                rows={2}
                value={teksArab}
                onChange={(e) => setTeksArab(e.target.value)}
                placeholder="اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ..."
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-arabic"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Transliterasi Latin</label>
                <textarea
                  rows={2}
                  value={latin}
                  onChange={(e) => setLatin(e.target.value)}
                  placeholder="Allāhumma ṣalli..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Terjemah / Arti</label>
                <textarea
                  rows={2}
                  value={terjemah}
                  onChange={(e) => setTerjemah(e.target.value)}
                  placeholder="Artinya..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Isi Lengkap / Penjelasan / Biografi *</label>
              <textarea
                rows={3}
                required
                value={isiLengkap}
                onChange={(e) => setIsiLengkap(e.target.value)}
                placeholder="Tuliskan bacaan, kaifiyah, sejarah tokoh, atau isi infografik secara lengkap..."
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi (Jika Ziarah)</label>
                <input
                  type="text"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  placeholder="Semarang, Jawa Tengah"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jarak Tempuh</label>
                <input
                  type="text"
                  value={jarakKm}
                  onChange={(e) => setJarakKm(e.target.value)}
                  placeholder="Contoh: 112.4 km"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sumber / Kitab Rujukan</label>
                <input
                  type="text"
                  value={sumber}
                  onChange={(e) => setSumber(e.target.value)}
                  placeholder="Pustaka NU / Kitab Kuning"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 space-y-2">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                <span>Gambar / Poster Infografik (URL atau Unggah File)</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={gambarUrl}
                  onChange={(e) => setGambarUrl(e.target.value)}
                  placeholder="https://... atau /assets/..."
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs bg-white"
                />
                <label className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-300 text-xs font-bold text-emerald-800 inline-flex items-center gap-1.5 cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah Gambar</span>
                  <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
                </label>
              </div>
              {gambarUrl && (
                <div className="flex items-center gap-3 pt-1">
                  <img
                    src={gambarUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setGambarUrl('')}
                    className="text-[11px] font-bold text-red-600 hover:underline"
                  >
                    Hapus Gambar
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{editingItem ? 'Simpan Perubahan' : 'Simpan & Tampilkan di Landing'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
