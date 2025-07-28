import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaReportComponent } from './pa-report.component';

describe('PaReportComponent', () => {
  let component: PaReportComponent;
  let fixture: ComponentFixture<PaReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
