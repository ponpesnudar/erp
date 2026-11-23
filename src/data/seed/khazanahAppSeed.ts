import {
  AYAT_KURSI_COMPLETE,
  HIZIB_LENGKAP_GROUP,
  KITAB_DALAILUL_KHOIROT_GROUP,
  KITAB_HAIKAL_NURONI_GROUP,
  MANAQIB_NURUL_BURHANI_GROUP,
  RATIB_LENGKAP_GROUP,
  SYAIR_PESANTREN_LENGKAP,
  TAHLIL_SYAFII_LENGKAP,
} from './khazanahKitabLengkap.ts';

export interface BacaanDetail {
  id: string;
  judul: string;
  subjudul?: string;
  arab: string;
  latin: string;
  arti: string;
  dalil?: string;
}

export interface WiridDoaGroup {
  no: number;
  judul: string;
  jumlahBacaan: number;
  tab: 'wirid' | 'doa';
  items: BacaanDetail[];
}

export const WIRID_DOA_GROUPS: WiridDoaGroup[] = [
  // WIRID 1..8 (Persis Urutan & Label Screenshot)
  {
    no: 1,
    tab: 'wirid',
    judul: 'Wirid Harian',
    jumlahBacaan: 6,
    items: [
      {
        id: 'w-1',
        judul: 'Istighfar Pembuka Wirid',
        arab: 'أَسْتَغْفِرُ اللهَ الْعَظِيْمَ الَّذِي لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّوْمُ وَأَتُوْبُ إِلَيْهِ',
        latin: "Astaghfirullāhal-'aẓīm allażī lā ilāha illā huwal-ḥayyul-qayyūm wa atūbu ilaih (3x)",
        arti: 'Aku memohon ampun kepada Allah Yang Maha Agung, tiada Tuhan selain Dia Yang Maha Hidup lagi Maha Mengurus segala sesuatu, dan aku bertaubat kepada-Nya.',
      },
      {
        id: 'w-2',
        judul: 'Dzikir Kalimat Tauhid',
        arab: 'لَا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِيْ وَيُمِيْتُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيْرٌ',
        latin: 'Lā ilāha illallāhu waḥdahū lā syarīka lah, lahul-mulku wa lahul-ḥamdu yuḥyī wa yumītu wa huwa ‘alā kulli syai’in qadīr (3x/10x)',
        arti: 'Tiada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan segala puji. Dialah yang menghidupkan dan mematikan, dan Dia Maha Kuasa atas segala sesuatu.',
      },
      {
        id: 'w-3',
        judul: 'Doa Keselamatan (Allāhumma Antas-Salām)',
        arab: 'اَللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ وَإِلَيْكَ يَعُوْدُ السَّلَامُ فَحَيِّنَا رَبَّنَا بِالسَّلَامِ وَأَدْخِلْنَا الْجَنَّةَ دَارَ السَّلَامِ',
        latin: 'Allāhumma antas-salām wa minkas-salām wa ilaika ya‘ūdus-salām faḥayyinā rabbanā bis-salām wa adkhilnal-jannata dāras-salām',
        arti: 'Ya Allah, Engkau sumber keselamatan, dari-Mu keselamatan, dan kepada-Mu kembali keselamatan. Maka hidupkanlah kami dengan keselamatan dan masukkanlah kami ke surga Darussalam.',
      },
      {
        id: 'w-4',
        judul: 'Tasbih, Tahmid & Takbir (33x)',
        arab: 'سُبْحَانَ اللهِ (٣٣×) ۞ اَلْحَمْدُ لِلّٰهِ (٣٣×) ۞ اَللهُ أَكْبَرُ (٣٣×)',
        latin: 'Subḥānallāh (33x) — Alḥamdulillāh (33x) — Allāhu Akbar (33x)',
        arti: 'Maha Suci Allah, segala puji bagi Allah, Allah Maha Besar.',
      },
      {
        ...AYAT_KURSI_COMPLETE,
        id: 'w-5',
        judul: 'Ayat Kursi Lengkap (QS. Al-Baqarah: 255)',
      },
      {
        id: 'w-6',
        judul: 'Doa Sapu Jagad & Penutup',
        arab: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        latin: 'Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā ‘ażāban-nār',
        arti: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, serta lindungilah kami dari siksa neraka.',
      },
    ],
  },
  {
    no: 2,
    tab: 'wirid',
    judul: 'Shalawat',
    jumlahBacaan: 35,
    items: [
      {
        id: 'sh-1',
        judul: 'Shalawat Nariyah (Tafrijiyah)',
        arab: 'اَللّٰهُمَّ صَلِّ صَلَاةً كَامِلَةً وَسَلِّمْ سَلَامًا تَامًّا عَلٰى سَيِّدِنَا مُحَمَّدِ الَّذِي تَنْحَلُّ بِهِ الْعُقَدُ وَتَنْفَرِجُ بِهِ الْكُرَبُ',
        latin: 'Allāhumma ṣalli ṣalātan kāmilatan wa sallim salāman tāmman ‘alā sayyidinā Muḥammadinillażī tanḥallu bihil-‘uqadu wa tanfariju bihil-kurab',
        arti: 'Ya Allah, limpahkanlah shalawat dan salam yang sempurna atas junjungan kami Nabi Muhammad, yang dengan berkahnya terurai segala ikatan kesulitan dan terlepas segala kesusahan.',
      },
      {
        id: 'sh-2',
        judul: 'Shalawat Tibbil Qulub (Syifa)',
        arab: 'اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ طِبِّ الْقُلُوْبِ وَدَوَائِهَا وَعَافِيَةِ الْأَبْدَانِ وَشِفَائِهَا وَنُوْرِ الْأَبْصَارِ وَضِيَائِهَا',
        latin: 'Allāhumma ṣalli ‘alā sayyidinā Muḥammadin ṭibbil-qulūbi wa dawā’ihā wa ‘āfiyatil-abdāni wa syifā’ihā wa nūril-abṣāri wa ḍiyā’ihā',
        arti: 'Ya Allah, curahkanlah rahmat kepada junjungan kami Nabi Muhammad, obat segala hati dan penyembuhnya, kesehatan badan dan kesembuhannya, serta cahaya penglihatan dan sinarnya.',
      },
      {
        id: 'sh-3',
        judul: 'Shalawat Badar',
        arab: 'صَلَاةُ اللهِ سَلَامُ اللهِ ۞ عَلٰى طٰهَ رَسُوْلِ اللهِ ۞ صَلَاةُ اللهِ سَلَامُ اللهِ ۞ عَلٰى يٰسٓ حَبِيْبِ اللهِ',
        latin: 'Ṣalātullāhi salāmullāhi ‘alā Ṭāhā rasūlillāh — Ṣalātullāhi salāmullāhi ‘alā Yāsīn ḥabībillāh',
        arti: 'Rahmat dan keselamatan Allah semoga tetap tercurah atas Thaha utusan Allah, dan atas Yasin kekasih Allah.',
      },
    ],
  },
  {
    no: 3,
    tab: 'wirid',
    judul: 'Asmaul Husna',
    jumlahBacaan: 3,
    items: [
      {
        id: 'ah-1',
        judul: 'Nadhom Asmaul Husna Pembuka & Penutup',
        arab: 'يَا اَللهُ يَا رَحْمٰنُ يَا رَحِيْمُ يَا مَلِكُ يَا قُدُّوْسُ يَا سَلَامُ يَا مُؤْمِنُ يَا مُهَيْمِنُ يَا عَزِيْزُ يَا جَبَّارُ يَا مُتَكَبِّرُ يَا خَالِقُ يَا بَارِئُ يَا مُصَوِّرُ يَا غَفَّارُ يَا قَهَّارُ يَا وَهَّابُ يَا رَزَّاقُ يَا فَتَّاحُ يَا عَلِيْمُ',
        latin:
          'Yā Allāh, Yā Raḥmān, Yā Raḥīm, Yā Malik, Yā Quddūs, Yā Salām, Yā Mu’min, Yā Muhaimin, Yā ‘Azīz, Yā Jabbār, Yā Mutakabbir, Yā Khāliq, Yā Bāri’, Yā Muṣawwir, Yā Ghaffār, Yā Qahhār, Yā Wahhāb, Yā Razzāq, Yā Fattāḥ, Yā ‘Alīm.',
        arti: 'Wahai Allah Yang Maha Pengasih, Maha Penyayang, Maha Merajai, Maha Suci, Maha Pemberi Keselamatan, Maha Mengaruniakan Keamanan, Maha Memelihara, Maha Perkasa, Maha Berkehendak, Maha Pemilik Kebesaran, Maha Pencipta, Maha Mengadakan, Maha Membentuk Rupa, Maha Pengampun, Maha Menundukkan, Maha Pemberi Karunia, Maha Pemberi Rezeki, Maha Pembuka Rahmat, lagi Maha Mengetahui.',
      },
    ],
  },
  {
    no: 4,
    tab: 'wirid',
    judul: 'Istighotsah & Mujahadah',
    jumlahBacaan: 7,
    items: [
      {
        id: 'is-1',
        judul: 'Istighotsah Kubra PWNU / Pesantren',
        arab: 'يَا حَيُّ يَا قَيُّوْمُ بِرَحْمَتِكَ أَسْتَغِيْثُ ۞ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ الْعَلِيِّ الْعَظِيْمِ',
        latin: 'Yā Ḥayyu Yā Qayyūm biraḥmatika astaghīṡ — Lā ḥaula wa lā quwwata illā billāhil-‘aliyyil-‘aẓīm',
        arti: 'Wahai Dzat Yang Maha Hidup lagi Maha Berdiri Sendiri, dengan rahmat-Mu aku memohon pertolongan.',
      },
    ],
  },
  RATIB_LENGKAP_GROUP,
  HIZIB_LENGKAP_GROUP,
  KITAB_DALAILUL_KHOIROT_GROUP,
  MANAQIB_NURUL_BURHANI_GROUP,
  KITAB_HAIKAL_NURONI_GROUP,
  // DOA 1..9 (Persis Urutan & Label Screenshot)
  {
    no: 1,
    tab: 'doa',
    judul: 'Doa Keseharian',
    jumlahBacaan: 19,
    items: [
      {
        id: 'd-1',
        judul: 'Doa Sebelum Tidur & Bangun Tidur',
        arab: 'بِاسْمِكَ اللّٰهُمَّ أَحْيَا وَبِاسْمِكَ أَمُوْتُ',
        latin: 'Bismikallāhumma aḥyā wa bismika amūt',
        arti: 'Dengan nama-Mu ya Allah aku hidup, dan dengan nama-Mu aku mati.',
      },
      {
        id: 'd-2',
        judul: 'Doa Sebelum Makan & Sesudah Makan',
        arab: 'اَللّٰهُمَّ بَارِكْ لَنَا فِيْمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
        latin: 'Allāhumma bārik lanā fīmā razaqtanā wa qinā ‘ażāban-nār',
        arti: 'Ya Allah, berkahilah kami dalam rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka.',
      },
    ],
  },
  {
    no: 2,
    tab: 'doa',
    judul: 'Doa Rezeki',
    jumlahBacaan: 9,
    items: [
      {
        id: 'dr-1',
        judul: 'Doa Memohon Rezeki Halal & Berkah (Shalat Dhuha Lengkap)',
        arab: 'اَللّٰهُمَّ إِنَّ الضُّحَاءَ ضُحَاؤُكَ وَالْبَهَاءَ بَهَاؤُكَ وَالْجَمَالَ جَمَالُكَ وَالْقُوَّةَ قُوَّتُكَ وَالْقُدْرَةَ قُدْرَتُكَ وَالْعِصْمَةَ عِصْمَتُكَ. اَللّٰهُمَّ إِنْ كَانَ رِزْقِي فِي السَّمَاءِ فَأَنْزِلْهُ وَإِنْ كَانَ فِي الْأَرْضِ فَأَخْرِجْهُ وَإِنْ كَانَ مُعْسِرًا فَيَسِّرْهُ وَإِنْ كَانَ حَرَامًا فَطَهِّرْهُ وَإِنْ كَانَ بَعِيْدًا فَقَرِّبْهُ بِحَقِّ ضُحَائِكَ وَبَهَائِكَ وَجَمَالِكَ وَقُوَّتِكَ وَقُدْرَتِكَ آتِنِي مَا آتَيْتَ عِبَادَكَ الصَّالِحِيْنَ',
        latin: 'Allāhumma innaḍ-ḍuḥā’a ḍuḥā’uka wal-bahā’a bahā’uka wal-jamāla jamāluka wal-quwwata quwwatuka wal-qudrata qudratuka wal-‘iṣmata ‘iṣmatuk. Allāhumma in kāna rizqī fis-samā’i fa anzilhu, wa in kāna fil-arḍi fa akhrijhu, wa in kāna mu‘siran fayassirhu, wa in kāna ḥarāman faṭahhirhu, wa in kāna ba‘īdan faqarribhu, biḥaqqi ḍuḥā’ika wa bahā’ika wa jamālika wa quwwatika wa qudratika ātinī mā ātaita ‘ibādakaṣ-ṣāliḥīn.',
        arti: 'Ya Allah, sesungguhnya waktu dhuha itu dhuha-Mu, keagungan itu keagungan-Mu, keindahan itu keindahan-Mu, kekuatan itu kekuatan-Mu, kekuasaan itu kekuasaan-Mu, dan penjagaan itu penjagaan-Mu. Ya Allah, jika rezekiku berada di langit maka turunkanlah, jika di bumi maka keluarkanlah, jika sukar maka mudahkanlah, jika haram maka sucikanlah, dan jika jauh maka dekatkanlah dengan hak dhuha, keagungan, keindahan, kekuatan, dan kekuasaan-Mu; anugerahkan kepadaku sebagaimana yang Engkau berikan kepada hamba-hamba-Mu yang shalih.',
      },
    ],
  },
  {
    no: 3,
    tab: 'doa',
    judul: 'Doa Tolak Bala',
    jumlahBacaan: 13,
    items: [
      {
        id: 'dt-1',
        judul: 'Doa Tolak Bala & Wabah',
        arab: 'اَللّٰهُمَّ ادْفَعْ عَنَّا الْبَلَاءَ وَالْوَبَاءَ وَالْفَحْشَاءَ وَالْمُنْكَرَ',
        latin: 'Allāhummadfa‘ ‘annal-balā’a wal-wabā’a wal-faḥsyā’a wal-munkar',
        arti: 'Ya Allah, hindarkanlah kami dari bencana, wabah penyakit, kekejian, dan kemungkaran.',
      },
    ],
  },
  {
    no: 4,
    tab: 'doa',
    judul: 'Doa Kesehatan',
    jumlahBacaan: 5,
    items: [
      {
        id: 'dkes-1',
        judul: 'Doa Kesembuhan (Lā Ba’sa Ṭahūr)',
        arab: 'اَللّٰهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ، اِشْفِ أَنْتَ الشَّافِيْ لَا شِفَاءَ إِلَّا شِفَاؤُكَ',
        latin: 'Allāhumma rabban-nās ażhibil-ba’sa, isyfi antasy-syāfī lā syifā’a illā syifā’uk',
        arti: 'Ya Allah Tuhan segenap manusia, hilangkanlah penyakit, sembuhkanlah karena Engkau Maha Penyembuh.',
      },
    ],
  },
  {
    no: 5,
    tab: 'doa',
    judul: 'Doa Perjalanan',
    jumlahBacaan: 7,
    items: [
      {
        id: 'dp-1',
        judul: 'Doa Naik Kendaraan & Safar',
        arab: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هٰذَا وَمَا كُنَّا لَهُ مُقْرِنِيْنَ وَإِنَّا إِلٰى رَبِّنَا لَمُنْقَلِبُوْنَ',
        latin: 'Subḥānallażī sakhkhara lanā hāżā wa mā kunnā lahū muqrinīn wa innā ilā rabbinā lamunqalibūn',
        arti: 'Maha Suci Allah yang telah menundukkan kendaraan ini untuk kami padahal kami sebelumnya tidak mampu menguasainya.',
      },
    ],
  },
  {
    no: 6,
    tab: 'doa',
    judul: 'Doa Ilmu',
    jumlahBacaan: 9,
    items: [
      {
        id: 'di-1',
        judul: 'Doa Sebelum Belajar Kitab & Muthola’ah',
        arab: 'رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا وَاجْعَلْنِي مِنَ الصَّالِحِيْنَ',
        latin: 'Rabbi zidnī ‘ilman warzuqnī fahman waj‘alnī minaṣ-ṣāliḥīn',
        arti: 'Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan, karuniakanlah kepadaku kepahaman, dan masukkanlah aku ke dalam golongan orang-orang shalih.',
      },
    ],
  },
  {
    no: 7,
    tab: 'doa',
    judul: 'Doa Waktu Tertentu',
    jumlahBacaan: 12,
    items: [
      {
        id: 'dw-1',
        judul: 'Doa Ketika Hujan Turun & Doa Pagi Sore',
        arab: 'اَللّٰهُمَّ صَيِّبًا نَافِعًا',
        latin: 'Allāhumma ṣayyiban nāfi‘ā',
        arti: 'Ya Allah, turunkanlah hujan yang penuh keberkahan dan kemanfaatan.',
      },
    ],
  },
  {
    no: 8,
    tab: 'doa',
    judul: 'Doa Kualitas Diri',
    jumlahBacaan: 10,
    items: [
      {
        id: 'dq-1',
        judul: 'Doa Keteguhan Hati & Istiqamah',
        arab: 'يَا مُقَلِّبَ الْقُلُوْبِ ثَبِّتْ قَلْبِي عَلٰى دِيْنِكَ',
        latin: 'Yā muqallibal-qulūbi ṡabbit qalbī ‘alā dīnik',
        arti: 'Wahai Dzat yang membolak-balikkan hati, teguhkanlah hatiku di atas agama-Mu.',
      },
    ],
  },
  {
    no: 9,
    tab: 'doa',
    judul: 'Doa Pernikahan & Rumah Tangga',
    jumlahBacaan: 10,
    items: [
      {
        id: 'dn-1',
        judul: 'Doa Pengantin & Keluarga Sakinah',
        arab: 'بَارَكَ اللهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
        latin: 'Bārakallāhu laka wa bāraka ‘alaika wa jama‘a bainakumā fī khair',
        arti: 'Semoga Allah memberkahimu dalam suka maupun duka serta menghimpun kalian berdua dalam kebaikan.',
      },
    ],
  },
];

