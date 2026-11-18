/* Cadence service worker — caches the whole app so it works fully offline. */
const VERSION = 'cadence-v1';
const ASSETS = [
  './', 'index.html', 'manifest.webmanifest',
  'css/app.css', 'fonts/inter-latin-wght-normal.woff2',
  'js/core.js', 'js/db.js', 'js/charts.js', 'js/ui.js', 'js/app.js', 'js/editor.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// Cache-first (instant + offline), refreshing the cache in the background when online.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => {
    const net = fetch(req).then((res) => {
      if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    return net.then((res) => res || (req.mode === 'navigate' ? caches.match('index.html') : Response.error()));
  }));
});
