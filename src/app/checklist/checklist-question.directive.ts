import { Directive, Input, ComponentFactoryResolver, ViewContainerRef, OnInit, Renderer2 } from '@angular/core';
import { DropdownQuestionComponent } from './dropdown-question.component';
import { FreeResponseQuestionComponent } from './free-response-question.component';
import { ImageQuestionComponent } from './image-question.component';
import { MedicineMultipleCheckboxQuestionComponent } from './medicine-multiple-checkbox-question.component';
import { MedicineMultipleTextboxQuestionComponent } from './medicine-multiple-textbox-question.component';
import { MultipleSelectQuestionComponent } from './multiple-select-question.component';
import { RadioButtonQuestionComponent } from './radio-button-question.component';
import { TextboxQuestionComponent } from './textbox-question.component';
import { Question } from './question';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[appChecklistQuestion]'
})
export class ChecklistQuestionDirective implements OnInit {
  @Input() question: Question;
  @Input() group: FormGroup;
  @Input() numberOfDrugs: number;

  componentMap = {
    'dropdown': DropdownQuestionComponent,
    'freeResponse': FreeResponseQuestionComponent,
    'image': ImageQuestionComponent,
    'medicineMultipleCheckbox': MedicineMultipleCheckboxQuestionComponent,
    'medicineMultipleTextbox': MedicineMultipleTextboxQuestionComponent,
    'multipleSelect': MultipleSelectQuestionComponent,
    'radioButton': RadioButtonQuestionComponent,
    'textbox': TextboxQuestionComponent
  };

  componentRef: any;

  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef,
    private renderer: Renderer2) {}

  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory(this.componentMap[this.question.type]);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.question = this.question;
    this.componentRef.instance.group = this.group;

    if (this.question.type === 'medicineMultipleCheckbox' || this.question.type === 'medicineMultipleTextbox') {
      for (let num = 0; num < this.numberOfDrugs; num++) {
        this.componentRef.instance.drugsInAutoComplete.push([]);
        const strength = this.group.get(this.question.label).get(num.toString()).get('drugStrength').value;
        this.componentRef.instance.strengthsInDropdown.push([{
          label: strength,
          value: strength
        }]);
      }

      if (this.question.type === 'medicineMultipleCheckbox' && this.numberOfDrugs > 0) {
        this.componentRef.instance.showMedicine = true;
      }
    }

    const classes: string[] = this.question.gridSize.split(' ');
    classes.forEach(cls => {
      this.renderer.addClass(this.componentRef.location.nativeElement, cls);
    });

    if (this.question.type === 'medicineMultipleCheckbox') {
      (<HTMLElement>this.componentRef.location.nativeElement).style.marginLeft = '0';
      (<HTMLElement>this.componentRef.location.nativeElement).style.paddingLeft = '0';
    }
  }
}