export const TAHLIL_VERSES: BacaanDetail[] = TAHLIL_SYAFII_LENGKAP;

export interface QasidahItem {
  no: number;
  judul: string;
  subKategori: string;
  arabTitle: string;
  baits: { arab: string; latin: string; arti: string }[];
}

const MAULID_KLASIK_TAMBAHAN: QasidahItem[] = [
  {
    no: 10,
    judul: 'Adlaita',
    subKategori: 'Maulid & Pujian Nabi',
    arabTitle: 'أَضْلَيْتَ',
    baits: [
      {
        arab: 'صَلَّى اللهُ عَلٰى مُحَمَّدْ ۞ صَلَّى اللهُ عَلَيْهِ وَسَلَّمْ',
        latin: 'Ṣallallāhu ‘alā Muḥammad ۞ Ṣallallāhu ‘alaihi wa sallam',
        arti: 'Semoga rahmat dan salam Allah tercurah atas Nabi Muhammad.',
      },
    ],
  },
  {
    no: 11,
    judul: 'Alhamdu Lillah',
    subKategori: 'Maulid & Pujian Nabi',
    arabTitle: 'اَلْحَمْدُ لِلّٰهِ',
    baits: [
      {
        arab: 'اَلْحَمْدُ لِلّٰهِ الَّذِيْ أَعْطَانَا ۞ هٰذَا الْغُلَامَ الطَّيِّبَ الْأَرْدَانَا',
        latin: 'Alḥamdulillāhillażī a‘ṭānā ۞ hāżal-ghulāmaṭ-ṭayyibal-ardānā',
        arti: 'Segala puji bagi Allah yang telah menganugerahkan kepada kami sang kekasih yang mulia akhlaknya.',
      },
    ],
  },
  {
    no: 12,
    judul: 'Jaddal Husain',
    subKategori: 'Maulid & Pujian Nabi',
    arabTitle: 'جَدَّ الْحُسَيْنِ',
    baits: [
      {
        arab: 'جَدَّ الْحُسَيْنِ يَا نُوْرَ الْعَيْنِ ۞ كُنْ لِي شَفِيْعًا يَا ضِيَاءَ الْمُقْلَتَيْنِ',
        latin: 'Jaddal-ḥusaini yā nūral-‘ain ۞ kun lī syafī‘an yā ḍiyā’al-muqlatain',
        arti: 'Wahai kakek Al-Husain, wahai cahaya mata, jadilah pemberi syafaatku — wahai cahaya dua pandangan.',
      },
      {
        arab: 'يَا إِمَامَ الْأَنْبِيَاءِ ۞ يَا فَخْرَ الْأَمَاجِدِ\nإِنِّي بِالْآمَالِ دَاخِلُ حِمَاكَ ۞ أَرْجُو رِضَاكَ يَا إِمَامَ الْقِبْلَتَيْنِ\nأَنْتَ أَقَمْتَ الْعَدَالَةَ وَالْقَضِيَّةَ ۞ وَاللهُ صَلَّى عَلَيْكَ',
        latin: 'Yā imāmal-anbiyā’i ۞ yā fakhral-amājid\nInnī bil-āmāli dākhil ḥimāk ۞ arjū riḍāk yā imāmal-qiblatain\nAnta aqamtal-‘adālah wal-qaḍiyyah ۞ wallāhu ṣallā ‘alaik',
        arti: 'Wahai imam para nabi, wahai kebanggaan para orang mulia. Sesungguhnya aku dengan penuh harapan memasuki naunganmu.',
      },
    ],
  },
  {
    no: 13,
    judul: "Syahrur Rabi'",
    subKategori: 'Maulid & Pujian Nabi',
    arabTitle: 'شَهْرُ الرَّبِيْعِ',
    baits: [
      {
        arab: 'شَهْرُ الرَّبِيْعِ الَّذِيْ أَنَرْتَ أُفْقَ الدُّنَا ۞ بِمَوْلِدِ الْمُصْطَفٰى هَادِي الْوَرٰى أَجْمَعَا',
        latin: 'Syahrur-rabī‘illażī anarta ufqad-dunā ۞ bimaulidil-muṣṭafā hādil-warā ajma‘ā',
        arti: 'Bulan Rabiul Awal yang menerangi ufuk semesta dengan kelahiran Al-Musthafa penunjuk umat manusia.',
      },
    ],
  },
  {
    no: 14,
    judul: 'Tarahhabna',
    subKategori: 'Maulid & Pujian Nabi',
    arabTitle: 'تَرَحَّبْنَا',
    baits: [
      {
        arab: 'تَرَحَّبْنَا بِمَوْلِدِ طٰهَ الْمُصْطَفٰى ۞ أَنَارَ الْكَوْنَ مِنْ بَعْدِ الظَّلَامِ',
        latin: 'Taraḥḥabnā bimaulidi Ṭāhal-Muṣṭafā ۞ anāral-kauna min ba‘diẓ-ẓalām',
        arti: 'Kami sambut gembira kelahiran Thaha Al-Musthafa yang menerangi semesta.',
      },
    ],
  },
  {
    no: 15,
    judul: "Thala'al Badru Kun Syafi'an ya Habibi",
    subKategori: 'Maulid & Pujian Nabi',
    arabTitle: 'طَلَعَ الْبَدْرُ',
    baits: [
      {
        arab: 'طَلَعَ الْبَدْرُ عَلَيْنَا ۞ مِنْ ثَنِيَّاتِ الْوَدَاعِ\nوَجَبَ الشُّكْرُ عَلَيْنَا ۞ مَا دَعَا لِلّٰهِ دَاعِ',
        latin: 'Ṭala‘al-badru ‘alainā min ṡaniyyātil-wadā‘ — Wajabasy-syukru ‘alainā mā da‘ā lillāhi dā‘',
        arti: 'Bulan purnama telah terbit menyinari kami dari celah bukit Wada’. Wajib bagi kami bersyukur selama penyeru menyeru kepada Allah.',
      },
    ],
  },
  {
    no: 16,
    judul: "Thala'al Badru Marhaban ya Musthafana",
    subKategori: 'Maulid & Pujian Nabi',
    arabTitle: 'مَرْحَبًا يَا مُصْطَفَانَا',
    baits: [
      {
        arab: 'مَرْحَبًا يَا مُصْطَفَانَا ۞ مَرْحَبًا نُوْرَ الْهُدٰى',
        latin: 'Marḥaban yā muṣṭafānā ۞ Marḥaban nūral-hudā',
        arti: 'Selamat datang wahai Nabi pilihan kami, selamat datang cahaya petunjuk.',
      },
    ],
  },
  {
    no: 17,
    judul: "Thala'al Badru Syarraftal Madinah",
    subKategori: 'Maulid & Pujian Nabi',
    arabTitle: 'شَرَّفْتَ الْمَدِيْنَةَ',
    baits: [
      {
        arab: 'أَنْتَ شَمْسٌ أَنْتَ بَدْرٌ ۞ أَنْتَ نُوْرٌ فَوْقَ نُوْرِ',
        latin: 'Anta syamsun anta badrun ۞ anta nūrun fauqa nūr',
        arti: 'Engkau bagai mentari, engkau purnama, engkau cahaya di atas cahaya.',
      },
    ],
  },
  {
    no: 18,
    judul: 'Wulidal Habibu fa Marhaba',
    subKategori: 'Maulid & Pujian Nabi',
    arabTitle: 'وُلِدَ الْحَبِيْبُ',
    baits: [
      {
        arab: 'وُلِدَ الْحَبِيْبُ فَمَرْحَبًا بِقُدُوْمِهِ ۞ نُوْرُ الْوُجُوْدِ وَفَخْرُ كُلِّ الْعَالَمِ',
        latin: 'Wulidal-ḥabību fa marḥaban biqudūmihī ۞ nūrul-wujūdi wa fakhru kullil-‘ālam',
        arti: 'Telah lahir sang kekasih Allah, selamat datang kehadirannya sang cahaya semesta.',
      },
    ],
  },
  {
    no: 19,
    judul: 'Wulidal Habibu wa Khadduhu Mutawarridu',
    subKategori: 'Maulid & Pujian Nabi',
    arabTitle: 'وُلِدَ الْحَبِيْبُ وَخَدُّهُ مُتَوَرِّدُ',
    baits: [
      {
        arab: 'وُلِدَ الْحَبِيْبُ وَخَدُّهُ مُتَوَرِّدُ ۞ وَالنُّوْرُ مِنْ وَجَنَاتِهِ يَتَوَقَّدُ',
        latin: 'Wulidal-ḥabību wa khadduhū mutawarridu ۞ wan-nūru min wajanātihī yatawaqqadu',
        arti: 'Telah lahir sang kekasih yang berseri pipinya dan memancar cahaya indah dari wajahnya.',
      },
    ],
  },
  {
    no: 20,
    judul: 'Wulidal Musyarraf',
    subKategori: 'Maulid & Pujian Nabi',
    arabTitle: 'وُلِدَ الْمُشَرَّفُ',
    baits: [
      {
        arab: 'وُلِدَ الْمُشَرَّفُ فِي رَبِيْعِ الْأَوَّلِ ۞ فَالْكَوْنُ أَشْرَقَ بِالْبَهَاءِ الْأَكْمَلِ',
        latin: 'Wulidal-musyarrafu fī rabī‘il-awwalī ۞ fal-kaunu asyraqa bil-bahā’il-akmal',
        arti: 'Telah lahir sosok yang dimuliakan pada bulan Rabiul Awal, maka semesta bersinar indah.',
      },
    ],
  },
  {
    no: 21,
    judul: 'Ya Habibal Qalbi',
    subKategori: 'Maulid & Pujian Nabi',
    arabTitle: 'يَا حَبِيْبَ الْقَلْبِ',
    baits: [
      {
        arab: 'يَا حَبِيْبَ الْقَلْبِ يَا خَيْرَ الْبَرَايَا ۞ يَا مَنْ جِئْتَ بِالْحَقِّ رَسُوْلَ الْهِدَايَةِ',
        latin: 'Yā ḥabībal-qalbi yā khairal-barāyā ۞ yā man ji’ta bil-ḥaqqi rasūlal-hidāyah',
        arti: 'Wahai kekasih hati, wahai sebaik-baik manusia, engkau datang membawa kebenaran dan petunjuk.',
      },
    ],
  },
  {
    no: 22,
    judul: 'Ya Hanana',
    subKategori: 'Maulid & Pujian Nabi',
    arabTitle: 'يَا هَنَانَا',
    baits: [
      {
        arab: 'ظَهَرَ الدِّيْنُ الْمُؤَيَّدْ ۞ بِظُهُوْرِ النَّبِي أَحْمَدْ\nيَا هَنَانَا بِمُحَمَّدْ ۞ ذٰلِكَ الْفَضْلُ مِنَ اللهِ',
        latin: 'Ẓaharad-dīnul-mu’ayyad biẓuhūrin-nabī Aḥmad ۞ Yā hanānā bi Muḥammad żālikal-faḍlu minallāh',
        arti: 'Telah tampak agama yang dikokohkan dengan hadirnya Nabi Ahmad. Sungguh beruntung kami dengan Nabi Muhammad.',
      },
    ],
  },
  {
    no: 23,
    judul: 'Ya Khaira Maulud',
    subKategori: 'Maulid & Pujian Nabi',
    arabTitle: 'يَا خَيْرَ مَوْلُوْدٍ',
    baits: [
      {
        arab: 'يَا خَيْرَ مَوْلُوْدٍ بِمَكَّةَ أَشْرَقَتْ ۞ أَنْوَارُهُ فِي سَائِرِ الْأَكْوَانِ',
        latin: 'Yā khaira maulūdin bi Makkata asyraqat ۞ anwāruhū fī sā’iril-akwān',
        arti: 'Wahai sebaik-baik kelahiran di Makkah yang sinarnya memancar ke seluruh alam.',
      },
    ],
  },
  {
    no: 24,
    judul: "Ya Nabi Salam 'Alaika",
    subKategori: 'Maulid & Pujian Nabi',
    arabTitle: 'يَا نَبِي سَلَامٌ عَلَيْكَ',
    baits: [
      {
        arab: 'يَا نَبِي سَلَامٌ عَلَيْكَ ۞ يَا رَسُوْلُ سَلَامٌ عَلَيْكَ\nيَا حَبِيْبُ سَلَامٌ عَلَيْكَ ۞ صَلَوَاتُ اللهِ عَلَيْكَ',
        latin: "Yā nabī salāmun ‘alaika ۞ Yā rasūlu salāmun ‘alaika\nYā ḥabību salāmun ‘alaika ۞ Ṣalawātullāhi ‘alaika",
        arti: 'Wahai Nabi salam atasmu, wahai Rasul salam atasmu, wahai Kekasih salam atasmu, shalawat Allah atasmu.',
      },
    ],
  },
  {
    no: 25,
    judul: "Ya Rasulullah Salamun 'Alaik",
    subKategori: 'Maulid & Pujian Nabi',
    arabTitle: 'يَا رَسُوْلَ اللهِ سَلَامٌ عَلَيْكَ',
    baits: [
      {
        arab: 'يَا رَسُوْلَ اللهِ سَلَامٌ عَلَيْكَ ۞ يَا رَفِيْعَ الشَّانِ وَالدَّرَجِ',
        latin: "Yā rasūlallāhi salāmun ‘alaik ۞ yā rafī‘asy-syāni wad-daraj",
        arti: 'Wahai Rasulullah salam sejahtera atasmu, wahai yang tinggi kedudukan dan derajatnya.',
      },
    ],
  },
];

