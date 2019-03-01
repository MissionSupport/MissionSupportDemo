import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {PreDefined, SharedService} from '../globals';

// import 'autocomplete-lhc';
import {FormGroup} from '@angular/forms';
import {QuestionControlService} from '../questions/question-control-service';
import {QuestionBase} from '../questions/question-base';
import {QuestionService} from '../questions/question.service';
import {FormObject} from '../questions/formObject';
import {SelectedInjectable} from '../questions/selectedInjectable';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {Site} from '../interfaces/site';
// declare var $: any;
// declare var Def: any;

@Component({
  selector: 'app-checklist-creation-page',
  templateUrl: './checklist-creation-page.component.html',
  styleUrls: ['./checklist-creation-page.component.css'],
  providers: [QuestionService, QuestionControlService]
})
export class ChecklistCreationPageComponent implements OnInit, AfterViewInit, OnDestroy {

  // @Input() questions: QuestionBase<any>[] = [];
  form: FormGroup;
  payLoad = '';
  isHospital;
  hasEditRights = true;
  myForm: FormGroup;
  questions: QuestionBase<any>[] = [];
  forms: FormObject[] = [
    // new FormObject({
    //   name: 'Hospital',
    //   questionData: this.preDef.hospitalJson
    // }),
    // new FormObject({
    //   name: 'Hospital Infrastructure',
    //   questionData: this.preDef.hospitalInfrastructureJson
    // }),
    // new FormObject({
    //   name: 'Pharmacy/Lab',
    //   questionData: this.preDef.pharmacyLabJson
    // }),
    // new FormObject( {
    //   name: 'Operating Room',
    //   questionData: this.preDef.operatingRoomJson
    // }),
    // new FormObject( {
    //   name: 'Wards',
    //   questionData: this.preDef.wardJson
    // }),
    // new FormObject( {
    //   name: 'Supplies',
    //   questionData: this.preDef.suppliesEquipmentJson
    // }),
    // new FormObject( {
    //   name: 'Ambulance',
    //   questionData: this.preDef.ambulanceJson
    // }),
    // new FormObject( {
    //   name: 'Case Volume and Staff',
    //   questionData: this.preDef.caseVolumeandStafJson
    // }),
    // new FormObject( {
    //   name: 'Case Volume and Staff',
    //   questionData: this.preDef.personnelJson
    // }),
    // new FormObject( {
    //   name: 'Education/QI',
    //   questionData: this.preDef.educationQIJson
    // }),
    // new FormObject( {
    //   name: 'Logistics',
    //   questionData: this.preDef.logisticsJson
    // }),
    // new FormObject( {
    //   name: 'Accommodations',
    //   questionData: this.preDef.accommodationsJson
    // })
  ];
  selectedLists = [];
  countryId: string;
  siteId: string;
  checkListId: string;

  siteSubscribable;

  constructor(private sharedService: SharedService, // private fb: FormBuilder,
              private qcs: QuestionControlService, private service: QuestionService, private preDef: PreDefined,
              private selected: SelectedInjectable, private readonly db: AngularFirestore, private route: ActivatedRoute) {
    // this.forms.push(new FormObject());

    this.selectedLists = this.selected.selected;
    // console.log(this.selected.selected);
    // console.log(this.selectedLists);
    this.selectedLists.forEach(list => this.forms.push(new FormObject(list)));

    this.forms.forEach((form) => form.questions = service.getQuestions(form.questionData));

    this.siteId = this.route.snapshot.paramMap.get('id');
    this.countryId = this.route.snapshot.paramMap.get('countryId');
    this.siteSubscribable = this.db.doc(`countries/${this.countryId}/sites/${this.siteId}`).valueChanges()
      .subscribe((site: Site) => this.checkListId = site.currentCheckList);

    this.sharedService.hideToolbar.emit(false);
    this.sharedService.canEdit.emit(false);
    this.sharedService.onPageNav.emit('Checklist Creation');
  }

  ngOnInit() {
    // this.form = this.qcs.toFormGroup(this.questions);
    this.forms.forEach((form) => form.form = this.qcs.toFormGroup(form.questions));
  }

  ngAfterViewInit() {
    // console.log(Def.Autocompleter);
    // new Def.Autocompleter.Prefetch('drug_strengths', []);
    // new Def.Autocompleter.Search('rxterms',
    //   'https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?ef=STRENGTHS_AND_FORMS');
    // Def.Autocompleter.Event.observeListSelections('rxterms', function() {
    //   const drugField = $('#rxterms')[0];
    //   const autocomp = drugField.autocomp;
    //   const strengths =
    //     autocomp.getSelectedItemData()[0].data['STRENGTHS_AND_FORMS'];
    //   if (strengths) {
    //     $('#drug_strengths')[0].autocomp.setListAndField(strengths, '');
    //   }
    // });
  }

  onSubmit(form, formObject, hideForm) {
    // console.log(form);
    formObject.payLoad = JSON.stringify(form.value);
    this.preDef.testInput.push(
      {
        name: formObject.name,
        json: formObject.payLoad
      }
    );
    hideForm.hidden = true;
    const json = {};
    json[formObject.name] = formObject.payLoad;
    console.dir(json);
    this.db.doc(`countries/${this.countryId}/sites/${this.siteId}/checklist/${this.checkListId}`).update(json);
  }

  ngOnDestroy(): void {
    this.siteSubscribable.unsubscribe();
  }

}
