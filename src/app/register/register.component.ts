import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email: string;
  emailConfirm: string;
  password: string;
  passwordConfirm: string;
  constructor(public router: Router, public authInstance: AngularFireAuth, private messageService: MessageService) { }
  ngOnInit() {
  }

  registerClick() {
    if (this.email === this.emailConfirm) {
      if (this.password === this.passwordConfirm) {
        this.authInstance.auth.createUserWithEmailAndPassword(this.email, this.password).then(reason => {
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
