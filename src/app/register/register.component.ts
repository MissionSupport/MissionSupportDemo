import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  firstName: string;
  lastName: string;
  organization: string;
  email: string;
  emailConfirm: string;
  password: string;
  passwordConfirm: string;

  showPassword: boolean;
  showPasswordConfirm: boolean;
  showPasswordIcon = 'pi pi-eye-slash';
  showPasswordConfirmIcon = 'pi pi-eye-slash';

  constructor(public router: Router, public authInstance: AngularFireAuth, private messageService: MessageService,
              private db: AngularFirestore) { }
  ngOnInit() {
  }

  togglePasswordCheck() {
    this.showPassword = !this.showPassword;
    if (this.showPassword) {
      this.showPasswordIcon = 'pi pi-eye';
    } else {
      this.showPasswordIcon = 'pi pi-eye-slash';
    }
  }

  toggleConfirmPasswordCheck() {
    this.showPasswordConfirm = !this.showPasswordConfirm;
    if (this.showPasswordConfirm) {
      this.showPasswordConfirmIcon = 'pi pi-eye';
    } else {
      this.showPasswordConfirmIcon = 'pi pi-eye-slash';
    }
  }

  registerClick() {
    if (!this.firstName || !this.lastName || !this.organization) {
      this.messageService.add({severity: 'error', summary: 'Registration Error', detail: 'All fields must be set'});
    } else if (this.email === this.emailConfirm) {
      if (this.password === this.passwordConfirm) {
        // Now we want to validate if the password is weak or not
        // this can be easily bypassed by a tech savey user but if they are able to
        // bypass it anyways then they should hopefully have a secure password
        if (!this.passwordValid()) {
          // Password is invalid
          this.messageService.add({severity: 'error', summary: 'Registration Error', detail: 'Password must contain 1 upper and lower' +
              ' case letter, numbers, and be 7 characters long'});
        } else {
          this.authInstance.auth.createUserWithEmailAndPassword(this.email, this.password).then(reason => {
            this.authInstance.auth.currentUser.sendEmailVerification();
            // Now let's save personal information.
            const userId: string = this.authInstance.auth.currentUser.uid;
            this.db.collection('users').doc(userId).set({
              firstName: this.firstName,
              lastName: this.lastName,
              organization: this.organization,
              userId: userId
            }).then(() => {
              console.log('Document written with ID: ', userId);
            }).catch(failure => {
              console.log('Document failed with ID: ', failure);
            });
            this.router.navigate(['']);
          })
            .catch(err => {
                this.messageService.add({severity: 'error', summary: 'Login Error', detail: err});
              }
            );
        }
      } else {
        this.messageService.add({severity: 'error', summary: 'Registration Error', detail: 'Passwords do not match'});
      }
    } else {
      this.messageService.add({severity: 'error', summary: 'Registration Error', detail: 'Emails do not match'});
    }
  }

  passwordValid() {
    const expression = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{7,}$/;
    return expression.test(this.password);
  }
}
