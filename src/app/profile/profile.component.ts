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
  constructor(public router: Router, public authInstance: AngularFireAuth, private messageService: MessageService) { }

  ngOnInit() {
  }

  saveClick() {
  }
}
