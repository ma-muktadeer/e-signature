import { TestBed } from '@angular/core/testing';

import { ESignatureGuard } from './e-signature.guard';

describe('ESignatureGuard', () => {
  let guard: ESignatureGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ESignatureGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
