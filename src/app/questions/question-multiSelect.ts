import { QuestionBase } from './question-base';

export class MultiSelectQuestion extends QuestionBase<string> {
  controlType = 'multi';
  options: {key: string, value: string}[] = [];
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || '';
    this.type = options['type'] || '';
  }
}
