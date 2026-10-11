(function(){
  var $=TN.$;
  $('go').onclick=function(){
    var r=$('res');
    if($('pr').value===''||$('dc').value===''){TN.err(r,'Please enter a value.');return;}
    var p=parseFloat($('pr').value),d=parseFloat($('dc').value),t=$('tx').value===''?0:parseFloat($('tx').value);
    if(isNaN(p)||isNaN(d)||isNaN(t)||p<0||t<0){TN.err(r,'Please enter a valid number.');return;}
    if(d<0||d>100){TN.err(r,'Discount must be between 0 and 100.');return;}
    var s=p*d/100,sale=p-s;
    TN.ok(r,TN.kv('You save',TN.fmt(s,2))+TN.kv('Sale price',TN.fmt(sale,2))+(t?TN.kv('Final price with tax',TN.fmt(sale*(1+t/100),2)):''));
  };
})();
