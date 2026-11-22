import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info,
  Layers,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Share2,
  Trash2,
  Video,
  X,
} from 'lucide-react';
import {
  BERSUCI_LIST,
  HAJI_MENU_ITEMS,
  MANASIK_HAJI_STEPS,
  RAMADHAN_LIST_ITEMS,
  TUTORIAL_IBADAH_GROUPS,
  WARIS_HEIRS_LIST,
  ZAKAT_TYPES,
  ZIARAH_AMALAN_LIST,
  ZIARAH_ENTRIES,
  calculateFaraidhMawaris,
  type WarisCalcOutput,
  type ZiarahEntry,
} from '../../data/seed/khazanahAppSeed.ts';
import {
  getHijriAndPasaranForDate,
  haversineDistanceKm,
  type GpsLocationInfo,
} from '../../lib/quranGpsService.ts';
import { useAppStore } from '../../lib/store.ts';

// ==========================================
// 7. KALKULATOR ZAKAT (9 KATEGORI + PERTANIAN & PERDAGANGAN PERSIS SCREENSHOT)
// ==========================================
export const ZakatMobileScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Zakat Pertanian State
  const [jenisTanaman, setJenisTanaman] = useState<'Beras Putih' | 'Gabah' | 'Jagung' | 'Kedelai'>('Beras Putih');
  const [satuanBerat, setSatuanBerat] = useState<'Kilogram' | 'Kuintal' | 'Ton'>('Kilogram');
  const [jumlahPanen, setJumlahPanen] = useState<string>('');
  const [pengairan, setPengairan] = useState<'berbayar' | 'tadah_hujan'>('berbayar');

  // Zakat Perdagangan State
  const [modalDagang, setModalDagang] = useState<string>('');
  const [simpananNuqud, setSimpananNuqud] = useState<string>('');
  const [piutangDagang, setPiutangDagang] = useState<string>('');
  const [utangDagang, setUtangDagang] = useState<string>('');

  // Generic Zakat State (Emas, Profesi, Perusahaan, Properti, Tambak, Peternakan, Produktif)
  const [nilaiHartaLain, setNilaiHartaLain] = useState<string>('');
  const [potonganHutang, setPotonganHutang] = useState<string>('');

  const nishabBerasKg = 815.758;
  const hargaBerasPerKg = 14000;
  const nishabEmasRp = 160661220; // persis screenshot: Nishab Emas 77,5 gram = Rp160.661.220

  const panenKg = useMemo(() => {
    const val = Number(jumlahPanen) || 0;
    if (satuanBerat === 'Kuintal') return val * 100;
    if (satuanBerat === 'Ton') return val * 1000;
    return val;
  }, [jumlahPanen, satuanBerat]);

  const hasilPertanianRp = useMemo(() => {
    if (panenKg < nishabBerasKg) return 0;
    const rate = pengairan === 'berbayar' ? 0.05 : 0.1;
    return Math.round(panenKg * rate * hargaBerasPerKg);
  }, [panenKg, pengairan]);

  const hasilPerdaganganRp = useMemo(() => {
    const bersih =
      (Number(modalDagang) || 0) +
      (Number(simpananNuqud) || 0) +
      (Number(piutangDagang) || 0) -
      (Number(utangDagang) || 0);
    if (bersih < nishabEmasRp) return 0;
    return Math.round(bersih * 0.025);
  }, [modalDagang, simpananNuqud, piutangDagang, utangDagang]);

  const hasilLainRp = useMemo(() => {
    const bersih = Math.max(0, (Number(nilaiHartaLain) || 0) - (Number(potonganHutang) || 0));
    if (selectedType === 'profesi' && bersih < 7000000) return 0;
    if (selectedType !== 'profesi' && selectedType !== 'peternakan' && bersih < nishabEmasRp) return 0;
    return Math.round(bersih * 0.025);
  }, [nilaiHartaLain, potonganHutang, selectedType]);

  if (selectedType === 'pertanian') {
    const wajibKg = panenKg >= nishabBerasKg ? panenKg * (pengairan === 'berbayar' ? 0.05 : 0.1) : 0;
    return (
      <div className="flex flex-col flex-1 bg-white min-h-0">
        <div className="bg-[#00897B] text-white px-3 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setSelectedType(null)} className="p-1 rounded-full hover:bg-white/15">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold">Zakat Pertanian</h1>
          </div>
          <Info className="w-5 h-5 mr-1" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-28">
          <div className="rounded-2xl bg-[#FDF5EB] px-4 py-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7D5A36]">Nishab Beras Putih</p>
              <p className="text-xl font-extrabold text-[#7D5A36] mt-0.5">
                815,758 kg <span className="text-sm font-normal">Beras Putih</span>
              </p>
            </div>
            <Info className="w-5 h-5 text-[#7D5A36]" />
          </div>

          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-[#8D5B34] rounded-full" />
                <h3 className="text-sm font-extrabold text-slate-900">Komponen yang Dihitung</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">Lengkapi seluruh isian berikut untuk menampilkan hasil zakat</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Jenis Hasil Pertanian yang Dihitung</label>
              <select
                value={jenisTanaman}
                onChange={(e) => setJenisTanaman(e.target.value as typeof jenisTanaman)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm font-semibold text-slate-900 bg-white"
              >
                <option value="Beras Putih">Beras Putih</option>
                <option value="Gabah">Gabah</option>
                <option value="Jagung">Jagung</option>
                <option value="Kedelai">Kedelai</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Satuan Berat</label>
              <div className="flex items-center gap-2">
                {(['Kilogram', 'Kuintal', 'Ton'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setSatuanBerat(u)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                      satuanBerat === u
                        ? 'bg-[#E6F7F2] text-[#00897B] border border-[#00897B]'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Jumlah {jenisTanaman} yang Dipanen</label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={jumlahPanen}
                  onChange={(e) => setJumlahPanen(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-3 pr-14 text-sm font-semibold text-slate-900"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  {satuanBerat === 'Kilogram' ? 'kg' : satuanBerat === 'Kuintal' ? 'kw' : 'ton'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600">Jenis Pengairan</label>
              <button
                type="button"
                onClick={() => setPengairan('berbayar')}
                className={`w-full rounded-xl border p-3.5 flex items-center justify-between text-left ${
                  pengairan === 'berbayar' ? 'bg-[#E6F7F2] border-[#00897B]' : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-sm font-semibold text-slate-900">Irigasi berbayar (5%)</span>
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    pengairan === 'berbayar' ? 'border-[#00897B]' : 'border-slate-300'
                  }`}
                >
                  {pengairan === 'berbayar' && <span className="w-2.5 h-2.5 rounded-full bg-[#00897B]" />}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPengairan('tadah_hujan')}
                className={`w-full rounded-xl border p-3.5 flex items-center justify-between text-left ${
                  pengairan === 'tadah_hujan' ? 'bg-[#E6F7F2] border-[#00897B]' : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-sm font-semibold text-slate-900 pr-2">
                  Irigasi tadah hujan atau berasal dari saluran irigasi tidak berbayar (10%)
                </span>
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    pengairan === 'tadah_hujan' ? 'border-[#00897B]' : 'border-slate-300'
                  }`}
                >
                  {pengairan === 'tadah_hujan' && <span className="w-2.5 h-2.5 rounded-full bg-[#00897B]" />}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Output */}
        <div className="border-t border-slate-200 bg-white px-4 py-3 space-y-1.5 shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-700">Jumlah Zakat yang Wajib Dibayarkan</p>
            {wajibKg > 0 && <span className="text-[11px] font-bold text-[#00897B]">({wajibKg.toFixed(1)} kg)</span>}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-xl bg-[#E6F7F2] px-4 py-3 text-lg font-extrabold text-[#00897B] tabular-nums">
              {hasilPertanianRp > 0 ? `Rp${hasilPertanianRp.toLocaleString('id-ID')}` : 'Rp-'}
            </div>
            <button
              type="button"
              onClick={() => setJumlahPanen('')}
              className="w-12 h-12 rounded-xl bg-[#00897B] text-white flex items-center justify-center shrink-0"
              title="Reset"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedType === 'perdagangan') {
    return (
      <div className="flex flex-col flex-1 bg-white min-h-0">
        <div className="bg-[#00897B] text-white px-3 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setSelectedType(null)} className="p-1 rounded-full hover:bg-white/15">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold">Zakat Perdagangan</h1>
          </div>
          <Info className="w-5 h-5 mr-1" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
          <div className="rounded-2xl bg-[#FDF5EB] px-4 py-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7D5A36]">Nishab Emas 77,5 gram</p>
              <p className="text-xl font-extrabold text-[#7D5A36] mt-0.5 tabular-nums">Rp160.661.220</p>
            </div>
            <Info className="w-5 h-5 text-[#7D5A36]" />
          </div>

          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-[#8D5B34] rounded-full" />
              <h3 className="text-sm font-extrabold text-slate-900">Komponen yang Dihitung</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">Lengkapi seluruh isian berikut untuk menampilkan hasil zakat</p>
          </div>

          {[
            { label: 'Modal', val: modalDagang, setVal: setModalDagang },
            { label: 'Simpanan (Nuqud)', val: simpananNuqud, setVal: setSimpananNuqud },
            { label: 'Piutang Dagang (al-Duyun al-Marjuwwah)', val: piutangDagang, setVal: setPiutangDagang },
            { label: 'Utang Tertanggung (Dain al-tajir li al-Tijarah)', val: utangDagang, setVal: setUtangDagang },
          ].map((field) => (
            <div key={field.label} className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
                <span>{field.label}</span>
                <Info className="w-4 h-4 text-[#00897B]" />
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">Rp</span>
                <input
                  type="number"
                  min={0}
                  value={field.val}
                  onChange={(e) => field.setVal(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-sm font-semibold text-slate-900"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 bg-white px-4 py-3 space-y-1.5 shrink-0">
          <p className="text-xs font-semibold text-slate-700">Jumlah Zakat yang Wajib Dibayarkan</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-xl bg-[#E6F7F2] px-4 py-3 text-lg font-extrabold text-[#00897B] tabular-nums">
              {hasilPerdaganganRp > 0 ? `Rp${hasilPerdaganganRp.toLocaleString('id-ID')}` : 'Rp-'}
            </div>
            <button
              type="button"
              onClick={() => {
                setModalDagang('');
                setSimpananNuqud('');
                setPiutangDagang('');
                setUtangDagang('');
              }}
              className="w-12 h-12 rounded-xl bg-[#00897B] text-white flex items-center justify-center shrink-0"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedType) {
    const info = ZAKAT_TYPES.find((z) => z.id === selectedType);
    return (
      <div className="flex flex-col flex-1 bg-white min-h-0">
        <div className="bg-[#00897B] text-white px-3 py-3 flex items-center gap-2 shrink-0">
          <button type="button" onClick={() => setSelectedType(null)} className="p-1 rounded-full hover:bg-white/15">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-base font-bold truncate">{info?.title}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="rounded-2xl bg-[#FDF5EB] px-4 py-3.5">
            <p className="text-xs text-[#7D5A36]">
              {selectedType === 'profesi' ? 'Nishab Bulanan (Setara 85g Emas / 12)' : 'Nishab Emas 77,5 gram'}
            </p>
            <p className="text-xl font-extrabold text-[#7D5A36] mt-0.5">
              {selectedType === 'profesi' ? 'Rp7.000.000 / bln' : 'Rp160.661.220'}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Total Nilai Harta / Penghasilan</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">Rp</span>
              <input
                type="number"
                min={0}
                value={nilaiHartaLain}
                onChange={(e) => setNilaiHartaLain(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-sm font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Kewajiban / Utang Jatuh Tempo</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">Rp</span>
              <input
                type="number"
                min={0}
                value={potonganHutang}
                onChange={(e) => setPotonganHutang(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-sm font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white px-4 py-3 space-y-1.5 shrink-0">
          <p className="text-xs font-semibold text-slate-700">Jumlah Zakat yang Wajib Dibayarkan (2,5%)</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-xl bg-[#E6F7F2] px-4 py-3 text-lg font-extrabold text-[#00897B] tabular-nums">
              {hasilLainRp > 0 ? `Rp${hasilLainRp.toLocaleString('id-ID')}` : 'Rp-'}
            </div>
            <button
              type="button"
              onClick={() => {
                setNilaiHartaLain('');
                setPotonganHutang('');
              }}
              className="w-12 h-12 rounded-xl bg-[#00897B] text-white flex items-center justify-center shrink-0"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-[#F7F9F8] min-h-0">
      <div className="bg-[#00897B] text-white px-3 py-3 flex items-center gap-2 shrink-0">
        <button type="button" onClick={onBack} className="p-1 rounded-full hover:bg-white/15">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">Kalkulator Zakat</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3.5 auto-rows-max pb-20">
        {ZAKAT_TYPES.map((z) => (
          <button
            key={z.id}
            type="button"
            onClick={() => setSelectedType(z.id)}
            className="bg-white rounded-2xl border border-slate-200/80 p-3.5 min-h-[120px] flex flex-col justify-between text-left shadow-2xs hover:border-[#00897B]/50 transition"
          >
            <p className="text-sm font-bold text-slate-900 leading-snug">{z.title}</p>
            <div className="flex justify-end">
              <span className="text-3xl">{z.emoji}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 8. KALKULATOR WARIS + HASIL (PERSIS SCREENSHOT)
// ==========================================
export const WarisMobileScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [mayitGender, setMayitGender] = useState<'L' | 'P'>('P');
  const [heirTab, setHeirTab] = useState<'laki' | 'perempuan'>('laki');
  const [counts, setCounts] = useState<Record<string, number>>({
    suami: 1,
    anak_lk: 1,
    cucu_lk: 1,
    ayah: 1,
    kakek: 1,
  });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [result, setResult] = useState<WarisCalcOutput | null>(null);
  const [totalHarta, setTotalHarta] = useState<string>('');
  const [showPenjelasanModal, setShowPenjelasanModal] = useState(false);

  const visibleHeirs = useMemo(
    () =>
      WARIS_HEIRS_LIST.filter(
        (h) => h.genderTab === heirTab && h.hideWhenMayitGender !== mayitGender
      ),
    [heirTab, mayitGender]
  );

  const maleSelectedCount = useMemo(
    () =>
      WARIS_HEIRS_LIST.filter(
        (h) => h.genderTab === 'laki' && h.hideWhenMayitGender !== mayitGender && (counts[h.id] || 0) > 0
      ).length,
    [counts, mayitGender]
  );

  const femaleSelectedCount = useMemo(
    () =>
      WARIS_HEIRS_LIST.filter(
        (h) => h.genderTab === 'perempuan' && h.hideWhenMayitGender !== mayitGender && (counts[h.id] || 0) > 0
      ).length,
    [counts, mayitGender]
  );

  const toggleHeir = (id: string) => {
    setCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) > 0 ? 0 : 1 }));
  };

  const adjustHeir = (id: string, delta: number) => {
    setCounts((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
  };

  const handleHitung = () => {
    setResult(calculateFaraidhMawaris(mayitGender, counts, Number(totalHarta) || 0));
  };

  if (result) {
    const recalculated = calculateFaraidhMawaris(mayitGender, counts, Number(totalHarta) || 0);
    return (
      <div className="flex flex-col flex-1 bg-white min-h-0">
        <div className="bg-[#00897B] text-white px-3 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setResult(null)} className="p-1 rounded-full hover:bg-white/15">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold">Hasil</h1>
          </div>
          <div className="flex items-center gap-2">
            <Info onClick={() => setShowPenjelasanModal(true)} className="w-5 h-5 cursor-pointer" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-24">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Jumlah Harta Waris</label>
            <input
              type="number"
              min={0}
              value={totalHarta}
              onChange={(e) => setTotalHarta(e.target.value)}
              placeholder="0"
              className="w-full rounded-xl border border-slate-400 px-3.5 py-2.5 text-base font-bold text-slate-900"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl border border-slate-200 p-2.5">
              <p className="text-[11px] text-slate-500">Radd/Aul</p>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">{recalculated.statusRaddAul}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-2.5">
              <p className="text-[11px] text-slate-500">Inkisar</p>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">{recalculated.inkisar}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-2.5">
              <p className="text-[11px] text-slate-500">AM Awal</p>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5 tabular-nums">{recalculated.amAwal}</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-[#8D5B34] rounded-full" />
              <h3 className="text-sm font-extrabold text-slate-900">Pembagian Harta Waris</h3>
            </div>
            <div className="bg-[#E6F7F2] px-3 py-2 rounded-lg text-sm font-extrabold text-[#00897B]">
              Asal Masalah (AM) Akhir: {recalculated.amAkhir}
            </div>

            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="py-2.5 px-3 font-bold">Ahli Waris</th>
                    <th className="py-2.5 px-3 font-bold text-center">Furudh</th>
                    <th className="py-2.5 px-3 font-bold text-center">Siham</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recalculated.shares.map((s) => (
                    <tr key={s.id}>
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-slate-900">{s.label}</p>
                        <p className="font-arabic text-xs text-slate-500">{s.arab}</p>
                        {Number(totalHarta) > 0 && (
                          <p className="text-[10px] font-bold text-[#00897B] mt-0.5">
                            Rp{s.nominalRp.toLocaleString('id-ID')}
                          </p>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-medium text-slate-800">{s.furudh}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900 tabular-nums">{s.siham}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {recalculated.blocked.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 bg-[#8D5B34] rounded-full" />
                <h3 className="text-sm font-extrabold text-slate-900">Terhalang</h3>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <th className="py-2.5 px-3 font-bold">Ahli Waris Terhalang</th>
                      <th className="py-2.5 px-3 font-bold">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {recalculated.blocked.map((b, i) => (
                      <tr key={i}>
                        <td className="py-2.5 px-3">
                          <p className="font-bold text-slate-900">{b.label}</p>
                          <p className="font-arabic text-xs text-slate-500">{b.arab}</p>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">{b.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white p-4 shrink-0">
          <button
            type="button"
            onClick={() => setShowPenjelasanModal(true)}
            className="w-full py-3 rounded-xl bg-[#00897B] text-white font-bold text-sm"
          >
            Lihat Penjelasan
          </button>
        </div>

        {showPenjelasanModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl">
              <h4 className="text-base font-extrabold text-slate-900">Penjelasan Kaidah Faraidh</h4>
              <ul className="space-y-2 text-xs text-slate-700 list-disc pl-4">
                {recalculated.penjelasan.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
                {recalculated.blocked.map((b, idx) => (
                  <li key={`b-${idx}`}>
                    <strong>{b.label}</strong> terhijab hirman {b.reason.toLowerCase()}.
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setShowPenjelasanModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#00897B] text-white font-bold text-xs"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <div className="bg-[#00897B] text-white px-3 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBack} className="p-1 rounded-full hover:bg-white/15">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Kalkulator Waris</h1>
        </div>
        <button type="button" onClick={() => setShowInfoModal(true)} className="p-1 rounded-full hover:bg-white/15">
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Radio Mayit Laki-laki | Mayit Perempuan */}
      <div className="p-4 grid grid-cols-2 gap-3 shrink-0">
        {[
          { id: 'L' as const, label: 'Mayit Laki-laki' },
          { id: 'P' as const, label: 'Mayit Perempuan' },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMayitGender(m.id)}
            className={`rounded-xl border px-3 py-2.5 flex items-center justify-between text-xs font-bold transition ${
              mayitGender === m.id
                ? 'bg-[#E6F7F2] border-[#00897B] text-[#00897B]'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <span>{m.label}</span>
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                mayitGender === m.id ? 'border-[#00897B]' : 'border-slate-300'
              }`}
            >
              {mayitGender === m.id && <span className="w-2 h-2 rounded-full bg-[#00897B]" />}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-[#F3F4F6] py-2 text-center text-xs font-bold text-slate-800 shrink-0">Pilih Ahli Waris</div>

      <div className="grid grid-cols-2 border-b border-slate-200 text-xs font-bold shrink-0">
        <button
          type="button"
          onClick={() => setHeirTab('laki')}
          className={`py-3 border-b-2 transition ${
            heirTab === 'laki' ? 'border-[#00897B] text-slate-900' : 'border-transparent text-slate-400'
          }`}
        >
          Laki-laki {maleSelectedCount > 0 ? `(${maleSelectedCount})` : ''}
        </button>
        <button
          type="button"
          onClick={() => setHeirTab('perempuan')}
          className={`py-3 border-b-2 transition ${
            heirTab === 'perempuan' ? 'border-[#00897B] text-slate-900' : 'border-transparent text-slate-400'
          }`}
        >
          Perempuan {femaleSelectedCount > 0 ? `(${femaleSelectedCount})` : ''}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 divide-y divide-slate-200 pb-24">
        {visibleHeirs.map((h) => {
          const qty = counts[h.id] || 0;
          return (
            <div key={h.id} className="py-3.5 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => toggleHeir(h.id)}
                className="flex items-start gap-3 text-left flex-1 min-w-0"
              >
                <span
                  className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center shrink-0 border ${
                    qty > 0 ? 'bg-[#00897B] border-[#00897B] text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {qty > 0 && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900">{h.nama}</p>
                  <p className="font-arabic text-xs text-slate-500">{h.arab}</p>
                </div>
              </button>

              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden shrink-0">
                <button
                  type="button"
                  disabled={qty <= 0 || !h.multiCount}
                  onClick={() => adjustHeir(h.id, -1)}
                  className="px-2.5 py-1.5 bg-slate-50 text-slate-500 disabled:opacity-35"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-slate-900 tabular-nums">{qty}</span>
                <button
                  type="button"
                  disabled={!h.multiCount && qty >= 1}
                  onClick={() => adjustHeir(h.id, 1)}
                  className="px-2.5 py-1.5 bg-slate-50 text-slate-700 disabled:opacity-35"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-200 bg-white p-4 shrink-0">
        <button
          type="button"
          onClick={handleHitung}
          className="w-full py-3 rounded-xl bg-[#00897B] text-white font-bold text-sm"
        >
          Hitung
        </button>
      </div>

      {/* Modal Penting! Persis Screenshot */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900">Penting!</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Aplikasi ini menggunakan metodologi penghitungan waris sesuai ketentuan hukum syariah dan mencakup berbagai skenario ahli waris yang lengkap. Namun, terdapat 3 kasus khusus yang tidak tercakup:
            </p>
            <ol className="text-xs font-semibold text-slate-700 list-decimal pl-4 space-y-1">
              <li>Masalah munasakhoh¹.</li>
              <li>Masalah khuntsa musykil, orang yang hilang, dan janin.</li>
            </ol>
            <p className="text-[11px] text-slate-500">
              ¹ Munāsakhah adalah keadaan di mana seorang ahli waris meninggal dunia sebelum sempat menerima bagian warisan, sehingga haknya berpindah kepada ahli warisnya sendiri.
            </p>
            <button
              type="button"
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#00897B] text-white font-bold text-xs"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 9. KALENDER HIJRIAH & PASARAN JAWA (PERSIS SCREENSHOT)
// ==========================================
export const KalenderMobileScreen: React.FC = () => {
  const agendaEvents = useAppStore((s) => s.agendaKegiatan);
  const [cursorDate, setCursorDate] = useState<Date>(() => new Date());
  const [selectedDay, setSelectedDay] = useState<number>(() => new Date().getDate());
  const [tab, setTab] = useState<'Agenda Saya' | 'Hari Besar' | 'Puasa'>('Hari Besar');

  const year = cursorDate.getFullYear();
  const monthIdx = cursorDate.getMonth();

  const daysInMonth = useMemo(() => new Date(year, monthIdx + 1, 0).getDate(), [year, monthIdx]);
  const firstWeekday = useMemo(() => new Date(year, monthIdx, 1).getDay(), [year, monthIdx]);

  const cells = useMemo(() => {
    const arr: Array<{ date: Date; inMonth: boolean; info: ReturnType<typeof getHijriAndPasaranForDate> }> = [];
    for (let i = firstWeekday - 1; i >= 0; i--) {
      const d = new Date(year, monthIdx, -i);
      arr.push({ date: d, inMonth: false, info: getHijriAndPasaranForDate(d) });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, monthIdx, day);
      arr.push({ date: d, inMonth: true, info: getHijriAndPasaranForDate(d) });
    }
    while (arr.length < 35) {
      const nextDay = arr.length - firstWeekday - daysInMonth + 1;
      const d = new Date(year, monthIdx + 1, nextDay);
      arr.push({ date: d, inMonth: false, info: getHijriAndPasaranForDate(d) });
    }
    return arr;
  }, [year, monthIdx, daysInMonth, firstWeekday]);

  const selectedInfo = useMemo(
    () => getHijriAndPasaranForDate(new Date(year, monthIdx, selectedDay)),
    [year, monthIdx, selectedDay]
  );

  const monthHeaderInfo = useMemo(() => {
    const startH = getHijriAndPasaranForDate(new Date(year, monthIdx, 1));
    const endH = getHijriAndPasaranForDate(new Date(year, monthIdx, daysInMonth));
    return {
      masehiTitle: `${startH.masehiMonthName} ${year}`,
      hijriRange:
        startH.hijriMonthName === endH.hijriMonthName
          ? `${startH.hijriMonthName} ${startH.hijriYear}`
          : `${startH.hijriMonthName} - ${endH.hijriMonthName} ${endH.hijriYear}`,
    };
  }, [year, monthIdx, daysInMonth]);

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <div className="bg-[#00897B] text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div>
          <p className="text-xs font-bold">
            {selectedInfo.hari} {selectedInfo.pasaran}, {selectedInfo.masehiFull}
          </p>
          <p className="text-[11px] text-emerald-100">{selectedInfo.hijriFull}</p>
        </div>
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          <Settings className="w-5 h-5" />
        </div>
      </div>

      {/* Month Switcher */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 shrink-0">
        <button
          type="button"
          onClick={() => setCursorDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
          className="p-1 text-[#00897B]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="text-sm font-extrabold text-slate-900">{monthHeaderInfo.masehiTitle}</p>
          <p className="text-[11px] text-slate-500">{monthHeaderInfo.hijriRange}</p>
        </div>
        <button
          type="button"
          onClick={() => setCursorDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
          className="p-1 text-[#00897B]"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* 7-Column Calendar Grid */}
        <div className="grid grid-cols-7 bg-[#F5F7F6] text-[11px] font-bold text-slate-700 text-center py-2">
          {['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 border-b border-slate-200">
          {cells.map((cell, idx) => {
            const isSelected = cell.inMonth && cell.date.getDate() === selectedDay;
            const isAhad = cell.date.getDay() === 0;
            const dow = cell.date.getDay();
            const isSeninKamis = dow === 1 || dow === 4;
            const isAyyamulBidh = [13, 14, 15].includes(cell.info.hijriDay);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (!cell.inMonth) {
                    setCursorDate(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1));
                  }
                  setSelectedDay(cell.date.getDate());
                }}
                className={`border-r border-b border-slate-100 py-1.5 px-1 flex flex-col items-center justify-between min-h-[56px] ${
                  isSelected ? 'bg-[#E5F7EF] ring-1 ring-inset ring-[#00897B]' : 'bg-white'
                } ${!cell.inMonth ? 'opacity-30' : ''}`}
              >
                <div className="flex items-baseline gap-1">
                  <span className={`font-arabic text-[10px] ${isAhad ? 'text-rose-500' : 'text-slate-500'}`}>
                    {cell.info.hijriArabDigit}
                  </span>
                  <span
                    className={`text-sm font-extrabold tabular-nums ${
                      isAhad ? 'text-rose-600' : dow === 5 ? 'text-[#00897B]' : 'text-slate-900'
                    }`}
                  >
                    {cell.date.getDate()}
                  </span>
                </div>
                <span className={`text-[9px] ${isSelected ? 'text-[#00897B] font-bold' : 'text-slate-400'}`}>
                  {cell.info.pasaran}
                </span>
                <div className="flex items-center gap-0.5 h-2">
                  {isSeninKamis && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  {isAyyamulBidh && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Event Tabs */}
        <div className="grid grid-cols-3 border-b border-slate-200 text-xs font-bold">
          {(['Agenda Saya', 'Hari Besar', 'Puasa'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`py-3 border-b-2 transition ${
                tab === t ? 'border-[#00897B] text-slate-900' : 'border-transparent text-slate-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-3">
          {tab === 'Hari Besar' && (
            <>
              <div className="flex items-center gap-3 py-2 border-b border-slate-100">
                <div className="w-11 h-11 rounded-xl border border-slate-200 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] text-slate-500">Nov</span>
                  <span className="text-sm font-extrabold text-[#00897B]">10</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900">Hari Pahlawan</p>
                  <p className="text-[11px] text-slate-500">Selasa, 10 November 2026 / 30 Jumadal Ula 1448</p>
                </div>
                <Info className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-center gap-3 py-2 border-b border-slate-100">
                <div className="w-11 h-11 rounded-xl border border-slate-200 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] text-slate-500">Okt</span>
                  <span className="text-sm font-extrabold text-[#00897B]">22</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900">Hari Santri Nasional (Resolusi Jihad NU)</p>
                  <p className="text-[11px] text-slate-500">Memperingati jihad kebangsaan ulama &amp; santri NU</p>
                </div>
                <Info className="w-4 h-4 text-slate-400" />
              </div>
            </>
          )}

          {tab === 'Puasa' && (
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Puasa Sunnah Senin &amp; Kamis</p>
                  <p className="text-slate-600">Ditandai titik kuning pada kalender</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Puasa Ayyamul Bidh (Tanggal 13, 14, 15 Hijriah)</p>
                  <p className="text-slate-600">Ditandai titik biru pada kalender</p>
                </div>
              </div>
            </div>
          )}

          {tab === 'Agenda Saya' && (
            <div className="space-y-2">
              {agendaEvents.map((ag) => (
                <div key={ag.id} className="p-3 rounded-xl border border-slate-200 space-y-0.5">
                  <p className="text-xs font-extrabold text-slate-900">{ag.nama}</p>
                  <p className="text-[11px] text-slate-500">
                    {ag.tanggal} · {ag.ketuaPanitia}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. TUTORIAL IBADAH -> BERSUCI -> CARA WUDHU
// ==========================================
export const TutorialIbadahMobileScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [step, setStep] = useState<'groups' | 'bersuci' | 'wudhu'>('groups');
  const [wudhuTab, setWudhuTab] = useState<'Artikel' | 'Video'>('Artikel');
  const [searchBersuci, setSearchBersuci] = useState('');
  const tutorialLinks = useAppStore((s) => s.tutorialVideoLinks);

  if (step === 'wudhu') {
    return (
      <div className="flex flex-col flex-1 bg-white min-h-0">
        <div className="bg-[#00897B] text-white px-3 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setStep('bersuci')} className="p-1 rounded-full hover:bg-white/15">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold">Cara Wudhu</h1>
          </div>
          <Bookmark className="w-5 h-5 mr-1" />
        </div>

        <div className="grid grid-cols-2 border-b border-slate-200 text-xs font-bold shrink-0">
          {(['Artikel', 'Video'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setWudhuTab(t)}
              className={`py-3 border-b-2 ${
                wudhuTab === t ? 'border-[#00897B] text-[#00897B]' : 'border-transparent text-slate-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 text-sm text-slate-700 leading-relaxed">
          {wudhuTab === 'Artikel' ? (
            <>
              <p>
                Sebelum mendirikan shalat, seorang Muslim wajib bersuci terlebih dahulu dengan berwudhu sebagaimana diperintahkan Allah dalam surat Al-Maidah ayat 6 berikut ini:
              </p>
              <div className="p-4 rounded-2xl bg-[#F9FBF9] border border-slate-200 text-right space-y-2">
                <p className="font-arabic text-xl leading-[2.2] text-slate-900" dir="rtl">
                  يَا أَيُّهَا الَّذِيْنَ آمَنُوْا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوْا وُجُوْهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوْا بِرُءُوْسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ
                </p>
              </div>
              <p className="text-xs text-slate-600">
                <strong>Artinya:</strong> &ldquo;Wahai orang-orang yang beriman, apabila kamu hendak melaksanakan shalat, maka basuhlah wajahmu dan tanganmu sampai ke siku, serta usaplah kepalamu dan (basuh) kedua kakimu sampai ke kedua mata kaki.&rdquo;
              </p>
              <p className="text-xs text-slate-600">
                Dalam hadits yang diriwayatkan oleh Imam Muslim dari Ibnu Umar ditegaskan bahwa:
              </p>
              <div className="p-3.5 rounded-2xl bg-[#E6F7F2] text-slate-800 space-y-1">
                <p className="font-bold text-xs text-[#00897B]">Niat Wudhu</p>
                <p className="font-arabic text-lg text-right" dir="rtl">
                  نَوَيْتُ الْوُضُوْءَ لِرَفْعِ الْحَدَثِ الْأَصْغَرِ فَرْضًا لِلّٰهِ تَعَالٰى
                </p>
                <p className="text-xs">Nawaitul-wuḍū’a liraf‘il-ḥadaṡil-aṣghari farḍan lillāhi ta‘ālā.</p>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              {(() => {
                const activeTutorialVideos = Object.values(tutorialLinks).filter((l) => Boolean(l?.url));
                const firstVid = activeTutorialVideos[0];
                const ytMatch = firstVid?.url?.match(
                  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/
                );
                const thumbSrc =
                  firstVid?.thumbnailUrl ||
                  (ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg` : '');

                return (
                  <div className="rounded-2xl bg-slate-900 text-white overflow-hidden border border-slate-800 shadow-sm">
                    {thumbSrc ? (
                      <div className="relative aspect-video w-full bg-black">
                        <img
                          src={thumbSrc}
                          alt={firstVid?.judul || 'Video Tutorial Santri'}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black">
                            {firstVid?.sumberType || 'Video Tutorial'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-5 px-5 text-center">
                        <Video className="w-8 h-8 text-amber-300 mx-auto" />
                      </div>
                    )}
                    <div className="p-4 text-center space-y-2">
                      <p className="text-sm font-bold">
                        {firstVid?.judul || 'Video Tutorial Tata Cara Wudhu Santri'}
                      </p>
                      <p className="text-xs text-slate-300">
                        Praktek berwudhu sesuai Kitab Safinatun Najah &amp; Fathul Qorib
                      </p>
                      {firstVid && (
                        <a
                          href={firstVid.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00897B] text-white text-xs font-bold"
                        >
                          <span>Tonton Video</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'bersuci') {
    const filtered = BERSUCI_LIST.filter(
      (b) => !searchBersuci.trim() || b.judul.toLowerCase().includes(searchBersuci.toLowerCase())
    );
    return (
      <div className="flex flex-col flex-1 bg-[#F7F9F8] min-h-0">
        <div className="bg-[#00897B] text-white px-3 py-3 flex items-center gap-2 shrink-0">
          <button type="button" onClick={() => setStep('groups')} className="p-1 rounded-full hover:bg-white/15">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Bersuci</h1>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-3 pb-20">
          <div className="flex items-center gap-2 bg-[#ECEFEF] rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchBersuci}
              onChange={(e) => setSearchBersuci(e.target.value)}
              placeholder="Cari"
              className="w-full bg-transparent text-sm focus:outline-hidden"
            />
          </div>

          {filtered.map((item) => (
            <button
              key={item.no}
              type="button"
              onClick={() => setStep('wudhu')}
              className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center text-left overflow-hidden"
            >
              <div className="w-11 shrink-0 self-stretch bg-[#E6F7F2] text-[#00897B] font-bold text-sm flex items-center justify-center">
                {item.no}
              </div>
              <div className="px-4 py-3.5 text-sm font-medium text-slate-900">{item.judul}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-[#F7F9F8] min-h-0">
      <div className="bg-[#00897B] text-white px-3 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBack} className="p-1 rounded-full hover:bg-white/15">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Tutorial Ibadah</h1>
        </div>
        <Layers className="w-5 h-5 mr-1" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
        <button
          type="button"
          onClick={() => setStep('bersuci')}
          className="w-full rounded-2xl bg-[#FDF5EB] border border-[#EDE0CF] px-4 py-3.5 flex items-center justify-between text-[#8B6239]"
        >
          <span className="text-sm font-bold">Lihat Playlist Video Tutorial Ibadah</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {TUTORIAL_IBADAH_GROUPS.map((g) => (
          <button
            key={g.no}
            type="button"
            onClick={() => setStep('bersuci')}
            className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center text-left overflow-hidden hover:border-[#00897B]/50 transition"
          >
            <div className="w-11 shrink-0 self-stretch bg-[#E6F7F2] text-[#00897B] font-bold text-sm flex items-center justify-center">
              {g.no}
            </div>
            <div className="px-4 py-3.5">
              <p className="text-[15px] font-bold text-slate-900">{g.judul}</p>
              <p className="text-xs text-slate-500 mt-0.5">{g.countLabel}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 11. ZIARAH (TOKOH | DESTINASI | AMALAN — GPS DISTANCE)
// ==========================================
export const ZiarahMobileScreen: React.FC<{
  onBack: () => void;
  location: GpsLocationInfo;
  onOpenLocationPicker: () => void;
}> = ({ onBack, location, onOpenLocationPicker }) => {
  const [tab, setTab] = useState<'Tokoh' | 'Destinasi' | 'Amalan'>('Tokoh');
  const [search, setSearch] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<ZiarahEntry | null>(null);

  const sortedEntries = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ZIARAH_ENTRIES.filter((e) => e.tab === tab && (!q || e.nama.toLowerCase().includes(q) || e.kota.toLowerCase().includes(q)))
      .map((e) => ({
        ...e,
        distKm: haversineDistanceKm(location.lat, location.lng, e.lat, e.lng),
      }))
      .sort((a, b) => a.distKm - b.distKm);
  }, [tab, search, location.lat, location.lng]);

  if (selectedEntry) {
    return (
      <div className="flex flex-col flex-1 bg-white min-h-0">
        <div className="bg-[#00897B] text-white px-3 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setSelectedEntry(null)} className="p-1 rounded-full hover:bg-white/15">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold">{selectedEntry.tab === 'Tokoh' ? 'Makam Tokoh' : 'Destinasi Ziarah'}</h1>
          </div>
          <Share2 className="w-5 h-5 mr-1" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-20">
          <div className="h-44 rounded-2xl bg-gradient-to-br from-[#00897B]/15 to-emerald-50 border border-slate-200 flex items-center justify-center flex-col gap-2">
            <div className="w-20 h-20 rounded-full bg-[#00897B] text-white text-2xl font-extrabold flex items-center justify-center shadow-md">
              {selectedEntry.avatarText}
            </div>
            <p className="text-base font-extrabold text-slate-900">{selectedEntry.nama}</p>
            <p className="text-xs text-slate-500">{selectedEntry.kota}</p>
          </div>

          <div className="space-y-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-[#8D5B34] rounded-full" />
              <h3 className="text-sm font-extrabold text-slate-900">Lokasi Makam</h3>
            </div>
            <div className="rounded-xl bg-[#F3F4F6] p-3 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-[#00897B]" />
                <span>
                  {haversineDistanceKm(location.lat, location.lng, selectedEntry.lat, selectedEntry.lng).toFixed(1)} KM dari {location.label}
                </span>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedEntry.lat},${selectedEntry.lng}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#00897B] flex items-center gap-1 shrink-0"
              >
                <span>Arahkan ke Lokasi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-[#8D5B34] rounded-full" />
              <h3 className="text-sm font-extrabold text-slate-900">Informasi</h3>
            </div>
            {selectedEntry.lahir && (
              <div>
                <p className="text-slate-400">Lahir</p>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedEntry.lahir}</p>
              </div>
            )}
            {selectedEntry.wafat && (
              <div>
                <p className="text-slate-400">Wafat</p>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedEntry.wafat}</p>
              </div>
            )}
            <p className="text-slate-600 leading-relaxed pt-1">{selectedEntry.biografi}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <div className="bg-[#00897B] text-white px-3 pt-3 pb-3 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button type="button" onClick={onBack} className="p-1 rounded-full hover:bg-white/15">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold">Ziarah</h1>
          </div>
          <Info className="w-5 h-5 mr-1" />
        </div>

        <div className="bg-slate-200/95 rounded-xl p-1 grid grid-cols-3 text-xs font-bold">
          {(['Tokoh', 'Destinasi', 'Amalan'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`py-2 rounded-lg transition ${tab === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-700'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab !== 'Amalan' ? (
        <div className="flex-1 overflow-y-auto pb-20">
          <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-1.5 text-xs">
            <MapPin className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="font-semibold text-slate-700">Lokasi Terdekat: {location.label}</span>
            <button type="button" onClick={onOpenLocationPicker} className="text-[#00897B] font-bold">
              (Ganti)
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 bg-[#F1F3F4] rounded-xl px-3 py-2.5">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari Makam Tokoh dan Destinasi"
                className="w-full bg-transparent text-sm focus:outline-hidden"
              />
            </div>

            <div className="divide-y divide-slate-200/80">
              {sortedEntries.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedEntry(item)}
                  className="w-full py-3.5 flex items-center gap-3 text-left"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00897B] to-emerald-800 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs">
                    {item.avatarText}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-[15px] font-bold text-slate-900 truncate">{item.nama}</p>
                    <p className="text-xs text-slate-500 truncate">{item.kota}</p>
                    <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
                      <span className="text-[#00897B]">● {item.kategoriLabel}</span>
                      <span>📍 {item.distKm.toFixed(1)} KM</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20 bg-[#F7F9F8]">
          {ZIARAH_AMALAN_LIST.map((judul, idx) => (
            <div
              key={judul}
              className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center overflow-hidden"
            >
              <div className="w-11 shrink-0 self-stretch bg-[#E6F7F2] text-[#00897B] font-bold text-sm flex items-center justify-center">
                {idx + 1}
              </div>
              <div className="px-4 py-3.5 text-sm font-bold text-slate-900">{judul}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 12. HAJI & UMRAH (EXACT TOGGLE + 8 MANASIK)
// ==========================================
export const HajiUmrahMobileScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [tab, setTab] = useState<'Haji' | 'Umrah'>('Haji');
  const [subScreen, setSubScreen] = useState<'menu' | 'manasik'>('menu');
  const [selectedStep, setSelectedStep] = useState<typeof MANASIK_HAJI_STEPS[number] | null>(null);

  if (selectedStep) {
    return (
      <div className="flex flex-col flex-1 bg-white min-h-0">
        <div className="bg-[#00897B] text-white px-3 py-3 flex items-center justify-between shrink-0">
          <button type="button" onClick={() => setSelectedStep(null)} className="p-1 rounded-full hover:bg-white/15">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <Share2 className="w-5 h-5" />
            <Bookmark className="w-5 h-5" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900">{selectedStep.judul}</h2>
          <p className="text-xs font-semibold text-slate-400">Panduan Manasik {tab} · LBM PP NU Darussalam</p>
          <p className="text-sm text-slate-700 leading-relaxed">{selectedStep.isi}</p>
        </div>
      </div>
    );
  }

  if (subScreen === 'manasik') {
    return (
      <div className="flex flex-col flex-1 bg-[#F7F9F8] min-h-0">
        <div className="bg-[#00897B] text-white px-3 py-3 flex items-center gap-2 shrink-0">
          <button type="button" onClick={() => setSubScreen('menu')} className="p-1 rounded-full hover:bg-white/15">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Urutan Manasik {tab}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
          {MANASIK_HAJI_STEPS.map((st) => (
            <button
              key={st.no}
              type="button"
              onClick={() => setSelectedStep(st)}
              className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center text-left overflow-hidden"
            >
              <div className="w-11 shrink-0 self-stretch bg-[#E6F7F2] text-[#00897B] font-bold text-sm flex items-center justify-center">
                {st.no}
              </div>
              <div className="px-4 py-3.5 text-sm font-bold text-slate-900">{st.judul}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-[#F7F9F8] min-h-0">
      <div className="bg-[#00897B] text-white px-3 py-3 flex items-center gap-2 shrink-0">
        <button type="button" onClick={onBack} className="p-1 rounded-full hover:bg-white/15">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 max-w-[230px] bg-slate-200/90 rounded-xl p-0.5 grid grid-cols-2 text-xs font-bold">
          {(['Haji', 'Umrah'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`py-1.5 rounded-lg transition ${tab === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-700'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
        {HAJI_MENU_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setSubScreen('manasik')}
            className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3 overflow-hidden p-3.5 relative text-left"
          >
            <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#00897B]" />
            <span className="w-10 h-10 rounded-full bg-[#E6F7F2] flex items-center justify-center text-lg ml-1 shrink-0">
              {item.icon}
            </span>
            <span className="text-[15px] font-bold text-slate-900">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 13. RAMADHAN (CHIPS + 1..12 PERSIS SCREENSHOT)
// ==========================================
export const RamadhanMobileScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<typeof RAMADHAN_LIST_ITEMS[number] | null>(null);

  if (selectedItem) {
    return (
      <div className="flex flex-col flex-1 bg-white min-h-0">
        <div className="bg-[#00897B] text-white px-3 py-3 flex items-center gap-2 shrink-0">
          <button type="button" onClick={() => setSelectedItem(null)} className="p-1 rounded-full hover:bg-white/15">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-base font-bold truncate">{selectedItem.judul}</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <p className="font-arabic text-2xl leading-[2.2] text-right text-slate-900" dir="rtl">
            {selectedItem.arab}
          </p>
          <p className="text-sm font-medium text-[#00897B]">{selectedItem.latin}</p>
          <p className="text-sm text-slate-600">{selectedItem.arti}</p>
        </div>
      </div>
    );
  }

  const filtered = RAMADHAN_LIST_ITEMS.filter(
    (r) => !search.trim() || r.judul.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 bg-[#F7F9F8] min-h-0">
      <div className="bg-[#00897B] text-white px-3 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBack} className="p-1 rounded-full hover:bg-white/15">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Ramadhan</h1>
        </div>
        <CalendarIcon className="w-5 h-5 mr-1" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['Artikel Ramadhan', 'Khutbah Ramadhan', 'Niat & Doa'].map((chip) => (
            <span
              key={chip}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 whitespace-nowrap"
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-[#ECEFEF] rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari"
            className="w-full bg-transparent text-sm focus:outline-hidden"
          />
        </div>

        {filtered.map((item) => (
          <button
            key={item.no}
            type="button"
            onClick={() => setSelectedItem(item)}
            className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center text-left overflow-hidden"
          >
            <div className="w-11 shrink-0 self-stretch bg-[#E6F7F2] text-[#00897B] font-bold text-sm flex items-center justify-center">
              {item.no}
            </div>
            <div className="px-4 py-3.5 text-sm font-medium text-slate-900">{item.judul}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 14. KALAM & ARTIKEL (INFOGRAFIK + MUTIARA KATA + CMS)
// ==========================================
export const KalamMobileScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const khazanahCms = useAppStore((s) => s.khazanahItems);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const cmsKalam = useMemo(
    () => khazanahCms.filter((i) => i.kategori === 'Kalam & Infografik'),
    [khazanahCms]
  );

  const infografikCards = [
    {
      id: 'inf-1',
      title: 'Saat Ragu soal Status Wudhu',
      arab: 'اَلْيَقِيْنُ لَا يُزَالُ بِالشَّكِّ',
      summary: 'Keyakinan tidak dapat dihilangkan oleh keraguan yang datang kemudian. Jika yakin sudah wudhu lalu ragu batal, hukumnya tetap suci.',
    },
    {
      id: 'inf-2',
      title: 'Makmum Masbuk Datang saat Imam Qunut',
      arab: 'فَلْيَصْنَعْ كَمَا يَصْنَعُ الْإِمَامُ',
      summary: 'Ikuti posisi imam berdiri dan aminkan doa qunut Subuh, lalu tambah rakaat yang tertinggal setelah imam salam.',
    },
    {
      id: 'inf-3',
      title: 'Tuntutan Taat kepada Orang Tua',
      arab: 'وَبِالْوَالِدَيْنِ إِحْسَانًا',
      summary: 'Berbakti kepada kedua orang tua merupakan pintu ridha Allah SWT setelah perintah bertauhid.',
    },
  ];

  const mutiaraCards = [
    {
      quote: '“Harta tidak berkurang karena sedekah, maka bersedekahlah!”',
      source: '(HR Ibnu ‘Adi)',
      bg: 'bg-[#F4EEE4]',
    },
    {
      quote: '“Sungguh pintu terbesar iblis untuk masuk ke dalam diri manusia adalah kebodohan.”',
      source: '(Imam Ibnul Jauzi)',
      bg: 'bg-[#EAF4ED]',
    },
    {
      quote: '“Banyak manusia teledor dalam dua nikmat: kesehatan dan waktu senggang.”',
      source: '(HR al-Bukhari)',
      bg: 'bg-[#EEF1F6]',
    },
  ];

  const openedCms = khazanahCms.find((x) => x.id === selectedArticleId);
  if (openedCms) {
    return (
      <div className="flex flex-col flex-1 bg-white min-h-0">
        <div className="bg-[#00897B] text-white px-3 py-3 flex items-center gap-2 shrink-0">
          <button type="button" onClick={() => setSelectedArticleId(null)} className="p-1 rounded-full hover:bg-white/15">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-base font-bold truncate">{openedCms.judul}</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {openedCms.teksArab && (
            <p className="font-arabic text-xl text-right text-slate-900" dir="rtl">
              {openedCms.teksArab}
            </p>
          )}
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{openedCms.isiLengkap}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <div className="bg-[#00897B] text-white px-3 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {onBack && (
            <button type="button" onClick={onBack} className="p-1 rounded-full hover:bg-white/15">
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-lg font-bold">Kalam</h1>
        </div>
        <Search className="w-5 h-5 mr-1" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
        {/* Section Terbaru */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Terbaru</h2>
            <ChevronRight className="w-4 h-4 text-[#00897B]" />
          </div>
          {cmsKalam.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedArticleId(item.id)}
              className="w-full p-3.5 rounded-2xl border border-slate-200 bg-white text-left space-y-1 shadow-2xs"
            >
              <span className="text-[10px] font-bold text-[#00897B]">{item.subKategori}</span>
              <p className="text-sm font-bold text-slate-900">{item.judul}</p>
              <p className="text-xs text-slate-500 line-clamp-2">{item.subjudul || item.isiLengkap}</p>
            </button>
          ))}
        </div>

        {/* Section Infografik */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Infografik</h2>
            <ChevronRight className="w-4 h-4 text-[#00897B]" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {infografikCards.map((card) => (
              <div
                key={card.id}
                className="w-48 shrink-0 rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs"
              >
                <div className="h-28 bg-gradient-to-br from-[#00897B] to-emerald-900 p-3 flex flex-col justify-between text-white">
                  <p className="font-arabic text-sm text-amber-200 text-right">{card.arab}</p>
                  <p className="text-xs font-extrabold leading-tight">{card.title}</p>
                </div>
                <div className="p-2.5">
                  <p className="text-[11px] font-bold text-slate-800 line-clamp-2">{card.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Mutiara Kata */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Mutiara Kata</h2>
            <ChevronRight className="w-4 h-4 text-[#00897B]" />
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {mutiaraCards.map((m, idx) => (
              <div key={idx} className={`${m.bg} rounded-2xl p-4 space-y-1.5 border border-slate-200/60`}>
                <p className="text-sm font-bold text-slate-800 leading-relaxed">{m.quote}</p>
                <p className="text-[11px] font-bold text-[#00897B]">{m.source}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 15. TASBIH DIGITAL & EXTRA MENU SCREENS
// ==========================================
export const TasbihMobileScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState<33 | 99 | 100>(33);
  const [dzikir, setDzikir] = useState('سُبْحَانَ اللهِ');

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <div className="bg-[#00897B] text-white px-3 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBack} className="p-1 rounded-full hover:bg-white/15">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Tasbih Digital</h1>
        </div>
        <button type="button" onClick={() => setCount(0)} className="p-1.5 rounded-full hover:bg-white/15">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col items-center justify-between">
        <div className="flex flex-wrap gap-2 justify-center">
          {['سُبْحَانَ اللهِ', 'اَلْحَمْدُ لِلّٰهِ', 'اَللهُ أَكْبَرُ', 'لَا إِلٰهَ إِلَّا اللهُ'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDzikir(d)}
              className={`px-3 py-1.5 rounded-xl font-arabic text-sm font-bold border ${
                dzikir === d ? 'bg-[#E6F7F2] border-[#00897B] text-[#00897B]' : 'border-slate-200 text-slate-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="w-56 h-56 rounded-full bg-gradient-to-br from-[#00897B] to-[#005D53] text-white shadow-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition"
        >
          <span className="font-arabic text-2xl text-amber-200">{dzikir}</span>
          <span className="text-5xl font-extrabold tabular-nums">{count}</span>
          <span className="text-xs text-emerald-100">Ketuk untuk hitung · Target {target}</span>
        </button>

        <div className="flex items-center gap-2">
          {([33, 99, 100] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTarget(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                target === t ? 'bg-[#00897B] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {t}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
