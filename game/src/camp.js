// camp.js — Scene 2 "Forest Camp": a tent and campfire under the pines.
// variant 0 draws the left postcard, variant 1 the right one; the nine
// planted differences are listed in `differences` with click centres.

import { circle, ellipse, fillRect, glow, line, pineTree, polygon, roundRect, skyGradient, sparkleStar, star } from './art.js';

export const campDifferences = [
  { id: 'moon-shape', x: 502, y: 88, r: 44, label: 'the moon changed shape' },
  { id: 'pine-star', x: 68, y: 148, r: 30, label: 'the star on the tall pine is missing' },
  { id: 'owl-eyes', x: 482, y: 296, r: 32, label: 'the owl fell asleep' },
  { id: 'tent-door', x: 202, y: 442, r: 46, label: 'the tent door was zipped shut' },
  { id: 'kettle', x: 342, y: 442, r: 38, label: 'the kettle over the fire is missing' },
  { id: 'fire-logs', x: 342, y: 508, r: 32, label: 'one log is missing from the fire' },
  { id: 'lantern-glow', x: 108, y: 492, r: 36, label: 'the lantern went out' },
  { id: 'backpack-colour', x: 286, y: 504, r: 34, label: 'the backpack changed colour' },
  { id: 'mushroom-count', x: 432, y: 538, r: 36, label: 'one mushroom is missing' },
];

const STARS = [
  [40, 60], [120, 110], [200, 50], [280, 90], [360, 40], [420, 130], [560, 160],
  [90, 190], [300, 170], [540, 50], [170, 220], [450, 200],
];

function drawMoon(ctx, variant) {
  const x = 502, y = 88, r = 34;
  glow(ctx, x, y, 70, 'rgba(255,244,190,0.35)', 'rgba(255,244,190,0)');
  circle(ctx, x, y, r, '#fdf3c4');
  if (variant === 1) {
    // bite a crescent out of it with sky-coloured circle
    circle(ctx, x + 16, y - 8, r - 4, '#1d2a52');
  } else {
    circle(ctx, x - 10, y - 6, 6, '#e8d9a0');
    circle(ctx, x + 8, y + 10, 4.5, '#e8d9a0');
    circle(ctx, x + 12, y - 12, 3.5, '#e8d9a0');
  }
}

function drawTent(ctx, variant) {
  const x = 202, ground = 492;
  // guy ropes
  line(ctx, x - 108, ground, x - 60, ground - 62, '#d9c39a', 2.5);
  line(ctx, x + 108, ground, x + 60, ground - 62, '#d9c39a', 2.5);
  // tent body
  polygon(ctx, [[x - 96, ground], [x + 96, ground], [x, ground - 118]], '#e07b39');
  polygon(ctx, [[x - 96, ground], [x, ground], [x, ground - 118]], '#c9662c');
  // door
  if (variant === 0) {
    polygon(ctx, [[x - 30, ground], [x + 30, ground], [x, ground - 66]], '#3a2410');
    polygon(ctx, [[x - 30, ground], [x, ground], [x, ground - 66]], '#2a1a0a');
  } else {
    polygon(ctx, [[x - 30, ground], [x + 30, ground], [x, ground - 66]], '#a8551f');
    line(ctx, x, ground - 64, x, ground - 4, '#7a3c14', 3.5);
    for (let i = 0; i < 5; i++) line(ctx, x - 5, ground - 52 + i * 11, x + 5, ground - 52 + i * 11, '#7a3c14', 2);
  }
  // little flag on the peak
  line(ctx, x, ground - 118, x, ground - 136, '#5d4023', 3);
  polygon(ctx, [[x, ground - 136], [x + 20, ground - 130], [x, ground - 124]], '#ffd166');
  // sleeping mat rolled by the door
  roundRect(ctx, x - 78, ground - 14, 44, 14, 7, '#4a7fb5');
}

