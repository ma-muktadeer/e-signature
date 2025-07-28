import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ESignatureListComponent } from './e-signature-list.component';

describe('ESignatureListComponent', () => {
  let component: ESignatureListComponent;
  let fixture: ComponentFixture<ESignatureListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ESignatureListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ESignatureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
