import {AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {SharedService} from './globals';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SharedService],

  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterContentInit {
  @ViewChild('toolbar', {read: ElementRef}) toolbar: ElementRef;
  title = 'missionSupport1';
  pageName;
  onMain = true;
  height;
  toolbarHeight;
  elmnt;

  constructor(db: AngularFirestore, private sharedService: SharedService) {
    sharedService.hideToolbar.subscribe(
      (onMain) => {
        this.onMain = onMain;
      }
    );
    sharedService.onPageNav.subscribe(
      (page) => {
        this.pageName = page;
      }
    );

    this.height = window.innerHeight;
  }

  ngAfterContentInit(): void {
    console.log(this.toolbar.nativeElement.children.namedItem('innerToolbar').offsetHeight);
    this.toolbarHeight = this.toolbar.nativeElement.children.namedItem('innerToolbar').offsetHeight;
    this.height = window.innerHeight - this.toolbarHeight;
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
