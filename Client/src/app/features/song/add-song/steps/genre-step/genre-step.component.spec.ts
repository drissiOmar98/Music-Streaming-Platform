import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreStepComponent } from './genre-step.component';

describe('GenreStepComponent', () => {
  let component: GenreStepComponent;
  let fixture: ComponentFixture<GenreStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenreStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenreStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
