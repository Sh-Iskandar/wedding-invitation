// ============================================
// НАСТРОЙКИ СВАДЬБЫ (меняйте здесь)
// ============================================
const WEDDING = {
  targetDate: new Date('2026-07-15T17:00:00'),
  shareTitle: 'Бурхониддин & Мухибахон — Свадебное приглашение',
  shareText: 'Мы приглашаем вас на нашу свадьбу 15 июля 2026',
};

// ============================================
// ЗАСТАВКА + МУЗЫКА
// ============================================
const gate = document.getElementById('intro-gate');
const playing = document.getElementById('intro-playing');
const openBtn = document.getElementById('open-invite');
const muteBtn = document.getElementById('mute-btn');
const audio = document.getElementById('bg-music');
let isMuted = false;

audio.volume = 0.6;

openBtn.addEventListener('click', () => {
  audio.muted = false;
  audio.play().catch(() => {});

  gate.classList.add('hidden');
  playing.classList.remove('hidden');

  setTimeout(() => playing.classList.add('fading'), 2800);
  setTimeout(() => {
    playing.classList.add('hidden');
    muteBtn.classList.remove('hidden');
  }, 4000);
});

muteBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  audio.muted = isMuted;
  muteBtn.setAttribute('aria-label', isMuted ? 'Включить звук' : 'Выключить звук');
  muteBtn.innerHTML = isMuted
    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>'
    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
  if (!isMuted) audio.play().catch(() => {});
});

// ============================================
// ОБРАТНЫЙ ОТСЧЁТ
// ============================================
function updateCountdown() {
  const diff = Math.max(0, WEDDING.targetDate.getTime() - Date.now());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);

  document.querySelector('[data-unit="d"]').textContent = String(d).padStart(3, '0');
  document.querySelector('[data-unit="h"]').textContent = String(h).padStart(2, '0');
  document.querySelector('[data-unit="m"]').textContent = String(m).padStart(2, '0');
  document.querySelector('[data-unit="s"]').textContent = String(s).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ============================================
// ПОДЕЛИТЬСЯ
// ============================================
const shareBtn = document.getElementById('share-btn');
const shareText = document.getElementById('share-text');
const toast = document.getElementById('toast');

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

shareBtn.addEventListener('click', async () => {
  const url = window.location.href;
  const shareData = { title: WEDDING.shareTitle, text: WEDDING.shareText, url };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (_) { /* пользователь отменил */ }
  }

  try {
    await navigator.clipboard.writeText(url);
    shareText.textContent = 'Скопировано';
    showToast('Ссылка скопирована — можете отправить её гостям');
    setTimeout(() => (shareText.textContent = 'Поделиться приглашением'), 2500);
  } catch {
    showToast('Не удалось скопировать ссылку');
  }
});
