import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrModuleReportComponent } from './hr-module-report.component';

describe('HrModuleReportComponent', () => {
  let component: HrModuleReportComponent;
  let fixture: ComponentFixture<HrModuleReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrModuleReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HrModuleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
