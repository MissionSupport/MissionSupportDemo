import { Component, OnInit } from '@angular/core';
import {PreDefined, SharedService} from '../globals';
import {Router} from '@angular/router';

@Component({
  selector: 'app-group-page',
  templateUrl: './org-page.component.html',
  providers: [PreDefined],
  styleUrls: ['./org-page.component.css']
})
export class OrgPageComponent implements OnInit {
  orgName: string;
  markdown: string;
  viewWiki = true;
  viewTeams = false;
  viewTrips = false;
  sections = [];
  editText = [];
  hideme = [];
  footerHeight = 45;
  editMode = false;
  canEdit = false;
  // trips: Trip[];
  trips = [
    {
      id: 'trip1',
      tripName: 'Emory Team 12 - 7.12.18'
    },
    {
      id: 'trip2',
      tripName: 'Emory Team 5 - 5.16.17'
    },
    {
      id: 'trip3',
      tripName: 'Emory Team 9 - 9.07.15'
    },
  ];
  teams = [
    {
      id: 'team1',
      teamName: 'Emory 12',
      teamMembers: ['Bob', 'Nancy', 'Drew']
    },
    {
      id: 'team2',
      teamName: 'Emory 5',
      teamMembers: ['Katie', 'Daniel', 'Shark']
    },
    {
      id: 'team3',
      teamName: 'Emory 9',
      teamMembers: ['Do', 'DodoDo', 'Shark']
    },
  ];
  selectedTrip;

  constructor(private sharedService: SharedService, public router: Router, private preDef: PreDefined) {
    sharedService.hideToolbar.emit(false);
    sharedService.onPageNav.emit('Org Name');
    for (let element of preDef.wikiOrg) {
      this.sections.push({title: element.title, markup: element.markup});
      // this.editText.push({title: element.title, markup: element.markup});
    }
  }

  ngOnInit() {
  }

  tripClick(): void {
    // console.log(this.selectedSite);
    this.router.navigate(['trip/' + this.selectedTrip.id]);
    // this.router.navigate(['/temp']);
  }

  submitEdit(title, index): void {
  }

}
