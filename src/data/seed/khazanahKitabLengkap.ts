import type { BacaanDetail, WiridDoaGroup, QasidahItem } from './khazanahAppSeed.ts';

// ============================================================================
// AYAT KURSI LENGKAP (QS. Al-Baqarah: 255) — TANPA PENYINGKATAN
// ============================================================================
export const AYAT_KURSI_COMPLETE: BacaanDetail = {
  id: 'ayat-kursi-lengkap',
  judul: 'Ayat Kursi Lengkap (QS. Al-Baqarah: 255)',
  arab: 'اَللّٰهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّوْمُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَّلَا نَوْمٌ ۗ لَهُ مَا فِي السَّمٰوٰتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِيْ يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۗ يَعْلَمُ مَا بَيْنَ أَيْدِيْهِمْ وَمَا خَلْفَهُمْ ۚ وَلَا يُحِيْطُوْنَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمٰوٰتِ وَالْأَرْضَ ۚ وَلَا يَؤُوْدُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيْمُ',
  latin:
    "Allāhu lā ilāha illā huwal-ḥayyul-qayyūm, lā ta'khużuhū sinatuw wa lā naum, lahū mā fis-samāwāti wa mā fil-arḍ, man żallażī yasyfa'u 'indahū illā bi'iżnih, ya'lamu mā baina aidīhim wa mā khalfahum, wa lā yuḥīṭūna bisyai'im min 'ilmihī illā bimā syā', wasi'a kursiyyuhus-samāwāti wal-arḍ, wa lā ya'ūduhū ḥifẓuhumā, wa huwal-'aliyyul-'aẓīm.",
  arti:
    'Allah, tidak ada Tuhan selain Dia. Yang Mahahidup, Yang terus-menerus mengurus (makhluk-Nya), tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi. Tidak ada yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya. Dia mengetahui apa yang di hadapan mereka dan apa yang di belakang mereka, dan mereka tidak mengetahui sesuatu pun tentang ilmu-Nya melainkan apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi. Dan Dia tidak merasa berat memelihara keduanya, dan Dia Mahatinggi, Mahabesar.',
};

// ============================================================================
// TAHLIL AHLUSSUNNAH WAL JAMA'AH MADZHAB SYAFI'I LENGKAP
// ============================================================================
export const TAHLIL_SYAFII_LENGKAP: BacaanDetail[] = [
  {
    id: 'th-1',
    judul: '1. Hadiah Fatihah kepada Rasulullah ﷺ & Keluarga',
    arab: 'إِلَى حَضْرَةِ النَّبِيِّ الْمُصْطَفَى سَيِّدِنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ وَآلِهِ وَأَزْوَاجِهِ وَأَوْلَادِهِ وَذُرِّيَّاتِهِ، شَيْءٌ لِلّٰهِ لَهُمُ الْفَاتِحَةُ',
    latin:
      "Ilā ḥaḍratin-nabiyyil-muṣṭafā sayyidinā Muḥammadin ṣallallāhu 'alaihi wa sallama wa ālihī wa azwājihī wa aulādihī wa żurriyyātih, syai'un lillāhi lahumul-fātiḥah.",
    arti:
      'Keharibaan baginda Nabi pilihan Muhammad ﷺ, segenap keluarga, istri-istri, putra-putri, dan keturunan beliau. Bacaan Al-Fatihah kami haturkan karena Allah untuk beliau semua.',
  },
  {
    id: 'th-2',
    judul: '2. Hadiah Fatihah kepada Para Nabi, Wali, Ulama & Muassis NU',
    arab: 'ثُمَّ إِلَى حَضْرَةِ إِخْوَانِهِ مِنَ الْأَنْبِيَاءِ وَالْمُرْسَلِيْنَ وَالْأَوْلِيَاءِ وَالشُّهَدَاءِ وَالصَّالِحِيْنَ وَالصَّحَابَةِ وَالتَّابِعِيْنَ وَالْعُلَمَاءِ الْعَامِلِيْنَ وَالْمُصَنِّفِيْنَ الْمُخْلِصِيْنَ وَجَمِيْعِ الْمَلَائِكَةِ الْمُقَرَّبِيْنَ، خُصُوْصًا إِلَى سَيِّدِنَا الشَّيْخِ عَبْدِ الْقَادِرِ الْجَيْلَانِي وَخُصُوْصًا إِلَى مُؤَسِّسِي جَمْعِيَّةِ نَهْضَةِ الْعُلَمَاءِ وَمَشَايِخِ مَعْهَدِ دَارِ السَّلَامِ، شَيْءٌ لِلّٰهِ لَهُمُ الْفَاتِحَةُ',
    latin:
      "Ṡumma ilā ḥaḍrati ikhwānihī minal-anbiyā'i wal-mursalīna wal-auliyā'i wasy-syuhadā'i waṣ-ṣāliḥīna waṣ-ṣaḥābati wat-tābi'īna wal-'ulamā'il-'āmilīna wal-muṣannifīnal-mukhliṣīna wa jamī'il-malā'ikatil-muqarrabīn, khuṣūṣan ilā sayyidināsy-Syaikh 'Abdil Qādir al-Jīlānī wa mu'assisī Jam'iyyati Nahḍatil-'Ulamā' wa masyāyikhi Ma'hadi Dāris-Salām, syai'un lillāhi lahumul-fātiḥah.",
    arti:
      'Kemudian kepada para nabi dan rasul, para wali, syuhada, orang-orang shalih, sahabat, tabi’in, ulama pengamal ilmu, para pengarang kitab yang ikhlas, para malaikat muqarrabin, khususnya Sulthanul Auliya Syekh Abdul Qadir Al-Jailani, para pendiri Jam’iyyah Nahdlatul Ulama, dan para masyayikh PP NU Darussalam. Al-Fatihah.',
  },
  {
    id: 'th-3',
    judul: '3. Hadiah Fatihah kepada Ahli Kubur & Orang Tua',
    arab: 'ثُمَّ إِلَى جَمِيْعِ أَهْلِ الْقُبُوْرِ مِنَ الْمُسْلِمِيْنَ وَالْمُسْلِمَاتِ وَالْمُؤْمِنِيْنَ وَالْمُؤْمِنَاتِ مِنْ مَشَارِقِ الْأَرْضِ إِلَى مَغَارِبِهَا بَرِّهَا وَبَحْرِهَا خُصُوْصًا إِلَى آبَائِنَا وَأُمَّهَاتِنَا وَأَجْدَادِنَا وَجَدَّاتِنَا وَمَشَايِخِنَا وَمَشَايِخِ مَشَايِخِنَا وَلِمَنِ اجْتَمَعْنَا هٰهُنَا بِسَبَبِهِ، شَيْءٌ لِلّٰهِ لَهُمُ الْفَاتِحَةُ',
    latin:
      "Ṡumma ilā jamī'i ahlil-qubūri minal-muslimīna wal-muslimāti wal-mu'minīna wal-mu'mināti min masyāriqil-arḍi ilā maghāribihā barrihā wa baḥrihā khuṣūṣan ilā ābā'inā wa ummahātinā wa ajdādinā wa jaddātinā wa masyāyikhinā wa limanijtama'nā hāhunā bisababih, syai'un lillāhi lahumul-fātiḥah.",
    arti:
      'Kemudian kepada seluruh ahli kubur kaum muslimin-muslimat dan mukminin-mukminat dari timur hingga barat di darat maupun di laut, khususnya ayah-ibu kami, kakek-nenek kami, guru-guru kami, serta arwah yang menjadi sebab berkumpulnya majelis ini. Al-Fatihah.',
  },
  {
    id: 'th-4',
    judul: '4. Surat Al-Ikhlāṣ (Dibaca 3 Kali) & Takbir Tahlil',
    arab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۝ قُلْ هُوَ اللّٰهُ أَحَدٌ ۝١ اَللّٰهُ الصَّمَدُ ۝٢ لَمْ يَلِدْ وَلَمْ يُوْلَدْ ۝٣ وَلَمْ يَكُنْ لَّهُ كُفُوًا أَحَدٌ ۝٤ (٣×)\nلَا إِلٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ وَلِلّٰهِ الْحَمْدُ',
    latin:
      'Bismillāhir-raḥmānir-raḥīm. Qul huwallāhu aḥad (1), Allāhuṣ-ṣamad (2), Lam yalid wa lam yūlad (3), Wa lam yakul lahū kufuwan aḥad (4). (3x)\nLā ilāha illallāhu wallāhu akbar wa lillāhil-ḥamd.',
    arti:
      'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: Dialah Allah Yang Maha Esa. Allah tempat bergantung segala sesuatu. Dia tidak beranak dan tidak diperanakkan, dan tidak ada sesuatu pun yang setara dengan-Nya (3x). Tiada Tuhan selain Allah, Allah Mahabesar dan bagi-Nya segala puji.',
  },
  {
    id: 'th-5',
    judul: '5. Surat Al-Falaq (1 Kali) & Takbir Tahlil',
    arab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۝ قُلْ أَعُوْذُ بِرَبِّ الْفَلَقِ ۝١ مِنْ شَرِّ مَا خَلَقَ ۝٢ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝٣ وَمِنْ شَرِّ النَّفّٰثٰتِ فِي الْعُقَدِ ۝٤ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ ۝٥\nلَا إِلٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ وَلِلّٰهِ الْحَمْدُ',
    latin:
      "Bismillāhir-raḥmānir-raḥīm. Qul a'ūżu birabbil-falaq (1), Min syarri mā khalaq (2), Wa min syarri ghāsiqin iżā waqab (3), Wa min syarrin-naffāṡāti fil-'uqad (4), Wa min syarri ḥāsidin iżā ḥasad (5).\nLā ilāha illallāhu wallāhu akbar wa lillāhil-ḥamd.",
    arti:
      'Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh, dari kejahatan makhluk yang Dia ciptakan, dari kejahatan malam apabila telah gelap gulita, dari kejahatan penyihir yang meniup buhul-buhul, dan dari kejahatan pendengki apabila ia dengki.',
  },
  {
    id: 'th-6',
    judul: '6. Surat An-Nās (1 Kali) & Takbir Tahlil',
    arab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۝ قُلْ أَعُوْذُ بِرَبِّ النَّاسِ ۝١ مَلِكِ النَّاسِ ۝٢ إِلٰهِ النَّاسِ ۝٣ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝٤ الَّذِيْ يُوَسْوِسُ فِيْ صُدُوْرِ النَّاسِ ۝٥ مِنَ الْجِنَّةِ وَالنَّاسِ ۝٦\nلَا إِلٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ وَلِلّٰهِ الْحَمْدُ',
    latin:
      "Bismillāhir-raḥmānir-raḥīm. Qul a'ūżu birabbin-nās (1), Malikin-nās (2), Ilāhin-nās (3), Min syarril-waswāsil-khannās (4), Allażī yuwaswisu fī ṣudūrin-nās (5), Minal-jinnati wan-nās (6).\nLā ilāha illallāhu wallāhu akbar wa lillāhil-ḥamd.",
    arti:
      'Katakanlah: Aku berlindung kepada Tuhannya manusia, Raja manusia, Sembahan manusia, dari kejahatan bisikan setan yang bersembunyi, yang membisikkan kejahatan ke dalam dada manusia, dari golongan jin dan manusia.',
  },
  {
    id: 'th-7',
    judul: '7. Surat Al-Fātiḥah Lengkap',
    arab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۝١ اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ ۝٢ الرَّحْمٰنِ الرَّحِيْمِ ۝٣ مٰلِكِ يَوْمِ الدِّيْنِ ۝٤ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِيْنُ ۝٥ اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيْمَ ۝٦ صِرَاطَ الَّذِيْنَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوْبِ عَلَيْهِمْ وَلَا الضَّآلِّيْنَ ۝٧ آمِيْنَ',
    latin:
      "Bismillāhir-raḥmānir-raḥīm (1), Al-ḥamdu lillāhi rabbil-'ālamīn (2), Ar-raḥmānir-raḥīm (3), Māliki yaumid-dīn (4), Iyyāka na'budu wa iyyāka nasta'īn (5), Ihdinaṣ-ṣirāṭal-mustaqīm (6), Ṣirāṭallażīna an'amta 'alaihim ghairil-maghḍūbi 'alaihim wa laḍ-ḍāllīn (7). Āmīn.",
    arti:
      'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah Tuhan seluruh alam. Yang Maha Pengasih, Maha Penyayang. Pemilik hari pembalasan. Hanya kepada Engkau kami menyembah dan mohon pertolongan. Tunjukilah kami jalan yang lurus, yakni jalan orang-orang yang telah Engkau beri nikmat, bukan mereka yang dimurkai dan bukan pula yang sesat. Amin.',
  },
  {
    id: 'th-8',
    judul: '8. Awal Surat Al-Baqarah (Ayat 1–5 Lengkap)',
    arab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۝ الٓمّٓ ۝١ ذٰلِكَ الْكِتٰبُ لَا رَيْبَ فِيْهِ هُدًى لِّلْمُتَّقِيْنَ ۝٢ الَّذِيْنَ يُؤْمِنُوْنَ بِالْغَيْبِ وَيُقِيْمُوْنَ الصَّلٰوةَ وَمِمَّا رَزَقْنٰهُمْ يُنْفِقُوْنَ ۝٣ وَالَّذِيْنَ يُؤْمِنُوْنَ بِمَا أُنْزِلَ إِلَيْكَ وَمَا أُنْزِلَ مِنْ قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوْقِنُوْنَ ۝٤ أُولٰئِكَ عَلٰى هُدًى مِّنْ رَّبِّهِمْ وَأُولٰئِكَ هُمُ الْمُفْلِحُوْنَ ۝٥',
    latin:
      "Bismillāhir-raḥmānir-raḥīm. Alif Lām Mīm (1). Żālikal-kitābu lā raiba fīhi hudal-lil-muttaqīn (2). Allażīna yu'minūna bil-ghaibi wa yuqīmūnaṣ-ṣalāta wa mimmā razaqnāhum yunfiqūn (3). Wallażīna yu'minūna bimā unzila ilaika wa mā unzila min qablika wa bil-ākhirati hum yūqinūn (4). Ulā'ika 'alā hudam mir rabbihim wa ulā'ika humul-mufliḥūn (5).",
    arti:
      'Alif Lam Mim. Kitab (Al-Qur’an) ini tidak ada keraguan padanya; petunjuk bagi mereka yang bertakwa, yaitu mereka yang beriman kepada yang gaib, menegakkan shalat, dan menginfakkan sebagian rezeki yang Kami berikan, serta beriman kepada wahyu yang diturunkan kepadamu dan sebelummu serta yakin akan akhirat. Mereka itulah yang mendapat petunjuk dan merekalah orang-orang yang beruntung.',
  },
  {
    id: 'th-9',
    judul: '9. Kalimat Keesaan Allah (QS. Al-Baqarah: 163)',
    arab: 'وَإِلٰهُكُمْ إِلٰهٌ وَاحِدٌ ۚ لَا إِلٰهَ إِلَّا هُوَ الرَّحْمٰنُ الرَّحِيْمُ',
    latin: 'Wa ilāhukum ilāhuw wāḥid, lā ilāha illā huwar-raḥmānur-raḥīm.',
    arti: 'Dan Tuhan kamu adalah Tuhan Yang Maha Esa, tidak ada Tuhan selain Dia, Yang Maha Pengasih lagi Maha Penyayang.',
  },
  {
    id: 'th-10',
    judul: '10. Ayat Kursi Lengkap (QS. Al-Baqarah: 255)',
    arab: AYAT_KURSI_COMPLETE.arab,
    latin: AYAT_KURSI_COMPLETE.latin,
    arti: AYAT_KURSI_COMPLETE.arti,
  },
  {
    id: 'th-11',
    judul: '11. Akhir Surat Al-Baqarah (Ayat 284–286 Lengkap)',
    arab: 'لِلّٰهِ مَا فِي السَّمٰوٰتِ وَمَا فِي الْأَرْضِ ۗ وَإِنْ تُبْدُوْا مَا فِي أَنْفُسِكُمْ أَوْ تُخْفُوْهُ يُحَاسِبْكُمْ بِهِ اللّٰهُ ۗ فَيَغْفِرُ لِمَنْ يَّشَاءُ وَيُعَذِّبُ مَنْ يَّشَاءُ ۗ وَاللّٰهُ عَلٰى كُلِّ شَيْءٍ قَدِيْرٌ ۝٢٨٤ آمَنَ الرَّسُوْلُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَّبِّهِ وَالْمُؤْمِنُوْنَ ۚ كُلٌّ آمَنَ بِاللّٰهِ وَمَلٰئِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ ۗ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّنْ رُّسُلِهِ ۗ وَقَالُوْا سَمِعْنَا وَأَطَعْنَا غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيْرُ ۝٢٨٥ لَا يُكَلِّفُ اللّٰهُ نَفْسًا إِلَّا وُسْعَهَا ۗ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَّسِيْنَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِيْنَ مِنْ قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۚ وَاعْفُ عَنَّا ۗ وَاغْفِرْ لَنَا ۗ وَارْحَمْنَا ۗ أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِيْنَ ۝٢٨٦',
    latin:
      "Lillāhi mā fis-samāwāti wa mā fil-arḍ, wa in tubdū mā fī anfusikum au tukhfūhu yuḥāsibkum bihillāh, fayaghfiru limay yasyā'u wa yu'ażżibu may yasyā', wallāhu 'alā kulli syai'in qadīr (284). Āmanar-rasūlu bimā unzila ilaihi mir rabbihī wal-mu'minūn, kullun āmana billāhi wa malā'ikatihī wa kutubihī wa rusulih, lā nufarriqu baina aḥadim mir rusulih, wa qālū sami'nā wa aṭa'nā ghufrānaka rabbanā wa ilaikal-maṣīr (285). Lā yukallifullāhu nafsan illā wus'ahā, lahā mā kasabat wa 'alaihā maktasabat, rabbanā lā tu'ākhiżnā in nasīnā au akhṭa'nā, rabbanā wa lā taḥmil 'alainā iṣran kamā ḥamaltahū 'alallażīna min qablinā, rabbanā wa lā tuḥammilnā mā lā ṭāqata lanā bih, wa'fu 'annā, waghfir lanā, warḥamnā, anta maulānā fanṣurnā 'alal-qaumil-kāfirīn (286).",
    arti:
      'Milik Allahlah segala apa yang ada di langit dan di bumi. Jika kamu menyatakan atau menyembunyikan isi hatimu, Allah akan memperhitungkannya... Rasul telah beriman kepada Al-Qur’an yang diturunkan kepadanya, demikian pula orang-orang beriman... Allah tidak membebani seseorang melainkan sesuai kesanggupannya. Ya Tuhan kami, janganlah Engkau hukum kami jika kami lupa atau bersalah. Maafkanlah kami, ampunilah kami, dan rahmatilah kami. Engkaulah Penolong kami.',
  },
  {
    id: 'th-12',
    judul: '12. Permohonan Rahmat (Irḥamnā 7x) & QS. Hūd: 73',
    arab: 'اِرْحَمْنَا يَا أَرْحَمَ الرَّاحِمِيْنَ (٧×)\nرَحْمَتُ اللّٰهِ وَبَرَكَاتُهُ عَلَيْكُمْ أَهْلَ الْبَيْتِ إِنَّهُ حَمِيْدٌ مَّجِيْدٌ ۝ إِنَّمَا يُرِيْدُ اللّٰهُ لِيُذْهِبَ عَنْكُمُ الرِّجْسَ أَهْلَ الْبَيْتِ وَيُطَهِّرَكُمْ تَطْهِيْرًا',
    latin:
      "Irḥamnā yā Arḥamar-Rāḥimīn (7x).\nRaḥmatullāhi wa barakātuhū 'alaikum Ahlal-Bait innahū Ḥamīdum Majīd. Innamā yurīdullāhu liyużhiba 'ankumur-rijsa Ahlal-Baiti wa yuṭahhirakum taṭhīrā.",
    arti:
      'Rahmatilah kami wahai Dzat Yang Maha Pengasih dari segala pengasih (7x). Rahmat Allah dan keberkahan-Nya tercurah atas kalian Ahlul Bait. Sesungguhnya Dia Maha Terpuji lagi Maha Pemurah.',
  },
  {
    id: 'th-13',
    judul: '13. Shalawat Nabi (QS. Al-Aḥzāb: 56 & Shalawat 3x)',
    arab: 'إِنَّ اللّٰهَ وَمَلٰئِكَتَهُ يُصَلُّوْنَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِيْنَ آمَنُوْا صَلُّوْا عَلَيْهِ وَسَلِّمُوْا تَسْلِيْمًا\nاَللّٰهُمَّ صَلِّ أَفْضَلَ الصَّلَاةِ عَلٰى أَسْعَدِ مَخْلُوْقَاتِكَ نُوْرِ الْهُدٰى سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ وَعَلٰى آلِ سَيِّدِنَا مُحَمَّدٍ، عَدَدَ مَعْلُوْمَاتِكَ وَمِدَادَ كَلِمَاتِكَ كُلَّمَا ذَكَرَكَ الذَّاكِرُوْنَ وَغَفَلَ عَنْ ذِكْرِكَ الْغَافِلُوْنَ (٣×)',
    latin:
      "Innallāha wa malā'ikatahū yuṣallūna 'alan-nabī, yā ayyuhallażīna āmanū ṣallū 'alaihi wa sallimū taslīmā.\nAllāhumma ṣalli afḍalaṣ-ṣalāti 'alā as'adi makhlūqātika nūril-hudā sayyidinā wa maulānā Muḥammadin wa 'alā āli sayyidinā Muḥammadin 'adada ma'lūmātika wa midāda kalimātika kullamā żakarakaż-żākirūna wa ghafala 'an żikrikal-ghāfilūn (3x).",
    arti:
      'Sesungguhnya Allah dan para malaikat-Nya bershalawat untuk Nabi. Wahai orang-orang yang beriman, bershalawatlah dan ucapkan salam kepadanya. Ya Allah, limpahkan seutama-utama shalawat kepada cahaya petunjuk junjungan kami Muhammad ﷺ sebanyak ilmu dan kalimat-Mu.',
  },
  {
    id: 'th-14',
    judul: '14. Salam Sahabat, Ḥasbunallāh & Hauqalah',
    arab: 'وَسَلِّمْ وَرَضِيَ اللّٰهُ تَعَالٰى عَنْ سَادَاتِنَا أَصْحَابِ رَسُوْلِ اللّٰهِ أَجْمَعِيْنَ ۝ وَحَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيْلُ نِعْمَ الْمَوْلٰى وَنِعْمَ النَّصِيْرُ ۝ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ الْعَلِيِّ الْعَظِيْمِ',
    latin:
      "Wa sallim wa raḍiyallāhu ta'ālā 'an sādātinā aṣḥābi rasūlillāhi ajma'īn. Wa ḥasbunallāhu wa ni'mal-wakīl ni'mal-maulā wa ni'man-naṣīr. Wa lā ḥaula wa lā quwwata illā billāhil-'aliyyil-'aẓīm.",
    arti:
      'Dan salam serta ridha Allah semoga tercurah atas para sahabat Rasulullah seluruhnya. Cukuplah Allah bagi kami sebaik-baik Pemelihara, Pelindung, dan Penolong. Tiada daya dan kekuatan kecuali dengan pertolongan Allah Yang Mahatinggi lagi Mahaagung.',
  },
  {
    id: 'th-15',
    judul: '15. Istighfar (Dibaca 3 Kali)',
    arab: 'أَسْتَغْفِرُ اللّٰهَ الْعَظِيْمَ الَّذِيْ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّوْمُ وَأَتُوْبُ إِلَيْهِ (٣×)',
    latin: "Astaghfirullāhal-'aẓīm allażī lā ilāha illā huwal-ḥayyul-qayyūmu wa atūbu ilaih (3x).",
    arti:
      'Aku memohon ampun kepada Allah Yang Mahaagung, tiada Tuhan selain Dia Yang Mahahidup lagi Maha Mengurus segala sesuatu, dan aku bertaubat kepada-Nya (3x).',
  },
  {
    id: 'th-16',
    judul: '16. Afḍaluż-Żikri & Dzikir Tahlil Inti (33x / 100x)',
    arab: 'أَفْضَلُ الذِّكْرِ فَاعْلَمْ أَنَّهُ لَا إِلٰهَ إِلَّا اللهُ، حَيٌّ مَوْجُوْدٌ ۞ لَا إِلٰهَ إِلَّا اللهُ، حَيٌّ مَعْبُوْدٌ ۞ لَا إِلٰهَ إِلَّا اللهُ، حَيٌّ بَاقٍ\nلَا إِلٰهَ إِلَّا اللهُ (٣٣× / ١٠٠×)\nلَا إِلٰهَ إِلَّا اللهُ سَيِّدُنَا مُحَمَّدٌ رَسُوْلُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ',
    latin:
      "Afḍaluż-żikri fa'lam annahū Lā ilāha illallāh — Ḥayyun maujūd, Lā ilāha illallāh — Ḥayyun ma'būd, Lā ilāha illallāh — Ḥayyun bāq.\nLā ilāha illallāh (33x / 100x).\nLā ilāha illallāhu Sayyidunā Muḥammadur-rasūlullāhi ṣallallāhu 'alaihi wa sallam.",
    arti:
      'Sebaik-baik dzikir ketahuilah bahwasanya tiada Tuhan selain Allah, Dzat Yang Maha Hidup lagi Ada, Maha Hidup lagi Disembah, Maha Hidup lagi Kekal. Tiada Tuhan selain Allah (33x/100x). Nabi Muhammad adalah utusan Allah ﷺ.',
  },
  {
    id: 'th-17',
    judul: '17. Kalimat Syahadat Penutup & Shalawat Tahlil',
    arab: 'لَا إِلٰهَ إِلَّا اللهُ كَلِمَةُ حَقٍّ عَلَيْهَا نَحْيَا وَعَلَيْهَا نَمُوْتُ وَبِهَا نُبْعَثُ إِنْ شَاءَ اللّٰهُ تَعَالٰى مِنَ الْآمِنِيْنَ\nاَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ، اَللّٰهُمَّ صَلِّ عَلَيْهِ وَسَلِّمْ (٢×)\nاَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ يَا رَبِّ صَلِّ عَلَيْهِ وَسَلِّمْ',
    latin:
      "Lā ilāha illallāhu kalimatu ḥaqqin 'alaihā naḥyā wa 'alaihā namūtu wa bihā nub'aṡu in syā'allāhu ta'ālā minal-āminīn.\nAllāhumma ṣalli 'alā sayyidinā Muḥammad, Allāhumma ṣalli 'alaihi wa sallim (2x).\nAllāhumma ṣalli 'alā sayyidinā Muḥammad, yā rabbi ṣalli 'alaihi wa sallim.",
    arti:
      'Tiada Tuhan selain Allah adalah kalimat kebenaran; di atasnya kami hidup, di atasnya kami wafat, dan dengannya kami dibangkitkan insya Allah termasuk golongan orang yang aman.',
  },
  {
    id: 'th-18',
    judul: '18. Tasbih Penutup (33x) & Shalawat Salam',
    arab: 'سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ، سُبْحَانَ اللّٰهِ الْعَظِيْمِ (٣٣×)\nاَللّٰهُمَّ صَلِّ عَلٰى حَبِيْبِكَ سَيِّدِنَا مُحَمَّدٍ وَعَلٰى آلِهِ وَصَحْبِهِ وَبَارِكْ وَسَلِّمْ أَجْمَعِيْنَ (٣×)\nاَلْفَاتِحَةُ',
    latin:
      "Subḥānallāhi wa biḥamdihī, Subḥānallāhil-'aẓīm (33x).\nAllāhumma ṣalli 'alā ḥabībika sayyidinā Muḥammadin wa 'alā ālihī wa ṣaḥbihī wa bārik wa sallim ajma'īn (3x). Al-Fātiḥah.",
    arti: 'Mahasuci Allah dengan segala puji-Nya, Mahasuci Allah Yang Mahaagung (33x). Limpahkan shalawat, berkah, dan salam kepada kekasih-Mu Nabi Muhammad ﷺ sekeluarga dan para sahabatnya. Al-Fatihah.',
  },
  {
    id: 'th-19',
    judul: '19. Doa Tahlil & Doa Arwah Lengkap (Madzhab Syafi’i Aswaja)',
    arab: 'أَعُوْذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِيْمِ ۝ بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۝ اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ حَمْدَ الشَّاكِرِيْنَ حَمْدَ النَّاعِمِيْنَ حَمْدًا يُوَافِيْ نِعَمَهُ وَيُكَافِئُ مَزِيْدَهُ ۝ يَا رَبَّنَا لَكَ الْحَمْدُ كَمَا يَنْبَغِيْ لِجَلَالِ وَجْهِكَ وَعَظِيْمِ سُلْطَانِكَ ۝\nاَللّٰهُمَّ صَلِّ وَسَلِّمْ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَعَلٰى آلِ سَيِّدِنَا مُحَمَّدٍ ۝ اَللّٰهُمَّ تَقَبَّلْ وَأَوْصِلْ ثَوَابَ مَا قَرَأْنَاهُ مِنَ الْقُرْآنِ الْعَظِيْمِ وَمَا هَلَّلْنَا وَمَا سَبَّحْنَا وَمَا اسْتَغْفَرْنَا وَمَا صَلَّيْنَا عَلٰى سَيِّدِنَا مُحَمَّدٍ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ هَدِيَّةً وَاصِلَةً وَرَحْمَةً نَازِلَةً وَبَرَكَةً شَامِلَةً إِلٰى حَضْرَةِ حَبِيْبِنَا وَشَفِيْعِنَا وَقُرَّةِ أَعْيُنِنَا سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ، ثُمَّ إِلٰى أَرْوَاحِ جَمِيْعِ إِخْوَانِهِ مِنَ الْأَنْبِيَاءِ وَالْمُرْسَلِيْنَ وَالشُّهَدَاءِ وَالصَّالِحِيْنَ وَالْأَوْلِيَاءِ وَالْعُلَمَاءِ وَالْمَشَايِخِ خُصُوْصًا سَيِّدِنَا الشَّيْخِ عَبْدِ الْقَادِرِ الْجَيْلَانِي وَآبَائِنَا وَأُمَّهَاتِنَا وَأَجْدَادِنَا وَجَدَّاتِنَا وَأَسَاتِذَتِنَا وَجَمِيْعِ أَهْلِ الْقُبُوْرِ مِنَ الْمُسْلِمِيْنَ وَالْمُسْلِمَاتِ وَالْمُؤْمِنِيْنَ وَالْمُؤْمِنَاتِ ۝\nاَللّٰهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ وَعَافِهِمْ وَاعْفُ عَنْهُمْ ۝ اَللّٰهُمَّ أَنْزِلِ الرَّحْمَةَ وَالْمَغْفِرَةَ عَلٰى أَهْلِ الْقُبُوْرِ مِنْ أَهْلِ لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ رَسُوْلُ اللهِ ۝ رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ ۝ سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُوْنَ وَسَلَامٌ عَلَى الْمُرْسَلِيْنَ وَالْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ ۝ اَلْفَاتِحَةُ',
    latin:
      "A'ūżu billāhi minasy-syaiṭānir-rajīm, Bismillāhir-raḥmānir-raḥīm. Alḥamdulillāhi rabbil-'ālamīn ḥamdasy-syākirīn ḥamdan-nā'imīn ḥamday yuwāfī ni'amahū wa yukāfi'u mazīdah. Yā rabbanā lakal-ḥamdu kamā yanbaghī lijalāli wajhika wa 'aẓīmi sulṭānik. Allāhumma ṣalli wa sallim 'alā sayyidinā Muḥammadin wa 'alā āli sayyidinā Muḥammad. Allāhumma taqabbal wa auṣil ṡawāba mā qara'nāhu minal-Qur'ānil-'aẓīmi wa mā hallalnā wa mā sabbaḥnā wa mastaghfarnā wa mā ṣallainā 'alā sayyidinā Muḥammadin ṣallallāhu 'alaihi wa sallama hadiyyatan wāṣilatan wa raḥmatan nāzilatan wa barakatan syāmilatan ilā ḥaḍrati sayyidinā Muḥammadin ṣallallāhu 'alaihi wa sallam, ṡumma ilā arwāḥi ābā'inā wa ummahātinā wa asātiżatinā wa jamī'i ahlil-qubūr. Allāhummaghfir lahum warḥamhum wa 'āfihim wa'fu 'anhum. Allāhumma anzilir-raḥmata wal-maghfirata 'alā ahlil-qubūri min ahli Lā ilāha illallāhu Muḥammadur-rasūlullāh. Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā 'ażāban-nār. Subḥāna rabbika rabbil-'izzati 'ammā yaṣifūn wa salāmun 'alal-mursalīn wal-ḥamdulillāhi rabbil-'ālamīn. Al-Fātiḥah.",
    arti:
      'Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah Tuhan semesta alam. Ya Allah, terimalah dan sampaikanlah pahala bacaan Al-Qur’an yang mulia, tahlil, tasbih, istighfar, dan shalawat yang telah kami baca sebagai hadiah yang sampai, rahmat yang turun, dan berkah yang melimpah kepada baginda Nabi Muhammad ﷺ, para nabi, wali, ulama, guru-guru kami, kedua orang tua kami, serta seluruh ahli kubur kaum mukminin. Ya Allah ampunilah mereka, rahmatilah mereka, sejahterakanlah mereka dan maafkanlah segala dosa mereka. Kurniakan kami kebaikan dunia dan akhirat serta lindungilah dari siksa neraka.',
  },
];

