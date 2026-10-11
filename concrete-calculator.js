(function(){
  var $=TN.$;
  $('go').onclick=function(){
    var L=parseFloat($('l').value),W=parseFloat($('w').value),T=parseFloat($('t').value),wa=$('wa').value===''?0:parseFloat($('wa').value),r=$('res'),ft=$('un').value==='ft';
    if(isNaN(L)||isNaN(W)||isNaN(T)||isNaN(wa)||L<=0||W<=0||T<=0||wa<0){TN.err(r,'Enter length, width and thickness above 0. Waste cannot be negative.');return;}
    var v=L*W*T,m3=ft?v*0.0283168466:v,o=m3*(1+wa/100);
    TN.ok(r,TN.kv('Volume',TN.fmt(m3,3)+' m³ ('+TN.fmt(m3*35.3146667,2)+' ft³)')+TN.kv('Volume in cubic yards',TN.fmt(m3*1.30795062,2)+' yd³')+TN.kv('With '+wa+'% waste',TN.fmt(o,3)+' m³ ('+TN.fmt(o*1.30795062,2)+' yd³)'));
  };
})();
