const toggle=document.querySelector('.menu-toggle');
const menu=document.getElementById('menu');
function closeMenu(){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');}
toggle.addEventListener('click',()=>{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.classList.contains('open')){closeMenu();toggle.focus();}});
document.addEventListener('click',event=>{if(!event.target.closest('header'))closeMenu();});
window.matchMedia('(min-width: 761px)').addEventListener('change',closeMenu);
document.getElementById('year').textContent=new Date().getFullYear();
