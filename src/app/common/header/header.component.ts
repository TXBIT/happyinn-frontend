import { Component } from '@angular/core';
import { AuthService } from '../../auth/shared/auth.service';
import { Router } from '@angular/router';
import { Booking } from 'src/app/booking/shared/booking.model';

@Component({
  selector: 'hpi-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  options: any = {
    locale: { format: Booking.BOOKING_DATE_FORMAT },
    alwaysShowCalendars: false,
    opens: 'right',
    autoUpdateInput: true,
  };

  constructor(public auth: AuthService, private router: Router) {}

  // log user out of the application
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  // search rentals by city
  search(city: string) {
    city
      ? this.router.navigate([`/rentals/${city}/homes`])
      : this.router.navigate(['/rentals']);
  }
}
