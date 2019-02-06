import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {SharedService} from '../globals';

import 'autocomplete-lhc';
declare var $: any;
declare var Def: any;
@Component({
  selector: 'app-checklist-creation-page',
  templateUrl: './checklist-creation-page.component.html',
  styleUrls: ['./checklist-creation-page.component.css']
})
export class ChecklistCreationPageComponent implements OnInit, AfterViewInit {

  isHospital;
  hasEditRights = true;


  constructor(private sharedService: SharedService) {
    sharedService.hideToolbar.emit(false);
    sharedService.onPageNav.emit('Checklist Creation');
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    console.log(Def.Autocompleter);
    new Def.Autocompleter.Prefetch('drug_strengths', []);
    new Def.Autocompleter.Search('rxterms',
      'https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?ef=STRENGTHS_AND_FORMS');
    Def.Autocompleter.Event.observeListSelections('rxterms', function() {
      const drugField = $('#rxterms')[0];
      const autocomp = drugField.autocomp;
      const strengths =
        autocomp.getSelectedItemData()[0].data['STRENGTHS_AND_FORMS'];
      if (strengths) {
        $('#drug_strengths')[0].autocomp.setListAndField(strengths, '');
      }
    });
  }

}
