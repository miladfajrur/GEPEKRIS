import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServiceTimes } from './components/ServiceTimes';
import { DailyVerseBanner } from './components/DailyVerseBanner';
import { About } from './components/About';
import { Ministries } from './components/Ministries';
import { Events } from './components/Events';
import { PhotoGallery } from './components/PhotoGallery';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { PlanVisitModal } from './components/PlanVisitModal';
import { SermonHub } from './components/SermonHub';
import { GivingSection } from './components/GivingSection';
import { PrayerWall } from './components/PrayerWall';
import { ContentManagerModal } from './components/admin/ContentManagerModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { MediaManagerModal } from './components/admin/MediaManagerModal';
import { NewsBlogReader } from './components/NewsBlogReader';
import {
  ChurchContentProvider,
  useChurchContent,
  formatYouTubeEmbedUrl,
} from './context/ChurchContentContext';
import { X, Pencil, LogOut, FolderOpen, Landmark, MessageCircle } from 'lucide-react';
import { Button } from './components/ui/button';
import {
  SEOHead,
  HelmetProvider,
  buildChurchSchema,
  buildArticleSchema,
  buildPrayerWallSchema,
  buildSermonArchiveSchema,
  buildGivingSchema,
} from './components/SEOHead';
import { SEOConfig, safeIsoDate } from './lib/seo';

