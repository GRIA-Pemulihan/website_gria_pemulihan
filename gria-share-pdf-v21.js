/* GRIA v21 — branded Daily Verse sharing + Warta PDF download */
(function(){
  'use strict';
  if(window.__GRIA_V21_SHARE_PDF)return;
  window.__GRIA_V21_SHARE_PDF=true;

  var script=document.currentScript;
  var ROOT=script?new URL('./',script.src):new URL('./',location.href);
  function url(p){return new URL(p,ROOT).href}
  function qs(s,r){return (r||document).querySelector(s)}
  function qsa(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
  function toast(msg){if(window.GRIA_APP&&window.GRIA_APP.toast){window.GRIA_APP.toast(msg);return}var e=document.createElement('div');e.className='gria-share-progress';e.textContent=msg;document.body.appendChild(e);setTimeout(function(){e.remove()},2400)}
  function currentFile(){return location.pathname.split('/').pop()||'index.html'}

  function loadCanvasImage(src){return new Promise(function(resolve,reject){var im=new Image();im.crossOrigin='anonymous';im.onload=function(){resolve(im)};im.onerror=reject;im.src=src})}
  function cover(ctx,img,x,y,w,h){var s=Math.max(w/img.width,h/img.height),sw=w/s,sh=h/s,sx=(img.width-sw)/2,sy=(img.height-sh)/2;ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h)}
  function roundedRect(ctx,x,y,w,h,r){var rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath()}
  function wrapCanvas(ctx,text,maxWidth){var words=String(text||'').replace(/[“”]/g,'').split(/\s+/),lines=[],line='';for(var i=0;i<words.length;i++){var test=line?line+' '+words[i]:words[i];if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=words[i]}else line=test}if(line)lines.push(line);return lines}
  function dataUrlFromBg(){var bg=qs('#dailyHeroBg');if(!bg)return '';var s=bg.style.backgroundImage||getComputedStyle(bg).backgroundImage;var m=s.match(/url\(["']?(.*?)["']?\)/);return m?m[1]:''}

  async function createStoryBlob(){
    var verse=(qs('#dailyVerseText')&&qs('#dailyVerseText').textContent||'Ayat Hari Ini').trim();
    var ref=(qs('#dailyVerseRef')&&qs('#dailyVerseRef').textContent||'GRIA Pemulihan Palu').trim();
    var canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1920;var ctx=canvas.getContext('2d');
    ctx.fillStyle='#091014';ctx.fillRect(0,0,1080,1920);
    var src=dataUrlFromBg();
    try{if(src){var img=await loadCanvasImage(src);cover(ctx,img,0,0,1080,1920)}}catch(_){
      var g=ctx.createLinearGradient(0,0,1080,1920);g.addColorStop(0,'#15252a');g.addColorStop(.6,'#0a1113');g.addColorStop(1,'#050607');ctx.fillStyle=g;ctx.fillRect(0,0,1080,1920);
    }
    var shade=ctx.createLinearGradient(0,0,0,1920);shade.addColorStop(0,'rgba(0,0,0,.18)');shade.addColorStop(.43,'rgba(0,0,0,.42)');shade.addColorStop(1,'rgba(0,0,0,.90)');ctx.fillStyle=shade;ctx.fillRect(0,0,1080,1920);
    var glow=ctx.createRadialGradient(850,1450,50,850,1450,650);glow.addColorStop(0,'rgba(204,255,0,.18)');glow.addColorStop(1,'rgba(204,255,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,1080,1920);

    ctx.fillStyle='#fff';ctx.font='700 78px Arial';ctx.fillText('GRI',78,145);ctx.fillStyle='#ccff00';ctx.fillText('A',205,145);
    ctx.fillStyle='#ccff00';ctx.beginPath();ctx.arc(88,245,8,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.84)';ctx.font='600 30px Arial';ctx.letterSpacing='4px';ctx.fillText('AYAT HARI INI · AYT',116,255);

    ctx.fillStyle='#fff';ctx.font='500 58px Arial';var lines=wrapCanvas(ctx,verse,900);var y=610;var lh=78;lines.slice(0,10).forEach(function(line){ctx.fillText(line,78,y);y+=lh});
    ctx.fillStyle='rgba(255,255,255,.82)';ctx.font='600 34px Arial';ctx.fillText(ref,78,Math.min(1510,y+58));

    ctx.fillStyle='rgba(255,255,255,.74)';ctx.font='500 30px Arial';ctx.fillText('GRIA Pemulihan Palu',78,1730);
    ctx.fillStyle='#ccff00';roundedRect(ctx,78,1782,420,7,4);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.58)';ctx.font='500 24px Arial';ctx.fillText('gria-pemulihan.github.io',78,1845);
    return new Promise(function(resolve){canvas.toBlob(function(b){resolve(b)},'image/png',.94)});
  }

  async function shareDailyVerse(){
    var busy=document.createElement('div');busy.className='gria-share-progress';busy.textContent='Menyiapkan desain GRIA…';document.body.appendChild(busy);
    try{
      var blob=await createStoryBlob();if(!blob)throw new Error('image');
      var file=new File([blob],'Ayat-Hari-Ini-GRIA.png',{type:'image/png'});
      busy.remove();
      if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
        try{await navigator.share({title:'Ayat Hari Ini — GRIA',text:'Bagikan ayat hari ini dari GRIA.',files:[file]});return}catch(e){if(e&&e.name==='AbortError')return}
      }
      var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Ayat-Hari-Ini-GRIA.png';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},1000);
      toast('Gambar ayat GRIA disimpan. Bagikan ke Story/Status dari galeri.');
    }catch(e){busy.remove();toast('Gambar ayat belum dapat dibuat. Coba lagi.');console.error(e)}
  }

  function hookVerseShare(){
    if(currentFile()!=='index.html')return;var old=qs('#shareVerseBtn');if(!old)return;
    var fresh=old.cloneNode(true);old.parentNode.replaceChild(fresh,old);fresh.addEventListener('click',shareDailyVerse);
    fresh.setAttribute('aria-label','Bagikan Ayat Hari Ini sebagai gambar GRIA');
  }

  function latestWartaDate(){
    var table=qs('.warta-block table');if(!table)return 'Warta terbaru';var cells=qsa('tr:first-child th, tr:first-child td',table).slice(1).map(function(c){return c.textContent.trim()}).filter(Boolean);return cells[0]||'Warta terbaru';
  }
  function setupWartaCard(){
    if(currentFile()!=='warta.html'||qs('#griaWartaFeature'))return;
    var hero=qs('.warta-hero');if(!hero)return;
    var firstBlock=qs('.warta-block');if(firstBlock&&!firstBlock.id)firstBlock.id='jadwal-pelayanan';
    var feature=document.createElement('section');feature.id='griaWartaFeature';feature.className='gria-warta-feature';
    feature.innerHTML='<div class="gria-warta-cover"><div class="gria-warta-cover-head"><div class="gria-warta-cover-brand">GRI<span>A</span></div><div class="gria-warta-cover-title">WARTA<br>JEMAAT</div></div><div class="gria-warta-cover-media"></div><div class="gria-warta-cover-foot"><div><strong>Warta Jemaat</strong><small>'+latestWartaDate()+'</small></div><small>GRIA Pemulihan Palu</small></div></div><div class="gria-warta-feature-actions"><a class="read" href="#jadwal-pelayanan">Baca Warta →</a><button class="pdf" id="griaDownloadPdf" type="button"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M5 19h14"/></svg>Unduh PDF</button></div>';
    hero.insertAdjacentElement('afterend',feature);qs('#griaDownloadPdf').addEventListener('click',downloadWartaPdf);
  }

  function ascii(s){return String(s||'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[–—]/g,'-').replace(/•/g,'-').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\x20-\x7E]/g,'?')}
  function wrapText(s,max){var words=ascii(s).split(/\s+/),out=[],line='';words.forEach(function(w){var t=line?line+' '+w:w;if(t.length>max&&line){out.push(line);line=w}else line=t});if(line)out.push(line);return out}
  function collectWartaLines(){
    var lines=[];lines.push('WARTA JEMAAT');lines.push(latestWartaDate());lines.push('');
    qsa('.warta-block').forEach(function(section){var h=qs('h2',section);if(h){lines.push(ascii(h.textContent.replace(/^\s*\d+\s*/,'')));lines.push('')}
      var table=qs('table',section);if(table){qsa('tr',table).forEach(function(row){var cells=qsa('th,td',row).map(function(c){return c.textContent.trim()});if(cells.length){wrapText(cells.join(' | '),92).forEach(function(x){lines.push(x)})}})}
      var lead=qs('.block-lead',section);if(lead&&lead.textContent.trim())wrapText(lead.textContent.trim(),92).forEach(function(x){lines.push(x)});lines.push('');
    });return lines;
  }
  function pdfEsc(s){return ascii(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)')}
  function makePdf(lines){
    var per=47,pages=[];for(var i=0;i<lines.length;i+=per)pages.push(lines.slice(i,i+per));if(!pages.length)pages=[['Warta Jemaat GRIA']];
    var objs=[];function set(n,s){objs[n]=s}
    var kids=[];for(var p=0;p<pages.length;p++)kids.push((4+p*2)+' 0 R');
    set(1,'<< /Type /Catalog /Pages 2 0 R >>');set(2,'<< /Type /Pages /Kids ['+kids.join(' ')+'] /Count '+pages.length+' >>');set(3,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    pages.forEach(function(pg,idx){var pageObj=4+idx*2,contentObj=5+idx*2;set(pageObj,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents '+contentObj+' 0 R >>');var cmd=[];cmd.push('0.8 1 0 rg 0 820 595 22 re f');cmd.push('0 0 0 rg BT /F1 9 Tf 46 805 Td (GRIA PEMULIHAN PALU - WARTA JEMAAT) Tj ET');var y=776;pg.forEach(function(line,n){var size=(idx===0&&n===0)?22:(idx===0&&n===1)?11:10.5;cmd.push('0.08 0.08 0.09 rg BT /F1 '+size+' Tf 46 '+y+' Td ('+pdfEsc(line)+') Tj ET');if(idx===0&&n===0)y-=32;else if(idx===0&&n===1)y-=20;else y-=line===''?10:15});cmd.push('0.42 0.42 0.45 rg BT /F1 8 Tf 46 28 Td (gria-pemulihan.github.io/website_gria_pemulihan/) Tj ET');var stream=cmd.join('\n');set(contentObj,'<< /Length '+stream.length+' >>\nstream\n'+stream+'\nendstream')});
    var pdf='%PDF-1.4\n',offsets=[0];for(var n=1;n<objs.length;n++){if(!objs[n])continue;offsets[n]=pdf.length;pdf+=n+' 0 obj\n'+objs[n]+'\nendobj\n'}var xref=pdf.length;pdf+='xref\n0 '+objs.length+'\n0000000000 65535 f \n';for(var j=1;j<objs.length;j++){var off=offsets[j]||0;pdf+=(String(off).padStart(10,'0'))+' 00000 n \n'}pdf+='trailer\n<< /Size '+objs.length+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF';return new Blob([pdf],{type:'application/pdf'})
  }
  function downloadWartaPdf(){
    try{var lines=collectWartaLines();var blob=makePdf(lines);var a=document.createElement('a');var d=new Date(),stamp=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');a.href=URL.createObjectURL(blob);a.download='Warta-GRIA-'+stamp+'.pdf';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},1200);toast('PDF Warta sedang diunduh.')}catch(e){toast('PDF belum dapat dibuat.');console.error(e)}
  }

  function init(){hookVerseShare();setupWartaCard()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
