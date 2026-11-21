// market.js — Scene 3 "Night Market": lanterns, stalls and a rooftop cat.
// variant 0 draws the left postcard, variant 1 the right one; the eleven
// planted differences are listed in `differences` with click centres.

import { circle, ellipse, fillRect, glow, line, polygon, roundRect, skyGradient, sparkleStar, star, text } from './art.js';

export const marketDifferences = [
  { id: 'bright-star', x: 80, y: 70, r: 28, label: 'a bright star is missing' },
  { id: 'firework', x: 502, y: 92, r: 46, label: 'the firework burst is missing' },
  { id: 'lantern-colour', x: 300, y: 118, r: 32, label: 'one string lantern changed colour' },
  { id: 'rooftop-cat', x: 300, y: 204, r: 34, label: 'the rooftop cat is missing' },
  { id: 'banner-flag', x: 250, y: 262, r: 28, label: 'one banner flag changed colour' },
  { id: 'lit-window', x: 190, y: 298, r: 28, label: 'one window went dark' },
  { id: 'balloon-count', x: 552, y: 322, r: 44, label: 'one balloon is missing' },
  { id: 'awning-stripes', x: 140, y: 424, r: 50, label: 'the awning stripes changed colour' },
  { id: 'sign-shape', x: 458, y: 418, r: 36, label: 'the shop sign changed shape' },
  { id: 'fruit-pile', x: 140, y: 504, r: 42, label: 'the fruit changed from apples to oranges' },
  { id: 'bicycle', x: 62, y: 538, r: 46, label: 'the bicycle is missing' },
];

const SKY_STARS = [
  [150, 44], [230, 80], [350, 36], [420, 60], [560, 40], [40, 150], [580, 150], [200, 140],
];

function drawFirework(ctx) {
  const x = 502, y = 92;
  glow(ctx, x, y, 58, 'rgba(255,120,180,0.35)', 'rgba(255,120,180,0)');
  const colors = ['#ff7ab6', '#ffd166', '#7ae0ff', '#b6ff7a'];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const len = 26 + (i % 3) * 9;
    line(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, x + Math.cos(a) * len, y + Math.sin(a) * len, colors[i % 4], 3);
    circle(ctx, x + Math.cos(a) * (len + 5), y + Math.sin(a) * (len + 5), 2.6, colors[i % 4]);
  }
  circle(ctx, x, y, 5, '#fff3c4');
}

function drawLanternString(ctx, variant) {
  // sagging wire across the top with seven paper lanterns
  ctx.strokeStyle = '#0f1526';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-6, 66);
  ctx.quadraticCurveTo(300, 150, 606, 66);
  ctx.stroke();
  const colors = ['#ffd166', '#ff8c69', '#7ae0ff', '#ff5d5d', '#b6ff7a', '#ff8c69', '#ffd166'];
  for (let i = 0; i < 7; i++) {
    const u = (i + 0.5) / 7;
    const x = -6 + u * 612;
    const y = (1 - u) * (1 - u) * 66 + 2 * (1 - u) * u * 150 + u * u * 66;
    let color = colors[i];
    if (variant === 1 && i === 3) color = '#ffd166'; // middle lantern turns gold
    glow(ctx, x, y + 16, 26, 'rgba(255,190,90,0.35)', 'rgba(255,190,90,0)');
    line(ctx, x, y, x, y + 6, '#0f1526', 2.5);
    ellipse(ctx, x, y + 17, 13, 12, color);
    fillRect(ctx, x - 6, y + 4, 12, 4, '#8a5a33');
    fillRect(ctx, x - 6, y + 26, 12, 4, '#8a5a33');
    line(ctx, x, y + 30, x, y + 38, '#d64541', 2.5);
  }
}

function drawBuildings(ctx, variant) {
  const buildings = [
    { x: 6, w: 110, top: 210, color: '#3b3f66' },
    { x: 124, w: 128, top: 178, color: '#454a78' },
    { x: 260, w: 120, top: 222, color: '#3b3f66' },
    { x: 388, w: 104, top: 196, color: '#4a4f82' },
    { x: 500, w: 94, top: 232, color: '#3b3f66' },
  ];
  for (const b of buildings) {
    fillRect(ctx, b.x, b.top, b.w, 600 - b.top, b.color);
    fillRect(ctx, b.x - 4, b.top - 8, b.w + 8, 10, '#2a2e4f');
    // windows: a fixed lit pattern, one window differs
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        const wx = b.x + 14 + col * ((b.w - 28) / 3);
        const wy = b.top + 22 + row * 44;
        if (wy > 420) continue;
        let lit = (row * 3 + col + b.x) % 3 !== 0;
        if (b.x === 124 && row === 1 && col === 1) lit = variant === 0; // the window that goes dark
        roundRect(ctx, wx, wy, 20, 26, 3, lit ? '#ffd98a' : '#232743');
        if (lit) fillRect(ctx, wx + 9, wy, 2, 26, '#d9a84e');
      }
    }
  }
  // rooftop water tank + antenna (same on both)
  roundRect(ctx, 404, 158, 40, 38, 5, '#2a2e4f');
  polygon(ctx, [[400, 158], [448, 158], [424, 140]], '#232743');
  line(ctx, 60, 202, 60, 150, '#232743', 3);
  line(ctx, 44, 162, 76, 162, '#232743', 2.5);
  line(ctx, 48, 176, 72, 176, '#232743', 2.5);
}

