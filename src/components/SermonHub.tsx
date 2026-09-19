import React, { useState, useMemo } from 'react';
import { Language, Sermon } from '../types';
import { SERMONS } from '../data/churchData';
import { Play, Search, BookOpen, Clock, Calendar, User, Sparkles, Filter, Check, Share2, Download, Volume2, X } from 'lucide-react';

interface SermonHubProps {
  language: Language;
  selectedSermon: Sermon | null;
  onSelectSermon: (sermon: Sermon | null) => void;
}

export const SermonHub: React.FC<SermonHubProps> = ({
  language,
  selectedSermon,
  onSelectSermon,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const categories = ['All', 'Faith', 'Hope', 'Family', 'Grace', 'Purpose'];

  const filteredSermons = useMemo(() => {
    return SERMONS.filter((sermon) => {
      const matchesCategory =
        selectedCategory === 'All' || sermon.category.toLowerCase() === selectedCategory.toLowerCase();
      
      const title = language === 'en' ? sermon.title : sermon.titleId;
      const summary = language === 'en' ? sermon.summary : sermon.summaryId;
      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sermon.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sermon.scripture.toLowerCase().includes(searchQuery.toLowerCase()) ||
        summary.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, language]);

  const featuredSermon = SERMONS[0];

  const handleShare = (sermon: Sermon) => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <section id="sermons" className="py-16 md:py-24 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full">
              {language === 'en' ? 'Biblical Truth for Modern Life' : 'Firman Tuhan yang Relevan'}
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif-display font-bold text-stone-900">
              {language === 'en' ? 'Sermons & Media Archive' : 'Koleksi Khotbah & Renungan'}
            </h2>
            <p className="mt-2 text-stone-600 max-w-xl text-base">
              {language === 'en'
                ? 'Watch, listen, and study life-transforming messages from our pastoral team anytime, anywhere.'
                : 'Dengarkan dan pelajari firman penguat iman dari para hamba Tuhan di mana pun Anda berada.'}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'en' ? 'Search speaker, passage...' : 'Cari judul, pembicara, ayat...'}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Featured Sermon Showcase Banner */}
        {searchQuery === '' && selectedCategory === 'All' && (
          <div className="mb-14 rounded-2xl overflow-hidden bg-stone-900 text-stone-100 border border-stone-800 shadow-xl grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 relative group cursor-pointer overflow-hidden" onClick={() => onSelectSermon(featuredSermon)}>
              <img
                src={featuredSermon.thumbnail}
                alt={featuredSermon.title}
                className="w-full h-72 sm:h-96 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-amber-500/90 hover:bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 fill-stone-950 ml-1 text-stone-950" />
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-amber-600 text-stone-950 text-xs font-bold uppercase tracking-wider">
                  {language === 'en' ? 'Latest Sermon' : 'Khotbah Terbaru'}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-stone-400 mb-3">
                  <span className="text-amber-400 font-semibold">{featuredSermon.series}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {featuredSermon.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredSermon.duration}
                  </span>
                </div>

                <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">
                  {language === 'en' ? featuredSermon.title : featuredSermon.titleId}
                </h3>

                <div className="flex items-center gap-2 text-sm text-stone-300 mb-4">
                  <User className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-white">{featuredSermon.speaker}</span>
                  <span className="text-stone-400 text-xs">({featuredSermon.role})</span>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-stone-800/80 border border-stone-700 text-xs font-medium text-amber-300 mb-4">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{featuredSermon.scripture}</span>
                </div>

                <p className="text-sm text-stone-300 leading-relaxed line-clamp-3">
                  {language === 'en' ? featuredSermon.summary : featuredSermon.summaryId}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-800 flex items-center justify-between">
                <button
                  onClick={() => onSelectSermon(featuredSermon)}
                  id="featured-sermon-watch-btn"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-stone-950" />
                  <span>{language === 'en' ? 'Watch Full Message' : 'Tonton Khotbah Lengkap'}</span>
                </button>
                <button
                  onClick={() => handleShare(featuredSermon)}
                  className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Share"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <Filter className="w-4 h-4 text-stone-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {cat === 'All' ? (language === 'en' ? 'All Messages' : 'Semua Khotbah') : cat}
            </button>
          ))}
        </div>

        {/* Sermons Grid */}
        {filteredSermons.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-8">
            <p className="text-stone-500 text-sm">
              {language === 'en' ? 'No sermons found matching your search.' : 'Tidak ada khotbah yang sesuai dengan pencarian.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSermons.map((sermon) => (
              <div
                key={sermon.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div
                    className="relative aspect-16/10 cursor-pointer overflow-hidden"
                    onClick={() => onSelectSermon(sermon)}
                  >
                    <img
                      src={sermon.thumbnail}
                      alt={sermon.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-white text-stone-900 flex items-center justify-center shadow-md">
                        <Play className="w-5 h-5 fill-stone-900 ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 text-white text-[11px] font-medium backdrop-blur-xs">
                      {sermon.duration}
                    </span>
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                      {sermon.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="text-xs text-stone-500 flex items-center gap-2 mb-2">
                      <span className="font-semibold text-amber-800">{sermon.series}</span>
                      <span>•</span>
                      <span>{sermon.date}</span>
                    </div>

                    <h4
                      onClick={() => onSelectSermon(sermon)}
                      className="font-serif-display font-bold text-lg text-stone-900 group-hover:text-amber-900 cursor-pointer line-clamp-2 leading-snug mb-2"
                    >
                      {language === 'en' ? sermon.title : sermon.titleId}
                    </h4>

                    <div className="text-xs text-stone-600 mb-3 flex items-center gap-1.5 font-medium">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span>{sermon.speaker}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-stone-500 bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-100 mb-3">
                      <BookOpen className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="truncate">{sermon.scripture}</span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {language === 'en' ? sermon.summary : sermon.summaryId}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                  <button
                    onClick={() => onSelectSermon(sermon)}
                    className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'en' ? 'Study & Watch' : 'Tonton & Renungan'}</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => handleShare(sermon)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
                    title="Share link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sermon Player & Notes Modal */}
        {selectedSermon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl relative">
              
              {/* Modal Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-100 text-amber-900">
                    {selectedSermon.category}
                  </span>
                  <span className="text-xs text-stone-500">• {selectedSermon.duration}</span>
                </div>
                <button
                  onClick={() => onSelectSermon(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {/* Simulated Media Player */}
                <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-stone-950 shadow-inner">
                  <img
                    src={selectedSermon.thumbnail}
                    alt={selectedSermon.title}
                    className="w-full h-full object-cover opacity-70"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-black/40" />

                  <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium bg-black/50 px-2.5 py-1 rounded backdrop-blur-xs">
                        GEPEKRIS Tretes Live Stream Archive
                      </span>
                      <button
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="flex items-center gap-1.5 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full backdrop-blur-xs transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isPlayingAudio ? 'Audio Muted' : 'Audio Playing'}</span>
                      </button>
                    </div>

                    <div className="text-center my-auto">
                      <button
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center mx-auto shadow-xl transition-transform hover:scale-105 cursor-pointer"
                      >
                        <Play className="w-7 h-7 fill-stone-950 ml-1" />
                      </button>
                      <p className="text-xs text-stone-300 mt-2 font-medium">
                        {isPlayingAudio ? 'Now playing service recording (03:14 / 42:00)' : 'Click to stream message'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-1/4 rounded-full" />
                      </div>
                      <div className="flex justify-between text-[11px] text-stone-400">
                        <span>10:30</span>
                        <span>{selectedSermon.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sermon Title & Metadata */}
                <div>
                  <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
                    {language === 'en' ? selectedSermon.title : selectedSermon.titleId}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-stone-600">
                    <span className="font-semibold text-stone-900">{selectedSermon.speaker}</span>
                    <span>•</span>
                    <span className="text-amber-800 font-medium">{selectedSermon.scripture}</span>
                    <span>•</span>
                    <span>{selectedSermon.date}</span>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-stone-700 text-sm leading-relaxed">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                    {language === 'en' ? 'Message Summary' : 'Ringkasan Firman'}
                  </h4>
                  <p>{language === 'en' ? selectedSermon.summary : selectedSermon.summaryId}</p>
                </div>

                {/* Takeaway Key Points */}
                <div>
                  <h4 className="font-serif-display text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>{language === 'en' ? 'Key Reflection Notes' : 'Poin Refleksi Penting'}</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {(language === 'en' ? selectedSermon.keyPoints : selectedSermon.keyPointsId).map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-stone-700">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions bottom bar */}
                <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShare(selectedSermon)}
                      className="px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                      <span>{copiedLink ? 'Copied link!' : 'Share Message'}</span>
                    </button>
                    <a
                      href="#prayer"
                      onClick={() => onSelectSermon(null)}
                      className="px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-amber-800" />
                      <span>{language === 'en' ? 'Request Pastoral Prayer' : 'Minta Dukungan Doa'}</span>
                    </a>
                  </div>
                  <button
                    onClick={() => onSelectSermon(null)}
                    className="px-5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    {language === 'en' ? 'Close' : 'Tutup'}
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
