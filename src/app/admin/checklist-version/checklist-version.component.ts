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
      json: '{"textBox1":{"question":"Hospital Name","value":"Emory"},"textBox2":{"question":"Name of Host",' +
        '"value":"Vikas O\'Reilly-Shah"},"textBox3":{"question":"Position at Hospital","value":"Anesthesiologist"},' +
        '"textBox4":{"question":"Host Email Address","value":"EmailBasic@aol.com"},"textBox5":{"question":"Host Phone' +
        'Number","value":"(555)867-5309"},"textBox6":{"question":"Number of Beds (Total Hospital)","value":"1,043"},' +
        '"textBox7":{"question":"Number of Med/Surg Beds","value":"204"},"textBox8":{"question":"Number of Operating Rooms",' +
        '"value":"26"},"textBox9":{"question":"Number of Clinic Rooms (Available for surgery)","value":"32"},' +
        '"radio1":{"question":"PCAU?","value":"Yes"},"radio2":{"question":"Pre-op?","value":"No"}}'
    };
  @Input() checkListNew = {
      name: 'Hospital',
      json: '{"textBox1":{"question":"Hospital Name","value":"Katies Place"},"textBox2":{"question":"Name of Host",' +
        '"value":"Vikas O\'Reilly-Shah"},"textBox3":{"question":"Position at Hospital","value":"Anesthesiologist"},' +
        '"textBox4":{"question":"Host Email Address","value":"EmailBasic@aol.com"},"textBox5":{"question":"Host Phone' +
        'Number","value":"(555)867-5309"},"textBox6":{"question":"Number of Beds (Total Hospital)","value":"1,072"},' +
        '"textBox7":{"question":"Number of Med/Surg Beds","value":"204"},"textBox8":{"question":"Number of Operating Rooms",' +
        '"value":"26"},"textBox9":{"question":"Number of Clinic Rooms (Available for surgery)","value":"32"},' +
        '"radio1":{"question":"PCAU?","value":"No"},"radio2":{"question":"Pre-op?","value":"No"}}'
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
        value: this.dataRaw[key].value,
        question: this.dataRaw[key].question
      };
    }, this.dataRaw);
    this.dataChanged = JSON.parse(this.checkListNew.json);
    this._dataChanged = Object.keys(this.dataChanged).map((key) => {
      return {
        value: this.dataChanged[key].value,
        question: this.dataChanged[key].question
      };
    }, this.dataChanged);
    return _data;
  }

  getQuestion(question) {
    if (question.question !== null) {
      return question.question;
    } else {
      console.log(question);
    }
  }

  getValue(question) {
    if (typeof question.value === 'string') {
      return question.value;
    } else {
      let value = '';
      question.value.forEach((val, index) => {
        if (typeof val.value === 'string') {
          value = value + val.value.toString();
          if (index !== question.value.length - 1) {
            value = value + ',';
          }
          value = value + '<br/>';
        } else {
          value = value + val.drugName + ' - ' + val.strength;
          if (index !== question.value.length - 1) {
            value = value + ',';
          }
          value = value + '<br/>';
        }
      });
      return value;
    }
  }

  getChangeValue(question, j) {
    if (typeof question.value === 'string') {
      return this._dataChanged[j].value;
    } else {
      // console.log(question);
      let value = '';
      this._dataChanged[j].value.forEach((val, index) => {
        if (typeof val.value === 'string') {
          value = value + val.value.toString();
          if (index !== this._dataChanged[j].value.length - 1) {
            value = value + ',';
          }
          value = value + '<br/>';
        } else {
          value = value + val.drugName + ' - ' + val.strength;
          if (index !== this._dataChanged[j].value.length - 1) {
            value = value + ',';
          }
          value = value + '<br/>';
        }
      });
      return value;
    }
  }
  checkChange(question, j) {
    const original = this.getValue(question);
    this.orgVal.push(original);
    const newVal = this.getChangeValue(question, j);
    this.newVal.push(newVal);
    if (original !== newVal) {
      return true;
    } else {
      return false;
    }
  }

  doEdits() {
    this.selectedEdits.forEach( (selected) => {
      const keyString = this.dataRawKeys[selected.index];
      this.dataRaw[keyString].value = this.newVal[selected.index];
    });
    console.log(JSON.stringify(this.dataRaw));
    this.checkList.json = JSON.stringify(this.dataRaw);
  }

  finishEdits() {
    this.updatedVersion.emit(this.checkList);
  }

}
