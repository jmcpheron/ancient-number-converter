import numberSystems from '../data/numberSystems.js';

function esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function renderStepBreakdown(systemId, number) {
  const system = numberSystems[systemId];
  if (!system) return '';

  const num = parseInt(number, 10);
  if (isNaN(num)) return '';

  const { steps } = system.convert(num);
  if (!steps || steps.length === 0) return '';

  return `
    <div class="mt-3" id="step-breakdown">
      <button data-action="toggle-steps"
        class="font-crimson text-sm text-stone-500 hover:text-stone-700 transition-colors flex items-center gap-1">
        <span class="transform transition-transform duration-200" data-arrow="steps">&#9654;</span>
        <span data-label="steps">Show</span> step-by-step breakdown
      </button>
      <div data-panel="steps" class="hidden mt-3 space-y-2">
        ${steps.map((step, index) => `
          <div class="flex items-center gap-3 px-4 py-2 bg-white/50 rounded-lg border border-stone-200
            animate-stepReveal" style="animation-delay: ${index * 100}ms">
            <span class="font-crimson text-stone-400 text-xs w-6 text-right">${index + 1}.</span>
            <span class="text-xl min-w-8 text-center">${esc(step.symbol)}</span>
            <span class="font-crimson text-stone-600 text-sm">${esc(step.explanation)}</span>
          </div>
        `).join('')}
        <div class="px-4 py-2 bg-stone-100 rounded-lg border border-stone-200 font-crimson text-stone-700 text-sm">
          Total: ${steps.reduce((sum, s) => sum + s.value, 0).toLocaleString()} = ${num.toLocaleString()}
        </div>
      </div>
    </div>`;
}
