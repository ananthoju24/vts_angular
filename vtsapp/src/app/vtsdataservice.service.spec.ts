import { TestBed } from '@angular/core/testing';

import { VtsdataserviceService } from './vtsdataservice.service';

describe('VtsdataserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VtsdataserviceService = TestBed.get(VtsdataserviceService);
    expect(service).toBeTruthy();
  });
});
