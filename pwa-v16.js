/* GRIA PWA — Global Theme + Header Polish v16 */
(function(){
  'use strict';

  const THEME_KEY='gria_theme_v1';
  const scriptEl=document.currentScript;
  const APP_ROOT=scriptEl?new URL('./',scriptEl.src):new URL('./',location.href);
  const appUrl=p=>new URL(p,APP_ROOT).href;

  if('serviceWorker' in navigator){
    window.addEventListener('load',()=>{
      navigator.serviceWorker.register(appUrl('service-worker.js?v=27'),{scope:APP_ROOT.pathname,updateViaCache:'none'})
        .then(r=>r.update().catch(()=>{}))
        .catch(()=>{});
    });
  }

  function currentFile(){
    const last=location.pathname.split('/').pop();
    return last||'index.html';
  }

  function activeSection(file){
    if(['index.html','about-us.html','yayasan.html'].includes(file))return'home';
    if(file==='warta.html')return'warta';
    if(['persekutuan.html','komunitas.html'].includes(file))return'persekutuan';
    if(['jemaat.html','alkitab.html','pendaftaran-jemaat.html'].includes(file))return'jemaat';
    return null;
  }

  const style=document.createElement('style');
  style.id='gria-global-app-shell-v16';
  style.textContent=`
    html[data-gria-theme="light"]{
      --bg-deep:#f0f1eb;
      --bg-base:#f7f7f3;
      --bg-elevated:#ffffff;
      --bg-elevated-2:#f0f1eb;
      --bg-soft:#f5f6f0;
      --card:#ffffff;
      --card-border:rgba(20,20,24,.085);
      --card-border-strong:rgba(20,20,24,.14);

      --white:#18181b;
      --text:#222226;
      --text-mute:#65666d;
      --grey:#73747a;
      --grey-dim:#8b8c91;

      --neon:#a7d100;
      --neon-dim:#84a900;
      --neon-soft:rgba(167,209,0,.11);
      --neon-glow:rgba(167,209,0,.22);

      --footer-grad-start:#f4f5ef;
      --footer-grad-end:#e9eee0;

      --shadow-sm:0 4px 16px rgba(20,20,25,.07);
      --shadow-md:0 12px 32px rgba(20,20,25,.10);
      --shadow-glow:0 12px 35px rgba(167,209,0,.11);
    }

    html[data-gria-theme="light"] body{
      background:var(--bg-base)!important;
      color:var(--text)!important;
    }
    html[data-gria-theme="light"] body::before{opacity:.18!important}

    html[data-gria-theme="light"] h1,
    html[data-gria-theme="light"] h2,
    html[data-gria-theme="light"] h3,
    html[data-gria-theme="light"] h4{
      color:var(--text)!important;
    }

    html[data-gria-theme="light"] .komunitas-page-hero h1,
    html[data-gria-theme="light"] .komunitas-page-hero h2,
    html[data-gria-theme="light"] .komunitas-page-hero h3,
    html[data-gria-theme="light"] .komunitas-hero-body h1,
    html[data-gria-theme="light"] .komunitas-hero-body p{
      color:#fff!important;
    }

    html[data-gria-theme="light"] .navbar{
      background:rgba(247,247,243,.92)!important;
      border-color:rgba(20,20,24,.08)!important;
      box-shadow:0 8px 28px rgba(20,20,24,.06)!important;
    }
    html[data-gria-theme="light"] .navbar .logo{color:#171719!important}
    html[data-gria-theme="light"] .navbar .nav-links a{color:#55565d!important}

    html[data-gria-theme="light"] footer{
      color:var(--text-mute)!important;
      background:linear-gradient(180deg,var(--footer-grad-start),var(--footer-grad-end))!important;
    }

    html[data-gria-theme="light"] .about-hero,
    html[data-gria-theme="light"] .feature-card,
    html[data-gria-theme="light"] .j-card,
    html[data-gria-theme="light"] .j-gate,
    html[data-gria-theme="light"] .support-card,
    html[data-gria-theme="light"] .value-card,
    html[data-gria-theme="light"] .bento-card,
    html[data-gria-theme="light"] .pastor-card,
    html[data-gria-theme="light"] .join-card,
    html[data-gria-theme="light"] .kkr-feature,
    html[data-gria-theme="light"] .annual-verse,
    html[data-gria-theme="light"] .worship-info-card,
    html[data-gria-theme="light"] .daily-verse-card{
      background:var(--bg-elevated)!important;
      border-color:var(--card-border)!important;
      color:var(--text)!important;
    }

    html[data-gria-theme="light"] .about-hero p,
    html[data-gria-theme="light"] .story-grid p,
    html[data-gria-theme="light"] .feature-card p,
    html[data-gria-theme="light"] .j-desc,
    html[data-gria-theme="light"] .j-note,
    html[data-gria-theme="light"] .j-head p,
    html[data-gria-theme="light"] .section-lead,
    html[data-gria-theme="light"] .support-card .donation-info{
      color:var(--text-mute)!important;
    }

    html[data-gria-theme="light"] .feature-chip,
    html[data-gria-theme="light"] .j-chip,
    html[data-gria-theme="light"] .j-lock,
    html[data-gria-theme="light"] .feature-link.secondary{
      color:#55565d!important;
      background:#f2f3ed!important;
      border-color:rgba(20,20,24,.08)!important;
    }

    html[data-gria-theme="light"] .j-field input,
    html[data-gria-theme="light"] input,
    html[data-gria-theme="light"] select,
    html[data-gria-theme="light"] textarea{
      color:#1b1b1e!important;
      background:#fff!important;
      border-color:rgba(20,20,24,.12)!important;
    }

    html[data-gria-theme="light"] .section-title .accent,
    html[data-gria-theme="light"] .about-hero h1 .accent{
      background:linear-gradient(100deg,#171719 25%,#85a900 88%)!important;
      -webkit-background-clip:text!important;
      background-clip:text!important;
      -webkit-text-fill-color:transparent!important;
    }

    .gria-global-theme-toggle{
      width:40px;height:40px;
      display:grid;place-items:center;
      flex:0 0 auto;
      margin-left:auto;
      border-radius:13px;
      color:var(--text,#ededed);
      background:var(--bg-elevated,#111114);
      border:1px solid var(--card-border,rgba(255,255,255,.08));
      transition:transform .18s ease;
    }
    .gria-global-theme-toggle:active{transform:scale(.95)}
    .gria-global-theme-toggle svg{width:19px;height:19px;stroke:currentColor}

    html[data-gria-theme="dark"] .gria-theme-icon-sun{display:none}
    html[data-gria-theme="light"] .gria-theme-icon-moon{display:none}

    .gria-bottom-nav,.gria-entry-gate{display:none}


    /* ===== v15: precise futuristic headers + tighter GRIA wordmark ===== */
    .navbar .navbar-inner{
      align-items:center!important;
    }

    .navbar .logo,
    .brand,
    .gria-entry-wordmark{
      display:inline-flex!important;
      align-items:center!important;
      white-space:nowrap!important;
      font-family:'Syne',var(--font-display),sans-serif!important;
      font-weight:800!important;
      font-kerning:normal!important;
      font-feature-settings:"kern" 1,"liga" 1!important;
      letter-spacing:-.085em!important;
      line-height:.88!important;
    }

    .navbar .logo span,
    .brand span,
    .gria-entry-wordmark span{
      display:inline-block!important;
      margin-left:-.055em!important;
      letter-spacing:-.085em!important;
      color:var(--neon,#ccff00)!important;
    }

    .navbar .logo img{
      margin-right:9px!important;
      letter-spacing:normal!important;
    }

    .navbar .logo{
      transform:translateY(-1px);
    }

    .home-header .brand{
      transform:translateY(-1px);
    }

    .warta-hero h1,
    .fellowship-head h1,
    .j-head h1,
    .b-head h1,
    .about-hero h1,
    .yy-hero-body h1{
      font-family:'Syne',var(--font-display),sans-serif!important;
      font-weight:800!important;
      line-height:.96!important;
      letter-spacing:-.055em!important;
      text-wrap:balance;
      font-kerning:normal;
      font-feature-settings:"kern" 1,"liga" 1;
    }

    .warta-hero .eyebrow,
    .fellowship-head .eyebrow,
    .b-kicker,
    .j-brand{
      letter-spacing:.12em!important;
      font-weight:800!important;
    }

    /* User requested these explanatory lines removed from the UI. */
    .home-intro > p,
    .home-note,
    .warta-hero > p,
    .j-head > div > p,
    .b-head > p{
      display:none!important;
    }

    /* The official-version panels stay compact: badge, title, action only. */
    .niv-panel > p{
      display:none!important;
    }

    @media(max-width:768px){
      .navbar .logo{
        font-size:clamp(25px,7.3vw,31px)!important;
      }

      .warta-hero h1,
      .fellowship-head h1,
      .j-head h1,
      .b-head h1{
        max-width:100%!important;
        overflow-wrap:normal!important;
        word-break:keep-all!important;
      }
    }

    @media(max-width:768px){
      body.gria-has-bottom-nav{
        padding-bottom:calc(96px + env(safe-area-inset-bottom,0px))!important;
      }

      .navbar .nav-links,.navbar .nav-cta,.navbar .nav-toggle{display:none!important}
      .navbar .navbar-inner{min-height:62px}

      .gria-bottom-nav{
        position:fixed;
        left:12px;right:12px;
        bottom:max(8px,env(safe-area-inset-bottom,0px));
        height:72px;
        z-index:9998;
        display:grid;
        grid-template-columns:repeat(4,1fr);
        align-items:center;
        padding:7px 8px;
        background:rgba(16,16,19,.94);
        border:1px solid rgba(255,255,255,.10);
        border-radius:24px;
        box-shadow:0 18px 45px rgba(0,0,0,.5);
        backdrop-filter:blur(24px);
        -webkit-backdrop-filter:blur(24px);
      }

      html[data-gria-theme="light"] .gria-bottom-nav{
        background:rgba(255,255,255,.94)!important;
        border-color:rgba(20,20,24,.09)!important;
        box-shadow:0 18px 40px rgba(25,25,30,.12)!important;
      }

      .gria-bottom-nav a{
        position:relative;height:58px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        gap:4px;color:#7f8087;text-decoration:none;border-radius:18px;
        font:650 10px/1 Inter,Manrope,sans-serif;
        transition:.18s ease;
      }
      .gria-bottom-nav a:active{transform:scale(.96)}
      .gria-bottom-nav a svg{width:22px;height:22px;stroke:currentColor}
      .gria-bottom-nav a.is-active{color:#ccff00;background:rgba(204,255,0,.075)}
      html[data-gria-theme="light"] .gria-bottom-nav a.is-active{
        color:#708f00!important;
        background:rgba(167,209,0,.13)!important;
      }
      .gria-bottom-nav a.is-active:before{
        content:'';position:absolute;top:3px;width:18px;height:2px;
        border-radius:999px;background:currentColor;
      }

      .gria-entry-gate{
        position:fixed;inset:0;z-index:10050;
        display:flex;align-items:flex-end;justify-content:center;
        padding:20px 16px calc(20px + env(safe-area-inset-bottom,0px));
        background:rgba(5,5,6,.96);
      }
      html[data-gria-theme="light"] .gria-entry-gate{background:rgba(245,246,241,.97)}
      .gria-entry-card{
        width:min(100%,480px);padding:28px 22px 22px;border-radius:30px;
        color:var(--text,#ededed);
        background:var(--bg-elevated,#111114);
        border:1px solid var(--card-border,rgba(255,255,255,.10))
      }
      .gria-entry-brand{display:flex;align-items:center;gap:12px;margin-bottom:24px}
      .gria-entry-brand img{width:48px;height:48px;border-radius:14px}
      .gria-entry-wordmark{font:800 25px/1 Syne,Inter,sans-serif}
      .gria-entry-wordmark span{color:var(--neon,#ccff00)}
      .gria-entry-card h1{font-size:29px;line-height:1.08;margin:0 0 12px}
      .gria-entry-card>p{color:var(--text-mute,#a8a8ad);font-size:14px;line-height:1.65}
      .gria-entry-primary,.gria-entry-secondary{width:100%;min-height:52px;border-radius:16px;font:700 14px Inter,sans-serif}
      .gria-entry-primary{color:#080808;background:var(--neon,#ccff00);margin-bottom:10px}
      .gria-entry-secondary{color:var(--text,#ededed);background:var(--bg-soft,#0e0e11);border:1px solid var(--card-border)}
      .gria-entry-note{display:block;margin-top:15px;color:var(--grey-dim,#73747a);font:500 11px/1.55 Inter,sans-serif;text-align:center}
    }
  `;
  document.head.appendChild(style);

  function readTheme(){
    try{
      const saved=localStorage.getItem(THEME_KEY);
      if(saved==='light'||saved==='dark')return saved;
    }catch(_){}
    return window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
  }

  let theme=readTheme();

  function applyTheme(next,persist=true){
    theme=next==='light'?'light':'dark';
    document.documentElement.setAttribute('data-gria-theme',theme);

    /* Bible page has its own theme variables; sync it with the app. */
    document.body && document.body.setAttribute('data-bible-theme',theme);

    let meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.setAttribute('content',theme==='light'?'#f7f7f3':'#0a0a0c');

    if(persist){
      try{
        localStorage.setItem(THEME_KEY,theme);
        localStorage.setItem('gria_home_theme_v1',theme);
        localStorage.setItem('gria_bible_theme_v1',theme);
      }catch(_){}
    }
  }

  applyTheme(theme,false);

  function bindThemeButtons(){
    document.querySelectorAll('[data-gria-theme-toggle]').forEach(btn=>{
      if(btn.dataset.themeBound)return;
      btn.dataset.themeBound='1';
      btn.addEventListener('click',()=>applyTheme(theme==='dark'?'light':'dark'));
    });

    /* Existing Bible Dark/Light buttons also control the entire app. */
    document.querySelectorAll('[data-theme-choice]').forEach(btn=>{
      if(btn.dataset.globalThemeBound)return;
      btn.dataset.globalThemeBound='1';
      btn.addEventListener('click',()=>{
        const t=btn.getAttribute('data-theme-choice');
        if(t==='dark'||t==='light')applyTheme(t);
      });
    });
  }

  function addThemeButton(){
    if(document.querySelector('[data-gria-theme-toggle]'))return;
    const inner=document.querySelector('.navbar .navbar-inner');
    if(!inner)return;

    const btn=document.createElement('button');
    btn.type='button';
    btn.className='gria-global-theme-toggle';
    btn.setAttribute('data-gria-theme-toggle','');
    btn.setAttribute('aria-label','Ganti mode gelap atau terang');
    btn.innerHTML=`
      <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8">
        <path class="gria-theme-icon-moon" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>
        <g class="gria-theme-icon-sun">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </g>
      </svg>`;
    inner.appendChild(btn);
  }

  function setupWelcomeGate(){
    if(currentFile()!=='index.html'||document.getElementById('griaEntryGate'))return;
    let mode=null;
    try{mode=localStorage.getItem('gria_entry_mode')}catch(_){}
    if(mode==='guest'||mode==='member')return;

    const gate=document.createElement('div');
    gate.id='griaEntryGate';
    gate.className='gria-entry-gate';
    gate.innerHTML=`
      <section class="gria-entry-card" role="dialog" aria-modal="true">
        <div class="gria-entry-brand">
          <img src="${appUrl('icon-192.png')}" alt="">
          <div class="gria-entry-wordmark">GRI<span>A</span></div>
        </div>
        <h1>Selamat datang di GRIA</h1>
        <p>Informasi ibadah dan Warta dapat diakses sebagai tamu. Ruang Jemaat menggunakan kode khusus.</p>
        <button class="gria-entry-primary" id="griaMemberEntry">Saya Jemaat GRIA</button>
        <button class="gria-entry-secondary" id="griaGuestEntry">Lanjut sebagai tamu</button>
        <small class="gria-entry-note">Kode akses dapat ditanyakan melalui grup WhatsApp GRIA.</small>
      </section>`;
    document.body.appendChild(gate);

    document.getElementById('griaMemberEntry').onclick=()=>location.href=appUrl('jemaat.html');
    document.getElementById('griaGuestEntry').onclick=()=>{
      try{localStorage.setItem('gria_entry_mode','guest')}catch(_){}
      gate.remove();
    };
  }

  function setupBottomNav(){
    const file=currentFile(),section=activeSection(file);
    if(!section||document.getElementById('griaBottomNav'))return;

    document.body.classList.add('gria-has-bottom-nav');

    const items=[
      ['index.html','home','Home','<path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z"/>'],
      ['warta.html','warta','Warta','<path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M7 7h10M7 11h10M7 15h6"/>'],
      ['persekutuan.html','persekutuan','Persekutuan','<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>'],
      ['jemaat.html','jemaat','Jemaat','<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>']
    ];

    const nav=document.createElement('nav');
    nav.id='griaBottomNav';
    nav.className='gria-bottom-nav';
    nav.setAttribute('aria-label','Navigasi utama GRIA');
    nav.innerHTML=items.map(([f,key,label,icon])=>`
      <a class="${key===section?'is-active':''}" href="${appUrl(f)}" ${key===section?'aria-current="page"':''}>
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${icon}</svg>
        <span>${label}</span>
      </a>`).join('');
    document.body.appendChild(nav);
  }


  function removeUnneededCopy(){
    const selectors=[
      '.home-intro > p',
      '.home-note',
      '.warta-hero > p',
      '.j-head > div > p',
      '.b-head > p'
    ];

    selectors.forEach(sel=>{
      document.querySelectorAll(sel).forEach(el=>el.remove());
    });

    document.querySelectorAll('.niv-panel > p').forEach(el=>{
      const text=(el.textContent||'').trim();
      if(
        text.startsWith('TB adalah teks resmi LAI') ||
        text.includes('GRIA tidak menyalin full-text TB')
      ){
        el.remove();
      }
    });

    /* Warta Mobile previously adds a freshness sentence; keep header clean. */
    document.querySelectorAll('.warta-freshness').forEach(el=>el.remove());
  }

  let cleanupQueued=false;
  function queueCopyCleanup(){
    if(cleanupQueued)return;
    cleanupQueued=true;
    requestAnimationFrame(()=>{
      removeUnneededCopy();
      cleanupQueued=false;
    });
  }

  function observeDynamicCopy(){
    if(!document.body)return;
    const observer=new MutationObserver(queueCopyCleanup);
    observer.observe(document.body,{childList:true,subtree:true});
  }

  function init(){
    addThemeButton();
    bindThemeButtons();
    setupWelcomeGate();
    setupBottomNav();
    removeUnneededCopy();
    observeDynamicCopy();
    applyTheme(theme,false);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();

  window.GRIA_THEME={get:()=>theme,set:applyTheme};
})();
