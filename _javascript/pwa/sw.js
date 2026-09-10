import { baseurl } from '../../_config.yml';

importScripts(`${baseurl}/assets/js/data/swconf.js`);

const purge = swconf.purge;
const runtimeCacheName = `${swconf.cacheName}-runtime`;
let cacheWrite = Promise.resolve();

function verifyUrl(url) {
  const parsed = new URL(url);
  const requestPath = parsed.pathname;

  if (!['http:', 'https:'].includes(parsed.protocol)) return false;
  if (parsed.origin !== self.location.origin) {
    return swconf.allowedOrigins.includes(parsed.origin);
  }

  if (
    requestPath === `${baseurl}/sw.min.js` ||
    requestPath === `${baseurl}/assets/js/data/swconf.js`
  ) return false;

  for (const path of swconf.denyPaths) {
    if (requestPath.startsWith(path)) {
      return false;
    }
  }
  return true;
}

self.addEventListener('install', (event) => {
  if (purge) {
    return;
  }

  event.waitUntil(
    caches.open(swconf.cacheName).then((cache) => {
      return cache.addAll(swconf.resources);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (
            key.startsWith('chirpy-') &&
            (purge || (key !== swconf.cacheName && key !== runtimeCacheName))
          ) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (
    purge ||
    event.request.method !== 'GET' ||
    event.request.headers.has('range') ||
    !verifyUrl(event.request.url)
  ) {
    return;
  }

  const responsePromise = (async () => {
    const cached = await caches.match(event.request, { cacheName: swconf.cacheName }) ||
      await caches.match(event.request, { cacheName: runtimeCacheName });
    if (cached) return cached;

    const response = await fetch(event.request);
    // Only explicitly allowed CDN origins may have opaque (unreadable) responses.
    const allowedOpaque = response.type === 'opaque' &&
      new URL(event.request.url).origin !== self.location.origin;
    if ((!response.ok && !allowedOpaque) || response.status === 206) return response;

    const copy = response.clone();
    // Serialize writes and eviction so parallel requests cannot exceed the limit.
    cacheWrite = cacheWrite.then(async () => {
      const cache = await caches.open(runtimeCacheName);
      await cache.put(event.request, copy);
      const keys = await cache.keys();
      for (const key of keys.slice(0, Math.max(0, keys.length - swconf.maxEntries))) {
        await cache.delete(key);
      }
    }).catch((error) => console.warn('Offline cache write failed:', error));

    return response;
  })();

  event.respondWith(responsePromise);
  event.waitUntil(responsePromise.then(() => cacheWrite).catch(() => {}));
});
