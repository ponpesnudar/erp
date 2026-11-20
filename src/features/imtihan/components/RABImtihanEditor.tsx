import React, { useState, useMemo, useRef } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  Printer,
  RotateCcw,
  CheckCircle2,
  Edit2,
  Save,
  TrendingUp,
  Percent,
  FileSpreadsheet,
  Users,
  RefreshCw,
  X,
} from 'lucide-react';
import { useAppStore } from '../../../lib/store.ts';
import { triggerReliablePrint } from '../../../lib/printHelper.ts';
import { RabItem } from '../../../data/seed/pondokData.ts';
import { PrintOrientationControl } from '../../../components/common/PrintOrientationControl.tsx';

export interface BisyarohGuruRow {
  id: string;
  kelompok: 'PUTRA' | 'PUTRI';
  no: number;
  nama: string;
  jtm: number;
  walkel: string;
  paketSoal: number;
  jamJaga: number;
  malamPiket: number;
  lembarKoreksi: number;
  santriRapor: number;
}

const DEFAULT_BISYAROH_RATES = {
  tarifSoal: 10000,
  tarifJaga: 10000,
  tarifPiket: 20000,
  tarifKoreksi: 1000,
  tarifRapor: 1000,
};

const SEED_BISYAROH_GURU: BisyarohGuruRow[] = [
  // PUTRA (18 Ustadz - sesuai Image 17)
  { id: 'bg-pa-1', kelompok: 'PUTRA', no: 1, nama: 'KH. Amin Mizun Al-Haj', jtm: 4, walkel: '', paketSoal: 2.0, jamJaga: 0, malamPiket: 0, lembarKoreksi: 30, santriRapor: 0 },
  { id: 'bg-pa-2', kelompok: 'PUTRA', no: 2, nama: 'KH. Mustadrin', jtm: 2, walkel: '', paketSoal: 1.0, jamJaga: 1, malamPiket: 0, lembarKoreksi: 14, santriRapor: 0 },
  { id: 'bg-pa-3', kelompok: 'PUTRA', no: 3, nama: 'KH. Abdul Haq', jtm: 4, walkel: '', paketSoal: 2.0, jamJaga: 0, malamPiket: 0, lembarKoreksi: 30, santriRapor: 0 },
  { id: 'bg-pa-4', kelompok: 'PUTRA', no: 4, nama: 'Ust. Abdurrohman', jtm: 10, walkel: '', paketSoal: 3.5, jamJaga: 3, malamPiket: 1, lembarKoreksi: 64, santriRapor: 0 },
  { id: 'bg-pa-5', kelompok: 'PUTRA', no: 5, nama: 'Ust. Abdul Fatah', jtm: 10, walkel: '', paketSoal: 3.0, jamJaga: 4, malamPiket: 0, lembarKoreksi: 94, santriRapor: 0 },
  { id: 'bg-pa-6', kelompok: 'PUTRA', no: 6, nama: 'Ust. M. Khoirul Umam', jtm: 10, walkel: '', paketSoal: 3.0, jamJaga: 4, malamPiket: 0, lembarKoreksi: 122, santriRapor: 0 },
  { id: 'bg-pa-7', kelompok: 'PUTRA', no: 7, nama: 'Ust. M. Ali Ridlo', jtm: 10, walkel: '', paketSoal: 4.0, jamJaga: 4, malamPiket: 0, lembarKoreksi: 80, santriRapor: 0 },
  { id: 'bg-pa-8', kelompok: 'PUTRA', no: 8, nama: 'Ust. Ahmadi', jtm: 13, walkel: '', paketSoal: 4.0, jamJaga: 3, malamPiket: 1, lembarKoreksi: 100, santriRapor: 0 },
  { id: 'bg-pa-9', kelompok: 'PUTRA', no: 9, nama: "Ust. Ahmad Rifa'i", jtm: 12, walkel: '', paketSoal: 4.0, jamJaga: 3, malamPiket: 0, lembarKoreksi: 122, santriRapor: 0 },
  { id: 'bg-pa-10', kelompok: 'PUTRA', no: 10, nama: 'Ust. Nurdiansyah', jtm: 10, walkel: '', paketSoal: 4.0, jamJaga: 4, malamPiket: 0, lembarKoreksi: 66, santriRapor: 0 },
  { id: 'bg-pa-11', kelompok: 'PUTRA', no: 11, nama: 'Ust. H. Zaenal Arifin', jtm: 8, walkel: '', paketSoal: 3.0, jamJaga: 3, malamPiket: 0, lembarKoreksi: 48, santriRapor: 0 },
  { id: 'bg-pa-12', kelompok: 'PUTRA', no: 12, nama: 'Ust. Nidhomul Muna L.', jtm: 8, walkel: '', paketSoal: 2.0, jamJaga: 0, malamPiket: 4, lembarKoreksi: 80, santriRapor: 0 },
  { id: 'bg-pa-13', kelompok: 'PUTRA', no: 13, nama: 'Ust. M. Nur Arif Hakam', jtm: 9, walkel: '', paketSoal: 3.0, jamJaga: 3, malamPiket: 1, lembarKoreksi: 78, santriRapor: 0 },
  { id: 'bg-pa-14', kelompok: 'PUTRA', no: 14, nama: 'Ust. Kharis Maulana', jtm: 10, walkel: '', paketSoal: 2.0, jamJaga: 3, malamPiket: 0, lembarKoreksi: 80, santriRapor: 0 },
  { id: 'bg-pa-15', kelompok: 'PUTRA', no: 15, nama: 'Ust. Bahrul Ulum', jtm: 11, walkel: '', paketSoal: 2.0, jamJaga: 0, malamPiket: 4, lembarKoreksi: 54, santriRapor: 0 },
  { id: 'bg-pa-16', kelompok: 'PUTRA', no: 16, nama: 'Ust. Abdurrokhim', jtm: 10, walkel: '', paketSoal: 3.0, jamJaga: 4, malamPiket: 0, lembarKoreksi: 86, santriRapor: 0 },
  { id: 'bg-pa-17', kelompok: 'PUTRA', no: 17, nama: 'Ust. Izzul Huda', jtm: 12, walkel: '', paketSoal: 2.0, jamJaga: 3, malamPiket: 0, lembarKoreksi: 76, santriRapor: 0 },
  { id: 'bg-pa-18', kelompok: 'PUTRA', no: 18, nama: 'Ust. Zainuddin', jtm: 10, walkel: '', paketSoal: 2.5, jamJaga: 3, malamPiket: 1, lembarKoreksi: 66, santriRapor: 0 },
  // PUTRI (17 Ustadzah - sesuai Image 17)
  { id: 'bg-pi-1', kelompok: 'PUTRI', no: 1, nama: 'Nyai Hj. Yuli Fitriana', jtm: 5, walkel: '', paketSoal: 2.0, jamJaga: 1, malamPiket: 0, lembarKoreksi: 58, santriRapor: 0 },
  { id: 'bg-pi-2', kelompok: 'PUTRI', no: 2, nama: 'Ustzh. Daffa Aulia Solestya', jtm: 8, walkel: '1B', paketSoal: 2.0, jamJaga: 4, malamPiket: 0, lembarKoreksi: 81, santriRapor: 26 },
  { id: 'bg-pi-3', kelompok: 'PUTRI', no: 3, nama: 'Ustzh. Hj. Nok Arofah', jtm: 6, walkel: '', paketSoal: 3.0, jamJaga: 5, malamPiket: 0, lembarKoreksi: 89, santriRapor: 0 },
  { id: 'bg-pi-4', kelompok: 'PUTRI', no: 4, nama: 'Nyai Hj. Sri Khamah', jtm: 6, walkel: '', paketSoal: 2.0, jamJaga: 0, malamPiket: 0, lembarKoreksi: 104, santriRapor: 0 },
  { id: 'bg-pi-5', kelompok: 'PUTRI', no: 5, nama: 'Ustzh. Nella Aprilia', jtm: 11, walkel: '2A', paketSoal: 1.5, jamJaga: 1, malamPiket: 3, lembarKoreksi: 81, santriRapor: 26 },
  { id: 'bg-pi-6', kelompok: 'PUTRI', no: 6, nama: 'Ustzh. Titik Diana Sari', jtm: 5, walkel: '', paketSoal: 2.0, jamJaga: 5, malamPiket: 0, lembarKoreksi: 58, santriRapor: 0 },
  { id: 'bg-pi-7', kelompok: 'PUTRI', no: 7, nama: 'Ustzh. Nurlailatul Fitriani', jtm: 9, walkel: '3', paketSoal: 2.0, jamJaga: 4, malamPiket: 0, lembarKoreksi: 82, santriRapor: 30 },
  { id: 'bg-pi-8', kelompok: 'PUTRI', no: 8, nama: 'Ustzh. Nurul Hikmah', jtm: 8, walkel: '4', paketSoal: 2.0, jamJaga: 4, malamPiket: 0, lembarKoreksi: 105, santriRapor: 29 },
  { id: 'bg-pi-9', kelompok: 'PUTRI', no: 9, nama: 'Ustzh. Rohmatul Ummah', jtm: 8, walkel: '', paketSoal: 2.0, jamJaga: 4, malamPiket: 0, lembarKoreksi: 106, santriRapor: 0 },
  { id: 'bg-pi-10', kelompok: 'PUTRI', no: 10, nama: 'Ustzh. Arinil Haq', jtm: 8, walkel: '', paketSoal: 0.5, jamJaga: 5, malamPiket: 0, lembarKoreksi: 51, santriRapor: 0 },
  { id: 'bg-pi-11', kelompok: 'PUTRI', no: 11, nama: 'Ustzh. Fachirotu Mina', jtm: 8, walkel: '', paketSoal: 2.0, jamJaga: 4, malamPiket: 0, lembarKoreksi: 106, santriRapor: 0 },
  { id: 'bg-pi-12', kelompok: 'PUTRI', no: 12, nama: 'Ustzh. Zaimatul Arqois', jtm: 8, walkel: '1A', paketSoal: 1.5, jamJaga: 4, malamPiket: 0, lembarKoreksi: 77, santriRapor: 26 },
  { id: 'bg-pi-13', kelompok: 'PUTRI', no: 13, nama: 'Ustzh. Aghitsna Ayyu Shofiyya', jtm: 10, walkel: '2C', paketSoal: 1.5, jamJaga: 0, malamPiket: 4, lembarKoreksi: 77, santriRapor: 25 },
  { id: 'bg-pi-14', kelompok: 'PUTRI', no: 14, nama: 'Ustzh. Amilatul Amalia', jtm: 6, walkel: '', paketSoal: 2.5, jamJaga: 4, malamPiket: 0, lembarKoreksi: 85, santriRapor: 0 },
  { id: 'bg-pi-15', kelompok: 'PUTRI', no: 15, nama: 'Ustzh. Emi Sulistyowati', jtm: 6, walkel: '', paketSoal: 1.0, jamJaga: 5, malamPiket: 0, lembarKoreksi: 76, santriRapor: 0 },
  { id: 'bg-pi-16', kelompok: 'PUTRI', no: 16, nama: 'Ustzh. Aski Indana Zulfa', jtm: 4, walkel: '', paketSoal: 1.0, jamJaga: 5, malamPiket: 1, lembarKoreksi: 52, santriRapor: 0 },
  { id: 'bg-pi-17', kelompok: 'PUTRI', no: 17, nama: 'Ustzh. Rahma Dina', jtm: 8, walkel: '2B', paketSoal: 1.5, jamJaga: 4, malamPiket: 0, lembarKoreksi: 102, santriRapor: 25 },
];

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
 * Memungkinkan input & manajemen item anggaran serta Rekap Bisyaroh Guru Imtihan:
 * - Tab 1: Lembar RAB Anggaran (Kategori, Deskripsi, Volume, Satuan, Harga Satuan, Total)
 * - Tab 2: Rekap Bisyaroh Guru Imtihan (Putra & Putri, Tarif Parameter, Sinkron ke RAB)
 */
