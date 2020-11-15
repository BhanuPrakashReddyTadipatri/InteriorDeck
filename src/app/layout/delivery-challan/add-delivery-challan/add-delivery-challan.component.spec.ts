import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeliveryChallanComponent } from './add-delivery-challan.component';

describe('AddDeliveryChallanComponent', () => {
  let component: AddDeliveryChallanComponent;
  let fixture: ComponentFixture<AddDeliveryChallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDeliveryChallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDeliveryChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
