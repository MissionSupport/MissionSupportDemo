import {AfterContentInit, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {SharedService} from './globals';
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

  constructor(db: AngularFirestore, private sharedService: SharedService) {
    this.hideToolbarSub = sharedService.hideToolbar.subscribe((onMain) => this.onMain = onMain);
    this.pageNavSub = sharedService.onPageNav.subscribe((page) => this.pageName = page);
    this.canEditSub = sharedService.canEdit.subscribe((hasEditRights) => this.hasEditRights = hasEditRights);
    this.addNameSub = sharedService.addName.subscribe((addName) => this.addName = addName);

    this.height = window.innerHeight - 50;

    window.addEventListener('resize', () => this.height = window.innerHeight - 50);
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
