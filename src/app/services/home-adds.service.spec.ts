import { TestBed } from '@angular/core/testing';

import { HomeAddsService } from './home-adds.service';

describe('HomeAddsService', () => {
  let service: HomeAddsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeAddsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
