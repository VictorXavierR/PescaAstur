import { TestBed } from '@angular/core/testing';

import { MarineService } from './marine.service';

describe('MarineService', () => {
  let service: MarineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
