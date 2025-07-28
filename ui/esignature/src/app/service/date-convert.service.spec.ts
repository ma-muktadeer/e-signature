import { TestBed } from '@angular/core/testing';

import { DateConvertService } from './date-convert.service';

describe('DateConvertService', () => {
  let service: DateConvertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateConvertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
