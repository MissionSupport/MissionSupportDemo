import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {QuestionBase} from '../../questions/question-base';
import {FormObject} from '../../questions/formObject';
import {PreDefined, SharedService} from '../../globals';
import {QuestionControlService} from '../../questions/question-control-service';
import {QuestionService} from '../../questions/question.service';
import {SelectedInjectable} from '../../questions/selectedInjectable';

export class Option {
  key: string;
  value: FormGroup;
  constructor(options: {
    key?: string,
    value?: FormGroup,
  } = {}) {
    this.key = options.key;
    this.value = options.value;
  }
}
@Component({
  selector: 'app-admin-new-list',
  templateUrl: './admin-new-list.component.html',
  styleUrls: ['./admin-new-list.component.css'],
  providers: [QuestionService, QuestionControlService]
})
export class AdminNewListComponent implements OnInit {

  newQuestion: string;
  counter = 0;
  // questions: QuestionBase<any>[] = [];
  questionTypes = [
    {
      name: 'Radio (Select Only One)', controlType: 'radio'
    },
    {
      name: 'DropDown Selection', controlType: 'dropdown'
    },
    {
      name: 'Multiple DropDown Selection', controlType: 'multi'
    },
    {
      name: 'Text Single Line Input', controlType: 'textbox'
    },
    {
      name: 'Large Text Input/ Editor', controlType: 'freeResponse'
    },
    {
      name: 'Section Header/Text Break', controlType: 'header'
    },
    {
      name: 'Single Rx Medicine Input', controlType: 'medtextbox'
    },
    {
      name: 'Multiple Rx Medicine Input', controlType: 'medmulttextbox'
    },
    {
      name: 'Enable/Disable Multiple Rx Medicine Input', controlType: 'medmultcheck'
    }
  ];
  questionLengths = [
    {
      name: 'Full Page Width', value: 'p-col-12'
    },
    {
      name: 'Half Page Width', controlType: 'p-col-6'
    },
    {
      name: '1/3 Page Width', controlType: 'p-col-4'
    },
    {
      name: '1/4 Page Width', controlType: 'p-col-3'
    }
  ];
  newQuestionGridSize;
  formObject: FormObject;
  selectedControlType;
  options: Option[] = [];

  constructor(private sharedService: SharedService, // private fb: FormBuilder,
              private qcs: QuestionControlService, private service: QuestionService, private preDef: PreDefined,
              private selected: SelectedInjectable ) {

    this.formObject = new FormObject({
        name: 'newFormName',
        questionData: []
      });
    this.formObject.questions = service.getQuestions(this.formObject.questionData);
    console.log(this.formObject);
    // sharedService.hideToolbar.emit(false);
    // sharedService.canEdit.emit(false);
    // sharedService.onPageNav.emit('Checklist Creation');
  }

  ngOnInit() {
    this.formObject.form = this.qcs.toFormGroup(this.formObject.questions);
  }

  pushNewQuestion() {
    let object: any;

    if (this.selectedControlType.controlType === 'radio' || this.selectedControlType.controlType === 'multi'
    || this.selectedControlType.controlType === 'dropdown') {
      this.options.forEach((o) => o.key = o.value.value.replace(/\s+/g, ''));
      object = {
        key: this.selectedControlType.controlType + this.counter.toString(),
        label: this.newQuestion,
        controlType: this.selectedControlType.controlType,
        // gridSize: this.newQuestionGridSize.value,
        gridSize: 'p-col-12',
        options: this.options
      };
    } else  {
      object = {
        key: this.selectedControlType.controlType + this.counter.toString(),
        label: this.newQuestion,
        controlType: this.selectedControlType.controlType,
        // gridSize: this.newQuestionGridSize.value,
        gridSize: 'p-col-12'
      };
    }
    this.counter++;
    this.formObject.questionData = [...this.formObject.questionData, object];
    console.log(this.formObject.questionData);
    this.formObject.questions = this.service.getQuestions(this.formObject.questionData);
    console.log(this.service.getQuestions(this.formObject.questionData));
    this.formObject.form = this.qcs.toFormGroup(this.formObject.questions);
    this.newQuestion = '';
    this.newQuestionGridSize = undefined;
    this.options = [];
  }

  addOption() {
    // this.options.push();
    this.options = [...this.options, new Option()];
  }

  pushNewForm() {
    console.log(this.formObject.questionData);
  }


}
