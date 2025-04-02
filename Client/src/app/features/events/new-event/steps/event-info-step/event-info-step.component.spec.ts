import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventInfoStepComponent } from './event-info-step.component';

describe('EventInfoStepComponent', () => {
  let component: EventInfoStepComponent;
  let fixture: ComponentFixture<EventInfoStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventInfoStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventInfoStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
