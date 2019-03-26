import {Component, OnDestroy, OnInit} from '@angular/core';
import {PreDefined} from '../globals';
import {SharedService} from '../service/shared-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Trip} from '../interfaces/trip';
import {Team} from '../interfaces/team';
import {AngularFirestore} from '@angular/fire/firestore';
import {Organization} from '../interfaces/organization';
import {Observable, Subscription} from 'rxjs';
import {flatMap, map, take} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';
import { BottomTab } from '../interfaces/bottom-tab';
import {MessageService} from 'primeng/api';
import {Wikidata} from '../interfaces/wikidata';

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
  footerHeight = 50;
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

  constructor(public sharedService: SharedService, public router: Router,
    private readonly db: AngularFirestore, private route: ActivatedRoute, private authInstance: AngularFireAuth,
    private messageService: MessageService) {
    /*
    this.route.params.subscribe((params) => {
      this.orgId = params['id'];
      this.ngOnInit();
    });
    */

    this.subAddSection = this.sharedService.addSection.subscribe(() => this.showNewSectionPopup = true);
    this.dataSubArr = [];
    this.obsSubArr = [];
  }

  ngOnInit() {
    this.sharedService.hideToolbar.emit(false);
    this.sharedService.scrollPanelHeightToSubtract.emit(100);
    this.orgId = this.route.snapshot.paramMap.get('id');
    this.orgObservable = this.db.doc(`organizations/${this.orgId}`).valueChanges()
    .pipe(
      map((org: Organization) => {
        this.teams = org.teamIds.map(teamId => {
          return this.db.doc(`teams/${teamId}`).valueChanges() as Observable<Team>;
        });

        this.tripIds = this.teams.map(teamObs => {
          return teamObs.pipe(
            flatMap((t: Team) => t.trips)
          );
        });

        this.tripsObservable = this.tripIds.map(tripIdObs => {
          return tripIdObs.pipe(
            flatMap(tripId => {
              return this.db.doc(`trips/${tripId}`).valueChanges() as Observable<Trip>;
            })
          );
        });

        this.tripsObservable.forEach(tripObs => {
          const tripObsSub = tripObs.subscribe((trip: Trip) => {
            if (!this.trips.includes(trip)) {
              this.trips = [...this.trips, trip];
            }
          });
          this.obsSubArr = [...this.obsSubArr, tripObsSub];
        });

        this.tripIds.forEach(tripId => {
          const tripIdSub = tripId.subscribe();
          this.dataSubArr = [...this.dataSubArr, tripIdSub];
        });

        // this.tripIds.map(data => {
        //   const dataSub = data.subscribe();
        //   this.dataSubArr = [...this.dataSubArr, dataSub];
        // });

        // Get wiki data
        this.sections = this.db.doc(`organizations/${this.orgId}/wiki/${org.currentWiki}`).valueChanges()
        .pipe(
          map(data => {
            const sections = [];
            Object.keys(data).forEach(title => {
              const markup = data[title];
              sections.push({title, markup});
            });
            return sections;
          })
        );

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
    this.obsSubArr.forEach(obsSub => obsSub.unsubscribe());
    this.dataSubArr.forEach(dataSub => dataSub.unsubscribe());

    // let sub: Subscription;
    // for (sub of this.obsSubArr) {
    //   sub.unsubscribe();
    // }
    // for (sub of this.dataSubArr) {
    //   sub.unsubscribe();
    // }
  }

  tripClick(): void {
    console.log(this.selectedTrip);
    this.sharedService.backHistory.push(this.router.url);
    this.router.navigate([`trip/${this.selectedTrip.id}`]);
    // this.router.navigate(['/temp']);
  }

  /**
   * Used for updating an already existing wiki entry.
   */
  async submitWikiEdit(title: string, markup: string) {
    const json: {} = await this.db.doc(`organizations/${this.orgId}/wiki/${this.currentWikiId}`)
      .valueChanges().pipe(map(d => {
        return d;
      }), take(1)).toPromise();
    json[title] = markup;
    const data: Wikidata = {
      created_id: this.authInstance.auth.currentUser.uid,
      date: new Date()
    };
    // Create a new update
    const wikiId = this.db.createId();
    this.db.firestore.batch()
      .update(this.db.doc(`organizations/${this.orgId}`).ref, {'currentWiki': wikiId})
      .set(this.db.doc(`organizations/${this.orgId}/wiki/${wikiId}`).ref, json)
      .commit()
      .then(() => {
        // Now add the wiki data to it
        this.db.doc(`organizations/${this.orgId}/wiki/${wikiId}/data/data`).set(data);
      })
      .catch(() =>
        this.messageService.add({severity: 'error', summary: 'Unable to Save Edit',
          detail: 'Failed to save your edit to the wiki. Please try again later.'})
      );
  }

  submitNewSection() {
    console.log(this.newSectionName, this.newSectionText);
    this.submitWikiEdit(this.newSectionName, this.newSectionText);
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
        } else {
          member['id'] = data.get('id');
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
        })
        .catch( error => {
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
