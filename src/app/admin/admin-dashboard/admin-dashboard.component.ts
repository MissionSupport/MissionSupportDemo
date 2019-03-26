import {Component, OnDestroy, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import { SharedService } from 'src/app/service/shared-service.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {Subject} from 'rxjs';
import {flatMap, map, take, takeUntil} from 'rxjs/operators';
import {UserPreferences} from '../../interfaces/user-preferences';
import {UserSettings} from '../../interfaces/user-settings';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import {Country} from '../../interfaces/country';
import {EditTask} from '../../interfaces/edit-task';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  original = 'Hello my name is Katie and I like Doggos. Doggos are cute. dodododo daddy shark sososos';
  proposed = 'Hello my name is Katie and I LOVE Doggos & Baby Sharku do do do. Moma Shark dodododo';
  items: MenuItem[];
  viewUserApprovals;
  viewWikiEdits;
  viewPendingChecklistEdits;
  viewNewCountrySite;
  unsubscribeSubject: Subject<void> = new Subject<void>();
  pendingUsers = [];

  pendingEdits = [
    {original: 'hi i am katie', new: 'hi i am Katie Cox', section: 'Communication',
      wiki: 'USA', proposedBy: 'Katie Cox', timeProposed: 'timeStamp'},
    {original: 'BabyShark Doddod do', new: 'BabySharhik Dodododo hi', section: 'Baby Sharks',
      wiki: 'USA', proposedBy: 'Katie Cox', timeProposed: 'timeStamp'},
    {original: 'BabyShark Doddod do', new: 'BabySharhik dsfsdfdDodododo hi', section: 'Baby Sharks',
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

  constructor( public sharedService: SharedService, private readonly db: AngularFirestore) {
    sharedService.hideToolbar.emit(false);
    sharedService.onPageNav.emit('Admin Dashboard');
    this.viewUserApprovals = true;
  }

  ngOnInit() {
    // Code for dealing with pending users
    this.db.collection(`user_preferences`, ref => ref.where('verified', '==', false))
      .valueChanges().pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(async (users: UserPreferences[]) => {
        this.pendingUsers = await Promise.all(users.map(async (user: UserPreferences) => {
          const id = user.id;
          // TODO Get email
          // const x = await this.db.doc(`emails/${id}`).get().toPromise();
          const details: UserSettings = await this.db.doc(`users/${id}`)
            .valueChanges().pipe(map((x: UserSettings) => {
              return x;
          }), take(1)).toPromise();
          return {
            id: id,
            firstName: details.firstName,
            lastName: details.lastName,
            email: '',
            org: ''
          };
        }));
      });
    // Code for dealing with pending wiki edits
    this.db.collection('countries').valueChanges().pipe(takeUntil(this.unsubscribeSubject))
      .subscribe((countries: Country[]) => {
        const array = {};
        for (const country of countries) {
          array[country.id] = country;
        }
        this.db.collection('edits').valueChanges().pipe(takeUntil(this.unsubscribeSubject))
          .subscribe((edits: EditTask[]) => {
            const values = [];
            for (const edit of edits) {
              const json = {
                original: this.db.doc(`countries/${edit.country_id}/wiki/${array[edit.country_id].current}`).valueChanges()
                  .pipe(map(d => {
                    return d[edit.title];
                    }), take(1)).toPromise(),
                new: edit.markup,
                section: edit.title,
                wiki: array[edit.country_id].countryName,
                proposedBy: edit.email,
                timeProposed: edit.date
              };
              values.push(json);
            }
            this.pendingEdits = values;
          });
      });
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
    this.pendingUsers.splice(index, 1);
    this.pendingUsers = this.pendingUsers;
    // Take user and change status.
    this.db.doc(`user_preferences/${user.id}`).update({verified: true}).catch(() => {
      console.log('There was a problem with updating user verification status');
    });
  }

  deny(user, index) {
    this.pendingUsers.splice(index, 1);
    this.pendingUsers = this.pendingUsers;
    this.db.doc(`user_preferences/${user.id}`).update({verified: firebase.firestore.FieldValue.delete()})
      .catch(() => {
      console.log('There was a problem with updating user verification status');
    });
  }

  updateChecklistVersion(updatedJson, i, edit) {
    console.log(updatedJson);
    this.pendingChecklistEdits.splice(i, 1);
    this.pendingChecklistEdits = this.pendingChecklistEdits;
  }

  ngOnDestroy(): void {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

}
