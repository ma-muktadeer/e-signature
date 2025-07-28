import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPopupComponent } from './request-popup.component';

describe('RequestPopupComponent', () => {
  let component: RequestPopupComponent;
  let fixture: ComponentFixture<RequestPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
