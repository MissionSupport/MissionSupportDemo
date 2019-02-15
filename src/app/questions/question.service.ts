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

  // questionExampleJson = [
  //   {
  //     key: 'textBox1',
  //     label: 'Hospital Name',
  //     controlType: 'textbox',
  //     gridSize: 'p-col-12',
  //     keyFilter: 'noSpecial'
  //   },
  //   {
  //     key: 'textBox2',
  //     label: 'Name of Host',
  //     controlType: 'textbox',
  //     gridSize: 'p-col-6',
  //     keyFilter: 'noSpecial'
  //   },
  //   {
  //     key: 'textBox3',
  //     label: 'Position at Hospital',
  //     controlType: 'textbox',
  //     gridSize: 'p-col-6',
  //     keyFilter: 'noSpecial'
  //   },
  //   {
  //     key: 'textBox4',
  //     label: 'Host Email Address',
  //     controlType: 'textbox',
  //     gridSize: 'p-col-6',
  //     keyFilter: 'email'
  //   },
  //   {
  //     key: 'textBox5',
  //     label: 'Host Phone Number',
  //     controlType: 'textbox',
  //     gridSize: 'p-col-6'
  //   },
  //   {
  //     key: 'textBox6',
  //     label: 'Number of Beds (Total Hospital)',
  //     controlType: 'textbox',
  //     gridSize: 'p-col-4',
  //     keyFilter: 'pnum'
  //   },
  //   {
  //     key: 'textBox7',
  //     label: 'Number of Med/Surg Beds',
  //     controlType: 'textbox',
  //     gridSize: 'p-col-4',
  //     keyFilter: 'pnum'
  //   },
  //   {
  //     key: 'textBox8',
  //     label: 'Number of Operating Rooms',
  //     controlType: 'textbox',
  //     gridSize: 'p-col-4',
  //     keyFilter: 'pnum'
  //   },
  //   {
  //     key: 'textBox9',
  //     label: 'Number of Clinic Rooms (Available for surgery)',
  //     controlType: 'textbox',
  //     gridSize: 'p-col-4',
  //     keyFilter: 'pnum'
  //   },
  //   {
  //     key: 'radio1',
  //     label: 'PCAU?',
  //     controlType: 'radio',
  //     gridSize: 'p-col-4',
  //     options: [
  //       {key: '1', value: 'Yes'},
  //       {key: '0', value: 'No'}
  //     ]
  //   },
  //   {
  //     key: 'radio2',
  //     label: 'Pre-op?',
  //     controlType: 'radio',
  //     gridSize: 'p-col-4',
  //     options: [
  //       {key: '1', value: 'Yes'},
  //       {key: '0', value: 'No'}
  //     ]
  //   },
  //   {
  //     key: 'radio3',
  //     label: 'What is your primary source of electricity',
  //     controlType: 'radio',
  //     gridSize: 'p-col-4',
  //     options: [
  //       {key: 'City Grid', value: 'City Grid'},
  //       {key: 'Generator', value: 'Generator'}
  //     ]
  //   },
  //   {
  //     key: 'radio4',
  //     label: 'Power outlets located on wards?',
  //     controlType: 'radio',
  //     gridSize: 'p-col-4',
  //     options: [
  //       {key: '1', value: 'Yes'},
  //       {key: '0', value: 'No'}
  //     ]
  //   },
  //   {
  //     key: 'editor1',
  //     label: 'What is your back-up power supply in case of power outage?',
  //     controlType: 'freeResponse',
  //     gridSize: 'p-col-12',
  //     height: '150'
  //   },
  //
  //
  // ];

  questions: QuestionBase<any>[] = [];
  // TODO: get from a remote source of question metadata
  // TODO: make asynchronous
  getQuestions(questionData) {
    this.questions = [];
    this.parseQuestionJson(questionData);

    // let questions: QuestionBase<any>[] = [

    //   new DropdownQuestion({
    //     key: 'brave',
    //     label: 'Bravery Rating',
    //     options: [
    //       {key: 'solid',  value: 'Solid'},
    //       {key: 'great',  value: 'Great'},
    //       {key: 'good',   value: 'Good'},
    //       {key: 'unproven', value: 'Unproven'}
    //     ],
    //     order: 3
    //   }),
    //
    //   new TextboxQuestion({
    //     key: 'firstName',
    //     label: 'First name',
    //     value: 'Bombasto',
    //     required: true,
    //     order: 1,
    //     keyFilter: 'alpha',
    //     gridSize: 'p-col-6'
    //   }),
    //
    //   new TextboxQuestion({
    //     key: 'emailAddress',
    //     label: 'Email',
    //     type: 'email',
    //     keyFilter: 'email',
    //     order: 2,
    //   }),
    //
    //   new RadioQuestion({
    //     key: 'radioTrial',
    //     label: 'RadioTrial',
    //     type: 'radio',
    //     gridSize: 'p-col-4',
    //     options: [
    //       {key: 'usa',  value: 'USA'},
    //       {key: 'grid',  value: 'Grid'},
    //       {key: 'good',   value: 'Good'},
    //       {key: 'unproven', value: 'Unproven'}
    //     ]
    //   }),
    //
    //   new MedicineTextboxQuestion({
    //     key: 'medtextbox1',
    //     label: 'Look Up Medicine',
    //     order: 2
    //   }),
    //   new MedicineTextboxQuestion({
    //     key: 'medtextbox2',
    //     label: 'Look Up Medicine',
    //     order: 2
    //   }),
    //   new MedicineTextboxQuestion({
    //     key: 'medtextbox3',
    //     label: 'Look Up Medicine',
    //     order: 2
    //   }),
    //   new FreeResponseQuestion( {
    //     key: 'textInput',
    //     label: 'Editor',
    //     height: '100',
    //     gridSize: 'p-col-10'
    //     }
    //   ),
    //   new MedicineMultipleTextboxQuestion({
    //     key: 'medtextMultibox1',
    //     label: 'Look Up Medicine (mult)',
    //     gridSize: 'p-col-12'
    //   }),
    // ];

    return this.questions.sort((a, b) => a.order - b.order);
  }

  parseQuestionJson(array) {
    array.forEach(object => {
      this.createQuestion((<QuestionBase<any>>object));
    });
  }

  createQuestion(object: QuestionBase<any>) {
    let question;
    switch (object.controlType) {
      case 'textbox':
        question = new TextboxQuestion(object);
        break;
      case 'dropdown':
        question = new DropdownQuestion(object);
        break;
      case 'freeResponse':
        question = new FreeResponseQuestion(object);
        break;
      case 'medmulttextbox':
        question = new MedicineMultipleTextboxQuestion(object);
        break;
      case 'medtextbox':
        question = new MedicineTextboxQuestion(object);
        break;
      case 'radio':
        question = new RadioQuestion(object);
        break;
    }
    this.questions.push(question);
  }
}
