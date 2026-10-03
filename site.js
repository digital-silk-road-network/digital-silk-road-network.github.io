document.documentElement.classList.add('js');
const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('.nav');
if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);menuButton.textContent=open?'Close':'Menu';});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){menuButton.setAttribute('aria-expanded','false');nav.classList.remove('is-open');menuButton.textContent='Menu';menuButton.focus();}});}

const membersRedirect=document.querySelector('a[data-members-redirect]');
if(membersRedirect){window.location.replace(membersRedirect.href+window.location.hash);}
