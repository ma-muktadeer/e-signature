import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonFileViewGridComponent } from './common-file-view-grid.component';

describe('CommonFileViewGridComponent', () => {
  let component: CommonFileViewGridComponent;
  let fixture: ComponentFixture<CommonFileViewGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonFileViewGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonFileViewGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
