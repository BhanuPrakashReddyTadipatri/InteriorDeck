import { TestBed, inject } from '@angular/core/testing';

import { CommuteProviderService } from './commute-provider.service';

describe('CommuteProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommuteProviderService]
    });
  });

  it('should be created', inject([CommuteProviderService], (service: CommuteProviderService) => {
    expect(service).toBeTruthy();
  }));
});
