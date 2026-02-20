import { renderVolumePage, renderLevelPieces, renderReadoutTotal, renderReadoutVolume, renderControls, renderTooLoudOverlay } from './volume-render.js';
import { getRandomTagline, getDangerLevel, triggerShake, triggerConfetti, getMeterGradient, getGlowShadow } from './volume-effects.js';
import { initAudio, play, stop, setVolume } from './volume-audio.js';
import { decompose } from './volume-render.js';

// ── Constants ──────────────────────────────────
const TAP_THRESHOLD = 10;   // px — finger must move more than this to start drag
const TAP_MAX_DURATION = 300; // ms — touches shorter than this are taps

// ── State ──────────────────────────────────────
let levels = [0, 0]; // [twenties, ones]
let isPlaying = false;
let soundType = 'drums';
let hasAutoStarted = false;
let confettiFired = false;
let overlayTimeout = null;
let draggedPiece = null;
let selectedPiece = null; // 'dot' | 'bar' | 'shell' | null
let isDraggingThumb = false;
let tagline = getRandomTagline();

// Touch DnD state
let touchClone = null;
let touchPiece = null;
let touchSourceEl = null;
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;

// ── Pure helpers (exported for testing) ────────
export function computeDecimal(lvls) {
  return lvls[0] * 20 + lvls[1];
}

export function computeVolume(lvls) {
  return Math.min(computeDecimal(lvls), 100);
}

export function decimalToLevels(decimal) {
  const clamped = Math.max(0, Math.min(100, Math.round(decimal)));
  return [Math.floor(clamped / 20), clamped % 20];
}

export function addToLevel(currentValue, piece) {
  if (piece === 'shell') return { value: 0, rejected: false };
  if (piece === 'dot') {
    if (currentValue >= 19) return { value: currentValue, rejected: true };
    return { value: currentValue + 1, rejected: false };
  }
  if (piece === 'bar') {
    if (currentValue > 14) return { value: currentValue, rejected: true };
    return { value: currentValue + 5, rejected: false };
  }
  return { value: currentValue, rejected: true };
}

// ── Scoped update ──────────────────────────────
function updateVolumeDisplay() {
  const decimal = computeDecimal(levels);
  const volume = computeVolume(levels);
  const danger = getDangerLevel(volume);
  const prevDanger = getDangerLevel(Math.min(computeDecimal([levels[0], Math.max(0, levels[1])]), 100));

  // Update level pieces
  for (let i = 0; i < 2; i++) {
    const piecesEl = document.getElementById(`level-pieces-${i}`);
    if (piecesEl) piecesEl.innerHTML = renderLevelPieces(levels[i]);
    // Update the numeric display in the level header (ID-based lookup)
    const numSpan = document.getElementById(`level-value-${i}`);
    if (numSpan) numSpan.textContent = levels[i];
    // Toggle empty-pulse animation
    const zone = document.querySelector(`[data-level="${i}"]`);
    if (zone) zone.classList.toggle('vol-zone-empty', levels[i] === 0);
  }

  // Update meter (horizontal — width, not height)
  const meterFill = document.getElementById('vol-meter-fill');
  if (meterFill) {
    meterFill.style.width = `${Math.min(volume, 100)}%`;
    meterFill.style.backgroundImage = getMeterGradient(volume);
  }

  // Update meter container glow
  const meterContainer = document.getElementById('vol-meter-container');
  if (meterContainer) {
    meterContainer.style.boxShadow = getGlowShadow(volume);
  }

  // Sync thumb position (skip during drag — drag handler sets it directly)
  const thumb = document.getElementById('vol-meter-thumb');
  if (thumb && !isDraggingThumb) {
    thumb.style.left = `${Math.min(volume, 100)}%`;
  }

  // Update readout values
  const totalPatch = document.getElementById('vol-total-patch');
  if (totalPatch) totalPatch.innerHTML = renderReadoutTotal(decimal);
  const volPatch = document.getElementById('vol-volume-patch');
  if (volPatch) volPatch.innerHTML = renderReadoutVolume(volume, danger);

  // Update scroll percentage display
  const scrollPct = document.getElementById('vol-scroll-pct');
  if (scrollPct) scrollPct.textContent = volume + '%';

  // Update page background
  const page = document.getElementById('vol-page');
  if (page) {
    page.classList.remove('vol-bg', 'bg-red-100');
    page.classList.add(decimal > 100 ? 'bg-red-100' : 'vol-bg');
  }

  // Update audio volume
  setVolume(volume / 100);

  // TOO LOUD overlay — brief flash, then dismiss
  const existingOverlay = document.getElementById('vol-overlay');
  if (decimal > 100 && !existingOverlay) {
    // Stop audio immediately on overload
    stop();
    isPlaying = false;
    document.getElementById('vol-controls').innerHTML = renderControls(isPlaying, soundType);

    const root = document.getElementById('vol-root');
    root.insertAdjacentHTML('afterbegin', renderTooLoudOverlay());
    triggerShake(page);
    clearTimeout(overlayTimeout);
    overlayTimeout = setTimeout(dismissOverlay, 2000);
  } else if (decimal <= 100 && existingOverlay) {
    clearTimeout(overlayTimeout);
    existingOverlay.remove();
  }

  // Confetti at exactly 100 (fire once per crossing)
  if (decimal === 100 && !confettiFired) {
    const readout = document.getElementById('vol-readout')?.parentElement;
    if (readout) triggerConfetti(readout);
    confettiFired = true;
  } else if (decimal < 100) {
    confettiFired = false;
  }

  // Hot/overload vibration
  if (danger === 'hot' || danger === 'overload') {
    const page = document.getElementById('vol-page');
    if (page) triggerShake(page);
  }
}

