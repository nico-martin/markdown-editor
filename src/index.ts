import './styles.css';
import './styles/content.css';
import './App';

'serviceWorker' in navigator &&
  navigator.serviceWorker.register('/service-worker.js');

(window as any).installPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  (window as any).installPrompt = e;
});
