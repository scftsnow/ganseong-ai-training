import * as THREE from 'three';
import {clamp,smooth,mix} from './presentation.mjs';
// Exact approved text is isolated in practice-data.mjs. Artwork is illustrative, not a live exercise.
const out=(a,b,t)=>1-Math.pow(1-clamp((t-a)/(b-a)),4);
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export const PRACTICE_PHRASES=[[],[['엑셀 양식과 구매 목록을 주고, ','알아서 채우게 하세요']],[["AI가 다른 앱을 다루게 하는 ","'MCP'를 이용하여, ",'한글을 조작하게 하세요']],[['Canva MCP와 ','작업 요령을 알려주는 ‘스킬’을 활용하여, ','수업 PPT 초안을 만들게 하세요.']],[['Higgsfield MCP와 스킬로 ','이미지들을 만들고, ','Byteplus를 이용해 ','수업용 애니메이션을 만들어요']],[['나에게 맞는 프로그램을 ','직접 제작하고,'],['GitHub에 올려 ','공유해보세요']]];
export function practiceMarkup(page){
 if(page.practiceIndex===0)return `<div class="practice-copy practice-divider"><h1 aria-label="${esc(page.title)}"><span data-practice-word="0">AI와 함께</span> <span data-practice-word="1">일해보기</span></h1></div>`;
 const split=page.title.includes(' — ')?' — ':' - ',parts=page.title.split(split),phrases=PRACTICE_PHRASES[page.practiceIndex];let n=0;
 if(phrases.some((p,i)=>p.join('')!==page.textLines[i]))throw new Error('Practice phrases must preserve exact approved copy');
 return `<article class="practice-copy"><h1 aria-label="${esc(page.title)}"><span class="practice-tool" data-practice-word="0">${esc(parts[0]+split)}</span><span class="practice-task" data-practice-word="1">${esc(parts[1])}</span></h1><p>${phrases.map((line,i)=>`<span class="practice-line" data-practice-line="${i}">${line.map((text,j)=>`<span data-practice-phrase="${n++}" class="${j===line.length-1||/MCP|GitHub|Byteplus/.test(text)?'practice-emphasis':''}">${esc(text)}</span>`).join('')}</span>`).join('<br>')}</p></article>`;
}
export function renderPracticeText(screen,page,t,reduced){
 const time=reduced?page.duration:t;
 screen.querySelectorAll('[data-practice-word]').forEach((node,i)=>{const at=page.practiceIndex===0?.55+i*.55:3.5+i*.38,p=page.practiceIndex===0?smooth(at,at+.38,time):out(at,at+.65,time);node.style.opacity=smooth(at,at+.38,time);node.style.transform=`translate3d(0,${(1-p)*42}px,0) rotateX(${(1-p)*-12}deg)`;});
 screen.querySelectorAll('[data-practice-phrase]').forEach((node,i)=>{const at=4.65+i*.48,p=out(at,at+.55,time);node.style.opacity=smooth(at,at+.35,time);node.style.transform=`translate3d(${(1-p)*-18}px,${(1-p)*28}px,0) rotateX(${(1-p)*-10}deg)`;});
}

