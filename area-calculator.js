(function(){
  var $=TN.$,F={Rectangle:['Length','Width'],Square:['Side'],Triangle:['Base','Height'],Circle:['Radius']};
  function draw(){
    $('fields').innerHTML=F[$('shape').value].map(function(n,i){
      return '<div><label for="f'+i+'">'+n+'</label><input type="number" id="f'+i+'" min="0" step="any" inputmode="decimal"></div>';
    }).join('');
    $('res').textContent='';$('res').className='res';
  }
  $('shape').onchange=draw;draw();
  $('go').onclick=function(){
    var s=$('shape').value,res=$('res'),v=F[s].map(function(n,i){return parseFloat($('f'+i).value);});
    if(v.some(function(x){return isNaN(x)||x<=0;})){TN.err(res,'Enter numbers above 0 in every field.');return;}
    var a={Rectangle:v[0]*v[1],Square:v[0]*v[0],Triangle:v[0]*v[1]/2,Circle:Math.PI*v[0]*v[0]}[s];
    var ft=$('unit').value==='ft',m2=ft?a*0.09290304:a,f2=ft?a:a*10.7639104;
    TN.ok(res,TN.kv('Area in square meters',TN.fmt(m2,4))+TN.kv('Area in square feet',TN.fmt(f2,4)));
  };
})();
