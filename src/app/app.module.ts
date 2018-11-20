import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
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


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LandingComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    InputTextModule,
    ButtonModule,
    ListboxModule,
    FormsModule,
    AngularFireAuthModule,
    ToastModule,
    BrowserAnimationsModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireModule.initializeApp( environment.firebase, 'MissionSupport1'),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
