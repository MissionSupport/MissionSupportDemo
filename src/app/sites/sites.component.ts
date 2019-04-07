import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable, Subject} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserPreferences} from '../interfaces/user-preferences';
import {PreDefined} from '../globals';
import {SharedService} from '../service/shared-service.service';
import {Site} from '../interfaces/site';
import {Trip} from '../interfaces/trip';
import {map, take, takeUntil, tap} from 'rxjs/operators';
import * as firebase from 'firebase';
import { BottomTab } from '../interfaces/bottom-tab';
import {Organization} from '../interfaces/organization';
import {Team} from '../interfaces/team';
import {MessageService, SelectItem} from 'primeng/api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {EditTask} from '../interfaces/edit-task';

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
  trips: Observable<Trip>[];
  tripValues: Trip[];
  selectedTrip;

  checkList: Observable<{name: string, json: any}[]>;
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

  // TODO: edit based on permissions
  canEditWiki: boolean;  // this means the user can edit wiki
  canEditChecklist: boolean;
  canEditTrip: boolean;
  canProposeWiki: boolean; // Propose wiki changes. Only applies to verified users

  titleEdits = []; // For Wiki usage
  confirmTitles = [];
  editList;

  tabs: Array<BottomTab> = [{name: 'Wiki', icon: 'pi pi-align-justify'},
                            {name: 'Checklist', icon: 'pi pi-list'},
                            {name: 'Trips', icon: 'pi pi-briefcase'}];
  genericChecklists: SelectItem[] = [
    {label: 'Hospital', value: 'Hospital'},
    {label: 'Hospital Infrastructure', value: 'Hospital Infrastructure'},
    {label: 'Pharmacy and Lab', value: 'Pharmacy and Lab'},
    {label: 'Operating Room', value: 'Operating Room'},
    {label: 'Wards', value: 'Wards'},
    {label: 'Supplies', value: 'Supplies'},
    {label: 'Ambulance', value: 'Ambulance'},
    {label: 'Case Volume and Staff', value: 'Case Volume and Staff'},
    {label: 'Education and QI', value: 'Education and QI'},
    {label: 'Logistics', value: 'Logistics'},
    {label: 'Accommodations', value: 'Accommodations'}
  ];

  editChecklists: SelectItem[] = [];

  selectedLists = [];
  selectedEditLists = [];

  listsPresent = [];

  unsubscribeSubject: Subject<void> = new Subject<void>();

  newSectionForm: FormGroup;

  constructor(public route: ActivatedRoute, private readonly db: AngularFirestore,
    public authInstance: AngularFireAuth, private sharedService: SharedService, public router: Router,
    private preDef: PreDefined, private messageService: MessageService, private fb: FormBuilder) {
    this.sharedService.selectedChecklists = [];
    this.sharedService.updatingChecklists = [];

    this.siteId = this.route.snapshot.paramMap.get('id');
    this.countryId = this.route.snapshot.paramMap.get('countryId');

    sharedService.hideToolbar.emit(false);
    this.sharedService.scrollPanelHeightToSubtract.emit(100);

    this.newSectionForm = this.fb.group({
      name: this.fb.control('', Validators.required),
      text: this.fb.control('', Validators.required)
    });

    // TODO: edit based on rights
    sharedService.addName.emit('New Section');

    sharedService.addSection.pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(() => this.showNewSectionPopup = true);

    this.siteObservable = this.db.doc(`sites/${this.siteId}`)
      .valueChanges() as Observable<Site>;

    this.siteObservable.pipe(takeUntil(this.unsubscribeSubject)).subscribe((site: Site) => {
      sharedService.onPageNav.emit(site.siteName);
      this.wikiId = site.current;

        // Get wiki information
      this.sections = this.db.doc(`wiki/${site.current}`).valueChanges()
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
        this.db.doc(`sites/${this.siteId}/checklist/${site.currentCheckList}`)
        .valueChanges().pipe(map(data => {
          const array = [];
          if (data) {
            Object.keys(data).forEach(title => {
              const json = {};
              json['name'] = title;
              json['json'] = data[title];
              this.genericChecklists = this.genericChecklists.filter(obj => {
                return obj.label !== title;
              });
              array.push(json);
              this.editChecklists.push({label: title, value: title});
            });
          }
          this.listsPresent = array;
          return array;
        }));

      // Let's get the trips information
      this.tripValues = [];
      this.trips = site.tripIds.map(id => this.db.doc(`trips/${id}`).valueChanges() as Observable<Trip>);

      this.trips.map(ob => {
        ob.pipe(takeUntil(this.unsubscribeSubject)).subscribe((trip: Trip) => {
          this.tripValues = [...this.tripValues, trip];
        });
      });
    });

    let wikiSubscribe = null;
    this.authInstance.auth.onAuthStateChanged(user => {
      if (wikiSubscribe) {
        wikiSubscribe.unsubscribe();
      }
      if (user) {
        wikiSubscribe = this.db.doc(`user_preferences/${user.uid}`).valueChanges()
          .pipe(takeUntil(this.unsubscribeSubject)).subscribe((pref: UserPreferences) => {
            this.canEditTrip = this.canEditChecklist = this.canEditWiki = pref.admin;
            this.canProposeWiki = pref.verified;
            this.sharedService.canEdit.emit(pref.admin || pref.verified);
        });

        this.getOrganizations(user).then((orgs: Observable<Organization>[]) => {
          this.userOrgMap = [];
          orgs.map(d => {
            d.pipe(takeUntil(this.unsubscribeSubject)).subscribe((o: Organization) => {
              this.userOrgMap = [...this.userOrgMap, o];
            });
          });
        });
      }
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
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  tripClick(): void {
    this.sharedService.backHistory.push(this.router.url);
    this.router.navigate(['trip/' + this.selectedTrip.id]);
  }

  submitNewSection() {
    if (this.newSectionForm.valid) {
      this.showNewSectionPopup = false;
      this.submitEdit(this.newSectionForm.get('name').value, this.newSectionForm.get('text').value, null, false);
      this.newSectionForm.reset();
    } else {
      Object.keys(this.newSectionForm.controls).forEach(field => {
        this.newSectionForm.controls[field].markAsDirty({onlySelf: true});
      });
    }
  }

  async submitEdit(title, markup, newTitle, confirm) {
    if (this.canProposeWiki && !this.canEditWiki) { // If they are verified but not admin
      const id = this.db.createId();
      const pending_update_json: EditTask = {
        email: this.authInstance.auth.currentUser.email, // the email of who changed the doc
        date: new Date(), // date of the changed doc
        title: title,
        markup: markup,
        new_title: newTitle ? newTitle : null,
        user_id: this.authInstance.auth.currentUser.uid,
        id: id,
        owner_id: this.siteId,
        type: 'site'
      };
      this.db.doc(`edits/${id}`).set(pending_update_json).catch((error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error', summary: 'Unable to Save Edit',
            detail: 'Failed to save your edit to the wiki. Please try again later.'
          });
        }
      );
    } else {
      const json: {} = await this.db.doc(`wiki/${this.wikiId}`)
        .valueChanges().pipe(map(d => {
          return d;
        }), take(1)).toPromise();
      if (confirm) {
        json[newTitle] = markup;
        json[title] = firebase.firestore.FieldValue.delete();
      } else {
        json[title] = markup;
      }
      const version = {};
      // Create a new update
      const wikiId = this.db.createId();
      version[wikiId] = {
        created_id: this.authInstance.auth.currentUser.uid,
        date: new Date()
      };
      this.db.firestore.batch()
        .set(this.db.doc(`sites/${this.siteId}`).ref,
          {'current': wikiId, versions: version}, {merge: true})
        .set(this.db.doc(`wiki/${wikiId}`).ref, json, {merge: true})
        .commit()
        .catch((error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error', summary: 'Unable to Save Edit',
              detail: 'Failed to save your edit to the wiki. Please try again later.'
            });
          }
        );
    }
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
      date: new Date(),
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
      this.sharedService.addName.emit('New/Edit List');
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
    this.selectedEditLists.forEach((selected) => {
      const checklistJson = this.listsPresent.filter((list) => {
        return list['name'] === selected;
      });
      this.sharedService.updatingChecklists.push({
        name: selected,
        json: checklistJson[0]
      });
    });
    this.sharedService.selectedChecklists = this.selectedLists;
    this.sharedService.backHistory.push(this.router.url);
    this.router.navigate([`site/${this.siteId}/list`]);
    this.showNewSectionPopup = false;
  }

  createNewList() {
    this.sharedService.backHistory.push(this.router.url);
    this.router.navigate([`site/${this.siteId}/createList`]);
  }

  jsonParse(list) {
    const data = JSON.parse(list);
    return Object.keys(data).map((key: string) => {
      return {
        question: key,
        answer: data[key]
      };
    });
  }

  getAnswer(question: {question: string, answer: any}) {
    if (typeof question.answer === 'string') {
      return question.answer;
    } else {
      // The answer is an array.
      let value = '';
      question.answer.forEach((item, index) => {
        if (typeof item === 'string') {
          // The answer is an array of strings.
          value = value + item;
          if (index !== question.answer.length - 1) {
            value = value + ',';
          }
          value = value + '<br/>';
        } else if (typeof item === 'object') {
          // The answer is an array of objects (for medicine questions).
          value = value + item.drugName + ' - ' + item.drugStrength;
          if (index !== question.answer.length - 1) {
            value = value + ',';
          }
          value = value + '<br/>';
        }
      });
      return value;
    }
  }
}

