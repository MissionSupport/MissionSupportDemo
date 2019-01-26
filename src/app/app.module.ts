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
import { ProfileComponent } from './profile/profile.component';
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
import { GroupsComponent } from './groups/groups.component';
import { GroupadminComponent } from './admin/groupadmin/groupadmin.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LandingComponent,
    ProfileComponent,
    SitesComponent,
    ToolbarComponent,
    SettingsListComponent,
    UploadFormComponent,
    GroupsComponent,
    GroupadminComponent,
    ProfileViewComponent
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
    AngularFirestoreModule.enablePersistence(),
    AngularFireModule.initializeApp( environment.firebase, 'MissionSupport1'),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MarkdownModule.forRoot()
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
