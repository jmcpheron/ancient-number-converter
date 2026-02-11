import { getState, setState, subscribe } from './store.js';
import { renderHeader } from './components/Header.js';
import { renderNumberInput } from './components/NumberInput.js';
import { renderSystemTabs } from './components/SystemTabs.js';
import { renderConversionDisplay } from './components/ConversionDisplay.js';
import { renderComparisonView } from './components/ComparisonView.js';
import { renderStepBreakdown } from './components/StepBreakdown.js';
import { renderLegend } from './components/Legend.js';
import { renderHistoryPanel } from './components/HistoryPanel.js';
import { renderReverseInput, handleReverseEvent, resetReverseState } from './components/ReverseInput.js';
import { renderQuizView, handleQuizEvent, initQuiz, cleanupQuiz } from './components/QuizView.js';
import { renderShowcaseView, serializeShowcase } from './components/ShowcaseView.js';
import numberSystems from './data/numberSystems.js';

const root = () => document.getElementById('root');

function renderSkeleton() {
  const s = getState();
  const navBtnCls = (active) => active
    ? 'bg-stone-700 text-parchment-light shadow-md'
    : 'bg-stone-200 text-stone-600 hover:bg-stone-300';

  const isConverter = !s.showQuiz && !s.showShowcase;

  return `
    <div class="min-h-screen bg-gradient-to-b from-parchment to-parchment-dark">
      <div class="max-w-6xl mx-auto px-4 pb-12">
        ${renderHeader()}
        <div class="flex justify-center gap-3 mb-6">
          <button data-action="mode-converter"
            class="px-6 py-2 font-cinzel text-sm rounded-lg transition-colors ${navBtnCls(isConverter)}">Converter</button>
          <button data-action="mode-showcase"
            class="px-6 py-2 font-cinzel text-sm rounded-lg transition-colors ${navBtnCls(s.showShowcase)}">Showcase</button>
          <button data-action="mode-quiz"
            class="px-6 py-2 font-cinzel text-sm rounded-lg transition-colors ${navBtnCls(s.showQuiz)}">Quiz</button>
        </div>
        <div id="main-area"></div>
        <footer class="text-center mt-12 py-6 border-t border-stone-300 space-y-2">
          <p class="font-crimson text-sm text-stone-400">
            Ancient Number Converter — Exploring mathematics across civilizations
          </p>
          <p class="font-crimson text-xs text-stone-400">
            <a href="https://github.com/jmcpheron/ancient-number-converter" target="_blank" rel="noopener noreferrer"
              class="underline hover:text-stone-600 transition-colors">View on GitHub</a>
            <span class="mx-2">·</span>
            Last updated ${__BUILD_DATE__}
          </p>
        </footer>
      </div>
    </div>`;
}

function renderMainArea() {
  const s = getState();
  const mainArea = document.getElementById('main-area');
  if (!mainArea) return;

  if (s.showQuiz) {
    initQuiz(renderMainArea);
    mainArea.innerHTML = renderQuizView();
    focusQuizInput();
    return;
  }

  cleanupQuiz();

  if (s.showShowcase) {
    mainArea.innerHTML = `
      <div class="space-y-6">
        <div id="tabs-container">${renderSystemTabs(s.activeTab, false)}</div>
        <div id="display-area">${renderShowcaseView(s.activeTab)}</div>
      </div>`;
    return;
  }

  const reverseBtn = !s.showCompare ? `
    <div class="flex justify-end">
      <button data-action="toggle-reverse"
        class="px-4 py-1.5 font-crimson text-sm rounded-lg border transition-colors ${
          s.reverseMode
            ? 'bg-stone-700 text-parchment-light border-stone-700'
            : 'bg-white/40 text-stone-600 border-stone-300 hover:bg-stone-100'
        }">
        ${s.reverseMode ? '\u2190 Back to Decimal \u2192 Ancient' : 'Reverse: Ancient \u2192 Decimal'}
      </button>
    </div>` : '';

  let displayArea;
  if (s.reverseMode) {
    displayArea = renderReverseInput(s.activeTab, handleReverseResult);
  } else if (s.showCompare) {
    displayArea = renderComparisonView(s.number);
  } else {
    displayArea = `
      <div id="conversion-display">${renderConversionDisplay(s.activeTab, s.number)}</div>
      <div id="step-container">${renderStepBreakdown(s.activeTab, s.number)}</div>
      <div id="legend-container">${renderLegend(s.activeTab)}</div>
      <div id="history-container">${renderHistoryPanel(s.activeTab)}</div>`;
  }

  mainArea.innerHTML = `
    <div class="space-y-6">
      ${!s.reverseMode ? `<div id="number-input-container">${renderNumberInput(s.number, s.activeTab)}</div>` : ''}
      <div id="tabs-container">${renderSystemTabs(s.activeTab, s.showCompare)}</div>
      ${reverseBtn}
      <div id="display-area">${displayArea}</div>
    </div>`;

  syncInputValue();
}

function syncInputValue() {
  const s = getState();
  const input = document.getElementById('number-input');
  if (input) input.value = s.number;
  const slider = document.getElementById('number-slider');
  if (slider) {
    const system = numberSystems[s.activeTab];
    const [min, max] = system ? system.range : [0, 9999999];
    const num = parseInt(s.number, 10);
    slider.value = isNaN(num) ? min : Math.max(min, Math.min(num, Math.min(max, 9999)));
  }
}

