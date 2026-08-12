self.addEventListener('install', event => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    if (self.registration && self.registration.unregister) await self.registration.unregister();
    const clientsList = await self.clients.matchAll({type:'window'});
    for (const client of clientsList) client.navigate(client.url);
  })());
});
