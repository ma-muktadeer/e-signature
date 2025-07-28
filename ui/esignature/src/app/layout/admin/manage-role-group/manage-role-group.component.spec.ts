import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRoleGroupComponent } from './manage-role-group.component';

describe('ManageRoleGroupComponent', () => {
  let component: ManageRoleGroupComponent;
  let fixture: ComponentFixture<ManageRoleGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRoleGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRoleGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
