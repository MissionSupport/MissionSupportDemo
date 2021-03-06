import { Component, OnInit, OnDestroy } from '@angular/core';
import {PreDefined} from '../../globals';
import {SharedService} from '../../service/shared-service.service';
import { Question } from 'src/app/checklist/question';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-admin-new-list',
  templateUrl: './admin-new-list.component.html',
  styleUrls: ['./admin-new-list.component.css'],
  providers: []
})
export class AdminNewListComponent implements OnInit, OnDestroy {
  counter = 0;

  questionTypes: {name: string, type: 'dropdown' | 'freeResponse' | 'image' | 'medicineMultipleCheckbox'
  | 'medicineMultipleTextbox' /*| 'medicineTextbox'*/ | 'multipleSelect' | 'radioButton'
  | 'textbox'}[] = [
    { name: 'Radio Buttons (select only one)', type: 'radioButton' },
    { name: 'Dropdown', type: 'dropdown' },
    { name: 'Multiple Select Dropdown', type: 'multipleSelect' },
    { name: 'Single-Line Text Input', type: 'textbox' },
    { name: 'Large Text Input', type: 'freeResponse' },
    // { name: 'Single Medicine (Name and Strength) Input', type: 'medicineTextbox' },
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

  newQuestionGridSize: {name: string, gridSize: string};
  newQuestion: string;
  selectedControlType: {name: string, type: 'dropdown' | 'freeResponse' | 'image' | 'medicineMultipleCheckbox'
  | 'medicineMultipleTextbox' /*'| 'medicineTextbox'*/ | 'multipleSelect' | 'radioButton'
  | 'textbox'};
  options: {key: string, value: string}[] = [];

  alreadyUsedNames: string[] = [];

  alreadyUsedSub: Subscription;

  constructor(private sharedService: SharedService, private readonly db: AngularFirestore) {
    this.checklist = {
      name: '',
      questions: []
    };

    this.alreadyUsedSub = this.db.collection('checklists').snapshotChanges().pipe().subscribe(actions => {
      this.alreadyUsedNames = ['Hospital', 'Hospital Infrastructure', 'Pharmacy and Lab', 'Operating Room',
      'Wards', 'Supplies', 'Ambulance', 'Case Volume and Staff', 'Personnel', 'Education and QI', 'Logistics',
      'Accommodations'];
      actions.map(a => {
        this.alreadyUsedNames.push(a.payload.doc.id);
      });
    });

    // sharedService.hideToolbar.emit(false);
    // sharedService.canEdit.emit(false);
    // sharedService.onPageNav.emit('Checklist Creation');
    this.sharedService.scrollPanelHeightToSubtract.emit(0);

  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.alreadyUsedSub) {
      this.alreadyUsedSub.unsubscribe();
    }
  }

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
        gridSize: this.newQuestionGridSize.gridSize,
        options: this.options,
        validators: []  // TODO: Add validation options.
      };
    } else {
      object = {
        key: this.selectedControlType.type + this.counter.toString(),
        label: this.newQuestion,
        type: this.selectedControlType.type,
        gridSize: this.newQuestionGridSize.gridSize,
        validators: []  // TODO: Add validation options.
      };
    }
    this.counter++;
    this.checklist.questions = [...this.checklist.questions, object];
    this.newQuestion = '';
    this.newQuestionGridSize = undefined;
    this.options = [];
  }

  addOption() {
    this.options = [...this.options, {key: '', value: ''}];
  }

  pushNewForm() {
    const json = {};
    this.checklist.questions.forEach((question) => {
      json[question.key] = question;
    });
    this.db.collection('checklists').doc(this.checklist.name).set(json);
    this.checklist.name = '';
    this.checklist.questions = [];
  }
}
