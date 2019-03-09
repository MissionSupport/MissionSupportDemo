import {AfterContentInit, Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {SharedService} from 'src/app/service/shared-service.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SharedService],

  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterContentInit, OnDestroy {
  @ViewChild('toolbar', {read: ElementRef}) toolbar: ElementRef;
  title = 'missionSupport1';
  pageName;
  onMain = true;
  height;
  toolbarHeight;
  hasEditRights = false;
  elmnt;
  editMode = false;
  addName;

  hideToolbarSub: Subscription;
  pageNavSub: Subscription;
  canEditSub: Subscription;
  addNameSub: Subscription;

  constructor(private sharedService: SharedService) {
    this.hideToolbarSub = this.sharedService.hideToolbar.subscribe((onMain) => this.onMain = onMain);
    this.pageNavSub = this.sharedService.onPageNav.subscribe((page) => this.pageName = page);
    this.canEditSub = this.sharedService.canEdit.subscribe((hasEditRights) => this.hasEditRights = hasEditRights);
    this.addNameSub = this.sharedService.addName.subscribe((addName) => this.addName = addName);

    this.height = window.innerHeight - 100;

    window.addEventListener('resize', () => this.height = window.innerHeight - 100);
  }

  ngAfterContentInit(): void {
    // console.log(this.toolbar.nativeElement.children.namedItem('innerToolbar').offsetHeight);
    // this.toolbarHeight = this.toolbar.nativeElement.children.namedItem('innerToolbar').offsetHeight;
    // this.height = window.innerHeight - this.toolbarHeight;
  }

  ngOnDestroy(): void {
    if (this.addNameSub) {
      this.addNameSub.unsubscribe();
    }
    if (this.canEditSub) {
      this.canEditSub.unsubscribe();
    }
    if (this.pageNavSub) {
      this.pageNavSub.unsubscribe();
    }
    if (this.hideToolbarSub) {
      this.hideToolbarSub.unsubscribe();
    }
  }

  // onActivate(componentRef) {
  //   console.log(componentRef.constructor.name);
  //    if (componentRef.constructor.name === 'LoginComponent' || componentRef.constructor.name === 'RegisterComponent') {
  //       this.pageName = 'NoShow';
  //       this.showTool = true;
  //    } else {
  //       if (componentRef.constructor.name === 'LandingComponent') {
  //         this.pageName = 'Region Selection';
  //       }
  //      this.showTool = false;
  //    }
  // }
}
