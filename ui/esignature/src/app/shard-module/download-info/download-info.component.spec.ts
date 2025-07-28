import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadInfoComponent } from './download-info.component';

describe('DownloadInfoComponent', () => {
  let component: DownloadInfoComponent;
  let fixture: ComponentFixture<DownloadInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
