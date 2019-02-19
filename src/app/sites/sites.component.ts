import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {MessageService} from 'primeng/api';
import {AngularFireAuth} from '@angular/fire/auth';
import {EditTask} from '../interfaces/edit-task';
import {UserPreferences} from '../interfaces/user-preferences';
import {PreDefined, SharedService} from '../globals';
import {Site} from '../interfaces/site';
import {Trip} from '../interfaces/trip';
import {flatMap, map, mergeAll, mergeMap, reduce, switchMap, take} from 'rxjs/operators';
import {Country} from '../interfaces/country';
import * as firebase from 'firebase';
import {Organization} from '../interfaces/organization';
import {Team} from '../interfaces/team';
import {User} from 'firebase';
import {createUrlResolverWithoutPackagePrefix} from '@angular/compiler';
import {FormObject} from '../questions/formObject';
import {forEach} from '@angular/router/src/utils/collection';
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
  footerHeight = 45;
  // trips: Trip[];
  trips: Observable<Trip>[];
  tripValues: Trip[];
  selectedTrip;

  checkList: Observable<any[]>;
  siteObservable: Observable<Site>;

  groups = []; // Contains an array of group ids

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
  testAnswers;

  titleEdits = [];

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
      name: 'Pharmacy/Lab',
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
      name: 'Case Volume and Staff',
      questionData: this.preDef.personnelJson
    },
    {
      name: 'Education/QI',
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

  constructor(public route: ActivatedRoute, private readonly db: AngularFirestore, private messageService: MessageService,
              public authInstance: AngularFireAuth, private sharedService: SharedService, public router: Router,
              private preDef: PreDefined, private selected: SelectedInjectable) {
    this.preDef.testInput.forEach(checklist => {
      this.genericChecklists.forEach( generic => {
        if (checklist.name === generic.name) {
          this.listsPresent = [... this.listsPresent, generic];
          this.genericChecklists = this.genericChecklists.filter(obj => obj !== generic);
        }
      });
    });
    this.testAnswers = preDef.testInput;


    this.siteId = this.route.snapshot.paramMap.get('id');
    this.countryId = this.route.snapshot.paramMap.get('countryId');
    sharedService.hideToolbar.emit(false);
    // ToDo : edit based on rights
    sharedService.addName.emit('New Section');
    sharedService.addSection.subscribe(
      () => {
        this.showNewSectionPopup = true;
      }
    );
    this.siteObservable = this.db.doc(`countries/${this.countryId}/sites/${this.siteId}`)
      .valueChanges().pipe(map((site: Site) => {
      return site;
    }));
    this.siteObservable.subscribe((site: Site) => {
      sharedService.onPageNav.emit(site.siteName);
      this.wikiId = site.current;
        // Get wiki information
      this.sections = this.db.doc(`countries/${this.countryId}/sites/${this.siteId}/wiki/${site.current}`).valueChanges()
        .pipe(map(data => {
          const array = [];
          for (const title in data) {
            if (data.hasOwnProperty(title)) {
              const markup = data[title];
              array.push({title, markup});
            }
          }
          return array;
        }));
      // Let's do checklist
      this.checkList =
        this.db.doc(`countries/${this.countryId}/sites/${this.siteId}/checklist/${site.currentCheckList}`)
        .valueChanges().pipe(map(data => {
          const array = [];
          this.titleEdits = [];
          for (const id in data) {
            if (data.hasOwnProperty(id)) {
              const markup = data[id];
              array.push({id, markup});
              this.titleEdits.push(id);
            }
          }
          return array;
        }));

      // Let's get the trips information
      this.tripValues = [];
      this.trips = site.tripIds.map(id => {
        return this.db.doc(`trips/${id}`).valueChanges().pipe(map((trip: Trip) => {
          return trip;
        }));
      });
      this.trips.map(ob => {
        // TODO this will cause memory leaks, primeng can only work with [..., new element] so no idea how to do this otherwise.
        ob.subscribe((trip: Trip) => {
          this.tripValues = [...this.tripValues, trip];
        });
      });
    });

    let wikiSubscribe = null;
    this.authInstance.auth.onAuthStateChanged(user => {
      if (wikiSubscribe) {
        wikiSubscribe.unsubscribe();
      }
      wikiSubscribe = this.db.doc(`user_preferences/${user.uid}`).valueChanges().subscribe((pref: UserPreferences) => {
        this.canEditTrip = this.canEditChecklist = this.canEditWiki = pref.admin;
        sharedService.canEdit.emit(pref.admin);
      });

      this.getOrganizations(user).then((orgs: Observable<Organization>[]) => {
        this.userOrgMap = [];
        orgs.map(d => {
          d.subscribe((o: Organization) => {
            console.log(o);
            this.userOrgMap = [...this.userOrgMap, o];
          });
        });
      });
    });
  }

  public async getOrganizations(user: any) {
    const pref: UserPreferences = await this.db.doc(`user_preferences/${user.uid}`).valueChanges()
      .pipe(map((data: UserPreferences) => {
        return data;
    }), take(1)).toPromise();

    // Load all the orgs that they belong to on teams
    const teamsOrgs: string[] = await Promise.all(pref.teams.map(team => {
      return this.db.doc(`teams/${team}`).valueChanges().pipe(map((t: Team) => {
        return t.org;
      }, take(1))).toPromise();
    }));

    teamsOrgs.push(...pref.orgs);

    return teamsOrgs.map(org => {
      return this.db.doc(`organizations/${org}`).valueChanges().pipe(map((o: Organization) => {
        return o;
      }));
    });
  }

  public loadTrips() {
    const uid = this.authInstance.auth.currentUser.uid;
    // Load all trips the user has access to.
    this.userTeamsMap = [];
    this.db.doc(`organizations/${this.newTripOrg.id}`).valueChanges().pipe(
      map((org: Organization) => {
      org.teamIds.map(data => {
        this.db.doc(`teams/${data}`).valueChanges().pipe(map((team: Team) => {
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

  }

  tripClick(): void {
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

  toggleWikiTab() {
    this.viewWiki = true;
    this.viewChecklist = false;
    this.viewTrips = false;
    this.sharedService.addName.emit('New Section');
    this.sharedService.canEdit.emit(this.canEditWiki);
  }

  toggleChecklistTab() {
    this.viewWiki = false;
    this.viewChecklist = true;
    this.viewTrips = false;
    this.sharedService.addName.emit('New List');
    this.sharedService.canEdit.emit(this.canEditChecklist);
  }

  toggleTripsTab() {
    this.viewWiki = false;
    this.viewChecklist = false;
    this.viewTrips = true;
    this.sharedService.addName.emit('New Trip');
    this.sharedService.canEdit.emit(this.canEditTrip);
  }

  submitNewList() {
    // console.log(this.selectedLists);

      // console.log(this.selectedSite);
    this.selected.selected = this.selectedLists;
    // console.log(this.selected.selected);
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
}

