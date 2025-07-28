import { TestBed } from '@angular/core/testing';

import { SignatoryService } from './signatory.service';

describe('SignatoryService', () => {
  let service: SignatoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignatoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
