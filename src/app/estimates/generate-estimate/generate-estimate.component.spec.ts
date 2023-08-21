import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateEstimateComponent } from './generate-estimate.component';

describe('GenerateEstimateComponent', () => {
  let component: GenerateEstimateComponent;
  let fixture: ComponentFixture<GenerateEstimateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateEstimateComponent]
    });
    fixture = TestBed.createComponent(GenerateEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
