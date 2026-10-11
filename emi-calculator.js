(function(){
  var $=TN.$;
  $('go').onclick=function(){
    var P=parseFloat($('amt').value),R=parseFloat($('rate').value),T=parseFloat($('ten').value),res=$('res');
    if(!(P>0)||!(R>=0)||!(T>0)){TN.err(res,'Enter a loan amount, an interest rate (0 or more) and a tenure above 0.');return;}
    var n=$('unit').value==='years'?T*12:T,r=R/1200;
    var emi=r===0?P/n:P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1),total=emi*n;
    TN.ok(res,TN.kv('Monthly EMI',TN.fmt(emi,2))+TN.kv('Total payment',TN.fmt(total,2))+TN.kv('Total interest',TN.fmt(total-P,2)));
  };
})();
