import * as THREE from 'three';
import {clamp,smooth,mix} from './presentation.mjs';
import {questionOutlineGeometry} from './question-outline.mjs';
const out=(a,b,t)=>1-Math.pow(1-clamp((t-a)/(b-a)),4);
export function closingMarkup(page){
 return `<h1 class="closing-copy closing-copy-${page.closingIndex}" aria-label="${page.title}">${page.lines.map((line,i)=>`<span class="closing-line" data-closing-line="${i}">${line.split(' ').map((word,n)=>`${n?' ':''}<span class="closing-word" data-closing-word="${i}-${n}">${word}</span>`).join('')}</span>`).join(' ')}</h1>`;
}
export function renderClosingText(screen,page,t,reduced){
 screen.querySelectorAll('[data-closing-line]').forEach((line,i)=>line.querySelectorAll('.closing-word').forEach((word,n)=>{
  const at=page.times[i][n],p=reduced?1:smooth(at,at+.32,t);
  word.style.opacity=p;word.style.transform=`translate3d(${(1-p)*-10}px,${(1-p)*38}px,0) rotateX(${(1-p)*-16}deg)`;
 }));
}
// Original dimensional learning motifs. Neither scene implies a real AI operation.
export function createClosingWorld({scene,blue,white,pale,plate,torus,sphere,taperedPath,seeded}){
 const v=(x,y,z=0)=>new THREE.Vector3(x,y,z);
 const roots=[320,340].map(x=>{const r=new THREE.Group();r.position.x=x;scene.add(r);return r;});
 const groups=roots.map(r=>{const g=new THREE.Group();r.add(g);return g;});
 const glow=blue.clone();glow.emissive=new THREE.Color(0x2255ed);glow.emissiveIntensity=.22;
 const appear=(o,p,k=1)=>{o.visible=p>.001;o.scale.setScalar(Math.max(.001,p*k));};
 function book(){
  const g=new THREE.Group(),leaves=[];
  for(const side of [-1,1]){
   // Both halves occupy the right-hand stack when closed. Only the front
   // half crosses the spine, through the viewer-facing side, to the left.
   const front=side===-1,hinge=new THREE.Group();g.add(hinge);const cover=plate(1.62,2.18,.06,blue,.09);cover.position.set(.81,0,front?.15:-.15);hinge.add(cover);
   const pages=[];
   for(let i=0;i<3;i++){const pageHinge=new THREE.Group(),p=new THREE.Mesh(new THREE.BoxGeometry(1.48,2.02,.014),i===2?white:pale);p.position.set(.78,0,(front?1:-1)*(.07-i*.025));p.castShadow=true;p.receiveShadow=true;pageHinge.add(p);hinge.add(pageHinge);pages.push(pageHinge);}
   const ink=new THREE.Group();for(let i=0;i<4;i++){const line=plate(i===0?.95:.80,.055,.028,blue,.018);line.position.set(.78,.52-i*.30,front?-.035:.035);ink.add(line);}pages[2].add(ink);
   if(front){const coverMark=plate(.75,.075,.018,pale,.025);coverMark.position.set(.81,.34,.225);hinge.add(coverMark);}
   leaves.push({hinge,side,ink,pages});
  }
  const spine=plate(.11,2.12,.28,blue,.04);g.add(spine);return {g,leaves};
 }
 const books=[book(),book()];books.forEach((b,i)=>groups[i].add(b.g));
 const question=new THREE.Mesh(questionOutlineGeometry(),glow);groups[0].add(question);
 const learnedCheck=taperedPath([[.34,.05,.25],[.65,-.26,.25],[1.20,.39,.25]],.075,glow);delete learnedCheck.userData.motionCurve;books[0].leaves[1].pages[2].add(learnedCheck);learnedCheck.name='learning-page-confirmation';
 const arcs=groups.map((g,i)=>[0,1].map(j=>{const m=torus(i?4.05+j*.65:3.05+j*.44,.030-j*.012,glow,Math.PI*(1.30-j*.19));g.add(m);return m;}));
 const seeds=Array.from({length:11},()=>{const m=sphere(.045,glow);groups[1].add(m);return m;});
 function pose(i,t,a,reduced){
  const duration=i?7.6:7,idle=reduced?0:Math.max(0,a-duration),time=t+idle*.20,enter=out(.15,.85,t),open=smooth(1.15,3.15,t);
  const g=groups[i];g.position.set(i?0:4.05,i?-2.18:.12+Math.sin(idle*.62)*.035,0);
  g.scale.setScalar(i?.80:.94);g.rotation.y=Math.sin(idle*.36)*.025;
  books[i].g.position.set(0,i?0:-.42,.1);books[i].g.rotation.set(i?-.58:-.14,i?0:-.20,i?0:-.05);appear(books[i].g,enter,i?.80:1);
  // Fixed back cover, with the front cover making a single 180-degree
  // turn from right to left. Paper follows the same forward arc.
  books[i].leaves.forEach(({hinge,side,pages})=>{
   const front=side===-1,coverAngle=front?-Math.PI*open:0;hinge.rotation.y=coverAngle;
   pages.forEach((page,j)=>{const unfold=smooth(1.38+j*.13,3.28+j*.13,t);page.rotation.y=(front?-Math.PI*unfold:0)-coverAngle;});
  });
  arcs[i].forEach((arc,j)=>{arc.rotation.set(i?1.13:j?.85:-.70,i?.12:j?-.35:.30,j*2.3+time*(j?-.12:.15));arc.scale.set(i?1.22:1,i?.64:1,1);arc.visible=t>.22;});
  if(i===0){
   question.position.set(-.62,mix(2.2,1.56,smooth(.6,2.4,t)),.55);question.rotation.set(.03,-.18+Math.sin(time*.35)*.06,.05);appear(question,out(.5,1.4,t),1.18);
   books[0].leaves[1].ink.visible=t<4.3;appear(learnedCheck,smooth(4.65,5.25,t));
   question.scale.multiplyScalar(1-smooth(4.0,5.25,t)*.43);
   arcs[0][1].visible=false;
  }else{
   seeds.forEach((seed,j)=>{const q=(seeded(j)+time*.055)%1,angle=j*2.39996;seed.position.set(Math.cos(angle)*mix(.8,4.8,q),Math.sin(angle)*mix(.15,.75,q),Math.sin(q*Math.PI)*1.1);appear(seed,smooth(2,3.6,t),.65+Math.sin(q*Math.PI)*.75);});
  }
 }
 function camera(i,t){const p=smooth(0,5.6,t);return {position:v(320+i*20+mix(i?0:1.5,i?0:.25,p),mix(1.7,.65,p),mix(15.1,14.6,p)),target:v(320+i*20,0,0)};}
 function particles(buffer,i,t,a,total,reduced){const time=reduced?t:t+Math.max(0,a-(i?7.6:7))*.18,g=groups[i];for(let j=0;j<total;j++){const q=seeded(j+2),angle=j*2.39996+time*.21,r=1.25+seeded(j+5)*(i?3.65:2.10),phi=Math.acos(2*q-1);buffer[j*3]=roots[i].position.x+g.position.x+Math.cos(angle)*Math.sin(phi)*r;buffer[j*3+1]=g.position.y+Math.cos(phi)*r*(i?.20:.74);buffer[j*3+2]=Math.sin(angle)*Math.sin(phi)*r*.60;}}
 return {roots,pose,camera,particles};
}
