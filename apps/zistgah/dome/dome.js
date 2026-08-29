/* zistgah-dome — THE Zistgah virtual dome as a reusable app/lib (v0.2 of the lib).
   VERBATIM from zistgah/zistgah.github.io index.html with marked, counted modifications:
   ZDOME-SEAM (config surface incl. dome.config.json loader, worlds, spawn, displays,
   gallery, videos, content), FLIGHT-MOD (altitude hold default + gravity toggle, slow/
   configurable yaw-pitch-roll sensitivity, thrust-vectored roll, 10 Hz drone emitter),
   WORLD-MOD (worlds group turns with the hall; escape bakes the yaw; per-world gravity;
   orbital-station bodies; chakra dial + oculus jewels ride the hall), UI-MOD (debug
   overlay, display hit registry), STAR-MOD (deep star shell), ZDOME-BUILTIN-DISPLAYS
   (pointcloud after ilm.codes/explore · viewer's gallery · YouTube screens).
   Extracted from the live FAKIR page so lib and page cannot drift.
   Docs: docs/ · Canonical home: github.com/zistgah/dome
   (c) 1993-2026 Abhishek Choudhary. All rights reserved. AyeAI. Claude Fable 5. */

/*DOME7-BEGIN  diagrid shell + clustered-column arcade — pure, tested ----------*/
function domePoint(v,th,R,phi0,phi1){
  const phi=phi0+(phi1-phi0)*v, s=Math.sin(phi), c=Math.cos(phi);
  return [R*s*Math.cos(th), R*c, R*s*Math.sin(th)];
}
function makeDome(R){
  const phi0=Math.asin(0.17), phi1=78*Math.PI/180;
  const NR=14, M=30, TW=0.5;
  const P=(i,j)=>domePoint(i/NR, ((j+(i%2)*TW)%M)/M*2*Math.PI, R,phi0,phi1);
  const minor=[],major=[],seg=(A,a,b)=>A.push(a[0],a[1],a[2],b[0],b[1],b[2]);
  for(let i=0;i<NR;i++)for(let j=0;j<M;j++){
    const a=P(i,j), dl=P(i+1, i%2? j : j-1+M), dr=P(i+1, i%2? j+1 : j);
    const A=(j%4===0)?major:minor; seg(A,a,dl); seg(A,a,dr);
  }
  const rings=[];const ring=(v,n)=>{for(let k=0;k<n;k++){
    seg(rings,domePoint(v,k/n*6.28318,R,phi0,phi1),domePoint(v,(k+1)/n*6.28318,R,phi0,phi1))}};
  ring(0,64);ring(0.34,64);ring(0.67,64);ring(1,64);
  const arcade=[], rimR=R*Math.sin(phi1), botY=R*Math.cos(phi1);
  const bez=(p0,p1,p2,n)=>{const pts=[];for(let q=0;q<=n;q++){const t=q/n,u=1-t;
    pts.push([u*u*p0[0]+2*u*t*p1[0]+t*t*p2[0], u*u*p0[1]+2*u*t*p1[1]+t*t*p2[1],
              u*u*p0[2]+2*u*t*p1[2]+t*t*p2[2]])}return pts};
  const poly=(pts)=>{for(let q=0;q<pts.length-1;q++)seg(arcade,pts[q],pts[q+1])};
  const circleAt=(cx,cy,cz,r,n)=>{for(let k=0;k<n;k++){
    const a=k/n*6.28318,b=(k+1)/n*6.28318;
    seg(arcade,[cx+r*Math.cos(a),cy,cz+r*Math.sin(a)],[cx+r*Math.cos(b),cy,cz+r*Math.sin(b)])}};
  // every other azimuth midpoint carries one intricate column
  for(let j=0;j<M;j+=2){
    const thG=((j+0.5+TW)%M)/M*2*Math.PI;
    const bx=rimR*1.05*Math.cos(thG), bz=rimR*1.05*Math.sin(thG);
    const capY=botY*0.55;
    // clustered shafts: four slender verticals around the column axis
    for(let s2=0;s2<4;s2++){
      const sa=s2/4*6.28318+0.4, sr=0.10;
      const sx=bx+sr*Math.cos(sa), sz=bz+sr*Math.sin(sa);
      seg(arcade,[sx,0,sz],[sx,capY,sz]);
    }
    // base plinth + astragal + capital rings
    circleAt(bx,0.02,bz,0.20,10); circleAt(bx,0.14,bz,0.15,10);
    circleAt(bx,capY,bz,0.16,10); circleAt(bx,capY+0.12,bz,0.22,10);
    // twin gothic branches from the capital to the two adjacent shell nodes
    const n0=P(NR,j), n1=P(NR,(j+1)%M);
    for(const node of [n0,n1]){
      const ctrl=[(bx+node[0])/2*1.08, capY+(node[1]-capY)*0.55, (bz+node[2])/2*1.08];
      poly(bez([bx,capY+0.12,bz],ctrl,node,8));
      // inner counter-cusp: a second, tighter curve — the ornamental layer
      const ctrl2=[(bx+node[0])/2*0.99, capY+(node[1]-capY)*0.34, (bz+node[2])/2*0.99];
      poly(bez([bx,capY+0.12,bz],ctrl2,node,8));
    }
    // finial spike above the capital
    seg(arcade,[bx,capY+0.12,bz],[bx,capY+0.55,bz]);
  }
  const floor=[];
  for(const fr of [0.25,0.5,0.75,1.0]){
    for(let k=0;k<72;k++){const a=k/72*6.28318,b=(k+1)/72*6.28318,r=fr*R*0.92;
      floor.push(r*Math.cos(a),0.02,r*Math.sin(a), r*Math.cos(b),0.02,r*Math.sin(b))}}
  for(let k=0;k<12;k++){const a=k/12*6.28318;
    floor.push(0.6*Math.cos(a),0.02,0.6*Math.sin(a), R*0.92*Math.cos(a),0.02,R*0.92*Math.sin(a))}
  const F=x=>Float32Array.from(x);
  return {minor:F(minor),major:F(major),rings:F(rings),arcade:F(arcade),floor:F(floor),
          phi0,phi1,ocuY:R*Math.cos(phi0),ocuR:R*Math.sin(phi0),shellBottomY:botY,
          pedestals:[[-4.6,2.7],[-1.7,3.4],[1.7,3.4],[4.6,2.7]]};
}
/*DOME7-END --------------------------------------------------------------------*/
"use strict";
const STILL=matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOBILE=innerWidth<760;
const DPR=Math.min(devicePixelRatio||1,MOBILE?1.5:2);   // 2D canvas only
const C=window.Chakra;
const CFG=window.ZISTGAH_DOME||{};   /*ZDOME-SEAM:cfg*/

/* ---------- Q: the frame budget manager ------------------------------------
   The mobile bottleneck was never geometry — it was a 768² aurora texture being
   re-uploaded to the GPU 30×/s (≈68 MB/s) while a full-screen 2D canvas redrew
   every frame. Both are now scheduled, and both stop dead while you are dragging,
   which is precisely when the GPU must belong to the rotation.                */
const Q={
  dpr:      MOBILE?1.15:Math.min(devicePixelRatio||1,2),  // 3D render scale
  dragScale:0.72,                                          // dynamic resolution while dragging
  nebulaHz: MOBILE?20:30,                                  // the sky is meditative; it needn't be 60
  shellHz:  MOBILE?8:12,                                   // texture uploads, not frames
  dragging: false,
  budget:   MOBILE?20:14,                                  // ms; above this we shed quality
  strikes:  0, tier:0
};
function applyDPR(){
  if(!renderer)return;
  renderer.setPixelRatio(Q.dpr*(Q.dragging?Q.dragScale:1));
  renderer.setSize(innerWidth,innerHeight);
}
function setDragging(on){
  if(Q.dragging===on)return;
  Q.dragging=on;applyDPR();
}
function downgrade(){                       // last resort, once, in order of cost
  if(Q.tier>=3)return;
  Q.tier++;
  if(Q.tier===1){Q.shellHz=4;Q.nebulaHz=Math.min(Q.nebulaHz,15);}
  else if(Q.tier===2){Q.dpr=Math.max(0.9,Q.dpr-0.2);applyDPR();}
  else if(Q.tier===3&&shellMat){shellMat.visible=false;}   // drop the aurora projection last
}

/* ---------- settings (persisted; density rebuilds the sky) ---------- */
const S={density:MOBILE?0.8:1,glints:true,meteors:true,drone:false,droneMode:'off',gravity:false,sYaw:0.45,sPitch:1,sRoll:1,debug:false, /*FLIGHT-MOD: hold default, sensitivities, debug*/
         mouseStick:false,cam:'interior',vr:false,dpr:null,hz:null};
try{Object.assign(S,JSON.parse(localStorage.getItem('zistgah-scene')||'{}'))}catch(e){}
if(S.dpr)Q.dpr=S.dpr;                 // Q is defined above; honour the saved choice
if(S.hz) Q.nebulaHz=S.hz;
function saveS(){try{localStorage.setItem('zistgah-scene',JSON.stringify(S))}catch(e){}}

/* ---------- time state (chakra mechanics) ---------- */
const T={off:0};
const now=new Date();
function d0(){return C.dayNo(now.getUTCFullYear(),now.getUTCMonth()+1,now.getUTCDate(),
  now.getUTCHours()+now.getUTCMinutes()/60+now.getUTCSeconds()/3600);}
function dCur(){return d0()+T.off;}
function refY(d){const g=C.jdn2greg(C.jdnOf(d));return g.Y+((g.M-1)*30.44+g.D)/365.25;}
const pad=n=>String(n).padStart(2,"0");
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};

/*CARDS-BEGIN  ten reckonings, exactly as chakra's landing builds them ---------*/
function cardsData(C,d){
  const jdn=C.jdnOf(d), g=C.jdn2greg(jdn), y=refY(d), cards=[];
  const card=(t,v,s)=>cards.push([t,v,s]);
  const wd=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][(jdn+1)%7];
  const mo=["January","February","March","April","May","June","July","August","September","October","November","December"][g.M-1];
  card("Gregorian · civil",wd+", "+g.D+" "+mo+" "+g.Y,"ISO "+g.Y+"-"+pad(g.M)+"-"+pad(g.D));
  const sv=C.samvInfo(d,g.Y);
  card("Hindu · saṁvatsara",sv.name,"Śaka "+sv.saka+" · Vikrama "+sv.vikrama);
  const hs=C.hijriSunni(jdn);
  card("Hijrī · Sunni tabular",hs.d+" "+C.HIJRI_M[hs.m-1]+" "+hs.y+" AH","30-yr cycle, Kuwaiti leap set");
  const hh=C.hijriShia(jdn);
  card("Hijrī · Shia tabular",hh.d+" "+C.HIJRI_M[hh.m-1]+" "+hh.y+" AH","Ithnā-ʿAsharī leap set");
  const sj=C.solarHijri(d,g.Y);
  card("Solar Hijrī · Iran/Afghanistan",sj.d+" "+sj.m+" "+sj.y+" SH","Nowruz-anchored, computed equinox");
  const hb=C.hebrew(jdn);
  card("Hebrew · civil",hb.d+" "+hb.month+" "+hb.y+" AM",hb.leap?"leap year (Adar I+II)":"regular year");
  const nk=C.nanakshahi(jdn);
  card("Sikh · Nanakshahi",nk.d+" "+nk.month+" "+nk.y+" NS","New Year 1 Chet = 14 March");
  card("Chinese · sexagenary",C.chineseYear(g.Y),C.tibetYear(g.Y).split("·")[0]);
  const my=C.mayan(jdn);
  card("Maya · Long Count",my.lc,my.tz+" · "+my.haab);
  const pc=C.panchanga(d,y);
  card("Pañcāṅga · this instant",pc.tithi.split(" (")[0]+" · "+pc.nak,pc.yoga+" yoga · "+pc.karana+" karaṇa");
  const rot=((jdn%cards.length)+cards.length)%cards.length;
  return cards.slice(rot).concat(cards.slice(0,rot));
}
/*CARDS-END*/

/* ======================================================================
   ZW — Zistgah widgets. Each is a pure draw/compute unit over chakra-core,
   designed to be lifted verbatim into project-ilm/chakra as reusable
   widgets (web, Android home-screen, iOS). No DOM assumptions beyond the
   surface handed in.
   ====================================================================== */
