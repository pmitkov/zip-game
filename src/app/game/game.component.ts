import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { GridComponent } from "../grid/grid.component";
import { Cell, Difficulty, Direction, GameID, GameState, GameStatistics, Path } from "../types";
import { GameService } from "../services/game.service";
import { MatButton } from "@angular/material/button";
import { ScoreboardComponent } from "../scoreboard/scoreboard.component";
import { Subject } from "rxjs";
import { RandomService } from '../services/random.service';
import { GameStatisticsService } from '../services/game-statistics.service';

@Component({
  selector: 'game',
  imports: [
    GridComponent,
    MatButton,
    ScoreboardComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  @Input({required: true})
  difficulty!: Difficulty;

  @Input({required: true})
  enableWalls!: boolean;

  @Output()
  gameEnded: EventEmitter<void> = new EventEmitter();

  gameStateEmitter: Subject<GameState> = new Subject<GameState>();
  currentPathEmitter: Subject<Path> = new Subject<Path>();
  gameOverEmitter: Subject<GameStatistics> = new Subject<GameStatistics>();

  gameID: GameID;
  gameState: GameState = 'Running';

  rows!: number;
  cols!: number;
  solvedPath!: Path;
  currentPath!: Path;
  selectedCells!: Cell[];
  visited!: boolean[][];
  private readonly moves: {[key in Direction]: [number, number]} = {
    'Up': [0, -1],
    'Down': [0, 1],
    'Left': [-1, 0],
    'Right': [1, 0],
  };

  constructor(private gameService: GameService,
              private gameStatisticsService: GameStatisticsService) {
    this.gameID = this.gameStatisticsService.startNewGame();
  }

  ngOnInit(): void {
    this.rows = this.difficulty.rows;
    this.cols = this.difficulty.cols;
    this.solvedPath = this.gameService.generateHamiltonianPath(this.rows, this.cols);
    this.currentPath = [this.solvedPath[0]];
    this.selectedCells = this.gameService.generateSelectedCells(this.solvedPath, this.difficulty.nodes);
    this.visited = new Array(this.rows)
      .fill(0).map(_ => new Array(this.cols).fill(false));
    this.visited[this.solvedPath[0].row][this.solvedPath[0].col] = true;
  }

  toggleGameState() {
    if (this.gameState === 'Running') {
      this.gameState = 'Paused';
    } else {
      this.gameState = 'Running';
    }
    this.gameStateEmitter.next(this.gameState);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.gameState !== 'Running') {
      return;
    }
    switch (event.key) {
      case 'ArrowUp':
        this.handleKeyPress('Up');
        break;
      case 'ArrowDown':
        this.handleKeyPress('Down');
        break;
      case 'ArrowLeft':
        this.handleKeyPress('Left');
        break;
      case 'ArrowRight':
        this.handleKeyPress('Right');
        break;
    }
  }

  private handleKeyPress(direction: Direction) {
    const row = this.currentPath.at(-1)!.row + this.moves[direction][0];
    const col = this.currentPath.at(-1)!.col + this.moves[direction][1];
    if (row >= 0 && col >= 0 && row < this.rows && col < this.cols) {
      if (this.currentPath.length > 1 && row === this.currentPath.at(-2)!.row && col === this.currentPath.at(-2)!.col) {
        this.visited[this.currentPath.at(-1)!.row][this.currentPath.at(-1)!.col] = false;
        this.currentPath.pop();
        this.gameStatisticsService.incrementBackMoves(this.gameID);
        this.currentPathEmitter.next(this.currentPath);
      } else if (!this.visited[row][col]) {
        this.visited[row][col] = true;
        this.currentPath.push({row: row, col: col});
        this.gameStatisticsService.incrementMoves(this.gameID);
        this.currentPathEmitter.next(this.currentPath);
      }
      if (this.currentPath.length === this.rows * this.cols && this.verifyVisitedOrder()) {
        this.gameOverEmitter
      }
    }
  }

  private verifyVisitedOrder(): boolean {
    let idx = 0;
    for (const cell of this.currentPath) {
      if (idx < this.selectedCells.length &&
        this.selectedCells[idx].row === cell.row &&
        this.selectedCells[idx].col === cell.col) {
        idx++;
      }
    }
    return idx === this.selectedCells.length;
  }

  handleGameEnded() {
    this.gameEnded.emit();
  }

  clearGame() {
    this.currentPath.length = 1;
    this.currentPathEmitter.next(this.currentPath);
    this.visited = new Array(this.rows)
      .fill(0).map(_ => new Array(this.cols).fill(false));
    this.visited[this.solvedPath[0].row][this.solvedPath[0].col] = true;
  }
}
