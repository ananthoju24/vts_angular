import { TestBed } from '@angular/core/testing';

import { VtsserviceService } from './vtsservice.service';

describe('VtsserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VtsserviceService = TestBed.get(VtsserviceService);
    expect(service).toBeTruthy();
  });
});
