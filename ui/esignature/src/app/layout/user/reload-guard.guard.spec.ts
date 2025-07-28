import { TestBed } from '@angular/core/testing';

import { ReloadGuardGuard } from './reload-guard.guard';

describe('ReloadGuardGuard', () => {
  let guard: ReloadGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ReloadGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
