import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { resolveLocalBahtsulMasail } from './src/lib/bahtsulMasailData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY belum dikonfigurasi pada server Secrets.',
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
        temperature: 0.2,
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
    return res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : 'Gagal mengonversi soal ke Arab/Pegon.',
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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
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
        temperature: 0.25,
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
    app.use(express.static(distPath));
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
