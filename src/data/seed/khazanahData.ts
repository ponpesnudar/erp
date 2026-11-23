export type KhazanahCategory =
  | 'Wirid & Doa'
  | 'Tahlil & Yasin'
  | 'Maulid & Qasidah'
  | 'Tutorial Ibadah'
  | 'Ziarah'
  | 'Haji & Umrah'
  | 'Ramadhan'
  | 'Kalam & Infografik';

export interface KhazanahItem {
  id: string;
  kategori: KhazanahCategory;
  subKategori: string;
  judul: string;
  subjudul?: string;
  teksArab?: string;
  latin?: string;
  terjemah?: string;
  isiLengkap: string;
  lokasi?: string;
  jarakKm?: string;
  urutan?: number;
  gambarUrl?: string;
  sumber?: string;
  ditambahkanOleh?: string;
  tanggalUpdate: string;
}

export interface SurahRingkas {
  nomor: number;
  namaLatin: string;
  namaArab: string;
  arti: string;
  jumlahAyat: number;
  turun: 'Makkiyah' | 'Madaniyah';
  juz: number;
  ayatContoh?: { nomor: number; arab: string; latin: string; arti: string }[];
}

export const SURAH_ALQURAN_LIST: SurahRingkas[] = [
  {
    nomor: 1,
    namaLatin: 'Al-Fātiḥah',
    namaArab: 'سُورَةُ الْفَاتِحَةِ',
    arti: 'Pembuka',
    jumlahAyat: 7,
    turun: 'Makkiyah',
    juz: 1,
    ayatContoh: [
      { nomor: 1, arab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ', latin: 'Bismillāhir-raḥmānir-raḥīm', arti: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.' },
      { nomor: 2, arab: 'اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ', latin: 'Al-ḥamdu lillāhi rabbil-‘ālamīn', arti: 'Segala puji bagi Allah, Tuhan seluruh alam,' },
      { nomor: 3, arab: 'الرَّحْمٰنِ الرَّحِيْمِ', latin: 'Ar-raḥmānir-raḥīm', arti: 'Yang Maha Pengasih, Maha Penyayang,' },
      { nomor: 4, arab: 'مٰلِكِ يَوْمِ الدِّيْنِ', latin: 'Māliki yaumid-dīn', arti: 'Pemilik hari pembalasan.' },
      { nomor: 5, arab: 'اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِيْنُ', latin: 'Iyyāka na‘budu wa iyyāka nasta‘īn', arti: 'Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan.' },
      { nomor: 6, arab: 'اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيْمَ', latin: 'Ihdinaṣ-ṣirāṭal-mustaqīm', arti: 'Tunjukilah kami jalan yang lurus,' },
      { nomor: 7, arab: 'صِرَاطَ الَّذِيْنَ اَنْعَمْتَ عَلَيْهِمْ ۙ غَيْرِ الْمَغْضُوْبِ عَلَيْهِمْ وَلَا الضَّاۤلِّيْنَ', latin: 'Ṣirāṭallażīna an‘amta ‘alaihim gairil-magḍūbi ‘alaihim wa laḍ-ḍāllīn', arti: '(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.' },
    ],
  },
  { nomor: 2, namaLatin: 'Al-Baqarah', namaArab: 'سُورَةُ الْبَقَرَةِ', arti: 'Sapi', jumlahAyat: 286, turun: 'Madaniyah', juz: 1 },
  { nomor: 3, namaLatin: 'Āli ‘Imrān', namaArab: 'سُورَةُ آلِ عِمْرَانَ', arti: 'Keluarga Imran', jumlahAyat: 200, turun: 'Madaniyah', juz: 3 },
  { nomor: 4, namaLatin: "An-Nisā'", namaArab: 'سُورَةُ النِّسَاءِ', arti: 'Perempuan', jumlahAyat: 176, turun: 'Madaniyah', juz: 4 },
  { nomor: 5, namaLatin: "Al-Mā'idah", namaArab: 'سُورَةُ الْمَائِدَةِ', arti: 'Hidangan', jumlahAyat: 120, turun: 'Madaniyah', juz: 6 },
  { nomor: 6, namaLatin: 'Al-An‘ām', namaArab: 'سُورَةُ الْأَنْعَامِ', arti: 'Binatang Ternak', jumlahAyat: 165, turun: 'Makkiyah', juz: 7 },
  { nomor: 7, namaLatin: 'Al-A‘rāf', namaArab: 'سُورَةُ الْأَعْرَافِ', arti: 'Tempat Tertinggi', jumlahAyat: 206, turun: 'Makkiyah', juz: 8 },
  { nomor: 8, namaLatin: 'Al-Anfāl', namaArab: 'سُورَةُ الْأَنْفَالِ', arti: 'Rampasan Perang', jumlahAyat: 75, turun: 'Madaniyah', juz: 9 },
  { nomor: 9, namaLatin: 'At-Taubah', namaArab: 'سُورَةُ التَّوْبَةِ', arti: 'Pengampunan', jumlahAyat: 129, turun: 'Madaniyah', juz: 10 },
  { nomor: 10, namaLatin: 'Yūnus', namaArab: 'سُورَةُ يُونُسَ', arti: 'Yunus', jumlahAyat: 109, turun: 'Makkiyah', juz: 11 },
  { nomor: 11, namaLatin: 'Hūd', namaArab: 'سُورَةُ هُودٍ', arti: 'Hud', jumlahAyat: 123, turun: 'Makkiyah', juz: 11 },
  { nomor: 12, namaLatin: 'Yūsuf', namaArab: 'سُورَةُ يُوسُفَ', arti: 'Yusuf', jumlahAyat: 111, turun: 'Makkiyah', juz: 12 },
  { nomor: 13, namaLatin: 'Ar-Ra‘d', namaArab: 'سُورَةُ الرَّعْدِ', arti: 'Guruh', jumlahAyat: 43, turun: 'Madaniyah', juz: 13 },
  { nomor: 14, namaLatin: 'Ibrāhīm', namaArab: 'سُورَةُ إِبْرَاهِيمَ', arti: 'Ibrahim', jumlahAyat: 52, turun: 'Makkiyah', juz: 13 },
  { nomor: 15, namaLatin: 'Al-Ḥijr', namaArab: 'سُورَةُ الْحِجْرِ', arti: 'Al-Hijr', jumlahAyat: 99, turun: 'Makkiyah', juz: 14 },
  { nomor: 16, namaLatin: 'An-Naḥl', namaArab: 'سُورَةُ النَّحْلِ', arti: 'Lebah', jumlahAyat: 128, turun: 'Makkiyah', juz: 14 },
  { nomor: 17, namaLatin: "Al-Isrā'", namaArab: 'سُورَةُ الْإِسْرَاءِ', arti: 'Memperjalankan Malam Hari', jumlahAyat: 111, turun: 'Makkiyah', juz: 15 },
  { nomor: 18, namaLatin: 'Al-Kahf', namaArab: 'سُورَةُ الْكَهْفِ', arti: 'Gua', jumlahAyat: 110, turun: 'Makkiyah', juz: 15 },
  { nomor: 19, namaLatin: 'Maryam', namaArab: 'سُورَةُ مَرْيَمَ', arti: 'Maryam', jumlahAyat: 98, turun: 'Makkiyah', juz: 16 },
  { nomor: 20, namaLatin: 'Ṭāhā', namaArab: 'سُورَةُ طٰهٰ', arti: 'Taha', jumlahAyat: 135, turun: 'Makkiyah', juz: 16 },
  { nomor: 21, namaLatin: "Al-Anbiyā'", namaArab: 'سُورَةُ الْأَنْبِيَاءِ', arti: 'Para Nabi', jumlahAyat: 112, turun: 'Makkiyah', juz: 17 },
  { nomor: 22, namaLatin: 'Al-Ḥajj', namaArab: 'سُورَةُ الْحَجِّ', arti: 'Haji', jumlahAyat: 78, turun: 'Madaniyah', juz: 17 },
  { nomor: 23, namaLatin: "Al-Mu'minūn", namaArab: 'سُورَةُ الْمُؤْمِنُونَ', arti: 'Orang-Orang Mukmin', jumlahAyat: 118, turun: 'Makkiyah', juz: 18 },
  { nomor: 24, namaLatin: 'An-Nūr', namaArab: 'سُورَةُ النُّورِ', arti: 'Cahaya', jumlahAyat: 64, turun: 'Madaniyah', juz: 18 },
  { nomor: 25, namaLatin: 'Al-Furqān', namaArab: 'سُورَةُ الْفُرْقَانِ', arti: 'Pembeda', jumlahAyat: 77, turun: 'Makkiyah', juz: 18 },
  { nomor: 26, namaLatin: "Asy-Syu‘arā'", namaArab: 'سُورَةُ الشُّعَرَاءِ', arti: 'Para Penyair', jumlahAyat: 227, turun: 'Makkiyah', juz: 19 },
  { nomor: 27, namaLatin: 'An-Naml', namaArab: 'سُورَةُ النَّمْلِ', arti: 'Semut', jumlahAyat: 93, turun: 'Makkiyah', juz: 19 },
  { nomor: 28, namaLatin: 'Al-Qaṣaṣ', namaArab: 'سُورَةُ الْقَصَصِ', arti: 'Kisah-Kisah', jumlahAyat: 88, turun: 'Makkiyah', juz: 20 },
  { nomor: 29, namaLatin: 'Al-‘Ankabūt', namaArab: 'سُورَةُ الْعَنْكَبُوتِ', arti: 'Laba-Laba', jumlahAyat: 69, turun: 'Makkiyah', juz: 20 },
  { nomor: 30, namaLatin: 'Ar-Rūm', namaArab: 'سُورَةُ الرُّومِ', arti: 'Romawi', jumlahAyat: 60, turun: 'Makkiyah', juz: 21 },
  { nomor: 31, namaLatin: 'Luqmān', namaArab: 'سُورَةُ لُقْمَانَ', arti: 'Luqman', jumlahAyat: 34, turun: 'Makkiyah', juz: 21 },
  { nomor: 32, namaLatin: 'As-Sajdah', namaArab: 'سُورَةُ السَّجْدَةِ', arti: 'Sajdah', jumlahAyat: 30, turun: 'Makkiyah', juz: 21 },
  { nomor: 33, namaLatin: 'Al-Aḥzāb', namaArab: 'سُورَةُ الْأَحْزَابِ', arti: 'Golongan yang Bersekutu', jumlahAyat: 73, turun: 'Madaniyah', juz: 21 },
  { nomor: 34, namaLatin: "Saba'", namaArab: 'سُورَةُ سَبَإٍ', arti: "Saba'", jumlahAyat: 54, turun: 'Makkiyah', juz: 22 },
  { nomor: 35, namaLatin: 'Fāṭir', namaArab: 'سُورَةُ فَاطِرٍ', arti: 'Pencipta', jumlahAyat: 45, turun: 'Makkiyah', juz: 22 },
  {
    nomor: 36,
    namaLatin: 'Yāsīn',
    namaArab: 'سُورَةُ يٰسٓ',
    arti: 'Yasin',
    jumlahAyat: 83,
    turun: 'Makkiyah',
    juz: 22,
    ayatContoh: [
      { nomor: 1, arab: 'يٰسۤ ۚ', latin: 'yâ sîn', arti: 'Yā Sīn.' },
      { nomor: 2, arab: 'وَالْقُرْاٰنِ الْحَكِيْمِ ۙ', latin: "wal-qur'ânil-ḥakîm", arti: 'Demi Al-Qur’an yang penuh hikmah,' },
      { nomor: 3, arab: 'اِنَّكَ لَمِنَ الْمُرْسَلِيْنَ ۙ', latin: 'innaka laminal-mursalîn', arti: 'sesungguhnya engkau (Nabi Muhammad) benar-benar salah seorang dari rasul-rasul' },
      { nomor: 4, arab: 'عَلٰى صِرَاطٍ مُّسْتَقِيْمٍ ۗ', latin: '‘alâ shirâthim mustaqîm', arti: '(yang berada) di atas jalan yang lurus,' },
      { nomor: 5, arab: 'تَنْزِيْلَ الْعَزِيْزِ الرَّحِيْمِ ۙ', latin: 'tanzîlal-‘azîzir-raḥîm', arti: '(sebagai wahyu) yang diturunkan oleh (Allah) Yang Mahaperkasa lagi Maha Penyayang,' },
    ],
  },
  { nomor: 37, namaLatin: 'Aṣ-Ṣāffāt', namaArab: 'سُورَةُ الصَّافَّاتِ', arti: 'Barisan-Barisan', jumlahAyat: 182, turun: 'Makkiyah', juz: 23 },
  { nomor: 38, namaLatin: 'Ṣād', namaArab: 'سُورَةُ ص', arti: 'Sad', jumlahAyat: 88, turun: 'Makkiyah', juz: 23 },
  { nomor: 39, namaLatin: 'Az-Zumar', namaArab: 'سُورَةُ الزُّمَرِ', arti: 'Rombongan', jumlahAyat: 75, turun: 'Makkiyah', juz: 23 },
  { nomor: 40, namaLatin: 'Gāfir', namaArab: 'سُورَةُ غَافِرٍ', arti: 'Maha Pengampun', jumlahAyat: 85, turun: 'Makkiyah', juz: 24 },
  { nomor: 41, namaLatin: 'Fuṣṣilat', namaArab: 'سُورَةُ فُصِّلَتْ', arti: 'Yang Dijelaskan', jumlahAyat: 54, turun: 'Makkiyah', juz: 24 },
  { nomor: 42, namaLatin: 'Asy-Syūrā', namaArab: 'سُورَةُ الشُّورَىٰ', arti: 'Musyawarah', jumlahAyat: 53, turun: 'Makkiyah', juz: 25 },
  { nomor: 43, namaLatin: 'Az-Zukhruf', namaArab: 'سُورَةُ الزُّخْرُفِ', arti: 'Perhiasan', jumlahAyat: 89, turun: 'Makkiyah', juz: 25 },
  { nomor: 44, namaLatin: 'Ad-Dukhān', namaArab: 'سُورَةُ الدُّخَانِ', arti: 'Kabut Asap', jumlahAyat: 59, turun: 'Makkiyah', juz: 25 },
  { nomor: 45, namaLatin: 'Al-Jāṡiyah', namaArab: 'سُورَةُ الْجَاثِيَةِ', arti: 'Yang Bertekuk Lutut', jumlahAyat: 37, turun: 'Makkiyah', juz: 25 },
  { nomor: 46, namaLatin: 'Al-Aḥqāf', namaArab: 'سُورَةُ الْأَحْقَافِ', arti: 'Bukit-Bukit Pasir', jumlahAyat: 35, turun: 'Makkiyah', juz: 26 },
  { nomor: 47, namaLatin: 'Muḥammad', namaArab: 'سُورَةُ مُحَمَّدٍ', arti: 'Muhammad', jumlahAyat: 38, turun: 'Madaniyah', juz: 26 },
  { nomor: 48, namaLatin: 'Al-Fatḥ', namaArab: 'سُورَةُ الْفَتْحِ', arti: 'Kemenangan', jumlahAyat: 29, turun: 'Madaniyah', juz: 26 },
  { nomor: 49, namaLatin: 'Al-Ḥujurāt', namaArab: 'سُورَةُ الْحُجُرَاتِ', arti: 'Kamar-Kamar', jumlahAyat: 18, turun: 'Madaniyah', juz: 26 },
  { nomor: 50, namaLatin: 'Qāf', namaArab: 'سُورَةُ ق', arti: 'Qaf', jumlahAyat: 45, turun: 'Makkiyah', juz: 26 },
  { nomor: 51, namaLatin: 'Aż-Żāriyāt', namaArab: 'سُورَةُ الذَّارِيَاتِ', arti: 'Angin yang Menerbangkan', jumlahAyat: 60, turun: 'Makkiyah', juz: 26 },
  { nomor: 52, namaLatin: 'Aṭ-Ṭūr', namaArab: 'سُورَةُ الطُّورِ', arti: 'Bukit Tur', jumlahAyat: 49, turun: 'Makkiyah', juz: 27 },
  { nomor: 53, namaLatin: 'An-Najm', namaArab: 'سُورَةُ النَّجْمِ', arti: 'Bintang', jumlahAyat: 62, turun: 'Makkiyah', juz: 27 },
  { nomor: 54, namaLatin: 'Al-Qamar', namaArab: 'سُورَةُ الْقَمَرِ', arti: 'Bulan', jumlahAyat: 55, turun: 'Makkiyah', juz: 27 },
  { nomor: 55, namaLatin: 'Ar-Raḥmān', namaArab: 'سُورَةُ الرَّحْمٰنِ', arti: 'Maha Pengasih', jumlahAyat: 78, turun: 'Madaniyah', juz: 27 },
  { nomor: 56, namaLatin: 'Al-Wāqi‘ah', namaArab: 'سُورَةُ الْوَاقِعَةِ', arti: 'Hari Kiamat', jumlahAyat: 96, turun: 'Makkiyah', juz: 27 },
  { nomor: 57, namaLatin: 'Al-Ḥadīd', namaArab: 'سُورَةُ الْحَدِيدِ', arti: 'Besi', jumlahAyat: 29, turun: 'Madaniyah', juz: 27 },
  { nomor: 58, namaLatin: 'Al-Mujādalah', namaArab: 'سُورَةُ الْمُجَادَلَةِ', arti: 'Wanita yang Mengajukan Gugatan', jumlahAyat: 22, turun: 'Madaniyah', juz: 28 },
  { nomor: 59, namaLatin: 'Al-Ḥasyr', namaArab: 'سُورَةُ الْحَشْرِ', arti: 'Pengusiran', jumlahAyat: 24, turun: 'Madaniyah', juz: 28 },
  { nomor: 60, namaLatin: 'Al-Mumtaḥanah', namaArab: 'سُورَةُ الْمُمْتَحَنَةِ', arti: 'Wanita yang Diuji', jumlahAyat: 13, turun: 'Madaniyah', juz: 28 },
  { nomor: 61, namaLatin: 'Aṣ-Ṣaff', namaArab: 'سُورَةُ الصَّفِّ', arti: 'Barisan', jumlahAyat: 14, turun: 'Madaniyah', juz: 28 },
  { nomor: 62, namaLatin: 'Al-Jumu‘ah', namaArab: 'سُورَةُ الْجُمُعَةِ', arti: 'Jumat', jumlahAyat: 11, turun: 'Madaniyah', juz: 28 },
  { nomor: 63, namaLatin: 'Al-Munāfiqūn', namaArab: 'سُورَةُ الْمُنَافِقُونَ', arti: 'Orang-Orang Munafik', jumlahAyat: 11, turun: 'Madaniyah', juz: 28 },
  { nomor: 64, namaLatin: 'At-Tagābun', namaArab: 'سُورَةُ التَّغَابُنِ', arti: 'Hari Dinampakkan Kesalahan', jumlahAyat: 18, turun: 'Madaniyah', juz: 28 },
  { nomor: 65, namaLatin: 'Aṭ-Ṭalāq', namaArab: 'سُورَةُ الطَّلَاقِ', arti: 'Talak', jumlahAyat: 12, turun: 'Madaniyah', juz: 28 },
  { nomor: 66, namaLatin: 'At-Taḥrīm', namaArab: 'سُورَةُ التَّحْرِيمِ', arti: 'Mengharamkan', jumlahAyat: 12, turun: 'Madaniyah', juz: 28 },
  { nomor: 67, namaLatin: 'Al-Mulk', namaArab: 'سُورَةُ الْمُلْكِ', arti: 'Kerajaan', jumlahAyat: 30, turun: 'Makkiyah', juz: 29 },
  { nomor: 68, namaLatin: 'Al-Qalam', namaArab: 'سُورَةُ الْقَلَمِ', arti: 'Pena', jumlahAyat: 52, turun: 'Makkiyah', juz: 29 },
  { nomor: 69, namaLatin: 'Al-Ḥāqqah', namaArab: 'سُورَةُ الْحَاقَّةِ', arti: 'Hari Kiamat', jumlahAyat: 52, turun: 'Makkiyah', juz: 29 },
  { nomor: 70, namaLatin: 'Al-Ma‘ārij', namaArab: 'سُورَةُ الْمَعَارِجِ', arti: 'Tempat Naik', jumlahAyat: 44, turun: 'Makkiyah', juz: 29 },
  { nomor: 71, namaLatin: 'Nūḥ', namaArab: 'سُورَةُ نُوحٍ', arti: 'Nuh', jumlahAyat: 28, turun: 'Makkiyah', juz: 29 },
  { nomor: 72, namaLatin: 'Al-Jinn', namaArab: 'سُورَةُ الْجِنِّ', arti: 'Jin', jumlahAyat: 28, turun: 'Makkiyah', juz: 29 },
  { nomor: 73, namaLatin: 'Al-Muzzammil', namaArab: 'سُورَةُ الْمُزَّمِّلِ', arti: 'Orang yang Berselimut', jumlahAyat: 20, turun: 'Makkiyah', juz: 29 },
  { nomor: 74, namaLatin: 'Al-Muddaṡṡir', namaArab: 'سُورَةُ الْمُدَّثِّرِ', arti: 'Orang yang Berkemul', jumlahAyat: 56, turun: 'Makkiyah', juz: 29 },
  { nomor: 75, namaLatin: 'Al-Qiyāmah', namaArab: 'سُورَةُ الْقِيَامَةِ', arti: 'Hari Kiamat', jumlahAyat: 40, turun: 'Makkiyah', juz: 29 },
  { nomor: 76, namaLatin: 'Al-Insān', namaArab: 'سُورَةُ الْإِنْسَانِ', arti: 'Manusia', jumlahAyat: 31, turun: 'Madaniyah', juz: 29 },
  { nomor: 77, namaLatin: 'Al-Mursalāt', namaArab: 'سُورَةُ الْمُرْسَلَاتِ', arti: 'Malaikat yang Diutus', jumlahAyat: 50, turun: 'Makkiyah', juz: 29 },
  { nomor: 78, namaLatin: "An-Naba'", namaArab: 'سُورَةُ النَّبَإِ', arti: 'Berita Besar', jumlahAyat: 40, turun: 'Makkiyah', juz: 30 },
  { nomor: 79, namaLatin: 'An-Nāzi‘āt', namaArab: 'سُورَةُ النَّازِعَاتِ', arti: 'Malaikat yang Mencabut', jumlahAyat: 46, turun: 'Makkiyah', juz: 30 },
  { nomor: 80, namaLatin: '‘Abasa', namaArab: 'سُورَةُ عَبَسَ', arti: 'Bermuka Masam', jumlahAyat: 42, turun: 'Makkiyah', juz: 30 },
  { nomor: 81, namaLatin: 'At-Takwīr', namaArab: 'سُورَةُ التَّكْوِيرِ', arti: 'Menggulung', jumlahAyat: 29, turun: 'Makkiyah', juz: 30 },
  { nomor: 82, namaLatin: 'Al-Infiṭār', namaArab: 'سُورَةُ الْإِنْفِطَارِ', arti: 'Terbelah', jumlahAyat: 19, turun: 'Makkiyah', juz: 30 },
  { nomor: 83, namaLatin: 'Al-Muṭaffifīn', namaArab: 'سُورَةُ الْمُطَفِّفِينَ', arti: 'Orang-Orang yang Curang', jumlahAyat: 36, turun: 'Makkiyah', juz: 30 },
  { nomor: 84, namaLatin: 'Al-Insyiqāq', namaArab: 'سُورَةُ الْإِنْشِقَاقِ', arti: 'Terbelah', jumlahAyat: 25, turun: 'Makkiyah', juz: 30 },
  { nomor: 85, namaLatin: 'Al-Burūj', namaArab: 'سُورَةُ الْبُرُوجِ', arti: 'Gugusan Bintang', jumlahAyat: 22, turun: 'Makkiyah', juz: 30 },
  { nomor: 86, namaLatin: 'Aṭ-Ṭāriq', namaArab: 'سُورَةُ الطَّارِقِ', arti: 'Yang Datang di Malam Hari', jumlahAyat: 17, turun: 'Makkiyah', juz: 30 },
  { nomor: 87, namaLatin: 'Al-A‘lā', namaArab: 'سُورَةُ الْأَعْلَىٰ', arti: 'Yang Paling Tinggi', jumlahAyat: 19, turun: 'Makkiyah', juz: 30 },
  { nomor: 88, namaLatin: 'Al-Gāsyiyah', namaArab: 'سُورَةُ الْغَاشِيَةِ', arti: 'Hari Pembalasan', jumlahAyat: 26, turun: 'Makkiyah', juz: 30 },
  { nomor: 89, namaLatin: 'Al-Fajr', namaArab: 'سُورَةُ الْفَجْرِ', arti: 'Fajar', jumlahAyat: 30, turun: 'Makkiyah', juz: 30 },
  { nomor: 90, namaLatin: 'Al-Balad', namaArab: 'سُورَةُ الْبَلَدِ', arti: 'Negeri', jumlahAyat: 20, turun: 'Makkiyah', juz: 30 },
  { nomor: 91, namaLatin: 'Asy-Syams', namaArab: 'سُورَةُ الشَّمْسِ', arti: 'Matahari', jumlahAyat: 15, turun: 'Makkiyah', juz: 30 },
  { nomor: 92, namaLatin: 'Al-Lail', namaArab: 'سُورَةُ اللَّيْلِ', arti: 'Malam', jumlahAyat: 21, turun: 'Makkiyah', juz: 30 },
  { nomor: 93, namaLatin: 'Aḍ-Ḍuḥā', namaArab: 'سُورَةُ الضُّحَىٰ', arti: 'Waktu Dhuha', jumlahAyat: 11, turun: 'Makkiyah', juz: 30 },
  { nomor: 94, namaLatin: 'Asy-Syarḥ', namaArab: 'سُورَةُ الشَّرْحِ', arti: 'Kelapangan', jumlahAyat: 8, turun: 'Makkiyah', juz: 30 },
  { nomor: 95, namaLatin: 'At-Tīn', namaArab: 'سُورَةُ التِّينِ', arti: 'Buah Tin', jumlahAyat: 8, turun: 'Makkiyah', juz: 30 },
  { nomor: 96, namaLatin: 'Al-‘Alaq', namaArab: 'سُورَةُ الْعَلَقِ', arti: 'Segumpal Darah', jumlahAyat: 19, turun: 'Makkiyah', juz: 30 },
  { nomor: 97, namaLatin: 'Al-Qadr', namaArab: 'سُورَةُ الْقَدْرِ', arti: 'Kemuliaan', jumlahAyat: 5, turun: 'Makkiyah', juz: 30 },
  { nomor: 98, namaLatin: 'Al-Bayyinah', namaArab: 'سُورَةُ الْبَيِّنَةِ', arti: 'Pembuktian', jumlahAyat: 8, turun: 'Madaniyah', juz: 30 },
  { nomor: 99, namaLatin: 'Az-Zalzalah', namaArab: 'سُورَةُ الزَّلْزَلَةِ', arti: 'Kegoncangan', jumlahAyat: 8, turun: 'Madaniyah', juz: 30 },
  { nomor: 100, namaLatin: 'Al-‘Ādiyāt', namaArab: 'سُورَةُ الْعَادِيَاتِ', arti: 'Kuda Perang yang Berlari Kencang', jumlahAyat: 11, turun: 'Makkiyah', juz: 30 },
  { nomor: 101, namaLatin: 'Al-Qāri‘ah', namaArab: 'سُورَةُ الْقَارِعَةِ', arti: 'Hari Kiamat', jumlahAyat: 11, turun: 'Makkiyah', juz: 30 },
  { nomor: 102, namaLatin: 'At-Takāṡur', namaArab: 'سُورَةُ التَّكَاثُرِ', arti: 'Bermegah-Megahan', jumlahAyat: 8, turun: 'Makkiyah', juz: 30 },
  { nomor: 103, namaLatin: 'Al-‘Aṣr', namaArab: 'سُورَةُ الْعَصْرِ', arti: 'Masa', jumlahAyat: 3, turun: 'Makkiyah', juz: 30 },
  { nomor: 104, namaLatin: 'Al-Humazah', namaArab: 'سُورَةُ الْهُمَزَةِ', arti: 'Pengumpat', jumlahAyat: 9, turun: 'Makkiyah', juz: 30 },
  { nomor: 105, namaLatin: 'Al-Fīl', namaArab: 'سُورَةُ الْفِيلِ', arti: 'Gajah', jumlahAyat: 5, turun: 'Makkiyah', juz: 30 },
  { nomor: 106, namaLatin: 'Quraisy', namaArab: 'سُورَةُ قُرَيْشٍ', arti: 'Suku Quraisy', jumlahAyat: 4, turun: 'Makkiyah', juz: 30 },
  { nomor: 107, namaLatin: "Al-Mā‘ūn", namaArab: 'سُورَةُ الْمَاعُونِ', arti: 'Barang-Barang yang Berguna', jumlahAyat: 7, turun: 'Makkiyah', juz: 30 },
  { nomor: 108, namaLatin: 'Al-Kauṡar', namaArab: 'سُورَةُ الْكَوْثَرِ', arti: 'Nikmat yang Berlimpah', jumlahAyat: 3, turun: 'Makkiyah', juz: 30 },
  { nomor: 109, namaLatin: 'Al-Kāfirūn', namaArab: 'سُورَةُ الْكَافِرُونَ', arti: 'Orang-Orang Kafir', jumlahAyat: 6, turun: 'Makkiyah', juz: 30 },
  { nomor: 110, namaLatin: 'An-Naṣr', namaArab: 'سُورَةُ النَّصْرِ', arti: 'Pertolongan', jumlahAyat: 3, turun: 'Madaniyah', juz: 30 },
  { nomor: 111, namaLatin: 'Al-Lahab', namaArab: 'سُورَةُ الْمَسَدِ', arti: 'Gejolak Api', jumlahAyat: 5, turun: 'Makkiyah', juz: 30 },
  {
    nomor: 112,
    namaLatin: 'Al-Ikhlāṣ',
    namaArab: 'سُورَةُ الْإِخْلَاصِ',
    arti: 'Ikhlas',
    jumlahAyat: 4,
    turun: 'Makkiyah',
    juz: 30,
    ayatContoh: [
      { nomor: 1, arab: 'قُلْ هُوَ اللّٰهُ اَحَدٌۚ', latin: 'Qul huwallāhu aḥad', arti: 'Katakanlah (Muhammad), “Dialah Allah, Yang Maha Esa.' },
      { nomor: 2, arab: 'اَللّٰهُ الصَّمَدُۚ', latin: 'Allāhuṣ-ṣamad', arti: 'Allah tempat meminta segala sesuatu.' },
      { nomor: 3, arab: 'لَمْ يَلِدْ وَلَمْ يُوْلَدْۙ', latin: 'Lam yalid wa lam yūlad', arti: '(Allah) tidak beranak dan tidak pula diperanakkan.' },
      { nomor: 4, arab: 'وَلَمْ يَكُنْ لَّهٗ كُفُوًا اَحَدٌ ࣖ', latin: 'Wa lam yakul lahū kufuwan aḥad', arti: 'Dan tidak ada sesuatu yang setara dengan Dia.”' },
    ],
  },
  {
    nomor: 113,
    namaLatin: 'Al-Falaq',
    namaArab: 'سُورَةُ الْفَلَقِ',
    arti: 'Waktu Subuh',
    jumlahAyat: 5,
    turun: 'Makkiyah',
    juz: 30,
    ayatContoh: [
      { nomor: 1, arab: 'قُلْ اَعُوْذُ بِرَبِّ الْفَلَقِۙ', latin: 'Qul a‘ūżu birabbil-falaq', arti: 'Katakanlah, “Aku berlindung kepada Tuhan yang menguasai subuh (fajar),' },
      { nomor: 2, arab: 'مِنْ شَرِّ مَا خَلَقَۙ', latin: 'Min syarri mā khalaq', arti: 'dari kejahatan (makhluk yang) Dia ciptakan,' },
      { nomor: 3, arab: 'وَمِنْ شَرِّ غَاسِقٍ اِذَا وَقَبَۙ', latin: 'Wa min syarri gāsiqin iżā waqab', arti: 'dan dari kejahatan malam apabila telah gelap gulita,' },
      { nomor: 4, arab: 'وَمِنْ شَرِّ النَّفّٰثٰتِ فِى الْعُقَدِۙ', latin: 'Wa min syarrin-naffāṡāti fil-‘uqad', arti: 'dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya),' },
      { nomor: 5, arab: 'وَمِنْ شَرِّ حَاسِدٍ اِذَا حَسَدَ ࣖ', latin: 'Wa min syarri ḥāsidin iżā ḥasad', arti: 'dan dari kejahatan orang yang dengki apabila dia dengki.”' },
    ],
  },
  {
    nomor: 114,
    namaLatin: 'An-Nās',
    namaArab: 'سُورَةُ النَّاسِ',
    arti: 'Manusia',
    jumlahAyat: 6,
    turun: 'Makkiyah',
    juz: 30,
    ayatContoh: [
      { nomor: 1, arab: 'قُلْ اَعُوْذُ بِرَبِّ النَّاسِۙ', latin: 'Qul a‘ūżu birabbin-nās', arti: 'Katakanlah, “Aku berlindung kepada Tuhannya manusia,' },
      { nomor: 2, arab: 'مَلِكِ النَّاسِۙ', latin: 'Malikin-nās', arti: 'Raja manusia,' },
      { nomor: 3, arab: 'اِلٰهِ النَّاسِۙ', latin: 'Ilāhin-nās', arti: 'sembahan manusia,' },
      { nomor: 4, arab: 'مِنْ شَرِّ الْوَسْوَاسِ ەۙ الْخَنَّاسِۙ', latin: 'Min syarril-waswāsil-khannās', arti: 'dari kejahatan (bisikan) setan yang bersembunyi,' },
      { nomor: 5, arab: 'الَّذِيْ يُوَسْوِسُ فِيْ صُدُوْرِ النَّاسِۙ', latin: 'Allażī yuwaswisu fī ṣudūrin-nās', arti: 'yang membisikkan (kejahatan) ke dalam dada manusia,' },
      { nomor: 6, arab: 'مِنَ الْجِنَّةِ وَالنَّاسِ ࣖ', latin: 'Minal-jinnati wan-nās', arti: 'dari (golongan) jin dan manusia.”' },
    ],
  },
];

