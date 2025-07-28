import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedReportComponent } from './logged-report.component';

describe('LoggedReportComponent', () => {
  let component: LoggedReportComponent;
  let fixture: ComponentFixture<LoggedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoggedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
