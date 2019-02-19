import {AfterViewInit, Component, Input} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {QuestionBase} from '../question-base';

import 'autocomplete-lhc';
import {MedicineTextboxQuestion} from '../question-medicine-textbox';
import HTML = marked.Tokens.HTML;
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

  constructor(private formBuilder: FormBuilder ) {
  }
  ngAfterViewInit() {

  }
  searchDrugs(questionKey) {
    new Def.Autocompleter.Prefetch(questionKey + 'drug_strengths', []);
    new Def.Autocompleter.Search(questionKey + 'rxterms',
      'https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?ef=STRENGTHS_AND_FORMS');
    Def.Autocompleter.Event.observeListSelections(questionKey + 'rxterms', function() {
      const drugField = $('#' + questionKey + 'rxterms')[0];
      const autocomp = drugField.autocomp;
      const el = <HTMLInputElement>document.getElementById(questionKey + 'rxterms');
      el.value = drugField.value;
      el.dispatchEvent(new Event('input'));
      const strengths =
        autocomp.getSelectedItemData()[0].data['STRENGTHS_AND_FORMS'];
      if (strengths) {
        $('#' + questionKey + 'drug_strengths')[0].autocomp.setListAndField(strengths, '');
      }
    });
    Def.Autocompleter.Event.observeListSelections(questionKey + 'drug_strengths', function() {
      const el2 = <HTMLInputElement>document.getElementById(questionKey + 'drug_strengths');
      const drugStrengthField = $('#' + questionKey + 'drug_strengths')[0];
      el2.value = drugStrengthField.value;
      el2.dispatchEvent(new Event('input'));
    });
    // Def.Autocompleter.Event.observeListSelections(questionKey + 'drug_strengths', function() {
    //     const el2 = <HTMLInputElement>document.getElementById(questionKey + 'drug_strengths');
    //     const drugStrengthField = $('#' + questionKey + 'drug_strengths')[0];
    //     el2.value = drugStrengthField.value;
    //     el2.dispatchEvent(new Event('input'));
    // });
  }

  addField(questionKey, string) {
    const formm = this.form.get(questionKey).get(string) as FormArray;
    formm.push(this.createItem());
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      drugName: '',
      strength: '',
    });
  }

}
