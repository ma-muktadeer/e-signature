import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleDocComponent } from './sample-doc.component';

describe('SampleDocComponent', () => {
  let component: SampleDocComponent;
  let fixture: ComponentFixture<SampleDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
