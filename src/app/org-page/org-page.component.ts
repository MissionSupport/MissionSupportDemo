import {Component, OnDestroy, OnInit} from '@angular/core';
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
import { BottomTab } from '../interfaces/bottom-tab';
import {MessageService} from 'primeng/api';
import {async} from 'q';

@Component({
  selector: 'app-group-page',
  templateUrl: './org-page.component.html',
  providers: [PreDefined],
  styleUrls: ['./org-page.component.css']
})
export class OrgPageComponent implements OnInit, OnDestroy {
  orgId: string;
  orgName: string;
  currentWikiId: string;
  markdown: string;
  viewWiki = true;
  viewTeams = false;
  viewTrips = false;

  sections: Observable<any[]>;
  editHeaderText: string; // Used for setting a field when submitting an edit
  hideme = [];
  footerHeight = 45;
  tripIds: Observable<string>[];
  tripsObservable: Observable<Trip>[];
  trips: Trip[] = [];
  teamIds: string[];
  teams: Observable<Team>[];
  selectedTrip: Trip;

  orgObservable: Observable<Organization>;

  subAddSection: Subscription;
  orgSub: Subscription;
  obsSubArr: Subscription[];
  dataSubArr: Subscription[];

  // TODO: Change to proper value based on edit privileges
  showNewSectionPopup = false;
  newSectionText;
  newSectionName;
  newTeamName;
  newTripCountry;
  newTripSite;
  newTripTeam;

  // ToDO change based on permissions
  canEditWiki = false;  // this means the user can edit
  canEditTeams = false;
  canEditTrips = false;

  members = [{value: ''}];

  tabs: Array<BottomTab> = [{name: 'Wiki', icon: 'pi pi-align-justify'},
                            {name: 'Teams', icon: 'pi pi-users'},
                            {name: 'Trips', icon: 'pi pi-briefcase'}];

  constructor(public sharedService: SharedService, public router: Router, private preDef: PreDefined,
              private readonly db: AngularFirestore, private route: ActivatedRoute, private authInstance: AngularFireAuth,
              private messageService: MessageService) {
    /*
    this.route.params.subscribe((params) => {
      this.orgId = params['id'];
      this.ngOnInit();
    });
    */
    this.subAddSection = sharedService.addSection.subscribe(
      () => {
        this.showNewSectionPopup = true;
      }
    );
    this.dataSubArr = [];
    this.obsSubArr = [];
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
        return team.pipe(flatMap((t: Team) => {
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
        const obsSub = obs.subscribe((trip: Trip) => {
          if (this.trips.indexOf(trip) === -1) {
            this.trips = [...this.trips, trip];
          }
        });
        this.obsSubArr = [...this.obsSubArr, obsSub];
      });
      this.tripIds.map(data => {
        const dataSub = data.subscribe();
        this.dataSubArr = [...this.dataSubArr, dataSub];
      });
      // Get wiki data
      this.sections = this.db.doc(`organizations/${this.orgId}/wiki/${org.currentWiki}`).valueChanges().pipe(map(data => {
        const sections = [];
        for (const title in data) {
          if (data.hasOwnProperty(title)) {
            const markup = data[title];
            sections.push({title, markup});
          }
        }
        return sections;
      }));
      return org;
    }));

    this.orgSub = this.orgObservable.subscribe((org: Organization) => {
      this.orgName = org.name;
      this.currentWikiId = org.currentWiki;
      this.sharedService.onPageNav.emit(this.orgName);
      this.teamIds = org.teamIds;
      // Check if the user can edit
      this.authInstance.auth.onAuthStateChanged(user => {
        this.canEditTrips = this.canEditTeams = this.canEditWiki = org.admins.includes(user.uid);
        if (this.viewWiki) {
          this.sharedService.addName.emit('New Section');
          this.sharedService.canEdit.emit(this.canEditWiki);
        } else if (this.viewTeams) {
          this.sharedService.addName.emit('New Team');
          this.sharedService.canEdit.emit(this.canEditTeams);
        } else {
          this.sharedService.addName.emit('New Trip');
          this.sharedService.canEdit.emit(this.canEditTrips);
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.subAddSection) {
      this.subAddSection.unsubscribe();
    }
    if (this.orgSub) {
      this.orgSub.unsubscribe();
    }
    let sub: Subscription;
    for (sub of this.obsSubArr) {
      sub.unsubscribe();
    }
    for (sub of this.dataSubArr) {
      sub.unsubscribe();
    }
  }

  tripClick(): void {
    console.log(this.selectedTrip);
    this.router.navigate(['trip/' + this.selectedTrip.id]);
    // this.router.navigate(['/temp']);
  }

  /**
   * Used for updating an already existing wiki entry.
   */
  submitWikiEdit(title, markup): void {
    const json = {};
    json[title] = markup;
    this.db.doc(`organizations/${this.orgId}/wiki/${this.currentWikiId}`).update(json);
  }

  submitNewSection() {
    console.log(this.newSectionName, this.newSectionText);
    // add to db
    const json = {};
    json[this.newSectionName] = this.newSectionText;
    this.db.doc(`organizations/${this.orgId}/wiki/${this.currentWikiId}`).update(json);
  }

  addAnotherMember() {
    this.members.push({value: ''});
  }

  async submitNewTeam() {
    console.log(this.orgName, this.newTeamName, this.members);
    // Look up emails to uid to see if exists.
    const failed = [];
    const proms = [];
    console.log(this.members);
    for (const member of this.members) {
      if (member.value === '') {
        continue;
      }
      proms.push(this.db.doc(`emails/${member.value}`).get().toPromise().then(data => {
        if (!data.exists) {
          // Display error to user that the email does not exist
          failed.push(member.value);
        }
      }));
    }
    await Promise.all(proms);
    // Find if there are any non existent emails
    if (failed.length === 0) {
      this.showNewSectionPopup = false;
      // Let's go ahead and create the team
      const teamId = this.db.createId();
      const members = this.members.map(m => m.value);
      const team: Team = {
        admins: members,
        id: teamId,
        name: this.newTeamName,
        org: this.orgId,
        trips: []
      };
      this.db.firestore.batch().set(this.db.doc(`teams/${teamId}`).ref, team)
        .update(this.db.doc(`organizations/${this.orgId}`).ref, {teamIds: [...this.teamIds, teamId]})
        .commit()
        .then(() => {
        console.log('Success!');
        this.newTeamName = '';
        this.members = [{value: ''}];
      }).catch( error => {
        console.log('Failure!');
        console.log(error);
      });
    } else {
      const errors = [];
      for (const email of failed) {
        errors.push({severity: 'info', summary: 'Member Failure', detail: `The email ${email} does not exist`});
      }
      this.messageService.addAll(errors);
    }
  }

  submitNewTrip() {
    console.log(this.newTripCountry, this.newTripSite, this.newTripTeam);
    this.showNewSectionPopup = false;
  }

  onTabClicked(tab: number) {
    if (tab === 0) {
      this.viewWiki = true;
      this.viewTeams = false;
      this.viewTrips = false;
      this.sharedService.addName.emit('New Section');
      this.sharedService.canEdit.emit(this.canEditWiki);
    } else if (tab === 1) {
      this.viewWiki = false;
      this.viewTeams = true;
      this.viewTrips = false;
      this.sharedService.addName.emit('New Team');
      this.sharedService.canEdit.emit(this.canEditTeams);
    } else if (tab === 2) {
      this.viewWiki = false;
      this.viewTeams = false;
      this.viewTrips = true;
      this.sharedService.addName.emit('New Trip');
      this.sharedService.canEdit.emit(this.canEditTrips);
    }
  }
}
