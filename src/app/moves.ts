import { Direction } from './types';

export const moves: {[key in Direction]: [number, number]} = {
  'Up': [-1, 0],
  'Down': [1, 0],
  'Left': [0, -1],
  'Right': [0, 1],
};
