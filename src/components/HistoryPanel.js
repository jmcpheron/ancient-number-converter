import numberSystems from '../data/numberSystems.js';
import historicalContent from '../data/historicalContent.js';

function esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function renderHistoryPanel(systemId) {
  const system = numberSystems[systemId];
  const content = historicalContent[systemId];
  if (!system || !content) return '';

  return `
    <div class="mt-4" id="history-panel">
      <button data-action="toggle-history"
        class="font-crimson text-sm text-stone-500 hover:text-stone-700 transition-colors flex items-center gap-1">
        <span class="transform transition-transform duration-200" data-arrow="history">&#9654;</span>
        <span data-label="history">Show</span> historical context
      </button>
      <div data-panel="history" class="hidden mt-3 p-5 border border-stone-300 rounded-xl bg-white/40 animate-fadeIn space-y-4">
        <div class="flex flex-wrap gap-3 text-xs font-cinzel">
          <span class="px-3 py-1 bg-stone-200 rounded-full text-stone-700">${esc(system.era)}</span>
          <span class="px-3 py-1 bg-stone-200 rounded-full text-stone-700">${esc(system.region)}</span>
          <span class="px-3 py-1 bg-stone-200 rounded-full text-stone-700">Base ${system.base}</span>
        </div>
        <p class="font-crimson text-stone-700 leading-relaxed">${esc(content.overview)}</p>
        <div>
          <h4 class="font-cinzel text-sm font-semibold text-stone-600 mb-2">Key Facts</h4>
          <ul class="space-y-1">
            ${content.facts.map(fact => `
              <li class="font-crimson text-sm text-stone-600 flex gap-2">
                <span class="text-stone-400 shrink-0">&#8226;</span>
                ${esc(fact)}
              </li>
            `).join('')}
          </ul>
        </div>
        <div>
          <h4 class="font-cinzel text-sm font-semibold text-stone-600 mb-1">Usage</h4>
          <p class="font-crimson text-sm text-stone-600">${esc(content.usage)}</p>
        </div>
        ${(content.sources && content.sources.length) ? `
          <div>
            <h4 class="font-cinzel text-sm font-semibold text-stone-600 mb-1">Sources</h4>
            <ul class="space-y-1">
              ${content.sources.map(source => `
                <li class="font-crimson text-sm">
                  <a href="${esc(source.url)}" target="_blank" rel="noopener" class="text-stone-700 underline-offset-2 hover:underline">
                    ${esc(source.title)}
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    </div>`;
}
