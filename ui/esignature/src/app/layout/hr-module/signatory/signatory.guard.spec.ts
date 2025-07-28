import { TestBed } from '@angular/core/testing';

import { SignatoryGuard } from './signatory.guard';

describe('SignatoryGuard', () => {
  let guard: SignatoryGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SignatoryGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
