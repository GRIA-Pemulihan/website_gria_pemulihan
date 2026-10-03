/* GRIA Home v22 — Christian media + Daily Verse in LAI Terjemahan Baru (TB) */
(function(){
  'use strict';
  if(window.__GRIA_HOME_V22)return;
  window.__GRIA_HOME_V22=true;

  /* Short daily excerpts from the official TB edition on YouVersion (version 306).
     Full TB text is not stored in this repository; only these selected short excerpts. */
  var DAILY_TB=[
    {book:19,chapter:23,verse:1,ref:'Mazmur 23:1',text:'Mazmur Daud. TUHAN adalah gembalaku, takkan kekurangan aku.',source:'https://www.bible.com/id/bible/306/PSA.23.1.TB'},
    {book:50,chapter:4,verse:13,ref:'Filipi 4:13',text:'Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.',source:'https://www.bible.com/id/bible/306/PHP.4.13.TB'},
    {book:48,chapter:5,verse:22,ref:'Galatia 5:22',text:'Tetapi buah Roh ialah: kasih, sukacita, damai sejahtera, kesabaran, kemurahan, kebaikan, kesetiaan.',source:'https://www.bible.com/id/bible/306/GAL.5.22.TB'},
    {book:19,chapter:121,verse:2,ref:'Mazmur 121:2',text:'Pertolonganku ialah dari TUHAN, yang menjadikan langit dan bumi.',source:'https://www.bible.com/id/bible/306/PSA.121.2.TB'},
    {book:46,chapter:13,verse:13,ref:'1 Korintus 13:13',text:'Demikianlah tinggal ketiga hal ini, yaitu iman, pengharapan dan kasih, dan yang paling besar di antaranya ialah kasih.',source:'https://www.bible.com/id/bible/306/1CO.13.13.TB'},
    {book:19,chapter:37,verse:5,ref:'Mazmur 37:5',text:'Serahkanlah hidupmu kepada TUHAN dan percayalah kepada-Nya, dan Ia akan bertindak.',source:'https://www.bible.com/id/bible/306/PSA.37.5.TB'},
    {book:51,chapter:3,verse:23,ref:'Kolose 3:23',text:'Apa pun juga yang kamu perbuat, perbuatlah dengan segenap hatimu seperti untuk Tuhan dan bukan untuk manusia.',source:'https://www.bible.com/id/bible/306/COL.3.23.TB'}
  ];

  var FALLBACK_MEDIA=[
    {src:'foto-komunitas-hero.png',title:'Komunitas GRIA',fallback:'foto-komunitas-hero.png'},
    {src:'foto-kebersamaan-gria.png',title:'Kebersamaan GRIA',fallback:'foto-kebersamaan-gria.png'},
    {src:'foto-hut-gria.png',title:'GRIA Pemulihan Palu',fallback:'foto-hut-gria.png'}
  ];
  var root=new URL('./',document.currentScript?document.currentScript.src:location.href);
  function url(p){return new URL(p,root).href}
  function qs(s){return document.querySelector(s)}
  function dayOfYear(d){var start=new Date(d.getFullYear(),0,0);return Math.floor((d-start)/86400000)}

  function setGreeting(){try{if(localStorage.getItem('gria_member_access_v1')==='yes')qs('#homeGreeting').textContent='Jemaat GRIA'}catch(_){}}

  function loadImage(media){
    var bg=qs('#dailyHeroBg'),hero=qs('#dailyHero');if(!bg)return;
    var primary=media&&media.src?media.src:'';
    var fallback=url(media&&media.fallback?media.fallback:'foto-komunitas-hero.png');
    var img=new Image();
    img.onload=function(){bg.style.backgroundImage='url("'+primary.replace(/"/g,'%22')+'")';hero&&hero.classList.add('is-ready')};
    img.onerror=function(){bg.style.backgroundImage='url("'+fallback+'")';hero&&hero.classList.add('is-ready')};
    img.src=primary||fallback;
    var source=qs('#heroMediaSource');
    if(source){source.textContent=media&&media.license?'Media: Wikimedia Commons · '+media.license:'Foto GRIA'}
  }

  async function setHeroImage(today){
    var pool=FALLBACK_MEDIA;
    try{
      var res=await fetch(url('christian-media.json'),{cache:'force-cache'});
      if(res.ok){var data=await res.json();if(data&&Array.isArray(data.images)&&data.images.length)pool=data.images}
    }catch(_){ }
    loadImage(pool[dayOfYear(today)%pool.length]);
  }

  function openVerse(loc){
    try{localStorage.setItem('gria_multi_bible_location_v1',JSON.stringify({version:'tb',book:String(loc.book),chapter:loc.chapter,verse:loc.verse}))}catch(_){}
    location.href=url('alkitab.html');
  }

  function loadDailyVerse(today){
    var current=DAILY_TB[dayOfYear(today)%DAILY_TB.length];
    var text=qs('#dailyVerseText'),ref=qs('#dailyVerseRef');
    if(text)text.textContent='“'+current.text+'”';
    if(ref){ref.textContent=current.ref;ref.title='Terjemahan Baru · Lembaga Alkitab Indonesia'}
    var open=qs('#openVerseBtn');if(open)open.onclick=function(){openVerse(current)};
    window.GRIA_DAILY_VERSE={text:current.text,ref:current.ref,translation:'TB',source:current.source};
  }

  function parseIndonesianDate(str){
    var months={januari:0,februari:1,maret:2,april:3,mei:4,juni:5,juli:6,agustus:7,september:8,oktober:9,november:10,desember:11};
    var m=String(str||'').toLowerCase().match(/(\d{1,2})\s+(januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)\s+(\d{4})/);
    return m?new Date(Number(m[3]),months[m[2]],Number(m[1])):null;
  }
  function setupSunday(today){
    var el=qs('#sundayDate');if(!el)return;var shown=(el.textContent||'').trim();var eventDate=parseIndonesianDate(shown);
    if(!eventDate){eventDate=new Date(today);var diff=(7-today.getDay())%7;eventDate.setDate(today.getDate()+diff);shown=new Intl.DateTimeFormat('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(eventDate);el.textContent=shown.charAt(0).toUpperCase()+shown.slice(1)}
    var a=new Date(today.getFullYear(),today.getMonth(),today.getDate()),b=new Date(eventDate.getFullYear(),eventDate.getMonth(),eventDate.getDate());
    var days=Math.max(0,Math.ceil((b-a)/86400000)),count=qs('#sundayCountdown');if(count)count.textContent=days===0?'Hari ini':days===1?'Besok':days+' hari lagi';
  }

  function init(){var today=new Date();setGreeting();setHeroImage(today);setupSunday(today);loadDailyVerse(today)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
