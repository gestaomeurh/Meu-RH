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
if(clients&&logoTrack&&logoGroup){
  const scroller=document.querySelector('.logo-window');
  let hovered=false,visible=true,direction=1,lastTime=0,position=scroller.scrollLeft;
  let dragging=false,touching=false,startX=0,startScroll=0;
  clients.classList.add('is-ready');
  scroller.addEventListener('mouseenter',()=>{hovered=true;});
  scroller.addEventListener('mouseleave',()=>{hovered=false;position=scroller.scrollLeft;});
  scroller.addEventListener('touchstart',()=>{touching=true;},{passive:true});
  function endTouch(){touching=false;position=scroller.scrollLeft;}
  scroller.addEventListener('touchend',endTouch,{passive:true});
  scroller.addEventListener('touchcancel',endTouch,{passive:true});
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
  window.addEventListener('resize',()=>{position=scroller.scrollLeft;});
  function animate(time){
    const elapsed=lastTime?Math.min(time-lastTime,50):0;lastTime=time;
    if(!hovered&&!dragging&&!touching&&visible&&!document.hidden&&!motionPreference.matches){
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
