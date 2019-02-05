import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Organization} from '../../interfaces/organization';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserPreferences} from '../../interfaces/user-preferences';
import {Observable} from 'rxjs';
import {flatMap, map, switchMap} from 'rxjs/operators';
import {PreDefined} from '../../globals';

@Component({
  selector: 'app-groupadmin',
  templateUrl: './orgadmin.component.html',
  styleUrls: ['./orgadmin.component.css']
})
export class OrgadminComponent implements OnInit {

  showMainMenu = true;
  showOrgCreation = false;

  orgName: string;
  allowOrgCreation = false; // we want to delay org creation after a user creates one

  orgList: Observable<Observable<Organization>[]>;

  constructor(private readonly db: AngularFirestore, private authInstance: AngularFireAuth, private preDef: PreDefined) {
    // Let's go ahead and list all the orgs the user is apart of
    this.authInstance.auth.onAuthStateChanged(user => {
      console.log(user.uid);
      this.orgList = this.db.doc(`user_preferences/${user.uid}`).valueChanges().pipe(map((pref: UserPreferences) => {
        return pref.orgs.map((org) => {
          return this.db.doc(`organizations/${org}`).valueChanges().pipe(map((o: Organization) => {
            return o;
          }));
        });
      }));
      this.orgList.subscribe(data => {
        if (data.length > 0) {
          // User already has an org and we should just hide the option
          this.allowOrgCreation = false;
        } else {
          this.allowOrgCreation = true;
        }
      });
    });
  }

  ngOnInit() {
  }

  showOrgCreationMethod() {
    this.showMainMenu = false;
    this.showOrgCreation = true;
  }

  showMainOrgMethod() {
    this.showMainMenu = true;
    this.showOrgCreation = false;
  }

  createOrg() {
    const id = this.db.createId();
    const wikiId = this.db.createId();
    const org = {
      admins: [this.authInstance.auth.currentUser.uid],
      currentWiki: wikiId,
      id: id,
      name: this.orgName,
      teamIds: []
    };
    this.db.doc(`organizations/${id}`).set(org).then(() => {
      // Pregenerate organization wiki
      this.db.doc(`organizations/${id}/wiki/${wikiId}`).set(this.preDef.wikiCountry);
    });
  }

}
