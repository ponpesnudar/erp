import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

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
