/* GRIA v22 — branded TB Daily Verse sharing + structured Warta PDF */
(function(){
  'use strict';
  if(window.__GRIA_V22_SHARE_PDF)return;
  window.__GRIA_V22_SHARE_PDF=true;

  var script=document.currentScript;
  var ROOT=script?new URL('./',script.src):new URL('./',location.href);
  function url(p){return new URL(p,ROOT).href}
  function qs(s,r){return (r||document).querySelector(s)}
  function qsa(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
  function currentFile(){return location.pathname.split('/').pop()||'index.html'}
  function toast(msg){if(window.GRIA_APP&&window.GRIA_APP.toast){window.GRIA_APP.toast(msg);return}var e=document.createElement('div');e.className='gria-share-progress';e.textContent=msg;document.body.appendChild(e);setTimeout(function(){e.remove()},2400)}
  function esc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

  /* ---------- Daily verse story ---------- */
  function loadCanvasImage(src){return new Promise(function(resolve,reject){var im=new Image();im.crossOrigin='anonymous';im.onload=function(){resolve(im)};im.onerror=reject;im.src=src})}
  function cover(ctx,img,x,y,w,h){var s=Math.max(w/img.width,h/img.height),sw=w/s,sh=h/s,sx=(img.width-sw)/2,sy=(img.height-sh)/2;ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h)}
  function roundedRect(ctx,x,y,w,h,r){var rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath()}
  function wrapCanvas(ctx,text,maxWidth){var words=String(text||'').replace(/[“”]/g,'').split(/\s+/),lines=[],line='';for(var i=0;i<words.length;i++){var test=line?line+' '+words[i]:words[i];if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=words[i]}else line=test}if(line)lines.push(line);return lines}
  function dataUrlFromBg(){var bg=qs('#dailyHeroBg');if(!bg)return '';var s=bg.style.backgroundImage||getComputedStyle(bg).backgroundImage;var m=s.match(/url\(["']?(.*?)["']?\)/);return m?m[1]:''}

  async function createStoryBlob(){
    if(document.fonts&&document.fonts.ready){try{await document.fonts.ready}catch(_){}}
    var daily=window.GRIA_DAILY_VERSE||{};
    var verse=(daily.text||(qs('#dailyVerseText')&&qs('#dailyVerseText').textContent)||'Ayat Hari Ini').replace(/[“”]/g,'').trim();
    var ref=(daily.ref||(qs('#dailyVerseRef')&&qs('#dailyVerseRef').textContent)||'GRIA Pemulihan Palu').trim();
    var translation=daily.translation||'TB';
    var canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1920;var ctx=canvas.getContext('2d');
    ctx.fillStyle='#091014';ctx.fillRect(0,0,1080,1920);
    var src=dataUrlFromBg();
    try{if(src){var img=await loadCanvasImage(src);cover(ctx,img,0,0,1080,1920)}}catch(_){var g=ctx.createLinearGradient(0,0,1080,1920);g.addColorStop(0,'#15252a');g.addColorStop(.6,'#0a1113');g.addColorStop(1,'#050607');ctx.fillStyle=g;ctx.fillRect(0,0,1080,1920)}
    var shade=ctx.createLinearGradient(0,0,0,1920);shade.addColorStop(0,'rgba(0,0,0,.18)');shade.addColorStop(.44,'rgba(0,0,0,.38)');shade.addColorStop(1,'rgba(0,0,0,.91)');ctx.fillStyle=shade;ctx.fillRect(0,0,1080,1920);
    var glow=ctx.createRadialGradient(850,1450,50,850,1450,650);glow.addColorStop(0,'rgba(204,255,0,.16)');glow.addColorStop(1,'rgba(204,255,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,1080,1920);

    ctx.fillStyle='#fff';ctx.font='700 78px Manrope,Arial,sans-serif';ctx.fillText('GRI',78,145);ctx.fillStyle='#ccff00';ctx.fillText('A',205,145);
    ctx.fillStyle='#ccff00';ctx.beginPath();ctx.arc(88,245,8,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.84)';ctx.font='600 30px Manrope,Arial,sans-serif';ctx.fillText('AYAT HARI INI · '+translation,116,255);

    ctx.fillStyle='#fff';ctx.font='500 57px Manrope,Arial,sans-serif';var lines=wrapCanvas(ctx,verse,900);var y=610,lh=78;lines.slice(0,10).forEach(function(line){ctx.fillText(line,78,y);y+=lh});
    ctx.fillStyle='rgba(255,255,255,.82)';ctx.font='600 34px Manrope,Arial,sans-serif';ctx.fillText(ref,78,Math.min(1510,y+58));
    ctx.fillStyle='rgba(255,255,255,.74)';ctx.font='500 30px Manrope,Arial,sans-serif';ctx.fillText('GRIA Pemulihan Palu',78,1730);
    ctx.fillStyle='#ccff00';roundedRect(ctx,78,1782,420,7,4);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.58)';ctx.font='500 24px Manrope,Arial,sans-serif';ctx.fillText('gria-pemulihan.github.io',78,1845);
    return new Promise(function(resolve){canvas.toBlob(function(b){resolve(b)},'image/png',.94)});
  }

  async function shareDailyVerse(){
    var busy=document.createElement('div');busy.className='gria-share-progress';busy.textContent='Menyiapkan desain GRIA…';document.body.appendChild(busy);
    try{
      var blob=await createStoryBlob();if(!blob)throw new Error('image');var f=new File([blob],'Ayat-Hari-Ini-GRIA-TB.png',{type:'image/png'});busy.remove();
      if(navigator.share&&navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({title:'Ayat Hari Ini — GRIA',text:'Ayat Hari Ini · TB — GRIA Pemulihan Palu',files:[f]});return}catch(e){if(e&&e.name==='AbortError')return}}
      var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Ayat-Hari-Ini-GRIA-TB.png';document.body.appendChild(a);a.click();var href=a.href;a.remove();setTimeout(function(){URL.revokeObjectURL(href)},1200);toast('Gambar ayat GRIA disimpan. Bagikan ke Story/Status dari galeri.');
    }catch(e){busy.remove();toast('Gambar ayat belum dapat dibuat. Coba lagi.');console.error(e)}
  }
  function hookVerseShare(){if(currentFile()!=='index.html')return;var old=qs('#shareVerseBtn');if(!old)return;var fresh=old.cloneNode(true);old.parentNode.replaceChild(fresh,old);fresh.addEventListener('click',shareDailyVerse);fresh.setAttribute('aria-label','Bagikan Ayat Hari Ini TB sebagai gambar GRIA')}

  /* ---------- Warta card ---------- */
  function latestWartaDate(){var table=qs('.warta-block table');if(!table)return 'Warta terbaru';var cells=qsa('tr:first-child th, tr:first-child td',table).slice(1).map(function(c){return c.textContent.trim()}).filter(Boolean);return cells[0]||'Warta terbaru'}
  function setupWartaCard(){
    if(currentFile()!=='warta.html'||qs('#griaWartaFeature'))return;var hero=qs('.warta-hero');if(!hero)return;var firstBlock=qs('.warta-block');if(firstBlock&&!firstBlock.id)firstBlock.id='jadwal-pelayanan';
    var feature=document.createElement('section');feature.id='griaWartaFeature';feature.className='gria-warta-feature';
    feature.innerHTML='<div class="gria-warta-cover"><div class="gria-warta-cover-head"><div class="gria-warta-cover-brand">GRI<span>A</span></div><div class="gria-warta-cover-title">WARTA<br>JEMAAT</div></div><div class="gria-warta-cover-media"></div><div class="gria-warta-cover-foot"><div><strong>Warta Jemaat</strong><small>'+esc(latestWartaDate())+'</small></div><small>GRIA Pemulihan Palu</small></div></div><div class="gria-warta-feature-actions"><a class="read" href="#jadwal-pelayanan">Baca Warta →</a><button class="pdf" id="griaDownloadPdf" type="button"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M5 19h14"/></svg>Unduh PDF</button></div>';
    hero.insertAdjacentElement('afterend',feature);qs('#griaDownloadPdf').addEventListener('click',downloadWartaPdf);
  }

  /* ---------- Structured PDF engine ---------- */
  function ascii(s){return String(s||'').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[–—]/g,'-').replace(/•/g,'-').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\x20-\x7E]/g,'?')}
  function pdfEsc(s){return ascii(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)')}
  function tidy(s){return String(s||'').replace(/\s+/g,' ').trim()}
  function wrapApprox(text,width,fontSize){
    var max=Math.max(6,Math.floor(width/(fontSize*.52))),words=ascii(tidy(text)).split(/\s+/),out=[],line='';
    words.forEach(function(w){if(!w)return;var test=line?line+' '+w:w;if(test.length>max&&line){out.push(line);line=w}else line=test});if(line)out.push(line);return out.length?out:[''];
  }
  function collectWartaModel(){
    var model={date:latestWartaDate(),sections:[]};
    qsa('.warta-block').forEach(function(section){
      var h=qs('h2',section),title=tidy(h?h.textContent.replace(/^\s*\d+\s*/,''):'Informasi'),lead=qs('.block-lead',section),table=qs('table',section),item={title:title,lead:lead?tidy(lead.textContent):'',rows:null,paragraphs:[]};
      if(table){item.rows=qsa('tr',table).map(function(row){return qsa('th,td',row).map(function(c){return tidy(c.textContent)})}).filter(function(r){return r.length})}
      else{
        var copy=tidy(section.textContent||'');if(h)copy=tidy(copy.replace(tidy(h.textContent),''));if(item.lead)copy=tidy(copy.replace(item.lead,''));if(copy)item.paragraphs=[copy];
      }
      model.sections.push(item);
    });
    var agape=qs('.agape-card');if(agape){model.sections.push({title:'Persembahan Kasih Agape',lead:'',rows:null,paragraphs:[tidy(agape.textContent)]})}
    return model;
  }

  function makeStructuredPdf(model){
    var W=595,H=842,M=46,usable=W-M*2,topStart=64,bottom=58,pages=[],page=null,y=topStart;
    function newPage(){page=[];pages.push(page);y=topStart;page.push('0.80 1 0 rg 0 820 595 22 re f');page.push('0.08 0.08 0.09 rg BT /F2 9 Tf 46 805 Td (GRIA PEMULIHAN PALU - WARTA JEMAAT) Tj ET')}
    function py(top,height){return H-top-height}
    function fillRect(x,top,w,h,r,g,b){page.push(r+' '+g+' '+b+' rg '+x+' '+py(top,h)+' '+w+' '+h+' re f')}
    function strokeRect(x,top,w,h,r,g,b,width){page.push((width||.5)+' w '+r+' '+g+' '+b+' RG '+x+' '+py(top,h)+' '+w+' '+h+' re S')}
    function textAt(text,x,top,size,bold,r,g,b){page.push((r==null?.10:r)+' '+(g==null?.10:g)+' '+(b==null?.12:b)+' rg BT /'+(bold?'F2':'F1')+' '+size+' Tf '+x+' '+(H-top-size)+' Td ('+pdfEsc(text)+') Tj ET')}
    function textLines(lines,x,top,size,lineH,bold,color){for(var i=0;i<lines.length;i++)textAt(lines[i],x,top+i*lineH,size,bold,color&&color[0],color&&color[1],color&&color[2])}
    function ensure(h){if(y+h>H-bottom)newPage()}
    function sectionTitle(title,continued){ensure(34);textAt(title+(continued?' (lanjutan)':''),M,y,14,true,.08,.08,.10);y+=24}
    function paragraph(text){var lines=wrapApprox(text,usable,9.2);for(var i=0;i<lines.length;i+=8){var chunk=lines.slice(i,i+8);ensure(chunk.length*13+8);textLines(chunk,M,y,9.2,13,false,[.20,.20,.23]);y+=chunk.length*13+7}}
    function tableRows(rows,title){
      if(!rows||!rows.length)return;var cols=Math.max.apply(null,rows.map(function(r){return r.length}));if(!cols)return;
      var first=cols<=3?145:cols===4?125:108,other=(usable-first)/(cols-1||1),widths=[];for(var c=0;c<cols;c++)widths.push(c===0?first:other);
      function rowInfo(row,isHead){var size=isHead?7.5:7.9,lineH=isHead?9.3:10.2,max=1,wrapped=[];for(var c=0;c<cols;c++){var lines=wrapApprox(row[c]||'',widths[c]-10,size);wrapped.push(lines);max=Math.max(max,lines.length)}return {wrapped:wrapped,h:Math.max(isHead?29:27,max*lineH+10),size:size,lineH:lineH}}
      function drawRow(row,isHead,rowIndex){var info=rowInfo(row,isHead);if(y+info.h>H-bottom){newPage();sectionTitle(title,true);drawRow(rows[0],true,0);if(!isHead)drawRow(row,false,rowIndex);return}
        var x=M;if(isHead)fillRect(M,y,usable,info.h,.91,.97,.72);else if(rowIndex%2===0)fillRect(M,y,usable,info.h,.985,.985,.98);
        for(var c=0;c<cols;c++){if(!isHead&&c===0)fillRect(x,y,widths[c],info.h,.965,.972,.94);strokeRect(x,y,widths[c],info.h,.79,.80,.78,.45);textLines(info.wrapped[c],x+5,y+6,info.size,info.lineH,isHead||c===0,isHead?[.10,.12,.08]:[.17,.17,.19]);x+=widths[c]}
        y+=info.h;
      }
      drawRow(rows[0],true,0);for(var r=1;r<rows.length;r++)drawRow(rows[r],false,r);y+=16;
    }

    newPage();
    textAt('WARTA JEMAAT',M,y,25,true,.06,.06,.08);y+=34;textAt(model.date||'Warta terbaru',M,y,11,false,.27,.27,.30);y+=28;
    model.sections.forEach(function(s){sectionTitle(s.title,false);if(s.lead){paragraph(s.lead);y+=3}if(s.rows)tableRows(s.rows,s.title);else (s.paragraphs||[]).forEach(function(p){paragraph(p)});y+=10});

    pages.forEach(function(cmds,idx){var p=idx+1;cmds.push('0.42 0.42 0.46 rg BT /F1 8 Tf 46 28 Td (gria-pemulihan.github.io/website_gria_pemulihan/) Tj ET');cmds.push('0.42 0.42 0.46 rg BT /F1 8 Tf 510 28 Td (Hal. '+p+') Tj ET')});

    var objs=[];function set(n,s){objs[n]=s}var kids=[];for(var i=0;i<pages.length;i++)kids.push((5+i*2)+' 0 R');
    set(1,'<< /Type /Catalog /Pages 2 0 R >>');set(2,'<< /Type /Pages /Kids ['+kids.join(' ')+'] /Count '+pages.length+' >>');set(3,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');set(4,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
    pages.forEach(function(cmds,idx){var po=5+idx*2,co=6+idx*2,stream=cmds.join('\n');set(po,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents '+co+' 0 R >>');set(co,'<< /Length '+stream.length+' >>\nstream\n'+stream+'\nendstream')});
    var pdf='%PDF-1.4\n',offsets=[0],max=objs.length;for(var n=1;n<max;n++){if(!objs[n])continue;offsets[n]=pdf.length;pdf+=n+' 0 obj\n'+objs[n]+'\nendobj\n'}var xref=pdf.length;pdf+='xref\n0 '+max+'\n0000000000 65535 f \n';for(var j=1;j<max;j++)pdf+=(String(offsets[j]||0).padStart(10,'0'))+' 00000 n \n';pdf+='trailer\n<< /Size '+max+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF';return new Blob([pdf],{type:'application/pdf'});
  }

  function downloadWartaPdf(){
    try{var model=collectWartaModel(),blob=makeStructuredPdf(model),a=document.createElement('a'),d=new Date(),stamp=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');a.href=URL.createObjectURL(blob);a.download='Warta-GRIA-'+stamp+'.pdf';document.body.appendChild(a);a.click();var href=a.href;a.remove();setTimeout(function(){URL.revokeObjectURL(href)},1500);toast('PDF Warta rapi sedang diunduh.')}catch(e){toast('PDF belum dapat dibuat.');console.error(e)}
  }

  function init(){hookVerseShare();setupWartaCard()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();

  /* Exposed only for local smoke tests. */
  window.GRIA_V22_PDF={makeStructuredPdf:makeStructuredPdf};
})();
