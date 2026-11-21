// sound.js — tiny WebAudio blips, synthesised on the fly (no audio files).
// The context is created on the first user gesture, as browsers require.

let audioCtx = null;

function ensureContext() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, at, dur, type = 'sine', gain = 0.16) {
  const ctx = ensureContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const start = ctx.currentTime + at;
  amp.gain.setValueAtTime(0, start);
  amp.gain.linearRampToValueAtTime(gain, start + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(amp).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + dur + 0.05);
}

export function playFound() {
  tone(880, 0, 0.14, 'sine', 0.18);
  tone(1318, 0.07, 0.2, 'sine', 0.16);
}

export function playWrong() {
  tone(160, 0, 0.18, 'square', 0.07);
  tone(120, 0.05, 0.2, 'square', 0.06);
}

export function playHint() {
  tone(1046, 0, 0.12, 'triangle', 0.14);
  tone(1046, 0.16, 0.12, 'triangle', 0.12);
}

export function playWin() {
  [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.26, 'triangle', 0.16));
}

export function playTimeUp() {
  [392, 330, 262].forEach((f, i) => tone(f, i * 0.16, 0.3, 'triangle', 0.14));
}
