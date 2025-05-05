export type Difficulty = {
  size: string;
  rows: number;
  cols: number;
  nodes: number;
  walls: number;
};
export type Cell = Readonly<{row: number, col: number}>;
export type Direction = 'Left' | 'Right' | 'Up' | 'Down';
export type Path = Cell[];
export type Matrix = number[][];
export type StopWatchID = string;
export type StopWatchTime = number;
export type StopWatchData = {
  isRunning: boolean;
  startTime: number;
  endTime?: number;
  accumulatedTime: number;
}
export type GameState = 'Paused' | 'Running' | 'Finished';
export type StopWatchState = 'Paused' | 'Running';
export type ApplicationState = 'Menu' | 'Game';
export type MenuOptions = {
  difficulty: Difficulty;
  enableWalls: boolean;
}
export type Coordinates = Readonly<[number,number]>;
export type GameStatistics = {
  time: number;
  moves: number;
  backMoves: number;
}
export type GameID = string;
export type ID = string;
export type Wall = Readonly<[Cell, Cell]>;
