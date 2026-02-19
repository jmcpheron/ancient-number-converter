let audioCtx = null;
let gainNode = null;
let sourceNodes = [];
let unlocked = false;

export function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  gainNode = audioCtx.createGain();
  gainNode.connect(audioCtx.destination);
}

function ensureResumed() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

/**
 * Call this on the first user gesture (tap/click anywhere) to unlock
 * audio playback on mobile browsers. iOS Safari and Chrome on Android
 * require a user-initiated audio context resume + silent buffer play
 * before real audio will work.
 */
export function unlockAudio() {
  if (unlocked) return;
  initAudio();
  ensureResumed();
  // Play a silent buffer to fully unlock the audio pipeline on iOS
  const silent = audioCtx.createBuffer(1, 1, audioCtx.sampleRate);
  const src = audioCtx.createBufferSource();
  src.buffer = silent;
  src.connect(audioCtx.destination);
  src.start();
  unlocked = true;
}

function stopSources() {
  sourceNodes.forEach((n) => {
    try { n.stop(); } catch { /* already stopped */ }
  });
  sourceNodes = [];
}

// TODO: This is your creative playground!
//
// Each function below creates a different sound character using Web Audio.
// The oscillators/filters connect → gainNode (already wired to speakers).
// Return an array of source nodes so they can be stopped later.
//
// Trade-offs to consider:
//   - Sawtooth vs square vs triangle waves (harsh vs warm vs mellow)
//   - Detuning amount (subtle shimmer vs obvious wobble)
//   - Filter cutoff frequency (dark/muffled vs bright/harsh)
//   - For drums: kick frequency sweep range, hihat noise brightness
//   - For jungle: noise color (brown=deep rumble, pink=waterfall, white=static)
//
// Each function receives (audioCtx, gainNode) and must return Node[].

function createTone(ctx, dest) {
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();

  osc1.type = 'sawtooth';
  osc1.frequency.value = 220;
  osc2.type = 'sawtooth';
  osc2.frequency.value = 223; // slight detune for richness

  filter.type = 'lowpass';
  filter.frequency.value = 1200;
  filter.Q.value = 2;

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(dest);

  osc1.start();
  osc2.start();
  return [osc1, osc2];
}

function createDrums(ctx, dest) {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  // Simple kick + hihat pattern in a looping buffer
  const bpm = 120;
  const beatSamples = Math.floor(ctx.sampleRate * 60 / bpm);

  for (let i = 0; i < bufferSize; i++) {
    const beatPos = i % beatSamples;
    const subBeat = i % (beatSamples / 2);
    // Kick on downbeat
    if (beatPos < beatSamples * 0.05) {
      const env = 1 - (beatPos / (beatSamples * 0.05));
      data[i] = Math.sin(2 * Math.PI * (160 - beatPos * 0.15) * beatPos / ctx.sampleRate) * env * 0.7;
    }
    // Hihat on off-beat
    else if (subBeat < beatSamples * 0.01) {
      const env = 1 - (subBeat / (beatSamples * 0.01));
      data[i] = (Math.random() * 2 - 1) * env * 0.25;
    }
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.connect(dest);
  source.start();
  return [source];
}

function createJungle(ctx, dest) {
  // Brown noise: integrate white noise for deep rumble
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + (0.02 * white)) / 1.02;
    data[i] = lastOut * 3.5;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 500;

  source.connect(filter);
  filter.connect(dest);
  source.start();
  return [source];
}

const SOUND_CREATORS = {
  tone: createTone,
  drums: createDrums,
  jungle: createJungle,
};

export function play(soundType) {
  if (!audioCtx) initAudio();
  ensureResumed();
  stopSources();

  const creator = SOUND_CREATORS[soundType] || SOUND_CREATORS.tone;
  sourceNodes = creator(audioCtx, gainNode);
}

export function stop() {
  stopSources();
}

export function setVolume(fraction) {
  if (!gainNode) return;
  const clamped = Math.max(0, Math.min(1, fraction));
  gainNode.gain.linearRampToValueAtTime(clamped, audioCtx.currentTime + 0.05);
}
