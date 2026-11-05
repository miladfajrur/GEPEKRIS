import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown, Pencil, Video } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useChurchContent } from '../context/ChurchContentContext';

interface HeroProps {
  onPlanVisit?: () => void;
  onWatchOnline?: () => void;
}

export function Hero({ onPlanVisit, onWatchOnline }: HeroProps) {
  const { content, isAdmin, openAdminAtTab } = useChurchContent();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 0.85], [0, 70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const scrollToServices = () => {
    const servicesEl = document.getElementById('services');
    if (servicesEl) {
      servicesEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-[90vh] md:h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Admin Quick Edit Shortcut */}
      {isAdmin && (
        <div className="absolute top-24 right-4 sm:right-8 z-30 flex items-center gap-2">
          <button
            onClick={() => openAdminAtTab('hero')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600/95 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg backdrop-blur-md border border-amber-400/40 cursor-pointer transition-all"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit Banner Beranda</span>
          </button>
          <button
            onClick={() => openAdminAtTab('info')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-200 text-xs font-semibold shadow-lg backdrop-blur-md border border-stone-700 cursor-pointer transition-all"
          >
            <Video className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit Link Streaming</span>
          </button>
        </div>
      )}

      {/* Background Image with Parallax on Scroll */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 z-0 origin-center will-change-transform"
      >
        <ImageWithFallback
          key={content.hero.bgImage}
          src={content.hero.bgImage}
          alt={content.info.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/75"></div>
      </motion.div>

      {/* Hero Content with Scroll Animation */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 will-change-transform"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-900/60 backdrop-blur-md border border-amber-200/30 text-amber-200/90 text-xs sm:text-sm uppercase tracking-widest font-medium mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>{content.info.name}</span>
          </div>
          <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.15] text-balance mb-6 text-white drop-shadow-sm">
            {content.hero.headline}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl mb-9 font-light text-stone-200 max-w-2xl mx-auto leading-relaxed text-pretty"
        >
          {content.hero.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            onClick={onPlanVisit}
            className="w-full sm:w-auto text-sm sm:text-base px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold cursor-pointer shadow-lg transition-all rounded-xl border border-amber-300/40"
          >
            Rencanakan Kunjungan
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onWatchOnline}
            className="w-full sm:w-auto text-sm sm:text-base px-8 py-3.5 bg-stone-900/60 border-stone-400/40 text-stone-100 hover:bg-stone-900/80 hover:text-white cursor-pointer backdrop-blur-md transition-all rounded-xl"
          >
            Tonton Ibadah Online
          </Button>
        </motion.div>

        {/* Service Times Quick Info Card with Scroll Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 bg-stone-950/60 backdrop-blur-md rounded-2xl p-6 sm:p-7 inline-block border border-amber-200/20 shadow-2xl max-w-xl mx-auto text-center"
        >
          <div className="text-[11px] uppercase tracking-widest font-semibold text-amber-300/90 mb-1.5">
            Ibadah Hari Minggu
          </div>
          <h3 className="font-serif-display text-lg sm:text-xl font-medium mb-1.5 text-white tracking-wide">
            {content.hero.sundayNoteTitle}
          </h3>
          <p className="text-stone-300 text-sm sm:text-base font-light leading-snug">
            {content.hero.sundayNoteTimes}
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.button
        onClick={scrollToServices}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/80 hover:text-white flex flex-col items-center gap-1 cursor-pointer transition-colors group"
        aria-label="Gulir ke Jadwal Ibadah"
      >
        <span className="text-[11px] font-medium tracking-widest uppercase opacity-75 group-hover:opacity-100">
          Gulir ke Bawah
        </span>
        <div className="group-hover:translate-y-1 transition-transform duration-300">
          <ChevronDown className="w-5 h-5 text-amber-300" />
        </div>
      </motion.button>
    </section>
  );
}
