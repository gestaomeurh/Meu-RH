const toggle=document.querySelector('.menu-toggle');
const menu=document.getElementById('menu');
function closeMenu(){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');}
toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.classList.contains('open')){closeMenu();toggle.focus();}});
document.addEventListener('click',event=>{if(!event.target.closest('header'))closeMenu();});
window.matchMedia('(min-width: 761px)').addEventListener('change',closeMenu);
document.getElementById('year').textContent=new Date().getFullYear();

// Reveal once on arrival; content remains visible if motion is reduced.
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
const revealElements=document.querySelectorAll('.about>div,.purpose article,.values,.section-heading,.service,.director-copy,.contact>div');
let revealObserver;
function setupReveals(){
  revealObserver?.disconnect();
  revealElements.forEach(el=>el.classList.remove('is-pending'));
  if(motionPreference.matches||!('IntersectionObserver' in window))return;
  revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('is-pending');entry.target.classList.add('is-revealed');revealObserver.unobserve(entry.target);}});
  },{threshold:0.08,rootMargin:'0px 0px -20px 0px'});
  revealElements.forEach((el,i)=>{
    el.classList.add('reveal-item');
    if(el.getBoundingClientRect().top>window.innerHeight){el.classList.add('is-pending');el.style.setProperty('--reveal-delay',el.classList.contains('service')?`${i%2*70}ms`:'0ms');revealObserver.observe(el);}
  });
}
setupReveals();
motionPreference.addEventListener('change',setupReveals);

const clients=document.querySelector('.clients');
const logoTrack=document.querySelector('.logo-track');
const logoGroup=document.querySelector('.logo-group');
const carouselToggle=document.querySelector('.carousel-toggle');
if(clients&&logoTrack&&logoGroup&&carouselToggle){
  const scroller=document.querySelector('.logo-window');
  const previous=document.querySelector('.carousel-prev');
  const next=document.querySelector('.carousel-next');
  let paused=false,hovered=false,visible=true,direction=1,lastTime=0,position=scroller.scrollLeft;
  let dragging=false,startX=0,startScroll=0;
  clients.classList.add('is-ready');
  function setPaused(value){
    paused=value;
    clients.classList.toggle('is-paused',paused);
    carouselToggle.setAttribute('aria-pressed',String(paused));
    carouselToggle.querySelector('.pause-label').textContent=paused?'Retomar movimento':'Pausar movimento';
    carouselToggle.querySelector('.pause-symbol').textContent=paused?'▷':'Ⅱ';
    position=scroller.scrollLeft;
  }
  carouselToggle.addEventListener('click',()=>setPaused(!paused));
  scroller.addEventListener('mouseenter',()=>{hovered=true;});
  scroller.addEventListener('mouseleave',()=>{hovered=false;});
  scroller.addEventListener('wheel',()=>setPaused(true),{passive:true});
  scroller.addEventListener('pointerdown',()=>setPaused(true),{passive:true});
  scroller.addEventListener('keydown',event=>{
    if(['ArrowLeft','ArrowRight','Home','End','PageUp','PageDown'].includes(event.key))setPaused(true);
  });
  logoTrack.addEventListener('dragstart',event=>event.preventDefault());
  logoTrack.addEventListener('pointerdown',event=>{
    if(event.pointerType!=='mouse'||event.button!==0)return;
    dragging=true;startX=event.clientX;startScroll=scroller.scrollLeft;
    logoTrack.setPointerCapture(event.pointerId);
    scroller.classList.add('is-dragging');
    event.preventDefault();
  });
  logoTrack.addEventListener('pointermove',event=>{
    if(dragging){scroller.scrollLeft=startScroll-(event.clientX-startX);position=scroller.scrollLeft;}
  });
  function endDrag(){dragging=false;scroller.classList.remove('is-dragging');}
  logoTrack.addEventListener('pointerup',endDrag);
  logoTrack.addEventListener('pointercancel',endDrag);
  logoTrack.addEventListener('lostpointercapture',endDrag);
  function advance(sign){
    setPaused(true);
    scroller.scrollBy({left:sign*(logoGroup.firstElementChild.getBoundingClientRect().width+18),behavior:motionPreference.matches?'instant':'smooth'});
  }
  previous?.addEventListener('click',()=>advance(-1));
  next?.addEventListener('click',()=>advance(1));
  function updateControls(){
    const max=scroller.scrollWidth-scroller.clientWidth;
    if(previous)previous.disabled=scroller.scrollLeft<=1;
    if(next)next.disabled=scroller.scrollLeft>=max-1;
  }
  scroller.addEventListener('scroll',updateControls,{passive:true});
  window.addEventListener('resize',()=>{position=scroller.scrollLeft;updateControls();});
  updateControls();
  function animate(time){
    const elapsed=lastTime?Math.min(time-lastTime,50):0;lastTime=time;
    if(!paused&&!hovered&&visible&&!document.hidden&&!motionPreference.matches&&!scroller.matches(':focus-within')){
      const max=scroller.scrollWidth-scroller.clientWidth;
      if(max>0){
        position=Math.max(0,Math.min(max,position+direction*elapsed*.032));
        scroller.scrollLeft=position;
        if(position>=max)direction=-1;
        else if(position<=0)direction=1;
      }
    }else{position=scroller.scrollLeft;}
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
  motionPreference.addEventListener('change',()=>{position=scroller.scrollLeft;});
  document.addEventListener('visibilitychange',()=>{lastTime=0;});
  if('IntersectionObserver' in window){
    new IntersectionObserver(entries=>entries.forEach(entry=>{visible=entry.isIntersecting;})).observe(clients);
  }
}