// ============================================================================
// MAHALLUL QIYAM LENGKAP (VERSI GRUP REBANA AZ-ZAHIR) & SYAIR PESANTREN
// ============================================================================
export const MAHALLUL_QIYAM_AZ_ZAHIR: QasidahItem = {
  no: 1,
  judul: 'Mahallul Qiyam Lengkap (Versi Majelis Az-Zahir)',
  subKategori: 'Mahallul Qiyam Az-Zahir',
  arabTitle: 'مَحَلُّ الْقِيَامِ (الزَّاهِر)',
  baits: [
    {
      arab: 'اَللّٰهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَيْهِ وَعَلٰى آلِهِ\nيَا نَبِي سَلَامٌ عَلَيْكَ ۞ يَا رَسُوْلُ سَلَامٌ عَلَيْكَ\nيَا حَبِيْبُ سَلَامٌ عَلَيْكَ ۞ صَلَوَاتُ اللهِ عَلَيْكَ',
      latin:
        "Allāhumma ṣalli wa sallim wa bārik 'alaihi wa 'alā ālih\nYā nabī salāmun 'alaika ۞ Yā rasūlu salāmun 'alaika\nYā ḥabību salāmun 'alaika ۞ Ṣalawātullāhi 'alaika",
      arti:
        'Ya Allah limpahkan rahmat, salam, dan berkah kepada beliau dan keluarganya. Wahai Nabi salam sejahtera bagimu, wahai Rasul salam sejahtera bagimu, wahai Kekasih salam sejahtera bagimu, shalawat Allah selalu tercurah atasmu.',
    },
    {
      arab: 'أَشْرَقَ الْكَوْنُ ابْتِهَاجًا ۞ بِوُجُوْدِ الْمُصْطَفٰى أَحْمَدْ\nوَلِأَهْلِ الْكَوْنِ أُنْسٌ ۞ وَسُرُوْرٌ قَدْ تَجَدَّدْ',
      latin:
        'Asyraqal-kaunub-tihājan ۞ biwujūdil-Muṣṭafā Aḥmad\nWa li-ahlil-kauni unsun ۞ wa surūrun qad tajaddad',
      arti:
        'Semesta bersinar penuh kegembiraan dengan hadirnya Nabi pilihan Ahmad. Bagi segenap penghuni alam semesta lahir kedamaian dan kebahagiaan yang terus bersemi.',
    },
    {
      arab: 'فَاطْرَبُوْا يَا أَهْلَ الْمَثَانِيْ ۞ فَهَزَارُ الْيُمْنِ غَرَّدْ\nوَاسْتَضِيْئُوْا بِجَمَالٍ ۞ فَاقَ فِي الْحُسْنِ تَفَرَّدْ',
      latin:
        'Faṭrabū yā ahlal-maṡānī ۞ fahazārul-yumni gharrad\nWastaḍī’ū bijamālin ۞ fāqa fil-ḥusni tafarrad',
      arti:
        'Bergembiralah wahai ahli Al-Qur’an karena burung keberkahan telah berkicau merdu. Mintalah cahaya dari keindahan budi dan rupa beliau yang tiada tandingannya.',
    },
    {
      arab: 'وَلَنَا الْبُشْرٰى بِسَعْدٍ ۞ مُسْتَمِرٍّ لَيْسَ يَنْفَدْ\nحَيْثُ أُوْتِيْنَا عَطَاءً ۞ جَمَعَ الْفَخْرَ الْمُؤَبَّدْ',
      latin:
        "Wa lanal-busyrā bisa'din ۞ mustamirrīn laisa yanfad\nḤaiṡu ūtīnā 'aṭā'an ۞ jama'al-fakhral-mu'abbad",
      arti:
        'Bagi kami kabar gembira berupa kebahagiaan abadi yang tak pernah habis, karena kita dikaruniai anugerah yang menghimpun kemuliaan sepanjang masa.',
    },
    {
      arab: 'فَلِرَبِّيْ كُلُّ حَمْدٍ ۞ جَلَّ أَنْ يَحْصُرَهُ الْعَدْ\nإِذْ حَبَانَا بِوُجُوْدِ ۞ الْمُصْطَفٰى الْهَادِيْ مُحَمَّدْ',
      latin:
        "Falirabbī kullu ḥamdin ۞ jalla ay yaḥṣurahul-'ad\nIż ḥabānā biwujūdil- ۞ Muṣṭafal-hādī Muḥammad",
      arti:
        'Segala puji bagi Tuhanku yang tak terhitung bilangannya, atas karunia-Nya mengutus Sang Terpilih penunjuk jalan, Nabi Muhammad ﷺ.',
    },
    {
      arab: 'يَا رَسُوْلَ اللهِ أَهْلًا ۞ بِكَ إِنَّا بِكَ نُسْعَدْ\nوَبِجَاهِهْ يَا إِلٰهِيْ ۞ جُدْ وَبَلِّغْ كُلَّ مَقْصَدْ',
      latin:
        'Yā rasūlallāhi ahlan ۞ bika innā bika nus‘ad\nWa bijāhih yā ilāhī ۞ jud wa balligh kulla maqṣad',
      arti:
        'Wahai Rasulullah selamat datang, sungguh dengan engkau kami berbahagia. Dengan derajat agung beliau ya Tuhanku, bermurah hatilah sampaikanlah seluruh cita-cita kami.',
    },
    {
      arab: 'مَرْحَبًا يَا نُوْرَ الْعَيْنِ ۞ مَرْحَبًا مَرْحَبًا\nمَرْحَبًا جَدَّ الْحُسَيْنِ ۞ مَرْحَبًا مَرْحَبًا\nيَا حَبِيْبِيْ يَا مُحَمَّدْ ۞ يَا عَرُوْسَ الْخَافِقَيْنِ\nيَا مُؤَيَّدُ يَا مُمَجَّدْ ۞ يَا إِمَامَ الْقِبْلَتَيْنِ',
      latin:
        "Marḥaban yā nūral-'aini ۞ Marḥaban marḥaban\nMarḥaban jaddal-Ḥusaini ۞ Marḥaban marḥaban\nYā ḥabībī yā Muḥammad ۞ yā 'arūsal-khāfiqaini\nYā mu'ayyadu yā mumajjad ۞ yā imāmal-qiblataini",
      arti:
        'Selamat datang wahai cahaya mata, selamat datang wahai kakek Al-Husain. Wahai kekasihku Muhammad sang pengantin timur dan barat, sang nabi yang dikuatkan dan diagungkan, imam dua kiblat.',
    },
    {
      arab: 'صَلِّ عَلٰى مُحَمَّدْ ۞ صَلِّ عَلٰى مُحَمَّدْ\nرَبِّ فَاغْفِرْ لِيْ ذُنُوْبِيْ ۞ بِبَرْكَةِ الْهَادِيْ مُحَمَّدْ\nرَبِّ فَاجْعَلْ مُجْتَمَعْنَا ۞ غَايَتُهُ حُسْنُ الْخِتَامِ\nوَاعْطِنَا مَا قَدْ سَأَلْنَا ۞ مِنْ عَطَايَاكَ الْجِسَامِ',
      latin:
        "Ṣalli 'alā Muḥammad ۞ Ṣalli 'alā Muḥammad\nRabbi faghfir lī żunūbī ۞ bibarkatil-hādī Muḥammad\nRabbi faj'al mujtama'nā ۞ ghāyatuhū ḥusnul-khitām\nWa'ṭinā mā qad sa'alnā ۞ min 'aṭāyākal-jisām",
      arti:
        'Curahkan shalawat atas Muhammad. Wahai Tuhanku ampunilah dosa-dosaku berkat sang pembawa petunjuk Muhammad ﷺ. Jadikanlah perkumpulan kami berakhir dengan husnul khatimah dan berikan segala hajat yang kami mohonkan.',
    },
    {
      arab: 'طَلَعَ الْبَدْرُ عَلَيْنَا ۞ مِنْ ثَنِيَّاتِ الْوَدَاعِ\nوَجَبَ الشُّكْرُ عَلَيْنَا ۞ مَا دَعَا لِلّٰهِ دَاعِ\nأَيُّهَا الْمَبْعُوْثُ فِيْنَا ۞ جِئْتَ بِالْأَمْرِ الْمُطَاعِ\nصَلَّى اللهُ عَلٰى مُحَمَّدْ ۞ صَلَّى اللهُ عَلَيْهِ وَسَلَّمْ',
      latin:
        "Ṭala'al-badru 'alainā ۞ min ṡaniyyātil-wadā'\nWajabasy-syukru 'alainā ۞ mā da'ā lillāhi dā'\nAyyuhal-mab'ūṡu fīnā ۞ ji'ta bil-amril-muṭā'\nṢallallāhu 'alā Muḥammad ۞ Ṣallallāhu 'alaihi wa sallam",
      arti:
        'Bulan purnama telah terbit menyinari kami dari celah bukit Wada’. Wajib atas kami bersyukur selama penyeru menyeru kepada Allah. Wahai utusan di tengah kami, engkau membawa perintah yang ditaati. Rahmat dan salam Allah semoga selalu atas Nabi Muhammad ﷺ.',
    },
    {
      arab: 'وَاكْرِمِ الْأَرْوَاحَ مِنَّا ۞ بِالِّقَا خَيْرِ الْأَنَامِ\nوَابْلُغِ الْمُخْتَارَ عَنَّا ۞ مِنْ صَلَاةٍ وَسَلَامٍ\nصَلَّى اللهُ عَلٰى مُحَمَّدْ ۞ صَلَّى اللهُ عَلَيْهِ وَسَلَّمْ',
      latin:
        "Wakrimil-arwāḥa minnā ۞ biliqā khairil-anām\nWablughil-mukhtāra 'annā ۞ min ṣalātin wa salām\nṢallallāhu 'alā Muḥammad ۞ Ṣallallāhu 'alaihi wa sallam",
      arti:
        'Muliakanlah ruh kami untuk dapat berjumpa dengan sebaik-baik manusia, dan sampaikanlah kepada Nabi pilihan salam dan shalawat dari kami.',
    },
  ],
};

