import { Injectable, NgZone } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {
  constructor(private router: Router, public authInstance: AngularFireAuth, private ngZone: NgZone) { }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    this.authInstance.auth.onAuthStateChanged(user => {
      if (user != null) {
        // User is signed in
        // localStorage.removeItem('user');
        this.ngZone.run(() => this.router.navigate(['']));
        return false;
      }
    });
    if (!localStorage.getItem('user') && (this.authInstance.auth.currentUser == null ||
      !this.authInstance.auth.currentUser.emailVerified)) {
      // TODO come back and tell user they are not authenticated or need to create an account
      if (this.authInstance.auth.currentUser == null) {
        console.log('User is not logged in.');
      } else {
        console.log('User is not verified.');
      }
      // this.ngZone.run(() => this.router.navigate(['login']));
      return false;
    }
    console.log('User is authenticated.');
    return true;
  }
    // });
    // if (localStorage.getItem('user') && this.authInstance.auth.currentUser
    //   && this.authInstance.auth.currentUser.emailVerified) {
    //   console.log(state.url);
    //   this.ngZone.run(() => this.router.navigate(['/landing']));
    //   return false;
    // }
    // return true;
  }
