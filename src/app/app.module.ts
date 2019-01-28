import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LandingComponent } from './landing/landing.component';
import { InputTextModule} from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ListboxModule} from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ToastModule } from 'primeng/toast';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AngularFireModule} from '@angular/fire';
import {MessageService} from 'primeng/api';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { SitesComponent } from './sites/sites.component';
import { MarkdownModule } from 'ngx-markdown';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import { ToolbarComponent } from './toolbar/toolbar.component';
import {SidebarModule} from 'primeng/sidebar';
import {InplaceModule} from 'primeng/inplace';
import { SettingsListComponent } from './settings-list/settings-list.component';
import { UploadFormComponent } from './upload-form/upload-form.component';
import {AngularFireStorageModule, StorageBucket} from '@angular/fire/storage';
import {ProgressBarModule} from 'primeng/progressbar';
import {FileUploadModule} from 'primeng/fileupload';
import {FieldsetModule} from 'primeng/fieldset';
import {EditorModule} from 'primeng/editor';
import { OrgsComponent } from './orgs/orgs.component';
import { OrgadminComponent } from './admin/orgAdmin/orgadmin.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { MenuModule } from 'primeng/menu';
import { CountryPageComponent } from './country-page/country-page.component';
import { TripPageComponent } from './trip-page/trip-page.component';
import { OrgPageComponent } from './org-page/org-page.component';
import { OrgsListComponent } from './orgs-list/orgs-list.component';
import { MyOrgsListComponent } from './my-orgs-list/my-orgs-list.component';
import { MyTripsListComponent } from './my-trips-list/my-trips-list.component';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {AccordionModule} from 'primeng/accordion';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LandingComponent,
    ProfileEditComponent,
    SitesComponent,
    ToolbarComponent,
    SettingsListComponent,
    UploadFormComponent,
    OrgsComponent,
    OrgadminComponent,
    ProfileViewComponent,
    CountryPageComponent,
    TripPageComponent,
    OrgPageComponent,
    OrgsListComponent,
    MyOrgsListComponent,
    MyTripsListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    InputTextModule,
    ButtonModule,
    ListboxModule,
    FormsModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    ToastModule,
    BrowserAnimationsModule,
    SidebarModule,
    InplaceModule,
    ProgressBarModule,
    FileUploadModule,
    FieldsetModule,
    EditorModule,
    MenuModule,
    ScrollPanelModule,
    AccordionModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireModule.initializeApp( environment.firebase, 'MissionSupport1'),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MarkdownModule.forRoot()
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
