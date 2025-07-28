import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalSetupComponent } from './legal-setup.component';

describe('LegalSetupComponent', () => {
  let component: LegalSetupComponent;
  let fixture: ComponentFixture<LegalSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegalSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
