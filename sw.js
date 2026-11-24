const CACHE='futbol-analiz-pro-v5';
const FILES=['./','./index.html','./manifest.json','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(FILES);await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})()));
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(u.origin!==location.origin||event.request.method!=='GET')return;event.respondWith((async()=>{try{const response=await fetch(event.request,{cache:'no-store'});if(response.ok){const c=await caches.open(CACHE);c.put(event.request,response.clone())}return response}catch(error){const cached=await caches.match(event.request);if(cached)return cached;throw error}})())});
