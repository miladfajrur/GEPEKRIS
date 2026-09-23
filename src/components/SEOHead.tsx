import React, { useEffect } from 'react';
import { applySEO, SEOConfig, safeIsoDate } from '../lib/seo';
import { ChurchGeneralInfo, ChurchServiceItem, ChurchEventItem } from '../context/ChurchContentContext';

export interface SEOHeadProps extends SEOConfig {
  children?: React.ReactNode;
}

/**
 * Custom hook to dynamically update document metadata
 */
export function useDocumentMetadata(config: SEOConfig, deps: React.DependencyList = []): void {
  useEffect(() => {
    applySEO(config);
  }, [
    config.title,
    config.description,
    config.canonical,
    config.ogType,
    config.ogImage,
    config.noIndex,
    config.publishedTime,
    config.author,
    JSON.stringify(config.keywords),
    JSON.stringify(config.schema),
    ...deps,
  ]);
}

/**
 * SEOHead / Dynamic Document Metadata Component
 * Works in modern React 19 SPA without external peer dependency issues.
 */
export const SEOHead: React.FC<SEOHeadProps> = (props) => {
  useDocumentMetadata(props);
  return null;
};

/**
 * Helmet alias for compatibility with standard React Helmet usage patterns
 */
export const Helmet: React.FC<SEOHeadProps> = SEOHead;

/**
 * HelmetProvider shim providing seamless drop-in support
 */
export const HelmetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// ----------------------------------------------------------------------------
// Schema.org Structured Data Generators (JSON-LD)
// ----------------------------------------------------------------------------

/**
 * Builds Schema.org JSON-LD for Church / PlaceOfWorship (Default Home View)
 */
export function buildChurchSchema(
  info: ChurchGeneralInfo,
  services: ChurchServiceItem[],
  heroImage?: string,
  canonicalUrl?: string
) {
  const openingHoursSpecs = services.map((service) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Sunday'],
    opens: '07:30',
    closes: '12:00',
    description: `${service.name} (${service.times.join(', ')})`,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': ['Church', 'PlaceOfWorship'],
    name: info.name || 'GEPEKRIS Tretes',
    alternateName: 'Gereja Persekutuan Kristen Tretes',
    description:
      info.tagline ||
      'Website resmi Gereja Persekutuan Kristen (GEPEKRIS) Tretes, Prigen, Pasuruan - Jadwal Ibadah, Warta Berita Jemaat, dan Pelayanan Kasih.',
    url: canonicalUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://gepekristretes.org'),
    logo: heroImage || 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=600&q=80',
    image: heroImage || 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=1200&q=80',
    telephone: info.phone || '(0343) 811234',
    email: info.email || 'sekretariat@gepekristretes.org',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Pesanggrahan No. 5',
      addressLocality: 'Tretes, Prigen',
      addressRegion: 'Pasuruan, Jawa Timur',
      postalCode: '67157',
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -7.6975,
      longitude: 112.6273,
    },
    openingHoursSpecification: openingHoursSpecs,
    publicAccess: true,
    smokingAllowed: false,
    sameAs: [
      'https://www.facebook.com/gepekristretes',
      'https://www.instagram.com/gepekris_tretes',
      'https://www.youtube.com/@gepekristretes',
    ],
  };
}

/**
 * Builds Schema.org JSON-LD for Blog / Warta Article View
 */
export function buildArticleSchema(
  event: ChurchEventItem,
  canonicalUrl: string,
  churchName: string = 'GEPEKRIS Tretes'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: event.title,
    description: event.description,
    articleBody: event.content || event.description,
    image: event.image
      ? [event.image]
      : ['https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80'],
    datePublished: safeIsoDate(event.date),
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: event.author || `${churchName} Tim Warta & Media`,
    },
    publisher: {
      '@type': 'Organization',
      name: churchName,
      logo: {
        '@type': 'ImageObject',
        url: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=600&q=80',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    inLanguage: 'id-ID',
    articleSection: event.category || 'Warta Jemaat',
  };
}

/**
 * Builds Schema.org JSON-LD for Community Prayer Wall View
 */
export function buildPrayerWallSchema(canonicalUrl: string, churchName: string = 'GEPEKRIS Tretes') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Pokok Doa & Prayer Wall Jemaat - ${churchName}`,
    description:
      'Layanan permohonan doa syafaat, doa kesembuhan, dan pokok doa bersama jemaat GEPEKRIS Tretes dalam kasih Kristus.',
    url: canonicalUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: churchName,
      url: typeof window !== 'undefined' ? window.location.origin : 'https://gepekristretes.org',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Beranda',
          item: typeof window !== 'undefined' ? window.location.origin : 'https://gepekristretes.org',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Prayer Wall (Pokok Doa)',
          item: canonicalUrl,
        },
      ],
    },
  };
}

/**
 * Builds Schema.org JSON-LD for Sermons Archive View
 */
export function buildSermonArchiveSchema(canonicalUrl: string, churchName: string = 'GEPEKRIS Tretes') {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Arsip Khotbah & Renungan Firman Tuhan - ${churchName}`,
    description:
      'Kumpulan rekaman khotbah Ibadah Raya Minggu, renungan firman Tuhan, dan seri pengajaran Alkitab jemaat GEPEKRIS Tretes.',
    url: canonicalUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: churchName,
      url: typeof window !== 'undefined' ? window.location.origin : 'https://gepekristretes.org',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Beranda',
          item: typeof window !== 'undefined' ? window.location.origin : 'https://gepekristretes.org',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Arsip Khotbah',
          item: canonicalUrl,
        },
      ],
    },
  };
}

/**
 * Builds Schema.org JSON-LD for Online Giving & Tithes View
 */
export function buildGivingSchema(canonicalUrl: string, churchName: string = 'GEPEKRIS Tretes') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Persembahan & Persepuluhan Online - ${churchName}`,
    description:
      'Informasi rekening resmi persembahan kasih, persepuluhan, dan diakonia untuk mendukung pelayanan jemaat GEPEKRIS Tretes.',
    url: canonicalUrl,
    potentialAction: {
      '@type': 'DonateAction',
      target: canonicalUrl,
      recipient: {
        '@type': 'Church',
        name: churchName,
      },
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Beranda',
          item: typeof window !== 'undefined' ? window.location.origin : 'https://gepekristretes.org',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Persembahan Online',
          item: canonicalUrl,
        },
      ],
    },
  };
}
