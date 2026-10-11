/* ToolNest service worker. Change CACHE_VERSION whenever site files change. */
var CACHE_VERSION = 'toolnest-v1';
var PRECACHE = [
  './', 'index.html', 'about.html', 'contact.html', 'privacy.html', 'terms.html', 'disclaimer.html',
  'calculator.html', 'percentage-calculator.html', 'discount-calculator.html', 'emi-calculator.html',
  'unit-converter.html', 'currency-converter.html', 'area-calculator.html', 'concrete-calculator.html',
  'bmi-calculator.html', 'electricity-bill.html', 'age-calculator.html', 'word-counter.html', 'image-tools.html',
  'css/style.css',
  'js/main.js', 'js/calculator.js', 'js/percentage-calculator.js', 'js/discount-calculator.js', 'js/emi-calculator.js',
  'js/unit-converter.js', 'js/currency-converter.js', 'js/area-calculator.js', 'js/concrete-calculator.js',
  'js/bmi-calculator.js', 'js/electricity-bill.js', 'js/age-calculator.js', 'js/word-counter.js', 'js/image-tools.js', 'js/contact.js',
  'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'
];
var OFFLINE_HTML = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Offline - ToolNest</title></head>' +
  '<body style="font-family:system-ui,sans-serif;background:#062a25;color:#fff;text-align:center;padding:2rem"><h1>You are offline</h1>' +
  '<p>This page has not been saved on your device yet. Connect to the internet and try again.</p><p><a style="color:#f2c14e" href="./">Go to the ToolNest homepage</a></p></body></html>';

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      return Promise.all(PRECACHE.map(function (u) { return cache.add(u).catch(function () {}); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_VERSION; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

/* Network first (always fresh when online), saved copy when offline.
   Only same-origin GET requests are handled, so the contact form (a cross-origin POST) and any external requests are never touched. */
self.addEventListener('fetch', function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then(function (res) {
      if (res && res.ok && res.type === 'basic') {
        var copy = res.clone();
        caches.open(CACHE_VERSION).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) {
        if (hit) return hit;
        if (req.mode === 'navigate') return new Response(OFFLINE_HTML, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        return Response.error();
      });
    })
  );
});