export const SYAIR_PESANTREN_LENGKAP: QasidahItem[] = [
  MAHALLUL_QIYAM_AZ_ZAHIR,
  {
    no: 2,
    judul: "Syi'ir Tanpo Waton (KH. Abdurrahman Wahid / Gus Dur)",
    subKategori: 'Syair & Qasidah',
    arabTitle: 'شِعْرُ تَنْفَا وَتَنْ',
    baits: [
      {
        arab: 'أَسْتَغْفِرُ اللهَ رَبَّ الْبَرَايَا ۞ أَسْتَغْفِرُ اللهَ مِنَ الْخَطَايَا\nرَبِّ زِدْنِي عِلْمًا نَافِعًا ۞ وَوَفِّقْنِي عَمَلًا صَالِحًا',
        latin:
          "Astaghfirullāha rabbal-barāyā ۞ Astaghfirullāha minal-khaṭāyā\nRabbi zidnī 'ilman nāfi'ā ۞ wa waffiqnī 'amalan ṣāliḥā",
        arti:
          'Aku memohon ampun kepada Allah Tuhan semesta alam dari segala kesalahan. Ya Tuhanku tambahkanlah ilmu yang bermanfaat dan berilah taufik untuk beramal shalih.',
      },
      {
        arab: 'Ngawiti ingsun nglaras syi’iran ۞ Kelawan muji maring Pengeran\nKang paring rahmat lan kenikmatan ۞ Rino wengine tanpo petungan',
        latin:
          'Duh bolo konco prio wanito ۞ Ojo mung ngaji syareat bloko\nGur pinter ndongeng nulis lan moco ۞ Tembe mburine bakal sengsoro',
        arti:
          'Aku memulai melantunkan syair dengan memuji Tuhan yang melimpahkan rahmat dan nikmat tanpa terhitung. Wahai sahabat pria dan wanita, jangan sekadar mengaji syariat luarnya saja hingga hanya pandai membaca tanpa menghayati maknanya.',
      },
      {
        arab: 'Akeh kang apal Qur’an haditse ۞ Seneng ngafirke marang liyane\nKafire dewe dak digatekke ۞ Yen isih kotor ati akale',
        latin:
          'Gampang kabujuk nafsu angkoro ۞ Ing pepaese gebyare ndunyo\nIri lan meri sugihe tonggo ۞ Mulo atine peteng lan nisto',
        arti:
          'Banyak yang hafal Qur’an hadits namun mudah mengkafirkan sesama, kekeliruan diri sendiri tak diperhatikan selama hati dan akal masih kotor serta mudah tergoda nafsu dan iri hati.',
      },
      {
        arab: 'Ayo sedulur jo nglaleake ۞ Wajibe ngaji sak pranatane\nNggo ngandelake iman tauhide ۞ Baguse sangu mulyo matine',
        latin:
          'Kang aran sholeh bagus atine ۞ Kerono mapan seri ngilmune\nLaku thoriqot lan ma’rifate ۞ Ugo haqiqot manjing rasane',
        arti:
          'Mari saudara jangan melupakan kewajiban mengaji beserta adabnya demi memperkuat iman tauhid dan bekal mulia wafat kelak. Orang shalih itu baik hatinya karena mapan ilmunya beserta thariqat, haqiqat, dan ma’rifatnya.',
      },
      {
        arab: 'Al-Qur’an qodim wahyu minulyo ۞ Tanpo tinulis iso diwoco\nIku wejangan guru waskito ۞ Den tancepake ing njero dodo',
        latin:
          'Kumantil ati lan pikiran ۞ Mrasuk ing badan kabeh jeroan\nMu’jizat Rosul dadi pedoman ۞ Minongko dalan manjinge iman',
        arti:
          'Kalamullah yang mulia menjadi wejangan guru sejati yang ditanamkan di dada, melekat dalam hati dan pikiran sebagai pedoman masuknya iman.',
      },
      {
        arab: 'Kelawan Alloh kang Moho Suci ۞ Kudu rangkulan rino lan wengi\nDitirakati diriyadhohi ۞ Dzikir lan suluk jo nganti lali',
        latin:
          'Uripe ayem rumongso aman ۞ Dununge roso tondo yen iman\nSabar narimo najan pas-pasan ۞ Kabeh tinakdir saking Pengeran',
        arti:
          'Mendekatkan diri kepada Allah siang dan malam dengan tirakat, riyadhah, dzikir dan suluk. Hidupnya tenteram, sabar, dan qanaah menerima takdir dari Tuhan.',
      },
      {
        arab: 'Kelawan konco dulur lan tonggo ۞ Kang podo rukun ojo daksiyo\nIku sunnahe Rosul kang mulyo ۞ Nabi Muhammad panutan kito',
        latin:
          'Ayo nglakoni sekabehane ۞ Alloh kang bakal ngangkat drajate\nSenajan asor toto dhohire ۞ Ananging mulyo maqom drajate',
        arti:
          'Dengan teman, saudara dan tetangga hiduplah rukun tanpa menyakiti. Itulah sunnah mulia Nabi Muhammad ﷺ panutan kita, niscaya Allah mengangkat derajat kemuliaannya.',
      },
      {
        arab: 'Lamun palastro ing pungkasane ۞ Ora kesasar roh lan sukmane\nDen gadang Alloh suwargo manggone ۞ Utuh mayite ugo ulese',
        latin:
          'يَا رَسُوْلَ اللهِ سَلَامٌ عَلَيْكَ ۞ يَا رَفِيْعَ الشَّانِ وَالدَّرَجِ\nعَطْفَةً يَا جِيْرَةَ الْعَلَمِ ۞ يَا أُهَيْلَ الْجُوْدِ وَالْكَرَمِ',
        arti:
          'Kelak saat ajal tiba, ruh tidak tersesat dan disambut Allah di surga-Nya. Wahai Rasulullah salam atasmu wahai yang tinggi derajat dan kemuliaannya.',
      },
    ],
  },
  {
    no: 3,
    judul: "Syair Al-I'tiraf (Ilāhī Lastu lil-Firdausi Ahlā — Abu Nawas)",
    subKategori: 'Syair & Qasidah',
    arabTitle: 'الْإِعْتِرَافُ',
    baits: [
      {
        arab: 'إِلٰهِي لَسْتُ لِلْفِرْدَوْسِ أَهْلًا ۞ وَلَا أَقْوٰى عَلَى نَارِ الْجَحِيْمِ',
        latin: "Ilāhī lastu lil-firdausi ahlā ۞ wa lā aqwā 'alā nāril-jaḥīmi",
        arti: 'Wahai Tuhanku, aku bukanlah ahli surga Firdaus, namun aku pun tiada sanggup menanggung panasnya api neraka Jahim.',
      },
      {
        arab: 'فَهَبْ لِيْ تَوْبَةً وَاغْفِرْ ذُنُوْبِيْ ۞ فَإِنَّكَ غَافِرُ الذَّنْبِ الْعَظِيْمِ',
        latin: 'Fahab lī taubatan waghfir żunūbī ۞ fa innaka ghāfiruż-żanbil-‘aẓīmi',
        arti: 'Maka karuniakanlah taubat kepadaku dan ampunilah dosa-dosaku, sesungguhnya Engkaulah Maha Pengampun dosa yang besar.',
      },
      {
        arab: 'ذُنُوْبِيْ مِثْلُ أَعْدَادِ الرِّمَالِ ۞ فَهَبْ لِيْ تَوْبَةً يَا ذَا الْجَلَالِ',
        latin: 'Żunūbī miṡlu a‘dādir-rimāli ۞ fahab lī taubatan yā żal-jalāli',
        arti: 'Dosa-dosaku laksana banyaknya butiran pasir di lautan, maka karuniakanlah taubat kepadaku wahai Dzat Yang Maha Agung.',
      },
      {
        arab: 'وَعُمْرِيْ نَاقِصٌ فِيْ كُلِّ يَوْمٍ ۞ وَذَنْبِيْ زَائِدٌ كَيْفَ احْتِمَالِيْ',
        latin: 'Wa ‘umrī nāqiṣun fī kulli yaumin ۞ wa żanbī zā’idun kaifaḥtimālī',
        arti: 'Umurku terus berkurang di setiap hari, sementara dosaku semakin bertambah, betapa aku mampu menanggungnya?',
      },
      {
        arab: 'إِلٰهِي عَبْدُكَ الْعَاصِي أَتَاكَ ۞ مُقِرًّا بِالذُّنُوْبِ وَقَدْ دَعَاكَ\nفَإِنْ تَغْفِرْ فَأَنْتَ لِذَاكَ أَهْلٌ ۞ وَإِنْ تَطْرُدْ فَمَنْ نَرْجُوْ سِوَاكَ',
        latin:
          'Ilāhī ‘abdukal-‘āṣī atāka ۞ muqirran biż-żunūbi wa qad da‘āka\nFa in taghfir fa anta liżāka ahlun ۞ wa in taṭrud faman narjū siwāka',
        arti:
          'Wahai Tuhanku, hamba-Mu yang penuh maksiat ini datang bersimpuh mengakui dosa dan berdoa kepada-Mu. Jika Engkau mengampuni, Engkaulah Pemilik ampunan; namun jika Engkau menolak, kepada siapa lagi kami berharap selain Engkau?',
      },
    ],
  },
  {
    no: 4,
    judul: 'Shalawat Badar Lengkap (KH. Ali Manshur)',
    subKategori: 'Syair & Qasidah',
    arabTitle: 'صَلَوَاتُ بَدْرٍ',
    baits: [
      {
        arab: 'صَلَاةُ اللهِ سَلَامُ اللهِ ۞ عَلٰى طٰهَ رَسُوْلِ اللهِ\nصَلَاةُ اللهِ سَلَامُ اللهِ ۞ عَلٰى يٰسٓ حَبِيْبِ اللهِ',
        latin: "Ṣalātullāhi salāmullāhi 'alā Ṭāhā rasūlillāh ۞ Ṣalātullāhi salāmullāhi 'alā Yāsīn ḥabībillāh",
        arti: 'Rahmat dan keselamatan Allah semoga tercurah atas Thaha utusan Allah, serta atas Yasin kekasih Allah.',
      },
      {
        arab: 'تَوَسَّلْنَا بِبِسْمِ اللهِ ۞ وَبِالْهَادِي رَسُوْلِ اللهِ\nوَكُلِّ مُجَاهِدٍ لِلّٰهِ ۞ بِأَهْلِ الْبَدْرِ يَا اَللهُ',
        latin: 'Tawassalnā bibismillāh wa bil-hādī rasūlillāh ۞ wa kulli mujāhidin lillāh bi ahlil-badri yā Allāh',
        arti: 'Kami bertawassul dengan Bismillah dan dengan Sang Pembawa Petunjuk Rasulullah ﷺ serta seluruh pejuang di jalan Allah dengan berkah Ahli Badar ya Allah.',
      },
      {
        arab: 'إِلٰهِيْ سَلِّمِ الْأُمَّةْ ۞ مِنَ الْآفَاتِ وَالنِّقْمَةْ\nوَمِنْ هَمٍّ وَمِنْ غُمَّةْ ۞ بِأَهْلِ الْبَدْرِ يَا اَللهُ',
        latin: 'Ilāhī sallimil-ummah minal-āfāti wan-niqmah ۞ wa min hammin wa min ghummah bi ahlil-badri yā Allāh',
        arti: 'Ya Allah selamatkanlah umat ini dari malapetaka, bencana, kegelisahan dan kesedihan, dengan berkah Ahli Badar ya Allah.',
      },
      {
        arab: 'إِلٰهِيْ نَجِّنَا وَاكْشِفْ ۞ جَمِيْعَ أَذِيَّةٍ وَاصْرِفْ\nمَكَائِدَ الْعِدَا وَالْطُفْ ۞ بِأَهْلِ الْبَدْرِ يَا اَللهُ',
        latin: "Ilāhī najjinā waksyif jamī'a ażiyyatin waṣrif ۞ makā'idal-'idā walṭuf bi ahlil-badri yā Allāh",
        arti: 'Ya Allah selamatkanlah kami, singkapkan segala gangguan, jauhkan tipu daya musuh dan kasihilah kami dengan berkah Ahli Badar.',
      },
      {
        arab: 'إِلٰهِيْ اغْفِرْ وَأَكْرِمْنَا ۞ بِنَيْلِ مَطَالِبٍ مِنَّا\nوَدَفْعِ مَسَاءَةٍ عَنَّا ۞ بِأَهْلِ الْبَدْرِ يَا اَللهُ',
        latin: "Ilāhīghfir wa akrimnā binaili maṭālibin minnā ۞ wa daf'i masā'atin 'annā bi ahlil-badri yā Allāh",
        arti: 'Ya Allah ampunilah dan muliakanlah kami dengan terkabulnya cita-cita dan tertolaknya keburukan dari kami, dengan berkah Ahli Badar.',
      },
    ],
  },
  {
    no: 5,
    judul: 'Ya Lal Wathan / Subbanul Wathan (KH. Wahab Chasbullah)',
    subKategori: 'Syair & Qasidah',
    arabTitle: 'يَا لَلْوَطَنْ (حُبُّ الْوَطَنْ)',
    baits: [
      {
        arab: 'يَا لَلْوَطَنْ يَا لَلْوَطَنْ يَا لَلْوَطَنْ ۞ حُبُّ الْوَطَنْ مِنَ الْإِيْمَانْ\nوَلَا تَكُنْ مِنَ الْحِرْمَانْ ۞ اِنْهَضُوْا أَهْلَ الْوَطَنْ',
        latin: "Yā lal-waṭhan yā lal-waṭhan yā lal-waṭhan ۞ Ḥubbul-waṭhan minal-īmān\nWa lā takun minal-ḥirmān ۞ Inhaḍū ahlal-waṭhan",
        arti: 'Wahai tanah airku (3x), cinta tanah air adalah sebagian dari iman. Janganlah engkau menjadi orang yang terhalang dari kemuliaan; bangkitlah wahai putra bangsa!',
      },
      {
        arab: 'إِنْدُوْنِيْسِيَا بِلَادِيْ ۞ أَنْتَ عُنْوَانُ الْفَخَامَا\nكُلُّ مَنْ يَأْتِيْكَ يَوْمًا ۞ طَامِحًا يَلْقَ حِمَامَا',
        latin: 'Indūnīsiyā bilādī ۞ Anta ‘unwānul-fakhāmā\nKullu man ya’tīka yauman ۞ ṭāmiḥan yalqa ḥimāmā',
        arti: 'Indonesia negeriku, engkau panji kemuliaan. Siapa pun yang datang mengusik kedaulatanmu pasti akan hancur binasa.',
      },
      {
        arab: 'Pusaka hati wahai tanah airku ۞ Cintamu dalam imanku\nJangan halangkan nasibmu ۞ Bangkitlah hai bangsaku!',
        latin: 'Indonesia negriku ۞ Engkau panji martabatku\nSiapa datang mengancammu ۞ Kan binasa di bawah durimu',
        arti: 'Bait lagu perjuangan santri Nahdlatul Ulama yang membangkitkan semangat cinta tanah air dan pengabdian pesantren untuk NKRI.',
      },
    ],
  },
  {
    no: 6,
    judul: 'Qasidah Burdah Lengkap Pilihan (Imam Al-Bushiri)',
    subKategori: 'Syair & Qasidah',
    arabTitle: 'قَصِيْدَةُ الْبُرْدَةِ',
    baits: [
      {
        arab: 'مَوْلَايَ صَلِّ وَسَلِّمْ دَائِمًا أَبَدًا ۞ عَلٰى حَبِيْبِكَ خَيْرِ الْخَلْقِ كُلِّهِمِ',
        latin: "Maulāya ṣalli wa sallim dā'iman abadan ۞ 'alā ḥabībika khairil-khalqi kullihimi",
        arti: 'Wahai Tuhanku limpahkan shalawat dan salam selamanya atas kekasih-Mu sebaik-baik makhluk seluruhnya.',
      },
      {
        arab: 'مُحَمَّدٌ سَيِّدُ الْكَوْنَيْنِ وَالثَّقَلَيْنِ ۞ وَالْفَرِيْقَيْنِ مِنْ عُرْبٍ وَمِنْ عَجَمِ\nنَبِيُّنَا الْآمِرُ النَّاهِيْ فَلَا أَحَدٌ ۞ أَبَرَّ فِيْ قَوْلِ لَا مِنْهُ وَلَا نَعَمِ',
        latin:
          "Muḥammadun sayyidul-kaunaini waṡ-ṡaqalaini ۞ wal-farīqaini min 'urbin wa min 'ajami\nNabiyyunal-āmirun-nāhī falā aḥadun ۞ abarra fī qauli lā minhu wa lā na'ami",
        arti:
          'Nabi Muhammad ﷺ adalah pemimpin dua alam, golongan jin dan manusia, serta dua bangsa Arab dan non-Arab. Beliaulah nabi kita yang paling jujur dan teguh dalam amar ma’ruf nahi munkar.',
      },
      {
        arab: 'هُوَ الْحَبِيْبُ الَّذِيْ تُرْجٰى شَفَاعَتُهُ ۞ لِكُلِّ هَوْلٍ مِنَ الْأَهْوَالِ مُقْتَحَمِ\nيَا أَكْرَمَ الْخَلْقِ مَا لِيْ مَنْ أَلُوْذُ بِهِ ۞ سِوَاكَ عِنْدَ حُلُوْلِ الْحَادِثِ الْعَمَمِ',
        latin:
          "Huwal-ḥabībullażī turjā syafā'atuhū ۞ likulli haulin minal-ahwāli muqtaḥami\nYā akramal-khalqi mā lī man alūżu bihī ۞ siwāka 'inda ḥulūlil-ḥādiṡil-'amami",
        arti:
          'Beliaulah kekasih yang diharapkan syafaatnya untuk menghadapi setiap huru-hara besar. Wahai semulia-mulia makhluk, tiada tempatku berlindung selainmu saat datang cobaan yang menyeluruh.',
      },
      {
        arab: 'يَا رَبِّ بِالْمُصْطَفٰى بَلِّغْ مَقَاصِدَنَا ۞ وَاغْفِرْ لَنَا مَا مَضٰى يَا وَاسِعَ الْكَرَمِ',
        latin: "Yā rabbi bil-Muṣṭafā balligh maqāṣidanā ۞ waghfir lanā mā maḍā yā wāsi'al-karami",
        arti: 'Wahai Tuhanku dengan berkah Nabi Al-Musthafa sampaikanlah hajat tujuan kami dan ampunilah dosa kami yang telah lalu wahai Dzat Yang Maha Luas Kemurahan-Nya.',
      },
    ],
  },
  {
    no: 7,
    judul: 'Shalawat Asnawiyah (KH. Raden Asnawi Kudus)',
    subKategori: 'Syair & Qasidah',
    arabTitle: 'الصَّلَوَاتُ الْأَسْنَوِيَّةُ',
    baits: [
      {
        arab: 'يَا رَبِّ صَلِّ عَلَى الرَّسُوْلِ مُحَمَّدٍ سِرِّ الْعُلَا ۞ وَالْأَنْبِيَاءِ وَالْمُرْسَلِيْنَ الْغُرِّ خَتْمًا أَوَّلَا',
        latin: 'Yā rabbi ṣalli ‘alar-rasūli Muḥammadin sirril-‘ulā ۞ wal-anbiyā’i wal-mursalīnal-ghurri khatman awwalā',
        arti: 'Ya Tuhanku curahkan rahmat kepada Rasul Muhammad rahasia keluhuran, beserta para nabi dan rasul yang bercahaya mulia.',
      },
      {
        arab: 'يَا رَبِّ نَوِّرْ قَلْبَنَا بِنُوْرِ قُرْآنٍ جَلَا ۞ وَافْتَحْ لَنَا بِدَرْسٍ أَوْ قِرَاءَةٍ تُرَتَّلَا',
        latin: 'Yā rabbi nawwir qalbanā binūri qur’ānin jalā ۞ waftaḥ lanā bidarsin au qirā’atin turattalā',
        arti: 'Ya Tuhanku terangilah hati kami dengan cahaya Al-Qur’an yang jelas dan bukakanlah bagi kami pemahaman pelajaran serta bacaan yang tartil.',
      },
      {
        arab: 'وَارْزُقْ بِفَهْمِ الْأَنْبِيَاءِ لَنَا وَأَيِّ مَنْ تَلَا ۞ ثَبِّتْ بِهِ إِيْمَانَنَا دُنْيَا وَأُخْرٰى كَامِلَا\nأَمَانٌ أَمَانٌ أَمَانٌ أَمَانٌ ۞ بِإِنْدُوْنِيْسِيَا رَايَا أَمَانٌ ۞ آمِيْنَ',
        latin:
          'Warzuq bifahmil-anbiyā’i lanā wa ayyi man talā ۞ ṡabbit bihī īmānanā dunyā wa ukhrā kāmilā\nAmān amān amān amān ۞ bi Indūnīsiyā Rāyā amān ۞ Āmīn',
        arti:
          'Karuniakanlah pemahaman para nabi kepada kami dan setiap pembacanya, kokohkan iman kami sempurna di dunia dan akhirat. Semoga Indonesia Raya senantiasa aman tenteram. Amin.',
      },
    ],
  },
  {
    no: 8,
    judul: 'Syair Tombo Ati (Kanjeng Sunan Bonang)',
    subKategori: 'Syair & Qasidah',
    arabTitle: 'شِعْرُ تُمْبَا أَتِيْ',
    baits: [
      {
        arab: 'Tombo ati iku limo perkarane ۞ Kaping pisan moco Qur’an lan maknane\nKaping pindo sholat wengi lakonono ۞ Kaping telu wong kang sholeh kumpulono\nKaping papat kudu weteng ingkang luwe ۞ Kaping limo dzikir wengi ingkang suwe',
        latin:
          'Salah sawijine sopo biso nglakoni ۞ Mugi-mugi Gusti Alloh nyembadani',
        arti:
          'Obat hati ada lima perkara: membaca Al-Qur’an beserta maknanya, shalat malam (tahajjud), berkumpul dengan orang-orang shalih, memperbanyak puasa/menahan lapar, dan memperpanjang dzikir di keheningan malam. Barang siapa mampu mengamalkannya semoga Allah mengabulkan ketenangan hatinya.',
      },
    ],
  },
  {
    no: 9,
    judul: 'Shalawat Busyro, Nariyah & Tibbil Qulub',
    subKategori: 'Syair & Qasidah',
    arabTitle: 'صَلَوَاتُ الْبُشْرٰى وَالنَّارِيَّةِ',
    baits: [
      {
        arab: 'اَللّٰهُمَّ صَلِّ وَسَلِّمْ عَلٰى سَيِّدِنَا مُحَمَّدٍ صَاحِبِ الْبُشْرٰى صَلَاةً تُبَشِّرُنَا بِهَا وَأَهْلَنَا وَأَوْلَادَنَا وَجَمِيْعَ مَشَايِخِنَا وَمُعَلِّمِيْنَا وَطَلَبَتَنَا وَطَالِبَاتِنَا مِنْ يَوْمِنَا هٰذَا إِلٰى يَوْمِ الْآخِرَةِ',
        latin:
          "Allāhumma ṣalli wa sallim 'alā sayyidinā Muḥammadin ṣāḥibil-busyrā ṣalātan tubasysyirunā bihā wa ahlanā wa aulādanā wa jamī'a masyāyikhinā wa mu'allimīnā wa ṭalabatanā wa ṭālibātinā min yauminā hāżā ilā yaumil-ākhirah",
        arti:
          'Ya Allah curahkan shalawat dan salam atas junjungan kami Nabi Muhammad pemilik kabar gembira, shalawat yang menggembirakan kami, keluarga, anak-anak, guru-guru, dan santri putra-putri kami sejak hari ini hingga hari akhir.',
      },
      {
        arab: 'اَللّٰهُمَّ صَلِّ صَلَاةً كَامِلَةً وَسَلِّمْ سَلَامًا تَامًّا عَلٰى سَيِّدِنَا مُحَمَّدِ الَّذِيْ تَنْحَلُّ بِهِ الْعُقَدُ وَتَنْفَرِجُ بِهِ الْكُرَبُ وَتُقْضٰى بِهِ الْحَوَائِجُ وَتُنَالُ بِهِ الرَّغَائِبُ وَحُسْنُ الْخَوَاتِمِ وَيُسْتَسْقَى الْغَمَامُ بِوَجْهِهِ الْكَرِيْمِ وَعَلٰى آلِهِ وَصَحْبِهِ فِيْ كُلِّ لَمْحَةٍ وَنَفَسٍ بِعَدَدِ كُلِّ مَعْلُوْمٍ لَكَ',
        latin:
          "Allāhumma ṣalli ṣalātan kāmilatan wa sallim salāman tāmman 'alā sayyidinā Muḥammadinillażī tanḥallu bihil-'uqadu wa tanfariju bihil-kurabu wa tuqḍā bihil-ḥawā'iju wa tunālu bihir-raghā'ibu wa ḥusnul-khawātimi wa yustasqal-ghamāmu biwajhihil-karīmi wa 'alā ālihī wa ṣaḥbihī fī kulli lamḥatin wa nafasin bi'adadi kulli ma'lūmin lak",
        arti:
          'Shalawat Nariyah Lengkap: Ya Allah limpahkanlah shalawat yang sempurna dan salam yang paripurna atas Nabi Muhammad ﷺ yang dengan berkahnya terurai segala kesulitan, terlepas segala kesusahan, tertunaikan segala hajat, tercapai cita-cita mulia dan husnul khatimah, serta hujan turun sebab wajah mulia beliau.',
      },
    ],
  },
];

