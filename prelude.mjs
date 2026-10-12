import * as THREE from 'three';
import {clamp,smooth,mix,PAGES} from './presentation.mjs?v=20261010-tips-stage-final';
import {WORKSHOP_OUTLINE} from './workshop-outline.mjs?v=20261010-tips-stage-final';
import {installationTitleMarkup,renderInstallationTitle} from './installation-title.mjs';
export const TITLE_CUES=[
 {t:.25,kind:'spark',name:'wordless-ignition'},
 {t:.78,kind:'word',name:'혼자서는'},{t:1.35,kind:'word',name:'막막했던'},{t:1.73,kind:'soft',name:'일도'},
 {t:3.50,kind:'spark',name:'AI와'},{t:3.96,kind:'word',name:'함께,'},{t:4.68,kind:'bloom',name:'현실로.'},
 {t:7.0,kind:'air',name:'간성초등학교'},{t:7.48,kind:'soft',name:'AI'},{t:8.16,kind:'bloom',name:'연수'}
];
const out=(a,b,t)=>1-Math.pow(1-clamp((t-a)/(b-a)),4);
const gate=(a,b,c,d,t)=>smooth(a,b,t)*(1-smooth(c,d,t));
const set=(node,opacity,x=0,y=0,scale=1,rotate=0)=>{
 node.style.opacity=opacity;node.style.transform=`translate3d(${x}px,${y}px,0) scale(${scale}) rotate(${rotate}deg)`;
};
export function preludeMarkup(page){
 if(page.kind==='title')return `<div class="title-film" aria-hidden="true"><div class="title-rail"><i></i><i></i><i></i><i></i><i></i></div><div class="hero-beat hero-alone"><span>혼자서는</span> <br><span>막막했던</span> <span>일도</span></div><div class="hero-beat hero-together"><span>AI와</span> <span>함께,</span> <br><span>현실로.</span></div></div><h1 class="final-title" aria-label="간성초등학교 AI 연수"><span class="school-name">간성초등학교</span> <span class="course-name"><b class="final-ai">AI</b> <span class="final-training">연수</span></span></h1>`;
 if(page.kind==='contents')return `<div class="contents-copy"><h1>목차</h1><ol class="contents-list">${WORKSHOP_OUTLINE.map(item=>{const tag=item.target?'a':'span',navigation=item.target?` href="#${item.target}" data-go="${PAGES.findIndex(p=>p.id===item.target)}"`:'';return `<li><${tag} class="contents-entry${item.practice?' contents-practice':''}${item.target?'':' contents-planned'}"${navigation}><span class="contents-dot" aria-hidden="true"></span><span>${item.label}</span>${item.target?'<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M7 20h24M21 10l10 10-10 10"/></svg>':''}</${tag}></li>`;}).join('')}</ol></div>`;
 if(page.kind==='installation-title')return installationTitleMarkup(page);
 return `<div class="mindset-title-copy"><h1 aria-label="AI를 대하는 자세"><span class="chapter-line"><span data-letter="0">AI를</span></span><span class="chapter-line"><span data-letter="1">대하는</span> <span data-letter="2">자세</span></span></h1><div class="mindset-rule" aria-hidden="true"><i></i></div></div>`;
}
export function renderPreludeText(screen,page,t,reduced){
 if(reduced)t=page.duration;
 if(page.kind==='title'){
  const first=screen.querySelector('.hero-alone'),second=screen.querySelector('.hero-together');
  first.style.opacity=1-smooth(3.12,3.36,t);second.style.opacity=1-smooth(6.43,6.68,t);
  [[first,[.78,1.35,1.73]],[second,[3.50,3.96,4.68]]].forEach(([parent,times])=>{
   parent.querySelectorAll('span').forEach((word,i)=>{const p=smooth(times[i],times[i]+.27,t);set(word,p,(1-p)*(i===0?-60:25),(1-p)*65,1+(1-p)*.06,(1-p)*-4);});
  });
  const final=screen.querySelector('.final-title'),schoolIn=smooth(7.0,7.3,t),aiIn=smooth(7.48,7.75,t),trainingIn=smooth(8.16,8.43,t);
  final.style.opacity=t>=7?1:0;final.setAttribute('aria-hidden',String(t<8.43));
  set(final.querySelector('.school-name'),schoolIn,0,(1-schoolIn)*48);
  set(final.querySelector('.final-ai'),aiIn,0,(1-aiIn)*90,1+(1-aiIn)*.10);
  set(final.querySelector('.final-training'),trainingIn,0,(1-trainingIn)*70,1+(1-trainingIn)*.06);
  screen.querySelectorAll('.title-rail i').forEach((line,i)=>{
   const enter=out(.10+i*.10,.40+i*.10,t),leave=smooth(6.8+i*.06,7.15+i*.06,t);
   line.style.transform=`scaleX(${enter*(1-leave)})`;line.style.opacity=.18+.18*gate(i,1+i,1.8+i,2.1+i,t);
  });
 }else if(page.kind==='contents'){
  const heading=smooth(.2,.5,t);set(screen.querySelector('.contents-copy h1'),heading,0,(1-heading)*35);
  screen.querySelectorAll('.contents-entry').forEach((entry,i)=>{const p=smooth(.55+i*.13,.85+i*.13,t);set(entry,p,(1-p)*-28);if(entry.tagName==='A')entry.inert=p<.98;});
 }else if(page.kind==='installation-title'){
  renderInstallationTitle(screen,t,reduced);
 }else{
  screen.querySelectorAll('[data-letter]').forEach((letter,i)=>{
   const p=smooth(.35+i*.21,.65+i*.21,t);set(letter,p,0,(1-p)*105,1+(1-p)*.12,(-1+p)*7);
  });
  const rule=screen.querySelector('.mindset-rule');rule.style.opacity=smooth(1.4,1.7,t);rule.querySelector('i').style.transform=`scaleX(${out(1.3,2.3,t)})`;
 }
}

