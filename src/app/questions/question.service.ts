import { Injectable } from '@angular/core';
import {QuestionBase} from './question-base';
import {DropdownQuestion} from './question-dropdown';
import {TextboxQuestion} from './question-textbox';
import {RadioQuestion} from './question-radio';
import {MedicineTextboxQuestion} from './question-medicine-textbox';
import {FreeResponseQuestion} from './question-free-response';
import {MedicineMultipleTextboxQuestion} from './question-medicine-multiple-textbox';
import {HeaderQuestion} from './header';
import {MedicineMultipleCheckQuestion} from './question-medicine-mult-check';
import {MultiSelectQuestion} from './question-multiSelect';



@Injectable()
export class QuestionService {

  questions: QuestionBase<any>[] = [];
  // TODO: get from a remote source of question metadata
  // TODO: make asynchronous
  getQuestions(questionData) {
    this.questions = [];
    this.parseQuestionJson(questionData);
    return this.questions.sort((a, b) => a.order - b.order);
  }

  parseQuestionJson(array) {
    console.log('array :   ' + array);
    if (array !== '') {
      array.forEach(object => {
        this.createQuestion((<QuestionBase<any>>object));
      });
    }
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
      case 'header':
        question = new HeaderQuestion(object);
        break;
      case 'medmultcheck':
        question = new MedicineMultipleCheckQuestion(object);
        break;
      case 'multi':
        question = new MultiSelectQuestion(object);
        break;
    }
    this.questions.push(question);
  }
}