export const RABImtihanEditor: React.FC<RABImtihanEditorProps> = ({
  showOfficialBanner = true,
}) => {
  const {
    rabImtihan,
    updateRabItem,
    addRabItem,
    deleteRabItem,
    resetRabImtihan,
    imtihanMaster,
    printOrientation,
  } = useAppStore();
  const rabPrintRef = useRef<HTMLDivElement | null>(null);
  const bisyarohPrintRef = useRef<HTMLDivElement | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [activeSheet, setActiveSheet] = useState<'rab' | 'bisyaroh'>('rab');
  const [bisyarohRates, setBisyarohRates] = useState(DEFAULT_BISYAROH_RATES);
  const [bisyarohRows, setBisyarohRows] = useState<BisyarohGuruRow[]>(SEED_BISYAROH_GURU);
  const [bisyarohToast, setBisyarohToast] = useState('');

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

  // Kalkulasi Real-time RAB
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

  // Kalkulasi Real-time Bisyaroh Guru (Putra, Putri, Grand Total)
  const bisyarohSummary = useMemo(() => {
    const summarize = (list: BisyarohGuruRow[]) => {
      const soalQty = list.reduce((s, r) => s + r.paketSoal, 0);
      const jagaQty = list.reduce((s, r) => s + r.jamJaga, 0);
      const piketQty = list.reduce((s, r) => s + r.malamPiket, 0);
      const koreksiQty = list.reduce((s, r) => s + r.lembarKoreksi, 0);
      const raporQty = list.reduce((s, r) => s + r.santriRapor, 0);
      const soalRp = soalQty * bisyarohRates.tarifSoal;
      const jagaRp = jagaQty * bisyarohRates.tarifJaga;
      const piketRp = piketQty * bisyarohRates.tarifPiket;
      const koreksiRp = koreksiQty * bisyarohRates.tarifKoreksi;
      const raporRp = raporQty * bisyarohRates.tarifRapor;
      return {
        soalQty,
        jagaQty,
        piketQty,
        koreksiQty,
        raporQty,
        soalRp,
        jagaRp,
        piketRp,
        koreksiRp,
        raporRp,
        totalRp: soalRp + jagaRp + piketRp + koreksiRp + raporRp,
      };
    };

    const putraList = bisyarohRows.filter((r) => r.kelompok === 'PUTRA');
    const putriList = bisyarohRows.filter((r) => r.kelompok === 'PUTRI');
    const subPutra = summarize(putraList);
    const subPutri = summarize(putriList);
    const grand = summarize(bisyarohRows);

    return { putraList, putriList, subPutra, subPutri, grand };
  }, [bisyarohRows, bisyarohRates]);

  const handleUpdateBisyarohField = (
    id: string,
    field: keyof Omit<BisyarohGuruRow, 'id' | 'kelompok' | 'no'>,
    val: string | number
  ) => {
    setBisyarohRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: val } : row))
    );
  };

  const handleAddBisyarohRow = (kelompok: 'PUTRA' | 'PUTRI') => {
    const count = bisyarohRows.filter((r) => r.kelompok === kelompok).length;
    setBisyarohRows((prev) => [
      ...prev,
      {
        id: `bg-${Date.now()}`,
        kelompok,
        no: count + 1,
        nama: kelompok === 'PUTRA' ? 'Ust. Guru Baru' : 'Ustzh. Guru Baru',
        jtm: 8,
        walkel: '',
        paketSoal: 1,
        jamJaga: 2,
        malamPiket: 0,
        lembarKoreksi: 40,
        santriRapor: 0,
      },
    ]);
  };

  const handleSyncBisyarohToRab = () => {
    const { grand } = bisyarohSummary;
    const syncPairs: Array<{ id: string; keterangan: string; qty: number; harga: number }> = [
      {
        id: 'rab-out-2',
        keterangan: 'Honor Penulisan Soal Imtihan (Rekap Bisyaroh)',
        qty: grand.soalQty,
        harga: bisyarohRates.tarifSoal,
      },
      {
        id: 'rab-out-3',
        keterangan: 'Honor Pengawasan Ruang / Jaga (Rekap Bisyaroh)',
        qty: grand.jagaQty,
        harga: bisyarohRates.tarifJaga,
      },
      {
        id: 'rab-out-4',
        keterangan: 'Honor Piket Malam Imtihan (Rekap Bisyaroh)',
        qty: grand.piketQty,
        harga: bisyarohRates.tarifPiket,
      },
      {
        id: 'rab-out-5',
        keterangan: 'Honor Koreksi Lembar Jawab (Rekap Bisyaroh)',
        qty: grand.koreksiQty,
        harga: bisyarohRates.tarifKoreksi,
      },
      {
        id: 'rab-out-6',
        keterangan: 'Honor Penulisan Raport Wali Kelas (Rekap Bisyaroh)',
        qty: grand.raporQty,
        harga: bisyarohRates.tarifRapor,
      },
    ];

    syncPairs.forEach((sp) => {
      const existing = rabImtihan.find((r) => r.id === sp.id);
      if (existing) {
        updateRabItem({
          ...existing,
          qty: sp.qty,
          harga: sp.harga,
          jumlah: sp.qty * sp.harga,
        });
      }
    });
    setBisyarohToast(
      `Total Bisyaroh Rp ${grand.totalRp.toLocaleString('id-ID')} (Soal, Jaga, Piket, Koreksi, Rapor) berhasil disinkronkan ke Pos Insentif RAB!`
    );
    setTimeout(() => setBisyarohToast(''), 4000);
  };

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

  const formatRpOrDash = (val: number) => (val > 0 ? val.toLocaleString('id-ID') : '-');

  return (
    <div className="space-y-6">
      {bisyarohToast && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{bisyarohToast}</span>
        </div>
      )}

      {/* Sheet Switcher Bar */}
      <div className="rounded-2xl bg-white p-3.5 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveSheet('rab')}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition ${
              activeSheet === 'rab'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Lembar RAB Anggaran</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSheet('bisyaroh')}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition ${
              activeSheet === 'bisyaroh'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Rekap Bisyaroh Guru Imtihan ({bisyarohRows.length} Guru)</span>
          </button>
        </div>

        <div className="text-xs font-bold text-slate-600 tabular-nums">
          Total Bisyaroh Terhitung:{' '}
          <span className="text-emerald-900 font-black">
            Rp {bisyarohSummary.grand.totalRp.toLocaleString('id-ID')}
          </span>{' '}
          (Putra Rp {bisyarohSummary.subPutra.totalRp.toLocaleString('id-ID')} · Putri Rp{' '}
          {bisyarohSummary.subPutri.totalRp.toLocaleString('id-ID')})
        </div>
      </div>

      {activeSheet === 'rab' ? (
        <>
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
                    Rancangan Anggaran Biaya (RAB) Imtihan {imtihanMaster.cawu}
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
                <PrintOrientationControl recommended="portrait" compact />
                <button
                  type="button"
                  onClick={() => handleOpenTambah()}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Input Item Anggaran</span>
                </button>

            {confirmReset ? (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-xl text-xs">
                <span className="font-bold text-amber-900">Reset standar?</span>
                <button
                  type="button"
                  onClick={() => {
                    resetRabImtihan();
                    setConfirmReset(false);
                  }}
                  className="px-2 py-0.5 rounded bg-amber-700 text-white font-bold"
                >
                  Ya
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-0.5 rounded bg-white text-slate-700 font-bold border border-slate-200"
                >
                  Batal
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold transition flex items-center gap-1"
                title="Kembalikan ke nilai bawaan fisik"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Standar</span>
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                triggerReliablePrint({
                  title: 'Rancangan Anggaran Biaya (RAB) Imtihan 1',
                  orientation: printOrientation,
                  paperSize: 'F4',
                  targetElement: rabPrintRef.current,
                })
              }
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
      <div
        ref={rabPrintRef}
        className="bg-white border-2 border-slate-800 p-6 sm:p-10 shadow-xl printable-area font-sans text-black max-w-4xl mx-auto space-y-6"
      >
        
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
                              onClick={() => deleteRabItem(item.id)}
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
        </>
      ) : (
        /* ========================================================================
           TAB 2: REKAP BISYAROH GURU IMTIHAN (PUTRA & PUTRI — SESUAI IMAGE 17)
           ======================================================================== */
        <div className="space-y-5">
          {/* Parameter Tarif & Tombol Aksi */}
          <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-4 no-print">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>
                    Rekap Bisyaroh Guru · Imtihan {imtihanMaster.cawu} · T.A.{' '}
                    {imtihanMaster.tahunAjaran}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Edit tarif satuan atau jumlah paket soal, jam jaga, malam piket, lembar koreksi &amp; santri rapor langsung di tabel; subtotal &amp; total bisyaroh otomatis terhitung.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <PrintOrientationControl recommended="landscape" compact />
                <button
                  type="button"
                  onClick={handleSyncBisyarohToRab}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
                  <span>Sinkronkan ke Pos Insentif RAB</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    triggerReliablePrint({
                      title: `Rekap Bisyaroh Guru Imtihan ${imtihanMaster.cawu}`,
                      orientation: printOrientation,
                      paperSize: 'F4',
                      targetElement: bisyarohPrintRef.current,
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Rekap Bisyaroh (F4)</span>
                </button>
              </div>
            </div>

            {/* Editable Parameter Tarif Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tarif Soal (/Paket)
                </label>
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={bisyarohRates.tarifSoal}
                  onChange={(e) =>
                    setBisyarohRates((r) => ({ ...r, tarifSoal: parseInt(e.target.value) || 0 }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-1.5 font-bold tabular-nums"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tarif Jaga (/Jam)
                </label>
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={bisyarohRates.tarifJaga}
                  onChange={(e) =>
                    setBisyarohRates((r) => ({ ...r, tarifJaga: parseInt(e.target.value) || 0 }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-1.5 font-bold tabular-nums"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tarif Piket (/Malam)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={bisyarohRates.tarifPiket}
                  onChange={(e) =>
                    setBisyarohRates((r) => ({ ...r, tarifPiket: parseInt(e.target.value) || 0 }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-1.5 font-bold tabular-nums"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tarif Koreksi (/Lembar)
                </label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={bisyarohRates.tarifKoreksi}
                  onChange={(e) =>
                    setBisyarohRates((r) => ({
                      ...r,
                      tarifKoreksi: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-1.5 font-bold tabular-nums"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tarif Rapor (/Santri)
                </label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={bisyarohRates.tarifRapor}
                  onChange={(e) =>
                    setBisyarohRates((r) => ({
                      ...r,
                      tarifRapor: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-1.5 font-bold tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Printable Spreadsheet Rekap Bisyaroh Guru */}
          <div
            ref={bisyarohPrintRef}
            className="bg-white border-2 border-slate-800 p-5 sm:p-7 shadow-xl printable-area font-sans text-black space-y-4 overflow-x-auto"
          >
            {showOfficialBanner && (
              <div className="w-full pb-2 border-b-2 border-black flex items-center justify-center gap-4">
                <img
                  src="/assets/aistudio/ChatGPT_Image_Nov_6__2025__01_32_08_PM_64f70724.png"
                  alt="Logo Resmi Panitia Imtihan PP NU Darussalam Karangdadap"
                  className="w-14 h-14 object-contain shrink-0"
                />
                <div className="text-center">
                  <p className="text-[10.5px] font-bold uppercase tracking-widest text-slate-700">
                    PANITIA PELAKSANA IMTIHAN MADRASAH DINIYAH SALAFIYAH
                  </p>
                  <h2 className="text-base font-black uppercase text-black leading-tight">
                    PONDOK PESANTREN NU DARUSSALAM KARANGDADAP
                  </h2>
                </div>
              </div>
            )}

            <div className="space-y-0.5">
              <h3 className="text-sm sm:text-base font-black uppercase text-black">
                REKAP BISYAROH GURU · IMTIHAN {imtihanMaster.cawu} · TAHUN AJARAN{' '}
                {imtihanMaster.tahunAjaran}
              </h3>
              <p className="text-[11px] italic text-slate-600">
                Tarif aktif: Soal Rp {bisyarohRates.tarifSoal.toLocaleString('id-ID')}/paket · Jaga Rp{' '}
                {bisyarohRates.tarifJaga.toLocaleString('id-ID')}/jam · Piket Rp{' '}
                {bisyarohRates.tarifPiket.toLocaleString('id-ID')}/malam · Koreksi Rp{' '}
                {bisyarohRates.tarifKoreksi.toLocaleString('id-ID')}/lembar · Rapor Rp{' '}
                {bisyarohRates.tarifRapor.toLocaleString('id-ID')}/santri.
              </p>
            </div>

            <table className="w-full text-[10.5px] border-collapse border border-slate-700 min-w-[920px]">
              <thead>
                <tr className="bg-slate-800 text-white font-bold text-center">
                  <th className="border border-slate-600 py-2 px-1.5 w-8">No</th>
                  <th className="border border-slate-600 py-2 px-2 text-left min-w-[165px]">
                    Nama Guru
                  </th>
                  <th className="border border-slate-600 py-2 px-1.5 w-11">JTM</th>
                  <th className="border border-slate-600 py-2 px-1.5 w-12">Walkel</th>
                  <th className="border border-slate-600 py-2 px-1.5 w-14">Paket soal</th>
                  <th className="border border-slate-600 py-2 px-1.5 w-20">Honor soal</th>
                  <th className="border border-slate-600 py-2 px-1.5 w-14">Jam jaga</th>
                  <th className="border border-slate-600 py-2 px-1.5 w-20">Honor jaga</th>
                  <th className="border border-slate-600 py-2 px-1.5 w-14">Malam piket</th>
                  <th className="border border-slate-600 py-2 px-1.5 w-20">Honor piket</th>
                  <th className="border border-slate-600 py-2 px-1.5 w-16">Lembar koreksi</th>
                  <th className="border border-slate-600 py-2 px-1.5 w-20">Honor koreksi</th>
                  <th className="border border-slate-600 py-2 px-1.5 w-14">Santri rapor</th>
                  <th className="border border-slate-600 py-2 px-1.5 w-20">Honor rapor</th>
                  <th className="border border-slate-600 py-2 px-2 w-24 bg-slate-900">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {(['PUTRA', 'PUTRI'] as const).map((grp) => {
                  const list =
                    grp === 'PUTRA' ? bisyarohSummary.putraList : bisyarohSummary.putriList;
                  const sub =
                    grp === 'PUTRA' ? bisyarohSummary.subPutra : bisyarohSummary.subPutri;

                  return (
                    <React.Fragment key={grp}>
                      <tr className="bg-slate-200 font-black text-slate-900">
                        <td
                          colSpan={15}
                          className="border border-slate-600 py-1.5 px-2.5 text-left uppercase tracking-wider"
                        >
                          <div className="flex items-center justify-between">
                            <span>{grp}</span>
                            <button
                              type="button"
                              onClick={() => handleAddBisyarohRow(grp)}
                              className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 border border-slate-300 text-[10px] font-bold text-slate-800 no-print"
                            >
                              + Tambah Guru {grp === 'PUTRA' ? 'Putra' : 'Putri'}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {list.map((row, rIdx) => {
                        const hSoal = row.paketSoal * bisyarohRates.tarifSoal;
                        const hJaga = row.jamJaga * bisyarohRates.tarifJaga;
                        const hPiket = row.malamPiket * bisyarohRates.tarifPiket;
                        const hKoreksi = row.lembarKoreksi * bisyarohRates.tarifKoreksi;
                        const hRapor = row.santriRapor * bisyarohRates.tarifRapor;
                        const rowTotal = hSoal + hJaga + hPiket + hKoreksi + hRapor;

                        return (
                          <tr key={row.id} className="hover:bg-emerald-50/40">
                            <td className="border border-slate-400 py-1 px-1 text-center font-semibold tabular-nums">
                              {rIdx + 1}
                            </td>
                            <td className="border border-slate-400 py-0.5 px-1.5">
                              <input
                                type="text"
                                value={row.nama}
                                onChange={(e) =>
                                  handleUpdateBisyarohField(row.id, 'nama', e.target.value)
                                }
                                className="w-full bg-transparent text-[10.5px] font-medium px-0.5 py-0.5 focus:bg-white focus:outline-hidden"
                              />
                            </td>
                            <td className="border border-slate-400 py-0.5 px-0.5 text-center">
                              <input
                                type="number"
                                min={0}
                                value={row.jtm}
                                onChange={(e) =>
                                  handleUpdateBisyarohField(
                                    row.id,
                                    'jtm',
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-full text-center bg-transparent tabular-nums focus:bg-white"
                              />
                            </td>
                            <td className="border border-slate-400 py-0.5 px-0.5 text-center">
                              <input
                                type="text"
                                value={row.walkel}
                                onChange={(e) =>
                                  handleUpdateBisyarohField(row.id, 'walkel', e.target.value)
                                }
                                className="w-full text-center bg-transparent font-bold focus:bg-white"
                              />
                            </td>
                            <td className="border border-slate-400 py-0.5 px-0.5 text-center">
                              <input
                                type="number"
                                min={0}
                                step={0.5}
                                value={row.paketSoal}
                                onChange={(e) =>
                                  handleUpdateBisyarohField(
                                    row.id,
                                    'paketSoal',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full text-center bg-transparent tabular-nums font-semibold focus:bg-white"
                              />
                            </td>
                            <td className="border border-slate-400 py-1 px-1.5 text-right tabular-nums">
                              {formatRpOrDash(hSoal)}
                            </td>
                            <td className="border border-slate-400 py-0.5 px-0.5 text-center">
                              <input
                                type="number"
                                min={0}
                                value={row.jamJaga}
                                onChange={(e) =>
                                  handleUpdateBisyarohField(
                                    row.id,
                                    'jamJaga',
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-full text-center bg-transparent tabular-nums font-semibold focus:bg-white"
                              />
                            </td>
                            <td className="border border-slate-400 py-1 px-1.5 text-right tabular-nums">
                              {formatRpOrDash(hJaga)}
                            </td>
                            <td className="border border-slate-400 py-0.5 px-0.5 text-center">
                              <input
                                type="number"
                                min={0}
                                value={row.malamPiket}
                                onChange={(e) =>
                                  handleUpdateBisyarohField(
                                    row.id,
                                    'malamPiket',
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-full text-center bg-transparent tabular-nums font-semibold focus:bg-white"
                              />
                            </td>
                            <td className="border border-slate-400 py-1 px-1.5 text-right tabular-nums">
                              {formatRpOrDash(hPiket)}
                            </td>
                            <td className="border border-slate-400 py-0.5 px-0.5 text-center">
                              <input
                                type="number"
                                min={0}
                                value={row.lembarKoreksi}
                                onChange={(e) =>
                                  handleUpdateBisyarohField(
                                    row.id,
                                    'lembarKoreksi',
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-full text-center bg-transparent tabular-nums font-semibold focus:bg-white"
                              />
                            </td>
                            <td className="border border-slate-400 py-1 px-1.5 text-right tabular-nums">
                              {formatRpOrDash(hKoreksi)}
                            </td>
                            <td className="border border-slate-400 py-0.5 px-0.5 text-center">
                              <input
                                type="number"
                                min={0}
                                value={row.santriRapor}
                                onChange={(e) =>
                                  handleUpdateBisyarohField(
                                    row.id,
                                    'santriRapor',
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-full text-center bg-transparent tabular-nums font-semibold focus:bg-white"
                              />
                            </td>
                            <td className="border border-slate-400 py-1 px-1.5 text-right tabular-nums">
                              {formatRpOrDash(hRapor)}
                            </td>
                            <td className="border border-slate-400 py-1 px-2 text-right font-bold tabular-nums bg-slate-50">
                              {rowTotal.toLocaleString('id-ID')}
                            </td>
                          </tr>
                        );
                      })}

                      {/* Subtotal Row */}
                      <tr className="bg-slate-200/80 font-black border-t-2 border-b-2 border-slate-700 text-slate-950">
                        <td className="border border-slate-600" />
                        <td className="border border-slate-600 py-1.5 px-2">
                          Subtotal {grp === 'PUTRA' ? 'putra' : 'putri'}
                        </td>
                        <td className="border border-slate-600" />
                        <td className="border border-slate-600" />
                        <td className="border border-slate-600 py-1.5 px-1 text-center tabular-nums">
                          {sub.soalQty.toLocaleString('id-ID', { minimumFractionDigits: 1 })}
                        </td>
                        <td className="border border-slate-600 py-1.5 px-1.5 text-right tabular-nums">
                          {formatRpOrDash(sub.soalRp)}
                        </td>
                        <td className="border border-slate-600 py-1.5 px-1 text-center tabular-nums">
                          {sub.jagaQty}
                        </td>
                        <td className="border border-slate-600 py-1.5 px-1.5 text-right tabular-nums">
                          {formatRpOrDash(sub.jagaRp)}
                        </td>
                        <td className="border border-slate-600 py-1.5 px-1 text-center tabular-nums">
                          {sub.piketQty}
                        </td>
                        <td className="border border-slate-600 py-1.5 px-1.5 text-right tabular-nums">
                          {formatRpOrDash(sub.piketRp)}
                        </td>
                        <td className="border border-slate-600 py-1.5 px-1 text-center tabular-nums">
                          {sub.koreksiQty.toLocaleString('id-ID')}
                        </td>
                        <td className="border border-slate-600 py-1.5 px-1.5 text-right tabular-nums">
                          {formatRpOrDash(sub.koreksiRp)}
                        </td>
                        <td className="border border-slate-600 py-1.5 px-1 text-center tabular-nums">
                          {sub.raporQty > 0 ? sub.raporQty : '-'}
                        </td>
                        <td className="border border-slate-600 py-1.5 px-1.5 text-right tabular-nums">
                          {formatRpOrDash(sub.raporRp)}
                        </td>
                        <td className="border border-slate-600 py-1.5 px-2 text-right tabular-nums">
                          {sub.totalRp.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}

                {/* Grand Total Row (Putra + Putri) */}
                <tr className="bg-[#D1E7DD] font-black border-2 border-black text-emerald-950">
                  <td colSpan={4} className="border border-black py-2 px-3 text-right uppercase">
                    GRAND TOTAL BISYAROH GURU (PUTRA + PUTRI)
                  </td>
                  <td className="border border-black py-2 px-1 text-center tabular-nums">
                    {bisyarohSummary.grand.soalQty.toLocaleString('id-ID', {
                      minimumFractionDigits: 1,
                    })}
                  </td>
                  <td className="border border-black py-2 px-1.5 text-right tabular-nums">
                    {bisyarohSummary.grand.soalRp.toLocaleString('id-ID')}
                  </td>
                  <td className="border border-black py-2 px-1 text-center tabular-nums">
                    {bisyarohSummary.grand.jagaQty}
                  </td>
                  <td className="border border-black py-2 px-1.5 text-right tabular-nums">
                    {bisyarohSummary.grand.jagaRp.toLocaleString('id-ID')}
                  </td>
                  <td className="border border-black py-2 px-1 text-center tabular-nums">
                    {bisyarohSummary.grand.piketQty}
                  </td>
                  <td className="border border-black py-2 px-1.5 text-right tabular-nums">
                    {bisyarohSummary.grand.piketRp.toLocaleString('id-ID')}
                  </td>
                  <td className="border border-black py-2 px-1 text-center tabular-nums">
                    {bisyarohSummary.grand.koreksiQty.toLocaleString('id-ID')}
                  </td>
                  <td className="border border-black py-2 px-1.5 text-right tabular-nums">
                    {bisyarohSummary.grand.koreksiRp.toLocaleString('id-ID')}
                  </td>
                  <td className="border border-black py-2 px-1 text-center tabular-nums">
                    {bisyarohSummary.grand.raporQty}
                  </td>
                  <td className="border border-black py-2 px-1.5 text-right tabular-nums">
                    {bisyarohSummary.grand.raporRp.toLocaleString('id-ID')}
                  </td>
                  <td className="border border-black py-2 px-2 text-right tabular-nums text-xs">
                    Rp {bisyarohSummary.grand.totalRp.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Signature block for Bisyaroh sheet */}
            <div className="pt-6 grid grid-cols-3 gap-6 text-center text-xs font-serif text-black">
              <div className="space-y-14">
                <p className="font-semibold">
                  Mengetahui,<br />
                  <span className="font-bold">Ketua Pelaksana Imtihan</span>
                </p>
                <p className="font-bold underline">Ust. Nidhomul Muna Lana</p>
              </div>
              <div className="space-y-14">
                <p className="font-semibold">
                  Menyetujui,<br />
                  <span className="font-bold">Pengasuh PP NU Darussalam</span>
                </p>
                <p className="font-bold underline">KH. Amin Maizun</p>
              </div>
              <div className="space-y-14">
                <p className="font-semibold">
                  Karangdadap, {new Date().getFullYear()}<br />
                  <span className="font-bold">Bendahara Imtihan</span>
                </p>
                <p className="font-bold underline">M. Abdul Fataah</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        MODAL DIALOG INPUT / EDIT ITEM ANGGARAN (Kategori, Deskripsi, Volume, Satuan, Harga Satuan, Total)
        ========================================================================
      */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 no-print print:hidden">
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
