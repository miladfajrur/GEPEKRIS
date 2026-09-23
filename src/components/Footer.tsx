import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Heart,
  Lock,
  Pencil,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { useChurchContent } from '../context/ChurchContentContext';

interface FooterProps {
  onPlanVisit?: () => void;
  onOpenGive?: () => void;
  onOpenPrayer?: () => void;
  onOpenSermons?: () => void;
  onOpenAdmin?: () => void;
  onOpenAdminLogin?: () => void;
}

export function Footer({ 
  onPlanVisit, 
  onOpenGive, 
  onOpenPrayer, 
  onOpenSermons, 
  onOpenAdmin,
  onOpenAdminLogin 
}: FooterProps) {
  const { content, isAdmin, logoutAdmin, clearCacheAndStartFresh } = useChurchContent();

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4 tracking-tight">{content.info.name}</h3>
            <p className="text-gray-300 mb-4 max-w-md text-sm leading-relaxed">
              {content.info.tagline}
            </p>
            <div className="text-gray-300 space-y-1 text-sm">
              <p>{content.info.address}</p>
              <p>{content.info.phone}</p>
              <p>{content.info.email}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-200">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-white transition-colors">
                  Service Times
                </a>
              </li>
              <li>
                <a href="#ministries" className="text-gray-300 hover:text-white transition-colors">
                  Ministries
                </a>
              </li>
              <li>
                <a href="#events" className="text-gray-300 hover:text-white transition-colors">
                  Warta & Berita
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-gray-300 hover:text-white transition-colors">
                  Galeri Dokumentasi
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              {onOpenGive && (
                <li>
                  <button
                    onClick={onOpenGive}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Give Online
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-200">Resources</h4>
            <ul className="space-y-2 text-sm">
              {onOpenSermons && (
                <li>
                  <button
                    onClick={onOpenSermons}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Sermons & Media
                  </button>
                </li>
              )}
              {onOpenPrayer && (
                <li>
                  <button
                    onClick={onOpenPrayer}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Prayer Requests
                  </button>
                </li>
              )}
              {onPlanVisit && (
                <li>
                  <button
                    onClick={onPlanVisit}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Plan Your Visit
                  </button>
                </li>
              )}
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                  Volunteer
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                  Staff Directory
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Service Times */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-sm">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg bg-gray-800"
                      aria-label={social.name}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="text-center md:text-right text-sm">
              <h4 className="font-semibold mb-1 text-gray-200">Sunday Worship</h4>
              <p className="text-gray-300">{content.hero.sundayNoteTimes}</p>
            </div>
          </div>
        </div>

        {/* Copyright & Subtle Small Admin Trigger */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-gray-400 text-xs flex items-center justify-center sm:justify-start">
            <span>&copy; {new Date().getFullYear()} {content.info.name}. Hak cipta dilindungi.</span>
            <Heart className="h-3.5 w-3.5 mx-2 text-red-500 fill-red-500" />
            <span className="hidden sm:inline">Melayani dengan kasih untuk jemaat</span>
          </p>

          <div className="flex items-center gap-3">
            <p className="text-gray-500 text-[11px] hidden md:inline">
              Portal Resmi GEPEKRIS Tretes • Pasuruan, Jawa Timur
            </p>

            <span className="text-gray-700 hidden md:inline">•</span>

            {/* Small & Subtle Admin Access */}
            {isAdmin ? (
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-stone-900 border border-amber-500/30 text-[11px] text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="hover:text-amber-200 underline underline-offset-2 cursor-pointer font-medium flex items-center gap-1"
                >
                  <Pencil className="w-3 h-3" />
                  <span>CMS Editor</span>
                </button>
                <span className="text-stone-600">|</span>
                <button
                  type="button"
                  onClick={clearCacheAndStartFresh}
                  className="text-stone-400 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1"
                  title="Hapus Cache & Mulai Baru (Reload)"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span className="text-[10px]">Bersihkan Cache</span>
                </button>
                <span className="text-stone-600">|</span>
                <button
                  type="button"
                  onClick={logoutAdmin}
                  className="text-stone-400 hover:text-red-400 transition-colors cursor-pointer"
                  title="Keluar Admin"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 transition-colors text-[11px] cursor-pointer"
                title="Masuk Mode Admin"
                aria-label="Masuk Mode Admin"
              >
                <Lock className="w-3 h-3 text-gray-500" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
