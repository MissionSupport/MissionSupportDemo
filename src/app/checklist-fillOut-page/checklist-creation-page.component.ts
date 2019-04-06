import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {PreDefined} from '../globals';
import {SharedService} from '../service/shared-service.service';

import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {Site} from '../interfaces/site';
import { Question } from '../checklist/question';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checklist-creation-page',
  templateUrl: './checklist-creation-page.component.html',
  styleUrls: ['./checklist-creation-page.component.css'],
  providers: []
})
export class ChecklistCreationPageComponent implements OnInit, AfterViewInit, OnDestroy {
  countryId: string;
  siteId: string;
  checkListId: string;

  siteSubscribable: Subscription;

  lists: {name: string, hidden: boolean, list: Question[], answers: any}[] = [];


  listMap = {
    'Hospital': this.preDef.hospitalChecklist,
    'Hospital Infrastructure': this.preDef.hospitalInfrastructureChecklist,
    'Pharmacy and Lab': this.preDef.pharmacyLabChecklist,
    'Operating Room': this.preDef.operatingRoomChecklist,
    'Wards': this.preDef.wardChecklist,
    'Supplies': this.preDef.suppliesEquipmentChecklist,
    'Ambulance': this.preDef.ambulanceChecklist,
    'Case Volume and Staff': this.preDef.caseVolumeandStaffChecklist,
    'Personnel': this.preDef.personnelChecklist,
    'Education and QI': this.preDef.educationQIChecklist,
    'Logistics': this.preDef.logisticsChecklist,
    'Accommodations': this.preDef.accommodationsChecklist
  };

  constructor(private sharedService: SharedService, private preDef: PreDefined,
              private readonly db: AngularFirestore, private route: ActivatedRoute) {
    this.sharedService.selectedChecklists.forEach((listName) => {
      this.lists.push({
        name: listName,
        hidden: false,
        list: this.listMap[listName],
        answers: null
      });
    });
    this.sharedService.updatingChecklists.forEach((list) => {
      const obj = {
        name: list['name'],
        hidden: false,
        list: this.listMap[list['name']],
        answers: JSON.parse(list['json']['json'])
      };
      this.lists.push(obj);
    });

    this.siteId = this.route.snapshot.paramMap.get('id');
    this.countryId = this.route.snapshot.paramMap.get('countryId');
    this.siteSubscribable = this.db.doc(`countries/${this.countryId}/sites/${this.siteId}`).valueChanges()
      .subscribe((site: Site) => this.checkListId = site.currentCheckList);

    this.sharedService.hideToolbar.emit(false);
    this.sharedService.canEdit.emit(false);
    this.sharedService.onPageNav.emit('Checklist Creation');
    this.sharedService.scrollPanelHeightToSubtract.emit(50);
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  onSubmit(formValue: any, listName: string) {
    const json = {};
    json[listName] = JSON.stringify(formValue);
    this.db.doc(`countries/${this.countryId}/sites/${this.siteId}/checklist/${this.checkListId}`)
      .update(json);
    this.lists.find((value) => value.name === listName).hidden = true;
  }

  unhideForm(listName: string) {
    this.lists.find((value) => value.name === listName).hidden = false;
  }

  ngOnDestroy(): void {
    this.siteSubscribable.unsubscribe();
  }
}
