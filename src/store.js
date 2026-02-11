let state = {
  number: '',
  activeTab: 'mayan',
  showCompare: false,
  reverseMode: false,
  showQuiz: false,
  showShowcase: false,
};

const listeners = [];

export function getState() {
  return state;
}

export function setState(updates) {
  const prev = state;
  state = { ...state, ...updates };
  for (const fn of listeners) {
    fn(state, prev);
  }
}

export function subscribe(fn) {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
}
