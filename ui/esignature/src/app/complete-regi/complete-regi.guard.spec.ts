import { TestBed } from '@angular/core/testing';

import { CompleteRegiGuard } from './complete-regi.guard';

describe('CompleteRegiGuard', () => {
  let guard: CompleteRegiGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CompleteRegiGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
