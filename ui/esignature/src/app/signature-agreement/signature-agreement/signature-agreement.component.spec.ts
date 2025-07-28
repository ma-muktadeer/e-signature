import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureAgreementComponent } from './signature-agreement.component';

describe('SignatureAgreementComponent', () => {
  let component: SignatureAgreementComponent;
  let fixture: ComponentFixture<SignatureAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureAgreementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
