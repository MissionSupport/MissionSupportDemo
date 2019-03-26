import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {AuthguardService} from './service/authguard.service';
import {SitesComponent} from './sites/sites.component';
import {SettingsListComponent} from './settings-list/settings-list.component';
import {UploadFormComponent} from './upload-form/upload-form.component';
import {OrgsComponent} from './orgs/orgs.component';
import {OrgadminComponent} from './admin/orgAdmin/orgadmin.component';
import {ProfileViewComponent} from './profile-view/profile-view.component';
import {MyOrgsListComponent} from './my-orgs-list/my-orgs-list.component';
import {MyTripsListComponent} from './my-trips-list/my-trips-list.component';
import {CountryPageComponent} from './country-page/country-page.component';
import {TripPageComponent} from './trip-page/trip-page.component';
import {OrgPageComponent} from './org-page/org-page.component';
import {ChecklistCreationPageComponent} from './checklist-creation-page/checklist-creation-page.component';
import {SiteSearchComponent} from './site-search/site-search.component';
import {LoginGuardService} from './service/login-guard.service';
import {AdminNewListComponent} from './admin/admin-new-list/admin-new-list.component';
import {AdminCountryCreationComponent} from './admin/admin-country-creation/admin-country-creation.component';
import {DiffEditComponent} from './admin/diff-edit/diff-edit.component';
import {AdminDashboardComponent} from './admin/admin-dashboard/admin-dashboard.component';
import {ChecklistVersionComponent} from './admin/checklist-version/checklist-version.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [LoginGuardService],
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
    path: 'country/:countryId/site/:id',
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
    path: 'trip/:id',
    canActivate: [AuthguardService],
    component: TripPageComponent,
  },
  {
    path: 'org/:id',
    canActivate: [AuthguardService],
    component: OrgPageComponent,
  },
  // {
  //   path: 'list',
  //   canActivate: [AuthguardService],
  //   component: ChecklistCreationPageComponent,
  // },
  {
    path: 'search-sites',
    component: SiteSearchComponent,
  },
  {
    path: 'country/:countryId/site/:id/list',
    canActivate: [AuthguardService],
    component: ChecklistCreationPageComponent,

  },
  {
    path: 'version',
    canActivate: [AuthguardService],
    component: DiffEditComponent,

  },
  {
    path: 'adminList',
    canActivate: [AuthguardService],
    component: AdminNewListComponent,

  },
  {
    path: 'adminCountry',
    canActivate: [AuthguardService],
    component: AdminCountryCreationComponent,

  },
  {
    path: 'admindash',
    canActivate: [AuthguardService],
    component: AdminDashboardComponent,

  },
  {
    path: 'adminChecklistVersion',
    canActivate: [AuthguardService],
    component: ChecklistVersionComponent,

  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
