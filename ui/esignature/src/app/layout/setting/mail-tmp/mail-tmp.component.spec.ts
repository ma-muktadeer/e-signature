import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailTmpComponent } from './mail-tmp.component';

describe('MailTmpComponent', () => {
  let component: MailTmpComponent;
  let fixture: ComponentFixture<MailTmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailTmpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailTmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
