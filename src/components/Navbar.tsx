import React, { useState } from 'react';
import { Language } from '../types';
import { CHURCH_INFO } from '../data/churchData';
import { Church, Menu, X, Calendar, Heart, Globe, Play, Phone } from 'lucide-react';

interface NavbarProps {
  language: Language;
  onToggleLanguage: () => void;
  onOpenPlanVisit: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  onOpenPlanVisit,
  activeSection,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'services', label: language === 'en' ? 'Services' : 'Ibadah' },
    { id: 'sermons', label: language === 'en' ? 'Sermons' : 'Khotbah' },
    { id: 'events', label: language === 'en' ? 'Events' : 'Kegiatan' },
    { id: 'ministries', label: language === 'en' ? 'Ministries' : 'Pelayanan' },
    { id: 'about', label: language === 'en' ? 'About Us' : 'Tentang Kami' },
    { id: 'prayer', label: language === 'en' ? 'Prayer Wall' : 'Ruang Doa' },
    { id: 'give', label: language === 'en' ? 'Give' : 'Persembahan' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200 transition-colors">
      {/* Top micro-announcement banner */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {language === 'en'
                ? 'Join us this Sunday at 09:00 & 17:00 WIB in person or on YouTube Live'
                : 'Ibadah Minggu ini pukul 09:00 & 17:00 WIB di Gereja atau YouTube Live'}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-stone-300">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-400" />
              {CHURCH_INFO.whatsapp}
            </span>
            <button
              onClick={onToggleLanguage}
              id="lang-toggle-top"
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <Globe className="w-3 h-3 text-amber-400" />
              <span className="font-semibold uppercase">{language === 'en' ? 'ID (Bahasa)' : 'EN (English)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Name */}
          <button
            onClick={() => handleLinkClick('hero')}
            id="nav-logo"
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-stone-900 text-amber-100 flex items-center justify-center shadow-sm group-hover:bg-amber-800 transition-colors">
              <Church className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="font-serif-display text-xl font-bold tracking-tight text-stone-900 leading-none">
                {language === 'en' ? 'Grace Church' : 'Gereja Kasih'}
              </div>
              <div className="text-[11px] font-medium tracking-widest text-amber-800 uppercase mt-1">
                {language === 'en' ? 'Community of Hope' : 'Komunitas Harapan'}
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                id={`nav-link-${item.id}`}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  activeSection === item.id
                    ? 'text-stone-900 bg-stone-200/70 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onToggleLanguage}
              id="lang-toggle-btn"
              className="lg:flex hidden items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-300 transition-colors cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'en' ? 'Bahasa ID' : 'English'}</span>
            </button>

            <button
              onClick={onOpenPlanVisit}
              id="nav-plan-visit-btn"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-amber-50 text-sm font-medium shadow-sm transition-all hover:shadow active:scale-[0.98] cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-200" />
              <span>{language === 'en' ? 'Plan a Visit' : 'Rencanakan Kunjungan'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onToggleLanguage}
              id="mobile-lang-btn"
              className="sm:hidden px-2.5 py-1.5 text-xs font-bold bg-stone-100 border border-stone-300 rounded-lg text-stone-800"
            >
              {language.toUpperCase()}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle"
              className="p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-stone-200 bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-1 pb-3 border-b border-stone-200">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-amber-100 text-amber-950 font-semibold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPlanVisit();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-800 text-amber-50 font-medium text-sm shadow-sm"
            >
              <Calendar className="w-4 h-4 text-amber-200" />
              <span>{language === 'en' ? 'Plan a Visit (First-Time Guide)' : 'Rencanakan Kunjungan (Panduan)'}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('give');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 text-stone-800 font-medium text-sm hover:bg-stone-100"
            >
              <Heart className="w-4 h-4 text-amber-700" />
              <span>{language === 'en' ? 'Give Online' : 'Persembahan Online'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
