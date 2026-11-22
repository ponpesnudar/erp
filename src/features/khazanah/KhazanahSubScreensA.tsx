import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  BellOff,
  Bookmark,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Info,
  Loader2,
  MapPin,
  Mic,
  MoreVertical,
  Pause,
  Play,
  RefreshCw,
  Search,
  Settings,
  Share2,
  Volume2,
  X,
} from 'lucide-react';
import { SURAH_ALQURAN_LIST, type SurahRingkas } from '../../data/seed/khazanahData.ts';
import { MAULID_QASIDAH_LIST, TAHLIL_VERSES, WIRID_DOA_GROUPS } from '../../data/seed/khazanahAppSeed.ts';
import { useAppStore } from '../../lib/store.ts';
import {
  calculateQiblaAzimuth,
  fetchPrayerTimesForCoords,
  fetchSurahVerses,
  type GpsLocationInfo,
  type PrayerScheduleDay,
  type QuranAyatItem,
} from '../../lib/quranGpsService.ts';

// Helper Octagonal Islamic Badge for Surah / Wirid Numbers
const OctagonNumberBadge: React.FC<{ num: number | string; variant?: 'gold' | 'mint' }> = ({
  num,
  variant = 'gold',
}) => {
  if (variant === 'mint') {
    return (
      <div className="w-11 shrink-0 self-stretch bg-[#E6F7F2] text-[#00897B] font-bold text-sm flex items-center justify-center rounded-l-xl">
        {num}
      </div>
    );
  }
  return (
    <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
      <svg viewBox="0 0 40 40" className="w-9 h-9 text-[#D8B684]">
        <polygon
          points="20,2 32,8 38,20 32,32 20,38 8,32 2,20 8,8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <polygon
          points="20,5 30,10 35,20 30,30 20,35 10,30 5,20 10,10"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          opacity="0.7"
        />
      </svg>
      <span className="absolute text-[11px] font-bold text-slate-700 tabular-nums">{num}</span>
    </div>
  );
};

