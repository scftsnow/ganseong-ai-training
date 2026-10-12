import * as THREE from 'three';
import {createTextClearance} from './text-clearance.mjs?v=20261010-tips-stage-final';
import {createUsageTipWorld} from './usage-tips.mjs?v=20261010-six-particle-style';
import {createClosingWorld} from './closing.mjs?v=20261010-book-left-opening';
import {createPracticeWorld} from './practice.mjs';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';
import {createPreludeWorld} from './prelude.mjs?v=20261010-tips-stage-final';
import {createBasicUseWorld} from './basic-use.mjs';
import {questionOutlineGeometry} from './question-outline.mjs';
import {createInstallationWorld} from './installation-title.mjs';
import {PAGES} from './presentation.mjs?v=20261010-tips-stage-final';

const BLUE=0x2255ed, PALE=0xdbe5ff, INK=0x17223a;
const clamp=THREE.MathUtils.clamp,lerp=THREE.MathUtils.lerp;
const smooth=(a,b,t)=>{const v=clamp((t-a)/(b-a),0,1);return v*v*(3-2*v);};
const out=(a,b,t)=>1-Math.pow(1-clamp((t-a)/(b-a),0,1),4);
const seeded=n=>{const x=Math.sin(n*127.1+19.7)*43758.5453;return x-Math.floor(x);};
const v=(x,y,z=0)=>new THREE.Vector3(x,y,z);
function rounded(w,h,r=.14){const s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}
function solid(shape,depth,material){const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:3,bevelSize:.035,bevelThickness:.035,steps:1,curveSegments:24});g.translate(0,0,-depth/2);const m=new THREE.Mesh(g,material);m.castShadow=true;m.receiveShadow=true;return m;}
function plate(w,h,d,mat,r){return solid(rounded(w,h,r),d,mat);}
function tube(points,r,mat){return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>v(...p))),64,r,8,false),mat);}
function taperedPath(points,thickness,mat){
 const curve=new THREE.CatmullRomCurve3(points.map(p=>v(...p))),segments=112,sides=10;
 const geometry=new THREE.TubeGeometry(curve,segments,thickness,sides,false),positions=geometry.attributes.position;
 const offset=new THREE.Vector3();
 for(let i=0;i<=segments;i++){
  const u=i/segments,center=curve.getPointAt(u),width=.003+1.497*Math.pow(Math.sin(Math.PI*u),1.12);
  for(let j=0;j<=sides;j++){
   const n=i*(sides+1)+j;offset.fromBufferAttribute(positions,n).sub(center).multiplyScalar(width).add(center);
   positions.setXYZ(n,offset.x,offset.y,offset.z);
  }
 }
 geometry.computeVertexNormals();return new THREE.Mesh(geometry,mat);
}
function torus(r,thickness,mat,arc=Math.PI*2){
 // Physical closed rings retain their section. Open motion curves have needle-fine tips.
 if(arc>=Math.PI*2-.001)return new THREE.Mesh(new THREE.TorusGeometry(r,thickness,12,100,arc),mat);
 const segments=180,sides=10,vertices=[],indices=[];
 for(let i=0;i<=segments;i++){
  const u=i/segments,angle=u*arc,halfWidth=thickness*(.003+1.497*Math.pow(Math.sin(Math.PI*u),1.12));
  for(let j=0;j<=sides;j++){
   const around=j/sides*Math.PI*2,radial=r+Math.cos(around)*halfWidth;
   vertices.push(Math.cos(angle)*radial,Math.sin(angle)*radial,Math.sin(around)*halfWidth);
  }
 }
 for(let i=0;i<segments;i++)for(let j=0;j<sides;j++){
  const a=i*(sides+1)+j,b=a+sides+1;indices.push(a,b,a+1,b,b+1,a+1);
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();
 return new THREE.Mesh(geometry,mat);
}
function sphere(r,mat){return new THREE.Mesh(new THREE.SphereGeometry(r,32,24),mat);}
function scaleIn(obj,p){obj.scale.setScalar(Math.max(.001,p));obj.visible=p>.001;}
function makeBulb(blue,glass,white){
 const group=new THREE.Group();
 // Smooth meridian as well as circumference: the old nine-point profile faceted the silhouette.
 const p=(x,y)=>new THREE.Vector2(x,y),profile=new THREE.CurvePath();
 profile.add(new THREE.CubicBezierCurve(p(.27,-.90),p(.28,-.70),p(.35,-.55),p(.46,-.38)));
 profile.add(new THREE.CubicBezierCurve(p(.46,-.38),p(.72,.02),p(.91,.20),p(.86,.50)));
 profile.add(new THREE.CubicBezierCurve(p(.86,.50),p(.81,.80),p(.48,1.23),p(0,1.23)));
 const shellMaterial=glass.clone();shellMaterial.opacity=.42;shellMaterial.roughness=.13;shellMaterial.side=THREE.FrontSide;
 const shell=new THREE.Mesh(new THREE.LatheGeometry(profile.getPoints(32),96),shellMaterial);shell.geometry.computeVertexNormals();group.add(shell);
 const glow=sphere(.30,new THREE.MeshStandardMaterial({color:0x82a6ff,emissive:0x2255ed,emissiveIntensity:.8,roughness:.24}));glow.position.y=.30;group.add(glow);
 const filament=tube([[-.22,-.8,0],[-.22,.1,0],[0,.42,0],[.22,.1,0],[.22,-.8,0]],.036,white);group.add(filament);
 const base=new THREE.Mesh(new THREE.CylinderGeometry(.3,.23,.45,32),blue);base.position.y=-1.14;group.add(base);
 for(let i=0;i<4;i++){const ring=torus(.29-i*.014,.035,white);ring.rotation.x=Math.PI/2;ring.position.y=-.99-i*.09;group.add(ring);}
 const rays=new THREE.Group();group.add(rays);
 for(let i=0;i<9;i++){const angle=i*Math.PI*2/9;const ray=plate(.045,.40,.035,blue,.02);ray.position.set(Math.sin(angle)*1.52,.30+Math.cos(angle)*1.52,-.02);ray.rotation.z=-angle;rays.add(ray);}
 group.userData={glow,rays};return group;
}
function questionMark(mat){
 return new THREE.Mesh(questionOutlineGeometry(),mat);
}
function bubble(mat,markMat,tail=1){
 const s=rounded(2.05,1.72,.30),g=new THREE.Group();g.add(solid(s,.20,mat));
 const triangle=new THREE.Shape();triangle.moveTo(tail*.32,-.65);triangle.lineTo(tail*.82,-1.15);triangle.lineTo(tail*.79,-.48);triangle.closePath();g.add(solid(triangle,.18,mat));
 const mark=questionMark(markMat);mark.position.z=.16;g.add(mark);return g;
}
function magnifier(blue,glass){
 const g=new THREE.Group();g.add(torus(.72,.09,blue));
 const lens=new THREE.Mesh(new THREE.CircleGeometry(.65,60),glass);g.add(lens);
 const h=new THREE.Mesh(new THREE.CapsuleGeometry(.10,.68,8,20),blue);h.rotation.z=.74;h.position.set(.72,-.72,0);g.add(h);return g;
}
function paper(mat,lineMat){
 const g=new THREE.Group();g.add(plate(1.25,1.65,.07,mat,.12));
 for(let i=0;i<4;i++){const line=plate(i===0?.55:.86-i*.07,.055,.014,lineMat,.024);line.position.set(i===0?-.15:0,.50-i*.26,.071);g.add(line);}
 return g;
}

export function createWorld(container){
 const scene=new THREE.Scene(),renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.90;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;container.appendChild(renderer.domElement);
 const camera=new THREE.PerspectiveCamera(39,1,.1,160);
 const room=new RoomEnvironment(),pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xe4edff,0xb9bfd0,1.3));
 const key=new THREE.DirectionalLight(0xffffff,3.2);key.position.set(-8,12,9);scene.add(key);
 const rim=new THREE.DirectionalLight(0x88a8ff,3);rim.position.set(8,2,-7);scene.add(rim);
 const blue=new THREE.MeshPhysicalMaterial({color:BLUE,roughness:.22,metalness:.28,clearcoat:1,clearcoatRoughness:.16});
 const white=new THREE.MeshStandardMaterial({color:0xf4f7ff,roughness:.27,metalness:.25});
 const pale=new THREE.MeshPhysicalMaterial({color:PALE,roughness:.2,metalness:.35,clearcoat:1});
 const glass=new THREE.MeshPhysicalMaterial({color:0xa4baff,roughness:.08,metalness:.05,transparent:true,opacity:.27,side:THREE.DoubleSide,depthWrite:false,clearcoat:1});
 const lineBlue=new THREE.MeshBasicMaterial({color:0x5d83f5});
 // Decorative paths share the accepted title's physical blue surface. Structural wires stay slender.
 const motionBlue=blue.clone();motionBlue.emissive=new THREE.Color(BLUE);motionBlue.emissiveIntensity=.12;
 const roots=[0,1,2,3].map(i=>{const g=new THREE.Group();g.position.x=i*20;scene.add(g);return g;});
 const art=roots.map(r=>{const g=new THREE.Group();r.add(g);return g;});
 // 01: a first spark grows into a dimensional idea, while mundane fragments open out.
 const bulb=makeBulb(blue,glass,white);art[0].add(bulb);
 const obstacles=[];
 for(let i=0;i<14;i++){const m=plate(.45+seeded(i)*.42,.45+seeded(i+2)*.55,.12,i%3?white:pale,.08);art[0].add(m);obstacles.push(m);}
 const ideaArcs=[];
 for(let i=0;i<2;i++){const m=torus(2.30+i*.65,i===0?.035:.022,motionBlue,Math.PI*(i===0?1.15:.95));m.position.y=i===0?.35:-.30;art[0].add(m);ideaArcs.push(m);}
 // 02: one seed enters a machine core; research, planning, making and revision unfold.
 const seed=makeBulb(blue,glass,white);art[1].add(seed);
 const core=new THREE.Group();art[1].add(core);
 const coreShape=new THREE.Mesh(new THREE.IcosahedronGeometry(.76,1),blue);core.add(coreShape);
 const cage=new THREE.Mesh(new THREE.IcosahedronGeometry(.95,1),new THREE.MeshBasicMaterial({color:0x98b3ff,wireframe:true,transparent:true,opacity:.42}));core.add(cage);
 const machineRings=[0,1].map(i=>{const m=torus(1.03,.045,pale);m.rotation.set(i?1.2:.35,.3,i?.3:1.1);core.add(m);return m;});
 const tools=[];
 const research=magnifier(blue,glass);tools.push(research);
 const planning=new THREE.Group();
 for(const p of [[0,.45],[-.45,-.35],[.45,-.35]]){const m=plate(.38,.34,.13,pale,.06);m.position.set(...p,0);planning.add(m);}
 planning.add(tube([[0,.25,0],[0,.03,0],[-.45,-.2,0]],.032,lineBlue));planning.add(tube([[0,.03,0],[.45,-.2,0]],.032,lineBlue));tools.push(planning);
 const making=new THREE.Group();
 for(let i=0;i<4;i++){const m=plate(.45,.45,.4,i%2?blue:pale,.04);m.position.set((i%2-.5)*.51,(Math.floor(i/2)-.5)*.51,0);making.add(m);}tools.push(making);
 const revision=new THREE.Group();revision.add(torus(.56,.065,pale,Math.PI*1.72));
 const tip=new THREE.Mesh(new THREE.ConeGeometry(.15,.35,3),blue);tip.position.set(.38,-.43,0);tip.rotation.z=-.8;revision.add(tip);tools.push(revision);
 for(const obj of tools)art[1].add(obj);
 const output=paper(white,blue);art[1].add(output);
 const paths=[],branchCurves=[];
 for(let i=0;i<4;i++){
  const lane=i-1.5,endX=2.3+(i%2)*.28,endY=lane*1.04;
  const curve=new THREE.CubicBezierCurve3(v(-1,.25,.08),v(.10,.25,.30),v(1.25,endY,.30),v(endX,endY,.02));
  const p=taperedPath(curve.getPoints(24).map(p=>p.toArray()),.028,motionBlue);
  // Only these four branches expose their actual generated centerline to their particles.
  branchCurves.push(p.geometry.parameters.path);art[1].add(p);paths.push(p);
 }
 // 03: reciprocal question bubbles travel along two separate directions.
 const askAI=bubble(blue,white,1),askPerson=bubble(white,blue,-1);art[2].add(askAI,askPerson);
 const understanding=new THREE.Group();art[2].add(understanding);
 for(let i=0;i<3;i++){const m=plate(.24,.8+i*.12,.18,i===1?blue:pale,.08);m.position.set((i-1)*.38,0,0);understanding.add(m);}
 const questionOrbit=torus(2.7,.037,motionBlue,Math.PI*1.5);questionOrbit.rotation.set(.78,-.42,.3);art[2].add(questionOrbit);
 // 04: sources arrive from a globe; a moving lens inspects, then a check settles on a shield.
 const globe=new THREE.Group();art[3].add(globe);
 const earth=sphere(1.36,new THREE.MeshPhysicalMaterial({color:BLUE,transparent:true,opacity:.10,roughness:.2,depthWrite:false}));globe.add(earth);
 for(let i=0;i<6;i++){const m=torus(1.38,.014,lineBlue);m.rotation.y=i*Math.PI/6;globe.add(m);}
 for(let i=-2;i<=2;i++){const y=i*.42,r=Math.sqrt(1.38*1.38-y*y),m=torus(r,.014,lineBlue);m.rotation.x=Math.PI/2;m.position.y=y;globe.add(m);}
 const sources=[0,1,2].map(i=>{const g=paper(i===1?pale:white,blue);art[3].add(g);return g;});
 const lens=magnifier(blue,glass);art[3].add(lens);
 const shield=new THREE.Group(),shieldShape=new THREE.Shape();
 shieldShape.moveTo(0,.82);shieldShape.lineTo(.66,.54);shieldShape.lineTo(.55,-.22);shieldShape.quadraticCurveTo(.38,-.63,0,-.86);shieldShape.quadraticCurveTo(-.38,-.63,-.55,-.22);shieldShape.lineTo(-.66,.54);shieldShape.closePath();
 shield.add(solid(shieldShape,.17,blue));const check=tube([[-.32,-.02,.15],[-.06,-.27,.15],[.36,.30,.15]],.067,white);shield.add(check);art[3].add(shield);
 // Information must wait at the lens before the approval checkpoint releases it.
 const reviewPoint=v(1.224,.696,1.127),reviewOffset=new THREE.Vector3();
 const reviewInput=new THREE.CubicBezierCurve3(v(-.42,.35,-.45),v(.05,1.12,.10),v(.82,1.08,1.10),reviewPoint);
 const reviewOutputs=sources.map((_,j)=>new THREE.CubicBezierCurve3(reviewPoint,v(1.60,.10,1.50),v((j-1)*1.05,.05,.90),v((j-1)*1.05,-.55+Math.abs(j-1)*.26,.65)));
 const reviewInk=new THREE.MeshBasicMaterial({color:BLUE,transparent:true,opacity:.32,depthWrite:false});
 const reviewLines=[reviewInput,...reviewOutputs].map((curve,j)=>{const m=new THREE.Mesh(new THREE.TubeGeometry(curve,72,.013,6,false),reviewInk.clone());m.name='supervision-route-'+j;art[3].add(m);return m;});
 const scanBeam=plate(1.02,.032,.018,lineBlue,.012);scanBeam.position.z=.13;lens.add(scanBeam);scanBeam.name='supervision-review-scan';check.name='supervision-approval-check';
 const reviewState=(a,reduced)=>{const elapsed=reduced?2.85:Math.max(0,a-.6);return {phase:elapsed%4.4,lane:Math.floor(elapsed/4.4)%3};};
 // Contact shadows are local procedural textures, not screenshots of a motion mockup.
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;const sc=shadowCanvas.getContext('2d'),gradient=sc.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,'rgba(25,42,85,.23)');gradient.addColorStop(1,'rgba(25,42,85,0)');sc.fillStyle=gradient;sc.fillRect(0,0,128,128);
 const shadowTex=new THREE.CanvasTexture(shadowCanvas);
 const shadows=roots.map(root=>{const sh=new THREE.Mesh(new THREE.PlaneGeometry(7.5,5),new THREE.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=-2.45;root.add(sh);return sh;});
 const prelude=createPreludeWorld({scene,blue,white,pale,lineBlue,plate,torus,sphere,seeded,motifs:[makeBulb(blue,glass,white),core,bubble(blue,white,1),globe]});
 const basic=createBasicUseWorld({scene,blue,white,pale,plate,torus,sphere,taperedPath,seeded});
 const closing=createClosingWorld({scene,blue,white,pale,plate,torus,sphere,taperedPath,seeded});
 const tips=createUsageTipWorld({scene,blue,white,pale,plate,torus,sphere,taperedPath,seeded});
 const practice=createPracticeWorld({scene,blue,white,pale,plate,torus,sphere,taperedPath,seeded});
 const installation=createInstallationWorld({scene,createDevice:basic.createChapterDevice,torus,blue,seeded});
 const N=4800,TRAIL=900,positions=new Float32Array((N+TRAIL)*3),colors=new Float32Array((N+TRAIL)*3),sizes=new Float32Array(N+TRAIL);
 for(let i=0;i<N+TRAIL;i++){const q=seeded(i+71),col=new THREE.Color().setHSL(.622,.83,.46+q*.20);colors.set([col.r,col.g,col.b],i*3);sizes[i]=.45+Math.pow(q,3)*1.1;}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));geometry.setAttribute('aScale',new THREE.BufferAttribute(sizes,1));
 const textClearance=createTextClearance(THREE);
 const particleShared={...textClearance.uniforms,uResolution:{value:new THREE.Vector2(1,1)},uMaskA:{value:new THREE.Vector4()},uMaskB:{value:new THREE.Vector4()},uMaskMix:{value:0},uMaskWeight:{value:1}};
 const vertexShader=`attribute vec3 color;attribute float aScale;varying vec3 vColor;varying float vAlpha;uniform vec2 uResolution;uniform float uSize;
 void main(){vColor=color;vAlpha=mix(.25,1.0,smoothstep(.5,1.5,aScale));vec4 mv=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(uSize*aScale*uResolution.y*.5/max(.1,-mv.z),1.0,32.0);}`;
 const fragmentShader=`varying vec3 vColor;varying float vAlpha;uniform vec2 uResolution;uniform vec4 uMaskA;uniform vec4 uMaskB;uniform float uMaskMix;uniform float uMaskWeight;uniform float uOpacity;uniform float uTextScoped;uniform int uTextCount;uniform vec4 uTextRects[24];uniform float uTextAlpha[24];
 float mask(vec2 p,vec4 b){return smoothstep(b.x-.012,b.x,p.x)*(1.0-smoothstep(b.z,b.z+.012,p.x))*smoothstep(b.y-.012,b.y,p.y)*(1.0-smoothstep(b.w,b.w+.012,p.y));}
 void main(){vec2 q=gl_PointCoord-.5;float r=length(q);if(r>.5)discard;vec2 uv=gl_FragCoord.xy/uResolution;uv.y=1.0-uv.y;
 float legacy=uMaskWeight*mix(mask(uv,uMaskA),mask(uv,uMaskB),uMaskMix);float liveText=0.0;for(int i=0;i<24;i++){if(i>=uTextCount)break;vec4 b=uTextRects[i];float cover=smoothstep(b.x-.003,b.x,uv.x)*(1.0-smoothstep(b.z,b.z+.003,uv.x))*smoothstep(b.y-.003,b.y,uv.y)*(1.0-smoothstep(b.w,b.w+.003,uv.y));liveText=max(liveText,cover*uTextAlpha[i]);}float clearType=1.0-mix(legacy,liveText,uTextScoped);float ui=smoothstep(.105,.135,uv.y)*(1.0-smoothstep(.845,.89,uv.y));
 float core=exp(-r*r*56.0);float alpha=(.90*core+.40*exp(-r*r*10.0))*(1.0-smoothstep(.37,.5,r))*uOpacity*vAlpha*clearType*ui;
 gl_FragColor=vec4(mix(vColor,vec3(.38,.56,1.0),core*.45),alpha);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`;
 const particleMaterial=(size,opacity)=>new THREE.ShaderMaterial({uniforms:{...particleShared,uSize:{value:size},uOpacity:{value:opacity}},vertexShader,fragmentShader,transparent:true,depthWrite:false,depthTest:true});
 const pointMaterial=particleMaterial(.13,.75),trailMaterial=particleMaterial(.234,.88);
 geometry.setDrawRange(0,N);
 const trailGeometry=new THREE.BufferGeometry();trailGeometry.setAttribute('position',geometry.attributes.position);trailGeometry.setAttribute('color',geometry.attributes.color);trailGeometry.setAttribute('aScale',geometry.attributes.aScale);trailGeometry.setDrawRange(N,TRAIL);
 const particles=new THREE.Points(geometry,pointMaterial),trails=new THREE.Points(trailGeometry,trailMaterial);
 // Positions move among distant scene roots. A cached first-scene bounding sphere is invalid thereafter.
 particles.frustumCulled=false;trails.frustumCulled=false;scene.add(particles,trails);
 // Page05/06/07 own these local alpha/curve corrections. Other pages keep original materials.
 const localAlpha=new Float32Array(N+TRAIL).fill(1);
 geometry.setAttribute('aAlpha',new THREE.BufferAttribute(localAlpha,1));trailGeometry.setAttribute('aAlpha',geometry.attributes.aAlpha);
 const localVertex=vertexShader.replace('attribute vec3 color;','attribute float aAlpha;attribute vec3 color;').replace('vAlpha=mix(', 'vAlpha=aAlpha*mix(');
 function localMaterial(source){const m=source.clone();m.vertexShader=localVertex;m.uniforms=source.uniforms;return m;}
 const localPoints=localMaterial(pointMaterial),localTrails=localMaterial(trailMaterial),orbitPoint=new THREE.Vector3();
 function selectParticleScope(local){particles.material=local?localPoints:pointMaterial;trails.material=local?localTrails:trailMaterial;}

 const cameraPaths=[
  [[-1.8,1.8,13.6],[-.5,1.4,12.9],[.7,1.1,12.4],[.4,.8,12.0]],
  [[6.2,4.0,15.3],[3.2,2.8,14.5],[.2,1.6,14.0],[-.4,1.1,13.8]],
  [[-4.2,1.9,13.6],[-2.1,1.4,12.9],[.8,1.1,12.5],[.3,.8,12.6]],
  [[3.7,3.6,14.6],[2.1,2.2,13.8],[.8,1.2,12.8],[.3,.8,12.4]]
 ].map(points=>new THREE.CatmullRomCurve3(points.map(p=>v(...p))));
 let width=1,height=1;
 function resize(){const b=container.getBoundingClientRect();width=b.width;height=b.height;renderer.setSize(width,height,false);renderer.getDrawingBufferSize(particleShared.uResolution.value);camera.aspect=width/Math.max(1,height);camera.updateProjectionMatrix();}
 resize();
 function particleStyle(page,t,opacity,size,transfer=0){
  textClearance.update(PAGES[page],t,transfer,width,height);
  const introRects=[[.06,.23,.60,.79],[.06,.13,.60,.84],[.06,.19,.57,.76],[.06,.19,.54,.77],[.06,.13,.94,.57],[.51,.18,.96,.77],[.06,.20,.57,.79],[.06,.18,.57,.79],[.06,.19,.54,.79],[.515,.18,.955,.79],[.06,.12,.94,.60],[.06,.13,.95,.52],[.06,.13,.95,.42]];
  const readingRects={3:[.06,.18,.55,.75],4:[.525,.18,.95,.76],5:[.06,.18,.56,.76],6:[.06,.18,.55,.76]};
  const mask=PAGES[page].kind==='usage-tip'?[.055,.14,.655,.86]:PAGES[page].id==='ending'?[.055,.16,.945,.57]:introRects[page]??[.06,.18,.56,.80];
  particleShared.uMaskA.value.fromArray(mask);particleShared.uMaskB.value.fromArray(readingRects[page]??mask);particleShared.uMaskMix.value=page>=3&&page<=6?smooth(3.45,4.65,t):0;
  // The five practice intros have no visible copy before3.5s. Do not erase half their particles for future text.
  const delayedPracticeCopy=PAGES[page].kind==='practice'&&PAGES[page].practiceIndex>0;
  particleShared.uMaskWeight.value=page===0?smooth(.45,.75,t):delayedPracticeCopy?smooth(3.5,3.88,t):PAGES[page].kind==='usage-tip'?smooth(3.5,3.82,t):1;
  pointMaterial.uniforms.uOpacity.value=opacity*(1-transfer*.5);pointMaterial.uniforms.uSize.value=size;
  trailMaterial.uniforms.uOpacity.value=Math.min(.95,opacity*1.18)*(1-transfer*.5);trailMaterial.uniforms.uSize.value=size*1.8;
 }
 function pose(i,t,a,reduced,focus){
  const read=smooth(3.55,4.25,t),life=reduced?0:Math.sin(a*.6)*.04,narrow=width<760;
  const idle=reduced?0:Math.max(0,a-5),float=Math.sin(idle*.72)*.065;
  const targetX=[4.05,-5.05,4.50,4.05][i],introX=[2.25,0,-2.6,2.35][i];
  art[i].position.set(narrow?0:lerp(introX,targetX,read),narrow?lerp(-1.65,-.22,read):i===1?lerp(-1.6,.15,read):.12,0);
  art[i].position.y+=float;
  art[i].scale.setScalar((narrow?(i===1?lerp(.53,1.10,read):lerp(.72,1.60,read)):1)*(i===1?lerp(.9,.77,read):lerp(1,.86,read)));
  art[i].rotation.y=life+focus*.045;
  shadows[i].position.x=art[i].position.x+(i===1?.7:0);
  shadows[i].scale.setScalar(lerp(1,.82,read));
  if(i===0){
   const ignite=out(.45,1.70,t),open=smooth(1.5,2.8,t),form=out(.8,2.25,t);
   bulb.position.set(0,lerp(-.65,.30,ignite)+life,0);bulb.rotation.set(.06,-.30+life,.12*(1-ignite));scaleIn(bulb,.14+form*.96);
   bulb.userData.glow.scale.setScalar(.5+ignite*.7+Math.sin(a*2)*.04*(reduced?0:1));
   bulb.userData.rays.rotation.z=t*.2+idle*.035;scaleIn(bulb.userData.rays,ignite*(1-read*.35));
   for(let j=0;j<obstacles.length;j++){const angle=j*2.39996,r=lerp(.75,2.7,open);const ob=obstacles[j];ob.position.set(Math.cos(angle)*r,Math.sin(angle)*r*.65-1.1+open*.6,-.8+seeded(j)*.6);ob.rotation.set(.3+open*.4,j*.6+t*.11,(1-open)*.3+j);scaleIn(ob,(.18+out(0,.6,t)*.72)*(1-read*.8));}
   ideaArcs.forEach((m,j)=>{
    m.rotation.set(j===0?.90:-.80,j===0?.35:-.45,j*2.8+t*(j===0?.22:-.17)+life+idle*(j===0?.026:-.021));
    const k=.2+form*.8;m.scale.set(k*1.12,k*.91,k);m.visible=t>.5;
   });
  }else if(i===1){
   const handoff=smooth(.40,1.30,t),activate=out(.85,1.65,t),assemble=smooth(2.30,3.2,t);
   seed.position.set(lerp(-4.1,-1.15,handoff),.3+Math.sin(handoff*Math.PI)*.6,.1);seed.scale.setScalar(lerp(.38,.12,handoff));seed.rotation.z=lerp(-.35,.2,handoff);
   core.position.set(-1.0,.25,0);core.rotation.set(.12+t*.12,.2+t*.24+idle*.09,life);scaleIn(core,.08+activate*.95);
   machineRings.forEach((m,j)=>{m.rotation.z=t*(j?-.7:.6)+idle*(j?-.09:.08);});
   tools.forEach((obj,j)=>{const on=out(1.17+j*.28,1.74+j*.28,t);obj.position.set(lerp(-.7,2.3+(j%2)*.28,on),lerp(.2,(j-1.5)*1.04,on)+(Math.sin(idle*.8+j)-Math.sin(j))*.035,Math.sin(on*Math.PI)*.8);obj.rotation.set(.12,(1-on)*1.5,(j-1.5)*.08+life);scaleIn(obj,on*lerp(.53,.40,assemble));paths[j].scale.setScalar(Math.max(.001,on));paths[j].position.x=0;});
   output.position.set(lerp(2.5,4.0,assemble),.1+Math.sin(idle*.65)*.04,.2);output.rotation.set(-.05,-.25,life);scaleIn(output,assemble*.85);
  }else if(i===2){
   const first=out(.15,1.1,t),reply=out(1.30,2.25,t),connect=out(2.25,3.1,t);
   askAI.position.set(lerp(-3.5,-.85,first),.52+life,.20);askAI.rotation.set(.06,lerp(-1.1,-.25,first),lerp(-.3,.06,first));scaleIn(askAI,first*.94);
   askPerson.position.set(lerp(3.7,1.0,reply),-.72-life,.45);askPerson.rotation.set(.07,lerp(1.1,.20,reply),lerp(.3,-.08,reply));scaleIn(askPerson,reply*.83);
   understanding.position.set(0,-.20,1.2);understanding.rotation.y=a*.2;scaleIn(understanding,connect*.4);
   questionOrbit.rotation.z=.3+t*.18+idle*.025;const q=.2+first*.8;questionOrbit.scale.set(q*1.10,q*.98,q);
  }else{
   const research=out(.05,.8,t),collect=smooth(.9,1.9,t),inspect=smooth(1.1,1.85,t),approve=out(2.6,3.4,t);
   globe.rotation.set(.16,t*.38+idle*.065,.17);globe.position.set(-.42,.35,-.45);scaleIn(globe,research*lerp(1,.76,approve));
   sources.forEach((ob,j)=>{const angle=j*2.094+.5;ob.position.set(lerp(Math.cos(angle)*3.6,(j-1)*1.05,collect),lerp(Math.sin(angle)*2,-.80+Math.abs(j-1)*.26,collect),lerp(-1.2,.1+j*.14,collect));ob.rotation.set(.02,lerp(j*.8,-.25,collect),lerp((j-1)*.7,(j-1)*.13,collect));scaleIn(ob,collect*.63);});
   lens.position.set(lerp(-2.2,1.25,inspect)+Math.sin(idle*.6)*.055,.7-Math.sin(inspect*Math.PI)*.7,1.0);lens.rotation.set(.03,-.2,.18-inspect*.3);scaleIn(lens,out(1.1,1.65,t)*lerp(1,.65,approve));
   lens.updateMatrix();reviewPoint.set(0,0,.13).applyMatrix4(lens.matrix);
   reviewInput.updateArcLengths();reviewOutputs.forEach(curve=>curve.updateArcLengths());
   // Keep the checkpoint beside the lens so the inspection and release remain visible.
   shield.position.set(2.0,-.12,1.5);shield.rotation.set(.05,lerp(-1.2,-.2,approve),life);scaleIn(shield,approve*.64);
   const review=reviewState(a,reduced),waiting=review.phase>=1.25&&review.phase<2.1;
   scanBeam.visible=waiting;scanBeam.position.y=lerp(-.38,.38,smooth(1.25,2.1,review.phase));
   check.visible=review.phase>=2.1;check.scale.setScalar(1+Math.sin(smooth(2.1,2.55,review.phase)*Math.PI)*.12);
   reviewLines.forEach((line,j)=>{const on=j===0?out(.75,1.55,t):j-1===review.lane?smooth(2.1,3.35,review.phase):0;line.visible=on>.001;line.geometry.setDrawRange(0,Math.floor(on*72)*36);line.material.opacity=(j===0?.23:.36)*(1-smooth(3.65,4.25,review.phase));});
  }
 }
 function render(index,t,transfer,ambient,{reduced=false,pointer=[0,0]}={}){
  const life=reduced?t:ambient;
  prelude.roots.forEach(root=>root.visible=false);
  basic.roots.forEach(root=>root.visible=false);
  roots.forEach((root,i)=>{const scoped=i>=2;root.visible=(i===index&&transfer<(scoped?1:.995))||(i===index+1&&transfer>0);if(root.visible)pose(i,i===index?t:(scoped?0:.35),i===index||!scoped?life:0,reduced,pointer[0]);});

  const cp=cameraPaths[index].getPoint(clamp(t/5,0,1));cp.x+=index*20;
  const target=v(index*20,0,0);
  if(transfer>0&&index<3){const next=cameraPaths[index+1].getPoint(index+1>=2?0:.35/5);next.x+=(index+1)*20;cp.lerp(next,transfer);cp.z+=Math.sin(transfer*Math.PI)*4;target.x+=transfer*20;}
  if(transfer>0&&index===3){installation.root.visible=true;installation.pose(0,0,reduced);const next=installation.camera(0);cp.lerp(next.position,transfer);target.lerp(next.target,transfer);cp.z+=Math.sin(transfer*Math.PI)*4;}

  const mobile=width<760;if(mobile){cp.x=target.x+(cp.x-target.x)*.15;cp.z*=1.14;target.y=-.35;}
  if(!reduced){cp.x+=pointer[0]*.10;cp.y+=pointer[1]*.07;}
  camera.position.copy(cp);camera.lookAt(target);
  const reading=smooth(3.45,4.65,t),base=art[index].position,shape=art[index].scale.x;
  selectParticleScope(index>=1);
  if(index===1)paths.forEach(p=>p.updateWorldMatrix(true,false));
  if(index===2)questionOrbit.updateWorldMatrix(true,false);
  if(index===3)art[3].updateWorldMatrix(true,false);
  for(let j=0;j<N+TRAIL;j++){
   const q=seeded(j+2),phase=(q+life*(reading>.95?.025:.14))%1,angle=j*2.39996+life*.24,isTrail=j>=N;
   let x,y,z;
   if(index===0){const expand=smooth(.55,2.35,t),radius=lerp(.15,1.2+q*1.7,expand);x=Math.cos(angle)*radius;y=.3+Math.sin(angle)*radius*(isTrail?.85:1.1);z=(seeded(j+3)-.5)*2.2*(1-q);if(isTrail){x*=1+phase*.6;y+=phase*.7;}}
   else if(index===1){
    const lane=j%4,u=(q+life*.075)%1,spread=isTrail?.028:.095;
    branchCurves[lane].getPointAt(u,orbitPoint);
    orbitPoint.y+=(seeded(j+9)-.5)*spread;orbitPoint.z+=(seeded(j+13)-.5)*spread;
    orbitPoint.applyMatrix4(paths[lane].matrixWorld).toArray(positions,j*3);
    localAlpha[j]=Math.pow(Math.sin(Math.PI*u),.65)*out(1.17+lane*.28,1.74+lane*.28,t);continue;
   }
   else if(index===2){
    // Sample the same open ellipse and transforms as the solid ring, including front/back depth.
    const u=(q+life*.035)%1,theta=u*Math.PI*1.5,radial=2.7+(seeded(j+7)-.5)*(isTrail?.07:.30);
    orbitPoint.set(Math.cos(theta)*radial,Math.sin(theta)*radial,(seeded(j+9)-.5)*(isTrail?.07:.30)).applyMatrix4(questionOrbit.matrixWorld);
    orbitPoint.toArray(positions,j*3);localAlpha[j]=Math.pow(Math.sin(Math.PI*u),.65);continue;
   }
   else{
    // A dispersed globe-sized cloud contracts while travelling toward the lens.
    // The gathered batch stops for a scan, then travels to one verified source.
    // A held batch has fixed local coordinates; there is no uninspected bypass.
    const review=reviewState(life,reduced),phase=review.phase,release=smooth(2.1,3.35,phase-q*.15),arrival=smooth(0,1.25,phase-q*.15);
    if(j>=1500&&!(isTrail&&j<N+120)){positions[j*3]=60;positions[j*3+1]=-10000;positions[j*3+2]=0;localAlpha[j]=0;continue;}
    const route=phase<2.1?reviewInput:reviewOutputs[review.lane],u=phase<2.1?arrival:release;
    route.getPointAt(u,orbitPoint);
    if(phase<2.1){
     const latitude=seeded(j+17)*2-1,longitude=seeded(j+23)*Math.PI*2;
     const radius=(1.48+seeded(j+29)*.47)*Math.pow(1-arrival,1.25),equator=Math.sqrt(1-latitude*latitude);
     orbitPoint.x+=Math.cos(longitude)*equator*radius;
     orbitPoint.y+=latitude*radius;
     orbitPoint.z+=Math.sin(longitude)*equator*radius;
    }
    const queue=smooth(.82,1.25,phase)*(1-smooth(2.1,2.55,phase)),radius=lerp(.035,.23,queue)*Math.sqrt(q),theta=seeded(j+9)*Math.PI*2;
    // Inspection uses the lens's own plane, including its rotation and scale.
    reviewOffset.set(Math.cos(theta)*radius,Math.sin(theta)*radius,(seeded(j+13)-.5)*.04).multiplyScalar(lens.scale.x).applyQuaternion(lens.quaternion);
    orbitPoint.add(reviewOffset);
    orbitPoint.applyMatrix4(art[3].matrixWorld).toArray(positions,j*3);
    localAlpha[j]=out(.12,.65,t)*(1-smooth(3.65,4.25,phase));continue;
   }
   const spread=1+(1-out(0,.65,t))*.6;
   positions[j*3]=index*20+base.x+x*shape*spread;
   positions[j*3+1]=base.y+y*shape;
   positions[j*3+2]=base.z+z*shape;

  }
  if(index>=1)geometry.attributes.aAlpha.needsUpdate=true;
  geometry.attributes.position.needsUpdate=true;particleStyle(index+3,t,index===3?.72:lerp(.75,.58,reading),index===3?.13:lerp(.13,.11,reading),transfer);
  renderer.render(scene,camera);
 }
 function renderPage(page,t,transfer,ambient,options={}){
  selectParticleScope(false);
  tips.roots.forEach(r=>r.visible=false);
  tips.title.root.visible=false;
  installation.root.visible=false;
  closing.roots.forEach(r=>r.visible=false);
  if(PAGES[page].kind==='usage-title'){
   const {reduced=false,pointer=[0,0]}=options,life=reduced?t:ambient;
   roots.forEach(r=>r.visible=false);prelude.roots.forEach(r=>r.visible=false);basic.roots.forEach(r=>r.visible=false);practice.roots.forEach(r=>r.visible=false);
   tips.title.root.visible=transfer<.995;tips.title.pose(t,life,reduced);
   const current=tips.title.camera(t),cp=current.position,target=current.target;
   if(transfer>0){tips.roots[0].visible=true;tips.pose(0,0,life,reduced);const next=tips.camera(0,0);cp.lerp(next.position,transfer);target.lerp(next.target,transfer);cp.z+=Math.sin(transfer*Math.PI)*3;}
   if(!reduced){cp.x+=pointer[0]*.08;cp.y+=pointer[1]*.05;}camera.position.copy(cp);camera.lookAt(target);
   tips.title.particles(positions,t,life,N+TRAIL,reduced);geometry.attributes.position.needsUpdate=true;particleStyle(page,t,.72,.13,transfer);renderer.render(scene,camera);return;
  }
  if(PAGES[page].kind==='usage-tip'){
   const i=PAGES[page].tipIndex,{reduced=false,pointer=[0,0]}=options,life=reduced?t:ambient;
   roots.forEach(r=>r.visible=false);prelude.roots.forEach(r=>r.visible=false);basic.roots.forEach(r=>r.visible=false);practice.roots.forEach(r=>r.visible=false);
   tips.roots.forEach((r,j)=>{r.visible=(j===i&&transfer<.995)||(j===i+1&&transfer>0);if(r.visible)tips.pose(j,j===i?t:0,life,reduced);});
   const current=tips.camera(i,t),cp=current.position,target=current.target;
   if(transfer>0){const next=i<4?tips.camera(i+1,0):practice.camera(0,0);if(i===4){practice.roots[0].visible=true;practice.pose(0,0,life,reduced);}cp.lerp(next.position,transfer);target.lerp(next.target,transfer);cp.z+=Math.sin(transfer*Math.PI)*3;}
   if(!reduced){cp.x+=pointer[0]*.08;cp.y+=pointer[1]*.05;}camera.position.copy(cp);camera.lookAt(target);
   selectParticleScope(true);tips.particles(positions,i,t,life,N+TRAIL,reduced,N,localAlpha);geometry.attributes.aAlpha.needsUpdate=true;
   geometry.attributes.position.needsUpdate=true;particleStyle(page,t,.72,.13,transfer);renderer.render(scene,camera);return;
  }
  if(PAGES[page].kind==='closing'){
   const i=PAGES[page].closingIndex,{reduced=false,pointer=[0,0]}=options,life=reduced?t:ambient;
   roots.forEach(r=>r.visible=false);prelude.roots.forEach(r=>r.visible=false);basic.roots.forEach(r=>r.visible=false);practice.roots.forEach(r=>r.visible=false);
   closing.roots.forEach((r,j)=>{r.visible=(j===i&&transfer<.995)||(j===i+1&&transfer>0);if(r.visible)closing.pose(j,j===i?t:0,life,reduced);});
   const current=closing.camera(i,t),cp=current.position,target=current.target;
   if(transfer>0&&i===0){const next=closing.camera(1,0);cp.lerp(next.position,transfer);target.lerp(next.target,transfer);cp.z+=Math.sin(transfer*Math.PI)*3;}
   if(!reduced){cp.x+=pointer[0]*.08;cp.y+=pointer[1]*.05;}camera.position.copy(cp);camera.lookAt(target);
   closing.particles(positions,i,t,life,N+TRAIL,reduced);geometry.attributes.position.needsUpdate=true;particleStyle(page,t,.68,.13,transfer);renderer.render(scene,camera);return;
  }
  practice.roots.forEach(r=>r.visible=false);
  if(PAGES[page].kind==='practice'){
   const i=PAGES[page].practiceIndex,{reduced=false,pointer=[0,0]}=options,life=reduced?t:ambient;
   roots.forEach(r=>r.visible=false);prelude.roots.forEach(r=>r.visible=false);basic.roots.forEach(r=>r.visible=false);
   practice.roots.forEach((r,j)=>{r.visible=(j===i&&transfer<.995)||(j===i+1&&transfer>0);if(r.visible)practice.pose(j,j===i?t:0,life,reduced);});
   const current=practice.camera(i,t),cp=current.position,target=current.target;
   if(transfer>0&&i<5){const next=practice.camera(i+1,0);cp.lerp(next.position,transfer);target.lerp(next.target,transfer);cp.z+=Math.sin(transfer*Math.PI)*3;}
   if(transfer>0&&i===5){closing.roots[0].visible=true;closing.pose(0,0,life,reduced);const next=closing.camera(0,0);cp.lerp(next.position,transfer);target.lerp(next.target,transfer);cp.z+=Math.sin(transfer*Math.PI)*3;}
   if(!reduced){cp.x+=pointer[0]*.08;cp.y+=pointer[1]*.05;}camera.position.copy(cp);camera.lookAt(target);
   practice.particles(positions,i,t,life,N+TRAIL,reduced);geometry.attributes.position.needsUpdate=true;particleStyle(page,t,.72,.13,transfer);renderer.render(scene,camera);return;
  }
  if(PAGES[page].kind==='basic-use'){
   const i=PAGES[page].basicIndex,{reduced=false,pointer=[0,0]}=options,life=reduced?t:ambient;
   roots.forEach(r=>r.visible=false);prelude.roots.forEach(r=>r.visible=false);
   basic.roots.forEach((r,j)=>{r.visible=(j===i&&transfer<.995)||(j===i+1&&transfer>0);if(r.visible)basic.pose(j,j===i?t:0,life,reduced);});
   const current=basic.camera(i,t),cp=current.position,target=current.target;
   if(transfer>0&&i<4){const next=basic.camera(i+1,0);cp.lerp(next.position,transfer);target.lerp(next.target,transfer);cp.z+=Math.sin(transfer*Math.PI)*3;}
   if(transfer>0&&i===4){tips.title.root.visible=true;tips.title.pose(0,0,reduced);const next=tips.title.camera(0);cp.lerp(next.position,transfer);target.lerp(next.target,transfer);cp.z+=Math.sin(transfer*Math.PI)*3;}
   if(!reduced){cp.x+=pointer[0]*.08;cp.y+=pointer[1]*.05;}camera.position.copy(cp);camera.lookAt(target);
   basic.particles(positions,i,t,life,N+TRAIL,reduced);geometry.attributes.position.needsUpdate=true;particleStyle(page,t,.72,.13,transfer);renderer.render(scene,camera);return;
  }
  if(PAGES[page].kind==='installation-title'){
   const {reduced=false,pointer=[0,0]}=options,life=reduced?t:ambient;
   roots.forEach(r=>r.visible=false);prelude.roots.forEach(r=>r.visible=false);basic.roots.forEach(r=>r.visible=false);
   installation.root.visible=transfer<.995;installation.pose(t,life,reduced);
   const current=installation.camera(t),cp=current.position,target=current.target;
   if(transfer>0){basic.roots[0].visible=true;basic.pose(0,0,life,reduced);const next=basic.camera(0,0);cp.lerp(next.position,transfer);target.lerp(next.target,transfer);cp.z+=Math.sin(transfer*Math.PI)*3;}
   if(!reduced){cp.x+=pointer[0]*.08;cp.y+=pointer[1]*.05;}camera.position.copy(cp);camera.lookAt(target);
   installation.particles(positions,t,life,N+TRAIL,reduced);geometry.attributes.position.needsUpdate=true;particleStyle(page,t,.72,.13,transfer);renderer.render(scene,camera);return;
  }
  if(PAGES[page].kind==='mindset'){render(PAGES[page].mindsetIndex,t,transfer,ambient,options);return;}
  const {reduced=false,pointer=[0,0]}=options,life=reduced?t:ambient;
  roots.forEach(root=>root.visible=false);
  basic.roots.forEach(root=>root.visible=false);
  prelude.roots.forEach((root,i)=>{root.visible=(i===page&&transfer<.995)||(i===page+1&&transfer>0);if(root.visible)prelude.pose(i,i===page?t:0,life,reduced);});
  const current=prelude.camera(page,t),cp=current.position,target=current.target;
  if(transfer>0){
   let next;
   if(page<2)next=prelude.camera(page+1,0);
   else{roots[0].visible=true;pose(0,.35,.35,reduced,pointer[0]);next={position:cameraPaths[0].getPoint(.35/5),target:v(0,0,0)};}
   cp.lerp(next.position,transfer);target.lerp(next.target,transfer);cp.z+=Math.sin(transfer*Math.PI)*3;
  }
  if(!reduced){cp.x+=pointer[0]*.10;cp.y+=pointer[1]*.07;}
  camera.position.copy(cp);camera.lookAt(target);
  prelude.particles(positions,page,t,life,N+TRAIL,reduced);
  const settled=smooth(page===0?7:2,page===0?10:4,t);
  geometry.attributes.position.needsUpdate=true;particleStyle(page,t,lerp(.82,.62,settled),lerp(.14,.12,settled),transfer);
  renderer.render(scene,camera);
 }
 return {renderPage,resize,renderer:'webgl',particles:{base:N,trails:TRAIL,frustumCulled:false,baseSize:[.13,.11],trailSize:[.234,.198],hue:.622,typeMask:true},semanticScenes:['school-title-assembly','contents-orbit','mindset-chapter-title','idea-spark-and-bulb','delegation-core-and-four-tools','reciprocal-question-bubbles','internet-globe-source-inspection-shield','installation-chapter-device','dialogue-unfolds-into-agent-workspace','web-plane-to-desktop-app','capacity-to-package-and-device','two-apps-orchestrate-work','phone-to-computer-signal-bridge','task-complexity-model-routing','question-to-clear-plan','source-research-and-verification','context-to-durable-record','work-permission-and-checkpoint','practice-workbench-assembly','spreadsheet-list-to-cells','document-format-and-connection','presentation-layers-to-deck','image-panels-to-film','personal-program-assembly-and-sharing','learning-book-question-to-practice','ending-open-book-and-horizon']};
}
