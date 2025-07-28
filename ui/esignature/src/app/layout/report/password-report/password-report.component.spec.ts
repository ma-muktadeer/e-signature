import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordReportComponent } from './password-report.component';

describe('PasswordReportComponent', () => {
  let component: PasswordReportComponent;
  let fixture: ComponentFixture<PasswordReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
