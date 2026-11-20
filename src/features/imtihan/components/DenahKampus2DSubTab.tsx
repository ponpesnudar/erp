import React, { useMemo, useRef, useState } from 'react';
import {
  Building2,
  Layers,
  MapPin,
  Printer,
  Shuffle,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Compass,
  DoorOpen,
  Clock,
  Camera,
} from 'lucide-react';
import { useAppStore } from '../../../lib/store.ts';
import { validateRoom, type RuangUjian } from '../../../lib/rules.ts';
import { triggerReliablePrint } from '../../../lib/printHelper.ts';
import { PrintOrientationControl } from '../../../components/common/PrintOrientationControl.tsx';
import { PrintKopPondok } from '../../../components/common/PrintKopPondok.tsx';
import type { ImtihanRoomConfig } from '../../../data/seed/pondokData.ts';

const TINGKAT_STYLES: Record<number, { pill: string; mini: string; label: string }> = {
  1: {
    pill: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    mini: 'bg-emerald-500/20 border-emerald-500 text-emerald-950',
    label: 'Tingkat 1',
  },
  2: {
    pill: 'bg-sky-100 text-sky-900 border-sky-300',
    mini: 'bg-sky-500/20 border-sky-500 text-sky-950',
    label: 'Tingkat 2',
  },
  3: {
    pill: 'bg-amber-100 text-amber-900 border-amber-300',
    mini: 'bg-amber-500/20 border-amber-500 text-amber-950',
    label: 'Tingkat 3',
  },
  4: {
    pill: 'bg-violet-100 text-violet-900 border-violet-300',
    mini: 'bg-violet-500/20 border-violet-500 text-violet-950',
    label: 'Tingkat 4',
  },
  5: {
    pill: 'bg-rose-100 text-rose-900 border-rose-300',
    mini: 'bg-rose-500/20 border-rose-500 text-rose-950',
    label: 'Tingkat 5',
  },
  6: {
    pill: 'bg-teal-100 text-teal-900 border-teal-300',
    mini: 'bg-teal-500/20 border-teal-500 text-teal-950',
    label: 'Tingkat 6',
  },
};

const BUILDING_ELEVATIONS = [
  {
    id: 'gate',
    title: 'Gerbang Utama Pondok Pesantren',
    subtitle: 'Akses Masuk Komplek & Pos Keamanan Santri',
    photo: '/assets/aistudio/WhatsApp_Image_2025-06-05_at_09.13.58_55ec4aaf__1__31f02986.jpg',
    fallbackPhoto: '/assets/aistudio/preview__14__3b7f388f.webp',
    zoneFilter: 'all' as const,
    roomBadges: ['Pintu Utama Selatan', 'Akses Putra & Putri'],
    caption: 'Gapura utama dua pilar berornamen kaligrafi dengan pagar stainless menuju halaman utama.',
  },
  {
    id: 'masjid',
    title: 'Masjid Darussalam (Zona Pusat)',
    subtitle: 'Serambi Utama & Aula Imtihan Sentral',
    photo: '/assets/aistudio/WhatsApp_Image_2024-05-20_at_18.23.45__1__f6588d90.jpg',
    fallbackPhoto: '/assets/aistudio/preview__14__3b7f388f.webp',
    zoneFilter: 'L' as const,
    roomBadges: ['RUANG 6 PUTRI (Aula)', 'Serambi Ujian Sentral'],
    caption: 'Tampak depan Masjid Darussalam dengan lengkung jendela khas pondok & kanopi serambi melengkung.',
  },
  {
    id: 'madrasah',
    title: 'Gedung Madrasah Diniyah 2 Lantai',
    subtitle: 'Blok Kelas Atas & Bawah Komplek Putra / Putri',
    photo: '/assets/aistudio/DSC06241_b71ceb2f.jpg',
    fallbackPhoto: '/assets/aistudio/preview__14__3b7f388f.webp',
    zoneFilter: 'P' as const,
    roomBadges: ['RUANG 1–5 PUTRA', 'RUANG 1–5 & 7 PUTRI'],
    caption: 'Fasad koloni lengkung 2 lantai dengan balkon merah Lantai 2 & panel kerawang GRC klasik.',
  },
];

function resolveGedung(cfg?: ImtihanRoomConfig, ruang?: RuangUjian): string {
  if (cfg?.gedung?.trim()) return cfg.gedung.trim();
  const lok = (cfg?.lokasi || ruang?.nama || '').toLowerCase();
  if (lok.includes('masjid')) return 'Masjid Darussalam (Pusat)';
  if (cfg?.gender === 'P' || ruang?.gender === 'P' || lok.includes('putri')) {
    return 'Gedung Madrasah & Asrama Putri (GD-C)';
  }
  return 'Gedung Madrasah Utama (GD-A)';
}

function resolveLantai(cfg?: ImtihanRoomConfig): 1 | 2 | 3 {
  if (cfg?.lantai === 1 || cfg?.lantai === 2 || cfg?.lantai === 3) return cfg.lantai;
  const lok = (cfg?.lokasi || '').toLowerCase();
  if (lok.includes('lt. 3') || lok.includes('lt 3') || lok.includes('lantai 3')) return 3;
  if (lok.includes('lt. 2') || lok.includes('lt 2') || lok.includes('lantai 2')) return 2;
  return 1;
}

