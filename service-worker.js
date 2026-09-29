/* GRIA PWA service worker v10 — multi-source Bible */
const VERSION='gria-pwa-v10';
const STATIC_CACHE=`${VERSION}-static`;
const RUNTIME_CACHE=`${VERSION}-runtime`;
const scopeUrl=self.registration.scope;
const origin=new URL(scopeUrl).origin;
const PRECACHE=['offline.html','shared.css','pwa.js','home-clean.js','warta-mobile.js','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png','jemaat.html','alkitab.html','ayt-data.min.json','AYT-LICENSE.html','warta.html','persekutuan.html'].map(p=>new URL(p,scopeUrl).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(STATIC_CACHE).then(cache=>Promise.allSettled(PRECACHE.map(url=>cache.add(url)))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('gria-pwa-')&&k!==STATIC_CACHE&&k!==RUNTIME_CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);
 /* remote GitHub Bible sources use normal browser HTTP caching */
 if(url.origin!==origin)return;
 if(url.pathname.endsWith('/ayt-data.min.json')){event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{if(res&&res.ok)caches.open(STATIC_CACHE).then(c=>c.put(req,res.clone()));return res})));return}
 if(req.mode==='navigate'||req.destination==='document'){event.respondWith(fetch(req).then(res=>{if(res&&res.ok)caches.open(RUNTIME_CACHE).then(c=>c.put(req,res.clone()));return res}).catch(async()=>await caches.match(req)||caches.match(new URL('offline.html',scopeUrl).href)));return}
 if(['style','script','image','font'].includes(req.destination)){event.respondWith(caches.match(req).then(cached=>{const network=fetch(req).then(res=>{if(res&&res.ok)caches.open(RUNTIME_CACHE).then(c=>c.put(req,res.clone()));return res}).catch(()=>cached);return cached||network}))}
});