import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffEditComponent } from './diff-edit.component';

describe('DiffEditComponent', () => {
  let component: DiffEditComponent;
  let fixture: ComponentFixture<DiffEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiffEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
