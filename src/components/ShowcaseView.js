import numberSystems from '../data/numberSystems.js';
import showcaseExamples from '../data/showcaseExamples.js';
import historicalContent from '../data/historicalContent.js';
import { verifyRoundTrip } from '../utils/verification.js';
import { renderSvgCord } from './quipuSvg.js';

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

function renderCordCompact(result) {
  return renderSvgCord(result, { compact: true });
}

function renderResult(system, result) {
  const sc = symbolClasses[system.color];

  if (system.renderMode === 'cord') {
    return renderCordCompact(result);
  }

  if (system.renderMode === 'vertical') {
    const items = [...result].reverse().map(sym =>
      `<div class="h-12 w-12 flex items-center justify-center border-2 rounded-lg text-xl ${sc}">${esc(sym)}</div>`
    ).join('');
    return `<div class="flex justify-center"><div class="space-y-1">${items}</div></div>`;
  }

  if (system.renderMode === 'grouped') {
    const groups = result.map(group => {
      const syms = group.map(sym =>
        `<div class="h-12 min-w-9 px-1.5 flex items-center justify-center border-2 rounded-lg text-xl ${sc}">${esc(sym)}</div>`
      ).join('');
      return `<div class="flex space-x-1">${syms}</div>`;
    }).join('');
    return `<div class="flex flex-col items-center space-y-2">${groups}</div>`;
  }

  const items = result.map(sym =>
    `<div class="h-12 min-w-10 px-2 flex items-center justify-center border-2 rounded-lg text-xl ${sc}">${esc(sym)}</div>`
  ).join('');
  return `<div class="flex flex-wrap justify-center gap-1.5">${items}</div>`;
}

function renderVerifyBadge(systemId, number) {
  const v = verifyRoundTrip(systemId, number);
  if (v.passed) {
    return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-crimson bg-green-100 text-green-700 border border-green-200" title="Round-trip verified: ${number} → ancient → ${v.parsed}">
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
      Verified</span>`;
  }
  return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-crimson bg-red-100 text-red-700 border border-red-200" title="Verification failed: ${v.error}">
    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
    Failed</span>`;
}

function renderExampleCard(systemId, system, example, index) {
  const { number, highlight } = example;
  const { result, steps } = system.convert(number);
  const ac = accentClasses[system.color];

  const stepsHtml = (steps && steps.length > 0)
    ? steps.map((step, i) => `
        <div class="flex items-center gap-3 px-3 py-1.5 bg-white/50 rounded-lg border border-stone-200">
          <span class="font-crimson text-stone-400 text-xs w-5 text-right">${i + 1}.</span>
          <span class="text-lg min-w-7 text-center">${esc(step.symbol)}</span>
          <span class="font-crimson text-stone-600 text-sm">${esc(step.explanation)}</span>
        </div>`).join('')
    : '';

  return `
    <div class="p-5 rounded-xl border-2 ${ac} space-y-3 showcase-card print-avoid-break">
      <div class="flex items-start justify-between gap-3">
        <div>
          <span class="font-cinzel text-lg text-stone-800">${number.toLocaleString()}</span>
          <p class="font-crimson text-sm text-stone-500 italic">${esc(highlight)}</p>
        </div>
        ${renderVerifyBadge(systemId, number)}
      </div>
      <div class="py-2">${renderResult(system, result)}</div>
      ${stepsHtml ? `<div class="space-y-1.5">${stepsHtml}</div>` : ''}
    </div>`;
}

export function renderShowcaseView(systemId) {
  const system = numberSystems[systemId];
  if (!system) return '';

  const examples = showcaseExamples[systemId] || [];
  const content = historicalContent[systemId];

  const headerHtml = content ? `
    <div class="p-5 rounded-xl border-2 border-stone-300 bg-white/40 space-y-3 print-avoid-break">
      <h2 class="font-cinzel text-lg text-stone-800">${esc(system.name)} Numeral System</h2>
      <p class="font-crimson text-stone-600">${esc(content.overview)}</p>
      <div class="flex flex-wrap gap-3 text-xs font-crimson text-stone-500">
        <span class="px-2 py-1 bg-stone-100 rounded">${esc(system.era)}</span>
        <span class="px-2 py-1 bg-stone-100 rounded">${esc(system.region)}</span>
        <span class="px-2 py-1 bg-stone-100 rounded">Base ${system.base}</span>
        <span class="px-2 py-1 bg-stone-100 rounded">Range: ${system.range[0].toLocaleString()} – ${system.range[1].toLocaleString()}</span>
      </div>
    </div>` : '';

  const cardsHtml = examples.map((ex, i) => renderExampleCard(systemId, system, ex, i)).join('');

  const allVerified = examples.every(ex => verifyRoundTrip(systemId, ex.number).passed);
  const summaryBadge = allVerified
    ? `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-crimson bg-green-100 text-green-700 border border-green-200">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
        All ${examples.length} examples verified</span>`
    : `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-crimson bg-red-100 text-red-700 border border-red-200">
        Some verifications failed</span>`;

  return `
    <div class="space-y-5" id="showcase-view">
      ${headerHtml}
      <div class="flex items-center justify-between flex-wrap gap-3">
        ${summaryBadge}
        <div class="flex gap-2">
          <button data-action="showcase-print"
            class="px-4 py-2 bg-stone-200 text-stone-700 font-cinzel text-sm rounded-lg
              hover:bg-stone-300 transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Print
          </button>
          <button data-action="showcase-copy"
            class="px-4 py-2 bg-stone-200 text-stone-700 font-cinzel text-sm rounded-lg
              hover:bg-stone-300 transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
            Copy as Text
          </button>
        </div>
      </div>
      <div class="space-y-4">${cardsHtml}</div>
    </div>`;
}

/**
 * Serialize showcase to plain text for clipboard.
 */
export function serializeShowcase(systemId) {
  const system = numberSystems[systemId];
  if (!system) return '';

  const examples = showcaseExamples[systemId] || [];
  const content = historicalContent[systemId];
  const lines = [];

  lines.push(`${'='.repeat(50)}`);
  lines.push(`${system.name} Numeral System — Showcase`);
  lines.push(`${system.era} · ${system.region} · Base ${system.base}`);
  lines.push(`Range: ${system.range[0].toLocaleString()} – ${system.range[1].toLocaleString()}`);
  lines.push(`${'='.repeat(50)}`);

  if (content) {
    lines.push('');
    lines.push(content.overview);
  }

  for (const ex of examples) {
    lines.push('');
    lines.push(`--- ${ex.number.toLocaleString()} ---`);
    lines.push(ex.highlight);

    const { result, steps } = system.convert(ex.number);
    // Flatten result to text
    const resultText = Array.isArray(result[0])
      ? result.map(g => g.join('')).join(' | ')
      : result.join(' ');
    lines.push(`Result: ${resultText}`);

    if (steps && steps.length > 0) {
      lines.push('Steps:');
      for (const step of steps) {
        lines.push(`  ${step.symbol}  ${step.explanation}`);
      }
    }

    const v = verifyRoundTrip(systemId, ex.number);
    lines.push(v.passed ? `[VERIFIED] Round-trip: ${ex.number} → ${resultText} → ${v.parsed}` : `[FAILED] ${v.error}`);
  }

  lines.push('');
  lines.push('Generated by Ancient Number Converter');
  return lines.join('\n');
}