// ── Tap-to-place selection ─────────────────────
function updatePaletteSelection() {
  const root = document.getElementById('vol-root');
  root.querySelectorAll('[data-piece]').forEach(el => {
    // Only toggle on palette tokens (not on zone remove buttons which also have data attrs)
    if (!el.closest('#vol-palette')) return;
    if (selectedPiece && el.dataset.piece === selectedPiece) {
      el.classList.add('vol-piece-selected');
    } else {
      el.classList.remove('vol-piece-selected');
    }
  });
  // Toggle target pulse on zones
  root.querySelectorAll('[data-level]').forEach(zone => {
    if (selectedPiece) {
      zone.classList.add('vol-zone-target');
    } else {
      zone.classList.remove('vol-zone-target');
    }
  });
}

// ── Overlay dismiss ────────────────────────────
function dismissOverlay() {
  clearTimeout(overlayTimeout);
  const overlay = document.getElementById('vol-overlay');
  if (overlay) overlay.remove();
  stop();
  isPlaying = false;
  document.getElementById('vol-controls').innerHTML = renderControls(isPlaying, soundType);
}

// ── Full render ────────────────────────────────
function renderFull() {
  const root = document.getElementById('vol-root');
  const decimal = computeDecimal(levels);
  const volume = computeVolume(levels);
  const danger = getDangerLevel(volume);
  root.innerHTML = renderVolumePage(levels, isPlaying, soundType, tagline, decimal, volume, danger);
}

// ── Drag-and-drop helpers ──────────────────────
function findDropZone(el) {
  return el?.closest?.('[data-level]');
}

function getLevelIndex(zone) {
  return parseInt(zone.dataset.level, 10);
}

function canAdd(levelIdx, piece) {
  const { rejected } = addToLevel(levels[levelIdx], piece);
  return !rejected;
}

