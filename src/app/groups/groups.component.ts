import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  constructor(public route: ActivatedRoute) {
    this.route.params.subscribe(params => console.log(params)); // Object {}
    console.log('testelelelelelele');
  }

  ngOnInit() {
  }

}
