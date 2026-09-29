/* GRIA PWA service worker v16 — hard cache bust */
const VERSION='gria-pwa-v16';
const STATIC_CACHE=`${VERSION}-static`;
const RUNTIME_CACHE=`${VERSION}-runtime`;
const scopeUrl=self.registration.scope;
const origin=new URL(scopeUrl).origin;

const PRECACHE=[
  'index.html',
  'offline.html',
  'pwa-v16.js',
  'warta-mobile.js',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png',
  'warta.html',
  'persekutuan.html',
  'komunitas.html',
  'about-us.html',
  'yayasan.html',
  'jemaat.html',
  'alkitab.html',
  'foto-komunitas-hero.png'
].map(p=>new URL(p,scopeUrl).href);

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache=>Promise.allSettled(PRECACHE.map(url=>cache.add(url))))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(
        keys
          .filter(k=>k.startsWith('gria-pwa-')&&k!==STATIC_CACHE&&k!==RUNTIME_CACHE)
          .map(k=>caches.delete(k))
      ))
      .then(()=>self.clients.claim())
  );
});

function injectPwaScript(html){
  /* Force every HTML page onto the new shell filename.
     This avoids iOS/PWA serving an old cached pwa.js. */
  html=html.replace(
    /<script([^>]*?)src=["'][^"']*pwa\.js(?:\?[^"']*)?["']([^>]*)><\/script>/gi,
    '<script$1src="pwa-v16.js"$2></script>'
  );

  if(/<script[^>]+src=["'][^"']*pwa-v16\.js/i.test(html))return html;

  const themeBoot=`<script>
  (function(){
    try{
      var t=localStorage.getItem('gria_theme_v1');
      if(t)document.documentElement.setAttribute('data-gria-theme',t);
    }catch(_){}
  })();
  <\/script>
  <script src="pwa-v16.js" defer><\/script>`;

  return /<\/body>/i.test(html)
    ? html.replace(/<\/body>/i,themeBoot+'</body>')
    : html+themeBoot;
}

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;

  const url=new URL(req.url);
  if(url.origin!==origin)return;

  if(url.pathname.endsWith('/ayt-data.min.json')){
    event.respondWith(
      caches.match(req).then(cached=>
        cached||fetch(req).then(res=>{
          if(res&&res.ok)caches.open(STATIC_CACHE).then(c=>c.put(req,res.clone()));
          return res;
        })
      )
    );
    return;
  }

  if(req.mode==='navigate'||req.destination==='document'){
    event.respondWith(
      fetch(req)
        .then(async res=>{
          if(!res||!res.ok)return res;

          const type=res.headers.get('content-type')||'';
          if(!type.includes('text/html')){
            caches.open(RUNTIME_CACHE).then(c=>c.put(req,res.clone()));
            return res;
          }

          const raw=await res.text();
          const html=injectPwaScript(raw);

          const headers=new Headers(res.headers);
          headers.delete('content-length');
          headers.delete('content-encoding');

          const transformed=new Response(html,{
            status:res.status,
            statusText:res.statusText,
            headers
          });

          caches.open(RUNTIME_CACHE).then(c=>c.put(req,transformed.clone()));
          return transformed;
        })
        .catch(async()=>{
          return await caches.match(req) ||
            caches.match(new URL('offline.html',scopeUrl).href);
        })
    );
    return;
  }

  if(req.destination==='script' && url.pathname.endsWith('/pwa-v16.js')){
    event.respondWith(
      fetch(req)
        .then(res=>{
          if(res&&res.ok)caches.open(STATIC_CACHE).then(c=>c.put(req,res.clone()));
          return res;
        })
        .catch(()=>caches.match(req))
    );
    return;
  }

  if(['style','script','image','font'].includes(req.destination)){
    event.respondWith(
      caches.match(req).then(cached=>{
        const network=fetch(req)
          .then(res=>{
            if(res&&res.ok)caches.open(RUNTIME_CACHE).then(c=>c.put(req,res.clone()));
            return res;
          })
          .catch(()=>cached);
        return cached||network;
      })
    );
  }
});
