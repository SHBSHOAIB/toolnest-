(function(){
  var $=TN.$,dob=$('dob'),res=$('res'),now=new Date();
  dob.max=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
  $('go').onclick=function(){
    if(!dob.value){TN.err(res,'Please select your date of birth.');return;}
    var b=new Date(dob.value+'T00:00:00'),n=new Date();
    if(isNaN(b.getTime())){TN.err(res,'This date is not valid.');return;}
    var t=new Date(n.getFullYear(),n.getMonth(),n.getDate());
    if(b>t){TN.err(res,'Date of birth cannot be in the future.');return;}
    var y=t.getFullYear()-b.getFullYear(),m=t.getMonth()-b.getMonth(),d=t.getDate()-b.getDate();
    if(d<0){m--;d+=new Date(t.getFullYear(),t.getMonth(),0).getDate();}
    if(m<0){y--;m+=12;}
    TN.ok(res,TN.kv('Years',y)+TN.kv('Months',m)+TN.kv('Days',d)+
      TN.kv('Total days',TN.fmt(Math.round((t-b)/864e5),0))+
      TN.kv('Total hours',TN.fmt(Math.floor((n-b)/36e5),0)));
  };
})();
