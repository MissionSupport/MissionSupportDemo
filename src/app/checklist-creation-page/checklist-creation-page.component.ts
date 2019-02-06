import { Component, OnInit } from '@angular/core';
import {SharedService} from '../globals';
import * as name from 'autocomplete-lhc';
// import {$} from 'protractor';
// import {Def} from 'node_modules/autocomplete-lhc/source/autocomplete-lhc.js';
// import {Def} from 'node_modules/autocomplete-lhc/source/autoCompBase.js';
// import * as abc from 'src/app/utils/autocomplete-lhc-17.0.3/autocomplete-lhc.min.js';
import Def from 'node_modules/autocomplete-lhc/source/autoCompBase.js';
@Component({
  selector: 'app-checklist-creation-page',
  templateUrl: './checklist-creation-page.component.html',
  styleUrls: ['./checklist-creation-page.component.css']
})
export class ChecklistCreationPageComponent implements OnInit {

  isHospital;
  hasEditRights = true;


  constructor(private sharedService: SharedService) {
    sharedService.hideToolbar.emit(false);
    sharedService.onPageNav.emit('Checklist Creation');
    // console.log(yourPreferedName);
    // console.log(abc);
    console.log(Def);
    // new Def.Autocompleter.Prefetch('drug_strengths', []);
    // new Def.Autocompleter.Search('rxterms',
    //   'https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?ef=STRENGTHS_AND_FORMS');
    // Def.Autocompleter.Event.observeListSelections('rxterms', function() {
    //   const drugField = $('#rxterms')[0];
    //   const autocomp = drugField.autocomp;
    //   const strengths =
    //     autocomp.getSelectedItemData()[0].data['STRENGTHS_AND_FORMS'];
    //   if (strengths) {
    //     $('#drug_strengths')[0].autocomp.setListAndField(strengths, '');
    //   }
    // });
  }

  ngOnInit() {
  }

}
