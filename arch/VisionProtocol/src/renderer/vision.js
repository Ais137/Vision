let t=class t{constructor(...t){this.v=t.length>0?[...t]:[0,0]}get x(){return this.v[0]}get y(){return this.v[1]}get z(){return this.v[2]}set x(t){this.v[0]=t}set y(t){this.v[1]=t}set z(t){this.v[2]=t}static v(...s){return new t(...s)}static V(...s){return new t(...s)}static ones(s=2){return new t(...Array(s).fill(1))}static zeros(s=2){return new t(...Array(s).fill(0))}static random(s=[],e=!1){let i=[],r=0;for(let t=0,h=s.length;t<h;t++)r=Math.random()*(s[t][1]-s[t][0])+s[t][0],e?i.push(parseInt(r)):i.push(r);return new t(...i)}static rcv(s,e=null){let i=Math.random()*(2*Math.PI),r=null==e?Math.random()*s:Math.random()*(e-s)+s;return new t(Math.cos(i)*r,Math.sin(i)*r)}add(t){for(let s=0,e=this.v.length;s<e;s++)this.v[s]+=t.v[s]||0;return this}static add(...s){let e=t.zeros(s[0].dim());for(let t=0,i=s.length;t<i;t++)e.dim()<s[t].dim()&&e.dim(s[t].dim()),e.add(s[t]);return e}mult(t){for(let s=0,e=this.v.length;s<e;s++)this.v[s]*=t;return this}static mult(t,s){return t.clone().mult(s)}sub(t){for(let s=0,e=this.v.length;s<e;s++)this.v[s]-=t.v[s]||0;return this}static sub(...t){let s=t[0].clone();for(let e=1,i=t.length;e<i;e++)s.sub(t[e]);return s}dot(t){let s=0;for(let e=0,i=this.v.length;e<i;e++)s+=this.v[e]*(t.v[e]||0);return s}inner(t){return this.dot(t)}static LC(s,e){let i=t.zeros(s[0].dim());for(let t=0,r=s.length;t<r;t++)i.add(s[t].clone().mult(e[t]));return i}LM(t){let s=[];for(let e=0,i=t.length;e<i;e++){let i=0;for(let s=0,r=t[e].length;s<r;s++)i+=t[e][s]*(this.v[s]||0);s.push(i)}return this.v=s,this}static LM(t,s){return t.clone().map(s)}lerp(t,s){return s>0&&s<1?t.clone().sub(this).mult(s).add(this):s<=0?this.clone():t.clone()}static lerp(t,s,e){return t.lerp(s,e)}rotate(t,s=!1){t=s?Math.PI/180*t:t;let e=Math.cos(t),i=Math.sin(t),r=this.v[0]*e-this.v[1]*i,h=this.v[0]*i+this.v[1]*e;return this.v[0]=r,this.v[1]=h,this}static rotate(t,s){return t.clone().rotate(s)}dim(t=null){if(null!=t){let s=[],e=parseInt(t);for(let t=0;t<e;t++)s[t]=this.v[t]||0;return this.v=s,this}return this.v.length}norm(t=null){let s=0;for(let t=0,e=this.v.length;t<e;t++)s+=this.v[t]*this.v[t];let e=Math.sqrt(s);return null!=t&&0!=e&&this.mult(t/e),null==t?e:this}normalization(){let t=this.norm();return 0!=t&&this.mult(1/t),this}limit(t,s=null){let e,i,r=this.norm();return null==s?(i=0,e=Math.abs(t)):(i=Math.abs(t),e=Math.abs(s)),!(r>=i&&r<=e)&&this.norm(r>e?e:i),this}clone(){return new t(...this.v)}copy(){return this.clone()}dist(t=null){if(null==t)return this.norm();{let s=0,e=t.v;for(let t=0,i=this.v.length;t<i;t++)s+=(this.v[t]-e[t])*(this.v[t]-e[t]);return Math.sqrt(s)}}static dist(t,s){return t.dist(s)}rad(t=null){let s=this.v[0],e=this.v[1],i=Math.atan(e/s);return i=s>=0?e>=0?i:2*Math.PI+i:Math.PI+i,t?i-t.rad():i}static rad(t,s){return t.rad(s)}toint(){for(let t=0,s=this.v.length;t<s;t++)this.v[t]=parseInt(this.v[t])}in(t=[]){for(let s=0,e=t.length;s<e;s++)if(!(this.v[s]>=t[s][0]&&this.v[s]<=t[s][1]))return!1;return!0}static in(t,s){return t.in(s)}static vpoints(s){let e=[];for(let i=0,r=s.length;i<r;i++)e.push(new t(...s[i]));return e}};var s=Object.freeze({__proto__:null,Vector:t});class e{constructor(s,e){this.p=s||new t(0,0),this.v=e||new t(0,0)}action(){return this.p.add(this.v)}isEnd(){return!1}}class i extends e{static RuleSet={alignment:(s,e)=>{let i=new t(0,0);for(let t=0,s=e.length;t<s;t++)i.add(e[t].v);return i.mult(1/e.length)},separation:(s,e)=>{let i=new t(0,0);for(let r=0,h=e.length;r<h;r++){let h=s.p.dist(e[r].p);i.add(t.sub(s.p,e[r].p).norm(1/h*h))}return i},cohesion:(s,e)=>{let i=new t(0,0);for(let t=0,s=e.length;t<s;t++)i.add(e[t].p);return i.mult(1/e.length),t.sub(i,s.p)}};constructor(s,e,r,h){super(s,e),this.R=r,this.K=h,this.visual_field=(t,s)=>s,this.rules=[i.RuleSet.alignment,i.RuleSet.separation,i.RuleSet.cohesion],this.acc=new t(0,0)}rules_action(s){if(0==s.length)return;s=this.visual_field(this,s);let e=[];for(let t=0,i=this.rules.length;t<i;t++)e[t]=this.rules[t](this,s);this.acc.add(t.LC(e,this.K))}action(){return this.p.add(this.v.add(this.acc)),this.acc=new t(0,0),this.p}}var r=Object.freeze({__proto__:null,Boid:i,boids_middlewares:function(t){return function(s){t.build(s);for(let e=s.length;e--;)s[e].rules_action(t.near(s[e],s[e].R))}}});class h{constructor(t,s){this.r=t,this.i=s}add(t){return this.r+=t.r,this.i+=t.i,this}mult(t){let s=this.r,e=this.i,i=t.r,r=t.i;return this.r=s*i-e*r,this.i=e*i+s*r,this}norm(){return Math.sqrt(this.r*this.r+this.i*this.i)}}class n{constructor(t,s){this.vect=s||function(t){return t},this.ps=t,this.IS_LOOP_BORDER=!1}build(t=null){return this.ps=t||this.ps,this}near(t,s){return[]}k_near(t,s){return[]}nps(t,s="dist"){let e=("dist"==s?this.near:this.k_near).bind(this),i=[];for(let s=0,r=this.ps.length;s<r;s++){let r=e(this.ps[s],t);r.length>0&&i.push({tp:this.ps[s],nps:r})}return i}static toGraph(t){}}class l extends n{constructor(t,s){super(t,s)}near(t,s,e=null){e=e||this.ps;let i=this.vect(t),r=[];for(let h=0,n=e.length;h<n;h++)t!==e[h]&&i.dist(this.vect(e[h]))<=s&&r.push(e[h]);return r}k_near(t,s,e=null){e=e||this.ps;let i=this.vect(t),r=[];for(let h=0,n=e.length;h<n;h++){if(t===e[h])continue;let n=i.dist(this.vect(e[h]));if(0!=r.length){if(n<r[r.length-1].dist||r.length<s){for(let t=r.length-1;t>=0;t--){if(n>=r[t].dist){r.splice(t+1,0,{dist:n,p:e[h]});break}0==t&&r.splice(0,0,{dist:n,p:e[h]})}r.length>s&&r.pop()}}else r.push({dist:n,p:e[h]})}let h=[];for(let t=0;t<r.length;t++)h.push(r[t].p);return h}}class o extends l{constructor(t,s,e=100,i=null){super(t,s),this.dn=e,this.dsr=i,this.dst=null,this.size=null,this.grid=null}static GridContainer(s,e){return new class{constructor(t,s){this.dn=t,this.size=s,this.dsize=[],this.length=1;for(let t=this.size.length;t--;){let s=Math.ceil(this.size[t]/this.dn)+1;this.length*=s,this.dsize[t]=s}this._data=new Array(this.length),this._cache_ds=null,this._cache_gns=this.gns(this.dsize.length,1)}toGrid(s){let e=[];for(let t=0,i=s.dim();t<i;t++)e[t]=Math.ceil(s.v[t]/this.dn);return new t(...e)}index(t){if(!this._cache_ds){this._cache_ds=[1];for(let t=0,s=this.dsize.length-1,e=1;t<s;t++)e*=this.dsize[t],this._cache_ds.push(e)}let s=0;for(let e=t.dim();e--;)s+=this._cache_ds[e]*t.v[e];return s}gns(t,s=1){let e=function(t,s){let e=[];for(let i=0,r=t.length;i<r;i++)for(let r=0,h=s.length;r<h;r++)e.push([...t[i],...s[r]]);return e},i=[];for(let t=-s;t<=s;t++)i.push([t]);let r=i;for(let s=0;s<t-1;s++)r=e(r,i);return r}set(t,s){let e=this.index(this.toGrid(t));return!(e<0||e>this.length)&&(this._data[e]?this._data[e].push(s):this._data[e]=[s],!0)}get(s,e=0){let i=this.toGrid(s);if(e<=0)return this._data[this.index(i)]||[];let r=1==e?this._cache_gns:this.gns(s.dim(),e),h=[];for(let s=0,e=r.length;s<e;s++){let e=this.index(new t(...r[s]).add(i));h=[...h,...this._data[e]||[]]}return h}}(s,e)}build(s=null){if(this.ps=s||this.ps,null==this.dsr){let t=this.vect(this.ps[0]).clone(),s=t.clone();for(let e=1,i=this.ps.length;e<i;e++){let i=this.vect(this.ps[e]);for(let e=0,r=i.v.length;e<r;e++)t.v[e]<i.v[e]&&(t.v[e]=i.v[e]),s.v[e]>i.v[e]&&(s.v[e]=i.v[e])}this.dsr=[];for(let e=0;e<s.v.length;e++)this.dsr[e]=[s.v[e],t.v[e]]}this.size=[],this.dst=[];for(let t=0,s=this.dsr.length;t<s;t++)this.size[t]=this.dsr[t][1]-this.dsr[t][0],this.dst[t]=this.dsr[t][0]<0?-this.dsr[t][0]:0;this.dst=new t(...this.dst),this.grid=o.GridContainer(this.dn,this.size);for(let t=0,s=this.ps.length;t<s;t++)this.grid.set(this.vect(this.ps[t]).clone().add(this.dst),this.ps[t]);return this}near(t,s){let e=Math.ceil(s/this.dn),i=this.grid.get(this.vect(t).clone().add(this.dst),e);return super.near(t,s,i)}k_near(t,s){let e=Math.max(...this.grid.dsize),i=1,r=[];for(;r.length<s&&i<=e;)r=this.grid.get(this.vect(t).clone().add(this.dst),i++);return r=this.grid.get(this.vect(t).clone().add(this.dst),Math.min(i+1,e)),super.k_near(t,s,r)}}var a=Object.freeze({__proto__:null,GridNNS:o,KDTreeNNS:class extends n{},LinearNNS:l,NearestNeighborSearch:n});class c extends e{constructor(t,s,e="min"){super(),this.tfunc=t,this.dod=[],this.val_type=e,this.p=s,this.val="min"==this.val_type?1/0:-1/0,this.vs=[],this._END=!1}action(){if(!this._END){let s=!0;for(let e=0,i=this.vs.length;e<i;e++){let i=t.add(this.p,this.vs[e]),r=this.tfunc(i);("min"==this.val_type&&r<=this.val||"max"==this.val_type&&val>=this.val)&&(this.val=r,this.p=i,s=!1),i.in(this.dod)||(s=!0)}this._END=s}return this.p}isEnd(){return this._END}}var d=Object.freeze({__proto__:null,Complex:h,Julia_Set:function(t,s,e=500){let i=t;for(let t=0;t<=e;t++)if(i=i.mult(i).add(s),i.norm()>2)return[!1,t];return[!0,e]},LSystem:class{constructor({S:t="",V:s=[],P:e={},ops:i={}}={}){this.S=t,this.V=s,this.P=e,this.ops=i}next(t=this.S){let s="";for(let e=0,i=t.length;e<i;e++)s+=t[e]in this.P?this.P[t[e]]:t[e];return s}gen(t=0){let s=this.S;for(let e=0;e<t;e++)s=this.next(s);return s}*iter(t=0){let s=this.S;for(let e=0;e<t;e++)s=this.next(s),yield s}act(t,s){for(let e=0,i=t.length;e<i;e++)t[e]in this.ops&&this.ops[t[e]](s);return s}*actIter(t,s){for(let e=0,i=t.length;e<i;e++)yield t[e]in this.ops&&this.ops[t[e]](s)}},Mandelbrot_Set:function(t,s=500){let e=new h(0,0);for(let i=0;i<=s;i++)if(e=e.mult(e).add(t),e.norm()>2)return[!1,i];return[!0,s]},NNS:a,OptimumSolutionSolvers:class{constructor(){this.n=30,this.solvers=[],this.count=1/0,this.tfunc=null,this.dod=[],this.vs=null,this.vsd=1,this.val_type="min",this.os_p=null,this.os_val=null,this._END=!1}init(){this.os_val="min"==this.val_type?1/0:-1/0,null==this.vs&&(this.vs=[new t(-1,-1).norm(this.vsd),new t(0,-1).norm(this.vsd),new t(1,-1).norm(this.vsd),new t(-1,0).norm(this.vsd),new t(1,0).norm(this.vsd),new t(-1,1).norm(this.vsd),new t(0,1).norm(this.vsd),new t(1,1).norm(this.vsd)]);for(let s=0;s<this.n;s++){let s=new c(this.tfunc,t.random(this.dod),this.val_type);s.dod=this.dod,s.vs=this.vs,this.solvers.push(s)}}next(){if(this._END||this.count<0)return this._END=!0,this.os_p;let t=!0;for(let s=0,e=this.solvers.length;s<e;s++)this.solvers[s].action(),t&=this.solvers[s].isEnd(),("min"==this.val_type&&this.solvers[s].val<=this.os_val||"max"==this.val_type&&this.solvers[s].val>=this.os_val)&&(this.os_val=this.solvers[s].val,this.os_p=this.solvers[s].p);return this._END=t,this.count--,this.os_p}isEnd(){return this._END}},boids:r});class u{constructor(t,s,e,i="rgb(50, 50, 50)"){this.canvas=document.getElementById(t),this._width=this.canvas.width=s||window.screen.width,this._height=this.canvas.height=e||window.screen.height,this._cx=parseInt(this._width/2),this._cy=parseInt(this._height/2),this.ctx=this.canvas.getContext("2d"),this.BGC=i,this.POINT={R:2,C:"#FFFFFF"},this.refresh()}get width(){return this._width}set width(t){this._width=this.canvas.width=t,this._cx=parseInt(this._width/2),this.refresh()}get height(){return this._height}set height(t){this._height=this.canvas.height=t,this._cy=parseInt(this._height/2),this.refresh()}get cx(){return this._cx}get cy(){return this._cy}set colorStyle(t){this.ctx.strokeStyle=this.ctx.fillStyle=t}resize(t,s){this.width=parseInt(t)||window.screen.width,this.height=parseInt(s)||window.screen.height}refresh(t){this.ctx.fillStyle=t||this.BGC,this.ctx.fillRect(0,0,this._width,this._height)}point(t,s,e=null,i=null){"number"!=typeof arguments[0]&&(t=arguments[0].x,s=arguments[0].y),this.ctx.strokeStyle=this.ctx.fillStyle=e||this.POINT.C,this.ctx.beginPath(),this.ctx.arc(t,s,i||this.POINT.R,0,2*Math.PI),this.ctx.stroke(),this.POINT.R>1&&this.ctx.fill()}line(t,s,e,i){"number"!=typeof arguments[0]&&(t=arguments[0].x,s=arguments[0].y,e=arguments[1].x,i=arguments[1].y),this.ctx.beginPath(),this.ctx.moveTo(t,s),this.ctx.lineTo(e,i),this.ctx.stroke()}lines(t,s="rgb(255, 255, 255)",e=!1){let i=null!=t[0].x,r=null!=s.color;for(let h=0,n=t.length,l=e?n:n-1;h<l;h++)this.ctx.beginPath(),this.ctx.strokeStyle=r?s.color():s,i?(this.ctx.moveTo(t[h].x,t[h].y),this.ctx.lineTo(t[(h+1)%n].x,t[(h+1)%n].y)):(this.ctx.moveTo(t[h][0],t[h][1]),this.ctx.lineTo(t[(h+1)%n][0],t[(h+1)%n][1])),this.ctx.stroke()}circle(t,s,e,i=null){i&&(this.ctx.strokeStyle=this.ctx.fillStyle=i),this.ctx.beginPath(),this.ctx.arc(t,s,e,0,2*Math.PI),this.ctx.stroke(),i&&this.ctx.fill()}rect(t,s,e,i){this.ctx.beginPath(),this.ctx.rect(t-e,s-i,2*e,2*i),this.ctx.stroke()}}var p=Object.freeze({__proto__:null,Canvas:u});class _{in(t){return!0}}var v=Object.freeze({__proto__:null,Area:class extends _{constructor(t,s=!1){super(),this.vps=t,this.offset=Math.PI/180*5,this.reverse=s}in(s){s=s.v?s:new t(...s);let e=0,i=this.vps.length;for(let r=0;r<i;r++){let h=Math.abs(t.rad(t.sub(this.vps[r%i],s),t.sub(this.vps[(r+1)%i],s)));e+=h>Math.PI?2*Math.PI-h:h}return this.reverse^e>2*Math.PI-this.offset&&e<2*Math.PI+this.offset}},BaseArea:_,CircleArea:class extends _{constructor(t,s,e=!1){super(),this.po=t,this.r=s,this.reverse=e}in(s){return s=s.v?s:new t(...s),this.reverse^s.dist(this.po)<this.r}},RectArea:class extends _{constructor(t,s=!1){super(),this.borders=t,this.reverse=s}in(s){s=s.v?s:new t(...s);for(let t=0,e=this.borders.length;t<e;t++)if(s.v[t]<this.borders[t][0]||s.v[t]>this.borders[t][1])return!1^this.reverse;return!0^this.reverse}}});class f{limit(t,s=0){return t}}var g=Object.freeze({__proto__:null,Border:f,RectLoopBorder:class extends f{constructor(t){super(),this.borders=t||[]}limit(t,s=0){for(let e=0;e<this.borders.length;e++)t.p.v[e]-s<=this.borders[e][0]?t.p.v[e]=this.borders[e][1]-s:t.p.v[e]+s>=this.borders[e][1]&&(t.p.v[e]=this.borders[e][0]+s);return t}},RectReflectBorder:class extends f{constructor(t,s=!0){super(),this.borders=t||[],this.on_line=s}limit(t,s=0){for(let e=0;e<this.borders.length;e++)t.p.v[e]-s<=this.borders[e][0]&&(this.on_line&&(t.p.v[e]=this.borders[e][0]+s),t.v.v[e]=-t.v.v[e]),t.p.v[e]+s>=this.borders[e][1]&&(this.on_line&&(t.p.v[e]=this.borders[e][1]-s),t.v.v[e]=-t.v.v[e]);return t}},RingLoopBorder:class extends f{constructor(t,s){super(),this.po=t,this.r=s}limit(t,s=0){if(this.po.dist(t.p)+s>this.r){let e=Vector.sub(this.po,t.p).normalization();t.p=Vector.add(this.po,e.clone().mult(this.r-s))}return t}},RingReflectBorder:class extends f{constructor(t,s){super(),this.po=t,this.r=s}limit(t,s=0){if(this.po.dist(t.p)+s>this.r){let e=Vector.sub(this.po,t.p).normalization();t.p=Vector.add(this.po,e.clone().mult(-(this.r-s))),t.v=Vector.sub(t.v,e.clone().mult(2*e.dot(t.v)))}return t}}});class x{to(t){return t}from(t){return t}}var m=Object.freeze({__proto__:null,CoordinateSystem:x,Grid:class extends x{constructor(t,s=1,e=1,i=!1){super(),this.co=t,this._dx=s,this._dy=e,this._RY=i?-1:1}get dx(){return this._dx}set dx(t){if(t<1)throw Error(`dx(${t}) must be in [1, Inf)`);this._dx=Math.round(t)}get dy(){return this._dy}set dy(t){if(t<1)throw Error(`dy(${t}) must be in [1, Inf)`);this._dy=Math.round(t)}get RY(){return-1==this._RY}set RY(t){this._RY=t?-1:1}to(s){let e=Math.round(((s.v?s.v[0]:s[0])-this.co.x)/this.dx),i=Math.round(((s.v?s.y:s[1])-this.co.y)/this.dy)*this._RY;return s.v?t.v(e,i):[e,i]}from(s){let e=this.dx*(s.v?s.x:s[0])+this.co.x,i=this.dy*(s.v?s.y:s[1])*this._RY+this.co.y;return s.v?t.v(e,i):[e,i]}},PolarCS:class extends x{constructor(t){super(),this.co=t}to(s){let e=(s.v?s:new t(...s)).sub(this.co),i=e.dist(),r=e.rad();return s.v?t.v(i,r):[i,r]}from(s){let e=s.v?s.x:s[0],i=s.v?s.y:s[1],r=e*Math.sin(i)+this.co.x,h=e*Math.cos(i)+this.co.y;return s.v?t.v(r,h):[r,h]}},RCS:class extends x{constructor(t,s=1){super(),this._co=t,this._scale=s}get scale(){return this._scale}set scale(t){if(t<=0)throw Error(`scale(${t}) must be in (0, Inf)`);this._scale=t}get co(){return this._co.clone()}to(s){let e=((s.v?s.x:s[0])-this._co.x)*this._scale,i=-1*((s.v?s.y:s[1])-this._co.y)*this._scale;return s.v?t.v(e,i):[e,i]}from(s){let e=(s.v?s.x:s[0])/this._scale+this._co.x,i=-1*(s.v?s.y:s[1])/this._scale+this._co.y;return s.v?t.v(e,i):[e,i]}zoom(t){return t>0?this.scale/=Math.abs(t):this.scale*=Math.abs(t),this}move(s){return this._co.add(s.v?s:t.v(...s)),this}}});class b{constructor(t){this.area=t||new _}force(t){}}class y extends b{static G=.01;constructor(s,e=1){super(),this.gp=s||new t(0,0),this.mass=e,this.G=y.G}force(s){if(this.area.in(s.p)){let e=this.gp.dist(s.p),i=t.sub(this.gp,s.p).norm(this.G*(this.mass*s.mass)/e*e);s.force(i)}}static gravity(s,e){let i=t.dist(s.p,e.p),r=y.G*(s.mass*e.mass)/i*i;s.force(t.sub(e.p,s.p).norm(r)),e.force(t.sub(s.p,e.p).norm(r))}}var w=Object.freeze({__proto__:null,AccelerateField:class extends b{constructor(t,s){super(s),this.A=t}force(t){t.force(this.A)}},DecelerateField:class extends b{constructor(t,s){super(s),this._D=-Math.abs(t||.015)}get D(){return this._D}set D(t){this._D=-Math.abs(t)}force(t){this.area.in(t.p)&&t.force(t.v.clone().norm(this.D*t.v.norm()*t.mass))}},DeflectField:class extends b{constructor(t,s){super(s),this.W=t||.017}force(s){this.area.in(s.p)&&s.force(t.sub(s.v.clone().rotate(this.W),s.v))}},Field:b,Gravity:y});class M{constructor(t,{max_pn:s=500,gen_pn:e=1,GENR:i=!1,DSTR:r=!0}={}){this.ps=[],this.particle_builder=t,this.action_middlewares={before:[],after:[]},this.max_pn=s,this.gen_pn=e,this.GENR=i,this.DSTR=r}build(t=0){this.ps=[];for(let s=t<this.max_pn?t:this.max_pn;s--;)this.ps.push(this.particle_builder());return this}particle_action(){let t=[];for(let s=0,e=this.ps.length;s<e;s++)this.ps[s].isEnd()?!this.DSTR&&t.push(this.ps[s]):(this.ps[s].action(),t.push(this.ps[s]));if(this.GENR){let s=this.max_pn-t.length;for(let e=s>=this.gen_pn?this.gen_pn:s;e>0;e--)t.push(this.particle_builder())}this.ps=t}action(){for(let t=0,s=this.action_middlewares.before.length;t<s;t++)this.action_middlewares.before[t](this.ps);this.particle_action();for(let t=0,s=this.action_middlewares.after.length;t<s;t++)this.action_middlewares.after[t](this.ps)}}var I=Object.freeze({__proto__:null,CircularMotorParticle:class extends e{constructor(s,e=1,i=Math.PI/180,r=0){super(),this.o=s||new t(0,0),this.r=e,this.w=i,this.rad=r,this.po=new t(this.r*Math.sin(this.rad),this.r*Math.cos(this.rad)),this.p=t.add(this.po,this.o)}action(){return this._p=this.p.clone(),this.rad+=this.w,this.rad>=2*Math.PI&&(this.rad-=2*Math.PI),this.rad<=-2*Math.PI&&(this.rad+=2*Math.PI),this.po.x=this.r*Math.sin(this.rad),this.po.y=this.r*Math.cos(this.rad),this.p=t.add(this.po,this.o),this.v=this.p.clone().sub(this._p),this.p}},ForceParticle:class extends e{constructor(s,e,i,r){super(),this.p=s||new t(0,0),this.v=e||new t(0,0),this.acc=i||new t(0,0),this.mass=r||1}force(t){this.acc.add(t.clone().mult(1/this.mass))}action(){return this.p.add(this.v.add(this.acc)),this.acc=new t(0,0),this.p}},LinearMotorParticle:class extends e{constructor(s,e,i=1){super(),this._ps=s,this._pe=e,this.p=this._ps.clone(),this.v=t.sub(this._pe,this._ps).norm(Math.abs(i)),this.mode="line",this.end_dist_rate=1.2}get ps(){return this._ps.clone()}get pe(){return this._pe.clone()}set pe(s){this._pe=s.clone(),this.v=t.sub(this._pe,this.p).norm(this.v.norm())}set v_rate(t){this.v.norm(t)}set v_count(s){this.v.norm(t.dist(this._pe,this._ps)/s)}isEnd(){return this.p.dist(this._pe)<=this.v.norm()*this.end_dist_rate}action(){if(this.isEnd())switch(this.mode){case"loop":this.p=this._ps.clone();break;case"back":this.p=this._pe.clone(),this._pe=this._ps.clone(),this._ps=this.p.clone(),this.v.mult(-1);break;default:this.p=this._pe.clone()}else this.p.add(this.v);return this.p}},Particle:e,ParticleSystem:M,RandomWalkerParticle:class extends e{constructor(t,s){super(),this.p=t,this._rvs=this._probability(s)}_probability(s){let e=0;for(let t=0,i=s.length;t<i;t++)e+=s[t][1];let i=[],r=0;for(let h=0,n=s.length;h<n;h++){let n=(s[h][1]||0)/e;i.push({v:s[h][0]||new t(0,0),p:n,ps:r,pe:r+n}),r+=n}return i}rv_select(){let t=Math.random();for(let s=0,e=this._rvs.length;s<e;s++)if(t>this._rvs[s].ps&&t<=this._rvs[s].pe)return this._rvs[s].v}action(){return this.v=this.rv_select(),this.p.add(this.v)}},TrailTracker:class{constructor(t,s=10){this.tp=t,this.tn=s,this.trail=[],this._bind()}_bind(){this.trail=[this.tp.p.clone()];let t=this;this.tp._tracker_hook_action=this.tp.action,this.tp.action=function(){let s=this._tracker_hook_action(...arguments);return t.trail.length>=t.tn&&t.trail.shift(),t.trail.push(s.clone()),s}}},area:v,border:g,coor:m,field:w});class R{constructor(t){this._val=t}val(){return this._val}end(){return!1}tolist(t=500){let s=[];for(let e=0;e<t&&(s.push(this.val()),!this.end());e++);return s}}class S extends R{constructor(t,s,e=1){super(t),this._start=t,this._end=s,this._step=t<s?Math.abs(e):-Math.abs(e)}static S(t,s,e=1){return new S(t,s,e)}static N(t,s,e){return new S(t,s,(s-t)/e)}val(){let t=this._val;return this.end()?this._val=this._end:this._val+=this._step,t}end(){return this._step>0?this._val>this._end:this._val<this._end}clone(){return new S(this._start,this._end,this._step)}}var P=Object.freeze({__proto__:null,FuncIterator:class extends R{constructor(t,s){super(),this.fx=t,this.dod=s.val?s:S.S(...s)}val(t=!1){let s=this.dod.val();return t?[s,this.fx(s)]:this.fx(s)}end(){return this.dod.end()}},Iterator:R,Range:S});class k{static regular_polygon(t,s,e,i=0){e=e||[0,0];let r=2*Math.PI/t,h=[];for(let n=0;n<t;n++)h.push([s*Math.cos(i)+e[0],s*Math.sin(i)+e[1]]),i+=r;return h}static RP(t,s,e,i=0){return k.regular_polygon(t,s,e,i)}static ATR(t){return Math.PI/180*t}static RTA(t){return 180/Math.PI*t}static random(t,s){return(s-t)*Math.random()+t}static rselect(t){return t[parseInt(t.length*Math.random())]}static RGB(t){return`rgb(${t[0]||0}, ${t[1]||0}, ${t[2]||0}, ${t[3]||1})`}}var C=Object.freeze({__proto__:null,RandomSelector:class{constructor(t){this._ops=this._probability(t)}_probability(t){let s=0;for(let e=0,i=t.length;e<i;e++)s+=t[e][1]||0;let e=[],i=0;for(let r=0,h=t.length;r<h;r++){let h=(t[r][1]||0)/s;e.push({op:t[r][0],p:h,ps:i,pe:i+h}),i+=h}return e}select(){let t=Math.random();for(let s=0,e=this._ops.length;s<e;s++)if(t>this._ops[s].ps&&t<=this._ops[s].pe)return this._ops[s].op}},Tools:k,iter:P});class z{constructor(t,s){this.canvasObj=t,this.fileTitle=s||document.getElementsByTagName("title")[0].innerText.replace(/\s+/g,""),this.fn=0,this._capture_keyCode="Q".charCodeAt()}get captureKey(){return String.fromCharCode(this._capture_keyCode)}set captureKey(t){return this._capture_keyCode=t.charCodeAt(),this}capturing(){let t=this;return window.addEventListener("keydown",(function(s){s.keyCode==t._capture_keyCode&&t.capture()})),this}capture(t){t=t||`${this.fileTitle}_${this.fn++}`,this.canvasObj.canvas.toBlob((s=>{let e=document.createElement("a");e.style.display="none",e.id=t,e.href=window.URL.createObjectURL(s),e.download=`${t}.png`,e.click()}))}}class E extends t{constructor(t=0,s=0,e=0,i=1){super(),this.v=1==i?[t,s,e]:[t,s,e,i]}get r(){return this.v[0]}get g(){return this.v[1]}get b(){return this.v[2]}get a(){return this.v[3]}set r(t){this.v[0]=t}set g(t){this.v[1]=t}set b(t){this.v[2]=t}set a(t){this.v[3]=t}color(t=!1){return this.v.length<=3?t?[this.v[0],this.v[1],this.v[2]]:`rgb(${this.v[0]}, ${this.v[1]}, ${this.v[2]})`:t?[this.v[0],this.v[1],this.v[2],this.v[3]]:`rgb(${this.v[0]}, ${this.v[1]}, ${this.v[2]})`}val(t=!1){return this.color(t)}clone(){return new E(...this.v)}}class N{constructor(s,e,i){this.scv=new E(...s),this.ecv=new E(...e),this.cv=this.scv.clone(),this.n=i,this._count=i,this._dcv=t.sub(this.ecv,this.scv).norm(t.dist(this.ecv,this.scv)/i)}color(t=!1){let s=this.cv.color(t);return this._count>0&&this.cv.add(this._dcv),this._count--,s}val(t=!1){return this.color(t)}isEnd(){return!(this._count>0)}}class ${constructor(t=60){this._ft=0,this.fps=t}get ft(){return this._ft}render(){this._ft++}}var O=Object.freeze({__proto__:null,IntervalRenderer:class extends ${constructor(t=60){super(t),this._stop_ftp=1/0,this._timer=null,this.render_func=null}render(t){return this.render_func=t,this._timer=setInterval((()=>{this._ft<this._stop_ftp?this.render_func(this._ft++):clearInterval(this._timer)}),Math.ceil(1e3/this.fps)),this}stop(t){return this._stop_ftp=t,this}},SingleFrameRenderer:class extends ${constructor(t=1){super(1),this.act_ft_n=t,this.act_func=null,this.draw_func=null,this._render_keyCode=" ".charCodeAt()}get renderKey(){return String.fromCharCode(this._render_keyCode)}set renderKey(t){this._render_keyCode=t.charCodeAt()}render(t,s){this.act_func=t,this.draw_func=s;let e=this;return window.addEventListener("keydown",(function(t){if(t.keyCode==e._render_keyCode){for(let t=0;t<e.act_ft_n;t++)e.act_func(e._ft++);e.draw_func&&e.draw_func(e._ft)}})),this}}});class T{context=null;static nodelink(t,s=[0,100],e=[255,255,255]){let i="number"==typeof s?[0,s]:s,r=i[1]-i[0],h=e.color?e:new E(...e);for(let s=0,e=t.length;s<e;s++){let n=h.color(!0);for(let h=s;h<e;h++){let e=t[s].p.dist(t[h].p);e>=i[0]&&e<=i[1]&&(T.context.ctx.strokeStyle=`rgb(${n[0]}, ${n[1]}, ${n[2]}, ${1-e/r})`,T.context.line(t[s].p,t[h].p))}}}static grid({co:s,dx:e,dy:i,xR:r,yR:h,color:n=[255,255,255],center:l=!0}){s=s||new t(T.context.cx,T.context.cy),i=i||e;let o=(r=r||[-parseInt(T.context.cx/e)-1,parseInt(T.context.cx/e)+1])[0]*e+s.x,a=r[1]*e+s.x,c=(h=h||[-parseInt(T.context.cy/i)-1,parseInt(T.context.cy/i)+1])[0]*i+s.y,d=h[1]*i+s.y,u=l?0:e/2,p=l?0:i/2;T.context.ctx.strokeStyle=`rgb(${n[0]}, ${n[1]}, ${n[2]}, ${n[3]||.25})`;for(let t=r[0],i=r[1];t<=i;t++){let i=t*e+s.x+u;T.context.line(i,c,i,d)}for(let t=h[0],e=h[1];t<=e;t++){let e=t*i+s.y+p;T.context.line(o,e,a,e)}}static lightLine(t,{Lfx:s,n:e=10,d:i=3,cs:r=[255,255,255],ce:h=[0,0,0]}={}){let n=(s=s||(t=>1/(t+1e-4)))(1),l=s(e);T.context.ctx.lineCap="round";for(let o=e;o>0;o--){let e=(s(o)-l)/(n-l),a=[(r[0]-h[0])*e+h[0],(r[1]-h[1])*e+h[1],(r[2]-h[2])*e+h[2]];T.context.ctx.lineWidth=o*i,T.context.lines(t,new N(a,h,t.length))}}static lightRing(t,s,e,{Lfx:i,n:r=50,cs:h=[255,255,255],ce:n=[0,0,0],point:l=!1}={}){i=i||(t=>1/(t+1e-4));let o=i(1),a=i(r),c=e/r;for(let e=r;e>0;e--){let d=(i(l?e:r-e)-a)/(o-a),u=[(h[0]-n[0])*d+n[0],(h[1]-n[1])*d+n[1],(h[2]-n[2])*d+n[2]];T.context.colorStyle=`rgb(${u[0]}, ${u[1]}, ${u[2]})`,T.context.circle(t,s,c*e),T.context.ctx.fill()}}static trail(t,{split_x:s=100,split_y:e=100,color:i="rgb(255, 255, 255)"}={}){let r=[[]];for(let i=0,h=t.length-1;i<h;i++)r[r.length-1].push(t[i]),Math.abs(t[i].x-t[i+1].x)>s|Math.abs(t[i].y-t[i+1].y)>e&&r.push([]);for(let t=0,s=r.length;t<s;t++)r[t].length<=1||T.context.lines(r[t],i)}}var D=Object.freeze({__proto__:null,Capturer:z,ColorGradient:N,ColorVector:E,Views:T,renderer:O});export{u as Canvas,z as Capturer,e as Particle,M as ParticleSystem,k as Tools,t as Vector,T as Views,d as algo,p as context,I as particle,O as renderer,C as utils,s as vector,D as views};