import {AfterContentInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {SharedService} from 'src/app/service/shared-service.service';
import {Subscription} from 'rxjs';
import {SwUpdate} from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SharedService],

  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterContentInit, OnDestroy, OnInit {
  @ViewChild('toolbar', {read: ElementRef}) toolbar: ElementRef;
  title = 'missionSupport1';
  pageName;
  onMain = true;
  height;
  toolbarHeight;
  hasEditRights = false;
  elmnt;
  editMode = false;
  addName;
  scrollpanelSubtract: number;

  hideToolbarSub: Subscription;
  pageNavSub: Subscription;
  canEditSub: Subscription;
  addNameSub: Subscription;
  scrollpanelSubtractSub: Subscription;

  constructor(private sharedService: SharedService, private swUpdate: SwUpdate) {
    this.hideToolbarSub = this.sharedService.hideToolbar.subscribe((onMain) => this.onMain = onMain);
    this.pageNavSub = this.sharedService.onPageNav.subscribe((page) => this.pageName = page);
    this.canEditSub = this.sharedService.canEdit.subscribe((hasEditRights) => this.hasEditRights = hasEditRights);
    this.addNameSub = this.sharedService.addName.subscribe((addName) => this.addName = addName);
    this.scrollpanelSubtractSub = this.sharedService.scrollPanelHeightToSubtract
    .subscribe((subtract: number) => {
      this.scrollpanelSubtract = subtract;
      this.height = window.innerHeight - subtract;
    });

    this.height = window.innerHeight - 100;

    window.addEventListener('resize', () => this.height = window.innerHeight - this.scrollpanelSubtract);
  }

  ngAfterContentInit(): void {}

  ngOnDestroy(): void {
    if (this.addNameSub) {
      this.addNameSub.unsubscribe();
    }
    if (this.canEditSub) {
      this.canEditSub.unsubscribe();
    }
    if (this.pageNavSub) {
      this.pageNavSub.unsubscribe();
    }
    if (this.hideToolbarSub) {
      this.hideToolbarSub.unsubscribe();
    }
    if (this.scrollpanelSubtractSub) {
      this.scrollpanelSubtractSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    // indexedDB.deleteDatabase('firebaseLocalStorageDb');
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('New version of application is available. Load new version?')) {
          if (window.indexedDB) {
                window.indexedDB.deleteDatabase('firestore/MissionSupport1/missionsupport1-1541644479691/main');
                window.location.reload();

              } else {
                console.log('nope');
              }
          // window.location.reload();
        }
      });
    }
  }
}
