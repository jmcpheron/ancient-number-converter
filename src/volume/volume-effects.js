const TAGLINES = [
  'Vigesimal Audio Engineering',
  'Base-20 Precision Sound',
  'Pre-Columbian Noise Control',
  'Zero Latency (We Invented Zero)',
  'Now with 400% More Range Than You Need',
  'Enterprise-Grade Ancient Technology',
  'Mathematically Accurate Volume',
  'Approved by the Long Count Calendar Board',
  'Carbon-Dated Audio Fidelity',
  'Peer-Reviewed by Mesoamerican Scholars',
  'ISO 20:20 Compliant',
  'Not Responsible for Jaguar Summons',
];

let lastTaglineIndex = -1;

export function getRandomTagline() {
  let idx;
  do {
    idx = Math.floor(Math.random() * TAGLINES.length);
  } while (idx === lastTaglineIndex && TAGLINES.length > 1);
  lastTaglineIndex = idx;
  return TAGLINES[idx];
}

export function getDangerLevel(volume) {
  if (volume <= 50) return 'safe';
  if (volume <= 75) return 'warm';
  if (volume <= 99) return 'hot';
  if (volume === 100) return 'danger';
  return 'overload';
}

export function getBackgroundClasses(volume) {
  if (volume <= 100) return 'bg-gradient-to-b from-parchment to-parchment-dark';
  return 'bg-red-100';
}

export function getMeterGradient(volume) {
  if (volume <= 50) return 'linear-gradient(to top, #10b981, #34d399)';
  if (volume <= 75) return 'linear-gradient(to top, #f59e0b, #fbbf24)';
  if (volume <= 99) return 'linear-gradient(to top, #f97316, #ef4444)';
  return 'linear-gradient(to top, #dc2626, #f87171)';
}

export function getGlowShadow(volume) {
  if (volume <= 50) return '0 0 15px rgba(16, 185, 129, 0.2)';
  if (volume <= 75) return '0 0 15px rgba(245, 158, 11, 0.2)';
  if (volume <= 99) return '0 0 15px rgba(249, 115, 22, 0.3)';
  return '0 0 20px rgba(239, 68, 68, 0.4)';
}

export function triggerShake(el) {
  el.classList.add('vol-shake');
  setTimeout(() => el.classList.remove('vol-shake'), 500);
}

export function triggerConfetti(container) {
  // Ensure container traps absolute-positioned particles
  container.style.position = 'relative';
  container.style.overflow = 'hidden';

  const pieces = ['dot', 'bar'];
  for (let i = 0; i < 20; i++) {
    const span = document.createElement('span');
    const type = pieces[Math.floor(Math.random() * pieces.length)];
    span.textContent = type === 'dot' ? '\u2022' : '\u2500';
    span.className = 'vol-confetti';
    span.style.left = `${Math.random() * 100}%`;
    span.style.setProperty('--drift', `${(Math.random() - 0.5) * 200}px`);
    span.style.animationDuration = `${0.8 + Math.random() * 0.6}s`;
    span.style.fontSize = `${14 + Math.random() * 18}px`;
    span.style.color = type === 'dot' ? '#2D6A4F' : '#D4A017';
    container.appendChild(span);
    span.addEventListener('animationend', () => span.remove());
  }

  // Restore overflow after animations complete
  setTimeout(() => { container.style.overflow = ''; }, 2000);
}
