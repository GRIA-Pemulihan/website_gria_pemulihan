/* GRIA v22 — stable dock runtime */
(function(){
  'use strict';
  if(window.__GRIA_FIX_V22)return;
  window.__GRIA_FIX_V22=true;

  function pinDock(){
    var nav=document.getElementById('griaBottomNav')||document.querySelector('.gria-bottom-nav');
    if(!nav)return;
    nav.style.setProperty('position','fixed','important');
    nav.style.setProperty('top','auto','important');
    nav.style.setProperty('bottom','calc(10px + env(safe-area-inset-bottom,0px))','important');
    nav.style.setProperty('left','max(12px,env(safe-area-inset-left,0px))','important');
    nav.style.setProperty('right','max(12px,env(safe-area-inset-right,0px))','important');
    nav.style.setProperty('margin','0','important');
    nav.style.setProperty('transform','translate3d(0,0,0)','important');
    nav.style.setProperty('-webkit-transform','translate3d(0,0,0)','important');
  }

  var ticking=false;
  function schedule(){
    if(ticking)return;ticking=true;
    requestAnimationFrame(function(){pinDock();ticking=false});
  }

  function init(){
    pinDock();
    var mo=new MutationObserver(schedule);mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule,{passive:true});
    window.addEventListener('orientationchange',function(){setTimeout(schedule,120)},{passive:true});
    if(window.visualViewport){
      window.visualViewport.addEventListener('resize',schedule,{passive:true});
      window.visualViewport.addEventListener('scroll',schedule,{passive:true});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
