import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeTextComponent } from './tree-text.component';

describe('TreeTextComponent', () => {
  let component: TreeTextComponent;
  let fixture: ComponentFixture<TreeTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
