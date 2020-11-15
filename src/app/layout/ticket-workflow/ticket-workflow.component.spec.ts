import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketWorkflowComponent } from './ticket-workflow.component';

describe('TicketWorkflowComponent', () => {
  let component: TicketWorkflowComponent;
  let fixture: ComponentFixture<TicketWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
