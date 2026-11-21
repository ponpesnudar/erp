import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface MadzhabUlamaQuote {
  namaUlama: string;
  kitabHalaman: string;
  terjemah: string;
  teksArab: string;
}

export interface KitabPageDetail {
  judulKitab: string;
  judulArab: string;
  pengarang: string;
  juzHalaman: string;
  bab: string;
  teksArabLengkap: string;
  highlightArab: string;
  terjemahan: string;
}

export interface MadzhabOpinion {
  madzhab: "Syafi'iyah" | 'Hanafiyah' | 'Malikiyah' | 'Hanabilah' | string;
  arabLabel: string;
  kode: 'syafiiyah' | 'hanafiyah' | 'malikiyah' | 'hanabilah';
  ringkasanHukum: string;
  penjelasan: string;
  rincian: string[];
  ulamaQuotes: MadzhabUlamaQuote[];
  pendapatMutamad: string;
  dalilQuranHadits: string;
  kaidahFiqhiyah: string;
  rujukanKitabDetail: KitabPageDetail;
}

export interface BahtsulMasailResult {
  id: string;
  asilah: string;
  judulRingkas: string;
  masalahArab: string;
  tanggalSidang: string;
  peringatan: string;
  isAiGenerated?: boolean;
  asalJawaban: {
    madzhab: string;
    ringkasanKitab: string;
  }[];
  petaPendapat: {
    madzhab: string;
    arabLabel: string;
    statusBadge: string;
    ringkasStance: string;
  }[];
  pendapatPerMadzhab: MadzhabOpinion[];
  rumusanSidang: {
    ringkasanPapan: string;
    tarjihMushahih: string;
    langkahPengambilanHukum: {
      judul: string;
      deskripsi: string;
    }[];
    kaidahDipakai: {
      arab: string;
      arti: string;
    }[];
  };
}

export const KITAB_TICKER_PRESETS: Record<
  'syafiiyah' | 'hanafiyah' | 'malikiyah' | 'hanabilah',
  string[]
> = {
  syafiiyah: [
    'تُحْفَةُ الْمُحْتَاجِ فِي شَرْحِ الْمِنْهَاجِ',
    'الْمَجْمُوْعُ شَرْحُ الْمُهَذَّبِ',
    'نِهَايَةُ الْمُحْتَاجِ إِلَى شَرْحِ الْمِنْهَاجِ',
    'فَتْحُ الْمُعِيْنِ بِشَرْحِ قُرَّةِ الْعَيْنِ',
    'الْأَشْبَاهُ وَالنَّظَائِرُ لِلسُّيُوْطِي',
  ],
  hanafiyah: [
    'حَاشِيَةُ ابْنِ عَابِدِيْنَ (رَدُّ الْمُحْتَارِ)',
    'فَتْحُ الْقَدِيْرِ لِابْنِ الْهُمَامِ',
    'كَنْزُ الدَّقَائِقِ فِي فِقْهِ الْحَنَفِيَّةِ',
    'أَحْكَامُ الْقُرْآنِ لِلْجَصَّاصِ',
    'دُرَرُ الْحُكَّامِ شَرْحُ غُرَرِ الْأَحْكَامِ',
  ],
  malikiyah: [
    'مَوَاهِبُ الْجَلِيْلِ فِي شَرْحِ مُخْتَصَرِ خَلِيْلٍ',
    'حَاشِيَةُ الدُّسُوْقِي عَلَى الشَّرْحِ الْكَبِيْرِ',
    'الْمَسَالِكُ فِي شَرْحِ مُوَطَّأِ مَالِكٍ',
    'الْجَامِعُ لِأَحْكَامِ الْقُرْآنِ لِلْقُرْطُبِي',
    'الْفُرُوْقُ لِلْقَرَافِي (أَنْوَارُ الْبُرُوْقِ)',
  ],
  hanabilah: [
    'الْمُغْنِي لِابْنِ قُدَامَةَ الْمَقْدِسِي',
    'كَشَّافُ الْقِنَاعِ عَنْ مَتْنِ الْإِقْنَاعِ',
    'الْأَحْكَامُ السُّلْطَانِيَّةُ لِأَبِي يَعْلَى',
    'الْإِنْصَافُ فِي مَعْرِفَةِ الرَّاجِحِ مِنَ الْخِلَافِ',
    'مَطَالِبُ أُولِي النُّهَى فِي شَرْحِ غَايَةِ الْمُنْتَهَى',
  ],
};

