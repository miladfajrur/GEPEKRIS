/**
 * Cache Cleaner Utility for GEPEKRIS Tretes Web App
 * Ensures the web app clears stale cache and always loads the latest updates when first opened.
 */

const STORAGE_KEYS_TO_CLEAR = [
  'gepekris_tretes_content_v1',
  'grace_church_content_v2',
  'church_website_content_v3',
  'church_content_cache',
  'church_has_local_edits',
  'church_last_edit_time',
  'church_session_started',
];

/**
 * Checks if this is a fresh visit/new session.
 * If yes, purges stale local caches, unregisters old service workers,
 * and clears browser cache storage so the user always receives the latest updates.
 */
export function purgeAppCacheOnFreshOpen(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const isSessionActive = sessionStorage.getItem('church_session_initialized');

    if (!isSessionActive) {
      // First time opening the website in this browser session!
      // Clear all stale cached content keys
      STORAGE_KEYS_TO_CLEAR.forEach((key) => {
        try {
          localStorage.removeItem(key);
        } catch {
          // Ignore
        }
      });

      // Clear Browser CacheStorage API if available
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name).catch(() => {});
          });
        }).catch(() => {});
      }

      // Unregister any active Service Workers to avoid stale PWA assets
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((reg) => {
            reg.unregister().catch(() => {});
          });
        }).catch(() => {});
      }

      // Clear any lingering warta hash so app opens fresh on the main homepage
      if (window.location.hash.startsWith('#berita')) {
        try {
          history.replaceState(null, '', window.location.pathname);
        } catch {}
      }

      // Mark session as initialized with current timestamp
      sessionStorage.setItem('church_session_initialized', Date.now().toString());
      console.info('[GEPEKRIS App] Cache dibersihkan saat pertama dibuka. Memuat versi terbaru.');
      return true;
    }
  } catch (err) {
    console.warn('[GEPEKRIS App] Warning during cache purge check:', err);
  }

  return false;
}

/**
 * Explicitly clears all cache and reloads the page with fresh data.
 * Useful for admins after deploying new warta/schedule or for users experiencing issues.
 */
export function clearCacheAndHardReload(): void {
  if (typeof window === 'undefined') return;

  try {
    STORAGE_KEYS_TO_CLEAR.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {
        // Ignore
      }
    });

    sessionStorage.clear();

    if ('caches' in window) {
      caches.keys().then((names) => {
        return Promise.all(names.map((name) => caches.delete(name)));
      }).then(() => {
        window.location.reload();
      }).catch(() => {
        window.location.reload();
      });
      return;
    }
  } catch (e) {
    console.error('[GEPEKRIS App] Error clearing cache:', e);
  }

  window.location.reload();
}
