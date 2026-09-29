/* GRIA — Warta Mobile Clean v14 */
(function(){
  'use strict';
  if(window.__griaWartaV14)return;
  window.__griaWartaV14=true;

  if(!document.getElementById('griaManropeFont')){
    const f=document.createElement('link');
    f.id='griaManropeFont';f.rel='stylesheet';
    f.href='https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(f);
  }

  const style=document.createElement('style');
  style.textContent=`
    html{scroll-behavior:smooth}
    #ulang-tahun{display:none!important}
    .warta-mobile-jump,.warta-mobile-cards,.warta-summary{display:none}

    @media(max-width:768px){
      .warta-wrap{
        max-width:680px;
        padding:calc(78px + env(safe-area-inset-top,0px)) 16px calc(118px + env(safe-area-inset-bottom,0px));
      }
      .back-link{display:none!important}
      .warta-wrap,.warta-wrap *{font-family:'Manrope',Inter,sans-serif}

      .warta-hero{
        margin:0 0 13px;
        padding:7px 2px 15px;
        background:none!important;
        border:0!important;
      }
      .warta-hero .eyebrow{margin-bottom:9px;font-size:9px}
      .warta-hero h1{
        margin:0;
        color:var(--text)!important;
        font-family:'Manrope',Inter,sans-serif!important;
        font-size:31px!important;
        font-weight:800;
        letter-spacing:-.045em;
      }
      .warta-hero p{
        max-width:38ch;
        margin-top:7px;
        color:var(--text-mute)!important;
        font-size:11px;
        line-height:1.6;
      }
      .warta-freshness{
        display:inline-flex;
        align-items:center;
        margin-top:10px;
        color:var(--grey)!important;
        font-size:9px;
        font-weight:700;
      }
      .warta-freshness:before{
        content:'';
        width:6px;height:6px;margin-right:6px;border-radius:50%;
        background:var(--neon);
      }

      .warta-mobile-jump{
        position:sticky;
        top:calc(62px + env(safe-area-inset-top,0px));
        z-index:50;
        display:flex;
        gap:6px;
        margin:0 -16px 25px;
        padding:8px 16px;
        overflow-x:auto;
        scrollbar-width:none;
        background:color-mix(in srgb,var(--bg-base) 91%,transparent);
        border-top:1px solid var(--card-border);
        border-bottom:1px solid var(--card-border);
        backdrop-filter:blur(18px);
        -webkit-backdrop-filter:blur(18px);
      }
      .warta-mobile-jump::-webkit-scrollbar,.warta-mobile-cards::-webkit-scrollbar{display:none}
      .warta-mobile-jump a{
        flex:0 0 auto;
        min-height:33px;
        display:flex;align-items:center;
        padding:7px 10px;
        border-radius:999px;
        color:var(--text-mute);
        background:var(--bg-elevated);
        border:1px solid var(--card-border);
        font-size:9.5px;font-weight:750;
      }

      .warta-block{
        margin-bottom:30px;
        scroll-margin-top:118px;
      }
      .warta-block>div:first-child,
      .warta-block .block-title-row{
        margin-bottom:10px!important;
      }
      .warta-block h2{
        color:var(--text)!important;
        font-family:'Manrope',Inter,sans-serif!important;
        font-size:18px!important;
        font-weight:800;
        letter-spacing:-.03em;
      }
      .warta-block .badge-num{display:none!important}
      .warta-block .block-lead{
        margin:5px 0 11px!important;
        color:var(--text-mute)!important;
        font-size:10.5px!important;
        line-height:1.55;
      }
      .warta-block .warta-scroll{display:none!important}

      .swipe-note{
        display:flex;
        justify-content:flex-end;
        margin:-2px 1px 7px;
        color:var(--grey-dim);
        font-size:8.5px;
        font-weight:700;
      }
      .swipe-note b{color:var(--neon);margin-left:4px}

      .warta-mobile-cards{
        display:flex;
        gap:9px;
        margin:0 -16px;
        padding:1px 16px 10px;
        overflow-x:auto;
        scroll-snap-type:x mandatory;
        scroll-padding-left:16px;
        scrollbar-width:none;
        -webkit-overflow-scrolling:touch;
      }

      .warta-mobile-card{
        flex:0 0 min(84vw,326px);
        scroll-snap-align:start;
        overflow:hidden;
        border-radius:18px;
        background:var(--bg-elevated);
        border:1px solid var(--card-border);
        box-shadow:0 10px 26px rgba(0,0,0,.07);
        transition:transform .24s ease,border-color .24s ease;
      }
      .warta-mobile-card.is-centered{
        border-color:color-mix(in srgb,var(--neon) 18%,var(--card-border));
      }

      .warta-mobile-card-head{
        padding:14px 14px 11px;
        border-bottom:1px solid var(--card-border);
        background:none;
      }
      .warta-mobile-card-title{
        color:var(--text);
        font-size:13.5px;
        font-weight:800;
        line-height:1.35;
      }
      .warta-mobile-card-tag{
        display:inline-flex;
        margin-top:6px;
        padding:4px 7px;
        border-radius:999px;
        color:var(--neon-dim);
        background:var(--neon-soft);
        font-size:7.5px;
        font-weight:800;
        text-transform:uppercase;
        letter-spacing:.07em;
      }

      .warta-mobile-card-body{padding:3px 14px 5px}
      .warta-mobile-row{
        display:grid;
        grid-template-columns:minmax(92px,.9fr) 1.1fr;
        gap:12px;
        padding:9px 0;
        border-bottom:1px solid var(--card-border);
      }
      .warta-mobile-row:last-child{border-bottom:0}
      .warta-mobile-label{
        color:var(--grey);
        font-size:9.5px;
        line-height:1.45;
      }
      .warta-mobile-value{
        color:var(--text);
        font-size:10.8px;
        font-weight:700;
        line-height:1.45;
        text-align:right;
        overflow-wrap:anywhere;
      }
      .warta-mobile-value.empty{color:var(--grey-dim);font-weight:500}

      .warta-card-total{
        display:flex;
        align-items:end;
        justify-content:space-between;
        gap:10px;
        margin:0 14px 13px;
        padding-top:11px;
        border-top:1px solid color-mix(in srgb,var(--neon) 13%,var(--card-border));
      }
      .warta-card-total span{
        color:var(--grey);
        font-size:8px;
        text-transform:uppercase;
        letter-spacing:.07em;
        font-weight:800;
      }
      .warta-card-total strong{
        color:var(--neon-dim);
        font-size:15px;
        font-weight:800;
      }

      .warta-summary{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        margin-top:2px;
        padding:13px 14px;
        border-radius:15px;
        background:var(--neon-soft);
        border:1px solid color-mix(in srgb,var(--neon) 15%,var(--card-border));
      }
      .warta-summary span{
        max-width:20ch;
        color:var(--text-mute);
        font-size:9px;
        font-weight:650;
        line-height:1.45;
      }
      .warta-summary strong{
        color:var(--neon-dim);
        font-size:15px;
        font-weight:800;
        white-space:nowrap;
      }

      .agape-card{
        border-radius:18px!important;
        background:var(--bg-elevated)!important;
        border-color:var(--card-border)!important;
        box-shadow:none!important;
      }
      .agape-card *{color:var(--text)}
      .agape-card p{color:var(--text-mute)!important}

      footer{padding-bottom:calc(100px + env(safe-area-inset-bottom,0px))}
    }
  `;
  document.head.appendChild(style);

  const main=document.querySelector('.warta-wrap');
  if(!main)return;

  const hero=main.querySelector('.warta-hero');
  if(hero&&!hero.querySelector('.warta-freshness')){
    const d=document.createElement('div');
    d.className='warta-freshness';
    d.textContent='Diperbarui mingguan';
    hero.appendChild(d);
  }

  const blocks=Array.from(main.querySelectorAll('.warta-block'));
  const ids=['jadwal-pelayanan','laporan-persembahan','informasi-umum','ulang-tahun','kasih-agape'];
  blocks.forEach((b,i)=>{if(!b.id&&ids[i])b.id=ids[i]});

  if(!main.querySelector('.warta-mobile-jump')){
    const nav=document.createElement('nav');
    nav.className='warta-mobile-jump';
    nav.innerHTML=
      '<a href="#jadwal-pelayanan">Pelayanan</a>'+
      '<a href="#laporan-persembahan">Persembahan</a>'+
      '<a href="#informasi-umum">Informasi</a>'+
      '<a href="#kasih-agape">Kasih Agape</a>';
    hero?hero.insertAdjacentElement('afterend',nav):main.prepend(nav);
  }

  main.querySelectorAll('.warta-table').forEach(function(table,tableIndex){
    const holder=table.closest('.warta-scroll');
    if(!holder||holder.nextElementSibling?.classList.contains('warta-mobile-cards'))return;

    const rows=Array.from(table.rows);
    if(!rows.length)return;

    const headers=Array.from(rows[0].cells).map(c=>c.textContent.trim());
    const data=rows.slice(1).map(r=>Array.from(r.cells).map(c=>c.textContent.trim()));
    if(headers.length<2)return;

    const cards=document.createElement('div');
    cards.className='warta-mobile-cards';

    let periodTotal=0;

    for(let col=1;col<headers.length;col++){
      let cardTotal=0;

      const body=data.map(cells=>{
        const label=cells[0]||'—';
        const raw=cells[col]||'';
        const value=raw||'—';

        if(tableIndex===1)cardTotal+=moneyToNumber(raw);

        return `<div class="warta-mobile-row">
          <div class="warta-mobile-label">${esc(label)}</div>
          <div class="warta-mobile-value ${!raw||raw==='-'?'empty':''}">${esc(value)}</div>
        </div>`;
      }).join('');

      if(tableIndex===1)periodTotal+=cardTotal;

      const card=document.createElement('article');
      card.className='warta-mobile-card';

      const type=
        tableIndex===0?'Pelayanan':
        tableIndex===1?'Persembahan':
        'PA & Doa';

      card.innerHTML=`
        <div class="warta-mobile-card-head">
          <div class="warta-mobile-card-title">${esc(headers[col]||'Informasi')}</div>
          <span class="warta-mobile-card-tag">${type}</span>
        </div>
        <div class="warta-mobile-card-body">${body}</div>
        ${tableIndex===1?`
          <div class="warta-card-total">
            <span>Total Minggu</span>
            <strong>${formatRupiah(cardTotal)}</strong>
          </div>`:''}`;

      cards.appendChild(card);
    }

    const note=document.createElement('div');
    note.className='swipe-note';
    note.innerHTML='Geser <b>→</b>';

    holder.insertAdjacentElement('afterend',cards);
    cards.insertAdjacentElement('beforebegin',note);

    const observer=new IntersectionObserver(entries=>{
      entries.forEach(e=>e.target.classList.toggle('is-centered',e.intersectionRatio>.7));
    },{root:cards,threshold:[.4,.7,.9]});

    cards.querySelectorAll('.warta-mobile-card').forEach(c=>observer.observe(c));

    if(tableIndex===1){
      const summary=document.createElement('div');
      summary.className='warta-summary';
      summary.innerHTML=`
        <span>Total persembahan periode yang ditampilkan</span>
        <strong>${formatRupiah(periodTotal)}</strong>`;
      cards.insertAdjacentElement('afterend',summary);
    }
  });

  function moneyToNumber(v){
    if(!v||v==='-')return 0;
    const digits=String(v).replace(/[^\d]/g,'');
    return digits?parseInt(digits,10):0;
  }
  function formatRupiah(n){
    return 'Rp '+Number(n||0).toLocaleString('id-ID');
  }
  function esc(v){
    return String(v??'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }
})();
