import { TestBed } from '@angular/core/testing';

import { InstitutionGuard } from './institution.guard';

describe('InstitutionGuard', () => {
  let guard: InstitutionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InstitutionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
