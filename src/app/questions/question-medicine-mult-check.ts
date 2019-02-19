import { QuestionBase } from './question-base';

export class MedicineMultipleCheckQuestion extends QuestionBase<string> {
  controlType = 'medmultcheck';
  type: string;
  // value;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
