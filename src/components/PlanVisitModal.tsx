import React, { useState } from 'react';
import { Language } from '../types';
import { Calendar, Clock, Users, CheckCircle2, Sparkles, Coffee, Heart, X, MapPin } from 'lucide-react';
import { CHURCH_INFO } from '../data/churchData';

interface PlanVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const PlanVisitModal: React.FC<PlanVisitModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [selectedService, setSelectedService] = useState('09:00');
  const [selectedDate, setSelectedDate] = useState('This Sunday');
  const [hasKids, setHasKids] = useState(false);
  const [kidsDetails, setKidsDetails] = useState('');
  const [needsAccessibility, setNeedsAccessibility] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorPhone.trim()) return;
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setVisitorName('');
    setVisitorEmail('');
    setVisitorPhone('');
    setKidsDetails('');
    setHasKids(false);
    setNeedsAccessibility(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'en' ? 'First Time Visitor VIP Pass' : 'Panduan Tamu Pertama Kali'}</span>
            </div>
            
            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
              {language === 'en' ? 'Plan Your Visit' : 'Rencanakan Kunjungan Anda'}
            </h3>
            
            <p className="text-xs sm:text-sm text-stone-600 mb-6 leading-relaxed">
              {language === 'en'
                ? 'Visiting a new church can feel intimidating. Let us know you’re coming, and a warm host will save seats for you, introduce you around, and treat you to complimentary coffee.'
                : 'Pertama kali beribadah di gereja baru? Beri tahu kami kehadiran Anda agar tim hospitality kami dapat menyambut hangat, menyiapkan tempat duduk, dan mendampingi Anda.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'en' ? 'Your Name' : 'Nama Lengkap'} *
                </label>
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="e.g. Jonathan Wijaya"
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'en' ? 'WhatsApp / Phone' : 'Nomor WhatsApp'} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    placeholder="+62 8..."
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'en' ? 'Email Address' : 'Alamat Email'}
                  </label>
                  <input
                    type="email"
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    placeholder="jonathan@example.com"
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'en' ? 'Service Date' : 'Tanggal Kehadiran'}
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                  >
                    <option value="This Sunday">{language === 'en' ? 'This Sunday' : 'Minggu Ini'}</option>
                    <option value="Next Sunday">{language === 'en' ? 'Next Sunday' : 'Minggu Depan'}</option>
                    <option value="In 2 Weeks">{language === 'en' ? 'In 2 Weeks' : '2 Minggu Lagi'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'en' ? 'Service Time' : 'Jam Ibadah'}
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                  >
                    <option value="09:00">09:00 WIB (Morning Celebration)</option>
                    <option value="17:00">17:00 WIB (Evening Service)</option>
                    <option value="18:00">Saturday 18:00 WIB (Youth Ignite)</option>
                  </select>
                </div>
              </div>

              {/* Children checkbox */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasKids}
                    onChange={(e) => setHasKids(e.target.checked)}
                    className="rounded text-amber-800 focus:ring-amber-700"
                  />
                  <span className="text-xs font-semibold text-stone-800">
                    {language === 'en' ? 'I am bringing children (Ages 2 - 12)' : 'Saya membawa anak-anak (Usia 2 - 12 th)'}
                  </span>
                </label>
                {hasKids && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      value={kidsDetails}
                      onChange={(e) => setKidsDetails(e.target.value)}
                      placeholder={language === 'en' ? 'Child name(s) and ages for pre-checkin...' : 'Nama & usia anak untuk pendaftaran cepat...'}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Accessibility */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="access-check"
                  checked={needsAccessibility}
                  onChange={(e) => setNeedsAccessibility(e.target.checked)}
                  className="rounded text-amber-800 focus:ring-amber-700"
                />
                <label htmlFor="access-check" className="text-xs text-stone-600 cursor-pointer">
                  {language === 'en'
                    ? 'Need wheelchair assistance or reserved ground-floor seating'
                    : 'Membutuhkan akses kursi roda atau tempat duduk lantai dasar'}
                </label>
              </div>

              <button
                type="submit"
                id="plan-visit-submit-btn"
                className="w-full py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-200" />
                <span>{language === 'en' ? 'Confirm My Visit Plan' : 'Konfirmasi Kunjungan Saya'}</span>
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {language === 'en' ? 'VIP Guest Confirmed' : 'Konfirmasi Tamu Terjadwal'}
            </span>

            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-3 mb-2">
              {language === 'en' ? `We Can't Wait to Meet You, ${visitorName}!` : `Sampai Jumpa, ${visitorName}!`}
            </h3>

            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              {language === 'en'
                ? `Your visit is set for ${selectedDate} at ${selectedService} WIB. Our hospitality host Sarah will meet you at the Welcome Lounge with fresh coffee and your welcome gift package.`
                : `Kunjungan Anda dijadwalkan untuk ${selectedDate} pukul ${selectedService} WIB. Tim penyambut kami akan menunggu Anda di Welcome Lounge dengan minuman hangat dan paket selamat datang.`}
            </p>

            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/70 text-left text-xs space-y-2 mb-6 text-stone-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-800 shrink-0" />
                <span>{CHURCH_INFO.address} (Graha Harmoni Sanctuary)</span>
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-amber-800 shrink-0" />
                <span>{language === 'en' ? 'Free Reserved Parking: Show this pass at gate' : 'Parkir Gratis: Tunjukkan pesan ini ke petugas'}</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm transition-colors cursor-pointer"
            >
              {language === 'en' ? 'Close Window' : 'Tutup Jendela'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
