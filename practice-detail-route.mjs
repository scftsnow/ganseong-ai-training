import {PRACTICE} from './practice-data.mjs';

const key='ai-training-practice-return';
export function practiceFor(id){return PRACTICE.find(page=>page.id===id)??PRACTICE[0];}
export function detailHref(id){return `./${practiceFor(id).id}-details.html`;}
export function practiceReturnHref(id){return `./index.html#${practiceFor(id).id}`;}
export function savePracticeReturn(id,time,playing){
 const page=PRACTICE.find(page=>page.id===id);if(!page)return;
 try{sessionStorage.setItem(key,JSON.stringify({id,time:Math.max(0,Math.min(page.duration,time)),playing:!!playing}));}catch{}
}
export function readPracticeReturn(id){
 try{const state=JSON.parse(sessionStorage.getItem(key)),page=PRACTICE.find(page=>page.id===id);
  return page&&state?.id===id&&Number.isFinite(state.time)&&state.time>=0&&state.time<=page.duration?state:null;
 }catch{return null;}
}
export function takePracticeReturn(id){const state=readPracticeReturn(id);if(state)try{sessionStorage.removeItem(key);}catch{}return state;}
