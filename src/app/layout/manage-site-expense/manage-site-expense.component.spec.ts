import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSiteExpenseComponent } from './manage-site-expense.component';

describe('ManageSiteExpenseComponent', () => {
  let component: ManageSiteExpenseComponent;
  let fixture: ComponentFixture<ManageSiteExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSiteExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSiteExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
