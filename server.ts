import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { resolveLocalBahtsulMasail } from './src/lib/bahtsulMasailData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(compression({ threshold: 1024 }));
app.use(express.json({ limit: '15mb' }));

// Health Check Endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    app: 'ERP Pondok Pesantren NU Darussalam Karangdadap',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '2.5.0',
    database: 'connected',
  });
});

// API Info Endpoint
app.get('/api/info', (_req, res) => {
  res.json({
    pondok: 'Pondok Pesantren NU Darussalam Karangdadap, Pekalongan',
    kontak: 'nudarussalam21@gmail.com',
    statistik: {
      totalSantri: 366,
      asatidz: 35,
      kamarPutra: 9,
      kamarPutri: 10,
    },
  });
});

const ARABIC_INDIC = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
function toArabicNomor(n: number): string {
  return String(n)
    .padStart(2, '0')
    .split('')
    .map((d) => ARABIC_INDIC[parseInt(d, 10)] ?? d)
    .join('');
}

function formatGeminiErrorMessage(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err || '');
  const lower = raw.toLowerCase();

  if (
    lower.includes('403') ||
    lower.includes('permission_denied') ||
    lower.includes('access_token_scope_insufficient') ||
    lower.includes('free tier') ||
    lower.includes('billing')
  ) {
    return {
      status: 403,
      message:
        'Akses Gemini AI ditolak (403 PERMISSION_DENIED). Pastikan GEMINI_API_KEY sudah dipilih/diisi dengan benar dan billing project AI Studio aktif melalui menu Settings > Secrets.',
    };
  }

  if (lower.includes('api_key_invalid') || lower.includes('api key not valid') || lower.includes('401')) {
    return {
      status: 401,
      message:
        'Konfigurasi GEMINI_API_KEY pada server belum valid. Mohon periksa atau perbarui kunci API melalui Settings > Secrets.',
    };
  }

  if (lower.includes('429') || lower.includes('resource_exhausted') || lower.includes('quota')) {
    return {
      status: 429,
      message:
        'Batas permintaan Asisten AI sementara penuh. Silakan tunggu beberapa detik lalu kirim ulang pertanyaan Anda.',
    };
  }

  return {
    status: 500,
    message: 'Layanan Asisten AI sedang mengalami gangguan koneksi sementara. Silakan coba beberapa saat lagi.',
  };
}

