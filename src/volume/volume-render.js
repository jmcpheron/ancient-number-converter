import { getMeterGradient, getGlowShadow } from './volume-effects.js';

export function renderVolumeHeader(tagline) {
  return `
    <header class="text-center pt-8 pb-4">
      <a href="index.html"
         class="inline-block text-stone-500 text-sm hover:text-stone-700 transition-colors mb-4">
        &larr; Ancient Number Converter
      </a>
      <h1 class="font-cinzel text-3xl md:text-4xl font-bold text-stone-800 tracking-wide">
        Mayan Volume Control
      </h1>
      <p id="vol-tagline" class="text-sm text-stone-500 mt-1 font-crimson italic tracking-wide transition-all duration-300">
        ${tagline}
      </p>
    </header>`;
}

export function renderPalette() {
  return `
    <div id="vol-palette" class="flex flex-col items-center my-6">
      <div class="flex justify-center gap-4">
        <div class="bg-stone-200 border border-stone-300 rounded-xl px-3 sm:px-5 py-3 flex items-center gap-3 sm:gap-6 shadow-lg">
          <div draggable="true" data-piece="dot"
               class="flex items-center gap-2 cursor-pointer select-none
                      min-w-[44px] min-h-[44px] justify-center
                      px-3 py-1.5 rounded-lg hover:bg-stone-300 transition-all group">
            <span class="text-2xl text-jungle group-hover:scale-110 transition-transform">&bull;</span>
            <span class="text-xs text-stone-600 font-medium hidden sm:inline">Dot &middot; 1</span>
          </div>
          <div class="w-px h-8 bg-stone-400"></div>
          <div draggable="true" data-piece="bar"
               class="flex items-center gap-2 cursor-pointer select-none
                      min-w-[44px] min-h-[44px] justify-center
                      px-3 py-1.5 rounded-lg hover:bg-stone-300 transition-all group">
            <span class="text-2xl text-amber-400 group-hover:scale-110 transition-transform">&minus;</span>
            <span class="text-xs text-stone-600 font-medium hidden sm:inline">Bar &middot; 5</span>
          </div>
          <div class="w-px h-8 bg-stone-400"></div>
          <div draggable="true" data-piece="shell"
               class="flex items-center gap-2 cursor-pointer select-none
                      min-w-[44px] min-h-[44px] justify-center
                      px-3 py-1.5 rounded-lg hover:bg-stone-300 transition-all group">
            <span class="text-2xl text-stone-500 group-hover:scale-110 transition-transform">&#x1D330;</span>
            <span class="text-xs text-stone-600 font-medium hidden sm:inline">Shell &middot; 0</span>
          </div>
        </div>
      </div>
      <div class="text-center mt-2 text-stone-500 text-xs">
        Tap a piece, then tap a zone
      </div>
    </div>`;
}

export function decompose(value) {
  if (value === 0) return { bars: 0, dots: 0, isZero: true };
  return { bars: Math.floor(value / 5), dots: value % 5, isZero: false };
}

