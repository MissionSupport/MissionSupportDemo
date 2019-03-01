import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable, Subject} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserPreferences} from '../interfaces/user-preferences';
import {PreDefined, SharedService} from '../globals';
import {Site} from '../interfaces/site';
import {Trip} from '../interfaces/trip';
import {map, take, takeUntil, tap} from 'rxjs/operators';
import * as firebase from 'firebase';
import { BottomTab } from '../interfaces/bottom-tab';
import {Organization} from '../interfaces/organization';
import {Team} from '../interfaces/team';
import {SelectedInjectable} from '../questions/selectedInjectable';

export interface Question {
  question;
  value;
}

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  providers: [],
  styleUrls: ['./sites.component.css']
})

export class SitesComponent implements OnInit, OnDestroy {

  siteId: string;
  wikiId: string;
  viewWiki = true;
  viewChecklist = false;
  viewTrips = false;

  countryId: string;

  sections: Observable<any[]>;
  hideme = [];
  footerHeight = 50;
  // trips: Trip[];
  trips: Observable<Trip>[];
  tripValues: Trip[];
  selectedTrip;

  checkList: Observable<{name: string, json: any}[]>;
  siteObservable: Observable<Site>;

  groups = []; // Contains an array of group ids

  // tripSubArray: Subscription[];
  // addSectionSub: Subscription;
  // siteSub: Subscription;
  // orgSubArray: Subscription[];
  // wikiSub: Subscription;

  // Handles part of creating a new trip
  userOrgs: Observable<Organization>[]; // Observable of all the orgs
  userOrgMap: Organization[]; // All the orgs
  newUserOrgSelection: Organization; // The org selected from new site
  userTeamsMap: Team[]; // The teams a user belongs to
  // ====================================================

  // canEdit = false; // This is used to see if a user can approve edits
  // TODO: Change to proper value based on edit privileges
  showNewSectionPopup = false;
  newSectionText;
  newSectionName;
  newTripOrg: Organization;
  newTripTeam: Team;
  newTripName: string;

  // ToDo edit based on permissions
  canEditWiki: boolean;  // this means the user can edit wiki
  canEditChecklist: boolean;
  canEditTrip: boolean;

  titleEdits = []; // For Wiki usage
  confirmTitles = [];

  tabs: Array<BottomTab> = [{name: 'Wiki', icon: 'pi pi-align-justify'},
                            {name: 'Checklist', icon: 'pi pi-list'},
                            {name: 'Trips', icon: 'pi pi-briefcase'}];
  genericChecklists = [
    {
      name: 'Hospital',
      questionData: this.preDef.hospitalJson
    },
    {
      name: 'Hospital Infrastructure',
      questionData: this.preDef.hospitalInfrastructureJson
    },
    {
      name: 'Pharmacy and Lab',
      questionData: this.preDef.pharmacyLabJson
    },
    {
      name: 'Operating Room',
      questionData: this.preDef.operatingRoomJson
    },
    {
      name: 'Wards',
      questionData: this.preDef.wardJson
    },
    {
      name: 'Supplies',
      questionData: this.preDef.suppliesEquipmentJson
    },
    {
      name: 'Ambulance',
      questionData: this.preDef.ambulanceJson
    },
    {
      name: 'Case Volume and Staff',
      questionData: this.preDef.caseVolumeandStafJson
    },
    {
      name: 'Personnel',
      questionData: this.preDef.personnelJson
    },
    {
      name: 'Education and QI',
      questionData: this.preDef.educationQIJson
    },
    {
      name: 'Logistics',
      questionData: this.preDef.logisticsJson
    },
    {
      name: 'Accommodations',
      questionData: this.preDef.accommodationsJson
    }
  ];
  selectedLists = [];
  listsPresent = [];

  unsubscribeSubject: Subject<void> = new Subject<void>();

