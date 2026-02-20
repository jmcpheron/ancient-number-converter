import { getMeterGradient, getGlowShadow } from './volume-effects.js';

// ── Decompose value into bars/dots ──────────
export function decompose(value) {
  if (value === 0) return { bars: 0, dots: 0, isZero: true };
  return { bars: Math.floor(value / 5), dots: value % 5, isZero: false };
}

// ── Pieces inside a zone ────────────────────
function renderPieces(value) {
  const { bars, dots, isZero } = decompose(value);
  if (isZero) {
    return `<div class="flex flex-col items-center justify-center h-full gap-1">
      <svg class="w-7 h-7 text-stone-600 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 4v8m0 0l-3-3m3 3l3-3" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="4" y="14" width="16" height="6" rx="1" stroke-dasharray="3 2"/>
      </svg>
      <span class="text-[9px] text-stone-500 font-cinzel uppercase tracking-wider">Drop here</span>
    </div>`;
  }

  let html = '<div class="flex flex-col items-center gap-2 py-1 w-full">';

  if (dots > 0) {
    html += '<div class="flex gap-2 justify-center">';
    for (let i = 0; i < dots; i++) {
      html += `<button data-remove="dot"
                       class="group/piece relative w-7 h-7 rounded-full bg-jade shadow-md shadow-jade/30
                              hover:bg-jade-light hover:shadow-lg hover:shadow-jade/50
                              transition-all cursor-pointer border-2 border-jade-dark/50 active:scale-90"
                       title="Click to remove (\u22121)">
                 <span class="absolute inset-0 flex items-center justify-center text-sm font-bold
                              text-white opacity-0 group-hover/piece:opacity-100 transition-opacity">&times;</span>
               </button>`;
    }
    html += '</div>';
  }

  for (let i = 0; i < bars; i++) {
    html += `<button data-remove="bar"
                     class="group/piece relative h-5 rounded-md bg-amber-500 shadow-md shadow-amber-500/30
                            hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/50
                            transition-all cursor-pointer border-2 border-amber-400/50 active:scale-95"
                     style="width: 90%"
                     title="Click to remove (\u22125)">
               <span class="absolute inset-0 flex items-center justify-center text-xs font-bold
                            text-amber-950 opacity-0 group-hover/piece:opacity-100 transition-opacity">&times;</span>
             </button>`;
  }

  html += '</div>';
  return html;
}

// ── Controls (play + sound type) ────────────
export function renderControls(isPlaying, soundType) {
  const types = ['drums', 'jungle'];
  return `
    <div class="flex items-center justify-center gap-3">
      <button data-action="play-pause"
              class="w-10 h-10 rounded-full flex items-center justify-center transition-all
                     ${isPlaying
                       ? 'bg-jade text-white hover:bg-jade-dark vol-jade-glow'
                       : 'vol-ctrl-btn text-stone-300'}">
        ${isPlaying
          ? '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>'
          : '<svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'}
      </button>
      <div class="flex gap-1">
        ${types.map(t => `
          <button data-action="sound-type" data-type="${t}"
                  class="px-2.5 py-1 text-[9px] font-cinzel font-medium capitalize tracking-wider transition-all rounded
                         ${t === soundType
                           ? 'bg-jade/20 text-jade-light border border-jade/40'
                           : 'vol-ctrl-btn text-stone-400'}">
            ${t}
          </button>
        `).join('')}
      </div>
    </div>`;
}

// ── Too Loud overlay ────────────────────────
export function renderTooLoudOverlay() {
  return `
    <div id="vol-overlay"
         class="fixed inset-0 bg-red-900/90 flex items-center justify-center z-50 animate-pulse">
      <div class="text-center vol-shake">
        <div class="text-6xl md:text-8xl font-black text-red-200 tracking-widest">TOO LOUD</div>
        <div class="mt-4 text-2xl md:text-4xl animate-spin inline-block">&#x1D330;</div>
        <div class="mt-2 text-red-300 text-sm">The ancient gods of audio are displeased</div>
        <button data-action="dismiss-overlay"
                class="mt-6 px-4 py-2 bg-red-800 hover:bg-red-700 text-red-200 rounded-lg text-sm transition-colors">
          I'll turn it down
        </button>
      </div>
    </div>`;
}

// ── Readout renderers (used by scoped updates) ──
export function renderReadoutTotal(decimal) {
  const badge = decimal > 100
    ? `<span class="text-[8px] text-red-400 font-medium animate-pulse ml-1">EXCEEDS MAX</span>`
    : decimal === 100
      ? `<span class="text-[8px] text-jade-light font-medium ml-1">MAXIMUM</span>`
      : '';
  return `
    <div class="text-[9px] uppercase tracking-[0.15em] text-stone-500 font-cinzel mb-0.5">Total</div>
    <div class="flex items-center justify-center">
      <span id="vol-readout-total" class="font-mono text-2xl font-bold tabular-nums text-parchment">${decimal}</span>
      ${badge}
    </div>`;
}

