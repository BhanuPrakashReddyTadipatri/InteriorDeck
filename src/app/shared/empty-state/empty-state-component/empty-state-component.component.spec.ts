import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStateComponentComponent } from './empty-state-component.component';

describe('EmptyStateComponentComponent', () => {
  let component: EmptyStateComponentComponent;
  let fixture: ComponentFixture<EmptyStateComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyStateComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyStateComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
