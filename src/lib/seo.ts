/**
 * SEO & Document Metadata Manager for GEPEKRIS Tretes
 * Dynamically updates document.title, meta tags, canonical links,
 * OpenGraph social cards, Twitter cards, and Schema.org JSON-LD structured data.
 */

export interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  noIndex?: boolean;
  schema?: Record<string, any> | Array<Record<string, any>>;
}

/**
 * Safely parses any date or human string into a valid ISO string.
 * Never throws RangeError / Invalid Date.
 */
export function safeIsoDate(dateStr?: string): string {
  if (!dateStr || typeof dateStr !== 'string') {
    return new Date().toISOString();
  }
  try {
    const parsed = Date.parse(dateStr);
    if (!isNaN(parsed)) {
      return new Date(parsed).toISOString();
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  } catch {
    // fallback
  }
  return new Date().toISOString();
}

/**
 * Creates or updates a <meta> tag in document.head
 */
export function setMetaTag(nameOrProperty: string, content: string, isProperty = false): void {
  if (typeof document === 'undefined') return;

  const selector = isProperty
    ? `meta[property="${nameOrProperty}"]`
    : `meta[name="${nameOrProperty}"]`;

  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    if (isProperty) {
      element.setAttribute('property', nameOrProperty);
    } else {
      element.setAttribute('name', nameOrProperty);
    }
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

/**
 * Removes a <meta> tag if it exists
 */
export function removeMetaTag(nameOrProperty: string, isProperty = false): void {
  if (typeof document === 'undefined') return;
  const selector = isProperty
    ? `meta[property="${nameOrProperty}"]`
    : `meta[name="${nameOrProperty}"]`;
  const element = document.head.querySelector(selector);
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

/**
 * Sets or updates canonical <link rel="canonical" href="...">
 */
export function setCanonicalUrl(url: string): void {
  if (typeof document === 'undefined') return;

  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

/**
 * Injects or updates Schema.org JSON-LD structured data
 */
export function setStructuredData(id: string, data: Record<string, any> | Array<Record<string, any>>): void {
  if (typeof document === 'undefined') return;

  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data, null, 2);
}

/**
 * Removes structured data script by id
 */
export function removeStructuredData(id: string): void {
  if (typeof document === 'undefined') return;
  const script = document.getElementById(id);
  if (script && script.parentNode) {
    script.parentNode.removeChild(script);
  }
}

/**
 * Applies a full SEO configuration to the current document
 */
export function applySEO(config: SEOConfig): void {
  if (typeof document === 'undefined') return;

  // 1. Page Title
  document.title = config.title;

  // 2. Meta Description
  setMetaTag('description', config.description);

  // 3. Keywords (if provided)
  if (config.keywords && config.keywords.length > 0) {
    setMetaTag('keywords', config.keywords.join(', '));
  }

  // 4. Author (if provided)
  if (config.author) {
    setMetaTag('author', config.author);
  }

  // 5. Robots indexing
  if (config.noIndex) {
    setMetaTag('robots', 'noindex, nofollow');
  } else {
    setMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  }

  // 6. Canonical URL
  const canonicalUrl = config.canonical || (typeof window !== 'undefined' ? window.location.href : '');
  if (canonicalUrl) {
    setCanonicalUrl(canonicalUrl);
  }

  // 7. OpenGraph Social Cards
  setMetaTag('og:title', config.title, true);
  setMetaTag('og:description', config.description, true);
  setMetaTag('og:type', config.ogType || 'website', true);
  setMetaTag('og:site_name', 'GEPEKRIS Tretes', true);
  if (canonicalUrl) {
    setMetaTag('og:url', canonicalUrl, true);
  }
  if (config.ogImage) {
    setMetaTag('og:image', config.ogImage, true);
    setMetaTag('og:image:alt', config.title, true);
  }
  if (config.publishedTime) {
    setMetaTag('article:published_time', safeIsoDate(config.publishedTime), true);
  }

  // 8. Twitter Social Cards
  setMetaTag('twitter:card', config.ogImage ? 'summary_large_image' : 'summary');
  setMetaTag('twitter:title', config.title);
  setMetaTag('twitter:description', config.description);
  if (config.ogImage) {
    setMetaTag('twitter:image', config.ogImage);
  }

  // 9. Schema.org JSON-LD
  if (config.schema) {
    setStructuredData('church-seo-schema', config.schema);
  }
}
