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
  const duplicate=logoGroup.cloneNode(true);
  duplicate.removeAttribute('aria-label');
  duplicate.setAttribute('aria-hidden','true');
  duplicate.querySelectorAll('img').forEach(img=>img.alt='');
  logoTrack.appendChild(duplicate);
  clients.classList.add('is-ready');
  carouselToggle.addEventListener('click',()=>{
    const paused=clients.classList.toggle('is-paused');
    carouselToggle.setAttribute('aria-pressed',String(paused));
    carouselToggle.querySelector('.pause-label').textContent=paused?'Retomar movimento':'Pausar movimento';
    carouselToggle.querySelector('.pause-symbol').textContent=paused?'▷':'Ⅱ';
  });
  if('IntersectionObserver' in window){
    new IntersectionObserver(entries=>entries.forEach(entry=>clients.classList.toggle('is-offscreen',!entry.isIntersecting))).observe(clients);
  }
}
