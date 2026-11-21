// main.js — wires the page to the engine: HUD updates, mouse/keyboard input,
// the magnifying lens, scene dots, overlays, and the render loop.
// Screenshot setups for the maker: ?scene=2&found=4&time=95&score=750&shot=1
// (and &complete=1 or &gallery=1 for the end screens). Normal play needs no params.

import { SCENES } from './scenes.js';
import { Game } from './engine.js';
import { setSoundEnabled, soundEnabled } from './sound.js';

const $ = (id) => document.getElementById(id);
const canvasA = $('canvasA');
const canvasB = $('canvasB');
const lensCanvas = $('lens');
const lensCtx = lensCanvas.getContext('2d');

const game = new Game(canvasA, canvasB, {
  onHud: updateHud,
  onSceneEnd: showSceneEnd,
  onTimeUp: showTimeUp,
  onWrongClick: (panel) => {
    const el = panel === 'A' ? $('panelA') : $('panelB');
    el.classList.remove('shake');
    void el.offsetWidth; // restart the animation
    el.classList.add('shake');
  },
});

let lensOn = false;

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function starRow(n, max) {
  return '★'.repeat(n) + '☆'.repeat(max - n);
}

function updateHud(g) {
  $('sceneName').textContent = g.scene.name + (g.mirror ? ' · Mirror' : '');
  $('sceneStars').textContent = starRow(g.scene.difficulty, 5);
  $('foundCount').textContent = `${g.found.size} / ${g.total}`;
  $('hiddenCount').textContent = String(g.remaining);
  $('timeLeft').textContent = fmtTime(g.timeLeft);
  $('timeChip').classList.toggle('low', g.timeLeft <= 30 && !g.over);
  $('scoreValue').textContent = String(g.score);
  $('comboValue').textContent = g.streak >= 2 ? `STREAK ×${g.streak}` : '';
  $('hintCount').textContent = String(g.hintsLeft);
  $('hintBtn').disabled = g.hintsLeft <= 0 || g.over;
  updateDots(g);
}

function updateDots(g) {
  const nav = $('sceneDots');
  nav.innerHTML = '';
  SCENES.forEach((scene, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dot' + (i === g.sceneIndex ? ' current' : '') + (g.finished[i] ? ' done' : '');
    b.textContent = `${i + 1}. ${scene.name}`;
    if (g.stars[i] > 0) {
      const s = document.createElement('span');
      s.className = 'dot-stars';
      s.textContent = '★'.repeat(g.stars[i]);
      b.appendChild(s);
    }
    b.addEventListener('click', () => {
      hideOverlay();
      game.startScene(i);
    });
    nav.appendChild(b);
  });
}

function showOverlay(title, stars, text, primaryLabel, onPrimary, secondaryLabel, onSecondary) {
  $('overlayTitle').textContent = title;
  $('overlayStars').textContent = stars > 0 ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '';
  $('overlayText').textContent = text;
  const primary = $('overlayPrimary');
  primary.textContent = primaryLabel;
  primary.onclick = onPrimary;
  const secondary = $('overlaySecondary');
  secondary.textContent = secondaryLabel;
  secondary.onclick = onSecondary;
  $('overlay').hidden = false;
}

function hideOverlay() {
  $('overlay').hidden = true;
}

function showSceneEnd(g, stars, bonus) {
  const last = g.sceneIndex === SCENES.length - 1;
  if (g.allFinished && !g.mirror) {
    showOverlay(
      'Gallery Complete!',
      stars,
      `Every diorama solved. Final score ${g.score} (time bonus +${bonus}). Mirror Mode is unlocked: the exhibits swap sides and the clock runs faster.`,
      'Enter Mirror Mode',
      () => { hideOverlay(); g.enterMirrorMode(); },
      'Keep Exploring',
      () => hideOverlay(),
    );
    return;
  }
  showOverlay(
    `${g.scene.name} — Complete!`,
    stars,
    `All ${g.total} differences found with ${fmtTime(g.timeLeft)} to spare (time bonus +${bonus}). Score ${g.score}.`,
    last ? 'Back to First Diorama' : 'Next Diorama',
    () => { hideOverlay(); g.startScene(last ? 0 : g.sceneIndex + 1); },
    'Replay This One',
    () => { hideOverlay(); g.restartScene(); },
  );
}