  constructor(public route: ActivatedRoute, private readonly db: AngularFirestore,
    public authInstance: AngularFireAuth, private sharedService: SharedService, public router: Router,
    private preDef: PreDefined, private selected: SelectedInjectable) {
    // this.tripSubArray = [];
    // this.orgSubArray = [];

    this.siteId = this.route.snapshot.paramMap.get('id');
    this.countryId = this.route.snapshot.paramMap.get('countryId');

    sharedService.hideToolbar.emit(false);

    // TODO: edit based on rights
    sharedService.addName.emit('New Section');

    sharedService.addSection.pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(() => this.showNewSectionPopup = true);

    this.siteObservable = this.db.doc(`countries/${this.countryId}/sites/${this.siteId}`)
      .valueChanges() as Observable<Site>;

    this.siteObservable.pipe(takeUntil(this.unsubscribeSubject)).subscribe((site: Site) => {
      sharedService.onPageNav.emit(site.siteName);
      this.wikiId = site.current;

        // Get wiki information
      this.sections = this.db.doc(`countries/${this.countryId}/sites/${this.siteId}/wiki/${site.current}`).valueChanges()
        .pipe(map(data => {
          const array = [];
          Object.keys(data).forEach(title => {
            const markup = data[title];
            array.push({title, markup});
          });
          return array;
        }));

      // Let's do checklist
      this.checkList =
        this.db.doc(`countries/${this.countryId}/sites/${this.siteId}/checklist/${site.currentCheckList}`)
        .valueChanges().pipe(map(data => {
          const array = [];
          Object.keys(data).forEach(title => {
            const json = {};
            json['name'] = title;
            json['json'] = data[title];
            array.push(json);
          });
          return array;
        }));

      // Let's get the trips information
      this.tripValues = [];
      this.trips = site.tripIds.map(id => this.db.doc(`trips/${id}`).valueChanges() as Observable<Trip>);

      this.trips.map(ob => {
        // let tripSub: Subscription;height
        ob.pipe(takeUntil(this.unsubscribeSubject)).subscribe((trip: Trip) => {
          this.tripValues = [...this.tripValues, trip];
        });
        // this.tripSubArray = [...this.tripSubArray, tripSub];
      });
    });

    let wikiSubscribe = null;
    this.authInstance.auth.onAuthStateChanged(user => {
      if (wikiSubscribe) {
        wikiSubscribe.unsubscribe();
      }
      wikiSubscribe = this.db.doc(`user_preferences/${user.uid}`).valueChanges()
        .pipe(takeUntil(this.unsubscribeSubject)).subscribe((pref: UserPreferences) => {
          this.canEditTrip = this.canEditChecklist = this.canEditWiki = pref.admin;
          sharedService.canEdit.emit(pref.admin);
        });

      this.getOrganizations(user).then((orgs: Observable<Organization>[]) => {
        this.userOrgMap = [];
        orgs.map(d => {
          // let orgSub: Subscription;
          d.pipe(takeUntil(this.unsubscribeSubject)).subscribe((o: Organization) => {
            // console.log(o);
            this.userOrgMap = [...this.userOrgMap, o];
          });
          // this.orgSubArray = [...this.orgSubArray, orgSub];
        });
      });
    });
  }

  public async getOrganizations(user: firebase.User) {
    const pref: UserPreferences = await (this.db.doc(`user_preferences/${user.uid}`).valueChanges()
      .pipe(take(1)).toPromise() as Promise<UserPreferences>);

    // Load all the orgs that they belong to on teams
    const teamsOrgs: string[] = await Promise.all(pref.teams.map(team => {
      return this.db.doc(`teams/${team}`).valueChanges().pipe(map((t: Team) => t.org, take(1))).toPromise();
    }));

    teamsOrgs.push(...pref.orgs);

    return teamsOrgs.map(org => this.db.doc(`organizations/${org}`).valueChanges() as Observable<Organization>);
  }

