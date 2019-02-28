import {Component, OnDestroy, OnInit} from '@angular/core';
import {SharedService} from '../globals';
import {ActivatedRoute, Router} from '@angular/router';
import {Site} from '../interfaces/site';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {PreDefined} from '../globals';
import {Country} from '../interfaces/country';
import {flatMap, map} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserPreferences} from '../interfaces/user-preferences';
import * as firebase from 'firebase';
import { BottomTab } from '../interfaces/bottom-tab';
import { MessageService } from 'primeng/api';

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
  // viewWiki: boolean;
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
  newSectionText;
  newSectionName;
  newSiteName;
  isNewSiteHospital;

  // TODO: change based on permissions
  canEditWiki: boolean; // Editing wiki
  canEditSites: boolean; // editing site

  titleEdits = [];
  startTab = 0;

  tabs: Array<BottomTab> = [{name: 'Wiki', icon: 'pi pi-align-justify'},
                            {name: 'Sites', icon: 'pi pi-sitemap'}];

  constructor(private sharedService: SharedService, public router: Router, private readonly db: AngularFirestore,
               private preDef: PreDefined, private route: ActivatedRoute, private authInstance: AngularFireAuth,
               private messageService: MessageService) {
    this.countryId = this.route.snapshot.paramMap.get('id');
    this.clientHeight = window.innerHeight;
    sharedService.hideToolbar.emit(false);
    sharedService.addName.emit('New Section');

    // TODO: edit based on rights
    sharedService.addSection.subscribe(
      () => {
        this.showNewSectionPopup = true;
      }
    );
    sharedService.goSites.subscribe(
      (bool: boolean) => {
        if (bool) {this.goSites(); this.startTab = 1; }
      }
    );
    this.footerHeight = 45;
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
        sharedService.onPageNav.emit(this.countryName);

        return this.db.doc(`countries/${this.countryId}/wiki/${this.countryData.current}`).valueChanges()
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

    // let subUserPref = null;
    this.authInstance.auth.onAuthStateChanged(user => {
      console.log(user);
      if (this.subUserPref) {
        this.subUserPref.unsubscribe();
      }
      this.subUserPref = this.db.doc(`user_preferences/${user.uid}`).valueChanges()
        .subscribe((pref: UserPreferences) => {
          this.canEditSites = this.canEditWiki = pref.admin;
          sharedService.canEdit.emit(pref.admin);
        }
      );
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    console.log('here');
    if (this.subUserPref) {
      this.subUserPref.unsubscribe();
    }
  }

  submitEdit(title, markup, newTitle, confirm) {
    // this.editText[i] is the data we with to push into firebase with the section header title
    // to then revert the page to the view do "hidden[i] = !hidden[i];"
    // TODO: Currently we are not having edits on the page. We will wait for later sprints to add
    const jsonVariable = {};
    if (confirm) {
      jsonVariable[newTitle] = markup;
      jsonVariable[title] = firebase.firestore.FieldValue.delete();
    } else {
      jsonVariable[title] = markup;
    }
    this.db.doc(`countries/${this.countryId}/wiki/${this.wikiId}`).update(jsonVariable)
      .catch(() =>
        this.messageService.add({severity: 'error', summary: 'Unable to Save Edit',
          detail: 'Failed to save your edit to the wiki. Please try again later.'})
      );
    console.log(title, markup, newTitle, confirm);
  }

  siteClick(): void {
    // console.log(this.selectedSite);
    this.sharedService.backHistory.push(this.router.url);
    this.router.navigate([`country/${this.countryId}/site/${this.selectedSite.id}`]);
    // this.router.navigate(['/temp']);
  }

  submitNewSection() {
    console.log(this.newSectionName, this.newSectionText);
    this.showNewSectionPopup = false;
    // Now save to the database
    const jsonVariable = {};
    jsonVariable[this.newSectionName] = this.newSectionText;
    this.db.doc(`countries/${this.countryId}/wiki/${this.wikiId}`).update(jsonVariable).then(() => {
      // Success
      console.log('Successfully added new section');
    });
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
      tripIds: []
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
    // this.viewWiki = false;
    this.viewSites = true;
    this.sharedService.addName.emit('New Site');
    this.sharedService.canEdit.emit(this.canEditSites);
  }

  goWiki() {
    // this.viewWiki = true;
    this.viewSites = false;
    this.sharedService.addName.emit('New Section');
    this.sharedService.canEdit.emit(this.canEditWiki);
  }

  onTabClicked(tab: number) {
    if (tab === 0) {
      // this.viewWiki = true;
      this.viewSites = false;
      this.sharedService.addName.emit('New Section');
      this.sharedService.canEdit.emit(this.canEditWiki);
    } else if (tab === 1) {
      // this.viewWiki = false;
      this.viewSites = true;
      this.sharedService.addName.emit('New Site');
      this.sharedService.canEdit.emit(this.canEditSites);
    }
  }
}