export function renderReadoutVolume(volume, dangerLevel) {
  const colorClass = dangerLevel === 'overload'
    ? 'text-red-400'
    : dangerLevel === 'danger'
      ? 'text-orange-400'
      : dangerLevel === 'hot'
        ? 'text-amber-400'
        : 'text-parchment';
  return `
    <div class="text-[9px] uppercase tracking-[0.15em] text-stone-500 font-cinzel mb-0.5">Volume</div>
    <span id="vol-readout" class="font-mono text-2xl font-bold tabular-nums ${colorClass}">${volume}%</span>`;
}

// ── Full page composition ───────────────────
export function renderVolumePage(levels, isPlaying, soundType, tagline, decimal, volume, dangerLevel) {
  const showOverlay = dangerLevel === 'overload';
  const clamped = Math.min(volume, 100);
  const gradient = getMeterGradient(volume);
  const glow = getGlowShadow(volume);

  return `
    ${showOverlay ? renderTooLoudOverlay() : ''}
    <div class="min-h-screen vol-bg transition-colors duration-500 relative" id="vol-page">
      <div class="vol-sprite">

        <!-- Header -->
        <div class="vol-region flex-col" style="top:0.5%; left:0; width:100%; height:5.5%">
          <div class="w-full text-center px-4 relative">
            <a href="index.html"
               class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-lg hover:text-parchment transition-colors"
               title="Back to converter">&larr;</a>
            <h1 class="font-cinzel text-base font-bold text-parchment tracking-[0.15em] uppercase">
              <span class="text-jade opacity-60">&#9670;</span>
              Mayan Volume Control
              <span class="text-jade opacity-60">&#9670;</span>
            </h1>
          </div>
          <div class="vol-glyph-divider w-[90%] mt-1"></div>
        </div>

        <!-- Zone labels row -->
        <div class="vol-region" style="top:7%; left:2%; width:96%; height:3%">
          <div class="flex w-full justify-between items-center px-[2%]">
            <div class="flex items-center gap-1.5">
              <span class="font-cinzel text-[10px] uppercase tracking-widest text-stone-400 font-medium">Twenties</span>
              <span class="text-[9px] font-mono text-stone-600">\u00d720</span>
              <span class="text-[10px] font-mono text-stone-500">=</span>
              <span id="level-value-0" class="text-sm font-mono text-parchment font-bold tabular-nums">${levels[0]}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="font-cinzel text-[10px] uppercase tracking-widest text-stone-400 font-medium">Ones</span>
              <span class="text-[9px] font-mono text-stone-600">\u00d71</span>
              <span class="text-[10px] font-mono text-stone-500">=</span>
              <span id="level-value-1" class="text-sm font-mono text-parchment font-bold tabular-nums">${levels[1]}</span>
            </div>
          </div>
        </div>

        <!-- Zone: Twenties -->
        <div data-level="0"
             class="vol-region vol-zone-frame${levels[0] === 0 ? ' vol-zone-empty' : ''}"
             style="top:10.5%; left:3%; width:45%; height:24%">
          <span class="absolute inset-0 flex items-center justify-center text-7xl font-cinzel font-bold text-stone-600/[0.12] pointer-events-none select-none tracking-wider">&times;20</span>
          <div id="level-pieces-0" class="w-full h-full flex items-center justify-center relative">
            ${renderPieces(levels[0])}
          </div>
        </div>

        <!-- Zone: Ones -->
        <div data-level="1"
             class="vol-region vol-zone-frame${levels[1] === 0 ? ' vol-zone-empty' : ''}"
             style="top:10.5%; left:52%; width:45%; height:24%">
          <span class="absolute inset-0 flex items-center justify-center text-7xl font-cinzel font-bold text-stone-600/[0.12] pointer-events-none select-none tracking-wider">&times;1</span>
          <div id="level-pieces-1" class="w-full h-full flex items-center justify-center relative">
            ${renderPieces(levels[1])}
          </div>
        </div>

        <!-- Divider -->
        <div class="vol-region" style="top:36%; left:5%; width:90%; height:1%">
          <div class="vol-glyph-divider w-full"></div>
        </div>

        <!-- Palette header + buttons -->
        <div class="vol-region" style="top:37.5%; left:5%; width:90%; height:2%">
          <span class="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-cinzel font-semibold">Pieces</span>
        </div>
        <div id="vol-palette" class="vol-region" style="top:39.5%; left:5%; width:90%; height:8%">
          <div class="flex justify-center gap-3 w-full">
            <div draggable="true" data-piece="dot"
                 class="vol-ctrl-btn flex flex-col items-center gap-0.5 px-4 py-2
                        min-w-[60px] justify-center select-none">
              <span class="text-2xl text-jade">&bull;</span>
              <span class="text-[8px] text-stone-400 font-cinzel tracking-wider">Dot &middot; 1</span>
            </div>
            <div draggable="true" data-piece="bar"
                 class="vol-ctrl-btn flex flex-col items-center gap-0.5 px-4 py-2
                        min-w-[60px] justify-center select-none">
              <span class="text-2xl text-amber-400">&minus;</span>
              <span class="text-[8px] text-stone-400 font-cinzel tracking-wider">Bar &middot; 5</span>
            </div>
            <div draggable="true" data-piece="shell"
                 class="vol-ctrl-btn flex flex-col items-center gap-0.5 px-4 py-2
                        min-w-[60px] justify-center select-none">
              <span class="text-2xl text-stone-400">&#x1D330;</span>
              <span class="text-[8px] text-stone-400 font-cinzel tracking-wider">Shell &middot; 0</span>
            </div>
          </div>
        </div>
        <div class="vol-region text-center" style="top:48%; left:5%; width:90%; height:1.5%">
          <span class="text-stone-500 text-[9px] font-crimson">Tap a piece, then tap a zone</span>
        </div>

        <!-- Glyph divider -->
        <div class="vol-region" style="top:50.5%; left:5%; width:90%; height:1%">
          <div class="vol-glyph-divider w-full"></div>
        </div>

        <!-- Readouts -->
        <div class="vol-region" style="top:52.5%; left:5%; width:90%; height:12%">
          <div class="flex justify-center gap-3 w-full">
            <div id="vol-total-patch" class="vol-stone-panel px-4 py-2 text-center flex-1 max-w-[160px]">
              ${renderReadoutTotal(decimal)}
            </div>
            <div id="vol-volume-patch" class="vol-stone-panel px-4 py-2 text-center flex-1 max-w-[160px]">
              ${renderReadoutVolume(volume, dangerLevel)}
            </div>
          </div>
        </div>

        <!-- Volume meter -->
        <div class="vol-region flex-col" style="top:66%; left:5%; width:90%; height:5%">
          <div class="w-full vol-meter-track h-5 relative" id="vol-meter-container"
               style="box-shadow: inset 2px 2px 6px rgba(0,0,0,0.6), ${glow}">
            <div class="absolute left-0 top-0 h-full rounded-full transition-all duration-300 ease-out"
                 style="width: ${clamped}%; background-image: ${gradient}"
                 id="vol-meter-fill"></div>
            ${[20, 40, 60, 80].map(t => `
              <div class="absolute top-0 h-full" style="left:${t}%">
                <div class="w-px h-full bg-stone-700/40"></div>
              </div>
            `).join('')}
            <div id="vol-meter-thumb" class="vol-meter-thumb" style="left: ${clamped}%"></div>
          </div>
          <div class="flex justify-between w-full mt-0.5 px-0.5">
            ${[0, 20, 40, 60, 80, 100].map(t => `
              <span class="text-[8px] text-stone-600 font-mono">${t}</span>
            `).join('')}
          </div>
        </div>

        <!-- Divider -->
        <div class="vol-region" style="top:72.5%; left:5%; width:90%; height:1%">
          <div class="vol-glyph-divider w-full"></div>
        </div>

        <!-- Now Playing scroll area -->
        <div class="vol-region" style="top:74%; left:5%; width:90%; height:16%">
          <div class="vol-stone-panel w-full h-full px-4 py-3 flex flex-col items-center justify-center">
            <div class="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-cinzel mb-1">Now Playing At</div>
            <div id="vol-scroll-pct" class="font-mono text-3xl font-bold text-parchment mb-2">${volume}%</div>
            <div id="vol-controls">
              ${renderControls(isPlaying, soundType)}
            </div>
          </div>
        </div>

        <!-- Tagline -->
        <div class="vol-region" style="top:91.5%; left:5%; width:90%; height:3%">
          <p id="vol-tagline" class="text-[9px] text-stone-600 font-crimson italic tracking-wide text-center">
            ${tagline}
          </p>
        </div>

        <!-- Footer -->
        <div class="vol-region flex-col" style="top:94.5%; left:5%; width:90%; height:4%">
          <p class="text-stone-600 text-[8px] font-crimson text-center">No actual speakers were harmed. Audio capped at 100%.</p>
          <p class="text-stone-700 text-[7px] font-crimson text-center mt-0.5">Built with the Mayan vigesimal system &middot; A base-20 experiment</p>
        </div>

      </div><!-- /.vol-sprite -->
    </div>`;
}

export function getPageBgClass(dangerLevel) {
  if (dangerLevel === 'overload') return 'bg-red-100';
  return 'vol-bg';
}

// Scoped update renderers
export function renderLevelPieces(value) {
  return renderPieces(value);
}
