(function(){
  var $=TN.$;
  function f(n){return TN.fmt(n,6);}
  document.querySelectorAll('.calc').forEach(function(btn){
    btn.onclick=function(){
      var t=btn.dataset.t,a=parseFloat($('a'+t).value),b=parseFloat($('b'+t).value),r=$('r'+t),o;
      if(isNaN(a)||isNaN(b)){TN.err(r,'Please enter both values.');return;}
      if(t==='1')o=f(a)+'% of '+f(b)+' = '+f(a*b/100);
      else if(t==='2'){if(b===0){TN.err(r,'Y cannot be zero.');return;}o=f(a)+' is '+f(a/b*100)+'% of '+f(b);}
      else if(t==='3'){
        if(a===0){TN.err(r,'Old value cannot be zero.');return;}
        var c=(b-a)/Math.abs(a)*100;o=(c>=0?'Increase':'Decrease')+' of '+f(Math.abs(c))+'%';
      }else{if(b===0){TN.err(r,'Percentage cannot be zero.');return;}o='Original value = '+f(a*100/b);}
      TN.ok(r,'<strong>'+o+'</strong>');
    };
  });
  document.querySelectorAll('.clr').forEach(function(btn){
    btn.onclick=function(){var t=btn.dataset.t;$('a'+t).value='';$('b'+t).value='';$('r'+t).textContent='';$('r'+t).className='res';};
  });
})();
