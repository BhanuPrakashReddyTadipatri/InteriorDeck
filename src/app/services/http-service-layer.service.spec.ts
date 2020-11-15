import { TestBed } from '@angular/core/testing';

import { HttpLayerService } from './http-service-layer.service';

describe('HttpServiceLayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpLayerService = TestBed.get(HttpLayerService);
    expect(service).toBeTruthy();
  });
});
