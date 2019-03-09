import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistVersionComponent } from './checklist-version.component';

describe('ChecklistVersionComponent', () => {
  let component: ChecklistVersionComponent;
  let fixture: ComponentFixture<ChecklistVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecklistVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
