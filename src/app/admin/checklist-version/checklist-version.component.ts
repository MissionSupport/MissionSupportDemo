import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-checklist-version',
  templateUrl: './checklist-version.component.html',
  styleUrls: ['./checklist-version.component.css']
})
export class ChecklistVersionComponent implements OnInit {
  @Output() updatedVersion = new EventEmitter();

  @Input() checkList = {
    name: 'Hospital',
    json: '{"Hospital Name":"ChecklistTest","Host Name":"John Doe",' +
    '"Host Position at Hospital":"Doctor of Pediatrics","Host Email Address":"john@doe.com",' +
    '"Host Phone Number":"123-456-7890","Total Number of Hospital Beds":"1234",' +
    '"Number of Medical and Surgical Beds":"34","Number of Operating Rooms":"10",' +
    '"Number of Clinic Rooms Available for Surgery":"1","PCAU?":"Yes","Pre-Op?":"Yes"}'
  };

  @Input() checkListNew = {
    name: 'Hospital',
    json: '{"Hospital Name":"Test","Host Name":"Jane Doe",' +
    '"Host Position at Hospital":"Anesthesiologist","Host Email Address":"jane@doe.com",' +
    '"Host Phone Number":"555-867-5309","Total Number of Hospital Beds":"1254",' +
    '"Number of Medical and Surgical Beds":"43","Number of Operating Rooms":"100",' +
    '"Number of Clinic Rooms Available for Surgery":"10","PCAU?":"No","Pre-Op?":"No"}'
    };

  dataChanged;
  _dataChanged: any[] = [];

  selectedEdits;
  orgVal: any[] = [];
  newVal: any[] = [];
  dataRaw;
  dataRawKeys;


  constructor() { }

  ngOnInit() {
  }

  jsonParse(list) {
    this.dataRaw = JSON.parse(list);
    this.dataRawKeys = Object.keys(this.dataRaw);
    const _data = Object.keys(this.dataRaw).map((key) => {
      return {
        question: key,
        answer: this.dataRaw[key]
      };
    });
    this.dataChanged = JSON.parse(this.checkListNew.json);
    this._dataChanged = Object.keys(this.dataChanged).map((key) => {
      return {
        question: key,
        answer: this.dataChanged[key]
      };
    });
    return _data;
  }

  getAnswer(question: {question: string, answer: any}) {
    if (typeof question.answer === 'string') {
      return question.answer;
    } else {
      // The answer is an array.
      let value = '';
      question.answer.forEach((item, index) => {
        if (typeof item === 'string') {
          // The answer is an array of strings.
          value = value + item;
          if (index !== question.answer.length - 1) {
            value = value + ',';
          }
          value = value + '<br/>';
        } else if (typeof item === 'object') {
          // The answer is an array of objects (for medicine questions).
          value = value + item.drugName + ' - ' + item.drugStrength;
          if (index !== question.answer.length - 1) {
            value = value + ',';
          }
          value = value + '<br/>';
        }
      });
      return value;
    }
  }

  getChangeAnswer(question: {question: string, answer: any}, j: number) {
    if (typeof question.answer === 'string') {
      return this._dataChanged[j].answer;
    } else {
      // The answer is an array.
      let value = '';
      this._dataChanged[j].answer.forEach((item, index) => {
        if (typeof item === 'string') {
          // The answer is an array of strings.
          value = value + item;
          if (index !== this._dataChanged[j].answer.length - 1) {
            value = value + ',';
          }
          value = value + '<br/>';
        } else if (typeof item === 'object') {
          // The answer is an array of objects (for medicine questions).
          value = value + item.drugName + ' - ' + item.drugStrength;
          if (index !== this._dataChanged[j].answer.length - 1) {
            value = value + ',';
          }
          value = value + '<br/>';
        }
      });
      return value;
    }
  }

  checkChange(question, j) {
    const original = this.getAnswer(question);
    this.orgVal.push(original);
    const newVal = this.getChangeAnswer(question, j);
    this.newVal.push(newVal);
    if (original !== newVal) {
      return true;
    } else {
      return false;
    }
  }

  doEdits() {
    this.selectedEdits.forEach((selected) => {
      const keyString = this.dataRawKeys[selected.index];
      this.dataRaw[keyString] = this.newVal[selected.index];
    });
    console.log(JSON.stringify(this.dataRaw));
    this.checkList.json = JSON.stringify(this.dataRaw);
  }

  finishEdits() {
    this.updatedVersion.emit(this.checkList);
  }

}
