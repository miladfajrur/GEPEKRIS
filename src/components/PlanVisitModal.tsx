import React, { useState } from 'react';
import { Language } from '../types';
import { CheckCircle2, Coffee, X, MapPin } from 'lucide-react';
import { useChurchContent } from '../context/ChurchContentContext';

interface PlanVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const PlanVisitModal: React.FC<PlanVisitModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { content } = useChurchContent();

  // Build service options dynamically from church services
  const serviceOptions = content.services.flatMap((srv) => {
    const times = Array.isArray(srv.times) ? srv.times : [String(srv.times || '')];
    return times.map((t) => `${t} (${srv.name})`);
  });
  const defaultServiceOption = serviceOptions[0] || '07:30 WIB (Ibadah Raya Minggu)';

  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [selectedService, setSelectedService] = useState(defaultServiceOption);
  const [selectedDate, setSelectedDate] = useState('Minggu Ini');
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
            <div className="text-xs uppercase tracking-widest font-semibold text-amber-800/90 mb-2">
              Penyambutan Jemaat & Tamu Baru
            </div>
            
            <h3 className="font-serif-display text-2xl sm:text-3xl font-medium text-stone-900 mb-2 tracking-tight">
              Rencanakan Kunjungan Anda
            </h3>
            
            <p className="text-xs sm:text-sm text-stone-600 mb-6 leading-relaxed font-light">
              Pertama kali beribadah di {content.info.name}? Beri tahu kami rencana kehadiran Anda agar tim penyambut jemaat kami dapat menyambut hangat, menyiapkan tempat duduk, dan mendampingi Anda.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Contoh: Bapak/Ibu Yohanes Wijaya"
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Alamat Email (Opsional)
                  </label>
                  <input
                    type="email"
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    placeholder="email@contoh.com"
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Waktu Kehadiran
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                  >
                    <option value="Minggu Ini">Minggu Ini</option>
                    <option value="Minggu Depan">Minggu Depan</option>
                    <option value="2 Minggu Lagi">2 Minggu Lagi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Pilihan Jam Ibadah
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                  >
                    {serviceOptions.map((opt, idx) => (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    ))}
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
                    Saya membawa anak-anak (Sekolah Minggu)
                  </span>
                </label>
                {hasKids && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      value={kidsDetails}
                      onChange={(e) => setKidsDetails(e.target.value)}
                      placeholder="Nama & usia anak untuk penyambutan Sekolah Minggu..."
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
                  Membutuhkan pendampingan khusus / kursi prioritas lansia
                </label>
              </div>

              <button
                type="submit"
                id="plan-visit-submit-btn"
                className="w-full py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-200" />
                <span>Konfirmasi Rencana Kunjungan</span>
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Kehadiran Terkonfirmasi
            </span>

            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-3 mb-2">
              Sampai Jumpa di Gereja, {visitorName}!
            </h3>

            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              Kunjungan Anda dijadwalkan untuk <strong>{selectedDate}</strong> pada <strong>{selectedService}</strong>. Tim penyambut jemaat {content.info.name} siap menyambut kehadiran Anda dengan penuh sukacita.
            </p>

            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/70 text-left text-xs space-y-2 mb-6 text-stone-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-800 shrink-0" />
                <span>{content.info.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-amber-800 shrink-0" />
                <span>Silakan sapa petugas penerima tamu di pintu utama gereja</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm transition-colors cursor-pointer"
            >
              Tutup Jendela
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
