import React, { useState } from 'react';
import { Language, Ministry } from '../types';
import { MINISTRIES } from '../data/churchData';
import { Users, Clock, ArrowRight, Heart, X, CheckCircle, MessageSquare } from 'lucide-react';

interface MinistriesSectionProps {
  language: Language;
}

export const MinistriesSection: React.FC<MinistriesSectionProps> = ({ language }) => {
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantInterest, setApplicantInterest] = useState('joining');
  const [submitted, setSubmitted] = useState(false);

  const handleOpenConnect = (m: Ministry) => {
    setSelectedMinistry(m);
    setSubmitted(false);
  };

  const handleSubmitConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) return;
    setSubmitted(true);
  };

  return (
    <section id="ministries" className="py-16 md:py-24 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full">
            {language === 'en' ? 'Community & Serving' : 'Pelayanan & Komunitas'}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-serif-display font-bold text-stone-900">
            {language === 'en' ? 'Ministries For Every Life Stage' : 'Ruang Bertumbuh Untuk Setiap Usia'}
          </h2>
          <p className="mt-3 text-stone-600 text-base sm:text-lg">
            {language === 'en'
              ? 'Discover a vibrant group where you can forge deep bonds, use your gifts, and make an eternal difference.'
              : 'Temukan komunitas yang tepat untuk mengasah talenta Anda, bertumbuh dalam iman, dan melayani sesama.'}
          </p>
        </div>

        {/* Ministries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MINISTRIES.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-amber-600 text-stone-950 inline-block mb-1">
                      {m.targetAudience}
                    </span>
                    <h3 className="font-serif-display text-lg font-bold leading-tight">
                      {language === 'en' ? m.name : m.nameId}
                    </h3>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>{m.schedule}</span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {language === 'en' ? m.description : m.descriptionId}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {m.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                <span className="text-xs text-stone-500 font-medium">
                  {language === 'en' ? 'Lead:' : 'Koordinator:'} {m.leader}
                </span>
                <button
                  onClick={() => handleOpenConnect(m)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 cursor-pointer"
                >
                  <span>{language === 'en' ? 'Get Connected' : 'Bergabung'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Connect Ministry Modal */}
        {selectedMinistry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl p-6 relative">
              <button
                onClick={() => setSelectedMinistry(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {!submitted ? (
                <>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                    <Users className="w-4 h-4" />
                    <span>{language === 'en' ? 'Ministry Connect' : 'Hubungi Koordinator'}</span>
                  </div>
                  <h3 className="font-serif-display text-2xl font-bold text-stone-900 mb-2">
                    {language === 'en' ? selectedMinistry.name : selectedMinistry.nameId}
                  </h3>
                  <p className="text-xs text-stone-600 mb-5">
                    {language === 'en'
                      ? 'Leave your contact details and ministry leaders will warmly reach out with meeting times and next steps.'
                      : 'Isi informasi kontak Anda dan koordinator kami akan menghubungi Anda untuk langkah selanjutnya.'}
                  </p>

                  <form onSubmit={handleSubmitConnect} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {language === 'en' ? 'Your Name' : 'Nama Anda'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="e.g. Samuel Adiputra"
                        className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {language === 'en' ? 'WhatsApp / Phone' : 'Nomor WhatsApp'} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="+62 812..."
                        className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {language === 'en' ? 'I want to...' : 'Saya ingin...'}
                      </label>
                      <select
                        value={applicantInterest}
                        onChange={(e) => setApplicantInterest(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                      >
                        <option value="joining">
                          {language === 'en' ? 'Join as a participant / attendee' : 'Bergabung sebagai jemaat / anggota'}
                        </option>
                        <option value="volunteering">
                          {language === 'en' ? 'Serve as a team volunteer' : 'Melayani sebagai relawan / tim pelayan'}
                        </option>
                        <option value="asking_info">
                          {language === 'en' ? 'Ask questions / general inquiry' : 'Menanyakan informasi lebih lanjut'}
                        </option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
                    >
                      {language === 'en' ? 'Submit Inquiry' : 'Kirim Permohonan'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif-display text-2xl font-bold text-stone-900 mb-2">
                    {language === 'en' ? 'Message Sent!' : 'Pesan Terkirim!'}
                  </h3>
                  <p className="text-sm text-stone-600 mb-6">
                    {language === 'en'
                      ? `Thank you, ${applicantName}! The team for ${selectedMinistry.name} will reach out to you shortly.`
                      : `Terima kasih, ${applicantName}! Tim dari ${selectedMinistry.nameId} akan segera menghubungi Anda.`}
                  </p>
                  <button
                    onClick={() => setSelectedMinistry(null)}
                    className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm transition-colors cursor-pointer"
                  >
                    {language === 'en' ? 'Close' : 'Tutup'}
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
