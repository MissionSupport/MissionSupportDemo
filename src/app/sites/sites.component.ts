import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {MessageService} from 'primeng/api';
import {AngularFireAuth} from '@angular/fire/auth';
import {EditTask} from '../interfaces/edit-task';
import {UserPreferences} from '../interfaces/user-preferences';
import {SharedService} from '../globals';
import {Site} from '../interfaces/site';
import {Trip} from '../interfaces/trip';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css']
})

export class SitesComponent implements OnInit {

  siteId: string;
  viewWiki = true;
  viewChecklist = false;
  viewTrips = false;

  countryId: string;

  sites: Observable<{}[]>;
  site: Site;
  siteCollection: AngularFirestoreCollection;
  versionId: string;
  wikiId: string;
  sections = [];
  editText = [];
  hideme = [];
  footerHeight = 45;
  // trips: Trip[];
  trips = [{'id': 'a', tripName: 'Emory Team 12 - 7.12.18'}];
  selectedTrip;

  groups = []; // Contains an array of group ids

  editTasks: AngularFirestoreCollection<EditTask>;
  currentEdit: EditTask; // If current task is null it means that the user does not have an edit.
  canEdit = false; // This is used to see if a user can approve edits
  editMode = false; // If the user is in edit mode we want the screen to change

  userPreferences: UserPreferences;

  constructor(public route: ActivatedRoute, private readonly db: AngularFirestore, private messageService: MessageService,
              public authInstance: AngularFireAuth, private sharedService: SharedService, public router: Router) {
    this.siteId = this.route.snapshot.paramMap.get('id');
    this.countryId = this.route.snapshot.paramMap.get('countryId');
    sharedService.hideToolbar.emit(false);
    // Let's get the site name
    const siteDoc = this.db.doc(`countries/${this.countryId}/sites/${this.siteId}`);
    siteDoc.valueChanges().subscribe((data: Site) => {
      this.site = data;
      sharedService.onPageNav.emit(this.site.siteName);
      this.siteCollection = siteDoc.collection(`wiki`);
      this.siteCollection.doc(this.site.current).valueChanges().subscribe(sectionData => {
        this.sections = [];
        this.editText = [];
        for (const title in sectionData) {
          if (sectionData.hasOwnProperty(title)) {
            const markup = sectionData[title];
            this.sections.push({title, markup});
            this.editText.push(markup);
          }
        }
      });
      // TODO make this faster.
      this.db.collection('trips/').valueChanges().subscribe((trips: Trip[]) => {
        this.trips = [];
        for (const t in trips) {
          // Because this can ever happen classic
          if (!(t in trips)) {
            continue;
          }
          const trip = trips[t];
          if (this.site.tripIds.indexOf(trip.id) > -1) {
            this.trips.push(trip);
          }
        }
      });
    });
    this.authInstance.auth.onAuthStateChanged(data => {
      this.updateUserPreferences(data.uid);
    });
  }

  submitEdit(title, i) {
    // this.editText[i] is the data we with to push into firebase with the section header title
    // to then revert the page to the view do "hidden[i] = !hidden[i];"
    // TODO: Currently we are not having edits on the page. We will wait for later sprints to add
    const jsonVariable = {};
    jsonVariable[title] = this.editText[i];
    this.db.doc(`Sites/${this.siteId}/versions/${this.versionId}/wikiSections/${this.wikiId}`).update(jsonVariable);
    this.hideme[i] = !this.hideme[i];
  }

  updateVersionId(data) {
    this.versionId = data;
  }

  updateUserPreferences(uid: string) {
    const pref = this.db.doc('user_preferences/' + uid).valueChanges();
    pref.subscribe(data => {
      this.canEdit = false;
      this.userPreferences = data as UserPreferences;
      // Now let's see if the user can edit this page.
      for (let i = 0; i < this.userPreferences.sites.length; i++) {
        if (this.userPreferences.sites[i] === this.siteId) {
          this.canEdit = true;
          break;
        }
      }
      console.log('User can edit ' + this.canEdit);
    });
  }

  ngOnInit() {
    console.log('id is ', this.siteId);
    console.log(this.sites);
  }

  createEdit(task: EditTask) {
    this.editTasks.doc(task.user).set(task).then( () => {
      this.currentEdit = task;
      // Successful save.
      this.messageService.add({severity: 'info', summary: 'Edit successfully created',
        detail: 'The edit has been successfully created'});
    }).catch(error => {
      // if some error happens, would most likely be they just already have an edit that exists.
      this.messageService.add({severity: 'error', summary: 'Edit Failed',
        detail: 'Edit failed to save, does one already exist?'});
      console.log(error);
    });
  }

  updateEdit(task: EditTask, showMessage: boolean) {
    this.db.doc<EditTask>('Sites/' + this.siteId + '/edits/' + task.user).update(task).then(() => {
      if (showMessage) {
        this.messageService.add({severity: 'info', summary: 'Edit successfully saved',
          detail: 'The edit has been successfully saved'});
      }
      this.currentEdit = task;
    }).catch(error => {
      console.log(error);
      if (showMessage) {
        this.messageService.add({
          severity: 'error', summary: 'Edit Failed',
          detail: 'Edit failed to update, does one exist?'
        });
      }
    });
  }

  deleteEdit(task: EditTask) {
    this.db.doc<EditTask>('Sites/' + this.siteId + '/edits/' + task.user).delete().then(() => {
      this.messageService.add({severity: 'info', summary: 'Edit successfully deleted',
        detail: 'The edit has been successfully deleted'});
      this.currentEdit = null;
    }).catch(error => {
      console.log(error);
      this.messageService.add({severity: 'error', summary: 'Edit Failed',
        detail: 'Edit failed to delete, does one exist?'});
    });
  }

  tripClick(): void {
    // console.log(this.selectedSite);
    this.router.navigate(['trip/' + this.selectedTrip.id]);
    // this.router.navigate(['/temp']);
  }

}

