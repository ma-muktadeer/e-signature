import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigViewSetupComponent } from './sig-view-setup.component';

describe('SigViewSetupComponent', () => {
  let component: SigViewSetupComponent;
  let fixture: ComponentFixture<SigViewSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SigViewSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SigViewSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
