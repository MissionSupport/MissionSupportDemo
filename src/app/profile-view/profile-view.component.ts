import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Site} from '../interfaces/site';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserSettings} from '../interfaces/user-settings';
import {UserPreferences} from '../interfaces/user-preferences';
import {Router} from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
  organization: string;
  orgs;
  teams;
  groups;
  isAdmin;

  editingEmail: boolean;
  newEmail: string;

  changingPassword: boolean;
  newPassword: string;
  confirmNewPassword: string;

  constructor(public authInstance: AngularFireAuth, private readonly db: AngularFirestore,
    public router: Router, public messageService: MessageService) {
    this.authInstance.auth.onAuthStateChanged(user => {
      this.email = user.email;
      this.id = user.uid;
      console.log(this.id);
      this.db.doc(`users/${this.id}`).valueChanges().subscribe((data: UserSettings) => {
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.organization = data.organization;
        // this.orgs = data.orgs;
      });
      this.db.doc(`user_preferences/${this.id}`).valueChanges().subscribe((data: UserPreferences) => {
        this.isAdmin = data.admin;
        // this.sites = data.sites;
      });
      // TODO: this function only updates the email text input field after being clicked on. Needs to be fixed.
    });


    // this.db.doc(`orgs/${this.id}`).valueChanges().subscribe((data: UserPreferences) => {
    //   console.log(data);
    //   this.isAdmin = data.admin;
    //   this.sites = data.sites;
    // });

  }

  ngOnInit() {
    // this.authInstance.auth.onAuthStateChanged(user => {
    //   this.email = user.email;
    //   this.id = user.uid;
    //   // TODO: this function only updates the email text input field after being clicked on. Needs to be fixed.
    // });
  }

  updateEmail() {
    const user = this.authInstance.auth.currentUser;
    user.updateEmail(this.newEmail).then(() => {
      user.sendEmailVerification().then(() => {
        console.log('Success: Email updated.');
        this.messageService.add({severity: 'info', summary: 'Email Updated', detail:
        'Email was successfully updated - please check your email for a verification message.',
        key: 'profile-view'});
        this.email = this.newEmail;
      })
      .catch(error => {
        console.log('Error with sending verification email ', error);
        this.messageService.add({severity: 'error', summary: 'Unsuccessful', detail:
              'Error with sending verification email', key: 'profile-view'});
      });
    })
    .catch(error => {
      if (error['code'] === 'auth/invalid-email') {
        // invalid email
        this.messageService.add({severity: 'error', summary: 'Email Error',
        detail: 'Email is invalid', key: 'profile-view'});
      } else if (error['code'] === 'auth/email-already-in-use') {
        // email already in use
        this.messageService.add({severity: 'error', summary: 'Email Error',
        detail: 'Email is already in use', key: 'profile-view'});
      } else if (error['code'] === 'auth/requires-recent-login') {
        // TODO: come back and have user retype in password in order to update email
        // user.reauthenticateAndRetrieveDataWithCredential(EmailAuthProvider.credential(user.auth.email, password));
      }
    });
    this.editingEmail = false;
  }

  changePassword() {
    const user = this.authInstance.auth.currentUser;
    if (!(this.passwordValid())) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Password must contain 1 upper and lower' +
              ' case letter, numbers, and be 7 characters long', key: 'profile-view'});
    } else if (this.newPassword !== this.confirmNewPassword) {
      this.messageService.add({severity: 'error', summary: 'Error',
      detail: 'Confirm password and password do not match.', key: 'profile-view'});
    } else {
      user.updatePassword(this.newPassword).then(() => {
        this.messageService.add({severity: 'success', summary: 'Password Changed', detail:
              'The password was successfully updated', key: 'profile-view'});
      })
      .catch(error => {
        // Failed to update
        if (error['code]'] === 'auth/weak-password') {
          // Weak password
          this.messageService.add({severity: 'error', summary: 'Weak Password', detail:
              'The password you used was too weak, please try a different one', key: 'profile-view'});
        } else if (error['code'] === 'auth/requires-recent-login') {
          // TODO: come back and have user reauthenticate.
        }
      });
    }

    this.changingPassword = false;
  }

  private passwordValid() {
    const expression = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{7,}$/;
    return expression.test(this.newPassword);
  }

}
