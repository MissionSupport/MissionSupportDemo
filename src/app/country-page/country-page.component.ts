import {Component, OnDestroy, OnInit} from '@angular/core';
import {SharedService} from '../service/shared-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Site} from '../interfaces/site';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {PreDefined} from '../globals';
import {Country} from '../interfaces/country';
import {flatMap, map, take} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserPreferences} from '../interfaces/user-preferences';
import * as firebase from 'firebase';
import { BottomTab } from '../interfaces/bottom-tab';
import { MessageService } from 'primeng/api';
import {EditTask} from '../interfaces/edit-task';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  providers: [PreDefined],
  styleUrls: ['./country-page.component.css'],
  styles: [
    '.custombar1 .ui-scrollpanel-bar { opacity: 1;}'
  ]
})
export class CountryPageComponent implements OnInit, OnDestroy {
  footerHeight: number;
  clientHeight: number;
  viewSites: boolean;
  countryId: string;
  countryName: string;
  sections: Observable<any[]>;
  subUserPref: Subscription;
  hideme = [];
  wikiId: string;
  mainHeight: number;
  sites: Site[];
  siteCollection: AngularFirestoreCollection<Site>;
  selectedSite: Site;
  countryData: Country;

  // TODO: Change to proper value based on edit privileges
  showNewSectionPopup = false;

  newSiteName;
  isNewSiteHospital;

  // TODO: change based on permissions
  canEditWiki: boolean; // Editing wiki
  canEditSites: boolean; // editing site
  canProposeWiki: boolean; // Propose wiki changes. Only applies to verified users

  titleEdits = [];
  startTab = 0;

  newSectionForm: FormGroup;

  tabs: Array<BottomTab> = [{name: 'Wiki', icon: 'pi pi-align-justify'},
                            {name: 'Sites', icon: 'pi pi-sitemap'}];

  constructor(private sharedService: SharedService, public router: Router, private readonly db: AngularFirestore,
               private preDef: PreDefined, private route: ActivatedRoute, private authInstance: AngularFireAuth,
               private messageService: MessageService, private fb: FormBuilder) {
    this.countryId = this.route.snapshot.paramMap.get('id');
    this.clientHeight = window.innerHeight;
    this.sharedService.hideToolbar.emit(false);
    this.sharedService.addName.emit('New Section');

    this.newSectionForm = this.fb.group({
      name: this.fb.control('', Validators.required),
      text: this.fb.control('', Validators.required)
    });

    // TODO: edit based on rights
    this.sharedService.addSection.subscribe(() => this.showNewSectionPopup = true);
    this.sharedService.goSites.subscribe(
      (bool: boolean) => {
        if (bool) {this.goSites(); this.startTab = 1; }
      }
    );
    this.sharedService.scrollPanelHeightToSubtract.emit(100);
    this.footerHeight = 50;
    this.mainHeight = this.clientHeight - this.footerHeight * 2.2;

    // TODO: Change this to get the 'Country/Sites' list instead
    this.siteCollection = db.collection<Site>(`countries/${this.countryId}/sites`);
    this.siteCollection.valueChanges().subscribe((item: Site[]) => {
      this.sites = item;
    });

    this.sections = this.db.doc(`countries/${this.countryId}`).valueChanges()
    .pipe(
      flatMap((data: Country) => {
        this.countryName = data.countryName;
        this.countryData = data;
        this.wikiId = data.current; // Wiki id.
        this.sharedService.onPageNav.emit(this.countryName);

        return this.db.doc(`wiki/${this.countryData.current}`).valueChanges()
        .pipe(
          map(sectionData => {
            const sections = [];
            this.titleEdits = [];
            Object.keys(sectionData).forEach(title => {
              const markup = sectionData[title];
              sections.push({title, markup});
              this.titleEdits.push();
            });
            return sections;
          })
        );
      })
    );

    this.authInstance.auth.onAuthStateChanged(user => {
      if (this.subUserPref) {
        this.subUserPref.unsubscribe();
      }
      if (user) {
        this.subUserPref = this.db.doc(`user_preferences/${user.uid}`).valueChanges()
          .subscribe((pref: UserPreferences) => {
            this.canEditSites = this.canEditWiki = pref.admin;
            this.canProposeWiki = pref.verified;
            this.sharedService.canEdit.emit(pref.admin || pref.verified);
          }
        );
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.subUserPref) {
      this.subUserPref.unsubscribe();
    }
  }

  async submitEdit(title, markup, newTitle, confirm) {
    // this.editText[i] is the data we with to push into firebase with the section header title
    // to then revert the page to the view do "hidden[i] = !hidden[i];"
    // Need to see if we are proposing this change or just changing it
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
        country_id: this.countryId
      };
      this.db.doc(`edits/${id}`).set(pending_update_json).catch((error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error', summary: 'Unable to Save Edit',
            detail: 'Failed to save your edit to the wiki. Please try again later.'
          });
        }
      );
    } else { // They are admin
      // Just going to create a new wiki version
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
        .set(this.db.doc(`countries/${this.countryId}`).ref, {'current': wikiId, versions: version}, {merge: true})
        .set(this.db.doc(`wiki/${wikiId}`).ref, json)
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

  siteClick() {
    this.sharedService.backHistory.push(this.router.url);
    this.router.navigate([`country/${this.countryId}/site/${this.selectedSite.id}`]);
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

  submitNewSite() {
    this.showNewSectionPopup = false;
    // Now save to the database
    const siteId = this.db.createId();
    const wikiId = this.db.createId();
    const checklistId = this.db.createId();
    const site: Site = {
      current: wikiId,
      countryID: this.countryId,
      currentCheckList: checklistId,
      isHospital: this.isNewSiteHospital,
      id: siteId,
      siteName: this.newSiteName,
      tripIds: [],
      // TODO edited because would not allow push without
      versions: ''
    };
    this.db.doc(`countries/${this.countryId}/sites/${siteId}`).set(site).then(() => {
      console.log('Successfully created site, generating wiki and checklist');
      const wikiData = {};
      for (const x of this.preDef.wikiSite) {
        wikiData[x.title] = x.markup;
      }
      this.db.firestore.batch()
        .set(this.db.doc(`countries/${this.countryId}/sites/${siteId}/wiki/${wikiId}`).ref, wikiData)
        .set(this.db.doc(`countries/${this.countryId}/sites/${siteId}/checklist/${checklistId}`).ref, {})
        .commit();
    });
    // Go ahead and clear the section variables
    this.isNewSiteHospital = null;
    this.newSiteName = null;
  }

  goSites() {
    this.viewSites = true;
    this.sharedService.addName.emit('New Site');
    this.sharedService.canEdit.emit(this.canEditSites || this.canProposeWiki);
  }

  goWiki() {
    this.viewSites = false;
    this.sharedService.addName.emit('New Section');
    this.sharedService.canEdit.emit(this.canEditWiki);
  }

  onTabClicked(tab: number) {
    if (tab === 0) {
      this.viewSites = false;
      this.sharedService.addName.emit('New Section');
      this.sharedService.canEdit.emit(this.canEditWiki || this.canProposeWiki);
    } else if (tab === 1) {
      this.viewSites = true;
      this.sharedService.addName.emit('New Site');
      this.sharedService.canEdit.emit(this.canEditSites || this.canProposeWiki);
    }
  }
}
