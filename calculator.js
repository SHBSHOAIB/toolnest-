(function(){
  var d=TN.$('disp'),e='',O='+−×÷',done=false;
  function show(){d.textContent=e||'0';}
  function calc(s){
    var t=s.match(/(\d+\.?\d*|\.\d+)%?|[+−×÷]/g),n=[],o=[],i;
    if(!t)return 0;
    for(i=0;i<t.length;i++){
      if(i%2===0){if(O.indexOf(t[i])>-1)throw 'Error';n.push({v:parseFloat(t[i]),p:/%$/.test(t[i])});}
      else{if(O.indexOf(t[i])<0)throw 'Error';o.push(t[i]);}
    }
    if(o.length!==n.length-1)throw 'Error';
    var a=[n[0]],b=[];
    for(i=0;i<o.length;i++){
      var r=n[i+1];
      if(o[i]==='×'||o[i]==='÷'){
        var l=a.pop(),lv=l.p?l.v/100:l.v,rv=r.p?r.v/100:r.v;
        if(o[i]==='÷'&&rv===0)throw 'Cannot divide by 0';
        a.push({v:o[i]==='×'?lv*rv:lv/rv,p:false});
      }else{b.push(o[i]);a.push(r);}
    }
    var res=a[0].p?a[0].v/100:a[0].v;
    for(i=0;i<b.length;i++){var x=a[i+1],y=x.p?res*x.v/100:x.v;res=b[i]==='+'?res+y:res-y;}
    return Math.round(res*1e10)/1e10;
  }
  TN.$('keys').addEventListener('click',function(ev){
    var k=ev.target.getAttribute('data-k');
    if(!k)return;
    if(k==='AC')e='';
    else if(k==='DEL')e=e.slice(0,-1);
    else if(k==='='){
      var s=e.replace(/[+−×÷]$/,'');
      if(!s)return;
      if(s[0]==='−')s='0'+s;
      try{e=String(calc(s)).replace('-','−');}
      catch(x){d.textContent=typeof x==='string'?x:'Error';e='';return;}
    }
    else if(O.indexOf(k)>-1){
      if(!e){if(k==='−')e='−';}
      else if(O.indexOf(e.slice(-1))>-1){if(e.length>1)e=e.slice(0,-1)+k;}
      else e+=k;
    }
    else if(k==='%'){if(/[\d.]$/.test(e))e+='%';}
    else{
      if(done)e='';
      if(e.slice(-1)==='%')return;
      if(k==='.'){var last=e.split(/[+−×÷]/).pop();if(last.indexOf('.')>-1)return;if(!last)k='0.';}
      e+=k;
    }
    done=(k==='=');
    show();
  });
})();
