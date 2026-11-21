import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  CreditCard,
  FileSpreadsheet,
  Plus,
  Printer,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAppStore } from '../../../lib/store.ts';
import { triggerReliablePrint } from '../../../lib/printHelper.ts';
import { PrintKopPondok } from '../../../components/common/PrintKopPondok.tsx';
import { PrintOrientationControl } from '../../../components/common/PrintOrientationControl.tsx';
import type {
  BendaharaSantriProfile,
  KategoriTagihanSantri,
  TagihanSantriItem,
} from '../../../data/seed/pondokData.ts';

const fmtRp = (n: number) => `Rp ${Math.round(n).toLocaleString('id-ID')}`;

export const TagihanSantriSubTab: React.FC = () => {
  const {
    santriList,
    bendaharaSantriList,
    tagihanSantriList,
    agendaKegiatan,
    currentTahunAjaran,
    printOrientation,
    syncBendaharaSantriFromSekretaris,
    addBendaharaSantriManual,
    updateBendaharaSantriStatus,
    addTagihanSantri,
    generateMassTagihanSantri,
    bayarTagihanSantri,
    deleteTagihanSantri,
  } = useAppStore();

  const [viewMode, setViewMode] = useState<'per_santri' | 'daftar_tagihan'>('per_santri');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<
    'Semua' | 'Aktif' | 'Boyong / Keluar' | 'Lulus / Alumni' | 'Ada Tunggakan'
  >('Semua');
  const [kategoriFilter, setKategoriFilter] = useState<'Semua' | KategoriTagihanSantri>('Semua');
  const [selectedLedgerId, setSelectedLedgerId] = useState<string>(
    bendaharaSantriList[0]?.id || ''
  );
  const [noticeMsg, setNoticeMsg] = useState<string>('');

  // Modals
  const [showAddSantriModal, setShowAddSantriModal] = useState<boolean>(false);
  const [showMassTagihanModal, setShowMassTagihanModal] = useState<boolean>(false);
  const [showSingleTagihanModal, setShowSingleTagihanModal] = useState<boolean>(false);
  const [payModalItem, setPayModalItem] = useState<TagihanSantriItem | null>(null);

  // Add Santri Manual State
  const [manNis, setManNis] = useState('26.9001');
  const [manNama, setManNama] = useState('');
  const [manGender, setManGender] = useState<'L' | 'P'>('L');
  const [manKelas, setManKelas] = useState('2 A PUTRA');
  const [manKamar, setManKamar] = useState('Al-Falah 1');
  const [manWali, setManWali] = useState('');
  const [manHpWali, setManHpWali] = useState('0812-');
  const [manStatusPondok, setManStatusPondok] = useState<'Aktif' | 'Boyong / Keluar' | 'Lulus / Alumni'>('Boyong / Keluar');
  const [manCatatan, setManCatatan] = useState('Data mandiri bendahara (terpisah dari Sekretaris).');

  // Generate Mass / Single Tagihan State
  const [formKategori, setFormKategori] = useState<KategoriTagihanSantri>('Syahriyah Bulanan');
  const [formAgendaId, setFormAgendaId] = useState<string>(agendaKegiatan[0]?.id || '');
  const [formJudul, setFormJudul] = useState<string>('Syahriyah Bulan Desember 2026');
  const [formPeriode, setFormPeriode] = useState<string>('Desember 2026');
  const [formNominal, setFormNominal] = useState<number>(150000);
  const [formJatuhTempo, setFormJatuhTempo] = useState<string>('2026-12-10');
  const [formOnlyAktif, setFormOnlyAktif] = useState<boolean>(true);

  // Payment Modal State
  const [payNominal, setPayNominal] = useState<number>(0);
  const [payMetode, setPayMetode] = useState<string>('Tunai Loket Bendahara');
  const [payCatatan, setPayCatatan] = useState<string>('');

  const notify = (msg: string) => {
    setNoticeMsg(msg);
    setTimeout(() => setNoticeMsg(''), 4500);
  };

  // Live integration with Sekretariat statusPondok & deletion detection
  const reconciledLedgers = useMemo(() => {
    const sekById = new Map(santriList.map((s) => [s.id, s]));
    const sekByNis = new Map(santriList.map((s) => [s.nis, s]));
    return bendaharaSantriList.map((b) => {
      const sekMatch = (b.refSantriId ? sekById.get(b.refSantriId) : undefined) || sekByNis.get(b.nis);
      const liveStatus = sekMatch?.statusPondok ?? b.statusPondok;
      const removedFromSek =
        Boolean(b.terhapusDiSekretaris) || (!sekMatch && b.sumberData === 'Sekretaris');
      return {
        ...b,
        statusPondok: liveStatus,
        terhapusDiSekretaris: removedFromSek,
      };
    });
  }, [bendaharaSantriList, santriList]);

  // Compute aggregated metrics per ledger profile
  const summaryStats = useMemo(() => {
    const ledgerMap = new Map<string, BendaharaSantriProfile>();
    reconciledLedgers.forEach((b) => ledgerMap.set(b.id, b));

    let totalDiterbitkan = 0;
    let totalTerbayar = 0;
    let piutangAktif = 0;
    let piutangBoyong = 0;
    let countBoyongMenunggak = 0;

    const perLedger = new Map<
      string,
      { totalTagihan: number; totalBayar: number; sisa: number; jumlahItem: number }
    >();

    tagihanSantriList.forEach((t) => {
      if (kategoriFilter !== 'Semua' && t.kategori !== kategoriFilter) return;
      const sisa = Math.max(0, t.nominalTagihan - t.nominalTerbayar);
      totalDiterbitkan += t.nominalTagihan;
      totalTerbayar += t.nominalTerbayar;
      const owner = ledgerMap.get(t.ledgerId);
      if (owner?.statusPondok === 'Boyong / Keluar' || owner?.terhapusDiSekretaris) {
        piutangBoyong += sisa;
      } else {
        piutangAktif += sisa;
      }

      const prev = perLedger.get(t.ledgerId) || {
        totalTagihan: 0,
        totalBayar: 0,
        sisa: 0,
        jumlahItem: 0,
      };
      perLedger.set(t.ledgerId, {
        totalTagihan: prev.totalTagihan + t.nominalTagihan,
        totalBayar: prev.totalBayar + t.nominalTerbayar,
        sisa: prev.sisa + sisa,
        jumlahItem: prev.jumlahItem + 1,
      });
    });

    const boyongDebtors: Array<{ profile: BendaharaSantriProfile; sisa: number }> = [];
    reconciledLedgers.forEach((b) => {
      const sisa = perLedger.get(b.id)?.sisa || 0;
      if ((b.statusPondok === 'Boyong / Keluar' || b.terhapusDiSekretaris) && sisa > 0) {
        countBoyongMenunggak += 1;
        boyongDebtors.push({ profile: b, sisa });
      }
    });

    return {
      totalDiterbitkan,
      totalTerbayar,
      piutangAktif,
      piutangBoyong,
      countBoyongMenunggak,
      boyongDebtors,
      perLedger,
    };
  }, [reconciledLedgers, tagihanSantriList, kategoriFilter]);

  const filteredLedgers = useMemo(() => {
    return reconciledLedgers.filter((b) => {
      const stats = summaryStats.perLedger.get(b.id);
      if (statusFilter === 'Ada Tunggakan') {
        if (!stats || stats.sisa <= 0) return false;
      } else if (statusFilter === 'Boyong / Keluar') {
        if (b.statusPondok !== 'Boyong / Keluar' && !b.terhapusDiSekretaris) return false;
      } else if (statusFilter !== 'Semua' && b.statusPondok !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hit =
          b.nama.toLowerCase().includes(q) ||
          b.nis.toLowerCase().includes(q) ||
          b.namaWali.toLowerCase().includes(q) ||
          b.kelas.toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
  }, [reconciledLedgers, summaryStats.perLedger, statusFilter, searchQuery]);

  const activeLedger =
    reconciledLedgers.find((b) => b.id === selectedLedgerId) || filteredLedgers[0] || null;

  const activeLedgerBills = useMemo(() => {
    if (!activeLedger) return [];
    return tagihanSantriList.filter(
      (t) =>
        t.ledgerId === activeLedger.id &&
        (kategoriFilter === 'Semua' || t.kategori === kategoriFilter)
    );
  }, [tagihanSantriList, activeLedger, kategoriFilter]);

  const allFilteredBills = useMemo(() => {
    const ledgerSet = new Set(filteredLedgers.map((b) => b.id));
    return tagihanSantriList.filter(
      (t) =>
        ledgerSet.has(t.ledgerId) &&
        (kategoriFilter === 'Semua' || t.kategori === kategoriFilter)
    );
  }, [tagihanSantriList, filteredLedgers, kategoriFilter]);

  const handleSyncFromSekretaris = () => {
    const res = syncBendaharaSantriFromSekretaris();
    notify(
      `Sinkron selesai: ${res.added} santri baru ditambahkan, ${res.updated} santri aktif diselaraskan, ${res.preservedBoyong} arsip santri Boyong/Keluar tetap aman.`
    );
  };

  const handleSelectKategoriPreset = (kat: KategoriTagihanSantri) => {
    setFormKategori(kat);
    if (kat === 'Syahriyah Bulanan') {
      setFormJudul('Syahriyah Bulan Desember 2026');
      setFormPeriode('Desember 2026');
      setFormNominal(150000);
      setFormJatuhTempo('2026-12-10');
    } else if (kat === 'Daftar Ulang') {
      setFormJudul(`Daftar Ulang & Buku Kitab T.A. ${currentTahunAjaran}`);
      setFormPeriode(`T.A. ${currentTahunAjaran}`);
      setFormNominal(450000);
      setFormJatuhTempo('2026-12-20');
    } else if (kat === "Agenda Kema'hadiyahan") {
      const ag = agendaKegiatan.find((a) => a.id === formAgendaId) || agendaKegiatan[0];
      if (ag) {
        setFormAgendaId(ag.id);
        setFormJudul(`Iuran ${ag.nama}`);
        setFormPeriode(ag.tanggal.slice(0, 7));
        setFormNominal(50000);
        setFormJatuhTempo(ag.tanggal);
      } else {
        setFormJudul("Iuran Agenda Kegiatan Kema'hadiyahan");
        setFormPeriode('Semester Gasal');
        setFormNominal(50000);
      }
    }
  };

  const handleSelectAgendaChange = (agId: string) => {
    setFormAgendaId(agId);
    const ag = agendaKegiatan.find((a) => a.id === agId);
    if (ag) {
      setFormJudul(`Iuran ${ag.nama}`);
      setFormPeriode(ag.tanggal.slice(0, 7));
      setFormJatuhTempo(ag.tanggal);
    }
  };

  const handleCreateManualSantri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manNama.trim()) return;
    const newId = addBendaharaSantriManual({
      nis: manNis.trim() || `26.${Math.floor(1000 + Math.random() * 8999)}`,
      nama: manNama.trim().toUpperCase(),
      gender: manGender,
      kelas: manKelas.trim() || 'Umum',
      kamar: manKamar.trim() || '-',
      namaWali: manWali.trim() || '-',
      hpWali: manHpWali.trim() || '-',
      statusPondok: manStatusPondok,
      catatanKeuangan: manCatatan.trim(),
    });
    setSelectedLedgerId(newId);
    setShowAddSantriModal(false);
    setManNama('');
    setManWali('');
    notify('Profil santri mandiri di Bendahara berhasil dibuat (terpisah dari Sekretaris).');
  };

  const handleSubmitMassTagihan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul.trim() || formNominal <= 0) return;
    const count = generateMassTagihanSantri({
      kategori: formKategori,
      judulTagihan: formJudul.trim(),
      periode: formPeriode.trim(),
      nominalTagihan: formNominal,
      jatuhTempo: formJatuhTempo,
      agendaId: formKategori === "Agenda Kema'hadiyahan" ? formAgendaId : undefined,
      onlyAktif: formOnlyAktif,
    });
    setShowMassTagihanModal(false);
    notify(
      count > 0
        ? `Berhasil menerbitkan ${count} tagihan ${formKategori} (${formJudul}).`
        : 'Seluruh santri sasaran sudah memiliki tagihan dengan judul & periode tersebut.'
    );
  };

  const handleSubmitSingleTagihan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLedger || !formJudul.trim() || formNominal <= 0) return;
    addTagihanSantri({
      ledgerId: activeLedger.id,
      kategori: formKategori,
      judulTagihan: formJudul.trim(),
      periode: formPeriode.trim(),
      agendaId: formKategori === "Agenda Kema'hadiyahan" ? formAgendaId : undefined,
      nominalTagihan: formNominal,
      jatuhTempo: formJatuhTempo,
    });
    setShowSingleTagihanModal(false);
    notify(`Tagihan ${formJudul} untuk ${activeLedger.nama} diterbitkan.`);
  };

  const openPayModal = (item: TagihanSantriItem) => {
    const sisa = Math.max(0, item.nominalTagihan - item.nominalTerbayar);
    setPayModalItem(item);
    setPayNominal(sisa);
    setPayCatatan('');
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModalItem || payNominal <= 0) return;
    bayarTagihanSantri(payModalItem.id, payNominal, payMetode, payCatatan.trim() || undefined);
    setPayModalItem(null);
    notify(
      `Pembayaran ${fmtRp(payNominal)} untuk "${payModalItem.judulTagihan}" dicatat & otomatis masuk Buku Kas Masuk.`
    );
  };

  const handleExportExcel = () => {
    const ledgerById = new Map<string, BendaharaSantriProfile>(
      bendaharaSantriList.map((b) => [b.id, b])
    );
    const rows = allFilteredBills.map((t) => {
      const owner = ledgerById.get(t.ledgerId);
      const sisa = Math.max(0, t.nominalTagihan - t.nominalTerbayar);
      return {
        NIS: owner?.nis || '-',
        Nama_Santri: owner?.nama || '-',
        Status_Pondok: owner?.statusPondok || 'Aktif',
        Arsip_Sekretaris: owner?.terhapusDiSekretaris ? 'Dihapus/Boyong (Tanggungan Terjaga)' : 'Aktif Sinkron',
        Wali_Santri: owner?.namaWali || '-',
        HP_Wali: owner?.hpWali || '-',
        Kategori: t.kategori,
        Judul_Tagihan: t.judulTagihan,
        Periode: t.periode,
        Jatuh_Tempo: t.jatuhTempo,
        Nominal_Tagihan: t.nominalTagihan,
        Sudah_Terbayar: t.nominalTerbayar,
        Sisa_Tunggakan: sisa,
        Status_Bayar: t.status,
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rekap Tagihan Santri');
    XLSX.writeFile(wb, `Rekap_Tagihan_Syahriyah_DaftarUlang_Agenda.xlsx`);
    notify('Rekap tagihan & tunggakan santri (termasuk Boyong) berhasil diekspor ke Excel.');
  };

  return (
    <div className="space-y-5">
      {noticeMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{noticeMsg}</span>
        </div>
      )}

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 no-print">
        <div className="rounded-2xl bg-white p-4 border border-slate-200">
          <p className="text-[11px] font-semibold text-slate-500">Total Tagihan Diterbitkan</p>
          <p className="text-lg font-black text-slate-900 tabular-nums mt-1">
            {fmtRp(summaryStats.totalDiterbitkan)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Syahriyah · Daftar Ulang · Agenda Kema&apos;hadiyahan
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-slate-200">
          <p className="text-[11px] font-semibold text-slate-500">Sudah Terbayar (Masuk Kas)</p>
          <p className="text-lg font-black text-emerald-800 tabular-nums mt-1">
            {fmtRp(summaryStats.totalTerbayar)}
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
            Otomatis tercatat di Buku Kas &amp; Neraca
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-slate-200">
          <p className="text-[11px] font-semibold text-slate-500">Piutang Santri Aktif</p>
          <p className="text-lg font-black text-amber-800 tabular-nums mt-1">
            {fmtRp(summaryStats.piutangAktif)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Dapat dibayar via Bendahara atau Portal Wali
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-rose-200">
          <p className="text-[11px] font-semibold text-rose-700 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Piutang Santri Boyong / Keluar</span>
          </p>
          <p className="text-lg font-black text-rose-900 tabular-nums mt-1">
            {fmtRp(summaryStats.piutangBoyong)}
          </p>
          <p className="text-[11px] text-rose-700 font-semibold mt-0.5">
            {summaryStats.countBoyongMenunggak} santri boyong · Arsip terjaga meski dihapus Sekretaris
          </p>
        </div>
      </div>

      {/* Automatic Detection Alert: Boyong / Keluar Santri with Remaining Arrears */}
      {summaryStats.boyongDebtors.length > 0 && (
        <div className="rounded-2xl bg-rose-50/90 border border-rose-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div className="flex items-start gap-2.5 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-rose-900">
                Deteksi Otomatis Sekretariat: {summaryStats.boyongDebtors.length} Santri Boyong / Keluar Masih Memiliki Tanggungan ({fmtRp(summaryStats.piutangBoyong)})
              </p>
              <p className="text-[11px] text-rose-800 mt-0.5">
                {summaryStats.boyongDebtors
                  .slice(0, 3)
                  .map((d) => `${d.profile.nama} (${fmtRp(d.sisa)})`)
                  .join(' · ')}
                {summaryStats.boyongDebtors.length > 3
                  ? ` · +${summaryStats.boyongDebtors.length - 3} lainnya`
                  : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('Boyong / Keluar');
              setViewMode('per_santri');
              if (summaryStats.boyongDebtors[0]) {
                setSelectedLedgerId(summaryStats.boyongDebtors[0].profile.id);
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold whitespace-nowrap shrink-0"
          >
            Tampilkan Santri Boyong Menunggak
          </button>
        </div>
      )}

      {/* Action Toolbar */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200 flex flex-col xl:flex-row xl:items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSyncFromSekretaris}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tarik / Sinkron Data Sekretaris</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddSantriModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
            <span>+ Tambah Santri Mandiri</span>
          </button>

          <button
            type="button"
            onClick={() => {
              handleSelectKategoriPreset('Syahriyah Bulanan');
              setShowMassTagihanModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Tagihan Massal</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('per_santri')}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap ${
                viewMode === 'per_santri' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Per Profil Santri ({bendaharaSantriList.length})
            </button>
            <button
              type="button"
              onClick={() => setViewMode('daftar_tagihan')}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap ${
                viewMode === 'daftar_tagihan' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Semua Daftar Tagihan ({allFilteredBills.length})
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportExcel}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Ekspor Excel</span>
          </button>

          <PrintOrientationControl recommended="landscape" compact />

          <button
            type="button"
            onClick={() =>
              triggerReliablePrint({
                title: `Rekap Tagihan & Pembayaran Santri - ${currentTahunAjaran}`,
                orientation: printOrientation,
                paperSize: 'F4',
              })
            }
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Tunggakan</span>
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 no-print">
        <div className="flex items-center gap-2 border border-slate-200 bg-white rounded-xl px-3 py-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama santri, NIS, kelas, atau wali..."
            className="w-full text-xs focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800"
          >
            <option value="Semua">Semua Status Pondok ({bendaharaSantriList.length})</option>
            <option value="Aktif">Santri Aktif</option>
            <option value="Boyong / Keluar">Boyong / Keluar (Tunggakan Terjaga)</option>
            <option value="Lulus / Alumni">Lulus / Alumni</option>
            <option value="Ada Tunggakan">Hanya yang Ada Tunggakan</option>
          </select>

          <select
            value={kategoriFilter}
            onChange={(e) => setKategoriFilter(e.target.value as typeof kategoriFilter)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800"
          >
            <option value="Semua">Semua Kategori Tagihan</option>
            <option value="Syahriyah Bulanan">Syahriyah Bulanan</option>
            <option value="Daftar Ulang">Daftar Ulang</option>
            <option value="Agenda Kema'hadiyahan">Agenda Kegiatan Kema&apos;hadiyahan</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
      </div>

      {/* VIEW 1: PER SANTRI SPLIT VIEW */}
      {viewMode === 'per_santri' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Ledger List */}
          <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 overflow-hidden no-print">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                <span>Buku Induk Keuangan Santri ({filteredLedgers.length})</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500">Independen Sekretaris</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
              {filteredLedgers.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Tidak ada data santri yang cocok dengan filter.
                </div>
              ) : (
                filteredLedgers.map((b) => {
                  const st = summaryStats.perLedger.get(b.id) || {
                    totalTagihan: 0,
                    totalBayar: 0,
                    sisa: 0,
                    jumlahItem: 0,
                  };
                  const isSelected = activeLedger?.id === b.id;
                  const isBoyong = b.statusPondok === 'Boyong / Keluar';
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedLedgerId(b.id)}
                      className={`w-full text-left p-3.5 transition flex items-start justify-between gap-3 ${
                        isSelected ? 'bg-emerald-50/90' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-slate-900 truncate">{b.nama}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          <span className="tabular-nums font-semibold text-slate-700">{b.nis}</span>
                          {' · '}
                          {b.kelas}
                          {' · '}
                          <span
                            className={`font-bold ${
                              isBoyong
                                ? 'text-rose-700'
                                : b.statusPondok === 'Aktif'
                                ? 'text-emerald-700'
                                : 'text-slate-600'
                            }`}
                          >
                            {b.statusPondok}
                          </span>
                          {b.terhapusDiSekretaris ? ' · Dihapus di Sekretaris' : ''}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className={`text-xs font-extrabold tabular-nums ${
                            st.sisa > 0 ? 'text-rose-700' : 'text-emerald-700'
                          }`}
                        >
                          {st.sisa > 0 ? fmtRp(st.sisa) : 'Lunas'}
                        </p>
                        <p className="text-[10px] text-slate-400 tabular-nums">
                          {st.jumlahItem} tagihan
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Selected Santri Detail & Bills */}
          <div className="lg:col-span-7 rounded-2xl bg-white p-5 border border-slate-200 printable-area space-y-4">
            <PrintKopPondok
              judulDokumen={
                activeLedger
                  ? `KARTU TAGIHAN & TUNGGAKAN SANTRI — ${activeLedger.nama}`
                  : 'REKAPITULASI TAGIHAN SANTRI'
              }
              subJudul={
                activeLedger
                  ? `NIS ${activeLedger.nis} · ${activeLedger.kelas} · Status: ${activeLedger.statusPondok}`
                  : ''
              }
              tahunAjaran={currentTahunAjaran}
            />

            {!activeLedger ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Pilih salah satu profil santri di sebelah kiri untuk melihat &amp; memproses pembayaran tagihan.
              </div>
            ) : (
              <>
                {/* Santri Profile Banner */}
                <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{activeLedger.nama}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      NIS <span className="font-bold tabular-nums">{activeLedger.nis}</span>
                      {' · '}Kelas {activeLedger.kelas}
                      {' · '}Kamar {activeLedger.kamar}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Wali: <span className="font-semibold text-slate-800">{activeLedger.namaWali}</span>
                      {' · '}WA/HP: <span className="tabular-nums">{activeLedger.hpWali}</span>
                      {' · '}Sumber: {activeLedger.sumberData}
                    </p>
                    {activeLedger.terhapusDiSekretaris && (
                      <p className="text-[11px] font-bold text-rose-700 mt-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          Santri ini sudah dihapus/keluar dari data Sekretaris — arsip tagihan tetap aman di Bendahara.
                        </span>
                      </p>
                    )}
                    {activeLedger.catatanKeuangan && (
                      <p className="text-[11px] text-slate-500 italic mt-1">
                        Catatan: {activeLedger.catatanKeuangan}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 no-print shrink-0">
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] font-bold text-slate-500">Status:</label>
                      <select
                        value={activeLedger.statusPondok}
                        onChange={(e) =>
                          updateBendaharaSantriStatus(
                            activeLedger.id,
                            e.target.value as BendaharaSantriProfile['statusPondok']
                          )
                        }
                        className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-800 bg-white"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Boyong / Keluar">Boyong / Keluar</option>
                        <option value="Lulus / Alumni">Lulus / Alumni</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectKategoriPreset('Syahriyah Bulanan');
                        setShowSingleTagihanModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Tagihan Santri Ini</span>
                    </button>
                  </div>
                </div>

                {/* Bills Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-left">
                        <th className="py-2.5 px-3">Kategori &amp; Nama Tagihan</th>
                        <th className="py-2.5 px-3 text-right">Tagihan</th>
                        <th className="py-2.5 px-3 text-right">Terbayar</th>
                        <th className="py-2.5 px-3 text-right">Sisa</th>
                        <th className="py-2.5 px-3 text-left">Status</th>
                        <th className="py-2.5 px-3 text-right no-print">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeLedgerBills.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            Belum ada tagihan pada kategori ini.
                          </td>
                        </tr>
                      ) : (
                        activeLedgerBills.map((t) => {
                          const sisa = Math.max(0, t.nominalTagihan - t.nominalTerbayar);
                          return (
                            <tr key={t.id} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3">
                                <p className="font-bold text-slate-900">{t.judulTagihan}</p>
                                <p className="text-[11px] text-slate-500">
                                  {t.kategori} · Periode {t.periode} · Tempo {t.jatuhTempo}
                                </p>
                              </td>
                              <td className="py-2.5 px-3 text-right tabular-nums text-slate-700">
                                {fmtRp(t.nominalTagihan)}
                              </td>
                              <td className="py-2.5 px-3 text-right tabular-nums font-semibold text-emerald-700">
                                {fmtRp(t.nominalTerbayar)}
                              </td>
                              <td
                                className={`py-2.5 px-3 text-right tabular-nums font-bold ${
                                  sisa > 0 ? 'text-rose-700' : 'text-slate-400'
                                }`}
                              >
                                {fmtRp(sisa)}
                              </td>
                              <td
                                className={`py-2.5 px-3 font-bold ${
                                  t.status === 'Lunas'
                                    ? 'text-emerald-700'
                                    : t.status === 'Cicilan'
                                    ? 'text-amber-700'
                                    : 'text-rose-700'
                                }`}
                              >
                                {t.status}
                              </td>
                              <td className="py-2.5 px-3 text-right no-print">
                                <div className="flex items-center justify-end gap-1.5">
                                  {sisa > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => openPayModal(t)}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold whitespace-nowrap"
                                    >
                                      Bayar
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => deleteTagihanSantri(t.id)}
                                    className="p-1 rounded text-rose-500 hover:bg-rose-50"
                                    title="Hapus tagihan"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: ALL FILTERED BILLS TABLE */}
      {viewMode === 'daftar_tagihan' && (
        <div className="rounded-2xl bg-white p-5 border border-slate-200 printable-area space-y-3">
          <PrintKopPondok
            judulDokumen="DAFTAR REKAPITULASI TAGIHAN SYAHRIYAH, DAFTAR ULANG & AGENDA"
            subJudul={`Total Baris: ${allFilteredBills.length} · Kategori: ${kategoriFilter} · Tahun Ajaran ${currentTahunAjaran}`}
            tahunAjaran={currentTahunAjaran}
          />

          <div className="overflow-x-auto max-h-[580px]">
            <table className="w-full text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-600 text-left">
                <tr>
                  <th className="py-2.5 px-3">Santri &amp; Status Pondok</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Uraian Tagihan &amp; Periode</th>
                  <th className="py-2.5 px-3 text-right">Tagihan</th>
                  <th className="py-2.5 px-3 text-right">Terbayar</th>
                  <th className="py-2.5 px-3 text-right">Sisa</th>
                  <th className="py-2.5 px-3 text-left">Status</th>
                  <th className="py-2.5 px-3 text-right no-print">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allFilteredBills.map((t) => {
                  const owner = bendaharaSantriList.find((b) => b.id === t.ledgerId);
                  const sisa = Math.max(0, t.nominalTagihan - t.nominalTerbayar);
                  const isBoyong = owner?.statusPondok === 'Boyong / Keluar';
                  return (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-slate-900">{owner?.nama || 'Santri'}</p>
                        <p className="text-[11px] text-slate-500">
                          {owner?.nis} ·{' '}
                          <span className={isBoyong ? 'font-bold text-rose-700' : 'text-emerald-700 font-semibold'}>
                            {owner?.statusPondok || 'Aktif'}
                          </span>
                        </p>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{t.kategori}</td>
                      <td className="py-2.5 px-3">
                        <p className="font-semibold text-slate-900">{t.judulTagihan}</p>
                        <p className="text-[11px] text-slate-500">
                          Periode {t.periode} · Tempo {t.jatuhTempo}
                        </p>
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums">{fmtRp(t.nominalTagihan)}</td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-emerald-700 font-semibold">
                        {fmtRp(t.nominalTerbayar)}
                      </td>
                      <td
                        className={`py-2.5 px-3 text-right tabular-nums font-bold ${
                          sisa > 0 ? 'text-rose-700' : 'text-slate-400'
                        }`}
                      >
                        {fmtRp(sisa)}
                      </td>
                      <td
                        className={`py-2.5 px-3 font-bold ${
                          t.status === 'Lunas'
                            ? 'text-emerald-700'
                            : t.status === 'Cicilan'
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {t.status}
                      </td>
                      <td className="py-2.5 px-3 text-right no-print">
                        {sisa > 0 ? (
                          <button
                            type="button"
                            onClick={() => openPayModal(t)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold"
                          >
                            Bayar
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-bold">Lunas</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: TAMBAH SANTRI MANDIRI */}
      {showAddSantriModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <form
            onSubmit={handleCreateManualSantri}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  Tambah Profil Santri Mandiri (Bendahara)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Data tersimpan independen dari Sekretaris — cocok untuk pencatatan tunggakan santri lama atau boyong.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSantriModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">NIS</label>
                <input
                  type="text"
                  value={manNis}
                  onChange={(e) => setManNis(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Status Pondok</label>
                <select
                  value={manStatusPondok}
                  onChange={(e) =>
                    setManStatusPondok(e.target.value as BendaharaSantriProfile['statusPondok'])
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Boyong / Keluar">Boyong / Keluar</option>
                  <option value="Lulus / Alumni">Lulus / Alumni</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Santri</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: MUHAMMAD RIZAL FAUZI"
                  value={manNama}
                  onChange={(e) => setManNama(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={manGender}
                  onChange={(e) => setManGender(e.target.value as 'L' | 'P')}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                >
                  <option value="L">Putra (L)</option>
                  <option value="P">Putri (P)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kelas Terakhir</label>
                <input
                  type="text"
                  value={manKelas}
                  onChange={(e) => setManKelas(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kamar / Komplek</label>
                <input
                  type="text"
                  value={manKamar}
                  onChange={(e) => setManKamar(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Wali Santri</label>
                <input
                  type="text"
                  value={manWali}
                  onChange={(e) => setManWali(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">No. HP / WhatsApp Wali</label>
                <input
                  type="text"
                  value={manHpWali}
                  onChange={(e) => setManHpWali(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Catatan Keuangan</label>
                <input
                  type="text"
                  value={manCatatan}
                  onChange={(e) => setManCatatan(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddSantriModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold"
              >
                Simpan Profil Mandiri
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2 & 3: GENERATE MASSAL OR SINGLE TAGIHAN */}
      {(showMassTagihanModal || showSingleTagihanModal) && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <form
            onSubmit={showMassTagihanModal ? handleSubmitMassTagihan : handleSubmitSingleTagihan}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  {showMassTagihanModal
                    ? 'Terbitkan Tagihan Massal Santri'
                    : `Tambah Tagihan untuk ${activeLedger?.nama || 'Santri'}`}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Pilih Syahriyah Bulanan, Daftar Ulang, atau tarik langsung dari Agenda Kegiatan Kema&apos;hadiyahan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowMassTagihanModal(false);
                  setShowSingleTagihanModal(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Pembayaran</label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    ['Syahriyah Bulanan', 'Daftar Ulang', "Agenda Kema'hadiyahan"] as KategoriTagihanSantri[]
                  ).map((kat) => (
                    <button
                      key={kat}
                      type="button"
                      onClick={() => handleSelectKategoriPreset(kat)}
                      className={`px-2.5 py-2 rounded-xl border text-[11px] font-bold transition ${
                        formKategori === kat
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {kat}
                    </button>
                  ))}
                </div>
              </div>

              {formKategori === "Agenda Kema'hadiyahan" && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Pilih Agenda Kegiatan Kema&apos;hadiyahan</span>
                  </label>
                  <select
                    value={formAgendaId}
                    onChange={(e) => handleSelectAgendaChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold text-emerald-950"
                  >
                    {agendaKegiatan.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.nama} ({ag.tanggal})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul / Nama Tagihan</label>
                <input
                  type="text"
                  required
                  value={formJudul}
                  onChange={(e) => setFormJudul(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Periode</label>
                  <input
                    type="text"
                    required
                    value={formPeriode}
                    onChange={(e) => setFormPeriode(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    min={1000}
                    step={5000}
                    required
                    value={formNominal}
                    onChange={(e) => setFormNominal(Number(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jatuh Tempo</label>
                  <input
                    type="date"
                    required
                    value={formJatuhTempo}
                    onChange={(e) => setFormJatuhTempo(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 tabular-nums"
                  />
                </div>
              </div>

              {showMassTagihanModal && (
                <label className="flex items-center gap-2 pt-1 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formOnlyAktif}
                    onChange={(e) => setFormOnlyAktif(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span>
                    Terbitkan hanya untuk santri berstatus <strong>Aktif</strong> (santri Boyong/Keluar dikecualikan)
                  </span>
                </label>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowMassTagihanModal(false);
                  setShowSingleTagihanModal(false);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold"
              >
                {showMassTagihanModal ? 'Terbitkan Tagihan Massal' : 'Terbitkan Tagihan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: BAYAR / CICIL TAGIHAN */}
      {payModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <form
            onSubmit={handleConfirmPayment}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-emerald-700" />
                  <span>Terima Pembayaran Tagihan Santri</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{payModalItem.judulTagihan}</p>
              </div>
              <button
                type="button"
                onClick={() => setPayModalItem(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Tagihan:</span>
                <span className="font-bold tabular-nums">{fmtRp(payModalItem.nominalTagihan)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sudah Dibayar:</span>
                <span className="font-bold tabular-nums text-emerald-700">
                  {fmtRp(payModalItem.nominalTerbayar)}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1">
                <span className="font-bold text-slate-800">Sisa Kekurangan:</span>
                <span className="font-extrabold tabular-nums text-rose-700">
                  {fmtRp(Math.max(0, payModalItem.nominalTagihan - payModalItem.nominalTerbayar))}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nominal Bayar / Cicilan (Rp)</label>
                <input
                  type="number"
                  min={1000}
                  max={Math.max(1000, payModalItem.nominalTagihan - payModalItem.nominalTerbayar)}
                  required
                  value={payNominal}
                  onChange={(e) => setPayNominal(Number(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-extrabold tabular-nums text-sm text-emerald-950"
                />
                <div className="flex gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setPayNominal(
                        Math.max(0, payModalItem.nominalTagihan - payModalItem.nominalTerbayar)
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-[11px]"
                  >
                    Lunasi Sisa 100%
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPayNominal(
                        Math.round(
                          Math.max(0, payModalItem.nominalTagihan - payModalItem.nominalTerbayar) / 2
                        )
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]"
                  >
                    Cicil 50%
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Metode Pembayaran</label>
                <select
                  value={payMetode}
                  onChange={(e) => setPayMetode(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-semibold"
                >
                  <option value="Tunai Loket Bendahara">Tunai Loket Bendahara</option>
                  <option value="Transfer Bank BSI">Transfer Bank Syariah Indonesia (BSI)</option>
                  <option value="QRIS Pondok">QRIS Resmi PP NU Darussalam</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Pelunasan oleh wali saat sambangan..."
                  value={payCatatan}
                  onChange={(e) => setPayCatatan(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPayModalItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Simpan Pembayaran &amp; Posting Kas</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
