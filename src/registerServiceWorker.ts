// Best-effort optimization: rendering never waits for registration or storage.
export function registerServiceWorker(): void {
  if (!window.isSecureContext || !('serviceWorker' in navigator)) return;

  navigator.serviceWorker
    .register('/sw.js', { scope: '/', updateViaCache: 'none' })
    .catch((error) => console.warn('[SW] registration failed:', error));
}
