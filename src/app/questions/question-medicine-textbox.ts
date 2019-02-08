import { QuestionBase } from './question-base';

export class MedicineTextboxQuestion extends QuestionBase<string> {
  controlType = 'medtextbox';
  type: string;
  // value;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
    // this.value = {
    //   value: options['value'],
    //   label: options['label']
    // };
  }
}
