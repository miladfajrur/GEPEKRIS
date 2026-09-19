import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useChurchContent } from '../context/ChurchContentContext';

interface HeroProps {
  onPlanVisit?: () => void;
  onWatchOnline?: () => void;
}

export function Hero({ onPlanVisit, onWatchOnline }: HeroProps) {
  const { content } = useChurchContent();
  const heroRef = useRef<HTMLElement>(null);

  // Scroll-linked parallax and fade out transitions for the hero section
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
          <span className="inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wide uppercase bg-white/15 backdrop-blur-md border border-white/20 text-amber-200 mb-6 shadow-xs">
            {content.info.name}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1] text-balance">
            {content.hero.headline}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl md:text-2xl mb-8 font-light text-stone-100 max-w-2xl mx-auto leading-relaxed text-pretty"
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
            className="w-full sm:w-auto text-base sm:text-lg px-8 py-3.5 bg-white text-stone-900 hover:bg-amber-50 hover:text-stone-950 font-semibold cursor-pointer shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Plan Your Visit
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onWatchOnline}
            className="w-full sm:w-auto text-base sm:text-lg px-8 py-3.5 bg-white/10 border-white/40 text-white hover:bg-white hover:text-black cursor-pointer backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
          >
            Watch Online
          </Button>
        </motion.div>

        {/* Service Times Quick Info Card with Scroll Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 bg-white/15 backdrop-blur-md rounded-2xl p-6 inline-block border border-white/20 shadow-xl max-w-xl mx-auto"
        >
          <h3 className="text-base sm:text-lg font-semibold mb-1 text-white tracking-wide">
            {content.hero.sundayNoteTitle}
          </h3>
          <p className="text-stone-200 text-sm sm:text-base leading-snug">
            {content.hero.sundayNoteTimes}
          </p>
        </motion.div>
      </motion.div>

      {/* Dynamic Scroll Down Indicator */}
      <motion.button
        onClick={scrollToServices}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/80 hover:text-white flex flex-col items-center gap-1 cursor-pointer transition-colors group"
        aria-label="Scroll to Services"
      >
        <span className="text-[11px] font-medium tracking-widest uppercase opacity-75 group-hover:opacity-100">
          Scroll Down
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-amber-300" />
        </motion.div>
      </motion.button>
    </section>
  );
}
