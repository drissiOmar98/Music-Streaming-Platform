import {CardEvent} from "./event.model";

export interface EventAttendanceRequest {
  eventId: number;
}

export interface EventAttendance {
  userId: string;
  eventId: number;
  eventDetails: CardEvent
}
