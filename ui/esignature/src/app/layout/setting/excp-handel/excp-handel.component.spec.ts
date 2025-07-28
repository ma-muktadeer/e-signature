import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcpHandelComponent } from './excp-handel.component';

describe('ExcpHandelComponent', () => {
  let component: ExcpHandelComponent;
  let fixture: ComponentFixture<ExcpHandelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcpHandelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcpHandelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
