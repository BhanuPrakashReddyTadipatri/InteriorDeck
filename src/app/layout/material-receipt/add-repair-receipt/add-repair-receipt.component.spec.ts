import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRepairReceiptComponent } from './add-repair-receipt.component';

describe('AddRepairReceiptComponent', () => {
  let component: AddRepairReceiptComponent;
  let fixture: ComponentFixture<AddRepairReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRepairReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRepairReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
