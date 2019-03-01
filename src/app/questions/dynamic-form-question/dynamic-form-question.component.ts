import {AfterViewInit, Component, Input} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {QuestionBase} from '../question-base';
import {ajax, AjaxResponse} from 'rxjs/ajax';

// import 'autocomplete-lhc';
import { map, catchError } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
// declare var $: any;
// declare var Def: any;

@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html'
})
export class DynamicFormQuestionComponent implements AfterViewInit {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.question.key].valid; }

  drugsInAutoComplete: string[][] = [];
  strengthsForAllDrugs: SelectItem[][];
  strengthsInDropdown: SelectItem[][] = [];
  search: Subscription;

  constructor(private formBuilder: FormBuilder ) {
  }

  ngAfterViewInit() {

  }

  searchDrugs(event: any, index: number) {
    const searchTerm: string = event.query;
    const url = `https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${searchTerm.trim()}&ef=STRENGTHS_AND_FORMS&maxList=`;

    if (this.search) {
      this.search.unsubscribe();
    }

    this.search = ajax(url).pipe(
      map((response: AjaxResponse) => response.response),
      catchError((err) => { throw err; })
    ).subscribe((respArr: any[]) => {
      // respArr[0] is the number of drugs returned. Ignore it.
      // respArr[1] is an array of drug string names.
      this.drugsInAutoComplete[index] = respArr[1] as string[];

      // respArr[2] is the STRENGTHS_AND_FORMS object, which maps to an array of arrays, where each sub-array
      // contains the drug strengths corresponding to the drug name at its index in respArr[1]
      this.strengthsForAllDrugs = respArr[2]['STRENGTHS_AND_FORMS'].map((strengths: string[]) => {
        return strengths.map((strength: string) => {
          return {label: strength, value: strength};
        });
      });
    });

    // new Def.Autocompleter.Prefetch(questionKey + 'drug_strengths', []);
    // new Def.Autocompleter.Search(questionKey + 'rxterms',
    //   'https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?ef=STRENGTHS_AND_FORMS');
    // Def.Autocompleter.Event.observeListSelections(questionKey + 'rxterms', function() {
    //   const drugField = $('#' + questionKey + 'rxterms')[0];
    //   const autocomp = drugField.autocomp;
    //   const el = <HTMLInputElement>document.getElementById(questionKey + 'rxterms');
    //   el.value = drugField.value;
    //   el.dispatchEvent(new Event('input'));
    //   const strengths =
    //     autocomp.getSelectedItemData()[0].data['STRENGTHS_AND_FORMS'];
    //   if (strengths) {
    //     $('#' + questionKey + 'drug_strengths')[0].autocomp.setListAndField(strengths, '');
    //   }
    // });
    // Def.Autocompleter.Event.observeListSelections(questionKey + 'drug_strengths', function() {
    //   const el2 = <HTMLInputElement>document.getElementById(questionKey + 'drug_strengths');
    //   const drugStrengthField = $('#' + questionKey + 'drug_strengths')[0];
    //   el2.value = drugStrengthField.value;
    //   el2.dispatchEvent(new Event('input'));
    // });
    // // Def.Autocompleter.Event.observeListSelections(questionKey + 'drug_strengths', function() {
    // //     const el2 = <HTMLInputElement>document.getElementById(questionKey + 'drug_strengths');
    // //     const drugStrengthField = $('#' + questionKey + 'drug_strengths')[0];
    // //     el2.value = drugStrengthField.value;
    // //     el2.dispatchEvent(new Event('input'));
    // // });
  }

  populateDropdown(drugName: string, index: number) {
    const indexStrengths = this.drugsInAutoComplete[index].indexOf(drugName);
    this.strengthsInDropdown[index] = this.strengthsForAllDrugs[indexStrengths];
  }

  addField(questionKey, string) {
    const formm = this.form.get(questionKey).get(string) as FormArray;
    formm.push(this.createItem());
    this.drugsInAutoComplete.push([]);
    this.strengthsInDropdown.push([]);
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      drugName: '',
      strength: '',
    });
  }

}
