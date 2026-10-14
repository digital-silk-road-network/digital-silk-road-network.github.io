document.documentElement.classList.add('js');
const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('.nav');
if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);menuButton.textContent=open?'Close':'Menu';});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){menuButton.setAttribute('aria-expanded','false');nav.classList.remove('is-open');menuButton.textContent='Menu';menuButton.focus();}});}

const membersRedirect=document.querySelector('a[data-members-redirect]');
if(membersRedirect){window.location.replace(membersRedirect.href+window.location.hash);}

const membershipForm=document.querySelector('#membership-form');
if(membershipForm&&window.fetch&&window.AbortController){
  const submitButton=membershipForm.querySelector('#join-submit');
  const formStatus=membershipForm.querySelector('#form-status');
  let submitting=false;
  membershipForm.addEventListener('input',event=>{
    if(event.target.matches('input[required]'))event.target.setCustomValidity('');
  });
  membershipForm.addEventListener('submit',async event=>{
    event.preventDefault();
    if(submitting)return;
    for(const input of membershipForm.querySelectorAll('input[required]')){
      input.value=input.value.trim();
      input.setCustomValidity(input.value?'':'Please complete this field.');
    }
    if(!membershipForm.reportValidity())return;
    if(membershipForm.elements.namedItem('_honey').value)return;
    submitting=true;
    submitButton.disabled=true;
    submitButton.textContent='Sending…';
    membershipForm.setAttribute('aria-busy','true');
    formStatus.classList.remove('is-error');
    formStatus.textContent='Sending your details. Please keep this page open.';
    const controller=new AbortController();
    const timeout=window.setTimeout(()=>controller.abort(),30000);
    let sent=false;
    try{
      const response=await fetch(membershipForm.dataset.submitEndpoint,{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify(Object.fromEntries(new FormData(membershipForm))),
        signal:controller.signal
      });
      const result=await response.json();
      const accepted=result.success===true||result.success==='true';
      const awaitingActivation=/activat|confirm your email/i.test(String(result.message||''));
      if(!response.ok||!accepted||awaitingActivation)throw new Error('Delivery was not confirmed.');
      sent=true;
      formStatus.textContent='Your details have been sent. Thank you for your interest.';
      window.location.assign(membershipForm.elements.namedItem('_next').value);
    }catch(error){
      formStatus.classList.add('is-error');
      formStatus.textContent='We could not confirm delivery. Your details are still in the form. Please try again, or email them to wang.june312@gmail.com.';
    }finally{
      window.clearTimeout(timeout);
      membershipForm.removeAttribute('aria-busy');
      if(!sent){submitting=false;submitButton.disabled=false;submitButton.textContent='Send my details';}
    }
  });
}
