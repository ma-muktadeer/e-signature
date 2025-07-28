import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailTmpPopComponent } from './xmail-tmp-pop.component';

describe('MailTmpPopComponent', () => {
  let component: MailTmpPopComponent;
  let fixture: ComponentFixture<MailTmpPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailTmpPopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailTmpPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
