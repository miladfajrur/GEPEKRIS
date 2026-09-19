import { motion } from 'motion/react';
import { Clock, Calendar, Users, MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useChurchContent } from '../context/ChurchContentContext';

export function ServiceTimes() {
  const { content } = useChurchContent();

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
    <section id="services" className="py-20 bg-gradient-to-b from-stone-50 via-gray-50 to-stone-100/70 border-b border-gray-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Scroll-triggered Fade & Slide In */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-3 tracking-wide uppercase">
            <Clock className="w-3.5 h-3.5" />
            <span>Jadwal Ibadah & Komunitas</span>
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Jadwal Ibadah GEPEKRIS Tretes
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
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
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="h-full"
              >
                <Card className="h-full text-center hover:shadow-xl transition-all duration-300 bg-white border border-gray-200/90 rounded-2xl overflow-hidden group">
                  <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-primary to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardContent className="p-7 flex flex-col items-center h-full justify-between">
                    <div className="w-full">
                      <div className="mb-5 inline-flex p-3.5 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-2xs">
                        <IconComponent className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
                        {service.name}
                      </h3>
                      <div className="inline-block px-3 py-1 rounded-lg bg-amber-50 text-amber-900 font-bold text-base sm:text-lg mb-4 border border-amber-200/70">
                        {displayTimes}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Location Info Banner with Scroll Slide-Up */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow border border-gray-200/80 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 shadow-2xs">
                <MapPin className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Lokasi Gedung Gereja & Tempat Ibadah
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl">
                  {content.info.address}
                </p>
              </div>
            </div>
            <div className="w-full md:w-auto text-left md:text-right pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
              <p className="text-xs text-gray-500 mb-2 font-medium">Petunjuk arah & navigasi peta Google Maps:</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.info.address)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 text-sm font-semibold transition-transform hover:scale-105 active:scale-95 shadow-xs"
              >
                <span>Buka Rute di Google Maps</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
