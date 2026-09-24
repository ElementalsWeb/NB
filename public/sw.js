// Threekit runtime cache, adapted from project--daikin-europe.
// Bump the version in CACHE_NAME to discard cached assets on deployment.
const CACHE_PREFIX = 'newbalance-threekit-';
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const THREEKIT_ORIGINS = new Set([
  'https://preview.threekit.com',
  'https://admin-fts.threekit.com',
]);

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys().catch(() => []);
      await Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key).catch(() => false))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  // Partial responses cannot be stored as complete assets. Leave writes,
  // credentials-sensitive API calls and local application/HMR traffic alone.
  if (
    request.method !== 'GET' ||
    request.headers.has('range') ||
    request.cache === 'no-store'
  )
    return;
  const url = new URL(request.url);
  if (!THREEKIT_ORIGINS.has(url.origin)) return;

  const path = url.pathname;
  const immutable =
    /^\/api\/optimizer\/bingeom\//.test(path) ||
    /^\/api\/files\/hash\//.test(path) ||
    /^\/api\/images\/texture\/sha256-/.test(path) ||
    (/^\/app\/js\/threekit-player(?:-bundle)?[.-][^/]+\.js$/.test(path) &&
      path !== '/app/js/threekit-player-bundle.js');
  const bundle = /^\/api\/asset-jobs\/(publish|manifest)\//.test(path);
  const player = /^\/app\/js\/threekit-player(?:-bundle)?\.js$/.test(path);
  if (!immutable && !bundle && !player) return;

  // Register the lifetime promise synchronously: background revalidation and
  // writes must survive even after respondWith has returned a cached response.
  const pending = [];
  const response = handleRequest(request, immutable, bundle, pending);
  event.respondWith(response);
  event.waitUntil(response.catch(() => {}).then(() => Promise.all(pending)));
});

async function openCache() {
  try {
    return await caches.open(CACHE_NAME);
  } catch {
    return null;
  }
}

async function handleRequest(request, immutable, bundle, pending) {
  const cache = await openCache();
  // Full Request keys retain orgId, branch, revision and token query parameters.
  const cached = cache && (await cache.match(request).catch(() => undefined));
  if (immutable && cached) return cached;

  const network = fetch(request);
  pending.push(
    network
      .then(async (response) => {
        if (!cache) return;
        // Clone before delivering the original stream to the player. Validation
        // and disk writes must not delay a cold network response.
        const copy = response.clone();
        if (await isStorable(copy, bundle)) await cache.put(request, copy);
      })
      .catch(() => {})
  );
  if (cached) return cached;
  return network;
}

async function isStorable(response, bundle) {
  // Only immutable assets/player scripts can use opaque no-cors responses.
  if (response.type === 'opaque') return !bundle;
  if (response.type === 'opaqueredirect' || response.status !== 200)
    return false;
  const control = response.headers.get('cache-control') || '';
  if (/\b(no-store|private)\b/i.test(control)) return false;
  const rawLength = response.headers.get('content-length');
  const length = rawLength === null ? NaN : Number(rawLength);
  if (Number.isFinite(length) && length < (bundle ? 1024 : 64)) return false;
  if (!bundle) return true;

  // Static Publish may return HTTP 200 with a temporary {} placeholder.
  const maxAge = /(?:^|[,\s])max-age\s*=\s*"?(\d+)/i.exec(control);
  if (!maxAge || Number(maxAge[1]) < 300) return false;
  // Content-Length can be hidden by CORS or omitted. Read only the first 1 KB
  // of a clone to validate the response without buffering a large 3D bundle.
  if (Number.isFinite(length)) return true;
  if (!response.body) return false;
  const reader = response.clone().body.getReader();
  let bytes = 0;
  try {
    while (bytes < 1024) {
      const { done, value } = await reader.read();
      if (done) return false;
      bytes += value.byteLength;
    }
    return true;
  } catch {
    return false;
  } finally {
    // Do not await cancellation of one branch of a tee'd response stream.
    reader.cancel().catch(() => {});
  }
}
