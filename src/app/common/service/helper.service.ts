import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Booking } from '../../booking/shared/booking.model';

@Injectable()
export class HelperService {
  // Get date range with specific date format
  private getDateRange(startAt, endAt, dateFormat) {
    const dateArray = [];
    const momentEndAt = moment(endAt);
    let momentStartAt = moment(startAt);

    while (momentStartAt < momentEndAt) {
      dateArray.push(momentStartAt.format(dateFormat));
      momentStartAt = momentStartAt.add(1, 'day');
    }
    dateArray.push(moment(startAt).format(dateFormat));
    dateArray.push(momentEndAt.format(dateFormat));

    return dateArray;
  }

  // Format date
  private formatDate(date, dateFormat) {
    return moment(date).format(dateFormat);
  }

  // Get date range of a booking
  public getBookingDateRange(startAt, endAt) {
    return this.getDateRange(startAt, endAt, Booking.BOOKING_DATE_FORMAT);
  }

  // Get formatted booking date
  public getFormatDate(date) {
    return this.formatDate(date, Booking.BOOKING_DATE_FORMAT);
  }
}
