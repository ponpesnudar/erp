import { PONDOK_CONFIG } from '../data/seed/pondokData.ts';

// Client-side / proxy-safe Gemini caller with structured grounding
export async function askPondokAssistant(
  prompt: string,
  contextMode: 'landing_public' | 'erp_internal' = 'landing_public',
  moduleContext?: string,
  userRole?: string
): Promise<string> {
  const apiKey = (import.meta as unknown as { env: Record<string, string> }).env.VITE_GEMINI_API_KEY || '';

  const landingKnowledge = `
Profil Pondok:
Nama: ${PONDOK_CONFIG.nama} (${PONDOK_CONFIG.subNama})
Alamat: ${PONDOK_CONFIG.alamat}, Kec. ${PONDOK_CONFIG.kecamatan}, Kab. ${PONDOK_CONFIG.kabupaten} 51173. Email: ${PONDOK_CONFIG.email}
Pengasuh: ${PONDOK_CONFIG.pengasuh.nama}
Total Santri: ${PONDOK_CONFIG.statistik.totalSantri} (${PONDOK_CONFIG.statistik.santriPutra} putra, ${PONDOK_CONFIG.statistik.santriPutri} putri)
Asatidz: ${PONDOK_CONFIG.statistik.asatidz} asatidz
Kamar: 9 kamar asrama putra dan 10 kamar asrama putri.
Fasilitas Utama: Laundry pondok (unit usaha, santri tidak mencuci pakaian sendiri agar fokus mengaji), kantin higienis & kartu jajan digital tanpa uang tunai (cashless), dispenser air minum galon, Madrasah Diniyah Salafiyah (12 ruang kelas).
Biaya Pendaftaran Baru:
- Infaq Pendaftaran: Rp 150.000
- Daftar Ulang & MOSBA: Rp 600.000
- Seragam 2 stel: Rp 450.000
- Kitab & Buku: Rp 350.000
- Syahriyah bulanan (makan 3x + asrama + madin): Rp 650.000 / bulan
- Laundry pondok: Rp 80.000 / bulan
Alur Pendaftaran: 1. Isi formulir online / offline, 2. Bayar infaq pendaftaran, 3. Unggah berkas & tes baca Al-Qur'an, 4. Penetapan kamar & NIS santri.
Peraturan Utama: Santri wajib mengikuti shalat jamaah 5 waktu, pengajian diniyah pagi & sore, tidur tepat waktu pukul 22.00, tidak boleh membawa smartphone bagi santri mukim reguler.
`;

  const systemInstruction = contextMode === 'landing_public'
    ? `Anda adalah Asisten Virtual Resmi Publik Pondok Pesantren NU Darussalam Karangdadap, Pekalongan.
Tugas Anda: Menjawab pertanyaan calon santri dan wali santri secara ramah, santun berakhlaq pesantren, dan akurat HANYA seputar informasi pondok, yaitu: biaya pendaftaran, kegiatan harian, fasilitas (jumlah kamar putra ada 9 dan putri ada 10, laundry pondok, kantin kartu jajan), kurikulum diniyah, dan alur pendaftaran.

BATASAN KETAT:
Jika ditanya mengenai topik internal rahasia seperti: nilai santri perorangan, uang kas pondok, saldo internal, password, data pribadi santri lain, atau administrasi internal, TOLAK DENGAN SOPAN dan arahkan penanya untuk login ke portal resmi atau menghubungi Kantor Sekretariat Pondok / Panitia.
Gunakan Bahasa Indonesia yang halus dan bersahabat khas pesantren ("Assalamu'alaikum", "Alhamdulillah", "Nggih").
Data Rujukan:
${landingKnowledge}`
    : `Anda adalah Asisten Cerdas ERP Pondok Pesantren NU Darussalam.
Pengguna saat ini memiliki hak akses sebagai peran: ${userRole || 'Pengguna'} dan sedang membuka modul: ${moduleContext || 'Beranda'}.
Bantu pengguna memahami cara menggunakan fitur modul tersebut, alur kerja, tips pengisian data, dan aturan imtihan/keuangan pesantren. Jawab dengan ringkas dan to-the-point.`;

  if (!apiKey) {
    // Intelligent Offline / Mock Fallback based on keywords
    return generateFallbackAnswer(prompt, contextMode);
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
        maxOutputTokens: 500,
      },
    });

    return response.text || generateFallbackAnswer(prompt, contextMode);
  } catch (err) {
    console.warn('Gemini API call failed, falling back to local knowledge base:', err);
    return generateFallbackAnswer(prompt, contextMode);
  }
}

