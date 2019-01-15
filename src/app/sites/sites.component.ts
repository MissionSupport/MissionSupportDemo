import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {MessageService} from 'primeng/api';
import {AngularFireAuth} from '@angular/fire/auth';
import {EditTask} from '../interfaces/edit-task';
import {UserPreferences} from '../interfaces/user-preferences';
import {SharedService} from '../globals';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css']
})
export class SitesComponent implements OnInit {

  id: string;
  markdown: string;

  sites: Observable<{}[]>;
  site: {};
  siteCollection: AngularFirestoreCollection;

  editTasks: AngularFirestoreCollection<EditTask>;
  currentEdit: EditTask;
  canEdit: boolean; // Can a user make edits
  editMode: boolean; /// If the user is in edit mode we want the screen to change

  userPreferences: UserPreferences;

  constructor(public route: ActivatedRoute, private readonly db: AngularFirestore, private messageService: MessageService,
              public authInstance: AngularFireAuth,  private sharedService: SharedService) {
    this.id = this.route.snapshot.paramMap.get('id');
    sharedService.onPageNav.emit(this.id);
    // Now we are going to get the latest version of markdown that is approved.
    this.siteCollection = this.db.collection('Sites/' + this.id + '/versions', ref =>
      ref.where('current', '==', true));
    this.sites = this.siteCollection.valueChanges();
    this.sites.subscribe( item => {
      console.log(item);
      if (item.length >= 1) { // Is possible for more than one so we will just take the first.
        this.site = item[0] as any;
        this.markdown = this.site['markdown'];
      }
    });
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

    this.authInstance.auth.onAuthStateChanged(data => {
      this.updateUserPreferences(data.uid);
    });
  }

  updateUserPreferences(uid: string) {
    const pref = this.db.doc('user_preferences/' + uid).valueChanges();
    this.canEdit = false;
    pref.subscribe(data => {
      this.userPreferences = data as UserPreferences;
      // Now let's see if the user can edit this page.
      this.canEdit = this.id in this.userPreferences.sites;
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

}

