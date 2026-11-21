// scenes.js — the three postcard scenes in play order, easiest first.
// Each scene pairs a draw function with its planted differences and a
// countdown that tightens as the differences get subtler.

import { drawHarbor, harborDifferences } from './harbor.js';
import { drawCamp, campDifferences } from './camp.js';
import { drawMarket, marketDifferences } from './market.js';

export const SCENES = [
  {
    id: 'harbor',
    name: 'Harbor Dawn',
    timeLimit: 150,
    draw: drawHarbor,
    differences: harborDifferences,
  },
  {
    id: 'camp',
    name: 'Forest Camp',
    timeLimit: 120,
    draw: drawCamp,
    differences: campDifferences,
  },
  {
    id: 'market',
    name: 'Night Market',
    timeLimit: 90,
    draw: drawMarket,
    differences: marketDifferences,
  },
];

export function sceneById(id) {
  return SCENES.find((scene) => scene.id === id) ?? SCENES[0];
}
