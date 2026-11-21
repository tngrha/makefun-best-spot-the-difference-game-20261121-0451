// sound.js — tiny WebAudio sound effects, synthesized live (no audio files).
// The context is created lazily on the first user gesture, as browsers require.

let ctx = null;
let enabled = true;

function ensureContext() {
  if (ctx === null) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, start, dur, type, gain) {
  const ac = ensureContext();
  if (!ac || !enabled) return;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = ac.currentTime + start;
  amp.gain.setValueAtTime(gain, t0);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(amp).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export function setSoundEnabled(on) {
  enabled = on;
  if (on) ensureContext();
}

export function soundEnabled() {
  return enabled;
}

// A bright two-note chime that climbs with the player's streak.
export function playFound(streak) {
  const base = 660 + Math.min(streak, 8) * 40;
  tone(base, 0, 0.16, 'sine', 0.22);
  tone(base * 1.5, 0.07, 0.22, 'sine', 0.2);
}

export function playWrong() {
  tone(150, 0, 0.22, 'sawtooth', 0.12);
  tone(110, 0.05, 0.24, 'sawtooth', 0.1);
}

export function playHint() {
  tone(880, 0, 0.12, 'triangle', 0.16);
  tone(1174, 0.1, 0.16, 'triangle', 0.14);
}

export function playTick() {
  tone(1200, 0, 0.05, 'square', 0.05);
}

export function playFanfare() {
  const notes = [523, 659, 784, 1046];
  notes.forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.2));
  tone(1318, 0.46, 0.5, 'triangle', 0.18);
}

export function playTimeUp() {
  tone(392, 0, 0.25, 'triangle', 0.18);
  tone(330, 0.22, 0.25, 'triangle', 0.18);
  tone(262, 0.44, 0.45, 'triangle', 0.18);
}
