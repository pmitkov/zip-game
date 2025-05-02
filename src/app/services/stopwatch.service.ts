import { Injectable } from '@angular/core';
import { StopWatchData, StopWatchID, StopWatchTime } from '../types';

@Injectable({
  providedIn: 'root'
})
export class StopwatchService {
  private stopWatchData: Map<StopWatchID, StopWatchData> = new Map();
  private currentId: number = 1;

  constructor() { }

  getNewStopWatch(): StopWatchID {
    const stopWatchID = this.currentId.toString();
    this.stopWatchData.set(stopWatchID, {
      isRunning: true,
      startTime: Date.now(),
      accumulatedTime: 0
    });
    this.currentId++;
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

  resetStopWatch(id: StopWatchID) {
    this.stopWatchData.set(id, {
      isRunning: true,
      startTime: Date.now(),
      accumulatedTime: 0
    })
  }
}