export const MAULID_QASIDAH_LIST: QasidahItem[] = [
  ...SYAIR_PESANTREN_LENGKAP,
  ...MAULID_KLASIK_TAMBAHAN,
];

export const TUTORIAL_IBADAH_GROUPS = [
  { no: 1, judul: 'Bersuci', countLabel: '7 Tutorial', slug: 'bersuci' },
  { no: 2, judul: 'Shalat', countLabel: '27 Tutorial', slug: 'shalat' },
  { no: 3, judul: 'Zakat', countLabel: '10 Tutorial', slug: 'zakat' },
  { no: 4, judul: 'Puasa', countLabel: '11 Tutorial', slug: 'puasa' },
  { no: 5, judul: 'Kematian & Ziarah', countLabel: '15 Tutorial', slug: 'kematian' },
  { no: 6, judul: 'Haji', countLabel: '7 Tutorial', slug: 'haji' },
  { no: 7, judul: 'Umrah', countLabel: '5 Tutorial', slug: 'umrah' },
];

export const BERSUCI_LIST = [
  { no: 1, judul: 'Cara Menghilangkan Najis', isi: 'Membasuh bagian yang terkena najis mutawassithah hingga hilang warna, bau, dan rasanya dengan air suci menyucikan. Najis mughallazhah dibasuh 7 kali salah satunya dengan debu.' },
  { no: 2, judul: 'Cara Wudhu', isCaraWudhu: true, isi: 'Panduan lengkap berwudhu sesuai tuntunan Al-Qur’an (QS Al-Maidah: 6) dan Hadis Nabi Muhammad ﷺ.' },
  { no: 3, judul: 'Cara Tayamum', isi: 'Menggunakan debu suci yang berdebu sebagai pengganti wudhu/mandi wajib saat tidak ada air atau udzur sakit dengan mengusap wajah dan kedua tangan sampai siku.' },
  { no: 4, judul: 'Cara Mandi Besar', isi: 'Niat mandi wajib menghilangkan hadats besar dan meratakan air ke seluruh kulit, rambut, dan lipatan tubuh.' },
  { no: 5, judul: 'Cara Menyamak', isi: 'Menghilangkan sisa daging dan lendir dari kulit bangkai hewan (selain anjing dan babi) dengan bahan pengesat/penyamak agar menjadi suci.' },
  { no: 6, judul: 'Bersuci saat Mengenakan Sepatu', isi: 'Ketentuan Mashul Khuffain: mengusap punggung sepatu khuf yang suci dan menutupi mata kaki bagi mukim (1 hari 1 malam) atau musafir (3 hari 3 malam).' },
  { no: 7, judul: "Cara Beristinja' (dengan air, tisu, atau benda lainnya)", isi: 'Membersihkan qubul dan dubur dari najis setelah buang hajat dengan air suci atau menggunakan minimal 3 batu/tisu suci yang kesat sebelum najis mengering.' },
  { no: 8, judul: 'Artikel Bersuci Lainnya', isi: 'Kumpulan artikel hukum air musta’mal, najis ma’fu, dan pembagian air mutlak.' },
];

