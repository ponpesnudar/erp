import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Presentation,
  Video,
  Download,
  FileText,
  Users,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Link2,
  Trash2,
  Film,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useAppStore, type TutorialVideoLink } from '../../lib/store.ts';
import { useAuth } from '../../lib/auth.ts';
import { loadPptBinary, triggerDataUrlDownload } from '../../lib/pptStorage.ts';
import {
  MODULE_TUTORIAL_SLIDES,
  type AudienceFilterType,
  type ModuleTutorialSlide,
} from './tutorialData.ts';
import {
  generateSlideVisualDataUrl,
  exportSlidesToPptx,
  exportSlidesToPdfHandout,
} from './slideVisualGenerator.ts';

interface PanduanPresentationStudioProps {
  initialMode: 'video' | 'ppt';
}

function resolveVideoPlayerSource(rawUrl: string): { kind: 'video' | 'iframe'; src: string } {
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

export const PanduanPresentationStudio: React.FC<PanduanPresentationStudioProps> = ({
  initialMode,
}) => {
  const {
    currentUser,
    tutorialVideoLinks,
    tutorialPptTemplates,
    setTutorialVideoLink,
    deleteTutorialVideoLink,
  } = useAppStore();
  const { effectiveRole } = useAuth();
  const canManageVideoLinks = ['admin_sistem', 'pengasuh', 'sekretaris', 'kepala_madin'].includes(effectiveRole);

  const [audienceFilter, setAudienceFilter] = useState<AudienceFilterType>('Semua');
  const filteredSlides = useMemo(() => {
    if (audienceFilter === 'Semua') return MODULE_TUTORIAL_SLIDES;
    return MODULE_TUTORIAL_SLIDES.filter(
      (s) => s.audiens === audienceFilter || s.targetTags.includes(audienceFilter)
    );
  }, [audienceFilter]);

  const [selectedSlideIdx, setSelectedSlideIdx] = useState(0);
  useEffect(() => {
    if (selectedSlideIdx >= filteredSlides.length) {
      setSelectedSlideIdx(0);
    }
  }, [filteredSlides.length, selectedSlideIdx]);

  const activeSlide: ModuleTutorialSlide =
    filteredSlides[selectedSlideIdx] || MODULE_TUTORIAL_SLIDES[0];

  const embeddedVideo = tutorialVideoLinks[activeSlide.id];
  const customPptTemplate = tutorialPptTemplates[activeSlide.id];
  const [preferEmbeddedVideo, setPreferEmbeddedVideo] = useState(true);
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const [linkUrlInput, setLinkUrlInput] = useState('');
  const [linkJudulInput, setLinkJudulInput] = useState('');
  const [linkTypeInput, setLinkTypeInput] = useState<TutorialVideoLink['sumberType']>('AI Video Link');

  useEffect(() => {
    const existing = tutorialVideoLinks[activeSlide.id];
    setLinkUrlInput(existing?.url || '');
    setLinkJudulInput(existing?.judul || `Tutorial AI — ${activeSlide.title}`);
    setLinkTypeInput(existing?.sumberType || 'AI Video Link');
    setPreferEmbeddedVideo(Boolean(existing?.url));
  }, [activeSlide.id, activeSlide.title, tutorialVideoLinks]);

  // Generate visual diagram PNG URL when active slide changes
  const visualImageUrl = useMemo(
    () => generateSlideVisualDataUrl(activeSlide.diagramType, activeSlide.title),
    [activeSlide.diagramType, activeSlide.title]
  );

  // --- VIDEO TUTORIAL PLAYER STATES ---
  const [sceneIdx, setSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<0.75 | 1 | 1.5>(1);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [sceneElapsedMs, setSceneElapsedMs] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const activeScene = activeSlide.scenes[sceneIdx] || activeSlide.scenes[0];

  // Reset scene when slide changes
  useEffect(() => {
    setSceneIdx(0);
    setSceneElapsedMs(0);
  }, [activeSlide.id]);

  // Speech synthesis helper (clean cancel on stop/unmount)
  useEffect(() => {
    if (!voiceEnabled || !isPlaying || initialMode !== 'video') {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(activeScene.narration);
      utter.lang = 'id-ID';
      utter.rate = speed;
      window.speechSynthesis.speak(utter);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [voiceEnabled, isPlaying, activeScene.narration, speed, initialMode]);

  // Auto-advance timer for video tutorial player
  useEffect(() => {
    if (!isPlaying || initialMode !== 'video') return;
    const totalMs = (activeScene.durationSec * 1000) / speed;
    const tick = 100;
    const timer = setInterval(() => {
      setSceneElapsedMs((prev) => {
        if (prev + tick >= totalMs) {
          if (sceneIdx + 1 < activeSlide.scenes.length) {
            setSceneIdx((s) => s + 1);
            return 0;
          } else if (selectedSlideIdx + 1 < filteredSlides.length) {
            setSelectedSlideIdx((i) => i + 1);
            setSceneIdx(0);
            return 0;
          } else {
            setIsPlaying(false);
            return totalMs;
          }
        }
        return prev + tick;
      });
    }, tick);
    return () => clearInterval(timer);
  }, [isPlaying, initialMode, activeScene.durationSec, speed, sceneIdx, activeSlide.scenes.length, selectedSlideIdx, filteredSlides.length]);

  // Keyboard arrows in PPT mode
  useEffect(() => {
    if (initialMode !== 'ppt') return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setSelectedSlideIdx((i) => Math.min(filteredSlides.length - 1, i + 1));
      } else if (e.key === 'ArrowLeft') {
        setSelectedSlideIdx((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [initialMode, filteredSlides.length]);

  const toggleFullscreen = () => {
    const el = stageRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => setIsFullscreen((f) => !f));
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => setIsFullscreen(false));
    }
  };

  // --- EXPORT STATES ---
  const [exportingPpt, setExportingPpt] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [toast, setToast] = useState('');
  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const handleDownloadPptx = async () => {
    try {
      setExportingPpt(true);
      const fileName = await exportSlidesToPptx(MODULE_TUTORIAL_SLIDES);
      notify(`File PowerPoint "${fileName}" (15 Slide Gambar + Teks) berhasil diunduh!`);
    } catch {
      notify('Gagal membuat file .pptx. Pastikan browser mendukung unduhan file.');
    } finally {
      setExportingPpt(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setExportingPdf(true);
      const fileName = await exportSlidesToPdfHandout(MODULE_TUTORIAL_SLIDES);
      notify(`Handout Presentasi "${fileName}" berhasil diunduh.`);
    } finally {
      setExportingPdf(false);
    }
  };

  const handleDownloadCustomPpt = async () => {
    if (!customPptTemplate) return;
    const bin = await loadPptBinary(activeSlide.id);
    if (!bin || !bin.dataUrl) {
      notify('Berkas template .pptx custom belum tersedia di penyimpanan lokal peramban ini.');
      return;
    }
    triggerDataUrlDownload(bin.dataUrl, bin.fileName || customPptTemplate.fileName);
    notify(`Template custom "${customPptTemplate.fileName}" berhasil diunduh!`);
  };

  const sceneProgressPct = Math.min(
    100,
    Math.round((sceneElapsedMs / ((activeScene.durationSec * 1000) / speed)) * 100)
  );
  const highlightedStepIdx = Math.min(
    activeScene.actionSteps.length - 1,
    Math.floor((sceneProgressPct / 100) * activeScene.actionSteps.length)
  );

  return (
    <div className="space-y-5">
      {/* Audience Filter & Action Bar */}
      <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mr-1">
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            <span>Filter Audiens Presentasi:</span>
          </span>
          {(['Semua', 'Pengasuh', 'Guru', 'Satpam'] as AudienceFilterType[]).map((aud) => (
            <button
              key={aud}
              type="button"
              onClick={() => {
                setAudienceFilter(aud);
                setSelectedSlideIdx(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                audienceFilter === aud
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50'
              }`}
            >
              {aud === 'Semua'
                ? `Semua Modul (${MODULE_TUTORIAL_SLIDES.length})`
                : aud === 'Satpam'
                ? 'Khusus Satpam (Riyadi, Suwarno, Sopoyono)'
                : `Khusus ${aud}`}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={exportingPpt}
            onClick={handleDownloadPptx}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-xs transition disabled:opacity-60"
          >
            {exportingPpt ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>Unduh Template Presentasi Pengasuh (.pptx)</span>
          </button>
          {customPptTemplate && (
            <button
              type="button"
              onClick={handleDownloadCustomPpt}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 text-xs font-extrabold shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Template Modul (.pptx)</span>
            </button>
          )}
          <button
            type="button"
            disabled={exportingPdf}
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition disabled:opacity-60"
          >
            {exportingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            <span>Unduh Handout PDF</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Playlist / Slide Outline Sidebar (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200 p-4 shadow-2xs space-y-2 max-h-[680px] overflow-y-auto">
          <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider px-2 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>{initialMode === 'video' ? 'Daftar Video Tutorial Modul' : 'Daftar Slide PPT (Gambar + Teks)'}</span>
            <span className="text-emerald-700">{filteredSlides.length} Materi</span>
          </h3>
          {filteredSlides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSelectedSlideIdx(idx);
                setSceneIdx(0);
                setSceneElapsedMs(0);
              }}
              className={`w-full text-left p-3 rounded-2xl border transition flex items-start gap-3 ${
                idx === selectedSlideIdx
                  ? 'bg-emerald-900 text-white border-emerald-900 shadow-md'
                  : 'bg-slate-50/70 text-slate-800 border-slate-200 hover:bg-emerald-50'
              }`}
            >
              <span
                className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                  idx === selectedSlideIdx ? 'bg-amber-400 text-slate-950' : 'bg-white border border-slate-200 text-emerald-800'
                }`}
              >
                {s.slideNumber}
              </span>
              <div className="min-w-0">
                <p className="font-bold text-xs leading-snug line-clamp-2">{s.title}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {s.targetTags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        idx === selectedSlideIdx
                          ? 'bg-white/15 text-amber-200'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                  {tutorialVideoLinks[s.id]?.url && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-400 text-slate-950 inline-flex items-center gap-0.5">
                      <Film className="w-2.5 h-2.5" /> Video AI
                    </span>
                  )}
                  {tutorialPptTemplates[s.id] && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-sky-400 text-slate-950 inline-flex items-center gap-0.5">
                      <Presentation className="w-2.5 h-2.5" /> PPTX
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Interactive Stage (8 cols) */}
        <div
          ref={stageRef}
          className={`lg:col-span-8 rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 text-white flex flex-col ${
            isFullscreen ? 'p-6 justify-between' : ''
          }`}
        >
          {/* Stage Top Header */}
          <div className="px-5 py-4 bg-linear-to-r from-emerald-950 to-slate-900 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                  {initialMode === 'video' ? 'Video Panduan Interaktif' : `Slide PPT ${activeSlide.slideNumber} / ${filteredSlides.length}`}
                </span>
                <span className="text-[11px] font-semibold text-emerald-300">
                  Audiens: {activeSlide.targetTags.join(', ')}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">{activeSlide.title}</h3>
              <p className="text-xs text-emerald-200/80">{activeSlide.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              {initialMode === 'video' && canManageVideoLinks && (
                <button
                  type="button"
                  onClick={() => setShowLinkEditor((v) => !v)}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-black flex items-center gap-1.5 transition shadow-xs"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>{embeddedVideo?.url ? 'Edit Link Video AI' : 'Sematkan Link Video AI'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                title="Layar Penuh untuk Proyektor Presentasi"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* MODE A: VIDEO TUTORIAL ANIMATED PLAYER */}
          {initialMode === 'video' ? (
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between bg-slate-950">
              {/* Inline Admin AI Video Link Embedder */}
              {showLinkEditor && canManageVideoLinks && (
                <div className="rounded-2xl bg-slate-900 border border-amber-400/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                      <Film className="w-4 h-4" />
                      <span>Sematkan Link Video Tutorial AI — {activeSlide.title}</span>
                    </p>
                    <span className="text-[10px] text-slate-400">
                      Mendukung MP4, YouTube, Google Drive, atau link hasil generate AI
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">Sumber Video</label>
                      <select
                        value={linkTypeInput}
                        onChange={(e) => setLinkTypeInput(e.target.value as TutorialVideoLink['sumberType'])}
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white"
                      >
                        <option value="AI Video Link">AI Video Link</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Google Drive">Google Drive</option>
                        <option value="MP4">File MP4 Langsung</option>
                      </select>
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">Judul Tampilan</label>
                      <input
                        type="text"
                        value={linkJudulInput}
                        onChange={(e) => setLinkJudulInput(e.target.value)}
                        placeholder="Judul video tutorial..."
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">URL Video Tutorial</label>
                      <input
                        type="url"
                        value={linkUrlInput}
                        onChange={(e) => setLinkUrlInput(e.target.value)}
                        placeholder="https://... (.mp4 / youtube / drive)"
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {embeddedVideo?.url && (
                      <button
                        type="button"
                        onClick={() => {
                          deleteTutorialVideoLink(activeSlide.id);
                          setShowLinkEditor(false);
                          notify(`Link video AI untuk "${activeSlide.title}" dihapus.`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-900/60 hover:bg-red-800 text-red-200 text-xs font-bold inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Link</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowLinkEditor(false)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold"
                    >
                      Tutup
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!linkUrlInput.trim()) return;
                        setTutorialVideoLink(activeSlide.id, {
                          url: linkUrlInput.trim(),
                          judul: linkJudulInput.trim() || activeSlide.title,
                          thumbnailUrl: embeddedVideo?.thumbnailUrl,
                          sumberType: linkTypeInput,
                          updatedBy: currentUser.nama,
                        });
                        setPreferEmbeddedVideo(true);
                        setShowLinkEditor(false);
                        notify(`Link Video Tutorial AI untuk "${activeSlide.title}" berhasil disematkan.`);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Simpan &amp; Sematkan</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Switcher if Embedded AI Video exists */}
              {embeddedVideo?.url && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-emerald-950/70 border border-emerald-700/60 px-3.5 py-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px]">
                      {embeddedVideo.sumberType}
                    </span>
                    <span className="font-bold text-emerald-100 truncate max-w-[260px] sm:max-w-md">
                      {embeddedVideo.judul || activeSlide.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPreferEmbeddedVideo(true)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                        preferEmbeddedVideo ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      Putar Video AI Tersemat
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreferEmbeddedVideo(false)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                        !preferEmbeddedVideo ? 'bg-emerald-700 text-white' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      Simulator Interaktif
                    </button>
                  </div>
                </div>
              )}

              {embeddedVideo?.url && preferEmbeddedVideo ? (
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  {(() => {
                    const resolved = resolveVideoPlayerSource(embeddedVideo.url);
                    return (
                      <div className="rounded-2xl overflow-hidden border border-emerald-500/40 bg-black aspect-video w-full">
                        {resolved.kind === 'video' ? (
                          <video
                            key={resolved.src}
                            src={resolved.src}
                            controls
                            className="w-full h-full object-contain bg-black"
                          />
                        ) : (
                          <iframe
                            key={resolved.src}
                            src={resolved.src}
                            title={embeddedVideo.judul || activeSlide.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}
                      </div>
                    );
                  })()}
                  <div className="rounded-2xl bg-slate-900 border border-white/10 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-300">
                      Disematkan oleh <strong className="text-white">{embeddedVideo.updatedBy}</strong> ({embeddedVideo.updatedAt})
                    </span>
                    <a
                      href={embeddedVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold"
                    >
                      <span>Buka Sumber Asli</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
              <>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
                {/* Animated Visual Preview Canvas */}
                <div className="xl:col-span-7 relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-900">
                  <img
                    src={visualImageUrl}
                    alt={activeSlide.title}
                    className={`w-full h-full object-contain transition-transform duration-700 ${
                      isPlaying ? 'scale-[1.02]' : 'scale-100'
                    }`}
                  />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-amber-400/50 text-amber-300 text-[10px] font-black shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    <span>{activeScene.highlightBadge}</span>
                  </div>
                  <div className="absolute bottom-3 inset-x-3 rounded-xl bg-black/80 backdrop-blur-xs p-2.5 border border-white/15">
                    <p className="text-[10px] font-bold text-amber-300 uppercase">Fokus Layar:</p>
                    <p className="text-xs font-bold text-white">{activeScene.mockupFocus}</p>
                  </div>
                </div>

                {/* Animated Scene Steps */}
                <div className="xl:col-span-5 rounded-2xl bg-slate-900 border border-white/10 p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-emerald-300">
                        {activeScene.sceneTitle}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Adegan {sceneIdx + 1}/{activeSlide.scenes.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {activeScene.actionSteps.map((step, sIdx) => {
                        const isActiveStep = sIdx === highlightedStepIdx && isPlaying;
                        return (
                          <div
                            key={sIdx}
                            className={`p-2.5 rounded-xl border text-xs transition-all ${
                              isActiveStep
                                ? 'bg-emerald-800/80 border-amber-400 text-white shadow-md scale-[1.01]'
                                : 'bg-white/5 border-white/10 text-slate-200'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${
                                  isActiveStep ? 'bg-amber-400 text-slate-950' : 'bg-white/15 text-emerald-300'
                                }`}
                              >
                                {sIdx + 1}
                              </span>
                              <span className="leading-relaxed">{step}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Subtitle / Narration Box */}
                  <div className="rounded-xl bg-emerald-950/80 border border-emerald-700/60 p-3 text-xs">
                    <p className="text-[10px] font-bold text-amber-300 uppercase mb-1">
                      Narasi Pemandu:
                    </p>
                    <p className="text-emerald-100 leading-relaxed">{activeScene.narration}</p>
                  </div>
                </div>
              </div>

              {/* Scene Chips */}
              <div className="flex flex-wrap gap-1.5">
                {activeSlide.scenes.map((sc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSceneIdx(i);
                      setSceneElapsedMs(0);
                    }}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                      i === sceneIdx
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {sc.sceneTitle}
                  </button>
                ))}
              </div>

              {/* Video Control Bar */}
              <div className="rounded-2xl bg-slate-900 border border-white/10 p-3 space-y-2.5">
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-amber-400 to-emerald-400 transition-all duration-100"
                    style={{ width: `${sceneProgressPct}%` }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (sceneIdx > 0) setSceneIdx((s) => s - 1);
                        else if (selectedSlideIdx > 0) setSelectedSlideIdx((i) => i - 1);
                        setSceneElapsedMs(0);
                      }}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPlaying((p) => !p)}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isPlaying ? 'Jeda Video' : 'Putar Tutorial'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (sceneIdx + 1 < activeSlide.scenes.length) setSceneIdx((s) => s + 1);
                        else if (selectedSlideIdx + 1 < filteredSlides.length) setSelectedSlideIdx((i) => i + 1);
                        setSceneElapsedMs(0);
                      }}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setVoiceEnabled((v) => !v)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                        voiceEnabled
                          ? 'bg-emerald-700 border-emerald-500 text-white'
                          : 'bg-white/10 border-white/10 text-slate-300'
                      }`}
                    >
                      {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                      <span>{voiceEnabled ? 'Suara Aktif' : 'Suara Muted'}</span>
                    </button>

                    <div className="inline-flex rounded-xl bg-white/10 p-0.5 text-[11px] font-bold">
                      {([0.75, 1, 1.5] as const).map((sp) => (
                        <button
                          key={sp}
                          type="button"
                          onClick={() => setSpeed(sp)}
                          className={`px-2 py-1 rounded-lg ${
                            speed === sp ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
                          }`}
                        >
                          {sp}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              </>
              )}
            </div>
          ) : (
            /* MODE B: SLIDE PPT (KOMBINASI GAMBAR DIAGRAM + TEKS PRESENTASI) */
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between bg-slate-100 text-slate-900">
              {/* 16:9 Slide Canvas Card */}
              <div className="rounded-2xl bg-white border border-slate-300 shadow-lg overflow-hidden">
                <div className="bg-emerald-900 text-white px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">
                      SLIDE {String(activeSlide.slideNumber).padStart(2, '0')} · PP NU DARUSSALAM KARANGDADAP
                    </p>
                    <h4 className="text-sm sm:text-base font-black">{activeSlide.title}</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-white/15 text-[11px] font-bold text-emerald-100">
                    {activeSlide.targetTags.join(' / ')}
                  </span>
                </div>

                {/* Combined Image + Text Body */}
                <div className="p-4 sm:p-5 grid grid-cols-1 xl:grid-cols-12 gap-4 items-center">
                  <div className="xl:col-span-7 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-2xs">
                    <img
                      src={visualImageUrl}
                      alt={`Diagram ${activeSlide.title}`}
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  <div className="xl:col-span-5 space-y-2.5">
                    <p className="text-[11px] font-black text-emerald-800 uppercase tracking-wider">
                      Poin Presentasi:
                    </p>
                    <ul className="space-y-2">
                      {activeSlide.bullets.map((b, i) => (
                        <li
                          key={i}
                          className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-slate-800 flex items-start gap-2 leading-relaxed"
                        >
                          <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Speaker Notes strip inside PPT preview */}
                <div className="px-5 py-3 bg-amber-50 border-t border-amber-200 text-xs">
                  <span className="font-extrabold text-amber-900">Naskah Penyampaian (Speaker Notes): </span>
                  <span className="text-slate-800">{activeSlide.speakerNotes}</span>
                </div>
              </div>

              {/* Slide Navigation Footer */}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={selectedSlideIdx === 0}
                  onClick={() => setSelectedSlideIdx((i) => Math.max(0, i - 1))}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 disabled:opacity-40 flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Slide Sebelumnya
                </button>
                <span className="text-xs font-extrabold text-slate-700">
                  Slide {selectedSlideIdx + 1} dari {filteredSlides.length} (Gunakan Panah Kiri/Kanan)
                </span>
                <button
                  type="button"
                  disabled={selectedSlideIdx >= filteredSlides.length - 1}
                  onClick={() => setSelectedSlideIdx((i) => Math.min(filteredSlides.length - 1, i + 1))}
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold disabled:opacity-40 flex items-center gap-1.5"
                >
                  Slide Berikutnya <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
