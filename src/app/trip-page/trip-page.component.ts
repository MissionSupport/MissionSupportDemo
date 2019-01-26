import { Component, OnInit } from '@angular/core';
import {SharedService} from '../globals';

@Component({
  selector: 'app-trip-page',
  templateUrl: './trip-page.component.html',
  styleUrls: ['./trip-page.component.css']
})
export class TripPageComponent implements OnInit {

  constructor(private sharedService: SharedService) {
    sharedService.hideToolbar.emit(false);
  }

  ngOnInit() {
  }

}
