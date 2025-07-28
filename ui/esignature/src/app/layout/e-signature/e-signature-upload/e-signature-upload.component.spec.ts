import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ESignatureUploadComponent } from './e-signature-upload.component';

describe('ESignatureUploadComponent', () => {
  let component: ESignatureUploadComponent;
  let fixture: ComponentFixture<ESignatureUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ESignatureUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ESignatureUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