export const JADWAL_SHALAT_KARANGDADAP = [
  { nama: 'Imsak', waktu: '04:01', arab: 'الإمساك' },
  { nama: 'Subuh', waktu: '04:11', arab: 'الفجر' },
  { nama: 'Terbit', waktu: '05:27', arab: 'الشروق' },
  { nama: 'Dhuha', waktu: '05:54', arab: 'الضحى' },
  { nama: 'Zuhur', waktu: '11:40', arab: 'الظهر' },
  { nama: 'Ashar', waktu: '14:58', arab: 'العصر' },
  { nama: 'Nastakmir', waktu: '17:35', arab: 'نستكمر' },
  { nama: 'Maghrib', waktu: '17:50', arab: 'المغرب' },
  { nama: 'Isya', waktu: '19:03', arab: 'العشاء' },
];

export const SEED_KHAZANAH_ITEMS: KhazanahItem[] = [
  // 1. TAHLIL & YASIN
  {
    id: 'khz-tahlil-1',
    kategori: 'Tahlil & Yasin',
    subKategori: 'Tahlil Ahlussunnah wal Jamaah (Madzhab Syafi’i)',
    urutan: 1,
    judul: 'Tahlil Lengkap Ahlussunnah wal Jamaah (Madzhab Syafi’i) — 19 Susunan Bacaan',
    subjudul: 'Tawassul Fatihah, Al-Ikhlas 3x, Al-Falaq, An-Nas, Awal Al-Baqarah 1–5, Ayat Kursi Lengkap & Akhir Al-Baqarah 284–286',
    teksArab:
      'إِلَى حَضْرَةِ النَّبِيِّ الْمُصْطَفَى سَيِّدِنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ وَآلِهِ وَأَزْوَاجِهِ وَأَوْلَادِهِ وَذُرِّيَّاتِهِ شَيْءٌ لِلّٰهِ لَهُمُ الْفَاتِحَةُ',
    latin:
      'Ilā ḥaḍratin-nabiyyil-muṣṭafā sayyidinā Muḥammadin ṣallallāhu ‘alaihi wa sallama wa ālihī wa azwājihī wa aulādihī wa żurriyyātih syai’un lillāhi lahumul-fātiḥah.',
    terjemah:
      'Keharibaan Nabi Muhammad ﷺ, keluarga, istri, putra-putri dan keturunan beliau. Bacaan Al-Fatihah kami haturkan karena Allah untuk beliau semua.',
    isiLengkap:
      'Susunan Tahlil lengkap mengikuti amaliyah Ahlussunnah wal Jamaah Madzhab Syafi’i: Hadiah Fatihah kepada Rasulullah ﷺ, Para Nabi/Wali/Ulama & Muassis NU, Ahli Kubur & Orang Tua, Surat Al-Ikhlas 3x, Al-Falaq 1x, An-Nas 1x, Al-Fatihah, Al-Baqarah ayat 1–5 lengkap, Ayat Kursi (QS. Al-Baqarah: 255) lengkap, Al-Baqarah ayat 284–286 lengkap, Irhamna 7x, Shalawat, Salam Sahabat, Istighfar 3x, Tahlil inti, Tasbih, hingga Doa Tahlil & Doa Arwah lengkap.',
    sumber: 'Buku Panduan Tahlil Aswaja Madzhab Syafi’i & Majmu’ Syarif NU',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-23',
  },
  {
    id: 'khz-tahlil-2',
    kategori: 'Tahlil & Yasin',
    subKategori: 'Dzikir & Doa Arwah Syafi’iyah',
    urutan: 2,
    judul: 'Dzikir Tahlil, Tasbih, Istighfar & Doa Arwah Lengkap',
    subjudul: 'Rangkaian dzikir inti Tahlil & penutup doa arwah Madzhab Syafi’i',
    teksArab: 'لَا إِلٰهَ إِلَّا اللهُ، حَيٌّ مَوْجُوْدٌ · لَا إِلٰهَ إِلَّا اللهُ، حَيٌّ مَعْبُوْدٌ · لَا إِلٰهَ إِلَّا اللهُ، حَيٌّ بَاقٍ',
    latin: 'Lā ilāha illallāh (33x / 100x) — Sayyidunā Muḥammadur-rasūlullāh ṣallallāhu ‘alaihi wa sallam',
    terjemah: 'Tiada Tuhan selain Allah Yang Maha Hidup lagi Maha Kekal.',
    isiLengkap:
      'Rangkaian dzikir tahlil penutup: Istighfar 3x, Afdhaludz Dzikri, Lā ilāha illallāh 33x/100x, Kalimat Syahadat, Shalawat Tahlil, Tasbih 33x, lalu Doa Tahlil lengkap memohonkan rahmat, ampunan, keluasan kubur, dan pahala bacaan Al-Qur’an serta kalimah thayyibah untuk kedua orang tua, guru-guru, masyayikh pesantren, dan seluruh kaum muslimin.',
    sumber: 'Amaliyah Rutin Malam Jumat PP NU Darussalam',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-23',
  },
  {
    id: 'khz-yasin-1',
    kategori: 'Tahlil & Yasin',
    subKategori: 'Surat Yasin',
    urutan: 1,
    judul: 'Surat Yāsīn (Ayat 1–83) & Doa Setelah Yasin',
    subjudul: 'Lengkap dengan teks Arab berharakat, transliterasi & terjemah Indonesia',
    teksArab: 'يٰسۤ ۚ ۝١ وَالْقُرْاٰنِ الْحَكِيْمِ ۙ ۝٢ اِنَّكَ لَمِنَ الْمُرْسَلِيْنَ ۙ ۝٣ عَلٰى صِرَاطٍ مُّسْتَقِيْمٍ ۗ ۝٤',
    latin: "Yā Sīn (1). Wal-qur'ānil-ḥakīm (2). Innaka laminal-mursalīn (3). ‘Alā ṣirāṭim mustaqīm (4).",
    terjemah: 'Ya Sin. Demi Al-Qur’an yang penuh hikmah, sesungguhnya engkau (Nabi Muhammad) benar-benar salah seorang dari rasul-rasul yang berada di atas jalan yang lurus.',
    isiLengkap:
      'Surat Yasin terdiri atas 83 ayat dan dianjurkan dibaca bersama pada malam Jumat, hajat keluarga, dan tahlilan. Setelah selesai membaca ayat ke-83 (Fasubḥānallażī biyadihī malakūtu kulli syai’in wa ilaihi turja‘ūn), dianjurkan membaca doa Surat Yasin memohon keberkahan rezeki, keteguhan iman, dan husnul khatimah.',
    sumber: 'Mushaf Standar Indonesia & Majmu Syarif',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-22',
  },

  // 2. MAULID & QASIDAH
  {
    id: 'khz-maulid-1',
    kategori: 'Maulid & Qasidah',
    subKategori: 'Ahlul Bait, Sahabat & Mahallul Qiyam',
    urutan: 19,
    judul: 'Jaddal Husain (جَدَّ الْحُسَيْنِ)',
    subjudul: 'Pujian & Rindu Nabi SAW — Qasidah Majelis Sholawat',
    teksArab:
      'جَدَّ الْحُسَيْنِ يَا نُوْرَ الْعَيْنِ ۞ كُنْ لِي شَفِيْعًا يَا ضِيَاءَ الْمُقْلَتَيْنِ\nيَا إِمَامَ الْأَنْبِيَاءِ ۞ يَا فَخْرَ الْأَمَاجِدِ\nإِنِّي بِالْآمَالِ دَاخِلُ حِمَاكَ ۞ أَرْجُو رِضَاكَ يَا إِمَامَ الْقِبْلَتَيْنِ\nأَنْتَ أَقَمْتَ الْعَدَالَةَ وَالْقَضِيَّةَ ۞ وَاللهُ صَلَّى عَلَيْكَ',
    latin:
      'Jaddal-ḥusaini yā nūral-‘ain ۞ kun lī syafī‘an yā dliyā’al-muqlatain\nYā imāmal-anbiyā’i ۞ yā fakhral-amājid\nInnī bil-āmāli dākhil ḥimāk ۞ arjū riḍlāk yā imāmal-qiblatain\nAnta aqamtal-‘adālah wal-qaḍliyyah ۞ wallāhu ṣallā ‘alaik',
    terjemah:
      'Wahai kakek Al-Husain, wahai cahaya mata, jadilah pemberi syafaatku — wahai cahaya dua pandangan. Wahai imam para nabi, wahai kebanggaan orang-orang mulia. Sesungguhnya aku dengan penuh harapan memasuki naunganmu.',
    isiLengkap:
      'Qasidah Jaddal Husain merupakan salah satu pujian mahabbah kepada Rasulullah ﷺ dan keluarga ahlul bait yang sering dilantunkan santri pada malam Jumat dan acara maulid pondok pesantren.',
    sumber: 'Diwan Qasidah & Simtud Durar',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-22',
  },
  {
    id: 'khz-maulid-2',
    kategori: 'Maulid & Qasidah',
    subKategori: 'Mahallul Qiyam',
    urutan: 31,
    judul: "Thala'al Badru 'Alayna & Ya Nabi Salam 'Alaika",
    subjudul: 'Qasidah Mahallul Qiyam Maulid Al-Barzanji, Diba’ & Simtud Durar',
    teksArab: 'يَا نَبِي سَلَامٌ عَلَيْكَ ۞ يَا رَسُوْلُ سَلَامٌ عَلَيْكَ ۞ يَا حَبِيْبُ سَلَامٌ عَلَيْكَ ۞ صَلَوَاتُ اللهِ عَلَيْكَ',
    latin: "Yā nabī salāmun ‘alaika ۞ Yā rasūlu salāmun ‘alaika ۞ Yā ḥabību salāmun ‘alaika ۞ Ṣalawātullāhi ‘alaika",
    terjemah: 'Wahai Nabi, salam sejahtera bagimu. Wahai Rasul, salam sejahtera bagimu. Wahai Kekasih Allah, salam sejahtera bagimu. Shalawat Allah tercurah atasmu.',
    isiLengkap:
      'Dilantunkan dengan berdiri penuh ta’dzim saat momen Mahallul Qiyam pada pembacaan Maulid Diba’i, Al-Barzanji, maupun Simtud Durar di Masjid PP NU Darussalam.',
    sumber: 'Kitab Maulid Diba’ & Simtud Durar',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-22',
  },
  {
    id: 'khz-maulid-3',
    kategori: 'Maulid & Qasidah',
    subKategori: 'Qasidah Pilihan',
    urutan: 38,
    judul: 'Ya Hanana & Wulidal Musyarraf',
    subjudul: 'Syair kegembiraan atas kelahiran Nabi Muhammad ﷺ',
    teksArab: 'ظَهَرَ الدِّيْنُ الْمُؤَيَّدْ بِظُهُوْرِ النَّبِيْ أَحْمَدْ ۞ يَا هَنَانَا بِمُحَمَّدْ ذٰلِكَ الْفَضْلُ مِنَ اللهِ',
    latin: 'Ẓaharad-dīnul-mu’ayyad biẓuhūrin-nabī Aḥmad ۞ Yā hanānā bi Muḥammad żālikal-faḍlu minallāh',
    terjemah: 'Telah tampak agama yang dikokohkan dengan hadirnya Nabi Ahmad. Sungguh beruntungnya kami dengan Nabi Muhammad, itulah anugerah agung dari Allah.',
    isiLengkap:
      'Qasidah Ya Hanana karya Al-Habib Ali bin Muhammad Al-Habsyi bersama bait Syahrur Rabi’ dan Wulidal Habibu yang menumbuhkan kecintaan santri kepada Rasulullah ﷺ.',
    sumber: 'Simtud Durar / Majelis Sholawat',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-22',
  },

  {
    id: 'khz-maulid-azzahir',
    kategori: 'Maulid & Qasidah',
    subKategori: 'Mahallul Qiyam & Syair Pesantren',
    urutan: 1,
    judul: 'Mahallul Qiyam Lengkap (Versi Majelis Az-Zahir) & Koleksi Syair Pesantren',
    subjudul: 'Asyraqal Badru, Yā Nabī Salām ‘Alaika, Marḥaban Yā Nūral-‘Aini, Syi’ir Tanpo Waton, Al-I’tiraf, Shalawat Badar, Ya Lal Wathan & Qasidah Burdah',
    teksArab:
      'أَشْرَقَ الْبَدْرُ عَلَيْنَا ۞ فَاخْتَفَتْ مِنْهُ الْبُدُوْرُ ۞ مِثْلَ حُسْنِكْ مَا رَأَيْنَا ۞ قَطُّ يَا وَجْهَ السُّرُوْرِ ۞ يَا نَبِي سَلَامٌ عَلَيْكَ ۞ يَا رَسُوْلُ سَلَامٌ عَلَيْكَ',
    latin:
      'Asyraqal-badru ‘alainā fakhtafat minhul-budūr — Miṡla ḥusnik mā ra’ainā qaṭṭu yā wajhas-surūr — Yā Nabī salāmun ‘alaik.',
    terjemah:
      'Telah terbit bulan purnama menyinari kami hingga pudar semua rembulan lainnya. Wahai Nabi, salam sejahtera atasmu.',
    isiLengkap:
      'Memuat teks lengkap Mahallul Qiyam yang biasa dilantunkan Majelis Ta’lim & Sholawat Az-Zahir Pekalongan (dari pembukaan Ya Nabi Salam ‘Alaika, Asyraqal Badru, Marhaban Ya Nural ‘Aini, Shalla ‘Alaika Rabbuna, Thala’al Badru, hingga Doa Penutup Mahallul Qiyam) serta koleksi syair pesantren: Syi’ir Tanpo Waton, Al-I’tiraf, Shalawat Badar, Ya Lal Wathan, Qasidah Burdah, Asnawiyah, dan Tombo Ati.',
    sumber: 'Majelis Az-Zahir & Kitab Maulid Simtud Durar / Barzanji / Diba’i',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-23',
  },
  // 3. WIRID, MANAQIB, HAIKAL, DALAIL & HIZIB
  {
    id: 'khz-wirid-1',
    kategori: 'Wirid & Doa',
    subKategori: 'Wirid Harian & Ayat Kursi',
    urutan: 1,
    judul: 'Wirid Bakda Shalat, Ayat Kursi Lengkap & Ratib Al-Haddad / Al-Athas',
    subjudul: 'Teks lengkap Ayat Kursi (QS. Al-Baqarah: 255), Ratib Al-Haddad, Ratib Al-Athas & Istighotsah NU',
    teksArab:
      'اَللّٰهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّوْمُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَّلَا نَوْمٌ ۗ لَهُ مَا فِي السَّمٰوٰتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِيْ يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ',
    latin: 'Allāhu lā ilāha illā huwal-ḥayyul-qayyūm, lā ta’khużuhū sinatuw wa lā naum...',
    terjemah: 'Allah, tidak ada Tuhan selain Dia. Yang Mahahidup, Yang terus-menerus mengurus (makhluk-Nya), tidak mengantuk dan tidak tidur.',
    isiLengkap:
      'Mencakup Wirid Harian lengkap bakda shalat fardhu, Ayat Kursi lengkap tanpa terpotong, Istighotsah Kubra NU, serta bacaan lengkap Ratib Al-Haddad (Al-Habib Abdullah bin Alawi Al-Haddad) dan Ratib Al-Athas (Al-Habib Umar bin Abdurrahman Al-Athas).',
    sumber: 'Aurad Harian Santri PP NU Darussalam',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-23',
  },
  {
    id: 'khz-wirid-manaqib',
    kategori: 'Wirid & Doa',
    subKategori: 'Manaqib Nurul Burhani',
    urutan: 2,
    judul: 'Manaqib Nurul Burhani Lengkap (Syekh Abdul Qadir Al-Jailani)',
    subjudul: 'Tawassul, Muqaddimah, Manqobah Pasal 1–9, Qasidah ‘Ibadallah & Doa Manaqib',
    teksArab: 'عِبَادَ اللهِ رِجَالَ اللهِ ۞ أَغِيْثُوْنَا لِأَجْلِ اللهِ ۞ وَكُوْنُوْا عَوْنَنَا لِلّٰهِ ۞ عَسٰى نَحْظٰى بِفَضْلِ اللهِ',
    latin: '‘Ibādallāh rijālallāh aghīṡūnā li’ajlillāh — wa kūnū ‘aunanā lillāh ‘asā naḥẓā bifaḍlillāh.',
    terjemah: 'Wahai hamba-hamba Allah, para kekasih Allah, tolonglah kami karena Allah; jadilah penolong kami karena Allah, semoga kami meraih anugerah Allah.',
    isiLengkap:
      'Kitab Manaqib Nurul Burhani syarah Lujainid Dani fi Manaqib Syaikh Abdul Qadir Al-Jailani oleh KH. Muslih Abdurrahman Mranggen: Tawassul Fatihah, Muqaddimah, Manqobah 1–9 (nasab, kelahiran 470 H, puasa sejak bayi, kejujuran kepada perampok, riyadhah, derajat Quthub Rabbani, wafat 561 H & wasiat thariqah), Qasidah ‘Ibadallah Rijalallah, hingga Doa Penutup Manaqib.',
    sumber: 'Kitab Manaqib Nurul Burhani (Karya KH. Muslih Mranggen)',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-23',
  },
  {
    id: 'khz-wirid-haikal',
    kategori: 'Wirid & Doa',
    subKategori: 'Kitab Haikal Nuroni',
    urutan: 3,
    judul: 'Kitab Haikal Nuroni Lengkap (Tujuh Haikal / Ayat Penjagaan)',
    subjudul: 'Pembukaan Fatihah, Haikal 1 hingga Haikal 7 lengkap beserta Doa Penutup',
    teksArab: 'أُعِيْذُ نَفْسِيْ بِاللهِ الْعَلِيِّ الْعَظِيْمِ ۞ اَللّٰهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّوْمُ',
    latin: 'U‘īżu nafsī billāhil-‘aliyyil-‘aẓīm — rangkaian Haikal 1 s.d. Haikal 7 lengkap.',
    terjemah: 'Aku memohon perlindungan diriku kepada Allah Yang Mahatinggi lagi Mahaagung.',
    isiLengkap:
      'Kitab Haikal Nuroni (Haikal 1–7) berisi susunan ayat-ayat pilihan Al-Qur’an dan doa perlindungan dari gangguan jin, sihir, musibah, dan kezaliman: Pembukaan Tawassul, Haikal 1 (Ayat Kursi), Haikal 2 (Ali Imran & Al-Ahzab), Haikal 3 (Al-Baqarah 285–286), Haikal 4 (Al-Isra’ 80–81), Haikal 5 (Maryam & Ta-Ha), Haikal 6 (Al-Jinn & Ash-Shaffat), Haikal 7 (Al-Qalam 51–52), dan Doa Haikal Nuroni.',
    sumber: 'Kitab Haikal Nuroni & Mujarrobat Ulama Salaf',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-23',
  },
  {
    id: 'khz-wirid-dalail',
    kategori: 'Wirid & Doa',
    subKategori: 'Dalailul Khoirot & Hizib-Hizib',
    urutan: 4,
    judul: 'Dalailul Khoirot Lengkap (Senin–Ahad) & Koleksi Hizib-Hizib Mu’tabarah',
    subjudul: 'Hizib Senin s.d. Ahad Imam Al-Jazuli, Doa Khatam Dalailul Khoirot, serta Hizib Nashor, Hizib Bahr, Hizib Nawawi, Autad, Sakron, Ikhfa’, Barqi & Al-Fatihah',
    teksArab: 'اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَعَلٰى آلِ سَيِّدِنَا مُحَمَّدٍ صَلَاةً تَكُوْنُ لَكَ رِضَاءً وَلَهُ جَزَاءً وَلِحَقِّهِ أَدَاءً',
    latin: 'Allāhumma ṣalli ‘alā sayyidinā Muḥammadin wa ‘alā āli sayyidinā Muḥammadin ṣalātan takūnu laka riḍā’an wa lahū jazā’an wa liḥaqqihī adā’ā.',
    terjemah: 'Ya Allah, limpahkanlah shalawat atas junjungan kami Nabi Muhammad dan keluarganya dengan shalawat yang Engkau ridhai, menjadi balasan mulia bagi beliau, dan menunaikan hak kemuliaan beliau.',
    isiLengkap:
      'Memuat lengkap Niat Dalailul Khoirot, Asma’un Nabi ﷺ, Wirid Hari Senin hingga Hari Ahad beserta Doa Khatam Dalailul Khoirot karya Imam Muhammad bin Sulaiman Al-Jazuli; dilengkapi koleksi Hizib-Hizib utama pesantren: Hizib Nashor, Hizib Bahr (Imam Abul Hasan Asy-Syadzili), Hizib Nawawi (Imam Yahya bin Syaraf An-Nawawi), Hizib Autad (Syekh Abdul Qadir Al-Jailani), Hizib Sakron, Hizib Ikhfa’, Hizib Barqi, dan Hizib Al-Fatihah.',
    sumber: 'Kitab Dalailul Khoirot & Majmu’atul Ahzab',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-23',
  },

  // 4. TUTORIAL IBADAH (BERSUCI & SHALAT)
  {
    id: 'khz-ibadah-1',
    kategori: 'Tutorial Ibadah',
    subKategori: 'Bersuci (Thaharah)',
    urutan: 1,
    judul: 'Cara Wudhu, Tayamum & Menghilangkan Najis (8 Panduan Bersuci)',
    subjudul: '1. Menghilangkan Najis · 2. Cara Wudhu · 3. Tayamum · 4. Mandi Besar · 5. Menyamak · 6. Sepatu (Khuf) · 7. Istinja’',
    teksArab: 'نَوَيْتُ الْوُضُوْءَ لِرَفْعِ الْحَدَثِ الْأَصْغَرِ فَرْضًا لِلّٰهِ تَعَالٰى',
    latin: 'Nawaitul-wuḍū’a liraf‘il-ḥadaṡil-aṣghari farḍan lillāhi ta‘ālā',
    terjemah: 'Saya niat berwudhu untuk menghilangkan hadats kecil fardhu karena Allah Ta’ala.',
    isiLengkap:
      'Ringkasan 8 Panduan Bersuci (Thaharah) Mazhab Syafi’i:\n1. Cara Menghilangkan Najis (Mukhaffafah, Mutawassithah, Mughallazhah).\n2. Cara Wudhu: 6 Fardhu (Niat, Membasuh Muka, Tangan sampai siku, Mengusap sebagian kepala, Membasuh kaki sampai mata kaki, Tertib).\n3. Cara Tayamum dengan debu suci sebagai pengganti wudhu/mandi saat uzur.\n4. Cara Mandi Besar (Niat & meratakan air ke seluruh badan dan rambut).\n5. Cara Menyamak kulit bangkai agar suci.\n6. Bersuci saat mengenakan sepatu (Mashul Khuffain).\n7. Cara Beristinja’ dengan air maupun batu/tisu sesuai syarat fikih.',
    sumber: 'Kitab Safinatun Najah & Fathul Qorib',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-22',
  },
  {
    id: 'khz-ibadah-2',
    kategori: 'Tutorial Ibadah',
    subKategori: 'Panduan Shalat & Masbuk',
    urutan: 2,
    judul: 'Panduan Shalat Fardhu, Shalat Sunnah & Makmum Masbuk',
    subjudul: 'Rukun, syarat sah, dan tata cara menyusul imam saat Qunut / Ruku',
    teksArab: 'إِذَا جَاءَ أَحَدُكُمْ إِلَى الصَّلَاةِ وَالْإِمَامُ عَلَى حَالٍ فَلْيَصْنَعْ كَمَا يَصْنَعُ الْإِمَامُ',
    latin: 'Iżā jā’a aḥadukum ilaṣ-ṣalāti wal-imāmu ‘alā ḥālin falyaṣna‘ kamā yaṣna‘ul-imām',
    terjemah: 'Jika salah seorang di antara kalian mendatangi shalat sedangkan imam dalam keadaan tertentu, hendaklah ia berbuat sebagaimana imam berbuat (HR. Tirmidzi).',
    isiLengkap:
      'Makmum masbuk yang datang ketika imam sedang membaca doa qunut Subuh tetap wajib mengikuti posisi imam berdiri sambil mengaminkan qunut, lalu menyempurnakan rakaat yang tertinggal setelah imam salam. Jika mendapati ruku’ imam dengan thuma’ninah sebelum imam bangkit, maka rakaat tersebut sudah terhitung sah.',
    sumber: 'Fathul Mu’in & Kifayatul Akhyar',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-22',
  },

  // 5. ZIARAH (TOKOH, DESTINASI, AMALAN)
  {
    id: 'khz-ziarah-1',
    kategori: 'Ziarah',
    subKategori: 'Tokoh',
    urutan: 1,
    judul: 'Kiai Syair, KH Faqih Muntaha & KH Sholeh Darat',
    subjudul: 'Biografi & jejak dakwah ulama salaf Jawa Tengah & Nusantara',
    lokasi: 'Karangdadap · Wonosobo · Semarang',
    jarakKm: '8.5 KM – 70 KM',
    isiLengkap:
      'Daftar tokoh ulama & masyayikh ziarah santri:\n• Makam Masyayikh Pekalongan & Batang (Kiai Syair, Ulama penyebar tarekat & pesantren pesisir utara).\n• KH. Faqih Muntaha (Wonosobo) — pejuang dan pengasuh pesantren pencetak penghafal Al-Qur’an.\n• KH. Muhammad Sholeh bin Umar as-Samarani (KH. Sholeh Darat, Semarang) — mahaguru Hadratussyaikh KH. Hasyim Asy’ari & KH. Ahmad Dahlan, pengarang kitab pegon Faidhur Rahman & Majmu’atus Syari’ah.',
    sumber: 'Direktori Ziarah Ulama NU',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-22',
  },
  {
    id: 'khz-ziarah-2',
    kategori: 'Ziarah',
    subKategori: 'Destinasi',
    urutan: 2,
    judul: 'Masjid Kauman Semarang, Masjid Layur & Masjid Djami Pekodjan',
    subjudul: 'Destinasi wisata religi bersejarah di Jawa Tengah',
    lokasi: 'Kota Semarang, Jawa Tengah',
    jarakKm: '68.0 KM – 70.5 KM',
    isiLengkap:
      'Destinasi Ziarah & Sejarah Islam Jawa Tengah terdekat dari jalur pantura Pekalongan–Semarang:\n1. Masjid Kauman Semarang (68.0 KM) — Masjid Agung bersejarah tempat pengumuman kemerdekaan & pusat kajian kitab.\n2. Masjid Layur / Menara Kampung Melayu (68.0 KM).\n3. Masjid An-Nur Diponegoro (68.1 KM).\n4. Langgar Al-Yahya & Masjid Djami Pekodjan (68.6 KM).\n5. Museum Perkembangan Islam Jawa Tengah (70.5 KM).',
    sumber: 'Peta Destinasi Ziarah Jawa Tengah',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-22',
  },
  {
    id: 'khz-ziarah-3',
    kategori: 'Ziarah',
    subKategori: 'Amalan',
    urutan: 3,
    judul: 'Adab & Bacaan Salam Ziarah Kubur',
    subjudul: 'Tuntunan adab memasuki area makam, salam ahli kubur, & tahlil singkat',
    teksArab: 'اَلسَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِيْنَ وَالْمُسْلِمِيْنَ وَإِنَّا إِنْ شَاءَ اللهُ بِكُمْ لَاحِقُوْنَ',
    latin: 'As-salāmu ‘alaikum ahlad-diyāri minal-mu’minīna wal-muslimīn wa innā in syā’allāhu bikum lāḥiqūn',
    terjemah: 'Salam sejahtera atas kalian wahai penghuni kubur dari kalangan mukminin dan muslimin. Insya Allah kami pun akan menyusul kalian.',
    isiLengkap:
      'Urutan amalan ziarah kubur: Berwudhu, mengucap salam dengan menghadap wajah ahli kubur, tidak duduk/menginjak nisan, membaca Yasin & Tahlil dengan tawadhu’, dan memohonkan ampunan serta rahmat bagi ahli kubur.',
    sumber: 'Risalah Ziarah Kubur Ahlussunnah wal Jamaah',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-22',
  },

  // 6. HAJI & UMRAH
  {
    id: 'khz-haji-1',
    kategori: 'Haji & Umrah',
    subKategori: 'Urutan Manasik Haji',
    urutan: 1,
    judul: '8 Urutan Manasik Haji Lengkap (8–13 Dzulhijjah)',
    subjudul: 'Jadwal, Doa, Hikmah & Destinasi Tanah Suci Makkah – Madinah',
    teksArab: 'لَبَّيْكَ اللّٰهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيْكَ لَكَ لَبَّيْكَ',
    latin: 'Labbaikallāhumma labbaik, labbaika lā syarīka laka labbaik...',
    terjemah: 'Aku memenuhi panggilan-Mu ya Allah, aku memenuhi panggilan-Mu. Tiada sekutu bagi-Mu.',
    isiLengkap:
      '8 Urutan Manasik Haji:\n1. Bersiap & Niat Ihram dari pemondokan di Makkah.\n2. 8 Dzulhijjah: Berangkat menuju Mina/Arafah (Hari Tarwiyah).\n3. 9 Dzulhijjah: Wukuf di Padang Arafah (inti ibadah haji).\n4. Malam 10 Dzulhijjah: Mabit / menginap di Muzdalifah & mengambil kerikil.\n5. 10–13 Dzulhijjah: Menginap (Mabit) di Mina.\n6. 10 Dzulhijjah: Melontar Jumrah Aqabah & Tahallul.\n7. 10 Dzulhijjah: Tahallul Awal & Tawaf Ifadhah.\n8. 11–13 Dzulhijjah: Melontar 3 Jumrah (Ula, Wustha, & Aqabah) setiap hari tasyrik.',
    sumber: 'Bimbingan Manasik Haji & Umrah LBM NU',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-22',
  },
  {
    id: 'khz-haji-2',
    kategori: 'Haji & Umrah',
    subKategori: 'Umrah & Doa',
    urutan: 2,
    judul: 'Rukun Umrah, Doa Tawaf & Sa’i Shafa–Marwah',
    subjudul: 'Panduan praktis umrah bagi jamaah & wali santri',
    teksArab: 'لَبَّيْكَ اللّٰهُمَّ عُمْرَةً',
    latin: 'Labbaikallāhumma ‘umratan',
    terjemah: 'Aku sambut panggilan-Mu ya Allah untuk menunaikan ibadah umrah.',
    isiLengkap:
      '5 Rukun Umrah yang wajib terpenuhi secara berurutan:\n1. Niat Ihram dari Miqat (Bir Ali / Yalamlam / Qarnul Manazil).\n2. Tawaf mengelilingi Ka’bah 7 putaran berlawanan arah jarum jam.\n3. Sa’i berlari kecil 7 kali antara bukit Shafa dan Marwah.\n4. Tahallul (mencukur/memotong sebagian rambut).\n5. Tertib.',
    sumber: 'Panduan Manasik Umrah',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-22',
  },

  // 7. RAMADHAN
  {
    id: 'khz-ramadhan-1',
    kategori: 'Ramadhan',
    subKategori: 'Niat & Doa Harian Ramadhan',
    urutan: 1,
    judul: '12 Bacaan Wajib Ramadhan (Niat Puasa, Tarawih, Bilal, Kamilin, Lailatul Qadar & Zakat Fitrah)',
    subjudul: 'Kompilasi niat & doa amaliyah Ramadhan di Pesantren',
    teksArab: 'نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هٰذِهِ السَّنَةِ لِلّٰهِ تَعَالٰى',
    latin: 'Nawaitu ṣauma ghadin ‘an adā’i farḍi syahri Ramaḍāna hāżihis-sanati lillāhi ta‘ālā',
    terjemah: 'Saya niat berpuasa esok hari untuk menunaikan kewajiban bulan Ramadhan tahun ini karena Allah Ta’ala.',
    isiLengkap:
      'Daftar lengkap bacaan amaliyah Ramadhan:\n1. Doa Menyambut Bulan Ramadhan.\n2. Niat Puasa Ramadhan Sebulan Penuh (Taqlid Imam Malik).\n3. Niat Puasa Ramadhan Harian (Mazhab Syafi’i).\n4. Doa usai Buka Puasa (Dzahabaẓ-ẓama’u...).\n5. Niat Shalat Tarawih.\n6. Bacaan Bilal Tarawih & Jawabannya.\n7. Doa Kamilin Bakda Tarawih.\n8. Niat Shalat Witir (2 rakaat + 1 rakaat).\n9. Wirid & Doa Bakda Witir.\n10. Doa ketika Sahur.\n11. Bacaan Malam Lailatul Qadar (Allāhumma innaka ‘afuwwun...).\n12. Niat Zakat Fitrah untuk diri sendiri & keluarga.',
    sumber: 'Buku Saku Ramadhan Pesantren Salaf',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-22',
  },

  // 8. KALAM & INFOGRAFIK
  {
    id: 'khz-kalam-1',
    kategori: 'Kalam & Infografik',
    subKategori: 'Infografik Fiqih',
    urutan: 1,
    judul: 'Cara Menentukan Status Wudhu Saat Ragu',
    subjudul: 'Kaidah Fiqih: Al-Yaqin la Yuzalu bisy-Syakk (Keyakinan tidak hilang oleh keraguan)',
    teksArab: 'اَلْيَقِيْنُ لَا يُزَالُ بِالشَّكِّ',
    latin: 'Al-yaqīnu lā yuzālu bisy-syakk',
    terjemah: 'Keyakinan tidak dapat dihilangkan oleh keraguan yang datang belakangan.',
    isiLengkap:
      'Jika Anda yakin sebelumnya sudah berwudhu lalu muncul keraguan apakah sudah batal atau belum, maka hukumnya TETAP SUCI dan tidak wajib mengulang wudhu. Sebaliknya, jika Anda yakin sebelumnya batal/berhadats lalu ragu apakah tadi sudah berwudhu atau belum, maka dihukumi masih berhadats dan wajib berwudhu.',
    sumber: 'Al-Asybah wan-Nazha’ir / Kajian Fiqih Santri',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-22',
  },
  {
    id: 'khz-kalam-2',
    kategori: 'Kalam & Infografik',
    subKategori: 'Infografik Fiqih',
    urutan: 2,
    judul: 'Makmum Masbuk Datang Saat Imam Qunut, Apa yang Dilakukan?',
    subjudul: 'Tuntunan ringkas adab berjamaah Subuh bagi makmum masbuk',
    isiLengkap:
      'Jika mendapati imam dalam kondisi qunut, makmum masbuk langsung takbiratul ihram dan berdiri mengikuti imam membaca/mengaminkan doa qunut. Makmum masbuk tetap wajib mengulang rakaat yang tertinggal setelah imam salam (termasuk membaca qunut sendiri pada rakaat keduanya).',
    sumber: 'Fathul Mu’in · Bab Shalat Berjamaah',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-22',
  },
  {
    id: 'khz-kalam-3',
    kategori: 'Kalam & Infografik',
    subKategori: 'Mutiara Kata Ulama',
    urutan: 3,
    judul: 'Mutiara Kata & Hadis: Keutamaan Sedekah, Bahaya Kebodohan & Nikmat Sehat',
    subjudul: 'Kutipan hikmah harian pengasuh dan kitab salaf',
    teksArab: 'مَا نَقَصَ مَالٌ مِنْ صَدَقَةٍ فَتَصَدَّقُوْا ۞ نِعْمَتَانِ مَغْبُوْنٌ فِيْهِمَا كَثِيْرٌ مِنَ النَّاسِ: الصِّحَّةُ وَالْفَرَاغُ',
    latin: 'Mā naqaṣa mālun min ṣadaqatin fa taṣaddaqū — Ni‘matāni maghbūnun fīhimā kaṡīrun minan-nās: aṣ-ṣiḥḥatu wal-farāgh',
    terjemah: 'Harta tidak akan berkurang karena sedekah, maka bersedekahlah! (HR Ibnu Adi) · Dua kenikmatan yang sering dilalaikan kebanyakan manusia: kesehatan dan waktu luang (HR al-Bukhari).',
    isiLengkap:
      '1. "Harta tidak berkurang karena sedekah, maka bersedekahlah!" — HR Ibnu ‘Adi.\n2. "Sungguh pintu terbesar iblis untuk masuk ke dalam diri manusia adalah kebodohan." — Imam Ibnul Jauzi (Talbis Iblis).\n3. "Banyak manusia teledor dalam dua kenikmatan: kesehatan dan waktu senggang." — HR al-Bukhari.',
    sumber: 'Koleksi Kalam Hikmah Santri',
    ditambahkanOleh: 'Sekretariat Pondok',
    tanggalUpdate: '2026-11-22',
  },
];