export function createPracticeWorld({scene,blue,white,pale,plate,torus,sphere,taperedPath,seeded}){
 const v=(x,y,z=0)=>new THREE.Vector3(x,y,z),TAU=Math.PI*2;
 const roots=Array.from({length:6},(_,i)=>{const r=new THREE.Group();r.position.x=200+i*20;scene.add(r);return r;});
 const groups=roots.map(r=>{const g=new THREE.Group();r.add(g);return g;});
 const ink=new THREE.MeshPhysicalMaterial({color:0x142440,metalness:.32,roughness:.26,clearcoat:.8}),glow=blue.clone();glow.emissive=new THREE.Color(0x2255ed);glow.emissiveIntensity=.18;
 const appear=(o,p,k=1)=>{o.visible=p>.001;o.scale.setScalar(Math.max(.001,p*k));};
 const bar=(w,h,mat=blue)=>plate(w,h,.055,mat,Math.min(h*.4,.10));
 const path=(points,r=.026)=>{const m=taperedPath(points,r,glow);delete m.userData.motionCurve;return m;};
 function paper(w=2.8,h=3.5){const g=new THREE.Group();g.add(plate(w,h,.16,white,.13));return g;}
 function label(text,w=.9,h=.32,color='#2255ed'){
  const c=document.createElement('canvas');c.width=512;c.height=160;const ctx=c.getContext('2d');ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='700 100px Arial';ctx.fillText(text,256,82);
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:true,alphaTest:.12}));m.renderOrder=2;return m;
 }
 function sheet(){const g=paper(3.8,3.0),cells=[];for(let y=0;y<5;y++)for(let x=0;x<4;x++){const c=plate(.77,.38,.065,y===0?blue:pale,.035);c.position.set((x-1.5)*.87,1.04-y*.49,.14);g.add(c);cells.push(c);}return {g,cells};}
 function documentShape(){const g=paper(),lines=[],table=[];const head=bar(1.62,.16);head.position.set(-.22,1.17,.14);g.add(head);for(let i=0;i<5;i++){const b=bar(i===4?1.18:2.05,.055,i<2?blue:ink);b.position.set(i===4?-.435:0,.77-i*.26,.15);g.add(b);lines.push(b);}for(let i=0;i<6;i++){const c=plate(.62,.30,.05,i<3?blue:pale,.025);c.position.set((i%3-1)*.70,-.87-Math.floor(i/3)*.38,.15);g.add(c);table.push(c);}return {g,head,lines,table};}
 function slide(){const g=paper(3.5,2.25),picture=plate(1.16,1.54,.09,blue,.11);picture.position.set(.88,0,.17);g.add(picture);const ring=torus(.34,.045,white);ring.position.set(.88,.1,.26);g.add(ring);const lines=Array.from({length:3},(_,n)=>{const m=bar(n===0?1.34:1.07,n===0?.14:.065,n===0?blue:ink);m.position.set(-.68-(n?.135:0),.56-n*.37,.17);g.add(m);return m;});return {g,picture,ring,lines};}
 function frame(){const g=paper(2.7,2.08),canvas=plate(2.38,1.72,.06,pale,.09);canvas.position.z=.14;g.add(canvas);const disc=sphere(.29,blue);disc.scale.z=.17;disc.position.set(.60,.41,.24);g.add(disc);const hill=plate(1.16,1.16,.09,blue,.20);hill.rotation.z=Math.PI/4;hill.scale.y=.70;hill.position.set(-.27,-.21,.22);g.add(hill);return {g,disc,hill};}
 function dividerDocument(){const g=paper();const head=bar(1.62,.16);head.position.set(-.22,1.17,.14);g.add(head);for(let i=0;i<7;i++){const b=bar(i===6?1.18:2.05,.055,i<2?blue:ink);b.position.set(i===6?-.435:0,.77-i*.26,.15);g.add(b);}const footer=plate(2.10,.54,.06,pale,.05);footer.position.set(0,-1.20,.15);g.add(footer);return g;}
 // Preserve the accepted chapter divider composition.
 const titleObjects=[sheet().g,dividerDocument(),slide().g,frame().g,paper(2.8,2.05)];titleObjects.forEach(o=>groups[0].add(o));
 const titleCore=new THREE.Mesh(new THREE.IcosahedronGeometry(.58,1),glow);groups[0].add(titleCore);
 const titleArcs=[0,1].map(j=>{const m=torus(3.12+j*.37,.028-j*.010,glow,Math.PI*(1.28-j*.22));groups[0].add(m);return m;});
 // Excel: incoming purchase rows dock into a form, then a scan confirms the filled grid.
 const excel=sheet();groups[1].add(excel.g);const list=Array.from({length:4},()=>{const g=paper(1.5,.43);const b=bar(.85,.075);b.position.z=.14;g.add(b);groups[1].add(g);return g;});
 const scan=plate(3.56,.045,.06,glow,.015);excel.g.add(scan);
 const excelRails=[-.65,0,.65].map(y=>{const m=path([[-4,y,.25],[-2.9,y,.25],[-2,y,.25]]);groups[1].add(m);return m;});
 // HWP: separate named AI and MCP nodes connect to the HWP document. Fill follows arrival.
 const doc=documentShape();groups[2].add(doc.g);doc.g.name='hwp-document';doc.head.name='hwp-title-fill';doc.lines.forEach((m,j)=>m.name='hwp-body-'+j);doc.table.forEach((m,j)=>m.name='hwp-table-'+j);
 const ai=paper(1.55,1.55);groups[2].add(ai);ai.name='hwp-ai-source';const aiText=label('AI',.90,.44);aiText.position.z=.16;ai.add(aiText);
 const mcp=paper(1.7,1.30);groups[2].add(mcp);mcp.name='hwp-mcp-connector';const mcpText=label('MCP',1.27,.38);mcpText.position.z=.16;mcp.add(mcpText);
 const hwpText=label('HWP',1.15,.32);hwpText.position.set(0,2.02,.12);doc.g.add(hwpText);
 const links=[path([[-3.42,0,.24],[-2.6,0,.24],[-1.27,0,.24]],.035),path([[.47,0,.24],[1.30,0,.24],[2.1,0,.24]],.035)];links.forEach(m=>groups[2].add(m));
 const arrows=[-1.53,1.75].map(x=>{const m=path([[x-.19,.15,.24],[x,0,.24],[x-.19,-.15,.24]],.035);groups[2].add(m);return m;});
 const pulse=sphere(.105,glow);pulse.name='hwp-through-mcp-signal';groups[2].add(pulse);
 const connectorHalo=torus(.94,.032,glow);groups[2].add(connectorHalo);
 // Canva: design guidance arrives from above; image/text layers snap to a slide, then form a deck.
 const slides=[slide(),slide(),slide()];slides.forEach(o=>groups[3].add(o.g));
 const guide=paper(1.12,1.45);groups[3].add(guide);const guideCheck=path([[-.27,0,.16],[-.06,-.20,.16],[.30,.25,.16]],.045);guide.add(guideCheck);
 const guides=[-1,1].map(x=>{const m=path([[x*1.8,3.1,-.2],[x*1.8,1.5,.1],[x*.9,.7,.3]]);groups[3].add(m);return m;});
 // Image/video: a single picture multiplies into sequential frames; a playhead activates the timeline.
 const frames=Array.from({length:5},()=>frame());frames.forEach(o=>groups[4].add(o.g));
 const timeline=plate(11.5,.055,.07,pale,.025);timeline.position.set(0,-1.58,.05);groups[4].add(timeline);
 const ticks=Array.from({length:21},(_,i)=>{const m=bar(.025,i%5===0?.19:.09);m.position.set((i-10)*.52,-1.71,.12);groups[4].add(m);return m;});
 const playhead=new THREE.Group();const stem=bar(.055,2.85);stem.position.y=-.15;playhead.add(stem);const knob=sphere(.13,glow);knob.position.y=1.37;playhead.add(knob);groups[4].add(playhead);
 // Coding: components rise into a window; a central repository branches into two shared builds.
 const app=paper(3.5,2.7);app.name='coding-program-window';groups[5].add(app);const appScreen=plate(3.15,2.05,.065,ink,.08);appScreen.position.set(0,-.12,.14);app.add(appScreen);
 const pieces=Array.from({length:6},(_,i)=>{const p=plate(i%3===0?.66:.84,.48,.12,i%2?blue:pale,.07);app.add(p);return p;});
 const repo=paper(1.38,.75);repo.name='coding-repository';
 // Match the plane to the existing 512:160 texture; uniform node scaling preserves the font.
 const repoLabel=label('GitHub',1.20,1.20*160/512);repoLabel.name='coding-github-label';repoLabel.position.z=.16;repo.add(repoLabel);groups[5].add(repo);
 // The line and its moving particles share these exact curves. Ports stop at card edges,
 // leaving the repository label unobstructed. The first port is at the program's center.
 const sharingCurves=[
  new THREE.CubicBezierCurve3(v(-.7,-.35,.48),v(.70,-.35,.48),v(1.45,1.73,.30),v(2.56,1.73,.30)),
  new THREE.CubicBezierCurve3(v(3.94,1.73,.30),v(4.22,1.73,.30),v(4.28,2.60,.30),v(4.62,2.60,.30)),
  new THREE.CubicBezierCurve3(v(3.94,1.73,.30),v(4.22,1.73,.30),v(4.28,.50,.30),v(4.62,.50,.30))
 ];
 const sharingLinks=sharingCurves.map((curve,j)=>{const m=new THREE.Mesh(new THREE.TubeGeometry(curve,80,.016,6,false),glow);m.name='coding-sharing-link-'+j;m.userData.sharingCurve=curve;groups[5].add(m);return m;});
 const sharingArrows=sharingCurves.map((curve,j)=>{const m=new THREE.Mesh(new THREE.ConeGeometry(.065,.18,12),glow);m.name='coding-sharing-arrow-'+j;m.position.copy(curve.getPointAt(.965));m.quaternion.setFromUnitVectors(v(0,1,0),curve.getTangentAt(.965));groups[5].add(m);return m;});
 const sharingProgress=(j,t)=>j===0?smooth(2.3,3.3,t):smooth(3.4+(j-1)*.2,4.0+(j-1)*.2,t);
 const copies=[paper(1.05,.80),paper(1.05,.80)];copies.forEach((m,j)=>{m.name="coding-shared-build-"+j;groups[5].add(m);const b=bar(.62,.34);b.position.z=.14;m.add(b);});
 function pose(i,t,a,reduced){
  const duration=i===0?6.2:7.2,idle=reduced?0:Math.max(0,a-duration),time=t+idle*.18,enter=out(.1,1.25,t),settle=smooth(2.5,5.3,t),g=groups[i];
  g.position.set(i===0?mix(3.8,4.05,settle):i===1?mix(.6,4.25,settle):i===2?0:i===3?mix(.3,-4.45,settle):i===4?0:mix(.8,2.5,settle),i===2?-.55:i===4?-.45:.12+Math.sin(idle*.65)*.045,0);
  g.scale.setScalar(i===0?.90:i===1?mix(1.06,.89,settle):i===2?.95:i===3?.95:i===4?.95:.76);g.rotation.set(0,Math.sin(idle*.38)*(i===0?.026:.02),0);
  if(i===0){titleCore.rotation.set(time*.25,time*.34,0);appear(titleCore,enter);titleArcs.forEach((arc,j)=>{arc.rotation.set(j?.92:-.65,j?-.3:.42,j*2.6+time*(j?-.12:.16));appear(arc,out(.35+j*.15,1.9+j*.15,t));});titleObjects.forEach((o,j)=>{const p=out(.2+j*.18,1.65+j*.18,t),angle=j*TAU/5+.2+time*.045;o.position.set(Math.cos(angle)*2.17,Math.sin(angle)*1.78,(j%2?-.3:.3));o.rotation.set(.04,-.20+Math.sin(angle)*.15,(1-p)*(j%2?1:-1)*1.7);appear(o,p*.44);});}
  if(i===1){excel.g.position.x=mix(3,0,enter);excel.g.rotation.set(-.10,mix(-.65,-.10,out(.2,2,t)),0);appear(excel.g,enter);excel.cells.forEach((c,j)=>{const p=out(.8+Math.floor(j/4)*.33,1.5+Math.floor(j/4)*.33,t);c.position.z=.14+(1-p)*.6;c.scale.setScalar(Math.max(.001,p));});list.forEach((o,j)=>{const p=smooth(.65+j*.38,2.0+j*.38,t);o.position.set(mix(-5.4,-.3,p),1.02-(j+1)*.49,.32);o.rotation.z=0;appear(o,enter*(1-smooth(1.8+j*.38,2.25+j*.38,t))*.85);});excelRails.forEach(m=>appear(m,enter*(1-smooth(3.2,4.2,t))));scan.position.set(0,mix(1.32,-1.27,smooth(2.8,4.4,t)),.25);scan.visible=t>2.7&&t<4.6;}
  if(i===2){ai.position.set(mix(-7,-4.25,out(.12,1.1,t)),0,.02);appear(ai,enter);mcp.position.set(-.4,mix(2.8,0,out(.55,1.4,t)),0);appear(mcp,out(.55,1.4,t));doc.g.position.set(mix(7,3.5,out(.3,1.6,t)),0,0);doc.g.rotation.set(0,-.06,0);appear(doc.g,out(.3,1.6,t));links.forEach((m,j)=>appear(m,smooth(1.0+j*.25,1.55+j*.25,t)));arrows.forEach(m=>appear(m,smooth(1.25,1.7,t)));const signal=smooth(1.65,3.05,t);pulse.position.set(mix(-3.45,2.12,signal),0,.38);appear(pulse,Math.sin(Math.PI*signal));connectorHalo.position.set(-.4,0,.28);connectorHalo.rotation.y=.12;appear(connectorHalo,Math.sin(Math.PI*smooth(2.10,2.75,t)),1.12);const h=out(3.10,3.48,t);doc.head.visible=h>.001;doc.head.scale.x=Math.max(.001,h);doc.lines.forEach((m,j)=>{const p=out(3.35+j*.16,3.75+j*.16,t);m.visible=p>.001;m.scale.x=Math.max(.001,p);});doc.table.forEach((m,j)=>appear(m,out(4.5+j*.12,4.85+j*.12,t)));}
  if(i===3){const fan=smooth(2.6,4.8,t);slides.forEach((s,j)=>{const p=out(.25+j*.27,1.65+j*.27,t);s.g.position.set((j-1)*.70*fan,mix(5+j,.42*(j-1),p),-.36*j);s.g.rotation.set(-.08,-.18,(j-1)*mix(.48,.17,fan));appear(s.g,p*.95);s.picture.position.set(.88,0,.17+(1-smooth(1.3,2.45,t))*3.1);s.ring.position.z=.26+(1-smooth(1.45,2.65,t))*3.1;s.ring.rotation.z=time*.12;s.lines.forEach((m,n)=>m.scale.x=Math.max(.001,out(1.65+n*.22,2.40+n*.22,t)));});guide.position.set(-2.3,mix(4,1.95,out(.15,1.5,t)),.1);guide.rotation.z=-.13;appear(guide,enter*(1-smooth(3.6,4.7,t)),.78);guides.forEach(m=>appear(m,enter*(1-smooth(3.3,4.6,t))));}
  if(i===4){const film=smooth(1.4,3.9,t);frames.forEach((f,j)=>{const p=out(.12+j*.12,1.25+j*.12,t),x=(j-2)*2.32;f.g.position.set(mix(0,x,film),mix(-3.4,0,p),-Math.abs(j-2)*.15);f.g.rotation.set(0,(j-2)*-.055*film,(1-film)*(j-2)*.10);appear(f.g,p*mix(.88,.77,film));f.disc.position.y=.41+Math.sin(time*1.5+j*.62)*.14;f.disc.position.x=.6+Math.sin(time*.8+j*.55)*.13;f.hill.rotation.z=Math.PI/4+Math.sin(time*.8+j*.55)*.06;});appear(timeline,film);ticks.forEach(m=>appear(m,film));playhead.position.set(mix(-5.65,5.65,smooth(3.35,6.5,t)),-.02,.58);appear(playhead,film*(1-smooth(6.5,7.15,t)));}
  if(i===5){app.position.set(-.7,mix(-4.5,-.35,enter),0);app.rotation.set(-.05,-.12,.015);appear(app,enter);pieces.forEach((p,j)=>{const on=out(.45+j*.23,1.75+j*.23,t);p.position.set((j%3-1)*.94,.32-Math.floor(j/3)*.75-(1-on)*3.5,.23+(1-on)*.7);p.rotation.z=(1-on)*(j%2?.4:-.4);appear(p,on);});repo.position.set(3.25,1.73,.15);appear(repo,out(2.55,3.35,t));sharingLinks.forEach((m,j)=>{const on=sharingProgress(j,t);m.visible=on>.001;m.geometry.setDrawRange(0,Math.floor(on*80)*36);sharingArrows[j].visible=on>.97;});copies.forEach((m,j)=>{m.position.set(5.15,j?.50:2.60,.17);m.rotation.y=-.12;appear(m,out(3.8+j*.23,4.65+j*.23,t));});}
 }
 function camera(i,t){const q=smooth(0,5.5,t),z=i===2?16.2:i===4?16.6:14.4;return {position:v(200+i*20+mix(-.8,.25,q),mix(1.9,.7,q),mix(i===2||i===4?17:15,z,q)),target:v(200+i*20,0,0)};}
 const local=v(0,0,0);
 function particles(buffer,i,t,a,total,reduced){
  const time=reduced?t:t+Math.max(0,a-(i===0?6.2:7.2))*.18,g=groups[i];g.updateWorldMatrix(true,false);
  for(let j=0;j<total;j++){const q=seeded(j+2),u=seeded(j+4),w=seeded(j+9),phase=(q+time*.15)%1,lane=j%5;let x,y,z;
   if(i===0){const angle=j*2.39996+time*.23,phi=Math.acos(2*q-1),r=1.6+u*2;x=Math.cos(angle)*Math.sin(phi)*r;y=Math.cos(phi)*r*.75;z=Math.sin(angle)*Math.sin(phi)*r*.63;}
   if(i===1){x=mix(-5,2,phase);y=(lane-2)*.49+(u-.5)*.11;z=.18+(w-.5)*.75;if(x>-1.8)y+=(Math.sin(phase*TAU+lane)*.05);}
   if(i===2){x=mix(-4.2,4.7,phase);y=(u-.5)*.22;z=.25+(w-.5)*.38;if(x< -3.42||(x> -1.27&&x<.47))z=-.18;if(phase>.78){x=3.5+(u-.5)*2.9;y=mix(1.55,-1.55,(phase-.78)/.22);z=-.18;}}
   if(i===3){const angle=phase*TAU,layer=j%3;x=Math.cos(angle)*2.5;y=Math.sin(angle)*1.45+layer*.22;z=-layer*.42+(w-.5)*.18;const entry=1-smooth(.4,2.8,t);y+=entry*(q*5);x+=entry*(layer-1);}
   if(i===4){x=mix(-6,6,phase);y=(j%2?1:-1)*(1.28+(u-.5)*.15);z=.1+(w-.5)*.22;if(j%7===0){y=(u-.5)*2.4;z=-.55;}}
   if(i===5){const link=j%3,on=sharingProgress(link,t);
    if(phase>on||on<.002){buffer[j*3]=roots[i].position.x;buffer[j*3+1]=-10000;buffer[j*3+2]=0;continue;}
    const point=sharingCurves[link].getPointAt(phase),angle=u*TAU,radius=.012+w*.024;
    x=point.x;y=point.y+Math.cos(angle)*radius;z=point.z+Math.sin(angle)*radius;
   }
   if(i===0)local.set(roots[i].position.x+g.position.x+x,g.position.y+y,z);else local.set(x,y,z).applyMatrix4(g.matrixWorld);buffer[j*3]=local.x;buffer[j*3+1]=local.y;buffer[j*3+2]=local.z;
  }
 }
 return {roots,pose,camera,particles};
}
