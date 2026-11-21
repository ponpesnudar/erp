export type MunaqosyahTingkat = 'Kelas 3' | 'Kelas 6';

export type MunaqosyahBenchId = 'moderator' | 'nahwu_shorof' | 'fiqih' | 'alquran';

export interface MunaqosyahBenchConfig {
  id: MunaqosyahBenchId;
  nomorBangku: number;
  label: string;
  arabLabel: string;
  kitabKelas3: string;
  kitabKelas6: string;
  pengujiDefault: string;
  warnaBadge: string;
}

export const MUNAQOSYAH_BENCHES: MunaqosyahBenchConfig[] = [
  {
    id: 'moderator',
    nomorBangku: 1,
    label: 'Moderator Majlis',
    arabLabel: 'الْمُدِيرُ (المُقَدِّمُ)',
    kitabKelas3: 'Tata Tertib, Doa Iftitah & Adab Munaqosyah',
    kitabKelas6: 'Sidang Terbuka, Doa Iftitah & Adab Mutakhorrijin',
    pengujiDefault: 'Ustadz Ahmad Fauzan, S.Pd.I',
    warnaBadge: '#0F6B43',
  },
  {
    id: 'nahwu_shorof',
    nomorBangku: 2,
    label: 'Penanya & Jawab Fan Nahwu Shorof',
    arabLabel: 'فَنُّ النَّحْوِ وَالصَّرْفِ',
    kitabKelas3: "Nadhom Al-'Imrithi & Tashrif Amtsilah",
    kitabKelas6: 'Alfiyah Ibnu Malik (1002 Bait) & I\'lal',
    pengujiDefault: 'Ustadz Muhammad Hasyim Asy\'ari',
    warnaBadge: '#0E7490',
  },
  {
    id: 'fiqih',
    nomorBangku: 3,
    label: 'Penanya & Jawab Fan Fiqih',
    arabLabel: 'فَنُّ الْفِقْهِ الشَّافِعِي',
    kitabKelas3: 'Fathul Qorib (Matan Taqrib)',
    kitabKelas6: "Fathul Mu'in bi Syarh Qurratil 'Ain",
    pengujiDefault: 'Ustadz Abdul Mughni, Lc.',
    warnaBadge: '#1D4ED8',
  },
  {
    id: 'alquran',
    nomorBangku: 4,
    label: "Penanya & Penguji Fan Al-Qur'an",
    arabLabel: 'فَنُّ الْقُرْآنِ وَالتَّجْوِيدِ',
    kitabKelas3: 'Tajwid Tuhfatul Athfal, Makharij & Juz 30',
    kitabKelas6: 'Tahqiq, Gharib Al-Qur\'an & Surat Pilihan (Yasin, Waqi\'ah, Mulk)',
    pengujiDefault: 'Ustadz Qori\' Abdurrahman al-Hafidz',
    warnaBadge: '#B45309',
  },
];

export interface MunaqosyahQuestionBank {
  id: string;
  tingkat: MunaqosyahTingkat;
  benchId: MunaqosyahBenchId;
  kitabNama: string;
  bab: string;
  teksArabSoal: string;
  pertanyaanIndo: string;
  kunciJawabanSingkat: string;
}