  public loadTrips() {
    const uid = this.authInstance.auth.currentUser.uid;
    // Load all trips the user has access to.
    this.userTeamsMap = [];
    this.db.doc(`organizations/${this.newTripOrg.id}`).valueChanges().pipe(
      tap((org: Organization) => {
        org.teamIds.map(data => {
          this.db.doc(`teams/${data}`).valueChanges().pipe(tap((team: Team) => {
            if (team.admins.includes(uid) || org.admins.includes(uid)) {
              this.userTeamsMap = [...this.userTeamsMap, team];
            }
          }, take(1))).toPromise().then();
        });
      }, take(1))).toPromise().then();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // if (this.wikiSub) {
    //   this.wikiSub.unsubscribe();
    // }
    // let sub: Subscription;
    // for (sub of this.orgSubArray) {
    //   sub.unsubscribe();
    // }
    // for (sub of this.tripSubArray) {
    //   sub.unsubscribe();
    // }
    // if (this.siteSub) {
    //   this.siteSub.unsubscribe();
    // }
    // if (this.addSectionSub) {
    //   this.addSectionSub.unsubscribe();
    // }
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  tripClick(): void {
    this.sharedService.backHistory.push(this.router.url);
    this.router.navigate(['trip/' + this.selectedTrip.id]);
  }

  submitNewSection() {
    console.log(this.newSectionName, this.newSectionText);
    const json = {};
    json[this.newSectionName] = this.newSectionText;
    this.showNewSectionPopup = false;
    this.db.doc(`countries/${this.countryId}/sites/${this.siteId}/wiki/${this.wikiId}`).update(json);
  }

  submitEdit(title, markup, newTitle, confirm) {
    const jsonVariable = {};
    if (confirm) {
      jsonVariable[newTitle] = markup;
      jsonVariable[title] = firebase.firestore.FieldValue.delete();
    } else {
      jsonVariable[title] = markup;
    }
    console.log(title, markup, newTitle, confirm);
    this.db.doc(`countries/${this.countryId}/sites/${this.siteId}/wiki/${this.wikiId}`).update(jsonVariable);
  }

  submitNewTrip() {
    console.log(this.countryId, this.siteId, this.newTripOrg, this.newTripTeam);
    const id = this.db.createId();
    const currentWiki = this.db.createId();
    const currentAbout = this.db.createId();
    const trip: Trip = {
      countryId: this.countryId,
      current: currentWiki,
      currentAbout: currentAbout,
      id: id,
      orgId: this.newTripOrg.id,
      siteId: this.siteId,
      teamId: this.newTripTeam.id,
      tripName: this.newTripName
    };
    const wiki = {};
    for (const w of this.preDef.wikiTrip) {
      wiki[w.title] = w.markup;
    }
    this.db.doc(`trips/${id}`).set(trip).then(() => {
      this.db.doc(`trips/${id}/wiki/${currentWiki}`).set(wiki);
    });
    this.showNewSectionPopup = false;
  }

  onTabClicked(tab: number) {
    if (tab === 0) {
      this.viewWiki = true;
      this.viewChecklist = false;
      this.viewTrips = false;
      this.sharedService.addName.emit('New Section');
      this.sharedService.canEdit.emit(this.canEditWiki);
    } else if (tab === 1) {
      this.viewWiki = false;
      this.viewChecklist = true;
      this.viewTrips = false;
      this.sharedService.addName.emit('New List');
      this.sharedService.canEdit.emit(this.canEditChecklist);
    } else if (tab === 2) {
      this.viewWiki = false;
      this.viewChecklist = false;
      this.viewTrips = true;
      this.sharedService.addName.emit('New Trip');
      this.sharedService.canEdit.emit(this.canEditTrip);
    }
  }

  submitNewList() {
    // console.log(this.selectedLists);

      // console.log(this.selectedSite);
    this.selected.selected = this.selectedLists;
    // console.log(this.selected.selected);
    this.sharedService.backHistory.push(this.router.url);
    this.router.navigate([`country/${this.countryId}/site/${this.siteId}/list`]);
    // this.router.navigate(['/temp']);
    this.showNewSectionPopup = false;
  }

  jsonParse(list) {
    const data = JSON.parse(list);
    const _data = Object.keys(data).map((key) => {
      return {
        value: data[key].value,
        question: data[key].question
      };
      }, data);
    return _data;
  }

  getQuestion(question) {
    if (question.question !== null) {
      return question.question;
    } else {
      console.log(question);
    }
  }

  getValue(question) {
    if (typeof question.value === 'string') {
      return question.value;
    } else {
      // console.log(question);
      let value = '';
      question.value.forEach((val, index) => {
        if (typeof val.value === 'string') {
          value = value + val.value.toString();
          if (index !== question.value.length - 1) {
            value = value + ',';
          }
          value = value + '<br/>';
          // value = value + val.value.toString() + ',' + + '<br />';
        } else {
          value = value + val.drugName + ' - ' + val.strength;
          if (index !== question.value.length - 1) {
            value = value + ',';
          }
          value = value + '<br/>';
          // value = value + val.drugName + ' - ' + val.strength + ',' + '<br />';
        }
      });
      return value;
    }
  }
}

