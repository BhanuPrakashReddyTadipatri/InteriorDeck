import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVmConfigComponent } from './add-vm-config.component';

describe('AddVmConfigComponent', () => {
  let component: AddVmConfigComponent;
  let fixture: ComponentFixture<AddVmConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVmConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVmConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
