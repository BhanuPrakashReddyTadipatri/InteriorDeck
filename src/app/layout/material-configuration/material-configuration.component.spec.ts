import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialConfigurationComponent } from './material-configuration.component';

describe('MaterialConfigurationComponent', () => {
  let component: MaterialConfigurationComponent;
  let fixture: ComponentFixture<MaterialConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
