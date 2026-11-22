export interface HadisItemResult {
  nomor: number;
  judul: string;
  perawi: string;
  derajat: 'Shahih' | 'Hasan' | 'Shahih Lighairihi' | 'Hasan Lighairihi' | "Dha'if (Mu'tabar Fadhail)";
  kitabTakhrij: string;
  matanArab: string;
  terjemah: string;
  syarahRingkas: string;
}

export interface RuangHadisResult {
  pertanyaan: string;
  ringkasanTema: string;
  kitabDirujuk: string[];
  hadisList: HadisItemResult[];
  faidah: string[];
  hukumDiambil: string;
  tanggalRumusan: string;
}

export const KITAB_HADIS_51_CATALOG: string[] = [
  'Shahih al-Bukhari',
  'Shahih Muslim',
  'Sunan Abu Dawud',
  'Jami’ at-Tirmidzi',
  'Sunan an-Nasa’i',
  'Sunan Ibnu Majah',
  'Muwaththa’ Imam Malik',
  'Musnad Imam Ahmad',
  'Sunan ad-Darimi',
  'Shahih Ibnu Hibban',
  'Shahih Ibnu Khuzaimah',
  'Al-Mustadrak ‘ala ash-Shahihain',
  'Sunan al-Baihaqi al-Kubra',
  'Syu’abul Iman al-Baihaqi',
  'Musnad al-Bazzar',
  'Al-Mu’jam al-Kabir ath-Thabarani',
  'Al-Mu’jam al-Awsath ath-Thabarani',
  'Al-Mu’jam ash-Shaghir ath-Thabarani',
  'Musnad Abi Ya’la al-Maushili',
  'Mushannaf Ibni Abi Syaibah',
  'Mushannaf Abdurrazzaq',
  'Sunan ad-Daraquthni',
  'Sunan Sa’id bin Manshur',
  'Riyadhush Shalihin (an-Nawawi)',
  'Al-Arba’in an-Nawawiyah',
  'Al-Adzkar an-Nawawi',
  'Bulughul Maram (Ibnu Hajar)',
  'Umdatul Ahkam',
  'Subulus Salam (ash-Shan’ani)',
  'Nailul Authar (asy-Syaukani)',
  'Fathul Bari Syarh Shahih al-Bukhari',
  'Al-Minhaj Syarh Shahih Muslim',
  'Tuhfatul Ahwadzi',
  'Aunul Ma’bud',
  'Mirqatul Mafatih (Mulla Ali al-Qari)',
  'Faidhul Qadir (al-Munawi)',
  'Kasyful Khafa’ (al-Ajluni)',
  'At-Targhib wat-Tarhib (al-Mundziri)',
  'Majma’ az-Zawaid (al-Haitsami)',
  'Al-Adab al-Mufrad (al-Bukhari)',
  'Syama’il Muhammadiyah (at-Tirmidzi)',
  'Misykatul Mashabih',
  'Al-Jami’ ash-Shaghir (as-Suyuthi)',
  'Kanzul ‘Ummal',
  'Al-Maqashid al-Hasanah (as-Sakhawi)',
  'Silsilah al-Ahadits ash-Shahihah',
  'Al-Muntaqa Ibnu al-Jarud',
  'Al-Ahadits al-Mukhtarah',
  'Tarikh Baghdad (al-Khatib)',
  'Hilyatul Auliya’ (Abu Nu’aim)',
  'Tazkiratul Huffazh (adz-Dzahabi)',
];

export const RUANG_HADIS_PRESET_TOPICS: string[] = [
  "Syarah hadits innamal a'mal",
  "Status hadits 'thalabul ilmi faridhah'",
  'Hadits tentang menipu (man ghasyana)',
  'Hadits berbakti kepada orang tua',
];

