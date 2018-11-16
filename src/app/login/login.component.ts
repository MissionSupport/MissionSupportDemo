import { Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  ngOnInit() {
  }
  constructor(public router: Router, public authInstance: AngularFireAuth, private messageService: MessageService) {}

  loginClick() {
    this.authInstance.auth.signInWithEmailAndPassword(this.email, this.password).then(reason => {
      this.router.navigate(['landing']); })
      .catch(err => {
        this.messageService.add({severity: 'error', summary: 'Login Error', detail: err});
        }
      );
  }
}
