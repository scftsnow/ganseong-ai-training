import * as THREE from 'three';
import {PAGES,clamp,smooth,mix} from './presentation.mjs?v=20261010-tips-stage-final';
import {USAGE_TIPS} from './usage-tips-data.mjs';
import {questionOutlineGeometry} from './question-outline.mjs';
const out=(a,b,t)=>1-Math.pow(1-clamp((t-a)/(b-a)),4);
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export const TIP_HEADS=[['작업 난이도에 맞는 ','모델을 선택하세요'],['완벽한 지시를 하기 보다, ','질문을 받으세요'],['내가 잘 모르는 분야는 ','조사해서 답하게 하세요.'],['중요한 내용은 ','문서로 남기게 하세요'],['AI에게 ','권한을 주세요.']];
export const TIP_PHRASES=[
 [['일상적인 일은 ','저렴하고 빠른 모델에게,'],['복잡한 일만 ','똑똑하고 비싼 모델에게 맡기세요.']],
 [['원하는 것은 간단히 말하고, ',"'질문해' 한 마디로 ",'아이디어를 구체화하세요.']],
 [["'웹리서치'로 ",'인터넷에서 관련 내용을 ','심층 조사하도록 시키세요.'],['내가 모르는 분야면 ','검증된 방법/예시인 ','‘Best Practice’, ',"'레퍼런스'를 찾게 하세요."],['가장 좋은 방법을 알고 싶다면 ',"'SOTA'를 찾게 하세요."]],
 [['AI의 장기 기억력은 좋지 않아요. ',"('컨텍스트'의 한계)"],['계획, 결정, 한 일과 남은 일 등을 ','AI가 기록하게 하세요.'],['새 대화에서도 그 기록을 읽고 ','이어서 일하게 하세요.']],
 [['AI가 자꾸 승인 요청 해 귀찮아지지 않도록, ','컴퓨터를 다룰 권한을 주세요.'],['단, 중요한 것(계획의 진행 등)은 ','승인을 받으라고 요청하세요.']]
];
export function usageTipMarkup(page){
 let word=0,phrase=0;const heads=TIP_HEADS[page.tipIndex],body=TIP_PHRASES[page.tipIndex],emphasis=[[1,3],[1,2],[0,2,5,6,8],[3,5],[1,3]][page.tipIndex];
 if(heads.join('')!==page.title||body.some((parts,n)=>parts.join('')!==page.lines[n]))throw new Error('Tip phrase mapping must preserve exact approved copy');
 return `<h2 class="sr-only">${esc(page.title)}</h2><div class="tip-film tip-layout-${page.tipIndex}" aria-hidden="true"><div class="eyebrow">AI 활용 팁</div><div class="tip-kinetic-title">${heads.map((text,g)=>`<span class="tip-heading-${g}">${text.match(/\S+\s*/g).map((token,n)=>`${(page.tipIndex===1&&g===0&&n===2)||(page.tipIndex===3&&g===1&&n===1)?'<br>':''}<span data-tip-word="${word++}">${esc(token)}</span>`).join('')}</span>`).join('')}</div></div><article class="tip-reading reading tip-layout-${page.tipIndex}" tabindex="-1" aria-hidden="true"><div class="eyebrow">AI 활용 팁</div><h3>${esc(page.title)}</h3><div class="usage-tip-body">${body.map((parts,n)=>`<p data-tip-line="${n}">${parts.map(text=>`<span data-tip-phrase="${phrase++}" class="${emphasis.includes(phrase-1)?'tip-emphasis':''}">${esc(text)}</span>`).join('')}</p>`).join('')}</div><button class="replay-inline" data-replay="${PAGES.indexOf(page)}"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 8a8 8 0 1 1-1 7M5 3v5h5"/></svg>장면 다시 보기</button></article>`;
}
export function renderUsageTipText(screen,page,t,reduced){
 const time=reduced?page.duration:t,reading=screen.querySelector('.tip-reading'),film=screen.querySelector('.tip-film'),reveal=reduced?1:smooth(4.85,5.65,time);
 film.style.opacity=reduced?0:1-smooth(4.1,4.65,time);film.style.transform=`translate3d(0,${-smooth(4.1,4.65,time)*34}px,0)`;
 screen.querySelectorAll('[data-tip-word]').forEach((node,n)=>{const p=out(.35+n*.16,.90+n*.16,time),d=1-p;node.style.opacity=smooth(.35+n*.16,.65+n*.16,time);node.style.transform=page.tipIndex===0?`translate3d(${-d*80}px,0,0) rotateY(${-d*35}deg)`:page.tipIndex===1?`translate3d(${d*90}px,${d*20}px,0) rotateY(${d*35}deg)`:page.tipIndex===2?`translate3d(0,${d*80}px,0) rotateX(${-d*28}deg)`:page.tipIndex===3?`translate3d(${d*(n%2?45:-45)}px,${d*60}px,0) rotate(${-d*5}deg)`:`translate3d(0,${d*40}px,0) scale(${1+d*.30})`;});
 reading.style.opacity=reveal;reading.style.transform=`translate3d(${(1-reveal)*(page.tipIndex===1||page.tipIndex===3?35:-35)}px,${(1-reveal)*22}px,0)`;reading.setAttribute('aria-hidden',String(reveal<.98));reading.inert=reveal<.98;screen.closest('.presentation-page').classList.toggle('reading-ready',reveal>.98);
 screen.querySelectorAll('[data-tip-phrase]').forEach((node,n)=>{const at=5.35+n*.25,p=reduced?1:out(at,at+.55,time);node.style.opacity=reduced?1:smooth(at,at+.32,time);node.style.transform=`translate3d(0,${(1-p)*20}px,0)`;});
}
export function usageTitleMarkup(){return `<div class="usage-title-copy"><h1 aria-label="AI 활용 팁"><span data-tip-title="0">AI</span><span data-tip-title="1">활용</span><span data-tip-title="2">팁</span></h1><div class="usage-title-rule" aria-hidden="true"></div></div>`;}
export function renderUsageTitleText(screen,t,reduced){if(reduced)t=5.5;screen.querySelectorAll('[data-tip-title]').forEach((word,i)=>{const p=out(.6+i*.55,1.1+i*.55,t);word.style.opacity=p;word.style.transform=`translate3d(${(1-p)*-45}px,${(1-p)*75}px,0) rotateX(${(1-p)*-22}deg)`;});const rule=screen.querySelector('.usage-title-rule');rule.style.transform=`scaleX(${out(1.8,2.8,t)})`;}