export interface ZiarahEntry {
  id: string;
  tab: 'Tokoh' | 'Destinasi';
  nama: string;
  kota: string;
  kategoriLabel: string;
  lat: number;
  lng: number;
  avatarText: string;
  lahir?: string;
  wafat?: string;
  biografi: string;
}

export const ZIARAH_ENTRIES: ZiarahEntry[] = [
  {
    id: 'zr-1',
    tab: 'Tokoh',
    nama: 'Kiai Syair',
    kota: 'Kab. Batang, Jawa Tengah',
    kategoriLabel: 'Makam Tokoh',
    lat: -6.995,
    lng: 109.765,
    avatarText: 'KS',
    lahir: 'Kab. Batang',
    wafat: 'Kab. Batang, Jawa Tengah',
    biografi: 'Ulama sepuh pejuang dakwah Islam Ahlussunnah wal Jamaah di wilayah Batang dan Pekalongan selatan.',
  },
  {
    id: 'zr-2',
    tab: 'Tokoh',
    nama: 'KH Faqih Muntaha',
    kota: 'Kab. Wonosobo, Jawa Tengah',
    kategoriLabel: 'Makam Tokoh',
    lat: -7.339,
    lng: 109.903,
    avatarText: 'FM',
    lahir: 'Wonosobo, Jawa Tengah',
    wafat: 'Kalibeber, Wonosobo',
    biografi: 'Ulama karismatik pengasuh Pondok Pesantren Al-Asy’ariyyah Kalibeber Wonosobo dan pencetak ribuan penghafal Al-Qur’an.',
  },
  {
    id: 'zr-3',
    tab: 'Tokoh',
    nama: 'KH Mohammad Najib',
    kota: 'Kab. Banjarnegara, Jawa Tengah',
    kategoriLabel: 'Makam Tokoh',
    lat: -7.397,
    lng: 109.696,
    avatarText: 'MN',
    biografi: 'Kiai penggerak dakwah pesantren dan pendidikan Nahdliyin di Banjarnegara.',
  },
  {
    id: 'zr-4',
    tab: 'Tokoh',
    nama: 'Kiai Subkhi',
    kota: 'Kab. Temanggung, Jawa Tengah',
    kategoriLabel: 'Makam Tokoh',
    lat: -7.284,
    lng: 110.108,
    avatarText: 'SB',
    biografi: 'Dijuluki Jenderal Bambu Runcing dari Parakan, ulama sepuh peniup doa bambu runcing perjuangan kemerdekaan.',
  },
  {
    id: 'zr-5',
    tab: 'Tokoh',
    nama: 'KH Dimyati Rois',
    kota: 'Kab. Kendal, Jawa Tengah',
    kategoriLabel: 'Makam Tokoh',
    lat: -6.942,
    lng: 110.251,
    avatarText: 'DR',
    biografi: 'Mustasyar PBNU dan Pengasuh Pondok Pesantren Al-Fadlu wal Fadhilah Kaliwungu Kendal.',
  },
  {
    id: 'zr-6',
    tab: 'Tokoh',
    nama: 'KH Sholeh Darat',
    kota: 'Kota Semarang, Jawa Tengah',
    kategoriLabel: 'Makam Tokoh',
    lat: -6.988,
    lng: 110.409,
    avatarText: 'SD',
    lahir: 'Kedung Jumbleng, Mayong, Kab. Jepara / Tahun 1820 M',
    wafat: 'Kota Semarang, Jawa Tengah / 28 Ramadhan 1321 H (18 Desember 1903 M)',
    biografi: 'Muhammad Sholeh bin Umar as-Samarani adalah mahaguru para ulama Nusantara termasuk KH. Hasyim Asy’ari dan KH. Ahmad Dahlan. Mengarang puluhan kitab tafsir dan fikih berbahasa Jawa Pegon.',
  },
  // DESTINASI
  {
    id: 'zd-1',
    tab: 'Destinasi',
    nama: 'Masjid Kauman Semarang',
    kota: 'Kota Semarang, Jawa Tengah',
    kategoriLabel: 'Masjid Bersejarah',
    lat: -6.9718,
    lng: 110.4232,
    avatarText: 'MK',
    biografi: 'Masjid Agung bersejarah peninggalan Kesultanan Demak–Mataram yang berdiri di alun-alun lama Semarang.',
  },
  {
    id: 'zd-2',
    tab: 'Destinasi',
    nama: 'Masjid Layur',
    kota: 'Kota Semarang, Jawa Tengah',
    kategoriLabel: 'Masjid Bersejarah',
    lat: -6.9639,
    lng: 110.4241,
    avatarText: 'ML',
    biografi: 'Masjid Menara Kampung Melayu yang dibangun tahun 1802 oleh saudagar Yaman sebagai pusat dakwah maritim.',
  },
  {
    id: 'zd-3',
    tab: 'Destinasi',
    nama: 'Masjid An-Nur Diponegoro',
    kota: 'Kota Semarang, Jawa Tengah',
    kategoriLabel: 'Masjid Bersejarah',
    lat: -6.9765,
    lng: 110.427,
    avatarText: 'AN',
    biografi: 'Masjid bersejarah peninggalan era perjuangan Pangeran Diponegoro.',
  },
  {
    id: 'zd-4',
    tab: 'Destinasi',
    nama: 'Langgar Al-Yahya',
    kota: 'Kota Semarang, Jawa Tengah',
    kategoriLabel: 'Masjid Bersejarah',
    lat: -6.9685,
    lng: 110.426,
    avatarText: 'LY',
    biografi: 'Mushalla tua bersejarah pusat majelis ilmu dan wirid kampung Arab Semarang.',
  },
  {
    id: 'zd-5',
    tab: 'Destinasi',
    nama: 'Masjid Djami Pekodjan',
    kota: 'Kota Semarang, Jawa Tengah',
    kategoriLabel: 'Masjid Bersejarah',
    lat: -6.9742,
    lng: 110.4281,
    avatarText: 'MP',
    biografi: 'Masjid kuno berarsitektur Jawa-Timur Tengah yang memiliki makam wali di halamannya.',
  },
  {
    id: 'zd-6',
    tab: 'Destinasi',
    nama: 'Museum Perkembangan Islam Jawa Tengah',
    kota: 'Kota Semarang, Jawa Tengah',
    kategoriLabel: 'Museum Islam',
    lat: -6.9835,
    lng: 110.4452,
    avatarText: 'MI',
    biografi: 'Menyimpan koleksi mushaf kuno, kitab pegon ulama Jawa, dan artefak syiar Walisongo di Masjid Agung Jawa Tengah.',
  },
];

