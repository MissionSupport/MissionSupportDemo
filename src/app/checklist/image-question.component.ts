import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Question } from './question';

@Component({
  selector: 'app-image-question',
  template: `
    <p>
      image-question works!
    </p>
  `,
  styles: []
})
export class ImageQuestionComponent implements OnInit {
  question: Question;
  group: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
