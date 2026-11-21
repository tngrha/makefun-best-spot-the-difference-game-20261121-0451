// art.js — small canvas drawing helpers shared by every scene.
// All coordinates are in one panel's 600x600 scene space.

export function fillRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
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

export function roundRect(ctx, x, y, w, h, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

export function polygon(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
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

export function skyGradient(ctx, stops, height) {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  for (const [at, color] of stops) grad.addColorStop(at, color);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, height);
}

export function cloud(ctx, x, y, scale, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 46 * scale, 20 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 30 * scale, y + 6 * scale, 30 * scale, 15 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 32 * scale, y + 6 * scale, 32 * scale, 16 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 2 * scale, y - 12 * scale, 28 * scale, 16 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function star(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const radius = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

export function sparkleStar(ctx, x, y, r, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - r, y); ctx.lineTo(x + r, y);
  ctx.moveTo(x, y - r); ctx.lineTo(x, y + r);
  ctx.moveTo(x - r * 0.6, y - r * 0.6); ctx.lineTo(x + r * 0.6, y + r * 0.6);
  ctx.moveTo(x + r * 0.6, y - r * 0.6); ctx.lineTo(x - r * 0.6, y + r * 0.6);
  ctx.stroke();
  circle(ctx, x, y, 2.4, color);
}

export function pineTree(ctx, x, baseY, height, trunkColor, leafColor) {
  const w = height * 0.42;
  fillRect(ctx, x - 5, baseY - height * 0.16, 10, height * 0.16, trunkColor);
  polygon(ctx, [[x - w / 2, baseY - height * 0.12], [x + w / 2, baseY - height * 0.12], [x, baseY - height * 0.55]], leafColor);
  polygon(ctx, [[x - w * 0.4, baseY - height * 0.42], [x + w * 0.4, baseY - height * 0.42], [x, baseY - height * 0.8]], leafColor);
  polygon(ctx, [[x - w * 0.28, baseY - height * 0.68], [x + w * 0.28, baseY - height * 0.68], [x, baseY - height]], leafColor);
}

export function waveLine(ctx, y, phase, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (let x = -10; x <= 610; x += 10) {
    const yy = y + Math.sin(x * 0.05 + phase) * 3;
    if (x === -10) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
  }
  ctx.stroke();
}

export function glow(ctx, x, y, r, inner, outer) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
  grad.addColorStop(0, inner);
  grad.addColorStop(1, outer);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export function text(ctx, str, x, y, size, color, align = 'center', weight = 'bold') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px Georgia, serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}
