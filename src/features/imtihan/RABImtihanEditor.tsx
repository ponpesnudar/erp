import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Edit2,
  Save,
  Check,
  TrendingUp,
  Percent,
  FileSpreadsheet,
} from 'lucide-react';
import { useAppStore } from '../../lib/store.ts';
import { RabItem } from '../../data/seed/pondokData.ts';

export const RABImtihanEditor: React.FC = () => {
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

  // Kategori display names
  const kategoriLabels: Record<RabItem['kategori'], string> = {
    Pemasukan: 'PEMASUKAN KEGIATAN',
    Penggadaan: '1. PENGGADAAN SOAL & NASKAH',
    Insentif: '2. INSENTIF & HONORARIUM',
    Tunjangan: '3. TUNJANGAN POKOK PANITIA',
    Perlengkapan: '4. PERLENGKAPAN & ATK',
    Konsumsi: '5. KONSUMSI & LOGISTIK',
    UsulanTambahan: 'USULAN TAMBAHAN (OPSIONAL)',
  };

  // State untuk form tambah baris baru
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [addCategoryTarget, setAddCategoryTarget] = useState<RabItem['kategori']>('Perlengkapan');
  const [formKeterangan, setFormKeterangan] = useState('');
  const [formQty, setFormQty] = useState<number>(1);
  const [formSatuan, setFormSatuan] = useState('Pcs');
  const [formHarga, setFormHarga] = useState<number>(10000);

  // State toggle usulan tambahan
  const [includeUsulan, setIncludeUsulan] = useState<boolean>(true);

  // Filter kategori aktif pada mode spreadsheet
  const [activeFilter, setActiveFilter] = useState<string>('Semua');

  // Kalkulasi Real-time
  const stats = useMemo(() => {
    const totalPemasukan = rabImtihan
      .filter((r) => r.kategori === 'Pemasukan')
      .reduce((sum, r) => sum + (r.qty * r.harga), 0);

    const pengeluaranPerKategori: Record<string, number> = {};
    kategoriList.forEach((cat) => {
      if (cat !== 'Pemasukan') {
        pengeluaranPerKategori[cat] = rabImtihan
          .filter((r) => r.kategori === cat)
          .reduce((sum, r) => sum + (r.qty * r.harga), 0);
      }
    });

    const totalPengeluaranPokok = rabImtihan
      .filter((r) => r.kategori !== 'Pemasukan' && r.kategori !== 'UsulanTambahan')
      .reduce((sum, r) => sum + (r.qty * r.harga), 0);

    const totalUsulan = rabImtihan
      .filter((r) => r.kategori === 'UsulanTambahan')
      .reduce((sum, r) => sum + (r.qty * r.harga), 0);

    const saldoPokok = totalPemasukan - totalPengeluaranPokok;
    const saldoAkhir = totalPemasukan - (totalPengeluaranPokok + (includeUsulan ? totalUsulan : 0));
    const persenSerapan = totalPemasukan > 0 ? ((totalPengeluaranPokok + (includeUsulan ? totalUsulan : 0)) / totalPemasukan) * 100 : 0;

    return {
      totalPemasukan,
      pengeluaranPerKategori,
      totalPengeluaranPokok,
      totalUsulan,
      saldoPokok,
      saldoAkhir,
      persenSerapan,
    };
  }, [rabImtihan, includeUsulan]);

  // Handle inline change QTY
  const handleQtyChange = (item: RabItem, newQty: number) => {
    const qtyVal = isNaN(newQty) ? 0 : Math.max(0, newQty);
    updateRabItem({
      ...item,
      qty: qtyVal,
      jumlah: qtyVal * item.harga,
    });
  };

  // Handle inline change Satuan
  const handleSatuanChange = (item: RabItem, newSatuan: string) => {
    updateRabItem({
      ...item,
      satuan: newSatuan,
    });
  };

  // Handle inline change Harga Satuan
  const handleHargaChange = (item: RabItem, newHarga: number) => {
    const hargaVal = isNaN(newHarga) ? 0 : Math.max(0, newHarga);
    updateRabItem({
      ...item,
      harga: hargaVal,
      jumlah: item.qty * hargaVal,
    });
  };

  // Handle inline change Keterangan
  const handleKeteranganChange = (item: RabItem, newKeterangan: string) => {
    updateRabItem({
      ...item,
      keterangan: newKeterangan,
    });
  };

  // Quick add item to category
  const openAddForCategory = (kategori: RabItem['kategori']) => {
    setAddCategoryTarget(kategori);
    setFormKeterangan('');
    setFormQty(1);
    setFormSatuan(kategori === 'Insentif' || kategori === 'Tunjangan' ? 'Orang' : 'Paket');
    setFormHarga(50000);
    setShowAddModal(true);
  };

  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formKeterangan.trim()) return;

    addRabItem({
      kategori: addCategoryTarget,
      keterangan: formKeterangan.trim(),
      qty: Math.max(1, formQty),
      satuan: formSatuan.trim() || 'Pcs',
      harga: Math.max(0, formHarga),
      jumlah: Math.max(1, formQty) * Math.max(0, formHarga),
    });

    setShowAddModal(false);
    setFormKeterangan('');
  };

  return (
    <div className="space-y-6">
      {/* 
        ========================================================================
        PANEL ATAS: CONTROLS & REALTIME KPI CARDS (DILENGKAPI INLINE EDITING)
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
                RAB Imtihan Otomatis & Terintegrasi
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                Auto-Calc Realtime
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Edit langsung nilai QTY atau Harga pada tabel. Jumlah baris, akumulasi kategori, dan saldo terhitung otomatis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => openAddForCategory('Perlengkapan')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Item</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Kembalikan seluruh item RAB ke standar lampiran resmi kepanitiaan?')) {
                  resetRabImtihan();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold transition flex items-center gap-1"
              title="Reset ke nilai default lampiran fisik"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition shadow-xs flex items-center gap-2"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Dokumen RAB</span>
            </button>
          </div>
        </div>

        {/* Real-time Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Card 1: Pemasukan */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800">Total Pemasukan Iuran</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-xl font-black text-emerald-950 mt-1 tabular-nums whitespace-nowrap">
              Rp {stats.totalPemasukan.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-emerald-700 mt-0.5">
              360 Santri @ Rp 30.000 (Lampiran Fisik)
            </p>
          </div>

          {/* Card 2: Pengeluaran Pokok */}
          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-800">Total Pengeluaran Pokok</span>
              <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <p className="text-xl font-black text-rose-950 mt-1 tabular-nums whitespace-nowrap">
              Rp {stats.totalPengeluaranPokok.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-rose-700 mt-0.5">
              5 Kategori Pokok (Soal s/d Konsumsi)
            </p>
          </div>

          {/* Card 3: Saldo Pokok */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-800">Saldo Pokok (Surplus)</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <p className="text-xl font-black text-amber-950 mt-1 tabular-nums whitespace-nowrap">
              Rp {stats.saldoPokok.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-amber-700 mt-0.5">
              Pemasukan dikurangi pengeluaran pokok
            </p>
          </div>

          {/* Card 4: Saldo Usulan Tambahan */}
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
            <div className="flex items-center gap-2 mt-0.5">
              <label className="text-[10px] text-purple-900 font-medium flex items-center gap-1 cursor-pointer">
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
        </div>

        {/* Filter Kategori Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 scrollbar-none border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-1 shrink-0">Tampilan:</span>
          {['Semua', ...kategoriList].map((cat) => (
            <button
              key={cat}
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
        DOKUMEN CETAK & SPREADSHEET UTAMA (PERSIS LAMPIRAN preview_16637b06.webp & preview__1__8f90a0c2.webp)
        DILENGKAPI KOP PANITIA RESMI (kop_ku_4eb1d27e.png)
        ========================================================================
      */}
      <div className="bg-white border-2 border-slate-800 p-6 sm:p-10 shadow-xl printable-area font-sans text-black max-w-4xl mx-auto space-y-6">
        
        {/* Banner Kop Surat Resmi Panitia Imtihan */}
        <div className="text-center pb-2 border-b-2 border-black flex items-center justify-center gap-4">
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

        {/* Header Judul Rincian Anggaran */}
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

        {/* Tabel Spreadsheet Rinci dengan Fitur Editable Inline */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse border-2 border-black">
            <thead>
              <tr className="bg-[#D1E7DD] border-b-2 border-black font-bold text-slate-900">
                <th className="border border-black py-2 px-3 text-left">KETERANGAN</th>
                <th className="border border-black py-2 px-2 text-center w-16">QTY</th>
                <th className="border border-black py-2 px-2 text-center w-24">SATUAN</th>
                <th className="border border-black py-2 px-3 text-right w-28">HARGA (Rp)</th>
                <th className="border border-black py-2 px-3 text-right w-32">JUMLAH (Rp)</th>
                <th className="border border-black py-2 px-2 text-center w-16 no-print">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-400">
              
              {/* ITERASI SETIAP KATEGORI */}
              {kategoriList.map((kat) => {
                // Saring jika filter aktif
                if (activeFilter !== 'Semua' && activeFilter !== kat) return null;

                const itemsInCat = rabImtihan.filter((r) => r.kategori === kat);
                const subtotalCat = itemsInCat.reduce((sum, r) => sum + (r.qty * r.harga), 0);

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
                          onClick={() => openAddForCategory(kat)}
                          className="p-1 rounded hover:bg-slate-300 text-slate-700 transition"
                          title={`Tambah baris di ${kat}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>

                    {/* Baris-baris Item */}
                    {itemsInCat.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-amber-50/40 transition group bg-white"
                      >
                        {/* Keterangan (Editable inline) */}
                        <td className="border border-black py-1.5 px-2">
                          <input
                            type="text"
                            value={item.keterangan}
                            onChange={(e) => handleKeteranganChange(item, e.target.value)}
                            className="w-full bg-transparent border-0 focus:ring-1 focus:ring-emerald-700 focus:bg-white rounded px-1 py-0.5 text-xs text-black font-medium"
                          />
                        </td>

                        {/* QTY (Editable inline) */}
                        <td className="border border-black py-1.5 px-1 text-center">
                          <input
                            type="number"
                            min="0"
                            value={item.qty}
                            onChange={(e) => handleQtyChange(item, parseFloat(e.target.value) || 0)}
                            className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-emerald-700 focus:bg-white rounded py-0.5 text-xs tabular-nums font-bold text-black"
                          />
                        </td>

                        {/* Satuan (Editable inline) */}
                        <td className="border border-black py-1.5 px-1 text-center">
                          <input
                            type="text"
                            value={item.satuan}
                            onChange={(e) => handleSatuanChange(item, e.target.value)}
                            className="w-full text-center bg-transparent border-0 focus:ring-1 focus:ring-emerald-700 focus:bg-white rounded py-0.5 text-xs text-slate-700"
                          />
                        </td>

                        {/* Harga Satuan (Editable inline) */}
                        <td className="border border-black py-1.5 px-2 text-right">
                          <input
                            type="number"
                            min="0"
                            step="500"
                            value={item.harga}
                            onChange={(e) => handleHargaChange(item, parseFloat(e.target.value) || 0)}
                            className="w-full text-right bg-transparent border-0 focus:ring-1 focus:ring-emerald-700 focus:bg-white rounded py-0.5 text-xs tabular-nums text-black"
                          />
                        </td>

                        {/* Jumlah Kalkulasi Otomatis (Qty * Harga) */}
                        <td className="border border-black py-1.5 px-3 text-right tabular-nums font-bold text-black whitespace-nowrap bg-slate-50/50">
                          Rp {(item.qty * item.harga).toLocaleString('id-ID')}
                        </td>

                        {/* Aksi Baris (Hapus) */}
                        <td className="border border-black py-1.5 px-1 text-center no-print">
                          <button
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
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}

              {/* 
                ================================================================
                REKAPITULASI AKHIR TABEL (PERSIS DI BAWAH TABEL LAMPIRAN ASLI)
                ================================================================
              */}
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
                  TOTAL PENGELUARAN POKOK (1 S/D 5) :
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

              {/* Baris Usulan Tambahan Bila Disetujui */}
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

        {/* 
          ========================================================================
          KOLOM TANDA TANGAN RESMI KEPANITIAAN IMTIHAN (SESUAI DOKUMEN ASLI)
          ========================================================================
        */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs font-serif text-black">
          {/* Kolom 1: Mengetahui Ketua Pelaksana */}
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

          {/* Kolom 2: Pengasuh Pondok */}
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

          {/* Kolom 3: Bendahara Pelaksana */}
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
          Dokumen Keuangan Resmi Kepanitiaan Imtihan 1 · Pondok Pesantren NU Darussalam Karangdadap Pekalongan · Dicetak otomatis dari ERP Darussalam
        </div>
      </div>

      {/* 
        ========================================================================
        MODAL TAMBAH ITEM ANGGARAN BARU
        ========================================================================
      */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-700" />
                <span>Tambah Item Anggaran RAB</span>
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveNewItem} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Anggaran</label>
                <select
                  value={addCategoryTarget}
                  onChange={(e) => setAddCategoryTarget(e.target.value as RabItem['kategori'])}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                >
                  {kategoriList.map((kat) => (
                    <option key={kat} value={kat}>
                      {kategoriLabels[kat]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan / Uraian</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kertas Folio F4 80gr"
                  value={formKeterangan}
                  onChange={(e) => setFormKeterangan(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kuantitas (QTY)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formQty}
                    onChange={(e) => setFormQty(parseFloat(e.target.value) || 1)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs tabular-nums focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Satuan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rim, Pack, Orang"
                    value={formSatuan}
                    onChange={(e) => setFormSatuan(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Harga Satuan (Rp)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  required
                  value={formHarga}
                  onChange={(e) => setFormHarga(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs tabular-nums focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Subtotal Preview */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-600">Perhitungan Jumlah:</span>
                <span className="font-bold text-sm text-emerald-900 tabular-nums">
                  Rp {(formQty * formHarga).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition shadow-xs"
                >
                  Simpan Baris
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
