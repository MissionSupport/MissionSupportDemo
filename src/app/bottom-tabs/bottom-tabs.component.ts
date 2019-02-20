import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BottomTab } from '../interfaces/bottom-tab';

@Component({
  selector: 'app-bottom-tabs',
  templateUrl: './bottom-tabs.component.html',
  styleUrls: ['./bottom-tabs.component.css']
})
export class BottomTabsComponent implements OnInit {

  @Input() tabs: Array<BottomTab>;
  @Output() tabClicked: EventEmitter<number> = new EventEmitter<number>();

  indexClicked = 0;

  constructor() { }

  ngOnInit() {
  }

  tabClick(index: number) {
    this.indexClicked = index;
    this.tabClicked.emit(index);
  }

}
