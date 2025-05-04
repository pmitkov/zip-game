import { Injectable } from '@angular/core';
import { ID } from '../types';

@Injectable({
  providedIn: 'root'
})
export class IdService {
  private id: number = 0;

  constructor() { }

  getUniqueID(): ID {
    this.id++;
    return String(this.id);
  }
}
