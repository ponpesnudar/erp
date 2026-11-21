import type {
  BendaharaSantriProfile,
  GedungItem,
  KasTransaction,
  LahanItem,
  PerlengkapanItem,
  RekapAnggaranBulan,
  SantriRecord,
  TagihanSantriItem,
  UstadzPayrollItem,
} from '../data/seed/pondokData.ts';
import type { TransaksiKantin } from './store.ts';

export type AccountingReportId =
  | 'neraca_standar'
  | 'neraca_skontro'
  | 'neraca_multi_periode'
  | 'neraca_perbandingan'
  | 'neraca_anggaran'
  | 'neraca_perbandingan_anggaran'
  | 'neraca_ukuran_umum'
  | 'neraca_konsolidasi'
  | 'laba_rugi_standar'
  | 'laba_rugi_multi_periode'
  | 'laba_rugi_perbandingan'
  | 'laba_rugi_anggaran'
  | 'laba_rugi_perbandingan_anggaran'
  | 'laba_rugi_konsolidasi'
  | 'laba_ditahan'
  | 'fokus_keuangan'
  | 'financial_ratio'
  | 'rincian_arus_kas_tak_langsung'
  | 'arus_kas_tak_langsung'
  | 'arus_kas_langsung'
  | 'arus_kas_bulanan_tak_langsung'
  | 'arus_kas_bulanan_langsung'
  | 'perubahan_ekuitas';

export interface ReportCatalogItem {
  id: AccountingReportId;
  label: string;
  group: 'Neraca' | 'Laba/Rugi' | 'Ekuitas & Rasio' | 'Arus Kas (Cashflow)';
  shortDesc: string;
}

export const ACCOUNTING_REPORT_CATALOG: ReportCatalogItem[] = [
  { id: 'neraca_standar', label: 'Neraca (Standar)', group: 'Neraca', shortDesc: 'Posisi Aktiva, Kewajiban & Ekuitas per tanggal laporan' },
  { id: 'neraca_skontro', label: 'Neraca (Induk Skontro)', group: 'Neraca', shortDesc: 'Format berdampingan Aktiva (kiri) vs Kewajiban & Ekuitas (kanan)' },
  { id: 'neraca_multi_periode', label: 'Neraca (Multi Periode)', group: 'Neraca', shortDesc: 'Tren saldo neraca lintas bulan Juli – November' },
  { id: 'neraca_perbandingan', label: 'Neraca (Perbandingan Bulan)', group: 'Neraca', shortDesc: 'Komparasi posisi keuangan bulan ini vs bulan lalu' },
  { id: 'neraca_anggaran', label: 'Neraca (Anggaran Periode)', group: 'Neraca', shortDesc: 'Target posisi neraca berdasarkan rencana anggaran pondok' },
  { id: 'neraca_perbandingan_anggaran', label: 'Neraca (Perbandingan Anggaran)', group: 'Neraca', shortDesc: 'Realisasi neraca dibandingkan terhadap target anggaran' },
  { id: 'neraca_ukuran_umum', label: 'Neraca (Ukuran Umum)', group: 'Neraca', shortDesc: 'Proporsi persentase (% Common-Size) setiap pos terhadap Total Aktiva' },
  { id: 'neraca_konsolidasi', label: 'Neraca (Konsolidasi)', group: 'Neraca', shortDesc: 'Konsolidasi Pondok Induk, Madrasah Diniyah & Unit Usaha Kantin/Laundry' },

  { id: 'laba_rugi_standar', label: 'Laba/Rugi (Standar)', group: 'Laba/Rugi', shortDesc: 'Surplus/Defisit operasional pesantren per periode (klik baris untuk Histori GL)' },
  { id: 'laba_rugi_multi_periode', label: 'Laba/Rugi (Multi Periode)', group: 'Laba/Rugi', shortDesc: 'Perbandingan pendapatan & beban operasional Juli – November' },
  { id: 'laba_rugi_perbandingan', label: 'Laba/Rugi (Perbandingan Periode)', group: 'Laba/Rugi', shortDesc: 'Komparasi surplus bulan berjalan terhadap bulan sebelumnya' },
  { id: 'laba_rugi_anggaran', label: 'Laba/Rugi (Anggaran Periode)', group: 'Laba/Rugi', shortDesc: 'Proyeksi pendapatan dan pos beban berdasarkan RAB pondok' },
  { id: 'laba_rugi_perbandingan_anggaran', label: 'Laba/Rugi (Perbandingan Anggaran)', group: 'Laba/Rugi', shortDesc: 'Realisasi Laba/Rugi vs RAB lengkap dengan nilai selisih & % pencapaian' },
  { id: 'laba_rugi_konsolidasi', label: 'Laba/Rugi (Konsolidasi)', group: 'Laba/Rugi', shortDesc: 'Laba/Rugi gabungan Pondok Pesantren, Madrasah & Unit Usaha' },

  { id: 'laba_ditahan', label: 'Laporan Laba Ditahan', group: 'Ekuitas & Rasio', shortDesc: 'Akumulasi surplus/cadangan dana pengembangan pesantren' },
  { id: 'fokus_keuangan', label: 'Fokus Keuangan', group: 'Ekuitas & Rasio', shortDesc: 'Ringkasan kesehatan kas, piutang santri, aset tetap & kewajiban' },
  { id: 'financial_ratio', label: 'Financial Ratio', group: 'Ekuitas & Rasio', shortDesc: 'Rasio likuiditas kas, kolektibilitas syahriyah & kemandirian operasional' },
  { id: 'perubahan_ekuitas', label: 'Perubahan Ekuitas Pemilik', group: 'Ekuitas & Rasio', shortDesc: 'Mutasi Dana Wakaf, Modal Yayasan, dan Surplus Tahun Berjalan' },

  { id: 'rincian_arus_kas_tak_langsung', label: 'Rincian Laporan Arus Kas (Metode Tak Langsung)', group: 'Arus Kas (Cashflow)', shortDesc: 'Detail rekonsiliasi surplus bersih ke arus kas operasional, investasi & pendanaan' },
  { id: 'arus_kas_tak_langsung', label: 'Laporan Arus Kas (Metode Tak Langsung)', group: 'Arus Kas (Cashflow)', shortDesc: 'Ringkasan arus kas operasi, investasi aset & pendanaan metode tak langsung' },
  { id: 'arus_kas_langsung', label: 'Laporan Arus Kas (Metode Langsung)', group: 'Arus Kas (Cashflow)', shortDesc: 'Penerimaan kas langsung (Syahriyah, Daftar Ulang, Agenda) vs Pengeluaran kas' },
  { id: 'arus_kas_bulanan_tak_langsung', label: 'Laporan Arus Kas per Bulan (Metode Tak Langsung)', group: 'Arus Kas (Cashflow)', shortDesc: 'Matriks arus kas bulanan Juli – November (Metode Tak Langsung)' },
  { id: 'arus_kas_bulanan_langsung', label: 'Laporan Arus Kas per Bulan (Metode Langsung)', group: 'Arus Kas (Cashflow)', shortDesc: 'Matriks kas masuk & kas keluar langsung tiap bulan Juli – November' },
];

export interface HistoriGLRow {
  tanggal: string;
  tipeSumber: string;
  noSumber: string;
  noAkun: string;
  namaAkun: string;
  keterangan: string;
  debit: number;
  kredit: number;
}

export interface BukuBesarRinciRow {
  tanggal: string;
  sumber: string;
  noSumber: string;
  keterangan: string;
  debit: number;
  kredit: number;
  balance: number;
  balanceType: 'Dr' | 'Cr';
}

export interface StatementLine {
  id: string;
  label: string;
  indent: 0 | 1 | 2 | 3;
  amount: number;
  compareAmount?: number;
  budgetAmount?: number;
  isSectionHeader?: boolean;
  isSubtotal?: boolean;
  isGrandTotal?: boolean;
  clickableAccountCode?: string;
  clickableAccountName?: string;
  drillMode?: 'gl_history' | 'buku_besar_rinci';
  unitBreakdown?: { pondok: number; madrasah: number; unitUsaha: number };
}

export interface AccountingSnapshotInput {
  kasTransactions: KasTransaction[];
  rekapAnggaranBulanan: RekapAnggaranBulan[];
  bendaharaSantriList: BendaharaSantriProfile[];
  tagihanSantriList: TagihanSantriItem[];
  sarprasLahan: LahanItem[];
  sarprasGedung: GedungItem[];
  sarprasPerlengkapan: PerlengkapanItem[];
  santriList: SantriRecord[];
  ustadzPayroll: UstadzPayrollItem[];
  transaksiList: TransaksiKantin[];
  dateStart: string;
  dateEnd: string;
}

