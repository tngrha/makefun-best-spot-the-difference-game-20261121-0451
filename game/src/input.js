// input.js — pointer clicks on either postcard, plus keyboard shortcuts.
// Converts page clicks into scene coordinates for state.clickAt.

import { PANELS, PANEL_SIZE } from './render.js';

// Returns {panel, x, y} in scene coordinates, or null when the click
// landed outside both postcards.
export function canvasClickToScene(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const cx = ((event.clientX - rect.left) / rect.width) * canvas.width;
  const cy = ((event.clientY - rect.top) / rect.height) * canvas.height;
  for (let i = 0; i < PANELS.length; i++) {
    const p = PANELS[i];
    if (cx >= p.x && cx < p.x + PANEL_SIZE && cy >= p.y && cy < p.y + PANEL_SIZE) {
      return { panel: i, x: cx - p.x, y: cy - p.y };
    }
  }
  return null;
}

export function bindInput(canvas, handlers) {
  canvas.addEventListener('pointerdown', (event) => {
    const hit = canvasClickToScene(canvas, event);
    if (hit) handlers.onSceneClick(hit);
  });
  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'h') handlers.onHint();
    else if (key === 'r') handlers.onRestart();
    else if (key === 'n') handlers.onNext();
  });
}
