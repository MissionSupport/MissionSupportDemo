import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Organization} from '../../interfaces/organization';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserPreferences} from '../../interfaces/user-preferences';
import {Observable, Subscription} from 'rxjs';
import {flatMap, map, switchMap} from 'rxjs/operators';
import {PreDefined} from '../../globals';
import {Trip} from '../../interfaces/trip';
import {Team} from '../../interfaces/team';

@Component({
  selector: 'app-groupadmin',
  templateUrl: './orgadmin.component.html',
  providers: [PreDefined],
  styleUrls: ['./orgadmin.component.css']
})
export class OrgadminComponent implements OnInit, OnDestroy {

  showMainMenu = true;
  showOrgCreation = false;
  orgName: string;
  allowOrgCreation = false; // we want to delay org creation after a user creates one
  orgList: Observable<Observable<Organization>[]>;
  orgSub: Subscription;

  constructor(private readonly db: AngularFirestore, private authInstance: AngularFireAuth, private preDef: PreDefined) {
    // Let's go ahead and list all the orgs the user is apart of
    this.authInstance.auth.onAuthStateChanged(user => {
      console.log(user.uid);
      this.orgList = this.db.doc(`user_preferences/${user.uid}`).valueChanges()
      .pipe(
        map((pref: UserPreferences) => {
          return pref.orgs.map((org: string) => {
            return this.db.doc(`organizations/${org}`).valueChanges().pipe(map((o: Organization) => {
              return o;
            }));
          });
        })
      );
      this.orgSub = this.orgList.subscribe(data => {
        this.allowOrgCreation = data.length <= 0;
      });
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.orgSub) {
      this.orgSub.unsubscribe();
    }
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
      const array = {};
      for (const w of this.preDef.wikiOrg) {
        array[w.title] = w.markup;
      }
      this.db.doc(`organizations/${id}/wiki/${wikiId}`).set(array);
    });
    this.allowOrgCreation = false;
    // TODO: wiki generation wont work as user_preferences gets added later
  }

}
