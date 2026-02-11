import numberSystems from '../data/numberSystems.js';

const accentClasses = {
  jungle: 'border-jungle/30 bg-gradient-to-b from-green-50/50 to-green-100/30',
  amber: 'border-amber/30 bg-gradient-to-b from-amber-50/50 to-amber-100/30',
  clay: 'border-clay/30 bg-gradient-to-b from-yellow-50/50 to-yellow-100/30',
  imperial: 'border-imperial/30 bg-gradient-to-b from-purple-50/50 to-purple-100/30',
  vermilion: 'border-vermilion/30 bg-gradient-to-b from-red-50/50 to-red-100/30',
  mediterranean: 'border-mediterranean/30 bg-gradient-to-b from-blue-50/50 to-blue-100/30',
  inca: 'border-inca/30 bg-gradient-to-b from-orange-50/50 to-orange-100/30',
};

const symbolClasses = {
  jungle: 'border-jungle/40 bg-green-50',
  amber: 'border-amber/40 bg-amber-50',
  clay: 'border-clay/40 bg-yellow-50',
  imperial: 'border-imperial/40 bg-purple-50 font-cinzel text-purple-900',
  vermilion: 'border-vermilion/40 bg-red-50',
  mediterranean: 'border-mediterranean/40 bg-blue-50 font-cinzel text-blue-900',
  inca: 'border-inca/40 bg-orange-50',
};

function esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderCord(result) {
  const placeLabels = ['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands'];
  const displayed = [...result].reverse();
  const total = displayed.length;
  const cord = '<div class="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1.5 bg-inca/50"></div>';

  const rows = [];

  // Top: horizontal primary cord attachment
  rows.push(
    `<div class="relative w-44 h-5 flex justify-center items-center">
      ${cord}
      <div class="relative z-10 w-10 h-2 rounded-sm bg-inca/60"></div>
    </div>`);

  for (let i = 0; i < displayed.length; i++) {
    // Cord gap between positions
    rows.push(`<div class="relative w-44 h-4">${cord}</div>`);

    const sym = displayed[i];
    const posIdx = total - 1 - i;
    const label = placeLabels[posIdx] || '';
    const isZero = sym === '\u2014';

    if (isZero) {
      rows.push(
        `<div class="flex items-center">
          <div class="relative w-44 h-6 flex justify-center items-center">
            ${cord}
            <div class="relative z-10 w-5 border-t border-dashed border-inca/30"></div>
          </div>
          <span class="pl-3 font-crimson text-xs text-stone-400">${label}</span>
        </div>`);
    } else {
      const knots = [...sym];
      rows.push(
        `<div class="flex items-center">
          <div class="relative w-44 flex justify-center items-center py-1.5">
            ${cord}
            <div class="relative z-10 flex items-center text-lg text-stone-800 drop-shadow-sm">
              ${knots.map(k => `<span>${esc(k)}</span>`).join('')}
            </div>
          </div>
          <span class="pl-3 font-crimson text-xs text-stone-400">${label}</span>
        </div>`);
    }
  }

  // Bottom: cord tapers off
  rows.push(`<div class="relative w-44 h-5">${cord}</div>`);
  rows.push(
    `<div class="relative w-44 h-3">
      <div class="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-inca/30 rounded-b-full"></div>
    </div>`);

  return `<div class="flex justify-center"><div class="flex flex-col">${rows.join('')}</div></div>`;
}

function renderResult(system, result) {
  const sc = symbolClasses[system.color];

  if (system.renderMode === 'cord') {
    return renderCord(result);
  }

  if (system.renderMode === 'vertical') {
    const items = [...result].reverse().map(sym =>
      `<div class="h-14 w-14 flex items-center justify-center border-2 rounded-lg text-2xl ${sc} transition-all duration-300">${esc(sym)}</div>`
    ).join('');
    return `<div class="flex justify-center"><div class="space-y-2">${items}</div></div>`;
  }

  if (system.renderMode === 'grouped') {
    const groups = result.map(group => {
      const syms = group.map(sym =>
        `<div class="h-14 min-w-10 px-2 flex items-center justify-center border-2 rounded-lg text-2xl ${sc}">${esc(sym)}</div>`
      ).join('');
      return `<div class="flex space-x-1">${syms}</div>`;
    }).join('');
    return `<div class="flex flex-col items-center space-y-3">${groups}</div>`;
  }

  // text and horizontal modes
  const items = result.map(sym =>
    `<div class="h-14 min-w-12 px-3 flex items-center justify-center border-2 rounded-lg text-2xl ${sc} transition-all duration-300">${esc(sym)}</div>`
  ).join('');
  return `<div class="flex flex-wrap justify-center gap-2">${items}</div>`;
}

export function renderConversionDisplay(systemId, number) {
  const system = numberSystems[systemId];
  if (!system) return '';

  const num = parseInt(number, 10);
  const ac = accentClasses[system.color];

  if (isNaN(num)) {
    return `<div class="p-6 rounded-xl border-2 ${ac} text-center">
      <p class="font-crimson text-stone-400 italic text-lg">Enter a number to see its ancient representation</p>
    </div>`;
  }

  const { result } = system.convert(num);

  if (result[0] === 'Invalid input') {
    return `<div class="p-6 rounded-xl border-2 ${ac} text-center">
      <p class="font-crimson text-red-600">
        Number out of range for ${esc(system.name)} (${system.range[0].toLocaleString()} – ${system.range[1].toLocaleString()})
      </p>
    </div>`;
  }

  return `<div class="p-6 rounded-xl border-2 ${ac}">
    <div class="text-center mb-2">
      <span class="font-cinzel text-sm text-stone-500 uppercase tracking-wider">
        ${esc(system.name)} · ${esc(system.description)}
      </span>
    </div>
    ${renderResult(system, result)}
  </div>`;
}
