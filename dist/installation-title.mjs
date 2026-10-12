import * as THREE from 'three';
import {clamp,smooth,mix} from './presentation.mjs';
const out=(a,b,t)=>1-Math.pow(1-clamp((t-a)/(b-a)),4);
export const INSTALLATION_CUES=[
 {t:.35,kind:'word',name:'installation-title-ai'},
 {t:.90,kind:'soft',name:'installation-title-computer'},
 {t:1.35,kind:'word',name:'installation-title-install'},
 {t:2.9,kind:'soft',name:'installation-title-dock'}
];
export function installationTitleMarkup(page){
 return `<div class="installation-title-copy"><h1 aria-label="${page.title}">${page.title.split(' ').map((word,i)=>`${i?' ':''}<span class="chapter-line" data-install-word="${i}">${word}</span>`).join('')}</h1><div class="installation-rule" aria-hidden="true"></div></div>`;
}
export function renderInstallationTitle(screen,t,reduced){
 if(reduced)t=5;
 screen.querySelectorAll('[data-install-word]').forEach((word,i)=>{const p=smooth([.35,.90,1.35][i],[.35,.90,1.35][i]+.32,t);word.style.opacity=p;word.style.transform=`translate3d(0,${(1-p)*75}px,0) rotateX(${(1-p)*-12}deg) scale(${1+(1-p)*.04})`;});
 const rule=screen.querySelector('.installation-rule');rule.style.opacity=smooth(1.1,1.6,t);rule.style.transform=`scaleX(${out(1.45,2.4,t)})`;
}
// Reuses the existing app/laptop language. This is an illustrative chapter divider.
export function createInstallationWorld({scene,createDevice,torus,blue,seeded}){
 const root=new THREE.Group();root.position.x=80;scene.add(root);
 const group=new THREE.Group();root.add(group);
 const device=createDevice();group.add(device.group);
 const material=blue.clone();material.emissive=new THREE.Color(0x2255ed);material.emissiveIntensity=.12;
 const orbit=torus(2.95,.030,material,Math.PI*1.48);group.add(orbit);
 function pose(t,a,reduced){
  const idle=reduced?0:Math.max(0,a-5),enter=out(.15,1.4,t),open=smooth(.45,2.4,t),dock=smooth(.9,3.25,t);
  group.position.set(4.05,.1+Math.sin(idle*.65)*.045,0);group.rotation.y=.12+Math.sin(idle*.4)*.025;
  device.group.scale.setScalar(Math.max(.001,enter*.94));device.group.rotation.y=mix(-.65,.10,open);device.hinge.rotation.x=mix(-1.32,-.04,open);
  device.mark.position.set(mix(-.65,0,dock),mix(1.65,.26,dock)+Math.sin(dock*Math.PI)*.55,mix(1.8,-.36,dock));device.mark.rotation.set((1-dock)*.12,mix(-.75,.02,dock)+Math.sin(idle*.45)*.025,mix(-.22,0,dock));device.mark.scale.setScalar(Math.max(.001,out(.65,1.45,t)*mix(1.05,.82,dock)));
  orbit.rotation.set(.82,-.35,.35+t*.19+idle*.025);orbit.position.y=.02;orbit.scale.setScalar(Math.max(.001,out(.3,1.8,t)));
 }
 function camera(t){const p=smooth(0,4.5,t);return {position:new THREE.Vector3(80+mix(2.6,.3,p),mix(2.1,.75,p),mix(14.8,14.4,p)),target:new THREE.Vector3(80,0,0)};}
 function particles(buffer,t,a,total,reduced){
  const idle=reduced?0:Math.max(0,a-5),time=t+idle*.22,settle=smooth(.2,2.4,t);
  for(let j=0;j<total;j++){const q=seeded(j+2),angle=j*2.39996+time*.23,phi=Math.acos(2*q-1),r=mix(3.3+q,1.35+q*1.65,settle);buffer[j*3]=root.position.x+group.position.x+Math.cos(angle)*Math.sin(phi)*r;buffer[j*3+1]=group.position.y+Math.cos(phi)*r*.72;buffer[j*3+2]=Math.sin(angle)*Math.sin(phi)*r*.5;}
 }
 return {root,pose,camera,particles};
}
