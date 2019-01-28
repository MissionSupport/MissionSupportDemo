import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTripsListComponent } from './my-trips-list.component';

describe('MyTripsListComponent', () => {
  let component: MyTripsListComponent;
  let fixture: ComponentFixture<MyTripsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTripsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTripsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
