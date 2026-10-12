// Exact closing copy approved in Sentinel_9d6e620188848191bfb4a486ed92fe4d.
export const CLOSING = [
 {id:'learning-close',closingIndex:0,lines:['AI 공부는, AI로.','모르는 것은 묻고,','직접 해보며 배우세요.'],times:[[.55,.94,1.36],[2.4,2.75,3.17],[4.1,4.48,4.92]],duration:7,color:[232,237,247]},
 {id:'ending',closingIndex:1,lines:['오늘의 연수는 여기까지.','AI와 함께하는 배움은 지금부터.'],times:[[.55,.96,1.42],[3.0,3.38,3.83,4.34]],duration:7.6,color:[13,23,44],dark:true}
].map(p=>({...p,kind:'closing',start:0,title:p.lines.join(' '),cues:p.times.flatMap((times,line)=>times.map((t,word)=>({t,kind:word===0?'soft':'word',name:`closing-${p.closingIndex}-${line}-${word}`})))}));
