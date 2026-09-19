import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  Plus,
  Trash2,
  Pencil,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  CloudUpload,
  RefreshCw,
  Eye,
  Sparkles,
} from 'lucide-react';
import { useChurchContent, ChurchGalleryItem } from '../context/ChurchContentContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const CATEGORIES = [
  'Semua',
  'Ibadah',
  'Pemuda',
  'Sekolah Minggu',
  'Diakonia',
  'Persekutuan',
];

export function PhotoGallery() {
  const { content, isAdmin, addGalleryItem, updateGalleryItem, deleteGalleryItem, syncToHosting } =
    useChurchContent();

  const galleryItems = content.gallery || [];

  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Admin Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChurchGalleryItem | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Ibadah');
  const [imageUrl, setImageUrl] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Filtered items
  const filteredItems = galleryItems.filter((item) => {
    if (selectedCategory === 'Semua') return true;
    return (item.category || '').toLowerCase().includes(selectedCategory.toLowerCase());
  });

  // Lightbox keyboard navigation
  useEffect(() => {
    if (activeLightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1
        );
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) =>
          prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredItems.length]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('Ibadah');
    setImageUrl('');
    setDate(
      new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );
    setDescription('');
    setImageTab('upload');
    setSyncStatus(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: ChurchGalleryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category || 'Ibadah');
    setImageUrl(item.imageUrl);
    setDate(item.date || '');
    setDescription(item.description || '');
    setImageTab(item.imageUrl.startsWith('data:') ? 'upload' : 'url');
    setSyncStatus(null);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Hapus foto dokumentasi kegiatan ini?')) {
      deleteGalleryItem(id);
    }
  };

  // Compress and handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.76);
          setImageUrl(compressedDataUrl);
        }
        setIsProcessingFile(false);
      };
      img.onerror = () => {
        setIsProcessingFile(false);
        alert('Gagal memproses berkas gambar.');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      alert('Mohon isi judul dan sediakan gambar foto kegiatan.');
      return;
    }

    if (editingItem) {
      updateGalleryItem(editingItem.id, {
        title: title.trim(),
        category,
        imageUrl: imageUrl.trim(),
        date: date.trim(),
        description: description.trim(),
      });
    } else {
      addGalleryItem({
        title: title.trim(),
        category,
        imageUrl: imageUrl.trim(),
        date: date.trim(),
        description: description.trim(),
      });
    }

    setIsModalOpen(false);
  };

  const handleQuickSyncToHosting = async () => {
    setIsSyncing(true);
    setSyncStatus('Menyimpan ke server hosting...');
    try {
      const res = await syncToHosting();
      if (res.success) {
        setSyncStatus('✓ Berhasil tersimpan di server hosting');
      } else {
        setSyncStatus(`Gagal menyimpan: ${res.message}`);
      }
    } catch {
      setSyncStatus('Terjadi kesalahan koneksi.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 5000);
    }
  };

  const activePhoto =
    activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  return (
    <section id="gallery" className="py-20 bg-stone-50/70 border-t border-stone-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 mb-3 border border-amber-200">
              <Camera className="w-3.5 h-3.5 text-amber-700" />
              <span>DOKUMENTASI & GALERI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Galeri Kegiatan Gereja
            </h2>
            <p className="mt-2 text-base sm:text-lg text-stone-600 max-w-2xl">
              Dokumentasi sukacita ibadah, persekutuan, pelayanan kasih, dan kebersamaan keluarga jemaat GEPEKRIS Tretes.
            </p>
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleOpenAddModal}
                className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer shadow-sm flex items-center gap-2"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Foto Dokumentasi</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleQuickSyncToHosting}
                disabled={isSyncing}
                className="cursor-pointer border-amber-300 text-amber-900 hover:bg-amber-50"
                size="sm"
              >
                <CloudUpload className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Push ke Hosting</span>
              </Button>
            </div>
          )}
        </div>

        {/* Sync Status Banner for Admin */}
        {isAdmin && syncStatus && (
          <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>{syncStatus}</span>
            </div>
            <button onClick={() => setSyncStatus(null)} className="text-amber-700 hover:text-amber-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'Semua'
                ? galleryItems.length
                : galleryItems.filter((i) =>
                    (i.category || '').toLowerCase().includes(cat.toLowerCase())
                  ).length;

            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-amber-800 text-amber-100'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Photo Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto">
            <Camera className="w-12 h-12 text-stone-400 mx-auto mb-3 stroke-1" />
            <h3 className="text-lg font-bold text-stone-800 mb-1">Belum Ada Dokumentasi</h3>
            <p className="text-sm text-stone-500 mb-6">
              Belum ada foto yang diunggah untuk kategori "{selectedCategory}".
            </p>
            {isAdmin && (
              <Button onClick={handleOpenAddModal} className="cursor-pointer" size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                Unggah Foto Pertama
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item, index) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                onClick={() => setActiveLightboxIndex(index)}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer relative"
              >
                {/* Photo Preview Container */}
                <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Dark gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-stone-900 text-xs font-semibold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <Eye className="w-3.5 h-3.5 text-amber-700" />
                      <span>Perbesar Foto</span>
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-stone-900/80 text-white backdrop-blur-xs shadow-xs border border-white/10">
                      {item.category || 'Kegiatan'}
                    </span>
                  </div>

                  {/* Admin Quick Action Buttons */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleOpenEditModal(item, e)}
                        className="p-2 rounded-lg bg-white/90 hover:bg-white text-stone-800 shadow-md transition-colors cursor-pointer"
                        title="Edit Foto"
                      >
                        <Pencil className="w-3.5 h-3.5 text-amber-700" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteItem(item.id, e)}
                        className="p-2 rounded-lg bg-white/90 hover:bg-red-50 text-red-600 shadow-md transition-colors cursor-pointer"
                        title="Hapus Foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {item.date && (
                      <div className="flex items-center gap-1 text-xs text-stone-500 mb-2">
                        <Calendar className="w-3 h-3 text-amber-700" />
                        <span>{item.date}</span>
                      </div>
                    )}
                    <h3 className="font-bold text-base text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1 mb-1.5">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {activeLightboxIndex !== null && activePhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLightboxIndex(null)}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveLightboxIndex(null)}
                className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Tutup (Esc)"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLightboxIndex((prev) =>
                    prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1
                  );
                }}
                className="absolute left-4 sm:left-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Foto Sebelumnya"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLightboxIndex((prev) =>
                    prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0
                  );
                }}
                className="absolute right-4 sm:right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Foto Berikutnya"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Main Content Modal Container */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="max-w-4xl w-full bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col max-h-[90vh]"
              >
                <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[65vh]">
                  <img
                    src={activePhoto.imageUrl}
                    alt={activePhoto.title}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-[65vh] object-contain"
                  />
                </div>

                {/* Lightbox Information Bar */}
                <div className="p-6 bg-stone-900 text-white border-t border-stone-800">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {activePhoto.category || 'Dokumentasi'}
                      </span>
                      {activePhoto.date && (
                        <span className="text-xs text-stone-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {activePhoto.date}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone-400">
                      {activeLightboxIndex + 1} dari {filteredItems.length} foto
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {activePhoto.title}
                  </h3>
                  {activePhoto.description && (
                    <p className="text-sm text-stone-300 leading-relaxed max-w-3xl">
                      {activePhoto.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Upload / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-stone-200 shadow-2xl relative my-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <Camera className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-bold text-stone-900">
                  {editingItem ? 'Edit Dokumentasi Foto' : 'Unggah Dokumentasi Baru'}
                </h3>
              </div>
              <p className="text-xs text-stone-500 mb-5">
                Tambahkan foto kegiatan gereja untuk dibagikan kepada seluruh jemaat dan pengunjung website.
              </p>

              <form onSubmit={handleSaveModal} className="space-y-4">
                {/* Image Input Options */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Foto Kegiatan *
                  </label>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setImageTab('upload')}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                        imageTab === 'upload'
                          ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Unggah dari Komputer / HP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('url')}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                        imageTab === 'url'
                          ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>Tautan URL Gambar</span>
                    </button>
                  </div>

                  {imageTab === 'upload' ? (
                    <div className="border-2 border-dashed border-stone-200 hover:border-amber-400 rounded-xl p-4 text-center bg-stone-50/50">
                      <input
                        type="file"
                        id="gallery-file-input"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="gallery-file-input"
                        className="cursor-pointer flex flex-col items-center justify-center"
                      >
                        <Camera className="w-8 h-8 text-stone-400 mb-1.5" />
                        <span className="text-xs font-medium text-amber-800 hover:underline">
                          Klik untuk memilih foto dari galeri HP atau komputer
                        </span>
                        <span className="text-[11px] text-stone-400 mt-1">
                          Foto otomatis dikompresi beresolusi tajam & siap sinkronisasi hosting
                        </span>
                      </label>
                      {isProcessingFile && (
                        <div className="mt-2 text-xs text-amber-700 flex items-center justify-center gap-1">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Memproses gambar...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="text-xs"
                    />
                  )}

                  {/* Image Preview */}
                  {imageUrl && (
                    <div className="mt-2.5 relative aspect-video w-full rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer"
                        title="Hapus foto"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Judul Kegiatan */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Judul Dokumentasi Kegiatan *
                  </label>
                  <Input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Ibadah Padang & Perjamuan Kudus"
                    className="text-xs"
                  />
                </div>

                {/* Kategori & Tanggal Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Kategori *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-lg bg-white border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
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
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Waktu / Tanggal Kegiatan
                    </label>
                    <Input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="Contoh: Minggu, 7 Sept 2025"
                      className="text-xs"
                    />
                  </div>
                </div>

                {/* Keterangan */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Keterangan Singkat / Cerita Kegiatan
                  </label>
                  <Textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tuliskan keterangan suasana kegiatan atau momen yang berkesan..."
                    className="text-xs"
                  />
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    * Wajib diisi
                  </span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                      size="sm"
                      className="cursor-pointer"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                    >
                      Simpan Foto
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
