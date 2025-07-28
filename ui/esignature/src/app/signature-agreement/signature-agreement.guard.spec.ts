import { TestBed } from '@angular/core/testing';

import { SignatureAgreementGuard } from './signature-agreement.guard';

describe('SignatureAgreementGuard', () => {
  let guard: SignatureAgreementGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SignatureAgreementGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
