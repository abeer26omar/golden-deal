import { TestBed } from '@angular/core/testing';

import { MacPrefixService } from './mac-prefix.service';

describe('MacPrefixService', () => {
  let service: MacPrefixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MacPrefixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
