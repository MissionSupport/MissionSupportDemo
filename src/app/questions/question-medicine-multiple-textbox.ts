import { QuestionBase } from './question-base';

export class MedicineMultipleTextboxQuestion extends QuestionBase<string> {
  controlType = 'medmulttextbox';
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
