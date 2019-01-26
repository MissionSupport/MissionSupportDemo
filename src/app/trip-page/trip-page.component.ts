import { Component, OnInit } from '@angular/core';
import {PreDefined, SharedService} from '../globals';
import {Router} from '@angular/router';

@Component({
  selector: 'app-trip-page',
  templateUrl: './trip-page.component.html',
  providers: [PreDefined],
  styleUrls: ['./trip-page.component.css']
})
export class TripPageComponent implements OnInit {

  markdown: string;
  viewWiki = true;
  viewAbout = false;
  footerHeight = 45;
  sections = [];
  editText = [];
  hideme = [];
  orgid = 'willGEt';

  // TODO: get all of these from actual database
  location = 'USA';
  group = 'Emory';
  leader = 'Vikas';
  team = 'Emory 12';
  date = '7.12.17';

  constructor(private sharedService: SharedService, private preDef: PreDefined, public router: Router) {
    sharedService.hideToolbar.emit(false);
    this.footerHeight = 45;
    // ToDO: Delete once implement other stuff below (temp to check ui and nav)
    sharedService.onPageNav.emit('Trip Name');
    for (let element of preDef.wikiTrip) {
      this.sections.push({title: element.title, markup: element.markup});
      // this.editText.push({title: element.title, markup: element.markup});
    }

    // -------------------------------------------------------------------------------------------
    // TODO: Rourke uncomment this once you have made the Countries DB entrys
    // // TODO: Get trip id from param
    // //
    // //
    // this.id = this.route.snapshot.paramMap.get('id');
    // // TODO: Subscribe to trip (add rules as well)
    // //
    // //
    // this.db.doc(`Countries/site/trip/${this.id}`).valueChanges().subscribe((data: Trip) => {
    //   this.tripName = data.tripName;
    //   sharedService.onPageNav.emit(this.tripName);
    // });
    // // TODO: Now we are going to get the latest version of markdown that is approved. IF WE DO THIS
    // //
    // //
    // this.tripCollection = this.db.collection<Trip>('Countries/sites' + this.id + '/versions', ref =>
    //   ref.where('current', '==', true).limit(1));
    // // TODO: IF using the same versioning scheme -> this is how we sould get the catagories?
    // //
    // //
    // this.tripCollection.snapshotChanges().subscribe(item => {
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
  }

  ngOnInit() {
  }

  submitEdit(title, i) {
    // this.editText[i] is the data we with to push into firebase with the section header title
    // to then revert the page to the view do "hidden[i] = !hidden[i];"
    // TODO: This implenentation
    const jsonVariable = {};
    jsonVariable[title] = this.editText[i];
    // this.db.doc(`Countries/${this.id}/versions/${this.versionId}/wikiSections/${this.wikiId}`).update(jsonVariable);
    this.hideme[i] = !this.hideme[i];
  }

  groupClick(): void {
    // console.log(this.selectedSite);
    this.router.navigate(['org/' + this.orgid]);
    // this.router.navigate(['/temp']);
  }
}
