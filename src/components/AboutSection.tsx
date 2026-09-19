import React, { useState } from 'react';
import { Language } from '../types';
import { STAFF_MEMBERS, CHURCH_VALUES, CHURCH_INFO } from '../data/churchData';
import { Heart, Compass, BookOpen, ShieldCheck, Mail } from 'lucide-react';

interface AboutSectionProps {
  language: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'story' | 'values' | 'team'>('story');

  return (
    <section id="about" className="py-16 md:py-24 bg-stone-100/70 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            {language === 'en' ? 'Who We Are' : 'Tentang Kami'}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-serif-display font-bold text-stone-900">
            {language === 'en' ? 'Rooted in Grace, Living for His Glory' : 'Berakar dalam Kasih, Hidup bagi Kemuliaan-Nya'}
          </h2>
          <p className="mt-3 text-stone-600 text-base sm:text-lg">
            {language === 'en'
              ? 'Founded in 2008, Grace Church is a diverse family of believers dedicated to worshiping Jesus, cultivating authentic relationships, and serving our city.'
              : 'Berdiri sejak 2008, Gereja Grace Community adalah keluarga rohani yang rindu menyembah Kristus, membangun persekutuan erat, dan menjadi terang di tengah masyarakat.'}
          </p>
        </div>

        {/* Sub-nav tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 rounded-xl bg-white border border-stone-200 shadow-xs">
            <button
              onClick={() => setActiveTab('story')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'story'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'en' ? 'Our Story & Vision' : 'Visi & Sejarah'}
            </button>
            <button
              onClick={() => setActiveTab('values')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'values'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'en' ? 'Core Values' : 'Nilai-Nilai Utama'}
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'team'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'en' ? 'Pastoral Team' : 'Hamba Tuhan'}
            </button>
          </div>
        </div>

        {/* Tab 1: Story & Vision */}
        {activeTab === 'story' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-md border border-stone-200">
              <img
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80"
                alt="Grace Church Fellowship"
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lg:col-span-6 space-y-4 text-stone-700 leading-relaxed text-sm sm:text-base">
              <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
                {language === 'en'
                  ? 'A Sanctuary Where Everyone Has a Seat at the Table'
                  : 'Rumah di Mana Setiap Jiwa Memiliki Tempat yang Berharga'}
              </h3>
              <p>
                {language === 'en'
                  ? 'Grace Church started 18 years ago with a small gathering of 12 people praying in a living room, asking God to create an authentic church where broken people find healing, skeptics find honest answers, and seekers encounter genuine unconditional love.'
                  : 'Gereja ini berawal dari 12 orang yang berkumpul berdoa di ruang keluarga pada tahun 2008, memohon agar Tuhan menumbuhkan sebuah gereja di mana yang terluka dipulihkan, yang mencari menemukan jawaban, dan setiap orang mengalami kasih Kristus yang sejati.'}
              </p>
              <p>
                {language === 'en'
                  ? 'Today, we gather as one united family across generational and cultural backgrounds. We are not interested in perfection; we are interested in grace, discipleship, and walking with you through every season.'
                  : 'Kini kami bertumbuh menjadi keluarga yang menyatukan berbagai latar belakang dan generasi. Kami tidak menuntut kesempurnaan; kami merayakan anugerah kasih karunia dan siap berjalan bersama Anda di setiap musim kehidupan.'}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-6 text-stone-900 font-semibold text-sm">
                <div>
                  <div className="text-2xl font-serif-display font-bold text-amber-900">18+</div>
                  <div className="text-xs text-stone-500 font-normal">Years of Gospel Ministry</div>
                </div>
                <div className="h-8 w-px bg-stone-300" />
                <div>
                  <div className="text-2xl font-serif-display font-bold text-amber-900">1,400+</div>
                  <div className="text-xs text-stone-500 font-normal">Active Community Members</div>
                </div>
                <div className="h-8 w-px bg-stone-300" />
                <div>
                  <div className="text-2xl font-serif-display font-bold text-amber-900">35+</div>
                  <div className="text-xs text-stone-500 font-normal">Neighborhood Life Groups</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Core Values */}
        {activeTab === 'values' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CHURCH_VALUES.map((val, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4">
                    {idx === 0 && <Compass className="w-5 h-5 text-amber-800" />}
                    {idx === 1 && <Heart className="w-5 h-5 text-amber-800" />}
                    {idx === 2 && <ShieldCheck className="w-5 h-5 text-amber-800" />}
                    {idx === 3 && <BookOpen className="w-5 h-5 text-amber-800" />}
                  </div>
                  <h3 className="font-serif-display text-lg font-bold text-stone-900 mb-2">
                    {language === 'en' ? val.title : val.titleId}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {language === 'en' ? val.description : val.descriptionId}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Pastoral Team */}
        {activeTab === 'team' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STAFF_MEMBERS.map((staff) => (
              <div
                key={staff.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-64 relative overflow-hidden">
                    <img
                      src={staff.image}
                      alt={staff.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                      {language === 'en' ? staff.role : staff.roleId}
                    </span>
                    <h3 className="font-serif-display text-xl font-bold text-stone-900 mt-1 mb-2">
                      {staff.name}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {language === 'en' ? staff.bio : staff.bioId}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-stone-100 mt-2">
                  <a
                    href={`mailto:${CHURCH_INFO.email}?subject=Pastoral Care Inquiry`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-amber-800 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-700" />
                    <span>{language === 'en' ? 'Reach Out to Pastor' : 'Hubungi Tim Pastoral'}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
