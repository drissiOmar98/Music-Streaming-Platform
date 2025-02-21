import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsStepComponent } from './details-step.component';

describe('DetailsStepComponent', () => {
  let component: DetailsStepComponent;
  let fixture: ComponentFixture<DetailsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
