import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCountryCreationComponent } from './admin-country-creation.component';

describe('AdminCountryCreationComponent', () => {
  let component: AdminCountryCreationComponent;
  let fixture: ComponentFixture<AdminCountryCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCountryCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCountryCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
