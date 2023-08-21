import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateStatusComponent } from './estimate-status.component';

describe('EstimateStatusComponent', () => {
  let component: EstimateStatusComponent;
  let fixture: ComponentFixture<EstimateStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstimateStatusComponent]
    });
    fixture = TestBed.createComponent(EstimateStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
