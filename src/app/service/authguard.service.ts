import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {MessageService} from 'primeng/api';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {
  constructor(private router: Router, public authInstance: AngularFireAuth, private messageService: MessageService) { }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!localStorage.getItem('user') && (this.authInstance.auth.currentUser == null ||
      !this.authInstance.auth.currentUser.emailVerified)) {
      // if (localStorage.getItem('user')) {
      // TODO come back and tell user they are not authenticated or need to create an account
      if (this.authInstance.auth.currentUser == null) {
        console.log('User is not logged in.');
      } else {
        console.log('User is not verified.');
      }
      this.router.navigate(['/']);
      return false;
    }
    console.log('User is authenticated.');
    return true;
  }
}
