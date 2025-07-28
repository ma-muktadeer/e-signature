import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementSetupComponent } from './agreement-setup.component';

describe('AgreementSetupComponent', () => {
  let component: AgreementSetupComponent;
  let fixture: ComponentFixture<AgreementSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgreementSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
