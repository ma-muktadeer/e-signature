import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureReportComponent } from './signature-report.component';

describe('SignatureReportComponent', () => {
  let component: SignatureReportComponent;
  let fixture: ComponentFixture<SignatureReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
