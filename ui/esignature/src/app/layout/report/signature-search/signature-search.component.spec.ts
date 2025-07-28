import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureSearchComponent } from './signature-search.component';

describe('SignatureSearchComponent', () => {
  let component: SignatureSearchComponent;
  let fixture: ComponentFixture<SignatureSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