// One renderer, three new scene roots. Text never inherits the 3D camera motion.
export function createPreludeWorld({scene,blue,white,pale,lineBlue,plate,torus,sphere,motifs,seeded}){
 const v=(x,y,z=0)=>new THREE.Vector3(x,y,z),TAU=Math.PI*2;
 const roots=[-60,-40,-20].map(x=>{const r=new THREE.Group();r.position.x=x;scene.add(r);return r;});
 const groups=roots.map(r=>{const g=new THREE.Group();r.add(g);return g;});
 const monogram=new THREE.Group();groups[0].add(monogram);
 const letters=[plate(.46,2.7,.42,blue,.055),plate(.46,2.7,.42,blue,.055),plate(1.1,.38,.42,blue,.055),plate(.49,2.60,.42,blue,.055)];
 const rests=[[-1.0,0,-.33],[-.10,0,.33],[-.55,-.35,0],[1.03,0,0]];
 letters.forEach(m=>monogram.add(m));
 const orbitMaterial=blue.clone();orbitMaterial.emissive=new THREE.Color(0x2255ed);orbitMaterial.emissiveIntensity=.12;
 const titleRings=[0,1].map(i=>{const r=torus(3.35+i*.68,i===0?.035:.022,orbitMaterial,Math.PI*(i===0?1.20:1.02));groups[0].add(r);return r;});
 const shards=Array.from({length:20},(_,i)=>{const m=plate(.18+seeded(i)*.32,.38+seeded(i+3)*.54,.11,i%4===0?blue:white,.035);groups[0].add(m);return m;});
 const titleMotifs=motifs.map(m=>{const clone=m.clone(true);groups[0].add(clone);return clone;});
 const titlePath=new THREE.CatmullRomCurve3([v(-5.5,3.3,10.8),v(-2.3,.5,11.4),v(.8,1.2,12.4),v(4.0,2.8,13.8),v(-1.5,.75,12.0),v(2.3,1.8,13.5),v(-.8,.9,13.2),v(.25,.7,14.3)]);
 const cameraBeats=[0,.9,2.15,2.85,4.35,5.25,6.8,8.9];
 // Contents: four chapter ideas enter a connected dimensional orbit.
 const tocMotifs=motifs.map(m=>{const clone=m.clone(true);groups[1].add(clone);return clone;});
 const tocRing=torus(2.65,.034,orbitMaterial,Math.PI*1.70);tocRing.rotation.set(.62,-.30,.12);tocRing.position.z=-.18;groups[1].add(tocRing);
 const tocPoints=Array.from({length:4},()=>{const s=sphere(.10,blue);groups[1].add(s);return s;});
 const tocPlates=Array.from({length:4},()=>{const p=plate(1.58,1.58,.12,pale,.20);groups[1].add(p);return p;});
 // Chapter title: two spacious, tilted paths gather around the original idea motif.
 const chapterMotifs=motifs.map(m=>{const clone=m.clone(true);groups[2].add(clone);return clone;});
 const chapterRings=Array.from({length:2},(_,i)=>{const r=torus(3.05+i*.50,i===0?.035:.021,orbitMaterial,Math.PI*(i===0?1.25:1.05));r.position.y=i===0?.28:.16;groups[2].add(r);return r;});
 function pose(i,t,a,reduced){
  const duration=[10,4,5][i],idle=reduced?0:Math.max(0,a-duration),life=reduced?0:Math.sin(a*.6)*.025;
  if(i===0){
   const burst=gate(2.16,2.38,2.75,3.05,t),flip=gate(4.2,4.42,4.9,5.15,t);
   const bloom=smooth(2.65,4.0,t),settle=smooth(6.25,8.75,t),fly=smooth(.15,1.3,t);
   groups[0].position.set(mix(1.9,4.05,settle),.15+Math.sin(idle*.65)*.06,0);
   groups[0].scale.setScalar(mix(1.13,.91,settle));
   monogram.rotation.set(mix(.12,.02,settle),mix(-.68+Math.sin(t*1.05)*.65+flip*1.5,-.22,settle)+Math.sin(idle*.4)*.025,mix(-.1,.025,settle));
   monogram.scale.setScalar(mix(1.2,.94,bloom));
   letters.forEach((letter,j)=>{
    const on=out(.28+j*.19,1.5+j*.19,t),[x,y,zr]=rests[j];
    letter.position.set(x+(j%2?1:-1)*((1-on)*6+burst*.75),y+(j<2?1:-1)*((1-on)*3+burst*.45),Math.sin(on*Math.PI)*2.5+burst*(j%2?1.4:-.8));
    letter.rotation.set((1-on)*(j%2?1:-1)*2.6+burst*.45,(1-on)*3.3+burst*(j%2?-.65:.65),zr+(1-on)*(j%2?1:-1)*2.4);
    letter.scale.setScalar(Math.max(.001,on));
   });
   titleRings.forEach((r,j)=>{
    const on=out(.12+j*.1,.9+j*.13,t),turn=t*([.72,-.61][j])*(1-settle)+[.32,3.80][j]*settle+idle*(j===0?.020:-.016);
    r.rotation.set(j===0?1.10:-.74,j===0?.30:-.62,turn);r.position.y=j===0?.40:-.38;const k=Math.max(.001,on*mix(.80,1,bloom));r.scale.set(k*1.08,k*.94,k);
   });
   shards.forEach((m,j)=>{
    const angle=j*2.39996+.4,radius=mix(.28,3.35+seeded(j)*1.5,fly),fade=smooth(5.9,7.8,t);
    m.position.set(Math.cos(angle)*radius,Math.sin(angle)*radius*.75,(seeded(j+1)-.5)*2.4);
    m.rotation.set(j*.3+t*.12*(1-settle),angle+t*.2*(1-settle),angle);
    m.scale.setScalar(Math.max(.001,out(.05+j*.035,.55+j*.035,t)*(1-fade)*.75));
   });
   titleMotifs.forEach((m,j)=>{
    const on=out(2.5+j*.19,3.3+j*.19,t),angle=j*Math.PI/2+.38+t*.10*(1-settle)+.78*settle+idle*.012,radius=mix(3.35,3.20,settle);
    m.position.set(Math.cos(angle)*radius,Math.sin(angle)*radius*.83,Math.sin(angle)*.5-.20);
    m.rotation.set(.1,Math.sin(t*.35+j)*.20*(1-settle)+idle*.012,Math.sin(angle)*.03);
    m.scale.setScalar(Math.max(.001,on*mix([.43,.5,.46,.44][j],[.28,.34,.31,.30][j],settle)));
   });
  }else if(i===1){
   groups[1].position.set(3.9,.1+Math.sin(idle*.65)*.06,0);groups[1].rotation.set(.05,life,0);
   tocRing.rotation.z=.12+t*.09+idle*.021;const ringIn=Math.max(.001,out(.2,1.35,t));tocRing.scale.set(ringIn*1.08,ringIn*.94,ringIn);
   tocMotifs.forEach((m,j)=>{
    const on=out(.65+j*.25,1.55+j*.25,t),angle=j*Math.PI/2+.72;
    const x=Math.cos(angle)*2.25,y=Math.sin(angle)*2.25;
    m.position.set(x,y,.5);m.rotation.set(.04,-.15+life,(1-on)*-.4);m.scale.setScalar(Math.max(.001,on*[.46,.50,.48,.47][j]));
    tocPlates[j].position.set(x,y,.02);tocPlates[j].rotation.set(.05,(1-on)*1.8,-.08);tocPlates[j].scale.setScalar(Math.max(.001,on));
    tocPoints[j].position.set(Math.cos(angle+.55)*2.3,Math.sin(angle+.55)*2.3,0);tocPoints[j].scale.setScalar(Math.max(.001,on));
   });
  }else{
   groups[2].position.set(4.1,.12+Math.sin(idle*.7)*.06,0);groups[2].rotation.y=life;
   chapterMotifs.forEach((m,j)=>{
    const on=out(.2+j*.27,1.5+j*.27,t),angle=j*Math.PI*2/3+.3;
    const central=j===0;
    m.position.set(central?0:Math.cos(angle)*2.7,central?.05:Math.sin(angle)*2.15,central?.4:-.3);
    m.rotation.set(.05,-.2+life,(1-on)*.5);m.scale.setScalar(Math.max(.001,on*(central?1.03:.42)));
   });
   chapterRings.forEach((r,j)=>{
    r.rotation.set(j===0?.92:-.62,j===0?.28:-.45,t*(j===1?-.12:.16)+idle*(j===0?.021:-.018)+j*2.4);
    const k=Math.max(.001,out(.25+j*.2,1.7+j*.2,t));r.scale.set(k*1.08,k*.94,k);
   });
  }
 }
 function camera(i,t){
  let phase=1;for(let k=0;k<cameraBeats.length-1;k++)if(t<cameraBeats[k+1]){phase=(k+smooth(cameraBeats[k],cameraBeats[k+1],t))/(cameraBeats.length-1);break;}
  const pos=i===0?titlePath.getPoint(phase):new THREE.Vector3(mix(i===1?-1.6:2.6,.3,smooth(0,[10,4,5][i],t)),mix(1.8,.8,smooth(0,[10,4,5][i],t)),14.2);
  pos.x+=roots[i].position.x;return {position:pos,target:v(roots[i].position.x,0,0)};
 }
 function particles(buffer,i,t,a,total,reduced){
  const duration=[10,4,5][i],end=smooth(duration-2,duration,t),idle=reduced?0:Math.max(0,a-duration),time=t+idle*.20,base=groups[i].position;
  for(let j=0;j<total;j++){
   const q=seeded(j+2),theta=j*2.39996+time*.19,phi=Math.acos(2*q-1);let x,y,z;
   if(i===0){
    const arrive=out(0,1.3,t),unfold=smooth(2.5,4,t),radius=mix(6.8+q*5,1.35+q*1.8,arrive)+Math.sin(q*Math.PI)*unfold*.4;
    const shock=gate(2.15,2.35,2.65,3.05,t)+gate(4.2,4.4,4.75,5.1,t);
    const orbit=theta+Math.sin(time*.25)*.3+shock*.48;
    x=Math.cos(orbit)*Math.sin(phi)*radius*(1+shock*.65);y=Math.cos(phi)*radius*.86*(1+shock*.40);z=Math.sin(orbit)*Math.sin(phi)*radius*.7+shock*(q-.5)*2;
    if(j%5===0){x=Math.cos(theta)*(2.7+q*.25);y=Math.sin(theta)*(2.4+q*.25);z=Math.sin(theta*.5)*.4;}
   }else if(i===1){const angle=theta,radius=2.3+(q-.5)*.16;x=Math.cos(angle)*radius;y=Math.sin(angle)*radius;z=Math.sin(angle*2+time*.2)*.22;}
   else{const radius=1.75+q*1.3;x=Math.cos(theta)*Math.sin(phi)*radius;y=Math.cos(phi)*radius*.9;z=Math.sin(theta)*Math.sin(phi)*radius*.7;}
   const scale=i===0?groups[0].scale.x:1;
   buffer[j*3]=roots[i].position.x+base.x+x*scale;buffer[j*3+1]=base.y+y*scale;buffer[j*3+2]=base.z+z*scale;
  }
  return {opacity:mix(.65,.27,end),size:mix(.048,.034,end)};
 }
 return {roots,pose,camera,particles};
}
