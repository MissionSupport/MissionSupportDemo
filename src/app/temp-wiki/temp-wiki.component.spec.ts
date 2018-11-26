import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempWikiComponent } from './temp-wiki.component';

describe('TempWikiComponent', () => {
  let component: TempWikiComponent;
  let fixture: ComponentFixture<TempWikiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempWikiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempWikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
