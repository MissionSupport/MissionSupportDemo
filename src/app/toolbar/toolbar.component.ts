import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {Router} from '@angular/router';
import { SidebarService } from '../service/sidebar.service';
import {SharedService} from '../service/shared-service.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnChanges {
  @Input() header = '';
  @Input() hasEditRights;
  @Input() editMode;
  @Input() addName = '';
  display;
  width: any = window.innerWidth;
  shortNum: number = Math.floor((this.width - 280) / 10);

  isLanding: boolean;
  constructor(public router: Router, public sidebarService: SidebarService,
              private sharedService: SharedService) {
    this.isLanding = this.router.url === '/';
  }

  ngOnInit() {
    this.sidebarService.change.subscribe((isOpen: boolean) => this.display = isOpen);
    this.width = window.innerWidth;
  }

  ngOnChanges() {
    this.isLanding = this.router.url === '/';
  }

  restoreFront(event) {
    this.router.navigate(['', { outlets: { sidebar: ['settingsOptions'] } }]);
  }

  navBack() {
    const prevUrl = this.sharedService.backHistory.pop();
    if (prevUrl) {
      this.router.navigateByUrl(prevUrl);
    } else {
      this.navHelper(this.router.parseUrl(this.router.url).root.children.primary.segments);
    }
  }

  goHome() {
    this.router.navigateByUrl('').catch(err => {
      console.log(err);
    });
  }

  navHelper(urlSegs) {
    let url = '';
    if (urlSegs) {
      for (let i = 0; i < urlSegs.length - 1; i++) {
        url = url + '/' + urlSegs[i].toString();
      }
      // if (url === '') {
      //   url = '/landing';
      // }
      this.router.navigateByUrl(url)
        .then(() => {
          console.log('Route exists, redirection is done');
          if (urlSegs.toString().includes('site')) {
            this.sharedService.goSites.emit(true);
          }
        })
        .catch(() => {
          console.log('Route does not exists, redirection edit');
          const segs = this.router.parseUrl(url).root.children.primary.segments;
          this.navHelper(segs);
        });
    }
  }

  onResize(event) {
    this.width = window.innerWidth;
    if (this.width > 280) {
      this.shortNum = Math.floor((this.width - 280) / 10) ;
    }
  }

  // toggleEditMode() {
  //   this.editMode = !this.editMode;
  //   this.sharedService.editToggle.emit(this.editMode);
  // }

  addSection() {
    this.sharedService.addSection.emit();
  }

}
