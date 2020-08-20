import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Booking } from 'src/app/booking/shared/booking.model';
import { BookingService } from 'src/app/booking/shared/booking.service';
import { PaymentService } from '../../payment/shared/payment.service';
import * as moment from 'moment';
import { Review } from 'src/app/review/shared/review.model';

@Component({
  selector: 'hpi-manage-booking',
  templateUrl: './manage-booking.component.html',
  styleUrls: ['./manage-booking.component.scss'],
})
export class ManageBookingComponent implements OnInit {
  bookings: Booking[] = [];
  payments = [];

  constructor(
    private bookingService: BookingService,
    private paymentService: PaymentService,
  ) {}

  ngOnInit() {
    this.bookingService.getUserBookings().subscribe((data) => {
      this.bookings = data;
    });

    this.paymentService.getPendingPayments().subscribe((data) => {
      this.payments = data;
    });
  }

  getPendingPayments() {
    this.paymentService.getPendingPayments().subscribe(
      (payments: any) => {
        this.payments = payments;
      },
      () => {},
    );
  }

  acceptPayment(payment) {
    this.paymentService.acceptPayment(payment).subscribe(
      (json) => {
        payment.status = 'paid';
      },
      (err) => {},
    );
  }

  declinePayment(payment) {
    this.paymentService.declinePayment(payment).subscribe(
      (json) => {
        payment.status = 'declined';
      },
      (err) => {},
    );
  }

  isExpired(endAt: string) {
    const timeNow = moment();
    const end = moment(endAt);
    return end.isBefore(timeNow);
  }

  reviewPublished(bookingIndex: number, review: Review) {
    this.bookings[bookingIndex]['review'] = review;
  }
}