export const MUNAQOSYAH_QUESTION_BANK: MunaqosyahQuestionBank[] = [
  // ======================== KELAS 3 (IMRITHI, FATHUL QORIB, AL-QUR'AN) ========================
  {
    id: 'mq3-mod-1',
    tingkat: 'Kelas 3',
    benchId: 'moderator',
    kitabNama: 'Adab Majlis Munaqosyah Kelas 3',
    bab: 'Pembukaan Sidang & Kesiapan Kitab',
    teksArabSoal: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ — رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    pertanyaanIndo:
      'Sebutkan doa pembuka thalabul \'ilmi dan tunjukkan kitab Imrithi, Fathul Qorib, serta Al-Qur\'an yang telah dimaknai pegon lengkap!',
    kunciJawabanSingkat: 'Membaca doa dengan tartil dan memperlihatkan kelengkapan kitab pegon.',
  },
  {
    id: 'mq3-nahwu-1',
    tingkat: 'Kelas 3',
    benchId: 'nahwu_shorof',
    kitabNama: "Nadhom Al-'Imrithi",
    bab: 'Bab Al-Kalam & Pembagian Kalimat',
    teksArabSoal: 'كَلاَمُهُمْ لَفْظٌ مُفِيدٌ مُسْنَدُ ۞ وَالْكِلْمَةُ اللَّفْظُ الْمُفِيدُ الْمُفْرَدُ',
    pertanyaanIndo:
      "Jelaskan syarat-syarat Kalam menurut Nadhom Al-'Imrithi beserta pembagian kalimah (Isim, Fi'il, Huruf) serta tashrif fi'il tsulatsi mujarrod!",
    kunciJawabanSingkat:
      'Kalam harus memenuhi 4 syarat: Lafazh, Murakkab, Mufid, dan Wadha\' bil Arabi. Kalimah terbagi 3: Isim, Fi\'il, Huruf.',
  },
  {
    id: 'mq3-nahwu-2',
    tingkat: 'Kelas 3',
    benchId: 'nahwu_shorof',
    kitabNama: "Nadhom Al-'Imrithi",
    bab: 'Bab Al-I\'rob wal Bina\'',
    teksArabSoal: 'إِعْرَابُهُمْ تَغْيِيرُ آخِرِ الْكَلِمْ ۞ تَقْدِيرًا اوْ لَفْظًا لِعَامِلٍ عُلِمْ',
    pertanyaanIndo:
      "Apa perbedaan I'rob Lafzhi dan I'rob Taqdiri pada Isim Maqshur serta Isim Manqush dalam bait Nadhom Al-'Imrithi?",
    kunciJawabanSingkat:
      "Isim Maqshur (seperti الْفَتَى) dikira-kirakan ketiga harakatnya karena ta'adzdzur; Isim Manqush (الْقَاضِي) dikira-kirakan rafa' & jar karena tsiqal.",
  },
  {
    id: 'mq3-fiqih-1',
    tingkat: 'Kelas 3',
    benchId: 'fiqih',
    kitabNama: 'Fathul Qorib (Matan Taqrib)',
    bab: 'Kitab Ath-Thaharah — Macam-Macam Air & Fardhu Wudhu',
    teksArabSoal: 'فَصْلٌ: وَفُرُوضُ الْوُضُوءِ سِتَّةُ أَشْيَاءَ: النِّيَّةُ عِنْدَ غَسْلِ الْوَجْهِ...',
    pertanyaanIndo:
      'Bacakan ibarat Fathul Qorib tentang 6 fardhu wudhu, dan jelaskan hukum air musta\'mal serta air kurang dua qullah yang terkena najis!',
    kunciJawabanSingkat:
      '6 Fardhu: Niat saat membasuh muka, membasuh muka, membasuh tangan s.d siku, mengusap sebagian kepala, membasuh kaki s.d mata kaki, tertib.',
  },
  {
    id: 'mq3-fiqih-2',
    tingkat: 'Kelas 3',
    benchId: 'fiqih',
    kitabNama: 'Fathul Qorib (Matan Taqrib)',
    bab: 'Kitab Ash-Shalah — Shalat Jama\' & Qashar',
    teksArabSoal: 'وَيَجُوزُ لِلْمُسَافِرِ قَصْرُ الصَّلَاةِ الرُّبَاعِيَّةِ بِخَمْسِ شَرَائِطَ...',
    pertanyaanIndo:
      'Sebutkan 5 syarat diperbolehkannya Shalat Qashar bagi musafir menurut kitab Fathul Qorib beserta batasan jarak marhalah-nya!',
    kunciJawabanSingkat:
      'Bukan safar maksiat, jarak minimal 2 marhalah (±82-89 km), sholat 4 rakaat, niat qashar saat takbiratul ihram, tidak bermakmum kepada muqim/mutimm.',
  },
  {
    id: 'mq3-quran-1',
    tingkat: 'Kelas 3',
    benchId: 'alquran',
    kitabNama: "Fan Al-Qur'an & Tajwid",
    bab: 'Hukum Nun Mati / Tanwin, Mad & Setoran Juz \'Amma',
    teksArabSoal: 'وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ حُنَفَاءَ',
    pertanyaanIndo:
      'Uraikan hukum tajwid (Idzhar, Idgham, Iqlab, Ikhfa\', serta Mad Wajib/Jaiz) pada QS. Al-Bayyinah ayat 5 dan lanjutkan hafalan ayat berikutnya!',
    kunciJawabanSingkat:
      'َمَا أُمِرُوا: Mad Jaiz Munfashil; مُخْلِصِينَ: Mad Thabi\'i; حُنَفَاءَ: Mad Wajib Muttashil (4-5 harakat); lanjutkan بِمَا يُقِيمُوا الصَّلَاةَ...',
  },

  // ======================== KELAS 6 (ALFIYAH IBNU MALIK, FATHUL MU'IN, AL-QUR'AN) ========================
  {
    id: 'mq6-mod-1',
    tingkat: 'Kelas 6',
    benchId: 'moderator',
    kitabNama: 'Sidang Munaqosyah Akhir Kelas 6',
    bab: 'Pembukaan & Kesiapan Uji Terbuka',
    teksArabSoal: 'قَالَ مُحَمَّدٌ هُوَ ابْنُ مَالِكِ ۞ أَحْمَدُ رَبِّي اللَّهَ خَيْرَ مَالِكِ',
    pertanyaanIndo:
      'Peserta kelas 6 dipersilakan membacakan muqaddimah Alfiyah Ibnu Malik dan bersiap menjawab pertanyaan dari penguji Nahwu Shorof (Alfiyah), Fiqih (Fathul Mu\'in), dan Al-Qur\'an.',
    kunciJawabanSingkat: 'Siap lahir batin dengan adab santri mutakhorrijin Pondok Pesantren NU Darussalam.',
  },
  {
    id: 'mq6-nahwu-1',
    tingkat: 'Kelas 6',
    benchId: 'nahwu_shorof',
    kitabNama: 'Alfiyah Ibnu Malik',
    bab: "Bab An-Na'ib 'an al-Fa'il & Isytighal",
    teksArabSoal: 'يَنُوبُ مَفْعُولٌ بِهِ عَنْ فَاعِلِ ۞ فِيمَا لَهُ كَنِيلَ خَيْرُ نَائِلِ',
    pertanyaanIndo:
      "Jelaskan kaidah perubahan bentuk fi'il madhi & mudhari' saat menjadi Mabni Majhul (Na'ibul Fa'il) menurut Alfiyah serta syarat lafadz yang boleh menjadi Na'ibul Fa'il selain Maf'ul Bih!",
    kunciJawabanSingkat:
      "Dhammah huruf awal dan kasrah huruf sebelum akhir (madhi) / fathah (mudhari'). Dapat pula digantikan oleh Zharaf Mutasharrif, Jar Majrur, atau Mashdar yang mukhtash.",
  },
  {
    id: 'mq6-nahwu-2',
    tingkat: 'Kelas 6',
    benchId: 'nahwu_shorof',
    kitabNama: 'Alfiyah Ibnu Malik',
    bab: 'Bab Al-Mubtada wal Khabar & Ta\'addud al-Khabar',
    teksArabSoal: 'وَلاَ يَجُوزُ الِابْتِدَا بِالنَّكِرَهْ ۞ مَا لَمْ تُفِدْ كَعِنْدَ زَيْدٍ نَمِرَهْ',
    pertanyaanIndo:
      'Sebutkan minimal 6 musawwighat (alasan yang memperbolehkan Mubtada dari Isim Nakirah) sesuai bait Alfiyah Ibnu Malik beserta contohnya!',
    kunciJawabanSingkat:
      'Didahului khabar berupa zharaf/jar-majrur, didahului istifham, didahului nafi, disifati (nakirah maushufah), diamalkan, atau di-idhafahkan kepada nakirah.',
  },
  {
    id: 'mq6-fiqih-1',
    tingkat: 'Kelas 6',
    benchId: 'fiqih',
    kitabNama: "Fathul Mu'in",
    bab: "Fashl fi Shifat ash-Shalah — Niat & Qashd-Ta'arrudh-Ta'yin",
    teksArabSoal: 'وَيَجِبُ قَرْنُ النِّيَّةِ بِالتَّكْبِيرِ وَفِي ذَلِكَ قَوْلَانِ: الْمُخْتَارُ الِاكْتِفَاءُ بِالْمُقَارَنَةِ الْعُرْفِيَّةِ...',
    pertanyaanIndo:
      "Jelaskan perbandingan al-Muqaranah al-Haqiqiyah (Imam Nawawi dalam Minhaj) dengan al-Muqaranah al-'Urfiyah (al-Mukhtar dalam Fathul Mu'in) pada niat Takbiratul Ihram!",
    kunciJawabanSingkat:
      "Fathul Mu'in memilih Muqaranah 'Urfiyah (cukup menghadirkan niat secara global saat membaca takbir), sedangkan Muqaranah Haqiqiyah mewajibkan kesertaan rincian niat dari awal hamzah Allah hingga huruf ra' Akbar.",
  },
  {
    id: 'mq6-fiqih-2',
    tingkat: 'Kelas 6',
    benchId: 'fiqih',
    kitabNama: "Fathul Mu'in",
    bab: 'Kitab al-Bai\' — Riba, Salam & Khiyar Majlis',
    teksArabSoal: 'وَيَثْبُتُ لِلْمُتَبَايِعَيْنِ خِيَارُ الْمَجْلِسِ مَا لَمْ يَتَفَرَّقَا بِأَبْدَانِهِمَا عُرْفًا',
    pertanyaanIndo:
      "Uraikan aplikasi hukum Khiyar Majlis & Bai' Mu'athah (jual beli tanpa ijab qabul lisan seperti di minimarket/transaksi digital) menurut Fathul Mu'in dan tarjih Imam Nawawi!",
    kunciJawabanSingkat:
      "Dalam madzhab Syafi'i mu'tamad syarat ijab qabul sharih, namun Imam Nawawi & al-Mutawalli membolehkan Bai' Mu'athah pada perkara yang dianggap jual beli oleh 'urf masyarakat.",
  },
  {
    id: 'mq6-quran-1',
    tingkat: 'Kelas 6',
    benchId: 'alquran',
    kitabNama: "Fan Al-Qur'an, Gharib & Surat Pilihan",
    bab: 'Tahqiq Bacaan Gharib (Isymam, Imalah, Saktah, Naql) & Surat Pilihan',
    teksArabSoal: 'وَقَالَ ارْكَبُوا فِيهَا بِسْمِ اللَّهِ مَجْرَاهَا وَمُرْسَاهَا ۚ إِنَّ رَبِّي لَغَفُورٌ رَّحِيمٌ',
    pertanyaanIndo:
      'Praktikkan bacaan Imalah Kubra pada QS. Hud: 41, Saktah pada QS. Yasin: 52, serta lanjutkan tilawah Surat Al-Waqi\'ah / Al-Mulk secara bil-ghaib!',
    kunciJawabanSingkat:
      'مَجْر۪يهَا dibaca imalah (e condong ke i); Yasin 52 berhenti tanpa bernapas pada مَرْقَدِنَا ۜ selama 2 harakat (Saktah).',
  },
];

