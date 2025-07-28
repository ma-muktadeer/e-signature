import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureDownloadComponent } from './signature-download.component';

describe('SignatureDownloadComponent', () => {
  let component: SignatureDownloadComponent;
  let fixture: ComponentFixture<SignatureDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
