import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureHistoryReportComponent } from './signature-history-report.component';

describe('SignatureHistoryReportComponent', () => {
  let component: SignatureHistoryReportComponent;
  let fixture: ComponentFixture<SignatureHistoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureHistoryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureHistoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
