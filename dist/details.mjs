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
