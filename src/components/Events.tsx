import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  BookOpen,
  ArrowRight,
  Pencil,
  MessageCircle,
  Send,
  Copy,
  Check,
  Sparkles,
  User,
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useChurchContent, ChurchEventItem } from '../context/ChurchContentContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EventsProps {
  onReadArticle?: (eventId: string) => void;
}

const DEFAULT_FALLBACK_COVER =
  'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1000&q=80';

export function Events({ onReadArticle }: EventsProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('Semua');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { content, isAdmin, openAdminAtTab } = useChurchContent();

  const categoryColors: Record<string, string> = {
    'Renungan & Firman Tuhan': 'bg-amber-100 text-amber-900 border border-amber-300/70',
    'Pengajaran Alkitab': 'bg-amber-100 text-amber-900 border border-amber-300/70',
    'Warta Jemaat': 'bg-sky-100 text-sky-900 border border-sky-200',
    'Pengumuman': 'bg-sky-100 text-sky-900 border border-sky-200',
    'Ibadah Khusus': 'bg-purple-100 text-purple-900 border border-purple-200',
    'Special Service': 'bg-purple-100 text-purple-900 border border-purple-200',
    'Diakonia': 'bg-emerald-100 text-emerald-900 border border-emerald-200',
    'Outreach': 'bg-emerald-100 text-emerald-900 border border-emerald-200',
    'Persekutuan': 'bg-blue-100 text-blue-900 border border-blue-200',
    'Retret': 'bg-orange-100 text-orange-900 border border-orange-200',
    'Pemuda & Remaja': 'bg-rose-100 text-rose-900 border border-rose-200',
  };

  const filterTabs = [
    { id: 'Semua', label: 'Semua Warta & Firman' },
    { id: 'Renungan & Firman Tuhan', label: 'Renungan & Firman Tuhan' },
    { id: 'Warta Jemaat', label: 'Warta & Pengumuman' },
    { id: 'Ibadah Khusus', label: 'Ibadah & Retret' },
    { id: 'Diakonia', label: 'Diakonia & Pelayanan' },
  ];

  const filteredEvents = content.events.filter((event) => {
    if (activeFilter === 'Semua') return true;
    if (activeFilter === 'Renungan & Firman Tuhan') {
      return (
        event.category === 'Renungan & Firman Tuhan' ||
        event.category === 'Pengajaran Alkitab' ||
        Boolean(event.bibleVerse)
      );
    }
    if (activeFilter === 'Warta Jemaat') {
      return (
        event.category === 'Warta Jemaat' ||
        event.category === 'Pengumuman' ||
        event.category === 'Persekutuan'
      );
    }
    if (activeFilter === 'Ibadah Khusus') {
      return (
        event.category === 'Ibadah Khusus' ||
        event.category === 'Retret' ||
        event.category === 'Special Service'
      );
    }
    if (activeFilter === 'Diakonia') {
      return (
        event.category === 'Diakonia' ||
        event.category === 'Outreach' ||
        event.category === 'Pemuda & Remaja'
      );
    }
    return event.category === activeFilter;
  });

  const getArticleUrl = (eventId: string) => {
    const base =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}`
        : 'https://gepekristretes.org/';
    return `${base}#berita/${eventId}`;
  };

  const buildWhatsAppShareText = (event: ChurchEventItem) => {
    const url = getArticleUrl(event.id);
    const verseSection = event.bibleVerse
      ? `\n📖 *${event.bibleVerse}*${event.bibleQuote ? `\n“${event.bibleQuote}”` : ''}\n`
      : '';
    return `*${event.title}*\n_${event.category} — ${content.info.name}_\n${verseSection}\n${event.description}\n\n🔗 Baca selengkapnya di sini:\n${url}`;
  };

  const handleCopyArticleLink = (event: ChurchEventItem) => {
    const url = getArticleUrl(event.id);
    navigator.clipboard.writeText(url);
    setCopiedId(event.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
  };

  return (
    <section id="events" className="py-20 bg-[#FDFBF7] border-b border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
          <div className="text-left">
            <div className="text-xs uppercase tracking-widest font-semibold text-amber-800/90 mb-2">
              Ruang Warta & Renungan Jemaat
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-medium text-stone-900 tracking-tight leading-tight">
              Warta Jemaat & Tulisan Firman Tuhan
            </h2>
            <p className="text-base text-stone-600 max-w-2xl mt-2.5 leading-relaxed font-light">
              Ikuti warta kegiatan gereja, pengumuman pelayanan, serta tulisan renungan Firman Tuhan yang dapat Anda baca dan bagikan untuk memberkati sesama.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isAdmin && (
              <Button
                onClick={() => openAdminAtTab('events')}
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer flex items-center gap-1.5 text-xs shadow-xs rounded-xl"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Tulis Warta / Renungan Baru</span>
              </Button>
            )}

            {onReadArticle && content.events.length > 0 && (
              <Button
                variant="outline"
                onClick={() => onReadArticle(content.events[0].id)}
                className="cursor-pointer self-start sm:self-auto gap-2 border-stone-300 text-stone-800 hover:bg-stone-50 font-medium rounded-xl text-xs sm:text-sm"
              >
                <span>Buka Ruang Baca Lengkap</span>
                <ArrowRight className="w-4 h-4 text-amber-700" />
              </Button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-stone-200/80">
          {filterTabs.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-amber-200 shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-amber-50 hover:text-stone-900 border border-stone-200/80'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Magazine Editorial Cards Grid */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-stone-200/80 max-w-xl mx-auto my-6">
            <Sparkles className="w-8 h-8 text-amber-600 mx-auto mb-3" />
            <h3 className="font-serif-display text-xl font-bold text-stone-900 mb-1">
              Belum Ada Tulisan pada Kategori Ini
            </h3>
            <p className="text-sm text-stone-600 mb-4">
              Silakan pilih tab kategori lainnya untuk melihat seluruh warta jemaat dan tulisan Firman Tuhan.
            </p>
            <Button variant="outline" size="sm" onClick={() => setActiveFilter('Semua')} className="cursor-pointer">
              Tampilkan Semua Warta & Firman
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredEvents.map((event) => {
              const articleUrl = getArticleUrl(event.id);
              const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                buildWhatsAppShareText(event)
              )}`;
              const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
                articleUrl
              )}&text=${encodeURIComponent(
                `${event.title}${event.bibleVerse ? ` (${event.bibleVerse})` : ''} — ${event.description}`
              )}`;
              const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                articleUrl
              )}&quote=${encodeURIComponent(event.title)}`;

              return (
                <Card
                  key={event.id || event.title}
                  className={`overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-stone-200/90 flex flex-col justify-between rounded-2xl group ${
                    event.featured ? 'ring-2 ring-amber-600/80 shadow-md' : ''
                  }`}
                >
                  {/* Cover Thumbnail */}
                  <div>
                    <div
                      onClick={() => onReadArticle?.(event.id)}
                      className="relative h-56 sm:h-64 w-full overflow-hidden bg-stone-100 cursor-pointer"
                    >
                      <ImageWithFallback
                        src={event.image || DEFAULT_FALLBACK_COVER}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                      {/* Top Badges on Cover */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={`text-xs font-bold px-3 py-1 shadow-xs ${
                            categoryColors[event.category] || 'bg-white/95 text-stone-800'
                          }`}
                        >
                          {event.category}
                        </Badge>
                        {event.featured && (
                          <Badge className="bg-amber-600 text-white text-xs font-semibold px-3 py-1 shadow-xs">
                            Sorotan Utama
                          </Badge>
                        )}
                      </div>

                      {/* Bottom Cover Meta */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white/90 text-xs">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-amber-300" />
                          {event.date}
                        </span>
                        {event.author && (
                          <span className="inline-flex items-center gap-1 text-white/80 truncate max-w-[200px]">
                            <User className="w-3 h-3 text-amber-300 shrink-0" />
                            <span className="truncate">{event.author}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <CardContent className="p-6 pb-4">
                      {/* Editorial Title */}
                      <h3
                        onClick={() => onReadArticle?.(event.id)}
                        className="font-serif-display text-2xl font-bold mb-2.5 text-stone-900 group-hover:text-amber-800 transition-colors cursor-pointer leading-snug"
                      >
                        {event.title}
                      </h3>

                      {/* Bible Verse Callout Box (when present) */}
                      {(event.bibleVerse || event.bibleQuote) && (
                        <div className="mb-4 p-3.5 rounded-xl bg-[#FAF6EE] border-l-4 border-amber-600 text-stone-800">
                          {event.bibleQuote && (
                            <p className="text-xs sm:text-sm italic text-stone-700 leading-relaxed mb-1">
                              “{event.bibleQuote}”
                            </p>
                          )}
                          {event.bibleVerse && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900">
                              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                              <span>{event.bibleVerse}</span>
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-stone-600 mb-4 text-sm leading-relaxed line-clamp-3">
                        {event.description}
                      </p>

                      {/* Schedule & Location Row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-500 pt-2 border-t border-stone-100">
                        {event.time && (
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-amber-700 shrink-0" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1.5 text-amber-700 shrink-0" />
                            <span className="truncate max-w-[240px]">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </div>

                  {/* Card Footer: Read Button + Direct Share Bar */}
                  <div className="px-6 pb-6 pt-2 space-y-3">
                    <Button
                      className="w-full cursor-pointer gap-2 font-semibold shadow-2xs"
                      onClick={() => onReadArticle?.(event.id)}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Baca Selengkapnya</span>
                    </Button>

                    {/* One-Click Share Bar */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
                      <span className="text-[11px] font-semibold text-stone-500">
                        Bagikan Warta / Firman:
                      </span>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={waShareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Bagikan ke WhatsApp beserta ayat & link"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WA</span>
                        </a>

                        <a
                          href={tgShareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Bagikan ke Telegram"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold transition-colors"
                        >
                          <Send className="w-3 h-3 text-sky-600" />
                          <span className="hidden sm:inline">Telegram</span>
                        </a>

                        <a
                          href={fbShareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Bagikan ke Facebook"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold transition-colors"
                        >
                          <span>FB</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleCopyArticleLink(event)}
                          title="Salin Link Tulisan"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          {copiedId === event.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-stone-500" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Call to Action: Berlangganan Warta & Renungan */}
        <div className="mt-14 text-center bg-white rounded-2xl p-8 border border-amber-200/70 shadow-xs max-w-2xl mx-auto">
          <h3 className="font-serif-display text-2xl font-bold mb-2 text-stone-900">
            Berlangganan Warta & Renungan Mingguan
          </h3>
          <p className="text-stone-600 mb-6 text-sm">
            Dapatkan pengumuman kegiatan, warta mingguan, dan tulisan renungan Firman Tuhan terbaru langsung ke alamat email Anda.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Masukkan alamat email Anda"
                className="px-4 py-2 border border-stone-200 rounded-xl text-sm bg-stone-50/60 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-primary flex-1"
              />
              <Button type="submit" size="lg" className="cursor-pointer rounded-xl">
                Berlangganan Warta
              </Button>
            </form>
          ) : (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-sm inline-flex items-center gap-2 font-medium border border-emerald-200">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Terima kasih! Email Anda telah terdaftar untuk menerima warta & renungan jemaat.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
