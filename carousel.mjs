export function updateCarousel(links,current,reduced){
 const count=links.length,fade=[1,.74,.46,.24],blur=[0,.25,.75,1.35];
 links.forEach((link,i)=>{
  let offset=(i-current+count)%count;if(offset>count/2)offset-=count;
  const near=Math.abs(offset)<=3,d=Math.max(-4,Math.min(4,offset)),distance=Math.abs(d),angle=d*Math.PI/10;
  link.toggleAttribute('data-near',near);
  link.setAttribute('aria-hidden',String(!near));link.tabIndex=near?0:-1;
  link.toggleAttribute('aria-current',offset===0);if(offset===0)link.setAttribute('aria-current','step');
  link.style.opacity=near?String(fade[distance]):'0';
  link.style.filter=`blur(${near?blur[distance]:2}px)`;
  const x=reduced?d*58:Math.sin(angle)*240,z=reduced?0:(Math.cos(angle)-1)*240;
  link.style.transform=`translate3d(${x}px,${reduced?0:distance*distance*.8}px,${z}px) rotateY(${reduced?0:-d*18}deg) scale(${1-distance*.055})`;
  link.style.zIndex=String(5-distance);
  link.title=link.getAttribute('aria-label');
 });
}
