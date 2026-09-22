import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Trash2,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  validateImageFile,
  validateImageUrlString,
  MAX_RAW_IMAGE_SIZE_LABEL,
} from '../../lib/imageValidation';

export interface ImagePreset {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
  description?: string;
}

interface ImagePickerFieldProps {
  label: string;
  description?: string;
  currentValue: string;
  defaultValue?: string;
  onChange: (newUrl: string) => void;
  onToast?: (message: string) => void;
  presets?: ImagePreset[];
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
}

export const DEFAULT_HERO_PRESETS: ImagePreset[] = [
  {
    id: 'sanctuary-classic',
    name: 'Sanctuary Klasik',
    description: 'Ruang ibadah hangat dengan altar dan bangku kayu',
    url: 'https://images.unsplash.com/photo-1724398932316-e0d488b96e15?auto=format&fit=crop&w=1600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1724398932316-e0d488b96e15?auto=format&fit=crop&w=320&q=70',
  },
  {
    id: 'worship-light',
    name: 'Worship & Pujian',
    description: 'Panggung ibadah dengan tata cahaya hangat',
    url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=320&q=70',
  },
  {
    id: 'fellowship-people',
    name: 'Persekutuan Jemaat',
    description: 'Kebersamaan dan doa hangat jemaat',
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=320&q=70',
  },
  {
    id: 'cross-altar',
    name: 'Salib & Fajar',
    description: 'Salib kristiani bermandikan fajar terang',
    url: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=320&q=70',
  },
  {
    id: 'nature-mountains',
    name: 'Nuansa Pegunungan',
    description: 'Suasana sejuk pegunungan khas Tretes Prigen',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=320&q=70',
  },
  {
    id: 'cathedral-stained',
    name: 'Gedung Katedral',
    description: 'Arsitektur katedral megah dengan kaca patri',
    url: 'https://images.unsplash.com/photo-1548625361-1959779dfb0f?auto=format&fit=crop&w=1600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1548625361-1959779dfb0f?auto=format&fit=crop&w=320&q=70',
  },
];

