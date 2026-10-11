(function(){
  var $=TN.$,img=null,file=null,mode='resize',tabs=document.querySelectorAll('[role=tab]');
  function kb(n){return n<1048576?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
  function setMode(m){
    mode=m;
    tabs.forEach(function(t){var on=t.dataset.m===m;t.setAttribute('aria-selected',on);t.classList.toggle('active',on);});
    ['resize','compress','convert'].forEach(function(x){$('p-'+x).hidden=x!==m;});
  }
  tabs.forEach(function(t){t.onclick=function(){setMode(t.dataset.m);};});
  $('file').onchange=function(){
    var f=this.files[0];if(!f)return;
    if(!/^image\/(jpeg|png|webp)$/.test(f.type)){TN.err($('info'),'Please choose a JPG, PNG or WebP image.');return;}
    var im=new Image();
    im.onload=function(){
      img=im;file=f;$('w').value=im.naturalWidth;$('h').value=im.naturalHeight;
      TN.ok($('info'),'Original: '+im.naturalWidth+' × '+im.naturalHeight+' px, '+kb(f.size));
    };
    im.onerror=function(){TN.err($('info'),'This image could not be read.');};
    im.src=URL.createObjectURL(f);
  };
  $('w').oninput=function(){if(img&&$('ar').checked)$('h').value=Math.round(this.value*img.naturalHeight/img.naturalWidth)||'';};
  $('h').oninput=function(){if(img&&$('ar').checked)$('w').value=Math.round(this.value*img.naturalWidth/img.naturalHeight)||'';};
  $('q').oninput=function(){$('qv').textContent=this.value+'%';};
  $('go').onclick=function(){
    if(!img){TN.err($('info'),'Please upload an image first.');return;}
    var w=img.naturalWidth,h=img.naturalHeight,type=file.type,q=.92;
    if(mode==='resize'){
      w=parseInt($('w').value,10);h=parseInt($('h').value,10);
      if(!(w>0&&h>0)||w>8000||h>8000){TN.err($('info'),'Enter a width and height between 1 and 8000 px.');return;}
    }
    if(mode==='compress'){type=type==='image/png'?'image/webp':type;q=$('q').value/100;}
    if(mode==='convert')type=$('fmt').value;
    var c=document.createElement('canvas');c.width=w;c.height=h;
    var x=c.getContext('2d');
    if(type==='image/jpeg'){x.fillStyle='#fff';x.fillRect(0,0,w,h);}
    x.drawImage(img,0,0,w,h);
    c.toBlob(function(b){
      if(!b){TN.err($('outinfo'),'This browser cannot create that image.');return;}
      var u=URL.createObjectURL(b),ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[b.type]||'png';
      $('prev').src=u;$('prev').hidden=false;
      $('dl').href=u;$('dl').download='toolnest-'+mode+'.'+ext;$('dl').hidden=false;
      TN.ok($('outinfo'),w+' × '+h+' px, '+b.type.replace('image/','').toUpperCase()+', about '+kb(b.size)+' (original '+kb(file.size)+')');
    },type,q);
  };
})();
