import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangeStepComponent } from './date-range-step.component';

describe('DateRangeStepComponent', () => {
  let component: DateRangeStepComponent;
  let fixture: ComponentFixture<DateRangeStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRangeStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateRangeStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
