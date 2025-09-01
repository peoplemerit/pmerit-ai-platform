// Global app state (public UI)
export const state = {
  auth: localStorage.getItem('pmerit_auth') === 'true',
  dark: localStorage.getItem('pmerit_dark') === 'true',
  tts: localStorage.getItem('pmerit_tts') === 'true',
  lang: localStorage.getItem('pmerit_lang') || 'en',
  vh: false,
  support: false
};

export function save(k, v){ try{ localStorage.setItem(k, String(v)); }catch{} }

function setTheme(on){
  document.documentElement.setAttribute('data-theme', on ? 'dark' : 'light');
}

function initHeader(){
  const lang = document.getElementById('lang');
  lang.value = state.lang;
  lang.addEventListener('change', () => {
    state.lang = lang.value; save('pmerit_lang', state.lang);
    addMessage('PMERIT AI', `Language set to ${lang.options[lang.selectedIndex].text}.`);
  });

  document.getElementById('pricingBtn').addEventListener('click', () => {
    addMessage('PMERIT AI', 'We offer free and premium plans. Ready to see which plan fits you best?');
  });

  document.getElementById('signInBtn').addEventListener('click', () => openSignIn());

  document.getElementById('startBtn').addEventListener('click', () => openAssessment());
}

function initChat(){
  const chatInput = document.getElementById('chatInput');
  const count = document.getElementById('count');
  chatInput.addEventListener('input', () => count.textContent = `${chatInput.value.length}/1000`);
  document.getElementById('sendBtn').addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
}

export function addMessage(sender, text, isUser=false){
  const chatBody = document.getElementById('chatBody');
  const welcome = document.getElementById('welcomeMsg');
  if (welcome) welcome.remove();

  const el = document.createElement('article');
  el.className = 'bubble';
  el.innerHTML = `
    <div class="ava" style="${isUser ? 'background:#4f46e5' : ''}">
      <i class="fas ${isUser ? 'fa-user' : 'fa-user-circle'}"></i>
    </div>
    <div>
      <h3>${sender}</h3>
      <p>${text}</p>
    </div>`;
  chatBody.appendChild(el);
  chatBody.scrollTop = chatBody.scrollHeight;

  if (state.tts && !isUser && 'speechSynthesis' in window){
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }
  if (state.vh && !isUser) document.getElementById('captions').textContent = text;
}

function sendMessage(){
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  addMessage('You', text, true);
  input.value = ''; document.getElementById('count').textContent = '0/1000';
  setTimeout(() => {
    const reply = state.support
      ? 'Support mode is on. Ask me anything about accounts, enrollment, or tech issues.'
      : 'I recommend starting with our short assessment to find the best track. Want to begin now?';
    addMessage('PMERIT AI', reply);
  }, 600);
}

// Public modals (simple inline for now)
function ensureModals(){
  const signIn = document.getElementById('signInModal');
  if (!signIn.open) signIn.innerHTML = `
    <form method="dialog" style="margin:0;padding:1rem">
      <h3><i class="fas fa-right-to-bracket"></i> Sign in</h3>
      <label>Email <input id="si_email" type="email" required></label>
      <label>Password <input id="si_pwd" type="password" required></label>
      <div style="display:flex;gap:.5rem;justify-content:flex-end;margin-top:1rem">
        <button class="btn" id="signInCancel" type="button">Cancel</button>
        <button class="btn primary" id="signInGo" type="button">Sign In</button>
      </div>
    </form>`;
  const signup = document.getElementById('signUpModal');
  if (!signup.open) signup.innerHTML = `
    <form method="dialog" style="margin:0;padding:1rem">
      <h3><i class="fas fa-user-plus"></i> Create account</h3>
      <label>Full name <input id="su_name" required></label>
      <label>Email <input id="su_email" type="email" required></label>
      <label>Password <input id="su_pwd" type="password" required></label>
      <div style="display:flex;gap:.5rem;justify-content:flex-end;margin-top:1rem">
        <button class="btn" id="signUpCancel" type="button">Cancel</button>
        <button class="btn primary" id="signUpCreate" type="button">Create</button>
      </div>
    </form>`;
  const assess = document.getElementById('assessmentModal');
  if (!assess.open) assess.innerHTML = `
    <div style="margin:0;padding:1rem">
      <h3><i class="fas fa-graduation-cap"></i> Discover Your Path — Quick Assessment</h3>
      <ol style="margin-left:1rem;line-height:1.6">
        <li>Learning style</li><li>Interests</li><li>Skills</li>
      </ol>
      <div style="display:flex;gap:.5rem;justify-content:flex-end;margin-top:1rem">
        <button class="btn" id="assessmentCancel" type="button">Cancel</button>
        <button class="btn primary" id="assessmentStart" type="button">Start</button>
      </div>
    </div>`;
  const voices = document.getElementById('voicesModal');
  if (!voices.open) voices.innerHTML = `
    <div style="margin:0;padding:1rem">
      <h3><i class="fas fa-headphones"></i> Voice Sampler</h3>
      <textarea id="voiceText" rows="3" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:.6rem">Welcome to PMERIT.</textarea>
      <div style="display:flex;gap:.5rem;justify-content:flex-end;margin-top:1rem">
        <button class="btn" id="voicesClose" type="button">Close</button>
        <button class="btn" id="browserTts" type="button">Browser TTS</button>
      </div>
    </div>`;
  const tracks = document.getElementById('tracksModal');
  if (!tracks.open) tracks.innerHTML = `
    <div style="margin:0;padding:1rem">
      <h3><i class="fas fa-compass"></i> Explore Career Tracks</h3>
      <div id="tracksList" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:.75rem;margin:.75rem 0"></div>
      <div id="trackDetail" style="display:none;border-top:1px solid var(--border);padding-top:.75rem"></div>
      <div style="display:flex;justify-content:flex-end"><button class="btn" id="tracksClose" type="button">Close</button></div>
    </div>`;
}

