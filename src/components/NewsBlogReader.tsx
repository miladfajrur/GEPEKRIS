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
  ExternalLink
} from 'lucide-react';
import { ChurchEventItem } from '../context/ChurchContentContext';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter((e) => e.category === selectedCategory);

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#berita/${activeEvent.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `*${activeEvent.title}*\n${activeEvent.description}\n\nBaca selengkapnya di warta ${churchName}:\n${window.location.origin}${window.location.pathname}#berita/${activeEvent.id}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 pb-20 animate-in fade-in duration-200">
      {/* Top Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-950/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-amber-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-semibold text-xs sm:text-sm">Kembali ke Beranda</span>
            </Button>
            <span className="hidden sm:inline text-gray-300">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-900 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span>Warta & Berita Jemaat</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

            <Button
              size="sm"
              onClick={handleShareWhatsApp}
              className="cursor-pointer text-xs h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              title="Bagikan ke WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Bagikan WA</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Magazine Layout (2 Columns: Articles List Sidebar + Reading Pane) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* LEFT COLUMN: Sidebar Feed / Daftar Berita (Blogspot Sidebar Style) */}
          <aside className="lg:col-span-4 lg:order-1 order-2">
            <div className="bg-white rounded-2xl p-5 border border-amber-900/10 shadow-sm sticky top-24 space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Daftar Warta & Artikel</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Pilih berita untuk langsung dibaca di sebelah kanan
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer capitalize ${
                      selectedCategory === cat
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-primary'
                    }`}
                  >
                    {cat === 'all' ? 'Semua Berita' : cat}
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
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {evt.category}
                        </span>
                        <span className="text-[11px] text-gray-400 font-medium">
                          {evt.date}
                        </span>
                      </div>

                      <h4 className={`text-xs sm:text-sm font-bold leading-snug line-clamp-2 mb-1.5 transition-colors ${
                        isActive ? 'text-primary' : 'text-gray-900 group-hover:text-primary'
                      }`}>
                        {evt.title}
                      </h4>

                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-primary pt-2 border-t border-gray-100/80">
                        <span>{isActive ? 'Sedang Dibaca' : 'Baca Artikel'}</span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: Full Article Reading Sheet (Blogspot Reading Layout) */}
          <main 
            id="blog-reader-content" 
            className="lg:col-span-8 lg:order-2 order-1 bg-white rounded-3xl p-6 sm:p-10 border border-amber-900/10 shadow-sm space-y-6"
          >
            {/* Header / Meta */}
            <div className="space-y-3 pb-6 border-b border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary font-semibold text-xs px-3 py-1">
                  {activeEvent.category}
                </Badge>
                {activeEvent.featured && (
                  <Badge className="bg-amber-600 text-white text-xs px-2.5 py-0.5">
                    Warta Utama
                  </Badge>
                )}
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{activeEvent.date}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight leading-tight">
                {activeEvent.title}
              </h1>

              {/* Author & Church Byline */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 pt-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span>Penulis: <strong>{activeEvent.author || 'Sekretariat Gereja GEPEKRIS Tretes'}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Waktu: {activeEvent.time}</span>
                </div>
              </div>
            </div>

            {/* Featured Article Image (if available or fallback) */}
            {activeEvent.image ? (
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-xs max-h-[420px] bg-gray-50">
                <img
                  src={activeEvent.image}
                  alt={activeEvent.title}
                  className="w-full h-full object-cover max-h-[420px]"
                />
              </div>
            ) : null}

            {/* Event Quick Info Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FBF8F2] border border-amber-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-gray-900">Tanggal Pelaksanaan</span>
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
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="leading-relaxed text-gray-700">
                  {activeEvent.description}
                </p>
              )}
            </article>

            {/* Bottom Sharing & Interaction Section */}
            <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500">
                Warta diterbitkan oleh <strong>{churchName}</strong>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 mr-1">
                  <Share2 className="w-3.5 h-3.5 text-primary" />
                  Bagikan:
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleShareWhatsApp}
                  className="cursor-pointer text-xs h-8 bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  WhatsApp
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="cursor-pointer text-xs h-8"
                >
                  {copied ? 'Tersalin!' : 'Salin Tautan'}
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
