import { openAssessment } from '/assets/js/app.js';

const tips = [
  'Pro tip: Keep notes in your own words for better recall.',
  'Short, frequent study beats long cramming sessions.',
  'Relate new concepts to things you already know.',
  'Teach what you learned to solidify understanding.',
  'Take short breaks to improve focus and retention.'
];

function rotate(el){
  if (!el) return;
  let i = 0;
  el.textContent = tips[0];
  setInterval(()=>{ i=(i+1)%tips.length; el.textContent = tips[i]; }, 5000);
}

function initRight(){
  document.getElementById('beginAssessment').onclick = () => openAssessment();
  document.getElementById('m_beginAssessment')?.addEventListener('click', () => openAssessment());
  rotate(document.getElementById('insights'));
  rotate(document.getElementById('m_insights'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRight);
} else {
  initRight();
}
