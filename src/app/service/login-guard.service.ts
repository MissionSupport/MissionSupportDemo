import { Injectable, NgZone } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

  constructor(private router: Router, private ngZone: NgZone, public authInstance: AngularFireAuth) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('user') && this.authInstance.auth.currentUser && this.authInstance.auth.currentUser.emailVerified) {
      console.log(state.url);
      this.ngZone.run(() => this.router.navigate(['/landing']));
      return false;
    }
    return true;
  }
}
