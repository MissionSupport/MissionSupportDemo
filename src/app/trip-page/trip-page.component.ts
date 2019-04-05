import {Component, OnDestroy, OnInit} from '@angular/core';
import {PreDefined} from '../globals';
import {SharedService} from '../service/shared-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Organization} from '../interfaces/organization';
import {AngularFirestore} from '@angular/fire/firestore';
import {Trip} from '../interfaces/trip';
import { BottomTab } from '../interfaces/bottom-tab';
import {Subject} from 'rxjs';
import {map, take, takeUntil} from 'rxjs/operators';
import {Wikidata} from '../interfaces/wikidata';
import * as firebase from 'firebase';
import 'firebase/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {MessageService} from 'primeng/api';
import {Team} from '../interfaces/team';

@Component({
  selector: 'app-trip-page',
  templateUrl: './trip-page.component.html',
  providers: [PreDefined],
  styleUrls: ['./trip-page.component.css']
})
export class TripPageComponent implements OnInit, OnDestroy {

  markdown: string;
  viewWiki = true;
  viewAbout = false;
  footerHeight = 50;
  sections = [];
  hideme = [];
  org: Organization;
  tripId: string;
  canEdit = false;

  // TODO: Change to proper value based on edit privileges
  editMode = true;  // this means the user can edit
  showNewSectionPopup = false;
  newSectionText;
  newSectionName;

  // TODO: get all of these from actual database
  location: string;
  orgName: string;
  teamName: string;
  date: Date;

  // TODO: Edit based on permissions
  canEditAbout = true;

  titleEdits = [];
  titleEditsConfirm = [];

  tabs: Array<BottomTab> = [{name: 'Wiki', icon: 'pi pi-align-justify'},
                            {name: 'About', icon: 'pi pi-info-circle'}];

  unsubscribeSubject: Subject<void> = new Subject<void>();

  constructor(public sharedService: SharedService, private preDef: PreDefined, public router: Router,
              private route: ActivatedRoute, private readonly db: AngularFirestore,
              private authInstance: AngularFireAuth, private messageService: MessageService) {
    sharedService.hideToolbar.emit(false);
    this.tripId = this.route.snapshot.paramMap.get('id');
    sharedService.addName.emit('New Section');
    this.sharedService.scrollPanelHeightToSubtract.emit(100);

    const trip = this.db.doc(`trips/${this.tripId}`);
    trip.valueChanges()
      .pipe(takeUntil(this.unsubscribeSubject)).subscribe((t: Trip) => {
        sharedService.onPageNav.emit(t.tripName);
        // TODO: edit based on rights
        sharedService.canEdit.emit(true);
        sharedService.addSection.pipe(takeUntil(this.unsubscribeSubject))
          .subscribe(() => this.showNewSectionPopup = true);

        // Get wiki information
        trip.collection('wiki').doc(t.current).valueChanges()
          .pipe(takeUntil(this.unsubscribeSubject)).subscribe(data => {
            this.sections = [];
            Object.keys(data).forEach(title => {
              const markup = data[title];
              this.sections.push({title, markup});
              this.titleEdits.push();
              this.titleEditsConfirm.push();
            });
        });

        // Now get the org information
        db.doc(`organizations/${t.orgId}`).valueChanges()
          .pipe(takeUntil(this.unsubscribeSubject)).subscribe((data: Organization) => {
            this.org = data;
            this.orgName = data.name;
          });

        db.doc(`teams/${t.teamId}`).valueChanges()
          .pipe(takeUntil(this.unsubscribeSubject)).subscribe((data: Team) => {
          this.teamName = data.name;
        });
        this.date = t.date;
      });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  async submitEdit(title, markup, titleEdit, confirmTitleEdit) {
    const json: {} = await this.db.doc(`trips/${this.tripId}`)
      .valueChanges().pipe(map(d => {
        return d;
      }), take(1)).toPromise();
    if (confirmTitleEdit) {
      json[titleEdit] = markup;
      json[title] = firebase.firestore.FieldValue.delete();
    } else {
      json[title] = markup;
    }
    const data: Wikidata = {
      created_id: this.authInstance.auth.currentUser.uid,
      date: new Date()
    };
    // Create a new update
    const wikiId = this.db.createId();
    this.db.firestore.batch()
      .update(this.db.doc(`trips/${this.tripId}`).ref, {'current': wikiId})
      .set(this.db.doc(`trips/${this.tripId}/wiki/${wikiId}`).ref, json, {merge: true})
      .commit()
      .then(() => {
        this.db.doc(`trips/${this.tripId}/wiki/${wikiId}/data/data`).set(data);
      })
      .catch((error) => {
          console.log(error);
          this.messageService.add({severity: 'error', summary: 'Unable to Save Edit',
            detail: 'Failed to save your edit to the wiki. Please try again later.'});
        }
      );
  }

  submitNewSection() {
    console.log(this.newSectionName, this.newSectionText);
    this.showNewSectionPopup = false;
    this.submitEdit(this.newSectionName, this.newSectionName, null, false);
  }

  groupClick(): void {
    this.sharedService.backHistory.push(this.router.url);
    this.router.navigate(['org/' + this.org.id]);
  }

  onTabClicked(tab: number) {
    if (tab === 0) {
      this.viewWiki = true;
      this.viewAbout = false;
      this.sharedService.addName.emit('New Site');
      this.sharedService.canEdit.emit(this.editMode);
    } else if (tab === 1) {
      this.viewWiki = false;
      this.viewAbout = true;
      this.sharedService.addName.emit('New About Info');
      this.sharedService.canEdit.emit(this.canEditAbout);
    }
  }
}
