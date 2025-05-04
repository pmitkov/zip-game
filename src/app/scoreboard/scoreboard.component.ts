import { Component, Input, OnInit } from '@angular/core';
import { StopwatchComponent } from '../stopwatch/stopwatch.component';
import { interval, Observable, Subject } from 'rxjs';
import { GameID, GameState, GameStatistics, StopWatchState } from '../types';
import { GameStatisticsService } from '../services/game-statistics.service';

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
  gameID!: GameID;

  @Input({required: true})
  gameStateChange!: Observable<GameState>;

  stopWatchState: Subject<StopWatchState> = new Subject<StopWatchState>();
  gameStatistics!: GameStatistics;

  constructor(private gameStatisticsService: GameStatisticsService) { }


  ngOnInit(): void {
    this.gameStateChange.subscribe((gameState: GameState) => {
      this.stopWatchState.next(gameState === 'Running' ? 'Running' : 'Paused');
    });
    interval(5).subscribe(() =>{
      this.gameStatistics = this.gameStatisticsService.getStatistics(this.gameID)!;
    });
  }
}
