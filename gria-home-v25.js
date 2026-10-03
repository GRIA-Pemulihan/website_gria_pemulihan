/* GRIA Home v25 — local photo folder first, no Wikimedia dependency */
(function(){
  'use strict';
  if(window.__GRIA_HOME_V25)return;
  window.__GRIA_HOME_V25=true;

  var DAILY_TB=[
    {book:19,chapter:23,verse:1,ref:'Mazmur 23:1',text:'Mazmur Daud. TUHAN adalah gembalaku, takkan kekurangan aku.'},
    {book:50,chapter:4,verse:13,ref:'Filipi 4:13',text:'Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.'},
    {book:48,chapter:5,verse:22,ref:'Galatia 5:22',text:'Tetapi buah Roh ialah: kasih, sukacita, damai sejahtera, kesabaran, kemurahan, kebaikan, kesetiaan.'},
    {book:19,chapter:121,verse:2,ref:'Mazmur 121:2',text:'Pertolonganku ialah dari TUHAN, yang menjadikan langit dan bumi.'},
    {book:46,chapter:13,verse:13,ref:'1 Korintus 13:13',text:'Demikianlah tinggal ketiga hal ini, yaitu iman, pengharapan dan kasih, dan yang paling besar di antaranya ialah kasih.'},
    {book:19,chapter:37,verse:5,ref:'Mazmur 37:5',text:'Serahkanlah hidupmu kepada TUHAN dan percayalah kepada-Nya, dan Ia akan bertindak.'},
    {book:51,chapter:3,verse:23,ref:'Kolose 3:23',text:'Apa pun juga yang kamu perbuat, perbuatlah dengan segenap hatimu seperti untuk Tuhan dan bukan untuk manusia.'}
  ];

  /* Fallback hanya foto GRIA lokal yang sudah ada di repo. */
  var FALLBACK_MEDIA=[
    {src:'foto-ibadah-natal.png',title:'Ibadah GRIA',source:'Foto GRIA'},
    {src:'foto-hut-gria.png',title:'GRIA Pemulihan Palu',source:'Foto GRIA'},
    {src:'foto-kebersamaan-gria.png',title:'Kebersamaan GRIA',source:'Foto GRIA'},
    {src:'foto-komunitas-hero.png',title:'Komunitas GRIA',source:'Foto GRIA'}
  ];

  var root=new URL('./',document.currentScript?document.currentScript.src:location.href);

  function url(p){return new URL(p,root).href}
  function qs(s){return document.querySelector(s)}
  function dayOfYear(d){
    var start=new Date(d.getFullYear(),0,0);
    return Math.floor((d-start)/86400000);
  }
  function idle(fn){
    ('requestIdleCallback' in window)?requestIdleCallback(fn,{timeout:600}):setTimeout(fn,100);
  }

  function cleanupHome(){
    document.querySelectorAll('.gria-app-tools,.home-strip').forEach(function(el){el.remove()});
  }

  function setGreeting(){
    try{
      if(localStorage.getItem('gria_member_access_v1')==='yes'&&qs('#homeGreeting')){
        qs('#homeGreeting').textContent='Jemaat GRIA';
      }
    }catch(_){}
  }

  function applyImage(media){
    var bg=qs('#dailyHeroBg');
    var hero=qs('#dailyHero');
    var source=qs('#heroMediaSource');
    if(!bg||!media||!media.src)return;

    var src=url(media.src);
    var img=new Image();
    img.decoding='async';
    try{img.fetchPriority='low'}catch(_){}

    img.onload=function(){
      var done=function(){
        bg.style.backgroundImage='url("'+src.replace(/"/g,'%22')+'")';
        if(source)source.textContent=media.source||'Foto GRIA';
        requestAnimationFrame(function(){
          if(hero)hero.classList.add('is-image-ready');
        });
      };
      if(img.decode)img.decode().then(done).catch(done);else done();
    };

    img.onerror=function(){
      var fallback=FALLBACK_MEDIA[dayOfYear(new Date())%FALLBACK_MEDIA.length];
      if(media.src!==fallback.src)applyImage(fallback);
    };

    img.src=src;
  }

  async function loadHero(today){
    idle(async function(){
      var pool=[];
      try{
        var res=await fetch(url('foto-home.json?ts='+Date.now()),{cache:'no-store'});
        if(res.ok){
          var data=await res.json();
          if(data&&Array.isArray(data.images))pool=data.images;
        }
      }catch(_){}

      if(!pool.length)pool=FALLBACK_MEDIA;

      /* Foto berganti otomatis per hari berdasarkan urutan file di folder. */
      var chosen=pool[dayOfYear(today)%pool.length];
      applyImage(chosen);
    });
  }

  function openVerse(loc){
    try{
      localStorage.setItem('gria_multi_bible_location_v1',JSON.stringify({
        version:'tb',
        book:String(loc.book),
        chapter:loc.chapter,
        verse:loc.verse
      }));
    }catch(_){}
    location.href=url('alkitab.html');
  }

  function loadDailyVerse(today){
    var current=DAILY_TB[dayOfYear(today)%DAILY_TB.length];
    var text=qs('#dailyVerseText');
    var ref=qs('#dailyVerseRef');

    if(text)text.textContent='“'+current.text+'”';
    if(ref){
      ref.textContent=current.ref;
      ref.title='Terjemahan Baru';
    }

    var open=qs('#openVerseBtn');
    if(open)open.onclick=function(){openVerse(current)};

    window.GRIA_DAILY_VERSE={
      text:current.text,
      ref:current.ref,
      translation:'TB'
    };
  }

  function parseIndonesianDate(str){
    var months={januari:0,februari:1,maret:2,april:3,mei:4,juni:5,juli:6,agustus:7,september:8,oktober:9,november:10,desember:11};
    var m=String(str||'').toLowerCase().match(/(\d{1,2})\s+(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\s+(\d{4})/);
    return m?new Date(Number(m[3]),months[m[2]],Number(m[1])):null;
  }

  function setupSunday(today){
    var el=qs('#sundayDate');
    if(!el)return;

    var shown=(el.textContent||'').trim();
    var eventDate=parseIndonesianDate(shown);

    if(!eventDate){
      eventDate=new Date(today);
      var diff=(7-today.getDay())%7;
      eventDate.setDate(today.getDate()+diff);
      shown=new Intl.DateTimeFormat('id-ID',{
        weekday:'long',day:'numeric',month:'long',year:'numeric'
      }).format(eventDate);
      el.textContent=shown.charAt(0).toUpperCase()+shown.slice(1);
    }

    var a=new Date(today.getFullYear(),today.getMonth(),today.getDate());
    var b=new Date(eventDate.getFullYear(),eventDate.getMonth(),eventDate.getDate());
    var days=Math.max(0,Math.ceil((b-a)/86400000));

    var count=qs('#sundayCountdown');
    if(count){
      count.textContent=days===0?'Hari ini':days===1?'Besok':days+' hari lagi';
    }
  }

  function init(){
    var today=new Date();
    cleanupHome();
    setGreeting();
    loadDailyVerse(today);
    setupSunday(today);
    requestAnimationFrame(function(){loadHero(today)});
    setTimeout(cleanupHome,120);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();
