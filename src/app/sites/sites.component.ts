import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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
import {flatMap, map} from 'rxjs/operators';
import {Country} from '../interfaces/country';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css']
})

export class SitesComponent implements OnInit, OnDestroy {


  siteId: string;
  viewWiki = true;
  viewChecklist = false;
  viewTrips = false;

  countryId: string;

  sections: Observable<any[]>;
  hideme = [];
  footerHeight = 45;
  // trips: Trip[];
  trips: Observable<Trip>[];
  tripValues: Trip[];
  selectedTrip;

  checkList: Observable<any[]>;
  siteObservable: Observable<Site>;

  groups = []; // Contains an array of group ids

  // canEdit = false; // This is used to see if a user can approve edits
  // TODO: Change to proper value based on edit privileges
  canEditWiki: Observable<boolean>;  // this means the user can edit wiki
  showNewSectionPopup = false;
  newSectionText;
  newSectionName;
  newTripOrg;
  newTripTeam;

  constructor(public route: ActivatedRoute, private readonly db: AngularFirestore, private messageService: MessageService,
              public authInstance: AngularFireAuth, private sharedService: SharedService, public router: Router) {
    this.siteId = this.route.snapshot.paramMap.get('id');
    this.countryId = this.route.snapshot.paramMap.get('countryId');
    sharedService.hideToolbar.emit(false);
    // ToDo : edit based on rights
    sharedService.addName.emit('New Section');
    sharedService.addSection.subscribe(
      () => {
        this.showNewSectionPopup = true;
      }
    );
    this.siteObservable = this.db.doc(`countries/${this.countryId}/sites/${this.siteId}`)
      .valueChanges().pipe(map((site: Site) => {
      return site;
    }));
    this.siteObservable.subscribe((site: Site) => {
      sharedService.onPageNav.emit(site.siteName);
      // Get wiki information
      this.sections = this.db.doc(`countries/${this.countryId}/sites/${this.siteId}/wiki/${site.current}`).valueChanges()
        .pipe(map(data => {
          const array = [];
          for (const title in data) {
            if (data.hasOwnProperty(title)) {
              const markup = data[title];
              array.push({title, markup});
            }
          }
          return array;
        }));
      // Let's do checklist
      this.checkList = this.db.doc(`countries/${this.countryId}/sites/${this.siteId}/checklist/${site.currentCheckList}`)
        .valueChanges().pipe(map(data => {
          const array = [];
          for (const id in data) {
            if (data.hasOwnProperty(id)) {
              const markup = data[id];
              array.push({id, markup});
            }
          }
          return array;
        }));

      // Let's get the trips information
      this.tripValues = [];
      this.trips = site.tripIds.map(id => {
        return this.db.doc(`trips/${id}`).valueChanges().pipe(map((trip: Trip) => {
          return trip;
        }));
      });
      this.trips.map(ob => {
        // TODO this will cause memory leaks, primeng can only work with [..., new element] so no idea how to do this otherwise.
        ob.subscribe((trip: Trip) => {
          this.tripValues = [...this.tripValues, trip];
        });
      });
    });

    let wikiSubscibe = null;
    this.authInstance.auth.onAuthStateChanged(user => {
      if (wikiSubscibe) {
        wikiSubscibe.unsubscribe();
      }
      this.canEditWiki = this.db.doc(`user_preferences/${user.uid}`).valueChanges().pipe(map((pref: UserPreferences) => {
        return pref.admin;
      }));

      wikiSubscibe = this.canEditWiki.subscribe(can => {
        sharedService.canEdit.emit(can);
      });
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {

  }

  tripClick(): void {
    this.router.navigate(['trip/' + this.selectedTrip.id]);
  }

  submitNewSection() {
    console.log(this.newSectionName, this.newSectionText);
    // TODO: if(add works )
    this.showNewSectionPopup = false;
  }

  submitEdit(title, markup) {
    // this.editText[i] is the data we with to push into firebase with the section header title
    // to then revert the page to the view do "hidden[i] = !hidden[i];"
    // TODO: Currently we are not having edits on the page. We will wait for later sprints to add
    const jsonVariable = {};
  }

  submitNewTrip() {
    console.log(this.countryId, this.siteId, this.newTripOrg, this.newTripTeam);
    this.showNewSectionPopup = false;
  }
}

