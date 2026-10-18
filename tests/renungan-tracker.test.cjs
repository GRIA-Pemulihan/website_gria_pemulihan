const test=require('node:test');
const assert=require('node:assert/strict');
const Tracker=require('../renungan-tracker.js');
const date='2026-10-04';
const storage=()=>({values:{},getItem(k){return this.values[k]||null},setItem(k,v){this.values[k]=v}});
const wait=async predicate=>{for(let i=0;i<100;i++){if(predicate())return;await new Promise(r=>setTimeout(r,5))}throw Error('Condition timed out')};
function backend(){
  const records=new Set();const state={offline:false,loseResponse:false,records};
  state.client={rpc(name,args){return{abortSignal(){return Promise.resolve().then(()=>{
    if(state.offline)throw Error('offline');
    const key=args.p_device_id+':'+args.p_reaction;
    if(name==='set_devotional_reaction'){
      if(args.p_active)records.add(key);else records.delete(key);
      if(state.loseResponse){state.loseResponse=false;throw Error('connection lost after commit')}
    }
    return{data:{counts:{like:[...records].filter(k=>k.endsWith(':like')).length,read:[...records].filter(k=>k.endsWith(':read')).length},own:{like:records.has(args.p_device_id+':like'),read:records.has(args.p_device_id+':read')}},error:null};
  })}}},channel(){return{on(){return this},subscribe(){return this}}},removeChannel(){return Promise.resolve()}};
  return state;
}
test('offline clicks survive a reload and are sent on reconnect',async()=>{
  const db=backend(),disk=storage();db.offline=true;
  const first=new Tracker(db.client,'browser-one',()=>{},disk);first.select(date);first.choose('read');
  await wait(()=>!first.flushing);assert.equal(first.queue[date+':read'].active,true);first.destroy();
  db.offline=false;const second=new Tracker(db.client,'browser-one',()=>{},disk);second.select(date);
  await wait(()=>!second.flushing&&!Object.keys(second.queue).length);
  assert.equal(second.snapshots[date].counts.read,1);assert.equal(second.snapshots[date].own.read,true);second.destroy();
});
test('a lost write response and retry cannot duplicate a reader',async()=>{
  const db=backend(),tracker=new Tracker(db.client,'browser-two',()=>{},storage());tracker.select(date);
  await wait(()=>!!tracker.snapshots[date]);db.loseResponse=true;tracker.choose('read');
  await wait(()=>!tracker.flushing);assert.equal(db.records.size,1);assert.equal(Object.keys(tracker.queue).length,1);
  await tracker.flush();assert.equal(db.records.size,1);assert.equal(tracker.snapshots[date].counts.read,1);
  tracker.choose('read');assert.equal(Object.keys(tracker.queue).length,0);tracker.destroy();
});
test('refresh failure preserves the last server totals',async()=>{
  const db=backend();db.records.add('someone-else:read');let view;
  const tracker=new Tracker(db.client,'browser-three',value=>view=value,storage());tracker.select(date);
  await wait(()=>view?.counts.read===1);db.offline=true;await tracker.refresh();
  assert.equal(view.counts.read,1);assert.equal(view.own.read,false);tracker.destroy();
});
