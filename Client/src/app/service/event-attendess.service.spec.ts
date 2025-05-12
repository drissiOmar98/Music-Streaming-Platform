import { TestBed } from '@angular/core/testing';

import { EventAttendeesService } from './event-attendees.service';

describe('EventAttendessService', () => {
  let service: EventAttendeesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventAttendeesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
