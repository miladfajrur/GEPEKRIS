import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Share2,
  MessageCircle,
  Send,
  Copy,
  Check,
  Pencil,
  Sparkles,
} from 'lucide-react';
import { useChurchContent, DEFAULT_DAILY_VERSE } from '../context/ChurchContentContext';

export const DailyVerseBanner: React.FC = () => {
  const { content, isAdmin, openAdminAtTab } = useChurchContent();
  const [copied, setCopied] = useState(false);

  const dailyVerse = content.dailyVerse || DEFAULT_DAILY_VERSE;
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://gepekristretes.org';

  const buildShareText = () => {
    return `✨ *Ayat Firman Hari Ini — ${content.info.name}* ✨\n\n“${dailyVerse.verseText}”\n— *${dailyVerse.verseReference}*\n\n${dailyVerse.reflectionNote}\n\n🔗 Kunjungi & baca renungan lainnya:\n${pageUrl}#events`;
  };

  const waLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(buildShareText())}`;
  const tgText = `“${dailyVerse.verseText}” (${dailyVerse.verseReference})\n\n${dailyVerse.reflectionNote} — ${content.info.name}`;
  const tgLink = `https://t.me/share/url?url=${encodeURIComponent(pageUrl + '#events')}&text=${encodeURIComponent(tgText)}`;
  const fbQuote = `“${dailyVerse.verseText}” — ${dailyVerse.verseReference} (${content.info.name})`;
  const fbLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(fbQuote)}`;

  const handleCopyVerse = () => {
    navigator.clipboard.writeText(buildShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-12 bg-gradient-to-r from-[#FAF6EE] via-[#FDFBF7] to-[#FAF6EE] border-b border-amber-200/60 relative overflow-hidden">
      {/* Subtle decorative glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-48 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-md relative overflow-hidden"
        >
          {/* Top Accent Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-primary to-amber-500" />

          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>{dailyVerse.updatedDate || 'Ayat Firman Hari Ini'}</span>
            </div>

            {isAdmin && (
              <button
                onClick={() => openAdminAtTab('events')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-2xs cursor-pointer transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Ayat Harian</span>
              </button>
            )}
          </div>

          {/* Verse Quote */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <blockquote className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 leading-snug tracking-tight">
              “{dailyVerse.verseText}”
            </blockquote>

            <div className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-amber-800 bg-amber-50 px-4 py-1 rounded-full border border-amber-200/70">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>{dailyVerse.verseReference}</span>
            </div>

            {dailyVerse.reflectionNote && (
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed pt-1 max-w-2xl mx-auto">
                {dailyVerse.reflectionNote}
              </p>
            )}
          </div>

          {/* Share Bar */}
          <div className="mt-8 pt-5 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-stone-500 flex items-center gap-1.5 font-medium">
              <Share2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Bagikan berkat Firman Tuhan ini kepada keluarga & sahabat:</span>
            </span>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs cursor-pointer transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <a
                href={tgLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-2xs cursor-pointer transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </a>

              <a
                href={fbLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer transition-all"
              >
                <span>Facebook</span>
              </a>

              <button
                type="button"
                onClick={handleCopyVerse}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-200 cursor-pointer transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-600" />
                    <span>Salin Ayat</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
