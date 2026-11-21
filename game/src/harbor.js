// harbor.js — Scene 1 "Harbor Dawn": a lighthouse point at sunrise.
// variant 0 draws the left postcard, variant 1 the right one; the seven
// planted differences are listed in `differences` with click centres.

import { circle, cloud, ellipse, fillRect, line, polygon, roundRect, skyGradient, waveLine } from './art.js';

export const harborDifferences = [
  { id: 'sun-rays', x: 470, y: 118, r: 58, label: 'the sun has fewer rays' },
  { id: 'small-cloud', x: 332, y: 62, r: 44, label: 'a small cloud is missing' },
  { id: 'third-gull', x: 418, y: 172, r: 32, label: 'one gull is missing' },
  { id: 'lighthouse-stripe', x: 96, y: 288, r: 36, label: 'the lighthouse stripe changed colour' },
  { id: 'lighthouse-flag', x: 108, y: 164, r: 28, label: 'the lighthouse flag is missing' },
  { id: 'sail-stripes', x: 332, y: 408, r: 42, label: 'the sail gained stripes' },
  { id: 'crate-count', x: 152, y: 492, r: 42, label: 'one crate is missing from the stack' },
];

function drawSun(ctx, variant) {
  const cx = 470, cy = 118, r = 44;
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  const rays = variant === 0 ? 8 : 6;
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2 + 0.2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * (r + 8), cy + Math.sin(a) * (r + 8));
    ctx.lineTo(cx + Math.cos(a) * (r + 26), cy + Math.sin(a) * (r + 26));
    ctx.stroke();
  }
  circle(ctx, cx, cy, r, '#ffdf6b');
  circle(ctx, cx, cy, r - 8, '#ffe98f');
  // sleepy sunrise face
  circle(ctx, cx - 13, cy - 4, 3.4, '#b97a1e');
  circle(ctx, cx + 13, cy - 4, 3.4, '#b97a1e');
  ctx.strokeStyle = '#b97a1e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy + 6, 12, 0.25, Math.PI - 0.25);
  ctx.stroke();
}

function drawGull(ctx, x, y, s) {
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3.4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x - 9 * s, y, 9 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 9 * s, y, 9 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
}

function drawLighthouse(ctx, variant) {
  // rocky point
  polygon(ctx, [[8, 402], [60, 372], [128, 368], [186, 402], [196, 430], [0, 430]], '#6e5a4e');
  polygon(ctx, [[30, 402], [70, 384], [120, 382], [150, 402]], '#85705f');
  // tower: stacked bands, slight taper
  const bands = [
    { y: 372, h: 34, w: 58 },
    { y: 338, h: 34, w: 54 },
    { y: 304, h: 34, w: 50 },
    { y: 270, h: 34, w: 47 },
    { y: 236, h: 34, w: 44 },
  ];
  const cx = 96;
  bands.forEach((band, i) => {
    let color = i % 2 === 0 ? '#f6f1e7' : '#d64541';
    if (variant === 1 && i === 2) color = '#3a6fd8'; // the stripe that changes
    fillRect(ctx, cx - band.w / 2, band.y, band.w, band.h, color);
  });
  // lamp room
  fillRect(ctx, cx - 26, 210, 52, 10, '#37404f');
  roundRect(ctx, cx - 17, 182, 34, 28, 4, '#ffd166');
  fillRect(ctx, cx - 3, 182, 6, 28, '#37404f');
  polygon(ctx, [[cx - 24, 182], [cx + 24, 182], [cx, 160]], '#37404f');
  // door + window
  roundRect(ctx, cx - 8, 378, 16, 26, 7, '#37404f');
  circle(ctx, cx, 320, 6, '#37404f');
  // pennant flag on the roof (missing on the right postcard)
  if (variant === 0) {
    line(ctx, cx, 160, cx, 138, '#37404f', 3);
    polygon(ctx, [[cx, 138], [cx + 26, 144], [cx, 150]], '#d64541');
  }
}

function drawSailboat(ctx, variant, t) {
  const x = 332, y = 452 + Math.sin(t * 1.4) * 3;
  // hull
  polygon(ctx, [[x - 44, y], [x + 44, y], [x + 30, y + 20], [x - 30, y + 20]], '#8a5a33');
  fillRect(ctx, x - 44, y - 5, 88, 6, '#a9713f');
  // mast + sails
  line(ctx, x, y, x, y - 78, '#5d4023', 4);
  if (variant === 0) {
    polygon(ctx, [[x + 4, y - 74], [x + 4, y - 8], [x + 40, y - 8]], '#fdf8ec');
  } else {
    polygon(ctx, [[x + 4, y - 74], [x + 4, y - 8], [x + 40, y - 8]], '#fdf8ec');
    // red stripes clipped roughly onto the sail triangle
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + 4, y - 74); ctx.lineTo(x + 4, y - 8); ctx.lineTo(x + 40, y - 8); ctx.closePath();
    ctx.clip();
    fillRect(ctx, x, y - 58, 46, 9, '#d64541');
    fillRect(ctx, x, y - 36, 46, 9, '#d64541');
    fillRect(ctx, x, y - 16, 46, 8, '#d64541');
    ctx.restore();
  }
  polygon(ctx, [[x - 4, y - 66], [x - 4, y - 10], [x - 30, y - 10]], '#f3e3bd');
  circle(ctx, x + 16, y + 8, 4, '#37404f');
}