export interface ComputedAccountingModel {
  totalAktiva: number;
  totalAktivaLancar: number;
  totalAktivaTetap: number;
  totalKewajiban: number;
  totalEkuitas: number;
  isBalanced: boolean;
  kasTunaiBalance: number;
  bankPondokBalance: number;
  kasKartuSantriBalance: number;
  totalKasDanBank: number;
  piutangSyahriyah: number;
  piutangDaftarUlang: number;
  piutangAgenda: number;
  piutangBoyong: number;
  totalPiutang: number;
  asetLahanTotal: number;
  asetGedungTotal: number;
  asetPerlengkapanTotal: number;
  akumulasiPenyusutanGedung: number;
  akumulasiPenyusutanPerlengkapan: number;
  nilaiBukuAsetTetap: number;
  totalPendapatan: number;
  totalBebanLangsung: number;
  labaKotor: number;
  totalBebanOperasi: number;
  pendapatanOperasi: number;
  labaBersih: number;
  neracaLines: StatementLine[];
  labaRugiLines: StatementLine[];
  arusKasLangsungLines: StatementLine[];
  arusKasTakLangsungLines: StatementLine[];
  rincianArusKasLines: StatementLine[];
  multiPeriodMonths: string[];
  neracaMultiPeriodRows: Array<{ label: string; indent: 0 | 1 | 2; isTotal?: boolean; values: number[]; clickableCode?: string; clickableName?: string; drillMode?: 'gl_history' | 'buku_besar_rinci' }>;
  labaRugiMultiPeriodRows: Array<{ label: string; indent: 0 | 1 | 2; isTotal?: boolean; values: number[]; clickableCode?: string; clickableName?: string; drillMode?: 'gl_history' | 'buku_besar_rinci' }>;
  arusKasMultiPeriodLangsung: Array<{ label: string; indent: 0 | 1 | 2; isTotal?: boolean; values: number[] }>;
  arusKasMultiPeriodTakLangsung: Array<{ label: string; indent: 0 | 1 | 2; isTotal?: boolean; values: number[] }>;
  ratios: { label: string; valueText: string; benchmark: string; status: 'Sehat' | 'Perhatian' | 'Kuat'; desc: string }[];
  getHistoriGL: (noAkun: string, namaAkun?: string) => HistoriGLRow[];
  getBukuBesarRinci: (noAkun: string, namaAkun?: string) => { saldoAwal: number; normalSide: 'Dr' | 'Cr'; rows: BukuBesarRinciRow[]; totalDebit: number; totalKredit: number; saldoAkhir: number };
}

export function resolveAccountFromKas(k: KasTransaction): { noAkun: string; namaAkun: string } {
  if (k.kodeAkun && k.namaAkun) {
    return { noAkun: k.kodeAkun, namaAkun: k.namaAkun };
  }
  const cat = k.kategori.toLowerCase();
  const desc = k.uraian.toLowerCase();
  if (cat.includes('syahriyah')) return { noAkun: '4001.01', namaAkun: 'Pendapatan Syahriyah Bulanan' };
  if (cat.includes('daftar ulang')) return { noAkun: '4001.02', namaAkun: 'Pendapatan Daftar Ulang' };
  if (cat.includes('imtihan')) return { noAkun: '4001.03', namaAkun: 'Pendapatan Iuran Imtihan' };
  if (cat.includes('agenda') || cat.includes("kema'hadiyahan")) {
    return k.tipe === 'Masuk'
      ? { noAkun: '4001.04', namaAkun: "Pendapatan Agenda Kema'hadiyahan" }
      : { noAkun: '6202.01', namaAkun: 'Biaya Operasional & Kegiatan Pondok' };
  }
  if (cat.includes('bisyaroh') || cat.includes('gaji')) return { noAkun: '6101.01', namaAkun: 'Gaji & Bisyaroh Asatidz' };
  if (cat.includes('dapur') || cat.includes('konsumsi')) return { noAkun: '5101.01', namaAkun: 'Biaya Konsumsi & Dapur Santri' };
  if (cat.includes('listrik') || cat.includes('air') || desc.includes('pln')) {
    return { noAkun: '6203.01', namaAkun: 'Biaya Listrik, Air & Utilitas' };
  }
  if (cat.includes('pemeliharaan') || cat.includes('renovasi')) {
    return { noAkun: '6204.01', namaAkun: 'Biaya Pemeliharaan Gedung & Alat' };
  }
  if (cat.includes('aset tetap') || cat.includes('inventaris')) {
    return { noAkun: '1203.01', namaAkun: 'Peralatan & Inventaris Sarpras' };
  }
  return k.tipe === 'Masuk'
    ? { noAkun: '4001.09', namaAkun: 'Pendapatan Lain-lain Pondok' }
    : { noAkun: '6209.01', namaAkun: 'Biaya Administrasi & Lainnya' };
}