const ZW={};
/*LORENZ-BEGIN*/
ZW.lorenzStep=function(s,dt){
  return [s[0]+dt*10*(s[1]-s[0]),
          s[1]+dt*(s[0]*(28-s[2])-s[1]),
          s[2]+dt*(s[0]*s[1]-8/3*s[2])];
};
/*LORENZ-END*/
/*JULIA-BEGIN*/
ZW.juliaIter=function(x,y,cRe,cIm,maxIt){
  let zr=x,zi=y,i=0;
  while(i<maxIt&&zr*zr+zi*zi<=4){const t=zr*zr-zi*zi+cRe;zi=2*zr*zi+cIm;zr=t;i++}
  return i;
};
/*JULIA-END*/
/* meenakari palette: enamel blues/greens/ruby set in gold */
ZW.meenakari=function(i,maxIt){
  if(i>=maxIt)return [10,16,36];
  const t=i/maxIt;
  const stops=[[22,48,94],[27,107,90],[122,31,43],[201,164,78],[244,232,193]];
  const x=t*(stops.length-1),k=Math.min(stops.length-2,x|0),f=x-k;
  return stops[k].map((c,q)=>Math.round(c+(stops[k+1][q]-c)*f));
};
ZW.juliaCanvas=function(cv2,cRe,cIm,cx0,cy0,zoom){
  const w=cv2.width,h=cv2.height,x2=cv2.getContext('2d');
  const img=x2.createImageData(w,h),maxIt=90+Math.min(160,Math.log2(zoom)*22|0);
  for(let py=0;py<h;py++)for(let px2=0;px2<w;px2++){
    const x=cx0+(px2-w/2)/(0.25*w*zoom), y=cy0+(py-h/2)/(0.25*w*zoom);
    const it=ZW.juliaIter(x,y,cRe,cIm,maxIt), [r,g2,b]=ZW.meenakari(it,maxIt);
    const o=(py*w+px2)*4;img.data[o]=r;img.data[o+1]=g2;img.data[o+2]=b;img.data[o+3]=255;
  }
  x2.putImageData(img,0,0);
};
/* the dial (instrument face) — chakra-computed */
ZW.dial=function(canvas,C,d){
  const dg=canvas.getContext('2d'),cx=256,cy=256,Rr=236,Rm=118;
  dg.clearRect(0,0,512,512);
  dg.fillStyle='rgba(5,10,24,.48)';dg.beginPath();dg.arc(cx,cy,Rr+12,0,7);dg.fill();
  dg.strokeStyle='rgba(255,233,176,.95)';dg.lineWidth=3;
  dg.beginPath();dg.arc(cx,cy,Rr+10,0,7);dg.stroke();
  dg.strokeStyle='rgba(255,233,176,.5)';dg.lineWidth=1.4;
  dg.beginPath();dg.arc(cx,cy,Rr+4,0,7);dg.stroke();
  for(let a=0;a<360;a+=5){
    const maj=a%30===0,mid=a%10===0,r2=Rr-(maj?26:mid?16:9);
    dg.strokeStyle=maj?'rgba(232,207,138,.9)':'rgba(201,164,78,.55)';dg.lineWidth=maj?2.4:1.2;
    const ar=(a-90)*Math.PI/180;
    dg.beginPath();dg.moveTo(cx+Rr*Math.cos(ar),cy+Rr*Math.sin(ar));
    dg.lineTo(cx+r2*Math.cos(ar),cy+r2*Math.sin(ar));dg.stroke();
  }
  const GL=["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
  dg.font='26px serif';dg.textAlign='center';dg.textBaseline='middle';
  for(let s2=0;s2<12;s2++){
    const ang=(-90-(s2*30+15))*Math.PI/180;
    dg.fillStyle=`hsl(${s2*30} 60% 55%)`;
    dg.fillText(GL[s2],cx+(Rr-52)*Math.cos(ang),cy+(Rr-52)*Math.sin(ang));
  }
  const gp=C.grahas(d);
  const BODIES=[["Sun","#e6b450",8],["Mercury","#9fb0c0",5],["Venus","#d08a5a",6],
                ["Mars","#e0685a",5.6],["Jupiter","#d9b24a",6.6],["Saturn","#8a97b8",6]];
  for(const [nm,col,r] of BODIES){
    const ang=(-90-gp[nm])*Math.PI/180;
    dg.fillStyle=col;dg.shadowColor=col;dg.shadowBlur=10;
    dg.beginPath();dg.arc(cx+Rr*Math.cos(ang),cy+Rr*Math.sin(ang),r,0,7);dg.fill();
  }
  const mang=(-90-gp.Moon)*Math.PI/180;
  dg.fillStyle='#e8ecf7';dg.shadowColor='#cdd6e0';dg.shadowBlur=10;
  dg.beginPath();dg.arc(cx+Rr*Math.cos(mang),cy+Rr*Math.sin(mang),6,0,7);dg.fill();
  dg.shadowBlur=0;
  const ph=C.phaseInfo(d), k=Math.cos(ph.elong*Math.PI/180);
  dg.fillStyle='#0d1526';dg.beginPath();dg.arc(cx,cy,Rm,0,7);dg.fill();
  if(ph.illum>0.004){
    const rightSide=ph.waxing, sweepOuter=rightSide?1:0, rx=Math.abs(k)*Rm;
    const sweepInner=(k>0?(rightSide?0:1):(rightSide?1:0));
    const p=new Path2D(`M ${cx} ${cy-Rm} A ${Rm} ${Rm} 0 0 ${sweepOuter} ${cx} ${cy+Rm}`+
                       ` A ${rx} ${Rm} 0 0 ${sweepInner} ${cx} ${cy-Rm} Z`);
    dg.fillStyle='#e9e6dc';dg.fill(p);
  }
  for(const [mx,my2,mr,mo2] of [[-32,-34,30,.10],[20,-7,23,.09],[-7,39,18,.08],[39,30,14,.07]]){
    dg.fillStyle=`rgba(139,150,184,${mo2})`;dg.beginPath();dg.arc(cx+mx,cy+my2,mr,0,7);dg.fill();
  }
  dg.strokeStyle='rgba(216,169,78,.35)';dg.lineWidth=1.5;
  dg.beginPath();dg.arc(cx,cy,Rm,0,7);dg.stroke();
};
/* the real sky band — ecliptic arc, zodiac ticks, TRUE graha positions.
   Replaces invented constellations with chakra's computed sky. */
ZW.skyBand=function(og,W,H,C,d){
  const gp=C.grahas(d), y0=H*0.16, amp=H*0.05;
  const X=lam=>W*0.06+ (((lam%360)+360)%360)/360*(W*0.88);
  const Y=lam=>y0+amp*Math.sin((lam/180)*Math.PI);
  og.strokeStyle='rgba(207,228,238,.35)';og.lineWidth=1;
  og.beginPath();
  for(let lam=0;lam<=360;lam+=6){const m=lam?'lineTo':'moveTo';og[m](X(lam),Y(lam))}
  og.stroke();
  og.font='10px serif';og.textAlign='center';
  for(let s2=0;s2<12;s2++){const lam=s2*30;
    og.strokeStyle='rgba(207,228,238,.3)';
    og.beginPath();og.moveTo(X(lam),Y(lam)-4);og.lineTo(X(lam),Y(lam)+4);og.stroke();
    og.fillStyle=`hsla(${s2*30} 55% 62% /.5)`;
    og.fillText(["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"][s2],X(lam+15),Y(lam+15)-9);
  }
  const B=[["Sun","#e6b450",3.4],["Moon","#e8ecf7",3],["Mercury","#9fb0c0",2],["Venus","#d08a5a",2.4],
           ["Mars","#e0685a",2.2],["Jupiter","#d9b24a",2.6],["Saturn","#8a97b8",2.3]];
  for(const [nm,col,r] of B){
    og.fillStyle=col;og.shadowColor=col;og.shadowBlur=6;
    og.beginPath();og.arc(X(gp[nm]),Y(gp[nm]),r,0,7);og.fill();
  }
  og.shadowBlur=0;
};

function buildCards(){
  const bar=document.getElementById('calbar');bar.innerHTML='';
  for(const [t,v,s] of cardsData(C,dCur())){
    const el=document.createElement('div');el.className='cal';el.setAttribute('role','listitem');
    el.innerHTML=`<div class="t">${t}</div><div class="v">${v}</div>`+(s?`<div class="s">${s}</div>`:'');
    bar.appendChild(el);
  }
}
const dialCv=document.createElement('canvas');dialCv.width=dialCv.height=512;
function drawDial(){ZW.dial(dialCv,C,dCur());if(dialTex)dialTex.needsUpdate=true;}

/* ---------- 3D ---------- */
const R=10;
let camera,renderer,scene,G,WG=null,shellTex,dialTex,shellMat,ok3d=false,D=null; /*WORLD-MOD*/
let pedBase=[],glintMats=[],cols3d=[],drone=null,fpvProps=[],yaw=0,pitch=0,dolly=7.4;
let yawT=0,pitchT=0,yawV=0;          // targets + inertia — input rate no longer touches the GPU
function plaqueTex(name,w2,h2,fs){
  const c=document.createElement('canvas');c.width=w2||512;c.height=h2||128;
  const x=c.getContext('2d');
  const grd=x.createLinearGradient(0,0,0,c.height);
  grd.addColorStop(0,'#1a2444');grd.addColorStop(1,'#0a1128');
  x.fillStyle=grd;x.fillRect(0,0,c.width,c.height);
  x.strokeStyle='rgba(232,207,138,.9)';x.lineWidth=5;x.strokeRect(8,8,c.width-16,c.height-16);
  x.strokeStyle='rgba(201,164,78,.5)';x.lineWidth=2;x.strokeRect(18,18,c.width-36,c.height-36);
  x.fillStyle='#f0dfae';x.font=(fs||44)+'px Palatino,Georgia,serif';
  x.textAlign='center';x.textBaseline='middle';x.fillText(name,c.width/2,c.height/2);
  return new THREE.CanvasTexture(c);
}
function initGL(){
  try{
    D=makeDome(R);
    renderer=new THREE.WebGLRenderer({canvas:document.getElementById('gl'),
      alpha:true,antialias:!MOBILE});
    renderer.setPixelRatio(Q.dpr);renderer.setSize(innerWidth,innerHeight);
    scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x050a18,0.028);
    camera=new THREE.PerspectiveCamera(88,innerWidth/innerHeight,0.1,160);
    G=new THREE.Group();scene.add(G);
    const passes=MOBILE?[1]:[1,0.9965,1.0035];        // one pass on mobile…
    const boost=MOBILE?1.35:1;                        // …opacity carries the weight instead
    const line=(buf,color,op)=>{const gg=new THREE.BufferGeometry();
      gg.setAttribute('position',new THREE.BufferAttribute(buf,3));
      for(const sc of passes){
        const m=new THREE.LineSegments(gg,new THREE.LineBasicMaterial(
          {color,transparent:true,opacity:Math.min(1,op*boost),depthWrite:false}));
        m.scale.setScalar(sc);G.add(m);}};
    line(D.minor,0xc9a44e,0.36); line(D.major,0xe8cf8a,0.9);
    line(D.rings,0xc9a44e,0.5);  line(D.arcade,0xd9b96a,0.85);
    line(D.floor,0x7fd4e8,0.13);
    const oc=[];for(const rr of [D.ocuR,D.ocuR*1.05])for(let k=0;k<96;k++){
      const a=k/96*6.28318,b=(k+1)/96*6.28318;
      oc.push(rr*Math.cos(a),D.ocuY,rr*Math.sin(a),rr*Math.cos(b),D.ocuY,rr*Math.sin(b))}
    const og2=new THREE.BufferGeometry();
    og2.setAttribute('position',new THREE.BufferAttribute(Float32Array.from(oc),3));
    scene.add(new THREE.LineSegments(og2,new THREE.LineBasicMaterial(
      {color:0xffe9b0,transparent:true,opacity:0.95,blending:THREE.AdditiveBlending,depthWrite:false})));
    const gems=new Float32Array(24);
    for(let i=0;i<8;i++){const a=i/8*6.28318;
      gems[i*3]=D.ocuR*1.05*Math.cos(a);gems[i*3+1]=D.ocuY+0.05;gems[i*3+2]=D.ocuR*1.05*Math.sin(a)}
    const gg2=new THREE.BufferGeometry();
    gg2.setAttribute('position',new THREE.BufferAttribute(gems,3));
    G.add(new THREE.Points(gg2,new THREE.PointsMaterial({color:0xffe9b0,size:0.3, /*WORLD-MOD: oculus jewels ride the hall*/
      transparent:true,opacity:0.95,blending:THREE.AdditiveBlending,sizeAttenuation:true})));
    shellTex=new THREE.CanvasTexture(off);
    shellMat=new THREE.MeshBasicMaterial({map:shellTex,side:THREE.BackSide,transparent:true,
      opacity:0.4,blending:THREE.AdditiveBlending,depthWrite:false});
    G.add(new THREE.Mesh(
      new THREE.SphereGeometry(R*0.985,MOBILE?28:48,MOBILE?14:24,0,Math.PI*2,D.phi0,D.phi1-D.phi0),shellMat));
    dialTex=new THREE.CanvasTexture(dialCv);
    const disc=new THREE.Mesh(new THREE.CircleGeometry(D.ocuR*0.97,64),
      new THREE.MeshBasicMaterial({map:dialTex,transparent:true,side:THREE.DoubleSide,depthWrite:false}));
    disc.rotateX(Math.PI/2);disc.position.y=D.ocuY-0.03;
    G.add(disc); /*WORLD-MOD: the chakra dial is attached — dome and chakra are one entity*/
    rebuildStars();
    scene.add(new THREE.AmbientLight(0x2a3a55,1.1));
    const oculight=new THREE.PointLight(0xffd9a0,1.5,60);oculight.position.set(0,9.2,0);
    scene.add(oculight);
    const key=new THREE.DirectionalLight(0xcfe0ff,0.7);key.position.set(4,6,9);scene.add(key);
    const stone=new THREE.MeshStandardMaterial({color:0x1c2438,metalness:.35,roughness:.55});
    const goldM=new THREE.MeshStandardMaterial({color:0xc9a44e,metalness:.95,roughness:.28});
    const teal =new THREE.MeshStandardMaterial({color:0x2ec4d6,metalness:.6,roughness:.3,
      emissive:0x0a5560,emissiveIntensity:.7});
    /* METALLIC PILLAR SHAFTS with meenakari fractal bands (tap a band to zoom, truly) */
    const fracCv=document.createElement('canvas');fracCv.width=fracCv.height=256;
    ZW.juliaCanvas(fracCv,-0.8,0.156,0,0,1);
    const fracTex=new THREE.CanvasTexture(fracCv);
    fracTex.wrapS=fracTex.wrapT=THREE.RepeatWrapping;fracTex.repeat.set(3,1);
    const fracMat=new THREE.MeshStandardMaterial({map:fracTex,metalness:.75,roughness:.35});
    const capY=D.shellBottomY*0.55, rimR2=R*Math.sin(D.phi1);
    cols3d=[];
    for(let j=0;j<30;j+=2){
      const thG=((j+0.5+0.5)%30)/30*2*Math.PI;
      const bx=rimR2*1.05*Math.cos(thG), bz=rimR2*1.05*Math.sin(thG);
      const shaft=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.14,capY,10),goldM);
      shaft.position.set(bx,capY/2,bz);G.add(shaft);
      const band=new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.17,0.55,12),fracMat);
      band.position.set(bx,capY*0.55,bz);G.add(band);
      cols3d.push(new THREE.Vector3(bx,capY*0.55,bz));
    }
    /* RIM INSCRIPTIONS — the parallels, revealed by rotation */
    (CFG.pillars||["ZISTGAH","KAIVALYIK","COSMOPOLIS"]).forEach((nm,i)=>{ /*ZDOME-SEAM:pillars*/
      const az=(90+i*120)*Math.PI/180;
      const pl=new THREE.Mesh(new THREE.PlaneGeometry(3.6,0.6),
        new THREE.MeshBasicMaterial({map:plaqueTex(nm,768,128,58),transparent:false}));
      pl.position.set(rimR2*0.96*Math.cos(az),D.shellBottomY+0.55,rimR2*0.96*Math.sin(az));
      pl.lookAt(0,D.shellBottomY+0.55,0);G.add(pl);
    });
    /* exhibits (PBR, from v0.7) */
    const names=CFG.exhibitNames||["Kaivalya AGI","AyeTRIAD Loop","Holy Grail Lab","Zistgah"]; /*ZDOME-SEAM:exhibitNames*/
    const build=[
      g2=>{const r1=new THREE.Mesh(new THREE.TorusGeometry(0.52,0.035,16,64),goldM);
           const r2=new THREE.Mesh(new THREE.TorusGeometry(0.42,0.03,16,64),goldM);
           r2.rotation.x=Math.PI/2.4;const r3=new THREE.Mesh(new THREE.TorusGeometry(0.32,0.026,16,64),goldM);
           r3.rotation.y=Math.PI/2.2;
           g2.add(r1,r2,r3,new THREE.Mesh(new THREE.SphereGeometry(0.15,24,16),teal))},
      g2=>{for(let i=0;i<3;i++){const t2=new THREE.Mesh(new THREE.TorusGeometry(0.34,0.045,16,48),
             i===1?teal:goldM);
           t2.position.x=(i-1)*0.3;t2.rotation.y=i*0.8;t2.rotation.x=Math.PI/2.6;g2.add(t2)}},
      g2=>{[[-.3,.14,-.18],[.3,.14,-.12],[-.12,.14,.24],[.34,.14,.22]].forEach((p,i)=>{
           const b=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.26,0.3),i%2?goldM:stone);
           b.position.set(p[0],p[1],p[2]);b.rotation.y=i*0.5;g2.add(b);
           const lid=new THREE.Mesh(new THREE.BoxGeometry(0.44,0.03,0.32),goldM);
           lid.position.set(p[0],p[1]+0.15,p[2]);lid.rotation.y=i*0.5;g2.add(lid)})},
      g2=>{g2.add(new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.6,0.08,24),
             new THREE.MeshStandardMaterial({color:0x1b6b5a,metalness:.2,roughness:.7})));
           [[0.15,0.26],[-0.2,0.34],[0.32,0.2]].forEach(([px2,h])=>{
             const m=new THREE.Mesh(new THREE.ConeGeometry(0.14,h,8),
               new THREE.MeshStandardMaterial({color:0x6b5a3e,roughness:.8}));
             m.position.set(px2,h/2+0.04,(Math.random()-.5)*0.3);g2.add(m)});
           const dome=new THREE.Mesh(new THREE.SphereGeometry(0.2,16,8,0,Math.PI*2,0,Math.PI/2),
             new THREE.MeshStandardMaterial({color:0xc9a44e,metalness:.9,roughness:.3,
               transparent:true,opacity:.85}));
           dome.position.set(-0.05,0.04,0.12);g2.add(dome)}];
    pedBase=[];
    D.pedestals.forEach(([x,z],i)=>{
      const g2=new THREE.Group();
      const base=new THREE.Mesh(new THREE.CylinderGeometry(0.72,0.9,0.5,10),stone);
      const trim=new THREE.Mesh(new THREE.TorusGeometry(0.74,0.028,10,40),goldM);
      trim.rotation.x=Math.PI/2;trim.position.y=0.25;
      g2.add(base,trim);
      const pl=new THREE.Mesh(new THREE.PlaneGeometry(1.25,0.32),
        new THREE.MeshBasicMaterial({map:plaqueTex(names[i]),transparent:false}));
      pl.position.set(0,0.06,0.86);g2.add(pl);
      const e2=new THREE.Group();e2.position.y=0.95;build[i](e2);g2.add(e2);
      g2.position.set(x,0.25,z);G.add(g2);
      pedBase.push({v:new THREE.Vector3(x,1.05,z),spin:e2,name:names[i]});
    });
    /* glints */
    const pick=(buf,n)=>{const out=new Float32Array(n*3);
      for(let i=0;i<n;i++){const j2=(Math.random()*buf.length/3|0)*3;
        out[i*3]=buf[j2];out[i*3+1]=buf[j2+1];out[i*3+2]=buf[j2+2]}return out};
    glintMats=[];
    for(const ph2 of [0,2.1]){
      const gp2=new THREE.BufferGeometry();
      gp2.setAttribute('position',new THREE.BufferAttribute(pick(D.minor,150),3));
      const mat=new THREE.PointsMaterial({color:0xffe9b0,size:0.16,transparent:true,
        opacity:0.0,blending:THREE.AdditiveBlending,sizeAttenuation:true});
      mat.userData={ph:ph2};glintMats.push(mat);
      G.add(new THREE.Points(gp2,mat));}
    /* the quadrotor */
    drone=new THREE.Group();
    const dk=new THREE.MeshStandardMaterial({color:0x28334e,metalness:.6,roughness:.4});
    drone.add(new THREE.Mesh(new THREE.BoxGeometry(0.34,0.1,0.34),dk));
    for(const a of [Math.PI/4,-Math.PI/4]){
      const arm=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.035,0.06),dk);
      arm.rotation.y=a;drone.add(arm);}
    drone.userData.props=[];
    [[.32,.32],[.32,-.32],[-.32,.32],[-.32,-.32]].forEach(([ax,az])=>{
      const mot=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,0.07,8),goldM);
      mot.position.set(ax,0.06,az);drone.add(mot);
      const prop=new THREE.Mesh(new THREE.CircleGeometry(0.16,12),
        new THREE.MeshBasicMaterial({color:0x9fb0c0,transparent:true,opacity:0.35,side:THREE.DoubleSide}));
      prop.rotation.x=-Math.PI/2;prop.position.set(ax,0.105,az);
      drone.add(prop);drone.userData.props.push(prop);});
    drone.visible=S.drone;scene.add(drone);
    craft.quad=drone;

    /* ---- the rocket and the lander: the other two embodiments ---- */
    craft.rocket=new THREE.Group();
    {const body=new THREE.Mesh(new THREE.CylinderGeometry(0.10,0.13,0.72,10),goldM);
     const nose=new THREE.Mesh(new THREE.ConeGeometry(0.10,0.26,10),goldM);nose.position.y=0.49;
     const flame=new THREE.Mesh(new THREE.ConeGeometry(0.08,0.34,8),
       new THREE.MeshBasicMaterial({color:0xffb347,transparent:true,opacity:0.75}));
     flame.rotation.x=Math.PI;flame.position.y=-0.52;flame.name='flame';
     craft.rocket.add(body,nose,flame);
     for(const a of [0,2.094,4.189]){
       const fin=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.2,0.16),stone);
       fin.position.set(0.11*Math.cos(a),-0.3,0.11*Math.sin(a));fin.rotation.y=-a;
       craft.rocket.add(fin);}
     craft.rocket.visible=false;scene.add(craft.rocket);}

    /* ---- the lunar landing system ---- */
    craft.lander=new THREE.Group();
    {const can=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.26,0.24,8),goldM);
     const tank=new THREE.Mesh(new THREE.SphereGeometry(0.13,12,8),stone);tank.position.y=-0.18;
     craft.lander.add(can,tank);
     for(let i=0;i<4;i++){const a=i/4*6.28318+0.78;
       const leg=new THREE.Mesh(new THREE.CylinderGeometry(0.015,0.015,0.42,6),stone);
       leg.position.set(0.2*Math.cos(a),-0.26,0.2*Math.sin(a));leg.rotation.z=Math.cos(a)*0.5;
       leg.rotation.x=-Math.sin(a)*0.5;craft.lander.add(leg);
       const pad2=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.02,8),goldM);
       pad2.position.set(0.29*Math.cos(a),-0.46,0.29*Math.sin(a));craft.lander.add(pad2);}
     craft.lander.visible=false;scene.add(craft.lander);}

    /* ---- the worlds: Earth below the glass, habitats above ---- */
    WG=new THREE.Group();scene.add(WG); /*WORLD-MOD: worlds group — turns with the hall*/
    for(const w of ZP.worlds){
      const grp=new THREE.Group();grp.position.set(w.at[0],w.at[1],w.at[2]);
      if(w.kind==='station'){ /*WORLD-MOD: orbital station body*/
        const ring=new THREE.Mesh(new THREE.TorusGeometry(w.r,w.r*0.12,10,48),goldM);
        ring.rotation.x=Math.PI/2;grp.add(ring);
        grp.add(new THREE.Mesh(new THREE.SphereGeometry(w.r*0.28,16,12),stone));
        for(let a2=0;a2<4;a2++){const sp2=new THREE.Mesh(new THREE.CylinderGeometry(w.r*0.04,w.r*0.04,w.r*2,8),stone);
          sp2.rotation.z=Math.PI/2;sp2.rotation.y=a2*Math.PI/4;grp.add(sp2);}
        grp.add(new THREE.PointLight(0x7fd4e8,1.0,50));
      }else{
      grp.add(new THREE.Mesh(new THREE.SphereGeometry(w.r*0.995,48,32),
        new THREE.MeshStandardMaterial({color:w.tint,roughness:.92,metalness:.05})));
      grp.add(new THREE.Mesh(new THREE.SphereGeometry(w.r*1.035,32,20),
        new THREE.MeshBasicMaterial({color:w.atmo,transparent:true,opacity:0.13,
          side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false})));
      if(w.coast&&window.Chakra&&window.Chakra.COAST){       // HIS coastline data
        const cb=new THREE.BufferGeometry();
        cb.setAttribute('position',new THREE.BufferAttribute(
          coastBuffer(window.Chakra.COAST,w.r*1.004),3));
        grp.add(new THREE.LineSegments(cb,new THREE.LineBasicMaterial(
          {color:0x78c8b4,transparent:true,opacity:0.62})));
        const gr=[];for(let la=-60;la<=60;la+=30){for(let lo=0;lo<360;lo+=6){
          const P2=(A,B2)=>[w.r*1.002*Math.cos(A*Math.PI/180)*Math.cos(B2*Math.PI/180),
                            w.r*1.002*Math.sin(A*Math.PI/180),
                            w.r*1.002*Math.cos(A*Math.PI/180)*Math.sin(B2*Math.PI/180)];
          gr.push(...P2(la,lo),...P2(la,lo+6));}}
        const gg3=new THREE.BufferGeometry();
        gg3.setAttribute('position',new THREE.BufferAttribute(Float32Array.from(gr),3));
        grp.add(new THREE.LineSegments(gg3,new THREE.LineBasicMaterial(
          {color:0x5a6e96,transparent:true,opacity:0.10})));
      }
      } /*WORLD-MOD: station/planet split*/
      if(w.habitat){                                          // a small dome, floating over it
        const hd=w.habitat.domeR, hy=__surfY(w)+hd*0.05; /*WORLD-MOD*/
        const hdm=new THREE.Mesh(
          new THREE.SphereGeometry(hd,20,12,0,Math.PI*2,0,Math.PI/2),
          new THREE.MeshBasicMaterial({color:0xc9a44e,wireframe:true,transparent:true,opacity:0.5}));
        hdm.position.y=hy;grp.add(hdm);
        const glass=new THREE.Mesh(new THREE.CircleGeometry(hd*0.96,32),
          new THREE.MeshBasicMaterial({color:0x7fd4e8,transparent:true,opacity:0.10,
            side:THREE.DoubleSide}));
        glass.rotation.x=-Math.PI/2;glass.position.y=hy+0.02;grp.add(glass);
        const beacon=new THREE.PointLight(0xffd9a0,1.2,40);beacon.position.y=hy+hd*0.6;grp.add(beacon);
      }
      WG.add(grp); /*WORLD-MOD*/
      worldMeshes.push({w,grp,center:new THREE.Vector3(w.at[0],w.at[1]+ (w.habitat?w.r+w.habitat.domeR*0.5:0),w.at[2])});
    }
    /* spawn + worlds config applied in __boot, before initGL — pure data, GL-independent */
    PILOT=S.droneMode==='pilot';mouseOn=!!S.mouseStick;
    /* FPV edge props (children of the camera; added only in FPV) */
    fpvProps=[-1,1].map(sgn=>{
      const p=new THREE.Mesh(new THREE.CircleGeometry(0.22,10),
        new THREE.MeshBasicMaterial({color:0xaebccb,transparent:true,opacity:0.3,side:THREE.DoubleSide}));
      p.position.set(sgn*0.5,-0.34,-1.05);return p;});
    if(CFG.displays)for(const dd of CFG.displays){try{ZDOME_BUILD[dd.type]&&ZDOME_BUILD[dd.type](dd,{THREE,scene,G,camera,renderer,R,D,domePoint,makeDome});}catch(e){console.error('display '+dd.type,e)}} /*ZDOME-SEAM:displays*/
    if(CFG.gallery){try{ZDOME_BUILD.gallery(CFG.gallery,{THREE,scene,G,camera,renderer,R,D});}catch(e){console.error('gallery',e)}} /*ZDOME-SEAM:gallery*/
    if(CFG.videos){try{ZDOME_BUILD.videos(CFG.videos,{THREE,scene,G,camera,renderer,R,D});}catch(e){console.error('videos',e)}} /*ZDOME-SEAM:videos*/
    if(CFG.display){try{CFG.display({THREE,scene,G,camera,renderer,R,D,domePoint,makeDome});}catch(e){console.error('ZDOME display',e)}}   /*ZDOME-SEAM:display*/
    ok3d=true;
  }catch(e){document.getElementById('gl').style.display='none'}
}
let starsMesh=null;
function rebuildStars(){
  if(starsMesh){G.remove(starsMesh);starsMesh.geometry.dispose()}
  const N=Math.round((MOBILE?3500:6000)*S.density),sp=new Float32Array(N*3);
  for(let i=0;i<N;i++){let x,y,z;do{x=Math.random()*2-1;y=Math.random()*2-1;z=Math.random()*2-1}
    while(x*x+y*y+z*z>1||y<-0.1);
    const L2=(70+Math.random()*90)/Math.hypot(x,y,z); /*STAR-MOD: deep shell 70–160*/sp[i*3]=x*L2;sp[i*3+1]=y*L2;sp[i*3+2]=z*L2}
  const sg=new THREE.BufferGeometry();
  sg.setAttribute('position',new THREE.BufferAttribute(sp,3));
  starsMesh=new THREE.Points(sg,new THREE.PointsMaterial({color:0xf2ecdd,size:0.11, /*STAR-MOD*/
    transparent:true,opacity:0.8,sizeAttenuation:true}));
  G.add(starsMesh);
}
/*WORLDS-BEGIN  Zistgah cosmography — pure, parameterised, testable ------------
   Everything is data. ZP is the single parameter block for the whole scene;
   nothing below hard-codes a distance, radius, colour or rule.               */
