import React from 'react';
import { Language } from '../types';
import { Calendar, Play, MapPin, Clock, Users, Sparkles, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  language: Language;
  onOpenPlanVisit: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenSermonModal: (sermonId?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onOpenPlanVisit,
  onNavigate,
  onOpenSermonModal,
}) => {
  return (
    <section id="hero" className="relative overflow-hidden pt-6 pb-16 md:pt-12 md:pb-24 border-b border-stone-200">
      {/* Subtle textured background lighting */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_35%_at_50%_15%,rgba(217,119,6,0.08)_0%,transparent_100%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top welcome chip */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs sm:text-sm font-medium shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {language === 'en'
                ? 'Welcome Home • Join us this Sunday in person or online'
                : 'Selamat Datang di Rumah Tuhan • Hadir langsung atau online Minggu ini'}
            </span>
          </div>
        </div>

        {/* Hero Title & Intro */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 leading-[1.15]">
            {language === 'en' ? (
              <>
                A place of hope, grace, and <span className="italic text-amber-800 font-serif">true belonging</span>.
              </>
            ) : (
              <>
                Ruang harapan, kasih karunia, dan <span className="italic text-amber-800 font-serif">keluarga sejati</span>.
              </>
            )}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto font-normal">
            {language === 'en'
              ? 'No matter where you are on your spiritual journey, you are warmly invited to experience genuine community, passionate worship, and life-giving truth.'
              : 'Di mana pun langkah perjalanan iman Anda hari ini, pintu kami selalu terbuka menyambut Anda untuk bertumbuh bersama dalam kasih dan persekutuan yang tulus.'}
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onOpenPlanVisit}
              id="hero-plan-visit-cta"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-amber-50 text-base font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <Calendar className="w-5 h-5 text-amber-200" />
              <span>{language === 'en' ? 'Plan Your First Visit' : 'Rencanakan Kunjungan Pertama'}</span>
              <ArrowRight className="w-4 h-4 text-amber-200/80" />
            </button>

            <button
              onClick={() => onOpenSermonModal('sermon-1')}
              id="hero-watch-latest-cta"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 text-base font-medium shadow-sm transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{language === 'en' ? 'Watch Latest Message' : 'Tonton Khotbah Terbaru'}</span>
            </button>

            <button
              onClick={() => onNavigate('services')}
              id="hero-view-services-cta"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-stone-300 hover:border-stone-400 text-stone-700 bg-white/70 hover:bg-white text-base font-medium transition-all cursor-pointer"
            >
              <Clock className="w-4 h-4 text-stone-500" />
              <span>{language === 'en' ? 'Service Times' : 'Jadwal Ibadah'}</span>
            </button>
          </div>
        </div>

        {/* Hero Banner Visual Card */}
        <div className="mt-12 md:mt-16 relative rounded-2xl overflow-hidden shadow-xl border border-stone-300/80">
          <div className="aspect-16/9 md:aspect-21/9 w-full relative">
            <img
              src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1600&q=80"
              alt="GEPEKRIS Tretes Community Gathering"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Gradient Overlay for high readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />

            {/* Bottom floating info badge inside banner */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 text-white">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 text-stone-950 text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-ping" />
                  {language === 'en' ? 'Upcoming Worship' : 'Ibadah Terdekat'}
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif-display font-semibold text-stone-50">
                  {language === 'en' ? 'Sunday Morning Celebration • 09:00 WIB' : 'Ibadah Raya Minggu Pagi • 09:00 WIB'}
                </h2>
                <p className="text-sm text-stone-200 mt-1 max-w-xl">
                  {language === 'en'
                    ? 'Main Sanctuary Lt. 2 • Live Kids Ministry Check-in open from 08:30 WIB'
                    : 'Gedung Graha Harmoni Lt. 2 • Pendaftaran Sekolah Minggu dibuka mulai 08:30 WIB'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenPlanVisit}
                  id="hero-banner-reserve-btn"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold rounded-lg text-sm transition-colors cursor-pointer"
                >
                  {language === 'en' ? 'Reserve Visitor Seat' : 'Reservasi Tamu Baru'}
                </button>
                <button
                  onClick={() => onNavigate('services')}
                  id="hero-banner-directions-btn"
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white font-medium rounded-lg text-sm transition-colors cursor-pointer"
                >
                  {language === 'en' ? 'View Map & Parking' : 'Petunjuk Arah & Parkir'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Value Pillars */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                {language === 'en' ? 'Sundays 09:00 & 17:00' : 'Minggu 09:00 & 17:00'}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === 'en' ? 'Two service options to fit your family' : 'Pilihan jam ibadah pagi & sore'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                {language === 'en' ? 'Kids Kingdom Ministry' : 'Sekolah Minggu Terpadu'}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === 'en' ? 'Safe, vetted, engaging care ages 2-12' : 'Program aman & mendidik usia 2-12 th'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                {language === 'en' ? 'Free Reserved Parking' : 'Parkir Luas & Gratis'}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === 'en' ? 'Dedicated visitor spots & drop-off' : 'Area parkir ramah tamu baru'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
              <Play className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">
                {language === 'en' ? 'Live on YouTube' : 'Siaran Langsung YouTube'}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === 'en' ? 'Worship with us from anywhere' : 'Ibadah online di mana pun Anda berada'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
