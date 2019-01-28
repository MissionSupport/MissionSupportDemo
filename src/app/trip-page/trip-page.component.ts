import { Component, OnInit } from '@angular/core';
import {PreDefined, SharedService} from '../globals';
import {ActivatedRoute, Router} from '@angular/router';
import {Organization} from '../interfaces/organization';
import {AngularFirestore} from '@angular/fire/firestore';
import {Trip} from '../interfaces/trip';

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
  org: Organization;
  tripId: string;
  editMode = false;
  canEdit = false;

  // TODO: get all of these from actual database
  location = 'USA';
  group: string;
  groupId: string;
  leader = 'Vikas';
  team = 'Emory 12';
  date = '7.12.17';

  constructor(private sharedService: SharedService, private preDef: PreDefined, public router: Router, private route: ActivatedRoute,
              private readonly db: AngularFirestore) {
    sharedService.hideToolbar.emit(false);
    this.footerHeight = 45;
    this.tripId = this.route.snapshot.paramMap.get('id');
    const trip = this.db.doc(`trips/${this.tripId}`);
    trip.valueChanges().subscribe((t: Trip) => {
      sharedService.onPageNav.emit(t.tripName);
      // Get wiki information
      trip.collection('wiki').doc(t.current).valueChanges().subscribe(data => {
        this.sections = [];
        for (const title in data) {
          if (data.hasOwnProperty(title)) {
            const markup = data[title];
            this.sections.push({title, markup});
            this.editText.push(markup);
          }
        }
      });
      // Now get the org information
      db.doc(`organizations/${t.orgId}`).valueChanges().subscribe( (data: Organization) => {
        this.org = data;
        this.group = data.name;
      });
    });
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
    this.router.navigate(['org/' + this.org.id]);
    // this.router.navigate(['/temp']);
  }
}
