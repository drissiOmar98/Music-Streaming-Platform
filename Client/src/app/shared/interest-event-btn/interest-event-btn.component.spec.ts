import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestEventBtnComponent } from './interest-event-btn.component';

describe('InterestEventBtnComponent', () => {
  let component: InterestEventBtnComponent;
  let fixture: ComponentFixture<InterestEventBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestEventBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestEventBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
