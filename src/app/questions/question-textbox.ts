import { QuestionBase } from './question-base';
import { KeyFilterRegex} from './regexExpressions';

export class TextboxQuestion extends QuestionBase<string> {
  controlType = 'textbox';
  type: string;
  keyFilter: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
    this.keyFilter = options['keyFilter'] || KeyFilterRegex.noRegex;
  }
}
