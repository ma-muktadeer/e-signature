import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUnlockComponent } from './user-unlock.component';

describe('UserUnlockComponent', () => {
  let component: UserUnlockComponent;
  let fixture: ComponentFixture<UserUnlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserUnlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
