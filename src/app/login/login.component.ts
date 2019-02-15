import { Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import {MessageService} from 'primeng/api';
import { auth } from 'firebase/app';
import {SharedService} from '../globals';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  time: number; // Time since last email verification
  ngOnInit() {
    console.log('User authenticated maybe ', this.authInstance.auth.currentUser);
    this.time = localStorage.getItem('login_time_verify') != null ? +localStorage.getItem('login_time_verify') : 0;
    this.sharedService.hideToolbar.emit(true);
    this.sharedService.canEdit.emit(false);
    // auto log in user
    this.authInstance.auth.onAuthStateChanged(user => {
      if (user != null) {
        this.router.navigate(['landing']);
      }
    });
  }
  constructor(public router: Router, public authInstance: AngularFireAuth,
              private messageService: MessageService, private sharedService: SharedService) {
  }

  loginClick() {
    if (!(this.email && this.password)) {
      this.messageService.add({severity: 'error', summary: 'Login Error', detail: 'Please log in with both an email and a password.'});
    } else {
      this.authInstance.auth.setPersistence(auth.Auth.Persistence.SESSION).then(() => {
        console.log('Auth successfully set!');
      });

      this.authInstance.auth.signInWithEmailAndPassword(this.email, this.password).then(request => {
        localStorage.setItem('user', request.user.uid);
        // Check if user is authenticated
        if (request.user.emailVerified) {
          this.router.navigate([{outlets: {primary: 'landing' }}]).catch(reason => {
            console.log('Something went wrong with authguard');
          });
          // this.router.navigate([{outlets: {primary: 'landing' , sidebar: 'settingsOptions'}}]).catch(reason => {
          //   console.log('Something went wrong with authguard');
          // });
        } else {
          // User was not authenticated
          this.messageService.add({severity: 'error', summary: 'Login Error', detail: 'Email is not verified, please check your email'});
          if (this.time === 0 || this.time + 300000 < (new Date()).getTime()) { // If first time or five minutes
            request.user.sendEmailVerification();
            this.time = new Date().getTime();
            localStorage.setItem('login_time_verify', String(this.time));
          }
          localStorage.removeItem('user');
          this.authInstance.auth.signOut();
        }
      })
      .catch(err => {
        this.messageService.add({severity: 'error', summary: 'Login Error', detail: err});
      });
    }
  }
}
