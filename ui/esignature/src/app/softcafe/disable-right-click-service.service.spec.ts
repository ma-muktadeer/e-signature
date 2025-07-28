import { TestBed } from '@angular/core/testing';

import { DisableRightClickServiceService } from './disable-right-click-service.service';

describe('DisableRightClickServiceService', () => {
  let service: DisableRightClickServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisableRightClickServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
