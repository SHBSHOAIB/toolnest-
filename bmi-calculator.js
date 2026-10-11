(function(){
  var $=TN.$;
  function sw(){var cm=$('hu').value==='cm';$('g-cm').hidden=!cm;$('g-ft').hidden=cm;}
  $('hu').onchange=sw;sw();
  $('go').onclick=function(){
    var res=$('res'),w=parseFloat($('wt').value),h;
    if($('hu').value==='cm')h=parseFloat($('cm').value);
    else h=(parseFloat($('ft').value)||0)*30.48+(parseFloat($('in').value)||0)*2.54;
    if(!(h>50&&h<272)||!(w>0&&w<700)){TN.err(res,'Enter a realistic height (50 to 272 cm) and weight in kg.');return;}
    var m=h/100,b=w/(m*m),c=b<18.5?'Underweight':b<25?'Normal weight':b<30?'Overweight':'Obesity';
    TN.ok(res,TN.kv('BMI',TN.fmt(b,1))+TN.kv('Category',c));
  };
})();
