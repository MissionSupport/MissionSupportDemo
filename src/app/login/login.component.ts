import { Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import {MessageService} from 'primeng/api';
import { auth } from 'firebase/app';
import {log} from 'util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  ngOnInit() {
    console.log('User authenticated maybe ', this.authInstance.auth.currentUser);
  }
  constructor(public router: Router, public authInstance: AngularFireAuth, private messageService: MessageService) {  }

  loginClick() {
    this.authInstance.auth.setPersistence(auth.Auth.Persistence.SESSION).then(() => {
      console.log('Auth successfully set!');
    });
    this.authInstance.auth.signInWithEmailAndPassword(this.email, this.password).then(reason => {
      localStorage.setItem('user', this.authInstance.auth.currentUser.uid);
      this.router.navigate(['landing']);
    })
      .catch(err => {
        this.messageService.add({severity: 'error', summary: 'Login Error', detail: err});
        }
      );
  }
}
