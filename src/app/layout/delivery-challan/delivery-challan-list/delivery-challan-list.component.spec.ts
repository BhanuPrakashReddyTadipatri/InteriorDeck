import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryChallanListComponent } from './delivery-challan-list.component';

describe('DeliveryChallanListComponent', () => {
  let component: DeliveryChallanListComponent;
  let fixture: ComponentFixture<DeliveryChallanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryChallanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryChallanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
