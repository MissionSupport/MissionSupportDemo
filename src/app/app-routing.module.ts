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
import {MyTripsListComponent} from './my-trips-list/my-trips-list.component';
import {CountryPageComponent} from './country-page/country-page.component';
import {TripPageComponent} from './trip-page/trip-page.component';
import {OrgPageComponent} from './org-page/org-page.component';
import {ChecklistCreationPageComponent} from './checklist-fillOut-page/checklist-creation-page.component';
import {SiteSearchComponent} from './site-search/site-search.component';
import {AdminNewListComponent} from './admin/admin-new-list/admin-new-list.component';
import {DiffEditComponent} from './admin/diff-edit/diff-edit.component';
import {AdminDashboardComponent} from './admin/admin-dashboard/admin-dashboard.component';
import {ChecklistVersionComponent} from './admin/checklist-version/checklist-version.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthguardService],
    component: LandingComponent
  },
  {
    path: '',
    component: SettingsListComponent,
    outlet: 'sidebar'
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'country/:countryId/site/:id',
    canActivate: [AuthguardService],
    component: SitesComponent,
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
    path: 'country/:countryId/site/:id/createList',
    canActivate: [AuthguardService],
    component: AdminNewListComponent,
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
