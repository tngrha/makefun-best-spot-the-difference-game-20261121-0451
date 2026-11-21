// render.js — draws both postcards every frame: scenes, found markers,
// hint pulses, click flashes and the win confetti.

import { currentScene } from './state.js';

export const PANEL_SIZE = 600;
export const PANELS = [
  { x: 10, y: 10 },
  { x: 630, y: 10 },
];

function drawPanelBacking(ctx, panel) {
  ctx.fillStyle = '#fdf8ec';
  ctx.beginPath();
  ctx.roundRect(panel.x - 7, panel.y - 7, PANEL_SIZE + 14, PANEL_SIZE + 14, 10);
  ctx.fill();
  ctx.strokeStyle = '#b98a3e';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawPanelTab(ctx, panel, label) {
  ctx.fillStyle = 'rgba(58,36,16,0.82)';
  ctx.beginPath();
  ctx.roundRect(panel.x + 10, panel.y + 10, 118, 30, 8);
  ctx.fill();
  ctx.fillStyle = '#ffd98a';
  ctx.font = 'bold 17px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, panel.x + 69, panel.y + 26);
}

function drawFoundMarker(ctx, diff) {
  const r = Math.max(20, diff.r * 0.66);
  ctx.fillStyle = 'rgba(46, 204, 113, 0.20)';
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#1fae5f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
  ctx.stroke();
  // tick
  ctx.strokeStyle = '#1fae5f';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(diff.x - r * 0.42, diff.y + 1);
  ctx.lineTo(diff.x - r * 0.12, diff.y + r * 0.34);
  ctx.lineTo(diff.x + r * 0.46, diff.y - r * 0.32);
  ctx.stroke();
}

function drawHintPulse(ctx, diff, now) {
  const phase = (now % 1.1) / 1.1;
  for (let i = 0; i < 2; i++) {
    const p = (phase + i * 0.5) % 1;
    const r = 14 + p * (diff.r + 16);
    ctx.strokeStyle = `rgba(255, 209, 102, ${0.95 - p * 0.8})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawFlash(ctx, flash, now) {
  const age = now - flash.born;
  const fade = Math.max(0, 1 - age / 0.9);
  if (flash.kind === 'found') {
    ctx.strokeStyle = `rgba(46, 204, 113, ${fade})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(flash.x, flash.y, 12 + age * 46, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.strokeStyle = `rgba(231, 76, 60, ${fade})`;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    const s = 13;
    ctx.beginPath();
    ctx.moveTo(flash.x - s, flash.y - s); ctx.lineTo(flash.x + s, flash.y + s);
    ctx.moveTo(flash.x + s, flash.y - s); ctx.lineTo(flash.x - s, flash.y + s);
    ctx.stroke();
  }
}

function drawConfetti(ctx, game) {
  for (const p of game.confetti) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');

  function draw(game, now) {
    const scene = currentScene(game);
    const t = game.frozen ? game.frozenTime : now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // table felt behind the postcards
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    PANELS.forEach((panel, panelIndex) => {
      const variant = game.flip ? 1 - panelIndex : panelIndex;
      const shakeX = game.shake > 0 ? Math.sin(now * 70) * 5 * game.shake * 3.5 : 0;
      ctx.save();
      ctx.translate(shakeX, 0);
      drawPanelBacking(ctx, panel);
      ctx.restore();
      ctx.save();
      ctx.translate(panel.x + shakeX, panel.y);
      ctx.beginPath();
      ctx.rect(0, 0, PANEL_SIZE, PANEL_SIZE);
      ctx.clip();
      scene.draw(ctx, variant, t);
      // permanent markers for everything found so far
      for (const diff of scene.differences) {
        if (game.found.has(diff.id)) drawFoundMarker(ctx, diff);
      }
      // hint pulse on both postcards
      if (game.hintTarget && (game.frozen || now < game.hintUntil)) {
        const target = scene.differences.find((d) => d.id === game.hintTarget);
        if (target) drawHintPulse(ctx, target, t);
      }
      // click flashes: found rings on both, wrong X on the clicked one
      for (const flash of game.flashes) {
        if (flash.kind === 'found' || flash.panel === panelIndex) drawFlash(ctx, flash, t);
      }
      ctx.restore();
      ctx.save();
      ctx.translate(shakeX, 0);
      drawPanelTab(ctx, panel, panelIndex === 0 ? 'POSTCARD A' : 'POSTCARD B');
      ctx.restore();
    });

    drawConfetti(ctx, game);
  }

  return { draw };
}