function generateFallbackAnswer(prompt: string, contextMode: 'landing_public' | 'erp_internal'): string {
  const lower = prompt.toLowerCase();

  if (contextMode === 'landing_public') {
    if (lower.includes('biaya') || lower.includes('infaq') || lower.includes('syahriyah') || lower.includes('uang')) {
      return "Assalamu'alaikum. Rincian biaya masuk santri baru di PP NU Darussalam: Infaq pendaftaran Rp 150.000, Daftar ulang & MOSBA Rp 600.000, 2 Stel Seragam Rp 450.000, Paket Kitab Rp 350.000. Untuk Syahriyah bulanan adalah Rp 650.000 (sudah termasuk makan 3x sehari, asrama, dan diniyah) serta paket laundry pondok Rp 80.000/bulan.";
    }
    if (lower.includes('kamar') || lower.includes('asrama') || lower.includes('fasilitas') || lower.includes('ruang')) {
      return "Pondok Pesantren NU Darussalam memiliki 9 kamar asrama putra dan 10 kamar asrama putri. Seluruh kamar berpenghawaan alami dan dilengkapi lemari santri. Untuk pakaian, santri tidak mencuci sendiri karena tersedia Unit Usaha Laundry Pondok yang bersih dan wangi.";
    }
    if (lower.includes('laundry') || lower.includes('cuci')) {
      return "Santri di PP NU Darussalam tidak mencuci baju sendiri agar bisa fokus menghafal dan mengaji kitab kuning. Laundry dikelola profesional oleh unit usaha pondok dengan biaya terjangkau Rp 80.000/bulan.";
    }
    if (lower.includes('kantin') || lower.includes('jajan') || lower.includes('kartu')) {
      return "Kantin pondok melayani transaksi non-tunai (cashless) menggunakan Kartu Santri Digital RFID. Wali santri dapat memantau riwayat jajan anaknya secara online dan mengatur batas maksimal jajan per hari.";
    }
    if (lower.includes('daftar') || lower.includes('cara') || lower.includes('psb') || lower.includes('syarat')) {
      return "Pendaftaran santri baru dapat dilakukan dengan 4 langkah mudah: 1. Buat akun & isi formulir di menu 'Daftar Santri Baru', 2. Bayar infaq pendaftaran Rp 150.000, 3. Unggah berkas (KK, Akta, Ijazah/Rapor), 4. Verifikasi & penempatan kamar oleh pengurus.";
    }
    if (lower.includes('kegiatan') || lower.includes('jadwal') || lower.includes('bangun')) {
      return "Kegiatan santri dimulai pukul 03.45 untuk qiyamul lail dan shubuh berjamaah, dilanjutkan pengajian bandongan kitab kuning pagi, sekolah formal, diniyah sore (nahwu shorof & pegon), shalat maghrib & muhafazhah nadhom, pengajian malam, musyawarah kitab, dan wajib istirahat pukul 22.00 WIB.";
    }
    if (lower.includes('nilai') || lower.includes('saldo') || lower.includes('uang kas') || lower.includes('rahasia')) {
      return "Mohon maaf, data nilai santri, riwayat transaksi, dan keuangan kas merupakan informasi internal. Silakan login ke Portal ERP Pondok menggunakan akun yang telah terdaftar untuk mengakses data tersebut.";
    }
    return "Assalamu'alaikum. Saya Asisten Resmi Pondok Pesantren NU Darussalam Karangdadap. Ada yang bisa saya bantu seputar informasi pendaftaran, rincian biaya, fasilitas asrama, kegiatan harian, atau peraturan pondok?";
  }

  return "Sistem ERP Pondok Pesantren NU Darussalam Karangdadap siap melayani administrasi pendidikan, imtihan, persuratan, dan keuangan secara terintegrasi.";
}
