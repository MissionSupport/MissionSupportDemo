import {Component, ViewEncapsulation} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Globals } from './globals';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ Globals ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'missionSupport1';
  showTool;

  constructor(db: AngularFirestore, private globals: Globals) {
  }
}
