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
  orginization: string;
  email: string;
  emailConfirm: string;
  password: string;
  passwordConfirm: string;
  constructor(public router: Router, public authInstance: AngularFireAuth, private messageService: MessageService,
              private db: AngularFirestore) { }
  ngOnInit() {
  }

  registerClick() {
    if (this.email === this.emailConfirm) {
      if (this.password === this.passwordConfirm) {
        this.authInstance.auth.createUserWithEmailAndPassword(this.email, this.password).then(reason => {
          this.authInstance.auth.currentUser.sendEmailVerification();
          // Now let's save personal information.
          const userId: string = this.authInstance.auth.currentUser.uid;
          this.db.collection('users').doc(userId).set({
            firstName: this.firstName,
            lastName: this.lastName,
            organization: this.orginization,
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
      } else {
        this.messageService.add({severity: 'error', summary: 'Registration Error', detail: 'Passwords do not match'});
      }
    } else {
      this.messageService.add({severity: 'error', summary: 'Registration Error', detail: 'Emails do not match'});
    }
  }

}
