import { Injectable } from '@angular/core';
import { StopWatchData, StopWatchID, StopWatchTime } from '../types';
import { IdService } from './id.service';

@Injectable({
  providedIn: 'root'
})
export class StopwatchService {
  private stopWatchData: Map<StopWatchID, StopWatchData> = new Map();

  constructor() { }

  createStopWatch(stopWatchID: StopWatchID) {
    this.stopWatchData.set(stopWatchID, {
      isRunning: true,
      startTime: Date.now(),
      accumulatedTime: 0
    });
    return stopWatchID;
  }

  getStopWatch(id: StopWatchID): StopWatchTime | null {
    if (!this.stopWatchData.has(id)) {
      return null;
    }
    const stopWatchData = this.stopWatchData.get(id)!;
    if (stopWatchData.isRunning) {
      return stopWatchData.accumulatedTime + Date.now() -  stopWatchData.startTime;
    } else {
      return stopWatchData.accumulatedTime;
    }
  }

  stopStopWatch(id: StopWatchID): boolean {
    if (!this.stopWatchData.has(id) || !this.stopWatchData.get(id)!.isRunning) {
      return false;
    }
    const stopWatchData = this.stopWatchData.get(id)!;
    stopWatchData.isRunning = false;
    stopWatchData.endTime = Date.now();
    stopWatchData.accumulatedTime += stopWatchData.endTime - stopWatchData.startTime;
    return true;
  }

  startStopWatch(id: StopWatchID): boolean {
    if (!this.stopWatchData.has(id) || this.stopWatchData.get(id)!.isRunning) {
      return false;
    }
    const stopWatchData = this.stopWatchData.get(id)!;
    stopWatchData.isRunning = true;
    stopWatchData.startTime = Date.now();
    return true;
  }

  eraseStopWatch(id: StopWatchID): boolean {
    return this.stopWatchData.delete(id);
  }

  resetStopWatch(id: StopWatchID) {
    this.stopWatchData.set(id, {
      isRunning: true,
      startTime: Date.now(),
      accumulatedTime: 0
    })
  }
}
