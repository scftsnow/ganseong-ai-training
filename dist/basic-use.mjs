import * as THREE from 'three';
import {clamp,smooth,mix} from './presentation.mjs';
import {BASIC_USE} from './basic-use-data.mjs';

const out=(a,b,t)=>1-Math.pow(1-clamp((t-a)/(b-a)),4);
export function basicUseMarkup(page){
 return `<div class="basic-copy"><div class="eyebrow basic-chapter-name">AI를 '컴퓨터에 설치'하기</div><h1 class="basic-message" aria-label="${page.title}">${page.groups.map((text,g)=>`<span class="basic-group" data-group="${g}">${text.split(' ').map((word,n)=>`${n?' ':''}<span class="basic-word" data-basic-word="${g}-${n}">${word}</span>`).join('')}</span>`).join(' ')}</h1></div>`;
}
export function renderBasicUseText(screen,page,t,reduced){
 const time=reduced?page.duration:t;
 const label=screen.querySelector('.basic-chapter-name'),enter=reduced?1:out(.08,.5,time);
 label.style.opacity=enter;label.style.transform=`translate3d(0,${(1-enter)*12}px,0)`;
 screen.querySelectorAll('[data-group]').forEach((group,g)=>{
  group.querySelectorAll('.basic-word').forEach((word,n)=>{
   const p=smooth(page.times[g][n],page.times[g][n]+.29,time);
   word.style.opacity=p;
   word.style.transform=`translate3d(${(1-p)*(g?20:-25)}px,${(1-p)*48}px,0) rotateX(${(1-p)*-25}deg)`;
  });
 });
}

