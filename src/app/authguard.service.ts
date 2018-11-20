import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router, public authInstance: AngularFireAuth) { }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authInstance.auth.currentUser == null || !this.authInstance.auth.currentUser.emailVerified) {
      // TODO come back and tell user they are not authenticated or need to create an account
      console.log('User is not logged in or verified. Denying Access.');
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }

}

