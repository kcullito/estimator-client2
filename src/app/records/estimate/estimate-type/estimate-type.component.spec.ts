import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateTypeComponent } from './estimate-type.component';

describe('EstimateTypeComponent', () => {
  let component: EstimateTypeComponent;
  let fixture: ComponentFixture<EstimateTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstimateTypeComponent]
    });
    fixture = TestBed.createComponent(EstimateTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
