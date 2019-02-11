import { Component, OnInit, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SidebarService } from '../service/sidebar.service';

@Component({
  selector: 'app-settings-list',
  templateUrl: './settings-list.component.html',
  styleUrls: ['./settings-list.component.css']
})
export class SettingsListComponent implements OnInit {

  menuItems: MenuItem[];

  constructor(public authInstance: AngularFireAuth, public router: Router, private sidebarService: SidebarService) { }

  ngOnInit() {
    this.menuItems = [
      { label: 'My Profile', icon: 'pi pi-fw pi-user', routerLink: ['', { outlets: { sidebar: ['profileView'] } }] },
      { label: 'Edit Checklist Preferences', icon: 'pi pi-fw pi-cog' },
      { label: 'View Permissions', icon: 'pi pi-fw pi-lock' },
      { label: 'Upload Media' , icon: 'pi pi-fw pi-cloud-upload', routerLink: ['', { outlets: { sidebar: ['uploadSide'] } }] },
      { label: 'Manage Organizations', icon: 'pi pi-fw pi-users', routerLink: ['', { outlets: { sidebar: ['manageGroup'] } }] },
      { label: 'My Trips', icon: 'pi pi-fw pi-briefcase', routerLink: ['', { outlets: { sidebar: ['myTripsSide'] } }] },
      { label: 'Log Out', icon: 'pi pi-fw pi-sign-out', command: () => {
        this.authInstance.auth.signOut().then(() => {
          localStorage.removeItem('user');
          this.sidebarService.toggle();
          this.router.navigate(['/']);
        })
        .catch((error) => {
          console.error(error);
        });
      } }
    ];
  }
}
