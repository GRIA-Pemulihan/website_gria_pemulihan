/* GRIA Modern App Layer v18 */
(function(){
  'use strict';
  if(window.__GRIA_MODERN_V18)return;
  window.__GRIA_MODERN_V18=true;

  var script=document.currentScript;
  var ROOT=script?new URL('./',script.src):new URL('./',location.href);
  function url(p){return new URL(p,ROOT).href}
  function file(){return location.pathname.split('/').pop()||'index.html'}
  function qs(s,r){return (r||document).querySelector(s)}
  function esc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')}

  if(!qs('link[href*="gria-modern.css"]')){
    var l=document.createElement('link');l.rel='stylesheet';l.href=url('gria-modern.css?v=18');document.head.appendChild(l);
  }

  var SEARCH_INDEX=[
    {title:'Warta Jemaat',desc:'Warta mingguan dan informasi terbaru GRIA.',href:'warta.html',tags:'warta pengumuman informasi minggu'},
    {title:'Jadwal Pelayanan',desc:'Jadwal pelayan ibadah raya beberapa pekan ke depan.',href:'warta.html#jadwal-pelayanan',tags:'jadwal pelayanan singer liturgos firman operator pendoa kolektan'},
    {title:'Jadwal Saya',desc:'Temukan jadwal pelayanan berdasarkan nama.',href:'jadwal-saya.html',tags:'jadwal saya pelayan nama tugas'},
    {title:'Persekutuan GRIA',desc:'Pendalaman Alkitab, doa, dan kehidupan komunitas.',href:'persekutuan.html',tags:'pa doa persekutuan komunitas'},
    {title:'Event & RSVP',desc:'Lihat kegiatan GRIA dan tandai kehadiran dari perangkat.',href:'events.html',tags:'event acara rsvp hadir kegiatan'},
    {title:'Ruang Jemaat',desc:'Fitur khusus jemaat GRIA.',href:'jemaat.html',tags:'jemaat member ruang anggota'},
    {title:'Alkitab',desc:'Baca Alkitab dan akses versi yang tersedia.',href:'alkitab.html',tags:'alkitab ayt bible firman yohanes mazmur kejadian'},
    {title:'Tentang GRIA',desc:'Profil dan informasi GRIA Pemulihan Palu.',href:'about-us.html',tags:'tentang gereja profil gria'},
    {title:'Komunitas',desc:'Kehidupan bersama dan komunitas GRIA.',href:'komunitas.html',tags:'komunitas bersama kelompok'}
  ];
  function search(term){
    var q=String(term||'').trim().toLowerCase();
    if(!q)return SEARCH_INDEX.slice();
    var parts=q.split(/\s+/);
    return SEARCH_INDEX.map(function(x){
      var hay=(x.title+' '+x.desc+' '+x.tags).toLowerCase();
      var score=0;parts.forEach(function(p){if(hay.indexOf(p)>=0)score+=hay.indexOf(p)<12?3:1});
      return {x:x,score:score};
    }).filter(function(r){return r.score>0}).sort(function(a,b){return b.score-a.score}).map(function(r){return r.x});
  }

  function toast(msg){
    var t=qs('#griaToast');if(!t){t=document.createElement('div');t.id='griaToast';t.className='gria-toast';document.body.appendChild(t)}
    t.textContent=msg;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(function(){t.classList.remove('show')},2600);
  }

  function modal(title,copy,steps){
    var old=qs('#griaModal');if(old)old.remove();
    var m=document.createElement('div');m.id='griaModal';m.className='gria-modal';
    var stepHtml=(steps||[]).map(function(s,i){return '<div class="gria-modal-step"><b>'+(i+1)+'.</b> '+esc(s)+'</div>'}).join('');
    m.innerHTML='<div class="gria-modal-card" role="dialog" aria-modal="true"><h3>'+esc(title)+'</h3><p>'+esc(copy)+'</p><div class="gria-modal-steps">'+stepHtml+'</div><button class="gria-modal-close" type="button">Mengerti</button></div>';
    m.addEventListener('click',function(e){if(e.target===m||e.target.classList.contains('gria-modal-close'))m.remove()});
    document.body.appendChild(m);
  }

  function progress(){
    var p=document.createElement('div');p.className='gria-progress';document.body.appendChild(p);
    window.addEventListener('pageshow',function(){p.classList.add('is-done');setTimeout(function(){p.className='gria-progress'},280)});
    document.addEventListener('click',function(e){
      var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
      var h=a.getAttribute('href')||'';if(!h||h[0]==='#')return;
      try{if(/^https?:/.test(h)&&new URL(h,location.href).origin!==location.origin)return}catch(_){}
      p.classList.add('is-on');
    });
  }

  function connectivity(){
    var el=document.createElement('div');el.className='gria-connectivity';document.body.appendChild(el);
    function paint(show){
      var on=navigator.onLine;el.textContent=on?'Online':'Offline';el.classList.toggle('offline',!on);
      if(show){el.classList.add('show');setTimeout(function(){el.classList.remove('show')},1800)}
    }
    window.addEventListener('online',function(){paint(true)});window.addEventListener('offline',function(){paint(true)});paint(false);
  }

  function sectionFor(f){
    if(['index.html','about-us.html','yayasan.html'].indexOf(f)>=0)return'home';
    if(f==='warta.html')return'warta';
    if(f==='search.html')return'search';
    if(['persekutuan.html','komunitas.html'].indexOf(f)>=0)return'persekutuan';
    if(['jemaat.html','alkitab.html','jadwal-saya.html','events.html'].indexOf(f)>=0)return'jemaat';
    return null;
  }
  function navItems(){
    return [
      ['index.html','home','Home','<path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z"/>'],
      ['warta.html','warta','Warta','<path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M7 7h10M7 11h10M7 15h6"/>'],
      ['search.html','search','Cari','<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>'],
      ['persekutuan.html','persekutuan','Persekutuan','<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>'],
      ['jemaat.html','jemaat','Jemaat','<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>']
    ];
  }
  function ensureBottomNav(){
    var f=file(),section=sectionFor(f);if(!section)return;
    var nav=qs('#griaBottomNav');
    if(nav){
      if(!nav.querySelector('a[href*="search.html"]')){
        var links=nav.querySelectorAll('a');
        var warta=Array.prototype.slice.call(links).find(function(a){return /warta\.html/.test(a.getAttribute('href')||'')});
        var a=document.createElement('a');a.href=url('search.html');a.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><span>Cari</span>';
        if(warta&&warta.nextSibling)nav.insertBefore(a,warta.nextSibling);else nav.appendChild(a);
      }
      nav.querySelectorAll('a').forEach(function(a){a.classList.remove('is-active');a.removeAttribute('aria-current')});
      var active=Array.prototype.slice.call(nav.querySelectorAll('a')).find(function(a){return (a.getAttribute('href')||'').indexOf(navItems().find(function(i){return i[1]===section})[0])>=0});
      if(active){active.classList.add('is-active');active.setAttribute('aria-current','page')}
      document.body.classList.add('gria-has-bottom-nav');return;
    }
    nav=document.createElement('nav');nav.id='griaBottomNav';nav.className='gria-bottom-nav';nav.setAttribute('aria-label','Navigasi utama GRIA');
    nav.innerHTML=navItems().map(function(i){return '<a class="'+(i[1]===section?'is-active':'')+'" href="'+url(i[0])+'" '+(i[1]===section?'aria-current="page"':'')+'><svg viewBox="0 0 24 24" fill="none" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+i[3]+'</svg><span>'+i[2]+'</span></a>'}).join('');
    document.body.appendChild(nav);document.body.classList.add('gria-has-bottom-nav');
  }

  var deferredInstall=null;
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferredInstall=e;document.dispatchEvent(new Event('gria-install-ready'))});
  function isStandalone(){return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true}
  function isIOS(){return /iphone|ipad|ipod/i.test(navigator.userAgent)}
  async function installApp(){
    if(isStandalone()){toast('GRIA sudah terpasang di Home Screen.');return}
    if(deferredInstall){
      deferredInstall.prompt();
      try{await deferredInstall.userChoice}catch(_){}
      deferredInstall=null;return;
    }
    if(isIOS()){
      modal('Pasang GRIA di iPhone','Gunakan Safari agar GRIA bisa ditambahkan seperti aplikasi.',['Buka tautan GRIA di Safari.','Ketuk tombol Share.','Pilih Add to Home Screen / Tambahkan ke Layar Utama.','Ketuk Add, lalu buka ikon GRIA dari Home Screen.']);return;
    }
    modal('Pasang GRIA di Android','Chrome Android terbaru menempatkan opsi pemasangan di menu browser.',['Buka GRIA di Chrome.','Ketuk menu tiga titik (⋮).','Pilih “Instal dan buat pintasan”.','Pilih “Instal”, lalu buka GRIA dari Home Screen.']);
  }

  async function enableNotifications(){
    if(!('Notification' in window)){toast('Notifikasi browser belum didukung di perangkat ini.');return false}
    var p=Notification.permission;
    if(p!=='granted')p=await Notification.requestPermission();
    if(p==='granted'){
      try{localStorage.setItem('gria_notify_updates','yes')}catch(_){}
      try{new Notification('GRIA',{body:'Notifikasi update Warta diaktifkan.',icon:url('icon-192.png')})}catch(_){}
      toast('Notifikasi update aktif.');return true;
    }
    toast('Izin notifikasi belum diberikan.');return false;
  }

  function hashText(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24)}return (h>>>0).toString(16)}
  async function checkWartaUpdate(){
    var enabled=false;try{enabled=localStorage.getItem('gria_notify_updates')==='yes'}catch(_){}
    if(!enabled||!('Notification' in window)||Notification.permission!=='granted')return;
    try{
      var r=await fetch(url('warta.html?check='+Date.now()),{cache:'no-store'});if(!r.ok)return;
      var txt=await r.text();var h=hashText(txt.replace(/\s+/g,' '));var prev=localStorage.getItem('gria_warta_hash');
      if(prev&&prev!==h){new Notification('Warta GRIA diperbarui',{body:'Ada informasi atau jadwal terbaru. Buka GRIA untuk melihatnya.',icon:url('icon-192.png')})}
      localStorage.setItem('gria_warta_hash',h);
    }catch(_){}
  }

  function setupHome(){
    if(file()!=='index.html')return;
    var card=qs('.sunday-card');if(!card||qs('.gria-app-tools'))return;
    var tools=document.createElement('div');tools.className='gria-app-tools';
    tools.innerHTML='<button class="gria-app-tool primary" id="griaInstallBtn" type="button">Pasang GRIA di HP</button><a class="gria-app-tool" href="'+url('search.html')+'">Cari di GRIA</a>';
    card.insertAdjacentElement('afterend',tools);
    qs('#griaInstallBtn').addEventListener('click',installApp);
    if(isStandalone())qs('#griaInstallBtn').textContent='GRIA sudah terpasang';
  }

  function setupWarta(){
    if(file()!=='warta.html')return;
    var hero=qs('.warta-hero');if(!hero||qs('.gria-smartbar'))return;
    var d=new Date(document.lastModified);var when=isNaN(d.getTime())?'Versi terbaru':new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(d);
    var bar=document.createElement('div');bar.className='gria-smartbar';
    bar.innerHTML='<div class="gria-smartbar-status">Diperbarui '+esc(when)+'</div><div class="gria-smartbar-actions"><button id="griaShareWarta" type="button">Bagikan</button></div>';
    hero.insertAdjacentElement('afterend',bar);
    qs('#griaShareWarta').onclick=async function(){
      var data={title:'Warta Jemaat GRIA',text:'Warta Jemaat dan jadwal pelayanan GRIA',url:location.href};
      if(navigator.share){try{await navigator.share(data);return}catch(_){}}
      try{await navigator.clipboard.writeText(location.href);toast('Tautan Warta disalin.')}catch(_){toast('Silakan salin tautan dari browser.')}
    };
  }

  function setupMember(){
    if(file()!=='jemaat.html')return;
    function inject(){
      var grid=qs('.j-grid');if(!grid||qs('#griaMemberModern'))return;
      var wrap=document.createElement('div');wrap.id='griaMemberModern';wrap.className='j-coming-row';
      wrap.innerHTML='<section class="j-card gria-modern-card is-visible"><span class="gm-label">Personal</span><h3>Jadwal Saya</h3><p>Cari nama Anda dan lihat tugas pelayanan tanpa membaca seluruh tabel Warta.</p><div class="gria-modern-actions"><a href="'+url('jadwal-saya.html')+'">Buka Jadwal Saya</a></div></section>'+
        '<section class="j-card gria-modern-card is-visible"><span class="gm-label">Kegiatan</span><h3>Event & RSVP</h3><p>Lihat kegiatan dari Warta dan tandai rencana kehadiran di perangkat ini.</p><div class="gria-modern-actions"><a href="'+url('events.html')+'">Lihat Event</a></div></section>'+
        '<section class="j-card gria-modern-card is-visible"><span class="gm-label">Update</span><h3>Notifikasi Warta</h3><p>Dapatkan pemberitahuan saat GRIA mendeteksi Warta berubah ketika aplikasi dibuka.</p><div class="gria-modern-actions"><button id="griaNotifyBtn" type="button">Aktifkan Notifikasi</button></div></section>';
      grid.appendChild(wrap);
      var b=qs('#griaNotifyBtn');if(b)b.onclick=enableNotifications;
    }
    inject();
    var mo=new MutationObserver(inject);mo.observe(document.body,{childList:true,subtree:true});
    setTimeout(inject,200);
  }

  function init(){progress();connectivity();ensureBottomNav();setupHome();setupWarta();setupMember();checkWartaUpdate()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();

  window.GRIA_APP={root:ROOT,url:url,searchIndex:SEARCH_INDEX,search:search,toast:toast,install:installApp,enableNotifications:enableNotifications};
})();
