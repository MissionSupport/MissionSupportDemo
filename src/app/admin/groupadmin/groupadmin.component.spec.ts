import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupadminComponent } from './groupadmin.component';

describe('GroupadminComponent', () => {
  let component: GroupadminComponent;
  let fixture: ComponentFixture<GroupadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
