import {Component, computed, effect, EventEmitter, input, OnInit, Output, signal} from '@angular/core';
import {CalendarModule} from "primeng/calendar";
import {PaginatorModule} from "primeng/paginator";
import {NgIf} from "@angular/common";
import {DateRange, EventVideo} from "../../../../../service/model/event.model";
import {range, window} from "rxjs";
import dayjs from "dayjs";

@Component({
  selector: 'app-date-range-step',
  standalone: true,
  imports: [
    CalendarModule,
    PaginatorModule
  ],
  templateUrl: './date-range-step.component.html',
  styleUrl: './date-range-step.component.scss'
})
export class DateRangeStepComponent   {
  // Input signals
  dateRange = input.required<DateRange>();

  // Outputs
  @Output() datesChange = new EventEmitter<DateRange>();
  @Output() stepValidityChange = new EventEmitter<boolean>();

  // Date constraints
  minDate = new Date();
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  // Time controls - now computed from dateRange
  startTime = computed(() => {
    const start = this.dateRange().startDateTime;
    return start ? { hours: start.getHours(), minutes: start.getMinutes() } : { hours: 0, minutes: 0 };
  });

  endTime = computed(() => {
    const end = this.dateRange().endDateTime;
    return end ? { hours: end.getHours(), minutes: end.getMinutes() } : { hours: 0, minutes: 0 };
  });

  // Computed duration
  duration = computed(() => {
    const range = this.dateRange();
    if (!range.startDateTime || !range.endDateTime) return null;

    const start = dayjs(range.startDateTime);
    const end = dayjs(range.endDateTime);

    if (end.isBefore(start)) return 'Invalid range';

    const hours = end.diff(start, 'hour');
    const minutes = end.diff(start, 'minute') % 60;
    return `${hours}h ${minutes}m`;
  });

  constructor() {
    // Validate date range
    effect(() => {
      const range = this.dateRange();
      const isValid = range.startDateTime && range.endDateTime &&
        dayjs(range.endDateTime).isAfter(range.startDateTime);
      this.stepValidityChange.emit(!!isValid);
    });
  }

  // Handle date changes
  onDateChange(type: 'start' | 'end', date: Date): void {
    this.updateDateTime(
      type,
      date,
      type === 'start' ? this.startTime() : this.endTime()
    );
  }

  // Handle time changes
  onTimeChange(type: 'start' | 'end', field: 'hours' | 'minutes', value: number): void {
    const currentTime = type === 'start' ? this.startTime() : this.endTime();
    const updatedTime = { ...currentTime, [field]: value };

    const currentDate = type === 'start'
      ? this.dateRange().startDateTime
      : this.dateRange().endDateTime;

    if (currentDate) {
      this.updateDateTime(type, new Date(currentDate), updatedTime);
    }
  }

  // Helper to update date and time
  private updateDateTime(type: 'start' | 'end', date: Date, time: { hours: number, minutes: number }): void {
    const newDate = new Date(date);
    newDate.setHours(time.hours, time.minutes, 0, 0);

    this.datesChange.emit({
      ...this.dateRange(),
      [type === 'start' ? 'startDateTime' : 'endDateTime']: newDate
    });
  }

  formatDate(date: Date): string {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  }
}