// ==========================================
// 1. AL-QUR'AN (ALL 114 SURAHS + REAL AYAT)
// ==========================================
export const QuranMobileScreen: React.FC<{
  onBack: () => void;
  initialSurahNomor?: number;
}> = ({ onBack, initialSurahNomor }) => {
  const [subTab, setSubTab] = useState<'Surah' | 'Juz' | 'Riwayat'>('Surah');
  const [search, setSearch] = useState('');
  const [showSearchHeader, setShowSearchHeader] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState<SurahRingkas | null>(() =>
    initialSurahNomor ? SURAH_ALQURAN_LIST.find((s) => s.nomor === initialSurahNomor) || null : null
  );
  const [verses, setVerses] = useState<QuranAyatItem[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [fromApi, setFromApi] = useState(true);
  const [fontScale, setFontScale] = useState<'normal' | 'besar' | 'sangat_besar'>('normal');
  const [playingSurah, setPlayingSurah] = useState(false);
  const [riwayatNomor, setRiwayatNomor] = useState<number[]>(() => {
    try {
      const saved = window.localStorage.getItem('darussalam_quran_riwayat');
      return saved ? (JSON.parse(saved) as number[]) : [1, 36];
    } catch {
      return [1, 36];
    }
  });
  const [bookmarkedSurahs, setBookmarkedSurahs] = useState<number[]>([]);

  useEffect(() => {
    if (!selectedSurah) return;
    let cancelled = false;
    setLoadingVerses(true);
    setPlayingSurah(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Save reading history
    setRiwayatNomor((prev) => {
      const next = [selectedSurah.nomor, ...prev.filter((n) => n !== selectedSurah.nomor)].slice(0, 15);
      try {
        window.localStorage.setItem('darussalam_quran_riwayat', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    fetchSurahVerses(selectedSurah.nomor).then((res) => {
      if (cancelled) return;
      setVerses(res.ayat);
      setFromApi(res.fromApi);
      setLoadingVerses(false);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedSurah]);

  const filteredSurahs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return SURAH_ALQURAN_LIST;
    return SURAH_ALQURAN_LIST.filter(
      (s) =>
        s.namaLatin.toLowerCase().includes(q) ||
        s.arti.toLowerCase().includes(q) ||
        String(s.nomor) === q
    );
  }, [search]);

  const juzGroups = useMemo(() => {
    const map = new Map<number, SurahRingkas[]>();
    for (let j = 1; j <= 30; j++) map.set(j, []);
    SURAH_ALQURAN_LIST.forEach((s) => {
      const list = map.get(s.juz) || [];
      list.push(s);
      map.set(s.juz, list);
    });
    return Array.from(map.entries());
  }, []);

  const handleToggleRecite = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (playingSurah) {
      window.speechSynthesis.cancel();
      setPlayingSurah(false);
      return;
    }
    const sampleText = verses
      .slice(0, 5)
      .map((v) => v.arti)
      .join('. ');
    const utter = new SpeechSynthesisUtterance(
      `Membaca terjemah Surah ${selectedSurah?.namaLatin}. ${sampleText}`
    );
    utter.lang = 'id-ID';
    utter.rate = 0.95;
    utter.onend = () => setPlayingSurah(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setPlayingSurah(true);
  };

  if (selectedSurah) {
    const arabSizeClass =
      fontScale === 'sangat_besar' ? 'text-3xl leading-[2.4]' : fontScale === 'besar' ? 'text-[26px] leading-[2.2]' : 'text-[22px] leading-[2.1]';
    const isBookmarked = bookmarkedSurahs.includes(selectedSurah.nomor);

    return (
      <div className="flex flex-col flex-1 bg-white min-h-0">
        {/* Teal App Header */}
        <div className="bg-[#00897B] text-white px-3 py-3 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setSelectedSurah(null)}
              className="p-1.5 rounded-full hover:bg-white/15"
              aria-label="Kembali ke daftar surah"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="min-w-0">
              <p className="font-bold text-base truncate">
                {selectedSurah.nomor}. {selectedSurah.namaLatin}
              </p>
              <p className="text-[11px] text-emerald-100 truncate">
                {selectedSurah.arti} · {selectedSurah.jumlahAyat} Ayat · {selectedSurah.turun}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() =>
                setBookmarkedSurahs((prev) =>
                  prev.includes(selectedSurah.nomor)
                    ? prev.filter((x) => x !== selectedSurah.nomor)
                    : [...prev, selectedSurah.nomor]
                )
              }
              className="p-2 rounded-full hover:bg-white/15"
              title="Bookmark Surah"
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-amber-300 text-amber-300' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() =>
                setFontScale((prev) =>
                  prev === 'normal' ? 'besar' : prev === 'besar' ? 'sangat_besar' : 'normal'
                )
              }
              className="px-2 py-1 rounded-lg hover:bg-white/15 font-semibold text-sm"
              title="Ubah Ukuran Huruf"
            >
              aA
            </button>
          </div>
        </div>

        {/* Verse Scroll Body */}
        <div className="flex-1 overflow-y-auto px-4 pb-24">
          {selectedSurah.nomor !== 1 && selectedSurah.nomor !== 9 && (
            <div className="py-5 text-center border-b border-slate-100">
              <p className="font-arabic text-2xl text-slate-900" dir="rtl">
                بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>
            </div>
          )}

          {loadingVerses ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-[#00897B]">
              <Loader2 className="w-7 h-7 animate-spin" />
              <p className="text-xs font-semibold">Memuat seluruh ayat {selectedSurah.namaLatin}...</p>
            </div>
          ) : verses.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-2">
              <p className="text-sm font-bold text-slate-700">Koneksi offline &amp; surah belum tersimpan di cache.</p>
              <p className="text-xs text-slate-500">
                Hubungkan internet sekali untuk mengunduh seluruh {selectedSurah.jumlahAyat} ayat Surah {selectedSurah.namaLatin} agar tersimpan permanen di perangkat Anda.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200/80">
              {!fromApi && verses.length < selectedSurah.jumlahAyat && (
                <div className="my-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                  Mode offline — menampilkan ayat tersimpan lokal ({verses.length}/{selectedSurah.jumlahAyat} ayat). Sambungkan internet untuk memuat penuh.
                </div>
              )}
              {verses.map((v) => (
                <div key={v.nomor} className="py-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <button type="button" className="text-slate-400 pt-1" aria-label="Menu Ayat">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <div className="flex-1 flex items-center justify-end gap-2.5 flex-wrap" dir="rtl">
                      <span className={`font-arabic text-slate-900 text-right ${arabSizeClass}`}>
                        {v.arab}
                      </span>
                      <OctagonNumberBadge num={v.nomor} />
                    </div>
                  </div>
                  {v.latin && (
                    <p className="text-xs text-[#00897B] font-medium leading-relaxed">{v.latin}</p>
                  )}
                  <p className="text-xs text-slate-600 leading-relaxed">{v.arti}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky Bottom Player Bar (Matches Yasin screenshot bottom bar) */}
        <div className="border-t border-slate-200 bg-white px-4 py-2.5 flex items-center justify-between gap-2 shrink-0">
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400">Putar surah</p>
            <p className="text-xs font-extrabold text-slate-900 truncate">
              {selectedSurah.namaLatin} {verses.length}/{selectedSurah.jumlahAyat}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleRecite}
              className="px-3.5 py-1.5 rounded-full bg-[#E6F7F2] text-[#00897B] text-xs font-bold flex items-center gap-1.5"
            >
              {playingSurah ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{playingSurah ? 'Jeda' : 'Putar'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const nextNo = selectedSurah.nomor < 114 ? selectedSurah.nomor + 1 : 1;
                const next = SURAH_ALQURAN_LIST.find((s) => s.nomor === nextNo);
                if (next) setSelectedSurah(next);
              }}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center"
              title="Surah Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      {/* Header matching Al-Quran screenshot */}
      <div className="bg-[#00897B] text-white px-3 pt-3 pb-3.5 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button type="button" onClick={onBack} className="p-1 rounded-full hover:bg-white/15">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold tracking-tight">Al-Quran</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSubTab('Riwayat')}
              className="p-1.5 rounded-full hover:bg-white/15"
              title="Penanda"
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowSearchHeader((s) => !s)}
              className="px-3 py-1 rounded-lg border border-white/70 text-xs font-semibold flex items-center gap-1.5 hover:bg-white/10"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Cari</span>
            </button>
          </div>
        </div>

        {/* 3-Tab Switcher: Surah | Juz | Riwayat */}
        <div className="bg-white rounded-xl p-1 grid grid-cols-3 text-xs font-bold shadow-xs">
          {(['Surah', 'Juz', 'Riwayat'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSubTab(t)}
              className={`py-2 rounded-lg transition ${
                subTab === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      {(subTab === 'Surah' || showSearchHeader) && (
        <div className="px-4 py-3 bg-white border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari Nama Surah"
              className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* List Content */}
      <div className="flex-1 overflow-y-auto px-4 divide-y divide-slate-200/80 pb-20">
        {subTab === 'Surah' &&
          filteredSurahs.map((s) => (
            <button
              key={s.nomor}
              type="button"
              onClick={() => setSelectedSurah(s)}
              className="w-full py-3.5 flex items-center justify-between gap-3 text-left hover:bg-emerald-50/40 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <OctagonNumberBadge num={s.nomor} />
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-slate-900 truncate">{s.namaLatin}</p>
                  <p className="text-xs font-medium text-[#A87643] truncate">
                    {s.arti} ({s.jumlahAyat} Ayat)
                  </p>
                </div>
              </div>
              <span className="font-arabic text-xl text-slate-800 shrink-0" dir="rtl">
                {s.namaArab}
              </span>
            </button>
          ))}

        {subTab === 'Juz' &&
          juzGroups.map(([juzNo, surahs]) => (
            <div key={juzNo} className="py-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-slate-900">Juz {juzNo}</span>
                <span className="text-[11px] font-semibold text-[#00897B]">
                  {surahs.length > 0 ? `${surahs[0].namaLatin}` : 'Lanjutan Surah'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {surahs.map((s) => (
                  <button
                    key={s.nomor}
                    type="button"
                    onClick={() => setSelectedSurah(s)}
                    className="px-2.5 py-1 rounded-lg bg-[#E6F7F2] text-[#00897B] text-xs font-bold"
                  >
                    {s.nomor}. {s.namaLatin}
                  </button>
                ))}
              </div>
            </div>
          ))}

        {subTab === 'Riwayat' && (
          <div className="py-3 divide-y divide-slate-200/80">
            {riwayatNomor.map((n) => {
              const s = SURAH_ALQURAN_LIST.find((item) => item.nomor === n);
              if (!s) return null;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setSelectedSurah(s)}
                  className="w-full py-3.5 flex items-center justify-between gap-3 text-left"
                >
                  <div className="flex items-center gap-3">
                    <OctagonNumberBadge num={s.nomor} />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{s.namaLatin}</p>
                      <p className="text-xs text-[#A87643]">Terakhir dibaca · {s.jumlahAyat} Ayat</p>
                    </div>
                  </div>
                  <span className="font-arabic text-lg text-slate-800">{s.namaArab}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. WIRID & DOA (EXACT 1..8 WIRID & 1..9 DOA)
// ==========================================
export const WiridDoaMobileScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const khazanahCms = useAppStore((s) => s.khazanahItems);
  const [tab, setTab] = useState<'wirid' | 'doa'>('wirid');
  const [search, setSearch] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const cmsWiridDoa = useMemo(
    () => khazanahCms.filter((i) => i.kategori === 'Wirid & Doa'),
    [khazanahCms]
  );

  const groups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return WIRID_DOA_GROUPS.filter(
      (g) => g.tab === tab && (!q || g.judul.toLowerCase().includes(q))
    );
  }, [tab, search]);

  const activeGroup = WIRID_DOA_GROUPS.find((g) => `${g.tab}-${g.no}` === selectedGroupId);

  if (activeGroup) {
    return (
      <div className="flex flex-col flex-1 bg-white min-h-0">
        <div className="bg-[#00897B] text-white px-3 py-3 flex items-center gap-2 shrink-0">
          <button type="button" onClick={() => setSelectedGroupId(null)} className="p-1.5 rounded-full hover:bg-white/15">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="min-w-0">
            <h2 className="text-base font-bold truncate">{activeGroup.judul}</h2>
            <p className="text-[11px] text-emerald-100">{activeGroup.jumlahBacaan} Bacaan</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          {activeGroup.items.map((item, idx) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 p-4 space-y-2.5 bg-white shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#E6F7F2] text-[#00897B] text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{item.judul}</h3>
              </div>
              <p className="font-arabic text-xl leading-[2.1] text-right text-slate-900" dir="rtl">
                {item.arab}
              </p>
              <p className="text-xs text-[#00897B] font-medium leading-relaxed">{item.latin}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{item.arti}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-[#F7F9F8] min-h-0">
      <div className="bg-[#00897B] text-white px-3 py-3 flex items-center justify-between gap-2 shrink-0">
        <button type="button" onClick={onBack} className="p-1 rounded-full hover:bg-white/15">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 max-w-[230px] bg-slate-200/90 rounded-xl p-0.5 grid grid-cols-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab('wirid')}
            className={`py-1.5 rounded-lg transition ${tab === 'wirid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-700'}`}
          >
            Wirid
          </button>
          <button
            type="button"
            onClick={() => setTab('doa')}
            className={`py-1.5 rounded-lg transition ${tab === 'doa' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-700'}`}
          >
            Doa
          </button>
        </div>
        <Bookmark className="w-5 h-5 mr-1" />
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-3 pb-20">
        <div className="flex items-center gap-2 bg-[#ECEFEF] rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Wirid/Doa"
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        <div className="space-y-3">
          {groups.map((g) => (
            <button
              key={`${g.tab}-${g.no}`}
              type="button"
              onClick={() => setSelectedGroupId(`${g.tab}-${g.no}`)}
              className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center text-left overflow-hidden hover:border-[#00897B]/50 transition"
            >
              <OctagonNumberBadge num={g.no} variant="mint" />
              <div className="px-4 py-3.5 min-w-0">
                <p className="text-[15px] font-bold text-slate-900">{g.judul}</p>
                <p className="text-xs text-slate-500 mt-0.5">{g.jumlahBacaan} Bacaan</p>
              </div>
            </button>
          ))}

          {/* Sekretaris CMS Custom Wirid/Doa items synced live */}
          {cmsWiridDoa.map((cms, i) => (
            <div
              key={cms.id}
              className="w-full bg-white rounded-2xl border border-emerald-200 shadow-2xs flex items-center text-left overflow-hidden"
            >
              <OctagonNumberBadge num={groups.length + i + 1} variant="mint" />
              <div className="px-4 py-3 min-w-0">
                <p className="text-sm font-bold text-slate-900">{cms.judul}</p>
                <p className="text-xs text-slate-500 line-clamp-1">{cms.subjudul || cms.isiLengkap}</p>
              </div>
            </div>
          ))}
        </div>

        {tab === 'wirid' && (
          <div className="rounded-2xl bg-[#FAF4EC] border border-[#EDE0CF] px-4 py-3.5 flex items-center justify-between text-[#8B6239]">
            <span className="text-sm font-bold">Artikel Wirid Lainnya</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. JADWAL SHALAT (GPS REAL-TIME)
// ==========================================
export const JadwalShalatMobileScreen: React.FC<{
  onBack: () => void;
  location: GpsLocationInfo;
  onRefreshGps: () => void;
  onOpenLocationPicker: () => void;
  onOpenKiblat: () => void;
}> = ({ onBack, location, onRefreshGps, onOpenLocationPicker, onOpenKiblat }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [schedule, setSchedule] = useState<PrayerScheduleDay | null>(null);
  const [nowSec, setNowSec] = useState(() => Math.floor(Date.now() / 1000));
  const [mutedKeys, setMutedKeys] = useState<Record<string, boolean>>({ imsak: true });

  useEffect(() => {
    const id = window.setInterval(() => setNowSec(Math.floor(Date.now() / 1000)), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchPrayerTimesForCoords(location.lat, location.lng, selectedDate).then((res) => {
      if (!cancelled) setSchedule(res);
    });
    return () => {
      cancelled = true;
    };
  }, [location.lat, location.lng, selectedDate]);

  const nextPrayerInfo = useMemo(() => {
    if (!schedule) return { nama: 'Subuh', waktu: '04:11', countdown: '00 : 30 : 00', activeKey: 'subuh' };
    const now = new Date(nowSec * 1000);
    const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const candidates = schedule.timings;
    for (const t of candidates) {
      const [hh, mm] = t.waktu.split(':').map(Number);
      const tSec = (hh || 0) * 3600 + (mm || 0) * 60;
      if (tSec > currentSeconds) {
        const diff = tSec - currentSeconds;
        const h = String(Math.floor(diff / 3600)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
        const s = String(diff % 60).padStart(2, '0');
        return { nama: t.nama, waktu: t.waktu, countdown: `- ${h} : ${m} : ${s}`, activeKey: t.key };
      }
    }
    return { nama: 'Subuh', waktu: schedule.timings[1]?.waktu || '04:10', countdown: '- 05 : 12 : 00', activeKey: 'subuh' };
  }, [schedule, nowSec]);

  const shiftDate = (delta: number) => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + delta);
      return d;
    });
  };

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0 relative">
      {/* Teal Mosque Silhouette Top Hero matching screenshot */}
      <div className="bg-gradient-to-b from-[#00897B] to-[#007366] text-white px-3 pt-3 pb-10 relative overflow-hidden shrink-0">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <button type="button" onClick={onBack} className="p-1 rounded-full hover:bg-white/15">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold">Jadwal Shalat</h1>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onRefreshGps} className="p-1.5 rounded-full hover:bg-white/15" title="Perbarui GPS">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button type="button" onClick={onOpenLocationPicker} className="p-1.5 rounded-full hover:bg-white/15" title="Pilih Lokasi">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 text-center space-y-1 relative z-10">
          <button
            type="button"
            onClick={onOpenLocationPicker}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-50 hover:underline"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>{location.label}</span>
          </button>
          <p className="text-3xl font-extrabold tracking-tight tabular-nums">
            {nextPrayerInfo.nama} {nextPrayerInfo.waktu} {location.subLabel.includes('WITA') ? 'WITA' : location.subLabel.includes('WIT') ? 'WIT' : 'WIB'}
          </p>
          <p className="text-base font-medium text-emerald-100 tabular-nums">{nextPrayerInfo.countdown}</p>
        </div>

        <div className="mt-4 flex items-center justify-between px-2 text-xs font-semibold relative z-10">
          <button type="button" onClick={onRefreshGps} className="flex items-center gap-1.5 hover:text-amber-200">
            <Compass className="w-4 h-4" />
            <span>Update GPS</span>
          </button>
          <button type="button" onClick={onOpenKiblat} className="flex items-center gap-1.5 hover:text-amber-200">
            <Compass className="w-4 h-4" />
            <span>Arah Kiblat</span>
          </button>
        </div>
      </div>

      {/* Floating Date Card */}
      <div className="px-4 -mt-6 relative z-20 shrink-0">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 px-3 py-3 flex items-center justify-between">
          <button type="button" onClick={() => shiftDate(-1)} className="p-1.5 text-[#00897B] hover:bg-emerald-50 rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="text-sm font-extrabold text-slate-900">{schedule?.masehiLabel || '...'}</p>
            <p className="text-xs text-slate-500 mt-0.5">{schedule?.hijriLabel || ''}</p>
          </div>
          <button type="button" onClick={() => shiftDate(1)} className="p-1.5 text-[#00897B] hover:bg-emerald-50 rounded-full">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Prayer Times Rows */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8 space-y-1.5">
        {(schedule?.timings || []).map((t) => {
          const isNext = t.key === nextPrayerInfo.activeKey;
          const isMuted = mutedKeys[t.key];
          return (
            <div
              key={t.key}
              className={`px-3.5 py-3 rounded-xl flex items-center justify-between transition ${
                isNext ? 'bg-[#E5F7EF]' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{t.key === 'maghrib' || t.key === 'terbit' ? '🌅' : t.key === 'isya' ? '🌙' : '☀️'}</span>
                <span className={`text-[15px] ${isNext ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                  {t.nama}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[15px] tabular-nums ${isNext ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-700'}`}>
                  {t.waktu}
                </span>
                <button
                  type="button"
                  onClick={() => setMutedKeys((m) => ({ ...m, [t.key]: !m[t.key] }))}
                  className="text-slate-500 hover:text-[#00897B]"
                  aria-label="Toggle Adzan"
                >
                  {isMuted ? (
                    <BellOff className="w-4 h-4 text-slate-400" />
                  ) : t.key === 'terbit' || t.key === 'dhuha' ? (
                    <Bell className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}

        <div className="pt-4 pb-2 text-center space-y-0.5">
          <p className="text-xs text-slate-500">Waktu Shalat telah ditashih oleh</p>
          <p className="text-xs font-extrabold text-slate-900 inline-flex items-center gap-1 justify-center">
            <span>Lembaga Falakiyah Nahdlatul Ulama</span>
            <CheckCircle2 className="w-3.5 h-3.5 fill-[#00897B] text-white" />
          </p>
          <p className="text-[10px] text-slate-400">
            Koordinat GPS: {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. ARAH KIBLAT (GPS + COMPASS SENSOR)
// ==========================================
export const KiblatMobileScreen: React.FC<{
  onBack: () => void;
  location: GpsLocationInfo;
  onOpenLocationPicker: () => void;
}> = ({ onBack, location, onOpenLocationPicker }) => {
  const azimuth = useMemo(() => calculateQiblaAzimuth(location.lat, location.lng), [location.lat, location.lng]);
  const [heading, setHeading] = useState(0);
  const [showCalibrateModal, setShowCalibrateModal] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);

  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      if (typeof e.alpha === 'number') {
        setHeading(e.alpha);
      }
    };
    window.addEventListener('deviceorientation', handler, true);
    return () => window.removeEventListener('deviceorientation', handler, true);
  }, []);

  const needleDeg = azimuth - heading;

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-b from-[#00897B] via-[#006F63] to-[#005950] text-white min-h-0 relative">
      {/* Top Bar */}
      <div className="px-3 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBack} className="p-1 rounded-full hover:bg-white/15">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Arah kiblat</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCalibrateModal(true)}
            className="p-1.5 rounded-full hover:bg-white/15"
            title="Kalibrasi Kompas"
          >
            <Info className="w-5 h-5" />
          </button>
          <button type="button" onClick={onOpenLocationPicker} className="p-1.5 rounded-full hover:bg-white/15">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Location & Degree Display */}
      <div className="px-4 text-center space-y-2 mt-2">
        <button
          type="button"
          onClick={onOpenLocationPicker}
          className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
        >
          <MapPin className="w-4 h-4 text-rose-400 fill-rose-400" />
          <span>{location.label}</span>
        </button>
        <p className="text-xs text-emerald-100">Derajat Sudut Kiblat dari Utara</p>
        <p className="text-4xl font-extrabold tracking-tight tabular-nums">{azimuth.toFixed(2)}°</p>
      </div>

      {/* Circular Compass */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
        <div className="relative w-64 h-64 rounded-full bg-white shadow-2xl flex items-center justify-center">
          {/* Compass Ticks */}
          <div className="absolute inset-3 rounded-full border border-slate-200 flex items-center justify-center">
            <span className="absolute top-1.5 font-extrabold text-sm text-[#00897B]">U</span>
            <span className="absolute right-2 font-extrabold text-sm text-[#00897B]">T</span>
            <span className="absolute bottom-1.5 font-extrabold text-sm text-[#00897B]">S</span>
            <span className="absolute left-2 font-extrabold text-sm text-[#00897B]">B</span>
          </div>

          {/* Ka'bah target icon rotated on outer edge */}
          <div
            className="absolute inset-0 transition-transform duration-300"
            style={{ transform: `rotate(${needleDeg}deg)` }}
          >
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-amber-300 flex items-center justify-center text-sm">
              🕋
            </div>
            {/* Needle pointing straight toward Ka'bah */}
            <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-4 flex flex-col items-center">
              <div
                className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[96px] border-b-rose-600"
              />
              <div
                className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[96px] border-t-slate-200"
              />
            </div>
          </div>

          <div className="w-5 h-5 rounded-full bg-slate-200 border-2 border-white shadow-sm z-10" />
        </div>

        {/* Desktop Manual Heading Fine-Tune */}
        <div className="mt-4 w-full max-w-[240px] space-y-1 text-center">
          <p className="text-[11px] text-emerald-100">
            Putar perangkat menghadap barat laut ({azimuth.toFixed(1)}°)
          </p>
          <input
            type="range"
            min={0}
            max={359}
            value={Math.round(heading)}
            onChange={(e) => setHeading(Number(e.target.value))}
            className="w-full accent-amber-300 h-1.5"
          />
        </div>
      </div>

      {/* Bottom Camera Button */}
      <div className="px-6 pb-8">
        <button
          type="button"
          onClick={() => setCameraMode((c) => !c)}
          className="w-full py-3.5 rounded-2xl bg-white text-slate-900 font-bold text-sm shadow-lg hover:bg-emerald-50 transition flex items-center justify-center gap-2"
        >
          <Camera className="w-4 h-4 text-[#00897B]" />
          <span>{cameraMode ? 'Tutup Mode Kamera AR' : 'Arahkan Kiblat dengan Kamera'}</span>
        </button>
      </div>

      {cameraMode && (
        <div className="mx-6 mb-4 p-3 rounded-xl bg-black/50 text-xs text-center border border-white/20">
          Mode Panduan Visual Kiblat aktif pada sudut {azimuth.toFixed(2)}° dari Utara sejati ({location.label}).
        </div>
      )}

      {/* Kalibrasi Kompas Modal matching screenshot */}
      {showCalibrateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5">
          <div className="bg-white text-slate-900 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold">Kalibrasi Kompas Anda</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lakukan gerakan 3 kali membentuk angka delapan (∞), seperti gambar berikut:
            </p>
            <div className="py-6 flex items-center justify-center">
              <svg viewBox="0 0 180 90" className="w-44 h-24 text-sky-500">
                <path
                  d="M 45,45 C 45,18 80,18 90,45 C 100,72 135,72 135,45 C 135,18 100,18 90,45 C 80,72 45,72 45,45 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                />
                <circle cx="90" cy="45" r="4" fill="currentColor" />
              </svg>
            </div>
            <button
              type="button"
              onClick={() => setShowCalibrateModal(false)}
              className="w-full py-3 rounded-xl bg-[#00897B] text-white font-bold text-sm"
            >
              Oke
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. TAHLIL & YASIN (EXACT TOGGLE + 83 AYAT YASIN)
// ==========================================
export const TahlilYasinMobileScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [tab, setTab] = useState<'Tahlil' | 'Yasin'>('Tahlil');
  const [largeFont, setLargeFont] = useState(false);
  const [yasinAyat, setYasinAyat] = useState<QuranAyatItem[]>([]);
  const [loadingYasin, setLoadingYasin] = useState(false);
  const [playingYasin, setPlayingYasin] = useState(false);

  useEffect(() => {
    if (tab !== 'Yasin' || yasinAyat.length > 5) return;
    let cancelled = false;
    setLoadingYasin(true);
    fetchSurahVerses(36).then((res) => {
      if (!cancelled) {
        setYasinAyat(res.ayat);
        setLoadingYasin(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [tab, yasinAyat.length]);

  const handlePlayYasin = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (playingYasin) {
      window.speechSynthesis.cancel();
      setPlayingYasin(false);
      return;
    }
    const text = yasinAyat
      .slice(0, 6)
      .map((a) => a.arti)
      .join('. ');
    const utter = new SpeechSynthesisUtterance(`Surat Yasin. ${text}`);
    utter.lang = 'id-ID';
    utter.onend = () => setPlayingYasin(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setPlayingYasin(true);
  };

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <div className="bg-[#00897B] text-white px-3 py-3 flex items-center justify-between gap-2 shrink-0">
        <button type="button" onClick={onBack} className="p-1 rounded-full hover:bg-white/15">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 max-w-[230px] bg-slate-200/90 rounded-xl p-0.5 grid grid-cols-2 text-xs font-bold">
          {(['Tahlil', 'Yasin'] as const).map((t) => (
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
        <button
          type="button"
          onClick={() => setLargeFont((v) => !v)}
          className="px-2 py-1 rounded-lg hover:bg-white/15 text-sm font-bold"
        >
          aA
        </button>
      </div>

      {tab === 'Tahlil' ? (
        <div className="flex-1 overflow-y-auto px-4 divide-y divide-slate-200 pb-20">
          {TAHLIL_VERSES.map((item) => (
            <div key={item.id} className="py-5 space-y-3">
              <p
                className={`font-arabic text-right text-slate-900 ${
                  largeFont ? 'text-[26px] leading-[2.3]' : 'text-[22px] leading-[2.15]'
                }`}
                dir="rtl"
              >
                {item.arab}
              </p>
              <p className="text-[13px] text-[#00897B] leading-relaxed font-medium">{item.latin}</p>
              <p className="text-[13px] text-slate-500 leading-relaxed">{item.arti}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-4 pb-20">
            <div className="py-5 text-center border-b border-slate-100">
              <p className="font-arabic text-2xl text-slate-900" dir="rtl">
                بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>
            </div>
            {loadingYasin ? (
              <div className="py-12 flex items-center justify-center gap-2 text-[#00897B] text-xs font-bold">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memuat 83 ayat Surat Yasin...</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {yasinAyat.map((a) => (
                  <div key={a.nomor} className="py-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <MoreVertical className="w-4 h-4 text-slate-400 mt-1" />
                      <div className="flex-1 flex items-center justify-end gap-2.5 flex-wrap" dir="rtl">
                        <span className={`font-arabic text-slate-900 text-right ${largeFont ? 'text-2xl leading-[2.2]' : 'text-[22px] leading-[2.1]'}`}>
                          {a.arab}
                        </span>
                        <OctagonNumberBadge num={a.nomor} />
                      </div>
                    </div>
                    {a.latin && <p className="text-[13px] text-[#00897B] font-medium">{a.latin}</p>}
                    <p className="text-[13px] text-slate-600">{a.arti}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white px-4 py-2.5 flex items-center justify-between shrink-0">
            <div>
              <p className="text-[10px] text-slate-400">Putar surah</p>
              <p className="text-xs font-extrabold text-slate-900">Yāsīn 1/{yasinAyat.length || 83}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePlayYasin}
                className="px-3.5 py-1.5 rounded-full bg-[#E6F7F2] text-[#00897B] text-xs font-bold flex items-center gap-1.5"
              >
                {playingYasin ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{playingYasin ? 'Jeda' : 'Putar'}</span>
              </button>
              <span className="w-8 h-8 rounded-full bg-[#E6F7F2] text-[#00897B] flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 6. MAULID & MAHALLUL QIYAM
// ==========================================
export const MaulidMobileScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const khazanahCms = useAppStore((s) => s.khazanahItems);
  const [search, setSearch] = useState('');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [largeFont, setLargeFont] = useState(false);

  const combinedList = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = [...MAULID_QASIDAH_LIST];
    return list.filter((it) => !q || it.judul.toLowerCase().includes(q));
  }, [search]);

  const cmsMaulid = useMemo(
    () => khazanahCms.filter((i) => i.kategori === 'Maulid & Qasidah'),
    [khazanahCms]
  );

  if (selectedIdx !== null && combinedList[selectedIdx]) {
    const item = combinedList[selectedIdx];
    return (
      <div className="flex flex-col flex-1 bg-white min-h-0">
        <div className="bg-[#00897B] text-white px-3 py-3 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button type="button" onClick={() => setSelectedIdx(null)} className="p-1 rounded-full hover:bg-white/15">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <p className="text-sm font-bold truncate">{item.subKategori}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Share2 className="w-4 h-4" />
            <Bookmark className="w-4 h-4" />
            <button type="button" onClick={() => setLargeFont((v) => !v)} className="text-sm font-bold">
              aA
            </button>
          </div>
        </div>

        {/* Sub Pagination Bar 19/49 */}
        <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <button
            type="button"
            disabled={selectedIdx <= 0}
            onClick={() => setSelectedIdx((i) => (i !== null && i > 0 ? i - 1 : i))}
            className="p-1 text-[#00897B] disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="text-[11px] font-bold text-slate-900">{item.no}/41</p>
            <p className="text-xs font-extrabold text-slate-900">{item.judul}</p>
          </div>
          <button
            type="button"
            disabled={selectedIdx >= combinedList.length - 1}
            onClick={() => setSelectedIdx((i) => (i !== null && i < combinedList.length - 1 ? i + 1 : i))}
            className="p-1 text-[#00897B] disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 pb-20">
          <div className="text-center space-y-1">
            <p className="font-arabic text-3xl font-bold text-slate-900">{item.arabTitle}</p>
            <p className="text-sm font-bold text-slate-900">{item.judul}</p>
            <p className="text-[11px] font-semibold text-[#00897B]">{item.subKategori}</p>
          </div>

          <div className="divide-y divide-slate-200">
            {item.baits.map((b, i) => (
              <div key={i} className="py-4 space-y-2.5">
                <p
                  className={`font-arabic text-right text-slate-900 whitespace-pre-line ${
                    largeFont ? 'text-2xl leading-[2.3]' : 'text-xl leading-[2.1]'
                  }`}
                  dir="rtl"
                >
                  {b.arab}
                </p>
                <p className="text-[13px] text-[#00897B] whitespace-pre-line leading-relaxed">{b.latin}</p>
                <p className="text-[13px] text-slate-500 whitespace-pre-line leading-relaxed">{b.arti}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <div className="bg-[#00897B] text-white px-3 py-3 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBack} className="p-1 rounded-full hover:bg-white/15">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Maulid &amp; Mahallul Qiyam</h1>
        </div>
        <Info className="w-5 h-5 mr-1" />
      </div>

      <div className="p-4 flex-1 overflow-y-auto pb-20 space-y-3">
        <div className="flex items-center gap-2 bg-[#F1F3F4] rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari"
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        <div className="divide-y divide-slate-200/80">
          {combinedList.map((item, idx) => (
            <button
              key={item.no}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className="w-full py-3.5 flex items-center justify-between gap-3 text-left hover:bg-emerald-50/40"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-7 text-sm font-bold text-[#00897B] tabular-nums shrink-0">{item.no}</span>
                <span className="text-[15px] font-medium text-slate-900">{item.judul}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </button>
          ))}
          {cmsMaulid.map((c, idx) => (
            <div key={c.id} className="py-3.5 flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3.5">
                <span className="w-7 text-sm font-bold text-[#00897B]">{42 + idx}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{c.judul}</p>
                  <p className="text-[11px] text-slate-500">{c.subjudul}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
