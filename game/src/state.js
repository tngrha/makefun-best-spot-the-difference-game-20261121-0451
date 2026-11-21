// state.js — the game state machine: scenes, found differences, timer,
// score, hints and the little flashes that answer every click.

import { SCENES } from './scenes.js';

export const POINTS_PER_FIND = 100;
export const WRONG_CLICK_COST = 25;
export const HINT_COST = 50;
export const HINTS_PER_SCENE = 3;
export const TIME_BONUS_PER_SECOND = 2;

export function createGame() {
  return {
    sceneIndex: 0, // position within `order`
    order: [0, 1, 2], // scene indices in play order; shuffled on remix
    flip: false, // remix: swap which postcard carries the changes
    phase: 'playing', // 'playing' | 'scene-won' | 'time-up' | 'finished'
    found: new Set(),
    score: 0,
    mistakes: 0,
    hintsLeft: HINTS_PER_SCENE,
    timeLeft: SCENES[0].timeLimit,
    elapsedTotal: 0,
    hintTarget: null, // difference id currently pulsing
    hintUntil: 0, // animation-clock seconds when the pulse ends
    flashes: [], // {x, y, panel, kind: 'found'|'wrong', born}
    shake: 0, // remaining shake seconds
    confetti: [],
    frozen: false, // photo mode: clock and timer held still
    frozenTime: 2.5,
  };
}

export function currentScene(game) {
  return SCENES[game.order[game.sceneIndex]];
}

export function remainingCount(game) {
  return currentScene(game).differences.length - game.found.size;
}

export function loadScene(game, index) {
  game.sceneIndex = index;
  game.phase = 'playing';
  game.found = new Set();
  game.hintsLeft = HINTS_PER_SCENE;
  game.timeLeft = SCENES[game.order[index]].timeLimit;
  game.hintTarget = null;
  game.flashes = [];
  game.confetti = [];
  game.shake = 0;
}

export function restartScene(game) {
  loadScene(game, game.sceneIndex);
}

export function restartGame(game) {
  game.score = 0;
  game.mistakes = 0;
  game.elapsedTotal = 0;
  // Remix: shuffle the scene order and swap which postcard is the odd one,
  // so a second playthrough is a fresh hunt rather than a memory test.
  game.order = [0, 1, 2];
  for (let i = game.order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [game.order[i], game.order[j]] = [game.order[j], game.order[i]];
  }
  game.flip = !game.flip;
  loadScene(game, 0);
}

// Returns 'found' | 'wrong' | 'ignored'.
export function clickAt(game, sceneX, sceneY, panel, now) {
  if (game.phase !== 'playing') return 'ignored';
  const scene = currentScene(game);
  let best = null;
  let bestDist = Infinity;
  for (const diff of scene.differences) {
    if (game.found.has(diff.id)) continue;
    const dist = Math.hypot(sceneX - diff.x, sceneY - diff.y);
    if (dist <= diff.r && dist < bestDist) {
      best = diff;
      bestDist = dist;
    }
  }
  if (best) {
    game.found.add(best.id);
    game.score += POINTS_PER_FIND;
    game.flashes.push({ x: best.x, y: best.y, panel, kind: 'found', born: now });
    if (game.hintTarget === best.id) game.hintTarget = null;
    if (game.found.size === scene.differences.length) {
      game.phase = game.sceneIndex === SCENES.length - 1 ? 'finished' : 'scene-won';
      game.score += Math.ceil(game.timeLeft) * TIME_BONUS_PER_SECOND;
      spawnConfetti(game);
    }
    return 'found';
  }
  game.mistakes += 1;
  game.score = Math.max(0, game.score - WRONG_CLICK_COST);
  game.flashes.push({ x: sceneX, y: sceneY, panel, kind: 'wrong', born: now });
  game.shake = 0.28;
  return 'wrong';
}

// Returns the difference the hint points at, or null when none can be given.
export function useHint(game, now) {
  if (game.phase !== 'playing' || game.hintsLeft <= 0) return null;
  const unfound = currentScene(game).differences.filter((d) => !game.found.has(d.id));
  if (unfound.length === 0) return null;
  const target = unfound[Math.floor(Math.random() * unfound.length)];
  game.hintsLeft -= 1;
  game.score = Math.max(0, game.score - HINT_COST);
  game.hintTarget = target.id;
  game.hintUntil = now + 2.4;
  return target;
}

export function tick(game, dt, now) {
  if (game.frozen) return;
  if (game.phase === 'playing') {
    game.timeLeft -= dt;
    game.elapsedTotal += dt;
    if (game.timeLeft <= 0) {
      game.timeLeft = 0;
      game.phase = 'time-up';
    }
  }
  if (game.shake > 0) game.shake = Math.max(0, game.shake - dt);
  game.flashes = game.flashes.filter((f) => now - f.born < 0.9);
  for (const p of game.confetti) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 260 * dt;
    p.rot += p.vr * dt;
    p.life -= dt;
  }
  game.confetti = game.confetti.filter((p) => p.life > 0 && p.y < 640);
}

export function spawnConfetti(game) {
  const colors = ['#ffd166', '#ff5d5d', '#7ae0ff', '#b6ff7a', '#ff7ab6', '#fdf8ec'];
  for (let i = 0; i < 130; i++) {
    game.confetti.push({
      x: 60 + Math.random() * 1120,
      y: -20 - Math.random() * 160,
      vx: (Math.random() - 0.5) * 90,
      vy: 60 + Math.random() * 130,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 9,
      w: 7 + Math.random() * 7,
      h: 4 + Math.random() * 5,
      color: colors[i % colors.length],
      life: 2.6 + Math.random() * 1.6,
    });
  }
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
