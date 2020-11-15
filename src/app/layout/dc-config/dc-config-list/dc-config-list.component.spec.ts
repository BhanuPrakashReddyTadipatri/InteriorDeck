import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcConfigListComponent } from './dc-config-list.component';

describe('DcConfigListComponent', () => {
  let component: DcConfigListComponent;
  let fixture: ComponentFixture<DcConfigListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcConfigListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcConfigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
