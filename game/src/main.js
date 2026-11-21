// main.js — boots Twin Postcards: wires state, renderer, input and sound,
// keeps the HUD in step, and runs the frame loop.
//
// Photo mode for screenshots: ?shot=harbor|camp|market&found=N&time=S&win=1
// loads a scene mid-game (N differences already marked, clock frozen).

import { SCENES, sceneById } from './scenes.js';
import {
  createGame, currentScene, remainingCount, loadScene, restartScene,
  restartGame, clickAt, useHint, tick, formatTime, spawnConfetti,
} from './state.js';
import { createRenderer } from './render.js';
import { bindInput } from './input.js';
import { playFound, playWrong, playHint, playWin, playTimeUp } from './sound.js';

const canvas = document.getElementById('game-canvas');
const els = {
  sceneName: document.getElementById('scene-name'),
  foundCount: document.getElementById('found-count'),
  remainingCount: document.getElementById('remaining-count'),
  timeLeft: document.getElementById('time-left'),
  timeStat: document.getElementById('time-stat'),
  score: document.getElementById('score'),
  hintButton: document.getElementById('hint-button'),
  hintsLeft: document.getElementById('hints-left'),
  restartButton: document.getElementById('restart-button'),
  overlay: document.getElementById('overlay'),
  overlayTitle: document.getElementById('overlay-title'),
  overlayText: document.getElementById('overlay-text'),
  overlayButton: document.getElementById('overlay-button'),
};

const game = createGame();
const renderer = createRenderer(canvas);
let lastPhase = game.phase;
let clockStart = performance.now() / 1000;

function nowSeconds() {
  return performance.now() / 1000 - clockStart;
}

function syncHud() {
  const scene = currentScene(game);
  els.sceneName.textContent = scene.name;
  els.foundCount.textContent = `${game.found.size} / ${scene.differences.length}`;
  els.remainingCount.textContent = String(remainingCount(game));
  els.timeLeft.textContent = formatTime(game.timeLeft);
  els.timeStat.classList.toggle('danger', game.phase === 'playing' && game.timeLeft <= 20);
  els.score.textContent = String(game.score);
  els.hintsLeft.textContent = `(${game.hintsLeft})`;
  els.hintButton.disabled = game.phase !== 'playing' || game.hintsLeft <= 0;
}

function showOverlay(title, text, buttonLabel) {
  els.overlayTitle.textContent = title;
  els.overlayText.textContent = text;
  els.overlayButton.textContent = buttonLabel;
  els.overlay.classList.remove('hidden');
}

function hideOverlay() {
  els.overlay.classList.add('hidden');
}

function onPhaseChange() {
  const scene = currentScene(game);
  if (game.phase === 'scene-won') {
    playWin();
    showOverlay(
      `${scene.name} complete!`,
      `Every difference found with ${formatTime(game.timeLeft)} to spare. Score so far: ${game.score}.`,
      'Next scene',
    );
  } else if (game.phase === 'time-up') {
    playTimeUp();
    showOverlay(
      "Time's up!",
      `${remainingCount(game)} difference${remainingCount(game) === 1 ? '' : 's'} stayed hidden in ${scene.name}. Have another look?`,
      'Try again',
    );
  } else if (game.phase === 'finished') {
    playWin();
    showOverlay(
      'All postcards solved!',
      `Final score ${game.score} · ${game.mistakes} wrong click${game.mistakes === 1 ? '' : 's'} · ${formatTime(game.elapsedTotal)} of hunting. Sharp eyes! Play again for Remix: shuffled scenes, swapped postcards.`,
      'Play Remix',
    );
  }
}

function handleSceneClick(hit) {
  const result = clickAt(game, hit.x, hit.y, hit.panel, nowSeconds());
  if (result === 'found') playFound();
  else if (result === 'wrong') playWrong();
}

function handleHint() {
  if (useHint(game, nowSeconds())) playHint();
}

function handleRestart() {
  restartScene(game);
  hideOverlay();
}

function handleNext() {
  if (game.phase === 'scene-won') {
    loadScene(game, game.sceneIndex + 1);
    hideOverlay();
  } else if (game.phase === 'time-up') {
    restartScene(game);
    hideOverlay();
  } else if (game.phase === 'finished') {
    restartGame(game);
    hideOverlay();
  }
}

els.hintButton.addEventListener('click', handleHint);
els.restartButton.addEventListener('click', handleRestart);
els.overlayButton.addEventListener('click', handleNext);
bindInput(canvas, { onSceneClick: handleSceneClick, onHint: handleHint, onRestart: handleRestart, onNext: handleNext });

// ---- photo mode ---------------------------------------------------------
function applyPhotoMode() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('shot')) return;
  const scene = sceneById(params.get('shot'));
  loadScene(game, SCENES.indexOf(scene));
  game.frozen = true;
  const foundN = Math.min(
    Number.parseInt(params.get('found') ?? '0', 10) || 0,
    scene.differences.length,
  );
  for (let i = 0; i < foundN; i++) game.found.add(scene.differences[i].id);
  game.score = foundN * 100;
  if (params.has('time')) game.timeLeft = Number.parseInt(params.get('time'), 10) || game.timeLeft;
  if (params.get('win') === '1') {
    for (const diff of scene.differences) game.found.add(diff.id);
    game.score = scene.differences.length * 100 + Math.ceil(game.timeLeft) * 2;
    game.phase = game.sceneIndex === SCENES.length - 1 ? 'finished' : 'scene-won';
    spawnConfetti(game);
    // let the confetti fall a little so the still frame shows it mid-air
    for (let i = 0; i < 40; i++) {
      for (const p of game.confetti) {
        p.x += p.vx * 0.03;
        p.y += p.vy * 0.03;
        p.vy += 260 * 0.03;
        p.rot += p.vr * 0.03;
      }
    }
    onPhaseChange();
  }
  if (params.get('hint') === '1') {
    const target = scene.differences.find((d) => !game.found.has(d.id));
    if (target) {
      game.hintTarget = target.id;
      game.hintUntil = game.frozenTime + 10;
      game.hintsLeft -= 1;
    }
  }
  lastPhase = game.phase;
}

// ---- frame loop ---------------------------------------------------------
let lastTick = performance.now() / 1000;

function frame() {
  const t = performance.now() / 1000;
  const dt = Math.min(0.05, t - lastTick);
  lastTick = t;
  tick(game, dt, nowSeconds());
  if (game.phase !== lastPhase) {
    lastPhase = game.phase;
    if (!game.frozen) onPhaseChange();
  }
  renderer.draw(game, nowSeconds());
  syncHud();
  requestAnimationFrame(frame);
}

applyPhotoMode();
syncHud();
requestAnimationFrame(frame);
