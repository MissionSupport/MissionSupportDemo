import {AfterContentInit, AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {PreDefined, SharedService} from '../globals';

import 'autocomplete-lhc';
import {FormBuilder, FormGroup} from '@angular/forms';
import {QuestionControlService} from '../questions/question-control-service';
import {QuestionBase} from '../questions/question-base';
import {QuestionService} from '../questions/question.service';
import {FormObject} from '../interfaces/formObject';
declare var $: any;
declare var Def: any;
@Component({
  selector: 'app-checklist-creation-page',
  templateUrl: './checklist-creation-page.component.html',
  styleUrls: ['./checklist-creation-page.component.css'],
  providers: [QuestionService, QuestionControlService, PreDefined]
})
export class ChecklistCreationPageComponent implements OnInit, AfterViewInit {

  // @Input() questions: QuestionBase<any>[] = [];
  form: FormGroup;
  payLoad = '';
  isHospital;
  hasEditRights = true;
  myForm: FormGroup;
  questions: QuestionBase<any>[] = [];
  forms: FormObject[] = [];

  constructor(private sharedService: SharedService, // private fb: FormBuilder,
              private qcs: QuestionControlService, private service: QuestionService, private preDef: PreDefined ) {
    this.questions = service.getQuestions(this.preDef.questionExampleJson);

    sharedService.hideToolbar.emit(false);
    sharedService.canEdit.emit(false);
    sharedService.onPageNav.emit('Checklist Creation');
  }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  ngAfterViewInit() {
    // console.log(Def.Autocompleter);
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

  onSubmit() {
    console.log(this.form);
    this.payLoad = JSON.stringify(this.form.value);
    console.log(this.payLoad);
  }

}
