import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { HelperService } from '../../../common/service/helper.service';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DaterangePickerComponent } from 'ng2-daterangepicker';

import { Booking } from '../../../booking/shared/booking.model';
import { Rental } from '../../shared/rental.model';
import { BookingService } from '../../../booking/shared/booking.service';
import { AuthService } from 'src/app/auth/shared/auth.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'hpi-rental-detail-booking',
  templateUrl: './rental-detail-booking.component.html',
  styleUrls: ['./rental-detail-booking.component.scss'],
})
export class RentalDetailBookingComponent implements OnInit {
  @Input() rental: Rental;

  @ViewChild(DaterangePickerComponent) private picker: DaterangePickerComponent;

  newBooking: Booking;
  modalReference: any;

  daterange: any = {};
  bookedOutDates: any[] = [];
  errors: any[] = [];

  options: any = {
    locale: { format: Booking.BOOKING_DATE_FORMAT },
    alwaysShowCalendars: false,
    opens: 'left',
    autoUpdateInput: false,
    isInvalidDate: this.checkDates.bind(this),
  };

  constructor(
    private helper: HelperService,
    private modalService: NgbModal,
    private bookingService: BookingService,
    private toastr: ToastrService,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    this.newBooking = new Booking();
    this.getBookedOutDates();
  }

  // check for invalid dates (dates already booked/dates prior current day)
  private checkDates(date) {
    return (
      this.bookedOutDates.includes(this.helper.getFormatDate(date)) ||
      date.diff(moment(), 'days') < 0
    );
  }

  // Get booked out dates
  private getBookedOutDates() {
    const bookings: Booking[] = this.rental.bookings;
    if (bookings && bookings.length > 0) {
      bookings.forEach((booking: Booking) => {
        const dateRange = this.helper.getBookingDateRange(
          booking.startAt,
          booking.endAt,
        );
        this.bookedOutDates.push(...dateRange);
      });
    }
  }

  // Add new booked out dates to bookedOutDates array
  private addNewBookedOutDates(bookingDetails: any) {
    const dateRange = this.helper.getBookingDateRange(
      bookingDetails.startAt,
      bookingDetails.endAt,
    );
    this.bookedOutDates.push(...dateRange);
  }

  // Reset dates on form after adding new booking
  private resetChosenDate() {
    this.picker.datePicker.setStartDate(moment());
    this.picker.datePicker.setEndDate(moment());
    this.picker.datePicker.element.val('');
  }

  // Get selected dates in the calender, calculate number of dates and total price
  selectedDate(value: any, datepicker?: any) {
    this.options.autoUpdateInput = true;
    this.newBooking.startAt = this.helper.getFormatDate(value.start);
    this.newBooking.endAt = this.helper.getFormatDate(value.end);
    this.newBooking.days = -value.start.diff(value.end, 'days');
    this.newBooking.totalPrice = this.newBooking.days * this.rental.dailyRate;
  }

  // Open booking confirmation modal
  openConfirmation(content) {
    this.errors = [];
    this.modalReference = this.modalService.open(content);
  }

  // Add a new booking
  addNewBooking() {
    this.newBooking.rental = this.rental;
    this.bookingService.addBooking(this.newBooking).subscribe(
      (bookingDetails: any) => {
        this.addNewBookedOutDates(bookingDetails);
        this.newBooking = new Booking();
        this.modalReference.close();
        this.resetChosenDate();
        this.toastr.success(
          'Booking successfully created! You can check the booking details in the manage section.',
          'Success!',
        );
      },
      (errorResponse: any) => {
        this.errors.push(errorResponse.error);
      },
    );
  }

  onPaymentConfirmation(token: any) {
    this.newBooking.paymentToken = token;
  }
}
