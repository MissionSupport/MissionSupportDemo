import { Injectable } from '@angular/core';
import {QuestionBase} from './question-base';
import {DropdownQuestion} from './question-dropdown';
import {TextboxQuestion} from './question-textbox';
import {RadioQuestion} from './question-radio';
import {MedicineTextboxQuestion} from './question-medicine-textbox';
import {FreeResponseQuestion} from './question-free-response';
import {MedicineMultipleTextboxQuestion} from './question-medicine-multiple-textbox';



@Injectable()
export class QuestionService {

  // TODO: get from a remote source of question metadata
  // TODO: make asynchronous
  getQuestions() {

    let questions: QuestionBase<any>[] = [

      new DropdownQuestion({
        key: 'brave',
        label: 'Bravery Rating',
        options: [
          {key: 'solid',  value: 'Solid'},
          {key: 'great',  value: 'Great'},
          {key: 'good',   value: 'Good'},
          {key: 'unproven', value: 'Unproven'}
        ],
        order: 3
      }),

      new TextboxQuestion({
        key: 'firstName',
        label: 'First name',
        value: 'Bombasto',
        required: true,
        order: 1,
        keyFilter: 'alpha',
        gridSize: 'p-col-6'
      }),

      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        keyFilter: 'email',
        order: 2,
      }),

      new RadioQuestion({
        key: 'radioTrial',
        label: 'RadioTrial',
        type: 'radio',
        gridSize: 'p-col-4',
        options: [
          {key: 'usa',  value: 'USA'},
          {key: 'grid',  value: 'Grid'},
          {key: 'good',   value: 'Good'},
          {key: 'unproven', value: 'Unproven'}
        ]
      }),

      new MedicineTextboxQuestion({
        key: 'medtextbox1',
        label: 'Look Up Medicine',
        order: 2
      }),
      new MedicineTextboxQuestion({
        key: 'medtextbox2',
        label: 'Look Up Medicine',
        order: 2
      }),
      new MedicineTextboxQuestion({
        key: 'medtextbox3',
        label: 'Look Up Medicine',
        order: 2
      }),
      new FreeResponseQuestion( {
        key: 'textInput',
        label: 'Editor',
        height: '100',
        gridSize: 'p-col-10'
        }
      ),
      new MedicineMultipleTextboxQuestion({
        key: 'medtextMultibox1',
        label: 'Look Up Medicine (mult)',
        gridSize: 'p-col-2'
      }),
    ];

    return questions.sort((a, b) => a.order - b.order);
  }
}
