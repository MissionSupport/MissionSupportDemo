import { Component, OnInit } from '@angular/core';
import {PreDefined} from '../../globals';
import {SharedService} from '../../service/shared-service.service';
import { Question } from 'src/app/checklist/question';

@Component({
  selector: 'app-admin-new-list',
  templateUrl: './admin-new-list.component.html',
  styleUrls: ['./admin-new-list.component.css'],
  providers: []
})
export class AdminNewListComponent implements OnInit {
  counter = 0;

  questionTypes: {name: string, type: 'dropdown' | 'freeResponse' | 'image' | 'medicineMultipleCheckbox'
  | 'medicineMultipleTextbox'| 'medicineTextbox' | 'multipleSelect' | 'radioButton'
  | 'textbox'}[] = [
    { name: 'Radio Buttons (select only one)', type: 'radioButton' },
    { name: 'Dropdown', type: 'dropdown' },
    { name: 'Multiple Select Dropdown', type: 'multipleSelect' },
    { name: 'Single-Line Text Input', type: 'textbox' },
    { name: 'Large Text Input', type: 'freeResponse' },
    { name: 'Single Medicine (Name and Strength) Input', type: 'medicineTextbox' },
    { name: 'Multiple Medicine (Name and Strength) Input', type: 'medicineMultipleTextbox' },
    { name: 'Enable/Disable Multiple Medicine (Name and Strength) Input', type: 'medicineMultipleCheckbox' }
  ];

  checklist: {name: string, questions: Question[]};

  questionLengths: {name: string, gridSize: string}[] = [
    { name: 'Full Page Width', gridSize: 'p-col-12'},
    { name: 'Half Page Width', gridSize: 'p-col-6' },
    { name: '1/3 Page Width', gridSize: 'p-col-4' },
    { name: '1/4 Page Width', gridSize: 'p-col-3'}
  ];

  newQuestionGridSize: string;
  newQuestion: string;
  selectedControlType: {name: string, type: 'dropdown' | 'freeResponse' | 'image' | 'medicineMultipleCheckbox'
  | 'medicineMultipleTextbox'| 'medicineTextbox' | 'multipleSelect' | 'radioButton'
  | 'textbox'};
  options: {key: string, value: string}[];

  constructor(private sharedService: SharedService, private preDef: PreDefined) {
    this.checklist = {
      name: 'newFormName',
      questions: []
    };

    // sharedService.hideToolbar.emit(false);
    // sharedService.canEdit.emit(false);
    // sharedService.onPageNav.emit('Checklist Creation');
    // this.sharedService.scrollPanelHeightToSubtract.emit(50);

  }

  ngOnInit() {}

  pushNewQuestion() {
    let object: Question;

    if (this.selectedControlType.type === 'radioButton'
      || this.selectedControlType.type === 'multipleSelect'
      || this.selectedControlType.type === 'dropdown') {
      this.options.forEach((o) => o.key = o.value.replace(/\s+/g, ''));
      object = {
        key: this.selectedControlType.type + this.counter.toString(),
        label: this.newQuestion,
        type: this.selectedControlType.type,
        gridSize: this.newQuestionGridSize,
        options: this.options,
        validators: []  // TODO: Add validation options.
      };
    } else {
      object = {
        key: this.selectedControlType.type + this.counter.toString(),
        label: this.newQuestion,
        type: this.selectedControlType.type,
        gridSize: this.newQuestionGridSize,
        validators: []  // TODO: Add validation options.
      };
    }
    this.counter++;
    this.checklist.questions.push(object);
    this.newQuestion = '';
    this.newQuestionGridSize = undefined;
    this.options = [];
  }

  addOption() {
    this.options = [...this.options, {key: '', value: ''}];
  }

  pushNewForm() {
    console.dir(this.checklist);
  }
}
