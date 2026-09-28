/* GRIA PWA + Mobile App Shell v6 */
(function(){
  'use strict';
  const scriptEl=document.currentScript;
  const APP_ROOT=scriptEl?new URL('./',scriptEl.src):new URL('./',location.href);
  const appUrl=p=>new URL(p,APP_ROOT).href;

  if('serviceWorker' in navigator){
    window.addEventListener('load',()=>{
      navigator.serviceWorker.register(appUrl('service-worker.js'),{scope:APP_ROOT.pathname})
        .then(r=>r.update().catch(()=>{})).catch(()=>{});
    });
  }

  const style=document.createElement('style');
  style.id='gria-app-shell-v6';
  style.textContent=`
    .gria-bottom-nav,.gria-entry-gate{display:none}

    @media(max-width:768px){
      body{padding-bottom:calc(92px + env(safe-area-inset-bottom,0px))}
      .navbar .nav-links,.navbar .nav-cta,.navbar .nav-toggle{display:none!important}
      .navbar .navbar-inner{min-height:62px}.navbar .logo{margin-right:auto}

      /* Keep GRIA wordmark on ONE line on every phone width */
      body.gria-home-clean .hero{overflow:hidden!important}
      body.gria-home-clean .hero-title{
        display:block!important;
        width:100%!important;
        max-width:100%!important;
        margin-left:auto!important;
        margin-right:auto!important;
        white-space:nowrap!important;
        word-break:keep-all!important;
        overflow-wrap:normal!important;
        font-size:min(22vw,108px)!important;
        line-height:.88!important;
        letter-spacing:-.075em!important;
        text-align:center!important;
      }
      body.gria-home-clean .hero-title .lit{display:inline!important}

      .gria-bottom-nav{position:fixed;left:12px;right:12px;bottom:max(8px,env(safe-area-inset-bottom,0px));height:72px;z-index:9998;display:grid;grid-template-columns:repeat(4,1fr);align-items:center;padding:7px 8px;background:rgba(16,16,19,.93);border:1px solid rgba(255,255,255,.10);border-radius:24px;box-shadow:0 18px 45px rgba(0,0,0,.5);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px)}
      .gria-bottom-nav a{position:relative;height:58px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:#7f8087;text-decoration:none;border-radius:18px;font:650 10px/1 Inter,sans-serif;transition:transform .18s ease,color .18s ease,background .18s ease}
      .gria-bottom-nav a:active{transform:scale(.96)}
      .gria-bottom-nav a svg{width:22px;height:22px;stroke:currentColor}
      .gria-bottom-nav a.is-active{color:#ccff00;background:rgba(204,255,0,.075)}
      .gria-bottom-nav a.is-active:before{content:'';position:absolute;top:3px;width:18px;height:2px;border-radius:20px;background:#ccff00}

      .gria-entry-gate{position:fixed;inset:0;z-index:10050;display:flex;align-items:flex-end;justify-content:center;padding:20px 16px calc(20px + env(safe-area-inset-bottom,0px));background:radial-gradient(circle at 50% 15%,rgba(204,255,0,.10),transparent 34%),rgba(5,5,6,.97);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
      .gria-entry-card{width:min(100%,480px);padding:28px 22px 22px;border-radius:30px;background:linear-gradient(155deg,#151518,#0d0d0f);border:1px solid rgba(255,255,255,.10)}
      .gria-entry-brand{display:flex;align-items:center;gap:12px;margin-bottom:24px}.gria-entry-brand img{width:48px;height:48px;border-radius:14px}
      .gria-entry-wordmark{font:800 25px/1 Syne,Inter,sans-serif;letter-spacing:-.04em}.gria-entry-wordmark span{color:#ccff00}
      .gria-entry-card h1{font-size:29px;line-height:1.08;margin:0 0 12px}.gria-entry-card>p{color:#a8a8ad;font-size:14px;line-height:1.65;margin:0 0 22px}
      .gria-entry-primary,.gria-entry-secondary{width:100%;min-height:52px;border:0;border-radius:16px;font:700 14px Inter,sans-serif}
      .gria-entry-primary{color:#080808;background:#ccff00;margin-bottom:10px}.gria-entry-secondary{color:#ededed;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.10)}
      .gria-entry-note{display:block;margin-top:15px;color:#73747a;font:500 11px/1.55 Inter,sans-serif;text-align:center}
    }
    @media(max-width:390px){body.gria-home-clean .hero-title{font-size:21.5vw!important}}
    @media(max-width:350px){body.gria-home-clean .hero-title{font-size:20.5vw!important}}
  `;
  document.head.appendChild(style);

  function currentFile(){const last=location.pathname.split('/').pop();return last||'index.html'}

  function setupWelcomeGate(){
    if(currentFile()!=='index.html'||document.getElementById('griaEntryGate'))return;
    let mode=null;try{mode=localStorage.getItem('gria_entry_mode')}catch(_){}
    if(mode==='guest'||mode==='member')return;
    const gate=document.createElement('div');gate.id='griaEntryGate';gate.className='gria-entry-gate';
    gate.innerHTML=`<section class="gria-entry-card" role="dialog" aria-modal="true"><div class="gria-entry-brand"><img src="${appUrl('icon-192.png')}" alt=""><div class="gria-entry-wordmark">GRI<span>A</span></div></div><h1>Selamat datang di GRIA</h1><p>Informasi gereja dapat diakses sebagai tamu. Fitur khusus jemaat tersedia melalui akses Jemaat GRIA Palu.</p><button class="gria-entry-primary" id="griaMemberEntry">Saya Jemaat GRIA</button><button class="gria-entry-secondary" id="griaGuestEntry">Lanjut sebagai tamu</button><small class="gria-entry-note">Kode akses jemaat dapat ditanyakan melalui grup WhatsApp GRIA.</small></section>`;
    document.body.appendChild(gate);
    document.getElementById('griaMemberEntry').onclick=()=>location.href=appUrl('jemaat.html');
    document.getElementById('griaGuestEntry').onclick=()=>{try{localStorage.setItem('gria_entry_mode','guest')}catch(_){}gate.remove()};
  }

  function setupBottomNav(){
    const file=currentFile(),supported=['index.html','warta.html','persekutuan.html','jemaat.html'];
    if(!supported.includes(file)||document.getElementById('griaBottomNav'))return;
    const items=[
      ['index.html','Home','<path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z"/>'],
      ['warta.html','Warta','<path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M7 7h10M7 11h10M7 15h6"/>'],
      ['persekutuan.html','Persekutuan','<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>'],
      ['jemaat.html','Jemaat','<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>']
    ];
    const nav=document.createElement('nav');nav.id='griaBottomNav';nav.className='gria-bottom-nav';
    nav.innerHTML=items.map(([f,label,icon])=>`<a class="${f===file?'is-active':''}" href="${appUrl(f)}"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${icon}</svg><span>${label}</span></a>`).join('');
    document.body.appendChild(nav);
  }

  function init(){setupWelcomeGate();setupBottomNav()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
