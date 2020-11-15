import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialReceiptComponent } from './material-receipt.component';

describe('MaterialReceiptComponent', () => {
  let component: MaterialReceiptComponent;
  let fixture: ComponentFixture<MaterialReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
