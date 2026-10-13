import {practiceFor,practiceReturnHref,readPracticeReturn} from './practice-detail-route.mjs?v=20261012-static-detail';

const page=practiceFor(document.body.dataset.practice);
const heading=document.querySelector('#detail-title');heading.textContent=page.title;
const separator=page.title.match(/ (?:-|—) /);
if(separator){const at=separator.index+separator[0].length,tool=document.createElement('span'),task=document.createElement('span');tool.className='detail-tool';tool.textContent=page.title.slice(0,at);task.textContent=page.title.slice(at);heading.replaceChildren(tool,task);}
const back=document.querySelector('#detail-back'),brand=document.querySelector('#detail-brand');
back.href=brand.href=practiceReturnHref(page.id);
back.setAttribute('aria-label',`${page.title} 실습 화면으로 돌아가기`);
function returnToPractice(event){
 if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 try{const referrer=new URL(document.referrer),directory=location.pathname.slice(0,location.pathname.lastIndexOf('/')+1);
  if(readPracticeReturn(page.id)&&history.length>1&&referrer.origin===location.origin&&[directory,directory+'index.html'].includes(referrer.pathname)){event.preventDefault();history.back();}
 }catch{}
}
back.addEventListener('click',returnToPractice);brand.addEventListener('click',returnToPractice);

const promptObserver='IntersectionObserver' in window&&window.matchMedia('(prefers-reduced-motion: reduce)').matches===false
 ?new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');promptObserver.unobserve(entry.target);}},{threshold:.15})
 :null;
for(const card of document.querySelectorAll('.detail-prompt')){
 const prompt=card.querySelector(':scope > p');
 const heading=card.querySelector(':scope > h3, :scope > h4');
 if(!prompt||!heading)continue;
 const source=prompt.textContent.trim();
 const copySource=prompt.querySelector('[data-copy-content]')?.textContent.trim()||source;
 const headingRow=document.createElement('div');headingRow.className='detail-prompt-heading';
 heading.before(headingRow);headingRow.append(heading);
 const capture=card.querySelector(':scope > .detail-prompt-capture');
 if(capture){
  const screen=document.createElement('div');screen.className='detail-prompt-screen';
  capture.append(screen);screen.append(prompt);card.classList.add('has-capture');
 }
 const copy=document.createElement('button');copy.type='button';copy.className='detail-copy-button';copy.textContent='복사';copy.setAttribute('aria-label','AI 요청문 복사');headingRow.append(copy);
 copy.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(copySource);copy.textContent='복사됨';copy.setAttribute('aria-label','AI 요청문 복사됨');}
  catch{copy.textContent='직접 선택해 복사';copy.setAttribute('aria-label','요청문을 직접 선택해 복사하세요');}
  window.setTimeout(()=>{copy.textContent='복사';copy.setAttribute('aria-label','AI 요청문 복사');},2200);
 });
 prompt.textContent='';prompt.classList.add('detail-prompt-motion');prompt.setAttribute('aria-label',source);
 for(const [index,glyph] of Array.from(source).entries()){
  if(/\s/.test(glyph)){prompt.append(document.createTextNode(glyph));continue;}
  const span=document.createElement('span');span.className='detail-prompt-glyph';span.textContent=glyph;span.style.setProperty('--glyph-index',index);span.setAttribute('aria-hidden','true');prompt.append(span);
 }
 if(promptObserver)promptObserver.observe(prompt);else prompt.classList.add('is-visible');
}
