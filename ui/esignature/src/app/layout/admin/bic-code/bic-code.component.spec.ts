import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BicCodeComponent } from './bic-code.component';

describe('BicCodeComponent', () => {
  let component: BicCodeComponent;
  let fixture: ComponentFixture<BicCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BicCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BicCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
