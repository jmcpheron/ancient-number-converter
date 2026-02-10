import numberSystems from '../data/numberSystems.js';
import { parseRoman } from '../converters/parsers/roman.js';
import { parseEgyptian } from '../converters/parsers/egyptian.js';
import { parseBabylonian } from '../converters/parsers/babylonian.js';
import { parseMayan } from '../converters/parsers/mayan.js';
import { parseChineseRod } from '../converters/parsers/chineseRod.js';
import { parseGreekAttic } from '../converters/parsers/greekAttic.js';
import { parseQuipu } from '../converters/parsers/quipu.js';
import { egyptianSymbols } from '../converters/egyptian.js';
import { babylonianSymbols } from '../converters/babylonian.js';
import { mayanSymbols } from '../converters/mayan.js';
import { verticalDigits, horizontalDigits } from '../converters/chineseRod.js';
import { quipuSymbols } from '../converters/quipu.js';

const parserConfigs = {
  roman: { parse: parseRoman, inputType: 'text' },
  greekAttic: { parse: parseGreekAttic, inputType: 'text' },
  egyptian: { parse: parseEgyptian, inputType: 'symbols' },
  babylonian: { parse: parseBabylonian, inputType: 'groups' },
  mayan: { parse: parseMayan, inputType: 'symbols' },
  chineseRod: { parse: parseChineseRod, inputType: 'symbols' },
  quipu: { parse: parseQuipu, inputType: 'symbols' },
};

const symbolKeyboards = {
  egyptian: Object.values(egyptianSymbols),
  babylonian: Object.values(babylonianSymbols),
  mayan: mayanSymbols.slice(0, 20),
  chineseRod: [
    ...Object.values(verticalDigits).filter(Boolean),
    ...Object.values(horizontalDigits).filter(Boolean),
    '\u3007'
  ],
  quipu: [
    quipuSymbols.zero,
    quipuSymbols.figureEight,
    ...Array.from({ length: 8 }, (_, i) => quipuSymbols.longKnot.repeat(i + 2)),
    ...Array.from({ length: 9 }, (_, i) => quipuSymbols.simpleKnot.repeat(i + 1)),
  ],
};

function esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Module-level local state
let localState = {
  textInput: '',
  symbolInput: [],
  groupInput: [[]],
  result: null,
};

export function resetReverseState() {
  localState = { textInput: '', symbolInput: [], groupInput: [[]], result: null };
}