// ============================================================================
// KITAB MANAQIB NURUL BURHANI LENGKAP (SYEKH ABDUL QADIR AL-JAILANI)
// ============================================================================
export const MANAQIB_NURUL_BURHANI_GROUP: WiridDoaGroup = {
  no: 8,
  tab: 'wirid',
  judul: 'Manaqib Nurul Burhani (Syekh Abdul Qadir Al-Jailani)',
  jumlahBacaan: 10,
  items: [
    {
      id: 'mn-1',
      judul: '1. Tawassul Fatihah Manaqib Nurul Burhani',
      arab: 'اَلْفَاتِحَةُ إِلَى حَضْرَةِ النَّبِيِّ الْمُصْطَفٰى مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ ۞ ثُمَّ إِلَى حَضْرَةِ سُلْطَانِ الْأَوْلِيَاءِ وَغَوْثِ الْأَعْظَمِ الْقُطْبِ الرَّبَّانِي سَيِّدِنَا الشَّيْخِ مُحْيِ الدِّيْنِ عَبْدِ الْقَادِرِ الْجَيْلَانِي قَدَّسَ اللهُ سِرَّهُ الْعَزِيْزَ ۞ وَأُصُوْلِهِ وَفُرُوْعِهِ وَمُرِيْدِيْهِ ۞ وَخُصُوْصًا إِلٰى مُؤَلِّفِ هٰذَا الْكِتَابِ النُّوْرِ الْبُرْهَانِي (الشَّيْخِ مُصْلِحِ بْنِ عَبْدِ الرَّحْمٰنِ الْمَرَاقِي) وَمَشَايِخِ مَعْهَدِ دَارِ السَّلَامِ ۞ اَلْفَاتِحَةُ',
      latin:
        "Al-Fātiḥatu ilā ḥaḍratin-nabiyyil-muṣṭafā Muḥammadin ṣallallāhu 'alaihi wa sallam, ṡumma ilā ḥaḍrati Sulṭānil-Auliyā'i Sayyidināsy-Syaikh Muḥyiddīn 'Abdil Qādir al-Jīlānī qaddasallāhu sirrahul-'azīz, wa khuṣūṣan ilā mu'allifi Kitābin-Nūril-Burhānī (KH. Muslih bin Abdurrahman Mranggen) wa masyāyikhi Dāris-Salām. Al-Fātiḥah.",
      arti:
        'Kirim hadiah Surat Al-Fatihah kepada Nabi Muhammad ﷺ, Sulthanul Auliya Syekh Abdul Qadir Al-Jailani beserta guru, keturunan dan murid-murid beliau, serta penyusun Kitab Manaqib Nurul Burhani (Simbah KH. Muslih Abdurrahman Al-Maraqi) dan para masyayikh PP NU Darussalam.',
    },
    {
      id: 'mn-2',
      judul: '2. Muqaddimah Kitab Nurul Burhani',
      arab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۞ اَلْحَمْدُ لِلّٰهِ الَّذِيْ نَوَّرَ قُلُوْبَ الْعَارِفِيْنَ بِأَنْوَارِ مَعْرِفَتِهِ ۞ وَزَيَّنَ أَسْرَارَ الْأَوْلِيَاءِ بِشُمُوْسِ مَحَبَّتِهِ ۞ وَأَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيْكَ لَهُ ۞ وَأَشْهَدُ أَنَّ سَيِّدَنَا مُحَمَّدًا عَبْدُهُ وَرَسُوْلُهُ',
      latin:
        "Bismillāhir-raḥmānir-raḥīm. Al-ḥamdu lillāhillażī nawwara qulūbal-'ārifīna bi'anwāri ma'rifatihi wa zayyana asrāral-auliyā'i bisyumūsi maḥabbatih, wa asyhadu allā ilāha illallāhu waḥdahū lā syarīka lahū wa asyhadu anna sayyidanā Muḥammadan 'abduhū wa rasūluh.",
      arti:
        'Segala puji bagi Allah yang telah menerangi hati orang-orang makrifat dengan cahaya pengenalan kepada-Nya dan menghiasi rahasia para wali dengan mentari cinta-Nya.',
    },
    {
      id: 'mn-3',
      judul: '3. Manqobah Pasal 1: Nasab Mulia & Kelahiran di Jilan (470 H)',
      arab: 'وُلِدَ سَيِّدُنَا الشَّيْخُ عَبْدُ الْقَادِرِ الْجَيْلَانِيْ بِجِيْلَانَ سَنَةَ سَبْعِيْنَ وَأَرْبَعِمِائَةٍ مِنَ الْهِجْرَةِ ۞ وَهُوَ الشَّيْخُ عَبْدُ الْقَادِرِ بْنُ أَبِيْ صَالِحٍ مُوْسٰى جَنْكِيْ دُوْسَتِ بْنِ عَبْدِ اللهِ الْجِيْلِيِّ الْحَسَنِيِّ وَالْحُسَيْنِيِّ، يَتَّصِلُ نَسَبُهُ مِنْ أَبِيْهِ بِالْإِمَامِ الْحَسَنِ السِّبْطِ وَمِنْ أُمِّهِ أُمِّ الْخَيْرِ فَاطِمَةَ بِالْإِمَامِ الْحُسَيْنِ السِّبْطِ رَضِيَ اللهُ عَنْهُمَا',
      latin:
        "Wulida Sayyidunāsy-Syaikh 'Abdul Qādir al-Jīlānī bi Jīlāna sanata sab'īna wa arba'imi'atin minal-hijrah (470 H), wa huwa 'Abdul Qādir bin Abī Ṣāliḥ Mūsā Jankī Dūst, yattaṣilu nasabuhū min abīhi bil-Imām al-Ḥasan as-Sibṭi wa min ummihi Ummil-Khairi Fāṭimata bil-Imām al-Ḥusain as-Sibṭi raḍiyallāhu 'anhumā.",
      arti:
        'Syekh Abdul Qadir Al-Jailani lahir di negeri Jilan (Iran) tahun 470 H. Nasab beliau bersambung mulia melalui ayahanda Abu Shalih Musa kepada Sayyidina Hasan r.a., dan melalui ibunda Ummul Khair Fatimah kepada Sayyidina Husain r.a., keduanya cucu Rasulullah ﷺ.',
    },
    {
      id: 'mn-4',
      judul: '4. Manqobah Pasal 2–3: Berpuasa Sejak Bayi & Kejujuran kepada Perampok',
      arab: 'كَانَ رَضِيَ اللهُ عَنْهُ لَا يَرْتَضِعُ ثَدْيَ أُمِّهِ فِيْ نَهَارِ رَمَضَانَ مُنْذُ صِغَرِهِ ۞ وَلَمَّا بَلَغَ ثَمَانِيَ عَشْرَةَ سَنَةً خَرَجَ إِلٰى بَغْدَادَ لِطَلَبِ الْعِلْمِ وَأَوْصَتْهُ أُمُّهُ بِالصِّدْقِ ۞ فَلَمَّا أَخَذَ اللُّصُوْصُ قَافِلَتَهُمْ صَدَقَهُمْ بِمَا مَعَهُ مِنْ أَرْبَعِيْنَ دِيْنَارًا فَتَابَ اللُّصُوْصُ عَلٰى يَدَيْهِ',
      latin:
        "Kāna raḍiyallāhu 'anhu lā yartaḍi'u ṡadya ummihī fī nahāri Ramaḍān munżu ṣigharih. Wa lammā balagha ṡamāniya 'asyrata sanatan kharaja ilā Baghdāda liṭalabil-'ilmi wa auṣathu ummuhū biṣ-ṣidq, fashadaqal-luṣūṣa bi arba'īna dīnāran fatābal-luṣūṣu 'alā yadaih.",
      arti:
        'Sejak bayi beliau tidak pernah menyusu di siang hari bulan Ramadhan sebagai tanda kewalian. Pada usia 18 tahun beliau merantau ke Baghdad menuntut ilmu dengan wasiat ibundanya untuk selalu jujur; kejujurannya menyebut 40 dinar yang tersimpan di baju membuat pemimpin 60 perampok tersentuh dan bertaubat di hadapannya.',
    },
    {
      id: 'mn-5',
      judul: '5. Manqobah Pasal 4–5: Riyadhah 25 Tahun & Dakwah di Baghdad',
      arab: 'مَكَثَ رَضِيَ اللهُ عَنْهُ فِيْ صَحَارٰى الْعِرَاقِ خَمْسًا وَعِشْرِيْنَ سَنَةً يَرْتَاضُ وَيُجَاهِدُ نَفْسَهُ ۞ ثُمَّ صَعِدَ الْكُرْسِيَّ بِبَغْدَادَ فَأَحْيَا اللهُ بِهِ الدِّيْنَ وَسُمِّيَ مُحْيِ الدِّيْنِ ۞ وَأَسْلَمَ عَلٰى يَدَيْهِ أَكْثَرُ مِنْ خَمْسَةِ آلَافٍ مِنَ الْيَهُوْدِ وَالنَّصَارٰى وَتَابَ مِائَةُ أَلْفٍ مِنَ الْعُصَاةِ',
      latin:
        "Makaṡa raḍiyallāhu 'anhu fī ṣaḥāral-'Irāqi khamsan wa 'isyrīna sanatan yartāḍu wa yujāhidu nafsah, ṡumma ṣa'idal-kursiyya bi Baghdāda fa aḥyallāhu bihid-dīna wa summiya Muḥyiddīn, wa aslama 'alā yadaihi akṡaru min khamsati ālāfin minal-yahūdi wan-naṣārā wa tāba mi'atu alfin minal-'uṣāh.",
      arti:
        'Beliau bermujahadah di padang Irak selama 25 tahun sebelum mengajar di Baghdad. Allah menghidupkan kembali semangat agama melalui lisan beliau (bergelar Muhyiddin). Lebih dari lima ribu ahli kitab masuk Islam dan seratus ribu pelaku maksiat bertaubat di majelis beliau.',
    },
    {
      id: 'mn-6',
      judul: '6. Manqobah Pasal 6–7: Derajat Quthub Rabbani & Karomah Agung',
      arab: 'قَالَ سَيِّدُنَا الشَّيْخُ عَبْدُ الْقَادِرِ بِأَمْرِ رَبِّهِ: قَدَمِيْ هٰذِهِ عَلٰى رَقَبَةِ كُلِّ وَلِيِّ اللهِ ۞ فَتَوَاضَعَ لَهُ الْأَوْلِيَاءُ فِيْ أَقْطَارِ الْأَرْضِ فِيْ ذٰلِكَ الْعَصْرِ وَقَالُوْا: سَمْعًا وَطَاعَةً لِسُلْطَانِ الْأَوْلِيَاءِ',
      latin:
        "Qāla Sayyidunāsy-Syaikh 'Abdul Qādir bi'amri rabbihī: Qadamī hāżihī 'alā raqabati kulli walīyillāh. Fatawāḍa'a lahul-auliyā'u fī aqṭāril-arḍi wa qālū sam'an wa ṭā'atan li Sulṭānil-Auliyā'.",
      arti:
        'Dengan perintah Allah SWT, Syekh Abdul Qadir mengucapkan kalimat agung: "Kakiku ini berada di atas pundak seluruh wali Allah." Seketika para wali di seluruh penjuru bumi menundukkan kepala mengakui kedudukan beliau sebagai Sulthanul Auliya.',
    },
    {
      id: 'mn-7',
      judul: '7. Manqobah Pasal 8–9: Wafat di Baghdad (561 H) & Wasiat Thariqah Qadiriyah',
      arab: 'تُوُفِّيَ رَضِيَ اللهُ عَنْهُ لَيْلَةَ السَّبْتِ فِيْ شَهْرِ رَبِيْعِ الثَّانِيْ سَنَةَ إِحْدٰى وَسِتِّيْنَ وَخَمْسِمِائَةٍ (٥٦١ هـ) وَدُفِنَ بِبَغْدَادَ ۞ وَأَوْصٰى: إِلَيْكُمْ بِتَقْوَى اللهِ وَحِفْظِ الْجَوَارِحِ وَطَلَبِ الرِّزْقِ الْحَلَالِ وَحُسْنِ الْخُلُقِ وَسَلَامَةِ الصَّدْرِ',
      latin:
        "Tuwuffiya raḍiyallāhu 'anhu lailatas-sabti fī syahri Rabī'iṡ-Ṡānī sanata iḥdā wa sittīna wa khamsimi'atin (561 H) wa dufina bi Baghdād. Wa auṣā: Ilaikum bitaqwallāhi wa ḥifẓil-jawāriḥi wa ṭalabir-rizqil-ḥalāli wa ḥusnil-khuluqi wa salāmatiṣ-ṣadr.",
      arti:
        'Beliau wafat pada malam Sabtu bulan Rabiul Akhir tahun 561 H dan dimakamkan di Baghdad. Wasiat pokok beliau: bertaqwa kepada Allah, menjaga anggota tubuh, mencari rezeki halal, berakhlak mulia, dan berlapang dada.',
    },
    {
      id: 'mn-8',
      judul: '8. Qasidah Manaqib: ‘Ibādallāh Rijālallāh',
      arab: 'عِبَادَ اللهِ رِجَالَ اللهِ ۞ أَغِيْثُوْنَا لِأَجْلِ اللهِ\nوَكُوْنُوْا عَوْنَنَا لِلّٰهِ ۞ عَسٰى نَحْظٰى بِفَضْلِ اللهِ\nوَيَا أَقْطَابُ وَيَا أَنْجَابُ ۞ وَيَا سَادَاتُ وَيَا أَحْبَابُ\nوَأَنْتُمْ يَا أُولِي الْأَلْبَابِ ۞ تَعَالَوْا وَانْصُرُوْا لِلّٰهِ\nسَأَلْنَاكُمْ سَأَلْنَاكُمْ ۞ وَلِلزُّلْفٰى رَجَوْنَاكُمْ\nوَفِيْ أَمْرٍ قَصَدْنَاكُمْ ۞ فَشُدُّوْا عَزْمَكُمْ لِلّٰهِ',
      latin:
        "‘Ibādallāh rijālallāh ۞ aghīṡūnā li’ajlillāh\nWa kūnū ‘aunanā lillāh ۞ ‘asā naḥẓā bifaḍlillāh\nWa yā aqṭābu wa yā anjāb ۞ wa yā sādātu wa yā aḥbāb\nWa antum yā ulil-albāb ۞ ta‘ālau wanṣurū lillāh\nSa’alnākum sa’alnākum ۞ wa liz-zulfā rajaunākum\nWa fī amrin qaṣadnākum ۞ fasyuddū ‘azmakum lillāh",
      arti:
        'Wahai hamba-hamba Allah para wali Allah, tolonglah kami karena Allah dan jadilah pembantu kami di jalan Allah agar kami beroleh anugerah Allah. Wahai para wali Quthub, Anjab, Sadah, dan Ahli Makrifat, hadirlah dan kuatkan doa demi kejayaan agama Allah.',
    },
    {
      id: 'mn-9',
      judul: '9. Doa Penutup Manaqib Nurul Burhani (Allāhumma Bi Asmā’ikal-Ḥusnā)',
      arab: 'اَللّٰهُمَّ بِأَسْمَائِكَ الْحُسْنٰى وَبِأَسْمَاءِ نَبِيِّكَ الْمُصْطَفٰى وَبِكَرَامَةِ وَلِيِّكَ سَيِّدِنَا الشَّيْخِ عَبْدِ الْقَادِرِ الْجَيْلَانِيْ طَهِّرْ قُلُوْبَنَا مِنْ كُلِّ وَصْفٍ يُبَاعِدُنَا عَنْ مُشَاهَدَتِكَ وَمَحَبَّتِكَ ۞ وَأَمِتْنَا عَلَى السُّنَّةِ وَالْجَمَاعَةِ ۞ وَاشْرَحْ بِهَا صُدُوْرَنَا وَيَسِّرْ بِهَا أُمُوْرَنَا وَفَرِّجْ بِهَا هُمُوْمَنَا وَاكْشِفْ بِهَا غُمُوْمَنَا وَاغْفِرْ بِهَا ذُنُوْبَنَا وَاقْضِ بِهَا دُيُوْنَنَا ۞ رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ ۞ وَالْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ',
      latin:
        "Allāhumma bi'asmā'ikal-ḥusnā wa bi'asmā'i nabiyyikal-muṣṭafā wa bikarāmati walīyika sayyidināsy-Syaikh 'Abdil Qādir al-Jīlānī ṭahhir qulūbanā min kulli waṣfin yubā'idunā 'an musyāhadatika wa maḥabbatik, wa amitnā 'alas-sunnati wal-jamā'ah, wasyraḥ bihā ṣudūranā wa yassir bihā umūranā wa farrij bihā humūmanā waghfir bihā żunūbanā waqḍi bihā duyūnanā. Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā 'ażāban-nār.",
      arti:
        'Ya Allah, dengan berkah Asmaul Husna, kemuliaan Nabi pilihan-Mu, dan karomah wali-Mu Syekh Abdul Qadir Al-Jailani, sucikanlah hati kami, wafatkanlah kami di atas Ahlussunnah wal Jamaah, lapangkan dada kami, mudahkan urusan kami, hapus duka kami, ampuni dosa kami, dan lunaskan hutang-hutang kami. Amin.',
    },
    {
      id: 'mn-10',
      judul: '10. Ya Arhamar Rahimin (Dzikir Pengiring Manaqib)',
      arab: 'يَا أَرْحَمَ الرَّاحِمِيْنَ (٣×) ۞ فَرِّجْ عَلَى الْمُسْلِمِيْنَ',
      latin: "Yā Arḥamar-Rāḥimīn (3x) ۞ farrij 'alal-muslimīn",
      arti: 'Wahai Dzat Yang Maha Pengasih dari segala pengasih, lapangkanlah kesulitan seluruh kaum muslimin.',
    },
  ],
};

