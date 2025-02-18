import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosStepComponent } from './infos-step.component';

describe('InfosStepComponent', () => {
  let component: InfosStepComponent;
  let fixture: ComponentFixture<InfosStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfosStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfosStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