export interface MunaqosyahMakroEnvelope {
  id: string;
  nomorMakro: number;
  kodeAmplop: string;
  tingkat: MunaqosyahTingkat;
  kitabSumber: string;
  lokasiKitab: string; // e.g., "Bab Thoharoh, Fashl Syurutut Tayammumi, Hal. 3 Baris ke-5 dari atas"
  teksArabMakro: string;
  terjemahMakro: string;
  nahwu: {
    kitabRujukan: string;
    baitAtauKaidahArab: string;
    pertanyaanIndo: string;
    kunciJawaban: string;
  };
  fiqih: {
    kitabRujukan: string;
    pertanyaanIndo: string;
    kunciJawaban: string;
  };
  alquran: {
    suratAyat: string;
    teksArabAyat: string;
    pertanyaanTajwidIndo: string;
    kunciJawaban: string;
  };
}

export const MUNAQOSYAH_MAKRO_ENVELOPES: MunaqosyahMakroEnvelope[] = [
  // ======================== KELAS 3: FATHUL QORIB + IMRITHI + AL-QUR'AN ========================
  {
    id: 'makro-k3-1',
    nomorMakro: 1,
    kodeAmplop: "Amplop Makro' 01",
    tingkat: 'Kelas 3',
    kitabSumber: 'Fathul Qorib (Matan Al-Ghayah wat Taqrib)',
    lokasiKitab: 'Bab Thoharoh · Fashl Syurutut Tayammumi · Hal. 3 Baris ke-5 dari atas',
    teksArabMakro:
      'فَصْلٌ: وَشَرَائِطُ التَّيَمُّمِ خَمْسَةُ أَشْيَاءَ: وُجُودُ الْعُذْرِ بِسَفَرٍ أَوْ مَرَضٍ، وَدُخُولُ وَقْتِ الصَّلَاةِ، وَطَلَبُ الْمَاءِ، وَتَعَذُّرُ اسْتِعْمَالِهِ، وَالتُّرَابُ الطَّاهِرُ الَّذِي لَهُ غُبَارٌ',
    terjemahMakro:
      'Fasal: Syarat-syarat tayammum ada lima perkara: adanya udzur sebab bepergian atau sakit, masuknya waktu sholat, mencari air terlebih dahulu, adanya halangan menggunakan air, dan memakai debu suci yang berdebu.',
    nahwu: {
      kitabRujukan: "Nadhom Al-'Imrithi (Bab Al-I'rob & Isim Ghairu Munsharif)",
      baitAtauKaidahArab:
        'وَجَرُّهُ بِالْفَتْحَةِ مَا لاَ يَنْصَرِفْ ۞ مَا لَمْ يُضَفْ أَوْ يَأْتِ بَعْدَ أَلْ رَدِفْ',
      pertanyaanIndo:
        "Pada Makro' 1 (وَشَرَائِطُ التَّيَمُّمِ خَمْسَةُ أَشْيَاءَ): tentukan i'rob lafazh خَمْسَةُ, mengapa أَشْيَاءَ dibaca fathah padahal posisinya mudhof ilaih (majrur), dan tashrifkan mashdar التَّيَمُّمُ beserta fi'il madhi-mudhari'-nya!",
      kunciJawaban:
        "خَمْسَةُ menjadi Khabar marfu' dengan dhammah; أَشْيَاءَ adalah Isim Ghairu Munsharif (Alif Ta'nits Mamdudah) sehingga tanda jar-nya fathah. Tashrif: تَيَمَّمَ - يَتَيَمَّمُ - تَيَمُّمًا (bab tafa''ala).",
    },
    fiqih: {
      kitabRujukan: 'Fathul Qorib — Bab Thoharoh (Syurutut Tayammumi)',
      pertanyaanIndo:
        "Berdasarkan Makro' 1 Bab Thoharoh Syurutut Tayammumi hal. 3 baris ke-5 tersebut, sebutkan 5 syarat sah tayammum dan jelaskan batasan sakit yang membolehkan tayammum serta hukum debu yang bercampur tepung!",
      kunciJawaban:
        'Lima syarat: udzur safar/sakit (dikhawatirkan membahayakan nyawa/anggota badan atau memperlama sembuh), masuk waktu sholat fardhu, mencari air setelah masuk waktu, berhalangan memakai air, serta debu suci mensucikan yang berdebu dan tidak bercampur tepung/kapur.',
    },
    alquran: {
      suratAyat: 'QS. An-Nisa Ayat 43 & Hukum Tajwid',
      teksArabAyat: 'فَلَمْ تَجِدُوا مَاءً فَتَيَمَّمُوا صَعِيدًا طَيِّبًا فَامْسَحُوا بِوُجُوهِكُمْ وَأَيْدِيكُمْ',
      pertanyaanTajwidIndo:
        'Bacalah ayat tersebut dengan tartil, lalu jelaskan hukum tajwid pada lafazh مَاءً فَتَيَمَّمُوا, صَعِيدًا طَيِّبًا, serta بِوُجُوهِكُمْ وَأَيْدِيكُمْ!',
      kunciJawaban:
        "مَاءً: Mad Wajib Muttashil (4-5 harakat); مَاءً فَتَيَمَّمُوا & صَعِيدًا طَيِّبًا: Ikhfa' Haqiqi; بِوُجُوهِكُمْ وَأَيْدِيكُمْ: Idzhar Syafawi.",
    },
  },
  {
    id: 'makro-k3-2',
    nomorMakro: 2,
    kodeAmplop: "Amplop Makro' 02",
    tingkat: 'Kelas 3',
    kitabSumber: 'Fathul Qorib (Matan Al-Ghayah wat Taqrib)',
    lokasiKitab: 'Bab Thoharoh · Fashl Furudhul Wudhu · Hal. 2 Baris ke-3 dari atas',
    teksArabMakro:
      'فَصْلٌ: وَفُرُوضُ الْوُضُوءِ سِتَّةُ أَشْيَاءَ: النِّيَّةُ عِنْدَ غَسْلِ الْوَجْهِ، وَغَسْلُ الْوَجْهِ، وَغَسْلُ الْيَدَيْنِ إِلَى الْمِرْفَقَيْنِ، وَمَسْحُ بَعْضِ الرَّأْسِ، وَغَسْلُ الرِّجْلَيْنِ إِلَى الْكَعْبَيْنِ، وَالتَّرْتِيبُ',
    terjemahMakro:
      'Fasal: Fardhu-fardhu wudhu ada enam perkara: niat bersamaan dengan membasuh wajah, membasuh wajah, membasuh kedua tangan hingga siku, mengusap sebagian kepala, membasuh kedua kaki hingga mata kaki, dan tertib.',
    nahwu: {
      kitabRujukan: "Nadhom Al-'Imrithi (Bab Al-Mutsanna & Al-Idhafah)",
      baitAtauKaidahArab:
        'بِالأَلِفِ ارْفَعِ الْمُثَنَّى وَكِلاَ ۞ إِذَا بِمُضْمَرٍ مُضَافًا وُصِلاَ',
      pertanyaanIndo:
        "Pada Makro' 2: sebutkan tanda i'rob lafazh الْيَدَيْنِ dan الْمِرْفَقَيْنِ, lalu uraikan alasan إِلَى الْمِرْفَقَيْنِ dibaca kasrah/ya' dan tashrif fi'il dari غَسْلٌ!",
      kunciJawaban:
        "الْيَدَيْنِ mudhof ilaih majrur dengan ya' karena Isim Tatsniyah; الْمِرْفَقَيْنِ majrur oleh huruf jar إِلَى dengan tanda ya'. Tashrif: غَسَلَ - يَغْسِلُ - غَسْلاً (fa'ala-yaf'ilu).",
    },
    fiqih: {
      kitabRujukan: 'Fathul Qorib — Bab Thoharoh (Furudhul Wudhu)',
      pertanyaanIndo:
        "Jelaskan maksud النِّيَّةُ عِنْدَ غَسْلِ الْوَجْهِ pada Makro' 2 dan bagaimana hukumnya apabila seseorang niat wudhu sebelum air menyentuh wajah atau setelah sebagian wajah terbasuh?",
      kunciJawaban:
        'Niat wajib qarn (bersamaan) dengan awal basuhan bagian wajah. Jika niat sebelum basuhan wajah lalu putus sebelum menyentuh wajah maka belum sah; jika baru niat di tengah basuhan wajah maka basuhan sebelumnya wajib diulang.',
    },
    alquran: {
      suratAyat: 'QS. Al-Maidah Ayat 6 & Hukum Tajwid',
      teksArabAyat: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ',
      pertanyaanTajwidIndo:
        'Bacalah QS. Al-Maidah ayat 6 di atas, kemudian jelaskan hukum mad pada يَا أَيُّهَا, قُمْتُمْ إِلَى, serta alif lam pada الصَّلَاةِ!',
      kunciJawaban:
        "يَا أَيُّهَا: Mad Jaiz Munfashil; قُمْتُمْ إِلَى: Idzhar Syafawi; الصَّلَاةِ: Alif Lam Syamsiyah & Tafkhim lam jalalah tidak berlaku (lam maftuhah).",
    },
  },
  {
    id: 'makro-k3-3',
    nomorMakro: 3,
    kodeAmplop: "Amplop Makro' 03",
    tingkat: 'Kelas 3',
    kitabSumber: 'Fathul Qorib (Matan Al-Ghayah wat Taqrib)',
    lokasiKitab: 'Bab Thoharoh · Fashl Nawaqidul Wudhu · Hal. 4 Baris ke-2 dari atas',
    teksArabMakro:
      'فَصْلٌ: وَالَّذِي يَنْقُضُ الْوُضُوءَ خَمْسَةُ أَشْيَاءَ: مَا خَرَجَ مِنَ السَّبِيلَيْنِ، وَالنَّوْمُ عَلَى غَيْرِ هَيْئَةِ الْمُتَمَكِّنِ، وَزَوَالُ الْعَقْلِ بِسُكْرٍ أَوْ مَرَضٍ، وَلَمْسُ الرَّجُلِ الْمَرْأَةَ الْأَجْنَبِيَّةَ مِنْ غَيْرِ حَائِلٍ',
    terjemahMakro:
      'Fasal: Perkara yang membatalkan wudhu ada lima hal: sesuatu yang keluar dari dua jalan, tidur tidak dalam posisi duduk tetap, hilangnya akal sebab mabuk atau sakit, serta bersentuhnya kulit laki-laki dan perempuan bukan mahram tanpa penghalang.',
    nahwu: {
      kitabRujukan: "Nadhom Al-'Imrithi (Bab Isim Maushul & Shilah)",
      baitAtauKaidahArab:
        'وَالْجُمْلَةُ الصِّلَةُ بَعْدَ الْمَوْصُولِ ۞ لَابُدَّ مِنْ عَائِدِهَا بِالْمَعْقُولِ',
      pertanyaanIndo:
        "Analisis i'rob kalimat وَالَّذِي يَنْقُضُ الْوُضُوءَ: di mana letak shilah maushul dan 'aid-nya, serta mengapa السَّبِيلَيْنِ dibaca dengan ya' sukun?",
      kunciJawaban:
        "الَّذِي Mubtada mabni sukun; jumlah fi'liyah يَنْقُضُ الْوُضُوءَ adalah shilah maushul dengan dhamir mustatir هُوَ sebagai 'aid; السَّبِيلَيْنِ majrur oleh مِن dengan ya' karena Isim Tatsniyah.",
    },
    fiqih: {
      kitabRujukan: 'Fathul Qorib — Nawaqidul Wudhu',
      pertanyaanIndo:
        "Pada Makro' 3 tersebut, jelaskan kriteria الْمُتَمَكِّنِ saat tidur sehingga tidak membatalkan wudhu dan siapa yang dimaksud الْمَرْأَةَ الْأَجْنَبِيَّةَ!",
      kunciJawaban:
        'Mutamakkin ialah duduk yang pantatnya menempel rapat di lantai sehingga angin tidak mungkin keluar tanpa terasa. Ajnabiyah adalah perempuan bukan mahram baik karena nasab, persusuan, maupun mushaharah.',
    },
    alquran: {
      suratAyat: 'QS. An-Nisa Ayat 43 (Potongan Awal) & Tajwid',
      teksArabAyat: 'أَوْ جَاءَ أَحَدٌ مِّنكُم مِّنَ الْغَائِطِ أَوْ لَامَسْتُمُ النِّسَاءَ فَلَمْ تَجِدُوا مَاءً',
      pertanyaanTajwidIndo:
        'Bacalah ayat tersebut dan sebutkan hukum nun mati/tanwin pada أَحَدٌ مِّنكُم مِّنَ dan hukum mim mati pada لَامَسْتُمُ / فَلَمْ تَجِدُوا!',
      kunciJawaban:
        "أَحَدٌ مِّنكُم: Idgham Bighunnah; مِّنكُم: Ikhfa' Haqiqi; مِّنكُم مِّنَ: Idgham Mimi; فَلَمْ تَجِدُوا: Idzhar Syafawi.",
    },
  },
  {
    id: 'makro-k3-4',
    nomorMakro: 4,
    kodeAmplop: "Amplop Makro' 04",
    tingkat: 'Kelas 3',
    kitabSumber: 'Fathul Qorib (Matan Al-Ghayah wat Taqrib)',
    lokasiKitab: 'Bab Sholah · Fashl Syurutush Sholah · Hal. 6 Baris ke-7 dari atas',
    teksArabMakro:
      'فَصْلٌ: وَشَرَائِطُ الصَّلَاةِ قَبْلَ الدُّخُولِ فِيهَا خَمْسَةُ أَشْيَاءَ: طَهَارَةُ الْأَعْضَاءِ مِنَ الْحَدَثِ وَالنَّجَسِ، وَسَتْرُ الْعَوْرَةِ بِلِبَاسٍ طَاهِرٍ، وَالْوُقُوفُ عَلَى مَكَانٍ طَاهِرٍ، وَالْعِلْمُ بِدُخُولِ الْوَقْتِ، وَاسْتِقْبَالُ الْقِبْلَةِ',
    terjemahMakro:
      'Fasal: Syarat-syarat sholat sebelum memasukinya ada lima: sucinya badan dari hadats dan najis, menutup aurat dengan pakaian suci, berdiri di tempat yang suci, mengetahui masuknya waktu, dan menghadap kiblat.',
    nahwu: {
      kitabRujukan: "Nadhom Al-'Imrithi (Bab Zharaf & Mashdar)",
      baitAtauKaidahArab:
        'الظَّرْفُ مَنْصُوبٌ عَلَى إِضْمَارِ فِي ۞ زَمَانًا اوْ مَكَانًا بِالْحُصُولِ يَفِي',
      pertanyaanIndo:
        "Sebutkan kedudukan i'rob قَبْلَ pada قَبْلَ الدُّخُولِ dan wazan shorof dari kata اسْتِقْبَالُ serta fi'il madhi-nya!",
      kunciJawaban:
        'قَبْلَ adalah Zharaf Zaman manshub dengan fathah; اسْتِقْبَالُ mengikuti wazan اِسْتِفْعَالٌ dari fi\'il madhi اِسْتَقْبَلَ - يَسْتَقْبِلُ.',
    },
    fiqih: {
      kitabRujukan: 'Fathul Qorib — Syurutush Sholah',
      pertanyaanIndo:
        "Sesuai Makro' 4, sebutkan batas aurat laki-laki dan perempuan dalam sholat, serta dalam keadaan apa diperbolehkan tidak menghadap kiblat!",
      kunciJawaban:
        'Aurat laki-laki antara pusar dan lutut; aurat perempuan merdeka seluruh tubuh kecuali wajah dan kedua telapak tangan. Boleh tidak menghadap kiblat saat sholat Khauf (darurat) dan sholat sunnah di atas kendaraan dalam safar.',
    },
    alquran: {
      suratAyat: 'QS. Al-Baqarah Ayat 144 & Tajwid',
      teksArabAyat: 'فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ ۚ وَحَيْثُ مَا كُنتُمْ فَوَلُّوا وُجُوهَكُمْ شَطْرَهُ',
      pertanyaanTajwidIndo:
        'Bacalah ayat kiblat tersebut dengan fashih lalu identifikasi hukum Qalqalah, Ikhfa\', dan Mad Aridh Lissukun!',
      kunciJawaban:
        "وَجْهَكَ & شَطْرَ: Qalqalah Shughra (jim & tha sukun tengah kalimat); كُنتُمْ: Ikhfa' Haqiqi.",
    },
  },

  // ======================== KELAS 6: FATHUL MU'IN + ALFIYAH IBNU MALIK + AL-QUR'AN ========================
  {
    id: 'makro-k6-1',
    nomorMakro: 1,
    kodeAmplop: "Amplop Makro' 01",
    tingkat: 'Kelas 6',
    kitabSumber: "Fathul Mu'in bi Syarh Qurratil 'Ain",
    lokasiKitab: "Bab Shifatish Sholah · Fashl Muqaranatun Niyyah · Hal. 14 Baris ke-4 dari atas",
    teksArabMakro:
      'وَيَجِبُ قَرْنُ النِّيَّةِ بِالتَّكْبِيرِ، وَفِي ذَلِكَ قَوْلَانِ: الْمُخْتَارُ الِاكْتِفَاءُ بِالْمُقَارَنَةِ الْعُرْفِيَّةِ بِأَنْ يَكُونَ مُسْتَحْضِرًا لَهَا عِنْدَ أَوَّلِهِ وَدَوَامُهُ إِلَى آخِرِهِ كَمَا اخْتَارَهُ الْإِمَامُ وَالْغَزَالِيُّ',
    terjemahMakro:
      "Wajib menyertakan niat bersama takbiratul ihram. Dalam hal ini terdapat dua pendapat; pendapat al-Mukhtar mencukupkan dengan muqaranah 'urfiyah yakni menghadirkan niat pada permulaan takbir dan berlanjut hingga akhirnya sebagaimana dipilih Imam al-Haramain dan al-Ghazali.",
    nahwu: {
      kitabRujukan: 'Alfiyah Ibnu Malik (Bab Al-Mubtada wal Khabar & An-Na\'at)',
      baitAtauKaidahArab:
        'وَلاَ يَجُوزُ الِابْتِدَا بِالنَّكِرَهْ ۞ مَا لَمْ تُفِدْ كَعِنْدَ زَيْدٍ نَمِرَهْ',
      pertanyaanIndo:
        "Pada Makro' 1 Kelas 6 (وَيَجِبُ قَرْنُ النِّيَّةِ... الْمُخْتَارُ الِاكْتِفَاءُ): tentukan kedudukan الْمُخْتَارُ, الِاكْتِفَاءُ, serta مُسْتَحْضِرًا (mengapa dibaca nashab dan bagaimana shighot shorofnya?)",
      kunciJawaban:
        "الْمُخْتَارُ Mubtada marfu'; الِاكْتِفَاءُ Khabar marfu'; مُسْتَحْضِرًا menjadi Khabar يَكُونَ (Kana) sehingga manshub, shighot-nya Isim Fa'il dari اِسْتَحْضَرَ - يَسْتَحْضِرُ.",
    },
    fiqih: {
      kitabRujukan: "Fathul Mu'in — Bab Shifatish Sholah",
      pertanyaanIndo:
        "Bedakan secara rinci antara Al-Muqaranah Al-Haqiqiyah (tarjih Imam Nawawi) dan Al-Muqaranah Al-'Urfiyah (pilihan pengarang Fathul Mu'in), beserta tiga rukun niat sholat fardhu (Qashd, Ta'arrudh, Ta'yin)!",
      kunciJawaban:
        "Muqaranah Haqiqiyah mewajibkan kesertaan rinci niat sejak awal hamzah Allah hingga akhir ra' Akbar. Muqaranah 'Urfiyah (al-Mukhtar) cukup kesadaran niat secara umum saat takbir agar tidak menimbulkan waswas.",
    },
    alquran: {
      suratAyat: "QS. Hud Ayat 41 & Al-Waqi'ah (Tahqiq & Gharib)",
      teksArabAyat: 'وَقَالَ ارْكَبُوا فِيهَا بِسْمِ اللَّهِ مَجْرَاهَا وَمُرْسَاهَا ۚ إِنَّ رَبِّي لَغَفُورٌ رَّحِيمٌ',
      pertanyaanTajwidIndo:
        'Bacalah ayat tersebut dengan kaidah Imam Ashim riwayat Hafsh serta praktikkan bacaan Imalah Kubra pada مَجْر۪يهَا!',
      kunciJawaban:
        'مَجْر۪يهَا dibaca Imalah Kubra (bunyi ra fathah condong ke kasrah ~ "majreeha"); pada رَبِّي لَغَفُورٌ رَّحِيمٌ terdapat Idgham Bilaghunnah.',
    },
  },
  {
    id: 'makro-k6-2',
    nomorMakro: 2,
    kodeAmplop: "Amplop Makro' 02",
    tingkat: 'Kelas 6',
    kitabSumber: "Fathul Mu'in bi Syarh Qurratil 'Ain",
    lokasiKitab: "Bab Al-Bai' · Fashl Bai'ul Mu'athah wal Khiyar · Hal. 68 Baris ke-2 dari atas",
    teksArabMakro:
      'وَيَثْبُتُ لِلْمُتَبَايِعَيْنِ خِيَارُ الْمَجْلِسِ مَا لَمْ يَتَفَرَّقَا بِأَبْدَانِهِمَا عُرْفًا، وَأَمَّا الْمُعَاطَاةُ فَلَا تَنْعَقِدُ عِنْدَنَا وَاخْتَارَ النَّوَوِيُّ انْعِقَادَهَا فِي كُلِّ مَا يَعُدُّهُ النَّاسُ بَيْعًا',
    terjemahMakro:
      "Hak khiyar majlis tetap berlaku bagi penjual dan pembeli selama keduanya belum berpisah badan secara 'urf. Adapun jual beli mu'athah tanpa shighat lisan tidak sah menurut pendapat mu'tamad Syafi'iyah, namun Imam Nawawi memilih sah pada setiap hal yang dianggap jual beli oleh masyarakat.",
    nahwu: {
      kitabRujukan: "Alfiyah Ibnu Malik (Bab An-Na'ib 'an al-Fa'il & 'Amil Nawashib/Jawazim)",
      baitAtauKaidahArab:
        'بِلاَ نَوْنٍ يَزُولُ التَّثْنِيَةْ ۞ عِنْدَ الإِضَافَةِ وَالْجَمْعُ سَوِيَّةْ',
      pertanyaanIndo:
        "Pada Makro' 2 Kelas 6: mengapa يَتَفَرَّقَا pada مَا لَمْ يَتَفَرَّقَا kehilangan huruf nun? Jelaskan pula alamat i'rob لِلْمُتَبَايِعَيْنِ dan kedudukan عُرْفًا!",
      kunciJawaban:
        "يَتَفَرَّقَا adalah fi'il mudhari' dari Af'alul Khamsah yang dijazmkan oleh لَمْ sehingga tanda jazm-nya Hadzfun Nun (membuang nun). لِلْمُتَبَايِعَيْنِ majrur dengan ya' (Tatsniyah); عُرْفًا manshub sebagai Tamyiz atau Hal.",
    },
    fiqih: {
      kitabRujukan: "Fathul Mu'in — Bab Al-Bai'",
      pertanyaanIndo:
        "Bagaimana hukum transaksi di toko modern atau e-commerce/QRIS tanpa ijab qabul lisan apabila kita mengikuti qaul Imam Nawawi vs qaul mu'tamad dalam Fathul Mu'in?",
      kunciJawaban:
        "Menurut mu'tamad madzhab Syafi'i harus ada ijab qabul (shighat); namun dalam muamalah modern diperbolehkan bertaqlid kepada tarjih Imam Nawawi, Imam al-Mutawalli, & Imam al-Baghawi bahwa Mu'athah sah selama dianggap transaksi sah oleh 'urf.",
    },
    alquran: {
      suratAyat: 'QS. Al-Baqarah Ayat 275 & Tahqiq Saktah/Waqaf',
      teksArabAyat: 'وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا ۚ فَمَن جَاءَهُ مَوْعِظَةٌ مِّن رَّبِّهِ فَانتَهَىٰ',
      pertanyaanTajwidIndo:
        'Bacalah ayat riba tersebut dan urai hukum tajwid pada فَمَن جَاءَهُ, مَوْعِظَةٌ مِّن رَّبِّهِ, serta فَانتَهَىٰ!',
      kunciJawaban:
        "فَمَن جَاءَهُ: Ikhfa' Haqiqi & Mad Wajib Muttashil; مَوْعِظَةٌ مِّن: Idgham Bighunnah; مِّن رَّبِّهِ: Idgham Bilaghunnah; فَانتَهَىٰ: Ikhfa' Haqiqi.",
    },
  },
  {
    id: 'makro-k6-3',
    nomorMakro: 3,
    kodeAmplop: "Amplop Makro' 03",
    tingkat: 'Kelas 6',
    kitabSumber: "Fathul Mu'in bi Syarh Qurratil 'Ain",
    lokasiKitab: 'Bab Az-Zakah · Fashl Zakatul Fithri · Hal. 49 Baris ke-6 dari atas',
    teksArabMakro:
      'وَتَجِبُ زَكَاةُ الْفِطْرِ بِإِدْرَاكِ جُزْءٍ مِنْ رَمَضَانَ وَجُزْءٍ مِنْ شَوَّالٍ، وَيُخْرَجُ صَاعٌ مِنْ غَالِبِ قُوتِ الْبَلَدِ، وَيَحْرُمُ تَأْخِيرُهَا عَنْ يَوْمِ الْعِيدِ بِلَا عُذْرٍ',
    terjemahMakro:
      'Zakat fitrah wajib sebab menjumpai sebagian waktu Ramadhan dan sebagian waktu Syawal. Dikeluarkan satu sha\' dari makanan pokok negeri tersebut, dan haram mengakhirkannya hingga lewat hari raya Id tanpa udzur.',
    nahwu: {
      kitabRujukan: 'Alfiyah Ibnu Malik (Bab Al-Mabni lil Majhul & Ghairu Munsharif)',
      baitAtauKaidahArab:
        'يَنُوبُ مَفْعُولٌ بِهِ عَنْ فَاعِلِ ۞ فِيمَا لَهُ كَنِيلَ خَيْرُ نَائِلِ',
      pertanyaanIndo:
        "Identifikasi bentuk fi'il pada وَيُخْرَجُ صَاعٌ dalam Makro' 3, sebutkan Na'ibul Fa'il-nya, dan jelaskan mengapa مِنْ رَمَضَانَ dibaca fathah sedangkan مِنْ شَوَّالٍ dibaca kasrah!",
      kunciJawaban:
        "يُخْرَجُ adalah fi'il mudhari' mabni majhul; صَاعٌ Na'ibul Fa'il marfu'. رَمَضَانَ Isim Ghairu Munsharif (Alamiyah + Alif Nun Zaidatain) sehingga majrur dengan fathah, sementara شَوَّالٍ adalah Munsharif.",
    },
    fiqih: {
      kitabRujukan: "Fathul Mu'in — Bab Zakatul Fithri",
      pertanyaanIndo:
        "Jelaskan waktu wajib, waktu jawaz, waktu afdhal, dan waktu haram menunaikan Zakat Fitrah berdasarkan Makro' 3 Fathul Mu'in, serta takaran 1 Sha' dalam gram/kilogram!",
      kunciJawaban:
        'Waktu wajib sejak terbenam matahari akhir Ramadhan; waktu jawaz sejak awal Ramadhan; waktu afdhal ba\'da Subuh sebelum sholat Id; haram melewati terbenam matahari 1 Syawal tanpa udzur. 1 Sha\' sekitar 2,75 kg (lazim digenapkan 2,8–3 kg beras).',
    },
    alquran: {
      suratAyat: 'QS. Yasin Ayat 52 (Gharib Saktah) & Surat Al-Mulk',
      teksArabAyat: 'قَالُوا يَا وَيْلَنَا مَن بَعَثَنَا مِن مَّرْقَدِنَا ۜ ۗ هَٰذَا مَا وَعَدَ الرَّحْمَٰنُ وَصَدَقَ الْمُرْسَلُونَ',
      pertanyaanTajwidIndo:
        'Praktikkan bacaan Saktah pada مَرْقَدِنَا ۜ هَٰذَا serta jelaskan hukum Iqlab dan Idgham pada ayat di atas!',
      kunciJawaban:
        'Saktah: berhenti sejenak (±2 harakat) tanpa mengambil napas setelah مَرْقَدِنَا lalu lanjut هَٰذَا. مَن بَعَثَنَا: Iqlab; مِن مَّرْقَدِنَا: Idgham Bighunnah.',
    },
  },
];

