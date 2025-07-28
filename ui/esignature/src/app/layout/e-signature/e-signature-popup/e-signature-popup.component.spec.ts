import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ESignaturePopupComponent } from './e-signature-popup.component';

describe('ESignaturePopupComponent', () => {
  let component: ESignaturePopupComponent;
  let fixture: ComponentFixture<ESignaturePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ESignaturePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ESignaturePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
