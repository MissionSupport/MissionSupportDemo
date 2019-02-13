import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SharedService} from '../globals';
import {ActivatedRoute, Router} from '@angular/router';
import {Site} from '../interfaces/site';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {PreDefined} from '../globals';
import {Country} from '../interfaces/country';

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
  countryCollection;
  editTasks;
  sections = [];
  editText = [];
  hideme = [];
  versionId;
  wikiId;
  mainHeight;
  sites: Site[];
  siteCollection: AngularFirestoreCollection<Site>;
  selectedSite: Site;
  countryData: Country;
  canEdit = false;
  // TODO: Change to proper value based on edit privileges
  editMode = true;  // this means the user can edit
  showNewSectionPopup = false;
  newSectionText;
  newSectionName;
  newSiteName;
  isNewSiteHospital;

  constructor(private sharedService: SharedService, public router: Router, private readonly db: AngularFirestore,
               private preDef: PreDefined, private route: ActivatedRoute) {
    this.countryId = this.route.snapshot.paramMap.get('id');
    this.clientHeight = window.innerHeight;
    sharedService.hideToolbar.emit(false);
    sharedService.addName.emit('New Section');
    // ToDo : edit based on rights
    sharedService.canEdit.emit(true);
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

    this.db.doc(`countries/${this.countryId}`).valueChanges().subscribe((data: Country) => {
      this.countryName = data.countryName;
      this.countryData = data;
      sharedService.onPageNav.emit(this.countryName);
      this.db.doc(`countries/${this.countryId}/wiki/${this.countryData.current}`).valueChanges().subscribe( sectionData => {
        this.sections = [];
        this.editTasks = [];
        for (const title in sectionData) {
          if (sectionData.hasOwnProperty(title)) {
            const markup = sectionData[title];
            this.sections.push({title, markup});
            this.editText.push(markup);
          }
        }
      });
    });
    // // TODO: Now we are going to get the latest version of markdown that is approved. IF WE DO THIS
    // //
    // //
    // this.countryCollection = this.db.collection<Country>('Countries/' + this.id + '/versions', ref =>
    //   ref.where('current', '==', true).limit(1));
    // // TODO: IF using the same versioning scheme -> this is how we sould get the catagories?
    // //
    // //
    // this.countryCollection.snapshotChanges().subscribe(item => {
    //   item.map(a => {
    //     const data = a.payload.doc.id;
    //     this.updateVersionId(data);
    //     const sections = this.db.collection('Sites/' + this.id + '/versions/' + this.versionId + '/wikiSections');
    //     sections.snapshotChanges().subscribe(section => {
    //       let sectionData = null;
    //       section.map(args => {
    //         this.wikiId = args.payload.doc.id;
    //         sectionData = args.payload.doc.data();
    //       });
    //       this.sections = [];
    //       this.editText = [];
    //       for (const title in sectionData) {
    //         if (sectionData.hasOwnProperty(title)) {
    //           const markup = sectionData[title];
    //           this.sections.push({title, markup});
    //           this.editText.push(markup);
    //         }
    //       }
    //     });
    //   });
    // });
    // // TODO: get the countries sites
    // this.siteCollection = db.collection<Site>('Country/Sites');
    // this.sites = this.siteCollection.valueChanges();
    // this.sites.subscribe( item => {
    //   this.sites = item as any;
    // });
  }

  ngOnInit() {
  }

  updateVersionId(data) {
    this.versionId = data;
  }

  submitEdit(title, i) {
    // this.editText[i] is the data we with to push into firebase with the section header title
    // to then revert the page to the view do "hidden[i] = !hidden[i];"
    // TODO: Currently we are not having edits on the page. We will wait for later sprints to add
    const jsonVariable = {};
    jsonVariable[title] = this.editText[i];
    this.db.doc(`countries/${this.countryId}/wikiSections/${this.wikiId}/versions/${this.versionId}`).update(jsonVariable);
    this.hideme[i] = !this.hideme[i];
  }

  siteClick(): void {
    // console.log(this.selectedSite);
    this.router.navigate([`country/${this.countryId}/site/${this.selectedSite.id}`]);
    // this.router.navigate(['/temp']);
  }

  submitNewSection() {
    console.log(this.newSectionName, this.newSectionText);
    // TODO: if(add works )
    this.showNewSectionPopup = false;
  }

  submitNewSite() {
    console.log(this.countryId, this.newSiteName, this.isNewSiteHospital);
    this.showNewSectionPopup = false;
  }
}
