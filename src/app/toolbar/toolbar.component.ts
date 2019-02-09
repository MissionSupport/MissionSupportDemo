import { Component, OnInit, Input } from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import { SidebarService } from '../service/sidebar.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Input() header;
  display;
  constructor(public router: Router, private _location: Location, public sidebarService: SidebarService) { }

  ngOnInit() {
    this.sidebarService.change.subscribe((isOpen: boolean) => {
      this.display = isOpen;
    });
  }

  restoreFront(event) {
    this.router.navigate(['', { outlets: { sidebar: ['settingsOptions'] } }]);
    // this._location.back();
  }

}
