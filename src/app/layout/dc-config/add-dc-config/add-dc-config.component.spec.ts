import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDcConfigComponent } from './add-dc-config.component';

describe('AddDcConfigComponent', () => {
  let component: AddDcConfigComponent;
  let fixture: ComponentFixture<AddDcConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDcConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDcConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