// ── Event delegation ───────────────────────────
function setupEvents() {
  const root = document.getElementById('vol-root');

  // Desktop DnD
  root.addEventListener('dragstart', (e) => {
    const token = e.target.closest('[data-piece]');
    if (!token) return;
    draggedPiece = token.dataset.piece;
    e.dataTransfer.setData('text/plain', draggedPiece);
    e.dataTransfer.effectAllowed = 'copy';
    token.classList.add('vol-dragging');
    // Clear tap selection — drag takes over
    selectedPiece = null;
    updatePaletteSelection();
  });

  root.addEventListener('dragend', (e) => {
    draggedPiece = null;
    const token = e.target.closest('[data-piece]');
    if (token) token.classList.remove('vol-dragging');
    // Remove all highlights
    root.querySelectorAll('.vol-drop-active, .vol-drop-reject').forEach((el) => {
      el.classList.remove('vol-drop-active', 'vol-drop-reject');
    });
  });

  root.addEventListener('dragover', (e) => {
    const zone = findDropZone(e.target);
    if (!zone || !draggedPiece) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    const idx = getLevelIndex(zone);
    // Clear other zones
    root.querySelectorAll('.vol-drop-active, .vol-drop-reject').forEach((el) => {
      el.classList.remove('vol-drop-active', 'vol-drop-reject');
    });
    zone.classList.add(canAdd(idx, draggedPiece) ? 'vol-drop-active' : 'vol-drop-reject');
  });

  root.addEventListener('dragleave', (e) => {
    const zone = findDropZone(e.target);
    if (zone) zone.classList.remove('vol-drop-active', 'vol-drop-reject');
  });

  root.addEventListener('drop', (e) => {
    e.preventDefault();
    const zone = findDropZone(e.target);
    if (!zone) return;
    const piece = e.dataTransfer.getData('text/plain') || draggedPiece;
    if (!piece) return;
    zone.classList.remove('vol-drop-active', 'vol-drop-reject');
    applyPiece(getLevelIndex(zone), piece);
  });

  // Touch: threshold-based tap vs. drag
  root.addEventListener('touchstart', (e) => {
    const token = e.target.closest('#vol-palette [data-piece]');
    if (!token) return;
    e.preventDefault();
    touchPiece = token.dataset.piece;
    touchSourceEl = token;
    touchClone = null; // don't create clone yet — wait for move threshold
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
  }, { passive: false });

  root.addEventListener('touchmove', (e) => {
    if (!touchPiece) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    // If we haven't created a clone yet, check threshold
    if (!touchClone) {
      if (Math.sqrt(dx * dx + dy * dy) < TAP_THRESHOLD) return;
      // Past threshold — commit to drag mode, clear tap selection
      selectedPiece = null;
      updatePaletteSelection();
      touchClone = touchSourceEl.cloneNode(true);
      touchClone.className = 'fixed pointer-events-none z-50 opacity-80 scale-110';
      touchClone.style.transition = 'none';
      document.body.appendChild(touchClone);
    }

    e.preventDefault();
    touchClone.style.left = `${touch.clientX - 30}px`;
    touchClone.style.top = `${touch.clientY - 20}px`;

    // Highlight drop zone under finger
    const elUnder = document.elementFromPoint(touch.clientX, touch.clientY);
    root.querySelectorAll('.vol-drop-active, .vol-drop-reject').forEach((el) => {
      el.classList.remove('vol-drop-active', 'vol-drop-reject');
    });
    const zone = findDropZone(elUnder);
    if (zone && touchPiece) {
      const idx = getLevelIndex(zone);
      zone.classList.add(canAdd(idx, touchPiece) ? 'vol-drop-active' : 'vol-drop-reject');
    }
  }, { passive: false });

  root.addEventListener('touchend', (e) => {
    if (!touchPiece) return;

    // If clone was never created → this was a tap
    if (!touchClone && (Date.now() - touchStartTime) < TAP_MAX_DURATION) {
      const piece = touchPiece;
      touchPiece = null;
      touchSourceEl = null;
      selectedPiece = selectedPiece === piece ? null : piece;
      updatePaletteSelection();
      return;
    }

    // Otherwise — drop from drag
    if (touchClone) {
      const touch = e.changedTouches[0];
      const elUnder = document.elementFromPoint(touch.clientX, touch.clientY);
      const zone = findDropZone(elUnder);

      if (zone && touchPiece) {
        zone.classList.remove('vol-drop-active', 'vol-drop-reject');
        applyPiece(getLevelIndex(zone), touchPiece);
      }

      touchClone.remove();
    }

    touchClone = null;
    touchPiece = null;
    touchSourceEl = null;
    root.querySelectorAll('.vol-drop-active, .vol-drop-reject').forEach((el) => {
      el.classList.remove('vol-drop-active', 'vol-drop-reject');
    });
  });

  // Click: tap-to-place + remove pieces + controls
  root.addEventListener('click', (e) => {
    // Palette tap → toggle selected piece
    const palettePiece = e.target.closest('#vol-palette [data-piece]');
    if (palettePiece) {
      const piece = palettePiece.dataset.piece;
      selectedPiece = selectedPiece === piece ? null : piece;
      updatePaletteSelection();
      return;
    }

    // Zone tap → place selected piece (but not if clicking a remove button)
    const zone = e.target.closest('[data-level]');
    if (zone && selectedPiece && !e.target.closest('[data-remove]')) {
      applyPiece(getLevelIndex(zone), selectedPiece);
      return;
    }

    // Dismiss TOO LOUD overlay
    if (e.target.closest('[data-action="dismiss-overlay"]')) {
      dismissOverlay();
      return;
    }

    // Remove dot/bar
    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) {
      const zone = findDropZone(removeBtn);
      if (!zone) return;
      const idx = getLevelIndex(zone);
      const type = removeBtn.dataset.remove;
      const decrement = type === 'bar' ? 5 : 1;
      levels[idx] = Math.max(0, levels[idx] - decrement);
      updateVolumeDisplay();
      return;
    }

    // Play/pause
    if (e.target.closest('[data-action="play-pause"]')) {
      initAudio();
      isPlaying = !isPlaying;
      if (isPlaying) {
        play(soundType);
        setVolume(computeVolume(levels) / 100);
      } else {
        stop();
      }
      document.getElementById('vol-controls').innerHTML = renderControls(isPlaying, soundType);
      return;
    }

    // Sound type switch
    const typeBtn = e.target.closest('[data-action="sound-type"]');
    if (typeBtn) {
      soundType = typeBtn.dataset.type;
      if (isPlaying) {
        play(soundType);
        setVolume(computeVolume(levels) / 100);
      }
      document.getElementById('vol-controls').innerHTML = renderControls(isPlaying, soundType);
      return;
    }
  });

  // ── Meter thumb drag ──────────────────────────
  function applySliderPosition(clientX) {
    const container = document.getElementById('vol-meter-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const decimal = Math.round(pct);
    levels = decimalToLevels(decimal);
    // Move thumb immediately (no transition during drag)
    const thumb = document.getElementById('vol-meter-thumb');
    if (thumb) {
      thumb.style.transition = 'none';
      thumb.style.left = `${pct}%`;
    }
    updateVolumeDisplay();
    // Autoplay on first interaction
    if (!hasAutoStarted && decimal > 0) {
      initAudio(); play(soundType);
      setVolume(computeVolume(levels) / 100);
      isPlaying = true; hasAutoStarted = true;
      document.getElementById('vol-controls').innerHTML = renderControls(isPlaying, soundType);
    }
    // Rotate tagline occasionally
    if (Math.random() < 0.3) {
      tagline = getRandomTagline();
      const taglineEl = document.getElementById('vol-tagline');
      if (taglineEl) taglineEl.textContent = tagline;
    }
  }

  function startThumbDrag(e, clientX) {
    isDraggingThumb = true;
    const thumb = document.getElementById('vol-meter-thumb');
    if (thumb) thumb.classList.add('vol-thumb-dragging');
    applySliderPosition(clientX);
    e.preventDefault();
  }

  function stopThumbDrag() {
    if (!isDraggingThumb) return;
    isDraggingThumb = false;
    const thumb = document.getElementById('vol-meter-thumb');
    if (thumb) {
      thumb.classList.remove('vol-thumb-dragging');
      thumb.style.transition = '';
    }
  }

  // Mouse: down on track/thumb, move+up on document
  root.addEventListener('mousedown', (e) => {
    const container = document.getElementById('vol-meter-container');
    if (!container?.contains(e.target)) return;
    startThumbDrag(e, e.clientX);
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDraggingThumb) return;
    applySliderPosition(e.clientX);
  });

  document.addEventListener('mouseup', stopThumbDrag);

  // Touch: start on track/thumb, move+end on document
  root.addEventListener('touchstart', (e) => {
    const container = document.getElementById('vol-meter-container');
    if (!container?.contains(e.target)) return;
    startThumbDrag(e, e.touches[0].clientX);
  }, { passive: false });

  document.addEventListener('touchmove', (e) => {
    if (!isDraggingThumb) return;
    applySliderPosition(e.touches[0].clientX);
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchend', stopThumbDrag);
}

function applyPiece(levelIdx, piece) {
  const { value, rejected } = addToLevel(levels[levelIdx], piece);
  if (rejected) {
    const zone = document.querySelector(`[data-level="${levelIdx}"]`);
    if (zone) triggerShake(zone);
    return;
  }
  levels[levelIdx] = value;
  updateVolumeDisplay();

  // Autoplay on first successful drop
  if (!hasAutoStarted) {
    initAudio();
    play(soundType);
    setVolume(computeVolume(levels) / 100);
    isPlaying = true;
    hasAutoStarted = true;
    document.getElementById('vol-controls').innerHTML = renderControls(isPlaying, soundType);
  }

  // Rotate tagline occasionally
  if (Math.random() < 0.3) {
    tagline = getRandomTagline();
    const taglineEl = document.getElementById('vol-tagline');
    if (taglineEl) taglineEl.textContent = tagline;
  }
}

// ── Init ───────────────────────────────────────
export function initVolumePage() {
  renderFull();
  setupEvents();
}
