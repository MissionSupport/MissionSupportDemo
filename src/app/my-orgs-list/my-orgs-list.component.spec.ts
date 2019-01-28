import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrgsListComponent } from './my-orgs-list.component';

describe('MyOrgsListComponent', () => {
  let component: MyOrgsListComponent;
  let fixture: ComponentFixture<MyOrgsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOrgsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrgsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
