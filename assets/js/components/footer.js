import { addMessage } from '/assets/js/app.js';

function initFooter(){
  document.getElementById('privacyBtn').onclick = () =>
    addMessage('PMERIT AI','Our Privacy & Terms explain how we protect your data and the rules of use.');
  document.getElementById('contactBtn').onclick = () =>
    addMessage('PMERIT AI','Contact us via this chat or at support@pmerit.com.');
  document.getElementById('partnershipsBtn').onclick = () =>
    addMessage('PMERIT AI','We partner with institutions and organizations. Ask us about partnerships.');
  document.getElementById('supportBtn').onclick = () =>
    addMessage('PMERIT AI','Support mode is available anytime—just toggle it on in Quick Actions.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFooter);
} else {
  initFooter();
}
