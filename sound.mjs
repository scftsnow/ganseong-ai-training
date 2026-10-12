// Original, locally synthesized sound. No recordings, remote assets or narration.
export function createSound(){
 let context,master,analyser,enabled=false,volume=.35,lastCue=-1,peak=0,rms=0;
 const seen=new Set(),events=[];
 function setup(){
  if(context)return;
  context=new AudioContext();
  master=context.createGain();master.gain.value=0;
  const limiter=context.createDynamicsCompressor();
  limiter.threshold.value=-18;limiter.ratio.value=8;limiter.attack.value=.003;limiter.release.value=.14;
  analyser=context.createAnalyser();analyser.fftSize=256;
  master.connect(limiter);limiter.connect(analyser);analyser.connect(context.destination);
 }
 function tone(kind,word=0){
  const now=context.currentTime,voice=context.createGain();
  voice.connect(master);
  const duration=kind==='air'||kind==='scan'?.23:kind==='bloom'?.32:.12;
  voice.gain.setValueAtTime(0,now);
  voice.gain.linearRampToValueAtTime(kind==='word'?.07:.13,now+.009);
  voice.gain.exponentialRampToValueAtTime(.0001,now+duration);
  if(kind==='air'||kind==='scan'){
   const buffer=context.createBuffer(1,Math.ceil(context.sampleRate*duration),context.sampleRate);
   const a=buffer.getChannelData(0);
   // Seeded noise keeps sound design repeatable.
   let seed=631;
   for(let i=0;i<a.length;i++){seed=(seed*16807)%2147483647;a[i]=(seed/2147483647-.5)*.8;}
   const source=context.createBufferSource();source.buffer=buffer;
   const filter=context.createBiquadFilter();filter.type='bandpass';
   filter.frequency.setValueAtTime(kind==='scan'?1200:400,now);
   filter.frequency.exponentialRampToValueAtTime(1800,now+duration);filter.Q.value=.7;
   source.connect(filter);filter.connect(voice);source.start(now);source.stop(now+duration);
  }else{
   const oscillator=context.createOscillator();oscillator.type='sine';
   const pitch=kind==='spark'?880:kind==='question'?523.25:kind==='bloom'?392:kind==='word'?[392,440,523.25,587.33][word%4]:294;
   oscillator.frequency.setValueAtTime(pitch*(kind==='spark'?1.4:1),now);
   oscillator.frequency.exponentialRampToValueAtTime(pitch,now+.065);
   oscillator.connect(voice);oscillator.start(now);oscillator.stop(now+duration);
   if(kind==='bloom'){
    const overtone=context.createOscillator();overtone.frequency.value=pitch*1.5;
    const g=context.createGain();g.gain.value=.28;g.connect(voice);overtone.connect(g);overtone.start(now+.035);overtone.stop(now+duration);
   }
  }
 }
 return {
  async toggle(){setup();await context.resume();enabled=!enabled;master.gain.setTargetAtTime(enabled?volume*.7:0,context.currentTime,.018);if(enabled)tone('soft');return enabled;},
  setVolume(v){volume=Math.max(0,Math.min(1,v));if(context)master.gain.setTargetAtTime(enabled?volume*.7:0,context.currentTime,.018);},
  cue(section,key,kind,word=0,reduced=false){
   const id=section+':'+key;
   if(seen.has(id))return;
   seen.add(id); // Consume crossings even while muted, preventing a backlog after enabling.
   if(!enabled||reduced||!context||context.state!=='running'||context.currentTime-lastCue<.085)return;
   lastCue=context.currentTime;tone(kind,word);
   events.push({section,key,kind,at:lastCue});if(events.length>160)events.shift();
  },
  replay(section){for(const key of seen)if(key.startsWith(section+':'))seen.delete(key);},
  poll(){if(!analyser)return;const data=new Float32Array(256);analyser.getFloatTimeDomainData(data);let sum=0;for(const x of data){peak=Math.max(peak,Math.abs(x));sum+=x*x;}rms=Math.sqrt(sum/data.length);},
  diagnostics(){return {enabled,volume,contextState:context?.state??'not-created',peak,rms,events:[...events],consumed:seen.size};}
 };
}