export function ImagePickerField({
  label,
  description,
  currentValue,
  defaultValue,
  onChange,
  onToast,
  presets = DEFAULT_HERO_PRESETS,
  aspectRatio = '16:9',
}: ImagePickerFieldProps) {
  const [activeMode, setActiveMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState<string>(currentValue || '');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [imgLoadStatus, setImgLoadStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal URL state when currentValue changes from outside
  useEffect(() => {
    setUrlInput(currentValue || '');
    setValidationError(null);
  }, [currentValue]);

  // Test load image whenever currentValue changes
  useEffect(() => {
    if (!currentValue) {
      setImgLoadStatus('error');
      return;
    }
    setImgLoadStatus('loading');
    const testImg = new window.Image();
    testImg.referrerPolicy = 'no-referrer';
    testImg.onload = () => setImgLoadStatus('loaded');
    testImg.onerror = () => setImgLoadStatus('error');
    testImg.src = currentValue;
  }, [currentValue]);

  // Resizes large images to fit safely within browser storage and payload limits
  const processImageFile = async (file: File) => {
    // 1. Client-side format (JPG/PNG) and size (<=5MB) validation
    const validation = validateImageFile(file);
    if (!validation.valid) {
      const errorMsg = validation.error || 'Berkas gambar tidak memenuhi syarat.';
      setValidationError(errorMsg);
      onToast?.(errorMsg);
      // Existing state is completely preserved, preventing state reset!
      return;
    }

    setValidationError(null);
    setIsProcessing(true);
    try {
      const compressedDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new window.Image();
          img.onload = () => {
            let { width, height } = img;
            const maxDimension = 1200;
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
            if (!ctx) {
              resolve(e.target?.result as string);
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            // Compress to high-efficiency JPEG (~60KB-120KB)
            const dataUrl = canvas.toDataURL('image/jpeg', 0.76);
            resolve(dataUrl);
          };
          img.onerror = () => reject(new Error('Gagal memproses gambar'));
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Gagal membaca berkas'));
        reader.readAsDataURL(file);
      });

      setUrlInput(compressedDataUrl);
      onChange(compressedDataUrl);
      onToast?.('Foto berhasil divalidasi, dioptimasi, dan disimpan!');
    } catch (err) {
      console.error('Error processing image:', err);
      const errMsg = 'Gagal memproses foto. Silakan coba berkas gambar JPG atau PNG lainnya.';
      setValidationError(errMsg);
      onToast?.(errMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    // Reset file input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyUrl = () => {
    const val = validateImageUrlString(urlInput);
    if (!val.valid) {
      const errMsg = val.error || 'Format tautan gambar tidak valid.';
      setValidationError(errMsg);
      onToast?.(errMsg);
      return;
    }
    setValidationError(null);
    onChange(urlInput.trim());
    onToast?.('Tautan gambar berhasil diterapkan!');
  };

  const handleSelectPreset = (preset: ImagePreset) => {
    onChange(preset.url);
    setUrlInput(preset.url);
    onToast?.(`Preset "${preset.name}" diterapkan!`);
  };

  const handleResetToDefault = () => {
    if (defaultValue) {
      onChange(defaultValue);
      setUrlInput(defaultValue);
      onToast?.('Background berhasil dikembalikan ke foto bawaan!');
    }
  };

  const isDataUrl = currentValue?.startsWith('data:image/');

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200/90 bg-stone-50/50 p-5 shadow-xs">
      {/* Label Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-sm font-bold text-gray-900 block">{label}</label>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
        {defaultValue && currentValue !== defaultValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetToDefault}
            className="text-xs text-amber-800 hover:text-amber-950 hover:bg-amber-100/60 flex items-center gap-1.5 h-8 px-2.5 self-start sm:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Foto Bawaan</span>
          </Button>
        )}
      </div>

      {/* Live Preview Card */}
      <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-stone-900 shadow-inner group">
        <div
          className={`w-full ${
            aspectRatio === '16:9'
              ? 'aspect-video max-h-64'
              : aspectRatio === '4:3'
              ? 'aspect-4/3 max-h-64'
              : 'aspect-video max-h-64'
          } relative flex items-center justify-center overflow-hidden bg-stone-800`}
        >
          {currentValue ? (
            <img
              src={currentValue}
              alt="Preview Background"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-stone-400 p-6 text-center">
              <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-xs font-medium">Belum ada gambar yang dipilih</p>
            </div>
          )}

          {/* Dark Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Top Status Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
            <div className="flex items-center gap-1.5">
              {imgLoadStatus === 'loaded' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/90 text-white backdrop-blur-md shadow-xs">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Gambar Aktif</span>
                </span>
              )}
              {imgLoadStatus === 'loading' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/90 text-white backdrop-blur-md shadow-xs">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Memeriksa...</span>
                </span>
              )}
              {imgLoadStatus === 'error' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-500/90 text-white backdrop-blur-md shadow-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>URL Gagal Dimuat</span>
                </span>
              )}
            </div>

            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-black/60 text-white/90 backdrop-blur-md">
              {isDataUrl ? 'Berkas Upload' : 'Tautan URL'}
            </span>
          </div>

          {/* Bottom Overlay Controls */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
            <span className="text-[11px] text-stone-200 truncate max-w-[65%] opacity-90 drop-shadow-sm">
              {isDataUrl
                ? 'Foto tersimpan di memori'
                : currentValue || 'Belum ada URL'}
            </span>
            <div className="flex items-center gap-1.5">
              {!isDataUrl && currentValue && (
                <a
                  href={currentValue}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
                  title="Buka gambar di tab baru"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-white text-stone-900 font-semibold text-[11px] hover:bg-stone-100 transition-colors shadow-xs cursor-pointer"
              >
                Ganti Foto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-white shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveMode('upload')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeMode === 'upload'
              ? 'bg-primary text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Berkas</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveMode('url')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeMode === 'url'
              ? 'bg-primary text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Tautan Web (URL)</span>
        </button>
        {presets.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveMode('presets')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeMode === 'presets'
                ? 'bg-primary text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pilihan Preset ({presets.length})</span>
          </button>
        )}
      </div>

      {/* Validation Error Alert - Protects state and explains reason */}
      {validationError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-0.5">
            <p className="font-bold">Unggahan Ditolak Validasi Sisi Klien</p>
            <p>{validationError}</p>
            <p className="text-[11px] text-red-600">Foto sebelumnya tetap aman dan tidak di-reset.</p>
          </div>
          <button
            type="button"
            onClick={() => setValidationError(null)}
            className="text-red-500 hover:text-red-700 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hidden File Input with specific accepted formats */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp,.jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Mode 1: Drag & Drop File Upload */}
      {activeMode === 'upload' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-gray-300 hover:border-primary/70 bg-white hover:bg-stone-50/70'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-900 flex items-center justify-center">
            {isProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : (
              <Upload className="w-6 h-6 text-primary" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">
              {isProcessing
                ? 'Sedang memproses & mengoptimasi gambar...'
                : 'Klik untuk pilih foto, atau seret foto ke sini'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Foto otomatis dikompresi beresolusi tajam & siap dikirim ke server hosting
            </p>
          </div>

          {/* Format & Size Requirements Badges */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Format: JPG, PNG
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              Maks. {MAX_RAW_IMAGE_SIZE_LABEL}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-stone-100 text-stone-600 border border-stone-200">
              Auto-Compress (~80 KB)
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isProcessing}
            className="text-xs font-semibold px-4 py-1.5 h-8 bg-stone-50 hover:bg-stone-100 pointer-events-none mt-1"
          >
            Pilih Berkas dari Perangkat
          </Button>
        </div>
      )}

      {/* Mode 2: Direct URL Input */}
      {activeMode === 'url' && (
        <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-200">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">
              Tautan Langsung Gambar (Direct Image URL)
            </label>
            <div className="flex gap-2">
              <Input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/... atau tautan gambar hosting"
                className="text-xs"
              />
              <Button
                type="button"
                onClick={handleApplyUrl}
                className="text-xs font-semibold shrink-0 cursor-pointer"
              >
                Terapkan
              </Button>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Tips: Pastikan URL berakhiran format gambar seperti <code>.jpg</code>, <code>.png</code>, atau merupakan tautan publik dari Unsplash, hosting gepekristretes.org, dll.
          </p>
        </div>
      )}

      {/* Mode 3: Presets Gallery */}
      {activeMode === 'presets' && (
        <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-600 font-medium">
            Pilih foto gereja berkualitas tinggi yang telah disesuaikan:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
            {presets.map((preset) => {
              const isSelected = currentValue === preset.url;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`group text-left rounded-xl overflow-hidden border transition-all cursor-pointer relative flex flex-col ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/30 shadow-md scale-[1.02]'
                      : 'border-gray-200 hover:border-gray-400 hover:shadow-xs'
                  }`}
                >
                  <div className="aspect-video w-full overflow-hidden bg-stone-100 relative">
                    <img
                      src={preset.thumbnail}
                      alt={preset.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-2xs flex items-center justify-center">
                        <span className="p-1 rounded-full bg-primary text-white shadow-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {preset.name}
                    </p>
                    {preset.description && (
                      <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                        {preset.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