function drawCat(ctx) {
  const x = 300, y = 204;
  // sitting cat silhouette on the middle roof edge
  ellipse(ctx, x, y + 6, 15, 17, '#171b30');
  circle(ctx, x, y - 13, 11, '#171b30');
  polygon(ctx, [[x - 10, y - 19], [x - 8, y - 29], [x - 2, y - 20]], '#171b30');
  polygon(ctx, [[x + 10, y - 19], [x + 8, y - 29], [x + 2, y - 20]], '#171b30');
  ctx.strokeStyle = '#171b30';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x + 13, y + 16);
  ctx.quadraticCurveTo(x + 34, y + 14, x + 30, y - 4);
  ctx.stroke();
  circle(ctx, x - 4, y - 13, 1.8, '#ffd166');
  circle(ctx, x + 4, y - 13, 1.8, '#ffd166');
}

function drawBanner(ctx, variant) {
  ctx.strokeStyle = '#0f1526';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(60, 238);
  ctx.quadraticCurveTo(300, 286, 540, 238);
  ctx.stroke();
  const colors = ['#ff5d5d', '#ffd166', '#7ae0ff', '#b6ff7a', '#2ec4b6', '#ff8c69', '#ff7ab6', '#ffd166', '#7ae0ff'];
  for (let i = 0; i < 9; i++) {
    const u = (i + 0.5) / 9;
    const x = 60 + u * 480;
    const y = (1 - u) * (1 - u) * 238 + 2 * (1 - u) * u * 286 + u * u * 238;
    let color = colors[i];
    if (variant === 1 && i === 4) color = '#ff7ab6'; // middle flag turns pink
    polygon(ctx, [[x - 13, y], [x + 13, y], [x, y + 24]], color);
  }
}

function drawStall(ctx, x, variant, isLeft) {
  const counterY = 520;
  // posts
  fillRect(ctx, x - 78, 430, 8, 150, '#5d4023');
  fillRect(ctx, x + 70, 430, 8, 150, '#5d4023');
  // awning with stripes
  const stripeA = isLeft && variant === 1 ? '#3a6fd8' : '#d64541';
  for (let i = 0; i < 7; i++) {
    fillRect(ctx, x - 88 + i * 25.2, 404, 25.2, 30, i % 2 === 0 ? stripeA : '#fdf8ec');
  }
  for (let i = 0; i < 7; i++) {
    ctx.fillStyle = i % 2 === 0 ? stripeA : '#fdf8ec';
    ctx.beginPath();
    ctx.arc(x - 88 + i * 25.2 + 12.6, 434, 12.6, 0, Math.PI);
    ctx.fill();
  }
  // counter
  fillRect(ctx, x - 84, counterY, 168, 14, '#8a5a33');
  fillRect(ctx, x - 84, counterY + 14, 168, 66, '#6e4525');
  for (let i = 0; i < 5; i++) line(ctx, x - 50 + i * 26, counterY + 14, x - 50 + i * 26, counterY + 80, '#5d4023', 2);
  if (isLeft) {
    // fruit pile: apples on the left postcard, oranges on the right
    const fruit = variant === 0 ? '#e03a2f' : '#f59a23';
    const leaf = '#3f8f5f';
    const pile = [[-46, 506], [-24, 506], [0, 506], [24, 506], [46, 506], [-34, 488], [-11, 488], [12, 488], [34, 488], [0, 472]];
    for (const [dx, fy] of pile) {
      circle(ctx, x + dx, fy, 12, fruit);
      ellipse(ctx, x + dx + 5, fy - 11, 5, 3, leaf);
    }
    // jars beside the fruit
    roundRect(ctx, x + 56, 484, 16, 34, 4, '#7ae0ff');
    roundRect(ctx, x + 56, 478, 16, 7, 3, '#d64541');
  } else {
    // bottles and jars on the right stall
    const bottle = (bx, color) => {
      roundRect(ctx, bx, 482, 15, 36, 5, color);
      fillRect(ctx, bx + 4, 472, 7, 10, color);
      fillRect(ctx, bx + 3, 468, 9, 5, '#8a5a33');
    };
    bottle(x - 66, '#7ae0ff');
    bottle(x - 44, '#b6ff7a');
    bottle(x - 22, '#ff8c69');
    roundRect(ctx, x + 8, 490, 30, 28, 6, '#ffd166');
    roundRect(ctx, x + 44, 494, 24, 24, 6, '#ff7ab6');
    // hanging sign: round on the left postcard, square on the right
    line(ctx, x + 58, 434, x + 58, 402, '#0f1526', 2.5);
    if (variant === 0) {
      circle(ctx, x + 58, 418, 19, '#fdf8ec');
      ctx.strokeStyle = '#d64541';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x + 58, 418, 19, 0, Math.PI * 2); ctx.stroke();
      text(ctx, 'TEA', x + 58, 419, 13, '#d64541');
    } else {
      roundRect(ctx, x + 39, 399, 38, 38, 4, '#fdf8ec');
      ctx.strokeStyle = '#d64541';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 39, 399, 38, 38);
      text(ctx, 'TEA', x + 58, 419, 13, '#d64541');
    }
  }
}

