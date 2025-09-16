// This file will load all modals and core scripts on page load

// State management
const state = {
  auth: false,
  dark: false,
  vh: false,
  support: false,
  tts: false,
  lang: 'en'
};

// Career tracks data
const TRACKS = [
  {k:'fullstack', name:'Software Development (Full-stack)', blurb:'Front-end + back-end foundations with project practice.'},
  {k:'data', name:'Data Analytics', blurb:'Spreadsheets → SQL → dashboards for real insights.'},
  {k:'uiux', name:'UI/UX Design', blurb:'Design thinking, wireframes, prototypes, usability.'},
  {k:'marketing', name:'Digital Marketing', blurb:'SEO, content, ads, analytics for growth.'},
  {k:'support', name:'Customer Support (Remote)', blurb:'Ticketing, empathy, SLAs, tooling.'},
  {k:'va', name:'Virtual Assistance / Operations', blurb:'Scheduling, docs, communication, tooling.'},
  {k:'cloud', name:'Cloud & DevOps (Intro)', blurb:'Cloud basics, CI/CD, containers overview.'},
];

// Rotating tips for insights
const tips = [
  "Pro tip: Keep notes in your own words for better recall.",
  "Short, frequent study sessions are more effective than long cramming sessions.",
  "Relate new concepts to things you already understand for better retention.",
  "Teach what you've learned to someone else to solidify your understanding.",
  "Take breaks during study sessions to improve focus and retention."
];

// DOM Elements
const body = document.body;
const darkToggle = document.getElementById('darkToggle');
const vhToggle = document.getElementById('vhToggle');
const supportToggle = document.getElementById('supportToggle');
const ttsToggle = document.getElementById('ttsToggle');
const vhAvatar = document.getElementById('vhAvatar');
const vhBadge = document.getElementById('vhBadge');
const vhStage = document.getElementById('vhStage');
const textChat = document.getElementById('textChat');
const supportBadge = document.getElementById('supportBadge');
const chatInput = document.getElementById('chatInput');
const count = document.getElementById('count');
const sendBtn = document.getElementById('sendBtn');
const chatBody = document.getElementById('chatBody');
const welcomeCopy = document.getElementById('welcomeCopy');
const welcomeMsg = document.getElementById('welcomeMsg');
const settingsBox = document.getElementById('settingsBox');
const settingsHead = settingsBox.querySelector('.head');
const settingsBody = settingsBox.querySelector('.body');
const dashBtn = document.getElementById('dashBtn');
const signInBtn = document.getElementById('signInBtn');
const startBtn = document.getElementById('startBtn');
const pricingBtn = document.getElementById('pricingBtn');
const careerPaths = document.getElementById('careerPaths');
const beginBtn = document.getElementById('beginAssessment');
const vhQuick = document.getElementById('vhQuick');
const vhShort = document.getElementById('vhShort');
const supportShort = document.getElementById('supportShort');
const signInModal = document.getElementById('signInModal');
const signUpModal = document.getElementById('signUpModal');
const assessmentModal = document.getElementById('assessmentModal');
const tracksModal = document.getElementById('tracksModal');
const voicesModal = document.getElementById('voicesModal');
const insights = document.getElementById('insights');
const m_insights = document.getElementById('m_insights');

// Modals HTML as templates for inclusion
const signUpModalHtml = `
  <dialog id="signUpModal">
    <form method="dialog">
      <h3><i class="fas fa-user-plus"></i> Create your PMERIT account</h3>
      <label>
        <span>Full name</span>
        <input id="su_name" required placeholder="Your name"/>
      </label>
      <label>
        <span>Email</span>
        <input id="su_email" type="email" required placeholder="you@example.com"/>
      </label>
      <label>
        <span>Password</span>
        <input id="su_pwd" type="password" required placeholder="••••••••"/>
      </label>
      <p style="font-size:0.9rem;color:var(--text-secondary);margin:1rem 0">
        By continuing you agree to our terms.
      </p>
      <div class="button-group">
        <button class="nav-btn" id="signUpCancel" type="button">Cancel</button>
        <button class="nav-btn primary" id="signUpCreate" type="button">Create account</button>
      </div>
    </form>
  </dialog>`;
  
const signInModalHtml = `
  <dialog id="signInModal">
    <form method="dialog">
      <h3><i class="fas fa-right-to-bracket"></i> Sign in to PMERIT</h3>
      <label>
        <span>Email</span>
        <input id="si_email" type="email" required placeholder="you@example.com"/>
      </label>
      <label>
        <span>Password</span>
        <input id="si_pwd" type="password" required placeholder="••••••••"/>
      </label>
      <div style="margin-top:1rem">
        <a href="#forgot" style="font-size:0.9rem; color: var(--primary);">Forgot password?</a>
      </div>
      <div class="button-group">
        <button class="nav-btn" id="signInCancel" type="button">Cancel</button>
        <button class="nav-btn primary" id="signInGo" type="button">Sign In</button>
      </div>
    </form>
  </dialog>`;

const voicesModalHtml = `
  <dialog id="voicesModal">
    <form method="dialog">
      <h3><i class="fas fa-headphones"></i> Voice Sampler</h3>
      <label>
        <span>Sample text</span>
        <textarea id="voiceText" rows="3" style="border:1px solid var(--border-color);border-radius:0.5rem;padding:0.75rem;font-family:inherit;">Welcome to PMERIT. Empowering learning through innovation.</textarea>
      </label>
      <div class="button-group" style="margin-top: 1rem;">
        <button class="nav-btn" id="browserTts" type="button">Browser TTS</button>
        <button class="nav-btn" id="voicesClose" type="button">Close</button>
      </div>
    </form>
  </dialog>`;
  
const tracksModalHtml = `
  <dialog id="tracksModal">
    <div style="margin:0;padding:1.5rem">
      <h3><i class="fas fa-compass"></i> Explore Career Tracks</h3>
      <div class="tracks-grid" id="tracksList"></div>
      <div id="trackDetail" style="margin-top:1rem;display:none;border-top:1px solid var(--border-color);padding-top:1rem"></div>
      <div class="button-group">
        <button class="nav-btn" id="tracksClose" type="button">Close</button>
      </div>
    </div>
  </dialog>`;
  
const assessmentModalHtml = `
  <dialog id="assessmentModal">
    <div style="margin:0;padding:1.5rem">
      <h3><i class="fas fa-graduation-cap"></i> Discover Your Path — Quick Assessment</h3>
      <ol style="line-height:1.6;margin:0 0 1rem 1.25rem">
        <li><strong>Learning style:</strong> a few preferences.</li>
        <li><strong>Interests:</strong> choose areas you enjoy.</li>
        <li><strong>Skills:</strong> rate comfort with common tools.</li>
      </ol>
      <p style="color:var(--text-secondary);margin:0 0 1rem">
        This assessment will help us create a personalized learning plan based on your preferences.
      </p>
      <div class="button-group">
        <button class="nav-btn" id="assessmentCancel" type="button">Cancel</button>
        <button class="nav-btn primary" id="assessmentStart" type="button">Start</button>
      </div>
    </div>
  </dialog>`;
  
document.addEventListener('DOMContentLoaded', () => {
  document.body.insertAdjacentHTML('beforeend', signUpModalHtml);
  document.body.insertAdjacentHTML('beforeend', signInModalHtml);
  document.body.insertAdjacentHTML('beforeend', voicesModalHtml);
  document.body.insertAdjacentHTML('beforeend', tracksModalHtml);
  document.body.insertAdjacentHTML('beforeend', assessmentModalHtml);
});
