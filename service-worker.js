/* GRIA PWA service worker v22 — fixed dock + consistent type + structured Warta PDF + TB home verse */
const VERSION='gria-pwa-v22';
const STATIC_CACHE=`${VERSION}-static`;
const RUNTIME_CACHE=`${VERSION}-runtime`;
const scopeUrl=self.registration.scope;
const origin=new URL(scopeUrl).origin;

const PRECACHE=[
  'index.html','offline.html','pwa-v16.js','gria-modern.js','gria-modern.css',
  'gria-home-v22.js','gria-home-v20.css','christian-media.json','gria-share-pdf-v22.js','gria-share-pdf-v22.css','gria-fix-v22.js','gria-fix-v22.css','warta-mobile.js','manifest.webmanifest',
  'icon-192.png','icon-512.png','apple-touch-icon.png','warta.html','persekutuan.html',
  'komunitas.html','about-us.html','yayasan.html','jemaat.html','alkitab.html','search.html',
  'jadwal-saya.html','events.html','foto-komunitas-hero.png','foto-kebersamaan-gria.png',
  'foto-hut-gria.png','foto-ibadah-natal.png'
].map(p=>new URL(p,scopeUrl).href);

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(STATIC_CACHE)
    .then(cache=>Promise.allSettled(PRECACHE.map(url=>cache.add(url))))
    .then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys()
    .then(keys=>Promise.all(keys.filter(k=>k.startsWith('gria-pwa-')&&k!==STATIC_CACHE&&k!==RUNTIME_CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});

function injectAppLayer(html){
  html=html.replace(
    /<script([^>]*?)src=["'][^"']*pwa(?:-v16)?\.js(?:\?[^"']*)?["']([^>]*)><\/script>/gi,
    '<script$1src="pwa-v16.js"$2></script>'
  );
  html=html.replace(/gria-home-v20\.js(?:\?[^"']*)?/gi,'gria-home-v22.js?v=22');
  html=html.replace(/gria-share-pdf-v21\.js(?:\?[^"']*)?/gi,'gria-share-pdf-v22.js?v=22');
  html=html.replace(/gria-share-pdf-v21\.css(?:\?[^"']*)?/gi,'gria-share-pdf-v22.css?v=22');
  html=html.replace(/AYAT HARI INI\s*·\s*AYT/gi,'AYAT HARI INI · TB');

  const hasCore=/<script[^>]+src=["'][^"']*pwa-v16\.js/i.test(html);
  const hasModern=/<script[^>]+src=["'][^"']*gria-modern\.js/i.test(html);
  const hasHome22=/<script[^>]+src=["'][^"']*gria-home-v22\.js/i.test(html);
  const hasShare22=/<script[^>]+src=["'][^"']*gria-share-pdf-v22\.js/i.test(html);
  const hasFix22=/<script[^>]+src=["'][^"']*gria-fix-v22\.js/i.test(html);
  const hasShareCss=/<link[^>]+href=["'][^"']*gria-share-pdf-v22\.css/i.test(html);
  const hasFixCss=/<link[^>]+href=["'][^"']*gria-fix-v22\.css/i.test(html);

  let headInject='';
  if(!hasShareCss)headInject+='<link rel="stylesheet" href="gria-share-pdf-v22.css?v=22">';
  if(!hasFixCss)headInject+='<link rel="stylesheet" href="gria-fix-v22.css?v=22">';
  if(headInject&&/<\/head>/i.test(html))html=html.replace(/<\/head>/i,headInject+'</head>');

  let inject='';
  if(!hasCore)inject+=`<script>(function(){try{var t=localStorage.getItem('gria_theme_v1');if(t)document.documentElement.setAttribute('data-gria-theme',t)}catch(_){}})();<\/script><script src="pwa-v16.js" defer><\/script>`;
  if(!hasModern)inject+='<script src="gria-modern.js?v=18" defer><\/script>';
  if(!hasHome22 && /id=["']dailyHero["']/i.test(html))inject+='<script src="gria-home-v22.js?v=22" defer><\/script>';
  if(!hasShare22)inject+='<script src="gria-share-pdf-v22.js?v=22" defer><\/script>';
  if(!hasFix22)inject+='<script src="gria-fix-v22.js?v=22" defer><\/script>';
  if(!inject)return html;
  return /<\/body>/i.test(html)?html.replace(/<\/body>/i,inject+'</body>'):html+inject;
}

self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET')return;
  const url=new URL(req.url);if(url.origin!==origin)return;

  if(url.pathname.endsWith('/ayt-data.min.json')){
    event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{
      if(res&&res.ok)caches.open(STATIC_CACHE).then(c=>c.put(req,res.clone()));return res;
    })));
    return;
  }

  if(req.mode==='navigate'||req.destination==='document'){
    event.respondWith(fetch(req).then(async res=>{
      if(!res||!res.ok)return res;
      const type=res.headers.get('content-type')||'';
      if(!type.includes('text/html')){caches.open(RUNTIME_CACHE).then(c=>c.put(req,res.clone()));return res}
      const raw=await res.text();const html=injectAppLayer(raw);
      const headers=new Headers(res.headers);headers.delete('content-length');headers.delete('content-encoding');
      const transformed=new Response(html,{status:res.status,statusText:res.statusText,headers});
      caches.open(RUNTIME_CACHE).then(c=>c.put(req,transformed.clone()));return transformed;
    }).catch(async()=>await caches.match(req)||caches.match(new URL('offline.html',scopeUrl).href)));
    return;
  }

  if(req.destination==='script'&&(/\/pwa-v16\.js$/.test(url.pathname)||/\/gria-modern\.js$/.test(url.pathname)||/\/gria-home-v22\.js$/.test(url.pathname)||/\/gria-share-pdf-v22\.js$/.test(url.pathname)||/\/gria-fix-v22\.js$/.test(url.pathname))){
    event.respondWith(fetch(req).then(res=>{if(res&&res.ok)caches.open(STATIC_CACHE).then(c=>c.put(req,res.clone()));return res}).catch(()=>caches.match(req)));
    return;
  }

  if(['style','script','image','font'].includes(req.destination)){
    event.respondWith(caches.match(req).then(cached=>{
      const network=fetch(req).then(res=>{if(res&&res.ok)caches.open(RUNTIME_CACHE).then(c=>c.put(req,res.clone()));return res}).catch(()=>cached);
      return cached||network;
    }));
  }
});
