/* GRIA PWA service worker v27 — Renungan Harian + Daily Hero */
const VERSION='gria-pwa-v27-1';
const STATIC_CACHE=`${VERSION}-static`;
const RUNTIME_CACHE=`${VERSION}-runtime`;
const scopeUrl=self.registration.scope;
const origin=new URL(scopeUrl).origin;

const PRECACHE=[
  'index.html','jemaat.html','warta.html','offline.html','manifest.webmanifest',
  'icon-192.png','icon-512.png','apple-touch-icon.png',
  'pwa-v16.js','gria-modern.js?v=27','gria-modern.css?v=27',
  'gria-home-v27.js?v=27.0','gria-home-v27.css?v=27.0','gria-home-v24.css','gria-home-v20.css',
  'gria-share-pdf-v22.js','gria-share-pdf-v22.css',
  'gria-fix-v22.js','gria-fix-v22.css',
  'gria-performance-v23.js','gria-performance-v23.css',
  'warta-mobile.js','foto-home.json','daily-hero.json',
  'renungan.html','renungan-v27.js?v=27.0','renungan-v27.css?v=27.0','renungan-data-oct-2026.json','renungan-reminder.ics','foto-ibadah-natal.png','foto-kebersamaan-gria.png','foto-hut-gria.png','foto-komunitas-hero.png'
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
        keys.filter(k=>k.startsWith('gria-pwa-')&&k!==STATIC_CACHE&&k!==RUNTIME_CACHE)
          .map(k=>caches.delete(k))
      ))
      .then(()=>self.clients.claim())
  );
});

