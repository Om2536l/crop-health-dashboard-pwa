/**
 * Basic service worker for offline support.
 * Caches the core app shell so the dashboard loads even without
 * a network connection (useful for field demos).
 *
 * Update CACHE_NAME when you change cached files so old caches
 * are cleared on the next load.
 */

const CACHE_NAME = "crop-health-cache-v1";

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./js/data.js",
  "./manifest.json",
  "./images/ndvi_2026-03-29.png",
  "./images/ndvi_2026-04-28.png",
  "./images/ndvi_2026-06-02.png",
  "./images/ndvi_difference.png",
  "./images/ndvi_trend.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