export const ZIARAH_AMALAN_LIST = [
  'Tata Cara Ziarah Kubur',
  'Salam Saat Ziarah',
  'Tahlil Lengkap',
  'Tahlil Ringkas',
  'Surat Yasin',
  'Surat Al-Mulk',
  'Surat Al-Waqiah',
  'Surat Ar-Rahman',
  'Istighosah',
  'Hizib',
  'Asmaul Husna',
  'Doa Setelah Baca Al-Quran',
];

export const HAJI_MENU_ITEMS = [
  { title: 'Jadwal', icon: '📅', key: 'jadwal' },
  { title: 'Urutan Manasik', icon: '🧭', key: 'manasik' },
  { title: 'Doa', icon: '🤲', key: 'doa' },
  { title: 'Hikmah', icon: '✨', key: 'hikmah' },
  { title: 'Destinasi', icon: '🕌', key: 'destinasi' },
  { title: 'Berita Terkini Haji 2026', icon: '📰', key: 'berita' },
  { title: 'Tanya-Jawab', icon: '❓', key: 'faq' },
];

export const MANASIK_HAJI_STEPS = [
  {
    no: 1,
    judul: 'Bersiap dari pemondokan di Makkah',
    isi: 'Pada hari ke-8 Dzulhijjah (Hari Tarwiyah), jamaah haji disunnahkan mandi, memakai wewangian, mengenakan kain ihram, melaksanakan shalat sunnah ihram 2 rakaat di pemondokan Makkah, dan berniat ihram haji seraya bertalbiyah.',
  },
  {
    no: 2,
    judul: '8 Dzulhijjah Berangkat menuju Arafah',
    isi: 'Menuju Mina untuk bermalam (sunnah Tarwiyah) atau langsung bergerak menuju Padang Arafah sembari memperbanyak bacaan Talbiyah, dzikir, dan shalawat.',
  },
  {
    no: 3,
    judul: '9 Dzulhijjah Wukuf di Arafah',
    isi: 'Melaksanakan rukun utama haji yakni Wukuf di Padang Arafah sejak tergelincir matahari hingga terbenam matahari, mendengarkan khutbah wukuf, shalat Jamak Taqdim Qashar Zuhur-Ashar, dan memperbanyak doa mustajab.',
  },
  {
    no: 4,
    judul: 'Malam 10 Dzulhijjah Mabit / Menginap di Muzdalifah',
    isi: 'Setelah Maghrib bertolak dari Arafah menuju Muzdalifah, shalat Maghrib-Isya Jamak Takhir, bermalam (mabit), dan mengumpulkan kerikil sebanyak 7 atau 70 butir untuk melontar jumrah.',
  },
  {
    no: 5,
    judul: '10 - 13 Dzulhijjah Menginap (Mabit) di Mina',
    isi: 'Bermalam di tenda-tenda Mina selama hari-hari Tasyrik bagi jamaah yang mengambil Nafar Awal (12 Dzulhijjah) maupun Nafar Tsani (13 Dzulhijjah).',
  },
  {
    no: 6,
    judul: '10 Dzulhijjah Melontar Jumrah Aqabah',
    isi: 'Melontar 7 batu kerikil secara berurutan ke tiang Jumrah Aqabah pada tanggal 10 Dzulhijjah seraya bertakbir "Bismillahi Allahu Akbar" di setiap lemparan.',
  },
  {
    no: 7,
    judul: '10 Dzulhijjah Tahallul Awal & Tawaf Ifadhah',
    isi: 'Mencukur rambut kepala (minimal 3 helai / gundul lebih utama untuk laki-laki) untuk tahallul awal, kemudian menuju Masjidil Haram melaksanakan rukun Tawaf Ifadhah 7 putaran dan Sa’i Shafa–Marwah.',
  },
  {
    no: 8,
    judul: '11-13 Dzulhijjah Melontar 3 Jumrah: Ula, Wustha, & Aqabah',
    isi: 'Setelah tergelincir matahari pada tanggal 11, 12, dan 13 Dzulhijjah, jamaah melontar ketiga jumrah secara berurutan dimulai dari Ula (7x), Wustha (7x), dan Aqabah (7x).',
  },
];

