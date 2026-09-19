import React, { useState } from 'react';
import { Language, GivingPledge } from '../types';
import { Heart, QrCode, CreditCard, Landmark, Check, Copy, Shield, Sparkles, FileText, X } from 'lucide-react';

interface GivingSectionProps {
  language: Language;
}

export const GivingSection: React.FC<GivingSectionProps> = ({ language }) => {
  const [selectedFund, setSelectedFund] = useState('tithe');
  const [selectedAmount, setSelectedAmount] = useState<number>(250000);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank_transfer' | 'credit_card'>('qris');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  
  // Modals & Feedback
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [receiptPledge, setReceiptPledge] = useState<GivingPledge | null>(null);

  const presetAmounts = [50000, 100000, 250000, 500000, 1000000];

  const funds = [
    {
      id: 'tithe',
      name: language === 'en' ? 'General Ministry & Tithe' : 'Perpuluhan & Kas Pelayanan',
      desc: language === 'en' ? 'Sustaining worship services, pastoral care, and daily church operations.' : 'Mendukung operasional ibadah, pemeliharaan jemaat, dan kelangsungan gereja.',
    },
    {
      id: 'outreach',
      name: language === 'en' ? 'Community Care & Diakonia' : 'Pelayanan Diakonia & Kasih',
      desc: language === 'en' ? 'Feeding families in need, free medical clinics, and crisis relief assistance.' : 'Paket sembako, pengobatan gratis kaum pra-sejahtera, dan bantuan bencana.',
    },
    {
      id: 'building',
      name: language === 'en' ? 'Building & Sanctuary Fund' : 'Dana Pengembangan Gedung',
      desc: language === 'en' ? 'Upgrading facilities, youth auditorium acoustics, and classroom spaces.' : 'Perluasan ruang ibadah pemuda, fasilitas anak, dan pemeliharaan gedung.',
    },
    {
      id: 'missions',
      name: language === 'en' ? 'Missions & Church Planting' : 'Misi & Perintisan Jemaat',
      desc: language === 'en' ? 'Supporting remote pastors and education in underserved regional areas.' : 'Mendukung hamba Tuhan di pelosok desa dan pendidikan anak asuh.',
    },
  ];

  const handleCopyAccount = (bankName: string, accNumber: string) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedBank(bankName);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  const finalAmount = customAmount ? parseInt(customAmount.replace(/\D/g, ''), 10) || 0 : selectedAmount;

  const handleProceedGiving = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount <= 0) return;

    const currentFundObj = funds.find((f) => f.id === selectedFund);
    const pledge: GivingPledge = {
      id: `give-${Date.now()}`,
      donorName: donorName.trim() || (language === 'en' ? 'Faithful Partner' : 'Sahabat Seiman'),
      amount: finalAmount,
      currency: 'IDR',
      fund: currentFundObj ? currentFundObj.name : 'General Fund',
      frequency,
      paymentMethod,
      date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      receiptNumber: `GC-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setReceiptPledge(pledge);
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <section id="give" className="py-16 md:py-24 bg-[#FAF8F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full">
            {language === 'en' ? 'Stewardship & Generosity' : 'Persembahan & Kemurahan Hati'}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-serif-display font-bold text-stone-900">
            {language === 'en' ? 'Giving with a Joyful Heart' : 'Memberi dengan Sukacita'}
          </h2>
          <p className="mt-3 text-stone-600 text-base sm:text-lg">
            {language === 'en'
              ? '“Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.” — 2 Cor 9:7'
              : '“Hendaklah masing-masing memberikan menurut kerelaan hatinya, jangan dengan sedih hati atau karena paksaan, sebab Allah mengasihi orang yang memberi dengan sukacita.” — 2 Kor 9:7'}
          </p>
        </div>

        {/* Giving Card Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Panel: Theological clarity & Fund descriptions */}
          <div className="md:col-span-5 bg-stone-900 text-stone-100 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-4">
                <Shield className="w-3.5 h-3.5" />
                <span>{language === 'en' ? '100% Transparent Financials' : 'Akuntabel & Transparan'}</span>
              </div>

              <h3 className="font-serif-display text-2xl font-bold text-white mb-3">
                {language === 'en' ? 'Where Your Gift Goes' : 'Alokasi Persembahan'}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed mb-6">
                {language === 'en'
                  ? 'Your tithes and offerings directly transform lives through hospital care, community nourishment, and uplifting weekly worship.'
                  : 'Setiap persembahan dikelola dengan penuh tanggung jawab dan integritas untuk memberkati jemaat serta masyarakat luas.'}
              </p>

              <div className="space-y-3">
                {funds.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFund(f.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedFund === f.id
                        ? 'bg-stone-800 border-amber-500/60 ring-1 ring-amber-500/40'
                        : 'bg-stone-900/60 border-stone-800 hover:bg-stone-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-200">{f.name}</span>
                      {selectedFund === f.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1 leading-snug">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-stone-800 text-[11px] text-stone-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {language === 'en'
                  ? 'Annual financial audit reports are published for our church family.'
                  : 'Laporan keuangan diaudit secara independen demi keterbukaan jemaat.'}
              </span>
            </div>
          </div>

          {/* Right Panel: Interactive Giving Form */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <form onSubmit={handleProceedGiving} className="space-y-6">
              
              {/* Frequency toggle */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  {language === 'en' ? 'Giving Frequency' : 'Frekuensi Persembahan'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFrequency('one-time')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      frequency === 'one-time'
                        ? 'bg-amber-100/80 border-amber-700 text-amber-950 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {language === 'en' ? 'One-Time Offering' : 'Satu Kali (Persembahan)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('monthly')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      frequency === 'monthly'
                        ? 'bg-amber-100/80 border-amber-700 text-amber-950 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {language === 'en' ? 'Monthly Commitment' : 'Komitmen Bulanan'}
                  </button>
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  {language === 'en' ? 'Select or Enter Amount (IDR)' : 'Pilih atau Masukkan Nominal (Rp)'}
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2.5">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {formatIDR(amt)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAmount(0);
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                      customAmount || selectedAmount === 0
                        ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {language === 'en' ? 'Custom' : 'Lainnya'}
                  </button>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">Rp</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(0);
                    }}
                    placeholder={language === 'en' ? 'Enter custom amount...' : 'Masukkan nominal khusus...'}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  {language === 'en' ? 'Payment Method' : 'Metode Pembayaran'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qris')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'qris'
                        ? 'bg-amber-50 border-amber-700 text-amber-900 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-amber-800" />
                    <span className="text-[11px]">QRIS / E-Wallet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'bank_transfer'
                        ? 'bg-amber-50 border-amber-700 text-amber-900 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Landmark className="w-4 h-4 text-amber-800" />
                    <span className="text-[11px]">Bank Transfer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'credit_card'
                        ? 'bg-amber-50 border-amber-700 text-amber-900 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-amber-800" />
                    <span className="text-[11px]">Card / Debit</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Payment Method View */}
              {paymentMethod === 'bank_transfer' && (
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-stone-200">
                    <div>
                      <span className="font-bold text-stone-800">BCA (Bank Central Asia)</span>
                      <div className="text-stone-600 font-mono text-xs">882-019-4821</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyAccount('BCA', '8820194821')}
                      className="px-2 py-1 text-[11px] font-semibold text-amber-800 hover:bg-amber-50 rounded flex items-center gap-1 cursor-pointer"
                    >
                      {copiedBank === 'BCA' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBank === 'BCA' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-stone-200">
                    <div>
                      <span className="font-bold text-stone-800">Bank Mandiri</span>
                      <div className="text-stone-600 font-mono text-xs">123-00-984712-3</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyAccount('Mandiri', '123009847123')}
                      className="px-2 py-1 text-[11px] font-semibold text-amber-800 hover:bg-amber-50 rounded flex items-center gap-1 cursor-pointer"
                    >
                      {copiedBank === 'Mandiri' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBank === 'Mandiri' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    a.n. <strong>GEPEKRIS Tretes</strong>
                  </div>
                </div>
              )}

              {paymentMethod === 'qris' && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                  <div className="w-28 h-28 bg-white p-2 rounded-xl border border-stone-300 mx-auto mb-2 flex items-center justify-center shadow-xs">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GEPEKRIS-TRETES-PERSEMBAHAN"
                      alt="QRIS Giving Code GEPEKRIS Tretes"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-stone-600 font-medium">
                    {language === 'en'
                      ? 'Scan with any Indonesian banking app (BCA, Mandiri, BRI, CIMB) or GoPay / OVO / Dana'
                      : 'Scan menggunakan BCA Mobile, Mandiri Livin, GoPay, OVO, Dana, atau ShopeePay'}
                  </p>
                </div>
              )}

              {/* Donor info fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'en' ? 'Donor Name (Optional)' : 'Nama Pemberi (Opsional)'}
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder={language === 'en' ? 'Leave blank for anonymous' : 'Kosongkan jika ingin anonim'}
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'en' ? 'Email for E-Receipt' : 'Email untuk Bukti Tanda Terima'}
                  </label>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="give-confirm-btn"
                className="w-full py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-sm hover:shadow transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-amber-200 text-amber-200" />
                <span>
                  {language === 'en'
                    ? `Confirm Giving of ${formatIDR(finalAmount)}`
                    : `Konfirmasi Persembahan ${formatIDR(finalAmount)}`}
                </span>
              </button>
            </form>
          </div>

        </div>

        {/* Digital Offering Receipt Modal */}
        {receiptPledge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-2xl p-6 sm:p-8 relative">
              <button
                onClick={() => setReceiptPledge(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                  {language === 'en' ? 'Offering Receipt' : 'Tanda Terima Persembahan'}
                </h3>
                <p className="text-xs text-stone-500 font-mono mt-1">
                  No: {receiptPledge.receiptNumber} • {receiptPledge.date}
                </p>
              </div>

              {/* Receipt details card */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-dashed border-stone-300 space-y-3 text-xs mb-6">
                <div className="flex justify-between">
                  <span className="text-stone-500">{language === 'en' ? 'Donor:' : 'Pemberi:'}</span>
                  <span className="font-bold text-stone-900">{receiptPledge.donorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{language === 'en' ? 'Designation:' : 'Alokasi Dana:'}</span>
                  <span className="font-bold text-stone-900">{receiptPledge.fund}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{language === 'en' ? 'Method:' : 'Metode:'}</span>
                  <span className="font-medium text-stone-800 uppercase">{receiptPledge.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{language === 'en' ? 'Type:' : 'Jenis:'}</span>
                  <span className="font-medium text-stone-800 capitalize">{receiptPledge.frequency}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                  <span className="font-bold text-stone-800 text-sm">{language === 'en' ? 'Total Amount:' : 'Jumlah Total:'}</span>
                  <span className="font-bold text-amber-900 text-base">{formatIDR(receiptPledge.amount)}</span>
                </div>
              </div>

              <p className="text-center text-xs text-stone-600 italic mb-6">
                {language === 'en'
                  ? '“May the Lord bless your faithfulness and multiply seed for sowing.”'
                  : '“Kiranya Tuhan memberkati kesetiaan Anda dan melipatgandakan benih yang Anda tabur.”'}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    alert(language === 'en' ? 'Receipt copied / downloaded.' : 'Tanda terima telah disimpan.');
                    setReceiptPledge(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  {language === 'en' ? 'Save / Print Receipt' : 'Simpan Tanda Terima'}
                </button>
                <button
                  onClick={() => setReceiptPledge(null)}
                  className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-medium transition-colors cursor-pointer"
                >
                  {language === 'en' ? 'Close' : 'Tutup'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
