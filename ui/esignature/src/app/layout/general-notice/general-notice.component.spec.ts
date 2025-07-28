import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralNoticeComponent } from './general-notice.component';

describe('GeneralNoticeComponent', () => {
  let component: GeneralNoticeComponent;
  let fixture: ComponentFixture<GeneralNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralNoticeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