export const RAMADHAN_LIST_ITEMS = [
  { no: 1, judul: 'Doa Menyambut Bulan Ramadhan', arab: 'اَللّٰهُمَّ بَارِكْ لَنَا فِي رَجَبَ وَشَعْبَانَ وَبَلِّغْنَا رَمَضَانَ', latin: 'Allāhumma bārik lanā fī Rajaba wa Sya‘bāna wa ballighnā Ramaḍān', arti: 'Ya Allah, berkahilah kami di bulan Rajab dan Sya’ban dan sampaikanlah usia kami ke bulan Ramadhan.' },
  { no: 2, judul: 'Niat Puasa Ramadhan Sebulan Penuh', arab: 'نَوَيْتُ صَوْمَ شَهْرِ رَمَضَانَ كُلِّهِ لِلّٰهِ تَعَالٰى', latin: 'Nawaitu ṣauma syahri Ramaḍāna kullihī lillāhi ta‘ālā', arti: 'Saya niat berpuasa sebulan penuh pada bulan Ramadhan tahun ini karena Allah Ta’ala (taqlid Imam Malik sebagai kehati-hatian).' },
  { no: 3, judul: 'Niat Puasa Ramadhan Harian', arab: 'نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هٰذِهِ السَّنَةِ لِلّٰهِ تَعَالٰى', latin: 'Nawaitu ṣauma ghadin ‘an adā’i farḍi syahri Ramaḍāna hāżihis-sanati lillāhi ta‘ālā', arti: 'Saya niat berpuasa esok hari untuk menunaikan kewajiban bulan Ramadhan tahun ini karena Allah Ta’ala.' },
  { no: 4, judul: 'Doa usai Buka Puasa', arab: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوْقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللهُ', latin: 'Żahabaẓ-ẓama’u wabtallatil-‘urūqu wa ṡabatal-ajru in syā’allāh', arti: 'Telah hilang dahaga, telah basah urat-urat, dan telah tetap pahala insya Allah.' },
  { no: 5, judul: 'Niat Shalat Tarawih', arab: 'أُصَلِّيْ سُنَّةَ التَّرَاوِيْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً مَأْمُوْمًا لِلّٰهِ تَعَالٰى', latin: 'Uṣallī sunnatat-tarāwīḥi rak‘ataini mustaqbilal-qiblati adā’an ma’mūman lillāhi ta‘ālā', arti: 'Saya niat shalat sunnah Tarawih dua rakaat sebagai makmum karena Allah Ta’ala.' },
  { no: 6, judul: 'Bacaan Bilal Tarawih & Jawabannya', arab: 'فَضْلًا مِنَ اللهِ وَنِعْمَةً — وَمَغْفِرَةً وَرَحْمَةً', latin: 'Faḍlan minallāhi wa ni‘mah — dijawab jamaah: Wa maghfiratan wa raḥmah', arti: 'Anugerah dan nikmat dari Allah — serta ampunan dan rahmat-Nya.' },
  { no: 7, judul: 'Doa Kamilin', arab: 'اَللّٰهُمَّ اجْعَلْنَا بِالْإِيْمَانِ كَامِلِيْنَ وَلِلْفَرَائِضِ مُؤَدِّيْنَ', latin: 'Allāhummaj‘alnā bil-īmāni kāmilīn wa lil-farā’iḍi mu’addīn...', arti: 'Ya Allah, jadikanlah kami orang-orang yang sempurna imannya dan menunaikan kewajiban.' },
  { no: 8, judul: 'Niat Shalat Witir', arab: 'أُصَلِّيْ سُنَّةَ الْوِتْرِ رَكْعَتَيْنِ / رَكْعَةً لِلّٰهِ تَعَالٰى', latin: 'Uṣallī sunnatal-witri rak‘ataini / rak‘atan lillāhi ta‘ālā', arti: 'Saya niat shalat sunnah Witir karena Allah Ta’ala.' },
  { no: 9, judul: 'Wirid & Doa Bakda Witir', arab: 'سُبْحَانَ الْمَلِكِ الْقُدُّوْسِ (٣×) رَبِّ الْمَلَائِكَةِ وَالرُّوْحِ', latin: 'Subḥānal-malikil-quddūs (3x) rabbil-malā’ikati war-rūḥ', arti: 'Maha Suci Dzat Yang Merajai lagi Maha Suci, Tuhan para malaikat dan Jibril.' },
  { no: 10, judul: 'Doa ketika Sahur', arab: 'يَرْحَمُ اللهُ الْمُتَسَحِّرِيْنَ — اَللّٰهُمَّ بَارِكْ لَنَا فِي سُحُوْرِنَا', latin: 'Yarḥamullāhul-mutasaḥḥirīn — Semoga Allah merahmati orang-orang yang bersahur.', arti: 'Makan sahur itu penuh berkah, maka jangan tinggalkan walau hanya meneguk air.' },
  { no: 11, judul: 'Bacaan Malam Lailatul Qadar', arab: 'اَللّٰهُمَّ إِنَّكَ عَفُوٌّ كَرِيْمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', latin: 'Allāhumma innaka ‘afuwwun karīm tuḥibbul-‘afwa fa‘fu ‘annī', arti: 'Ya Allah, sesungguhnya Engkau Maha Pemaaf lagi Maha Mulia, Engkau mencintai pemaafan maka maafkanlah aku.' },
  { no: 12, judul: 'Niat Zakat Fitrah', arab: 'نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ الْفِطْرِ عَنْ نَفْسِيْ فَرْضًا لِلّٰهِ تَعَالٰى', latin: 'Nawaitu an ukhrija zakātal-fiṭri ‘an nafsī farḍan lillāhi ta‘ālā', arti: 'Saya niat mengeluarkan zakat fitrah atas diri saya sendiri fardhu karena Allah Ta’ala.' },
];

export const ZAKAT_TYPES = [
  { id: 'pertanian', title: 'Zakat Pertanian Tanaman Pangan', emoji: '🌾' },
  { id: 'perdagangan', title: 'Zakat Perdagangan', emoji: '🏪' },
  { id: 'emas', title: 'Zakat Simpanan Emas, Perak, dan Perhiasan', emoji: '🪙' },
  { id: 'tambak', title: 'Zakat Tambak', emoji: '🦐' },
  { id: 'produktif', title: 'Zakat Tanaman Produktif', emoji: '🌶️' },
  { id: 'peternakan', title: 'Zakat Peternakan', emoji: '🐔' },
  { id: 'perusahaan', title: 'Zakat Perusahaan', emoji: '💼' },
  { id: 'properti', title: 'Zakat Properti', emoji: '🏢' },
  { id: 'profesi', title: 'Zakat Profesi', emoji: '👨‍⚕️' },
] as const;

// KALKULATOR WARIS (MAWARIS)
export interface HeirDef {
  id: string;
  genderTab: 'laki' | 'perempuan';
  nama: string;
  arab: string;
  multiCount: boolean;
  hideWhenMayitGender?: 'L' | 'P';
}

export const WARIS_HEIRS_LIST: HeirDef[] = [
  // LAKI-LAKI (16 standar kitab faraidh)
  { id: 'suami', genderTab: 'laki', nama: 'Suami', arab: 'الزوج', multiCount: false, hideWhenMayitGender: 'L' },
  { id: 'anak_lk', genderTab: 'laki', nama: 'Anak lelaki', arab: 'الابن', multiCount: true },
  { id: 'cucu_lk', genderTab: 'laki', nama: 'Cucu lelaki dari anak laki-laki', arab: 'ابن الإبن', multiCount: true },
  { id: 'cicit_lk', genderTab: 'laki', nama: 'Cicit laki-laki dari jalur laki-laki', arab: 'ابن ابن ابن', multiCount: true },
  { id: 'ayah', genderTab: 'laki', nama: 'Ayah', arab: 'الأب', multiCount: false },
  { id: 'kakek', genderTab: 'laki', nama: 'Kakek dari ayah', arab: 'الجد', multiCount: false },
  { id: 'sdr_lk_kandung', genderTab: 'laki', nama: 'Saudara laki-laki sekandung', arab: 'الأخ الشقيق', multiCount: true },
  { id: 'sdr_lk_seayah', genderTab: 'laki', nama: 'Saudara laki-laki seayah', arab: 'الأخ لأب', multiCount: true },
  { id: 'sdr_lk_seibu', genderTab: 'laki', nama: 'Saudara laki-laki seibu', arab: 'الأخ لأم', multiCount: true },
  { id: 'keponakan_kandung', genderTab: 'laki', nama: 'Anak laki-laki saudara sekandung', arab: 'ابن الأخ الشقيق', multiCount: true },
  { id: 'keponakan_seayah', genderTab: 'laki', nama: 'Anak laki-laki saudara seayah', arab: 'ابن الأخ لأب', multiCount: true },
  { id: 'paman_kandung', genderTab: 'laki', nama: 'Paman sekandung (dari ayah)', arab: 'العم الشقيق', multiCount: true },
  { id: 'paman_seayah', genderTab: 'laki', nama: 'Paman seayah', arab: 'العم لأب', multiCount: true },
  { id: 'sepupu_kandung', genderTab: 'laki', nama: 'Anak laki-laki paman sekandung', arab: 'ابن العم الشقيق', multiCount: true },
  { id: 'sepupu_seayah', genderTab: 'laki', nama: 'Anak laki-laki paman seayah', arab: 'ابن العم لأب', multiCount: true },
  // PEREMPUAN
  { id: 'istri', genderTab: 'perempuan', nama: 'Istri', arab: 'الزوجة', multiCount: true, hideWhenMayitGender: 'P' },
  { id: 'anak_pr', genderTab: 'perempuan', nama: 'Anak perempuan', arab: 'البنت', multiCount: true },
  { id: 'cucu_pr', genderTab: 'perempuan', nama: 'Cucu perempuan dari anak laki-laki', arab: 'بنت الإبن', multiCount: true },
  { id: 'ibu', genderTab: 'perempuan', nama: 'Ibu', arab: 'الأم', multiCount: false },
  { id: 'nenek_ibu', genderTab: 'perempuan', nama: 'Nenek dari jalur ibu', arab: 'الجدة لأم', multiCount: false },
  { id: 'nenek_ayah', genderTab: 'perempuan', nama: 'Nenek dari jalur ayah', arab: 'الجدة لأب', multiCount: false },
  { id: 'sdr_pr_kandung', genderTab: 'perempuan', nama: 'Saudara perempuan sekandung', arab: 'الأخت الشقيقة', multiCount: true },
  { id: 'sdr_pr_seayah', genderTab: 'perempuan', nama: 'Saudara perempuan seayah', arab: 'الأخت لأب', multiCount: true },
  { id: 'sdr_pr_seibu', genderTab: 'perempuan', nama: 'Saudara perempuan seibu', arab: 'الأخت لأم', multiCount: true },
];

export interface WarisShareRow {
  id: string;
  label: string;
  arab: string;
  count: number;
  furudh: string;
  numerator: number;
  denominator: number;
  siham: number;
  nominalRp: number;
}

export interface WarisBlockedRow {
  label: string;
  arab: string;
  count: number;
  reason: string;
}

export interface WarisCalcOutput {
  amAwal: number;
  amAkhir: number;
  statusRaddAul: string;
  inkisar: string;
  shares: WarisShareRow[];
  blocked: WarisBlockedRow[];
  penjelasan: string[];
}

export function calculateFaraidhMawaris(
  mayit: 'L' | 'P',
  counts: Record<string, number>,
  totalHarta: number
): WarisCalcOutput {
  const c = (id: string) => Math.max(0, counts[id] || 0);
  const blocked: WarisBlockedRow[] = [];
  const explanations: string[] = [];

  const hasAnakLk = c('anak_lk') > 0;
  const hasCucuLk = c('cucu_lk') > 0 && !hasAnakLk;
  const hasCicitLk = c('cicit_lk') > 0 && !hasAnakLk && c('cucu_lk') === 0;
  const hasFaruLk = hasAnakLk || c('cucu_lk') > 0 || c('cicit_lk') > 0;
  const hasFaruPr = c('anak_pr') > 0 || c('cucu_pr') > 0;
  const hasFaru = hasFaruLk || hasFaruPr;
  const hasAyah = c('ayah') > 0;
  const hasKakek = c('kakek') > 0 && !hasAyah;
  const hasAslLk = hasAyah || hasKakek;
  const totalSdr =
    c('sdr_lk_kandung') +
    c('sdr_lk_seayah') +
    c('sdr_lk_seibu') +
    c('sdr_pr_kandung') +
    c('sdr_pr_seayah') +
    c('sdr_pr_seibu');

  const blockIf = (id: string, cond: boolean, reason: string) => {
    const qty = c(id);
    if (qty > 0 && cond) {
      const def = WARIS_HEIRS_LIST.find((h) => h.id === id);
      if (def) {
        blocked.push({ label: `${qty} ${def.nama}`, arab: def.arab, count: qty, reason });
      }
      return true;
    }
    return false;
  };

  // Hijab rules (Syafi'iyah Mawarits Mu'tamad)
  blockIf('cucu_lk', hasAnakLk, 'Karena ada Anak lelaki (الابن)');
  blockIf('cicit_lk', hasAnakLk || c('cucu_lk') > 0, hasAnakLk ? 'Karena ada Anak lelaki (الابن)' : 'Karena ada Cucu lelaki (ابن الإبن)');
  blockIf('kakek', hasAyah, 'Karena ada Ayah (الأب)');
  blockIf('nenek_ibu', c('ibu') > 0, 'Karena ada Ibu (الأم)');
  blockIf('nenek_ayah', c('ibu') > 0 || hasAyah, c('ibu') > 0 ? 'Karena ada Ibu (الأم)' : 'Karena ada Ayah (الأب)');

  const hijabSdrKandung = hasAnakLk || c('cucu_lk') > 0 || hasAyah;
  const reasonSdr = hasAnakLk ? 'Karena ada Anak lelaki (الابن)' : c('cucu_lk') > 0 ? 'Karena ada Cucu lelaki (ابن الإبن)' : 'Karena ada Ayah (الأب)';
  blockIf('sdr_lk_kandung', hijabSdrKandung, reasonSdr);

  const hijabSdrSeayah = hijabSdrKandung || c('sdr_lk_kandung') > 0;
  blockIf('sdr_lk_seayah', hijabSdrSeayah, c('sdr_lk_kandung') > 0 ? 'Karena ada Saudara lk sekandung (الأخ الشقيق)' : reasonSdr);

  const hijabSdrSeibu = hasFaru || hasAslLk;
  blockIf('sdr_lk_seibu', hijabSdrSeibu, hasAnakLk ? 'Karena ada Anak lelaki (الابن)' : hasFaru ? 'Karena ada Keturunan (الفرع الوارث)' : 'Karena ada Ayah/Kakek');
  blockIf('sdr_pr_seibu', hijabSdrSeibu, hasAnakLk ? 'Karena ada Anak lelaki (الابن)' : hasFaru ? 'Karena ada Keturunan (الفرع الوارث)' : 'Karena ada Ayah/Kakek');

  // Cucu perempuan blocked by >=2 Anak perempuan unless there is Cucu laki
  blockIf(
    'cucu_pr',
    hasAnakLk || (c('anak_pr') >= 2 && c('cucu_lk') === 0),
    hasAnakLk ? 'Karena ada Anak lelaki (الابن)' : 'Karena terpenuhi 2/3 oleh >= 2 Anak perempuan'
  );
  blockIf('sdr_pr_kandung', hijabSdrKandung, reasonSdr);
  blockIf('sdr_pr_seayah', hijabSdrSeayah || c('sdr_pr_kandung') >= 2 && c('sdr_lk_seayah') === 0, 'Terhijab oleh ahli waris lebih dekat');

  // Ashabah lanjutan blocked by closer males
  const hasCloserAsabah = hasFaruLk || hasAslLk || c('sdr_lk_kandung') > 0 || c('sdr_lk_seayah') > 0;
  blockIf('keponakan_kandung', hasCloserAsabah, 'Terhijab oleh ahli waris laki-laki lebih dekat');
  blockIf('keponakan_seayah', hasCloserAsabah || c('keponakan_kandung') > 0, 'Terhijab oleh ahli waris laki-laki lebih dekat');
  blockIf('paman_kandung', hasCloserAsabah || c('keponakan_kandung') > 0 || c('keponakan_seayah') > 0, 'Terhijab oleh keturunan/saudara');
  blockIf('paman_seayah', hasCloserAsabah || c('keponakan_kandung') > 0 || c('keponakan_seayah') > 0 || c('paman_kandung') > 0, 'Terhijab oleh ahli waris lebih dekat');
  blockIf('sepupu_kandung', hasCloserAsabah || c('keponakan_kandung') > 0 || c('keponakan_seayah') > 0 || c('paman_kandung') > 0 || c('paman_seayah') > 0, 'Terhijab oleh ahli waris lebih dekat');
  blockIf('sepupu_seayah', hasCloserAsabah || c('keponakan_kandung') > 0 || c('keponakan_seayah') > 0 || c('paman_kandung') > 0 || c('paman_seayah') > 0 || c('sepupu_kandung') > 0, 'Terhijab oleh ahli waris lebih dekat');

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

  interface RawShare {
    id: string;
    nama: string;
    arab: string;
    count: number;
    num: number; // fraction numerator (if furudh)
    den: number;
    furudhLabel: string;
    isAsabah?: boolean;
    asabahWeight?: number; // e.g. male=2, female=1
  }

  const fixedShares: RawShare[] = [];

  if (mayit === 'P' && c('suami') > 0) {
    const den = hasFaru ? 4 : 2;
    fixedShares.push({ id: 'suami', nama: 'Suami', arab: 'الزوج', count: 1, num: 1, den, furudhLabel: `1/${den}` });
    explanations.push(`Suami mendapat bagian ${hasFaru ? '1/4' : '1/2'} karena mayit ${hasFaru ? 'memiliki' : 'tidak memiliki'} keturunan (far'u waris).`);
  }
  if (mayit === 'L' && c('istri') > 0) {
    const den = hasFaru ? 8 : 4;
    fixedShares.push({ id: 'istri', nama: 'Istri', arab: 'الزوجة', count: c('istri'), num: 1, den, furudhLabel: `1/${den}` });
    explanations.push(`Istri (${c('istri')}) berserikat pada bagian ${hasFaru ? '1/8' : '1/4'} karena mayit ${hasFaru ? 'memiliki' : 'tidak memiliki'} keturunan.`);
  }
  if (c('ibu') > 0) {
    const sixth = hasFaru || totalSdr >= 2;
    const den = sixth ? 6 : 3;
    fixedShares.push({ id: 'ibu', nama: 'Ibu', arab: 'الأم', count: 1, num: 1, den, furudhLabel: `1/${den}` });
    explanations.push(`Ibu mendapat bagian 1/${den}.`);
  }
  if (hasAyah) {
    if (hasFaruLk) {
      fixedShares.push({ id: 'ayah', nama: 'Ayah', arab: 'الأب', count: 1, num: 1, den: 6, furudhLabel: '1/6' });
      explanations.push('Ayah mendapat 1/6 secara fardh karena terdapat keturunan laki-laki.');
    } else if (hasFaruPr) {
      fixedShares.push({ id: 'ayah', nama: 'Ayah', arab: 'الأب', count: 1, num: 1, den: 6, furudhLabel: '1/6 + Sisa', isAsabah: true, asabahWeight: 1 });
    } else {
      fixedShares.push({ id: 'ayah', nama: 'Ayah', arab: 'الأب', count: 1, num: 0, den: 1, furudhLabel: 'Sisa', isAsabah: true, asabahWeight: 1 });
    }
  } else if (hasKakek && c('kakek') > 0) {
    if (hasFaruLk) {
      fixedShares.push({ id: 'kakek', nama: 'Kakek dari ayah', arab: 'الجد', count: 1, num: 1, den: 6, furudhLabel: '1/6' });
    } else {
      fixedShares.push({ id: 'kakek', nama: 'Kakek dari ayah', arab: 'الجد', count: 1, num: 0, den: 1, furudhLabel: 'Sisa', isAsabah: true, asabahWeight: 1 });
    }
  }

  // Anak perempuan (if no Anak Lk -> Furudh 1/2 or 2/3, else Asabah 2:1)
  if (hasAnakLk) {
    fixedShares.push({ id: 'anak_lk', nama: 'Anak lelaki', arab: 'الابن', count: c('anak_lk'), num: 0, den: 1, furudhLabel: 'Sisa', isAsabah: true, asabahWeight: 2 * c('anak_lk') });
    if (c('anak_pr') > 0) {
      fixedShares.push({ id: 'anak_pr', nama: 'Anak perempuan', arab: 'البنت', count: c('anak_pr'), num: 0, den: 1, furudhLabel: 'Sisa (bil Ghair)', isAsabah: true, asabahWeight: 1 * c('anak_pr') });
    }
    explanations.push('Anak laki-laki menjadi ashabah bin-nafsi menghabiskan sisa harta waris' + (c('anak_pr') > 0 ? ' bersama Anak perempuan dengan perbandingan 2:1.' : '.'));
  } else if (c('anak_pr') > 0) {
    const isOne = c('anak_pr') === 1;
    fixedShares.push({ id: 'anak_pr', nama: 'Anak perempuan', arab: 'البنت', count: c('anak_pr'), num: isOne ? 1 : 2, den: isOne ? 2 : 3, furudhLabel: isOne ? '1/2' : '2/3' });
  }

  // Cucu laki jika tidak ada anak lk
  if (hasCucuLk) {
    fixedShares.push({ id: 'cucu_lk', nama: 'Cucu lelaki dari anak laki-laki', arab: 'ابن الإبن', count: c('cucu_lk'), num: 0, den: 1, furudhLabel: 'Sisa', isAsabah: true, asabahWeight: 2 * c('cucu_lk') });
    if (c('cucu_pr') > 0) {
      fixedShares.push({ id: 'cucu_pr', nama: 'Cucu perempuan dari anak laki-laki', arab: 'بنت الإبن', count: c('cucu_pr'), num: 0, den: 1, furudhLabel: 'Sisa (bil Ghair)', isAsabah: true, asabahWeight: 1 * c('cucu_pr') });
    }
  } else if (c('cucu_pr') > 0 && !hasAnakLk && c('anak_pr') < 2) {
    if (c('anak_pr') === 1) {
      fixedShares.push({ id: 'cucu_pr', nama: 'Cucu perempuan', arab: 'بنت الإبن', count: c('cucu_pr'), num: 1, den: 6, furudhLabel: '1/6' });
    } else {
      const isOne = c('cucu_pr') === 1;
      fixedShares.push({ id: 'cucu_pr', nama: 'Cucu perempuan', arab: 'بنت الإبن', count: c('cucu_pr'), num: isOne ? 1 : 2, den: isOne ? 2 : 3, furudhLabel: isOne ? '1/2' : '2/3' });
    }
  }

  // Nenek jika tidak terhijab
  if (c('ibu') === 0 && (c('nenek_ibu') > 0 || (c('nenek_ayah') > 0 && !hasAyah))) {
    const qty = (c('nenek_ibu') > 0 ? 1 : 0) + (c('nenek_ayah') > 0 && !hasAyah ? 1 : 0);
    fixedShares.push({ id: 'nenek', nama: 'Nenek', arab: 'الجدة', count: qty, num: 1, den: 6, furudhLabel: '1/6' });
  }

  // Saudara seibu jika tidak terhijab
  if (!hijabSdrSeibu && (c('sdr_lk_seibu') > 0 || c('sdr_pr_seibu') > 0)) {
    const qty = c('sdr_lk_seibu') + c('sdr_pr_seibu');
    fixedShares.push({ id: 'sdr_seibu', nama: 'Saudara seibu', arab: 'الإخوة لأم', count: qty, num: 1, den: qty > 1 ? 3 : 6, furudhLabel: qty > 1 ? '1/3' : '1/6' });
  }

  // Saudara sekandung jika tidak terhijab
  if (!hijabSdrKandung && !hasAsabahAlready(fixedShares) && (c('sdr_lk_kandung') > 0 || c('sdr_pr_kandung') > 0)) {
    if (c('sdr_lk_kandung') > 0) {
      fixedShares.push({ id: 'sdr_lk_kandung', nama: 'Saudara laki-laki sekandung', arab: 'الأخ الشقيق', count: c('sdr_lk_kandung'), num: 0, den: 1, furudhLabel: 'Sisa', isAsabah: true, asabahWeight: 2 * c('sdr_lk_kandung') });
      if (c('sdr_pr_kandung') > 0) {
        fixedShares.push({ id: 'sdr_pr_kandung', nama: 'Saudara perempuan sekandung', arab: 'الأخت الشقيقة', count: c('sdr_pr_kandung'), num: 0, den: 1, furudhLabel: 'Sisa', isAsabah: true, asabahWeight: c('sdr_pr_kandung') });
      }
    } else if (c('sdr_pr_kandung') > 0) {
      const isOne = c('sdr_pr_kandung') === 1;
      fixedShares.push({ id: 'sdr_pr_kandung', nama: 'Saudara perempuan sekandung', arab: 'الأخت الشقيقة', count: c('sdr_pr_kandung'), num: isOne ? 1 : 2, den: isOne ? 2 : 3, furudhLabel: isOne ? '1/2' : '2/3' });
    }
  }

  function hasAsabahAlready(list: RawShare[]) {
    return list.some((s) => s.isAsabah && s.num === 0);
  }

  // Fallback general asabah (Cicit, Sdr Seayah, Keponakan, Paman, Sepupu)
  if (!fixedShares.some((s) => s.isAsabah)) {
    if (hasCicitLk) {
      fixedShares.push({ id: 'cicit_lk', nama: 'Cicit laki-laki dari jalur laki-laki', arab: 'ابن ابن ابن', count: c('cicit_lk'), num: 0, den: 1, furudhLabel: 'Sisa', isAsabah: true, asabahWeight: c('cicit_lk') });
    } else if (!hijabSdrSeayah && c('sdr_lk_seayah') > 0) {
      fixedShares.push({ id: 'sdr_lk_seayah', nama: 'Saudara laki-laki seayah', arab: 'الأخ لأب', count: c('sdr_lk_seayah'), num: 0, den: 1, furudhLabel: 'Sisa', isAsabah: true, asabahWeight: c('sdr_lk_seayah') });
    } else if (!hasCloserAsabah) {
      const fallbackOrder: Array<[string, string, string]> = [
        ['keponakan_kandung', 'Anak laki-laki saudara sekandung', 'ابن الأخ الشقيق'],
        ['keponakan_seayah', 'Anak laki-laki saudara seayah', 'ابن الأخ لأب'],
        ['paman_kandung', 'Paman sekandung', 'العم الشقيق'],
        ['paman_seayah', 'Paman seayah', 'العم لأب'],
        ['sepupu_kandung', 'Anak laki-laki paman sekandung', 'ابن العم الشقيق'],
        ['sepupu_seayah', 'Anak laki-laki paman seayah', 'ابن العم لأب'],
      ];
      for (const [fId, fName, fArab] of fallbackOrder) {
        if (c(fId) > 0) {
          fixedShares.push({ id: fId, nama: fName, arab: fArab, count: c(fId), num: 0, den: 1, furudhLabel: 'Sisa', isAsabah: true, asabahWeight: c(fId) });
          break;
        }
      }
    }
  }

  let amAwal = 1;
  fixedShares.forEach((s) => {
    if (s.den > 1) amAwal = lcm(amAwal, s.den);
  });

  const sihamMap: Record<string, number> = {};
  let fixedUsed = 0;
  fixedShares.forEach((s) => {
    const baseSiham = s.num > 0 ? (amAwal / s.den) * s.num : 0;
    sihamMap[s.id] = baseSiham;
    fixedUsed += baseSiham;
  });

  let statusRaddAul = 'Tidak Ada';
  let amAkhir = amAwal;
  const remainder = amAwal - fixedUsed;

  const asabahHeirs = fixedShares.filter((s) => s.isAsabah);
  if (remainder > 0 && asabahHeirs.length > 0) {
    const totalWeight = asabahHeirs.reduce((acc, s) => acc + (s.asabahWeight || s.count), 0);
    if (remainder % totalWeight === 0) {
      asabahHeirs.forEach((s) => {
        sihamMap[s.id] += (remainder / totalWeight) * (s.asabahWeight || s.count);
      });
    } else {
      // Scale AM by totalWeight to eliminate inkisar/remainder fraction cleanly
      const mult = totalWeight / gcd(remainder, totalWeight);
      amAkhir = amAwal * mult;
      fixedShares.forEach((s) => {
        sihamMap[s.id] = sihamMap[s.id] * mult;
      });
      const scaledRem = amAkhir - fixedUsed * mult;
      asabahHeirs.forEach((s) => {
        sihamMap[s.id] += (scaledRem / totalWeight) * (s.asabahWeight || s.count);
      });
    }
  } else if (remainder < 0) {
    amAkhir = fixedUsed;
    statusRaddAul = `Aul (${amAwal} → ${amAkhir})`;
    explanations.push(`Terjadi 'Aul karena total pembilang fardh melebihi Asal Masalah awal (${amAwal} menjadi ${amAkhir}).`);
  } else if (remainder > 0 && asabahHeirs.length === 0) {
    // Radd to non-spouse furudh heirs
    const raddCandidates = fixedShares.filter((s) => s.id !== 'suami' && s.id !== 'istri');
    if (raddCandidates.length > 0) {
      statusRaddAul = 'Radd';
      const nonSpouseSiham = raddCandidates.reduce((acc, s) => acc + sihamMap[s.id], 0);
      const mult = nonSpouseSiham;
      amAkhir = amAwal * mult;
      fixedShares.forEach((s) => {
        sihamMap[s.id] = sihamMap[s.id] * mult;
      });
      const raddTotal = remainder * mult;
      raddCandidates.forEach((s) => {
        const sharePart = sihamMap[s.id] / mult;
        sihamMap[s.id] += (raddTotal * sharePart) / nonSpouseSiham;
      });
      explanations.push('Terjadi Radd karena terdapat sisa harta sementara tidak ada ahli waris ashabah.');
    }
  }

  const shares: WarisShareRow[] = fixedShares.map((s) => {
    const sh = Math.round(sihamMap[s.id] * 100) / 100;
    const nom = amAkhir > 0 ? Math.round((sh / amAkhir) * totalHarta) : 0;
    return {
      id: s.id,
      label: `${s.count} ${s.nama}`,
      arab: s.arab,
      count: s.count,
      furudh: s.furudhLabel,
      numerator: s.num,
      denominator: s.den,
      siham: sh,
      nominalRp: nom,
    };
  });

  return {
    amAwal,
    amAkhir,
    statusRaddAul,
    inkisar: 'Tidak Ada',
    shares,
    blocked,
    penjelasan: explanations.length > 0 ? explanations : ['Pembagian harta waris mengacu pada ketentuan Ilmu Faraidh Mazhab Syafi’i (Kitab Rahbiyah & Kifayatul Akhyar).'],
  };
}
