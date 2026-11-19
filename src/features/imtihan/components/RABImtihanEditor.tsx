import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  Printer,
  RotateCcw,
  CheckCircle2,
  Edit2,
  Save,
  Check,
  TrendingUp,
  Percent,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import { useAppStore } from '../../../lib/store.ts';
import { RabItem } from '../../../data/seed/pondokData.ts';

export interface RABImtihanEditorProps {
  /** Optional custom items */
  items?: RabItem[];
  /** Callback saat ada perubahan item */
  onItemsChange?: (items: RabItem[]) => void;
  /** Tampilkan kop banner resmi imtihan */
  showOfficialBanner?: boolean;
}

/**
 * Komponen RABImtihanEditor
 * Memungkinkan input & manajemen item anggaran:
 * - Kategori (Pemasukan, Penggadaan, Insentif, Tunjangan, Perlengkapan, Konsumsi, UsulanTambahan)
 * - Deskripsi (Keterangan)
 * - Volume (QTY)
 * - Satuan
 * - Harga Satuan
 * - Total (Kalkulasi Otomatis: volume * harga satuan)
 * - Fitur Edit & Simpan (Inline & Modal Form Dialog)
 */
export const RABImtihanEditor: React.FC<RABImtihanEditorProps> = ({
  showOfficialBanner = true,
}) => {
  const { rabImtihan, updateRabItem, addRabItem, deleteRabItem, resetRabImtihan } = useAppStore();

  // Kategori options
  const kategoriList: Array<RabItem['kategori']> = [
    'Pemasukan',
    'Penggadaan',
    'Insentif',
    'Tunjangan',
    'Perlengkapan',
    'Konsumsi',
    'UsulanTambahan',
  ];

  const kategoriLabels: Record<RabItem['kategori'], string> = {
    Pemasukan: 'PEMASUKAN KEGIATAN',
    Penggadaan: '1. PENGGADAAN SOAL & NASKAH',
    Insentif: '2. INSENTIF & HONORARIUM',
    Tunjangan: '3. TUNJANGAN POKOK PANITIA',
    Perlengkapan: '4. PERLENGKAPAN & ATK',
    Konsumsi: '5. KONSUMSI & LOGISTIK',
    UsulanTambahan: 'USULAN TAMBAHAN (OPSIONAL)',
  };

  // State Modal Form (Untuk Tambah atau Edit Item)
  const [modalMode, setModalMode] = useState<'tambah' | 'edit'>('tambah');
  const [showItemModal, setShowItemModal] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Form Fields: Kategori, Deskripsi, Volume, Satuan, Harga Satuan, Total
  const [formKategori, setFormKategori] = useState<RabItem['kategori']>('Perlengkapan');
  const [formDeskripsi, setFormDeskripsi] = useState<string>('');
  const [formVolume, setFormVolume] = useState<number>(1);
  const [formSatuan, setFormSatuan] = useState<string>('Paket');
  const [formHargaSatuan, setFormHargaSatuan] = useState<number>(10000);

  // Total terhitung otomatis dari volume * hargaSatuan
  const formTotalOtomatis = useMemo(() => {
    return Math.max(0, formVolume) * Math.max(0, formHargaSatuan);
  }, [formVolume, formHargaSatuan]);

  // State toggle usulan tambahan
  const [includeUsulan, setIncludeUsulan] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>('Semua');

  // Kalkulasi Real-time
  const stats = useMemo(() => {
    const totalPemasukan = rabImtihan
      .filter((r) => r.kategori === 'Pemasukan')
      .reduce((sum, r) => sum + r.qty * r.harga, 0);

    const totalPengeluaranPokok = rabImtihan
      .filter((r) => r.kategori !== 'Pemasukan' && r.kategori !== 'UsulanTambahan')
      .reduce((sum, r) => sum + r.qty * r.harga, 0);

    const totalUsulan = rabImtihan
      .filter((r) => r.kategori === 'UsulanTambahan')
      .reduce((sum, r) => sum + r.qty * r.harga, 0);

    const saldoPokok = totalPemasukan - totalPengeluaranPokok;
    const saldoAkhir = totalPemasukan - (totalPengeluaranPokok + (includeUsulan ? totalUsulan : 0));

    return {
      totalPemasukan,
      totalPengeluaranPokok,
      totalUsulan,
      saldoPokok,
      saldoAkhir,
    };
  }, [rabImtihan, includeUsulan]);

  // Buka Modal untuk Tambah Baru
  const handleOpenTambah = (kategoriTarget?: RabItem['kategori']) => {
    setModalMode('tambah');
    setEditingItemId(null);
    setFormKategori(kategoriTarget || 'Perlengkapan');
    setFormDeskripsi('');
    setFormVolume(1);
    setFormSatuan(kategoriTarget === 'Insentif' || kategoriTarget === 'Tunjangan' ? 'Orang' : 'Paket');
    setFormHargaSatuan(25000);
    setShowItemModal(true);
  };

  // Buka Modal untuk Edit Item
  const handleOpenEdit = (item: RabItem) => {
    setModalMode('edit');
    setEditingItemId(item.id);
    setFormKategori(item.kategori);
    setFormDeskripsi(item.keterangan);
    setFormVolume(item.qty);
    setFormSatuan(item.satuan);
    setFormHargaSatuan(item.harga);
    setShowItemModal(true);
  };

  // Simpan Item (Tambah atau Update)
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDeskripsi.trim()) return;

    if (modalMode === 'edit' && editingItemId) {
      updateRabItem({
        id: editingItemId,
        kategori: formKategori,
        keterangan: formDeskripsi.trim(),
        qty: Math.max(1, formVolume),
        satuan: formSatuan.trim() || 'Paket',
        harga: Math.max(0, formHargaSatuan),
        jumlah: formTotalOtomatis,
      });
    } else {
      addRabItem({
        kategori: formKategori,
        keterangan: formDeskripsi.trim(),
        qty: Math.max(1, formVolume),
        satuan: formSatuan.trim() || 'Paket',
        harga: Math.max(0, formHargaSatuan),
        jumlah: formTotalOtomatis,
      });
    }

    setShowItemModal(false);
  };

  // Inline Quick Edits
  const handleInlineVolumeChange = (item: RabItem, newVolume: number) => {
    const vol = isNaN(newVolume) ? 0 : Math.max(0, newVolume);
    updateRabItem({
      ...item,
      qty: vol,
      jumlah: vol * item.harga,
    });
  };

  const handleInlineHargaSatuanChange = (item: RabItem, newHarga: number) => {
    const hrg = isNaN(newHarga) ? 0 : Math.max(0, newHarga);
    updateRabItem({
      ...item,
      harga: hrg,
      jumlah: item.qty * hrg,
    });
  };

  const handleInlineDeskripsiChange = (item: RabItem, newDesc: string) => {
    updateRabItem({
      ...item,
      keterangan: newDesc,
    });
  };

  const handleInlineSatuanChange = (item: RabItem, newSat: string) => {
    updateRabItem({
      ...item,
      satuan: newSat,
    });
  };

  return (
    <div className="space-y-6">
      {/* 
        ========================================================================
        HEADER & RINGKASAN REAL-TIME KPI (PEMASUKAN, PENGELUARAN, SALDO)
        ========================================================================
      */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <FileSpreadsheet className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-slate-900">
                Rancangan Anggaran Biaya (RAB) Imtihan 1
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                Kalkulasi Otomatis Aktif
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Input kategori, deskripsi, volume, satuan, dan harga satuan. Total jumlah dan saldo dihitung seketika.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenTambah()}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input Item Anggaran</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset data RAB ke angka standar lampiran resmi kepanitiaan?')) {
                  resetRabImtihan();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold transition flex items-center gap-1"
              title="Kembalikan ke nilai bawaan fisik"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Dokumen</span>
            </button>
          </div>
        </div>

        {/* 4 Kartu Real-time Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800">Total Pemasukan (Iuran)</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-xl font-black text-emerald-950 mt-1 tabular-nums whitespace-nowrap">
              Rp {stats.totalPemasukan.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-emerald-700 mt-0.5">360 Santri @ Rp 30.000</p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-800">Pengeluaran Pokok</span>
              <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <p className="text-xl font-black text-rose-950 mt-1 tabular-nums whitespace-nowrap">
              Rp {stats.totalPengeluaranPokok.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-rose-700 mt-0.5">5 Kategori Pokok Panitia</p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-800">Saldo Pokok (Surplus)</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <p className="text-xl font-black text-amber-950 mt-1 tabular-nums whitespace-nowrap">
              Rp {stats.saldoPokok.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-amber-700 mt-0.5">Pemasukan - Pengeluaran Pokok</p>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-800">
                {includeUsulan ? 'Saldo Akhir (Usulan Masuk)' : 'Saldo Murni'}
              </span>
              <Percent className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <p className="text-xl font-black text-purple-950 mt-1 tabular-nums whitespace-nowrap">
              Rp {stats.saldoAkhir.toLocaleString('id-ID')}
            </p>
            <label className="text-[10px] text-purple-900 font-medium flex items-center gap-1 cursor-pointer mt-0.5">
              <input
                type="checkbox"
                checked={includeUsulan}
                onChange={(e) => setIncludeUsulan(e.target.checked)}
                className="rounded text-purple-700 focus:ring-0 w-3 h-3"
              />
              <span>Sertakan Usulan (+Rp {stats.totalUsulan.toLocaleString('id-ID')})</span>
            </label>
          </div>
        </div>

        {/* Filter Kategori Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 scrollbar-none border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-1 shrink-0">Filter:</span>
          {['Semua', ...kategoriList].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeFilter === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'Semua' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 
        ========================================================================
        DOKUMEN CETAK & SPREADSHEET TABEL RAB
        Kategori | Deskripsi | Volume | Satuan | Harga Satuan | Total | Aksi
        ========================================================================
      */}
      <div className="bg-white border-2 border-slate-800 p-6 sm:p-10 shadow-xl printable-area font-sans text-black max-w-4xl mx-auto space-y-6">
        
        {/* Banner Kop Panitia Resmi */}
        {showOfficialBanner && (
          <div className="w-full pb-2 border-b-2 border-black flex items-center justify-center gap-4">
            <img
              src="/assets/aistudio/ChatGPT_Image_Nov_6__2025__01_32_08_PM_64f70724.png"
              alt="Logo Resmi Panitia Imtihan PP NU Darussalam Karangdadap"
              className="w-16 h-16 object-contain shrink-0"
            />
            <div className="text-center">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-700">
                PANITIA PELAKSANA IMTIHAN MADRASAH DINIYAH SALAFIYAH
              </p>
              <h2 className="text-base sm:text-lg font-black uppercase text-black leading-tight">
                PONDOK PESANTREN NU DARUSSALAM KARANGDADAP
              </h2>
              <p className="text-[11px] font-semibold text-slate-700">
                Jl. Raya Karangdadap KM 1, Kec. Karangdadap, Kab. Pekalongan, Jawa Tengah 51174
              </p>
            </div>
          </div>
        )}

        {/* Judul Rincian Anggaran */}
        <div className="text-center space-y-1">
          <h2 className="text-base sm:text-lg font-black tracking-wide uppercase text-black">
            RANCANGAN ANGGARAN KEGIATAN IMTIHAN 1
          </h2>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase">
            PONDOK PESANTREN NU DARUSSALAM KARANGDADAP · TAHUN AJARAN 2026/2027
          </h3>
          <p className="text-[11px] sm:text-xs italic font-semibold text-slate-700">
            Pelaksanaan: malam 6 s.d. malam 9 Desember 2026
          </p>
        </div>

        {/* Tabel Spreadsheet */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse border-2 border-black">
            <thead>
              <tr className="bg-[#D1E7DD] border-b-2 border-black font-bold text-slate-900">
                <th className="border border-black py-2 px-3 text-left">DESKRIPSI (URAIAN)</th>
                <th className="border border-black py-2 px-2 text-center w-16">VOLUME</th>
                <th className="border border-black py-2 px-2 text-center w-24">SATUAN</th>
                <th className="border border-black py-2 px-3 text-right w-28">HARGA SATUAN</th>
                <th className="border border-black py-2 px-3 text-right w-32">TOTAL (JUMLAH)</th>
                <th className="border border-black py-2 px-2 text-center w-20 no-print">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-400">
              {kategoriList.map((kat) => {
                if (activeFilter !== 'Semua' && activeFilter !== kat) return null;

                const itemsInCat = rabImtihan.filter((r) => r.kategori === kat);
                const subtotalCat = itemsInCat.reduce((sum, r) => sum + r.qty * r.harga, 0);

                return (
                  <React.Fragment key={kat}>
                    {/* Header Baris Kategori */}
                    <tr className="bg-slate-200/90 font-black border-t-2 border-b border-black text-slate-900">
                      <td colSpan={4} className="py-1.5 px-3 border border-black tracking-wide">
                        {kategoriLabels[kat]}
                      </td>
                      <td className="py-1.5 px-3 border border-black text-right tabular-nums whitespace-nowrap">
                        Rp {subtotalCat.toLocaleString('id-ID')}
                      </td>
                      <td className="py-1 px-1 border border-black text-center no-print">
                        <button
                          type="button"
                          onClick={() => handleOpenTambah(kat)}
                          className="px-2 py-0.5 rounded bg-white hover:bg-slate-300 text-[11px] font-bold text-slate-800 transition border border-slate-300"
                          title={`Tambah baris di ${kat}`}
                        >
                          + Tambah
                        </button>
                      </td>
                    </tr>

                    {/* Baris-baris Item */}
                    {itemsInCat.map((item) => (
                      <tr key={item.id} className="hover:bg-amber-50/40 transition group bg-white">
                        {/* Deskripsi (Keterangan) */}
                        <td className="border border-black py-1.5 px-2">
                          <input
                            type="text"
                            value={item.keterangan}
                            onChange={(e) => handleInlineDeskripsiChange(item, e.target.value)}
                            className="w-full bg-transparent border-0 focus:ring-1 focus:ring-emerald-700 focus:bg-white rounded px-1 py-0.5 text-xs text-black font-medium"
                          />
                        </td>

                        {/* Volume (QTY) */}
                        <td className="border border-black py-1.5 px-1 text-center">
                          <input
                            type="number"
                            min="0"
                            value={item.qty}
                            onChange={(e) => handleInlineVolumeChange(item, parseFloat(e.target.value) || 0)}
                            className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-emerald-700 focus:bg-white rounded py-0.5 text-xs tabular-nums font-bold text-black"
                          />
                        </td>

                        {/* Satuan */}
                        <td className="border border-black py-1.5 px-1 text-center">
                          <input
                            type="text"
                            value={item.satuan}
                            onChange={(e) => handleInlineSatuanChange(item, e.target.value)}
                            className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-emerald-700 focus:bg-white rounded py-0.5 text-xs text-slate-700"
                          />
                        </td>

                        {/* Harga Satuan */}
                        <td className="border border-black py-1.5 px-2 text-right">
                          <input
                            type="number"
                            min="0"
                            step="500"
                            value={item.harga}
                            onChange={(e) => handleInlineHargaSatuanChange(item, parseFloat(e.target.value) || 0)}
                            className="w-full text-right bg-transparent border-0 focus:ring-1 focus:ring-emerald-700 focus:bg-white rounded py-0.5 text-xs tabular-nums text-black"
                          />
                        </td>

                        {/* Total Otomatis (Volume * Harga Satuan) */}
                        <td className="border border-black py-1.5 px-3 text-right tabular-nums font-bold text-black whitespace-nowrap bg-slate-50/50">
                          Rp {(item.qty * item.harga).toLocaleString('id-ID')}
                        </td>

                        {/* Aksi Baris: Edit Dialog & Hapus */}
                        <td className="border border-black py-1.5 px-1 text-center no-print">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="p-1 text-slate-500 hover:text-emerald-700 rounded transition"
                              title="Edit item di dialog"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Hapus baris "${item.keterangan}"?`)) {
                                  deleteRabItem(item.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                              title="Hapus baris"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}

              {/* Rekapitulasi Akhir Tabel */}
              <tr className="border-t-2 border-black bg-slate-100 font-bold">
                <td colSpan={4} className="py-2 px-3 border border-black text-right uppercase">
                  TOTAL PEMASUKAN :
                </td>
                <td className="py-2 px-3 border border-black text-right tabular-nums font-black text-emerald-950">
                  Rp {stats.totalPemasukan.toLocaleString('id-ID')}
                </td>
                <td className="border border-black no-print"></td>
              </tr>

              <tr className="bg-slate-100 font-bold">
                <td colSpan={4} className="py-2 px-3 border border-black text-right uppercase">
                  TOTAL PENGELUARAN POKOK :
                </td>
                <td className="py-2 px-3 border border-black text-right tabular-nums font-black text-rose-950">
                  Rp {stats.totalPengeluaranPokok.toLocaleString('id-ID')}
                </td>
                <td className="border border-black no-print"></td>
              </tr>

              <tr className="bg-amber-100/80 font-black border-b border-black">
                <td colSpan={4} className="py-2 px-3 border border-black text-right uppercase text-amber-950">
                  SALDO POKOK UJIAN (SURPLUS) :
                </td>
                <td className="py-2 px-3 border border-black text-right tabular-nums text-sm font-black text-amber-950">
                  Rp {stats.saldoPokok.toLocaleString('id-ID')}
                </td>
                <td className="border border-black no-print"></td>
              </tr>

              <tr className="bg-purple-50 font-bold border-b border-black">
                <td colSpan={4} className="py-2 px-3 border border-black text-right uppercase text-purple-900">
                  TOTAL USULAN TAMBAHAN (OPSIONAL) :
                </td>
                <td className="py-2 px-3 border border-black text-right tabular-nums font-black text-purple-950">
                  Rp {stats.totalUsulan.toLocaleString('id-ID')}
                </td>
                <td className="border border-black no-print"></td>
              </tr>

              <tr className="bg-[#C8E6C9] font-black border-2 border-black">
                <td colSpan={4} className="py-2.5 px-3 border border-black text-right uppercase text-emerald-950">
                  SALDO AKHIR BILA USULAN DISETUJUI :
                </td>
                <td className="py-2.5 px-3 border border-black text-right tabular-nums text-sm font-black text-emerald-950">
                  Rp {(stats.saldoPokok - stats.totalUsulan).toLocaleString('id-ID')}
                </td>
                <td className="border border-black no-print"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Kolom Tanda Tangan Resmi Dokumen */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs font-serif text-black">
          <div className="space-y-16">
            <p className="font-semibold">
              Mengetahui,<br />
              <span className="font-bold">Ketua Pelaksana Imtihan</span>
            </p>
            <div>
              <p className="font-bold underline text-sm">Ust. Nidhomul Muna Lana</p>
              <p className="text-[11px] text-slate-600 font-sans">NIP. 2018.04.012</p>
            </div>
          </div>

          <div className="space-y-16 hidden sm:block">
            <p className="font-semibold">
              Menyetujui,<br />
              <span className="font-bold">Pengasuh PP NU Darussalam</span>
            </p>
            <div>
              <p className="font-bold underline text-sm">KH. Amin Maizun</p>
              <p className="text-[11px] text-slate-600 font-sans">Pengasuh Pondok</p>
            </div>
          </div>

          <div className="space-y-16">
            <p className="font-semibold">
              Karangdadap, 01 Desember 2026<br />
              <span className="font-bold">Bendahara Imtihan</span>
            </p>
            <div>
              <p className="font-bold underline text-sm">M. Abdul Fataah</p>
              <p className="text-[11px] text-slate-600 font-sans">NIP. 2020.08.045</p>
            </div>
          </div>
        </div>

        {/* Footer Cetak */}
        <div className="pt-6 border-t border-slate-300 text-center text-[10px] text-slate-500 font-sans">
          Dokumen Keuangan Resmi Kepanitiaan Imtihan 1 · Pondok Pesantren NU Darussalam Karangdadap Pekalongan
        </div>
      </div>

      {/* 
        ========================================================================
        MODAL DIALOG INPUT / EDIT ITEM ANGGARAN (Kategori, Deskripsi, Volume, Satuan, Harga Satuan, Total)
        ========================================================================
      */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                {modalMode === 'edit' ? (
                  <>
                    <Edit2 className="w-4 h-4 text-emerald-700" />
                    <span>Edit Item Anggaran RAB</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-emerald-700" />
                    <span>Input Item Anggaran Baru</span>
                  </>
                )}
              </h4>
              <button
                type="button"
                onClick={() => setShowItemModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 pt-4 text-xs">
              {/* 1. Kategori */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Anggaran</label>
                <select
                  value={formKategori}
                  onChange={(e) => setFormKategori(e.target.value as RabItem['kategori'])}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                >
                  {kategoriList.map((kat) => (
                    <option key={kat} value={kat}>
                      {kategoriLabels[kat]}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Deskripsi (Uraian) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi / Uraian</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Penggadaan kertas HVS F4 70gr"
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* 3. Volume & 4. Satuan */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Volume (QTY)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formVolume}
                    onChange={(e) => setFormVolume(parseFloat(e.target.value) || 1)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs tabular-nums focus:outline-hidden focus:ring-2 focus:ring-emerald-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Satuan</label>
                  <input
                    type="text"
                    required
                    placeholder="Rim, Lembar, Paket..."
                    value={formSatuan}
                    onChange={(e) => setFormSatuan(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* 5. Harga Satuan */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Harga Satuan (Rp)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  required
                  value={formHargaSatuan}
                  onChange={(e) => setFormHargaSatuan(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs tabular-nums focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* 6. Total (Kalkulasi Otomatis Volume * Harga Satuan) */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-700 block">Total Kalkulasi Otomatis:</span>
                  <span className="text-[11px] text-slate-500">
                    {formVolume} {formSatuan} × Rp {formHargaSatuan.toLocaleString('id-ID')}
                  </span>
                </div>
                <span className="font-black text-sm text-emerald-900 tabular-nums">
                  Rp {formTotalOtomatis.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Tombol Simpan / Batal */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Item Anggaran</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
