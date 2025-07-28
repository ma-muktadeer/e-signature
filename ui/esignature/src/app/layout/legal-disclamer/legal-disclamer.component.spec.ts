import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalDisclamerComponent } from './legal-disclamer.component';

describe('LegalDisclamerComponent', () => {
  let component: LegalDisclamerComponent;
  let fixture: ComponentFixture<LegalDisclamerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegalDisclamerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalDisclamerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