function stripExternalFonts(html){
  return html
    .replace(/<link[^>]+href=["']https:\/\/fonts\.googleapis\.com[^"']*["'][^>]*>/gi,'')
    .replace(/<link[^>]+href=["']https:\/\/fonts\.gstatic\.com[^"']*["'][^>]*>/gi,'')
    .replace(/<link[^>]+rel=["']preconnect["'][^>]+fonts\.(googleapis|gstatic)\.com[^>]*>/gi,'');
}
function ensureHead(html,tag,needle){
  if(new RegExp(needle,'i').test(html))return html;
  return /<\/head>/i.test(html)?html.replace(/<\/head>/i,tag+'</head>'):tag+html;
}
function ensureBody(html,tag,needle){
  if(new RegExp(needle,'i').test(html))return html;
  return /<\/body>/i.test(html)?html.replace(/<\/body>/i,tag+'</body>'):html+tag;
}

function injectAppLayer(html,pathname){
  html=stripExternalFonts(html);
  html=html.replace(/gria-modern\.(js|css)(?:\?[^"']*)?/gi,'gria-modern.$1?v=27');

  html=html.replace(
    /<script([^>]*?)src=["'][^"']*pwa\.js(?:\?[^"']*)?["']([^>]*)><\/script>/gi,
    '<script$1src="pwa-v16.js"$2></script>'
  );
  html=html.replace(/gria-home-v2[3-6]\.js(?:\?[^"']*)?/gi,'gria-home-v27.js?v=27.0');

  html=ensureHead(html,'<link rel="stylesheet" href="gria-modern.css?v=27">','gria-modern\\.css');
  html=ensureHead(html,'<link rel="stylesheet" href="gria-fix-v22.css?v=22">','gria-fix-v22\\.css');
  html=ensureHead(html,'<link rel="stylesheet" href="gria-performance-v23.css?v=23">','gria-performance-v23\\.css');

  html=ensureBody(html,'<script src="pwa-v16.js" defer><\/script>','pwa-v16\\.js');
  html=ensureBody(html,'<script src="gria-modern.js?v=27" defer><\/script>','gria-modern\\.js');
  html=ensureBody(html,'<script src="gria-fix-v22.js?v=22" defer><\/script>','gria-fix-v22\\.js');
  html=ensureBody(html,'<script src="gria-performance-v23.js?v=23" defer><\/script>','gria-performance-v23\\.js');

  const isHome=/\/(?:index\.html)?$/.test(pathname);
  const isWarta=/\/warta\.html$/.test(pathname);

  if(isHome){
    html=ensureHead(html,'<link rel="stylesheet" href="gria-home-v20.css?v=20">','gria-home-v20\\.css');
    html=ensureHead(html,'<link rel="stylesheet" href="gria-home-v24.css?v=24">','gria-home-v24\\.css');
    html=ensureHead(html,'<link rel="stylesheet" href="gria-home-v27.css?v=27.0">','gria-home-v27\\.css');
    html=ensureHead(html,'<link rel="stylesheet" href="gria-share-pdf-v22.css?v=22">','gria-share-pdf-v22\\.css');
    html=ensureBody(html,'<script src="gria-home-v27.js?v=27.0" defer><\/script>','gria-home-v27\\.js');
    html=ensureBody(html,'<script src="gria-share-pdf-v22.js?v=22" defer><\/script>','gria-share-pdf-v22\\.js');
  }else if(isWarta){
    html=ensureHead(html,'<link rel="stylesheet" href="gria-share-pdf-v22.css?v=22">','gria-share-pdf-v22\\.css');
    html=ensureBody(html,'<script src="gria-share-pdf-v22.js?v=22" defer><\/script>','gria-share-pdf-v22\\.js');
  }

  return html;
}

async function transformHtml(res,pathname){
  if(!res||!res.ok)return res;
  const type=res.headers.get('content-type')||'';
  if(!type.includes('text/html'))return res;
  const html=injectAppLayer(await res.text(),pathname);
  const headers=new Headers(res.headers);
  headers.delete('content-length');
  headers.delete('content-encoding');
  return new Response(html,{status:res.status,statusText:res.statusText,headers});
}

async function networkWithTimeout(req,ms){
  return Promise.race([
    fetch(req),
    new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))
  ]);
}

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;

  const url=new URL(req.url);
  if(url.origin!==origin)return;

  if(url.pathname.endsWith('/renungan-reminder.ics')){
    event.respondWith(caches.match(url.origin+url.pathname).then(cached=>cached||fetch(req)));return;
  }

  if(url.pathname.endsWith('/ayt-data.min.json')){
    event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{
      if(res&&res.ok)caches.open(RUNTIME_CACHE).then(c=>c.put(req,res.clone()));
      return res;
    })));
    return;
  }

  /* These manifests are tiny and should be fresh. */
  if(url.pathname.endsWith('/daily-hero.json')||url.pathname.endsWith('/foto-home.json')||url.pathname.endsWith('/renungan-data-oct-2026.json')){
    event.respondWith(
      networkWithTimeout(req,4000).then(async res=>{
        if(!res||!res.ok)throw new Error('Data unavailable');
        const cache=await caches.open(STATIC_CACHE);await cache.put(url.origin+url.pathname,res.clone());return res;
      }).catch(()=>caches.match(url.origin+url.pathname))
    );
    return;
  }

  if(req.mode==='navigate'||req.destination==='document'){
    const isWarta=url.pathname.endsWith('/warta.html');

    if(isWarta){
      event.respondWith((async()=>{
        try{
          const net=await networkWithTimeout(req,1200);
          const transformed=await transformHtml(net,url.pathname);
          if(transformed&&transformed.ok)caches.open(RUNTIME_CACHE).then(c=>c.put(req,transformed.clone()));
          return transformed;
        }catch(_){
          const cached=await caches.match(req);
          if(cached)return cached;
          try{
            const net=await fetch(req);
            const transformed=await transformHtml(net,url.pathname);
            if(transformed&&transformed.ok)caches.open(RUNTIME_CACHE).then(c=>c.put(req,transformed.clone()));
            return transformed;
          }catch(__){
            return caches.match(new URL('offline.html',scopeUrl).href);
          }
        }
      })());
      return;
    }

    event.respondWith((async()=>{
      const cached=await caches.match(req)|| (url.pathname.endsWith('/renungan.html')?await caches.match(url.origin+url.pathname):null);
      const refresh=fetch(req).then(res=>transformHtml(res,url.pathname)).then(res=>{
        if(res&&res.ok)caches.open(RUNTIME_CACHE).then(c=>c.put(req,res.clone()));
        return res;
      }).catch(()=>null);
      if(cached){event.waitUntil(refresh);return cached}
      return await refresh || caches.match(new URL('offline.html',scopeUrl).href);
    })());
    return;
  }

  if(['style','script','image','font'].includes(req.destination)){
    event.respondWith((async()=>{
      const cached=await caches.match(req,{ignoreSearch:true});
      if(cached){
        event.waitUntil(fetch(req).then(res=>{
          if(res&&res.ok)return caches.open(RUNTIME_CACHE).then(c=>c.put(req,res.clone()));
        }).catch(()=>{}));
        return cached;
      }
      try{
        const res=await fetch(req);
        if(res&&res.ok)caches.open(RUNTIME_CACHE).then(c=>c.put(req,res.clone()));
        return res;
      }catch(_){
        return cached;
      }
    })());
  }
});
