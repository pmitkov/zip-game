import { Injectable } from '@angular/core';
import { Cell, Direction, directions, Path, Wall } from '../types';
import { RandomService } from './random.service';
import _ from 'lodash';
import { moves } from '../moves';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private randomService: RandomService) { }

  generateHamiltonianPath(rows: number, cols: number): Path {
    if (rows * cols <= 36) {
      return this.generateHamiltonianPathBacktracking(rows, cols);
    } else {
     return this.generateHamiltonianPathZigZag(rows, cols, this.randomService.getRandomInRange(500, 1000));
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

  generateWalls(path: Path, rows: number, cols: number, wallsCount: number): Wall[] {
    const walls: Wall[] = [];
    while (wallsCount > 0) {
      const row = this.randomService.getRandomInRange(0, rows - 1);
      const col = this.randomService.getRandomInRange(0, cols - 1);
      const cell = {row: row, col: col};
      let adjCell: Cell;
      if (this.randomService.tossCoin()) {
        adjCell = {row: row + 1, col: col};
      } else {
        adjCell = {row: row, col: col + 1};
      }
      let canAdd = true;
      // check if wall passes through the path
      for (let idx = 0; idx < path.length - 1; idx++) {
        if ((_.isEqual(cell, path[idx]) && _.isEqual(adjCell, path[idx + 1])) ||
            ((_.isEqual(adjCell, path[idx]) && _.isEqual(cell, path[idx + 1])))) {
          canAdd = false;
          break;
        }
      }
      // check if wall has already been added
      if (canAdd) {
        for (const wall of walls) {
          if ((_.isEqual(cell, wall[0]) && _.isEqual(adjCell, wall[1])) ||
            (_.isEqual(adjCell, wall[0]) && _.isEqual(cell, wall[1]))) {
            canAdd = false;
            break;
          }
        }
      }
      if (canAdd) {
        wallsCount--;
        walls.push([cell, adjCell]);
      }
    }
    return walls;
  }

  getDirection(xDiff: number, yDiff: number): Direction {
    if (xDiff === 0) {
      if (yDiff === -1) {
        return 'Up';
      } else {
        return 'Down';
      }
    } else {
      if (xDiff === -1) {
        return 'Left';
      } else {
        return 'Right';
      }
    }
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
      if (this.isValid({row: nextRow, col: nextCol}, visited.length, visited[0].length) && !visited[nextRow][nextCol] &&
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

  private generateHamiltonianPathZigZag(rows: number, cols: number, iterations: number): Path {
    let path: Path = [];
    // generate the zig zag path
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (row % 2 == 0) {
          path.push({row: row, col : col});
        } else {
          path.push({row: row, col: cols - 1 - col});
        }
      }
    }
    // repeat the backbite procedure a fixed number of times
    while (iterations--) {
      if (this.randomService.tossCoin()) {
        path.reverse();
      }
      // choose the first cell
      const cell = this.randomService.randomElement(this.getAdj(path, path[0], rows, cols));
      if (this.adjInPath(path[0], cell, path)) {
        continue;
      }
      const idx = _.findIndex(path, cell);
      const newPath = path.slice(0, idx);
      newPath.reverse();
      newPath.push(...path.slice(idx));
      path = newPath;
    }
    return path;
  }

  private getAdj(path: Path, cell: Cell, rows: number, cols: number): Cell[] {
    const row = cell.row;
    const col = cell.col;
    return directions
      .map(dir => moves[dir])
      .map(move => {
        return {row: row + move[0], col: col + move[1]}
      })
      .filter(cell => this.isValid(cell, rows, cols));
  }

  private adjInPath(cell1: Cell, cell2: Cell, path: Path): boolean {
    return Math.abs(_.findIndex(path, cell1) - _.findIndex(path, cell2)) === 1;
  }

  isValid(cell: Cell, rows: number, cols: number): boolean {
    return cell.row >= 0 && cell.col >= 0 && cell.row < rows && cell.col < cols;
  }
}
