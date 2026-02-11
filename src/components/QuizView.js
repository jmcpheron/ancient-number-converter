import numberSystems, { systemIds } from '../data/numberSystems.js';
import { renderStepBreakdown } from './StepBreakdown.js';

function esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const difficulties = {
  easy: { label: 'Easy', range: [1, 50], systems: ['roman', 'egyptian'] },
  medium: { label: 'Medium', range: [1, 500], systems: systemIds },
  hard: { label: 'Hard', range: [1, 5000], systems: systemIds },
};

let quizState = {
  difficulty: 'easy',
  question: null,
  guess: '',
  revealed: false,
  correct: null,
  streak: 0,
  bestStreak: 0,
  totalCorrect: 0,
  totalAttempts: 0,
  timedMode: false,
  timeLeft: 30,
};

let timerId = null;
let rerenderFn = null;

function generateQuestion() {
  const diff = difficulties[quizState.difficulty];
  const [min, max] = diff.range;
  const num = Math.floor(Math.random() * (max - min + 1)) + min;

  let systemId;
  let tries = 0;
  do {
    systemId = diff.systems[Math.floor(Math.random() * diff.systems.length)];
    tries++;
  } while (
    tries < 20 &&
    (num < numberSystems[systemId].range[0] || num > numberSystems[systemId].range[1])
  );

  const system = numberSystems[systemId];
  const { result } = system.convert(num);

  quizState.question = { num, systemId, result, system };
  quizState.guess = '';
  quizState.revealed = false;
  quizState.correct = null;
  quizState.timeLeft = 30;

  startTimer();
}

function startTimer() {
  clearInterval(timerId);
  timerId = null;
  if (quizState.timedMode && quizState.question && !quizState.revealed) {
    timerId = setInterval(() => {
      quizState.timeLeft--;
      if (quizState.timeLeft <= 0) {
        quizState.timeLeft = 0;
        handleReveal();
      }
      // Update timer display without full re-render
      const timerEl = document.querySelector('[data-quiz-timer]');
      if (timerEl) {
        timerEl.textContent = quizState.timeLeft + 's';
        if (quizState.timeLeft <= 5) {
          timerEl.className = 'px-3 py-1 rounded-lg font-bold bg-red-100 text-red-700';
        }
      }
    }, 1000);
  }
}

function handleSubmit() {
  if (!quizState.guess.trim()) return;
  const guessNum = parseInt(quizState.guess, 10);
  const isCorrect = guessNum === quizState.question.num;
  quizState.correct = isCorrect;
  quizState.revealed = true;
  quizState.totalAttempts++;
  clearInterval(timerId);
  timerId = null;

  if (isCorrect) {
    quizState.streak++;
    quizState.bestStreak = Math.max(quizState.bestStreak, quizState.streak);
    quizState.totalCorrect++;
  } else {
    quizState.streak = 0;
  }
}

function handleReveal() {
  quizState.revealed = true;
  quizState.correct = false;
  quizState.streak = 0;
  quizState.totalAttempts++;
  clearInterval(timerId);
  timerId = null;
}

function renderQuestionDisplay(question) {
  if (!question) return '';
  const { system, result } = question;

  if (system.renderMode === 'vertical') {
    const items = [...result].reverse().map(sym =>
      `<div class="h-14 w-14 flex items-center justify-center border-2 border-stone-300 rounded-lg text-2xl bg-white/50">${esc(sym)}</div>`
    ).join('');
    return `<div class="flex justify-center"><div class="space-y-2">${items}</div></div>`;
  }

  if (system.renderMode === 'grouped') {
    const groups = result.map(group => {
      const syms = group.map(sym =>
        `<div class="h-14 min-w-10 px-2 flex items-center justify-center border-2 border-stone-300 rounded-lg text-2xl bg-white/50">${esc(sym)}</div>`
      ).join('');
      return `<div class="flex space-x-1">${syms}</div>`;
    }).join('');
    return `<div class="flex flex-col items-center space-y-3">${groups}</div>`;
  }

  const items = result.map(sym =>
    `<div class="h-14 min-w-12 px-3 flex items-center justify-center border-2 border-stone-300 rounded-lg text-2xl bg-white/50">${esc(sym)}</div>`
  ).join('');
  return `<div class="flex flex-wrap justify-center gap-2">${items}</div>`;
}

export function initQuiz(rerender) {
  rerenderFn = rerender;
  if (!quizState.question) {
    generateQuestion();
  }
}

export function cleanupQuiz() {
  clearInterval(timerId);
  timerId = null;
}

