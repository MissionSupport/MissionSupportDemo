import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { SharedService } from 'src/app/service/shared-service.service';

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
        json: '{"Hospital Name":"ChecklistTest","Host Name":"John Doe",' +
        '"Host Position at Hospital":"Doctor of Pediatrics","Host Email Address":"john@doe.com",' +
        '"Host Phone Number":"123-456-7890","Total Number of Hospital Beds":"1234",' +
        '"Number of Medical and Surgical Beds":"34","Number of Operating Rooms":"10",' +
        '"Number of Clinic Rooms Available for Surgery":"1","PCAU?":"Yes","Pre-Op?":"Yes"}'
      },
      newChecklist : {
        name: 'Hospital',
        json: '{"Hospital Name":"Test","Host Name":"Jane Doe",' +
        '"Host Position at Hospital":"Doctor of Pediatrics","Host Email Address":"john@doe.com",' +
        '"Host Phone Number":"123-456-7890","Total Number of Hospital Beds":"1234",' +
        '"Number of Medical and Surgical Beds":"34","Number of Operating Rooms":"10",' +
        '"Number of Clinic Rooms Available for Surgery":"1","PCAU?":"Yes","Pre-Op?":"Yes"}'
      },
      site: 'Zana',
      proposedBy: 'Katie Cox',
      timeProposed: 'timeStamp'
    },
    {
      orgChecklist : {
        name: 'Pharmacy and Lab',
        json: '{"Pharmacy Hours - Weekends":"12:00-1:00","Pharmacy Hours - Weekdays":"1:00-2:00",' +
        '"Which antibiotics (PO/IV) do you keep in stock (available 100%)?":' +
        '[{"drugName":"Penicillin V Potassium (Oral Pill)","drugStrength":"250 mg Cap"}],' +
        '"Which analgesics (PO/IV) do you keep in stock (available 100%)?":[],' +
        '"Which general anesthetics do you keep in stock (available 100%)?":[],' +
        '"Which paralytics do you keep in stock (available 100%)?":[],' +
        '"Which hypertensives do you keep in stock (available 100%)?":[],' +
        '"Which vasopressors/inotropes do you keep in stock (available 100%)?":[],' +
        '"Which other drugs do you keep in stock?":' +
        '[{"drugName":"Acetaminophen/oxyCODONE (Oral Pill)","drugStrength":"300-10 mg Tab"},' +
        '{"drugName":"Ibuprofen (Oral Pill)","drugStrength":"100 mg Tab"}],' +
        '"Comments on medication supply.":"","Is there a lab on-site?":"Yes",' +
        '"Lab Capabilities (select all that apply).":["Chem 7","Chem 14 ","CBC","ABG",' +
        '"UA","Blood/Urine Culture"],"Lab Hours - Weekends":"1:00-2:00",' +
        '"Lab Hours - Weekdays":"2:00-3:00","If no lab is available, where do' +
        ' patients get lab work done?":"","Is there a blood bank available on-site?":"Yes",' +
        '"If no blood is available on-site, where is the blood bank?":"",' +
        '"How long does it take to obtain blood products?":"1 hour",' +
        '"Is there imaging on-site?":"Yes","Imaging Capabilities (select all that apply).":' +
        '["X-ray","CT Scan"],"If not, where do patients go for imaging?":"",' +
        '"Comments on imaging.":""}'
      },
      newChecklist : {
        name: 'Pharmacy and Lab',
        json: '{"Pharmacy Hours - Weekends":"12:00-1:00","Pharmacy Hours - Weekdays":"1:00-2:00",' +
        '"Which antibiotics (PO/IV) do you keep in stock (available 100%)?":' +
        '[{"drugName":"Penicillin V Potassium (Oral Pill)","drugStrength":"250 mg Cap"}],' +
        '"Which analgesics (PO/IV) do you keep in stock (available 100%)?":[],' +
        '"Which general anesthetics do you keep in stock (available 100%)?":[],' +
        '"Which paralytics do you keep in stock (available 100%)?":[],' +
        '"Which hypertensives do you keep in stock (available 100%)?":[],' +
        '"Which vasopressors/inotropes do you keep in stock (available 100%)?":[],' +
        '"Which other drugs do you keep in stock?":' +
        '[{"drugName":"Acetaminophen/oxyCODONE (Oral Pill)","drugStrength":"300-10 mg Tab"},' +
        '{"drugName":"Ibuprofen (Oral Pill)","drugStrength":"100 mg Tab"}],' +
        '"Comments on medication supply.":"","Is there a lab on-site?":"Yes",' +
        '"Lab Capabilities (select all that apply).":["Chem 7","Chem 14 ","CBC","ABG",' +
        '"UA","Blood/Urine Culture"],"Lab Hours - Weekends":"1:00-2:00",' +
        '"Lab Hours - Weekdays":"2:00-3:00","If no lab is available, where do' +
        ' patients get lab work done?":"","Is there a blood bank available on-site?":"Yes",' +
        '"If no blood is available on-site, where is the blood bank?":"",' +
        '"How long does it take to obtain blood products?":"1 hour",' +
        '"Is there imaging on-site?":"Yes","Imaging Capabilities (select all that apply).":' +
        '["X-ray","CT Scan"],"If not, where do patients go for imaging?":"",' +
        '"Comments on imaging.":""}'
      },
      site: 'Wakanda',
      proposedBy: 'Daniel Jung',
      timeProposed: 'timeStamp'
    },
  ];

  constructor( public sharedService: SharedService) {
    sharedService.hideToolbar.emit(false);
    sharedService.onPageNav.emit('Admin Dashboard');
    this.sharedService.scrollPanelHeightToSubtract.emit(50);
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
