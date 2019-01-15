import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Input() header;
  display;
  constructor(public router: Router) { }

  ngOnInit() {
  }

  restoreFront(event) {
    this.router.navigate(['', { outlets: { sidebar: ['settingsOptions'] } }]);
  }

}
