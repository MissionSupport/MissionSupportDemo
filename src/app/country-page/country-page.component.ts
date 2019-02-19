import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SharedService} from '../globals';
import {ActivatedRoute, Router} from '@angular/router';
import {Site} from '../interfaces/site';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {PreDefined} from '../globals';
import {Country} from '../interfaces/country';
import {flatMap, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserPreferences} from '../interfaces/user-preferences';
import * as firebase from 'firebase';
import { BottomTab } from '../interfaces/bottom-tab';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  providers: [PreDefined],
  styleUrls: ['./country-page.component.css'],
  styles: [
    '.custombar1 .ui-scrollpanel-bar { opacity: 1;}'
  ]
})
export class CountryPageComponent implements OnInit {
  footerHeight: number;
  clientHeight: number;
  viewWiki = true;
  viewSites = false;
  countryId: string;
  countryName;
  sections: Observable<any[]>;
  hideme = [];
  wikiId: string;
  mainHeight;
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

  // ToDO change based on permissions
  canEditWiki: Observable<boolean>; // Editing wiki
  canEditSites: Observable<boolean>; // editing site

  titleEdits = [];

  tabs: Array<BottomTab> = [{name: 'Wiki', icon: 'pi pi-align-justify'},
                            {name: 'Sites', icon: 'pi pi-sitemap'}];

  constructor(private sharedService: SharedService, public router: Router, private readonly db: AngularFirestore,
               private preDef: PreDefined, private route: ActivatedRoute, private authInstance: AngularFireAuth) {
    this.countryId = this.route.snapshot.paramMap.get('id');
    this.clientHeight = window.innerHeight;
    sharedService.hideToolbar.emit(false);
    sharedService.addName.emit('New Section');
    // ToDo : edit based on rights
    sharedService.addSection.subscribe(
      () => {
        this.showNewSectionPopup = true;
      }
    );
    this.footerHeight = 45;
    this.mainHeight = this.clientHeight - this.footerHeight * 2.2;

    // TODO: Change this to get the 'Country/Sites' list instead
    this.siteCollection = db.collection<Site>(`countries/${this.countryId}/sites`);
    this.siteCollection.valueChanges().subscribe( item => {
      this.sites = item;
    });

    this.sections = this.db.doc(`countries/${this.countryId}`).valueChanges().pipe(flatMap((data: Country) => {
      this.countryName = data.countryName;
      this.countryData = data;
      this.wikiId = data.current; // Wiki id.
      sharedService.onPageNav.emit(this.countryName);
      return this.db.doc(`countries/${this.countryId}/wiki/${this.countryData.current}`).valueChanges().pipe( map(sectionData => {
        const sections = [];
        this.titleEdits = [];
        for (const title in sectionData) {
          if (sectionData.hasOwnProperty(title)) {
            const markup = sectionData[title];
            sections.push({title, markup});
            this.titleEdits.push();
          }
        }
        return sections;
      }));
    }));

    this.authInstance.auth.onAuthStateChanged(user => {
      console.log(user);
      this.canEditSites = this.canEditWiki =
        this.db.doc(`user_preferences/${user.uid}`).valueChanges().pipe(map((pref: UserPreferences) => {
        return pref.admin;
      }));
      this.canEditWiki.subscribe(data => {
        sharedService.canEdit.emit(data);
      });
    });
  }

  ngOnInit() {
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
    this.db.doc(`countries/${this.countryId}/wiki/${this.wikiId}`).update(jsonVariable);
    console.log(title, markup, newTitle, confirm);
  }

  siteClick(): void {
    // console.log(this.selectedSite);
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
    console.log(this.countryId, this.newSiteName, this.isNewSiteHospital);
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
      this.db.doc(`countries/${this.countryId}/sites/${siteId}/wiki/${wikiId}`).set(wikiData);
      /** TODO get checklist predefined and add it.
      const checklistData = {};
      for (const x of this.preDef.) {
        wikiData[x.title] = x.markup;
      }
      this.db.doc(`countries/${this.countryId}/sites/${siteId}/wiki/${wikiId}`).set(checklistData);
       */
    });
  }

  onTabClicked(tab: number) {
    if (tab === 0) {
      this.viewWiki = true;
      this.viewSites = false;
      this.sharedService.addName.emit('New Section');
      this.sharedService.canEdit.emit(this.canEditWiki);
    } else if (tab === 1) {
      this.viewWiki = false;
      this.viewSites = true;
      this.sharedService.addName.emit('New Site');
      this.sharedService.canEdit.emit(this.canEditSites);
    }
  }
}
