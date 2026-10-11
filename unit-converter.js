(function(){
  var $=TN.$,U={
    Length:{Meter:1,Kilometer:1000,Centimeter:.01,Millimeter:.001,Inch:.0254,Foot:.3048,Yard:.9144,Mile:1609.344},
    Weight:{Kilogram:1,Gram:.001,Pound:.45359237,Ounce:.028349523125},
    Temperature:{Celsius:1,Fahrenheit:1,Kelvin:1},
    Volume:{Liter:1,Milliliter:.001,'Gallon (US)':3.785411784}
  };
  function fill(id,list){$(id).innerHTML=list.map(function(n){return '<option>'+n+'</option>';}).join('');}
  function units(){var l=Object.keys(U[$('cat').value]);fill('from',l);fill('to',l);$('to').selectedIndex=1;}
  fill('cat',Object.keys(U));
  $('cat').onchange=units;
  units();
  $('go').onclick=function(){
    var c=$('cat').value,f=$('from').value,t=$('to').value,v=parseFloat($('val').value),res=$('res'),r;
    if(isNaN(v)){TN.err(res,'Enter a valid number.');return;}
    if(c==='Temperature'){
      if(f==='Kelvin'&&v<0){TN.err(res,'Kelvin cannot be below 0.');return;}
      var k=f==='Celsius'?v:f==='Fahrenheit'?(v-32)*5/9:v-273.15;
      r=t==='Celsius'?k:t==='Fahrenheit'?k*9/5+32:k+273.15;
    }else r=v*U[c][f]/U[c][t];
    TN.ok(res,TN.kv(TN.fmt(v,6)+' '+f,TN.fmt(r,6)+' '+t));
  };
})();