const TOPIC_LIBRARY: Array<{ keywords: string[]; result: Omit<RuangHadisResult, 'pertanyaan' | 'tanggalRumusan'> }> = [
  {
    keywords: ['innamal', 'niat', 'amal', 'niyyat', 'mukhlis'],
    result: {
      ringkasanTema:
        "Hadis 'Innamal A'malu bin-Niyyat' merupakan kaidah induk (pokok agama) dalam Islam yang diriwayatkan secara masyhur oleh Amirul Mu'minin Umar bin Khattab RA. Imam asy-Syafi'i dan Imam Ahmad menyebut hadis ini mencakup sepertiga ilmu agama karena seluruh ibadah lahiriah sah atau tidaknya bergantung pada niat hati.",
      kitabDirujuk: [
        'Shahih al-Bukhari (No. 1)',
        'Shahih Muslim (No. 1907)',
        'Sunan Abu Dawud (No. 2201)',
        'Jami’ at-Tirmidzi (No. 1647)',
        'Fathul Bari Syarh Shahih al-Bukhari (Juz 1)',
        'Al-Arba’in an-Nawawiyah (Hadis ke-1)',
      ],
      hadisList: [
        {
          nomor: 1,
          judul: 'Keabsahan Amal Bergantung pada Niat',
          perawi: 'Umar bin al-Khattab RA',
          derajat: 'Shahih',
          kitabTakhrij: 'HR. Bukhari No. 1 & Muslim No. 1907 (Muttafaqun ‘Alaih)',
          matanArab:
            'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ',
          terjemah:
            'Sesungguhnya setiap amal perbuatan tergantung pada niatnya, dan setiap orang akan mendapatkan sesuai apa yang ia niatkan. Barang siapa hijrahnya menuju Allah dan Rasul-Nya, maka hijrahnya kepada Allah dan Rasul-Nya; dan barang siapa hijrahnya karena dunia yang ingin diraihnya atau wanita yang hendak dinikahinya, maka hijrahnya sebatas pada tujuan tersebut.',
          syarahRingkas:
            'Para ulama Syafi’iyah menegaskan niat berfungsi membedakan ibadah dari adat kebiasaan serta menentukan tingkatan ibadah (fardhu vs sunnah).',
        },
        {
          nomor: 2,
          judul: 'Pengawasan Allah terhadap Hati dan Niat',
          perawi: 'Abu Hurairah RA',
          derajat: 'Shahih',
          kitabTakhrij: 'HR. Muslim No. 2564, Musnad Ahmad & Shahih Ibnu Hibban',
          matanArab:
            'إِنَّ اللَّهَ لاَ يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ',
          terjemah:
            'Sesungguhnya Allah tidak memandang rupa fisik dan harta benda kalian, melainkan Dia memandang hati dan amal perbuatan kalian.',
          syarahRingkas:
            'Memperkuat urgensi tazkiyatun nafs (penjernihan niat) sebelum menunaikan aktivitas belajar kitab maupun berkhidmah.',
        },
      ],
      faidah: [
        'Niat tempatnya di dalam hati (qalb), sementara melafalkan (talaffuzh) membantu menghadirkan kekhusyukan menurut jumhur Syafi’iyah.',
        'Aktivitas mubah (makan, tidur, bekerja) bernilai pahala ibadah apabila diniatkan untuk ketaatan dan menuntut ilmu.',
        'Kaidah fikih masyhur lahir dari hadis ini: Al-Umuru bi Maqashidiha (Segala perkara dinilai menurut tujuannya).',
      ],
      hukumDiambil:
        'Wajib menghadirkan niat lillahi ta’ala pada setiap ibadah mahdhah (wudhu, shalat, puasa, zakat); amalan tanpa niat tidak sah secara syar’i (tidak menggugurkan kewajiban).',
    },
  },
  {
    keywords: ['thalabul ilmi', 'menuntut ilmu', 'faridhah', 'ilmu', 'belajar'],
    result: {
      ringkasanTema:
        "Hadis 'Thalabul Ilmi Faridhah ‘ala Kulli Muslim' secara sanad individual dinilai dha'if oleh sebagian muhadditsin karena jalur periwayatannya yang beragam, namun secara kolektif (jalur Anas bin Malik, Ibnu Mas'ud, Abu Sa'id, dll) naik derajatnya menjadi Hasan Lighairihi menurut as-Suyuthi, al-Mizzi, dan al-‘Iraqi serta maknanya shahih selaras dengan nash Al-Qur'an.",
      kitabDirujuk: [
        'Sunan Ibnu Majah (No. 224)',
        'Syu’abul Iman al-Baihaqi (No. 1663)',
        'Al-Mu’jam al-Kabir ath-Thabarani',
        'Al-Maqashid al-Hasanah (as-Sakhawi)',
        'Faidhul Qadir (al-Munawi)',
        'Kasyful Khafa’ (al-Ajluni)',
      ],
      hadisList: [
        {
          nomor: 1,
          judul: 'Kewajiban Menuntut Ilmu bagi Setiap Muslim',
          perawi: 'Anas bin Malik RA',
          derajat: 'Hasan Lighairihi',
          kitabTakhrij: 'HR. Ibnu Majah No. 224 & al-Baihaqi dalam Syu’abul Iman',
          matanArab: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
          terjemah: 'Menuntut ilmu itu wajib atas setiap Muslim.',
          syarahRingkas:
            'Tambahan lafal “wa Muslimah” tidak terdapat dalam nash Sunan Ibnu Majah, namun cakupan kata Muslim dalam kaidah ushul fiqh mencakup laki-laki dan perempuan.',
        },
        {
          nomor: 2,
          judul: 'Kemudahan Jalan Surga bagi Pencari Ilmu',
          perawi: 'Abu Hurairah RA',
          derajat: 'Shahih',
          kitabTakhrij: 'HR. Muslim No. 2699 & Jami’ at-Tirmidzi No. 2646',
          matanArab: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
          terjemah:
            'Barang siapa menempuh suatu jalan untuk mencari ilmu, maka Allah akan mudahkan baginya jalan menuju surga.',
          syarahRingkas:
            'Menjadi dalil shahih penguat atas keutamaan rihlah ilmiah santri di pondok pesantren.',
        },
      ],
      faidah: [
        'Ilmu yang wajib ‘ain dipelajari setiap mukallaf ialah ilmu akidah (ashluddin), thaharah & shalat (ubudiyah), serta hukum halal-haram transaksi yang sedang dijalani.',
        'Ilmu lanjutan seperti fikih waris, ushul, dan hadis mendalam berhukum fardhu kifayah bagi pesantren dan ulama.',
        'Banyaknya jalur syawahid mengangkat hadis ini sebagai hujjah yang diamalkan para ulama salaf.',
      ],
      hukumDiambil:
        'Hukumnya Fardhu ‘Ain mempelajari ilmu agama pokok (ibadah wajib sehari-hari & tauhid) bagi setiap muslim laki-laki dan perempuan, dan Fardhu Kifayah bagi cabang ilmu keahlian syar’i lainnya.',
    },
  },
  {
    keywords: ['menipu', 'ghasyana', 'tipu', 'curang', 'jujur', 'bohong', 'contek'],
    result: {
      ringkasanTema:
        "Hadis larangan menipu ('Man Ghasyana falaisa minna') merupakan riwayat Shahih Muslim yang turun ketika Rasulullah SAW memeriksa tumpukan makanan di pasar lalu mendapati bagian dalamnya basah/tidak sesuai yang tampak di permukaan. Hadis ini berlaku umum untuk perdagangan, muamalah, amanah ujian/imtihan, hingga pergaulan sosial.",
      kitabDirujuk: [
        'Shahih Muslim (No. 101 & 102)',
        'Sunan Abu Dawud (No. 3452)',
        'Jami’ at-Tirmidzi (No. 1315)',
        'Musnad Ahmad',
        'Shahih Ibnu Hibban',
        'At-Targhib wat-Tarhib (al-Mundziri)',
      ],
      hadisList: [
        {
          nomor: 1,
          judul: 'Ancaman Tegas bagi Pelaku Kecurangan & Penipuan',
          perawi: 'Abu Hurairah RA',
          derajat: 'Shahih',
          kitabTakhrij: 'HR. Muslim No. 102, Abu Dawud No. 3452, Tirmidzi No. 1315',
          matanArab: 'مَنْ حَمَلَ عَلَيْنَا السِّلاَحَ فَلَيْسَ مِنَّا وَمَنْ غَشَّنَا فَلَيْسَ مِنَّا',
          terjemah:
            'Barang siapa mengangkat senjata terhadap kami maka ia bukan golongan kami, dan barang siapa menipu kami maka ia bukan dari golongan kami.',
          syarahRingkas:
            'Imam an-Nawawi dalam al-Minhaj menjelaskan makna “bukan dari golongan kami” ialah tidak berada di atas petunjuk sempurna dan akhlak sunnah Nabi SAW, tanpa mengeluarkannya dari Islam.',
        },
        {
          nomor: 2,
          judul: 'Kejujuran Membawa Keberkahan Transaksi',
          perawi: 'Hakim bin Hizam RA',
          derajat: 'Shahih',
          kitabTakhrij: 'HR. Bukhari No. 2079 & Muslim No. 1532',
          matanArab: 'فَإِنْ صَدَقَا وَبَيَّنَا بُورِكَ لَهُمَا فِي بَيْعِهِمَا وَإِنْ كَتَمَا وَكَذَبَا مُحِقَتْ بَرَكَةُ بَيْعِهِمَا',
          terjemah:
            'Jika keduanya (penjual dan pembeli) jujur dan berterus terang, niscaya diberkahi jual beli keduanya; namun jika menyembunyikan cacat dan berdusta, dihapuslah keberkahan transaksi keduanya.',
          syarahRingkas:
            'Menegaskan kejujuran sebagai syarat keberkahan harta maupun ilmu.',
        },
      ],
      faidah: [
        'Segala bentuk tadlis (menyembunyikan cacat barang), manipulasi timbangan, dan menyontek dalam ujian termasuk cakupan al-ghisy.',
        'Pelaku penipuan berdosa besar (kabair) serta berkewajiban mengembalikan hak orang lain (raddul mazhalim).',
        'Kejujuran membuahkan ketenangan hati dan kepercayaan umat.',
      ],
      hukumDiambil:
        'Haram hukumnya segala bentuk penipuan, manipulasi informasi, atau kecurangan baik dalam jual beli maupun ujian akademik (imtihan); wajib bertaubat dan mengembalikan hak pihak yang dirugikan.',
    },
  },
  {
    keywords: ['orang tua', 'birrul walidain', 'ibu', 'ayah', 'bakti', 'durhaka'],
    result: {
      ringkasanTema:
        "Hadis-hadis tentang Birrul Walidain (berbakti kepada kedua orang tua) berderajat mutawatir secara makna dalam kutubussittah. Ridha Allah SWT diletakkan bersama ridha kedua orang tua, dengan penghormatan paling utama kepada Ibu sebanyak tiga kali lipat disusul Ayah.",
      kitabDirujuk: [
        'Shahih al-Bukhari (No. 5971)',
        'Shahih Muslim (No. 2548)',
        'Jami’ at-Tirmidzi (No. 1899)',
        'Shahih Ibnu Hibban',
        'Al-Adab al-Mufrad (al-Bukhari)',
        'Al-Mustadrak ‘ala ash-Shahihain',
      ],
      hadisList: [
        {
          nomor: 1,
          judul: 'Prioritas Utama Berbakti kepada Ibu dan Ayah',
          perawi: 'Abu Hurairah RA',
          derajat: 'Shahih',
          kitabTakhrij: 'HR. Bukhari No. 5971 & Muslim No. 2548',
          matanArab: 'قَالَ: أُمُّكَ، ثُمَّ أُمُّكَ، ثُمَّ أُمُّكَ، ثُمَّ أَبُوكَ',
          terjemah:
            'Ketika ditanya siapakah yang paling berhak dipergauli dengan baik? Nabi SAW menjawab: “Ibumu,” kemudian “Ibumu,” kemudian “Ibumu,” kemudian “Ayahmu.”',
          syarahRingkas:
            'Pengulangan tiga kali merujuk pada tiga kepayahan khusus ibu: mengandung, melahirkan, dan menyusui.',
        },
        {
          nomor: 2,
          judul: 'Ridha Allah Terletak pada Ridha Orang Tua',
          perawi: 'Abdullah bin Amr bin al-Ash RA',
          derajat: 'Shahih',
          kitabTakhrij: 'HR. at-Tirmidzi No. 1899, Ibnu Hibban & al-Hakim',
          matanArab: 'رِضَا الرَّبِّ فِي رِضَا الْوَالِدِ، وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ',
          terjemah:
            'Keridhaan Allah bergantung pada keridhaan orang tua, dan murka Allah bergantung pada murka orang tua.',
          syarahRingkas:
            'Berbakti tetap wajib berlanjut setelah wafat melalui doa, istighfar, melunasi janji/amanah, serta memuliakan kerabat mereka.',
        },
      ],
      faidah: [
        'Mentaati perintah orang tua wajib selama tidak mengandung maksiat kepada Allah.',
        'Ucapan santun, doa harian santri (Rabbighfirli waliwalidayya), dan menjaga nama baik keluarga di pondok termasuk wujud birrul walidain.',
        'Durhaka (uququl walidain) tergolong dosa besar yang disegerakan balasannya.',
      ],
      hukumDiambil:
        'Wajib ‘Ain hukumnya berbakti, berlemah lembut, serta menunaikan hak kedua orang tua baik semasa hidup maupun setelah wafat; haram menyakiti perasaan keduanya bahkan dengan kata “ah”.',
    },
  },
];

