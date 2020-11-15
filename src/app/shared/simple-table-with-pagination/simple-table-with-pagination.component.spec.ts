import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTableWithPaginationComponent } from './simple-table-with-pagination.component';

describe('SimpleTableWithPaginationComponent', () => {
  let component: SimpleTableWithPaginationComponent;
  let fixture: ComponentFixture<SimpleTableWithPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleTableWithPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTableWithPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
