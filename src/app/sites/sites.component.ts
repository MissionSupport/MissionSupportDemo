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

  id: string;
  siteName: string;
  markdown: string;
  viewWiki = true;
  viewChecklist = false;
  viewTrips = false;

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
  trips = [
    {
      id: 'trip1',
      tripName: 'Emory Team 12 - 7.12.18'
    },
    {
      id: 'trip2',
      tripName: 'Mercer Team 5 - 5.16.17'
    },
    {
      id: 'trip3',
      tripName: 'Emory Team 9 - 9.07.15'
    },
  ];
  selectedTrip;

  groups = []; // Contains an array of group ids

  editTasks: AngularFirestoreCollection<EditTask>;
  currentEdit: EditTask; // If current task is null it means that the user does not have an edit.
  canEdit = false; // This is used to see if a user can approve edits
  editMode = false; // If the user is in edit mode we want the screen to change

  userPreferences: UserPreferences;

  constructor(public route: ActivatedRoute, private readonly db: AngularFirestore, private messageService: MessageService,
              public authInstance: AngularFireAuth, private sharedService: SharedService, public router: Router) {
    this.id = this.route.snapshot.paramMap.get('id');
    sharedService.hideToolbar.emit(false);
    // Let's get the site name
    this.db.doc(`Sites/${this.id}`).valueChanges().subscribe((data: Site) => {
      this.siteName = data.siteName;
      sharedService.onPageNav.emit(this.siteName);
    });
    // Now we are going to get the latest version of markdown that is approved.
    this.siteCollection = this.db.collection<Site>('Sites/' + this.id + '/versions', ref =>
      ref.where('current', '==', true).limit(1));
    // When ever it loads the markup should be display on the page.
    // Now we want to get the user information and see if they are able to edit.
    // Users are only going to be allowed to be allowed to create one edit.
    this.editTasks = db.collection<EditTask>('Sites/' + this.id + '/edits', ref =>
      ref.where('user', '==', localStorage.getItem('user')));
    // This is so when we create an edit its id get filled.
    this.editTasks.snapshotChanges().subscribe(item => {
      item.map(a => {
        const data = a.payload.doc.data();
        this.updateEdit(data, false);
      });
    });
    this.siteCollection.snapshotChanges().subscribe(item => {
      item.map(a => {
        const data = a.payload.doc.id;
        this.updateVersionId(data);
        const sections = this.db.collection('Sites/' + this.id + '/versions/' + this.versionId + '/wikiSections');
        sections.snapshotChanges().subscribe(section => {
          let sectionData = null;
          section.map(args => {
            this.wikiId = args.payload.doc.id;
            sectionData = args.payload.doc.data();
          });
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
      });
    });
    const groupCollection = this.db.collection(`Sites/${this.id}/groups`);
    groupCollection.snapshotChanges().subscribe(groupsData => {
      groupsData.map( a => {
        const data = a.payload.doc.data();
        const path = data['id'].path;
        this.db.doc(path).get().subscribe( value => {
          const groupData = value.data();
          const name = groupData['name'];
          const groupId  = groupData['id'];
          const j = {'name': name,
            'id': groupId};
          this.groups.push(j);
        });
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
    this.db.doc(`Sites/${this.id}/versions/${this.versionId}/wikiSections/${this.wikiId}`).update(jsonVariable);
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
        if (this.userPreferences.sites[i] === this.id) {
          this.canEdit = true;
          break;
        }
      }
      console.log('User can edit ' + this.canEdit);
    });
  }

  ngOnInit() {
    console.log('id is ', this.id);
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
    this.db.doc<EditTask>('Sites/' + this.id + '/edits/' + task.user).update(task).then(() => {
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
    this.db.doc<EditTask>('Sites/' + this.id + '/edits/' + task.user).delete().then(() => {
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

