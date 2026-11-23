import { SURAH_ALQURAN_LIST, type SurahRingkas } from '../data/seed/khazanahData.ts';

export interface QuranAyatItem {
  nomor: number;
  arab: string;
  latin: string;
  arti: string;
}

export interface GpsLocationInfo {
  lat: number;
  lng: number;
  label: string;
  subLabel: string;
  source: 'gps' | 'manual' | 'default';
}

export interface PrayerScheduleDay {
  dateIso: string;
  masehiLabel: string;
  hijriLabel: string;
  pasaranLabel: string;
  timings: Array<{
    key: 'imsak' | 'subuh' | 'terbit' | 'dhuha' | 'zuhur' | 'ashar' | 'maghrib' | 'isya';
    nama: string;
    waktu: string;
    arab: string;
  }>;
  source: 'aladhan_kemenag' | 'astronomical_offline';
}

export const PRESET_CITIES_ID: GpsLocationInfo[] = [
  { lat: -6.9735, lng: 109.6697, label: 'Karangdadap, Kabupaten Pekalongan', subLabel: 'Jawa Tengah · WIB', source: 'manual' },
  { lat: -7.0289, lng: 109.7924, label: 'Bandar, Kabupaten Batang', subLabel: 'Jawa Tengah · WIB', source: 'manual' },
  { lat: -6.9932, lng: 110.4203, label: 'Kota Semarang', subLabel: 'Jawa Tengah · WIB', source: 'manual' },
  { lat: -6.2088, lng: 106.8456, label: 'DKI Jakarta', subLabel: 'Jakarta · WIB', source: 'manual' },
  { lat: -7.7956, lng: 110.3695, label: 'Kota Yogyakarta', subLabel: 'DI Yogyakarta · WIB', source: 'manual' },
  { lat: -7.2575, lng: 112.7521, label: 'Kota Surabaya', subLabel: 'Jawa Timur · WIB', source: 'manual' },
  { lat: -6.9175, lng: 107.6191, label: 'Kota Bandung', subLabel: 'Jawa Barat · WIB', source: 'manual' },
  { lat: -6.8048, lng: 110.8405, label: 'Kabupaten Kudus', subLabel: 'Jawa Tengah · WIB', source: 'manual' },
  { lat: -7.5407, lng: 112.2336, label: 'Kabupaten Jombang', subLabel: 'Jawa Timur · WIB', source: 'manual' },
  { lat: -5.1477, lng: 119.4327, label: 'Kota Makassar', subLabel: 'Sulawesi Selatan · WITA', source: 'manual' },
];

const QURAN_CACHE_PREFIX = 'darussalam_quran_surah_v2_';

