import { Component, OnInit } from '@angular/core';
import { Question } from './question';
import { FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-multiple-select-question',
  template: `
    <label [attr.for]="question.key">{{question.label}}</label>
    <div [formGroup]="group">
      <p-multiSelect [options]="options" [formControlName]="question.label"
        [id]="question.key" [filter]="false"></p-multiSelect>
      <ng-container *ngFor="let validator of question.validators">
        <p-message severity="error" *ngIf="control.hasError(validator.name) && (control.dirty || control.touched)"
          [text]="validator.message">
        </p-message>
      </ng-container>
    </div>
  `,
  styles: []
})
export class MultipleSelectQuestionComponent implements OnInit {
  question: Question;
  group: FormGroup;

  options: SelectItem[] = [];

  get control() {
    return this.group.controls[this.question.label];
  }

  constructor() { }

  ngOnInit() {
    this.question.options.forEach((option) => {
      this.options.push({
        label: option.value,
        value: option.value
      });
    });
  }

}
