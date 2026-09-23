import React, { useState, useRef, useMemo } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
  Trash2,
  Copy,
  ExternalLink,
  Search,
  Filter,
  Grid,
  List,
  Sparkles,
  Camera,
  FolderOpen,
  Info,
  ChevronDown,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileImage,
  ArrowUpDown,
  Smartphone,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  useChurchContent,
  ChurchMediaItem,
  MediaCategory,
} from '../../context/ChurchContentContext';
import {
  validateImageFile,
  validateImageUrlString,
  MAX_RAW_IMAGE_SIZE_LABEL,
} from '../../lib/imageValidation';

interface MediaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage?: (url: string) => void;
  initialCategory?: string;
}

const CATEGORY_OPTIONS: { id: MediaCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'Semua Media', icon: '📁' },
  { id: 'hero', label: 'Hero Banner', icon: '⛪' },
  { id: 'about', label: 'Tentang Gereja', icon: '📖' },
  { id: 'ministries', label: 'Komisi & Pelayanan', icon: '🤝' },
  { id: 'events', label: 'Warta & Kegiatan', icon: '📅' },
  { id: 'gallery', label: 'Galeri Foto', icon: '🖼️' },
  { id: 'services', label: 'Jadwal Ibadah', icon: '⏰' },
  { id: 'general', label: 'Umum & Lainnya', icon: '✨' },
];