export function openSignIn(){
  ensureModals();
  const dlg = document.getElementById('signInModal'); dlg.showModal();
  document.getElementById('signInCancel').onclick = () => dlg.close();
  document.getElementById('signInGo').onclick = () => {
    const e = document.getElementById('si_email').value.trim();
    const p = document.getElementById('si_pwd').value.trim();
    if (!e || !p) return alert('Enter email and password.');
    state.auth = true; save('pmerit_auth', true);
    document.getElementById('dashBtn').classList.remove('guest');
    addMessage('PMERIT AI','Welcome back! Your dashboard is now available.');
    dlg.close();
  };
}

export function openSignUp(){
  ensureModals();
  const dlg = document.getElementById('signUpModal'); dlg.showModal();
  document.getElementById('signUpCancel').onclick = () => dlg.close();
  document.getElementById('signUpCreate').onclick = () => {
    const n = document.getElementById('su_name').value.trim();
    const e = document.getElementById('su_email').value.trim();
    const p = document.getElementById('su_pwd').value.trim();
    if (!n || !e || !p) return alert('Complete all fields.');
    state.auth = true; save('pmerit_auth', true);
    document.getElementById('dashBtn').classList.remove('guest');
    addMessage('PMERIT AI', `Welcome to PMERIT, ${n}! Your account is ready.`);
    dlg.close();
  };
}

export function openAssessment(){
  ensureModals();
  const dlg = document.getElementById('assessmentModal'); dlg.showModal();
  document.getElementById('assessmentCancel').onclick = () => dlg.close();
  document.getElementById('assessmentStart').onclick = () => {
    dlg.close();
    addMessage('PMERIT AI', 'Assessment started. First, choose your preferred learning style.');
  };
}

export function openVoices(){
  ensureModals();
  const dlg = document.getElementById('voicesModal'); dlg.showModal();
  document.getElementById('voicesClose').onclick = () => dlg.close();
  document.getElementById('browserTts').onclick = () => {
    const t = document.getElementById('voiceText').value.trim();
    if (!('speechSynthesis' in window)) return alert('Browser TTS not supported.');
    speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(t || 'Welcome to PMERIT.'));
  };
}

export function openTracks(TRACKS){
  ensureModals();
  const dlg = document.getElementById('tracksModal'); dlg.showModal();
  const list = document.getElementById('tracksList');
  const detail = document.getElementById('trackDetail');
  list.innerHTML = '';
  TRACKS.forEach(t => {
    const card = document.createElement('button');
    card.className = 'btn'; card.style.textAlign='left';
    card.innerHTML = `<strong>${t.name}</strong><div class="muted" style="margin-top:.25rem">${t.blurb}</div>`;
    card.onclick = () => {
      detail.style.display = 'block';
      detail.innerHTML = `<h4 style="margin:.25rem 0">${t.name}</h4>
        <p class="muted">${t.blurb}</p>
        <button class="btn primary" id="trackCta">See sample plan</button>`;
      document.getElementById('trackCta').onclick = () => { dlg.close(); openAssessment(); };
    };
    list.appendChild(card);
  });
  document.getElementById('tracksClose').onclick = () => dlg.close();
}

export function init(){
  setTheme(state.dark);
  initHeader();
  initChat();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
