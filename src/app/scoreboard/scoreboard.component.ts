import { Component, Input, OnInit } from '@angular/core';
import { StopwatchComponent } from '../stopwatch/stopwatch.component';
import { Observable, Subject } from 'rxjs';
import { GameState, StopWatchState } from '../types';

@Component({
  selector: 'scoreboard',
  imports: [
    StopwatchComponent
  ],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss'
})
export class ScoreboardComponent implements OnInit {
  @Input({required: true})
  moves!: number;

  @Input({required: true})
  backwardMoves!: number;

  @Input({required: true})
  gameStateChange!: Observable<GameState>;

  stopWatchStateEmitter: Subject<StopWatchState> = new Subject<StopWatchState>();

  ngOnInit(): void {
    this.gameStateChange.subscribe((gameState: GameState) => {
      this.stopWatchStateEmitter.next(gameState);
    })
  }
}
