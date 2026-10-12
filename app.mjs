import {usageTipMarkup,renderUsageTipText,usageTitleMarkup,renderUsageTitleText} from './usage-tips.mjs?v=20261010-six-particle-style';
import {closingMarkup,renderClosingText} from './closing.mjs?v=20261010-book-left-opening';
import {updateCarousel} from './carousel.mjs?v=20261010-nav-supervision-centered';
import {practiceMarkup,renderPracticeText} from './practice.mjs';
import {MINDSETS} from './mindset.mjs';
import {PAGES,LAST_PAGE,clamp,smooth,mix} from './presentation.mjs?v=20261010-tips-stage-final';
import {preludeMarkup,renderPreludeText,TITLE_CUES} from './prelude.mjs?v=20261010-tips-stage-final';
import {basicUseMarkup,renderBasicUseText} from './basic-use.mjs?v=20261010-chapter-label';
import {createWorld} from './world.mjs?v=20261010-six-particle-style';
import {createSound} from './sound.mjs';
import {INSTALLATION_CUES} from './installation-title.mjs';
import {detailHref,savePracticeReturn,takePracticeReturn} from './practice-detail-route.mjs?v=20261012-static-detail';
history.scrollRestoration='manual';
const $=s=>document.querySelector(s),pref=matchMedia('(prefers-reduced-motion: reduce)');
const icon={
 sound:'<path d="M4 9h4l5-4v14l-5-4H4zM17 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
 mute:'<path d="M4 9h4l5-4v14l-5-4H4zM17 9l5 6m0-6-5 6"/>',
 replay:'<path d="M5 8a8 8 0 1 1-1 7M5 3v5h5"/>',
 play:'<path d="m8 5 11 7-11 7z"/>',pause:'<path d="M8 5v14M16 5v14"/>',
 arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',
 motion:'<path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h5"/>'
};
const svg=name=>'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">'+icon[name]+'</svg>';
function contentMarkup(page){
 const i=page.mindsetIndex,m=MINDSETS[i];
 return `<h2 class="sr-only" id="title-${i+1}">${m.title}</h2>
 <div class="kinetic" aria-hidden="true"><div class="eyebrow">AI를 대하는 자세</div><div class="kinetic-title">${m.title.split(' ').map((w,j)=>`${j&&m.breaks.includes(j)?'<br> ':j?' ':''}<span class="word" data-word="${j}">${w}</span>`).join('')}</div></div>
 <article class="reading" aria-hidden="true" tabindex="-1"><div class="eyebrow">AI를 대하는 자세</div><h3>${m.title}</h3><p>${m.explanation}</p><button class="replay-inline" data-replay="${i+3}">${svg('replay')}장면 다시 보기</button></article>`;
}
document.body.insertAdjacentHTML('afterbegin',`
<a class="skip-link" href="#mindset-1">설명 바로가기</a>
<div class="world" id="world" aria-hidden="true"></div>
<header class="site-header"><a class="brand" href="#opening" aria-label="간성초등학교 AI 연수 타이틀"><span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 36 36" fill="none"><path class="book-page" d="M18 29c-4-3-8-4-14-3V7c6-1 10 0 14 3 4-3 8-4 14-3v19c-6-1-10 0-14 3Z"/><path d="M18 10v19M8 12c3 0 5 .6 7 2M8 17c3 0 5 .6 7 2M22 14l2.5 2.5L29 12"/></svg></span>간성초등학교 AI 연수</a>
<nav class="chapters" aria-label="프레젠테이션 화면">${PAGES.map((p,i)=>`<a href="#${p.id}" data-go="${i}" aria-label="${i+1}. ${p.title}">${String(i+1).padStart(2,'0')}</a>`).join('')}</nav>
<div class="preferences"><a id="practice-detail-link" class="practice-detail-entry" href="./practice-title-details.html" hidden>상세 과정 ↗</a><button id="audio-toggle" class="quiet-control" aria-pressed="false" aria-label="소리 켜기">${svg('mute')}<span>소리 켜기</span></button><label class="volume"><span class="sr-only">음량</span><input type="range" id="volume" aria-label="음량" min="0" max="100" value="35"></label><button id="motion-toggle" class="quiet-control" aria-pressed="false" aria-label="움직임 줄이기">${svg('motion')}</button></div></header>
<main id="chapters">${PAGES.map((p,i)=>`<section class="presentation-page ${p.kind==='usage-title'?'usage-title':p.kind==='usage-tip'?'usage-tip':p.kind==='closing'?'closing':p.kind==='practice'?'practice':p.kind==='mindset'?`chapter chapter-${p.mindsetIndex+1}`:p.kind==='basic-use'?`basic-use basic-use-${p.basicIndex}`:`prelude prelude-${p.kind}`}" id="${p.id}" aria-label="${p.title}" data-page="${i}" tabindex="-1"><div class="screen">${p.kind==='usage-title'?usageTitleMarkup(p):p.kind==='usage-tip'?usageTipMarkup(p):p.kind==='closing'?closingMarkup(p):p.kind==='practice'?practiceMarkup(p):p.kind==='mindset'?contentMarkup(p):p.kind==='basic-use'?basicUseMarkup(p):preludeMarkup(p)}</div></section>`).join('')}</main>
<footer class="transport"><div class="transport-left"><button class="icon-button" id="play-toggle" aria-label="일시 정지">${svg('pause')}</button><button class="icon-button" id="replay" aria-label="현재 장면 다시 보기">${svg('replay')}</button><input type="range" id="story-position" aria-label="현재 장면 진행" min="0" max="10" step=".01" value="0"><button class="read-button" id="show-reading">완료 화면</button></div><button class="next-section" id="next-section">목차로 ${svg('arrow')}</button><span class="scroll-cue" aria-hidden="true">스크롤 ↓</span></footer><div class="sr-only" role="status" id="announcement"></div>
`);
const sections=[...document.querySelectorAll('[data-page]')],sound=createSound();
const nodes=sections.map((section,i)=>({section,screen:section.querySelector('.screen'),kinetic:section.querySelector('.kinetic'),words:[...section.querySelectorAll('.word')],reading:section.querySelector('.reading'),page:PAGES[i]}));
let reduced=pref.matches;
try{reduced=reduced||localStorage.getItem('ai-lessons-reduce-motion')==='1';}catch{}
// Page, local playback clock and deliberate navigation are independent states.
let pageIndex=0,story=0,transfer=0,ambient=0,previousIndex=-1,previousStory=0;
let playing=!reduced,localClock={page:0,t:0},navigation=null;
let dirty=true,rendered=0,last=0,pointer=[0,0],metrics=[],viewWidth=innerWidth,viewHeight=innerHeight;
let playbackStarted=null,openingFinished=null,pageRuns=[],activeRun=null;
function reducedButton(){
 $('#motion-toggle').setAttribute('aria-pressed',String(reduced));
 $('#motion-toggle').setAttribute('aria-label',reduced?'움직임 켜기':'움직임 줄이기');
 document.body.classList.toggle('reduced',reduced);
}
function playbackButton(){
 const on=playing||!!navigation;
 $('#play-toggle').innerHTML=svg(on?'pause':'play');
 $('#play-toggle').setAttribute('aria-label',on?'일시 정지':'재생');
 $('#play-toggle').disabled=reduced;
 document.body.dataset.playback=reduced?'reduced':on?'playing':story===PAGES[pageIndex].duration?'complete':'paused';
}
function measure(){viewWidth=innerWidth;viewHeight=innerHeight;metrics=sections.map(el=>({top:el.offsetTop,height:el.offsetHeight}));dirty=true;}
function positionFor(i,t){const p=PAGES[i];return metrics[i].top+clamp((t-p.start)/(p.duration-p.start))*viewHeight*.85;}
function pause(){playing=false;navigation=null;activeRun=null;playbackButton();}
function beginClock(i,t){
 localClock={page:i,t};playing=true;
 activeRun={page:i,from:t,started:null,finished:null};pageRuns.push(activeRun);
 playbackButton();
}
function play(){
 if(reduced)return;
 navigation=null;
 if(story>=PAGES[pageIndex].duration){replay();return;}
 beginClock(pageIndex,story);
}
function go(i,complete=false,instant=false){
 if(metrics.length!==PAGES.length)measure();
 i=clamp(i,0,LAST_PAGE);
 const t=complete||reduced?PAGES[i].duration:PAGES[i].start,target=positionFor(i,t);
 playing=false;activeRun=null;
 if(instant||reduced){
  navigation=null;scrollTo({top:target,behavior:'instant'});update();
  if(!complete&&!reduced)beginClock(i,t);
 }else navigation={page:i,t,from:scrollY,to:target,elapsed:0,duration:Math.min(1.05,.5+Math.abs(target-scrollY)/viewHeight*.08),autoplay:!complete};
 playbackButton();
}
function replay(i=pageIndex){sound.replay(i);go(i,false,true);}
function returnToOpening(){
 const restart=()=>{
  sound.replay(0);go(0,false,true);
  ambient=story;world.renderPage(0,story,0,ambient,{reduced,pointer});
 };
 if(reduced||typeof document.startViewTransition!=='function'){restart();return;}
 // Snapshot only the ending and opening: no intermediate scroll positions.
 document.startViewTransition(restart).ready.catch(()=>{});
}
function renderText(){
 nodes.forEach(({section,screen,kinetic,words,reading,page},i)=>{
  const active=i===pageIndex;
  section.setAttribute('aria-hidden',String(!active));
  section.inert=!active;
  if(page.kind==='usage-title'){renderUsageTitleText(screen,reduced?page.duration:active?story:page.start,reduced);return;}
  if(page.kind==='usage-tip'){renderUsageTipText(screen,page,reduced?page.duration:active?story:page.start,reduced);return;}
  if(page.kind==='closing'){renderClosingText(screen,page,reduced?page.duration:active?story:page.start,reduced);return;}
  if(page.kind==='practice'){renderPracticeText(screen,page,reduced?page.duration:active?story:page.start,reduced);return;}
  if(page.kind==='basic-use'){
   renderBasicUseText(screen,page,reduced?page.duration:active?story:page.start,reduced);return;
  }
  if(page.kind!=='mindset'){
   renderPreludeText(screen,page,reduced?page.duration:active?story:page.start,reduced);
   return;
  }
  const t=active?story:page.start,m=MINDSETS[page.mindsetIndex];
  const r=reduced?1:smooth(4.1,4.65,t);
  section.style.setProperty('--read',r);
  kinetic.style.opacity=reduced?0:1-smooth(3.35,3.60,t);
  kinetic.style.transform=`translate3d(0,${-smooth(3.35,3.60,t)*34}px,0)`;
  words.forEach((word,n)=>{
   const p=reduced?1:smooth(m.times[n],m.times[n]+.27,t);
   word.style.opacity=p;word.style.transform=`translate3d(0,${(1-p)*.72}em,0) rotateX(${(1-p)*-32}deg)`;
   word.classList.toggle('accent',n===m.times.length-1||Math.abs(t-m.times[n]-.18)<.24);
  });
  reading.style.opacity=r;reading.style.transform=`translate3d(0,${(1-r)*36}px,0)`;
  reading.setAttribute('aria-hidden',String(r<.98));reading.inert=r<.98;
  section.classList.toggle('reading-ready',r>.98);
 });
}
function update(){
 if(!metrics.length)return;
 const y=scrollY;pageIndex=LAST_PAGE;
 for(let i=0;i<LAST_PAGE;i++)if(y<metrics[i+1].top-.75){pageIndex=i;break;}
 const page=PAGES[pageIndex],local=y-metrics[pageIndex].top;
 $('#practice-detail-link').hidden=page.kind!=='practice';
 document.body.classList.toggle('has-practice-detail',page.kind==='practice');
 if(page.kind==='practice')$('#practice-detail-link').href=detailHref(page.id);
 story=reduced?page.duration:page.start+clamp(local/(viewHeight*.85))*(page.duration-page.start);
 if(playing&&localClock.page===pageIndex)story=localClock.t;
 if(page.duration-story<.005)story=page.duration;
 if(story===page.duration&&(previousStory!==page.duration||previousIndex!==pageIndex))ambient=page.duration;
 transfer=pageIndex===LAST_PAGE?0:smooth(metrics[pageIndex].height-viewHeight,metrics[pageIndex].height,local);
 const next=PAGES[Math.min(LAST_PAGE,pageIndex+1)],bg=page.color.map((c,j)=>Math.round(mix(c,next.color[j],transfer)));
 document.body.style.backgroundColor=`rgb(${bg.join(',')})`;
 document.body.classList.toggle('dark',transfer<.5?!!page.dark:!!next.dark);
 Object.assign(document.body.dataset,{section:String(pageIndex+1),page:page.id,storyTime:story.toFixed(3),transfer:transfer.toFixed(3)});
 // Keep reload's entry point aligned with every visible page, including keyboard and scroll navigation.
 const pageHash='#'+page.id;
 if(location.hash!==pageHash)history.replaceState(history.state,'',pageHash);
 renderText();
 updateCarousel([...document.querySelectorAll('.chapters [data-go]')],pageIndex,reduced);
 $('#story-position').min=page.start;$('#story-position').max=page.duration;$('#story-position').value=story;
 $('#story-position').setAttribute('aria-valuetext',`${page.title}, ${story.toFixed(1)}초`);
 $('#show-reading').textContent=page.kind==='mindset'?'내용 보기':'완료 화면';
 $('#next-section').innerHTML=(pageIndex===LAST_PAGE?'처음으로':[ '목차로','AI를 대하는 자세로','첫 설명으로','다음 설명','다음 설명','다음 설명'][pageIndex]??'다음으로')+' '+svg('arrow');
 const start=pageIndex===previousIndex?previousStory:0;
 if(pageIndex!==previousIndex){sound.cue(pageIndex,'section-enter','air',0,reduced);$('#announcement').textContent=page.title;}
 if(story>start||pageIndex!==previousIndex){
  const actions=page.kind==='usage-title'?page.cues:page.kind==='mindset'?MINDSETS[page.mindsetIndex].actions:(page.kind==='basic-use'||page.kind==='practice'||page.kind==='closing'||page.kind==='usage-tip')?page.cues:page.kind==='installation-title'?INSTALLATION_CUES:page.kind==='title'?TITLE_CUES:[{t:.45,kind:'air',name:'heading'},{t:1.3,kind:'soft',name:'entry'}];
  actions.forEach(({t,kind,name})=>{if(start<t&&story>=t)sound.cue(pageIndex,name,kind,0,reduced);});
  if(page.kind==='mindset')MINDSETS[page.mindsetIndex].times.forEach((at,n)=>{if(start<at&&story>=at&&!actions.some(a=>Math.abs(a.t-at)<.09))sound.cue(pageIndex,'word-'+n,'word',n,reduced);});
 }
 previousIndex=pageIndex;previousStory=story;dirty=true;playbackButton();
}
document.querySelectorAll('[data-go]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();go(+link.dataset.go);}));
$('.brand').addEventListener('click',e=>{e.preventDefault();go(0);});
$('.skip-link').addEventListener('click',e=>{e.preventDefault();const i=Math.max(3,pageIndex);go(i,true,true);(nodes[i].reading??nodes[i].section).focus({preventScroll:true});});
document.querySelectorAll('[data-replay]').forEach(button=>button.addEventListener('click',()=>replay(+button.dataset.replay)));
$('#play-toggle').addEventListener('click',()=>playing||navigation?pause():play());
$('#practice-detail-link').addEventListener('click',()=>savePracticeReturn(PAGES[pageIndex].id,story,playing));
$('#replay').addEventListener('click',()=>replay());
$('#show-reading').addEventListener('click',()=>go(pageIndex,true));
$('#next-section').addEventListener('click',()=>pageIndex===LAST_PAGE?returnToOpening():go(pageIndex+1));
$('#story-position').addEventListener('input',e=>{pause();scrollTo({top:positionFor(pageIndex,+e.target.value),behavior:'instant'});update();});
$('#audio-toggle').addEventListener('click',async()=>{
 try{const on=await sound.toggle();$('#audio-toggle').setAttribute('aria-pressed',String(on));$('#audio-toggle').setAttribute('aria-label',on?'소리 끄기':'소리 켜기');$('#audio-toggle').innerHTML=svg(on?'sound':'mute')+`<span>${on?'소리 끄기':'소리 켜기'}</span>`;}
 catch{$('#announcement').textContent='이 브라우저에서 소리를 켤 수 없습니다.';}
});
$('#volume').addEventListener('input',e=>sound.setVolume(+e.target.value/100));
function applyReduced(){reducedButton();pause();if(reduced)go(pageIndex,true,true);else update();}
$('#motion-toggle').addEventListener('click',()=>{reduced=!reduced;try{localStorage.setItem('ai-lessons-reduce-motion',reduced?'1':'0');}catch{}applyReduced();});
pref.addEventListener('change',e=>{reduced=e.matches;applyReduced();});
addEventListener('wheel',pause,{passive:true});
addEventListener('keydown',e=>{
 if(['INPUT','TEXTAREA','SELECT','BUTTON'].includes(e.target.tagName)||e.altKey||e.ctrlKey||e.metaKey)return;
 if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();go(Math.min(LAST_PAGE,pageIndex+1));}
 if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();go(Math.max(0,pageIndex-1));}
 if(e.key==='Home'){e.preventDefault();go(0);}
 if(e.key==='End'){e.preventDefault();go(LAST_PAGE,true);}
 if(e.key===' '){e.preventDefault();playing||navigation?pause():play();}
 if(e.key==='ArrowDown'||e.key==='ArrowUp')pause();
});
addEventListener('pointermove',e=>{pointer=[(e.clientX/innerWidth-.5)*2,(e.clientY/innerHeight-.5)*2];if(!reduced)dirty=true;},{passive:true});
await document.fonts.ready;
measure();reducedButton();
let world;
try{world=createWorld($('#world'));}catch(error){
 $('#world').innerHTML='<div class="fallback-symbols" aria-hidden="true">✳</div>';
 world={renderPage(){},resize(){},renderer:'fallback',particles:{base:0,trails:0}};
 console.warn('WebGL unavailable; the presentation text remains readable.',error.message);
}
const initial=Math.max(0,PAGES.findIndex(p=>'#'+p.id===location.hash)),detailReturn=takePracticeReturn(PAGES[initial].id),initialTime=reduced?PAGES[initial].duration:(detailReturn?.time??PAGES[initial].start);
scrollTo({top:positionFor(initial,initialTime),behavior:'instant'});
localClock={page:initial,t:initialTime};
if(!reduced&&(!detailReturn||detailReturn.playing))beginClock(initial,initialTime);else playing=false;
update();addEventListener('scroll',update,{passive:true});
addEventListener('pageshow',event=>{if(event.persisted)takePracticeReturn(PAGES[pageIndex].id);});
function tick(now){
 requestAnimationFrame(tick);
 if(window.__practiceCapture?.frozen){last=now;return;}
 if(document.hidden){last=now;return;}
 const dt=last?Math.min(.08,(now-last)/1000):0;last=now;
 if(navigation){
  navigation.elapsed+=dt;const p=smooth(0,navigation.duration,navigation.elapsed);
  scrollTo({top:mix(navigation.from,navigation.to,p),behavior:'instant'});update();
  if(p===1){const n=navigation;navigation=null;if(n.autoplay)beginClock(n.page,n.t);else playbackButton();}
 }else if(playing&&!reduced){
  if(playbackStarted===null)playbackStarted=now;
  if(activeRun&&activeRun.started===null)activeRun.started=now;
  const end=PAGES[localClock.page].duration;
  localClock.t=Math.min(end,localClock.t+dt);
  if(end-localClock.t<1e-7)localClock.t=end;
  scrollTo({top:positionFor(localClock.page,localClock.t),behavior:'instant'});
  update();
  // Completion changes only playback. The page can change only through navigation or scrolling.
  if(localClock.t===end){
   playing=false;if(activeRun)activeRun.finished=now;
   if(localClock.page===0)openingFinished=now;
   playbackButton();
  }
 }
 if(story<PAGES[pageIndex].duration)ambient=story;else if(!reduced)ambient+=dt;
 sound.poll();
 if(reduced&&!dirty)return;
 world.renderPage(pageIndex,story,transfer,ambient,{reduced,pointer});
 rendered++;dirty=false;
}
requestAnimationFrame(tick);
addEventListener('resize',()=>{const p=pageIndex,t=story;measure();scrollTo({top:positionFor(p,t),behavior:'instant'});update();world.resize();});
document.body.dataset.renderer=world.renderer;
window.__lessonDiagnostics=()=>({index:pageIndex,pageIndex,pageId:PAGES[pageIndex].id,story,duration:PAGES[pageIndex].duration,transfer,ambient,reduced,playing,navigating:!!navigation,localClock:{...localClock},rendered,scrollY,viewport:[innerWidth,innerHeight],openingDuration:10,playbackStarted,openingFinished,pageRuns:pageRuns.map(r=>({...r})),pages:PAGES.map(p=>({id:p.id,kind:p.kind,title:p.title,duration:p.duration})),metrics:metrics.map(x=>({...x})),audio:sound.diagnostics(),renderer:world.renderer,particles:world.particles,scenes:world.semanticScenes});
// Deterministic frame review is opt-in and absent from the normal presentation URL.
if(new URLSearchParams(location.search).has('capture'))window.__practiceCapture={frozen:false,seek(i,t,a=t){this.frozen=true;pause();scrollTo({top:positionFor(i,t),behavior:'instant'});update();ambient=a;world.renderPage(i,t,0,a,{reduced:false,pointer:[0,0]});return window.__lessonDiagnostics();},resume(){this.frozen=false;last=0;}};
