import {Component, ViewEncapsulation} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {Globals, SharedService} from './globals';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Globals, SharedService],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'missionSupport1';
  pageName;
  onMain = true;

  constructor(db: AngularFirestore, private sharedService: SharedService) {
    sharedService.onMainEvent.subscribe(
      (onMain) => {
        console.log('event Activated  ' + onMain);
        this.onMain = onMain;
      }
    );
    sharedService.onPageNav.subscribe(
      (page) => {
        this.pageName = page;
      }
    );
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
