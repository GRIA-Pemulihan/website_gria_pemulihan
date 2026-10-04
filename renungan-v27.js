/* GRIA V27 — Renungan Harian */
(function(){
  'use strict';
  if(window.__GRIA_RENUNGAN_V27)return;
  window.__GRIA_RENUNGAN_V27=true;

  const TZ='Asia/Makassar';
  const START_DATE='2026-10-04';
  const RELEASE_HOUR=6;
  const DATA_FILE='renungan-data-oct-2026.json';
  const SUPABASE_URL='https://sdlzgekgjdpleiknwenj.supabase.co';
  const SUPABASE_KEY='sb_publishable_sxbY07LylMa-w2ebAy6p1g_qFfCQ3_D';
  let reactionClient=null;
  const ROOT=new URL('./',document.currentScript?document.currentScript.src:location.href);
  const $=s=>document.querySelector(s);
  let source=null,items=[],selected=null;
  let reactionView=null;
  const pendingReactions=new Set();
  const memoryReactions={};
  const sessionDeviceId=crypto.randomUUID?crypto.randomUUID():"dev-"+Date.now()+"-"+Math.random().toString(36).slice(2);

  function appUrl(p){return new URL(p,ROOT).href}
  function toast(msg){const el=$('#devToast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),2200)}
  function witaParts(){
    const parts=new Intl.DateTimeFormat('en-US',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
    const out={};parts.forEach(p=>out[p.type]=p.value);return out;
  }
  function witaNow(){const p=witaParts();return{date:`${p.year}-${p.month}-${p.day}`,hour:+p.hour,minute:+p.minute}}
  function released(date){const now=witaNow();return date>=START_DATE&&(date<now.date||(date===now.date&&now.hour>=RELEASE_HOUR))}
  function releasedItems(){return items.filter(x=>x.date>=START_DATE&&released(x.date))}
  function latestReleased(){const a=releasedItems();return a.length?a[a.length-1]:null}
  function formatDate(date,long=true){const d=new Date(date+'T12:00:00+08:00');return new Intl.DateTimeFormat('id-ID',long?{timeZone:TZ,weekday:'long',day:'numeric',month:'long',year:'numeric'}:{timeZone:TZ,day:'numeric',month:'long',year:'numeric'}).format(d)}
  function esc(s){return String(s||'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
  async function fetchData(){const r=await fetch(appUrl(DATA_FILE)+'?v=27',{cache:'no-store'});if(!r.ok)throw Error('Renungan data tidak tersedia');return r.json()}

  function getReactionClient(){if(reactionClient)return reactionClient;try{if(window.supabase&&window.supabase.createClient)reactionClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY)}catch(_){}return reactionClient}
  function getDeviceId(){try{let id=localStorage.getItem('gria_devotional_device_v1');if(!id){id=sessionDeviceId;localStorage.setItem('gria_devotional_device_v1',id)}return id}catch(_){return sessionDeviceId}}
  function localReactionState(date){if(memoryReactions[date])return memoryReactions[date];try{return JSON.parse(localStorage.getItem('gria_devotional_reactions_v1')||'{}')[date]||{}}catch(_){return{}}}
  function saveLocalReaction(date,type,on){memoryReactions[date]={...localReactionState(date),[type]:!!on};try{const all=JSON.parse(localStorage.getItem('gria_devotional_reactions_v1')||'{}');all[date]=memoryReactions[date];localStorage.setItem('gria_devotional_reactions_v1',JSON.stringify(all))}catch(_){}}
  function setReactionUI(counts,own,local=false){document.querySelectorAll('.reaction-btn').forEach(btn=>{const type=btn.dataset.reaction;btn.classList.toggle('is-active',!!own[type]);btn.setAttribute('aria-pressed',String(!!own[type]));btn.disabled=pendingReactions.has(selected.date);const n=btn.querySelector('[data-count]');if(n)n.textContent=counts[type]||0});const status=$('#reactionStatus');if(status)status.textContent=local?'Reaksi di perangkat ini · total bersama belum tersedia':'Total reaksi jemaat'}
  async function reactionRequest(name,args){const client=getReactionClient();if(!client)throw Error('offline');const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),6000);try{const {data,error}=await client.rpc(name,args).abortSignal(controller.signal);if(error)throw error;return data}finally{clearTimeout(timer)}}
  function displayReactions(date,data){if(!selected||selected.date!==date)return;reactionView={date,...data};saveLocalReaction(date,'like',data.own.like);saveLocalReaction(date,'love',data.own.love);setReactionUI(data.counts,data.own)}
  let reactionLoad=0;
  async function loadReactions(date){
    const generation=++reactionLoad,own=localReactionState(date);
    reactionView={date,counts:{like:own.like?1:0,love:own.love?1:0},own,local:true};
    setReactionUI(reactionView.counts,own,true);
    if(pendingReactions.has(date))return;
    try{const data=await reactionRequest('get_devotional_reactions',{p_date:date,p_device_id:getDeviceId()});if(generation===reactionLoad&&!pendingReactions.has(date))displayReactions(date,data)}catch(_){/* Local feedback remains available. */}
  }
  async function toggleReaction(type){
    if(!selected||!released(selected.date)||pendingReactions.has(selected.date))return;
    const date=selected.date,state=localReactionState(date),active=!!state[type];
    pendingReactions.add(date);++reactionLoad;
    saveLocalReaction(date,type,!active);
    const own=localReactionState(date),counts={...(reactionView&&reactionView.date===date?reactionView.counts:{like:0,love:0})};
    counts[type]=Math.max(0,(counts[type]||0)+(active?-1:1));
    reactionView={date,counts,own,local:!reactionView||reactionView.local};
    setReactionUI(counts,own,reactionView.local);
    try{const data=await reactionRequest('set_devotional_reaction',{p_date:date,p_device_id:getDeviceId(),p_reaction:type,p_active:!active});displayReactions(date,data)}
    catch(_){if(selected&&selected.date===date){reactionView={date,counts:{like:own.like?1:0,love:own.love?1:0},own,local:true};setReactionUI(reactionView.counts,own,true);toast('Reaksi tersimpan di perangkat ini')}}
    finally{pendingReactions.delete(date);if(selected&&selected.date===date&&reactionView)setReactionUI(reactionView.counts,reactionView.own,reactionView.local)}
  }

  function isBookmarked(date){try{return(JSON.parse(localStorage.getItem('gria_devotional_bookmarks_v1')||'[]')).includes(date)}catch(_){return false}}
  function toggleBookmark(){if(!selected)return;try{let arr=JSON.parse(localStorage.getItem('gria_devotional_bookmarks_v1')||'[]');arr=arr.includes(selected.date)?arr.filter(x=>x!==selected.date):arr.concat(selected.date);localStorage.setItem('gria_devotional_bookmarks_v1',JSON.stringify(arr));renderBookmark();toast(arr.includes(selected.date)?'Renungan disimpan':'Dihapus dari simpanan')}catch(_){}}
  function renderBookmark(){document.querySelectorAll('.bookmark-btn').forEach(b=>(b.classList.toggle('is-active',selected&&isBookmarked(selected.date)),b.setAttribute('aria-pressed',String(!!selected&&isBookmarked(selected.date)))))}

  async function shareEntry(entry,quoteOnly=false){
    if(!entry||!released(entry.date))return;
    const u=new URL('renungan.html',location.href);u.searchParams.set('date',entry.date);
    const text=`${entry.title}\n${formatDate(entry.date,false)} · ${entry.reference}\n\n“${entry.quote}”\n\nRenungan Harian GRIA`;
    if(navigator.share){try{await navigator.share({title:`${entry.title} — Renungan GRIA`,text,url:u.href});return}catch(e){if(e.name==='AbortError')return}}
    const copy=text+'\n'+u.href;
    try{await navigator.clipboard.writeText(copy);toast('Link renungan disalin')}
    catch(_){$('#shareFallbackText').value=copy;$('#shareFallback').hidden=false;$('#shareFallbackText').focus();$('#shareFallbackText').select()}
  }

  function renderReminder(){let downloaded=false;try{downloaded=localStorage.getItem('gria_devotional_reminder_v1')==='downloaded'}catch(_){}$('#reminderLabel').textContent=downloaded?'Pengingat Renungan · file dibuka':'Aktifkan Pengingat Renungan';$('#reminderStripBtn').textContent=downloaded?'Buka lagi':'Atur'}
  let reminderTrigger=null;
  function openReminder(){reminderTrigger=document.activeElement;$('#reminderModal').hidden=false;$('#reminderClose').focus()}
  function closeReminder(){$('#reminderModal').hidden=true;if(reminderTrigger)reminderTrigger.focus()}
  function syncReminder(){try{localStorage.setItem('gria_devotional_reminder_v1','downloaded')}catch(_){}renderReminder();closeReminder();toast('Tambahkan di Kalender; status aktif tidak dapat diperiksa');const a=document.createElement('a');a.href=appUrl('renungan-reminder.ics');a.download='renungan-reminder.ics';document.body.appendChild(a);a.click();a.remove()}

  function options(select,values,label,preferred){select.replaceChildren();values.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=label(v);select.appendChild(o)});if(values.includes(preferred))select.value=preferred;select.disabled=!values.length}
  function populateFilter(keep=false){
    const rel=releasedItems(),year=$('#yearFilter'),month=$('#monthFilter'),day=$('#dayFilter'),date=selected?selected.date:'';
    options(year,[...new Set(rel.map(e=>e.date.slice(0,4)))],v=>v,keep?year.value:date.slice(0,4));
    options(month,[...new Set(rel.filter(e=>e.date.startsWith(year.value+'-')).map(e=>e.date.slice(5,7)))],v=>new Intl.DateTimeFormat('id-ID',{month:'long',timeZone:TZ}).format(new Date(`2026-${v}-01T12:00:00+08:00`)),keep?month.value:date.slice(5,7));
    options(day,rel.filter(e=>e.date.startsWith(year.value+'-'+month.value+'-')).map(e=>e.date.slice(8,10)),v=>String(+v),keep?day.value:date.slice(8,10));
    $('#applyFilter').disabled=!day.value;
  }
  function applyFilter(){const date=[$('#yearFilter').value,$('#monthFilter').value,$('#dayFilter').value].join('-');setSelected(date,true)}

  function featureHtml(e){return `
    <article class="dev-featured" data-date="${esc(e.date)}">
      <div class="featured-media"><img src="${esc(e.image)}" alt=""><span class="featured-badge">${esc(e.monthTheme)} · ${esc(e.weekTheme)}</span></div>
      <div class="featured-body">
        <div class="featured-date"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v18H7.5A3.5 3.5 0 0 0 4 23V5.5Z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v18h3.5A3.5 3.5 0 0 1 20 23V5.5Z"/></svg>${esc(formatDate(e.date,false))} · ${e.readingTime} menit</div>
        <h1>${esc(e.title)}</h1><p class="featured-author">${esc(e.author)}</p><span class="featured-ref">${esc(e.reference)}</span>
        <blockquote class="featured-quote">“${esc(e.quote)}”</blockquote>
        <div class="featured-actions"><button class="read-btn" id="readBtn" type="button">BACA RENUNGAN</button><button class="bookmark-btn" id="bookmarkBtn" type="button" aria-label="Simpan renungan"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M6 3h12v18l-6-4-6 4V3Z"/></svg></button></div>
        <div class="reaction-row"><button class="reaction-btn" data-reaction="like" type="button" aria-label="Suka"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M7 10v11H3V10h4Zm0 0 4-7c1.8 0 3 1.5 2.5 3.2L13 8h6a2 2 0 0 1 2 2.3l-1.2 8A3 3 0 0 1 16.8 21H7"/></svg><span>Like</span><b data-count>0</b></button><button class="reaction-btn" data-reaction="love" type="button" aria-label="Love"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg><span>Love</span><b data-count>0</b></button><button class="share-btn" id="shareBtn" type="button"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.6 6.8-4.2M8.6 13.4l6.8 4.2"/></svg>Bagikan</button></div>
        <small id="reactionStatus" role="status"></small>
      </div>
    </article>`}

  function renderFeature(){const wrap=$('#featuredWrap'),status=$('#todayStatus');if(!selected){wrap.innerHTML='';status.hidden=false;status.innerHTML='Renungan Harian GRIA dimulai <strong>4 Oktober 2026</strong> dan renungan baru terbuka setiap hari pukul <strong>06.00 WITA</strong>.';return}status.hidden=true;wrap.innerHTML=featureHtml(selected);$('#readBtn').onclick=openReader;$('#bookmarkBtn').onclick=toggleBookmark;$('#shareBtn').onclick=()=>shareEntry(selected);document.querySelectorAll('.reaction-btn').forEach(b=>b.onclick=()=>toggleReaction(b.dataset.reaction));renderBookmark();loadReactions(selected.date)}

  function openReader(){if(!selected)return;$('#readerTheme').textContent=`${selected.monthTheme} · ${selected.weekTheme}`;$('#readerTitle').textContent=selected.title;$('#readerMeta').textContent=`${formatDate(selected.date,true)} · ${selected.readingTime} menit membaca`;$('#readerReference').textContent=selected.reference;$('#readerKeyVerse').textContent=selected.keyVerse;$('#readerKeyVerseRef').textContent=selected.keyVerseReference+' · AYT';$('#readerBody').innerHTML=selected.body.map(p=>`<p>${esc(p)}</p>`).join('');$('#readerQuote').textContent='“'+selected.quote+'”';$('#readerReflection').textContent=selected.reflection;$('#readerAction').textContent=selected.action;$('#readerPrayer').textContent=selected.prayer;$('#shareQuoteBtn').onclick=()=>shareEntry(selected,true);const rel=releasedItems(),idx=rel.findIndex(x=>x.date===selected.date),prev=rel[idx-1],next=rel[idx+1];const pb=$('#prevDevotional'),nb=$('#nextDevotional');pb.disabled=!prev;nb.disabled=!next;pb.onclick=()=>prev&&setSelected(prev.date,true,true);nb.onclick=()=>next&&setSelected(next.date,true,true);$('#readerPanel').hidden=false;setTimeout(()=>$('#readerPanel').scrollIntoView({behavior:'smooth',block:'start'}),60)}
  function closeReader(){$('#readerPanel').hidden=true}

  function renderArchive(){const list=$('#archiveList'),rel=releasedItems().filter(x=>!selected||x.date<selected.date).slice().reverse();$('#archiveCount').textContent=`${rel.length} tersedia`;if(!rel.length){list.innerHTML='<div class="today-status">Belum ada renungan sebelumnya. Arsip akan bertambah setiap hari setelah pukul 06.00 WITA.</div>';return}list.innerHTML=rel.map(e=>`<article class="archive-card"><div class="archive-thumb"><img src="${esc(e.image)}" alt="" loading="lazy"></div><div class="archive-card-body"><div class="archive-card-date">${esc(formatDate(e.date,false))} · ${e.readingTime} menit</div><h3>${esc(e.title)}</h3><div class="archive-card-ref">${esc(e.reference)}</div><q>${esc(e.quote)}</q><div class="archive-actions"><button class="archive-read" data-open-date="${e.date}" type="button">Baca</button><button data-share-date="${e.date}" type="button">Bagikan</button></div></div></article>`).join('');list.querySelectorAll('[data-open-date]').forEach(b=>b.onclick=()=>setSelected(b.dataset.openDate,true,true));list.querySelectorAll('[data-share-date]').forEach(b=>b.onclick=()=>shareEntry(items.find(x=>x.date===b.dataset.shareDate)))}

  function setSelected(date,push=false,open=false){const target=items.find(x=>x.date===date);if(!target||!released(date)){selected=null;closeReader();renderFeature();renderArchive();populateFilter();$('#todayStatus').textContent=date<START_DATE?'Arsip dimulai 4 Oktober 2026.':'Renungan ini belum tersedia. Renungan baru terbuka pukul 06.00 WITA.';return}selected=target;if(push){const u=new URL(location.href);u.searchParams.set('date',date);history.replaceState({},'',u)}populateFilter();renderFeature();renderArchive();if(open)openReader();else closeReader();window.scrollTo({top:0,behavior:'smooth'})}

  function bind(){
    $('#filterToggle').onclick=()=>{const f=$('#archiveFilter'),collapsed=f.classList.toggle('collapsed');$('#filterToggle').setAttribute('aria-expanded',String(!collapsed))};
    $('#yearFilter').onchange=$('#monthFilter').onchange=()=>populateFilter(true);$('#shareFallbackClose').onclick=()=>{$('#shareFallback').hidden=true;$('#shareBtn')?.focus()};$('#applyFilter').onclick=applyFilter;$('#readerClose').onclick=closeReader;
    ['#reminderHeaderBtn','#reminderStripBtn'].forEach(s=>$(s).onclick=openReminder);$('#reminderClose').onclick=closeReminder;$('#reminderLater').onclick=closeReminder;$('#syncCalendarBtn').onclick=syncReminder;$('#reminderModal').onclick=e=>{if(e.target===$('#reminderModal'))closeReminder()};
  }

  async function init(){
    bind();renderReminder();
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeReminder();$('#shareFallback').hidden=true}if(e.key==='Tab'&&!$('#reminderModal').hidden){const controls=[...$('#reminderModal').querySelectorAll('button')],first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
    try{source=await fetchData();items=(source.items||[]).slice().sort((a,b)=>a.date.localeCompare(b.date));const q=new URL(location.href).searchParams.get('date');const first=q||(latestReleased()||{}).date;if(first)setSelected(first);else{populateFilter();renderFeature();renderArchive()}let stamp=JSON.stringify(witaNow());const refresh=()=>{const next=JSON.stringify(witaNow());if(next!==stamp){stamp=next;const requested=new URL(location.href).searchParams.get('date');const date=requested||(latestReleased()||{}).date;if(date&&(!selected||selected.date!==date))setSelected(date);else{populateFilter(true);renderArchive()}}};setInterval(refresh,30000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()})}catch(e){const s=$('#todayStatus');s.hidden=false;s.textContent='Renungan belum dapat dimuat. Periksa koneksi lalu coba lagi.';console.error(e)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
