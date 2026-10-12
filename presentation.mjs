import {USAGE_TIPS} from './usage-tips-data.mjs';
import {CLOSING} from './closing-data.mjs';
import {PRACTICE} from './practice-data.mjs';
import {MINDSETS} from './mindset.mjs';
import {BASIC_USE} from './basic-use-data.mjs';
import {INSTALLATION_TITLE} from './workshop-outline.mjs?v=20261010-tips-stage-final';

// Playback duration is local to a page; it never identifies the next page.
export const PAGES = [
 {id:'opening',kind:'title',title:'간성초등학교 AI 연수',duration:10,start:0,color:[245,244,239]},
 {id:'contents',kind:'contents',title:'목차',duration:4,start:0,color:[232,237,247]},
 {id:'mindset-title',kind:'mindset-title',title:'AI를 대하는 자세',duration:5,start:0,color:[14,20,39],dark:true},
 ...MINDSETS.map((m,i)=>({id:`mindset-${i+1}`,kind:'mindset',title:m.title,duration:5,start:.35,mindsetIndex:i,color:[[245,244,239],[14,20,39],[232,237,247],[246,247,250]][i],dark:i===1})),
 {id:'installation-title',kind:'installation-title',title:INSTALLATION_TITLE,duration:5,start:0,color:[14,20,39],dark:true},
 ...BASIC_USE,
 {id:'usage-title',kind:'usage-title',title:'AI 활용 팁',duration:5.5,start:0,color:[14,20,39],dark:true,cues:[{t:.35,kind:'spark',name:'tips-toolkit'},{t:.6,kind:'word',name:'tips-ai'},{t:1.15,kind:'word',name:'tips-use'},{t:1.7,kind:'bloom',name:'tips-title'}]},
 ...USAGE_TIPS,
 ...PRACTICE,
 ...CLOSING
];
export const LAST_PAGE=PAGES.length-1;
export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const smooth=(a,b,x)=>{const q=clamp((x-a)/(b-a));return q*q*(3-2*q);};
export const mix=(a,b,p)=>a+(b-a)*p;
