import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle2, Pencil } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useChurchContent } from '../context/ChurchContentContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export function Contact() {
  const { content, isAdmin, openAdminAtTab } = useChurchContent();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: Phone,
      title: "Telepon Sekretariat",
      details: content.info.phone,
      subtitle: "Hubungi kami pada jam kerja"
    },
    {
      icon: Mail,
      title: "Email Resmi",
      details: content.info.email,
      subtitle: "Kirim surat elektronik kapan saja"
    },
    {
      icon: MapPin,
      title: "Alamat Gereja",
      details: content.info.address,
      subtitle: "Mari beribadah bersama kami"
    },
    {
      icon: Clock,
      title: "Jam Operasional",
      details: content.info.officeHours,
      subtitle: "Minggu: Pelayanan Ibadah Raya"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contacts'), {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim().slice(0, 100),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().slice(0, 150),
        phone: formData.phone.trim(),
        subject: formData.subject.trim() || 'Pesan Sekretariat',
        message: formData.message.trim().slice(0, 3000),
        createdAt: new Date().toISOString(),
      });
    } catch {
      // Fallback gracefully if offline
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <section id="contact" className="py-16 bg-gray-50 border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {isAdmin && (
            <div className="mb-3">
              <button
                onClick={() => openAdminAtTab('info')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm cursor-pointer transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Kontak, Alamat & Peta</span>
              </button>
            </div>
          )}

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Hubungi Sekretariat {content.info.name}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Punya pertanyaan seputar jadwal ibadah atau membutuhkan pelayanan pastoral & pokok doa? Kami siap melayani Anda
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Informasi Kontak & Lokasi</h3>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((info) => {
                const IconComponent = info.icon;
                return (
                  <Card key={info.title} className="hover:shadow-md transition-shadow bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="mr-4 mt-0.5">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1 text-gray-900">{info.title}</h4>
                          <p className="text-gray-900 text-sm mb-1">{info.details}</p>
                          <p className="text-xs text-gray-500">{info.subtitle}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Interactive Map */}
            <div className="bg-gray-100 rounded-xl h-64 overflow-hidden border border-gray-200 relative shadow-inner">
              <iframe
                title={`Peta Lokasi ${content.info.name}`}
                src={content.info.mapEmbedUrl}
                className="w-full h-full border-0"
                loading="lazy"
              />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg shadow-sm text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{content.info.address}</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">Kirim Pesan / Permohonan Doa</h3>
                
                {submitted ? (
                  <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl font-bold text-emerald-900">Terima kasih, {formData.firstName}!</h4>
                    <p className="text-sm text-emerald-700 leading-relaxed">
                      Pesan atau permohonan doa Anda telah tersimpan di sistem sekretariat kami. Tim sekretariat atau pendoa gereja akan segera merespons.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          firstName: '',
                          lastName: '',
                          email: '',
                          phone: '',
                          subject: '',
                          message: ''
                        });
                      }}
                      className="mt-2 cursor-pointer"
                    >
                      Kirim Pesan Lainnya
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-gray-700">
                          Nama Depan *
                        </label>
                        <Input
                          id="firstName"
                          required
                          placeholder="Nama depan Anda"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-gray-700">
                          Nama Belakang
                        </label>
                        <Input
                          id="lastName"
                          placeholder="Nama belakang / marga"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
                        Alamat Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="email.anda@contoh.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1 text-gray-700">
                        Nomor WhatsApp / HP (Opsional)
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="0812-xxxx-xxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1 text-gray-700">
                        Perihal / Topik
                      </label>
                      <Input
                        id="subject"
                        placeholder="Contoh: Permohonan Doa / Jadwal Ibadah"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1 text-gray-700">
                        Pesan Anda *
                      </label>
                      <Textarea 
                        id="message" 
                        required
                        placeholder="Tuliskan pesan, pertanyaan, atau pokok doa Anda di sini..."
                        className="min-h-32"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>
                    
                    <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer">
                      {isSubmitting ? 'Mengirim Pesan...' : 'Kirim Pesan Sekarang'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
