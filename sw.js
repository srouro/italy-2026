const CACHE='italy-trip-mobile-companion-v5';
const ASSETS=['./','./index.html','./itinerary.json','./manifest.webmanifest'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));});
self.addEventListener('fetch',event=>{event.respondWith(caches.match(event.request).then(resp=>resp||fetch(event.request)));});
