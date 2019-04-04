import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistCreationPageComponent } from './checklist-creation-page.component';

describe('ChecklistCreationPageComponent', () => {
  let component: ChecklistCreationPageComponent;
  let fixture: ComponentFixture<ChecklistCreationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecklistCreationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistCreationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
