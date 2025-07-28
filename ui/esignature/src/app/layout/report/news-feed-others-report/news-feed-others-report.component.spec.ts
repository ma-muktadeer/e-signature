import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsFeedOthersReportComponent } from './news-feed-others-report.component';

describe('NewsFeedOthersReportComponent', () => {
  let component: NewsFeedOthersReportComponent;
  let fixture: ComponentFixture<NewsFeedOthersReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsFeedOthersReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsFeedOthersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