// Memuat seluruh ayat asli (Arab berharakat + Latin + Terjemah Indonesia) untuk Surah 1..114
export async function fetchSurahVerses(nomor: number): Promise<{ ayat: QuranAyatItem[]; fromApi: boolean }> {
  if (typeof window !== 'undefined') {
    try {
      const cached = window.localStorage.getItem(`${QURAN_CACHE_PREFIX}${nomor}`);
      if (cached) {
        const parsed = JSON.parse(cached) as QuranAyatItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { ayat: parsed, fromApi: true };
        }
      }
    } catch {
      // ignore localStorage read error
    }
  }

  // Primary: equran.id API v2 (Standar Kemenag RI + Teks Arab Utsmani + Transliterasi Latin + Terjemah ID)
  try {
    const controller = new AbortController();
    const tid = window.setTimeout(() => controller.abort(), 9000);
    const res = await fetch(`https://equran.id/api/v2/surat/${nomor}`, { signal: controller.signal });
    window.clearTimeout(tid);
    if (res.ok) {
      const json = (await res.json()) as {
        code?: number;
        data?: {
          ayat?: Array<{
            nomorAyat: number;
            teksArab: string;
            teksLatin: string;
            teksIndonesia: string;
          }>;
        };
      };
      const rawAyat = json?.data?.ayat;
      if (Array.isArray(rawAyat) && rawAyat.length > 0) {
        const mapped: QuranAyatItem[] = rawAyat.map((a) => ({
          nomor: a.nomorAyat,
          arab: a.teksArab,
          latin: a.teksLatin,
          arti: a.teksIndonesia,
        }));
        try {
          window.localStorage.setItem(`${QURAN_CACHE_PREFIX}${nomor}`, JSON.stringify(mapped));
        } catch {
          // ignore quota error
        }
        return { ayat: mapped, fromApi: true };
      }
    }
  } catch {
    // Fallback to alquran.cloud
  }

  // Fallback: AlQuran Cloud multi-edition (Uthmani + Transliteration + Indonesian)
  try {
    const controller = new AbortController();
    const tid = window.setTimeout(() => controller.abort(), 9000);
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${nomor}/editions/quran-uthmani,en.transliteration,id.indonesian`,
      { signal: controller.signal }
    );
    window.clearTimeout(tid);
    if (res.ok) {
      const json = (await res.json()) as {
        data?: Array<{
          ayahs?: Array<{ numberInSurah: number; text: string }>;
        }>;
      };
      const editions = json?.data;
      if (Array.isArray(editions) && editions.length >= 3) {
        const ar = editions[0]?.ayahs || [];
        const lt = editions[1]?.ayahs || [];
        const id = editions[2]?.ayahs || [];
        if (ar.length > 0) {
          const mapped: QuranAyatItem[] = ar.map((a, idx) => ({
            nomor: a.numberInSurah,
            arab: a.text,
            latin: lt[idx]?.text || '',
            arti: id[idx]?.text || '',
          }));
          try {
            window.localStorage.setItem(`${QURAN_CACHE_PREFIX}${nomor}`, JSON.stringify(mapped));
          } catch {
            // ignore
          }
          return { ayat: mapped, fromApi: true };
        }
      }
    }
  } catch {
    // Offline fallback below
  }

  const seedSurah: SurahRingkas | undefined = SURAH_ALQURAN_LIST.find((s) => s.nomor === nomor);
  if (seedSurah?.ayatContoh && seedSurah.ayatContoh.length > 0) {
    return { ayat: seedSurah.ayatContoh, fromApi: false };
  }

  return { ayat: [], fromApi: false };
}

// Haversine distance in kilometers
export function haversineDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Arah Kiblat exact great-circle formula toward Ka'bah (21.422487 N, 39.826206 E)
export function calculateQiblaAzimuth(latDeg: number, lngDeg: number): number {
  const lat1 = (latDeg * Math.PI) / 180;
  const lng1 = (lngDeg * Math.PI) / 180;
  const lat2 = (21.422487 * Math.PI) / 180;
  const lng2 = (39.826206 * Math.PI) / 180;
  const dLon = lng2 - lng1;
  const y = Math.sin(dLon);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLon);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return ((brng % 360) + 360) % 360;
}

// Pasaran Jawa & Kalender Hijriah (Umm al-Qura / Kemenag)
const PASARAN_NAMES = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'] as const;
const HARI_NAMES = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'] as const;
const BULAN_MASEHI = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const HIJRI_MONTHS_ID = [
  'Muharram', 'Shafar', 'Rabiul Awal', 'Rabiul Akhir',
  'Jumadal Ula', 'Jumadal Akhirah', 'Rajab', "Sya'ban",
  'Ramadhan', 'Syawal', 'Dzulqaidah', 'Dzulhijjah',
];

export interface DateKalenderInfo {
  hari: string;
  pasaran: string;
  masehiDay: number;
  masehiMonthIdx: number;
  masehiMonthName: string;
  masehiYear: number;
  masehiFull: string;
  hijriDay: number;
  hijriMonth: number;
  hijriMonthName: string;
  hijriYear: number;
  hijriFull: string;
  hijriArabDigit: string;
}

const ARAB_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
export function toArabicIndicNumber(n: number): string {
  return String(n)
    .split('')
    .map((d) => ARAB_DIGITS[Number(d)] ?? d)
    .join('');
}

export function getHijriAndPasaranForDate(date: Date): DateKalenderInfo {
  // Anchor: 22 November 2026 = Ahad Pon
  const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const anchorUtc = Date.UTC(2026, 10, 22); // Nov 22, 2026 = index 2 (Pon)
  const diffDays = Math.round((utcDate - anchorUtc) / 86400000);
  const pasaranIdx = (((2 + diffDays) % 5) + 5) % 5;
  const hariIdx = date.getDay();

  // Hijri Ummul Qura via Intl
  let hijriDay = 1;
  let hijriMonth = 1;
  let hijriYear = 1448;
  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).formatToParts(date);
    const dPart = parts.find((p) => p.type === 'day')?.value;
    const mPart = parts.find((p) => p.type === 'month')?.value;
    const yPart = parts.find((p) => p.type === 'year')?.value;
    if (dPart && mPart && yPart) {
      hijriDay = parseInt(dPart, 10) || 1;
      hijriMonth = parseInt(mPart, 10) || 1;
      hijriYear = parseInt(yPart, 10) || 1448;
    }
  } catch {
    // Fallback tabular estimate
    const julian = Math.floor(utcDate / 86400000) + 2440588;
    const l = julian - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    hijriMonth = Math.floor((24 * l3) / 709);
    hijriDay = l3 - Math.floor((709 * hijriMonth) / 24);
    hijriYear = 30 * n + j - 30;
  }

  const hMonthName = HIJRI_MONTHS_ID[Math.max(0, Math.min(11, hijriMonth - 1))];
  const mMonthName = BULAN_MASEHI[date.getMonth()];

  return {
    hari: HARI_NAMES[hariIdx],
    pasaran: PASARAN_NAMES[pasaranIdx],
    masehiDay: date.getDate(),
    masehiMonthIdx: date.getMonth(),
    masehiMonthName: mMonthName,
    masehiYear: date.getFullYear(),
    masehiFull: `${date.getDate()} ${mMonthName} ${date.getFullYear()}`,
    hijriDay,
    hijriMonth,
    hijriMonthName: hMonthName,
    hijriYear,
    hijriFull: `${hijriDay} ${hMonthName} ${hijriYear}`,
    hijriArabDigit: toArabicIndicNumber(hijriDay),
  };
}

// Perhitungan Astronomis Jadwal Shalat Kemenag RI (Fajr 20°, Isya 18°, Ihtiyat +2 menit)
function formatMinutesToHHMM(totalMinutes: number): string {
  const mNorm = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const hh = Math.floor(mNorm / 60);
  const mm = mNorm % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

export function inferIndonesiaTimezoneOffsetHours(lng: number): number {
  if (lng >= 127) return 9; // WIT
  if (lng >= 115) return 8; // WITA
  return 7; // WIB
}

export function computeAstronomicalPrayerTimes(
  lat: number,
  lng: number,
  date: Date,
  tzHours = inferIndonesiaTimezoneOffsetHours(lng)
): PrayerScheduleDay {
  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;

  const d = jd - 2451545.0;
  const g = ((357.529 + 0.98560028 * d) % 360 + 360) % 360;
  const q = ((280.459 + 0.98564736 * d) % 360 + 360) % 360;
  const L = ((q + 1.915 * Math.sin(g * rad) + 0.020 * Math.sin(2 * g * rad)) % 360 + 360) % 360;
  const e = 23.439 - 0.00000036 * d;
  const raDeg = Math.atan2(Math.cos(e * rad) * Math.sin(L * rad), Math.cos(L * rad)) * deg;
  const raHours = ((raDeg / 15) % 24 + 24) % 24;
  const decl = Math.asin(Math.sin(e * rad) * Math.sin(L * rad));
  const eqt = q / 15 - raHours;
  const eqMinutes = (eqt > 12 ? eqt - 24 : eqt < -12 ? eqt + 24 : eqt) * 60;

  const solarNoonMin = 720 + tzHours * 60 - lng * 4 - eqMinutes;

  const hourAngleMinutes = (zenithDeg: number): number => {
    const cosH =
      (Math.cos(zenithDeg * rad) - Math.sin(lat * rad) * Math.sin(decl)) /
      (Math.cos(lat * rad) * Math.cos(decl));
    const clamped = Math.max(-1, Math.min(1, cosH));
    return Math.acos(clamped) * deg * 4;
  };

  // Kemenag RI standard + 2 min ihtiyat
  const ihtiyat = 2;
  const subuhMin = solarNoonMin - hourAngleMinutes(90 + 20) + ihtiyat;
  const imsakMin = subuhMin - 10;
  const terbitMin = solarNoonMin - hourAngleMinutes(90.833) - 1;
  const dhuhaMin = terbitMin + 23;
  const zuhurMin = solarNoonMin + ihtiyat;

  // Asr Shafi'i (shadow factor 1)
  const cotAlt = 1 + Math.tan(Math.abs(lat * rad - decl));
  const asrAlt = Math.atan(1 / cotAlt);
  const asrZenith = 90 - asrAlt * deg;
  const asharMin = solarNoonMin + hourAngleMinutes(asrZenith) + ihtiyat;

  const maghribMin = solarNoonMin + hourAngleMinutes(90.833) + ihtiyat;
  const isyaMin = solarNoonMin + hourAngleMinutes(90 + 18) + ihtiyat;

  const cal = getHijriAndPasaranForDate(date);

  return {
    dateIso: date.toISOString().split('T')[0],
    masehiLabel: cal.masehiFull,
    hijriLabel: cal.hijriFull,
    pasaranLabel: `${cal.hari} ${cal.pasaran}`,
    source: 'astronomical_offline',
    timings: [
      { key: 'imsak', nama: 'Imsak', waktu: formatMinutesToHHMM(imsakMin), arab: 'الإمساك' },
      { key: 'subuh', nama: 'Subuh', waktu: formatMinutesToHHMM(subuhMin), arab: 'الفجر' },
      { key: 'terbit', nama: 'Terbit', waktu: formatMinutesToHHMM(terbitMin), arab: 'الشروق' },
      { key: 'dhuha', nama: 'Dhuha', waktu: formatMinutesToHHMM(dhuhaMin), arab: 'الضحى' },
      { key: 'zuhur', nama: 'Zuhur', waktu: formatMinutesToHHMM(zuhurMin), arab: 'الظهر' },
      { key: 'ashar', nama: 'Ashar', waktu: formatMinutesToHHMM(asharMin), arab: 'العصر' },
      { key: 'maghrib', nama: 'Maghrib', waktu: formatMinutesToHHMM(maghribMin), arab: 'المغرب' },
      { key: 'isya', nama: "Isya'", waktu: formatMinutesToHHMM(isyaMin), arab: 'العشاء' },
    ],
  };
}

export async function fetchPrayerTimesForCoords(
  lat: number,
  lng: number,
  date: Date
): Promise<PrayerScheduleDay> {
  const offline = computeAstronomicalPrayerTimes(lat, lng, date);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  try {
    const controller = new AbortController();
    const tid = window.setTimeout(() => controller.abort(), 5000);
    // method=20 = KEMENAG Indonesia
    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=20`,
      { signal: controller.signal }
    );
    window.clearTimeout(tid);
    if (res.ok) {
      const json = (await res.json()) as {
        data?: { timings?: Record<string, string> };
      };
      const t = json?.data?.timings;
      if (t?.Fajr && t?.Dhuhr && t?.Asr && t?.Maghrib && t?.Isha) {
        const cleanTime = (s?: string) => (s || '').slice(0, 5);
        // Compute dhuha = sunrise + 23m
        const sunriseParts = cleanTime(t.Sunrise || offline.timings[2].waktu).split(':').map(Number);
        const dhuhaMin = (sunriseParts[0] || 5) * 60 + (sunriseParts[1] || 20) + 23;
        return {
          ...offline,
          source: 'aladhan_kemenag',
          timings: [
            { key: 'imsak', nama: 'Imsak', waktu: cleanTime(t.Imsak) || offline.timings[0].waktu, arab: 'الإمساك' },
            { key: 'subuh', nama: 'Subuh', waktu: cleanTime(t.Fajr), arab: 'الفجر' },
            { key: 'terbit', nama: 'Terbit', waktu: cleanTime(t.Sunrise) || offline.timings[2].waktu, arab: 'الشروق' },
            { key: 'dhuha', nama: 'Dhuha', waktu: formatMinutesToHHMM(dhuhaMin), arab: 'الضحى' },
            { key: 'zuhur', nama: 'Zuhur', waktu: cleanTime(t.Dhuhr), arab: 'الظهر' },
            { key: 'ashar', nama: 'Ashar', waktu: cleanTime(t.Asr), arab: 'العصر' },
            { key: 'maghrib', nama: 'Maghrib', waktu: cleanTime(t.Maghrib), arab: 'المغرب' },
            { key: 'isya', nama: "Isya'", waktu: cleanTime(t.Isha), arab: 'العشاء' },
          ],
        };
      }
    }
  } catch {
    // Use offline calculation cleanly
  }
  return offline;
}

