import {FormGroup} from '@angular/forms';

export class FormObject {
  name: string;
  form: FormGroup;
  questionData: any[];
  questions;
  payLoad;

  constructor(options: {
    name?: string,
    form?: FormGroup,
    questionData?,
    questions?,
    payLoad?

  } = {}) {
    this.name = options.name || '';
    this.form = options.form;
    this.questionData = options.questionData || '';
    this.questions = options.questions;
    this.payLoad = options.payLoad;
  }
}
