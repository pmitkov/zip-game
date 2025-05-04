import { Injectable } from '@angular/core';
import { StopwatchService } from './stopwatch.service';
import { GameID, GameStatistics } from '../types';
import { IdService } from './id.service';

@Injectable({
  providedIn: 'root'
})
export class GameStatisticsService {
  private statistics: Map<string,GameStatistics> = new Map();

  constructor(private stopWatchService: StopwatchService,
              private idService: IdService) {}

  startNewGame(): GameID {
    const id = this.idService.getUniqueID();
    this.stopWatchService.createStopWatch(id);
    this.statistics.set(id, {
      time: 0,
      moves: 0,
      backMoves: 0
    });
    return id;
  }

  pauseGame(gameID: GameID): boolean {
    return this.stopWatchService.stopStopWatch(gameID);
  }

  resumeGame(gameID: GameID): boolean {
    return this.stopWatchService.startStopWatch(gameID);
  }

  getStatistics(gameID: GameID) : GameStatistics | undefined {
    return this.statistics.get(gameID);
  }

  closeGame(gameID: GameID): boolean {
    this.stopWatchService.eraseStopWatch(gameID);
    return this.statistics.delete(gameID);
  }

  incrementMoves(gameID: GameID) {
    this.statistics.get(gameID)!.moves++;
  }

  incrementBackMoves(gameID: GameID) {
    return this.statistics.get(gameID)!.backMoves++;
  }
}
