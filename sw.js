const CACHE_VERSION = "2024-01-21 11:00 AM";

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/main.js',
        '/sw.js',

        '/icon.png',
        '/manifest.json',

        '/svg icons/kofi_stroke_cup.svg',
        '/svg icons/grade_black_24dp.svg',
        '/svg icons/backspace_black_24dp.svg',
        '/svg icons/keyboard_capslock_black_24dp.svg',
        '/svg icons/keyboard_return_black_24dp.svg',
        '/svg icons/keyboard_tab_black_24dp.svg',
        '/svg icons/menu_black_24dp.svg',
        '/svg icons/space_bar_black_24dp.svg',
        '/svg icons/speed_black_24dp.svg',
        '/svg icons/window_black_24dp.svg',
      ])
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_VERSION) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
