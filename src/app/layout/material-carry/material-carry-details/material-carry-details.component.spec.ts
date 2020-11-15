import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialCarryDetailsComponent } from './material-carry-details.component';

describe('MaterialCarryDetailsComponent', () => {
  let component: MaterialCarryDetailsComponent;
  let fixture: ComponentFixture<MaterialCarryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialCarryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialCarryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
