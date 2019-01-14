import {Component, ViewEncapsulation} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'missionSupport1';
  showTool;
  pageName;

  constructor(db: AngularFirestore) {
  }

  onActivate(componentRef) {
    console.log(componentRef.constructor.name);
     if (componentRef.constructor.name === 'LoginComponent' || componentRef.constructor.name === 'RegisterComponent') {
        this.pageName = 'NoShow';
        this.showTool = true;
     } else {
        if (componentRef.constructor.name === 'LandingComponent') {
          this.pageName = 'Region Selection';
        }
       this.showTool = false;
     }
  }
}