function formatShortClass(kelas: string): string {
  const parts = kelas.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0]}${parts[1].charAt(0)}`;
  return kelas.slice(0, 4);
}

const DEFAULT_BUILDING_OPTIONS = [
  'Gedung Madrasah Utama (GD-A)',
  'Masjid Darussalam (Pusat)',
  'Gedung Madrasah & Asrama Putri (GD-C)',
];

export const DenahKampus2DSubTab: React.FC = () => {
  const {
    ruangUjianList,
    imtihanMaster,
    printOrientation,
    generateExamSeating,
    swapSeats,
    updateRoomConfig,
    sarprasGedung,
  } = useAppStore();

  const [zoneFilter, setZoneFilter] = useState<'all' | 'L' | 'P'>('all');
  const [floorFilter, setFloorFilter] = useState<'all' | 1 | 2 | 3>('all');
  const [activeRoomId, setActiveRoomId] = useState<string>(ruangUjianList[0]?.id || 'ruang-1');
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const seatingDetailRef = useRef<HTMLDivElement | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  };

  const buildingOptions = useMemo(() => {
    const set = new Set<string>(DEFAULT_BUILDING_OPTIONS);
    sarprasGedung.forEach((g) => {
      if (g.namaGedung?.trim()) set.add(`${g.namaGedung} (${g.kode})`);
    });
    imtihanMaster.roomConfigs.forEach((rc) => {
      if (rc.gedung?.trim()) set.add(rc.gedung.trim());
    });
    return Array.from(set);
  }, [sarprasGedung, imtihanMaster.roomConfigs]);

  const enrichedRooms = useMemo(() => {
    return ruangUjianList.map((ruang) => {
      const cfg = imtihanMaster.roomConfigs.find(
        (rc) => rc.id === ruang.id || rc.kode === ruang.kode
      );
      const gedung = resolveGedung(cfg, ruang);
      const lantai = resolveLantai(cfg);
      const lokasi = cfg?.lokasi || ruang.nama;
      const validation = validateRoom(ruang);
      const occupiedCount = ruang.kursiList.filter((k) => Boolean(k.santri)).length;
      return {
        ruang,
        cfg,
        gedung,
        lantai,
        lokasi,
        validation,
        occupiedCount,
      };
    });
  }, [ruangUjianList, imtihanMaster.roomConfigs]);

  const filteredRooms = useMemo(() => {
    return enrichedRooms.filter((item) => {
      if (zoneFilter !== 'all' && item.ruang.gender !== zoneFilter) return false;
      if (floorFilter !== 'all' && item.lantai !== floorFilter) return false;
      return true;
    });
  }, [enrichedRooms, zoneFilter, floorFilter]);

  const putraRooms = useMemo(
    () => enrichedRooms.filter((r) => r.ruang.gender === 'L'),
    [enrichedRooms]
  );
  const putriRooms = useMemo(
    () => enrichedRooms.filter((r) => r.ruang.gender === 'P'),
    [enrichedRooms]
  );

  const selectBlueprintRoom = (gender: 'L' | 'P', slotIndex: number) => {
    const pool = gender === 'L' ? putraRooms : putriRooms;
    const match = pool[slotIndex] || pool[0] || enrichedRooms[0];
    if (match) {
      setActiveRoomId(match.ruang.id);
      setSelectedSeatId(null);
      notify(`Memilih ${match.ruang.kode} (${match.ruang.nama}) untuk pemetaan bangku.`);
    }
  };

  const buildingGroups = useMemo(() => {
    const groups = new Map<
      string,
      {
        gedung: string;
        floors: Map<number, typeof filteredRooms>;
      }
    >();

    filteredRooms.forEach((item) => {
      if (!groups.has(item.gedung)) {
        groups.set(item.gedung, {
          gedung: item.gedung,
          floors: new Map<number, typeof filteredRooms>(),
        });
      }
      const g = groups.get(item.gedung)!;
      if (!g.floors.has(item.lantai)) {
        g.floors.set(item.lantai, []);
      }
      g.floors.get(item.lantai)!.push(item);
    });

    const preferredOrder = [
      'Gedung Madrasah Utama (GD-A)',
      'Masjid Darussalam (Pusat)',
      'Gedung Madrasah & Asrama Putri (GD-C)',
    ];

    return Array.from(groups.values()).sort((a, b) => {
      const ia = preferredOrder.indexOf(a.gedung);
      const ib = preferredOrder.indexOf(b.gedung);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.gedung.localeCompare(b.gedung);
    });
  }, [filteredRooms]);

  const activeEntry =
    enrichedRooms.find((e) => e.ruang.id === activeRoomId) ||
    filteredRooms[0] ||
    enrichedRooms[0];
  const activeRoom = activeEntry?.ruang;

  const hasFloor3 = enrichedRooms.some((e) => e.lantai === 3);

  const handleSeatClick = (seatId: string) => {
    if (!activeRoom) return;
    if (!selectedSeatId) {
      setSelectedSeatId(seatId);
    } else if (selectedSeatId === seatId) {
      setSelectedSeatId(null);
    } else {
      swapSeats(activeRoom.id, selectedSeatId, seatId);
      setSelectedSeatId(null);
      notify('Posisi bangku peserta berhasil ditukar & divalidasi ulang.');
    }
  };

  const handleAcakUlang = () => {
    generateExamSeating(Math.floor(Math.random() * 100000));
    setSelectedSeatId(null);
    notify('Penempatan bangku seluruh gedung & ruangan berhasil diacak ulang.');
  };

  const handlePrint = () => {
    triggerReliablePrint({
      title: `Denah Ruang Imtihan Cawu ${imtihanMaster.cawu} - ${imtihanMaster.tahunAjaran}`,
      orientation: printOrientation,
      paperSize: 'F4',
      targetElement: sheetRef.current,
    });
  };

  const totalKursi = filteredRooms.reduce((s, r) => s + r.ruang.kapasitas, 0);
  const totalTerisi = filteredRooms.reduce((s, r) => s + r.occupiedCount, 0);
  const totalBentrok = filteredRooms.reduce((s, r) => s + r.validation.conflicts.length, 0);

  return (
    <div className="space-y-6">
      {toast && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Architectural Controls (no-print) */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs space-y-4 no-print">
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Denah Ruang Imtihan 2D &amp; Visualisasi Tampak Depan Gedung</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Peta lokasi komplek Putri &amp; Putra sesuai tata ruang resmi PP NU Darussalam disertai foto tampak depan bangunan dan pemetaan bangku tiap ruang.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <PrintOrientationControl recommended="landscape" />
              <button
                type="button"
                onClick={handleAcakUlang}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Acak Ulang Bangku</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 whitespace-nowrap"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Denah 2D (F4)</span>
              </button>
            </div>
          </div>

          {/* Filters + Live Summary Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-600">Komplek:</span>
              {(
                [
                  { id: 'all', label: 'Semua Komplek' },
                  { id: 'L', label: 'Zona Putra' },
                  { id: 'P', label: 'Zona Putri' },
                ] as const
              ).map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setZoneFilter(z.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold border transition ${
                    zoneFilter === z.id
                      ? 'bg-emerald-800 text-white border-emerald-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {z.label}
                </button>
              ))}

              <span className="font-bold text-slate-600 ml-2">Lantai:</span>
              {(['all', 1, 2, ...(hasFloor3 ? [3] : [])] as const).map((fl) => (
                <button
                  key={String(fl)}
                  type="button"
                  onClick={() => setFloorFilter(fl as 'all' | 1 | 2 | 3)}
                  className={`px-3 py-1.5 rounded-xl font-bold border transition ${
                    floorFilter === fl
                      ? 'bg-sky-700 text-white border-sky-800'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {fl === 'all' ? 'Semua Lantai' : `Lantai ${fl}`}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold tabular-nums">
                {buildingGroups.length} Gedung · {filteredRooms.length} Ruang
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold tabular-nums">
                Terisi {totalTerisi} / {totalKursi} Bangku
              </span>
              <span
                className={`px-2.5 py-1 rounded-lg font-bold border tabular-nums ${
                  totalBentrok === 0
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {totalBentrok === 0 ? '0 Bentrok Sekelas' : `${totalBentrok} Potensi Bentrok`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualisasi Tampak Depan Gedung Pondok (Real Elevation Photos — Image 5, 6, 7) */}
      <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-2xs space-y-3.5 no-print">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <Camera className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Visualisasi Tampak Depan Gedung Pondok Pesantren NU Darussalam</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Referensi fasad bangunan asli pondok agar pengawas dan santri mudah mengenali lokasi gedung ujian.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BUILDING_ELEVATIONS.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/70 flex flex-col justify-between group hover:border-emerald-400 transition"
            >
              <div>
                <div className="relative h-44 bg-slate-200 overflow-hidden">
                  <img
                    src={b.photo}
                    alt={b.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = b.fallbackPhoto;
                    }}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-3 text-white">
                    <p className="text-xs font-black leading-tight">{b.title}</p>
                    <p className="text-[10px] text-emerald-200 font-semibold">{b.subtitle}</p>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-[11px] text-slate-600 leading-relaxed">{b.caption}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {b.roomBadges.map((rb) => (
                      <span
                        key={rb}
                        className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700"
                      >
                        {rb}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-3 pb-3">
                <button
                  type="button"
                  onClick={() => {
                    setZoneFilter(b.zoneFilter);
                    notify(`Menampilkan ruangan untuk area ${b.title}.`);
                  }}
                  className="w-full py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-[11px] font-bold transition"
                >
                  Sorot Ruang Area Ini di Peta
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Printable Architectural 2D Campus Blueprint (Exact Image-4 Master Layout + Gedung Stack + Active Room Sheet) */}
      <div
        ref={sheetRef}
        className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-6 printable-area text-black"
      >
        <PrintKopPondok
          variant="imtihan"
          judulDokumen={`DENAH RUANG IMTIHAN CAWU ${imtihanMaster.cawu}`}
          subJudul={`Tahun Ajaran ${imtihanMaster.tahunAjaran} · ${filteredRooms.length} Ruang Ujian · ${totalTerisi} Peserta Terjadwal`}
          tahunAjaran={imtihanMaster.tahunAjaran}
        />

        {/* OFFICIAL MASTER SITE MAP — MATCHING DENAH_CAWU_2_page-0001_4d92fea1.jpg */}
        <div className="rounded-2xl border-2 border-slate-800 bg-white p-4 sm:p-5 space-y-4 overflow-x-auto break-inside-avoid">
          {/* Header Row: Title + Compass */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3 min-w-[780px]">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-black leading-none">
                DENAH RUANG IMTIHAN CAWU {imtihanMaster.cawu}
              </h2>
              <p className="text-sm font-bold text-slate-700 mt-1">
                Tahun Ajaran {imtihanMaster.tahunAjaran} · Ponpes NU Darussalam Karangdadap
              </p>
            </div>

            {/* Compass Rose (U / B / T / S) */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-[10px] font-bold text-slate-500 text-right hidden sm:block">
                <p>Klik blok Ruang pada peta</p>
                <p>untuk membuka denah bangku</p>
              </div>
              <svg width="78" height="78" viewBox="0 0 100 100" aria-label="Arah Mata Angin">
                <text x="50" y="13" textAnchor="middle" fontSize="14" fontWeight="900" fill="#0f172a">
                  U
                </text>
                <text x="50" y="96" textAnchor="middle" fontSize="14" fontWeight="900" fill="#0f172a">
                  S
                </text>
                <text x="10" y="54" textAnchor="middle" fontSize="14" fontWeight="900" fill="#0f172a">
                  B
                </text>
                <text x="90" y="54" textAnchor="middle" fontSize="14" fontWeight="900" fill="#0f172a">
                  T
                </text>
                <circle cx="50" cy="50" r="22" fill="none" stroke="#0f172a" strokeWidth="1.8" />
                <polygon points="50,18 55,45 50,50 45,45" fill="#0f172a" />
                <polygon points="50,82 55,55 50,50 45,55" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                <polygon points="18,50 45,45 50,50 45,55" fill="#0f172a" />
                <polygon points="82,50 55,45 50,50 55,55" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="3" fill="#dc2626" />
              </svg>
            </div>
          </div>

          {/* 2D Campus Blueprint Canvas (min-w-[820px] so spatial fidelity stays exact) */}
          <div className="min-w-[820px] grid grid-cols-12 gap-3 text-[11px] font-bold">
            {/* LEFT WING: MWC, D Mart, nDalem, Mad. Depan Ndalem, Aula, Waktu Table */}
            <div className="col-span-3 flex flex-col justify-between gap-4 pr-2">
              <div className="space-y-4">
                {/* D Mart & nDalem Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="border-2 border-slate-700 grid grid-cols-2 w-24 h-11 text-center items-center bg-slate-100">
                    <div className="bg-slate-300/70 h-full border-r border-slate-700" />
                    <span className="text-[10px]">D Mart</span>
                  </div>
                  <div className="border-2 border-slate-800 bg-orange-400 text-slate-950 w-14 h-11 flex items-center justify-center shadow-xs">
                    nDalem
                  </div>
                </div>

                {/* MWC Vertical + Mad. Depan Ndalem */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-24 border-2 border-slate-800 bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xs">
                    <span className="-rotate-90 whitespace-nowrap font-black">MWC</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-center text-[10px] font-black">Mad. Depan Ndalem</p>
                    <div className="grid grid-cols-3 border-2 border-slate-700 h-11 bg-slate-200">
                      <div className="border-r border-slate-700" />
                      <div className="border-r border-slate-700" />
                      <div />
                    </div>
                  </div>
                </div>

                {/* Lower Aula West */}
                <div className="pl-16 space-y-1">
                  <p className="text-center text-[10px] font-black">Aula</p>
                  <div className="grid grid-cols-2 border-2 border-slate-700 h-20">
                    <div className="border-r border-slate-700 bg-white" />
                    <div className="grid grid-rows-2">
                      <div className="border-b border-slate-700 bg-lime-100" />
                      <div className="bg-indigo-100" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom-Left Waktu Table (Matching Image 4 exactly) */}
              <div className="border-2 border-emerald-700 rounded-lg overflow-hidden shadow-xs">
                <div className="grid grid-cols-12 bg-emerald-200 border-b border-dashed border-emerald-700">
                  <div className="col-span-7 py-2 px-3 text-center text-sm font-black text-slate-900 flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Waktu</span>
                  </div>
                  <div className="col-span-5 py-2 bg-emerald-300/80 border-l border-dashed border-emerald-700 flex items-center justify-center text-base">
                    ☸
                  </div>
                </div>
                {[
                  { jam: '18.30 - 19.30', arab: 'بعد المغرب' },
                  { jam: '19.30 - 20.30', arab: 'بعد العشاء' },
                  { jam: '15.30 - 16.30', arab: 'بعد العصر' },
                ].map((slot) => (
                  <div
                    key={slot.jam}
                    className="grid grid-cols-12 border-b last:border-b-0 border-dashed border-emerald-600 text-[11px]"
                  >
                    <div className="col-span-7 py-2 px-2 text-center bg-lime-100/80 font-extrabold tabular-nums">
                      {slot.jam}
                    </div>
                    <div
                      dir="rtl"
                      className="col-span-5 py-2 px-2 text-center bg-emerald-100/80 border-l border-dashed border-emerald-600 font-arabic font-bold"
                    >
                      {slot.arab}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT 9 COLS: ZONA KOMPLEK PUTRI (Top, bordered in Red) + ZONA KOMPLEK PUTRA (Bottom) */}
            <div className="col-span-9 flex flex-col gap-5">
              {/* KOMPLEK PUTRI — RED PERIMETER BOUNDARY */}
              <div className="border-l-[3px] border-t-[3px] border-b-[3px] border-rose-600 rounded-tl-sm p-3 bg-rose-50/15 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider">
                    Area Komplek Putri (Terpisah Batas Zona Merah)
                  </span>
                  <div className="grid grid-cols-3 border border-slate-700 w-44 h-10 bg-white">
                    <div className="border-r border-slate-700" />
                    <div className="border-r border-slate-700" />
                    <div />
                  </div>
                </div>

                {/* Top Facility Row: Dapur, Kantin, SKRT PI, Astri East */}
                <div className="grid grid-cols-12 gap-2 items-end">
                  {/* Mad. MA (Atas / Bawah) + RUANG 7 PUTRI */}
                  <div className="col-span-4 space-y-1">
                    <div className="flex justify-around text-[10px] font-black text-slate-700 pl-4">
                      <span>Bawah</span>
                      <span>Atas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="-rotate-90 text-[10px] font-black whitespace-nowrap w-4">
                        Mad. MA
                      </span>
                      <div className="flex-1 grid grid-cols-2 border-2 border-slate-800">
                        <button
                          type="button"
                          onClick={() => selectBlueprintRoom('P', 2)}
                          className="h-11 border-r border-b border-slate-800 bg-gradient-to-br from-amber-300 to-yellow-500 hover:brightness-95 text-[10px] font-black p-1 text-center flex items-center justify-center"
                        >
                          RUANG 7 PUTRI
                        </button>
                        <div className="h-11 border-b border-slate-800 bg-slate-200" />
                        <div className="h-10 border-r border-slate-800 bg-indigo-200/70" />
                        <div className="h-10 bg-sky-100" />
                      </div>
                    </div>
                  </div>

                  {/* Center: Dapur, Kantin, Aula (RUANG 6 PUTRI), Astri (RUANG 4 & 5 PUTRI) */}
                  <div className="col-span-4 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="border-2 border-slate-700 h-14 flex items-center justify-center bg-white">
                        Dapur
                      </div>
                      <div className="border-2 border-slate-700 h-9 flex items-center justify-center bg-white">
                        Kantin
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-center text-[10px] font-black">Aula</p>
                      <button
                        type="button"
                        onClick={() => selectBlueprintRoom('P', 1)}
                        className="w-full h-10 border-2 border-slate-800 bg-gradient-to-r from-red-500 to-rose-400 hover:brightness-95 text-white font-black text-xs flex items-center justify-center shadow-xs"
                      >
                        RUANG 6 PUTRI
                      </button>
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-center text-[10px] font-black">Astri</p>
                      <div className="border-2 border-slate-800">
                        <button
                          type="button"
                          onClick={() => selectBlueprintRoom('P', 0)}
                          className="w-full h-10 border-b border-slate-800 bg-gradient-to-r from-blue-700 to-blue-500 hover:brightness-95 text-white font-black text-xs flex items-center justify-center"
                        >
                          RUANG 4 PUTRI
                        </button>
                        <button
                          type="button"
                          onClick={() => selectBlueprintRoom('P', 1)}
                          className="w-full h-10 bg-gradient-to-r from-purple-800 to-fuchsia-600 hover:brightness-95 text-white font-black text-xs flex items-center justify-center"
                        >
                          RUANG 5 PUTRI
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Putri Wing: SKRT PI + Astri Atas/Bawah + RUANG 3/2/1 PUTRI */}
                  <div className="col-span-4 space-y-2">
                    <div className="grid grid-cols-3 gap-1 items-start">
                      <div className="border-2 border-slate-700 h-16 flex items-center justify-center bg-white text-[10px]">
                        SKRT PI
                      </div>
                      <div className="border-2 border-slate-700 bg-slate-200 grid grid-rows-4 h-36">
                        <div className="border-b border-slate-700" />
                        <div className="border-b border-slate-700" />
                        <div className="border-b border-slate-700 bg-white/60 flex items-center justify-center text-[8px]">
                          Atas
                        </div>
                        <div className="bg-slate-300/70 flex items-center justify-center text-[8px]">
                          Bawah
                        </div>
                      </div>
                      <div className="border-2 border-slate-700 h-16 flex items-center justify-center bg-white text-[10px]">
                        Astri
                      </div>
                    </div>

                    <div className="grid grid-cols-3 border-2 border-slate-800">
                      <button
                        type="button"
                        onClick={() => selectBlueprintRoom('P', 2)}
                        className="h-11 border-r border-slate-800 bg-gradient-to-b from-cyan-400 to-sky-300 hover:brightness-95 text-[9.5px] font-black text-slate-950 p-1 text-center flex items-center justify-center leading-tight"
                      >
                        RUANG 3 PUTRI
                      </button>
                      <button
                        type="button"
                        onClick={() => selectBlueprintRoom('P', 1)}
                        className="h-11 border-r border-slate-800 bg-gradient-to-b from-amber-200 to-yellow-100 hover:brightness-95 text-[9.5px] font-black text-slate-950 p-1 text-center flex items-center justify-center leading-tight"
                      >
                        RUANG 2 PUTRI
                      </button>
                      <button
                        type="button"
                        onClick={() => selectBlueprintRoom('P', 0)}
                        className="h-11 bg-gradient-to-b from-teal-300 to-cyan-200 hover:brightness-95 text-[9.5px] font-black text-slate-950 p-1 text-center flex items-center justify-center leading-tight"
                      >
                        RUANG 1 PUTRI
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* KOMPLEK PUTRA — Asr. Depan (SKRT) + Asr. Belakang (RUANG 1..5 PUTRA Atas & Bawah) */}
              <div className="pl-4 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 w-48">
                    <p className="text-center text-[10px] font-black">Asr. Depan</p>
                    <div className="grid grid-cols-3 border-2 border-slate-800 h-11 bg-white">
                      <div className="border-r border-slate-800 flex items-center justify-center text-[10px]">
                        SKRT
                      </div>
                      <div className="col-span-2" />
                    </div>
                  </div>

                  <div className="flex-1 text-right">
                    <span className="px-2 py-0.5 rounded bg-sky-800 text-white text-[10px] font-black uppercase tracking-wider">
                      Area Komplek Putra
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4 space-y-0.5">
                    <p className="text-xl font-black tracking-tight text-fuchsia-600 leading-none">
                      PUTRA &amp; PUTRI
                    </p>
                    <p className="text-lg font-black tracking-tight text-slate-950 leading-tight uppercase">
                      PONPES NU DARUSSALAM
                    </p>
                    <p className="text-[10px] font-semibold text-slate-500">
                      Karangdadap · Pekalongan
                    </p>
                  </div>

                  <div className="col-span-8 space-y-1">
                    <p className="text-center text-[10px] font-black">Asr. Belakang</p>
                    <div className="flex items-center gap-1">
                      <div className="flex-1 border-2 border-slate-800">
                        {/* Atas Row: RUANG 1 PUTRA .. RUANG 5 PUTRA */}
                        <div className="grid grid-cols-6 border-b border-slate-800">
                          {[
                            { label: 'RUANG 1 PUTRA', bg: 'from-cyan-400 to-sky-300', idx: 0 },
                            { label: 'RUANG 2 PUTRA', bg: 'from-amber-200 to-yellow-100', idx: 1 },
                            { label: 'RUANG 3 PUTRA', bg: 'from-sky-400 to-blue-300', idx: 2 },
                            { label: 'RUANG 4 PUTRA', bg: 'from-lime-400 to-green-300', idx: 3 },
                            { label: 'RUANG 5 PUTRA', bg: 'from-purple-700 to-fuchsia-600 text-white', idx: 2 },
                          ].map((rm) => (
                            <button
                              key={rm.label}
                              type="button"
                              onClick={() => selectBlueprintRoom('L', rm.idx)}
                              className={`h-11 border-r border-slate-800 bg-gradient-to-b ${rm.bg} hover:brightness-95 text-[9px] font-black p-1 text-center flex items-center justify-center leading-tight`}
                            >
                              {rm.label}
                            </button>
                          ))}
                          <div className="h-11 bg-slate-200" />
                        </div>
                        {/* Bawah Row */}
                        <div className="grid grid-cols-6 bg-slate-200/80">
                          {Array.from({ length: 6 }).map((_, bi) => (
                            <div
                              key={bi}
                              className="h-9 border-r last:border-r-0 border-slate-800"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col justify-between h-20 text-[9px] font-black text-slate-700 py-1">
                        <span className="writing-mode-vertical">Atas</span>
                        <span className="writing-mode-vertical">Bawah</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2D Blueprint Building-Floor Stack & Mini Desk Maps */}
        <div className="rounded-2xl border-2 border-slate-300 bg-slate-50/70 p-4 space-y-4">
          {/* Site Compass & Campus Axis */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-dashed border-slate-300 text-[11px]">
            <div className="flex items-center gap-2 font-black text-slate-800 uppercase tracking-wide">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>RINCIAN GEDUNG, LANTAI &amp; PETA BANGKU TIAP RUANGAN</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-600">
              <span>← Barat: Komplek Putra (GD-A)</span>
              <span>·</span>
              <span>Tengah: Masjid &amp; Aula</span>
              <span>·</span>
              <span>Timur: Komplek Putri (GD-C) →</span>
            </div>
          </div>

          {buildingGroups.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 font-semibold">
              Tidak ada ruangan ujian pada filter komplek/lantai ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
              {buildingGroups.map((group) => {
                const floorNumbers = Array.from(group.floors.keys()).sort((a, b) => b - a);
                const buildingRooms = Array.from(group.floors.values()).flat();
                const isPutriBuilding =
                  buildingRooms.length > 0 && buildingRooms.every((r) => r.ruang.gender === 'P');
                const isPutraBuilding =
                  buildingRooms.length > 0 && buildingRooms.every((r) => r.ruang.gender === 'L');

                return (
                  <div
                    key={group.gedung}
                    className={`rounded-2xl border-2 bg-white overflow-hidden shadow-2xs break-inside-avoid ${
                      isPutriBuilding
                        ? 'border-emerald-300'
                        : isPutraBuilding
                        ? 'border-sky-300'
                        : 'border-slate-300'
                    }`}
                  >
                    {/* Building Blueprint Header */}
                    <div
                      className={`px-3.5 py-2.5 border-b flex items-center justify-between gap-2 ${
                        isPutriBuilding
                          ? 'bg-emerald-900 text-white border-emerald-800'
                          : isPutraBuilding
                          ? 'bg-sky-900 text-white border-sky-800'
                          : 'bg-slate-800 text-white border-slate-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-[11px] font-black uppercase tracking-wide truncate flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{group.gedung}</span>
                        </p>
                        <p className="text-[10px] opacity-85 font-semibold">
                          {floorNumbers.length} Lantai · {buildingRooms.length} Ruang Ujian
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg bg-white/15 text-[10px] font-extrabold shrink-0">
                        {isPutriBuilding ? 'PUTRI' : isPutraBuilding ? 'PUTRA' : 'PUSAT'}
                      </span>
                    </div>

                    {/* Stacked Floors (Top Floor -> Ground Floor) */}
                    <div className="p-3 space-y-3 bg-slate-50/60">
                      {floorNumbers.map((fl) => {
                        const roomsOnFloor = (group.floors.get(fl) || []).sort((a, b) =>
                          a.ruang.kode.localeCompare(b.ruang.kode)
                        );
                        return (
                          <div
                            key={fl}
                            className="rounded-xl border border-slate-200 bg-white p-2.5 space-y-2"
                          >
                            {/* Floor Header & Corridor Strip */}
                            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-dashed border-slate-200">
                              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-slate-700">
                                <Layers className="w-3 h-3 text-emerald-700" />
                                Lantai {fl} {fl === 1 ? '(Dasar)' : '(Atas)'}
                              </span>
                              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
                                Koridor &amp; Tangga ↕
                              </span>
                            </div>

                            {/* Rooms Grid inside Floor */}
                            <div
                              className={`grid gap-2.5 ${
                                roomsOnFloor.length >= 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                              }`}
                            >
                              {roomsOnFloor.map((entry) => {
                                const { ruang, lokasi, validation, occupiedCount } = entry;
                                const isActive = activeRoom?.id === ruang.id;
                                const seatMap = new Map(
                                  ruang.kursiList.map((k) => [`${k.baris}-${k.kolom}`, k])
                                );

                                return (
                                  <button
                                    key={ruang.id}
                                    type="button"
                                    onClick={() => {
                                      setActiveRoomId(ruang.id);
                                      setSelectedSeatId(null);
                                      seatingDetailRef.current?.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'nearest',
                                      });
                                    }}
                                    className={`text-left rounded-xl p-2.5 border-2 transition-all relative ${
                                      isActive
                                        ? 'border-emerald-700 bg-emerald-50/40 ring-2 ring-emerald-500/25 shadow-xs'
                                        : 'border-slate-200 bg-slate-50/40 hover:border-emerald-400 hover:bg-white'
                                    }`}
                                  >
                                    {/* Room Title Bar */}
                                    <div className="flex items-start justify-between gap-1.5 mb-1.5">
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          <span
                                            className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                                              ruang.gender === 'L'
                                                ? 'bg-sky-700 text-white'
                                                : 'bg-emerald-700 text-white'
                                            }`}
                                          >
                                            {ruang.kode}
                                          </span>
                                          <span className="text-[11px] font-black text-slate-900 truncate">
                                            {ruang.nama}
                                          </span>
                                        </div>
                                        <p className="text-[9.5px] font-semibold text-slate-500 truncate flex items-center gap-1 mt-0.5">
                                          <MapPin className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                                          <span>{lokasi}</span>
                                        </p>
                                      </div>

                                      <div className="text-right shrink-0">
                                        <span
                                          className={`inline-block text-[9.5px] font-extrabold px-1.5 py-0.5 rounded tabular-nums ${
                                            validation.conflicts.length === 0
                                              ? 'bg-emerald-100 text-emerald-900'
                                              : 'bg-rose-100 text-rose-900'
                                          }`}
                                        >
                                          {occupiedCount}/{ruang.kapasitas}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Mini Front Board / Pengawas Bar */}
                                    <div className="mb-1.5 py-0.5 px-1.5 rounded bg-slate-800 text-white text-[8px] font-bold text-center tracking-wider uppercase flex items-center justify-between">
                                      <span>Meja Pengawas</span>
                                      <span className="inline-flex items-center gap-0.5 text-emerald-300">
                                        <DoorOpen className="w-2.5 h-2.5" /> Pintu
                                      </span>
                                    </div>

                                    {/* Representative Mini 2D Desk Layout */}
                                    <div
                                      className="grid gap-1"
                                      style={{
                                        gridTemplateColumns: `repeat(${ruang.kolom}, minmax(0, 1fr))`,
                                      }}
                                    >
                                      {Array.from({ length: ruang.baris }).map((_, rIdx) =>
                                        Array.from({ length: ruang.kolom }).map((__, cIdx) => {
                                          const k = seatMap.get(`${rIdx}-${cIdx}`);
                                          const santri = k?.santri;
                                          const tStyle = santri
                                            ? TINGKAT_STYLES[santri.tingkat] || TINGKAT_STYLES[1]
                                            : null;
                                          return (
                                            <div
                                              key={`${rIdx}-${cIdx}`}
                                              title={
                                                santri
                                                  ? `B${rIdx + 1}-K${cIdx + 1}: ${santri.nama} (${santri.kelas})`
                                                  : `B${rIdx + 1}-K${cIdx + 1}: Kosong`
                                              }
                                              className={`h-5 rounded border text-[8px] font-extrabold flex items-center justify-center leading-none ${
                                                santri && tStyle
                                                  ? `${tStyle.mini} ${
                                                      k?.bentrok ? 'ring-1 ring-rose-600' : ''
                                                    }`
                                                  : 'bg-white border-dashed border-slate-300 text-slate-300'
                                              }`}
                                            >
                                              {santri ? formatShortClass(santri.kelas) : '·'}
                                            </div>
                                          );
                                        })
                                      )}
                                    </div>

                                    {/* Conflict / Clean Indicator */}
                                    <div className="mt-1.5 flex items-center justify-between text-[9px] font-bold">
                                      <span className="text-slate-500">
                                        {ruang.baris}×{ruang.kolom} bangku
                                      </span>
                                      {validation.conflicts.length === 0 ? (
                                        <span className="text-emerald-700 inline-flex items-center gap-0.5">
                                          <CheckCircle2 className="w-2.5 h-2.5" /> Skor {validation.score}
                                        </span>
                                      ) : (
                                        <span className="text-rose-700 inline-flex items-center gap-0.5">
                                          <AlertTriangle className="w-2.5 h-2.5" /> {validation.conflicts.length} Bentrok
                                        </span>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-[10px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-600">Keterangan Tingkat:</span>
              {Object.entries(TINGKAT_STYLES).map(([lvl, st]) => (
                <span
                  key={lvl}
                  className={`px-2 py-0.5 rounded border font-bold ${st.pill}`}
                >
                  {st.label}
                </span>
              ))}
              <span className="px-2 py-0.5 rounded border border-dashed border-slate-400 bg-white text-slate-500 font-bold">
                Kosong
              </span>
            </div>
            <span className="text-slate-500 font-semibold no-print">
              Klik kartu ruang di peta gedung untuk memetakan &amp; menukar posisi bangku di bawah.
            </span>
          </div>
        </div>

        {/* Selected Room Interactive 2D Seating Placement Detail */}
        {activeRoom && activeEntry && (
          <div
            ref={seatingDetailRef}
            className="rounded-2xl border-2 border-slate-300 bg-white p-4 sm:p-5 space-y-4 break-inside-avoid"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-black text-white ${
                      activeRoom.gender === 'L' ? 'bg-sky-700' : 'bg-emerald-700'
                    }`}
                  >
                    {activeRoom.kode}
                  </span>
                  <h4 className="font-black text-sm text-slate-900">
                    Pemetaan Bangku: {activeRoom.nama} · {activeEntry.lokasi}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {activeEntry.gedung} · Lantai {activeEntry.lantai} · Zona{' '}
                  {activeRoom.gender === 'L' ? 'Putra' : 'Putri'} ·{' '}
                  <strong>
                    {activeEntry.occupiedCount}/{activeRoom.kapasitas} Kursi Terisi
                  </strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {selectedSeatId && (
                  <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1 no-print">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    Pilih kursi kedua untuk menukar posisi
                  </span>
                )}
                {activeEntry.validation.conflicts.length === 0 ? (
                  <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    Bebas Bentrok ({activeEntry.validation.score}/100)
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-xl bg-rose-100 text-rose-900 text-xs font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                    {activeEntry.validation.conflicts.length} Bentrok Sekelas
                  </span>
                )}
              </div>
            </div>

            {/* Quick Inline Room Placement Editor (Building / Floor / Dimensions) */}
            {activeEntry.cfg && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs no-print">
                <div className="lg:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Gedung Penempatan
                  </label>
                  <select
                    value={activeEntry.gedung}
                    onChange={(e) => {
                      updateRoomConfig(activeEntry.cfg!.id, { gedung: e.target.value });
                      notify(`${activeRoom.kode} dipindahkan ke ${e.target.value}.`);
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold"
                  >
                    {buildingOptions.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Lantai Gedung
                  </label>
                  <select
                    value={activeEntry.lantai}
                    onChange={(e) => {
                      const fl = parseInt(e.target.value) as 1 | 2 | 3;
                      updateRoomConfig(activeEntry.cfg!.id, { lantai: fl });
                      notify(`${activeRoom.kode} diatur ke Lantai ${fl}.`);
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold"
                  >
                    <option value={1}>Lantai 1 (Dasar)</option>
                    <option value={2}>Lantai 2 (Atas)</option>
                    <option value={3}>Lantai 3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Lokasi / Nama Ruang
                  </label>
                  <input
                    type="text"
                    value={activeEntry.cfg.lokasi}
                    onChange={(e) =>
                      updateRoomConfig(activeEntry.cfg!.id, { lokasi: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Formasi Bangku (Baris × Kolom)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={2}
                      max={10}
                      value={activeEntry.cfg.baris}
                      onChange={(e) => {
                        const val = Math.max(2, Math.min(10, parseInt(e.target.value) || 4));
                        updateRoomConfig(activeEntry.cfg!.id, { baris: val });
                      }}
                      className="w-14 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-center"
                    />
                    <span className="font-bold text-slate-500">×</span>
                    <input
                      type="number"
                      min={2}
                      max={8}
                      value={activeEntry.cfg.kolom}
                      onChange={(e) => {
                        const val = Math.max(2, Math.min(8, parseInt(e.target.value) || 4));
                        updateRoomConfig(activeEntry.cfg!.id, { kolom: val });
                      }}
                      className="w-14 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-center"
                    />
                    <button
                      type="button"
                      onClick={handleAcakUlang}
                      title="Terapkan dimensi bangku terbaru ke denah"
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold whitespace-nowrap"
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Front Board / Meja Pengawas */}
            <div className="mx-auto max-w-2xl py-2 px-4 rounded-xl bg-slate-900 text-white text-center text-[11px] font-black tracking-widest uppercase">
              PAPAN TULIS &amp; MEJA PENGAWAS UJIAN (DEPAN) · PINTU MASUK
            </div>

            {/* Interactive 2D Desk Grid */}
            <div
              className="grid gap-2.5"
              style={{
                gridTemplateColumns: `repeat(${activeRoom.kolom}, minmax(0, 1fr))`,
              }}
            >
              {activeRoom.kursiList.map((kursi) => {
                const isSelected = selectedSeatId === kursi.id;
                const santri = kursi.santri;
                const tStyle = santri
                  ? TINGKAT_STYLES[santri.tingkat] || TINGKAT_STYLES[1]
                  : null;

                return (
                  <button
                    key={kursi.id}
                    type="button"
                    onClick={() => handleSeatClick(kursi.id)}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-400/50 scale-[1.01]'
                        : kursi.bentrok
                        ? 'border-rose-400 bg-rose-50/70'
                        : santri
                        ? 'border-slate-200 bg-white hover:border-emerald-500 shadow-2xs'
                        : 'border-dashed border-slate-200 bg-slate-50/70 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span>
                        B{kursi.baris + 1}-K{kursi.kolom + 1}
                      </span>
                      {santri?.nomorUjian && (
                        <span className="text-slate-600 tabular-nums">{santri.nomorUjian}</span>
                      )}
                    </div>
                    {santri ? (
                      <>
                        <p className="text-[11px] font-black text-slate-900 leading-tight line-clamp-1">
                          {santri.nama}
                        </p>
                        <span
                          className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold border ${
                            tStyle?.pill || 'bg-slate-100 text-slate-800 border-slate-300'
                          }`}
                        >
                          {santri.kelas}
                        </span>
                      </>
                    ) : (
                      <p className="text-[11px] font-semibold text-slate-400 italic py-1">
                        Bangku Kosong
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
