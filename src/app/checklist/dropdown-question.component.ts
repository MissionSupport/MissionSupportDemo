import { Component, OnInit } from '@angular/core';
import { Question } from './question';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dropdown-question',
  template: `
    <label class="p-col-12" [attr.for]="question.key">{{question.label}}</label>
    <div [formGroup]="group">
      <p-dropdown class="p-col-12" [options]="question.options" [optionLabel]="'value'" [formControlName]="question.label"
        [name]="question.key" placeholder="Select from Dropdown"></p-dropdown>
      <ng-container *ngFor="let validator of question.validators">
        <p-message severity="error" *ngIf="control.hasError(validator.name) && (control.dirty || control.touched)"
          [text]="validator.message">
        </p-message>
      </ng-container>
    </div>
  `,
  styles: []
})
export class DropdownQuestionComponent implements OnInit {
  question: Question;
  group: FormGroup;

  get control() {
    return this.group.controls[this.question.label];
  }

  constructor() { }

  ngOnInit() {
  }

}
