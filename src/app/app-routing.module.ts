import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {AuthguardService} from './service/authguard.service';
import {ProfileComponent} from './profile/profile.component';
import {SitesComponent} from './sites/sites.component';
import {UploadFormComponent} from './upload-form/upload-form.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'landing',
    canActivate: [AuthguardService],
    component: LandingComponent
  },
  {
    path: 'profile',
    canActivate: [AuthguardService],
    component: ProfileComponent
  },
  {
    path: 'sites/:id',
    canActivate: [AuthguardService],
    component: SitesComponent
  },
  {
    path: 'upload',
    canActivate: [AuthguardService],
    component: UploadFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