function drawCampfire(ctx, variant, t) {
  const x = 342, ground = 522;
  glow(ctx, x, ground - 26, 95, 'rgba(255,150,50,0.4)', 'rgba(255,150,50,0)');
  // stones
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    ellipse(ctx, x + Math.cos(a) * 44, ground + Math.sin(a) * 10, 11, 7, '#7d7468');
  }
  // logs (three on the left postcard, two on the right)
  const log = (lx, ly, angle) => {
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(angle);
    roundRect(ctx, -30, -6, 60, 12, 6, '#7a4d2a');
    circle(ctx, -28, 0, 5, '#c9a86f');
    ctx.restore();
  };
  log(x - 12, ground - 4, 0.35);
  log(x + 12, ground - 4, -0.35);
  if (variant === 0) log(x, ground - 12, 0.05);
  // flames (same flicker phase on both postcards)
  const flick = Math.sin(t * 9) * 3 + Math.sin(t * 23) * 2;
  polygon(ctx, [[x - 20, ground - 8], [x + 20, ground - 8], [x + flick, ground - 58]], '#e85d1f');
  polygon(ctx, [[x - 13, ground - 8], [x + 13, ground - 8], [x - flick, ground - 44]], '#f59a23');
  polygon(ctx, [[x - 7, ground - 8], [x + 7, ground - 8], [x + flick * 0.5, ground - 30]], '#ffd166');
  // tripod + kettle (kettle only on the left postcard)
  line(ctx, x - 30, ground, x, ground - 84, '#5d4023', 4);
  line(ctx, x + 30, ground, x, ground - 84, '#5d4023', 4);
  if (variant === 0) {
    line(ctx, x, ground - 84, x, ground - 64, '#37404f', 2.5);
    roundRect(ctx, x - 15, ground - 64, 30, 22, 6, '#37404f');
    ctx.strokeStyle = '#37404f';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, ground - 64, 11, Math.PI, 0); ctx.stroke();
    circle(ctx, x, ground - 53, 3, '#9fb4c8');
  }
  // sparks
  for (let i = 0; i < 5; i++) {
    const sx = x + Math.sin(t * 2.2 + i * 2.4) * 14;
    const sy = ground - 40 - ((t * 26 + i * 17) % 46);
    circle(ctx, sx, sy, 2, 'rgba(255,190,90,0.9)');
  }
}

function drawOwl(ctx, variant) {
  const x = 482, y = 296;
  // branch
  line(ctx, x - 46, y + 34, x + 46, y + 26, '#5d4023', 7);
  // body
  ellipse(ctx, x, y + 8, 24, 30, '#8a6a45');
  ellipse(ctx, x, y + 16, 15, 19, '#c9a86f');
  // ear tufts
  polygon(ctx, [[x - 20, y - 16], [x - 12, y - 26], [x - 6, y - 14]], '#8a6a45');
  polygon(ctx, [[x + 20, y - 16], [x + 12, y - 26], [x + 6, y - 14]], '#8a6a45');
  // face
  circle(ctx, x - 9, y - 4, 8.5, '#f3e3bd');
  circle(ctx, x + 9, y - 4, 8.5, '#f3e3bd');
  if (variant === 0) {
    circle(ctx, x - 9, y - 4, 3.6, '#241a10');
    circle(ctx, x + 9, y - 4, 3.6, '#241a10');
    circle(ctx, x - 10.4, y - 5.6, 1.2, '#ffffff');
    circle(ctx, x + 7.6, y - 5.6, 1.2, '#ffffff');
  } else {
    ctx.strokeStyle = '#241a10';
    ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.arc(x - 9, y - 6, 5, 0.3, Math.PI - 0.3); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + 9, y - 6, 5, 0.3, Math.PI - 0.3); ctx.stroke();
    ctx.fillStyle = '#c9a86f';
    ctx.font = 'bold 13px Georgia, serif';
    ctx.fillText('z', x + 26, y - 18);
    ctx.font = 'bold 10px Georgia, serif';
    ctx.fillText('z', x + 33, y - 27);
  }
  polygon(ctx, [[x - 4, y + 3], [x + 4, y + 3], [x, y + 9]], '#e8a13c');
  // feet
  line(ctx, x - 10, y + 34, x - 14, y + 40, '#e8a13c', 3);
  line(ctx, x + 10, y + 33, x + 6, y + 40, '#e8a13c', 3);
}

function drawLantern(ctx, variant) {
  const x = 108, y = 492;
  // stump
  roundRect(ctx, x - 20, y + 16, 40, 30, 4, '#7a4d2a');
  ellipse(ctx, x, y + 16, 20, 6, '#c9a86f');
  if (variant === 0) glow(ctx, x, y - 8, 52, 'rgba(255,200,90,0.5)', 'rgba(255,200,90,0)');
  // lantern body
  roundRect(ctx, x - 13, y - 26, 26, 34, 5, '#37404f');
  roundRect(ctx, x - 9, y - 21, 18, 24, 4, variant === 0 ? '#ffd98a' : '#5a6a7a');
  ctx.strokeStyle = '#37404f';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(x, y - 26, 9, Math.PI, 0); ctx.stroke();
  fillRect(ctx, x - 15, y + 6, 30, 5, '#37404f');
}

