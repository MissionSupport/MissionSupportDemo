import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  isOpen: boolean;

  @Output()
  change: EventEmitter<boolean> = new EventEmitter<boolean>();

  toggle() {
    this.isOpen = !this.isOpen;
    this.change.emit(this.isOpen);
    console.log('toggle:' + this.isOpen);
  }
}
