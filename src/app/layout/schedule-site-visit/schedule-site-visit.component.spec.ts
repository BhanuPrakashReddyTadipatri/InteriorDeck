import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSiteVisitComponent } from './schedule-site-visit.component';

describe('ScheduleSiteVisitComponent', () => {
  let component: ScheduleSiteVisitComponent;
  let fixture: ComponentFixture<ScheduleSiteVisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleSiteVisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleSiteVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