// ============================================================================
// KITAB HAIKAL NURONI LENGKAP (HAIKAL 1 – 7 + DOA)
// ============================================================================
export const KITAB_HAIKAL_NURONI_GROUP: WiridDoaGroup = {
  no: 9,
  tab: 'wirid',
  judul: 'Kitab Haikal Nuroni Lengkap (Haikal 1–7)',
  jumlahBacaan: 9,
  items: [
    {
      id: 'hk-0',
      judul: 'Pembukaan & Hadiah Fatihah Kitab Haikal Nuroni',
      arab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۞ إِلٰى حَضْرَةِ النَّبِيِّ مُحَمَّدٍ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ وَأَصْحَابِهِ وَأَهْلِ بَيْتِهِ وَجَمِيْعِ الْأَنْبِيَاءِ وَالْمُرْسَلِيْنَ وَالْأَوْلِيَاءِ الصَّالِحِيْنَ، اَلْفَاتِحَةُ',
      latin:
        "Bismillāhir-raḥmānir-raḥīm. Ilā ḥaḍratin-nabiyyi Muḥammadin ṣallallāhu 'alaihi wa sallama wa aṣḥābihī wa ahli baitihī wa jamī'il-anbiyā'i wal-mursalīna wal-auliyā'iṣ-ṣāliḥīn, Al-Fātiḥah.",
      arti:
        'Pembukaan Kitab Haikal Nuroni (Benteng Cahaya Tujuh Ayat Penjagaan) yang masyhur diamalkan di pesantren Nusantara untuk perlindungan lahir batin, keselamatan perjalanan, dan ketenangan jiwa.',
    },
    {
      id: 'hk-1',
      judul: 'Haikal Pertama (Ayat Kursi & Perlindungan Alam Semesta)',
      arab: `بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۞ أُعِيْذُ نَفْسِيْ بِاللّٰهِ الْعَلِيِّ الْعَظِيْمِ ۞ ${AYAT_KURSI_COMPLETE.arab} ۞ وَصَلَّى اللّٰهُ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَعَلٰى آلِهِ وَصَحْبِهِ أَجْمَعِيْنَ`,
      latin: `Bismillāhir-raḥmānir-raḥīm. U‘īżu nafsī billāhil-‘aliyyil-‘aẓīm. ${AYAT_KURSI_COMPLETE.latin} Wa ṣallallāhu ‘alā sayyidinā Muḥammadin wa ‘alā ālihī wa ṣaḥbihī ajma‘īn.`,
      arti:
        'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Aku berlindung diri dengan Allah Yang Mahatinggi lagi Mahaagung. (Membaca Ayat Kursi lengkap sebagai benteng pertama).',
    },
    {
      id: 'hk-2',
      judul: 'Haikal Kedua (Doa Keselamatan & Kebersihan Keluarga — Ali ‘Imran & Al-Ahzab)',
      arab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۞ أُعِيْذُ نَفْسِيْ بِاللّٰهِ الْعَلِيِّ الْعَظِيْمِ ۞ إِذْ قَالَتِ امْرَأَتُ عِمْرٰنَ رَبِّ إِنِّيْ نَذَرْتُ لَكَ مَا فِيْ بَطْنِيْ مُحَرَّرًا فَتَقَبَّلْ مِنِّيْ ۖ إِنَّكَ أَنْتَ السَّمِيْعُ الْعَلِيْمُ ۞ وَسَلَامٌ عَلَى الْمُرْسَلِيْنَ وَالْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ ۞ إِنَّمَا يُرِيْدُ اللّٰهُ لِيُذْهِبَ عَنْكُمُ الرِّجْسَ أَهْلَ الْبَيْتِ وَيُطَهِّرَكُمْ تَطْهِيْرًا ۞ يَا اَللهُ يَا كَافِيْ يَا وَفِيْ يَا حَفِيْظُ',
      latin:
        "Bismillāhir-raḥmānir-raḥīm. U‘īżu nafsī billāhil-‘aliyyil-‘aẓīm. Iż qālatimra'atu ‘Imrāna rabbi innī nażartu laka mā fī baṭnī muḥarraran fataqabbal minnī innaka antas-samī‘ul-‘alīm. Innamā yurīdullāhu liyużhiba ‘ankumur-rijsa ahlal-baiti wa yuṭahhirakum taṭhīrā. Yā Allāh Yā Kāfī Yā Wafī Yā Ḥafīẓ.",
      arti:
        'Aku berlindung kepada Allah Yang Mahatinggi lagi Mahaagung dengan firman-Nya dalam keluarga ‘Imran dan penyucian Ahlul Bait. Wahai Allah Yang Maha Mencukupi, Yang Maha Menepati Janji, dan Yang Maha Menjaga.',
    },
    {
      id: 'hk-3',
      judul: 'Haikal Ketiga (Cahaya Kebenaran & Al-Baqarah 285–286)',
      arab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۞ أُعِيْذُ نَفْسِيْ بِاللّٰهِ الْعَلِيِّ الْعَظِيْمِ ۞ آمَنَ الرَّسُوْلُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَّبِّهِ وَالْمُؤْمِنُوْنَ ۚ كُلٌّ آمَنَ بِاللّٰهِ وَمَلٰئِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّنْ رُّسُلِهِ ۚ وَقَالُوْا سَمِعْنَا وَأَطَعْنَا غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيْرُ ۞ رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِيْنَ سَبَقُوْنَا بِالْإِيْمَانِ ۞ وَصَلَّى اللّٰهُ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَسَلَّمَ',
      latin:
        "Bismillāhir-raḥmānir-raḥīm. U‘īżu nafsī billāhil-‘aliyyil-‘aẓīm. Āmanar-rasūlu bimā unzila ilaihi mir rabbihī wal-mu'minūn... Rabbanaghfir lanā wa li'ikhwāninallażīna sabaqūnā bil-īmān. Wa ṣallallāhu ‘alā sayyidinā Muḥammadin wa sallam.",
      arti:
        'Aku berlindung kepada Allah Yang Mahatinggi dengan iman Rasul dan orang-orang beriman, memohon ampunan dan keselamatan jalan kembali kepada Allah.',
    },
    {
      id: 'hk-4',
      judul: 'Haikal Keempat (Kemuliaan Al-Isrā’ 105 & Doa Tauhid)',
      arab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۞ أُعِيْذُ نَفْسِيْ بِاللّٰهِ الْعَلِيِّ الْعَظِيْمِ ۞ وَبِالْحَقِّ أَنْزَلْنَاهُ وَبِالْحَقِّ نَزَلَ ۗ وَمَا أَرْسَلْنَاكَ إِلَّا مُبَشِّرًا وَنَذِيْرًا ۞ وَقُلِ الْحَمْدُ لِلّٰهِ الَّذِيْ لَمْ يَتَّخِذْ وَلَدًا وَلَمْ يَكُنْ لَهُ شَرِيْكٌ فِي الْمُلْكِ وَلَمْ يَكُنْ لَهُ وَلِيٌّ مِّنَ الذُّلِّ وَكَبِّرْهُ تَكْبِيْرًا',
      latin:
        "Bismillāhir-raḥmānir-raḥīm. U‘īżu nafsī billāhil-‘aliyyil-‘aẓīm. Wa bil-ḥaqqi anzalnāhu wa bil-ḥaqqi nazala wa mā arsalnāka illā mubasysyiran wa nażīrā. Wa qulil-ḥamdu lillāhillażī lam yattakhiż waladan wa lam yakun lahū syarīkun fil-mulki wa lam yakun lahū walīyyun minaż-żulli wa kabbirhu takbīrā.",
      arti:
        'Dengan kebenaran Kami turunkan Al-Qur’an dan dengan kebenaran ia turun. Segala puji bagi Allah yang tidak mempunyai anak, tiada sekutu dalam kerajaan-Nya, dan tiada memerlukan penolong karena kehinaan. Agungkanlah Dia seagung-agungnya.',
    },
    {
      id: 'hk-5',
      judul: 'Haikal Kelima (Kekuatan & Keteguhan Doa Nabi Zakariya — Maryam: 4–6)',
      arab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۞ أُعِيْذُ نَفْسِيْ بِاللّٰهِ الْعَلِيِّ الْعَظِيْمِ ۞ قَالَ رَبِّ إِنِّيْ وَهَنَ الْعَظْمُ مِنِّيْ وَاشْتَعَلَ الرَّأْسُ شَيْبًا وَلَمْ أَكُنْ بِدُعَائِكَ رَبِّ شَقِيًّا ۞ وَإِنَّمَا أَمْرُهُ إِذَا أَرَادَ شَيْئًا أَنْ يَقُوْلَ لَهُ كُنْ فَيَكُوْنُ ۞ فَسُبْحَانَ الَّذِيْ بِيَدِهِ مَلَكُوْتُ كُلِّ شَيْءٍ وَإِلَيْهِ تُرْجَعُوْنَ',
      latin:
        "Bismillāhir-raḥmānir-raḥīm. U‘īżu nafsī billāhil-‘aliyyil-‘aẓīm. Qāla rabbi innī wahanal-‘aẓmu minnī wasyta‘alar-ra'su syaiban wa lam akun bidu‘ā'ika rabbi syaqiyyā. Innamā amruhū iżā arāda syai'an ay yaqūla lahū kun fayakūn. Fasubḥānallażī biyadihī malakūtu kulli syai'in wa ilaihi turja‘ūn.",
      arti:
        'Aku berlindung kepada Allah Yang Mahaagung yang urusan-Nya apabila menghendaki sesuatu cukup berfirman "Jadilah!", maka jadilah ia. Mahasuci Dzat yang di tangan-Nya kekuasaan atas segala sesuatu.',
    },
    {
      id: 'hk-6',
      judul: 'Haikal Keenam (Kemenangan Nyata & Perlindungan dari Gangguan — Al-Fath & Al-Jinn)',
      arab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۞ أُعِيْذُ نَفْسِيْ بِاللّٰهِ الْعَلِيِّ الْعَظِيْمِ ۞ إِنَّا فَتَحْنَا لَكَ فَتْحًا مُبِيْنًا ۞ لِيَغْفِرَ لَكَ اللّٰهُ مَا تَقَدَّمَ مِنْ ذَنْبِكَ وَمَا تَأَخَّرَ وَيُتِمَّ نِعْمَتَهُ عَلَيْكَ وَيَهْدِيَكَ صِرَاطًا مُسْتَقِيْمًا ۞ وَيَنْصُرَكَ اللّٰهُ نَصْرًا عَزِيْزًا ۞ هُوَ الَّذِيْ أَنْزَلَ السَّكِيْنَةَ فِيْ قُلُوْبِ الْمُؤْمِنِيْنَ لِيَزْدَادُوْا إِيْمَانًا مَعَ إِيْمَانِهِمْ',
      latin:
        "Bismillāhir-raḥmānir-raḥīm. U‘īżu nafsī billāhil-‘aliyyil-‘aẓīm. Innā fataḥnā laka fatḥan mubīnā, liyaghfira lakallāhu mā taqaddama min żanbika wa mā ta'akhkhara wa yutimma ni‘matahū ‘alaika wa yahdiyaka ṣirāṭan mustaqīmā, wa yanṣurakallāhu naṣran ‘azīzā. Huwallażī anzala-ssakīnata fī qulūbil-mu'minīna liyazdādū īmānan ma‘a īmānihim.",
      arti:
        'Sesungguhnya Kami telah memberikan kepadamu kemenangan yang nyata dan menolongmu dengan pertolongan yang perkasa, serta Dialah yang menurunkan ketenangan (sakinah) ke dalam hati orang-orang mukmin.',
    },
    {
      id: 'hk-7',
      judul: 'Haikal Ketujuh (Penangkal Pandangan Jahat ‘Ain & Sihir — Al-Qalam: 51–52)',
      arab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۞ أُعِيْذُ نَفْسِيْ بِاللّٰهِ الْعَلِيِّ الْعَظِيْمِ ۞ وَإِنْ يَكَادُ الَّذِيْنَ كَفَرُوْا لَيُزْلِقُوْنَكَ بِأَبْصَارِهِمْ لَمَّا سَمِعُوا الذِّكْرَ وَيَقُوْلُوْنَ إِنَّهُ لَمَجْنُوْنٌ ۞ وَمَا هُوَ إِلَّا ذِكْرٌ لِلْعٰلَمِيْنَ ۞ قُلْ إِنَّمَا أَدْعُوْ رَبِّيْ وَلَا أُشْرِكُ بِهِ أَحَدًا ۞ حَسْبِيَ اللّٰهُ لَا إِلٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيْمِ',
      latin:
        "Bismillāhir-raḥmānir-raḥīm. U‘īżu nafsī billāhil-‘aliyyil-‘aẓīm. Wa iy yakādullażīna kafarū layuzliqūnaka bi'abṣārihim lammā sami‘uż-żikra wa yaqūlūna innahū lamajnūn, wa mā huwa illā żikrul-lil-‘ālamīn. Ḥasbiyallāhu lā ilāha illā huwa ‘alaihi tawakkaltu wa huwa rabbul-‘arsyil-‘aẓīm.",
      arti:
        'Hampir-hampir orang kafir menjatuhkanmu dengan pandangan dengki mereka ketika mendengar Al-Qur’an, padahal Al-Qur’an adalah pengingat bagi seluruh alam. Cukuplah Allah bagiku, tiada Tuhan selain Dia, hanya kepada-Nya aku bertawakkal.',
    },
    {
      id: 'hk-8',
      judul: 'Doa Penutup Kitab Haikal Nuroni',
      arab: 'اَللّٰهُمَّ احْفَظْنَا بِحِفْظِ الْإِيْمَانِ وَالْإِسْلَامِ وَبِحَقِّ هٰذِهِ الْهَيَاكِلِ السَّبْعَةِ النُّوْرَانِيَّةِ وَبِجَاهِ سَيِّدِنَا مُحَمَّدٍ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ مِنْ شَرِّ كُلِّ ذِيْ شَرٍّ وَمِنْ شَرِّ الْإِنْسِ وَالْجِنِّ وَالسِّحْرِ وَالْعَيْنِ وَالْحَاسِدِيْنَ ۞ اَللّٰهُ حَافِظِيْ اَللّٰهُ نَاصِرِيْ اَللّٰهُ شَاهِدِيْ وَهُوَ خَيْرُ الْحَافِظِيْنَ وَهُوَ أَرْحَمُ الرَّاحِمِيْنَ',
      latin:
        "Allāhummahfaẓnā biḥifẓil-īmāni wal-islāmi wa biḥaqqi hāżihil-hayākilil-sab‘atin-nūrāniyyati wa bijāhi sayyidinā Muḥammadin ṣallallāhu ‘alaihi wa sallama min syarri kulli żī syarrin wa min syarril-insi wal-jinni was-siḥri wal-‘aini wal-ḥāsidīn. Allāhu ḥāfiẓī, Allāhu nāṣirī, wa huwa khairul-ḥāfiẓīna wa huwa arḥamur-rāḥimīn.",
      arti:
        'Ya Allah jagalah kami dengan penjagaan iman dan Islam, berkat haikal tujuh yang penuh cahaya ini dan kemuliaan Nabi Muhammad ﷺ, dari keburukan setiap makhluk, gangguan jin dan manusia, sihir, pandangan ‘ain, dan para pendengki. Allahlah sebaik-baik Penjaga.',
    },
  ],
};

