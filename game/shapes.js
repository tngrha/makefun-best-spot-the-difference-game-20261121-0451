// shapes.js — small canvas drawing helpers shared by every diorama scene.
// All coordinates are in the panel's 600x450 logical space.

export const W = 600;
export const H = 450;

export function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

export function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

export function roundRect(ctx, x, y, w, h, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

export function triangle(ctx, x1, y1, x2, y2, x3, y3, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
}

export function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function cloud(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 20 * s, y - 8 * s, 14 * s, 0, Math.PI * 2);
  ctx.arc(x + 38 * s, y, 16 * s, 0, Math.PI * 2);
  ctx.arc(x + 18 * s, y + 6 * s, 16 * s, 0, Math.PI * 2);
  ctx.fill();
}

export function sun(ctx, x, y, r, rays, color, rayColor) {
  ctx.strokeStyle = rayColor;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * (r + 6), y + Math.sin(a) * (r + 6));
    ctx.lineTo(x + Math.cos(a) * (r + 18), y + Math.sin(a) * (r + 18));
    ctx.stroke();
  }
  circle(ctx, x, y, r, color);
}

export function star(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

export function sparkle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

export function tree(ctx, x, y, s, leaf, trunk) {
  rect(ctx, x - 4 * s, y - 34 * s, 8 * s, 36 * s, trunk);
  circle(ctx, x, y - 52 * s, 24 * s, leaf);
  circle(ctx, x - 18 * s, y - 40 * s, 17 * s, leaf);
  circle(ctx, x + 18 * s, y - 40 * s, 17 * s, leaf);
}

export function pine(ctx, x, y, s, color, trunk) {
  rect(ctx, x - 3 * s, y - 12 * s, 6 * s, 14 * s, trunk);
  triangle(ctx, x - 20 * s, y - 10 * s, x + 20 * s, y - 10 * s, x, y - 46 * s, color);
  triangle(ctx, x - 15 * s, y - 32 * s, x + 15 * s, y - 32 * s, x, y - 62 * s, color);
  triangle(ctx, x - 10 * s, y - 50 * s, x + 10 * s, y - 50 * s, x, y - 74 * s, color);
}

export function house(ctx, x, y, w, h, wall, roof) {
  rect(ctx, x, y, w, h, wall);
  triangle(ctx, x - 6, y, x + w + 6, y, x + w / 2, y - h * 0.55, roof);
}

export function windowPane(ctx, x, y, w, h, color, frame) {
  rect(ctx, x - 2, y - 2, w + 4, h + 4, frame);
  rect(ctx, x, y, w, h, color);
  line(ctx, x + w / 2, y, x + w / 2, y + h, frame, 2);
  line(ctx, x, y + h / 2, x + w, y + h / 2, frame, 2);
}

export function fish(ctx, x, y, s, body, fin, flip) {
  const d = flip ? -1 : 1;
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(x, y, 16 * s, 9 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  triangle(ctx, x - 14 * s * d, y, x - 24 * s * d, y - 9 * s, x - 24 * s * d, y + 9 * s, fin);
  circle(ctx, x + 8 * s * d, y - 2 * s, 2.2 * s, '#10222e');
  triangle(ctx, x - 2 * s, y - 8 * s, x + 6 * s, y - 8 * s, x + 2 * s, y - 14 * s, fin);
}

export function bubble(ctx, x, y, r) {
  ctx.strokeStyle = 'rgba(200,240,255,0.85)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  circle(ctx, x - r * 0.35, y - r * 0.35, r * 0.28, 'rgba(255,255,255,0.75)');
}

export function bookSpine(ctx, x, y, w, h, color) {
  rect(ctx, x, y, w, h, color);
  rect(ctx, x + 2, y + 5, w - 4, 3, 'rgba(255,255,255,0.35)');
  rect(ctx, x + 2, y + h - 9, w - 4, 3, 'rgba(0,0,0,0.25)');
}

export function crate(ctx, x, y, s, wood, edge) {
  rect(ctx, x, y, s, s, wood);
  ctx.strokeStyle = edge;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, s - 2, s - 2);
  line(ctx, x, y, x + s, y + s, edge, 2);
  line(ctx, x + s, y, x, y + s, edge, 2);
}

export function lantern(ctx, x, y, s, glow) {
  circle(ctx, x, y, 16 * s, 'rgba(255,190,80,0.25)');
  roundRect(ctx, x - 7 * s, y - 10 * s, 14 * s, 20 * s, 5 * s, glow);
  rect(ctx, x - 4 * s, y - 14 * s, 8 * s, 4 * s, '#3a2c1c');
  rect(ctx, x - 4 * s, y + 10 * s, 8 * s, 4 * s, '#3a2c1c');
}

export function text(ctx, str, x, y, size, color, align) {
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px Georgia, serif`;
  ctx.textAlign = align || 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}
