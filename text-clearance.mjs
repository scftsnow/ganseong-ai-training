// Restrict the correction to demonstrated broad-mask cutoffs and redesigned layouts.
// Object depth tests, particle fields and other scene masks remain unchanged.
const SCOPED=new Set(['usage-title','usage-model','usage-question','usage-research','usage-record','usage-permission','opening','contents','mindset-1','mindset-4','installation-title','practice-title','learning-close','practice-excel','practice-hwp','practice-canva','practice-image-video','practice-vibe-coding']);
export function createTextClearance(THREE){
 const uniforms={uTextScoped:{value:0},uTextCount:{value:0},uTextRects:{value:Array.from({length:24},()=>new THREE.Vector4())},uTextAlpha:{value:new Float32Array(24)}};
 let last='';
 function update(page,t,transfer,width,height){
  uniforms.uTextScoped.value=SCOPED.has(page.id)?1:0;if(!uniforms.uTextScoped.value)return;
  const key=[page.id,t,transfer,width,height].join(':');if(key===last)return;last=key;
  const section=document.getElementById(page.id),screen=section?.querySelector('.screen'),lines=[];uniforms.uTextCount.value=0;if(!screen)return;
  const walker=document.createTreeWalker(screen,NodeFilter.SHOW_TEXT);let node;
  while(node=walker.nextNode()){
   if(!node.textContent.trim())continue;let alpha=1,hidden=false;
   for(let el=node.parentElement;el&&el!==section;el=el.parentElement){const css=getComputedStyle(el);alpha*=+css.opacity;if(css.display==='none'||css.visibility==='hidden'){hidden=true;break;}}
   if(hidden||alpha<.005)continue;
   const range=document.createRange();range.selectNodeContents(node);
   for(const b of range.getClientRects()){
    if(!b.width||!b.height||b.bottom<0||b.top>height)continue;
    const rect={left:b.left-7,right:b.right+7,top:b.top-4,bottom:b.bottom+4,alpha};
    const row=lines.find(r=>Math.abs(r.top-rect.top)<5&&Math.abs(r.bottom-rect.bottom)<5&&rect.left<=r.right+22&&rect.right>=r.left-22&&Math.abs(r.alpha-alpha)<.12);
    if(row){row.left=Math.min(row.left,rect.left);row.right=Math.max(row.right,rect.right);row.alpha=Math.max(row.alpha,alpha);}else lines.push(rect);
   }
  }
  // Highest-opacity text gets priority during brief overlapping kinetic transitions.
  lines.sort((a,b)=>b.alpha-a.alpha);const selected=lines.slice(0,24);uniforms.uTextCount.value=selected.length;
  selected.forEach((b,i)=>{uniforms.uTextRects.value[i].set(b.left/width,b.top/height,b.right/width,b.bottom/height);uniforms.uTextAlpha.value[i]=b.alpha;});
 }
 return {uniforms,update};
}
