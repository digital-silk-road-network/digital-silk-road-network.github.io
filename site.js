document.documentElement.classList.add('js');
const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('.nav');
if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);menuButton.textContent=open?'Close':'Menu';});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){menuButton.setAttribute('aria-expanded','false');nav.classList.remove('is-open');menuButton.textContent='Menu';menuButton.focus();}});}

const membersRedirect=document.querySelector('a[data-members-redirect]');
if(membersRedirect){window.location.replace(membersRedirect.href+window.location.hash);}

// Temporary email delivery while FormSubmit is unavailable (HTTP 522, 5 November 2026).
// Opening a draft or copying these details never confirms that an email has been sent.
function prepareEmailRegistration(form, seminar){
  if(!form)return;
  const button=form.querySelector(seminar?'#registration-submit':'#join-submit');
  const status=form.querySelector(seminar?'#registration-status':'#form-status');
  const recipient='wang.june312@gmail.com';
  const label=seminar?'registration':'membership enquiry';
  const notice=document.createElement('p');
  notice.className='form-status revised-text';
  notice.setAttribute('role','note');
  notice.textContent='Online delivery is currently unavailable. Complete this form to prepare an email to June, then send it from your email app. You can also copy the details into webmail. Preparing the email does not send it.';
  form.prepend(notice);
  button.textContent=seminar?'Prepare registration email':'Prepare membership email';
  const privacy=form.querySelector(seminar?'#registration-privacy':'#form-privacy');
  if(privacy){
    privacy.textContent=seminar?
      'Send your details directly to June Wang at '+recipient+' to manage this seminar and share its joining details. If you choose Yes, your name and email address will also be added to the network’s seminar updates mailing list in Google Contacts. You can withdraw your subscription by emailing June. Preparing or copying the email does not send your details.':
      'Send your details directly to June Wang at '+recipient+' to register your interest in joining the network. Preparing or copying the email does not send your details.';
  }
  let panel;
  form.addEventListener('input',event=>{
    if(event.target.matches('input[required]:not([type="radio"])'))event.target.setCustomValidity('');
    if(panel){panel.hidden=true;status.textContent='Your details have changed. Prepare the email again before sending.';}
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();
    for(const input of form.querySelectorAll('input[required]:not([type="radio"])')){
      input.value=input.value.trim();
      input.setCustomValidity(input.value?'':'Please complete this field.');
    }
    if(!form.reportValidity()||form.elements.namedItem('_honey').value)return;
    const entries=Array.from(new FormData(form)).filter(([name])=>!name.startsWith('_'));
    const subject=form.elements.namedItem('_subject').value;
    const names={name:'Full name',email:'Email address'};
    const body='Please record my '+label+' with the following details.\n\n'+
      entries.map(([name,value])=>(names[name]||name)+': '+value).join('\n')+
      '\n\nRegistration page: '+form.elements.namedItem('_url').value;
    if(panel)panel.remove();
    panel=document.createElement('section');
    panel.className='form-status revised-text';
    panel.id=seminar?'registration-email-details':'membership-email-details';
    const title=document.createElement('h2');
    title.textContent=seminar?'Send your registration by email':'Send your membership enquiry by email';
    const instructions=document.createElement('p');
    instructions.textContent='Your '+label+' has not been sent yet. Open the draft below and send it to '+recipient+'. If your email app does not open, copy the details and send them using webmail.';
    const actions=document.createElement('div');
    actions.className='form-actions';
    const draft=document.createElement('a');
    draft.className='button';draft.textContent='Open email draft';
    draft.href='mailto:'+recipient+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    const copy=document.createElement('button');
    copy.type='button';copy.className='text-link';copy.textContent='Copy email details';
    const details=document.createElement('textarea');
    details.readOnly=true;
    details.setAttribute('aria-label',seminar?'Registration email details':'Membership email details');
    details.style.cssText='display:block;width:100%;min-height:18rem;margin-top:20px;padding:12px;font:inherit;color:inherit;background:white;border:1px solid #839097;';
    details.value='To: '+recipient+'\nSubject: '+subject+'\n\n'+body;
    const copyStatus=document.createElement('p');
    copyStatus.setAttribute('role','status');copyStatus.setAttribute('aria-live','polite');
    copy.addEventListener('click',async()=>{
      try{
        await navigator.clipboard.writeText(details.value);
        copyStatus.textContent='Details copied. Paste them into an email to '+recipient+' and send it.';
      }catch(error){
        details.focus();details.select();
        copyStatus.textContent='Please copy the selected text, paste it into an email to '+recipient+' and send it.';
      }
    });
    actions.append(draft,copy);panel.append(title,instructions,actions,details,copyStatus);
    status.insertAdjacentElement('afterend',panel);
    status.classList.remove('is-error');
    status.textContent='Email prepared. Please send it to complete your '+label+'.';
    button.setAttribute('aria-controls',panel.id);
    panel.scrollIntoView({behavior:'smooth',block:'start'});
  });
}
prepareEmailRegistration(document.querySelector('#membership-form'),false);
prepareEmailRegistration(document.querySelector('#seminar-registration-form'),true);
