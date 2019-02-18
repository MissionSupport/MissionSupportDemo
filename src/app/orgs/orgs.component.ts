import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {SharedService} from '../globals';
import {Page} from '../interfaces/page';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-groups',
  templateUrl: './orgs.component.html',
  styleUrls: ['./orgs.component.css']
})
export class OrgsComponent implements OnInit, OnDestroy {

  siteId: string;
  groupId: string;
  groupElementId: string; // The id of the element in orgs under site
  pageId: string; // Represents the id of the current page we want to reference
  pageData: Page;
  sections = [];
  editText = [];
  hideMe = [];

  canModify = false; // This variable will be true if the user can edit the page.
  editMode = false;

  groupSub: Subscription;
  pageSubArr: Subscription[];
  layoutSubArr: Subscription[];

  constructor(private route: ActivatedRoute, private readonly db: AngularFirestore, private sharedService: SharedService) {
    this.siteId = this.route.snapshot.paramMap.get('siteId');
    this.groupId = this.route.snapshot.paramMap.get('groupId');
    sharedService.hideToolbar.emit(false);
    // First thing we want to get is the current page
    this.groupSub = this.db.collection(`Sites/${this.siteId}/groups`, ref => ref.limit(1)
    ).snapshotChanges().subscribe(data => {
      this.pageId = data[0].payload.doc.data()['current_page'];
      this.groupElementId = data[0].payload.doc.id;
      // TODO About to have a bunch of nested observables, need to find a better way to do this.
      let pageSub: Subscription;
      pageSub = this.db.doc(`Sites/${this.siteId}/groups/${this.groupElementId}/page/${this.pageId}`).valueChanges().subscribe(
        (pageData: Page) => {
        this.pageData = pageData;
        let layoutSub: Subscription;
        layoutSub = this.db.collection(`Sites/${this.siteId}/groups/${this.groupElementId}/page/${this.pageId}/layout`).valueChanges()
          .subscribe(pageLayoutData => {
            for (const title in pageLayoutData[0]) {
              if (pageLayoutData[0].hasOwnProperty(title)) {
                const markup = pageLayoutData[0][title];
                this.sections.push({title, markup});
                this.editText.push(markup);
              }
            }
          }
        );
        this.layoutSubArr = [...this.layoutSubArr, layoutSub];
      });
      this.pageSubArr = [...this.pageSubArr, pageSub];
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.groupSub) {
      this.groupSub.unsubscribe();
    }
    let sub: Subscription;
    for (sub of this.layoutSubArr) {
      sub.unsubscribe();
    }
    for (sub of this.pageSubArr) {
      sub.unsubscribe();
    }
  }

}