export async function fetchMonthlyPrayerSchedule(
  lat: number,
  lng: number,
  year: number,
  monthIdx: number
): Promise<PrayerScheduleDay[]> {
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const offlineDays: PrayerScheduleDay[] = Array.from({ length: daysInMonth }, (_, idx) =>
    computeAstronomicalPrayerTimes(lat, lng, new Date(year, monthIdx, idx + 1))
  );

  try {
    const controller = new AbortController();
    const tid = window.setTimeout(() => controller.abort(), 3000);
    const res = await fetch(
      `https://api.aladhan.com/v1/calendar/${year}/${monthIdx + 1}?latitude=${lat}&longitude=${lng}&method=20`,
      { signal: controller.signal }
    );
    window.clearTimeout(tid);

    if (res.ok) {
      const json = (await res.json()) as {
        data?: Array<{ timings?: Record<string, string> }>;
      };
      if (Array.isArray(json?.data) && json.data.length >= daysInMonth) {
        const cleanTime = (s?: string) => (s || '').replace(/\s*\(.*?\)\s*/g, '').slice(0, 5);
        return offlineDays.map((offline, i) => {
          const t = json.data?.[i]?.timings;
          if (t?.Fajr && t?.Dhuhr && t?.Asr && t?.Maghrib && t?.Isha) {
            const sunrise = cleanTime(t.Sunrise) || offline.timings[2].waktu;
            const [sH, sM] = sunrise.split(':').map(Number);
            const dhuhaMin = (sH || 5) * 60 + (sM || 20) + 23;
            return {
              ...offline,
              source: 'aladhan_kemenag',
              timings: [
                { key: 'imsak', nama: 'Imsak', waktu: cleanTime(t.Imsak) || offline.timings[0].waktu, arab: 'الإمساك' },
                { key: 'subuh', nama: 'Subuh', waktu: cleanTime(t.Fajr), arab: 'الفجر' },
                { key: 'terbit', nama: 'Terbit', waktu: sunrise, arab: 'الشروق' },
                { key: 'dhuha', nama: 'Dhuha', waktu: formatMinutesToHHMM(dhuhaMin), arab: 'الضحى' },
                { key: 'zuhur', nama: 'Zuhur', waktu: cleanTime(t.Dhuhr), arab: 'الظهر' },
                { key: 'ashar', nama: 'Ashar', waktu: cleanTime(t.Asr), arab: 'العصر' },
                { key: 'maghrib', nama: 'Maghrib', waktu: cleanTime(t.Maghrib), arab: 'المغرب' },
                { key: 'isya', nama: "Isya'", waktu: cleanTime(t.Isha), arab: 'العشاء' },
              ],
            };
          }
          return offline;
        });
      }
    }
  } catch {
    // Fallback offline calculation already ready
  }

  return offlineDays;
}