const ZP={
  dome:{R:10,ocuR:1.70,ocuY:9.85,glassFloorY:0.25},
  flight:{hoverThr:0.62,rate:2.2,level:2.6,drag:0.62,g:9.81,
          maxTilt:0.6,allowSubfloor:false,        // ← the glass floor is a hard deck
          escapeThroughOculus:true},
  space:{bound:320,cruise:1.0},
  transit:{secondsPerUnit:0.055,arcLift:38},
  worlds:[
    {id:"earth",label:"Earth",   r:58, at:[0,-60.6,0], coast:true,  habitat:null,
     tint:0x2f6f8f, atmo:0x59b6d8},
    {id:"moon", label:"Zistgah-e-Mahtab (Mah)", short:"Mah", pin:"OASIS",
     r:11, at:[-86,58,-150], coast:false,
     habitat:{domeR:5.2,embodiment:"lander"}, tint:0x9aa3b0, atmo:0x2b3550},
    {id:"mars", label:"Zistgah-e-Bahram (ZB)", short:"ZB", pin:"Mangal Kamna",
     r:14, at:[104,44,-196], coast:false,
     habitat:{domeR:6.4,embodiment:"quad"},   tint:0xb1573a, atmo:0x7a3b28}
  ],
  embodiments:{
    quad:  {label:"Quadrotor",       g:1.00, thrust:1.00, hud:"ALT · SPD · THR"},
    rocket:{label:"Transfer rocket", g:0.00, thrust:0.00, hud:"TRANSIT"},
    lander:{label:"Landing system",  g:0.165,thrust:0.55, hud:"DESCENT"}   // lunar gravity
  }
};

/*ZDOME-BUILTIN-DISPLAYS — pointcloud (after ilm.codes/explore), viewer's gallery, video screens.
  All configurable; all register into HITX or their own window-level picking. (c) Abhishek Choudhary.*/
