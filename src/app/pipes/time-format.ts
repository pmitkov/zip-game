import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
@Injectable({
  providedIn: 'root'
})
export class TimeFormat implements PipeTransform {
  transform(ms: number): string {
    if (isNaN(ms) || ms < 0) return '00:00:000';

    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;

    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = seconds.toString().padStart(2, '0');
    const paddedMilliseconds = milliseconds.toString().padStart(3, '0');

    return `${paddedMinutes}:${paddedSeconds}:${paddedMilliseconds}`;
  }
}
