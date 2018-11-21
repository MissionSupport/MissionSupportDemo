import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  email: string;
  password: string;
  newPassword: string;
  constructor(public router: Router, public authInstance: AngularFireAuth, private messageService: MessageService) { }

  ngOnInit() {
    this.authInstance.auth.onAuthStateChanged(user => {
      this.email = user.email;
      // TODO: this function only updates the email text input field after being clicked on. Needs to be fixed.
    });
  }

  saveClick(name: string) {
    const user = this.authInstance.auth.currentUser;
    if (name === 'email') {
      user.updateEmail(this.email).then(() => {
        // Let's resend an authentication
        user.sendEmailVerification().then(() => {
          // Success, now alert user the email verification was sent
          console.log('Success email updated.');
          this.messageService.add({severity: 'error', summary: 'Email Updated', detail:
              'Email was successfully updated'});
        }).catch(error => {
          console.log('Error with sending verification email ', error);
        });
      }).catch(error => {
        if (error['code'] === 'auth/invalid-email') {
          // invalid email
          this.messageService.add({severity: 'error', summary: 'Email Error', detail: 'Email is invalid'});
        } else if (error['code'] === 'auth/email-already-in-use') {
          // email already in use
          this.messageService.add({severity: 'error', summary: 'Email Error', detail: 'Email is already in use'});
        } else if (error['code'] === 'auth/requires-recent-login') {
          // TODO: come back and have user retype in password in order to update email
          // user.reauthenticateAndRetrieveDataWithCredential(EmailAuthProvider.credential(user.auth.email, password));
        }
      });
    } else if (name === 'password') {
      if (this.password === this.newPassword) {
        user.updatePassword(this.password).then(() => {
          this.messageService.add({severity: 'error', summary: 'Password Changed', detail:
              'The password was successfully updated'});
        }).catch(error => {
          // Failed to update
          if (error['code]'] === 'auth/weak-password') {
            // Weak password
            this.messageService.add({severity: 'error', summary: 'Weak Password', detail:
                'The password you used was too weak, please try a different one'});
          } else if (error['code'] === 'auth/requires-recent-login') {
            // TODO: come back and have user reauthenticate.
          }
        });
      }
    }
  }
}
