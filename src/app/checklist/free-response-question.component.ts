import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Question } from './question';

@Component({
  selector: 'app-free-response-question',
  template: `
  <div [formGroup]="group">
    <label [attr.for]="question.key">{{question.label}}</label>
    <p-editor class="p-col-12" [style]="{'height' : '150px'}"
      [formControlName]="question.label" [id]="question.key">
      <p-header>
        <span class="ql-formats">
          <button class="ql-bold" aria-label="Bold"></button>
          <button class="ql-italic" aria-label="Italic"></button>
          <button class="ql-underline" aria-label="Underline"></button>
        </span>
      </p-header>
    </p-editor>
    <ng-container *ngFor="let validator of question.validators">
      <p-message severity="error" *ngIf="control.hasError(validator.name) && (control.dirty || control.touched)"
         [text]="validator.message">
       </p-message>
     </ng-container>
  </div>
  `,
  styles: []
})
export class FreeResponseQuestionComponent implements OnInit {
  question: Question;
  group: FormGroup;

  get control() {
    return this.group.controls[this.question.label];
  }

  constructor() { }

  ngOnInit() {
  }

}
