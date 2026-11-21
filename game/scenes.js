// scenes.js — the five dioramas. Each scene paints itself for variant 0 (Exhibit A)
// and variant 1 (Exhibit B); the two paintings differ only at the listed difference
// spots. `t` is a gentle animation clock shared by both panels, so ambient motion
// (drifting clouds, rising bubbles, twinkling stars) is identical on both sides and
// never counts as a difference.

import {
  W, H, sky, circle, ellipse, rect, roundRect, triangle, line,
  cloud, sun, star, sparkle, tree, pine, house, windowPane,
  fish, bubble, bookSpine, crate, lantern, text,
} from './shapes.js';

/* ------------------------------------------------------------------ */
/* Scene 1 — Sunny Farmyard (8 differences)                            */
/* ------------------------------------------------------------------ */

function paintFarmyard(ctx, v, t) {
  sky(ctx, '#7ec8f7', '#fdf3c4');
  // sun: 8 rays in A, 6 in B  (difference 1)
  sun(ctx, 510, 70, 30, v === 0 ? 8 : 6, '#ffd93b', '#ffb703');
  // clouds: the left cloud is big in A, small and higher in B  (difference 2)
  const drift = Math.sin(t * 0.3) * 4;
  if (v === 0) cloud(ctx, 90 + drift, 78, 1.25, '#ffffff');
  else cloud(ctx, 90 + drift, 58, 0.8, '#ffffff');
  cloud(ctx, 290 - drift, 52, 0.9, '#ffffff');
  cloud(ctx, 420 + drift, 110, 0.7, '#fdfdfd');

  // ground
  rect(ctx, 0, 330, W, H - 330, '#7ec850');
  rect(ctx, 0, 330, W, 10, '#69b23e');
  ellipse(ctx, 300, 352, 330, 14, '#8fd45e');

  // barn
  rect(ctx, 60, 230, 140, 110, '#c0392b');
  triangle(ctx, 48, 232, 212, 232, 130, 178, '#7b241c');
  rect(ctx, 118, 196, 24, 24, '#f5e6c8'); // hayloft window
  line(ctx, 118, 208, 142, 208, '#7b241c', 3);
  // barn door: closed with X brace in A, open dark doorway in B  (difference 3)
  if (v === 0) {
    rect(ctx, 104, 268, 52, 72, '#922b21');
    ctx.strokeStyle = '#f5e6c8';
    ctx.lineWidth = 4;
    ctx.strokeRect(106, 270, 48, 68);
    line(ctx, 106, 270, 154, 338, '#f5e6c8', 4);
    line(ctx, 154, 270, 106, 338, '#f5e6c8', 4);
  } else {
    rect(ctx, 104, 268, 52, 72, '#2b1408');
    rect(ctx, 100, 268, 6, 72, '#922b21');
    rect(ctx, 154, 268, 6, 72, '#922b21');
  }

  // silo
  rect(ctx, 214, 180, 38, 160, '#bdc3c7');
  ctx.fillStyle = '#95a5a6';
  ctx.beginPath();
  ctx.arc(233, 180, 19, Math.PI, 0);
  ctx.fill();
  line(ctx, 214, 230, 252, 230, '#95a5a6', 3);
  line(ctx, 214, 280, 252, 280, '#95a5a6', 3);

  // windmill: blades at 0 degrees in A, rotated 45 degrees in B  (difference 4)
  triangle(ctx, 472, 340, 508, 340, 490, 196, '#8d6e63');
  const bladeAngle = v === 0 ? 0 : Math.PI / 4;
  ctx.strokeStyle = '#5d4037';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  for (let i = 0; i < 4; i++) {
    const a = bladeAngle + (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.moveTo(490, 182);
    ctx.lineTo(490 + Math.cos(a) * 46, 182 + Math.sin(a) * 46);
    ctx.stroke();
  }
  circle(ctx, 490, 182, 8, '#3e2723');

  // apple tree: 5 apples in A, 3 in B  (difference 5)
  tree(ctx, 36, 344, 1.15, '#2e9e4f', '#6d4c2f');
  const apples = [[22, 268], [48, 258], [36, 288], [58, 282], [14, 290]];
  const shown = v === 0 ? apples : apples.slice(0, 3);
  for (const [ax, ay] of shown) circle(ctx, ax, ay, 5, '#e74c3c');

  // fence
  for (let x = 8; x < W; x += 44) rect(ctx, x, 352, 7, 34, '#a9743f');
  rect(ctx, 0, 360, W, 6, '#bd8650');
  rect(ctx, 0, 374, W, 6, '#bd8650');

  // tractor: big rear wheel in A, small in B  (difference 6)
  rect(ctx, 282, 356, 58, 22, '#27ae60');
  rect(ctx, 292, 334, 30, 24, '#1e8449');
  rect(ctx, 296, 338, 22, 14, '#aee6f5');
  rect(ctx, 336, 340, 5, 18, '#555555');
  circle(ctx, 340, 382, 11, '#2c3e50');
  circle(ctx, 340, 382, 5, '#bdc3c7');
  const rearR = v === 0 ? 19 : 12;
  circle(ctx, 294, 378, rearR, '#2c3e50');
  circle(ctx, 294, 378, rearR * 0.45, '#bdc3c7');

  // cow: 3 spots in A, 2 in B  (difference 7)
  ellipse(ctx, 440, 386, 34, 20, '#fdfdfd');
  circle(ctx, 474, 374, 13, '#fdfdfd');
  ellipse(ctx, 482, 380, 8, 6, '#f5b7c8');
  circle(ctx, 470, 370, 2.5, '#222222');
  rect(ctx, 418, 400, 6, 16, '#fdfdfd');
  rect(ctx, 452, 400, 6, 16, '#fdfdfd');
  ellipse(ctx, 428, 380, 9, 6, '#4a3728');
  ellipse(ctx, 452, 392, 7, 5, '#4a3728');
  if (v === 0) ellipse(ctx, 442, 374, 6, 4, '#4a3728');

  // hay bales: two in A, one in B  (difference 8)
  ellipse(ctx, 248, 404, 20, 13, '#f2c94c');
  ctx.strokeStyle = '#d9a62e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(248, 404, 12, 8, 0, 0, Math.PI * 2);
  ctx.stroke();
  if (v === 0) {
    ellipse(ctx, 290, 408, 18, 12, '#f2c94c');
    ctx.beginPath();
    ctx.ellipse(290, 408, 10, 7, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // chickens (identical in both)
  for (const [cx, cy] of [[150, 412], [520, 416], [556, 408]]) {
    ellipse(ctx, cx, cy, 9, 7, '#ffffff');
    circle(ctx, cx + 8, cy - 6, 4.5, '#ffffff');
    triangle(ctx, cx + 12, cy - 6, cx + 17, cy - 4, cx + 12, cy - 2, '#f39c12');
    circle(ctx, cx + 9, cy - 7, 1.2, '#222222');
  }
}

/* ------------------------------------------------------------------ */
/* Scene 2 — Cozy Bookshop (9 differences)                             */
/* ------------------------------------------------------------------ */

function paintBookshop(ctx, v, t) {
  sky(ctx, '#5b3a29', '#3e2718');
  rect(ctx, 0, 380, W, 70, '#7a5230');
  for (let x = 0; x < W; x += 60) line(ctx, x, 380, x - 14, 450, '#664325', 3);
  ellipse(ctx, 330, 418, 150, 22, '#8e2f3c'); // rug
  ellipse(ctx, 330, 418, 120, 16, '#a83a4a');

  // bookshelves
  const shelfBooks = (sx, flipColor) => {
    rect(ctx, sx, 86, 190, 250, '#4a2f1d');
    for (let s = 0; s < 3; s++) {
      const sy = 96 + s * 80;
      rect(ctx, sx + 8, sy + 62, 174, 8, '#6d4525');
      let bx = sx + 14;
      const colors = ['#c0392b', '#2471a3', '#229954', '#b7950b', '#7d3c98', '#ca6f1e', '#148f77'];
      for (let i = 0; i < 9; i++) {
        const bw = 12 + ((i * 7 + s * 3) % 8);
        let c = colors[(i + s * 2) % colors.length];
        if (flipColor && s === 0 && i === 3) c = v === 0 ? '#e74c3c' : '#2e86ff'; // difference 5
        bookSpine(ctx, bx, sy + 62 - 52, bw, 52, c);
        bx += bw + 4;
      }
    }
  };
  shelfBooks(24, true);
  shelfBooks(386, false);

  // window with rain
  rect(ctx, 246, 74, 108, 150, '#2c3e50');
  rect(ctx, 254, 82, 92, 134, '#5d7d99');
  for (let i = 0; i < 14; i++) {
    const rx = 260 + ((i * 37) % 80);
    const ry = 90 + ((i * 53 + Math.floor(t * 30)) % 120);
    line(ctx, rx, ry, rx - 3, ry + 10, 'rgba(210,235,255,0.7)', 1.5);
  }
  line(ctx, 300, 82, 300, 216, '#2c3e50', 5);
  line(ctx, 254, 149, 346, 149, '#2c3e50', 5);
  // curtains: tied back in A, drawn shut on the left in B  (difference 8)
  triangle(ctx, 254, 82, 282, 82, 254, 170, '#a83a4a');
  if (v === 0) triangle(ctx, 346, 82, 318, 82, 346, 170, '#a83a4a');
  else rect(ctx, 254, 82, 34, 134, '#a83a4a');
  // window sign: OPEN in A, CLOSED in B  (difference 4)
  roundRect(ctx, 272, 128, 56, 22, 4, '#f6ecd9');
  text(ctx, v === 0 ? 'OPEN' : 'CLOSED', 300, 140, 11, '#8e2f3c');

  // wall clock: 3:00 in A, 6:30 in B  (difference 1)
  circle(ctx, 300, 44, 24, '#f6ecd9');
  ctx.strokeStyle = '#3a2c1c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(300, 44, 24, 0, Math.PI * 2);
  ctx.stroke();
  const hourA = v === 0 ? 0 : Math.PI / 2 + Math.PI / 6;
  const minA = v === 0 ? -Math.PI / 2 : Math.PI / 2;
  line(ctx, 300, 44, 300 + Math.cos(hourA) * 12, 44 + Math.sin(hourA) * 12, '#3a2c1c', 3.5);
  line(ctx, 300, 44, 300 + Math.cos(minA) * 18, 44 + Math.sin(minA) * 18, '#3a2c1c', 2.5);
  circle(ctx, 300, 44, 3, '#8e2f3c');

  // armchair
  roundRect(ctx, 258, 312, 84, 62, 12, '#7d3c98');
  roundRect(ctx, 248, 338, 22, 44, 9, '#6c3483');
  roundRect(ctx, 330, 338, 22, 44, 9, '#6c3483');
  roundRect(ctx, 262, 352, 76, 26, 8, '#8e44ad');
  rect(ctx, 262, 380, 10, 12, '#4a2f1d');
  rect(ctx, 328, 380, 10, 12, '#4a2f1d');

  // side table + mug: mug present in A, gone in B  (difference 7)
  rect(ctx, 358, 366, 44, 6, '#6d4525');
  rect(ctx, 376, 372, 6, 26, '#54371f');
  if (v === 0) {
    roundRect(ctx, 368, 352, 16, 14, 3, '#e67e22');
    ctx.strokeStyle = '#e67e22';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(387, 359, 5, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }

  // floor lamp: lit in A, dark in B  (difference 2)
  rect(ctx, 448, 356, 6, 44, '#3a2c1c');
  rect(ctx, 434, 398, 34, 6, '#3a2c1c');
  if (v === 0) circle(ctx, 451, 300, 34, 'rgba(255,205,90,0.35)');
  triangle(ctx, 428, 316, 474, 316, 451, 282, v === 0 ? '#ffd977' : '#8a7a5c');

  // plant: 5 leaves in A, 3 in B  (difference 6)
  triangle(ctx, 196, 380, 224, 380, 218, 348, '#b3543f');
  rect(ctx, 194, 344, 32, 8, '#9c4633');
  const leaves = [[210, 316], [194, 326], [226, 326], [200, 304], [220, 304]];
  const leafShown = v === 0 ? leaves : leaves.slice(0, 3);
  for (const [lx, ly] of leafShown) ellipse(ctx, lx, ly, 7, 13, '#27ae60');

  // cat on the rug: eyes open in A, closed in B  (difference 3)
  ellipse(ctx, 150, 408, 26, 13, '#e67e22');
  circle(ctx, 174, 400, 11, '#e67e22');
  triangle(ctx, 166, 394, 170, 384, 174, 394, '#e67e22');
  triangle(ctx, 176, 394, 180, 384, 184, 394, '#e67e22');
  ctx.strokeStyle = '#d35400';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(126, 402, 10, Math.PI * 0.4, Math.PI * 1.3);
  ctx.stroke();
  if (v === 0) {
    circle(ctx, 170, 399, 1.8, '#222222');
    circle(ctx, 179, 399, 1.8, '#222222');
  } else {
    line(ctx, 167, 400, 173, 400, '#7e5109', 1.8);
    line(ctx, 176, 400, 182, 400, '#7e5109', 1.8);
  }

  // counter with globe: globe present in A, gone in B  (difference 9)
  rect(ctx, 30, 392, 120, 44, '#6d4525');
  rect(ctx, 24, 384, 132, 10, '#8a5a30');
  roundRect(ctx, 96, 362, 34, 24, 4, '#3a3a3a');
  rect(ctx, 102, 368, 22, 8, '#aee6f5');
  if (v === 0) {
    circle(ctx, 58, 362, 17, '#5dade2');
    ellipse(ctx, 52, 356, 7, 5, '#58d68d');
    ellipse(ctx, 64, 368, 6, 4, '#58d68d');
    line(ctx, 58, 380, 58, 388, '#8a5a30', 4);
  }
}

/* ------------------------------------------------------------------ */
/* Scene 3 — Underwater Reef (10 differences)                          */
/* ------------------------------------------------------------------ */

function paintReef(ctx, v, t) {
  sky(ctx, '#0b3d66', '#1473a8');
  // light rays
  ctx.fillStyle = 'rgba(160,225,255,0.10)';
  for (const rx of [90, 240, 400, 520]) {
    ctx.beginPath();
    ctx.moveTo(rx, 0);
    ctx.lineTo(rx + 46, 0);
    ctx.lineTo(rx + 110, 330);
    ctx.lineTo(rx + 30, 330);
    ctx.closePath();
    ctx.fill();
  }
  // sandy floor
  ctx.fillStyle = '#e8d39a';
  ctx.beginPath();
  ctx.moveTo(0, 400);
  ctx.quadraticCurveTo(150, 384, 300, 398);
  ctx.quadraticCurveTo(450, 412, 600, 396);
  ctx.lineTo(600, 450);
  ctx.lineTo(0, 450);
  ctx.closePath();
  ctx.fill();

  // fish school: 5 fish in A, 4 in B  (difference 1)
  const school = [[262, 110, 1], [306, 92, 0.9], [344, 118, 1.05], [288, 140, 0.8], [330, 146, 0.85]];
  const fishShown = v === 0 ? school : school.slice(0, 4);
  for (const [fx, fy, fs] of fishShown) fish(ctx, fx + Math.sin(t * 0.8 + fx) * 3, fy, fs, '#f5b041', '#e67e22', false);
  fish(ctx, 120, 200, 0.9, '#ec7063', '#c0392b', true);
  fish(ctx, 470, 210, 1.1, '#48c9b0', '#148f77', true);

  // big bubble near the turtle: large in A, small in B  (difference 9)
  bubble(ctx, 250, 180 - ((t * 14) % 26), v === 0 ? 13 : 6);
  bubble(ctx, 140, 300 - ((t * 18) % 40), 7);
  bubble(ctx, 520, 300 - ((t * 12) % 34), 9);
  bubble(ctx, 360, 330 - ((t * 20) % 44), 5);

  // submarine: periscope up in A, down in B  (difference 7)
  ellipse(ctx, 492, 92, 52, 20, '#f4d03f');
  triangle(ctx, 442, 92, 424, 74, 424, 110, '#d4ac0d');
  rect(ctx, 472, 66, 40, 16, '#d4ac0d');
  if (v === 0) {
    rect(ctx, 486, 44, 6, 24, '#7d6608');
    rect(ctx, 486, 44, 16, 6, '#7d6608');
  }
  for (const px of [468, 490, 512]) circle(ctx, px, 92, 6, '#aee6f5');

  // turtle: front flipper raised in A, lowered in B  (difference 2)
  ellipse(ctx, 300, 238, 58, 34, '#1e8449');
  ellipse(ctx, 300, 234, 46, 27, '#52be80');
  ellipse(ctx, 284, 226, 11, 7, '#1e8449');
  ellipse(ctx, 314, 242, 11, 7, '#1e8449');
  ellipse(ctx, 300, 240, 9, 6, '#1e8449');
  ctx.strokeStyle = '#145a32';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(300, 238, 58, 34, 0, 0, Math.PI * 2);
  ctx.stroke();
  circle(ctx, 364, 230, 13, '#58d68d');
  circle(ctx, 368, 226, 2.4, '#145a32');
  ctx.strokeStyle = '#145a32';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(366, 234, 4, 0.2, Math.PI * 0.8);
  ctx.stroke();
  const flipY = v === 0 ? 214 : 258;
  ellipse(ctx, 336, flipY, 16, 7, '#58d68d');
  ellipse(ctx, 264, 262, 15, 7, '#58d68d');

  // octopus: 4 tentacles in A, 3 in B  (difference 4)
  circle(ctx, 92, 262, 26, '#af7ac5');
  circle(ctx, 84, 256, 3, '#2c1a3e');
  circle(ctx, 100, 256, 3, '#2c1a3e');
  ctx.strokeStyle = '#9b59b6';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  const tents = [[72, 306], [88, 314], [104, 310], [116, 298]];
  const tentShown = v === 0 ? tents : tents.slice(0, 3);
  for (const [tx, ty] of tentShown) {
    ctx.beginPath();
    ctx.moveTo(92, 282);
    ctx.quadraticCurveTo(tx, 296, tx, ty);
    ctx.stroke();
  }

  // coral: extra branch in A  (difference 8)
  ctx.strokeStyle = '#ec7063';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  const branches = [[80, 402, 80, 356], [80, 380, 58, 352], [80, 372, 104, 346]];
  for (const [x1, y1, x2, y2] of branches) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  if (v === 0) {
    ctx.beginPath();
    ctx.moveTo(80, 362);
    ctx.lineTo(70, 332);
    ctx.stroke();
  }
  circle(ctx, 80, 356, 6, '#f1948a');
  circle(ctx, 58, 352, 6, '#f1948a');
  circle(ctx, 104, 346, 6, '#f1948a');

  // seaweed
  ctx.strokeStyle = '#1e8449';
  ctx.lineWidth = 7;
  for (const sx of [150, 168, 448, 466]) {
    ctx.beginPath();
    ctx.moveTo(sx, 428);
    ctx.quadraticCurveTo(sx + Math.sin(t + sx) * 8, 396, sx + 4, 366);
    ctx.stroke();
  }

  // treasure chest: closed in A, open with gold in B  (difference 3)
  rect(ctx, 446, 392, 68, 36, '#7e5109');
  if (v === 0) {
    ctx.fillStyle = '#935116';
    ctx.beginPath();
    ctx.arc(480, 392, 34, Math.PI, 0);
    ctx.fill();
    rect(ctx, 474, 386, 12, 16, '#f4d03f');
  } else {
    ellipse(ctx, 480, 392, 32, 10, '#f7dc6f');
    circle(ctx, 462, 388, 7, '#f4d03f');
    circle(ctx, 484, 384, 8, '#f7dc6f');
    circle(ctx, 498, 390, 6, '#f4d03f');
    ctx.save();
    ctx.translate(446, 392);
    ctx.rotate(-0.7);
    rect(ctx, 0, -18, 68, 18, '#935116');
    ctx.restore();
  }
  rect(ctx, 446, 404, 68, 5, '#5d3a06');

  // starfish: orange in A, purple in B  (difference 5)
  star(ctx, 220, 418, 17, v === 0 ? '#e67e22' : '#8e44ad');

  // clam: pearl present in A, gone in B  (difference 6)
  ctx.fillStyle = '#d98880';
  ctx.beginPath();
  ctx.ellipse(380, 416, 24, 9, 0, 0, Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(380, 414, 24, 12, 0, Math.PI, 0);
  ctx.fill();
  if (v === 0) circle(ctx, 380, 410, 7, '#fdfefe');

  // shell on the sand: present in A, gone in B  (difference 10)
  if (v === 0) {
    ctx.fillStyle = '#f5cba7';
    ctx.beginPath();
    ctx.ellipse(522, 426, 13, 9, 0, Math.PI, 0);
    ctx.fill();
    line(ctx, 522, 426, 512, 419, '#e5989b', 2);
    line(ctx, 522, 426, 522, 418, '#e5989b', 2);
    line(ctx, 522, 426, 532, 419, '#e5989b', 2);
  }
}

/* ------------------------------------------------------------------ */
/* Scene 4 — Winter Cabin (11 differences)                             */
/* ------------------------------------------------------------------ */

function paintWinter(ctx, v, t) {
  sky(ctx, '#16264d', '#33507e');
  // stars
  const stars = [[60, 40], [180, 70], [260, 34], [390, 56], [470, 30], [560, 90], [330, 96], [140, 120]];
  for (const [sx, sy] of stars) {
    const tw = 0.6 + 0.4 * Math.sin(t * 2 + sx);
    ctx.globalAlpha = tw;
    sparkle(ctx, sx, sy, 6, '#fdfefe');
  }
  ctx.globalAlpha = 1;
  // bright star top-right: present in A, gone in B  (difference 7)
  if (v === 0) star(ctx, 520, 58, 10, '#f9e79f');

  // moon: full in A, crescent in B  (difference 1)
  circle(ctx, 92, 72, 26, '#f7f3d5');
  if (v === 1) circle(ctx, 106, 64, 22, '#1b2f57');
  circle(ctx, 84, 64, 5, 'rgba(200,195,160,0.6)');
  circle(ctx, 100, 82, 4, 'rgba(200,195,160,0.6)');

  // snow ground
  ctx.fillStyle = '#eef4fb';
  ctx.beginPath();
  ctx.moveTo(0, 352);
  ctx.quadraticCurveTo(200, 336, 400, 350);
  ctx.quadraticCurveTo(520, 360, 600, 348);
  ctx.lineTo(600, 450);
  ctx.lineTo(0, 450);
  ctx.closePath();
  ctx.fill();
  // frozen pond
  ellipse(ctx, 478, 420, 96, 20, '#bfe0f2');
  ellipse(ctx, 478, 418, 80, 15, '#d6ecf8');

  // pines
  pine(ctx, 76, 352, 1.5, '#1e5c46', '#5d4037');
  pine(ctx, 160, 360, 1.2, '#1e5c46', '#5d4037');
  pine(ctx, 452, 356, 1.35, '#1e5c46', '#5d4037');
  pine(ctx, 534, 362, 1.1, '#1e5c46', '#5d4037');
  // snow caps on pines
  for (const [px, py, ps] of [[76, 352, 1.5], [160, 360, 1.2], [452, 356, 1.35], [534, 362, 1.1]]) {
    triangle(ctx, px - 8 * ps, py - 62 * ps, px + 8 * ps, py - 62 * ps, px, py - 76 * ps, '#ffffff');
  }
  // bird on the tall pine: present in A, gone in B  (difference 10)
  if (v === 0) {
    ellipse(ctx, 450, 302, 8, 6, '#e74c3c');
    circle(ctx, 457, 298, 4.5, '#e74c3c');
    triangle(ctx, 461, 298, 467, 300, 461, 302, '#f39c12');
  }

  // cabin
  rect(ctx, 232, 262, 136, 96, '#7a4a26');
  for (let ly = 276; ly < 356; ly += 16) line(ctx, 232, ly, 368, ly, '#633b1e', 3);
  triangle(ctx, 218, 264, 382, 264, 300, 206, '#5d3a1a');
  // snow roof band
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(224, 262);
  ctx.lineTo(300, 210);
  ctx.lineTo(376, 262);
  ctx.stroke();
  // icicles: 4 in A, 2 in B  (difference 9)
  const ices = v === 0 ? [246, 272, 326, 352] : [246, 352];
  for (const ix of ices) triangle(ctx, ix - 4, 266, ix + 4, 266, ix, 282, '#cfe8f7');

  // chimney + smoke: 3 puffs in A, 2 in B  (difference 2)
  rect(ctx, 332, 196, 20, 34, '#8d6e63');
  const puffs = v === 0 ? [[342, 178, 10], [350, 158, 13], [360, 136, 16]] : [[342, 178, 10], [350, 158, 13]];
  for (const [px, py, pr] of puffs) {
    ctx.globalAlpha = 0.75;
    circle(ctx, px + Math.sin(t * 0.7 + py) * 3, py, pr, '#e8edf2');
  }
  ctx.globalAlpha = 1;

  // windows: left window lit in A, dark in B  (difference 5)
  windowPane(ctx, 248, 282, 26, 30, v === 0 ? '#ffd977' : '#2c3e50', '#4a2c14');
  windowPane(ctx, 326, 282, 26, 30, '#ffd977', '#4a2c14');
  // door + wreath: wreath present in A, gone in B  (difference 6)
  rect(ctx, 288, 300, 26, 58, '#4a2c14');
  circle(ctx, 308, 330, 3, '#e8b64c');
  if (v === 0) {
    ctx.strokeStyle = '#1e8449';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(301, 318, 9, 0, Math.PI * 2);
    ctx.stroke();
    circle(ctx, 301, 310, 3, '#e74c3c');
  }
  // porch lantern
  lantern(ctx, 258, 330, 0.8, '#ffcf6e');

  // woodpile
  for (const [wx, wy] of [[196, 348], [212, 348], [204, 334], [196, 362], [212, 362]]) {
    circle(ctx, wx, wy, 8, '#a9743f');
    circle(ctx, wx, wy, 4, '#c99a63');
  }

  // skis leaning on the cabin
  line(ctx, 384, 358, 398, 300, '#c0392b', 4);
  line(ctx, 392, 358, 406, 302, '#2471a3', 4);

  // deer: antlers in A, none in B  (difference 4)
  ellipse(ctx, 148, 388, 26, 15, '#a9743f');
  rect(ctx, 128, 398, 5, 18, '#8a5a30');
  rect(ctx, 162, 398, 5, 18, '#8a5a30');
  circle(ctx, 172, 372, 10, '#a9743f');
  ellipse(ctx, 180, 378, 6, 4, '#c99a63');
  circle(ctx, 174, 370, 2, '#222222');
  if (v === 0) {
    ctx.strokeStyle = '#7a5230';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(168, 364);
    ctx.lineTo(160, 348);
    ctx.moveTo(164, 356);
    ctx.lineTo(154, 350);
    ctx.moveTo(176, 364);
    ctx.lineTo(182, 348);
    ctx.moveTo(179, 356);
    ctx.lineTo(188, 350);
    ctx.stroke();
  }

  // snowman: red scarf in A, green in B  (difference 3)
  circle(ctx, 470, 402, 24, '#ffffff');
  circle(ctx, 470, 366, 17, '#ffffff');
  circle(ctx, 470, 342, 12, '#ffffff');
  circle(ctx, 466, 340, 1.8, '#222222');
  circle(ctx, 474, 340, 1.8, '#222222');
  triangle(ctx, 470, 344, 484, 347, 470, 349, '#e67e22');
  rect(ctx, 458, 350, 24, 7, v === 0 ? '#e74c3c' : '#27ae60');
  rect(ctx, 476, 356, 7, 16, v === 0 ? '#e74c3c' : '#27ae60');
  line(ctx, 454, 364, 434, 350, '#7a5230', 3);
  line(ctx, 486, 364, 504, 348, '#7a5230', 3);
  circle(ctx, 470, 374, 2.4, '#222222');
  circle(ctx, 470, 384, 2.4, '#222222');

  // sled: red in A, blue in B  (difference 8)
  const sledColor = v === 0 ? '#c0392b' : '#2471a3';
  rect(ctx, 268, 404, 64, 8, sledColor);
  rect(ctx, 276, 396, 6, 10, '#7a5230');
  rect(ctx, 318, 396, 6, 10, '#7a5230');
  line(ctx, 262, 416, 338, 416, '#8a5a30', 4);
  ctx.beginPath();
  ctx.arc(340, 410, 7, -Math.PI / 2, Math.PI / 2);
  ctx.strokeStyle = '#8a5a30';
  ctx.lineWidth = 4;
  ctx.stroke();

  // footprints: a trail in A, none in B  (difference 11)
  if (v === 0) {
    for (let i = 0; i < 6; i++) {
      ellipse(ctx, 352 + i * 16, 424 + (i % 2) * 7, 6, 3, 'rgba(160,190,220,0.8)');
    }
  }
}

/* ------------------------------------------------------------------ */
/* Scene 5 — Space Station Dock (12 differences)                       */
/* ------------------------------------------------------------------ */

function paintSpace(ctx, v, t) {
  sky(ctx, '#0a0a2e', '#23235e');
  const stars = [[40, 50], [150, 140], [250, 40], [380, 110], [440, 40], [560, 170], [70, 200], [320, 180], [530, 250], [200, 240]];
  for (const [sx, sy] of stars) {
    ctx.globalAlpha = 0.5 + 0.5 * Math.abs(Math.sin(t * 1.5 + sx));
    sparkle(ctx, sx, sy, 5, '#fdfefe');
  }
  ctx.globalAlpha = 1;

  // comet: present in A, gone in B  (difference 12)
  if (v === 0) {
    ctx.strokeStyle = 'rgba(150,220,255,0.8)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(176, 48);
    ctx.lineTo(216, 72);
    ctx.stroke();
    circle(ctx, 220, 74, 5, '#d6f0ff');
  }

  // ringed planet: rings in A, none in B  (difference 2)
  circle(ctx, 112, 96, 30, '#c39bd3');
  ellipse(ctx, 100, 88, 10, 6, '#a569bd');
  ellipse(ctx, 124, 106, 8, 5, '#a569bd');
  if (v === 0) {
    ctx.strokeStyle = '#f5cba7';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(112, 96, 52, 13, -0.25, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Earth: continent shape changes  (difference 9)
  circle(ctx, 502, 84, 38, '#2e86ff');
  if (v === 0) {
    ellipse(ctx, 488, 72, 14, 9, '#58d68d');
    ellipse(ctx, 514, 96, 11, 8, '#58d68d');
  } else {
    ellipse(ctx, 496, 66, 16, 8, '#58d68d');
    ellipse(ctx, 520, 88, 8, 12, '#58d68d');
  }
  ellipse(ctx, 502, 84, 38, 38, 'rgba(255,255,255,0.08)');

  // satellite: two panels in A, one in B  (difference 4)
  rect(ctx, 288, 62, 24, 16, '#f4d03f');
  rect(ctx, 258, 64, 28, 12, '#5dade2');
  if (v === 0) rect(ctx, 314, 64, 28, 12, '#5dade2');
  line(ctx, 300, 78, 300, 92, '#bdc3c7', 3);
  circle(ctx, 300, 96, 4, '#e74c3c');

  // moon surface
  ctx.fillStyle = '#9aa5b1';
  ctx.beginPath();
  ctx.moveTo(0, 378);
  ctx.quadraticCurveTo(200, 362, 400, 374);
  ctx.quadraticCurveTo(520, 382, 600, 370);
  ctx.lineTo(600, 450);
  ctx.lineTo(0, 450);
  ctx.closePath();
  ctx.fill();
  ellipse(ctx, 140, 412, 34, 8, '#7f8c9b');
  ellipse(ctx, 360, 428, 44, 9, '#7f8c9b');
  // extra crater in B only  (difference 6)
  if (v === 1) ellipse(ctx, 76, 428, 26, 7, '#7f8c9b');

  // rocket: red stripe in A, blue in B  (difference 1)
  ctx.fillStyle = '#ecf0f1';
  ctx.beginPath();
  ctx.moveTo(162, 360);
  ctx.lineTo(162, 240);
  ctx.quadraticCurveTo(180, 196, 198, 240);
  ctx.lineTo(198, 360);
  ctx.closePath();
  ctx.fill();
  rect(ctx, 162, 268, 36, 14, v === 0 ? '#e74c3c' : '#2471a3');
  circle(ctx, 180, 252, 9, '#aee6f5');
  ctx.strokeStyle = '#7f8c9b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(180, 252, 9, 0, Math.PI * 2);
  ctx.stroke();
  triangle(ctx, 162, 330, 144, 366, 162, 366, '#e74c3c');
  triangle(ctx, 198, 330, 216, 366, 198, 366, '#e74c3c');
  rect(ctx, 150, 366, 60, 8, '#5d6d7e');

  // fuel tank: gauge full in A, half in B  (difference 11)
  roundRect(ctx, 96, 316, 30, 52, 8, '#f39c12');
  rect(ctx, 104, 326, 14, 30, '#5d4037');
  rect(ctx, 106, v === 0 ? 328 : 342, 10, v === 0 ? 26 : 12, '#58d68d');

  // moon base dome: window lit in A, dark in B  (difference 10)
  ctx.fillStyle = '#d6dbdf';
  ctx.beginPath();
  ctx.arc(432, 372, 62, Math.PI, 0);
  ctx.fill();
  rect(ctx, 370, 368, 124, 8, '#aab7b8');
  windowPane(ctx, 420, 322, 24, 22, v === 0 ? '#ffd977' : '#2c3e50', '#7f8c9b');
  rect(ctx, 424, 342, 16, 30, '#7f8c9b');

  // antenna dish: tilted up in A, down in B  (difference 7)
  rect(ctx, 336, 330, 6, 44, '#7f8c9b');
  ctx.save();
  ctx.translate(339, 322);
  ctx.rotate(v === 0 ? -0.5 : 0.45);
  ctx.fillStyle = '#ecf0f1';
  ctx.beginPath();
  ctx.ellipse(0, 0, 30, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  line(ctx, 339, 322, 352, 306, '#7f8c9b', 3);
  circle(ctx, 354, 304, 4, '#e74c3c');

  // astronaut: gold visor in A, dark in B  (difference 3)
  roundRect(ctx, 286, 374, 28, 40, 10, '#ecf0f1');
  circle(ctx, 300, 362, 15, '#ecf0f1');
  ellipse(ctx, 300, 362, 10, 8, v === 0 ? '#f4d03f' : '#2c3e50');
  rect(ctx, 278, 380, 8, 24, '#d6dbdf');
  rect(ctx, 314, 380, 8, 24, '#d6dbdf');
  rect(ctx, 290, 412, 8, 18, '#d6dbdf');
  rect(ctx, 302, 412, 8, 18, '#d6dbdf');
  rect(ctx, 292, 382, 16, 10, '#e74c3c');

  // flag: star emblem in A, plain in B  (difference 5)
  line(ctx, 248, 380, 248, 332, '#bdc3c7', 3);
  rect(ctx, 248, 332, 30, 18, '#2471a3');
  if (v === 0) star(ctx, 263, 341, 6, '#f9e79f');

  // rover: 4 wheels in A, 3 in B  (difference 8)
  rect(ctx, 494, 384, 56, 18, '#f39c12');
  rect(ctx, 508, 366, 24, 18, '#f5b041');
  line(ctx, 522, 366, 522, 352, '#7f8c9b', 3);
  circle(ctx, 522, 350, 4, '#e74c3c');
  const wheels = v === 0 ? [500, 516, 532, 546] : [500, 524, 546];
  for (const wx of wheels) {
    circle(ctx, wx, 406, 8, '#2c3e50');
    circle(ctx, wx, 406, 3, '#bdc3c7');
  }
}

/* ------------------------------------------------------------------ */
/* Scene registry                                                      */
/* ------------------------------------------------------------------ */

export const SCENES = [
  {
    id: 'farmyard',
    name: 'Sunny Farmyard',
    difficulty: 1,
    seconds: 180,
    paint: paintFarmyard,
    differences: [
      { x: 510, y: 70, r: 48, label: 'sun rays' },
      { x: 112, y: 68, r: 44, label: 'cloud size' },
      { x: 130, y: 304, r: 40, label: 'barn door' },
      { x: 490, y: 182, r: 50, label: 'windmill blades' },
      { x: 36, y: 276, r: 44, label: 'apples' },
      { x: 294, y: 378, r: 26, label: 'tractor wheel' },
      { x: 442, y: 380, r: 38, label: 'cow spots' },
      { x: 290, y: 408, r: 26, label: 'hay bale' },
    ],
  },
  {
    id: 'bookshop',
    name: 'Cozy Bookshop',
    difficulty: 2,
    seconds: 210,
    paint: paintBookshop,
    differences: [
      { x: 300, y: 44, r: 30, label: 'clock time' },
      { x: 451, y: 300, r: 38, label: 'lamp light' },
      { x: 174, y: 400, r: 24, label: 'cat eyes' },
      { x: 300, y: 139, r: 34, label: 'window sign' },
      { x: 96, y: 122, r: 28, label: 'book color' },
      { x: 210, y: 318, r: 30, label: 'plant leaves' },
      { x: 378, y: 358, r: 22, label: 'mug' },
      { x: 268, y: 140, r: 30, label: 'curtain' },
      { x: 58, y: 362, r: 26, label: 'globe' },
    ],
  },
  {
    id: 'reef',
    name: 'Underwater Reef',
    difficulty: 3,
    seconds: 240,
    paint: paintReef,
    differences: [
      { x: 306, y: 120, r: 56, label: 'fish count' },
      { x: 336, y: 236, r: 30, label: 'turtle flipper' },
      { x: 480, y: 392, r: 42, label: 'treasure chest' },
      { x: 94, y: 288, r: 40, label: 'octopus tentacles' },
      { x: 220, y: 418, r: 24, label: 'starfish color' },
      { x: 380, y: 412, r: 26, label: 'pearl' },
      { x: 492, y: 66, r: 30, label: 'periscope' },
      { x: 78, y: 356, r: 38, label: 'coral branch' },
      { x: 250, y: 176, r: 24, label: 'big bubble' },
      { x: 522, y: 424, r: 22, label: 'shell' },
    ],
  },
  {
    id: 'winter',
    name: 'Winter Cabin',
    difficulty: 4,
    seconds: 270,
    paint: paintWinter,
    differences: [
      { x: 92, y: 72, r: 34, label: 'moon phase' },
      { x: 352, y: 158, r: 34, label: 'chimney smoke' },
      { x: 470, y: 356, r: 26, label: 'snowman scarf' },
      { x: 170, y: 358, r: 30, label: 'deer antlers' },
      { x: 261, y: 297, r: 24, label: 'cabin window' },
      { x: 301, y: 318, r: 20, label: 'door wreath' },
      { x: 520, y: 58, r: 22, label: 'bright star' },
      { x: 300, y: 406, r: 40, label: 'sled color' },
      { x: 300, y: 272, r: 44, label: 'icicles' },
      { x: 452, y: 300, r: 22, label: 'bird' },
      { x: 392, y: 426, r: 36, label: 'footprints' },
    ],
  },
  {
    id: 'space',
    name: 'Space Station Dock',
    difficulty: 5,
    seconds: 300,
    paint: paintSpace,
    differences: [
      { x: 180, y: 275, r: 30, label: 'rocket stripe' },
      { x: 112, y: 96, r: 50, label: 'planet rings' },
      { x: 300, y: 362, r: 22, label: 'astronaut visor' },
      { x: 328, y: 70, r: 30, label: 'satellite panel' },
      { x: 263, y: 341, r: 22, label: 'flag emblem' },
      { x: 76, y: 428, r: 28, label: 'crater' },
      { x: 339, y: 320, r: 36, label: 'antenna dish' },
      { x: 524, y: 404, r: 34, label: 'rover wheels' },
      { x: 502, y: 84, r: 42, label: 'Earth continents' },
      { x: 432, y: 333, r: 24, label: 'dome window' },
      { x: 111, y: 342, r: 26, label: 'fuel gauge' },
      { x: 198, y: 62, r: 30, label: 'comet' },
    ],
  },
];

export const TOTAL_DIFFERENCES = SCENES.reduce((n, s) => n + s.differences.length, 0);