export interface MunaqosyahRecord {
  id: string;
  tanggal: string;
  tahunAjaran: string;
  tingkat: MunaqosyahTingkat;
  santriId: string;
  santriNama: string;
  santriNis: string;
  santriKelas: string;
  makroKode?: string;
  makroLokasi?: string;
  pengujiModerator: string;
  pengujiNahwu: string;
  pengujiFiqih: string;
  pengujiAlquran: string;
  nilaiModerator: number; // Undian Makro' & Adab (0-100)
  nilaiNahwu: number; // Imrithi / Alfiyah (0-100)
  nilaiFiqih: number; // Fathul Qorib / Fathul Mu'in (0-100)
  nilaiAlquran: number; // Tajwid, Gharib & Bacaan (0-100)
  rataRata: number;
  predikat: 'Mumtaz' | 'Jayyid Jiddan' | 'Jayyid' | 'Maqbul' | 'Mengulang';
  statusLulus: 'Lulus' | 'Perlu Pembinaan';
  catatanDewan: string;
}

export function calcMunaqosyahSummary(
  nMod: number,
  nNahwu: number,
  nFiqih: number,
  nQuran: number
): {
  rataRata: number;
  predikat: MunaqosyahRecord['predikat'];
  statusLulus: MunaqosyahRecord['statusLulus'];
} {
  const rataRata = Math.round(((nMod + nNahwu + nFiqih + nQuran) / 4) * 10) / 10;
  let predikat: MunaqosyahRecord['predikat'] = 'Mengulang';
  if (rataRata >= 90) predikat = 'Mumtaz';
  else if (rataRata >= 80) predikat = 'Jayyid Jiddan';
  else if (rataRata >= 70) predikat = 'Jayyid';
  else if (rataRata >= 60) predikat = 'Maqbul';

  return {
    rataRata,
    predikat,
    statusLulus: rataRata >= 60 ? 'Lulus' : 'Perlu Pembinaan',
  };
}