function updateDisplay() {
  const s = getState();
  if (s.showQuiz || s.showShowcase || s.reverseMode || s.showCompare) return;

  const convEl = document.getElementById('conversion-display');
  if (convEl) convEl.innerHTML = renderConversionDisplay(s.activeTab, s.number);

  const stepEl = document.getElementById('step-container');
  if (stepEl) stepEl.innerHTML = renderStepBreakdown(s.activeTab, s.number);
}

function handleReverseResult(value) {
  setState({ number: value });
}

function focusQuizInput() {
  const input = document.getElementById('quiz-guess');
  if (input) input.focus();
}

// Toggle panel helper (steps, legend, history)
function togglePanel(name) {
  const panel = document.querySelector(`[data-panel="${name}"]`);
  const arrow = document.querySelector(`[data-arrow="${name}"]`);
  const label = document.querySelector(`[data-label="${name}"]`);
  if (!panel) return;

  const isOpen = !panel.classList.contains('hidden');
  panel.classList.toggle('hidden');
  if (arrow) arrow.style.transform = isOpen ? '' : 'rotate(90deg)';
  if (label) label.textContent = isOpen ? 'Show' : 'Hide';
}

// --- Event delegation ---
function handleClick(e) {
  const target = e.target;
  const s = getState();

  // Mode switching
  if (target.closest('[data-action="mode-converter"]')) {
    setState({ showQuiz: false, showShowcase: false });
    return;
  }
  if (target.closest('[data-action="mode-quiz"]')) {
    setState({ showQuiz: true, showShowcase: false });
    return;
  }
  if (target.closest('[data-action="mode-showcase"]')) {
    setState({ showShowcase: true, showQuiz: false });
    return;
  }

  // Tab switching
  const tabBtn = target.closest('[data-tab]');
  if (tabBtn) {
    setState({ activeTab: tabBtn.dataset.tab, showCompare: false, reverseMode: false });
    resetReverseState();
    return;
  }

  // Compare toggle
  if (target.closest('[data-action="toggle-compare"]')) {
    setState({ showCompare: !s.showCompare, reverseMode: false });
    return;
  }

  // Reverse mode toggle
  if (target.closest('[data-action="toggle-reverse"]')) {
    setState({ reverseMode: !s.reverseMode });
    resetReverseState();
    return;
  }

  // Random number and system
  if (target.closest('[data-action="random"]')) {
    const systemIds = Object.keys(numberSystems);
    const randomTab = systemIds[Math.floor(Math.random() * systemIds.length)];
    const system = numberSystems[randomTab];
    const [min, max] = system.range;
    const randomNum = Math.floor(Math.random() * (Math.min(max, 9999) - min + 1)) + min;
    setState({ activeTab: randomTab, number: String(randomNum) });
    return;
  }

  // Toggle panels
  if (target.closest('[data-action="toggle-steps"]')) { togglePanel('steps'); return; }
  if (target.closest('[data-action="toggle-legend"]')) { togglePanel('legend'); return; }
  if (target.closest('[data-action="toggle-history"]')) { togglePanel('history'); return; }

  // --- Showcase actions ---
  if (target.closest('[data-action="showcase-print"]')) {
    window.print();
    return;
  }
  if (target.closest('[data-action="showcase-copy"]')) {
    const text = serializeShowcase(s.activeTab);
    navigator.clipboard.writeText(text).then(() => {
      const btn = target.closest('[data-action="showcase-copy"]');
      if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Copied!';
        setTimeout(() => { btn.innerHTML = original; }, 2000);
      }
    });
    return;
  }

  // Reverse input events
  if (s.reverseMode) {
    const needsRerender = handleReverseEvent(target, s.activeTab, handleReverseResult);
    if (needsRerender) renderMainArea();
    return;
  }

  // Quiz events
  if (s.showQuiz) {
    const needsRerender = handleQuizEvent(target);
    if (needsRerender) {
      renderMainArea();
    }
    return;
  }
}

function handleInput(e) {
  const target = e.target;
  const s = getState();

  // Number input
  if (target.id === 'number-input') {
    setState({ number: target.value });
    return;
  }

  // Slider
  if (target.id === 'number-slider') {
    setState({ number: target.value });
    return;
  }

  // Reverse text input
  if (target.id === 'reverse-text-input') {
    handleReverseEvent(target, s.activeTab, handleReverseResult);
    return;
  }

  // Quiz guess
  if (target.id === 'quiz-guess') {
    handleQuizEvent(target);
    return;
  }

  // Quiz timed checkbox
  if (target.id === 'quiz-timed') {
    handleQuizEvent(target);
    renderMainArea();
    return;
  }
}

function handleKeydown(e) {
  if (e.key === 'Enter' && e.target.id === 'quiz-guess') {
    const needsRerender = handleQuizEvent(
      document.querySelector('[data-action="quiz-submit"]') || e.target
    );
    if (needsRerender) renderMainArea();
  }
}

// --- Store subscriptions ---
subscribe((state, prev) => {
  // Full re-render for structural changes
  if (state.showQuiz !== prev.showQuiz ||
      state.showShowcase !== prev.showShowcase ||
      state.activeTab !== prev.activeTab ||
      state.showCompare !== prev.showCompare ||
      state.reverseMode !== prev.reverseMode) {
    renderMainArea();
    return;
  }

  // Scoped update for number changes
  if (state.number !== prev.number) {
    updateDisplay();
    syncInputValue();

    // Also update comparison view if active
    if (state.showCompare) {
      renderMainArea();
    }
  }
});

export function renderApp() {
  root().innerHTML = renderSkeleton();
  renderMainArea();

  // Attach event listeners
  root().addEventListener('click', handleClick);
  root().addEventListener('input', handleInput);
  root().addEventListener('change', handleInput);
  root().addEventListener('keydown', handleKeydown);
}
