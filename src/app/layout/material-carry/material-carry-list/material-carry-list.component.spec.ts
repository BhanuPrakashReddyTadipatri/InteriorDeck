import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialCarryListComponent } from './material-carry-list.component';

describe('MaterialCarryListComponent', () => {
  let component: MaterialCarryListComponent;
  let fixture: ComponentFixture<MaterialCarryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialCarryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialCarryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
