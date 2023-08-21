import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostTypeComponent } from './cost-type.component';

describe('CostTypeComponent', () => {
  let component: CostTypeComponent;
  let fixture: ComponentFixture<CostTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CostTypeComponent]
    });
    fixture = TestBed.createComponent(CostTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
