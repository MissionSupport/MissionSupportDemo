import { Component, OnInit } from '@angular/core';
import {PreDefined, SharedService} from '../globals';
import {ActivatedRoute, Router} from '@angular/router';
import {Trip} from '../interfaces/trip';
import {Team} from '../interfaces/team';
import {AngularFirestore} from '@angular/fire/firestore';
import {Organization} from '../interfaces/organization';
import {Observable, Subscribable, Subscription} from 'rxjs';
import {exhaustMap, flatMap, map} from 'rxjs/operators';

@Component({
  selector: 'app-group-page',
  templateUrl: './org-page.component.html',
  providers: [PreDefined],
  styleUrls: ['./org-page.component.css']
})
export class OrgPageComponent implements OnInit {
  orgId: string;
  orgName: string;
  markdown: string;
  viewWiki = true;
  viewTeams = false;
  viewTrips = false;

  sections = [];
  editText = [];
  editHeaderText: string; // Used for setting a field when submitting an edit
  hideme = [];
  footerHeight = 45;
  editMode = false;
  canEdit = false;
  tripIds: Observable<string>[];
  tripsObservable: Observable<Trip>[];
  trips: Trip[] = [];
  teamIds: string[];
  teams: Observable<Team>[];
  selectedTrip: Trip;

  orgObservable: Observable<Organization>;


  constructor(private sharedService: SharedService, public router: Router, private preDef: PreDefined,
              private readonly db: AngularFirestore, private route: ActivatedRoute) {
    /*
    this.route.params.subscribe((params) => {
      this.orgId = params['id'];
      this.ngOnInit();
    });
    */
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
      })
      this.tripIds.map(data => {
        data.subscribe();
      });
      /*
      console.log(this.teams);
      this.trips = this.teams.map(team => {
        // This is each team in the observable list for trips
        console.log('lel');
        console.log(team);
        return team.pipe(exhaustMap (tr => {
          console.log('lelelelel');
          console.log(tr);
          return tr.trips.map(t => {
            console.log(t);
            console.log('sdvfbhjksdfhksdfhk');
            return this.db.doc(`trips/${t}`).valueChanges().pipe(map((data: Trip) => {
              console.log('sdvfbhjksdfhksdsfsdfsdfdfhk');
              console.log(data);
              return data;
            }));
          });
        }));
      });
      */
      return org;
    }));

    this.orgObservable.subscribe((org: Organization) => {
      this.orgName = org.name;
      this.sharedService.onPageNav.emit(this.orgName);
    });

    /*
    const teamSubscribes = [];
    this.db.doc(`organizations/${this.orgId}`).valueChanges().subscribe((data: Organization) => {
      this.orgName = data.name;
      sharedService.onPageNav.emit(this.orgName);
      this.teams = [];
      this.teamIds = [];
      this.tripIds = [];
      this.trips = [];
      // unsubscribe from past
      for (const subs of teamSubscribes) {
        subs.unsubscribe();
      }
      for (const t of data.teamIds) {
        const teamSub = this.db.doc(`teams/${t}`).valueChanges().subscribe((team: Team) => {
          const index = this.teamIds.indexOf(team.id);
          if (index > -1) { // Already contained and needs to be reloaded
            this.teams[index] = team;
          } else {
            this.teamIds.push(team.id);
            this.teams.push(team);
            teamSubscribes.push(teamSub);
          }
          // Now lets get the trips
          for (const trip of team.trips) {
            this.db.doc(`trips/${trip}`).valueChanges().subscribe((tr: Trip) => {
              const i = this.teamIds.indexOf(tr.id);
              if (i > -1) { // Already contained and needs to be reloaded
                this.trips[i] = tr;
              } else {
                this.tripIds.push(tr.id);
                this.trips.push(tr);
                console.log(tr);
              }
            });
          }
        });
      }
    });
    for (const element of preDef.wikiOrg) {
      this.sections.push({title: element.title, markup: element.markup});
      // this.editText.push({title: element.title, markup: element.markup});
    }
    */
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

  submitEdit(title, index): void {
  }
}