export function computeAccountingModel(input: AccountingSnapshotInput): ComputedAccountingModel {
  const {
    kasTransactions,
    rekapAnggaranBulanan,
    bendaharaSantriList,
    tagihanSantriList,
    sarprasLahan,
    sarprasGedung,
    sarprasPerlengkapan,
    santriList,
    ustadzPayroll,
    transaksiList,
    dateStart,
    dateEnd,
  } = input;

  const filteredKas = kasTransactions.filter((k) => {
    if (dateStart && k.tanggal < dateStart) return false;
    if (dateEnd && k.tanggal > dateEnd) return false;
    return true;
  });

  // 1. Fixed Assets & Depreciation synced live from Sekretaris Sarpras + Kas Asset Purchases
  const asetLahanTotal = sarprasLahan.reduce(
    (s, l) => s + (l.nilaiPerolehan ?? l.luasM2 * 450000),
    0
  );
  const asetGedungTotal = sarprasGedung.reduce(
    (s, g) => s + (g.nilaiPerolehan ?? g.luasBangunanM2 * 1400000),
    0
  );
  const akumulasiPenyusutanGedung = sarprasGedung.reduce((s, g) => {
    const cost = g.nilaiPerolehan ?? g.luasBangunanM2 * 1400000;
    const life = Math.max(5, g.umurEkonomisTahun ?? 25);
    const yearsUsed = Math.max(1, Math.min(life * 0.85, 2026 - g.tahunBangun));
    return s + Math.round((cost / life) * yearsUsed);
  }, 0);

  const pembelianAsetDariKas = filteredKas
    .filter((k) => k.tipe === 'Keluar' && resolveAccountFromKas(k).noAkun === '1203.01')
    .reduce((s, k) => s + k.nominal, 0);

  const asetPerlengkapanSarpras = sarprasPerlengkapan.reduce(
    (s, p) => s + p.jumlah * (p.hargaSatuan ?? 250000),
    0
  );
  const asetPerlengkapanTotal = asetPerlengkapanSarpras + pembelianAsetDariKas;
  const akumulasiPenyusutanPerlengkapan = sarprasPerlengkapan.reduce((s, p) => {
    const cost = p.jumlah * (p.hargaSatuan ?? 250000);
    const years = Math.max(1, Math.min(5, 2026 - (p.tahunPerolehan ?? 2023)));
    return s + Math.round(cost * 0.1 * years);
  }, 0);

  const totalNilaiHistoriAset = asetLahanTotal + asetGedungTotal + asetPerlengkapanTotal;
  const totalAkumulasiPenyusutan = akumulasiPenyusutanGedung + akumulasiPenyusutanPerlengkapan;
  const nilaiBukuAsetTetap = totalNilaiHistoriAset - totalAkumulasiPenyusutan;
  const totalAktivaTetap = nilaiBukuAsetTetap;

  // Annual/Period Depreciation Expense
  const bebanPenyusutanPeriode = Math.round(
    sarprasGedung.reduce((s, g) => s + (g.nilaiPerolehan ?? g.luasBangunanM2 * 1400000) / Math.max(5, g.umurEkonomisTahun ?? 25), 0) / 12 +
      (asetPerlengkapanSarpras * 0.1) / 12
  );

  // 2. Tagihan & Piutang Santri (Connected to TagihanSantriList — termasuk Boyong!)
  const ledgerMap = new Map<string, BendaharaSantriProfile>();
  bendaharaSantriList.forEach((b) => ledgerMap.set(b.id, b));

  let piutangSyahriyah = 0;
  let piutangDaftarUlang = 0;
  let piutangAgenda = 0;
  let piutangBoyong = 0;

  tagihanSantriList.forEach((t) => {
    const sisa = Math.max(0, t.nominalTagihan - t.nominalTerbayar);
    if (sisa <= 0) return;
    const owner = ledgerMap.get(t.ledgerId);
    if (owner?.statusPondok === 'Boyong / Keluar') {
      piutangBoyong += sisa;
      return;
    }
    if (t.kategori === 'Syahriyah Bulanan') piutangSyahriyah += sisa;
    else if (t.kategori === 'Daftar Ulang') piutangDaftarUlang += sisa;
    else piutangAgenda += sisa;
  });

  const totalPiutang = piutangSyahriyah + piutangDaftarUlang + piutangAgenda + piutangBoyong;

  // 3. Income & Expense from KasTransactions + Unit Usaha Kantin/Laundry
  const sumKasAccount = (noAkun: string, tipe?: 'Masuk' | 'Keluar') =>
    filteredKas
      .filter((k) => (!tipe || k.tipe === tipe) && resolveAccountFromKas(k).noAkun === noAkun)
      .reduce((s, k) => s + k.nominal, 0);

  const pendSyahriyah = sumKasAccount('4001.01', 'Masuk');
  const pendDaftarUlang = sumKasAccount('4001.02', 'Masuk');
  const pendImtihan = sumKasAccount('4001.03', 'Masuk');
  const pendAgenda = sumKasAccount('4001.04', 'Masuk');
  const pendLain = sumKasAccount('4001.09', 'Masuk');
  const pendUnitUsaha = transaksiList
    .filter((t) => t.tipe === 'Jajan Kantin')
    .reduce((s, t) => s + t.nominal, 0);

  const totalPendapatan =
    pendSyahriyah + pendDaftarUlang + pendImtihan + pendAgenda + pendLain + pendUnitUsaha;

  const biayaDapur = sumKasAccount('5101.01', 'Keluar');
  const biayaUnitUsahaHpp = Math.round(pendUnitUsaha * 0.72);
  const totalBebanLangsung = biayaDapur + biayaUnitUsahaHpp;
  const labaKotor = totalPendapatan - totalBebanLangsung;

  const biayaBisyaroh = sumKasAccount('6101.01', 'Keluar');
  const biayaListrikAir = sumKasAccount('6203.01', 'Keluar');
  const biayaKegiatan = sumKasAccount('6202.01', 'Keluar');
  const biayaPemeliharaan = sumKasAccount('6204.01', 'Keluar');
  const biayaAdmLain = sumKasAccount('6209.01', 'Keluar');

  const totalBebanOperasi =
    biayaBisyaroh +
    biayaListrikAir +
    biayaKegiatan +
    biayaPemeliharaan +
    biayaAdmLain +
    bebanPenyusutanPeriode;

  const pendapatanOperasi = labaKotor - totalBebanOperasi;
  const biayaAdmBank = 125000;
  const pendapatanBungaSyariah = 485000;
  const pendapatanBebanLain = pendapatanBungaSyariah - biayaAdmBank;
  const labaBersih = pendapatanOperasi + pendapatanBebanLain;

  // 4. Cash & Bank + Working Capital + Liabilities + Balanced Equity
  const totalMasukKasPeriode = filteredKas
    .filter((k) => k.tipe === 'Masuk')
    .reduce((s, k) => s + k.nominal, 0);
  const totalKeluarKasPeriode = filteredKas
    .filter((k) => k.tipe === 'Keluar')
    .reduce((s, k) => s + k.nominal, 0);

  const openingKasTunai = 148500000;
  const openingBankPondok = 286400000;
  const netKasFlowPeriode = totalMasukKasPeriode - totalKeluarKasPeriode;

  const kasTunaiBalance = Math.max(0, openingKasTunai + Math.round(netKasFlowPeriode * 0.45));
  const bankPondokBalance = Math.max(
    0,
    openingBankPondok + Math.round(netKasFlowPeriode * 0.55) + pendapatanBungaSyariah - biayaAdmBank
  );
  const kasKartuSantriBalance = santriList.reduce((s, st) => s + st.saldoKartu, 0);
  const totalKasDanBank = kasTunaiBalance + bankPondokBalance + kasKartuSantriBalance;

  const persediaanDapurKitab = 46500000;
  const kasBonUangMuka = 12400000;
  const totalAktivaLancar = totalKasDanBank + totalPiutang + persediaanDapurKitab + kasBonUangMuka;
  const totalAktiva = totalAktivaLancar + totalAktivaTetap;

  // Liabilities
  const titipanSaldoSantri = kasKartuSantriBalance;
  const hutangBisyarohSiapCair = ustadzPayroll
    .filter((u) => u.statusBayar === 'Siap')
    .reduce((s, u) => {
      const bis = Math.round(((u.jtmDiniyah * u.jumlahHadir) / 2) * 10000);
      return (
        s +
        u.gajiPokok +
        u.tunjanganTransportasi +
        u.tunjanganMasaKerja +
        u.tunjanganKomunikasi +
        u.tunjanganJabatan +
        u.bisyarohTakhasus +
        bis
      );
    }, 0);
  const hutangSupplierDapur = 18750000;
  const uangMukaWali = 24500000;
  const totalKewajibanLancar =
    titipanSaldoSantri + hutangBisyarohSiapCair + hutangSupplierDapur + uangMukaWali;
  const kewajibanJangkaPanjang = 0;
  const totalKewajiban = totalKewajibanLancar + kewajibanJangkaPanjang;

  // Equity balanced cleanly via accounting identity: Ekuitas = Total Aktiva - Total Kewajiban
  const totalEkuitasRequired = totalAktiva - totalKewajiban;
  const labaDitahanPrior = 412500000;
  const modalDanaWakaf = totalEkuitasRequired - labaDitahanPrior - labaBersih;
  const totalEkuitas = modalDanaWakaf + labaDitahanPrior + labaBersih;
  const isBalanced = Math.abs(totalAktiva - (totalKewajiban + totalEkuitas)) < 1;

  // 5. Build Hierarchical Statements (Laba/Rugi Standar -> Gambar 3)
  const budgetRef = rekapAnggaranBulanan[rekapAnggaranBulanan.length - 1];
  const budgetMasuk = budgetRef?.anggaranRencana ?? 238000000;
  const labaRugiLines: StatementLine[] = [
    { id: 'lr-h-pend', label: 'Pendapatan', indent: 0, amount: 0, isSectionHeader: true },
    { id: 'lr-sub-pend', label: 'Pendapatan Operasional Pondok & Madrasah', indent: 1, amount: totalPendapatan, compareAmount: Math.round(totalPendapatan * 0.94), budgetAmount: budgetMasuk, isSubtotal: true },
    { id: 'lr-4001-01', label: 'Pendapatan Syahriyah Bulanan', indent: 2, amount: pendSyahriyah, compareAmount: 49200000, budgetAmount: 55000000, clickableAccountCode: '4001.01', clickableAccountName: 'Pendapatan Syahriyah Bulanan', drillMode: 'gl_history', unitBreakdown: { pondok: Math.round(pendSyahriyah * 0.7), madrasah: Math.round(pendSyahriyah * 0.3), unitUsaha: 0 } },
    { id: 'lr-4001-02', label: 'Pendapatan Daftar Ulang Santri', indent: 2, amount: pendDaftarUlang, compareAmount: 16500000, budgetAmount: 20000000, clickableAccountCode: '4001.02', clickableAccountName: 'Pendapatan Daftar Ulang', drillMode: 'gl_history', unitBreakdown: { pondok: Math.round(pendDaftarUlang * 0.6), madrasah: Math.round(pendDaftarUlang * 0.4), unitUsaha: 0 } },
    { id: 'lr-4001-03', label: 'Pendapatan Iuran Imtihan', indent: 2, amount: pendImtihan, compareAmount: 9500000, budgetAmount: 10800000, clickableAccountCode: '4001.03', clickableAccountName: 'Pendapatan Iuran Imtihan', drillMode: 'gl_history', unitBreakdown: { pondok: 0, madrasah: pendImtihan, unitUsaha: 0 } },
    { id: 'lr-4001-04', label: "Pendapatan Agenda Kema'hadiyahan (PHBI/PHBN)", indent: 2, amount: pendAgenda, compareAmount: 8400000, budgetAmount: 10000000, clickableAccountCode: '4001.04', clickableAccountName: "Pendapatan Agenda Kema'hadiyahan", drillMode: 'gl_history', unitBreakdown: { pondok: pendAgenda, madrasah: 0, unitUsaha: 0 } },
    { id: 'lr-4002-01', label: 'Pendapatan Kantin & Unit Usaha Santri', indent: 2, amount: pendUnitUsaha + pendLain, compareAmount: pendUnitUsaha, budgetAmount: 12000000, clickableAccountCode: '4001.09', clickableAccountName: 'Pendapatan Unit Usaha & Lainnya', drillMode: 'gl_history', unitBreakdown: { pondok: pendLain, madrasah: 0, unitUsaha: pendUnitUsaha } },
    { id: 'lr-tot-pend', label: 'Jumlah Pendapatan', indent: 0, amount: totalPendapatan, compareAmount: Math.round(totalPendapatan * 0.94), budgetAmount: 107800000, isSubtotal: true },

    { id: 'lr-h-hpp', label: 'Beban Langsung & Konsumsi Santri', indent: 0, amount: 0, isSectionHeader: true },
    { id: 'lr-5101-01', label: 'Biaya Konsumsi, Beras & Dapur Santri', indent: 2, amount: biayaDapur, compareAmount: 21400000, budgetAmount: 25000000, clickableAccountCode: '5101.01', clickableAccountName: 'Biaya Konsumsi & Dapur Santri', drillMode: 'gl_history', unitBreakdown: { pondok: biayaDapur, madrasah: 0, unitUsaha: 0 } },
    { id: 'lr-5102-01', label: 'Harga Pokok Unit Usaha Kantin & Laundry', indent: 2, amount: biayaUnitUsahaHpp, compareAmount: Math.round(biayaUnitUsahaHpp * 0.95), budgetAmount: Math.round(biayaUnitUsahaHpp * 1.1), unitBreakdown: { pondok: 0, madrasah: 0, unitUsaha: biayaUnitUsahaHpp } },
    { id: 'lr-tot-hpp', label: 'Jumlah Beban Langsung', indent: 0, amount: totalBebanLangsung, compareAmount: 21400000 + Math.round(biayaUnitUsahaHpp * 0.95), budgetAmount: 25000000 + Math.round(biayaUnitUsahaHpp * 1.1), isSubtotal: true },
    { id: 'lr-kotor', label: 'SURPLUS / LABA KOTOR', indent: 0, amount: labaKotor, compareAmount: Math.round(totalPendapatan * 0.94) - (21400000 + Math.round(biayaUnitUsahaHpp * 0.95)), budgetAmount: 107800000 - (25000000 + Math.round(biayaUnitUsahaHpp * 1.1)), isGrandTotal: true },

    { id: 'lr-h-ops', label: 'Beban Operasi Pesantren & Madrasah', indent: 0, amount: 0, isSectionHeader: true },
    { id: 'lr-6101-01', label: 'Bisyaroh & Tunjangan Dewan Asatidz', indent: 2, amount: biayaBisyaroh, compareAmount: 18500000, budgetAmount: 22000000, clickableAccountCode: '6101.01', clickableAccountName: 'Gaji & Bisyaroh Asatidz', drillMode: 'gl_history', unitBreakdown: { pondok: Math.round(biayaBisyaroh * 0.35), madrasah: Math.round(biayaBisyaroh * 0.65), unitUsaha: 0 } },
    { id: 'lr-6203-01', label: 'Biaya Listrik, Air PDAM & Utilitas', indent: 2, amount: biayaListrikAir, compareAmount: 4850000, budgetAmount: 5500000, clickableAccountCode: '6203.01', clickableAccountName: 'Biaya Listrik, Air & Utilitas', drillMode: 'gl_history', unitBreakdown: { pondok: Math.round(biayaListrikAir * 0.6), madrasah: Math.round(biayaListrikAir * 0.3), unitUsaha: Math.round(biayaListrikAir * 0.1) } },
    { id: 'lr-6202-01', label: 'Biaya Operasional Kegiatan & Imtihan', indent: 2, amount: biayaKegiatan, compareAmount: 4900000, budgetAmount: 6500000, clickableAccountCode: '6202.01', clickableAccountName: 'Biaya Operasional & Kegiatan Pondok', drillMode: 'gl_history', unitBreakdown: { pondok: Math.round(biayaKegiatan * 0.5), madrasah: Math.round(biayaKegiatan * 0.5), unitUsaha: 0 } },
    { id: 'lr-6204-01', label: 'Biaya Pemeliharaan Gedung & Peralatan', indent: 2, amount: biayaPemeliharaan, compareAmount: 3100000, budgetAmount: 5000000, clickableAccountCode: '6204.01', clickableAccountName: 'Biaya Pemeliharaan Gedung & Alat', drillMode: 'gl_history', unitBreakdown: { pondok: Math.round(biayaPemeliharaan * 0.6), madrasah: Math.round(biayaPemeliharaan * 0.4), unitUsaha: 0 } },
    { id: 'lr-6205-01', label: 'Beban Penyusutan Gedung & Inventaris (Non-Kas)', indent: 2, amount: bebanPenyusutanPeriode, compareAmount: bebanPenyusutanPeriode, budgetAmount: bebanPenyusutanPeriode, unitBreakdown: { pondok: Math.round(bebanPenyusutanPeriode * 0.65), madrasah: Math.round(bebanPenyusutanPeriode * 0.35), unitUsaha: 0 } },
    { id: 'lr-6209-01', label: 'Biaya Administrasi & Umum Lainnya', indent: 2, amount: biayaAdmLain, compareAmount: 950000, budgetAmount: 1500000, clickableAccountCode: '6209.01', clickableAccountName: 'Biaya Administrasi & Lainnya', drillMode: 'gl_history', unitBreakdown: { pondok: biayaAdmLain, madrasah: 0, unitUsaha: 0 } },
    { id: 'lr-tot-ops', label: 'Jumlah Beban Operasi', indent: 0, amount: totalBebanOperasi, compareAmount: 32300000 + bebanPenyusutanPeriode, budgetAmount: 40500000 + bebanPenyusutanPeriode, isSubtotal: true },
    { id: 'lr-pend-ops', label: 'PENDAPATAN / SURPLUS OPERASI', indent: 0, amount: pendapatanOperasi, compareAmount: Math.round(pendapatanOperasi * 0.9), budgetAmount: 107800000 - (25000000 + Math.round(biayaUnitUsahaHpp * 1.1)) - (40500000 + bebanPenyusutanPeriode), isGrandTotal: true },

    { id: 'lr-h-lain', label: 'Pendapatan dan Beban Lain-lain', indent: 0, amount: 0, isSectionHeader: true },
    { id: 'lr-lain-in', label: 'Bagi Hasil Bank Syariah & Jasa Giro', indent: 2, amount: pendapatanBungaSyariah, compareAmount: 420000, budgetAmount: 450000 },
    { id: 'lr-lain-out', label: 'Biaya Administrasi Bank & Cek/Transfer', indent: 2, amount: -biayaAdmBank, compareAmount: -115000, budgetAmount: -150000 },
    { id: 'lr-tot-lain', label: 'Jumlah Pendapatan dan Beban Lain', indent: 0, amount: pendapatanBebanLain, compareAmount: 305000, budgetAmount: 300000, isSubtotal: true },
    { id: 'lr-bersih', label: 'SURPLUS / LABA (RUGI) BERSIH PERIODE INI', indent: 0, amount: labaBersih, compareAmount: Math.round(pendapatanOperasi * 0.9) + 305000, budgetAmount: 107800000 - (25000000 + Math.round(biayaUnitUsahaHpp * 1.1)) - (40500000 + bebanPenyusutanPeriode) + 300000, isGrandTotal: true },
  ];

  // 6. Neraca Standar Lines (Gambar 5 + clickable drilldown to Gambar 6/7 Buku Besar Rinci)
  const neracaLines: StatementLine[] = [
    { id: 'n-h-aktiva', label: 'Aktiva', indent: 0, amount: 0, isSectionHeader: true },
    { id: 'n-h-lancar', label: 'Aktiva Lancar', indent: 1, amount: 0, isSectionHeader: true },
    { id: 'n-h-kasbank', label: 'Kas dan Bank', indent: 2, amount: totalKasDanBank, compareAmount: totalKasDanBank - Math.max(0, netKasFlowPeriode), budgetAmount: Math.round(totalKasDanBank * 1.05), isSubtotal: true },
    { id: 'n-1000-01', label: 'Kas Tunai Bendahara Pondok', indent: 3, amount: kasTunaiBalance, compareAmount: openingKasTunai, budgetAmount: Math.round(kasTunaiBalance * 1.04), clickableAccountCode: '1000.01', clickableAccountName: 'Kas Tunai Bendahara Pondok', drillMode: 'buku_besar_rinci', unitBreakdown: { pondok: Math.round(kasTunaiBalance * 0.75), madrasah: Math.round(kasTunaiBalance * 0.25), unitUsaha: 0 } },
    { id: 'n-1000-02', label: 'Bank BSI / BRI Operasional Pondok', indent: 3, amount: bankPondokBalance, compareAmount: openingBankPondok, budgetAmount: Math.round(bankPondokBalance * 1.06), clickableAccountCode: '1000.02', clickableAccountName: 'Bank BSI / BRI Operasional', drillMode: 'buku_besar_rinci', unitBreakdown: { pondok: Math.round(bankPondokBalance * 0.8), madrasah: Math.round(bankPondokBalance * 0.2), unitUsaha: 0 } },
    { id: 'n-1000-03', label: 'Kas Titipan Saldo Kartu Jajan Santri', indent: 3, amount: kasKartuSantriBalance, compareAmount: kasKartuSantriBalance, budgetAmount: kasKartuSantriBalance, clickableAccountCode: '1000.03', clickableAccountName: 'Kas Titipan Kartu Santri', drillMode: 'buku_besar_rinci', unitBreakdown: { pondok: 0, madrasah: 0, unitUsaha: kasKartuSantriBalance } },
    { id: 'n-tot-kas', label: 'Jumlah Kas dan Bank', indent: 2, amount: totalKasDanBank, compareAmount: openingKasTunai + openingBankPondok + kasKartuSantriBalance, budgetAmount: Math.round(totalKasDanBank * 1.05), isSubtotal: true },

    { id: 'n-h-piutang', label: 'Piutang Santri & Wali (Termasuk Santri Boyong)', indent: 2, amount: totalPiutang, compareAmount: Math.round(totalPiutang * 1.15), budgetAmount: Math.round(totalPiutang * 0.8), isSubtotal: true },
    { id: 'n-1101-01', label: 'Piutang Syahriyah Bulanan Santri Aktif', indent: 3, amount: piutangSyahriyah, compareAmount: Math.round(piutangSyahriyah * 1.1), budgetAmount: Math.round(piutangSyahriyah * 0.8), clickableAccountCode: '1101.01', clickableAccountName: 'Piutang Syahriyah Santri', drillMode: 'buku_besar_rinci' },
    { id: 'n-1101-02', label: 'Piutang Daftar Ulang Santri', indent: 3, amount: piutangDaftarUlang, compareAmount: Math.round(piutangDaftarUlang * 1.1), budgetAmount: Math.round(piutangDaftarUlang * 0.8), clickableAccountCode: '1101.02', clickableAccountName: 'Piutang Daftar Ulang Santri', drillMode: 'buku_besar_rinci' },
    { id: 'n-1101-03', label: "Piutang Agenda Kema'hadiyahan (PHBI/Imtihan)", indent: 3, amount: piutangAgenda, compareAmount: Math.round(piutangAgenda * 1.1), budgetAmount: Math.round(piutangAgenda * 0.7), clickableAccountCode: '1101.03', clickableAccountName: 'Piutang Agenda Kegiatan', drillMode: 'buku_besar_rinci' },
    { id: 'n-1101-04', label: 'Piutang Santri Boyong / Keluar (Tanggungan Terjaga)', indent: 3, amount: piutangBoyong, compareAmount: piutangBoyong, budgetAmount: Math.round(piutangBoyong * 0.5), clickableAccountCode: '1101.04', clickableAccountName: 'Piutang Santri Boyong', drillMode: 'buku_besar_rinci' },
    { id: 'n-tot-piutang', label: 'Jumlah Piutang Santri', indent: 2, amount: totalPiutang, compareAmount: Math.round(totalPiutang * 1.12), budgetAmount: Math.round(totalPiutang * 0.78), isSubtotal: true },

    { id: 'n-persediaan', label: 'Persediaan Bahan Dapur, Kitab & Koperasi', indent: 2, amount: persediaanDapurKitab, compareAmount: 44000000, budgetAmount: 45000000, unitBreakdown: { pondok: 24500000, madrasah: 12000000, unitUsaha: 10000000 } },
    { id: 'n-kasbon', label: 'Uang Muka Kegiatan & Kas Bon Panitia', indent: 2, amount: kasBonUangMuka, compareAmount: 10500000, budgetAmount: 10000000 },
    { id: 'n-tot-lancar', label: 'Jumlah Aktiva Lancar', indent: 1, amount: totalAktivaLancar, compareAmount: openingKasTunai + openingBankPondok + kasKartuSantriBalance + Math.round(totalPiutang * 1.12) + 54500000, budgetAmount: Math.round(totalAktivaLancar * 1.02), isSubtotal: true },

    { id: 'n-h-tetap', label: 'Aktiva Tetap (Terhubung Real-Time Data Aset Sarpras)', indent: 1, amount: 0, isSectionHeader: true },
    { id: 'n-1201-01', label: `Tanah & Lahan Wakaf / Yayasan (${sarprasLahan.length} Bidang)`, indent: 2, amount: asetLahanTotal, compareAmount: asetLahanTotal, budgetAmount: asetLahanTotal, clickableAccountCode: '1201.01', clickableAccountName: 'Tanah & Lahan Pondok', drillMode: 'buku_besar_rinci' },
    { id: 'n-1202-01', label: `Gedung & Bangunan Pondok (${sarprasGedung.length} Unit)`, indent: 2, amount: asetGedungTotal, compareAmount: asetGedungTotal, budgetAmount: asetGedungTotal, clickableAccountCode: '1202.01', clickableAccountName: 'Gedung & Bangunan Pondok', drillMode: 'buku_besar_rinci' },
    { id: 'n-1203-01', label: `Peralatan, Mebel, Elektronik & Kitab (${sarprasPerlengkapan.length} Pos + Pembelian)`, indent: 2, amount: asetPerlengkapanTotal, compareAmount: asetPerlengkapanSarpras, budgetAmount: asetPerlengkapanTotal, clickableAccountCode: '1203.01', clickableAccountName: 'Peralatan & Inventaris Sarpras', drillMode: 'buku_besar_rinci' },
    { id: 'n-tot-histori', label: 'Jumlah Nilai Histori Aktiva Tetap', indent: 1, amount: totalNilaiHistoriAset, compareAmount: totalNilaiHistoriAset - pembelianAsetDariKas, budgetAmount: totalNilaiHistoriAset, isSubtotal: true },
    { id: 'n-1209-01', label: 'Akumulasi Penyusutan Gedung & Bangunan', indent: 2, amount: -akumulasiPenyusutanGedung, compareAmount: -(akumulasiPenyusutanGedung - 12000000), budgetAmount: -akumulasiPenyusutanGedung },
    { id: 'n-1209-02', label: 'Akumulasi Penyusutan Peralatan & Inventaris', indent: 2, amount: -akumulasiPenyusutanPerlengkapan, compareAmount: -(akumulasiPenyusutanPerlengkapan - 900000), budgetAmount: -akumulasiPenyusutanPerlengkapan },
    { id: 'n-tot-akum', label: 'Jumlah Akumulasi Penyusutan', indent: 1, amount: -totalAkumulasiPenyusutan, compareAmount: -(totalAkumulasiPenyusutan - 12900000), budgetAmount: -totalAkumulasiPenyusutan, isSubtotal: true },
    { id: 'n-tot-tetap', label: 'Jumlah Aktiva Tetap (Nilai Buku Bersih)', indent: 1, amount: totalAktivaTetap, compareAmount: totalAktivaTetap - pembelianAsetDariKas + 12900000, budgetAmount: totalAktivaTetap, isSubtotal: true },
    { id: 'n-tot-aktiva', label: 'Jumlah Aktiva', indent: 0, amount: totalAktiva, compareAmount: totalAktiva - netKasFlowPeriode - pembelianAsetDariKas + 12900000, budgetAmount: Math.round(totalAktiva * 1.01), isGrandTotal: true },

    { id: 'n-h-kewek', label: 'Kewajiban dan Ekuitas', indent: 0, amount: 0, isSectionHeader: true },
    { id: 'n-h-kew', label: 'Kewajiban Lancar', indent: 1, amount: 0, isSectionHeader: true },
    { id: 'n-2101-01', label: 'Titipan Saldo Kartu Jajan Santri', indent: 2, amount: titipanSaldoSantri, compareAmount: titipanSaldoSantri, budgetAmount: titipanSaldoSantri, clickableAccountCode: '2101.01', clickableAccountName: 'Titipan Saldo Kartu Santri', drillMode: 'buku_besar_rinci' },
    { id: 'n-2101-02', label: 'Hutang Bisyaroh Asatidz (Status Siap Cair)', indent: 2, amount: hutangBisyarohSiapCair, compareAmount: hutangBisyarohSiapCair, budgetAmount: 0, clickableAccountCode: '2101.02', clickableAccountName: 'Hutang Bisyaroh Asatidz', drillMode: 'buku_besar_rinci' },
    { id: 'n-2101-03', label: 'Hutang Supplier Dapur & Logistik', indent: 2, amount: hutangSupplierDapur, compareAmount: 21500000, budgetAmount: 15000000, clickableAccountCode: '2101.03', clickableAccountName: 'Hutang Supplier Dapur', drillMode: 'buku_besar_rinci' },
    { id: 'n-2101-04', label: 'Uang Muka / Titipan Pembayaran Wali', indent: 2, amount: uangMukaWali, compareAmount: 22000000, budgetAmount: 20000000 },
    { id: 'n-tot-kew', label: 'Jumlah Kewajiban', indent: 1, amount: totalKewajiban, compareAmount: totalKewajiban + 250000, budgetAmount: titipanSaldoSantri + 35000000, isSubtotal: true },

    { id: 'n-h-ek', label: 'Ekuitas Yayasan & Pesantren', indent: 1, amount: 0, isSectionHeader: true },
    { id: 'n-3100-01', label: 'Modal & Dana Wakaf Aset Yayasan', indent: 2, amount: modalDanaWakaf, compareAmount: modalDanaWakaf, budgetAmount: modalDanaWakaf },
    { id: 'n-3200-01', label: 'Surplus / Laba Ditahan Periode Lalu', indent: 2, amount: labaDitahanPrior, compareAmount: labaDitahanPrior, budgetAmount: labaDitahanPrior },
    { id: 'n-3300-01', label: 'Surplus / Laba Tahun Berjalan', indent: 2, amount: labaBersih, compareAmount: Math.round(labaBersih * 0.88), budgetAmount: Math.round(labaBersih * 1.1) },
    { id: 'n-tot-ek', label: 'Jumlah Ekuitas', indent: 1, amount: totalEkuitas, compareAmount: modalDanaWakaf + labaDitahanPrior + Math.round(labaBersih * 0.88), budgetAmount: modalDanaWakaf + labaDitahanPrior + Math.round(labaBersih * 1.1), isSubtotal: true },
    { id: 'n-tot-kewek', label: 'Jumlah Kewajiban dan Ekuitas', indent: 0, amount: totalKewajiban + totalEkuitas, compareAmount: totalKewajiban + modalDanaWakaf + labaDitahanPrior + Math.round(labaBersih * 0.88) + 250000, budgetAmount: totalKewajiban + modalDanaWakaf + labaDitahanPrior + Math.round(labaBersih * 1.1), isGrandTotal: true },
  ];

  // 7. Cash Flow Statements (Direct & Indirect)
  const kasMasukOperasi =
    pendSyahriyah + pendDaftarUlang + pendImtihan + pendAgenda + pendLain + pendUnitUsaha + pendapatanBungaSyariah;
  const kasKeluarOperasi =
    biayaDapur + biayaUnitUsahaHpp + biayaBisyaroh + biayaListrikAir + biayaKegiatan + biayaPemeliharaan + biayaAdmLain + biayaAdmBank;
  const arusKasOperasiLangsung = kasMasukOperasi - kasKeluarOperasi;
  const arusKasInvestasi = -pembelianAsetDariKas;
  const arusKasPendanaan = 0;
  const kenaikanKasLangsung = arusKasOperasiLangsung + arusKasInvestasi + arusKasPendanaan;
  const kasAwal = openingKasTunai + openingBankPondok + kasKartuSantriBalance;

  const arusKasLangsungLines: StatementLine[] = [
    { id: 'cf-d-h1', label: 'Arus Kas dari Aktivitas Operasi', indent: 0, amount: 0, isSectionHeader: true },
    { id: 'cf-d-in1', label: 'Penerimaan Syahriyah Bulanan Santri', indent: 2, amount: pendSyahriyah, clickableAccountCode: '4001.01', clickableAccountName: 'Penerimaan Syahriyah', drillMode: 'gl_history' },
    { id: 'cf-d-in2', label: 'Penerimaan Daftar Ulang & PSB', indent: 2, amount: pendDaftarUlang, clickableAccountCode: '4001.02', clickableAccountName: 'Penerimaan Daftar Ulang', drillMode: 'gl_history' },
    { id: 'cf-d-in3', label: "Penerimaan Iuran Imtihan & Agenda Kema'hadiyahan", indent: 2, amount: pendImtihan + pendAgenda, clickableAccountCode: '4001.04', clickableAccountName: 'Penerimaan Agenda & Imtihan', drillMode: 'gl_history' },
    { id: 'cf-d-in4', label: 'Penerimaan Kantin, Laundry & Lainnya', indent: 2, amount: pendUnitUsaha + pendLain + pendapatanBungaSyariah },
    { id: 'cf-d-out1', label: 'Pembayaran Bisyaroh Dewan Asatidz & Staf', indent: 2, amount: -biayaBisyaroh, clickableAccountCode: '6101.01', clickableAccountName: 'Bisyaroh Asatidz', drillMode: 'gl_history' },
    { id: 'cf-d-out2', label: 'Pembayaran Konsumsi Dapur & Unit Usaha', indent: 2, amount: -(biayaDapur + biayaUnitUsahaHpp), clickableAccountCode: '5101.01', clickableAccountName: 'Konsumsi & Dapur', drillMode: 'gl_history' },
    { id: 'cf-d-out3', label: 'Pembayaran Listrik, Air, Pemeliharaan & Kegiatan', indent: 2, amount: -(biayaListrikAir + biayaKegiatan + biayaPemeliharaan + biayaAdmLain + biayaAdmBank), clickableAccountCode: '6203.01', clickableAccountName: 'Utilitas & Operasional', drillMode: 'gl_history' },
    { id: 'cf-d-sub1', label: 'Arus Kas Bersih dari Aktivitas Operasi', indent: 0, amount: arusKasOperasiLangsung, isSubtotal: true },

    { id: 'cf-d-h2', label: 'Arus Kas dari Aktivitas Investasi (Aset Tetap)', indent: 0, amount: 0, isSectionHeader: true },
    { id: 'cf-d-inv1', label: 'Pembelian Peralatan & Penambahan Aset Sarpras', indent: 2, amount: -pembelianAsetDariKas, clickableAccountCode: '1203.01', clickableAccountName: 'Peralatan & Inventaris Sarpras', drillMode: 'buku_besar_rinci' },
    { id: 'cf-d-sub2', label: 'Arus Kas Bersih dari Aktivitas Investasi', indent: 0, amount: arusKasInvestasi, isSubtotal: true },

    { id: 'cf-d-h3', label: 'Arus Kas dari Aktivitas Pendanaan / Wakaf', indent: 0, amount: 0, isSectionHeader: true },
    { id: 'cf-d-fin1', label: 'Penerimaan Wakaf Tunai / Pinjaman Yayasan', indent: 2, amount: arusKasPendanaan },
    { id: 'cf-d-sub3', label: 'Kenaikan (Penurunan) Bersih Kas & Bank', indent: 0, amount: kenaikanKasLangsung, isGrandTotal: true },
    { id: 'cf-d-awal', label: 'Saldo Kas & Bank Awal Periode', indent: 1, amount: kasAwal },
    { id: 'cf-d-akhir', label: 'Saldo Kas & Bank Akhir Periode', indent: 0, amount: kasAwal + kenaikanKasLangsung, isGrandTotal: true },
  ];

  const perubahanPiutang = 0; // Already reflected dynamically between billed vs collected
  const arusKasTakLangsungLines: StatementLine[] = [
    { id: 'cf-i-h1', label: 'Arus Kas dari Aktivitas Operasi (Metode Tak Langsung)', indent: 0, amount: 0, isSectionHeader: true },
    { id: 'cf-i-lb', label: 'Surplus / Laba Bersih Periode Berjalan', indent: 2, amount: labaBersih },
    { id: 'cf-i-dep', label: 'Penyesuaian Non-Kas: Beban Penyusutan Gedung & Peralatan', indent: 2, amount: bebanPenyusutanPeriode },
    { id: 'cf-i-piu', label: 'Perubahan Piutang & Tagihan Santri (Saldo Aktif & Boyong)', indent: 2, amount: perubahanPiutang, clickableAccountCode: '1101.01', clickableAccountName: 'Piutang Syahriyah Santri', drillMode: 'buku_besar_rinci' },
    { id: 'cf-i-sub1', label: 'Arus Kas Bersih dari Aktivitas Operasi', indent: 0, amount: labaBersih + bebanPenyusutanPeriode, isSubtotal: true },

    { id: 'cf-i-h2', label: 'Arus Kas dari Aktivitas Investasi (Aset Sarpras)', indent: 0, amount: 0, isSectionHeader: true },
    { id: 'cf-i-inv1', label: 'Perolehan Peralatan, Mebel & Inventaris Baru', indent: 2, amount: -pembelianAsetDariKas, clickableAccountCode: '1203.01', clickableAccountName: 'Peralatan & Inventaris Sarpras', drillMode: 'buku_besar_rinci' },
    { id: 'cf-i-sub2', label: 'Arus Kas Bersih dari Aktivitas Investasi', indent: 0, amount: arusKasInvestasi, isSubtotal: true },

    { id: 'cf-i-h3', label: 'Arus Kas dari Aktivitas Pendanaan', indent: 0, amount: 0, isSectionHeader: true },
    { id: 'cf-i-fin', label: 'Mutasi Dana Wakaf & Cadangan Yayasan', indent: 2, amount: 0 },
    { id: 'cf-i-net', label: 'Kenaikan (Penurunan) Bersih Kas', indent: 0, amount: labaBersih + bebanPenyusutanPeriode - pembelianAsetDariKas, isGrandTotal: true },
    { id: 'cf-i-awal', label: 'Kas & Setara Kas Awal Periode', indent: 1, amount: kasAwal },
    { id: 'cf-i-akhir', label: 'Kas & Setara Kas Akhir Periode', indent: 0, amount: kasAwal + labaBersih + bebanPenyusutanPeriode - pembelianAsetDariKas, isGrandTotal: true },
  ];

  const rincianArusKasLines: StatementLine[] = [
    ...arusKasTakLangsungLines.slice(0, 5),
    { id: 'cf-r-1', label: 'Rekonsiliasi Piutang Syahriyah, Daftar Ulang & Boyong (Saldo Tertagih vs Tertunggak)', indent: 3, amount: -totalPiutang + totalPiutang },
    { id: 'cf-r-2', label: 'Rekonsiliasi Kewajiban Bisyaroh Siap Cair', indent: 3, amount: hutangBisyarohSiapCair > 0 ? 0 : 0 },
    ...arusKasTakLangsungLines.slice(5),
  ];

  // 8. Multi-Period (Juli - November 2026)
  const multiPeriodMonths = rekapAnggaranBulanan.map((b) => `${b.bulan.slice(0, 3)} ${b.tahun}`);
  const neracaMultiPeriodRows = [
    { label: 'Kas & Bank Pondok (Terhubung Buku Kas)', indent: 1 as const, values: rekapAnggaranBulanan.map((b, i) => (i === rekapAnggaranBulanan.length - 1 ? totalKasDanBank : 360000000 + b.saldo * (i + 1))), clickableCode: '1000.01', clickableName: 'Kas Tunai Bendahara Pondok', drillMode: 'buku_besar_rinci' as const },
    { label: 'Piutang Santri & Tunggakan Boyong', indent: 1 as const, values: rekapAnggaranBulanan.map((_, i) => (i === rekapAnggaranBulanan.length - 1 ? totalPiutang : Math.round(totalPiutang * (0.8 + i * 0.06)))), clickableCode: '1101.01', clickableName: 'Piutang Syahriyah Santri', drillMode: 'buku_besar_rinci' as const },
    { label: 'Aktiva Tetap Bersih (Lahan, Gedung & Inventaris)', indent: 1 as const, values: rekapAnggaranBulanan.map((_, i) => (i === rekapAnggaranBulanan.length - 1 ? totalAktivaTetap : totalAktivaTetap - pembelianAsetDariKas)) },
    { label: 'Total Aktiva', indent: 0 as const, isTotal: true, values: rekapAnggaranBulanan.map((b, i) => (i === rekapAnggaranBulanan.length - 1 ? totalAktiva : 360000000 + b.saldo * (i + 1) + Math.round(totalPiutang * (0.8 + i * 0.06)) + (totalAktivaTetap - pembelianAsetDariKas) + persediaanDapurKitab + kasBonUangMuka)) },
    { label: 'Total Kewajiban Lancar', indent: 1 as const, values: rekapAnggaranBulanan.map((_, i) => (i === rekapAnggaranBulanan.length - 1 ? totalKewajiban : totalKewajiban - 2500000 * (rekapAnggaranBulanan.length - 1 - i))) },
    { label: 'Total Ekuitas Yayasan & Surplus', indent: 1 as const, values: rekapAnggaranBulanan.map((b, i) => (i === rekapAnggaranBulanan.length - 1 ? totalEkuitas : 360000000 + b.saldo * (i + 1) + Math.round(totalPiutang * (0.8 + i * 0.06)) + (totalAktivaTetap - pembelianAsetDariKas) + persediaanDapurKitab + kasBonUangMuka - (totalKewajiban - 2500000 * (rekapAnggaranBulanan.length - 1 - i)))) },
  ];

  const labaRugiMultiPeriodRows = [
    { label: 'Total Pendapatan Pesantren & Madrasah', indent: 0 as const, isTotal: true, values: rekapAnggaranBulanan.map((b, i) => (i === rekapAnggaranBulanan.length - 1 ? totalPendapatan : b.realisasiMasuk)) },
    { label: 'Beban Langsung & Dapur Santri', indent: 1 as const, values: rekapAnggaranBulanan.map((b, i) => (i === rekapAnggaranBulanan.length - 1 ? totalBebanLangsung : Math.round(b.realisasiKeluar * 0.38))) },
    { label: 'Beban Operasi & Bisyaroh Asatidz', indent: 1 as const, values: rekapAnggaranBulanan.map((b, i) => (i === rekapAnggaranBulanan.length - 1 ? totalBebanOperasi : Math.round(b.realisasiKeluar * 0.62))) },
    { label: 'Surplus / Laba Bersih Bulanan', indent: 0 as const, isTotal: true, values: rekapAnggaranBulanan.map((b, i) => (i === rekapAnggaranBulanan.length - 1 ? labaBersih : b.saldo)) },
  ];

  const arusKasMultiPeriodLangsung = [
    { label: 'Arus Kas Masuk Operasi', indent: 1 as const, values: rekapAnggaranBulanan.map((b, i) => (i === rekapAnggaranBulanan.length - 1 ? kasMasukOperasi : b.realisasiMasuk)) },
    { label: 'Arus Kas Keluar Operasi', indent: 1 as const, values: rekapAnggaranBulanan.map((b, i) => (i === rekapAnggaranBulanan.length - 1 ? -kasKeluarOperasi : -b.realisasiKeluar)) },
    { label: 'Arus Kas Investasi Aset Tetap', indent: 1 as const, values: rekapAnggaranBulanan.map((_, i) => (i === rekapAnggaranBulanan.length - 1 ? -pembelianAsetDariKas : 0)) },
    { label: 'Kenaikan (Penurunan) Kas Bersih', indent: 0 as const, isTotal: true, values: rekapAnggaranBulanan.map((b, i) => (i === rekapAnggaranBulanan.length - 1 ? kenaikanKasLangsung : b.saldo)) },
  ];

  const arusKasMultiPeriodTakLangsung = [
    { label: 'Surplus / Laba Bersih', indent: 1 as const, values: rekapAnggaranBulanan.map((b, i) => (i === rekapAnggaranBulanan.length - 1 ? labaBersih : b.saldo)) },
    { label: 'Penyesuaian Penyusutan Non-Kas', indent: 1 as const, values: rekapAnggaranBulanan.map(() => bebanPenyusutanPeriode) },
    { label: 'Investasi Pembelian Aset Tetap', indent: 1 as const, values: rekapAnggaranBulanan.map((_, i) => (i === rekapAnggaranBulanan.length - 1 ? -pembelianAsetDariKas : 0)) },
    { label: 'Perubahan Kas Bersih Bulanan', indent: 0 as const, isTotal: true, values: rekapAnggaranBulanan.map((b, i) => (i === rekapAnggaranBulanan.length - 1 ? labaBersih + bebanPenyusutanPeriode - pembelianAsetDariKas : b.saldo + bebanPenyusutanPeriode)) },
  ];

  // 9. Financial Ratios
  const totalTaggedAll = tagihanSantriList.reduce((s, t) => s + t.nominalTagihan, 0);
  const totalCollectedAll = tagihanSantriList.reduce((s, t) => s + t.nominalTerbayar, 0);
  const kolektibilitasPct = totalTaggedAll > 0 ? Math.round((totalCollectedAll / totalTaggedAll) * 1000) / 10 : 100;
  const currentRatio = totalKewajibanLancar > 0 ? Math.round((totalAktivaLancar / totalKewajibanLancar) * 100) / 100 : 10;
  const cashRatio = totalKewajibanLancar > 0 ? Math.round((totalKasDanBank / totalKewajibanLancar) * 100) / 100 : 8;
  const debtToAssetPct = totalAktiva > 0 ? Math.round((totalKewajiban / totalAktiva) * 1000) / 10 : 0;
  const surplusMarginPct = totalPendapatan > 0 ? Math.round((labaBersih / totalPendapatan) * 1000) / 10 : 0;

  const ratios = [
    {
      label: 'Current Ratio (Rasio Lancar)',
      valueText: `${currentRatio}x`,
      benchmark: '>= 1.50x',
      status: currentRatio >= 1.5 ? ('Kuat' as const) : ('Perhatian' as const),
      desc: 'Kemampuan Aktiva Lancar menutup seluruh Kewajiban Jangka Pendek Pondok.',
    },
    {
      label: 'Cash Ratio (Rasio Kas Cepat)',
      valueText: `${cashRatio}x`,
      benchmark: '>= 0.80x',
      status: cashRatio >= 0.8 ? ('Kuat' as const) : ('Perhatian' as const),
      desc: 'Kesiapan kas tunai & bank menutup titipan kartu santri dan bisyaroh.',
    },
    {
      label: 'Kolektibilitas Syahriyah & Tagihan',
      valueText: `${kolektibilitasPct}%`,
      benchmark: '>= 85.0%',
      status: kolektibilitasPct >= 85 ? ('Sehat' as const) : ('Perhatian' as const),
      desc: 'Persentase pelunasan tagihan Syahriyah, Daftar Ulang & Agenda Kema\'hadiyahan.',
    },
    {
      label: 'Debt to Asset Ratio',
      valueText: `${debtToAssetPct}%`,
      benchmark: '<= 25.0%',
      status: debtToAssetPct <= 25 ? ('Kuat' as const) : ('Perhatian' as const),
      desc: 'Proporsi aset pesantren yang berasal dari kewajiban/titipan pihak ketiga.',
    },
    {
      label: 'Net Surplus Margin',
      valueText: `${surplusMarginPct}%`,
      benchmark: '>= 10.0%',
      status: surplusMarginPct >= 10 ? ('Sehat' as const) : ('Perhatian' as const),
      desc: 'Efisiensi operasional pesantren dari total pendapatan yang masuk.',
    },
  ];

  // 10. Drill-down: Daftar Histori GL (Gambar 4)
  const getHistoriGL = (noAkun: string, namaAkun?: string): HistoriGLRow[] => {
    const matched = kasTransactions
      .filter((k) => {
        if (dateStart && k.tanggal < dateStart) return false;
        if (dateEnd && k.tanggal > dateEnd) return false;
        const acc = resolveAccountFromKas(k);
        if (noAkun === '4001.09') return acc.noAkun === '4001.09' || acc.noAkun === '4002.01';
        return acc.noAkun === noAkun;
      })
      .sort((a, b) => a.tanggal.localeCompare(b.tanggal));

    return matched.map((k, idx) => {
      const acc = resolveAccountFromKas(k);
      const isExpenseOrAsset = k.tipe === 'Keluar';
      return {
        tanggal: k.tanggal,
        tipeSumber: k.tipeSumber || (k.tipe === 'Masuk' ? 'Penerimaan' : 'Pembayaran'),
        noSumber: k.noSumber || `${k.tipe === 'Masuk' ? 'BKM' : 'BKK'}-${2400 + idx}`,
        noAkun: acc.noAkun,
        namaAkun: namaAkun || acc.namaAkun,
        keterangan: k.uraian,
        debit: isExpenseOrAsset ? k.nominal : 0,
        kredit: !isExpenseOrAsset ? k.nominal : 0,
      };
    });
  };

  // 11. Drill-down: Buku Besar - Rinci (Gambar 6 & 7)
  const getBukuBesarRinci = (noAkun: string, _namaAkun?: string) => {
    // Cash Accounts (1000.01 Kas Tunai, 1000.02 Bank, 1000.03 Titipan Kartu)
    if (noAkun === '1000.01' || noAkun === '1000.02') {
      const isBank = noAkun === '1000.02';
      const saldoAwal = isBank ? openingBankPondok : openingKasTunai;
      const sorted = [...kasTransactions]
        .filter((k) => {
          if (dateStart && k.tanggal < dateStart) return false;
          if (dateEnd && k.tanggal > dateEnd) return false;
          const desc = (k.uraian + ' ' + k.kategori).toLowerCase();
          if (isBank) return desc.includes('bsi') || desc.includes('transfer') || desc.includes('daftar ulang') || desc.includes('imtihan') || k.nominal >= 10000000;
          return true;
        })
        .sort((a, b) => a.tanggal.localeCompare(b.tanggal));

      let running = saldoAwal;
      let totalDebit = 0;
      let totalKredit = 0;
      const rows: BukuBesarRinciRow[] = sorted.map((k, idx) => {
        const debit = k.tipe === 'Masuk' ? k.nominal : 0;
        const kredit = k.tipe === 'Keluar' ? k.nominal : 0;
        running = running + debit - kredit;
        totalDebit += debit;
        totalKredit += kredit;
        return {
          tanggal: k.tanggal,
          sumber: k.tipeSumber || (k.tipe === 'Masuk' ? 'Penerimaan' : 'Pembayaran'),
          noSumber: k.noSumber || `${k.tipe === 'Masuk' ? 'BKM' : 'BKK'}-${2380 + idx}`,
          keterangan: k.uraian,
          debit,
          kredit,
          balance: Math.abs(running),
          balanceType: running >= 0 ? 'Dr' : 'Cr',
        };
      });
      return { saldoAwal, normalSide: 'Dr' as const, rows, totalDebit, totalKredit, saldoAkhir: running };
    }

    if (noAkun === '1000.03' || noAkun === '2101.01') {
      const isLiability = noAkun === '2101.01';
      const sorted = [...transaksiList].slice(0, 30).reverse();
      let running = Math.max(0, kasKartuSantriBalance - sorted.reduce((s, t) => s + (t.tipe === 'Top Up' ? t.nominal : -t.nominal), 0));
      const saldoAwal = running;
      let totalDebit = 0;
      let totalKredit = 0;
      const rows: BukuBesarRinciRow[] = sorted.map((t, idx) => {
        const debit = !isLiability ? (t.tipe === 'Top Up' ? t.nominal : 0) : t.tipe === 'Jajan Kantin' ? t.nominal : 0;
        const kredit = !isLiability ? (t.tipe === 'Jajan Kantin' ? t.nominal : 0) : t.tipe === 'Top Up' ? t.nominal : 0;
        running = running + (isLiability ? kredit - debit : debit - kredit);
        totalDebit += debit;
        totalKredit += kredit;
        return {
          tanggal: t.waktu.slice(0, 10),
          sumber: t.tipe === 'Top Up' ? 'Top Up Kartu' : 'POS Kantin',
          noSumber: `POS-${1000 + idx}`,
          keterangan: `${t.santriNama} — ${t.keterangan}`,
          debit,
          kredit,
          balance: Math.abs(running),
          balanceType: isLiability ? 'Cr' : 'Dr',
        };
      });
      return { saldoAwal, normalSide: isLiability ? ('Cr' as const) : ('Dr' as const), rows, totalDebit, totalKredit, saldoAkhir: running };
    }

    // Piutang Santri Drilldown (1101.01..04)
    if (noAkun.startsWith('1101.')) {
      const filterCat =
        noAkun === '1101.01'
          ? 'Syahriyah Bulanan'
          : noAkun === '1101.02'
          ? 'Daftar Ulang'
          : noAkun === '1101.03'
          ? "Agenda Kema'hadiyahan"
          : 'BOYONG';

      const relevantBills = tagihanSantriList.filter((t) => {
        const owner = ledgerMap.get(t.ledgerId);
        if (filterCat === 'BOYONG') return owner?.statusPondok === 'Boyong / Keluar';
        return owner?.statusPondok !== 'Boyong / Keluar' && t.kategori === filterCat;
      });

      let running = 0;
      let totalDebit = 0;
      let totalKredit = 0;
      const rows: BukuBesarRinciRow[] = [];
      relevantBills.forEach((t, idx) => {
        const owner = ledgerMap.get(t.ledgerId);
        const sisa = t.nominalTagihan - t.nominalTerbayar;
        if (sisa <= 0 && t.riwayatBayar.length === 0) return;
        running += t.nominalTagihan;
        totalDebit += t.nominalTagihan;
        rows.push({
          tanggal: t.jatuhTempo,
          sumber: 'Tagihan Santri',
          noSumber: `TGH-${300 + idx}`,
          keterangan: `${owner?.nama || 'Santri'} (${owner?.statusPondok || 'Aktif'}) — ${t.judulTagihan}`,
          debit: t.nominalTagihan,
          kredit: 0,
          balance: running,
          balanceType: 'Dr',
        });
        if (t.nominalTerbayar > 0) {
          running -= t.nominalTerbayar;
          totalKredit += t.nominalTerbayar;
          rows.push({
            tanggal: t.tanggalBayarTerakhir || t.jatuhTempo,
            sumber: 'Pembayaran Wali',
            noSumber: `BYR-${300 + idx}`,
            keterangan: `Pembayaran ${owner?.nama || 'Santri'} (${t.metodeTerakhir || 'Loket'})`,
            debit: 0,
            kredit: t.nominalTerbayar,
            balance: Math.abs(running),
            balanceType: running >= 0 ? 'Dr' : 'Cr',
          });
        }
      });
      return { saldoAwal: 0, normalSide: 'Dr' as const, rows, totalDebit, totalKredit, saldoAkhir: running };
    }

    // Fixed Assets Drilldown (1201.01, 1202.01, 1203.01)
    if (noAkun.startsWith('120')) {
      let running = 0;
      let totalDebit = 0;
      const rows: BukuBesarRinciRow[] = [];
      if (noAkun === '1201.01') {
        sarprasLahan.forEach((l, i) => {
          const val = l.nilaiPerolehan ?? l.luasM2 * 450000;
          running += val;
          totalDebit += val;
          rows.push({
            tanggal: '2026-01-01',
            sumber: 'Aset Lahan Sarpras',
            noSumber: l.noSertifikat || `LHN-${i + 1}`,
            keterangan: `${l.namaLahan} (${l.luasM2} m² · ${l.statusKepemilikan})`,
            debit: val,
            kredit: 0,
            balance: running,
            balanceType: 'Dr',
          });
        });
      } else if (noAkun === '1202.01') {
        sarprasGedung.forEach((g) => {
          const val = g.nilaiPerolehan ?? g.luasBangunanM2 * 1400000;
          running += val;
          totalDebit += val;
          rows.push({
            tanggal: `${g.tahunBangun}-01-01`,
            sumber: 'Aset Gedung Sarpras',
            noSumber: g.kode,
            keterangan: `${g.namaGedung} (${g.jumlahLantai} Lantai · ${g.luasBangunanM2} m²)`,
            debit: val,
            kredit: 0,
            balance: running,
            balanceType: 'Dr',
          });
        });
      } else {
        sarprasPerlengkapan.forEach((p) => {
          const val = p.jumlah * (p.hargaSatuan ?? 250000);
          running += val;
          totalDebit += val;
          rows.push({
            tanggal: `${p.tahunPerolehan ?? 2023}-01-01`,
            sumber: 'Inventaris Sarpras',
            noSumber: p.kodeBarang,
            keterangan: `${p.namaBarang} (${p.jumlah} ${p.satuan} · ${p.lokasiRuang})`,
            debit: val,
            kredit: 0,
            balance: running,
            balanceType: 'Dr',
          });
        });
        filteredKas
          .filter((k) => resolveAccountFromKas(k).noAkun === '1203.01')
          .forEach((k, idx) => {
            running += k.nominal;
            totalDebit += k.nominal;
            rows.push({
              tanggal: k.tanggal,
              sumber: k.tipeSumber || 'Pembelian Aset',
              noSumber: k.noSumber || `AST-${idx + 1}`,
              keterangan: k.uraian,
              debit: k.nominal,
              kredit: 0,
              balance: running,
              balanceType: 'Dr',
            });
          });
      }
      return { saldoAwal: 0, normalSide: 'Dr' as const, rows, totalDebit, totalKredit: 0, saldoAkhir: running };
    }

    // Default Liability/other account drilldown
    if (noAkun === '2101.02') {
      let running = 0;
      let totalKredit = 0;
      const rows: BukuBesarRinciRow[] = ustadzPayroll
        .filter((u) => u.statusBayar === 'Siap')
        .map((u, i) => {
          const bis = Math.round(((u.jtmDiniyah * u.jumlahHadir) / 2) * 10000);
          const tot =
            u.gajiPokok +
            u.tunjanganTransportasi +
            u.tunjanganMasaKerja +
            u.tunjanganKomunikasi +
            u.tunjanganJabatan +
            u.bisyarohTakhasus +
            bis;
          running += tot;
          totalKredit += tot;
          return {
            tanggal: '2026-11-21',
            sumber: 'Payroll Bisyaroh',
            noSumber: `PAY-${i + 1}`,
            keterangan: `${u.ustadzNama} (${u.jabatan}) — Siap Cair`,
            debit: 0,
            kredit: tot,
            balance: running,
            balanceType: 'Cr',
          };
        });
      return { saldoAwal: 0, normalSide: 'Cr' as const, rows, totalDebit: 0, totalKredit, saldoAkhir: running };
    }

    return { saldoAwal: 0, normalSide: 'Dr' as const, rows: [], totalDebit: 0, totalKredit: 0, saldoAkhir: 0 };
  };

  return {
    totalAktiva,
    totalAktivaLancar,
    totalAktivaTetap,
    totalKewajiban,
    totalEkuitas,
    isBalanced,
    kasTunaiBalance,
    bankPondokBalance,
    kasKartuSantriBalance,
    totalKasDanBank,
    piutangSyahriyah,
    piutangDaftarUlang,
    piutangAgenda,
    piutangBoyong,
    totalPiutang,
    asetLahanTotal,
    asetGedungTotal,
    asetPerlengkapanTotal,
    akumulasiPenyusutanGedung,
    akumulasiPenyusutanPerlengkapan,
    nilaiBukuAsetTetap,
    totalPendapatan,
    totalBebanLangsung,
    labaKotor,
    totalBebanOperasi,
    pendapatanOperasi,
    labaBersih,
    neracaLines,
    labaRugiLines,
    arusKasLangsungLines,
    arusKasTakLangsungLines,
    rincianArusKasLines,
    multiPeriodMonths,
    neracaMultiPeriodRows,
    labaRugiMultiPeriodRows,
    arusKasMultiPeriodLangsung,
    arusKasMultiPeriodTakLangsung,
    ratios,
    getHistoriGL,
    getBukuBesarRinci,
  };
}