function renderPieces(value) {
  const { bars, dots, isZero } = decompose(value);
  if (isZero) {
    return `<div class="flex flex-col items-center justify-center h-full py-3 gap-1">
      <span class="text-3xl text-stone-400">&#x1D330;</span>
      <span class="text-[10px] text-stone-500 uppercase tracking-wider">Tap or drop pieces here</span>
    </div>`;
  }

  let html = '<div class="flex flex-col items-center gap-3 py-2">';

  // Dots on top (Mayan convention: dots above bars)
  if (dots > 0) {
    html += '<div class="flex gap-3 justify-center">';
    for (let i = 0; i < dots; i++) {
      html += `<button data-remove="dot"
                       class="group/piece relative w-8 h-8 rounded-full bg-jungle shadow-md shadow-jungle/30
                              hover:bg-emerald-600 hover:shadow-lg hover:shadow-jungle/50
                              transition-all cursor-pointer border-2 border-jungle/50 active:scale-90"
                       title="Click to remove (\u22121)">
                 <span class="absolute inset-0 flex items-center justify-center text-sm font-bold
                              text-white opacity-0 group-hover/piece:opacity-100 transition-opacity">&times;</span>
               </button>`;
    }
    html += '</div>';
  }

  // Bars below
  for (let i = 0; i < bars; i++) {
    html += `<button data-remove="bar"
                     class="group/piece relative h-6 rounded-md bg-amber-500 shadow-md shadow-amber-500/30
                            hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/50
                            transition-all cursor-pointer border-2 border-amber-400/50 active:scale-95"
                     style="width: min(85%, 160px)"
                     title="Click to remove (\u22125)">
               <span class="absolute inset-0 flex items-center justify-center text-xs font-bold
                            text-amber-950 opacity-0 group-hover/piece:opacity-100 transition-opacity">&times;</span>
             </button>`;
  }

  html += '</div>';
  return html;
}

export function renderLevel(position, value) {
  const label = position === 0 ? '\u00d720' : '\u00d71';
  const posLabel = position === 0 ? 'Twenties' : 'Ones';
  const emptyClass = value === 0 ? ' vol-zone-empty' : '';
  return `
    <div data-level="${position}"
         class="vol-drop-zone bg-stone-200/60 border-2 border-dashed border-stone-400 rounded-xl p-4 min-h-[130px]
                relative transition-all duration-200 shadow-md hover:border-stone-500${emptyClass}">
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-2">
          <span class="text-[10px] uppercase tracking-widest text-stone-500 font-medium">${posLabel}</span>
          <span class="text-xs font-mono text-stone-600 bg-stone-300/80 px-1.5 py-0.5 rounded">${label}</span>
        </div>
        <span class="text-sm font-mono text-stone-600 tabular-nums">${value}</span>
      </div>
      <div id="level-pieces-${position}">
        ${renderPieces(value)}
      </div>
    </div>`;
}

export function renderLevelStack(levels) {
  return `
    <div class="flex flex-col gap-3 w-full max-w-[280px]">
      ${renderLevel(0, levels[0])}
      <div class="flex justify-center">
        <div class="w-px h-3 bg-stone-400"></div>
      </div>
      ${renderLevel(1, levels[1])}
    </div>`;
}

export function renderVolumeMeter(percentage) {
  const clamped = Math.min(percentage, 100);
  const gradient = getMeterGradient(percentage);
  const glow = getGlowShadow(percentage);
  const ticks = [0, 20, 40, 60, 80, 100];

  return `
    <div class="flex flex-col items-center gap-2">
      <div class="relative h-64 w-10 bg-stone-300 rounded-full border border-stone-400 overflow-hidden"
           id="vol-meter-container" style="box-shadow: ${glow}">
        <div class="absolute bottom-0 w-full rounded-full transition-all duration-300 ease-out"
             style="height: ${clamped}%; background-image: ${gradient}" id="vol-meter-fill"></div>
        ${ticks.map(t => `
          <div class="absolute w-full flex items-center" style="bottom: ${t}%">
            <div class="w-2 h-px bg-stone-400"></div>
          </div>
        `).join('')}
      </div>
      <div class="flex flex-col items-center">
        ${ticks.reverse().map(t => `
          <span class="text-[9px] text-stone-500 leading-[25.6px]">${t}</span>
        `).join('')}
      </div>
    </div>`;
}