function drawFishingBoat(ctx, t) {
  const x = 486, y = 478 + Math.sin(t * 1.1 + 2) * 3;
  polygon(ctx, [[x - 52, y], [x + 52, y], [x + 38, y + 22], [x - 38, y + 22]], '#2e6f6a');
  fillRect(ctx, x - 52, y - 5, 104, 6, '#37928b');
  roundRect(ctx, x - 16, y - 26, 32, 22, 4, '#fdf8ec');
  fillRect(ctx, x - 10, y - 20, 8, 8, '#37404f');
  fillRect(ctx, x + 4, y - 20, 8, 8, '#37404f');
  line(ctx, x + 26, y - 4, x + 26, y - 34, '#5d4023', 3);
  circle(ctx, x + 26, y - 38, 5, '#ffd166');
}

function drawCrates(ctx, variant) {
  const crate = (x, y, s) => {
    roundRect(ctx, x, y, s, s, 3, '#c08a4a');
    ctx.strokeStyle = '#8a5a33';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(x + 2, y + 2, s - 4, s - 4);
    line(ctx, x + 2, y + 2, x + s - 2, y + s - 2, '#8a5a33', 2);
    line(ctx, x + s - 2, y + 2, x + 2, y + s - 2, '#8a5a33', 2);
  };
  crate(118, 486, 40);
  crate(160, 486, 40);
  if (variant === 0) crate(139, 448, 40); // top crate only on the left postcard
}

export function drawHarbor(ctx, variant, t) {
  skyGradient(ctx, [[0, '#35507e'], [0.45, '#7d86b8'], [0.75, '#e89a6a'], [1, '#f7c873']], 384);
  drawSun(ctx, variant);
  cloud(ctx, 140, 92, 1.15, 'rgba(255,244,230,0.92)');
  if (variant === 0) cloud(ctx, 332, 62, 0.72, 'rgba(255,244,230,0.9)');
  cloud(ctx, 540, 210, 0.8, 'rgba(255,238,220,0.75)');
  drawGull(ctx, 204, 152, 1.1);
  drawGull(ctx, 262, 182, 0.9);
  if (variant === 0) drawGull(ctx, 418, 172, 1.0);
  // distant headland + shore houses
  polygon(ctx, [[420, 384], [470, 340], [560, 336], [600, 356], [600, 384]], '#7a6a58');
  roundRect(ctx, 492, 318, 34, 26, 3, '#fdf8ec');
  polygon(ctx, [[488, 318], [530, 318], [509, 302]], '#b5502e');
  roundRect(ctx, 540, 326, 28, 20, 3, '#f3e3bd');
  polygon(ctx, [[537, 326], [571, 326], [554, 312]], '#8a5a33');
  // sea
  fillRect(ctx, 0, 384, 600, 216, '#2f7f8f');
  fillRect(ctx, 0, 384, 600, 60, '#3d97a8');
  waveLine(ctx, 404, t * 1.6, 'rgba(255,255,255,0.35)', 3);
  waveLine(ctx, 452, t * 1.6 + 2, 'rgba(255,255,255,0.25)', 3);
  waveLine(ctx, 512, t * 1.6 + 4, 'rgba(255,255,255,0.2)', 3);
  waveLine(ctx, 560, t * 1.6 + 1, 'rgba(255,255,255,0.16)', 3);
  // sun glitter path
  for (let i = 0; i < 7; i++) {
    const gy = 396 + i * 26;
    const gw = 26 + i * 10 + Math.sin(t * 2 + i) * 5;
    ellipse(ctx, 470, gy, gw / 2, 3.5, 'rgba(255,214,120,0.5)');
  }
  drawLighthouse(ctx, variant);
  drawSailboat(ctx, variant, t);
  drawFishingBoat(ctx, t);
  // buoy
  polygon(ctx, [[232, 512], [252, 512], [246, 492], [238, 492]], '#d64541');
  fillRect(ctx, 236, 500, 12, 5, '#fdf8ec');
  // dock with crates
  fillRect(ctx, 0, 526, 300, 16, '#8a5a33');
  for (let i = 0; i < 6; i++) fillRect(ctx, 14 + i * 48, 542, 10, 58, '#6e4525');
  for (let i = 0; i < 7; i++) line(ctx, 8 + i * 44, 526, 8 + i * 44, 542, '#6e4525', 2);
  drawCrates(ctx, variant);
  // rope coil + barrel on the dock
  ctx.strokeStyle = '#d9c39a';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(240, 518, 12, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(240, 518, 6, 0, Math.PI * 2); ctx.stroke();
  roundRect(ctx, 262, 492, 26, 34, 6, '#a9713f');
  line(ctx, 262, 502, 288, 502, '#6e4525', 3);
  line(ctx, 262, 516, 288, 516, '#6e4525', 3);
}
