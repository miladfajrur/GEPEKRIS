import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServiceTimes } from './components/ServiceTimes';
import { About } from './components/About';
import { Ministries } from './components/Ministries';
import { Events } from './components/Events';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { PlanVisitModal } from './components/PlanVisitModal';
import { SermonHub } from './components/SermonHub';
import { GivingSection } from './components/GivingSection';
import { PrayerWall } from './components/PrayerWall';
import { ContentManagerModal } from './components/admin/ContentManagerModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { NewsBlogReader } from './components/NewsBlogReader';
import { ChurchContentProvider, useChurchContent } from './context/ChurchContentContext';
import { X } from 'lucide-react';
import { Button } from './components/ui/button';

function ChurchApp() {
  const { content, isAdmin } = useChurchContent();
  const [isPlanVisitOpen, setIsPlanVisitOpen] = useState(false);
  const [isWatchOnlineOpen, setIsWatchOnlineOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [activeSpecialView, setActiveSpecialView] = useState<'none' | 'sermons' | 'give' | 'prayer'>('none');
  
  // Blog / 2-column news reader state
  const [isNewsReaderOpen, setIsNewsReaderOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Support hash routing: #admin, #berita, #berita/:id, #events
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        if (isAdmin) {
          setIsAdminOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      } else if (hash.startsWith('#berita')) {
        const parts = hash.split('/');
        if (parts.length > 1 && parts[1]) {
          setSelectedArticleId(parts[1]);
        }
        setIsNewsReaderOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isAdmin]);

  const handleOpenArticle = (id: string) => {
    setSelectedArticleId(id);
    setIsNewsReaderOpen(true);
    window.location.hash = `berita/${id}`;
  };

  const handleCloseNewsReader = () => {
    setIsNewsReaderOpen(false);
    if (window.location.hash.startsWith('#berita')) {
      history.replaceState(null, '', window.location.pathname);
    }
  };

  const handleOpenAdminTrigger = () => {
    if (isAdmin) {
      setIsAdminOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // Stealth keyboard shortcut: Ctrl + Shift + A (or Cmd + Shift + A) to open admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        handleOpenAdminTrigger();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/10 relative">
      <Header 
        onPlanVisit={() => setIsPlanVisitOpen(true)}
        onOpenNews={() => {
          if (content.events.length > 0) {
            handleOpenArticle(content.events[0].id);
          } else {
            setIsNewsReaderOpen(true);
          }
        }}
      />
      
      {/* 2-Column Blogspot-Style News & Article Reader View */}
      {isNewsReaderOpen ? (
        <main className="flex-1">
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
        </main>
      ) : (
        <main className="flex-1">
          <Hero
            onPlanVisit={() => setIsPlanVisitOpen(true)}
            onWatchOnline={() => setIsWatchOnlineOpen(true)}
          />
          <ServiceTimes />
          <About />
          <Ministries />
          <Events onReadArticle={(id) => handleOpenArticle(id)} />
          <Contact />

          {/* Optional dedicated section drawers for Give, Prayer & Sermons */}
          {activeSpecialView === 'sermons' && (
            <div id="sermon-hub-section" className="border-t py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Church Sermons Archive</h2>
                <Button variant="ghost" onClick={() => setActiveSpecialView('none')} className="cursor-pointer">
                  Close
                </Button>
              </div>
              <SermonHub language="en" />
            </div>
          )}

          {activeSpecialView === 'give' && (
            <div id="giving-section" className="border-t py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Online Giving & Tithes</h2>
                <Button variant="ghost" onClick={() => setActiveSpecialView('none')} className="cursor-pointer">
                  Close
                </Button>
              </div>
              <GivingSection language="en" />
            </div>
          )}

          {activeSpecialView === 'prayer' && (
            <div id="prayer-section" className="border-t py-12 bg-white">
              <div className="max-w-7xl mx-auto px-4 flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Community Prayer Wall</h2>
                <Button variant="ghost" onClick={() => setActiveSpecialView('none')} className="cursor-pointer">
                  Close
                </Button>
              </div>
              <PrayerWall language="en" />
            </div>
          )}
        </main>
      )}

      <Footer
        onPlanVisit={() => setIsPlanVisitOpen(true)}
        onOpenGive={() => setActiveSpecialView('give')}
        onOpenPrayer={() => setActiveSpecialView('prayer')}
        onOpenSermons={() => setActiveSpecialView('sermons')}
        onOpenAdmin={handleOpenAdminTrigger}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* Content Manager CMS Modal (Admin Only) */}
      <ContentManagerModal
        isOpen={isAdminOpen && isAdmin}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => setIsAdminOpen(true)}
      />

      {/* Plan Your Visit VIP Modal */}
      <PlanVisitModal
        isOpen={isPlanVisitOpen}
        onClose={() => setIsPlanVisitOpen(false)}
        language="en"
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
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                Church Livestream
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Sunday Worship Online</h3>
            <p className="text-sm text-gray-600 mb-4">
              Join us live for praise & worship. If you missed our live broadcast, you can watch our latest service replay below:
            </p>
            
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black mb-4 relative shadow-md">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Church Service Stream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
              <p className="text-xs text-gray-500">
                Missed a sermon? Explore our sermon archive library anytime.
              </p>
              <Button
                onClick={() => {
                  setIsWatchOnlineOpen(false);
                  setActiveSpecialView('sermons');
                }}
                className="cursor-pointer"
              >
                Browse All Sermons
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ChurchContentProvider>
      <ChurchApp />
    </ChurchContentProvider>
  );
}
