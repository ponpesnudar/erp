import React from 'react';
import { MAPEL_PER_TINGKAT, type SantriRecord } from '../../../data/seed/pondokData.ts';
import type { NilaiSantriMapel } from '../../../lib/store.ts';
import { predikat } from '../../../lib/rules.ts';

export interface RaportF4SheetProps {
  santri: SantriRecord;
  attendanceNo: number;
  kelasLabel: string;
  kelasArabic?: string;
  nextKelasArabic?: string;
  waliKelas: string;
  semester: '1' | '2';
  tahunAjaran: string;
  tanggalPenyerahan?: string;
  nilaiList: NilaiSantriMapel[];
  totalSantriKelas: number;
  peringkatKelas: number;
}

const ARABIC_ONES = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثانية', 'تسعة'];
const ARABIC_ONES_PROPER = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
const ARABIC_TENS = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];

export function toArabicWords(num: number): string {
  const n = Math.round(num);
  if (n <= 0) return 'صفر';
  if (n === 100) return 'مائة';
  if (n < 10) return ARABIC_ONES_PROPER[n] || 'صفر';
  if (n === 10) return 'عشرة';
  if (n === 11) return 'أحد عشر';
  if (n === 12) return 'اثنا عشر';
  if (n < 20) return `${ARABIC_ONES_PROPER[n - 10]} عشر`;
  const ones = n % 10;
  const tens = Math.floor(n / 10);
  if (ones === 0) return ARABIC_TENS[tens] || '';
  return `${ARABIC_ONES_PROPER[ones]} و ${ARABIC_TENS[tens]}`;
}

export function getArabicKelas(kelas: string, gender?: 'L' | 'P'): { current: string; next: string } {
  const lvl = parseInt(kelas.charAt(0)) || 1;
  const isShared = kelas.includes('&');
  const isPutri = isShared ? gender === 'P' : kelas.toLowerCase().includes('putri');
  const suffix = isPutri ? 'للبنات' : 'للبنين';
  const branch = kelas.includes(' A ') ? ' (أ)' : kelas.includes(' B ') ? ' (ب)' : kelas.includes(' C ') ? ' (ج)' : '';
  const ord: Record<number, string> = {
    1: 'الأول',
    2: 'الثاني',
    3: 'الثالث',
    4: 'الرابع',
    5: 'الخامس',
    6: 'السادس',
    7: 'التخرج / التخصص',
  };
  return {
    current: `${ord[lvl] || 'الأول'} ${suffix}${branch}`,
    next: `${ord[Math.min(7, lvl + 1)]} ${suffix}`,
  };
}

const DEFAULT_RAPORT_SUBJECTS: {
  mapelId: string;
  mapelLatin: string;
  kitabArab: string;
  defaultUjian: number;
  defaultHarian: number;
}[] = [
  { mapelId: 'm-05', mapelLatin: 'Akhlaq', kitabArab: 'تيسير الخلاق / أخلاق للبنين', defaultUjian: 86, defaultHarian: 82 },
  { mapelId: 'm-06', mapelLatin: 'Fiqih', kitabArab: 'متن تقريب / فتح القريب', defaultUjian: 88, defaultHarian: 85 },
  { mapelId: 'm-09', mapelLatin: 'Tauhid', kitabArab: 'عقيدة العوام / كفاية العوام', defaultUjian: 90, defaultHarian: 84 },
  { mapelId: 'm-10', mapelLatin: 'Nahwu', kitabArab: 'نظم العمريطي / الجرومية', defaultUjian: 85, defaultHarian: 80 },
  { mapelId: 'm-11', mapelLatin: 'Shorof', kitabArab: 'الأمثلة التصريفية / نظم المقصود', defaultUjian: 84, defaultHarian: 82 },
  { mapelId: 'm-07', mapelLatin: 'Hadits', kitabArab: 'الأربعين النووية / بلوغ المرام', defaultUjian: 87, defaultHarian: 85 },
  { mapelId: 'm-08', mapelLatin: 'Tarikh', kitabArab: 'خلاصة نور اليقين', defaultUjian: 85, defaultHarian: 84 },
  { mapelId: 'm-12', mapelLatin: 'Tahaji / Bahasa Arab', kitabArab: 'مدارج الدروس العربية', defaultUjian: 88, defaultHarian: 86 },
];

