import { QuestionBase } from './question-base';

export class HeaderQuestion extends QuestionBase<string> {
  controlType = 'header';
  type: string;
  // value;

  constructor(options: {} = {}) {
    super(options);
    // this.type = options['type'] || '';
  }
}
