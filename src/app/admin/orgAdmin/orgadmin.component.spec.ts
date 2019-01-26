import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgadminComponent } from './orgadmin.component';

describe('OrgadminComponent', () => {
  let component: OrgadminComponent;
  let fixture: ComponentFixture<OrgadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
