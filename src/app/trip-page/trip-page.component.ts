import {Component, OnDestroy, OnInit} from '@angular/core';
import {PreDefined} from '../globals';
import {SharedService} from '../service/shared-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Organization} from '../interfaces/organization';
import {AngularFirestore} from '@angular/fire/firestore';
import {Trip} from '../interfaces/trip';
import { BottomTab } from '../interfaces/bottom-tab';
import {Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  editText = [];
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
  location = 'USA';
  group: string;
  groupId: string;
  leader = 'Vikas';
  team = 'Emory 12';
  date = '7.12.17';

  // ToDo: Edit based on permissions
  canEditAbout = true;

  titleEdits = [];
  titleEditsConfirm = [];

  tabs: Array<BottomTab> = [{name: 'Wiki', icon: 'pi pi-align-justify'},
                            {name: 'About', icon: 'pi pi-info-circle'}];

  unsubscribeSubject: Subject<void> = new Subject<void>();

  // tripSub: Subscription;
  // sectionSub: Subscription;
  // wikiSub: Subscription;
  // orgSub: Subscription;

  constructor(public sharedService: SharedService, private preDef: PreDefined, public router: Router, private route: ActivatedRoute,
              private readonly db: AngularFirestore) {
    sharedService.hideToolbar.emit(false);
    this.tripId = this.route.snapshot.paramMap.get('id');
    sharedService.addName.emit('New Section');

    const trip = this.db.doc(`trips/${this.tripId}`);
    this.db.doc(`trips/${this.tripId}`).valueChanges()
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
            this.editText.push(markup);
            this.titleEdits.push();
            this.titleEditsConfirm.push();
          });
        });

        // Now get the org information
        db.doc(`organizations/${t.orgId}`).valueChanges()
          .pipe(takeUntil(this.unsubscribeSubject)).subscribe((data: Organization) => {
            this.org = data;
            this.group = data.name;
          });
      });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    // if (this.orgSub) {
    //   this.orgSub.unsubscribe();
    // }
    // if (this.sectionSub) {
    //   this.sectionSub.unsubscribe();
    // }
    // if (this.tripSub) {
    //   this.tripSub.unsubscribe();
    // }
    // if (this.wikiSub) {
    //   this.wikiSub.unsubscribe();
    // }

    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  submitEdit(title, i, titleEdit, confirmTitleEdit) {
    if (confirmTitleEdit) {
      // TODO: implement:
      // changeSectionHeader(titleEdit)
      console.log(titleEdit);
    }
    // this.editText[i] is the data we with to push into firebase with the section header title
    // to then revert the page to the view do "hidden[i] = !hidden[i];"
    // TODO: This implenentation
    const jsonVariable = {};
    jsonVariable[title] = this.editText[i];
    // this.db.doc(`Countries/${this.id}/versions/${this.versionId}/wikiSections/${this.wikiId}`).update(jsonVariable);
    this.hideme[i] = !this.hideme[i];
  }

  submitNewSection() {
    console.log(this.newSectionName, this.newSectionText);
    // TODO: if(add works )
    this.showNewSectionPopup = false;
  }

  groupClick(): void {
    // console.log(this.selectedSite);
    this.sharedService.backHistory.push(this.router.url);
    this.router.navigate(['org/' + this.org.id]);
    // this.router.navigate(['/temp']);
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
