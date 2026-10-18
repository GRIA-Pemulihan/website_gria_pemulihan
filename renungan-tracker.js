/* Durable anonymous Like/Read tracker. Only aggregate totals are broadcast. */
(function(root){
  'use strict';
  class DevotionalTracker {
    constructor(client,deviceId,onChange,storage){
      this.client=client;this.deviceId=deviceId;this.onChange=onChange;
      try{this.storage=storage||root.localStorage}catch(_){this.storage=null}
      this.snapshots=this.read('gria_devotional_snapshots_v2');
      this.queue=this.read('gria_devotional_outbox_v2');
      for(const [key,item] of Object.entries(this.queue)){
        if(!item||!/^\d{4}-\d{2}-\d{2}$/.test(item.date)||!['like','read'].includes(item.type)||typeof item.active!=='boolean')delete this.queue[key];
      }
      this.date=null;this.channel=null;this.live=false;this.flushing=false;this.inflight=null;this.serial=0;this.requests={};
      this.timer=setInterval(()=>this.resume(),15000);
    }
    read(key){try{const value=JSON.parse(this.storage.getItem(key)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}catch(_){return {}}}
    persist(){try{this.storage.setItem('gria_devotional_snapshots_v2',JSON.stringify(this.snapshots));this.storage.setItem('gria_devotional_outbox_v2',JSON.stringify(this.queue))}catch(_){}}
    emit(){
      if(!this.date)return;
      const snapshot=this.snapshots[this.date],counts={like:snapshot?.counts?.like??null,read:snapshot?.counts?.read??null},own={like:!!snapshot?.own?.like,read:!!snapshot?.own?.read};
      let queued=false;
      for(const type of ['like','read']){
        const item=this.queue[this.date+':'+type];if(!item)continue;
        queued=true;if(counts[type]!==null)counts[type]=Math.max(0,counts[type]+Number(item.active)-Number(own[type]));own[type]=item.active;
      }
      this.onChange({date:this.date,counts,own,queued,live:this.live,busy:this.inflight?.date===this.date,loaded:!!snapshot});
    }
    async rpc(name,args){
      if(!this.client)throw new Error('Connection unavailable');
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),6000);
      try{const {data,error}=await this.client.rpc(name,args).abortSignal(controller.signal);if(error)throw error;return data}finally{clearTimeout(timer)}
    }
    accept(date,data){
      if(!data?.counts||!data?.own)throw new Error('Invalid totals response');
      this.snapshots[date]={counts:{like:Number(data.counts.like)||0,read:Number(data.counts.read)||0},own:{like:!!data.own.like,read:!!data.own.read}};
      this.persist();this.emit();
    }
    async refresh(){
      const date=this.date;if(!date||this.inflight?.date===date)return;
      const request=++this.serial;this.requests[date]=request;
      try{
        const data=await this.rpc('get_devotional_reactions',{p_date:date,p_device_id:this.deviceId});
        if(this.requests[date]===request&&this.inflight?.date!==date)this.accept(date,data);
      }catch(_){this.emit()}
    }
    select(date){
      if(date!==this.date){this.unwatch();this.date=date;}
      if(!date)return;
      this.emit();this.watch();this.refresh();this.flush();
    }
    choose(type){
      const date=this.date;if(!date||!['like','read'].includes(type)||this.inflight?.date===date)return;
      const key=date+':'+type,current=this.queue[key]?.active??!!this.snapshots[date]?.own?.[type];
      if(type==='read'&&current)return;
      this.queue[key]={date,type,active:type==='read'?true:!current,version:++this.serial};
      this.persist();this.emit();this.flush();
    }
    async flush(){
      if(this.flushing)return;this.flushing=true;
      try{
        for(const key of Object.keys(this.queue)){
          const item=this.queue[key];if(!item)continue;
          this.inflight=item;this.requests[item.date]=++this.serial;this.emit();
          try{
            const data=await this.rpc('set_devotional_reaction',{p_date:item.date,p_device_id:this.deviceId,p_reaction:item.type,p_active:item.active});
            if(!data?.counts||!data?.own)throw new Error('Invalid totals response');
            if(this.queue[key]?.version===item.version)delete this.queue[key];
            this.accept(item.date,data);
          }catch(_){break}
          finally{this.inflight=null;this.persist();this.emit()}
        }
      }finally{this.flushing=false;this.refresh()}
    }
    watch(){
      if(!this.client||!this.date||this.channel)return;
      const date=this.date;this.lastWatch=Date.now();
      const channel=this.client.channel('devotional-totals-'+date);
      this.channel=channel;
      channel.on('postgres_changes',{event:'*',schema:'public',table:'devotional_stats',filter:'devotional_date=eq.'+date},()=>{
        if(this.channel===channel)this.refresh();
      }).subscribe(status=>{
        if(this.channel!==channel)return;
        this.live=status==='SUBSCRIBED';this.emit();
        if(this.live){this.refresh();this.flush()}
      });
    }
    unwatch(){
      const channel=this.channel;this.channel=null;this.live=false;
      if(channel)this.client.removeChannel(channel).catch(()=>{});
    }
    resume(){
      if(root.document?.hidden)return;
      if(!this.live&&this.channel&&Date.now()-this.lastWatch>30000)this.unwatch();
      this.watch();this.refresh();this.flush();
    }
    destroy(){clearInterval(this.timer);this.unwatch();}
  }
  root.GriaDevotionalTracker=DevotionalTracker;
  if(typeof module!=='undefined')module.exports=DevotionalTracker;
})(typeof window!=='undefined'?window:globalThis);
