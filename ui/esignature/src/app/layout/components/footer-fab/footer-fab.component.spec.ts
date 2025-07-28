import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterFabComponent } from './footer-fab.component';

describe('FooterFabComponent', () => {
  let component: FooterFabComponent;
  let fixture: ComponentFixture<FooterFabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterFabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterFabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
