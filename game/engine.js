// engine.js — game state and rules for Double Take.
// Owns: current scene, found set, score/streak, timer, hints, mirror mode,
// star ratings and the per-frame paint of both panels (scene + markers).

import { SCENES } from './scenes.js';
import { playFound, playWrong, playHint, playTick, playFanfare, playTimeUp } from './sound.js';

export const POINTS_PER_FIND = 100;
export const WRONG_PENALTY = 25;
export const HINT_COST = 50;
export const HINTS_PER_SCENE = 3;

export class Game {
  constructor(canvasA, canvasB, hooks) {
    this.ctxA = canvasA.getContext('2d');
    this.ctxB = canvasB.getContext('2d');
    this.hooks = hooks; // { onHud, onSceneEnd, onTimeUp, onWrongClick }
    this.sceneIndex = 0;
    this.mirror = false; // mirror mode: exhibits swapped, clock at 75%
    this.score = 0;
    this.stars = SCENES.map(() => 0);
    this.finished = SCENES.map(() => false);
    this.resetSceneState();
    this.lastTickSecond = -1;
    this.frozen = false; // screenshot mode: no timer, fixed animation clock
    this.fixedT = 1.7;
  }

  resetSceneState() {
    const scene = this.scene;
    this.found = new Set();
    this.streak = 0;
    this.mistakes = 0;
    this.hintsLeft = HINTS_PER_SCENE;
    this.hintSpot = null; // {x, y, r, until}
    this.wrongMark = null; // {x, y, panel, until}
    this.timeLeft = Math.round(scene.seconds * (this.mirror ? 0.75 : 1));
    this.sceneScore = 0;
    this.over = false;
  }

  get scene() {
    return SCENES[this.sceneIndex];
  }

  get total() {
    return this.scene.differences.length;
  }

  get remaining() {
    return this.total - this.found.size;
  }

  startScene(index) {
    this.sceneIndex = index;
    this.resetSceneState();
    this.hooks.onHud(this);
  }

  restartScene() {
    this.score -= this.sceneScore;
    this.resetSceneState();
    this.hooks.onHud(this);
  }

  // A click on either panel, in panel coordinates. Returns 'found' | 'wrong' | 'ignored'.
  click(x, y, panel) {
    if (this.over || this.frozen) return 'ignored';
    const diffs = this.scene.differences;
    for (let i = 0; i < diffs.length; i++) {
      if (this.found.has(i)) continue;
      const d = diffs[i];
      const dist = Math.hypot(x - d.x, y - d.y);
      if (dist <= d.r) {
        this.found.add(i);
        this.streak += 1;
        const gained = POINTS_PER_FIND + (this.streak - 1) * 20;
        this.score += gained;
        this.sceneScore += gained;
        playFound(this.streak);
        this.hooks.onHud(this);
        if (this.found.size === this.total) this.completeScene();
        return 'found';
      }
    }
    // Already-found spots are forgiving: no penalty for re-clicking a ring.
    for (const i of this.found) {
      const d = diffs[i];
      if (Math.hypot(x - d.x, y - d.y) <= d.r) return 'ignored';
    }
    this.mistakes += 1;
    this.streak = 0;
    this.score = Math.max(0, this.score - WRONG_PENALTY);
    this.sceneScore = Math.max(0, this.sceneScore - WRONG_PENALTY);
    this.wrongMark = { x, y, panel, until: performance.now() + 650 };
    playWrong();
    this.hooks.onWrongClick(panel);
    this.hooks.onHud(this);
    return 'wrong';
  }

  useHint(now) {
    if (this.over || this.hintsLeft <= 0) return false;
    const open = this.scene.differences
      .map((d, i) => ({ d, i }))
      .filter(({ i }) => !this.found.has(i));
    if (open.length === 0) return false;
    const pick = open[Math.floor(Math.random() * open.length)];
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - HINT_COST);
    this.sceneScore = Math.max(0, this.sceneScore - HINT_COST);
    this.hintSpot = { x: pick.d.x, y: pick.d.y, r: pick.d.r, until: now + 2200 };
    playHint();
    this.hooks.onHud(this);
    return true;
  }

  // Star rating: 3 for a clean fast clear, 2 for a solid one, 1 for finishing.
  rateScene() {
    const timeBonus = this.timeLeft;
    if (this.mistakes <= 2 && timeBonus >= this.scene.seconds * 0.25) return 3;
    if (this.mistakes <= 6) return 2;
    return 1;
  }

  completeScene() {
    this.over = true;
    const bonus = this.timeLeft * 2;
    this.score += bonus;
    this.sceneScore += bonus;
    const stars = this.rateScene();
    this.stars[this.sceneIndex] = Math.max(this.stars[this.sceneIndex], stars);
    this.finished[this.sceneIndex] = true;
    playFanfare();
    this.hooks.onHud(this);
    this.hooks.onSceneEnd(this, stars, bonus);
  }

  timeUp() {
    this.over = true;
    playTimeUp();
    this.hooks.onTimeUp(this);
  }

  get allFinished() {
    return this.finished.every(Boolean);
  }

  enterMirrorMode() {
    this.mirror = true;
    this.startScene(0);
  }

  // Advance the clock by dt seconds. Called from the render loop.
  tick(dt) {
    if (this.over || this.frozen) return;
    this.timeLeft -= dt;
    const whole = Math.ceil(this.timeLeft);
    if (whole !== this.lastTickSecond) {
      this.lastTickSecond = whole;
      if (whole <= 10 && whole > 0) playTick();
      this.hooks.onHud(this);
    }
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.timeUp();
    }
  }

  // Paint both panels: scene art, then found rings, hint pulse and wrong-click X.
  paint(now) {
    const t = this.frozen ? this.fixedT : now / 1000;
    const variantA = this.mirror ? 1 : 0;
    const variantB = this.mirror ? 0 : 1;
    this.scene.paint(this.ctxA, variantA, t);
    this.scene.paint(this.ctxB, variantB, t);
    this.paintMarkers(this.ctxA, now);
    this.paintMarkers(this.ctxB, now);
  }

  paintMarkers(ctx, now) {
    // Found: a green ring with a check, on both exhibits.
    for (const i of this.found) {
      const d = this.scene.differences[i];
      ctx.strokeStyle = '#35c26e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * 0.82, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * 0.82 + 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#35c26e';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(d.x - d.r * 0.34, d.y);
      ctx.lineTo(d.x - d.r * 0.1, d.y + d.r * 0.3);
      ctx.lineTo(d.x + d.r * 0.38, d.y - d.r * 0.3);
      ctx.stroke();
    }
    // Hint: a pulsing amber ring.
    if (this.hintSpot && now < this.hintSpot.until) {
      const h = this.hintSpot;
      const pulse = 1 + Math.sin(now / 140) * 0.12;
      ctx.strokeStyle = '#ffb703';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.r * pulse, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Wrong click: a red X that fades (drawn on the clicked panel only, by caller order).
  }

  paintWrongMark(ctx, panel, now) {
    if (!this.wrongMark || this.wrongMark.panel !== panel || now >= this.wrongMark.until) return;
    const { x, y } = this.wrongMark;
    const s = 11;
    ctx.strokeStyle = '#e5504d';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - s, y - s);
    ctx.lineTo(x + s, y + s);
    ctx.moveTo(x + s, y - s);
    ctx.lineTo(x - s, y + s);
    ctx.stroke();
  }
}
