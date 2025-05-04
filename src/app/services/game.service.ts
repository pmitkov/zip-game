import { Injectable } from '@angular/core';
import { Cell, Path } from '../types';
import { RandomService } from './random.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private randomService: RandomService) { }

  generateHamiltonianPath(rows: number, cols: number): Path {
    if (rows * cols <= 36) {
      return this.generateHamiltonianPathBacktracking(rows, cols);
    } else {
     return this.generateHamiltonianPathZigZag(rows, cols);
    }
  }

  generateSelectedCells(path: Path, cellsCount: number): Cell[] {
    const selectedCells = [path[0]];
    const selectedIdx = this.randomService.randomSubset(path.length - 2, cellsCount - 2);
    for (const idx of selectedIdx) {
      selectedCells.push(path[idx + 1]);
    }
    selectedCells.push(path.at(-1)!);
    return selectedCells;
  }

  private backtrack(cell: Cell, visited: boolean[][], path: Path): boolean {
    path.push(cell);
    visited[cell.row][cell.col] = true;
    if (path.length == visited.length * visited[0].length) {
      return true;
    }
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    this.randomService.shuffleArray(dirs);
    for (let dir of dirs) {
      const nextRow = cell.row + dir[0];
      const nextCol = cell.col + dir[1];
      if (nextRow >= 0 && nextCol >= 0 && nextRow < visited.length &&
        nextCol < visited[0].length && !visited[nextRow][nextCol] &&
        this.backtrack({row: nextRow, col: nextCol}, visited, path)) {
        return true;
      }
    }
    visited[cell.row][cell.col] = false;
    path.pop();
    return false;
  }

  private generateHamiltonianPathBacktracking(rows: number, cols: number): Path {
    const visited: boolean[][] = new Array(rows)
      .fill(0).map(_ => new Array(cols).fill(false));
    const x = this.randomService.getRandomInRange(0, rows);
    const y = this.randomService.getRandomInRange(0, cols);
    const path: Path = [];
    this.backtrack({row: x, col: x}, visited, path);
    return path;
  }

  private generateHamiltonianPathZigZag(rows: number, cols: number): Path {
    throw new Error("Method not implemented.");
  }
}
