import type { ModuleTutorialSlide, SlideDiagramType } from './tutorialData.ts';

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill?: string,
  stroke?: string,
  lineWidth = 2
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

function drawPhoneMockup(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  personName: string,
  subLabel: string,
  shiftLabel: string,
  badgeText: string,
  accentHex: string
) {
  // Phone outer bezel
  roundRect(ctx, x, y, w, h, 34, '#0f172a', '#334155', 5);
  // Screen
  roundRect(ctx, x + 12, y + 14, w - 24, h - 28, 24, '#f8fafc');
  // Header inside phone
  roundRect(ctx, x + 12, y + 14, w - 24, 150, 24, '#064e3b');
  ctx.fillStyle = '#064e3b';
  ctx.fillRect(x + 12, y + 130, w - 24, 34);

  // Notch
  roundRect(ctx, x + w / 2 - 42, y + 22, 84, 14, 7, '#0f172a');

  ctx.fillStyle = '#a7f3d0';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(title, x + 28, y + 60);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 21px sans-serif';
  ctx.fillText(personName, x + 28, y + 90);

  ctx.fillStyle = '#fcd34d';
  ctx.font = '13px sans-serif';
  ctx.fillText(subLabel, x + 28, y + 112);

  // Live clock pill
  roundRect(ctx, x + 28, y + 124, w - 56, 30, 10, 'rgba(255,255,255,0.14)');
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px monospace';
  ctx.fillText(shiftLabel, x + 40, y + 144);

  // Status card
  roundRect(ctx, x + 26, y + 180, w - 52, 88, 16, '#ffffff', '#e2e8f0', 2);
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('SWAFOTO + LOKASI GPS POS', x + 40, y + 204);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('-6.9765, 109.6832 (±18m)', x + 40, y + 230);
  roundRect(ctx, x + 40, y + 240, 140, 20, 10, '#dcfce7');
  ctx.fillStyle = '#166534';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText(badgeText, x + 52, y + 254);

  // Action buttons
  roundRect(ctx, x + 26, y + 284, w - 52, 46, 14, accentHex);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CEK IN SWAFOTO + GPS', x + w / 2, y + 312);

  roundRect(ctx, x + 26, y + 342, (w - 60) / 2, 40, 12, '#e2e8f0');
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('Istirahat', x + 26 + (w - 60) / 4, y + 367);

  roundRect(ctx, x + 34 + (w - 60) / 2, y + 342, (w - 60) / 2, 40, 12, '#e11d48');
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Cek Out', x + 34 + ((w - 60) * 3) / 4, y + 367);

  // Bottom bar
  roundRect(ctx, x + 26, y + 398, w - 52, 34, 10, '#ecfdf5', '#a7f3d0', 1.5);
  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('Absen Pengajuan · Tukar Shift · PDF', x + w / 2, y + 419);
  ctx.textAlign = 'left';
}