export function renderDecimalReadout(decimal, volume, dangerLevel) {
  const sizeClass = dangerLevel === 'overload'
    ? 'text-7xl md:text-8xl vol-shake'
    : dangerLevel === 'danger'
      ? 'text-6xl md:text-7xl'
      : 'text-5xl md:text-6xl';
  const colorClass = dangerLevel === 'overload'
    ? 'text-red-600'
    : dangerLevel === 'danger'
      ? 'text-orange-600'
      : dangerLevel === 'hot'
        ? 'text-amber-600'
        : 'text-stone-800';

  return `
    <div class="text-center">
      <div class="text-[10px] uppercase tracking-widest text-stone-500 mb-2 font-medium">Now Playing At</div>
      <div id="vol-readout" class="font-mono font-bold tabular-nums transition-all duration-300 ${sizeClass} ${colorClass}">
        ${volume}%
      </div>
      ${decimal !== volume ? `
        <div class="text-xs text-stone-500 mt-1 font-mono">
          Mayan value: ${decimal} <span class="text-stone-400">(capped at 100)</span>
        </div>` : ''}
      ${decimal > 100 ? `
        <div class="mt-2 inline-block px-3 py-1 bg-red-900/50 border border-red-800 rounded-full text-xs text-red-600 font-medium animate-pulse">
          EXCEEDS MAXIMUM
        </div>` : ''}
      ${decimal === 100 ? `
        <div class="mt-2 inline-block px-3 py-1 bg-jungle/20 border border-jungle rounded-full text-xs text-jungle font-medium">
          Maximum Vigesimal Output
        </div>` : ''}
    </div>`;
}

export function renderControls(isPlaying, soundType) {
  const types = ['tone', 'drums', 'jungle'];
  return `
    <div class="flex flex-col items-center gap-4">
      <button data-action="play-pause"
              class="w-14 h-14 rounded-full flex items-center justify-center transition-all
                     ${isPlaying
                       ? 'bg-stone-700 text-parchment-light hover:bg-stone-600 shadow-lg shadow-stone-700/20'
                       : 'bg-stone-200 text-stone-700 hover:bg-stone-300 border border-stone-300'}">
        ${isPlaying
          ? '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>'
          : '<svg class="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'}
      </button>
      <div class="flex rounded-lg overflow-hidden border border-stone-300">
        ${types.map(t => `
          <button data-action="sound-type" data-type="${t}"
                  class="px-3 py-1.5 text-xs font-medium capitalize transition-colors
                         ${t === soundType
                           ? 'bg-stone-700 text-parchment-light'
                           : 'bg-stone-200 text-stone-600 hover:text-stone-800'}">
            ${t}
          </button>
        `).join('')}
      </div>
    </div>`;
}

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

export function renderVolumePage(levels, isPlaying, soundType, tagline, decimal, volume, dangerLevel) {
  const showOverlay = dangerLevel === 'overload';
  return `
    ${showOverlay ? renderTooLoudOverlay() : ''}
    <div class="min-h-screen ${getPageBgClass(dangerLevel)} transition-colors duration-500 relative" id="vol-page">
      <div class="max-w-2xl mx-auto px-4 pb-12">
        ${renderVolumeHeader(tagline)}
        ${renderPalette()}

        <div class="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-6 sm:gap-8 md:gap-12">
          ${renderLevelStack(levels)}
          <div class="flex flex-col items-center gap-4">
            ${renderVolumeMeter(volume)}
            <div class="mt-2">
              ${renderDecimalReadout(decimal, volume, dangerLevel)}
            </div>
          </div>
        </div>

        <div class="mt-6 mb-6" id="vol-controls">
          ${renderControls(isPlaying, soundType)}
        </div>

        <footer class="mt-12 text-center text-stone-400 text-xs">
          <p>No actual speakers were harmed. Audio capped at 100%.</p>
          <p class="mt-1">Built with the Mayan vigesimal system &middot; A base-20 experiment</p>
        </footer>
      </div>
    </div>`;
}

function getPageBgClass(dangerLevel) {
  if (dangerLevel === 'overload') return 'bg-red-100';
  return 'bg-gradient-to-b from-parchment to-parchment-dark';
}

// Scoped update renderers (return HTML for just the changing parts)
export function renderLevelPieces(value) {
  return renderPieces(value);
}
