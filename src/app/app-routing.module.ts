import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {AuthguardService} from './service/authguard.service';
import {ProfileComponent} from './profile/profile.component';
import {SitesComponent} from './sites/sites.component';
import {SettingsListComponent} from './settings-list/settings-list.component';
import {UploadFormComponent} from './upload-form/upload-form.component';
import {GroupsComponent} from './groups/groups.component';
import {GroupadminComponent} from './admin/groupadmin/groupadmin.component';
import {ProfileViewComponent} from './profile-view/profile-view.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'landing',
    component: SettingsListComponent,
    outlet: 'sidebar'
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'landing',
    canActivate: [AuthguardService],
    component: LandingComponent,
    // children: [
    //   {
    //     path: 'settingsOptions',
    //     canActivate: [AuthguardService],
    //     component: SettingsListComponent,
    //     outlet: 'sidebar'
    //   }
    // ]
  },
  {
    path: 'profile',
    canActivate: [AuthguardService],
    component: ProfileComponent
  },
  {
    path: 'sites/:id',
    canActivate: [AuthguardService],
    component: SitesComponent,
//    children: [
//      {
//        path: '',
//        redirectTo: 'groups',
//        pathMatch: 'full'
//      },
//      {
//        path: 'group/:groupId',
//        canActivate: [AuthguardService],
//        component: GroupsComponent
//      },
//    ]
  },
  {
    path: 'settingsOptions',
    canActivate: [AuthguardService],
    component: SettingsListComponent,
    outlet: 'sidebar'
  },
  {
    path: 'profileSide',
    canActivate: [AuthguardService],
    component: ProfileComponent,
    outlet: 'sidebar'
  },
  {
    path: 'uploadSide',
    canActivate: [AuthguardService],
    component: UploadFormComponent,
    outlet: 'sidebar'
  },
  {
    path: 'manageGroup',
    canActivate: [AuthguardService],
    component: GroupadminComponent,
    outlet: 'sidebar'
  },
  {
    path: 'sites/:siteId/group/:groupId',
    canActivate: [AuthguardService],
    component: GroupsComponent
  },
  {
    path: 'profileView',
    canActivate: [AuthguardService],
    component: ProfileViewComponent,
    outlet: 'sidebar'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
