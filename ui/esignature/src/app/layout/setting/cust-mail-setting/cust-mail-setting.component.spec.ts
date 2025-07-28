import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustMailSettingComponent } from './cust-mail-setting.component';

describe('CustMailSettingComponent', () => {
  let component: CustMailSettingComponent;
  let fixture: ComponentFixture<CustMailSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustMailSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustMailSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