// ============================================================================
// KITAB DALAILUL KHOIROT LENGKAP (IMAM AL-JAZULI: HIZIB SENIN - AHAD + DOA)
// ============================================================================
export const KITAB_DALAILUL_KHOIROT_GROUP: WiridDoaGroup = {
  no: 7,
  tab: 'wirid',
  judul: 'Dalailul Khoirot Lengkap (Imam Al-Jazuli)',
  jumlahBacaan: 11,
  items: [
    {
      id: 'dk-1',
      judul: '1. Niat & Doa Pembukaan Dalailul Khoirot',
      arab: 'اَللّٰهُمَّ إِنِّيْ نَوَيْتُ بِالصَّلَاةِ عَلَى النَّبِيِّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ امْتِثَالًا لِأَمْرِكَ وَتَصْدِيْقًا لِنَبِيِّكَ سَيِّدِنَا مُحَمَّدٍ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ وَمَحَبَّةً فِيْهِ وَشَوْقًا إِلَيْهِ وَتَعْظِيْمًا لِقَدْرِهِ ۞ فَتَقَبَّلْهَا مِنِّيْ بِفَضْلِكَ وَإِحْسَانِكَ وَأَزِلْ حِجَابَ الْغَفْلَةِ عَنْ قَلْبِيْ وَاجْعَلْنِيْ مِنْ عِبَادِكَ الصَّالِحِيْنَ',
      latin:
        "Allāhumma innī nawaitu biṣ-ṣalāti ‘alan-nabiyyi ṣallallāhu ‘alaihi wa sallam imtiṡālan li'amrika wa taṣdīqan linabiyyika sayyidinā Muḥammadin wa maḥabbatan fīhi wa syauqan ilaihi wa ta‘ẓīman liqadrih, fataqabbalhā minnī bifaḍlika wa iḥsānika wa azil ḥijābal-ghaflati ‘an qalbī waj‘alnī min ‘ibādikaṣ-ṣāliḥīn.",
      arti:
        'Ya Allah, hamba niat bershalawat atas Nabi-Mu ﷺ untuk mematuhi perintah-Mu, membenarkan risalah beliau, karena cinta dan rindu kepada beliau serta memuliakan kedudukan beliau. Terimalah dengan karunia-Mu dan singkaplah tirai kelalaian dari hatiku.',
    },
    {
      id: 'dk-2',
      judul: '2. Asmaul Husna Pembuka & Asmaun Nabi ﷺ (201 Nama Agung)',
      arab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۞ سَيِّدُنَا مُحَمَّدٌ ۞ أَحْمَدُ ۞ حَامِدٌ ۞ مَحْمُوْدٌ ۞ أَحِيْدٌ ۞ وَحِيْدٌ ۞ مَاحٍ ۞ حَاشِرٌ ۞ عَاقِبٌ ۞ طٰهٰ ۞ يٰسٓ ۞ طَاهِرٌ ۞ مُطَهَّرٌ ۞ طَيِّبٌ ۞ سَيِّدٌ ۞ رَسُوْلٌ ۞ نَبِيٌّ ۞ رَسُوْلُ الرَّحْمَةِ ۞ قَيِّمٌ ۞ جَامِعٌ ۞ مُقْتَفٍ ۞ مُقَفٍّ ۞ رَسُوْلُ الْمَلَاحِمِ ۞ رَسُوْلُ الرَّاحَةِ ۞ كَامِلٌ ۞ إِكْلِيْلٌ ۞ مُدَّثِّرٌ ۞ مُزَّمِّلٌ ۞ عَبْدُ اللّٰهِ ۞ حَبِيْبُ اللّٰهِ ۞ صَفِيُّ اللّٰهِ ۞ نَجِيُّ اللّٰهِ ۞ كَلِيْمُ اللّٰهِ ۞ خَاتَمُ الْأَنْبِيَاءِ ۞ خَاتَمُ الرُّسُلِ ۞ مُحْيٍ ۞ مُنْجٍ ۞ مُذَكِّرٌ ۞ نَاصِرٌ ۞ مَنْصُوْرٌ ۞ نَبِيُّ الرَّحْمَةِ ۞ نَبِيُّ التَّوْبَةِ ۞ حَرِيْصٌ عَلَيْكُمْ ۞ مَعْلُوْمٌ ۞ شَهِيْرٌ ۞ شَاهِدٌ ۞ شَهِيْدٌ ۞ مَشْهُوْدٌ ۞ بَشِيْرٌ ۞ مُبَشِّرٌ ۞ نَذِيْرٌ ۞ مُنْذِرٌ ۞ نُوْرٌ ۞ سِرَاجٌ ۞ مِصْبَاحٌ ۞ هُدًى ۞ مَهْدِيٌّ ۞ مُنِيْرٌ ۞ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ',
      latin:
        "Bismillāhir-raḥmānir-raḥīm. Sayyidunā Muḥammad, Aḥmad, Ḥāmid, Maḥmūd, Aḥīd, Waḥīd, Māḥin, Ḥāsyir, ‘Āqib, Ṭāhā, Yāsīn, Ṭāhir, Muṭahhar, Ṭayyib, Sayyid, Rasūl, Nabī, Rasūlur-Raḥmah, Qayyim, Jāmi‘, Muqtafin, Muqaffin, Rasūlul-Malāḥim, Rasūlur-Rāḥah, Kāmil, Iklīl, Muddaṡṡir, Muzzammil, ‘Abdullāh, Ḥabībullāh, Ṣafīyullāh, Najīyullāh, Kalīmullāh, Khātamul-Anbiyā', Khātamur-Rusul, Muḥyin, Munjin, Mużakkir, Nāṣir, Manṣūr, Nabīyur-Raḥmah, Nabīyut-Taubah, Basyīr, Nażīr, Nūr, Sirāj, Miṣbāḥ, Hudā, Mahdī, Munīr.",
      arti:
        'Rangkaian nama-nama agung junjungan kita Nabi Muhammad ﷺ dalam Kitab Dalailul Khoirot (dari Muhammad, Ahmad, Thaha, Yasin, hingga Rahmatan lil Alamin, Cahaya, Pelita Penerang). Allāhumma ṣalli wa sallim ‘alaihi bi kulli ismin min asmā’ihī.',
    },
    {
      id: 'dk-3',
      judul: '3. Hizib Hari Senin (Al-Ḥizbul Awwal — Pembuka Minggu)',
      arab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۞ اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَأَزْوَاجِهِ وَذُرِّيَّتِهِ كَمَا صَلَّيْتَ عَلٰى إِبْرَاهِيْمَ وَبَارِكْ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَأَزْوَاجِهِ وَذُرِّيَّتِهِ كَمَا بَارَكْتَ عَلٰى آلِ إِبْرَاهِيْمَ إِنَّكَ حَمِيْدٌ مَّجِيْدٌ ۞ اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَعَلٰى آلِهِ كَمَا صَلَّيْتَ عَلٰى إِبْرَاهِيْمَ إِنَّكَ حَمِيْدٌ مَّجِيْدٌ ۞ اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الْأُمِّيِّ وَعَلٰى آلِ سَيِّدِنَا مُحَمَّدٍ ۞ اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ عَبْدِكَ وَرَسُوْلِكَ ۞ اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ صَلَاةً تَكُوْنُ لَكَ رِضَاءً وَلِحَقِّهِ أَدَاءً وَأَعْطِهِ الْوَسِيْلَةَ وَالْفَضِيْلَةَ وَالْمَقَامَ الْمَحْمُوْدَ الَّذِيْ وَعَدْتَهُ',
      latin:
        "Allāhumma ṣalli ‘alā sayyidinā Muḥammadin wa azwājihī wa żurriyyatihī kamā ṣallaita ‘alā Ibrāhīm... Allāhumma ṣalli ‘alā sayyidinā Muḥammadinin-nabiyyil-ummīyi... Allāhumma ṣalli ‘alā sayyidinā Muḥammadin ṣalātan takūnu laka riḍā'an wa liḥaqqihī adā'an wa a‘ṭihil-wasīlata wal-faḍīlata wal-maqāmal-maḥmūdallażī wa‘adtah.",
      arti:
        'Wirid Dalailul Khoirot Hizib Hari Senin: bershalawat dengan shalawat Ibrahimiyah, shalawat kepada Nabi Ummi, serta memohonkan kedudukan Al-Wasilah dan Al-Maqam Al-Mahmud bagi Rasulullah ﷺ.',
    },
    {
      id: 'dk-4',
      judul: '4. Hizib Hari Selasa (Al-Ḥizbuṡ-Ṡānī)',
      arab: 'اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَعَلٰى آلِ سَيِّدِنَا مُحَمَّدٍ مِلْءَ الدُّنْيَا وَمِلْءَ الْآخِرَةِ وَبَارِكْ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَعَلٰى آلِ سَيِّدِنَا مُحَمَّدٍ مِلْءَ الدُّنْيَا وَمِلْءَ الْآخِرَةِ وَارْحَمْ سَيِّدَنَا مُحَمَّدًا وَآلَ سَيِّدِنَا مُحَمَّدٍ مِلْءَ الدُّنْيَا وَمِلْءَ الْآخِرَةِ وَاجْزِ سَيِّدَنَا مُحَمَّدًا وَآلَ سَيِّدِنَا مُحَمَّدٍ مِلْءَ الدُّنْيَا وَمِلْءَ الْآخِرَةِ ۞ اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ كَمَا أَمَرْتَنَا أَنْ نُصَلِّيَ عَلَيْهِ وَصَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ كَمَا يَنْبَغِيْ أَنْ يُصَلّٰى عَلَيْهِ ۞ اَللّٰهُمَّ صَلِّ عَلٰى نَبِيِّكَ الْمُصْطَفٰى وَرَسُوْلِكَ الْمُرْتَضٰى وَوَلِيِّكَ الْمُجْتَبٰى وَأَمِيْنِكَ عَلٰى وَحْيِ السَّمَاءِ',
      latin:
        "Allāhumma ṣalli ‘alā sayyidinā Muḥammadin wa ‘alā āli sayyidinā Muḥammadin mil'ad-dunyā wa mil'al-ākhirati wa bārik... warḥam... wajzi... Allāhumma ṣalli ‘alā sayyidinā Muḥammadin kamā amartanā an nuṣalliya ‘alaihi wa kamā yanbaghī ay yuṣallā ‘alaih.",
      arti:
        'Wirid Dalailul Khoirot Hizib Hari Selasa: melimpahkan shalawat, berkah, rahmat dan balasan agung sepenuh dunia dan akhirat sebagaimana Engkau perintahkan dan sebagaimana layaknya bagi Nabi pilihan ﷺ.',
    },
    {
      id: 'dk-5',
      judul: '5. Hizib Hari Rabu (Al-Ḥizbuṡ-Ṡāliṡ — Shalawat Nurul Anwar & Munajat)',
      arab: 'اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ عَبْدِكَ وَنَبِيِّكَ وَرَسُوْلِكَ النَّبِيِّ الْأُمِّيِّ ۞ اَللّٰهُمَّ صَلِّ عَلٰى نُوْرِ الْأَنْوَارِ وَسِرِّ الْأَسْرَارِ وَتِرْيَاقِ الْأَغْيَارِ وَمِفْتَاحِ بَابِ الْيَسَارِ سَيِّدِنَا مُحَمَّدٍ الْمُخْتَارِ وَآلِهِ الْأَطْهَارِ وَأَصْحَابِهِ الْأَخْيَارِ عَدَدَ نِعَمِ اللّٰهِ وَإِفْضَالِهِ ۞ اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ بَحْرِ أَنْوَارِكَ وَمَعْدِنِ أَسْرَارِكَ وَلِسَانِ حُجَّتِكَ وَعَرُوْسِ مَمْلَكَتِكَ وَإِمَامِ حَضْرَتِكَ',
      latin:
        "Allāhumma ṣalli ‘alā nūril-anwāri wa sirril-asrāri wa tiryāqil-aghyāri wa miftāḥi bābil-yasāri sayyidinā Muḥammadinil-mukhtāri wa ālihil-aṭhāri wa aṣḥābihil-akhyāri ‘adada ni‘amillāhi wa ifḍālih. Allāhumma ṣalli ‘alā sayyidinā Muḥammadin baḥri anwārika wa ma‘dini asrārika wa lisāni ḥujjatika wa imāmi ḥaḍratik.",
      arti:
        'Wirid Dalailul Khoirot Hizib Hari Rabu: shalawat kepada Cahaya dari segala cahaya, penawar kesedihan, kunci pintu kemudahan, samudera cahaya Allah dan sumber rahasia Ilahi sebanyak nikmat dan karunia Allah.',
    },
    {
      id: 'dk-6',
      judul: '6. Hizib Hari Kamis (Al-Ḥizbur-Rābi‘ — Shalawat Sejauh Ilmu Allah)',
      arab: 'اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ عَدَدَ مَا فِيْ عِلْمِ اللّٰهِ صَلَاةً دَائِمَةً بِدَوَامِ مُلْكِ اللّٰهِ ۞ اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ مَا ذَكَرَهُ الذَّاكِرُوْنَ الْأَبْرَارُ وَصَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ مَا اخْتَلَفَ اللَّيْلُ وَالنَّهَارُ ۞ اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الزَّاهِدِ رَسُوْلِ الْمَلِكِ الصَّمَدِ الْوَاحِدِ ۞ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ دَائِمًا إِلٰى يَوْمِ الدِّيْنِ',
      latin:
        "Allāhumma ṣalli ‘alā sayyidinā Muḥammadin ‘adada mā fī ‘ilmillāhi ṣalātan dā'imatan bidawāmi mulkillāh. Allāhumma ṣalli ‘alā sayyidinā Muḥammadin mā żakarahuż-żākirūnal-abrār wa makhtalafal-lailu wan-nahār.",
      arti:
        'Wirid Dalailul Khoirot Hizib Hari Kamis: shalawat sebanyak apa yang ada dalam ilmu Allah secara abadi seiring kekalnya kerajaan Allah, sepanjang siang dan malam silih berganti.',
    },
    {
      id: 'dk-7',
      judul: '7. Hizib Hari Jum’at (Al-Ḥizbul-Khāmis — Hari Paling Utama)',
      arab: 'اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَعَلٰى آلِ سَيِّدِنَا مُحَمَّدٍ مَا سَجَعَتِ الْحَمَائِمُ وَحَمَتِ الْحَوَائِمُ وَسَرَحَتِ الْبَهَائِمُ ۞ اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ صَلَاةً تُنْجِيْنَا بِهَا مِنْ جَمِيْعِ الْأَهْوَالِ وَالْآفَاتِ وَتَقْضِيْ لَنَا بِهَا جَمِيْعَ الْحَاجَاتِ وَتُطَهِّرُنَا بِهَا مِنْ جَمِيْعِ السَّيِّئَاتِ وَتَرْفَعُنَا بِهَا عِنْدَكَ أَعْلَى الدَّرَجَاتِ وَتُبَلِّغُنَا بِهَا أَقْصَى الْغَايَاتِ مِنْ جَمِيْعِ الْخَيْرَاتِ فِي الْحَيَاةِ وَبَعْدَ الْمَمَاتِ ۞ اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَعَلٰى آلِ سَيِّدِنَا مُحَمَّدٍ صَلَاةَ الرِّضَا وَارْضَ عَنْ أَصْحَابِهِ رِضَاءَ الرِّضَا',
      latin:
        "Allāhumma ṣalli ‘alā sayyidinā Muḥammadin wa ‘alā āli sayyidinā Muḥammadin ṣalātan tunjīnā bihā min jamī‘il-ahwāli wal-āfāt wa taqḍī lanā bihā jamī‘al-ḥājāt wa tuṭahhirunā bihā min jamī‘is-sayyi'āt wa tarfa‘unā bihā ‘indaka a‘lad-darajāt wa tuballighunā bihā aqṣal-ghāyāti min jamī‘il-khairāti fil-ḥayāti wa ba‘dal-mamāt.",
      arti:
        'Wirid Dalailul Khoirot Hizib Hari Jum’at: mencakup Shalawat Munjiyat (penyelamat dari huru-hara, pemenuh hajat, penyuci dosa, pengangkat derajat tinggi di dunia dan setelah mati) serta permohonan ridha bagi segenap sahabat.',
    },
    {
      id: 'dk-8',
      judul: '8. Hizib Hari Sabtu (Al-Ḥizbus-Sādis — Cahaya & Syafaat Kubra)',
      arab: 'اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ صَاحِبِ الْحَوْضِ الْمَوْرُوْدِ وَاللِّوَاءِ الْمَعْقُوْدِ وَالْمَقَامِ الْمَحْمُوْدِ ۞ اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ الَّذِيْ مَلَأْتَ قَلْبَهُ مِنْ جَلَالِكَ وَعَيْنَهُ مِنْ جَمَالِكَ فَأَصْبَحَ فَرِحًا مُؤَيَّدًا مَنْصُوْرًا ۞ اَللّٰهُمَّ صَلِّ عَلٰى رُوْحِ سَيِّدِنَا مُحَمَّدٍ فِي الْأَرْوَاحِ وَعَلٰى جَسَدِهِ فِي الْأَجْسَادِ وَعَلٰى قَبْرِهِ فِي الْقُبُوْرِ',
      latin:
        "Allāhumma ṣalli ‘alā sayyidinā Muḥammadin ṣāḥibil-ḥauḍil-maurūdi wal-liwā'il-ma‘qūdi wal-maqāmil-maḥmūd. Allāhumma ṣalli ‘alā sayyidinā Muḥammadinillażī mala'ta qalbahū min jalālika wa ‘ainahū min jamālik. Allāhumma ṣalli ‘alā rūḥi sayyidinā Muḥammadin fil-arwāḥi wa ‘alā jasadihī fil-ajsādi wa ‘alā qabrihī fil-qubūr.",
      arti:
        'Wirid Dalailul Khoirot Hizib Hari Sabtu: bershalawat kepada pemilik Telaga Al-Kautsar, Panji Pujian, dan Maqam Mahmud; memohon curahan rahmat atas ruh beliau di alam ruh, jasad beliau, dan makam mulia beliau di Madinah.',
    },
    {
      id: 'dk-9',
      judul: '9. Hizib Hari Ahad / Minggu (Al-Ḥizbus-Sābi‘ — Khatam Mingguan)',
      arab: 'اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ صَلَاةً تُبَلِّغُنَا بِهَا حَجَّ بَيْتِكَ الْحَرَامِ وَزِيَارَةَ قَبْرِ نَبِيِّكَ عَلَيْهِ أَفْضَلُ الصَّلَاةِ وَالسَّلَامِ فِيْ لُطْفٍ وَعَافِيَةٍ وَسَلَامَةٍ وَبُلُوْغِ الْمَرَامِ ۞ اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ أَلْفَ أَلْفِ مَرَّةٍ ۞ اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ خَيْرِ خَلْقِكَ وَزِيْنَةِ عَرْشِكَ وَمِدَادِ كَلِمَاتِكَ ۞ صَلَّى اللّٰهُ عَلَيْهِ وَعَلٰى آلِهِ وَصَحْبِهِ أَجْمَعِيْنَ',
      latin:
        "Allāhumma ṣalli ‘alā sayyidinā Muḥammadin ṣalātan tuballighunā bihā ḥajja baitikal-ḥarāmi wa ziyārata qabri nabiyyika ‘alaihi afḍaluṣ-ṣalāti was-salāmi fī luṭfin wa ‘āfiyatin wa salāmatin wa bulūghil-marām. Allāhumma ṣalli ‘alā sayyidinā Muḥammadin alfa alfi marrah.",
      arti:
        'Wirid Dalailul Khoirot Hizib Hari Ahad: shalawat permohonan agar disampaikan melaksanakan haji ke Baitullah dan berziarah ke makam Nabi ﷺ dalam kelembutan, kesehatan, dan tercapainya cita-cita luhur.',
    },
    {
      id: 'dk-10',
      judul: '10. Shalawat Dalailul Khoirot Lengkap (Allāhumma Dāḥiyal-Madḥūwāt)',
      arab: 'اَللّٰهُمَّ دَاحِيَ الْمَدْحُوَّاتِ وَبَارِئَ الْمَسْمُوْكَاتِ وَجَبَّارَ الْقُلُوْبِ عَلٰى فِطْرَتِهَا شَقِيِّهَا وَسَعِيْدِهَا ۞ اِجْعَلْ شَرَائِفَ صَلَوَاتِكَ وَنَوَامِيَ بَرَكَاتِكَ وَرَأْفَةَ تَحَنُّنِكَ عَلٰى سَيِّدِنَا مُحَمَّدٍ عَبْدِكَ وَرَسُوْلِكَ الْفَاتِحِ لِمَا أُغْلِقَ وَالْخَاتِمِ لِمَا سَبَقَ وَالْمُعْلِنِ الْحَقَّ بِالْحَقِّ',
      latin:
        "Allāhumma dāḥiyal-madḥūwāti wa bāri'al-masmūkāti wa jabbāral-qulūbi ‘alā fiṭratihā syaqīyihā wa sa‘īdihā, ij‘al syarā'ifa ṣalawātika wa nawāmiya barakātika wa ra'fata taḥannunika ‘alā sayyidinā Muḥammadin ‘abdika wa rasūlikal-fātiḥi limā ughliqa wal-khātimi limā sabaq.",
      arti:
        'Ya Allah Pencipta hamparan bumi, Pembangun langit yang tinggi, Peneguh fitrah hati manusia, curahkanlah kemuliaan shalawat-Mu, keberkahan yang terus tumbuh, dan kasih sayang-Mu kepada hamba dan utusan-Mu Nabi Muhammad ﷺ, pembuka segala yang terkunci dan penutup seluruh risalah.',
    },
    {
      id: 'dk-11',
      judul: '11. Doa Khatam Dalailul Khoirot',
      arab: 'اَللّٰهُمَّ اشْرَحْ بِالصَّلَاةِ عَلَيْهِ صُدُوْرَنَا وَيَسِّرْ بِهَا أُمُوْرَنَا وَفَرِّجْ بِهَا هُمُوْمَنَا وَاكْشِفْ بِهَا غُمُوْمَنَا وَاغْفِرْ بِهَا ذُنُوْبَنَا وَاقْضِ بِهَا دُيُوْنَنَا وَأَصْلِحْ بِهَا أَحْوَالَنَا وَبَلِّغْ بِهَا آمَالَنَا ۞ وَتَقَبَّلْ بِهَا تَوْبَتَنَا وَاغْسِلْ بِهَا حَوْبَتَنَا وَانْصُرْ بِهَا حُجَّتَنَا وَطَهِّرْ بِهَا أَلْسِنَتَنَا ۞ اَللّٰهُمَّ اجْعَلْنَا مِنَ الْمُتَحَابِّيْنَ فِيْكَ وَاجْمَعْنَا مَعَ نَبِيِّكَ فِيْ جَنَّاتِ النَّعِيْمِ ۞ آمِيْنَ يَا رَبَّ الْعٰلَمِيْنَ',
      latin:
        "Allāhummasyraḥ biṣ-ṣalāti ‘alaihi ṣudūranā wa yassir bihā umūranā wa farrij bihā humūmanā waghfir bihā żunūbanā waqḍi bihā duyūnanā wa aṣliḥ bihā aḥwālanā wa balligh bihā āmālanā, wa taqabbal bihā taubatanā wa ṭahhir bihā alsinatanā wajma‘nā ma‘a nabiyyika fī jannātin-na‘īm. Āmīn yā rabbal-‘ālamīn.",
      arti:
        'Ya Allah, dengan berkah shalawat kepada Nabi Muhammad ﷺ lapangkan dada kami, mudahkan urusan kami, hapus duka, ampuni dosa, lunasi hutang, perbaiki keadaan kami, sampaikan harapan kami, dan kumpulkan kami kelak bersama Nabi-Mu di surga yang penuh kenikmatan.',
    },
  ],
};

