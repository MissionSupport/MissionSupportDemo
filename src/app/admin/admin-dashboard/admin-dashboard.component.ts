import { Component, OnInit } from '@angular/core';
import {SharedService} from '../../globals';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  original = 'Hello my name is Katie and I like Doggos. Doggos are cute. dodododo daddy shark sososos';
  proposed = 'Hello my name is Katie and I LOVE Doggos & Baby Sharku do do do. Moma Shark dodododo';
  items: MenuItem[];
  viewUserApprovals;
  viewWikiEdits;
  viewPendingChecklistEdits;
  viewNewCountrySite;
  pendingUsers = [
    {fistName: 'Katie', lastName: 'Cox', email: 'katy@aol.com', org: 'Gatech'},
    {fistName: 'Daniel', lastName: 'Jung', email: 'DJung@aol.com', org: 'Gatech'},
    {fistName: 'Josh', lastName: 'Philliber', email: 'jPh@aol.com', org: 'Gatech'},
    {fistName: 'Sri', lastName: 'Bhat', email: 'katy@aol.com', org: 'Gatech'},
    {fistName: 'Rourke', lastName: 'Rabinowitz', email: 'rr@aol.com', org: 'Gatech'}
  ];

  pendingEdits = [
    {original: 'hi i am katie', new: 'hi i am Katie Cox', section: 'Communication',
      wiki: 'USA', proposedBy: 'Katie Cox', timeProposed: 'timeStamp'},
    {original: 'BabyShark Doddod do', new: 'BabyShark Dodododo', section: 'Baby Sharks',
      wiki: 'USA', proposedBy: 'Katie Cox', timeProposed: 'timeStamp'},
    {original: 'If I were a shark I would want to cuddle humans', new: 'If I were a shark I would want to cuddle humans.' +
        ' But why humans no wanna cuddle me?', section: 'Baby Sharks With emotional problems blog',
      wiki: 'USA', proposedBy: 'Katie Cox', timeProposed: 'timeStamp'},
  ];

  pendingChecklistEdits = [
    {
      orgChecklist : {
        name: 'Hospital',
        json: '{"textBox1":{"question":"Hospital Name","value":"Emory"},"textBox2":{"question":"Name of Host",' +
          '"value":"Vikas O\'Reilly-Shah"},"textBox3":{"question":"Position at Hospital","value":"Anesthesiologist"},' +
          '"textBox4":{"question":"Host Email Address","value":"EmailBasic@aol.com"},"textBox5":{"question":"Host Phone' +
          'Number","value":"(555)867-5309"},"textBox6":{"question":"Number of Beds (Total Hospital)","value":"1,043"},' +
          '"textBox7":{"question":"Number of Med/Surg Beds","value":"204"},"textBox8":{"question":"Number of Operating Rooms",' +
          '"value":"26"},"textBox9":{"question":"Number of Clinic Rooms (Available for surgery)","value":"32"},' +
          '"radio1":{"question":"PCAU?","value":"Yes"},"radio2":{"question":"Pre-op?","value":"No"}}'
      },
      newChecklist : {
        name: 'Hospital',
        json: '{"textBox1":{"question":"Hospital Name","value":"Katies Place"},"textBox2":{"question":"Name of Host",' +
          '"value":"Vikas O\'Reilly-Shah"},"textBox3":{"question":"Position at Hospital","value":"Anesthesiologist"},' +
          '"textBox4":{"question":"Host Email Address","value":"EmailBasic@aol.com"},"textBox5":{"question":"Host Phone' +
          'Number","value":"(555)867-5309"},"textBox6":{"question":"Number of Beds (Total Hospital)","value":"1,072"},' +
          '"textBox7":{"question":"Number of Med/Surg Beds","value":"204"},"textBox8":{"question":"Number of Operating Rooms",' +
          '"value":"26"},"textBox9":{"question":"Number of Clinic Rooms (Available for surgery)","value":"32"},' +
          '"radio1":{"question":"PCAU?","value":"No"},"radio2":{"question":"Pre-op?","value":"No"}}'
      },
      site: 'Zana',
      proposedBy: 'Katie Cox',
      timeProposed: 'timeStamp'
    },
    {
      orgChecklist : {
        name: 'Pharmacy',
        json: '{"textBox1":{"question":"Hospital Name","value":"Emory"},"textBox2":{"question":"Name of Host",' +
          '"value":"Vikas O\'Reilly-Shah"},"textBox3":{"question":"Position at Hospital","value":"Anesthesiologist"},' +
          '"textBox4":{"question":"Host Email Address","value":"EmailBasic@aol.com"},"textBox5":{"question":"Host Phone' +
          'Number","value":"(555)867-5309"},"textBox6":{"question":"Number of Beds (Total Hospital)","value":"1,043"},' +
          '"textBox7":{"question":"Number of Med/Surg Beds","value":"27"},"textBox8":{"question":"Number of Operating Rooms",' +
          '"value":"26"},"textBox9":{"question":"Number of Clinic Rooms (Available for surgery)","value":"32"},' +
          '"radio1":{"question":"PCAU?","value":"Yes"},"radio2":{"question":"Pre-op?","value":"No"}}'
      },
      newChecklist : {
        name: 'Pharmacy',
        json: '{"textBox1":{"question":"Hospital Name","value":"wazzup"},"textBox2":{"question":"Name of Host",' +
          '"value":"doggo"},"textBox3":{"question":"Position at Hospital","value":"Anesthesiologist"},' +
          '"textBox4":{"question":"Host Email Address","value":"Katy@aol.com"},"textBox5":{"question":"Host Phone' +
          'Number","value":"(555)867-5309"},"textBox6":{"question":"Number of Beds (Total Hospital)","value":"1,072"},' +
          '"textBox7":{"question":"Number of Med/Surg Beds","value":"204"},"textBox8":{"question":"Number of Operating Rooms",' +
          '"value":"26"},"textBox9":{"question":"Number of Clinic Rooms (Available for surgery)","value":"32"},' +
          '"radio1":{"question":"PCAU?","value":"No"},"radio2":{"question":"Pre-op?","value":"No"}}'
      },
      site: 'Wakanda',
      proposedBy: 'Daniel Jung',
      timeProposed: 'timeStamp'
    },
  ];

  constructor( public sharedService: SharedService) {
    sharedService.hideToolbar.emit(false);
    sharedService.onPageNav.emit('Admin Dashboard');
    this.viewUserApprovals = true;
  }

  ngOnInit() {
    this.items = [
      {label: 'Pending User Approvals', icon: 'pi pi-fw pi-user-plus', command: event1 => {
          this.viewUserApprovals = true;
          this.viewNewCountrySite = false;
          this.viewPendingChecklistEdits = false;
          this.viewWikiEdits = false;
        }},
      {label: 'Pending Wiki Edits', icon: 'pi pi-fw pi-pencil', command: event1 => {
          this.viewUserApprovals = false;
          this.viewNewCountrySite = false;
          this.viewPendingChecklistEdits = false;
          this.viewWikiEdits = true;
        }},
      {label: 'Pending Checklist Edits', icon: 'pi pi-fw pi-list', command: event1 => {
          this.viewUserApprovals = false;
          this.viewNewCountrySite = false;
          this.viewPendingChecklistEdits = true;
          this.viewWikiEdits = false;
        }},
      {label: 'New Country Site', icon: 'pi pi-fw pi-plus', command: event1 => {
          this.viewUserApprovals = false;
          this.viewNewCountrySite = true;
          this.viewPendingChecklistEdits = false;
          this.viewWikiEdits = false;
        }}
    ];
  }

  updateVersion(newText, index, edit) {
    console.log(newText);
    console.log(edit);
    this.pendingEdits.splice(index, 1);
    this.pendingEdits = this.pendingEdits;
  }

  approve(user, index) {
    // TODO wire up
    console.log(user);
    this.pendingUsers.splice(index, 1);
    this.pendingUsers = this.pendingUsers;
  }

  deny(user, index) {
    // ToDO wire up
    console.log(user);
    this.pendingUsers.splice(index, 1);
    this.pendingUsers = this.pendingUsers;
  }

  updateChecklistVersion(updatedJson, i, edit) {
    console.log(updatedJson);
    this.pendingChecklistEdits.splice(i, 1);
    this.pendingChecklistEdits = this.pendingChecklistEdits;
  }

}
