import {AfterViewInit, Component, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {QuestionBase} from '../question-base';

import 'autocomplete-lhc';
declare var $: any;
declare var Def: any;

@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html'
})
export class DynamicFormQuestionComponent implements AfterViewInit {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.question.key].valid; }

  ngAfterViewInit() {

  }
  searchDrugs(questionKey) {
    // console.log(Def.Autocompleter);
    new Def.Autocompleter.Prefetch(questionKey + 'drug_strengths', []);
    new Def.Autocompleter.Search(questionKey + 'rxterms',
      'https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?ef=STRENGTHS_AND_FORMS');
    // console.log($('#' + questionKey + 'rxterms')[0]);
    Def.Autocompleter.Event.observeListSelections(questionKey + 'rxterms', function() {
      const drugField = $('#' + questionKey + 'rxterms')[0];
      const autocomp = drugField.autocomp;
      console.log(drugField);
      var el = <HTMLInputElement>document.getElementById(questionKey + 'rxterms');
      el.value = drugField.value;
      el.dispatchEvent(new Event('input'));
      const strengths =
        autocomp.getSelectedItemData()[0].data['STRENGTHS_AND_FORMS'];
      if (strengths) {
        $('#' + questionKey + 'drug_strengths')[0].autocomp.setListAndField(strengths, '');
      }
    });
  }
}
