import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-settings-list',
  templateUrl: './settings-list.component.html',
  styleUrls: ['./settings-list.component.css']
})
export class SettingsListComponent implements OnInit {

  menuItems: MenuItem[];

  constructor() { }

  ngOnInit() {
    this.menuItems = [
      { label: 'My Profile', icon: 'pi pi-fw pi-user', routerLink: ['', { outlets: { sidebar: ['profileView'] } }] },
      { label: 'Edit Checklist Preferences', icon: 'pi pi-fw pi-cog' },
      { label: 'View Permissions', icon: 'pi pi-fw pi-lock' },
      { label: 'Upload Media' , icon: 'pi pi-fw pi-cloud-upload', routerLink: ['', { outlets: { sidebar: ['uploadSide'] } }] },
      { label: 'Manage Groups', icon: 'pi pi-fw pi-users', routerLink: ['', { outlets: { sidebar: ['manageGroup'] } }] }
    ];
  }

}
