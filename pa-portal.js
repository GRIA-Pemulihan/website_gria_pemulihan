/* Portal Pendalaman Alkitab GRIA. Content is supplied by appointed leaders. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const status=$('paStatus'), list=$('paSessions'), form=$('paForm');
  const zone='Asia/Makassar';
  let accessCode='', isLeader=false, sessions=[];

  function say(message, target=status){target.textContent=message;}
  function dateParts(value){
    const parts=new Intl.DateTimeFormat('en-GB',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(value));
    return Object.fromEntries(parts.map(p=>[p.type,p.value]));
  }
  function displayDate(value){return new Intl.DateTimeFormat('id-ID',{timeZone:zone,weekday:'long',day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(value))+' WITA';}
  function element(tag,className,content){const node=document.createElement(tag);if(className)node.className=className;if(content!==undefined)node.textContent=content;return node;}
  function addQuestion(prompt=''){
    if($('paQuestionRows').children.length>=20){say('Maksimal 20 pertanyaan panduan.',$('paFormStatus'));return;}
    const row=element('div','pa-question-row');
    const promptLabel=element('label','', 'Pertanyaan');
    const input=element('textarea');input.maxLength=1500;input.placeholder='Apa yang kita pelajari dari bacaan ini?';input.value=prompt;
    promptLabel.append(input);
    const remove=element('button','pa-remove','Hapus');remove.type='button';remove.setAttribute('aria-label','Hapus pertanyaan');remove.addEventListener('click',()=>row.remove());
    row.append(promptLabel,remove);$('paQuestionRows').append(row);
  }
  function resetForm(){form.reset();$('paId').value='';$('paQuestionRows').replaceChildren();addQuestion();$('paTime').value='19:00';say('',$('paFormStatus'));}
  function getQuestions(){
    return [...$('paQuestionRows').children].map(row=>({prompt:row.querySelector('textarea').value.trim()})).filter(q=>q.prompt);
  }
  function editSession(session){
    $('paId').value=session.id;$('paReference').value=session.reference;$('paLeader').value=session.leader_name;
    const p=dateParts(session.starts_at);$('paDate').value=`${p.year}-${p.month}-${p.day}`;$('paTime').value=`${p.hour}:${p.minute}`;
    $('paQuestionRows').replaceChildren();(session.questions||[]).forEach(q=>addQuestion(q.prompt));
    if(!$('paQuestionRows').children.length)addQuestion();
    say('Sedang menyunting pertemuan.',$('paFormStatus'));$('paEditor').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function render(){
    list.replaceChildren();
    if(!sessions.length){say('Belum ada pertemuan PA yang diterbitkan. Jadwal dan pertanyaan panduan akan tampil di sini setelah pemimpin PA menerbitkannya.');return;}
    say('');
    const now=Date.now();
    sessions.sort((a,b)=>{
      const aFuture=new Date(a.starts_at).getTime()>=now,bFuture=new Date(b.starts_at).getTime()>=now;
      if(aFuture!==bFuture)return aFuture?-1:1;
      return aFuture?new Date(a.starts_at)-new Date(b.starts_at):new Date(b.starts_at)-new Date(a.starts_at);
    });
    sessions.forEach(session=>{
      const card=element('article','pa-card');
      const top=element('div','pa-card-top');
      top.append(element('span','pa-badge',session.status==='draft'?'Draf pribadi':new Date(session.starts_at)>=now?'Pertemuan mendatang':'Arsip PA'));
      card.append(top,element('h3','',session.reference));
      const meta=element('div','pa-meta');meta.append(element('span','',displayDate(session.starts_at)),element('span','',`Pemimpin: ${session.leader_name}`));card.append(meta);
      if(Array.isArray(session.questions)&&session.questions.length){
        const heading=element('h4','','Pertanyaan panduan');heading.style.marginTop='20px';card.append(heading);
        const questions=element('ol','pa-question-list');session.questions.forEach(q=>{
          const li=element('li');li.append(document.createTextNode(q.prompt));questions.append(li);
        });card.append(questions);
      }
      const actions=element('div','pa-card-actions');const bible=element('a','pa-secondary','Buka Alkitab');bible.href='alkitab.html';actions.append(bible);
      if(isLeader){const edit=element('button','pa-secondary','Sunting panduan');edit.type='button';edit.addEventListener('click',()=>editSession(session));actions.append(edit);}
      card.append(actions);list.append(card);
    });
  }
  async function unlock(event){
    event.preventDefault();
    const code=$('paAccessCode').value.trim();
    const button=$('paCodeForm').querySelector('button');button.disabled=true;
    say('Memeriksa kode…',$('paAccessStatus'));
    try{
      const result=await supabaseClient.rpc('pa_check_access',{p_code:code});
      if(result.error)throw result.error;
      if(result.data!==true){say('Kode belum sesuai. Periksa kembali kode pemimpin PA.',$('paAccessStatus'));return;}
      accessCode=code;isLeader=true;$('paAccessCode').value='';
      $('paCodeForm').hidden=true;$('paLock').hidden=false;$('paEditor').hidden=false;
      say('Akses pemimpin aktif. Isi panduan lalu pilih Simpan & Tampilkan.',$('paAccessStatus'));
      render();$('paEditor').scrollIntoView({behavior:'smooth',block:'start'});
    }catch(_){say('Kode belum dapat diperiksa. Periksa koneksi internet lalu coba lagi.',$('paAccessStatus'));}
    finally{button.disabled=false;}
  }
  function lock(){
    accessCode='';isLeader=false;$('paEditor').hidden=true;$('paLock').hidden=true;
    $('paCodeForm').hidden=false;say('Anda sudah keluar.',$('paAccessStatus'));resetForm();render();
  }
  async function load(){
    try{
      if(typeof supabaseClient==='undefined')throw new Error('Koneksi belum tersedia');
      const response=await supabaseClient.from('pa_sessions').select('id,reference,leader_name,starts_at,questions,status').eq('status','published').order('starts_at',{ascending:true});
      if(response.error)throw response.error;
      sessions=response.data||[];render();return true;
    }catch(_){say('Jadwal belum dapat dimuat. Periksa koneksi internet dan coba muat ulang halaman.');return false;}
  }
  async function save(event){
    event.preventDefault();if(!isLeader||!accessCode)return;
    const date=$('paDate').value,time=$('paTime').value;
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{2}:\d{2}$/.test(time)){say('Isi tanggal dan waktu PA.',$('paFormStatus'));return;}
    const [year,month,day]=date.split('-').map(Number);
    if(new Date(Date.UTC(year,month-1,day)).getUTCDay()!==2){say('Pertemuan PA harus dijadwalkan pada hari Selasa WITA.',$('paFormStatus'));return;}
    const starts=new Date(`${date}T${time}:00+08:00`);
    if(Number.isNaN(starts.getTime())){say('Tanggal atau waktu tidak valid.',$('paFormStatus'));return;}
    const questions=getQuestions();
    if(!questions.length){say('Tambahkan minimal satu pertanyaan sebelum menerbitkan.',$('paFormStatus'));return;}
    const payload={reference:$('paReference').value.trim(),leader_name:$('paLeader').value.trim(),starts_at:starts.toISOString(),questions};
    if(!payload.reference||!payload.leader_name){say('Lengkapi bacaan Alkitab dan nama pemimpin.',$('paFormStatus'));return;}
    const buttons=[...form.querySelectorAll('button[type="submit"]')];buttons.forEach(button=>button.disabled=true);say('Menyimpan…',$('paFormStatus'));
    try{
      // Keep the ID after failures so retrying a save cannot create a duplicate session.
      if(!$('paId').value)$('paId').value=crypto.randomUUID();
      const result=await supabaseClient.rpc('pa_save_with_code',{
        p_code:accessCode,p_id:$('paId').value,p_title:payload.reference,p_reference:payload.reference,
        p_leader_name:payload.leader_name,p_starts_at:payload.starts_at,p_questions:payload.questions
      });
      if(result.error)throw result.error;
      $('paId').value=result.data;
      const refreshed=await load();
      say(refreshed?'Tersimpan. Pertanyaan sudah tampil di Portal PA.':'Tersimpan, tetapi daftar belum dapat dimuat ulang. Coba muat ulang halaman.',$('paFormStatus'));
      if(refreshed)$('jadwal').scrollIntoView({behavior:'smooth',block:'start'});
    }catch(error){console.error('Simpan PA:',error);say('Gagal menyimpan. Periksa koneksi, kode pemimpin PA, dan data yang diisi.',$('paFormStatus'));}
    finally{buttons.forEach(button=>button.disabled=false);}
  }
  $('paCodeForm').addEventListener('submit',unlock);$('paLock').addEventListener('click',lock);
  $('paAddQuestion').addEventListener('click',()=>addQuestion());$('paReset').addEventListener('click',resetForm);form.addEventListener('submit',save);
  resetForm();load();
})();
