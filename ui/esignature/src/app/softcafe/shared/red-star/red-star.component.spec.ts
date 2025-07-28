import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedStarComponent } from './red-star.component';

describe('RedStarComponent', () => {
  let component: RedStarComponent;
  let fixture: ComponentFixture<RedStarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedStarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedStarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