export function generateSlideVisualDataUrl(
  diagramType: SlideDiagramType,
  title: string
): string {
  const W = 920;
  const H = 560;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Clean light editorial background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#f8fafc');
  bg.addColorStop(1, '#ecfdf5');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle decorative grid dots
  ctx.fillStyle = 'rgba(6, 95, 70, 0.06)';
  for (let gx = 28; gx < W; gx += 36) {
    for (let gy = 28; gy < H; gy += 36) {
      ctx.beginPath();
      ctx.arc(gx, gy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Top miniature app chrome header
  roundRect(ctx, 28, 22, W - 56, 48, 14, '#064e3b');
  ctx.fillStyle = '#fcd34d';
  ctx.beginPath();
  ctx.arc(52, 46, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('PP NU DARUSSALAM KARANGDADAP — VISUALISASI ALUR MODUL', 72, 52);

  switch (diagramType) {
    case 'architecture': {
      const centerW = 280;
      const centerX = W / 2 - centerW / 2;
      roundRect(ctx, centerX, 215, centerW, 118, 20, '#064e3b', '#fcd34d', 3);
      ctx.fillStyle = '#fcd34d';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('INTI DATABASE ERP TERPADU', W / 2, 250);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('14 Modul Pesantren', W / 2, 280);
      ctx.fillStyle = '#a7f3d0';
      ctx.font = '13px sans-serif';
      ctx.fillText('Real-Time · Multi-Role · PWA HP', W / 2, 306);

      const nodes = [
        { x: 48, y: 100, label: 'Pengasuh & Pimpinan', sub: 'Dashboard KPI & Sidang', col: '#0f766e' },
        { x: 632, y: 100, label: 'Dewan Asatidz (Guru)', sub: 'Soal, Nilai & Absen GPS', col: '#047857' },
        { x: 48, y: 390, label: 'Regu Satpam Keamanan', sub: 'Riyadi · Suwarno · Sopoyono', col: '#b45309' },
        { x: 632, y: 390, label: 'Wali Santri & Keuangan', sub: 'Syahriyah, RFID & Neraca', col: '#1d4ed8' },
      ];
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.moveTo(n.x + 120, n.y + 42);
        ctx.lineTo(W / 2, 274);
        ctx.stroke();
      });
      nodes.forEach((n) => {
        roundRect(ctx, n.x, n.y, 240, 86, 16, '#ffffff', n.col, 2.5);
        ctx.fillStyle = n.col;
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(n.label, n.x + 120, n.y + 36);
        ctx.fillStyle = '#475569';
        ctx.font = '13px sans-serif';
        ctx.fillText(n.sub, n.x + 120, n.y + 62);
      });
      ctx.textAlign = 'left';
      break;
    }

    case 'absensi_satpam': {
      drawPhoneMockup(
        ctx,
        52,
        90,
        305,
        444,
        'ABSENSI MOBILE SATPAM',
        'Pak Riyadi',
        'Komandan Regu · Pos Gerbang',
        'Shift Pagi (07.00 - 15.00 WIB)',
        'GPS POS TERKUNCI',
        '#fbbf24'
      );

      // Right cards showing all 3 satpam + features
      const cards = [
        { name: '1. Pak Riyadi — Shift Pagi (07.00 - 15.00)', desc: 'Pos Gerbang Utama · Username: riyadi', bg: '#ecfdf5', bd: '#10b981' },
        { name: '2. Pak Suwarno — Shift Sore (15.00 - 23.00)', desc: 'Pos Penjengukan Wali · Username: suwarno', bg: '#eff6ff', bd: '#3b82f6' },
        { name: '3. Pak Sopoyono — Shift Malam (23.00 - 07.00)', desc: 'Patroli Asrama & Putri · Username: sopoyono', bg: '#fffbeb', bd: '#f59e0b' },
      ];
      cards.forEach((c, idx) => {
        const cy = 96 + idx * 92;
        roundRect(ctx, 392, cy, 488, 78, 16, '#ffffff', c.bd, 2.5);
        roundRect(ctx, 408, cy + 16, 46, 46, 12, c.bg);
        ctx.fillStyle = '#064e3b';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(String(idx + 1), 431, cy + 45);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(c.name, 468, cy + 34);
        ctx.fillStyle = '#475569';
        ctx.font = '13px sans-serif';
        ctx.fillText(c.desc, 468, cy + 56);
      });

      roundRect(ctx, 392, 382, 488, 148, 18, '#064e3b');
      ctx.fillStyle = '#fcd34d';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('FITUR LENGKAP PERSIS ABSENSI GURU:', 414, 414);
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px sans-serif';
      ctx.fillText('• Cek In Swafoto Kamera + Watermark GPS & Jam WIB', 414, 444);
      ctx.fillText('• Tombol Istirahat / Sholat, Cek Out & Tukar Shift', 414, 469);
      ctx.fillText('• Absen Pengajuan Kendala + Unduh Rekap Mingguan/Bulanan PDF', 414, 494);
      ctx.fillText('• Dapat Diunduh langsung ke HP Android & iPhone (PWA)', 414, 518);
      break;
    }

    case 'absensi_guru': {
      drawPhoneMockup(
        ctx,
        52,
        90,
        305,
        444,
        'ABSENSI MOBILE ASATIDZ',
        'Ust. Ahmad Fauzi',
        'Madrasah Diniyah Salafiyah',
        'Sesi Jam Ke-1 (18.00 - 19.00)',
        'WAJAH & GPS COCOK',
        '#34d399'
      );
      const steps = [
        { t: 'Pilih Sesi Fleksibel (1 Jam/Sesi)', d: 'Ngaji Subuh, Takhasus Sore, MDS Jam 1-3, Sorogan Malam' },
        { t: 'Cek In Swafoto & Cek Out Otomatis', d: 'Durasi mengajar dihitung akurat beserta catatan keterlambatan' },
        { t: 'Form Absen Pengajuan & Izin Badal', d: 'Solusi jika sinyal GPS lemah atau menugaskan Ustadz Badal' },
        { t: 'Integrasi Bisyaroh & PDF Bulanan', d: 'Kepala Madin memverifikasi log foto & mengunduh PDF' },
      ];
      steps.forEach((st, idx) => {
        const sy = 96 + idx * 108;
        roundRect(ctx, 392, sy, 488, 92, 16, '#ffffff', '#059669', 2);
        ctx.fillStyle = '#065f46';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`${idx + 1}. ${st.t}`, 414, sy + 34);
        ctx.fillStyle = '#475569';
        ctx.font = '13.5px sans-serif';
        ctx.fillText(st.d, 414, sy + 64);
      });
      break;
    }

    case 'munaqosyah_3d': {
      const benches = [
        { title: 'BANGKU 1: MODERATOR', sub: 'Pemeriksaan Adab & Berkas', col: '#065f46', status: 'Menguji: Zidni Albi' },
        { title: 'BANGKU 2: NAHWU SHOROF', sub: 'Imrithi / Alfiyah Ibnu Malik', col: '#1d4ed8', status: 'Menguji: Fahri Maulana' },
        { title: 'BANGKU 3: FIQH KITAB', sub: "Fathul Qorib / Fathul Mu'in", col: '#7c3aed', status: 'Menguji: Siti Aminah' },
        { title: "BANGKU 4: AL-QUR'AN", sub: 'Tartil, Tajwid & Fashohah', col: '#b45309', status: 'Menguji: Hilya Aulia' },
      ];
      benches.forEach((b, i) => {
        const bx = i % 2 === 0 ? 48 : 476;
        const by = i < 2 ? 96 : 254;
        roundRect(ctx, bx, by, 396, 136, 18, '#ffffff', b.col, 3);
        roundRect(ctx, bx, by, 396, 40, 16, b.col);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText(b.title, bx + 20, by + 26);
        ctx.fillStyle = '#334155';
        ctx.font = '14px sans-serif';
        ctx.fillText(b.sub, bx + 20, by + 72);
        roundRect(ctx, bx + 20, by + 90, 220, 28, 10, '#ecfdf5');
        ctx.fillStyle = '#065f46';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`● ${b.status}`, bx + 32, by + 109);
      });
      roundRect(ctx, 48, 414, W - 96, 114, 18, '#064e3b');
      ctx.fillStyle = '#fcd34d';
      ctx.font = 'bold 17px sans-serif';
      ctx.fillText('REKAP NILAI OTOMATIS & UNDUH LAPORAN PDF', 72, 450);
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px sans-serif';
      ctx.fillText('Setelah santri melewati ke-4 bangku, nilai rata-rata, predikat Mumtaz/Jayyid Jiddan,', 72, 480);
      ctx.fillText('dan sertifikat PDF hasil Munaqosyah langsung dibuat otomatis oleh sistem.', 72, 504);
      break;
    }

    case 'imtihan_sidang': {
      // 7 Ruang visual grid on top + KKM 65 formula below
      roundRect(ctx, 48, 92, W - 96, 190, 18, '#ffffff', '#059669', 2);
      ctx.fillStyle = '#064e3b';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('DENAH OTOMATIS 7 RUANG UJIAN BEBAS CONTEK (PUTRA & PUTRI)', 70, 124);
      for (let r = 0; r < 7; r++) {
        const rx = 70 + r * 114;
        roundRect(ctx, rx, 142, 102, 118, 12, '#ecfdf5', '#10b981', 1.5);
        ctx.fillStyle = '#065f46';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Ruang 0${r + 1}`, rx + 51, 168);
        ctx.fillStyle = '#334155';
        ctx.font = '12px sans-serif';
        ctx.fillText('Acak Lintas', rx + 51, 196);
        ctx.fillText('Kelas', rx + 51, 214);
        ctx.fillStyle = '#047857';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('~52 Santri', rx + 51, 240);
      }
      ctx.textAlign = 'left';

      roundRect(ctx, 48, 302, W - 96, 224, 18, '#0f172a');
      ctx.fillStyle = '#fcd34d';
      ctx.font = 'bold 17px sans-serif';
      ctx.fillText('SIDANG KENAIKAN KELAS OTOMATIS (STANDAR KKM = 65)', 72, 336);
      ctx.fillStyle = '#ffffff';
      ctx.font = '15px sans-serif';
      ctx.fillText('Rumus: ((Rata Cawu 1 + Cawu 2) ÷ 2 + Ubudiyah + Amaliyah + MQK) ÷ 4 + Absensi (Sakit 0, Bolos -3)', 72, 370);

      const verdicts = [
        { lbl: 'Nilai ≥ 65 → Naik Kelas', bg: '#059669' },
        { lbl: 'Nilai < 65 → Notif ke Pengasuh & Ketua', bg: '#d97706' },
        { lbl: 'History & Ekspor Excel / PDF', bg: '#2563eb' },
      ];
      verdicts.forEach((v, idx) => {
        roundRect(ctx, 72 + idx * 265, 405, 250, 90, 14, v.bg);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(v.lbl, 72 + idx * 265 + 125, 456);
      });
      ctx.textAlign = 'left';
      break;
    }

    case 'bendahara': {
      const panels = [
        {
          t: '1. NERACA (AKTIVA & PASIVA)',
          lines: ['Kas & Bank Pondok', 'Piutang Syahriyah Santri', 'Aktiva Tetap (Dari Sarpras)', 'Klik baris -> Buku Besar (GL)'],
          col: '#065f46',
        },
        {
          t: '2. LABA / RUGI & CASHFLOW',
          lines: ['Pendapatan Syahriyah & Daftar Ulang', 'Beban Bisyaroh, Dapur & Listrik', 'Arus Kas Masuk & Keluar Rinci', 'Pratinjau & Cetak Resmi F4/A4'],
          col: '#1d4ed8',
        },
        {
          t: '3. SYAHRIYAH & DETEKSI BOYONG',
          lines: ['Pembayaran Bulanan & Daftar Ulang', 'Agenda Iuran Kema’hadiyahan', 'Ledger Independen di Bendahara', 'Tunggakan Santri Boyong Tetap Aman'],
          col: '#b45309',
        },
      ];
      panels.forEach((p, idx) => {
        const px = 44 + idx * 284;
        roundRect(ctx, px, 96, 266, 424, 18, '#ffffff', p.col, 2.5);
        roundRect(ctx, px, 96, 266, 52, 16, p.col);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13.5px sans-serif';
        ctx.fillText(p.t, px + 16, 128);
        p.lines.forEach((ln, li) => {
          roundRect(ctx, px + 16, 172 + li * 80, 234, 60, 12, '#f8fafc', '#cbd5e1', 1.5);
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(ln, px + 26, 207 + li * 80);
        });
      });
      break;
    }

    case 'pwa_install': {
      // Android Chrome step card & iPhone Safari step card side by side
      roundRect(ctx, 48, 96, 396, 426, 22, '#ffffff', '#059669', 3);
      roundRect(ctx, 48, 96, 396, 58, 20, '#065f46');
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('HP ANDROID (GOOGLE CHROME)', 74, 132);
      const androidSteps = [
        '1. Buka link ERP Darussalam di Chrome',
        '2. Ketuk tombol "Unduh Aplikasi HP" di atas',
        '3. Atau klik Menu (⋮) -> Install Aplikasi',
        '4. Ikon ERP & Shortcut Absensi muncul di HP',
      ];
      androidSteps.forEach((s, i) => {
        roundRect(ctx, 72, 178 + i * 78, 348, 58, 12, '#ecfdf5', '#a7f3d0', 1.5);
        ctx.fillStyle = '#064e3b';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(s, 88, 212 + i * 78);
      });

      roundRect(ctx, 476, 96, 396, 426, 22, '#ffffff', '#0284c7', 3);
      roundRect(ctx, 476, 96, 396, 58, 20, '#0369a1');
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('HP IPHONE / IPAD (SAFARI)', 502, 132);
      const iosSteps = [
        '1. Buka link ERP Darussalam di Safari',
        '2. Ketuk ikon Bagikan (Share) di bawah',
        '3. Pilih "Tambah ke Layar Utama"',
        '4. Ketuk "Tambah" — Siap dipakai Fullscreen',
      ];
      iosSteps.forEach((s, i) => {
        roundRect(ctx, 500, 178 + i * 78, 348, 58, 12, '#f0f9ff', '#bae6fd', 1.5);
        ctx.fillStyle = '#0c4a6e';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(s, 516, 212 + i * 78);
      });
      break;
    }

    default: {
      // Crisp 3-stage workflow diagram customized with the slide title
      roundRect(ctx, 48, 96, W - 96, 86, 16, '#ffffff', '#059669', 2);
      ctx.fillStyle = '#064e3b';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(title.slice(0, 56), 72, 138);
      ctx.fillStyle = '#475569';
      ctx.font = '14px sans-serif';
      ctx.fillText('Alur Kerja Terintegrasi · Input Digital -> Verifikasi Pimpinan -> Laporan & Arsip Resmi', 72, 164);

      const flow = [
        { step: 'TAHAP 1: INPUT DATA', sub: 'Oleh Guru / Petugas / Santri / Satpam via HP & PC', col: '#047857' },
        { step: 'TAHAP 2: VALIDASI SISTEM', sub: 'Persetujuan Pimpinan, Audit Log & Notifikasi Real-Time', col: '#d97706' },
        { step: 'TAHAP 3: REKAP & CETAK', sub: 'Ekspor PDF / Excel Resmi Kop PP NU Darussalam', col: '#1d4ed8' },
      ];
      flow.forEach((f, idx) => {
        const fx = 48 + idx * 284;
        roundRect(ctx, fx, 214, 256, 290, 18, '#ffffff', f.col, 2.5);
        roundRect(ctx, fx, 214, 256, 52, 16, f.col);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(f.step, fx + 128, 246);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 14px sans-serif';
        const words = f.sub.split(' ');
        let line = '';
        let ly = 320;
        words.forEach((w) => {
          const test = line ? `${line} ${w}` : w;
          if (ctx.measureText(test).width > 210) {
            ctx.fillText(line, fx + 128, ly);
            line = w;
            ly += 24;
          } else {
            line = test;
          }
        });
        if (line) ctx.fillText(line, fx + 128, ly);
        roundRect(ctx, fx + 36, 430, 184, 42, 12, '#ecfdf5');
        ctx.fillStyle = '#065f46';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('Terhubung Real-Time', fx + 128, 456);
      });
      ctx.textAlign = 'left';
      break;
    }
  }

  return canvas.toDataURL('image/png');
}

export async function exportSlidesToPptx(slides: ModuleTutorialSlide[]): Promise<string> {
  const { default: PptxGenJS } = await import('pptxgenjs');
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 in
  pptx.author = 'PP NU Darussalam Karangdadap';
  pptx.title = 'Presentasi Panduan Sistem ERP Terpadu PP NU Darussalam';

  // COVER SLIDE
  const cover = pptx.addSlide();
  cover.background = { color: '064E3B' };
  cover.addShape(pptx.ShapeType.rect, { x: 0, y: 6.85, w: 13.333, h: 0.65, fill: { color: 'FBBF24' } });
  cover.addText('PONDOK PESANTREN NU DARUSSALAM KARANGDADAP', {
    x: 0.9,
    y: 1.4,
    w: 11.5,
    fontSize: 16,
    bold: true,
    color: 'FCD34D',
  });
  cover.addText('Panduan & Presentasi Sistem ERP Pesantren Terpadu', {
    x: 0.9,
    y: 2.0,
    w: 11.5,
    fontSize: 36,
    bold: true,
    color: 'FFFFFF',
  });
  cover.addText(
    'Disajikan untuk Pengasuh (KH. Amin Maizun), Dewan Asatidz / Guru-Guru, Pengurus Yayasan,\nserta Regu Satpam Keamanan (Pak Riyadi, Pak Suwarno & Pak Sopoyono)',
    {
      x: 0.9,
      y: 3.4,
      w: 11.2,
      fontSize: 18,
      color: 'D1FAE5',
      lineSpacing: 28,
    }
  );
  cover.addText('Total 15 Slide Materi · Kombinasi Visual Diagram + Teks Panduan · Tahun Ajaran 2026/2027', {
    x: 0.9,
    y: 6.1,
    w: 11.5,
    fontSize: 13,
    bold: true,
    color: 'A7F3D0',
  });
  cover.addNotes(
    'Slide pembuka untuk presentasi bersama di aula pondok di hadapan Pengasuh, Dewan Guru, dan Regu Satpam.'
  );

  // MODULE SLIDES (IMAGE + TEXT COMBINATION)
  for (const s of slides) {
    const slide = pptx.addSlide();
    slide.background = { color: 'F8FAFC' };

    // Top Header Banner
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 1.15, fill: { color: '064E3B' } });
    slide.addText(`SLIDE ${String(s.slideNumber).padStart(2, '0')} · AUDIENS: ${s.targetTags.join(' / ').toUpperCase()}`, {
      x: 0.6,
      y: 0.14,
      w: 12,
      fontSize: 11,
      bold: true,
      color: 'FCD34D',
    });
    slide.addText(s.title, {
      x: 0.6,
      y: 0.4,
      w: 12.1,
      fontSize: 22,
      bold: true,
      color: 'FFFFFF',
    });
    slide.addText(s.subtitle, {
      x: 0.6,
      y: 0.82,
      w: 12.1,
      fontSize: 12,
      color: 'A7F3D0',
    });

    // Left Column: Generated Visual PNG Diagram
    const visualUrl = generateSlideVisualDataUrl(s.diagramType, s.title);
    if (visualUrl) {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.55,
        y: 1.4,
        w: 6.45,
        h: 4.15,
        fill: { color: 'FFFFFF' },
        line: { color: 'CBD5E1', width: 1.2 },
      });
      slide.addImage({
        data: visualUrl,
        x: 0.65,
        y: 1.5,
        w: 6.25,
        h: 3.95,
      });
    }

    // Right Column: Structured Presentation Text Points
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.2,
      y: 1.4,
      w: 5.58,
      h: 4.15,
      fill: { color: 'FFFFFF' },
      line: { color: 'A7F3D0', width: 1.5 },
    });
    slide.addText('POIN UTAMA & FUNGSI MODUL', {
      x: 7.45,
      y: 1.58,
      w: 5.1,
      fontSize: 12,
      bold: true,
      color: '065F46',
    });
    slide.addText(
      s.bullets.map((b) => ({
        text: b,
        options: { bullet: { indent: 14 }, paraSpaceAfter: 10 },
      })),
      {
        x: 7.42,
        y: 2.0,
        w: 5.15,
        h: 3.35,
        fontSize: 13.5,
        color: '1E293B',
        valign: 'top',
        lineSpacing: 20,
      }
    );

    // Bottom Presenter Summary Bar
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.55,
      y: 5.75,
      w: 12.23,
      h: 1.35,
      fill: { color: 'ECFDF5' },
      line: { color: '6EE7B7', width: 1 },
    });
    slide.addText('CATATAN PENYAMPAIAN (NASKAH PRESENTASI):', {
      x: 0.75,
      y: 5.88,
      w: 11.8,
      fontSize: 10.5,
      bold: true,
      color: '047857',
    });
    slide.addText(s.speakerNotes, {
      x: 0.75,
      y: 6.18,
      w: 11.8,
      h: 0.85,
      fontSize: 12,
      color: '0F172A',
      valign: 'top',
    });

    slide.addNotes(s.speakerNotes);
  }

  // CLOSING SLIDE
  const end = pptx.addSlide();
  end.background = { color: '064E3B' };
  end.addText('Terima Kasih — Mari Sukseskan Digitalisasi Pondok Pesantren', {
    x: 1,
    y: 2.4,
    w: 11.3,
    fontSize: 32,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
  });
  end.addText(
    'Silakan langsung pasang aplikasi di HP Android / iPhone masing-masing\n(Guru: Absensi & Imtihan | Satpam: Pak Riyadi, Pak Suwarno, Pak Sopoyono)',
    {
      x: 1.2,
      y: 3.6,
      w: 10.9,
      fontSize: 18,
      color: 'FCD34D',
      align: 'center',
      lineSpacing: 28,
    }
  );

  const fileName = 'Presentasi_ERP_PP_NU_Darussalam_Karangdadap.pptx';
  await pptx.writeFile({ fileName });
  return fileName;
}

export async function exportSlidesToPdfHandout(slides: ModuleTutorialSlide[]): Promise<string> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [297, 167] }); // 16:9 slide ratio

  slides.forEach((s, index) => {
    if (index > 0) doc.addPage();
    doc.setFillColor(6, 78, 59);
    doc.rect(0, 0, 297, 22, 'F');
    doc.setTextColor(252, 211, 77);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`SLIDE ${String(s.slideNumber).padStart(2, '0')} · ${s.targetTags.join(' / ')}`, 12, 8);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(s.title, 12, 16.5);

    const visualUrl = generateSlideVisualDataUrl(s.diagramType, s.title);
    if (visualUrl) {
      doc.addImage(visualUrl, 'PNG', 12, 28, 142, 86);
    }

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(160, 28, 125, 86, 3, 3, 'FD');
    doc.setTextColor(6, 95, 70);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('POIN PENJELASAN:', 166, 36);

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    let yCursor = 44;
    s.bullets.forEach((b) => {
      const wrapped = doc.splitTextToSize(`• ${b}`, 113) as string[];
      doc.text(wrapped, 166, yCursor);
      yCursor += wrapped.length * 4.6 + 3;
    });

    doc.setFillColor(236, 253, 245);
    doc.roundedRect(12, 120, 273, 36, 3, 3, 'F');
    doc.setTextColor(4, 120, 87);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('NASKAH PEMBICARA:', 17, 127);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const notesWrapped = doc.splitTextToSize(s.speakerNotes, 262) as string[];
    doc.text(notesWrapped, 17, 134);
  });

  const fileName = 'Handout_Presentasi_ERP_PP_NU_Darussalam.pdf';
  doc.save(fileName);
  return fileName;
}
