import React, { useState } from 'react';
import {
  useChurchContent,
  ChurchServiceItem,
  ChurchMinistryItem,
  ChurchEventItem,
  ChurchGalleryItem,
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_CHURCH_CONTENT,
} from '../../context/ChurchContentContext';
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
  Server,
  HardDrive,
  RefreshCw,
  ExternalLink,
  Copy,
  CheckCircle2,
  Globe,
  Eye,
  EyeOff,
  Pencil,
  FolderOpen,
  Smartphone,
  Search,
  Grid,
  List,
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
    addEvent,
    deleteEvent,
    updateEventItem,
    updateGallery,
    addGalleryItem,
    deleteGalleryItem,
    updateGalleryItem,
    addMediaItem,
    deleteMediaItem,
    updateMediaItem,
    getAllIndexedMedia,
    resetToDefaults,
    importContent,
    applyGepekrisTretesPreset,
    isAdmin,
    logoutAdmin,
    updateAdminPassword,
    resetAdminPassword,
    hostingConfig,
    updateHostingConfig,
    resetHostingConfig,
    syncToHosting,
    syncFromHosting,
    testHostingConnection,
    clearCacheAndStartFresh,
  } = useChurchContent();

  const [activeTab, setActiveTab] = useState<
    'info' | 'hero' | 'about' | 'services' | 'ministries' | 'events' | 'gallery' | 'media' | 'hosting' | 'backup' | 'security'
  >('info');

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaSearchQuery, setMediaSearchQuery] = useState('');
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hosting State
  const [testingConnection, setTestingConnection] = useState(false);
  const [syncingToHosting, setSyncingToHosting] = useState(false);
  const [syncingFromHosting, setSyncingFromHosting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);

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

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('Gedung Gereja GEPEKRIS Tretes');
  const [newEventCategory, setNewEventCategory] = useState('Ibadah Khusus');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventContent, setNewEventContent] = useState('');
  const [newEventImage, setNewEventImage] = useState('');
  const [newEventAuthor, setNewEventAuthor] = useState('');
  const [newEventFeatured, setNewEventFeatured] = useState(false);

  // Inline item editing state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingMinistryId, setEditingMinistryId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);

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
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
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
    if (confirm(`Kembalikan kata sandi admin ke bawaan awal (${DEFAULT_ADMIN_PASSWORD})?`)) {
      resetAdminPassword();
      setSecurityStatus({ success: `Kata sandi berhasil dikembalikan ke bawaan: ${DEFAULT_ADMIN_PASSWORD}` });
      showToast('Kata sandi direset ke default');
    }
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
    showToast('New service schedule added!');
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
    showToast('New ministry group added!');
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
      description: newEventDesc,
      content: newEventContent || newEventDesc,
      image: newEventImage,
      author: newEventAuthor || 'Pengurus Gereja GEPEKRIS Tretes',
      featured: newEventFeatured,
    });
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventTime('');
    setNewEventDesc('');
    setNewEventContent('');
    setNewEventImage('');
    setNewEventAuthor('');
    setNewEventFeatured(false);
    showToast('Warta berita jemaat berhasil diterbitkan!');
  };

  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(content, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `church-website-content-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Content backup file downloaded!');
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      const success = importContent(parsed);
      if (success) {
        showToast('Website content restored successfully!');
        setImportJsonText('');
      } else {
        alert('Invalid JSON format for church content.');
      }
    } catch (err) {
      alert('Error parsing JSON text. Please verify valid syntax.');
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    const res = await testHostingConnection();
    setTestingConnection(false);
    setTestResult(res);
    if (res.success) {
      showToast('Koneksi ke hosting berhasil!');
    }
  };

  const handleSyncToHosting = async () => {
    setSyncingToHosting(true);
    setTestResult(null);
    const res = await syncToHosting();
    setSyncingToHosting(false);
    setTestResult(res);
    if (res.success) {
      showToast('Konten tersimpan di direktori hosting gepekristretes.org!');
    }
  };

  const handleSyncFromHosting = async () => {
    if (!confirm('Tarik data konten terbaru dari hosting gepekristretes.org? Konten lokal yang belum disimpan akan digantikan.')) {
      return;
    }
    setSyncingFromHosting(true);
    setTestResult(null);
    const res = await syncFromHosting();
    setSyncingFromHosting(false);
    setTestResult(res);
    if (res.success) {
      showToast('Konten berhasil ditarik dari server!');
    }
  };

  const handleDownloadContentPhp = () => {
    const phpCode = `<?php
/**
 * GEPEKRIS Tretes - Server Directory Storage API
 * File: public_html/api/content.php
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Token");
header("Content-Type: application/json; charset=UTF-8");

if (\$_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

define('API_SECRET_KEY', '${hostingConfig.apiSecret || 'gepekristretes2025'}');

\$baseDir = dirname(__DIR__);
\$storageDir = \$baseDir . '/data';
\$backupDir = \$storageDir . '/backups';
\$dataFile = \$storageDir . '/church_content.json';

if (!is_dir(\$storageDir)) { @mkdir(\$storageDir, 0755, true); }
if (!is_dir(\$backupDir)) { @mkdir(\$backupDir, 0755, true); }

\$action = isset(\$_GET['action']) ? trim(\$_GET['action']) : '';

if (\$action === 'ping' || \$action === 'status') {
    \$isWritable = is_writable(\$storageDir) || (!file_exists(\$storageDir) && is_writable(\$baseDir));
    echo json_encode([
        'status' => 'ok',
        'message' => 'Koneksi ke server gepekristretes.org berhasil!',
        'server_time' => date('Y-m-d H:i:s'),
        'php_version' => PHP_VERSION,
        'storage_directory' => \$storageDir,
        'directory_writable' => \$isWritable,
        'content_file_exists' => file_exists(\$dataFile),
        'file_size_bytes' => file_exists(\$dataFile) ? filesize(\$dataFile) : 0,
        'last_updated' => file_exists(\$dataFile) ? date('Y-m-d H:i:s', filemtime(\$dataFile)) : null,
        'total_backups' => is_dir(\$backupDir) ? count(glob(\$backupDir . '/*.json')) : 0
    ]);
    exit();
}

if (\$_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!file_exists(\$dataFile)) {
        http_response_code(404);
        echo json_encode([
            'status' => 'not_found',
            'message' => 'Berkas data belum dibuat di server.',
            'storage_path' => \$dataFile
        ]);
        exit();
    }
    \$raw = file_get_contents(\$dataFile);
    echo \$raw;
    exit();
}

if (\$_SERVER['REQUEST_METHOD'] === 'POST') {
    \$headers = getallheaders();
    \$token = '';
    if (isset(\$headers['X-Admin-Token'])) \$token = trim(\$headers['X-Admin-Token']);
    elseif (isset(\$headers['x-admin-token'])) \$token = trim(\$headers['x-admin-token']);
    elseif (isset(\$_SERVER['HTTP_X_ADMIN_TOKEN'])) \$token = trim(\$_SERVER['HTTP_X_ADMIN_TOKEN']);

    \$rawInput = file_get_contents('php://input');
    \$inputData = json_decode(\$rawInput, true);
    if (empty(\$token) && isset(\$inputData['api_secret'])) \$token = trim(\$inputData['api_secret']);

    if (\$token !== API_SECRET_KEY) {
        http_response_code(401);
        echo json_encode(['status' => 'unauthorized', 'message' => 'Kunci API Secret tidak valid']);
        exit();
    }

    \$contentToSave = isset(\$inputData['content']) ? \$inputData['content'] : \$inputData;
    if (!\$contentToSave || !is_array(\$contentToSave)) {
        http_response_code(400);
        echo json_encode(['status' => 'bad_request', 'message' => 'Format konten tidak valid']);
        exit();
    }

    if (file_exists(\$dataFile)) {
        @copy(\$dataFile, \$backupDir . '/content_' . date('Ymd_His') . '.json');
    }

    \$jsonStr = json_encode(\$contentToSave, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    \$bytes = file_put_contents(\$dataFile, \$jsonStr, LOCK_EX);

    if (\$bytes === false) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Gagal menulis ke berkas storage. Cek izin CHMOD 755']);
        exit();
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Konten berhasil disimpan ke direktori hosting gepekristretes.org!',
        'storage_file' => \$dataFile,
        'bytes_saved' => \$bytes,
        'saved_at' => date('Y-m-d H:i:s')
    ]);
    exit();
}

http_response_code(405);
echo json_encode(['status' => 'method_not_allowed']);
`;

    const blob = new Blob([phpCode], { type: 'application/x-php' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.php';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('File content.php siap diunggah ke cPanel!');
  };

  const handleCopyPhpCode = () => {
    const code = `<?php
// Letakkan di public_html/api/content.php pada hosting gepekristretes.org
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Token");
header("Content-Type: application/json; charset=UTF-8");
define('API_SECRET_KEY', '${hostingConfig.apiSecret || 'gepekristretes2025'}');
// ... Unduh berkas lengkap dengan tombol 'Unduh content.php'`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
    showToast('Kode berhasil disalin');
  };

  const handleApplyGepekrisPreset = () => {
    if (confirm('Terapkan template profil resmi GEPEKRIS Tretes (Pasuruan)? Jadwal ibadah, visi, dan kontak gereja akan disesuaikan.')) {
      applyGepekrisTretesPreset();
      showToast('Profil GEPEKRIS Tretes berhasil diterapkan!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                Website Content Manager
              </h2>
              <p className="text-xs text-gray-500">
                Live editor: Updates apply immediately & save automatically to your browser
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {toastMessage && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1.5 animate-in fade-in">
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
              <span className="hidden sm:inline">Logout Admin</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Modal Body with Sidebar Tabs */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Navigation Sidebar (Horizontal swipe on Mobile HP, Vertical on Desktop) */}
          <div className="w-full md:w-60 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200/80 p-2 md:p-3 flex md:flex-col gap-1.5 md:gap-1 overflow-x-auto md:overflow-y-auto shrink-0 no-scrollbar">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-2 px-3 py-2 md:px-3.5 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all text-left cursor-pointer whitespace-nowrap shrink-0 md:w-full ${
                activeTab === 'info'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
              }`}
            >
              <Building className="w-4 h-4 shrink-0" />
              <span>General & Contact</span>
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
              <span>Hero Banner</span>
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
              <span>About & Values</span>
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
              onClick={() => setActiveTab('ministries')}
              className={`flex items-center gap-2 px-3 py-2 md:px-3.5 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all text-left cursor-pointer whitespace-nowrap shrink-0 md:w-full ${
                activeTab === 'ministries'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Komisi & Pelayanan ({content.ministries.length})</span>
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
              <span>Warta Kegiatan ({content.events.length})</span>
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
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 shrink-0" />
                <span>Hosting Server</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                activeTab === 'hosting'
                  ? 'bg-white/20 text-white'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                gepekristretes.org
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
              <span>Backup & Reset</span>
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
          <div className="flex-1 p-6 overflow-y-auto bg-white">
            
            {/* Tab 1: General Info & Contact */}
            {activeTab === 'info' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Church Identity & Contact Details</h3>
                  <p className="text-xs text-gray-500">Edit church name, address, email, and live stream settings.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Church Name</label>
                    <Input
                      value={content.info.name}
                      onChange={(e) => {
                        updateInfo({ name: e.target.value });
                        showToast('Updated church name');
                      }}
                      placeholder="e.g. GEPEKRIS TRETES"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Tagline / Mission Motto</label>
                    <Input
                      value={content.info.tagline}
                      onChange={(e) => {
                        updateInfo({ tagline: e.target.value });
                        showToast('Updated tagline');
                      }}
                      placeholder="A place where faith grows..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Office Phone</label>
                      <Input
                        value={content.info.phone}
                        onChange={(e) => {
                          updateInfo({ phone: e.target.value });
                          showToast('Updated phone');
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Email</label>
                      <Input
                        value={content.info.email}
                        onChange={(e) => {
                          updateInfo({ email: e.target.value });
                          showToast('Updated email');
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Church Address</label>
                    <Input
                      value={content.info.address}
                      onChange={(e) => {
                        updateInfo({ address: e.target.value });
                        showToast('Updated address');
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Office Hours</label>
                    <Input
                      value={content.info.officeHours}
                      onChange={(e) => {
                        updateInfo({ officeHours: e.target.value });
                        showToast('Updated office hours');
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Live Stream Video URL (YouTube Embed)</label>
                    <Input
                      value={content.info.streamUrl}
                      onChange={(e) => {
                        updateInfo({ streamUrl: e.target.value });
                        showToast('Updated stream video URL');
                      }}
                      placeholder="https://www.youtube-nocookie.com/embed/..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Hero Banner */}
            {activeTab === 'hero' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Hero Section & Visual Banner</h3>
                  <p className="text-xs text-gray-500">Customize the top headline, welcoming message, and hero photo.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Hero Main Headline</label>
                    <Input
                      value={content.hero.headline}
                      onChange={(e) => {
                        updateHero({ headline: e.target.value });
                        showToast('Updated hero headline');
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Hero Sub-headline</label>
                    <Textarea
                      rows={3}
                      value={content.hero.subheadline}
                      onChange={(e) => {
                        updateHero({ subheadline: e.target.value });
                        showToast('Updated subheadline');
                      }}
                    />
                  </div>

                  <ImagePickerField
                    label="Foto Background Banner Hero"
                    description="Pilih atau unggah foto latar belakang utama website. Tersedia opsi unggah dari perangkat (HP/Komputer), link URL eksternal, atau galeri preset gereja."
                    currentValue={content.hero.bgImage}
                    defaultValue={DEFAULT_CHURCH_CONTENT.hero.bgImage}
                    onChange={(newUrl) => {
                      updateHero({ bgImage: newUrl });
                      showToast('Background hero berhasil diperbarui!');
                    }}
                    onToast={showToast}
                    presets={DEFAULT_HERO_PRESETS}
                    aspectRatio="16:9"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Sunday Notice Title</label>
                      <Input
                        value={content.hero.sundayNoteTitle}
                        onChange={(e) => {
                          updateHero({ sundayNoteTitle: e.target.value });
                          showToast('Updated notice title');
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Sunday Notice Times</label>
                      <Input
                        value={content.hero.sundayNoteTimes}
                        onChange={(e) => {
                          updateHero({ sundayNoteTimes: e.target.value });
                          showToast('Updated notice times');
                        }}
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
                  <h3 className="text-lg font-bold text-gray-900">About Section & Core Values</h3>
                  <p className="text-xs text-gray-500">Edit church history, mission paragraphs, and core values.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Section Title</label>
                    <Input
                      value={content.about.heading}
                      onChange={(e) => {
                        updateAbout({ heading: e.target.value });
                        showToast('Updated section heading');
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Story Paragraph 1</label>
                    <Textarea
                      rows={3}
                      value={content.about.paragraph1}
                      onChange={(e) => {
                        updateAbout({ paragraph1: e.target.value });
                        showToast('Updated paragraph 1');
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Story Paragraph 2</label>
                    <Textarea
                      rows={3}
                      value={content.about.paragraph2}
                      onChange={(e) => {
                        updateAbout({ paragraph2: e.target.value });
                        showToast('Updated paragraph 2');
                      }}
                    />
                  </div>

                  <ImagePickerField
                    label="Foto Tentang Kami / Komunitas"
                    description="Foto kebersamaan jemaat atau aktivitas gereja pada bagian Tentang Kami."
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
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">4 Core Values</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {content.about.values.map((val, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                          <label className="block text-[11px] font-bold text-gray-600 mb-1">
                            Value #{idx + 1}
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
                  <h3 className="text-lg font-bold text-gray-900">Service Times & Schedules</h3>
                  <p className="text-xs text-gray-500">Manage worship services displayed on the homepage.</p>
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
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Waktu / Jadwal (pisahkan koma jika lebih dari satu)</label>
                            <Input
                              value={Array.isArray(srv.times) ? srv.times.join(', ') : (srv.times || '')}
                              onChange={(e) => updateServiceItem(srv.id, { times: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                              placeholder="contoh: 07:30 WIB, 10:00 WIB"
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
                                showToast(`Removed "${srv.name}"`);
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                              title="Delete this service"
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
                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 mt-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-primary" />
                    <span>Add New Service Schedule</span>
                  </h4>
                  <form onSubmit={handleAddService} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Service Name *</label>
                      <Input
                        required
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        placeholder="e.g. Saturday Youth Night"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Times (comma separated) *</label>
                      <Input
                        required
                        value={newServiceTimes}
                        onChange={(e) => setNewServiceTimes(e.target.value)}
                        placeholder="e.g. 5:00 PM, 7:00 PM"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                      <Input
                        value={newServiceDesc}
                        onChange={(e) => setNewServiceDesc(e.target.value)}
                        placeholder="Brief description of the service..."
                      />
                    </div>
                    <Button type="submit" size="sm" className="cursor-pointer">
                      Add Service
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Tab 5: Ministries */}
            {activeTab === 'ministries' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Ministries & Groups</h3>
                  <p className="text-xs text-gray-500">Edit, add, or remove church ministries and departments.</p>
                </div>

                {/* Existing Ministries */}
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
                            <label className="block text-xs font-semibold text-gray-700 mb-1">URL Gambar Cover</label>
                            <Input
                              value={min.image}
                              onChange={(e) => updateMinistryItem(min.id, { image: e.target.value })}
                              placeholder="https://..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Fokus / Tag (pisahkan koma)</label>
                            <Input
                              value={min.features.join(', ')}
                              onChange={(e) => updateMinistryItem(min.id, { features: e.target.value.split(',').map(f => f.trim()).filter(Boolean) })}
                              placeholder="Fokus 1, Fokus 2"
                            />
                          </div>
                          <div className="flex justify-end pt-1">
                            <Button
                              size="sm"
                              onClick={() => {
                                setEditingMinistryId(null);
                                showToast('Pelayanan diperbarui!');
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
                            <div className="h-28 w-full rounded-lg overflow-hidden mb-2 bg-gray-200">
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
                                showToast(`Removed "${min.title}"`);
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New Ministry Form */}
                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 mt-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-primary" />
                    <span>Add New Ministry</span>
                  </h4>
                  <form onSubmit={handleAddMinistry} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Ministry Title *</label>
                      <Input
                        required
                        value={newMinTitle}
                        onChange={(e) => setNewMinTitle(e.target.value)}
                        placeholder="e.g. Creative Arts & Music"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Description *</label>
                      <Textarea
                        rows={2}
                        required
                        value={newMinDesc}
                        onChange={(e) => setNewMinDesc(e.target.value)}
                        placeholder="Purpose and vision of this ministry..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Cover Image URL</label>
                      <Input
                        value={newMinImage}
                        onChange={(e) => setNewMinImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Key Features (comma separated)</label>
                      <Input
                        value={newMinFeatures}
                        onChange={(e) => setNewMinFeatures(e.target.value)}
                        placeholder="Worship Choir, Audio Engineering, Media"
                      />
                    </div>
                    <Button type="submit" size="sm" className="cursor-pointer">
                      Add Ministry
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Tab 6: Events */}
            {activeTab === 'events' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Upcoming Church Events</h3>
                  <p className="text-xs text-gray-500">Publish special services, retreats, and outreach activities.</p>
                </div>

                {/* Events list */}
                <div className="space-y-3">
                  {content.events.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      {editingEventId === evt.id ? (
                        <div className="space-y-3 bg-white p-3 rounded-lg border border-primary/30">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Warta / Kegiatan</label>
                            <Input
                              value={evt.title}
                              onChange={(e) => updateEventItem(evt.id, { title: e.target.value })}
                              placeholder="Judul Warta"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Tanggal</label>
                              <Input
                                value={evt.date}
                                onChange={(e) => updateEventItem(evt.id, { date: e.target.value })}
                                placeholder="Tanggal"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Waktu</label>
                              <Input
                                value={evt.time}
                                onChange={(e) => updateEventItem(evt.id, { time: e.target.value })}
                                placeholder="Waktu"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Lokasi</label>
                              <Input
                                value={evt.location}
                                onChange={(e) => updateEventItem(evt.id, { location: e.target.value })}
                                placeholder="Lokasi"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Ringkasan Singkat</label>
                            <Input
                              value={evt.description}
                              onChange={(e) => updateEventItem(evt.id, { description: e.target.value })}
                              placeholder="Ringkasan singkat..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Isi Berita / Warta Lengkap</label>
                            <Textarea
                              rows={3}
                              value={evt.content || evt.description}
                              onChange={(e) => updateEventItem(evt.id, { content: e.target.value })}
                              placeholder="Detail teks warta lengkap..."
                            />
                          </div>
                          <div className="flex justify-end pt-1">
                            <Button
                              size="sm"
                              onClick={() => {
                                setEditingEventId(null);
                                showToast('Warta / kegiatan diperbarui!');
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
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                                {evt.category}
                              </span>
                              {evt.featured && (
                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                                  Featured
                                </span>
                              )}
                              <h4 className="font-semibold text-gray-900 text-sm">{evt.title}</h4>
                            </div>
                            <div className="text-xs text-gray-600 flex items-center gap-3">
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
                              title="Edit warta ini"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                deleteEvent(evt.id);
                                showToast(`Removed "${evt.title}"`);
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                              title="Delete event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New Event Form */}
                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 mt-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-primary" />
                    <span>Publish New Event</span>
                  </h4>
                  <form onSubmit={handleAddEvent} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Event Title *</label>
                        <Input
                          required
                          value={newEventTitle}
                          onChange={(e) => setNewEventTitle(e.target.value)}
                          placeholder="e.g. Christmas Eve Candlelight"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                        <select
                          value={newEventCategory}
                          onChange={(e) => setNewEventCategory(e.target.value)}
                          className="w-full px-3 py-2 text-sm border rounded-md bg-white focus:outline-hidden"
                        >
                          <option value="Special Service">Special Service</option>
                          <option value="Outreach">Outreach</option>
                          <option value="Fellowship">Fellowship</option>
                          <option value="Youth">Youth</option>
                          <option value="Special Event">Special Event</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Date *</label>
                        <Input
                          required
                          value={newEventDate}
                          onChange={(e) => setNewEventDate(e.target.value)}
                          placeholder="e.g. December 24, 2024"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Time</label>
                        <Input
                          value={newEventTime}
                          onChange={(e) => setNewEventTime(e.target.value)}
                          placeholder="e.g. 7:00 PM"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                        <Input
                          value={newEventLocation}
                          onChange={(e) => setNewEventLocation(e.target.value)}
                          placeholder="e.g. Main Sanctuary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Ringkasan Singkat (Muncul di Kartu Berita)</label>
                      <Textarea
                        rows={2}
                        value={newEventDesc}
                        onChange={(e) => setNewEventDesc(e.target.value)}
                        placeholder="Ringkasan 1-2 kalimat untuk preview di halaman depan..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Foto Berita (URL Gambar / Hosting)</label>
                        <Input
                          value={newEventImage}
                          onChange={(e) => setNewEventImage(e.target.value)}
                          placeholder="https://domainanda.com/uploads/foto.jpg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Penulis / Komisi</label>
                        <Input
                          value={newEventAuthor}
                          onChange={(e) => setNewEventAuthor(e.target.value)}
                          placeholder="Contoh: Majelis GEPEKRIS Tretes"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Isi Artikel Berita Lengkap (Tampilan Pembaca / Blogspot)
                      </label>
                      <Textarea
                        rows={5}
                        value={newEventContent}
                        onChange={(e) => setNewEventContent(e.target.value)}
                        placeholder="Tuliskan naskah berita lengkap di sini. Gunakan baris kosong antar paragraf..."
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
                        Mark as Featured Event (highlighted banner)
                      </label>
                    </div>

                    <Button type="submit" size="sm" className="cursor-pointer">
                      Publish Event
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Tab 7: Backup & Reset */}
            {activeTab === 'backup' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Backup & System Reset</h3>
                  <p className="text-xs text-gray-500">
                    Export your custom content as a JSON file or restore default church data.
                  </p>
                </div>

                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900">Export / Download Backup</h4>
                  <p className="text-xs text-gray-600">
                    Save all current church text, services, ministries, and events to a local JSON file.
                  </p>
                  <Button onClick={handleExportJson} className="cursor-pointer flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </Button>
                </div>

                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900">Import / Restore Backup</h4>
                  <p className="text-xs text-gray-600">
                    Paste content JSON code below to restore previous edits:
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
                    <span>Apply Imported Content</span>
                  </Button>
                </div>

                <div className="p-5 bg-red-50/50 rounded-2xl border border-red-200/80 space-y-3">
                  <h4 className="text-sm font-semibold text-red-900">Reset to Factory Defaults</h4>
                  <p className="text-xs text-red-700">
                    Clear all customized browser edits and return to the original default church content.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Are you sure you want to restore default content? Your local edits will be cleared.')) {
                        resetToDefaults();
                        showToast('Reset to original default content!');
                      }
                    }}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Everything</span>
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
                    onClick={async () => {
                      setSyncingToHosting(true);
                      const res = await syncToHosting();
                      setSyncingToHosting(false);
                      if (res.success) {
                        showToast('✓ Berhasil disimpan ke hosting server!');
                      } else {
                        alert(`Gagal push ke hosting: ${res.message}`);
                      }
                    }}
                    disabled={syncingToHosting}
                    className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer flex items-center gap-2 text-xs self-start sm:self-auto"
                    size="sm"
                  >
                    <Server className={`w-3.5 h-3.5 ${syncingToHosting ? 'animate-spin' : ''}`} />
                    <span>{syncingToHosting ? 'Menyimpan...' : 'Simpan ke Hosting (Push)'}</span>
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
                        alert('Mohon masukkan judul dan foto dokumentasi.');
                        return;
                      }
                      const imgValidation = validateImageUrlString(newGalImageUrl.trim());
                      if (!imgValidation.valid) {
                        alert(imgValidation.error || 'Format gambar tidak valid. Gunakan format JPG atau PNG.');
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
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Foto Kegiatan (Pilih Berkas atau Tautan URL) *
                      </label>
                      <ImagePickerField
                        label="Pilih Foto Dokumentasi"
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
                                      if (confirm(`Hapus foto "${item.title}"?`)) {
                                        deleteGalleryItem(item.id);
                                        showToast('Foto berhasil dihapus.');
                                      }
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
                      className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
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
                    <p className="font-semibold text-amber-950">Ramah HP & Ringan untuk Hosting gepekristretes.org</p>
                    <p className="text-amber-800 mt-0.5">
                      Setiap foto yang diunggah dikompresi secara otomatis dengan format Web-Ready JPEG (maksimal 1400px edge, kompresi 85%), sehingga halaman website tetap kencang dibuka di HP jemaat dan hemat kuota hosting.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsMediaModalOpen(true)}
                    className="border-amber-300 text-amber-900 hover:bg-amber-100 text-xs shrink-0"
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
                        className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
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
                              className="text-amber-700 hover:text-amber-800 font-medium"
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
                                className="text-stone-600 hover:text-amber-700 px-1 py-0.5 rounded text-[10px]"
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
                                className="text-stone-600 hover:text-sky-700 px-1 py-0.5 rounded text-[10px]"
                                title="Jadikan foto profil tentang gereja"
                              >
                                Profil
                              </button>
                              {item.id.startsWith('media-') && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Hapus foto "${item.title}" dari pustaka?`)) {
                                      deleteMediaItem(item.id);
                                      showToast('Foto berhasil dihapus.');
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-700 p-0.5 rounded"
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

            {/* Tab: Hosting & Server Directory (gepekristretes.org) */}
            {activeTab === 'hosting' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                      gepekristretes.org
                    </span>
                    <span className="text-xs text-gray-500">• Server Directory Storage</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    Penyimpanan Direktori di Hosting gepekristretes.org
                  </h3>
                  <p className="text-xs text-gray-600">
                    Hubungkan CMS website ini langsung ke penyimpanan direktori hosting Anda. Setiap perubahan jadwal, warta jemaat, dan pengumuman akan tersimpan permanen di folder server dan otomatis dimuat oleh seluruh jemaat.
                  </p>
                </div>

                {/* Connection Status & Quick Sync Dashboard */}
                <div className="p-5 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-cyan-50/50 rounded-2xl border border-emerald-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Server className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          <span>Status Sinkronisasi Hosting</span>
                          {hostingConfig.lastSyncStatus === 'success' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3" /> Tersinkron
                            </span>
                          )}
                          {hostingConfig.lastSyncStatus === 'syncing' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300 animate-pulse">
                              <RefreshCw className="w-3 h-3 animate-spin" /> Sedang Proses...
                            </span>
                          )}
                          {hostingConfig.lastSyncStatus === 'error' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
                              <AlertCircle className="w-3 h-3" /> Perlu Cek
                            </span>
                          )}
                          {hostingConfig.lastSyncStatus === 'idle' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                              Siap Sinkron
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-gray-600 font-mono">
                          {hostingConfig.serverUrl}
                        </p>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 text-left sm:text-right">
                      {hostingConfig.lastSyncTime ? (
                        <span>
                          Sinkron terakhir:{' '}
                          {(() => {
                            try {
                              const d = new Date(hostingConfig.lastSyncTime);
                              return isNaN(d.getTime())
                                ? '-'
                                : d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
                            } catch {
                              return '-';
                            }
                          })()}
                        </span>
                      ) : (
                        <span className="italic text-gray-400">Belum pernah disinkronkan sesi ini</span>
                      )}
                    </div>
                  </div>

                  {/* Sync Actions Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <Button
                      onClick={handleSyncToHosting}
                      disabled={syncingToHosting || testingConnection}
                      className="cursor-pointer text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-1.5 shadow-xs py-2"
                    >
                      <Upload className={`w-3.5 h-3.5 ${syncingToHosting ? 'animate-bounce' : ''}`} />
                      <span>{syncingToHosting ? 'Menyimpan...' : 'Simpan ke Hosting (Push)'}</span>
                    </Button>

                    <Button
                      onClick={handleSyncFromHosting}
                      disabled={syncingFromHosting || testingConnection}
                      variant="outline"
                      className="cursor-pointer text-xs font-semibold text-teal-800 border-teal-300 hover:bg-teal-100/60 flex items-center justify-center gap-1.5 py-2"
                    >
                      <Download className={`w-3.5 h-3.5 ${syncingFromHosting ? 'animate-bounce' : ''}`} />
                      <span>{syncingFromHosting ? 'Mengunduh...' : 'Tarik dari Hosting (Pull)'}</span>
                    </Button>

                    <Button
                      onClick={handleTestConnection}
                      disabled={testingConnection || syncingToHosting}
                      variant="outline"
                      className="cursor-pointer text-xs font-semibold text-gray-700 border-gray-300 hover:bg-white flex items-center justify-center gap-1.5 py-2"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                      <span>{testingConnection ? 'Menguji...' : 'Uji Koneksi (Ping)'}</span>
                    </Button>
                  </div>

                  {/* Test or Sync Result Alert */}
                  {testResult && (
                    <div className={`p-3.5 rounded-xl border text-xs leading-relaxed animate-in fade-in flex items-start gap-2.5 ${
                      testResult.success
                        ? 'bg-emerald-100/90 text-emerald-900 border-emerald-300'
                        : 'bg-amber-100/90 text-amber-900 border-amber-300'
                    }`}>
                      {testResult.success ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                      )}
                      <div className="flex-1 space-y-1">
                        <p className="font-semibold">{testResult.message}</p>
                        {testResult.details && (
                          <div className="mt-1 pt-1 border-t border-black/10 font-mono text-[11px] text-gray-800 space-y-0.5">
                            {testResult.details.storage_directory && (
                              <div>Direktori: <strong>{testResult.details.storage_directory}</strong></div>
                            )}
                            {testResult.details.directory_writable !== undefined && (
                              <div>Izin Tulis Server: <strong className={testResult.details.directory_writable ? 'text-emerald-700' : 'text-red-700'}>
                                {testResult.details.directory_writable ? 'Dapat Menulis (Writable)' : 'Perlu CHMOD 755'}
                              </strong></div>
                            )}
                            {testResult.details.bytes_saved && (
                              <div>Ukuran Terkirim: <strong>{testResult.details.bytes_saved} bytes</strong></div>
                            )}
                            {testResult.details.last_updated && (
                              <div>Waktu File Server: <strong>{testResult.details.last_updated}</strong></div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Preset Profile Shortcut */}
                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Template Profil Resmi GEPEKRIS Tretes</span>
                    </h4>
                    <p className="text-[11px] text-amber-800">
                      Otomatis atur nama gereja ke GEPEKRIS Tretes, jadwal ibadah 07.30 & 10.00 WIB, alamat Tretes Prigen Pasuruan.
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
                      <span>Hapus Cache Browser & Mulai Baru</span>
                    </h4>
                    <p className="text-[11px] text-sky-800">
                      Sistem otomatis membersihkan cache saat pertama kali dibuka. Klik tombol ini kapan saja untuk membersihkan sisa cache memori dan memuat data terbaru secara instan.
                    </p>
                  </div>
                  <Button
                    onClick={clearCacheAndStartFresh}
                    size="sm"
                    variant="outline"
                    className="cursor-pointer text-xs border-sky-300 text-sky-700 hover:bg-sky-100 shrink-0 font-medium flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Hapus Cache & Reload</span>
                  </Button>
                </div>

                {/* Server Directory Configuration Form */}
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-4">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-semibold text-gray-900">
                      Konfigurasi Parameter Hosting & API
                    </h4>
                  </div>

                  <div className="space-y-3.5">
                    {/* Server URL */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-gray-700">
                          URL Endpoint API Direktori (content.php)
                        </label>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => updateHostingConfig({ serverUrl: 'https://gepekristretes.org/api/content.php' })}
                            className="text-[10px] text-primary hover:underline font-mono"
                          >
                            [Domain Asli]
                          </button>
                          <button
                            type="button"
                            onClick={() => updateHostingConfig({ serverUrl: '/api/content.php' })}
                            className="text-[10px] text-primary hover:underline font-mono"
                          >
                            [Relatif /api/]
                          </button>
                        </div>
                      </div>
                      <Input
                        value={hostingConfig.serverUrl}
                        onChange={(e) => updateHostingConfig({ serverUrl: e.target.value.trim() })}
                        placeholder="https://gepekristretes.org/api/content.php"
                        className="font-mono text-xs"
                      />
                      <p className="text-[11px] text-gray-500 mt-1">
                        Alamat URL di mana file <code>content.php</code> dapat diakses dari browser.
                      </p>
                    </div>

                    {/* API Secret Token */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Kunci Rahasia API (API Secret Key)
                      </label>
                      <div className="relative">
                        <Input
                          type={showApiSecret ? "text" : "password"}
                          value={hostingConfig.apiSecret}
                          onChange={(e) => updateHostingConfig({ apiSecret: e.target.value.trim() })}
                          placeholder="gepekristretes2025"
                          className="font-mono text-xs pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiSecret(!showApiSecret)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          {showApiSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Kunci otentikasi pengamanan agar hanya admin yang dapat menulis data ke server hosting.
                      </p>
                    </div>

                    {/* Server Storage Path */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Target Lokasi Berkas JSON di Server
                        </label>
                        <Input
                          value={hostingConfig.storagePath}
                          onChange={(e) => updateHostingConfig({ storagePath: e.target.value })}
                          className="font-mono text-xs bg-gray-100 text-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Folder Backup Otomatis
                        </label>
                        <Input
                          disabled
                          value="public_html/data/backups/"
                          className="font-mono text-xs bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Automation Checkboxes */}
                    <div className="space-y-2 pt-2 border-t border-gray-200/70">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hostingConfig.autoLoad}
                          onChange={(e) => updateHostingConfig({ autoLoad: e.target.checked })}
                          className="rounded text-primary focus:ring-primary h-4 w-4"
                        />
                        <span className="text-xs text-gray-700">
                          <strong>Otomatis muat konten server</strong> saat pengunjung membuka website gepekristretes.org
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hostingConfig.enabled}
                          onChange={(e) => updateHostingConfig({ enabled: e.target.checked })}
                          className="rounded text-primary focus:ring-primary h-4 w-4"
                        />
                        <span className="text-xs text-gray-700">
                          Aktifkan integrasi hosting gepekristretes.org
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Deployment Guide & File Download Card */}
                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-5 h-5 text-blue-700" />
                      <div>
                        <h4 className="text-sm font-semibold text-blue-950">
                          Panduan Unggah ke cPanel gepekristretes.org
                        </h4>
                        <p className="text-xs text-blue-800">
                          Ikuti 3 langkah mudah ini untuk mengaktifkan penyimpanan di hosting Anda:
                        </p>
                      </div>
                    </div>
                    <a
                      href="/gepekristretes-guide.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 underline"
                    >
                      <span>Buka Panduan Lengkap</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-blue-100 shadow-2xs space-y-1">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px]">
                        1
                      </span>
                      <p className="font-semibold text-gray-900">Unduh Berkas PHP</p>
                      <p className="text-[11px] text-gray-600">
                        Unduh script <code>content.php</code> yang sudah disesuaikan dengan kunci rahasia Anda.
                      </p>
                      <Button
                        onClick={handleDownloadContentPhp}
                        size="sm"
                        variant="outline"
                        className="w-full mt-2 text-[11px] cursor-pointer border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Download className="w-3 h-3 mr-1" /> Unduh content.php
                      </Button>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-blue-100 shadow-2xs space-y-1">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px]">
                        2
                      </span>
                      <p className="font-semibold text-gray-900">Buka cPanel</p>
                      <p className="text-[11px] text-gray-600">
                        Login ke cPanel <code>gepekristretes.org</code> &rarr; buka <strong>File Manager</strong> &rarr; masuk ke folder <code>public_html/</code>.
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-blue-100 shadow-2xs space-y-1">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px]">
                        3
                      </span>
                      <p className="font-semibold text-gray-900">Buat Folder & Upload</p>
                      <p className="text-[11px] text-gray-600">
                        Buat folder <code>api</code> di dalam <code>public_html/</code>, lalu upload <code>content.php</code>. Folder <code>data</code> otomatis dibuat server!
                      </p>
                    </div>
                  </div>

                  {/* Code Snippet Box */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs text-blue-900 mb-1">
                      <span className="font-semibold">Kode PHP API (public_html/api/content.php):</span>
                      <button
                        type="button"
                        onClick={handleCopyPhpCode}
                        className="flex items-center gap-1 text-[11px] text-blue-700 hover:underline cursor-pointer"
                      >
                        {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCode ? 'Tersalin!' : 'Salin Kode'}</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-gray-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto max-h-36">
{`<?php
// Endpoint API Penyimpanan Direktori GEPEKRIS Tretes
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Token");
header("Content-Type: application/json; charset=UTF-8");
define('API_SECRET_KEY', '${hostingConfig.apiSecret}');
$dataFile = dirname(__DIR__) . '/data/church_content.json';
// Otomatis menyimpan backup dan melayani permintaan sinkronisasi dari CMS.`}
                    </pre>
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
                    Kelola kata sandi untuk melindungi editor konten agar hanya pengurus/admin yang dapat mengubah data website.
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
                    <span>Mode Admin Tersembunyi (Stealth Mode)</span>
                  </h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Mode dan bilah tombol admin disembunyikan sepenuhnya dari tampilan publik agar website tampil bersih dan anggun bagi para jemaat dan pengunjung umum. Anda dapat membuka kembali editor ini kapan saja menggunakan salah satu cara berikut:
                  </p>
                  <ul className="text-xs text-amber-900 list-disc list-inside space-y-1 pt-1 font-medium">
                    <li>Pintasan Keyboard: Tekan <kbd className="px-1.5 py-0.5 bg-white border border-amber-300 rounded font-mono text-[11px] shadow-xs">Ctrl + Shift + A</kbd> (atau <kbd className="px-1.5 py-0.5 bg-white border border-amber-300 rounded font-mono text-[11px] shadow-xs">Cmd + Shift + A</kbd>).</li>
                    <li>URL Rahasia: Ketikkan <span className="font-mono text-amber-950 font-semibold bg-white/70 px-1 py-0.5 rounded">#admin</span> di akhir tautan peramban Anda.</li>
                    <li>Ikon Gembok Halus: Klik ikon gembok kecil di sudut kanan paling bawah (footer) website.</li>
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
            <span>Perubahan langsung tersimpan & tampil di web!</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSyncToHosting}
              disabled={syncingToHosting}
              className="cursor-pointer text-xs border-emerald-600 text-emerald-700 hover:bg-emerald-50 flex items-center gap-1.5"
              title="Kirim dan simpan data ke server hosting gepekristretes.org"
            >
              <Server className="w-3.5 h-3.5" />
              <span>{syncingToHosting ? 'Menyimpan ke Hosting...' : 'Simpan ke Hosting (Push)'}</span>
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