const ZDOME_BUILD={};
ZDOME_BUILD.pointcloud=function(spec,api){
  const {THREE,G,camera,R,D}=api,TWO=Math.PI*2;
  const DATA=spec.data;if(!DATA||!DATA.nodes)return;
  const FAMS=DATA.families,LAYERS=DATA.layers,NODES=DATA.nodes;
  const byKey={};NODES.forEach(n=>byKey[n.f+"|"+n.code]=n);
  const leafLvl={};FAMS.forEach(f=>leafLvl[f.id]=Math.max(...NODES.filter(n=>n.f===f.id).map(n=>n.level)));
  const LEAVES=NODES.filter(n=>n.level===leafLvl[n.f]);
  const lineage=n=>{const L=[];let x=n;while(x){L.unshift(x);x=x.parent?byKey[x.f+"|"+x.parent]:null;}return L;};
  const topIdx={};FAMS.forEach(f=>NODES.filter(n=>n.f===f.id&&n.level===1).forEach((n,i)=>topIdx[n.f+"|"+n.code]=i));
  const rgbOf=n=>{const f=FAMS.find(x=>x.id===n.f),t=lineage(n)[0],i=topIdx[t.f+"|"+t.code]||0;
    const c=document.createElement("canvas").getContext("2d");
    c.fillStyle=`hsl(${f.hue} 66% ${40+Math.round(26*i/Math.max(1,f.counts[0]-1))}%)`;
    c.fillRect(0,0,1,1);const d=c.getImageData(0,0,1,1).data;return[d[0]/255,d[1]/255,d[2]/255];};
  const Y0=spec.yBase!=null?spec.yBase:4.3, SPAN=spec.ySpan!=null?spec.ySpan:2.1;
  const yOf=li=>Y0+SPAN*li/Math.max(1,LAYERS.length-1);
  const s0=Math.sin(D.phi0);
  const rhMax=y=>R*Math.sqrt(Math.max(0,1-Math.pow(y/R+s0,2)))*0.80;
  const sprite=(txt,px,color,div)=>{const c=document.createElement("canvas"),m=c.getContext("2d");
    m.font=px+"px Palatino,Georgia,serif";c.width=Math.ceil(m.measureText(txt).width)+8;c.height=px+8;
    const g=c.getContext("2d");g.font=px+"px Palatino,Georgia,serif";g.fillStyle=color;
    g.textBaseline="top";g.fillText(txt,4,4);
    const t=new THREE.CanvasTexture(c);t.minFilter=THREE.LinearFilter;
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));
    s.scale.set(c.width/div,c.height/div,1);return s;};
  const usable=TWO-(Math.PI/22)*FAMS.length,total=LEAVES.length;let acc=0;
  const famBase={},famSpan={},famN={},famIdx={};
  FAMS.forEach(f=>{const fl=LEAVES.filter(n=>n.f===f.id),span=usable*(fl.length/total);
    famBase[f.id]=acc+(Math.PI/44);famSpan[f.id]=span;famN[f.id]=fl.length;
    fl.forEach((n,i)=>famIdx[n.f+"|"+n.code]=i);
    const mid=acc+(Math.PI/44)+span/2,lab=sprite(f.id,40,`hsl(${f.hue} 70% 62%)`,60);
    lab.position.set(Math.cos(mid)*(rhMax(Y0)+0.6),Y0-0.35,Math.sin(mid)*(rhMax(Y0)+0.6));G.add(lab);
    acc+=span+(Math.PI/22);});
  if(spec.axis!==false){
    G.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(
      [new THREE.Vector3(0,Y0-0.25,0),new THREE.Vector3(0,Y0+SPAN+0.25,0)]),
      new THREE.LineBasicMaterial({color:0x3a4680,transparent:true,opacity:.8})));
    LAYERS.forEach((l,i)=>{const lab=sprite(l.id,20,"#8b93a7",62);
      lab.position.set(0.42,yOf(i)+0.04,0);G.add(lab);});}
  const posOf=(k,li)=>{const nd=LEAVES[k],f=nd.f,i=famIdx[f+"|"+nd.code];
    const ang=famBase[f]+famSpan[f]*((i+.5)/famN[f])+(((k*7)%13)/13-.5)*0.07;
    const y=yOf(li)+(((k*11+li*3)%9)/9-.5)*0.30;
    const rm=rhMax(y);
    const r=Math.min(rm,0.9+(((k*5+li*17)%23)/23)*(rm-0.9));
    return [Math.cos(ang)*r,y,Math.sin(ang)*r];};
  const leafGlobal={};LEAVES.forEach((n,k)=>leafGlobal[n.f+"|"+n.code]=k);
  const picks=[],animGeos=[];
  FAMS.forEach(f=>{const fl=LEAVES.filter(n=>n.f===f.id),n=fl.length*LAYERS.length;
    const pos=new Float32Array(n*3),base=new Float32Array(n*3),
          col=new Float32Array(n*3),ph=new Float32Array(n),fq=new Float32Array(n);
    let j=0;const meta=[];
    fl.forEach(nd=>{const k=leafGlobal[nd.f+"|"+nd.code],[r_,g_,b_]=rgbOf(nd);
      LAYERS.forEach((l,li)=>{const p=posOf(k,li);
        base[j*3]=pos[j*3]=p[0];base[j*3+1]=pos[j*3+1]=p[1];base[j*3+2]=pos[j*3+2]=p[2];
        col[j*3]=r_;col[j*3+1]=g_;col[j*3+2]=b_;
        ph[j]=((k*31+li*7)%97)/97*TWO;fq[j]=0.5+(((k*3+li)%7)/7)*0.8;
        meta.push({n:nd,layer:l.id});j++;});});
    const g=new THREE.BufferGeometry();
    g.setAttribute("position",new THREE.BufferAttribute(pos,3));
    g.setAttribute("color",new THREE.BufferAttribute(col,3));
    const pts=new THREE.Points(g,new THREE.PointsMaterial({size:spec.size!=null?spec.size:0.055,
      vertexColors:true,transparent:true,opacity:.92,sizeAttenuation:true}));
    pts.userData.meta=meta;G.add(pts);picks.push(pts);
    animGeos.push({g,base,ph,fq,n});});
  const tick=t=>{for(const A of animGeos){const a=A.g.attributes.position.array;
      for(let j=0;j<A.n;j++){const sn=Math.sin(t*A.fq[j]+A.ph[j]);
        a[j*3]  =A.base[j*3]  +0.022*Math.cos(t*A.fq[j]*0.7+A.ph[j]);
        a[j*3+1]=A.base[j*3+1]+0.040*sn;
        a[j*3+2]=A.base[j*3+2]+0.022*Math.sin(t*A.fq[j]*0.9+A.ph[j]*1.7);}
      A.g.attributes.position.needsUpdate=true;}};
  (function loop(){requestAnimationFrame(loop);
    if(document.hidden||scrollY>innerHeight*1.4)return;
    tick(performance.now()/1000);})();
  const hiG=new THREE.BufferGeometry();
  hiG.setAttribute("position",new THREE.BufferAttribute(new Float32Array(1500*3),3));
  const hiP=new THREE.Points(hiG,new THREE.PointsMaterial({size:.20,color:0xffffff,transparent:true,opacity:.95}));
  hiP.visible=false;G.add(hiP);
  const highlight=m=>{const mm=(m||[]).slice(0,150);if(!mm.length){hiP.visible=false;return;}
    const a=hiG.attributes.position.array;let j=0;
    mm.forEach(nd=>{const k=leafGlobal[nd.f+"|"+nd.code];if(k===undefined)return;
      LAYERS.forEach((l,li)=>{const p=posOf(k,li);
        a[j*3]=p[0];a[j*3+1]=p[1];a[j*3+2]=p[2];j++;});});
    hiG.setDrawRange(0,j);hiG.attributes.position.needsUpdate=true;hiP.visible=true;};
  window.ZDOME_POINTCLOUD={highlight,tick,posOf,count:LEAVES.length*LAYERS.length};
  /* window-level picking — #gl is pointer-events:none by design, so we listen like the dome does */
  const ray=new THREE.Raycaster();ray.params.Points={threshold:spec.pick!=null?spec.pick:0.075};
  const ndc=new THREE.Vector2();
  let tipEl=document.getElementById("fktip");
  if(!tipEl){tipEl=document.createElement("div");tipEl.id="fktip";
    tipEl.style.cssText="position:fixed;pointer-events:none;background:#0d1526;border:1px solid #c9a44e;border-radius:6px;padding:.32em .55em;font:13px/1.45 system-ui;color:#e9e4d6;display:none;max-width:300px;z-index:60";
    document.body.appendChild(tipEl);}
  const GUARD="#fkpanel,#pop,#hot,#settings,#calbar,#fractal,#ytov,#zdbg,input,textarea,select,button,a,summary,label";
  const cast=e=>{const cv=api.renderer&&api.renderer.domElement;if(!cv)return null;
    const r=cv.getBoundingClientRect?cv.getBoundingClientRect():{left:0,top:0,width:innerWidth,height:innerHeight};
    ndc.x=((e.clientX-r.left)/(r.width||innerWidth))*2-1;
    ndc.y=-((e.clientY-r.top)/(r.height||innerHeight))*2+1;
    ray.setFromCamera(ndc,camera);
    const h=ray.intersectObjects(picks)[0];
    return h?h.object.userData.meta[h.index]:null;};
  let dxy=0,down=null;
  addEventListener("pointerdown",e=>{if(e.target.closest&&e.target.closest(GUARD))return;
    down=[e.clientX,e.clientY];dxy=0;});
  addEventListener("pointermove",e=>{
    if(down){dxy+=Math.abs(e.clientX-down[0])+Math.abs(e.clientY-down[1]);tipEl.style.display="none";return;}
    if(scrollY>innerHeight*0.4||(e.target.closest&&e.target.closest(GUARD))){tipEl.style.display="none";return;}
    const m=cast(e);
    if(m){tipEl.style.display="block";tipEl.style.left=(e.clientX+14)+"px";tipEl.style.top=(e.clientY+10)+"px";
      const lin=lineage(m.n).map(x=>x.name).join(" › ");
      tipEl.innerHTML=spec.tip?spec.tip(m,lin):("<b>"+m.n.f+" "+m.n.code+"</b> × <b>"+m.layer+"</b><br>"+lin);}
    else tipEl.style.display="none";},{passive:true});
  addEventListener("pointerup",e=>{const was=down;down=null;
    if(!was||dxy>7)return;
    if(scrollY>innerHeight*0.4)return;
    if(e.target.closest&&e.target.closest(GUARD))return;
    const m=cast(e);if(m&&spec.onPick)spec.onPick(m.n,m.layer);});
  addEventListener("scroll",()=>{tipEl.style.display="none";},{passive:true});
};
ZDOME_BUILD.gallery=function(spec,api){
  const {THREE,G}=api;
  const imgs=(spec&&spec.images)||[];if(!imgs.length)return;
  const N=Math.min(spec.slots||6,imgs.length), RAD=spec.radius||7.4, YC=spec.y!=null?spec.y:1.35;
  const W2=spec.w||2.1,H2=spec.h||1.4;
  const loader=new THREE.TextureLoader();loader.setCrossOrigin("anonymous");
  const slots=[];
  for(let i=0;i<N;i++){const a=(i+.5)/N*Math.PI*2;
    const frame=new THREE.Group();
    frame.position.set(Math.cos(a)*RAD,YC,Math.sin(a)*RAD);
    frame.lookAt(0,YC,0);
    frame.add(new THREE.Mesh(new THREE.PlaneGeometry(W2+0.12,H2+0.12),
      new THREE.MeshStandardMaterial({color:0xc9a44e,metalness:.9,roughness:.3})));
    const mat=new THREE.MeshBasicMaterial({color:0x101b31});
    const pic=new THREE.Mesh(new THREE.PlaneGeometry(W2,H2),mat);pic.position.z=0.01;
    frame.add(pic);
    const leg=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.05,YC,8),
      new THREE.MeshStandardMaterial({color:0x1c2438,metalness:.4,roughness:.6}));
    leg.position.y=-YC/2-0.05;frame.add(leg);
    G.add(frame);
    const slot={i,mat,idx:i};slots.push(slot);
    window.ZDOME_HIT&&ZDOME_HIT({v:frame.position.clone(),r:44,name:spec.title||"Viewer's gallery",
      sub:()=>{const u=imgs[slot.idx];return (u.split("/").pop())+" — click to open";},
      get subText(){return this.sub()},
      actLabel:"◈ Open the poster",act:()=>open(imgs[slot.idx],"_blank","noopener")});
  }
  const show=(slot,idx)=>{slot.idx=idx%imgs.length;
    loader.load(imgs[slot.idx],t=>{slot.mat.map=t;slot.mat.color.set(0xffffff);slot.mat.needsUpdate=true;},
      undefined,()=>{});};
  slots.forEach(s2=>show(s2,s2.i));
  let off=0;
  setInterval(()=>{off++;slots.forEach(s2=>show(s2,s2.i+off));},(spec.intervalS||18)*1000);
};
ZDOME_BUILD.videos=function(spec,api){
  const {THREE,G}=api;
  const items=(spec&&spec.items)||[];if(!items.length)return;
  const N=items.length,RAD=spec.radius||8.5,YC=spec.y!=null?spec.y:3.3,W2=2.5,H2=1.42;
  const loader=new THREE.TextureLoader();loader.setCrossOrigin("anonymous");
  const ph=(title)=>{const c=document.createElement("canvas");c.width=512;c.height=288;
    const g=c.getContext("2d");g.fillStyle="#0d1526";g.fillRect(0,0,512,288);
    g.fillStyle="#c9a44e";g.beginPath();g.moveTo(230,110);g.lineTo(230,178);g.lineTo(300,144);g.fill();
    g.fillStyle="#e9e4d6";g.font="22px system-ui";g.textAlign="center";g.fillText(title.slice(0,38),256,232);
    return new THREE.CanvasTexture(c);};
  items.forEach((it,i)=>{const a=Math.PI*0.5+(i-(N-1)/2)*0.55;
    const scr=new THREE.Group();
    scr.position.set(Math.cos(a)*RAD,YC,Math.sin(a)*RAD);scr.lookAt(0,YC,0);
    const mat=new THREE.MeshBasicMaterial({map:ph(it.title||it.id)});
    scr.add(new THREE.Mesh(new THREE.PlaneGeometry(W2,H2),mat));
    scr.add(new THREE.Mesh(new THREE.PlaneGeometry(W2+0.1,H2+0.1),
      new THREE.MeshBasicMaterial({color:0x22304d})).translateZ(-0.01));
    G.add(scr);
    loader.load("https://img.youtube.com/vi/"+it.id+"/hqdefault.jpg",
      t=>{mat.map=t;mat.needsUpdate=true;},undefined,()=>{});
    window.ZDOME_HIT&&ZDOME_HIT({v:scr.position.clone(),r:46,name:it.title||("Video "+it.id),
      sub:"YouTube — plays in an overlay above the dome",actLabel:"▶ Play",
      act:()=>{let ov=document.getElementById("ytov");
        if(!ov){ov=document.createElement("div");ov.id="ytov";
          ov.style.cssText="position:fixed;inset:0;z-index:90;background:rgba(5,7,15,.86);display:flex;align-items:center;justify-content:center";
          ov.innerHTML='<div style="position:relative;width:min(92vw,960px);aspect-ratio:16/9"><button id="ytx" style="position:absolute;top:-38px;right:0;font:16px system-ui;color:#e9e4d6;background:#101b31;border:1px solid #c9a44e;border-radius:6px;padding:.2em .7em;cursor:pointer">✕ close</button><iframe id="ytif" style="width:100%;height:100%;border:1px solid #c9a44e;border-radius:10px" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>';
          document.body.appendChild(ov);
          ov.querySelector("#ytx").onclick=()=>{ov.style.display="none";ov.querySelector("#ytif").src="";};}
        ov.style.display="flex";
        ov.querySelector("#ytif").src="https://www.youtube-nocookie.com/embed/"+it.id+"?autoplay=1";}});
  });
};

