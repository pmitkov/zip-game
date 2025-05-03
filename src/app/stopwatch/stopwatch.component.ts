import { Component, Input, OnInit } from '@angular/core';
import { StopwatchService } from '../services/stopwatch.service';
import { StopWatchID, StopWatchState, StopWatchTime } from '../types';
import { interval, Observable } from 'rxjs';

@Component({
  selector: 'stopwatch',
  imports: [],
  templateUrl: './stopwatch.component.html',
  styleUrl: './stopwatch.component.scss'
})
export class StopwatchComponent implements OnInit {
  @Input({required: true})
  stopWatchStateChange!: Observable<StopWatchState>;

  protected readonly Math = Math;
  private readonly stopWatchID: StopWatchID;
  stopWatchTime: StopWatchTime = 0;

  constructor (private stopWatchService: StopwatchService) {
    this.stopWatchID = this.stopWatchService.getNewStopWatch();
    interval(10).subscribe(() => {
      this.stopWatchTime = this.stopWatchService.getStopWatch(this.stopWatchID)!;
    });
  }

  ngOnInit(): void {
    this.stopWatchStateChange.subscribe(state => {
      if (state === 'Running') {
        this.stopWatchService.startStopWatch(this.stopWatchID);
      } else {
        this.stopWatchService.stopStopWatch(this.stopWatchID);
      }
    });
  }
}