// ============================================================================
// KOLEKSI HIZIB-HIZIB LENGKAP & RATIB PESANTREN
// ============================================================================
export const HIZIB_LENGKAP_GROUP: WiridDoaGroup = {
  no: 6,
  tab: 'wirid',
  judul: 'Koleksi Hizib-Hizib Lengkap (Nashor, Bahr, Nawawi, Autad, Sakron, Ikhfa’, Barqi)',
  jumlahBacaan: 8,
  items: [
    {
      id: 'hz-1',
      judul: '1. Hizib Nashor Lengkap (Imam Abul Hasan Asy-Syadzili)',
      arab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۞ اَللّٰهُمَّ بِسَطْوَةِ جَبَرُوْتِ قَهْرِكَ وَبِسُرْعَةِ إِغَاثَةِ نَصْرِكَ وَبِغَيْرَتِكَ لِانْتِهَاكِ حُرُمَاتِكَ وَبِحِمَايَتِكَ لِمَنِ احْتَمٰى بِآيَاتِكَ ۞ نَسْأَلُكَ يَا اَللهُ يَا سَمِيْعُ يَا قَرِيْبُ يَا مُجِيْبُ يَا سَرِيْعُ يَا مُنْتَقِمُ يَا جَبَّارُ يَا قَهَّارُ يَا شَدِيْدَ الْبَطْشِ يَا مَنْ لَا يُعْجِزُهُ قَهْرُ الْجَبَابِرَةِ وَلَا يَعْظُمُ عَلَيْهِ هَلَاكُ الْمُتَمَرِّدَةِ مِنَ الْمُلُوْكِ وَالْأَكَاسِرَةِ ۞ أَنْ تَجْعَلَ كَيْدَ مَنْ كَادَنِيْ فِيْ نَحْرِهِ وَمَكْرَ مَنْ مَكَرَ بِيْ عَائِدًا عَلَيْهِ ۞ يَا عَزِيْزُ يَا عَزِيْزُ يَا عَزِيْزُ ۞ تَقَدَّسَتْ أَسْمَاؤُكَ يَا حَيُّ يَا قَيُّوْمُ ۞ كهيعص (٣×) كُفِيْنَا ۞ حمعسق (٣×) حُمِيْنَا ۞ فَسَيَكْفِيْكَهُمُ اللّٰهُ وَهُوَ السَّمِيْعُ الْعَلِيْمُ (٣×)',
      latin:
        "Bismillāhir-raḥmānir-raḥīm. Allāhumma bisaṭwati jabarūti qahrika wa bisur‘ati ighāṡati naṣrika wa bighairatika lintihāki ḥurumātika wa biḥimāyatika limaniḥtamā bi'āyātik. Nas'aluka yā Allāh yā Samī‘ yā Qarīb yā Mujīb yā Sarī‘ yā Qahhār, an taj‘ala kaida man kādanī fī naḥrihī wa makra man makara bī ‘ā'idan ‘alaih. Kāf-Hā-Yā-‘Ain-Ṣād (3x) kufīnā, Ḥā-Mīm-‘Ain-Sīn-Qāf (3x) ḥumīnā. Fasayakfīkahumullāhu wa huwas-samī‘ul-‘alīm (3x).",
      arti:
        'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Ya Allah, dengan keperkasaan kekuasaan-Mu dan kecepatan pertolongan-Mu serta perlindungan-Mu bagi hamba yang berlindung dengan ayat-ayat-Mu, kami memohon kepada-Mu lindungilah kami dari makar dan tipu daya orang yang berniat jahat. Kāf-Hā-Yā-‘Ain-Ṣād cukuplah Allah mencukupi kami, Ḥā-Mīm-‘Ain-Sīn-Qāf cukuplah Allah melindungi kami.',
    },
    {
      id: 'hz-2',
      judul: '2. Hizib Bahr Lengkap (Imam Abul Hasan Asy-Syadzili)',
      arab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۞ يَا اَللهُ يَا عَلِيُّ يَا عَظِيْمُ يَا حَلِيْمُ يَا عَلِيْمُ، أَنْتَ رَبِّيْ وَعِلْمُكَ حَسْبِيْ فَنِعْمَ الرَّبُّ رَبِّيْ وَنِعْمَ الْحَسْبُ حَسْبِيْ تَنْصُرُ مَنْ تَشَاءُ وَأَنْتَ الْعَزِيْزُ الرَّحِيْمُ ۞ نَسْأَلُكَ الْعِصْمَةَ فِي الْحَرَكَاتِ وَالسَّكَنَاتِ وَالْكَلِمَاتِ وَالْإِرَادَاتِ وَالْخَطَرَاتِ مِنَ الشُّكُوْكِ وَالظُّنُوْنِ وَالْأَوْهَامِ السَّاتِرَةِ لِلْقُلُوْبِ عَنْ مُطَالَعَةِ الْغُيُوْبِ ۞ سَخِّرْ لَنَا هٰذَا الْبَحْرَ كَمَا سَخَّرْتَ الْبَحْرَ لِمُوْسٰى وَسَخَّرْتَ النَّارَ لِإِبْرَاهِيْمَ ۞ كهيعص اُنْصُرْنَا فَإِنَّكَ خَيْرُ النَّاصِرِيْنَ ۞ وَافْتَحْ لَنَا فَإِنَّكَ خَيْرُ الْفَاتِحِيْنَ ۞ وَاغْفِرْ لَنَا فَإِنَّكَ خَيْرُ الْغَافِرِيْنَ ۞ بِسْمِ اللّٰهِ مَجْرَاهَا وَمُرْسَاهَا إِنَّ رَبِّيْ لَغَفُوْرٌ رَّحِيْمٌ',
      latin:
        "Bismillāhir-raḥmānir-raḥīm. Yā Allāh yā ‘Alī yā ‘Aẓīm yā Ḥalīm yā ‘Alīm, anta rabbī wa ‘ilmuka ḥasbī fani‘mar-rabbu rabbī wa ni‘mal-ḥasbu ḥasbī. Nas'alukal-‘iṣmata fil-ḥarakāti was-sakanāti wal-kalimāti wal-irādātil-qulūb. Sakhkhir lanā hāżal-baḥra kamā sakhkhartal-baḥra li Mūsā... Unṣurnā fa innaka khairun-nāṣirīn, waftaḥ lanā fa innaka khairul-fātiḥīn. Bismillāhi majrāhā wa mursāhā inna rabbī laghafūrur raḥīm.",
      arti:
        'Ya Allah Yang Mahatinggi, Mahaagung, Maha Penyantun lagi Maha Mengetahui, Engkaulah Tuhanku dan ilmu-Mu mencukupiku. Kami memohon penjagaan dalam gerak dan diam, ucapan, kehendak dan lintasan hati dari segala keraguan. Tundukkanlah urusan dunia dan lautan perjalanan kami sebagaimana Engkau tundukkan laut bagi Nabi Musa a.s.',
    },
    {
      id: 'hz-3',
      judul: '3. Hizib Imam Nawawi Lengkap (Al-Imam Yahya bin Syaraf An-Nawawi)',
      arab: 'بِسْمِ اللّٰهِ اللّٰهُ أَكْبَرُ (٣×) أَقُوْلُ عَلٰى نَفْسِيْ وَعَلٰى دِيْنِيْ وَعَلٰى أَهْلِيْ وَعَلٰى أَوْلَادِيْ وَعَلٰى مَالِيْ وَعَلٰى أَصْحَابِيْ وَعَلٰى أَدْيَانِهِمْ وَعَلٰى أَمْوَالِهِمْ أَلْفَ بِسْمِ اللّٰهِ اللّٰهُ أَكْبَرُ ۞ تَحَصَّنْتُ بِذِي الْعِزَّةِ وَالْجَبَرُوْتِ وَاعْتَصَمْتُ بِرَبِّ الْمَلَكُوْتِ وَتَوَكَّلْتُ عَلَى الْحَيِّ الَّذِيْ لَا يَمُوْتُ ۞ خَبَأْتُ نَفْسِيْ فِيْ خَزَائِنِ بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ، أَقْفَالُهَا ثِقَتِيْ بِاللّٰهِ، مَفَاتِيْحُهَا لَا قُوَّةَ إِلَّا بِاللّٰهِ ۞ لَا إِلٰهَ إِلَّا اللّٰهُ حِصْنُنَا، مُحَمَّدٌ رَسُوْلُ اللّٰهِ سَقْفُنَا وَسُوْرُنَا',
      latin:
        "Bismillāhi Allāhu Akbar (3x) aqūlu ‘alā nafsī wa ‘alā dīnī wa ‘alā ahlī wa ‘alā aulādī wa ‘alā mālī alfa Bismillāhi Allāhu Akbar. Taḥaṣṣantu biżil-‘izzati wal-jabarūti wa‘taṣamtu birabbil-malakūti wa tawakkaltu ‘alal-ḥayyillażī lā yamūt. Khaba'tu nafsī fī khazā'ini Bismillāhir-raḥmānir-raḥīm, aqfāluhā ṡiqatī billāh, mafātīḥuhā lā quwwata illā billāh.",
      arti:
        'Dengan nama Allah, Allah Mahabesar. Kusebutkan atas diriku, agamaku, keluargaku, anak-anakku, hartaku, dan sahabat-sahabatku seribu kali Bismillahi Allahu Akbar. Aku berlindung di dalam perbendaharaan Bismillah yang kuncinya kepercayaan kepada Allah dan anak kuncinya tiada kekuatan selain pertolongan Allah.',
    },
    {
      id: 'hz-4',
      judul: '4. Hizib Autad Lengkap (Syekh Abdul Qadir Al-Jailani)',
      arab: 'أَللهُ الْكَافِيْ رَبُّنَا الْكَافِيْ ۞ قَصَدْنَا الْكَافِيْ وَجَدْنَا الْكَافِيْ ۞ لِكُلٍّ كَافِيْ كَفَانَا الْكَافِيْ وَنِعْمَ الْكَافِيْ أَلْحَمْدُ لِلّٰهِ ۞ حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيْلُ نِعْمَ الْمَوْلٰى وَنِعْمَ النَّصِيْرُ (٣×) ۞ وَكَفَى اللّٰهُ الْمُؤْمِنِيْنَ الْقِتَالَ ۞ آمِيْنَ يَا رَبَّ الْعٰلَمِيْنَ',
      latin:
        "Allāhul-kāfī rabbunal-kāfī, qaṣadnal-kāfī wajadnal-kāfī, likullin kāfī kafānal-kāfī wa ni‘mal-kāfī Alḥamdulillāh. Ḥasbunallāhu wa ni‘mal-wakīl ni‘mal-maulā wa ni‘man-naṣīr (3x). Wa kafallāhul-mu'minīnal-qitāl. Āmīn yā rabbal-‘ālamīn.",
      arti:
        'Allah Maha Mencukupi, Tuhan kami Maha Mencukupi; kami menuju Yang Maha Mencukupi dan kami mendapati Dia Mencukupi segala urusan kami. Segala puji bagi Allah, cukuplah Allah sebaik-baik Penolong dan Pelindung.',
    },
    {
      id: 'hz-5',
      judul: '5. Hizib Sakron Lengkap (Al-Habib Ali bin Abi Bakar As-Sakran)',
      arab: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۞ اَللّٰهُمَّ إِنِّيْ احْتَطْتُ بِدَرْبِ اللّٰهِ طُوْلُهُ مَا شَاءَ اللّٰهُ قُفْلُهُ لَا إِلٰهَ إِلَّا اللّٰهُ بَابُهُ مُحَمَّدٌ رَسُوْلُ اللّٰهِ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ سَقْفُهُ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ الْعَلِيِّ الْعَظِيْمِ أَحَاطَ بِنَا مِنْ بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ ۞ اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ ۞ سُوْرٌ سُوْرٌ سُوْرٌ ۞ وَآيَةُ الْكُرْسِيِّ تَرْسُنَا وَقُرْآنُ اللّٰهِ حِصْنُنَا',
      latin:
        "Bismillāhir-raḥmānir-raḥīm. Allāhumma inniḥtaṭtu bidarbillāhi ṭūluhū mā syā'allāhu qufluhū Lā ilāha illallāhu bābuhū Muḥammadur-rasūlullāhi saqfuhū Lā ḥaula wa lā quwwata illā billāhil-‘aliyyil-‘aẓīm, aḥāṭa binā min Bismillāhir-raḥmānir-raḥīm. Sūrun sūrun sūrun (3x), wa Āyatul-Kursī tarsunā.",
      arti:
        'Ya Allah, sungguh aku memagari diriku dengan benteng Allah yang panjangnya Masya Allah, kuncinya La ilaha illallah, pintunya Muhammadur Rasulullah, dan atapnya La haula wa la quwwata illa billah; mengelilingi kami pagar perlindungan Bismillah dan Ayat Kursi sebagai perisai.',
    },
    {
      id: 'hz-6',
      judul: '6. Hizib Ikhfa’ (Hizib Hijab — Imam Asy-Syadzili)',
      arab: 'اِحْتَجَبْتُ بِنُوْرِ اللّٰهِ الدَّائِمِ الْكَامِلِ ۞ وَتَحَصَّنْتُ بِحِصْنِ اللّٰهِ الْقَوِيِّ الشَّامِلِ ۞ وَرَمَيْتُ مَنْ بَغٰى عَلَيَّ بِسَهْمِ اللّٰهِ وَسَيْفِهِ الْقَاتِلِ ۞ اَللّٰهُمَّ يَا غَالِبًا عَلٰى أَمْرِهِ وَيَا قَائِمًا فَوْقَ خَلْقِهِ وَيَا حَائِلًا بَيْنَ الْمَرْءِ وَقَلْبِهِ، حُلْ بَيْنِيْ وَبَيْنَ الشَّيْطَانِ وَنَزْغِهِ وَبَيْنَ مَا لَا طَاقَةَ لِيْ بِهِ مِنْ خَلْقِكَ أَجْمَعِيْنَ',
      latin:
        "Iḥtajabtu binūrillāhid-dā'imil-kāmil wa taḥaṣṣantu biḥiṣnillāhil-qawīyisy-syāmil. Allāhumma yā ghāliban ‘alā amrihī wa yā qā'iman fauqa khalqihī wa yā ḥā'ilan bainal-mar'i wa qalbih, ḥul bainī wa bainasy-syaiṭāni wa nazghihī wa baina mā lā ṭāqata lī bihī min khalqika ajma‘īn.",
      arti:
        'Aku berlindung di balik tirai cahaya Allah yang kekal lagi sempurna dan berbenteng dengan benteng Allah yang kuat menyeluruh. Ya Allah Yang Mahamenguasai urusan-Nya, halangilah antara diriku dengan godaan setan serta segala kejahatan yang tak sanggup kuhadapi.',
    },
    {
      id: 'hz-7',
      judul: '7. Hizib Barqi & Hizib Maghrobi (Keteguhan & Kewibawaan Santri)',
      arab: 'نَصْرٌ مِنَ اللّٰهِ وَفَتْحٌ قَرِيْبٌ وَبَشِّرِ الْمُؤْمِنِيْنَ ۞ صُمٌّ بُكْمٌ عُمْيٌ فَهُمْ لَا يَرْجِعُوْنَ ۞ رَبِّ نَجِّنِيْ مِنَ الْقَوْمِ الظَّالِمِيْنَ ۞ بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ، إِنَّا أَنْزَلْنَاهُ فِيْ لَيْلَةِ الْقَدْرِ، يَا عَزِيْزُ يَا جَبَّارُ يَا مُتَكَبِّرُ، اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَسَلِّمْ',
      latin:
        "Naṣrun minallāhi wa fatḥun qarībun wa basysyiril-mu'minīn. Rabbi najjinī minal-qaumiẓ-ẓālimīn. Bismillāhir-raḥmānir-raḥīm, Yā ‘Azīz yā Jabbār yā Mutakabbir, Allāhumma ṣalli ‘alā sayyidinā Muḥammadin wa sallam.",
      arti:
        'Pertolongan dari Allah dan kemenangan yang dekat, sampaikan kabar gembira bagi orang beriman. Ya Tuhanku selamatkanlah kami dari kaum yang zalim dan anugerahkan keteguhan hati dalam kebenaran.',
    },
    {
      id: 'hz-8',
      judul: '8. Hizib Al-Fatihah & Doa Penutup Para Ahli Hizib',
      arab: 'اَلْفَاتِحَةُ بِقُوَّةِ أَسْرَارِهَا وَنُوْرِ آيَاتِهَا، إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِيْنُ ۞ اَللّٰهُمَّ احْفَظْنَا فِيْ أَسْفَارِنَا وَحَضَرِنَا وَبَارِكْ لَنَا فِيْ عِلْمِنَا وَرِزْقِنَا وَثَبِّتْنَا عَلَى الصِّرَاطِ الْمُسْتَقِيْمِ بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِيْنَ',
      latin:
        "Al-Fātiḥatu biquwwati asrārihā wa nūri āyātihā, Iyyāka na‘budu wa iyyāka nasta‘īn. Allāhummahfaẓnā fī asfārinā wa ḥaḍarinā wa bārik lanā fī ‘ilminā wa rizqinā wa ṡabbitnā ‘alaṣ-ṣirāṭil-mustaqīm.",
      arti:
        'Dengan keberkahan rahasia dan cahaya Surat Al-Fatihah, hanya kepada-Mu kami menyembah dan memohon pertolongan. Ya Allah lindungilah kami dalam perjalanan maupun di pesantren, berkahilah ilmu serta rezeki kami.',
    },
  ],
};

