import { state, save, addMessage, openSignIn, openSignUp, openTracks, openVoices } from '/assets/js/app.js';

const TRACKS = [
  {k:'fullstack', name:'Software Development (Full-stack)', blurb:'Front-end + back-end foundations with project practice.'},
  {k:'data',      name:'Data Analytics',                  blurb:'Spreadsheets → SQL → dashboards for insight.'},
  {k:'uiux',      name:'UI/UX Design',                    blurb:'Wireframes, prototypes, usability, design thinking.'},
  {k:'marketing', name:'Digital Marketing',               blurb:'SEO, content, ads, analytics for growth.'},
  {k:'support',   name:'Customer Support (Remote)',       blurb:'Ticketing, empathy, SLAs, tooling.'},
  {k:'va',        name:'Virtual Assistance / Ops',        blurb:'Scheduling, docs, comms, productivity tools.'},
  {k:'cloud',     name:'Cloud & DevOps (Intro)',          blurb:'Cloud basics, CI/CD, containers overview.'}
];

function setDark(on){
  document.documentElement.setAttribute('data-theme', on ? 'dark' : 'light');
  document.getElementById('darkToggle').classList.toggle('active', on);
  state.dark = on; save('pmerit_dark', on);
}
function setTTS(on){
  document.getElementById('ttsToggle').classList.toggle('active', on);
  state.tts = on; save('pmerit_tts', on);
  if (!on && 'speechSynthesis' in window) speechSynthesis.cancel();
}
function setSupport(on){
  const tg = document.getElementById('supportToggle');
  tg.classList.toggle('active', on); state.support = on;
  document.getElementById('supportBadge').hidden = !on;
  document.getElementById('welcomeCopy').textContent = on
    ? 'Welcome to PMERIT Support. I can help with accounts, enrollment, and technical issues. How can I assist you?'
    : 'Welcome to PMERIT! I\'m here to guide your learning journey.';
}
function setVH(on){
  const vh = document.getElementById('vhToggle');
  vh.classList.toggle('active', on); state.vh = on;
  document.getElementById('vhAvatar').style.display = on ? 'flex' : 'none';
  document.getElementById('vhBadge').hidden = !on;
  document.getElementById('textChat').hidden = on;
  document.getElementById('vhStage').hidden = !on;
}

function goDashboard(){
  if (state.auth) {
    location.href = '/dashboard.html';
  } else {
    openSignUp();
  }
}

function initLeft(){
  // persist toggles
  setDark(state.dark);
  setTTS(state.tts);

  document.getElementById('darkToggle').onclick = () => setDark(!state.dark);
  document.getElementById('ttsToggle').onclick = () => setTTS(!state.tts);
  document.getElementById('supportToggle').onclick = () => setSupport(!state.support);
  document.getElementById('vhToggle').onclick = () => setVH(!state.vh);

  // settings collapse
  const head = document.querySelector('#settingsBox .head');
  const body = document.querySelector('#settingsBox .body');
  head.addEventListener('click', () => {
    const open = body.style.display === 'block';
    body.style.display = open ? 'none' : 'block';
    head.querySelector('i.fas').className = open ? 'fas fa-sliders-h' : 'fas fa-chevron-down';
  });

  // dashboard button style
  const dash = document.getElementById('dashBtn');
  dash.classList.toggle('guest', !state.auth);
  dash.onclick = goDashboard;
  document.getElementById('m_dashBtn')?.addEventListener('click', goDashboard);

  // careers & voices
  document.getElementById('careerPaths').onclick = () => openTracks(TRACKS);
  document.getElementById('m_careerPaths')?.addEventListener('click', () => openTracks(TRACKS));
  document.getElementById('voicesBtn').onclick = () => openVoices();

  // quick buttons
  document.getElementById('vhQuick').onclick = () => setVH(true);
  document.getElementById('vhShort').onclick = () => setVH(true);
  document.getElementById('supportShort').onclick = () => setSupport(true);
  document.getElementById('m_vhToggle')?.addEventListener('click', () => setVH(!state.vh));
  document.getElementById('m_supportToggle')?.addEventListener('click', () => setSupport(!state.support));
  document.getElementById('m_settings')?.addEventListener('click', () => {
    alert(`Settings — Dark: ${state.dark?'On':'Off'} | TTS: ${state.tts?'On':'Off'}`);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLeft);
} else {
  initLeft();
}
