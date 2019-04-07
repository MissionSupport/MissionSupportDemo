import { Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import {MessageService} from 'primeng/api';
import { auth } from 'firebase/app';
import {SharedService} from '../service/shared-service.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  time: number; // Time since last email verification

  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;

  loginView = true;

  constructor(public router: Router, public authInstance: AngularFireAuth,
              private messageService: MessageService, private sharedService: SharedService,
              private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
    this.forgotPasswordForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email])
    });
    this.sharedService.scrollPanelHeightToSubtract.emit(0);
  }

  ngOnInit() {
    console.log('User authenticated maybe ', this.authInstance.auth.currentUser);
    this.time = localStorage.getItem('login_time_verify') != null ? +localStorage.getItem('login_time_verify') : 0;
    this.sharedService.hideToolbar.emit(true);
    this.sharedService.canEdit.emit(false);
  }

  async loginClick() {
    if (!this.loginForm.valid) {
      Object.keys(this.loginForm.controls).forEach(field => {
        this.loginForm.controls[field].markAsTouched({onlySelf: true});
      });
    } else {
      try {
        await this.authInstance.auth.setPersistence(auth.Auth.Persistence.SESSION);
        console.log('Auth successfully set!');
      } catch (err) {
        console.log(err);
        this.messageService.add({severity: 'error', summary: 'Login Error',
          detail: 'Failed to log in. Please try again.'});
      }

      try {
        const credential = await this.authInstance.auth.signInWithEmailAndPassword(this.loginForm.get('email').value,
          this.loginForm.get('password').value);
        localStorage.setItem('user', credential.user.uid);

        // Check if user is authenticated.
        if (credential.user.emailVerified) {
          this.router.navigate(['']).catch(reason => {
            console.log('Something went wrong with authguard');
          });
        } else {
          // User is not authenticated.
          this.messageService.add({severity: 'error', summary: 'Login Error',
            detail: 'Email is not verified, please check your email'});

          // If first time or five minutes
          if (this.time === 0 || this.time + 300000 < (new Date()).getTime()) {
            credential.user.sendEmailVerification();
            this.time = new Date().getTime();
            localStorage.setItem('login_time_verify', String(this.time));
          }
          localStorage.removeItem('user');
          this.authInstance.auth.signOut();
        }
      } catch (err) {
        this.messageService.add({severity: 'error', summary: 'Login Error', detail: err});
      }
    }
  }

  forgotPasswordClick() {
    if (this.forgotPasswordForm.valid) {
      // Send password reset to user's email
      this.authInstance.auth.sendPasswordResetEmail(this.forgotPasswordForm.get('email').value).then(() => {
        this.messageService.add({severity: 'info', summary: 'Password Reset',
          detail: 'Sent password reset link to email'});
        this.loginView = !this.loginView;
      }).catch(error => {
        this.messageService.add({severity: 'error', summary: 'Password Reset Error', detail: error});
      });
    }
  }
}