export function MediaManagerModal({
  isOpen,
  onClose,
  onSelectImage,
  initialCategory = 'all',
}: MediaManagerModalProps) {
  const {
    getAllIndexedMedia,
    addMediaItem,
    deleteMediaItem,
    updateMediaItem,
    updateHero,
    updateAbout,
  } = useChurchContent();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadForm, setShowUploadForm] = useState<boolean>(false);
  const [uploadTab, setUploadTab] = useState<'device' | 'url'>('device');

  // Form states for uploading
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<MediaCategory>('general');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newUrlInput, setNewUrlInput] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewSizeBytes, setPreviewSizeBytes] = useState<number | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Interaction feedback states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewDetailItem, setPreviewDetailItem] = useState<ChurchMediaItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Get all media (stored library + indexed website images)
  const allMedia = useMemo(() => {
    return getAllIndexedMedia();
  }, [getAllIndexedMedia]);

  // Filter media based on search query and category
  const filteredMedia = useMemo(() => {
    return allMedia.filter((item) => {
      const matchCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [allMedia, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  // Process & compress uploaded image file from mobile/desktop
  const processImageFile = async (file: File) => {
    setFormError(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setFormError(validation.error || 'Format atau ukuran berkas tidak didukung');
      return;
    }

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawSrc = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          // Optimize dimensions for web & mobile storage (max 1400px edge)
          const maxDimension = 1400;
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setPreviewUrl(optimizedDataUrl);
            setPreviewSizeBytes(Math.round(optimizedDataUrl.length * 0.75));
            if (!newTitle) {
              const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
              setNewTitle(baseName.charAt(0).toUpperCase() + baseName.slice(1));
            }
          }
          setIsProcessing(false);
        };
        img.onerror = () => {
          setFormError('Gagal memproses gambar. Format berkas mungkin rusak.');
          setIsProcessing(false);
        };
        img.src = rawSrc;
      };
      reader.onerror = () => {
        setFormError('Gagal membaca berkas dari perangkat.');
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setFormError('Terjadi kesalahan saat mengoptimalkan gambar.');
      setIsProcessing(false);
    }
  };

  // Submit media to library
  const handleSaveMedia = () => {
    setFormError(null);
    let finalUrl = '';

    if (uploadTab === 'device') {
      if (!previewUrl) {
        setFormError('Silakan pilih atau ambil foto terlebih dahulu.');
        return;
      }
      finalUrl = previewUrl;
    } else {
      if (!newUrlInput.trim()) {
        setFormError('Silakan masukkan tautan URL gambar.');
        return;
      }
      const validation = validateImageUrlString(newUrlInput.trim());
      if (!validation.valid) {
        setFormError(validation.error || 'Format URL gambar tidak valid.');
        return;
      }
      finalUrl = newUrlInput.trim();
    }

    const title = newTitle.trim() || `Foto ${new Date().toLocaleDateString('id-ID')}`;
    const added = addMediaItem({
      title,
      url: finalUrl,
      category: newCategory,
      description: newDescription.trim() || undefined,
      fileSizeBytes: previewSizeBytes,
      source: uploadTab === 'device' ? 'upload' : 'url',
    });

    showToast(`Foto "${title}" berhasil disimpan ke Pustaka Media!`);

    // Reset form
    setNewTitle('');
    setNewDescription('');
    setNewUrlInput('');
    setPreviewUrl(null);
    setPreviewSizeBytes(undefined);
    setShowUploadForm(false);

    // If in select mode, also immediately select it
    if (onSelectImage) {
      onSelectImage(added.url);
      onClose();
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Tautan gambar berhasil disalin ke papan klip!');
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  const handleDelete = (id: string, title: string) => {
    deleteMediaItem(id);
    setConfirmDeleteId(null);
    if (previewDetailItem?.id === id) {
      setPreviewDetailItem(null);
    }
    showToast(`Foto "${title}" berhasil dihapus.`);
  };

  const handleQuickApply = (item: ChurchMediaItem, target: 'hero' | 'about') => {
    if (target === 'hero') {
      updateHero({ bgImage: item.url });
      showToast(`Foto "${item.title}" diterapkan sebagai Foto Hero Beranda!`);
    } else if (target === 'about') {
      updateAbout({ image: item.url });
      showToast(`Foto "${item.title}" diterapkan sebagai Foto Tentang Gereja!`);
    }
  };

  return (
    <div
      id="media-manager-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="media-manager-modal"
        className="w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-5xl bg-neutral-900 text-neutral-100 sm:rounded-2xl border-0 sm:border border-neutral-800 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Toast feedback */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-full shadow-lg text-xs sm:text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-neutral-800 bg-neutral-900/95 sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Manajemen Media & Foto
                </h2>
                <span className="text-[11px] font-semibold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full border border-neutral-700">
                  {allMedia.length} Berkas
                </span>
              </div>
              <p className="text-xs text-neutral-400 hidden sm:block">
                Simpan, atur, dan gunakan media foto website GEPEKRIS Tretes secara praktis melalui HP atau komputer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              id="btn-toggle-upload"
              size="sm"
              variant={showUploadForm ? 'secondary' : 'default'}
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="h-9 px-3 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1.5 transition-all shadow-sm"
            >
              {showUploadForm ? (
                <>
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Tutup Form</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Tambah Foto</span>
                </>
              )}
            </Button>
            <button
              id="btn-close-media-modal"
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upload Drawer / Form Panel */}
        {showUploadForm && (
          <div
            id="media-upload-panel"
            className="border-b border-neutral-800 bg-neutral-950/90 p-4 sm:p-5 space-y-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="text-xs sm:text-sm font-semibold text-neutral-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Unggah Berkas Baru ke Pustaka
              </span>
              <div className="flex rounded-lg bg-neutral-900 p-0.5 border border-neutral-800 text-xs">
                <button
                  type="button"
                  onClick={() => setUploadTab('device')}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    uploadTab === 'device'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Galeri HP / Komputer
                </button>
                <button
                  type="button"
                  onClick={() => setUploadTab('url')}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    uploadTab === 'url'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Tautan URL Web
                </button>
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Left Column: File Dropzone / Camera */}
              <div>
                {uploadTab === 'device' ? (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) processImageFile(file);
                      }}
                    />
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) processImageFile(file);
                      }}
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-neutral-700 hover:border-amber-500/80 bg-neutral-900/60 hover:bg-neutral-900/90 rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] group"
                    >
                      {isProcessing ? (
                        <div className="flex flex-col items-center gap-2 text-amber-400">
                          <RefreshCw className="w-6 h-6 animate-spin" />
                          <span className="text-xs font-medium">Mengoptimalkan foto...</span>
                        </div>
                      ) : previewUrl ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800">
                          <img
                            src={previewUrl}
                            alt="Pratinjau"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-medium text-white gap-1.5">
                            <Upload className="w-4 h-4" />
                            Ganti Foto
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                            <Upload className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-semibold text-neutral-200">
                            Ketuk untuk Pilih Foto dari Galeri HP / Komputer
                          </p>
                          <p className="text-[11px] text-neutral-400 mt-1">
                            Format JPG, PNG (Maksimal {MAX_RAW_IMAGE_SIZE_LABEL})
                          </p>
                        </>
                      )}
                    </div>

                    {/* Quick Camera button for mobile phones */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex-1 h-9 rounded-lg border-neutral-700 hover:bg-neutral-800 text-xs font-medium text-neutral-200 flex items-center justify-center gap-1.5"
                      >
                        <Camera className="w-4 h-4 text-amber-400" />
                        <span>Kamera HP Langsung</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 h-9 rounded-lg border-neutral-700 hover:bg-neutral-800 text-xs font-medium text-neutral-200 flex items-center justify-center gap-1.5"
                      >
                        <FileImage className="w-4 h-4 text-neutral-400" />
                        <span>Buka Galeri Berkas</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* URL Input Tab */
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1">
                        URL Gambar Lengkap (HTTPS)
                      </label>
                      <Input
                        value={newUrlInput}
                        onChange={(e) => {
                          setNewUrlInput(e.target.value);
                          const val = e.target.value.trim();
                          if (val.startsWith('http://') || val.startsWith('https://')) {
                            setPreviewUrl(val);
                          }
                        }}
                        placeholder="https://images.unsplash.com/..."
                        className="h-10 text-xs bg-neutral-900 border-neutral-700 focus:border-amber-500 rounded-lg text-white"
                      />
                    </div>
                    {previewUrl && (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800">
                        <img
                          src={previewUrl}
                          alt="Pratinjau URL"
                          className="w-full h-full object-cover"
                          onError={() => {
                            setFormError('Gagal memuat pratinjau dari tautan URL tersebut.');
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Metadata form */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">
                    Judul Foto / Label Singkat <span className="text-amber-400">*</span>
                  </label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Contoh: Gedung Gereja GEPEKRIS, Retret Pemuda, ..."
                    className="h-10 text-xs bg-neutral-900 border-neutral-700 focus:border-amber-500 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">
                    Kategori Penggunaan
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as MediaCategory)}
                    className="w-full h-10 px-3 text-xs bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-lg text-white appearance-none"
                  >
                    <option value="hero">Hero Banner (Beranda Utama)</option>
                    <option value="about">Tentang Gereja (Sejarah & Profil)</option>
                    <option value="ministries">Komisi & Pelayanan</option>
                    <option value="events">Warta & Kegiatan Jemaat</option>
                    <option value="gallery">Galeri Foto Dokumentasi</option>
                    <option value="services">Jadwal Ibadah</option>
                    <option value="general">Umum & Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">
                    Keterangan Tambahan (Opsional)
                  </label>
                  <Input
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Contoh: Suasana ibadah minggu raya kedua"
                    className="h-10 text-xs bg-neutral-900 border-neutral-700 focus:border-amber-500 rounded-lg text-white"
                  />
                </div>

                <div className="pt-1 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowUploadForm(false);
                      setPreviewUrl(null);
                      setFormError(null);
                    }}
                    className="h-9 px-3 text-xs text-neutral-400 hover:text-white"
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={isProcessing}
                    onClick={handleSaveMedia}
                    className="h-9 px-4 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Simpan ke Pustaka
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar: Search, Category Filter Pills, View Mode */}
        <div className="px-4 sm:px-6 py-2.5 bg-neutral-900 border-b border-neutral-800 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari foto berdasarkan nama..."
              className="h-9 pl-9 pr-8 text-xs bg-neutral-950 border-neutral-800 rounded-lg text-white focus:border-amber-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle & Total Counter */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
            <span className="text-neutral-400 text-[11px]">
              Menampilkan <span className="font-semibold text-neutral-200">{filteredMedia.length}</span> dari {allMedia.length} foto
            </span>
            <div className="flex rounded-lg bg-neutral-950 p-0.5 border border-neutral-800">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-neutral-800 text-amber-400'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Tampilan Kisi (Grid)"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-neutral-800 text-amber-400'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Tampilan Daftar (List)"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Horizontal Filter Pills (Swipeable on Mobile) */}
        <div className="px-4 sm:px-6 py-2 bg-neutral-950/60 border-b border-neutral-800 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          {CATEGORY_OPTIONS.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 border border-neutral-750'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Media Content Area */}
        <div
          id="media-items-container"
          className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-950/40"
        >
          {filteredMedia.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <div className="w-12 h-12 rounded-2xl bg-neutral-800/80 text-neutral-500 flex items-center justify-center mb-3">
                <FileImage className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-200 mb-1">
                Tidak ada media yang cocok
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mb-4">
                {searchQuery
                  ? `Tidak ditemukan berkas foto yang cocok dengan kata kunci "${searchQuery}".`
                  : 'Belum ada foto dalam kategori ini. Anda dapat mengunggah foto baru dari HP atau komputer.'}
              </p>
              <Button
                size="sm"
                onClick={() => setShowUploadForm(true)}
                className="h-9 px-4 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                Unggah Foto Sekarang
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {filteredMedia.map((item) => {
                const isSelectedForPick = onSelectImage !== undefined;
                return (
                  <div
                    key={item.id}
                    className="group relative bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl overflow-hidden shadow-sm flex flex-col transition-all hover:shadow-md"
                  >
                    {/* Thumbnail Image Container */}
                    <div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Source/Category Badge */}
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-amber-300 border border-white/10">
                          {item.category}
                        </span>
                      </div>

                      {/* Hover / Tap overlay action */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                        <button
                          type="button"
                          onClick={() => setPreviewDetailItem(item)}
                          className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                          title="Lihat Gambar Penuh"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(item.url, item.id)}
                          className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                          title="Salin Tautan URL"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Card Info */}
                    <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4
                          className="text-xs font-semibold text-neutral-200 line-clamp-1 group-hover:text-amber-400 transition-colors"
                          title={item.title}
                        >
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-1">
                        {isSelectedForPick ? (
                          <Button
                            size="sm"
                            onClick={() => {
                              onSelectImage?.(item.url);
                              onClose();
                            }}
                            className="w-full h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center justify-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Gunakan
                          </Button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleCopyUrl(item.url, item.id)}
                              className="text-[11px] font-medium text-neutral-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                            >
                              {copiedId === item.id ? (
                                <span className="text-emerald-400 font-semibold">Tersalin!</span>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Salin</span>
                                </>
                              )}
                            </button>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setPreviewDetailItem(item)}
                                className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                                title="Detail Foto"
                              >
                                <Info className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(item.id)}
                                className="p-1.5 rounded-md text-neutral-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                                title="Hapus Foto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="space-y-2">
              {filteredMedia.map((item) => {
                const isSelectedForPick = onSelectImage !== undefined;
                return (
                  <div
                    key={item.id}
                    className="p-2 sm:p-3 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl flex items-center gap-3 transition-colors"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-neutral-950 overflow-hidden shrink-0 border border-neutral-800">
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-neutral-200 truncate">
                          {item.title}
                        </h4>
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-neutral-800 text-amber-400 border border-neutral-700 shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 truncate mt-0.5">
                        {item.description || item.url}
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-1">
                        Ditambahkan: {(() => {
                          try {
                            const d = new Date(item.uploadedAt);
                            return isNaN(d.getTime()) ? 'Baru saja' : d.toLocaleDateString('id-ID');
                          } catch {
                            return 'Baru saja';
                          }
                        })()}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isSelectedForPick ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            onSelectImage?.(item.url);
                            onClose();
                          }}
                          className="h-8 px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Pilih</span>
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyUrl(item.url, item.id)}
                            className="h-8 px-2.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg flex items-center gap-1"
                          >
                            {copiedId === item.id ? (
                              <span className="text-emerald-400 font-semibold">Tersalin!</span>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Salin</span>
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPreviewDetailItem(item)}
                            className="h-8 px-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"
                            title="Pratinjau Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="h-8 px-2 text-neutral-500 hover:text-red-400 hover:bg-red-950/50 rounded-lg"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer with Mobile Action Guidance */}
        <div className="px-4 sm:px-6 py-3 border-t border-neutral-800 bg-neutral-900/90 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
            <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Ramah HP: Foto yang diunggah dikompresi otomatis agar ringan, jernih, dan cepat disinkronkan ke hosting.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-9 px-4 rounded-lg border-neutral-700 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold"
            >
              Tutup
            </Button>
          </div>
        </div>
      </div>

      {/* Full Preview & Detail Lightbox */}
      {previewDetailItem && (
        <div
          id="media-detail-lightbox"
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-950">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                  {previewDetailItem.title}
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {previewDetailItem.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDetailItem(null)}
                className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 bg-black flex items-center justify-center p-2 overflow-hidden min-h-[220px] max-h-[50vh] sm:max-h-[60vh]">
              <img
                src={previewDetailItem.url}
                alt={previewDetailItem.title}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>

            <div className="p-4 bg-neutral-900 border-t border-neutral-800 space-y-3">
              {previewDetailItem.description && (
                <p className="text-xs text-neutral-300">
                  {previewDetailItem.description}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleCopyUrl(previewDetailItem.url, previewDetailItem.id)}
                    className="h-8 px-3 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Tautan</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickApply(previewDetailItem, 'hero')}
                    className="h-8 px-3 rounded-lg text-xs font-medium border-neutral-700 hover:bg-neutral-800 text-amber-300"
                  >
                    Jadikan Hero
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickApply(previewDetailItem, 'about')}
                    className="h-8 px-3 rounded-lg text-xs font-medium border-neutral-700 hover:bg-neutral-800 text-sky-300"
                  >
                    Jadikan Foto Profil
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(previewDetailItem.id)}
                    className="text-xs text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-950/40 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                  <Button
                    size="sm"
                    onClick={() => setPreviewDetailItem(null)}
                    className="h-8 px-4 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white"
                  >
                    Selesai
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-950/80 border border-red-800 text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Hapus Berkas Media?</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Foto ini akan dihapus dari pustaka media website.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDeleteId(null)}
                className="h-9 px-3 text-xs text-neutral-400 hover:text-white"
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const item = allMedia.find((m) => m.id === confirmDeleteId);
                  handleDelete(confirmDeleteId, item?.title || 'Berkas Foto');
                }}
                className="h-9 px-4 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white"
              >
                Ya, Hapus Foto
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
