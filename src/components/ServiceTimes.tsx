import { motion } from 'motion/react';
import { Clock, Calendar, Users, MapPin, ArrowRight, Pencil } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useChurchContent } from '../context/ChurchContentContext';

export function ServiceTimes() {
  const { content, isAdmin, openAdminAtTab } = useChurchContent();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calendar':
        return Calendar;
      case 'Users':
        return Users;
      case 'Clock':
      default:
        return Clock;
    }
  };

  return (
    <section id="services" className="py-20 bg-[#FAF8F5] border-b border-stone-200/80 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 relative"
        >
          {isAdmin && (
            <div className="mb-4">
              <button
                onClick={() => openAdminAtTab('services')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm cursor-pointer transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Jadwal Ibadah</span>
              </button>
            </div>
          )}

          <div className="text-xs uppercase tracking-widest font-semibold text-amber-800/90 mb-3">
            Waktu Ibadah & Persekutuan
          </div>
          <h2 className="font-serif-display text-3xl md:text-5xl font-medium text-stone-900 mb-4 tracking-tight">
            Jadwal Ibadah {content.info.name}
          </h2>
          <p className="text-base md:text-lg text-stone-600 max-w-2xl mx-auto font-light leading-relaxed">
            Mari bersekutu bersama kami dan alami kehangatan kasih Kristus dalam keluarga rohani
          </p>
        </motion.div>

        {/* Service Cards with Staggered Scroll Entrance & Hover Lift */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {(content.services || []).map((service, index) => {
            const IconComponent = getIcon(service.iconName || 'Clock');
            const displayTimes = Array.isArray(service.times)
              ? service.times.join(' & ')
              : typeof service.times === 'string'
              ? service.times
              : (service as any)?.time
              ? `${(service as any)?.day ? (service as any).day + ' ' : ''}${(service as any).time}`
              : 'Minggu 07:30 WIB';

            return (
              <motion.div
                key={service.id || service.name}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="h-full"
              >
                <Card className="h-full text-center hover:shadow-xl transition-all duration-300 bg-white border border-stone-200/90 rounded-2xl overflow-hidden group">
                  <div className="h-1 w-full bg-amber-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardContent className="p-7 flex flex-col items-center h-full justify-between">
                    <div className="w-full">
                      <div className="mb-5 inline-flex p-3.5 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200/60 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300 shadow-2xs">
                        <IconComponent className="h-7 w-7 transition-transform duration-300 group-hover:scale-105" />
                      </div>
                      <h3 className="font-serif-display text-xl font-semibold text-stone-900 mb-2.5 tracking-tight">
                        {service.name}
                      </h3>
                      <div className="inline-block px-3.5 py-1.5 rounded-lg bg-stone-100 text-stone-800 font-mono text-sm sm:text-base font-medium mb-4 border border-stone-200/80">
                        {displayTimes}
                      </div>
                      <p className="text-stone-600 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Location Info Banner with Institutional Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-stone-900 text-stone-100 rounded-2xl p-8 sm:p-10 shadow-lg border border-stone-800 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-stone-800 text-amber-300 border border-stone-700 flex items-center justify-center shrink-0 shadow-inner">
                <MapPin className="h-7 w-7 text-amber-400" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest font-semibold text-amber-400/90 mb-1">
                  Gedung Gereja & Tempat Ibadah
                </div>
                <h3 className="font-serif-display text-xl sm:text-2xl font-medium text-white mb-1.5">
                  Lokasi {content.info.name}
                </h3>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
                  {content.info.address}
                </p>
              </div>
            </div>
            <div className="w-full md:w-auto text-left md:text-right pt-4 md:pt-0 border-t md:border-t-0 border-stone-800">
              <p className="text-xs text-stone-400 mb-2 font-medium">Navigasi peta & petunjuk arah:</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.info.address)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-semibold transition-all shadow-md"
              >
                <span>Buka Rute Google Maps</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