// Konversi Soal Bahasa Indonesia (Teks / Gambar) -> Arab Pegon Jawa / Bahasa Arab Berharokat
app.post('/api/imtihan/convert-soal', async (req, res) => {
  try {
    const {
      targetMode = 'pegon_jawa',
      teksSoal = '',
      imageBase64,
      imageMimeType = 'image/png',
      mapelNama = 'Madrasah Diniyah',
      kelas = '',
    } = req.body as {
      targetMode?: 'pegon_jawa' | 'arab_harokat';
      teksSoal?: string;
      imageBase64?: string;
      imageMimeType?: string;
      mapelNama?: string;
      kelas?: string;
    };

    if (!teksSoal?.trim() && !imageBase64) {
      return res.status(400).json({
        error: 'Harap unggah gambar naskah soal atau masukkan teks soal Bahasa Indonesia.',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.status(503).json({
        error: 'GEMINI_API_KEY belum dikonfigurasi pada menu Settings > Secrets.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const isPegon = targetMode === 'pegon_jawa';
    const styleGuide = isPegon
      ? `Ubah seluruh butir soal menjadi tulisan ARAB PEGON (bahasa Indonesia / Jawa ditulis dengan huruf Hijaiyah + huruf Pegon standar pesantren Nusantara: چ untuk c, ڠ untuk ng, ڤ untuk p, ڮ untuk g, ۑ untuk ny, ۏ untuk v).
Contoh gaya Pegon yang diinginkan:
"أدا برافـا ماچام-ماچام أير يـاغ بولـيه دي كوناكـان أونتـوك برسوچـي ؟ سبوتكـان أفا ساجـا !"
"فَرْضُـنْيَا وضـوء أدا برافـا ؟ سبوتكـان أفا ساجـا !"
Istilah syar'i (wudhu, shalat, fardhu, sunnah, najis, thaharah, i'rob, dll.) tulis dengan ejaan Arab yang tepat disertai harokat seperlunya.`
      : `Terjemahkan seluruh butir soal menjadi BAHASA ARAB FUSHA STANDAR PESANTREN (الأسئلة باللغة العربية الفصحى) YANG LENGKAP DENGAN HAROKAT (تشكيل كامل: فتحة، كسرة، ضمة، سكون، شدة، تنوين) agar mudah dibaca santri kelas 3–6 Madrasah Diniyah.
Contoh gaya Bahasa Arab berharokat:
"كَمْ أَقْسَامُ الْمِيَاهِ الَّتِي يَجُوزُ التَّطْهِيرُ بِهَا؟ اُذْكُرْهَا!"
"مَا هِيَ فُرُوضُ الْوُضُوءِ؟ عَدِّدْهَا!"`;

    const promptText = `Anda adalah Katib / Dewan Asatidz ahli kitab kuning & kaligrafi Pegon di Pondok Pesantren NU Darussalam Karangdadap Pekalongan.
Tugas: Ekstrak seluruh butir soal dari input teks dan/atau gambar terlampir (misalnya 1-30 butir soal untuk mapel "${mapelNama}" kelas "${kelas}").
${styleGuide}

Untuk setiap butir soal, keluarkan JSON terstruktur berisi array "items":
- nomor: nomor Arab-Indic dua digit (٠١، ٠٢، ٠٣، ...)
- pertanyaanArab: teks soal hasil konversi dalam aksara ${isPegon ? 'Arab Pegon' : 'Bahasa Arab Fusha berharokat lengkap'} (tanpa nomor di depan karena nomor sudah terpisah)
- terjemahanIndonesia: teks asli Bahasa Indonesia yang rapi per butir soal
- kunciJawaban: ringkasan kunci jawaban singkat sesuai fiqih/nahwu/kitab kuning pesantren (dalam bahasa Indonesia/Arab singkat).`;

    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
      { text: promptText },
    ];

    if (teksSoal?.trim()) {
      parts.push({ text: `Daftar / Naskah Soal Bahasa Indonesia:\n${teksSoal.trim()}` });
    }

    if (imageBase64) {
      const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      parts.push({
        inlineData: {
          mimeType: imageMimeType || 'image/png',
          data: cleanBase64,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: [{ role: 'user', parts }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nomor: { type: Type.STRING },
                  pertanyaanArab: { type: Type.STRING },
                  terjemahanIndonesia: { type: Type.STRING },
                  kunciJawaban: { type: Type.STRING },
                },
                required: ['nomor', 'pertanyaanArab', 'terjemahanIndonesia', 'kunciJawaban'],
              },
            },
          },
          required: ['items'],
        },
      },
    });

    const rawText = response.text || '{}';
    const parsed = JSON.parse(rawText) as {
      items?: Array<{
        nomor?: string;
        pertanyaanArab: string;
        terjemahanIndonesia?: string;
        kunciJawaban?: string;
      }>;
    };

    const items = (parsed.items || []).map((it, idx) => ({
      nomor: it.nomor?.trim() || toArabicNomor(idx + 1),
      pertanyaanArab: it.pertanyaanArab?.trim() || '',
      terjemahanIndonesia: it.terjemahanIndonesia?.trim() || '',
      kunciJawaban: it.kunciJawaban?.trim() || '',
    }));

    return res.json({ items });
  } catch (err) {
    console.error('Error /api/imtihan/convert-soal:', err);
    const formatted = formatGeminiErrorMessage(err);
    return res.status(formatted.status).json({
      error: formatted.message,
    });
  }
});

// Asisten Virtual Resmi Pondok & ERP (Server-Side Proxy Gemini API)
app.post('/api/assistant', async (req, res) => {
  try {
    const {
      prompt = '',
      contextMode = 'landing_public',
      moduleContext = 'Beranda Portal',
      userRole = 'Pengguna',
      history = [],
    } = req.body as {
      prompt?: string;
      contextMode?: 'landing_public' | 'erp_internal';
      moduleContext?: string;
      userRole?: string;
      history?: Array<{ sender: 'ai' | 'user'; text: string }>;
    };

    const cleanPrompt = typeof prompt === 'string' ? prompt.trim() : '';
    if (!cleanPrompt) {
      return res.status(400).json({ error: 'Pertanyaan tidak boleh kosong.' });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.status(503).json({
        error: 'GEMINI_API_KEY belum dikonfigurasi pada menu Settings > Secrets.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const systemInstruction =
      contextMode === 'landing_public'
        ? `Anda adalah Asisten Virtual Resmi Publik Pondok Pesantren NU Darussalam Karangdadap, Kabupaten Pekalongan, Jawa Tengah (51173).
Pengasuh Pondok: KH. Amin Maizun. Email resmi: nudarussalam21@gmail.com.
Data Resmi Pondok:
- Total Santri Mukim: 366 santri (putra & putri terpisah), Dewan Asatidz: 35+ ustadz/ustadzah alumni pesantren salaf, Madrasah Diniyah Salafiyah (Kelas 1 s.d. 6 MDS, 12+ ruang kelas).
- Asrama: 9 kamar asrama putra dan 10 kamar asrama putri.
- Fasilitas Utama: Unit Usaha Laundry Pondok (Rp 80.000/bulan, santri tidak mencuci sendiri), Kantin Higienis Non-Tunai / Cashless pakai Kartu Santri Digital RFID (wali bisa pantau & batasi jajan harian), air minum galon.
- Rincian Biaya Santri Baru: Infaq Pendaftaran Rp 150.000, Daftar Ulang & MOSBA Rp 600.000, 2 Stel Seragam Rp 450.000, Paket Kitab Kuning & Buku Rp 350.000, Syahriyah Bulanan Rp 650.000/bulan (makan 3x, asrama, madrasah diniyah).
- Alur PSB Online: Klik tombol "Daftar PSB" di halaman utama -> Isi Formulir Pendaftar Baru standar EMIS & unggah foto KK/KIP -> Konfirmasi pembayaran infaq pendaftaran -> Tes baca Al-Qur'an & penetapan kamar/NIS oleh panitia.
- Jadwal Harian: Mulai 03.45 WIB (qiyamul lail & Subuh jamaah), pengajian kitab kuning bandongan pagi, sekolah formal, madrasah diniyah sore, Nastakmir 15 menit sebelum Maghrib, muhafazhah nadhom & musyawarah kitab malam, wajib tidur 22.00 WIB. Santri mukim reguler dilarang membawa smartphone.

ATURAN KERAS:
1. Jawablah pertanyaan calon santri dan wali santri secara ramah, santun khas pesantren ("Assalamu'alaikum", "Alhamdulillah", "Nggih"), akurat, dan langsung menjawab inti pertanyaan.
2. DILARANG membocorkan data internal rahasia (password akun guru/admin, nilai santri perorangan, rincian kas internal, catatan takzir, atau data pribadi santri). Jika ditanya hal internal, tolak dengan sopan dan arahkan agar menghubungi Sekretariat atau login ke Portal ERP.`
        : `Anda adalah Asisten Cerdas Operasional ERP Pondok Pesantren NU Darussalam Karangdadap, Pekalongan.
Pengguna saat ini login dengan peran: "${userRole}" dan sedang membuka modul: "${moduleContext}".

PETA FITUR & MODUL ERP AKURAT (gunakan panduan ini untuk menjawab tepat sasaran):
1. Manajemen Data Login Guru / Ustadz (Username, Password, No. WA OTP):
   - Dikelola terpusat pada satu tempat saja: modul "Hak Akses Role" (khusus Administrator Sistem) -> tab "Akun Guru & Staf". Di sana Admin dapat melihat daftar akun seluruh Dewan Asatidz (termasuk tombol Lihat/Sembunyikan Kata Sandi, Salin Kredensial, Reset Sandi, Edit No. WA OTP, dan Tambah/Hapus Akun).
   - Setiap penambahan Ustadz baru di Ma'arifan Diniyah -> Dewan Asatidz otomatis membuatkan akun login ERP-nya di Hak Akses Role.
2. Imtihan & Nilai:
   - Pengajuan naskah soal -> Verifikasi Ketua Imtihan / Kepala Madin -> Cetak Kop Arab -> Acak Denah 7 Ruang Bebas Contek -> Kartu Peserta 2MD#079 -> Input Nilai & Cetak Raport Predikat Arab -> RAB Imtihan.
   - Tersedia konversi teks/foto soal Bahasa Indonesia menjadi Arab Pegon atau Bahasa Arab berharokat di submenu Soal.
3. Majlis Ilmiah, Perumusan Hadits & Munaqosyah 3D:
   - Memuat 3 layanan: Simulasi Ruang Sidang Munaqosyah 3D, Forum Bahtsul Masail 4 Madzhab, serta Perumusan & Takhrij Hadits (51 Kitab Hadits Mu'tabarah).
4. SDM, Absensi Guru & Satpam:
   - Monitoring Guru real-time, Absensi Mobile Swafoto GPS & Absensi Pengajuan, Rekapitulasi Bulanan (gaya tabel resmi Putra/Putri/Diniyah), Monitoring & Manajemen Shift Satpam (Riyadi Suwarno, Sopoyono, dll.) beserta ekspor PDF. Login guru pengampu otomatis diarahkan langsung ke halaman Absensi Mobile.
5. BK & Keamanan:
   - Catatan poin takzir santri, buku tamu, serta antarmuka absensi mobile khusus Satpam (Riyadi Suwarno & Sopoyono).
6. Sekretariat:
   - Master Data 366 Santri, Persuratan Resmi, Manajemen Video Tutorial & Slide Presentasi (.pptx) beserta thumbnail kustom, serta editor konten Landing Page.
7. Buku Panduan & Pemasangan Aplikasi HP (PWA):
   - Berisi Video Tutorial semua modul, Slide PPT (.pptx), Panduan Pemasangan Aplikasi Absensi di HP Android & iPhone (PWA), dan ekspor database.
8. Pendaftaran PSB:
   - Formulir Pendaftar Baru EMIS (publik lewat halaman utama hanya bisa mengakses formulir daftar, tidak bisa masuk ke antrean admin), sedangkan antrean verifikasi & pengesahan menjadi Santri Aktif (penerbitan NIS & kamar) hanya ada di ERP untuk pengurus berwenang.

Jawablah langsung pertanyaan pengguna dalam Bahasa Indonesia yang jelas, ringkas (maksimal 250 kata), terstruktur (poin bernomor bila perlu), dan relevan dengan modul yang sedang dibuka.`;

    const rawHistory = Array.isArray(history)
      ? history
          .slice(-10)
          .filter((h) => h && typeof h.text === 'string' && h.text.trim())
          .map((h) => ({
            role: h.sender === 'user' ? ('user' as const) : ('model' as const),
            parts: [{ text: h.text.trim() }],
          }))
      : [];

    const normalizedHistory: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    for (const entry of rawHistory) {
      if (normalizedHistory.length === 0 && entry.role === 'model') continue;
      const prev = normalizedHistory[normalizedHistory.length - 1];
      if (prev && prev.role === entry.role) {
        prev.parts[0].text = `${prev.parts[0].text}\n${entry.parts[0].text}`;
      } else {
        normalizedHistory.push(entry);
      }
    }
    if (
      normalizedHistory.length > 0 &&
      normalizedHistory[normalizedHistory.length - 1].role === 'user'
    ) {
      normalizedHistory.pop();
    }

    const contents = [
      ...normalizedHistory,
      { role: 'user' as const, parts: [{ text: cleanPrompt }] },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents,
      config: {
        systemInstruction,
      },
    });

    const answer = response.text?.trim();
    if (!answer) {
      return res.status(502).json({
        error: 'Asisten AI tidak mengembalikan teks jawaban. Silakan coba ulangi pertanyaan Anda.',
      });
    }

    return res.json({ text: answer });
  } catch (err) {
    console.error('Error /api/assistant:', err);
    const formatted = formatGeminiErrorMessage(err);
    return res.status(formatted.status).json({
      error: formatted.message,
    });
  }
});

// Forum Bahtsul Masail AI (4 Madzhab Klasik Berbasis Kitab Mu'tabarah)
app.post('/api/bahtsul-masail', async (req, res) => {
  let cleanAsilah = '';
  try {
    const { asilah = '' } = req.body as { asilah?: string };
    cleanAsilah = asilah.trim();
    if (!cleanAsilah) {
      return res.status(400).json({ error: "Harap masukkan permasalahan (as'ilah) yang akan dibahas." });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.json({
        ...resolveLocalBahtsulMasail(cleanAsilah),
        fallbackSource: 'kitab_lbm_local',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });

    const systemPrompt = `Anda adalah Dewan Mushahih & Perumus Lembaga Bahtsul Masail (LBM) Pondok Pesantren NU Darussalam Karangdadap.
Tugas Anda: Membahas permasalahan fiqih kontemporer maupun klasik ("${cleanAsilah}") secara objektif menurut metodologi pesantren NU (qauli, ilhaqi, manhaji) dengan menelaah 4 Madzhab Mu'tabarah: Syafi'iyah, Hanafiyah, Malikiyah, dan Hanabilah.
Keluarkan JSON sesuai skema dengan rujukan kitab mu'tabarah asli (seperti Tuhfatul Muhtaj, Fathul Mu'in, Al-Majmu', Raddul Muhtar, Fathul Qadir, Mawahibul Jalil, Al-Mughni, Kassyaf al-Qina'), ibarat Arab berharokat yang akurat, Juz/Halaman, Bab, pendapat mu'tamad, kaidah fiqhiyah, serta rumusan singkat untuk papan sidang.`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            judulRingkas: { type: Type.STRING },
            masalahArab: { type: Type.STRING },
            asalJawaban: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  madzhab: { type: Type.STRING },
                  ringkasanKitab: { type: Type.STRING },
                },
                required: ['madzhab', 'ringkasanKitab'],
              },
            },
            petaPendapat: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  madzhab: { type: Type.STRING },
                  arabLabel: { type: Type.STRING },
                  statusBadge: { type: Type.STRING },
                  ringkasStance: { type: Type.STRING },
                },
                required: ['madzhab', 'arabLabel', 'statusBadge', 'ringkasStance'],
              },
            },
            pendapatPerMadzhab: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  madzhab: { type: Type.STRING },
                  arabLabel: { type: Type.STRING },
                  kode: { type: Type.STRING },
                  ringkasanHukum: { type: Type.STRING },
                  penjelasan: { type: Type.STRING },
                  rincian: { type: Type.ARRAY, items: { type: Type.STRING } },
                  pendapatMutamad: { type: Type.STRING },
                  ulamaQuotes: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        namaUlama: { type: Type.STRING },
                        kitabHalaman: { type: Type.STRING },
                        terjemah: { type: Type.STRING },
                        teksArab: { type: Type.STRING },
                      },
                      required: ['namaUlama', 'kitabHalaman', 'terjemah', 'teksArab'],
                    },
                  },
                  dalilQuranHadits: { type: Type.STRING },
                  kaidahFiqhiyah: { type: Type.STRING },
                  rujukanKitabDetail: {
                    type: Type.OBJECT,
                    properties: {
                      judulKitab: { type: Type.STRING },
                      judulArab: { type: Type.STRING },
                      pengarang: { type: Type.STRING },
                      juzHalaman: { type: Type.STRING },
                      bab: { type: Type.STRING },
                      teksArabLengkap: { type: Type.STRING },
                      highlightArab: { type: Type.STRING },
                      terjemahan: { type: Type.STRING },
                    },
                    required: [
                      'judulKitab',
                      'judulArab',
                      'pengarang',
                      'juzHalaman',
                      'bab',
                      'teksArabLengkap',
                      'highlightArab',
                      'terjemahan',
                    ],
                  },
                },
                required: [
                  'madzhab',
                  'arabLabel',
                  'kode',
                  'ringkasanHukum',
                  'penjelasan',
                  'rincian',
                  'pendapatMutamad',
                  'ulamaQuotes',
                  'dalilQuranHadits',
                  'kaidahFiqhiyah',
                  'rujukanKitabDetail',
                ],
              },
            },
            rumusanSidang: {
              type: Type.OBJECT,
              properties: {
                ringkasanPapan: { type: Type.STRING },
                tarjihMushahih: { type: Type.STRING },
                langkahPengambilanHukum: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      judul: { type: Type.STRING },
                      deskripsi: { type: Type.STRING },
                    },
                    required: ['judul', 'deskripsi'],
                  },
                },
                kaidahDipakai: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      arab: { type: Type.STRING },
                      arti: { type: Type.STRING },
                    },
                    required: ['arab', 'arti'],
                  },
                },
              },
              required: ['ringkasanPapan', 'tarjihMushahih', 'langkahPengambilanHukum', 'kaidahDipakai'],
            },
          },
          required: [
            'judulRingkas',
            'masalahArab',
            'asalJawaban',
            'petaPendapat',
            'pendapatPerMadzhab',
            'rumusanSidang',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      id: `bm-ai-${Date.now()}`,
      asilah: cleanAsilah,
      tanggalSidang: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      peringatan:
        "Dalam beramal, ikuti satu madzhab secara utuh (umumnya Syafi'i). Jangan mencampur pendapat yang paling ringan dari beberapa madzhab (talfiq). Bila ragu, tanyakan kepada kiai atau masyayikh pondok.",
      isAiGenerated: true,
      ...parsed,
    });
  } catch (err) {
    console.warn(
      'Fallback /api/bahtsul-masail ke telaah Kitab Mu\'tabarah LBM:',
      err instanceof Error ? err.message : err
    );
    return res.json({
      ...resolveLocalBahtsulMasail(cleanAsilah || "Hukum fiqih kontemporer menurut 4 madzhab"),
      fallbackSource: 'kitab_lbm_local',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use((req, res, next) => {
      if (req.method !== 'GET' || !req.path.startsWith('/assets/')) return next();
      const acceptEncoding = String(req.headers['accept-encoding'] || '');
      const cleanRel = req.path.replace(/^\/+/, '');
      const candidates: Array<{ ext: string; enc: string }> = [];
      if (acceptEncoding.includes('br')) candidates.push({ ext: '.br', enc: 'br' });
      if (acceptEncoding.includes('gzip')) candidates.push({ ext: '.gz', enc: 'gzip' });

      for (const c of candidates) {
        const compressedPath = path.resolve(distPath, `${cleanRel}${c.ext}`);
        if (compressedPath.startsWith(distPath) && fs.existsSync(compressedPath)) {
          if (req.path.endsWith('.js')) res.type('application/javascript');
          else if (req.path.endsWith('.css')) res.type('text/css');
          else if (req.path.endsWith('.svg')) res.type('image/svg+xml');
          res.setHeader('Content-Encoding', c.enc);
          res.setHeader('Vary', 'Accept-Encoding');
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          return res.sendFile(compressedPath);
        }
      }
      return next();
    });
    app.use(express.static(distPath, { maxAge: '7d' }));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ERP PP NU Darussalam] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

export default app;