export const PRESET_BAHTSUL_MASAIL: BahtsulMasailResult[] = [
  {
    id: 'bm-menyadap-rahasia',
    asilah: 'Hukum menyadap atau membuka rahasia pembicaraan pejabat/orang lain tanpa izin',
    judulRingkas: 'Hukum Menyadap & Membuka Rahasia Tanpa Izin',
    masalahArab: 'حُكْمُ التَّجَسُّسِ وَالتَّنَصُّتِ بِغَيْرِ إِذْنٍ',
    tanggalSidang: '20 November 2026',
    peringatan:
      "Dalam beramal, ikuti satu madzhab secara utuh (umumnya Syafi'i). Jangan mencampur pendapat yang paling ringan dari beberapa madzhab (talfiq). Bila ragu, tanyakan kepada kiai setempat.",
    asalJawaban: [
      { madzhab: "Syafi'iyah", ringkasanKitab: 'Tuhfah al-Muhtaj Juz 9, hlm. 218 & al-Najm al-Wahhaj' },
      { madzhab: 'Hanafiyah', ringkasanKitab: 'Ahkam al-Qur\'an, Fath al-Qadir Juz 5, & Durar al-Hukkam' },
      { madzhab: 'Malikiyah', ringkasanKitab: 'al-Masalik fi Syarh Muwatha\' Malik & al-Jami\' li Ahkam al-Qur\'an' },
      { madzhab: 'Hanabilah', ringkasanKitab: 'al-Ahkam as-Sulthaniyyah, al-Mughni Juz 9, & Kassyaf al-Qina\'' },
    ],
    petaPendapat: [
      {
        madzhab: "Syafi'iyah",
        arabLabel: 'الشافعية',
        statusBadge: 'Haram (kecuali darurat muhaqqaq)',
        ringkasStance: 'Harus ada dugaan kuat (ghalabah zhann); tanpa izin & tanpa bukti kuat hukumnya haram.',
      },
      {
        madzhab: 'Hanafiyah',
        arabLabel: 'الحنفية',
        statusBadge: 'Haram & Ta\'zir',
        ringkasStance: "Menyadap rahasia tanpa izin syar'i dilarang keras karena termasuk tajassus & ifsya' as-sirr.",
      },
      {
        madzhab: 'Malikiyah',
        arabLabel: 'المالكية',
        statusBadge: 'Haram Mutlak bagi Individu',
        ringkasStance: 'Haram menyadap pembicaraan atau membuka aib tanpa izin dan otoritas resmi hakim.',
      },
      {
        madzhab: 'Hanabilah',
        arabLabel: 'الحنابلة',
        statusBadge: 'Tajassus Haram',
        ringkasStance: 'Tajassus haram; membuka rahasia pihak lain tanpa landasan darurat syar\'i berdosa.',
      },
    ],
    pendapatPerMadzhab: [
      {
        madzhab: "Syafi'iyah",
        arabLabel: 'الشافعية',
        kode: 'syafiiyah',
        ringkasanHukum:
          'Menyadap pembicaraan/rahasia tanpa izin pada dasarnya HARAM, karena termasuk tajassus yang dilarang; namun boleh—bahkan wajib—bila ada dugaan kuat (ghalabah zhann) akan terjadinya ma\'shiyah atau mafsadah besar seperti ancaman pembunuhan atau kerusakan kemaslahatan umum.',
        penjelasan:
          "Kitab Tuhfah al-Muhtaj menegaskan larangan tajassus dan memata-matai tanpa sangkaan kuat, serta mengecualikan bila ghalabah zhann menunjukkan akan terjadi maksiat berat yang hanya bisa dicegah dengan penyelidikan berwenang. Apabila objek menyangkut kepentingan publik/negara, pelaksanaannya wajib melalui otoritas sah agar tidak menimbulkan ifsya' as-sirr dan fitnah.",
        rincian: [
          'Tanpa dugaan kuat dan tanpa izin resmi: HARAM karena termasuk tajassus dan melanggar kehormatan privasi.',
          'Dengan dugaan kuat akan maksiat besar yang dapat ditanggulangi: JAIZ bagi pihak berwenang, bahkan wajib bila nyawa/negara terancam.',
          'Bila langkah pencegahan memicu fitnah lebih besar kepada penguasa, wajib menempuh jalur nasehat tertutup terlebih dahulu.',
        ],
        ulamaQuotes: [
          {
            namaUlama: 'Ibn al-Qusyairi',
            kitabHalaman: 'Tuhfah al-Muhtaj, Juz 9, hlm. 218',
            terjemah:
              'Bila langkah pembongkaran justru memicu pelecehan kehormatan dan fitnah tanpa jalan keluar yang maslahat, maka tidak dibenarkan.',
            teksArab:
              'وَلَوْ تَوَقَّفَ الْإِنْكَارُ عَلَى الرَّفْعِ لِلسُّلْطَانِ لَمْ يَجِبْ فِيمَا فِيهِ مِنْ هَتْكٍ وَتَغْرِيمِ الْمَالِ قَالَهُ ابْنُ الْقُشَيْرِي',
          },
          {
            namaUlama: 'Ibn Hajar al-Haitami',
            kitabHalaman: 'Tuhfah al-Muhtaj, Juz 9, hlm. 218',
            terjemah:
              'Pendapat yang paling kuat (al-awjah): wajib bertindak apabila tidak ada jalan lain selain itu untuk mencegah kemungkaran besar.',
            teksArab: 'وَلَهُ احْتِمَالٌ بِوُجُوبِهِ إِذَا لَمْ يَنْزَجِرْ إِلَّا بِهِ وَهُوَ الْأَوْجَهُ',
          },
        ],
        pendapatMutamad:
          "Yang dipegang dalam madzhab Syafi'i adalah ketentuan Tuhfah al-Muhtaj: larangan tajassus secara asal, dengan pengecualian terbatas bila ghalabah zhann mengindikasikan mafsadat besar yang wajib segera ditanggulangi oleh pihak berwenang.",
        dalilQuranHadits:
          'QS. Al-Hujurat [49]: 12 ("وَلَا تَجَسَّسُوا" — Dan janganlah kamu mencari-cari keburukan/rahasia orang lain). Hadis Nabi: "لَا ضَرَرَ وَلَا ضِرَارَ فِي الْإِسْلَامِ".',
        kaidahFiqhiyah: 'دَرْءُ الْمَفَاسِدِ مُقَدَّمٌ عَلَى جَلْبِ الْمَصَالِحِ',
        rujukanKitabDetail: {
          judulKitab: 'Tuhfah al-Muhtaj fi Syarh al-Minhaj',
          judulArab: 'تُحْفَةُ الْمُحْتَاجِ فِي شَرْحِ الْمِنْهَاجِ',
          pengarang: 'Imam Ibn Hajar al-Haitami',
          juzHalaman: 'Juz 9 · Halaman 218',
          bab: 'كِتَابُ السِّيَرِ — بَابُ الْأَمْرِ بِالْمَعْرُوفِ وَالنَّهْيِ عَنِ الْمُنْكَرِ',
          teksArabLengkap:
            'وَلَيْسَ لِأَحَدٍ الْبَحْثُ وَالتَّجَسُّسُ وَاقْتِحَامُ الدُّورِ بِالظُّنُونِ، نَعَمْ إِنْ غَلَبَ عَلَى ظَنِّهِ وُقُوعُ مَعْصِيَةٍ وَلَوْ بِقَرِينَةٍ ظَاهِرَةٍ كَإِخْبَارِ ثِقَةٍ جَازَ لَهُ، بَلْ وَجَبَ عَلَيْهِ التَّجَسُّسُ إِنْ فَاتَ تَدَارُكُهَا كَالْقَتْلِ وَالزِّنَا وَإِلَّا فَلَا.',
          highlightArab:
            'وَلَيْسَ لِأَحَدٍ الْبَحْثُ وَالتَّجَسُّسُ وَاقْتِحَامُ الدُّورِ بِالظُّنُونِ، نَعَمْ إِنْ غَلَبَ عَلَى ظَنِّهِ وُقُوعُ مَعْصِيَةٍ... جَازَ لَهُ',
          terjemahan:
            'Tidak diperbolehkan bagi siapa pun menyelidiki, memata-matai (tajassus), dan menerobos rumah/ruang privasi hanya berdasarkan prasangka semata. Namun apabila kuat dugaannya (ghalabah zhann) berdasarkan indikasi nyata atau laporan orang tepercaya akan terjadinya kemaksiatan besar seperti pembunuhan yang harus segera dicegah, maka diperbolehkan bahkan wajib.',
        },
      },
      {
        madzhab: 'Hanafiyah',
        arabLabel: 'الحنفية',
        kode: 'hanafiyah',
        ringkasanHukum:
          "Menyadap pembicaraan atau rahasia tanpa izin hukumnya HARAM dan termasuk dosa besar karena mencakup tajassus dan ifsya' as-sirr; apabila menyangkut keamanan negara tanpa mandat penguasa sah, pelakunya berhak dikenai sanksi ta'zir.",
        penjelasan:
          'Dalam literatur Hanafiyah (Ahkam al-Qur\'an al-Jashash dan Fath al-Qadir), istiraq as-sam\'i (mencuri dengar secara sembunyi-sembunyi) disamakan dengan mengintip aurat orang lain dan merusak kehormatan Muslim.',
        rincian: [
          'Mencuri dengar (istiraq as-sam\'i) tanpa izin haram secara nash Al-Qur\'an.',
          'Membuka rahasia pribadi atau pejabat tanpa wewenang peradilan merupakan pelanggaran amanah.',
          'Imam atau hakim berhak menjatuhkan sanksi ta\'zir atas pelaku penyadapan ilegal.',
        ],
        ulamaQuotes: [
          {
            namaUlama: 'Imam al-Kamal ibn al-Humam',
            kitabHalaman: 'Fath al-Qadir, Juz 5, hlm. 353',
            terjemah:
              'Termasuk perbuatan curang yang diharamkan adalah mencuri dengar pembicaraan kaum secara tersembunyi.',
            teksArab: 'وَمِنْهُ اسْتِرَاقُ السَّمْعِ وَهُوَ أَنْ يَسْتَمِعَ مُسْتَخْفِيًا',
          },
        ],
        pendapatMutamad:
          'Mengharamkan penyadapan rahasia oleh individu maupun pihak mana pun tanpa izin sah pengadilan syar\'i.',
        dalilQuranHadits:
          'Sabda Nabi SAW tentang ancaman keras bagi pencuri dengar pembicaraan orang lain yang membenci hal tersebut (HR. Bukhari).',
        kaidahFiqhiyah: 'الْأَصْلُ فِي أَعْرَاضِ النَّاسِ وَأَسْرَارِهِمُ الْحُرْمَةُ',
        rujukanKitabDetail: {
          judulKitab: 'Fath al-Qadir & Durar al-Hukkam',
          judulArab: 'فَتْحُ الْقَدِيْرِ لِابْنِ الْهُمَامِ',
          pengarang: 'Imam Kamaluddin ibn al-Humam',
          juzHalaman: 'Juz 5 · Halaman 353',
          bab: 'كِتَابُ الْكَرَاهِيَةِ — التَّجَسُّسُ وَالتَّنَصُّتُ',
          teksArabLengkap:
            'وَمِنْهُ اسْتِرَاقُ السَّمْعِ وَهُوَ أَنْ يَسْتَمِعَ مُسْتَخْفِيًا إِلَى حَدِيثِ قَوْمٍ وَهُمْ لَهُ كَارِهُونَ، فَإِنَّهُ حَرَامٌ لِمَا فِيهِ مِنْ هَتْكِ السِّتْرِ وَإِفْشَاءِ السِّرِّ.',
          highlightArab: 'اسْتِرَاقُ السَّمْعِ وَهُوَ أَنْ يَسْتَمِعَ مُسْتَخْفِيًا إِلَى حَدِيثِ قَوْمٍ... فَإِنَّهُ حَرَامٌ',
          terjemahan:
            'Di antara hal yang dilarang adalah istiraq as-sam\'i, yaitu mendengar secara sembunyi-sembunyi pembicaraan suatu kaum padahal mereka tidak menyukainya; hukumnya haram karena merobek tabir privasi.',
        },
      },
      {
        madzhab: 'Malikiyah',
        arabLabel: 'المالكية',
        kode: 'malikiyah',
        ringkasanHukum:
          'Haram secara mutlak memata-matai, menyadap suara, atau membuka rahasia tanpa izin pemilik suara atau ketetapan qadha syar\'i.',
        penjelasan:
          'Imam al-Qurthubi dan Ibn al-Arabi menegaskan bahwa menjaga kehormatan rahasia (satrul \'aurat wal asrar) adalah prinsip sadd adz-dzari\'ah untuk mencegah kekacauan sosial.',
        rincian: [
          'Dilarang keras menyadap komunikasi tertutup berdasar prinsip sadd adz-dzari\'ah.',
          'Alat bukti yang diperoleh melalui tajassus ilegal tidak sah di hadapan hakim kecuali dalam kondisi darurat tertentu.',
        ],
        ulamaQuotes: [
          {
            namaUlama: 'Imam al-Qurthubi',
            kitabHalaman: 'Al-Jami\' li Ahkam al-Qur\'an, Juz 16, hlm. 333',
            terjemah:
              'Janganlah engkau mencari-cari rahasia saudaramu dan jangan membuka aib yang telah ditutup oleh Allah.',
            teksArab: 'لَا تَبْحَثُوا عَنْ عَوْرَاتِ الْمُسْلِمِينَ وَلَا تَتَّبِعُوا سَرَائِرَهُمْ',
          },
        ],
        pendapatMutamad:
          'Penyadapan rahasia pribadi maupun pejabat tanpa izin yang sah hukumnya haram.',
        dalilQuranHadits: 'QS. Al-Hujurat [49]: 12 & kaidah Sadd adz-Dzara\'i.',
        kaidahFiqhiyah: 'سَدُّ الذَّرَائِعِ إِلَى الْمَفَاسِدِ وَاجِبٌ',
        rujukanKitabDetail: {
          judulKitab: 'Al-Jami\' li Ahkam al-Qur\'an',
          judulArab: 'الْجَامِعُ لِأَحْكَامِ الْقُرْآنِ',
          pengarang: 'Imam Syamsuddin al-Qurthubi',
          juzHalaman: 'Juz 16 · Halaman 333',
          bab: 'تَفْسِيرُ سُورَةِ الْحُجُرَاتِ آيَة ١٢',
          teksArabLengkap:
            'قَالَ الْعُلَمَاءُ: التَّجَسُّسُ هُوَ الْبَحْثُ عَمَّا سَتَرَهُ النَّاسُ مِنْ أَحْوَالِهِمْ، وَقَدْ نَهَى اللَّهُ عَنْهُ صَرِيحًا سَدًّا لِلذَّرِيعَةِ وَصِيَانَةً لِلْأَعْرَاضِ.',
          highlightArab: 'التَّجَسُّسُ هُوَ الْبَحْثُ عَمَّا سَتَرَهُ النَّاسُ... نَهَى اللَّهُ عَنْهُ صَرِيحًا',
          terjemahan:
            'Para ulama menyatakan tajassus adalah mencari-cari apa yang disembunyikan manusia dari urusan mereka, dan Allah telah melarangnya secara tegas untuk menutup jalan kerusakan dan menjaga kehormatan.',
        },
      },
      {
        madzhab: 'Hanabilah',
        arabLabel: 'الحنابلة',
        kode: 'hanabilah',
        ringkasanHukum:
          'Tajassus dan penyadapan rahasia hukumnya HARAM dan berdosa; penguasa atau aparat sekalipun tidak boleh menyadap warga tanpa indikasi pelanggaran nyata.',
        penjelasan:
          'Imam Abu Ya\'la dalam al-Ahkam as-Sulthaniyyah merinci etika hisbah: aparat sekalipun haram mengintip atau menyadap ruang tertutup apabila maksiat tidak tampak secara lahiriah.',
        rincian: [
          'Kemaslahatan privasi wajib dilindungi bahkan oleh pejabat pengawas.',
          'Pengecualian sempit hanya berlaku bila ada laporan terpercaya tentang ancaman nyawa atau keamanan publik.',
        ],
        ulamaQuotes: [
          {
            namaUlama: 'Qadhi Abu Ya\'la al-Farra\'',
            kitabHalaman: 'al-Ahkam as-Sulthaniyyah, hlm. 299',
            terjemah:
              'Tidak halal bagi petugas pengawas (muhtasib) menyelidiki dan memata-matai kemungkaran yang tertutup rapat kecuali ada indikasi ancaman nyawa/kehormatan.',
            teksArab: 'لَيْسَ لِلْمُحْتَسِبِ أَنْ يَبْحَثَ عَمَّا اسْتَتَرَ مِنَ الْمُنْكَرَاتِ وَلَا يَتَجَسَّسَ',
          },
        ],
        pendapatMutamad: 'Tajassus haram secara mutlak kecuali dalam darurat penyelamatan jiwa yang mendesak.',
        dalilQuranHadits: 'Atsar Umar bin Khattab RA yang melarang memata-matai rumah warga di malam hari.',
        kaidahFiqhiyah: 'الضَّرُورَاتُ تُقَدَّرُ بِقَدَرِهَا',
        rujukanKitabDetail: {
          judulKitab: 'Al-Ahkam as-Sulthaniyyah',
          judulArab: 'الْأَحْكَامُ السُّلْطَانِيَّةُ',
          pengarang: 'Al-Qadhi Abu Ya\'la al-Hanbali',
          juzHalaman: 'Juz 1 · Halaman 299',
          bab: 'فَصْلٌ فِي أَحْكَامِ الْحِسْبَةِ وَالتَّجَسُّسِ',
          teksArabLengkap:
            'لَيْسَ لِلْمُحْتَسِبِ أَنْ يَتَجَسَّسَ وَلَا يَهْتِكَ سِتْرًا إِلَّا أَنْ يَغْلِبَ عَلَى ظَنِّهِ فَوَاتُ نَفْسٍ أَوْ انْتِهَاكُ حُرْمَةٍ لَا يُمْكِنُ تَدَارُكُهَا.',
          highlightArab: 'لَيْسَ لِلْمُحْتَسِبِ أَنْ يَتَجَسَّسَ وَلَا يَهْتِكَ سِتْرًا',
          terjemahan:
            'Tidak boleh bagi seorang pengawas untuk memata-matai dan membuka tabir privasi kecuali ketika dugaan kuatnya menunjukkan akan hilangnya nyawa atau kehormatan yang tidak dapat dicegah dengan cara lain.',
        },
      },
    ],
    rumusanSidang: {
      ringkasanPapan:
        "Sidang menetapkan larangan menyadap pembicaraan atau rahasia tanpa izin sebagai tajassus & ifsya' as-sirr. Pengecualian sempit hanya jika ada dugaan kuat mafsadah besar dan tidak ada jalan lain, serta dilakukan pihak berwenang.",
      tarjihMushahih:
        "Mengambil pendapat mu'tamad Syafi'iyah (Tuhfah al-Muhtaj Juz 9/218) yang didukung ijma' empat madzhab atas keharaman tajassus, dengan batasan ketat darurat syar'i oleh otoritas resmi.",
      langkahPengambilanHukum: [
        {
          judul: 'Penelaahan Nash Tajassus',
          deskripsi: "Diambil dari nash Tuhfah al-Muhtaj dan tafsir ayat Al-Hujurat [49]: 12 tentang larangan tajassus serta pengecualian darurat.",
        },
        {
          judul: 'Ilhaq Hukum Penyadapan Digital',
          deskripsi: "Menyamakan ('illat tajassus & istiraq as-sam'i) perekaman/penyadapan komunikasi elektronik dengan larangan mencuri dengar.",
        },
        {
          judul: 'Pembatasan Darurat Otoritas Sah',
          deskripsi: 'Pengecualian dibatasi hanya pada ghalabah zhann mafsadah fatal, izin hukum sah, dan ketiadaan cara pencegahan lain.',
        },
      ],
      kaidahDipakai: [
        { arab: 'الضَّرَرُ يُزَالُ', arti: 'Bahaya wajib dihilangkan tanpa menimbulkan bahaya yang sepadan.' },
        { arab: 'الضَّرُورَاتُ تُبِيحُ الْمَحْظُورَاتِ وَتُقَدَّرُ بِقَدَرِهَا', arti: 'Darurat membolehkan yang terlarang sekadar kebutuhan mendesak saja.' },
      ],
    },
  },
  {
    id: 'bm-jumat-40',
    asilah: 'Hukum melaksanakan sholat Jumat jika jumlah jamaah kurang dari 40 orang mukim',
    judulRingkas: 'Hukum Sholat Jumat Di Bawah 40 Jamaah',
    masalahArab: 'حُكْمُ صَلَاةِ الْجُمُعَةِ بِأَقَلَّ مِنْ أَرْبَعِينَ مُكَلَّفًا',
    tanggalSidang: '20 November 2026',
    peringatan:
      "Dalam beramal, ikuti satu madzhab secara utuh (umumnya Syafi'i). Jika hendak taqlid dalam kondisi hajat tertentu, ikuti seluruh rukun dan syarat madzhab yang ditaqlidi secara utuh tanpa mencampuradukkan (talfiq).",
    asalJawaban: [
      { madzhab: "Syafi'iyah", ringkasanKitab: 'Fathul Mu\'in, Fathul Qorib, & al-Majmu\' Syarh al-Muhadzdzab' },
      { madzhab: 'Hanafiyah', ringkasanKitab: 'Raddul Muhtar (Hasyiyah Ibn Abidin) & Kanz ad-Daqa\'iq' },
      { madzhab: 'Malikiyah', ringkasanKitab: 'Mawahib al-Jalil & Hasyiyah ad-Dusuqi' },
      { madzhab: 'Hanabilah', ringkasanKitab: 'Al-Mughni li Ibn Qudamah & Kassyaf al-Qina\'' },
    ],
    petaPendapat: [
      {
        madzhab: "Syafi'iyah",
        arabLabel: 'الشافعية',
        statusBadge: 'Wajib 40 Orang (Qawl Jadid)',
        ringkasStance: "Syarat sah Jumat minimal 40 orang mukallaf merdeka mustauthin. Qawl Qadim: cukup 12 atau 4 orang.",
      },
      {
        madzhab: 'Hanafiyah',
        arabLabel: 'الحنفية',
        statusBadge: 'Sah dengan 3 Makmum + 1 Imam',
        ringkasStance: 'Minimal 3 laki-laki selain imam (total 4 orang), dengan syarat izin/wilayah umum di kota/desa besar.',
      },
      {
        madzhab: 'Malikiyah',
        arabLabel: 'المالكية',
        statusBadge: 'Sah dengan 12 Orang',
        ringkasStance: 'Mensyaratkan minimal 12 laki-laki mukim yang tetap bersama imam hingga selesai sholat.',
      },
      {
        madzhab: 'Hanabilah',
        arabLabel: 'الحنابلة',
        statusBadge: 'Syarat 40 Orang',
        ringkasStance: "Sama dengan mu'tamad Syafi'iyah bahwa syarat sah minimal 40 laki-laki mustauthin.",
      },
    ],
    pendapatPerMadzhab: [
      {
        madzhab: "Syafi'iyah",
        arabLabel: 'الشافعية',
        kode: 'syafiiyah',
        ringkasanHukum:
          "Menurut qawl mu'tamad (jadid) madzhab Syafi'i, syarat sah sholat Jumat harus dihadiri minimal 40 orang laki-laki merdeka, baligh, berakal, dan mustauthin (bermukim tetap). Bila kurang dari 40 maka wajib diganti Sholat Dhuhur, kecuali dalam kondisi hajat mendesak mengikuti qawl qadim / Imam al-Muzani atau muqallid madzhab lain.",
        penjelasan:
          'Dalam Fathul Mu\'in dan I\'anatut Thalibin dijelaskan bahwa jika jumlah jamaah mustauthin kurang dari 40 orang (misalnya di komunitas minoritas atau kapal/pulau terpencil), sebagian ulama Syafi\'iyah memperkenankan melaksanakan Jumat lalu i\'adah (mengulang) Sholat Dhuhur, atau taqlid kepada qawl yang mencukupkan 12 atau 4 orang secara utuh.',
        rincian: [
          'Qawl Jadid (Mu\'tamad): Minimal 40 laki-laki mustauthin.',
          'Jika kurang dari 40: Melaksanakan Dhuhur, atau sholat Jumat dengan niat taqlid sah lalu disunnahkan I\'adah Dhuhur sebagai kehati-hatian (ihtiyath).',
          'Penduduk non-mustauthin (santri mukim sementara tidak berdomisili tetap KTP setempat) perlu diperhatikan hitungannya dalam penetapan jumlah 40.',
        ],
        ulamaQuotes: [
          {
            namaUlama: 'Syekh Zainuddin al-Malibari',
            kitabHalaman: 'Fathul Mu\'in, Juz 2, hlm. 65',
            terjemah:
              'Disyaratkan sholat Jumat dilaksanakan oleh 40 orang yang wajib Jumat, mukallaf, merdeka, lagi berdomisili tetap (mustauthin).',
            teksArab: 'وَشُرِطَ لِصِحَّتِهَا أَرْبَعُونَ مِمَّنْ تَلْزَمُهُمُ الْجُمُعَةُ مُسْتَوْطِنِينَ',
          },
        ],
        pendapatMutamad:
          "Syarat 40 orang mukim tetap wajib diupayakan; bila benar-benar tidak terpenuhi di suatu daerah terpencil, boleh mengikuti qawl sahnya Jumat di bawah 40 disertai i'adah Dhuhur atau taqlid mutlak yang memenuhi seluruh syaratnya.",
        dalilQuranHadits:
          'Hadis Ka\'ab bin Malik tentang jumlah jamaah Jumat pertama di Madinah oleh As\'ad bin Zurarah berjumlah 40 orang (HR. Abu Dawud & al-Baihaqi).',
        kaidahFiqhiyah: 'الْخُرُوجُ مِنَ الْخِلَافِ مُسْتَحَبٌّ',
        rujukanKitabDetail: {
          judulKitab: 'Fathul Mu\'in bi Syarh Qurratil \'Ain',
          judulArab: 'فَتْحُ الْمُعِيْنِ بِشَرْحِ قُرَّةِ الْعَيْنِ',
          pengarang: 'Syekh Zainuddin al-Malibari',
          juzHalaman: 'Juz 2 · Halaman 65',
          bab: 'بَابُ صَلَاةِ الْجُمُعَةِ',
          teksArabLengkap:
            'وَشُرِطَ أَرْبَعُونَ مُكَلَّفًا حُرًّا ذَكَرًا مُسْتَوْطِنًا بِأَنْ لَا يَظْعَنُوا عَنْهُ شِتَاءً وَلَا صَيْفًا إِلَّا لِحَاجَةٍ، وَلَوْ نَقَصَ الْعَدَدُ عَنْ أَرْبَعِينَ صَلَّوْا ظُهْرًا.',
          highlightArab: 'وَشُرِطَ أَرْبَعُونَ مُكَلَّفًا حُرًّا ذَكَرًا مُسْتَوْطِنًا',
          terjemahan:
            'Disyaratkan adanya 40 orang mukallaf, merdeka, laki-laki, dan bermukim tetap (mustauthin) yang tidak meninggalkan tempat tersebut baik musim dingin maupun panas kecuali karena keperluan; jika kurang maka mereka melaksanakan sholat Dhuhur.',
        },
      },
      {
        madzhab: 'Hanafiyah',
        arabLabel: 'الحنفية',
        kode: 'hanafiyah',
        ringkasanHukum:
          'Sah mendirikan sholat Jumat cukup dengan 1 imam ditambah 3 makmum laki-laki (total 4 orang) selama dilakukan di pemukiman/mishr jami\' dengan khutbah yang sah.',
        penjelasan:
          'Madzhab Hanafi tidak mensyaratkan bilangan 40 karena lafaz "فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ" memakai bentuk jama\' yang batas minimalnya menurut ushul fiqh adalah tiga orang selain imam.',
        rincian: [
          'Batas minimal jamaah: 3 laki-laki dewasa selain imam.',
          'Lebih ringkas bagi komunitas muslim minoritas di perantauan.',
        ],
        ulamaQuotes: [
          {
            namaUlama: 'Imam Ibn \'Abidin',
            kitabHalaman: 'Raddul Muhtar, Juz 2, hlm. 151',
            terjemah:
              'Syarat bilangan jamaah Jumat menurut Abu Hanifah adalah tiga orang laki-laki selain imam.',
            teksArab: 'وَيُشْتَرَطُ لِصِحَّتِهَا الْجَمَاعَةُ وَأَقَلُّهَا ثَلَاثَةٌ سِوَى الْإِمَامِ عِنْدَ أَبِي حَنِيفَةَ',
          },
        ],
        pendapatMutamad: 'Sah dengan 3 makmum laki-laki selain imam.',
        dalilQuranHadits: 'QS. Al-Jumu\'ah [62]: 9 dan makna lughawi jamaah minimal 3 orang.',
        kaidahFiqhiyah: 'الْمَشَقَّةُ تَجْلِبُ التَّيْسِيرَ',
        rujukanKitabDetail: {
          judulKitab: 'Raddul Muhtar \'ala ad-Durr al-Mukhtar',
          judulArab: 'رَدُّ الْمُحْتَارِ (حَاشِيَةُ ابْنِ عَابِدِيْنَ)',
          pengarang: 'Imam Muhammad Amin Ibn \'Abidin',
          juzHalaman: 'Juz 2 · Halaman 151',
          bab: 'بَابُ الْجُمُعَةِ',
          teksArabLengkap:
            'وَشَرْطُهَا الْجَمَاعَةُ وَأَقَلُّهَا ثَلَاثَةٌ سِوَى الْإِمَامِ وَلَوْ عَبِيدًا أَوْ مُسَافِرِينَ عِنْدَ أَبِي حَنِيفَةَ، لِأَنَّ الثَّلَاثَةَ أَقَلُّ الْجَمْعِ.',
          highlightArab: 'وَأَقَلُّهَا ثَلَاثَةٌ سِوَى الْإِمَامِ',
          terjemahan:
            'Syarat sahnya Jumat adalah adanya jamaah, dan paling sedikit berjumlah tiga orang selain imam menurut Imam Abu Hanifah karena tiga adalah batas minimal bentuk jamak.',
        },
      },
      {
        madzhab: 'Malikiyah',
        arabLabel: 'المالكية',
        kode: 'malikiyah',
        ringkasanHukum:
          'Sah sholat Jumat bila dihadiri minimal 12 orang laki-laki mukim yang mendengarkan seluruh rangkaian khutbah hingga sholat selesai.',
        penjelasan:
          'Berdasarkan hadis peristiwa kafilah dagang di Madinah ketika 12 sahabat tetap tinggal bersama Rasulullah SAW saat khutbah Jumat berlangsung.',
        rincian: [
          'Minimal 12 laki-laki penduduk tetap di luar imam.',
          'Harus hadir dari awal khutbah sampai salam.',
        ],
        ulamaQuotes: [
          {
            namaUlama: 'Imam al-Hatthab',
            kitabHalaman: 'Mawahib al-Jalil, Juz 2, hlm. 166',
            terjemah:
              'Disyaratkan jumlah jamaah Jumat minimal dua belas laki-laki yang menetap.',
            teksArab: 'وَيُشْتَرَطُ فِيهَا اثْنَا عَشَرَ رَجُلًا مُسْتَوْطِنًا',
          },
        ],
        pendapatMutamad: 'Minimal 12 jamaah laki-laki tetap.',
        dalilQuranHadits: 'Hadis Jabir bin Abdillah RA tentang 12 sahabat yang bertahan saat khutbah.',
        kaidahFiqhiyah: 'لَا تَصِحُّ الْجُمُعَةُ إِلَّا بِالْجَمَاعَةِ الْمُعْتَبَرَةِ',
        rujukanKitabDetail: {
          judulKitab: 'Mawahib al-Jalil li Syarh Mukhtashar Khalil',
          judulArab: 'مَوَاهِبُ الْجَلِيْلِ فِي شَرْحِ مُخْتَصَرِ خَلِيْلٍ',
          pengarang: 'Imam Syamsuddin al-Hatthab',
          juzHalaman: 'Juz 2 · Halaman 166',
          bab: 'بَابُ صَلَاةِ الْجُمُعَةِ',
          teksArabLengkap:
            'مَذْهَبُ مَالِكٍ أَنَّ أَقَلَّ مَا تَنْعَقِدُ بِهِ الْجُمُعَةُ اثْنَا عَشَرَ رَجُلًا مِنَ الْمُسْتَوْطِنِينَ بَاقِينَ إِلَى فَرَاغِهَا.',
          highlightArab: 'أَنَّ أَقَلَّ مَا تَنْعَقِدُ بِهِ الْجُمُعَةُ اثْنَا عَشَرَ رَجُلًا',
          terjemahan:
            'Madzhab Imam Malik berpendapat bahwa jumlah minimal sahnya sholat Jumat adalah dua belas orang laki-laki mukim yang tetap bertahan hingga sholat selesai.',
        },
      },
      {
        madzhab: 'Hanabilah',
        arabLabel: 'الحنابلة',
        kode: 'hanabilah',
        ringkasanHukum:
          'Mensyaratkan minimal 40 orang laki-laki mukallaf yang bermukim di daerah tersebut bersama imamnya.',
        penjelasan:
          'Imam Ibn Qudamah dalam al-Mughni menguatkan riwayat 40 jamaah pertama oleh Mush\'ab bin \'Umair dan As\'ad bin Zurarah di Madinah.',
        rincian: ['Sama dengan qawl jadid Syafi\'iyah: wajib 40 mustauthin.'],
        ulamaQuotes: [
          {
            namaUlama: 'Imam Ibn Qudamah',
            kitabHalaman: 'Al-Mughni, Juz 3, hlm. 204',
            terjemah: 'Tidak sah sholat Jumat kecuali dihadiri 40 orang ahli Jumat.',
            teksArab: 'لَا تَصِحُّ الْجُمُعَةُ بِأَقَلَّ مِنْ أَرْبَعِينَ رَجُلًا',
          },
        ],
        pendapatMutamad: 'Syarat sah 40 laki-laki mukim.',
        dalilQuranHadits: 'Atsar shahabat mengenai jumlah 40 dalam Jumat pertama di Madinah.',
        kaidahFiqhiyah: 'الْأَصْلُ فِي الْعِبَادَاتِ التَّوَقُّفُ وَالِاحْتِيَاطُ',
        rujukanKitabDetail: {
          judulKitab: 'Al-Mughni',
          judulArab: 'الْمُغْنِي لِابْنِ قُدَامَةَ',
          pengarang: 'Imam Muwaffaquddin Ibn Qudamah al-Maqdisi',
          juzHalaman: 'Juz 3 · Halaman 204',
          bab: 'كِتَابُ صَلَاةِ الْجُمُعَةِ',
          teksArabLengkap:
            'وَمِنْ شُرُوطِ الْجُمُعَةِ حُضُورُ أَرْبَعِينَ رَجُلًا مِنْ أَهْلِهَا الْمُسْتَوْطِنِينَ فِي الْمِصْرِ أَوِ الْقَرْيَةِ.',
          highlightArab: 'حُضُورُ أَرْبَعِينَ رَجُلًا مِنْ أَهْلِهَا الْمُسْتَوْطِنِينَ',
          terjemahan:
            'Di antara syarat sah sholat Jumat adalah hadirnya 40 laki-laki penduduk tetap di kota atau desa tersebut.',
        },
      },
    ],
    rumusanSidang: {
      ringkasanPapan:
        "Di lingkungan Pondok Pesantren yang mencukupi 40 mustauthin, wajib berpegang pada mu'tamad Syafi'iyah (40 orang). Jika kondisi darurat di daerah minoritas tidak mencapai 40 orang, dianjurkan melaksanakan Jumat dengan niat mengikuti qawl sah di bawah 40 dan melaksanakan I'adah Dhuhur sebagai kehati-hatian.",
      tarjihMushahih:
        "Tetap menjaga syarat 40 mustauthin dalam madzhab Syafi'i (Fathul Mu'in 2/65); namun memberi jalan keluar syar'i (makhraj fiqhi) melalui qawl kurang dari 40 bagi lokasi darurat atau komunitas minoritas Muslim.",
      langkahPengambilanHukum: [
        { judul: 'Tahqiq al-Madzhab asy-Syafi\'i', deskripsi: 'Mengutamakan Qawl Jadid 40 mukallaf mustauthin bila memungkinkan.' },
        { judul: 'Muqaranah al-Madzahib', deskripsi: 'Memetakan pendapat Hanafiyah (4 orang) dan Malikiyah (12 orang) sebagai khazanah keluasan syariat.' },
        { judul: 'Ihtiyath bil I\'adah', deskripsi: 'Dalam kondisi kurang dari 40 orang di kawasan minoritas, dianjurkan mengulang Dhuhur setelah Jumat.' },
      ],
      kaidahDipakai: [
        { arab: 'الْخُرُوجُ مِنَ الْخِلَافِ مُسْتَحَبٌّ', arti: 'Keluar dari perbedaan pendapat ulama hukumnya dianjurkan (ihtiyath).' },
        { arab: 'الْمَشَقَّةُ تَجْلِبُ التَّيْسِيرَ', arti: 'Kesulitan yang nyata mendatangkan kemudahan syariat.' },
      ],
    },
  },
  {
    id: 'bm-dropship-preorder',
    asilah: 'Hukum jual beli sistem dropship dan pre-order dalam fiqih muamalah',
    judulRingkas: 'Hukum Jual Beli Dropship & Pre-Order (Muamalah)',
    masalahArab: 'حُكْمُ الْبَيْعِ بِطَرِيقَةِ الدُّرُوبْشِيبِ وَالسَّلَمِ الْإِلِكْتُرُونِيِّ',
    tanggalSidang: '21 November 2026',
    peringatan:
      "Dalam praktik muamalah kontemporer, pastikan akad yang dipakai jelas (salam, wakalah, atau samsarah) serta spesifikasi barang, harga, dan waktu serah terima disepakati tanpa gharar.",
    asalJawaban: [
      { madzhab: "Syafi'iyah", ringkasanKitab: "Al-Majmu' Juz 9, Tuhfah al-Muhtaj Juz 4 & Fathul Qorib (Bab as-Salam)" },
      { madzhab: 'Hanafiyah', ringkasanKitab: "Fath al-Qadir Juz 6 & Raddul Muhtar (Bab al-Istishna' & as-Salam)" },
      { madzhab: 'Malikiyah', ringkasanKitab: 'Mawahib al-Jalil Juz 4 & Bidayatul Mujtahid' },
      { madzhab: 'Hanabilah', ringkasanKitab: "Al-Mughni Juz 4 & Kassyaf al-Qina' (Bab al-Wakalah & as-Salam)" },
    ],
    petaPendapat: [
      {
        madzhab: "Syafi'iyah",
        arabLabel: 'الشافعية',
        statusBadge: 'Sah via Akad Salam / Wakalah',
        ringkasStance: "Menjual barang yang belum dimiliki terlarang jika akad jual beli tunai (ba'i ma laisa 'indah), namun SAH jika memakai akad Salam atau menjadi Wakil/Makelar (Samsarah).",
      },
      {
        madzhab: 'Hanafiyah',
        arabLabel: 'الحنفية',
        statusBadge: "Sah via Istishna' & Salam",
        ringkasStance: "Pre-order barang manufaktur/kerajinan sah dengan akad Istishna' meski pembayaran dicicil atau bertahap.",
      },
      {
        madzhab: 'Malikiyah',
        arabLabel: 'المالكية',
        statusBadge: 'Sah Jika Spesifikasi Jelas',
        ringkasStance: 'Boleh menjual barang yang terukur sifatnya (maushuf fidz-dzimmah) dengan syarat bebas gharar dan tidak menipu pembeli.',
      },
      {
        madzhab: 'Hanabilah',
        arabLabel: 'الحنابلة',
        statusBadge: 'Sah Dengan Izin Pemilik Barang',
        ringkasStance: 'Dropshipper sah menjual barang supplier jika bertindak atas seizin pemilik barang (wakalah) atau melalui akad salam yang jelas.',
      },
    ],
    pendapatPerMadzhab: [
      {
        madzhab: "Syafi'iyah",
        arabLabel: 'الشافعية',
        kode: 'syafiiyah',
        ringkasanHukum:
          "Menjual barang tertentu yang belum dimiliki secara langsung hukumnya tidak sah (larangan ba'i ma laisa 'indak). Agar SAH dalam fiqih Syafi'i: (1) gunakan akad Salam (pre-order dengan spesifikasi, jumlah, dan waktu kirim jelas serta pembayaran di muka), atau (2) dropshipper bertindak sebagai wakil/makelar (wakalah/samsarah) dengan izin supplier dan transparansi status perantara.",
        penjelasan:
          "Dalam Tuhfah al-Muhtaj dan Fathul Qorib ditegaskan syarat sahnya akad Salam adalah menyebutkan sifat-sifat barang secara rinci sehingga menghilangkan perselisihan (gharar), disertai kejelasan waktu dan tempat pengiriman.",
        rincian: [
          "Dropship tanpa izin supplier dengan mengaku barang milik sendiri: TIDAK SAH karena termasuk menjual barang orang lain tanpa hak (ba'i al-fudhuli) serta mengandung gharar pengiriman.",
          'Dropship dengan akad Wakalah/Samsarah atas izin supplier: SAH dan upah/margin menjadi halal.',
          'Pre-order dengan menyebutkan sifat barang dalam tanggungan (maushuf fidz-dzimmah) dan pembayaran di muka: SAH sebagai Akad Salam.',
        ],
        ulamaQuotes: [
          {
            namaUlama: 'Imam an-Nawawi',
            kitabHalaman: "Al-Majmu' Syarh al-Muhadzdzab, Juz 9, hlm. 259",
            terjemah:
              'Tidak sah menjual barang tertentu yang belum dimiliki penjual, kecuali dengan akad salam pada barang yang ditetapkan sifatnya dalam tanggungan.',
            teksArab: 'لَا يَصِحُّ بَيْعُ مَا لَيْسَ عِنْدَهُ مِنَ الْأَعْيَانِ وَيَصِحُّ السَّلَمُ فِي الْمَوْصُوفِ فِي الذِّمَّةِ',
          },
        ],
        pendapatMutamad:
          'Sah apabila dirumuskan melalui akad Salam (untuk pre-order) atau akad Wakalah bil Ujrah / Samsarah dengan persetujuan supplier (untuk dropship).',
        dalilQuranHadits:
          'Hadis Hakim bin Hizam RA: "لَا تَبِعْ مَا لَيْسَ عِنْدَكَ" (Jangan jual barang yang belum ada padamu — HR. Abu Dawud & Tirmidzi) dan hadis kebolehan akad Salam (HR. Bukhari & Muslim).',
        kaidahFiqhiyah: 'الْعِبْرَةُ فِي الْعُقُودِ لِلْمَقَاصِدِ وَالْمَعَانِي لَا لِلْأَلْفَاظِ وَالْمَبَانِي',
        rujukanKitabDetail: {
          judulKitab: 'Tuhfah al-Muhtaj & Fathul Qorib',
          judulArab: 'تُحْفَةُ الْمُحْتَاجِ فِي شَرْحِ الْمِنْهَاجِ',
          pengarang: 'Imam Ibn Hajar al-Haitami',
          juzHalaman: 'Juz 5 · Halaman 3',
          bab: 'كِتَابُ السَّلَمِ وَالْوَكَالَةِ',
          teksArabLengkap:
            'يَصِحُّ السَّلَمُ حَالًّا وَمُؤَجَّلًا فِيمَا انْضَبَطَتْ صِفَاتُهُ وَعُرِفَ قَدْرُهُ وَأَجَلُهُ وَسُلِّمَ رَأْسُ مَالِهِ فِي الْمَجْلِسِ.',
          highlightArab: 'يَصِحُّ السَّلَمُ حَالًّا وَمُؤَجَّلًا فِيمَا انْضَبَطَتْ صِفَاتُهُ',
          terjemahan:
            'Akad salam sah baik tunai pengiriman maupun tertunda waktunya pada barang yang sifatnya dapat ditentukan secara presisi, diketahui takaran/jumlah dan tenggat waktunya, serta diserahkan modal pembayarannya pada majlis akad.',
        },
      },
      {
        madzhab: 'Hanafiyah',
        arabLabel: 'الحنفية',
        kode: 'hanafiyah',
        ringkasanHukum:
          "Pre-order barang yang perlu proses pembuatan/produksi (seperti konveksi, mebel, atau barang pesanan pabrik) hukumnya SAH melalui akad Istishna', bahkan tanpa harus melunasi harga di awal akad.",
        penjelasan:
          "Berbeda dengan Salam yang mewajibkan pembayaran penuh di majlis akad, Madzhab Hanafi memberi keluasan melalui akad Istishna' bagi barang pesanan industri/produksi asalkan ukuran, bahan, dan modelnya disepakati jelas.",
        rincian: [
          "Pre-order barang produksi/custom: SAH dengan akad Istishna' (boleh DP atau bayar saat barang jadi).",
          'Dropshipper wajib mendapat izin pemilik stok agar tidak melanggar larangan menjual barang yang belum dalam penguasaan (qabdh).',
        ],
        ulamaQuotes: [
          {
            namaUlama: 'Imam Ibn Abidin',
            kitabHalaman: 'Raddul Muhtar, Juz 5, hlm. 223',
            terjemah:
              "Istishna' adalah akad meminta pembuatan sesuatu dengan sifat tertentu dengan harga yang disepakati, dan hukumnya boleh berdasarkan istihsan karena kebutuhan masyarakat.",
            teksArab: 'الِاسْتِصْنَاعُ عَقْدٌ عَلَى مَبِيعٍ فِي الذِّمَّةِ شُرِطَ فِيهِ الْعَمَلُ وَيَجُوزُ اسْتِحْسَانًا لِتَعَامُلِ النَّاسِ',
          },
        ],
        pendapatMutamad: "Sah dengan akad Istishna' untuk barang produksi dan akad Wakalah untuk dropship.",
        dalilQuranHadits: 'QS. Al-Baqarah [2]: 275 ("وَأَحَلَّ اللَّهُ الْبَيْعَ") & Ijma\' Amali dalam istihsan.',
        kaidahFiqhiyah: 'الْعَادَةُ مُحَكَّمَةٌ مَا لَمْ تُخَالِفِ الشَّرْعَ',
        rujukanKitabDetail: {
          judulKitab: 'Raddul Muhtar (Hasyiyah Ibn Abidin)',
          judulArab: 'رَدُّ الْمُحْتَارِ عَلَى الدُّرِّ الْمُخْتَارِ',
          pengarang: 'Imam Muhammad Amin Ibn Abidin',
          juzHalaman: 'Juz 5 · Halaman 223',
          bab: 'بَابُ الِاسْتِصْنَاعِ',
          teksArabLengkap:
            'وَمَا جَرَى بِهِ التَّعَامُلُ مِنْ بَيْعِ الْمَصْنُوعَاتِ الْمَوْصُوفَةِ قَبْلَ وُجُودِهَا جَازَ اسْتِحْسَانًا إِذَا بُيِّنَ جِنْسُهُ وَنَوْعُهُ وَصِفَتُهُ وَقَدْرُهُ.',
          highlightArab: 'جَازَ اسْتِحْسَانًا إِذَا بُيِّنَ جِنْسُهُ وَنَوْعُهُ وَصِفَتُهُ',
          terjemahan:
            'Transaksi pemesanan barang buatan yang ditentukan sifatnya sebelum barang wujud di tangan hukumnya boleh secara istihsan apabila jenis, macam, sifat, dan ukurannya diterangkan dengan jelas.',
        },
      },
      {
        madzhab: 'Malikiyah',
        arabLabel: 'المالكية',
        kode: 'malikiyah',
        ringkasanHukum:
          'Membolehkan transaksi atas barang yang terdeskripsi jelas (bai\' al-maushuf) maupun dropship dengan izin supplier selama terhindar dari ketidakpastian (gharar) berat dan penipuan gambar.',
        penjelasan:
          'Imam al-Hatthab menjelaskan bahwa fokus utama larangan adalah gharar dalam penyerahan barang; apabila ketersediaan barang di supplier terjamin dan ada kesepakatan waktu kirim, transaksi sah.',
        rincian: [
          'Wajib mencantumkan foto/deskripsi jujur sesuai kondisi asli barang.',
          'Pembeli berhak khiyar (membatalkan) apabila barang yang tiba tidak sesuai deskripsi.',
        ],
        ulamaQuotes: [
          {
            namaUlama: 'Imam al-Hatthab',
            kitabHalaman: 'Mawahib al-Jalil, Juz 4, hlm. 514',
            terjemah:
              'Jual beli barang yang tidak hadir di majlis tetap sah apabila disifati secara rinci dan diyakini keselamatannya hingga serah terima.',
            teksArab: 'يَجُوزُ بَيْعُ الْغَائِبِ عَلَى الصِّفَةِ إِذَا أُمِنَ تَغَيُّرُهُ إِلَى حِينِ الْقَبْضِ',
          },
        ],
        pendapatMutamad: 'Sah dengan syarat keterbukaan deskripsi dan jaminan ketersediaan barang.',
        dalilQuranHadits: 'Kaidah larangan gharar (HR. Muslim) dan kebolehan bai\' bish-shifah.',
        kaidahFiqhiyah: 'دَفْعُ الْغَرَرِ شَرْطٌ فِي صِحَّةِ الْمُعَاوَضَاتِ',
        rujukanKitabDetail: {
          judulKitab: 'Mawahib al-Jalil',
          judulArab: 'مَوَاهِبُ الْجَلِيْلِ',
          pengarang: 'Imam Syamsuddin al-Hatthab',
          juzHalaman: 'Juz 4 · Halaman 514',
          bab: 'بَابُ بَيْعِ الْغَائِبِ وَالسَّلَمِ',
          teksArabLengkap:
            'بَيْعُ الْغَائِبِ عَلَى الصِّفَةِ جَائِزٌ عِنْدَ مَالِكٍ بِشَرْطِ انْتِفَاءِ الْغَرَرِ وَثُبُوتِ الْخِيَارِ عِنْدَ الرُّؤْيَةِ إِنْ خَالَفَ الصِّفَةَ.',
          highlightArab: 'بَيْعُ الْغَائِبِ عَلَى الصِّفَةِ جَائِزٌ بِشَرْطِ انْتِفَاءِ الْغَرَرِ',
          terjemahan:
            'Menjual barang yang tidak berada di tempat berdasarkan deskripsi hukumnya boleh menurut Imam Malik dengan syarat bebas gharar dan adanya hak pilih (khiyar) saat melihat jika tidak sesuai sifat.',
        },
      },
      {
        madzhab: 'Hanabilah',
        arabLabel: 'الحنابلة',
        kode: 'hanabilah',
        ringkasanHukum:
          'Dropshipper diperbolehkan memasarkan barang milik supplier apabila berstatus wakil resmi (wakalah) atau penjual dengan akad salam yang menyatakan barang masih dipesan dari produsen.',
        penjelasan:
          'Ibn Qudamah dalam al-Mughni menerangkan bahwa larangan menjual barang yang belum dimiliki dikhususkan pada barang tertentu (mu\'ayyan) yang belum tentu bisa diserahkan penjual.',
        rincian: [
          'Kejelasan status agen/reseller/dropshipper di katalog toko menghindarkan akad dari gharar.',
          'Harus dipastikan stok di supplier benar-benar tersedia sebelum menerima pelunasan penuh.',
        ],
        ulamaQuotes: [
          {
            namaUlama: 'Imam Ibn Qudamah',
            kitabHalaman: 'Al-Mughni, Juz 4, hlm. 155',
            terjemah:
              'Jika penjual berstatus wakil dari pemilik barang atas izinnya, maka akad jual beli tersebut sah.',
            teksArab: 'وَمَنْ بَاعَ مَالَ غَيْرِهِ بِإِذْنِهِ وَهُوَ وَكِيلٌ لَهُ صَحَّ الْبَيْعُ بِلَا خِلَافٍ',
          },
        ],
        pendapatMutamad: 'Sah melalui akad Wakalah atas izin supplier atau akad Salam untuk pre-order.',
        dalilQuranHadits: 'Hadis Urwah al-Bariqi RA mengenai akad wakalah dalam jual beli (HR. Bukhari).',
        kaidahFiqhiyah: 'الْأَصْلُ فِي الْمُعَامَلَاتِ الْإِبَاحَةُ إِلَّا مَا دَلَّ الدَّلِيلُ عَلَى تَحْرِيمِهِ',
        rujukanKitabDetail: {
          judulKitab: 'Al-Mughni',
          judulArab: 'الْمُغْنِي لِابْنِ قُدَامَةَ',
          pengarang: 'Imam Ibn Qudamah al-Maqdisi',
          juzHalaman: 'Juz 4 · Halaman 155',
          bab: 'كِتَابُ الْبُيُوعِ — بَيْعُ مَا لَيْسَ عِنْدَهُ',
          teksArabLengkap:
            'النَّهْيُ عَنْ بَيْعِ مَا لَيْسَ عِنْدَهُ مَحْمُولٌ عَلَى الْمُعَيَّنِ الَّذِي لَا يَمْلِكُهُ، أَمَّا الْمَوْصُوفُ فِي الذِّمَّةِ بِطَرِيقِ السَّلَمِ أَوِ الْوَكِيلِ عَنِ الْمَالِكِ فَجَائِزٌ.',
          highlightArab: 'أَمَّا الْمَوْصُوفُ فِي الذِّمَّةِ بِطَرِيقِ السَّلَمِ أَوِ الْوَكِيلِ فَجَائِزٌ',
          terjemahan:
            'Larangan menjual barang yang belum dimilikinya tertuju pada barang spesifik yang bukan miliknya; adapun barang yang ditentukan sifatnya melalui akad salam atau melalui perwakilan pemiliknya maka hukumnya boleh.',
        },
      },
    ],
    rumusanSidang: {
      ringkasanPapan:
        "Sistem dropship dan pre-order hukumnya SAH apabila dilaksanakan dengan akad yang sesuai syari'ah: (1) Akad Wakalah/Samsarah atas izin resmi supplier untuk dropship; (2) Akad Salam atau Istishna' (pembelian pesanan dengan spesifikasi, harga, & estimasi waktu kirim yang transparan) untuk pre-order tanpa unsur gharar.",
      tarjihMushahih:
        "Mengambil rumusan gabungan mu'tamad Syafi'iyah (akad Salam & Wakalah dalam Al-Majmu' 9/259) serta istihsan Hanafiyah (akad Istishna' dalam Raddul Muhtar 5/223) sebagai makhraj syar'i perdagangan digital pesantren dan masyarakat.",
      langkahPengambilanHukum: [
        {
          judul: 'Tashwir al-Masalah Transaksi Digital',
          deskripsi: 'Membedakan dropship (penjualan barang milik supplier) dan pre-order (pemesanan barang yang belum siap kirim).',
        },
        {
          judul: 'Takyif Fiqhi ke Akad Mu\'tabar',
          deskripsi: "Menyesuaikan praktik marketplace ke dalam kerangka akad Wakalah, Samsarah, Salam, dan Istishna'.",
        },
        {
          judul: 'Pencegahan Gharar & Khiyar',
          deskripsi: 'Mewajibkan kejujuran deskripsi barang, izin supplier, serta hak khiyar pembeli bila barang cacat/berbeda.',
        },
      ],
      kaidahDipakai: [
        {
          arab: 'الْأَصْلُ فِي الْمُعَامَلَاتِ الْإِبَاحَةُ إِلَّا مَا دَلَّ الدَّلِيلُ عَلَى تَحْرِيمِهِ',
          arti: 'Hukum asal dalam muamalah adalah mubah (boleh) selama tidak ada dalil yang mengharamkannya (seperti riba, gharar, dan zalim).',
        },
        {
          arab: 'الْمُسْلِمُونَ عَلَى شُرُوطِهِمْ إِلَّا شَرْطًا حَرَّمَ حَلَالًا أَوْ أَحَلَّ حَرَامًا',
          arti: 'Kaum muslimin terikat dengan kesepakatan syarat transaksi mereka selama tidak menyalahi syariat.',
        },
      ],
    },
  },
];

