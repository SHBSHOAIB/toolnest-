window.TN={
  $:function(id){return document.getElementById(id);},
  fmt:function(n,d){return Number(n).toLocaleString('en-US',{maximumFractionDigits:d==null?4:d});},
  err:function(el,m){el.className='res err';el.textContent='\u26A0 '+m;},
  ok:function(el,h){el.className='res';el.innerHTML=h;},
  kv:function(a,v){return '<div class="kv"><span>'+a+'</span><strong>'+v+'</strong></div>';},
  toast:function(t){var el=TN.$('toast');if(!el)return;el.textContent=t;el.hidden=false;clearTimeout(TN.tt);TN.tt=setTimeout(function(){el.hidden=true;},2600);},
  copy:function(text,msg){
    function done(){TN.toast(msg||'Copied to clipboard.');}
    function fallback(){
      var a=document.createElement('textarea');a.value=text;a.style.position='fixed';a.style.opacity='0';
      document.body.appendChild(a);a.select();
      try{document.execCommand('copy')?done():TN.toast('Copy failed. Please copy it manually.');}
      catch(e){TN.toast('Copy failed. Please copy it manually.');}
      document.body.removeChild(a);
    }
    if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(text).then(done,fallback);else fallback();
  }
};
(function(){
  var $=TN.$,y=$('year');if(y)y.textContent=new Date().getFullYear();
  var mb=$('menuBtn'),nav=$('nav');
  if(mb&&nav)mb.addEventListener('click',function(){mb.setAttribute('aria-expanded',nav.classList.toggle('open'));});

  /* Full screen */
  var fs=$('fsBtn'),de=document.documentElement;
  function canFs(){return !!(de.requestFullscreen||de.webkitRequestFullscreen);}
  function isFs(){return !!(document.fullscreenElement||document.webkitFullscreenElement);}
  function update(){fs.textContent=isFs()?'\u2715 Exit Full Screen':'\u26F6 Full Screen';document.body.classList.toggle('fullscreen-mode',isFs());}
  if(fs){
    fs.addEventListener('click',function(){
      if(!canFs()){TN.toast('Full screen is not supported on this browser.');return;}
      try{
        var p=isFs()?(document.exitFullscreen||document.webkitExitFullscreen).call(document):(de.requestFullscreen||de.webkitRequestFullscreen).call(de);
        if(p&&p.catch)p.catch(function(){TN.toast('The browser blocked full screen.');});
      }catch(e){TN.toast('Full screen could not be started.');}
    });
    document.addEventListener('fullscreenchange',update);
    document.addEventListener('webkitfullscreenchange',update);
  }

  /* Recent tools (stores only tool file names in localStorage) */
  var cur=document.body.getAttribute('data-tool');
  try{
    if(cur){var r=JSON.parse(localStorage.getItem('tn_recent')||'[]').filter(function(x){return x!==cur;});r.unshift(cur);localStorage.setItem('tn_recent',JSON.stringify(r.slice(0,4)));}
    var rs=$('recent');
    if(rs){
      var h='';JSON.parse(localStorage.getItem('tn_recent')||'[]').forEach(function(f){
        var c=document.querySelector('.tool-card[data-f="'+f+'"]');
        if(c)h+='<li><a class="chip" href="'+c.dataset.f+'">'+c.dataset.n+'</a></li>';
      });
      if(h){rs.querySelector('ul').innerHTML=h;rs.hidden=false;}
    }
  }catch(e){}

  /* Home: search + category filter */
  var s=$('search'),chips=document.querySelectorAll('.cat-chip'),cat='All';
  function apply(){
    var q=s.value.toLowerCase().trim(),n=0;
    document.querySelectorAll('.tool-card').forEach(function(c){
      var m=(cat==='All'||c.dataset.cat===cat)&&(c.dataset.kw+' '+c.dataset.cat+' '+c.textContent).toLowerCase().indexOf(q)>-1;
      c.hidden=!m;if(m)n++;
    });
    $('noRes').hidden=n>0;
  }
  function setCat(c){
    cat=c;
    chips.forEach(function(x){var on=x.dataset.cat===c;x.classList.toggle('active',on);x.setAttribute('aria-pressed',on);});
    apply();
  }
  if(s){
    s.addEventListener('input',apply);
    chips.forEach(function(x){x.addEventListener('click',function(){setCat(x.dataset.cat);});});
    var m=location.search.match(/cat=([^&]+)/);
    if(m){var v=decodeURIComponent(m[1]);chips.forEach(function(x){if(x.dataset.cat===v)setCat(v);});}
  }

  /* Tool buttons: reset, copy result, share */
  function lines(){
    var dp=$('disp');if(dp)return dp.textContent==='0'?'':dp.textContent;
    var o=[];
    document.querySelectorAll('.tool .res').forEach(function(r){
      if(r.id==='info'||r.classList.contains('err')||!r.textContent.trim())return;
      var k=r.querySelectorAll('.kv');
      if(k.length)k.forEach(function(x){o.push(x.children[0].textContent+': '+x.children[1].textContent);});
      else o.push(r.textContent.trim());
    });
    return o.join('\n');
  }
  document.addEventListener('click',function(ev){
    var b=ev.target.closest('[data-act]');if(!b)return;
    var act=b.getAttribute('data-act'),box=document.querySelector('.tool');
    if(!box)return;
    if(act==='reset'){
      var ac=box.querySelector('[data-k="AC"]');
      if(ac){ac.click();return;}
      box.querySelectorAll('input,textarea').forEach(function(i){
        if(i.type==='checkbox')i.checked=i.defaultChecked;else i.value=i.defaultValue;
        i.dispatchEvent(new Event('input'));
      });
      box.querySelectorAll('.res').forEach(function(r){if(r.id!=='info'){r.textContent='';r.className='res';}});
      var f=box.querySelector('input,textarea');if(f)f.focus();
    }else if(act==='copy'){
      var t=lines();if(!t){TN.toast('There is no result to copy yet.');return;}
      TN.copy(t,'Result copied.');
    }else if(act==='share'){
      var res=lines(),d={title:document.title,text:(res?res+'\n':'')+'Calculated with ToolNest',url:location.href.split('#')[0].split('?')[0]};
      if(navigator.share)navigator.share(d).catch(function(){});
      else TN.copy(d.text+'\n'+d.url,'Copied. Paste it to share.');
    }
  });
})();

/* PWA: register the service worker once the page has loaded (needs HTTPS or localhost) */
(function(){
  if(!window.isSecureContext){console.warn('ToolNest: service workers need HTTPS or localhost, so the app cannot be installed from this address.');return;}
  if(!('serviceWorker' in navigator))return;
  var tag=document.querySelector('script[src$="js/main.js"]');
  if(!tag)return;
  window.addEventListener('load',function(){
    navigator.serviceWorker.register(new URL('../service-worker.js',tag.src).href)
      .catch(function(err){console.warn('ToolNest: service worker registration failed: '+err.message);});
  });
})();
