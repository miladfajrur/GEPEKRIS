/**
 * Image format and file size validation utilities for GEPEKRIS Tretes
 * Validates images client-side before processing and before sending to '/api/content'
 * Prevents upload failures (such as HTTP 413 Payload Too Large or 500 Server Error)
 * and guarantees that local application state is never reset upon upload errors.
 */

import type { ChurchWebsiteContent } from '../context/ChurchContentContext';

// Supported image MIME types and extensions
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// File size constraints
export const MAX_RAW_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per image file
export const MAX_RAW_IMAGE_SIZE_LABEL = '5 MB';

// Server payload constraints (Vercel Serverless limit is 4.5MB; cPanel post_max_size is often 4MB-8MB)
export const MAX_API_CONTENT_PAYLOAD_BYTES = 3.5 * 1024 * 1024; // 3.5 MB safe ceiling
export const MAX_API_CONTENT_PAYLOAD_LABEL = '3.5 MB';

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
  fileSizeFormatted?: string;
  fileType?: string;
}

/**
 * Validates a File object selected by user (format JPG/PNG/WebP and size <= 5MB)
 */
export function validateImageFile(
  file: File,
  maxSizeBytes: number = MAX_RAW_IMAGE_SIZE_BYTES
): ImageValidationResult {
  if (!file) {
    return {
      valid: false,
      error: 'Berkas tidak ditemukan. Silakan pilih kembali berkas gambar.',
    };
  }

  // 1. Check if empty
  if (file.size === 0) {
    return {
      valid: false,
      error: 'Berkas gambar rusak atau kosong (0 bytes). Silakan pilih foto lain.',
    };
  }

  // 2. Validate format via MIME type and extension
  const mimeType = (file.type || '').toLowerCase();
  const fileName = (file.name || '').toLowerCase();
  const hasValidExtension = ALLOWED_IMAGE_EXTENSIONS.some((ext) =>
    fileName.endsWith(ext)
  );
  const hasValidMime = ALLOWED_IMAGE_MIME_TYPES.includes(mimeType);

  if (!hasValidMime && !hasValidExtension) {
    const ext = fileName.split('.').pop() || 'tidak dikenal';
    return {
      valid: false,
      error: `Format berkas ".${ext}" tidak didukung. Mohon gunakan format gambar JPG atau PNG (atau WebP).`,
      fileType: mimeType || ext,
    };
  }

  // 3. Validate file size
  if (file.size > maxSizeBytes) {
    const currentSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `Ukuran berkas (${currentSizeMB} MB) melebihi batas maksimal ${MAX_RAW_IMAGE_SIZE_LABEL}. Mohon pilih foto dengan ukuran lebih kecil agar pengiriman ke server berhasil tanpa kendala.`,
      fileSizeFormatted: `${currentSizeMB} MB`,
    };
  }

  const currentSizeMB = (file.size / (1024 * 1024)).toFixed(2);
  return {
    valid: true,
    fileSizeFormatted: `${currentSizeMB} MB`,
    fileType: mimeType,
  };
}

/**
 * Validates an image URL or Data URL string format
 */
export function validateImageUrlString(url: string): ImageValidationResult {
  const trimmed = (url || '').trim();
  if (!trimmed) {
    return {
      valid: false,
      error: 'Tautan atau data gambar tidak boleh kosong.',
    };
  }

  // Check Data URL
  if (trimmed.startsWith('data:')) {
    const isAllowedDataUrl =
      trimmed.startsWith('data:image/jpeg;') ||
      trimmed.startsWith('data:image/jpg;') ||
      trimmed.startsWith('data:image/png;') ||
      trimmed.startsWith('data:image/webp;');

    if (!isAllowedDataUrl) {
      return {
        valid: false,
        error: 'Format data gambar base64 tidak didukung. Hanya format JPG dan PNG yang diperbolehkan.',
      };
    }

    return { valid: true };
  }

  // Check Web URL (HTTP / HTTPS)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return { valid: true };
  }

  return {
    valid: false,
    error: 'Format tautan gambar tidak valid. Gunakan tautan URL diawali https:// atau berkas foto JPG/PNG.',
  };
}

