import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcConfigComponent } from './dc-config.component';

describe('DcConfigComponent', () => {
  let component: DcConfigComponent;
  let fixture: ComponentFixture<DcConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
