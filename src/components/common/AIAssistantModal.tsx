import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  AlertCircle,
  RefreshCw,
  GripHorizontal,
} from 'lucide-react';
import { askPondokAssistant } from '../../lib/gemini.ts';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
  isError?: boolean;
}

interface AIAssistantModalProps {
  mode: 'landing_public' | 'erp_internal';
  activeModule?: string;
  userRole?: string;
  openSignal?: number;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  mode,
  activeModule,
  userRole,
  openSignal = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text:
        mode === 'landing_public'
          ? "Assalamu'alaikum! Selamat datang di Pondok Pesantren NU Darussalam Karangdadap. Saya asisten virtual resmi. Ada yang ingin Anda tanyakan seputar biaya santri baru, fasilitas asrama, kegiatan harian, atau alur pendaftaran?"
          : `Assalamu'alaikum. Asisten ERP siap membantu operasional Anda pada modul ${activeModule || 'Pondok'}. Ada yang perlu dikonfirmasi?`,
      time: 'Baru saja',
    },
  ]);

  // Draggable floating bubble coordinates (anchored relative to bottom-right offsets)
  const [bubbleOffset, setBubbleOffset] = useState<{ right: number; bottom: number }>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return { right: 14, bottom: mode === 'erp_internal' ? 72 : 16 };
    }
    return { right: 24, bottom: 24 };
  });
  const dragStateRef = useRef<{
    dragging: boolean;
    moved: boolean;
    startX: number;
    startY: number;
    origRight: number;
    origBottom: number;
  }>({
    dragging: false,
    moved: false,
    startX: 0,
    startY: 0,
    origRight: 24,
    origBottom: 24,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openSignal > 0) {
      setIsOpen(true);
    }
  }, [openSignal]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const clampOffsets = () => {
      if (typeof window === 'undefined') return;
      const minBottom = window.innerWidth < 768 && mode === 'erp_internal' ? 68 : 16;
      setBubbleOffset((prev) => ({
        right: Math.max(8, Math.min(window.innerWidth - 150, prev.right)),
        bottom: Math.max(minBottom, Math.min(window.innerHeight - 64, prev.bottom)),
      }));
    };
    window.addEventListener('resize', clampOffsets);
    return () => window.removeEventListener('resize', clampOffsets);
  }, [mode]);

  const handleBubblePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    dragStateRef.current = {
      dragging: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      origRight: bubbleOffset.right,
      origBottom: bubbleOffset.bottom,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleBubblePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const st = dragStateRef.current;
    if (!st.dragging) return;
    const dx = e.clientX - st.startX;
    const dy = e.clientY - st.startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      st.moved = true;
    }
    if (!st.moved) return;
    const maxRight = Math.max(24, window.innerWidth - 155);
    const maxBottom = Math.max(24, window.innerHeight - 64);
    const nextRight = Math.max(8, Math.min(maxRight, st.origRight - dx));
    const nextBottom = Math.max(12, Math.min(maxBottom, st.origBottom - dy));
    setBubbleOffset({ right: nextRight, bottom: nextBottom });
  };

  const handleBubblePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const st = dragStateRef.current;
    if (!st.dragging) return;
    st.dragging = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore if already released
    }
    if (!st.moved) {
      setIsOpen(true);
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt ?? input).trim();
    if (!textToSend || loading) return;

    const historySnapshot = messages
      .filter((m) => !m.isError)
      .slice(-8)
      .map((m) => ({ sender: m.sender, text: m.text }));

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLastFailedPrompt(null);
    setLoading(true);

    try {
      const reply = await askPondokAssistant(
        textToSend,
        mode,
        activeModule,
        userRole,
        historySnapshot
      );
      const aiMsg: Message = {
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMessage =
        err instanceof Error
          ? err.message
          : 'Layanan Asisten AI sedang tidak dapat dijangkau.';
      setLastFailedPrompt(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Maaf, Asisten AI belum dapat memproses pertanyaan saat ini: ${errMessage}`,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickChips =
    mode === 'landing_public'
      ? [
          'Berapa rincian biaya pendaftaran baru?',
          'Berapa jumlah kamar asrama santri?',
          'Apakah santri mencuci baju sendiri?',
          'Bagaimana sistem jajan non-tunai di kantin?',
          'Apa saja jadwal kegiatan harian santri?',
        ]
      : [
          'Di mana manajemen data login & password guru?',
          'Bagaimana alur persetujuan naskah soal imtihan?',
          'Bagaimana cara mengelola absensi & shift satpam?',
          'Bagaimana cara kerja denah ujian bebas contek?',
        ];

  return (
    <>
      {/* Draggable Floating Trigger Button (Clear of mobile footbar) */}
      {!isOpen && (
        <button
          type="button"
          onPointerDown={handleBubblePointerDown}
          onPointerMove={handleBubblePointerMove}
          onPointerUp={handleBubblePointerUp}
          onPointerCancel={handleBubblePointerUp}
          style={{
            right: `${bubbleOffset.right}px`,
            bottom: `${bubbleOffset.bottom}px`,
            touchAction: 'none',
          }}
          className={`no-print ai-assistant-bubble fixed z-40 flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-xs font-semibold text-white shadow-xl cursor-grab active:cursor-grabbing select-none transition-shadow ${
            mode === 'landing_public'
              ? 'bg-emerald-700 hover:bg-emerald-800 ring-4 ring-emerald-500/20'
              : 'bg-emerald-800 hover:bg-emerald-900 ring-2 ring-emerald-600/30'
          }`}
          title="Tanya Asisten AI Darussalam (Geser untuk memindah posisi)"
        >
          <GripHorizontal className="w-3.5 h-3.5 text-emerald-200/80 shrink-0" />
          <div className="relative">
            <Bot className="w-4 h-4 text-emerald-200" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>
          <span className="whitespace-nowrap">
            {mode === 'landing_public' ? 'Tanya Pondok' : 'Asisten AI'}
          </span>
        </button>
      )}

      {/* Slide-out / Floating Chat Window */}
      {isOpen && (
        <div className="no-print ai-assistant-bubble fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-50 flex h-[500px] max-h-[calc(100vh-6rem)] w-96 max-w-[calc(100vw-1.5rem)] flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between bg-emerald-800 px-4 py-3 text-white">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-600/50 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold leading-tight flex items-center gap-1.5 truncate">
                  <span>Asisten Virtual NU Darussalam</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse shrink-0" />
                </h3>
                <p className="text-[10px] text-emerald-200 truncate">
                  {mode === 'landing_public'
                    ? 'Layanan Informasi Publik Calon Santri'
                    : `Modul: ${activeModule || 'ERP'}`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-emerald-200 hover:bg-emerald-700 hover:text-white transition shrink-0"
              aria-label="Tutup Asisten AI"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Notice */}
          {mode === 'landing_public' && (
            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 text-[10px] text-amber-800 border-b border-amber-200/50">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>Hanya melayani informasi publik. Data internal santri memerlukan login.</span>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/70">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-emerald-800 text-white rounded-br-xs'
                      : m.isError
                      ? 'bg-rose-50 text-rose-800 border border-rose-200 rounded-bl-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 shadow-2xs rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="mt-1 text-[9px] text-slate-400 px-1">{m.time}</span>
              </div>
            ))}
            {lastFailedPrompt && !loading && (
              <button
                type="button"
                onClick={() => handleSend(lastFailedPrompt)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Coba Kirim Ulang</span>
              </button>
            )}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-2 w-fit shadow-2xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>Mengetik jawaban...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="border-t border-slate-100 bg-white p-2 overflow-x-auto whitespace-nowrap space-x-1.5 scrollbar-none flex">
            {quickChips.map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(chip)}
                disabled={loading}
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50/70 px-2.5 py-1 text-[10px] font-medium text-emerald-800 hover:bg-emerald-100 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                <span>{chip}</span>
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-1.5 border-t border-slate-200 bg-white p-2.5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pertanyaan Anda di sini..."
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden disabled:bg-slate-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="rounded-xl bg-emerald-800 p-2 text-white hover:bg-emerald-900 disabled:opacity-50 transition"
              aria-label="Kirim pertanyaan"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
