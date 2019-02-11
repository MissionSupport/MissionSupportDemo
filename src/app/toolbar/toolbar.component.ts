import { Component, OnInit, Input } from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import { SidebarService } from '../service/sidebar.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Input() header;
  @Input() hasEditRights;
  display;
  constructor(public router: Router, private _aRoute: ActivatedRoute, private _location: Location, public sidebarService: SidebarService) { }

  ngOnInit() {
    this.sidebarService.change.subscribe((isOpen: boolean) => {
      this.display = isOpen;
    });
  }

  restoreFront(event) {
    this.router.navigate(['', { outlets: { sidebar: ['settingsOptions'] } }]);
    // this._location.back();
  }

  navBack(event) {
    window.history.back();

    // console.log(this._aRoute.snapshot._routerState.url);
    // console.log(this.router.routerState.snapshot);
    // console.log(this.router.parseUrl(this.router.routerState.snapshot.url));


    // const routerLink = this._aRoute.parent.snapshot.pathFromRoot
    //   .map((s) => s.url)
    //   .reduce((a, e) => {
    //     // Do NOT add last path!
    //     if (a.length + e.length !== this._aRoute.parent.snapshot.pathFromRoot.length) {
    //       return a.concat(e);
    //     }
    //     return a;
    //   })
    //   .map((s) => s.path);
    // this.router.navigate(routerLink);
  }

  editMode() {

  }

}
