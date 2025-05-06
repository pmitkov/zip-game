import { Injectable } from '@angular/core';
import { CoinToss } from '../types';

@Injectable({
  providedIn: 'root'
})
export class RandomService {

  constructor() { }

  getRandomInRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  tossCoin(): CoinToss {
    return this.getRandomInRange(0, 2) === 0;
  }

  randomSubset(setSize: number, subsetSize: number): number[] {
    const indexes: number[] = [];
    for (let i = 0; i < setSize; i++) {
      if (i < subsetSize) {
        indexes.push(1);
      } else {
        indexes.push(0);
      }
    }
    this.shuffleArray(indexes);
    const subsetIndexes: number[] = [];
    for (let i = 0; i < setSize; i++) {
      if (indexes[i] === 1) {
        subsetIndexes.push(i);
      }
    }
    return subsetIndexes;
  }

  shuffleArray<T>(arr: T[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }

  randomElement<T>(arr: T[]): T {
    return arr[this.getRandomInRange(0, arr.length)];
  }
}
