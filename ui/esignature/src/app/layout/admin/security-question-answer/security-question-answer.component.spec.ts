import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityQuestionAnswerComponent } from './security-question-answer.component';

describe('SecurityQuestionAnswerComponent', () => {
  let component: SecurityQuestionAnswerComponent;
  let fixture: ComponentFixture<SecurityQuestionAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityQuestionAnswerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityQuestionAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
