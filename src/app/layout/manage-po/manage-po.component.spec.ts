import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePoComponent } from './manage-po.component';

describe('ManagePoComponent', () => {
  let component: ManagePoComponent;
  let fixture: ComponentFixture<ManagePoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
