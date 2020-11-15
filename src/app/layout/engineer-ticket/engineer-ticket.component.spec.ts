import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerTicketComponent } from './engineer-ticket.component';

describe('EngineerTicketComponent', () => {
  let component: EngineerTicketComponent;
  let fixture: ComponentFixture<EngineerTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineerTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineerTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
