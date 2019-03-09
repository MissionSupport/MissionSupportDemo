import { Component, OnInit } from '@angular/core';
import { Question } from './question';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-radio-button-question',
  template: `
    <div [formGroup]="group">
      <label [attr.for]="question.key">{{question.label}}</label>
      <div *ngFor="let opt of question.options">
        <p-radioButton [formControlName]="question.label" [name]="question.key" [value]="opt.value"
          [label]="opt.value"></p-radioButton>
      </div>
      <ng-container *ngFor="let validator of question.validators">
        <p-message severity="error" *ngIf="control.hasError(validator.name) && (control.dirty || control.touched)"
          [text]="validator.message">
        </p-message>
      </ng-container>
    </div>
  `,
  styles: []
})
export class RadioButtonQuestionComponent implements OnInit {
  question: Question;
  group: FormGroup;

  get control() {
    return this.group.controls[this.question.label];
  }

  constructor() { }

  ngOnInit() {
  }

}