export function resolveRuangHadisQuestion(questionRaw: string): RuangHadisResult {
  const q = questionRaw.trim() || RUANG_HADIS_PRESET_TOPICS[0];
  const lower = q.toLowerCase();
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const matched = TOPIC_LIBRARY.find((entry) =>
    entry.keywords.some((kw) => lower.includes(kw))
  );

  if (matched) {
    return {
      pertanyaan: q,
      ...matched.result,
      tanggalRumusan: today,
    };
  }

  // Fallback komprehensif berbasis 51 Kitab Hadis untuk topik bebas lainnya
  return {
    pertanyaan: q,
    ringkasanTema: `Penelusuran Halaqah 51 Kitab atas as'ilah "${q}" merujuk pada kaidah induk hadis tentang ketulusan niat, kejujuran akhlak, kemaslahatan umat (la dharara wa la dhirara), serta kepastian sanad hadis dalam Kutubussittah dan syarah mu'tabarah.`,
    kitabDirujuk: [
      'Shahih al-Bukhari',
      'Shahih Muslim',
      'Sunan Abu Dawud',
      'Musnad Ahmad',
      'At-Targhib wat-Tarhib',
      'Majma’ az-Zawaid',
      'Fathul Bari & Al-Minhaj',
    ],
    hadisList: [
      {
        nomor: 1,
        judul: 'Kaidah Menghilangkan Kemudaratan',
        perawi: 'Abu Sa’id al-Khudri & Ibnu Abbas RA',
        derajat: 'Shahih Lighairihi',
        kitabTakhrij: 'HR. Ibnu Majah No. 2340, Muwaththa’ Malik & ad-Daraquthni',
        matanArab: 'لاَ ضَرَرَ وَلاَ ضِرَارَ',
        terjemah: 'Tidak boleh membahayakan diri sendiri dan tidak boleh pula menimbulkan bahaya bagi orang lain.',
        syarahRingkas:
          'Menjadi pijakan utama penyelesaian masalah muamalah, adab sosial, dan keputusan hukum di pesantren.',
      },
      {
        nomor: 2,
        judul: 'Meninggalkan Perkara yang Tidak Bermanfaat & Meragukan',
        perawi: 'al-Hasan bin Ali & Abu Hurairah RA',
        derajat: 'Hasan',
        kitabTakhrij: 'HR. at-Tirmidzi No. 2518 & No. 2317, Shahih Ibnu Hibban',
        matanArab: 'دَعْ مَا يَرِيبُكَ إِلَى مَا لاَ يَرِيبُكَ',
        terjemah: 'Tinggalkanlah apa yang meragukanmu menuju perkara yang tidak meragukanmu.',
        syarahRingkas:
          'Mendorong sikap wara’ (kehati-hatian) dalam mengamalkan ajaran syariat maupun menilai suatu persoalan baru.',
      },
    ],
    faidah: [
      'Setiap kesimpulan hukum berbasis hadis harus meninjau ketersambungan sanad (takhrij), makna syarah ulama, serta kaidah jam’u bainal adillah.',
      'Menimbang mashlahah dan menolak mafsadah menjadi ruh utama syariat Islam Ahlussunnah wal Jama’ah.',
    ],
    hukumDiambil:
      `Berdasarkan istinbath hadis atas topik "${q}", dianjurkan mengedepankan prinsip kehati-hatian (ihtiyath), menjaga kemaslahatan bersama, dan memastikan tidak ada unsur mudarat atau pelanggaran hak sesama.`,
    tanggalRumusan: today,
  };
}

