import { Injectable } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import { QuestionBase } from './question-base';

@Injectable()
export class QuestionControlService {
  constructor(private formBuilder: FormBuilder) { }

  toFormGroup(questions: QuestionBase<any>[] ) {
    let group: any = {};

    questions.forEach(question => {
      if (question.controlType !== 'medmulttextbox') {
        group[question.key] = this.formBuilder.group({
          question: question.label,
          value: question.value
        });
        // group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
        //   : new FormControl(question.value || '');
      } else {
        group[question.key] = this.formBuilder.group({
          question: question.label,
          value: this.formBuilder.array([])
        });
      }
    });
    return new FormGroup(group);
  }
}
