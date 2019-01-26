import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Site} from '../interfaces/site';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserSettings} from '../interfaces/user-settings';
import {UserPreferences} from '../interfaces/user-preferences';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
  organization: string;
  sites;
  groups;
  isAdmin;
  constructor(public authInstance: AngularFireAuth, private readonly db: AngularFirestore, public router: Router) {
    this.authInstance.auth.onAuthStateChanged(user => {
      this.email = user.email;
      this.id = user.uid;
      console.log(this.id);
      this.db.doc(`users/${this.id}`).valueChanges().subscribe((data: UserSettings) => {

        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.organization = data.organization;
        // this.groups = data.groups;
      });
      this.db.doc(`user_preferences/${this.id}`).valueChanges().subscribe((data: UserPreferences) => {
        this.isAdmin = data.admin;
        this.sites = data.sites;
      });
      // TODO: this function only updates the email text input field after being clicked on. Needs to be fixed.
    });


    // this.db.doc(`groups/${this.id}`).valueChanges().subscribe((data: UserPreferences) => {
    //   console.log(data);
    //   this.isAdmin = data.admin;
    //   this.sites = data.sites;
    // });

  }

  ngOnInit() {
    // this.authInstance.auth.onAuthStateChanged(user => {
    //   this.email = user.email;
    //   this.id = user.uid;
    //   // TODO: this function only updates the email text input field after being clicked on. Needs to be fixed.
    // });
  }

}
