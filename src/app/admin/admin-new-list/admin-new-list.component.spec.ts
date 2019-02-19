import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewListComponent } from './admin-new-list.component';

describe('AdminNewListComponent', () => {
  let component: AdminNewListComponent;
  let fixture: ComponentFixture<AdminNewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNewListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
