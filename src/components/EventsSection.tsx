import React, { useState } from 'react';
import { Language, ChurchEvent } from '../types';
import { UPCOMING_EVENTS } from '../data/churchData';
import { Calendar, Clock, MapPin, Users, CheckCircle, Plus, X, Share2, Sparkles } from 'lucide-react';

interface EventsSectionProps {
  language: Language;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ language }) => {
  const [events, setEvents] = useState<ChurchEvent[]>(UPCOMING_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [rsvpModalEvent, setRsvpModalEvent] = useState<ChurchEvent | null>(null);
  
  // RSVP Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState('1');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = ['All', 'Outreach', 'Worship', 'Youth', 'Seminar'];

  const filteredEvents = events.filter((e) => {
    if (selectedCategory === 'All') return true;
    return e.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleOpenRsvp = (ev: ChurchEvent) => {
    setRsvpModalEvent(ev);
    setIsSubmitted(false);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rsvpModalEvent) return;

    const guestNumber = parseInt(guests, 10) || 1;

    // Update RSVP count in state
    setEvents((prev) =>
      prev.map((item) =>
        item.id === rsvpModalEvent.id
          ? { ...item, rsvpCount: item.rsvpCount + guestNumber }
          : item
      )
    );

    setIsSubmitted(true);
    setTimeout(() => {
      // Clear after submission
      setName('');
      setEmail('');
      setGuests('1');
    }, 500);
  };

  return (
    <section id="events" className="py-16 md:py-24 bg-stone-100/70 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              {language === 'en' ? 'Get Connected' : 'Kalender Kegiatan'}
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif-display font-bold text-stone-900">
              {language === 'en' ? 'Upcoming Gatherings & Events' : 'Acara & Komunitas Mendatang'}
            </h2>
            <p className="mt-2 text-stone-600 max-w-xl text-base">
              {language === 'en'
                ? 'From community outreach to worship encounters, find where you can plug in and build lasting friendships.'
                : 'Mulai dari bakti sosial hingga malam kebangunan rohani, temukan ruang untuk bertumbuh dan melayani bersama.'}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {cat === 'All' ? (language === 'en' ? 'All Events' : 'Semua Acara') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row"
            >
              <div className="sm:w-2/5 relative h-48 sm:h-auto shrink-0 overflow-hidden">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-xs text-amber-200 text-xs font-semibold">
                  {ev.category}
                </span>
              </div>

              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wide mb-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{ev.date}</span>
                  </div>

                  <h3 className="font-serif-display text-xl font-bold text-stone-900 leading-snug mb-2">
                    {language === 'en' ? ev.title : ev.titleId}
                  </h3>

                  <div className="space-y-1.5 text-xs text-stone-600 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{ev.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{ev.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                    {language === 'en' ? ev.description : ev.descriptionId}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-800" />
                    <strong>{ev.rsvpCount}</strong> {language === 'en' ? 'attending' : 'jemaat mendaftar'}
                  </span>

                  <button
                    onClick={() => handleOpenRsvp(ev)}
                    id={`rsvp-btn-${ev.id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {language === 'en' ? 'RSVP / Register' : 'Daftar Ikut Serta'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RSVP Modal */}
        {rsvpModalEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl p-6 relative">
              <button
                onClick={() => setRsvpModalEvent(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {!isSubmitted ? (
                <>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{rsvpModalEvent.date}</span>
                  </div>
                  <h3 className="font-serif-display text-2xl font-bold text-stone-900 mb-2">
                    {language === 'en' ? 'Event RSVP & Registration' : 'Pendaftaran Kegiatan'}
                  </h3>
                  <p className="text-xs text-stone-600 mb-5">
                    {language === 'en' ? rsvpModalEvent.title : rsvpModalEvent.titleId}
                  </p>

                  <form onSubmit={handleRsvpSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {language === 'en' ? 'Full Name' : 'Nama Lengkap'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. David Pratama"
                        className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {language === 'en' ? 'Email Address' : 'Alamat Email'} *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="david@example.com"
                        className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {language === 'en' ? 'Number of Attendees' : 'Jumlah Peserta / Keluarga'}
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                      >
                        <option value="1">1 Person (Just me)</option>
                        <option value="2">2 Persons (Couple / Friends)</option>
                        <option value="3">3 Persons</option>
                        <option value="4">4+ Persons (Family Group)</option>
                      </select>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>
                        {language === 'en'
                          ? 'We will send a reminder and event badge directly to your email.'
                          : 'Informasi dan pengingat acara akan dikirimkan ke email Anda.'}
                      </span>
                    </div>

                    <button
                      type="submit"
                      id="submit-rsvp-btn"
                      className="w-full py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
                    >
                      {language === 'en' ? 'Confirm Registration' : 'Konfirmasi Pendaftaran'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif-display text-2xl font-bold text-stone-900 mb-2">
                    {language === 'en' ? 'You Are Registered!' : 'Pendaftaran Berhasil!'}
                  </h3>
                  <p className="text-sm text-stone-600 mb-6">
                    {language === 'en'
                      ? `Thank you, ${name}. We look forward to seeing you at ${rsvpModalEvent.title}.`
                      : `Terima kasih, ${name}. Kami menantikan kehadiran Anda di acara ${rsvpModalEvent.titleId}.`}
                  </p>
                  <button
                    onClick={() => setRsvpModalEvent(null)}
                    className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm transition-colors cursor-pointer"
                  >
                    {language === 'en' ? 'Done' : 'Selesai'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
