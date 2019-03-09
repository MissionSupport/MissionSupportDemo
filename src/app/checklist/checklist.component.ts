import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Question, Validator } from './question';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-checklist',
  template: `
    <form [formGroup]="checklist" (submit)="onSubmit($event)" class="p-grid">
      <ng-container *ngFor="let question of questions" appChecklistQuestion
        [question]="question" [group]="checklist">
      </ng-container>
      <div class="form-row p-col-12">
        <p-button type="submit" [label]="'Save'"></p-button>
      </div>
    </form>
  `,
  styles: []
})
export class ChecklistComponent implements OnInit {
  @Input() questions: Question[] = [];
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();

  checklist: FormGroup;

  get value() {
    return this.checklist.value;
  }

  constructor(private fb: FormBuilder) {
    this.checklist = this.fb.group({});
  }

  ngOnInit() {
    this.questions.forEach((question: Question) => {
      if (question.type === 'medicineMultipleTextbox' || question.type === 'medicineMultipleCheckbox') {
        // create a FormArray here since the number of controls is dynamic.
        this.checklist.addControl(question.label, this.fb.array([], this.bindValidations(question.validators)));
      } else if (question.type === 'medicineTextbox') {
        this.checklist.addControl(question.label, this.fb.group({}, this.bindValidations(question.validators)));
      } else {
        this.checklist.addControl(question.label, this.fb.control('', this.bindValidations(question.validators)));
      }
    });
  }

  bindValidations(validations: Validator[]): ValidatorFn {
    if (validations.length > 0) {
      const validators = [];
      validations.forEach((validator: Validator) => {
        validators.push(validator.validator);
      });
      return Validators.compose(validators);
    } else {
      return null;
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.checklist.valid) {
      this.submit.emit(this.checklist.value);
    } else {
      Object.keys(this.checklist.controls).forEach(field => {
        this.checklist.controls[field].markAsTouched({onlySelf: true});
      });
    }
  }
}