function drawBalloons(ctx, variant) {
  const balloon = (x, y, color) => {
    ctx.strokeStyle = 'rgba(240,240,255,0.7)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x, y + 22);
    ctx.quadraticCurveTo(x + 6, y + 52, x - 4, y + 84);
    ctx.stroke();
    ellipse(ctx, x, y, 17, 21, color);
    polygon(ctx, [[x - 4, y + 20], [x + 4, y + 20], [x, y + 27]], color);
    ellipse(ctx, x - 6, y - 7, 4.5, 7, 'rgba(255,255,255,0.55)');
  };
  balloon(536, 306, '#ff5d5d');
  balloon(566, 326, '#ffd166');
  if (variant === 0) balloon(552, 282, '#7ae0ff');
}

function drawBicycle(ctx) {
  const x = 62, y = 538;
  ctx.strokeStyle = '#d9d9e8';
  ctx.lineWidth = 3.4;
  ctx.beginPath(); ctx.arc(x - 26, y + 16, 16, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(x + 28, y + 16, 16, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#ff5d5d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 26, y + 16); ctx.lineTo(x - 2, y - 12); ctx.lineTo(x + 24, y - 10);
  ctx.moveTo(x - 2, y - 12); ctx.lineTo(x + 4, y + 16); ctx.lineTo(x + 28, y + 16);
  ctx.moveTo(x + 24, y - 10); ctx.lineTo(x + 28, y + 16);
  ctx.stroke();
  line(ctx, x - 8, y - 14, x + 4, y - 14, '#37404f', 5);
  line(ctx, x + 24, y - 10, x + 30, y - 18, '#37404f', 4);
  // basket with a baguette
  polygon(ctx, [[x + 22, y - 6], [x + 42, y - 6], [x + 38, y + 8], [x + 26, y + 8]], '#c9a86f');
  line(ctx, x + 30, y - 6, x + 40, y - 20, '#e8c88a', 6);
}

export function drawMarket(ctx, variant, t) {
  skyGradient(ctx, [[0, '#1b1e3f'], [0.55, '#2c2a55'], [1, '#4a3560']], 600);
  for (const [sx, sy] of SKY_STARS) sparkleStar(ctx, sx, sy, 4.5, 'rgba(255,248,220,0.8)');
  if (variant === 0) sparkleStar(ctx, 80, 70, 9, '#fff3c4');
  // crescent moon (same on both)
  circle(ctx, 128, 96, 22, '#fdf3c4');
  circle(ctx, 138, 90, 19, '#22224a');
  if (variant === 0) drawFirework(ctx);
  drawBuildings(ctx, variant);
  if (variant === 0) drawCat(ctx);
  drawBanner(ctx, variant);
  drawLanternString(ctx, variant);
  // street
  fillRect(ctx, 0, 580, 600, 20, '#241f38');
  for (let i = 0; i < 10; i++) ellipse(ctx, 34 + i * 60, 590, 20, 5, '#322b4a');
  drawStall(ctx, 140, variant, true);
  drawStall(ctx, 400, variant, false);
  drawBalloons(ctx, variant);
  if (variant === 0) drawBicycle(ctx);
  // string lights glow pools on the street
  glow(ctx, 140, 560, 90, 'rgba(255,180,80,0.16)', 'rgba(255,180,80,0)');
  glow(ctx, 400, 560, 90, 'rgba(255,180,80,0.16)', 'rgba(255,180,80,0)');
  // drifting paper scraps (same phase on both)
  for (let i = 0; i < 3; i++) {
    const px = ((t * 18 + i * 210) % 640) - 20;
    const py = 470 + Math.sin(t * 1.4 + i * 2) * 14 + i * 26;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(Math.sin(t + i) * 0.6);
    fillRect(ctx, -6, -4, 12, 8, 'rgba(253,248,236,0.75)');
    ctx.restore();
  }
}
