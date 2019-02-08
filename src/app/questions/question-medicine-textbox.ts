import { QuestionBase } from './question-base';

export class MedicineTextboxQuestion extends QuestionBase<string> {
  controlType = 'medtextbox';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
