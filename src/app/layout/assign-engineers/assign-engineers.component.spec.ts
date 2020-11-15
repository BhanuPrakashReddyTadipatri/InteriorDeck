import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignEngineersComponent } from './assign-engineers.component';

describe('AssignEngineersComponent', () => {
  let component: AssignEngineersComponent;
  let fixture: ComponentFixture<AssignEngineersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignEngineersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignEngineersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
