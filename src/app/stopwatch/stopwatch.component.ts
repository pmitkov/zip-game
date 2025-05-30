import { Component, Input, OnInit } from '@angular/core';
import { GameID, GameStatistics } from '../types';
import { interval } from 'rxjs';
import { GameStatisticsService } from '../services/game-statistics.service';
import { TimeFormat } from '../pipes/time-format';

@Component({
  selector: 'stopwatch',
  imports: [
    TimeFormat
  ],
  templateUrl: './stopwatch.component.html',
  styleUrl: './stopwatch.component.scss'
})
export class StopwatchComponent implements OnInit {
  @Input({required: true})
  gameID!: GameID;

  protected gameStatistics!: GameStatistics;

  constructor (private gameStatisticsService: GameStatisticsService) {}

  ngOnInit(): void {
    this.gameStatistics = this.gameStatisticsService.getStatistics(this.gameID)!;
    interval(5).subscribe(() => {
      this.gameStatistics = this.gameStatisticsService.getStatistics(this.gameID)!;
    });
  }
}
