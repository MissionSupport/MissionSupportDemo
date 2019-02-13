import {Component, OnInit, Input} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import { SidebarService } from '../service/sidebar.service';
import {SharedService} from '../globals';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Input() header;
  @Input() hasEditRights;
  @Input() editMode;
  @Input() addName;
  display;
  constructor(public router: Router, private _aRoute: ActivatedRoute, private _location: Location, public sidebarService: SidebarService,
              private sharedService: SharedService) {
  }

  ngOnInit() {
    this.sidebarService.change.subscribe((isOpen: boolean) => {
      this.display = isOpen;
    });
  }

  restoreFront(event) {
    this.router.navigate(['', { outlets: { sidebar: ['settingsOptions'] } }]);
  }

  navBack(event) {
    this.navHelper(this.router.parseUrl(this.router.url).root.children.primary.segments);
  }
  navHelper(urlSegs) {
    var url = '';
    for (var i = 0; i < urlSegs.length - 1; i++) {
      url = url + '/' + urlSegs[i].toString();
    }
    if (url === '') {
      url = '/landing';
    }
    this.router.navigateByUrl(url)
      .then(data => {
        console.log('Route exists, redirection is done');
      })
      .catch(e => {
        console.log('Route does not exists, redirection edit');
        const segs = this.router.parseUrl(url).root.children.primary.segments;
        this.navHelper(segs);
      });
  }
  // toggleEditMode() {
  //   this.editMode = !this.editMode;
  //   this.sharedService.editToggle.emit(this.editMode);
  // }

  addSection() {
    this.sharedService.addSection.emit();
  }

}