export async function detectCurrentGpsLocation(): Promise<GpsLocationInfo> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    throw new Error('Perangkat / browser tidak mendukung sensor GPS.');
  }

  const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 60000,
    });
  });

  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  let label = `Lokasi GPS (${lat.toFixed(3)}°, ${lng.toFixed(3)}°)`;
  let subLabel = inferIndonesiaTimezoneOffsetHours(lng) === 7 ? 'WIB' : inferIndonesiaTimezoneOffsetHours(lng) === 8 ? 'WITA' : 'WIT';

  try {
    const controller = new AbortController();
    const tid = window.setTimeout(() => controller.abort(), 5000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=id`,
      { signal: controller.signal }
    );
    window.clearTimeout(tid);
    if (res.ok) {
      const data = (await res.json()) as {
        address?: {
          suburb?: string;
          village?: string;
          town?: string;
          city_district?: string;
          county?: string;
          city?: string;
          state?: string;
        };
      };
      const a = data.address;
      if (a) {
        const area = a.city_district || a.town || a.village || a.suburb || '';
        const regency = a.county || a.city || '';
        if (area && regency && area !== regency) {
          label = `${area}, ${regency}`;
        } else if (regency || area) {
          label = regency || area;
        }
        if (a.state) {
          subLabel = `${a.state} · ${subLabel}`;
        }
      }
    }
  } catch {
    // Keep coordinate fallback
  }

  return { lat, lng, label, subLabel, source: 'gps' };
}
