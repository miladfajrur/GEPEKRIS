import React, { useState } from 'react';
import {
  useChurchContent,
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_CHURCH_CONTENT,
  DEFAULT_DAILY_VERSE,
  formatYouTubeEmbedUrl,
} from '../../context/ChurchContentContext';
import { testConnection } from '../../firebase';
import { ImagePickerField, DEFAULT_HERO_PRESETS } from './ImagePickerField';
import { validateImageUrlString } from '../../lib/imageValidation';
import {
  X,
  Building,
  Image as ImageIcon,
  Clock,
  BookOpen,
  Users,
  Calendar,
  Camera,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  Download,
  Upload,
  Sparkles,
  LogOut,
  Key,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Database,
  Pencil,
  FolderOpen,
  Smartphone,
  Search,
  Heart,
  Landmark,
  QrCode,
  Video,
  Share2,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { MediaManagerModal } from './MediaManagerModal';

interface ContentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContentManagerModal: React.FC<ContentManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    content,
    updateInfo,
    updateHero,
    updateAbout,
    addService,
    deleteService,
    updateServiceItem,
    addMinistry,
    deleteMinistry,
    updateMinistryItem,
    addAdditionalMinistry,
    updateAdditionalMinistry,
    deleteAdditionalMinistry,
    addEvent,
    deleteEvent,
    updateEventItem,
    updateDailyVerse,
    addGalleryItem,
    deleteGalleryItem,
    updateGalleryItem,
    updateGiving,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    addGivingFund,
    updateGivingFund,
    deleteGivingFund,
    deleteMediaItem,
    getAllIndexedMedia,
    resetToDefaults,
    importContent,
    applyGepekrisTretesPreset,
    isAdmin,
    logoutAdmin,
    updateAdminPassword,
    resetAdminPassword,
    clearCacheAndStartFresh,
    syncToFirestore,
    activeAdminTab,
    setActiveAdminTab,
  } = useChurchContent();

  const activeTab = activeAdminTab;
  const setActiveTab = setActiveAdminTab;

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaSearchQuery, setMediaSearchQuery] = useState('');
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Hosting / Firebase State
  const [testingConnection, setTestingConnection] = useState(false);
  const [syncingToFirestore, setSyncingToFirestore] = useState(false);

  // Security Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityStatus, setSecurityStatus] = useState<{ error?: string; success?: string } | null>(null);

  // New Service Form State
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceTimes, setNewServiceTimes] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // New Ministry Form State
  const [newMinTitle, setNewMinTitle] = useState('');
  const [newMinDesc, setNewMinDesc] = useState('');
  const [newMinImage, setNewMinImage] = useState('');
  const [newMinFeatures, setNewMinFeatures] = useState('');

  // New Additional Ministry Form State
  const [newAddMinTitle, setNewAddMinTitle] = useState('');
  const [newAddMinDesc, setNewAddMinDesc] = useState('');
  const [newAddMinSchedule, setNewAddMinSchedule] = useState('Rutin Setiap Pekan / Bulan');
  const [newAddMinLocation, setNewAddMinLocation] = useState('Gedung GEPEKRIS Tretes & Rumah Jemaat');

  // New Bank Account Form State
  const [newBankName, setNewBankName] = useState('');
  const [newBankNumber, setNewBankNumber] = useState('');
  const [newBankHolder, setNewBankHolder] = useState('GEPEKRIS Tretes');

  // New Giving Fund Form State
  const [newFundName, setNewFundName] = useState('');
  const [newFundDesc, setNewFundDesc] = useState('');

  // New Event / Renungan Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('Gedung Gereja GEPEKRIS Tretes');
  const [newEventCategory, setNewEventCategory] = useState('Renungan & Firman Tuhan');
  const [newEventBibleVerse, setNewEventBibleVerse] = useState('');
  const [newEventBibleQuote, setNewEventBibleQuote] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventContent, setNewEventContent] = useState('');
  const [newEventImage, setNewEventImage] = useState('');
  const [newEventAuthor, setNewEventAuthor] = useState('');
  const [newEventFeatured, setNewEventFeatured] = useState(false);

  // Inline item editing state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingMinistryId, setEditingMinistryId] = useState<string | null>(null);
  const [editingAddMinistryId, setEditingAddMinistryId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [editingFundId, setEditingFundId] = useState<string | null>(null);

  // New Gallery Photo Form State
  const [newGalTitle, setNewGalTitle] = useState('');
  const [newGalCategory, setNewGalCategory] = useState('Ibadah');
  const [newGalImageUrl, setNewGalImageUrl] = useState('');
  const [newGalDate, setNewGalDate] = useState('');
  const [newGalDesc, setNewGalDesc] = useState('');

  // JSON Import/Export state
  const [importJsonText, setImportJsonText] = useState('');

  if (!isOpen || !isAdmin) return null;

  const showToast = (msg: string) => {
    setErrorBanner(null);
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const showError = (msg: string) => {
    setErrorBanner(msg);
    setTimeout(() => {
      setErrorBanner(null);
    }, 5000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityStatus(null);
    if (!oldPassword.trim()) {
      setSecurityStatus({ error: 'Masukkan kata sandi lama/saat ini.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityStatus({ error: 'Konfirmasi kata sandi baru tidak cocok.' });
      return;
    }
    const res = updateAdminPassword(oldPassword, newPassword);
    if (res.success) {
      setSecurityStatus({ success: res.message });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Kata sandi admin berhasil diperbarui!');
    } else {
      setSecurityStatus({ error: res.message });
    }
  };

  const handleResetPasswordToDefault = () => {
    resetAdminPassword();
    setSecurityStatus({ success: `Kata sandi berhasil dikembalikan ke bawaan: ${DEFAULT_ADMIN_PASSWORD}` });
    showToast('Kata sandi direset ke bawaan');
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    addService({
      name: newServiceName,
      times: newServiceTimes.split(',').map((t) => t.trim()).filter(Boolean),
      description: newServiceDesc,
      iconName: 'Clock',
    });
    setNewServiceName('');
    setNewServiceTimes('');
    setNewServiceDesc('');
    showToast('Jadwal ibadah baru berhasil ditambahkan!');
  };

  const handleAddMinistry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMinTitle.trim()) return;
    addMinistry({
      title: newMinTitle,
      description: newMinDesc,
      image:
        newMinImage ||
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80',
      features: newMinFeatures.split(',').map((f) => f.trim()).filter(Boolean),
    });
    setNewMinTitle('');
    setNewMinDesc('');
    setNewMinImage('');
    setNewMinFeatures('');
    showToast('Komisi / pelayanan utama berhasil ditambahkan!');
  };

  const handleAddAdditionalMinistry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddMinTitle.trim()) return;
    addAdditionalMinistry({
      title: newAddMinTitle.trim(),
      description: newAddMinDesc.trim(),
      schedule: newAddMinSchedule.trim() || 'Rutin Setiap Pekan / Bulan',
      location: newAddMinLocation.trim() || 'Gedung GEPEKRIS Tretes & Rumah Jemaat',
    });
    setNewAddMinTitle('');
    setNewAddMinDesc('');
    setNewAddMinSchedule('Rutin Setiap Pekan / Bulan');
    setNewAddMinLocation('Gedung GEPEKRIS Tretes & Rumah Jemaat');
    showToast('Komisi tambahan berhasil ditambahkan!');
  };

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankName.trim() || !newBankNumber.trim()) return;
    addBankAccount({
      bankName: newBankName.trim(),
      accountNumber: newBankNumber.trim(),
      accountHolder: newBankHolder.trim() || 'GEPEKRIS Tretes',
    });
    setNewBankName('');
    setNewBankNumber('');
    setNewBankHolder('GEPEKRIS Tretes');
    showToast('Rekening persembahan berhasil ditambahkan!');
  };

  const handleAddFund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFundName.trim()) return;
    addGivingFund({
      name: newFundName.trim(),
      description: newFundDesc.trim(),
    });
    setNewFundName('');
    setNewFundDesc('');
    showToast('Kategori persembahan berhasil ditambahkan!');
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    addEvent({
      title: newEventTitle,
      date: newEventDate || 'Minggu Mendatang',
      time: newEventTime || '10:00 WIB',
      location: newEventLocation || 'Gedung Gereja GEPEKRIS Tretes',
      category: newEventCategory,
      bibleVerse: newEventBibleVerse.trim(),
      bibleQuote: newEventBibleQuote.trim(),
      description: newEventDesc,
      content: newEventContent || newEventDesc,
      image: newEventImage,
      author: newEventAuthor || 'Pelayan Firman & Majelis GEPEKRIS Tretes',
      featured: newEventFeatured,
    });
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventTime('');
    setNewEventBibleVerse('');
    setNewEventBibleQuote('');
    setNewEventDesc('');
    setNewEventContent('');
    setNewEventImage('');
    setNewEventAuthor('');
    setNewEventFeatured(false);
    showToast('Warta / tulisan Firman Tuhan berhasil diterbitkan!');
  };

  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(content, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `gepekris-tretes-backup-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Berkas cadangan JSON berhasil diunduh!');
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      const success = importContent(parsed);
      if (success) {
        showToast('Konten website berhasil dipulihkan!');
        setImportJsonText('');
      } else {
        showError('Format JSON tidak sesuai dengan struktur konten gereja.');
      }
    } catch {
      showError('Gagal membaca kode JSON. Pastikan format JSON valid.');
    }
  };

  const handleSyncToFirestore = async () => {
    setSyncingToFirestore(true);
    try {
      const res = await syncToFirestore();
      if (res?.success) {
        showToast('✓ Berhasil disinkronkan ke Firebase Firestore!');
      }
    } catch (e: any) {
      showError(`Gagal sinkron ke Firestore: ${e?.message || 'Error'}`);
    } finally {
      setSyncingToFirestore(false);
    }
  };

  const handleApplyGepekrisPreset = () => {
    applyGepekrisTretesPreset();
    showToast('Profil resmi GEPEKRIS Tretes berhasil diterapkan!');
  };

  const additionalMinistries = content.additionalMinistries || [];
  const givingData = content.giving || DEFAULT_CHURCH_CONTENT.giving;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                Panel Pengelola Konten Website
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-500 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Sinkronisasi Otomatis Firebase Real-Time Aktif</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Save to Firebase Firestore Button */}
            <Button
              onClick={handleSyncToFirestore}
              disabled={syncingToFirestore}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-xs"
              title="Simpan dan sinkronkan seluruh data ke Firebase Firestore sekarang"
            >
              <Database className={`w-3.5 h-3.5 ${syncingToFirestore ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{syncingToFirestore ? 'Menyimpan...' : 'Simpan ke Firebase'}</span>
              <span className="sm:hidden">{syncingToFirestore ? '...' : 'Simpan'}</span>
            </Button>

            {toastMessage && (
              <span className="hidden md:inline-flex text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 items-center gap-1.5 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                {toastMessage}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logoutAdmin();
                onClose();
              }}
              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 cursor-pointer flex items-center gap-1.5"
              title="Keluar dari mode admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar Admin</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Error or Mobile Toast Banner */}
        {(errorBanner || toastMessage) && (
          <div className={`px-6 py-2 text-xs font-medium flex items-center justify-between ${errorBanner ? 'bg-red-50 text-red-800 border-b border-red-200' : 'md:hidden bg-emerald-50 text-emerald-800 border-b border-emerald-200'}`}>
            <span>{errorBanner || toastMessage}</span>
            <button onClick={() => { setErrorBanner(null); setToastMessage(null); }} className="ml-2 font-bold">✕</button>
          </div>
        )}

        {/* Modal Body with Sidebar Tabs */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Navigation Sidebar (Horizontal swipe on Mobile HP, Vertical on Desktop) */}
          <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200/80 p-2 md:p-3 flex md:flex-col gap-1.5 md:gap-1 overflow-x-auto md:overflow-y-auto shrink-0 no-scrollbar">
            <div className="hidden md:block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Konten Halaman Utama
            </div>

            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-2 px-3 py-2 md:px-3.5 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all text-left cursor-pointer whitespace-nowrap shrink-0 md:w-full ${
                activeTab === 'info'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
              }`}
            >
              <Building className="w-4 h-4 shrink-0" />
              <span>Profil, Kontak & Streaming</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`flex items-center gap-2 px-3 py-2 md:px-3.5 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all text-left cursor-pointer whitespace-nowrap shrink-0 md:w-full ${
                activeTab === 'hero'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
              }`}
            >
              <ImageIcon className="w-4 h-4 shrink-0" />
              <span>Banner Utama (Hero)</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-3 py-2 md:px-3.5 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all text-left cursor-pointer whitespace-nowrap shrink-0 md:w-full ${
                activeTab === 'services'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>Jadwal Ibadah ({content.services.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-2 px-3 py-2 md:px-3.5 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all text-left cursor-pointer whitespace-nowrap shrink-0 md:w-full ${
                activeTab === 'about'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Tentang & Nilai Gereja</span>
            </button>

            <button
              onClick={() => setActiveTab('ministries')}
              className={`flex items-center gap-2 px-3 py-2 md:px-3.5 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all text-left cursor-pointer whitespace-nowrap shrink-0 md:w-full ${
                activeTab === 'ministries'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Komisi & Pelayanan ({content.ministries.length + additionalMinistries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2 px-3 py-2 md:px-3.5 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all text-left cursor-pointer whitespace-nowrap shrink-0 md:w-full ${
                activeTab === 'events'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Warta & Firman ({content.events.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2 px-3 py-2 md:px-3.5 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all text-left cursor-pointer whitespace-nowrap shrink-0 md:w-full ${
                activeTab === 'gallery'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
              }`}
            >
              <Camera className="w-4 h-4 shrink-0" />
              <span>Galeri Foto ({content.gallery?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('giving')}
              className={`flex items-center gap-2 px-3 py-2 md:px-3.5 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all text-left cursor-pointer whitespace-nowrap shrink-0 md:w-full ${
                activeTab === 'giving'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
              }`}
            >
              <Landmark className="w-4 h-4 shrink-0" />
              <span>Persembahan & QRIS</span>
            </button>

            <div className="hidden md:block px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Media & Sistem
            </div>

            <button
              onClick={() => setActiveTab('media')}
              className={`flex items-center gap-2 px-3 py-2 md:px-3.5 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all text-left cursor-pointer whitespace-nowrap shrink-0 md:w-full ${
                activeTab === 'media'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-800 bg-amber-50/70 hover:bg-amber-100/70 hover:text-amber-900'
              }`}
            >
              <FolderOpen className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Pustaka Media</span>
            </button>

            <button
              onClick={() => setActiveTab('hosting')}
              className={`flex items-center justify-between gap-2 px-3 py-2 md:px-3.5 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all text-left cursor-pointer whitespace-nowrap shrink-0 md:w-full ${
                activeTab === 'hosting'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 shrink-0" />
                <span>Database Firebase</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                activeTab === 'hosting'
                  ? 'bg-white/20 text-white'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                Real-Time
              </span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-2 px-3 py-2 md:px-3.5 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all text-left cursor-pointer whitespace-nowrap shrink-0 md:w-full ${
                activeTab === 'backup'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
              }`}
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>Cadangan & Reset</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-3 py-2 md:px-3.5 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all text-left cursor-pointer whitespace-nowrap shrink-0 md:w-full ${
                activeTab === 'security'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
              }`}
            >
              <Key className="w-4 h-4 shrink-0" />
              <span>Keamanan Admin</span>
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto bg-white">
            
            {/* Tab 1: General Info, Contact, Social Media & Streaming */}
            {activeTab === 'info' && (
              <div className="space-y-8 max-w-3xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Profil Gereja, Kontak & Live Streaming</h3>
                  <p className="text-xs text-gray-500">
                    Kelola identitas gereja, nomor telepon/WhatsApp, tautan sosial media, peta Google Maps, dan video Live Streaming YouTube.
                  </p>
                </div>

                {/* Bagian 1: Identitas & Kontak */}
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Building className="w-4 h-4 text-primary" />
                    <span>Identitas & Sekretariat Gereja</span>
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Resmi Gereja</label>
                    <Input
                      value={content.info.name}
                      onChange={(e) => updateInfo({ name: e.target.value })}
                      placeholder="Contoh: GEPEKRIS TRETES"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Slogan / Kalimat Misi Singkat</label>
                    <Textarea
                      rows={2}
                      value={content.info.tagline}
                      onChange={(e) => updateInfo({ tagline: e.target.value })}
                      placeholder="Gereja Persekutuan Kristen Tretes — Bertumbuh dalam iman..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Telepon Sekretariat</label>
                      <Input
                        value={content.info.phone}
                        onChange={(e) => updateInfo({ phone: e.target.value })}
                        placeholder="0812-xxxx-xxxx"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Nomor WhatsApp Resmi</label>
                      <Input
                        value={content.info.whatsappNumber || ''}
                        onChange={(e) => updateInfo({ whatsappNumber: e.target.value })}
                        placeholder="6281234567890"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Email Resmi</label>
                      <Input
                        value={content.info.email}
                        onChange={(e) => updateInfo({ email: e.target.value })}
                        placeholder="sekretariat@gepekristretes.org"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Alamat Lengkap Gedung Gereja</label>
                    <Input
                      value={content.info.address}
                      onChange={(e) => updateInfo({ address: e.target.value })}
                      placeholder="Jl. Raya Tretes, Prigen, Pasuruan..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Jam Operasional Sekretariat</label>
                      <Input
                        value={content.info.officeHours}
                        onChange={(e) => updateInfo({ officeHours: e.target.value })}
                        placeholder="Selasa - Sabtu: 09:00 - 16:00 WIB"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Tautan Peta Google Maps Embed</label>
                      <Input
                        value={content.info.mapEmbedUrl}
                        onChange={(e) => updateInfo({ mapEmbedUrl: e.target.value })}
                        placeholder="https://maps.google.com/maps?q=..."
                      />
                    </div>
                  </div>
                </div>

                {/* Bagian 2: Live Streaming YouTube */}
                <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Video className="w-4 h-4 text-red-600" />
                      <span>Pengaturan Live Streaming Ibadah Online (YouTube)</span>
                    </h4>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                      Tombol "Tonton Ibadah Online"
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Siaran Ibadah Online</label>
                      <Input
                        value={content.info.streamTitle || ''}
                        onChange={(e) => updateInfo({ streamTitle: e.target.value })}
                        placeholder="Contoh: Ibadah Raya Minggu Online"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Tautan Video / Live YouTube (Otomatis Dikonversi)
                      </label>
                      <Input
                        value={content.info.streamUrl}
                        onChange={(e) => updateInfo({ streamUrl: e.target.value })}
                        onBlur={(e) => {
                          const formatted = formatYouTubeEmbedUrl(e.target.value);
                          if (formatted !== e.target.value) {
                            updateInfo({ streamUrl: formatted });
                            showToast('Link YouTube otomatis disesuaikan ke format Embed!');
                          }
                        }}
                        placeholder="Tempel link YouTube watch?v=... atau youtu.be/..."
                      />
                      <p className="text-[11px] text-gray-500 mt-1">
                        Anda dapat menempelkan tautan YouTube biasa (misal <code className="bg-white px-1 rounded">https://youtube.com/watch?v=...</code> atau <code className="bg-white px-1 rounded">https://youtube.com/live/...</code>).
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi / Sambutan Jendela Streaming</label>
                    <Textarea
                      rows={2}
                      value={content.info.streamDescription || ''}
                      onChange={(e) => updateInfo({ streamDescription: e.target.value })}
                      placeholder="Mari beribadah bersama keluarga besar GEPEKRIS Tretes..."
                    />
                  </div>

                  {content.info.streamUrl && (
                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Pratinjau Video Streaming:</label>
                      <div className="aspect-video max-w-md rounded-xl overflow-hidden bg-black border border-gray-300 shadow-xs">
                        <iframe
                          className="w-full h-full"
                          src={formatYouTubeEmbedUrl(content.info.streamUrl)}
                          title="Pratinjau Live Stream"
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Bagian 3: Tautan Sosial Media */}
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-primary" />
                    <span>Tautan Sosial Media Resmi (Tampil di Footer)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Halaman Facebook</label>
                      <Input
                        value={content.info.facebookUrl || ''}
                        onChange={(e) => updateInfo({ facebookUrl: e.target.value })}
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Profil Instagram</label>
                      <Input
                        value={content.info.instagramUrl || ''}
                        onChange={(e) => updateInfo({ instagramUrl: e.target.value })}
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Kanal YouTube</label>
                      <Input
                        value={content.info.youtubeUrl || ''}
                        onChange={(e) => updateInfo({ youtubeUrl: e.target.value })}
                        placeholder="https://youtube.com/@..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Hero Banner */}
            {activeTab === 'hero' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Banner Utama (Hero Beranda)</h3>
                  <p className="text-xs text-gray-500">Sesuaikan judul sambutan utama, subjudul, catatan jadwal ibadah Minggu, dan foto latar beranda.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Sambutan Utama (Headline)</label>
                    <Input
                      value={content.hero.headline}
                      onChange={(e) => updateHero({ headline: e.target.value })}
                      placeholder="Selamat Datang di GEPEKRIS Tretes"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Subjudul / Kalimat Sambutan</label>
                    <Textarea
                      rows={3}
                      value={content.hero.subheadline}
                      onChange={(e) => updateHero({ subheadline: e.target.value })}
                    />
                  </div>

                  <ImagePickerField
                    label="Foto Latar Belakang Banner Utama (Hero)"
                    description="Pilih atau unggah foto latar belakang utama website dari HP/komputer, link URL, atau galeri preset gereja."
                    currentValue={content.hero.bgImage}
                    defaultValue={DEFAULT_CHURCH_CONTENT.hero.bgImage}
                    onChange={(newUrl) => {
                      updateHero({ bgImage: newUrl });
                      showToast('Foto latar utama berhasil diperbarui!');
                    }}
                    onToast={showToast}
                    presets={DEFAULT_HERO_PRESETS}
                    aspectRatio="16:9"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Kotak Info Ibadah</label>
                      <Input
                        value={content.hero.sundayNoteTitle}
                        onChange={(e) => updateHero({ sundayNoteTitle: e.target.value })}
                        placeholder="Jadwal Ibadah Raya Minggu"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Rincian Jam Ibadah di Banner</label>
                      <Input
                        value={content.hero.sundayNoteTimes}
                        onChange={(e) => updateHero({ sundayNoteTimes: e.target.value })}
                        placeholder="Ibadah Umum: 07:30 WIB & 10:00 WIB..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: About & Values */}
            {activeTab === 'about' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Tentang Kami & Nilai Pelayanan</h3>
                  <p className="text-xs text-gray-500">Edit sejarah singkat, visi misi gereja, foto komunitas, dan 4 pilar nilai utama.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Seksi Tentang Kami</label>
                    <Input
                      value={content.about.heading}
                      onChange={(e) => updateAbout({ heading: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Paragraf Profil 1</label>
                    <Textarea
                      rows={3}
                      value={content.about.paragraph1}
                      onChange={(e) => updateAbout({ paragraph1: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Paragraf Profil 2</label>
                    <Textarea
                      rows={3}
                      value={content.about.paragraph2}
                      onChange={(e) => updateAbout({ paragraph2: e.target.value })}
                    />
                  </div>

                  <ImagePickerField
                    label="Foto Tentang Kami / Kebersamaan Jemaat"
                    description="Foto gedung gereja atau kebersamaan jemaat pada bagian Tentang Kami."
                    currentValue={content.about.image}
                    defaultValue={DEFAULT_CHURCH_CONTENT.about.image}
                    onChange={(newUrl) => {
                      updateAbout({ image: newUrl });
                      showToast('Foto bagian Tentang Kami berhasil diperbarui!');
                    }}
                    onToast={showToast}
                    aspectRatio="4:3"
                  />

                  <div className="pt-2">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">4 Pilar Nilai Pelayanan</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {content.about.values.map((val, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                          <label className="block text-[11px] font-bold text-gray-600 mb-1">
                            Nilai #{idx + 1}
                          </label>
                          <Input
                            className="mb-2 h-8 text-xs font-semibold"
                            value={val.title}
                            onChange={(e) => {
                              const newValues = [...content.about.values];
                              newValues[idx] = { ...newValues[idx], title: e.target.value };
                              updateAbout({ values: newValues });
                            }}
                          />
                          <Textarea
                            rows={2}
                            className="text-xs"
                            value={val.description}
                            onChange={(e) => {
                              const newValues = [...content.about.values];
                              newValues[idx] = { ...newValues[idx], description: e.target.value };
                              updateAbout({ values: newValues });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Service Times */}
            {activeTab === 'services' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Jadwal Ibadah & Persekutuan</h3>
                  <p className="text-xs text-gray-500">Kelola jadwal kebaktian rutin yang ditampilkan di halaman utama.</p>
                </div>

                {/* Existing Services List */}
                <div className="space-y-3">
                  {content.services.map((srv) => (
                    <div
                      key={srv.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      {editingServiceId === srv.id ? (
                        <div className="space-y-3 bg-white p-3 rounded-lg border border-primary/30">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Kebaktian / Ibadah</label>
                            <Input
                              value={srv.name}
                              onChange={(e) => updateServiceItem(srv.id, { name: e.target.value })}
                              placeholder="Nama Ibadah"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Waktu / Jam Ibadah (pisahkan dengan koma jika lebih dari satu)</label>
                            <Input
                              value={Array.isArray(srv.times) ? srv.times.join(', ') : (srv.times || '')}
                              onChange={(e) => updateServiceItem(srv.id, { times: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                              placeholder="Contoh: 07:30 WIB, 10:00 WIB"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi / Keterangan</label>
                            <Textarea
                              rows={2}
                              value={srv.description}
                              onChange={(e) => updateServiceItem(srv.id, { description: e.target.value })}
                              placeholder="Keterangan ibadah..."
                            />
                          </div>
                          <div className="flex justify-end pt-1">
                            <Button
                              size="sm"
                              onClick={() => {
                                setEditingServiceId(null);
                                showToast('Jadwal ibadah diperbarui!');
                              }}
                              className="cursor-pointer text-xs"
                            >
                              Selesai Mengedit
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-primary shrink-0" />
                              <h4 className="font-semibold text-gray-900 text-sm">{srv.name}</h4>
                            </div>
                            <div className="text-xs font-medium text-primary">
                              {Array.isArray(srv.times) ? srv.times.join(' & ') : (srv.times || '')}
                            </div>
                            <p className="text-xs text-gray-600">{srv.description}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingServiceId(srv.id)}
                              className="text-gray-500 hover:text-primary hover:bg-primary/10 cursor-pointer"
                              title="Edit jadwal ini"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                deleteService(srv.id);
                                showToast(`Jadwal "${srv.name}" dihapus`);
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                              title="Hapus jadwal ini"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New Service Form */}
                <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200 mt-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-primary" />
                    <span>Tambah Jadwal Ibadah Baru</span>
                  </h4>
                  <form onSubmit={handleAddService} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Ibadah *</label>
                      <Input
                        required
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        placeholder="Contoh: Ibadah Persekutuan Doa Malam"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Jam Ibadah (pisahkan dengan koma) *</label>
                      <Input
                        required
                        value={newServiceTimes}
                        onChange={(e) => setNewServiceTimes(e.target.value)}
                        placeholder="Contoh: Kamis 18:30 WIB"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Keterangan Singkat</label>
                      <Input
                        value={newServiceDesc}
                        onChange={(e) => setNewServiceDesc(e.target.value)}
                        placeholder="Penjelasan singkat mengenai ibadah ini..."
                      />
                    </div>
                    <Button type="submit" size="sm" className="cursor-pointer">
                      Tambah Jadwal Ibadah
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Tab 5: Ministries & Additional Ministries */}
            {activeTab === 'ministries' && (
              <div className="space-y-8 max-w-4xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Komisi & Bidang Pelayanan Gereja</h3>
                  <p className="text-xs text-gray-500">
                    Kelola kartu pelayanan utama bergambar serta daftar komisi tambahan (Doa, Wanita, Pria, Usia Indah, dll).
                  </p>
                </div>

                {/* Bagian A: Pelayanan Utama Bergambar */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900">A. Bidang Pelayanan Utama ({content.ministries.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {content.ministries.map((min) => (
                      <div
                        key={min.id}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col justify-between"
                      >
                        {editingMinistryId === min.id ? (
                          <div className="space-y-3 bg-white p-3 rounded-lg border border-primary/30">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Bidang Pelayanan</label>
                              <Input
                                value={min.title}
                                onChange={(e) => updateMinistryItem(min.id, { title: e.target.value })}
                                placeholder="Nama Pelayanan"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi / Visi</label>
                              <Textarea
                                rows={2}
                                value={min.description}
                                onChange={(e) => updateMinistryItem(min.id, { description: e.target.value })}
                                placeholder="Deskripsi pelayanan..."
                              />
                            </div>
                            <div>
                              <ImagePickerField
                                label="Foto Sampul Komisi"
                                description="Unggah foto komisi dari HP/komputer atau gunakan tautan URL."
                                currentValue={min.image}
                                onChange={(url) => updateMinistryItem(min.id, { image: url })}
                                onToast={showToast}
                                aspectRatio="16:9"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Kegiatan / Fokus Utama (pisahkan koma)</label>
                              <Input
                                value={min.features.join(', ')}
                                onChange={(e) => updateMinistryItem(min.id, { features: e.target.value.split(',').map(f => f.trim()).filter(Boolean) })}
                                placeholder="Kegiatan 1, Kegiatan 2"
                              />
                            </div>
                            <div className="flex justify-end pt-1">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setEditingMinistryId(null);
                                  showToast('Data komisi diperbarui!');
                                }}
                                className="cursor-pointer text-xs"
                              >
                                Selesai Mengedit
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div>
                              <div className="h-32 w-full rounded-lg overflow-hidden mb-2.5 bg-gray-200">
                                <img
                                  src={min.image}
                                  alt={min.title}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <h4 className="font-semibold text-gray-900 text-sm mb-1">{min.title}</h4>
                              <p className="text-xs text-gray-600 mb-2 leading-relaxed">{min.description}</p>
                              <div className="flex flex-wrap gap-1 mb-3">
                                {min.features.map((f, i) => (
                                  <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded border text-gray-600">
                                    {f}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-gray-200 flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingMinistryId(min.id)}
                                className="text-gray-600 hover:text-primary hover:bg-primary/10 text-xs cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  deleteMinistry(min.id);
                                  showToast(`Komisi "${min.title}" dihapus`);
                                }}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1" />
                                Hapus
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add New Main Ministry Form */}
                  <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-primary" />
                      <span>Tambah Bidang Pelayanan Utama Baru</span>
                    </h4>
                    <form onSubmit={handleAddMinistry} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Komisi / Pelayanan *</label>
                        <Input
                          required
                          value={newMinTitle}
                          onChange={(e) => setNewMinTitle(e.target.value)}
                          placeholder="Contoh: Komisi Musik & Pujian Penyembahan"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi *</label>
                        <Textarea
                          rows={2}
                          required
                          value={newMinDesc}
                          onChange={(e) => setNewMinDesc(e.target.value)}
                          placeholder="Tujuan dan kegiatan komisi ini..."
                        />
                      </div>
                      <div>
                        <ImagePickerField
                          label="Foto Sampul Pelayanan"
                          description="Unggah foto dari perangkat atau masukkan URL gambar."
                          currentValue={newMinImage}
                          onChange={(url) => setNewMinImage(url)}
                          onToast={showToast}
                          aspectRatio="16:9"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Program / Kegiatan Utama (pisahkan koma)</label>
                        <Input
                          value={newMinFeatures}
                          onChange={(e) => setNewMinFeatures(e.target.value)}
                          placeholder="Paduan Suara, Musik Ibadah, Pelatihan"
                        />
                      </div>
                      <Button type="submit" size="sm" className="cursor-pointer">
                        Tambah Pelayanan Utama
                      </Button>
                    </form>
                  </div>
                </div>

                {/* Bagian B: Komisi & Pelayanan Lainnya */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">B. Komisi & Pelayanan Lainnya ({additionalMinistries.length})</h4>
                    <p className="text-xs text-gray-500">Daftar komisi yang tampil pada kotak bawah seksi Pelayanan (misal: Persekutuan Doa, Komisi Wanita, Komisi Pria, Lansia).</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {additionalMinistries.map((item) => (
                      <div key={item.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        {editingAddMinistryId === item.id ? (
                          <div className="space-y-2.5 bg-white p-3 rounded-lg border border-primary/30">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Komisi</label>
                              <Input
                                value={item.title}
                                onChange={(e) => updateAdditionalMinistry(item.id, { title: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi Singkat</label>
                              <Textarea
                                rows={2}
                                value={item.description}
                                onChange={(e) => updateAdditionalMinistry(item.id, { description: e.target.value })}
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Jadwal Kegiatan</label>
                                <Input
                                  value={item.schedule || ''}
                                  onChange={(e) => updateAdditionalMinistry(item.id, { schedule: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Lokasi</label>
                                <Input
                                  value={item.location || ''}
                                  onChange={(e) => updateAdditionalMinistry(item.id, { location: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="flex justify-end pt-1">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setEditingAddMinistryId(null);
                                  showToast('Komisi lainnya diperbarui!');
                                }}
                                className="cursor-pointer text-xs"
                              >
                                Selesai
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h5 className="font-bold text-sm text-gray-900">{item.title}</h5>
                              <p className="text-xs text-gray-600 mt-0.5">{item.description}</p>
                              {(item.schedule || item.location) && (
                                <p className="text-[11px] text-amber-800 mt-1.5 font-medium">
                                  {item.schedule} &bull; {item.location}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingAddMinistryId(item.id)}
                                className="text-gray-500 hover:text-primary cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  deleteAdditionalMinistry(item.id);
                                  showToast(`"${item.title}" dihapus`);
                                }}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Form Tambah Komisi Lainnya */}
                  <form onSubmit={handleAddAdditionalMinistry} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                    <h5 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-primary" />
                      <span>Tambah Komisi / Pelayanan Lainnya</span>
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        required
                        value={newAddMinTitle}
                        onChange={(e) => setNewAddMinTitle(e.target.value)}
                        placeholder="Nama Komisi (misal: Komisi Remaja)"
                      />
                      <Input
                        required
                        value={newAddMinDesc}
                        onChange={(e) => setNewAddMinDesc(e.target.value)}
                        placeholder="Deskripsi singkat..."
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        value={newAddMinSchedule}
                        onChange={(e) => setNewAddMinSchedule(e.target.value)}
                        placeholder="Jadwal (misal: Setiap Sabtu 16:00 WIB)"
                      />
                      <Input
                        value={newAddMinLocation}
                        onChange={(e) => setNewAddMinLocation(e.target.value)}
                        placeholder="Lokasi kegiatan"
                      />
                    </div>
                    <Button type="submit" size="sm" variant="outline" className="cursor-pointer text-xs">
                      Tambah Komisi Lainnya
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Tab 6: Events / Warta & Firman Tuhan */}
            {activeTab === 'events' && (
              <div className="space-y-8 max-w-3xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Warta Jemaat, Renungan & Ayat Firman Harian</h3>
                  <p className="text-xs text-gray-500">
                    Kelola Banner Ayat Firman Harian di beranda serta terbitkan tulisan renungan Firman Tuhan, warta jemaat, dan kegiatan gereja yang siap dibagikan ke WhatsApp & sosial media.
                  </p>
                </div>

                {/* Bagian A: Banner Ayat Firman Harian (Daily Verse Banner) */}
                <div className="p-5 bg-gradient-to-r from-amber-50/90 to-[#FAF6EE] rounded-2xl border border-amber-200 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-700" />
                      <span>A. Banner Ayat Firman Harian (Tampil di Beranda)</span>
                    </h4>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-200/70 text-amber-900">
                      Siap Dibagikan ke WA
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Pasal & Ayat Alkitab (Misal: Mazmur 119:105)
                      </label>
                      <Input
                        value={(content.dailyVerse || DEFAULT_DAILY_VERSE).verseReference}
                        onChange={(e) => updateDailyVerse({ verseReference: e.target.value })}
                        placeholder="Contoh: Mazmur 119:105"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Label / Judul Banner
                      </label>
                      <Input
                        value={(content.dailyVerse || DEFAULT_DAILY_VERSE).updatedDate || ''}
                        onChange={(e) => updateDailyVerse({ updatedDate: e.target.value })}
                        placeholder="Contoh: Firman Tuhan Hari Ini"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Kutipan Teks Ayat Alkitab
                    </label>
                    <Textarea
                      rows={2}
                      value={(content.dailyVerse || DEFAULT_DAILY_VERSE).verseText}
                      onChange={(e) => updateDailyVerse({ verseText: e.target.value })}
                      placeholder="Firman-Mu itu pelita bagi kakiku dan terang bagi jalanku."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Kalimat Renungan Singkat / Aplikasi Iman
                    </label>
                    <Textarea
                      rows={2}
                      value={(content.dailyVerse || DEFAULT_DAILY_VERSE).reflectionNote}
                      onChange={(e) => updateDailyVerse({ reflectionNote: e.target.value })}
                      placeholder="Kiranya kasih dan kebenaran Firman Tuhan senantiasa menuntun setiap langkah hidup..."
                    />
                  </div>
                </div>

                {/* Bagian B: Daftar Warta & Tulisan Firman Tuhan */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-900">
                    B. Daftar Warta Jemaat & Tulisan Firman Tuhan ({content.events.length})
                  </h4>
                  {content.events.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      {editingEventId === evt.id ? (
                        <div className="space-y-3 bg-white p-3.5 rounded-lg border border-primary/30">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Warta / Renungan Firman</label>
                              <Input
                                value={evt.title}
                                onChange={(e) => updateEventItem(evt.id, { title: e.target.value })}
                                placeholder="Judul Warta / Renungan"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Kategori Tulisan</label>
                              <select
                                value={evt.category}
                                onChange={(e) => updateEventItem(evt.id, { category: e.target.value })}
                                className="w-full px-3 py-2 text-xs border rounded-md bg-white"
                              >
                                <option value="Renungan & Firman Tuhan">Renungan & Firman Tuhan</option>
                                <option value="Pengajaran Alkitab">Pengajaran Alkitab</option>
                                <option value="Warta Jemaat">Warta Jemaat</option>
                                <option value="Ibadah Khusus">Ibadah Khusus</option>
                                <option value="Retret">Retret & Pembinaan</option>
                                <option value="Diakonia">Diakonia & Kasih</option>
                                <option value="Persekutuan">Persekutuan</option>
                                <option value="Pemuda & Remaja">Pemuda & Remaja</option>
                                <option value="Pengumuman">Pengumuman Jemaat</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-amber-50/60 rounded-lg border border-amber-200/70">
                            <div>
                              <label className="block text-xs font-semibold text-amber-900 mb-1">
                                Ayat Alkitab Acuan (Opsional, misal: Yohanes 14:27)
                              </label>
                              <Input
                                value={evt.bibleVerse || ''}
                                onChange={(e) => updateEventItem(evt.id, { bibleVerse: e.target.value })}
                                placeholder="Contoh: Yohanes 14:27 / Mazmur 23:1"
                                className="bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-amber-900 mb-1">
                                Kutipan Ayat Alkitab (Ditampilkan di kartu & pesan WA)
                              </label>
                              <Input
                                value={evt.bibleQuote || ''}
                                onChange={(e) => updateEventItem(evt.id, { bibleQuote: e.target.value })}
                                placeholder="Kutipan singkat bunyi ayat Alkitab..."
                                className="bg-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Tanggal / Keterangan Hari</label>
                              <Input
                                value={evt.date}
                                onChange={(e) => updateEventItem(evt.id, { date: e.target.value })}
                                placeholder="Tanggal"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Waktu / Rubrik</label>
                              <Input
                                value={evt.time}
                                onChange={(e) => updateEventItem(evt.id, { time: e.target.value })}
                                placeholder="Waktu"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Lokasi / Keterangan</label>
                              <Input
                                value={evt.location}
                                onChange={(e) => updateEventItem(evt.id, { location: e.target.value })}
                                placeholder="Lokasi"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Penulis / Pengkhotbah / Komisi</label>
                            <Input
                              value={evt.author || ''}
                              onChange={(e) => updateEventItem(evt.id, { author: e.target.value })}
                              placeholder="Contoh: Pdt. & Pelayan Firman GEPEKRIS Tretes"
                            />
                          </div>

                          <div>
                            <ImagePickerField
                              label="Foto Sampul Warta / Renungan"
                              description="Unggah foto sampul atau tempel URL gambar."
                              currentValue={evt.image || ''}
                              onChange={(url) => updateEventItem(evt.id, { image: url })}
                              onToast={showToast}
                              aspectRatio="16:9"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Ringkasan Singkat (Tampil di Kartu & Share WA)</label>
                            <Input
                              value={evt.description}
                              onChange={(e) => updateEventItem(evt.id, { description: e.target.value })}
                              placeholder="Ringkasan singkat..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Isi Lengkap Warta / Tulisan Firman Tuhan</label>
                            <Textarea
                              rows={5}
                              value={evt.content || evt.description}
                              onChange={(e) => updateEventItem(evt.id, { content: e.target.value })}
                              placeholder="Detail teks warta atau renungan lengkap..."
                            />
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(evt.featured)}
                                onChange={(e) => updateEventItem(evt.id, { featured: e.target.checked })}
                                className="rounded text-primary"
                              />
                              <span>Jadikan Sorotan Utama di Beranda</span>
                            </label>
                            <Button
                              size="sm"
                              onClick={() => {
                                setEditingEventId(null);
                                showToast('Warta / tulisan Firman berhasil diperbarui!');
                              }}
                              className="cursor-pointer text-xs"
                            >
                              Selesai Mengedit
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                                {evt.category}
                              </span>
                              {evt.bibleVerse && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                                  📖 {evt.bibleVerse}
                                </span>
                              )}
                              {evt.featured && (
                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-600 text-white">
                                  Sorotan Utama
                                </span>
                              )}
                              <h4 className="font-semibold text-gray-900 text-sm">{evt.title}</h4>
                            </div>
                            <div className="text-xs text-gray-600 flex items-center gap-3 flex-wrap">
                              <span>{evt.date}</span>
                              <span>•</span>
                              <span>{evt.time}</span>
                              <span>•</span>
                              <span>{evt.location}</span>
                            </div>
                            <p className="text-xs text-gray-500">{evt.description}</p>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingEventId(evt.id)}
                              className="text-gray-600 hover:text-primary hover:bg-primary/10 cursor-pointer"
                              title="Edit tulisan ini"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                deleteEvent(evt.id);
                                showToast(`"${evt.title}" dihapus`);
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                              title="Hapus tulisan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New Event / Devotional Article Form */}
                <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200 mt-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-primary" />
                    <span>C. Terbitkan Warta Jemaat atau Tulisan Firman Tuhan Baru</span>
                  </h4>
                  <form onSubmit={handleAddEvent} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Warta / Renungan Firman *</label>
                        <Input
                          required
                          value={newEventTitle}
                          onChange={(e) => setNewEventTitle(e.target.value)}
                          placeholder="Contoh: Renungan: Bertumbuh dalam Kasih Kristus"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Kategori Tulisan</label>
                        <select
                          value={newEventCategory}
                          onChange={(e) => setNewEventCategory(e.target.value)}
                          className="w-full px-3 py-2 text-sm border rounded-md bg-white focus:outline-hidden"
                        >
                          <option value="Renungan & Firman Tuhan">Renungan & Firman Tuhan</option>
                          <option value="Pengajaran Alkitab">Pengajaran Alkitab</option>
                          <option value="Warta Jemaat">Warta Jemaat</option>
                          <option value="Ibadah Khusus">Ibadah Khusus</option>
                          <option value="Retret">Retret & Pembinaan</option>
                          <option value="Diakonia">Diakonia & Kasih</option>
                          <option value="Persekutuan">Persekutuan</option>
                          <option value="Pemuda & Remaja">Pemuda & Remaja</option>
                          <option value="Pengumuman">Pengumuman Jemaat</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-amber-200/80">
                      <div>
                        <label className="block text-xs font-semibold text-amber-900 mb-1">
                          Ayat Alkitab Acuan (Opsional, misal: Filipi 4:6-7)
                        </label>
                        <Input
                          value={newEventBibleVerse}
                          onChange={(e) => setNewEventBibleVerse(e.target.value)}
                          placeholder="Contoh: Filipi 4:6-7"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-amber-900 mb-1">
                          Kutipan Ayat Alkitab (Ikut dibagikan ke WhatsApp)
                        </label>
                        <Input
                          value={newEventBibleQuote}
                          onChange={(e) => setNewEventBibleQuote(e.target.value)}
                          placeholder="Janganlah hendaknya kamu kuatir tentang apa pun juga..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Hari & Tanggal *</label>
                        <Input
                          required
                          value={newEventDate}
                          onChange={(e) => setNewEventDate(e.target.value)}
                          placeholder="Contoh: Minggu, 12 Oktober 2025"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Jam / Waktu / Rubrik</label>
                        <Input
                          value={newEventTime}
                          onChange={(e) => setNewEventTime(e.target.value)}
                          placeholder="Contoh: Renungan Pekan Ini / 09:00 WIB"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Lokasi / Keterangan</label>
                        <Input
                          value={newEventLocation}
                          onChange={(e) => setNewEventLocation(e.target.value)}
                          placeholder="Gedung Gereja GEPEKRIS Tretes"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Ringkasan Singkat (Tampil di Kartu Depan & Pesan WA)</label>
                      <Textarea
                        rows={2}
                        value={newEventDesc}
                        onChange={(e) => setNewEventDesc(e.target.value)}
                        placeholder="Ringkasan 1-2 kalimat untuk kartu halaman depan..."
                      />
                    </div>

                    <div>
                      <ImagePickerField
                        label="Foto Sampul Warta / Renungan"
                        description="Unggah dari perangkat atau tempel URL gambar."
                        currentValue={newEventImage}
                        onChange={(url) => setNewEventImage(url)}
                        onToast={showToast}
                        aspectRatio="16:9"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Penulis / Pelayan Firman / Komisi</label>
                      <Input
                        value={newEventAuthor}
                        onChange={(e) => setNewEventAuthor(e.target.value)}
                        placeholder="Contoh: Pdt. & Majelis GEPEKRIS Tretes"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Isi Lengkap Warta / Tulisan Renungan Firman Tuhan
                      </label>
                      <Textarea
                        rows={6}
                        value={newEventContent}
                        onChange={(e) => setNewEventContent(e.target.value)}
                        placeholder="Tuliskan naskah renungan firman Tuhan atau warta lengkap di sini. Gunakan baris kosong antar paragraf..."
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured-check"
                        checked={newEventFeatured}
                        onChange={(e) => setNewEventFeatured(e.target.checked)}
                        className="rounded text-primary"
                      />
                      <label htmlFor="featured-check" className="text-xs text-gray-700 cursor-pointer">
                        Tandai sebagai Sorotan Utama (Disorot di halaman depan)
                      </label>
                    </div>

                    <Button type="submit" size="sm" className="cursor-pointer">
                      Terbitkan Warta / Renungan
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Tab: Persembahan, Rekening Bank & QRIS */}
            {activeTab === 'giving' && (
              <div className="space-y-8 max-w-4xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Pengaturan Persembahan, Rekening Bank & QRIS</h3>
                  <p className="text-xs text-gray-500">
                    Kelola informasi rekening bank gereja, kode gambar QRIS, ayat firman Tuhan, dan daftar alokasi dana persembahan.
                  </p>
                </div>

                {/* 1. Judul & Ayat Firman */}
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                  <h4 className="text-sm font-bold text-gray-900">1. Judul & Ayat Pengantar Persembahan</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Utama Seksi Persembahan</label>
                      <Input
                        value={givingData.heading}
                        onChange={(e) => updateGiving({ heading: e.target.value })}
                        placeholder="Memberi dengan Sukacita"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Subjudul / Keterangan Transparansi</label>
                      <Input
                        value={givingData.subheading}
                        onChange={(e) => updateGiving({ subheading: e.target.value })}
                        placeholder="Setiap persembahan dikelola dengan penuh tanggung jawab..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Ayat Kutipan Alkitab</label>
                    <Textarea
                      rows={2}
                      value={givingData.scriptureQuote}
                      onChange={(e) => updateGiving({ scriptureQuote: e.target.value })}
                    />
                  </div>
                </div>

                {/* 2. Daftar Rekening Bank */}
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-primary" />
                      <span>2. Rekening Bank Resmi Gereja ({givingData.bankAccounts.length})</span>
                    </h4>
                  </div>

                  <div className="space-y-2.5">
                    {givingData.bankAccounts.map((acc) => (
                      <div key={acc.id} className="p-3.5 bg-white rounded-xl border border-gray-200">
                        {editingBankId === acc.id ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Bank</label>
                                <Input
                                  value={acc.bankName}
                                  onChange={(e) => updateBankAccount(acc.id, { bankName: e.target.value })}
                                  placeholder="BCA / Mandiri / BRI"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Nomor Rekening</label>
                                <Input
                                  value={acc.accountNumber}
                                  onChange={(e) => updateBankAccount(acc.id, { accountNumber: e.target.value })}
                                  placeholder="882-019-4821"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Atas Nama (a.n.)</label>
                                <Input
                                  value={acc.accountHolder}
                                  onChange={(e) => updateBankAccount(acc.id, { accountHolder: e.target.value })}
                                  placeholder="GEPEKRIS Tretes"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setEditingBankId(null);
                                  showToast('Rekening bank diperbarui!');
                                }}
                                className="cursor-pointer text-xs"
                              >
                                Selesai
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="font-bold text-sm text-gray-900">{acc.bankName}</div>
                              <div className="text-xs font-mono text-amber-800 font-semibold">{acc.accountNumber}</div>
                              <div className="text-[11px] text-gray-500">a.n. {acc.accountHolder}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingBankId(acc.id)}
                                className="text-gray-500 hover:text-primary cursor-pointer"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  deleteBankAccount(acc.id);
                                  showToast('Rekening dihapus');
                                }}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Form Tambah Rekening */}
                  <form onSubmit={handleAddBank} className="pt-2 border-t border-gray-200 space-y-3">
                    <h5 className="text-xs font-bold text-gray-700">Tambah Rekening Bank Baru</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <Input
                        required
                        value={newBankName}
                        onChange={(e) => setNewBankName(e.target.value)}
                        placeholder="Nama Bank (misal: BRI)"
                      />
                      <Input
                        required
                        value={newBankNumber}
                        onChange={(e) => setNewBankNumber(e.target.value)}
                        placeholder="Nomor Rekening"
                      />
                      <Input
                        value={newBankHolder}
                        onChange={(e) => setNewBankHolder(e.target.value)}
                        placeholder="Atas Nama (a.n.)"
                      />
                    </div>
                    <Button type="submit" size="sm" variant="outline" className="cursor-pointer text-xs">
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Tambah Rekening
                    </Button>
                  </form>
                </div>

                {/* 3. Kode Gambar QRIS */}
                <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-amber-800" />
                    <span>3. Kode QRIS Gereja (E-Wallet & Mobile Banking)</span>
                  </h4>

                  <ImagePickerField
                    label="Gambar Barcode QRIS Persembahan"
                    description="Unggah gambar QRIS resmi gereja dari HP/komputer atau gunakan tautan URL gambar."
                    currentValue={givingData.qrisImageUrl}
                    defaultValue={DEFAULT_CHURCH_CONTENT.giving.qrisImageUrl}
                    onChange={(url) => {
                      updateGiving({ qrisImageUrl: url });
                      showToast('Gambar QRIS berhasil diperbarui!');
                    }}
                    onToast={showToast}
                    aspectRatio="1:1"
                  />

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Petunjuk Bawah Gambar QRIS</label>
                    <Input
                      value={givingData.qrisLabel}
                      onChange={(e) => updateGiving({ qrisLabel: e.target.value })}
                      placeholder="Scan menggunakan BCA Mobile, Mandiri Livin, GoPay, OVO, Dana..."
                    />
                  </div>
                </div>

                {/* 4. Kategori Alokasi Dana Persembahan */}
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                  <h4 className="text-sm font-bold text-gray-900">4. Kategori Alokasi Persembahan ({givingData.funds.length})</h4>
                  <div className="space-y-2.5">
                    {givingData.funds.map((fund) => (
                      <div key={fund.id} className="p-3.5 bg-white rounded-xl border border-gray-200">
                        {editingFundId === fund.id ? (
                          <div className="space-y-2.5">
                            <Input
                              value={fund.name}
                              onChange={(e) => updateGivingFund(fund.id, { name: e.target.value })}
                              placeholder="Nama Kategori Persembahan"
                            />
                            <Textarea
                              rows={2}
                              value={fund.description}
                              onChange={(e) => updateGivingFund(fund.id, { description: e.target.value })}
                              placeholder="Penjelasan alokasi..."
                            />
                            <div className="flex justify-end">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setEditingFundId(null);
                                  showToast('Kategori persembahan diperbarui!');
                                }}
                                className="cursor-pointer text-xs"
                              >
                                Selesai
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-bold text-sm text-gray-900">{fund.name}</div>
                              <div className="text-xs text-gray-600 mt-0.5">{fund.description}</div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingFundId(fund.id)}
                                className="text-gray-500 hover:text-primary cursor-pointer"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  deleteGivingFund(fund.id);
                                  showToast('Kategori persembahan dihapus');
                                }}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddFund} className="pt-2 border-t border-gray-200 space-y-2.5">
                    <h5 className="text-xs font-bold text-gray-700">Tambah Kategori Alokasi Baru</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <Input
                        required
                        value={newFundName}
                        onChange={(e) => setNewFundName(e.target.value)}
                        placeholder="Nama Kategori (misal: Persembahan Syukur Tahunan)"
                      />
                      <Input
                        value={newFundDesc}
                        onChange={(e) => setNewFundDesc(e.target.value)}
                        placeholder="Keterangan singkat..."
                      />
                    </div>
                    <Button type="submit" size="sm" variant="outline" className="cursor-pointer text-xs">
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Tambah Kategori
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Tab 7: Backup & Reset */}
            {activeTab === 'backup' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Cadangan Data (Backup) & Reset Sistem</h3>
                  <p className="text-xs text-gray-500">
                    Unduh seluruh data konten website sebagai berkas cadangan JSON atau kembalikan ke pengaturan awal.
                  </p>
                </div>

                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900">Unduh Cadangan Data (Export JSON)</h4>
                  <p className="text-xs text-gray-600">
                    Simpan seluruh teks profil gereja, jadwal ibadah, komisi, warta, galeri, dan info persembahan ke berkas JSON di perangkat Anda.
                  </p>
                  <Button onClick={handleExportJson} className="cursor-pointer flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>Unduh Berkas Cadangan JSON</span>
                  </Button>
                </div>

                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900">Pulihkan dari Cadangan (Import JSON)</h4>
                  <p className="text-xs text-gray-600">
                    Tempelkan kode JSON cadangan Anda di bawah ini untuk memulihkan konten:
                  </p>
                  <Textarea
                    rows={4}
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder='{"info": {...}, "hero": {...}}'
                    className="font-mono text-xs"
                  />
                  <Button
                    onClick={handleImportJson}
                    disabled={!importJsonText.trim()}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Terapkan Konten dari JSON</span>
                  </Button>
                </div>

                <div className="p-5 bg-red-50/50 rounded-2xl border border-red-200/80 space-y-3">
                  <h4 className="text-sm font-semibold text-red-900">Kembalikan ke Bawaan Awal (Reset)</h4>
                  <p className="text-xs text-red-700">
                    Kembalikan seluruh isi halaman ke template bawaan resmi GEPEKRIS Tretes.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      resetToDefaults();
                      showToast('Konten berhasil dikembalikan ke bawaan awal!');
                    }}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset ke Template Awal</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Tab: Galeri & Dokumentasi Foto Kegiatan */}
            {activeTab === 'gallery' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                        Dokumentasi
                      </span>
                      <span className="text-xs text-gray-500">• Galeri Foto Gereja</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">
                      Dokumentasi & Galeri Kegiatan ({content.gallery?.length || 0})
                    </h3>
                    <p className="text-xs text-gray-600">
                      Kelola album foto dokumentasi ibadah, persekutuan pemuda, sekolah minggu, dan baksos GEPEKRIS Tretes.
                    </p>
                  </div>

                  <Button
                    onClick={handleSyncToFirestore}
                    disabled={syncingToFirestore}
                    className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer flex items-center gap-2 text-xs self-start sm:self-auto"
                    size="sm"
                  >
                    <Database className={`w-3.5 h-3.5 ${syncingToFirestore ? 'animate-spin' : ''}`} />
                    <span>{syncingToFirestore ? 'Menyimpan...' : 'Simpan ke Firebase'}</span>
                  </Button>
                </div>

                {/* Form Tambah Foto Baru */}
                <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Unggah Foto Dokumentasi Baru</h4>
                      <p className="text-xs text-gray-500">Isi keterangan foto untuk menambah dokumentasi ke galeri publik.</p>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newGalTitle.trim() || !newGalImageUrl.trim()) {
                        showError('Mohon masukkan judul dan pilih foto dokumentasi.');
                        return;
                      }
                      const imgValidation = validateImageUrlString(newGalImageUrl.trim());
                      if (!imgValidation.valid) {
                        showError(imgValidation.error || 'Format gambar tidak valid. Gunakan format JPG atau PNG.');
                        return;
                      }
                      addGalleryItem({
                        title: newGalTitle.trim(),
                        category: newGalCategory,
                        imageUrl: newGalImageUrl.trim(),
                        date: newGalDate.trim() || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                        description: newGalDesc.trim(),
                      });
                      setNewGalTitle('');
                      setNewGalImageUrl('');
                      setNewGalDate('');
                      setNewGalDesc('');
                      showToast('Foto berhasil ditambahkan ke galeri!');
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <ImagePickerField
                        label="Pilih Foto Dokumentasi *"
                        description="Unggah dari komputer/HP atau masukkan URL gambar."
                        currentValue={newGalImageUrl}
                        onChange={(url) => setNewGalImageUrl(url)}
                        onToast={showToast}
                        aspectRatio="4:3"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Judul Kegiatan / Foto *
                      </label>
                      <Input
                        required
                        value={newGalTitle}
                        onChange={(e) => setNewGalTitle(e.target.value)}
                        placeholder="Contoh: Ibadah Syukur & Perjamuan Kudus"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Kategori Kegiatan *
                        </label>
                        <select
                          value={newGalCategory}
                          onChange={(e) => setNewGalCategory(e.target.value)}
                          className="w-full px-3 py-2 text-sm border rounded-lg bg-white border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="Ibadah">Ibadah</option>
                          <option value="Pemuda">Pemuda & Remaja</option>
                          <option value="Sekolah Minggu">Sekolah Minggu</option>
                          <option value="Diakonia">Diakonia & Baksos</option>
                          <option value="Persekutuan">Persekutuan Jemaat</option>
                          <option value="Perayaan">Perayaan & Khusus</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Tanggal Kegiatan
                        </label>
                        <Input
                          value={newGalDate}
                          onChange={(e) => setNewGalDate(e.target.value)}
                          placeholder="Contoh: Minggu, 7 September 2025"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Keterangan Singkat / Momen Berkesan
                      </label>
                      <Textarea
                        rows={2}
                        value={newGalDesc}
                        onChange={(e) => setNewGalDesc(e.target.value)}
                        placeholder="Tuliskan cerita singkat tentang foto kegiatan ini..."
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        type="submit"
                        className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer flex items-center gap-2"
                        size="sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambahkan ke Galeri</span>
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Daftar Foto yang Ada */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-800">
                    Foto Dokumentasi Tersimpan ({content.gallery?.length || 0})
                  </h4>

                  {(!content.gallery || content.gallery.length === 0) ? (
                    <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-200">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Belum ada foto kegiatan di dalam galeri.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {content.gallery.map((item) => {
                        const isEditing = editingGalleryId === item.id;
                        return (
                          <div
                            key={item.id}
                            className="p-4 bg-white rounded-xl border border-gray-200 shadow-xs hover:border-amber-300 transition-colors"
                          >
                            {isEditing ? (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Foto</label>
                                  <Input
                                    value={item.title}
                                    onChange={(e) => updateGalleryItem(item.id, { title: e.target.value })}
                                  />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Kategori</label>
                                    <select
                                      value={item.category || 'Ibadah'}
                                      onChange={(e) => updateGalleryItem(item.id, { category: e.target.value })}
                                      className="w-full px-3 py-2 text-sm border rounded-lg bg-white border-gray-300"
                                    >
                                      <option value="Ibadah">Ibadah</option>
                                      <option value="Pemuda">Pemuda & Remaja</option>
                                      <option value="Sekolah Minggu">Sekolah Minggu</option>
                                      <option value="Diakonia">Diakonia & Baksos</option>
                                      <option value="Persekutuan">Persekutuan</option>
                                      <option value="Perayaan">Perayaan & Khusus</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Tanggal</label>
                                    <Input
                                      value={item.date || ''}
                                      onChange={(e) => updateGalleryItem(item.id, { date: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <ImagePickerField
                                    label="Ganti Foto Dokumentasi"
                                    description="Unggah dari HP/komputer atau masukkan tautan URL foto."
                                    currentValue={item.imageUrl}
                                    onChange={(url) => {
                                      updateGalleryItem(item.id, { imageUrl: url });
                                      showToast('Foto berhasil diperbarui!');
                                    }}
                                    onToast={showToast}
                                    aspectRatio="4:3"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi</label>
                                  <Textarea
                                    rows={2}
                                    value={item.description || ''}
                                    onChange={(e) => updateGalleryItem(item.id, { description: e.target.value })}
                                  />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingGalleryId(null)}
                                    className="cursor-pointer"
                                  >
                                    Selesai Edit
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                    <img
                                      src={item.imageUrl}
                                      alt={item.title}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                                        {item.category || 'Kegiatan'}
                                      </span>
                                      {item.date && (
                                        <span className="text-xs text-gray-500">
                                          {item.date}
                                        </span>
                                      )}
                                    </div>
                                    <h5 className="font-bold text-sm text-gray-900">{item.title}</h5>
                                    {item.description && (
                                      <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingGalleryId(item.id)}
                                    className="cursor-pointer text-gray-600 hover:text-amber-700"
                                  >
                                    <Pencil className="w-3.5 h-3.5 mr-1" />
                                    <span>Edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      deleteGalleryItem(item.id);
                                      showToast('Foto berhasil dihapus.');
                                    }}
                                    className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                                    <span>Hapus</span>
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Pustaka Media & Foto (HP & Komputer) */}
            {activeTab === 'media' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        Pustaka Media & Foto
                      </span>
                      <span className="text-xs text-gray-500">
                        {getAllIndexedMedia().length} berkas foto terdaftar
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">
                      Koleksi Media Foto Website GEPEKRIS Tretes
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Kelola dan temukan foto jemaat, gedung, kegiatan komisi, dan warta. Unggah langsung melalui kamera/galeri HP atau masukkan URL gambar web.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      onClick={() => setIsMediaModalOpen(true)}
                      className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <FolderOpen className="w-4 h-4" />
                      <span>Buka Pengelola Media Penuh</span>
                    </Button>
                  </div>
                </div>

                {/* HP Friendly Notice Box */}
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-xs text-amber-900">
                    <p className="font-semibold text-amber-950">Ramah HP & Tersimpan di Cloud Firebase</p>
                    <p className="text-amber-800 mt-0.5">
                      Setiap foto yang diunggah dikompresi secara otomatis dengan format Web-Ready JPEG sehingga halaman website tetap cepat dibuka di HP jemaat.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsMediaModalOpen(true)}
                    className="border-amber-300 text-amber-900 hover:bg-amber-100 text-xs shrink-0 cursor-pointer"
                  >
                    Unggah Foto Baru
                  </Button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      value={mediaSearchQuery}
                      onChange={(e) => setMediaSearchQuery(e.target.value)}
                      placeholder="Cari foto berdasarkan nama..."
                      className="h-9 pl-9 text-xs border-gray-200 focus:border-amber-500 rounded-xl"
                    />
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar text-xs">
                    {[
                      { id: 'all', label: 'Semua' },
                      { id: 'hero', label: 'Hero' },
                      { id: 'about', label: 'Tentang' },
                      { id: 'ministries', label: 'Komisi' },
                      { id: 'events', label: 'Warta' },
                      { id: 'gallery', label: 'Galeri' },
                      { id: 'services', label: 'Ibadah' },
                      { id: 'general', label: 'Umum' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setMediaCategoryFilter(cat.id)}
                        className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                          mediaCategoryFilter === cat.id
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Media Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {getAllIndexedMedia()
                    .filter((item) => {
                      const matchCat =
                        mediaCategoryFilter === 'all' || item.category === mediaCategoryFilter;
                      const q = mediaSearchQuery.toLowerCase().trim();
                      const matchQ =
                        !q ||
                        item.title.toLowerCase().includes(q) ||
                        (item.description && item.description.toLowerCase().includes(q));
                      return matchCat && matchQ;
                    })
                    .map((item) => (
                      <div
                        key={item.id}
                        className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                      >
                        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            loading="lazy"
                          />
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-black/70 text-amber-300 backdrop-blur-xs">
                            {item.category}
                          </span>
                        </div>
                        <div className="p-2.5 flex-1 flex flex-col justify-between">
                          <div>
                            <h5 className="text-xs font-bold text-gray-900 line-clamp-1" title={item.title}>
                              {item.title}
                            </h5>
                            {item.description && (
                              <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between gap-1 text-[11px]">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.url);
                                showToast('Tautan gambar berhasil disalin!');
                              }}
                              className="text-amber-700 hover:text-amber-800 font-medium cursor-pointer"
                            >
                              Salin URL
                            </button>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  updateHero({ bgImage: item.url });
                                  showToast(`Foto "${item.title}" dijadikan Hero Beranda!`);
                                }}
                                className="text-stone-600 hover:text-amber-700 px-1 py-0.5 rounded text-[10px] cursor-pointer"
                                title="Jadikan foto hero beranda"
                              >
                                Hero
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  updateAbout({ image: item.url });
                                  showToast(`Foto "${item.title}" dijadikan Foto Profil Gereja!`);
                                }}
                                className="text-stone-600 hover:text-sky-700 px-1 py-0.5 rounded text-[10px] cursor-pointer"
                                title="Jadikan foto profil tentang gereja"
                              >
                                Profil
                              </button>
                              {item.id.startsWith('media-') && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteMediaItem(item.id);
                                    showToast('Foto berhasil dihapus.');
                                  }}
                                  className="text-red-500 hover:text-red-700 p-0.5 rounded cursor-pointer"
                                  title="Hapus foto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Tab: Database Firebase */}
            {activeTab === 'hosting' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                      Firebase Cloud Firestore
                    </span>
                    <span className="text-xs text-gray-500">• Sinkronisasi Real-Time</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    Status Database Firebase Firestore
                  </h3>
                  <p className="text-xs text-gray-600">
                    Seluruh perubahan jadwal ibadah, warta jemaat, komisi, persembahan, galeri foto, dan pokok doa tersimpan langsung di Google Cloud Firestore dan diperbarui secara real-time.
                  </p>
                </div>

                {/* Firebase Firestore Status & Control Card */}
                <div className="p-5 bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-yellow-50/60 rounded-2xl border border-amber-300 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs shrink-0">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-gray-900">Firebase Firestore Cloud</h4>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3" /> Terhubung Aktif
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Project ID: <strong className="font-mono text-amber-800">avian-balm-mtgzl</strong>
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleSyncToFirestore}
                      disabled={syncingToFirestore}
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-xs shrink-0"
                    >
                      <Database className={`w-3.5 h-3.5 ${syncingToFirestore ? 'animate-spin' : ''}`} />
                      {syncingToFirestore ? 'Menyimpan...' : 'Sinkronkan ke Firestore'}
                    </Button>
                  </div>
                  <p className="text-xs text-amber-900 bg-white/80 rounded-xl p-2.5 border border-amber-200">
                    <strong>Sinkronisasi Otomatis Aktif:</strong> Setiap kali Anda mengedit teks atau menambah item di panel ini, sistem otomatis menyimpannya ke Firebase Firestore dalam 1 detik.
                  </p>
                </div>

                {/* Preset Profile Shortcut */}
                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Template Profil Resmi GEPEKRIS Tretes</span>
                    </h4>
                    <p className="text-[11px] text-amber-800">
                      Atur otomatis nama gereja ke GEPEKRIS Tretes, jadwal ibadah 07:30 & 10:00 WIB, dan alamat Tretes Prigen Pasuruan.
                    </p>
                  </div>
                  <Button
                    onClick={handleApplyGepekrisPreset}
                    size="sm"
                    className="cursor-pointer text-xs bg-amber-600 hover:bg-amber-700 text-white shrink-0 font-medium"
                  >
                    Terapkan Profil GEPEKRIS Tretes
                  </Button>
                </div>

                {/* Clear Cache & Hard Reload Shortcut */}
                <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
                      <span>Segarkan Cache Peramban</span>
                    </h4>
                    <p className="text-[11px] text-sky-800">
                      Bersihkan sisa memori penyimpanan lokal peramban dan muat ulang data terbaru langsung dari Firebase.
                    </p>
                  </div>
                  <Button
                    onClick={clearCacheAndStartFresh}
                    size="sm"
                    variant="outline"
                    className="cursor-pointer text-xs border-sky-300 text-sky-700 hover:bg-sky-100 shrink-0 font-medium flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Bersihkan Cache & Muat Ulang</span>
                  </Button>
                </div>

                {/* Active Collections Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <FolderOpen className="w-4 h-4 text-amber-600" />
                        <span>Dokumen church_content/main</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Aktif
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                        <span className="text-gray-500 text-[11px] block">Jadwal Ibadah</span>
                        <strong className="text-stone-900 text-sm">{content.services.length}</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                        <span className="text-gray-500 text-[11px] block">Komisi Pelayanan</span>
                        <strong className="text-stone-900 text-sm">{content.ministries.length + additionalMinistries.length}</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                        <span className="text-gray-500 text-[11px] block">Warta Kegiatan</span>
                        <strong className="text-stone-900 text-sm">{content.events.length}</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                        <span className="text-gray-500 text-[11px] block">Galeri Foto</span>
                        <strong className="text-stone-900 text-sm">{content.gallery?.length || 0}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span>Koleksi Interaktif Jemaat</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        Real-Time
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Menyimpan pokok doa jemaat (<code className="text-[11px]">prayers</code>) dan pesan sekretariat (<code className="text-[11px]">contacts</code>) secara langsung.
                    </p>
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-stone-600">
                        <span>Pembaruan Konten Terakhir:</span>
                      </div>
                      <p className="font-mono text-xs text-stone-800 font-semibold">
                        {content.lastUpdated ? new Date(content.lastUpdated).toLocaleString('id-ID') : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Manual Action & Connection Test */}
                <div className="p-5 bg-gradient-to-br from-stone-50 via-gray-50 to-amber-50/30 rounded-2xl border border-stone-200 space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Aksi & Uji Sambungan</span>
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Button
                      onClick={handleSyncToFirestore}
                      disabled={syncingToFirestore}
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-xs"
                    >
                      <Database className={`w-3.5 h-3.5 ${syncingToFirestore ? 'animate-spin' : ''}`} />
                      <span>{syncingToFirestore ? 'Menyimpan...' : 'Sinkronkan Sekarang ke Firebase'}</span>
                    </Button>

                    <Button
                      onClick={async () => {
                        setTestingConnection(true);
                        try {
                          const ok = await testConnection();
                          if (ok) {
                            showToast('✓ Sambungan ke Firebase Firestore Berhasil & Responsif!');
                          } else {
                            showError('Koneksi Firestore mengalami kendala.');
                          }
                        } finally {
                          setTestingConnection(false);
                        }
                      }}
                      disabled={testingConnection}
                      variant="outline"
                      size="sm"
                      className="cursor-pointer text-xs flex items-center gap-1.5 border-stone-300 hover:bg-stone-100"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                      <span>{testingConnection ? 'Memeriksa...' : 'Uji Koneksi Database'}</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 8: Security & Admin Authentication */}
            {activeTab === 'security' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Keamanan & Akses Admin</h3>
                  <p className="text-xs text-gray-500">
                    Kelola kata sandi untuk melindungi panel pengelola konten agar hanya pengurus yang dapat mengubah data website.
                  </p>
                </div>

                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Ganti Kata Sandi Admin</h4>
                      <p className="text-xs text-gray-500">
                        Pastikan kata sandi aman dan mudah diingat oleh tim sekretariat gereja.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleUpdatePassword} className="space-y-3.5 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Kata Sandi Saat Ini / Lama
                      </label>
                      <Input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Masukkan kata sandi lama..."
                        className="text-sm"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Kata Sandi Baru
                        </label>
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimal 4 karakter..."
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Konfirmasi Kata Sandi Baru
                        </label>
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi kata sandi baru..."
                          className="text-sm"
                        />
                      </div>
                    </div>

                    {securityStatus?.error && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{securityStatus.error}</span>
                      </div>
                    )}

                    {securityStatus?.success && (
                      <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-100">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>{securityStatus.success}</span>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between">
                      <Button
                        type="submit"
                        className="cursor-pointer text-xs font-semibold"
                        disabled={!oldPassword || !newPassword || !confirmPassword}
                      >
                        <Save className="w-3.5 h-3.5 mr-1.5" />
                        Perbarui Kata Sandi
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResetPasswordToDefault}
                        className="cursor-pointer text-xs text-gray-600 hover:text-gray-900"
                      >
                        Reset ke Bawaan ({DEFAULT_ADMIN_PASSWORD})
                      </Button>
                    </div>
                  </form>
                </div>

                <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2">
                  <h4 className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>Pintasan Cepat Mode Admin</span>
                  </h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Saat Anda login sebagai Admin, setiap bagian halaman memiliki tombol pintas <strong>"Edit Seksi Ini"</strong> agar Anda bisa langsung mengedit bagian tersebut dengan cepat. Anda juga dapat membuka panel ini kapan saja melalui:
                  </p>
                  <ul className="text-xs text-amber-900 list-disc list-inside space-y-1 pt-1 font-medium">
                    <li>Pintasan Keyboard: Tekan <kbd className="px-1.5 py-0.5 bg-white border border-amber-300 rounded font-mono text-[11px] shadow-xs">Ctrl + Shift + A</kbd> (atau <kbd className="px-1.5 py-0.5 bg-white border border-amber-300 rounded font-mono text-[11px] shadow-xs">Cmd + Shift + A</kbd>).</li>
                    <li>URL Pintas: Tambahkan <span className="font-mono text-amber-950 font-semibold bg-white/70 px-1 py-0.5 rounded">#admin</span> di akhir alamat website.</li>
                    <li>Tombol Admin di bagian paling bawah (Footer) website.</li>
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-50/80 text-xs text-gray-500">
          <div className="flex items-center gap-2 text-emerald-700 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Perubahan otomatis tersimpan & tersinkronisasi ke Firebase!</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSyncToFirestore}
              disabled={syncingToFirestore}
              className="cursor-pointer text-xs border-amber-600 text-amber-800 hover:bg-amber-50 flex items-center gap-1.5"
              title="Sinkronkan data ke Cloud Firestore"
            >
              <Database className={`w-3.5 h-3.5 ${syncingToFirestore ? 'animate-spin' : ''}`} />
              <span>{syncingToFirestore ? 'Menyimpan ke Firebase...' : 'Simpan ke Firebase'}</span>
            </Button>
            <Button size="sm" onClick={onClose} className="cursor-pointer bg-primary text-white hover:bg-primary/90">
              Selesai & Lihat Web
            </Button>
          </div>
        </div>

      </div>

      {/* Embedded Full Media Manager Modal */}
      <MediaManagerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
      />
    </div>
  );
};
