import { QuestionBase } from './question-base';
import { KeyFilterRegex} from './regexExpressions';

export class FreeResponseQuestion extends QuestionBase<string> {
  controlType = 'freeResponse';
  type: string;
  keyFilter;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
    this.keyFilter = KeyFilterRegex.noRegex;
  }
}