// Local illustrative scenes. The permission motif performs no machine operation.
export function createUsageTipWorld({scene,blue,white,pale,plate,torus,sphere,taperedPath,seeded}){
 const v=(x,y,z=0)=>new THREE.Vector3(x,y,z),TAU=Math.PI*2;
 // Fit the added chapter between the existing phone (180) and practice (200) roots.
 const anchor=i=>184+i*3;
 const roots=Array.from({length:5},(_,i)=>{const r=new THREE.Group();r.position.x=anchor(i);scene.add(r);return r;});
 const groups=roots.map(r=>{const g=new THREE.Group();r.add(g);return g;});
 const glow=blue.clone();glow.emissive=new THREE.Color(0x2255ed);glow.emissiveIntensity=.22;
 const ink=new THREE.MeshPhysicalMaterial({color:0x172640,roughness:.26,metalness:.30,clearcoat:.8});
 const appear=(o,p,k=1)=>{o.visible=p>.001;o.scale.setScalar(Math.max(.001,p*k));};
 const bar=(w,h,mat=blue)=>plate(w,h,.07,mat,Math.min(.04,h*.4));
 // Every light trail follows the action in its scene; no decorative orbit around the lesson.
 const trace=curve=>new THREE.Mesh(new THREE.TubeGeometry(curve,72,.023,6,false),glow);
 const draw=(mesh,p)=>{mesh.visible=p>.001;mesh.geometry.setDrawRange(0,Math.floor(clamp(p)*72)*36);};
 function document(w=1.7,h=2.2){const g=new THREE.Group();g.add(plate(w,h,.15,white,.11));const lines=[];for(let j=0;j<4;j++){const line=bar(w*(j? .63:.72),j?.05:.14,j?ink:blue);line.position.set(-w*.04,h*.29-j*h*.18,.14);g.add(line);lines.push(line);}return {g,lines};}
 function check(){const g=new THREE.Group();const a=bar(.46,.13,white),b=bar(.80,.13,white);a.rotation.z=-.75;a.position.set(-.20,-.10,.18);b.rotation.z=.8;b.position.set(.16,.04,.18);g.add(a,b);return g;}
 function bubble(w,h,mat){const g=new THREE.Group();g.add(plate(w,h,.22,mat,.22));const tail=plate(.4,.4,.2,mat,.05);tail.rotation.z=Math.PI/4;tail.position.set(-w*.25,-h*.45,0);g.add(tail);return g;}
 function chip(size){const g=new THREE.Group();g.add(plate(size,size,.27,white,.17));const core=plate(size*.64,size*.64,.12,blue,.14);core.position.z=.22;g.add(core);const pins=[];for(let side=0;side<4;side++)for(let j=0;j<4;j++){const m=bar(.28,.07,pale);m.position.set(size*.57,(j-1.5)*size*.2,0);const pivot=new THREE.Group();pivot.rotation.z=side*Math.PI/2;pivot.add(m);g.add(pivot);pins.push(pivot);}return {g,core,pins};}
 // 1: a shared task stream separates into a light route and a complex route.
 const chips=[chip(1.50),chip(2.12)];chips.forEach(c=>groups[0].add(c.g));
 const circuits=[];for(let j=0;j<3;j++){const m=torus(.28+j*.16,.022,pale,Math.PI*1.72);m.position.z=.34;chips[1].g.add(m);circuits.push(m);}
 const input=sphere(.26,glow);groups[0].add(input);
 const routeCurves=[new THREE.CubicBezierCurve3(v(-3.1,0,.1),v(-2.3,0,.4),v(-2.2,1.2,.4),v(-1.0,1.2,.1)),new THREE.CubicBezierCurve3(v(-3.1,0,.1),v(-1.8,0,.6),v(.0,-.9,.6),v(1.25,-.9,.1))];
 const routes=routeCurves.map(c=>{const m=trace(c);groups[0].add(m);return m;});
 const packets=Array.from({length:10},()=>{const m=plate(.16,.16,.16,pale,.03);groups[0].add(m);return m;});
 // 2: a question opens a conversation; distinct idea pieces become one clear plan.
 const bubbles=[bubble(2.15,1.55,blue),bubble(2.4,1.78,white)];bubbles.forEach(b=>groups[1].add(b));
 const question=new THREE.Mesh(questionOutlineGeometry(),white);question.position.z=.28;question.scale.setScalar(.45);bubbles[0].add(question);
 const ideaParts=Array.from({length:3},(_,j)=>{const m=bar(1.4-j*.17,.12,blue);bubbles[1].add(m);return m;});
 const dialogueCurve=new THREE.CubicBezierCurve3(v(-.4,.55,.3),v(.4,.5,.6),v(-.6,-.55,.6),v(.1,-.55,.3));
 const dialoguePath=trace(dialogueCurve);groups[1].add(dialoguePath);
 const dialogueDots=Array.from({length:5},()=>{const m=sphere(.07,glow);groups[1].add(m);return m;});
 // 3: source documents pass under a lens and gather into a verified reference stack.
 const sources=Array.from({length:4},()=>document(1.7,2.25));sources.forEach(d=>groups[2].add(d.g));
 const lens=new THREE.Group(),lensRing=torus(.85,.075,glow),handle=bar(.88,.18,blue);handle.position.set(.77,-.77,0);handle.rotation.z=-Math.PI/4;lens.add(lensRing,handle);groups[2].add(lens);
 const researchSeal=sphere(.44,blue);researchSeal.scale.z=.25;groups[2].add(researchSeal);const sealCheck=check();researchSeal.add(sealCheck);sealCheck.scale.setScalar(.6);sealCheck.position.z=.8;
 // 4: loose context becomes a durable record; a new conversation receives it.
 const records=Array.from({length:4},()=>document(2.12,2.7));records.forEach(d=>groups[3].add(d.g));
 const cover=plate(2.38,2.98,.20,blue,.13);groups[3].add(cover);
 const recordSpine=plate(.20,2.9,.42,glow,.05);groups[3].add(recordSpine);
 const nextBubble=bubble(1.55,1.05,pale);groups[3].add(nextBubble);const nextMark=check();nextMark.children.forEach(m=>m.material=blue);nextBubble.add(nextMark);nextMark.scale.setScalar(.58);nextMark.position.z=.15;
 const memoryCurve=new THREE.CubicBezierCurve3(v(.8,-.2,.45),v(1.5,-.2,.6),v(1.15,.92,.6),v(1.4,.92,.25));
 const memoryPath=trace(memoryCurve);groups[3].add(memoryPath);
 const memoryPulse=sphere(.085,glow);groups[3].add(memoryPulse);
 // 5: a key opens the working path, while a separate checkpoint remains visible.
 const gate=new THREE.Group();groups[4].add(gate);
 const posts=[plate(.26,3.3,.4,white,.08),plate(.26,3.3,.4,white,.08),plate(2.65,.26,.4,white,.08)];posts[0].position.x=-1.2;posts[1].position.x=1.2;posts[2].position.y=1.5;posts.forEach(m=>gate.add(m));
 const doorHinge=new THREE.Group();doorHinge.position.x=-1.05;gate.add(doorHinge);const door=plate(2.08,2.84,.14,pale,.12);door.position.set(1.04,0,0);doorHinge.add(door);
 const key=new THREE.Group(),keyRing=torus(.43,.12,glow),shaft=bar(1.1,.19,blue),tooth=bar(.18,.43,blue);shaft.position.x=.86;tooth.position.set(1.22,-.12,0);key.add(keyRing,shaft,tooth);groups[4].add(key);
 // The cylinder belongs to the leaf; the blade enters along its normal.
 const lockFace=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.15,40),white);lockFace.rotation.x=Math.PI/2;lockFace.position.set(1.73,.08,.14);doorHinge.add(lockFace);
 const lockPlug=new THREE.Group();lockPlug.position.set(1.73,.08,.222);doorHinge.add(lockPlug);
 const lockRim=torus(.16,.022,glow),keyhole=bar(.035,.18,ink);lockPlug.add(lockRim,keyhole);
 const latch=plate(.18,.16,.12,blue,.02);latch.position.set(2.08,.08,0);doorHinge.add(latch);
 const keyAxis=new THREE.Group(),keyAlignment=new THREE.Group();gate.add(keyAxis);keyAxis.add(keyAlignment);
 const approval=sphere(.53,blue);groups[4].add(approval);const approvalCheck=check();approvalCheck.scale.setScalar(.68);approvalCheck.position.z=.60;approval.add(approvalCheck);
 const workTokens=Array.from({length:5},()=>{const m=plate(.37,.42,.16,white,.07);groups[4].add(m);return m;});
 // Chapter divider: the five working ideas assemble into one toolkit.
 const titleRoot=new THREE.Group();titleRoot.position.x=181;scene.add(titleRoot);
 const titleGroup=new THREE.Group();titleRoot.add(titleGroup);
 const titleObjects=[chips[0].g,bubbles[0],lens,records[0].g,key].map(o=>{const clone=o.clone(true);titleGroup.add(clone);return clone;});
 // Preserve the divider motif, then place the working key's pivot at its blade tip.
 keyAlignment.add(key);key.position.x=-1.41*.72;key.scale.setScalar(.72);
 const titleCore=new THREE.Mesh(new THREE.IcosahedronGeometry(.38,1),glow);titleGroup.add(titleCore);
 const titleRing=torus(2.62,.028,glow,Math.PI*1.75);titleGroup.add(titleRing);
 const titleCurves=titleObjects.map((_,j)=>{const angle=j*TAU/5+.3;return new THREE.CubicBezierCurve3(v(0,0,.3),v(Math.cos(angle)*.8,Math.sin(angle)*.8,.8),v(Math.cos(angle)*1.8,Math.sin(angle)*1.8,.5),v(Math.cos(angle)*2.32,Math.sin(angle)*2.32,.1));});
 function titlePose(t,a,reduced){
  const idle=reduced?0:Math.max(0,a-5.5),assembled=smooth(.25,2.85,t);titleGroup.position.set(4.05,.12,0);titleGroup.rotation.set(.04,mix(-.7,.12,assembled)+Math.sin(idle*.35)*.025,.04);
  titleObjects.forEach((o,j)=>{const p=out(.15+j*.23,1.25+j*.23,t),angle=j*TAU/5+.3,drift=Math.sin(idle*.65+j)*.035;o.position.set(Math.cos(angle)*mix(4.2,2.32,p),Math.sin(angle)*mix(3.5,2.32,p)+drift,(1-p)*2);o.rotation.set((1-p)*.9,mix(j%2?1.1:-1.1,-.15,p)+Math.sin(idle*.45+j)*.025,(1-p)*(j-2)*.4);appear(o,p,[.8,.62,.83,.61,.78][j]);});
  titleCore.rotation.set(t*.12,t*.5+idle*.18,.2);appear(titleCore,out(.35,1.2,t));titleRing.rotation.set(.12,-.15,.1+idle*.025);appear(titleRing,out(.4,2.0,t));
 }
 function titleCamera(t){const q=smooth(0,3.8,t);return {position:v(181+mix(-.4,.25,q),mix(1.5,.65,q),mix(13.6,14.5,q)),target:v(181,0,0)};}
 function titleParticles(buffer,t,a,total,reduced){titleGroup.updateWorldMatrix(true,false);const life=reduced?t:a;for(let j=0;j<total;j++){if(j>=1500||t<.5){buffer[j*3]=181;buffer[j*3+1]=-10000;buffer[j*3+2]=0;continue;}titleCurves[j%5].getPointAt((seeded(j+8)+life*.18)%1,local);local.applyMatrix4(titleGroup.matrixWorld).toArray(buffer,j*3);}}

 function pose(i,t,a,reduced){
  const idle=reduced?0:Math.max(0,a-USAGE_TIPS[i].duration),life=t+idle*.55,settle=smooth(4.0,5.6,t),g=groups[i],enter=out(.12,1.2,t);
  const desktopFit=Math.min(1,window.innerWidth/window.innerHeight/(16/9));
  const introX=[3.4,-3.5,0,-3.5,0][i],finalX=[4.35,-4.2,4.45,-4.2,4.25][i],introY=[.15,.1,-1.6,.1,-1.9][i];
  g.position.set(mix(introX,finalX*desktopFit,settle),mix(introY,.12,settle)+Math.sin(idle*.55)*.04,0);g.scale.setScalar(mix([1.15,1.17,1.10,1.22,1.14][i],[.95,1.02,1.06,1.05,1.03][i]*desktopFit,settle));g.rotation.set(0,Math.sin(idle*.4)*.025,0);
  if(i===0){
   chips.forEach((c,j)=>{const p=out(.2+j*.45,1.5+j*.45,t);c.g.position.set(j?1.4:-1.05,j?-.85:1.1,(1-p)*1.6);c.g.rotation.set(.06,mix(j?.9:-.9,-.20,p),(1-p)*(j?-.45:.45));appear(c.g,p);c.core.scale.setScalar(1+Math.sin(life*1.8+j)*.025);});
   input.position.set(-3.1,0,.1);appear(input,enter);routes.forEach((m,j)=>draw(m,smooth(.6+j*.3,1.6+j*.3,t)));
   packets.forEach((m,j)=>{const branch=j%2,q=(life*(branch?.19:.36)+j*.13)%1;m.position.copy(routeCurves[branch].getPointAt(q));m.rotation.set(0,0,branch?Math.PI/4:0);appear(m,smooth(1.1,2,t)*Math.sin(Math.PI*q),branch?1.35:.85);});
   circuits.forEach((m,j)=>m.rotation.z=life*(j%2?.2:-.14)+j);
  }else if(i===1){
   bubbles.forEach((b,j)=>{const p=out(.2+j*.7,1.5+j*.7,t);b.position.set(j?1.12:-1.18,j?-.65:.95,(1-p)*1.2);b.rotation.set(.04,mix(j?-.9:.7,-.16,p),mix(j?.28:-.25,j?.04:-.06,p));appear(b,p);});
   ideaParts.forEach((m,j)=>{const p=out(1.8+j*.25,2.6+j*.25,t);m.position.set((1-p)*(j-1)*2,.44-j*.40,.25+(1-p)*.8);appear(m,p);m.scale.x*=1+Math.sin(life*1.2-j*.9)*.035;});
   question.rotation.z=Math.sin(life*.9)*.045;draw(dialoguePath,smooth(.8,1.7,t));dialogueDots.forEach((m,j)=>{const q=(life*.29+j*.18)%1;m.position.copy(dialogueCurve.getPointAt(q));appear(m,smooth(1.1,1.8,t)*Math.sin(Math.PI*q));});
  }else if(i===2){
   sources.forEach((d,j)=>{const p=out(.1+j*.18,1.0+j*.18,t),stack=smooth(2.25,3.35,t);d.g.position.set(mix((j-1.5)*1.5,(j-1.5)*.25,stack),mix(Math.sin(j*1.8)*.7,(j-1.5)*.12,stack),-j*.23+(1-p)*1.8);d.g.rotation.set(0,-.18,mix((j-1.5)*.15,-.045*j,stack));appear(d.g,p);d.lines.forEach((m,n)=>{const scan=out(.8+j*.26+n*.08,1.1+j*.26+n*.08,t);m.scale.x=Math.max(.001,scan);});});
   const scan=smooth(.65,2.65,t);lens.position.set(mix(-2.3,1.2,scan)+Math.sin(idle*.6)*.24,mix(1.2,.38,scan)+Math.sin(idle*.8)*.18,1.25);lens.rotation.set(.03,-.12,-.12);appear(lens,out(.55,1.1,t));
   researchSeal.position.set(1.42,-1.06,1.3);appear(researchSeal,out(3.0,3.55,t));researchSeal.scale.z*=.35;
  }else if(i===3){
   const gather=smooth(.6,2.65,t);records.forEach((d,j)=>{const p=out(.12+j*.12,1.3+j*.12,t);d.g.position.set(mix((j-1.5)*1.25,-.25+j*.065,gather),mix(Math.sin(j*1.8)*1.1,.04+j*.045,gather),j*.11);d.g.rotation.set(0,-.15,mix((j-1.5)*.3,-.035,gather));appear(d.g,p*.85);});
   cover.position.set(-.20,.08,-.20);cover.rotation.y=mix(-1.35,-.15,smooth(1.6,2.75,t));appear(cover,smooth(1.3,2.0,t));recordSpine.position.set(-1.24,.08,.07);appear(recordSpine,smooth(1.8,2.8,t));
   nextBubble.position.set(2.13,.92,.25);nextBubble.rotation.y=-.18;appear(nextBubble,out(2.65,3.45,t));draw(memoryPath,smooth(2.65,3.3,t));const q=(life*.31)%1;memoryPulse.position.copy(memoryCurve.getPointAt(q));appear(memoryPulse,smooth(2.8,3.4,t)*Math.sin(Math.PI*q));nextMark.scale.setScalar(.58+Math.sin(life*1.4)*.025);
  }else{
   gate.position.set(.62,.1,0);gate.rotation.y=-.58;appear(gate,enter);
   const align=smooth(.35,1.15,t),insert=smooth(1.15,1.70,t),turn=smooth(1.80,2.35,t),returnTurn=smooth(2.45,2.70,t),withdraw=smooth(2.75,3.15,t),dock=smooth(3.15,3.65,t);
   // A stationary leaf receives the key, turns the plug, retracts the latch,
   // and waits for the blade to clear the cylinder before swinging open.
   keyAxis.position.set(mix(mix(-1.6,.68,align),-1.35,dock),mix(mix(.85,.08,align),-.95,dock),mix(mix(1.65,mix(.43,.075,insert),align),1.55,withdraw));
   keyAxis.rotation.set(0,0,(turn-returnTurn)*Math.PI/2);
   keyAlignment.rotation.y=mix(Math.PI/2*align,.18,dock);
   key.visible=t>.15;keyAxis.visible=t>.15;
   lockPlug.rotation.z=(turn-returnTurn)*Math.PI/2;latch.position.x=mix(2.08,1.91,turn);
   doorHinge.rotation.y=-smooth(3.25,4.05,t)*1.28;
   approval.position.set(2.28,1.95,.2);appear(approval,out(2.35,2.85,t));
   workTokens.forEach((m,j)=>{const phase=(Math.max(0,life-4.05)*.20+j*.18)%1,q=j===0?(phase<.44?phase:phase<.66?.44:mix(.44,1,(phase-.66)/.34)):phase;m.position.set(mix(-1.1,2.55,q),j===0?1.95:-.85+j*.22,.6);m.rotation.y=-.2;appear(m,smooth(4.05,4.55,t)*Math.sin(Math.PI*q)*.72);});approvalCheck.scale.setScalar(.68+Math.sin(life*1.3)*.025);
  }
 }
 function camera(i,t){const q=smooth(0,4.8,t);return {position:v(anchor(i)+mix(-1.1,.25,q),mix(1.7,.65,q),mix(14.1,15.5,q)),target:v(anchor(i),.05,0)};}
 const local=v(0,0,0);
 // Reuse the plentiful small-particle budget already used by the earlier
 // scenes. Only these five tip fields gain population; their flow stays intact.
 const baseLimits=[4800,4800,4800,4800,4800],trailLimits=[900,900,900,900,900];
 const particleStarts=[.85,1.0,.85,.85,3.7];
 function particles(buffer,i,t,a,total,reduced,baseCount=4800,alpha){
  const life=reduced?t:t+Math.max(0,a-USAGE_TIPS[i].duration)*.55,g=groups[i];g.updateWorldMatrix(true,true);
  const start=particleStarts[i],entry=smooth(start,start+.65,t),quiet=mix(1,.48,smooth(5.1,6.5,t));
  for(let j=0;j<total;j++){
   const trail=j>=baseCount,n=trail?j-baseCount:j,limit=(trail?trailLimits:baseLimits)[i];
   const u=seeded(j+71),w=seeded(j+19),z=seeded(j+9),angle=seeded(j+31)*TAU;
   // Independent phase, speed and depth spread keep this a loose field rather
   // than a packet, tube or cloud converging on a single target.
   const speed=.085+seeded(j+43)*.055,q=(u+life*speed)%1;
   if(n>=limit||t<start){buffer[j*3]=anchor(i);buffer[j*3+1]=-10000;buffer[j*3+2]=0;if(alpha)alpha[j]=0;continue;}
   const strength=smooth(0,.14,q)*(1-smooth(.82,1,q))*entry*quiet*(.45+z*.40);
   if(i===0){
    // Broad left-to-right flow enters with the two model branches.
    local.set(mix(-3.25,2.65,q),mix(-1.6,1.75,w)+Math.sin(angle+life*.45)*.16,.45+z*.70);
   }
   if(i===1){
    // A staggered outward drift surrounds the unfolding conversation. Its
    // starting radius already spans the scene: there is no dense emitter.
    const radius=1.1+q*1.75;
    local.set(Math.cos(angle)*radius+.18,Math.sin(angle)*radius*.66+.12,.65+z*.65);
   }
   if(i===2){
    // An airy sweep passes across the reference/lens area during inspection;
    // it neither collects in the lens nor funnels into the check.
    local.set(mix(-3.1,2.8,q),mix(-1.55,1.75,w)+Math.sin(angle+life*.38)*.22,1.50+z*.55);
   }
   if(i===3){
    // Loose falling specks accompany page assembly, then turn into a broad
    // gentle flow when the next conversation appears.
    const turn=smooth(2.65,3.65,t),x=mix(-2.25,2.40,w)+Math.sin(angle+life*.5)*.16,y=mix(1.95,-1.6,q);
    local.set(mix(x,mix(-2.4,2.7,q),turn),mix(y,mix(-1.4,1.6,w)+Math.sin(angle+life*.4)*.18,turn),.80+z*.60);
   }
   if(i===4){
    // The opening door releases a loose widening breeze. The key turn has no
    // particle ring and the closed door has no passing work stream.
    local.set(mix(-1.5,3.0,q),(w-.5)*mix(2.25,3.35,q)+Math.sin(angle+life*.4)*.12,.70+z*.70);
   }
   local.applyMatrix4(g.matrixWorld);local.toArray(buffer,j*3);if(alpha)alpha[j]=strength;
  }
 }
 return {roots,pose,camera,particles,title:{root:titleRoot,pose:titlePose,camera:titleCamera,particles:titleParticles}};
}