export const SEED_MUNAQOSYAH_RECORDS: MunaqosyahRecord[] = [
  {
    id: 'mq-seed-1',
    tanggal: '2026-11-18',
    tahunAjaran: '2026/2027',
    tingkat: 'Kelas 3',
    santriId: 's-1',
    santriNama: 'MUHAMMAD KHUDZAIFAH',
    santriNis: '25.1005',
    santriKelas: '3 A PUTRA',
    pengujiModerator: 'Ustadz Ahmad Fauzan, S.Pd.I',
    pengujiNahwu: "Ustadz Muhammad Hasyim Asy'ari",
    pengujiFiqih: 'Ustadz Abdul Mughni, Lc.',
    pengujiAlquran: "Ustadz Qori' Abdurrahman al-Hafidz",
    nilaiModerator: 92,
    nilaiNahwu: 88,
    nilaiFiqih: 90,
    nilaiAlquran: 91,
    rataRata: 90.3,
    predikat: 'Mumtaz',
    statusLulus: 'Lulus',
    catatanDewan: "Lancar melafalkan bait Nadhom Al-'Imrithi & tepat dalam ibarat Fathul Qorib bab Thaharah.",
  },
  {
    id: 'mq-seed-2',
    tanggal: '2026-11-19',
    tahunAjaran: '2026/2027',
    tingkat: 'Kelas 6',
    santriId: 's-9',
    santriNama: 'AISYAH NURUL HIDAYAH',
    santriNis: '22.0812',
    santriKelas: '6 A PUTRA & PUTRI',
    pengujiModerator: 'Ustadz Ahmad Fauzan, S.Pd.I',
    pengujiNahwu: "Ustadz Muhammad Hasyim Asy'ari",
    pengujiFiqih: 'Ustadz Abdul Mughni, Lc.',
    pengujiAlquran: "Ustadz Qori' Abdurrahman al-Hafidz",
    nilaiModerator: 95,
    nilaiNahwu: 92,
    nilaiFiqih: 94,
    nilaiAlquran: 93,
    rataRata: 93.5,
    predikat: 'Mumtaz',
    statusLulus: 'Lulus',
    catatanDewan: "Penguasaan bait Alfiyah & analisis fiqih Fathul Mu'in sangat matang beserta bacaan Al-Qur'an tahqiq.",
  },
];