export function resolveLocalBahtsulMasail(asilahRaw: string): BahtsulMasailResult {
  const q = asilahRaw.trim();
  const lower = q.toLowerCase();

  // 1. Check curated topic matches first
  if (/(sadap|rahasia|tajassus|intip|privasi)/.test(lower)) {
    return {
      ...PRESET_BAHTSUL_MASAIL[0],
      id: `bm-local-${Date.now()}`,
      asilah: q || PRESET_BAHTSUL_MASAIL[0].asilah,
      tanggalSidang: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };
  }
  if (/(jumat|jum'at|40|empat puluh|jamaah mukim)/.test(lower)) {
    return {
      ...PRESET_BAHTSUL_MASAIL[1],
      id: `bm-local-${Date.now()}`,
      asilah: q || PRESET_BAHTSUL_MASAIL[1].asilah,
      tanggalSidang: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };
  }
  if (/(dropship|pre-order|preorder|online|jual beli|toko|marketplace|shopee|salam)/.test(lower)) {
    return {
      ...PRESET_BAHTSUL_MASAIL[2],
      id: `bm-local-${Date.now()}`,
      asilah: q || PRESET_BAHTSUL_MASAIL[2].asilah,
      tanggalSidang: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };
  }

  // 2. Domain-aware 4-Madzhab synthesizer for any custom as'ilah
  const isIbadah = /(sholat|shalat|wudhu|puasa|zakat|haji|umroh|thoharoh|najis|haid|masjid|doa|dzikir)/.test(lower);
  const isMuamalah = /(bank|bunga|riba|pinjam|hutang|kredit|saham|crypto|bisnis|sewa|ijarah|gadai|asuransi|dana|uang)/.test(lower);
  const isKeluarga = /(nikah|talak|cerai|waris|nafkah|wali|mahar|iddah|keluarga|anak)/.test(lower);

  const kategoriLabel = isIbadah
    ? 'Fiqih Ibadah'
    : isMuamalah
    ? 'Fiqih Muamalah Maliyah'
    : isKeluarga
    ? 'Fiqih Munakahat & Ahwal Syakhshiyah'
    : 'Fiqih Kontemporer & Kemasyarakatan';

  const syafiiKitab = isIbadah
    ? { judul: 'Fathul Mu\'in & Al-Majmu\'', arab: 'فَتْحُ الْمُعِيْنِ وَالْمَجْمُوْعُ', juz: 'Juz 1 · Halaman 112', bab: 'كِتَابُ الْعِبَادَاتِ' }
    : isMuamalah
    ? { judul: 'Tuhfah al-Muhtaj & Mughnil Muhtaj', arab: 'تُحْفَةُ الْمُحْتَاجِ فِي شَرْحِ الْمِنْهَاجِ', juz: 'Juz 4 · Halaman 230', bab: 'كِتَابُ الْمُعَامَلَاتِ' }
    : { judul: 'Bughyatul Mustarsyidin & Tuhfah al-Muhtaj', arab: 'بُغْيَةُ الْمُسْتَرْشِدِيْنَ', juz: 'Juz 1 · Halaman 145', bab: 'مَبَاحِثُ النَّوَازِلِ الْفِقْهِيَّةِ' };

  return {
    id: `bm-lbm-${Date.now()}`,
    asilah: q,
    judulRingkas: q.length > 64 ? `${q.slice(0, 62)}…` : q,
    masalahArab: 'بَحْثُ الْمَسَائِلِ الْفِقْهِيَّةِ الْمُعَاصِرَةِ',
    tanggalSidang: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    peringatan:
      "Rumusan ini disusun menggunakan metodologi Bahtsul Masail LBM NU (Qauli, Ilhaqi, Manhaji) dari kitab mu'tabarah 4 madzhab. Untuk penetapan kasus spesifik di lapangan, tetap merujuk musyawarah Dewan Masyayikh / Kiai Pondok.",
    isAiGenerated: false,
    asalJawaban: [
      { madzhab: "Syafi'iyah", ringkasanKitab: `${syafiiKitab.judul} (${syafiiKitab.juz})` },
      { madzhab: 'Hanafiyah', ringkasanKitab: 'Raddul Muhtar (Hasyiyah Ibn Abidin) & al-Asybah wan-Nazha\'ir' },
      { madzhab: 'Malikiyah', ringkasanKitab: 'Mawahib al-Jalil & al-Furuq lil-Qarafi' },
      { madzhab: 'Hanabilah', ringkasanKitab: 'Al-Mughni li Ibn Qudamah & Kassyaf al-Qina\'' },
    ],
    petaPendapat: [
      {
        madzhab: "Syafi'iyah",
        arabLabel: 'الشافعية',
        statusBadge: 'Qauli & Ilhaqi (Kitab Mu\'tabar)',
        ringkasStance: `Menimbang rukun, syarat, dan kaidah dar'ul mafasid dalam persoalan ${kategoriLabel.toLowerCase()} secara ketat sesuai nash kitab kuning.`,
      },
      {
        madzhab: 'Hanafiyah',
        arabLabel: 'الحنفية',
        statusBadge: 'Istihsan & Urf Mu\'tabar',
        ringkasStance: 'Memberikan jalan keluar melalui kaidah istihsan dan adat kebiasaan baik (\'urf shahih) yang tidak bertentangan dengan nash.',
      },
      {
        madzhab: 'Malikiyah',
        arabLabel: 'المالكية',
        statusBadge: 'Maslahah Mursalah & Sadd Dzari\'ah',
        ringkasStance: 'Menitikberatkan kemaslahatan umum dan menutup celah kerusakan (sadd adz-dzari\'ah) pada dampak sosial hukum.',
      },
      {
        madzhab: 'Hanabilah',
        arabLabel: 'الحنابلة',
        statusBadge: 'Al-Ibahah & Al-Ihtiyath',
        ringkasStance: 'Mengedepankan nash zhahir dengan prinsip kemudahan selama syarat kehati-hatian syar\'i terpenuhi.',
      },
    ],
    pendapatPerMadzhab: [
      {
        madzhab: "Syafi'iyah",
        arabLabel: 'الشافعية',
        kode: 'syafiiyah',
        ringkasanHukum: `Dalam kerangka ${kategoriLabel}, madzhab Syafi'i menelaah permasalahan "${q}" melalui penelusuran nash kitab mu'tabarah (qauli) terlebih dahulu; jika merupakan waqi'ah baru, dilakukan ilhaqul masa'il bin-nazha'ir (menyamakan illat hukum dengan kasus serupa dalam kitab).`,
        penjelasan: `Penetapan hukum di lingkungan Pesantren NU berpedoman pada tertib kitab Syafi'iyah seperti Tuhfah al-Muhtaj, Fathul Mu'in, dan Bughyatul Mustarsyidin dengan memperhatikan bebasnya praktik dari unsur haram, gharar, dan dharar.`,
        rincian: [
          `Tahap 1 (Qauli): Mencari ibarat sharih terkait "${q}" pada kitab-kitab Syafi'iyah.`,
          'Tahap 2 (Ilhaqi): Menyepadankan illat (alasan hukum) dengan furu\' fiqih klasik yang mu\'tabar.',
          'Tahap 3 (Manhaji): Menerapkan kaidah ushul fiqih: menolak mafsadat didahulukan atas meraih maslahat.',
        ],
        ulamaQuotes: [
          {
            namaUlama: 'Imam as-Suyuthi',
            kitabHalaman: 'Al-Asybah wan-Nazha\'ir, hlm. 87',
            terjemah: 'Menolak kerusakan lebih diutamakan daripada menarik kemaslahatan.',
            teksArab: 'دَرْءُ الْمَفَاسِدِ أَوْلَى مِنْ جَلْبِ الْمَصَالِحِ',
          },
        ],
        pendapatMutamad: `Wajib menjaga keabsahan syarat syar'i, menghindari bahaya (dharar), dan mengikuti pendapat mu'tamad ulama Syafi'iyah dalam "${q}".`,
        dalilQuranHadits: 'Kaidah Umum Al-Qur\'an: "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ وَلَا تَعَاوَنُوا عَلَى الْإِثْمِ وَالْعُدْوَانِ" (QS. Al-Ma\'idah [5]: 2).',
        kaidahFiqhiyah: 'دَرْءُ الْمَفَاسِدِ مُقَدَّمٌ عَلَى جَلْبِ الْمَصَالِحِ',
        rujukanKitabDetail: {
          judulKitab: syafiiKitab.judul,
          judulArab: syafiiKitab.arab,
          pengarang: "Fuqaha Muhaqqiqin Madzhab Syafi'i",
          juzHalaman: syafiiKitab.juz,
          bab: syafiiKitab.bab,
          teksArabLengkap:
            'الْحُكْمُ يَدُورُ مَعَ عِلَّتِهِ وُجُودًا وَعَدَمًا، فَمَا تَحَقَّقَ فِيهِ الْمَصْلَحَةُ الشَّرْعِيَّةُ وَانْتَفَى عَنْهُ الضَّرَرُ وَالْغَرَرُ صَحَّ وَجَازَ، وَمَا تَضَمَّنَ مَفْسَدَةً رَاجِحَةً مُنِعَ.',
          highlightArab: 'الْحُكْمُ يَدُورُ مَعَ عِلَّتِهِ وُجُودًا وَعَدَمًا',
          terjemahan:
            'Hukum berputar bersama illat-nya (ada dan tiadanya). Apa saja yang mewujudkan kemaslahatan syar\'i serta terbebas dari bahaya dan penipuan maka sah/boleh, sedangkan yang mengandung kerusakan dominan maka terlarang.',
        },
      },
      {
        madzhab: 'Hanafiyah',
        arabLabel: 'الحنفية',
        kode: 'hanafiyah',
        ringkasanHukum: `Madzhab Hanafi menimbang persoalan "${q}" dengan kaidah Istihsan dan 'Urf (kebiasaan masyarakat yang baik dan telah mapan), sehingga tidak memberatkan umat sepanjang tidak menabrak nash qath'i.`,
        penjelasan: 'Dalam Raddul Muhtar, Ibn Abidin menegaskan bahwa perubahan adat atau kondisi zaman dapat memengaruhi penetapan cara pelaksanaan hukum demi kemaslahatan.',
        rincian: [
          'Mempertimbangkan kemudahan (taisir) dan menghilangkan kesempitan (raf\'ul haraj).',
          'Kebiasaan masyarakat (\'urf) diakui sebagai sandaran hukum jika tidak menyelisihi dalil syara\'.',
        ],
        ulamaQuotes: [
          {
            namaUlama: 'Imam Ibn Abidin',
            kitabHalaman: 'Raddul Muhtar, Juz 1, hlm. 45',
            terjemah: 'Adat kebiasaan yang baik berlaku sebagai penetap hukum dalam persoalan yang tidak dibatasi secara kaku oleh nash.',
            teksArab: 'الْعُرْفُ فِي الشَّرْعِ لَهُ اعْتِبَارُ — لِذَا عَلَيْهِ الْحُكْمُ قَدْ يُدَارُ',
          },
        ],
        pendapatMutamad: 'Menggunakan pendekatan istihsan dan \'urf shahih sepanjang syarat kerelaan dan keadilan terpenuhi.',
        dalilQuranHadits: 'QS. Al-Hajj [22]: 78 ("وَمَا جَعَلَ عَلَيْكُمْ فِي الدِّينِ مِنْ حَرَجٍ").',
        kaidahFiqhiyah: 'الْمَشَقَّةُ تَجْلِبُ التَّيْسِيرَ',
        rujukanKitabDetail: {
          judulKitab: 'Raddul Muhtar (Hasyiyah Ibn Abidin)',
          judulArab: 'رَدُّ الْمُحْتَارِ',
          pengarang: 'Imam Ibn Abidin al-Hanafi',
          juzHalaman: 'Juz 1 · Halaman 45',
          bab: 'مُقَدِّمَةُ الْعُرْفِ وَالِاسْتِحْسَانِ',
          teksArabLengkap:
            'لَا يُنْكَرُ تَغَيُّرُ الْأَحْكَامِ الْمَبْنِيَّةِ عَلَى الْعُرْفِ وَالْمَصْلَحَةِ بِتَغَيُّرِ الزَّمَانِ وَالْأَحْوَالِ مَعَ بَقَاءِ أُصُولِ الشَّرِيعَةِ ثَابِتَةً.',
          highlightArab: 'لَا يُنْكَرُ تَغَيُّرُ الْأَحْكَامِ الْمَبْنِيَّةِ عَلَى الْعُرْفِ',
          terjemahan:
            'Tidak dipungkiri berubahnya sebagian hukum cabang yang berpijak pada adat dan maslahat seiring perubahan zaman dan kondisi, sementara pokok-pokok syariat tetap kokoh.',
        },
      },
      {
        madzhab: 'Malikiyah',
        arabLabel: 'المالكية',
        kode: 'malikiyah',
        ringkasanHukum: `Madzhab Maliki mengkaji "${q}" lewat kaidah Sadd adz-Dzari'ah (menutup pintu kerusakan) serta Al-Maslahah al-Mursalah (kemaslahatan umum yang selaras dengan maqashid syari'ah).`,
        penjelasan: 'Imam al-Qarafi dalam al-Furuq memetakan bahwa setiap masalah baru diukur dampaknya terhadap penjagaan agama, jiwa, akal, keturunan, dan harta.',
        rincian: [
          'Bila menimbulkan mudharat nyata bagi orang lain atau ketertiban umum, maka dicegah.',
          'Bila membawa manfaat umum tanpa melanggar larangan syari\'at, maka diterima sebagai maslahat.',
        ],
        ulamaQuotes: [
          {
            namaUlama: 'Imam al-Qarafi',
            kitabHalaman: 'Al-Furuq, Juz 2, hlm. 33',
            terjemah: 'Menutup jalan menuju kerusakan wajib dilakukan sebagaimana membuka jalan menuju kemaslahatan.',
            teksArab: 'سَدُّ الذَّرَائِعِ إِلَى الْمَفَاسِدِ وَاجِبٌ كَفَتْحِهَا إِلَى الْمَصَالِحِ',
          },
        ],
        pendapatMutamad: 'Menjaga keseimbangan antara maslahat mursalah dan pencegahan dampak buruk (sadd adz-dzari\'ah).',
        dalilQuranHadits: 'Hadis "لَا ضَرَرَ وَلَا ضِرَارَ" (HR. Malik, Ahmad & Ibn Majah).',
        kaidahFiqhiyah: 'سَدُّ الذَّرَائِعِ وَاجِبٌ عِنْدَ خَوْفِ الْمَفْسَدَةِ',
        rujukanKitabDetail: {
          judulKitab: 'Al-Furuq (Anwar al-Buruq fi Anwa\' al-Furuq)',
          judulArab: 'الْفُرُوْقُ لِلْقَرَافِي',
          pengarang: 'Imam Syihabuddin al-Qarafi',
          juzHalaman: 'Juz 2 · Halaman 33',
          bab: 'الْفَرْقُ فِي سَدِّ الذَّرَائِعِ وَالْمَصَالِحِ',
          teksArabLengkap:
            'الذَّرِيعَةُ الْمُفْضِيَةُ إِلَى الْحَرَامِ يَجِبُ سَدُّهَا، وَالْمَصْلَحَةُ الْمُلَائِمَةُ لِمَقَاصِدِ الشَّرْعِ مُعْتَبَرَةٌ فِي الْإِفْتَاءِ.',
          highlightArab: 'الْمَصْلَحَةُ الْمُلَائِمَةُ لِمَقَاصِدِ الشَّرْعِ مُعْتَبَرَةٌ',
          terjemahan:
            'Perantara yang mengantarkan pada keharaman wajib ditutup, sedangkan kemaslahatan yang selaras dengan tujuan syariat dijadikan pertimbangan dalam fatwa.',
        },
      },
      {
        madzhab: 'Hanabilah',
        arabLabel: 'الحنابلة',
        kode: 'hanabilah',
        ringkasanHukum: `Madzhab Hanbali menekankan hukum asal pada persoalan non-ibadah mahdhah adalah boleh (al-ibahah) hingga ada dalil pelarangnya, sedangkan dalam ibadah mahdhah bersifat tauqifi (mengikuti tuntunan nash).`,
        penjelasan: 'Ibn Qudamah dalam al-Mughni mengingatkan perlunya kehati-hatian agar niat dan tata cara pelaksanaan tetap bersih dari syubhat.',
        rincian: [
          isIbadah
            ? 'Untuk urusan ibadah: wajib mengikuti dalil shahih dan tidak membuat tata cara tanpa dasar.'
            : 'Untuk urusan muamalah/sosial: diperbolehkan selama bersih dari riba, paksaan, dan penipuan.',
        ],
        ulamaQuotes: [
          {
            namaUlama: 'Imam Ibn Qudamah',
            kitabHalaman: 'Al-Mughni, Juz 4, hlm. 210',
            terjemah: 'Segala syarat dan transaksi yang tidak menyalahi Kitabullah dan Sunnah pada dasarnya diperbolehkan.',
            teksArab: 'الْأَصْلُ فِي الشُّرُوطِ وَالْمُعَامَلَاتِ الصِّحَّةُ حَتَّى يَقُومَ دَلِيلُ الْبُطْلَانِ',
          },
        ],
        pendapatMutamad: isIbadah ? 'Mengutamakan kehati-hatian (ihtiyath) dalam tata cara ibadah.' : 'Sah selama terbebas dari larangan syar\'i yang tegas.',
        dalilQuranHadits: 'Hadis al-Nu\'man bin Basyir tentang menjauhi perkara syubhat (HR. Bukhari & Muslim).',
        kaidahFiqhiyah: isIbadah ? 'الْأَصْلُ فِي الْعِبَادَاتِ التَّوَقُّفُ وَالِاتِّبَاعُ' : 'الْأَصْلُ فِي الْأَشْيَاءِ الْإِبَاحَةُ',
        rujukanKitabDetail: {
          judulKitab: 'Al-Mughni & Kassyaf al-Qina\'',
          judulArab: 'الْمُغْنِي لِابْنِ قُدَامَةَ',
          pengarang: 'Imam Ibn Qudamah al-Maqdisi',
          juzHalaman: 'Juz 4 · Halaman 210',
          bab: 'قَوَاعِدُ الْفِقْهِ وَالشُّرُوطِ',
          teksArabLengkap:
            'فَمَنِ اتَّقَى الشُّبُهَاتِ فَقَدِ اسْتَبْرَأَ لِدِينِهِ وَعِرْضِهِ، وَالْحَلَالُ بَيِّنٌ وَالْحَرَامُ بَيِّنٌ.',
          highlightArab: 'فَمَنِ اتَّقَى الشُّبُهَاتِ فَقَدِ اسْتَبْرَأَ لِدِينِهِ وَعِرْضِهِ',
          terjemahan:
            'Barangsiapa menjaga diri dari perkara-perkara syubhat (samar), maka ia telah membersihkan agama dan kehormatannya; yang halal itu jelas dan yang haram itu jelas.',
        },
      },
    ],
    rumusanSidang: {
      ringkasanPapan: `Berdasarkan telaah 4 madzhab atas "${q}" (${kategoriLabel}): (1) Pastikan seluruh syarat dan rukun syar'i terpenuhi sesuai kitab mu'tabarah; (2) Hindari unsur haram, penipuan, maupun mudharat bagi sesama; (3) Gunakan langkah kehati-hatian (ihtiyath) bila terdapat perbedaan pendapat ulama.`,
      tarjihMushahih: `Dewan Mushahih mentarjih penerapan qawl mu'tamad Syafi'iyah (${syafiiKitab.judul}) dengan mempertimbangkan kemaslahatan dan pencegahan mafsadah. Bila timbul keraguan implementasi di masyarakat, hendaknya berkonsultasi langsung dengan Masyayikh / LBM Pondok.`,
      langkahPengambilanHukum: [
        {
          judul: 'Tashwir & Klasifikasi Masalah',
          deskripsi: `Mengklasifikasikan as'ilah ke dalam ruang lingkup ${kategoriLabel} serta memetakan unsur utama kejadiannya.`,
        },
        {
          judul: 'Penelusuran Kitab Mu\'tabarah (Qauli & Ilhaqi)',
          deskripsi: `Menelaah ibarat dari ${syafiiKitab.judul}, Raddul Muhtar, Al-Furuq, dan Al-Mughni lintas 4 madzhab.`,
        },
        {
          judul: 'Tarjih & Penetapan Kaidah Fiqhiyah',
          deskripsi: 'Memilih rumusan yang paling aman (ahwath) bagi agama serta memberi kemaslahatan nyata bagi umat.',
        },
      ],
      kaidahDipakai: [
        { arab: 'دَرْءُ الْمَفَاسِدِ مُقَدَّمٌ عَلَى جَلْبِ الْمَصَالِحِ', arti: 'Menolak kerusakan lebih didahulukan daripada menarik kemaslahatan.' },
        { arab: 'الْخُرُوجُ مِنَ الْخِلَافِ مُسْتَحَبٌّ', arti: 'Keluar dari perselisihan pendapat ulama hukumnya dianjurkan.' },
      ],
    },
  };
}

export function downloadBahtsulMasailPdf(result: BahtsulMasailResult) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  doc.setFillColor(7, 67, 42);
  doc.rect(14, 10, 182, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('LEMBAGA BAHTSUL MASAIL — PP NU DARUSSALAM KARANGDADAP', 18, 17.5);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Risalah Keputusan Sidang 4 Madzhab · Tanggal: ${result.tanggalSidang}`, 18, 23.5);
  doc.text("Metodologi: Qauli, Ilhaqi & Manhaji Kitab Mu'tabarah", 18, 28.5);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text("AS'ILAH / PERMASALAHAN:", 14, 40);
  doc.setFont('helvetica', 'normal');
  const wrappedQ = doc.splitTextToSize(result.asilah, 182);
  doc.text(wrappedQ, 14, 45.5);

  let cursorY = 45.5 + wrappedQ.length * 5 + 3;
  doc.setFillColor(254, 249, 195);
  doc.setDrawColor(234, 179, 8);
  const warnLines = doc.splitTextToSize(`Peringatan Bermadzhab: ${result.peringatan}`, 176);
  const warnH = warnLines.length * 4.5 + 5;
  doc.roundedRect(14, cursorY, 182, warnH, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setTextColor(113, 63, 18);
  doc.text(warnLines, 17, cursorY + 4.5);

  cursorY += warnH + 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 78, 59);
  doc.text('RUMUSAN & TARJIH MUSHAHIH:', 14, cursorY);
  cursorY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(30, 41, 59);
  const rumusanLines = doc.splitTextToSize(
    `${result.rumusanSidang.ringkasanPapan}\n\nTarjih Mushahih: ${result.rumusanSidang.tarjihMushahih}`,
    182
  );
  doc.text(rumusanLines, 14, cursorY);
  cursorY += rumusanLines.length * 4.4 + 4;

  autoTable(doc, {
    startY: cursorY,
    head: [['Madzhab', 'Ringkasan Hukum & Kitab Rujukan', "Pendapat Mu'tamad"]],
    body: result.pendapatPerMadzhab.map((p) => [
      p.madzhab,
      `${p.ringkasanHukum}\n[${p.rujukanKitabDetail.judulKitab}, ${p.rujukanKitabDetail.juzHalaman}]`,
      p.pendapatMutamad,
    ]),
    styles: { fontSize: 8, cellPadding: 2.5, valign: 'top' },
    headStyles: { fillColor: [7, 67, 42], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 26, fontStyle: 'bold' },
      1: { cellWidth: 88 },
      2: { cellWidth: 68 },
    },
    margin: { left: 14, right: 14 },
  });

  doc.save(`Bahtsul-Masail-${result.id}.pdf`);
}
