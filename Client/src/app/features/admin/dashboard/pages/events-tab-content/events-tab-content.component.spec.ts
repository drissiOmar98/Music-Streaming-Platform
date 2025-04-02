import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsTabContentComponent } from './events-tab-content.component';

describe('EventsTabContentComponent', () => {
  let component: EventsTabContentComponent;
  let fixture: ComponentFixture<EventsTabContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsTabContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsTabContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
