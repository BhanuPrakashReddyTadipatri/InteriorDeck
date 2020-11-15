import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitesManagementComponent } from './sites-management.component';

describe('SitesManagementComponent', () => {
  let component: SitesManagementComponent;
  let fixture: ComponentFixture<SitesManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitesManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
