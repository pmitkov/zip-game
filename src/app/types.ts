export type Difficulty = {
  size: string;
  rows: number;
  cols: number;
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
