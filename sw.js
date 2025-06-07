const CACHE_NAME = 'ponto-v1';
const urlsToCache = [
    '/',
    '/css/reports-styles.css',
    '/css/employees-styles.css',
    '/css/secondary-header.css',
    '/js/reports.js',
    '/js/auth.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});