import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SidebarService } from '../service/sidebar.service';
import {UserPreferences} from '../interfaces/user-preferences';
import {AngularFirestore} from '@angular/fire/firestore';
import {takeUntil} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import { SharedService } from '../service/shared-service.service';

@Component({
  selector: 'app-settings-list',
  templateUrl: './settings-list.component.html',
  styleUrls: ['./settings-list.component.css']
})
export class SettingsListComponent implements OnInit {

  menuItems: MenuItem[];
  subUserPref: Subscription;
  viewDash: boolean;
  unsubscribeSubject: Subject<void> = new Subject<void>();

  constructor(public authInstance: AngularFireAuth, public router: Router, private sidebarService: SidebarService,
              private readonly db: AngularFirestore, private sharedService: SharedService) {
    this.authInstance.auth.onAuthStateChanged(user => {
      if (this.subUserPref) {
        this.subUserPref.unsubscribe();
      }
      if (user) {
      this.subUserPref = this.db.doc(`user_preferences/${user.uid}`).valueChanges()
        .pipe(takeUntil(this.unsubscribeSubject)).subscribe((pref: UserPreferences) => {
          this.viewDash = pref.admin;
          this.menuItems = [
            { label: 'My Profile', icon: 'pi pi-fw pi-user', routerLink: ['', { outlets: { sidebar: ['profileView'] } }] },
            { label: 'Admin Dashboard', icon: 'pi pi-fw pi-lock', visible: this.viewDash, command: () => {
                this.sharedService.backHistory.push(this.router.url);
                this.sidebarService.toggle();
                this.router.navigate(['/admindash']);
              } },
            // { label: 'Upload Media' , icon: 'pi pi-fw pi-cloud-upload', routerLink: ['', { outlets: { sidebar: ['uploadSide'] } }] },
            { label: 'Manage Organizations', icon: 'pi pi-fw pi-users', routerLink: ['', { outlets: { sidebar: ['manageGroup'] } }] },
            { label: 'Log Out', icon: 'pi pi-fw pi-sign-out', command: () => {
                this.authInstance.auth.signOut().then(() => {
                  localStorage.removeItem('user');
                  this.sidebarService.toggle();
                  this.sharedService.backHistory = [];
                  this.router.navigate(['login']);
                })
                  .catch((error) => {
                    console.error(error);
                  });
              } }
          ];
        });
      }
    });
  }

  ngOnInit() {
  }
}
