import { Menu, X, BookOpen, Heart } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { useChurchContent } from '../context/ChurchContentContext';

interface HeaderProps {
  onPlanVisit?: () => void;
  onOpenNews?: () => void;
  onOpenSermons?: () => void;
  onOpenPrayer?: () => void;
  onOpenGive?: () => void;
  onGoHome?: () => void;
}

export function Header({
  onPlanVisit,
  onOpenNews,
  onOpenSermons,
  onOpenPrayer,
  onOpenGive,
  onGoHome,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { content } = useChurchContent();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-2xs sticky top-0 z-40 border-b border-amber-900/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <a
              href="#home"
              onClick={() => onGoHome?.()}
              className="flex-shrink-0 flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-stone-900 text-amber-200 flex items-center justify-center font-serif-display font-bold text-xs tracking-wider shadow-xs border border-amber-300/30 group-hover:bg-stone-800 transition-colors">
                {getInitials(content.info.name) || 'GT'}
              </div>
              <div className="flex flex-col">
                <h1 className="font-serif-display text-lg sm:text-xl font-bold text-stone-900 tracking-tight truncate max-w-[190px] sm:max-w-none leading-none">
                  {content.info.name}
                </h1>
                <span className="text-[10px] font-medium text-amber-800/80 tracking-wide hidden sm:inline mt-0.5">
                  Persekutuan & Pelayanan Kasih
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <div className="ml-4 flex items-center space-x-1 xl:space-x-2">
              <a
                href="#home"
                onClick={() => onGoHome?.()}
                className="text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors cursor-pointer"
              >
                Beranda
              </a>
              <a
                href="#about"
                className="text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors"
              >
                Tentang Kami
              </a>
              <a
                href="#services"
                className="text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors"
              >
                Jadwal Ibadah
              </a>
              <a
                href="#ministries"
                className="text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors"
              >
                Pelayanan
              </a>
              <a
                href="#events"
                className="text-stone-900 hover:text-amber-950 bg-amber-50/80 hover:bg-amber-100/70 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors flex items-center gap-1.5 border border-amber-200/70"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-800" />
                <span>Warta & Firman</span>
              </a>
              {onOpenSermons && (
                <button
                  onClick={onOpenSermons}
                  className="text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors cursor-pointer"
                >
                  Khotbah
                </button>
              )}
              {onOpenPrayer && (
                <button
                  onClick={onOpenPrayer}
                  className="text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors cursor-pointer"
                >
                  Pokok Doa
                </button>
              )}
              <a
                href="#gallery"
                className="text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors"
              >
                Galeri
              </a>
              <a
                href="#contact"
                className="text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors"
              >
                Kontak
              </a>
            </div>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {onOpenGive && (
              <Button
                variant="outline"
                onClick={onOpenGive}
                className="cursor-pointer text-xs border-stone-300 text-stone-800 hover:bg-stone-50 gap-1.5 rounded-xl"
                size="sm"
              >
                <Heart className="w-3.5 h-3.5 text-amber-700" />
                <span>Persembahan</span>
              </Button>
            )}
            {onOpenNews && (
              <Button
                variant="outline"
                onClick={onOpenNews}
                className="cursor-pointer text-xs border-stone-200 text-stone-700 hover:bg-stone-50 rounded-xl"
                size="sm"
              >
                Baca Warta
              </Button>
            )}
            <Button
              onClick={onPlanVisit}
              className="cursor-pointer shadow-xs bg-stone-900 hover:bg-stone-800 text-amber-200 rounded-xl text-xs font-semibold"
              size="sm"
            >
              Rencana Kunjungan
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-700 hover:text-stone-950 hover:bg-stone-100 focus:outline-hidden p-2.5 rounded-xl cursor-pointer"
              aria-label="Buka Menu Navigasi"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation (Solid surface per R-10, >=44px touch targets) */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-5 space-y-1 sm:px-3 bg-white border-t border-stone-200">
              <a
                href="#home"
                onClick={() => {
                  setIsOpen(false);
                  onGoHome?.();
                }}
                className="text-stone-900 hover:bg-stone-100 block px-3.5 py-3 rounded-xl font-medium text-sm cursor-pointer"
              >
                Beranda
              </a>
              <a
                href="#about"
                onClick={() => setIsOpen(false)}
                className="text-stone-900 hover:bg-stone-100 block px-3.5 py-3 rounded-xl font-medium text-sm"
              >
                Tentang Kami
              </a>
              <a
                href="#services"
                onClick={() => setIsOpen(false)}
                className="text-stone-900 hover:bg-stone-100 block px-3.5 py-3 rounded-xl font-medium text-sm"
              >
                Jadwal Ibadah
              </a>
              <a
                href="#ministries"
                onClick={() => setIsOpen(false)}
                className="text-stone-900 hover:bg-stone-100 block px-3.5 py-3 rounded-xl font-medium text-sm"
              >
                Pelayanan
              </a>
              <a
                href="#events"
                onClick={() => setIsOpen(false)}
                className="text-amber-950 bg-amber-50/90 hover:bg-amber-100 block px-3.5 py-3 rounded-xl font-semibold text-sm"
              >
                Warta & Tulisan Firman Tuhan
              </a>
              {onOpenSermons && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenSermons();
                  }}
                  className="text-stone-900 hover:bg-stone-100 block w-full text-left px-3.5 py-3 rounded-xl font-medium text-sm cursor-pointer"
                >
                  Khotbah & Renungan Audio
                </button>
              )}
              {onOpenPrayer && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenPrayer();
                  }}
                  className="text-stone-900 hover:bg-stone-100 block w-full text-left px-3.5 py-3 rounded-xl font-medium text-sm cursor-pointer"
                >
                  Ruang Pokok Doa Jemaat
                </button>
              )}
              {onOpenGive && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenGive();
                  }}
                  className="text-stone-900 hover:bg-stone-100 block w-full text-left px-3.5 py-3 rounded-xl font-medium text-sm cursor-pointer"
                >
                  Persembahan & QRIS Online
                </button>
              )}
              <a
                href="#gallery"
                onClick={() => setIsOpen(false)}
                className="text-stone-900 hover:bg-stone-100 block px-3.5 py-3 rounded-xl font-medium text-sm"
              >
                Galeri Foto
              </a>
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="text-stone-900 hover:bg-stone-100 block px-3.5 py-3 rounded-xl font-medium text-sm"
              >
                Kontak
              </a>
              <div className="pt-3 flex flex-col gap-2.5">
                {onOpenNews && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenNews();
                    }}
                    className="w-full cursor-pointer text-xs py-3 rounded-xl border-stone-300"
                  >
                    Buka Ruang Warta & Renungan
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    onPlanVisit?.();
                  }}
                  className="w-full cursor-pointer py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-200 font-semibold"
                >
                  Rencana Kunjungan
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
