import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { useChurchContent } from '../context/ChurchContentContext';

interface HeaderProps {
  onPlanVisit?: () => void;
  onOpenNews?: () => void;
}

export function Header({ onPlanVisit, onOpenNews }: HeaderProps) {
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
    <header className="bg-white shadow-xs sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#home" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs tracking-wider">
                {getInitials(content.info.name) || 'GC'}
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-primary tracking-tight truncate max-w-[200px] sm:max-w-none">
                {content.info.name}
              </h1>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-6 flex items-baseline space-x-5 lg:space-x-7">
              <a href="#home" className="text-gray-700 hover:text-primary px-2 py-2 text-sm font-medium transition-colors">
                Home
              </a>
              <a href="#about" className="text-gray-700 hover:text-primary px-2 py-2 text-sm font-medium transition-colors">
                About
              </a>
              <a href="#services" className="text-gray-700 hover:text-primary px-2 py-2 text-sm font-medium transition-colors">
                Services
              </a>
              <a href="#ministries" className="text-gray-700 hover:text-primary px-2 py-2 text-sm font-medium transition-colors">
                Ministries
              </a>
              <a href="#events" className="text-gray-700 hover:text-primary px-2 py-2 text-sm font-medium transition-colors">
                Warta & Berita
              </a>
              <a href="#contact" className="text-gray-700 hover:text-primary px-2 py-2 text-sm font-medium transition-colors">
                Contact
              </a>
            </div>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {onOpenNews && (
              <Button 
                variant="outline" 
                onClick={onOpenNews} 
                className="cursor-pointer text-xs" 
                size="sm"
              >
                Baca Warta
              </Button>
            )}
            <Button onClick={onPlanVisit} className="cursor-pointer" size="sm">
              Visit Us
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-hidden p-2 rounded-md"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-white border-t border-gray-100">
              <a
                href="#home"
                onClick={() => setIsOpen(false)}
                className="text-gray-900 hover:text-primary block px-3 py-2 rounded-md font-medium text-sm"
              >
                Home
              </a>
              <a
                href="#about"
                onClick={() => setIsOpen(false)}
                className="text-gray-900 hover:text-primary block px-3 py-2 rounded-md font-medium text-sm"
              >
                About
              </a>
              <a
                href="#services"
                onClick={() => setIsOpen(false)}
                className="text-gray-900 hover:text-primary block px-3 py-2 rounded-md font-medium text-sm"
              >
                Services
              </a>
              <a
                href="#ministries"
                onClick={() => setIsOpen(false)}
                className="text-gray-900 hover:text-primary block px-3 py-2 rounded-md font-medium text-sm"
              >
                Ministries
              </a>
              <a
                href="#events"
                onClick={() => setIsOpen(false)}
                className="text-gray-900 hover:text-primary block px-3 py-2 rounded-md font-medium text-sm"
              >
                Warta & Berita
              </a>
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="text-gray-900 hover:text-primary block px-3 py-2 rounded-md font-medium text-sm"
              >
                Contact
              </a>
              <div className="pt-3 flex flex-col gap-2">
                {onOpenNews && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      onOpenNews();
                    }}
                    className="w-full cursor-pointer text-xs"
                  >
                    Buka Halaman Warta (Blog)
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    onPlanVisit?.();
                  }}
                  className="w-full cursor-pointer"
                >
                  Visit Us
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