export const RATIB_LENGKAP_GROUP: WiridDoaGroup = {
  no: 5,
  tab: 'wirid',
  judul: 'Ratib Lengkap (Al-Haddad & Al-Athas)',
  jumlahBacaan: 6,
  items: [
    {
      id: 'rt-1',
      judul: '1. Pembukaan Ratib Al-Haddad (Al-Fatihah & Ayat Kursi Lengkap)',
      arab: `اَلْفَاتِحَةُ إِلٰى حَضْرَةِ سَيِّدِنَا وَشَفِيْعِنَا رَسُوْلِ اللهِ مُحَمَّدٍ بْنِ عَبْدِ اللهِ ﷺ ۞ ${AYAT_KURSI_COMPLETE.arab}`,
      latin: `Al-Fātiḥatu ilā ḥaḍrati sayyidinā Muḥammadin ﷺ. ${AYAT_KURSI_COMPLETE.latin}`,
      arti: 'Membaca Surat Al-Fatihah untuk Nabi Muhammad ﷺ dan Imam Abdullah bin Alawi Al-Haddad dilanjutkan Ayat Kursi penuh.',
    },
    {
      id: 'rt-2',
      judul: '2. Dzikir Inti Ratib Al-Haddad (Lā Ilāha Illallāh & Taḥallul)',
      arab: 'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِيْ وَيُمِيْتُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيْرٌ (٣×)\nسُبْحَانَ اللّٰهِ وَالْحَمْدُ لِلّٰهِ وَلَا إِلٰهَ إِلَّا اللّٰهُ وَاللّٰهُ أَكْبَرُ (٣×)\nسُبْحَانَ اللّٰهِ وَبِحَمْدِهِ سُبْحَانَ اللّٰهِ الْعَظِيْمِ (٣×)\nرَبَّنَا اغْفِرْ لَنَا وَتُبْ عَلَيْنَا إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيْمُ (٣×)',
      latin:
        "Lā ilāha illallāhu waḥdahū lā syarīka lah (3x). Subḥānallāhi wal-ḥamdu lillāhi wa lā ilāha illallāhu wallāhu akbar (3x). Subḥānallāhi wa biḥamdihī subḥānallāhil-‘aẓīm (3x). Rabbanaghfir lanā wa tub ‘alainā innaka antat-tawwābur-raḥīm (3x).",
      arti: 'Rangkaian tasbih, tahmid, tauhid, dan istighfar utama Ratib Al-Haddad yang dibaca tiga kali dengan khusyuk.',
    },
    {
      id: 'rt-3',
      judul: '3. Dzikir Perlindungan Pagi & Sore (Bismillāhillażī & A‘ūżu Bikalimātillāh)',
      arab: 'بِسْمِ اللّٰهِ الَّذِيْ لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيْعُ الْعَلِيْمُ (٣×)\nأَعُوْذُ بِكَلِمَاتِ اللّٰهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ (٣×)\nرَضِيْنَا بِاللّٰهِ رَبًّا وَبِالْإِسْلَامِ دِيْنًا وَبِمُحَمَّدٍ نَبِيًّا (٣×)',
      latin:
        "Bismillāhillażī lā yaḍurru ma‘asmihī syai'un fil-arḍi wa lā fis-samā'i wa huwas-samī‘ul-‘alīm (3x). A‘ūżu bikalimātillāhit-tāmmāti min syarri mā khalaq (3x). Raḍīnā billāhi rabban wa bil-islāmi dīnan wa bi Muḥammadin nabiyyā (3x).",
      arti: 'Dengan nama Allah yang bersama nama-Nya tidak ada sesuatu pun di bumi dan di langit yang dapat mencelakakan. Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk-Nya. Kami ridha Allah sebagai Tuhan, Islam sebagai agama, dan Muhammad sebagai Nabi.',
    },
    {
      id: 'rt-4',
      judul: '4. Penutup Ratib Al-Haddad & Yā Laṭīf / Yā Qawī',
      arab: 'حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيْلُ (٧×) ۞ يَا لَطِيْفًا بِخَلْقِهِ يَا عَلِيْمًا بِخَلْقِهِ يَا خَبِيْرًا بِخَلْقِهِ اُلْطُفْ بِنَا يَا لَطِيْفُ يَا عَلِيْمُ يَا خَبِيْرُ (٣×) ۞ اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ اَللّٰهُمَّ صَلِّ عَلَيْهِ وَسَلِّمْ (٣×)',
      latin:
        "Ḥasbunallāhu wa ni‘mal-wakīl (7x). Yā Laṭīfan bikhalqihī yā ‘Alīman bikhalqihī yā Khabīran bikhalqihī ulṭuf binā yā Laṭīfu yā ‘Alīmu yā Khabīr (3x).",
      arti: 'Cukuplah Allah sebagai penolong kami. Wahai Yang Mahalembut, Maha Mengetahui dan Maha Mengenal ciptaan-Nya, berlaku lembutlah kepada kami.',
    },
    {
      id: 'rt-5',
      judul: '5. Ratib Al-Athas — Bagian Pembuka (Al-Habib Umar bin Abdurrahman Al-Athas)',
      arab: 'أَعُوْذُ بِاللّٰهِ السَّمِيْعِ الْعَلِيْمِ مِنَ الشَّيْطَانِ الرَّجِيْمِ (٣×) ۞ لَوْ أَنْزَلْنَا هٰذَا الْقُرْآنَ عَلٰى جَبَلٍ لَّرَأَيْتَهُ خَاشِعًا مُّتَصَدِّعًا مِّنْ خَشْيَةِ اللّٰهِ ۞ هُوَ اللّٰهُ الَّذِيْ لَا إِلٰهَ إِلَّا هُوَ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ هُوَ الرَّحْمٰنُ الرَّحِيْمُ',
      latin:
        "A‘ūżu billāhis-samī‘il-‘alīm minasy-syaiṭānir-rajīm (3x). Lau anzalnā hāżal-qur'āna ‘alā jabalil lara'aitahū khāsyi‘an mutaṣaddi‘an min khasyyatillāh (Al-Hasyr: 21-24).",
      arti: 'Pembuka Ratib Al-Athas dengan Ta’awudz dan akhir Surat Al-Hasyr ayat 21–24.',
    },
    {
      id: 'rt-6',
      judul: '6. Dzikir Inti Ratib Al-Athas (Subḥānallāh, Yā Arḥamar Rāḥimīn, Astaghfirullāh)',
      arab: 'سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ سُبْحَانَ اللّٰهِ الْعَظِيْمِ (٣×) ۞ سُبْحَانَ اللّٰهِ وَالْحَمْدُ لِلّٰهِ وَلَا إِلٰهَ إِلَّا اللّٰهُ وَاللّٰهُ أَكْبَرُ (٤×) ۞ يَا لَطِيْفًا لَمْ يَزَلْ اُلْطُفْ بِنَا فِيْمَا نَزَلَ إِنَّكَ لَطِيْفٌ لَمْ تَزَلْ اُلْطُفْ بِنَا وَالْمُسْلِمِيْنَ (٣×) ۞ أَسْتَغْفِرُ اللّٰهَ (١١×) ۞ تَائِبُوْنَ إِلَى اللّٰهِ (٣×) ۞ يَا اَللهُ بِهَا يَا اَللهُ بِهَا يَا اَللهُ بِحُسْنِ الْخَاتِمَةِ (٣×)',
      latin:
        "Subḥānallāhi wa biḥamdihī (3x). Subḥānallāhi wal-ḥamdu lillāhi wa lā ilāha illallāhu wallāhu akbar (4x). Yā Laṭīfan lam yazal ulṭuf binā fīmā nazal (3x). Astaghfirullāh (11x). Yā Allāh bihā yā Allāh bihā yā Allāh biḥusnil-khātimah (3x).",
      arti:
        'Dzikir utama Ratib Al-Athas ditutup dengan permohonan husnul khatimah bagi segenap santri, guru, dan keluarga.',
    },
  ],
};
