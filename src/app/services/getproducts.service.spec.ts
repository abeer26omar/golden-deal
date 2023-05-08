import { TestBed } from '@angular/core/testing';

import { GetproductsService } from './getproducts.service';

describe('GetproductsService', () => {
  let service: GetproductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetproductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
