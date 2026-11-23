import React, { useState } from 'react';
import {
  CreditCard,
  ShoppingCart,
  Shirt,
  Shield,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lock,
  Unlock,
  Package,
  Sliders,
} from 'lucide-react';
import { useAppStore } from '../../lib/store.ts';
import { useAuth } from '../../lib/auth.ts';

export const TransaksiModule: React.FC = () => {
  const {
    currentUser,
    santriList,
    transaksiList,
    titipanWali,
    bendaharaSantriList,
    tagihanSantriList,
    bayarTagihanSantri,
    topUpSaldo,
    prosesBelanjaKantin,
    updateLimitHarian,
    toggleStatusKartu,
  } = useAppStore();

  const { effectiveRole, can } = useAuth();
  const isWaliReadOnly = effectiveRole === 'wali_santri' || !can('transaksi_kartu_pos', 'tulis');

  const [activeTab, setActiveTab] = useState<'pos_kantin' | 'wali_portal' | 'laundry' | 'rekap_kas'>(
    effectiveRole === 'wali_santri' ? 'wali_portal' : 'pos_kantin'
  );

  React.useEffect(() => {
    if (effectiveRole === 'wali_santri' && activeTab !== 'wali_portal') {
      setActiveTab('wali_portal');
    }
  }, [effectiveRole, activeTab]);

  // POS State
  const [tapCardNis, setTapCardNis] = useState<string>('24.1001');
  const [cartItems, setCartItems] = useState<{ id: string; nama: string; harga: number; qty: number }[]>([]);
  const [posFeedback, setPosFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Selected student for POS
  const activeSantri = santriList.find((s) => s.nis === tapCardNis || s.id === tapCardNis) || santriList[0];

  // Wali Santri Portal View student (e.g. child: s-001)
  const childSantri = santriList.find((s) => s.id === currentUser.santriAnakId) || santriList[0];

  // Top Up Modal State
  const [topUpNominal, setTopUpNominal] = useState<number>(50000);
  const [topUpMetode, setTopUpMetode] = useState<string>('QRIS / Virtual Account BCA');
  const [topUpMessage, setTopUpMessage] = useState<string>('');
  const [waliBillMetode, setWaliBillMetode] = useState<string>('Virtual Account BSI');
  const [waliBillMessage, setWaliBillMessage] = useState<string>('');

  // POS menu items catalog
  const posCatalog = [
    { id: 'p1', nama: 'Nasi Kuning Telur Balado', harga: 10000, kategori: 'Makanan' },
    { id: 'p2', nama: 'Nasi Soto Ayam Lamongan', harga: 12000, kategori: 'Makanan' },
    { id: 'p3', nama: 'Es Teh Manis Jumbo', harga: 3000, kategori: 'Minuman' },
    { id: 'p4', nama: 'Air Mineral Botol 600ml', harga: 4000, kategori: 'Minuman' },
    { id: 'p5', nama: 'Roti Bakar Coklat Keju', harga: 6000, kategori: 'Snack' },
    { id: 'p6', nama: 'Kitab Jurumiyyah Pegon', harga: 15000, kategori: 'Alat Tulis' },
    { id: 'p7', nama: 'Buku Tulis Pegon Garis Tebal', harga: 5000, kategori: 'Alat Tulis' },
    { id: 'p8', nama: 'Paket Laundry 2 Hari Bersih', harga: 8000, kategori: 'Laundry' },
  ];

  const addToCart = (item: typeof posCatalog[0]) => {
    setPosFeedback(null);
    setCartItems((prev) => {
      const exists = prev.find((c) => c.id === item.id);
      if (exists) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((c) => c.id !== id));
  };

  const totalCart = cartItems.reduce((sum, c) => sum + c.harga * c.qty, 0);

  const handleProsesCheckout = () => {
    if (cartItems.length === 0) return;
    const desc = cartItems.map((c) => `${c.qty}x ${c.nama}`).join(', ');
    const result = prosesBelanjaKantin(activeSantri.id, totalCart, desc);

    if (result.success) {
      setPosFeedback({ type: 'success', message: result.message });
      setCartItems([]);
    } else {
      setPosFeedback({ type: 'error', message: result.message });
    }
  };

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    topUpSaldo(childSantri.id, topUpNominal, topUpMetode);
    setTopUpMessage(`Top up Rp ${topUpNominal.toLocaleString('id-ID')} berhasil masuk ke kartu santri.`);
    setTimeout(() => setTopUpMessage(''), 4000);
  };

  // Compute daily spent today for active student
  const todayStr = new Date().toISOString().substring(0, 10);
  const jajanHariIni = transaksiList
    .filter((t) => t.santriId === activeSantri.id && t.tipe === 'Jajan Kantin' && t.waktu.startsWith(todayStr))
    .reduce((sum, t) => sum + t.nominal, 0);

  const sisaLimitHariIni = Math.max(0, activeSantri.limitHarian - jajanHariIni);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-700" />
            <span>Transaksi Kartu Santri Digital, POS Kantin & Laundry</span>
          </h2>
          <p className="text-xs text-slate-500">
            Sistem pembayaran non-tunai (cashless), batas jajan harian dari wali, dan pembukuan harian unit usaha.
          </p>
        </div>

        {/* Tab switch (wali_santri hanya melihat Portal Kartu & POS Santri) */}
        {effectiveRole !== 'wali_santri' ? (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('pos_kantin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'pos_kantin' ? 'bg-emerald-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Kasir Kantin (Touchscreen POS)
            </button>
            <button
              onClick={() => setActiveTab('wali_portal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'wali_portal' ? 'bg-emerald-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Portal Wali (Top Up & Limit)
            </button>
            <button
              onClick={() => setActiveTab('laundry')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'laundry' ? 'bg-emerald-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Unit Laundry Pondok
            </button>
            <button
              onClick={() => setActiveTab('rekap_kas')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'rekap_kas' ? 'bg-emerald-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Rekap Harian Transaksi
            </button>
          </div>
        ) : (
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold whitespace-nowrap">
            Mode Lihat Saja · Informasi Kartu &amp; POS Santri
          </span>
        )}
      </div>

      {/* TAB 1: KASIR KANTIN TOUCHSCREEN POS */}
      {effectiveRole !== 'wali_santri' && activeTab === 'pos_kantin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Product Catalog (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900">Katalog Menu Kantin & Koperasi</h3>
              <span className="text-[10px] text-slate-400">Klik item untuk menambah ke keranjang</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {posCatalog.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-600 hover:bg-emerald-50/40 text-left transition shadow-2xs group flex flex-col justify-between"
                >
                  <div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600">
                      {item.kategori}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 mt-2 line-clamp-2 group-hover:text-emerald-800">
                      {item.nama}
                    </h4>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-extrabold text-xs text-emerald-800 tabular-nums">
                      Rp {item.harga.toLocaleString('id-ID')}
                    </span>
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                      +
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Cart, Tap Card & Student Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Tap Card Simulator */}
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span>Tap Kartu Santri (RFID)</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeSantri.statusKartu === 'Aktif'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {activeSantri.statusKartu}
                </span>
              </div>

              {/* Selector Santri / Simulated Scan */}
              <select
                value={activeSantri.id}
                onChange={(e) => setTapCardNis(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2 text-xs font-bold text-slate-900"
              >
                {santriList.slice(0, 40).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nis} - {s.nama} ({s.kelas})
                  </option>
                ))}
              </select>

              {/* Student Card Info Display */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-white space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-300 font-semibold">{activeSantri.kelas}</span>
                  <span className="text-amber-300 font-bold tabular-nums">NIS: {activeSantri.nis}</span>
                </div>
                <h4 className="font-extrabold text-sm uppercase tracking-wide truncate">
                  {activeSantri.nama}
                </h4>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-800 text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-300">Saldo Kartu</span>
                    <p className="font-black text-amber-300 text-base tabular-nums">
                      Rp {activeSantri.saldoKartu.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300">Sisa Limit Hari Ini</span>
                    <p className="font-bold text-emerald-100 text-xs tabular-nums">
                      Rp {sisaLimitHariIni.toLocaleString('id-ID')} / {activeSantri.limitHarian.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart & Checkout */}
            <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs space-y-3">
              <h4 className="font-bold text-xs text-slate-800 flex items-center justify-between">
                <span>Keranjang Belanja ({cartItems.length} item)</span>
                {cartItems.length > 0 && (
                  <button
                    onClick={() => setCartItems([])}
                    className="text-[11px] text-rose-600 hover:underline"
                  >
                    Kosongkan
                  </button>
                )}
              </h4>

              {/* Items List */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto divide-y divide-slate-100">
                {cartItems.length === 0 ? (
                  <p className="py-4 text-center text-xs text-slate-400">Keranjang masih kosong</p>
                ) : (
                  cartItems.map((c) => (
                    <div key={c.id} className="pt-1.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{c.nama}</p>
                        <p className="text-[10px] text-slate-500">
                          {c.qty} × Rp {c.harga.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold tabular-nums">
                          Rp {(c.harga * c.qty).toLocaleString('id-ID')}
                        </span>
                        <button
                          onClick={() => removeFromCart(c.id)}
                          className="text-rose-500 hover:text-rose-700 text-xs font-bold"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Feedback toast */}
              {posFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                    posFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {posFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  )}
                  <span>{posFeedback.message}</span>
                </div>
              )}

              {/* Total & Checkout Button */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-bold">Total Pembayaran:</span>
                  <span className="text-lg font-black text-emerald-950 tabular-nums">
                    Rp {totalCart.toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={cartItems.length === 0}
                  onClick={handleProsesCheckout}
                  className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Proses Bayar (Tap Kartu)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PORTAL WALI SANTRI (TOP UP & ATUR LIMIT) */}
      {activeTab === 'wali_portal' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                  Portal Khusus Wali Santri
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-1">
                  Kontrol Jajan & Saldo Putra/Putri Anda
                </h3>
              </div>
              <img
                src="/assets/aistudio/preview__14__3b7f388f.webp"
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
            </div>

            {topUpMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{topUpMessage}</span>
              </div>
            )}

            {/* Child Card Snapshot */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-emerald-950 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-emerald-300">Nama Santri:</p>
                  <h4 className="font-bold text-base text-white">{childSantri.nama}</h4>
                  <p className="text-xs text-emerald-200">
                    Kelas: {childSantri.kelas} · Kamar: {childSantri.kamar}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-emerald-300">Saldo Kartu Saat Ini:</p>
                  <p className="text-2xl font-black text-amber-300 tabular-nums">
                    Rp {childSantri.saldoKartu.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-800/80 flex items-center justify-between text-xs">
                <span>
                  Batas Belanja Harian: <strong>Rp {childSantri.limitHarian.toLocaleString('id-ID')}</strong>
                </span>
                {isWaliReadOnly ? (
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      childSantri.statusKartu === 'Aktif'
                        ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
                        : 'bg-rose-500/30 text-rose-200 border border-rose-400/30'
                    }`}
                  >
                    Status Kartu: {childSantri.statusKartu}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleStatusKartu(childSantri.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      childSantri.statusKartu === 'Aktif'
                        ? 'bg-rose-500 hover:bg-rose-600 text-white'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {childSantri.statusKartu === 'Aktif' ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Kunci / Blokir Kartu</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Buka Blokir Kartu</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {isWaliReadOnly ? (
              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/70 text-xs text-amber-950 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Mode Lihat Saja (Wali Santri)</p>
                  <p className="text-[11px] text-amber-900/90 mt-0.5">
                    Anda dapat memantau saldo kartu jajan, batas belanja harian, riwayat transaksi POS kantin, tagihan syahriyah, serta status paket titipan ananda. Pengisian saldo (Top Up) dan perubahan limit dilakukan melalui petugas Kasir Kantin / Bendahara Pondok.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Setting Batas Jajan Harian */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-emerald-700" />
                    <span>Atur Batas Belanja Harian (Maksimal Jajan per Hari)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Santri tidak dapat bertransaksi di kantin jika total jajan dalam 1 hari melebihi batas ini.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    {[15000, 20000, 25000, 35000, 50000].map((limitVal) => (
                      <button
                        key={limitVal}
                        type="button"
                        onClick={() => updateLimitHarian(childSantri.id, limitVal)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          childSantri.limitHarian === limitVal
                            ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        Rp {limitVal.toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Top Up Cepat */}
                <form onSubmit={handleTopUpSubmit} className="space-y-4">
                  <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <ArrowDownLeft className="w-4 h-4 text-emerald-700" />
                    <span>Top Up Saldo Kartu Jajan Santri</span>
                  </h4>

                  <div className="grid grid-cols-3 gap-2">
                    {[25000, 50000, 100000].map((nominal) => (
                      <button
                        key={nominal}
                        type="button"
                        onClick={() => setTopUpNominal(nominal)}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                          topUpNominal === nominal
                            ? 'bg-emerald-800 text-white border-emerald-800'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Rp {nominal.toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Metode Pembayaran Transfer
                    </label>
                    <select
                      value={topUpMetode}
                      onChange={(e) => setTopUpMetode(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                    >
                      <option value="QRIS Instan (GoPay/OVO/ShopeePay)">QRIS Instan (Scan Barcode)</option>
                      <option value="Virtual Account BCA / BSI">Virtual Account BSI / BCA</option>
                      <option value="Transfer Bank Syariah Indonesia (BSI)">Transfer Bank BSI</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition"
                  >
                    Kirim Top Up Sekarang (Simulasi)
                  </button>
                </form>
              </>
            )}

            {/* Tagihan Syahriyah Bulanan, Daftar Ulang & Agenda Kema'hadiyahan (Terhubung ke Bendahara) */}
            <div className="pt-5 border-t border-slate-200 space-y-3">
              {(() => {
                const childLedger = bendaharaSantriList.find(
                  (b) => b.refSantriId === childSantri.id || b.nis === childSantri.nis
                );
                const childBills = childLedger
                  ? tagihanSantriList.filter((t) => t.ledgerId === childLedger.id)
                  : [];
                const totalSisaChild = childBills.reduce(
                  (s, t) => s + Math.max(0, t.nominalTagihan - t.nominalTerbayar),
                  0
                );

                return (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-emerald-700" />
                          <span>Pembayaran Syahriyah Bulanan, Daftar Ulang &amp; Agenda Kema&apos;hadiyahan</span>
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Pembayaran langsung terverifikasi ke Buku Kas &amp; Piutang Bendahara Pondok.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold tabular-nums text-rose-700">
                          Total Tanggungan: Rp {totalSisaChild.toLocaleString('id-ID')}
                        </span>
                        {!isWaliReadOnly && (
                          <select
                            value={waliBillMetode}
                            onChange={(e) => setWaliBillMetode(e.target.value)}
                            className="rounded-lg border border-slate-300 px-2.5 py-1 text-[11px] font-semibold bg-white"
                          >
                            <option value="Virtual Account BSI">VA BSI</option>
                            <option value="QRIS Pondok">QRIS Pondok</option>
                            <option value="Transfer Bank BRI">Transfer BRI</option>
                          </select>
                        )}
                      </div>
                    </div>

                    {waliBillMessage && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{waliBillMessage}</span>
                      </div>
                    )}

                    {childBills.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
                        Belum ada tagihan Syahriyah, Daftar Ulang, atau Agenda untuk {childSantri.nama}.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white overflow-hidden">
                        {childBills.map((bill) => {
                          const sisa = Math.max(0, bill.nominalTagihan - bill.nominalTerbayar);
                          return (
                            <div
                              key={bill.id}
                              className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                            >
                              <div>
                                <p className="font-bold text-slate-900">{bill.judulTagihan}</p>
                                <p className="text-[11px] text-slate-500">
                                  {bill.kategori} · Periode {bill.periode} · Tempo {bill.jatuhTempo} ·{' '}
                                  <span
                                    className={`font-bold ${
                                      bill.status === 'Lunas'
                                        ? 'text-emerald-700'
                                        : bill.status === 'Cicilan'
                                        ? 'text-amber-700'
                                        : 'text-rose-700'
                                    }`}
                                  >
                                    {bill.status}
                                  </span>
                                </p>
                              </div>
                              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                <div className="text-right">
                                  <p className="font-extrabold tabular-nums text-slate-900">
                                    {sisa > 0
                                      ? `Sisa Rp ${sisa.toLocaleString('id-ID')}`
                                      : `Rp ${bill.nominalTagihan.toLocaleString('id-ID')}`}
                                  </p>
                                  <p className="text-[10px] text-slate-400 tabular-nums">
                                    Terbayar Rp {bill.nominalTerbayar.toLocaleString('id-ID')}
                                  </p>
                                </div>
                                {sisa > 0 ? (
                                  !isWaliReadOnly ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        bayarTagihanSantri(
                                          bill.id,
                                          sisa,
                                          waliBillMetode,
                                          `Dibayar oleh Wali via Portal (${waliBillMetode})`
                                        );
                                        setWaliBillMessage(
                                          `Pembayaran ${bill.judulTagihan} Rp ${sisa.toLocaleString('id-ID')} berhasil diposting ke Bendahara Pondok.`
                                        );
                                        setTimeout(() => setWaliBillMessage(''), 4500);
                                      }}
                                      className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold whitespace-nowrap"
                                    >
                                      Bayar Lunas
                                    </button>
                                  ) : (
                                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold whitespace-nowrap">
                                      {bill.status}
                                    </span>
                                  )
                                ) : (
                                  <span className="text-[11px] font-bold text-emerald-700">Lunas</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Monitoring Paket & Titipan Wali Santri */}
            <div className="pt-5 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-emerald-700" />
                  <span>Monitoring Paket & Titipan Wali Santri</span>
                </h4>
                <span className="text-[11px] font-bold text-slate-500">
                  {titipanWali.filter((t) => t.santriId === childSantri.id).length} Catatan
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Pantau status penerimaan kiriman barang atau uang titipan dari Pos Keamanan hingga diterima langsung oleh ananda.
              </p>

              {(() => {
                const paketSantri = titipanWali.filter((t) => t.santriId === childSantri.id);
                if (paketSantri.length === 0) {
                  return (
                    <div className="p-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 text-center text-xs text-slate-500">
                      Belum ada catatan paket atau titipan masuk untuk {childSantri.nama}.
                    </div>
                  );
                }
                return (
                  <div className="space-y-2.5">
                    {paketSantri.map((t) => (
                      <div
                        key={t.id}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          {t.fotoUrl ? (
                            <img
                              src={t.fotoUrl}
                              alt={t.jenisTitipan}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                          <div className="space-y-0.5 text-xs">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <p className="font-bold text-slate-900">{t.jenisTitipan}</p>
                              {t.nominalUang && t.nominalUang > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold tabular-nums">
                                  Rp {t.nominalUang.toLocaleString('id-ID')}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600">
                              Pengirim: <span className="font-semibold text-slate-800">{t.pengirimWali}</span> · Tgl: {t.tanggal}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Petugas Pos: {t.petugasPos}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`self-start sm:self-center px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                            t.status === 'Diterima Santri'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : t.status === 'Diserahkan ke Wali Kamar'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-sky-100 text-sky-800 border border-sky-200'
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Riwayat Transaksi Kartu POS Ananda (Lihat Saja) */}
            <div className="pt-5 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>Riwayat Transaksi Kartu POS ({childSantri.nama})</span>
                </h4>
                <span className="text-[11px] font-bold text-slate-500">
                  {transaksiList.filter((t) => t.santriId === childSantri.id).length} Catatan
                </span>
              </div>
              {(() => {
                const childTrx = transaksiList.filter((t) => t.santriId === childSantri.id);
                if (childTrx.length === 0) {
                  return (
                    <div className="p-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 text-center text-xs text-slate-500">
                      Belum ada transaksi POS tercatat untuk {childSantri.nama}.
                    </div>
                  );
                }
                return (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-left">
                          <th className="py-2 px-3">Waktu</th>
                          <th className="py-2 px-3">Jenis</th>
                          <th className="py-2 px-3">Keterangan</th>
                          <th className="py-2 px-3 text-right">Nominal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold">
                        {childTrx.slice(0, 15).map((trx) => (
                          <tr key={trx.id}>
                            <td className="py-2 px-3 tabular-nums text-slate-400">{trx.waktu}</td>
                            <td className="py-2 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  trx.tipe === 'Top Up'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {trx.tipe}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-slate-600">{trx.keterangan}</td>
                            <td className="py-2 px-3 text-right tabular-nums text-slate-900">
                              Rp {trx.nominal.toLocaleString('id-ID')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LAUNDRY PONDOK (UNIT USAHA) */}
      {effectiveRole !== 'wali_santri' && activeTab === 'laundry' && (
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Unit Usaha Laundry Pondok</h3>
              <p className="text-xs text-slate-500">
                Santri tidak mencuci pakaian sendiri agar fokus belajar. Tagihan masuk ke kartu santri.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
            <p className="font-bold text-slate-900">SOP Laundry Pondok Pesantren:</p>
            <p>1. Santri meletakkan kantong cucian bernomor NIS di loker drop-off asrama sebelum pukul 07.00 WIB.</p>
            <p>2. Petugas laundry mencuci pakaian dengan deterjen suci dan menyetrika rapi.</p>
            <p>3. Pakaian bersih diambil kembali di loker pada sore hari H+1.</p>
          </div>
        </div>
      )}

      {/* TAB 4: REKAP HARIAN TRANSAKSI KANTIN */}
      {effectiveRole !== 'wali_santri' && activeTab === 'rekap_kas' && (
        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Riwayat Transaksi Masuk & Keluar</h3>
              <p className="text-xs text-slate-500">Daftar transaksi kartu tap santri hari ini</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {transaksiList.length} Transaksi
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-left">
                  <th className="py-2.5">Waktu</th>
                  <th className="py-2.5">Nama Santri</th>
                  <th className="py-2.5">Jenis Transaksi</th>
                  <th className="py-2.5">Keterangan</th>
                  <th className="py-2.5 text-right">Nominal</th>
                  <th className="py-2.5">Kasir / Saluran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold">
                {transaksiList.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50">
                    <td className="py-2.5 tabular-nums text-slate-400">{trx.waktu}</td>
                    <td className="py-2.5 font-bold text-slate-900">{trx.santriNama}</td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          trx.tipe === 'Top Up'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {trx.tipe}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-600">{trx.keterangan}</td>
                    <td className="py-2.5 text-right font-bold tabular-nums text-slate-900">
                      Rp {trx.nominal.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 text-slate-500">{trx.kasir}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
