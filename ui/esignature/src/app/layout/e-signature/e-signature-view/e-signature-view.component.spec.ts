import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ESignatureViewComponent } from './e-signature-view.component';

describe('ESignatureViewComponent', () => {
  let component: ESignatureViewComponent;
  let fixture: ComponentFixture<ESignatureViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ESignatureViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ESignatureViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