/**
 * Pre-flight payload validation for '/api/content'
 * Ensures all image formats and total payload size are strictly compliant
 * before executing network transmission.
 */
export interface PayloadValidationResult {
  valid: boolean;
  error?: string;
  totalSizeBytes: number;
  totalSizeFormatted: string;
  imageCount: number;
  oversizedImages: { section: string; title: string; sizeFormatted: string }[];
}

export function validateContentPayloadForSync(
  content: ChurchWebsiteContent,
  maxPayloadBytes: number = MAX_API_CONTENT_PAYLOAD_BYTES
): PayloadValidationResult {
  let imageCount = 0;
  const oversizedImages: { section: string; title: string; sizeFormatted: string }[] = [];
  const invalidFormatImages: { section: string; title: string; issue: string }[] = [];

  const checkImageField = (section: string, title: string, imgUrl?: string) => {
    if (!imgUrl) return;
    imageCount++;
    const val = validateImageUrlString(imgUrl);
    if (!val.valid) {
      invalidFormatImages.push({ section, title, issue: val.error || 'Format tidak valid' });
    }

    // Individual image base64 check (> 800 KB for single image is a warning flag)
    if (imgUrl.startsWith('data:') && imgUrl.length > 800 * 1024) {
      const sizeMB = (imgUrl.length / (1024 * 1024)).toFixed(2);
      oversizedImages.push({ section, title, sizeFormatted: `${sizeMB} MB` });
    }
  };

  // 1. Check hero image
  if (content.hero?.bgImage) {
    checkImageField('Hero Header', 'Foto Latar Utama', content.hero.bgImage);
  }

  // 2. Check about image
  if (content.about?.image) {
    checkImageField('Tentang Gereja', 'Foto Gedung Gereja', content.about.image);
  }

  // 3. Check ministries
  (content.ministries || []).forEach((min) => {
    if (min.image) {
      checkImageField('Bidang Pelayanan', min.title || 'Pelayanan', min.image);
    }
  });

  // 4. Check events
  (content.events || []).forEach((evt) => {
    if (evt.image) {
      checkImageField('Warta & Berita', evt.title || 'Warta Kegiatan', evt.image);
    }
  });

  // 5. Check gallery
  (content.gallery || []).forEach((gal) => {
    if (gal.imageUrl) {
      checkImageField('Galeri Dokumentasi', gal.title || 'Foto Galeri', gal.imageUrl);
    }
  });

  // 6. Check mediaLibrary
  (content.mediaLibrary || []).forEach((med) => {
    if (med.url) {
      checkImageField('Pustaka Media', med.title || 'Berkas Media', med.url);
    }
  });

  // Calculate total payload size
  let totalSizeBytes = 0;
  try {
    const jsonString = JSON.stringify({
      content,
      timestamp: new Date().toISOString(),
    });
    totalSizeBytes = new Blob([jsonString]).size;
  } catch {
    totalSizeBytes = 0;
  }

  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);
  const totalSizeFormatted = `${totalSizeMB} MB`;

  // Format error
  if (invalidFormatImages.length > 0) {
    const first = invalidFormatImages[0];
    return {
      valid: false,
      error: `Format gambar tidak valid pada "${first.section} - ${first.title}". Hanya format JPG dan PNG yang didukung.`,
      totalSizeBytes,
      totalSizeFormatted,
      imageCount,
      oversizedImages,
    };
  }

  // Payload size error
  if (totalSizeBytes > maxPayloadBytes) {
    return {
      valid: false,
      error: `Ukuran total data yang akan dikirim (${totalSizeFormatted}) melebihi batas maksimal server (${MAX_API_CONTENT_PAYLOAD_LABEL}). Mohon gunakan foto dengan resolusi lebih wajar pada ${
        oversizedImages.length > 0 ? oversizedImages.map((o) => `"${o.title}" (${o.sizeFormatted})`).join(', ') : 'bagian Galeri/Hero'
      } agar unggahan tidak gagal.`,
      totalSizeBytes,
      totalSizeFormatted,
      imageCount,
      oversizedImages,
    };
  }

  return {
    valid: true,
    totalSizeBytes,
    totalSizeFormatted,
    imageCount,
    oversizedImages,
  };
}
