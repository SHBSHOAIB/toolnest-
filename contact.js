(function(){
  var $=TN.$,f=$('cf');
  if(!f)return;
  var out=$('res'),btn=$('go'),busy=false,mail=f.getAttribute('data-email');
  function val(id){var e=$(id);return e?e.value.trim():'';}
  function done(){busy=false;btn.disabled=false;btn.textContent='Send Message';}
  function fail(){
    out.className='res err';
    out.innerHTML='\u26A0 Your message could not be sent. Please try again later or email us directly at <a href="mailto:'+mail+'">'+mail+'</a>.';
  }
  f.addEventListener('submit',function(e){
    e.preventDefault();
    if(busy||val('hp'))return;
    var n=val('cn'),m=val('ce'),s=val('cs'),t=val('cm');
    if(!n||!m||!s||!t){TN.err(out,'Please fill in all required fields.');return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m)){TN.err(out,'Please enter a valid email address.');return;}
    if(t.length<10){TN.err(out,'Please write a message of at least 10 characters.');return;}
    busy=true;btn.disabled=true;btn.textContent='Sending...';TN.ok(out,'Sending your message...');
    var ctl=window.AbortController?new AbortController():null,timer=setTimeout(function(){if(ctl)ctl.abort();},15000);
    fetch(f.getAttribute('data-endpoint'),{
      method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify({name:n,email:m,subject:s,message:t,_subject:'ToolNest contact: '+s}),
      signal:ctl?ctl.signal:undefined
    }).then(function(r){return r.json().then(function(d){return {ok:r.ok,d:d};});})
    .then(function(x){
      clearTimeout(timer);done();
      if(x.ok&&x.d&&(x.d.success===true||x.d.success==='true')){f.reset();TN.ok(out,'Thank you. Your message was sent successfully.');}
      else fail();
    }).catch(function(){clearTimeout(timer);done();fail();});
  });
})();