function ChurchApp() {
  const {
    content,
    isAdmin,
    logoutAdmin,
    isAdminModalOpen,
    setIsAdminModalOpen,
    openAdminAtTab,
  } = useChurchContent();

  const [isPlanVisitOpen, setIsPlanVisitOpen] = useState(false);
  const [isWatchOnlineOpen, setIsWatchOnlineOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isMediaManagerOpen, setIsMediaManagerOpen] = useState(false);
  const [activeSpecialView, setActiveSpecialView] = useState<'none' | 'sermons' | 'give' | 'prayer'>('none');

  // Blog / 2-column news reader state
  const [isNewsReaderOpen, setIsNewsReaderOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Support hash routing: #admin, #media, #berita/:id, #events, #prayer, #sermons, #give, #live, #visit
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        if (isAdmin) {
          setIsAdminModalOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      } else if (hash === '#media') {
        if (isAdmin) {
          setIsMediaManagerOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      } else if (hash.startsWith('#berita/')) {
        const parts = hash.split('/');
        if (parts.length > 1 && parts[1]) {
          setSelectedArticleId(parts[1]);
          setIsNewsReaderOpen(true);
          setActiveSpecialView('none');
        }
      } else if (hash === '#berita') {
        setIsNewsReaderOpen(false);
        setActiveSpecialView('none');
        const el = document.getElementById('events');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (hash === '#prayer' || hash === '#doa') {
        setActiveSpecialView('prayer');
        setIsNewsReaderOpen(false);
      } else if (hash === '#sermons' || hash === '#khotbah') {
        setActiveSpecialView('sermons');
        setIsNewsReaderOpen(false);
      } else if (hash === '#give' || hash === '#persembahan') {
        setActiveSpecialView('give');
        setIsNewsReaderOpen(false);
      } else if (hash === '#live' || hash === '#streaming') {
        setIsWatchOnlineOpen(true);
      } else if (hash === '#visit' || hash === '#kunjungan') {
        setIsPlanVisitOpen(true);
      } else {
        setIsNewsReaderOpen(false);
        setActiveSpecialView('none');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isAdmin, setIsAdminModalOpen]);

  const handleOpenArticle = (id: string) => {
    setSelectedArticleId(id);
    setIsNewsReaderOpen(true);
    setActiveSpecialView('none');
    window.location.hash = `berita/${id}`;
  };

  const handleCloseNewsReader = () => {
    setIsNewsReaderOpen(false);
    if (window.location.hash.startsWith('#berita')) {
      history.replaceState(null, '', window.location.pathname);
    }
  };

  const handleOpenPrayer = () => {
    setActiveSpecialView('prayer');
    setIsNewsReaderOpen(false);
    window.location.hash = 'prayer';
    setTimeout(() => {
      document.getElementById('prayer-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleOpenSermons = () => {
    setActiveSpecialView('sermons');
    setIsNewsReaderOpen(false);
    window.location.hash = 'sermons';
    setTimeout(() => {
      document.getElementById('sermon-hub-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleOpenGive = () => {
    setActiveSpecialView('give');
    setIsNewsReaderOpen(false);
    window.location.hash = 'give';
    setTimeout(() => {
      document.getElementById('giving-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleCloseSpecialView = () => {
    setActiveSpecialView('none');
    if (['#prayer', '#doa', '#sermons', '#khotbah', '#give', '#persembahan'].includes(window.location.hash)) {
      history.replaceState(null, '', window.location.pathname);
    }
  };

  const handleOpenAdminTrigger = () => {
    if (isAdmin) {
      setIsAdminModalOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // Stealth keyboard shortcut: Ctrl + Shift + A (or Cmd + Shift + A) to open admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        if (isAdmin) {
          setIsAdminModalOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin, setIsAdminModalOpen]);

  // Construct canonical base URL
  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://gepekristretes.org/';

  // Compute active view SEO metadata dynamically
  let seoConfig: SEOConfig;

  if (isAdminModalOpen || isAdminLoginOpen) {
    seoConfig = {
      title: `Portal Admin & CMS Konten | ${content.info.name}`,
      description: 'Portal administratif pengelolaan warta, jadwal ibadah, galeri, dan media foto GEPEKRIS Tretes.',
      canonical: `${baseUrl}#admin`,
      noIndex: true,
    };
  } else if (isNewsReaderOpen) {
    const activeArticle = content.events.find((e) => e.id === selectedArticleId) || content.events[0];
    if (activeArticle) {
      const canonical = `${baseUrl}#berita/${activeArticle.id}`;
      const descSnippet = (activeArticle.description || activeArticle.content || 'Warta kegiatan dan kabar pelayanan GEPEKRIS Tretes.')
        .replace(/\s+/g, ' ')
        .slice(0, 155);

      seoConfig = {
        title: `${activeArticle.title} | Warta ${content.info.name}`,
        description: descSnippet,
        canonical,
        ogType: 'article',
        ogImage: activeArticle.image || content.hero.bgImage,
        author: activeArticle.author || `${content.info.name} Tim Media`,
        publishedTime: safeIsoDate(activeArticle.date),
        keywords: [
          activeArticle.title,
          'Warta GEPEKRIS',
          activeArticle.category,
          'Gereja Tretes Pasuruan',
          'Berita Kristen',
        ],
        schema: buildArticleSchema(activeArticle, canonical, content.info.name),
      };
    } else {
      const canonical = `${baseUrl}#berita`;
      seoConfig = {
        title: `Warta Kegiatan & Berita Jemaat | ${content.info.name}`,
        description: 'Daftar lengkap warta mingguan, artikel pembinaan, dan informasi kegiatan pelayanan jemaat GEPEKRIS Tretes.',
        canonical,
        ogType: 'website',
        ogImage: content.hero.bgImage,
        keywords: ['Warta Jemaat GEPEKRIS', 'Berita Gereja Tretes', 'Kegiatan Rohani Pasuruan'],
        schema: buildChurchSchema(content.info, content.services, content.hero.bgImage, canonical),
      };
    }
  } else if (activeSpecialView === 'prayer') {
    const canonical = `${baseUrl}#prayer`;
    seoConfig = {
      title: `Pokok Doa & Ruang Doa Jemaat | ${content.info.name}`,
      description: 'Layanan pokok doa syafaat, doa kesembuhan, dan permohonan doa bersama keluarga jemaat GEPEKRIS Tretes dalam kasih Kristus.',
      canonical,
      ogType: 'website',
      ogImage: content.hero.bgImage,
      keywords: ['Pokok Doa GEPEKRIS', 'Pokok Doa Kristen', 'Doa Syafaat Gereja', 'GEPEKRIS Tretes'],
      schema: buildPrayerWallSchema(canonical, content.info.name),
    };
  } else if (activeSpecialView === 'sermons') {
    const canonical = `${baseUrl}#sermons`;
    seoConfig = {
      title: `Arsip Khotbah & Renungan Firman Tuhan | ${content.info.name}`,
      description: 'Dengarkan rekaman khotbah Ibadah Raya Minggu, renungan firman Tuhan, dan seri pengajaran Alkitab jemaat GEPEKRIS Tretes.',
      canonical,
      ogType: 'website',
      ogImage: content.hero.bgImage,
      keywords: ['Khotbah GEPEKRIS Tretes', 'Renungan Firman Tuhan', 'Khotbah Minggu Kristen Pasuruan', 'Audio Khotbah'],
      schema: buildSermonArchiveSchema(canonical, content.info.name),
    };
  } else if (activeSpecialView === 'give') {
    const canonical = `${baseUrl}#give`;
    seoConfig = {
      title: `Persembahan & Persepuluhan Online | ${content.info.name}`,
      description: 'Informasi rekening resmi persembahan syukur, persepuluhan, dan diakonia untuk mendukung pelayanan jemaat GEPEKRIS Tretes.',
      canonical,
      ogType: 'website',
      ogImage: content.hero.bgImage,
      keywords: ['Persembahan Online GEPEKRIS', 'Persepuluhan Gereja Tretes', 'Donasi Pelayanan Kristen'],
      schema: buildGivingSchema(canonical, content.info.name),
    };
  } else if (isWatchOnlineOpen) {
    const canonical = `${baseUrl}#live`;
    seoConfig = {
      title: `Live Streaming Ibadah Raya Online | ${content.info.name}`,
      description: 'Saksikan siaran langsung Ibadah Raya Minggu dan kegiatan rohani GEPEKRIS Tretes secara live streaming melalui kanal YouTube resmi.',
      canonical,
      ogType: 'website',
      ogImage: content.hero.bgImage,
      keywords: ['Live Streaming Ibadah', 'Streaming GEPEKRIS Tretes', 'Ibadah Online Pasuruan'],
      schema: buildChurchSchema(content.info, content.services, content.hero.bgImage, canonical),
    };
  } else if (isPlanVisitOpen) {
    const canonical = `${baseUrl}#visit`;
    seoConfig = {
      title: `Rencanakan Kunjungan Ibadah | ${content.info.name}`,
      description: 'Selamat datang di GEPEKRIS Tretes. Panduan informasi jadwal ibadah, lokasi gereja, dan penyambutan bagi jemaat baru dan tamu.',
      canonical,
      ogType: 'website',
      ogImage: content.hero.bgImage,
      keywords: ['Kunjungan GEPEKRIS Tretes', 'Jadwal Ibadah Tretes', 'Gereja di Prigen Pasuruan'],
      schema: buildChurchSchema(content.info, content.services, content.hero.bgImage, canonical),
    };
  } else {
    const canonical = baseUrl;
    seoConfig = {
      title: `${content.info.name} - Gereja Persekutuan Kristen Tretes`,
      description: 'Website resmi Gereja Persekutuan Kristen (GEPEKRIS) Tretes, Prigen, Pasuruan - Jadwal Ibadah Raya, Warta Berita Jemaat, Komisi, dan Pelayanan Kasih.',
      canonical,
      ogType: 'website',
      ogImage: content.hero.bgImage,
      keywords: [
        'GEPEKRIS Tretes',
        'Gereja Persekutuan Kristen Tretes',
        'Gereja Kristen Tretes Prigen',
        'Jadwal Ibadah Minggu Tretes',
        'Gereja Pasuruan Jawa Timur',
        'Warta Jemaat GEPEKRIS',
        'Pelayanan Kristen Tretes',
      ],
      schema: buildChurchSchema(content.info, content.services, content.hero.bgImage, canonical),
    };
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/10 relative">
      <SEOHead {...seoConfig} />

      <Header 
        onPlanVisit={() => {
          setIsPlanVisitOpen(true);
          window.location.hash = 'visit';
        }}
        onGoHome={() => {
          setIsNewsReaderOpen(false);
          setActiveSpecialView('none');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenNews={() => {
          setIsNewsReaderOpen(false);
          const el = document.getElementById('events');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else if (content.events.length > 0) {
            handleOpenArticle(content.events[0].id);
          }
        }}
        onOpenSermons={handleOpenSermons}
        onOpenPrayer={handleOpenPrayer}
        onOpenGive={handleOpenGive}
      />
      
      {/* Permanent Regular Main Homepage */}
      <main className="flex-1">
        <Hero
          onPlanVisit={() => setIsPlanVisitOpen(true)}
          onWatchOnline={() => setIsWatchOnlineOpen(true)}
        />
        <ServiceTimes />
        <DailyVerseBanner />
        <About />
        <Ministries />
        <Events onReadArticle={(id) => handleOpenArticle(id)} />
        <PhotoGallery />
        <Contact />

        {/* Optional dedicated section drawers for Give, Prayer & Sermons */}
        {activeSpecialView === 'sermons' && (
          <div id="sermon-hub-section" className="border-t py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-stone-900">Koleksi Khotbah & Renungan Firman</h2>
              <Button variant="ghost" onClick={handleCloseSpecialView} className="cursor-pointer">
                Tutup
              </Button>
            </div>
            <SermonHub language="id" />
          </div>
        )}

        {activeSpecialView === 'give' && (
          <div id="giving-section" className="border-t py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-stone-900">Persembahan & Persepuluhan Online</h2>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAdminAtTab('giving')}
                    className="cursor-pointer border-amber-300 text-amber-900 hover:bg-amber-50 flex items-center gap-1.5 text-xs"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit Rekening & QRIS</span>
                  </Button>
                )}
                <Button variant="ghost" onClick={handleCloseSpecialView} className="cursor-pointer">
                  Tutup
                </Button>
              </div>
            </div>
            <GivingSection language="id" />
          </div>
        )}

        {activeSpecialView === 'prayer' && (
          <div id="prayer-section" className="border-t py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-stone-900">Ruang Doa Bersama Jemaat</h2>
              <Button variant="ghost" onClick={handleCloseSpecialView} className="cursor-pointer">
                Tutup
              </Button>
            </div>
            <PrayerWall language="id" />
          </div>
        )}
      </main>

      {/* 2-Column Blogspot-Style News & Article Reader Overlay */}
      {isNewsReaderOpen && (
        <NewsBlogReader
          events={content.events}
          selectedId={selectedArticleId}
          onClose={handleCloseNewsReader}
          onSelectEvent={(id) => {
            setSelectedArticleId(id);
            window.location.hash = `berita/${id}`;
          }}
          churchName={content.info.name}
        />
      )}

      <Footer
        onPlanVisit={() => {
          setIsPlanVisitOpen(true);
          window.location.hash = 'visit';
        }}
        onOpenGive={handleOpenGive}
        onOpenPrayer={handleOpenPrayer}
        onOpenSermons={handleOpenSermons}
        onOpenAdmin={handleOpenAdminTrigger}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* Content Manager CMS Modal (Admin Only) */}
      <ContentManagerModal
        isOpen={isAdminModalOpen && isAdmin}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* Standalone Media Manager Modal */}
      <MediaManagerModal
        isOpen={isMediaManagerOpen && isAdmin}
        onClose={() => setIsMediaManagerOpen(false)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => setIsAdminModalOpen(true)}
      />

      {/* Plan Your Visit VIP Modal */}
      <PlanVisitModal
        isOpen={isPlanVisitOpen}
        onClose={() => setIsPlanVisitOpen(false)}
        language="id"
      />

      {/* Watch Online Livestream Modal */}
      {isWatchOnlineOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border shadow-2xl relative">
            <button
              onClick={() => setIsWatchOnlineOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-between gap-2 mb-3 pr-8">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                Siaran Langsung & Rekaman Ibadah
              </span>
              {isAdmin && (
                <button
                  onClick={() => {
                    setIsWatchOnlineOpen(false);
                    openAdminAtTab('info');
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit Link Streaming</span>
                </button>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {content.info.streamTitle || 'Ibadah Raya Minggu Online'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {content.info.streamDescription ||
                'Mari beribadah bersama keluarga besar GEPEKRIS Tretes. Jika Anda terlewat siaran langsung, Anda dapat menyaksikan tayangan ibadah terakhir di bawah ini:'}
            </p>
            
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black mb-4 relative shadow-md">
              <iframe
                className="w-full h-full"
                src={formatYouTubeEmbedUrl(content.info.streamUrl)}
                title={content.info.streamTitle || 'Siaran Ibadah Gereja'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
              <p className="text-xs text-gray-500">
                Ingin mendengarkan khotbah minggu-minggu sebelumnya? Buka arsip khotbah kami.
              </p>
              <Button
                onClick={() => {
                  setIsWatchOnlineOpen(false);
                  handleOpenSermons();
                }}
                className="cursor-pointer"
              >
                Lihat Arsip Khotbah
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Admin Toolbar (Visible when logged in as Admin) */}
      {isAdmin && (
        <aside 
          aria-label="Admin Control Bar"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-stone-900/95 text-white px-3 sm:px-4 py-2 rounded-full shadow-2xl border border-amber-500/50 flex items-center gap-2 sm:gap-2.5 text-xs backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 max-w-[95vw] overflow-x-auto no-scrollbar"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 font-medium text-amber-300 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden sm:inline">Mode Admin Aktif</span>
            <span className="sm:hidden text-[11px]">Admin</span>
          </div>
          <div className="h-4 w-px bg-stone-700 shrink-0"></div>
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-3 sm:px-3.5 py-1.5 rounded-full cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0 text-xs"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Panel Konten</span>
          </button>
          <button
            onClick={() => openAdminAtTab('giving')}
            className="bg-stone-800 hover:bg-stone-700 text-amber-200 hover:text-white font-medium px-3 py-1.5 rounded-full cursor-pointer transition-colors flex items-center gap-1.5 border border-stone-700 shadow-xs whitespace-nowrap shrink-0 text-xs"
            title="Edit Rekening & QRIS Persembahan"
          >
            <Landmark className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Persembahan & QRIS</span>
            <span className="md:hidden">QRIS</span>
          </button>
          <button
            onClick={() => setIsMediaManagerOpen(true)}
            className="bg-stone-800 hover:bg-stone-700 text-amber-300 hover:text-white font-medium px-3 sm:px-3.5 py-1.5 rounded-full cursor-pointer transition-colors flex items-center gap-1.5 border border-stone-700 shadow-xs whitespace-nowrap shrink-0 text-xs"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pustaka Media</span>
            <span className="sm:hidden">Media</span>
          </button>
          <button
            onClick={logoutAdmin}
            className="text-stone-400 hover:text-white px-2 py-1 rounded-full cursor-pointer transition-colors flex items-center gap-1 shrink-0"
            title="Keluar Mode Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </aside>
      )}

      {/* Floating WhatsApp Quick-Contact Button (Bottom-Right) */}
      {!isNewsReaderOpen && (
        <a
          href={`https://api.whatsapp.com/send?phone=${(
            content.info.whatsappNumber ||
            content.info.phone ||
            '6281234567890'
          ).replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
            `Shalom Sekretariat ${content.info.name}, saya ingin bertanya mengenai informasi ibadah / pelayanan gereja.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hubungi Sekretariat via WhatsApp"
          className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-30 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-full shadow-lg border border-emerald-400/40 transition-all hover:scale-105"
          title="Hubungi Sekretariat Gereja via WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-white/10" />
          <span className="text-xs font-bold tracking-wide hidden sm:inline">
            Hubungi WA Gereja
          </span>
        </a>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ChurchContentProvider>
      <HelmetProvider>
        <ChurchApp />
      </HelmetProvider>
    </ChurchContentProvider>
  );
}
