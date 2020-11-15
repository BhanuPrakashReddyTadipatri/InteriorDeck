import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteExpensesListComponent } from './site-expenses-list.component';

describe('SiteExpensesListComponent', () => {
  let component: SiteExpensesListComponent;
  let fixture: ComponentFixture<SiteExpensesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteExpensesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteExpensesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
