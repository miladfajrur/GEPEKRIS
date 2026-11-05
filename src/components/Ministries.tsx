import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CheckCircle2, X, Pencil } from 'lucide-react';
import { useChurchContent, DEFAULT_ADDITIONAL_MINISTRIES } from '../context/ChurchContentContext';

export function Ministries() {
  const [selectedMinistry, setSelectedMinistry] = useState<{
    title: string;
    description?: string;
    schedule?: string;
    location?: string;
  } | null>(null);
  const { content, isAdmin, openAdminAtTab } = useChurchContent();

  const additionalMinistries =
    content.additionalMinistries && content.additionalMinistries.length > 0
      ? content.additionalMinistries
      : DEFAULT_ADDITIONAL_MINISTRIES;

  return (
    <section id="ministries" className="py-16 bg-gray-50 border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {isAdmin && (
            <div className="mb-3">
              <button
                onClick={() => openAdminAtTab('ministries')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm cursor-pointer transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Komisi & Pelayanan</span>
              </button>
            </div>
          )}

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Pelayanan & Komisi Gereja
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Wadah bertumbuh dalam iman, melayani sesama, dan mempererat persekutuan kasih di {content.info.name}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {content.ministries.map((ministry) => (
            <Card key={ministry.id || ministry.title} className="overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col justify-between">
              <div>
                <div className="h-48 overflow-hidden">
                  <ImageWithFallback
                    src={ministry.image}
                    alt={ministry.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{ministry.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{ministry.description}</p>
                  <ul className="space-y-2 mb-6">
                    {ministry.features.map((feature) => (
                      <li key={feature} className="text-sm text-gray-500 flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3 shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>

              <div className="px-6 pb-6 pt-0">
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={() =>
                    setSelectedMinistry({
                      title: ministry.title,
                      description: ministry.description,
                    })
                  }
                >
                  Informasi Lengkap
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Ministries (Dynamic from Firestore / Context) */}
        <div className="bg-white rounded-xl p-8 shadow-xs border border-gray-200/80">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-8">
            <h3 className="text-2xl font-semibold text-center sm:text-left text-gray-900">
              Komisi & Pelayanan Lainnya
            </h3>
            {isAdmin && (
              <button
                onClick={() => openAdminAtTab('ministries')}
                className="text-xs font-semibold text-amber-800 hover:text-amber-900 underline underline-offset-4 cursor-pointer flex items-center gap-1"
              >
                <Pencil className="w-3 h-3" />
                <span>Kelola Komisi Lainnya</span>
              </button>
            )}
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {additionalMinistries.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl hover:bg-amber-50/50 border border-transparent hover:border-amber-200/70 transition-all cursor-pointer"
                onClick={() =>
                  setSelectedMinistry({
                    title: item.title,
                    description: item.description,
                    schedule: item.schedule,
                    location: item.location,
                  })
                }
              >
                <h4 className="font-semibold mb-1.5 text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ministry Learn More Dialog */}
        {selectedMinistry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border shadow-xl relative">
              <button
                onClick={() => setSelectedMinistry(null)}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedMinistry.title}</h3>
              {selectedMinistry.description && (
                <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                  {selectedMinistry.description}
                </p>
              )}
              <p className="text-gray-600 text-xs mb-4 leading-relaxed">
                Terima kasih atas minat dan kerinduan Anda dalam pelayanan {selectedMinistry.title}! Anda dapat bergabung atau menghubungi koordinator komisi melalui sekretariat gereja.
              </p>
              <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 space-y-1 mb-5">
                <div>
                  Jadwal Kegiatan: <strong>{selectedMinistry.schedule || 'Rutin Setiap Pekan / Bulan'}</strong>
                </div>
                <div>
                  Lokasi: <strong>{selectedMinistry.location || 'Gedung GEPEKRIS Tretes & Rumah Jemaat'}</strong>
                </div>
              </div>
              <Button
                className="w-full cursor-pointer"
                onClick={() => setSelectedMinistry(null)}
              >
                Tutup
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
