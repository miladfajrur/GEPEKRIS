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
    <section id="ministries" className="py-20 bg-[#FAF8F5] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
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

          <div className="text-xs uppercase tracking-widest font-semibold text-amber-800/90 mb-2">
            Pelayanan & Wadah Rohani
          </div>
          <h2 className="font-serif-display text-3xl md:text-5xl font-medium text-stone-900 mb-4 tracking-tight">
            Pelayanan & Komisi Gereja
          </h2>
          <p className="text-base md:text-lg text-stone-600 max-w-2xl mx-auto font-light leading-relaxed">
            Wadah bertumbuh dalam iman, melayani sesama, dan mempererat persekutuan kasih di {content.info.name}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-14">
          {content.ministries.map((ministry) => (
            <Card
              key={ministry.id || ministry.title}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border border-stone-200/90 rounded-2xl flex flex-col justify-between group hover:border-amber-300"
            >
              <div>
                <div className="h-52 overflow-hidden relative">
                  <ImageWithFallback
                    src={ministry.image}
                    alt={ministry.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-60"></div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-serif-display text-xl font-semibold text-stone-900 mb-2.5 tracking-tight">
                    {ministry.title}
                  </h3>
                  <p className="text-stone-600 mb-4 text-sm leading-relaxed font-light">
                    {ministry.description}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {ministry.features.map((feature) => (
                      <li key={feature} className="text-xs sm:text-sm text-stone-600 flex items-center gap-2.5 font-light">
                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full shrink-0"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>

              <div className="px-6 pb-6 pt-0">
                <Button
                  variant="outline"
                  className="w-full cursor-pointer text-stone-800 border-stone-300 hover:bg-stone-50 hover:text-stone-950 rounded-xl text-xs sm:text-sm font-medium"
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
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-xs border border-stone-200/90">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8 pb-5 border-b border-stone-100">
            <div>
              <div className="text-xs uppercase tracking-widest font-semibold text-amber-800/80 mb-1">
                Keluarga Pelayanan
              </div>
              <h3 className="font-serif-display text-2xl font-medium text-stone-900">
                Komisi & Pelayanan Lainnya
              </h3>
            </div>
            {isAdmin && (
              <button
                onClick={() => openAdminAtTab('ministries')}
                className="text-xs font-semibold text-amber-800 hover:text-amber-900 underline underline-offset-4 cursor-pointer flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Kelola Komisi Lainnya</span>
              </button>
            )}
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {additionalMinistries.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl bg-[#FAF8F5] hover:bg-amber-50/70 border border-stone-200/70 hover:border-amber-300 transition-all cursor-pointer group"
                onClick={() =>
                  setSelectedMinistry({
                    title: item.title,
                    description: item.description,
                    schedule: item.schedule,
                    location: item.location,
                  })
                }
              >
                <h4 className="font-serif-display font-semibold mb-1.5 text-stone-900 group-hover:text-amber-900 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-600 line-clamp-2 font-light">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ministry Learn More Dialog */}
        {selectedMinistry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 border border-stone-200 shadow-2xl relative">
              <button
                onClick={() => setSelectedMinistry(null)}
                className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-900 border border-amber-200 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="font-serif-display text-2xl font-medium text-stone-900 mb-2">
                {selectedMinistry.title}
              </h3>
              {selectedMinistry.description && (
                <p className="text-stone-700 text-sm mb-3 leading-relaxed font-light">
                  {selectedMinistry.description}
                </p>
              )}
              <p className="text-stone-600 text-xs mb-4 leading-relaxed font-light">
                Terima kasih atas kerinduan Anda untuk bertumbuh dan melayani di {selectedMinistry.title}! Anda dapat bergabung atau menghubungi koordinator komisi melalui sekretariat gereja.
              </p>
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-700 space-y-1.5 mb-5 font-light">
                <div>
                  Jadwal Kegiatan: <strong className="font-semibold text-stone-900">{selectedMinistry.schedule || 'Rutin Setiap Pekan / Bulan'}</strong>
                </div>
                <div>
                  Lokasi: <strong className="font-semibold text-stone-900">{selectedMinistry.location || 'Gedung GEPEKRIS Tretes & Rumah Jemaat'}</strong>
                </div>
              </div>
              <Button
                className="w-full cursor-pointer bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm"
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
