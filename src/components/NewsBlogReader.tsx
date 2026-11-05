import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Share2,
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  MessageCircle,
  Copy,
  Sparkles,
  Send,
  Pencil,
  X,
} from 'lucide-react';
import { ChurchEventItem, useChurchContent } from '../context/ChurchContentContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface NewsBlogReaderProps {
  events: ChurchEventItem[];
  selectedId?: string | null;
  onClose: () => void;
  onSelectEvent: (id: string) => void;
  churchName?: string;
}

export const NewsBlogReader: React.FC<NewsBlogReaderProps> = ({
  events,
  selectedId,
  onClose,
  onSelectEvent,
  churchName = 'GEPEKRIS Tretes',
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedFullText, setCopiedFullText] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { isAdmin, openAdminAtTab } = useChurchContent();

  // Find active article or default to first
  const activeEvent = events.find((e) => e.id === selectedId) || events[0];

  // Scroll to top of article when article changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const contentEl = document.getElementById('blog-reader-content');
    if (contentEl) {
      contentEl.scrollTop = 0;
    }
  }, [activeEvent?.id]);

  if (!activeEvent) {
    return null;
  }

  // Categories list
  const categories = ['all', ...Array.from(new Set(events.map((e) => e.category)))];

  const filteredEvents =
    selectedCategory === 'all'
      ? events
      : events.filter((e) => e.category === selectedCategory);

  const articleUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}#berita/${activeEvent.id}`
      : `https://gepekristretes.org/#berita/${activeEvent.id}`;

  const buildShareMessage = () => {
    const verseBlock = activeEvent.bibleVerse
      ? `\n📖 *${activeEvent.bibleVerse}*${activeEvent.bibleQuote ? `\n“${activeEvent.bibleQuote}”` : ''}\n`
      : '';
    return `*${activeEvent.title}*\n_${activeEvent.category} — ${churchName}_\n${verseBlock}\n${activeEvent.description}\n\n🔗 Baca selengkapnya di warta & renungan ${churchName}:\n${articleUrl}`;
  };

  const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    buildShareMessage()
  )}`;
  const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    articleUrl
  )}&text=${encodeURIComponent(
    `${activeEvent.title}${activeEvent.bibleVerse ? ` (${activeEvent.bibleVerse})` : ''}\n${activeEvent.description}`
  )}`;
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    articleUrl
  )}&quote=${encodeURIComponent(activeEvent.title)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyFormattedText = () => {
    navigator.clipboard.writeText(buildShareMessage());
    setCopiedFullText(true);
    setTimeout(() => setCopiedFullText(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FDFBF7] text-gray-900 pb-20 animate-in fade-in duration-200">
      {/* Top Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-950/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="cursor-pointer gap-2 border-primary/20 text-primary hover:bg-primary/5 font-semibold text-xs sm:text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Button>
            <span className="hidden sm:inline text-gray-300">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-900 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span>Ruang Baca Warta & Firman Tuhan</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {isAdmin && (
              <Button
                size="sm"
                onClick={() => {
                  onClose();
                  openAdminAtTab('events');
                }}
                className="cursor-pointer text-xs h-8 px-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                title="Edit Warta / Renungan di Panel Admin"
              >
                <Pencil className="w-3.5 h-3.5 sm:mr-1" />
                <span className="hidden md:inline">Edit Tulisan</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="cursor-pointer text-xs h-8 px-2.5 bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              title="Salin tautan artikel"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                  <span className="text-emerald-700 font-semibold">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1 text-gray-500" />
                  <span className="hidden sm:inline">Salin Link</span>
                </>
              )}
            </Button>

            <a
              href={waShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-xs h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
              title="Bagikan ke WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Bagikan WA</span>
            </a>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="cursor-pointer text-xs h-8 px-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg ml-0.5"
              title="Tutup Pembaca Warta"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Tutup</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Magazine Layout (2 Columns: Articles List Sidebar + Reading Pane) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* LEFT COLUMN: Sidebar Feed / Daftar Warta & Firman */}
          <aside className="lg:col-span-4 lg:order-1 order-2">
            <div className="bg-white rounded-2xl p-5 border border-amber-900/10 shadow-sm sticky top-24 space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-serif-display font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Daftar Warta & Renungan</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Pilih warta atau tulisan Firman Tuhan untuk dibaca
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer capitalize ${
                      selectedCategory === cat
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-primary'
                    }`}
                  >
                    {cat === 'all' ? 'Semua Tulisan' : cat}
                  </button>
                ))}
              </div>

              {/* News Articles List */}
              <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {filteredEvents.map((evt) => {
                  const isActive = evt.id === activeEvent.id;
                  return (
                    <div
                      key={evt.id}
                      onClick={() => onSelectEvent(evt.id)}
                      className={`group p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                        isActive
                          ? 'bg-amber-50/70 border-primary/40 shadow-xs ring-1 ring-primary/20'
                          : 'bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {evt.category}
                        </span>
                        <span className="text-[11px] text-gray-400 font-medium">
                          {evt.date}
                        </span>
                      </div>

                      <h4
                        className={`font-serif-display text-sm sm:text-base font-bold leading-snug line-clamp-2 mb-1 transition-colors ${
                          isActive ? 'text-primary' : 'text-gray-900 group-hover:text-primary'
                        }`}
                      >
                        {evt.title}
                      </h4>

                      {evt.bibleVerse && (
                        <p className="text-[11px] font-semibold text-amber-800 mb-1">
                          📖 {evt.bibleVerse}
                        </p>
                      )}

                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-primary pt-2 border-t border-gray-100/80">
                        <span>{isActive ? 'Sedang Dibaca' : 'Baca Selengkapnya'}</span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: Full Article Reading Sheet */}
          <main
            id="blog-reader-content"
            className="lg:col-span-8 lg:order-2 order-1 bg-white rounded-3xl p-6 sm:p-10 border border-amber-900/10 shadow-sm space-y-6"
          >
            {/* Header / Meta */}
            <div className="space-y-3 pb-6 border-b border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary font-semibold text-xs px-3 py-1"
                >
                  {activeEvent.category}
                </Badge>
                {activeEvent.featured && (
                  <Badge className="bg-amber-600 text-white text-xs px-2.5 py-0.5">
                    Sorotan Utama
                  </Badge>
                )}
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{activeEvent.date}</span>
              </div>

              <h1 className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-stone-950 tracking-tight leading-tight">
                {activeEvent.title}
              </h1>

              {/* Author & Church Byline */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span>
                    Ditulis oleh:{' '}
                    <strong>{activeEvent.author || 'Majelis & Pelayan Firman GEPEKRIS Tretes'}</strong>
                  </span>
                </div>
                {activeEvent.time && (
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>Waktu: {activeEvent.time}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Featured Article Image */}
            {activeEvent.image ? (
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-xs max-h-[420px] bg-gray-50">
                <img
                  src={activeEvent.image}
                  alt={activeEvent.title}
                  className="w-full h-full object-cover max-h-[420px]"
                />
              </div>
            ) : null}

            {/* Prominent Scripture Verse Box (When bibleVerse or bibleQuote is provided) */}
            {(activeEvent.bibleVerse || activeEvent.bibleQuote) && (
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#FAF5E8] to-[#FDFBF7] border-l-4 border-amber-600 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  <span>Ayat Firman Acuan: {activeEvent.bibleVerse || 'Firman Tuhan'}</span>
                </div>
                {activeEvent.bibleQuote && (
                  <blockquote className="font-serif-display text-lg sm:text-xl font-bold text-stone-900 italic leading-relaxed">
                    “{activeEvent.bibleQuote}”
                  </blockquote>
                )}
              </div>
            )}

            {/* Event Quick Info Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FBF8F2] border border-amber-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-gray-900">Hari & Tanggal</span>
                  <span className="text-gray-600">{activeEvent.date}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-gray-900">Waktu / Pukul</span>
                  <span className="text-gray-600">{activeEvent.time}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-gray-900">Tempat / Lokasi</span>
                  <span className="text-gray-600">{activeEvent.location}</span>
                </div>
              </div>
            </div>

            {/* Editorial Body Text */}
            <article className="prose prose-stone max-w-none text-gray-800 leading-relaxed text-sm sm:text-base space-y-4 pt-2">
              {activeEvent.content ? (
                activeEvent.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed whitespace-pre-line">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="leading-relaxed text-gray-700">{activeEvent.description}</p>
              )}
            </article>

            {/* Bottom Multi-Channel Sharing Card */}
            <div className="pt-8 border-t border-gray-200">
              <div className="bg-[#FAF6EE] rounded-2xl p-5 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif-display text-base font-bold text-stone-900 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-amber-700" />
                    <span>Bagikan Warta & Renungan Ini</span>
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Teruskan berkat Firman Tuhan atau pengumuman jemaat ini ke grup keluarga dan rekan sepelayanan.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={waShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={tgShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Telegram</span>
                  </a>

                  <a
                    href={fbShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <span>Facebook</span>
                  </a>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyFormattedText}
                    className="cursor-pointer text-xs h-8 rounded-xl bg-white"
                  >
                    {copiedFullText ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                        <span className="text-emerald-700">Teks & Link Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1 text-stone-600" />
                        <span>Salin Teks & Link</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
