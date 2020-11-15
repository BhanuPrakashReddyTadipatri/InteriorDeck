import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialReceiptComponent } from './add-material-receipt.component';

describe('AddMaterialReceiptComponent', () => {
  let component: AddMaterialReceiptComponent;
  let fixture: ComponentFixture<AddMaterialReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMaterialReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaterialReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
