import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureHistoryComponent } from './signature-history.component';

describe('SignatureHistoryComponent', () => {
  let component: SignatureHistoryComponent;
  let fixture: ComponentFixture<SignatureHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
