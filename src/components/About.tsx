import { motion } from 'motion/react';
import { Heart, Users, Book, Star, Shield, Pencil } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useChurchContent } from '../context/ChurchContentContext';

export function About() {
  const { content, isAdmin, openAdminAtTab } = useChurchContent();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users':
        return Users;
      case 'Book':
        return Book;
      case 'Star':
        return Star;
      case 'Shield':
        return Shield;
      case 'Heart':
      default:
        return Heart;
    }
  };

  return (
    <section id="about" className="py-20 bg-white border-b border-stone-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 order-2 lg:order-1 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-200/90 group">
              <ImageWithFallback
                src={content.about.image}
                alt="Kebersamaan Jemaat"
                className="w-full h-[400px] sm:h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-transparent to-transparent"></div>
            </div>
            <p className="text-xs font-serif italic text-stone-500 mt-3 text-center">
              Persekutuan Kasih & Kebersamaan Jemaat GEPEKRIS Tretes
            </p>
          </motion.div>

          {/* Narrative Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 order-1 lg:order-2"
          >
            {isAdmin && (
              <div className="mb-4">
                <button
                  onClick={() => openAdminAtTab('about')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm cursor-pointer transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Bagian Tentang Kami</span>
                </button>
              </div>
            )}

            <div className="text-xs uppercase tracking-widest font-semibold text-amber-800/90 mb-2">
              Tentang Gereja Kami
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-medium text-stone-900 mb-6 tracking-tight leading-[1.2]">
              {content.about.heading}
            </h2>
            <p className="text-base sm:text-lg text-stone-700 mb-4 leading-relaxed font-light first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:text-amber-800 first-letter:float-left first-letter:mr-2.5 first-letter:mt-0.5">
              {content.about.paragraph1}
            </p>
            <p className="text-base sm:text-lg text-stone-600 mb-8 leading-relaxed font-light">
              {content.about.paragraph2}
            </p>

            {/* Values Grid */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {content.about.values.map((value) => {
                const IconComponent = getIcon(value.iconName);
                return (
                  <div
                    key={value.title}
                    className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/90 hover:border-amber-300 hover:shadow-xs transition-all duration-300"
                  >
                    <div className="mb-2.5 inline-flex p-2.5 rounded-xl bg-amber-100/70 text-amber-900 border border-amber-200/50">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif-display font-semibold text-stone-900 text-base mb-1">
                      {value.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