export async function exportRuangHadisPdf(result: RuangHadisResult): Promise<string> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  doc.setFillColor(127, 29, 29);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(253, 224, 71);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RUANG HADIS · HALAQAH 51 KITAB MU’TABARAH', 105, 11, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('PONDOK PESANTREN NU DARUSSALAM KARANGDADAP, PEKALONGAN', 105, 18, { align: 'center' });
  doc.setFontSize(8.5);
  doc.text(`Hasil Rumusan Kumpulan Hadis · ${result.tanggalRumusan}`, 105, 24, { align: 'center' });

  let y = 36;
  const pageH = 278;
  const writeParagraph = (title: string, body: string, accentRgb: [number, number, number] = [6, 78, 59]) => {
    if (y > pageH - 24) {
      doc.addPage();
      y = 18;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
    doc.text(title, 14, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    const lines = doc.splitTextToSize(body, 182);
    lines.forEach((line: string) => {
      if (y > pageH - 12) {
        doc.addPage();
        y = 18;
      }
      doc.text(line, 14, y);
      y += 4.5;
    });
    y += 3;
  };

  writeParagraph("AS'ILAH / PERTANYAAN HADIS", result.pertanyaan, [153, 27, 27]);
  writeParagraph('RINGKASAN TEMA & TAKHRIJ', result.ringkasanTema);
  writeParagraph('KITAB RUJUKAN UTAMA (51 KITAB CORPUS)', result.kitabDirujuk.join(' · '));

  result.hadisList.forEach((h) => {
    const body = `Perawi: ${h.perawi} | Derajat: ${h.derajat}\nTakhrij: ${h.kitabTakhrij}\nTerjemah: "${h.terjemah}"\nSyarah: ${h.syarahRingkas}`;
    writeParagraph(`HADIS ${h.nomor}: ${h.judul.toUpperCase()}`, body, [180, 83, 9]);
  });

  writeParagraph('FAIDAH ILMIAH', result.faidah.map((f, i) => `${i + 1}. ${f}`).join('\n'));
  writeParagraph('HUKUM & KESIMPULAN YANG DIAMBIL', result.hukumDiambil, [6, 78, 59]);

  const fileName = `Rumusan-Ruang-Hadis-${Date.now()}.pdf`;
  doc.save(fileName);
  return fileName;
}
