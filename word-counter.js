(function(){
  var $=TN.$,t=$('txt');
  t.addEventListener('input',function(){
    var s=t.value,r=$('res');
    if(!s.trim()){r.textContent='';r.className='res';return;}
    var w=s.trim().split(/\s+/).length,
      sen=(s.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[]).filter(function(x){return x.trim();}).length,
      p=s.split(/\n\s*\n/).filter(function(x){return x.trim();}).length;
    TN.ok(r,TN.kv('Words',TN.fmt(w,0))+TN.kv('Characters',TN.fmt(s.length,0))+TN.kv('Characters (no spaces)',TN.fmt(s.replace(/\s/g,'').length,0))+TN.kv('Sentences',sen)+TN.kv('Paragraphs',p)+TN.kv('Reading time','about '+Math.max(1,Math.ceil(w/200))+' min'));
  });
})();
