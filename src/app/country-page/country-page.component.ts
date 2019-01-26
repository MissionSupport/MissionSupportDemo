import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SharedService} from '../globals';
import {Router} from '@angular/router';
import {Site} from '../interfaces/site';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {EditTask} from '../interfaces/edit-task';
import {PreDefined} from '../globals';
import {forEach} from '@angular/router/src/utils/collection';
import {json} from 'express';
import {Observable} from 'rxjs';

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
  id;
  countryName;
  countryCollection;
  editTasks;
  sections = [];
  editText = [];
  hideme = [];
  versionId;
  wikiId;
  mainHeight;
  sites: Observable<Site[]>;
  siteCollection: AngularFirestoreCollection<Site>;
  selectedSite: Site;



  constructor( private sharedService: SharedService, public router: Router, private readonly db: AngularFirestore,
               private preDef: PreDefined) {
    this.clientHeight = window.innerHeight;
    sharedService.hideToolbar.emit(false);
    this.footerHeight = 45;
    this.mainHeight = this.clientHeight - this.footerHeight * 2.2;
    // ------------------------------------------------------------------------------------------------------
    // ToDO: Delete once implement other stuff below (temp to check ui and nav)
    sharedService.onPageNav.emit('Country Name');
    for (let element of preDef.wikiCountry) {
      this.sections.push({title: element.title, markup: element.markup});
      // this.editText.push({title: element.title, markup: element.markup});
    }
    this.sections.push({title: 'hello', markup: '<p>TestingTesting 123</p>'});
    this.editText.push('<p>TestingTesting 123</p>');
    this.sections.push({title: 'baby shark', markup: '<p>Do do Do do dodo</p>'});
    this.editText.push('<p>Do do Do do dodo</p>');
    this.sections.push({title: 'mommy shark', markup: '<p>Do do Do do dodo</p>'});
    this.editText.push('<p>Do do Do do dodo</p>');
    this.sections.push({title: 'daddy shark', markup: '<p>Do do Do do dodo</p>'});
    this.editText.push('<p>Do do Do do dodo</p>');

    // TODO: Change this to get the 'Country/Sites' list instead
    this.siteCollection = db.collection<Site>('Sites');
    this.sites = this.siteCollection.valueChanges();
    this.sites.subscribe( item => {
      this.sites = item as any;
    });

    // ------------------------------------------------------------------------------------------------------


    // TODO: Rourke uncomment this once you have made the Countries DB entrys
    // // TODO: Get country id from param
    // //
    // //
    // this.id = this.route.snapshot.paramMap.get('id');
    // // TODO: Subscribe to country (add rules as well)
    // //
    // //
    // this.db.doc(`Countries/${this.id}`).valueChanges().subscribe((data: Country) => {
    //   this.countryName = data.countryName;
    //   sharedService.onPageNav.emit(this.countryName);
    // });
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
    this.db.doc(`Countries/${this.id}/versions/${this.versionId}/wikiSections/${this.wikiId}`).update(jsonVariable);
    this.hideme[i] = !this.hideme[i];
  }

  siteClick(): void {
    // console.log(this.selectedSite);
    this.router.navigate(['sites/' + this.selectedSite.id]);
    // this.router.navigate(['/temp']);
  }
}
