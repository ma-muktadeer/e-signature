import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDownloadReportComponent } from './print-download-report.component';

describe('PrintDownloadReportComponent', () => {
  let component: PrintDownloadReportComponent;
  let fixture: ComponentFixture<PrintDownloadReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDownloadReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDownloadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
