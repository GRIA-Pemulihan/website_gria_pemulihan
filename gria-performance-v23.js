/* GRIA Performance v23 */
(function(){
  'use strict';
  if(window.__GRIA_PERF_V23)return;
  window.__GRIA_PERF_V23=true;

  document.documentElement.classList.add('gria-v23');

  /* Tell the browser which below-fold images can wait. */
  function tuneImages(){
    document.querySelectorAll('img:not([loading])').forEach(function(img,i){
      if(i>0)img.loading='lazy';
      img.decoding='async';
    });
  }

  function init(){
    tuneImages();
    var observer=new MutationObserver(function(records){
      var needs=false;
      records.forEach(function(r){if(r.addedNodes&&r.addedNodes.length)needs=true});
      if(needs)requestAnimationFrame(tuneImages);
    });
    observer.observe(document.body,{childList:true,subtree:true});
    setTimeout(function(){observer.disconnect()},3500);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
