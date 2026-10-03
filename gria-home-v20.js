/* GRIA Home v20 — Daily Verse + Christian media repository */
(function(){
  'use strict';
  if(window.__GRIA_HOME_V20)return;
  window.__GRIA_HOME_V20=true;

  var DAILY_REFS=[
    [19,23,1],[19,46,2],[43,3,16],[50,4,13],[24,29,11],[45,8,28],[23,40,31],[20,3,5],
    [40,11,28],[19,119,105],[6,1,9],[19,121,2],[45,12,12],[46,13,13],[49,2,10],[50,4,6],
    [51,3,23],[58,11,1],[59,1,5],[60,5,7],[62,4,19],[19,37,5],[20,16,3],[23,41,10],
    [40,5,14],[43,14,6],[45,15,13],[47,5,17],[48,5,22],[49,3,20],[66,21,4]
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
    var picked=pool[dayOfYear(today)%pool.length];
    loadImage(picked);
  }

  function refLabel(bookName,ch,v){return bookName+' '+ch+':'+v}
  function openVerse(loc){try{localStorage.setItem('gria_multi_bible_location_v1',JSON.stringify({version:'ayt',book:String(loc.book),chapter:loc.chapter,verse:loc.verse}))}catch(_){}location.href=url('alkitab.html')}

  async function loadDailyVerse(today){
    var picked=DAILY_REFS[dayOfYear(today)%DAILY_REFS.length];
    var fallback={text:'TUHAN adalah gembalaku, aku tidak akan kekurangan.',ref:'Mazmur 23:1',book:19,chapter:23,verse:1};
    var current=fallback;
    try{
      var res=await fetch(url('ayt-data.min.json'),{cache:'force-cache'});if(!res.ok)throw new Error('AYT unavailable');
      var data=await res.json();var book=data.books.find(function(b){return Number(b[0])===picked[0]});
      var chapter=book&&book[3].find(function(c){return Number(c[0])===picked[1]});var verse=chapter&&chapter[1].find(function(v){return Number(v[0])===picked[2]});
      if(book&&verse)current={text:String(verse[1]||'').trim(),ref:refLabel(book[2],picked[1],picked[2]),book:picked[0],chapter:picked[1],verse:picked[2]};
    }catch(e){console.warn('Daily verse fallback used',e)}

    var text=qs('#dailyVerseText'),ref=qs('#dailyVerseRef');if(text)text.textContent='“'+current.text+'”';if(ref)ref.textContent=current.ref;
    var open=qs('#openVerseBtn');if(open)open.onclick=function(){openVerse(current)};
    var share=qs('#shareVerseBtn');if(share)share.onclick=async function(){
      var payload={title:'Ayat Hari Ini — GRIA',text:'“'+current.text+'”\n'+current.ref+' · AYT',url:location.href};
      if(navigator.share){try{await navigator.share(payload);return}catch(_){}}
      try{await navigator.clipboard.writeText(payload.text+'\n'+payload.url);if(window.GRIA_APP)window.GRIA_APP.toast('Ayat hari ini disalin.')}catch(_){if(window.GRIA_APP)window.GRIA_APP.toast('Ayat siap dibagikan.')}
    };
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
