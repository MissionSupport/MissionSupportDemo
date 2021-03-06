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
import { MyTripsListComponent } from './my-trips-list/my-trips-list.component';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {AccordionModule} from 'primeng/accordion';
import {ChecklistCreationPageComponent} from './checklist-fillOut-page/checklist-creation-page.component';
import {TriStateCheckboxModule} from 'primeng/tristatecheckbox';
import {CheckboxModule} from 'primeng/checkbox';
import {InputMaskModule} from 'primeng/inputmask';
import {RadioButtonModule} from 'primeng/radiobutton';
import { ReactiveFormsModule } from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {KeyFilterModule} from 'primeng/keyfilter';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { SiteSearchComponent } from './site-search/site-search.component';
import {DialogModule} from 'primeng/dialog';
import {AutoCompleteModule} from 'primeng/primeng';
import {HttpClientModule} from '@angular/common/http';
import { BottomTabsComponent } from './bottom-tabs/bottom-tabs.component';
import {MultiSelectModule} from 'primeng/multiselect';
import {TableModule} from 'primeng/table';
import {PreDefined} from './globals';
import { AdminNewListComponent } from './admin/admin-new-list/admin-new-list.component';
import { DiffEditComponent } from './admin/diff-edit/diff-edit.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { DropdownQuestionComponent } from './checklist/dropdown-question.component';
import { FreeResponseQuestionComponent } from './checklist/free-response-question.component';
import { ImageQuestionComponent } from './checklist/image-question.component';
import { MedicineMultipleCheckboxQuestionComponent } from './checklist/medicine-multiple-checkbox-question.component';
import { MedicineMultipleTextboxQuestionComponent } from './checklist/medicine-multiple-textbox-question.component';
import { MedicineTextboxQuestionComponent } from './checklist/medicine-textbox-question.component';
import { MultipleSelectQuestionComponent } from './checklist/multiple-select-question.component';
import { RadioButtonQuestionComponent } from './checklist/radio-button-question.component';
import { TextboxQuestionComponent } from './checklist/textbox-question.component';
import { ChecklistQuestionDirective } from './checklist/checklist-question.directive';
import { MessageModule } from 'primeng/message';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { ChecklistVersionComponent } from './admin/checklist-version/checklist-version.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LandingComponent,
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
    MyTripsListComponent,
    ChecklistCreationPageComponent,
    SiteSearchComponent,
    BottomTabsComponent,
    AdminNewListComponent,
    DiffEditComponent,
    ChecklistComponent,
    DropdownQuestionComponent,
    FreeResponseQuestionComponent,
    ImageQuestionComponent,
    MedicineMultipleCheckboxQuestionComponent,
    MedicineMultipleTextboxQuestionComponent,
    MedicineTextboxQuestionComponent,
    MultipleSelectQuestionComponent,
    RadioButtonQuestionComponent,
    TextboxQuestionComponent,
    ChecklistQuestionDirective,
    AdminDashboardComponent,
    ChecklistVersionComponent,
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
    ToolbarModule,
    CardModule,
    TriStateCheckboxModule,
    CheckboxModule,
    InputMaskModule,
    RadioButtonModule,
    ReactiveFormsModule,
    DropdownModule,
    KeyFilterModule,
    TriStateCheckboxModule,
    CheckboxModule,
    InputMaskModule,
    RadioButtonModule,
    ReactiveFormsModule,
    DropdownModule,
    KeyFilterModule,
    PasswordModule,
    DialogModule,
    AutoCompleteModule,
    HttpClientModule,
    MultiSelectModule,
    TableModule,
    MessageModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireModule.initializeApp( environment.firebase, 'MissionSupport1'),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MarkdownModule.forRoot()
  ],
  entryComponents: [
    DropdownQuestionComponent,
    FreeResponseQuestionComponent,
    ImageQuestionComponent,
    MedicineMultipleCheckboxQuestionComponent,
    MedicineMultipleTextboxQuestionComponent,
    MedicineTextboxQuestionComponent,
    MultipleSelectQuestionComponent,
    RadioButtonQuestionComponent,
    TextboxQuestionComponent
  ],
  providers: [MessageService, PreDefined],
  bootstrap: [AppComponent]
})
export class AppModule { }
