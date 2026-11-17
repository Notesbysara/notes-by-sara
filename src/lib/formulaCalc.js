// Calculator engine for the Formula Library. Copied unchanged from the original
// formula-library-app.html, so every calculator gives the same answers as before.
/* Calculator engine: runs the inputs, checks and steps stored with each formula. */
const CALC=(function(){
const sum=a=>{let s=0;for(const x of a)s+=x;return s};
const mean=a=>sum(a)/a.length;
const vr=a=>{const m=mean(a);return sum(a.map(x=>(x-m)**2))/(a.length-1)};
const cov=(x,y)=>{const mx=mean(x),my=mean(y);return sum(x.map((a,i)=>(a-mx)*(y[i]-my)))/(x.length-1)};
const npv=(r,f)=>sum(f.map((c,t)=>c/(1+r)**t));
function irr(f){let lo=-0.99,hi=10;for(let i=0;i<300;i++){const m=(lo+hi)/2;if(npv(m,f)>0)lo=m;else hi=m}return(lo+hi)/2}
const prod=a=>{let p=1;for(const x of a)p*=x;return p};
const zip=(a,b)=>a.map((x,i)=>[x,b[i]]).slice(0,Math.min(a.length,b.length));
const range=(a,b)=>{const o=[];for(let i=a;i<b;i++)o.push(i);return o};
function erf(x){const s=x<0?-1:1;x=Math.abs(x);if(x>6)return s;let t=x,sm=x,n=0;while(Math.abs(t)>1e-17*Math.abs(sm)){n++;t*=2*x*x/(2*n+1);sm+=t;if(n>500)break}return s*2/Math.sqrt(Math.PI)*Math.exp(-x*x)*sm}
const normcdf=z=>0.5*(1+erf(z/Math.SQRT2));
function normppf(p){ // Wichura AS241
 if(p<=0||p>=1)throw new Error('p');const q=p-0.5;let r,v;
 if(Math.abs(q)<=0.425){r=0.180625-q*q;
  return q*(((((((2509.0809287301226727*r+33430.575583588128105)*r+67265.770927008700853)*r+45921.953931549871457)*r+13731.693765509461125)*r+1971.5909503065514427)*r+133.14166789178437745)*r+3.387132872796366608)/(((((((5226.495278852545925*r+28729.085735721942674)*r+39307.89580009271061)*r+21213.794301586595867)*r+5394.1960214247511077)*r+687.1870074920579083)*r+42.313330701600911252)*r+1)}
 r=q<0?p:1-p;r=Math.sqrt(-Math.log(r));
 if(r<=5){r-=1.6;v=(((((((7.7454501427834140764e-4*r+0.0227238449892691845833)*r+0.24178072517745061177)*r+1.27045825245236838258)*r+3.64784832476320460504)*r+5.7694972214606914055)*r+4.6303378461565452959)*r+1.42343711074968357734)/(((((((1.05075007164441684324e-9*r+5.475938084995344946e-4)*r+0.0151986665636164571966)*r+0.14810397642748007459)*r+0.68976733498510000455)*r+1.6763848301838038494)*r+2.05319162663775882187)*r+1)}
 else{r-=5;v=(((((((2.01033439929228813265e-7*r+2.71155556874348757815e-5)*r+0.0012426609473880784386)*r+0.026532189526576123093)*r+0.29656057182850489123)*r+1.7848265399172913358)*r+5.4637849111641143699)*r+6.6579046435011037772)/(((((((2.04426310338993978564e-15*r+1.4215117583164458887e-7)*r+1.8463183175100546818e-5)*r+7.868691311456132591e-4)*r+0.0148753612908506148525)*r+0.13692988092273580531)*r+0.59983220655588793769)*r+1)}
 return q<0?-v:v}
const fact=n=>{let f=1;for(let i=2;i<=n;i++)f*=i;return f};
const median=a=>{const s=[...a].sort((x,y)=>x-y),n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2};
const quant=(a,p)=>{const s=[...a].sort((x,y)=>x-y),n=s.length,h=(n-1)*p,lo=Math.floor(h),hi=Math.min(lo+1,n-1);return s[lo]+(h-lo)*(s[hi]-s[lo])};
const bp=(face,c,y,n,m)=>{const N=Math.round(n*m),cp=face*c/m,r=y/m;let s=0;for(let k=1;k<=N;k++)s+=cp/(1+r)**k;return s+face/(1+r)**N};
const pvs=(face,c,y,n,m)=>{const N=Math.round(n*m),cp=face*c/m,r=y/m;return range(1,N+1).map(k=>(cp+(k===N?face:0))/(1+r)**k)};
const d1=(S,K,r,T,s,q)=>(Math.log(S/K)+(r-q+s*s/2)*T)/(s*Math.sqrt(T));
const bsc=(S,K,r,T,s,q)=>{const a=d1(S,K,r,T,s,q),b=a-s*Math.sqrt(T);return S*Math.exp(-q*T)*normcdf(a)-K*Math.exp(-r*T)*normcdf(b)};
const bsp=(S,K,r,T,s,q)=>{const a=d1(S,K,r,T,s,q),b=a-s*Math.sqrt(T);return K*Math.exp(-r*T)*normcdf(-b)-S*Math.exp(-q*T)*normcdf(-a)};
function ab(mac,q,price,need){let r=need,t=0,c=0;const z=zip(mac,q).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);for(const[m,a]of z){if(m<price&&r>0){const x=Math.min(a,r);t+=x;c+=x*m;r-=x}}return[t,c]}
function sweep(d0,r,s,t,e,c,want){let d=d0,ti=0;for(let k=0;k<Math.min(e.length,c.length);k++){const i=d*r;ti+=i;const pre=e[k]-c[k]-i,tax=Math.max(pre,0)*t,cash=pre-tax,pay=Math.min(d,Math.max(cash,0)*s);d-=pay}return want==='d'?d:ti}
const FUN={exp:Math.exp,ln:Math.log,sqrt:Math.sqrt,sum,count:a=>a.length,mean,var:vr,sd:a=>Math.sqrt(vr(a)),cov,
minus:(a,m)=>Array.isArray(m)?a.map((x,i)=>x-m[i]):a.map(x=>x-m),multiply:(a,b)=>zip(a,b).map(([x,y])=>x*y),square:a=>a.map(x=>x*x),dot:(a,b)=>sum(zip(a,b).map(([x,y])=>x*y)),
discounted:(r,f)=>f.map((c,t)=>c/(1+r)**t),irr,npv,prod,addone:a=>a.map(x=>1+x),max:(...a)=>a.length===1?Math.max(...a[0]):Math.max(...a),min:(...a)=>a.length===1?Math.min(...a[0]):Math.min(...a),abs:Math.abs,
normcdf,skew:a=>{const m=mean(a),s=Math.sqrt(sum(a.map(x=>(x-m)**2))/a.length);return sum(a.map(x=>((x-m)/s)**3))/a.length},
kurt:a=>{const m=mean(a),s=Math.sqrt(sum(a.map(x=>(x-m)**2))/a.length);return sum(a.map(x=>((x-m)/s)**4))/a.length-3},
autocorr:a=>{const m=mean(a);let n=0;for(let i=1;i<a.length;i++)n+=(a[i]-m)*(a[i-1]-m);return n/sum(a.map(x=>(x-m)**2))},
last:(a,k)=>a.slice(a.length-Math.trunc(k)),
payback:(i0,c)=>{let cum=-i0;for(let t=1;t<=c.length;t++){const x=c[t-1];if(cum+x>=0)return t-1+(-cum)/x;cum+=x}return NaN},
dpayback:(r,i0,c)=>FUN.payback(i0,c.map((x,t)=>x/(1+r)**(t+1))),
mirr:(fr,rr,f)=>{const n=f.length-1;let fv=0,pv=0;f.forEach((x,t)=>{if(x>0)fv+=x*(1+rr)**(n-t);if(x<0)pv+=-x/(1+fr)**t});return(fv/pv)**(1/n)-1},
median,pvflows:(r,f)=>f.map((x,t)=>x/(1+r)**(t+1)),divide:(a,b)=>zip(a,b).map(([x,y])=>x/y),ceil:Math.ceil,floor:Math.floor,
gains:a=>range(1,a.length).map(i=>Math.max(a[i]-a[i-1],0)),losses:a=>range(1,a.length).map(i=>Math.max(a[i-1]-a[i],0)),
psd:a=>{const m=mean(a);return Math.sqrt(sum(a.map(x=>(x-m)**2))/a.length)},
maxdd:v=>{let peak=v[0],m=0;for(const x of v){peak=Math.max(peak,x);m=Math.max(m,(peak-x)/peak)}return m},
downdev:(a,m)=>Math.sqrt(sum(a.map(x=>Math.min(x-m,0)**2))/a.length),scale:(a,k)=>a.map(x=>x*k),recip:a=>a.map(x=>1/x),top:(a,k)=>[...a].sort((x,y)=>y-x).slice(0,Math.trunc(k)),
ema:(a,n)=>{const k=2/(n+1);let e=a[0];for(let i=1;i<a.length;i++)e=a[i]*k+e*(1-k);return e},
bprice:bp,bytm:(p,face,c,n,m)=>{let lo=-0.9,hi=5;for(let i=0;i<200;i++){const mid=(lo+hi)/2;if(bp(face,c,mid,n,m)>p)lo=mid;else hi=mid}return(lo+hi)/2},
bdur:(face,c,y,n,m)=>{const pv=pvs(face,c,y,n,m);return sum(pv.map((x,i)=>(i+1)/m*x))/sum(pv)},
bconv:(face,c,y,n,m)=>{const pv=pvs(face,c,y,n,m),r=y/m;return sum(pv.map((x,i)=>(i+1)*(i+2)*x))/(sum(pv)*(1+r)**2*m*m)},
bootdf:par=>{const df=[];for(const p of par)df.push((1-p*sum(df))/(1+p));return df},
cumsum:a=>{let s=0;return a.map(x=>s+=x)},normpdf:x=>Math.exp(-x*x/2)/Math.sqrt(2*Math.PI),d1,bscall:bsc,bsput:bsp,
ivol:(price,S,K,r,T,q,kind)=>{const f=kind>0?bsc:bsp;let lo=1e-6,hi=5;for(let i=0;i<200;i++){const mid=(lo+hi)/2;if(f(S,K,r,T,mid,q)>price)hi=mid;else lo=mid}return(lo+hi)/2},
vixvar:(K,Q,F,K0,r,T)=>{const n=K.length,dk=[];for(let i=0;i<n;i++)dk.push(i===0?K[1]-K[0]:i===n-1?K[n-1]-K[n-2]:(K[i+1]-K[i-1])/2);const s=sum(dk.map((d,i)=>d/(K[i]*K[i])*Q[i]));return 2/T*Math.exp(r*T)*s-(F/K0-1)**2/T},
spots:df=>df.map((d,i)=>d**(-1/(i+1))-1),power:(a,k)=>a.map(x=>x**k),geom:(q,n)=>range(1,Math.trunc(n)+1).map(t=>q**t),posl:a=>a.map(x=>Math.max(x,0)),
quantile:quant,tailmean:(a,q)=>{const c=quant(a,q),t=a.filter(x=>x<=c);return mean(t)},
wealth:r=>{const w=[1];for(const x of r)w.push(w[w.length-1]*(1+x));return w},
quadform:(w,flat)=>{const n=w.length;let s=0;for(let i=0;i<n;i++)for(let j=0;j<n;j++)s+=w[i]*w[j]*flat[i*n+j];return s},
covfromcorr:(sd,corr)=>{const n=sd.length,o=[];for(let i=0;i<n;i++)for(let j=0;j<n;j++)o.push(sd[i]*sd[j]*corr[i*n+j]);return o},
normppf,diffs:a=>range(1,a.length).map(i=>a[i]-a[i-1]),logs:a=>a.map(Math.log),expl:a=>a.map(Math.exp),sqrtl:a=>a.map(Math.sqrt),sumsq:a=>sum(a.map(x=>x*x)),
ewmavar:(r,lam)=>{let v=r[0]**2;for(let i=1;i<r.length;i++)v=lam*v+(1-lam)*r[i]*r[i];return v},atan2:Math.atan2,
outcount:(a,lo,hi)=>a.filter(x=>x<lo||x>hi).length,trimmean:(a,lo,hi)=>mean(a.filter(x=>lo<=x&&x<=hi)),
bracketax:(inc,lo,rt)=>{let t=0;for(let k=0;k<lo.length;k++){const up=k+1<lo.length?lo[k+1]:Infinity;if(inc>lo[k])t+=rt[k]*(Math.min(inc,up)-lo[k])}return t},
marginrate:(inc,lo,rt)=>{let m=rt[0];for(let k=0;k<lo.length;k++)if(inc>lo[k])m=rt[k];return m},
rollmean:(a,k)=>range(k-1,a.length).map(i=>sum(a.slice(i-k+1,i+1))/k),capsum:(a,k)=>sum(a.map(x=>Math.min(x,k))),
fxpath:(s0,pd,pf,n)=>range(0,Math.trunc(n)+1).map(t=>s0*((1+pd)/(1+pf))**t),
nakamoto:(q,z)=>{const p=1-q;if(q>=p)return 1;const lam=z*q/p;let s=1;for(let k=0;k<=Math.trunc(z);k++){const pois=Math.exp(-lam)*lam**k/fact(k);s-=pois*(1-(q/p)**(z-k))}return s},
firstidx:(a,thr,after=0)=>{for(let i=0;i<a.length;i++)if(i+1>after&&a[i]>=thr)return i+1;return NaN},
argmin:a=>a.indexOf(Math.min(...a))+1,argmax:a=>a.indexOf(Math.max(...a))+1,
addlast:(f,x)=>f.slice(0,-1).concat([f[f.length-1]+x]),withcall:(dist,u,uy,price)=>{const f=[-price,...dist];f[Math.trunc(uy)]-=u;return f},
addconst:(a,c)=>a.map(x=>x+c),screenw:(w,s,mn)=>zip(w,s).map(([wi,si])=>si<mn?wi:0),keepw:(w,s,mn)=>zip(w,s).map(([wi,si])=>si>=mn?wi:0),
oppositehalves:(a,b)=>{const ca=median(a),cb=median(b);return zip(a,b).filter(([x,y])=>(x>ca)!==(y>cb)).length/a.length},
abslist:a=>a.map(Math.abs),abatetonnes:(mac,q,p,n)=>ab(mac,q,p,n)[0],abatecost:(mac,q,p,n)=>ab(mac,q,p,n)[1],
sweepdebt:(d0,r,s,t,e,c)=>sweep(d0,r,s,t,e,c,'d'),sweepinterest:(d0,r,s,t,e,c)=>sweep(d0,r,s,t,e,c,'i')};
// ---- expression parser (Python-style syntax used in the data)
function tokenize(s){const t=[];let i=0;while(i<s.length){const c=s[i];
 if(/\s/.test(c)){i++;continue}
 if(/[0-9.]/.test(c)){let m=/^(\d+\.?\d*(e[+-]?\d+)?|\.\d+)/i.exec(s.slice(i));t.push({t:'n',v:parseFloat(m[0])});i+=m[0].length;continue}
 if(/[A-Za-z_]/.test(c)){let m=/^[A-Za-z_][A-Za-z_0-9]*/.exec(s.slice(i));t.push({t:'w',v:m[0]});i+=m[0].length;continue}
 const two=s.slice(i,i+2);if(['**','<=','>=','==','!=','//'].includes(two)){t.push({t:'o',v:two});i+=2;continue}
 t.push({t:'o',v:c});i++}
 t.push({t:'e'});return t}
function parse(src){const tk=tokenize(src.replace(/\^/g,'**'));let p=0;
 const peek=()=>tk[p],next=()=>tk[p++],isO=v=>tk[p].t==='o'&&tk[p].v===v,isW=v=>tk[p].t==='w'&&tk[p].v===v;
 const expect=v=>{if(!isO(v))throw new Error('expected '+v+' in '+src);p++};
 function ternary(){const a=orE();if(isW('if')){next();const c=orE();if(!isW('else'))throw new Error('else');next();const b=ternary();return{k:'if',c,a,b}}return a}
 function orE(){let a=andE();while(isW('or')){next();a={k:'or',a,b:andE()}}return a}
 function andE(){let a=notE();while(isW('and')){next();a={k:'and',a,b:notE()}}return a}
 function notE(){if(isW('not')){next();return{k:'not',a:notE()}}return cmp()}
 function cmp(){let a=add();const ops=[],xs=[a];while(peek().t==='o'&&['<','>','<=','>=','==','!='].includes(peek().v)){ops.push(next().v);xs.push(add())}return ops.length?{k:'cmp',ops,xs}:a}
 function add(){let a=mul();while(isO('+')||isO('-')){const o=next().v;a={k:'bin',o,a,b:mul()}}return a}
 function mul(){let a=un();while(isO('*')||isO('/')||isO('%')||isO('//')){const o=next().v;a={k:'bin',o,a,b:un()}}return a}
 function un(){if(isO('-')){next();return{k:'neg',a:un()}}if(isO('+')){next();return un()}return pow()}
 function pow(){const a=post();if(isO('**')){next();return{k:'bin',o:'**',a,b:un()}}return a}
 function post(){let a=atom();for(;;){
  if(isO('(')){next();const args=[];if(!isO(')')){for(;;){const e=ternary();if(isW('for')){next();const v=next().v;if(!isW('in'))throw new Error('in');next();const it=orE();let cd=null;if(isW('if')){next();cd=orE()}args.push({k:'gen',e,v,it,cd})}else args.push(e);if(isO(',')){next();continue}break}}expect(')');a={k:'call',f:a,args};continue}
  if(isO('[')){next();let lo=null,hi=null,sl=false;if(!isO(':'))lo=ternary();if(isO(':')){next();sl=true;if(!isO(']'))hi=ternary()}expect(']');a=sl?{k:'slice',a,lo,hi}:{k:'idx',a,i:lo};continue}
  break}return a}
 function atom(){const x=next();
  if(x.t==='n')return{k:'num',v:x.v};
  if(x.t==='w')return{k:'name',v:x.v};
  if(x.t==='o'&&x.v==='('){const e=ternary();expect(')');return e}
  if(x.t==='o'&&x.v==='['){const els=[];if(!isO(']')){for(;;){els.push(ternary());if(isO(',')){next();continue}break}}expect(']');return{k:'list',els}}
  throw new Error('unexpected '+JSON.stringify(x)+' in '+src)}
 const ast=ternary();if(peek().t!=='e')throw new Error('trailing in '+src);return ast}
const idxf=(a,i)=>{i=Math.trunc(i);if(i<0)i+=a.length;if(i<0||i>=a.length)throw new Error('index');return a[i]};
const slicef=(a,lo,hi)=>{const n=a.length,f=v=>v<0?Math.max(n+v,0):Math.min(v,n);return a.slice(lo===null?0:f(Math.trunc(lo)),hi===null?n:f(Math.trunc(hi)))};
function ev(n,env){switch(n.k){
 case'num':return n.v;
 case'name':if(n.v==='True')return 1;if(n.v==='False')return 0;if(!(n.v in env))throw new Error('name '+n.v);return env[n.v];
 case'neg':return-ev(n.a,env);
 case'not':return ev(n.a,env)?0:1;
 case'and':{const a=ev(n.a,env);return a?ev(n.b,env):a}
 case'or':{const a=ev(n.a,env);return a?a:ev(n.b,env)}
 case'if':return ev(n.c,env)?ev(n.a,env):ev(n.b,env);
 case'cmp':{let l=ev(n.xs[0],env);for(let i=0;i<n.ops.length;i++){const r=ev(n.xs[i+1],env),o=n.ops[i];const ok=o==='<'?l<r:o==='>'?l>r:o==='<='?l<=r:o==='>='?l>=r:o==='=='?l===r:l!==r;if(!ok)return 0;l=r}return 1}
 case'bin':{const a=ev(n.a,env),b=ev(n.b,env);
  if(Array.isArray(a)||Array.isArray(b)){if(n.o==='+'&&Array.isArray(a)&&Array.isArray(b))return a.concat(b);if(n.o==='*'&&Array.isArray(a)&&!Array.isArray(b)){let o=[];for(let i=0;i<Math.trunc(b);i++)o=o.concat(a);return o}if(n.o==='*'&&Array.isArray(b)&&!Array.isArray(a)){let o=[];for(let i=0;i<Math.trunc(a);i++)o=o.concat(b);return o}throw new Error('list arithmetic')}
  switch(n.o){case'+':return a+b;case'-':return a-b;case'*':return a*b;case'/':if(b===0)throw new Error('division by zero');return a/b;case'**':return a**b;case'%':return a-Math.floor(a/b)*b;case'//':return Math.floor(a/b)}}
 case'idx':return idxf(ev(n.a,env),ev(n.i,env));
 case'slice':return slicef(ev(n.a,env),n.lo?ev(n.lo,env):null,n.hi?ev(n.hi,env):null);
 case'list':return n.els.map(e=>ev(e,env));
 case'call':{const fn=env[n.f.v];if(typeof fn!=='function')throw new Error('function '+n.f.v);
  const args=n.args.map(a=>a.k==='gen'?genv(a,env):ev(a,env));return fn(...args)}
 case'gen':return genv(n,env)}}
function genv(g,env){const it=ev(g.it,env),o=[];for(const x of it){const e2=Object.assign({},env,{[g.v]:x});if(g.cd&&!ev(g.cd,e2))continue;o.push(ev(g.e,e2))}return o}
const cache={};const P=s=>cache[s]||(cache[s]=parse(s));
const conv=(inp,v)=>inp.unit==='%'?(Array.isArray(v)?v.map(x=>x/100):v/100):v;
function run(c,vals){const env=Object.assign({},FUN);
 for(const i of c.inputs){env[i.id]=conv(i,vals[i.id])}
 for(const k of c.checks){if(!ev(P(k.expr),env))return{err:k.message}}
 const out={};
 for(const s of c.steps){const v=ev(P(s.expr),env);env[s.id]=v;out[s.id]=v}
 return{out}}
const num=(v,d)=>Number.isFinite(v)?v.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d}):'n/a';
function fmt(kind,v){
 if(Array.isArray(v)){const f={list2:'num2',list2pct:'pct2',list4:'num4'}[kind]||'num2';return v.map(x=>fmt(f,x)).join(', ')}
 if(typeof v==='boolean')v=v?1:0;
 if(kind==='money')return num(v,2);
 if(/^pct\d$/.test(kind))return Number.isFinite(v)?num(v*100,+kind[3])+'%':'n/a';
 if(/^num\d$/.test(kind))return num(v,+kind[3]);
 return String(v)}
return{run,fmt,FUN,parse:P,ev}})();

export default CALC;
