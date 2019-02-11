import { Injectable } from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

import { QuestionBase } from './question-base';

@Injectable()
export class QuestionControlService {
  constructor() { }

  toFormGroup(questions: QuestionBase<any>[] ) {
    let group: any = {};

    questions.forEach(question => {
      if (question.controlType !== 'medmulttextbox') {
        group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
          : new FormControl(question.value || '');
      } else {
        group[question.key] = new FormArray([]);
      }
    });
    return new FormGroup(group);
  }
}
