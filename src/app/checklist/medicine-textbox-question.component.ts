import { Component, OnInit } from '@angular/core';
import { Question } from './question';
import { FormGroup } from '@angular/forms';
import { DrugsService } from '../service/drugs.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-medicine-textbox-question',
  template: `
    <div [formGroup]="group">
      <div [formGroup]="question.label">
        <label [attr.for]="question.key">{{question.label}}</label>
        <p-autoComplete [id]="question.key + 'rxterms'" placeholder="Drug Name"
          [suggestions]="drugsInAutoComplete[0]" [formControlName]="'drugName'" (completeMethod)="searchDrugs($event)"
          [emptyMessage]="'No drugs found.'" (onSelect)="populateDropdown($event)" [forceSelection]="true"
          [minLength]="3"></p-autoComplete>
        <p-dropdown [options]="strengthsInDropdown[0]" [id]="question.key + 'drug_strengths'"
          [placeholder]="'Drug Strengths'" [formControlName]="'drugStrength'"></p-dropdown>
        <ng-container *ngFor="let validator of question.validators">
          <p-message severity="error" *ngIf="control.hasError(validator.name) && (control.dirty || control.touched)"
            [text]="validator.message">
          </p-message>
        </ng-container>
      </div>
    </div>
  `,
  styles: []
})
export class MedicineTextboxQuestionComponent implements OnInit {
  question: Question;
  group: FormGroup;

  drugsInAutoComplete: string[];
  strengthsForAllDrugs: SelectItem[][];
  strengthsInDropdown: SelectItem[];

  get control() {
    return this.group.controls[this.question.label];
  }

  constructor(private drugsService: DrugsService) { }

  ngOnInit() {
  }

  searchDrugs(event) {
    this.drugsService.searchDrug(event.query).subscribe((respArr: any[]) => {
      // respArr[0] is the number of drugs returned. Ignore it.
      // respArr[1] is an array of drug string names.
      this.drugsInAutoComplete = respArr[1] as string[];

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

  populateDropdown(drugName: string) {
    const indexStrengths = this.drugsInAutoComplete.indexOf(drugName);
    this.strengthsInDropdown = this.strengthsForAllDrugs[indexStrengths];
  }

}
