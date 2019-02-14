import { Injectable } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import { QuestionBase } from './question-base';

@Injectable()
export class QuestionControlService {
  constructor(private formBuilder: FormBuilder) { }

  toFormGroup(questions: QuestionBase<any>[] ) {
    let group: any = {};

    questions.forEach(question => {
      if (question.controlType !== 'medmulttextbox' && question.controlType !== 'medtextbox') {
        group[question.key] = this.formBuilder.group({
          question: question.label,
          value: question.value
        });
      } else if ( question.controlType === 'medmulttextbox') {
        group[question.key] = this.formBuilder.group({
          question: question.label,
          value: this.formBuilder.array([])
        });
      } else {
        group[question.key] = this.formBuilder.group({
          question: question.label,
          value: question.value,
          strength: ''
        });
      }
    });
    return new FormGroup(group);
  }
}
