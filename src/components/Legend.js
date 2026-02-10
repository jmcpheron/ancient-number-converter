import numberSystems from '../data/numberSystems.js';
import { mayanSymbols } from '../converters/mayan.js';
import { egyptianSymbols, egyptianNames } from '../converters/egyptian.js';
import { babylonianSymbols } from '../converters/babylonian.js';
import { romanSymbols } from '../converters/roman.js';
import { verticalDigits, horizontalDigits } from '../converters/chineseRod.js';
import { atticSymbols } from '../converters/greekAttic.js';
import { quipuSymbols } from '../converters/quipu.js';

function esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderLegendContent(systemId) {
  switch (systemId) {
    case 'mayan':
      return `<div class="grid grid-cols-4 gap-2">
        ${mayanSymbols.map((symbol, index) => `
          <div class="flex items-center space-x-2">
            <div class="h-8 w-8 flex items-center justify-center border border-stone-300 rounded-md bg-white/50">${esc(symbol)}</div>
            <span class="font-crimson text-sm text-stone-600">${index}</span>
          </div>
        `).join('')}
      </div>`;

    case 'egyptian':
      return `<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        ${Object.entries(egyptianSymbols).map(([value, symbol]) => `
          <div class="flex items-center space-x-2 bg-white/30 p-2 rounded-lg">
            <div class="h-10 min-w-10 px-1 flex items-center justify-center border border-amber/30 rounded-md bg-amber-50/50 text-xl">${esc(symbol)}</div>
            <div>
              <span class="font-crimson text-sm text-stone-700 block">${Number(value).toLocaleString()}</span>
              <span class="font-crimson text-xs text-stone-400">${esc(egyptianNames[value])}</span>
            </div>
          </div>
        `).join('')}
      </div>`;

    case 'babylonian':
      return `<div class="space-y-3">
        <div class="grid grid-cols-2 gap-2">
          ${Object.entries(babylonianSymbols).map(([value, symbol]) => `
            <div class="flex items-center space-x-2 bg-white/30 p-2 rounded-lg">
              <div class="h-10 min-w-10 flex items-center justify-center border border-clay/30 rounded-md bg-yellow-50/50 text-xl">${esc(symbol)}</div>
              <span class="font-crimson text-sm text-stone-700">${esc(value)}</span>
            </div>
          `).join('')}
        </div>
        <p class="font-crimson text-sm text-stone-500">
          Base-60 positional system. Each group represents a power of 60: 1, 60, 3,600, 216,000.
        </p>
      </div>`;

    case 'roman':
      return `<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        ${romanSymbols.map(({ value, symbol }) => `
          <div class="flex items-center space-x-3 bg-purple-50/50 p-2 rounded-lg">
            <div class="h-10 min-w-10 px-2 flex items-center justify-center border-2 border-imperial/30 rounded-md font-cinzel text-lg text-purple-900 bg-yellow-50/30">${esc(symbol)}</div>
            <span class="font-crimson text-sm text-stone-700">${value.toLocaleString()}</span>
          </div>
        `).join('')}
      </div>`;

    case 'chineseRod':
      return `<div class="space-y-3">
        <div>
          <p class="font-crimson text-sm text-stone-500 mb-2">Zero (any place):</p>
          <div class="grid grid-cols-5 gap-2">
            <div class="flex items-center space-x-1 bg-white/30 p-1 rounded">
              <span class="text-xl">〇</span>
              <span class="font-crimson text-xs text-stone-500">=0</span>
            </div>
          </div>
        </div>
        <div>
          <p class="font-crimson text-sm text-stone-500 mb-2">Vertical (ones, hundreds, ten-thousands):</p>
          <div class="grid grid-cols-5 gap-2">
            ${Object.entries(verticalDigits).filter(([k]) => k !== '0').map(([value, symbol]) => `
              <div class="flex items-center space-x-1 bg-white/30 p-1 rounded">
                <span class="text-xl">${esc(symbol)}</span>
                <span class="font-crimson text-xs text-stone-500">=${esc(value)}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div>
          <p class="font-crimson text-sm text-stone-500 mb-2">Horizontal (tens, thousands):</p>
          <div class="grid grid-cols-5 gap-2">
            ${Object.entries(horizontalDigits).filter(([k]) => k !== '0').map(([value, symbol]) => `
              <div class="flex items-center space-x-1 bg-white/30 p-1 rounded">
                <span class="text-xl">${esc(symbol)}</span>
                <span class="font-crimson text-xs text-stone-500">=${esc(value)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>`;

    case 'greekAttic':
      return `<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        ${atticSymbols.map(({ value, symbol, name }) => `
          <div class="flex items-center space-x-2 bg-blue-50/30 p-2 rounded-lg">
            <div class="h-10 min-w-10 px-2 flex items-center justify-center border border-mediterranean/30 rounded-md font-cinzel text-lg text-blue-900 bg-blue-50/50">${esc(symbol)}</div>
            <div>
              <span class="font-crimson text-sm text-stone-700 block">${value.toLocaleString()}</span>
              <span class="font-crimson text-xs text-stone-400">${esc(name)}</span>
            </div>
          </div>
        `).join('')}
      </div>`;

    case 'quipu':
      return `<div class="space-y-3">
        <div>
          <p class="font-crimson text-sm text-stone-500 mb-2">Ones place:</p>
          <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
            <div class="flex items-center space-x-2 bg-white/30 p-2 rounded-lg">
              <div class="h-10 min-w-10 flex items-center justify-center border border-inca/30 rounded-md bg-orange-50/50 text-xl">${esc(quipuSymbols.figureEight)}</div>
              <span class="font-crimson text-sm text-stone-700">1</span>
            </div>
            ${[2,3,4,5,6,7,8,9].map(d => `
              <div class="flex items-center space-x-2 bg-white/30 p-2 rounded-lg">
                <div class="h-10 min-w-10 flex items-center justify-center border border-inca/30 rounded-md bg-orange-50/50 text-xl">${esc(quipuSymbols.longKnot.repeat(d))}</div>
                <span class="font-crimson text-sm text-stone-700">${d}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div>
          <p class="font-crimson text-sm text-stone-500 mb-2">Tens, hundreds, thousands (simple knots):</p>
          <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
            ${[1,2,3,4,5,6,7,8,9].map(d => `
              <div class="flex items-center space-x-2 bg-white/30 p-2 rounded-lg">
                <div class="h-10 min-w-10 flex items-center justify-center border border-inca/30 rounded-md bg-orange-50/50 text-xl">${esc(quipuSymbols.simpleKnot.repeat(d))}</div>
                <span class="font-crimson text-sm text-stone-700">${d}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div>
          <p class="font-crimson text-sm text-stone-500 mb-2">Zero (any place):</p>
          <div class="grid grid-cols-5 gap-2">
            <div class="flex items-center space-x-2 bg-white/30 p-1 rounded">
              <span class="text-xl">${esc(quipuSymbols.zero)}</span>
              <span class="font-crimson text-xs text-stone-500">=0</span>
            </div>
          </div>
        </div>
        <p class="font-crimson text-sm text-stone-500">
          Base-10 positional system read top to bottom. Each position on the cord represents a power of 10.
        </p>
      </div>`;

    default:
      return '';
  }
}

export function renderLegend(systemId) {
  const system = numberSystems[systemId];
  if (!system) return '';

  return `
    <div class="mt-4" id="legend">
      <button data-action="toggle-legend"
        class="w-full py-2 px-4 bg-stone-700 text-parchment-light font-cinzel text-sm
          rounded-lg shadow-md hover:bg-stone-600 transition-colors">
        <span data-label="legend">Show</span> Symbol Legend
      </button>
      <div data-panel="legend" class="hidden mt-3 p-4 border border-stone-300 rounded-xl bg-white/30 animate-fadeIn">
        <h3 class="font-cinzel font-semibold mb-3 text-stone-700">${esc(system.name)} Symbols</h3>
        ${renderLegendContent(systemId)}
      </div>
    </div>`;
}