export function renderQuizView() {
  const { difficulty, question, guess, revealed, correct, streak, bestStreak,
    totalCorrect, totalAttempts, timedMode, timeLeft } = quizState;

  const diffButtons = Object.entries(difficulties).map(([key, { label }]) => {
    const active = difficulty === key;
    const cls = active
      ? 'bg-stone-700 text-parchment-light shadow-md'
      : 'bg-stone-200 text-stone-600 hover:bg-stone-300';
    return `<button data-quiz-difficulty="${key}" class="px-4 py-2 font-cinzel text-sm rounded-lg transition-colors ${cls}">${label}</button>`;
  }).join('');

  const timerHtml = timedMode && !revealed
    ? `<div data-quiz-timer class="px-3 py-1 rounded-lg font-bold ${timeLeft <= 5 ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-800'}">${timeLeft}s</div>`
    : '';

  let questionArea = '';
  if (question) {
    let answerArea;
    if (!revealed) {
      answerArea = `
        <div class="flex gap-3">
          <input type="number" inputmode="numeric" pattern="[0-9]*" id="quiz-guess" value="${esc(guess)}" placeholder="Your answer..."
            class="flex-1 px-4 py-3 bg-parchment-light/50 border-2 border-stone-300 rounded-lg
              font-crimson text-lg text-stone-800 placeholder-stone-400
              focus:outline-none focus:ring-2 focus:ring-stone-400" />
          <button data-action="quiz-submit"
            class="px-6 py-3 bg-stone-700 text-parchment-light font-cinzel text-sm
              rounded-lg hover:bg-stone-600 transition-colors shadow-md">Check</button>
          <button data-action="quiz-reveal"
            class="px-4 py-3 bg-stone-300 text-stone-700 font-cinzel text-sm
              rounded-lg hover:bg-stone-400 transition-colors">Reveal</button>
        </div>`;
    } else {
      const resultCls = correct
        ? 'bg-green-50 border border-green-200 text-green-800'
        : 'bg-red-50 border border-red-200 text-red-800';
      const resultMsg = correct
        ? `Correct! The answer is ${question.num.toLocaleString()}`
        : `The answer was ${question.num.toLocaleString()}${guess ? ` (you guessed ${parseInt(guess, 10).toLocaleString()})` : ''}`;

      answerArea = `
        <div class="space-y-4">
          <div class="p-4 rounded-lg text-center font-crimson text-lg ${resultCls}">${resultMsg}</div>
          ${renderStepBreakdown(question.systemId, String(question.num))}
          <button data-action="quiz-next"
            class="w-full py-3 bg-stone-700 text-parchment-light font-cinzel
              rounded-lg hover:bg-stone-600 transition-colors shadow-md">Next Question</button>
        </div>`;
    }

    questionArea = `
      <div class="p-6 rounded-xl border-2 border-stone-300 bg-white/40 space-y-4">
        <p class="font-cinzel text-sm text-center text-stone-500 uppercase tracking-wider">
          What number is this in ${esc(question.system.name)}?
        </p>
        ${renderQuestionDisplay(question)}
        ${answerArea}
      </div>`;
  }

  return `
    <div class="space-y-6" id="quiz-view">
      <div class="flex flex-wrap gap-3 items-center justify-between">
        <div class="flex gap-2">${diffButtons}</div>
        <label class="flex items-center gap-2 font-crimson text-sm text-stone-600 cursor-pointer">
          <input type="checkbox" id="quiz-timed" ${timedMode ? 'checked' : ''} class="accent-stone-600" />
          Timed (30s)
        </label>
      </div>
      <div class="flex gap-4 text-center font-crimson text-sm text-stone-600">
        <div class="px-3 py-1 bg-stone-100 rounded-lg">Streak: <strong class="text-stone-800">${streak}</strong></div>
        <div class="px-3 py-1 bg-stone-100 rounded-lg">Best: <strong class="text-stone-800">${bestStreak}</strong></div>
        <div class="px-3 py-1 bg-stone-100 rounded-lg">Score: <strong class="text-stone-800">${totalCorrect}/${totalAttempts}</strong></div>
        ${timerHtml}
      </div>
      ${questionArea}
    </div>`;
}

export function handleQuizEvent(target) {
  // Difficulty buttons
  const diffBtn = target.closest('[data-quiz-difficulty]');
  if (diffBtn) {
    quizState.difficulty = diffBtn.dataset.quizDifficulty;
    generateQuestion();
    return true;
  }

  // Timed mode toggle
  if (target.id === 'quiz-timed') {
    quizState.timedMode = target.checked;
    startTimer();
    return true;
  }

  // Guess input — track locally
  if (target.id === 'quiz-guess') {
    quizState.guess = target.value;
    return false;
  }

  // Submit
  if (target.closest('[data-action="quiz-submit"]')) {
    handleSubmit();
    return true;
  }

  // Reveal
  if (target.closest('[data-action="quiz-reveal"]')) {
    handleReveal();
    return true;
  }

  // Next question
  if (target.closest('[data-action="quiz-next"]')) {
    generateQuestion();
    return true;
  }

  return false;
}
