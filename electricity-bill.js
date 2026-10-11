(function(){
  var $=TN.$;
  $('go').onclick=function(){
    var u=parseFloat($('u').value),p=parseFloat($('p').value),f=$('f').value===''?0:parseFloat($('f').value),res=$('res');
    if(isNaN(u)||isNaN(p)||isNaN(f)||u<0||p<0||f<0){TN.err(res,'Enter units and price per unit. Values cannot be negative.');return;}
    TN.ok(res,TN.kv('Energy cost',TN.fmt(u*p,2))+TN.kv('Fixed charges',TN.fmt(f,2))+TN.kv('Estimated total',TN.fmt(u*p+f,2)));
  };
})();
