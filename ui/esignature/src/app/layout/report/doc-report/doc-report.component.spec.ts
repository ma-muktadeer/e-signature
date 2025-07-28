import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocReportComponent } from './doc-report.component';

describe('DocReportComponent', () => {
  let component: DocReportComponent;
  let fixture: ComponentFixture<DocReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
