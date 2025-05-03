import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { GridComponent } from "../grid/grid.component";
import { Difficulty, Direction, GameState, Path } from "../types";
import { GameService } from "../services/game.service";
import { MatButton } from "@angular/material/button";
import { ScoreboardComponent } from "../scoreboard/scoreboard.component";
import { Subject } from "rxjs";

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
  addWalls!: boolean;

  @Output()
  gameEndedEvent: EventEmitter<void> = new EventEmitter();

  gameStateEmitter: Subject<GameState> = new Subject<GameState>();

  gameState: GameState = 'Running';

  rows: number;
  cols: number;
  solvedPath: Path;
  currentPath: Path;
  private readonly moves: {[key in Direction]: [number, number]} = {
    'Up': [-1, 0],
    'Down': [1, 0],
    'Left': [-1, 0],
    'Right': [1, 0],
  };

  constructor(private gameService: GameService) {
    this.rows = this.difficulty.rows;
    this.cols = this.difficulty.cols;
    this.solvedPath = gameService.generateHamiltonianPath(this.rows, this.cols);
    this.currentPath = [this.solvedPath[0]];
  }

  ngOnInit(): void {

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

  handleKeyPress(direction: Direction) {
    const row = this.currentPath.at(-1)!.row + this.moves[direction][0];
    const col = this.currentPath.at(-1)!.col + this.moves[direction][1];
    if (row >= 0 && col >= 0 && row < this.rows && col < this.cols) {
      console.log('Moved to ' + row + ' ' + col);
    }
  }

  handleGameEnded() {
    this.gameEndedEvent.emit();
  }
}
