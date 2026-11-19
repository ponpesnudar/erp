import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { askPondokAssistant } from '../../lib/gemini.ts';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

interface AIAssistantModalProps {
  mode: 'landing_public' | 'erp_internal';
  activeModule?: string;
  userRole?: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  mode,
  activeModule,
  userRole,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const reply = await askPondokAssistant(textToSend, mode, activeModule, userRole);
      const aiMsg: Message = {
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Maaf, terjadi kendala saat memproses jawaban. Silakan hubungi admin di sekretariat.',
          time: 'Baru saja',
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
          'Bagaimana alur persetujuan naskah soal imtihan?',
          'Bagaimana aturan nilai dan predikat raport madin?',
          'Berapa total pemasukan dan pengeluaran RAB Imtihan?',
          'Bagaimana cara kerja denah ujian bebas contek?',
        ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`no-print ai-assistant-bubble fixed z-40 flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-white shadow-xl transition-all hover:scale-105 ${
            mode === 'landing_public'
              ? 'bottom-6 right-6 bg-emerald-700 hover:bg-emerald-800 ring-4 ring-emerald-500/20'
              : 'bottom-6 right-6 bg-emerald-800 hover:bg-emerald-900 ring-2 ring-emerald-600/30'
          }`}
          title="Tanya Asisten AI Darussalam"
        >
          <div className="relative">
            <Bot className="w-4 h-4 text-emerald-200" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>
          <span>{mode === 'landing_public' ? 'Tanya Seputar Pondok' : 'Bantuan AI ERP'}</span>
        </button>
      )}

      {/* Slide-out / Floating Chat Window */}
      {isOpen && (
        <div className="no-print ai-assistant-bubble fixed bottom-6 right-6 z-50 flex h-[520px] w-96 max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between bg-emerald-800 px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-600/50 flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-tight flex items-center gap-1.5">
                  Asisten Virtual NU Darussalam
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                </h3>
                <p className="text-[10px] text-emerald-200">
                  {mode === 'landing_public' ? 'Layanan Informasi Publik Calon Santri' : `Modul: ${activeModule || 'ERP'}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-emerald-200 hover:bg-emerald-700 hover:text-white transition"
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
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-800 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 shadow-2xs rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="mt-1 text-[9px] text-slate-400 px-1">{m.time}</span>
              </div>
            ))}
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
              className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-hidden disabled:bg-slate-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="rounded-xl bg-emerald-800 p-2 text-white hover:bg-emerald-900 disabled:opacity-50 transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
