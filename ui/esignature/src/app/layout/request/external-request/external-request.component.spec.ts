import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalRequestComponent } from './external-request.component';

describe('ExternalRequestComponent', () => {
  let component: ExternalRequestComponent;
  let fixture: ComponentFixture<ExternalRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
