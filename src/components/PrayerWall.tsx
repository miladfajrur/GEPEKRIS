import React, { useState, useEffect } from 'react';
import { collection, doc, addDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, sanitizeForFirestore } from '../firebase';
import { Language, PrayerRequest } from '../types';
import { INITIAL_PRAYERS } from '../data/churchData';
import { Heart, Plus, ShieldCheck, Lock, CheckCircle2, MessageCircleHeart, Sparkles, Send, X } from 'lucide-react';

interface PrayerWallProps {
  language: Language;
}

export const PrayerWall: React.FC<PrayerWallProps> = ({ language }) => {
  const [prayers, setPrayers] = useState<PrayerRequest[]>(INITIAL_PRAYERS);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [justPrayedId, setJustPrayedId] = useState<string | null>(null);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [category, setCategory] = useState<PrayerRequest['category']>('Healing');
  const [requestText, setRequestText] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Real-time Firestore sync for prayers
  useEffect(() => {
    const path = 'prayers';
    const unsubscribe = onSnapshot(
      collection(db, 'prayers'),
      (snapshot) => {
        const remotePrayers: PrayerRequest[] = [];
        snapshot.forEach((dSnap) => {
          const d = dSnap.data();
          if (!d.isPrivate) {
            remotePrayers.push({
              id: dSnap.id,
              author: d.author || 'Jemaat',
              category: d.category || 'Healing',
              request: d.request || '',
              date: d.date || 'Baru saja',
              prayersCount: typeof d.prayersCount === 'number' ? d.prayersCount : 1,
              isPrivate: !!d.isPrivate,
            });
          }
        });
        if (remotePrayers.length > 0) {
          // Combine with initial prayers or display remote
          setPrayers(remotePrayers);
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, path);
        } catch {
          // Keep local prayers as fallback
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const handlePrayClick = async (id: string) => {
    setJustPrayedId(id);
    setTimeout(() => setJustPrayedId(null), 1500);

    // Optimistic UI update
    setPrayers((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const alreadyPrayed = item.prayedByMe;
          return {
            ...item,
            prayersCount: alreadyPrayed ? Math.max(1, item.prayersCount - 1) : item.prayersCount + 1,
            prayedByMe: !alreadyPrayed,
          };
        }
        return item;
      })
    );

    // Sync to Firestore if remote document
    if (!id.startsWith('prayer-mock-')) {
      try {
        await updateDoc(doc(db, 'prayers', id), {
          prayersCount: increment(1),
        });
      } catch (error) {
        try {
          handleFirestoreError(error, OperationType.UPDATE, `prayers/${id}`);
        } catch {}
      }
    }
  };

  const handleCreatePrayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    const newPrayer: PrayerRequest = {
      id: `prayer-${Date.now()}`,
      author: authorName.trim() || (language === 'en' ? 'Anonymous Sister/Brother' : 'Jemaat Tanpa Nama'),
      category,
      request: requestText.trim(),
      date: language === 'en' ? 'Just now' : 'Baru saja',
      prayersCount: 1,
      isPrivate,
      prayedByMe: true,
    };

    if (!isPrivate) {
      setPrayers((prev) => [newPrayer, ...prev]);
    }

    setSubmittedSuccess(true);

    // Save to Firestore
    try {
      await addDoc(collection(db, 'prayers'), sanitizeForFirestore({
        author: newPrayer.author,
        category: newPrayer.category,
        request: newPrayer.request,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        prayersCount: 1,
        isPrivate: newPrayer.isPrivate,
        createdAt: new Date().toISOString(),
      }));
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, 'prayers');
      } catch {}
    }
  };

  const handleCloseModal = () => {
    setIsSubmitModalOpen(false);
    setSubmittedSuccess(false);
    setAuthorName('');
    setRequestText('');
    setIsPrivate(false);
  };

  const totalPrayersCount = prayers.reduce((acc, curr) => acc + curr.prayersCount, 0);

  const categoryLabels: Record<string, string> = {
    Healing: 'Kesembuhan',
    Family: 'Keluarga',
    Guidance: 'Hikmat & Tuntunan',
    Gratitude: 'Ucapan Syukur',
    Community: 'Jemaat & Bangsa',
  };

  return (
    <section id="prayer" className="py-16 md:py-24 bg-[#FAF8F5] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold text-amber-800/90 mb-2">
              {language === 'en' ? 'Intercession & Care' : 'Pelayanan Doa & Syafaat'}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif-display font-medium text-stone-900 tracking-tight">
              {language === 'en' ? 'Community Prayer Wall' : 'Ruang Doa Bersama'}
            </h2>
            <p className="mt-2.5 text-stone-600 max-w-xl text-base font-light leading-relaxed">
              {language === 'en'
                ? 'Bear one another’s burdens. Stand in the gap for your brothers and sisters, or share your heart so we can pray with you.'
                : 'Bertolong-tolonganlah menanggung bebanmu. Mari saling mendoakan dan menyerahkan setiap pergumulan kepada Tuhan.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-stone-200/90 text-xs text-stone-700 shadow-2xs">
              <Heart className="w-4 h-4 text-amber-700" />
              <span><strong>{totalPrayersCount}</strong> {language === 'en' ? 'prayers lifted' : 'dukungan doa jemaat'}</span>
            </div>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              id="submit-prayer-trigger"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-200 font-semibold text-sm shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'en' ? 'Submit Prayer Request' : 'Kirim Pokok Doa'}</span>
            </button>
          </div>
        </div>

        {/* Prayer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prayers.map((prayer) => {
            const hasPrayed = prayer.prayedByMe;
            return (
              <div
                key={prayer.id}
                className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all shadow-2xs hover:shadow-md relative ${
                  hasPrayed ? 'border-amber-500/70 bg-amber-50/10' : 'border-stone-200/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-800/90">
                      {language === 'en' ? prayer.category : categoryLabels[prayer.category] || prayer.category}
                    </span>
                    <span className="text-xs text-stone-400">{prayer.date}</span>
                  </div>

                  <p className="text-sm sm:text-base text-stone-800 leading-relaxed italic mb-5 font-serif-display">
                    “{prayer.request}”
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-xs font-medium text-stone-600">
                    — {prayer.author}
                  </div>

                  <button
                    onClick={() => handlePrayClick(prayer.id)}
                    id={`pray-btn-${prayer.id}`}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      hasPrayed
                        ? 'bg-amber-100/80 text-amber-950 border border-amber-300'
                        : 'bg-[#FAF8F5] hover:bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        hasPrayed ? 'text-amber-700 fill-amber-700' : 'text-stone-400'
                      }`}
                    />
                    <span>
                      {hasPrayed
                        ? language === 'en' ? 'Prayed' : 'Amin · Didoakan'
                        : language === 'en' ? 'Pray' : 'Doakan'} ({prayer.prayersCount})
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Prayer Modal */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {!submittedSuccess ? (
                <>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                    <MessageCircleHeart className="w-4 h-4" />
                    <span>{language === 'en' ? 'Pastoral & Community Care' : 'Pelayanan Doa'}</span>
                  </div>
                  <h3 className="font-serif-display text-2xl font-bold text-stone-900 mb-2">
                    {language === 'en' ? 'How Can We Pray For You?' : 'Bagaimana Kami Dapat Mendoakan Anda?'}
                  </h3>
                  <p className="text-xs text-stone-600 mb-5">
                    {language === 'en'
                      ? 'Our pastoral team and intercessory prayer partners hold each request with dignity, faith, and love.'
                      : 'Tim pastoral dan tim pendoa syafaat kami siap mendukung Anda dalam doa dengan tulus.'}
                  </p>

                  <form onSubmit={handleCreatePrayer} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {language === 'en' ? 'Your Name (Leave blank for Anonymous)' : 'Nama Anda (Kosongkan jika Anonim)'}
                      </label>
                      <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder={language === 'en' ? 'e.g. Maria or Brother in Christ' : 'Contoh: Maria atau Saudara seiman'}
                        className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {language === 'en' ? 'Prayer Need Category' : 'Kategori Doa'}
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                      >
                        <option value="Healing">{language === 'en' ? 'Physical & Emotional Healing' : 'Kesembuhan Fisik & Jiwa'}</option>
                        <option value="Family">{language === 'en' ? 'Family, Marriage & Children' : 'Keluarga, Pernikahan & Anak'}</option>
                        <option value="Work/Studies">{language === 'en' ? 'Career, Studies & Business' : 'Pekerjaan, Studi & Usaha'}</option>
                        <option value="Guidance">{language === 'en' ? 'Spiritual Guidance & Wisdom' : 'Petunjuk Tuhan & Hikmat'}</option>
                        <option value="Thanksgiving">{language === 'en' ? 'Praise Report & Thanksgiving' : 'Ucapan Syukur & Kesaksian'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {language === 'en' ? 'Your Prayer Request' : 'Tuliskan Pokok Doa Anda'} *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={requestText}
                        onChange={(e) => setRequestText(e.target.value)}
                        placeholder={
                          language === 'en'
                            ? 'Share as much or as little as you feel comfortable with...'
                            : 'Ceritakan pokok doa atau pergumulan yang sedang Anda hadapi...'
                        }
                        className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                      />
                    </div>

                    <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isPrivate}
                          onChange={(e) => setIsPrivate(e.target.checked)}
                          className="mt-0.5 rounded text-amber-800 focus:ring-amber-700"
                        />
                        <div className="text-xs">
                          <span className="font-semibold text-stone-800 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-stone-600" />
                            {language === 'en' ? 'Keep Private (Pastors Only)' : 'Rahasia (Hanya untuk Tim Pastoral)'}
                          </span>
                          <span className="text-stone-500 block mt-0.5">
                            {language === 'en'
                              ? 'Do not publish this on the public prayer wall; pray confidentially in our pastoral circle.'
                              : 'Tidak akan ditampilkan di dinding doa umum; hanya didoakan oleh tim hamba Tuhan.'}
                          </span>
                        </div>
                      </label>
                    </div>

                    <button
                      type="submit"
                      id="submit-prayer-action-btn"
                      className="w-full py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{language === 'en' ? 'Submit Prayer Request' : 'Kirimkan Pokok Doa'}</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif-display text-2xl font-bold text-stone-900 mb-2">
                    {language === 'en' ? 'Your Request Has Been Received' : 'Pokok Doa Telah Diterima'}
                  </h3>
                  <p className="text-sm text-stone-600 mb-6">
                    {language === 'en'
                      ? isPrivate
                        ? 'Your confidential request was sent directly to our pastoral team. You are loved and supported.'
                        : 'Your request has been added to our prayer wall. May God grant you His supernatural peace.'
                      : isPrivate
                        ? 'Pokok doa rahasia Anda telah diteruskan ke tim pastoral. Kami berdoa agar kasih Tuhan melingkupi Anda.'
                        : 'Pokok doa Anda telah diterbitkan di dinding doa jemaat. Kiranya damai sejahtera Tuhan menyertai Anda.'}
                  </p>
                  <button
                    onClick={handleCloseModal}
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