/**
 * Dokumen Raport F4 (215mm x 330mm) RTL Arab sesuai PDF Resmi Pondok Pesantren NU Darussalam
 */
export const RaportF4Sheet: React.FC<RaportF4SheetProps> = ({
  santri,
  attendanceNo,
  kelasLabel,
  kelasArabic,
  nextKelasArabic,
  waliKelas,
  semester,
  tahunAjaran,
  tanggalPenyerahan,
  nilaiList,
  totalSantriKelas,
  peringkatKelas,
}) => {
  const santriGrades = nilaiList.filter((n) => n.santriId === santri.id);
  const firstRec = santriGrades[0];
  const kelasInfo = getArabicKelas(kelasLabel, santri.gender);
  const displayKelasArab = kelasArabic && !kelasLabel.includes('&') ? kelasArabic : kelasInfo.current;
  const displayNextKelasArab = nextKelasArabic && !kelasLabel.includes('&') ? nextKelasArabic : kelasInfo.next;

  const levelTemplates = MAPEL_PER_TINGKAT[santri.tingkat] || MAPEL_PER_TINGKAT[1];
  const subjectRows = levelTemplates.map((subj, index) => {
    const legacyMatch = DEFAULT_RAPORT_SUBJECTS.find((d) =>
      subj.nama.toLowerCase().includes(d.mapelLatin.toLowerCase().split(' ')[0])
    );
    const rec = santriGrades.find((g) => {
      const idUpper = g.mapelId.toUpperCase();
      if (idUpper.startsWith(`${subj.kodePrefix}-${santri.tingkat}`)) return true;
      if (legacyMatch && g.mapelId === legacyMatch.mapelId) return true;
      return false;
    });
    const ujian = rec ? rec.nilaiAngka : (legacyMatch?.defaultUjian ?? 84 + ((index + santri.tingkat) % 9));
    const harian = rec?.nilaiHarian ?? (legacyMatch?.defaultHarian ?? 82 + ((index * 2) % 8));
    const avg = Math.round((ujian + harian) / 2);
    const kkm = 65;
    const statusArab = avg >= kkm ? 'جيد' : 'فاشل';
    return {
      no: index + 1,
      mapelLatin: subj.nama,
      kitabArab: subj.namaArab,
      kkm,
      ujian,
      harian,
      avg,
      statusArab,
    };
  });

  const emptyPaddingRows = Array.from(
    { length: Math.max(0, 11 - subjectRows.length) },
    (_, i) => subjectRows.length + i + 1
  );

  const totalScore = subjectRows.reduce((s, r) => s + r.avg, 0);
  const averageScore = Number((totalScore / subjectRows.length).toFixed(1));
  const overallPred = predikat(averageScore);

  const nilaiAkhlaq = firstRec?.nilaiAkhlaq ?? 88;
  const nilaiIstiqomah = firstRec?.nilaiIstiqomah ?? 85;
  const nilaiUbudiyah = firstRec?.nilaiUbudiyah ?? 90;
  const sakit = firstRec?.sakit ?? 0;
  const izin = firstRec?.izin ?? 1;
  const alpa = firstRec?.alpa ?? 0;
  const catatanWali =
    firstRec?.catatanWaliKelas ||
    'Tingkatkan semangat muthalaah kitab kuning, jaga shalat berjamaah, dan tetap istiqomah dalam mengaji.';

  const defaultDate = semester === '2' ? '٢١ يونيو ٢٠٢٧ م' : '٢١ ديسمبر ٢٠٢٦ م';

  return (
    <div
      dir="rtl"
      className="bg-white border border-slate-800 p-6 sm:p-7 mx-auto text-black shadow-xl printable-area page-break-after page-break-inside-avoid max-w-[215mm] min-h-[320mm] flex flex-col justify-between font-sans"
    >
      <div className="space-y-3">
        {/* KOP RAPORT RTL (Logo Top Right + Arabic Header Center) */}
        <div className="flex items-center justify-between gap-4 pb-2 border-b-2 border-black">
          <img
            src="/assets/aistudio/preview__14__3b7f388f.webp"
            alt="Logo PP NU Darussalam"
            className="w-16 h-16 object-contain shrink-0"
          />
          <div className="flex-1 text-center font-arabic space-y-0.5">
            <h2 className="text-xl font-bold leading-tight">كشف درجات الطلاب</h2>
            <h3 className="text-base sm:text-lg font-bold leading-snug">
              المدرسة الدينية بالمعهد الإسلامي النهضي دار السلام كاراغداداف - فكالوغان
            </h3>
          </div>
          <div className="w-16 shrink-0" />
        </div>

        {/* METADATA 2 KOLOM RTL */}
        <div className="grid grid-cols-2 gap-6 text-xs pt-1">
          <div className="space-y-1.5">
            <div className="flex items-center border-b border-slate-500 pb-0.5">
              <span className="font-arabic font-bold w-28 shrink-0">الإسم :</span>
              <span className="font-bold uppercase tracking-wide flex-1 text-left" dir="ltr">
                {santri.nama}
              </span>
            </div>
            <div className="flex items-center border-b border-slate-500 pb-0.5">
              <span className="font-arabic font-bold w-28 shrink-0">رقم كشف الحضور :</span>
              <span className="font-bold tabular-nums flex-1 text-left" dir="ltr">
                {attendanceNo}
              </span>
            </div>
            <div className="flex items-center border-b border-slate-500 pb-0.5">
              <span className="font-arabic font-bold w-28 shrink-0">رقم القيد :</span>
              <span className="font-bold tabular-nums flex-1 text-left" dir="ltr">
                {santri.nis}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center border-b border-slate-500 pb-0.5">
              <span className="font-arabic font-bold w-24 shrink-0">الفصل :</span>
              <span className="font-arabic font-bold flex-1 text-left">{displayKelasArab}</span>
            </div>
            <div className="flex items-center border-b border-slate-500 pb-0.5">
              <span className="font-arabic font-bold w-24 shrink-0">الاختبار :</span>
              <span className="font-arabic font-bold flex-1 text-left">
                {semester === '2' ? 'الثاني (Cawu 2)' : 'الأول (Cawu 1)'}
              </span>
            </div>
            <div className="flex items-center border-b border-slate-500 pb-0.5">
              <span className="font-arabic font-bold w-24 shrink-0">السنة الدراسية :</span>
              <span className="font-bold tabular-nums flex-1 text-left" dir="ltr">
                {tahunAjaran}
              </span>
            </div>
          </div>
        </div>

        {/* TABEL NILAI UTAMA RTL (PERSIS PDF) */}
        <table className="w-full border-2 border-black border-collapse text-[11px] text-center">
          <thead>
            <tr className="bg-slate-200/80 font-arabic font-bold">
              <th rowSpan={2} className="border border-black py-1.5 px-1 w-9">
                النمرة
              </th>
              <th rowSpan={2} className="border border-black py-1.5 px-2 w-24">
                المادة
              </th>
              <th rowSpan={2} className="border border-black py-1.5 px-2">
                الكتاب
              </th>
              <th rowSpan={2} className="border border-black py-1.5 px-1 w-14 leading-tight">
                مقتضى أقصى النتيجة
              </th>
              <th colSpan={4} className="border border-black py-1 px-1">
                نتائج
              </th>
              <th rowSpan={2} className="border border-black py-1.5 px-1 w-14 leading-tight">
                معتدل الحاصل
              </th>
              <th rowSpan={2} className="border border-black py-1.5 px-2 w-16">
                التنبيه
              </th>
            </tr>
            <tr className="bg-slate-100 font-arabic font-bold text-[10px]">
              <th className="border border-black py-1 px-1 w-11">بالنمرة</th>
              <th className="border border-black py-1 px-1">الامتحان النهائي (بالحرف)</th>
              <th className="border border-black py-1 px-1 w-11">بالنمرة</th>
              <th className="border border-black py-1 px-1">اليومية (بالحرف)</th>
            </tr>
          </thead>
          <tbody>
            {subjectRows.map((row) => (
              <tr key={row.no}>
                <td className="border border-black py-1 px-1 font-bold tabular-nums">{row.no}</td>
                <td className="border border-black py-1 px-2 font-sans font-semibold text-left" dir="ltr">
                  {row.mapelLatin}
                </td>
                <td className="border border-black py-1 px-2 font-arabic text-xs">{row.kitabArab}</td>
                <td className="border border-black py-1 px-1 tabular-nums">{row.kkm}</td>
                <td className="border border-black py-1 px-1 font-bold tabular-nums">{row.ujian}</td>
                <td className="border border-black py-1 px-1 font-arabic text-xs">{toArabicWords(row.ujian)}</td>
                <td className="border border-black py-1 px-1 font-bold tabular-nums">{row.harian}</td>
                <td className="border border-black py-1 px-1 font-arabic text-xs">{toArabicWords(row.harian)}</td>
                <td className="border border-black py-1 px-1 font-bold tabular-nums bg-slate-50">{row.avg}</td>
                <td
                  className={`border border-black py-1 px-1 font-arabic font-bold text-xs ${
                    row.statusArab === 'فاشل' ? 'text-rose-700' : 'text-black'
                  }`}
                >
                  {row.statusArab}
                </td>
              </tr>
            ))}

            {/* Baris Kosong Pelengkap hingga baris 11 agar proporsional F4 */}
            {emptyPaddingRows.map((emptyNo) => (
              <tr key={emptyNo}>
                <td className="border border-black py-1 px-1 text-slate-400 tabular-nums">{emptyNo}</td>
                <td className="border border-black py-1 px-2"></td>
                <td className="border border-black py-1 px-2"></td>
                <td className="border border-black py-1 px-1"></td>
                <td className="border border-black py-1 px-1"></td>
                <td className="border border-black py-1 px-1"></td>
                <td className="border border-black py-1 px-1"></td>
                <td className="border border-black py-1 px-1"></td>
                <td className="border border-black py-1 px-1"></td>
                <td className="border border-black py-1 px-1"></td>
              </tr>
            ))}

            {/* Summary Footer Rows */}
            <tr className="bg-slate-200/70 font-bold">
              <td colSpan={3} className="border border-black py-1.5 px-2 font-arabic text-xs">
                الجملة
              </td>
              <td colSpan={6} className="border border-black py-1.5 px-2 tabular-nums text-xs">
                {totalScore}
              </td>
              <td className="border border-black py-1.5 px-1 font-arabic text-xs bg-slate-100">الإسناد</td>
            </tr>
            <tr className="font-bold">
              <td colSpan={3} className="border border-black py-1.5 px-2 font-arabic text-xs bg-slate-100">
                معتدل الحاصل
              </td>
              <td colSpan={6} className="border border-black py-1.5 px-2 tabular-nums text-xs">
                {averageScore}
              </td>
              <td rowSpan={2} className="border border-black py-1.5 px-1 font-arabic text-sm font-bold">
                {overallPred.predikatArab}
              </td>
            </tr>
            <tr className="font-bold">
              <td colSpan={3} className="border border-black py-1.5 px-2 font-arabic text-xs bg-slate-100">
                الدرجة
              </td>
              <td colSpan={2} className="border border-black py-1.5 px-2 tabular-nums text-xs">
                {peringkatKelas}
              </td>
              <td className="border border-black py-1.5 px-1 font-arabic text-xs">من</td>
              <td colSpan={2} className="border border-black py-1.5 px-2 tabular-nums text-xs">
                {totalSantriKelas}
              </td>
              <td className="border border-black py-1.5 px-1 font-arabic text-xs">الطلاب</td>
            </tr>
          </tbody>
        </table>

        {/* TABEL KEPRIBADIAN & ABSENSI RTL */}
        <table className="w-full border-2 border-black border-collapse text-[11px] text-center">
          <thead>
            <tr className="bg-slate-200/80 font-arabic font-bold">
              <th className="border border-black py-1 px-1 w-8">م</th>
              <th className="border border-black py-1 px-2">العملية</th>
              <th className="border border-black py-1 px-2 w-16">النتيجة</th>
              <th className="border border-black py-1 px-2 w-20">التنبيه</th>
              <th className="border border-black py-1 px-1 w-8">م</th>
              <th className="border border-black py-1 px-2">كشف الغياب / الحضور</th>
              <th className="border border-black py-1 px-2 w-16">العدد</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black py-1 font-arabic">١</td>
              <td className="border border-black py-1 font-arabic font-bold">الأخلاق</td>
              <td className="border border-black py-1 font-bold tabular-nums">{nilaiAkhlaq}</td>
              <td className="border border-black py-1 font-arabic">{predikat(nilaiAkhlaq).predikatArab}</td>
              <td className="border border-black py-1 font-arabic">١</td>
              <td className="border border-black py-1 font-arabic font-bold">بمرض</td>
              <td className="border border-black py-1 font-bold tabular-nums">{sakit}</td>
            </tr>
            <tr>
              <td className="border border-black py-1 font-arabic">٢</td>
              <td className="border border-black py-1 font-arabic font-bold">الاستقامة</td>
              <td className="border border-black py-1 font-bold tabular-nums">{nilaiIstiqomah}</td>
              <td className="border border-black py-1 font-arabic">{predikat(nilaiIstiqomah).predikatArab}</td>
              <td className="border border-black py-1 font-arabic">٢</td>
              <td className="border border-black py-1 font-arabic font-bold">بإذن العذر</td>
              <td className="border border-black py-1 font-bold tabular-nums">{izin}</td>
            </tr>
            <tr>
              <td className="border border-black py-1 font-arabic">٣</td>
              <td className="border border-black py-1 font-arabic font-bold">العبودية</td>
              <td className="border border-black py-1 font-bold tabular-nums">{nilaiUbudiyah}</td>
              <td className="border border-black py-1 font-arabic">{predikat(nilaiUbudiyah).predikatArab}</td>
              <td className="border border-black py-1 font-arabic">٣</td>
              <td className="border border-black py-1 font-arabic font-bold">بدون أي عذر</td>
              <td className="border border-black py-1 font-bold tabular-nums">{alpa}</td>
            </tr>
            <tr>
              <td colSpan={2} className="border border-black py-1.5 px-2 font-arabic font-bold bg-slate-100">
                وصية الوالي :
              </td>
              <td colSpan={5} className="border border-black py-1.5 px-3 text-left font-sans italic text-[11px]" dir="ltr">
                {catatanWali}
              </td>
            </tr>
          </tbody>
        </table>

        {/* CAWU 2: KEPUTUSAN KENAIKAN KELAS (استمرار الدراسة) */}
        <div className="flex items-stretch justify-between gap-4 pt-1">
          <div className="space-y-1 text-xs font-arabic">
            <p>
              التسليم في : <span className="font-bold">كاراغداداف</span>
            </p>
            <p>
              في التاريخ : <span className="font-bold">{tanggalPenyerahan || defaultDate}</span>
            </p>
          </div>

          {semester === '2' && (
            <div className="border border-black w-80 text-center font-arabic text-xs">
              <div className="bg-slate-200/80 border-b border-black py-1 font-bold">
                استمرار الدراسة:
              </div>
              <div className="py-1.5 px-2 font-bold">
                {averageScore >= 65
                  ? `الناجح، يستحق أن يستمر الدراسة في الفصل ${displayNextKelasArab}`
                  : `يبقى في الفصل ${displayKelasArab}`}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TANDA TANGAN 3 PIHAK RTL */}
      <div className="pt-4 grid grid-cols-3 text-center text-xs font-arabic">
        <div>
          <p className="font-bold mb-14">والي المريد</p>
          <p className="font-sans font-bold text-[11px]" dir="ltr">
            ( {santri.namaWali} )
          </p>
        </div>

        <div>
          <p className="text-[11px]">يعرف</p>
          <p className="font-bold mb-11">مدير المعهد</p>
          <p className="font-bold underline text-sm">كياهي أمين مأزون الحاج</p>
        </div>

        <div>
          <p className="font-bold mb-14">والي الفصل</p>
          <p className="font-sans font-bold text-[11px]" dir="ltr">
            {waliKelas}
          </p>
        </div>
      </div>
    </div>
  );
};
