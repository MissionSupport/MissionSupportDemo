import { Component, OnInit } from '@angular/core';
import {SharedService} from '../globals';

@Component({
  selector: 'app-group-page',
  templateUrl: './org-page.component.html',
  styleUrls: ['./org-page.component.css']
})
export class OrgPageComponent implements OnInit {

  constructor(private sharedService: SharedService) {
    sharedService.hideToolbar.emit(false);
  }

  ngOnInit() {
  }

}