function drawBackpack(ctx, variant) {
  const x = 286, y = 504;
  const body = variant === 0 ? '#3f8f5f' : '#e07b39';
  const flap = variant === 0 ? '#2f6f49' : '#b55a24';
  roundRect(ctx, x - 20, y - 26, 40, 52, 12, body);
  roundRect(ctx, x - 20, y - 26, 40, 18, 9, flap);
  roundRect(ctx, x - 12, y + 2, 24, 18, 6, flap);
  circle(ctx, x, y + 11, 3, '#ffd166');
  ctx.strokeStyle = '#5d4023';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(x, y - 26, 8, Math.PI, 0); ctx.stroke();
  // bedroll on top
  roundRect(ctx, x - 22, y - 40, 44, 13, 6, '#b5502e');
}

function drawMushrooms(ctx, variant) {
  const mushroom = (x, y, s) => {
    fillRect(ctx, x - 3 * s, y - 10 * s, 6 * s, 12 * s, '#f3e3bd');
    ctx.fillStyle = '#d64541';
    ctx.beginPath();
    ctx.ellipse(x, y - 10 * s, 11 * s, 7 * s, 0, Math.PI, 0);
    ctx.fill();
    circle(ctx, x - 4 * s, y - 13 * s, 1.8 * s, '#fdf8ec');
    circle(ctx, x + 3 * s, y - 15 * s, 1.5 * s, '#fdf8ec');
  };
  mushroom(416, 544, 1.1);
  mushroom(446, 546, 0.85);
  if (variant === 0) mushroom(431, 534, 0.95);
}

export function drawCamp(ctx, variant, t) {
  skyGradient(ctx, [[0, '#141f42'], [0.6, '#1d2a52'], [1, '#2c4470']], 340);
  for (const [sx, sy] of STARS) sparkleStar(ctx, sx, sy, 5, 'rgba(255,248,220,0.85)');
  drawMoon(ctx, variant);
  // back pines
  pineTree(ctx, 68, 350, 200, '#4a3421', '#1f4d33');
  if (variant === 0) star(ctx, 68, 148, 13, '#ffd166');
  pineTree(ctx, 150, 352, 150, '#4a3421', '#265c3d');
  pineTree(ctx, 262, 350, 176, '#4a3421', '#1f4d33');
  pineTree(ctx, 392, 352, 140, '#4a3421', '#265c3d');
  pineTree(ctx, 540, 350, 186, '#4a3421', '#1f4d33');
  // owl's tree trunk on the right
  fillRect(ctx, 472, 300, 16, 120, '#5d4023');
  // ground
  fillRect(ctx, 0, 340, 600, 260, '#22402e');
  ellipse(ctx, 300, 356, 340, 26, '#2a4d38');
  // grass tufts
  ctx.strokeStyle = '#3d7a52';
  ctx.lineWidth = 2.4;
  for (let i = 0; i < 16; i++) {
    const gx = 24 + i * 37 + (i % 3) * 6;
    const gy = 470 + (i % 4) * 30;
    ctx.beginPath();
    ctx.moveTo(gx, gy); ctx.lineTo(gx - 4, gy - 10);
    ctx.moveTo(gx + 5, gy); ctx.lineTo(gx + 6, gy - 12);
    ctx.moveTo(gx + 10, gy); ctx.lineTo(gx + 14, gy - 9);
    ctx.stroke();
  }
  drawTent(ctx, variant);
  drawCampfire(ctx, variant, t);
  drawOwl(ctx, variant);
  drawLantern(ctx, variant);
  drawBackpack(ctx, variant);
  drawMushrooms(ctx, variant);
  // log pile (same on both)
  const pileLog = (x, y) => { roundRect(ctx, x, y, 52, 13, 6, '#7a4d2a'); circle(ctx, x + 6, y + 6, 4.5, '#c9a86f'); };
  pileLog(496, 528); pileLog(496, 514); pileLog(502, 500);
  // fireflies (same phase on both)
  for (let i = 0; i < 6; i++) {
    const fx = 60 + i * 92 + Math.sin(t * 0.9 + i * 1.7) * 16;
    const fy = 400 + (i % 3) * 44 + Math.cos(t * 1.3 + i) * 9;
    glow(ctx, fx, fy, 10, 'rgba(200,255,150,0.55)', 'rgba(200,255,150,0)');
    circle(ctx, fx, fy, 2.2, '#d8ffa8');
  }
}
