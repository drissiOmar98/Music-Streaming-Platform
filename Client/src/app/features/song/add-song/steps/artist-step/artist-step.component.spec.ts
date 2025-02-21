import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistStepComponent } from './artist-step.component';

describe('ArtistStepComponent', () => {
  let component: ArtistStepComponent;
  let fixture: ComponentFixture<ArtistStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