const __surfY=w=>w.kind==='station'?w.r*0.30:w.r; /*WORLD-MOD: where the habitat floor sits*/
function __worldsCfg(){ /*ZDOME-SEAM:worlds — worlds, patches and flight overrides from config*/
  const w=CFG.worlds;
  if(w){ if(Array.isArray(w))ZP.worlds=w;
    else{ if(w.patch)for(const p of w.patch){const t=ZP.worlds.find(x=>x.id===p.id);if(t)Object.assign(t,p);}
          if(w.add)ZP.worlds.push(...w.add); } }
  if(CFG.flightPatch)Object.assign(ZP.flight,CFG.flightPatch);
}
/* the glass floor: the drone may never go below it, on any world */
function boundsFor(zone,ZP){
  const R=ZP.dome.R;
  if(zone==="dome"){
    const yMin=ZP.dome.glassFloorY, yMax=ZP.dome.ocuY+ (ZP.flight.escapeThroughOculus?6:-0.6);
    return {yMin,yMax,kind:"dome",
      rAt:(y)=>{
        if(ZP.flight.escapeThroughOculus && y>ZP.dome.ocuY-0.35) return ZP.dome.ocuR*0.92; // the eye of the needle
        const yy=Math.max(0,Math.min(R*0.999,y));
        return Math.max(0.5,Math.sqrt(Math.max(0,R*R-yy*yy))*0.94);}};
  }
  if(zone==="space"){const B=ZP.space.bound;
    return {yMin:-B,yMax:B,kind:"space",rAt:()=>B};}
  const w=ZP.worlds.find(x=>x.id===zone);
  const dR=w.habitat.domeR;
  return {yMin:0.2,yMax:dR*0.98,kind:"world",world:w,
    cx:w.at[0], cz:w.at[2], cy:w.at[1]+__surfY(w), /*WORLD-MOD*/        // the habitat floor sits on the surface
    rAt:(y)=>{const yy=Math.max(0,Math.min(dR*0.999,y));
      return Math.max(0.4,Math.sqrt(Math.max(0,dR*dR-yy*yy))*0.94)}};
}
/* has the pilot threaded the oculus and left the hall? */
function escaped(F,ZP){
  return ZP.flight.escapeThroughOculus &&
         F.y>ZP.dome.ocuY+0.4 && Math.hypot(F.x,F.z)<ZP.dome.ocuR*1.2;
}
/* rocket transit: a lifted quadratic arc from A to B, timed by distance */
function transitPlan(from,to,ZP){
  const d=Math.hypot(to[0]-from[0],to[1]-from[1],to[2]-from[2]);
  // the control point must clear the HIGHER endpoint, else the arc dives at the far end
  const apex=Math.max(from[1],to[1])+ZP.transit.arcLift;
  const mid=[(from[0]+to[0])/2,apex,(from[2]+to[2])/2];
  return {from,to,mid,dur:Math.max(2.2,d*ZP.transit.secondsPerUnit),d};
}
function transitAt(P,u){
  const t=Math.max(0,Math.min(1,u)),v=1-t;
  return [v*v*P.from[0]+2*v*t*P.mid[0]+t*t*P.to[0],
          v*v*P.from[1]+2*v*t*P.mid[1]+t*t*P.to[1],
          v*v*P.from[2]+2*v*t*P.mid[2]+t*t*P.to[2]];
}
/* arrival: the embodiment the destination demands */
function embodimentOn(zone,ZP){
  if(zone==="space")return "rocket";
  if(zone==="dome")return "quad";
  const w=ZP.worlds.find(x=>x.id===zone);
  return w&&w.habitat?w.habitat.embodiment:"quad";
}
/* a docking point just inside a habitat dome, on the side facing the hall */
function dockPoint(w,ZP){
  const n=Math.hypot(w.at[0],w.at[2])||1;
  return [w.at[0]-w.at[0]/n*(w.r*0.15), w.at[1]+__surfY(w)+w.habitat.domeR*0.35, /*WORLD-MOD*/
          w.at[2]-w.at[2]/n*(w.r*0.15)];
}
/* COAST (chakra-core) → 3D line buffer on a sphere. Encoding: [lon×10, lat×10] */
function coastBuffer(COAST,radius){
  const D=Math.PI/180,out=[];
  for(const ring of COAST){
    let prev=null;
    for(let i=0;i<ring.length;i+=2){
      const lon=ring[i]/10*D, lat=ring[i+1]/10*D;
      const p=[radius*Math.cos(lat)*Math.cos(lon),radius*Math.sin(lat),
               radius*Math.cos(lat)*Math.sin(lon)];
      if(prev)out.push(prev[0],prev[1],prev[2],p[0],p[1],p[2]);
      prev=p;
    }
  }
  return Float32Array.from(out);
}
/*WORLDS-END*/
/*FLIGHT-BEGIN*/
function __spawn(){ /*ZDOME-SEAM:spawn — cinematic start at a distance by default*/
  const sp=(CFG.flight&&CFG.flight.spawn)||{zone:'space',pos:[0,20,26],yaw:Math.PI};
  ZONE=sp.zone||'dome';BND=boundsFor(ZONE,ZP);
  const f=flightInit();
  if(sp.pos){f.x=sp.pos[0];f.y=sp.pos[1];f.z=sp.pos[2];}
  if(sp.yaw!=null)f.yaw=sp.yaw;
  return f;
}
function flightInit(){
  return {x:0,y:2.2,z:3.4, vx:0,vy:0,vz:0, yaw:Math.PI, pitch:0, roll:0, thr:0.5, armed:true};
}
function flightStep(F,u,dt,B,EMB){
  dt=Math.min(dt,0.05);
  const E=ZP.embodiments[EMB||'quad'];
  const RATE=ZP.flight.rate, LEVEL=ZP.flight.level;
  F.yaw  += u.yaw*RATE*(S.sYaw!=null?S.sYaw:0.45)*dt; /*FLIGHT-MOD: yaw slowed + configurable*/
  F.pitch = F.pitch + (u.pitch*0.5*(S.sPitch!=null?S.sPitch:1) - F.pitch)*Math.min(1,LEVEL*dt); /*FLIGHT-MOD*/
  F.roll  = F.roll  + (u.roll *0.5*(S.sRoll!=null?S.sRoll:1) - F.roll )*Math.min(1,LEVEL*dt); /*FLIGHT-MOD*/
  const MT=ZP.flight.maxTilt;
  F.pitch = Math.max(-MT,Math.min(MT,F.pitch));
  F.roll  = Math.max(-MT,Math.min(MT,F.roll));
  F.thr   = Math.max(0,Math.min(1,F.thr + u.thr*0.9*dt));
  const sp=Math.sin(F.pitch),cp=Math.cos(F.pitch),sr=Math.sin(F.roll),cr=Math.cos(F.roll),
        sy=Math.sin(F.yaw),cy=Math.cos(F.yaw);
  const upX= -sr*cy + cr*sp*sy, upY = cr*cp, upZ =  sr*sy + cr*sp*cy; /*FLIGHT-MOD: roll is thrust-vectored — tilt right, go right*/
  const wG=(B&&B.world&&B.world.gravity!=null)?B.world.gravity:E.g; /*WORLD-MOD: gravity per world*/
  const G=ZP.flight.g*wG, HOVER=(ZP.flight.g/ZP.flight.hoverThr)*E.thrust;
  const T=F.thr*HOVER;
  if(S.gravity){ /*FLIGHT-MOD: ballistic — the original physics — only when gravity is on*/
    F.vx += (upX*T)*dt;
    F.vy += (upY*T - G)*dt;
    F.vz += (upZ*T)*dt;
  }else{ /*FLIGHT-MOD: altitude hold — throttle commands climb rate*/
    F.vx += (upX*HOVER*ZP.flight.hoverThr)*dt;
    F.vz += (upZ*HOVER*ZP.flight.hoverThr)*dt;
    const vyT=u.thr*2.4;
    F.vy += (vyT-F.vy)*Math.min(1,5*dt);
  }
  const k=ZP.flight.drag;
  F.vx-=F.vx*k*dt; F.vy-=F.vy*k*dt; F.vz-=F.vz*k*dt;
  F.x+=F.vx*dt; F.y+=F.vy*dt; F.z+=F.vz*dt;
  if(F.y>B.yMax+(B.cy||0)){F.y=B.yMax+(B.cy||0);F.vy=Math.min(0,F.vy)*0.2;}
  const bx=B.cx||0, bz=B.cz||0, by=B.cy||0;
  if(F.y<B.yMin+by){F.y=B.yMin+by;F.vy=Math.max(0,F.vy)*0.2;}   // the glass floor: a hard deck
  const dx2=F.x-bx, dz2=F.z-bz;
  const r=Math.hypot(dx2,dz2)||1e-9, rMax=B.rAt(F.y-by);
  if(r>rMax){const s2=rMax/r;F.x=bx+dx2*s2;F.z=bz+dz2*s2;
    const rad=[dx2/r,dz2/r], vr=F.vx*rad[0]+F.vz*rad[1];
    if(vr>0){F.vx-=rad[0]*vr*1.6;F.vz-=rad[1]*vr*1.6;}}
  return F;
}
/*FLIGHT-END*/
let F=null,BND=null,PILOT=false,padIdx=null;
let ZONE='dome', EMB='quad', TRANSIT=null, worldMeshes=[], craft={};
const KEY={};
addEventListener('keydown',e=>{
  if(e.target.closest&&e.target.closest('input,select,textarea'))return;
  KEY[e.code]=1;
  if(PILOT&&['KeyW','KeyS','KeyA','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();
  if(e.code==='KeyR'&&PILOT){F=flightInit();}
});
addEventListener('keyup',e=>{KEY[e.code]=0});
addEventListener('gamepadconnected',e=>{padIdx=e.gamepad.index;hudMsg('joystick connected: '+e.gamepad.id.slice(0,28));});
addEventListener('gamepaddisconnected',()=>{padIdx=null});
let mouseU={pitch:0,roll:0},mouseOn=false;
addEventListener('pointermove',e=>{
  if(!PILOT||!mouseOn)return;
  mouseU.roll  =Math.max(-1,Math.min(1,(e.clientX/innerWidth -0.5)*2.4));
  mouseU.pitch =Math.max(-1,Math.min(1,(0.5-e.clientY/innerHeight)*2.4));
},{passive:true});
const TSTK={thr:0,yaw:0,pitch:0,roll:0};
function readSticks(){
  const u={thr:0,yaw:0,pitch:0,roll:0};
  const k=c=>KEY[c]?1:0;
  u.thr  = k('KeyW')-k('KeyS');                       // throttle
  u.yaw  = k('KeyD')-k('KeyA');                       // yaw
  u.pitch= k('ArrowUp')-k('ArrowDown');               // pitch (nose)
  u.roll = k('ArrowRight')-k('ArrowLeft');            // roll
  if(mouseOn){u.pitch=u.pitch||mouseU.pitch;u.roll=u.roll||mouseU.roll;}
  u.thr=u.thr||TSTK.thr; u.yaw=u.yaw||TSTK.yaw;      // on-screen sticks (touch)
  u.pitch=u.pitch||TSTK.pitch; u.roll=u.roll||TSTK.roll;
  if(padIdx!==null&&navigator.getGamepads){
    const gp=navigator.getGamepads()[padIdx];
    if(gp){const dz=v=>Math.abs(v)<0.12?0:v;          // mode-2 sticks
      u.thr = -dz(gp.axes[1])||u.thr;
      u.yaw =  dz(gp.axes[0])||u.yaw;
      u.pitch= -dz(gp.axes[3])||u.pitch;
      u.roll=  dz(gp.axes[2])||u.roll;
      if(gp.buttons[1]&&gp.buttons[1].pressed)F=flightInit();}
  }
  return u;
}
function setEmbodiment(e){
  EMB=e;
  for(const k of Object.keys(craft))if(craft[k])craft[k].visible=(k===e)&&S.drone;
}
function launchTo(id){
  if(!PILOT||TRANSIT||ZONE===id)return;
  const w=ZP.worlds.find(x=>x.id===id); if(!w||!w.habitat)return;
  const plan=transitPlan([F.x,F.y,F.z],dockPoint(w,ZP),ZP);
  setEmbodiment('rocket');
  TRANSIT={plan,u:0,dest:id,label:w.label};
  hudMsg('rocket · burn to '+w.label+' · '+plan.dur.toFixed(0)+' s');
}
function hudMsg(m){const h=document.getElementById('hud');if(!h)return;
  const l=h.querySelector('.msg');if(l){l.textContent=m;setTimeout(()=>{if(l.textContent===m)l.textContent=''},2600)}}
/*DRONE-BEGIN*/
function dronePose(t){
  const x=3.1*Math.sin(t*0.00021), z=2.5*Math.sin(t*0.00017+1.3),
        y=3.3+1.1*Math.sin(t*0.00013);
  const vx=3.1*0.00021*Math.cos(t*0.00021), vz=2.5*0.00017*Math.cos(t*0.00017+1.3);
  const headY=Math.atan2(vx,vz);
  const bank=Math.max(-0.5,Math.min(0.5,-vx*420));
  const pitch2=Math.max(-0.3,Math.min(0.3,vz*300));
  return {x,y,z,headY,bank,pitch:pitch2};
}
/*DRONE-END*/
function placeCamera(t,time){
  const mode=(S.drone&&['follow','fpv','bottom'].includes(S.cam))?S.cam:
             (S.cam==='orbit'?'orbit':'interior');
  camera.rotation.set(0,0,0);
  if(drone&&drone.visible){
    if(PILOT&&F&&BND){
      const dt=Math.min(0.05,(time-(placeCamera._t||time))/1000)||1/60;
      const active=craft[EMB]||drone;
      if(TRANSIT){                                   /* the rocket flies itself */
        TRANSIT.u+=dt/TRANSIT.plan.dur;
        const p=transitAt(TRANSIT.plan,TRANSIT.u);
        const q=transitAt(TRANSIT.plan,Math.min(1,TRANSIT.u+0.02));
        F.x=p[0];F.y=p[1];F.z=p[2];F.vx=F.vy=F.vz=0;
        active.position.set(p[0],p[1],p[2]);
        active.lookAt(q[0],q[1],q[2]);active.rotateX(Math.PI/2);
        const fl=active.getObjectByName&&active.getObjectByName('flame');
        if(fl)fl.scale.setScalar(0.7+0.5*Math.sin(time*0.02));
        hudMsg('TRANSIT · '+TRANSIT.label+' · '+Math.round(TRANSIT.u*100)+'%');
        if(TRANSIT.u>=1){                            /* arrival: the world dictates the body */
          ZONE=TRANSIT.dest; BND=boundsFor(ZONE,ZP);
          setEmbodiment(embodimentOn(ZONE,ZP));
          const w=ZP.worlds.find(x=>x.id===ZONE);
          F=flightInit();F.x=w.at[0];F.z=w.at[2];F.y=w.at[1]+__surfY(w)+0.6; /*WORLD-MOD*/
          TRANSIT=null;
          hudMsg('arrived · '+w.label+' · '+ZP.embodiments[EMB].label);
        }
      }else{
        flightStep(F,readSticks(),dt,BND,EMB);
        if(ZONE==='dome'&&escaped(F,ZP)){            /* threaded the oculus */
          if(WG){const wy=WG.rotation.y;WG.rotation.y=0; /*WORLD-MOD: bake hall yaw into the pilot frame at escape*/
            const cw=Math.cos(wy),sw=Math.sin(wy),fx=F.x,fz=F.z;
            F.x=fx*cw - fz*sw; F.z=fx*sw + fz*cw; F.yaw-=wy;}
          ZONE='space';BND=boundsFor('space',ZP);
          hudMsg('clear of the dome · Moon and Mars habitats are in view · tap one to launch');
        }
        active.position.set(F.x,F.y,F.z);
        active.rotation.set(F.pitch,F.yaw,F.roll);   // the CRAFT tilts
        if(!placeCamera._em||time-placeCamera._em>100){placeCamera._em=time; /*FLIGHT-MOD: drone state emitter — 10 Hz*/
          const det={id:(CFG.drone&&CFG.drone.id)||'local',t:Date.now(),zone:ZONE,emb:EMB,
            x:F.x,y:F.y,z:F.z,yaw:F.yaw,pitch:F.pitch,roll:F.roll,vx:F.vx,vy:F.vy,vz:F.vz,thr:F.thr};
          window.ZDOME_DRONE=det;dispatchEvent(new CustomEvent('zdome:drone',{detail:det}));}
        if(active.userData.props){const spin=(0.35+F.thr)*0.55;
          for(const pr of active.userData.props)pr.rotation.z=time*spin*0.01;}
      }
      updHUD();
    }else{
      const p=dronePose(time);
      drone.position.set(p.x,p.y,p.z);
      drone.rotation.set(p.pitch,p.headY,p.bank);
      for(const pr of drone.userData.props)pr.rotation.z=time*0.09;
    }
  }
  placeCamera._t=time;
  if(mode==='interior'){
    const sway=STILL?0:0.3*Math.sin(time*0.00004);
    const rise=smooth(0.2,0.72,t)*34;
    camera.position.set(sway,1.7-rise,dolly);
    camera.lookAt(sway*0.5,5.4-rise,0);
    camera.rotateZ(0);                             // horizon level
  }else if(mode==='orbit'){
    const az=yaw+(STILL?0:time*0.00003);
    camera.position.set(8.4*Math.sin(az),3.1,8.4*Math.cos(az));
    camera.lookAt(0,4.2,0);
  }else if(mode==='follow'){
    const A=craft[EMB]||drone, p=A.position;
    const back=new THREE.Vector3(Math.sin(A.rotation.y),0,Math.cos(A.rotation.y));
    const d2=TRANSIT?7.5:2.6;
    camera.position.set(p.x-back.x*d2,p.y+d2*0.45,p.z-back.z*d2);
    camera.lookAt(p);                              // …the horizon stays level
  }else if(mode==='bottom'){
    const A=craft[EMB]||drone;
    camera.position.set(A.position.x,(BND&&BND.cy||0)+0.32,A.position.z+0.01);
    camera.lookAt(A.position);
  }else if(mode==='fpv'){
    const A=craft[EMB]||drone;
    camera.position.copy(A.position);
    camera.rotation.set(A.rotation.x,A.rotation.y,A.rotation.z,'YXZ');
    camera.rotateY(Math.PI);                       // in FPV the HORIZON tilts with the airframe
    camera.translateZ(0.12);
  }
  const wantFpv=mode==='fpv';
  for(const p of fpvProps){
    if(wantFpv&&p.parent!==camera)camera.add(p);
    if(!wantFpv&&p.parent===camera)camera.remove(p);
    if(wantFpv)p.rotation.z=time*0.11;
  }
  if(wantFpv&&camera.parent!==scene)scene.add(camera);
}

/* ---------- oculus scrub + pedestal/pillar attention ---------- */
const ART_SUB={"Kaivalya AGI":"Pursuing truth, well-being and wisdom.",
  "AyeTRIAD Loop":"A self-evolving loop of observation, synthesis and global feedback.",
  "Holy Grail Lab":"A multi-suitcase research laboratory for civilization-scale problems.",
  "Zistgah":"The living habitat — integrating technology, nature and humanity."};
const rotY=v=>v.clone().applyAxisAngle(new THREE.Vector3(0,1,0),yaw);
function projectUI(){
  if(!ok3d)return;
  const hot=document.getElementById('hot'),sl=document.getElementById('scrubline');
  const c=new THREE.Vector3(0,D.ocuY,0).project(camera);
  const e=new THREE.Vector3(D.ocuR,D.ocuY,0).project(camera);
  const px=(c.x*0.5+0.5)*innerWidth, py=(-c.y*0.5+0.5)*innerHeight;
  const rr=Math.max(30,Math.abs(e.x-c.x)*0.5*innerWidth);
  const vis=c.z<1&&py>-rr&&py<innerHeight*1.2&&S.cam==='interior';
  hot.style.display=vis?'block':'none';sl.style.display=vis?'block':'none';
  if(vis){hot.style.left=(px-rr)+'px';hot.style.top=(py-rr)+'px';
    hot.style.width=hot.style.height=rr*2+'px';
    sl.style.left=px+'px';sl.style.top=(py+rr+8)+'px';}
}
const pop=()=>document.getElementById('pop');
function __dbg(){ /*UI-MOD: on-screen variables for debug rounds*/
  let el=document.getElementById('zdbg');
  if(!el){el=document.createElement('pre');el.id='zdbg';
    el.style.cssText='position:fixed;left:12px;top:64px;z-index:40;margin:0;padding:.5em .7em;font:11px/1.5 ui-monospace,Menlo,monospace;color:#cfe0ff;background:rgba(8,11,30,.78);border:1px solid #22304d;border-radius:8px;pointer-events:none;display:none;white-space:pre';
    document.body.appendChild(el);}
  return el;}
const HITX=[]; /*UI-MOD: display hit registry (gallery frames, video screens, ...)*/
window.ZDOME_HIT=e=>HITX.push(e);
let popPinned=false;
function hitAt(cx2,cy2){
  if(!ok3d)return null;
  for(const wm of worldMeshes){                      // Moon / Mars habitat domes
    if(!wm.w.habitat)continue;
    const s2=wm.center.clone().applyAxisAngle(new THREE.Vector3(0,1,0),WG?WG.rotation.y:0).project(camera.clone()); /*WORLD-MOD*/
    if(s2.z>1)continue;
    const sx=(s2.x*0.5+0.5)*innerWidth, sy=(-s2.y*0.5+0.5)*innerHeight;
    if(Math.hypot(cx2-sx,cy2-sy)<Math.max(44,innerWidth*0.06))
      return {kind:'world',id:wm.w.id,name:wm.w.label+(wm.w.pin?" · "+wm.w.pin:""),
        sub:PILOT?('Launch — the drone becomes a transfer rocket, and on arrival a '+
             ZP.embodiments[embodimentOn(wm.w.id,ZP)].label.toLowerCase()+'.')
            :'Enable ⚙ → Quadrotor → I fly it, then thread the oculus to launch.',sx,sy};
  }
  for(const p of pedBase){
    const w=rotY(p.v),s=w.project(camera.clone());
    const sx=(s.x*0.5+0.5)*innerWidth, sy=(-s.y*0.5+0.5)*innerHeight;
    if(s.z<1&&Math.hypot(cx2-sx,cy2-sy)<Math.max(38,innerWidth*0.045))
      return {kind:'ped',name:p.name,sub:Object.assign({},ART_SUB,CFG.exhibitSubs||{})[p.name],sx,sy}; /*ZDOME-SEAM:exhibitSubs*/
  }
  for(const hx of HITX){ /*UI-MOD: registered display hits*/
    const w3=rotY(hx.v.clone()),s3=w3.project(camera.clone());
    const sx=(s3.x*0.5+0.5)*innerWidth, sy=(-s3.y*0.5+0.5)*innerHeight;
    if(s3.z<1&&Math.hypot(cx2-sx,cy2-sy)<(hx.r||40))
      return {kind:'x',name:hx.name,sub:hx.sub,sx,sy,act:hx.act,actLabel:hx.actLabel};}
  for(const v of cols3d){
    const w=rotY(v),s=w.project(camera.clone());
    const sx=(s.x*0.5+0.5)*innerWidth, sy=(-s.y*0.5+0.5)*innerHeight;
    if(s.z<1&&Math.hypot(cx2-sx,cy2-sy)<30)
      return {kind:'frac',name:'Zardosi fractal',sub:'Julia set, c = −0.8 + 0.156i — meenakari palette. Open and keep zooming.',sx,sy};
  }
  return null;
}
function showPop(hit){
  const el=pop();
  el.innerHTML=`<b>${hit.name}</b><span class="s2">${hit.sub}</span>
    <button>${hit.kind==='x'?(hit.actLabel||'Open'):hit.kind==='frac'?'◈ Open the fractal':
               hit.kind==='world'?(PILOT?'▲ Launch':'⟡ Seed AI'):'⟡ Seed AI'}</button>`; /*UI-MOD*/
  el.querySelector('button').onclick=()=>
    hit.kind==='x'?(hit.act&&hit.act()):
    hit.kind==='frac'?openFractal():
    hit.kind==='world'?launchTo(hit.id):seed(hit.name,hit.sub); /*UI-MOD*/
  el.style.left=hit.sx+'px';el.style.top=(hit.sy-24)+'px';el.style.display='block';
}
addEventListener('pointermove',ev=>{
  if(popPinned||ev.pointerType==='touch')return;
  const hit=hitAt(ev.clientX,ev.clientY);
  if(hit)showPop(hit);else pop().style.display='none';
},{passive:true});
addEventListener('click',ev=>{
  if(ev.target.closest('#pop,#hot,#calbar,#themeBtn,#setBtn,#settings,#fractal,button,a'))return;
  const hit=hitAt(ev.clientX,ev.clientY);
  if(hit){showPop(hit);popPinned=true}
  else{pop().style.display='none';popPinned=false}
});
/* the fractal chamber — actual Julia, zoom without end */
function openFractal(){
  const box=document.getElementById('fractal'),cv3=box.querySelector('canvas'),
        cap=box.querySelector('.cap');
  let z=1,cx0=0,cy0=0,dr=null;
  const draw=()=>{ZW.juliaCanvas(cv3,-0.8,0.156,cx0,cy0,z);
    cap.textContent=`Julia c = −0.8 + 0.156i · zoom ×${z<1000?z.toFixed(1):z.toExponential(1)} · drag to wander, wheel or pinch to descend`};
  draw();box.classList.add('on');
  cv3.onwheel=ev=>{ev.preventDefault();z*=ev.deltaY<0?1.35:1/1.35;z=Math.max(0.5,z);draw()};
  cv3.onpointerdown=ev=>{dr={x:ev.clientX,y:ev.clientY,cx0,cy0};cv3.setPointerCapture(ev.pointerId)};
  cv3.onpointermove=ev=>{if(!dr)return;
    cx0=dr.cx0-(ev.clientX-dr.x)/(0.25*cv3.width*z);
    cy0=dr.cy0-(ev.clientY-dr.y)/(0.25*cv3.width*z);draw()};
  cv3.onpointerup=cv3.onpointercancel=()=>dr=null;
  let pinch=null;
  cv3.ontouchstart=ev=>{if(ev.touches.length===2)
    pinch=Math.hypot(ev.touches[0].clientX-ev.touches[1].clientX,
                     ev.touches[0].clientY-ev.touches[1].clientY)};
  cv3.ontouchmove=ev=>{if(pinch&&ev.touches.length===2){ev.preventDefault();
    const d2=Math.hypot(ev.touches[0].clientX-ev.touches[1].clientX,
                        ev.touches[0].clientY-ev.touches[1].clientY);
    z=Math.max(0.5,z*d2/pinch);pinch=d2;draw()}};
  box.querySelector('.x').onclick=()=>box.classList.remove('on');
}

/* scrub (chakra mechanics) */
function scrubReadout(){
  const sl=document.getElementById('scrubline');
  if(Math.abs(T.off)>0.04){
    const dd=T.off>0?"+":"−";
    sl.innerHTML="Δ "+dd+Math.abs(T.off).toFixed(Math.abs(T.off)<2?1:0)+
      " days<button id='backNow'>⟲ now</button>";
    document.getElementById('backNow').onclick=()=>{T.off=0;onTimeChange()};
  } else sl.innerHTML="drag the oculus to scrub time · drag the hall to turn it";
}
function onTimeChange(){drawDial();buildCards();scrubReadout();}
(function(){
  const el=document.getElementById('hot');let dr=null;
  el.addEventListener('pointerdown',ev=>{dr={x:ev.clientX,off:T.off};
    try{el.setPointerCapture(ev.pointerId)}catch(e){}});
  el.addEventListener('pointermove',ev=>{if(!dr)return;
    T.off=dr.off+(ev.clientX-dr.x)/5;onTimeChange();ev.preventDefault();});
  const end=()=>dr=null;
  el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
  el.addEventListener('dblclick',()=>{T.off=0;onTimeChange()});
})();

/* rotate the hall: yaw + pitch (horizontal-dominant commits); wheel = dolly */
(function(){
  let dr=null,lastX=0,lastT2=0;
  addEventListener('pointerdown',ev=>{
    if(ev.target.closest('#hot,#pop,#calbar,#themeBtn,#setBtn,#settings,#fractal,button,a,input,select'))return;
    if(ev.clientY>innerHeight*0.62)return;
    dr={x:ev.clientX,y:ev.clientY,yaw:yawT,pitch:pitchT,commit:false};
    yawV=0;lastX=ev.clientX;lastT2=performance.now();
  },{passive:true});
  addEventListener('pointermove',ev=>{
    if(!dr)return;
    const dx=ev.clientX-dr.x,dy=ev.clientY-dr.y;
    if(!dr.commit){
      if(Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)*1.2){dr.commit=true;setDragging(true);}
      else if(Math.abs(dy)>16){dr=null;return}}
    if(dr.commit){                       // NB: only targets are written here. No GPU work.
      yawT=dr.yaw+dx*0.005;
      pitchT=Math.max(-0.35,Math.min(0.35,dr.pitch+dy*0.0022));
      const nt=performance.now(),ddt=Math.max(8,nt-lastT2);
      yawV=(ev.clientX-lastX)*0.005/ddt*16;      // for the flick
      lastX=ev.clientX;lastT2=nt;}
  },{passive:true});
  const end=()=>{if(dr&&dr.commit)yawT+=yawV*7;   // a flick keeps turning, then settles
    dr=null;setDragging(false);};
  addEventListener('pointerup',end);addEventListener('pointercancel',end);
  addEventListener('wheel',ev=>{
    if(ev.target.closest('#fractal,#calbar,#settings'))return;
    if(scrollY<innerHeight*0.4&&S.cam==='interior'){
      dolly=Math.max(5.2,Math.min(10,dolly+ev.deltaY*0.004));}
  },{passive:true});
})();

/* ---------- nebula: edge centres, faint mid thread, warp intro ---------- */
const cv=document.getElementById('nebula'),g=cv.getContext('2d');
const off=document.createElement('canvas'),og=off.getContext('2d');
const GLYPHS=[..."अकज्ञومعلم漢字知文εσοφίαЗнаниеידעACGTπΣ∞ॐعقلفہمعلمइल्म"];
const SPR=new Map();
function sprite(ch,hue,macro){
  const key=ch+hue+(macro?'M':'m');
  if(SPR.has(key))return SPR.get(key);
  const s=document.createElement('canvas');s.width=s.height=48;
  const c2=s.getContext('2d');c2.translate(24,26);
  c2.shadowColor=`hsl(${hue} 75% ${macro?60:78}%)`;c2.shadowBlur=macro?14:3;
  c2.fillStyle=c2.shadowColor;c2.font=`${macro?15:13}px serif`;c2.textAlign='center';
  c2.fillText(ch,0,0);SPR.set(key,s);return s;
}
let orbL=[],orbR=[],lor=[],stars=[],meteors=[],bootT=performance.now();
function sizeNebula(){
  cv.width=innerWidth*Math.min(DPR,1.5);cv.height=innerHeight*Math.min(DPR,1.5);
  off.width=Math.min(768,Math.ceil(cv.width/2));off.height=Math.min(768,Math.ceil(cv.height/2));
  const per=Math.round((STILL?60:(MOBILE?80:140))*S.density);
  const mk=()=>({a:Math.random()*6.283,r:Math.random(),
    g:GLYPHS[Math.random()*GLYPHS.length|0],p:Math.random()*6.283,
    hue:Math.random()<.72?(185+Math.random()*40|0):(38+Math.random()*18|0)});
  orbL=[...Array(per)].map(mk);orbR=[...Array(per)].map(mk);
  lor=[...Array(Math.round((STILL?50:(MOBILE?70:120))*S.density))].map(()=>({
    s:[Math.random()*4-2,Math.random()*4-2,20+Math.random()*10],
    g:GLYPHS[Math.random()*GLYPHS.length|0],hue:185+Math.random()*40|0}));
  stars=[...Array(150)].map(()=>[Math.random(),Math.random(),Math.random()*6.283]);
}
const midFade=(x,W)=>0.12+0.88*Math.min(1,Math.abs(x-W/2)/(W*0.30));
function drawOrbit(list,ccx,ccy,H,t,warp){
  const W=off.width;
  for(const p of list){
    const rad=(0.14+0.6*p.r)*H*.5*warp,w=0.000028+0.00008*(1-p.r);   // meditative
    const a=p.a+(STILL?0:t*w)+0.3*Math.sin(t*.00012+p.p);
    const x=ccx+rad*Math.cos(a),y=ccy+rad*Math.sin(a)*.62;
    og.globalAlpha=(p.r>.35?0.15:0.5)*midFade(x,W);
    og.drawImage(sprite(p.g,p.hue,p.r>.35),x-12,y-13);
  }
}

/* ---------- dawn (unchanged discipline) ---------- */
const lerpHex=(a,b,t)=>{const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16);
  const ch=s=>Math.round(((A>>s&255)*(1-t)+(B>>s&255)*t));
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`};
const lerp3=(a,b,c,t)=>t<0.5?lerpHex(a,b,t*2):lerpHex(b,c,(t-0.5)*2);
let themeMode='auto';
try{themeMode=localStorage.getItem('zistgah-theme')||'auto'}catch(e){}
function themeLabel(){const b=document.getElementById('themeBtn');
  if(b)b.textContent=themeMode==='auto'?'☼ dawn with scroll':'☾ keep the night';}
const themeBtnEl=document.getElementById('themeBtn');
if(themeBtnEl)themeBtnEl.onclick=()=>{
  themeMode=themeMode==='auto'?'night':'auto';
  try{localStorage.setItem('zistgah-theme',themeMode)}catch(e){}
  themeLabel();applyTheme();};
let targT=0, mixNow=0, mixTarget=0;
/* rgba lerp — panels now dissolve continuously instead of snapping at a threshold */
const lerpRGBA=(a,b,t)=>{const p=x=>x.match(/[\d.]+/g).map(Number);
  const A=p(a),B=p(b);
  return `rgba(${Math.round(A[0]+(B[0]-A[0])*t)},${Math.round(A[1]+(B[1]-A[1])*t)},`+
         `${Math.round(A[2]+(B[2]-A[2])*t)},${(A[3]+(B[3]-A[3])*t).toFixed(3)})`};
function paintTheme(mix){
  const st=document.documentElement.style;
  st.setProperty('--illum',mix.toFixed(3));
  st.setProperty('--bg',  lerp3('#050a18','#243052','#e7d9be',mix));
  st.setProperty('--ink', lerp3('#f2ecdd','#eee6d2','#2a2318',mix));
  st.setProperty('--mut', lerp3('#8d94a8','#9a99a0','#6b6257',mix));
  const pk=Math.max(0,Math.min(1,(mix-0.35)/0.45));          // a long, gentle cross-fade
  st.setProperty('--panel', lerpRGBA('rgba(6,11,26,.55)','rgba(247,240,226,.75)',pk));
  st.setProperty('--panelb',lerpRGBA('rgba(201,164,78,.28)','rgba(138,109,47,.45)',pk));
  cv.style.opacity=String(1-0.8*mix);
  if(ok3d){shellMat.opacity=0.4*(1-0.75*mix);
    scene.fog.color.set(lerp3('#050a18','#243052','#e7d9be',mix));}
}
function applyTheme(){                    // sets the TARGET; the frame loop eases toward it
  const raw=Math.pow(Math.min(1,targT),1.35)*0.88;
  mixTarget=themeMode==='night'?Math.min(raw,0.15):raw;
}
function stepTheme(){                     // dawn arrives at its own pace, never in a jump
  if(Math.abs(mixTarget-mixNow)<0.0015){if(mixNow!==mixTarget){mixNow=mixTarget;paintTheme(mixNow)}return}
  mixNow+=(mixTarget-mixNow)*0.045;
  paintTheme(mixNow);
}
addEventListener('scroll',()=>{
  const m=document.body.scrollHeight-innerHeight;
  targT=m>0?scrollY/m:0;
  applyTheme();
  document.getElementById('gl').style.opacity=targT>0.8?Math.max(0,1-(targT-0.8)*4):1;
},{passive:true});
/* brand appears whenever the great title is NOT on screen — above OR below */
new IntersectionObserver(es=>es.forEach(e=>
  document.getElementById('brand').classList.toggle('on',!e.isIntersecting)),
  {threshold:0.15}).observe(document.getElementById('arrival'));

/* ---------- frame loop ---------- */
let lastT=performance.now(),slow=0,running=true,frameNo=0,nextMeteor=performance.now()+3000;
let lastNeb=0,lastShell=0,nebReady=false;
document.addEventListener('visibilitychange',()=>{running=!document.hidden;
  if(running)requestAnimationFrame(frame)});
function frame(t){
  if(!running)return;frameNo++;
  const W=off.width,H=off.height;
  const boot=t-bootT;
  const warp=STILL?1:smooth(150,1350,boot);            // clouds warp in
  const lorA=STILL?1:smooth(1400,2400,boot);           // then the attractor breathes in

  stepTheme();
  /* damp the hall toward its target — the drag no longer drives the GPU directly */
  if(ok3d&&(Math.abs(yawT-yaw)>1e-4||Math.abs(pitchT-pitch)>1e-4)){
    yaw  += (yawT-yaw)  *(Q.dragging?0.45:0.12);
    pitch+= (pitchT-pitch)*(Q.dragging?0.45:0.12);
    G.rotation.y=yaw;G.rotation.x=pitch;
    if(WG&&ZONE==='dome'&&!TRANSIT)WG.rotation.y=yaw; /*WORLD-MOD: the planet below turns with the dome*/
  }

  /* the sky is a slow instrument: redraw on its own clock, and NEVER while dragging */
  const nebDue = !Q.dragging && (t-lastNeb > 1000/Q.nebulaHz);
  if(nebDue||!nebReady){lastNeb=t;nebReady=true;drawNebula(t,W,H,warp,lorA);}
  if(!Q.dragging&&t-lastShell>1000/Q.shellHz&&shellTex){lastShell=t;shellTex.needsUpdate=true;}
  compose(t);
  if(ok3d)render3D(t);
  const dt=t-lastT;lastT=t;
  if(dt>Q.budget+14){slow++;if(slow>18){downgrade();slow=0;}}else if(slow>0)slow--;
  if(!STILL)requestAnimationFrame(frame);
  else{renderer&&renderer.render(scene,camera);projectUI();
    if(S.debug&&(!frame._db||t-frame._db>200)){frame._db=t; /*UI-MOD*/
      const d2=window.ZDOME_DRONE||{};
      __dbg().textContent='zone '+ZONE+' · emb '+EMB+' · cam '+S.cam+' · hallYaw '+yaw.toFixed(2)
        +'\nF '+(F?('x '+F.x.toFixed(2)+' y '+F.y.toFixed(2)+' z '+F.z.toFixed(2)+' yaw '+F.yaw.toFixed(2)+' thr '+F.thr.toFixed(2)):'—')
        +'\nv '+(F?(F.vx.toFixed(2)+' '+F.vy.toFixed(2)+' '+F.vz.toFixed(2)):'—')+' · gravity '+(S.gravity?'ON':'hold')
        +'\nsens y/p/r '+S.sYaw+'/'+S.sPitch+'/'+S.sRoll+' · emit '+(d2.t?new Date(d2.t).toISOString().slice(11,19):'—');}}
}
function drawNebula(t,W,H,warp,lorA){
  og.clearRect(0,0,W,H);
  if(C)ZW.skyBand(og,W,H,C,dCur());                    // the real sky, not invented lines
  drawOrbit(orbL,W*0.12,H*0.34,H,t,warp);
  drawOrbit(orbR,W*0.88,H*0.34,H,t,warp);
  const steps=Math.max(1,Math.round(60/Q.nebulaHz));    // same drift per second at any rate
  for(const p of lor){
    if(!STILL)for(let q=0;q<steps;q++)p.s=ZW.lorenzStep(p.s,0.0012);
    const x=W*0.5+p.s[0]*(W*0.38/6.6), y=H*0.34+(p.s[2]-25)*(H*0.20/25);
    og.globalAlpha=0.38*lorA*midFade(x,W);
    og.drawImage(sprite(p.g,p.hue,false),x-12,y-13);
  }
  og.globalAlpha=1;
}
function compose(t){
  const bg=g.createRadialGradient(cv.width/2,cv.height*.30,0,cv.width/2,cv.height*.30,cv.height);
  bg.addColorStop(0,'#0a1630');bg.addColorStop(1,'#050a18');
  g.fillStyle=bg;g.fillRect(0,0,cv.width,cv.height);
  g.drawImage(off,0,0,cv.width,cv.height);
  g.fillStyle='#f2ecdd';
  for(const [qx,qy,ph2] of stars){
    g.globalAlpha=STILL?.6:.25+.55*((Math.sin(t/1100+ph2*7)+1)/2);
    g.fillRect(qx*cv.width,qy*cv.height,1.4,1.4)}
  g.globalAlpha=1;
  /* shooting stars */
  if(S.meteors&&!STILL&&!Q.dragging){
    if(t>nextMeteor&&meteors.length<2){
      meteors.push({x:cv.width*(0.15+Math.random()*0.7),y:-20,
        vx:(Math.random()<0.5?-1:1)*(2+Math.random()*2)*DPR,vy:(5+Math.random()*3)*DPR,life:1});
      nextMeteor=t+4000+Math.random()*5000;}
    for(const m of meteors){
      m.x+=m.vx*4;m.y+=m.vy*4;m.life-=0.016;
      const gr=g.createLinearGradient(m.x-m.vx*14,m.y-m.vy*14,m.x,m.y);
      gr.addColorStop(0,'rgba(242,236,221,0)');gr.addColorStop(1,`rgba(255,240,200,${0.85*m.life})`);
      g.strokeStyle=gr;g.lineWidth=1.6*DPR;g.beginPath();
      g.moveTo(m.x-m.vx*14,m.y-m.vy*14);g.lineTo(m.x,m.y);g.stroke();
      g.fillStyle=`rgba(255,246,214,${m.life})`;
      g.beginPath();g.arc(m.x,m.y,1.8*DPR,0,7);g.fill();}
    meteors=meteors.filter(m=>m.life>0&&m.y<cv.height+40);
  }
}
function render3D(t){
  {
    for(const p of pedBase)if(!STILL&&!Q.dragging)p.spin.rotation.y=t*0.0004;
    for(const m of glintMats)m.opacity=(S.glints?1:0)*(STILL?0.5:Math.max(0,Math.sin(t*0.0012+m.userData.ph))*0.85);
    placeCamera(targT,t);
    if(S.vr){
      renderer.setScissorTest(true);
      const halfW=innerWidth/2, eye=0.032;
      for(const [i2,sgn] of [[0,-1],[1,1]]){
        const camE=camera.clone();
        camE.aspect=halfW/innerHeight;camE.updateProjectionMatrix();
        camE.translateX(sgn*eye);
        renderer.setViewport(i2*halfW,0,halfW,innerHeight);
        renderer.setScissor(i2*halfW,0,halfW,innerHeight);
        renderer.render(scene,camE);}
      renderer.setScissorTest(false);
    } else {
      renderer.setViewport(0,0,innerWidth,innerHeight);
      renderer.render(scene,camera);
    }
    projectUI();
  }
}

function updHUD(){
  const h=document.getElementById('hud');if(!h||!F||h.style.display==='none')return;
  const spd=Math.hypot(F.vx,F.vy,F.vz);
  h.querySelector('.alt').textContent='ALT '+F.y.toFixed(1)+' m';
  h.querySelector('.spd').textContent='SPD '+spd.toFixed(1)+' m/s';
  h.querySelector('.thr').textContent=(TRANSIT?'TRANSIT':ZP.embodiments[EMB].label.toUpperCase())+
    ' · THR '+Math.round(F.thr*100)+'%';
  h.querySelector('.bar').style.width=(F.thr*100)+'%';
  const ah=document.querySelector('#horizon .ah');
  if(ah)ah.style.transform=`rotate(${(-F.roll*57.3).toFixed(1)}deg) translateY(${(F.pitch*90).toFixed(0)}px)`;
}
/* ---------- settings panel ---------- */
function buildSettings(){
  const el=document.getElementById('settings');
  el.innerHTML=`
   <h3>Sky</h3>
   <label>Density <select id="sDen">
     <option value="0.6">Calm</option><option value="1">Standard</option>
     <option value="1.6">Rich</option></select></label>
   <label>Lattice glints <input type="checkbox" id="sGl"></label>
   <label>Shooting stars <input type="checkbox" id="sMe"></label>
   <h3>Flight</h3>
   <label>Quadrotor <select id="sDr">
     <option value="off">Hidden</option><option value="auto">Autopilot</option>
     <option value="pilot">I fly it</option></select></label>
   <label>Mouse as stick <input type="checkbox" id="sMs"></label>
   <label>Gravity <input type="checkbox" id="sGr"></label> <!--FLIGHT-MOD-->
   <label>Yaw rate <input type="range" id="sSy" min="0.1" max="2" step="0.05"></label>
   <label>Pitch sens <input type="range" id="sSp" min="0.2" max="2" step="0.05"></label>
   <label>Roll sens <input type="range" id="sSr" min="0.2" max="2" step="0.05"></label> <!--FLIGHT-MOD: sensitivities-->
   <label>Camera <select id="sCam">
     <option value="interior">Interior</option><option value="orbit">Orbit</option>
     <option value="follow">Follow drone</option><option value="fpv">FPV</option>
     <option value="bottom">From below</option></select></label>
   <h3>Presence</h3>
   <label>VR split-screen <input type="checkbox" id="sVr"></label>
   <label>Debug overlay <input type="checkbox" id="sDb"></label> <!--UI-MOD-->
   <h3>Performance</h3>
   <label>Render scale <select id="sDpr">
     <option value="0.9">Fast</option><option value="1.15">Balanced</option>
     <option value="1.5">Sharp</option><option value="2">Maximum</option></select></label>
   <label>Sky refresh <select id="sHz">
     <option value="12">Tranquil</option><option value="20">Standard</option>
     <option value="30">Fluid</option></select></label>`;
  const q=id=>el.querySelector(id)||{style:{},options:[],addEventListener(){}};
  q('#sDen').value=String(S.density);q('#sGl').checked=S.glints;
  q('#sMe').checked=S.meteors;q('#sDr').value=S.droneMode||(S.drone?'auto':'off');
  q('#sMs').checked=!!S.mouseStick;
  q('#sGr').checked=!!S.gravity;q('#sSy').value=S.sYaw;q('#sSp').value=S.sPitch;q('#sSr').value=S.sRoll;q('#sDb').checked=!!S.debug; /*FLIGHT-MOD*/
  q('#sCam').value=S.cam;q('#sVr').checked=S.vr;
  const sync=()=>{const dis=q('#sDr').value==='off';
    for(const o of q('#sCam').options)
      if(['follow','fpv','bottom'].includes(o.value))o.disabled=dis;};
  sync();
  q('#sDen').onchange=e=>{S.density=+e.target.value;saveS();sizeNebula();if(ok3d)rebuildStars()};
  q('#sGl').onchange=e=>{S.glints=e.target.checked;saveS()};
  q('#sMe').onchange=e=>{S.meteors=e.target.checked;saveS()};
  q('#sDr').onchange=e=>{
    S.droneMode=e.target.value;S.drone=S.droneMode!=='off';
    PILOT=S.droneMode==='pilot';
    if(drone)drone.visible=S.drone;
    setEmbodiment(EMB);
    if(PILOT){F=__spawn();setEmbodiment('quad'); /*ZDOME-SEAM:spawn*/
      if(!['follow','fpv','bottom'].includes(S.cam)){S.cam='follow';q('#sCam').value='follow'}
      hudMsg(S.gravity?'armed · W/S throttle · A/D yaw · arrows pitch+roll · R reset':'armed · W/S climb (altitude holds) · A/D yaw · arrows pitch+roll · R reset'); /*FLIGHT-MOD*/}
    if(!S.drone&&['follow','fpv','bottom'].includes(S.cam)){S.cam='interior';q('#sCam').value='interior'}
    showFlightUI();
    sync();saveS()};
  q('#sMs').onchange=e=>{S.mouseStick=e.target.checked;mouseOn=S.mouseStick;saveS()};
  q('#sGr').onchange=e=>{S.gravity=e.target.checked;saveS();hudMsg(S.gravity?'gravity ON — ballistic physics':'gravity OFF — altitude hold')}; /*FLIGHT-MOD*/
  q('#sSy').oninput=e=>{S.sYaw=+e.target.value;saveS()};
  q('#sSp').oninput=e=>{S.sPitch=+e.target.value;saveS()};
  q('#sSr').oninput=e=>{S.sRoll=+e.target.value;saveS()}; /*FLIGHT-MOD*/
  q('#sCam').onchange=e=>{S.cam=e.target.value;showFlightUI();saveS()};
  q('#sVr').onchange=e=>{S.vr=e.target.checked;saveS()};
  q('#sDb').onchange=e=>{S.debug=e.target.checked;saveS();__dbg().style.display=S.debug?'block':'none'}; /*UI-MOD*/
  q('#sDpr').onchange=e=>{S.dpr=+e.target.value;Q.dpr=S.dpr;Q.tier=0;applyDPR();saveS()};
  q('#sHz').onchange=e=>{S.hz=+e.target.value;Q.nebulaHz=S.hz;Q.tier=0;saveS()};
}
const setBtnEl=document.getElementById('setBtn');
if(setBtnEl)setBtnEl.onclick=()=>{
  const p=document.getElementById('settings');if(p)p.classList.toggle('on');};

/* ---------- boot ---------- */
let __bootRan=false;
function __boot(){if(__bootRan)return;__bootRan=true; /*ZDOME-SEAM:configfile — boot deferred until the config file merges*/
__worldsCfg();F=__spawn(); /*ZDOME-SEAM:spawn — pure state, set before initGL so it holds even if WebGL fails*/
sizeNebula();initGL();buildSettings();
const $=id=>document.getElementById(id);
window.showFlightUI=function(){ /*UI-MOD: global so settings handlers resolve it post-wrap*/
  const touch=matchMedia('(hover:none)').matches;
  if($('hud'))    $('hud').style.display=PILOT?'block':'none';
  if($('horizon'))$('horizon').style.display=(PILOT&&S.cam==='fpv')?'block':'none';
  for(const id of ['stickL','stickR'])
    if($(id))$(id).style.display=(PILOT&&touch)?'block':'none';
}
showFlightUI();
/* virtual sticks for touch — a phone has no keyboard */
(function(){
  for(const side of ['L','R']){
    const pad=document.getElementById('stick'+side);   // siblings of #hud, not children
    if(!pad)continue;
    const knob=pad.querySelector('.knob');
    let act=null;
    pad.addEventListener('pointerdown',e=>{act=e.pointerId;pad.setPointerCapture(e.pointerId);move(e)});
    pad.addEventListener('pointermove',e=>{if(act===e.pointerId)move(e)});
    const up=()=>{act=null;
      if(side==='L'){TSTK.thr=0;TSTK.yaw=0}else{TSTK.pitch=0;TSTK.roll=0}
      if(knob)knob.style.transform='translate(-50%,-50%)'};
    pad.addEventListener('pointerup',up);pad.addEventListener('pointercancel',up);
    function move(e){
      const r=pad.getBoundingClientRect();
      const dx=Math.max(-1,Math.min(1,(e.clientX-r.left-r.width/2)/(r.width/2)));
      const dy=Math.max(-1,Math.min(1,(e.clientY-r.top-r.height/2)/(r.height/2)));
      if(side==='L'){TSTK.thr=-dy;TSTK.yaw=dx}else{TSTK.pitch=-dy;TSTK.roll=dx}
      if(knob)knob.style.transform=
        `translate(calc(-50% + ${dx*28}px), calc(-50% + ${dy*28}px))`;
      e.preventDefault();
    }
  }
})();
if(C){drawDial();buildCards();scrubReadout();setInterval(()=>{if(Math.abs(T.off)<0.04)onTimeChange()},60000);}
else{document.getElementById('calbar').style.display='none';}
themeLabel();applyTheme();
requestAnimationFrame(frame);
addEventListener('resize',()=>{sizeNebula();
  if(ok3d){applyDPR();camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}});
/* the 3D→2D→3D fix: once the 4s intro fade completes, scroll opacity answers instantly */
setTimeout(()=>document.getElementById('gl').classList.add('in'),STILL?0:1800);
__content();
}
;(function(){ /*ZDOME-SEAM:configfile*/
  const merge=(a,b)=>{for(const k in b){const v=b[k];
    if(v&&typeof v==='object'&&!Array.isArray(v)&&a[k]&&typeof a[k]==='object'&&!Array.isArray(a[k]))merge(a[k],v);
    else a[k]=v;}};
  const u=CFG.configUrl===undefined?'dome.config.json':CFG.configUrl;
  (u?fetch(u,{cache:'no-cache'}).then(r=>r.ok?r.json():{}).catch(()=>({})):Promise.resolve({}))
   .then(fc=>{merge(CFG,fc||{});try{__boot()}catch(e){console.error('zdome boot',e)}});
})();
setTimeout(()=>{document.getElementById('gl').style.transition='opacity .25s linear'},STILL?300:6200);
let interacted=false;
for(const ev of['wheel','touchstart','keydown'])
  addEventListener(ev,()=>interacted=true,{passive:true,once:true});
setTimeout(()=>{if(!interacted)
  document.getElementById('arrival').scrollIntoView(
    {behavior:STILL?'auto':'smooth',block:'center'})},STILL?300:4600);
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('on')),{threshold:.25});
document.querySelectorAll('.rev').forEach(el=>io.observe(el));

/* ---------- seeds + content ---------- */
const CANON="© 1993–2026 Abhishek Choudhary · AyeAI only · no fabrication · verify by execution · no flattening";
async function seed(id,caption){
  const payload=`ZISTGAH CONTEXT SEED\nelement: ${JSON.stringify({id,caption,habitat:"Zistgah"})}\ncanon: ${CANON}\ninstruction: Maintain contract and context. Ask before assuming.`;
  try{await navigator.clipboard.writeText(payload)}catch{prompt('Copy the seed:',payload)}
  const t2=document.getElementById('toast');t2.classList.add('on');
  setTimeout(()=>t2.classList.remove('on'),1900);
}
const DOMAINS=[["Artificial Intelligence","Consciousness-aligned intelligence systems for collective good."],
 ["Language","Universal expression across languages, scripts and cultures."],
 ["Health","Preventive, affordable and personalized health for all."],
 ["Knowledge","Preservation, synthesis and evolution of human knowledge."],
 ["Identity","Sovereign identity with continuity, privacy and dignity."],
 ["Education","Lifelong learning through adaptive, inclusive systems."],
 ["Governance","Ethical, transparent and participatory decision frameworks."]];
function __content(){ /*ZDOME-SEAM:domains — below-fold content honours the config*/
const _DOM=CFG.domains||DOMAINS;
document.getElementById('domains').innerHTML=_DOM.map(([b,p])=>
 `<div class="dom"><b>${b}</b><p>${p}</p></div>`).join('');
const MARK={
 kaivalya:'<circle cx="43" cy="43" r="30"/><ellipse cx="43" cy="43" rx="30" ry="12"/><ellipse cx="43" cy="43" rx="12" ry="30"/><circle cx="43" cy="43" r="5"/>',
 pratik:'<path d="M23 33 43 23 63 33 63 53 43 63 23 53 Z"/><path d="M23 33 43 43 63 33 M43 43 43 63"/><path d="M33 28 53 38 M33 58 53 48"/>',
 triad:'<circle cx="34" cy="36" r="15"/><circle cx="52" cy="36" r="15"/><circle cx="43" cy="52" r="15"/>',
 hgl:'<rect x="22" y="30" width="18" height="14"/><rect x="46" y="30" width="18" height="14"/><rect x="22" y="50" width="18" height="14"/><rect x="46" y="50" width="18" height="14"/><path d="M28 30 v-5 h6 M52 30 v-5 h6"/>',
 zist:'<path d="M20 60 A26 26 0 0 1 66 60 Z"/><path d="M30 60 38 44 46 60 M46 60 54 50 62 60"/><circle cx="43" cy="30" r="3"/>'};
const ART=[["Kaivalya AGI","kaivalya","Pursuing truth, well-being and wisdom."],
 ["PRATIK","pratik","Participatory Recursive Adaptive Trans-Intelligence Kernels."],
 ["Aye Triad Living Loop","triad","A self-evolving loop of observation, synthesis and global feedback."],
 ["Holy Grail Laboratory","hgl","A multi-suitcase research laboratory for civilization-scale problems."],
 ["Zistgah","zist","The living habitat — integrating technology, nature and humanity."]];
const _MARK=Object.assign({},MARK,CFG.marks||{}),_ART=CFG.art||ART; /*ZDOME-SEAM:marks,art*/
document.getElementById('exhibits').innerHTML=_ART.map(([b,m,p],i)=>
 `<article class="ex"><svg viewBox="0 0 86 86" aria-hidden="true">${_MARK[m]||''}</svg>
  <b>${b}</b><p>${p}</p><button class="seed" data-i="${i}">⟡ Seed AI</button></article>`).join('');
document.querySelectorAll('.seed').forEach(btn=>btn.onclick=()=>{
  const [b,,p]=_ART[+btn.dataset.i];seed(b,p);});
const THREADS=[
 ["ILM — the Linguistic Operating System",
  "Integrative Linguistic Multiscripting: one reversible identity layer across 68 writing systems, generalizing the Hindawi Programming System (public release 15 August 2004) and the Romenagri transliteration framework (GPL, 2003).",
  [["ilm.codes","https://ilm.codes"],["hindawiai on GitHub","https://github.com/hindawiai"],["project-ilm on GitHub","https://github.com/project-ilm"]]],
 ["CHAKRA — Temporal Cycle Observatory",
  "The instrument above this page. Ten calendar traditions, the lagna, the Moon's real terminator and coming festivals — all computed live from Keplerian mechanics, never looked up. The order of the calendar cards rotates daily: no tradition owns the top slot.",
  [["the observatory","https://github.com/project-ilm/chakra"]]],
 ["PEDLER — adaptive cognition since 2001",
  "A six-tuple Turing-machine extension over balanced ternary logic; first published November 2001, Indian Patent Application 3033/CHE/2011. The cognitive foundation beneath the ecosystem.",
  [["authoritative record (DOI)","https://doi.org/10.5281/zenodo.17497559"]]],
 ["TransEg — identity continuity",
  "Staggered upload with no implicit grants: typed identity layers, consent envelopes, hash-chained audit. Derived from PEDLER; the continuity chain runs Persistent Semantic Services → Staggered Upload → Persistent Identity → TransEg.",
  [["zistgah org on GitHub","https://github.com/zistgah"]]],
 ["Misty DOI — the publication rail",
  "Research workflows as code: metadata, packaging, DOI minting and timestamp proofs, automated end to end.",
  [["misty-doi (DOI)","https://doi.org/10.5281/zenodo.20719388"],["VGC methodology paper","https://doi.org/10.5281/zenodo.21264248"]]]];
const _THR=CFG.threads||THREADS; /*ZDOME-SEAM:threads*/
document.getElementById('threads').innerHTML=_THR.map(([b,p,links])=>
 `<div class="thread"><b>${b}</b><p>${p}</p><div class="links">${
   links.map(([t,u])=>`<a href="${u}" rel="noopener">${t} →</a>`).join('')}</div></div>`).join('');
} /* end __content */
