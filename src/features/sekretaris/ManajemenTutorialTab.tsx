import React, { useMemo, useState } from 'react';
import {
  Video,
  Presentation,
  Plus,
  Edit3,
  Trash2,
  Upload,
  Download,
  Search,
  ExternalLink,
  Film,
  FileCheck2,
  PlayCircle,
  X,
  Users,
  CheckCircle2,
  Sparkles,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { useAppStore, type TutorialVideoLink } from '../../lib/store.ts';
import {
  MODULE_TUTORIAL_SLIDES,
  type AudienceFilterType,
  type ModuleTutorialSlide,
} from '../panduan/tutorialData.ts';
import { exportSlidesToPptx } from '../panduan/slideVisualGenerator.ts';
import {
  savePptBinary,
  loadPptBinary,
  removePptBinary,
  triggerDataUrlDownload,
} from '../../lib/pptStorage.ts';

interface ManajemenTutorialTabProps {
  onNotify: (msg: string) => void;
}

function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function resolveVideoPreviewSource(rawUrl: string): { kind: 'video' | 'iframe'; src: string } {
  const clean = (rawUrl || '').trim();
  if (!clean) return { kind: 'iframe', src: '' };
  if (/\.(mp4|webm|ogg|m4v)(\?.*)?$/i.test(clean) || clean.startsWith('blob:') || clean.startsWith('/assets/')) {
    return { kind: 'video', src: clean };
  }
  const ytWatch = clean.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/);
  if (ytWatch) {
    return { kind: 'iframe', src: `https://www.youtube.com/embed/${ytWatch[1]}?rel=0` };
  }
  const driveMatch = clean.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([A-Za-z0-9_-]+)/);
  if (driveMatch) {
    return { kind: 'iframe', src: `https://drive.google.com/file/d/${driveMatch[1]}/preview` };
  }
  const vimeoMatch = clean.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }
  return { kind: 'iframe', src: clean };
}

function extractYouTubeThumb(rawUrl: string): string {
  const m = (rawUrl || '').match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/
  );
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : '';
}

function compressThumbnailFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca berkas gambar.'));
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) {
        reject(new Error('Data gambar kosong.'));
        return;
      }
      const img = new Image();
      img.onerror = () => reject(new Error('Format gambar tidak didukung.'));
      img.onload = () => {
        const targetW = 640;
        const targetH = 360;
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        // Cover-crop cleanly to 16:9 mobile card ratio
        const srcRatio = img.width / Math.max(1, img.height);
        const dstRatio = targetW / targetH;
        let sx = 0;
        let sy = 0;
        let sw = img.width;
        let sh = img.height;
        if (srcRatio > dstRatio) {
          sw = img.height * dstRatio;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / dstRatio;
          sy = (img.height - sh) / 2;
        }
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(0, 0, targetW, targetH);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export const ManajemenTutorialTab: React.FC<ManajemenTutorialTabProps> = ({ onNotify }) => {
  const {
    currentUser,
    tutorialVideoLinks,
    tutorialPptTemplates,
    setTutorialVideoLink,
    deleteTutorialVideoLink,
    setTutorialPptTemplate,
    deleteTutorialPptTemplate,
  } = useAppStore();

  const [audienceFilter, setAudienceFilter] = useState<AudienceFilterType>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Tambah/Edit Link Video
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [formSlideId, setFormSlideId] = useState<string>(MODULE_TUTORIAL_SLIDES[0].id);
  const [formSumber, setFormSumber] = useState<TutorialVideoLink['sumberType']>('AI Video Link');
  const [formJudul, setFormJudul] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formThumbnail, setFormThumbnail] = useState('');
  const [thumbBusy, setThumbBusy] = useState(false);

  // Video Preview Modal
  const [previewVideo, setPreviewVideo] = useState<{
    slideTitle: string;
    link: TutorialVideoLink;
  } | null>(null);

  // Loading state for PPTX operations
  const [busySlideId, setBusySlideId] = useState<string | null>(null);

  const filteredModules = useMemo(() => {
    return MODULE_TUTORIAL_SLIDES.filter((s) => {
      if (
        audienceFilter !== 'Semua' &&
        s.audiens !== audienceFilter &&
        !s.targetTags.includes(audienceFilter)
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.title.toLowerCase().includes(q) ||
          s.subtitle.toLowerCase().includes(q) ||
          s.targetTags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [audienceFilter, searchQuery]);

  const totalVideoCount = useMemo(
    () => Object.values(tutorialVideoLinks).filter((v) => Boolean(v?.url)).length,
    [tutorialVideoLinks]
  );

  const totalPptCount = useMemo(
    () => Object.keys(tutorialPptTemplates).length,
    [tutorialPptTemplates]
  );

  const openVideoModalForSlide = (slide: ModuleTutorialSlide, presetThumb?: string) => {
    const existing = tutorialVideoLinks[slide.id];
    setFormSlideId(slide.id);
    setFormSumber(existing?.sumberType || 'AI Video Link');
    setFormJudul(existing?.judul || `Panduan Video — ${slide.title}`);
    setFormUrl(existing?.url || '');
    setFormThumbnail(presetThumb !== undefined ? presetThumb : existing?.thumbnailUrl || '');
    setVideoModalOpen(true);
  };

  const openAddNewVideoModal = () => {
    const firstEmpty =
      MODULE_TUTORIAL_SLIDES.find((s) => !tutorialVideoLinks[s.id]?.url) || MODULE_TUTORIAL_SLIDES[0];
    openVideoModalForSlide(firstEmpty);
  };

  const handleSaveVideoLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUrl.trim()) return;
    const targetSlide = MODULE_TUTORIAL_SLIDES.find((s) => s.id === formSlideId);
    setTutorialVideoLink(formSlideId, {
      url: formUrl.trim(),
      judul: formJudul.trim() || targetSlide?.title || 'Video Panduan Modul',
      thumbnailUrl: formThumbnail.trim(),
      sumberType: formSumber,
      updatedBy: currentUser.nama,
    });
    setVideoModalOpen(false);
    onNotify(`Link video & thumbnail kustom untuk "${targetSlide?.title || formSlideId}" berhasil disimpan.`);
  };

  const handleQuickUploadThumbForSlide = async (slide: ModuleTutorialSlide, file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onNotify('Harap unggah file gambar (JPG, PNG, atau WebP) untuk thumbnail.');
      return;
    }
    setThumbBusy(true);
    try {
      const compressed = await compressThumbnailFile(file);
      const existing = tutorialVideoLinks[slide.id];
      if (existing?.url) {
        setTutorialVideoLink(slide.id, {
          url: existing.url,
          judul: existing.judul || `Panduan Video — ${slide.title}`,
          thumbnailUrl: compressed,
          sumberType: existing.sumberType,
          updatedBy: currentUser.nama,
        });
        onNotify(`Thumbnail kustom untuk "${slide.title}" diperbarui & tampil di aplikasi mobile.`);
      } else {
        openVideoModalForSlide(slide, compressed);
        onNotify('Thumbnail siap! Lengkapi URL video agar tampil di aplikasi mobile santri.');
      }
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Gagal memproses thumbnail.');
    } finally {
      setThumbBusy(false);
    }
  };

  const handleUploadPptx = (slide: ModuleTutorialSlide, file: File | undefined) => {
    if (!file) return;
    const lower = file.name.toLowerCase();
    if (!lower.endsWith('.pptx') && !lower.endsWith('.ppt')) {
      onNotify('Format file tidak valid. Harap unggah file presentasi PowerPoint (.pptx atau .ppt).');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      onNotify('Ukuran file maksimal 20 MB per modul agar penyimpanan tetap cepat.');
      return;
    }

    setBusySlideId(slide.id);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = typeof reader.result === 'string' ? reader.result : '';
        if (!dataUrl) {
          onNotify('Gagal membaca berkas .pptx yang dipilih.');
          return;
        }
        const nowStr = new Date().toISOString().split('T')[0];
        await savePptBinary({
          slideId: slide.id,
          fileName: file.name,
          mimeType:
            file.type ||
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          fileSize: file.size,
          dataUrl,
          updatedAt: nowStr,
        });
        setTutorialPptTemplate(slide.id, {
          modulNama: slide.title,
          fileName: file.name,
          fileSize: file.size,
          mimeType:
            file.type ||
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          uploadedBy: currentUser.nama,
        });
        onNotify(`Template PPTX "${file.name}" berhasil diunggah untuk modul ${slide.title}.`);
      } finally {
        setBusySlideId(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadUploadedPptx = async (slideId: string, fallbackName: string) => {
    setBusySlideId(slideId);
    try {
      const rec = await loadPptBinary(slideId);
      if (!rec || !rec.dataUrl) {
        onNotify('Berkas biner template tidak ditemukan di penyimpanan lokal browser ini. Silakan unggah ulang.');
        return;
      }
      triggerDataUrlDownload(rec.dataUrl, rec.fileName || fallbackName);
      onNotify(`Template "${rec.fileName}" berhasil diunduh.`);
    } finally {
      setBusySlideId(null);
    }
  };

  const handleDeleteUploadedPptx = async (slide: ModuleTutorialSlide) => {
    setBusySlideId(slide.id);
    try {
      await removePptBinary(slide.id);
      deleteTutorialPptTemplate(slide.id);
      onNotify(`Template PPTX untuk "${slide.title}" dihapus.`);
    } finally {
      setBusySlideId(null);
    }
  };

  const handleDownloadStarterPptx = async (slide: ModuleTutorialSlide) => {
    setBusySlideId(slide.id);
    try {
      const fn = await exportSlidesToPptx([slide]);
      onNotify(`Draft PPTX bawaan "${fn}" berhasil diunduh untuk diedit di PowerPoint.`);
    } finally {
      setBusySlideId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="rounded-3xl bg-linear-to-r bg-[#07432A] from-emerald-950 via-emerald-900 to-teal-900 text-white p-5 sm:p-6 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admin Sekretariat · Pusat Kendali Materi &amp; Slide Presentasi</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
            Manajemen Tutorial Modul, Video Panduan &amp; Template Slide (.pptx)
          </h3>
          <p className="text-xs text-emerald-100/90 max-w-2xl leading-relaxed">
            Tambah, edit, atau hapus link video panduan (AI Video / YouTube / Google Drive / MP4) serta unggah template slide PowerPoint (<code>.pptx</code>) per modul. Perubahan langsung tersinkron ke Buku Panduan &amp; Aplikasi Khazanah.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={openAddNewVideoModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Link Video Modul</span>
          </button>
        </div>
      </div>

      {/* 3 Compact KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500">Total Modul Tutorial ERP</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5 tabular-nums">
              {MODULE_TUTORIAL_SLIDES.length} <span className="text-xs font-semibold text-slate-500">Modul</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Presentation className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500">Link Video Panduan Terpasang</p>
            <p className="text-2xl font-black text-emerald-800 mt-0.5 tabular-nums">
              {totalVideoCount} <span className="text-xs font-semibold text-slate-500">/ {MODULE_TUTORIAL_SLIDES.length}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500">Template .pptx Custom Terunggah</p>
            <p className="text-2xl font-black text-sky-800 mt-0.5 tabular-nums">
              {totalPptCount} <span className="text-xs font-semibold text-slate-500">Berkas</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
            <FileCheck2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            <span>Audiens:</span>
          </span>
          {(['Semua', 'Pengasuh', 'Guru', 'Satpam'] as AudienceFilterType[]).map((aud) => (
            <button
              key={aud}
              type="button"
              onClick={() => setAudienceFilter(aud)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                audienceFilter === aud
                  ? 'bg-emerald-800 text-white border-emerald-800'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-emerald-50'
              }`}
            >
              {aud}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama modul atau topik slide..."
            className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs focus:outline-hidden focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Module Management Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredModules.map((slide) => {
          const videoLink = tutorialVideoLinks[slide.id];
          const pptMeta = tutorialPptTemplates[slide.id];
          const isBusy = busySlideId === slide.id;

          return (
            <div
              key={slide.id}
              className="rounded-3xl bg-white border border-slate-200 p-5 shadow-2xs flex flex-col justify-between gap-4 hover:border-emerald-300 transition"
            >
              {/* Module Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-8 h-8 rounded-xl bg-emerald-900 text-amber-300 font-black text-xs flex items-center justify-center shrink-0">
                    {String(slide.slideNumber).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                      {slide.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {slide.targetTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section A: Video Tutorial Link Control */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Link Video Panduan Modul</span>
                  </span>
                  {videoLink?.url ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {videoLink.sumberType}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold">
                      Belum Ada Link
                    </span>
                  )}
                </div>

                {(() => {
                  const activeThumb =
                    videoLink?.thumbnailUrl || (videoLink?.url ? extractYouTubeThumb(videoLink.url) : '');
                  return (
                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-emerald-950 relative aspect-video flex items-center justify-center">
                      {activeThumb ? (
                        <img
                          src={activeThumb}
                          alt={`Thumbnail ${videoLink?.judul || slide.title}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-emerald-100/80 px-3 space-y-1">
                          <ImageIcon className="w-6 h-6 text-amber-300 mx-auto" />
                          <p className="text-[10px] font-bold">
                            Belum Ada Thumbnail Kustom (16:9 Mobile Santri)
                          </p>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-linear-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-amber-300 truncate">
                          {videoLink?.thumbnailUrl
                            ? 'Thumbnail Kustom Aktif'
                            : activeThumb
                            ? 'Thumbnail Otomatis YouTube'
                            : 'Sampul Default'}
                        </span>
                        <label className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-extrabold inline-flex items-center gap-1 cursor-pointer shrink-0 shadow-xs">
                          <Upload className="w-3 h-3" />
                          <span>{videoLink?.thumbnailUrl ? 'Ganti Thumb' : 'Unggah Thumb'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={thumbBusy}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              void handleQuickUploadThumbForSlide(slide, file);
                              e.target.value = '';
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  );
                })()}

                {videoLink?.url ? (
                  <div className="space-y-2">
                    <div className="text-xs bg-white rounded-xl border border-slate-200 p-2.5">
                      <p className="font-bold text-slate-900 truncate">
                        {videoLink.judul || slide.title}
                      </p>
                      <p className="text-[11px] text-emerald-700 truncate font-mono mt-0.5">
                        {videoLink.url}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Diperbarui oleh {videoLink.updatedBy} · {videoLink.updatedAt}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewVideo({ slideTitle: slide.title, link: videoLink })}
                        className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold inline-flex items-center gap-1"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Putar Pratinjau</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => openVideoModalForSlide(slide)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Link &amp; Thumb</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteTutorialVideoLink(slide.id);
                          onNotify(`Link video panduan "${slide.title}" dihapus.`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-bold inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] text-slate-500">
                      Tambahkan link video &amp; thumbnail kustom agar muncul menarik di aplikasi mobile santri.
                    </p>
                    <button
                      type="button"
                      onClick={() => openVideoModalForSlide(slide)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold inline-flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Link</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Section B: Upload Template Slide Presentasi (.pptx) */}
              <div className="rounded-2xl bg-amber-50/60 border border-amber-200 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold text-amber-950 flex items-center gap-1.5">
                    <Presentation className="w-3.5 h-3.5 text-amber-700" />
                    <span>File Template Slide Presentasi (.pptx)</span>
                  </span>
                  {pptMeta ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 text-[10px] font-extrabold">
                      Terunggah ({formatFileSize(pptMeta.fileSize)})
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-white border border-amber-200 text-amber-800 text-[10px] font-bold">
                      Template Bawaan
                    </span>
                  )}
                </div>

                {pptMeta && (
                  <div className="bg-white rounded-xl border border-amber-200 p-2.5 text-xs">
                    <p className="font-bold text-slate-900 truncate">{pptMeta.fileName}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Diunggah oleh {pptMeta.uploadedBy} · {pptMeta.uploadedAt}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-1.5">
                  <label
                    className={`px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition ${
                      isBusy ? 'opacity-60 pointer-events-none' : ''
                    }`}
                  >
                    {isBusy ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{pptMeta ? 'Ganti File .pptx' : 'Unggah Template .pptx'}</span>
                    <input
                      type="file"
                      accept=".pptx,.ppt,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        handleUploadPptx(slide, file);
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                  </label>

                  {pptMeta ? (
                    <>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleDownloadUploadedPptx(slide.id, pptMeta.fileName)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 text-emerald-900 text-[11px] font-bold inline-flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh .pptx</span>
                      </button>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleDeleteUploadedPptx(slide)}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-bold inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleDownloadStarterPptx(slide)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 border border-amber-300 text-amber-950 text-[11px] font-bold inline-flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Draft .pptx Bawaan</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Tambah / Edit Link Video */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 no-print">
          <form
            onSubmit={handleSaveVideoLink}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Video className="w-4 h-4 text-emerald-700" />
                  <span>Kelola Link Video Panduan Modul</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Mendukung YouTube, Google Drive, file MP4 langsung, maupun URL video hasil generate AI.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Modul Panduan</label>
                <select
                  value={formSlideId}
                  onChange={(e) => {
                    const nextId = e.target.value;
                    setFormSlideId(nextId);
                    const exist = tutorialVideoLinks[nextId];
                    const mod = MODULE_TUTORIAL_SLIDES.find((s) => s.id === nextId);
                    setFormSumber(exist?.sumberType || 'AI Video Link');
                    setFormJudul(exist?.judul || `Panduan Video — ${mod?.title || ''}`);
                    setFormUrl(exist?.url || '');
                    setFormThumbnail(exist?.thumbnailUrl || '');
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold"
                >
                  {MODULE_TUTORIAL_SLIDES.map((s) => (
                    <option key={s.id} value={s.id}>
                      #{s.slideNumber} — {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sumber Video</label>
                  <select
                    value={formSumber}
                    onChange={(e) => setFormSumber(e.target.value as TutorialVideoLink['sumberType'])}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 font-semibold"
                  >
                    <option value="AI Video Link">AI Video Link</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Google Drive">Google Drive</option>
                    <option value="MP4">File MP4 Langsung</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Judul Tampilan Video</label>
                  <input
                    type="text"
                    required
                    value={formJudul}
                    onChange={(e) => setFormJudul(e.target.value)}
                    placeholder="Mis: Tutorial Imtihan Dewan Guru"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL / Link Video Tutorial</label>
                <input
                  type="url"
                  required
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... atau https://.../video.mp4"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-xs"
                />
              </div>

              {/* Thumbnail Kustom Uploader */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Thumbnail Kustom (Tampilan Mobile Santri)</span>
                  </label>
                  {formThumbnail && (
                    <button
                      type="button"
                      onClick={() => setFormThumbnail('')}
                      className="text-[11px] font-bold text-rose-600 hover:underline"
                    >
                      Hapus Thumbnail
                    </button>
                  )}
                </div>

                {formThumbnail && (
                  <div className="rounded-xl overflow-hidden border border-slate-300 aspect-video bg-emerald-950 max-h-40 w-full">
                    <img
                      src={formThumbnail}
                      alt="Pratinjau Thumbnail Kustom"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <label className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-[11px] inline-flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{thumbBusy ? 'Memproses...' : 'Unggah Gambar Thumbnail'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={thumbBusy}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setThumbBusy(true);
                        try {
                          const dataUrl = await compressThumbnailFile(file);
                          setFormThumbnail(dataUrl);
                        } catch (err) {
                          onNotify(err instanceof Error ? err.message : 'Gagal membaca gambar.');
                        } finally {
                          setThumbBusy(false);
                          e.target.value = '';
                        }
                      }}
                      className="hidden"
                    />
                  </label>

                  {extractYouTubeThumb(formUrl) && (
                    <button
                      type="button"
                      onClick={() => setFormThumbnail(extractYouTubeThumb(formUrl))}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold"
                    >
                      Ambil Otomatis dari YouTube
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={formThumbnail.startsWith('data:') ? '' : formThumbnail}
                  onChange={(e) => setFormThumbnail(e.target.value)}
                  placeholder="Atau tempel URL gambar (.jpg/.png/.webp) jika ada..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs"
              >
                Simpan Link Video
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Pratinjau Video */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 no-print">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-950 text-white p-5 shadow-2xl space-y-3 border border-emerald-700/50">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px]">
                  {previewVideo.link.sumberType}
                </span>
                <h4 className="font-bold text-sm mt-1 truncate">
                  {previewVideo.link.judul || previewVideo.slideTitle}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setPreviewVideo(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {(() => {
              const resolved = resolveVideoPreviewSource(previewVideo.link.url);
              return (
                <div className="rounded-2xl overflow-hidden bg-black aspect-video w-full border border-white/10">
                  {resolved.kind === 'video' ? (
                    <video
                      key={resolved.src}
                      src={resolved.src}
                      poster={previewVideo.link.thumbnailUrl || undefined}
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <iframe
                      key={resolved.src}
                      src={resolved.src}
                      title={previewVideo.link.judul || previewVideo.slideTitle}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
              );
            })()}

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="truncate">{previewVideo.link.url}</span>
              <a
                href={previewVideo.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-amber-300 font-bold shrink-0 ml-3"
              >
                <span>Buka Tautan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
