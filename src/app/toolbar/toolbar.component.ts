import {Component, OnInit, Input, OnChanges, Output, EventEmitter} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import { SidebarService } from '../service/sidebar.service';
import {SharedService} from '../globals';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnChanges {
  @Input() header;
  @Input() hasEditRights;
  @Input() editMode;
  @Input() addName;
  display;

  isLanding: boolean;
  constructor(public router: Router, private _aRoute: ActivatedRoute, private _location: Location, public sidebarService: SidebarService,
              private sharedService: SharedService) {
    this.isLanding = !(this.router.url === '' || this.router.url === '/landing');

  }

  ngOnInit() {
    this.sidebarService.change.subscribe((isOpen: boolean) => {
      this.display = isOpen;
    });
  }

  ngOnChanges() {
    this.isLanding = !(this.router.url === '' || this.router.url.includes('/landing'));
  }

  restoreFront(event) {
    this.router.navigate(['', { outlets: { sidebar: ['settingsOptions'] } }]);
  }

  navBack(event) {
    this.navHelper(this.router.parseUrl(this.router.url).root.children.primary.segments);
  }
  navHelper(urlSegs) {
    let url = '';
    for (let i = 0; i < urlSegs.length - 1; i++) {
      url = url + '/' + urlSegs[i].toString();
    }
    if (url === '') {
      url = '/landing';
    }
    this.router.navigateByUrl(url)
      .then(() => {
        console.log('Route exists, redirection is done');
        if (urlSegs.toString().includes('site')) {
          this.sharedService.goSites.emit(true);
        }
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
