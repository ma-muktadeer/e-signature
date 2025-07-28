import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteRegiComponent } from './complete-regi.component';

describe('CompleteRegiComponent', () => {
  let component: CompleteRegiComponent;
  let fixture: ComponentFixture<CompleteRegiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteRegiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteRegiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
