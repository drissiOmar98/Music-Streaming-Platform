import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoStepComponent } from './video-step.component';

describe('VideoStepComponent', () => {
  let component: VideoStepComponent;
  let fixture: ComponentFixture<VideoStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