// Original procedural illustrations, not captures of installations or real device connections.
export function createBasicUseWorld({scene,blue,white,pale,plate,torus,sphere,taperedPath,seeded}){
 const v=(x,y,z=0)=>new THREE.Vector3(x,y,z),TAU=Math.PI*2;
 const ink=new THREE.MeshPhysicalMaterial({color:0x132342,metalness:.30,roughness:.25,clearcoat:.8});
 const lightBlue=new THREE.MeshPhysicalMaterial({color:0x719aff,metalness:.18,roughness:.22,clearcoat:1});
 const luminous=blue.clone();luminous.emissive=new THREE.Color(0x2255ed);luminous.emissiveIntensity=.22;
 const roots=Array.from({length:5},(_,i)=>{const g=new THREE.Group();g.position.x=100+i*20;scene.add(g);return g;});
 const groups=roots.map(root=>{const g=new THREE.Group();root.add(g);return g;});
 const appear=(obj,p,s=1)=>{obj.visible=p>.001;obj.scale.setScalar(Math.max(.001,p*s));};
 function bar(w,h,material){return plate(w,h,.035,material,Math.min(h/2,.13));}
 function panel(w=3.5,h=2.4){
  const g=new THREE.Group(),frame=plate(w,h,.18,white,.18),display=plate(w-.24,h-.26,.045,ink,.13);display.position.z=.13;g.add(frame,display);return g;
 }
 function documentTile(){
  const g=new THREE.Group();g.add(plate(.93,1.22,.1,white,.1));
  for(let n=0;n<3;n++){const line=bar(.56-n*.08,.055,blue);line.position.set(-n*.04,.29-n*.22,.09);g.add(line);}return g;
 }
 function appTile(type=0){
  const g=new THREE.Group();g.add(plate(1.36,1.36,.32,blue,.25));
  if(type===0){
   for(let i=0;i<4;i++){const part=plate(.29,.29,.10,white,.075);part.position.set((i%2-.5)*.38,(Math.floor(i/2)-.5)*.38,.23);g.add(part);}
  }else{
   const center=sphere(.12,white);center.position.z=.27;g.add(center);
   for(let i=0;i<6;i++){const dot=sphere(.087,white),a=i*TAU/6;dot.position.set(Math.cos(a)*.36,Math.sin(a)*.36,.24);g.add(dot);}
  }
  return g;
 }
 function monitor(w=3.5){
  const g=new THREE.Group(),face=panel(w,2.35),stand=plate(.30,.60,.23,white,.08),foot=plate(1.4,.32,.55,pale,.14);
  face.position.y=.24;stand.position.set(0,-1.15,-.1);foot.position.set(0,-1.55,.02);g.add(face,stand,foot);return g;
 }
 function laptop(w=3.8){
  const g=new THREE.Group(),base=plate(w,2.15,.13,white,.20),hinge=new THREE.Group(),display=panel(w,2.4);
  base.rotation.x=-Math.PI/2;base.position.set(0,-1.10,.25);hinge.position.set(0,-1.04,-.76);display.position.y=1.16;hinge.add(display);g.add(base,hinge);
  const track=plate(.9,.45,.012,pale,.06);track.rotation.x=-Math.PI/2;track.position.set(0,-1.015,.74);g.add(track);
  return {group:g,hinge};
 }
 function chatTile(){
  const g=new THREE.Group();g.add(plate(2.8,1.52,.20,white,.24));
  for(let i=0;i<3;i++){const line=bar([1.72,1.3,.8][i],.10,i===2?lightBlue:blue);line.position.set(-.22,.37-i*.31,.15);g.add(line);}return g;
 }
 // 08: dialogue planes unfold into a workstation and three tangible work objects.
 const chat=[chatTile(),chatTile()];chat.forEach(g=>groups[0].add(g));
 const agentMonitor=monitor(3.4);groups[0].add(agentMonitor);
 const agentCore=new THREE.Mesh(new THREE.IcosahedronGeometry(.54,2),luminous);groups[0].add(agentCore);
 const tasks=[documentTile(),new THREE.Group(),new THREE.Group()];
 for(let i=0;i<4;i++){const tile=plate(.32,.32,.24,i%2?blue:pale,.06);tile.position.set((i%2-.5)*.40,(Math.floor(i/2)-.5)*.40,0);tasks[1].add(tile);}
 for(let i=0;i<3;i++){const tile=plate(.22,.48+i*.19,.13,i===1?blue:pale,.055);tile.position.set((i-1)*.29,i*.095,0);tasks[2].add(tile);}
 tasks.forEach(g=>groups[0].add(g));
 const taskPaths=[[-2.45,.9,.6],[2.3,.70,.4],[2.1,-1.35,.6]].map(([x,y,z])=>{const m=taperedPath([[0,.1,.2],[x*.48,y*.9,1.15],[x,y,z]],.029,luminous);groups[0].add(m);return m;});
 // 09: a browser plane turns into an app object while a local laptop unfolds.
 const browserWindow=new THREE.Group();browserWindow.add(plate(3.8,2.6,.12,white,.18));
 const webPlane=plate(3.5,2.05,.025,pale,.10);webPlane.position.set(0,-.14,.10);browserWindow.add(webPlane);
 for(let i=0;i<3;i++){const dot=sphere(.065,i===0?blue:lightBlue);dot.position.set(-1.5+i*.25,1.05,.11);browserWindow.add(dot);}
 groups[1].add(browserWindow);const localLaptop=laptop();groups[1].add(localLaptop.group);
 const nativeApp=appTile(0);groups[1].add(nativeApp);
 const appOrbit=torus(2.45,.032,luminous,Math.PI*1.3);appOrbit.rotation.set(.80,-.5,.1);groups[1].add(appOrbit);
 // 10: a depleted stack gives way to a dimensional package and an open device.
 const capacity=Array.from({length:6},(_,i)=>{const m=plate(.85,.24,.33,i<5?blue:pale,.09);m.position.set(-3.45,i*.31-.65,0);groups[2].add(m);return m;});
 const packageParts=Array.from({length:8},(_,i)=>{const m=plate(.48,.48,.48,i%3?blue:pale,.075);groups[2].add(m);return m;});
 const wrapper=Array.from({length:4},(_,i)=>{const m=plate(1.40,.90,.07,white,.09);groups[2].add(m);return m;});
 const installLaptop=laptop(3.35);groups[2].add(installLaptop.group);
 const packageOrbit=torus(1.9,.025,luminous,Math.PI*1.28);packageOrbit.rotation.set(.9,.2,.35);groups[2].add(packageOrbit);
 // 11: two distinct generic app objects dock into a common work surface.
 const pairApps=[appTile(0),appTile(1)];pairApps.forEach(g=>groups[3].add(g));
 const workspace=monitor(3.7);groups[3].add(workspace);
 const platform=plate(8.7,2.6,.14,pale,.35);platform.rotation.x=-Math.PI/2;platform.position.set(0,-1.34,.15);groups[3].add(platform);
 const deliverables=[documentTile(),documentTile(),tasks[1].clone(true),tasks[2].clone(true)];deliverables.forEach(g=>groups[3].add(g));
 const workArcs=[-1,1].map(side=>{const m=taperedPath([[side*.5,-.3,.2],[side*2.4,.55,1.25],[side*4.4,-.15,.15]],.032,luminous);groups[3].add(m);return m;});
 // 12: a phone and workstation exchange visible pulses over two spatial paths.
 const phone=new THREE.Group(),phoneShell=plate(1.65,3.25,.24,ink,.27),phoneScreen=plate(1.40,2.90,.025,pale,.20);
 phoneScreen.position.z=.155;phone.add(phoneShell,phoneScreen);const cameraDot=sphere(.047,ink);cameraDot.position.set(0,1.34,.19);phone.add(cameraDot);
 const phoneCore=new THREE.Mesh(new THREE.IcosahedronGeometry(.36,2),luminous);phoneCore.position.set(0,.18,.36);phone.add(phoneCore);
 const homeIndicator=bar(.48,.04,ink);homeIndicator.position.set(0,-1.28,.19);phone.add(homeIndicator);groups[4].add(phone);
 const remoteMonitor=monitor(3.55);groups[4].add(remoteMonitor);
 const remoteCore=new THREE.Mesh(new THREE.IcosahedronGeometry(.47,2),luminous);groups[4].add(remoteCore);
 const connectionCurves=[
  new THREE.CatmullRomCurve3([v(-2.4,.6,.1),v(-.4,1.35,-.5),v(2.15,.35,-.20)]),
  new THREE.CatmullRomCurve3([v(2.1,-.35,.1),v(.1,-1.10,1.1),v(-2.4,-.5,.7)])
 ];
 const connectionPaths=connectionCurves.map(c=>{const m=taperedPath(c.getPoints(12).map(p=>[p.x,p.y,p.z]),.035,luminous);groups[4].add(m);return m;});
 const pulses=Array.from({length:8},()=>{const m=sphere(.075,lightBlue);groups[4].add(m);return m;});

 function pose(i,t,a,reduced){
  const duration=BASIC_USE[i].duration,idle=reduced?0:Math.max(0,a-duration),breathe=Math.sin(idle*.68)*.055;
  if(i===0){
   const unfold=smooth(1.05,2.8,t),work=out(2.2,4.6,t),settle=smooth(4.8,6.4,t);
   groups[0].position.set(mix(3.1,4.0,settle),.08+breathe,0);groups[0].rotation.y=mix(-.46,-.16,settle)+Math.sin(idle*.3)*.025;
   chat.forEach((g,j)=>{const on=out(.05+j*.32,.8+j*.32,t),side=j?1:-1;g.position.set(side*mix(.35,3.0,unfold),mix(j?-.45:.65,j?.85:1.65,unfold),mix(j?-.30:.50,-1.1,unfold));g.rotation.set(unfold*.24,side*unfold*1.22,side*unfold*.12);appear(g,on*(1-smooth(2.4,3.1,t)));});
   agentMonitor.position.set(0,-.15,0);agentMonitor.rotation.y=(1-unfold)*-.80;appear(agentMonitor,unfold,.88);
   agentCore.position.set(0,.1,.62);agentCore.rotation.set(t*.17,t*.52+idle*.10,.2);appear(agentCore,out(1.65,3.05,t));
   tasks.forEach((g,j)=>{const on=out(2.3+j*.27,3.4+j*.3,t),p=[[-2.45,.9,.6],[2.3,.70,.4],[2.1,-1.35,.6]][j];g.position.set(p[0]*on,p[1]*on+(Math.sin(idle*.65+j)-Math.sin(j))*.04,p[2]+Math.sin(on*Math.PI)*.8);g.rotation.set(.12,-.2+(1-on)*1.8,(j-1)*.12);appear(g,on,.72);appear(taskPaths[j],on);});
  }else if(i===1){
   const release=smooth(1.45,3.1,t),open=smooth(2.0,4.25,t),dock=smooth(3.4,5.4,t);
   groups[1].position.set(-3.6,breathe,0);groups[1].rotation.y=.22+Math.sin(idle*.4)*.025;
   browserWindow.position.set(mix(.1,-1.8,release),mix(.05,1.85,release),mix(.65,-1.3,release));browserWindow.rotation.set(-release*.23,-release*.82,.02);appear(browserWindow,1-smooth(2.6,3.5,t),out(0,.75,t));
   localLaptop.group.position.set(0,-.1,0);localLaptop.hinge.rotation.x=mix(-1.48,-.06,open);appear(localLaptop.group,out(1.8,3.2,t));
   nativeApp.position.set(mix(.2,0,dock),mix(.48,.24,dock)+Math.sin(dock*Math.PI)*.75,mix(1.4,-.4,dock));nativeApp.rotation.set(mix(.15,0,dock),mix(-1.5,0,release),mix(-.3,.04,dock));appear(nativeApp,out(.85,2.35,t),mix(1.2,.82,dock));
   appOrbit.position.y=.12;appOrbit.rotation.z=.4+t*.15+idle*.025;appear(appOrbit,out(2.15,3.7,t));
  }else if(i===2){
   const bloom=smooth(1.65,3.55,t),travel=smooth(3.55,5.9,t),settle=smooth(5.8,7.3,t);
   groups[2].position.set(0,-2.52+breathe,0);groups[2].scale.setScalar(.83);groups[2].rotation.y=-.12;
   capacity.forEach((m,j)=>{const gone=smooth(.25+(5-j)*.17,.95+(5-j)*.17,t);m.scale.set(1,Math.max(.001,1-gone),1);m.visible=gone<.998;});
   const centerX=mix(-.2,3.0,travel),centerY=mix(.35,.20,travel)+Math.sin(travel*Math.PI)*1.15;
   packageParts.forEach((m,j)=>{const side=[(j%2-.5)*.54,(Math.floor(j/2)%2-.5)*.54,(Math.floor(j/4)-.5)*.54],spread=mix(2.7,1,bloom);m.position.set(centerX+side[0]*spread,centerY+side[1]*spread,.55+side[2]*spread);m.rotation.set((1-bloom)*(j%3)*.6,(1-bloom)*(j%2?1:-1)*.9+idle*.035,0);appear(m,out(1.45+j*.035,2.5+j*.035,t),mix(1,.67,travel));});
   wrapper.forEach((m,j)=>{const ang=j*Math.PI/2+.35,open=out(1.6,3.15,t);m.position.set(-.2+Math.cos(ang)*(1.0+open*.8),.25+Math.sin(ang)*(.65+open*.55),-.45-open*.4);m.rotation.set(.12,ang+open*.55,Math.sin(ang)*.14);appear(m,out(.95,1.8,t)*(1-smooth(4.8,6.4,t)),.85);});
   installLaptop.group.position.set(3,-.13,-.3);installLaptop.hinge.rotation.x=mix(-1.48,-.04,out(3.0,4.9,t));appear(installLaptop.group,out(2.8,4.2,t),.77);
   packageOrbit.position.set(-.2,.2,-.25);packageOrbit.rotation.z=.35+t*.19+idle*.022;appear(packageOrbit,out(1.8,3.2,t)*(1-settle*.45));
  }else if(i===3){
   const dock=smooth(1.7,3.8,t),work=smooth(3.0,5.6,t);
   groups[3].position.set(0,-2.16+breathe,0);groups[3].scale.setScalar(.83);groups[3].rotation.y=Math.sin(idle*.27)*.018;
   pairApps.forEach((g,j)=>{const side=j?1:-1,on=out(.15+j*.45,1.15+j*.45,t);g.position.set(side*mix(2.8,.85,dock),mix(.65,.23,dock)+Math.sin(dock*Math.PI)*.6,mix(.9,.5,dock));g.rotation.set((1-dock)*.16,side*mix(-.55,.05,dock),(1-dock)*side*-.17);appear(g,on,mix(1.02,.68,dock));});
   workspace.position.y=-.12;appear(workspace,out(1.3,3.1,t),.9);appear(platform,out(1.7,3.5,t));
   deliverables.forEach((g,j)=>{const side=j<2?-1:1,on=out(3.2+j*.25,4.7+j*.27,t);g.position.set(side*mix(1.2,3.5+(j%2)*1.15,on),mix(.05,(j%2?-.30:.60),on),Math.sin(on*Math.PI)*1.0+.25);g.rotation.set(.05,side*-.22,(j%2?1:-1)*.10);appear(g,on,.78);});
   workArcs.forEach((g,j)=>{g.position.y=Math.sin(idle*.5+j)*.025;appear(g,work);});
  }else{
   const face=smooth(.4,2.2,t),connect=out(2.0,4.35,t),settle=smooth(4.7,6.8,t);
   groups[4].position.set(0,-1.64+breathe,0);groups[4].scale.setScalar(.87);
   phone.position.set(mix(-5.8,-2.7,face),.10,1.0);phone.rotation.set(.04,mix(.9,.27,face),mix(-.23,-.06,face));appear(phone,out(.05,.9,t));
   remoteMonitor.position.set(mix(6.4,2.50,face),0,-.5);remoteMonitor.rotation.y=mix(-.85,-.18,face);appear(remoteMonitor,out(.55,1.5,t));
   phoneCore.rotation.set(.12,t*.52+idle*.11,.2);remoteCore.position.set(2.5,.25,-.17);remoteCore.rotation.set(.12,-t*.4-idle*.1,.2);appear(remoteCore,out(1.2,2.2,t));
   connectionPaths.forEach((g,j)=>{g.rotation.y=(1-connect)*(j?-.35:.35);appear(g,connect);});
   pulses.forEach((m,j)=>{const lane=j%2,phase=(j/8+t*.22+idle*.10)%1;const p=connectionCurves[lane].getPoint(phase);m.position.copy(p);appear(m,connect*Math.sin(phase*Math.PI),.8+settle*.2);});
  }
 }
 function camera(i,t){
  const settle=smooth(0,BASIC_USE[i].duration-1.1,t),arc=Math.sin(settle*Math.PI);
  const starts=[[2.7,2.1,13.3],[-2.4,2.2,13.8],[1.8,3.8,15.1],[-1.7,3.3,15.3],[2.8,2.7,15.1]][i];
  const ends=[[.3,.65,14.4],[-.15,.7,14.4],[.1,.6,14.5],[.0,.55,14.4],[.0,.7,14.6]][i];
  const position=v(mix(starts[0],ends[0],settle)+arc*(i%2?-.45:.45),mix(starts[1],ends[1],settle),mix(starts[2],ends[2],settle));position.x+=roots[i].position.x;
  return {position,target:v(roots[i].position.x,0,0)};
 }
 function particles(buffer,i,t,a,total,reduced){
  const duration=BASIC_USE[i].duration,idle=reduced?0:Math.max(0,a-duration),time=t+idle*.38,base=groups[i].position,scale=groups[i].scale.x;
  for(let j=0;j<total;j++){
   const q=seeded(j+2),p=(q+time*.11)%1,angle=j*2.39996+time*.27;let x,y,z;
   if(i===0){const unfold=smooth(1.2,3.6,t),r=mix(.6,1.4+q*1.7,unfold);x=Math.cos(angle)*r;y=Math.sin(angle)*r*.80;z=Math.sin(angle*.73)*.7;}
   else if(i===1){const r=1.35+q*1.25;x=Math.cos(angle)*r;y=Math.sin(angle)*r*.76;z=Math.sin(angle)*1.05;}
   else if(i===2){x=mix(-3.7,3.4,p);y=Math.sin(p*Math.PI)*1.15+(seeded(j+8)-.5)*.24;z=Math.sin(angle)*.20+.45;}
   else if(i===3){x=mix(-4.8,4.8,p);y=Math.sin(p*Math.PI*2)*.60+(j%3-1)*.30;z=Math.sin(angle)*.27+.3;}
   else{
    // phone-connection only: stable scattered identities, independent of the two signal arcs.
    x=(seeded(j+177)*2-1)*5.9+Math.sin(time*.12+j*.37)*.16;
    y=(seeded(j+419)*2-1)*2.3+Math.cos(time*.10+j*.29)*.13;
    z=(seeded(j+593)*2-1)*1.65;
   }
   buffer[j*3]=roots[i].position.x+base.x+x*scale;buffer[j*3+1]=base.y+y*scale;buffer[j*3+2]=base.z+z*scale;
  }
 }
 function createChapterDevice(){const device=laptop();const mark=appTile(0);device.group.add(mark);return {...device,mark};}
 return {roots,pose,camera,particles,createChapterDevice};
}