function showTimeUp(g) {
  showOverlay(
    "Time's Up!",
    0,
    `${g.remaining} difference${g.remaining === 1 ? '' : 's'} stayed hidden in ${g.scene.name}. The rings on the exhibits show what you found — try again with fresh eyes.`,
    'Try Again',
    () => { hideOverlay(); g.restartScene(); },
    'Another Diorama',
    () => { hideOverlay(); g.startScene((g.sceneIndex + 1) % SCENES.length); },
  );
}

/* ---------- input ---------- */

function panelPoint(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
  };
}

for (const [canvas, panel] of [[canvasA, 'A'], [canvasB, 'B']]) {
  canvas.addEventListener('click', (event) => {
    const p = panelPoint(event, canvas);
    game.click(p.x, p.y, panel);
  });
  canvas.addEventListener('mousemove', (event) => {
    if (lensOn) moveLens(event, canvas);
  });
  canvas.addEventListener('mouseleave', () => {
    lensCanvas.hidden = true;
  });
}

function moveLens(event, canvas) {
  const stage = $('stage').getBoundingClientRect();
  const size = 180;
  const zoom = 2.2;
  const p = panelPoint(event, canvas);
  const src = size / zoom;
  lensCtx.clearRect(0, 0, size, size);
  lensCtx.drawImage(canvas, p.x - src / 2, p.y - src / 2, src, src, 0, 0, size, size);
  lensCanvas.style.left = `${event.clientX - stage.left - size / 2}px`;
  lensCanvas.style.top = `${event.clientY - stage.top - size / 2}px`;
  lensCanvas.hidden = false;
}

$('hintBtn').addEventListener('click', () => game.useHint(performance.now()));
$('restartBtn').addEventListener('click', () => { hideOverlay(); game.restartScene(); });
$('lensBtn').addEventListener('click', () => {
  lensOn = !lensOn;
  $('lensBtn').setAttribute('aria-pressed', String(lensOn));
  if (!lensOn) lensCanvas.hidden = true;
});
$('soundBtn').addEventListener('click', () => {
  const on = !soundEnabled();
  setSoundEnabled(on);
  $('soundBtn').textContent = on ? 'Sound: On' : 'Sound: Off';
  $('soundBtn').setAttribute('aria-pressed', String(on));
});

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'h') game.useHint(performance.now());
  else if (key === 'l') $('lensBtn').click();
  else if (key === 'r') { hideOverlay(); game.restartScene(); }
  else if (key === 'n' && game.over) { hideOverlay(); game.startScene((game.sceneIndex + 1) % SCENES.length); }
  else if (key === 'm') $('soundBtn').click();
});

/* ---------- screenshot setups (maker only, via URL params) ---------- */

function applyShotParams() {
  const q = new URLSearchParams(location.search);
  if (!q.has('shot')) return;
  game.frozen = true;
  const sceneIdx = Math.min(SCENES.length - 1, Math.max(0, parseInt(q.get('scene') || '0', 10) || 0));
  game.startScene(sceneIdx);
  const foundN = Math.min(game.total, parseInt(q.get('found') || '0', 10) || 0);
  for (let i = 0; i < foundN; i++) game.found.add(i);
  if (q.has('time')) game.timeLeft = parseInt(q.get('time'), 10) || game.timeLeft;
  if (q.has('score')) game.score = parseInt(q.get('score'), 10) || 0;
  if (q.has('hints')) game.hintsLeft = parseInt(q.get('hints'), 10) || 0;
  if (q.has('streak')) game.streak = parseInt(q.get('streak'), 10) || 0;
  if (q.has('hint')) {
    const d = game.scene.differences[foundN % game.total];
    game.hintSpot = { x: d.x, y: d.y, r: d.r, until: Number.MAX_SAFE_INTEGER };
  }
  updateHud(game);
  if (q.has('complete')) {
    game.over = true;
    showSceneEnd(game, 3, game.timeLeft * 2);
  }
  if (q.has('gallery')) {
    game.finished = SCENES.map(() => true);
    game.stars = [3, 3, 2, 3, 2];
    game.over = true;
    showSceneEnd(game, 3, 240);
    updateHud(game);
  }
}

/* ---------- render loop ---------- */

let lastNow = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - lastNow) / 1000);
  lastNow = now;
  game.tick(dt);
  game.paint(now);
  game.paintWrongMark(game.ctxA, 'A', now);
  game.paintWrongMark(game.ctxB, 'B', now);
  requestAnimationFrame(frame);
}

applyShotParams();
updateHud(game);
requestAnimationFrame(frame);
