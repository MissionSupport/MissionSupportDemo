import { Injectable, NgZone } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {
  user;
  constructor(private router: Router, private ngZone: NgZone, public authInstance: AngularFireAuth) {
    this.authInstance.auth.onAuthStateChanged(user => {
      if (!user) {
        this.user = undefined;
      } else {
        this.user = user;
      }
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.user) {
      this.router.navigate(['/landing']);
      return false;
    } else {
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
}
