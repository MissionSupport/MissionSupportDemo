import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  hideToolbar: EventEmitter<any> = new EventEmitter();
  onPageNav: EventEmitter<any> = new EventEmitter();
  canEdit: EventEmitter<any> = new EventEmitter();
  addSection: EventEmitter<any> = new EventEmitter();
  addName: EventEmitter<any> = new EventEmitter();
  goSites: EventEmitter<any> = new EventEmitter();
  scrollPanelHeightToSubtract: EventEmitter<number> = new EventEmitter();

  backHistory: Array<string> = [];
  selectedChecklists: Array<string> = [];

  constructor() { }
}
