(function(){
  var $=TN.$,C=['USD','PKR','EUR','GBP','AED','SAR','INR','CAD','AUD','JPY'],
  SAMPLE={USD:1,PKR:278,EUR:.92,GBP:.79,AED:3.6725,SAR:3.75,INR:83.2,CAD:1.36,AUD:1.52,JPY:150};
  // To use a real API later, replace the body of getRates() with a fetch() call that
  // returns {rates:{USD:1,...},note:'...'} (rates relative to one base currency).
  function getRates(){return Promise.resolve({rates:SAMPLE,note:'Using sample exchange rates.'});}
  ['from','to'].forEach(function(id){$(id).innerHTML=C.map(function(c){return '<option>'+c+'</option>';}).join('');});
  $('from').value='USD';$('to').value='PKR';
  $('go').onclick=function(){
    var a=parseFloat($('amt').value),f=$('from').value,t=$('to').value,res=$('res');
    if(isNaN(a)||a<0){TN.err(res,'Enter a valid amount.');return;}
    getRates().then(function(d){
      var r=d.rates[t]/d.rates[f];
      TN.ok(res,TN.kv('Converted amount',TN.fmt(a*r,2)+' '+t)+TN.kv('Exchange rate','1 '+f+' = '+TN.fmt(r,4)+' '+t)+'<p class="note">'+d.note+'</p>');
    }).catch(function(){TN.err(res,'Could not load exchange rates.');});
  };
})();
