import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {AuthguardService} from './service/authguard.service';
import {ProfileEditComponent} from './profile-edit/profile-edit.component';
import {SitesComponent} from './sites/sites.component';
import {SettingsListComponent} from './settings-list/settings-list.component';
import {UploadFormComponent} from './upload-form/upload-form.component';
import {OrgsComponent} from './orgs/orgs.component';
import {OrgadminComponent} from './admin/orgAdmin/orgadmin.component';
import {ProfileViewComponent} from './profile-view/profile-view.component';
import {MyOrgsListComponent} from './my-orgs-list/my-orgs-list.component';
import {MyTripsListComponent} from './my-trips-list/my-trips-list.component';
import {CountryPageComponent} from './country-page/country-page.component';


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
    component: ProfileEditComponent
  },
  {
    path: 'sites/:id',
    canActivate: [AuthguardService],
    component: SitesComponent,
//    children: [
//      {
//        path: '',
//        redirectTo: 'orgs',
//        pathMatch: 'full'
//      },
//      {
//        path: 'group/:groupId',
//        canActivate: [AuthguardService],
//        component: OrgsComponent
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
    component: ProfileEditComponent,
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
    component: OrgadminComponent,
    outlet: 'sidebar'
  },
  {
    path: 'sites/:siteId/group/:groupId',
    canActivate: [AuthguardService],
    component: OrgsComponent
  },
  {
    path: 'profileView',
    canActivate: [AuthguardService],
    component: ProfileViewComponent,
    outlet: 'sidebar'
  },
  {
    path: 'myGroupsSide',
    canActivate: [AuthguardService],
    component: MyOrgsListComponent,
    outlet: 'sidebar'
  },
  {
    path: 'myTripsSide',
    canActivate: [AuthguardService],
    component: MyTripsListComponent,
    outlet: 'sidebar'
  },
  {
    path: 'country/:id',
    canActivate: [AuthguardService],
    component: CountryPageComponent,
  },
  {
    path: 'country',
    canActivate: [AuthguardService],
    component: CountryPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
