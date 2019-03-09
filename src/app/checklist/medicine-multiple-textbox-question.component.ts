import { Component, OnInit } from '@angular/core';
import { Question } from './question';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { DrugsService } from '../service/drugs.service';

@Component({
  selector: 'app-medicine-multiple-textbox-question',
  template: `
    <label [attr.for]="question.key">{{question.label}}</label>
    <div [formGroup]="group" class="p-col-12" style="margin-left: -0.5em">
      <div [formArrayName]="question.label">
        <div *ngFor="let control of formArray.controls; let i = index">
          <div [formGroupName]="i" class="p-grid">
            <div class="p-col-10">
              <p-autoComplete [id]="question.key + i + 'rxterms'" placeholder="Drug Name"
                [suggestions]="drugsInAutoComplete[i]" [formControlName]="'drugName'" (completeMethod)="searchDrugs($event, i)"
                [emptyMessage]="'No drugs found.'" (onSelect)="populateDropdown($event, i)" [forceSelection]="true"
                [minLength]="3"></p-autoComplete>
              <p-dropdown [options]="strengthsInDropdown[i]" [id]="question.key + i +'drug_strengths'"
                [placeholder]="'Drug Strengths'" [formControlName]="'drugStrength'"></p-dropdown>
            </div>
            <div class="p-col-2 p-col-align-center">
              <p-button styleClass="ui-button-danger ui-button-rounded" icon="pi pi-times"
                (onClick)="removeItem(i)"></p-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p-button [type]="'button'" (onClick)="addField()" label="Add"></p-button>
    <ng-container *ngFor="let validator of question.validators">
      <p-message severity="error" *ngIf="control.hasError(validator.name) && (control.dirty || control.touched)"
        [text]="validator.message">
      </p-message>
    </ng-container>
  `,
  styles: []
})
export class MedicineMultipleTextboxQuestionComponent implements OnInit {
  question: Question;
  group: FormGroup;

  drugsInAutoComplete: string[][] = [];
  strengthsForAllDrugs: SelectItem[][];
  strengthsInDropdown: SelectItem[][] = [];

  get formArray() {
    return this.group.controls[this.question.label] as FormArray;
  }

  get control() {
    return this.group.controls[this.question.label];
  }

  constructor(private fb: FormBuilder, private drugsService: DrugsService) { }

  ngOnInit() {
  }

  searchDrugs(event, index: number) {
    this.drugsService.searchDrug(event.query).subscribe((respArr: any[]) => {
      // respArr[0] is the number of drugs returned. Ignore it.
      // respArr[1] is an array of drug string names.
      this.drugsInAutoComplete[index] = respArr[1] as string[];

      if (respArr[0] as number !== 0) {
        // respArr[2] is the STRENGTHS_AND_FORMS object, which maps to an array of arrays, where each sub-array
        // contains the drug strengths corresponding to the drug name at its index in respArr[1]
        this.strengthsForAllDrugs = respArr[2]['STRENGTHS_AND_FORMS'].map((strengths: string[]) => {
          return strengths.map((strength: string) => {
            return {label: strength, value: strength};
          });
        });
      }
    });
  }

  populateDropdown(drugName: string, index: number) {
    const indexStrengths = this.drugsInAutoComplete[index].indexOf(drugName);
    this.strengthsInDropdown[index] = this.strengthsForAllDrugs[indexStrengths];
  }

  addField() {
    this.drugsInAutoComplete.push([]);
    this.strengthsInDropdown.push([]);
    this.formArray.push(this.fb.group({
      drugName: '',
      drugStrength: ''
    }));
  }

  removeItem(index: number) {
    this.formArray.removeAt(index);
  }
}
