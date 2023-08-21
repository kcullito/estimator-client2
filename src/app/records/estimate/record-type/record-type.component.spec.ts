import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordTypeComponent } from './record-type.component';

describe('RecordTypeComponent', () => {
  let component: RecordTypeComponent;
  let fixture: ComponentFixture<RecordTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecordTypeComponent]
    });
    fixture = TestBed.createComponent(RecordTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
