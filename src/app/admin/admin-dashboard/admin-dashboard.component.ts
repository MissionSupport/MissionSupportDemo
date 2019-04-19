import {AfterContentInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MenuItem} from 'primeng/api';
import { SharedService } from 'src/app/service/shared-service.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable, Subject} from 'rxjs';
import {flatMap, map, take, takeUntil} from 'rxjs/operators';
import {UserPreferences} from '../../interfaces/user-preferences';
import {UserSettings} from '../../interfaces/user-settings';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import {Country} from '../../interfaces/country';
import {EditTask} from '../../interfaces/edit-task';
import * as d3 from 'd3';
import {drag} from 'd3';
import {Topology} from 'topojson-specification';
import {feature} from 'topojson';
import {FeatureCollection} from 'geojson';
import {Site} from '../../interfaces/site';
import {ListboxModule} from 'primeng/listbox';
import {PreDefined} from '../../globals';
import {Trip} from '../../interfaces/trip';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy, AfterContentInit {
  @ViewChild('listBoxNon') listBoxNon: ListboxModule;
  @ViewChild('listBox') listBox: ListboxModule;
  original = 'Hello my name is Katie and I like Doggos. Doggos are cute. dodododo daddy shark sososos';
  proposed = 'Hello my name is Katie and I LOVE Doggos & Baby Sharku do do do. Moma Shark dodododo';
  items: MenuItem[];
  viewUserApprovals;
  viewWikiCountryEdits;
  viewPendingChecklistEdits;
  viewNewCountrySite;
  viewWikiSiteEdits;
  unsubscribeSubject: Subject<void> = new Subject<void>();
  pendingUsers: Observable<any[]>;

  pendingCountryEdits: Observable<any[]>;
  pendingSiteEdits: Observable<any[]>;
  existingCountries: Country[] = [];
  unInitiatedCountries: Country[] = [];
  countrySub;
  selectedCountries = [];
  selectedDeleteCountries = [];

  width = 1024;
  height = 600;
  minx = 0;
  miny = 0;
  scaleFactor = 200;
  svg: d3.Selection<SVGSVGElement, {}, HTMLElement, any>;

  pendingChecklistEdits = [
    {
      orgChecklist: {
        name: 'Hospital',
        json: '{"Hospital Name":"ChecklistTest","Host Name":"John Doe",' +
          '"Host Position at Hospital":"Doctor of Pediatrics","Host Email Address":"john@doe.com",' +
          '"Host Phone Number":"123-456-7890","Total Number of Hospital Beds":"1234",' +
          '"Number of Medical and Surgical Beds":"34","Number of Operating Rooms":"10",' +
          '"Number of Clinic Rooms Available for Surgery":"1","PCAU?":"Yes","Pre-Op?":"Yes"}'
      },
      newChecklist: {
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
      orgChecklist: {
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
      newChecklist: {
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

  constructor(public sharedService: SharedService, private readonly db: AngularFirestore, private preDef: PreDefined) {
    sharedService.hideToolbar.emit(false);
    sharedService.onPageNav.emit('Admin Dashboard');
    this.sharedService.scrollPanelHeightToSubtract.emit(50);
    this.viewUserApprovals = true;
    // Code to get Countries
    this.countrySub = this.db.collection<Country>('countries').valueChanges()
      .subscribe(ctries => {
        this.existingCountries = ctries.filter(c => c.current);
        this.unInitiatedCountries = ctries.filter(c => !c.current);
      });
  }

  ngOnInit() {
    // Code for dealing with pending users
    this.db.collection(`user_preferences`, ref => ref.where('verified', '==', false))
      .valueChanges().pipe(takeUntil(this.unsubscribeSubject))
      .subscribe(async (users: UserPreferences[]) => {
        this.pendingUsers = this.db.collection(`users`).valueChanges().pipe(map((usettings: UserSettings[]) => {
          const data = usettings.filter(x => users.map(d => d.id).includes(x.userId));
          const array = [];
          for (const details of data) {
            array.push({
              id: details.userId,
              firstName: details.firstName,
              lastName: details.lastName,
              email: '',
              org: details.organization
            });
          }
          return array;
        }, takeUntil(this.unsubscribeSubject)));
      });
    // Code for dealing with pending wiki edits
    this.pendingCountryEdits = this.db.collection('edits', ref => ref.where('type', '==', 'country'))
      .valueChanges().pipe(flatMap((edits: EditTask[]) => {
        return this.db.collection('countries').valueChanges().pipe(flatMap((countries: Country[]) => {
          const array = countries.filter(c => edits.map(e => e.owner_id).includes(c.id));
          return this.db.collection('wiki').snapshotChanges().pipe(map((wikis: any[]) => {
            const wik = wikis.filter(w => array.map(a => a.current).includes(w.payload.doc.id));
            const temp = wik.map(m => {
              const json = {};
              json[m.payload.doc.id] = m.payload.doc.data();
              return json;
            });
            const wikiMapping = {};
            for (const x of temp) {
              for (const k in x) {
                if (x.hasOwnProperty(k)) {
                  wikiMapping[k] = x[k];
                }
              }
            }
            const cons = {};
            for (const country of countries) {
              cons[country.id] = country;
            }
            const values = [];
            for (const edit of edits) {
              let mapping = wikiMapping[cons[edit.owner_id].current][edit.title];
              if (mapping == null) {
                mapping = '';
              }
              const json = {
                original: mapping,
                new: edit.markup,
                section: edit.title,
                wiki: cons[edit.owner_id].countryName,
                proposedBy: edit.email,
                timeProposed: edit.date,
                edit: edit
              };
              values.push(json);
            }
            return values;
          }), takeUntil(this.unsubscribeSubject));
        }), takeUntil(this.unsubscribeSubject));
      }));
    this.pendingSiteEdits = this.db.collection('edits', ref => ref.where('type', '==', 'site'))
      .valueChanges().pipe(flatMap((edits: EditTask[]) => {
        return this.db.collection('sites').valueChanges().pipe(flatMap((sites: Site[]) => {
          const array = sites.filter(c => edits.map(e => e.owner_id).includes(c.id));
          return this.db.collection('wiki').snapshotChanges().pipe(map((wikis: any[]) => {
            const wik = wikis.filter(w => array.map(a => a.current).includes(w.payload.doc.id));
            const temp = wik.map(m => {
              const json = {};
              json[m.payload.doc.id] = m.payload.doc.data();
              return json;
            });
            const wikiMapping = {};
            for (const x of temp) {
              for (const k in x) {
                if (x.hasOwnProperty(k)) {
                  wikiMapping[k] = x[k];
                }
              }
            }
            const sits = {};
            for (const site of sites) {
              sits[site.id] = site;
            }
            const values = [];
            for (const edit of edits) {
              let mapping = wikiMapping[sits[edit.owner_id].current][edit.title];
              if (mapping == null) {
                mapping = '';
              }
              const json = {
                original: mapping,
                new: edit.markup,
                section: edit.title,
                wiki: sits[edit.owner_id].siteName,
                proposedBy: edit.email,
                timeProposed: edit.date,
                edit: edit
              };
              values.push(json);
            }
            return values;
          }), takeUntil(this.unsubscribeSubject));
        }), takeUntil(this.unsubscribeSubject));
      }));
    this.items = [
      {
        label: 'Pending User Approvals', icon: 'pi pi-fw pi-user-plus', command: event1 => {
          this.viewUserApprovals = true;
          this.viewNewCountrySite = false;
          this.viewPendingChecklistEdits = false;
          this.viewWikiCountryEdits = false;
          this.viewWikiSiteEdits = false;
        }
      },
      {
        label: 'Pending Country Wiki Edits', icon: 'pi pi-fw pi-pencil', command: event1 => {
          this.viewUserApprovals = false;
          this.viewNewCountrySite = false;
          this.viewPendingChecklistEdits = false;
          this.viewWikiCountryEdits = true;
          this.viewWikiSiteEdits = false;
        }
      },
      {
        label: 'Pending Site Wiki Edits', icon: 'pi pi-fw pi-pencil', command: event1 => {
          this.viewUserApprovals = false;
          this.viewNewCountrySite = false;
          this.viewPendingChecklistEdits = false;
          this.viewWikiCountryEdits = false;
          this.viewWikiSiteEdits = true;
        }
      },
      {
        label: 'Pending Checklist Edits', icon: 'pi pi-fw pi-list', command: event1 => {
          this.viewUserApprovals = false;
          this.viewNewCountrySite = false;
          this.viewPendingChecklistEdits = true;
          this.viewWikiCountryEdits = false;
          this.viewWikiSiteEdits = false;
        }
      },
      {
        label: 'New Country Site', icon: 'pi pi-fw pi-plus', command: event1 => {
          this.viewUserApprovals = false;
          this.viewNewCountrySite = true;
          this.viewPendingChecklistEdits = false;
          this.viewWikiCountryEdits = false;
          this.viewWikiSiteEdits = false;
        }
      }
    ];
  }

  updateCountryVersion(newText, index, edit) {
    console.log(newText);
    console.log(edit);
    // this.pendingCountryEdits.splice(index, 1);
    this.pendingCountryEdits = this.pendingCountryEdits;
  }

  updateSiteVersion(newText, index, edit) {
    console.log(newText);
    console.log(edit);
    // this.pendingCountryEdits.splice(index, 1);
    this.pendingSiteEdits = this.pendingSiteEdits;
  }

  approve(user, index) {
    // this.pendingUsers.splice(index, 1);
    this.pendingUsers = this.pendingUsers;
    // Take user and change status.
    this.db.doc(`user_preferences/${user.id}`).update({verified: true}).catch(() => {
      console.log('There was a problem with updating user verification status');
    });
  }

  deny(user, index) {
    // this.pendingUsers.splice(index, 1);
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

  createGeneric() {
    // Now save to the database
    this.selectedCountries.forEach(c => {
      const countryId = c.id;
      const wikiId = this.db.createId();
      const country: Country = {
        countryName: c.countryName,
        current: wikiId,
        id: countryId,
        versions: {}
      };
      this.db.doc(`countries/${countryId}`).set(country, {merge: true}).then(() => {
        console.log('Successfully updated country, generating wiki');
        const wikiData = {};
        for (const x of this.preDef.wikiCountry) {
          wikiData[x.title] = x.markup;
        }
        this.db.firestore.batch()
          .set(this.db.doc(`wiki/${wikiId}`).ref, wikiData).commit();
      });
      // Go ahead and clear the section variables
      this.selectedCountries = null;
    });
  }

  deleteCountry() {
    console.log(this.selectedDeleteCountries);
    const batch = this.db.firestore.batch();
    const promiseArray = [];
    for (const country of this.selectedDeleteCountries) {
      // We want to delete the country and all sites that belong to it.
      batch.delete(this.db.doc(`countries/${country.id}`).ref);
      // delete all wikis that belong to it
      for (const wikiId in country.versions) {
        batch.delete(this.db.doc(`wiki/${wikiId}`).ref);
      }
      // delete all sites that belong to it
      promiseArray.push(this.db.collection('sites', ref => ref.where('countryID', '==', country.id))
        .valueChanges().pipe(map((sites: Site[]) => {
          for (const site of sites) {
            // delete site
            batch.delete(this.db.doc(`sites/${site.id}`).ref);
            // Now need to delete site wiki
            batch.delete(this.db.doc(`wiki/${site.current}`).ref);
            // Delete all old versions
            for (const wikiId in site.versions) {
              batch.delete(this.db.doc(`wiki/${wikiId}`).ref);
            }
            // Delete all checklists
            batch.delete(this.db.doc(`sites/${site.id}/checklist/${site.currentCheckList}`).ref);
          }
        }), take(1)).toPromise());
      // Now delete all trips that belong to a country
      promiseArray.push(this.db.collection('trips', ref => ref.where('countryId', '==', country.id))
        .valueChanges().pipe(map((trips : Trip[]) => {
          for (const trip of trips) {
            batch.delete(this.db.doc(`trips/${trip.id}`).ref);
            // Delete instance from team
            //batch.set(this.db.doc(`teams/${trip.teamId}`).ref, {trips: trip.})
          }
        }), take(1)).toPromise());
      // Now need to update teams and remove instances of trips from them.
    }
  }

  ngAfterContentInit(): void {
    this.svg = d3.select('#svgContainer')
      .append('svg')
      .attr('preserveAspectRatio', 'xMidYMid slice')
      .attr('viewBox', `${this.minx} ${this.miny} ${this.width} ${this.height}`)
      .attr('class', 'map')
      .style('display', 'inline-block')
      .style('position', 'absolute')
      .style('top', '0')
      .style('left', '0')
      .style('height', '100%')
      .style('width', '100%')
      .call(drag()
        .on('start', () => d3.select('.map').style('cursor', 'grabbing'))
        .on('drag', () => {
          this.minx -= d3.event.dx;
          this.miny -= d3.event.dy;
          d3.select('.map').attr('viewBox', `${this.minx} ${this.miny} ${this.width} ${this.height}`);
        })
        .on('end', () => d3.select('.map').style('cursor', 'auto'))
      );

    d3.json('assets/countries.topo.json')
      .then((topology: Topology) => {
        // projection fn so we can fit geodata within svg's area
        const projection = d3.geoMercator().scale(this.scaleFactor)
          .translate([this.width / 2, this.height / 1.2]);

        // use projection fn with geoPath fn
        const path = d3.geoPath().projection(projection);

        this.svg.append('g')
          .attr('class', 'states')
          .selectAll('path')
          .data((feature(topology, topology.objects.countriess) as FeatureCollection).features)
          .enter().append('path')
          .attr('d', path)
          .style('stroke', 'white')
          .style('stroke-width', '1px')
          .attr('id', (e) => {
            return e.properties.GU_A3;
          })
          .on('click', this.region_clicked);
      });
  }

  scrollToSelectionPrimeNgListBox(selection, lb, elementIdName) {
    if (lb.value !== null) {
      const index = lb._options.findIndex(c => c.value.id === selection);
      document.getElementById(elementIdName).querySelectorAll('.ui-listbox-item')[index].scrollIntoView();
    }
  }

  region_clicked = (e) => {
    console.log(e.properties.GU_A3);
    d3.select('.country_highlighted').style('fill', 'black');
    d3.select('.country_highlighted').classed('country_highlighted', false);
    d3.select('#' + e.properties.GU_A3).style('fill', 'red');
    d3.select('#' + e.properties.GU_A3).classed('country_highlighted', true);
    const filterExisting = this.existingCountries.filter(c => c.id === e.properties.GU_A3);
    const filterUninitalized = this.unInitiatedCountries.filter(c => c.id === e.properties.GU_A3);
    if (filterExisting.length >= 1) {
      this.selectedDeleteCountries = filterExisting;
      this.scrollToSelectionPrimeNgListBox(e.properties.GU_A3, this.listBox, 'listBox');
    }
    if (filterUninitalized.length >= 1) {
      this.selectedCountries = filterUninitalized;
      this.scrollToSelectionPrimeNgListBox(e.properties.GU_A3, this.listBoxNon, 'listBoxNon');
    }
  }
}