export function renderReverseInput(systemId, onResultCallback) {
  const system = numberSystems[systemId];
  const parserConfig = parserConfigs[systemId];
  if (!system || !parserConfig) return '';

  const { textInput, symbolInput, groupInput, result } = localState;

  let inputArea;
  if (parserConfig.inputType === 'text') {
    inputArea = `
      <input type="text" id="reverse-text-input"
        value="${esc(textInput)}"
        placeholder="Enter ${esc(system.name)} numeral..."
        class="w-full px-4 py-3 bg-parchment-light/50 border-2 border-stone-300 rounded-lg
          font-cinzel text-lg text-stone-800 placeholder-stone-400
          focus:outline-none focus:ring-2 focus:ring-stone-400" />`;
  } else {
    // symbol/group display area
    let displayContent;
    if (parserConfig.inputType === 'groups') {
      displayContent = groupInput.map((group, gi) => {
        const sep = gi > 0 ? '<span class="text-stone-400 font-cinzel text-xs">|</span>' : '';
        const syms = group.map(sym => `<span class="text-2xl">${esc(sym)}</span>`).join('');
        return sep + syms;
      }).join('');
    } else {
      displayContent = symbolInput.map(sym => `<span class="text-2xl">${esc(sym)}</span>`).join('');
    }

    const isEmpty = parserConfig.inputType === 'groups'
      ? groupInput.flat().length === 0
      : symbolInput.length === 0;

    if (isEmpty) {
      displayContent = '<span class="font-crimson text-stone-400 italic">Click symbols below to build a number...</span>';
    }

    const keyboard = (symbolKeyboards[systemId] || []).map((sym, i) =>
      `<button data-symbol="${esc(sym)}" data-sym-index="${i}"
        class="h-10 min-w-10 px-2 border border-stone-300 rounded-lg bg-white/60
          hover:bg-stone-100 text-xl transition-colors">${esc(sym)}</button>`
    ).join('');

    const newGroupBtn = parserConfig.inputType === 'groups'
      ? `<button data-action="reverse-new-group"
          class="h-10 px-3 border border-stone-400 rounded-lg bg-stone-100
            hover:bg-stone-200 font-crimson text-sm text-stone-600 transition-colors">New Group</button>`
      : '';

    inputArea = `
      <div class="space-y-2">
        <div class="min-h-14 p-3 bg-parchment-light/50 border-2 border-stone-300 rounded-lg flex flex-wrap gap-2 items-center"
          id="reverse-display">${displayContent}</div>
        <div class="flex flex-wrap gap-2" id="reverse-keyboard">${keyboard}${newGroupBtn}</div>
      </div>`;
  }

  let resultHtml = '';
  if (result) {
    if (result.error) {
      resultHtml = `<p class="font-crimson text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">${esc(result.error)}</p>`;
    } else {
      resultHtml = `<p class="font-crimson text-lg text-stone-800 bg-green-50 px-3 py-2 rounded-lg border border-green-200">= <strong>${result.value.toLocaleString()}</strong></p>`;
    }
  }

  return `
    <div class="p-4 rounded-xl border-2 border-stone-300 bg-white/40 space-y-4" id="reverse-input">
      <div class="flex items-center justify-between">
        <h3 class="font-cinzel text-sm text-stone-600 uppercase tracking-wider">
          ${esc(system.name)} → Decimal
        </h3>
        <button data-action="reverse-clear" class="text-xs font-crimson text-stone-400 hover:text-stone-600">Clear</button>
      </div>
      ${inputArea}
      <div class="flex gap-3 items-center">
        <button data-action="reverse-convert"
          class="px-6 py-2 bg-stone-700 text-parchment-light font-cinzel text-sm
            rounded-lg hover:bg-stone-600 transition-colors shadow-md">Convert</button>
        <div class="flex-1" id="reverse-result">${resultHtml}</div>
      </div>
    </div>`;
}

// Event handler — call from app.js event delegation
export function handleReverseEvent(target, systemId, onResult) {
  const parserConfig = parserConfigs[systemId];
  if (!parserConfig) return false;

  // Text input change
  if (target.id === 'reverse-text-input') {
    localState.textInput = target.value;
    return false; // no re-render needed, input handles itself
  }

  // Symbol button click
  const sym = target.closest('[data-symbol]');
  if (sym) {
    const symbol = sym.dataset.symbol;
    if (parserConfig.inputType === 'groups') {
      localState.groupInput[localState.groupInput.length - 1].push(symbol);
    } else {
      localState.symbolInput.push(symbol);
    }
    return true; // re-render
  }

  // New group
  if (target.closest('[data-action="reverse-new-group"]')) {
    localState.groupInput.push([]);
    return true;
  }

  // Clear
  if (target.closest('[data-action="reverse-clear"]')) {
    resetReverseState();
    return true;
  }

  // Convert
  if (target.closest('[data-action="reverse-convert"]')) {
    let parsed;
    if (parserConfig.inputType === 'text') {
      parsed = parserConfig.parse(localState.textInput);
    } else if (parserConfig.inputType === 'groups') {
      parsed = parserConfig.parse(localState.groupInput);
    } else {
      parsed = parserConfig.parse(localState.symbolInput);
    }
    localState.result = parsed;
    if (parsed.value !== null && onResult) {
      onResult(String(parsed.value));
    }
    return true;
  }

  return false;
}
