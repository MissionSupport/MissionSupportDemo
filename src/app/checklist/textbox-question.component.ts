import { Component, OnInit } from '@angular/core';
import { Question } from './question';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-textbox-question',
  template: `
    <div [formGroup]="group">
      <label [attr.for]="question.key">{{question.label}}</label>
      <input type="text" class="p-col-12" pInputText [formControlName]="question.label" [id]="question.key">
      <ng-container *ngFor="let validator of question.validators">
        <p-message severity="error" *ngIf="control.hasError(validator.name) && (control.dirty || control.touched)"
          [text]="validator.message">
        </p-message>
      </ng-container>
    </div>
  `,
  styles: []
})
export class TextboxQuestionComponent implements OnInit {
  question: Question;
  group: FormGroup;

  get control() {
    return this.group.controls[this.question.label];
  }

  constructor() { }

  ngOnInit() {
  }

}
