import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBicComponent } from './add-bic.component';

describe('AddBicComponent', () => {
  let component: AddBicComponent;
  let fixture: ComponentFixture<AddBicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
