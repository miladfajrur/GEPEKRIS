import React, { useState } from 'react';
import { Language, ServiceSchedule } from '../types';
import { SERVICE_SCHEDULES, CHURCH_INFO } from '../data/churchData';
import { Clock, MapPin, CheckCircle2, Navigation, Coffee, ShieldCheck, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface ServiceTimesSectionProps {
  language: Language;
  onOpenPlanVisit: () => void;
}

export const ServiceTimesSection: React.FC<ServiceTimesSectionProps> = ({
  language,
  onOpenPlanVisit,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: language === 'en' ? 'What should I wear?' : 'Pakaian apa yang harus saya kenakan?',
      a: language === 'en'
        ? 'Come as you are! You will see people in jeans and t-shirts, smart casual attire, and traditional Sunday wear. We care about your presence, not your wardrobe.'
        : 'Datanglah apa adanya! Jemaat kami mengenakan pakaian kasual rapi, kemeja, hingga batik santai. Yang terpenting adalah hati yang rindu beribadah bersama.',
    },
    {
      q: language === 'en' ? 'What should I expect when I arrive?' : 'Apa yang terjadi saat saya pertama kali tiba?',
      a: language === 'en'
        ? 'Our friendly Welcome Hospitality team will greet you in the lobby, hand you a bulletin, offer complimentary fresh coffee/tea, and help you find comfortable seats.'
        : 'Tim penyambut jemaat (Welcoming Team) kami akan menyapa ramah di lobi utama, menyediakan teh/kopi hangat gratis, dan membantu Anda mendapatkan tempat duduk yang nyaman.',
    },
    {
      q: language === 'en' ? 'What about my kids?' : 'Bagaimana dengan anak-anak saya?',
      a: language === 'en'
        ? 'Our Kids Kingdom provides secure check-in with printed matching tags, background-checked leaders, and age-tailored Bible adventures for toddlers through 6th grade.'
        : 'Sekolah Minggu Kids Kingdom kami memiliki sistem check-in keamanan digital dengan gelang identitas anak dan guru yang terlatih serta penuh kasih.',
    },
    {
      q: language === 'en' ? 'Where do I park?' : 'Di mana lokasi parkir gereja?',
      a: language === 'en'
        ? 'We provide complimentary secure parking in our basement (B1-B2) as well as the open courtyard. Dedicated first-time visitor spaces are reserved right by the main entrance.'
        : 'Tersedia area parkir gratis yang luas dan aman di basement (B1-B2) serta halaman gedung. Khusus jemaat baru, kami menyediakan slot parkir VIP di dekat pintu masuk utama.',
    },
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-stone-100/60 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full">
            {language === 'en' ? 'Join Us In Person & Online' : 'Ibadah Bersama Kami'}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-serif-display font-bold text-stone-900">
            {language === 'en' ? 'Worship Services & Schedule' : 'Jadwal Ibadah Mingguan'}
          </h2>
          <p className="mt-3 text-stone-600 text-base sm:text-lg">
            {language === 'en'
              ? 'Find the worship experience that best suits your family and rhythm of life.'
              : 'Pilih jadwal ibadah yang sesuai bagi Anda dan keluarga tercinta.'}
          </p>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICE_SCHEDULES.map((svc) => (
            <div
              key={svc.id}
              className={`p-6 sm:p-7 rounded-2xl bg-white border transition-all hover:shadow-md relative flex flex-col justify-between ${
                svc.isNext ? 'border-amber-700/40 ring-1 ring-amber-700/20 shadow-xs' : 'border-stone-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 uppercase tracking-wide">
                    {language === 'en' ? svc.tag : svc.tagId}
                  </span>
                  {svc.isNext && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-600 text-stone-950 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-950 animate-ping" />
                      {language === 'en' ? 'Main Service' : 'Ibadah Utama'}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-serif-display font-bold text-stone-900 mb-2">
                  {language === 'en' ? svc.name : svc.nameId}
                </h3>

                <div className="space-y-2 mb-4 text-stone-600 text-sm">
                  <div className="flex items-center gap-2 font-medium text-amber-900">
                    <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{svc.time} • {svc.day}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>{svc.location}</span>
                  </div>
                </div>

                <p className="text-sm text-stone-600 leading-relaxed mb-6">
                  {language === 'en' ? svc.description : svc.descriptionId}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {language === 'en' ? 'No reservation needed' : 'Terbuka untuk umum'}
                </span>
                <button
                  onClick={onOpenPlanVisit}
                  id={`schedule-plan-${svc.id}`}
                  className="text-xs font-semibold text-amber-800 hover:text-amber-950 hover:underline cursor-pointer flex items-center gap-1"
                >
                  {language === 'en' ? 'Plan a Visit →' : 'Panduan Kunjungan →'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Location Card & First Timer Guide Accordion */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Location & Map Card */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4" />
              <span>{language === 'en' ? 'Church Sanctuary Location' : 'Lokasi Gedung Gereja'}</span>
            </div>
            <h3 className="text-2xl font-serif-display font-bold text-stone-900">
              Graha Harmoni Sanctuary
            </h3>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              {CHURCH_INFO.address}
            </p>

            <div className="mt-5 p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 space-y-2 text-xs sm:text-sm text-stone-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0" />
                <span><strong>{language === 'en' ? 'Security & Access:' : 'Keamanan & Akses:'}</strong> 24/7 security with easy elevator access</span>
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-amber-800 shrink-0" />
                <span><strong>{language === 'en' ? 'Hospitality Cafe:' : 'Lobi & Kafe:'}</strong> Free beverage bar open 45 mins prior to service</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                id="maps-direction-link"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 text-sm font-medium transition-colors cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>{language === 'en' ? 'Open in Google Maps' : 'Buka Petunjuk Arah'}</span>
              </a>
              <button
                onClick={onOpenPlanVisit}
                id="location-first-time-btn"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-sm font-medium transition-colors cursor-pointer"
              >
                {language === 'en' ? 'I am Visiting for First Time' : 'Saya Tamu Pertama Kali'}
              </button>
            </div>
          </div>

          {/* Visitor Questions FAQ */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>{language === 'en' ? 'First Time Visiting?' : 'Pertama Kali Datang?'}</span>
            </div>
            <h3 className="text-2xl font-serif-display font-bold text-stone-900 mb-5">
              {language === 'en' ? 'Everything You Need to Know' : 'Hal Yang Perlu Anda Ketahui'}
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-stone-200 rounded-xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      <span className="text-sm sm:text-base font-semibold text-stone-800">
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-amber-800 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
