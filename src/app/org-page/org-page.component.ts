import { Component, OnInit } from '@angular/core';
import {PreDefined, SharedService} from '../globals';
import {ActivatedRoute, Router} from '@angular/router';
import {Trip} from '../interfaces/trip';
import {Team} from '../interfaces/team';
import {AngularFirestore} from '@angular/fire/firestore';
import {Organization} from '../interfaces/organization';
import {Observable, Subscribable, Subscription} from 'rxjs';
import {exhaustMap, flatMap, map} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-group-page',
  templateUrl: './org-page.component.html',
  providers: [PreDefined],
  styleUrls: ['./org-page.component.css']
})
export class OrgPageComponent implements OnInit {
  orgId: string;
  orgName: string;
  currentWikiId: string;
  markdown: string;
  viewWiki = true;
  viewTeams = false;
  viewTrips = false;

  sections = [];
  editText = [];
  editHeaderText: string; // Used for setting a field when submitting an edit
  hideme = [];
  footerHeight = 45;
  canEdit = false;
  tripIds: Observable<string>[];
  tripsObservable: Observable<Trip>[];
  trips: Trip[] = [];
  teamIds: string[];
  teams: Observable<Team>[];
  selectedTrip: Trip;

  orgObservable: Observable<Organization>;

  // TODO: Change to proper value based on edit privileges
  editMode = true;  // this means the user can edit
  showNewSectionPopup = false;
  newSectionText;
  newSectionName;

  constructor(private sharedService: SharedService, public router: Router, private preDef: PreDefined,
              private readonly db: AngularFirestore, private route: ActivatedRoute, private authInstance: AngularFireAuth) {
    /*
    this.route.params.subscribe((params) => {
      this.orgId = params['id'];
      this.ngOnInit();
    });
    */
    // ToDo : edit based on rights
    sharedService.canEdit.emit(true);
    sharedService.addName.emit('New Section');
    sharedService.addSection.subscribe(
      () => {
        this.showNewSectionPopup = true;
      }
    );
  }

  ngOnInit() {
    this.sharedService.hideToolbar.emit(false);
    this.orgId = this.route.snapshot.paramMap.get('id');
    this.orgObservable = this.db.doc(`organizations/${this.orgId}`).valueChanges().pipe(map((org: Organization) => {
      this.teams = org.teamIds.map( teamId => {
        const x = this.db.doc(`teams/${teamId}`).valueChanges().pipe(map((team: Team) => {
          return team;
        }));
        return x;
      });
      this.tripIds = this.teams.map(team => {
        return team.pipe(flatMap(t => {
          return t.trips;
        }));
      });
      this.tripsObservable = this.tripIds.map(t => {
        return t.pipe(flatMap(tripId => {
          return this.db.doc(`trips/${tripId}`).valueChanges().pipe(map((data: Trip) => {
            return data;
          }));
        }));
      });

      this.tripsObservable.map(obs => {
        obs.subscribe((trip: Trip) => {
          if (this.trips.indexOf(trip) === -1) {
            this.trips = [...this.trips, trip];
          }
        });
      });
      this.tripIds.map(data => {
        data.subscribe();
      });
      return org;
    }));

    this.orgObservable.subscribe((org: Organization) => {
      this.orgName = org.name;
      this.currentWikiId = org.currentWiki;
      this.sharedService.onPageNav.emit(this.orgName);
      // Check if the user can edit
      this.authInstance.auth.onAuthStateChanged(user => {
        this.canEdit = org.admins.includes(user.uid);
      });
    });
  }

  test() {
    console.log(this.trips);
    this.trips.push({id: 'test', 'current': 'fdsf', orgId: 'fsdfsd', tripName: 'fsdfsdf'});
  }

  tripClick(): void {
    console.log(this.selectedTrip);
    this.router.navigate(['trip/' + this.selectedTrip.id]);
    // this.router.navigate(['/temp']);
  }

  /**
   * Used for updating an already existing wiki entry.
   */
  submitWikiEdit(title, index): void {
    const json = {};
    json[title] = this.editText[index];
    this.db.doc(`organizations/${this.orgId}/wiki/${this.currentWikiId}`).update(json);
  }

  /**
   * Used for generating a new wiki entry
   */
  submitNewWikiEdit(title, text): void {
    const json = {};
    json[title] = text;
    this.db.doc(`organizations/${this.orgId}/wiki/${this.currentWikiId}`).update(json);
  }

  /**
   * Used for updating the title of an entry.
   */
  updateWikiTitle(oldTitle, newTitle, index): void {
    const json = {};
    json[oldTitle] = firebase.firestore.FieldValue.delete();
    json[newTitle] = this.sections[index];
    this.db.doc(`organizations/${this.orgId}/wiki/${this.currentWikiId}`).update(json);
  }

  submitNewSection() {
    console.log(this.newSectionName, this.newSectionText);
    // TODO: if(add works )
    this.showNewSectionPopup = false;
  }
}
